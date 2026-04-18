export default function TabBar({ tab, onChange }) {
  return (
    <div className="tab-bar">
      <button className={`tab-btn${tab === 'yarn'  ? ' active' : ''}`} onClick={() => onChange('yarn')}>毛糸</button>
      <button className={`tab-btn${tab === 'tools' ? ' active' : ''}`} onClick={() => onChange('tools')}>道具</button>
      <button className={`tab-btn${tab === 'books' ? ' active' : ''}`} onClick={() => onChange('books')}>書籍</button>
      <button className={`tab-btn${tab === 'works' ? ' active' : ''}`} onClick={() => onChange('works')}>作品</button>
      <button className={`tab-btn${tab === 'feed'  ? ' active' : ''}`} onClick={() => onChange('feed')}>フィード</button>
    </div>
  )
}
