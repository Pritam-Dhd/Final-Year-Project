import React from 'react'
import Button from '@mui/material/Button'

const Dashboard = () => {
  return (
    <>
    <Button variant="outlined" color="info" onClick={()=>{
      localStorage.removeItem('userData')
      localStorage.removeItem('userRole ')
      window.location.href = '/login'
    }}>
      Logout
    </Button>
    </>
  )
}

export default Dashboard