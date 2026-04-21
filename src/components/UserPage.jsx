import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { PersonSvg, WorkSvgSm } from '../lib/svgs'

export default function UserPage({ username }) {
  const [profile, setProfile] = useState(null)
  const [works, setWorks] = useState([])
  const [counts, setCounts] = useState({ followers: null, following: null })
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!username) return
    async function load() {
      setLoading(true)
      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .eq('is_public', true)
        .maybeSingle()
      if (!p) { setNotFound(true); setLoading(false); return }
      setProfile(p)
      const [{ data: w }, { count: fc }, { count: ing }] = await Promise.all([
        supabase.from('works').select('*').eq('user_id', p.user_id).order('created_at', { ascending: false }),
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', p.user_id),
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', p.user_id),
      ])
      setWorks(w || [])
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', maxWidth: '480px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 300, fontSize: '22px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Yarn<b style={{ fontStyle: 'normal', color: 'var(--accent)' }}>&</b></div>
        <a href="/" style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '99px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>アプリを使う</a>
      </div>

      <div style={{ padding: '24px 20px' }}>
        {/* Profile card */}
        <div style={{ background: 'var(--surface)', borderRadius: '18px', border: '1px solid var(--border)', padding: '24px 20px', textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', background: 'var(--accent-light)', border: '2.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            {profile.avatar_url ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <PersonSvg />}
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>{profile.username}</div>
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

        {/* Works */}
        {works.length > 0 && (
          <>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '0.06em', marginBottom: '10px' }}>作品 {works.length}点</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px', borderRadius: '14px', overflow: 'hidden' }}>
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
          </>
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
