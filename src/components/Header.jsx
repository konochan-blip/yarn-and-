export default function Header({ profile, onOpenMyPage, onOpenSettings, onSignOut }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <span className="header-eyebrow">A Notebook for Makers</span>
        <div className="app-title">Yarn<b>&amp;</b></div>
      </div>
      <div className="header-btns">
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
        <button className="btn" onClick={onOpenSettings} style={{ fontSize: '12px', padding: '6px 12px' }}>お店</button>
        <button className="btn" onClick={onSignOut} title="ログアウト" style={{ padding: '7px 10px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
