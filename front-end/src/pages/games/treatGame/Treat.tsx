import { useCallback, useEffect, useMemo, useState } from 'react';
import TreatBettingPanel from '../../../components/TreatBettingPanel';
import TreatBoard from './TreatBoard';
import type { TreatCellData } from './TreatCell';
import './Treat.css';
import Login from "../../Login";
import Register from "../../Register";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { updateWalletBalance } from "../../../api/auth";
import logo from "../../../assets/LOGO.svg";

const GRID_SIZE = 5;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
const DEFAULT_MINES = 3;

const createGrid = (mineCount: number): { grid: TreatCellData[][]; safeCells: number } => {
  const clampedMines = Math.min(Math.max(mineCount, 1), TOTAL_CELLS - 1);
  const minePositions = new Set<number>();

  while (minePositions.size < clampedMines) {
    minePositions.add(Math.floor(Math.random() * TOTAL_CELLS));
  }

  const grid: TreatCellData[][] = [];

  for (let row = 0; row < GRID_SIZE; row += 1) {
    const rowData: TreatCellData[] = [];
    for (let column = 0; column < GRID_SIZE; column += 1) {
      const index = row * GRID_SIZE + column;
      const isMine = minePositions.has(index);
      rowData.push({ value: isMine ? 0 : 1, isOpened: false });
    }
    grid.push(rowData);
  }

  return { grid, safeCells: TOTAL_CELLS - clampedMines };
};

