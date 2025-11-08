import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import React, {useState} from 'react'


const Register: React.FC = () => {
    const[name, setName] = useState<string>('');
    const[email, setEmail] = useState<string>('');
    const[password, setPassword] = useState<string>('');
    const[confirmPassword, setConfirmPassword] = useState<string>('');
    const[roleName, setRoleName] = useState<string>('');
    const[error, setError] = useState<string>('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        if(password !== confirmPassword)
        {
            setError("Passwords do not match");
            return;
        }
        try
        {
            await register(name, email, password, confirmPassword, roleName);
            console.log("User registered");
            navigate('/');
        }
        catch (error:any)
        {
            setError(error.message || "Registration failed. Please try again");
        }
    }
    return (
        <div className='flex justify-center items-center h-screen bg-gray 100'>
            <form onSubmit={handleSubmit} className='bg-white text-black p-6 shadow-lg rounded-lg w-96'>
                <h2 className="text-2x1 font-bold mb-4 text-center">Register</h2>
                {error && <p className='text-red-500 text-center'>{error}</p>}
                <div className='mb-4'>
                    <input
                        type='text'
                        placeholder='Name'
                        className='w-full p-2 border border-gray-300 rounded'
                        value= {name}
                        onChange={(e) => setName(e.target.value)}
                        required />
                </div>
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
                <div className='mb-4'>
                    <input
                        type='password'
                        placeholder='Confirm Password'
                        className='w-full p-2 border border-gray-300 rounded'
                        value= {confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required />
                </div>
                <div className='mb-4'>
                    <select
                    className='w-full p-2 border border-gray-300 rounded'
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    required>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <button type='submit' className='w-full bg-blue-500 text0white py-2 rounded'>Register</button>

            </form>

        </div>
    )
}

export default Register