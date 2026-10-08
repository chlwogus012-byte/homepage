@AGENTS.md

# CLAUDE.md

이 파일은 이 저장소에서 작업하는 Claude(Claude Code 등)를 위한 프로젝트 지침입니다.
**작업 전 반드시 `PRD.md`를 함께 읽고**, 둘이 충돌하면 PRD.md를 우선하되 충돌 사실을 사용자에게 알립니다.

---

## 1. 프로젝트 개요

- **무엇:** 종합 마케팅 회사 공식 홈페이지 (SEO 블로그, 네이버 플레이스, 퍼포먼스·바이럴·브랜드 마케팅)
- **누구를 위해:** 병·의원/한의원 원장, 소상공인 사장님, 중소기업 마케팅 담당자
- **핵심 목표:** 방문자를 **상담 접수(폼·카톡·전화)**로 전환
- **레퍼런스:** https://bunyangbonga.com/ — **구조·UX 흐름만 참고**. 로고·이미지·영상·카피 문장은 절대 복사하지 않는다.
- **현재 상태:** 방향 미확정. 카피·서비스·브랜드는 계속 바뀐다 → **콘텐츠와 코드 분리가 최우선 원칙**
- **소유자:** 최재현 (Jason). 한국어로 소통한다.

---

## 2. 절대 원칙 (Must)

1. **하드코딩 금지.** 화면에 보이는 문구·메뉴·숫자·서비스·사례·프로세스·FAQ·회사정보는 모두 `/content` 데이터 파일에서 읽는다. 컴포넌트 안에 한국어 카피를 직접 쓰지 않는다.
2. **데이터만 추가해서 페이지가 생겨야 한다.** 새 서비스/업종/사례는 `/content`에 항목을 추가하면 메뉴·페이지·사이트맵·메타태그가 자동 생성되어야 한다.
3. **메인 섹션은 데이터로 on/off·순서 변경**이 가능해야 한다 (`content/home.json`의 `sections[]`).
4. **미확정 값은 플레이스홀더**로 둔다: `[회사명]`, `[대표번호]`, `[TBD]`. 임의로 그럴듯한 회사명·전화번호·실적 수치를 지어내지 않는다.
5. **실제 고객사명·성과 수치를 창작하지 않는다.** 샘플 사례가 필요하면 `"샘플 사례 01"`처럼 명확히 샘플임을 표시하고 `isSample: true` 플래그를 단다.
6. **모바일 퍼스트.** 모든 UI는 모바일(~767px)부터 설계하고 확장한다.
7. **SSG/SSR 필수.** 네이버 크롤러 대응을 위해 핵심 콘텐츠가 JS 실행 없이 HTML에 포함되어야 한다.
8. **상담 동선은 어떤 변경에도 깨지면 안 된다.** 헤더 전화번호, 플로팅 위젯, 모바일 하단 CTA 바, 상담 폼은 모든 페이지에서 동작해야 한다.

---

## 3. 기술 스택

> PRD 8장의 권장안. 사용자가 다른 선택을 하면 이 섹션을 갱신한다.

| 영역 | 사용 |
|---|---|
| 프레임워크 | Next.js (App Router, TypeScript, SSG/ISR) |
| 스타일 | Tailwind CSS + `styles/tokens.css`의 CSS 변수 |
| 애니메이션 | Framer Motion (필요 시 GSAP) |
| 슬라이더 | Swiper |
| 콘텐츠 | `/content` 폴더의 JSON / MDX |
| 폼 | Next.js Route Handler → 저장(구글 시트 또는 Supabase) + 알림(이메일, 웹훅) — **MVP 단계는 로컬 스텁(콘솔 로그 + 성공 응답)으로 시작, 외부 연동은 결정 후 추가** |
| 호스팅 | Vercel |
| 패키지 매니저 | pnpm |

새 라이브러리 추가 전에는 **이유와 대안을 사용자에게 먼저 설명**한다. 같은 역할의 라이브러리를 두 개 넣지 않는다.

---

## 4. 폴더 구조

