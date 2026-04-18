import { YarnSvgSm } from '../lib/svgs'

function getSorted(items, sort) {
  const list = [...items]
  if (sort === 'count-desc') return list.sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0))
  if (sort === 'count-asc') return list.sort((a, b) => (Number(a.count) || 0) - (Number(b.count) || 0))
  if (sort === 'color') return list.sort((a, b) => (a.colorname || '').localeCompare(b.colorname || '', 'ja'))
  if (sort === 'material') return list.sort((a, b) => (a.material || '').localeCompare(b.material || '', 'ja'))
  if (sort === 'shop') return list.sort((a, b) => (a.shops?.[0] || '').localeCompare(b.shops?.[0] || '', 'ja'))
  if (sort === 'name') return list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ja'))
  return list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
}

function ViewToggle({ view, onViewChange }) {
  return (
    <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
      <button onClick={() => onViewChange('list')} title="リスト"
        style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #DCCDD4', background: view === 'list' ? '#8C6272' : '#FDF5F7', color: view === 'list' ? '#FDF5F7' : '#7A6369', cursor: 'pointer', fontSize: '13px', lineHeight: 1 }}>☰</button>
      <button onClick={() => onViewChange('grid')} title="グリッド"
        style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #DCCDD4', background: view === 'grid' ? '#8C6272' : '#FDF5F7', color: view === 'grid' ? '#FDF5F7' : '#7A6369', cursor: 'pointer', fontSize: '13px', lineHeight: 1 }}>⊞</button>
    </div>
  )
}

export default function YarnList({ yarns, works, sort, view, onSortChange, onViewChange, onOpenDetail, onOpenLabelSearch }) {
  const sorted = getSorted(yarns, sort)

  return (
    <>
      <div className="toolbar">
        <label>並び替え</label>
        <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="default">登録順</option>
          <option value="count-desc">在庫多い順</option>
          <option value="count-asc">在庫少ない順</option>
          <option value="color">色順</option>
          <option value="material">素材順</option>
          <option value="shop">お店順</option>
          <option value="name">名前順</option>
        </select>
        <span className="count-badge">{yarns.length}点</span>
        <button className="btn ai" onClick={onOpenLabelSearch} style={{ whiteSpace: 'nowrap', fontSize: '11px', padding: '5px 10px' }}>✦ 検索</button>
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>

      {yarns.length === 0 ? (
        <div className="empty">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="26" fill="#EDE0E5"/>
            <circle cx="40" cy="40" r="18" stroke="#C4A0AE" strokeWidth="1.5" fill="#F0E4EA"/>
            <path d="M28 40 Q33 28 40 40 Q47 52 52 40" stroke="#8C6272" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <circle cx="40" cy="40" r="5" fill="#8C6272" opacity="0.35"/>
          </svg>
          まだ毛糸が登録されていないよ<br />「＋ 毛糸追加」から登録してみてね
        </div>
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px' }}>
          {sorted.map((item) => (
            <div key={item.id} onClick={() => onOpenDetail(item)}
              style={{ aspectRatio: '1', overflow: 'hidden', background: '#EDE0E5', cursor: 'pointer', position: 'relative' }}>
              {item.img_url
                ? <img src={item.img_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><YarnSvgSm /></div>
              }
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.45))', padding: '16px 6px 5px', pointerEvents: 'none' }}>
                <div style={{ fontSize: '11px', color: '#fff', fontWeight: 600, lineHeight: 1.2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.name || '名前なし'}</div>
                {(item.count > 0 || item.count === 0) && (
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>{item.count || 0}本</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="list">
          {sorted.map((item) => {
            const tags = [
              item.colorname ? <span key="cn" className="tag color-name">{item.colorname}</span> : null,
              item.material ? <span key="mt" className="tag">{item.material}</span> : null,
              item.color ? <span key="cl" className="meta-text">No.{item.color}</span> : null,
              item.lot ? <span key="lt" className="meta-text">Lot.{item.lot}</span> : null,
            ].filter(Boolean)
            const shopTags = (item.shops || []).map((s) => <span key={s} className="tag shop">{s}</span>)
            const workTags = works
              .filter((w) => (w.yarn_ids || []).includes(item.id))
              .map((w) => <span key={w.id} className="tag work">✦ {w.name || '作品'}</span>)

            return (
              <div key={item.id} className="yarn-row" onClick={() => onOpenDetail(item)}>
                <div className="yarn-thumb">
                  {item.img_url ? <img src={item.img_url} alt="" /> : <YarnSvgSm />}
                </div>
                <div className="yarn-info">
                  <div className="yarn-name">{item.name || '名前なし'}</div>
                  <div className="yarn-tags">{tags}</div>
                  <div className="yarn-tags" style={{ marginTop: '4px' }}>{shopTags}{workTags}</div>
                </div>
                <div className="yarn-count">
                  <span className="count-num">{item.count || 0}</span>
                  <span className="count-unit">本</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
