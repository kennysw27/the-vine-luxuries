'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from '../digital-log/log.module.css';

const VISIT_TYPES = ["Delivery", "Guest", "Vendor", "Contractor", "Other"];

export default function EmployeeVisitorLogPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [formData, setFormData] = useState({
    unitNumber: '',
    visitorName: '',
    visitType: '',
    conciergeName: '',
    comments: ''
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem("vine_staff_auth") === "true") {
      setIsAuthenticated(true);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/employee-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (res.ok) {
        sessionStorage.setItem("vine_staff_auth", "true");
        setIsAuthenticated(true);
      } else {
        setAuthError('Incorrect employee password');
      }
    } catch (error) {
      console.error(error);
      setAuthError('Authentication error. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("vine_staff_auth");
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateTime: new Date().toISOString(), ...formData })
      });
      if (!res.ok) throw new Error('Failed to save log');
      
      setSuccessMsg('Visitor log submitted successfully.');
      setFormData({ unitNumber: '', visitorName: '', visitType: '', conciergeName: '', comments: '' });
      setTimeout(() => setSuccessMsg(''), 5000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert('Error saving log. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.pageWrapper} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '400px' }}>
          <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--color-gold-500)', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Employee Portal</h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>Enter the staff password to access the Visitor Log submission portal.</p>
            
            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ position: 'relative', textAlign: 'left' }}>
                <label className="form-label">Staff Password</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ 
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', 
                    background: 'transparent', border: 'none', cursor: 'pointer', color: '#666',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {authError && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'left' }}>{authError}</p>}
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Access Portal</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.pageWrapper}>
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className={styles.title} style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Employee Visitor Log</h1>
            <p className={styles.subtitle} style={{ marginBottom: 0 }}>Securely submit incoming visitor and vendor records.</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.6rem 1.2rem', background: '#f8f9fa', color: '#333', border: '1px solid #ddd' }}>
            Lock Portal
          </button>
        </div>

        <div className={styles.grid}>
          <div className={styles.formBox} style={{ margin: '0 auto', width: '100%' }}>
            
            <div className={styles.formHeader}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0 }}>New Log Entry</h2>
              <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>{currentDateTime}</div>
            </div>

            {successMsg && (
              <div className={styles.successMessage} style={{ margin: '1.5rem 2rem 0', background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '4px', border: '1px solid #c3e6cb' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
              <div className={styles.formGrid}>

                <div className="form-group">
                  <label className="form-label">Visitor/Vendor Name <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" name="visitorName" className="form-input" value={formData.visitorName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Person / Unit Visiting <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" name="unitNumber" className="form-input" value={formData.unitNumber} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Reason for Visit <span style={{ color: 'red' }}>*</span></label>
                  <select name="visitType" className="form-select" value={formData.visitType} onChange={handleChange} required>
                    <option value="" disabled>Select reason</option>
                    {VISIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Employee Name <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" name="conciergeName" className="form-input" value={formData.conciergeName} onChange={handleChange} required />
                </div>

                <div className={`form-group ${styles.fullWidth}`}>
                  <label className="form-label">Notes (Optional)</label>
                  <textarea name="comments" className="form-textarea" value={formData.comments} onChange={handleChange} rows="3"></textarea>
                </div>

              </div>
              <div style={{ marginTop: '2rem' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Visitor Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
