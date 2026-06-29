import useAuth from "./useAuth";

const useRole = () => {
    const { user } = useAuth();
    return user?.role ?? null;
};

export default useRole;
