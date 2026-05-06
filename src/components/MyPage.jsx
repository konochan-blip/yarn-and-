import { useState, useCallback } from 'react'

function knittingAge(since) {
  if (!since) return null
  const [y, m] = since.split('-').map(Number)
  const now = new Date()
  let years = now.getFullYear() - y
  let months = now.getMonth() + 1 - m
  if (months < 0) { years--; months += 12 }
  if (years === 0 && months === 0) return '1ヶ月未満'
  if (years === 0) return `${months}ヶ月`
  if (months === 0) return `${years}年`
  return `${years}年${months}ヶ月`
}
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

export default function MyPage({ open, profile, yarns, tools, books, works, purchases, wishItems = [], followsCount, followersCount, follows, feedProfiles, onClose, onEdit, onOpenProfile, onChangePassword, onChangeHandle, onAddPurchase, onOpenPurchaseDetail, onAddWishItem, onDeleteWishItem, onOpenYarnDetail }) {
  const [sheet, setSheet] = useState(null)
  const [copied, setCopied] = useState(false)
  const [wishText, setWishText] = useState('')
  const [wishYarnId, setWishYarnId] = useState('')
  const [wishShop, setWishShop] = useState('')
  const [wishQty, setWishQty] = useState('')
  const [addingWish, setAddingWish] = useState(false)

  const handleCopyUrl = useCallback(() => {
    const url = `https://www.yarn-and.com/user/${profile?.handle || profile?.username || ''}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [profile?.handle, profile?.username]) // 'follows' | 'followers'
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
            {profile?.handle && <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>@{profile.handle}</div>}
            {profile?.knitting_since && <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '6px' }}>🧶 <span style={{ textDecoration: 'underline wavy', textDecorationColor: 'var(--accent)', textUnderlineOffset: '3px' }}>編み物歴 {knittingAge(profile.knitting_since)}</span></div>}
            {profile?.needle_types?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px', marginBottom: '8px' }}>
                {profile.needle_types.map((t, i) => {
                  const palette = [
                    { bg: '#FDE8EF', color: '#C04070' },
                    { bg: '#E8F4EE', color: '#3A7A55' },
                    { bg: '#EAF0FF', color: '#4455CC' },
                    { bg: '#FFF0E0', color: '#C06520' },
                    { bg: '#F2EAFF', color: '#7040C0' },
                    { bg: '#FFFCE0', color: '#9A7010' },
                  ]
                  const c = palette[i % palette.length]
                  return <span key={t} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '99px', background: c.bg, color: c.color, fontWeight: 500 }}>{t}</span>
                })}
              </div>
            )}
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


          {isPublic && (
            <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '12px 16px', marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '8px', letterSpacing: '0.06em' }}>プロフィールURL</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
                  www.yarn-and.com/user/{profile?.handle || username}
                </div>
                <button className="btn" onClick={handleCopyUrl}
                  style={{ fontSize: '12px', padding: '5px 12px', flexShrink: 0, background: copied ? 'var(--accent)' : '', color: copied ? '#fff' : '', borderColor: copied ? 'var(--accent)' : '' }}>
                  {copied ? '✓ コピー済み' : 'コピー'}
                </button>
              </div>
            </div>
          )}

          {profile?.social_links?.length > 0 && (
            <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '12px 16px', marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '10px', letterSpacing: '0.06em' }}>リンク</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {profile.social_links.map((l, i) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--accent-light)', borderRadius: '10px', padding: '8px 12px', textDecoration: 'none' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{l.title}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 買う物リスト */}
          <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '14px 16px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                買う物リスト <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text-tertiary)' }}>{wishItems.length}</span>
              </div>
            </div>
            {wishItems.length === 0 && !addingWish && (
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>まだ何も登録されていないよ</div>
            )}
            {wishItems.map((item) => {
              const linked = yarns.find((y) => y.id === item.yarn_id)
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '7px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: linked || item.shop || item.quantity ? '3px' : 0 }}>{item.text}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {linked && (
                        <span onClick={() => onOpenYarnDetail?.(linked)} style={{ fontSize: '11px', padding: '1px 7px', borderRadius: '99px', background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 500, cursor: onOpenYarnDetail ? 'pointer' : 'default' }}>
                          {linked.name || '毛糸'}{linked.colorname ? ` / ${linked.colorname}` : ''}
                        </span>
                      )}
                      {item.shop && <span style={{ fontSize: '11px', padding: '1px 7px', borderRadius: '99px', background: 'var(--tag-shop-bg)', color: 'var(--tag-shop-text)', fontWeight: 500 }}>{item.shop}</span>}
                      {item.quantity && <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{item.quantity}</span>}
                    </div>
                  </div>
                  <button onClick={() => onDeleteWishItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '2px 4px', flexShrink: 0 }}>×</button>
                </div>
              )
            })}
            {addingWish ? (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input type="text" value={wishText} placeholder="例：ソックヤーン・かぎ針5号など" onChange={(e) => setWishText(e.target.value)}
                  style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" value={wishShop} placeholder="お店（例：オカダヤ）" onChange={(e) => setWishShop(e.target.value)}
                    style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', flex: 1, minWidth: 0 }} />
                  <input type="text" value={wishQty} placeholder="個数（例：3玉）" onChange={(e) => setWishQty(e.target.value)}
                    style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', flex: 1, minWidth: 0 }} />
                </div>
                <select value={wishYarnId} onChange={(e) => setWishYarnId(e.target.value)}
                  style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-secondary)', outline: 'none', width: '100%' }}>
                  <option value="">毛糸と紐づけない</option>
                  {yarns.map((y) => <option key={y.id} value={y.id}>{y.name || '名前なし'}{y.colorname ? ` / ${y.colorname}` : ''}</option>)}
                </select>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn" onClick={() => { setAddingWish(false); setWishText(''); setWishYarnId(''); setWishShop(''); setWishQty('') }} style={{ flex: 1, fontSize: '13px' }}>キャンセル</button>
                  <button className="btn primary" disabled={!wishText.trim()} onClick={async () => { if (!wishText.trim()) return; await onAddWishItem(wishText.trim(), wishYarnId || null, wishShop.trim(), wishQty.trim()); setWishText(''); setWishYarnId(''); setWishShop(''); setWishQty(''); setAddingWish(false) }} style={{ flex: 1, fontSize: '13px' }}>追加</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingWish(true)} style={{ marginTop: wishItems.length ? '8px' : '0', background: 'none', border: 'none', fontSize: '12px', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 0', fontWeight: 600 }}>＋ 追加</button>
            )}
          </div>

          {profile?.favorite_shops?.length > 0 && (
            <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '12px 16px', marginBottom: '10px' }}>
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

          {/* 購入品グリッド */}
          <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '14px 16px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>購入品 <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text-tertiary)' }}>{(purchases || []).length}</span></div>
              <button onClick={onAddPurchase} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 0', fontWeight: 600 }}>＋ 追加</button>
            </div>
            {(purchases || []).length === 0
              ? <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '16px 0' }}>まだ登録されていないよ</div>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                  {(purchases || []).map((p) => (
                    <div key={p.id} onClick={() => onOpenPurchaseDetail(p)}
                      style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: 'var(--accent-light)', cursor: 'pointer', border: '1px solid var(--border-light)' }}>
                      {p.img_url
                        ? <img src={p.img_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🛍️</div>
                      }
                    </div>
                  ))}
                </div>
            }
          </div>

          <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '4px 12px' }}>
            <button onClick={onChangeHandle} style={{ width: '100%', background: 'none', border: 'none', padding: '12px 0', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)' }}>
              <span>IDを変更する</span>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>{profile?.handle ? `@${profile.handle}` : '未設定'} ›</span>
            </button>
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
