-- 在 Supabase 後台的 「SQL Editor」 貼上並執行這段指令，
-- 用來建立存放使用者簽名跟字型偏好的資料表。

create table if not exists user_data (
  user_id uuid references auth.users(id) on delete cascade primary key,
  signatures jsonb default '[]'::jsonb,
  font_family text default 'Arial, sans-serif',
  font_size_pt int default 14,
  updated_at timestamptz default now()
);

-- 開啟 Row Level Security（列級安全性）：
-- 這一步是關鍵，沒有它的話，任何登入的使用者理論上都能讀到別人的資料。
alter table user_data enable row level security;

-- 規則：使用者只能讀取/寫入「自己」那一列資料
create policy "Users can view their own data"
  on user_data for select
  using (auth.uid() = user_id);

create policy "Users can insert their own data"
  on user_data for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own data"
  on user_data for update
  using (auth.uid() = user_id);
