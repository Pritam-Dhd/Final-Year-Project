import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Link,
  Breadcrumbs,
  CircularProgress,
  Paper,
} from "@mui/material";
import axiosClient from "../../Components/AxiosClient";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DTable from "../../Components/DTable";
import PieChartComponent from "../../Components/PieChartComponent";
import { useUserRole } from "../../Components/UserContext";

const Dashboard = () => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const { userRole } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== "Librarian") navigate("/dashboard");
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/dashboard-data", {
          withCredentials: true,
        });
        setInfo(response.data);
        setLoading(false);
      } catch (error) {
        alert(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="text.primary">Dashboard</Typography>
        </Breadcrumbs>
      </Grid>
      {userRole === "Librarian" && (
        <>
          <Grid item xs={6} md={2}>
            <Link href="/dashboard/user" underline="none" color="inherit">
              <Box p={2} marginRight={2} sx={{ backgroundColor: "#CCCCCD" }}>
                <Typography variant="body1">Total Users</Typography>
                <Typography variant="body2">{info.totalUsers}</Typography>
              </Box>
            </Link>
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
          <Grid item xs={6} md={2}>
            <Link href="/dashboard/publisher" underline="none" color="inherit">
              <Box p={2} marginRight={2} sx={{ backgroundColor: "#CCCCCD" }}>
                <Typography variant="body1">Total Publishers</Typography>
                <Typography variant="body2">{info.totalPublishers}</Typography>
              </Box>
            </Link>
          </Grid>
          <Grid item xs={6} md={2}>
            <Box p={2} marginRight={2} sx={{ backgroundColor: "#CCCCCD" }}>
              <Typography variant="body1">Fines Paid This month</Typography>
              <Typography variant="body2">
                Rs. {info.totalFinesPaidThisMonth}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Box p={2} marginRight={2} sx={{ backgroundColor: "#CCCCCD" }}>
              <Typography variant="body1">Total Not Returned</Typography>
              <Typography variant="body2">
                {info.totalIssuedBooksNotReturned}
              </Typography>
            </Box>
          </Grid>
        </>
      )}

      <Grid item xs={12}>
        <Box>
          <Typography variant="h6">Top 5 Issued Books of this month</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={info.topIssuedBooks}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="book"
                angle={-16}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
      {loading ? (
        <Grid item xs={12}>
          <Typography>Loading...</Typography>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          {info.topStudents.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper elevation={3}>
                <Box padding={2}>
                  <Typography variant="h6">
                    Top 5 Students with most issues of this month
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={info.topStudents}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-16}
                        textAnchor="end"
                        interval={0}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          )}
          {info.topGenres.length > 0 && (
            <Grid item xs={12} md={6}>
              <PieChartComponent
                data={info.topGenres}
                title="Top Genres"
                COLORS={["#5c3214", "#8b4340", "#af5b7b", "#bc80bf", "#acadff"]}
              />
            </Grid>
          )}
          {info.topAuthors.length > 0 && (
            <Grid item xs={12} md={6}>
              <PieChartComponent
                data={info.topAuthors}
                title="Top Authors"
                COLORS={["#5c3e3e", "#915d41", "#ac8b39", "#a1c347", "#33b967"]}
              />
            </Grid>
          )}
          {info.topPublishers.length > 0 && (
            <Grid item xs={12} md={6}>
              <PieChartComponent
                data={info.topPublishers}
                title="Top Publishers"
                COLORS={["#0c505c", "#217c77", "#5aa884", "#a4d289", "#d0c878"]}
              />
            </Grid>
          )}
        </>
      )}

      <Grid item xs={12} md={6}>
        <Box>
          <Typography variant="h6">Unpaid Fines</Typography>
          <DTable columns={["user", "amount", "book"]} rows={info.fines} />
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Box>
          <Typography variant="h6">One Day Overdue Issues</Typography>
          <DTable columns={["user", "book"]} rows={info.oneDayOverdueIssues} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
