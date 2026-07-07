# CLAUDE.md

> 給 Claude Code 在這個 repo 工作時的 ground rules。Claude Code 啟動時自動讀取，每個 sub-task 不需重貼 context。
>
> 維護者：Renata Jiang (rj.khiong@gmail.com)
> 最後更新：2026-05-19

---

## 1. Project Context

### 1.1 這是什麼

RSVP-Demo 是一個自主發起的 SaaS Side Project，主題：活動報名管理系統。取代「主辦方用試算表 + email 手動管理活動報名」的痛點，提供：

- 報名者：表單填寫 → 等待審核 → 狀態查詢 → 現場簽到
- 主辦方：批次審核 → 名單管理 → 現場核對

### 1.2 為什麼存在

這個 repo 服務一個明確目標：作為 Project Manager（PjM）轉職軟體業的 portfolio。

**不是**要做產品 launch、**不是**要做 production-grade SaaS。

目標是用 PjM 視角 demonstrate：

- 完整 SDLC 走過一輪（PRD → User Flow → Sprint Backlog → Implementation → Deploy）
- 與 AI 工具協作的工作模式（PjM 主導決策、AI 處理 implementation layer）
- 對 modern B2B SaaS 視覺與 UX 慣例的理解

### 1.3 誰是 PjM

Renata Jiang（rj.khiong@gmail.com）。PM 背景 3.5 年（創意策展 / 大型展覽 / 國際科技客戶），現轉軟體 PjM。

**不寫 code 但理解技術 trade-off**。決策權劃分見 §3。

### 1.4 Hard deadline

Sprint v2 必須在 **2026-05-22 EOD** 前完成 deploy + demo URL ship。理由：5/23 出國，無法 push 後續修改。

---

## 2. Tech Stack Lockdown

以下版本與設定已鎖定，不再 propose 替代方案：

| Layer | Stack | 版本 | 重點慣例 |
|---|---|---|---|
| Framework | Next.js | 16.2.6 | App Router、`proxy.ts` 取代 `middleware.ts` |
| Runtime | React | 19.2.4 | Server Component 為 default、需要 interaction 才 `'use client'` |
| Type | TypeScript | 5.9.3 | strict mode、禁用 `any` |
| Styling | Tailwind CSS | v4.2.4 | CSS-first：用 `@theme` + CSS variables，沒有 `tailwind.config.ts` |
| Component | shadcn/ui | 3.x | CLI flag: `--template=next --preset=base-nova --base=radix` |
| Form | react-hook-form + zod + @hookform/resolvers | 最新穩定版 | 優先 uncontrolled FormData 模式 |
| Auth + DB | Supabase | 最新 | Client 用 Publishable key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)、Server-side 用 Secret |
| Hosting | Netlify | - | git-linked 自動部署、production deploy 唯一目標（見 §8.10） |
| Package mgr | pnpm | 10.33.0 | 不用 npm、yarn |
| Repo | GitHub | - | `r-khiong/rsvp-demo`、main branch、conventional commits |

### 2.1 已棄用的舊寫法（不要使用）

| 舊寫法 | 新寫法 | 理由 |
|---|---|---|
| `tailwind.config.ts` | `@theme` in `app/globals.css` | Tailwind v4 CSS-first |
| `middleware.ts` | `proxy.ts` | Next.js 16 命名變更 |
| Pages Router (`pages/`) | App Router (`app/`) | 專案用 App Router |
| Supabase `anon` / `service_role` key 命名 | `Publishable` / `Secret` | Supabase 2025 命名更新 |
| shadcn `style: new-york` 選項 | 用 `--preset=base-nova` flag 取代 | shadcn 3.x CLI 重構 |
| shadcn 互動式 base color (Neutral/Gray/Zinc) prompt | shadcn 3.x 已移除，採 preset default | shadcn 3.x CLI 重構 |

---

## 3. 決策邊界劃分（核心）

這個 repo 是 PjM × AI 協作。決策權必須清楚劃分。**PjM 注意力是稀缺資源，不該被 implementation detail 稀釋。**

### 3.1 Claude Code 自主決定（不需問 PjM，採業界 default）

- Library 版本選項與 CLI 參數（shadcn template/preset/base、Tailwind 設定、Next.js config）
- Styling 細節（base color、font、間距、border radius、動畫、icon size）
- Code structure（檔案組織、命名、import 順序、TS 型別細節）
- 套件 install 選項與相依版本（除非有 breaking change）
- 純技術相容性處理（如 Tailwind v4 與 shadcn 3.x 相容調整）
- 卡關 < 15 min 的 trial-and-error

