# RSVP Decision Log

> 每一則產品層與技術層決策的完整紀錄，含取捨。PRD（`docs/PRD.md`）記「規格是什麼」，本檔記「為什麼是這樣」。
> 活文件：git commit 即版本紀錄。格式：`| 決策 | What | Why 與 Trade-off |`
>
> 維護者：Renata Jiang · 建檔：2026-07-10（回溯收錄 2026-04 起全部決策）

---

## 產品與範疇

| 決策 | What | Why 與 Trade-off |
|---|---|---|
| MVP 砍半：8 → 4 user stories（2026-04~05） | 原始規劃含通知、行事曆、自動篩選、audit 等 8 條 story，MVP 收斂為 register / review / status / check-in 四條 | MVP 要的是一條完整走通的 loop，不是功能數。犧牲豐富度，換取可如期交付的最小完整閉環；其餘明確標 deferred 而非 dropped |
| Business card 上傳移出 MVP（v0.3, 2026-06-06） | v0.1 表單含名片檔案上傳，v0.3 整項移除 | 避免 storage + RLS 附加複雜度；報名核心流程不依賴它。Phase 2 有真實需求再回來 |
| **Batch-only 審核模型（2026-06-09 pivot）** | v0.3 PRD（06-06）原規格是「單列 Approve/Reject 按鈕 + 批次操作」並存；實作前鎖定為 batch-only——無單列按鈕，勾選 1 筆即單筆操作（同一路徑） | 活動營運實況是「收一批、審一批」，逐列按鈕是想像出來的需求；單一寫入路徑讓 idempotent 邏輯只寫一次、狀態機更簡單。放棄單列快捷操作。**這是一次記錄在案的需求變更：PRD 定稿三天後推翻自己，理由與日期可回溯** |
| Check-in 整項移 Phase 2（2026-07-07） | RSVP-6（manual check-in + 之後的 QR scanner）自 MVP 移出 | Demo 對評審的 E2E 故事（報名→審核→狀態/QR）不需要 check-in 也完整；QR 已編碼 token 狀態頁 URL，未來 check-in 直接重用、後端零改動。犧牲 G4，保 100% 完成度 |
| Email 通知降級 backlog | 曾評估 Gmail SMTP 優於 Resend（免費額度與設定成本），隨後整項降入 Phase 2 | 通知在核心 loop 之外；先評估再降級，避免「做一半的整合」掛在 MVP 上 |
| Multi-event schema、single-event UI | `events` / `registrations` 自 day 1 分表，UI 只做單一活動 | 前期多 ~30 分鐘 schema 工，避免 Phase 2 加多活動時的痛苦 migration。放棄「更簡單的單表」 |
| Root 改為敘事著陸頁（RSVP-7, 2026-07-10） | root `/` 由 redirect `/register` 改為 story landing（原 Block 7 計畫升級：產品 landing → 敘事 landing） | 履歷 URL 一步呈現 judgment（評審 3 分鐘旅程）；放棄「root = 產品入口」慣例——本專案的「產品」對主要受眾（評審）而言是決策敘事本身 |
| Demo 後台唯讀 + GIF，互動 sandbox 降 Phase 2（RSVP-8, 2026-07-10） | 真 admin UI + 專用 demo 帳號 + RLS 層 deny-write；批次動作用 20 秒 GIF 呈現 | 8 成評審體驗、1/3 成本、零資料污染風險（多位評審同時操作不會互相改壞 seed）；與 check-in 降級同一條 scope 紀律。放棄「親手點批次核准」的完整體驗，面試回饋若證明需要再升級 |
| 公開產品文件進 repo `docs/`（2026-07-10） | PRD、decision log 遷入 repo；Notion 只留私人求職材料 | 「PRD 是活文件、git commit 即版本」只有文件住在 repo 才成立；評審同站看 code + docs。放棄 Notion 的編輯體驗與美觀 |
| 語言分層：story 中文、產品 UI 英文（2026-07-10） | 敘事層（root story page）中文 body + 英文術語；產品介面維持全英文 | 敘事受眾是台灣招聘方，judgment 傳達零折損；英文 UI 展示 modern B2B SaaS 慣例。放棄站內語言一致性，換受眾各取所需 |
| Hero 單一 CTA 直達 /register（2026-07-11） | story 頁唯一 CTA `Enter RSVP` 直接進產品，不捲頁內 demo 區 | 產品自信優先、少一步操作；接受「訪客可能略過後段敘事」的風險，由 nav 錨點與 S3 區內雙入口補位。曾評估「捲至頁內 demo 區」方案，PjM 拍板直達 |
| S3/S4 整併為「流程 × 決策」分鏡（2026-07-11） | 產品截圖為底圖＋拉線標註，流程步驟與對應決策配對呈現，共 4 組、3 次滑動切換 | 解決示意圖過多、流程與決策兩區內容重複的問題；讓「怎麼運作」與「為什麼這樣做」在同一視覺敘事裡互相印證 |
| Story 頁動效例外（2026-07-11） | §8.6「動效只用 shadcn default」新增 story 頁例外：僅允許 CSS fade/slide-in（IntersectionObserver 觸發） | 分鏡切換需要進場節奏；上限鎖在輕量宣告式動效，拒絕 sticky 捲動時序引擎——工程量與行動版風險不成比例 |
| Logo 統一為 RSVP（2026-07-11） | story 頁與產品 UI 的 logo 文字均用「RSVP」，移除「Demo」字樣 | demo 屬性由入口按鈕文案與 footer 免責聲明承擔；產品名乾淨。放棄「名稱即免責」的保守作法 |

