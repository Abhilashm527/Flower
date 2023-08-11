import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// components
import Iconify from '../iconify';
import Scrollbar from '../scrollbar';
// sections

// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [{ id: '' },
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'addData', label: 'Add Data', alignRight: false },
  { id: 'genrateBill', label: 'Generate Bill', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}




function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);


  const [farmersData, setFarmersData] = useState([]);
const [avatarImports, setAvatarImports] = useState([]); 
const [error, setError] = useState(null);
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
    console.log(farmersData)
  // Dynamically import avatar images
  const avatarPromises = Array.from({ length: 14 }, (_, i) =>
  import(`../../../public/assets/images/avatars/avatar_${i + 1}.jpg`).then((module) => module.default)
);

Promise.all(avatarPromises).then((avatars) => {
  setAvatarImports(avatars);
});
}, []);
 console.log(farmersData)
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      console.log(farmersData)
      const newSelecteds = farmersData.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
  
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = selected.filter((selectedId) => selectedId !== id);
    }
  
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };


  const filteredFarmers = applySortFilter(farmersData, getComparator(order, orderBy), filterName);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredFarmers.length) : 0;

  const isNotFound = !filteredFarmers.length && !!filterName;

console.log(filteredFarmers.length)
  return (
    <>
      <Helmet>
        <title> Farmer | SMF </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          Farmer
          </Typography>
          <Link to="/dashboard/addfarmer" style={{ textDecoration: 'none' }}>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Farmer
          </Button></Link>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  count={filteredFarmers.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredFarmers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,index) => {
                    const { id, name, phoneNumber, address } = row;
                    const selectedUser = selected.indexOf(id) !== -1;
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, id)} />
                        </TableCell>
                        <TableCell align="left">
                          <Link to={`/dashboard/getFarmerDetailsById/${id}`} style={{ textDecoration: 'none' }}>{id}</Link>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Link to={`/dashboard/getFarmerDetailsById/${id}`} style={{ textDecoration: 'none' }}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={row.name} src={avatarImports[index % avatarImports.length]} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                          </Link>
                        </TableCell>
                        <TableCell align="left">{address}</TableCell>
                        <TableCell>
                        <Link to={{pathname: `/dashboard/addDayDetails`, state: { row } }} style={{ textDecoration: 'none' }}>
                        <Button  type="submit" variant="contained" color="primary" className="form-button" >Add Data</Button>
                       </Link>
                        </TableCell>
                        <TableCell>
                        <Link to={`/dashboard/getFarmerDetailsById/${id}`} style={{ textDecoration: 'none' }}>
                        <Button  type="submit" variant="contained" color="primary" className="form-button" >Generate Bill</Button>
                       </Link>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredFarmers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}