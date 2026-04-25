import { useState, useEffect } from 'react'
import { NOTICES } from '../lib/notices'

const STORAGE_KEY = 'notices_last_read'

export default function Header({ profile, onOpenMyPage, onOpenSettings, onSignOut }) {
  const [open, setOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    const lastRead = localStorage.getItem(STORAGE_KEY) || ''
    const latest = NOTICES[0]?.date || ''
    setHasUnread(latest > lastRead)
  }, [])

  function openNotices() {
    setOpen(true)
    const latest = NOTICES[0]?.date || ''
    localStorage.setItem(STORAGE_KEY, latest)
    setHasUnread(false)
  }

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <span className="header-eyebrow">A Notebook for Makers</span>
          <div className="app-title">Yarn<b>&amp;</b></div>
        </div>
        <div className="header-btns">
          {/* お知らせベル */}
          <button
            onClick={openNotices}
            title="お知らせ"
            style={{
              position: 'relative', width: '34px', height: '34px', borderRadius: '50%',
              border: '1.5px solid var(--border)', background: 'var(--accent-light)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {hasUnread && (
              <span style={{
                position: 'absolute', top: '2px', right: '2px',
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#E05A5A', border: '1.5px solid var(--bg)',
              }} />
            )}
          </button>

          {/* マイページ */}
          <button
            onClick={onOpenMyPage}
            title="マイページ"
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              border: '1.5px solid var(--border)',
              background: profile?.avatar_url ? 'transparent' : 'var(--accent-light)',
              cursor: 'pointer', overflow: 'hidden', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            {profile?.avatar_url
              ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              : <span style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  {profile?.username?.[0]?.toUpperCase() || 'K'}
                </span>
            }
          </button>

          {/* ログアウト */}
          <button className="btn" onClick={onSignOut} title="ログアウト" style={{ padding: '7px 10px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      {/* お知らせシート */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.35)' }} onClick={() => setOpen(false)} />
          <div style={{ background: 'var(--bg)', borderRadius: '20px 20px 0 0', padding: '0 0 env(safe-area-inset-bottom)', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px' }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>お知らせ</span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: 'var(--text-tertiary)', cursor: 'pointer', lineHeight: 1, padding: '4px' }}>×</button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, paddingBottom: '16px' }}>
              {NOTICES.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', fontSize: '13px', color: 'var(--text-tertiary)' }}>お知らせはありません</div>
              ) : NOTICES.map((n, i) => (
                <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '5px', letterSpacing: '0.04em' }}>{n.date}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{n.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
