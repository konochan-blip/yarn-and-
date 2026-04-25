import { useState } from 'react'

const TUTORIAL_KEY = 'tutorial_done_v1'

const STEPS = [
  {
    emoji: '🧶',
    title: 'YARN& へようこそ！',
    desc: '毛糸・作品・道具・書籍をまとめて管理できるアプリです。\nまずは毛糸の登録方法を説明します。',
  },
  {
    emoji: '📋',
    title: 'STEP 1｜毛糸タブを開く',
    desc: '画面下のタブバーから「毛糸」を選びます。\n毛糸の一覧ページが開きます。',
    img: 'tab_yarn',
  },
  {
    emoji: '＋',
    title: 'STEP 2｜毛糸追加ボタンをタップ',
    desc: '画面右下の「＋ 毛糸追加」ボタンをタップすると、\n登録フォームが開きます。',
  },
  {
    emoji: '✏️',
    title: 'STEP 3｜情報を入力する',
    desc: '毛糸の名前・色名・在庫数などを入力します。\n写真も追加できます。入力したら「保存」で完了！',
  },
  {
    emoji: '✅',
    title: '準備完了！',
    desc: '登録した毛糸は一覧でいつでも確認できます。\n作品や道具も同じように登録できますよ。',
  },
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
        {/* スキップ */}
        <button onClick={handleClose} style={{
          position: 'absolute', top: '14px', right: '16px',
          background: 'none', border: 'none', fontSize: '12px',
          color: 'var(--text-tertiary)', cursor: 'pointer', fontFamily: 'inherit',
        }}>スキップ</button>

        {/* ステップドット */}
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

        {/* アイコン */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          background: 'var(--accent-light)', border: '1.5px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: step === 0 ? '36px' : step === 2 ? '28px' : '32px',
          margin: '0 auto 18px',
          fontWeight: step === 2 ? '700' : 'normal',
          color: step === 2 ? 'var(--accent)' : undefined,
          fontFamily: step === 2 ? 'inherit' : undefined,
        }}>{current.emoji}</div>

        {/* タイトル */}
        <div style={{
          fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)',
          textAlign: 'center', marginBottom: '10px',
          fontFamily: 'var(--font-serif)',
        }}>{current.title}</div>

        {/* 説明 */}
        <div style={{
          fontSize: '13px', color: 'var(--text-secondary)',
          textAlign: 'center', lineHeight: 1.85,
          marginBottom: '28px',
          whiteSpace: 'pre-line',
        }}>{current.desc}</div>

        {/* ボタン */}
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
