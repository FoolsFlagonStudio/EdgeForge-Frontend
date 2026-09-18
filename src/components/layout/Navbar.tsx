import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import FeedbackButton from "./FeedbackButton";

const navLinks = [
  { to: "/nba", label: "NBA" },
  { to: "/nhl", label: "NHL" },
  { to: "/mlb", label: "MLB" },
  { to: "/wnba", label: "WNBA" },
  { to: "/nfl", label: "NFL" },
  { to: "/results", label: "Results" },
  { to: "/tools", label: "Tools" },
  { to: "/future", label: "Future" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          EdgeForge
          <span style={{
            fontSize: 10, fontWeight: 600, color: "var(--text-secondary)",
            marginLeft: 6, padding: "1px 5px",
            border: "1px solid var(--border-subtle)",
            borderRadius: 4, verticalAlign: "middle", letterSpacing: 0.5,
          }}>
            BETA
          </span>
        </Link>

        <div className="navbar-sport-links">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : "")}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-actions">
          <span className="navbar-feedback-desktop">
            <FeedbackButton />
          </span>
          <button
            className="navbar-hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="navbar-mobile-menu">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `navbar-mobile-link${isActive ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <div style={{ paddingTop: 12 }}>
            <FeedbackButton />
          </div>
        </div>
      )}
    </>
  );
}
