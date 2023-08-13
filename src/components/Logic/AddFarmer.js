import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/AddFarmers.css'

import {
  TextField,
  Card,
  Table,
  Button,
  Select,
  Snackbar,
  Alert,
  Box,
  MenuItem,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
} from '@mui/material';
import { UserListHead } from '../../sections/@dashboard/user';
import Scrollbar from '../scrollbar';

const AddFarmer = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    phoneNumber: '',
    address: '',
  });
  const addressOptions = [
    { key: 'OBAObalapura', value: 'Obalapura' },
    { key: 'KNHKaaranaganahatti', value: 'Kaaranaganahatti' },
    { key: 'HTBHottebommanahally', value: 'Hottebommanahally' },
    { key: 'RGSRangasamudra', value: 'Rangasamudra' },
    { key: 'DOHDoddenahally', value: 'Doddenahally' },
    { key: 'VDNVadhanakallu', value: 'Vadhanakallu' },
    { key: 'GVGGovardhanagiri', value: 'Govardhanagiri' },
    { key: 'BBTBellibatlu', value: 'Bellibatlu' },
    { key: 'KTGKyathaganahally', value: 'Kyathaganahally' },
    { key: 'KDGKyadhigunte', value: 'Kyadhigunte' },
   
  ];

  const [successMessage, setSuccessMessage] = useState('');
  const [avatarImports, setAvatarImports] = useState([]); 
  const [addedFarmers, setAddedFarmers] = useState([]);
  const [farmerData, setFarmersData] = useState([]);

  const [isSuccessSnackbarOpen, setIsSuccessSnackbarOpen] = useState(false);
  

  const submitForm = (event) => {
    event.preventDefault();

    // Make a request to the API using axios
    const url = 'https://smfbilling.azurewebsites.net/addFarmer';
    const data = {
      name: userDetails.name,
      phoneNumber: userDetails.phoneNumber,
      address: userDetails.address,
    };
    console.log(data);
    axios.post(url, data).then((response) => {
      if (response.status === 200) {
        setFarmersData([response.data]);
        setAddedFarmers([...addedFarmers, { ...userDetails }]);
        setUserDetails({ name: '', phoneNumber: '', address: '' });

        // Show success snackbar
        setIsSuccessSnackbarOpen(true);
      } else {
        alert('An error occurred');
      }
    });
    const avatarPromises = Array.from({ length: 14 }, (_, i) =>
    import(`../../../public/assets/images/avatars/avatar_${i + 1}.jpg`).then((module) => module.default)
  );
  console.log(addedFarmers)
  Promise.all(avatarPromises).then((avatars) => {
    setAvatarImports(avatars);
  });
  };

  return (
    <>
    <Container className='bg-color'>
      <form onSubmit={submitForm} acceptCharset="UTF-8">
        <Box sx={{ mt: 2 }}>
        <Typography variant="h4">Add new</Typography>
          <TextField
            label="Name"
            fullWidth
            value={userDetails.name}
            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
            required
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Mobile Number"
            fullWidth
            type="number"
            value={userDetails.phoneNumber}
            onChange={(e) => setUserDetails({ ...userDetails, phoneNumber: e.target.value })}
            required
          />
        </Box>
        <Box sx={{ mt: 2 }}>
  <Typography variant="body1">Address</Typography>
  <Select
    fullWidth
    value={userDetails.address}
    onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
    required
  >
    {addressOptions.map((option, index) => (
      <MenuItem key={index} value={option.key}>
        {option.value}
      </MenuItem>
    ))}
  </Select>
</Box>
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
        {successMessage && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">{successMessage}</Typography>
          </Box>
        )}
      </form>
      <>
      {farmerData.length > 0 && (<Container className='farmer-data' sx={{ marginTop: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" className='added-farmer-hearder-content' mb={5}>
          <Typography variant="h4" gutterBottom>
            Added Farmer's
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
              <UserListHead className="list-header" 
                  order="asc"
                  orderBy="name"
                  headLabel={[
                    { id: 'Id', label: 'Id', alignRight: false },
                    { id: 'name', label: 'Name', alignRight: false },
                    { id: 'Address', label: 'Address', alignRight: false },
                    { id: 'Phone Number', label: 'PhoneNumber', alignRight: false },
                    { id: 'Option', label: 'Option', alignRight: false },
                  ]}
                  rowCount={1}
                  numSelected={0}
                />
                <TableBody>
                  {farmerData.map((farmer, index) => (
                    <React.Fragment key={farmer.id}>
                      <TableRow hover key={farmer.id} tabIndex={-1} >
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row"  spacing={2} className='tab'>
                            <Typography variant="subtitle2" align="center" >
                              {farmer.id}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align='center' component="th" scope="row" padding="none" sx={{ py: 2 }}>
                          <Stack direction="row" alignItems="center" spacing={2} className='tab'>   
                            <Avatar alt={farmer.name} src={avatarImports[index % avatarImports.length]} />
                            <Typography  variant="subtitle2" noWrap>
                              {farmer.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell  align="center" component="th" scope="row" padding="none" sx={{ py: 2 }}>
                          <Stack direction="row" alignItems="center" spacing={2} className='tab'>
                            <Typography variant="subtitle2" noWrap>
                              {farmer.address}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center" component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2} className='tab'> 
                            <Typography variant="subtitle2" noWrap>
                              {farmer.phoneNumber}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <Snackbar
          open={isSuccessSnackbarOpen}
          autoHideDuration={3000} // Adjust the duration as needed
          onClose={() => setIsSuccessSnackbarOpen(false)}
        >
          <Alert severity="success">
            Farmer added successfully
          </Alert>
        </Snackbar>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
      )}
      </>
      </Container>
    </>
  );
};

export default AddFarmer;