export const validateRegister = (form) => {
    const errors = {};

    // Username
    if (!form.username || form.username.length < 3) {
        errors.username = "Username must be at least 3 characters";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
        errors.email = "Invalid email format";
    }

    // Password
    if (!form.password || form.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    return errors;
};
