import { useState } from 'react'
import Modal from './Modal'

export default function ShopSettings({ open, shops, onClose, onAdd, onDelete }) {
  const [input, setInput] = useState('')

  function handleAdd() {
    const name = input.trim()
    if (!name || shops.includes(name) || name === 'その他') return
    onAdd(name)
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-title">お店を管理</div>

      <div>
        {shops.length === 0
          ? <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', padding: '8px 0' }}>まだ登録されていないよ</p>
          : shops.map((s) => (
            <div key={s} className="shop-list-item">
              <span>{s}</span>
              <button className="shop-del-btn" onClick={() => onDelete(s)}>×</button>
            </div>
          ))
        }
      </div>

      <div className="add-shop-row">
        <input type="text" value={input} placeholder="例：オカダヤ" onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} />
        <button className="btn primary" onClick={handleAdd}>追加</button>
      </div>
      <p className="settings-note">※「その他」は常に表示されます</p>

      <div className="modal-actions">
        <button className="btn" onClick={onClose}>閉じる</button>
      </div>
    </Modal>
  )
}
