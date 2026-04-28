import { useState } from 'react'
import Modal from './Modal'

export default function CategorySettings({ open, categories, onClose, onAdd, onDelete }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)

  async function handleAdd() {
    const name = input.trim()
    if (!name || categories.includes(name) || name === 'その他') return
    setError('')
    setAdding(true)
    try {
      await onAdd(name)
      setInput('')
    } catch (e) {
      setError(e.message || 'カテゴリーの追加に失敗しました')
    } finally {
      setAdding(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-title">カテゴリーを管理</div>

      <div>
        {categories.length === 0
          ? <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', padding: '8px 0' }}>まだ登録されていないよ</p>
          : categories.map((c) => (
            <div key={c} className="shop-list-item">
              <span>{c}</span>
              <button className="shop-del-btn" onClick={() => onDelete(c)}>×</button>
            </div>
          ))
        }
      </div>

      <div className="add-shop-row">
        <input type="text" value={input} placeholder="例：セーター・帽子・プレゼント用" onChange={(e) => { setInput(e.target.value); setError('') }} onKeyDown={handleKeyDown} />
        <button className="btn primary" disabled={adding} onClick={handleAdd}>{adding ? '追加中…' : '追加'}</button>
      </div>
      {error && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '6px' }}>{error}</p>}
      <p className="settings-note">※「その他」は常に表示されます</p>

      <div className="modal-actions">
        <button className="btn" onClick={onClose}>閉じる</button>
      </div>
    </Modal>
  )
}
