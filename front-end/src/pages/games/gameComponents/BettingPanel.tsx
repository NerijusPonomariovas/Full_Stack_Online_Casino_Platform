import { useEffect, type ReactNode } from "react";
import { fetchWalletBalance } from "../../../api/auth";

type BettingPanelProps = {
  children?: ReactNode;
  betAmount: number | null;
  setBetAmount: (amount: number | null) => void;
  startGame: () => void;
  gameOver: boolean;
  gameStarted: boolean;
};

/* type WalletBalanceResponse = {
  balance: number;
};

type AuthError = {
  type: string;
  message: string;
}; */


export default function BettingPanel({ children, /* betAmount, */ /* setBetAmount, */ /* startGame, gameOver, */ /* gameStarted */}: BettingPanelProps) {
 /*  const [balance, setBalance] = useState<number>(0); */ // Example balance, replace with actual fetched balance
/*   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state */


  useEffect(() => {
    const token = localStorage.getItem("token");
    //setIsAuthenticated(!!token);

    if (token) {
      const getBalance = async () => {
        const result = await fetchWalletBalance();
        if('balance' in result) {
          console.log('Account Balance in BettingPanel:', result.balance);
        } else {  
          console.error("Failed to fetch wallet balance:", result.message);
        }
      };
      getBalance();
      // Fetch user balance if authenticated
    }
  }, []);

  return (
    <div className="w-[95%] sm:w-[95%] md:ml-0 xl:w-6xl relative mt-110 md:mt-30 flex flex-col drop-shadow-2xl ">
      <div className="flex flex-col md:flex-row h-140">

        {/* RIGHT PANEL – STÓŁ */}
        <div className="bg-[#184890] relative w-full md:rounded-t-4xl flex items-center justify-center">

          {children}
        </div>
      </div>

      {/* BOTTOM PANEL */}
      <div className="w-full bg-[#10305f] h-24 rounded-b-4xl flex items-center justify-center text-gray-300 text-sm relative mt-62 md:mt-0">
        Cataris
      </div>
    </div>
  );
}
