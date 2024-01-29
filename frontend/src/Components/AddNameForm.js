import React, { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Grid,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const AddNameForm = ({ name, onAdd, onClose,editName }) => {
  const [genreName, setGenreName] = useState(editName);

  const handleInputChange = (event) => {
    setGenreName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd(genreName);
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={3}
        style={{ padding: 16, textAlign: "center", margin: 40 }}
      >
        <Typography variant="h5">{name}</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label={`Enter ${name.split(' ')[1]}`} 
                name="name"
                defaultValue={editName}
                autoComplete="name"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
              >
                {name}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddNameForm;
