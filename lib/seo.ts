// 배포 도메인이 확정되기 전까지 사용할 placeholder. 확정되면 .env.local에 NEXT_PUBLIC_SITE_URL을 설정한다.
const PLACEHOLDER_SITE_URL = "https://example.com";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? PLACEHOLDER_SITE_URL;
}
