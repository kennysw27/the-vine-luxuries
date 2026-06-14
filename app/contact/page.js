'use client';

import styles from './contact.module.css';

export default function ContactPage() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await fetch("https://formsubmit.co/ajax/Inquiries@thevineluxuries.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
      });
      alert("Thank you for your inquiry. Our team will contact you shortly.");
      e.target.reset();
    } catch(error) {
      console.error(error);
      alert("There was an error sending your message. Please try again.");
    }
  };

  return (
    <main className={styles.pageWrapper}>
      <div className="container">
        <div className={styles.grid}>
          
          <div>
            <h1 className={styles.title}>Request a<br />Consultation</h1>
            <p className={styles.subtitle}>
              Elevate your property’s experience. Contact us today to discuss tailored concierge solutions for your luxury residence.
            </p>

            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <h4>Email</h4>
                <p>inquiries@thevineluxuries.com</p>
              </div>
              <div className={styles.contactItem}>
                <h4>Phone</h4>
                <p>(972) 863-1618</p>
              </div>
            </div>
          </div>

          <div className={styles.formBox}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                
                <div className={`form-group ${styles.fullWidth}`}>
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-input" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" name="email" className="form-input" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" name="phone" className="form-input" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Property Name</label>
                  <input type="text" name="propertyName" className="form-input" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Property Type</label>
                  <select name="propertyType" className="form-select" required defaultValue="">
                    <option value="" disabled>Select Property Type</option>
                    <option value="Luxury Apartment Complex">Luxury Apartment Complex</option>
                    <option value="High-Rise Condo">High-Rise Condo</option>
                    <option value="Gated Community">Gated Community</option>
                    <option value="HOA">HOA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className={`form-group ${styles.fullWidth}`}>
                  <label className="form-label">Message</label>
                  <textarea name="message" className="form-textarea" placeholder="Tell us about your property's needs..." required></textarea>
                </div>

              </div>
              <div style={{ marginTop: '2rem' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Send Message</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
