import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/AddFarmers.css'

import {
  TextField,
  Card,
  Table,
  Button,
  Select,
  Box,
  Menu,
  MenuItem,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import Scrollbar from '../scrollbar';
import Iconify from '../iconify';

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
  const [editMode, setEditMode] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [successAddedMessage, setSuccessAddedMessage] = useState(null);
  const handleEditClick = (farmer) => {
    setSelectedFarmer(farmer);
    setUserDetails({
      name: farmer.name,
      phoneNumber: farmer.phoneNumber,
      address: farmer.address,
    });
    setEditMode(true);
  };
  const handlePhoneNumberChange = (e) => {
    const inputPhoneNumber = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (inputPhoneNumber.length <= 10) {
      setUserDetails({ ...userDetails, phoneNumber: inputPhoneNumber });
    }
  };
  

  const submitForm = (event) => {
    event.preventDefault();

    // Make a request to the API using axios
    const url = 'http://localhost:8080/addFarmer';
    const data = {
      name: userDetails.name,
      phoneNumber: userDetails.phoneNumber,
      address: userDetails.address,
    };
    console.log(data);
    axios.post(url, data).then((response) => {
      if (response.status === 200) {
        setFarmersData([response.data]);
        setSuccessAddedMessage('Edit successful');
        console.log(response.data);
        setAddedFarmers([...addedFarmers, { ...userDetails }]);
        setUserDetails({ name: '', phoneNumber: '', address: '' });
        setSuccessMessage('Farmer added successfully');
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
                        <TableCell align="center">
      {successMessage && (
        <div style={{ backgroundColor: 'green', padding: '5px', color: 'white' }}>
          {successMessage}
        </div>
      )}
      <IconButton size="large">
        <Iconify icon={'eva:more-vertical-fill'} />
        <Menu>
          <MenuItem onClick={() => handleEditClick(farmer)}>Edit</MenuItem>
        </Menu>
      </IconButton>
    </TableCell>
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