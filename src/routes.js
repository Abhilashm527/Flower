import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import AddFormer from './components/Logic/AddFarmer';
import FarmerDetails from './components/Logic/FarmerDetails';
import GetFarmerDetailsById from './components/Logic/GetFarmerDayDetailsById';
import Adddaydetails from './pages/AddDayDetails';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        // { element: <Navigate to="/dashboard/app" />, index: true },
        // { element: <Navigate to="/login" />, index: true },
     
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'addfarmer', element: <AddFormer /> },
        { path: 'addConsumer', element: <AddFormer /> },
        { path: 'farmerDetails', element: <FarmerDetails /> },
        { path: 'addDayDetails', element: <Adddaydetails /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'getFarmerDetailsById/:id', element: <GetFarmerDetailsById /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        {
          path: '/',
          element: <LoginPage />,
          index: true,
        },
        { element: <Navigate to="/dashboard/app" /> },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
