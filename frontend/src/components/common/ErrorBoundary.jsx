import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LIFE RPG Caught Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#EDF4FB] text-slate-900">
          <div className="max-w-md p-8 rounded-3xl bg-white/95 border border-sky-200 shadow-xl space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 text-xl font-bold">
              ⚠
            </div>
            <h2 className="font-orbitron font-bold text-xl text-[#0F172A]">
              Interface Reload Required
            </h2>
            <p className="text-xs font-rajdhani text-slate-500">
              {this.state.error?.message || 'An unexpected rendering state occurred.'}
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-orbitron font-bold text-xs uppercase shadow-md transition-all"
            >
              Restart Interface
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
