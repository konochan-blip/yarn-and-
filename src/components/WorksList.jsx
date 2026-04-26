import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import SortableItem, { DragHandle } from './SortableItem'
import { WorkSvgSm, YarnSvgSm } from '../lib/svgs'
import { MiniYarnBall } from './WorkDetail'

export default function WorksList({ works, yarns, sort, needleFilter, categoryFilter, view, yarnCounts = {}, onSortChange, onNeedleFilterChange, onCategoryFilterChange, onViewChange, onOpenDetail, onReorder }) {
  const allCategories = [...new Set(works.flatMap((w) => w.categories || []))].sort((a, b) => a.localeCompare(b, 'ja'))

  let list = [...works]
  if (needleFilter) list = list.filter((w) => w.needle === needleFilter)
  if (categoryFilter) list = list.filter((w) => (w.categories || []).includes(categoryFilter))
  if (sort === 'new') list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  else if (sort === 'name') list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ja'))
  else if (sort === 'yarn') list.sort((a, b) => (b.yarn_ids?.length || 0) - (a.yarn_ids?.length || 0))
  const canDrag = sort === 'default' && view === 'list' && !needleFilter && !categoryFilter

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = list.findIndex((i) => i.id === active.id)
    const newIndex = list.findIndex((i) => i.id === over.id)
    onReorder(arrayMove(list, oldIndex, newIndex))
  }

  return (
    <>
      <div className="toolbar">
        <label>並び替え</label>
        <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="new">新しい順</option>
          <option value="default">登録順</option>
          <option value="name">名前順</option>
          <option value="yarn">YARN順</option>
        </select>
        <select value={needleFilter} onChange={(e) => onNeedleFilterChange(e.target.value)}
          style={{ fontFamily: 'inherit', fontSize: '13px', padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '99px', background: 'var(--bg)', color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}>
          <option value="">すべて</option>
          <option value="かぎ針">かぎ針</option>
          <option value="棒針">棒針</option>
          <option value="輪針">輪針</option>
          <option value="その他">その他</option>
        </select>
        {allCategories.length > 0 && (
          <select value={categoryFilter} onChange={(e) => onCategoryFilterChange(e.target.value)}
            style={{ fontFamily: 'inherit', fontSize: '13px', padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '99px', background: 'var(--bg)', color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}>
            <option value="">カテゴリー</option>
            {allCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        )}
        <span className="count-badge">{works.length}点</span>
        <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
          <button onClick={() => onViewChange('list')} title="リスト"
            style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #DCCDD4', background: view === 'list' ? '#8C6272' : '#FDF5F7', color: view === 'list' ? '#FDF5F7' : '#7A6369', cursor: 'pointer', fontSize: '13px', lineHeight: 1, overflow: 'hidden' }}>☰</button>
          <button onClick={() => onViewChange('grid')} title="グリッド"
            style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #DCCDD4', background: view === 'grid' ? '#8C6272' : '#FDF5F7', color: view === 'grid' ? '#FDF5F7' : '#7A6369', cursor: 'pointer', fontSize: '13px', lineHeight: 1, overflow: 'hidden' }}>⊞</button>
        </div>
      </div>

      {works.length === 0 ? (
        <div className="empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          まだ作品が登録されていないよ<br />「＋ 作品追加」から登録してみてね
        </div>
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px' }}>
          {list.map((work) => {
            const count = yarnCounts[work.id] || 0
            return (
              <div key={work.id} onClick={() => onOpenDetail(work)}
                style={{ aspectRatio: '1', overflow: 'hidden', background: '#EDE0E5', cursor: 'pointer', position: 'relative' }}>
                {work.img_url
                  ? <img src={work.img_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WorkSvgSm /></div>
                }
                {count > 0 && (
                  <div style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.42)', borderRadius: '99px', padding: '2px 6px 2px 4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <MiniYarnBall />
                    <span style={{ fontSize: '10px', color: '#fff', fontWeight: 600, lineHeight: 1 }}>{count}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : canDrag ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={list.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="list">
              {list.map((work) => {
                const linkedYarns = (work.yarn_ids || []).map((id) => yarns.find((y) => y.id === id)).filter(Boolean)
                const yarnTags = linkedYarns.length
                  ? linkedYarns.map((y) => <span key={y.id} className="tag color-name">{y.name || '毛糸'}</span>)
                  : <span className="meta-text">毛糸未紐付け</span>
                return (
                  <SortableItem key={work.id} id={work.id}>
                    {({ handleProps }) => (
                      <div className="yarn-row" onClick={() => onOpenDetail(work)}>
                        <DragHandle {...handleProps} />
                        <div className="yarn-thumb">
                          {work.img_url ? <img src={work.img_url} alt="" /> : <WorkSvgSm />}
                        </div>
                        <div className="yarn-info">
                          <div className="yarn-name">{work.name || '名前なし'}</div>
                          <div className="yarn-tags">
                            {yarnTags}
                            {work.needle ? <span className="tag">{work.needle}</span> : null}
                          </div>
                          {work.memo ? (
                            <div className="meta-text" style={{ marginTop: '3px' }}>
                              {work.memo.slice(0, 30)}{work.memo.length > 30 ? '…' : ''}
                            </div>
                          ) : null}
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
          {list.map((work) => {
            const linkedYarns = (work.yarn_ids || []).map((id) => yarns.find((y) => y.id === id)).filter(Boolean)
            const yarnTags = linkedYarns.length
              ? linkedYarns.map((y) => <span key={y.id} className="tag color-name">{y.name || '毛糸'}</span>)
              : <span className="meta-text">毛糸未紐付け</span>
            return (
              <div key={work.id} className="yarn-row" onClick={() => onOpenDetail(work)}>
                <div className="yarn-thumb">
                  {work.img_url ? <img src={work.img_url} alt="" /> : <WorkSvgSm />}
                </div>
                <div className="yarn-info">
                  <div className="yarn-name">{work.name || '名前なし'}</div>
                  <div className="yarn-tags">
                    {yarnTags}
                    {work.needle ? <span className="tag">{work.needle}</span> : null}
                  </div>
                  {work.memo ? (
                    <div className="meta-text" style={{ marginTop: '3px' }}>
                      {work.memo.slice(0, 30)}{work.memo.length > 30 ? '…' : ''}
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
