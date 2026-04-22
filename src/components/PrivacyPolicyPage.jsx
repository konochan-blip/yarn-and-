export default function PrivacyPolicyPage({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'var(--bg)', overflowY: 'auto' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ position: 'sticky', top: 0, background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '14px 0', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button onClick={onClose} className="btn" style={{ padding: '6px 14px', fontSize: '13px', flexShrink: 0 }}>← 戻る</button>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: '16px', color: 'var(--text-primary)' }}>プライバシーポリシー</span>
        </div>

        <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', lineHeight: 1.9 }}>

          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '32px' }}>
            最終更新日：2026年4月23日
          </p>

          <Section title="1. はじめに">
            YARN&amp;（以下「本サービス」）は、ユーザーのプライバシーを尊重し、個人情報の適切な取り扱いに努めます。本プライバシーポリシーは、本サービスが収集する情報とその利用方法について説明します。
          </Section>

          <Section title="2. 収集する情報">
            <p>本サービスは以下の情報を収集します。</p>
            <ul>
              <li><strong>アカウント情報：</strong>メールアドレス、パスワード（暗号化して保存）</li>
              <li><strong>プロフィール情報：</strong>ユーザー名、ハンドル名、自己紹介文、アバター画像、リンクURL、お気に入りのお店</li>
              <li><strong>登録コンテンツ：</strong>毛糸・道具・書籍・作品のデータおよび画像</li>
              <li><strong>ソーシャル情報：</strong>フォロー・フォロワー関係</li>
              <li><strong>利用データ：</strong>作品へのYARN（いいね）情報</li>
            </ul>
          </Section>

          <Section title="3. 情報の利用目的">
            <p>収集した情報は以下の目的で利用します。</p>
            <ul>
              <li>本サービスの提供・運営・改善</li>
              <li>ユーザー認証およびアカウント管理</li>
              <li>公開プロフィールの表示・検索機能の提供</li>
              <li>お問い合わせへの対応</li>
              <li>不正利用の検知・防止</li>
            </ul>
          </Section>

          <Section title="4. 第三者への情報提供">
            <p>以下の場合を除き、収集した個人情報を第三者に販売・提供・開示することはありません。</p>
            <ul>
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく開示が必要な場合</li>
              <li>サービス提供に必要な業務委託先への提供（守秘義務を課した上で）</li>
            </ul>
          </Section>

          <Section title="5. 外部サービスの利用">
            <p>本サービスは以下の外部サービスを利用しています。それぞれのプライバシーポリシーが適用されます。</p>
            <ul>
              <li><strong>Supabase：</strong>データベース・認証・ストレージの提供（データはSupabaseのサーバーに保存されます）</li>
              <li><strong>Vercel：</strong>アプリのホスティング</li>
            </ul>
          </Section>

          <Section title="6. データの保管と安全性">
            <ul>
              <li>データはSupabaseのクラウドサーバーに保存されます</li>
              <li>パスワードは暗号化されて保存されます</li>
              <li>通信はSSL/TLSにより暗号化されます</li>
              <li>ただし、インターネット上の完全なセキュリティを保証するものではありません</li>
            </ul>
          </Section>

          <Section title="7. 公開情報について">
            プロフィールを「公開」に設定した場合、ユーザー名・自己紹介・アバター画像・作品・毛糸・道具・書籍データは、ログインしていない第三者を含む誰でも閲覧できる状態になります。公開範囲にご注意の上、設定をご管理ください。
          </Section>

          <Section title="8. ユーザーの権利">
            <p>ユーザーは以下の権利を有します。</p>
            <ul>
              <li>登録情報の確認・修正（アプリ内の編集機能から行えます）</li>
              <li>アカウントおよびデータの削除（退会機能から行えます）</li>
              <li>個人情報に関するお問い合わせ</li>
            </ul>
          </Section>

          <Section title="9. Cookieについて">
            本サービスは認証状態の維持のためにブラウザのローカルストレージおよびCookieを使用することがあります。広告目的でのトラッキングは行いません。
          </Section>

          <Section title="10. プライバシーポリシーの変更">
            本ポリシーは必要に応じて改定されることがあります。重要な変更がある場合はアプリ内でお知らせします。変更後も本サービスを継続してご利用いただいた場合、改定後のポリシーに同意したものとみなします。
          </Section>

          <Section title="11. お問い合わせ">
            プライバシーに関するお問い合わせは、アプリ内の「お問い合わせ」フォームよりご連絡ください。
          </Section>

        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid var(--border-light)' }}>
        {title}
      </h2>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.9 }}>
        {typeof children === 'string' ? <p>{children}</p> : children}
      </div>
    </div>
  )
}
