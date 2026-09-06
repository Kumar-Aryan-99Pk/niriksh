import React, { useState } from 'react';
import { MessageSquare, Send, User, Mail, Tag, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Citizen',
    type: 'General Feedback',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for the hackathon demo
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
        <div className="card" style={{ textAlign: 'center', padding: '48px 32px', maxWidth: '500px', width: '100%' }}>
          <CheckCircle2 size={64} color="var(--sage)" style={{ marginBottom: '24px' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', fontSize: '2rem', marginBottom: '16px' }}>Feedback Received</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '32px' }}>
            Thank you for helping us improve Niriksh. Your report has been securely logged and will be reviewed by the nodal administrative team.
          </p>
          <button 
            onClick={() => { setIsSubmitted(false); setFormData({ ...formData, message: '' }); }}
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
            Help Us Improve Civic Transparency.
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '32px' }}>
            Whether you have encountered a bug, have a feature request for the AI Copilot, or want to report a discrepancy in the constituency data, your feedback ensures Niriksh remains an uncompromised source of truth.
          </p>

          <div style={{ background: 'var(--paper-alt)', padding: '24px', borderRadius: '8px', borderLeft: '4px solid var(--gold)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--navy)', marginBottom: '8px', fontSize: '0.95rem' }}>
              <ShieldAlert size={18} color="var(--gold)" /> Secure Reporting
            </h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
              Data discrepancy reports are prioritized by the AI Risk Engine and routed directly to the Central Audit Nodal Officer.
            </p>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="card" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={iconStyle} />
                  <input type="text" name="name" required value={formData.name} onChange={handleChange}  style={inputStyle} />
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
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>Your Role</label>
                <div style={{ position: 'relative' }}>
                  <Tag size={18} style={iconStyle} />
                  <select name="role" value={formData.role} onChange={handleChange} style={{...inputStyle, paddingLeft: '42px', cursor: 'pointer', WebkitAppearance: 'none'}}>
                    <option value="Citizen">Citizen</option>
                    <option value="Nodal Officer">Nodal Officer</option>
                    <option value="Auditor">Independent Auditor</option>
                    <option value="Vendor">Agency/Vendor</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>Feedback Type</label>
                <div style={{ position: 'relative' }}>
                  <FileText size={18} style={iconStyle} />
                  <select name="type" value={formData.type} onChange={handleChange} style={{...inputStyle, paddingLeft: '42px', cursor: 'pointer', WebkitAppearance: 'none'}}>
                    <option value="General Feedback">General Feedback</option>
                    <option value="Data Discrepancy">Data Discrepancy</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="System Bug">System Bug</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>Message / Details</label>
              <textarea 
                name="message" 
                required 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="Please provide specific details..." 
                style={{
                  width: '100%', padding: '16px', borderRadius: '6px', border: '1px solid var(--line-strong)',
                  background: 'var(--paper)', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  color: 'var(--ink)', outline: 'none', resize: 'vertical', minHeight: '150px', boxSizing: 'border-box'
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
              {isSubmitting ? 'Submitting Report...' : <><Send size={18} /> Submit Feedback</>}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}