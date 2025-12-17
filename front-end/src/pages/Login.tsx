import React, { useState } from 'react'
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    onClose?: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose}) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // Perform login
            const result = await login(username, password);

            console.log('Login result:', result);

            if ('token' in result) {
                localStorage.setItem('token', result.token);
                if (onClose) {
                    onClose();
                }
                navigate("/");
                window.location.reload();
            }
            else
            {
                setError("Invalid username or password. Please try again");
            }
            /*
            // Check if response contains token
            if ('token' in result && 'userName' in result) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.userName));

                if (onClose) {
                    onClose();
                }
                // Redirect to home page after successful login
                navigate('/');
            } else {
                throw new Error('Invalid response data');
            }
                */
        } catch (error: any) {
            // Set the error state if any issue happens
            setError(error.message || 'Login failed');
        }
    };
    return (
        <div className='flex justify-center items-center h-screen bg-gray 100'>
            <form onSubmit={handleSubmit} className='bg-white text-black p-6 shadow-lg rounded-lg w-96'>
                <h2 className="text-2x1 font-bold mb-4 text-center">Login</h2>
                {error && <p className='text-red-500 text-center'>{error}</p>}
                <div className='mb-4'>
                    <input
                        type='username'
                        placeholder='Username'
                        className='w-full p-2 border border-gray-300 rounded'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required />
                </div>
                <div className='mb-4'>
                    <input
                        type='password'
                        placeholder='Password'
                        className='w-full p-2 border border-gray-300 rounded'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </div>
                <button type='submit' className='w-full bg-blue-500 text0white py-2 rounded'>Login</button>
            </form>
        </div>
    )
}

export default Login