const Treat = () => {
  const [betAmount, setBetAmount] = useState<number | null>(null);
  const [mineCount, setMineCount] = useState(DEFAULT_MINES);
  const [autoCashout, setAutoCashout] = useState(0);
  const [{ grid, safeCells }, setGridState] = useState(() => createGrid(DEFAULT_MINES));
  const [revealedSafes, setRevealedSafes] = useState(0);
  const [roundFinished, setRoundFinished] = useState(false);
  const [outcome, setOutcome] = useState<'win' | 'lose' | 'stopped' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [settled, setSettled] = useState(false);

  const gameActive = gameStarted && !roundFinished;
  const hasBet = betAmount !== null && betAmount > 0;

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    const auth = searchParams.get("auth");
    setShowLogin(auth === "login");
    setShowRegister(auth === "register");
  }, [searchParams]);

  const startGame = useCallback(() => {
    if (!hasBet) {
      setWarning('Please enter a bet to start playing.');
      return;
    }

    const clampedMines = Math.min(Math.max(mineCount, 1), TOTAL_CELLS - 1);
    setMineCount(clampedMines);
    setGridState(createGrid(clampedMines));
    setRevealedSafes(0);
    setOutcome(null);
    setRoundFinished(false);
    setGameStarted(true);
    setWarning(null);
    setSettled(false);
  }, [hasBet, mineCount]);
  const closeAuthModal = () => {
    setShowLogin(false);
    setShowRegister(false);
    navigate("/games/treat", { replace: true }); // clears ?auth=...
  };

  const disableReveals = useMemo(
    () => roundFinished,
    [roundFinished]
  );



  const handleReveal = useCallback(
    (rowIndex: number, columnIndex: number) => {
      if (roundFinished) return;

      if (!hasBet) {
        setWarning('Please enter a bet to play.');
        return;
      }

      if (!gameStarted) {
        setWarning('Press Play to start the round.');
        return;
      }

      setGridState((previous) => {
        const targetCell = previous.grid[rowIndex][columnIndex];
        if (targetCell.isOpened) return previous;

        const nextGrid = previous.grid.map((row, rIndex) =>
          row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === columnIndex ? { ...cell, isOpened: true } : cell))
        );

        const openedSafes = nextGrid.flat().filter((cell) => cell.isOpened && cell.value === 1).length;

        if (targetCell.value === 0) {
          setOutcome('lose');
          setRoundFinished(true);
          setGameStarted(false);
          const revealedGrid = nextGrid.map((row) => row.map((cell) => ({ ...cell, isOpened: true })));
          return { grid: revealedGrid, safeCells: previous.safeCells };
        } else {
          setRevealedSafes(openedSafes);
          setWarning(null);

          const autoTarget = autoCashout > 0 ? Math.min(autoCashout, previous.safeCells) : null;
          const clearedBoard = openedSafes >= previous.safeCells;
          const shouldAutoCash = autoTarget !== null && openedSafes >= autoTarget;

          if (shouldAutoCash || (clearedBoard && autoTarget !== null)) {
            setOutcome('win');
            setRoundFinished(true);
            setGameStarted(false);
            const revealedGrid = nextGrid.map((row) => row.map((cell) => ({ ...cell, isOpened: true })));
            return { grid: revealedGrid, safeCells: previous.safeCells };
          }
        }

        return { grid: nextGrid, safeCells: previous.safeCells };
      });
    },
    [autoCashout, gameStarted, hasBet, roundFinished]
  );

  const handleCashOut = useCallback(() => {
    if (!gameActive) return;

    setOutcome(revealedSafes === 0 ? 'stopped' : 'win');
    setRoundFinished(true);
    setGameStarted(false);
    setGridState((previous) => ({
      grid: previous.grid.map((row) => row.map((cell) => ({ ...cell, isOpened: true }))),
      safeCells: previous.safeCells,
    }));
  }, [gameActive, revealedSafes]);

  const multiplier = useMemo(() => {
    if (!hasBet) return 1;
    if (outcome === 'lose') return 0;
    if (outcome === 'stopped') return 1;

    const ratio = safeCells > 0 ? revealedSafes / safeCells : 0;
    const computed = 1 + ratio;
    return Number.isFinite(computed) ? computed : 1;
  }, [hasBet, outcome, revealedSafes, safeCells]);

  const profit = useMemo(() => {
    if (!hasBet) return 0;
    if (outcome === 'lose') {
      return 0;
    }
    if (outcome === 'stopped') {
      return 0;
    }
    const baseBet = betAmount ?? 0;
    const value = baseBet * multiplier - baseBet;
    return Number.isFinite(value) ? Number(value.toFixed(2)) : 0;
  }, [betAmount, hasBet, multiplier, outcome]);

  useEffect(() => {
    if (!roundFinished) return;
    if (settled) return;
    if (!hasBet || betAmount == null || outcome == null) return;

    setSettled(true);
    if (outcome === 'lose') {
      const finalValue = betAmount.toFixed(2).toString();
      updateWalletBalance(finalValue!, "loss");
      console.log("Final Value on Lose:", finalValue);
      setTimeout(() => {
        window.dispatchEvent(new Event("balance:refresh"));
      }, 50);
      return;
    } 
    if (outcome === 'win') {
      const finalValue = (betAmount * multiplier - betAmount).toFixed(2).toString();
      console.log("Final Value on Win:", finalValue);
      updateWalletBalance(finalValue!, "win");
      setTimeout(() => {
        window.dispatchEvent(new Event("balance:refresh"));
      }, 50);
      return;
    }
  }, [roundFinished, settled, hasBet, betAmount, outcome, multiplier]);

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
      <div className='home flex'>
        <TreatBettingPanel
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          startGame={startGame}
          gameOver={roundFinished}
          gameStarted={gameStarted}
          gameActive={gameActive}
          onCashOut={handleCashOut}
          autoCashout={autoCashout}
          setAutoCashout={(value) => setAutoCashout(Math.max(0, Math.min(value, TOTAL_CELLS)))}
          mineCount={mineCount}
          setMineCount={setMineCount}
          profit={profit}
          multiplier={multiplier}
        >
          <div className="treat-layout">
            <div className="treat-controls">
            </div>

            <div className="treat-content">
              <TreatBoard grid={grid} onReveal={handleReveal} disabled={disableReveals} />

              {warning && (
                <p className="treat-warning">{warning}</p>
              )}

              <div className="treat-stats">
                <p>
                  Safe picks: {revealedSafes}/{safeCells}
                </p>
                {outcome && (
                  <p className={`treat-outcome treat-outcome--${outcome}`}>
                    {outcome === 'win' ? 'You win!' : outcome === 'stopped' ? 'Game was stopped.' : 'You hit a trap!'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </TreatBettingPanel>
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
      </div>
    </main>
  );
};

export default Treat;
