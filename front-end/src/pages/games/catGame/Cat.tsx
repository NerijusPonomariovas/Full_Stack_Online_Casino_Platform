import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./BettingPanel.css";
import Login from "../../Login";
import Register from "../../Register";
import BettingPanel from "../gameComponents/BettingPanel";
import Cat from "./CatGame";

// png imports
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
    navigate("/", { replace: true }); // clears ?auth=...
  };
  return (  
    <main className="home flex">
      <div className="flex justify-center items-center w-screen h-150">
        <div>
          <BettingPanel>
            <div id="game-container" className="w-full h-full sm:rounded-none xl:rounded-tr-2xl">
              <Cat />
            </div>
          </BettingPanel>
        </div>
      </div>
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
