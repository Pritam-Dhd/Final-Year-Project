import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Sidebar from '../Components/Sidebar.js';
import Content from '../Components/Content.js';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>      
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: 9,}}>
        <Button variant="outlined" color="info" onClick={handleLogout}>
          Logout
        </Button>
        <Box sx={{display:'flex'}}>
        <Content />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
