// components/Common/ImageWithFallback.jsx
import { useState } from 'react';

export default function ImageWithFallback({ 
  src, 
  alt, 
  className = '', 
  fallbackIcon = true,
  fallbackText = 'Image non disponible'
}) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!src || error) {
    return (
      <div className={`${className} bg-gray-100 flex flex-col items-center justify-center`}>
        {fallbackIcon && (
          <svg className="w-12 h-12 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        <span className="text-xs text-gray-400">{fallbackText}</span>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className={`${className} bg-gray-100 animate-pulse flex items-center justify-center`}>
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className={`${className} ${loading ? 'hidden' : 'block'}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </>
  );
}