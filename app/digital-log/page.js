'use client';

import { useState, useEffect } from 'react';
import styles from './log.module.css';

const VISIT_TYPES = ["Delivery", "Guest", "Vendor", "Contractor", "Other"];

export default function DigitalLogPage() {
  const [formData, setFormData] = useState({
    unitNumber: '',
    visitorName: '',
    visitType: '',
    conciergeName: '',
    comments: ''
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem("vine_admin_auth") !== "true") {
        window.location.href = '/log-history';
      } else {
        setIsAuthenticated(true);
      }
    }
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleString('en-US', {
          year: 'numeric', month: 'numeric', day: 'numeric',
          hour: 'numeric', minute: '2-digit', hour12: true
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateTime: new Date().toISOString(), ...formData })
      });
      if (!res.ok) throw new Error('Failed to save log');
      
      setSuccessMsg('Entry saved successfully.');
      setFormData({ unitNumber: '', visitorName: '', visitType: '', conciergeName: '', comments: '' });
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      console.error(error);
      alert('Error saving log. Please try again.');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <main className={styles.pageWrapper}>
      <div className="container">
        <div className={styles.grid}>
          
          <div className={styles.contextCol}>
            <div>
              <h1 className={styles.title}>Visitor & Vendor Log</h1>
              <p className={styles.subtitle}>
                A premium digital registry ensuring absolute accountability, visibility, and organized front desk records.
              </p>
            </div>
          </div>

          <div className={styles.formBox}>
            <div className={styles.formHeader}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Record Entry</h2>
            </div>

            {successMsg && (
              <div className={styles.successMessage}>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                
                <div className="form-group">
                  <label className="form-label">Date & Time</label>
                  <input type="text" className="form-input" value={currentDateTime} disabled />
                </div>

                <div className="form-group">
                  <label className="form-label">Unit Number</label>
                  <input type="text" name="unitNumber" className="form-input" value={formData.unitNumber} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Visitor/Vendor Name</label>
                  <input type="text" name="visitorName" className="form-input" value={formData.visitorName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Type of Visit</label>
                  <select name="visitType" className="form-select" value={formData.visitType} onChange={handleChange} required>
                    <option value="" disabled>Select type</option>
                    {VISIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className={`form-group ${styles.fullWidth}`}>
                  <label className="form-label">Concierge Name</label>
                  <input type="text" name="conciergeName" className="form-input" value={formData.conciergeName} onChange={handleChange} required />
                </div>

                <div className={`form-group ${styles.fullWidth}`}>
                  <label className="form-label">Comments/Notes</label>
                  <textarea name="comments" className="form-textarea" value={formData.comments} onChange={handleChange}></textarea>
                </div>

              </div>
              <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <button type="submit" className="btn-primary">Submit Entry</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
