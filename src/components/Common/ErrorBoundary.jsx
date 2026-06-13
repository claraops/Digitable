import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
          <div className="bg-white rounded-3xl shadow-lg p-8 max-w-xl text-center">
            <h1 className="text-xl font-bold mb-3">Une erreur est survenue</h1>
            <p className="text-gray-600 mb-6 text-sm">
              Veuillez recharger la page pour continuer.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black-deep text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
