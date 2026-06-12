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
            <button onClick={exportCSV} className="btn-outline-dark" style={{ padding: '0.8rem 1.5rem' }}>Export CSV</button>
            <button onClick={exportPDF} className="btn-outline-dark" style={{ padding: '0.8rem 1.5rem' }}>Export PDF</button>
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
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No log entries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
