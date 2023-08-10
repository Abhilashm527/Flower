import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import '../styles/DashboardAppPage.css'
import { Link } from 'react-router-dom';
import addFarmerIcon from '../components/images/farmerlogo.jpg'
import {
  AppWidgetSummary,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3} className='grid'>
          <Grid item xs={12} sm={6} md={5}>
          <Link to="/dashboard/addfarmer" style={{ textDecoration: 'none' }}>
            <AppWidgetSummary title="Add Farmer" color="info" icon={addFarmerIcon}  /></Link>
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
          <Link to="/dashboard/addConsumer" style={{ textDecoration: 'none' }}>
            <AppWidgetSummary title="Add Consumer" color="info" icon={addFarmerIcon} /></Link>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
