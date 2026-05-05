import { useState } from 'react'
import Modal from './Modal'

export default function MakerSettings({ open, makers, onClose, onAdd, onDelete }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)

  async function handleAdd() {
    const name = input.trim()
    if (!name || makers.includes(name)) return
    setError('')
    setAdding(true)
    try {
      await onAdd(name)
      setInput('')
    } catch (e) {
      setError(e.message || 'メーカーの追加に失敗しました')
    } finally {
      setAdding(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-title">メーカーを管理</div>

      <div>
        {makers.length === 0
          ? <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', padding: '8px 0' }}>まだ登録されていないよ</p>
          : makers.map((m) => (
            <div key={m} className="shop-list-item">
              <span>{m}</span>
              <button className="shop-del-btn" onClick={() => onDelete(m)}>×</button>
            </div>
          ))
        }
      </div>

      <div className="add-shop-row">
        <input type="text" value={input} placeholder="例：クロバー" onChange={(e) => { setInput(e.target.value); setError('') }} onKeyDown={handleKeyDown} />
        <button className="btn primary" disabled={adding} onClick={handleAdd}>{adding ? '追加中…' : '追加'}</button>
      </div>
      {error && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '6px' }}>{error}</p>}

      <div className="modal-actions">
        <button className="btn" onClick={onClose}>閉じる</button>
      </div>
    </Modal>
  )
}
