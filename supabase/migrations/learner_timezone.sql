-- The learner's IANA time zone, e.g. 'Europe/Berlin'. Daily goals and streaks count days in the
-- learner's own time, not the server's, so "today" ends at their midnight.
--
-- Set by the app from the browser (Intl.DateTimeFormat().resolvedOptions().timeZone) and validated
-- there against the runtime's zone list; the check here only keeps the column well-formed. Null
-- until the learner's browser first reports it.

alter table public.learner_preferences
  add column timezone text
    check (timezone is null or timezone ~ '^[A-Za-z][A-Za-z0-9_+-]*(/[A-Za-z0-9_+-]+){0,2}$');

comment on column public.learner_preferences.timezone is
  'IANA time zone reported by the learner''s browser. Days for goals and streaks are counted in it.';
