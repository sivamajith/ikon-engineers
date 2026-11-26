import { useState, useEffect } from 'react'
import { CO, NAV } from './data.js'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      // Toggle compact/floating state on scroll
      setIsScrolled(window.scrollY > 25)

      // Section spy for highlighting current section
      const sections = ['contact', 'clients', 'services', 'about']
      const scrollPos = window.scrollY + 220
      let found = ''
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollPos) {
          found = id
          break
        }
      }
      setActiveSection(found)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <header className={`navbar-root ${isScrolled ? 'is-scrolled' : ''}`}>
      {/* Tier 1: Micro Utility Status Bar */}
      <div className="navbar-utility-bar">
        <div className="wrap utility-wrap">
          <div className="utility-left">
            <span className="live-status-pill">
              <span className="live-status-dot">
                <span className="live-ping"></span>
                <span className="live-core"></span>
              </span>
              <span className="utility-badge-text">AUTOMOTIVE & INDUSTRIAL PLANT SPECIALISTS</span>
            </span>
            <span className="utility-sep">•</span>
            <span className="utility-loc">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Padappai, Chennai
            </span>
          </div>

          <div className="utility-right">
            <div className="utility-item gst-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>GST: {CO.gst}</span>
            </div>
            <a href={`tel:+91${CO.phone}`} className="utility-link" aria-label="Call IKON Engineers">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91 {CO.phone}</span>
            </a>
            <a href={`mailto:${CO.email}`} className="utility-link utility-email" aria-label="Email IKON Engineers">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>{CO.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tier 2: Floating Frosted Main Navigation Bar */}
      <div className="navbar-main-container">
        <div className="wrap">
          <nav className="navbar-island" aria-label="Main Navigation">
            {/* Brand Logo & Precision Badge */}
            <a href="#top" className="brand-lockup" aria-label="IKON Engineers Home">
              <div className="brand-logo-badge">
                <img
                  src="/img/logo.png"
                  alt="IKON Engineers Logo"
                  width="145"
                  height="32"
                  className="brand-logo-img"
                />
              </div>
              <div className="brand-text-block">
                <div className="brand-title">IKON ENGINEERS</div>
                <div className="brand-subtitle">
                  <span className="brand-est-dot"></span>
                  <span>EST. 2018 • INDUSTRIAL PLANT SOLUTIONS</span>
                </div>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="nav-desktop-menu">
              <div className="nav-links-dock">
                {NAV.map(([id, label]) => {
                  const isActive = activeSection === id
                  return (
                    <a
                      key={id}
                      href={`#${id}`}
                      className={`nav-pill-link ${isActive ? 'active' : ''}`}
                    >
                      {isActive && <span className="nav-pill-glow"></span>}
                      <span className="nav-link-text">{label}</span>
                      {isActive && <span className="nav-active-pip"></span>}
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Right Action Cluster: Direct Dial */}
            <div className="nav-actions-cluster">
              <a
                href={`tel:+91${CO.phone}`}
                className="nav-quick-call"
                title={`Call ${CO.phone}`}
              >
                <div className="quick-call-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="quick-call-info">
                  <span className="quick-call-label">QUICK ENQUIRY</span>
                  <span className="quick-call-number">+91 {CO.phone}</span>
                </div>
              </a>

              {/* Animated Mobile Hamburger Button */}
              <button
                type="button"
                className={`nav-hamburger ${isOpen ? 'is-active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation Menu"
                aria-expanded={isOpen}
              >
                <span className="hamburger-box">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Fullscreen Glass Drawer */}
      <div className={`nav-mobile-overlay ${isOpen ? 'is-open' : ''}`} onClick={() => setIsOpen(false)}>
        <div className="nav-mobile-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-drawer-header">
            <div className="mobile-brand">
              <img src="/img/logo.png" alt="IKON Engineers" height="28" />
              <div className="mobile-brand-meta">
                <span className="live-core"></span>
                <span>Automotive Specialists</span>
              </div>
            </div>
            <button
              className="mobile-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="mobile-drawer-body">
            <div className="mobile-nav-links">
              {NAV.map(([id, label], index) => {
                const isActive = activeSection === id
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mobile-link-num">0{index + 1}</span>
                    <span className="mobile-link-title">{label}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mobile-chevron">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </a>
                )
              })}
            </div>

            <div className="mobile-drawer-footer">
              <a
                href="#contact"
                className="mobile-cta-btn"
                onClick={() => setIsOpen(false)}
              >
                <span>Request a Project Quote</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>

              <div className="mobile-contact-card">
                <div className="mobile-contact-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <a href={`tel:+91${CO.phone}`}>+91 {CO.phone}</a>
                </div>
                <div className="mobile-contact-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <a href={`mailto:${CO.email}`}>{CO.email}</a>
                </div>
                <div className="mobile-contact-meta">
                  <span>GST: {CO.gst}</span>
                  <span>•</span>
                  <span>Padappai, Chennai</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
