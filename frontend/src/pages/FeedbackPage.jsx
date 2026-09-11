import React, { useState } from 'react';
import { MessageSquare, Send, User, Mail, Tag, FileText, CheckCircle2, ShieldAlert, Camera, MapPin, AlertCircle } from 'lucide-react';

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Citizen',
    type: 'Project Complaint',
    projectId: '',
    severity: 'Moderate',
    message: '',
    files: []
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: Array.from(e.target.files) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 42px',
    borderRadius: '6px',
    border: '1px solid var(--line-strong)',
    background: 'var(--paper)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: 'var(--ink)',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  };

  const iconStyle = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--ink-soft)'
  };

  if (isSubmitted) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <div className="card" style={{ textAlign: 'center', padding: '48px 32px', maxWidth: '500px', width: '100%', background: '#fff', borderRadius: '12px', border: '1px solid var(--line-strong)' }}>
          <CheckCircle2 size={64} color="var(--sage)" style={{ marginBottom: '24px' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', fontSize: '2rem', marginBottom: '16px' }}>Report Received</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '32px' }}>
            Thank you for helping us maintain transparency. Your evidence and report have been securely logged and routed to the district nodal team for verification.
          </p>
          <button 
            onClick={() => { setIsSubmitted(false); setFormData({ ...formData, message: '', files: [], projectId: '' }); }}
            style={{
              background: 'var(--paper-alt)', border: '1px solid var(--line-strong)', padding: '12px 24px',
              borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: 'var(--ink)', fontFamily: 'var(--font-body)'
            }}
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: 'clamp(16px, 3vw, 32px)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
        
        {/* Left Side: Context & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ background: 'var(--navy)', width: '64px', height: '64px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <MessageSquare size={32} color="var(--gold)" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--navy)', marginBottom: '16px', fontWeight: '700', lineHeight: '1.1' }}>
            Report Issues & Upload Evidence.
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '32px' }}>
            Use this portal to register complaints regarding stalled works, structural defects, or data discrepancies. Citizens can upload real-time photographic evidence to hold contractors accountable.
          </p>

          <div style={{ background: 'var(--paper-alt)', padding: '24px', borderRadius: '8px', borderLeft: '4px solid var(--gold)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--navy)', marginBottom: '8px', fontSize: '0.95rem' }}>
              <ShieldAlert size={18} color="var(--gold)" /> Secure Redressal System
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
              High-priority complaints with attached photographic evidence bypass general queues and are directly escalated to the Central Audit Nodal Officer.
            </p>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="card" style={{ padding: '32px', background: '#fff', borderRadius: '12px', border: '1px solid var(--line-strong)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={iconStyle} />
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={iconStyle} />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="jon@example.com" style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>Feedback Type</label>
                <div style={{ position: 'relative' }}>
                  <FileText size={18} style={iconStyle} />
                  <select name="type" value={formData.type} onChange={handleChange} style={{...inputStyle, cursor: 'pointer'}}>
                    <option value="Project Complaint">Project Complaint</option>
                    <option value="Data Discrepancy">Data Discrepancy</option>
                    <option value="General Feedback">General Feedback</option>
                    <option value="System Bug">System Bug</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>Project ID or Location (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={iconStyle} />
                  <input type="text" name="projectId" value={formData.projectId} onChange={handleChange} placeholder="e.g. Ward 4 Road" style={inputStyle} />
                </div>
              </div>
            </div>

            {/* 3-Color Priority Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} /> Issue Severity
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Low', 'Moderate', 'Critical'].map((level) => {
                  const isSelected = formData.severity === level;
                  
                  // Define the 3 Colors
                  const colors = {
                    'Low': { bg: '#dcfce7', text: '#166534', border: '#22c55e' },       // Green
                    'Moderate': { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },  // Yellow
                    'Critical': { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' }   // Red
                  };

                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, severity: level })}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '6px', cursor: 'pointer',
                        fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s',
                        background: isSelected ? colors[level].bg : 'var(--paper)',
                        color: isSelected ? colors[level].text : 'var(--ink-soft)',
                        border: `1.5px solid ${isSelected ? colors[level].border : 'var(--line-strong)'}`
                      }}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image Upload Input */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>Upload Photographic Evidence</label>
              <div style={{ position: 'relative' }}>
                <Camera size={18} style={{ ...iconStyle, color: 'var(--navy)' }} />
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{
                    ...inputStyle, paddingLeft: '42px', paddingTop: '10px', paddingBottom: '10px',
                    cursor: 'pointer', color: 'var(--ink-soft)'
                  }} 
                />
              </div>
              {formData.files.length > 0 && (
                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--sage)', fontWeight: '600' }}>
                  {formData.files.length} file(s) selected
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>Complaint Details</label>
              <textarea 
                name="message" 
                required 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="Describe the structural defect, delay, or issue in detail..." 
                style={{
                  width: '100%', padding: '16px', borderRadius: '6px', border: '1px solid var(--line-strong)',
                  background: 'var(--paper)', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  color: 'var(--ink)', outline: 'none', resize: 'vertical', minHeight: '120px', boxSizing: 'border-box'
                }} 
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                background: isSubmitting ? 'var(--line-strong)' : 'var(--navy)',
                color: '#fff', border: 'none', padding: '14px 24px', borderRadius: '6px',
                fontSize: '1.05rem', fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s', marginTop: '10px'
              }}
            >
              {isSubmitting ? 'Uploading Evidence...' : <><Send size={18} /> Register Complaint</>}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}