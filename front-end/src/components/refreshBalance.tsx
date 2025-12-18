import { useEffect } from "react";
import { fetchWalletBalance } from "../api/auth";

export const useBalance = (setAccountBalance: React.Dispatch<React.SetStateAction<number | null>>) => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const getBalance = async () => {
        const result = await fetchWalletBalance();
        if ('balance' in result) {
          setAccountBalance(parseFloat(result.balance.toFixed(2)));
        } else {
          console.error("Failed to fetch wallet balance:", result.message);
        }
      };
      getBalance();
    }
  }, [setAccountBalance]);
};

export const refreshBalance = async (setAccountBalance: React.Dispatch<React.SetStateAction<number | null>>) => {
  const result = await fetchWalletBalance();
  if ('balance' in result) {
    setAccountBalance(parseFloat(result.balance.toFixed(2)));
  } else {
    console.error("Failed to fetch wallet balance:", result.message);
  }
};
