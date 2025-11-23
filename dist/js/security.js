// Security utilities for password management
// FinClash Trading Simulator

// Password strength checker
const PasswordStrength = {
    // Check password strength
    check(password) {
        if (!password) {
            return {
                score: 0,
                strength: 'None',
                color: 'gray',
                feedback: 'Enter a password'
            };
        }

        let score = 0;
        const feedback = [];

        // Length check
        if (password.length >= 8) {
            score += 25;
        } else {
            feedback.push('Use at least 8 characters');
        }

        // Uppercase check
        if (/[A-Z]/.test(password)) {
            score += 25;
        } else {
            feedback.push('Add uppercase letters');
        }

        // Lowercase check
        if (/[a-z]/.test(password)) {
            score += 25;
        } else {
            feedback.push('Add lowercase letters');
        }

        // Number check
        if (/[0-9]/.test(password)) {
            score += 12.5;
        } else {
            feedback.push('Add numbers');
        }

        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) {
            score += 12.5;
        } else {
            feedback.push('Add special characters (!@#$%^&*)');
        }

        // Determine strength level
        let strength, color;
        if (score < 25) {
            strength = 'Weak';
            color = 'red';
        } else if (score < 50) {
            strength = 'Fair';
            color = 'orange';
        } else if (score < 75) {
            strength = 'Good';
            color = 'yellow';
        } else {
            strength = 'Strong';
            color = 'green';
        }

        return {
            score,
            strength,
            color,
            feedback: feedback.length > 0 ? feedback : ['Great password!']
        };
    },

    // Validate password meets minimum requirements
    validate(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

        const isValid =
            password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumber &&
            hasSpecialChar;

        const errors = [];
        if (password.length < minLength) errors.push('Password must be at least 8 characters');
        if (!hasUpperCase) errors.push('Password must contain uppercase letters');
        if (!hasLowerCase) errors.push('Password must contain lowercase letters');
        if (!hasNumber) errors.push('Password must contain numbers');
        if (!hasSpecialChar) errors.push('Password must contain special characters');

        return {
            isValid,
            errors
        };
    }
};

// Simple password hashing (SHA-256)
const PasswordHash = {
    // Hash password using SHA-256
    async hash(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    },

    // Verify password against hash
    async verify(password, hash) {
        const passwordHash = await this.hash(password);
        return passwordHash === hash;
    }
};

// Email validation
const EmailValidator = {
    validate(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
};

// Make globally available
window.PasswordStrength = PasswordStrength;
window.PasswordHash = PasswordHash;
window.EmailValidator = EmailValidator;
