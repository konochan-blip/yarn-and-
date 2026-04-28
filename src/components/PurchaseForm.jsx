import { useState, useEffect, useRef } from 'react'
import Modal from './Modal'

export default function PurchaseForm({ open, editingPurchase, onSave, onClose }) {
  const [name, setName] = useState('')
  const [seller, setSeller] = useState('')
  const [price, setPrice] = useState('')
  const [memo, setMemo] = useState('')
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const imgInputRef = useRef()

  useEffect(() => {
    if (!open) return
    if (editingPurchase) {
      setName(editingPurchase.name || '')
      setSeller(editingPurchase.seller || '')
      setPrice(editingPurchase.price || '')
      setMemo(editingPurchase.memo || '')
      setImgFile(null)
      setImgPreview(editingPurchase.img_url || null)
    } else {
      setName(''); setSeller(''); setPrice(''); setMemo('')
      setImgFile(null); setImgPreview(null)
    }
  }, [open, editingPurchase])

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
      const data = { name, seller, price, memo, img_url: imgPreview || '' }
      if (editingPurchase) data.id = editingPurchase.id
      await onSave(data, imgFile)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-title">{editingPurchase ? '購入品を編集' : '購入品を追加'}</div>

      <div className="img-preview" onClick={() => imgInputRef.current?.click()}>
        {imgPreview ? <img src={imgPreview} alt="" /> : <div className="img-placeholder-text">タップして写真を選択</div>}
      </div>
      <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgChange} />

      <div className="field"><label>商品名</label><input type="text" value={name} placeholder="例：手編みのニット帽" onChange={(e) => setName(e.target.value)} /></div>
      <div className="field"><label>購入先・作家名</label><input type="text" value={seller} placeholder="例：〇〇さん・Creema・雑貨屋さん" onChange={(e) => setSeller(e.target.value)} /></div>
      <div className="field"><label>価格</label><input type="text" value={price} placeholder="例：2,500円" onChange={(e) => setPrice(e.target.value)} /></div>
      <div className="field"><label>メモ</label><textarea value={memo} placeholder="いつ買ったか・感想など" onChange={(e) => setMemo(e.target.value)} /></div>

      <div className="modal-actions">
        <button className="btn" onClick={onClose}>キャンセル</button>
        <button className="btn primary" disabled={saving} onClick={handleSave}>{saving ? '保存中…' : '保存する'}</button>
      </div>
    </Modal>
  )
}
