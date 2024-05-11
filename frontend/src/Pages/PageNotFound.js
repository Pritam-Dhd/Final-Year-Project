import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

const PageNotFound = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h1" style={{ marginBottom: '16px' }}>
        404
      </Typography>
      <Typography variant="h5" style={{ marginBottom: '16px' }}>
        Page Not Found
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/dashboard"
        style={{ marginTop: '16px', padding: '10px 24px' }}
      >
        Return to Dashboard
      </Button>
    </div>
  );
};

export default PageNotFound;
