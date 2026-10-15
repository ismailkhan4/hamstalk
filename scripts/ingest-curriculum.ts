/**
 * Imports the registered lessons into public.exercises_pool. Run with Bun:
 *
 *   bun run curriculum:check              validate only, no database
 *   bun run curriculum:sql [--out FILE]   write the import as one SQL transaction
 *   bun run curriculum:ingest             apply that transaction with psql
 *   bun run curriculum:verify             compare the database with the source
 *
 * ingest and verify read SUPABASE_DB_URL, a direct or session-pooler Postgres connection string
 * for a trusted role (the project's postgres user). It is passed to psql through PG* environment
 * variables, never on the command line, and is never printed. Keep it out of the repository.
 */
import { spawnSync } from "node:child_process"
import { writeFileSync } from "node:fs"

import { lessons } from "@/content/courses/de/lessons/registry"
import {
  buildPoolRecords,
  parityReport,
  plannedLessonIds,
  storedRowSchema,
  type PoolRecord,
} from "@/features/lessons/pool/records"
import {
  ingestionSql,
  parseIngestionCounts,
  PARITY_QUERY,
} from "@/features/lessons/pool/sql"

class UsageError extends Error {}

function validated(): PoolRecord[] {
  const { records, issues } = buildPoolRecords(lessons)
  const planned = plannedLessonIds(lessons)
  const types = new Set(records.map((record) => record.exercise_type))

  console.error(`Lessons discovered:   ${lessons.length}`)
  console.error(`Exercises validated:  ${records.length}`)
  console.error(`Exercise types:       ${[...types].sort().join(", ")}`)
  console.error(
    `Planned, skipped:     ${planned.length} lessons without content`
  )
  console.error(`Errors:               ${issues.length}`)
  for (const issue of issues) {
    const where =
      issue.exercise === null
        ? issue.lessonId
        : `${issue.lessonId} exercise ${issue.exercise}`
    console.error(`  ${where}: ${issue.message}`)
  }
  if (issues.length > 0)
    throw new Error("The curriculum is invalid; nothing was written.")
  return records
}

function psqlEnv(): NodeJS.ProcessEnv {
  const raw = process.env.SUPABASE_DB_URL
  if (raw === "")
    throw new UsageError(
      "SUPABASE_DB_URL is set but empty. Run `unset SUPABASE_DB_URL` and set it again; an empty variable also hides --env-file."
    )
  if (!raw)
    throw new UsageError(
      "Set SUPABASE_DB_URL to the Postgres connection string (see docs/exercise-pool.md)."
    )
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new UsageError("SUPABASE_DB_URL is not a valid connection string.")
  }
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:")
    throw new UsageError("SUPABASE_DB_URL must start with postgresql://.")

  const local = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(
    url.hostname
  )
  return {
    NODE_ENV: process.env.NODE_ENV,
    PATH: process.env.PATH,
    PGHOST: url.hostname.replace(/^\[|\]$/g, ""),
    PGPORT: url.port || "5432",
    PGUSER: decodeURIComponent(url.username),
    PGPASSWORD: decodeURIComponent(url.password),
    PGDATABASE: decodeURIComponent(url.pathname.slice(1)) || "postgres",
    PGSSLMODE:
      url.searchParams.get("sslmode") ?? (local ? "prefer" : "require"),
    PGAPPNAME: "klarlingo-curriculum-ingest",
    PGCONNECT_TIMEOUT: "15",
  }
}

function psql(args: string[], input?: string) {
  const result = spawnSync(
    "psql",
    ["-X", "-q", "-At", "-v", "ON_ERROR_STOP=1", ...args],
    { env: psqlEnv(), input, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
  )
  if (result.error)
    throw new Error(`Could not run psql: ${result.error.message}`)
  if (result.status !== 0)
    throw new Error(
      `psql failed; nothing was committed.\n${result.stderr.trim()}`
    )
  return result.stdout
}

function sqlCommand(args: string[]) {
  const records = validated()
  const sql = ingestionSql(records)
  const at = args.indexOf("--out")
  if (at === -1) {
    process.stdout.write(sql)
    return
  }
  const file = args[at + 1]
  if (!file) throw new UsageError("--out needs a file name.")
  writeFileSync(file, sql)
  console.error(`Wrote ${file}`)
}

function ingestCommand() {
  const records = validated()
  const output = psql(["-f", "-"], ingestionSql(records))
  const counts = parseIngestionCounts(output.trim().split("\n").at(-1) ?? "")
  if (!counts)
    throw new Error(
      "The import ran but returned no counts; check the database."
    )

  console.error(`Rows inserted:        ${counts.inserted}`)
  console.error(`Rows updated:         ${counts.updated}`)
  console.error(`Rows unchanged:       ${counts.unchanged}`)
  console.error(`Rows unpublished:     ${counts.unpublished}`)
  if (counts.outsideImport > 0)
    console.error(
      `Published rows of lessons outside this import, left unchanged: ${counts.outsideImport}`
    )
  if (counts.written !== counts.inserted + counts.updated)
    throw new Error("Written rows do not match the counts; check the database.")
}

function verifyCommand() {
  const records = validated()
  const output = psql(["-c", PARITY_QUERY])
  let json: unknown
  try {
    json = JSON.parse(output)
  } catch {
    throw new Error("The database returned something other than JSON.")
  }
  const rows = storedRowSchema.array().safeParse(json)
  if (!rows.success)
    throw new Error("The database returned rows in an unexpected shape.")

  const report = parityReport(records, rows.data)
  console.error(`Rows in the database: ${rows.data.length}`)
  console.error(`Matching the source:  ${report.matching}`)
  console.error(`Differences:          ${report.differences.length}`)
  for (const difference of report.differences) console.error(`  ${difference}`)
  if (report.differences.length > 0)
    throw new Error("The database does not match the source curriculum.")
}

const [command, ...args] = process.argv.slice(2)
try {
  if (command === "check") validated()
  else if (command === "sql") sqlCommand(args)
  else if (command === "ingest") ingestCommand()
  else if (command === "verify") verifyCommand()
  else
    throw new UsageError(
      "Usage: ingest-curriculum.ts check | sql [--out FILE] | ingest | verify"
    )
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
