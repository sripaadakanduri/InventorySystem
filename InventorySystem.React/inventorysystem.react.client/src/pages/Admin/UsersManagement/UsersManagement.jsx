import { useEffect, useState } from "react";

import {
    getUsers,
    updateUserRole,
    createUser
} from "../../../services/userService";

import Pagination from "../../../components/Pagination/Pagination";
import "./UsersManagement.css";

const UsersManagement = () => {

    const [users, setUsers] = useState([]);

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        role: "User"
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] =
        useState(10);
    const [filterUsername, setFilterUsername] = useState("");
    const [filterRole, setFilterRole] = useState("");

    const fetchUsers = async () => {

        try {

            const data = await getUsers();

            setUsers(data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchUsers();

    }, []);

    const handleRoleUpdate = async (
        id,
        role
    ) => {

        try {

            await updateUserRole(id, role);

            fetchUsers();

        } catch (error) {

            console.log(error);

        }

    };

    const handleAddUser = async (e) => {

        e.preventDefault();

        try {

            await createUser(newUser);

            setShowAddModal(false);

            setNewUser({
                username: "",
                email: "",
                password: "",
                role: "User"
            });

            fetchUsers();

        } catch (error) {

            console.log(error);

        }

    };

    let filteredUsers = [...users];

    if (filterUsername) {
        filteredUsers = filteredUsers.filter(user =>
            user.username.toLowerCase().includes(filterUsername.toLowerCase())
        );
    }

    if (filterRole) {
        filteredUsers = filteredUsers.filter(user =>
            user.role === filterRole
        );
    }

    const indexOfLastUser = currentPage * pageSize;
    const indexOfFirstUser = indexOfLastUser - pageSize;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return (

        <div className="users-management-container">

            <div className="users-header">

                <h2 className="users-management-title">
                    User Management
                </h2>

                <button
                    className="add-user-btn"
                    onClick={() =>
                        setShowAddModal(true)
                    }
                >
                    +
                </button>

            </div>



            <div className="users-table-wrapper">

                <table className="users-table">

                    <thead>

                        <tr>

                           
                        </tr>

                    </thead>

                    <tbody>

                        {currentUsers.length > 0 ? (

                            currentUsers.map((user) => (

                                <tr key={user.id}>

                                    <td>
                                        {user.username}
                                    </td>

                                    <td>
                                        {user.email}
                                    </td>

                                    <td>

                                        <span
                                            className={
                                                user.role === "Admin"
                                                    ? "role-badge role-admin"
                                                    : "role-badge role-user"
                                            }
                                        >

                                            {user.role}

                                        </span>

                                    </td>

                                    <td>

                                        {user.role === "User" ? (

                                            <button
                                                className="action-button make-admin-btn"
                                                onClick={() =>
                                                    handleRoleUpdate(
                                                        user.id,
                                                        "Admin"
                                                    )
                                                }
                                            >
                                                Make Admin
                                            </button>

                                        ) : (

                                            <button
                                                    className="action-button remove-admin-btn"
                                                    onClick={() =>
                                                        handleRoleUpdate(
                                                            user.id,
                                                            "User"
                                                        )
                                                    }
                                                    disabled={user.username.toLowerCase() === "bunny"}
                                                    title={user.username.toLowerCase() === "bunny" ? "cannot remove this admin" : ""}
                                                    style={user.username.toLowerCase() === "bunny" ? { opacity: 0.5, cursor: "not-allowed" } : {}}

                                            >
                                                Remove Admin
                                            </button>

                                        )}

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="no-users"
                                >
                                    No users found
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        

            <Pagination
                currentPage={currentPage}
                totalItems={filteredUsers.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
            />


            {showAddModal && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowAddModal(false)
                    }
                >

                    <div
                        className="modal-content"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <h3>
                                Add User
                            </h3>

                            <button
                                className="close-btn"
                                onClick={() =>
                                    setShowAddModal(false)
                                }
                            >
                                ✕
                            </button>

                        </div>

                        <form
                            className="modal-body"
                            onSubmit={handleAddUser}
                        >

                            <input
                                type="text"
                                placeholder="Username"
                                value={newUser.username}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        username:
                                            e.target.value
                                    })
                                }
                                required
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        email:
                                            e.target.value
                                    })
                                }
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        password:
                                            e.target.value
                                    })
                                }
                                required
                            />

                            <select
                                value={newUser.role}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        role:
                                            e.target.value
                                    })
                                }
                            >

                                <option value="User">
                                    User
                                </option>

                                <option value="Admin">
                                    Admin
                                </option>

                            </select>

                            <button
                                type="submit"
                                className="add-user-submit-btn"
                            >
                                Create User
                            </button>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

};

export default UsersManagement;