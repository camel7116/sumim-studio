import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { serviceAxes } from "@/content/services";
import { siteUrl } from "@/lib/metadata";

/** 사이트맵 (문서 §14.1). /thanks는 robots에서 제외되므로 포함하지 않는다. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/work`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects.map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${siteUrl}/services`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...serviceAxes.map((axis) => ({
      url: `${siteUrl}/services/${axis.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
