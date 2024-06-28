import React, { useEffect, useState } from 'react'
import axios from 'axios';

function Balance() {
    const [balance,setBalance]=useState(0);
    useEffect(()=>{
      try {
        const token=localStorage.getItem('token');
        console.log(token);
        const fetchBalance=async()=>{
          const response=await axios.get('https://paytm-full-stack.vercel.app/api/account/balance',{
              headers:{ Authorization:`Bearer ${token}`},
          });
          console.log("the response is",response.data);
          console.log(response.data.balance);
          setBalance(response.data.balance);

        };
        fetchBalance();
      } catch (error) {
        console.error('Error fetching balance:', error);
      }

    },[]);
  return (
    <div className='flex'>
        <div className='font-bold text-lg'>
          Your Balance
        </div>
        <div className='font-semibold ml-4 text-lg'>
            Rs {balance}
        </div>

    </div>
  )
}

export default Balance