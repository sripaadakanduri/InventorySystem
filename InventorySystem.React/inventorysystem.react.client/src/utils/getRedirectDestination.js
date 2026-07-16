export const getRedirectDestination = (from, fallback = "/dashboard") => {
    if (!from?.pathname) {
        return fallback;
    }

    return `${from.pathname}${from.search || ""}${from.hash || ""}`;
};
