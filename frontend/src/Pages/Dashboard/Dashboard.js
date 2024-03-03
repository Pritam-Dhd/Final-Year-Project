import React, { useState, useEffect } from "react";
import { Box, Typography,Container } from "@mui/material";
import axiosClient from "../../Components/AxiosClient";

const Dashboard = ({ userRole }) => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, booksResponse, publishersResponse] =
          await Promise.all([
            axiosClient.get("/get-total-users", { withCredentials: true }),
            axiosClient.get("/get-total-books", { withCredentials: true }),
            axiosClient.get("/get-total-publishers", { withCredentials: true }),
          ]);
          console.log(usersResponse)
        setInfo({
          totalUsers: usersResponse.data.totalUsers,
          totalBooks: booksResponse.data.totalBooks,
          totalPublishers: publishersResponse.data.totalPublishers,
        });
      } catch (error) {
        alert(error);
      }
    };

    // if (userRole === "Librarian") {
      fetchData();
    // }
  }, [userRole]);

  return (
    <Container>
      <Box
      container
        sx={{
          display: "flex",
          alignItem:"center",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        {userRole === "Librarian" && (
          <Box
            sx={{
              bgcolor: "info.main",
              color: "info.contrastText",
              p: 2,
              borderRadius: 1,
            }}
          >
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{info.totalUsers}</Typography>
          </Box>
        )}
        <Box
          sx={{
            bgcolor: "success.main",
            color: "success.contrastText",
            p: 2,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6">Total Books</Typography>
          <Typography variant="h4">{info.totalBooks}</Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "warning.main",
            color: "warning.contrastText",
            p: 2,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6">Total Publishers</Typography>
          <Typography variant="h4">{info.totalPublishers}</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
