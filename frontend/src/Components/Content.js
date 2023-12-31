// Content.js
import React from 'react';
import { Typography } from '@mui/material';
import Book from './Book';
import Genre from './Genre';
import { useParams } from 'react-router-dom';

const Content = () => {
  const { '*': section } = useParams('/dashboard/');
  console.log(section);

  const renderContent = () => {
    switch (section) {
      case '':
        return (
          <Typography paragraph>
            Dashboard
          </Typography>
        );
      case 'home':
        return (
          <Typography paragraph>
            Dashboard
          </Typography>
        );
      case 'book':
        return (
          <Book />
        );
      case 'genre':
        return (
          <Genre />
        );
      case 'send-email':
        return (
          <Typography paragraph>
            {/* Your send-email content here */}
          </Typography>
        );
      default:
        return (
          <Typography paragraph>
            {/* Default Content */}
          </Typography>
        );
    }
  };

  return <>{renderContent()}</>;
};

export default Content;
