import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Avatar, Button, Dropdown } from "antd";
import { UserOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { supabase } from "../../lib/supabase";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";
import type { MeResponse } from "../../types/users";
import FeedbackButton from "./FeedbackButton";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      apiFetch<MeResponse>(API_ROUTES.me).then(setMe).catch(() => {});
    } else {
      setMe(null);
    }
  }, [loggedIn]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const dropdownItems = [
    { key: "/profile", label: <Link to="/profile">Profile</Link> },
    { key: "/settings", label: <Link to="/settings">Settings</Link> },
    { type: "divider" as const },
    { key: "logout", label: "Logout", danger: true, onClick: handleLogout },
  ];

  const navLinks = [
    { to: "/nba", label: "NBA" },
    { to: "/nhl", label: "NHL" },
    { to: "/mlb", label: "MLB" },
    { to: "/articles", label: "Articles" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/promos", label: "Promos" },
    ...(loggedIn ? [{ to: "/analytics", label: "Analytics" }] : []),
  ];

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
          <span className="navbar-auth-desktop">
            {!loggedIn && (
              <>
                <Link to="/register">
                  <Button type="text" style={{ color: "var(--text-secondary)" }}>
                    Register
                  </Button>
                </Link>
                <Link to="/login">
                  <Button type="primary">Login</Button>
                </Link>
              </>
            )}
          </span>
          {loggedIn && (
            <Dropdown
              menu={{ items: dropdownItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Avatar
                size={34}
                src={me?.avatar_url ?? undefined}
                icon={<UserOutlined />}
                style={{
                  cursor: "pointer",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                }}
              />
            </Dropdown>
          )}
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
          {!loggedIn && (
            <div style={{ display: "flex", gap: 10, paddingTop: 16 }}>
              <Link to="/register" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
                <Button type="default" block style={{ color: "var(--text-secondary)" }}>
                  Register
                </Button>
              </Link>
              <Link to="/login" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
                <Button type="primary" block>Login</Button>
              </Link>
            </div>
          )}
          <div style={{ paddingTop: 12 }}>
            <FeedbackButton />
          </div>
        </div>
      )}
    </>
  );
}
