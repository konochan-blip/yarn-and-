import { useState, useEffect, useRef } from 'react'
import Modal from './Modal'
import { YarnSvgSm, BookSvgSm } from '../lib/svgs'

const NEEDLES = ['かぎ針', '棒針', '輪針', 'その他']

export default function WorkForm({ open, editingWork, yarns, books, onSave, onClose }) {
  const [name, setName] = useState('')
  const [needle, setNeedle] = useState('')
  const [memo, setMemo] = useState('')
  const [privateMemo, setPrivateMemo] = useState('')
  const [ref, setRef] = useState('')
  const [selectedYarnIds, setSelectedYarnIds] = useState([])
  const [selectedBookIds, setSelectedBookIds] = useState([])
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [patternItems, setPatternItems] = useState([]) // [{preview, file}]
  const [saving, setSaving] = useState(false)
  const imgInputRef = useRef()
  const patternInputRef = useRef()

  useEffect(() => {
    if (!open) return
    if (editingWork) {
      setName(editingWork.name || '')
      setNeedle(editingWork.needle || '')
      setMemo(editingWork.memo || '')
      setPrivateMemo(editingWork.private_memo || '')
      setRef(editingWork.ref || '')
      setSelectedYarnIds(editingWork.yarn_ids || [])
      setSelectedBookIds(editingWork.book_ids || [])
      setImgFile(null)
      setImgPreview(editingWork.img_url || null)
      setPatternItems((editingWork.pattern_imgs || []).map((url) => ({ preview: url, file: null })))
    } else {
      setName(''); setNeedle(''); setMemo(''); setPrivateMemo(''); setRef('')
      setSelectedYarnIds([]); setSelectedBookIds([])
      setImgFile(null); setImgPreview(null); setPatternItems([])
    }
  }, [open, editingWork])

  function handleImgChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImgFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImgPreview(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handlePatternImgAdd(e) {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => setPatternItems((prev) => [...prev, { preview: ev.target.result, file }])
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  function removePatternItem(idx) {
    setPatternItems((prev) => prev.filter((_, i) => i !== idx))
  }

  function toggleYarn(id) {
    setSelectedYarnIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  function toggleBook(id) {
    setSelectedBookIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  async function handleSave() {
    setSaving(true)
    try {
      const data = { name, needle, memo, private_memo: privateMemo, ref, yarn_ids: selectedYarnIds, book_ids: selectedBookIds, img_url: imgPreview || '', patternItems }
      if (editingWork) data.id = editingWork.id
      await onSave(data, imgFile)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-title">{editingWork ? '作品を編集' : '作品を追加'}</div>

      <div className="img-preview" onClick={() => imgInputRef.current?.click()}>
        {imgPreview ? <img src={imgPreview} alt="" /> : <div className="img-placeholder-text">タップして写真を選択</div>}
      </div>
      <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgChange} />

      <div className="field"><label>作品名</label><input type="text" value={name} placeholder="例：フリルスカート、帽子など" onChange={(e) => setName(e.target.value)} /></div>

      <div className="field">
        <label>編み方</label>
        <div className="needle-options">
          {NEEDLES.map((n) => (
            <label key={n} className={`needle-label${needle === n ? ' checked' : ''}`} onClick={() => setNeedle(needle === n ? '' : n)}>{n}</label>
          ))}
        </div>
      </div>

      {/* 編み図写真 */}
      <div className="field">
        <label>編み図・参考写真</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px', marginBottom: '8px' }}>
          {patternItems.map((item, idx) => (
            <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '10px', overflow: 'hidden', background: 'var(--surface-2)' }}>
              <img src={item.preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              <button onClick={() => removePatternItem(idx)}
                style={{ position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
            </div>
          ))}
          <button onClick={() => patternInputRef.current?.click()}
            style={{ aspectRatio: '1', borderRadius: '10px', border: '1.5px dashed var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: 'var(--text-tertiary)' }}>＋</button>
        </div>
        <input ref={patternInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePatternImgAdd} />
      </div>

      <div className="field"><label>メモ</label><textarea value={memo} placeholder="使用針・サイズ・感想など" onChange={(e) => setMemo(e.target.value)} /></div>
      <div className="field"><label>自分メモ（非公開）</label><textarea value={privateMemo} placeholder="自分だけのメモ。他の人には見えません" rows={3} onChange={(e) => setPrivateMemo(e.target.value)} /></div>
      <div className="field"><textarea value={ref} placeholder="編み図・作り方参考URL" onChange={(e) => setRef(e.target.value)} /></div>

      <div className="field">
        <label>使った毛糸</label>
        <div className="yarn-select-list">
          {yarns.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '8px' }}>先に毛糸を登録してね</div>
          ) : yarns.map((yarn) => (
            <div key={yarn.id} className={`yarn-select-item${selectedYarnIds.includes(yarn.id) ? ' selected' : ''}`} onClick={() => toggleYarn(yarn.id)}>
              <div className="yarn-select-thumb">{yarn.img_url ? <img src={yarn.img_url} alt="" /> : <YarnSvgSm />}</div>
              <span>{yarn.name || '名前なし'}{yarn.colorname ? ` · ${yarn.colorname}` : ''}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="field">
        <label>参考にした書籍</label>
        <div className="yarn-select-list">
          {books.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '8px' }}>先に書籍を登録してね</div>
          ) : books.map((book) => (
            <div key={book.id} className={`yarn-select-item${selectedBookIds.includes(book.id) ? ' selected' : ''}`} onClick={() => toggleBook(book.id)}>
              <div className="yarn-select-thumb">{book.img_url ? <img src={book.img_url} alt="" /> : <BookSvgSm />}</div>
              <span>{book.title || '無題'}{book.author ? ` · ${book.author}` : ''}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-actions">
        <button className="btn" onClick={onClose}>キャンセル</button>
        <button className="btn primary" disabled={saving} onClick={handleSave}>{saving ? '保存中…' : '保存する'}</button>
      </div>
    </Modal>
  )
}
