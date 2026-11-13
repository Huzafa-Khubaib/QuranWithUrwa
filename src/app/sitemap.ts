import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const routes = [
    "",
    "/courses",
    "/fees",
    "/about",
    "/contact",
    "/book-demo",
    "/enroll",
  ];

  const now = new Date();

  return routes.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/book-demo" || path === "/enroll" ? 0.9 : 0.7,
  }));
}
