import React from 'react'
import ReactDOM from 'react-dom/client'
import BagChaserV2 from './BagChaserV2.jsx'

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true, error, errorInfo });
    console.error("CRITICAL UI CRASH:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const stack = this.state.error?.stack || "";
      // Basic regex to try and find the first file:line:column pattern
      const match = stack.match(/\((.*?):(\d+):(\d+)\)/) || stack.match(/at (.*?):(\d+):(\d+)/);
      const fileName = match ? match[1] : "Unknown File";
      const lineNumber = match ? match[2] : "Unknown Line";

      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#0f172a',
          color: '#f87171',
          padding: '32px',
          fontFamily: 'monospace',
          zIndex: 99999,
          overflow: 'auto',
          boxSizing: 'border-box'
        }}>
          <h1 style={{ color: '#ffffff', margin: '0 0 16px 0', textTransform: 'uppercase' }}>Fatal Runtime Exception</h1>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            border: '2px solid rgba(248,113,113,0.5)',
            padding: '24px',
            borderRadius: '16px',
            marginBottom: '32px'
          }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
              Error: {this.state.error?.message || this.state.error?.toString()}
            </p>
            <p style={{ fontSize: '14px', margin: '0 0 8px 0' }}>
              <b>File:</b> {fileName}
            </p>
            <p style={{ fontSize: '14px', margin: '0 0 16px 0' }}>
              <b>Line:</b> {lineNumber}
            </p>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(248,113,113,0.2)', marginBottom: '16px' }} />
            <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              Component Stack:
            </p>
            <pre style={{
              fontSize: '10px',
              lineHeight: '1.4',
              whiteSpace: 'pre-wrap',
              color: 'rgba(252,165,165,0.8)',
              fontStyle: 'italic',
              margin: 0
            }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </div>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '900',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            WIPE STORAGE & REBOOT
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <BagChaserV2 />
    </RootErrorBoundary>
  </React.StrictMode>,
)
