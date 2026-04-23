import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import SortableItem, { DragHandle } from './SortableItem'
import { BookSvgSm } from '../lib/svgs'

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
  const sorted = [...books]
  if (sort === 'title') sorted.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'ja'))
  else if (sort === 'author') sorted.sort((a, b) => (a.author || '').localeCompare(b.author || '', 'ja'))
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
          <option value="title">タイトル順</option>
          <option value="author">著者順</option>
        </select>
        <span className="count-badge">{books.length}冊</span>
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>

      {books.length === 0 ? (
        <div className="empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          まだ書籍が登録されていないよ<br />「＋ 書籍追加」から登録してみてね
        </div>
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px' }}>
          {sorted.map((book) => (
            <div key={book.id} onClick={() => onOpenDetail(book)}
              style={{ aspectRatio: '1', overflow: 'hidden', background: '#EDE0E5', cursor: 'pointer', position: 'relative' }}>
              {book.img_url
                ? <img src={book.img_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookSvgSm /></div>
              }
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.45))', padding: '16px 6px 5px', pointerEvents: 'none' }}>
                <div style={{ fontSize: '11px', color: '#fff', fontWeight: 600, lineHeight: 1.2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{book.title || '無題'}</div>
                {book.author && <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>{book.author}</div>}
              </div>
            </div>
          ))}
        </div>
      ) : canDrag ? (
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
