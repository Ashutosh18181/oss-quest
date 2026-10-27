/**
 * OSS Quest — Auth Service (Local Pivot)
 * Bypasses login for local demo.
 */

const LOCAL_USER = {
    id: 'user_local_1',
    email: 'local@ossquest.dev',
    created_at: new Date().toISOString()
};

export function getCurrentUser() {
    return LOCAL_USER;
}

export function isAuthenticated() {
    return true;
}

export function signIn() {
    return LOCAL_USER;
}

export function signOut() {
    // No-op for local build
}

export function requireAuth() {
    return LOCAL_USER;
}
