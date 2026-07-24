# RSVP Handoff — Story Landing + Demo Mode（Jul10）

> 交接對象：VS Code Claude Code（repo: `r-khiong/rsvp`, branch: main）
> 來源：2026-07-10 Cowork 對話（市場研究 + portfolio 策略收斂）
> 本文件建議 commit 進 repo：`docs/handoffs/2026-07-10-story-landing.md`

---

## 0. 本次變更的原由（為什麼做這個）

2026 年 PM 招聘市場現實：AI 讓「能動的 demo」不再稀缺，招聘方篩選的是 outcomes、judgment、visible artifacts。RSVP 的核心價值（決策紀錄、scope 紀律、SDLC artifact chain）目前全部位於面試官不可見的位置——90% 功能在 admin login 之後、PM 文件不在 repo 裡。面試官點開履歷 URL 只看到報名表單，3 分鐘內無法辨識作者的 judgment。

**這是呈現層問題，不是功能缺口。本次變更不新增產品功能，只新增「評審視角的可見性」。**

## 1. 最終目標（North Star，避免重工的錨點）

> 收到履歷的面試官點開 root URL，**3 分鐘內**看懂：這個產品解什麼問題、作者做過哪三個取捨、並能親手摸到成品（訪客報名 + 唯讀 admin demo），全程不需要任何口頭補充或帳密索取。

成效量測：Era 2（6/8 起，有 demo URL）vs Era 3（story landing 上線後）投遞回音率，以 Notion tracker 為權威。

**完成即凍結**：RSVP-7、RSVP-8、chore sync 三項完成後，專案進入凍結，僅由面試實戰回饋驅動變更。任何「順便再加」的 impulse → 停下（同 CLAUDE.md §7.3 紀律）。

## 2. 對焦差異清單（今日產出 vs repo 現況，逐項確認）

| # | 現況 | 差異/問題 | 處理 |
|---|------|----------|------|
| 1 | README Features 表：admin、QR 標「🔜 Roadmap」 | **過時且對外矛盾**——RSVP-4/5 已 Done 且 live（CLAUDE.md §7.2） | P0，chore 票立即修 |
| 2 | `app/page.tsx` root redirect `/register`，註解預告「Block 7 landing page」 | 今日 story landing = 既定 Block 7 的 scope 升級（產品 landing → 敘事 landing） | RSVP-7，決策記錄 scope 變更 |
| 3 | Check-in 已移 Phase 2（PjM decision 2026-07-07） | Story 頁流程圖**不可宣稱 check-in 已上線**；正確狀態：register / status token / batch review / QR status = Live，現場 check-in = Phase 2 | 文案已按此修正（附錄 A） |
| 4 | repo 無 `docs/`，PRD v0.3 update 是 pending TODO | PRD 不在 repo，artifact chain 斷鏈 | 新增 docs 遷移票（chore） |
| 5 | CLAUDE.md §1.4 hard deadline 2026-05-22 已過；§7 Sprint v2 已實質收尾 | Context 過時，新 session 會被誤導 | chore 票一併更新（開 §7A Sprint v3） |
| 6 | `supabase/seed.sql` 已有 7 筆三狀態擬真資料（3 pending / 2 approved / 2 rejected） | Demo 資料**不需重做**，RSVP-8 工程量縮小為「demo 帳號 + 唯讀 policy + 入口」 | RSVP-8 範疇已對應縮小 |
| 7 | Ticket 慣例為 RSVP-N + Block 制 | 原對話用 A–E 字母票號，不合慣例 | 已重編：RSVP-7 / RSVP-8 / chore |
| 8 | §8.6 Aesthetic 不變項（base-nova、Geist、無自訂色、lucide、無 emoji） | Story 頁必須遵守，不因是「敘事頁」而破例 | RSVP-7 AC 已納入 |
| 9 | §7.3 排除 i18n / SEO | Story 頁單語（中文 body + 英文 UI 術語），不做 SEO 強化 | 與既有排除一致，不衝突 |

## 3. 分工與文件同步（2026-07-10 更新：文件已定稿）

