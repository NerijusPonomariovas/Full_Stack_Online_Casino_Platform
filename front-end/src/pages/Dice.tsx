import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import BettingPanel from '../components/BettingPanelBlackJack';
import sliderBase from '../assets/Rectangle 62.png';
import sliderHandle from '../assets/btn.png';
import './Dice.css';
import logo from "../assets/LOGO.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

const Dice = () => {
  const [chance, setChance] = useState(50);
  const [markerValue, setMarkerValue] = useState(50);
  const [finalValue, setFinalValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [outcome, setOutcome] = useState<'win' | 'lose' | null>(null);
  const [betAmount, setBetAmount] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const HOUSE_EDGE = 0.05;
  const payout = useMemo(
    () => (chance > 0 ? ((100 / chance) * (1 - HOUSE_EDGE)).toFixed(2) : '∞'),
    [chance]
  );
  const clampToRange = (value: number) => Math.min(100, Math.max(1, Math.round(value)));
  const markerPercent = useMemo(() => Math.min(99, Math.max(1, markerValue)), [markerValue]);

  useEffect(() => {
    if (!isRolling && finalValue === null) {
      setMarkerValue(clampToRange(chance));
    }
  }, [chance, finalValue, isRolling]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    const auth = searchParams.get("auth");
    setShowLogin(auth === "login");
    setShowRegister(auth === "register");
  }, [searchParams]);
  const closeAuthModal = () => {
      setShowLogin(false);
      setShowRegister(false);
      navigate("/games/dice", { replace: true }); // clears ?auth=...
    };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
  };
  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    setOutcome(null);
    setFinalValue(null);
    setMarkerValue(clampToRange(chance));

    const animationSteps = 14;
    let step = 0;
    const interval = window.setInterval(() => {
      step += 1;
      const tempValue = clampToRange(Math.floor(Math.random() * 100) + 1);
      setMarkerValue(tempValue);
      if (step >= animationSteps) {
        window.clearInterval(interval);
        const roundedFinal = clampToRange(Math.floor(Math.random() * 100) + 1);
        setMarkerValue(roundedFinal);
        setFinalValue(roundedFinal);
        setOutcome(roundedFinal <= chance ? 'win' : 'lose');
        setIsRolling(false);
      }
    }, 70);
  };

  return (
    <main className="home h-screen overflow-hidden">
      {!isAuthenticated && (
        <div className="fixed inset-0 bg-gradient-to-b from-[#102c56] via-[#0b3a6f] to-[#081c36] bg-opacity-100 z-10 flex justify-center items-center">
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
      <div className="dice-page">
        <BettingPanel betAmount={betAmount} setBetAmount={setBetAmount} startGame={startGame} gameOver={gameOver} gameStarted={gameStarted}>
          <div className="dice-panel">
            <section className="dice-slider">
              <div
                className="chance-visual"
                style={{ '--chance-stop': `${chance}` } as CSSProperties}
              >
                <div
                  className="chance-track"
                  style={{ backgroundImage: `url(${sliderBase})` }}
                >
                  <div
                    className="chance-track-inner"
                    style={{

                      '--chance-stop': `${chance}`,
                    } as CSSProperties}
                  >
                    <div className="chance-value">
                      <span>{chance}%</span>
                    </div>
                    <div className="chance-lane">
                      <div
                        className={`chance-marker ${isRolling ? 'rolling' : outcome ?? ''}`}
                        style={{ '--marker-position': `${markerPercent}` } as CSSProperties}
                      >
                        <span>{markerValue}%</span>
                      </div>
                    </div>
                    <div className={`chance-handle ${isRolling ? 'rolling' : ''}`}>
                      <img src={sliderHandle} alt="Chance handle" draggable={false} />
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={5}
                  max={95}
                  value={chance}
                  onChange={(event) => setChance(Number(event.target.value))}
                  onInput={(event) => setChance(Number(event.currentTarget.value))}
                  className="chance-input"
                  aria-label="Adjust win probability"
                />
              </div>
              <div className="chance-labels">
                <span>
                  Winning chances <strong>{chance}%</strong>
                </span>
              </div>
            </section>

            <section className="dice-result">
              <div className="dice-actions">
                <button className="dice-roll" onClick={handleRoll} disabled={isRolling}>
                  {isRolling ? 'Rolling…' : 'Roll Dice'}
                </button>
                <div className={`dice-roll-value ${outcome ?? ''}`}>
                  <div className="dice-roll-value-header">
                    <span>Roll landed at</span>
                    <span className="dice-roll-value-number">
                      {finalValue !== null
                        ? `${finalValue}%`
                        : isRolling
                          ? 'Rolling…'
                          : '—'}
                    </span>
                  </div>
                  <div className="dice-roll-value-outcome">
                    {isRolling
                      ? ''
                      : finalValue !== null
                        ? outcome === 'win'
                          ? 'Win!'
                          : 'Lost...'
                        : 'Set your odds and roll the dice.'}
                  </div>
                </div>
              </div>
            </section>

          </div>
        </BettingPanel>
      </div>
      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
          <div className="modal__backdrop" onClick={closeAuthModal} />
          <div className="modal__panel">
            <button className="modal__close" onClick={closeAuthModal} aria-label="Close">
              ×
            </button>
            <Login />
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="register-title">
          <div className="modal__backdrop" onClick={closeAuthModal} />
          <div className="modal__panel">
            <button className="modal__close" onClick={closeAuthModal} aria-label="Close">
              ×
            </button>
            <Register />
          </div>
        </div>
      )}
    </main>
  );
};

export default Dice;
