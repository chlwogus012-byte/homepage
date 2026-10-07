import { z } from "zod";

// ---------- 공용 ----------
export const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
});

export const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

// ---------- site.json ----------
export const siteSchema = z.object({
  companyName: z.string(),
  companyNameEn: z.string(),
  slogan: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string(),
  businessNumber: z.string(),
  ceo: z.string(),
  kakaoChannelUrl: z.string(),
  kakaoChatUrl: z.string(),
  instagramUrl: z.string(),
  blogUrl: z.string(),
  brochurePdf: z.string(),
  marqueeText: z.string(),
  footerNotice: z.string(),
  naverSearchAdvisorVerification: z.string().optional(),
  googleSearchConsoleVerification: z.string().optional(),
});
export type Site = z.infer<typeof siteSchema>;

// ---------- navigation.json (재귀 트리) ----------
export type NavItem = {
  label: string;
  href: string;
  badge?: boolean;
  children?: NavItem[];
};
export const navItemSchema: z.ZodType<NavItem> = z.lazy(() =>
  z.object({
    label: z.string(),
    href: z.string(),
    badge: z.boolean().optional(),
    children: z.array(navItemSchema).optional(),
  }),
);
export const navigationSchema = z.array(navItemSchema);

// ---------- home.json ----------
// 섹션별 data의 세부 스키마는 섹션 컴포넌트를 만드는 다음 단계에서 구체화한다.
export const homeSectionTypeSchema = z.enum([
  "hero",
  "strengths",
  "gallery",
  "services",
  "industries",
  "channels",
  "logos",
  "stats",
  "cases",
  "process",
  "reviews",
  "contact",
]);
export const homeSectionSchema = z.object({
  type: homeSectionTypeSchema,
  visible: z.boolean(),
  order: z.number(),
  data: z.record(z.string(), z.unknown()),
});
export const homeSchema = z.object({
  sections: z.array(homeSectionSchema),
});

// ---------- stats.json ----------
export const statSchema = z.object({
  key: z.string(),
  label: z.string(),
  value: z.number(),
  suffix: z.string().optional(),
  description: z.string().optional(),
  // 실제 지표가 아직 확정되지 않은 임시값인 경우 true (PRD §9 항목 6)
  isPlaceholder: z.boolean().optional(),
});
export const statsSchema = z.array(statSchema);

// ---------- content/services/*.json ----------
export const serviceProcessStepSchema = z.object({
  title: z.string(),
  description: z.string(),
});
export const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});
export const serviceSchema = z.object({
  slug: z.string(),
  category: z.string(),
  title: z.string(),
  summary: z.string(),
  targetChecklist: z.array(z.string()),
  deliverables: z.array(z.string()),
  miniProcess: z.array(serviceProcessStepSchema),
  gallery: z.array(imageSchema),
  faq: z.array(faqItemSchema),
  seo: seoSchema,
  order: z.number(),
  visible: z.boolean(),
});
export type Service = z.infer<typeof serviceSchema>;

// ---------- content/industries/*.json ----------
export const industrySchema = z.object({
  slug: z.string(),
  title: z.string(),
  icon: z.string(),
  painPoints: z.array(z.string()),
  recommendedServices: z.array(z.string()),
  notes: z.string().optional(),
  seo: seoSchema,
  order: z.number(),
  visible: z.boolean(),
});
export type Industry = z.infer<typeof industrySchema>;

// ---------- content/cases/*.mdx ----------
export const caseResultSchema = z.object({
  label: z.string(),
  value: z.string(),
});
export const caseFrontmatterSchema = z.object({
  slug: z.string(),
  projectNo: z.string(),
  title: z.string(),
  isAnonymous: z.boolean(),
  // 실제 고객사가 아닌 예시 사례인 경우 true — 실적 수치 창작 금지 원칙 (CLAUDE.md §2-5)
  isSample: z.boolean().default(false),
  client: z.string().optional(),
  industry: z.string(),
  region: z.string().optional(),
  services: z.array(z.string()),
  status: z.enum(["ongoing", "done"]),
  startDate: z.string(),
  endDate: z.string().optional(),
  thumbnail: imageSchema,
  challenge: z.string(),
  strategy: z.string(),
  execution: z.object({
    text: z.string(),
    images: z.array(imageSchema),
  }),
  results: z.array(caseResultSchema),
  testimonial: z.string().optional(),
  featured: z.boolean(),
  visible: z.boolean(),
  seo: seoSchema.optional(),
});
export const caseSchema = caseFrontmatterSchema.extend({
  body: z.string(),
});
export type CaseFrontmatter = z.infer<typeof caseFrontmatterSchema>;
export type Case = z.infer<typeof caseSchema>;

// ---------- process.json ----------
export const processStepSchema = z.object({
  step: z.number(),
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});
export const processSchema = z.array(processStepSchema);

// ---------- reviews.json ----------
export const reviewSchema = z.object({
  industry: z.string(),
  author: z.string(),
  body: z.string(),
  rating: z.number().min(1).max(5).optional(),
  // 실제 후기가 아닌 예시인 경우 true — 후기 창작 금지 원칙 (CLAUDE.md §2-5)
  isSample: z.boolean().default(false),
  visible: z.boolean(),
});
export const reviewsSchema = z.array(reviewSchema);

// ---------- forms.json ----------
export const formFieldSchema = z.object({
  name: z.string(),
  type: z.enum([
    "text",
    "tel",
    "email",
    "select",
    "checkbox",
    "checkbox-group",
    "textarea",
  ]),
  label: z.string(),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  enabled: z.boolean(),
  maxLength: z.number().optional(),
});
export const formDefinitionSchema = z.object({
  fields: z.array(formFieldSchema),
  successMessage: z.string(),
  privacyText: z.string(),
});
export const formsSchema = z.object({
  contact: formDefinitionSchema,
  partnership: formDefinitionSchema,
});

// ---------- content/legal/*.md ----------
export const legalDocSchema = z.object({
  effectiveDate: z.string(),
  body: z.string(),
});
export type LegalDoc = z.infer<typeof legalDocSchema>;
