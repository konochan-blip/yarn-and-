import { useState, useRef } from 'react'
import Modal from './Modal'
import { YarnSvgSm } from '../lib/svgs'

const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export default function LabelSearch({ open, onClose, yarns, onOpenDetail }) {
  const [images, setImages] = useState([])
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState(null) // null = not searched yet
  const inputRef = useRef()

  function handleClose() {
    setImages([])
    setSearching(false)
    setResults(null)
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

  async function doSearch() {
    if (!images.length) return
    setSearching(true)
    setResults(null)
    try {
      const content = [
        ...images.map((img) => ({
          type: 'image',
          source: { type: 'base64', media_type: img.dataUrl.split(';')[0].split(':')[1], data: img.dataUrl.split(',')[1] },
        })),
        { type: 'text', text: 'この毛糸のラベル画像から情報を読み取りJSONのみ返してください。{"name":"メーカー名と品番","color":"色番号","colorname":"色名","material":"素材","lot":"ロット番号","price":"定価"} JSONのみ。' },
      ]
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({ model: 'claude-sonnet-4-5', max_tokens: 500, messages: [{ role: 'user', content }] }),
      })
      const data = await res.json()
      const text = (data.content || []).map((i) => i.text || '').join('')
      let parsed = {}
      try { parsed = JSON.parse(text.replace(/```json|```/g, '').trim()) } catch {
        const m = text.match(/\{[\s\S]*\}/)
        if (m) try { parsed = JSON.parse(m[0]) } catch {}
      }

      const found = yarns.filter((item) => {
        const nameMatch = parsed.name && item.name && item.name.toLowerCase().includes(parsed.name.toLowerCase().split(' ')[0])
        const colorMatch = parsed.color && item.color && item.color === parsed.color
        return nameMatch || colorMatch
      })
      setResults({ yarns: found, query: parsed })
    } catch {
      setResults({ error: true })
    } finally {
      setSearching(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="modal-title">ラベルで検索</div>
      <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>持ってるかな？ラベルを撮って確認しよう✦</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        {images.map((img) => (
          <div key={img.id} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0 }}>
            <img src={img.dataUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            <button onClick={() => removeImage(img.id)}
              style={{ position: 'absolute', top: '3px', right: '3px', width: '18px', height: '18px', borderRadius: '50%', border: 'none', background: 'rgba(58,45,50,0.7)', color: '#fff', fontSize: '11px', cursor: 'pointer', lineHeight: 1 }}>×</button>
          </div>
        ))}
      </div>

      <button className="btn ai" onClick={() => inputRef.current?.click()} style={{ width: '100%', marginBottom: '4px' }}>＋ 写真を追加</button>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

      {searching && <div className="ai-reading" style={{ marginTop: '8px' }}>AIが照合中... ✦</div>}

      {results && (
        <div style={{ marginTop: '12px' }}>
          {results.error ? (
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '12px', textAlign: 'center' }}>読み取りに失敗したよ😢</div>
          ) : results.yarns.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '12px', textAlign: 'center' }}>
              在庫にないみたい！<br />
              <span style={{ fontSize: '11px' }}>{results.query.name || ''} {results.query.color ? `色番号:${results.query.color}` : ''}</span>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '8px', letterSpacing: '0.04em' }}>見つかったよ！</div>
              <div className="list">
                {results.yarns.map((item) => (
                  <div key={item.id} className="yarn-row" onClick={() => { handleClose(); onOpenDetail(item) }}>
                    <div className="yarn-thumb">{item.img_url ? <img src={item.img_url} alt="" /> : <YarnSvgSm />}</div>
                    <div className="yarn-info">
                      <div className="yarn-name">{item.name || '名前なし'}</div>
                      <div className="yarn-tags">
                        {item.colorname ? <span className="tag color-name">{item.colorname}</span> : null}
                        {item.material ? <span className="tag">{item.material}</span> : null}
                      </div>
                    </div>
                    <div className="yarn-count"><span className="count-num">{item.count || 0}</span><span className="count-unit">本</span></div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="modal-actions">
        <button className="btn" onClick={handleClose}>閉じる</button>
        <button className="btn primary" disabled={images.length === 0 || searching} onClick={doSearch}>検索する</button>
      </div>
    </Modal>
  )
}
