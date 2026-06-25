'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Eye, EyeOff } from 'lucide-react';
import styles from './history.module.css';

export default function LogHistoryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('logs');

  // Visitor Logs State
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ visitorName: '', visitType: '' });

  // Applications State
  const [applications, setApplications] = useState([]);
  const [expandedApp, setExpandedApp] = useState(null);
  const [selectedApps, setSelectedApps] = useState([]);

  const toggleAppSelection = (id) => {
    setSelectedApps(prev => prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]);
  };

  const toggleAllApps = () => {
    if (selectedApps.length === applications.length) {
      setSelectedApps([]);
    } else {
      setSelectedApps(applications.map(app => app.id));
    }
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentLogId, setCurrentLogId] = useState(null);
  const [formData, setFormData] = useState({
    dateTime: '',
    unitNumber: '',
    visitorName: '',
    visitType: 'Guest',
    conciergeName: '',
    comments: ''
  });

  const fetchLogs = async (query = '') => {
    try {
      const res = await fetch(`/api/logs${query}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        console.error("API returned error:", data);
        setLogs([]);
      }
    } catch (error) {
      console.error("Failed to fetch logs", error);
      setLogs([]);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        console.error("API returned error:", data);
        setApplications([]);
      }
    } catch (error) {
      console.error("Failed to fetch applications", error);
      setApplications([]);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem("vine_admin_auth") === "true") {
      setIsAuthenticated(true);
      fetchLogs();
      fetchApplications();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (res.ok) {
        sessionStorage.setItem("vine_admin_auth", "true");
        setIsAuthenticated(true);
        fetchLogs();
        fetchApplications();
      } else {
        alert("Incorrect password");
      }
    } catch (error) {
      console.error(error);
      alert("Authentication error");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("vine_admin_auth");
    setIsAuthenticated(false);
  };

  // Auto-logout after 10 minutes of inactivity
  useEffect(() => {
    let timeoutId;
    
    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (isAuthenticated) {
        timeoutId = setTimeout(() => {
          handleLogout();
          alert("You have been automatically logged out due to 10 minutes of inactivity.");
        }, 10 * 60 * 1000);
      }
    };

    if (isAuthenticated) {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      window.addEventListener('click', resetTimer);
      window.addEventListener('scroll', resetTimer);
      resetTimer();
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [isAuthenticated]);

  // --- Visitor Log Functions ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.visitorName) params.append('visitorName', filters.visitorName);
    if (filters.visitType) params.append('visitType', filters.visitType);
    fetchLogs(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({ visitorName: '', visitType: '' });
    fetchLogs();
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(logs.map(l => ({
      "Date & Time": new Date(l.dateTime).toLocaleString(),
      "Unit": l.unitNumber,
      "Name": l.visitorName,
      "Type": l.visitType,
      "Concierge": l.conciergeName,
      "Notes": l.comments
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Logs");
    XLSX.writeFile(wb, "Vine_Luxuries_Logs.csv");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("The Vine Luxuries - Visitor Log", 14, 15);
    
    doc.autoTable({
      startY: 20,
      head: [['Date/Time', 'Unit', 'Name', 'Type', 'Concierge', 'Notes']],
      body: logs.map(l => [
        new Date(l.dateTime).toLocaleString(),
        l.unitNumber,
        l.visitorName,
        l.visitType,
        l.conciergeName,
        l.comments
      ])
    });
    
    doc.save("Vine_Luxuries_Logs.pdf");
  };

  const openModal = (mode, log = null) => {
    setModalMode(mode);
    if (mode === 'edit' && log) {
      setCurrentLogId(log.id);
      const dateObj = new Date(log.dateTime);
      dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
      const localDateTime = dateObj.toISOString().slice(0, 16);

      setFormData({
        dateTime: localDateTime,
        unitNumber: log.unitNumber,
        visitorName: log.visitorName,
        visitType: log.visitType,
        conciergeName: log.conciergeName,
        comments: log.comments || ''
      });
    } else {
      setCurrentLogId(null);
      
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      
      setFormData({
        dateTime: now.toISOString().slice(0, 16),
        unitNumber: '',
        visitorName: '',
        visitType: 'Guest',
        conciergeName: '',
        comments: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = modalMode === 'add' ? '/api/logs' : `/api/logs/${currentLogId}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        closeModal();
        fetchLogs();
      } else {
        alert("Failed to save log");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving log");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this log entry? This cannot be undone.")) {
      try {
        const res = await fetch(`/api/logs/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchLogs();
        } else {
          alert("Failed to delete log");
        }
      } catch (error) {
        console.error(error);
        alert("Error deleting log");
      }
    }
  };

  // --- Applications Functions ---
  const updateApplicationStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchApplications();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating application");
    }
  };

  const deleteApplication = async (id) => {
    if (window.confirm("Are you sure you want to delete this application? This cannot be undone.")) {
      try {
        const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setExpandedApp(null);
          setSelectedApps(prev => prev.filter(appId => appId !== id));
          fetchApplications();
        } else {
          alert("Failed to delete application");
        }
      } catch (error) {
        console.error(error);
        alert("Error deleting application");
      }
    }
  };

  const deleteSelectedApplications = async () => {
    if (selectedApps.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedApps.length} selected applications? This cannot be undone.`)) {
      try {
        // Run deletions in parallel
        await Promise.all(selectedApps.map(id => fetch(`/api/applications/${id}`, { method: 'DELETE' })));
        setExpandedApp(null);
        setSelectedApps([]);
        fetchApplications();
      } catch (error) {
        console.error(error);
        alert("Error deleting some applications");
        fetchApplications();
      }
    }
  };

  const exportApplicationsCSV = () => {
    const ws = XLSX.utils.json_to_sheet(applications.map(a => ({
      "Date Applied": new Date(a.createdAt).toLocaleDateString(),
      "Status": a.status,
      "Full Name": a.fullName,
      "Email": a.email,
      "Phone": a.phone,
      "Position": a.position,
      "City": a.city,
      "State": a.state,
      "Authorized": a.authorized,
      "18+": a.eighteenPlus,
      "1st Shift": a.shift1 || '-',
      "2nd Shift": a.shift2 || '-',
      "3rd Shift": a.shift3 || '-',
      "Holidays": a.holidays || '-',
      "Overnights": a.overnights || '-',
      "Transportation": a.transportation || '-',
      "Skills": a.skills || '-',
      "Prior Experience": a.priorExperience || '-',
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applications");
    XLSX.writeFile(wb, "Vine_Luxuries_Applications.csv");
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'New': return styles.statusNew;
      case 'Reviewed': return styles.statusReviewed;
      case 'Contacted': return styles.statusContacted;
      case 'Rejected': return styles.statusRejected;
      default: return styles.statusNew;
    }
  };

  // --- Login Screen ---
  if (!isAuthenticated) {
    return (
      <div className={styles.pageWrapper}>
        <div className="container">
          <div className={styles.loginWrapper}>
            <div className={styles.loginCard}>
              <h1 className="mb-4" style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Admin Access</h1>
              <p className="mb-4 text-sm" style={{ color: '#666' }}>Enter password to view logs.</p>
              <form onSubmit={handleLogin}>
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-input" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      position: 'absolute', 
                      right: '0.75rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      background: 'transparent', 
                      border: 'none', 
                      cursor: 'pointer',
                      color: '#666',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Access Dashboard</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Dashboard ---
  return (
    <div className={styles.pageWrapper}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <div className={styles.actions}>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.8rem 1.5rem', background: '#333', color: 'white', border: 'none' }}>Logout</button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNav}>
          <button 
            className={`${styles.tab} ${activeTab === 'logs' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            Visitor Logs ({logs.length})
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'applications' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            Job Applications ({applications.length})
          </button>
        </div>

        {/* ===== VISITOR LOGS TAB ===== */}
        {activeTab === 'logs' && (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button onClick={() => window.location.href='/digital-log'} className="btn-primary" style={{ padding: '0.8rem 1.5rem', background: 'var(--color-navy-950)', color: 'white', border: '1px solid var(--color-navy-950)' }}>Open Visitor Log</button>
              <button onClick={() => openModal('add')} className="btn-primary" style={{ padding: '0.8rem 1.5rem' }}>+ Add Log</button>
              <button onClick={exportCSV} className="btn-outline-dark" style={{ padding: '0.8rem 1.5rem' }}>Export CSV</button>
              <button onClick={exportPDF} className="btn-outline-dark" style={{ padding: '0.8rem 1.5rem' }}>Export PDF</button>
            </div>

            <div className={styles.tableWrapper}>
              <div className={styles.filters} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                <input 
                  type="text" 
                  name="visitorName" 
                  className={styles.filterInput} 
                  placeholder="Search by Name" 
                  value={filters.visitorName} 
                  onChange={handleFilterChange} 
                  style={{ padding: '0.8rem 1rem', width: '250px' }}
                />
                <select name="visitType" className={styles.filterInput} value={filters.visitType} onChange={handleFilterChange} style={{ padding: '0.8rem 1rem', width: '200px', cursor: 'pointer' }}>
                  <option value="">All Types</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Guest">Guest</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Contractor">Contractor</option>
                  <option value="Other">Other</option>
                </select>
                <button onClick={applyFilters} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>Filter</button>
                <button onClick={clearFilters} className="btn-secondary" style={{ padding: '0.8rem 2rem' }}>Clear</button>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Unit Number</th>
                    <th>Visitor/Vendor Name</th>
                    <th>Type of Visit</th>
                    <th>Concierge Name</th>
                    <th>Comments/Notes</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td>{new Date(log.dateTime).toLocaleString()}</td>
                      <td>{log.unitNumber}</td>
                      <td>{log.visitorName}</td>
                      <td>{log.visitType}</td>
                      <td>{log.conciergeName}</td>
                      <td>{log.comments || '-'}</td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button onClick={() => openModal('edit', log)} className={styles.actionBtn}>Edit</button>
                        <button onClick={() => handleDelete(log.id)} className={`${styles.actionBtn} ${styles.deleteBtn}`}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No log entries found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ===== APPLICATIONS TAB ===== */}
        {activeTab === 'applications' && (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button onClick={exportApplicationsCSV} className="btn-outline-dark" style={{ padding: '0.8rem 1.5rem' }}>Export Applications CSV</button>
              {selectedApps.length > 0 && (
                <button 
                  onClick={deleteSelectedApplications} 
                  className="btn-primary" 
                  style={{ padding: '0.8rem 1.5rem', backgroundColor: '#dc3545', borderColor: '#dc3545', color: '#fff' }}
                >
                  Delete Selected ({selectedApps.length})
                </button>
              )}
            </div>

            <div className={styles.tableWrapper}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input 
                        type="checkbox" 
                        onChange={toggleAllApps} 
                        checked={applications.length > 0 && selectedApps.length === applications.length} 
                      />
                    </th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id} style={{ backgroundColor: selectedApps.includes(app.id) ? 'rgba(220, 53, 69, 0.05)' : 'transparent' }}>
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          onChange={() => toggleAppSelection(app.id)} 
                          checked={selectedApps.includes(app.id)} 
                        />
                      </td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 500 }}>{app.fullName}</td>
                      <td>{app.position}</td>
                      <td><a href={`mailto:${app.email}`} style={{ color: 'var(--color-gold-500)' }}>{app.email}</a></td>
                      <td><a href={`tel:${app.phone}`}>{app.phone}</a></td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          value={app.status}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)} className={styles.actionBtn}>
                          {expandedApp === app.id ? 'Close' : 'View'}
                        </button>
                        <button onClick={() => deleteApplication(app.id)} className={`${styles.actionBtn} ${styles.deleteBtn}`}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No applications received yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Expanded Application Detail */}
              {expandedApp && (() => {
                const app = applications.find(a => a.id === expandedApp);
                if (!app) return null;
                return (
                  <div className={styles.detailPanel} style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>{app.fullName}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '2rem' }}>Applied {new Date(app.createdAt).toLocaleString()} · <span className={`${styles.statusBadge} ${getStatusClass(app.status)}`}>{app.status}</span></p>

                    {/* Personal Information */}
                    <div className={styles.detailGrid}>
                      <div><p className={styles.detailLabel}>Email</p><p className={styles.detailValue}>{app.email}</p></div>
                      <div><p className={styles.detailLabel}>Phone</p><p className={styles.detailValue}>{app.phone}</p></div>
                      <div><p className={styles.detailLabel}>Address</p><p className={styles.detailValue}>{app.address}, {app.city}, {app.state} {app.zip}</p></div>
                      <div><p className={styles.detailLabel}>Work Authorization</p><p className={styles.detailValue}>{app.authorized}</p></div>
                      <div><p className={styles.detailLabel}>18 or Older</p><p className={styles.detailValue}>{app.eighteenPlus}</p></div>
                    </div>

                    {/* Position */}
                    <div className={styles.detailSection}>
                      <h4 className={styles.detailSectionTitle}>Position Information</h4>
                      <div className={styles.detailGrid}>
                        <div><p className={styles.detailLabel}>Position</p><p className={styles.detailValue}>{app.position}</p></div>
                        <div><p className={styles.detailLabel}>How They Heard About Us</p><p className={styles.detailValue}>{app.heardAbout || '-'}</p></div>
                        <div><p className={styles.detailLabel}>Desired Pay</p><p className={styles.detailValue}>{app.desiredPay || '-'}</p></div>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className={styles.detailSection}>
                      <h4 className={styles.detailSectionTitle}>Availability</h4>
                      <div className={styles.detailGrid}>
                        <div><p className={styles.detailLabel}>1st Shift (7AM-3PM)</p><p className={styles.detailValue}>{app.shift1 || 'Not selected'}</p></div>
                        <div><p className={styles.detailLabel}>2nd Shift (3PM-11PM)</p><p className={styles.detailValue}>{app.shift2 || 'Not selected'}</p></div>
                        <div><p className={styles.detailLabel}>3rd Shift (11PM-7AM)</p><p className={styles.detailValue}>{app.shift3 || 'Not selected'}</p></div>
                        <div><p className={styles.detailLabel}>Holidays</p><p className={styles.detailValue}>{app.holidays || '-'}</p></div>
                        <div><p className={styles.detailLabel}>Overnights</p><p className={styles.detailValue}>{app.overnights || '-'}</p></div>
                        <div><p className={styles.detailLabel}>Transportation</p><p className={styles.detailValue}>{app.transportation || '-'}</p></div>
                      </div>
                    </div>

                    {/* Employment History */}
                    <div className={styles.detailSection}>
                      <h4 className={styles.detailSectionTitle}>Employment History</h4>
                      <div className={styles.detailGrid}>
                        <div><p className={styles.detailLabel}>Most Recent Company</p><p className={styles.detailValue}>{app.recentCompany || '-'}</p></div>
                        <div><p className={styles.detailLabel}>Position</p><p className={styles.detailValue}>{app.recentPosition || '-'}</p></div>
                        <div><p className={styles.detailLabel}>Dates</p><p className={styles.detailValue}>{app.recentDates || '-'}</p></div>
                        <div><p className={styles.detailLabel}>Reason for Leaving</p><p className={styles.detailValue}>{app.recentLeaving || '-'}</p></div>
                      </div>
                      <div className={styles.detailGrid} style={{ marginTop: '1.5rem' }}>
                        <div><p className={styles.detailLabel}>Previous Company</p><p className={styles.detailValue}>{app.prevCompany || '-'}</p></div>
                        <div><p className={styles.detailLabel}>Position</p><p className={styles.detailValue}>{app.prevPosition || '-'}</p></div>
                        <div><p className={styles.detailLabel}>Dates</p><p className={styles.detailValue}>{app.prevDates || '-'}</p></div>
                        <div><p className={styles.detailLabel}>Reason for Leaving</p><p className={styles.detailValue}>{app.prevLeaving || '-'}</p></div>
                      </div>
                      {app.priorExperience && (
                        <div style={{ marginTop: '1.5rem' }}>
                          <p className={styles.detailLabel}>Prior Hospitality/Concierge Experience</p>
                          <p className={styles.detailValue}>{app.priorExperience}{app.experienceDescription ? ` — ${app.experienceDescription}` : ''}</p>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    <div className={styles.detailSection}>
                      <h4 className={styles.detailSectionTitle}>Skills</h4>
                      <p className={styles.detailValue}>{app.skills || 'None selected'}</p>
                      {app.bilingualLanguages && (
                        <div style={{ marginTop: '1rem' }}>
                          <p className={styles.detailLabel}>Languages</p>
                          <p className={styles.detailValue}>{app.bilingualLanguages}</p>
                        </div>
                      )}
                    </div>

                    {/* Documents */}
                    <div className={styles.detailSection}>
                      <h4 className={styles.detailSectionTitle}>Attached Documents</h4>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        {app.applicationPdfBase64 ? (
                          <a href={app.applicationPdfBase64} download={`The-Vine-Luxuries-Application-${app.fullName.replace(/\s+/g, '-')}.pdf`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block' }}>
                            Download App PDF
                          </a>
                        ) : (
                          <span style={{ color: '#888', fontSize: '0.9rem', padding: '0.5rem 0' }}>No PDF stored</span>
                        )}
                        
                        {app.resumeFileBase64 ? (
                          <a href={app.resumeFileBase64} download={`Resume-${app.fullName.replace(/\s+/g, '-')}`} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block' }}>
                            Download Resume
                          </a>
                        ) : (
                          <span style={{ color: '#888', fontSize: '0.9rem', padding: '0.5rem 0' }}>No Resume uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 500 }}>
                {modalMode === 'add' ? 'Add New Log' : 'Edit Log Entry'}
              </h2>
              <button onClick={closeModal} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className={styles.modalBody}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Date & Time</label>
                  <input type="datetime-local" name="dateTime" className="form-input" value={formData.dateTime} onChange={handleFormChange} required style={{ padding: '0.5rem 0' }} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Unit Number</label>
                    <input type="text" name="unitNumber" className="form-input" value={formData.unitNumber} onChange={handleFormChange} required style={{ padding: '0.5rem 0' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Visit Type</label>
                    <select name="visitType" className="form-select" value={formData.visitType} onChange={handleFormChange} required style={{ padding: '0.5rem 0' }}>
                      <option value="Delivery">Delivery</option>
                      <option value="Guest">Guest</option>
                      <option value="Vendor">Vendor</option>
                      <option value="Contractor">Contractor</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Visitor/Vendor Name</label>
                  <input type="text" name="visitorName" className="form-input" value={formData.visitorName} onChange={handleFormChange} required style={{ padding: '0.5rem 0' }} />
                </div>
                
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Concierge Name</label>
                  <input type="text" name="conciergeName" className="form-input" value={formData.conciergeName} onChange={handleFormChange} required style={{ padding: '0.5rem 0' }} />
                </div>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Comments / Notes (Optional)</label>
                  <textarea name="comments" className="form-textarea" value={formData.comments} onChange={handleFormChange} style={{ minHeight: '60px', padding: '0.5rem 0' }}></textarea>
                </div>
              </div>
              
              <div className={styles.modalFooter}>
                <button type="button" onClick={closeModal} className="btn-secondary" style={{ padding: '0.6rem 1.5rem' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>{modalMode === 'add' ? 'Save Log' : 'Update Log'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
