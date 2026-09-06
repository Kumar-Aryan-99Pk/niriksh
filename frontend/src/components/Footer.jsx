import React from 'react';
import { Mail, ExternalLink, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ 
      background: 'var(--paper)', 
      borderTop: '1px solid var(--line)', 
      padding: '60px 32px 20px',
      marginTop: 'auto',
      fontFamily: 'var(--font-body)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '40px',
        marginBottom: '40px'
      }}>
        
        {/* Brand Column */}
        <div style={{ flex: '1 1 300px' }}>
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontStyle: 'italic', 
            color: 'var(--navy)', 
            fontSize: '1.8rem', 
            fontWeight: '600', 
            marginBottom: '16px',
            textDecoration: 'underline',
            textUnderlineOffset: '4px'
          }}>
            Niriksh
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Making government data accessible, understandable, and actionable for every citizen.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            
            {/* Native SVG for Twitter / X */}
            <a href="#" className="social-icon" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
              </svg>
            </a>

            {/* Native SVG for GitHub */}
            <a href="#" className="social-icon" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>

            {/* Lucide Mail Icon */}
            <a href="#" className="social-icon" aria-label="Email">
              <Mail size={18} />
            </a>
            
          </div>
        </div>

        {/* Platform Links */}
        <div>
          <h4 className="footer-heading">PLATFORM</h4>
          <ul className="footer-links">
            <li><Link to="/">MPLADS Dashboard</Link></li>
            <li><Link to="/states">Browse States</Link></li>
            <li><Link to="/mps">Browse MPs</Link></li>
            <li><Link to="/compare">Compare MPs</Link></li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="footer-heading">COMPANY</h4>
          <ul className="footer-links">
            <li><Link to="#">About Us</Link></li>
            <li><Link to="#">FAQ</Link></li>
            <li><Link to="#">Privacy Policy</Link></li>
            <li><Link to="#">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Supported By */}
        {/* <div>
          <h4 className="footer-heading">SUPPORTED BY</h4>
          <a href="#" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            border: '1px solid var(--line-strong)',
            borderRadius: '4px',
            color: 'var(--ink)',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.95rem',
            marginBottom: '16px',
            transition: 'background 0.2s'
          }} className="support-box">
            Hackathon Partners <ExternalLink size={16} color="var(--ink-soft)" />
          </a>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
            Built as a social impact initiative
          </p>
        </div> */}
      </div>

      {/* Bottom Sections */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Data Source Strip */}
        <div style={{ 
          borderTop: '1px solid var(--line)', 
          borderBottom: '1px solid var(--line)', 
          padding: '16px 0', 
          textAlign: 'center',
          color: 'var(--ink-soft)',
          fontSize: '0.85rem'
        }}>
          Data sourced from official MPLADS portal • Last updated: 9/3/2026 • Next update: update due
        </div>

        {/* Copyright Strip */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          paddingTop: '24px',
          color: 'var(--ink-soft)',
          fontSize: '0.85rem',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <span>© 2026 Niriksh. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            
          </span>
        </div>
      </div>
    </footer>
  );
}