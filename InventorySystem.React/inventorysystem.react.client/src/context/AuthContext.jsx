import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import API from "../services/api";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

const normalizeUser = (data) => ({
    username: data?.username ?? data?.Username ?? "",
    role: data?.role ?? data?.Role ?? "",
    email: data?.email ?? data?.Email ?? ""
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const res = await API.get("/Auth/me");
            const currentUser = normalizeUser(res.data);
            setUser(currentUser);
            return currentUser;
        } catch (error) {
            setUser(null);

            if (error.response?.status === 401) {
                authService.clearToken();
            }

            return null;
        }
    }, []);

    useEffect(() => {
        let active = true;

        const loadUser = async () => {
            setLoading(true);
            const currentUser = await refreshUser();

            if (active) {
                setUser(currentUser);
                setLoading(false);
            }
        };

        loadUser();

        return () => {
            active = false;
        };
    }, [refreshUser]);

    const value = useMemo(
        () => ({
            user,
            setUser,
            loading,
            refreshUser,
            authenticated: Boolean(user),
            role: user?.role ?? null,
            username: user?.username ?? null
        }),
        [loading, refreshUser, user]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider.");
    }

    return context;
};
