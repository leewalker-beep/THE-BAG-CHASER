import React from 'react'
import ReactDOM from 'react-dom/client'
import BagChaserV2 from './BagChaserV2.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const error = this.state.error;
      const stack = error?.stack || "";

      // Attempt to extract location info from stack trace
      const lines = stack.split('\n');
      const locationLine = lines.find(l => l.includes('.jsx') || l.includes('.js')) || "";

      return (
        <div style={{
          backgroundColor: '#000',
          color: '#ff0000',
          padding: '2rem',
          fontFamily: 'monospace',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h1 style={{ borderBottom: '2px solid #ff0000', paddingBottom: '0.5rem' }}>RUNTIME EXCEPTION DETECTED</h1>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            MESSAGE: {error?.message}
          </div>
          {locationLine && (
            <div style={{ color: '#ffffff' }}>
              LOCATION: {locationLine.trim()}
            </div>
          )}
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', color: '#888' }}>Full Stack Trace</summary>
            <pre style={{
              backgroundColor: '#111',
              padding: '1rem',
              overflow: 'auto',
              fontSize: '0.8rem',
              color: '#aaa',
              border: '1px solid #333'
            }}>
              {stack}
            </pre>
          </details>
          <div style={{ marginTop: '2rem' }}>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#ff0000',
                color: '#fff',
                border: 'none',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}
            >
              Wipe Storage & Reboot
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BagChaserV2 />
    </ErrorBoundary>
  </React.StrictMode>,
)
