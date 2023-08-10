import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import Scrollbar from '../scrollbar'; // Adjust the path based on your file structure
import Label from '../label'; // Adjust the path based on your file structure
import Iconify from '../iconify'; // Adjust the path based on your file structure

const FarmerDetails = () => {
  const [farmersData, setFarmersData] = useState([]);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [randomAvatar, setRandomAvatar] = useState(null); // Add state for random avatar
  const [avatarImports, setAvatarImports] = useState([]); 

  const fetchFarmerDetailsById = (farmerId) => {
    axios
      .get(`http://localhost:8080/getFarmerDetailsById/${farmerId}`)
      .then((response) => {
        console.log(response.data); // Display the fetched data in the console
      })
      .catch((error) => {
        console.error('Error fetching farmer details:', error);
      });
  };


  useEffect(() => {
    const url = 'http://localhost:8080/getAllFarmers';
    axios
      .get(url)
      .then((response) => {
        setFarmersData(response.data);
        setError(null);
      })
      .catch((error) => {
        setError('Error fetching data. An error occurred.');
      });

    // Dynamically import avatar images
    const avatarPromises = Array.from({ length: 14 }, (_, i) =>
    import(`../../../public/assets/images/avatars/avatar_${i + 1}.jpg`).then((module) => module.default)
  );

  Promise.all(avatarPromises).then((avatars) => {
    setAvatarImports(avatars);
  });
  }, []);


  if (error) {
    return <div>{error}</div>;
  }

  if (farmersData.length === 0 ) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            All Farmers Data
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
              <UserListHead
                  order="asc"
                  orderBy="name"
                  headLabel={[
                    { id: 'Id', label: 'Id', alignRight: false },
                    { id: 'name', label: 'Name', alignRight: false },
                    { id: 'Address', label: 'Address', alignRight: false },
                    { id: 'Phone Number', label: 'PhoneNuber', alignRight: false },
                    { id: '' },
                  ]}
                  rowCount={farmersData.length}
                  numSelected={0}
                />
                <TableBody>
                  {farmersData.map((farmer, index) => (
                    <React.Fragment key={farmer.id}>
                      <TableRow hover key={farmer.id} tabIndex={-1} role="checkbox">
                        <TableCell padding="checkbox">
                          <Checkbox />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                        <Link to="#" style={{ textDecoration: 'none' }} onClick={() => fetchFarmerDetailsById(farmer.id)}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {farmer.id}
                            </Typography>
                          </Stack>
                          </Link>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                        <Link to="#" style={{ textDecoration: 'none' }} onClick={() => fetchFarmerDetailsById(farmer.id)}>
                          <Stack direction="row" alignItems="center" spacing={2}>   
                            <Avatar alt={farmer.name} src={avatarImports[index % avatarImports.length]} />
                            <Typography variant="subtitle2" noWrap>
                              {farmer.name}
                            </Typography>
                          </Stack>
                          </Link>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {farmer.Address}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {farmer.PhoneNumber}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          <Label color={(farmer.status === 'banned' && 'error') || 'success'}>
                            {farmer.status}
                          </Label>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="large">
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      {expandedRows.includes(index) && farmer.details &&
                        farmer.details.map((detail, detailIndex) => (
                          <TableRow key={detailIndex}>
                            <TableCell colSpan={7}>ds</TableCell>
                            <TableCell>{detail.item}</TableCell>
                            <TableCell>{detail.quality}</TableCell>
                            <TableCell>{detail.amount}</TableCell>
                          </TableRow>
                        ))
                      }
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
};

export default FarmerDetails;
