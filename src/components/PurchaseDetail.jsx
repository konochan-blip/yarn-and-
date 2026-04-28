import Modal from './Modal'

export default function PurchaseDetail({ purchase, onClose, onEdit, onDelete }) {
  if (!purchase) return null

  return (
    <Modal open={!!purchase} onClose={onClose}>
      <div className="modal-title">{purchase.name || '商品名なし'}</div>

      {purchase.img_url && (
        <div className="detail-thumb">
          <img src={purchase.img_url} alt="" />
        </div>
      )}

      {purchase.seller && <div className="detail-row"><span className="dl">購入先・作家名</span><span className="dv">{purchase.seller}</span></div>}
      {purchase.price  && <div className="detail-row"><span className="dl">価格</span><span className="dv">{purchase.price}</span></div>}
      {purchase.memo   && (
        <div className="detail-row" style={{ flexDirection: 'column', gap: '4px' }}>
          <span className="dl">メモ</span>
          <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px', whiteSpace: 'pre-wrap' }}>{purchase.memo}</div>
        </div>
      )}

      <div className="modal-actions">
        {onDelete && (
          <button className="btn danger" onClick={() => { if (window.confirm('削除しますか？')) { onDelete(purchase.id); onClose() } }}>削除</button>
        )}
        {onEdit && <button className="btn" onClick={() => onEdit(purchase)}>編集</button>}
        <button className="btn primary" onClick={onClose}>閉じる</button>
      </div>
    </Modal>
  )
}