**分工原則：文件內容與 PM 決策在 Cowork 對話定稿；Claude Code 只做技術實作與 commit，不改寫文件內容。**

以下三份已在 Cowork 完成 review 與定稿（來源：PRD v0.3、README 舊版 06-03、RSVP-4 交接檔 06-09、現行 repo code 逐項核實），Claude Code 收到後為**純 commit 動作**：

| 檔案 | 動作 | Commit 建議 |
|---|---|---|
| `README.md` | 整檔取代（修正過時 Features 表、補回 PM Highlights、mermaid flow、docs 連結） | `docs: sync README to shipped state, restore PM highlights` |
| `docs/PRD.md` | 新增（PRD v0.4，含 v0.1–v0.4 changelog、RSVP-7/8、as-built 對齊） | `docs(prd): add PRD v0.4 — as-built realignment + RSVP-7/8` |
| `docs/decision-log.md` | 新增（全決策回溯收錄，含 07-10 四則新決策） | `docs: add decision log (2026-04 → present)` |

若 commit 時發現文件內容與 code 現況矛盾 → **不要自行改文件**，escalate 回 PjM（§3.2 慣例）。

文件位置決策：**公開產品文件一律進 repo `docs/`**（git commit 即版本紀錄，與 PRD 活文件慣例一致）；求職私人材料（tracker、面試素材）留 Notion，不混放。

## 4. 兩個關鍵取捨的差異分析（已含 PjM 傾向，最終由 Renata 拍板）

### 4a. Demo 後台：唯讀+GIF vs 互動 sandbox

| 維度 | 唯讀 + GIF（Phase 1，採用） | 互動 sandbox（Phase 2 候補） |
|------|---------------------------|------------------------------|
| 面試官體驗 | 看到真實後台、資料、篩選；批次動作由 20s GIF 傳達（約 8 成體驗） | 親手執行批次核准（完整體驗） |
| 工程量 | 1 migration + 入口 action + UI guard ≈ 2–3 hr | 另加重置 RPC + 重置入口 + 併發污染處理 ≈ 6–10 hr |
| 風險 | 近零（寫路徑被 RLS 封死） | 多位評審同時操作互相污染資料；seed token 狀態被改壞；濫用面擴大 |
| 敘事一致性 | 延續「RLS 為權限真正強制層」鎖定決策 | 需解釋重置機制，敘事變複雜 |
| 時程（5 hr/週） | 本週內 | 2–3 週 |

**採用唯讀 + GIF。** 與 check-in 降級 Phase 2 同一條 scope 紀律；「為什麼不做互動 demo」本身成為面試取捨素材。若面試回饋顯示需要，Phase 2 以「重置按鈕 + rate limit」方案升級。

### 4b. 文件載體：Git vs Notion

| 維度 | repo `docs/`（採用） | Notion 公開連結 |
|------|---------------------|-----------------|
| 版本證據 | commit history 即 artifact chain 證據 | 無 commit trail，改動無痕 |
| 評審動線 | 與 code 同站，不跳出 | 跳出 repo，動線斷 |
| 權限風險 | repo public 即全公開，狀態單一 | 分享權限易出包、連結易失效 |
| 編輯體驗 | Markdown，較陽春 | 佳 |

### 4c. 語言分層（已拍板：中文為主）

Story 頁 body 中文（受眾 = 台灣招聘方，judgment 敘事零折損）；產品 UI 維持英文（B2B SaaS 慣例展示）；決策/技術名詞保留英文原文（batch approval、RLS、token、SECURITY DEFINER）；頁面加一行說明「產品介面為英文」。

## 5. PRD 片段（併入 docs/PRD.md）

### RSVP-7 — Story Landing（root 敘事頁）

#### 問題
招聘方（收到履歷的用人主管/面試官）點開 demo URL 後，3 分鐘內無法辨識作者的 PM 判斷力：核心功能鎖在 login 後、決策文件不可見。直接壓低投遞回音率。

