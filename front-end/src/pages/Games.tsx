import React from 'react';
import { Link } from "react-router-dom";
import './Games.css';

// Import game images
import gameCat from '../assets/games/game-cat.png';
import gameMice from '../assets/games/game-mice.png';
import gameTreat from '../assets/games/game-treat.png';
import gameMeowJack from '../assets/games/game-meowjack.png';
import gamePlinko from '../assets/games/Plinko.png';
import gameRoulette from '../assets/games/Roulette.png';


interface Game {
  id: number;
  image: string;
  link: string;
}

const Games: React.FC = () => {
  const games: Game[] = [
    {
      id: 1,
      image: gameCat,
      link: "/games/cat"
    },
    {
      id: 2,
      image: gameMice,
      link: "/games/mice"
    },
    {
      id: 3,
      image: gameTreat,
      link: "/games/treat"
    },
    {
      id: 4,
      image: gameMeowJack,
      link: "/games/meow-jack"
    },
    {
      id: 5,
      image: gamePlinko,
      link: "/games/ball-of-yarn"
    },
    {
      id: 6,
      image: gameRoulette,
      link: "/games/roulette"
    }
  ];

  return (
    <div className="games-container">
      <div className="games-header">
        <h1 className="games-title">CATARIS ORIGINAL GAMES</h1>
      </div>

      <div className="games-grid">
        {games.map((game) => (
            <Link to={game.link} key={game.id} className="game-card">
            <div className="game-image-wrapper">
                <img src={game.image}className="game-image" />
            </div>
            </Link>
        ))}
        </div>
    </div>
  );
};

export default Games;