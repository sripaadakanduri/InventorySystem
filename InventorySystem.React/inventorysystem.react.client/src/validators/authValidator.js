export const validateRegister = (form) => {
    const errors = {};

    if (!form.username || form.username.length < 3) {
        errors.username = "Username must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
        errors.email = "Invalid email format";
    }

    if (!form.password || form.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    return errors;
};
