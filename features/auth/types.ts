export type AuthError = { title: string; message: string }

/** Actions either redirect (and never resolve) or report a problem the learner can act on. */
export type AuthActionResult = { ok: true } | { ok: false; error: AuthError }

export type AuthAction<Values> = (values: Values) => Promise<AuthActionResult>
