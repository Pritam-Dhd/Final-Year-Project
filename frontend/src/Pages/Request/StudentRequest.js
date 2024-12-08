import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Breadcrumbs,
  LinearProgress,
  Typography,
} from "@mui/material";
import axiosClient from "../../Components/AxiosClient.js";
import { DataGrid } from "@mui/x-data-grid";
import TableToolbar from "../../Components/TableToolbar";

const LibrarianRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  // Function to format date to "Y-M-D"
  const formatDate = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDate.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    axiosClient
      .get("/get-request", { withCredentials: true })
      .then(function (response) {
        const data = response.data.requests;
        setRequests(data);
        setLoading(false); // After data fetching, set loading to false
        console.log(data);
      })
      .catch(function (error) {
        setLoading(false); // Set loading to false in case of error too
        alert(error);
      });
  }, []);

  const columns = [
    { field: "book", headerName: "Book", width: 500 },
    // { field: "user", headerName: "User", width: 230 },
    { field: "requestDate", headerName: "Request Date", width: 130 },
    { field: "requestType", headerName: "Request Type", width: 130 },
    { field: "status", headerName: "Status", width: 430 },
  ];

  const rows = requests
    ? requests.map((request) => ({
        id: request._id,
        book: request.issue ? request.issue.book.name : request.book.name,
        bookId: request.issue ? request.issue.book._id : null,
        issueId: request.issue ? request.issue._id : null,
        user: `${request.user.name} (${request.user.email})`,
        userId: request.user._id,
        requestDate: formatDate(request.requestDate),
        requestType: request.requestType,
        status: request.status,
      }))
    : [];

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Breadcrumbs aria-label="breadcrumb" ml={2} mt={2}>
            <Typography color="text.primary">Request</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Box
        sx={{
          overflow: "auto",
          height: "460px",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pagination={{ pageSize: 10 }}
          loading={loading} // Use the loading state
          // getRowHeight={() => "auto"}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            // sorting: {
            //   sortModel: [{ field: "dueDate", sort: "desc" }],
            // },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          slots={{
            toolbar: () => <TableToolbar filename="Requests" />,
            loadingOverlay: LinearProgress,
          }}
        />
      </Box>
    </Paper>
  );
};

export default LibrarianRequest;
