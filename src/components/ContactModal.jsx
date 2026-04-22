import { useState } from 'react'
import Modal from './Modal'

const FORMSPREE_URL = 'https://formspree.io/f/xlgapzbb'

export default function ContactModal({ open, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSend() {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('すべての項目を入力してください')
      return
    }
    setSending(true)
    setError('')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, _replyto: email, message }),
      })
      if (!res.ok) throw new Error()
      setDone(true)
    } catch {
      setError('送信に失敗しました。時間をおいて再度お試しください。')
    } finally {
      setSending(false)
    }
  }

  function handleClose() {
    setName(''); setEmail(''); setMessage(''); setError(''); setDone(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="modal-title">お問い合わせ</div>
      {done ? (
        <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>✓</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '20px' }}>
            お問い合わせを送信しました。<br />返信をお待ちください。
          </div>
          <button className="btn primary" onClick={handleClose} style={{ width: '100%' }}>閉じる</button>
        </div>
      ) : (
        <>
          <div className="field">
            <label>お名前</label>
            <input type="text" value={name} placeholder="例：山田 花子" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>返信先メールアドレス</label>
            <input type="email" value={email} placeholder="example@email.com" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>お問い合わせ内容</label>
            <textarea value={message} placeholder="ご質問・ご要望をご記入ください" rows={5} onChange={(e) => setMessage(e.target.value)} />
          </div>
          {error && (
            <div style={{ background: 'var(--danger-light)', border: '1px solid #E8C4C4', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: 'var(--danger)', marginBottom: '14px' }}>{error}</div>
          )}
          <div className="modal-actions">
            <button className="btn" onClick={handleClose}>キャンセル</button>
            <button className="btn primary" disabled={sending} onClick={handleSend}>{sending ? '送信中…' : '送信する'}</button>
          </div>
        </>
      )}
    </Modal>
  )
}
