'use client';

import Link from 'next/link';
import { Crown, Building2, Users, Mouse, ChevronDown, Car, CalendarDays, Flower2 } from 'lucide-react';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className="container">
          <div className={`${styles.heroContent} animate-fade-up`}>
            <h1 className={styles.heroTitle}>ELEVATING<br />EVERY ENTRY</h1>
            <p className={styles.heroSubtitle}>
              Experience the pinnacle of luxury living with personalized, bespoke concierge services and an unprecedented level of care at your doorstep.
            </p>
            <div className={styles.heroButtonGroup}>
              <Link href="/services" className="btn-primary" style={{ padding: '1rem 2.5rem' }}>
                <span>Explore Services</span>
              </Link>
              <Link href="/contact" className="btn-outline" style={{ padding: '1rem 2.5rem' }}>
                Request a Booking
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.scrollIndicator}>
          <Mouse size={24} strokeWidth={1} />
          <ChevronDown size={16} />
        </div>
      </section>

      <section className={styles.amenitiesSection}>
        <div className="container">
          <div className={styles.amenitiesGrid}>
            <div className={styles.amenityCard}>
              <div className={styles.amenityIcon}><Car size={40} strokeWidth={1} /></div>
              <h3 className={styles.amenityTitle}>24/7 Valet & Parking</h3>
              <p className={styles.amenityDesc}>Seamless vehicle retrieval and secure parking management, ensuring every departure and arrival is completely effortless.</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityIcon}><CalendarDays size={40} strokeWidth={1} /></div>
              <h3 className={styles.amenityTitle}>Private Events & Bookings</h3>
              <p className={styles.amenityDesc}>Exclusive coordination for resident gatherings, private dining, and effortless reservations at the city's finest venues.</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityIcon}><Flower2 size={40} strokeWidth={1} /></div>
              <h3 className={styles.amenityTitle}>Wellness & Spa Access</h3>
              <p className={styles.amenityDesc}>Discreet scheduling and privileged access to on-site wellness facilities, maintaining an atmosphere of ultimate relaxation.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionDark}>
        <div className="container">
          <h2 className={`${styles.sectionTitle} animate-fade-up`}>Our Premium Services</h2>
          <div className={styles.servicesGrid}>
            <div className={`${styles.serviceCard} animate-fade-up`} style={{ animationDelay: '0.1s' }}>
              <div className={styles.serviceIcon}><Users size={40} strokeWidth={1.5} /></div>
              <h3 className={styles.serviceTitle}>Resident Relations</h3>
              <p className={styles.serviceDesc}>Personalized assistance, package management, and daily warm greetings that make every resident feel truly at home.</p>
            </div>
            <div className={`${styles.serviceCard} animate-fade-up`} style={{ animationDelay: '0.2s' }}>
              <div className={styles.serviceIcon}><Building2 size={40} strokeWidth={1.5} /></div>
              <h3 className={styles.serviceTitle}>Visitor Management</h3>
              <p className={styles.serviceDesc}>Digital visitor logs, vendor coordination, and seamless access control ensuring safety without compromising hospitality.</p>
            </div>
            <div className={`${styles.serviceCard} animate-fade-up`} style={{ animationDelay: '0.3s' }}>
              <div className={styles.serviceIcon}><Crown size={40} strokeWidth={1.5} /></div>
              <h3 className={styles.serviceTitle}>Brand Representation</h3>
              <p className={styles.serviceDesc}>Immaculate uniforms, polished communication, and concierge staff acting as the true ambassadors of your building's prestige.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={`${styles.ctaBox} animate-fade-up`}>
            <h2 className={styles.ctaTitle}>Ready to Elevate Your Property?</h2>
            <Link href="/contact" className="btn-primary">
              <span>Request a Consultation</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
