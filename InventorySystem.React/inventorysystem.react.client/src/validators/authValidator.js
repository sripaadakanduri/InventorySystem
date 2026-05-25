export const validateRegister = (form) => {
    const errors = {};

    if (!form.username || form.username.length < 3) {
        errors.username = "Username must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
        errors.email = "Invalid email format";
    }

    if (!form.password) {
        errors.password = "Password is required";
    } else {
        if (form.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[A-Z])/.test(form.password)) {
            errors.password = "Password must contain an uppercase letter";
        } else if (!/(?=.*[a-z])/.test(form.password)) {
            errors.password = "Password must contain a lowercase letter";
        } else if (!/(?=.*\d)/.test(form.password)) {
            errors.password = "Password must contain a number";
        } else if (!/(?=.*[!@#$%^&*.,<>?|])/.test(form.password)) {
            errors.password = "Password must contain a special character";
        }
    }

    return errors;
};
