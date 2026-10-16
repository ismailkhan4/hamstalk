/**
 * What a course is: the language it teaches, and every bit of that language the shared screens
 * need. Lesson content lives beside the course's config in content/courses/<id>/; the interface
 * itself stays in the learner's language (English for now).
 *
 * Ids: a course's lessons and units are globally unique. Every new course prefixes them with its
 * id (`it-a1-u1-l1`). German, the first course, keeps its original unprefixed ids (`a1-u1-l1`);
 * `courseOf()` in ./index.ts tells them apart.
 */
export type Course = {
  /** ISO 639-1 code, also the id prefix for this course's lessons (except German, see above). */
  id: string
  /** The language's name in English, e.g. "German". */
  language: string
  /** The language's name in itself, e.g. "Deutsch". */
  endonym: string
  /** BCP 47 tag for `lang` attributes on target-language text. */
  lang: string
  /** Locale for speech voices, sorting and case-folding. */
  locale: string
  /** Target-language phrases the shared screens use. */
  phrases: {
    /** Titles for a right answer, rotated so they don't repeat. */
    right: readonly string[]
    /** Combo cheers by length; from 10, every fifth uses `comboBig`. */
    combo: Readonly<Record<3 | 5 | 7, string>>
    comboBig: string
    /** Streak milestones; others fall back to `milestoneOther`. */
    milestones: Readonly<Record<number, string>>
    milestoneOther: string
    lessonDone: string
    reviewDone: string
    unitDone: (unit: number) => string
    greeting: (name: string) => string
    /** The "you are here" sign on the path's line map. */
    youAreHere: string
    /** A level's last stop on the line map, e.g. "Endstation". */
    terminus: string
    /** An unbuilt stretch of the line, e.g. "Baustelle" (construction site). */
    underConstruction: string
    /** The daily quests card, e.g. "Tagesplan" (plan for the day). */
    dailyPlan: string
    /** The shop where nuts are spent, e.g. "Vorrat" (Hamsti's store cupboard). */
    stash: string
    /** Lives, shown as a battery, e.g. "Akku". */
    akku: string
    /** Out of lives, e.g. "Akku leer". */
    akkuEmpty: string
    /** The weekly league, e.g. "Liga". */
    league: string
    /** Ten league divisions, lowest first, e.g. "Kreisliga" … "Bundesliga". */
    divisions: readonly string[]
    /** Week results: moved up, stayed, moved down. */
    promoted: string
    stayed: string
    relegated: string
    /** The end of the league week, e.g. "Abpfiff" (final whistle). */
    finalWhistle: string
  }
  /** The workplace story the course's lessons are set in. */
  world: { company: string; city: string }
  /**
   * The story's characters who pace league tables while there are few learners. ids match the
   * avatars and the list in leagues.sql (league_table).
   */
  pacers: readonly {
    id: string
    name: string
    initials: string
    role: string
  }[]
}
