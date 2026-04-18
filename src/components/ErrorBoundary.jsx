import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div style={{ minHeight: '100vh', background: '#F2E8EC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🪢</div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#3A2D32', marginBottom: '8px' }}>エラーが発生しました</div>
        <div style={{ fontSize: '13px', color: '#7A6369', marginBottom: '20px', textAlign: 'center', lineHeight: 1.6 }}>
          アプリの読み込み中に問題が発生しました。<br />再読み込みをお試しください。
        </div>
        {this.state.error?.message && (
          <pre style={{ fontSize: '11px', background: '#fff', border: '1px solid #DCCDD4', borderRadius: '8px', padding: '12px 16px', maxWidth: '480px', width: '100%', overflow: 'auto', color: '#9B3A3A', marginBottom: '20px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {this.state.error.message}
          </pre>
        )}
        <button
          onClick={() => window.location.reload()}
          style={{ fontFamily: 'inherit', fontSize: '14px', padding: '10px 28px', borderRadius: '99px', border: 'none', background: '#8C6272', color: '#fff', cursor: 'pointer' }}
        >
          再読み込み
        </button>
      </div>
    )
  }
}
