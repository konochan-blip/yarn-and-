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
            最終更新日：2026年4月25日
          </p>

          <Section title="1. はじめに">
            YARN&amp;（以下「本サービス」）は、ユーザーのプライバシーを大切にし、個人情報の適切な取り扱いに努めます。本プライバシーポリシー（以下「本ポリシー」）では、本サービスが収集する情報とその利用方法についてご説明します。本サービスをご利用いただいた時点で、本ポリシーの内容に同意したものとみなします。
          </Section>

          <Section title="2. 収集する情報">
            <p>本サービスは、以下の情報を収集します。</p>
            <ul>
              <li><strong>アカウント情報：</strong>メールアドレス、パスワード（ハッシュ化して保存しており、運営者も原文を確認することはできません）</li>
              <li><strong>プロフィール情報：</strong>ユーザー名、ハンドル名（@ID）、自己紹介文、アバター画像、リンクURL、お気に入りのお店</li>
              <li><strong>登録コンテンツ：</strong>毛糸・道具・書籍・作品のデータおよび画像</li>
              <li><strong>ソーシャル情報：</strong>フォロー・フォロワー関係</li>
              <li><strong>利用データ：</strong>作品へのYARN（いいね）情報</li>
            </ul>
          </Section>

          <Section title="3. 情報の利用目的">
            <p>収集した情報は、以下の目的のみに利用します。</p>
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
              <li>ユーザーご本人の同意がある場合</li>
              <li>法令に基づき、行政機関・司法機関等から開示を求められた場合</li>
              <li>サービスの運営・提供に必要な外部サービス（Supabase・Vercel等）に対して、業務上必要な範囲で情報を提供する場合（これらの事業者には適切な情報管理を求めます）</li>
            </ul>
          </Section>

          <Section title="5. 外部サービスの利用">
            <p>本サービスは以下の外部サービスを利用しており、データの取り扱いにはそれぞれのプライバシーポリシーも適用されます。</p>
            <ul>
              <li><strong>Supabase：</strong>データベース・認証・ストレージの提供。ユーザーデータはSupabaseのサーバー（主に米国）に保存されます。そのため、データが日本国外のサーバーに保存・処理される場合があります</li>
              <li><strong>Vercel：</strong>アプリのホスティング（米国）</li>
            </ul>
            <p style={{ marginTop: '8px' }}>将来的にアクセス解析ツールや広告サービスを導入する場合は、あらかじめ本ポリシーにてお知らせします。</p>
          </Section>

          <Section title="6. データの保管と安全性">
            <ul>
              <li>データはSupabaseのクラウドサーバーに保存されます（主に米国）</li>
              <li>パスワードはハッシュ化されて保存されており、運営者を含め誰も原文を確認することはできません</li>
              <li>通信はSSL/TLSにより暗号化されています</li>
              <li>合理的なセキュリティ対策を講じていますが、インターネット上での完全な安全性を保証するものではありません</li>
            </ul>
          </Section>

          <Section title="7. 公開情報について">
            プロフィールを「公開」に設定した場合、ユーザー名・自己紹介・アバター画像・作品・毛糸・道具・書籍データは、ログインしていない方を含む誰でも閲覧できる状態になります。公開する情報の範囲をご確認の上、設定をご管理ください。
          </Section>

          <Section title="8. ユーザーの権利">
            <p>ユーザーはいつでも以下の操作を行うことができます。</p>
            <ul>
              <li>登録情報の確認・修正（アプリ内の編集機能から行えます）</li>
              <li>アカウントおよびデータの削除（退会機能から行えます）</li>
              <li>個人情報の取り扱いに関するお問い合わせ</li>
            </ul>
          </Section>

          <Section title="9. Cookie・ローカルストレージについて">
            本サービスでは、ログイン状態の維持や設定の保存のために、ブラウザのローカルストレージおよびCookieを使用することがあります。現時点では広告目的のトラッキングは行っていません。将来的に解析ツールや広告サービスを導入する際は、あらかじめ本ポリシーにてお知らせします。
          </Section>

          <Section title="10. 未成年の利用について">
            本サービスは年齢制限を設けていませんが、未成年の方がご利用になる場合は、保護者の方の同意を得た上でご利用ください。
          </Section>

          <Section title="11. プライバシーポリシーの変更">
            本ポリシーは必要に応じて改定されることがあります。重要な変更がある場合はアプリ内でお知らせするよう努めます。変更後も本サービスをご利用いただいた場合、改定後のポリシーにご同意いただいたものとみなします。
          </Section>

          <Section title="12. お問い合わせ">
            個人情報の取り扱いに関するご質問・ご相談は、アプリ内の「お問い合わせ」フォームよりお気軽にご連絡ください。できる限り迅速に対応いたします。
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
