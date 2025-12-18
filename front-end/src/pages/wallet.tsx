import React, { useEffect, useState } from "react";
import { updateWalletBalance } from "../api/auth";
import { fetchWalletBalance } from "../api/auth";
import { NavLink, Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import logo from "../assets/LOGO.svg";

interface UserData {
  username: string;
  email: string;
  balance: number;
}

export default function Wallet() {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accountBalance, setAccountBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // For button loading state
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

    const closeAuthModal = () => {
      setShowLogin(false);
      setShowRegister(false);
      navigate("/wallet", { replace: true }); // clears ?auth=...
    };

  useEffect(() => {
    const auth = searchParams.get("auth");
    setShowLogin(auth === "login");
    setShowRegister(auth === "register");
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      const getBalance = async () => {
        const result = await fetchWalletBalance();
        if ('balance' in result) {
          setAccountBalance(result.balance);
        } else {
          console.error("Failed to fetch wallet balance:", result.message);
        }
      };
      getBalance();
      // Fetch user balance if authenticated
    }
  }, [searchParams]);

  const handleDeposit = async () => {
    console.log("Pressed");
    setLoading(true);
    setStatusMessage("Processing deposit...");
    try {
      const result = await updateWalletBalance("50", "win");
      if('balance' in result) {
        setStatusMessage("Deposit successful!");
        setLoading(false);
        console.log("New balance: ", result.balance);
        window.location.reload();
      }
      window.location.reload();
    }catch (error) {
      console.error("Deposit failed: ", error);
    }
    
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a2e5c] via-[#0b3a6f] to-[#081c36] text-white p-5 overflow-x-hidden">
      {!isAuthenticated && (
        <div className="fixed inset-0 bg-gradient-to-b from-[#102c56] via-[#0b3a6f] to-[#081c36] bg-opacity-100 z-10 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-11/12 sm:w-96 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-16 h-auto" // Adjust the size of your logo
                />
                <p className="text-xl ml-4 text-gray-700">Please log in to play the game!</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-2xl mx-auto p-5">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#dbeafe]">
            Account
          </h1>
        </div>

        {/* Card */}
        <div className="bg-[#0f2a44] rounded-xl p-6 mb-6 shadow-xl">
          <div className="py-4 border-b border-[#1e4f8f]">
            <span className="text-sm text-[#7fb3ff]">Username</span>
            <div className="text-lg font-semibold text-white">
              {userData?.username ?? "-"}
            </div>
          </div>

          <div className="py-4 border-b border-[#1e4f8f]">
            <span className="text-sm text-[#7fb3ff]">Email</span>
            <div className="text-lg font-semibold text-white">
              {userData?.email ?? "-"}
            </div>
          </div>

          <div className="pt-4">
            <span className="text-sm text-[#7fb3ff]">Wallet</span>
            <div className="text-2xl font-bold text-[#4da3ff]">
              {accountBalance !== null ? `$${accountBalance.toFixed(2)}` : 'Loading...'}
            </div>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={handleDeposit}
          disabled={loading}
          className="w-full py-4 bg-blue-500 rounded-lg font-semibold hover:bg-blue-600 transition-all hover:-translate-y-0.5 hover:shadow-lg">
          {loading ? "Processing..." : `Deposit`}
        </button>
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
