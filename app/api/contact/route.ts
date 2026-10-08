import { NextResponse } from "next/server";
import { getForms } from "@/lib/content";

type ContactRequestBody = {
  honeypot?: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
  agreePrivacy?: boolean;
  source?: string;
  utm?: Record<string, string>;
  referrer?: string;
  submittedAt?: string;
  [key: string]: unknown;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

// 인메모리 저장소: 서버리스 인스턴스마다 분리되어 완벽한 제한은 아니지만
// MVP 로컬 스텁 단계의 기본 방어선으로 충분하다.
const submissionsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionsByIp.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );
  timestamps.push(now);
  submissionsByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return /^0\d{8,10}$/.test(digits);
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return "****";
  return `${"*".repeat(digits.length - 4)}${digits.slice(-4)}`;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 },
    );
  }

  let body: ContactRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "잘못된 요청입니다." }, { status: 400 });
  }

  if (body.honeypot) {
    return NextResponse.json({ ok: true });
  }

  const forms = getForms();
  const requiredFields = forms.contact.fields.filter((field) => field.enabled && field.required);
  for (const field of requiredFields) {
    const value = body[field.name];
    const isEmpty =
      value === undefined ||
      value === null ||
      value === "" ||
      value === false ||
      (Array.isArray(value) && value.length === 0);
    if (isEmpty) {
      return NextResponse.json(
        { ok: false, message: `${field.label}은(는) 필수 입력 항목입니다.` },
        { status: 400 },
      );
    }
  }

  if (typeof body.phone === "string" && !isValidPhone(body.phone)) {
    return NextResponse.json(
      { ok: false, message: "연락처 형식을 확인해주세요." },
      { status: 400 },
    );
  }

  console.log("[contact] 상담 접수", {
    companyName: body.companyName,
    contactName: body.contactName,
    phone: typeof body.phone === "string" ? maskPhone(body.phone) : undefined,
    source: body.source,
    utm: body.utm,
    referrer: body.referrer,
    submittedAt: body.submittedAt,
    ip,
  });

  return NextResponse.json({ ok: true, message: forms.contact.successMessage });
}
