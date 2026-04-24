import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Modal from './Modal'

export default function ChangeHandleModal({ open, currentHandle, userId, onClose, onSaved }) {
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (open) { setHandle(currentHandle || ''); setError(''); setDone(false) }
  }, [open, currentHandle])

  async function handleSave() {
    const val = handle.trim()
    if (!val) { setError('IDを入力してください'); return }
    if (!/^[a-zA-Z0-9_.-]+$/.test(val)) { setError('英数字・アンダースコア・ハイフン・ドットのみ使えます'); return }
    setLoading(true); setError('')
    const { data, error: err } = await supabase
      .from('profiles')
      .update({ handle: val })
      .eq('user_id', userId)
      .select()
      .single()
    setLoading(false)
    if (err) {
      if (err.message?.includes('profiles_handle_unique') || (err.message?.includes('duplicate key') && err.message?.includes('handle')))
        setError('このIDはすでに使われています')
      else
        setError(err.message || 'IDの変更に失敗しました')
      return
    }
    if (data) onSaved(data)
    setDone(true)
  }

  function handleClose() {
    setHandle(''); setError(''); setDone(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="modal-title">IDを変更</div>
      {done ? (
        <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>✓</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>IDを変更しました</div>
          <button className="btn primary" onClick={handleClose} style={{ width: '100%' }}>閉じる</button>
        </div>
      ) : (
        <>
          <div className="field">
            <label>新しいID</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: 'var(--text-tertiary)', pointerEvents: 'none' }}>@</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/\s/g, ''))}
                placeholder="例：yarn_lover"
                style={{ paddingLeft: '26px' }}
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>英数字・_・-・. が使えます。プロフィールURLに使われます。</div>
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
