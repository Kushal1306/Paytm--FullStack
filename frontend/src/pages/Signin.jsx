import React, { useState } from 'react'

import { Heading } from '../components/Heading'
import { SubHeading } from '../components/SubHeading'
import { InputBox } from '../components/InputBox'
import { Button } from '../components/Button'
import { BottomWarning } from '../components/BottomWarning'
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

function Signin() {
  const navigate = useNavigate();
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const handleButton = async () => {
    try {
      console.log(userName, password);
      const response = await axios.post("https://paytm-full-stack.vercel.app/api/user/signin", {
        userName,
        password
      });
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");

    } catch (error) {
      console.log(error);
    }
  };
  const handleGoogleSignIn = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log(decoded);
      const response = await axios.post('https://paytm-full-stack.vercel.app/api/user/google-signin', {
        token: credentialResponse.credential,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  }

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            type="email"
            value={userName}
            onChange={(e) => {
              setuserName(e.target.value);
            }} placeholder="name@gmail.com" label={"Email"} />
          <InputBox
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="123456" label={"Password"} />
          <div className="pt-4">
            <Button label={"Sign in"} onClick={handleButton} />
          </div>
          <div className='pt-4 w-full'>
            <div className="w-full justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSignIn}
                onError={() => console.log('login failed')}
              />
            </div>
          </div>
          <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
        </div>
      </div>
    </div>
  )
}

export default Signin