## 流程與治理

| 決策 | What | Why 與 Trade-off |
|---|---|---|
| **Sprint v2 誠實關閉（0/4 shipped）** | Sprint v2（5/13–5/22）被既定出國行程（5/23–5/31）打斷，選擇如實以 0/4 關閉、開新 Sprint v3 標記 Recovery，而非回頭延長 v2 日期 | 回溯改 sprint 日期是 ScrumBut 反模式，會污染 velocity 數據、讓 retrospective 失去教學價值。犧牲「單一 sprint 看起來成功」，保 sprint 容器紀律 |
| PM × AI 決策邊界成文化（CLAUDE.md §3） | 決策層（scope / business rule / data model / UX trade-off）歸 PM；implementation detail 歸 Claude Code 自主，事後以 commit body 回報 | PM 注意力是稀缺資源，不被實作細節稀釋；同 junior engineer 授權模型，但邊界必須更明確——LLM 不會像人一樣 push back。每個 commit 附自主決策清單，權責可回溯 |
| 每 Task 一 commit，不合併 mega-commit | commit 粒度對應 PM 的工作拆解邏輯 | 犧牲 commit 數量的「乾淨」，換 repo review 時能讀出拆解思路 |
| 完成即凍結（M4 後, 2026-07-10） | RSVP-7/8 + docs 同步完成後專案凍結，僅面試實戰回饋驅動變更 | Portfolio 的職責是把人送進面試房間，不能替代面試表現；無限打磨 side project 是另一種逃避。收檔標準先寫死，防 scope 蔓延回頭吃掉求職時間 |

## 技術

| 決策 | What | Why 與 Trade-off |
|---|---|---|
| Token-scoped RPC 堵 PII 洞（2026-06-03） | 狀態頁不直讀 `registrations`；`SECURITY DEFINER` RPC（固定 `search_path`）只回單筆，撤銷 anon 整表 SELECT | 公開的 anon key 原本可以 dump 整份名單（姓名/email/電話）；多一層 RPC 與 grant 管理成本，換掉一個真實的 PII 外洩面 |
| RLS 是 enforcement boundary，proxy 只做 UX（2026-06-09） | `proxy.ts` 只負責未登入 → `/admin/login` redirect；權限強制全在 DB 層 RLS | Next.js 16 指引：proxy 管 routing 不管 auth。proxy 被繞過頂多看到空殼頁、撈不到資料。放棄「middleware 擋一層」的安全感錯覺 |
| Policy 必配 GRANT（anon saga 教訓） | row-level policy 存在但 table-level GRANT 缺失時，請求在 RLS 評估前就 401；migration 一律兩者同時寫 | 本 repo 踩過兩次的坑升級為規約；migration 前先 introspect（`pg_policies` + `information_schema`），不從文件圖推斷 schema |
| Grant 是 per-role 的（2026-07-07 教訓） | status RPC 原只 grant `anon`；登入中的 admin 開狀態頁時以 `authenticated` 身分執行 → 42501 被吞成 404，耗掉一整天 | 新增 RPC 時明確決定 grant 給哪些 role；error 必須 log、不可吞成 404。「同一頁 A 開得了 B 開不了」先問「誰登入了」 |
| Server Action 寫入路徑 + idempotent batch | 批次審核走 Server Action；只更新真正變動的列，same-status 為 no-op、可逆；`status_updated_at` 只在真轉換時由 app 層顯式寫入（不用 DB trigger） | 邏輯集中在可讀的 server code（public repo 可讀性），時間戳語意精確（「上次真實狀態變更」）。放棄 trigger 的「自動保險」，換行為透明 |
| QR = 含 token 的完整狀態頁 URL | QR 編碼 `/status/{token}` 完整 URL，client-side 以 `qrcode.react` 渲染 | 任何手機相機都能掃開（無需專用 app）；未來 scanner 直接重用同一 URL。放棄更短的自訂 payload |
| Token 用 nanoid（21 字元 URL） | 報名者不建帳號，以不可枚舉 token URL 自助查詢 | 消除 enumeration 風險 + 免掉 attendee 端 auth 整套成本；放棄「好記的短網址」 |
| zod 鎖 v3.25.76 | zod v4 與 `@hookform/resolvers` v5 不相容，pin 在 v3 | 版本鎖定寫進 CLAUDE.md，防 AI 或未來的自己「順手升級」踩雷 |
| status 配色單一對照常數 | `STATUS_STYLES` 一個常數管全部狀態視覺；`checked_in` 刻意不加，等 Phase 2 能顯示時才進 | 單一事實源防止散落的 hardcode；不為還沒上的功能預留死 code |
| Hosting：Netlify（非決策點） | 早期文件並列 Vercel / Netlify 兩個候選，實際部署走 Netlify（git-linked auto deploy），為唯一 production 目標 | 兩者對本專案功能等價（git-linked、preview deploy、免費額度都夠用），不構成真正的 trade-off，故未做正式評選。記錄在此是為了誠實：不是每個選擇都是決策，假裝它是反而稀釋真決策的份量 |

---

*對應：本表為 RJ_Interview_Materials 決策素材表的公開版。面試「講一個你做過的取捨」題型，優先取用粗體標記的兩則（batch-only pivot、Sprint v2 誠實關閉）。*
