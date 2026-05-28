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
      return (
        <div className="fixed inset-0 bg-slate-900 text-red-400 p-8 font-mono overflow-auto z-[9999] selection:bg-red-500 selection:text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-black mb-4 text-white uppercase tracking-tighter">FATAL BOOT EXCEPTION</h1>
            <div className="bg-black/50 border-2 border-red-500/50 p-6 rounded-2xl shadow-2xl mb-8">
              <p className="text-xl font-bold mb-4">Error: {this.state.error?.toString()}</p>
              <div className="h-px bg-red-500/20 mb-4" />
              <p className="text-xs text-slate-400 mb-2 uppercase tracking-widest">Component Stack Trace:</p>
              <pre className="text-[10px] leading-tight whitespace-pre-wrap text-red-300/80 italic">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
            <button
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="px-6 py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-500 transition-all active:scale-95"
            >
              WIPE STORAGE & REBOOT
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
    <RootErrorBoundary>
      <BagChaserV2 />
    </RootErrorBoundary>
  </React.StrictMode>,
)
