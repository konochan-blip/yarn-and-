import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, rectSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import SortableItem, { DragHandle } from './SortableItem'
import { ToolSvgSm } from '../lib/svgs'

const imgBoxStyle = { position: 'relative', width: '100%', paddingBottom: '100%', background: '#EDE0E5', overflow: 'hidden' }

function SortableToolGridCard({ tool, onOpenDetail }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tool.id })
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => onOpenDetail(tool)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        touchAction: 'none',
        overflow: 'hidden',
        background: '#EDE0E5',
        position: 'relative',
        zIndex: isDragging ? 999 : 'auto',
      }}
    >
      <div style={imgBoxStyle}>
        {tool.img_url
          ? <img src={tool.img_url} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ToolSvgSm /></div>
        }
      </div>
    </div>
  )
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

export default function ToolsList({ tools, sort, view, onSortChange, onViewChange, onOpenDetail, onReorder }) {
  const [reorderMode, setReorderMode] = useState(false)
  const sorted = [...tools]
  if (sort === 'new') sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  else if (sort === 'name') sorted.sort((a, b) => (a.type || '').localeCompare(b.type || '', 'ja'))

  const canEnterReorder = sort === 'default' && view === 'grid'
  const canDrag = canEnterReorder && reorderMode

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sorted.findIndex((i) => i.id === active.id)
    const newIndex = sorted.findIndex((i) => i.id === over.id)
    onReorder(arrayMove(sorted, oldIndex, newIndex))
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
        <select value={sort} onChange={(e) => handleSortChange(e.target.value)}>
          <option value="new">新しい順</option>
          <option value="default">登録順</option>
          <option value="name">種類順</option>
        </select>
        <span className="count-badge">{tools.length}点</span>
        <ViewToggle view={view} onViewChange={handleViewChange} />
      </div>

      {canEnterReorder && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 0 6px' }}>
          <button onClick={() => setReorderMode((v) => !v)}
            style={{ fontFamily: 'inherit', fontSize: '12px', padding: '4px 12px', borderRadius: '99px', border: '1px solid var(--accent)', background: reorderMode ? 'var(--accent)' : 'transparent', color: reorderMode ? '#fff' : 'var(--accent)', cursor: 'pointer' }}>
            {reorderMode ? '完了' : '並べ替える'}
          </button>
        </div>
      )}

      {tools.length === 0 ? (
        <div className="empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          まだ道具が登録されていないよ<br />「＋ 道具追加」から登録してみてね
        </div>
      ) : canDrag ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px' }}>
              {sorted.map((tool) => (
                <SortableToolGridCard key={tool.id} tool={tool} onOpenDetail={onOpenDetail} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px' }}>
          {sorted.map((tool) => (
            <div key={tool.id} onClick={() => onOpenDetail(tool)}
              style={{ overflow: 'hidden', background: '#EDE0E5', cursor: 'pointer', position: 'relative' }}>
              <div style={imgBoxStyle}>
                {tool.img_url
                  ? <img src={tool.img_url} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ToolSvgSm /></div>
                }
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="list">
          {sorted.map((tool) => (
            <div key={tool.id} className="yarn-row" onClick={() => onOpenDetail(tool)}>
              <div className="yarn-thumb">
                {tool.img_url ? <img src={tool.img_url} alt="" /> : <ToolSvgSm />}
              </div>
              <div className="yarn-info">
                <div className="yarn-name">{tool.type || tool.name || '名前なし'}</div>
                <div className="yarn-tags">
                  {tool.name ? <span className="tag">{tool.name}</span> : null}
                  {tool.size ? <span className="meta-text">{tool.size}</span> : null}
                </div>
                {tool.memo ? (
                  <div className="meta-text" style={{ marginTop: '3px' }}>
                    {tool.memo.slice(0, 30)}{tool.memo.length > 30 ? '…' : ''}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