### 3.2 必須先問 PjM（escalate 到 chat）

- **Scope 變動**：超出當前 user story AC 的功能（即便很小）
- **User flow 變動**：頁面流程、redirect 邏輯、狀態轉換
- **Business validation rules**：欄位規則、業務邏輯閾值
- **Data model 變動**：DB schema 改動、欄位增減、index 設計
- **UX trade-off**：error UI 方案、loading UX、empty state 樣式
- **Risk 識別**：卡關 > 30 min、相容性 dead-end、無法回頭的架構選擇

### 3.3 決策回報格式

完成 sub-task 時的 commit message 或 chat 回報中，用一行 bullet 列出本 sub-task 自主決定了哪些 implementation detail。不需要事前 propose options。

範例：

```
chore: init shadcn/ui with radix base (preset=base-nova)

Self-decided implementation details:
- CLI flags: --template=next --preset=base-nova --base=radix --no-monorepo
- Reused existing tw-animate-css from init
- Kept Geist Sans font binding in app/layout.tsx unchanged
```

---

## 4. Commit Convention

### 4.1 Format

Conventional commits：`<type>(<scope>): <subject>`

| Type | 用途 |
|---|---|
| `feat` | 新功能（影響 user-facing behavior） |
| `fix` | Bug fix |
| `refactor` | 不影響 behavior 的內部重構 |
| `chore` | 環境、設定、tooling、deps |
| `docs` | 文件變動 |
| `style` | 純樣式調整（無邏輯） |

Scope：對應 user story（如 `rsvp-3`）或 module（如 `auth`、`admin`）。

### 4.2 Granularity

**每 Task 一 commit**，不合併成 mega-commit。

理由：commit history 對應 PjM 工作拆解邏輯、面試 review repo 時可讀性高。

### 4.3 Commit message 寫法規約

- Subject 短句、現在式（`add`、`migrate`、`init`），不用過去式
- Body 列「Self-decided implementation details」bullet（見 §3.3）
- 若有 escalate 過給 PjM 的 decision，body 註記「PjM decision: <one line>」

---

## 5. 已知 risk / 踩過的坑

### 5.1 環境相容性

| Risk | 對應 | 應對 |
|---|---|---|
| shadcn 3.x CLI 完全重寫，舊互動 prompt 沒了 | 不問 base color、改用 `--template/--preset/--base` flag | Block A 已踩過，flag 已固定 |
| Tailwind v4 沒有 `tailwind.config.ts` | 用 `@theme` + CSS variables | shadcn 3.x 已適配 |
| Next.js 16 把 `middleware.ts` 改為 `proxy.ts` | admin route protection 用 `proxy.ts` | 寫 route guard 時注意 |
| Supabase 新 API key 命名（Publishable / Secret） | 不要用舊的 `anon` / `service_role` 命名 | .env.local 已對應 |
| Server Component 預設 vs `'use client'` | form 與 interactive UI 才加 `'use client'` | 寫 page 時 default 不加 |
| Supabase function/table grant 是 per-role：登入者（authenticated）與匿名（anon）跑同一頁行為可能不同 | 新增 RPC 時明確決定 grant 給哪些 role；「同一頁 A 開得了 B 開不了」先問「誰登入了」 | RSVP-5 已踩過：status RPC 只 grant anon，登入 admin 開 status 頁 42501 → 404，耗一整天（2026-07-06/07）；error 必須 log 不可吞成 404 |

### 5.2 工作流程

| Risk | 應對 |
|---|---|
| Plan Mode 對每個 implementation 維度都 escalate → 稀釋 PjM 注意力 | §3 決策邊界已劃分，implementation-only 自主決定 |
| 一個 prompt 包太多 scope → Claude Code 在 middle 卡或漏 AC | Sub-task 拆 ≤ 90 min unit、AC 列在 prompt 開頭 |
| 卡關 binge debug 而不 escalate | 30 min cap，超過立即停下回報 PjM |
| commit message body 聲稱「manual patch」但實際未存檔 | commit 前對該檔案做 grep / read verify，確認檔案內容與 commit body 聲明一致；tool permission failed 後必須重 retry，不可繼續往下走 |
| commit body 宣稱「跨 package 相容」但 tsc 未實際驗到 | 新裝跨層依賴（resolver / adapter / wrapper 類）後，在新 file 之外寫一個極簡引用點跑 tsc；確認跨 package 型別互通後再宣稱相容，不靠 single-file tsc pass 推論；對於資料層 SDK（supabase / prisma / orm 類），verify 必須包含一次 chain API 呼叫（如 `.from(table).insert()`），才能真正觸發其 type chain，光 import 模組不足 — 對應 Block C-1 踩坑：`import + void` verify 沒觸發 supabase-js v2 的 Database type chain，C-2 第一次寫 `.insert()` 才爆 `never[]` 推論失敗 |

