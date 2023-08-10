import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

const AddFarmer = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    phoneNumber: '',
    address: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const submitForm = (event) => {
    event.preventDefault();

    // Make a request to the API using axios
    const url = 'http://localhost:8080/addFarmer';
    const data = {
      name: userDetails.name,
      phoneNumber: userDetails.phoneNumber,
      address: userDetails.address,
    };
    axios.post(url, data).then((response) => {
      if (response.status === 200) {
        setSuccessMessage('Farmer added successfully');
      } else {
        alert('An error occurred');
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4">ಹೊಸ ರೈತರನ್ನು ಸೇರಿಸಿ</Typography>
      </Box>
      <form onSubmit={submitForm} acceptCharset="UTF-8">
        <Box sx={{ mt: 2 }}>
          <TextField
            label="ಹೆಸರು"
            fullWidth
            value={userDetails.name}
            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
            required
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="ಮೊಬೈಲ್ ನಂಬರ"
            fullWidth
            type="number"
            value={userDetails.phoneNumber}
            onChange={(e) => setUserDetails({ ...userDetails, phoneNumber: e.target.value })}
            required
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="ವಿಳಾಸ"
            fullWidth
            multiline
            value={userDetails.address}
            onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
            required
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            ಸಲ್ಲಿಸು
          </Button>
        </Box>
        {successMessage && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">{successMessage}</Typography>
          </Box>
        )}
      </form>
    </Container>
  );
};

export default AddFarmer;
