import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Klarlingo",
    short_name: "Klarlingo",
    description:
      "An open-source German course for software engineers joining a German-speaking team.",
    start_url: "/home",
    scope: "/",
    display: "standalone",
    background_color: "#f5f4ee",
    theme_color: "#105443",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}