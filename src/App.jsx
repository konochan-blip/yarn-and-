import { useState, useEffect } from 'react'
import { supabase, uploadImage } from './lib/supabase'
import AuthPage from './components/AuthPage'
import Header from './components/Header'
import TabBar from './components/TabBar'
import YarnList from './components/YarnList'
import ToolsList from './components/ToolsList'
import BooksList from './components/BooksList'
import WorksList from './components/WorksList'
import FeedPage from './components/FeedPage'
import YarnForm from './components/YarnForm'
import ToolForm from './components/ToolForm'
import BookForm from './components/BookForm'
import WorkForm from './components/WorkForm'
import YarnDetail from './components/YarnDetail'
import ToolDetail from './components/ToolDetail'
import BookDetail from './components/BookDetail'
import WorkDetail from './components/WorkDetail'
import LabelSearch from './components/LabelSearch'
import ShopSettings from './components/ShopSettings'
import MyPage from './components/MyPage'
import ProfileForm from './components/ProfileForm'
import PublicProfile from './components/PublicProfile'

export default function App() {
  // ────────── Auth ───────────────────────────────
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session) {
        setYarns([]); setTools([]); setBooks([]); setWorks([]); setShops([])
        setFollows([]); setFollowersCount(0); setFeedWorks([]); setFeedProfiles([]); setFeedLoaded(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { if (user) loadAll() }, [user])

  async function handleSignOut() { await supabase.auth.signOut() }

  // ────────── Data ───────────────────────────────
  const [yarns,  setYarns]  = useState([])
  const [tools,  setTools]  = useState([])
  const [books,  setBooks]  = useState([])
  const [works,  setWorks]  = useState([])
  const [shops,  setShops]  = useState([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('yarn')

  // Sort / filter
  const [yarnSort,    setYarnSort]    = useState('default')
  const [toolsSort,   setToolsSort]   = useState('default')
  const [booksSort,   setBooksSort]   = useState('default')
  const [worksSort,   setWorksSort]   = useState('default')
  const [yarnView,    setYarnView]    = useState('list')
  const [toolsView,   setToolsView]   = useState('list')
  const [booksView,   setBooksView]   = useState('list')
  const [worksView,   setWorksView]   = useState('list')
  const [needleFilter, setNeedleFilter] = useState('')

  // Modals
  const [yarnFormOpen,  setYarnFormOpen]  = useState(false)
  const [editingYarn,   setEditingYarn]   = useState(null)
  const [toolFormOpen,  setToolFormOpen]  = useState(false)
  const [editingTool,   setEditingTool]   = useState(null)
  const [bookFormOpen,  setBookFormOpen]  = useState(false)
  const [editingBook,   setEditingBook]   = useState(null)
  const [workFormOpen,  setWorkFormOpen]  = useState(false)
  const [editingWork,   setEditingWork]   = useState(null)
  const [detailYarn,    setDetailYarn]    = useState(null)
  const [detailTool,    setDetailTool]    = useState(null)
  const [detailBook,    setDetailBook]    = useState(null)
  const [detailWork,    setDetailWork]    = useState(null)
  const [labelSearchOpen,  setLabelSearchOpen]  = useState(false)
  const [settingsOpen,     setSettingsOpen]     = useState(false)
  const [myPageOpen,       setMyPageOpen]       = useState(false)
  const [profileFormOpen,  setProfileFormOpen]  = useState(false)
  const [profile,          setProfile]          = useState(null)

  // ────────── Social ─────────────────────────────
  const [follows,         setFollows]         = useState([])   // who I follow
  const [followersCount,  setFollowersCount]  = useState(0)    // my follower count
  const [feedWorks,       setFeedWorks]       = useState([])
  const [feedProfiles,    setFeedProfiles]    = useState([])
  const [feedLoaded,      setFeedLoaded]      = useState(false)
  const [feedLoading,     setFeedLoading]     = useState(false)
  const [viewingProfile,  setViewingProfile]  = useState(null)

  // Trigger feed load when switching to feed tab
  useEffect(() => {
    if (tab === 'feed' && !feedLoaded && !loading) {
      setFeedLoading(true)
      loadFeed()
    }
  }, [tab, feedLoaded, loading]) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadAll() {
    setLoading(true)
    try {
      const [
        { data: y }, { data: t }, { data: b }, { data: w }, { data: s }, { data: p },
        { data: f }, { count: fc },
      ] = await Promise.all([
        supabase.from('yarns').select('*').order('created_at', { ascending: true }),
        supabase.from('tools').select('*').order('created_at', { ascending: true }),
        supabase.from('books').select('*').order('created_at', { ascending: true }),
        supabase.from('works').select('*').order('created_at', { ascending: true }),
        supabase.from('shops').select('name').order('created_at', { ascending: true }),
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('follows').select('*').eq('follower_id', user.id).catch(() => ({ data: null })),
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', user.id).catch(() => ({ count: 0 })),
      ])
      setYarns(y || [])
      setTools(t || [])
      setBooks(b || [])
      setWorks(w || [])
      setShops((s || []).map((row) => row.name))
      setProfile(p || null)
      setFollows(f || [])
      setFollowersCount(fc ?? 0)
      setFeedLoaded(false)
    } catch (err) {
      console.error('loadAll error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function loadFeed() {
    const currentFollows = await supabase.from('follows').select('*').eq('follower_id', user.id)
    const followingIds = (currentFollows.data || []).map((f) => f.following_id)
    if (followingIds.length === 0) {
      setFeedWorks([])
      setFeedProfiles([])
      setFeedLoaded(true)
      setFeedLoading(false)
      return
    }
    const [{ data: w }, { data: pr }] = await Promise.all([
      supabase.from('works').select('*').in('user_id', followingIds).order('created_at', { ascending: false }).limit(60),
      supabase.from('profiles').select('*').in('user_id', followingIds),
    ])
    setFeedWorks(w || [])
    setFeedProfiles(pr || [])
    setFeedLoaded(true)
    setFeedLoading(false)
  }

  // ────────── Image helper ───────────────────────
  async function resolveImgUrl(data, imgFile) {
    if (!imgFile) return data.img_url || ''
    try { return await uploadImage(imgFile) } catch { return data.img_url || '' }
  }

  // ────────── Profile CRUD ──────────────────────
  async function saveProfile(data, imgFile) {
    const avatar_url = await resolveImgUrl({ img_url: data.avatar_url }, imgFile)
    const record = { user_id: user.id, username: data.username, bio: data.bio, is_public: data.is_public, avatar_url }
    const { data: upserted } = await supabase.from('profiles').upsert(record, { onConflict: 'user_id' }).select().single()
    if (upserted) setProfile(upserted)
  }

  // ────────── Follow CRUD ───────────────────────
  async function followUser(userId) {
    const { data } = await supabase.from('follows').insert([{ follower_id: user.id, following_id: userId }]).select().single()
    if (!data) return
    setFollows((prev) => [...prev, data])
    // fetch their profile + works and add to feed
    const [{ data: pr }, { data: w }] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('works').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ])
    if (pr) setFeedProfiles((prev) => [...prev.filter((p) => p.user_id !== userId), pr])
    if (w) setFeedWorks((prev) => [...prev, ...w.filter((wk) => !prev.find((p) => p.id === wk.id))])
    setFeedLoaded(true)
  }

  async function unfollowUser(userId) {
    await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', userId)
    setFollows((prev) => prev.filter((f) => f.following_id !== userId))
    setFeedWorks((prev) => prev.filter((w) => w.user_id !== userId))
    setFeedProfiles((prev) => prev.filter((p) => p.user_id !== userId))
    // close public profile if viewing that user
    if (viewingProfile?.user_id === userId) setViewingProfile(null)
  }

  // ────────── Yarn CRUD ──────────────────────────
  async function saveYarn(data, imgFile) {
    const img_url = await resolveImgUrl(data, imgFile)
    const record = { user_id: user.id, name: data.name, color: data.color, colorname: data.colorname, material: data.material, lot: data.lot, count: data.count, price: data.price, memo: data.memo, shops: data.shops, img_url }
    if (data.id) {
      const { data: updated } = await supabase.from('yarns').update(record).eq('id', data.id).select().single()
      setYarns((prev) => prev.map((y) => y.id === data.id ? updated : y))
    } else {
      const { data: inserted } = await supabase.from('yarns').insert([record]).select().single()
      if (inserted) setYarns((prev) => [...prev, inserted])
    }
  }

  async function deleteYarn(id) {
    await supabase.from('yarns').delete().eq('id', id)
    setYarns((prev) => prev.filter((y) => y.id !== id))
    const affected = works.filter((w) => (w.yarn_ids || []).includes(id))
    for (const w of affected) {
      const yarn_ids = (w.yarn_ids || []).filter((yid) => yid !== id)
      await supabase.from('works').update({ yarn_ids }).eq('id', w.id)
      setWorks((prev) => prev.map((pw) => pw.id === w.id ? { ...pw, yarn_ids } : pw))
    }
  }

  async function mergeYarnCount(id, newCount) {
    await supabase.from('yarns').update({ count: newCount }).eq('id', id)
    setYarns((prev) => prev.map((y) => y.id === id ? { ...y, count: newCount } : y))
  }

  // ────────── Tool CRUD ──────────────────────────
  async function saveTool(data, imgFile) {
    const img_url = await resolveImgUrl(data, imgFile)
    const record = { user_id: user.id, name: data.name, type: data.type, size: data.size, memo: data.memo, img_url }
    if (data.id) {
      const { data: updated } = await supabase.from('tools').update(record).eq('id', data.id).select().single()
      setTools((prev) => prev.map((t) => t.id === data.id ? updated : t))
    } else {
      const { data: inserted } = await supabase.from('tools').insert([record]).select().single()
      if (inserted) setTools((prev) => [...prev, inserted])
    }
  }

  async function deleteTool(id) {
    await supabase.from('tools').delete().eq('id', id)
    setTools((prev) => prev.filter((t) => t.id !== id))
  }

  // ────────── Book CRUD ──────────────────────────
  async function saveBook(data, imgFile) {
    const img_url = await resolveImgUrl(data, imgFile)
    const record = { user_id: user.id, title: data.title, author: data.author, publisher: data.publisher, memo: data.memo, link: data.link, img_url }
    if (data.id) {
      const { data: updated } = await supabase.from('books').update(record).eq('id', data.id).select().single()
      setBooks((prev) => prev.map((b) => b.id === data.id ? updated : b))
    } else {
      const { data: inserted } = await supabase.from('books').insert([record]).select().single()
      if (inserted) setBooks((prev) => [...prev, inserted])
    }
  }

  async function deleteBook(id) {
    await supabase.from('books').delete().eq('id', id)
    setBooks((prev) => prev.filter((b) => b.id !== id))
    const affected = works.filter((w) => (w.book_ids || []).includes(id))
    for (const w of affected) {
      const book_ids = (w.book_ids || []).filter((bid) => bid !== id)
      await supabase.from('works').update({ book_ids }).eq('id', w.id)
      setWorks((prev) => prev.map((pw) => pw.id === w.id ? { ...pw, book_ids } : pw))
    }
  }

  // ────────── Work CRUD ──────────────────────────
  async function saveWork(data, imgFile) {
    const img_url = await resolveImgUrl(data, imgFile)
    const record = { user_id: user.id, name: data.name, needle: data.needle, memo: data.memo, ref: data.ref, yarn_ids: data.yarn_ids, book_ids: data.book_ids, img_url }
    if (data.id) {
      const { data: updated } = await supabase.from('works').update(record).eq('id', data.id).select().single()
      setWorks((prev) => prev.map((w) => w.id === data.id ? updated : w))
    } else {
      const { data: inserted } = await supabase.from('works').insert([record]).select().single()
      if (inserted) setWorks((prev) => [...prev, inserted])
    }
  }

  async function deleteWork(id) {
    await supabase.from('works').delete().eq('id', id)
    setWorks((prev) => prev.filter((w) => w.id !== id))
  }

  // ────────── Shop CRUD ──────────────────────────
  async function addShop(name) {
    const { error } = await supabase.from('shops').insert([{ user_id: user.id, name }])
    if (!error) setShops((prev) => [...prev, name])
  }

  async function deleteShop(name) {
    await supabase.from('shops').delete().eq('user_id', user.id).eq('name', name)
    setShops((prev) => prev.filter((s) => s !== name))
  }

  // ────────── Modal helpers ──────────────────────
  function handleAdd() {
    if      (tab === 'yarn')  { setEditingYarn(null);  setYarnFormOpen(true)  }
    else if (tab === 'tools') { setEditingTool(null);  setToolFormOpen(true)  }
    else if (tab === 'books') { setEditingBook(null);  setBookFormOpen(true)  }
    else if (tab === 'works') { setEditingWork(null);  setWorkFormOpen(true)  }
  }

  const isOwnWork = (work) => work?.user_id === user?.id

  // ────────── Render ─────────────────────────────
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading">読み込み中…</div>
      </div>
    )
  }

  if (!user) return <AuthPage />

  if (loading) {
    return (
      <>
        <Header tab={tab} profile={profile} onOpenMyPage={() => setMyPageOpen(true)} onOpenSettings={() => setSettingsOpen(true)} onAdd={handleAdd} onSignOut={handleSignOut} />
        <TabBar tab={tab} onChange={setTab} />
        <main className="main"><div className="loading">読み込み中…</div></main>
      </>
    )
  }

  return (
    <>
      <Header tab={tab} profile={profile} onOpenMyPage={() => setMyPageOpen(true)} onOpenSettings={() => setSettingsOpen(true)} onAdd={handleAdd} onSignOut={handleSignOut} />
      <TabBar tab={tab} onChange={setTab} />

      <main className="main">
        {tab === 'yarn' && (
          <YarnList yarns={yarns} works={works} sort={yarnSort} view={yarnView} onSortChange={setYarnSort}
            onViewChange={setYarnView} onOpenDetail={setDetailYarn} onOpenLabelSearch={() => setLabelSearchOpen(true)} />
        )}
        {tab === 'tools' && (
          <ToolsList tools={tools} sort={toolsSort} view={toolsView} onSortChange={setToolsSort}
            onViewChange={setToolsView} onOpenDetail={setDetailTool} />
        )}
        {tab === 'books' && (
          <BooksList books={books} works={works} sort={booksSort} view={booksView} onSortChange={setBooksSort}
            onViewChange={setBooksView} onOpenDetail={setDetailBook} />
        )}
        {tab === 'works' && (
          <WorksList works={works} yarns={yarns} sort={worksSort} needleFilter={needleFilter} view={worksView}
            onSortChange={setWorksSort} onNeedleFilterChange={setNeedleFilter}
            onViewChange={setWorksView} onOpenDetail={setDetailWork} />
        )}
        {tab === 'feed' && (
          <FeedPage
            follows={follows} feedWorks={feedWorks} feedProfiles={feedProfiles}
            feedLoaded={feedLoaded} feedLoading={feedLoading}
            onFollowUser={followUser} onUnfollowUser={unfollowUser}
            onOpenProfile={setViewingProfile}
            onOpenWork={setDetailWork}
          />
        )}
      </main>

      {/* Forms */}
      <YarnForm open={yarnFormOpen} editingYarn={editingYarn} shops={shops} yarns={yarns}
        onSave={saveYarn} onClose={() => setYarnFormOpen(false)} onMergeCount={mergeYarnCount} />
      <ToolForm open={toolFormOpen} editingTool={editingTool}
        onSave={saveTool} onClose={() => setToolFormOpen(false)} />
      <BookForm open={bookFormOpen} editingBook={editingBook}
        onSave={saveBook} onClose={() => setBookFormOpen(false)} />
      <WorkForm open={workFormOpen} editingWork={editingWork} yarns={yarns} books={books}
        onSave={saveWork} onClose={() => setWorkFormOpen(false)} />

      {/* Details */}
      <YarnDetail yarn={detailYarn} works={works}
        onClose={() => setDetailYarn(null)}
        onEdit={(yarn) => { setDetailYarn(null); setEditingYarn(yarn); setYarnFormOpen(true) }}
        onDelete={deleteYarn} onOpenWorkDetail={setDetailWork} />
      <ToolDetail tool={detailTool}
        onClose={() => setDetailTool(null)}
        onEdit={(tool) => { setDetailTool(null); setEditingTool(tool); setToolFormOpen(true) }}
        onDelete={deleteTool} />
      <BookDetail book={detailBook} works={works}
        onClose={() => setDetailBook(null)}
        onEdit={(book) => { setDetailBook(null); setEditingBook(book); setBookFormOpen(true) }}
        onDelete={deleteBook} onOpenWorkDetail={setDetailWork} />
      <WorkDetail work={detailWork} yarns={yarns} books={books}
        onClose={() => setDetailWork(null)}
        onEdit={isOwnWork(detailWork) ? (work) => { setDetailWork(null); setEditingWork(work); setWorkFormOpen(true) } : undefined}
        onDelete={isOwnWork(detailWork) ? deleteWork : undefined}
        onOpenYarnDetail={setDetailYarn} onOpenBookDetail={setDetailBook} />

      {/* Others */}
      <LabelSearch open={labelSearchOpen} yarns={yarns}
        onClose={() => setLabelSearchOpen(false)} onOpenDetail={setDetailYarn} />
      <ShopSettings open={settingsOpen} shops={shops}
        onClose={() => setSettingsOpen(false)} onAdd={addShop} onDelete={deleteShop} />
      <MyPage open={myPageOpen} profile={profile} yarns={yarns} tools={tools} books={books} works={works}
        followsCount={follows.length} followersCount={followersCount}
        onClose={() => setMyPageOpen(false)}
        onEdit={() => { setMyPageOpen(false); setProfileFormOpen(true) }} />
      <ProfileForm open={profileFormOpen} profile={profile}
        onSave={saveProfile} onClose={() => setProfileFormOpen(false)} />
      <PublicProfile
        profile={viewingProfile}
        feedWorks={feedWorks}
        isFollowing={follows.some((f) => f.following_id === viewingProfile?.user_id)}
        onFollow={followUser}
        onUnfollow={unfollowUser}
        onClose={() => setViewingProfile(null)}
        onOpenWork={setDetailWork}
      />

      <footer className="app-footer">
        <div className="footer-divider" />
        <span className="footer-logo">YARN&amp;</span>
        <span className="footer-copy">© 2026 YARN&amp; All rights reserved.</span>
      </footer>
    </>
  )
}
