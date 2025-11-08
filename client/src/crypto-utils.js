// Cryptographic utilities for browser
// SHA-256 hashing without needing Node.js crypto

async function hashCode(code) {
    // Use Web Crypto API (available in all modern browsers)
    const encoder = new TextEncoder();
    const data = encoder.encode(code);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function verifyCode(code, hash) {
    const codeHash = await hashCode(code);
    return codeHash === hash;
}

// Make functions available globally
window.cryptoUtils = {
    hashCode,
    verifyCode
};
