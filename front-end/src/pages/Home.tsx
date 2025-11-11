import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./Home.css";
import Login from "./Login";
import Register from "./Register";


// Paveiksliukai (keisk kelius/pavadinimus pagal save)
import hero from "../assets/home/hero.jpg";
import imgCat from "../assets/home/game-cat.png";
import imgMice from "../assets/home/game-mice.png";
import imgTreat from "../assets/home/game-treat.png";
import imgMeow from "../assets/home/game-meowjack.png";

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
          {/* jei prireiks rodyklei vėliau – čia vieta */}
        </div>

        <div className="games">
          <Link to="/games/cat" className="gamecard" aria-label="Play CAT">
            <img src={imgCat} alt="CAT game" />
          </Link>

          <Link to="/games/mice" className="gamecard" aria-label="Play MICE">
            <img src={imgMice} alt="MICE game" />
          </Link>

          <Link to="/games/treat" className="gamecard" aria-label="Play TREAT">
            <img src={imgTreat} alt="TREAT game" />
          </Link>

          <Link to="/games/meow-jack" className="gamecard" aria-label="Play MEOW-JACK">
            <img src={imgMeow} alt="MEOW-JACK game" />
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
