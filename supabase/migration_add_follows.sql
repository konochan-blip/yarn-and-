-- ─── follows テーブル ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS follows (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id  UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id <> following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーは全 follows を読める（フォロー数表示のため）
CREATE POLICY "read_follows" ON follows
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- 自分としてのみフォローできる
CREATE POLICY "insert_follows" ON follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

-- 自分のフォローのみ削除できる
CREATE POLICY "delete_follows" ON follows
  FOR DELETE USING (auth.uid() = follower_id);


-- ─── profiles: 公開プロフィールを全員が読めるよう SELECT ポリシー追加 ───────
-- 既存の own_profile ポリシー（ALL）はそのままにして SELECT だけ追加
CREATE POLICY "read_public_profiles" ON profiles
  FOR SELECT USING (is_public = true);


-- ─── コンテンツテーブル: フォロー中の公開ユーザーのデータを読める ───────────
-- 既存の own_* ポリシーはそのまま。SELECT のみ追加（OR で結合される）

CREATE POLICY "read_followed_works" ON works
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM follows f
      JOIN profiles p ON p.user_id = works.user_id
      WHERE f.follower_id = auth.uid()
        AND f.following_id = works.user_id
        AND p.is_public = true
    )
  );

CREATE POLICY "read_followed_yarns" ON yarns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM follows f
      JOIN profiles p ON p.user_id = yarns.user_id
      WHERE f.follower_id = auth.uid()
        AND f.following_id = yarns.user_id
        AND p.is_public = true
    )
  );

CREATE POLICY "read_followed_tools" ON tools
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM follows f
      JOIN profiles p ON p.user_id = tools.user_id
      WHERE f.follower_id = auth.uid()
        AND f.following_id = tools.user_id
        AND p.is_public = true
    )
  );

CREATE POLICY "read_followed_books" ON books
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM follows f
      JOIN profiles p ON p.user_id = books.user_id
      WHERE f.follower_id = auth.uid()
        AND f.following_id = books.user_id
        AND p.is_public = true
    )
  );
