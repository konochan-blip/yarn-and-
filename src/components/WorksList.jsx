import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import SortableItem, { DragHandle } from './SortableItem'
import { WorkSvgSm } from '../lib/svgs'
import { MiniYarnBall } from './WorkDetail'

const LABEL_H = 19
const imgBoxStyle = { position: 'relative', width: '100%', paddingBottom: '100%', background: '#EDE0E5', overflow: 'hidden' }
const labelStyle = { height: `${LABEL_H}px`, background: 'rgba(140,98,114,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }
const labelTextStyle = { fontSize: '9px', color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }

function WorkGridCard({ work, count, onOpenDetail }) {
  return (
    <div onClick={() => onOpenDetail(work)} style={{ cursor: 'pointer', overflow: 'hidden' }}>
      <div style={imgBoxStyle}>
        {work.img_url
          ? <img src={work.img_url} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WorkSvgSm /></div>
        }
        {count > 0 && (
          <div style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.42)', borderRadius: '99px', padding: '2px 6px 2px 4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <MiniYarnBall />
            <span style={{ fontSize: '10px', color: '#fff', fontWeight: 600, lineHeight: 1 }}>{count}</span>
          </div>
        )}
      </div>
      <div style={labelStyle}>
        <span style={labelTextStyle}>{work.name || ''}</span>
      </div>
    </div>
  )
}

function SortableWorkGridCard({ work, count, onOpenDetail }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: work.id })
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => onOpenDetail(work)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        touchAction: 'none',
        overflow: 'hidden',
        position: 'relative',
        zIndex: isDragging ? 999 : 'auto',
      }}
    >
      <div style={imgBoxStyle}>
        {work.img_url
          ? <img src={work.img_url} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WorkSvgSm /></div>
        }
        {count > 0 && (
          <div style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.42)', borderRadius: '99px', padding: '2px 6px 2px 4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <MiniYarnBall />
            <span style={{ fontSize: '10px', color: '#fff', fontWeight: 600, lineHeight: 1 }}>{count}</span>
          </div>
        )}
      </div>
      <div style={labelStyle}>
        <span style={labelTextStyle}>{work.name || ''}</span>
      </div>
    </div>
  )
}

export default function WorksList({ works, yarns, workCategories, sort, needleFilter, categoryFilter, view, yarnCounts = {}, onSortChange, onNeedleFilterChange, onCategoryFilterChange, onViewChange, onOpenDetail, onReorder }) {
  const [reorderMode, setReorderMode] = useState(false)
  const allCategories = [...new Set([...(workCategories || []), 'その他'].filter((c) => works.some((w) => (w.categories || []).includes(c))))]

  let list = [...works]
  if (needleFilter) list = list.filter((w) => w.needle === needleFilter)
  if (categoryFilter) list = list.filter((w) => (w.categories || []).includes(categoryFilter))
  if (sort === 'new') list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  else if (sort === 'name') list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ja'))
  else if (sort === 'yarn') list.sort((a, b) => (b.yarn_ids?.length || 0) - (a.yarn_ids?.length || 0))

  const canEnterReorder = sort === 'default' && !needleFilter && !categoryFilter && view === 'grid'
  const canDrag = canEnterReorder && reorderMode

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = list.findIndex((i) => i.id === active.id)
    const newIndex = list.findIndex((i) => i.id === over.id)
    onReorder(arrayMove(list, oldIndex, newIndex))
  }

  function handleSortChange(v) {
    setReorderMode(false)
    onSortChange(v)
  }

  function handleViewChange(v) {
    setReorderMode(false)
    onViewChange(v)
  }

  return (
    <>
      <div className="toolbar">
        <label>並び替え</label>
        <select value={sort} onChange={(e) => handleSortChange(e.target.value)}>
          <option value="new">新しい順</option>
          <option value="default">登録順</option>
          <option value="name">名前順</option>
          <option value="yarn">YARN順</option>
        </select>
        <select value={needleFilter} onChange={(e) => { setReorderMode(false); onNeedleFilterChange(e.target.value) }}
          style={{ fontFamily: 'inherit', fontSize: '13px', padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '99px', background: 'var(--bg)', color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}>
          <option value="">すべて</option>
          <option value="かぎ針">かぎ針</option>
          <option value="棒針">棒針</option>
          <option value="輪針">輪針</option>
          <option value="その他">その他</option>
        </select>
        {allCategories.length > 0 && (
          <select value={categoryFilter} onChange={(e) => { setReorderMode(false); onCategoryFilterChange(e.target.value) }}
            style={{ fontFamily: 'inherit', fontSize: '13px', padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '99px', background: 'var(--bg)', color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}>
            <option value="">カテゴリー</option>
            {allCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        )}
        <span className="count-badge">{works.length}点</span>
        <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
          <button onClick={() => handleViewChange('list')} title="リスト"
            style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #DCCDD4', background: view === 'list' ? '#8C6272' : '#FDF5F7', color: view === 'list' ? '#FDF5F7' : '#7A6369', cursor: 'pointer', fontSize: '13px', lineHeight: 1, overflow: 'hidden' }}>☰</button>
          <button onClick={() => handleViewChange('grid')} title="グリッド"
            style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #DCCDD4', background: view === 'grid' ? '#8C6272' : '#FDF5F7', color: view === 'grid' ? '#FDF5F7' : '#7A6369', cursor: 'pointer', fontSize: '13px', lineHeight: 1, overflow: 'hidden' }}>⊞</button>
        </div>
      </div>

      {canEnterReorder && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 0 6px' }}>
          <button onClick={() => setReorderMode((v) => !v)}
            style={{ fontFamily: 'inherit', fontSize: '12px', padding: '4px 12px', borderRadius: '99px', border: '1px solid var(--accent)', background: reorderMode ? 'var(--accent)' : 'transparent', color: reorderMode ? '#fff' : 'var(--accent)', cursor: 'pointer' }}>
            {reorderMode ? '完了' : '並び替え'}
          </button>
        </div>
      )}

      {works.length === 0 ? (
        <div className="empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          まだ作品が登録されていないよ<br />「＋ 作品追加」から登録してみてね
        </div>
      ) : canDrag ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={list.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px' }}>
              {list.map((work) => (
                <SortableWorkGridCard key={work.id} work={work} count={yarnCounts[work.id] || 0} onOpenDetail={onOpenDetail} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px' }}>
          {list.map((work) => (
            <WorkGridCard key={work.id} work={work} count={yarnCounts[work.id] || 0} onOpenDetail={onOpenDetail} />
          ))}
        </div>
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
