import React, { useEffect, useState } from "react";

const API_URL = "http://your-backend-api-url";

interface UserData {
  username: string;
  email: string;
  balance: number;
}

export default function Wallet() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/user/profile`)
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(() => {
      });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a2e5c] via-[#0b3a6f] to-[#081c36] text-white p-5 overflow-x-hidden">
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
          €{userData ? userData.balance.toFixed(2) : "0.00"}
        </div>
      </div>
    </div>

    {/* Actions */}
    <button className="w-full py-4 bg-blue-500 rounded-lg font-semibold hover:bg-blue-600 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      Deposit
    </button>

  </div>
</main>
    );
}
