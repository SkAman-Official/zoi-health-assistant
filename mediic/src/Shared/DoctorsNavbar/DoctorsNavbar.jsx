//src/Shared/DoctorsNavbar/DoctorsNavbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "/images/logo.png";
import Logo2 from "/images/logo2.png";
import "../DoctorsNavbar/DoctorsNavbar.css";
import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
const DoctorsNavbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Sticky header effect
  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => window.removeEventListener("scroll", isSticky);
  }, []);
  const isSticky = () => {
    const header = document.querySelector(".header-sticky");
    if (!header) return;
    const scrollTop = window.scrollY;
    scrollTop >= 250 ? header.classList.add("is-sticky") : header.classList.remove("is-sticky");
  };

  // Mobile menu handlers
  const menuBarRef = useRef(null);
  const offcanvasRef = useRef(null);
  const bodyOverlayRef = useRef(null);
  const closeBtnRef = useRef(null);
  useEffect(() => {
    if (menuOpen) closeBtnRef.current?.focus();
  }, [menuOpen]);
  useEffect(() => {
    const menuBar = menuBarRef.current;
    const offcanvas = offcanvasRef.current;
    const bodyOverlay = bodyOverlayRef.current;
    const closeBtn = closeBtnRef.current;
    const toggleMenu = action => {
      offcanvas.classList[action]("opened");
      bodyOverlay.classList[action]("apply");
      setMenuOpen(action === "add");
    };
    const openMenu = () => toggleMenu("add");
    const closeMenu = () => {
      toggleMenu("remove");
      menuBar?.focus();
    };
    const escapeMenu = event => {
      if (event.key === "Escape") {
        closeMenu();
        menuBar?.focus();
      }
    };
    if (menuBar && offcanvas && bodyOverlay && closeBtn) {
      menuBar.addEventListener("click", openMenu);
      closeBtn.addEventListener("click", closeMenu);
      bodyOverlay.addEventListener("click", closeMenu);
      offcanvas.addEventListener("keydown", escapeMenu);
      offcanvas.addEventListener("click", closeMenu);
    }
    return () => {
      if (menuBar && offcanvas && bodyOverlay && closeBtn) {
        menuBar.removeEventListener("click", openMenu);
        closeBtn.removeEventListener("click", closeMenu);
        bodyOverlay.removeEventListener("click", closeMenu);
        offcanvas.removeEventListener("keydown", escapeMenu);
        offcanvas.removeEventListener("click", closeMenu);
      }
    };
  }, []);

  // Doctor-specific navigation items
  const navItems = [{
    path: "/doctor-portal",
    label: "My Dashboard"
  },
  // New item added here
  {
    path: "/doctor-portal/appointments",
    label: "View Appointments"
  }, {
    path: "/doctor-portal/patients",
    label: "My Patients"
  }, {
    path: "/doctor-portal/profile",
    label: "My Profile"
  }];
  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorData");
    localStorage.removeItem("doctorName");
    navigate("/doctor-login");
  };
  return <nav data-lenis-prevent>
    {/* Offcanvas Mobile Menu */}
    <div className="offcanvas-area">
      <div ref={offcanvasRef} className="offcanvas" aria-hidden={!menuOpen} inert={!menuOpen ? "" : undefined}>
        <div className="offcanvas_close-btn">
          <button ref={closeBtnRef} className="close-btn" type="button" aria-label="Close navigation">
            <FaTimes />
          </button>
        </div>
        <div className="offcanvas_logo inline-block">
          <Link to="/doctor-portal">
            <img src={Logo2} draggable="false" alt="Doctor Portal" />
          </Link>
        </div>

        {/* Mobile Navigation Links */}
        <div className="main-menu-mobile lg:none">
          <nav className="main-menu-content">
            <ul>
              {navItems.map(item => <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/doctor-portal"}
                  className={({
                  isActive
                }) => isActive ? "active" : ""}
                >
                  {item.label}
                </NavLink>
              </li>)}
              <li>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
                  Log Out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    {/* Main Header */}
    <div ref={bodyOverlayRef} className="body-overlay"></div>
    <div className="header-area header-sticky py-5 lg:py-0">
      <div className="px-2 lg:px-[30px]">
        <div className="flex items-center justify-between lg:grid lg:grid-cols-12">
          {/* Logo */}
          <div className="col-span-3">
            <div className="header-logo inline-block">
              <Link to="/doctor-portal">
                {/* <img src={Logo} draggable="false" alt="Doctor Portal" /> */}
                <img src={Logo} draggable="false" alt="Main Logo" className="h-10 lg:h-12 object-contain" />
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="col-span-6 hidden lg:block">
            <div className="header-main-menu text-center">
              <nav className="main-menu-content">
                <ul>
                  {navItems.map(item => <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/doctor-portal"}
                      className={({
                      isActive
                    }) => isActive ? "active" : ""}
                    >
                      {item.label}
                    </NavLink>
                  </li>)}
                  <li>
                    <button onClick={handleLogout} className="text-red-500 hover:text-red-700 px-4 py-2 rounded-full bg-white shadow">
                      Log Out
                      </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="col-span-3">
            <div className="header-right-box flex items-center gap-10 lg:gap-0 justify-end">
              {/* Mobile Menu Button */}
              <div className="header-bar lg:hidden">
                <button ref={menuBarRef} className="menu-bar" type="button" aria-label="Open navigation" aria-expanded={menuOpen}>
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </div>

              {/* Desktop Additional Options */}
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>;
};
export default DoctorsNavbar;
