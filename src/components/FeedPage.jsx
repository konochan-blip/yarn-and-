import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { PersonSvg, WorkSvgSm } from '../lib/svgs'

export default function FeedPage({
  follows, feedWorks, feedProfiles, feedLoaded, feedLoading,
  onFollowUser, onUnfollowUser, onOpenProfile, onOpenWork,
}) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const timerRef = useRef(null)

  const followingIds = new Set(follows.map((f) => f.following_id))

  function handleQueryChange(e) {
    const q = e.target.value
    setQuery(q)
    clearTimeout(timerRef.current)
    if (!q.trim()) { setSearchResults([]); return }
    timerRef.current = setTimeout(() => doSearch(q.trim()), 400)
  }

  async function doSearch(q) {
    setSearching(true)
    const term = q.startsWith('@') ? q.slice(1) : q
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_public', true)
      .or(`username.ilike.%${term}%,handle.ilike.%${term}%`)
      .limit(15)
    setSearchResults(data || [])
    setSearching(false)
  }

  function clearSearch() {
    setQuery('')
    setSearchResults([])
  }

  const sortedFeedWorks = [...feedWorks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  return (
    <>
      {/* Search bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }}
            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="ユーザー名で検索…"
            style={{
              width: '100%', fontFamily: 'inherit', fontSize: '14px',
              padding: '10px 40px 10px 40px',
              border: '1px solid var(--border)', borderRadius: '99px',
              background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none',
            }}
          />
          {query && (
            <button onClick={clearSearch} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: '16px', lineHeight: 1, padding: '2px' }}>×</button>
          )}
        </div>

        {/* Search results */}
        {(searching || searchResults.length > 0 || (query && !searching)) && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', marginTop: '8px', overflow: 'hidden' }}>
            {searching && (
              <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '14px', textAlign: 'center' }}>検索中…</div>
            )}
            {!searching && searchResults.length === 0 && query && (
              <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '14px', textAlign: 'center' }}>「{query}」のユーザーが見つかりません</div>
            )}
            {searchResults.map((p) => {
              const isFollowing = followingIds.has(p.user_id)
              return (
                <div key={p.user_id}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', transition: 'background 0.1s' }}
                  onClick={() => onOpenProfile(p)}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', background: 'var(--accent-light)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--border)' }}>
                    {p.avatar_url ? <img src={p.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <PersonSvg />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.username || 'ユーザー'}</div>
                    {p.handle && <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '1px' }}>@{p.handle}</div>}
                    {p.bio && <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>{p.bio}</div>}
                  </div>
                  <button
                    className={`btn${isFollowing ? '' : ' primary'}`}
                    style={{ padding: '5px 14px', fontSize: '12px', flexShrink: 0 }}
                    onClick={(e) => { e.stopPropagation(); isFollowing ? onUnfollowUser(p.user_id) : onFollowUser(p.user_id) }}
                  >
                    {isFollowing ? 'フォロー中' : 'フォロー'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Following row */}
      {follows.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '0.06em', marginBottom: '10px' }}>フォロー中 {follows.length}人</div>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '6px' }}>
            {follows.map((f) => {
              const p = feedProfiles.find((pr) => pr.user_id === f.following_id)
              return (
                <div key={f.following_id}
                  onClick={() => p && onOpenProfile(p)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', flexShrink: 0, cursor: 'pointer' }}>
                  <div style={{ width: '54px', height: '54px', borderRadius: '50%', overflow: 'hidden', background: 'var(--accent-light)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p?.avatar_url ? <img src={p.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <PersonSvg />}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', maxWidth: '56px', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p?.username || '…'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {follows.length === 0 && !query && (
        <div className="empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          ユーザー名で検索して<br />気になる人をフォローしてみよう
        </div>
      )}

      {/* Feed grid */}
      {follows.length > 0 && (
        <>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '0.06em', marginBottom: '10px' }}>タイムライン</div>
          {(!feedLoaded || feedLoading) ? (
            <div className="loading">読み込み中…</div>
          ) : sortedFeedWorks.length === 0 ? (
            <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '32px 20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)', lineHeight: 1.8 }}>
              フォロー中のユーザーは<br />まだ作品を登録していません
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px' }}>
              {sortedFeedWorks.map((work) => {
                const author = feedProfiles.find((p) => p.user_id === work.user_id)
                return (
                  <div key={work.id} onClick={() => onOpenWork(work)}
                    style={{ aspectRatio: '1', overflow: 'hidden', background: '#EDE0E5', cursor: 'pointer', position: 'relative' }}>
                    {work.img_url
                      ? <img src={work.img_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WorkSvgSm /></div>
                    }
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.52))', padding: '18px 6px 5px', pointerEvents: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.25)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {author?.avatar_url && <img src={author.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
                        </div>
                        <div style={{ fontSize: '10px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{author?.username || ''}</div>
                      </div>
                      <div style={{ fontSize: '11px', color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>{work.name || ''}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </>
  )
}
