import Link from "next/link";
import type { Site } from "@/lib/schema";
import { Container } from "@/components/ui/Container";

type FooterProps = {
  site: Site;
};

export function Footer({ site }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-base font-semibold text-text">{site.companyName}</p>
          <dl className="mt-3 flex flex-col gap-1 text-sm text-text-muted">
            <div>
              <dt className="inline">대표 </dt>
              <dd className="inline">{site.ceo}</dd>
            </div>
            <div>
              <dt className="inline">사업자등록번호 </dt>
              <dd className="inline">{site.businessNumber}</dd>
            </div>
            <div>
              <dt className="inline">주소 </dt>
              <dd className="inline">{site.address}</dd>
            </div>
            <div>
              <dt className="inline">전화 </dt>
              <dd className="inline">
                <a href={`tel:${site.phone}`}>{site.phone}</a>
              </dd>
            </div>
            <div>
              <dt className="inline">이메일 </dt>
              <dd className="inline">{site.email}</dd>
            </div>
          </dl>
          <div className="mt-4 flex gap-4 text-sm text-text-muted">
            <a href={site.kakaoChannelUrl} target="_blank" rel="noopener noreferrer">
              카카오채널
            </a>
            <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
              인스타그램
            </a>
            <a href={site.blogUrl} target="_blank" rel="noopener noreferrer">
              블로그
            </a>
          </div>
        </div>

        <nav aria-label="빠른 링크">
          <p className="text-sm font-semibold text-text">빠른 링크</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-text-muted">
            <li>
              <Link href="/contact">상담접수</Link>
            </li>
            <li>
              <a href={site.brochurePdf}>회사소개서</a>
            </li>
            <li>
              <a href={`tel:${site.phone}`}>{site.phone}</a>
            </li>
          </ul>
        </nav>

        <nav aria-label="법적 링크">
          <p className="text-sm font-semibold text-text">법적 고지</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-text-muted">
            <li>
              <Link href="/privacy">개인정보처리방침</Link>
            </li>
            <li>
              <Link href="/terms">이용약관</Link>
            </li>
          </ul>
        </nav>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-border py-6 text-xs text-text-muted md:flex-row md:items-center md:justify-between">
        <p>{site.footerNotice}</p>
        <div className="flex items-center gap-4">
          <p>
            © {year} {site.companyName}. All rights reserved.
          </p>
          <a href="#top" className="font-medium text-text">
            ↑ TOP
          </a>
        </div>
      </Container>
    </footer>
  );
}