#### 範疇
- In scope: root `/` 一頁式敘事頁（hero / 問題 / 解法流程 / 三張決策卡 / artifact chain / AI 協作治理段 / 雙 CTA）、批次審核 GIF 嵌入、nav 調整（Story ↔ Register ↔ Admin 互通）
- Out of scope（延後理由）:
  - 互動 sandbox（見 §4a，Phase 2）
  - 雙語切換（§7.3 既有排除；受眾單一）
  - 頁面成效埋點（有價值但非必要，Phase 2）
  - SEO / OG image 強化（§8.9 既有排除）
  - Email 通知（維持 backlog，不因本功能復活）

#### User Story
作為收到履歷的面試官，我想要點開一個連結就在 3 分鐘內看懂產品解什麼問題、作者做過哪些取捨、並親手摸到成品，以便快速判斷這位候選人值不值得一次面試。

#### 驗收標準（DoD）
- [ ] 未登入訪客開 root，單頁捲動讀完問題/解法/三決策，≤2 次點擊進入報名流程或 Admin Demo
- [ ] 流程圖狀態正確：register / status token / batch review / QR status = Live；on-site check-in = Phase 2 標示
- [ ] 決策卡與 artifact 連結全部指向 repo 內真實檔案（migration、CLAUDE.md、docs/）
- [ ] 遵守 §8.6 aesthetic 不變項（base-nova token、Geist、lucide、無 emoji、無自訂 brand color）
- [ ] Mobile (375px) / Desktop (1280px) 不破版（§8.3）
- [ ] 5 states 處理不適用之處明確豁免（本頁為靜態敘事頁，僅 GIF lazy-load 需 loading 處理）
- [ ] 現有 `/register`、`/status/[token]`、admin 全流程不受影響
- [ ] 3 分鐘測試：一位非技術朋友 3 分鐘內說出「產品做什麼 + 任兩個決策」

#### 技術決策與 Trade-off
| 決策 | 選擇 | 為什麼 / 放棄了什麼 |
|---|---|---|
| 敘事層位置 | root `/` 取代 redirect，實現原 Block 7 | 履歷 URL 一步到位；放棄「root=產品入口」慣例——本專案的「產品」就是敘事本身 |
| 文件呈現 | 頁面放策展摘錄，全文連 GitHub docs/ | 3 分鐘旅程容不下全文；深讀者自會點連結 |
| 語言 | 中文 body + 英文 UI 術語 | 見 §4c |

### RSVP-8 — Demo Admin（唯讀模式）

#### 問題
面試官無帳密，看不到 admin 後台（本專案 90% 的工程與 UX 所在），只能「相信 README 的描述」。

#### 範疇
- In scope: demo admin 帳號（Supabase auth user）、RLS 唯讀 policy（deny UPDATE/DELETE for demo user，**資料庫層強制**）、story 頁一鍵進入（server action 登入 + redirect）、demo banner + 批次操作列 disabled 狀態
- Out of scope: 互動寫入與重置機制（Phase 2）、demo 專用獨立資料集（沿用現有 seed.sql 7 筆）

#### 驗收標準（DoD）
- [ ] Story 頁點「Enter Admin Demo」→ 免輸入帳密直達 `/admin/registrations`，看到 7 筆 seed 資料與篩選功能
- [ ] Demo 帳號嘗試任何寫入在 **RLS 層被拒絕**（用 SQL/console 直接驗證，不只驗 UI）
- [ ] Demo session 顯示 banner：`Demo mode (read-only) — batch actions disabled. Seeded demo data.`
- [ ] 批次操作列為 disabled 狀態（非隱藏——讓面試官知道功能存在）
- [ ] 正式 admin 帳號行為完全不受影響
- [ ] Demo 帳密只存 Netlify env（server-side），不進 client bundle

#### 技術決策與 Trade-off
| 決策 | 選擇 | 為什麼 / 放棄了什麼 |
|---|---|---|
| Demo 後台實作 | 真 admin UI + demo 帳號 + RLS 唯讀 policy | 延續「RLS 為權限真正強制層」；放棄假靜態快照頁（便宜但被識破即扣分） |
| 唯讀 vs sandbox | 唯讀 + GIF，sandbox 標 Phase 2 | 見 §4a 差異分析 |
| 批次列處理 | disabled 而非 hidden | 傳達「功能存在但 demo 受限」，並與 GIF 呼應 |

