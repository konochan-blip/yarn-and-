import { useState } from 'react'
import { supabase } from '../lib/supabase'

const ERROR_MAP = {
  'Invalid login credentials':            'メールアドレスまたはパスワードが違います',
  'Email not confirmed':                  'メールアドレスの確認が完了していません',
  'User already registered':              'このメールアドレスはすでに登録されています',
  'Password should be at least 6 characters': 'パスワードは6文字以上にしてください',
  'Unable to validate email address':     '有効なメールアドレスを入力してください',
  'Signup is disabled':                   '新規登録は現在無効になっています',
}

function translateError(msg) {
  for (const [en, ja] of Object.entries(ERROR_MAP)) {
    if (msg.includes(en)) return ja
  }
  return msg
}

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signedUp, setSignedUp] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSignedUp(true)
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'https://yarn-and.vercel.app/',
        })
        if (error) throw error
        setResetSent(true)
      }
    } catch (err) {
      setError(translateError(err.message))
    } finally {
      setLoading(false)
    }
  }

  function switchMode(next) {
    setMode(next)
    setError('')
    setSignedUp(false)
    setResetSent(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      {/* ロゴ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="9" stroke="#C4A0AE" strokeWidth="1.5" fill="#F0E4EA"/>
          <path d="M10 16 Q13 10 16 16 Q19 22 22 16" stroke="#8C6272" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M7 13 Q10 8 16 9" stroke="#C4A0AE" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <path d="M25 19 Q22 24 16 23" stroke="#C4A0AE" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <circle cx="16" cy="16" r="2.5" fill="#8C6272" opacity="0.5"/>
        </svg>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '28px', color: 'var(--accent)', letterSpacing: '0.03em' }}>
          YARN&amp;
        </span>
      </div>

      {/* カード */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        padding: '28px 24px',
        width: '100%',
        maxWidth: '360px',
      }}>
        {/* タブ */}
        <div style={{ display: 'flex', marginBottom: '24px', borderBottom: '1px solid var(--border-light)' }}>
          {[['login', 'ログイン'], ['signup', '新規登録']].map(([key, label]) => (
            <button key={key} onClick={() => switchMode(key)} style={{
              flex: 1, padding: '8px', border: 'none', background: 'none', fontFamily: 'inherit', fontSize: '14px',
              fontWeight: mode === key ? '500' : '400',
              color: mode === key ? 'var(--accent)' : 'var(--text-tertiary)',
              borderBottom: `2px solid ${mode === key ? 'var(--accent)' : 'transparent'}`,
              cursor: 'pointer', transition: 'all 0.15s', marginBottom: '-1px',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* パスワードリセット画面 */}
        {mode === 'forgot' ? (
          resetSent ? (
            <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: '10px', padding: '16px', fontSize: '13px', color: 'var(--accent)', lineHeight: '1.7', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>✉️</div>
              <strong>{email}</strong> にリセット用メールを送りました。<br />
              メール内のリンクからパスワードを変更してください。
              <button onClick={() => switchMode('login')} style={{ display: 'block', margin: '16px auto 0', padding: '8px 20px', borderRadius: '99px', border: '1px solid var(--accent)', background: 'var(--accent)', color: '#FDF5F7', fontFamily: 'inherit', fontSize: '13px', cursor: 'pointer' }}>
                ログインへ
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.7 }}>
                登録済みのメールアドレスを入力してください。パスワードリセット用のリンクを送ります。
              </p>
              <div className="field">
                <label>メールアドレス</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" required autoComplete="email" />
              </div>
              {error && <div style={{ background: 'var(--danger-light)', border: '1px solid #E8C4C4', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: 'var(--danger)', marginBottom: '14px' }}>{error}</div>}
              <button type="submit" className="btn primary" disabled={loading} style={{ width: '100%', marginBottom: '12px' }}>
                {loading ? '送信中…' : 'リセットメールを送る'}
              </button>
              <button type="button" onClick={() => switchMode('login')} style={{ width: '100%', background: 'none', border: 'none', fontSize: '13px', color: 'var(--text-tertiary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                ← ログインに戻る
              </button>
            </form>
          )
        ) : signedUp ? (
          <div style={{
            background: 'var(--accent-light)',
            border: '1px solid var(--accent-mid)',
            borderRadius: '10px',
            padding: '16px',
            fontSize: '13px',
            color: 'var(--accent)',
            lineHeight: '1.7',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>✉️</div>
            <strong>{email}</strong> に確認メールを送りました。<br />
            メール内のリンクをクリックしてからログインしてください。
            <button onClick={() => switchMode('login')} style={{
              display: 'block',
              margin: '16px auto 0',
              padding: '8px 20px',
              borderRadius: '99px',
              border: '1px solid var(--accent)',
              background: 'var(--accent)',
              color: '#FDF5F7',
              fontFamily: 'inherit',
              fontSize: '13px',
              cursor: 'pointer',
            }}>
              ログインへ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="field">
              <label>パスワード{mode === 'signup' ? '（6文字以上）' : ''}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <div style={{
                background: 'var(--danger-light)',
                border: '1px solid #E8C4C4',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '13px',
                color: 'var(--danger)',
                marginBottom: '14px',
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn primary" disabled={loading} style={{ width: '100%', marginTop: '4px', marginBottom: mode === 'login' ? '10px' : '0' }}>
              {loading ? '処理中…' : mode === 'login' ? 'ログイン' : 'アカウントを作成'}
            </button>
            {mode === 'login' && (
              <button type="button" onClick={() => switchMode('forgot')} style={{ width: '100%', background: 'none', border: 'none', fontSize: '12px', color: 'var(--text-tertiary)', cursor: 'pointer', fontFamily: 'inherit', padding: '4px' }}>
                パスワードをお忘れですか？
              </button>
            )}
          </form>
        )}
      </div>

      <p style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: '1.8' }}>
        毛糸・道具・作品をサーバーで管理
      </p>
    </div>
  )
}