```
/app
  layout.tsx, page.tsx                메인
  /about/page.tsx
  /services/[slug]/page.tsx           서비스 공통 템플릿 (?tab= 지원)
  /industries/[slug]/page.tsx         업종 공통 템플릿
  /cases/page.tsx                     사례 목록 (필터)
  /cases/[slug]/page.tsx              사례 상세
  /process/page.tsx
  /contact/page.tsx
  /partnership/page.tsx
  /privacy, /terms, /sitemap
  /api/contact/route.ts
  /api/partnership/route.ts
  sitemap.ts, robots.ts
/components
  /layout     Header, MegaMenu, MobileMenu, Footer, FloatingWidget, MobileCtaBar, MarqueeBar
  /sections   Hero, Strengths, WorkMarquee, ServicesTabs, Industries, Channels,
              LogoWall, Stats, FeaturedCases, ProcessSteps, Reviews, ContactSection
  /ui         Button, Tabs, Accordion, Modal, Badge, Counter, Breadcrumb, SubHero
  /forms      ContactForm, PartnershipForm, PrivacyConsentModal
/content      ← 모든 텍스트·데이터 (아래 5장)
/lib          content 로더, 스키마(zod), 트래킹 헬퍼, 폼 유틸
/public       /images, /videos, /files/company-profile.pdf
/styles       tokens.css, globals.css
PRD.md, CLAUDE.md
```

> `src/` 디렉터리는 사용하지 않는다 (`/app`이 프로젝트 루트 바로 아래). `@/*` 경로 별칭은 프로젝트 루트를 가리킨다.

---

## 5. 콘텐츠 데이터 규칙

### 5.1 파일
| 파일 | 내용 |
|---|---|
| `content/site.json` | 회사명, 슬로건, 전화, 이메일, 주소, 사업자정보, SNS·카톡 URL, 소개서 경로, 마퀴 텍스트, 푸터 고지문 |
| `content/navigation.json` | 메뉴 트리 `{label, href, badge?, children?}` |
| `content/home.json` | 메인 섹션 배열 `{type, visible, order, data}` |
| `content/stats.json` | 공용 숫자 지표 (메인·About·사례 페이지 공유) |
| `content/services/*.json` | 서비스 1개 = 파일 1개 |
| `content/industries/*.json` | 업종 1개 = 파일 1개 |
| `content/cases/*.mdx` | 사례 1개 = 파일 1개 (frontmatter + 본문) |
| `content/process.json` | 운영 프로세스 단계 |
| `content/reviews.json` | 고객 후기 |
| `content/forms.json` | 폼 필드 정의 (`enabled`로 on/off), 완료 메시지, 동의 문구 |
| `content/legal/*.md` | 개인정보처리방침, 이용약관 |

### 5.2 규칙
- 모든 데이터는 `/lib/schema.ts`의 **zod 스키마로 빌드 시 검증**한다. 스키마 위반 시 빌드 실패가 정상이다.
- 데이터 구조를 바꿀 때는 **스키마 → 샘플 데이터 → 컴포넌트** 순서로 함께 수정하고, PRD 5.3의 모델과 달라지면 PRD도 갱신한다.
- 모든 목록 항목에 `visible`(노출 여부)과 `order`(정렬)를 둔다.
- 서비스·업종·사례에는 `seo: {title, description, ogImage?}` 필드를 둔다. 비어 있으면 기본값으로 대체한다.
- 사례의 `isAnonymous: true`이면 고객사 실명 대신 익명 표기("OO구 한의원")를 쓴다.
- 이미지 경로는 `/public` 기준 상대 경로. alt 텍스트는 데이터에 함께 저장한다.

### 5.3 사용자가 "문구 바꿔줘", "사례 추가해줘"라고 하면
→ **`/content` 파일만 수정**하는 것이 기본이다. 컴포넌트 수정이 필요하면 그 이유를 먼저 말한다.

---

## 6. 디자인 규칙

