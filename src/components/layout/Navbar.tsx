import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        EdgeForge
      </Link>

      <div className="navbar-sport-links">
        <NavLink to="/nba" className={({ isActive }) => (isActive ? "active" : "")}>
          NBA
        </NavLink>
        <NavLink to="/nhl" className={({ isActive }) => (isActive ? "active" : "")}>
          NHL
        </NavLink>
        <NavLink to="/mlb" className={({ isActive }) => (isActive ? "active" : "")}>
          MLB
        </NavLink>
        <NavLink to="/articles" className={({ isActive }) => (isActive ? "active" : "")}>
          Articles
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? "active" : "")}>
          Leaderboard
        </NavLink>
      </div>

      <div className="navbar-actions">
        {loggedIn ? (
          <>
            <Link to="/dashboard">
              <Button type="text" style={{ color: "var(--text-secondary)" }}>
                Dashboard
              </Button>
            </Link>
            <Button
              type="primary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
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
      </div>
    </nav>
  );
}
