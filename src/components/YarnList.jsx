import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import SortableItem, { DragHandle } from './SortableItem'
import { YarnSvgSm } from '../lib/svgs'

const SWATCHES = [
  ['#fbd0dc','#e8a8bc'],['#e8b5c1','#c98598'],['#cde8c8','#a9c8a7'],
  ['#cfdff3','#a9bedc'],['#fbe6b3','#f3d492'],['#dec9ee','#c7b3dc'],
  ['#fbdccb','#f4c4a8'],['#d4eaec','#a8c8cc'],['#f0dce8','#d4a0bc'],
]
function swatchOf(yarn) {
  const key = (yarn.name || '') + (yarn.color || '') + (yarn.colorname || '')
  const h = key.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0)
  return SWATCHES[Math.abs(h) % SWATCHES.length]
}

function chunk(arr, size) {
  const result = []
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size))
  return result
}

function getSorted(items, sort) {
  const list = [...items]
  if (sort === 'default') return list
  if (sort === 'count-desc') return list.sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0))
  if (sort === 'count-asc') return list.sort((a, b) => (Number(a.count) || 0) - (Number(b.count) || 0))
  if (sort === 'color') return list.sort((a, b) => (a.colorname || '').localeCompare(b.colorname || '', 'ja'))
  if (sort === 'material') return list.sort((a, b) => (a.material || '').localeCompare(b.material || '', 'ja'))
  if (sort === 'shop') return list.sort((a, b) => (a.shops?.[0] || '').localeCompare(b.shops?.[0] || '', 'ja'))
  if (sort === 'name') return list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ja'))
  return list
}

function ViewToggle({ view, onViewChange }) {
  return (
    <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
      <button onClick={() => onViewChange('list')} title="リスト"
        style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #DCCDD4', background: view === 'list' ? '#8C6272' : '#FDF5F7', color: view === 'list' ? '#FDF5F7' : '#7A6369', cursor: 'pointer', fontSize: '13px', lineHeight: 1, overflow: 'hidden' }}>☰</button>
      <button onClick={() => onViewChange('grid')} title="グリッド"
        style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #DCCDD4', background: view === 'grid' ? '#8C6272' : '#FDF5F7', color: view === 'grid' ? '#FDF5F7' : '#7A6369', cursor: 'pointer', fontSize: '13px', lineHeight: 1, overflow: 'hidden' }}>⊞</button>
    </div>
  )
}

export default function YarnList({ yarns, works, sort, view, onSortChange, onViewChange, onOpenDetail, onOpenLabelSearch, onReorder }) {
  const sorted = getSorted(yarns, sort)
  const canDrag = sort === 'default' && view === 'list'

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sorted.findIndex((i) => i.id === active.id)
    const newIndex = sorted.findIndex((i) => i.id === over.id)
    onReorder(arrayMove(sorted, oldIndex, newIndex))
  }

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
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round">
            <circle cx="12" cy="12" r="8"/>
            <path d="M12 4c0 5-4 8-8 8"/>
            <path d="M12 4c0 5 4 8 8 8"/>
            <path d="M4 12c5 0 8 4 8 8"/>
            <path d="M20 12c-5 0-8 4-8 8"/>
          </svg>
          まだ毛糸が登録されていないよ<br />「＋ 毛糸追加」から登録してみてね
        </div>
      ) : view === 'grid' ? (
        <div style={{ background: '#EDE0CC' }}>
          {chunk(sorted, 3).map((row, rowIdx) => (
            <div key={rowIdx}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px' }}>
                {row.map((item) => (
                  <div key={item.id} onClick={() => onOpenDetail(item)}
                    style={{ aspectRatio: '1', overflow: 'hidden', background: '#EDE0CC', cursor: 'pointer', position: 'relative' }}>
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
              {/* 棚板 */}
              <div style={{ height: '12px', background: 'linear-gradient(180deg, #E8C88A 0%, #C9A060 55%, #B08848 100%)', borderTop: '1.5px solid #F0D8A8', boxShadow: '0 4px 8px rgba(100,60,10,0.2)' }} />
            </div>
          ))}
        </div>
      ) : canDrag ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((i) => i.id)} strategy={verticalListSortingStrategy}>
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
                  <SortableItem key={item.id} id={item.id}>
                    {({ handleProps }) => (
                      <div className="yarn-row" onClick={() => onOpenDetail(item)}>
                        <DragHandle {...handleProps} />
                        <div className="yarn-thumb">
                          {item.img_url ? (
                            <img src={item.img_url} alt="" />
                          ) : (() => { const [c1,c2] = swatchOf(item); return (<>
                            <div className="yarn-swatch" style={{'--sw1':c1,'--sw2':c2}} />
                            <div className="yarn-swatch-stitch" />
                            <div className="yarn-swatch-rim" />
                          </>)})()}
                        </div>
                        <div className="yarn-info">
                          <div className="yarn-name">{item.name || '名前なし'}</div>
                          {(item.color || item.lot || item.material) && (
                            <div className="yarn-meta">
                              {[item.color && `No.${item.color}`, item.lot && `Lot.${item.lot}`, item.material].filter(Boolean).join(' · ')}
                            </div>
                          )}
                          <div className="yarn-tags">{tags}</div>
                          <div className="yarn-tags" style={{ marginTop: '4px' }}>{shopTags}{workTags}</div>
                        </div>
                        <div className="yarn-count">
                          <span className="count-num">{item.count || 0}</span>
                          <span className="count-unit">本</span>
                        </div>
                      </div>
                    )}
                  </SortableItem>
                )
              })}
            </div>
          </SortableContext>
        </DndContext>
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
                  {item.img_url ? (
                    <img src={item.img_url} alt="" />
                  ) : (() => { const [c1,c2] = swatchOf(item); return (<>
                    <div className="yarn-swatch" style={{'--sw1':c1,'--sw2':c2}} />
                    <div className="yarn-swatch-stitch" />
                    <div className="yarn-swatch-rim" />
                  </>)})()}
                </div>
                <div className="yarn-info">
                  <div className="yarn-name">{item.name || '名前なし'}</div>
                  {(item.color || item.lot || item.material) && (
                    <div className="yarn-meta">
                      {[item.color && `No.${item.color}`, item.lot && `Lot.${item.lot}`, item.material].filter(Boolean).join(' · ')}
                    </div>
                  )}
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
