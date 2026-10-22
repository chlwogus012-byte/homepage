import type { MetadataRoute } from "next";
import { getCases, getServices } from "@/lib/content";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const staticRoutes = ["/", "/cases", "/process", "/contact", "/privacy", "/terms"].map((path) => ({
    url: `${siteUrl}${path}`,
  }));

  const serviceRoutes = getServices().map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
  }));

  const caseRoutes = getCases().map((caseItem) => ({
    url: `${siteUrl}/cases/${caseItem.slug}`,
  }));

  return [...staticRoutes, ...serviceRoutes, ...caseRoutes];
}
