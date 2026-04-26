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
import Dock from './components/Dock'
import MyPage from './components/MyPage'
import ProfileForm from './components/ProfileForm'
import PublicProfile from './components/PublicProfile'
import ChangePasswordModal from './components/ChangePasswordModal'
import ChangeHandleModal from './components/ChangeHandleModal'
import LandingPage from './components/LandingPage'
import TermsPage from './components/TermsPage'
import PrivacyPolicyPage from './components/PrivacyPolicyPage'
import WithdrawModal from './components/WithdrawModal'
import ContactModal from './components/ContactModal'
import FaqPage from './components/FaqPage'
import TutorialModal, { shouldShowTutorial } from './components/TutorialModal'

export default function App() {
  // ────────── URL-based public profile ──────────
  const [urlHandle] = useState(() => window.location.pathname.match(/^\/user\/([^/]+)$/)?.[1] || null)
  const [urlProfile, setUrlProfile] = useState(null)
  const [urlProfileLoading, setUrlProfileLoading] = useState(!!window.location.pathname.match(/^\/user\/([^/]+)$/))
  const [urlModeExited, setUrlModeExited] = useState(false)

  useEffect(() => {
    if (!urlHandle) return
    supabase.from('profiles').select('*').eq('is_public', true)
      .or(`handle.eq.${urlHandle},username.eq.${urlHandle}`)
      .maybeSingle()
      .then(({ data }) => { setUrlProfile(data || null); setUrlProfileLoading(false) })
  }, []) // eslint-disable-line

  // ────────── Auth ───────────────────────────────
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [passwordRecovery, setPasswordRecovery] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [changeHandleOpen,   setChangeHandleOpen]   = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true)
      if (event === 'SIGNED_IN' && shouldShowTutorial()) setShowTutorial(true)
      if (!session) {
        setYarns([]); setTools([]); setBooks([]); setWorks([]); setShops([])
        setFollows([]); setFollowersCount(0); setFeedWorks([]); setFeedProfiles([]); setFeedLoaded(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { if (user) loadAll() }, [user])

  // ────────── Data ───────────────────────────────
  const [yarns,  setYarns]  = useState([])
  const [tools,  setTools]  = useState([])
  const [books,  setBooks]  = useState([])
  const [works,  setWorks]  = useState([])
  const [shops,  setShops]  = useState([])
  const [loading, setLoading] = useState(false)

  // ログイン済みユーザーが /user/:handle で来た場合、データ読込後にプロフィールを開く
  useEffect(() => {
    if (user && urlProfile && !loading) setViewingProfile(urlProfile)
  }, [user, urlProfile, loading]) // eslint-disable-line

  async function handleSignOut() { await supabase.auth.signOut() }
  const [tab, setTab] = useState(() => localStorage.getItem('active_tab') || 'yarn')
  function changeTab(t) { setTab(t); localStorage.setItem('active_tab', t) }

  // Sort / filter
  const [yarnSort,    setYarnSort]    = useState('new')
  const [toolsSort,   setToolsSort]   = useState('new')
  const [booksSort,   setBooksSort]   = useState('new')
  const [worksSort,   setWorksSort]   = useState('new')
  const [yarnView,    setYarnView]    = useState(() => localStorage.getItem('view_yarn')  || 'list')
  const [toolsView,   setToolsView]   = useState(() => localStorage.getItem('view_tools') || 'list')
  const [booksView,   setBooksView]   = useState(() => localStorage.getItem('view_books') || 'list')
  const [worksView,   setWorksView]   = useState(() => localStorage.getItem('view_works') || 'list')
  function changeYarnView(v)  { setYarnView(v);  localStorage.setItem('view_yarn',  v) }
  function changeToolsView(v) { setToolsView(v); localStorage.setItem('view_tools', v) }
  function changeBooksView(v) { setBooksView(v); localStorage.setItem('view_books', v) }
  function changeWorksView(v) { setWorksView(v); localStorage.setItem('view_works', v) }
  const [needleFilter, setNeedleFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Modals
  const [yarnFormOpen,  setYarnFormOpen]  = useState(false)
  const [editingYarn,   setEditingYarn]   = useState(null)
  const [toolFormOpen,  setToolFormOpen]  = useState(false)
  const [editingTool,   setEditingTool]   = useState(null)
  const [bookFormOpen,  setBookFormOpen]  = useState(false)
  const [editingBook,   setEditingBook]   = useState(null)
  const [workFormOpen,  setWorkFormOpen]  = useState(false)
  const [editingWork,   setEditingWork]   = useState(null)
  const [detailYarn,       setDetailYarn]       = useState(null)
  const [detailTool,       setDetailTool]       = useState(null)
  const [detailBook,       setDetailBook]       = useState(null)
  const [detailWork,       setDetailWork]       = useState(null)
  const [detailWorkAuthor, setDetailWorkAuthor] = useState(null)
  const [labelSearchOpen,  setLabelSearchOpen]  = useState(false)
  const [settingsOpen,     setSettingsOpen]     = useState(false)
  const [myPageOpen,       setMyPageOpen]       = useState(false)
  const [profileFormOpen,  setProfileFormOpen]  = useState(false)
  const [profile,          setProfile]          = useState(null)

  // ────────── Social ─────────────────────────────
  const [follows,             setFollows]             = useState([])   // who I follow
  const [followersCount,      setFollowersCount]      = useState(0)    // my follower count
  const [feedWorks,           setFeedWorks]           = useState([])
  const [feedProfiles,        setFeedProfiles]        = useState([])
  const [feedLoaded,          setFeedLoaded]          = useState(false)
  const [feedLoading,         setFeedLoading]         = useState(false)
  const [publicWorks,         setPublicWorks]         = useState([])
  const [publicProfiles,      setPublicProfiles]      = useState([])
  const [publicWorksLoaded,   setPublicWorksLoaded]   = useState(false)
  const [publicWorksLoading,  setPublicWorksLoading]  = useState(false)
  const [yarnCountsMap,       setYarnCountsMap]       = useState({})
  const [viewingProfile,      setViewingProfile]      = useState(null)

  // Trigger feed load when switching to feed tab
  useEffect(() => {
    if (!user) return
    if (tab === 'feed' && !feedLoaded && !loading) {
      setFeedLoading(true)
      loadFeed()
    }
    // フォロー0人でフィードを開いたら公開作品も先読みする
    if (tab === 'feed' && !loading && follows.length === 0 && !publicWorksLoaded && !publicWorksLoading) {
      loadPublicWorks()
    }
  }, [tab, feedLoaded, loading]) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadAll() {
    setLoading(true)
    try {
      const [
        { data: y }, { data: t }, { data: b }, { data: w }, { data: s }, { data: p },
        { data: f }, { count: fc }, { data: yc },
      ] = await Promise.all([
        supabase.from('yarns').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
        supabase.from('tools').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
        supabase.from('books').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
        supabase.from('works').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
        supabase.from('shops').select('name').order('created_at', { ascending: true }),
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('follows').select('*').eq('follower_id', user.id),
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', user.id),
        supabase.from('work_yarns').select('work_id'),
      ])
      const countsMap = {}
      yc?.forEach(({ work_id }) => { countsMap[work_id] = (countsMap[work_id] || 0) + 1 })
      setYarnCountsMap(countsMap)
      setYarns(y || [])
      setTools(t || [])
      setBooks(b || [])
      setWorks(w || [])
      const shopNames = (s || []).map((row) => row.name)
      if (shopNames.length === 0) {
        const defaults = ['ユザワヤ', '楽天', 'Amazon']
        try {
          await Promise.all(
            defaults.map((n) => supabase.from('shops').upsert({ user_id: user.id, name: n }, { onConflict: 'user_id,name' }))
          )
        } catch { /* seeding failure is non-fatal */ }
        setShops(defaults)
      } else {
        setShops(shopNames)
      }
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
    if (!user) return
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

  async function loadPublicWorks() {
    if (!user) return
    setPublicWorksLoading(true)
    try {
      const { data: pr } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_public', true)
        .neq('user_id', user.id)
      console.log('[loadPublicWorks] profiles found:', pr?.length, pr)
      if (!pr || pr.length === 0) {
        setPublicWorks([])
        setPublicProfiles([])
        setPublicWorksLoaded(true)
        return
      }
      const publicUserIds = pr.map((p) => p.user_id)
      const { data: w, error: wErr } = await supabase
        .from('works')
        .select('*')
        .in('user_id', publicUserIds)
        .limit(90)
      console.log('[loadPublicWorks] works:', w?.length, 'error:', wErr)
      const shuffled = [...(w || [])].sort(() => Math.random() - 0.5)
      setPublicWorks(shuffled)
      setPublicProfiles(pr)
      setPublicWorksLoaded(true)
    } finally {
      setPublicWorksLoading(false)
    }
  }

  // ────────── Image helper ───────────────────────
  async function resolveImgUrl(data, imgFile) {
    if (!imgFile) return data.img_url || ''
    try { return await uploadImage(imgFile) } catch { return data.img_url || '' }
  }

  // ────────── Profile CRUD ──────────────────────
  async function saveProfile(data, imgFile) {
    const avatar_url = await resolveImgUrl({ img_url: data.avatar_url }, imgFile)
    const record = { user_id: user.id, username: data.username, handle: data.handle || null, bio: data.bio, is_public: data.is_public, avatar_url, social_links: data.social_links || [], favorite_shops: data.favorite_shops || [] }
    const { data: upserted, error } = await supabase.from('profiles').upsert(record, { onConflict: 'user_id' }).select().single()
    if (error) {
      if (error.message?.includes('profiles_handle_unique') || (error.message?.includes('duplicate key') && error.message?.includes('handle')))
        throw new Error('このIDはすでに使われています')
      throw new Error(error.message || 'プロフィールの保存に失敗しました')
    }
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
      const maxOrder = yarns.reduce((m, y) => Math.max(m, y.sort_order || 0), 0)
      const { data: inserted } = await supabase.from('yarns').insert([{ ...record, sort_order: maxOrder + 1 }]).select().single()
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
      const maxOrder = tools.reduce((m, t) => Math.max(m, t.sort_order || 0), 0)
      const { data: inserted } = await supabase.from('tools').insert([{ ...record, sort_order: maxOrder + 1 }]).select().single()
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
      const maxOrder = books.reduce((m, b) => Math.max(m, b.sort_order || 0), 0)
      const { data: inserted } = await supabase.from('books').insert([{ ...record, sort_order: maxOrder + 1 }]).select().single()
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
    const pattern_imgs = await Promise.all(
      (data.patternItems || []).map((item) =>
        item.file ? uploadImage(item.file).catch(() => item.preview) : Promise.resolve(item.preview)
      )
    )
    const record = { user_id: user.id, name: data.name, needle: data.needle, memo: data.memo, private_memo: data.private_memo, ref: data.ref, categories: data.categories || [], yarn_ids: data.yarn_ids, book_ids: data.book_ids, img_url, pattern_imgs }
    if (data.id) {
      const { data: updated } = await supabase.from('works').update(record).eq('id', data.id).select().single()
      setWorks((prev) => prev.map((w) => w.id === data.id ? updated : w))
    } else {
      const maxOrder = works.reduce((m, w) => Math.max(m, w.sort_order || 0), 0)
      const { data: inserted } = await supabase.from('works').insert([{ ...record, sort_order: maxOrder + 1 }]).select().single()
      if (inserted) setWorks((prev) => [...prev, inserted])
    }
  }

  async function deleteWork(id) {
    await supabase.from('works').delete().eq('id', id)
    setWorks((prev) => prev.filter((w) => w.id !== id))
  }

  // ────────── Sort order ────────────────────────
  async function reorderYarns(items) {
    setYarns(items)
    await Promise.all(items.map((item, idx) => supabase.from('yarns').update({ sort_order: idx + 1 }).eq('id', item.id)))
  }
  async function reorderTools(items) {
    setTools(items)
    await Promise.all(items.map((item, idx) => supabase.from('tools').update({ sort_order: idx + 1 }).eq('id', item.id)))
  }
  async function reorderBooks(items) {
    setBooks(items)
    await Promise.all(items.map((item, idx) => supabase.from('books').update({ sort_order: idx + 1 }).eq('id', item.id)))
  }
  async function reorderWorks(items) {
    setWorks(items)
    await Promise.all(items.map((item, idx) => supabase.from('works').update({ sort_order: idx + 1 }).eq('id', item.id)))
  }

  // ────────── Shop CRUD ──────────────────────────
  async function addShop(name) {
    const { error } = await supabase.from('shops').upsert({ user_id: user.id, name }, { onConflict: 'user_id,name' })
    if (error) throw new Error(error.message || 'お店の追加に失敗しました')
    setShops((prev) => prev.includes(name) ? prev : [...prev, name])
  }

  async function deleteShop(name) {
    await supabase.from('shops').delete().eq('user_id', user.id).eq('name', name)
    setShops((prev) => prev.filter((s) => s !== name))
  }

  function handleYarnChange(workId, delta) {
    setYarnCountsMap((prev) => ({ ...prev, [workId]: Math.max(0, (prev[workId] || 0) + delta) }))
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
  if (authLoading || (urlHandle && urlProfileLoading)) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading">読み込み中…</div>
      </div>
    )
  }

  // URL-based public profile — show without login
  if (urlHandle && !urlModeExited && !user) {
    if (!urlProfile) {
      return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>プロフィールが見つかりませんでした</div>
          <button className="btn primary" onClick={() => setUrlModeExited(true)}>トップへ戻る</button>
        </div>
      )
    }
    return (
      <PublicProfile
        profile={urlProfile}
        currentUserId={null}
        isFollowing={false}
        onClose={() => setUrlModeExited(true)}
        onLoginClick={() => setUrlModeExited(true)}
      />
    )
  }

  if (!user) {
    if (showAuth) return <AuthPage initialMode={authMode} onBack={() => setShowAuth(false)} />
    return <LandingPage onLogin={() => { setAuthMode('login'); setShowAuth(true) }} onSignup={() => { setAuthMode('signup'); setShowAuth(true) }} />
  }

  if (loading) {
    return (
      <>
        <Header profile={profile} onOpenMyPage={() => setMyPageOpen(true)} onOpenSettings={() => setSettingsOpen(true)} onSignOut={handleSignOut} />
        <main className="main"><div className="loading">読み込み中…</div></main>
        <Dock tab={tab} onChange={changeTab} />
      </>
    )
  }

  return (
    <>
      <Header profile={profile} onOpenMyPage={() => setMyPageOpen(true)} onOpenSettings={() => setSettingsOpen(true)} onSignOut={handleSignOut} />
      <main className="main">
        {tab === 'yarn' && (
          <YarnList yarns={yarns} works={works} sort={yarnSort} view={yarnView} onSortChange={setYarnSort}
            onViewChange={changeYarnView} onOpenDetail={setDetailYarn} onOpenLabelSearch={() => setLabelSearchOpen(true)}
            onReorder={reorderYarns} />
        )}
        {tab === 'tools' && (
          <ToolsList tools={tools} sort={toolsSort} view={toolsView} onSortChange={setToolsSort}
            onViewChange={changeToolsView} onOpenDetail={setDetailTool} onReorder={reorderTools} />
        )}
        {tab === 'books' && (
          <BooksList books={books} works={works} sort={booksSort} view={booksView} onSortChange={setBooksSort}
            onViewChange={changeBooksView} onOpenDetail={setDetailBook} onReorder={reorderBooks} />
        )}
        {tab === 'works' && (
          <WorksList works={works} yarns={yarns} sort={worksSort} needleFilter={needleFilter} categoryFilter={categoryFilter} view={worksView}
            yarnCounts={yarnCountsMap}
            onSortChange={setWorksSort} onNeedleFilterChange={setNeedleFilter} onCategoryFilterChange={setCategoryFilter}
            onViewChange={changeWorksView} onOpenDetail={setDetailWork} onReorder={reorderWorks} />
        )}
        {tab === 'feed' && (
          <FeedPage
            follows={follows} feedWorks={feedWorks} feedProfiles={feedProfiles}
            feedLoaded={feedLoaded} feedLoading={feedLoading}
            publicWorks={publicWorks} publicProfiles={publicProfiles}
            publicWorksLoaded={publicWorksLoaded} publicWorksLoading={publicWorksLoading}
            yarnCounts={yarnCountsMap}
            onLoadPublicWorks={loadPublicWorks}
            onFollowUser={followUser} onUnfollowUser={unfollowUser}
            onOpenProfile={setViewingProfile}
            onOpenWork={(work, author) => { setDetailWork(work); setDetailWorkAuthor(author || null) }}
          />
        )}
      </main>

      {/* Forms */}
      <YarnForm open={yarnFormOpen} editingYarn={editingYarn} shops={shops} yarns={yarns}
        onSave={saveYarn} onClose={() => setYarnFormOpen(false)} onMergeCount={mergeYarnCount}
        onOpenShopSettings={() => setSettingsOpen(true)} />
      <ToolForm open={toolFormOpen} editingTool={editingTool}
        onSave={saveTool} onClose={() => setToolFormOpen(false)} />
      <BookForm open={bookFormOpen} editingBook={editingBook}
        onSave={saveBook} onClose={() => setBookFormOpen(false)} />
      <WorkForm open={workFormOpen} editingWork={editingWork} yarns={yarns} books={books}
        onSave={saveWork} onClose={() => setWorkFormOpen(false)} />

      {/* Details */}
      <YarnDetail yarn={detailYarn} works={works}
        onClose={() => setDetailYarn(null)}
        onEdit={detailYarn?.user_id === user?.id ? (yarn) => { setDetailYarn(null); setEditingYarn(yarn); setYarnFormOpen(true) } : undefined}
        onDelete={detailYarn?.user_id === user?.id ? deleteYarn : undefined}
        onOpenWorkDetail={setDetailWork} />
      <ToolDetail tool={detailTool}
        onClose={() => setDetailTool(null)}
        onEdit={detailTool?.user_id === user?.id ? (tool) => { setDetailTool(null); setEditingTool(tool); setToolFormOpen(true) } : undefined}
        onDelete={detailTool?.user_id === user?.id ? deleteTool : undefined} />
      <BookDetail book={detailBook} works={works}
        onClose={() => setDetailBook(null)}
        onEdit={detailBook?.user_id === user?.id ? (book) => { setDetailBook(null); setEditingBook(book); setBookFormOpen(true) } : undefined}
        onDelete={detailBook?.user_id === user?.id ? deleteBook : undefined}
        onOpenWorkDetail={setDetailWork} />
      <WorkDetail work={detailWork} yarns={yarns} books={books} currentUserId={user?.id}
        author={detailWorkAuthor}
        onClose={() => { setDetailWork(null); setDetailWorkAuthor(null) }}
        onEdit={isOwnWork(detailWork) ? (work) => { setDetailWork(null); setEditingWork(work); setWorkFormOpen(true) } : undefined}
        onDelete={isOwnWork(detailWork) ? deleteWork : undefined}
        onYarnChange={handleYarnChange}
        onOpenYarnDetail={setDetailYarn} onOpenBookDetail={setDetailBook}
        onOpenProfile={detailWorkAuthor ? () => { setDetailWork(null); setDetailWorkAuthor(null); setViewingProfile(detailWorkAuthor) } : undefined} />

      {/* Others */}
      <LabelSearch open={labelSearchOpen} yarns={yarns}
        onClose={() => setLabelSearchOpen(false)} onOpenDetail={setDetailYarn} />
      <ShopSettings open={settingsOpen} shops={shops}
        onClose={() => setSettingsOpen(false)} onAdd={addShop} onDelete={deleteShop} />
      <MyPage open={myPageOpen} profile={profile} yarns={yarns} tools={tools} books={books} works={works}
        followsCount={follows.length} followersCount={followersCount}
        follows={follows} feedProfiles={feedProfiles}
        onClose={() => setMyPageOpen(false)}
        onEdit={() => { setMyPageOpen(false); setProfileFormOpen(true) }}
        onOpenProfile={(p) => { setMyPageOpen(false); setViewingProfile(p) }}
        onChangePassword={() => { setMyPageOpen(false); setChangePasswordOpen(true) }}
        onChangeHandle={() => { setMyPageOpen(false); setChangeHandleOpen(true) }} />
      <ChangePasswordModal open={changePasswordOpen || passwordRecovery} onClose={() => { setChangePasswordOpen(false); setPasswordRecovery(false) }} />
      <ChangeHandleModal open={changeHandleOpen} currentHandle={profile?.handle} userId={user?.id}
        onClose={() => setChangeHandleOpen(false)}
        onSaved={(updated) => { setProfile(updated); setChangeHandleOpen(false) }} />
      <ProfileForm open={profileFormOpen} profile={profile}
        onSave={saveProfile} onClose={() => setProfileFormOpen(false)} />
      <PublicProfile
        profile={viewingProfile}
        currentUserId={user?.id}
        isFollowing={follows.some((f) => f.following_id === viewingProfile?.user_id)}
        onFollow={followUser}
        onUnfollow={unfollowUser}
        onClose={() => setViewingProfile(null)}
        onOpenProfile={setViewingProfile}
      />

      {tab !== 'feed' && (
        <button className="fab" onClick={handleAdd}>
          <span className="fab-icon">＋</span>
          <span className="fab-label">
            {tab === 'yarn' ? '毛糸追加' : tab === 'tools' ? '道具追加' : tab === 'books' ? '書籍追加' : '作品追加'}
          </span>
        </button>
      )}
      <Dock tab={tab} onChange={changeTab} />

      <footer className="app-footer">
        <div className="footer-links">
          <a href="https://x.com/YARNand__" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ textDecoration: 'none' }}>𝕏 公式アカウント</a>
        </div>
        <div className="footer-links">
          <button onClick={() => setTermsOpen(true)} className="footer-link">利用規約</button>
          <span className="footer-sep">|</span>
          <button onClick={() => setPrivacyOpen(true)} className="footer-link">プライバシーポリシー</button>
          <span className="footer-sep">|</span>
          <button onClick={() => setFaqOpen(true)} className="footer-link">FAQ</button>
          <span className="footer-sep">|</span>
          <button onClick={() => setContactOpen(true)} className="footer-link">お問い合わせ</button>
        </div>
        <div className="footer-links" style={{ marginTop: '6px' }}>
          <button onClick={handleSignOut} className="footer-link">新規登録</button>
          <span className="footer-sep">|</span>
          <button onClick={() => setWithdrawOpen(true)} className="footer-link">退会</button>
        </div>
        <div className="footer-divider" />
        <span className="footer-logo">YARN&amp;</span>
        <span className="footer-copy">© 2026 YARN&amp; All rights reserved.</span>
      </footer>
      {termsOpen && <TermsPage onClose={() => setTermsOpen(false)} />}
      {privacyOpen && <PrivacyPolicyPage onClose={() => setPrivacyOpen(false)} />}
      {faqOpen && <FaqPage onClose={() => setFaqOpen(false)} />}
      <WithdrawModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} onSignOut={handleSignOut} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
    </>
  )
}
