import Link from "next/link";
import { ArrowUp, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoEntryButton } from "@/components/story/demo-entry-button";
import { ScrollReveal } from "@/components/story/scroll-reveal";

// RSVP-7 story landing (copy locked via appendix A v2, Figma "Story landing
// / v3" — docs/handoffs/2026-07-10-story-landing.md). Root serves the story;
// the product entry lives at /register.

const REPO_URL = "https://github.com/r-khiong/rsvp-demo";
const GITHUB_PROFILE_URL = "https://github.com/r-khiong";
const LINKEDIN_URL = "https://www.linkedin.com/in/renatajiang";

const PAIN_POINTS = [
  "名單同時活在表單、試算表和 email 裡",
  "報名者查不到自己的狀態",
  "審核結果靠人工一封一封寄",
];

// Base images (public/story/state-N.png) arrive with chore-3; skeleton
// placeholders hold the slots until then.
const STORYBOARD = [
  {
    flow: "Register 訪客報名",
    decision: "8 → 4 → Phase 2（做小、做完）",
    asset: "state-1.png",
  },
  {
    flow: "Status link 自查狀態",
    decision: "Token-scoped RPC（撈不走名單）",
    asset: "state-2.png",
  },
  {
    flow: "Batch review 批次審核",
    decision: "Batch-only（定稿三天後推翻自己）",
    asset: "state-3.png",
  },
  {
    flow: "QR status 憑證就緒",
    decision: "0/4 誠實關閉 sprint（Recovery 如期 ship）",
    asset: "state-4.png",
  },
];

// Sprint backlog chip temporarily points at the PRD until the Jira capture
// lands in the repo (PjM will supply the asset).
const ARTIFACT_CHIPS = [
  { label: "PRD", href: `${REPO_URL}/blob/main/docs/PRD.md` },
  { label: "Decision log", href: `${REPO_URL}/blob/main/docs/decision-log.md` },
  { label: "Sprint backlog", href: `${REPO_URL}/blob/main/docs/PRD.md` },
  { label: "Code", href: REPO_URL },
  { label: "Live demo", href: "/register" },
];

