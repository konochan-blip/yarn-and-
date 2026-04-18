import { useState } from 'react'
import Modal from './Modal'
import { WorkSvgSm, YarnSvgSm, BookSvgSm } from '../lib/svgs'

export default function WorkDetail({ work, yarns, books, onClose, onEdit, onDelete, onOpenYarnDetail, onOpenBookDetail }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!work) return null

  const linkedYarns = (work.yarn_ids || []).map((id) => yarns.find((y) => y.id === id)).filter(Boolean)
  const linkedBooks = (work.book_ids || []).map((id) => books.find((b) => b.id === id)).filter(Boolean)

  const refHtml = work.ref
    ? work.ref.replace(/(https?:\/\/[^\s]+)/g, (url) => `<a href="${url}" target="_blank" rel="noreferrer" style="color:#8C6272;text-decoration:underline;">${url}</a>`)
    : null

  async function handleDelete() {
    setDeleting(true)
    await onDelete(work.id)
    setDeleting(false)
    onClose()
  }

  return (
    <Modal open={!!work} onClose={onClose}>
      <div className="modal-title">{work.name || '名前なし'}</div>
      <div className="detail-thumb">
        {work.img_url ? <img src={work.img_url} alt="" /> : <WorkSvgSm />}
      </div>

      {work.needle ? <div className="detail-row"><span className="dl">編み方</span><span className="dv">{work.needle}</span></div> : null}

      {work.memo ? (
        <div className="detail-row" style={{ flexDirection: 'column', gap: '4px' }}>
          <span className="dl">メモ</span>
          <span style={{ fontSize: '13px', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{work.memo}</span>
        </div>
      ) : null}

      {refHtml ? (
        <div className="detail-row" style={{ flexDirection: 'column', gap: '4px' }}>
          <span className="dl">編み図・参考URL</span>
          <div style={{ fontSize: '13px', marginTop: '2px', wordBreak: 'break-all' }} dangerouslySetInnerHTML={{ __html: refHtml }} />
        </div>
      ) : null}

      {/* 使った毛糸 */}
      <div className="linked-section">
        <div className="linked-title">使った毛糸</div>
        {linkedYarns.length === 0
          ? <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '4px 0' }}>毛糸未紐付け</div>
          : linkedYarns.map((yarn) => (
            <div key={yarn.id} className="linked-item" onClick={() => { onClose(); onOpenYarnDetail(yarn) }}>
              <div className="linked-thumb">
                {yarn.img_url ? <img src={yarn.img_url} alt="" /> : <YarnSvgSm />}
              </div>
              <div>
                <div className="linked-name">{yarn.name || '名前なし'}</div>
                <div className="linked-sub">{yarn.colorname || ''}{yarn.material ? ` · ${yarn.material}` : ''}</div>
              </div>
            </div>
          ))
        }
      </div>

      {/* 参考にした書籍 */}
      {linkedBooks.length > 0 && (
        <div className="linked-section">
          <div className="linked-title">参考にした書籍</div>
          {linkedBooks.map((book) => (
            <div key={book.id} className="linked-item" onClick={() => { onClose(); onOpenBookDetail(book) }}>
              <div className="linked-thumb">
                {book.img_url ? <img src={book.img_url} alt="" /> : <BookSvgSm />}
              </div>
              <div>
                <div className="linked-name">{book.title || '無題'}</div>
                <div className="linked-sub">{book.author || ''}{book.publisher ? ` · ${book.publisher}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      )}

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
        {onEdit && <button className="btn" onClick={() => { onClose(); onEdit(work) }}>編集</button>}
        <button className="btn primary" onClick={onClose}>閉じる</button>
      </div>
    </Modal>
  )
}
