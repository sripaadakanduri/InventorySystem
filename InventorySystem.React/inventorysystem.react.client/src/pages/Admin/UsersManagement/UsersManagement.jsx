import { useEffect, useState } from "react";

import {
    getUsers,
    updateUserRole,
    createUser
} from "../../../services/userService";

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

    // ============================================
    // FETCH USERS
    // ============================================

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

    // ============================================
    // UPDATE ROLE
    // ============================================

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

    // ============================================
    // ADD USER
    // ============================================

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

    return (

        <div className="users-management-container">

            {/* ============================================
                HEADER
            ============================================ */}

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

            {/* ============================================
                USERS TABLE
            ============================================ */}

            <div className="users-table-wrapper">

                <table className="users-table">

                    <thead>

                        <tr>

                            <th>Username</th>

                            <th>Email</th>

                            <th>Role</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {users.length > 0 ? (

                            users.map((user) => (

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

            {/* ============================================
                ADD USER MODAL
            ============================================ */}

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