const ROLE_TAGS = [
  "Scope · PM",
  "Business rules · PM",
  "Data model · PM",
  "UX trade-offs · PM",
  "Implementation · Claude Code",
  "邊界成文 · CLAUDE.md",
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

export default function Home() {
  return (
    <div id="top">
      {/* S0 Nav */}
      <header className="border-b">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4"
        >
          <div className="flex items-center gap-2 font-semibold">
            <CalendarCheck className="h-5 w-5" />
            <span className="text-lg">RSVP</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="#about" className="hover:underline">
              About
            </a>
            <Link href="/register" className="hover:underline">
              RSVP
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* S1 Hero */}
        <section
          aria-labelledby="hero-heading"
          className="bg-zinc-900 text-zinc-50"
        >
          <div className="mx-auto max-w-5xl space-y-6 px-6 py-16 lg:py-24">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
              S1 · Hero
            </p>
            <h1
              id="hero-heading"
              className="max-w-2xl text-3xl font-bold leading-snug"
            >
              &ldquo;Manage event RSVPs without the spreadsheet chaos.&rdquo;
            </h1>
            <Button asChild size="lg" variant="secondary" className="font-semibold">
              <Link href="/register">Enter RSVP</Link>
            </Button>
          </div>
        </section>

        {/* S2 About */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="scroll-mt-8 border-b"
        >
          <div className="mx-auto max-w-5xl space-y-8 px-6 py-16">
            <div className="space-y-3">
              <SectionLabel>S2 · About</SectionLabel>
              <h2 id="about-heading" className="text-xl font-semibold">
                一個痛點，一連串取捨
              </h2>
            </div>

            <ul className="grid gap-3 md:grid-cols-3">
              {PAIN_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground"
                  />
                  {point}
                </li>
              ))}
            </ul>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  WHY
                </h3>
                <p className="text-base leading-relaxed">
                  這是我在活動專案中親自體會的痛點。正因為接觸過從 Splash 到
                  Google Forms
                  的各式報名管理方式，我從中梳理出需求：一套讓專案裡每個角色——收件的、審核的、查狀態的——都能最快上手、方便管理的
                  RSVP 系統。
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  HOW
                </h3>
                <p className="text-base leading-relaxed">
                  想法成形後，我先把產品結構化：逐項列出希望達成的功能、劃分 scope
                  in/out；接著決定工具、產品外觀與 UIUX，把工作對焦成一個個 commit
                  的產出，與 Claude Code
                  協作完成實作。技術選擇的標準是一個人也能安全維運：Next.js +
                  Supabase，權限強制放在資料庫層 RLS，Netlify 部署、shadcn/ui
                  介面。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* S3 核心流程 × 決策（S4 已併入此區） */}
        <section aria-labelledby="flow-heading" className="border-b">
          <div className="mx-auto max-w-5xl space-y-10 px-6 py-16">
            <div className="space-y-3">
              <SectionLabel>S3 · 核心流程 × 決策</SectionLabel>
              <p id="flow-heading" className="text-sm text-muted-foreground">
                同一張產品底圖上，拉線標出「流程步驟 ×
                對應決策」；每次滑動切換一組，共 4 組 3 次滑動。
              </p>
            </div>

            <div className="space-y-12">
              {STORYBOARD.map((group, index) => (
                <ScrollReveal key={group.asset}>
                  <figure className="space-y-3">
                    {/* Slot for public/story/state-N.png (chore-3); skeleton until the capture lands. */}
                    <div
                      role="img"
                      aria-label={`分鏡素材準備中：${group.flow}`}
                      className="aspect-[16/10] w-full animate-pulse rounded-lg border bg-muted"
                    />
                    <figcaption className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm">
                      <span className="font-semibold">
                        {index + 1}. 流程｜{group.flow}
                      </span>
                      <span className="text-muted-foreground">
                        決策｜{group.decision}
                      </span>
                    </figcaption>
                  </figure>
                </ScrollReveal>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-start gap-3">
                <Button asChild size="lg" className="font-semibold">
                  <Link href="/register">Open live demo</Link>
                </Button>
                <DemoEntryButton />
              </div>
              <p className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
                On-site check-in — Phase 2（QR 已預留 token 介面，後端零改動可接）
              </p>
            </div>
          </div>
        </section>

        {/* S5 交付鏈與分工 */}
        <section aria-labelledby="chain-heading">
          <div className="mx-auto max-w-5xl space-y-6 px-6 py-16">
            <SectionLabel>S5 · 交付鏈與分工</SectionLabel>
            <h2 id="chain-heading" className="sr-only">
              交付鏈與分工
            </h2>
            <ul className="flex flex-wrap gap-2">
              {ARTIFACT_CHIPS.map((chip) => {
                const isExternal = chip.href.startsWith("http");
                const chipClassName =
                  "inline-flex rounded-full border px-3 py-1 text-sm font-medium transition-colors hover:bg-muted";
                return (
                  <li key={chip.label}>
                    {isExternal ? (
                      <a
                        href={chip.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={chipClassName}
                      >
                        {chip.label}
                      </a>
                    ) : (
                      <Link href={chip.href} className={chipClassName}>
                        {chip.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <ul className="flex flex-wrap gap-2">
              {ROLE_TAGS.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* S6 Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
          <p className="flex flex-wrap items-center gap-x-2">
            <span className="font-medium text-foreground">Renata Jiang</span>
            <span aria-hidden="true">·</span>
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
          </p>
          <p className="flex flex-wrap items-center gap-x-4">
            <span>Demo 資料均為虛構，不長期保存個資</span>
            <a
              href="#top"
              className="inline-flex items-center gap-1 font-medium hover:underline"
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
              Back to top
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
