import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the API URL for fetching the wallet data
const API_URL = 'http://your-backend-api-url'; // Replace with your backend URL

// Create an interface for the balance and payment methods
interface WalletData {
    balance: number;
    bonusBalance: number;
    paymentMethods: string[];
}

export default function Wallet() {
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true); // Loading state to track fetching

    // Fetch wallet data when the component mounts
    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/balance`);
                setWalletData(response.data);
                setLoading(false); // Set loading to false once data is fetched
            } catch (error) {
                setError('Failed to load wallet data');
                setLoading(false); // Stop loading even if an error occurs
            }
        };

        fetchWalletData();
    }, []);

    // Show loading state if data is still being fetched
    if (loading) {
        return (
            <main className='home'>
                <div className="flex justify-center items-center h-screen text-2xl text-gray-600">
                    <div className="loader">Loading...</div> {/* You can replace this with a spinner */}
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className='home'>
                <div className="flex justify-center items-center h-screen text-2xl text-red-600">{error}</div>
            </main>
        );
    }

    // Check if walletData is null or undefined before rendering
    if (!walletData) {
        
        return (
            <main className='home'>
                <div className="flex justify-center items-center h-screen text-2xl text-red-600">No wallet data available</div>
            </main>
        );
    }
    return (
        <div className="container mx-auto p-6 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white">
            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-3xl font-bold mb-4">Wallet</h2>
                <div className="flex justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold">Balance:</span>
                        <span className="text-xl font-extrabold">{walletData.balance.toFixed(2)}</span> {/* Safe to access walletData here */}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold">Available Balance</span>
                        <span className="text-xl font-extrabold">{walletData.balance.toFixed(2)}</span> {/* Safe to access walletData here */}
                    </div>
                </div>
                <div className="mb-4">
                    <span className="text-lg font-bold">Bonus Balance</span>
                    <div className="w-full h-2 bg-gray-300 rounded-full">
                        <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${walletData.bonusBalance}%` }}
                        ></div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <button className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                        Deposit
                    </button>
                    <button className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                        Withdraw
                    </button>
                </div>
            </div>

            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
                <div className="space-y-2">
                    {walletData.paymentMethods.map((method, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <span className="text-lg font-bold">{method}</span>
                        </div>
                    ))}
                </div>
                <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                    + Add New Method
                </button>
            </div>
        </div>
    );
}
