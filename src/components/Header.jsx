export default function Header({ tab, profile, onOpenMyPage, onOpenSettings, onAdd, onSignOut }) {
  const addLabel =
    tab === 'yarn'  ? '＋ 毛糸追加' :
    tab === 'tools' ? '＋ 道具追加' :
    tab === 'books' ? '＋ 書籍追加' :
    tab === 'works' ? '＋ 作品追加' :
                     null  // feed tab: no add button

  return (
    <header className="app-header">
      <div className="header-left">
        <svg className="header-icon" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="9" stroke="#C4A0AE" strokeWidth="1.5" fill="#F0E4EA"/>
          <path d="M10 16 Q13 10 16 16 Q19 22 22 16" stroke="#8C6272" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M7 13 Q10 8 16 9" stroke="#C4A0AE" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <path d="M25 19 Q22 24 16 23" stroke="#C4A0AE" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <circle cx="16" cy="16" r="2.5" fill="#8C6272" opacity="0.5"/>
        </svg>
        <div className="app-title">YARN&amp;</div>
      </div>
      <div className="header-btns">
        <button
          onClick={onOpenMyPage}
          title="マイページ"
          style={{
            width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid var(--border)',
            background: profile?.avatar_url ? 'transparent' : 'var(--accent-light)',
            cursor: 'pointer', overflow: 'hidden', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          {profile?.avatar_url
            ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            : <svg viewBox="0 0 30 30" fill="none" style={{ width: '18px', height: '18px' }}>
                <circle cx="15" cy="11" r="5" stroke="#C4A0AE" strokeWidth="1.5" fill="#EDE0E5"/>
                <path d="M6 26c0-5 4-8 9-8s9 3 9 8" stroke="#C4A0AE" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
          }
        </button>
        <button className="btn" onClick={onOpenSettings}>お店設定</button>
        {addLabel && <button className="btn primary" onClick={onAdd}>{addLabel}</button>}
        <button className="btn" onClick={onSignOut} title="ログアウト" style={{ padding: '7px 10px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
