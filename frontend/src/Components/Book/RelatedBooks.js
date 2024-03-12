import React, { useState, useEffect } from "react";
import {useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Box,
  Button,
  Card,
  Link,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const RelatedBooks = ({ relatedBooks }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const booksPerPage = () => {
    if (window.innerWidth <= 600) return 2;
    if (window.innerWidth <= 960) return 3;
    return 4;
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(0, prevPage - 1));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom color="blue">
          Related Books:
        </Typography>
      </Grid>
      {relatedBooks
        .slice(currentPage * booksPerPage(), (currentPage + 1) * booksPerPage())
        .map((relatedBook) => (
          <Grid item xs={12} sm={6} md={3} key={relatedBook._id}>
            <Card>
              <Link
                href={`/dashboard/book/${relatedBook.name}/${relatedBook._id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={relatedBook.image}
                  alt={relatedBook.name}
                />
                <CardContent>
                  <Typography variant="subtitle1">
                    {relatedBook.name}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        ))}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <IconButton
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            variant="outlined"
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            onClick={handleNextPage}
            disabled={(currentPage + 1) * booksPerPage() >= relatedBooks.length}
            variant="outlined"
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RelatedBooks;