### 落 Sprint（建議順序與依賴）

| 票 | 內容 | 優先 | Blocked by |
|---|------|------|-----------|
| chore-1 | **commit 定稿文件**：README.md（取代）、docs/PRD.md（新增）、docs/decision-log.md（新增）——內容已定稿，見 §3，純 commit | **P0（先於一切，今天就 push）** | — |
| chore-2 | CLAUDE.md 更新：§1.4 deadline 過期移除、§7 Sprint v2 收尾改記 M4 Visibility context（參照 PRD v0.4 §6） | P1 | — |
| RSVP-8 | migration `2026xxxx_rsvp8_demo_admin_readonly.sql` + demo 帳號 + 入口 action + banner/disabled UI。**技術注意**：現行 `authenticated` UPDATE policy 是 `using(true)`（rsvp4 migration），demo 唯讀需以 **restrictive policy carve-out**（或重建帶排除條件的 policy）實作，且 policy 必配 GRANT 慣例不變 | P1 | — |
| RSVP-7 | root story 頁實作（文案見附錄 A，需 Renata 審定後定稿） | P1 | 文案定稿；demo CTA 需 RSVP-8 |
| chore-3 | 錄製批次核准 GIF（Renata 用正式帳號即可錄，與 RSVP-8 無依賴）→ `public/` 嵌入 | P2 | RSVP-7 頁面就位 |
| 收尾 | 履歷三平台 URL 從 `/register` 換 root、Era 3 量測開始 | P2 | 全部 |

## 6. 決策紀錄新增條目（記入 docs/decision-log.md + Interview_Materials 決策素材表）

| 決策 | What | Why 與 Trade-off |
|---|---|---|
| Root 改為敘事著陸頁 | root 由 redirect 改為 story landing，實現原 Block 7 並升級 scope | 履歷 URL 一步呈現 judgment；放棄產品入口慣例，因為 portfolio 的「產品」是決策敘事本身 |
| Demo 後台唯讀 + GIF（sandbox 降 Phase 2） | 真 admin UI + RLS deny-write demo 帳號；動作用 GIF 傳達 | 8 成體驗、1/3 成本、零污染風險；與 check-in 降級同一 scope 紀律 |
| 公開文件進 repo docs/ | PRD/decision log 遷入 repo，Notion 只留私人材料 | git commit 即版本證據，artifact chain 可驗；放棄 Notion 編輯體驗 |
| Story 頁中文、產品 UI 英文 | 敘事層與作品層語言分層 | 受眾（台灣招聘方）讀敘事零折損；保留英文 UI 展示 B2B SaaS 慣例；放棄語言一致性 |

## 7. 給 Claude Code 的執行規約提醒

- 決策邊界依 CLAUDE.md §3：本文件已含全部 PM 層決策，implementation detail 自主決定並照 §3.3 回報
- 疑似 scope 外的 impulse（SEO、動畫、i18n、互動 demo）→ 停下，§1「完成即凍結」為最高原則
- Migration 命名沿用時間戳慣例；conventional commits，scope 用 `rsvp-7` / `rsvp-8` / `docs`
- Sub-task 拆分 ≤ 90 min unit，AC 貼在 prompt 開頭（§5 的 DoD 直接取用）

---

## 附錄 A — RSVP-7 頁面文案 v1（❌ 已被文末「附錄 A v2」取代，留存決策軌跡用，勿依此實作）

> UI 元件標籤維持英文；正文中文；技術名詞不翻譯。§8.6 aesthetic 適用。

**Nav**：`CalendarCheck` icon + RSVP Demo ｜右側：`Register` `Admin Demo` `GitHub`

