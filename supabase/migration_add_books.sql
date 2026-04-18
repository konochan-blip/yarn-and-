-- 書籍タブ追加マイグレーション
-- Supabase SQL Editor で実行してください

-- 書籍テーブル
CREATE TABLE books (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT        DEFAULT '',
  author     TEXT        DEFAULT '',
  publisher  TEXT        DEFAULT '',
  memo       TEXT        DEFAULT '',
  link       TEXT        DEFAULT '',
  img_url    TEXT        DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_books" ON books FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- works テーブルに book_ids を追加
ALTER TABLE works ADD COLUMN IF NOT EXISTS book_ids UUID[] DEFAULT '{}';
