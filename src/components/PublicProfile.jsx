import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { PersonSvg, WorkSvgSm, YarnSvgSm, BookSvgSm, ToolSvgSm } from '../lib/svgs'
import YarnDetail from './YarnDetail'
import ToolDetail from './ToolDetail'
import BookDetail from './BookDetail'
import WorkDetail from './WorkDetail'

export default function PublicProfile({ profile, currentUserId, isFollowing, onFollow, onUnfollow, onClose }) {
  const [followersCount, setFollowersCount] = useState(null)
  const [followingCount, setFollowingCount] = useState(null)
  const [profileYarns, setProfileYarns] = useState([])
  const [profileTools, setProfileTools] = useState([])
  const [profileBooks, setProfileBooks] = useState([])
  const [profileWorks, setProfileWorks] = useState([])
  const [dataLoading, setDataLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('work')
  const [detailYarn, setDetailYarn] = useState(null)
  const [detailTool, setDetailTool] = useState(null)
  const [detailBook, setDetailBook] = useState(null)
  const [detailWork, setDetailWork] = useState(null)

  useEffect(() => {
    if (!profile) return
    setFollowersCount(null)
    setFollowingCount(null)
    setProfileYarns([])
    setProfileTools([])
    setProfileBooks([])
    setProfileWorks([])
    setDetailYarn(null)
    setDetailTool(null)
    setDetailBook(null)
    setDetailWork(null)

    if (!profile.is_public) {
      Promise.all([
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', profile.user_id),
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', profile.user_id),
      ]).then(([{ count: fc }, { count: ing }]) => {
        setFollowersCount(fc ?? 0)
        setFollowingCount(ing ?? 0)
      })
      return
    }

    setDataLoading(true)
    Promise.all([
      supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', profile.user_id),
      supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', profile.user_id),
      supabase.from('yarns').select('*').eq('user_id', profile.user_id).order('created_at'),
      supabase.from('tools').select('*').eq('user_id', profile.user_id).order('created_at'),
      supabase.from('books').select('*').eq('user_id', profile.user_id).order('created_at'),
      supabase.from('works').select('*').eq('user_id', profile.user_id).order('created_at', { ascending: false }),
    ]).then(([{ count: fc }, { count: ing }, { data: y }, { data: t }, { data: b }, { data: w }]) => {
      setFollowersCount(fc ?? 0)
      setFollowingCount(ing ?? 0)
      setProfileYarns(y || [])
      setProfileTools(t || [])
      setProfileBooks(b || [])
      setProfileWorks(w || [])
      setDataLoading(false)
    })
  }, [profile?.user_id])

  if (!profile) return null

  const TABS = [
    { key: 'work', label: '作品', count: profileWorks.length },
    { key: 'yarn', label: '毛糸', count: profileYarns.length },
    { key: 'tool', label: '道具', count: profileTools.length },
    { key: 'book', label: '書籍', count: profileBooks.length },
  ]

  return (
    <div className="mypage-overlay">
      <WorkDetail
        work={detailWork}
        yarns={profileYarns}
        books={profileBooks}
        currentUserId={currentUserId}
        onClose={() => setDetailWork(null)}
        onOpenYarnDetail={(y) => { setDetailWork(null); setDetailYarn(y) }}
        onOpenBookDetail={(b) => { setDetailWork(null); setDetailBook(b) }}
      />
      <YarnDetail
        yarn={detailYarn}
        works={profileWorks}
        onClose={() => setDetailYarn(null)}
        onOpenWorkDetail={(w) => { setDetailYarn(null); setDetailWork(w) }}
      />
      <ToolDetail tool={detailTool} onClose={() => setDetailTool(null)} />
      <BookDetail
        book={detailBook}
        works={profileWorks}
        onClose={() => setDetailBook(null)}
        onOpenWorkDetail={(w) => { setDetailBook(null); setDetailWork(w) }}
      />

      <div className="mypage-topbar">
        <button className="btn" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={onClose}>← 戻る</button>
        <span className="mypage-topbar-title">{profile.username || 'プロフィール'}</span>
        {isFollowing ? (
          <button className="btn" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => onUnfollow(profile.user_id)}>フォロー中</button>
        ) : profile.is_public ? (
          <button className="btn primary" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => onFollow(profile.user_id)}>フォローする</button>
        ) : (
          <button className="btn" style={{ padding: '6px 14px', fontSize: '13px', opacity: 0.5, cursor: 'default' }} disabled>🔒 非公開</button>
        )}
      </div>

      <div className="mypage-body">
        <div className="mypage-profile-card">
          <div className="mypage-avatar-wrap">
            {profile.avatar_url ? <img src={profile.avatar_url} alt="" /> : <PersonSvg />}
          </div>
          <div className="mypage-username">{profile.username || 'ユーザー'}</div>
          <div className={`mypage-badge ${profile.is_public ? 'public' : 'private'}`}>
            {profile.is_public ? (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                公開
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                非公開
              </>
            )}
          </div>
          {profile.bio ? (
            <div className="mypage-bio">{profile.bio}</div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>自己紹介未設定</div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <div className="mypage-stat">
            <span className="mypage-stat-num">{followersCount === null ? '…' : followersCount}</span>
            <span className="mypage-stat-label">フォロワー</span>
          </div>
          <div className="mypage-stat">
            <span className="mypage-stat-num">{followingCount === null ? '…' : followingCount}</span>
            <span className="mypage-stat-label">フォロー中</span>
          </div>
        </div>

        {profile.is_public ? (
          <>
            <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', marginBottom: '14px', gap: '2px' }}>
              {TABS.map(({ key, label, count }) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  style={{
                    flex: 1, padding: '6px 2px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                    fontSize: '12px', fontFamily: 'inherit', fontWeight: activeTab === key ? 600 : 400,
                    background: activeTab === key ? 'var(--accent)' : 'transparent',
                    color: activeTab === key ? '#fff' : 'var(--text-secondary)',
                    transition: 'all 0.18s',
                  }}>
                  {label}
                  {!dataLoading && count > 0 && <span style={{ fontSize: '10px', opacity: 0.8, marginLeft: '3px' }}>{count}</span>}
                </button>
              ))}
            </div>

            {dataLoading ? (
              <div className="loading">読み込み中…</div>
            ) : (
              <>
                {activeTab === 'work' && (
                  profileWorks.length === 0 ? (
                    <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)', padding: '28px 0' }}>まだ作品が登録されていません</div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px' }}>
                      {profileWorks.map((work) => (
                        <div key={work.id} onClick={() => setDetailWork(work)}
                          style={{ aspectRatio: '1', overflow: 'hidden', background: '#EDE0E5', cursor: 'pointer', position: 'relative' }}>
                          {work.img_url
                            ? <img src={work.img_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WorkSvgSm /></div>
                          }
                          {work.name && (
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.45))', padding: '14px 6px 5px', pointerEvents: 'none' }}>
                              <div style={{ fontSize: '11px', color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{work.name}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                )}

                {activeTab === 'yarn' && (
                  profileYarns.length === 0 ? (
                    <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)', padding: '28px 0' }}>まだ毛糸が登録されていません</div>
                  ) : (
                    <div className="list">
                      {profileYarns.map((yarn) => (
                        <div key={yarn.id} className="yarn-row" onClick={() => setDetailYarn(yarn)}>
                          <div className="yarn-thumb">
                            {yarn.img_url ? <img src={yarn.img_url} alt="" /> : <YarnSvgSm />}
                          </div>
                          <div className="yarn-info">
                            <div className="yarn-name">{yarn.name || '名前なし'}</div>
                            <div className="yarn-meta">{[yarn.colorname, yarn.material].filter(Boolean).join(' · ')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {activeTab === 'tool' && (
                  profileTools.length === 0 ? (
                    <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)', padding: '28px 0' }}>まだ道具が登録されていません</div>
                  ) : (
                    <div className="list">
                      {profileTools.map((tool) => (
                        <div key={tool.id} className="yarn-row" onClick={() => setDetailTool(tool)}>
                          <div className="yarn-thumb">
                            {tool.img_url ? <img src={tool.img_url} alt="" /> : <ToolSvgSm />}
                          </div>
                          <div className="yarn-info">
                            <div className="yarn-name">{tool.name || '名前なし'}</div>
                            <div className="yarn-meta">{[tool.type, tool.size].filter(Boolean).join(' · ')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {activeTab === 'book' && (
                  profileBooks.length === 0 ? (
                    <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)', padding: '28px 0' }}>まだ書籍が登録されていません</div>
                  ) : (
                    <div className="list">
                      {profileBooks.map((book) => (
                        <div key={book.id} className="yarn-row" onClick={() => setDetailBook(book)}>
                          <div className="yarn-thumb">
                            {book.img_url ? <img src={book.img_url} alt="" /> : <BookSvgSm />}
                          </div>
                          <div className="yarn-info">
                            <div className="yarn-name">{book.title || '無題'}</div>
                            <div className="yarn-meta">{[book.author, book.publisher].filter(Boolean).join(' · ')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </>
            )}
          </>
        ) : (
          <div style={{ background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', padding: '28px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔒</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>非公開アカウントです</div>
          </div>
        )}
      </div>
    </div>
  )
}
