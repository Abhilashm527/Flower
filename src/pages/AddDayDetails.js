import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Input,
  Stack,
  Container,
  Autocomplete,
} from "@mui/material";

const Adddaydetails = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDateTime = new Date(now.getTime() + istOffset);
  const formattedDateTime = istDateTime.toISOString().slice(0, 16);

  const [date, setDate] = useState(formattedDateTime);
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedFarmerId, setSelectedFarmerId] = useState("");
  const dropdownOptions = ["Option 1", "Option 2", "Option 3"];
  const [expenses, setExpenses] = useState([
    {
      item: "Option 1",
      quality: "Good",
      amount: "",
      isCash: true,
    },
  ]);

  useEffect(() => {
    fetchAutocompleteOptions();
  }, []);

  const fetchAutocompleteOptions = async () => {
    try {
      const response = await axios.get("http://localhost:8080/getAllFarmers");
      setAutocompleteOptions(response.data);
    } catch (error) {
      console.error("Error fetching autocomplete options:", error);
    }
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
      isCash: true,
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
        "http://localhost:8080/addFarmerDaydetails",
        postObject
      );
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error submitting expenses:", error);
    }
  };

  return (
    <div style={{"margin": "0",
    "width": "auto",
    "display": "flex"}}>
    <Container >
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
  value={selectedFarmer}
  onChange={(event, newValue) => {
    setSelectedFarmer(newValue);
    setSelectedFarmerId(newValue ? newValue.id : "");
  }}
/>

          </FormControl>
          {expenses.map((expense, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
              <FormControl>
                <InputLabel className="form-label">Item:</InputLabel>
                <Select
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
                color="secondary"
              >
                Delete Row
              </Button>
              <hr className="form-hr" style={{ height: '24px', alignSelf: 'center' }} />
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              type="button"
              onClick={handleAddRow}
              variant="contained"
              color="primary"
              className="add-button"
            >
              +
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
    <>
     <div style={{"display": "flex",
        "justify-content": "center",
        "align-items": "center",
        "width": "60%"}}>
     {selectedFarmer && (
       <div >
         {/* Display additional farmer details to the right */}
         <h2>Farmer Details</h2>
         <p>Name: {selectedFarmer.name}</p>
         <p>ID: {selectedFarmer.id}</p>
         <p>Address: {selectedFarmer.address}</p>
       </div>
       
     )}
     </div>
     </>
     </div>
  );
};

export default Adddaydetails;
