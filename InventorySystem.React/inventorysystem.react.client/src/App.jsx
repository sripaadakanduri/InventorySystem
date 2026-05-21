import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";

import ProtectedRoute from "./utils/ProtectedRoute";

import { isAuthenticated } from "./services/auth";

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

                {/* Root Route */}

                <Route
                    path="/"
                    element={
                        isAuthenticated()
                            ? <Navigate to="/dashboard" />
                            : <Navigate to="/login" />
                    }
                />

                {/* Auth Routes */}

                <Route
                    path="/login"
                    element={
                        isAuthenticated()
                            ? <Navigate to="/dashboard" />
                            : <Login />
                    }
                />

                <Route
                    path="/register"
                    element={
                        isAuthenticated()
                            ? <Navigate to="/dashboard" />
                            : <Register />
                    }
                />

                {/* Protected Routes */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/products"
                    element={
                        <ProtectedRoute>
                            <Products />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/transactions"
                    element={
                        <ProtectedRoute>
                            <Transactions />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Route */}

                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute role="Admin">
                            <UsersManagement />
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all Route */}

                <Route
                    path="*"
                    element={
                        isAuthenticated()
                            ? <Navigate to="/dashboard" />
                            : <Navigate to="/login" />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;