import React, { useState } from 'react'

import {login} from '../api/auth';

interface LoginProps {
  onClose?: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
    const[email, setEmail] = useState<string>('');
    const[password, setPassword] = useState<string>('');
    const[error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try
        {
            const response = await login(email,password);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.userName));
            if(onClose)
            {
                onClose();
            }
        }
        catch(error: any)
        {
            setError(error.message || 'Login failed');
        }
    }
        return (
        <div className='flex justify-center items-center h-screen bg-gray 100'>
            <form onSubmit={handleSubmit} className='bg-white text-black p-6 shadow-lg rounded-lg w-96'>
                <h2 className="text-2x1 font-bold mb-4 text-center">Login</h2>
                {error && <p className='text-red-500 text-center'>{error}</p>}
                <div className='mb-4'>
                    <input
                        type='email'
                        placeholder='Email'
                        className='w-full p-2 border border-gray-300 rounded'
                        value= {email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                </div>
                <div className='mb-4'>
                    <input
                        type='password'
                        placeholder='Password'
                        className='w-full p-2 border border-gray-300 rounded'
                        value= {password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </div>
                <button type='submit' className='w-full bg-blue-500 text0white py-2 rounded'>Login</button>
            </form>
        </div>
    )
}

export default Login