export async function handleAuth(email, password, type) {
    try {
        const response = await fetch(`/api/users/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.user.name || email.split('@')[0]);
            localStorage.setItem('avatarUrl', data.user.avatarURL || '');
            return { success: true };
        } else {
            const error = await response.json();
            return { success: false, message: error.message };
        }
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'An unexpected error occurred' };
    }
}

export function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('avatarUrl');
}

export function isLoggedIn() {
    return !!localStorage.getItem('token');
}