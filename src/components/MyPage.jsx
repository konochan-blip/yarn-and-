import { useState, useCallback, useRef } from 'react'

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

export default function MyPage({ open, profile, yarns, tools, books, works, purchases, labels = [], wishItems = [], wantToMake = [], onAddWantToMake, onUpdateWantToMake, onDeleteWantToMake, belongings = [], onAddBelonging, onUpdateBelonging, onDeleteBelonging, followsCount, followersCount, follows, feedProfiles, onClose, onEdit, onOpenProfile, onChangePassword, onChangeHandle, onAddPurchase, onOpenPurchaseDetail, onAddLabel, onDeleteLabel, onAddWishItem, onUpdateWishItem, onDeleteWishItem, onOpenYarnDetail }) {
  const [sheet, setSheet] = useState(null)
  const [copied, setCopied] = useState(false)
  const [wishText, setWishText] = useState('')
  const [wishYarnId, setWishYarnId] = useState('')
  const [wishShop, setWishShop] = useState('')
  const [wishQty, setWishQty] = useState('')
  const [addingWish, setAddingWish] = useState(false)
  const [wishError, setWishError] = useState('')
  const [editingWishId, setEditingWishId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editYarnId, setEditYarnId] = useState('')
  const [editShop, setEditShop] = useState('')
  const [editQty, setEditQty] = useState('')
  const [editError, setEditError] = useState('')
  const [purchaseTab, setPurchaseTab] = useState('purchases')
  const [showAllPurchases, setShowAllPurchases] = useState(false)
  const [addingLabel, setAddingLabel] = useState(false)
  const [labelImgFile, setLabelImgFile] = useState(null)
  const [labelImgPreview, setLabelImgPreview] = useState(null)
  const [labelBrand, setLabelBrand] = useState('')
  const [labelColor, setLabelColor] = useState('')
  const [labelMemo, setLabelMemo] = useState('')
  const [labelSaving, setLabelSaving] = useState(false)
  const [viewingLabel, setViewingLabel] = useState(null)
  const [showAllLabels, setShowAllLabels] = useState(false)
  const labelImgRef = useRef()
  const [addingWantToMake, setAddingWantToMake] = useState(false)
  const [wantToMakeTitle, setWantToMakeTitle] = useState('')
  const [wantToMakeUrl, setWantToMakeUrl] = useState('')
  const [wantToMakeMemo, setWantToMakeMemo] = useState('')
  const [wantToMakeSaving, setWantToMakeSaving] = useState(false)
  const [editingWantToMakeId, setEditingWantToMakeId] = useState(null)
  const [editWantToMakeTitle, setEditWantToMakeTitle] = useState('')
  const [editWantToMakeUrl, setEditWantToMakeUrl] = useState('')
  const [editWantToMakeMemo, setEditWantToMakeMemo] = useState('')
  const [addingBelonging, setAddingBelonging] = useState(false)
  const [belongingName, setBelongingName] = useState('')
  const [belongingQty, setBelongingQty] = useState('')
  const [belongingSize, setBelongingSize] = useState('')
  const [belongingUrl, setBelongingUrl] = useState('')
  const [belongingMemo, setBelongingMemo] = useState('')
  const [belongingSaving, setBelongingSaving] = useState(false)
  const [editingBelongingId, setEditingBelongingId] = useState(null)
  const [editBelongingName, setEditBelongingName] = useState('')
  const [editBelongingQty, setEditBelongingQty] = useState('')
  const [editBelongingSize, setEditBelongingSize] = useState('')
  const [editBelongingUrl, setEditBelongingUrl] = useState('')
  const [editBelongingMemo, setEditBelongingMemo] = useState('')

  function startEditWish(item) {
    setEditingWishId(item.id)
    setEditText(item.text || '')
    setEditYarnId(item.yarn_id || '')
    setEditShop(item.shop || '')
    setEditQty(item.quantity || '')
    setEditError('')
  }
  function cancelEditWish() { setEditingWishId(null); setEditError('') }

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

          {/* 購入品 / ラベルコレクション タブ */}
          <div style={{ display: 'flex', marginBottom: '10px', background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            {[['purchases', '購入品'], ['labels', 'ラベルコレクション']].map(([key, label]) => (
              <button key={key} onClick={() => setPurchaseTab(key)}
                style={{ flex: 1, padding: '10px 4px', border: 'none', borderRight: key === 'purchases' ? '1px solid var(--border)' : 'none', background: purchaseTab === key ? 'var(--accent)' : 'transparent', color: purchaseTab === key ? '#fff' : 'var(--text-secondary)', fontSize: '12px', fontFamily: 'inherit', cursor: 'pointer', fontWeight: purchaseTab === key ? 600 : 400, transition: 'all 0.15s' }}>
                {label}
              </button>
            ))}
          </div>

          {purchaseTab === 'purchases' ? (
            <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '14px 16px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>購入品</div>
                <button onClick={onAddPurchase} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 0', fontWeight: 600 }}>＋ 追加</button>
              </div>
              {(purchases || []).length === 0
                ? <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '16px 0' }}>まだ登録されていないよ</div>
                : <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                      {(showAllPurchases ? purchases : purchases.slice(0, 6)).map((p) => (
                        <div key={p.id} onClick={() => onOpenPurchaseDetail(p)}
                          style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: 'var(--accent-light)', cursor: 'pointer', border: '1px solid var(--border-light)' }}>
                          {p.img_url
                            ? <img src={p.img_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🛍️</div>
                          }
                        </div>
                      ))}
                    </div>
                    {purchases.length > 6 && !showAllPurchases && (
                      <button onClick={() => setShowAllPurchases(true)}
                        style={{ width: '100%', marginTop: '10px', padding: '8px', background: 'none', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                        もっとみる（{purchases.length - 6}件）
                      </button>
                    )}
                  </>
              }
            </div>
          ) : (
            <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '14px 16px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>ラベルコレクション</div>
                {!addingLabel && <button onClick={() => setAddingLabel(true)} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 0', fontWeight: 600 }}>＋ 追加</button>}
              </div>
              {(labels || []).length === 0 && !addingLabel && (
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '16px 0' }}>まだ登録されていないよ</div>
              )}
              {(labels || []).length > 0 && (
                <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginBottom: addingLabel ? '12px' : 0 }}>
                  {(showAllLabels ? labels : labels.slice(0, 6)).map((lbl) => (
                    <div key={lbl.id} onClick={() => setViewingLabel(lbl)}
                      style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: 'var(--accent-light)', cursor: 'pointer', border: '1px solid var(--border-light)', position: 'relative' }}>
                      {lbl.img_url
                        ? <img src={lbl.img_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🏷️</div>
                      }
                      {lbl.brand && (
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', padding: '2px 5px' }}>
                          <span style={{ fontSize: '9px', color: '#fff', fontWeight: 500 }}>{lbl.brand}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {labels.length > 6 && !showAllLabels && (
                  <button onClick={() => setShowAllLabels(true)}
                    style={{ width: '100%', marginTop: '10px', padding: '8px', background: 'none', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                    もっとみる（{labels.length - 6}件）
                  </button>
                )}
                </>
              )}
              {addingLabel && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div onClick={() => labelImgRef.current?.click()}
                    style={{ width: '100%', aspectRatio: '4/3', borderRadius: '10px', border: '1.5px dashed var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {labelImgPreview
                      ? <img src={labelImgPreview} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
                      : <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>タップして写真を選択</span>
                    }
                  </div>
                  <input ref={labelImgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                    const file = e.target.files[0]; if (!file) return
                    setLabelImgFile(file)
                    const reader = new FileReader()
                    reader.onload = (ev) => setLabelImgPreview(ev.target.result)
                    reader.readAsDataURL(file)
                    e.target.value = ''
                  }} />
                  <input type="text" value={labelBrand} placeholder="ブランド名（例：ダルマ、ハマナカ）" onChange={(e) => setLabelBrand(e.target.value)}
                    style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  <input type="text" value={labelColor} placeholder="色名・品番" onChange={(e) => setLabelColor(e.target.value)}
                    style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  <textarea value={labelMemo} placeholder="メモ" rows={2} onChange={(e) => setLabelMemo(e.target.value)}
                    style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'none' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn" onClick={() => { setAddingLabel(false); setLabelImgFile(null); setLabelImgPreview(null); setLabelBrand(''); setLabelColor(''); setLabelMemo('') }} style={{ flex: 1, fontSize: '13px' }}>キャンセル</button>
                    <button className="btn primary" disabled={labelSaving || !labelImgPreview} onClick={async () => {
                      setLabelSaving(true)
                      try {
                        await onAddLabel({ img_url: labelImgPreview || '', brand: labelBrand.trim(), color: labelColor.trim(), memo: labelMemo.trim() }, labelImgFile)
                        setAddingLabel(false); setLabelImgFile(null); setLabelImgPreview(null); setLabelBrand(''); setLabelColor(''); setLabelMemo('')
                      } finally { setLabelSaving(false) }
                    }} style={{ flex: 1, fontSize: '13px' }}>{labelSaving ? '保存中…' : '保存する'}</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 非公開セクション区切り */}
          <div style={{ background: '#F3EEF1', border: '1px solid #DCCDD4', borderRadius: '10px', padding: '10px 14px', margin: '4px 0 14px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#8C6272', fontWeight: 600 }}>🔒 ここより下は他のユーザーには表示されません</span>
          </div>

          {/* 作りたいものリスト */}
          <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '14px 16px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>作りたいものリスト</span>
              {!addingWantToMake && <button onClick={() => setAddingWantToMake(true)} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 0', fontWeight: 600 }}>＋ 追加</button>}
            </div>
            {wantToMake.length === 0 && !addingWantToMake && (
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>まだ何も登録されていないよ</div>
            )}
            {wantToMake.map((item) => {
              if (editingWantToMakeId === item.id) {
                return (
                  <div key={item.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <input type="text" value={editWantToMakeTitle} placeholder="タイトル" onChange={(e) => setEditWantToMakeTitle(e.target.value)}
                      style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                    <input type="text" value={editWantToMakeUrl} placeholder="編み図URL（任意）" onChange={(e) => setEditWantToMakeUrl(e.target.value)}
                      style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                    <textarea value={editWantToMakeMemo} placeholder="メモ" rows={2} onChange={(e) => setEditWantToMakeMemo(e.target.value)}
                      style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'none' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn" onClick={() => setEditingWantToMakeId(null)} style={{ flex: 1, fontSize: '13px' }}>キャンセル</button>
                      <button className="btn primary" disabled={!editWantToMakeTitle.trim()} onClick={async () => {
                        await onUpdateWantToMake(item.id, { title: editWantToMakeTitle.trim(), url: editWantToMakeUrl.trim(), memo: editWantToMakeMemo.trim() })
                        setEditingWantToMakeId(null)
                      }} style={{ flex: 1, fontSize: '13px' }}>保存</button>
                    </div>
                  </div>
                )
              }
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '7px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{item.title || '無題'}</div>
                    {item.url && <div style={{ fontSize: '11px', color: 'var(--accent)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.url}</div>}
                    {item.memo && <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{item.memo}</div>}
                  </div>
                  <button onClick={() => { setEditingWantToMakeId(item.id); setEditWantToMakeTitle(item.title || ''); setEditWantToMakeUrl(item.url || ''); setEditWantToMakeMemo(item.memo || '') }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '2px 4px', flexShrink: 0 }}>✎</button>
                  <button onClick={() => onDeleteWantToMake(item.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '2px 4px', flexShrink: 0 }}>×</button>
                </div>
              )
            })}
            {addingWantToMake && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input type="text" value={wantToMakeTitle} placeholder="タイトル（例：フリルスカート）" onChange={(e) => setWantToMakeTitle(e.target.value)}
                  style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                <input type="text" value={wantToMakeUrl} placeholder="編み図URL（任意）" onChange={(e) => setWantToMakeUrl(e.target.value)}
                  style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                <textarea value={wantToMakeMemo} placeholder="メモ（編み図の説明、必要な毛糸など）" rows={2} onChange={(e) => setWantToMakeMemo(e.target.value)}
                  style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'none' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn" onClick={() => { setAddingWantToMake(false); setWantToMakeTitle(''); setWantToMakeUrl(''); setWantToMakeMemo('') }} style={{ flex: 1, fontSize: '13px' }}>キャンセル</button>
                  <button className="btn primary" disabled={wantToMakeSaving || !wantToMakeTitle.trim()} onClick={async () => {
                    setWantToMakeSaving(true)
                    try {
                      await onAddWantToMake({ title: wantToMakeTitle.trim(), url: wantToMakeUrl.trim(), memo: wantToMakeMemo.trim() })
                      setAddingWantToMake(false); setWantToMakeTitle(''); setWantToMakeUrl(''); setWantToMakeMemo('')
                    } finally { setWantToMakeSaving(false) }
                  }} style={{ flex: 1, fontSize: '13px' }}>{wantToMakeSaving ? '保存中…' : '追加'}</button>
                </div>
              </div>
            )}
          </div>

          {/* 持ち物リスト */}
          <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '14px 16px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>持ち物リスト</span>
              {!addingBelonging && <button onClick={() => setAddingBelonging(true)} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 0', fontWeight: 600 }}>＋ 追加</button>}
            </div>
            {belongings.length === 0 && !addingBelonging && (
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>まだ何も登録されていないよ</div>
            )}
            {belongings.map((item) => {
              if (editingBelongingId === item.id) {
                return (
                  <div key={item.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <input type="text" value={editBelongingName} placeholder="名称" onChange={(e) => setEditBelongingName(e.target.value)}
                      style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={editBelongingQty} placeholder="数量（例：2個）" onChange={(e) => setEditBelongingQty(e.target.value)}
                        style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', flex: 1, minWidth: 0 }} />
                      <input type="text" value={editBelongingSize} placeholder="サイズ" onChange={(e) => setEditBelongingSize(e.target.value)}
                        style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', flex: 1, minWidth: 0 }} />
                    </div>
                    <input type="text" value={editBelongingUrl} placeholder="URL（任意）" onChange={(e) => setEditBelongingUrl(e.target.value)}
                      style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                    <textarea value={editBelongingMemo} placeholder="メモ（購入店など）" rows={2} onChange={(e) => setEditBelongingMemo(e.target.value)}
                      style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'none' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn" onClick={() => setEditingBelongingId(null)} style={{ flex: 1, fontSize: '13px' }}>キャンセル</button>
                      <button className="btn primary" disabled={!editBelongingName.trim()} onClick={async () => {
                        await onUpdateBelonging(item.id, { name: editBelongingName.trim(), qty: editBelongingQty.trim(), size: editBelongingSize.trim(), url: editBelongingUrl.trim(), memo: editBelongingMemo.trim() })
                        setEditingBelongingId(null)
                      }} style={{ flex: 1, fontSize: '13px' }}>保存</button>
                    </div>
                  </div>
                )
              }
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '7px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{item.name || '無題'}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '3px' }}>
                      {item.qty && <span style={{ fontSize: '11px', padding: '1px 7px', borderRadius: '99px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.qty}</span>}
                      {item.size && <span style={{ fontSize: '11px', padding: '1px 7px', borderRadius: '99px', background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 500 }}>{item.size}</span>}
                      {item.memo && <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{item.memo}</span>}
                    </div>
                  </div>
                  <button onClick={() => { setEditingBelongingId(item.id); setEditBelongingName(item.name || ''); setEditBelongingQty(item.qty || ''); setEditBelongingSize(item.size || ''); setEditBelongingUrl(item.url || ''); setEditBelongingMemo(item.memo || '') }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '2px 4px', flexShrink: 0 }}>✎</button>
                  <button onClick={() => onDeleteBelonging(item.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '2px 4px', flexShrink: 0 }}>×</button>
                </div>
              )
            })}
            {addingBelonging && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input type="text" value={belongingName} placeholder="名称（例：底板、ストラップなど）" onChange={(e) => setBelongingName(e.target.value)}
                  style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" value={belongingQty} placeholder="数量（例：2個）" onChange={(e) => setBelongingQty(e.target.value)}
                    style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', flex: 1, minWidth: 0 }} />
                  <input type="text" value={belongingSize} placeholder="サイズ" onChange={(e) => setBelongingSize(e.target.value)}
                    style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', flex: 1, minWidth: 0 }} />
                </div>
                <input type="text" value={belongingUrl} placeholder="URL（任意）" onChange={(e) => setBelongingUrl(e.target.value)}
                  style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                <textarea value={belongingMemo} placeholder="メモ（購入店など）" rows={2} onChange={(e) => setBelongingMemo(e.target.value)}
                  style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'none' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn" onClick={() => { setAddingBelonging(false); setBelongingName(''); setBelongingQty(''); setBelongingSize(''); setBelongingUrl(''); setBelongingMemo('') }} style={{ flex: 1, fontSize: '13px' }}>キャンセル</button>
                  <button className="btn primary" disabled={belongingSaving || !belongingName.trim()} onClick={async () => {
                    setBelongingSaving(true)
                    try {
                      await onAddBelonging({ name: belongingName.trim(), qty: belongingQty.trim(), size: belongingSize.trim(), url: belongingUrl.trim(), memo: belongingMemo.trim() })
                      setAddingBelonging(false); setBelongingName(''); setBelongingQty(''); setBelongingSize(''); setBelongingUrl(''); setBelongingMemo('')
                    } finally { setBelongingSaving(false) }
                  }} style={{ flex: 1, fontSize: '13px' }}>{belongingSaving ? '保存中…' : '追加'}</button>
                </div>
              </div>
            )}
          </div>

          {/* 買う物リスト */}
          <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '14px 16px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>買う物リスト</span>
              {!addingWish && <button onClick={() => setAddingWish(true)} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 0', fontWeight: 600 }}>＋ 追加</button>}
            </div>
            {wishItems.length === 0 && !addingWish && (
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>まだ何も登録されていないよ</div>
            )}
            {wishItems.map((item) => {
              const linked = yarns.find((y) => y.id === item.yarn_id)
              if (editingWishId === item.id) {
                return (
                  <div key={item.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <input type="text" value={editText} placeholder="例：ソックヤーン・かぎ針5号など" onChange={(e) => setEditText(e.target.value)}
                      style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={editShop} placeholder="お店" onChange={(e) => setEditShop(e.target.value)}
                        style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', flex: 1, minWidth: 0 }} />
                      <input type="text" value={editQty} placeholder="個数" onChange={(e) => setEditQty(e.target.value)}
                        style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', flex: 1, minWidth: 0 }} />
                    </div>
                    <select value={editYarnId} onChange={(e) => setEditYarnId(e.target.value)}
                      style={{ fontFamily: 'inherit', fontSize: '13px', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text-secondary)', outline: 'none', width: '100%' }}>
                      <option value="">毛糸と紐づけない</option>
                      {yarns.map((y) => <option key={y.id} value={y.id}>{y.name || '名前なし'}{y.colorname ? ` / ${y.colorname}` : ''}</option>)}
                    </select>
                    {editError && <div style={{ fontSize: '12px', color: '#c0392b' }}>{editError}</div>}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn" onClick={cancelEditWish} style={{ flex: 1, fontSize: '13px' }}>キャンセル</button>
                      <button className="btn primary" disabled={!editText.trim() && !editYarnId} onClick={async () => { try { await onUpdateWishItem(item.id, editText.trim(), editYarnId || null, editShop.trim(), editQty.trim()); setEditingWishId(null); setEditError('') } catch(e) { setEditError(e.message || '保存に失敗しました') } }} style={{ flex: 1, fontSize: '13px' }}>保存</button>
                    </div>
                  </div>
                )
              }
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
                      {item.quantity && <span style={{ fontSize: '11px', padding: '1px 7px', borderRadius: '99px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.quantity}</span>}
                    </div>
                  </div>
                  <button onClick={() => startEditWish(item)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '2px 4px', flexShrink: 0 }}>✎</button>
                  <button onClick={() => onDeleteWishItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '2px 4px', flexShrink: 0 }}>×</button>
                </div>
              )
            })}
            {addingWish && (
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
                {wishError && <div style={{ fontSize: '12px', color: '#c0392b', padding: '4px 2px' }}>{wishError}</div>}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn" onClick={() => { setAddingWish(false); setWishText(''); setWishYarnId(''); setWishShop(''); setWishQty(''); setWishError('') }} style={{ flex: 1, fontSize: '13px' }}>キャンセル</button>
                  <button className="btn primary" disabled={!wishText.trim() && !wishYarnId} onClick={async () => { try { await onAddWishItem(wishText.trim(), wishYarnId || null, wishShop.trim(), wishQty.trim()); setWishText(''); setWishYarnId(''); setWishShop(''); setWishQty(''); setAddingWish(false); setWishError('') } catch(e) { setWishError(e.message || '保存に失敗しました') } }} style={{ flex: 1, fontSize: '13px' }}>追加</button>
                </div>
              </div>
            )}
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

      {viewingLabel && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.88)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setViewingLabel(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            {viewingLabel.img_url && <img src={viewingLabel.img_url} style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain', borderRadius: '10px' }} alt="" />}
            {(viewingLabel.brand || viewingLabel.color || viewingLabel.memo) && (
              <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 16px', width: '100%' }}>
                {viewingLabel.brand && <div style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>{viewingLabel.brand}</div>}
                {viewingLabel.color && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>{viewingLabel.color}</div>}
                {viewingLabel.memo && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '6px' }}>{viewingLabel.memo}</div>}
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button onClick={() => setViewingLabel(null)}
                style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>閉じる</button>
              <button onClick={() => { onDeleteLabel(viewingLabel.id); setViewingLabel(null) }}
                style={{ flex: 1, padding: '10px', background: 'rgba(180,40,40,0.8)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>削除する</button>
            </div>
          </div>
        </div>
      )}

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