**Hero**
- H1：這不只是一個報名系統——是一條完整可驗的產品交付鏈
- Sub：從 PRD、user flow、sprint backlog 到 production 部署，由一位 PM 主導決策、與 AI 協作完成實作。往下捲三分鐘，看完整個判斷過程。
- 註記（text-sm, muted）：產品介面為英文；本頁為中文導讀。
- CTA：`Try the register flow` ／ `Enter Admin Demo (read-only)`

**Section 1 — 為什麼做這個**
管理 50 人以上活動的主辦方，至今仍用 Google 表單 + 試算表 + email 往返管理報名——沒有單一事實源、報名者無法自助查詢狀態、人工審核容易出錯。RSVP Demo 用一條真正的產品流程取代這件事：報名者自助查詢狀態，主辦方批次審核名單。（作者背景：3.5 年創意策展/大型展覽 PM，這是親手踩過的痛。）

**Section 2 — 核心流程**（四節點橫向流程，mobile 直排）
1. Register — 訪客填表報名（Live）
2. Private status link — 報名者以私有 token 連結自助查詢審核狀態（Live）
3. Batch review — 管理端批次核准/拒絕，無逐列按鈕（Live）
4. QR status — 狀態頁含 QR，供現場核對；掃碼報到為 Phase 2（Live / Phase 2 分標）

**Section 3 — 四個關鍵決策**（四張卡，每卡含 artifact 連結；2×2 grid，mobile 直排）

卡 1｜8 → 4：MVP 砍半，然後再砍一次
原始 PRD 有 8 條 user story，MVP 收斂為 4 條；check-in 後來又在技術可行的情況下主動移到 Phase 2——目標是 100% 完成一條核心 loop，不是堆功能。Trade-off：犧牲功能豐富度，換取零斷點的 E2E 與如期 ship。→ 連結：docs/decision-log.md

卡 2｜Batch-only：一次記錄在案的需求變更
PRD v0.3 定稿三天後，審核模型從「單列按鈕 + 批次」推翻為 batch-only——因為活動主辦方的真實節奏是「收一批、審一批」，逐列按鈕是想像出來的需求。變更的日期、理由、取捨全部可回溯。Trade-off：放棄單筆操作彈性，換取單一寫入路徑與更簡單的狀態機。→ 連結：decision log + admin actions 原始碼

卡 3｜Token-scoped RPC：堵住 PII 外洩
狀態頁不直接讀資料表，改走 `SECURITY DEFINER` RPC 只回傳單筆，並撤銷匿名整表 SELECT。Trade-off：多一層抽象與 grant 管理成本，換取「即使公開 anon key 也撈不走整份名單」。→ 連結：hardening migration

卡 4｜Sprint 被打斷時，選擇誠實記帳
Sprint v2 被既定行程打斷，以 0/4 shipped 如實關閉、另開 Recovery Sprint——而不是回頭改日期讓數字好看（ScrumBut 反模式會污染 velocity、讓 retro 失去意義）。Trade-off：犧牲單一 sprint 的「好看」，保整個流程數據的可信。→ 連結：docs/PRD.md §6

**Section 4 — 完整交付鏈與 AI 協作治理**
- Artifact chips：`PRD` `Decision Log` `Sprint Backlog` `Code` `Live Demo`（各連 docs/ 與 repo）
- 治理段：這個專案是「一人 PM + 兩個 AI 協作者」的分工：決策層（scope、business rule、data model、UX trade-off）歸 PM，implementation 層歸 Claude Code——如同帶一位 junior engineer，只是邊界必須更明確，因為 LLM 不會像人一樣 push back。邊界本身成文於 CLAUDE.md，每個 commit 附自主決策清單，權責可回溯。→ 連結：CLAUDE.md §3
- GIF：批次審核操作實錄（20 秒，lazy-load）

**Footer**
Renata Jiang ｜ GitHub ｜ LinkedIn ｜ Demo 資料均為虛構，不長期保存真實個資。

---

*本文件由 2026-07-10 Cowork 對話收斂產出。決策紀錄雙重用途提醒：§6 四則決策同步記入 Interview_Materials 決策素材表。*

---

