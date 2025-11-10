import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import './App.css'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Donations from './components/Donations'
import Browse from './components/Browse'
import Profile from './components/Profile'
import DonationDescription from './components/DonationDescription'
import Donors from './components/admin/Donors'
import DonorCreate from './components/admin/DonorCreate'
import DonorSetup from './components/admin/DonorSetup'
import AdminDonations from "./components/admin/AdminDonations";
import PostDonation from './components/admin/PostDonation'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/donations",
    element: <Donations />
  },
  {
    path: "/description/:id",
    element: <DonationDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  // Admin(Donor) routes start here
  {
    path: "/admin/donors",
    element: <ProtectedRoute><Donors /></ProtectedRoute>
  },
  {
    path: "/admin/donors/create",
    element: <ProtectedRoute><DonorCreate /></ProtectedRoute>
  },
  {
    path: "/admin/donors/:id",
    element: <ProtectedRoute><DonorSetup /></ProtectedRoute>
  },
  {
    path: "/admin/donations",
    element: <ProtectedRoute><AdminDonations /></ProtectedRoute>
  },
  {
    path: "/admin/donations/create",
    element: <ProtectedRoute><PostDonation /></ProtectedRoute>
  },
  {
    path: "/admin/donations/:id/edit",
    element: <ProtectedRoute><PostDonation /></ProtectedRoute>
  },
  {
    path: "/admin/donations/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },
])

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
