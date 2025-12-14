import { useState, type ReactNode } from "react";

type BettingPanelProps = {
  children?: ReactNode;
  betAmount: number | null;
  setBetAmount: (amount: number | null) => void;
  startGame: () => void;
  gameOver: boolean;
  gameStarted: boolean;
};

export default function BettingPanel({ children, betAmount, setBetAmount, startGame, gameOver}: BettingPanelProps) {
  const [mode, setMode] = useState("manual");

  const isGoButtonActive = betAmount !== null && betAmount > 0 && !gameOver;

  return (
    <div className="w-full sm:w-[90%] max-w-6xl mx-auto flex flex-col drop-shadow-2xl">
      <div className="flex flex-col md:flex-row items-stretch">
        {/* LEFT PANEL */}
        <div className="w-full md:w-64 bg-[#1c5ec3] text-white rounded-tl-4xl p-4 space-y-3 flex-shrink-0">
          {/* Toggle Manual / Auto */}
          <div className="flex bg-[#102c56] rounded-4xl overflow-hidden h-12 w-full items-center pl-1 pr-1">
            <button
              className={`flex-1 rounded-4xl h-[82%] ${
                mode === "manual" ? "bg-[#184fa2]" : ""
              }`}
              onClick={() => setMode("manual")}
            >
              Manual
            </button>
            <button
              className={`flex-1 rounded-4xl h-[82%] ${
                mode === "auto" ? "bg-[#184fa2]" : ""
              }`}
              onClick={() => setMode("auto")}
            >
              Auto
            </button>
          </div>  

          {/* Bet Amount */}
          <div>
            <label className="text-sm text-gray-200">Bet Amount</label>
            <div className="flex mt-1 p-0.5 bg-[#184890] rounded-md">
              <input
                type="number"
                value={betAmount === null ? "" : betAmount}
                onChange={(e) =>
                  setBetAmount(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                className="w-full bg-[#102c56] p-2 rounded-l-sm text-left focus:outline-none"
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
                    ".",
                  ];
                  if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <div className="flex items-center">
                <button
                  className="bg-[#184890] px-3"
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
                  className="bg-[#184890] px-3 rounded-r-sm"
                  onClick={() =>
                    setBetAmount(betAmount === null ? 0 : betAmount * 2)
                  }
                >
                  2x
                </button>
              </div>
            </div>
          </div>

          {/* Bet / Go */}
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <button className="flex-1 bg-[#2cbf2a] py-2 rounded-lg text-black font-semibold hover:bg-[#33de30]">
              Bet
            </button>
            <button className={`flex-1 py-2 rounded-lg text-[#2874e9] shadow-md font-semibold transition duration-300 ease-in-out ${
                isGoButtonActive
                  ? "bg-[#154a9b] hover:bg-[#1e69c6]" // Active: Brighter on hover
                  : "bg-[#154a9b] opacity-50 cursor-not-allowed" // Disabled: Darker, not clickable
              }`}
              onClick={startGame}
              disabled={!isGoButtonActive}>
              Go
            </button>
          </div>

          {/* Profit */}
          <div className="mt-3">
            <p className="text-xs text-white">Total profit (1.00x)</p>
            <input
              type="number"
              readOnly
              value={0.0}
              className="w-full bg-[#2f6ed0] p-2 rounded-lg text-left text-white mt-1 shadow-md"
            />
          </div>
        </div>

        {/* RIGHT PANEL – STÓŁ */}
        <div className="bg-[#184890] relative w-full md:w-[78%] rounded-tr-2xl md:rounded-tr-4xl min-h-[400px] flex items-center justify-center">
          {children}
        </div>
      </div>

      {/* BOTTOM PANEL */}
      <div className="w-full bg-[#10305f] h-24 rounded-b-2xl md:rounded-b-4xl flex items-center justify-center text-gray-300 text-sm">
        Cataris
      </div>
    </div>
  );
}
