import { useState, useRef } from 'react'
import Modal from './Modal'

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY

export default function LabelReader({ open, onClose, onParsed }) {
  const [images, setImages] = useState([]) // { dataUrl, id }
  const [reading, setReading] = useState(false)
  const inputRef = useRef()

  function reset() {
    setImages([])
    setReading(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const MAX = 800
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX }
          else { width = Math.round(width * MAX / height); height = MAX }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
        setImages((prev) => [...prev, { dataUrl, id: Date.now() + Math.random() }])
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function removeImage(id) {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  async function readLabel() {
    if (!images.length) return
    setReading(true)
    try {
      const prompt = `毛糸のラベル画像です。画像内のテキストをすべて読み取り、JSONのみ返してください。
{"name":"メーカー名と品名（例：ハマナカ ソノモノ、ダイソー ウール）","color":"色番号","colorname":"色名","material":"素材（例：ウール100%）","lot":"ロット番号","price":"定価（円表記）"}
読み取れない項目は空文字。JSONのみ返してください。`

      const parts = [
        ...images.map((img) => ({
          inline_data: {
            mime_type: 'image/jpeg',
            data: img.dataUrl.split(',')[1],
          },
        })),
        { text: prompt },
      ]
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts }] }),
        }
      )
      const data = await res.json()
      if (data.error) throw new Error(data.error.message || 'API error')
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const clean = text.replace(/```json|```/g, '').trim()
      let parsed = {}
      try {
        parsed = JSON.parse(clean)
      } catch {
        const m = clean.match(/\{[\s\S]*\}/)
        if (m) {
          try { parsed = JSON.parse(m[0]) } catch { /* ignore */ }
        }
      }
      const isEmpty = Object.values(parsed).every((v) => !v)
      if (isEmpty) {
        alert(`読み取れませんでした。もう一度試してみてね`)
        return
      }
      onParsed(parsed)
      handleClose()
    } catch (err) {
      alert(`読み取りに失敗したよ😢\n${err.message || 'もう一度試してみてね'}`)
    } finally {
      setReading(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="modal-title">ラベルを読み取る</div>
      <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>表・裏・複数枚OK！まとめて読み取るよ✦</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        {images.map((img) => (
          <div key={img.id} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0 }}>
            <img src={img.dataUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            <button onClick={() => removeImage(img.id)}
              style={{ position: 'absolute', top: '3px', right: '3px', width: '18px', height: '18px', borderRadius: '50%', border: 'none', background: 'rgba(58,45,50,0.7)', color: '#fff', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
          </div>
        ))}
      </div>

      <button className="btn ai" onClick={() => inputRef.current?.click()} style={{ width: '100%', marginBottom: '4px' }}>＋ 写真を追加</button>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

      {reading && <div className="ai-reading">AIが読み取り中... ✦</div>}

      <div className="modal-actions">
        <button className="btn" onClick={handleClose}>キャンセル</button>
        <button className="btn primary" disabled={images.length === 0 || reading} onClick={readLabel}>読み取る</button>
      </div>
    </Modal>
  )
}
