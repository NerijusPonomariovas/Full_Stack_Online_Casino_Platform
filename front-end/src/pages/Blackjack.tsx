import React, { useEffect, useState } from "react";
import { Link, replace, useFetcher, useNavigate, useSearchParams } from "react-router-dom";
import "./Home.css";
import Login from "./Login";
import Register from "./Register";
// @ts-ignore
import { combinations } from "../assets/CardDeck";
import Hand from "../components/Hand";
import BettingPanel from "../components/BettingPanelBlackJack";
import banner from "../assets/BANNER.svg";
import cardDeck from "../assets/DECK-CARDS.svg";

type CardDeck = {
  suit: string;
  rank: string;
};

type GameOverResult = {
  type: string;
  message: string;
};

export default function Home() {
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
    navigate("./", { replace: true }); // clears ?auth=...
  };

  const [gameDeck, setGameDeck] = useState<CardDeck[]>(combinations);
  const [playerHand, setPlayerHand] = useState<CardDeck[]>([]);
  const [dealerHand, setDealerHand] = useState<CardDeck[]>([]);
  const [betAmount, setBetAmount] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [result, setResult] = useState<{ type: string; message: string }>({
    type: "",
    message: "",
  });
  const [newGame, setNewGame] = useState(false);
  const [dealerRevealed, setDealerRevealed] = useState(false);
  const [hasPair, setHasPair] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [leftHand, setLeftHand] = useState<CardDeck[]>([]);
  const [rightHand, setRightHand] = useState<CardDeck[]>([]);
  const [activeHand, setActiveHand] = useState<"left" | "right">("left");


  const getRandomCardFromDeck = () => {
    const randomIndex = Math.floor(Math.random() * gameDeck.length);
    const card = gameDeck[randomIndex];
    const newDeck = gameDeck.filter((_, index) => index !== randomIndex);
    setGameDeck(newDeck);
    return card;
  };

  const getCardValue = (card: CardDeck) => {
    if (card.rank === "D" || card.rank === "J" || card.rank === "K") {
      return 10;
    } else if (card.rank === "A") {
      return 11;
    } else {
      return parseInt(card.rank, 10);
    }
  };

  const calculateHandValue = (hand: CardDeck[]) => {
    let value = 0;
    let aceCount = 0;
    hand.forEach((card: CardDeck) => {
      value += getCardValue(card);
      if (card.rank === "A") {
        aceCount += 1;
      }
    });
    while (value > 21 && aceCount > 0) {
      value -= 10;
      aceCount -= 1;
    }
    return value;
  };

  const handleGamerOver = (result: GameOverResult) => {
    setGameOver(true);
    setResult(result);
    setNewGame(true);
  };

  const dealCardToPlayer = () => {
    const newHand = [...playerHand, getRandomCardFromDeck()];
    setPlayerHand(newHand);
    const playerValue = calculateHandValue(newHand);
    console.log(newHand);
    console.log(playerValue);
    if (playerValue > 21) {
      handleGamerOver({ type: "dealer", message: "Dealer wins" });
    }
  };

  const playerStand = () => {
    setDealerRevealed(true);
    setGameOver(true);
    const newHand = [...dealerHand, getRandomCardFromDeck()];
    setDealerHand(newHand);
    console.log(newHand);
    const dealerValue = calculateHandValue(newHand);
    console.log(dealerValue);
    if (dealerValue > 21) {
      handleGamerOver({ type: "player", message: "Player wins" });
    }
  };

  const startGame = () => {
    if (betAmount && betAmount > 0) {
      setGameStarted(true);
      setPlayerHand([]);
      setDealerHand([]);
      setGameOver(false);
      setResult({ type: "", message: "" });
      setNewGame(false);
      setGameDeck(combinations);
      setDealerRevealed(false);
    }
    else
    {
      alert("Pleace place a bet before starting a game!");
    }
  };

  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameOver(false);
    setResult({ type: "", message: "" });
    setNewGame(false);
    setGameDeck(combinations);
    setDealerRevealed(false);
  };

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  const dealerVisibleValue = dealerRevealed
    ? dealerValue
    : calculateHandValue(dealerHand.slice(1));

  const playerStatus: "win" | "lose" | "neutral" | "tie" =
    gameOver
      ? result.type === "player"
        ? "win"
        : result.type === "dealer"
          ? "lose"
          : result.message === "Draw"
            ? "tie"
            : "neutral"
      : "neutral";

  useEffect(() => {
    if (playerHand.length === 0 && dealerHand.length === 0) {
      setPlayerHand([getRandomCardFromDeck(), getRandomCardFromDeck()]);
      setDealerHand([getRandomCardFromDeck(), getRandomCardFromDeck()]);
      setDealerRevealed(false);
    }
    if (gameOver && dealerHand.length <= 5) {
      switch (true) {
        case playerValue === 21:
          setResult({ type: "player", message: "BlackJack! Player won" });
          break;
        case playerValue > 21:
          setResult({ type: "dealer", message: "Dealer Wins" });
          break;
        case dealerValue < playerValue:
          playerStand();
          break;
        case dealerValue === playerValue && dealerHand.length <= 5:
          setResult({ type: "", message: "Draw" });
          setNewGame(true);
          break;
        case dealerValue > playerValue && dealerValue <= 21:
          setResult({ type: "dealer", message: "Dealer Wins" });
          setNewGame(true);
          break;
        default:
          break;
      }
    }
  }, [playerHand, dealerHand, gameOver]);

  useEffect(() => {
    if (playerHand.length === 2) {
      const firstHandValue = getCardValue(playerHand[0]);
      const secondHandValue = getCardValue(playerHand[1]);
      if (firstHandValue === secondHandValue) {
        setHasPair(false);
        console.log("Player has a pair");
      } else {
        setHasPair(false);
      }
    } else {
      setHasPair(false);
    }
  }, [playerHand]);

  // *** LOGIKA AKTYWNOŚCI PRZYCISKÓW ***
  const canHit = !gameOver && !newGame;
  const canStand = !gameOver && !newGame;
  const canDouble = !gameOver && !newGame && playerHand.length === 2;
  const canReset = newGame || gameOver;

  return (
    <main className="home">
      <div className="flex w-screen min-h-screen justify-center items-start">
        <div className="w-full flex justify-center">
          <BettingPanel betAmount={betAmount} setBetAmount={setBetAmount} startGame={startGame} gameOver={gameOver} gameStarted={gameStarted}>
            <div className="w-full h-full sm:rounded-none md:rounded-tr-2xl relative">
              <img
                src={cardDeck}
                alt="Card deck"
                className="absolute top-0 right-4 w-35 h-auto"
              />
              {gameOver}
              <div>
                <div className="flex flex-col justify-center items-center mt-6">
                  <Hand
                    cards={dealerHand}
                    title="Dealer's Hand"
                    handValue={dealerVisibleValue}
                    hideFirstCard={!dealerRevealed}
                  />
                  <img
                    src={banner}
                    alt="Blackjack banner"
                    className="w-[260px] my-4 drop-shadow-lg"
                  />
                  <Hand
                    cards={playerHand}
                    title="Players's Hand"
                    handValue={playerValue}
                    status={playerStatus}
                  />
                </div>

                {/* PANEL PRZYCISKÓW – zawsze widoczny */}
                <div className="flex justify-center mt-6">
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#003366] border border-[#0a1a2f]">
                    {/* HIT */}
                    <button
                      className={`w-24 h-12 flex items-center justify-center text-white font-semibold rounded-lg shadow-md
      bg-green-500 ${!canHit ? "opacity-40 cursor-not-allowed" : ""}`}
                      onClick={dealCardToPlayer}
                      disabled={!canHit}
                    >
                      Hit
                    </button>
                    {/* STAND */}
                    <button
                      className={`w-24 h-12 flex items-center justify-center text-white font-semibold rounded-lg shadow-md
      bg-red-500 ${!canStand ? "opacity-40 cursor-not-allowed" : ""}`}
                      onClick={playerStand}
                      disabled={!canStand}
                    >
                      Stand
                    </button>

                    {/* DOUBLE */}
                    <button
                      className={`w-24 h-12 flex items-center justify-center text-white font-semibold rounded-lg shadow-md
      bg-yellow-500 ${!canDouble ? "opacity-40 cursor-not-allowed" : ""}`}
                      onClick={() => {
                        dealCardToPlayer();
                        playerStand();
                      }}
                      disabled={!canDouble}
                    >
                      Double
                    </button>
                    {/* RESET 
                    <button
                      className={`w-24 h-12 flex items-center justify-center text-white font-semibold rounded-lg shadow-md
      bg-blue-500 ${!canReset ? "opacity-40 cursor-not-allowed" : ""}`}
                      onClick={resetGame}
                      disabled={!canReset}
                    >
                      Reset
                    </button>
                    */}
                  </div>
                </div>
              </div>
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
