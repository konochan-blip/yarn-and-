import { useState } from 'react'
import Modal from './Modal'
import { ToolSvgSm } from '../lib/svgs'

export default function ToolDetail({ tool, onClose, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!tool) return null

  async function handleDelete() {
    setDeleting(true)
    await onDelete(tool.id)
    setDeleting(false)
    onClose()
  }

  return (
    <Modal open={!!tool} onClose={onClose}>
      <div className="modal-title">{tool.name || '名前なし'}</div>
      <div className="detail-thumb">
        {tool.img_url
          ? <img src={tool.img_url} alt="" />
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}><ToolSvgSm /></div>}
      </div>

      {tool.type ? <div className="detail-row"><span className="dl">種類</span><span className="dv">{tool.type}</span></div> : null}
      {tool.size ? <div className="detail-row"><span className="dl">サイズ・号数</span><span className="dv">{tool.size}</span></div> : null}
      {tool.memo ? (
        <div className="detail-row" style={{ flexDirection: 'column', gap: '4px' }}>
          <span className="dl">メモ</span>
          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{tool.memo}</span>
        </div>
      ) : null}

      {onDelete && confirmDelete && (
        <div className="delete-confirm">
          <p>本当に削除する？</p>
          <div className="delete-confirm-btns">
            <button onClick={() => setConfirmDelete(false)} style={{ border: '1px solid #DCCDD4', background: '#FDF5F7' }}>やっぱりやめる</button>
            <button onClick={handleDelete} disabled={deleting} style={{ border: '1px solid #9B3A3A', background: '#9B3A3A', color: '#fff' }}>{deleting ? '削除中…' : '削除する'}</button>
          </div>
        </div>
      )}

      <div className="modal-actions">
        {onDelete && <button className="btn danger" onClick={() => setConfirmDelete(true)}>削除</button>}
        {onEdit && <button className="btn" onClick={() => { onClose(); onEdit(tool) }}>編集</button>}
        <button className="btn primary" onClick={onClose}>閉じる</button>
      </div>
    </Modal>
  )
}
