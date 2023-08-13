import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/AddDayDetails.css'
import { useLocation } from 'react-router-dom';

import {
  TextField,
  Button,
  Select,
  Avatar,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Input,
  Stack,
  Container,
  Autocomplete,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
  Grid,
} from "@mui/material";

const Adddaydetails = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDateTime = new Date(now.getTime() + istOffset);
  const formattedDateTime = istDateTime.toISOString().slice(0, 16);
  const [avatarImports, setAvatarImports] = useState([]); 
  const [date, setDate] = useState(formattedDateTime);
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedFarmerId, setSelectedFarmerId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchfarmer, setSearchfarmer] = useState({});
  const dropdownOptions = ["Option 1", "Option 2", "Option 3"];
  let lastRenderedDate = null;
  const [expenses, setExpenses] = useState([
    {
      item: "Option 1",
      quality: "Good",
      amount: "",
      isCash: false,
    },
  ]);

  // Access the selected farmer from the location state

  useEffect(() => {
    fetchAutocompleteOptions();
    fetchAllFarmerDetails();
    const avatarPromises = Array.from({ length: 14 }, (_, i) =>
  import(`../../public/assets/images/avatars/avatar_${i + 1}.jpg`).then((module) => module.default)
);

Promise.all(avatarPromises).then((avatars) => {
  setAvatarImports(avatars);
});
  }, []);

  const fetchAllFarmerDetails = async () => {
    const url = `https://smfbilling.azurewebsites.net/getFarmerAllFarmersDetails`;
    axios
      .get(url)
      .then((response) => {
        const sortedDetails = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setSearchfarmer(sortedDetails);
      })
      .catch((error) => {
        console.error('Error fetching farmer details:', error);
      });
  };

  const fetchAutocompleteOptions = async () => {
    try {
      const response = await axios.get("https://smfbilling.azurewebsites.net/getAllFarmers");
      setAutocompleteOptions(response.data);
    } catch (error) {
      console.error("Error fetching autocomplete options:", error);
    }
  };

  const handleChangeStartDate = (event) => {
    setStartDate(event.target.value);
  };

  const handleChangeEndDate = (event) => {
    setEndDate(event.target.value);
  };

  const handleAutocompleteInputChange = (event, newValue) => {
    if (typeof newValue === "string") {
      setInputValue(newValue);
    } else if (newValue && newValue.inputValue) {
      setInputValue(newValue.inputValue);
    } else {
      setInputValue("");
    }
  
    // Search for matches in both name and ID
    const selectedFarmer = autocompleteOptions.find(
      (option) =>
        option.name.toLowerCase().includes(newValue.toLowerCase()) ||
        option.id === newValue
    );
    setSelectedFarmer(selectedFarmer);
    setSelectedFarmerId(selectedFarmer ? selectedFarmer.id : "");
  };

  const handleAddRow = () => {
    const defaultExpense = {
      item: "Option 1",
      quality: "Good",
      amount: "",
      isCash: false,
    };
    setExpenses([...expenses, defaultExpense]);
  };

  const handleDeleteRow = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = expenses.map((expense, i) =>
      i === index ? { ...expense, [field]: value } : expense
    );
    setExpenses(updatedExpenses);
  };

  const handleToggle = (index) => {
    const updatedExpenses = [...expenses];
    if (updatedExpenses[index]) {
      updatedExpenses[index].isCash = !updatedExpenses[index].isCash;
      setExpenses(updatedExpenses);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const postObject = {
      farmerId: selectedFarmerId,
      date,
      data: expenses.map((expense) => ({
        item: expense.item,
        quality: expense.quality,
        amount: expense.amount,
        isCash: expense.isCash,
      })),
    };
    console.log(postObject);

    const expensesArray = expenses.map((expense) => ({ ...expense }));

    try {
      const response = await axios.post(
        "https://smfbilling.azurewebsites.net/addFarmerDaydetails",
        postObject
      );
      fetchAllFarmerDetails();
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error submitting expenses:", error);
    }
  };

  return (
    <div className="add-farmer-details">
    <Container >
    <Typography variant="h4" gutterBottom>
            Add Farmer details
          </Typography>
      <form onSubmit={handleSubmit} style={{ display: "flex" }}>
        <Stack  spacing={2}
          sx={{ mt: 4, marginRight: "16px", flexGrow: 1 }}>
          <TextField
            label="Date"
            type="datetime-local"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
          <FormControl>
          <Autocomplete
  options={autocompleteOptions}
  getOptionLabel={(option) => `${option.id} - ${option.name}`}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Search Farmer:"
      className="form-input"
      placeholder="Search farmer..."
      required
    />
  )}
  value={selectedFarmer} // This should be the selectedFarmer state
  onChange={(event, newValue) => {
    if (newValue) {
      setSelectedFarmer(newValue);
      setSelectedFarmerId(newValue.id);
    } else {
      setSelectedFarmer(null); // Clear the selectedFarmer if nothing is selected
      setSelectedFarmerId("");
    }
  }}
