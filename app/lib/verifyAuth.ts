// app/lib/verifyAuth.ts
// 伺服器端用來驗證「這個 API 請求真的來自已登入使用者」的共用函式。
// 前端會在呼叫 /api/generate-email、/api/transcribe 時，把使用者的 Supabase
// access token 放進 Authorization header，這裡負責檢查那個 token 是否有效。

import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * 從 request 的 Authorization header 取出 token，向 Supabase 驗證是否為合法登入使用者。
 * 回傳 user 物件（驗證成功）或 null（沒有 token / token 無效或過期）。
 */
export async function getAuthedUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return null;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }
  return data.user;
}
