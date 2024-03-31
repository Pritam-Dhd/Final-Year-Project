import React, { useState, useEffect } from "react";
import axiosClient from "../../Components/AxiosClient.js";
import {
  Box,
  Button,
  Dialog,
  Paper,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  LinearProgress,
} from "@mui/material";
import SnackBar from "../../Components/SnackBar";
import { DataGrid } from "@mui/x-data-grid";
import { useUserRole } from "../../Components/UserContext";
import PaidIcon from "@mui/icons-material/Paid";
import TableToolbar from "../../Components/TableToolbar";

const SeeAll = () => {
  const [fines, setFines] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { userRole } = useUserRole();
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [paidIssueId, setPaidIssueId] = useState();
  const [loading, setLoading] = useState(true);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCancelPaid = () => {
    setPaidIssueId(null);
    setConfirmationDialogOpen(false);
  };

  const handleConfirmPaid = async () => {
    // Perform the paid operation
    const response = await axiosClient.post(
      "/paid-fine",
      {
        _id: paidIssueId,
      },
      { withCredentials: true }
    );

    if (response.data.message === "Fine paid successfully") {
      setSnackbarMessage("Fine paid successfully");
      setOpenSnackbar(true);
      setFines((prevFines) => {
        return prevFines.map((fine) => {
          if (fine._id === paidIssueId) {
            return { ...fine, status: "paid", remark: "no action", paidDate: formatDate(new Date())};
          }
          return fine;
        });
      });
    } else {
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
    }

    setConfirmationDialogOpen(false);
  };

  const handlePaidClick = async ({ id, amount }) => {
    if (userRole === "Librarian") {
      setPaidIssueId(id);
      setConfirmationDialogOpen(true);
    } else {
      const response = await axiosClient.post(
        "/pay-fine",
        { _id: id, amount: amount },
        { withCredentials: true }
      );
      const formData = response.data;
      // Create a form element
      const form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute(
        "action",
        "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      );

      // Add form data as hidden input fields
      for (const key in formData) {
        if (Object.hasOwnProperty.call(formData, key)) {
          const hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", formData[key]);
          form.appendChild(hiddenField);
        }
      }

      // Append the form to the document body and submit it
      document.body.appendChild(form);
      form.submit();
    }
  };

  const columns = [
    { field: "book", headerName: "Book", width: 450 },
    ...(userRole === "Librarian"
      ? [{ field: "user", headerName: "User", width: 250 }]
      : []),
    { field: "amount", headerName: "Amount", width: 90 },
    { field: "paidDate", headerName: "Paid Date", width: 150 },
    { field: "reason", headerName: "Reason", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    ...(userRole === "Student"
      ? [{ field: "remark", headerName: "Remark", width: 250 }]
      : []),

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => {
        const isNotReturned = params.row.issue.status === "Returned"||params.row.issue.status === "Lost";
        const isUnpaid = params.row.status === "unpaid";

        if (isNotReturned && isUnpaid) {
          return (
            <IconButton
              color="primary"
              onClick={() =>
                handlePaidClick({
                  id: params.row.id,
                  amount: params.row.amount,
                })
              }
            >
              <PaidIcon />
            </IconButton>
          );
        } else if (params.row.status === "paid") {
          return "No Action";
        } else if (userRole === "Student") {
          return "See Remark";
        } else {
          return "No Action";
        }
      },
    },
  ];
  const formatDate = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDate.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const rows = fines.map((fine) => ({
    id: fine._id,
    issue: fine.issue,
    book: fine.issue.book.name,
    user: fine.issue.user.name,
    paidDate: fine.paid_date === "" ? "Not Paid" : formatDate(fine.paid_date),
    reason:fine.reason,
    amount: fine.amount,
    remark:
      fine.status === "paid"
        ? "Fine has been paid"
        : fine.issue.status === "Not Returned"
        ? "Return the book first to pay fine"
        : "Pay the fine online or offline",
    status: fine.status,
  }));

  useEffect(() => {
    axiosClient
      .get("/get-all-fines", { withCredentials: true })
      .then(function (response) {
        const data = response.data.Fines.reverse();
        setFines(data);
        setLoading(false);
        console.log(data);
      })
      .catch(function (error) {
        setLoading(false);
        alert(error);
      });
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box sx={{ overflow: "auto", height: "460px" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10 }}
          //   getRowHeight={() => "auto"}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: {
              sortModel: [{ field: "status", sort: "desc" }],
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          slots={{
            toolbar: () => <TableToolbar filename="Issued Books" />,
            loadingOverlay: LinearProgress,
          }}
        />
      </Box>
      <SnackBar
        open={openSnackbar}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
      <Dialog
        open={confirmationDialogOpen}
        onClose={handleCancelPaid}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Paid"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure the fine is paid?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelPaid} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirmPaid(paidIssueId)}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SeeAll;
