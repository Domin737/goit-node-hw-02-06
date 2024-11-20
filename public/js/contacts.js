export async function fetchContacts() {
    try {
        const response = await fetch('/api/contacts', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to fetch contacts');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function addContact(contactData) {
    return await sendContactRequest('/api/contacts', 'POST', contactData);
}

export async function editContact(contactId, contactData) {
    return await sendContactRequest(`/api/contacts/${contactId}`, 'PUT', contactData);
}

export async function deleteContact(contactId) {
    try {
        const response = await fetch(`/api/contacts/${contactId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            return { success: true };
        } else {
            throw new Error('Failed to delete contact');
        }
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: error.message };
    }
}

async function sendContactRequest(url, method, contactData) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(contactData)
        });

        if (response.ok) {
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