- 색·폰트·간격·라운드는 `styles/tokens.css`의 CSS 변수만 사용한다. 컴포넌트에 hex 값을 직접 쓰지 않는다.
- 기본 무드: 다크 배경 + 단일 포인트 컬러, 큰 타이포그래피, 영문 섹션 라벨(`Case Study` 등) + 한글 헤드라인. (라이트 시안 가능성 있음 → 토큰 교체만으로 전환 가능하게)
- 한글 폰트: Pretendard (`pretendard` npm 패키지의 variable woff2를 `next/font/local`로 셀프 호스팅). `word-break: keep-all` 기본 적용.
- CTA·링크에 `→`, `↗` 화살표 모티프를 일관되게 사용.
- 브레이크포인트: Mobile ~767 / Tablet 768–1279 / Desktop 1280+ (컨테이너 최대 1280px)
- 모바일: 본문 최소 15px, 터치 영역 44px 이상, 가로 스크롤 금지, 하단 CTA 바가 콘텐츠를 가리지 않도록 하단 여백 확보.
- 모든 모션은 `prefers-reduced-motion` 대응. 배경 영상은 모바일에서 포스터 이미지로 대체.
- 마퀴·롤링은 호버 시 일시정지, 숫자 카운터는 뷰포트 진입 시 1회만 실행.

---

## 7. 코딩 컨벤션

- TypeScript strict. `any` 사용 금지(불가피하면 주석으로 이유 명시).
- 컴포넌트: PascalCase 파일명, 함수형 컴포넌트, props 타입 명시.
- 기본은 서버 컴포넌트. 상호작용이 필요한 것만 `"use client"` (메가메뉴, 모달, 슬라이더, 폼, 필터, 카운터).
- 섹션 컴포넌트는 **props로만 데이터를 받고**, 직접 content 파일을 import하지 않는다 (로딩은 페이지/`/lib`에서).
- 공통 UI는 `/components/ui`에서 재사용. 비슷한 버튼·모달을 새로 만들지 않는다.
- 시맨틱 HTML: 페이지당 `h1` 1개, 랜드마크(`header/nav/main/footer`) 사용, 이미지 alt 필수.
- 접근성: 메가메뉴·모달·슬라이더 키보드 조작, 모달 포커스 트랩·ESC 닫기, 폼 라벨 연결.
- 이미지는 `next/image`, 영상은 `preload="none"` + `poster`.

---

## 8. 상담 폼 & 트래킹 (가장 중요한 기능)

- 상담 폼은 `/contact` 페이지와 전역 모달이 **같은 `ContactForm` 컴포넌트**를 쓴다.
- 기본 필수 필드는 4개만: 업체명, 담당자명, 연락처, 개인정보 동의. 나머지는 `forms.json`의 `enabled`로 제어.
- 연락처: 숫자만 허용, 자동 하이픈, 휴대폰/유선 형식 검증.
- 스팸 방지: 허니팟 필드 + IP당 제출 빈도 제한. 서버에서 반드시 재검증.
- 제출 데이터에 함께 저장: `source`(어느 페이지·버튼), UTM 파라미터, referrer, 제출 시각.
- 제출 성공 시: 저장 → 담당자 알림 → 완료 메시지 → 전환 이벤트 발송.
- **현재(MVP) 단계: 저장/알림은 로컬 스텁**(API Route에서 콘솔 로그 + 성공 응답만 반환). 구글시트/Supabase/Resend 등 실제 연동은 사용자 결정 후 추가.
- 비밀값(API 키, 웹훅 URL, 시트 ID)은 `.env.local`에만 두고 커밋하지 않는다. 필요한 변수는 `.env.example`에 키 이름만 기록한다.
- 트래킹은 `/lib/track.ts` 헬퍼 하나로 통일. 이벤트명:
  `click_phone`, `click_kakao`, `open_contact_modal`, `generate_lead`, `download_brochure`, `case_filter`, `case_view`
- 폼 로직을 바꾼 뒤에는 **정상 제출 / 필수값 누락 / 잘못된 번호 / 연속 제출** 4가지를 확인한다.

---

## 9. SEO 규칙

- 모든 페이지에 고유 `title`, `description`, `canonical`, OG 이미지(1200×630). `generateMetadata`로 데이터에서 생성.
- `app/sitemap.ts`, `app/robots.ts`는 `/content` 데이터에서 자동 생성 — 페이지 추가 시 손으로 편집하지 않는다.
- 구조화 데이터(JSON-LD): 전역 `Organization`/`LocalBusiness`, 서브페이지 `BreadcrumbList`, 사례 `Article`, FAQ `FAQPage`.
- URL은 영문 소문자 kebab-case slug. `?tab=` 페이지는 canonical을 정리한다.
- 네이버 서치어드바이저·구글 서치콘솔 인증 메타태그 값은 `site.json`에서 관리.

