'use client';

import { useState, useRef } from 'react';
import { Upload, CheckCircle, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './careers.module.css';

const SKILLS_LIST = [
  'Customer Service / Hospitality Experience',
  'Conflict Resolution / De-escalation',
  'Computer / Software Proficiency',
  'Bilingual',
  'Security / Access Control Experience',
  'Valid Driver\'s License',
];

export default function CareersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [bilingualLanguages, setBilingualLanguages] = useState('');
  const [experienceDescription, setExperienceDescription] = useState('');
  const [hasPriorExperience, setHasPriorExperience] = useState('');
  const fileRef = useRef(null);

  const validate = (formData) => {
    const newErrors = {};
    if (!formData.get('fullName')?.trim()) newErrors.fullName = 'Full name is required.';
    
    const phone = formData.get('phone')?.trim();
    if (!phone) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^[\d\s\-\(\)\+\.]{7,20}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    const email = formData.get('email')?.trim();
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.get('address')?.trim()) newErrors.address = 'Address is required.';
    if (!formData.get('city')?.trim()) newErrors.city = 'City is required.';
    if (!formData.get('state')?.trim()) newErrors.state = 'State is required.';
    if (!formData.get('zip')?.trim()) newErrors.zip = 'ZIP code is required.';
    if (!formData.get('authorized')) newErrors.authorized = 'This field is required.';
    if (!formData.get('eighteenPlus')) newErrors.eighteenPlus = 'This field is required.';
    if (!formData.get('position')?.trim()) newErrors.position = 'Position is required.';
    if (!formData.get('backgroundCheck')) newErrors.backgroundCheck = 'You must consent to the background check.';
    if (!formData.get('certification')) newErrors.certification = 'You must certify the information is accurate.';

    if (selectedFile) {
      const allowed = ['.pdf', '.doc', '.docx'];
      const ext = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
      if (!allowed.includes(ext)) {
        newErrors.resume = 'Only PDF, DOC, or DOCX files are accepted.';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});

    // Build a clean data object for submission
    const data = {
      fullName: formData.get('fullName'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip: formData.get('zip'),
      authorized: formData.get('authorized'),
      eighteenPlus: formData.get('eighteenPlus'),
      position: formData.get('position'),
      heardAbout: formData.get('heardAbout'),
      desiredPay: formData.get('desiredPay'),
      shift1: formData.get('shift1') || 'Not selected',
      shift2: formData.get('shift2') || 'Not selected',
      shift3: formData.get('shift3') || 'Not selected',
      holidays: formData.get('holidays') || 'Not answered',
      overnights: formData.get('overnights') || 'Not answered',
      transportation: formData.get('transportation') || 'Not answered',
      recentEmployer: formData.get('recentCompany'),
      recentPosition: formData.get('recentPosition'),
      recentDates: formData.get('recentDates'),
      recentLeaving: formData.get('recentLeaving'),
      prevCompany: formData.get('prevCompany'),
      prevPosition: formData.get('prevPosition'),
      prevDates: formData.get('prevDates'),
      prevLeaving: formData.get('prevLeaving'),
      priorExperience: hasPriorExperience,
      experienceDescription: experienceDescription,
      skills: skills.join(', '),
      bilingualLanguages: bilingualLanguages,
      backgroundCheck: formData.get('backgroundCheck') === 'agreed',
      certification: formData.get('certification') === 'certified',
    };

    setSubmitError('');
    setIsSubmitting(true);

    try {
      // Generate Branded PDF
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
      doc.text("EMPLOYMENT APPLICATION", 105, 40, { align: "center" });
      
      doc.setLineWidth(0.5);
      doc.line(20, 45, 190, 45);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Submitted Date: ${new Date().toLocaleString()}`, 20, 52);

      // Document Body
      autoTable(doc, {
        startY: 60,
        head: [['Section', 'Details']],
        body: [
          ['1. Personal Information', ''],
          ['Full Name', data.fullName],
          ['Phone', data.phone],
          ['Email', data.email],
          ['Address', `${data.address}, ${data.city}, ${data.state} ${data.zip}`],
          ['Authorized to work in US', data.authorized],
          ['18 or older', data.eighteenPlus],
          
          ['\n2. Position Information', ''],
          ['Position Applying For', data.position],
          ['How did you hear about us', data.heardAbout || '-'],
          ['Desired Pay', data.desiredPay || '-'],
          
          ['\n3. Availability', ''],
          ['1st Shift (7 AM - 3 PM)', data.shift1],
          ['2nd Shift (3 PM - 11 PM)', data.shift2],
          ['3rd Shift (11 PM - 7 AM)', data.shift3],
          ['Able to work holidays', data.holidays],
          ['Able to work overnights', data.overnights],
          ['Reliable transportation', data.transportation],
          
          ['\n4. Employment Experience', ''],
          ['Most Recent Employer', data.recentEmployer || '-'],
          ['Position Held', data.recentPosition || '-'],
          ['Dates', data.recentDates || '-'],
          ['Reason for leaving', data.recentLeaving || '-'],
          ['Previous Employer', data.prevCompany || '-'],
          ['Position Held', data.prevPosition || '-'],
          ['Dates', data.prevDates || '-'],
          ['Reason for leaving', data.prevLeaving || '-'],
          ['Prior Hospitality Experience', data.priorExperience === 'Yes' ? data.experienceDescription : 'No'],
          
          ['\n5. Skills & Qualifications', ''],
          ['Skills', data.skills || 'None selected'],
          ['Bilingual Languages', data.bilingualLanguages || '-'],
          
          ['\n6. Authorizations', ''],
          ['Background Check Consent', data.backgroundCheck ? 'Agreed' : 'Not Agreed'],
          ['Applicant Certification', data.certification ? 'Certified' : 'Not Certified'],
          ['Resume Uploaded', selectedFile ? 'Yes' : 'No']
        ],
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: { 
          0: { fontStyle: 'bold', cellWidth: 70, fillColor: [250, 249, 245] },
          1: { cellWidth: 'auto' }
        },
        didParseCell: function(data) {
          // Make section headers span two columns and style them
          if (data.row.raw[0].startsWith('\n') || data.row.raw[0].startsWith('1.')) {
            data.cell.styles.fillColor = [15, 30, 60]; // Navy blue
            data.cell.styles.textColor = [255, 255, 255];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      });

      const pdfBlob = doc.output('blob');
      const pdfFile = new File([pdfBlob], `The-Vine-Luxuries-Employment-Application-${data.fullName.replace(/\s+/g, '-')}.pdf`, { type: 'application/pdf' });

      // Submit to our own API (handles email with attachments + database save)
      const submitData = new FormData();
      submitData.append('applicationData', JSON.stringify(data));
      submitData.append('applicationPdf', pdfFile);
      
      if (selectedFile) {
        submitData.append('resume', selectedFile);
      }

      const res = await fetch('/api/submit-application', {
        method: 'POST',
        body: submitData,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Submission failed');
      }

      // Send email notification via Web3Forms from the browser (bypasses server firewall)
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: '222b5440-6fe3-45e4-bdec-5f9bcd39b159',
            subject: `New Employment Application - The Vine Luxuries LLC - ${data.fullName}`,
            from_name: 'The Vine Luxuries Applications',
            'Full Name': data.fullName,
            'Phone': data.phone,
            'Email': data.email,
            'Address': `${data.address}, ${data.city}, ${data.state} ${data.zip}`,
            'Position': data.position || '-',
            'Authorized': data.authorized,
            '18+': data.eighteenPlus,
            'Desired Pay': data.desiredPay || '-',
            'Resume Uploaded': selectedFile ? 'Yes' : 'No',
            'NOTE': 'Log in to thevineluxuries.com/log-history to view the full application PDF and resume.',
          }),
        });
      } catch (emailErr) {
        console.warn('Email notification failed (non-critical):', emailErr);
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowed = ['.pdf', '.doc', '.docx'];
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      if (!allowed.includes(ext)) {
        setErrors(prev => ({ ...prev, resume: 'Only PDF, DOC, or DOCX files are accepted.' }));
        setSelectedFile(null);
        return;
      }
      setErrors(prev => { const { resume, ...rest } = prev; return rest; });
      setSelectedFile(file);
    }
  };

  const toggleSkill = (skill) => {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  if (submitted) {
    return (
      <main className={styles.pageWrapper}>
        <div className={styles.successOverlay} style={{ position: 'relative' }}>
          <div className={styles.successBox}>
            <div className={styles.successIcon}>
              <CheckCircle size={36} />
            </div>
            <h2 className={styles.successTitle}>Application Received</h2>
            <p className={styles.successText}>
              Thank you for applying with The Vine Luxuries LLC. Your application has been received. Our team will review your information and contact you if your qualifications match our current needs.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.pageWrapper}>
      <div className="container">

        {/* Header */}
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Join Our Team</h1>
          <p className={styles.intro}>
            The Vine Luxuries LLC is looking for dependable, professional, and customer-focused team members. Please complete the application below to be considered for available positions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContainer} noValidate>

          {/* SECTION 1: Personal Information */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>Section 01</span>
              <h2 className={styles.sectionTitle}>Personal Information</h2>
            </div>
            <div className={styles.formGrid}>
              <div className={`form-group ${styles.fullWidth}`}>
                <label className="form-label">Full Name <span className={styles.required}>*</span></label>
                <input type="text" name="fullName" className="form-input" required />
                {errors.fullName && <p className={styles.errorText}>{errors.fullName}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number <span className={styles.required}>*</span></label>
                <input type="tel" name="phone" className="form-input" placeholder="(555) 555-5555" required />
                {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address <span className={styles.required}>*</span></label>
                <input type="email" name="email" className="form-input" required />
                {errors.email && <p className={styles.errorText}>{errors.email}</p>}
              </div>
              <div className={`form-group ${styles.fullWidth}`}>
                <label className="form-label">Home Address <span className={styles.required}>*</span></label>
                <input type="text" name="address" className="form-input" required />
                {errors.address && <p className={styles.errorText}>{errors.address}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">City <span className={styles.required}>*</span></label>
                <input type="text" name="city" className="form-input" required />
                {errors.city && <p className={styles.errorText}>{errors.city}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">State <span className={styles.required}>*</span></label>
                <input type="text" name="state" className="form-input" required />
                {errors.state && <p className={styles.errorText}>{errors.state}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">ZIP Code <span className={styles.required}>*</span></label>
                <input type="text" name="zip" className="form-input" required />
                {errors.zip && <p className={styles.errorText}>{errors.zip}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Authorized to work in the U.S.? <span className={styles.required}>*</span></label>
                <div className={styles.yesNoGroup}>
                  <label className={styles.yesNoOption}><input type="radio" name="authorized" value="Yes" required /> Yes</label>
                  <label className={styles.yesNoOption}><input type="radio" name="authorized" value="No" /> No</label>
                </div>
                {errors.authorized && <p className={styles.errorText}>{errors.authorized}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">At least 18 years old? <span className={styles.required}>*</span></label>
                <div className={styles.yesNoGroup}>
                  <label className={styles.yesNoOption}><input type="radio" name="eighteenPlus" value="Yes" required /> Yes</label>
                  <label className={styles.yesNoOption}><input type="radio" name="eighteenPlus" value="No" /> No</label>
                </div>
                {errors.eighteenPlus && <p className={styles.errorText}>{errors.eighteenPlus}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 2: Position Information */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>Section 02</span>
              <h2 className={styles.sectionTitle}>Position Information</h2>
            </div>
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Position Applying For <span className={styles.required}>*</span></label>
                <input type="text" name="position" className="form-input" required />
                {errors.position && <p className={styles.errorText}>{errors.position}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">How did you hear about us?</label>
                <input type="text" name="heardAbout" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Desired Pay Rate</label>
                <input type="text" name="desiredPay" className="form-input" placeholder="e.g. $18/hr" />
              </div>
            </div>
          </div>

          {/* SECTION 3: Availability */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>Section 03</span>
              <h2 className={styles.sectionTitle}>Availability</h2>
            </div>
            <div className={styles.shiftGrid}>
              <div className={styles.shiftCard}>
                <span className={styles.shiftLabel}>1st Shift</span>
                <span className={styles.shiftTime}>7:00 AM – 3:00 PM</span>
                <div className={styles.shiftOptions}>
                  <label className={styles.shiftOption}><input type="radio" name="shift1" value="Weekday" /> Weekday</label>
                  <label className={styles.shiftOption}><input type="radio" name="shift1" value="Weekend" /> Weekend</label>
                  <label className={styles.shiftOption}><input type="radio" name="shift1" value="Both" /> Both</label>
                </div>
              </div>
              <div className={styles.shiftCard}>
                <span className={styles.shiftLabel}>2nd Shift</span>
                <span className={styles.shiftTime}>3:00 PM – 11:00 PM</span>
                <div className={styles.shiftOptions}>
                  <label className={styles.shiftOption}><input type="radio" name="shift2" value="Weekday" /> Weekday</label>
                  <label className={styles.shiftOption}><input type="radio" name="shift2" value="Weekend" /> Weekend</label>
                  <label className={styles.shiftOption}><input type="radio" name="shift2" value="Both" /> Both</label>
                </div>
              </div>
              <div className={styles.shiftCard}>
                <span className={styles.shiftLabel}>3rd Shift</span>
                <span className={styles.shiftTime}>11:00 PM – 7:00 AM</span>
                <div className={styles.shiftOptions}>
                  <label className={styles.shiftOption}><input type="radio" name="shift3" value="Weekday" /> Weekday</label>
                  <label className={styles.shiftOption}><input type="radio" name="shift3" value="Weekend" /> Weekend</label>
                  <label className={styles.shiftOption}><input type="radio" name="shift3" value="Both" /> Both</label>
                </div>
              </div>
            </div>

            <div className={styles.formGrid} style={{ marginTop: '3rem' }}>
              <div className="form-group">
                <label className="form-label">Able to work holidays?</label>
                <div className={styles.yesNoGroup}>
                  <label className={styles.yesNoOption}><input type="radio" name="holidays" value="Yes" /> Yes</label>
                  <label className={styles.yesNoOption}><input type="radio" name="holidays" value="No" /> No</label>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Able to work overnights?</label>
                <div className={styles.yesNoGroup}>
                  <label className={styles.yesNoOption}><input type="radio" name="overnights" value="Yes" /> Yes</label>
                  <label className={styles.yesNoOption}><input type="radio" name="overnights" value="No" /> No</label>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Reliable transportation?</label>
                <div className={styles.yesNoGroup}>
                  <label className={styles.yesNoOption}><input type="radio" name="transportation" value="Yes" /> Yes</label>
                  <label className={styles.yesNoOption}><input type="radio" name="transportation" value="No" /> No</label>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Employment Experience */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>Section 04</span>
              <h2 className={styles.sectionTitle}>Employment Experience</h2>
            </div>

            <p className="form-label" style={{ marginBottom: '1.5rem', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Most Recent Employer</p>
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input type="text" name="recentCompany" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Position Held</label>
                <input type="text" name="recentPosition" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Dates Employed</label>
                <input type="text" name="recentDates" className="form-input" placeholder="e.g. Jan 2022 – Dec 2023" />
              </div>
              <div className="form-group">
                <label className="form-label">Reason for Leaving</label>
                <input type="text" name="recentLeaving" className="form-input" />
              </div>
            </div>

            <p className="form-label" style={{ marginBottom: '1.5rem', marginTop: '3rem', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Previous Employer</p>
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input type="text" name="prevCompany" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Position Held</label>
                <input type="text" name="prevPosition" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Dates Employed</label>
                <input type="text" name="prevDates" className="form-input" placeholder="e.g. Mar 2020 – Dec 2021" />
              </div>
              <div className="form-group">
                <label className="form-label">Reason for Leaving</label>
                <input type="text" name="prevLeaving" className="form-input" />
              </div>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <label className="form-label">Prior concierge, hospitality, or customer service experience?</label>
              <div className={styles.yesNoGroup}>
                <label className={styles.yesNoOption}><input type="radio" name="priorExp" value="Yes" onChange={() => setHasPriorExperience('Yes')} /> Yes</label>
                <label className={styles.yesNoOption}><input type="radio" name="priorExp" value="No" onChange={() => setHasPriorExperience('No')} /> No</label>
              </div>
              {hasPriorExperience === 'Yes' && (
                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <label className="form-label">Please describe your experience</label>
                  <textarea
                    className="form-textarea"
                    value={experienceDescription}
                    onChange={(e) => setExperienceDescription(e.target.value)}
                    placeholder="Tell us about your relevant experience..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* SECTION 5: Skills */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>Section 05</span>
              <h2 className={styles.sectionTitle}>Skills</h2>
            </div>
            <div className={styles.skillsGrid}>
              {SKILLS_LIST.map((skill) => (
                <label key={skill} className={styles.skillOption}>
                  <input
                    type="checkbox"
                    checked={skills.includes(skill)}
                    onChange={() => toggleSkill(skill)}
                  />
                  {skill}
                </label>
              ))}
            </div>
            {skills.includes('Bilingual') && (
              <div className="form-group" style={{ marginTop: '2rem' }}>
                <label className="form-label">Please list the language(s) you speak</label>
                <input
                  type="text"
                  className="form-input"
                  value={bilingualLanguages}
                  onChange={(e) => setBilingualLanguages(e.target.value)}
                  placeholder="e.g. Spanish, French"
                />
              </div>
            )}
          </div>

          {/* SECTION 6: Background Check Consent */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>Section 06</span>
              <h2 className={styles.sectionTitle}>Background Check Consent</h2>
            </div>
            <label className={styles.consentOption}>
              <input type="checkbox" name="backgroundCheck" value="agreed" required />
              I authorize The Vine Luxuries LLC to conduct a background check as part of the employment screening process, and I understand any offer of employment is contingent on satisfactory results.
            </label>
            {errors.backgroundCheck && <p className={styles.errorText}>{errors.backgroundCheck}</p>}
          </div>

          {/* SECTION 7: Resume Upload */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>Section 07</span>
              <h2 className={styles.sectionTitle}>Resume Upload</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1.5rem', fontWeight: 300 }}>Optional — Accepted formats: PDF, DOC, DOCX</p>
            <div
              className={styles.fileUploadArea}
              onClick={() => fileRef.current?.click()}
            >
              <div className={styles.fileUploadIcon}><Upload size={32} strokeWidth={1} /></div>
              <p className={styles.fileUploadText}>Click to upload your resume</p>
              <p className={styles.fileUploadHint}>or drag and drop</p>
              {selectedFile && <p className={styles.fileName}>{selectedFile.name}</p>}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {errors.resume && <p className={styles.errorText}>{errors.resume}</p>}
          </div>

          {/* SECTION 8: Final Certification */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>Section 08</span>
              <h2 className={styles.sectionTitle}>Certification</h2>
            </div>
            <label className={styles.consentOption}>
              <input type="checkbox" name="certification" value="certified" required />
              I certify that the information provided is true and complete to the best of my knowledge.
            </label>
            {errors.certification && <p className={styles.errorText}>{errors.certification}</p>}
          </div>

            {/* Submit Section */}
            <div className={styles.formSection} style={{ borderBottom: 'none' }}>
              {submitError && (
                <div style={{ padding: '1rem', background: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '1.5rem', textAlign: 'center' }}>
                  {submitError}
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <button type="submit" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
        </form>
      </div>
    </main>
  );
}
