import { useEffect, useRef, useState } from "react";
import { BallManager } from "./plinko/classes/BallManager";
import { WIDTH, HEIGHT } from "./plinko/constants";
import { pad } from "./plinko/padding";
//import axios from "axios";
import BettingPanel from "../components/BettingPanelPlinko";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchWalletBalance } from "../api/auth";
import Login from "./Login";
import Register from "./Register";
import logo from "../assets/LOGO.svg";
//import { baseURL } from "../utils/index";
import { updateWalletBalance } from "../api/auth";

export default function PlinkoGame() {
  const [ballManager, setBallManager] = useState<BallManager>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [balance, setBalance] = useState<number>(0.0);
  const [betAmount, setBetAmount] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const auth = searchParams.get("auth");
    setShowLogin(auth === "login");
    setShowRegister(auth === "register");

    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token)
    console.log(token)
  }, [searchParams]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      const getBalance = async () => {
        const result = await fetchWalletBalance();
        if ('balance' in result) {
          setBalance(result.balance);
          console.log('Account Balance in plinko:', result.balance);
        } else {
          console.error("Failed to fetch wallet balance:", result.message);
        }
      };
      getBalance();
      // Fetch user balance if authenticated
    }
  }, []);

  const closeAuthModal = () => {
    setShowLogin(false);
    setShowRegister(false);
    navigate("/games/meow-jack", { replace: true }); // clears ?auth=...
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const parent = canvas.parentElement ?? canvas;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const parentWidth = parent.clientWidth || WIDTH; // fallback to logical width
      const scale = parentWidth / WIDTH;
      const displayWidth = Math.round(parentWidth);
      const displayHeight = Math.round(HEIGHT * scale);

      // Set CSS display size to maintain aspect ratio responsively
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      // Set internal pixel buffer according to scale and devicePixelRatio
      canvas.width = Math.round(WIDTH * 1.6 * dpr);
      canvas.height = Math.round(HEIGHT * scale * dpr);

      // Map logical drawing coordinates (0..WIDTH/HEIGHT) to the scaled canvas
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
    };

    // Initial sizing
    resize();

    // Observe parent size changes to keep canvas in sync
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    window.addEventListener('resize', resize);

    const manager = new BallManager(canvas as HTMLCanvasElement);
    setBallManager(manager);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', resize);
      manager.stop();
    };
  }, [canvasRef]);

  const resetGame = () => {
    setGameOver(false);
    setGameStarted(true);
    // Additional reset logic if needed
  }

  const dropBall = () => {
    if (!ballManager) return;

    // Use WIDTH / 2.055 for both obstacles and sinks to keep perfect alignment
    const spacing = 50;
    const centerBase = WIDTH / 2.07; // align with createSinks()
    const sinkCenters = Array.from({ length: 17 }, (_, i) => centerBase + spacing * (i - 8));
    const halfSpan = spacing * 8;
    const minX = centerBase - halfSpan + 5;
    const maxX = centerBase + halfSpan - 5;

    // Per-sink weights (left to right) based on requested drop chances.
    // Multipliers order: [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16]
    // Requested percents: 0.5x 19.638, 1x 17.456, 1.2x 6.665, 1.4x first 2.777, second 0.854, 2x 0.183, 9x 0.024, 16x 0.002
    // Weights mirror requested percentages, split across duplicated multipliers
    const weights = [
      0.002,    // 16x
      0.024,    // 9x
      0.183,   // 2x
      0.854,    // 1.4x (outer)
      2.777,   // 1.4x (inner)
      6.665,   // 1.2x
      12.219,     // 1.1x (small)
      17.456,    // 1x
      19.638,   // 0.5x (most common)
      17.456,    // 1x
      12.219,     // 1.1x (small)
      6.665,   // 1.2x
      2.777,   // 1.4x (inner)
      0.854,    // 1.4x (outer)
      0.183,   // 2x
      0.024,    // 9x
      0.002     // 16x
    ];

    const total = weights.reduce((sum, w) => sum + w, 0);
    const r = Math.random() * total;
    let acc = 0;
    let chosen = sinkCenters[0];
    let chosenIndex = 0;
    for (let i = 0; i < weights.length; i++) {
      acc += weights[i];
      if (r < acc) {
        chosen = sinkCenters[i];
        chosenIndex = i;
        break;
      }
    }

    const clamped = Math.max(minX, Math.min(maxX, chosen));

    // Debug: log which sink is being targeted
    const multipliers = [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16];
    console.log(`Targeting sink ${chosenIndex} (${multipliers[chosenIndex]}x), weight: ${weights[chosenIndex]}`);
    console.log(`All sink positions: ${sinkCenters.map((x, i) => `[${i}]=${x.toFixed(1)}`).join(', ')}`);
    const finalValue = (betAmount!*multipliers[chosenIndex] - betAmount!).toFixed(2).toString();
    updateWalletBalance(finalValue, "win");
    // BallManager expects padded coordinates; pad the chosen center and pass target index
    ballManager.addBall(pad(clamped), chosenIndex);
  };

  const handleCanvasClick = () => {
    dropBall();
    console.log(balance);
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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(180deg, #0A1F3D 0%, #1E3A5F 100%)' }}>
        <div className="flex flex-col lg:flex-row items-center justify-center w-full">
          <BettingPanel betAmount={betAmount} setBetAmount={setBetAmount} startGame={resetGame} gameOver={gameOver} gameStarted={gameStarted}>
            <div className="w-full h-full sm:rounded-none md:rounded-tr-2xl self-start flex justify-center relative">
              <canvas
                ref={canvasRef}
                className="plinko-canvas w-full"
                style={{
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  display: 'block'
                }}
                onClick={handleCanvasClick}
              />
            </div>
          </BettingPanel>
        </div>
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
}