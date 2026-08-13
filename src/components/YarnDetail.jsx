import { useState } from 'react'
import Modal from './Modal'
import { YarnSvgLg, WorkSvgSm } from '../lib/svgs'

export default function YarnDetail({ yarn, works, onClose, onEdit, onCopy, onDelete, onOpenWorkDetail, onAddToWishList }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [wishAdded, setWishAdded] = useState(false)

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

      {yarn.label && <div className="detail-row"><span className="dl">ラベル</span><span className="dv" style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 600, borderRadius: '6px', padding: '2px 10px', fontSize: '12px' }}>{yarn.label}</span></div>}
      {yarn.product_number && <div className="detail-row"><span className="dl">品番</span><span className="dv">{yarn.product_number}</span></div>}
      <div className="detail-row"><span className="dl">色番号</span><span className="dv">{yarn.color || '—'}</span></div>
      {yarn.maker ? <div className="detail-row"><span className="dl">メーカー</span><span className="dv">{yarn.maker}</span></div> : null}
      <div className="detail-row"><span className="dl">色</span><span className="dv">{yarn.colorname || '—'}</span></div>
      <div className="detail-row"><span className="dl">素材</span><span className="dv">{yarn.material || '—'}</span></div>
      <div className="detail-row"><span className="dl">ロット</span><span className="dv">{yarn.lot || '—'}</span></div>
      {yarn.needle ? <div className="detail-row"><span className="dl">適合針</span><span className="dv">{yarn.needle}</span></div> : null}
      {yarn.price ? <div className="detail-row"><span className="dl">定価</span><span className="dv">{yarn.price}</span></div> : null}
      <div className="detail-row"><span className="dl">玉数・本数</span><span className="dv">{yarn.count || 0} {yarn.count_unit || '玉'}</span></div>
      {(yarn.weight_g || yarn.length_m) && (
        <div className="detail-row">
          <span className="dl">規格</span>
          <span className="dv">
            {yarn.weight_g ? `${yarn.weight_g}g` : ''}
            {yarn.weight_g && yarn.length_m ? ' / ' : ''}
            {yarn.length_m ? `${yarn.length_m}m` : ''}
          </span>
        </div>
      )}

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

      {onDelete && confirmDelete && (
        <div className="delete-confirm">
          <p>本当に削除する？</p>
          <div className="delete-confirm-btns">
            <button onClick={() => setConfirmDelete(false)} style={{ border: '1px solid #DCCDD4', background: '#FDF5F7' }}>やっぱりやめる</button>
            <button onClick={handleDelete} disabled={deleting} style={{ border: '1px solid #9B3A3A', background: '#9B3A3A', color: '#fff' }}>{deleting ? '削除中…' : '削除する'}</button>
          </div>
        </div>
      )}

      {onAddToWishList && (
        <button onClick={async () => { await onAddToWishList(yarn); setWishAdded(true); setTimeout(() => setWishAdded(false), 2000) }}
          style={{ width: '100%', fontFamily: 'inherit', fontSize: '13px', padding: '10px', marginBottom: '10px', borderRadius: '10px', border: '1px solid var(--accent)', background: wishAdded ? 'var(--accent)' : 'transparent', color: wishAdded ? '#fff' : 'var(--accent)', cursor: 'pointer' }}>
          {wishAdded ? '✓ 買う物リストに追加しました' : '買う物リストに追加'}
        </button>
      )}
      {onCopy && (
        <button onClick={() => { onClose(); onCopy(yarn) }}
          style={{ width: '100%', fontFamily: 'inherit', fontSize: '13px', padding: '10px', marginBottom: '10px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          ⧉ コピーして新規登録
        </button>
      )}
      <div className="modal-actions">
        {onEdit && <button className="btn" onClick={() => { onClose(); onEdit(yarn) }}>編集</button>}
        <button className="btn primary" onClick={onClose}>閉じる</button>
        {onDelete && <button className="btn danger" onClick={() => setConfirmDelete(true)}>削除</button>}
      </div>
    </Modal>
  )
}
