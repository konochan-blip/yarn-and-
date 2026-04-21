export default function TermsPage({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'var(--bg)', overflowY: 'auto' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px 60px' }}>
        {/* Header */}
        <div style={{ position: 'sticky', top: 0, background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '14px 0', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button onClick={onClose} className="btn" style={{ padding: '6px 14px', fontSize: '13px', flexShrink: 0 }}>← 戻る</button>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: '16px', color: 'var(--text-primary)' }}>利用規約</span>
        </div>

        <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', lineHeight: 1.9 }}>

          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '32px' }}>
            最終更新日：2026年4月22日
          </p>

          <Section title="第1条（本規約の適用）">
            本利用規約（以下「本規約」）は、YARN&amp;（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーは本サービスを利用することにより、本規約に同意したものとみなされます。
          </Section>

          <Section title="第2条（サービスの内容）">
            本サービスは、毛糸・編み道具・書籍・作品などの手芸関連アイテムをオンラインで記録・管理できるノートアプリです。登録したデータはクラウド上に保存され、複数のデバイスからアクセスできます。また、プロフィールを公開設定にすることで他のユーザーとの交流機能を利用できます。
          </Section>

          <Section title="第3条（アカウント登録）">
            <p>本サービスの利用にはメールアドレスとパスワードによるアカウント登録が必要です。</p>
            <ul>
              <li>正確な情報を登録してください</li>
              <li>アカウント情報の管理はユーザー自身の責任で行ってください</li>
              <li>第三者へのアカウントの譲渡・貸与は禁止します</li>
              <li>不正利用を発見した場合は速やかにご連絡ください</li>
            </ul>
          </Section>

          <Section title="第4条（禁止事項）">
            <p>以下の行為を禁止します。</p>
            <ul>
              <li>法令または公序良俗に違反する行為</li>
              <li>他のユーザーへの誹謗中傷・嫌がらせ行為</li>
              <li>他者の著作権・肖像権・プライバシーを侵害するコンテンツの投稿</li>
              <li>虚偽の情報の登録・拡散</li>
              <li>本サービスのシステムへの不正アクセス・妨害行為</li>
              <li>商業目的での無断利用・スパム行為</li>
              <li>その他、運営が不適切と判断する行為</li>
            </ul>
          </Section>

          <Section title="第5条（コンテンツの権利）">
            ユーザーが本サービスに投稿した画像・テキスト等のコンテンツの著作権はユーザーに帰属します。ただし、ユーザーはサービス運営に必要な範囲（表示・保存・バックアップ等）において、当該コンテンツを無償で利用することを許諾するものとします。
          </Section>

          <Section title="第6条（プライバシー）">
            <p>本サービスは以下の情報を収集・利用します。</p>
            <ul>
              <li>メールアドレス（認証・通知のため）</li>
              <li>登録コンテンツ（毛糸・道具・書籍・作品データ）</li>
              <li>プロフィール情報（ユーザー名・自己紹介・アバター画像）</li>
            </ul>
            <p style={{ marginTop: '8px' }}>収集した情報はサービス提供・改善のみに使用し、第三者への販売・提供は行いません。</p>
          </Section>

          <Section title="第7条（サービスの変更・中断・終了）">
            運営は事前の通知なしに、本サービスの内容変更・機能追加・停止・終了を行う場合があります。これによってユーザーに生じた損害について、運営は責任を負いません。
          </Section>

          <Section title="第8条（免責事項）">
            <ul>
              <li>本サービスは現状有姿で提供されます。データの完全性・可用性を保証しません</li>
              <li>本サービスを通じて生じたユーザー間のトラブルについて、運営は一切関与しません</li>
              <li>通信障害・サーバー障害等によるデータ損失について、運営は責任を負いません</li>
              <li>定期的なバックアップを推奨します</li>
            </ul>
          </Section>

          <Section title="第9条（規約の変更）">
            本規約は必要に応じて改定されることがあります。変更後も本サービスを継続して利用した場合、改定後の規約に同意したものとみなします。
          </Section>

          <Section title="第10条（お問い合わせ）">
            本規約に関するお問い合わせは、アプリ内またはサービスの公式連絡先までご連絡ください。
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
