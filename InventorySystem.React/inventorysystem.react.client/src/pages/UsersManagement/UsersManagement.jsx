import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUsers, updateUserRole, createUser } from "../../services/userService";
import Pagination from "../../components/Pagination/Pagination";
import { Users, Shield, ShieldOff, Plus, X } from "lucide-react";

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        role: "User"
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState({
        Username: "",
        Role: ""
    });

    const fetchUsers = async (filterParams = filters) => {
        try {
            setLoading(true);
            const data = await getUsers(filterParams);
            setUsers(data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load users.");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleUpdate = async (id, role) => {
        try {
            await updateUserRole(id, role);
            toast.success("User role updated successfully.");
            fetchUsers(filters);
        } catch (error) {
            console.log(error);
            toast.error("Failed to update user role.");
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await createUser(newUser);
            toast.success("User created successfully.");
            setShowAddModal(false);
            setNewUser({
                username: "",
                email: "",
                password: "",
                role: "User"
            });
            fetchUsers(filters);
        } catch (error) {
            console.error(error);
            const message = typeof error.response?.data === 'string'
                ? error.response.data
                : error.response?.data?.title || "An error occurred";
            toast.error(message);
        }
    };

    const handleFilterChange = (e) => {
        const updatedFilters = {
            ...filters,
            [e.target.name]: e.target.value
        };

        setFilters(updatedFilters);
        setCurrentPage(1);
    };

    const handleFilterApply = () => {
        fetchUsers(filters);
        setCurrentPage(1);
    };

    const handleFilterKeyDown = (e) => {
        if (e.key === "Enter") {
            handleFilterApply();
        }
    };

    const handleInstantFilterChange = (e) => {
        const updatedFilters = {
            ...filters,
            [e.target.name]: e.target.value
        };

        setFilters(updatedFilters);
        setCurrentPage(1);
        fetchUsers(updatedFilters);
    };

    const indexOfLastUser = currentPage * pageSize;
    const indexOfFirstUser = indexOfLastUser - pageSize;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className="max-w-7xl mx-auto p-6 mt-8">
            <div className="flex justify-between items-center mb-8">
                <div className="group flex items-center gap-3">
                    <Users className="w-8 h-8 text-indigo-600 group-hover:scale-120 transition transform duration-300" />
                    <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
                </div>
                <button
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 hover:rotate-90 text-white px-5 py-5 rounded-full font-semibold shadow-md hover:scale-105 transition-transform duration-200"
                    onClick={() => setShowAddModal(true)}
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="w-full overflow-x-auto rounded-3xl border border-gray-200 shadow-lg bg-white mt-6">
                <table className="w-full border-collapse">
                    <thead className="bg-blue-50 text-white border-b border-gray-200">
                        <tr className="text-black">
                            <th className="p-4 text-center font-semibold w-1/3">Username</th>
                            <th className="p-4 text-center font-semibold w-1/4">Email</th>
                            <th className="p-4 text-center font-semibold w-1/4">Role</th>
                            <th className="p-4 text-center font-semibold w-1/6">Action</th>
                        </tr>
                        <tr className="text-white">
                            <th className="p-2 px-4">
                                <div className="flex justify-center">
                                    <input
                                        type="text"
                                        name="Username"
                                        placeholder="Filter by name..."
                                        value={filters.Username}
                                        onChange={handleFilterChange}
                                        onKeyDown={handleFilterKeyDown}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
                                    />
                                </div>
                            </th>
                            <th className="p-2 px-4 text-black"></th>
                            <th className="p-2 px-4">
                                <div className="flex justify-center">
                                    <select
                                        name="Role"
                                        value={filters.Role}
                                        onChange={handleInstantFilterChange}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
                                    >
                                        <option value="">All Roles</option>
                                        <option value="Admin">Admin</option>
                                        <option value="User">User</option>
                                    </select>
                                </div>
                            </th>
                            <th className="p-2 text-black px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500 text-lg">
                                    Loading users...
                                </td>
                            </tr>
                        ) : currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <tr key={user.id} className="border-b border-gray-200 hover:bg-indigo-50 transition duration-150 cursor-pointer hover:translate-0.5 transform">
                                    <td className="p-4 text-center font-medium text-gray-900">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</td>
                                    <td className="p-4 text-center text-gray-600">{user.email}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${user.role === "Admin" ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            {user.role === "User" ? (
                                                <button
                                                    className="flex items-center gap-2 text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 px-3 py-2 rounded-lg transition shadow-sm w-full justify-center text-sm font-medium"
                                                    onClick={() => handleRoleUpdate(user.id, "Admin")}
                                                >
                                                    <Shield className="w-4 h-4" /> Make Admin
                                                </button>
                                            ) : (
                                                <button
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition shadow-sm w-full justify-center text-sm font-medium ${user.username.toLowerCase() === "bunny"
                                                        ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                                        : "text-amber-600 hover:text-white bg-amber-50 hover:bg-amber-600 border border-amber-200 hover:border-amber-600"
                                                        }`}
                                                    onClick={() => handleRoleUpdate(user.id, "User")}
                                                    disabled={user.username.toLowerCase() === "bunny"}
                                                    title={user.username.toLowerCase() === "bunny" ? "Cannot remove this admin" : ""}
                                                >
                                                    <ShieldOff className="w-4 h-4" /> Remove Admin
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500 text-lg">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="p-4 bg-white rounded-b-3xl">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={users.length}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                    />
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity" onClick={() => setShowAddModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Add New User</h3>
                            <button className="text-gray-400 hover:text-gray-600 transition" onClick={() => setShowAddModal(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form className="space-y-4" onSubmit={handleAddUser}>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Username</label>
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                >
                                    <option value="User">User</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition duration-200">
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
