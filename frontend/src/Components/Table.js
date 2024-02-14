import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AddUser from "../Pages/User/AddUser";

export default function MuiTable({ rows, columns,onAddUser  }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [closeDialog, setCloseDialog] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const [tableRows, setTableRows] = useState(rows);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page when searching
  };

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Close the dialog when needed
  useEffect(() => {
    if (closeDialog && newUser) {
      // Close the dialog
      setAddUserDialogOpen(false);

      // Add the new user to the existing rows
      setTableRows((prevRows) => [...prevRows, newUser]);

      // Reset the closeDialog and newUser states
      setCloseDialog(false);
      setNewUser(null);
    }
  }, [closeDialog, newUser]);

  // Callback function to handle successful message from AddUser component
  const handleAddUserSuccess = (newUserData) => {
    // Set closeDialog to true to trigger the closing of the dialog
    setCloseDialog(true);

    // Set the new user data
    setNewUser(newUserData);

    // Trigger the parent callback to add the new user to the table
    if (onAddUser) {
      onAddUser(newUserData);
    }
  };

  return (
    <Paper elevation={3} sx={{ width: {xs:"100%",md:"100%",ls:"100%"}, overflow: "hidden" }}>
      <Button
        sx={{ marginTop: "15px", marginLeft: "15px" }}
        variant="contained"
        color="primary"
        onClick={() => setAddUserDialogOpen(true)}
      >
        Add User
      </Button>
      <Dialog
        open={addUserDialogOpen}
        onClose={() => setAddUserDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <AddUser onSuccess={handleAddUserSuccess} />
        </DialogContent>
      </Dialog>
      <TextField
        label="Search by Name"
        value={searchTerm}
        onChange={handleChangeSearch}
        sx={{ float: "right", margin: 2 }}
      />
      <TableContainer sx={{ maxHeight: 440, overflow: "auto" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((tableRows) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={tableRows.id}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} align="left">
                      {tableRows[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredRows.length} // Use the length of the filtered rows
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
