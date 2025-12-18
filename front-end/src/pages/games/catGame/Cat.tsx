import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./BettingPanel.css";
import Login from "../../Login";
import Register from "../../Register";
import BettingPanel from "../gameComponents/BettingPanel";
import Cat from "./CatGame";

// png imports
export default function Home() {
  
  const [betAmount, setBetAmount] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

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

    const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    // Add your game starting logic here
  };
  return (  
    <main className="home flex">
      <div className="flex justify-center items-center w-screen h-150">
        <div className="w-full justify-center items-center flex h-150">
          <BettingPanel betAmount={betAmount} setBetAmount={setBetAmount} startGame={startGame} gameOver={gameOver} gameStarted={gameStarted}>
            <div id="game-container" className="w-full h-full sm:rounded-none md:rounded-tr-2xl">
              <Cat />
            </div>
          </BettingPanel>
        </div>
      </div>
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
