import { useState, useEffect } from 'react'
import Modal from './Modal'
import { WorkSvgSm, YarnSvgSm, BookSvgSm } from '../lib/svgs'
import { supabase } from '../lib/supabase'

const YarnBallIcon = ({ active, size = 24 }) => {
  const fill   = active ? '#8C6272' : '#F2E4E9'
  const stroke = active ? '#6B4555' : '#C4A0AE'
  const line1  = active ? 'rgba(255,255,255,0.92)' : '#9C6B7E'
  const line2  = active ? 'rgba(255,255,255,0.55)' : '#C4A0AE'
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10.5" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <path d="M4 11 Q8.5 6 14 11 Q19.5 16 24 11"
        stroke={line1} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path d="M3.5 17 Q8.5 22 14 17 Q19.5 12 24.5 17"
        stroke={line1} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M9 4 Q11.5 9 14 14 Q16.5 19 19.5 24"
        stroke={line2} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <circle cx="14" cy="14" r="2.2"
        fill={active ? 'rgba(255,255,255,0.28)' : '#8C6272'} opacity={active ? 1 : 0.18}/>
      <path d="M21.5 5.5 Q23.5 3.5 24 2.5"
        stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <circle cx="24" cy="2.5" r="1.1" fill={stroke}/>
    </svg>
  )
}

const MiniYarnBall = () => (
  <svg width="12" height="12" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="10.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
    <path d="M4 11 Q8.5 6 14 11 Q19.5 16 24 11"
      stroke="rgba(255,255,255,0.95)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M3.5 17 Q8.5 22 14 17 Q19.5 12 24.5 17"
      stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
)

export { MiniYarnBall }

export default function WorkDetail({ work, yarns, books, currentUserId, onClose, onEdit, onDelete, onYarnChange, onOpenYarnDetail, onOpenBookDetail }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [yarnCount, setYarnCount] = useState(0)
  const [hasYarned, setHasYarned] = useState(false)
  const [yarnLoading, setYarnLoading] = useState(false)

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
        onYarnChange?.(work.id, -1)
      } else {
        await supabase.from('work_yarns').insert({ work_id: work.id, user_id: currentUserId })
        setHasYarned(true)
        setYarnCount((n) => n + 1)
        onYarnChange?.(work.id, +1)
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
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}>
        <button
          onClick={toggleYarn}
          disabled={yarnLoading}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: hasYarned ? '#F7ECF0' : 'var(--surface)',
            border: `1.5px solid ${hasYarned ? '#8C6272' : 'var(--border)'}`,
            borderRadius: '99px', padding: '9px 22px',
            cursor: yarnLoading ? 'default' : 'pointer',
            fontSize: '13px', fontFamily: 'inherit', fontWeight: hasYarned ? 600 : 400,
            color: hasYarned ? '#8C6272' : 'var(--text-secondary)',
            transition: 'all 0.18s', opacity: yarnLoading ? 0.7 : 1,
            letterSpacing: '0.05em',
          }}
        >
          <YarnBallIcon active={hasYarned} size={22} />
          YARN{yarnCount > 0 ? `  ${yarnCount}` : ''}
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
