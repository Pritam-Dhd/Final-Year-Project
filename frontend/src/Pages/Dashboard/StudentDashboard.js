import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Card,
  Link,
  Breadcrumbs,
  Skeleton,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axiosClient from "../../Components/AxiosClient";
import DTable from "../../Components/DTable";
import { useUserRole } from "../../Components/UserContext";

const StudentDashboard = () => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const { userRole } = useUserRole();

  const formatDate = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDate.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

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

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/dashboard-data", {
        withCredentials: true,
      });
      const formattedData = {
        ...response.data,
        issuedBooks: response.data.issuedBooks.map((book) => ({
          ...book,
          issueDate: formatDate(book.issueDate),
          dueDate: formatDate(book.dueDate),
        })),
      };
      setInfo(formattedData);
      setLoading(false);
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === "Student") {
      fetchData();
    }
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="text.primary">Dashboard</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={6} md={2}>
        <Link href="/dashboard/book" underline="none" color="inherit">
          <Box p={2} marginRight={2} sx={{ backgroundColor: "#CCCCCD" }}>
            <Typography variant="body1">Total Books</Typography>
            <Typography variant="body2">{info.totalBooks}</Typography>
          </Box>
        </Link>
      </Grid>
      <Grid item xs={6} md={2}>
        <Link href="/dashboard/author" underline="none" color="inherit">
          <Box p={2} marginRight={2} sx={{ backgroundColor: "#CCCCCD" }}>
            <Typography variant="body1">Total Authors</Typography>
            <Typography variant="body2">{info.totalAuthors}</Typography>
          </Box>
        </Link>
      </Grid>
      <Grid item xs={6} md={2}>
        <Link href="/dashboard/genre" underline="none" color="inherit">
          <Box p={2} marginRight={2} sx={{ backgroundColor: "#CCCCCD" }}>
            <Typography variant="body1">Total Genres</Typography>
            <Typography variant="body2">{info.totalGenres}</Typography>
          </Box>
        </Link>
      </Grid>
      <Grid item xs={12} md={2}>
        <Link href="/dashboard/publisher" underline="none" color="inherit">
          <Box p={2} marginRight={2} sx={{ backgroundColor: "#CCCCCD" }}>
            <Typography variant="body1">Total Publishers</Typography>
            <Typography variant="body2">{info.totalPublishers}</Typography>
          </Box>
        </Link>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Most Popular Books:
        </Typography>
      </Grid>
      {loading ? (
        <Grid item xs={12}>
          <Skeleton variant="rectangular" width="100%" height={250} />
        </Grid>
      ) : (
        <>
          {info.topPopularBooks
            .slice(
              currentPage * booksPerPage(),
              (currentPage + 1) * booksPerPage()
            )
            .map((book) => (
              <Grid item xs={12} sm={6} md={3} key={book._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Link
                    href={`/dashboard/book/${encodeURIComponent(book.name)}/${
                      book._id
                    }`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={book.image}
                      alt={book.name}
                    />
                    <CardContent>
                      <Typography variant="subtitle1">{book.name}</Typography>
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
                disabled={
                  (currentPage + 1) * booksPerPage() >=
                  info.topPopularBooks.length
                }
                variant="outlined"
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          </Grid>{" "}
        </>
      )}
      <Grid item xs={12} md={6}>
        <Box>
          <Typography variant="body1">Not Returned Books</Typography>
          <DTable
            columns={["book", "issueDate", "dueDate"]}
            rows={info.issuedBooks}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default StudentDashboard;
