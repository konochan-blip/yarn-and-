import { ToolSvgSm } from '../lib/svgs'

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

export default function ToolsList({ tools, sort, view, onSortChange, onViewChange, onOpenDetail }) {
  const sorted = [...tools]
  if (sort === 'name') sorted.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ja'))
  else sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  return (
    <>
      <div className="toolbar">
        <label>並び替え</label>
        <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="default">登録順</option>
          <option value="name">名前順</option>
        </select>
        <span className="count-badge">{tools.length}点</span>
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>

      {tools.length === 0 ? (
        <div className="empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          まだ道具が登録されていないよ<br />「＋ 道具追加」から登録してみてね
        </div>
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px' }}>
          {sorted.map((tool) => (
            <div key={tool.id} onClick={() => onOpenDetail(tool)}
              style={{ aspectRatio: '1', overflow: 'hidden', background: '#EDE0E5', cursor: 'pointer', position: 'relative' }}>
              {tool.img_url
                ? <img src={tool.img_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ToolSvgSm /></div>
              }
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.45))', padding: '16px 6px 5px', pointerEvents: 'none' }}>
                <div style={{ fontSize: '11px', color: '#fff', fontWeight: 600, lineHeight: 1.2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{tool.name || '名前なし'}</div>
                {tool.size && <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>{tool.size}</div>}
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
                <div className="yarn-name">{tool.name || '名前なし'}</div>
                <div className="yarn-tags">
                  {tool.type ? <span className="tag">{tool.type}</span> : null}
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
