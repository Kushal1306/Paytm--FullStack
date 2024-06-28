import { useState } from 'react';
import './index.css';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import { isLoggedIn } from './validation/authUtils';
import ProtectedRoute from './validation/authenticationProtected';

function App() {
  return (
    <GoogleOAuthProvider clientId="90252798107-v0i4arudclms2qv3ubrsi708evgam3j7.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={isLoggedIn() ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path='/signin' element={isLoggedIn() ? <Navigate to="/dashboard" /> : <Signin />} />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path='/send' element={
            <ProtectedRoute>
              <SendMoney />
            </ProtectedRoute>
          } />
          <Route path='/' element={isLoggedIn() ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
