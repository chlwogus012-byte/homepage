import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { CaseFrontmatter } from "@/lib/schema";

const STATUS_LABEL: Record<CaseFrontmatter["status"], string> = {
  ongoing: "진행중",
  done: "완료",
};

function formatPeriod(caseItem: CaseFrontmatter): string {
  if (caseItem.status === "ongoing") return `${caseItem.startDate} ~ 진행중`;
  return `${caseItem.startDate} ~ ${caseItem.endDate ?? ""}`;
}

type CaseCardProps = {
  caseItem: CaseFrontmatter;
  serviceLabels: Record<string, string>;
};

export function CaseCard({ caseItem, serviceLabels }: CaseCardProps) {
  return (
    <Link
      href={`/cases/${caseItem.slug}`}
      className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-primary"
    >
      <div className="relative aspect-[4/3] bg-background">
        <Image
          src={caseItem.thumbnail.src}
          alt={caseItem.thumbnail.alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2 py-1 text-xs font-medium text-text">
          {STATUS_LABEL[caseItem.status]}
        </span>
        {caseItem.isSample ? (
          <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2 py-1 text-xs font-medium text-text-muted">
            샘플 사례
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs text-text-muted">{caseItem.projectNo}</span>
        <h3 className="text-base font-semibold text-text">{caseItem.title}</h3>
        <p className="text-xs text-text-muted">
          {caseItem.industry}
          {caseItem.region ? ` · ${caseItem.region}` : ""} · {formatPeriod(caseItem)}
        </p>
        <div className="flex flex-wrap gap-1">
          {caseItem.services.map((slug) => (
            <Badge key={slug}>{serviceLabels[slug] ?? slug}</Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
