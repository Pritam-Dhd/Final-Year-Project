import React, { useState, useEffect } from "react";
import axiosClient from "../../Components/AxiosClient.js";
import {
  Box,
  Button,
  Dialog,
  Paper,
  Grid,
  IconButton,
  LinearProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LostIcon from "@mui/icons-material/NoBackpack";
import { DataGrid } from "@mui/x-data-grid";
import AddEdit from "../../Components/Issue/AddEdit";
import LostBook from "../../Components/Issue/LostBook.js";
import SnackBar from "../../Components/SnackBar";
import DeleteConfirmationDialog from "../../Components/DeleteDialog";
import TableToolbar from "../../Components/TableToolbar";
import { useUserRole } from "../../Components/UserContext";

const SeeAll = () => {
  const [issueBooks, setIssuedBooks] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingIssueId, setDeletingIssueId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [lostIssueId, setLostIssueId] = useState(null);
  const [isLostOpen, setIsLostOpen] = useState(false);
  const [isLostRequestOpen, setIsLostRequestOpen] = useState(false);
  const [currentIssue, setCurrentIssue] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const { userRole } = useUserRole();

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  
  const columns = [
    { field: "book", headerName: "Book", width: 460 },
    { field: "user", headerName: "User", width: 230 },
    { field: "issueDate", headerName: "Issue Date", width: 130 },
    { field: "dueDate", headerName: "Due Date", width: 130 },
    { field: "returnedDate", headerName: "Returned Date", width: 130 },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          {userRole === "Librarian" && (
            <>
              {params.row.status === "Not Returned" && (
                <IconButton
                  color="primary"
                  onClick={() => handleEditClick(params.row.id)}
                >
                  <EditIcon />
                </IconButton>
              )}
              {params.row.status === "Not Returned" && (
                <IconButton
                  color="warning"
                  onClick={() => handleLostClick(params.row.id)}
                >
                  <LostIcon />
                </IconButton>
              )}
              <IconButton
                color="error"
                onClick={() => handleDelete(params.row.id)}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
          {userRole==="Student" && params.row.status === "Not Returned" && (
            <>
            {params.row.status === "Not Returned" && (
                <IconButton
                  sx={{ color: "warning" }}
                  onClick={() => handleLostRequestClick(params.row.id)}
                >
                  <LostIcon />
                </IconButton>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditOpen(false);
    setIsLostOpen(false);
    setIsLostRequestOpen(false);
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

  const handleEditClick = (id) => {
    setIsEditOpen(true);
    const issue = issueBooks.find((issue) => issue._id === id);
    setCurrentIssue(issue);
  };

  const handleLostClick =  (id) => {
    setLostIssueId(id);
    setIsLostOpen(true);
  };

  const handleLostRequestClick=(id)=>{
    setLostIssueId(id);
    setIsLostRequestOpen(true)
  }
  

  const handleDelete = (issueId) => {
    setDeletingIssueId(issueId);
    setDeleteDialogOpen(true);
  };

  // Function to handle adding a new issue
  const handleAddIssue = (newIssue) => {
    setIssuedBooks([newIssue, ...issueBooks]);
    setOpenDialog(false);
  };

  // Function to handle editing an existing issue
  const handleEditIssue = (editedIssue) => {
    const updatedIssues = issueBooks.map((issue) => {
      if (issue._id === editedIssue._id) {
        return {
          ...issue,
          dueDate: editedIssue.dueDate,
          status: editedIssue.status,
          returnedDate: editedIssue.returnedDate,
        };
      } else {
        return issue;
      }
    });
    setIssuedBooks(updatedIssues);
    setIsEditOpen(false);
  };

  const handleLostIssue = async() => {
    try {
      const response = await axiosClient.post(
        "/book-lost",
        {
          _id: lostIssueId,
        },
        { withCredentials: true }
      );
      if (response.data.message === "Book lost data added successfully") {
        const updatedIssues = issueBooks.map((issue) => {
          if (issue._id === lostIssueId) {
            return {
              ...issue,
              status: "Lost",
            };
          } else {
            return issue;
          }
        });
        setIssuedBooks(updatedIssues);
      }
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
      setLoading(false);
    } catch (error) {
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
      setLoading(false);
    }
    setLostIssueId(null);
    setIsLostOpen(false);
  }; 
  const handleLostRequest=async()=>{
    try{
      const response = await axiosClient.post(
        "/add-request",
        {issue:lostIssueId,requestType:"lost book"},
        { withCredentials: true }
      );
      if (response.data.message === "Request added successfully") {
        handleSuccessMessage("Lost request send successfully");
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage(response.data.message);
        setOpenSnackbar(true);
      }
      setLostIssueId(null);
      setIsLostRequestOpen(false);
    }
    catch(error){
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  }
  const handleSuccessMessage = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const rows = issueBooks.map((issue) => ({
    id: issue._id,
    book: issue.book.name,
    user: issue.user.name,
    issueDate: formatDate(issue.issueDate),
    dueDate: formatDate(issue.dueDate),
    returnedDate: issue.returnedDate
      ? formatDate(issue.returnedDate)
      : "Not Returned",
    status: issue.status,
  }));

  useEffect(() => {
    axiosClient
      .get("/get-all-issues", { withCredentials: true })
      .then(function (response) {
        console.log(response)
        const data = response.data.Issues.reverse();
        setIssuedBooks(data);
        setLoading(false); // After data fetching, set loading to false
        console.log(data);
      })
      .catch(function (error) {
        setLoading(false); // Set loading to false in case of error too
        alert(error);
      });
  }, []);

  const handleCancelDelete = () => {
    setDeletingIssueId(null);
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    // Perform the delete operation
    const response = await axiosClient.post(
      "/delete-issue",
      {
        _id: deletingIssueId,
      },
      { withCredentials: true }
    );

    if (response.data.message === "Issue deleted successfully") {
      setSnackbarMessage("Issue deleted successfully");
      setOpenSnackbar(true);
      setIssuedBooks((prevIssues) =>
        prevIssues.filter((issue) => issue._id !== deletingIssueId)
      );
    } else {
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
    }

    setDeleteDialogOpen(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      {userRole==="Librarian"&&(
        <Button
        sx={{ marginTop: "15px", marginLeft: "15px", marginBottom: "15px" }}
        variant="contained"
        color="primary"
        onClick={handleOpenDialog}
      >
        Add Issue
      </Button>)}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <AddEdit
          onSuccess={handleAddIssue}
          successMessage={handleSuccessMessage}
        />
      </Dialog>
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
            toolbar: () => <TableToolbar filename="Issued Books" />,
            loadingOverlay: LinearProgress,
          }}
        />
      </Box>
      {isEditOpen && (
        <Dialog open={isEditOpen} onClose={handleCloseDialog}>
          <AddEdit
            data={currentIssue}
            onSuccess={handleEditIssue}
            successMessage={handleSuccessMessage}
          />
        </Dialog>
      )}

      <SnackBar
        open={openSnackbar}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
      <DeleteConfirmationDialog
        open={isLostRequestOpen}
        onClose={handleCloseDialog}
        onConfirm={handleLostRequest}
        id={lostIssueId}
        message="Are you sure the book is lost"
      />
      <DeleteConfirmationDialog
        open={isLostOpen}
        onClose={handleCloseDialog}
        onConfirm={handleLostIssue}
        id={lostIssueId}
        message="Are you sure the book is lost"
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        id={deletingIssueId}
        message="Are you sure the you want to delete the issue?"
      />
    </Paper>
  );
};

export default SeeAll;
