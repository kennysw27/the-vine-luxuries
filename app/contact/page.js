import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './contact.module.css';

export default function ContactPage() {
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {

    // Generate Branded PDF for the Inquiry
    const doc = new jsPDF();
    
    // Add Branding Header
    doc.setTextColor(212, 175, 55); // Gold color
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("THE VINE LUXURIES", 105, 20, { align: "center" });
    
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Where Excellence Meets Hospitality", 105, 27, { align: "center" });
    
    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("NEW INQUIRY / CONSULTATION REQUEST", 105, 40, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Submitted Date: ${new Date().toLocaleString()}`, 20, 52);

      // Document Body
      autoTable(doc, {
        startY: 60,
        head: [['Field', 'Details']],
      body: [
        ['Full Name', data.name],
        ['Email Address', data.email],
        ['Phone Number', data.phone],
        ['Property Name', data.propertyName],
        ['Property Type', data.propertyType],
        ['Message', data.message],
      ],
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: { 
        0: { fontStyle: 'bold', cellWidth: 50, fillColor: [250, 249, 245] },
        1: { cellWidth: 'auto' }
      }
    });

    const pdfBlob = doc.output('blob');
    const pdfFile = new File([pdfBlob], `The-Vine-Luxuries-Inquiry-${data.name.replace(/\s+/g, '-')}.pdf`, { type: 'application/pdf' });

      // Send via FormSubmit using FormData (multipart/form-data)
      const emailData = new FormData();
      emailData.append('_subject', `New Inquiry/Consultation - The Vine Luxuries LLC - ${data.name}`);
      emailData.append('Message', `A new inquiry has been submitted through The Vine Luxuries LLC website.\n\nThe complete inquiry details are attached as a PDF.`);
      emailData.append('Sender_Name', data.name);
      emailData.append('Property_Name', data.propertyName);
      emailData.append('Inquiry_PDF', pdfFile);

      const emailRes = await fetch("https://formsubmit.co/ajax/inquiries@thevineluxuries.com", {
        method: "POST",
        body: emailData,
      });

      if (!emailRes.ok) throw new Error('Email submission failed');

      alert("Thank you for your inquiry. Our team will contact you shortly.");
      e.target.reset();
    } catch(error) {
      console.error(error);
      setSubmitError("There was an error generating or sending your message. Please try again.");
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
                  <label className="form-label">Full Name <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" name="name" className="form-input" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address <span style={{ color: 'red' }}>*</span></label>
                  <input type="email" name="email" className="form-input" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number <span style={{ color: 'red' }}>*</span></label>
                  <input type="tel" name="phone" className="form-input" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Property Name <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" name="propertyName" className="form-input" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Property Type <span style={{ color: 'red' }}>*</span></label>
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
                  <label className="form-label">Message <span style={{ color: 'red' }}>*</span></label>
                  <textarea name="message" className="form-textarea" placeholder="Tell us about your property's needs..." required></textarea>
                </div>

              </div>
              
              {submitError && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#ffebee', color: '#c62828', borderRadius: '4px', textAlign: 'center' }}>
                  {submitError}
                </div>
              )}
              
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
