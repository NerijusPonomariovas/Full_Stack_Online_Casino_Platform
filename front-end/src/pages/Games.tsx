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
  title: string;
  image: string;
  label: string;
  multiplier?: string;
  link: string;
}

const Games: React.FC = () => {
  const games: Game[] = [
    {
      id: 1,
      title: 'CAT',
      image: gameCat,
      label: 'CATARIS ORIGINAL',
      link: "/games/cat"
    },
    {
      id: 2,
      title: 'MICE',
      image: gameMice,
      label: 'CATARIS ORIGINAL',
      link: "/games/dice"
    },
    {
      id: 3,
      title: 'TREAT',
      image: gameTreat,
      label: 'CATARIS ORIGINAL',
      link: "/games/treat"
    },
    {
      id: 4,
      title: 'MEOW-JACK',
      image: gameMeowJack,
      label: 'CATARIS ORIGINAL',
      link: "/games/meow-jack"
    },
    {
      id: 5,
      title: 'BALL OF YARN',
      image: gamePlinko,
      label: 'CATARIS ORIGINAL',
      link: "/games/ball-of-yarn"
    },
    {
      id: 6,
      title: 'ROULETTE',
      image: gameRoulette,
      label: 'CATARIS ORIGINAL',
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
                <img src={game.image} alt={game.title} className="game-image" />
                {game.multiplier && <div className="game-multiplier">{game.multiplier}</div>}
            </div>
            <div className="game-info">
                <h3 className="game-title">{game.title}</h3>
                <p className="game-label">{game.label}</p>
            </div>
            </Link>
        ))}
        </div>
    </div>
  );
};

export default Games;