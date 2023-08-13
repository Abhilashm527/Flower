import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../../styles/GetFarmerDayDetailsById.css'; // Import the CSS file

import { Dialog, DialogTitle, DialogContent,DialogActions,Button, InputLabel,TableCell,TableBody,TableRow,TableContainer,Paper,Table,TableHead, Input, TextField, Stack } from '@mui/material'; // Import Material-UI components

import BillDialog from './BillDialog';


const GetFarmerDetailsById = () => {
  const { id } = useParams();
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState([]);

  const handleGenerateBill = () => {
    const billData = filteredData.map((detail) => ({
      date: new Date(detail.date).toLocaleDateString(),
      item: detail.item,
      quality: detail.quality,
      type: detail.isCash ? 'Cash' : 'Quantity',
      amount: detail.amount,
    }));

    setBillData(billData);
    setShowBill(true);
  };
  useEffect(() => {
    const url = `https://smfbilling.azurewebsites.net/getFarmerDetailsById/${id}`;
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
  const handlePrint = () => {
    const printContents = document.getElementById('printable-area').innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };


  if (!farmerDetails) {
    return <div>Loading...</div>;
  }
  const filteredData = farmerDetails.filter((detail) => {
    const currentDate = new Date(detail.date);
    const startDateObj = startDate ? new Date(startDate) : null;
    const endDateObj = endDate ? new Date(endDate) : null;

    const isWithinRange =
      ((!startDateObj || currentDate.getDate() === startDateObj.getDate() ||
      ( !startDateObj || currentDate >= startDateObj)) &&
      (!endDateObj || currentDate <= endDateObj) 
      );

    return isWithinRange;
  });
  

  let lastRenderedDate = null; // Track the last rendered date

  return (
    <div className="container">
      <Link to="/dashboard/farmerDetails" className="back-link">
        <Button variant="outlined" color="primary">
          &larr; Back
        </Button>
      </Link>
      <h2>Farmer Details</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateBill}
        style={{ marginTop: '20px' }}
      >
        Generate Bill
      </Button>
      <BillDialog
        open={showBill}
        onClose={() => setShowBill(false)}
        billData={billData}
      />

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
