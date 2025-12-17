import React, { useEffect, useState } from "react";
import { Link, replace, useNavigate, useSearchParams } from "react-router-dom";
import "./Home.css";
import Login from "./Login";
import Register from "./Register";


// Paveiksliukai (keisk kelius/pavadinimus pagal save)
import hero from "../assets/home/hero.svg";
import gameCat from '../assets/games/game-cat.png';
import gameMice from '../assets/games/game-mice.png';
import gameTreat from '../assets/games/game-treat.png';
import gameMeowJack from '../assets/games/game-meowjack.png';


export default function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  useEffect(() => {
    const auth = searchParams.get("auth");
    setShowLogin(auth === "login");
    setShowRegister(auth === "register");
  }, [searchParams]);
  const closeAuthModal = () => {
    setShowLogin(false);
    setShowRegister(false);
    navigate("/", { replace: true }); // clears ?auth=...
  };
  return (  
    <main className="home">
      {/* HERO */}
      <Link to="/games" className="hero hero--clickable" aria-label="Play now – go to Games">
        <img src={hero} alt="" />
      </Link>

      {/* FEATURED GAMES */}
      <section className="featured">
        <div className="featured__hdr">
          <h2>FEATURED GAMES</h2>
        </div>

        <div className="games">
          <Link to="/games/cat" className="gamecard" aria-label="Play CAT">
            <img src={gameCat} alt="CAT game" />
          </Link>

          <Link to="/games/mice" className="gamecard" aria-label="Play MICE">
            <img src={gameMice} alt="MICE game" />
          </Link>

          <Link to="/games/treat" className="gamecard" aria-label="Play TREAT">
            <img src={gameTreat} alt="TREAT game" />
          </Link>

          <Link to="/games/meow-jack" className="gamecard" aria-label="Play MEOW-JACK">
            <img src={gameMeowJack} alt="MEOW-JACK game" />
          </Link>
        </div>
      </section>
      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
          <div className="modal__backdrop" onClick={closeAuthModal} />
          <div className="modal__panel">
            <button className="modal__close" onClick={closeAuthModal} aria-label="Close">×</button>
            <Login />
          </div> 
        </div>
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="register-title">
          <div className="modal__backdrop" onClick={closeAuthModal} />
          <div className="modal__panel">
            <button className="modal__close" onClick={closeAuthModal} aria-label="Close">×</button>
            <Register />
          </div>
        </div>
      )}
    </main>
  );
}
