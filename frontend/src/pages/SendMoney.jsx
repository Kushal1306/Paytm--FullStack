import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';


function SendMoney() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState(0);
  const {enqueueSnackbar}=useSnackbar();

  const initiateTransfer = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/account/transfer",
        {
          amount,
          to: id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      enqueueSnackbar('Transfer Successfull',{variant:'success'});
      console.log(response.data); // Handle success response
    } catch (error) {
      enqueueSnackbar('Insufficient Balance/Error occured',{variant:'failure'});
      console.error('Error during transfer:', error); // Handle error response
    }
  };

  return (
    <div className='flex justify-center h-screen bg-gray-100'>
      <div className='h-full flex flex-col justify-center'>
        <div className='border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg'>
          <div className='flex flex-col space-y-4 p-6'>
            <h2 className='text-3xl font-bold text-center'>Send Money</h2>
            <div className='flex items-center space-x-4'>
              <div className='w-12 h-12 rounded-full bg-green-500 flex items-center justify-center'>
                <span className='text-2xl text-white'>{name[0].toUpperCase()}</span>
              </div>
              <h3 className='text-2xl font-semibold'>{name}</h3>
            </div>
            <div className='space-y-2'>
              <label
                className='text-sm font-medium'
                htmlFor="amount"
              >
                Amount (in Rs)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                className='h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:border-blue-500'
                id="amount"
                placeholder='Enter amount'
              />
            </div>
          </div>
          <button
            onClick={initiateTransfer}
            className='text-white bg-green-500 hover:bg-green-600 rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full'
          >
            Initiate Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

export default SendMoney;


// import React from 'react'
// import { useSearchParams } from 'react-router-dom'
// import { useState } from 'react'
// import axios from 'axios';

// function SendMoney() {
//   const [searchParams]=useSearchParams();
//   const id=searchParams.get("id");
//   const name=searchParams.get("name");
//   const [amount,setAmount]=useState(0);
//   return (
//     <div className='flex justify-center h-screen bg-gray-100'>
//       <div className='h-full flex flex-col justify-center'>
//         <div className='border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg'>
//           <div className='flex flex-col space-y-1.5 p-6'>
//             <h2 className='text-3xl font-bold text-center'> Send Money</h2>
//           </div>
//           <div className='p-6'>
//             <div className='flex items-center spaxe-x-4'>
//               <div className='w-12 h-12 rounded-full bg-green-500 flex items-center justify-center'>
//                 <span className='text-2xl text-white'>{name[0].toUpperCase()}</span>
//               </div>
//               <h3 className='text-2xl font-semibold ml-2'>{name}</h3>
//             </div>
//             <div className='space-y-4'>
//               <div className='space-y-2'>
//               <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
//               for="amount"
//               >
//                 Amount (in Rs)
//               </label>
//              <input type="number"
//              value={amount}
//              onChange={(e)=>{
//               setAmount(e.target.value);
//              }} 
//              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
//              id="number"
//              placeholder='Enter amount'
//              /> 
//             </div>
//             <button
//             onClick={async()=>{
//               const token=localStorage.getItem("token");
//               const response =await axios.post("http://localhost:3000/api/v1/account/transfer",{
//                amount,
//                to:id
//               },{
//                 headers:`Authorization ${token}`
//               });
//             }}
//             className='justofy-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white'
//             >Initiate Transfer</button>
//           </div>
//         </div>
//       </div>
//     </div>
//     </div>
//   )
// }

// export default SendMoney