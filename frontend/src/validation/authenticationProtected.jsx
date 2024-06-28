import { useState,useEffect } from "react";
import {validateToken} from './authUtils';
import { Navigate } from "react-router-dom";


 function ProtectedRoute({children}){
    const [isAuthenticated,setIsAuthenticated]=useState(null);

    useEffect(()=>{
        const checkAuth=async()=>{
            const valid=await validateToken();
            setIsAuthenticated(valid);
        };
        checkAuth();

    },[]);
   if(isAuthenticated==null)
    return <div>Loading...</div>

   return isAuthenticated ? children :<Navigate to="/sigin"/>

}

export default ProtectedRoute;