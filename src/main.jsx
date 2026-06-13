import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Patch React 18 removeChild race condition (dev mode)
(function patchRemoveChild() {
  const orig = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    try {
      return orig.call(this, child);
    } catch (e) {
      if (e.name === 'NotFoundError') {
        return child;
      }
      throw e;
    }
  };
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
