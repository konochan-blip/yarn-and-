import { useState, useEffect, useRef } from 'react'
import Modal from './Modal'
import { PersonSvg } from '../lib/svgs'

export default function ProfileForm({ open, profile, onSave, onClose }) {
  const [username, setUsername] = useState('')
  const [handle, setHandle] = useState('')
  const [bio, setBio] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [socialLinks, setSocialLinks] = useState([])
  const [linkTitleInput, setLinkTitleInput] = useState('')
  const [linkUrlInput, setLinkUrlInput] = useState('')
  const [favoriteShops, setFavoriteShops] = useState([])
  const [shopNameInput, setShopNameInput] = useState('')
  const [shopUrlInput, setShopUrlInput] = useState('')
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [knittingSince, setKnittingSince] = useState('')
  const [needleTypes, setNeedleTypes] = useState([])
  const [needleInput, setNeedleInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const imgInputRef = useRef()

  useEffect(() => {
    if (!open) return
    setUsername(profile?.username || '')
    setHandle(profile?.handle || '')
    setBio(profile?.bio || '')
    setIsPublic(profile?.is_public || false)
    const existing = profile?.social_links || []
    setSocialLinks(existing.length === 0 && profile?.link_url
      ? [{ title: 'リンク', url: profile.link_url }]
      : existing)
    setLinkTitleInput('')
    setLinkUrlInput('')
    setFavoriteShops(profile?.favorite_shops || [])
    setShopNameInput('')
    setShopUrlInput('')
    setKnittingSince(profile?.knitting_since || '')
    setNeedleTypes(profile?.needle_types || [])
    setNeedleInput('')
    setImgFile(null)
    setImgPreview(profile?.avatar_url || null)
  }, [open, profile])

  function handleImgChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImgFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImgPreview(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function addLink() {
    const url = linkUrlInput.trim()
    if (!url) return
    setSocialLinks((prev) => [...prev, { title: linkTitleInput.trim() || 'リンク', url }])
    setLinkTitleInput('')
    setLinkUrlInput('')
  }

  function removeLink(idx) {
    setSocialLinks((prev) => prev.filter((_, i) => i !== idx))
  }

  function addShop() {
    const name = shopNameInput.trim()
    if (!name) return
    setFavoriteShops((prev) => [...prev, { name, url: shopUrlInput.trim() }])
    setShopNameInput('')
    setShopUrlInput('')
  }

  function removeShop(idx) {
    setFavoriteShops((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSave() {
    if (!profile?.handle && handle && !/^[a-zA-Z0-9_.-]+$/.test(handle)) {
      setError('IDは英数字・_・-・. のみ使えます')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave({ username, handle, bio, is_public: isPublic, avatar_url: imgPreview || '', social_links: socialLinks, favorite_shops: favoriteShops, knitting_since: knittingSince || null, needle_types: needleTypes }, imgFile)
      onClose()
    } catch (e) {
      setError(e.message || 'プロフィールの保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-title">プロフィール編集</div>

      <div className="avatar-upload" onClick={() => imgInputRef.current?.click()}>
        {imgPreview ? <img src={imgPreview} alt="" /> : <PersonSvg />}
      </div>
      <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgChange} />
      <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '-10px', marginBottom: '14px' }}>タップして写真を変更</div>

      <div className="field">
        <label>ユーザー名（表示名）</label>
        <input type="text" value={username} placeholder="例：にわとり編み物部" onChange={(e) => setUsername(e.target.value)} />
      </div>

      {!profile?.handle && (
        <div className="field">
          <label>ID</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: '14px' }}>@</span>
            <input type="text" value={handle} placeholder="例：knitting_lover" style={{ paddingLeft: '26px' }}
              autoCapitalize="none" autoCorrect="off"
              onChange={(e) => setHandle(e.target.value.replace(/\s/g, ''))} />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            英数字・_・-・. が使えます<br />
            yarn-and.com/user/{handle || '（ID）'}
          </div>
        </div>
      )}

      <div className="field">
        <label>編み物を始めた年月</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select value={knittingSince ? knittingSince.split('-')[0] : ''} onChange={(e) => {
            const m = knittingSince ? knittingSince.split('-')[1] : '01'
            setKnittingSince(e.target.value ? `${e.target.value}-${m}` : '')
          }} style={{ flex: 1 }}>
            <option value="">年</option>
            {Array.from({ length: new Date().getFullYear() - 1969 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <option key={y} value={y}>{y}年</option>
            ))}
          </select>
          <select value={knittingSince ? knittingSince.split('-')[1] : ''} onChange={(e) => {
            const y = knittingSince ? knittingSince.split('-')[0] : ''
            if (y) setKnittingSince(`${y}-${e.target.value}`)
          }} style={{ flex: 1 }} disabled={!knittingSince}>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{i + 1}月</option>
            ))}
          </select>
          {knittingSince && <button type="button" onClick={() => setKnittingSince('')} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '16px', padding: '0 4px' }}>×</button>}
        </div>
      </div>

      <div className="field">
        <label>使う針</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
          {['かぎ針', '棒針', '輪針'].map((t) => (
            <button key={t} type="button" onClick={() => setNeedleTypes((prev) => prev.includes(t) ? prev.filter((n) => n !== t) : [...prev, t])}
              style={{ padding: '5px 12px', borderRadius: '99px', border: '1px solid var(--border)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
                background: needleTypes.includes(t) ? 'var(--accent)' : 'var(--surface)',
                color: needleTypes.includes(t) ? '#fff' : 'var(--text-secondary)' }}>
              {t}
            </button>
          ))}
        </div>
        {needleTypes.filter((t) => !['かぎ針','棒針','輪針'].includes(t)).map((t) => (
          <div key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--accent)', color: '#fff', borderRadius: '99px', padding: '4px 10px', fontSize: '12px', marginRight: '6px', marginBottom: '6px' }}>
            {t}
            <button type="button" onClick={() => setNeedleTypes((prev) => prev.filter((n) => n !== t))} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: 0 }}>×</button>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="text" value={needleInput} placeholder="その他（例：レース針）" onChange={(e) => setNeedleInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const v = needleInput.trim(); if (v && !needleTypes.includes(v)) { setNeedleTypes((prev) => [...prev, v]); setNeedleInput('') } } }}
            style={{ flex: 1 }} />
          <button type="button" className="btn primary" style={{ padding: '8px 14px', flexShrink: 0 }} onClick={() => { const v = needleInput.trim(); if (v && !needleTypes.includes(v)) { setNeedleTypes((prev) => [...prev, v]); setNeedleInput('') } }}>追加</button>
        </div>
      </div>

      <div className="field">
        <label>自己紹介</label>
        <textarea value={bio} placeholder="好きな毛糸や得意な編み方など…" rows={4} onChange={(e) => setBio(e.target.value)} />
      </div>

      <div className="field">
        <label>リンク</label>
        <input type="text" value={linkTitleInput} placeholder="タイトル（例：X、YouTube、ブログ）"
          onChange={(e) => setLinkTitleInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
          style={{ marginBottom: '6px' }} />
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input type="url" value={linkUrlInput} placeholder="https://..."
            onChange={(e) => setLinkUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
            style={{ flex: 1 }} />
          <button type="button" className="btn primary" style={{ padding: '8px 14px', flexShrink: 0 }} onClick={addLink}>追加</button>
        </div>
        {socialLinks.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {socialLinks.map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-light)', borderRadius: '10px', padding: '7px 10px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{l.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.url}</div>
                </div>
                <button onClick={() => removeLink(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: '16px', lineHeight: 1, padding: '0 4px', flexShrink: 0 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="field">
        <label>お気に入りのお店</label>
        <input type="text" value={shopNameInput} placeholder="お店の名前" onChange={(e) => setShopNameInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addShop())}
          style={{ marginBottom: '6px' }} />
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input type="url" value={shopUrlInput} placeholder="URL（任意）https://..." onChange={(e) => setShopUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addShop())}
            style={{ flex: 1 }} />
          <button type="button" className="btn primary" style={{ padding: '8px 14px', flexShrink: 0 }} onClick={addShop}>追加</button>
        </div>
        {favoriteShops.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {favoriteShops.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--tag-shop-bg)', borderRadius: '10px', padding: '7px 10px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', color: 'var(--tag-shop-text)', fontWeight: 500 }}>{s.name}</div>
                  {s.url && <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.url}</div>}
                </div>
                <button onClick={() => removeShop(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: '16px', lineHeight: 1, padding: '0 4px', flexShrink: 0 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: 'var(--bg)', borderRadius: '10px', padding: '4px 12px', marginBottom: '14px' }}>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">プロフィールを公開する</div>
            <div className="toggle-sub">将来のシェア機能で使用されます</div>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            <span className="toggle-track" />
            <span className="toggle-thumb" />
          </label>
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-light)', border: '1px solid #E8C4C4', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: 'var(--danger)', marginBottom: '14px' }}>{error}</div>
      )}
      <div className="modal-actions">
        <button className="btn" onClick={onClose}>キャンセル</button>
        <button className="btn primary" disabled={saving} onClick={handleSave}>{saving ? '保存中…' : '保存する'}</button>
      </div>
    </Modal>
  )
}
