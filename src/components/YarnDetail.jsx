import { useState } from 'react'
import Modal from './Modal'
import { YarnSvgLg, WorkSvgSm } from '../lib/svgs'

export default function YarnDetail({ yarn, works, onClose, onEdit, onDelete, onOpenWorkDetail }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!yarn) return null

  const linkedWorks = works.filter((w) => (w.yarn_ids || []).includes(yarn.id))
  const shopTags = (yarn.shops || []).length > 0
    ? yarn.shops.map((s) => <span key={s} className="tag shop">{s}</span>)
    : '—'

  const memoHtml = yarn.memo
    ? yarn.memo.replace(/(https?:\/\/[^\s]+)/g, (url) => `<a href="${url}" target="_blank" rel="noreferrer" style="color:#8C6272;text-decoration:underline;">${url}</a>`)
    : null

  async function handleDelete() {
    setDeleting(true)
    await onDelete(yarn.id)
    setDeleting(false)
    onClose()
  }

  return (
    <Modal open={!!yarn} onClose={onClose}>
      <div className="modal-title">{yarn.name || '名前なし'}</div>
      <div className="detail-thumb">
        {yarn.img_url ? <img src={yarn.img_url} alt="" /> : <YarnSvgLg />}
      </div>

      <div className="detail-row"><span className="dl">色番号</span><span className="dv">{yarn.color || '—'}</span></div>
      <div className="detail-row"><span className="dl">色</span><span className="dv">{yarn.colorname || '—'}</span></div>
      <div className="detail-row"><span className="dl">素材</span><span className="dv">{yarn.material || '—'}</span></div>
      <div className="detail-row"><span className="dl">ロット</span><span className="dv">{yarn.lot || '—'}</span></div>
      {yarn.price ? <div className="detail-row"><span className="dl">定価</span><span className="dv">{yarn.price}</span></div> : null}
      <div className="detail-row"><span className="dl">本数</span><span className="dv">{yarn.count || 0} 本</span></div>

      {memoHtml && (
        <div className="detail-row" style={{ flexDirection: 'column', gap: '4px' }}>
          <span className="dl">メモ・URL</span>
          <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
            dangerouslySetInnerHTML={{ __html: memoHtml }} />
        </div>
      )}

      <div className="detail-row" style={{ flexDirection: 'column', gap: '6px' }}>
        <span className="dl">お店</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>{shopTags}</div>
      </div>

      {linkedWorks.length > 0 && (
        <div className="linked-section">
          <div className="linked-title">この毛糸を使った作品</div>
          {linkedWorks.map((w) => (
            <div key={w.id} className="linked-item" onClick={() => { onClose(); onOpenWorkDetail(w) }}>
              <div className="linked-thumb">
                {w.img_url ? <img src={w.img_url} alt="" /> : <WorkSvgSm />}
              </div>
              <div>
                <div className="linked-name">{w.name || '名前なし'}</div>
                {w.needle ? <div className="linked-sub">{w.needle}</div> : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="delete-confirm">
          <p>本当に削除する？</p>
          <div className="delete-confirm-btns">
            <button onClick={() => setConfirmDelete(false)} style={{ border: '1px solid #DCCDD4', background: '#FDF5F7' }}>やっぱりやめる</button>
            <button onClick={handleDelete} disabled={deleting} style={{ border: '1px solid #9B3A3A', background: '#9B3A3A', color: '#fff' }}>{deleting ? '削除中…' : '削除する'}</button>
          </div>
        </div>
      )}

      <div className="modal-actions">
        <button className="btn danger" onClick={() => setConfirmDelete(true)}>削除</button>
        <button className="btn" onClick={() => { onClose(); onEdit(yarn) }}>編集</button>
        <button className="btn primary" onClick={onClose}>閉じる</button>
      </div>
    </Modal>
  )
}
