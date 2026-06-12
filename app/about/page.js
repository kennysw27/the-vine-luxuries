'use client';

import styles from './about.module.css';

export default function AboutPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>About Us</h1>
          <div className={styles.heroDivider}></div>
          <p className={styles.heroSubtitle}>
            Setting the absolute standard for luxury residential hospitality.
          </p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={`container ${styles.contentContainer}`}>
          <h2 className={styles.sectionTitle}>Our Philosophy</h2>
          <p className={styles.paragraph}>
            At The Vine Luxuries, we believe the front desk is the heartbeat of your property. It’s the first impression, the daily touchpoint, and the lasting memory for every resident and guest.
          </p>
          <p className={styles.paragraph}>
            We don't just staff your lobby; we elevate it with professionals who embody grace, anticipation, and an unwavering commitment to service. Our concierges are trained in 5-star hospitality standards, ensuring your residents receive the white-glove treatment they deserve.
          </p>
          
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <h3 className={styles.valueTitle}>Excellence</h3>
              <p className={styles.valueDesc}>In every interaction, every single day. We settle for nothing less than perfection.</p>
            </div>
            <div className={styles.valueCard}>
              <h3 className={styles.valueTitle}>Discretion</h3>
              <p className={styles.valueDesc}>Secure, reliable, and profoundly respectful of our residents' privacy.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
