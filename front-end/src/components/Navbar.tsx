import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

/* ——— Paprastos inline SVG icons */
const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconGames = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/>
    <polygon points="10,8 16,12 10,16" fill="currentColor"/>
  </svg>
);
const IconTrophy = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 21h8M9 17h6M6 4h12v4a6 6 0 0 1-12 0V4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6H4a3 3 0 0 0 3 3M18 6h2a3 3 0 0 1-3 3" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const IconWallet = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 7h14a2 2 0 0 1 2 2v8H5a2 2 0 0 1-2-2V7Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M19 10h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2v-4Z" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 7l13-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconGear = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M19.4 15a7.9 7.9 0 0 0 .2-2 7.9 7.9 0 0 0-.2-2l2.1-1.6-2-3.4-2.5 1a7.8 7.8 0 0 0-3.4-2l-.4-2.7h-4l-.4 2.7a7.8 7.8 0 0 0-3.4 2l-2.5-1-2 3.4L4.6 11a7.9 7.9 0 0 0-.2 2 7.9 7.9 0 0 0 .2 2l-2.1 1.6 2 3.4 2.5-1a7.8 7.8 0 0 0 3.4 2l.4 2.7h4l.4-2.7a7.8 7.8 0 0 0 3.4-2l2.5 1 2-3.4L19.4 15Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 21a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nvb">
      <div className="nvb__inner">
        {/* KAIRĖ */}
        <div className="nvb__left">
          <button
            className={`nvb__burger ${open ? "is-open" : ""}`}
            aria-label="Toggle menu"
            onClick={() => setOpen(v => !v)}
          >
            <span />
          </button>

          <Link to="/" className="nvb__brand">
            <img src={logo} alt="Cataris logo" />
          </Link>
        </div>

        {/* CENTRAS */}
        <ul className="nvb__links">
          <li><NavLink to="/" end className="navlink">HOME</NavLink></li>
          <li><NavLink to="/games" className="navlink">GAMES</NavLink></li>
          <li><NavLink to="/promotions" className="navlink">PROMOTIONS</NavLink></li>
        </ul>

        {/* DEŠINĖ */}
        <div className="nvb__actions">
          <Link to="/login" className="btn btn--ghost">LOGIN</Link>
          <Link to="/register" className="btn btn--primary">REGISTER</Link>
        </div>
      </div>

      {/* KAIRINIS MENIU (vienintelis) */}
      <aside className={`sideMenu ${open ? "show" : ""}`}>

        <div className="sideMenu__group">
          <NavLink to="/" end className="slink" onClick={() => setOpen(false)}>
            <i className="sicon"><IconHome/></i> HOME
          </NavLink>
          <NavLink to="/games" className="slink" onClick={() => setOpen(false)}>
            <i className="sicon"><IconGames/></i> GAMES
          </NavLink>
          <NavLink to="/promotions" className="slink" onClick={() => setOpen(false)}>
            <i className="sicon"><IconTrophy/></i> PROMOTION
          </NavLink>
        </div>

        <div className="sideMenu__divider" />

        <div className="sideMenu__group">
          <button className="slink btnlike" onClick={() => setOpen(false)}>
            <i className="sicon"><IconWallet/></i> WALLET
          </button>
          <button className="slink btnlike" onClick={() => setOpen(false)}>
            <i className="sicon"><IconGear/></i> SETTINGS
          </button>
          <button className="slink btnlike" onClick={() => setOpen(false)}>
            <i className="sicon"><IconUser/></i> ACCOUNT
          </button>
        </div>
      </aside>

      {open && <div className="sideMenu__backdrop" onClick={() => setOpen(false)} />}
    </nav>
  );
}
