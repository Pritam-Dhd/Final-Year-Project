import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  Paper,
  Grid,
  IconButton,
  LinearProgress,
} from "@mui/material";
import axiosClient from "../../Components/AxiosClient.js";
import SnackBar from "../../Components/SnackBar";
import DoneIcon from "@mui/icons-material/Done";
import { DataGrid } from "@mui/x-data-grid";
import TableToolbar from "../../Components/TableToolbar";
import DeleteConfirmationDialog from "../../Components/DeleteDialog";
import AddEdit from "../../Components/Issue/AddEdit.js";

const LibrarianRequest = () => {
  const [requests, setRequests] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLostOpen, setIsLostOpen] = useState(false);
  const [request, setRequest] = useState("");
  const [data, setData] = useState([]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleDoneClick = (request) => {
    console.log(request);
    if (request.requestType === "request issue") {
      setRequest(request);
      setData({
        _id: "",
        book: request.book,
        user: request.user,
        issueDate: Date.now(),
        dueDate: null,
        returnedDate: null,
        status: "",
      });
      setOpenDialog(true);
    } else {
      setIsLostOpen(true);
      setRequest(request);
    }
  };

  const handleRequest = async () => {
    try {
      if (request.requestType === "lost book") {
        const response = await axiosClient.post(
          "/book-lost",
          {
            _id: request.issueId,
          },
          { withCredentials: true }
        );
        if (response.data.message === "Book lost data added successfully") {
          setIsLostOpen(false);
          setOpenSnackbar(true);
          setSnackbarMessage("Book lost data added successfully")
          const updatedRequests = requests.map((req) =>
            req._id === request.id ? { ...req, status: "done" } : req
          );
          setRequests(updatedRequests);
          setRequest("")
        }
      } else {
        setOpenDialog(false);
        setOpenSnackbar(true);
        const updatedRequests = requests.map((req) =>
          req._id === request.id ? { ...req, status: "done" } : req
        );
        setRequests(updatedRequests);
        setRequest("")
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleCloseDialog = () => {
    setIsLostOpen(false);
    setOpenDialog(false);
    setRequest("");
  };

  // Function to format date to "Y-M-D"
  const formatDate = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDate.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const handleSuccessMessage = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
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
    { field: "book", headerName: "Book", width: 460 },
    { field: "user", headerName: "User", width: 230 },
    { field: "requestDate", headerName: "Request Date", width: 130 },
    { field: "requestType", headerName: "Request Type", width: 130 },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          {params.row.status === "pending" && (
            <IconButton
              color="primary"
              onClick={() => handleDoneClick(params.row)}
            >
              <DoneIcon />
            </IconButton>
          )}
        </div>
      ),
    },
  ];

  const rows = requests
    ? requests.map((request) => ({
        id: request._id,
        book: request.issue ? request.issue.book.name : request.book.name,
        bookId: request.issue ? request.issue.book._id : null,
        issueId: request.issue ? request.issue._id : null,
        user: request.user.name,
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
      {/* {isEditOpen && (
        <Dialog open={isEditOpen} onClose={handleCloseDialog}>
          <AddEdit
            data={currentIssue}
            onSuccess={handleEditIssue}
            successMessage={handleSuccessMessage}
          />
        </Dialog>
      )} */}

      <SnackBar
        open={openSnackbar}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <AddEdit
          data={data}
          onSuccess={handleRequest}
          successMessage={handleSuccessMessage}
          request="request"
        />
      </Dialog>
      <DeleteConfirmationDialog
        open={isLostOpen}
        onClose={handleCloseDialog}
        onConfirm={handleRequest}
        id={request.id}
        message="Are you sure the book is lost"
      />
      {/* <DeleteConfirmationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleRequest}
        id={request.id}
        message="Are you sure ?"
      /> */}
    </Paper>
  );
};

export default LibrarianRequest;
