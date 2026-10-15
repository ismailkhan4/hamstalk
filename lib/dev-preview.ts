export const devPreviewsEnabled =
  process.env.NODE_ENV !== "production" ||
  process.env.KLARLINGO_STYLEGUIDE === "1"
