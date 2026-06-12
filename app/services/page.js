'use client';

import styles from './services.module.css';

export default function ServicesPage() {
  const services = [
    { title: "Resident Relations", image: "/services-bg-1.png", desc: "Building meaningful relationships with residents, providing daily warm greetings, and anticipating their exact needs." },
    { title: "Guest Management", image: "/services-bg-2.png", desc: "Seamless and secure entry for guests with our digital visitor log, ensuring safety and an immensely welcoming experience." },
    { title: "Brand Ambassadors", image: "/services-bg-3.png", desc: "Our concierges wear immaculate uniforms and maintain a polished presence, acting as ambassadors for your property's prestige." },
    { title: "Vendor Coordination", image: "/services-bg-4.png", desc: "Efficient, discreet handling of packages, dry cleaning, and vendor access to ensure residents receive their items promptly without disruption." },
    { title: "Event Logistics", image: "/services-bg-5.png", desc: "Assisting property management with private resident events, elegant elevator bookings, and seamless move-in logistics." },
    { title: "Access Control", image: "/services-bg-6.png", desc: "Maintaining strict security protocols while providing a completely frictionless, 5-star hospitality experience." },
  ];

  return (
    <main>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>Our Services</h1>
          <div className={styles.heroDivider}></div>
          <p className={styles.heroSubtitle}>
            Comprehensive concierge solutions for the world's most luxurious residences.
          </p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container" style={{ maxWidth: '1400px', padding: 0 }}>
          <div className={styles.servicesGrid}>
            {services.map((s, i) => (
              <div key={i} className={styles.serviceCard} style={{ backgroundImage: `url('${s.image}')` }}>
                <div className={styles.serviceContent}>
                  <h3 className={styles.serviceTitle}>{s.title}</h3>
                  <p className={styles.serviceDesc}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
