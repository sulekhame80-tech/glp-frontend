

import React, { useContext, useEffect, useState } from 'react';
import Scrollbar from 'react-perfect-scrollbar';
import { Accordion, NavLink } from 'react-bootstrap';
import './global.css';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';

function Sidenav() {
  const { userName, role } = useContext(UserContext);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const finalRole = (role || localStorage.getItem("role") || "").trim();

  const navToggle = (e) => {
    if (e) e.stopPropagation();
    const body = document.getElementById('body');
    if (body) {
      if (window.innerWidth < 768) {
        body.classList.toggle('ms-aside-left-open');
      } else {
        body.classList.toggle('ms-aside-mini');
      }
    }
    document.getElementById('overlayleft')?.classList.toggle('d-block');
  };

  // Expand sidebar from mini mode — called by Accordion.Toggle (dropdown headers)
  const expandSidebar = () => {
    const body = document.getElementById('body');
    if (body && window.innerWidth >= 768 && body.classList.contains('ms-aside-mini')) {
      body.classList.remove('ms-aside-mini');
    }
  };

  // On mobile: close the flyout when a link is clicked. On desktop: do nothing (stay expanded).
  const handleLinkClick = () => {
    setActiveAccordion(null); // close any open dropdown
    const body = document.getElementById('body');
    if (body && window.innerWidth < 768) {
      body.classList.remove('ms-aside-left-open');
    }
    // Desktop — sidebar stays expanded; only the hamburger collapses it
  };

  // Listen for outside clicks to also close the dropdown when sidebar minimizes
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const nav = document.getElementById('ms-side-nav');
      const toggler = document.querySelector(".ms-aside-toggler");
      if (nav && !nav.contains(e.target) && toggler && !toggler.contains(e.target)) {
        setActiveAccordion(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <React.Fragment>
      <div className="ms-aside-overlay ms-overlay-left ms-toggler" id="overlayleft" onClick={navToggle} />
      <Scrollbar id="ms-side-nav" className="side-nav fixed ms-aside-scrollable ms-aside-left">

        <Accordion
          className="accordion ms-main-aside fs-14"
          id="side-nav-accordion"
          activeKey={activeAccordion}
          onSelect={(key) => setActiveAccordion(key)}
        >

          {/* Dashboard — direct link */}
          <li className="menu-item">
            <Link to="/dashboard/web-analytics" className="menu-link" onClick={handleLinkClick}>
              <i className="material-icons fs-16">dashboard</i>
              <span className="ms-nav-text"> Dashboard</span>
            </Link>
          </li>

          {/* Routine — dropdown */}
          {(finalRole === 'Super Admin' || finalRole === 'Manager') && (
            <li className="menu-item">
              <Accordion.Toggle as={NavLink} variant="link" eventKey="6" className="has-chevron" onClick={expandSidebar}>
                <span><i className="fas fa-receipt" /><span className="ms-nav-text"> Routine</span></span>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="6">
                <ul>
                  <li><Link to="/patient-profile" onClick={handleLinkClick}>Patient Profile</Link></li>
                  <li><Link to="/routine-status" onClick={handleLinkClick}>Routine Bill</Link></li>
                </ul>
              </Accordion.Collapse>
            </li>
          )}

          {/* Orders — dropdown */}
          <li className="menu-item">
            <Accordion.Toggle as={NavLink} variant="link" eventKey="1" className="has-chevron" onClick={expandSidebar}>
              <span><i className="fas fa-clipboard-list" /><span className="ms-nav-text"> Orders</span></span>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <ul>
                {(finalRole === 'Super Admin' || finalRole === 'Manager') && (
                  <li><Link to="/order/order-reg" onClick={handleLinkClick}>Registered Order</Link></li>
                )}
                <li><Link to="/order/order-status" onClick={handleLinkClick}>Order Status</Link></li>
                <li><Link to="/bills/" onClick={handleLinkClick}>Bill Generate</Link></li>
                {(finalRole === 'Super Admin' || finalRole === 'Manager') && (
                  <li><Link to="/order/order-report/" onClick={handleLinkClick}>Report</Link></li>
                )}
              </ul>
            </Accordion.Collapse>
          </li>

          {/* Manage User — dropdown */}
          {(finalRole === 'Super Admin' || finalRole === 'Manager') && (
            <li className="menu-item">
              <Accordion.Toggle as={NavLink} variant="link" eventKey="2" className="has-chevron" onClick={expandSidebar}>
                <span><i className="fas fa-users" /><span className="ms-nav-text"> Manage User</span></span>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="2">
                <ul>
                  <li><Link to="/RegisterUser/" onClick={handleLinkClick}>Create User</Link></li>
                  <li><Link to="/Usertable/" onClick={handleLinkClick}>User Data</Link></li>
                </ul>
              </Accordion.Collapse>
            </li>
          )}


          {finalRole === 'Employee' && (
            <li className="menu-item">
              <Link to="/profile" onClick={handleLinkClick}>
                <span><i className="fas fa-user-circle" /><span className="ms-nav-text"> Profile</span></span>
              </Link>
            </li>
          )}

          {/* Invoice — dropdown */}
          {(finalRole === 'Super Admin' || finalRole === 'Manager') && (
            <li className="menu-item">
              <Accordion.Toggle as={NavLink} variant="link" eventKey="4" className="has-chevron" onClick={expandSidebar}>
                <span><i className="fas fa-receipt" /><span className="ms-nav-text"> Invoice</span></span>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="4">
                <ul>
                  <li><Link to="/invoice/invoice" onClick={handleLinkClick}>Invoice</Link></li>
                  <li><Link to="/invoice/invoice-list" onClick={handleLinkClick}>Invoice-List</Link></li>
                  <li><Link to="/invoice-monthly" onClick={handleLinkClick}>Monthly Invoice</Link></li>
                </ul>
              </Accordion.Collapse>
            </li>
          )}

          {/* Manage Hospitals — direct link */}
          {(finalRole === 'Super Admin' || finalRole === 'Manager' || finalRole === 'Employee') && (
            <li className="menu-item">
              <Link to="/add-hospital/" onClick={handleLinkClick}>
                <span><i className="far fa-plus-square" /><span className="ms-nav-text"> Manage Hospitals</span></span>
              </Link>
            </li>
          )}

          {/* Manage Test — direct link */}
          {(finalRole === 'Super Admin' || finalRole === 'Manager') && (
            <li className="menu-item">
              <Link to="/test/master/" className="menu-link" onClick={handleLinkClick}>
                <span><i className="fas fa-cannabis" /><span className="ms-nav-text"> Manage Test</span></span>
              </Link>
            </li>
          )}

          {/* Attendance — direct link */}
          {(finalRole === 'Super Admin' || finalRole === 'Manager') && (
            <li className="menu-item">
              <Link to="/attendance" className="menu-link" onClick={handleLinkClick}>
                <span><i className="fas fa-calendar-check" /><span className="ms-nav-text"> Attendance</span></span>
              </Link>
            </li>
          )}

        </Accordion>
      </Scrollbar>
    </React.Fragment>
  );
}

export default Sidenav;
