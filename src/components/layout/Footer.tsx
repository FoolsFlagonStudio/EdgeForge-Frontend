import { Link } from "react-router-dom";

// TODO: fill in real URLs — left as "#" placeholders so nothing fake ships.
const DISCORD_INVITE_URL = "#";
const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "X", href: "#" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>EdgeForge</div>
          <div>Sports analytics & picks platform</div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <a href={DISCORD_INVITE_URL} className="footer-link" target="_blank" rel="noreferrer">
              Discord
            </a>
            {SOCIAL_LINKS.map((s) => (
              <a key={s.label} href={s.href} className="footer-link" target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <Link to="/terms" className="footer-link">Terms</Link>
          <Link to="/privacy" className="footer-link">Privacy</Link>
          <Link to="/disclaimer" className="footer-link">Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
}
