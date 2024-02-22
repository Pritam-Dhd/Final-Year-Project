import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Dialog, Paper, Grid, IconButton } from "@mui/material";
import SnackBar from "../../Components/SnackBar";
import { DataGrid } from "@mui/x-data-grid";
import { useUserRole } from "../../Components/UserContext";
import PaidIcon from "@mui/icons-material/Paid";
import CryptoJS from "crypto-js";

const SeeAll = () => {
  const [fines, setFines] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { userRole } = useUserRole();

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handlePaidClick = async ({ id, amount }) => {
    let payEndpoint = "http://localhost:5000/pay-fine";

    if (userRole === "Librarian") {
      payEndpoint = "http://localhost:5000/paid-fine";
    }
    const response = await axios.post(
      payEndpoint,
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
    // try {
    //   const formResponse = await axios.post(
    //     "https://rc-epay.esewa.com.np/api/epay/main/v2/form",{
    //       formData:formData
    //     }

    //   );
    //   // Handle form response
    //   console.log("Form response:", formResponse.data);
    // } catch (error) {
    //   // Handle error
    //   console.error("Error posting form data:", error);
    // }
  };

  const columns = [
    { field: "book", headerName: "Book", width: 460 },
    ...(userRole === "Librarian"
      ? [{ field: "user", headerName: "User", width: 250 }]
      : []),
    { field: "amount", headerName: "Amount", width: 150 },
    { field: "status", headerName: "Status", width: 130 },
    ...(userRole === "Student"
      ? [{ field: "remark", headerName: "Remark", width: 250 }]
      : []),

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => {
        const isNotReturned = params.row.issue.status === "Returned";
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
  const rows = fines.map((fine) => ({
    id: fine._id,
    issue: fine.issue,
    book: fine.issue.book.name,
    user: fine.issue.user.name,
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
    axios
      .get("http://localhost:5000/get-all-fines", { withCredentials: true })
      .then(function (response) {
        const data = response.data.Fines.reverse();
        setFines(data);
        console.log(data);
      })
      .catch(function (error) {
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
      <Box sx={{ overflow: "auto" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination={{ pageSize: 10 }}
          //   getRowHeight={() => "auto"}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: {
              sortModel: [{ field: "status", sort: "asc" }],
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
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
    </Paper>
  );
};

export default SeeAll;
