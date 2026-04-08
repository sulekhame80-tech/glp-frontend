import React, { useState, useEffect } from 'react';
import './LandingPage.css';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleLoginRedirect = () => {
        window.location.href = '/login';
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        setSubmitted(true);
        
        // Construct professional mailto URL for redirect with data
        const subject = encodeURIComponent(`GENELIFE PLUS: Collection Request from ${formData.name} (${formData.phone})`);
        
        const emailBody = 
`GENELIFE PLUS DIAGNOSTIC LABORATORY
==========================================
NEW CONTACT / HOME COLLECTION REQUEST
==========================================

PATIENT DETAILS:
----------------
Name    : ${formData.name}
Phone   : ${formData.phone}
Email   : ${formData.email || 'Not Provided'}

REQUEST DETAILS:
----------------
${formData.message}

------------------------------------------
Submitted on: ${new Date().toLocaleString()}
Source      : GeneLife Plus Official Website
==========================================`;
        
        const mailtoUrl = `mailto:genelifeplusho@gmail.com?subject=${subject}&body=${encodeURIComponent(emailBody)}`;
        
        // Show success message briefly before redirecting to mail app
        setTimeout(() => {
            setSubmitted(false);
            window.location.href = mailtoUrl;
            setFormData({ name: '', phone: '', email: '', message: '' });
        }, 1500);
    };

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const services = [
        { icon: '🧬', name: 'All Pathology' },
        { icon: '🩸', name: 'Haematology' },
        { icon: '🔬', name: 'Molecular Genetic' },
        { icon: '🎗️', name: 'Oncology' },
        { icon: '🦠', name: 'Serology' },
        { icon: '🤱', name: 'Pre & Post Natal Screening' },
        { icon: '💉', name: 'Immunology' },
        { icon: '🧫', name: 'Cytogenetic' },
        { icon: '🦟', name: 'Infection Disease' },
        { icon: '🧪', name: 'Exome Sequencing' },
        { icon: '🩺', name: 'Genetic Counselling' },
    ];

    const diagnosticPanels = [
        { icon: '❤️', title: 'Cardiac Panel', desc: 'Comprehensive heart health diagnostics' },
        { icon: '🫘', title: 'Kidney Function Tests', desc: 'Complete renal panel analysis' },
        { icon: '🤰', title: 'Prenatal Care', desc: 'Pre & post natal screening' },
        { icon: '🧬', title: 'Genetic Sequencing', desc: 'Full exome & genome analysis' },
        { icon: '🔬', title: 'Microscopy Analysis', desc: 'Advanced lab diagnostics' },
        { icon: '🩺', title: 'Clinical Counseling', desc: 'Expert genetic consultation' },
    ];

    return (
        <div className="glp-landing">

            {/* ─── NAVBAR ─── */}
            <nav className={`glp-navbar${scrolled ? ' scrolled' : ''}`}>
                <div className="glp-nav-container">
                    {/* Logo – click scrolls to top */}
                    <button className="glp-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="GENELIFE Plus Home">
                        <img src={process.env.PUBLIC_URL + '/logo.png'} alt="GENELIFE Plus Logo" className="glp-logo-img" />
                        <span className="glp-brand-name">GENELIFE <span className="glp-brand-plus">Plus</span></span>
                    </button>

                    {/* Sign In only */}
                    <button className="glp-btn-login" onClick={handleLoginRedirect} id="navbar-signin-btn">
                        <span className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '6px' }}></span>
                        Sign In
                    </button>
                </div>
            </nav>

            {/* ─── HERO ─── */}
            <section className="glp-hero" id="hero">
                <div className="glp-hero-grid" aria-hidden="true">
                    {[...Array(64)].map((_, i) => <div key={i} className="glp-grid-cell" />)}
                </div>
                <div className="glp-hero-content">
                    <div className="glp-hero-text">
                        <div className="glp-hero-badge">🏥 Certified Diagnostic Laboratory</div>
                        <h1 className="glp-hero-title">
                            GENELIFE Plus:<br />
                            <span className="glp-gradient-text">Your Partner in Complete</span><br />
                            Laboratory Services
                        </h1>
                        <p className="glp-hero-sub">Modern Diagnostics, Trusted Care. Right at your location.</p>
                        <div className="glp-hero-trust">
                            <div className="glp-trust-item"><span className="glp-trust-icon">🏢</span><div><strong>UDYAM</strong><small>TN-11-0043691</small></div></div>
                            <div className="glp-trust-item"><span className="glp-trust-icon">📋</span><div><strong>GST IN</strong><small>33FRGPS4137A1Z0</small></div></div>
                            <div className="glp-trust-item"><span className="glp-trust-icon">📧</span><div><strong>Email</strong><small>genelifeplusho@gmail.com</small></div></div>
                        </div>
                        <div className="glp-hero-actions">
                            <button className="glp-btn-primary" onClick={() => scrollToSection('contact')}>
                                🏠 Request Home Collection
                            </button>
                            <button className="glp-btn-outline" onClick={() => scrollToSection('services')}>
                                Our Services ↓
                            </button>
                        </div>
                    </div>
                    <div className="glp-hero-visual">
                        <div className="glp-hero-card">
                            <div className="glp-hero-card-icon">🧬</div>
                            <h3>Advanced Genetic Testing</h3>
                            <p>Comprehensive genomic analysis with clinical precision</p>
                            <div className="glp-hero-stats">
                                <div><strong>11+</strong><span>Service Areas</span></div>
                                <div><strong>3</strong><span>Locations</span></div>
                                <div><strong>24/7</strong><span>Support</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="glp-hero-wave" aria-hidden="true">
                    <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
                        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f0f8ff" />
                    </svg>
                </div>
            </section>

            {/* ─── SERVICES ─── */}
            <section className="glp-section glp-services" id="services">
                <div className="glp-container">
                    <div className="glp-section-header">
                        <span className="glp-badge-pill">🔬 Our Expertise</span>
                        <h2>Our Service Scope</h2>
                        <p>Complete Range of Laboratory Services</p>
                    </div>

                    <div className="glp-services-grid" style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {services.map((svc, i) => (
                            <div className="glp-service-card" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                                <div className="glp-service-icon">{svc.icon}</div>
                                <h4>{svc.name}</h4>
                            </div>
                        ))}
                    </div>

                    <div className="glp-features-grid">
                        <div className="glp-feature-card">
                            <div className="glp-feature-icon">🏥</div>
                            <h3>Master Health Checkup & Specialized Packages</h3>
                            <p>Comprehensive wellness packages tailored for all age groups and health conditions.</p>
                        </div>
                        <div className="glp-feature-card">
                            <div className="glp-feature-icon">🧬</div>
                            <h3>Pre & Post Report Genetic Counseling</h3>
                            <p>Expert genetic counselors guide you through understanding your test results.</p>
                        </div>
                        <div className="glp-feature-card">
                            <div className="glp-feature-icon">🛵</div>
                            <h3>Home Sample Collection Available</h3>
                            <p>Convenient doorstep sample collection service at your preferred time.</p>
                        </div>
                        <div className="glp-feature-card">
                            <div className="glp-feature-icon">🧠</div>
                            <h3>Psychology Counselling Therapy Session Available</h3>
                            <p>Professional mental health support integrated with your diagnostic journey.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── DIAGNOSTICS ─── */}
            <section className="glp-section glp-diagnostics" id="diagnostics">
                <div className="glp-container">
                    <div className="glp-section-header light">
                        <span className="glp-badge-pill light">🩺 Clinical Excellence</span>
                        <h2>Visual Diagnostic Panel</h2>
                        <p>Genetic Counselling — Clinical and Laboratory Approach</p>
                    </div>
                    <div className="glp-diag-grid">
                        {diagnosticPanels.map((panel, i) => (
                            <div className="glp-diag-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                                <div className="glp-diag-hex">
                                    <div className="glp-diag-icon">{panel.icon}</div>
                                </div>
                                <h4>{panel.title}</h4>
                                <p>{panel.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="glp-counseling-banner">
                        <div className="glp-counseling-left">
                            <span className="glp-badge-pill">👨‍👩‍👧 Featured</span>
                            <h3>Genetic Counseling</h3>
                            <h4>Clinical and Laboratory Approach</h4>
                            <p>Our certified genetic counselors provide comprehensive pre- and post-test counseling, helping families understand complex genetic information and make informed decisions about their healthcare journey.</p>
                            <button className="glp-btn-primary" onClick={() => scrollToSection('contact')}>Book a Session</button>
                        </div>
                        <div className="glp-counseling-right">
                            <div className="glp-counseling-stats">
                                {/* <div className="glp-cstat"><div className="glp-cstat-num">500+</div><div className="glp-cstat-label">Families Counseled</div></div> */}
                                <div className="glp-cstat"><div className="glp-cstat-num">11</div><div className="glp-cstat-label">Specializations</div></div>
                                <div className="glp-cstat"><div className="glp-cstat-num">98%</div><div className="glp-cstat-label">Patient Satisfaction</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── PARTNERSHIP ─── */}
            <section className="glp-section glp-partnership" id="partnership">
                <div className="glp-container">
                    <div className="glp-section-header">
                        <span className="glp-badge-pill">🤝 Authorized Partner</span>
                        <h2>Diagnostic Partner</h2>
                        <p>Authorised Franchise Centre for</p>
                    </div>

                    <div className="glp-partner-showcase">
                        <div className="glp-partner-logo-box" style={{ maxWidth: '800px' }}>
                            <div className="glp-medgenome-logo">
                                <span className="glp-medgenome-icon">🧬</span>
                                <div>
                                    <strong>MEDGENOME</strong>
                                    <small>DIAGNOSTIC LABORATORY</small>
                                </div>
                            </div>
                            {/* <p className="glp-partner-desc" style={{ textAlign: 'left', marginBottom: '20px' }}>
                                MedGenome is a leading genomics company in India operating South Asia's largest CAP and NABL-accredited laboratory, having processed over 5 million tests. They provide comprehensive, high-quality genetic diagnostic services in oncology, reproductive health, and inherited diseases. Authorized partnership with MedGenome ensures access to specialized, evidence-based genomic insights.
                            </p> */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left', background: 'rgba(255,255,255,0.5)', padding: '20px', borderRadius: '12px' }}>
                                <div>
                                    <h4 style={{ color: '#1565c0', fontSize: '0.9rem', marginBottom: '8px' }}>🏥 Certifications</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#546e7a' }}>CAP & NABL Accredited (South Asia's Largest)</p>
                                </div>
                                <div>
                                    <h4 style={{ color: '#1565c0', fontSize: '0.9rem', marginBottom: '8px' }}>🔬 Expertise</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#546e7a' }}>Oncology, Reproductive Health & Inherited Diseases</p>
                                </div>
                                <div>
                                    <h4 style={{ color: '#1565c0', fontSize: '0.9rem', marginBottom: '8px' }}>🎓 Experience</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#546e7a' }}>Over 10 years in genomics expertise</p>
                                </div>
                                <div>
                                    <h4 style={{ color: '#1565c0', fontSize: '0.9rem', marginBottom: '8px' }}>👨‍⚕️ Network</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#546e7a' }}>Trusted by 24,000+ clinicians & 8,000+ hospitals</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glp-locations">
                        <div className="glp-section-header">
                            <h3>Available Locations</h3>
                            <p>Services @ HOSUR / KRISHNAGIRI / BANGALORE</p>
                        </div>
                        <div className="glp-locations-grid">
                            {['HOSUR', 'KRISHNAGIRI', 'BANGALORE'].map((city, i) => (
                                <div className="glp-location-card" key={i}>
                                    <div className="glp-location-icon">📍</div>
                                    <h4>{city}</h4>
                                    <p>GeneLife Plus Service Center</p>
                                    <div className="glp-location-badge">Active Location</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CONTACT ─── */}
            <section className="glp-section glp-contact" id="contact">
                <div className="glp-container">
                    <div className="glp-section-header light">
                        <span className="glp-badge-pill light">📞 Get In Touch</span>
                        <h2>Contact & Appointments</h2>
                        <p>Request a home collection or book an appointment today</p>
                    </div>

                    <div className="glp-contact-grid">
                        <div className="glp-contact-form-wrap">
                            <h3>Send Us a Message</h3>
                            {submitted && <div className="glp-success-msg">✅ Thank you! Redirecting to your mail app...</div>}
                            <form className="glp-contact-form" onSubmit={handleFormSubmit}>
                                <div className="glp-form-row">
                                    <div className="glp-form-group">
                                        <label>Full Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Your Full Name" required />
                                    </div>
                                    <div className="glp-form-group">
                                        <label>Phone Number</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Your Phone Number" required />
                                    </div>
                                </div>
                                <div className="glp-form-group">
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="your@email.com" />
                                </div>
                                <div className="glp-form-group">
                                    <label>Message / Request</label>
                                    <textarea name="message" value={formData.message} onChange={handleFormChange} rows={4} placeholder="Tell us about your test requirements or appointment request..." required></textarea>
                                </div>
                                <button type="submit" className="glp-btn-primary w-full">🏠 Request Home Collection</button>
                            </form>
                        </div>

                        <div className="glp-contact-info">
                            <h3>Contact Details</h3>
                            <div className="glp-contact-card">
                                <div className="glp-contact-item">
                                    <div className="glp-ci-icon">📧</div>
                                    <div>
                                        <strong>Email Us</strong>
                                        <a href="mailto:genelifeplusho@gmail.com">genelifeplusho@gmail.com</a>
                                    </div>
                                </div>
                                <div className="glp-contact-item">
                                    <div className="glp-ci-icon">📞</div>
                                    <div>
                                        <strong>Support Line 1</strong>
                                        <a href="tel:+919626262630">96262 62630 / 76393 93689</a>
                                    </div>
                                </div>
                                <div className="glp-contact-item">
                                    <div className="glp-ci-icon">📞</div>
                                    <div>
                                        <strong>Support Line 2</strong>
                                        <a href="tel:+919994494111">99944 94111 / 90036 76366</a>
                                    </div>
                                </div>
                                <div className="glp-contact-item">
                                    <div className="glp-ci-icon">📍</div>
                                    <div>
                                        <strong>Locations</strong>
                                        <span>Hosur · Krishnagiri · Bangalore</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glp-quick-links">
                                <button className="glp-btn-outline dark" onClick={() => scrollToSection('services')}>📋 View All Services</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="glp-footer">
                <div className="glp-container">
                    <div className="glp-footer-top">
                        <div className="glp-footer-brand" style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <img src={process.env.PUBLIC_URL + '/logo.png'} alt="GENELIFE Plus" className="glp-footer-logo" style={{ width: '100px', height: '100px' }} />
                            <span>GENELIFE <strong>Plus</strong></span>
                        </div>
                        <div className="glp-footer-links">
                            <button onClick={() => scrollToSection('services')}>Services</button>
                            <button onClick={() => scrollToSection('diagnostics')}>Diagnostics</button>
                            <button onClick={() => scrollToSection('partnership')}>Locations</button>
                            <button onClick={() => scrollToSection('contact')}>Contact</button>
                            {/* <button onClick={handleLoginRedirect}>Sign In</button> */}
                        </div>
                    </div>
                    <div className="glp-footer-bottom">
                        <div className="glp-footer-legal">
                            <span>UDYAM: TN-11-0043691</span>
                            <span>GST IN: 33FRGPS4137A1Z0</span>
                            <span>© {new Date().getFullYear()} GENELIFE Plus. All rights reserved.</span>
                            <div className="glp-footer-powered" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', opacity: '0.8' }}>
                                <span style={{ fontSize: '12px', marginRight: '10px' }}>Powered by</span>
                                <img src={process.env.PUBLIC_URL + '/cc.png'} alt="Campus Connection" style={{ height: '30px', width: 'auto' }} />
                            </div>
                        </div>
                        <div className="glp-footer-contact">
                            <a href="mailto:genelifeplusho@gmail.com">genelifeplusho@gmail.com</a>
                            <a href="tel:+919626262630">96262 62630</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
