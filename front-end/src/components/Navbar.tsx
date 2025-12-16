import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

import icHome from "../assets/house.png";
import icGame from "../assets/game.png";
import icTrophy from "../assets/trophy.png";
import icWallet from "../assets/wallet.png";
import icSettings from "../assets/settings.png";
import icAccount from "../assets/account.png";

type UserBalance = {
  balance: number;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      // Fetch user balance if authenticated
      fetchBalance();
    }
  }, []);

  const fetchBalance = async () => {
    try {
      // Assuming your backend provides the balance in a GET request
      const response = await fetch("http://your-backend-api-url/user/balance", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data: UserBalance = await response.json();
      setUserBalance(data.balance);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const authLink = (value: "login" | "register") => {
    const params = new URLSearchParams(location.search);
    params.set("auth", value);
    return `${location.pathname}?${params.toString()}`;
  };

  return (
    <nav className="nvb">
      <div className="nvb__inner">
        {/* Left */}
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

        {/* Center */}
        <ul className="nvb__links">
          <li><NavLink to="/" end className="navlink">HOME</NavLink></li>
          <li><NavLink to="/games" className="navlink">GAMES</NavLink></li>
          <li><NavLink to="/promotions" className="navlink">PROMOTIONS</NavLink></li>
        </ul>

        {/* Right */}
        <div className="nvb__actions">
          {!isAuthenticated ? (
            <>
              <Link to={authLink("login")} className="btn btn--ghost">LOGIN</Link>
              <Link to={authLink("register")} className="btn btn--primary">REGISTER</Link>
            </>
          ) : (
            <Link to="/wallet" className="btn btn--primary">
              ACCOUNT
              {userBalance !== null && (
                <span className="ml-2 text-sm font-semibold">
                  ${userBalance.toFixed(2)} {/* Show the balance next to the Account label */}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>

      {/* Side menu (only visible when open) */}
      <aside className={`sideMenu ${open ? "show" : ""}`}>
        <div className="sideMenu__group">
          <NavLink to="/" end className="slink" onClick={() => setOpen(false)}>
            <i className="sicon"><img src={icHome} alt="Home" /></i> HOME
          </NavLink>
          <NavLink to="/games" className="slink" onClick={() => setOpen(false)}>
            <i className="sicon"><img src={icGame} alt="Games" /></i> GAMES
          </NavLink>
          <NavLink to="/promotions" className="slink" onClick={() => setOpen(false)}>
            <i className="sicon"><img src={icTrophy} alt="Promotions" /></i> PROMOTIONS
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
