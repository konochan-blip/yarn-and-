import { PersonSvg } from '../lib/svgs'

export default function MyPage({ open, profile, yarns, tools, books, works, followsCount, followersCount, onClose, onEdit }) {
  if (!open) return null

  const username = profile?.username || 'ユーザー'
  const bio = profile?.bio || ''
  const avatarUrl = profile?.avatar_url || ''
  const isPublic = profile?.is_public || false

  return (
    <div className="mypage-overlay">
      <div className="mypage-topbar">
        <button className="btn" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={onClose}>
          ← 戻る
        </button>
        <span className="mypage-topbar-title">マイページ</span>
        <button className="btn" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={onEdit}>
          編集
        </button>
      </div>

      <div className="mypage-body">
        {/* Profile card */}
        <div className="mypage-profile-card">
          <div className="mypage-avatar-wrap">
            {avatarUrl ? <img src={avatarUrl} alt="" /> : <PersonSvg />}
          </div>
          <div className="mypage-username">{username}</div>
          <div className={`mypage-badge ${isPublic ? 'public' : 'private'}`}>
            {isPublic ? (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                公開
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                非公開
              </>
            )}
          </div>
          {bio ? (
            <div className="mypage-bio">{bio}</div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>自己紹介未設定</div>
          )}
        </div>

        {/* Social stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <div className="mypage-stat">
            <span className="mypage-stat-num">{followsCount}</span>
            <span className="mypage-stat-label">フォロー</span>
          </div>
          <div className="mypage-stat">
            <span className="mypage-stat-num">{followersCount}</span>
            <span className="mypage-stat-label">フォロワー</span>
          </div>
        </div>

        {/* Content stats */}
        <div className="mypage-stats" style={{ marginBottom: '20px' }}>
          <div className="mypage-stat">
            <span className="mypage-stat-num">{yarns.length}</span>
            <span className="mypage-stat-label">毛糸</span>
          </div>
          <div className="mypage-stat">
            <span className="mypage-stat-num">{tools.length}</span>
            <span className="mypage-stat-label">道具</span>
          </div>
          <div className="mypage-stat">
            <span className="mypage-stat-num">{books.length}</span>
            <span className="mypage-stat-label">書籍</span>
          </div>
          <div className="mypage-stat">
            <span className="mypage-stat-num">{works.length}</span>
            <span className="mypage-stat-label">作品</span>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '14px 16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px', letterSpacing: '0.06em' }}>登録情報</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            プロフィール編集からユーザー名・自己紹介・アイコン画像を変更できます
          </div>
        </div>
      </div>
    </div>
  )
}
