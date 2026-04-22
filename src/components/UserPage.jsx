import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { PersonSvg, WorkSvgSm, YarnSvgSm, ToolSvgSm, BookSvgSm } from '../lib/svgs'

export default function UserPage({ username }) {
  const [profile, setProfile] = useState(null)
  const [works, setWorks] = useState([])
  const [yarns, setYarns] = useState([])
  const [tools, setTools] = useState([])
  const [books, setBooks] = useState([])
  const [counts, setCounts] = useState({ followers: null, following: null })
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState('work')

  useEffect(() => {
    if (!username) return
    async function load() {
      setLoading(true)
      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_public', true)
        .or(`handle.eq.${username},username.eq.${username}`)
        .maybeSingle()
      if (!p) { setNotFound(true); setLoading(false); return }
      setProfile(p)
      const [
        { data: w },
        { data: y },
        { data: t },
        { data: b },
        { count: fc },
        { count: ing },
      ] = await Promise.all([
        supabase.from('works').select('*').eq('user_id', p.user_id).order('created_at', { ascending: false }),
        supabase.from('yarns').select('*').eq('user_id', p.user_id).order('created_at', { ascending: true }),
        supabase.from('tools').select('*').eq('user_id', p.user_id).order('created_at', { ascending: true }),
        supabase.from('books').select('*').eq('user_id', p.user_id).order('created_at', { ascending: true }),
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', p.user_id),
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', p.user_id),
      ])
      setWorks(w || [])
      setYarns(y || [])
      setTools(t || [])
      setBooks(b || [])
      setCounts({ followers: fc ?? 0, following: ing ?? 0 })
      setLoading(false)
    }
    load()
  }, [username])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text-tertiary)', fontSize: '14px' }}>読み込み中…</div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', gap: '12px' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>ユーザーが見つかりませんでした</div>
      <a href="/" style={{ fontSize: '13px', color: 'var(--accent)' }}>トップへ戻る</a>
    </div>
  )

  const TABS = [
    { key: 'work', label: '作品', count: works.length },
    { key: 'yarn', label: '毛糸', count: yarns.length },
    { key: 'tool', label: '道具', count: tools.length },
    { key: 'book', label: '書籍', count: books.length },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', maxWidth: '480px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 300, fontSize: '22px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Yarn<b style={{ fontStyle: 'normal', color: 'var(--accent)' }}>&</b>
        </div>
        <a href="/" style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '99px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>アプリを使う</a>
      </div>

      <div style={{ padding: '24px 20px' }}>
        {/* Profile card */}
        <div style={{ background: 'var(--surface)', borderRadius: '18px', border: '1px solid var(--border)', padding: '24px 20px', textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', background: 'var(--accent-light)', border: '2.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            {profile.avatar_url ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <PersonSvg />}
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: '20px', color: 'var(--text-primary)', marginBottom: '4px' }}>{profile.username}</div>
          {profile.handle && <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>@{profile.handle}</div>}
          {profile.bio && <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>{profile.bio}</div>}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '22px', color: 'var(--accent)' }}>{counts.followers ?? '…'}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>フォロワー</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '22px', color: 'var(--accent)' }}>{counts.following ?? '…'}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>フォロー中</div>
            </div>
          </div>
        </div>

        {profile.link_url && (
          <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '12px 16px', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '6px', letterSpacing: '0.06em' }}>リンク</div>
            <a href={profile.link_url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '13px', color: 'var(--accent)', wordBreak: 'break-all', textDecoration: 'none' }}>
              {profile.link_url}
            </a>
          </div>
        )}

        {profile.favorite_shops?.length > 0 && (
          <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '12px 16px', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '10px', letterSpacing: '0.06em' }}>お気に入りのお店</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {profile.favorite_shops.map((s, i) => (
                s.url
                  ? <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--tag-shop-bg)', borderRadius: '10px', padding: '8px 12px', textDecoration: 'none' }}>
                      <span style={{ fontSize: '13px', color: 'var(--tag-shop-text)', fontWeight: 500 }}>{s.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>›</span>
                    </a>
                  : <span key={i} style={{ background: 'var(--tag-shop-bg)', borderRadius: '10px', padding: '8px 12px', fontSize: '13px', color: 'var(--tag-shop-text)', fontWeight: 500 }}>{s.name}</span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', marginBottom: '14px', gap: '2px' }}>
          {TABS.map(({ key, label, count }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{
                flex: 1, padding: '6px 2px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                fontSize: '12px', fontFamily: 'inherit', fontWeight: activeTab === key ? 600 : 400,
                background: activeTab === key ? 'var(--accent)' : 'transparent',
                color: activeTab === key ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.18s',
              }}>
              {label}
              {count > 0 && <span style={{ fontSize: '10px', opacity: 0.8, marginLeft: '3px' }}>{count}</span>}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'work' && (
          works.length === 0
            ? <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)', padding: '28px 0' }}>まだ作品が登録されていません</div>
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px', borderRadius: '14px', overflow: 'hidden' }}>
                {works.map((work) => (
                  <div key={work.id} style={{ aspectRatio: '1', overflow: 'hidden', background: '#EDE0E5', position: 'relative' }}>
                    {work.img_url
                      ? <img src={work.img_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WorkSvgSm /></div>
                    }
                    {work.name && (
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.45))', padding: '14px 6px 5px', pointerEvents: 'none' }}>
                        <div style={{ fontSize: '11px', color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{work.name}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
        )}

        {activeTab === 'yarn' && (
          yarns.length === 0
            ? <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)', padding: '28px 0' }}>まだ毛糸が登録されていません</div>
            : <div className="list">
                {yarns.map((yarn) => (
                  <div key={yarn.id} className="yarn-row">
                    <div className="yarn-thumb">
                      {yarn.img_url ? <img src={yarn.img_url} alt="" /> : <YarnSvgSm />}
                    </div>
                    <div className="yarn-info">
                      <div className="yarn-name">{yarn.name || '名前なし'}</div>
                      <div className="yarn-meta">{[yarn.colorname, yarn.material].filter(Boolean).join(' · ')}</div>
                    </div>
                  </div>
                ))}
              </div>
        )}

        {activeTab === 'tool' && (
          tools.length === 0
            ? <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)', padding: '28px 0' }}>まだ道具が登録されていません</div>
            : <div className="list">
                {tools.map((tool) => (
                  <div key={tool.id} className="yarn-row">
                    <div className="yarn-thumb">
                      {tool.img_url ? <img src={tool.img_url} alt="" /> : <ToolSvgSm />}
                    </div>
                    <div className="yarn-info">
                      <div className="yarn-name">{tool.name || '名前なし'}</div>
                      <div className="yarn-meta">{[tool.type, tool.size].filter(Boolean).join(' · ')}</div>
                    </div>
                  </div>
                ))}
              </div>
        )}

        {activeTab === 'book' && (
          books.length === 0
            ? <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)', padding: '28px 0' }}>まだ書籍が登録されていません</div>
            : <div className="list">
                {books.map((book) => (
                  <div key={book.id} className="yarn-row">
                    <div className="yarn-thumb">
                      {book.img_url ? <img src={book.img_url} alt="" /> : <BookSvgSm />}
                    </div>
                    <div className="yarn-info">
                      <div className="yarn-name">{book.title || '無題'}</div>
                      <div className="yarn-meta">{[book.author, book.publisher].filter(Boolean).join(' · ')}</div>
                    </div>
                  </div>
                ))}
              </div>
        )}

        {/* CTA */}
        <div style={{ background: 'var(--surface)', borderRadius: '18px', border: '1px solid var(--border)', padding: '24px 20px', textAlign: 'center', marginTop: '20px' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '6px' }}>Yarn& をはじめる</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '16px', lineHeight: 1.7 }}>毛糸・道具・作品を記録できる<br />ニッター向けノートアプリ</div>
          <a href="/" style={{ display: 'inline-block', padding: '10px 28px', borderRadius: '99px', background: 'var(--accent)', color: '#fff', fontSize: '13px', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>無料ではじめる</a>
        </div>
      </div>
    </div>
  )
}
