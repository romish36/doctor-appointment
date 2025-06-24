import logo from './logo.svg';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Layout from './components/Layout';
import useUserData from './hooks/useUserData';
import ApplyDoctor from './pages/ApplyDoctor';
import Notifications from './pages/Notifications';
import DoctorsList from './pages/Admin/DoctorsList';
import UsersList from './pages/Admin/UsersList';
import Appointments from './pages/Doctor/Appointments'
import DoctorLayout from './components/DoctorLayout';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import BookAppointment from './pages/BookAppointment';
import UserAppointment from './pages/UserAppointment';

function App() {
  const user = useUserData();
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* User Routes */}
          {user && !user.isAdmin && !user.isDoctor && (
            <Route path='/user/*' element={
              <Layout>
                <Routes>
                  <Route path='home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path='profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path='apply-doctor' element={<ProtectedRoute><ApplyDoctor /></ProtectedRoute>} />
                  <Route path='notifications' element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                  <Route path='book-appointment/:doctorId' element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
                  <Route path='user-appointments' element={<ProtectedRoute><UserAppointment /></ProtectedRoute>} />
                </Routes>
              </Layout>
            } />
          )}

          {/* Doctor Routes */}
          {user && user.isDoctor && (
            <Route path='/doctor/*' element={
              <DoctorLayout>
                <Routes>
                  <Route path='home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path='appointments' element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
                  <Route path='profile' element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
                  <Route path='notifications' element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                </Routes>
              </DoctorLayout>
            } />
          )}

          {/* Admin Routes */}
          {user && user.isAdmin && (
            <Route path='/admin/*' element={
              <AdminLayout>
                <Routes>
                  <Route path='home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path='users' element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
                  <Route path='doctors' element={<ProtectedRoute><DoctorsList /></ProtectedRoute>} />
                  <Route path='profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path='notifications' element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                </Routes>
              </AdminLayout>
            } />
          )}

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
