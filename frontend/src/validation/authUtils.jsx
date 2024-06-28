import axios from "axios";

export const isLoggedIn=()=>{
    const token=localStorage.getItem("token");
    if(token)
        return true;
    return false;
}

export  const validateToken=async()=>{
    const token=localStorage.getItem("token");
    if(!token)
        return false;
    try {
        const response=await axios.get("http://localhost:3000/api/user/validate-token",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
      return response.data.valid;
        
    } catch (error) {
        console.error("Token validation error:",error);
        return false;
        
    }

};