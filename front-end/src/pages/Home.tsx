import { Link } from "react-router-dom";
import "./Home.css";

// Paveiksliukai (keisk kelius/pavadinimus pagal save)
import hero from "../assets/home/hero.jpg";
import imgCat from "../assets/home/game-cat.png";
import imgMice from "../assets/home/game-mice.png";
import imgTreat from "../assets/home/game-treat.png";
import imgMeow from "../assets/home/game-meowjack.png";

export default function Home() {
  return (
    <main className="home">
      {/* HERO */}
      <Link to="/games" className="hero hero--clickable" aria-label="Play now – go to Games">
        <img src={hero} alt="" />
      </Link>

      {/* FEATURED GAMES */}
      <section className="featured">
        <div className="featured__hdr">
          <h2>FEATURED GAMES</h2>
          {/* jei prireiks rodyklei vėliau – čia vieta */}
        </div>

        <div className="games">
          <Link to="/games/cat" className="gamecard" aria-label="Play CAT">
            <img src={imgCat} alt="CAT game" />
          </Link>

          <Link to="/games/mice" className="gamecard" aria-label="Play MICE">
            <img src={imgMice} alt="MICE game" />
          </Link>

          <Link to="/games/treat" className="gamecard" aria-label="Play TREAT">
            <img src={imgTreat} alt="TREAT game" />
          </Link>

          <Link to="/games/meow-jack" className="gamecard" aria-label="Play MEOW-JACK">
            <img src={imgMeow} alt="MEOW-JACK game" />
          </Link>
        </div>
      </section>
    </main>
  );
}
