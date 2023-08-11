import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/GetFarmerDayDetailsById.css'; // Import the CSS file

import { FormControlLabel, InputLabel,TableCell,TableBody,TableRow,TableContainer,Paper,Table,TableHead, Input, TextField, Stack } from '@mui/material'; // Import Material-UI components

const GetFarmerDetailsById = () => {
  const { id } = useParams();
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const url = `http://localhost:8080/getFarmerDetailsById/${id}`;
    axios
      .get(url)
      .then((response) => {
        const sortedDetails = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFarmerDetails(sortedDetails);
      })
      .catch((error) => {
        console.error('Error fetching farmer details:', error);
      });
  
  }, [id]);

  const handleChangeStartDate = (event) => {
    setStartDate(event.target.value);
  };

  const handleChangeEndDate = (event) => {
    setEndDate(event.target.value);
  };


  if (!farmerDetails) {
    return <div>Loading...</div>;
  }
  const filteredData = farmerDetails.filter((detail) => {
    const currentDate = new Date(detail.date);
    return startDate && endDate
      ? currentDate >= new Date(startDate) && currentDate <= new Date(endDate)
      : true;
  });

  let lastRenderedDate = null; // Track the last rendered date

  return (
    <div className="container">
      <h2>Farmer Details</h2>
      <div className="date-range-picker"> 
      <h4 style={{"color":"gray"}}>Select the Date Range : </h4>
      <InputLabel style={{"margin-left":"15px"}} htmlFor="start-date">From:</InputLabel>
        <TextField
          type="date"
          id="start-date"
          value={startDate}
          onChange={handleChangeStartDate}
        />
        <InputLabel style={{"margin-left":"15px"}} htmlFor="end-date">To:</InputLabel>
        <TextField
          type="date"
          id="end-date"
          value={endDate}
          onChange={handleChangeEndDate}
        />
      </div>
      <TableContainer component={Paper} className="table-container">
        <Table>
      <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Quality</TableCell>
              <TableCell>Cash/Quantity</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
            {filteredData.map((detail, index) => {
              const currentDate = new Date(detail.date).toLocaleDateString();
              const renderDateCell = lastRenderedDate !== currentDate;
              if (renderDateCell) {
                lastRenderedDate = currentDate; 
              }
              return (
                <TableRow key={index}>
                  <TableCell>
                    {renderDateCell && currentDate}
                  </TableCell>
                  <TableCell>{detail.item}</TableCell>
                  <TableCell>{detail.quality}</TableCell>
                  <TableCell>{detail.isCash ? 'Cash' : 'Quantity'}</TableCell>
                  <TableCell>{detail.amount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
      </Table>
      </TableContainer>
    </div>
  );
};

export default GetFarmerDetailsById;
