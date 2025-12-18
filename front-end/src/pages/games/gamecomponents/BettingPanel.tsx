import { useState } from "react";
import type { ReactNode } from "react";

type BettingPanelProps = {
  children?: ReactNode; // optional children
};

export default function BettingPanel({ children }: BettingPanelProps) {
  const [mode, setMode] = useState("manual");
  const [showDifficulty] = useState(true);
  const [difficulty, setDifficulty] = useState("Medium");
  const [betAmount, setBetAmount] = useState<number | null>(null);

  return (
    //fix responsiveness when width smaller than 768px atleast, nu krc navbar'as uzdengia puse betting menu :)
    <div className="w-[95%] sm:w-[95%] md:ml-0 xl:w-6xl relative mt-110 md:mt-30 flex flex-col drop-shadow-2xl ">
      <div className="flex flex-col md:flex-row h-140">
        {/* LEFT PANEL */}
        <div className="w-full md:w-64 bg-[#1c5ec3] text-white rounded-t-4xl p-4 space-y-3 md:rounded-tr-none">
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

          {/* Conditional Difficulty Section */}
          {showDifficulty && (
            <div>
              <label className="text-sm text-gray-200">Difficulty</label>
              <div className="bg-[#184890] mt-1 p-0.5 rounded-md">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-[#0a2e6e] p-2 rounded-sm focus:outline-none"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
          )}

          {/* Bet / Go Buttons */}
          <div className="flex flex-row gap-2 mt-3">
            <button className="flex-1 bg-[#2cbf2a] py-2 rounded-lg text-black font-semibold hover:bg-[#33de30]">
              Bet
            </button>

            <button className="flex-1 bg-[#154a9b] py-2 rounded-lg text-[#2874e9] shadow-md">
              Go
            </button>
          </div>

          {/* Profit Section */}
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

        {/* RIGHT PANEL */}
        <div className="bg-[#184890] relative w-full md:rounded-tr-4xl flex items-center justify-center">
          {/* Your visual / graph / game area goes here */}
          {children}
        </div>
      </div>

      {/* BOTTOM PANEL */}
      <div className="w-full bg-[#10305f] h-24 rounded-b-4xl flex items-center justify-center text-gray-300 text-sm relative mt-82 md:mt-0">
        Cataris
      </div>
    </div>
  );
}
