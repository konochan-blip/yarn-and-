import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, rectSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import SortableItem, { DragHandle } from './SortableItem'
import { BookSvgSm } from '../lib/svgs'

const imgBoxStyle = { position: 'relative', width: '100%', paddingBottom: '100%', background: '#EDE0E5', overflow: 'hidden' }

function BookGridCard({ book, onOpenDetail }) {
  return (
    <div onClick={() => onOpenDetail(book)} style={{ cursor: 'pointer', overflow: 'hidden', background: '#EDE0E5' }}>
      <div style={imgBoxStyle}>
        {book.img_url
          ? <img src={book.img_url} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookSvgSm /></div>
        }
      </div>
    </div>
  )
}

function SortableBookGridCard({ book, onOpenDetail }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: book.id })
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => onOpenDetail(book)}
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
        {book.img_url
          ? <img src={book.img_url} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookSvgSm /></div>
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

export default function BooksList({ books, works, sort, view, onSortChange, onViewChange, onOpenDetail, onReorder }) {
  const [reorderMode, setReorderMode] = useState(false)
  const sorted = [...books]
  if (sort === 'new') sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  else if (sort === 'title') sorted.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'ja'))
  else if (sort === 'author') sorted.sort((a, b) => (a.author || '').localeCompare(b.author || '', 'ja'))

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

  function handleSortChange(v) { setReorderMode(false); onSortChange(v) }
  function handleViewChange(v) { setReorderMode(false); onViewChange(v) }

  return (
    <>
      <div className="toolbar">
        <label>並び替え</label>
        <select value={sort} onChange={(e) => handleSortChange(e.target.value)}>
          <option value="new">新しい順</option>
          <option value="default">登録順</option>
          <option value="title">タイトル順</option>
          <option value="author">著者順</option>
        </select>
        <span className="count-badge">{books.length}冊</span>
        <ViewToggle view={view} onViewChange={handleViewChange} />
      </div>

      {canEnterReorder && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 0 6px' }}>
          <button onClick={() => setReorderMode((v) => !v)}
            style={{ fontFamily: 'inherit', fontSize: '12px', padding: '4px 12px', borderRadius: '99px', border: '1px solid var(--accent)', background: reorderMode ? 'var(--accent)' : 'transparent', color: reorderMode ? '#fff' : 'var(--accent)', cursor: 'pointer' }}>
            {reorderMode ? '完了' : '並び替え'}
          </button>
        </div>
      )}

      {books.length === 0 ? (
        <div className="empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          まだ書籍が登録されていないよ<br />「＋ 書籍追加」から登録してみてね
        </div>
      ) : canDrag ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px' }}>
              {sorted.map((book) => (
                <SortableBookGridCard key={book.id} book={book} onOpenDetail={onOpenDetail} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px' }}>
          {sorted.map((book) => (
            <BookGridCard key={book.id} book={book} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      ) : sort === 'default' ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="list">
              {sorted.map((book) => {
                const workCount = works.filter((w) => (w.book_ids || []).includes(book.id)).length
                return (
                  <SortableItem key={book.id} id={book.id}>
                    {({ handleProps }) => (
                      <div className="yarn-row" onClick={() => onOpenDetail(book)}>
                        <DragHandle {...handleProps} />
                        <div className="yarn-thumb">
                          {book.img_url ? <img src={book.img_url} alt="" /> : <BookSvgSm />}
                        </div>
                        <div className="yarn-info">
                          <div className="yarn-name">{book.title || '無題'}</div>
                          <div className="yarn-tags">
                            {book.author ? <span className="tag">{book.author}</span> : null}
                            {book.publisher ? <span className="meta-text">{book.publisher}</span> : null}
                          </div>
                          {workCount > 0 && (
                            <div className="yarn-tags" style={{ marginTop: '4px' }}>
                              <span className="tag work">✦ {workCount}作品</span>
                            </div>
                          )}
                        </div>
                        {book.link && (
                          <div style={{ flexShrink: 0, color: 'var(--text-tertiary)' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                          </div>
                        )}
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
          {sorted.map((book) => {
            const workCount = works.filter((w) => (w.book_ids || []).includes(book.id)).length
            return (
              <div key={book.id} className="yarn-row" onClick={() => onOpenDetail(book)}>
                <div className="yarn-thumb">
                  {book.img_url ? <img src={book.img_url} alt="" /> : <BookSvgSm />}
                </div>
                <div className="yarn-info">
                  <div className="yarn-name">{book.title || '無題'}</div>
                  <div className="yarn-tags">
                    {book.author ? <span className="tag">{book.author}</span> : null}
                    {book.publisher ? <span className="meta-text">{book.publisher}</span> : null}
                  </div>
                  {workCount > 0 && (
                    <div className="yarn-tags" style={{ marginTop: '4px' }}>
                      <span className="tag work">✦ {workCount}作品</span>
                    </div>
                  )}
                </div>
                {book.link && (
                  <div style={{ flexShrink: 0, color: 'var(--text-tertiary)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
