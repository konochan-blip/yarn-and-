import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Modal from './Modal'

export default function ChangePasswordModal({ open, onClose }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSave() {
    if (password.length < 6) { setError('パスワードは6文字以上にしてください'); return }
    if (password !== confirm) { setError('パスワードが一致しません'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setDone(true)
  }

  function handleClose() {
    setPassword(''); setConfirm(''); setError(''); setDone(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="modal-title">パスワード変更</div>
      {done ? (
        <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>✓</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>パスワードを変更しました</div>
          <button className="btn primary" onClick={handleClose} style={{ width: '100%' }}>閉じる</button>
        </div>
      ) : (
        <>
          <div className="field">
            <label>新しいパスワード（6文字以上）</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
          </div>
          <div className="field">
            <label>確認用（もう一度）</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
          </div>
          {error && (
            <div style={{ background: 'var(--danger-light)', border: '1px solid #E8C4C4', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: 'var(--danger)', marginBottom: '14px' }}>
              {error}
            </div>
          )}
          <div className="modal-actions">
            <button className="btn" onClick={handleClose}>キャンセル</button>
            <button className="btn primary" disabled={loading} onClick={handleSave}>{loading ? '変更中…' : '変更する'}</button>
          </div>
        </>
      )}
    </Modal>
  )
}