/>


          </FormControl>
          {expenses.map((expense, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'row', gap: '13px', alignItems: 'center' }}>
              <FormControl>
                <InputLabel className="form-label">Item:</InputLabel>
                <Select
                  label="Item"
                  value={expense.item}
                  onChange={(event) =>
                    handleExpenseChange(index, "item", event.target.value)
                  }
                  className="form-input"
                >
                  <MenuItem value="Default Value" disabled>
                    Select an option
                  </MenuItem>
                  {dropdownOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel className="form-label">Quality:</InputLabel>
                <Select
                  label="Quality"
                  value={expense.quality}
                  onChange={(event) =>
                    handleExpenseChange(index, "quality", event.target.value)
                  }
                  required
                  className="form-input"
                >
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Fair">Fair</MenuItem>
                  <MenuItem value="Poor">Poor</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel className="form-label">Cash/Quantity:</InputLabel>
                <Select
                  label="Cash/Quantity:"
                  value={expense.isCash ? "Cash" : "Quantity"}
                  onChange={() => handleToggle(index)}
                  className="form-input"
                  required
                >
                  <MenuItem value="Quantity">Quantity</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                </Select>
              </FormControl>
              {expense.isCash ? (
                <FormControl>
                  <InputLabel className="form-label">Amount:</InputLabel>
                  <Input
                    label="Cash:"
                    type="text"
                    value={`Rs ${expense.amount}`}
                    onChange={(event) =>
                      handleExpenseChange(
                        index,
                        "amount",
                        event.target.value.substring(3)
                      )
                    }
                    className="form-input"
                    required
                  />
                </FormControl>
              ) : (
                <FormControl>
                  <InputLabel className="form-label">Quantity:</InputLabel>
                  <Input
                    label="Quantity:"
                    type="number"
                    step="0.01"
                    value={expense.amount}
                    onChange={(event) =>
                      handleExpenseChange(index, "amount", event.target.value)
                    }
                    className="form-input"
                    required
                  />
                </FormControl>
              )}
              <Button
                type="button"
                onClick={() => handleDeleteRow(index)}
                variant="contained"
                color="primary"
              >
                Delete Row
              </Button>
              
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <Button
              type="button"
              onClick={handleAddRow}
              variant="contained"
              color="primary"
              className="add-button"
            >
             Add Row +
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="form-button"
            >
              Submit
            </Button>
          </div>
        </Stack>
      </form>
    </Container>
    < div className="container" >
     <div> 
         {selectedFarmer && (
         <div className="farmer-detail">
         <h2>Farmer Details</h2>
         <Avatar alignItems="center" alt={selectedFarmer.name}  style={{ width: '80px', height: '80px' }}  src={avatarImports[Math.floor(Math.random() * avatarImports.length)]} />
         <p>Name: {selectedFarmer.name}</p>
         <p>ID: {selectedFarmer.id}</p>
         <p>Address: {selectedFarmer.address}</p>
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
        {searchfarmer.length > 0 ? (
  searchfarmer.map((detail, index) => {
    const currentDate = new Date(detail.date).toLocaleDateString();
    const renderDateCell = lastRenderedDate !== currentDate;
    lastRenderedDate = currentDate;
    const startDateObject = new Date(startDate);
    const endDateObject = new Date(endDate);

    if (
      detail.farmerId === selectedFarmer.id &&
      currentDate >= startDateObject.toLocaleDateString() &&
      currentDate <= endDateObject.toLocaleDateString()
    ) {
      return (
        <TableRow key={index}>
          <TableCell>{renderDateCell && currentDate}</TableCell>
          <TableCell>{detail.item}</TableCell>
          <TableCell>{detail.quality}</TableCell>
          <TableCell>{detail.isCash ? 'Cash' : 'Quantity'}</TableCell>
          <TableCell>{detail.amount}</TableCell>
        </TableRow>
      );
    }
    return null;
  })
) : (
  <TableRow>
    <TableCell colSpan={5}>No data available</TableCell>
  </TableRow>
)}

          </TableBody>
      </Table>
      </TableContainer>
      </div>
     )}
     </div>
     </div>
     </div>
  );
};

export default Adddaydetails;