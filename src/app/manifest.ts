import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Quran With Urwa",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FFF4E6",
    theme_color: "#FFF4E6",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
