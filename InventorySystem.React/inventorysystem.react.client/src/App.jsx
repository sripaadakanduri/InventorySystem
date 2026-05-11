// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./utils/ProtectedRoute";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Products from "./pages/Products/Products";
import Orders from "./pages/Orders/Orders";
import Transactions from "./pages/Transactions/Transactions";
import UsersManagement from "./pages/Admin/UsersManagement/UsersManagement";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
                />
                <Route
                    path="/products"
                    element={<ProtectedRoute><Products /></ProtectedRoute>}
                />
                <Route
                    path="/orders"
                    element={<ProtectedRoute><Orders /></ProtectedRoute>}
                />
                

                {/* Admin-only routes */}
                <Route
                    path="/admin/users"
                    element={<ProtectedRoute role="Admin"><UsersManagement /></ProtectedRoute>}
                />
                <Route
                    path="/transactions"
                    element={<ProtectedRoute><Transactions /></ProtectedRoute>}
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;