---

## 6. 工作流程規約

### 6.1 Sub-task 啟動

PjM 在 chat 給 sub-task 指令，包含：

- Task ID + scope（如「RSVP-3 Block B Task 1: install RHF + zod」）
- Acceptance Criteria（明確、可驗證）
- 不在範圍清單（避免 Claude Code 越界）

Claude Code 收到後：

1. 進 Plan Mode → propose plan
2. PjM approve（plan 高品質時可自驗自過，見 §6.4）
3. 執行 → 自驗 DoD → commit + push

### 6.2 Definition of Done（每個 Task 適用）

- [ ] AC 列出的所有條目通過
- [ ] 沒有 build / type error
- [ ] dev server 跑得起來、target page 載入正常
- [ ] commit + push 完成
- [ ] commit message 含 self-decided implementation details bullet

### 6.3 Escalation 規則

下列情況立即停下、escalate 到 chat：

- 卡關 > 30 min
- Scope / business rule / data model 需要 PjM 判斷（見 §3.2）
- 相容性 dead-end（找不到解、要換方向）
- DoD 自驗失敗、需要 PjM 介入

### 6.4 Plan 自驗自過條件

Plan 同時符合以下三項時，Claude Code 可不等 PjM approve 直接執行：

- Scope 完全在當前 user story AC 內
- 不涉及 §3.2 任何項目（無 scope / business / data / UX trade-off 變動）
- Risk surface 已點出 ≥ 3 個並有 mitigation

不符合 → escalate 到 chat。

### 6.5 Block-level checkpoint

預設以 Block 為單位回 chat（不是每個 sub-task）：

- Block 啟動：PjM 給 Block scope
- Block 內 sub-task：Claude Code 自主跑、commit、push
- Block 結束：彙報 commits + self-decided details + open question

---

## 7. Sprint v2 Context

### 7.1 Sprint Goal

Ship demo URL：4 個 user story (RSVP-3 ~ RSVP-6) E2E 跑通 + Netlify production deploy + README + Repo public。

### 7.2 Task Backlog（剩餘）

| Task | Scope | Status |
|---|---|---|
| RSVP-3 | shadcn install + Supabase 串接 + validation + redirect + error UI + E2E | Done |
| RSVP-4 | admin auth + login + list + filter + batch approve/reject | Done |
| RSVP-5 | status page 三狀態 + QR generation + token 機制 + admin status 連結 | Done（2026-07-07 驗收） |
| RSVP-6 simplified | manual check-in + search + status badge + check-in API | Moved to Phase 2 backlog（PjM decision 2026-07-07） |
| Deploy & Polish | E2E + responsive + UI polish + Netlify deploy + README + Repo public | TODO |
| Portfolio sync | 履歷三平台補 demo URL + PRD v0.3 update | TODO |

### 7.3 不做的事（Phase 2 backlog，不在 Sprint v2 範圍）

- Email notification / SMS
- Automated filtering rules
- Calendar integration (.ics export)
- Audience definition automation
- Multi-language i18n
- Dark mode
- Check-in（manual check-in 與 real QR scanner 皆移入 Phase 2；QR 已預留 token 解析介面）
- Performance optimization
- SEO

**任何接近上述項目的 implementation impulse → 立即停下，不要做。**

### 7.4 Sprint Hard Deadline

2026-05-22 EOD（5/23 出國）。

---

## 8. Demo Quality Standards / Project-level DoD

### 8.1 功能完整度

- RSVP-3 ~ RSVP-6 四個 user story 全跑通
- E2E 流程（register → admin approve → status page → check-in）無斷點
- 任一頁面無 console error

### 8.2 UI 精緻度

- shadcn default styling 一致性維持
- 不混搭其他 design system
- 間距 / 字級 / 顏色 token 統一用 shadcn CSS variables
- 不出現 placeholder 級樣式（未對齊、未處理 overflow、未處理 long text）

### 8.3 Responsive

- Mobile (375px) / Tablet (768px) / Desktop (1280px) 三裝置驗證
- Form / table / QR display 不破版
- Split-screen layout 在 lg breakpoint 以下收成 single column

### 8.4 UX states

每個 interactive page 必須處理 5 states：

- loading（用 shadcn `<Skeleton>` 或 spinner）
- error（inline error message + 復原指引）
- empty（icon + 說明 + CTA）
- success
- disabled

