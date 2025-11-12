import { useState } from "react";

export default function BettingPanel() {
  const [mode, setMode] = useState("manual"); // "manual" or "auto"
  const [showDifficulty] = useState(true);
  const [difficulty, setDifficulty] = useState("Medium");
  const [betAmount, setBetAmount] = useState<number | null>(null);


  return (
    <div className="w-64 bg-[#1c5ec3] text-white rounded-xl p-4 space-y-3">
      {/* Toggle Manual / Auto */}
      <div className="flex bg-[#102c56] rounded-4xl overflow-hidden h-12 w-full items-center pl-1 pr-1">
        <button
          className={`flex-1 rounded-4xl h-[82%] w-[50%] ${mode === "manual" ? "bg-[#184fa2]" : ""}`}
          onClick={() => setMode("manual")}
        >
          Manual
        </button>
        <button
          className={`flex-1 rounded-4xl h-[82%] w-[50%] ${mode === "auto" ? "bg-[#184fa2]" : ""}`}
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
            onChange={(e) =>  setBetAmount(e.target.value === "" ? null : Number(e.target.value))}
            className="w-full bg-[#102c56] p-2 rounded-l-sm text-left focus:outline-none"
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
            
              // Block letters and invalid characters, but allow navigation + editing
              if (
                !/[0-9]/.test(e.key) &&
                !allowedKeys.includes(e.key)
              ) {
                e.preventDefault();
              }
            }}
          />
          <div className="flex items-center">
            <button
              className="bg-[#184890] px-3"
              onClick={() => setBetAmount(
            betAmount === null || betAmount === 0 ? 0 : betAmount / 2
          )}
            >
              ½
            </button>
            <div className="border-l-3 h-[67%] border-l-[#102c56]"></div>
            <button
              className="bg-[#184890] px-3 rounded-r-sm"
              onClick={() => setBetAmount(betAmount === null ? 0 : betAmount * 2)}
            >
              2x
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Difficulty Section */}
      {showDifficulty && (
        <div>
          <label className="text-sm text-gray-200">Difficulty</label>
          <div className="bg-[#184890] mt-1 p-0.5 rounded-md">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-[#0a2e6e]  p-2 rounded-sm focus:outline-none"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>
      )}

      {/* Bet / Go Buttons */}
      <button className="w-full bg-[#2cbf2a] py-2 rounded-lg text-black font-semibold hover:bg-[#33de30]">
        Bet
      </button>

      <button className="w-full bg-[#154a9b] py-2 rounded-lg text-[#2874e9] shadow-md">
        Go
      </button>
      {/* Profit Section */}
      <div>
        <p className="text-xs text-white">
          Total profit (1.00x)
        </p>
        <input

          type="number"
          readOnly
          value={0.0}
          className="w-full bg-[#2f6ed0] p-2 rounded-lg text-left text-white mt-1 shadow-md"
        />
      </div>

      {/* Toggle Difficulty Section Button */}
      {/* <button
        className="w-full bg-[#07316b] py-1 rounded-lg text-sm mt-2"
        onClick={() => setShowDifficulty(!showDifficulty)}
      >
        {showDifficulty ? "Hide Difficulty" : "Show Difficulty"}
      </button> */}
    </div>
  );
}