import { useState, useEffect } from 'react'
import Modal from './Modal'
import { WorkSvgSm, YarnSvgSm, BookSvgSm } from '../lib/svgs'
import { supabase } from '../lib/supabase'

const YarnBallIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9"
      fill={active ? '#8C6272' : '#EDE0E5'}
      stroke={active ? '#8C6272' : '#C4A0AE'}
      strokeWidth="1.3"/>
    <path d="M5 12 Q8 5.5 12 12 Q16 18.5 19 12"
      stroke={active ? '#fff' : '#8C6272'}
      strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    <path d="M8 7.5 Q10 11 12 12 Q14 13 16.5 16.5"
      stroke={active ? 'rgba(255,255,255,0.5)' : '#C4A0AE'}
      strokeWidth="1" fill="none" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="2.2"
      fill={active ? 'rgba(255,255,255,0.35)' : '#8C6272'}
      opacity={active ? 1 : 0.3}/>
  </svg>
)

export default function WorkDetail({ work, yarns, books, currentUserId, onClose, onEdit, onDelete, onOpenYarnDetail, onOpenBookDetail }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [yarnCount, setYarnCount] = useState(0)
  const [hasYarned, setHasYarned] = useState(false)
  const [yarnLoading, setYarnLoading] = useState(false)

  const isOwnWork = currentUserId && work?.user_id === currentUserId

  useEffect(() => {
    if (!work) return
    setYarnCount(0)
    setHasYarned(false)
    async function fetchYarns() {
      const [{ count }, { data: mine }] = await Promise.all([
        supabase.from('work_yarns').select('id', { count: 'exact', head: true }).eq('work_id', work.id),
        currentUserId
          ? supabase.from('work_yarns').select('id').eq('work_id', work.id).eq('user_id', currentUserId).maybeSingle()
          : Promise.resolve({ data: null }),
      ])
      setYarnCount(count || 0)
      setHasYarned(!!mine)
    }
    fetchYarns()
  }, [work?.id, currentUserId])

  async function toggleYarn() {
    if (!currentUserId || yarnLoading) return
    setYarnLoading(true)
    try {
      if (hasYarned) {
        await supabase.from('work_yarns').delete().eq('work_id', work.id).eq('user_id', currentUserId)
        setHasYarned(false)
        setYarnCount((n) => Math.max(0, n - 1))
      } else {
        await supabase.from('work_yarns').insert({ work_id: work.id, user_id: currentUserId })
        setHasYarned(true)
        setYarnCount((n) => n + 1)
      }
    } finally {
      setYarnLoading(false)
    }
  }

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

      {/* YARNボタン */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px' }}>
        <button
          onClick={toggleYarn}
          disabled={yarnLoading}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            background: hasYarned ? 'var(--accent-light)' : 'var(--surface)',
            border: `1.5px solid ${hasYarned ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '99px', padding: '8px 20px',
            cursor: yarnLoading ? 'default' : 'pointer',
            fontSize: '13px', fontFamily: 'inherit', fontWeight: hasYarned ? 600 : 400,
            color: hasYarned ? 'var(--accent)' : 'var(--text-secondary)',
            transition: 'all 0.18s', opacity: yarnLoading ? 0.7 : 1,
            letterSpacing: '0.04em',
          }}
        >
          <YarnBallIcon active={hasYarned} />
          YARN{yarnCount > 0 ? `　${yarnCount}` : ''}
        </button>
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
