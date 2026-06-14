'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Pages with dark hero sections where text needs to be white initially
  const isDarkBg = pathname === '/' || pathname === '/about' || pathname === '/services';
  
  const textColor = (isDarkBg && !scrolled) ? 'var(--color-white)' : 'var(--color-navy-950)';
  const linkColor = (isDarkBg && !scrolled) ? 'var(--color-white)' : 'var(--color-navy-900)';
  
  const navBackground = scrolled ? 'var(--color-cream)' : (isDarkBg ? 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)' : 'transparent');
  const paddingY = scrolled ? '1rem 0' : '1.5rem 0';
  const shadow = scrolled ? '0 10px 30px rgba(0,0,0,0.05)' : 'none';

  return (
    <nav className={styles.navbar} style={{ 
      padding: paddingY,
      background: navBackground,
      boxShadow: shadow,
    }}>
      <div className={`container ${styles.container}`}>
        <Link href="/" className={styles.logo} style={{ color: textColor }}>
          THE VINE<br/>
          <span className={`${styles.logoSubtitle} text-gold`}>
            LUXURIES
          </span>
        </Link>
        
        <button 
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <span className={styles.hamburgerLine} style={{ background: textColor }}></span>
          <span className={styles.hamburgerLine} style={{ background: textColor }}></span>
          <span className={styles.hamburgerLine} style={{ background: textColor }}></span>
        </button>

        <div className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          <Link href="/" className={styles.navLink} style={{ color: linkColor }}>Home</Link>
          <Link href="/about" className={styles.navLink} style={{ color: linkColor }}>About</Link>
          <Link href="/services" className={styles.navLink} style={{ color: linkColor }}>Services</Link>
          <Link href="/contact" className={`${styles.navLink} ${styles.contactBtn}`}>Contact</Link>
        </div>
      </div>
    </nav>
  );
}
