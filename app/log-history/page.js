'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import styles from './history.module.css';

export default function LogHistoryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ visitorName: '', visitType: '' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
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
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem("vine_admin_auth") === "true") {
      setIsAuthenticated(true);
      fetchLogs();
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
        }, 10 * 60 * 1000); // 10 minutes
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

  // CRUD Operations
  const openModal = (mode, log = null) => {
    setModalMode(mode);
    if (mode === 'edit' && log) {
      setCurrentLogId(log.id);
      // Format datetime-local string
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

  if (!isAuthenticated) {
    return (
      <div className={styles.pageWrapper}>
        <div className="container">
          <div className={styles.loginWrapper}>
            <div className={styles.loginCard}>
              <h1 className="mb-4" style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Admin Access</h1>
              <p className="mb-4 text-sm" style={{ color: '#666' }}>Enter password to view logs.</p>
              <form onSubmit={handleLogin}>
                <input 
                  type="password" 
                  className="form-input mb-4" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Password" 
                />
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Access Dashboard</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Log History</h1>
          <div className={styles.actions}>
            <button onClick={() => window.location.href='/digital-log'} className="btn-primary" style={{ padding: '0.8rem 1.5rem', background: 'var(--color-navy-950)', color: 'white', border: '1px solid var(--color-navy-950)', marginRight: 'auto' }}>Open Visitor Log</button>
            <button onClick={() => openModal('add')} className="btn-primary" style={{ padding: '0.8rem 1.5rem' }}>+ Add Log</button>
            <button onClick={exportCSV} className="btn-outline-dark" style={{ padding: '0.8rem 1.5rem' }}>Export CSV</button>
            <button onClick={exportPDF} className="btn-outline-dark" style={{ padding: '0.8rem 1.5rem' }}>Export PDF</button>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.8rem 1.5rem', background: '#333', color: 'white', border: 'none' }}>Logout</button>
          </div>
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
