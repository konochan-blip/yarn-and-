import { useState } from 'react'

const TUTORIAL_KEY = 'tutorial_done_v1'

const S = '#8C6272'
const SM = 'rgba(140,98,114,0.5)'
const SL = 'rgba(140,98,114,0.25)'
const W = '#fff'
const WM = 'rgba(255,255,255,0.7)'
const WL = 'rgba(255,255,255,0.15)'

function IconWelcome() {
  return (
    <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="9" stroke={SM} strokeWidth="1.5" fill={SL}/>
      <path d="M10 16 Q13 10 16 16 Q19 22 22 16" stroke={S} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M7 13 Q10 8 16 9" stroke={SM} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M25 19 Q22 24 16 23" stroke={SM} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="2.5" fill={S} opacity="0.5"/>
    </svg>
  )
}

function IconTab() {
  return (
    <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="22" width="24" height="6" rx="3" fill={SL} stroke={SM} strokeWidth="1.2"/>
      <circle cx="10" cy="25" r="2" fill={S}/>
      <circle cx="16" cy="25" r="2" fill={SM}/>
      <circle cx="22" cy="25" r="2" fill={SM}/>
      <rect x="7" y="6" width="18" height="13" rx="3" fill={SL} stroke={SM} strokeWidth="1.2"/>
      <path d="M11 12h10M11 9h6" stroke={S} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

function IconAdd() {
  return (
    <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="20" width="24" height="8" rx="4" fill={SL} stroke={SM} strokeWidth="1.2"/>
      <path d="M13 24h6M16 21v6" stroke={S} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="16" cy="13" r="7" fill={SL} stroke={SM} strokeWidth="1.2"/>
      <path d="M13 13h6M16 10v6" stroke={S} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconAI() {
  return (
    <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="9" stroke={WM} strokeWidth="1.5" fill={WL}/>
      <path d="M10 16 Q13 10 16 16 Q19 22 22 16" stroke={W} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M7 13 Q10 8 16 9" stroke={WM} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M25 19 Q22 24 16 23" stroke={WM} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="2.5" fill={W} opacity="0.6"/>
      <path d="M24 7l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill={W} opacity="0.9"/>
    </svg>
  )
}

function IconEdit() {
  return (
    <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
      <rect x="6" y="8" width="16" height="18" rx="3" fill={SL} stroke={SM} strokeWidth="1.2"/>
      <path d="M10 13h8M10 17h6M10 21h4" stroke={S} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M20 6l2 2-7 7-3 1 1-3z" fill={S} opacity="0.7"/>
    </svg>
  )
}

function IconDone() {
  return (
    <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="10" fill={SL} stroke={SM} strokeWidth="1.2"/>
      <path d="M10 16l4 4 8-8" stroke={S} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const STEPS = [
  { icon: <IconWelcome />, title: 'YARN& へようこそ！', desc: '毛糸・作品・道具・書籍をまとめて管理できるアプリです。\nまずは毛糸の登録方法を説明します。' },
  { icon: <IconTab />,     title: 'STEP 1｜毛糸タブを開く', desc: '画面下のタブバーから「毛糸」を選びます。\n毛糸の一覧ページが開きます。' },
  { icon: <IconAdd />,     title: 'STEP 2｜毛糸追加ボタンをタップ', desc: '画面右下の「＋ 毛糸追加」ボタンをタップすると、\n登録フォームが開きます。' },
  { icon: <IconAI />,      title: 'STEP 3｜写真でAI自動入力', desc: '毛糸のラベル写真を撮ると、AIが情報を自動で読み取ります。\n名前・色・素材・メーカーなどを自動入力！\nあとから手動で編集もできます。', accent: true },
  { icon: <IconEdit />,    title: 'STEP 4｜内容を確認して保存', desc: 'AI入力の内容を確認・修正して「保存」をタップ。\n在庫数やお店の情報も追加できます。' },
  { icon: <IconDone />,    title: '準備完了！', desc: '登録した毛糸は一覧でいつでも確認できます。\n作品や道具も同じように登録できますよ。' },
]

export function shouldShowTutorial() {
  return !localStorage.getItem(TUTORIAL_KEY)
}

export function markTutorialDone() {
  localStorage.setItem(TUTORIAL_KEY, '1')
}

export default function TutorialModal({ onClose }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  function handleClose() {
    markTutorialDone()
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(60,30,40,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'var(--bg)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '340px',
        padding: '28px 24px 24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        position: 'relative',
      }}>
        <button onClick={handleClose} style={{
          position: 'absolute', top: '14px', right: '16px',
          background: 'none', border: 'none', fontSize: '12px',
          color: 'var(--text-tertiary)', cursor: 'pointer', fontFamily: 'inherit',
        }}>スキップ</button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '24px' }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? '20px' : '6px',
              height: '6px',
              borderRadius: '99px',
              background: i === step ? 'var(--accent)' : 'var(--border)',
              transition: 'all 0.25s',
            }} />
          ))}
        </div>

        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          background: current.accent ? 'var(--accent)' : 'var(--accent-light)',
          border: '1.5px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 18px',
        }}>
          {current.icon}
        </div>

        <div style={{
          fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)',
          textAlign: 'center', marginBottom: '10px',
          fontFamily: 'var(--font-serif)',
        }}>{current.title}</div>

        <div style={{
          fontSize: '13px', color: 'var(--text-secondary)',
          textAlign: 'center', lineHeight: 1.85,
          marginBottom: '28px',
          whiteSpace: 'pre-line',
        }}>{current.desc}</div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              flex: 1, padding: '11px', borderRadius: '99px',
              border: '1.5px solid var(--border)', background: 'none',
              fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>戻る</button>
          )}
          <button onClick={isLast ? handleClose : () => setStep(s => s + 1)} style={{
            flex: 2, padding: '11px', borderRadius: '99px',
            border: 'none', background: 'var(--accent)',
            fontSize: '14px', fontWeight: 700, color: '#fff',
            cursor: 'pointer', fontFamily: 'inherit',
          }}>{isLast ? '始める ✦' : '次へ'}</button>
        </div>
      </div>
    </div>
  )
}
