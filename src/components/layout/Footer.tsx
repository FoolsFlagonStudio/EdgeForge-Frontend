import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>EdgeForge</div>
          <div>Sports analytics & picks platform</div>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <Link to="/terms" className="footer-link">Terms</Link>
          <Link to="/privacy" className="footer-link">Privacy</Link>
          <Link to="/disclaimer" className="footer-link">Disclaimer</Link>
          <Link to="/pricing" className="footer-link">Pricing</Link>
        </div>
      </div>
    </footer>
  );
}
