import type { SessionUser } from "./session"

export function firstName(user: SessionUser) {
  return user.fullName.split(/\s+/)[0] || user.email.split("@")[0] || "there"
}
