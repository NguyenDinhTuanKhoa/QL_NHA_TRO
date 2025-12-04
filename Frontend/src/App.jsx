import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './layouts/MainLayout';
import LandlordLayout from './layouts/LandlordLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import PhongTroList from './pages/PhongTroList';
import PhongTroDetail from './pages/PhongTroDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// User Pages
import MyRequests from './pages/user/MyRequests';
import MyRentals from './pages/user/MyRentals';
import Messages from './pages/user/Messages';

// Landlord Pages
import LandlordDashboard from './pages/landlord/Dashboard';
import LandlordRooms from './pages/landlord/MyRooms';
import AddRoom from './pages/landlord/AddRoom';
import LandlordRequests from './pages/landlord/Requests';
import LandlordMessages from './pages/landlord/Messages';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminRooms from './pages/admin/Rooms';
import AdminRequests from './pages/admin/Requests';

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="phongtro" element={<PhongTroList />} />
                    <Route path="phongtro/:id" element={<PhongTroDetail />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    
                    {/* User Routes */}
                    <Route path="my-requests" element={
                        <ProtectedRoute>
                            <MyRequests />
                        </ProtectedRoute>
                    } />
                    <Route path="my-rentals" element={
                        <ProtectedRoute>
                            <MyRentals />
                        </ProtectedRoute>
                    } />
                    <Route path="messages" element={
                        <ProtectedRoute>
                            <Messages />
                        </ProtectedRoute>
                    } />
                </Route>

                {/* Landlord Routes */}
                <Route path="/landlord" element={
                    <ProtectedRoute roles={['landlord', 'admin']}>
                        <LandlordLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<LandlordDashboard />} />
                    <Route path="rooms" element={<LandlordRooms />} />
                    <Route path="add-room" element={<AddRoom />} />
                    <Route path="requests" element={<LandlordRequests />} />
                    <Route path="messages" element={<LandlordMessages />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <ProtectedRoute roles={['admin']}>
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="rooms" element={<AdminRooms />} />
                    <Route path="requests" element={<AdminRequests />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
