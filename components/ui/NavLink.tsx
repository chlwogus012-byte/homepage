import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type NavLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

// 내부 경로(/로 시작)는 next/link로, 그 외(외부 URL·미확정 placeholder)는
// 일반 <a>로 렌더링한다. next/link는 "[...]" 형태의 href를 동적 라우트로
// 해석해 placeholder 값(예: "[카카오채널_URL]")에서 런타임 에러를 낸다.
export function NavLink({ href, className, children, ...rest }: NavLinkProps) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}
