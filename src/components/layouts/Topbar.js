import React, { useCallback, useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, NavLink } from "react-bootstrap";
import Scrollbar from "react-perfect-scrollbar";
import { LogoutApi } from "../api/endpoint";
import logo from "../../assets/img/dashboard/logo.jpeg";
import { UserContext } from "../../UserContext";
import './global.css'
function Topbar() {
  const { userName, role } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Define your searchable pages/routes
  const searchableItems = [
    { title: "Web Analytics", path: "/dashboard/web-analytics", icon: "flaticon-dashboard", category: "Dashboard" },
    { title: "Order Registration", path: "/order/order-reg", icon: "flaticon-list", category: "Orders" },
    { title: "Order status", path: "/order/order-status", icon: "flaticon-notepad", category: "Orders" },
    { title: "Register User", path: "/RegisterUser/", icon: "flaticon-user-plus", category: "Users" },
    { title: "User Table", path: "/Usertable/", icon: "flaticon-table", category: "Users" },
    { title: "Add Hospital", path: "/add-hospital/", icon: "flaticon-hospital", category: "Hospital" },
    { title: "Test Master", path: "/test/master/", icon: "flaticon-test-tube", category: "Tests" },
    { title: "Create Invoice", path: "/invoice/invoice", icon: "flaticon-file", category: "Invoice" },
    { title: "Invoice List", path: "/invoice/invoice-list", icon: "flaticon-list-1", category: "Invoice" },
    { title: "User Profile", path: "/prebuilt-pages/user-profile", icon: "flaticon-user", category: "Settings" },
    { title: "Email", path: "/apps/email", icon: "flaticon-mail", category: "Apps" },
    { title: "Lock Screen", path: "/prebuilt-pages/lock-screen", icon: "flaticon-security", category: "Security" },
  ];

  // Search function
  const handleSearch = (value) => {
    setSearchQuery(value);

    if (value.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const query = value.toLowerCase();
    const filtered = searchableItems.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );

    setSearchResults(filtered);
    setShowResults(true);
  };

  // Navigate to selected result
  const handleResultClick = (path) => {
    navigate(path);
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.ms-search-form')) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Toggle Left Navigation
  const navToggle = useCallback(() => {
    const body = document.getElementById("body");
    if (body) {
      if (window.innerWidth < 768) {
        body.classList.toggle("ms-aside-left-open");
      } else {
        body.classList.toggle("ms-aside-mini");
      }
    }
  }, []);

  // Toggle Top Options
  const optionsToggle = useCallback(() => {
    const navOptions = document.getElementById("ms-nav-options");
    if (navOptions) navOptions.classList.toggle("ms-slide-down");
  }, []);

  // Toggle Quickbar
  const quickbar = useCallback(() => {
    const body = document.getElementById("body");
    if (body) body.classList.toggle("ms-has-quickbar");
  }, []);

  // Logout Handler
  const logoutUser = async () => {
    try {
      if (userName) {
        await LogoutApi(userName); // call API
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local/session storage
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to Genelife website
      window.location.href = "https://genelifeplus.co.in";
    }
  };


  return (
    <nav className="navbar ms-navbar">
      <div className="d-flex align-items-center">
        <div className="ms-aside-toggler ms-toggler pl-0" onClick={navToggle} style={{ cursor: 'pointer' }}>
          <span className="ms-toggler-bar bg-primary" />
          <span className="ms-toggler-bar bg-primary" />
          <span className="ms-toggler-bar bg-primary" />
        </div>

        <div className="ml-2">
          <Link className="p-0" to="/">
            <img
              src={process.env.PUBLIC_URL + "/logo.png"}
              alt="logo"
              className="ms-logo-glow"
              style={{ maxHeight: "60px", width: "auto", objectFit: "contain" }}
            />
          </Link>
        </div>
      </div>

      <ul className="ms-nav-list ms-inline mb-0" id="ms-nav-options">
        <li className="ms-nav-item ms-search-form pb-0 py-0" style={{ position: "relative" }}>
          <form className="ms-form" onSubmit={(e) => e.preventDefault()}>
            <div className="ms-form-group my-0 mb-0 has-icon fs-14">
              <input
                type="search"
                className="ms-form-input"
                name="search"
                placeholder="Search pages, apps, settings..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <i className="flaticon-search text-disabled" />
            </div>
          </form>

          {/* Global Search Results Dropdown */}
          {showResults && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: "10px",
              background: "#fff",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 9999,
              maxHeight: "400px",
              overflowY: "auto",
              minWidth: "350px"
            }}>
              {searchResults.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#6c757d" }}>
                  <i className="flaticon-search" style={{ fontSize: "32px", opacity: 0.3 }} />
                  <p style={{ margin: "10px 0 0 0" }}>No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <>
                  <div style={{
                    padding: "10px 15px",
                    borderBottom: "1px solid #e9ecef",
                    background: "#f8f9fa",
                    fontWeight: "600",
                    fontSize: "13px"
                  }}>
                    {searchResults.length} Result{searchResults.length !== 1 ? 's' : ''} Found
                  </div>
                  {searchResults.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleResultClick(item.path)}
                      style={{
                        padding: "12px 15px",
                        cursor: "pointer",
                        borderBottom: index < searchResults.length - 1 ? "1px solid #f0f0f0" : "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8f9fa"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                    >
                      <div style={{
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#007bff",
                        color: "#fff",
                        borderRadius: "6px",
                        fontSize: "14px"
                      }}>
                        <i className={item.icon} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "600", fontSize: "14px", color: "#212529" }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          {item.category}
                        </div>
                      </div>
                      <i className="flaticon-right-arrow" style={{ fontSize: "12px", color: "#6c757d" }} />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </li>

        {/* MAIL ICON 
        <Dropdown className="ms-nav-item">
          <Dropdown.Toggle as={NavLink} className="text-disabled ms-has-notification">
            <i className="flaticon-mail" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-right">
            <li className="dropdown-menu-header">
              <h6 className="dropdown-header ms-inline m-0">
                <span className="text-disabled">Mail</span>
              </h6>
              <span className="badge badge-pill badge-success">3 New</span>
            </li>
            <li className="dropdown-divider" />
            <Scrollbar className="ms-scrollable ms-dropdown-list"></Scrollbar>
          </Dropdown.Menu>
        </Dropdown>

        
      
       <Dropdown className="ms-nav-item dropdown">
          <Dropdown.Toggle as={NavLink} className="text-disabled ms-has-notification">
            <i className="flaticon-bell" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu dropdown-menu-right"></Dropdown.Menu>
        </Dropdown>*/}

        {/* ONLINE/OFFLINE INDICATOR */}
        <li className="ms-nav-item m-0 display-none-sm" style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.12)',
          }}>
            {/* Pulsing dot */}
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isOnline ? '#28a745' : '#dc3545',
              boxShadow: isOnline
                ? '0 0 0 0 rgba(40,167,69,0.6)'
                : '0 0 0 0 rgba(220,53,69,0.6)',
              animation: 'pulseStatus 1.8s infinite',
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#fff',
              lineHeight: 1,
            }}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </li>

        {/* USER DROPDOWN */}
        <Dropdown className="ms-nav-item ms-nav-user dropdown">
          <Dropdown.Toggle as={NavLink} className="icon-none">
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.1)',
              float: 'right'
            }}>
              <img
                src={process.env.PUBLIC_URL + "/green.jpeg"}
                alt="people"
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain'
                }}
              />
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-menu-right user-dropdown">
            <li className="dropdown-menu-header">
              <h6 className="dropdown-header ms-inline m-0">
                <span style={{ marginLeft: "20px", fontWeight: "bold", fontSize: "16px" }}>
                  Welcome, {userName} ({role})
                </span>
              </h6>
            </li>

            <li className="dropdown-divider" />

            <li className="ms-dropdown-list">
              <Link className="media fs-14 p-2" to="/settings/account-settings">
                <span>
                  <i className="flaticon-gear mr-2" /> Account Settings
                </span>
              </Link>
            </li>

            <li className="dropdown-divider" />

            <li className="dropdown-menu-footer">
              <div className="media fs-14 p-2" onClick={logoutUser} style={{ cursor: "pointer" }}>
                <span>
                  <i className="flaticon-shut-down mr-2" /> Logout
                </span>
              </div>
            </li>
          </Dropdown.Menu>
        </Dropdown>
      </ul>

      <div className="ms-toggler ms-d-block-sm pr-0 ms-nav-toggler" onClick={optionsToggle}>
        <span className="ms-toggler-bar bg-primary" />
        <span className="ms-toggler-bar bg-primary" />
        <span className="ms-toggler-bar bg-primary" />
      </div>
    </nav>
  );
}

export default Topbar;