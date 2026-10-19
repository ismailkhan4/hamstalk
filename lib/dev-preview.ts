export const devPreviewsEnabled =
  process.env.NODE_ENV !== "production" ||
  process.env.HAMSTALK_STYLEGUIDE === "1"
