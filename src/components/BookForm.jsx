import { useState, useEffect, useRef } from 'react'
import Modal from './Modal'

export default function BookForm({ open, editingBook, onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [publisher, setPublisher] = useState('')
  const [memo, setMemo] = useState('')
  const [link, setLink] = useState('')
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const imgInputRef = useRef()

  useEffect(() => {
    if (!open) return
    if (editingBook) {
      setTitle(editingBook.title || '')
      setAuthor(editingBook.author || '')
      setPublisher(editingBook.publisher || '')
      setMemo(editingBook.memo || '')
      setLink(editingBook.link || '')
      setImgFile(null)
      setImgPreview(editingBook.img_url || null)
    } else {
      setTitle(''); setAuthor(''); setPublisher(''); setMemo(''); setLink('')
      setImgFile(null); setImgPreview(null)
    }
  }, [open, editingBook])

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
      const data = { title, author, publisher, memo, link, img_url: imgPreview || '' }
      if (editingBook) data.id = editingBook.id
      await onSave(data, imgFile)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-title">{editingBook ? '書籍を編集' : '書籍を追加'}</div>

      <div className="img-preview" onClick={() => imgInputRef.current?.click()}>
        {imgPreview ? <img src={imgPreview} alt="" /> : <div className="img-placeholder-text">タップして表紙写真を選択</div>}
      </div>
      <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgChange} />

      <div className="field"><label>タイトル</label><input type="text" value={title} placeholder="例：かぎ針で編むあみぐるみ" onChange={(e) => setTitle(e.target.value)} /></div>
      <div className="field"><label>著者</label><input type="text" value={author} placeholder="例：山田 花子" onChange={(e) => setAuthor(e.target.value)} /></div>
      <div className="field"><label>出版社</label><input type="text" value={publisher} placeholder="例：日本ヴォーグ社" onChange={(e) => setPublisher(e.target.value)} /></div>
      <div className="field"><label>リンク（Amazon など）</label><input type="url" value={link} placeholder="https://www.amazon.co.jp/..." onChange={(e) => setLink(e.target.value)} /></div>
      <div className="field"><label>メモ</label><textarea value={memo} placeholder="お気に入りのページ・感想など" onChange={(e) => setMemo(e.target.value)} /></div>

      <div className="modal-actions">
        <button className="btn" onClick={onClose}>キャンセル</button>
        <button className="btn primary" disabled={saving} onClick={handleSave}>{saving ? '保存中…' : '保存する'}</button>
      </div>
    </Modal>
  )
}
