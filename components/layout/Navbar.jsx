'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Pages with dark hero sections where text needs to be white initially
  const isDarkBg = pathname === '/' || pathname === '/about' || pathname === '/services';
  
  const textColor = (isDarkBg && !scrolled) ? 'var(--color-white)' : 'var(--color-navy-950)';
  const linkColor = (isDarkBg && !scrolled) ? 'var(--color-white)' : 'var(--color-navy-900)';
  
  const navBackground = scrolled ? 'var(--color-cream)' : (isDarkBg ? 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)' : 'transparent');
  const paddingY = scrolled ? '1rem 0' : '2rem 0';
  const shadow = scrolled ? '0 10px 30px rgba(0,0,0,0.05)' : 'none';

  return (
    <nav style={{ 
      position: 'fixed', 
      top: 0, 
      width: '100%', 
      zIndex: 100, 
      padding: paddingY,
      background: navBackground,
      boxShadow: shadow,
      transition: 'all 0.4s ease'
    }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 500, color: textColor, textDecoration: 'none', textAlign: 'center', letterSpacing: '0.1em' }}>
          THE VINE<br/>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.4em', fontWeight: 400, display: 'block', marginTop: '0.4rem' }} className="text-gold">
            LUXURIES
          </span>
        </Link>
        
        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Link href="/" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: linkColor }}>Home</Link>
          <Link href="/about" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: linkColor }}>About</Link>
          <Link href="/services" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: linkColor }}>Services</Link>
          <Link href="/digital-log" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: linkColor }}>Visitor Log</Link>
          <Link href="/log-history" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: linkColor }}>Admin</Link>
          <Link href="/contact" style={{ 
            fontSize: '0.85rem', 
            fontWeight: 600,
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            color: 'var(--color-gold-500)',
            border: '1px solid var(--color-gold-500)',
            padding: '0.6rem 1.2rem',
            transition: 'all 0.3s ease',
            marginLeft: '1rem'
          }}>Contact</Link>
        </div>
      </div>
    </nav>
  );
}
