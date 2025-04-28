import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl , getUserData} = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const onSubmitHandler = async (event) => {
    /*event.preventDefault();*/
    try {
      event.preventDefault();

      axios.defaults.withCredentials = true

      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          setToken(response.data.token)
          getUserData()
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          getUserData()
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const handlerSucess = async (credentialResponse) => {
    try {
      const response = await axios.post(backendUrl + '/api/user/google-login', { id_token: credentialResponse.credential });
      if (response.data.success) {
        const { token: backendToken } = response.data; // Lấy token từ response body
        setToken(backendToken); // Cập nhật state token trong ShopContext
        getUserData();
        localStorage.setItem('token', backendToken); // Lưu vào localStorage
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
    toast.error(error.message)
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-[400px] m-auto mt-14 gap-6 text-gray-800 bg-white p-8 rounded-xl shadow-lg'>
      <div className='inline-flex items-center gap-2 mb-4'>
        <p className='text-4xl font-semibold text-gray-800'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      
      {currentState === 'Login' ? '' : <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500' placeholder='Full Name' required />}
      
      <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500' placeholder='Email' required />
      <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500' placeholder='Password' required />

      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p onClick={()=>navigate('/forgot-password')} className='cursor-pointer text-gray-600 hover:text-purple-600'>Forget your password?</p>
        {
          currentState === 'Login'
            ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer text-gray-600 hover:text-purple-600'>Create account</p>
            : <p onClick={() => setCurrentState('Login')} className='cursor-pointer text-gray-600 hover:text-purple-600'>Login Here</p>
        }
      </div>
      
      <button className='bg-purple-600 text-white font-semibold px-8 py-3 mt-4 rounded-md shadow-md hover:bg-purple-700 transition-all duration-300'>
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>

      <div className="w-full flex items-center gap-4 mt-6">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="text-gray-500 text-sm">or</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <div className="w-full flex justify-center mt-4">
        <GoogleLogin
          onSuccess={handlerSucess}
          onError={handlerError}
          theme="filled_black"
          text="signin_with"
          size="large"
          shape="rectangular"
        />
      </div>
    </form>
  )
}

export default Login
