import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  type CaseFrontmatter,
  type Industry,
  type LegalDoc,
  type NavItem,
  type Service,
  caseFrontmatterSchema,
  formsSchema,
  homeSchema,
  industrySchema,
  legalDocSchema,
  navigationSchema,
  processSchema,
  reviewsSchema,
  serviceSchema,
  siteSchema,
  statsSchema,
} from "./schema";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJson(relativePath: string): unknown {
  const filePath = path.join(CONTENT_DIR, relativePath);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function parseWithSchema<T>(
  schema: { parse: (value: unknown) => T },
  data: unknown,
  context: string,
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`콘텐츠 데이터 검증 실패 (${context}): ${message}`);
  }
}

function listFiles(dir: string, extension: string): string[] {
  const dirPath = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).filter((file) => file.endsWith(extension));
}

export function getSite() {
  return parseWithSchema(siteSchema, readJson("site.json"), "site.json");
}

export function getNavigation(): NavItem[] {
  return parseWithSchema(
    navigationSchema,
    readJson("navigation.json"),
    "navigation.json",
  );
}

export function getHome() {
  return parseWithSchema(homeSchema, readJson("home.json"), "home.json");
}

export function getStats() {
  return parseWithSchema(statsSchema, readJson("stats.json"), "stats.json");
}

export function getServices(): Service[] {
  return listFiles("services", ".json")
    .map((file) =>
      parseWithSchema(serviceSchema, readJson(`services/${file}`), `services/${file}`),
    )
    .filter((service) => service.visible)
    .sort((a, b) => a.order - b.order);
}

export function getService(slug: string): Service | undefined {
  return getServices().find((service) => service.slug === slug);
}

export function getIndustries(): Industry[] {
  return listFiles("industries", ".json")
    .map((file) =>
      parseWithSchema(
        industrySchema,
        readJson(`industries/${file}`),
        `industries/${file}`,
      ),
    )
    .filter((industry) => industry.visible)
    .sort((a, b) => a.order - b.order);
}

export function getIndustry(slug: string): Industry | undefined {
  return getIndustries().find((industry) => industry.slug === slug);
}

export function getCases(): (CaseFrontmatter & { body: string })[] {
  return listFiles("cases", ".mdx")
    .map((file) => {
      const filePath = path.join(CONTENT_DIR, "cases", file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content: body } = matter(raw);
      const frontmatter = parseWithSchema(
        caseFrontmatterSchema,
        data,
        `cases/${file}`,
      );
      return { ...frontmatter, body };
    })
    .filter((caseItem) => caseItem.visible)
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
}

export function getCase(slug: string) {
  return getCases().find((caseItem) => caseItem.slug === slug);
}

export function getProcess() {
  return parseWithSchema(processSchema, readJson("process.json"), "process.json").sort(
    (a, b) => a.step - b.step,
  );
}

export function getReviews() {
  return parseWithSchema(reviewsSchema, readJson("reviews.json"), "reviews.json").filter(
    (review) => review.visible,
  );
}

export function getForms() {
  return parseWithSchema(formsSchema, readJson("forms.json"), "forms.json");
}

export function getLegal(name: "privacy" | "terms"): LegalDoc {
  const filePath = path.join(CONTENT_DIR, "legal", `${name}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content: body } = matter(raw);
  return parseWithSchema(legalDocSchema, { ...data, body: body.trim() }, `legal/${name}.md`);
}
