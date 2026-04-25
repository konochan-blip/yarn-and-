export default function TermsPage({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'var(--bg)', overflowY: 'auto' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ position: 'sticky', top: 0, background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '14px 0', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button onClick={onClose} className="btn" style={{ padding: '6px 14px', fontSize: '13px', flexShrink: 0 }}>← 戻る</button>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: '16px', color: 'var(--text-primary)' }}>利用規約</span>
        </div>

        <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', lineHeight: 1.9 }}>

          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '32px' }}>
            最終更新日：2026年4月25日
          </p>

          <Section title="第1条（本規約の適用）">
            本利用規約（以下「本規約」）は、YARN&amp;（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーは本サービスを利用することにより、本規約の内容に同意したものとみなします。
          </Section>

          <Section title="第2条（サービスの内容）">
            本サービスは、毛糸・編み道具・書籍・作品などの手芸関連アイテムをオンラインで記録・管理できるノートアプリです。登録したデータはクラウド上に保存され、複数のデバイスからアクセスできます。また、プロフィールを公開設定にすることで、他のユーザーとの交流機能を利用することができます。
          </Section>

          <Section title="第3条（アカウント登録）">
            <p>本サービスの利用には、メールアドレスとパスワードによるアカウント登録が必要です。</p>
            <ul>
              <li>ユーザーは正確な情報を登録するものとします</li>
              <li>アカウント情報の管理はユーザー自身の責任において行うものとします</li>
              <li>アカウントの第三者への譲渡・貸与は禁止します</li>
              <li>不正利用を発見した場合は、速やかに運営へ連絡するものとします</li>
            </ul>
          </Section>

          <Section title="第4条（禁止事項）">
            <p>ユーザーは以下の行為を行ってはならないものとします。</p>
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
            ユーザーが本サービスに投稿した画像・テキスト等のコンテンツの著作権は、ユーザーに帰属するものとします。ただし、ユーザーはサービス運営に必要な範囲（表示・保存・バックアップ等）において、当該コンテンツを無償で利用することを運営に対して許諾するものとします。
          </Section>

          <Section title="第6条（プライバシー）">
            <p>本サービスは以下の情報を収集・利用します。</p>
            <ul>
              <li>メールアドレス（認証・通知のため）</li>
              <li>登録コンテンツ（毛糸・道具・書籍・作品データ）</li>
              <li>プロフィール情報（ユーザー名・自己紹介・アバター画像）</li>
            </ul>
            <p style={{ marginTop: '8px' }}>収集した情報はサービスの提供・改善のみを目的として使用し、第三者への販売・提供は行いません。</p>
            <p style={{ marginTop: '8px' }}>ただし、以下の場合はこの限りではありません。</p>
            <ul>
              <li>法令に基づき、行政機関・司法機関等から開示を求められた場合</li>
              <li>サービスの運営・提供に必要な外部サービス（データベース・ストレージ等）に対して、業務委託として必要な範囲で情報を提供する場合</li>
            </ul>
          </Section>

          <Section title="第7条（サービスの変更・中断・終了）">
            運営は、機能改善やシステムメンテナンス等の理由により、本サービスの内容を変更したり、一時的に利用を停止することがあります。また、やむを得ない事情によりサービスを終了する場合には、可能な範囲で事前にお知らせするよう努めます。これらによってユーザーに生じた損害について、運営は責任を負わないものとします。
          </Section>

          <Section title="第8条（免責事項）">
            <ul>
              <li>本サービスは現状有姿で提供されます。データの完全性・可用性を保証するものではありません</li>
              <li>本サービスを通じて生じたユーザー間のトラブルについて、運営は一切関与しないものとします</li>
              <li>通信障害・サーバー障害等によるデータ損失について、運営は責任を負わないものとします</li>
              <li>大切なデータについては、定期的にバックアップを取ることをおすすめします</li>
            </ul>
          </Section>

          <Section title="第9条（規約の変更）">
            本規約は必要に応じて改定されることがあります。変更後も本サービスを継続して利用した場合、改定後の規約に同意したものとみなします。
          </Section>

          <Section title="第10条（準拠法および管轄裁判所）">
            本規約の解釈および適用は、日本法に準拠するものとします。本サービスに関して生じた紛争については、運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
          </Section>

          <Section title="第11条（お問い合わせ）">
            本規約に関するお問い合わせは、アプリ内のお問い合わせフォームよりご連絡ください。
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
