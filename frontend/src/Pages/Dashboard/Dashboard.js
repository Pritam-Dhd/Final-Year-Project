import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import axiosClient from "../../Components/AxiosClient";
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

const Dashboard = ({ userRole }) => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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
      {userRole === "Librarian" && (
        <>
          <Grid item xs={12} md={2}>
            <Box p={2} marginRight={2} sx={{ backgroundColor: "#CCCCCD" }}>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{info.totalUsers}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box p={2} marginRight={2} sx={{ backgroundColor: "#CCCCCD" }}>
              <Typography variant="h6">Total Books</Typography>
              <Typography variant="h4">{info.totalBooks}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box p={2} marginRight={2} sx={{ backgroundColor: "#CCCCCD" }}>
              <Typography variant="h6">Total Authors</Typography>
              <Typography variant="h4">{info.totalAuthors}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box p={2} marginRight={2} sx={{ backgroundColor: "#CCCCCD" }}>
              <Typography variant="h6">Total Genres</Typography>
              <Typography variant="h4">{info.totalGenres}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box p={2} marginRight={2} sx={{ backgroundColor: "#CCCCCD" }}>
              <Typography variant="h6">Total Publishers</Typography>
              <Typography variant="h4">{info.totalPublishers}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box p={2} marginRight={2} sx={{ backgroundColor: "#CCCCCD" }}>
              <Typography variant="h6">Fines Paid This month</Typography>
              <Typography variant="h4">
                Rs. {info.totalFinesPaidThisMonth}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box p={2} marginRight={2} sx={{ backgroundColor: "#CCCCCD" }}>
              <Typography variant="h6">Total Not Returned</Typography>
              <Typography variant="h4">
                {info.totalIssuedBooksNotReturned}
              </Typography>
            </Box>
          </Grid>
        </>
      )}

      <Grid item xs={12}>
        <Box>
          <Typography variant="h6">Top 5 Issued Books</Typography>
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
        </Grid>
      ) : (
        <>
          {info.topStudents.length > 0 && (
            <Grid item xs={12} md={6}>
              <PieChartComponent
                data={info.topStudents}
                title="Top 5 Students with most issues"
              />
            </Grid>
          )}{" "}
          {info.topGenres.length > 0 && (
            <Grid item xs={12} md={6}>
              <PieChartComponent data={info.topGenres} title="Top Genres" />
            </Grid>
          )}
          {info.topAuthors.length > 0 && (
            <Grid item xs={12} md={6}>
              <PieChartComponent data={info.topAuthors} title="Top Authors" />
            </Grid>
          )}
          {info.topPublishers.length > 0 && (
            <Grid item xs={12} md={6}>
              <PieChartComponent
                data={info.topPublishers}
                title="Top Publishers"
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
