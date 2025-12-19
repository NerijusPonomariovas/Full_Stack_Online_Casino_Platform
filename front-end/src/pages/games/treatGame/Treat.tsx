import { useCallback, useMemo, useState } from 'react';
import TreatBettingPanel from '../../../components/TreatBettingPanel';
import TreatBoard from './TreatBoard';
import type { TreatCellData } from './TreatCell';
import './Treat.css';

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

  const gameActive = gameStarted && !roundFinished;
  const hasBet = betAmount !== null && betAmount > 0;

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
  }, [hasBet, mineCount]);

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
  if (outcome === 'lose') return 0;
  if (outcome === 'stopped') return 0;

    const baseBet = betAmount ?? 0;
    const value = baseBet * multiplier;
    return Number.isFinite(value) ? Number(value.toFixed(2)) : 0;
  }, [betAmount, hasBet, multiplier, outcome]);

  return (
    <div className="treat-page">
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
    </div>
  );
};

export default Treat;
