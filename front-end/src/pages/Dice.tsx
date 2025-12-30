import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import BettingPanelDice from '../components/BettingPanelDice';
import sliderBase from '../assets/Dice/Rectangle 62.svg';
import sliderHandle from '../assets/Dice/btn.svg';
import './Dice.css';
import logo from "../assets/LOGO.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import { updateWalletBalance } from "../api/auth";
import { fetchWalletBalance } from "../api/auth";
import { refreshBalance } from "../components/refreshBalance";

const Dice = () => {
  const [chance, setChance] = useState(50);
  const [markerValue, setMarkerValue] = useState(50);
  const [finalValue, setFinalValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [outcome, setOutcome] = useState<'win' | 'loss' | null>(null);
  const [payoutAmount, setPayoutAmount] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [balance, setBalance] = useState<number>(0.0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [accountBalance, setAccountBalance] = useState<number | null>(null);

  const HOUSE_EDGE = 0.05;
  const multiplier = useMemo(
    () => (chance > 0 ? Number(((100 / chance) * (1 - HOUSE_EDGE)).toFixed(2)) : Infinity),
    [chance]
  );
  const clampToRange = (value: number) => Math.min(100, Math.max(1, Math.round(value)));
  const markerPercent = useMemo(() => Math.min(99, Math.max(1, markerValue)), [markerValue]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      const getBalance = async () => {
        const result = await fetchWalletBalance();
        if ('balance' in result) {
          setBalance(result.balance);
          console.log('Account Balance in Dice:', result.balance);
        } else {
          console.error("Failed to fetch wallet balance:", result.message);
        }
      };
      getBalance();
      // Fetch user balance if authenticated
    }
  }, []);

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

  const handleRoll = (): Promise<'win' | 'loss'> => {
    if (isRolling) return Promise.resolve(outcome ?? 'loss');
    const wager = betAmount ?? 0;
    setGameStarted(true);
    setGameOver(false);
    setIsRolling(true);
    setOutcome(null);
    setPayoutAmount(null);
    setFinalValue(null);
    setMarkerValue(clampToRange(chance));
    console.log(balance);
    const animationSteps = 14;
    let step = 0;

    return new Promise((resolve) => {
      const interval = window.setInterval(() => {
        step += 1;
        const tempValue = clampToRange(Math.floor(Math.random() * 100) + 1);
        setMarkerValue(tempValue);
        if (step >= animationSteps) {
          window.clearInterval(interval);
          const roundedFinal = clampToRange(Math.floor(Math.random() * 100) + 1);
          const didWin = roundedFinal <= chance;

          setMarkerValue(roundedFinal);
          setFinalValue(roundedFinal);
          setOutcome(didWin ? 'win' : 'loss');

          const payout = didWin && wager > 0 ? Number((wager * multiplier).toFixed(2)) : 0;
          setPayoutAmount(payout);
          setIsRolling(false);
          setGameStarted(false);
          setGameOver(true);
          resolve(didWin ? 'win' : 'loss');
          if (didWin) {
            const finalValue = payout - betAmount!;
            updateWalletBalance(finalValue.toString(), "win");
            console.log("WIN update wallet balance called");
            setTimeout(() => {
              window.dispatchEvent(new Event("balance:refresh"));
            }, 50);
          } else {
            updateWalletBalance(wager.toFixed(2).toString(), "loss");
            console.log("LOSS update wallet balance called");
            setTimeout(() => {
              window.dispatchEvent(new Event("balance:refresh"));
            }, 50);
          }
        }
      }, 70);
    });
  };

  return (
    <main className="home flow">
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
      <div className="dice-page">
        <BettingPanelDice betAmount={betAmount} setBetAmount={setBetAmount} startGame={handleRoll} gameOver={gameOver} gameStarted={gameStarted} multiplier={multiplier}>
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
                          ? `Win! Payout ${payoutAmount !== null ? payoutAmount : '—'}`
                          : 'Lost...'
                        : 'Set your odds and roll the dice.'}
                  </div>
                </div>
              </div>
            </section>

          </div>
        </BettingPanelDice>
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