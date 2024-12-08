import React from "react";
import {
  Typography,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const DTable = ({ columns, rows, title }) => {
  return (
    <Paper
      elevation={3}
      sx={{ width: { xs: "100%", md: "100%", ls: "100%" }, overflow: "hidden" }}
    >
      <Typography variant="h6">{title}</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {/* Render table header with provided columns */}
              {columns.map((col, index) => (
                <TableCell key={index} sx={{ textTransform: "capitalize" }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Check if rows array is not empty or undefined before rendering */}
            {(rows ?? []).length > 0 ? (
              rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {/* Render table cells dynamically based on row data */}
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex}>
                      {/* Access row data dynamically using column keys */}
                      {row[col]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DTable;
