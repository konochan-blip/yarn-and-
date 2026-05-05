import { useState, useEffect, useRef } from 'react'
import Modal from './Modal'

export default function ToolForm({ open, editingTool, makers = [], onSave, onClose, onOpenMakerSettings }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [typeCustom, setTypeCustom] = useState('')
  const [size, setSize] = useState('')
  const [needleSize, setNeedleSize] = useState('')
  const [price, setPrice] = useState('')
  const [memo, setMemo] = useState('')
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const imgInputRef = useRef()

  const PRESET_TYPES = ['かぎ針', '棒針', '輪針', 'とじ針', '段数マーカー', 'その他']

  useEffect(() => {
    if (!open) return
    if (editingTool) {
      setName(editingTool.name || '')
      const t = editingTool.type || ''
      if (t && !PRESET_TYPES.includes(t)) {
        setType('その他')
        setTypeCustom(t)
      } else {
        setType(t)
        setTypeCustom('')
      }
      setNeedleSize(editingTool.needle_size || '')
      setSize(editingTool.size || '')
      setPrice(editingTool.price || '')
      setMemo(editingTool.memo || '')
      setImgFile(null)
      setImgPreview(editingTool.img_url || null)
    } else {
      setName(''); setType(''); setTypeCustom(''); setNeedleSize(''); setSize(''); setPrice(''); setMemo('')
      setImgFile(null); setImgPreview(null)
    }
  }, [open, editingTool])

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
      const effectiveType = type === 'その他' ? (typeCustom.trim() || 'その他') : type
      const data = { name, type: effectiveType, needle_size: needleSize, size, price, memo, img_url: imgPreview || '' }
      if (editingTool) data.id = editingTool.id
      await onSave(data, imgFile)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-title">{editingTool ? '道具を編集' : '道具を追加'}</div>

      <div className="img-preview" onClick={() => imgInputRef.current?.click()}>
        {imgPreview ? <img src={imgPreview} alt="" /> : <div className="img-placeholder-text">タップして写真を選択</div>}
      </div>
      <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgChange} />

      <div className="field">
        <label>種類</label>
        <select value={type} onChange={(e) => { setType(e.target.value); if (e.target.value !== 'その他') setTypeCustom('') }}>
          <option value="">選択してね</option>
          <option>かぎ針</option><option>棒針</option><option>輪針</option>
          <option>とじ針</option><option>段数マーカー</option><option>その他</option>
        </select>
      </div>
      {type === 'その他' && (
        <div className="field"><label>種類（詳細）</label><input type="text" value={typeCustom} placeholder="例：ニッティングスレーダー" onChange={(e) => setTypeCustom(e.target.value)} /></div>
      )}
      <div className="field">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label style={{ margin: 0 }}>メーカー</label>
          {onOpenMakerSettings && (
            <button type="button" onClick={onOpenMakerSettings}
              style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 0' }}>
              ＋ メーカーを編集
            </button>
          )}
        </div>
        {makers.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {makers.map((m) => (
              <button key={m} type="button" onClick={() => setName(name === m ? '' : m)}
                style={{ padding: '7px 14px', borderRadius: '99px', border: name === m ? '1.5px solid var(--accent)' : '1.5px solid var(--border)', background: name === m ? 'var(--accent)' : 'var(--surface)', color: name === m ? '#fff' : 'var(--text-secondary)', fontSize: '13px', fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.15s', fontWeight: name === m ? 600 : 400 }}>
                {m}
              </button>
            ))}
          </div>
        ) : (
          <input type="text" value={name} placeholder="例：クロバー" onChange={(e) => setName(e.target.value)} />
        )}
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div className="field" style={{ flex: 1 }}><label>号数</label><input type="text" value={needleSize} placeholder="例：3号" onChange={(e) => setNeedleSize(e.target.value)} /></div>
        <div className="field" style={{ flex: 1 }}><label>サイズ</label><input type="text" value={size} placeholder="例：2.3mm" onChange={(e) => setSize(e.target.value)} /></div>
      </div>
      <div className="field"><label>価格</label><input type="text" value={price} placeholder="例：550円" onChange={(e) => setPrice(e.target.value)} /></div>
      <div className="field"><label>メモ</label><textarea value={memo} placeholder="使い心地・購入店・メモなど" onChange={(e) => setMemo(e.target.value)} /></div>

      <div className="modal-actions">
        <button className="btn" onClick={onClose}>キャンセル</button>
        <button className="btn primary" disabled={saving} onClick={handleSave}>{saving ? '保存中…' : '保存する'}</button>
      </div>
    </Modal>
  )
}
