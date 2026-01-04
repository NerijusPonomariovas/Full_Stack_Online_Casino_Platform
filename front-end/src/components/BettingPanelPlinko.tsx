import { useEffect, useState, type ReactNode } from "react";
import { fetchWalletBalance } from "../api/auth";

type BettingPanelProps = {
  children?: ReactNode;
  betAmount: number | null;
  setBetAmount: (amount: number | null) => void;
  startGame: () => void;
  dropBall: () => void;
  gameOver: boolean;
};


export default function BettingPanel({ children, betAmount, setBetAmount, startGame, dropBall, gameOver }: BettingPanelProps) {
  const [balance, setBalance] = useState<number>(0.0); // Example balance, replace with actual fetched balance
  const [mode, setMode] = useState("manual");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [betPlaced, setBetPlaced] = useState<boolean>(false); // Track if the bet is placed


  useEffect(() => {
    const token = localStorage.getItem("token");
    const authenticated = !!token
    setIsAuthenticated(authenticated);

    if (!authenticated) return;

    const getBalance = async () => {
      const result = await fetchWalletBalance();
      if ('balance' in result) {
        setBalance(parseFloat(result.balance.toFixed(2)));
        console.log('Account Balance in BettingPanel:', result.balance);
      } else {
        console.error("Failed to fetch wallet balance:", result.message);
      }
    };
    getBalance();

    const handleBalanceRefresh = () => {
      getBalance();
    }
    // Fetch user balance if authenticated
    window.addEventListener("balance:refresh", handleBalanceRefresh);

    return () => {
      window.removeEventListener("balance:refresh", handleBalanceRefresh);
    }
  }, []);


  const isGoButtonActive = betAmount !== null && betAmount > 0 && !gameOver && betAmount <= balance;
  const hasEnoughBalance =
    isAuthenticated &&
    betAmount !== null &&
    betAmount > 0 &&
    betAmount <= balance;

  const isBoardActive = betPlaced && hasEnoughBalance;
  const handleGoButtonClick = () => {
    if(!hasEnoughBalance || gameOver) return;

    // Locally deduct to prevent rapid clicks driving balance negative before refresh
    if (betAmount !== null) {
      setBalance((prev) => Math.max(0, prev - betAmount));
    }

    startGame();
    setBetPlaced(true);
    // Align ball drop with balance refresh timing
    setTimeout(() => dropBall(), 300);
  };

  useEffect(() => {
    if (gameOver) {
      //setBetPlaced(true); // Reset bet placed status when game is over
      setBetAmount(null); // Optionally reset bet amount

    }
  }, [gameOver, setBetAmount]);

  const shouldShowOverlay = betAmount === null;
  

  return (
    <div className="w-full max-w-full relative mt-5 md:mt-10 flex flex-col drop-shadow-2xl">
      <div className="flex flex-col md:flex-row h-auto">
        {/* LEFT PANEL */}
        <div className="w-full md:w-56 lg:w-64 bg-[#1c5ec3] text-white rounded-t-4xl md:rounded-tl-4xl md:rounded-tr-none p-3 md:p-4 space-y-3 shrink-0">
          {/* Toggle Manual / Auto */}
          <div className="flex bg-[#102c56] rounded-4xl overflow-hidden h-10 md:h-12 w-full items-center pl-1 pr-1">
            <button
              className={`flex-1 rounded-4xl h-[82%] text-sm md:text-base cursor-pointer transition-colors ${mode === "manual" ? "bg-[#184fa2]" : ""
                }`}
              onClick={() => setMode("manual")}
            >
              Manual
            </button>
            <button
              className={`flex-1 rounded-4xl h-[82%] text-sm md:text-base cursor-pointer transition-colors ${mode === "auto" ? "bg-[#184fa2]" : ""
                }`}
              onClick={() => setMode("auto")}
            >
              Auto
            </button>
          </div>

          {/* Bet Amount */}
          <div>
            <label className="text-xs md:text-sm text-gray-200">Bet Amount</label>
            <div className="flex mt-1 p-0.5 bg-[#184890] rounded-md">
              <input
                type="number"
                value={betAmount === null ? "" : betAmount}
                onChange={(e) =>
                  setBetAmount(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                className="w-full bg-[#102c56] p-2 rounded-l-sm text-left text-sm md:text-base focus:outline-none cursor-text"
                placeholder=""
                onKeyDown={(e) => {
                  const allowedKeys = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                    "Enter",
                    "Home",
                    "End",
                    ".", // allow decimals
                  ];
                  if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <div className="flex items-center">
                <button
                  className="bg-[#184890] px-2 md:px-3 text-sm md:text-base cursor-pointer hover:bg-[#1a5299] transition-colors"
                  onClick={() =>
                    setBetAmount(
                      betAmount === null || betAmount === 0
                        ? 0
                        : betAmount / 2
                    )
                  }
                >
                  ½
                </button>
                <div className="border-l-2 h-[67%] border-l-[#102c56]" />
                <button
                  className="bg-[#184890] px-2 md:px-3 rounded-r-sm text-sm md:text-base cursor-pointer hover:bg-[#1a5299] transition-colors"
                  onClick={() =>
                    setBetAmount(betAmount === null ? 0 : betAmount * 2)
                  }
                >
                  2x
                </button>
              </div>
            </div>
          </div>

          {/* Go */}
          <div className="flex flex-row gap-2 mt-3">

            <button className={`flex-1 py-2 rounded-lg bg-[#2cbf2a] text-black shadow-md font-semibold text-sm md:text-base transition duration-300 ease-in-out ${isGoButtonActive && !gameOver
              ? "bg-[#2cbf2a] hover:bg-[#33de30] cursor-pointer" // Active: Brighter on hover
              : "bg-[#2cbf2a] opacity-50 cursor-not-allowed" // Disabled: Darker, not clickable
              }`}
              onClick={handleGoButtonClick}
              disabled={!isGoButtonActive || gameOver}>
              Go
            </button>
          </div>

          {/* Profit */}
          <div className="mt-3">
            <p className="text-xs md:text-sm text-white">Total profit (1.00x)</p>
            <input
              type="number"
              readOnly
              value={0.0}
              className="w-full bg-[#2f6ed0] p-2 rounded-lg text-left text-white text-sm md:text-base mt-1 shadow-md"
            />
          </div>
        </div>
        
        {/* RIGHT PANEL – CANVAS */}
        <div className={`bg-[#184890] relative flex-1 min-w-0 md:rounded-tr-4xl flex items-center justify-center min-h-96 md:min-h-full ${shouldShowOverlay ? 'pointer-events-none' : ''}`}>
          {shouldShowOverlay && (
            <div
              className="absolute w-full inset-0 flex items-center justify-center text-lg md:text-2xl font-bold text-white md:rounded-tr-4xl bg-[#184890] px-4 text-center"
              style={{ pointerEvents: "auto", zIndex: 10 }}
            >
              <div>Please place your bet to start the game.</div>
            </div>
          )}
          {children}
        </div>
      </div>

      {/* BOTTOM PANEL */}
      <div className="w-full bg-[#10305f] h-20 md:h-24 rounded-b-4xl flex items-center justify-center text-gray-300 text-xs md:text-sm relative md:mt-0">
        Cataris
      </div>
    </div>
  );
}
