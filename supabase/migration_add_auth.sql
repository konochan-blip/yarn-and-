-- 既存のテーブルに認証を追加するマイグレーション
-- すでにテーブルが存在する場合はこちらを実行してください

-- user_id カラムを追加（既存データは一時的に NULL 許可）
ALTER TABLE yarns ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE works ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- ※ 既存データがある場合：Supabase Dashboard > Authentication > Users から
--   ユーザーの UUID を確認し、以下のように既存データを移行してください
-- UPDATE yarns SET user_id = 'your-user-uuid' WHERE user_id IS NULL;
-- UPDATE tools SET user_id = 'your-user-uuid' WHERE user_id IS NULL;
-- UPDATE works SET user_id = 'your-user-uuid' WHERE user_id IS NULL;
-- UPDATE shops SET user_id = 'your-user-uuid' WHERE user_id IS NULL;

-- NOT NULL 制約を追加（既存データ移行後に実行）
-- ALTER TABLE yarns ALTER COLUMN user_id SET NOT NULL;
-- ALTER TABLE tools ALTER COLUMN user_id SET NOT NULL;
-- ALTER TABLE works ALTER COLUMN user_id SET NOT NULL;
-- ALTER TABLE shops ALTER COLUMN user_id SET NOT NULL;

-- shops の UNIQUE 制約を変更
ALTER TABLE shops DROP CONSTRAINT IF EXISTS shops_name_key;
ALTER TABLE shops ADD CONSTRAINT shops_user_name_unique UNIQUE (user_id, name);

-- RLS 有効化
ALTER TABLE yarns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

-- ポリシー作成（既存のポリシーを一度削除してから再作成）
DROP POLICY IF EXISTS "own_yarns" ON yarns;
DROP POLICY IF EXISTS "own_tools" ON tools;
DROP POLICY IF EXISTS "own_works" ON works;
DROP POLICY IF EXISTS "own_shops" ON shops;

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

-- 新規ユーザー登録時のデフォルトお店作成トリガー
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO shops (user_id, name) VALUES
    (NEW.id, 'ユザワヤ'),
    (NEW.id, '楽天'),
    (NEW.id, 'Amazon')
  ON CONFLICT (user_id, name) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
