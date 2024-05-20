import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext.jsx';
import eye from '../assets/eye.png';
import closeEye from '../assets/close-eye.png';
import NewsGeoLogo from '../assets/logo.jpg';
import google from '../assets/google.png';

import { useGoogleLogin } from '@react-oauth/google';
const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const navigate = useNavigate();
    const { signin } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setEmailError(false);
        setPasswordError(false);
       
        if (!email.trim() && !password.trim()) {
            setError('All fields are required');
            if (!email.trim()) setEmailError(true);
            if (!password.trim()) setPasswordError(true);
            return;
        }
        if(!email.trim()){
            setError('Email is required');
            setEmailError(true);
            return;
        }
        if(!password.trim()){
            setError('Password is required');
            setPasswordError(true);
            return;
        }
 
        axios.post('http://localhost:3000/signin', { email, password })
            .then(res => {
                if (res.data === 'Success') {
                    signin();
                    navigate('/portal');
                } else {
                    setError('Invalid email or password');
                    setEmailError(true);
                    setPasswordError(true);
                }
            })
            .catch(error => {
                if (error.response.status === 401) {
                    setError('Incorrect Password');
                    setPasswordError(true);
                } else if (error.response.status === 404) {
                    setError('User not registered');
                    setEmailError(true);
                } else {
                    setError('Something went wrong, please try again later.');
                }
            });
    };
  

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handlePasswordPaste = (e) => {
        e.preventDefault();
    };

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const { access_token: token } = tokenResponse;
            try {
                const res = await axios.post('http://localhost:3000/google-signin', { token });
                if (res.status === 200) {
                    signin();
                    navigate('/portal');
                }
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError('User not registered');
                } else {
                    setError('An error occurred. Please try again later.');
                }
            }
        },
        onError: () => {
            console.log('Login Failed');
            setError('Login failed. Please try again.');
        }
    });

    

    return (
        <div className="signin flex flex-col justify-center items-center h-screen bg-white">
          <img src={NewsGeoLogo} alt="Logo" className="absolute top-0 right-0 mt-4 mr-4" />
            <form onSubmit={handleSubmit} className="p-8 w-96 flex flex-col" noValidate>
                <h2 className="text-2xl font-bold text-left mb-4">Sign in</h2>
                <p className="text-[#a7a7a7] text-left pb-8">Sign in to build the backbone of a system that captures the pulse of global events.</p>
                {error && <p className="text-red-500 text-left py-4" >{error}</p>}
                <div className="mb-4">
                   
                    <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className={`form-input mt-1 block w-full rounded shadow-[0_3px_10px_rgb(0,0,0,0.2)] ${emailError ? 'border-red-500 border-2' : 'border-gray-500'} px-4 py-2`}
                        required
                        placeholder='Email'
                    />
                       
                </div>
                <div className="mb-6">
                    
                    <div className='relative'>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            onPaste={handlePasswordPaste}
                            className={`form-input mt-1 block w-full rounded shadow-[0_3px_10px_rgb(0,0,0,0.2)] ${passwordError ? 'border-red-500 border-2' : 'border-gray-500'} px-4 py-2 `}
                            required
                            placeholder='Password'
                        />
                        <button
                            type="button"
                            className="absolute top-2 right-2 text-gray-500"
                            onClick={toggleShowPassword}>
                            {showPassword ? <img src={eye} style={{ width: '20px', height: '20px' }} alt="Hide" /> : <img src={closeEye} style={{ width: '20px', height: '20px' }} alt="Show" />}
                        </button>
                    </div>
                </div>
                <button type="submit" className="bg-black  text-white font-bold py-2 px-7 rounded text-center w-[120px] self-center">
                    Sign in
                </button>
                <p className='text-[#a7a7a7] py-5'>Don't have an account? <Link to="/signup" className="text-black font-bold hover:underline">Signup</Link></p>
                
                <div className="flex items-center my-4">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-4 text-gray-500">OR</span>
                    <hr className="flex-grow border-gray-300" />
                </div>
                <button
                    type="button"
                    onClick={login}
                    className="bg-black text-white font-bold py-2 px-7 rounded text-center mt-3 self-center flex gap-2 items-center"
                >
                    <p>Sign in with google</p>
                    <img src={google} alt="google-logo" className='w-4 h-4'/>
                </button>
            </form>
          
            
        </div>
    );
};

export default Signin;
