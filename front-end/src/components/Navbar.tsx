import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

import icHome from "../assets/house.png";
import icGame from "../assets/game.png";
import icTrophy from "../assets/trophy.png";
import icWallet from "../assets/wallet.png";
import icSettings from "../assets/settings.png";
import icAccount from "../assets/account.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

    const authLink = (value: "login" | "register") => {
    const params = new URLSearchParams(location.search);
    params.set("auth", value);
    return `${location.pathname}?${params.toString()}`;
  };

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
          <Link to="/?auth=login" className="btn btn--ghost">LOGIN</Link>
          <Link to="/?auth=register" className="btn btn--primary">REGISTER</Link>
        </div>
      </div>

      {/* KAIRINIS MENIU (vienintelis) */}
      <aside className={`sideMenu ${open ? "show" : ""}`}>

        <div className="sideMenu__group">
          <NavLink to="/" end className="slink" onClick={() => setOpen(false)}>
            <i className="sicon"><img src={icHome} alt="Home" /></i> HOME
          </NavLink>
          <NavLink to="/games" className="slink" onClick={() => setOpen(false)}>
            <i className="sicon"><img src={icGame} alt="Games" /></i> GAMES
          </NavLink>
          <NavLink to="/promotions" className="slink" onClick={() => setOpen(false)}>
            <i className="sicon"><img src={icTrophy} alt="Promotions" /></i> PROMOTION
          </NavLink>
        </div>

        <div className="sideMenu__divider" />

        <div className="sideMenu__group">
          <button className="slink btnlike" onClick={() => setOpen(false)}>
            <i className="sicon"><img src={icWallet} alt="Wallet" /></i> WALLET
          </button>
          <button className="slink btnlike" onClick={() => setOpen(false)}>
            <i className="sicon"><img src={icSettings} alt="Settings" /></i> SETTINGS
          </button>
          <button className="slink btnlike" onClick={() => setOpen(false)}>
            <i className="sicon"><img src={icAccount} alt="Account" /></i> ACCOUNT
          </button>
        </div>
      </aside>

      {open && <div className="sideMenu__backdrop" onClick={() => setOpen(false)} />}
    </nav>
  );
}
