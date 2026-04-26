import { useState, useRef } from 'react'
import Modal from './Modal'

const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

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
      setImages((prev) => [...prev, { dataUrl: ev.target.result, id: Date.now() + Math.random() }])
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
      const content = [
        ...images.map((img) => ({
          type: 'image',
          source: {
            type: 'base64',
            media_type: img.dataUrl.split(';')[0].split(':')[1],
            data: img.dataUrl.split(',')[1],
          },
        })),
        {
          type: 'text',
          text: `毛糸のラベル画像です。画像内のテキストをすべて丁寧に読み取り、以下のJSONフォーマットのみで返してください。

{
  "name": "メーカー名＋品名または品番（例：ハマナカ ソノモノ、ダルマ iroiro）",
  "color": "色番号（数字のみ、例：8、205）",
  "colorname": "色名（例：ネイビー、ミントグリーン）",
  "material": "素材構成（例：ウール100%、ウール70%アクリル30%）",
  "lot": "ロット番号（LOT、ロットと書かれた番号）",
  "price": "定価（円表記、例：550円）"
}

読み取れない・記載のない項目は空文字にしてください。
メーカー例：ハマナカ、ダルマ（横田）、リッチモア、パピー、ニッケビクター、ナスカ、オリムパス、ダイソー、セリア、キャンドゥなど100均ブランドも含む。
シンプルなラベルでも読み取れる情報をすべて抽出してください。
JSONのみ返してください。マークダウン不要。`,
        },
      ]
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          messages: [
            { role: 'user', content },
            { role: 'assistant', content: '{' },
          ],
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error.message || 'API error')
      const text = '{' + (data.content || []).map((i) => i.text || '').join('')
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
        alert(`読み取れませんでした。\nAIの返答：${clean.slice(0, 200)}`)
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
