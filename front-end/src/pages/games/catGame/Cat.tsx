import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./BettingPanel.css";
import Login from "../../Login";
import Register from "../../Register";
import BettingPanel from "../gameComponents/BettingPanel";
import Cat from "./CatGame";
import logo from "../../../assets/LOGO.svg";
import cat from "../../../assets/games/game-cat.png";

// png imports
export default function Home() {

  const [betAmount, setBetAmount] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    // Add your game starting logic here
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);
  return (
    <main className="home min-h-screen">
      {!isAuthenticated && (
        <div className="fixed inset-0 bg-linear-to-b from-[#102c56] via-[#0b3a6f] to-[#081c36] bg-opacity-100 z-10 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-11/12 sm:w-96 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-16 h-auto" // Adjust the size of your logo
                />
                <p className="text-xl ml-4 text-gray-700">Please log in to play the game!</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center items-center w-screen min-h-screen">
        <div className="w-full justify-center items-center flex h-150">
          <BettingPanel betAmount={betAmount} setBetAmount={setBetAmount} startGame={startGame} gameOver={gameOver} gameStarted={gameStarted}>
            <div id="game-container" className="w-full h-full sm:rounded-none md:rounded-t-2xl">
              <Cat />
            </div>
          </BettingPanel>
        </div>
      </div>
      {/* DESCRIPTION CARD UNDER GAME */}
      <section className="mt-8 w-full max-w-[1200px] mx-auto px-4 pb-10">
        <div className="rounded-2xl bg-[#0f2f57]/80 shadow-xl border border-white/10 p-6">
          <div className="flex items-center gap-6">
            <h2 className="text-white text-2xl font-extrabold tracking-wide">
              CAT
            </h2>
            <span className="text-white/60 font-semibold text-sm">
              CATARIS ORIGINAL
            </span>
          </div>

          <div className="mt-4 text-white/90 font-semibold">Description</div>

          <div className="mt-3 flex gap-6 flex-col md:flex-row">
            {/* LEFT IMAGE */}
            <img
              src={cat}
              alt="Logo"
              className="w-[140px] md:w-[140px] h-auto rounded-xl shadow-lg"
            />

            {/* TEXT */}
            <p className="text-white/80 leading-8 text-lg">
              MEOW-JACK is Cataris Casino’s modern take on the classic blackjack experience, blending familiar rules with a clean, intuitive interface and fast-paced gameplay. Designed for both casual players and seasoned strategists, the game delivers a smooth, responsive flow where every decision matters. Clear visuals, balanced odds, and instant feedback ensure an engaging experience from the first hand to the last card.
            </p>
          </div>

          {/* SECTIONS */}
          <div className="mt-6 space-y-5">
            <div>
              <h3 className="text-white font-bold">GamePlay</h3>
              <p className="mt-2 text-white/75 leading-6 text-md">
                The objective is simple: beat the dealer by reaching a hand value closer to 21 without exceeding it. Players can hit, stand, and strategically manage their moves based on probability and risk. MEOW-JACK follows traditional blackjack mechanics while maintaining a streamlined structure that keeps rounds efficient and immersive.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold">Strategy & Fairness</h3>
              <p className="mt-2 text-white/75 leading-6 text-md">
                MEOW-JACK is built around transparent mechanics and predictable rules, allowing players to rely on strategy rather than chance alone. Card values, dealer behavior, and payouts are clearly defined, giving players full control over their decisions. The game logic ensures fair outcomes while rewarding smart play and calculated risk.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold">Cataris Original</h3>
              <p className="mt-2 text-white/75 leading-6 text-md">
                As a Cataris original title, MEOW-JACK reflects our commitment to clean design, reliable performance, and player-first mechanics. No unnecessary complexity - just a refined blackjack experience built for modern online play.
              </p>
            </div>
          </div>
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
