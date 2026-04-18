import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { PersonSvg, WorkSvgSm } from '../lib/svgs'

export default function PublicProfile({ profile, feedWorks, isFollowing, onFollow, onUnfollow, onClose, onOpenWork }) {
  const [followersCount, setFollowersCount] = useState(null)
  const [followingCount, setFollowingCount] = useState(null)

  useEffect(() => {
    if (!profile) return
    setFollowersCount(null)
    setFollowingCount(null)
    Promise.all([
      supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', profile.user_id),
      supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', profile.user_id),
    ]).then(([{ count: fc }, { count: ing }]) => {
      setFollowersCount(fc ?? 0)
      setFollowingCount(ing ?? 0)
    })
  }, [profile?.user_id])

  if (!profile) return null

  const userWorks = [...feedWorks]
    .filter((w) => w.user_id === profile.user_id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  return (
    <div className="mypage-overlay">
      <div className="mypage-topbar">
        <button className="btn" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={onClose}>
          ← 戻る
        </button>
        <span className="mypage-topbar-title">{profile.username || 'プロフィール'}</span>
        <button
          className={`btn${isFollowing ? '' : ' primary'}`}
          style={{ padding: '6px 14px', fontSize: '13px' }}
          onClick={() => isFollowing ? onUnfollow(profile.user_id) : onFollow(profile.user_id)}
        >
          {isFollowing ? 'フォロー中' : 'フォローする'}
        </button>
      </div>

      <div className="mypage-body">
        {/* Profile card */}
        <div className="mypage-profile-card">
          <div className="mypage-avatar-wrap">
            {profile.avatar_url ? <img src={profile.avatar_url} alt="" /> : <PersonSvg />}
          </div>
          <div className="mypage-username">{profile.username || 'ユーザー'}</div>
          <div className={`mypage-badge ${profile.is_public ? 'public' : 'private'}`}>
            {profile.is_public ? (
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
          {profile.bio ? (
            <div className="mypage-bio">{profile.bio}</div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>自己紹介未設定</div>
          )}
        </div>

        {/* Follow counts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <div className="mypage-stat">
            <span className="mypage-stat-num">{followersCount === null ? '…' : followersCount}</span>
            <span className="mypage-stat-label">フォロワー</span>
          </div>
          <div className="mypage-stat">
            <span className="mypage-stat-num">{followingCount === null ? '…' : followingCount}</span>
            <span className="mypage-stat-label">フォロー中</span>
          </div>
        </div>

        {/* Works */}
        {isFollowing ? (
          userWorks.length > 0 ? (
            <>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '0.06em', marginBottom: '10px' }}>
                作品 {userWorks.length}点
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px' }}>
                {userWorks.map((work) => (
                  <div key={work.id} onClick={() => onOpenWork(work)}
                    style={{ aspectRatio: '1', overflow: 'hidden', background: '#EDE0E5', cursor: 'pointer', position: 'relative' }}>
                    {work.img_url
                      ? <img src={work.img_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WorkSvgSm /></div>
                    }
                    {work.name && (
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.45))', padding: '14px 6px 5px', pointerEvents: 'none' }}>
                        <div style={{ fontSize: '11px', color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{work.name}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '28px 20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)' }}>
              まだ作品が登録されていません
            </div>
          )
        ) : (
          <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '28px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔒</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              フォローすると<br />このユーザーの作品が見られます
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
