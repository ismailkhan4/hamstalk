"use client"

import { Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useTransition } from "react"

import { Input } from "@/components/ui/input"

import { searchLearnersAction } from "../actions"
import type { SearchResult } from "../model"
import { FollowButton } from "./follow-button"
import { InitialsBadge } from "./initials-badge"

/** Finds public profiles by handle or name, as you type. */
export function FriendSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [pending, startTransition] = useTransition()
  const searching = query.trim().length >= 2

  useEffect(() => {
    if (!searching) return
    const timer = setTimeout(() => {
      startTransition(async () => {
        setResults(await searchLearnersAction(query))
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [query, searching])

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="friend-search" className="font-bold">
        Find friends
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="friend-search"
          type="search"
          value={query}
          maxLength={40}
          autoComplete="off"
          placeholder="Name or @handle"
          className="pl-9"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {searching && results && (
        <ul aria-busy={pending} className="flex flex-col gap-2">
          {results.length === 0 && (
            <li className="text-sm font-semibold text-muted-foreground">
              {pending
                ? "Searching…"
                : "No one found. Private profiles don’t show up in search."}
            </li>
          )}
          {results.map((result) => (
            <li key={result.handle} className="flex items-center gap-3">
              <InitialsBadge name={result.displayName} />
              <Link
                href={`/u/${result.handle}`}
                className="min-w-0 flex-1 hover:underline"
              >
                <span className="block truncate font-bold">
                  {result.displayName}
                </span>
                <span className="block truncate text-sm font-semibold text-muted-foreground">
                  @{result.handle}
                </span>
              </Link>
              <FollowButton
                handle={result.handle}
                following={result.iFollow}
                size="sm"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