Form 必有 inline validation feedback。

### 8.5 視覺 Reference 對焦

| Page | Reference |
|---|---|
| `/register` | shadcn ui Authentication example (split-screen layout) — https://ui.shadcn.com/examples/authentication |
| `/admin/registrations` | Linear-style minimal table + filter chips + batch action bar |
| `/status/[token]` | shadcn dashboard detail card pattern (single centered card) |
| `/admin/login` | shadcn ui Authentication example variant (single centered card 簡化版) |

### 8.6 Aesthetic 不變項

| 維度 | 規格 |
|---|---|
| 配色 | shadcn base-nova default（neutral + status semantic only），不自訂 brand color |
| Status semantic | Pending = warning (amber)、Approved = success (green)、Rejected = destructive (red)，用 shadcn 預定義 token |
| 字體 | Geist Sans（Next.js default），不換 |
| Typography hierarchy | `text-3xl` / `text-xl` / `text-base` / `text-sm` / `text-xs` 五級 |
| Font weight | `font-medium` / `font-semibold` / `font-bold`，不用 light |
| Spacing | `p-4` / `p-6` / `p-8` 三層、`space-y-2` / `4` / `6` / `8` 四層 |
| 容器寬度 | Form/Status `max-w-md` (448px)、Admin table `max-w-7xl` (1280px) |
| 邊框 | 0.5px solid、`rounded-lg`（不單側 border radius）|
| Icon | lucide-react、`h-4 w-4` / `h-5 w-5` 兩種 size、不用 emoji |
| 動效 | 只用 shadcn default（button hover、focus ring），不自製 animation |
| Mobile breakpoint | `lg` (1024px) — 以下 split-screen 收成 single column |

### 8.7 /register page 具體規格（已 PjM 決策）

- **Layout**：split-screen，desktop 左半深色 brand 區 + 右半 form 區
- **手機版**：左半 `hidden lg:flex` 隱藏，只顯示 form
- **左上 logo**：lucide `calendar-check` icon + "RSVP Demo" 文字
- **左下 quote**：`"Manage event RSVPs without the spreadsheet chaos."` — `r.khiong`
- **右上 nav**：暫時 placeholder 「Admin」文字（後續對應 RSVP-4 admin login 入口）
- **Form heading**：`Register for the event`
- **Form sub**：`Enter your details below to register`
- **Field**：4 欄位 Name / Email / Phone / Company (optional)
- **Submit**：`Submit registration`
- **Footer**：`By submitting, you agree this is a demo event. No real data is stored long-term.`

### 8.8 Deploy 標準

- Netlify production URL 可訪問（`r-khiong-rsvp-demo.netlify.app`）
- README 完整：problem / tech stack / live demo URL / local setup / roadmap / decisions log
- Repo public
- Demo data 預埋：至少 1 個 test event + 3 筆 test registration（涵蓋 pending / approved / rejected 三狀態）

### 8.9 不追求的（明確排除）

- Performance optimization（Lighthouse 分數）
- i18n（多語系）
- SEO meta tags
- 進階 a11y（追求 WCAG AA 但不追 AAA）
- Phase 2 backlog 功能（見 §7.3）

### 8.10 Deploy & env（Netlify）

- Hosting 是 **Netlify**（git-linked，push `main` 自動部署），非 Vercel。
- 必要 env（Netlify → Site settings → Environment variables，all deploy contexts 一致）：
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`（Supabase **publishable** key，`sb_publishable_…`）
  - 值需與本機 `.env.local` 一致。
- **關鍵坑**：`NEXT_PUBLIC_*` 是 **build-time 內嵌**進 browser bundle。改了 env 或輪換了 key **一定要重新 deploy** 才生效（Netlify → Deploys → **Clear cache and deploy site**）。
  - 症狀對照：頁面能開、表單能顯示，但送出 Supabase 請求全部失敗 → 通常是線上 bundle 內嵌了舊/失效的 key，重部署即解。env var「存在但值舊」時 `lib/supabase/env.ts` 不會 throw，所以頁面照常 render。

---

## 9. CLAUDE.md 維護

### 9.1 何時更新

- Sprint 結束 retrospective 時
- 踩到新 risk 需要記錄
- Tech stack 版本升級
- 決策邊界調整

### 9.2 不寫進來的內容

- 個人 schedule / capacity 規劃（PjM 個人材料，存 Notion）
- 面試準備 / Domain Knowledge cheat sheet（PjM 個人材料）
- 個別 user story 的 AC（每次 sub-task prompt 才貼）
- 商業敏感資訊（個人 email 除外）
