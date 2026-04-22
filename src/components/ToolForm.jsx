import { useState, useEffect, useRef } from 'react'
import Modal from './Modal'

export default function ToolForm({ open, editingTool, onSave, onClose }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [size, setSize] = useState('')
  const [memo, setMemo] = useState('')
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const imgInputRef = useRef()

  useEffect(() => {
    if (!open) return
    if (editingTool) {
      setName(editingTool.name || '')
      setType(editingTool.type || '')
      setSize(editingTool.size || '')
      setMemo(editingTool.memo || '')
      setImgFile(null)
      setImgPreview(editingTool.img_url || null)
    } else {
      setName(''); setType(''); setSize(''); setMemo('')
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
      const data = { name, type, size, memo, img_url: imgPreview || '' }
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

      <div className="field"><label>名前・メーカー</label><input type="text" value={name} placeholder="例：クロバー かぎ針 3号" onChange={(e) => setName(e.target.value)} /></div>
      <div className="field">
        <label>種類</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">選択してね</option>
          <option>かぎ針</option><option>棒針</option><option>輪針</option>
          <option>とじ針</option><option>段数マーカー</option><option>その他</option>
        </select>
      </div>
      <div className="field"><label>サイズ・号数</label><input type="text" value={size} placeholder="例：3号 / 2.3mm" onChange={(e) => setSize(e.target.value)} /></div>
      <div className="field"><label>メモ</label><textarea value={memo} placeholder="使い心地・購入店・メモなど" onChange={(e) => setMemo(e.target.value)} /></div>

      <div className="modal-actions">
        <button className="btn" onClick={onClose}>キャンセル</button>
        <button className="btn primary" disabled={saving} onClick={handleSave}>{saving ? '保存中…' : '保存する'}</button>
      </div>
    </Modal>
  )
}
