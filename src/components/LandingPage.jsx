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
          毛糸沼の人に、ぴったりのアプリ
        </div>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(26px, 6vw, 42px)', fontWeight: 600, lineHeight: 1.55, color: 'var(--text-primary)', marginBottom: '36px' }}>
          また、<span style={{ color: 'var(--accent)' }}>買っちゃった</span><br /><span style={{ fontSize: '0.6em', color: 'var(--text-secondary)', fontWeight: 400, letterSpacing: '0.04em' }}>増え続ける毛糸も、<span style={{ fontSize: '1.1em', color: 'var(--text-primary)', fontWeight: 600 }}>ぜんぶここに。</span></span>
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 12px', lineHeight: 1.9 }}>
          毛糸・作品・道具・書籍をひとまとめに。<br />
          編み物好きのための、<br />やさしい管理ノートアプリです。
        </p>
        <p style={{ fontSize: '15px', color: 'var(--accent)', fontWeight: 600, marginBottom: '32px', marginTop: '16px' }}>
          SNSじゃないから、気負わず使えます。
        </p>
        <button onClick={onSignup} style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '99px', padding: '16px 40px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(140,98,114,0.28)' }}>
          無料で始める
        </button>
        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '10px' }}>登録1分・完全無料</div>

        {/* イメージ */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
          <div style={{ width: '100%', maxWidth: '360px', position: 'relative' }}>
            <img src="/LPzukai.png" alt="YARN& アプリ画面" style={{ width: '100%', borderRadius: '20px', boxShadow: '0 16px 48px rgba(140,98,114,0.18)', display: 'block' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderRadius: '20px 20px 0 0', padding: '20px 16px 40px', background: 'linear-gradient(to bottom, rgba(140,98,114,0.72) 0%, rgba(140,98,114,0.3) 60%, transparent 100%)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: 700, letterSpacing: '0.06em' }}>毛糸も作品も、スマホひとつに。</span>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section style={{ background: 'var(--surface)', padding: '64px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.14em', color: '#C9A0B0', fontWeight: 600, marginBottom: '10px' }}>こんなこと、ありませんか？</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>毛糸沼あるある</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.8 }}>全部、YARN&amp; で解決できます。</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {[
              { icon: '😔', title: 'どこで買ったか忘れた', desc: 'メーカーも品番も思い出せない。あの色、もう一度欲しいのに…' },
              { icon: '🤯', title: '在庫が把握できていない', desc: '棚に積み上がった毛糸、実は何玉あるかわからない' },
              { icon: '📷', title: '作品の記録がバラバラ', desc: '写真はカメラロール、メモは別アプリ。探すのが大変…' },
              { icon: '📚', title: '同じ本を二冊買った', desc: '「これ持ってたっけ？」で失敗したことがある' },
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
          <div style={{ fontSize: '11px', letterSpacing: '0.14em', color: '#C9A0B0', fontWeight: 600, marginBottom: '10px' }}>できること</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>使うほど、編み物が楽しくなる</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '36px' }}>毛糸まわりのぜんぶを、ひとつのアプリにまとめて。</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {[
              {
                icon: '🧶',
                title: '毛糸の迷子がなくなる',
                benefit: '色・メーカー・残量をまとめて記録',
                desc: '写真・購入店・素材・残量をひとまとめに。「あの毛糸どこだっけ」がなくなります。',
              },
              {
                icon: '🧤',
                title: '作品の思い出を残せる',
                benefit: '使った毛糸・道具・編み図URLまで紐づけ',
                desc: '完成作品も制作中のものも記録できます。カテゴリータグで整理もかんたん。',
              },
              {
                icon: '🪡',
                title: '道具・書籍の重複買いがなくなる',
                benefit: 'かぎ針・棒針・編み図本もまとめて管理',
                desc: '「これ持ってたっけ？」が一発で確認できます。',
              },
              {
                icon: '✨',
                title: 'ゆるくつながれる、SNSじゃない場所',
                benefit: '見せたいときだけ公開。プレッシャーなし',
                desc: '他のユーザーの作品を見たり、自分の作品を公開したり。「YARN」で応援の気持ちを送ることも。フォローして、お気に入りの作家さんの投稿を追いかけよう。',
              },
            ].map((f) => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'var(--accent-light)', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>{f.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.03em' }}>{f.benefit}</div>
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
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>あなたのための、ノートアプリ</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.8 }}>かぎ針でも棒針でも。初心者でも作家さんでも。</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              '毛糸が増えすぎて在庫管理に困っている',
              '作品の記録をきれいに残したい',
              '編み図本や道具の管理がぐちゃぐちゃ',
              '編み物作家・ハンドメイド作家として活動している',
              'SNSは疲れるけど、同じ趣味の人とゆるくつながりたい',
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
          毛糸沼、もっと<br />楽しんでいいんだよ。
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.82)', marginBottom: '8px', lineHeight: 1.8 }}>
          記録するだけで、ぐんと使いやすくなる。
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginBottom: '36px' }}>
          無料・登録1分・スマホからすぐ使えます
        </p>
        <button onClick={onSignup} style={{ display: 'inline-block', background: '#fff', color: 'var(--accent)', border: 'none', borderRadius: '99px', padding: '16px 44px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
          今すぐ無料で始める
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--text-primary)', padding: '36px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 300, fontSize: '20px', color: 'var(--accent-light)', letterSpacing: '-0.02em', marginBottom: '14px' }}>
          Yarn<span style={{ fontStyle: 'normal' }}>&amp;</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <a href="https://x.com/YARNand__" target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#A89298', textDecoration: 'none' }}>𝕏 公式アカウント</a>
          <button onClick={onLogin} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#A89298', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>ログイン</button>
        </div>
        <div style={{ fontSize: '11px', color: '#6B5560' }}>© 2026 YARN&amp; All rights reserved.</div>
      </footer>

    </div>
  )
}
