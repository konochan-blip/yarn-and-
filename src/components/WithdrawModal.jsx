import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Modal from './Modal'

export default function WithdrawModal({ open, onClose, onSignOut }) {
  const [step, setStep] = useState(1) // 1: confirm, 2: processing, 3: done
  const [error, setError] = useState('')

  async function handleWithdraw() {
    setStep(2)
    setError('')
    try {
      const { error } = await supabase.rpc('delete_account')
      if (error) throw error
      setStep(3)
      setTimeout(() => onSignOut(), 1500)
    } catch (e) {
      setError(e.message || '退会処理に失敗しました')
      setStep(1)
    }
  }

  function handleClose() {
    setStep(1)
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={step === 1 ? handleClose : undefined}>
      <div className="modal-title">退会する</div>

      {step === 1 && (
        <>
          <div style={{ background: 'var(--danger-light)', border: '1px solid #E8C4C4', borderRadius: '10px', padding: '14px', fontSize: '13px', color: 'var(--danger)', lineHeight: 1.8, marginBottom: '16px' }}>
            <strong>退会すると以下のデータがすべて削除されます：</strong>
            <ul style={{ paddingLeft: '16px', marginTop: '6px' }}>
              <li>登録した毛糸・道具・書籍・作品</li>
              <li>プロフィール情報</li>
              <li>フォロー・フォロワー情報</li>
              <li>アカウント情報</li>
            </ul>
            <div style={{ marginTop: '8px', fontWeight: 500 }}>この操作は取り消せません。</div>
          </div>
          {error && (
            <div style={{ background: 'var(--danger-light)', border: '1px solid #E8C4C4', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: 'var(--danger)', marginBottom: '14px' }}>{error}</div>
          )}
          <div className="modal-actions">
            <button className="btn" onClick={handleClose}>キャンセル</button>
            <button className="btn" onClick={handleWithdraw} style={{ background: 'var(--danger)', color: '#fff', borderColor: 'var(--danger)' }}>退会する</button>
          </div>
        </>
      )}

      {step === 2 && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>処理中…</div>
        </div>
      )}

      {step === 3 && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>✓</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>退会が完了しました</div>
        </div>
      )}
    </Modal>
  )
}
