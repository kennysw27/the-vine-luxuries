'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('vine_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vine_cookie_consent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'var(--color-navy-950)',
      color: 'white',
      padding: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
      animation: 'slideUp 0.5s ease-out forwards'
    }}>
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @media (min-width: 768px) {
          .banner-content {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
          }
          .banner-text {
            max-width: 70%;
          }
        }
      `}</style>
      
      <div className="container banner-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="banner-text">
          <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: '#eaeaea' }}>
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies and our <Link href="/privacy" style={{ color: 'var(--color-gold-500)', textDecoration: 'underline' }}>Privacy Policy</Link>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={handleAccept}
            className="btn-primary"
            style={{ padding: '0.6rem 2rem', whiteSpace: 'nowrap' }}
          >
            Accept
          </button>
          <button 
            onClick={() => setShowBanner(false)}
            style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '0.5rem' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