---

## 10. 명령어

```bash
pnpm install        # 의존성 설치
pnpm dev            # 개발 서버 (http://localhost:3000)
pnpm build          # 프로덕션 빌드 (콘텐츠 스키마 검증 포함)
pnpm lint           # ESLint
pnpm typecheck      # tsc --noEmit
```

작업을 마치기 전 `pnpm lint && pnpm typecheck && pnpm build`가 통과해야 한다.

---

## 11. 작업 방식

- **작업 단위를 작게.** 한 번에 한 섹션/한 페이지씩 만들고 확인받는다. PRD 10장의 MVP 컷(P0 항목)부터 진행한다.
- 큰 변경(폴더 구조, 데이터 스키마, 라이브러리 추가, 디자인 토큰 변경) 전에는 계획을 먼저 짧게 공유한다.
- 사용자가 결정하지 않은 사항(PRD 9장)은 임의로 확정하지 말고 플레이스홀더로 두거나 질문한다.
- 작업 후 보고는 짧게: 무엇을 바꿨는지, 어떤 파일인지, 사용자가 확인할 것(있으면).
- 결정이 내려지면 PRD.md 9장 표와 이 파일의 관련 섹션을 함께 갱신한다.

---

## 12. 하지 말 것 (Don't)

- 레퍼런스 사이트(분양본가)의 로고·이미지·영상·카피 문장·회사정보 복사
- 컴포넌트 안에 한국어 카피·전화번호·URL 하드코딩
- 실재하지 않는 고객사명·후기·성과 수치·언론 보도 창작 (샘플은 샘플로 표시)
- 의료 업종 콘텐츠에 효과 보장·치료 경험담·비교 우위 표현 등 **의료광고 규정 위반 소지 문구** 작성
- 개인정보 필드 임의 추가 (수집 항목이 바뀌면 개인정보처리방침·동의 문구도 함께 수정)
- `.env*` 비밀값 커밋, 콘솔에 개인정보 로그 출력
- 사용자 확인 없이 대규모 리팩터링·라이브러리 교체

---

## 13. 현재 진행 상황

> 작업이 진행될 때마다 갱신한다.

- [x] PRD.md v0.1 작성
- [x] CLAUDE.md 작성 (파일명 오타 `CLADE.md` → `CLAUDE.md` 수정, Next.js 자동생성 `@AGENTS.md` 임포트 병합)
- [ ] PRD 9장 미결정 사항 확정 (회사명, 포지셔닝, 서비스 라인업 등)
- [x] 프로젝트 초기 세팅 (Next.js 16 App Router + TypeScript + Tailwind v4 + pnpm, `styles/tokens.css` 디자인 토큰, Pretendard 셀프호스팅 폰트, 폴더 구조)
- [x] 콘텐츠 스키마 + 샘플 데이터 (`lib/schema.ts` zod 스키마, `lib/content.ts` 로더, `/content` 전체 샘플 데이터 — 사례·후기는 `isSample: true`로 명시)
- [x] 전역 레이아웃 (Header/MegaMenu/MobileMenu/Footer/FloatingWidget/MobileCtaBar — `/contact` 모달·폼은 다음 단계에서 연결)
- [x] 상담 폼 + 알림(로컬 스텁) + 트래킹 (`/contact` 페이지·전역 모달 공용 `ContactForm`, `/api/contact` 허니팟·IP 레이트리밋·마스킹 로그, `lib/track.ts`)
- [x] 메인 P0 섹션 (Hero/Strengths(Swiper)/ServicesTabs/Stats(카운트업)/FeaturedCases/ContactSection — `home.json` 기반 조립, `lib/schema.ts`에 섹션별 zod 스키마 구체화)
- [x] 서비스·사례·프로세스 템플릿 (`/services/[slug]`, `/cases`+필터, `/cases/[slug]`, `/process` — `SubHero`/`Breadcrumb`/`Accordion`/`CtaBanner`/`CaseCard` 공용 UI 추가)
- [ ] QA·SEO 등록 → 오픈
