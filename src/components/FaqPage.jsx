import { useState } from 'react'

const FAQS = [
  {
    q: '無料で使えますか？',
    a: 'はい、すべての機能を無料でご利用いただけます。',
  },
  {
    q: 'データは消えませんか？',
    a: 'クラウドに保存されるため、機種変更やブラウザを変えてもデータは残ります。',
  },
  {
    q: '非公開設定にすると何が変わりますか？',
    a: 'プロフィールや登録データが他のユーザーから見えなくなります。',
  },
  {
    q: 'アカウントを削除するとデータはどうなりますか？',
    a: '退会するとすべてのデータが削除されます。',
  },
  {
    q: '登録できる毛糸・作品の数に上限はありますか？',
    a: '現在上限は設けていません。',
  },
]

export default function FaqPage({ onClose }) {
  const [openIndex, setOpenIndex] = useState(null)

  function toggle(i) {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'var(--bg)', overflowY: 'auto' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ position: 'sticky', top: 0, background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '14px 0', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button onClick={onClose} className="btn" style={{ padding: '6px 14px', fontSize: '13px', flexShrink: 0 }}>← 戻る</button>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: '16px', color: 'var(--text-primary)' }}>よくある質問</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {FAQS.map((faq, i) => (
            <div key={i}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
              <button
                onClick={() => toggle(i)}
                style={{ width: '100%', background: 'none', border: 'none', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.6 }}>Q. {faq.q}</span>
                <span style={{ fontSize: '14px', color: 'var(--text-tertiary)', flexShrink: 0, transform: openIndex === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
              </button>
              {openIndex === i && (
                <div style={{ padding: '0 16px 14px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8, borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ paddingTop: '12px' }}>A. {faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
