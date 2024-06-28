import React from 'react'
import Balance from '../components/Balance'
import {Users} from '../components/Users'
import AppBar from '../components/AppBar'

function Dashboard() {
  return (
    <div>
      <AppBar/>
      <div className='m-8'>
        <Balance/>
        <Users/>
      </div>
    </div>
  )
}

export default Dashboard