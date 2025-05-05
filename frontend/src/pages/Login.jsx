import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl, getUserInfo } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);



  const onSubmitHandler = async (event) => {
      event.preventDefault();
      axios.defaults.withCredentials = true;

      if (!email || !password || (currentState === 'Sign Up' && (!name || !confirmPassword))) {
        toast.error('Please fill in all required fields.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Invalid email format.');
        return;
      }

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|\\:;"'<>,.?/~`-]).{6,}$/;

      if (!passwordRegex.test(password)) {
        toast.error('Password must be at least 6 characters, include a letter, a number, and a special character.');
        return;
      }

      if (password.length < 6) {
        toast.error('Password must be at least 6 characters.');
        return;
      }

      if (currentState === 'Sign Up' && password !== confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }

      try {
        setLoading(true);
        if (currentState === 'Sign Up') {
          const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
          if (response.data.success) {
            setToken(response.data.token);
            getUserInfo(); // ✅ dùng đúng hàm
            localStorage.setItem('token', response.data.token);
            if (rememberMe) localStorage.setItem('token', response.data.token);
          } else {
            toast.error(response.data.message);
          }
        } else {
          const response = await axios.post(backendUrl + '/api/user/login', { email, password });
          if (response.data.success) {
            setToken(response.data.token);
            getUserInfo(); // ✅ dùng đúng hàm
            localStorage.setItem('token', response.data.token);
            if (rememberMe) localStorage.setItem('token', response.data.token);
          } else {
            toast.error(response.data.message);
          }
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    const handlerSuccess = async (credentialResponse) => {
      try {
        setLoading(true);
        const response = await axios.post(backendUrl + '/api/user/google-login', { id_token: credentialResponse.credential });
        if (response.data.success) {
          const { token: backendToken } = response.data;
          setToken(backendToken);
          getUserInfo(); // ✅ dùng đúng hàm
          localStorage.setItem('token', backendToken);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };

    const handlerError = (error) => {
      console.log(error);
      toast.error(error.message);
    };

    useEffect(() => {
      if (token) {
        navigate('/');
      }
    }, [token]);

    return (
      <div className="fixed inset-0 bg-transparent flex justify-center items-center z-50 backdrop-blur-xl">
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col items-center w-[90%] sm:max-w-[400px] m-auto mt-14 gap-6 text-gray-800 bg-white p-8 rounded-3xl shadow-2xl"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <p className="text-4xl font-semibold text-gray-800">{currentState}</p>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
          </div>

          {currentState === 'Sign Up' && (
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
              placeholder="Full Name"
              required
            />
          )}

          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
            placeholder="Email"
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
            placeholder="Password"
            required
          />

          {currentState === 'Sign Up' && (
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
              placeholder="Confirm Password"
              required
            />
          )}

          {/* Ghi nhớ mật khẩu */}
          {currentState === 'Login' && (
            <div className="w-full flex items-center justify-between text-sm mt-[-8px]">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <p onClick={() => navigate('/forgot-password')} className="cursor-pointer text-gray-600 hover:text-purple-600">
                Forgot password?
              </p>
            </div>
          )}

          <div className="w-full text-sm">
            {currentState === 'Login' ? (
              <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer text-gray-600 hover:text-purple-600 mt-[-12px] text-right">
                Create account
              </p>
            ) : (
              <p onClick={() => setCurrentState('Login')} className="cursor-pointer text-gray-600 hover:text-purple-600 mt-[-12px] text-right">
                Login Here
              </p>
            )}
          </div>

          <button
            disabled={loading}
            className={`bg-purple-600 text-white font-semibold px-8 py-3 mt-4 rounded-md shadow-lg transition-all duration-300 ease-in-out ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-700'
              }`}
          >
            {loading ? 'Processing...' : currentState === 'Login' ? 'Sign In' : 'Sign Up'}
          </button>

          <div className="w-full flex items-center gap-4 mt-6">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="text-gray-500 text-sm">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <div className="w-full flex justify-center mt-4">
            <GoogleLogin
              onSuccess={handlerSuccess}
              onError={handlerError}
              theme="filled_black"
              text="signin_with"
              size="large"
              shape="rectangular"
            />
          </div>
        </form>
      </div>
    );
  };

  export default Login;
