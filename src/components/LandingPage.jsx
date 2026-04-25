export default function LandingPage({ onLogin, onSignup }) {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: 'var(--bg)', color: 'var(--text-primary)', minHeight: '100vh' }}>

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(253,245,247,0.92)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 300, fontSize: '22px', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
          Yarn<b style={{ fontStyle: 'normal', fontWeight: 300, color: 'var(--accent)' }}>&amp;</b>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onLogin} style={{ background: 'none', border: '1.5px solid var(--border)', borderRadius: '99px', padding: '8px 18px', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
            ログイン
          </button>
          <button onClick={onSignup} style={{ background: 'var(--accent)', border: 'none', borderRadius: '99px', padding: '8px 18px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
            無料で始める
          </button>
        </div>
      </header>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '72px 24px 60px', background: 'linear-gradient(160deg, #FFF0F4 0%, #FDF5F7 60%, #F5EEF8 100%)' }}>
        <div style={{ display: 'inline-block', fontSize: '11px', letterSpacing: '0.14em', color: '#C9A0B0', fontWeight: 500, background: 'var(--accent-light)', border: '1px solid var(--border)', borderRadius: '99px', padding: '4px 14px', marginBottom: '20px' }}>
          編み物好きのためのノートアプリ
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 6vw, 42px)', fontWeight: 600, lineHeight: 1.45, color: 'var(--text-primary)', marginBottom: '18px' }}>
          毛糸も、作品も、<br /><span style={{ color: 'var(--accent)' }}>ぜんぶここに。</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.9 }}>
          増え続ける毛糸、作りたいもの、使った道具。<br />
          YARN&amp; はそのすべてをきれいに記録・管理できる、<br />編み物好きのためのアプリです。
        </p>
        <button onClick={onSignup} style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '99px', padding: '16px 40px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(140,98,114,0.28)' }}>
          無料で始める
        </button>
        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '10px' }}>登録1分・完全無料</div>

        {/* モックアップ */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '52px' }}>
          <div style={{ width: '260px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '32px', boxShadow: '0 16px 48px rgba(140,98,114,0.14)', overflow: 'hidden' }}>
            <div style={{ background: 'var(--accent)', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 600, color: '#fff', letterSpacing: '0.06em' }}>Yarn&amp;</span>
            </div>
            <div style={{ padding: '16px' }}>
              {[
                { icon: '🧶', name: 'コットンラフィア・ナチュラル', sub: 'リッチモア · 生成り', tag: '残3玉' },
                { icon: '🪡', name: 'メリノウール・ピンクベージュ', sub: 'ダルマ · ウール100%', tag: '残1玉' },
                { icon: '✨', name: 'モヘアシルク・ラベンダー', sub: 'ランベルト · モヘア', tag: '残5玉' },
              ].map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 12px', marginBottom: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-light)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{item.sub}</div>
                    <span style={{ display: 'inline-block', background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: '99px', padding: '2px 8px', fontSize: '9px', fontWeight: 500, marginTop: '4px' }}>{item.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section style={{ background: 'var(--surface)', padding: '64px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.14em', color: '#C9A0B0', fontWeight: 600, marginBottom: '10px' }}>こんなこと、ありませんか？</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '28px' }}>毛糸沼あるある</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {[
              { icon: '😔', title: 'どこで買ったか忘れた', desc: '同じ毛糸を探しているのに、メーカーも品番も思い出せない…' },
              { icon: '🤯', title: '在庫が把握できていない', desc: '棚に積み上がった毛糸、何玉あるか自分でもわからない' },
              { icon: '📷', title: '作品の記録が散らばっている', desc: '写真はカメラロール、メモはメモ帳、どこにあるかわからない' },
              { icon: '📚', title: '持っている本を忘れる', desc: '同じ編み図の本を二冊買ってしまったことがある' },
            ].map((item) => (
              <div key={item.title} style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ fontSize: '22px', flexShrink: 0, marginTop: '2px' }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: 'var(--bg)', padding: '64px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.14em', color: '#C9A0B0', fontWeight: 600, marginBottom: '10px' }}>Features</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>YARN&amp; でできること</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '36px' }}>毛糸まわりのすべてを、ひとつのアプリでまとめて管理。</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {[
              { icon: '🧶', title: '毛糸を管理する', desc: 'メーカー・色番号・素材・残量・購入店などを記録。写真も一緒に保存できるので、どんな毛糸か一目でわかります。' },
              { icon: '🧤', title: '作品を記録する', desc: '完成した作品や制作中のものを記録。使った毛糸・参考書籍・編み方・編み図URLまでまとめて残せます。カテゴリータグで整理も簡単。' },
              { icon: '🪡', title: '道具・書籍も一元管理', desc: 'かぎ針・棒針などの道具、編み図本・テキストもアプリ内で管理。「あの本、持ってたっけ？」がなくなります。' },
              { icon: '✨', title: 'みんなの作品を見る・シェアする', desc: 'プロフィールを公開すれば、他のユーザーと作品を見せ合うことができます。気に入った作品には「YARN」でいいねを。フォロー機能でお気に入りの作家さんをフォローしよう。' },
            ].map((f) => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'var(--accent-light)', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{f.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.85 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO */}
      <section style={{ background: 'var(--surface)', padding: '64px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.14em', color: '#C9A0B0', fontWeight: 600, marginBottom: '10px' }}>こんな方におすすめ</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>あなたのためのアプリです</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              'かぎ針・棒針・輪針、どの編み方でも使えます',
              '毛糸コレクターで在庫管理に困っている方',
              '作品の記録をきれいに残したい方',
              '編み物作家・ハンドメイド作家として活動している方',
              '他の編み物好きとつながりたい方',
            ].map((text) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 18px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}>✓</div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #8C6272 0%, #C9A0B0 100%)', textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 5vw, 34px)', fontWeight: 600, color: '#fff', marginBottom: '14px', lineHeight: 1.5 }}>
          さあ、毛糸沼を<br />整理しよう。
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.82)', marginBottom: '36px', lineHeight: 1.8 }}>
          無料・登録1分。スマホからすぐに始められます。
        </p>
        <button onClick={onSignup} style={{ display: 'inline-block', background: '#fff', color: 'var(--accent)', border: 'none', borderRadius: '99px', padding: '16px 44px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
          YARN&amp; を始める
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--text-primary)', padding: '36px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: 300, color: 'var(--accent-light)', letterSpacing: '0.06em', marginBottom: '14px' }}>Yarn&amp;</div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <a href="https://x.com/YARNand__" target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#A89298', textDecoration: 'none' }}>𝕏 公式アカウント</a>
          <button onClick={onLogin} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#A89298', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>ログイン</button>
        </div>
        <div style={{ fontSize: '11px', color: '#6B5560' }}>© 2026 YARN&amp; All rights reserved.</div>
      </footer>

    </div>
  )
}
