import { useState, useEffect, useRef } from 'react'
import Modal from './Modal'
import { PersonSvg } from '../lib/svgs'

export default function ProfileForm({ open, profile, onSave, onClose }) {
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const imgInputRef = useRef()

  useEffect(() => {
    if (!open) return
    setUsername(profile?.username || '')
    setBio(profile?.bio || '')
    setIsPublic(profile?.is_public || false)
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

  async function handleSave() {
    setSaving(true)
    try {
      await onSave({ username, bio, is_public: isPublic, avatar_url: imgPreview || '' }, imgFile)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-title">プロフィール編集</div>

      <div className="avatar-upload" onClick={() => imgInputRef.current?.click()}>
        {imgPreview
          ? <img src={imgPreview} alt="" />
          : <PersonSvg />
        }
      </div>
      <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgChange} />
      <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '-10px', marginBottom: '14px' }}>タップして写真を変更</div>

      <div className="field">
        <label>ユーザー名</label>
        <input type="text" value={username} placeholder="例：にわとり編み物部" onChange={(e) => setUsername(e.target.value)} />
      </div>

      <div className="field">
        <label>自己紹介</label>
        <textarea value={bio} placeholder="好きな毛糸や得意な編み方など…" rows={4} onChange={(e) => setBio(e.target.value)} />
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

      <div className="modal-actions">
        <button className="btn" onClick={onClose}>キャンセル</button>
        <button className="btn primary" disabled={saving} onClick={handleSave}>{saving ? '保存中…' : '保存する'}</button>
      </div>
    </Modal>
  )
}
