import React, { useEffect, useState } from "react";
import { Link, replace, useFetcher, useNavigate, useSearchParams } from "react-router-dom";
import "./Home.css";
import Login from "./Login";
import Register from "./Register";
// @ts-ignore
import { combinations } from "../assets/CardDeck";
import Hand from "../components/Hand";
import BettingPanel from "../components/BettingPanel";

type CardDeck = {
    suit: string;
    rank: string;
}

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
  const [gameDeck, setGameDeck ] = useState<CardDeck[]>(combinations);
  const [playerHand,setPlayerHand] = useState<CardDeck[]>([]);
  const [dealerHand,setDealerHand] = useState<CardDeck[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState<{ type: string; message: string }>({type: "",message:""});
  const [newGame, setNewGame] = useState(false);
  //console.log(gameDeck);
  const getRandomCardFromDeck=()=>{
    const randomIndex = Math.floor(Math.random() * gameDeck.length);
    const card = gameDeck[randomIndex]
    const newDeck = gameDeck.filter((_, index) => index !== randomIndex);
    setGameDeck(newDeck);
    return card;
  };

  const dealCardToPlayer=()=>{
    const newHand = [...playerHand, getRandomCardFromDeck()];
    setPlayerHand(newHand);
    const playerValue = calculateHandValue(newHand);
    console.log(newHand);
    console.log(playerValue);
    if(playerValue > 21)
    {
        handleGamerOver({type: "dealer", message: "Dealer wins"});
    }
    else if(playerValue === 21)
    {
        handleGamerOver({type: "player", message: "Player wins"});
    }
  };

  const playerStand= () =>{
    setGameOver(true);
    const newHand = [...dealerHand, getRandomCardFromDeck()];
    setDealerHand(newHand);
    console.log(newHand);
    const dealerValue = calculateHandValue(newHand);
    console.log(dealerValue);
    if(dealerValue > 21)
    {
        handleGamerOver({type: "player", message: "Player wins"});
    }
  }
  const calculateHandValue = (hand: CardDeck[]) =>{
    let value = 0;
    let aceCount = 0;
    hand.forEach((card: CardDeck) => {
        if(card.rank ==="J" || card.rank == "Q" || card.rank ===  "K"){
            value += 10
        }
        else if(card.rank === "A"){
            aceCount+=1; value += 11
        } 
        else{
            value +=parseInt(card.rank)
        }
    });
    while(value > 21 && aceCount > 0)
    {
        value -= 10;
        aceCount -= 1;
    }
    return value;
  };

  const handleGamerOver = (result: GameOverResult) =>{
    setGameOver(true);
    setResult(result);
    setNewGame(true);
  }

  const resetGame = () =>{
    setPlayerHand([]);
    setDealerHand([]);
    setGameOver(false);
    setResult({type: "", message: ""}); 
    setNewGame(false);
    setGameDeck(combinations);
  }

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  useEffect(()=>{
    if(playerHand.length === 0 && dealerHand.length === 0)
    {
      setPlayerHand([getRandomCardFromDeck(), getRandomCardFromDeck()])
      setDealerHand([getRandomCardFromDeck()])
    }
    if(playerValue === 21)
    {
      handleGamerOver({type: "player", message: "BlackJack! Player won"})
    }
    else if(dealerValue === 21)
    {
      handleGamerOver({type: "dealer", message: "BlackJack! Dealer won"})
    }

    if(gameOver && dealerHand.length <=5)
    {
      switch(true)
      {
        case playerValue === 21:
          setResult({type: "player", message: "BlackJack! Player won"});
          break;
        case playerValue >21:
          setResult({type: "dealer", message: "Dealer Wins"});
          break;
        case dealerValue < playerValue:
          playerStand();
          break;
        case dealerValue === playerValue && dealerHand.length <= 5:
          setResult({type: "", message: "Draw"});
          setNewGame(true);
          break;
        case dealerValue > playerValue && dealerValue <= 21:
          setResult({type: "dealer", message: "Dealer Wins"});
          setNewGame(true);
          break;
        default:
          break;
      }
    }
  },[playerHand, dealerHand, gameOver]);

  return (  
    <main className="home">
      <BettingPanel>
        <h1 className="text-4x1 text-center mb-4">BlackJack</h1>
        {gameOver && (<div className={`text-white ${result.type === "player" ? "bg-green-600": "bg-red-700"} font-bold rounded-md text-center mt-4 py-4`}>
            <h2 className="text-2xl">{result.message}</h2>
            </div>
        )}
        <div>
        <div className="flex justify-center gap-2 mt-4">
            {!newGame ? (
            <>
                <button className="bg-green-500 text-white font-medium px-4 py-2 rounded-lg shadow-md" onClick = {dealCardToPlayer}>Hit</button>
                <button className="bg-red-500 text-white font-medium px-4 py-2 rounded-lg shadow-md" onClick = {playerStand}>Stand</button>
            </>
                ) : (<button className="bg-blue-500 text-white font-medium px-4 py-2 rounded-lg shadow-md" onClick = {resetGame}>Reset</button>)}
            </div>
            <div className="flex justify-around">
              <Hand 
                cards={playerHand} 
                title="Players's Hand" 
                handValue={playerValue}/>{" "}
              <Hand 
                cards={dealerHand} 
                title="Dealer's Hand" 
                handValue={dealerValue}/>
            </div>
        </div>
      </BettingPanel>
      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
          <div className="modal__backdrop" onClick={closeAuthModal} />
          <div className="modal__panel">
            <button className="modal__close" onClick={closeAuthModal} aria-label="Close">×</button>
            <Login />
          </div> 
        </div>
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="register-title">
          <div className="modal__backdrop" onClick={closeAuthModal} />
          <div className="modal__panel">
            <button className="modal__close" onClick={closeAuthModal} aria-label="Close">×</button>
            <Register />
          </div>
        </div>
      )}
    </main>
  );
}
