import { useEffect, useState } from "react";
import {
    getUsers,
    updateUserRole
} from "../../../services/userService";

import "./UsersManagement.css";

const UsersManagement = () => {

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {

        try {

            const data = await getUsers();

            setUsers(data);

        } catch (error) {

            console.log(error);
        }
    };

    const handleRoleUpdate = async (id, role) => {

        try {

            await updateUserRole(id, role);

            fetchUsers();

        } catch (error) {

            console.log(error);
        }
    };

    useEffect(() => {

        fetchUsers();

    }, []);

    return (

        <div className="users-management-container">

            <h2 className="users-management-title">
                User Management
            </h2>

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

                        {
                            users.length > 0 ? (

                                users.map((user) => (

                                    <tr key={user.id}>

                                        <td>{user.username}</td>

                                        <td>{user.email}</td>

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

                                            {
                                                user.role === "User" ? (

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
                                                )
                                            }

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
                            )
                        }

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default UsersManagement;