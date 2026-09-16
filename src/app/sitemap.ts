import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

const paths = [
  "",
  "/screen",
  "/about",
  "/compliance",
  "/strategy",
  "/contact",
  "/privacy",
  "/terms",
  "/risk",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return paths.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
