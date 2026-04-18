import { useState } from 'react'
import Modal from './Modal'
import { BookSvgSm, WorkSvgSm } from '../lib/svgs'

export default function BookDetail({ book, works, onClose, onEdit, onDelete, onOpenWorkDetail }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!book) return null

  const linkedWorks = works.filter((w) => (w.book_ids || []).includes(book.id))

  async function handleDelete() {
    setDeleting(true)
    await onDelete(book.id)
    setDeleting(false)
    onClose()
  }

  return (
    <Modal open={!!book} onClose={onClose}>
      <div className="modal-title">{book.title || '無題'}</div>
      <div className="detail-thumb">
        {book.img_url
          ? <img src={book.img_url} alt="" />
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <svg width="56" height="56" viewBox="0 0 30 30" fill="none">
                <rect x="5" y="4" width="16" height="22" rx="2" stroke="#C4A0AE" strokeWidth="1.2" fill="#EDE0E5"/>
                <rect x="5" y="4" width="4" height="22" rx="2" fill="#C4A0AE" opacity="0.45"/>
                <line x1="12" y1="10" x2="18" y2="10" stroke="#8C6272" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="12" y1="14" x2="18" y2="14" stroke="#8C6272" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="12" y1="18" x2="16" y2="18" stroke="#8C6272" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M21 6 Q25 15 21 24" stroke="#C4A0AE" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
        }
      </div>

      {book.author    ? <div className="detail-row"><span className="dl">著者</span><span className="dv">{book.author}</span></div> : null}
      {book.publisher ? <div className="detail-row"><span className="dl">出版社</span><span className="dv">{book.publisher}</span></div> : null}

      {book.link ? (
        <div className="detail-row">
          <span className="dl">リンク</span>
          <a href={book.link} target="_blank" rel="noreferrer"
            style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'underline', wordBreak: 'break-all', textAlign: 'right' }}
            onClick={(e) => e.stopPropagation()}>
            開く ↗
          </a>
        </div>
      ) : null}

      {book.memo ? (
        <div className="detail-row" style={{ flexDirection: 'column', gap: '4px' }}>
          <span className="dl">メモ</span>
          <span style={{ fontSize: '13px', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{book.memo}</span>
        </div>
      ) : null}

      {linkedWorks.length > 0 && (
        <div className="linked-section">
          <div className="linked-title">この本から作った作品</div>
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
        <button className="btn" onClick={() => { onClose(); onEdit(book) }}>編集</button>
        <button className="btn primary" onClick={onClose}>閉じる</button>
      </div>
    </Modal>
  )
}
