

export const metadata = {
  title: "Privacy Policy | The Vine Luxuries",
  description: "Privacy policy and cookie compliance information for The Vine Luxuries.",
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-eyebrow">Legal</span>
            <h1 className="text-5xl lg:text-6xl font-heading mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Privacy Policy
            </h1>
            <div className="divider-gold mx-auto"></div>
            <p style={{ color: '#666', marginTop: '1rem' }}>Last Updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: 1.8, color: '#444' }}>
            
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--color-navy-950)', marginBottom: '1rem' }}>1. Introduction</h2>
              <p>Welcome to The Vine Luxuries ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.</p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--color-navy-950)', marginBottom: '1rem' }}>2. Information We Collect</h2>
              <p>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website, or otherwise when you contact us. This includes:</p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><strong>Contact Forms:</strong> Name, email address, phone number, and property details submitted through our Consultation and Contact forms.</li>
                <li><strong>Job Applications:</strong> Resumes, employment history, and contact information submitted through our Careers page.</li>
                <li><strong>Visitor Logs:</strong> If you visit a property managed by our concierge team, we securely collect your name, the unit you are visiting, and the time of your visit to ensure building security and seamless hospitality.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--color-navy-950)', marginBottom: '1rem' }}>3. How We Use Your Information</h2>
              <p>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>To respond to your inquiries and offer support.</li>
                <li>To fulfill and manage property management and concierge services.</li>
                <li>To evaluate candidates for employment opportunities.</li>
                <li>To maintain the security and operational safety of the properties we service.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--color-navy-950)', marginBottom: '1rem' }}>4. Cookies and Tracking Technologies</h2>
              <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Cookies are small data files stored on your device that help us improve our site and your experience, see which areas and features of our site are popular, and count visits.</p>
              <p style={{ marginTop: '1rem' }}>You can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Website.</p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--color-navy-950)', marginBottom: '1rem' }}>5. Data Security & Retention</h2>
              <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law.</p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--color-navy-950)', marginBottom: '1rem' }}>6. Contact Us</h2>
              <p>If you have questions or comments about this notice, you may email us at <strong>inquiries@thevineluxuries.com</strong>.</p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
