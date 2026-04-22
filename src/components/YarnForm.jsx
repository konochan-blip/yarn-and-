import { useState, useEffect, useRef } from 'react'
import Modal from './Modal'
import LabelReader from './LabelReader'
import { YarnSvgSm } from '../lib/svgs'

export default function YarnForm({ open, editingYarn, shops, yarns, onSave, onClose, onMergeCount }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [colorname, setColorname] = useState('')
  const [material, setMaterial] = useState('')
  const [lot, setLot] = useState('')
  const [count, setCount] = useState('')
  const [price, setPrice] = useState('')
  const [memo, setMemo] = useState('')
  const [selectedShops, setSelectedShops] = useState([])
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [labelReaderOpen, setLabelReaderOpen] = useState(false)
  const [similar, setSimilar] = useState([])
  const [mergeInputs, setMergeInputs] = useState({}) // id -> count string
  const imgInputRef = useRef()

  useEffect(() => {
    if (!open) return
    if (editingYarn) {
      setName(editingYarn.name || '')
      setColor(editingYarn.color || '')
      setColorname(editingYarn.colorname || '')
      setMaterial(editingYarn.material || '')
      setLot(editingYarn.lot || '')
      setCount(String(editingYarn.count || ''))
      setPrice(editingYarn.price || '')
      setMemo(editingYarn.memo || '')
      setSelectedShops(editingYarn.shops || [])
      setImgFile(null)
      setImgPreview(editingYarn.img_url || null)
    } else {
      setName(''); setColor(''); setColorname(''); setMaterial(''); setLot('')
      setCount(''); setPrice(''); setMemo(''); setSelectedShops([])
      setImgFile(null); setImgPreview(null)
    }
    setSimilar([])
    setMergeInputs({})
  }, [open, editingYarn])

  function handleImgChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImgFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImgPreview(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function toggleShop(s) {
    setSelectedShops((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }

  function checkSimilar(n, c) {
    const nameVal = (n ?? name).trim().toLowerCase()
    const colorVal = (c ?? color).trim().toLowerCase()
    if (!nameVal && !colorVal) { setSimilar([]); return }
    const found = yarns.filter((item) => {
      if (editingYarn && item.id === editingYarn.id) return false
      const itemName = (item.name || '').toLowerCase()
      const itemColor = (item.color || '').toLowerCase()
      const nameMatch = nameVal.length >= 2 && itemName.includes(nameVal.split(' ')[0])
      const colorMatch = colorVal.length >= 1 && itemColor.includes(colorVal)
      return nameMatch || colorMatch
    }).slice(0, 3)
    setSimilar(found)
    const inputs = {}
    found.forEach((item) => { inputs[item.id] = '1' })
    setMergeInputs(inputs)
  }

  function handleLabelParsed(data) {
    if (data.name) setName(data.name)
    if (data.color) setColor(data.color)
    if (data.colorname) setColorname(data.colorname)
    if (data.material) setMaterial(data.material)
    if (data.lot) setLot(data.lot)
    if (data.price) setPrice(data.price)
    checkSimilar(data.name || name, data.color || color)
  }

  async function handleSave() {
    // duplicate check (only on new items)
    if (!editingYarn && color) {
      const dupIdx = yarns.findIndex((item) => item.color && item.color.trim() === color.trim())
      if (dupIdx >= 0) {
        const existing = yarns[dupIdx]
        const existCount = Number(existing.count) || 0
        const addCount = Number(count) || 0
        const ok = window.confirm(
          `「${existing.name || '登録済み'} / 色番号:${existing.color}」がすでに${existCount}本登録されてるよ！\n${addCount}本追加して合計${existCount + addCount}本にする？\n\nOK → 在庫を追加\nキャンセル → 別々に登録`
        )
        if (ok) {
          await onMergeCount(existing.id, existCount + addCount)
          onClose()
          return
        }
      }
    }

    setSaving(true)
    try {
      const data = { name, color, colorname, material, lot, count: Number(count) || 0, price, memo, shops: selectedShops, img_url: imgPreview || '' }
      if (editingYarn) data.id = editingYarn.id
      await onSave(data, imgFile)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  async function handleMerge(yarnId) {
    const yarn = yarns.find((y) => y.id === yarnId)
    if (!yarn) return
    const add = Number(mergeInputs[yarnId]) || 1
    await onMergeCount(yarnId, (Number(yarn.count) || 0) + add)
    onClose()
  }

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div className="modal-title">{editingYarn ? '毛糸を編集' : '毛糸追加'}</div>

        <div className="img-preview" onClick={() => imgInputRef.current?.click()}>
          {imgPreview ? <img src={imgPreview} alt="" /> : <div className="img-placeholder-text">タップして写真を選択</div>}
        </div>
        <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgChange} />

        <div className="ai-btn-row">
          <button className="btn ai" onClick={() => setLabelReaderOpen(true)}>✦ ラベル写真から自動入力</button>
        </div>

        <div className="field">
          <label>名前・品番</label>
          <input type="text" value={name} placeholder="例：ハマナカ ボニー"
            onChange={(e) => { setName(e.target.value); checkSimilar(e.target.value, color) }} />
        </div>
        <div className="field">
          <label>色番号</label>
          <input type="text" value={color} placeholder="例：602"
            onChange={(e) => { setColor(e.target.value); checkSimilar(name, e.target.value) }} />
        </div>

        {similar.length > 0 && (
          <div className="similar-box">
            <div className="similar-title">似てる毛糸が登録済みだよ！</div>
            {similar.map((item) => (
              <div key={item.id} className="similar-item">
                <div className="similar-thumb">
                  {item.img_url ? <img src={item.img_url} alt="" /> : <YarnSvgSm />}
                </div>
                <div className="similar-info">
                  <div className="similar-name">{item.name || '名前なし'}</div>
                  <div className="similar-sub">色番号:{item.color || '—'} / 現在{item.count || 0}本</div>
                </div>
                <div className="similar-add">
                  <input type="number" min="1" value={mergeInputs[item.id] || '1'}
                    onChange={(e) => setMergeInputs((prev) => ({ ...prev, [item.id]: e.target.value }))} />
                  <button onClick={() => handleMerge(item.id)}>追加</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="field"><label>色</label><input type="text" value={colorname} placeholder="例：ネイビー、ミントグリーン" onChange={(e) => setColorname(e.target.value)} /></div>
        <div className="field"><label>素材</label><input type="text" value={material} placeholder="例：ウール50% コットン50%" onChange={(e) => setMaterial(e.target.value)} /></div>
        <div className="field"><label>ロット番号</label><input type="text" value={lot} placeholder="例：L204" onChange={(e) => setLot(e.target.value)} /></div>
        <div className="field"><label>本数</label><input type="number" value={count} placeholder="例：5" min="0" onChange={(e) => setCount(e.target.value)} /></div>
        <div className="field"><label>定価</label><input type="text" value={price} placeholder="例：550円" onChange={(e) => setPrice(e.target.value)} /></div>
        <div className="field"><label>メモ</label><textarea value={memo} placeholder="購入店・URL・メモなど" onChange={(e) => setMemo(e.target.value)} /></div>

        <div className="field">
          <label>購入したお店</label>
          <div className="shops-check">
            {[...shops, 'その他'].map((s) => (
              <label key={s} className={`shop-label${selectedShops.includes(s) ? ' checked' : ''}`}>
                <input type="checkbox" checked={selectedShops.includes(s)} onChange={() => toggleShop(s)} />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>キャンセル</button>
          <button className="btn primary" disabled={saving} onClick={handleSave}>{saving ? '保存中…' : '保存する'}</button>
        </div>
      </Modal>

      <LabelReader open={labelReaderOpen} onClose={() => setLabelReaderOpen(false)} onParsed={handleLabelParsed} />
    </>
  )
}
