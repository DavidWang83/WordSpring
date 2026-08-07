# voice-email-app (WordSpring)

口述內容 → 自動轉換成多語言、多語氣的商務書信，支援登入後雲端同步簽名檔與字型偏好。

## 專案結構

```
voice-email-app/
├── app/
│   ├── api/
│   │   ├── generate-email/route.ts   # 呼叫 OpenAI 生成三種語氣的書信
│   │   └── transcribe/route.ts       # 呼叫 Whisper 做語音轉文字
│   ├── lib/
│   │   ├── languages.ts              # 共用語言清單
│   │   └── supabaseClient.ts         # Supabase 用戶端初始化
│   ├── login/page.tsx                # Email 登入頁（Magic Link）
│   ├── layout.tsx
│   ├── page.tsx                      # 主頁面（需登入才能使用）
│   └── globals.css
├── supabase-setup.sql                # 建立 user_data 資料表用的 SQL，貼到 Supabase SQL Editor 執行
├── .env.local                        # 環境變數（金鑰欄位需自行填入，不會被 git 追蹤）
├── next.config.js
├── package.json
└── tsconfig.json
```

## 安裝與啟動

在專案根目錄下執行：

```bash
npm install
npm run dev
```

接著打開 http://localhost:3000

## 設定金鑰與環境變數

打開 `.env.local`，需要填三組值：

```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxx
```

- `OPENAI_API_KEY`：[platform.openai.com](https://platform.openai.com) 申請
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`：Supabase 專案後台 → **Settings → API** 頁面複製

⚠️ 改完 `.env.local` 一定要**重新啟動** `npm run dev`（Next.js 只有啟動時會讀取這個檔案）。

`.env.local` 已經被 `.gitignore` 排除，不會被上傳到 GitHub，請放心填入。

## Supabase 設定步驟

1. 到 [supabase.com](https://supabase.com) 建立一個新專案
2. 打開專案的 **SQL Editor**，貼上 `supabase-setup.sql` 的內容並執行，建立 `user_data` 資料表
3. 打開 **Authentication → URL Configuration**，把 `http://localhost:3000` 加進 **Redirect URLs**（不然本機測試時登入信裡的連結會導不回來）
4. 把 **Settings → API** 頁面的 Project URL 和 anon public key 填進 `.env.local`

登入方式是 **Email Magic Link**（免密碼）：使用者輸入 email → 收信 → 點連結登入。

## API Route 說明

- **POST `/api/generate-email`**
  body: `{ content: string, outLang: string, sttLang?: string }`（語言代碼見 `app/lib/languages.ts`）
  回傳三種語氣版本的信件（JSON），若口述語言與輸出語言不同會附上翻譯對照

- **POST `/api/transcribe`**
  multipart/form-data，欄位：`audio`（音檔）、`language`（選填，例如 "zh"）
  回傳 `{ text: string }`

## 已知限制

- 錄音功能依賴瀏覽器的 `MediaRecorder`，Safari 支援度較差，建議先以 Chrome / Edge 測試。
- `getUserMedia`（麥克風權限）只能在 `https://` 或 `localhost` 下運作，正式上線需要 HTTPS。
- 目前登入狀態的檢查只在前端頁面做，`/api/generate-email` 和 `/api/transcribe` 這兩支 API 本身沒有驗證使用者身分，理論上任何知道網址的人都能直接打這兩支 API。正式上線前建議加上伺服器端驗證（例如檢查 Supabase 的 session token）。
