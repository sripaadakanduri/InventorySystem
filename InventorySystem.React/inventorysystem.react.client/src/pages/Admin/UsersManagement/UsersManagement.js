import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../../../services/userService";

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
        <div style={{ padding: "20px" }}>
            <h2>User Management</h2>

            <table border="1" cellPadding="10" width="100%">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                {user.role === "User" ? (
                                    <button onClick={() => handleRoleUpdate(user.id, "Admin")}>
                                        Make Admin
                                    </button>
                                ) : (
                                    <button onClick={() => handleRoleUpdate(user.id, "User")}>
                                        Remove Admin
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersManagement;