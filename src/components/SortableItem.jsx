import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export function DragHandle(props) {
  return (
    <div
      {...props}
      onClick={(e) => e.stopPropagation()}
      style={{ display: 'flex', alignItems: 'center', padding: '0 8px 0 2px', cursor: 'grab', color: 'var(--text-tertiary)', touchAction: 'none', flexShrink: 0, userSelect: 'none' }}
    >
      <svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor">
        <circle cx="4" cy="3" r="1.5"/><circle cx="10" cy="3" r="1.5"/>
        <circle cx="4" cy="9" r="1.5"/><circle cx="10" cy="9" r="1.5"/>
        <circle cx="4" cy="15" r="1.5"/><circle cx="10" cy="15" r="1.5"/>
      </svg>
    </div>
  )
}

export default function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 999 : 'auto',
  }
  return (
    <div ref={setNodeRef} style={style}>
      {children({ handleProps: { ...attributes, ...listeners } })}
    </div>
  )
}
