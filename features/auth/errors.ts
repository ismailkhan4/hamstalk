import type { AuthError } from "./types"

type SupabaseLikeError =
  { code?: string | undefined; status?: number | undefined } | null | undefined

const messages: Record<string, AuthError> = {
  invalid_credentials: {
    title: "That email and password don’t match",
    message: "Check for typos, or reset your password if you’ve forgotten it.",
  },
  over_email_send_rate_limit: {
    title: "Too many emails for now",
    message:
      "We’ve sent several emails to this address. Wait a few minutes, then try again.",
  },
  over_request_rate_limit: {
    title: "Too many attempts",
    message: "Wait a minute, then try again.",
  },
  weak_password: {
    title: "Choose a stronger password",
    message:
      "This password is too easy to guess or has appeared in a data breach. Try a longer one.",
  },
  same_password: {
    title: "That’s your current password",
    message: "Choose a password you haven’t used on Klarlingo before.",
  },
  signup_disabled: {
    title: "Sign-up is closed for now",
    message:
      "New accounts can’t be created at the moment. Please try again later.",
  },
  email_address_invalid: {
    title: "We can’t use this email address",
    message: "Check the address, or use a different one.",
  },
}

export const unexpectedError: AuthError = {
  title: "Something went wrong on our side",
  message: "Nothing you entered was lost. Try again in a moment.",
}

export const configurationError: AuthError = {
  title: "Sign-in isn’t set up yet",
  message:
    "This copy of Klarlingo isn’t connected to its account service. If you run it, check the Supabase settings.",
}

export function toAuthError(error: SupabaseLikeError): AuthError {
  if (error?.code && messages[error.code])
    return messages[error.code] as AuthError
  if (error?.status === 429)
    return messages.over_request_rate_limit as AuthError
  return unexpectedError
}
