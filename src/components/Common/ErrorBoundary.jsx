import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
          <div className="bg-white rounded-3xl shadow-lg p-8 max-w-xl text-center">
            <h1 className="text-2xl font-bold mb-4">Une erreur est survenue</h1>
            <p className="text-gray-700 mb-4">
              L'application a rencontré un problème. Rechargez la page ou vérifiez la console.
            </p>
            <details className="text-left text-sm text-gray-500 whitespace-pre-wrap">
              {this.state.error?.toString()}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
