import { useState, useEffect, useRef } from 'react'
import Modal from './Modal'
import { YarnSvgSm, BookSvgSm } from '../lib/svgs'

const NEEDLES = ['かぎ針', '棒針', '輪針', 'その他']

export default function WorkForm({ open, editingWork, yarns, books, workCategories, onSave, onClose, onOpenCategorySettings }) {
  const [name, setName] = useState('')
  const [needle, setNeedle] = useState('')
  const [memo, setMemo] = useState('')
  const [privateMemo, setPrivateMemo] = useState('')
  const [ref, setRef] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedYarnIds, setSelectedYarnIds] = useState([])
  const [selectedBookIds, setSelectedBookIds] = useState([])
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [patternItems, setPatternItems] = useState([])
  const [status, setStatus] = useState('制作中')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [yarnUsages, setYarnUsages] = useState({})
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
      setCategories(editingWork.categories || [])
      setSelectedYarnIds(editingWork.yarn_ids || [])
      setSelectedBookIds(editingWork.book_ids || [])
      setImgFile(null)
      setImgPreview(editingWork.img_url || null)
      setPatternItems((editingWork.pattern_imgs || []).map((url) => ({ preview: url, file: null })))
      setStatus(editingWork.status || '完成')
      setStartDate(editingWork.start_date || '')
      setEndDate(editingWork.end_date || '')
      setYarnUsages(editingWork.yarn_usages || {})
    } else {
      setName(''); setNeedle(''); setMemo(''); setPrivateMemo(''); setRef('')
      setCategories([])
      setSelectedYarnIds([]); setSelectedBookIds([])
      setImgFile(null); setImgPreview(null); setPatternItems([])
      setStatus('制作中')
      setStartDate(''); setEndDate('')
      setYarnUsages({})
    }
  }, [open, editingWork])

  function toggleCategory(c) {
    setCategories((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])
  }

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
      const data = { name, needle, memo, private_memo: privateMemo, ref, categories, yarn_ids: selectedYarnIds, book_ids: selectedBookIds, img_url: imgPreview || '', patternItems, status, start_date: startDate || null, end_date: endDate || null, yarn_usages: yarnUsages }
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

      <div className="field">
        <label>ステータス</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['制作中', '完成'].map((s) => (
            <button key={s} type="button" onClick={() => setStatus(s)}
              style={{ flex: 1, padding: '8px', borderRadius: '99px', border: status === s ? '1.5px solid var(--accent)' : '1.5px solid var(--border)', background: status === s ? 'var(--accent)' : 'var(--surface)', color: status === s ? '#fff' : 'var(--text-secondary)', fontSize: '13px', fontFamily: 'inherit', cursor: 'pointer', fontWeight: status === s ? 600 : 400 }}>
              {s === '制作中' ? '🧶 制作中' : '✓ 完成'}
            </button>
          ))}
        </div>
        {status === '制作中' && (
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#8C6272', background: '#F3EEF1', border: '1px solid #DCCDD4', borderRadius: '8px', padding: '7px 12px' }}>
            🔒 制作中の作品は自分のみ見えます（他のユーザーには表示されません）
          </div>
        )}
      </div>

      <div className="field"><label>作品名</label><input type="text" value={name} placeholder="例：フリルスカート、帽子など" onChange={(e) => setName(e.target.value)} /></div>

      <div className="field">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label style={{ margin: 0 }}>カテゴリー</label>
          {onOpenCategorySettings && (
            <button type="button" onClick={onOpenCategorySettings}
              style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 0' }}>
              ＋ カテゴリーを編集
            </button>
          )}
        </div>
        {(() => {
          const orphaned = categories.filter((c) => c !== 'その他' && !(workCategories || []).includes(c))
          const displayCategories = [...(workCategories || []), ...orphaned, 'その他']
          return workCategories?.length === 0 && orphaned.length === 0
            ? <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', padding: '6px 0' }}>「カテゴリーを編集」から追加してね</div>
            : <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {displayCategories.map((c) => (
                  <button key={c} type="button" onClick={() => toggleCategory(c)}
                    style={{ padding: '7px 14px', borderRadius: '99px', border: categories.includes(c) ? '1.5px solid var(--accent)' : '1.5px solid var(--border)', background: categories.includes(c) ? 'var(--accent)' : 'var(--surface)', color: categories.includes(c) ? '#fff' : 'var(--text-secondary)', fontSize: '13px', fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.15s', fontWeight: categories.includes(c) ? 600 : 400 }}>
                    {c}
                  </button>
                ))}
              </div>
        })()}
      </div>

      <div className="field">
        <label>編み方</label>
        <div className="needle-options">
          {NEEDLES.map((n) => (
            <label key={n} className={`needle-label${needle === n ? ' checked' : ''}`} onClick={() => setNeedle(needle === n ? '' : n)}>{n}</label>
          ))}
        </div>
      </div>

      <div className="field">
        <label>使った毛糸</label>
        <div className="yarn-select-list">
          {yarns.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '8px' }}>先に毛糸を登録してね</div>
          ) : yarns.map((yarn) => (
            <div key={yarn.id}>
              <div className={`yarn-select-item${selectedYarnIds.includes(yarn.id) ? ' selected' : ''}`} onClick={() => toggleYarn(yarn.id)}>
                <div className="yarn-select-thumb">{yarn.img_url ? <img src={yarn.img_url} alt="" /> : <YarnSvgSm />}</div>
                <span>{yarn.name || '名前なし'}{yarn.colorname ? ` · ${yarn.colorname}` : ''}</span>
              </div>
              {selectedYarnIds.includes(yarn.id) && (
                <input type="text"
                  value={yarnUsages[yarn.id] || ''}
                  placeholder="使用量（例：1玉、50g）"
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setYarnUsages((prev) => ({ ...prev, [yarn.id]: e.target.value }))}
                  style={{ margin: '4px 0 6px 0', fontSize: '13px', padding: '6px 10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' }} />
              )}
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

      <div className="field"><textarea value={ref} placeholder="編み図・作り方参考URL" onChange={(e) => setRef(e.target.value)} /></div>

      <div className="field">
        <label>制作期間</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ flex: 1 }} />
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>〜</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ flex: 1 }} />
        </div>
        {startDate && endDate && (() => {
          const s = new Date(startDate), e = new Date(endDate)
          const days = Math.round((e - s) / 86400000)
          if (days < 0) return <div style={{ fontSize: '12px', color: '#c0392b', marginTop: '4px' }}>完成日が開始日より前になっています</div>
          const text = days === 0 ? '1日' : days < 7 ? `${days}日` : days < 30 ? `${Math.floor(days/7)}週間${days%7 > 0 ? `${days%7}日` : ''}` : `${Math.floor(days/30)}ヶ月${days%30 > 0 ? `${days%30}日` : ''}`
          return <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600, marginTop: '6px' }}>📅 制作期間：{text}</div>
        })()}
      </div>



      <div className="field"><label>メモ</label><textarea value={memo} placeholder="使用針・サイズ・感想など" onChange={(e) => setMemo(e.target.value)} /></div>
      <div className="field"><label>自分メモ（非公開）</label><textarea value={privateMemo} placeholder="自分だけのメモ。他の人には見えません" rows={3} onChange={(e) => setPrivateMemo(e.target.value)} /></div>

      <div className="modal-actions">
        <button className="btn" onClick={onClose}>キャンセル</button>
        <button className="btn primary" disabled={saving} onClick={handleSave}>{saving ? '保存中…' : '保存する'}</button>
      </div>
    </Modal>
  )
}
