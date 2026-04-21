import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { PersonSvg } from '../lib/svgs'

function UserListSheet({ title, users, loading, onClose, onOpenProfile }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />
      <div style={{ background: 'var(--bg)', borderRadius: '20px 20px 0 0', padding: '0 0 env(safe-area-inset-bottom)', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px' }}>
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', color: 'var(--text-tertiary)', cursor: 'pointer', lineHeight: 1, padding: '4px' }}>×</button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, paddingBottom: '16px' }}>
          {loading && <div style={{ textAlign: 'center', padding: '32px', fontSize: '13px', color: 'var(--text-tertiary)' }}>読み込み中…</div>}
          {!loading && users.length === 0 && <div style={{ textAlign: 'center', padding: '32px', fontSize: '13px', color: 'var(--text-tertiary)' }}>まだいません</div>}
          {users.map((p) => (
            <div key={p.user_id} onClick={() => { onOpenProfile(p); onClose() }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', background: 'var(--accent-light)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--border)' }}>
                {p.avatar_url ? <img src={p.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <PersonSvg />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{p.username || 'ユーザー'}</div>
                {p.bio && <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>{p.bio}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MyPage({ open, profile, yarns, tools, books, works, followsCount, followersCount, follows, feedProfiles, onClose, onEdit, onOpenProfile, onChangePassword }) {
  const [sheet, setSheet] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleCopyUrl = useCallback(() => {
    const url = `https://yarn-and.vercel.app/user/${profile?.username || ''}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [profile?.username]) // 'follows' | 'followers'
  const [followingProfiles, setFollowingProfiles] = useState([])
  const [loadingFollowing, setLoadingFollowing] = useState(false)
  const [followers, setFollowers] = useState([])
  const [loadingFollowers, setLoadingFollowers] = useState(false)

  if (!open) return null

  const username = profile?.username || 'ユーザー'
  const bio = profile?.bio || ''
  const avatarUrl = profile?.avatar_url || ''
  const isPublic = profile?.is_public || false

  async function openFollowing() {
    setSheet('follows')
    setLoadingFollowing(true)
    if (follows.length > 0) {
      const ids = follows.map((f) => f.following_id)
      const { data } = await supabase.from('profiles').select('*').in('user_id', ids)
      setFollowingProfiles(data || [])
    } else {
      setFollowingProfiles([])
    }
    setLoadingFollowing(false)
  }

  async function openFollowers() {
    setSheet('followers')
    setLoadingFollowers(true)
    const { data: fRows } = await supabase.from('follows').select('follower_id').eq('following_id', profile?.user_id || '')
    if (fRows && fRows.length > 0) {
      const ids = fRows.map((r) => r.follower_id)
      const { data: profiles } = await supabase.from('profiles').select('*').in('user_id', ids)
      setFollowers(profiles || [])
    } else {
      setFollowers([])
    }
    setLoadingFollowers(false)
  }

  return (
    <>
      <div className="mypage-overlay">
        <div className="mypage-topbar">
          <button className="btn" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={onClose}>← 戻る</button>
          <span className="mypage-topbar-title">マイページ</span>
          <button className="btn" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={onEdit}>編集</button>
        </div>

        <div className="mypage-body">
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
            <div className="mypage-stat" style={{ cursor: 'pointer' }} onClick={openFollowing}>
              <span className="mypage-stat-num">{followsCount}</span>
              <span className="mypage-stat-label">フォロー</span>
            </div>
            <div className="mypage-stat" style={{ cursor: 'pointer' }} onClick={openFollowers}>
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

          {isPublic && (
            <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '12px 16px', marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '8px', letterSpacing: '0.06em' }}>プロフィールURL</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
                  yarn-and.vercel.app/user/{username}
                </div>
                <button className="btn" onClick={handleCopyUrl}
                  style={{ fontSize: '12px', padding: '5px 12px', flexShrink: 0, background: copied ? 'var(--accent)' : '', color: copied ? '#fff' : '', borderColor: copied ? 'var(--accent)' : '' }}>
                  {copied ? '✓ コピー済み' : 'コピー'}
                </button>
              </div>
            </div>
          )}

          <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '4px 12px' }}>
            <button onClick={onChangePassword} style={{ width: '100%', background: 'none', border: 'none', padding: '12px 0', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>パスワードを変更する</span>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>›</span>
            </button>
          </div>
        </div>
      </div>

      {sheet === 'follows' && (
        <UserListSheet
          title={`フォロー中 ${followsCount}人`}
          users={followingProfiles}
          loading={loadingFollowing}
          onClose={() => setSheet(null)}
          onOpenProfile={onOpenProfile}
        />
      )}
      {sheet === 'followers' && (
        <UserListSheet
          title={`フォロワー ${followersCount}人`}
          users={followers}
          loading={loadingFollowers}
          onClose={() => setSheet(null)}
          onOpenProfile={onOpenProfile}
        />
      )}
    </>
  )
}
