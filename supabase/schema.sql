-- YARN& App Schema（認証対応版）
-- Supabase の SQL Editor で実行してください

-- ──────────────────────────────────────────────────────
-- テーブル作成
-- ──────────────────────────────────────────────────────

CREATE TABLE yarns (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        DEFAULT '',
  color      TEXT        DEFAULT '',
  colorname  TEXT        DEFAULT '',
  material   TEXT        DEFAULT '',
  lot        TEXT        DEFAULT '',
  count      INTEGER     DEFAULT 0,
  price      TEXT        DEFAULT '',
  memo       TEXT        DEFAULT '',
  img_url    TEXT        DEFAULT '',
  shops      TEXT[]      DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tools (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        DEFAULT '',
  type       TEXT        DEFAULT '',
  size       TEXT        DEFAULT '',
  memo       TEXT        DEFAULT '',
  img_url    TEXT        DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE works (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        DEFAULT '',
  needle     TEXT        DEFAULT '',
  memo       TEXT        DEFAULT '',
  ref        TEXT        DEFAULT '',
  img_url    TEXT        DEFAULT '',
  yarn_ids   UUID[]      DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shops (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, name)
);

-- ──────────────────────────────────────────────────────
-- Row Level Security（自分のデータだけ読み書き可）
-- ──────────────────────────────────────────────────────

ALTER TABLE yarns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_yarns" ON yarns FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own_tools" ON tools FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own_works" ON works FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own_shops" ON shops FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────
-- 新規ユーザー登録時にデフォルトのお店を自動作成
-- ──────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO shops (user_id, name) VALUES
    (NEW.id, 'ユザワヤ'),
    (NEW.id, '楽天'),
    (NEW.id, 'Amazon');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ──────────────────────────────────────────────────────
-- Storage バケット（Supabase Dashboard > Storage で手動作成 or 以下を実行）
-- yarn-images バケットを public で作成し、認証ユーザーのみアップロード可にする
-- ──────────────────────────────────────────────────────

-- INSERT INTO storage.buckets (id, name, public) VALUES ('yarn-images', 'yarn-images', true);
--
-- CREATE POLICY "auth_upload" ON storage.objects FOR INSERT
--   TO authenticated WITH CHECK (bucket_id = 'yarn-images');
--
-- CREATE POLICY "public_read" ON storage.objects FOR SELECT
--   TO public USING (bucket_id = 'yarn-images');
--
-- CREATE POLICY "own_delete" ON storage.objects FOR DELETE
--   TO authenticated USING (bucket_id = 'yarn-images' AND auth.uid()::text = (storage.foldername(name))[1]);
