'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-navy-950)', color: 'var(--color-white)', padding: '4rem 0', textAlign: 'center' }}>
      <div className="container">
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1rem' }}>The Vine Luxuries</h2>
        <p style={{ color: 'var(--color-gold-500)', letterSpacing: '0.1em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '2rem' }}>
          Elevating Every Entry
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: 'var(--color-white)', fontSize: '0.9rem' }}>Home</Link>
          <Link href="/about" style={{ color: 'var(--color-white)', fontSize: '0.9rem' }}>About</Link>
          <Link href="/services" style={{ color: 'var(--color-white)', fontSize: '0.9rem' }}>Services</Link>
          <Link href="/contact" style={{ color: 'var(--color-white)', fontSize: '0.9rem' }}>Contact</Link>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#888' }}>
          &copy; {new Date().getFullYear()} The Vine Luxuries. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
