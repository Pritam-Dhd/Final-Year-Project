import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Link,
  CircularProgress,
  Select,
  MenuItem,
  Button,
  Paper,
  Breadcrumbs,
  LinearProgress,
} from "@mui/material";
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
import axiosClient from "../../Components/AxiosClient";
import PieChartComponent from "../../Components/PieChartComponent";
import { useUserRole } from "../../Components/UserContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DTable from "../../Components/DTable";
import { DataGrid } from "@mui/x-data-grid";
import TableToolbar from "../../Components/TableToolbar";

const Report = () => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const { userRole } = useUserRole();
  const navigate = useNavigate();
  const [notSearch, setNotSearch] = useState(true);
  const [reportName, setReportName] = useState("book");
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const onSubmit = async () => {
    try {
      const response = await axiosClient.get(
        `/get-report?reportName=${reportName}&from=${from}&to=${to}`,
        {
          withCredentials: true,
        }
      );
      setInfo(response.data);
      console.log(info);
      setLoading(false);
      setNotSearch(false);
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Breadcrumbs aria-label="breadcrumb" ml={2} mt={2}>
        <Typography color="text.primary">Report</Typography>
      </Breadcrumbs>
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <Select
              labelId="report-name-label"
              id="report-name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              fullWidth
            >
              <MenuItem value={"book"}>Book</MenuItem>
              <MenuItem value={"student"}>Student</MenuItem>
              <MenuItem value={"genre"}>Genre</MenuItem>
              <MenuItem value={"author"}>Author</MenuItem>
              <MenuItem value={"publisher"}>Publisher</MenuItem>
              <MenuItem value={"fine"}>Fine</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From Date"
                name="fromDate"
                value={from}
                onChange={(e) => setFrom(e)}
                required
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="To Date"
                name="toDate"
                value={to}
                onChange={(e) => setTo(e)}
                required
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button onClick={onSubmit} variant="contained">
              Search
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {loading ? (
        notSearch ? null : (
          <Grid item xs={12}>
            <Typography>Loading...</Typography>
            <CircularProgress />
          </Grid>
        )
      ) : info.title === "Top 5 genres" ||
        info.title === "Top 5 authors" ||
        info.title === "Top 5 publishers" ? (
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={6}>
            <PieChartComponent
              data={info.report}
              title={info.title}
              COLORS={[
                "#60beaa",
                "#ae3737",
                "#67b287",
                "#94802e",
                "#75a364",
                "#ab5328",
                "#849345",
                "#a16b23",
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DTable columns={["name", "total"]} rows={info.report} />
          </Grid>
        </Grid>
      ) : info.title === "Top 5 books" || info.title === "Top 5 students" ? (
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3}>
              <Box padding={2}>
                <Typography variant="h6">{info.title}</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={info.report}
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
                    <Bar dataKey="issues" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <DTable columns={["name", "issues"]} rows={info.report} />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={12}>
            <Paper elevation={3}>
              <Box padding={2}>
                <Typography variant="h6" mb={1}>{info.title}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3}>
                      <Box padding={2}>
                        <Typography variant="h6">
                          {"Top 5 most fine paid student"}
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={info.report.slice(0, 5)}
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
                  <Grid item xs={12} md={6}>
                    <DataGrid
                      rows={info.report.map((row, index) => ({
                        id: index,
                        ...row,
                      }))}
                      columns={[
                        { field: "name", headerName: "Name", width: 350 },
                        {
                          field: "total",
                          headerName: "Total Fines Paid",
                          width: 200,
                        },
                      ]}
                      loading={loading}
                      pagination={{ pageSize: 5 }}
                      //   getRowHeight={() => "auto"}
                      initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                        sorting: {
                          sortModel: [{ field: "total", sort: "desc" }],
                        },
                      }}
                      pageSizeOptions={[5, 10, 15]}
                      disableRowSelectionOnClick
                      slots={{
                        toolbar: () => <TableToolbar filename="Fines" />,
                        loadingOverlay: LinearProgress,
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default Report;