## 附錄 A v2 — RSVP-7 頁面文案定稿（2026-07-11，依 Figma「Story landing / v3」）

> **文案唯一事實源。** 視覺依據：Figma file `RSVP` → frame `Story landing / v3`（含 Renata 編排後的分鏡素材）。
> 章節代號沿用 Figma 圖層命名（S4 已併入 S3；S5 保留原代號不重編，避免對照混亂）。
> 中文 body、英文 UI 術語；產品語言導讀句已刪除，不再出現。

**S0 Nav**：`CalendarCheck` icon + **RSVP**（不含 Demo）｜右側：`About`（錨點捲至 S2）·`RSVP`（→ /register）·`GitHub`（→ repo）

**S1 Hero**（深色區）
- 主標（維持引言樣式）：“Manage event RSVPs without the spreadsheet chaos.”
- 唯一 CTA：`Enter RSVP` → **直接前往 /register**（PjM decision 2026-07-11）
- 無自介段落、無語言導讀句

**S2 About**
- Label：`S2 · ABOUT`｜標題：**一個痛點，一連串取捨**
- 三個痛點膠囊（橫排，行動版直排）：
  1. 名單同時活在表單、試算表和 email 裡
  2. 報名者查不到自己的狀態
  3. 審核結果靠人工一封一封寄
- WHY / HOW 雙欄（文案為 Renata 定稿，一字不改）：
  - **WHY**：這是我在活動專案中親自體會的痛點。正因為接觸過從 Splash 到 Google Forms 的各式報名管理方式，我從中梳理出需求：一套讓專案裡每個角色——收件的、審核的、查狀態的——都能最快上手、方便管理的 RSVP 系統。
  - **HOW**：想法成形後，我先把產品結構化：逐項列出希望達成的功能、劃分 scope in/out；接著決定工具、產品外觀與 UIUX，把工作對焦成一個個 commit 的產出，與 Claude Code 協作完成實作。技術選擇的標準是一個人也能安全維運：Next.js + Supabase，權限強制放在資料庫層 RLS，Netlify 部署、shadcn/ui 介面。

**S3 核心流程 × 決策**（S4 已併入此區）
- Intro 一行：同一張產品底圖上，拉線標出「流程步驟 × 對應決策」；每次滑動切換一組，共 4 組 3 次滑動。
- 分鏡四組（底圖 = 產品截圖，拉線標註上下配對；輕量 scroll-in 進場）：
  1. 流程｜Register 訪客報名 × 決策｜8 → 4 → Phase 2（做小、做完）
  2. 流程｜Status link 自查狀態 × 決策｜Token-scoped RPC（撈不走名單）
  3. 流程｜Batch review 批次審核 × 決策｜Batch-only（定稿三天後推翻自己）
  4. 流程｜QR status 憑證就緒 × 決策｜0/4 誠實關閉 sprint（Recovery 如期 ship）
- 入口雙鈕：`Open live demo`（→ /register）·`Enter admin demo (read-only)`（→ RSVP-8 signInAsDemo action）
- Phase 2 條：On-site check-in — Phase 2（QR 已預留 token 介面，後端零改動可接）
- 動效上限：CSS fade/slide-in（IntersectionObserver 觸發），§8.6 例外已記入 decision log；禁 sticky 捲動時序

**S5 交付鏈與分工**
- Artifact chips ×5：`PRD` `Decision log` `Sprint backlog` `Code` `Live demo`（各連 repo docs/ 與站點）
- 分工 tags ×6：`Scope · PM`｜`Business rules · PM`｜`Data model · PM`｜`UX trade-offs · PM`｜`Implementation · Claude Code`｜`邊界成文 · CLAUDE.md`
- 無長段說明文（v1 的治理段落已 tag 化）

**S6 Footer**：左｜Renata Jiang · GitHub · LinkedIn；右｜Demo 資料均為虛構，不長期保存個資 + `↑ Back to top`

**連帶變更**：產品 UI 的 logo 文字（/register 左上、admin header）由「RSVP Demo」改為「RSVP」，與 story 頁一致。
