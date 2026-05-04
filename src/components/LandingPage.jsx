import { useEffect } from 'react'

export default function LandingPage({ onLogin, onSignup }) {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target
        el.classList.add('visible')
        if (el.classList.contains('lp-who-item')) {
          setTimeout(() => el.classList.add('check-visible'), 420)
        }
        io.unobserve(el)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' })

    document.querySelectorAll('.lp-hero .anim-fade-up, .lp-hero .anim-pop').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 120 + i * 30)
    })

    document.querySelectorAll('section:not(.lp-hero) .anim-fade-up, section:not(.lp-hero) .anim-slide-left, section:not(.lp-hero) .anim-pop').forEach(el => io.observe(el))

    return () => io.disconnect()
  }, [])

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
      <section className="lp-hero" style={{ textAlign: 'center', padding: '72px 24px 60px', background: 'linear-gradient(160deg, #FFF0F4 0%, #FDF5F7 60%, #F5EEF8 100%)' }}>
        <div className="anim-fade-up" style={{ display: 'inline-block', fontSize: '11px', letterSpacing: '0.14em', color: '#C9A0B0', fontWeight: 500, background: 'var(--accent-light)', border: '1px solid var(--border)', borderRadius: '99px', padding: '4px 14px', marginBottom: '20px' }}>
          毛糸沼の人に、ぴったりのアプリ
        </div>
        <h1 style={{ fontFamily: "'Klee One', var(--font-serif)", fontSize: 'clamp(28px, 6vw, 44px)', fontWeight: 400, lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '36px', opacity: 0, animation: 'heroFadeIn 1.8s ease-in-out 0.1s forwards' }}>
          気付いたら、増えてる。<br /><span style={{ color: 'var(--accent)', fontWeight: 600 }}>ぜんぶ、ここに</span>
        </h1>
        <p className="anim-fade-up anim-d2" style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 12px', lineHeight: 1.9 }}>
          毛糸・作品・道具・書籍をひとまとめに。<br />
          編み物好きのための、<br />やさしい管理ノートアプリです。
        </p>
        <p className="anim-fade-up anim-d3" style={{ fontSize: '15px', color: 'var(--accent)', fontWeight: 600, marginBottom: '40px', marginTop: '40px' }}>
          SNSじゃない。でも、つながれる。
        </p>
        <button className="lp-btn-hero anim-pop anim-d4" onClick={onSignup} style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '99px', padding: '16px 40px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(140,98,114,0.28)' }}>
          無料で始める
        </button>
        <div className="anim-fade-up anim-d5" style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '10px' }}>登録1分・完全無料</div>

        {/* イメージ */}
        <div className="anim-fade-up anim-d5" style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
          <div className="lp-hero-img-inner" style={{ width: '100%', maxWidth: '360px', position: 'relative' }}>
            <img src="/LPzukai.png" alt="YARN& アプリ画面" style={{ width: '100%', borderRadius: '20px', boxShadow: '0 16px 48px rgba(140,98,114,0.18)', display: 'block' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderRadius: '20px 20px 0 0', padding: '20px 16px 40px', background: 'linear-gradient(to bottom, rgba(140,98,114,0.72) 0%, rgba(140,98,114,0.3) 60%, transparent 100%)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: 700, letterSpacing: '0.06em' }}>毛糸も作品も、スマホひとつに。</span>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderRadius: '0 0 20px 20px', padding: '40px 16px 20px', background: 'linear-gradient(to top, rgba(140,98,114,0.72) 0%, rgba(140,98,114,0.3) 60%, transparent 100%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: 700, letterSpacing: '0.06em' }}>「好き」を、集めて眺めるしあわせ♡</span>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section style={{ background: 'var(--surface)', padding: '64px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div className="anim-fade-up" style={{ fontSize: '11px', letterSpacing: '0.14em', color: '#C9A0B0', fontWeight: 600, marginBottom: '10px' }}>こんなこと、ありませんか？</div>
          <h2 className="anim-fade-up anim-d1" style={{ fontFamily: "'Klee One', var(--font-serif)", fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>毛糸沼あるある</h2>
          <p className="anim-fade-up anim-d2" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.8 }}>全部、YARN&amp; で解決できます。</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {[
              { icon: '😔', title: 'あの色、どこで買ったっけ…', desc: 'メーカーも品番も思い出せない。また同じ毛糸に出会えても、気づけないかも。', d: 'anim-d1' },
              { icon: '🤯', title: '気づいたら、また増えてた', desc: '「これどのくらいあるんだろう」。数えるのが面倒で、結局また買っちゃう。', d: 'anim-d2' },
              { icon: '📷', title: '思い出が、カメラロールに埋もれていく', desc: '写真は撮った。でも何の糸で編んだか、もう思い出せない。', d: 'anim-d3' },
              { icon: '📚', title: '同じ本を二冊買った', desc: '帰ったら同じのが本棚に。あの悔しさ、もう味わいたくない。', d: 'anim-d4' },
            ].map((item) => (
              <div key={item.title} className={`lp-pain-card anim-fade-up ${item.d}`} style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
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
          <div className="anim-fade-up" style={{ fontSize: '11px', letterSpacing: '0.14em', color: '#C9A0B0', fontWeight: 600, marginBottom: '10px' }}>できること</div>
          <h2 className="anim-fade-up anim-d1" style={{ fontFamily: "'Klee One', var(--font-serif)", fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>使うほど、編み物が楽しくなる</h2>
          <p className="anim-fade-up anim-d2" style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '36px' }}>毛糸まわりのぜんぶを、ひとつのアプリにまとめて。</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {[
              { icon: '🧶', title: '毛糸の迷子がなくなる', benefit: '「あの色どこだっけ」が、もう怖くない', desc: '写真・購入店・素材・残量まで記録しておけば、ほしいときすぐ見つかる。', d: 'anim-d1', delay: '0s' },
              { icon: '🧤', title: '作品の思い出を残せる', benefit: '糸も道具も編み図も、ぜんぶ一緒に', desc: '「この作品、何の糸で編んだっけ」って後悔しなくていい。使ったものをまとめて記録できます。', d: 'anim-d2', delay: '0.8s' },
              { icon: '🪡', title: '道具・書籍の重複買いがなくなる', benefit: 'かぎ針・棒針・編み図本も、スマホで確認', desc: '外出先でも「これ持ってたっけ？」が一発でわかる。あの帰宅後のがっかりが、なくなります。', d: 'anim-d3', delay: '1.6s' },
              { icon: '✨', title: 'ゆるくつながれる、SNSじゃない場所', benefit: '見せたいときだけ公開。プレッシャーなし', desc: '映えなくていい。好きで編んだものを、ただ残しておきたい。そんな気持ちのまま、使える場所です。', d: 'anim-d4', delay: '2.4s' },
            ].map((f) => (
              <div key={f.title} className={`lp-feature-item anim-slide-left ${f.d}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div className="lp-feature-icon" style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'var(--accent-light)', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0, animationDelay: f.delay }}>{f.icon}</div>
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
          <div className="anim-fade-up" style={{ fontSize: '11px', letterSpacing: '0.14em', color: '#C9A0B0', fontWeight: 600, marginBottom: '10px' }}>こんな方におすすめ<span style={{ display: 'inline-block', animation: 'pyon 2s ease-in-out infinite' }}>🐰</span></div>
          <h2 className="anim-fade-up anim-d1" style={{ fontFamily: "'Klee One', var(--font-serif)", fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>あなたのための、ノートアプリ</h2>
          <p className="anim-fade-up anim-d2" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.8 }}>かぎ針でも棒針でも。初心者でも作家さんでも。</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { text: '毛糸、どこに何があるか自分でもわからなくなってきた', d: 'anim-d1' },
              { text: 'あの作品に使ったもの、ちゃんと残しておきたかった', d: 'anim-d2' },
              { text: '「これ持ってたっけ」で同じものを買ったことがある', d: 'anim-d3' },
              { text: '編み物・ハンドメイド作家として、作品を整理したい', d: 'anim-d4' },
              { text: 'SNSは疲れるけど、同じ趣味の人とゆるくつながりたい', d: 'anim-d5' },
            ].map((item) => (
              <div key={item.text} className={`lp-who-item anim-fade-up ${item.d}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 18px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                <div className="lp-who-check" style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}>✓</div>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #8C6272 0%, #C9A0B0 100%)', textAlign: 'center', padding: '80px 24px' }}>
        <h2 className="anim-fade-up" style={{ fontFamily: "'Klee One', var(--font-serif)", fontSize: 'clamp(22px, 5vw, 34px)', fontWeight: 600, color: '#fff', marginBottom: '14px', lineHeight: 1.5 }}>
          毛糸沼、もっと楽しんでいい。
        </h2>
        <p className="anim-fade-up anim-d1" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.82)', marginBottom: '8px', lineHeight: 1.8 }}>
          記録するだけで、ぐんと使いやすくなる。
        </p>
        <p className="anim-fade-up anim-d2" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginBottom: '36px' }}>
          無料・登録1分・スマホからすぐ使えます
        </p>
        <button className="lp-btn-cta anim-pop anim-d3" onClick={onSignup} style={{ display: 'inline-block', background: '#fff', color: 'var(--accent)', border: 'none', borderRadius: '99px', padding: '16px 44px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
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
