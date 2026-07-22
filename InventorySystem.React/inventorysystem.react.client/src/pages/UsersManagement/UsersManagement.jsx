import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUsers, updateUserRole, createUser } from "../../services/userService";
import Pagination from "../../components/Pagination/Pagination";
import { Users, Shield, ShieldOff, Plus, X } from "lucide-react";
import UserHoverCard from "./UserHoverCard";
import DataTable from "../../components/DataTable";

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
        username: "",
        role: ""
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

    const columns = [
        {
            key: "username",
            title: "Username",
            render: (value, row) => (
                        <UserHoverCard user={row}>
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                        </UserHoverCard>
                    ) 
        },
        {
            key: "email",
            title: "Email",
        },
        {
            key: "role",
            title: "Role",
            render: (value) => (
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        value === "Admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                >
                    {value}
                </span>
            )
        },
        {
            key: "action",
            title: "Action",
            render: (_, row) => (
                <div className="flex items-center justify-center">
                    {row.role === "User" ? (
                        <button
                            className="flex min-w-[150px] items-center gap-2 text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 px-3 py-2 rounded-lg transition shadow-sm text-sm font-medium"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRoleUpdate(row.id, "Admin");
                            }}
                        >
                            <Shield className="w-4 h-4" />
                            Make Admin
                        </button>
                    ) : (
                        <button
                            className={`flex max-w-[180px] items-center gap-2 px-3 py-2 rounded-lg transition shadow-sm text-sm font-medium ${
                                row.username.toLowerCase() === "bunny"
                                    ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                    : "text-amber-600 hover:text-white bg-amber-50 hover:bg-amber-600 border border-amber-200 hover:border-amber-600"
                            }`}
                            disabled={row.username.toLowerCase() === "bunny"}
                            title={
                                row.username.toLowerCase() === "bunny"
                                    ? "Cannot remove this admin"
                                    : ""
                            }
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRoleUpdate(row.id, "User");
                            }}
                        >
                            <ShieldOff className="w-4 h-4" />
                            Remove Admin
                        </button>
                    )}
                </div>
            )
        }
    ];
    const filterConfig = [
        {
            key: "username",
            type: "text",
            placeholder: "Filter by name...",
            className: "w-32"
        },
        {
            key: "role",
            type: "select",
            instant: true,
            className: "w-32",
            options: [
                {
                    value: "",
                    label: "All Roles"
                },
                {
                    value: "Admin",
                    label: "Admin"
                },
                {
                    value: "User",
                    label: "User"
                }
            ]
        }
    ];
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
                <DataTable
                    data={users}
                    columns={columns}
                    filters={filters}
                    filterConfig={filterConfig}
                    onFilterChange={handleFilterChange}
                    onInstantFilterChange={handleInstantFilterChange}
                    onFilterApply={handleFilterApply}
                    pagination={true}
                    onPageSizeChange={setPageSize}
                    onPageChange={setCurrentPage}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalItems={users.length}
                    emptyMessage="No users found."
                    loading={loading}
                />
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
