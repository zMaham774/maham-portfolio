import type { MetadataRoute } from "next";
import { PROJECTS } from "@/components/opening/projectsData";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: baseUrl, changeFrequency: "monthly", priority: 1 },
        ...PROJECTS.map((p) => ({
            url: `${baseUrl}/projects/${p.slug}`,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),
    ];
}