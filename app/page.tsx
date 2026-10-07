export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="text-sm uppercase tracking-widest text-text-muted">
        Project Scaffold
      </p>
      <h1 className="text-2xl font-semibold text-text">
        Next.js project initialized
      </h1>
      <p className="max-w-md text-sm text-text-muted">
        콘텐츠 스키마, 레이아웃, 섹션은 다음 단계에서 PRD.md 기준으로 추가됩니다.
      </p>
    </main>
  );
}
