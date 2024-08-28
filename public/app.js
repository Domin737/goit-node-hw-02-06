document.addEventListener('DOMContentLoaded', () => {
    const homeBtn = document.getElementById('homeBtn');
    const contactsBtn = document.getElementById('contactsBtn');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const homeSection = document.getElementById('homeSection');
    const authSection = document.getElementById('authSection');
    const contactsSection = document.getElementById('contactsSection');
    const contactFormSection = document.getElementById('contactFormSection');
    const authForm = document.getElementById('authForm');
    const contactForm = document.getElementById('contactForm');
    const addContactBtn = document.getElementById('addContactBtn');
    const contactsList = document.getElementById('contactsList');
    const authTitle = document.getElementById('authTitle');

    homeBtn.addEventListener('click', showHome);
    contactsBtn.addEventListener('click', showContacts);
    loginBtn.addEventListener('click', () => showAuthForm('login'));
    registerBtn.addEventListener('click', () => showAuthForm('register'));
    logoutBtn.addEventListener('click', handleLogout);
    authForm.addEventListener('submit', handleAuth);
    addContactBtn.addEventListener('click', showAddContactForm);
    contactForm.addEventListener('submit', handleContactForm);

    function showSection(section) {
        [homeSection, authSection, contactsSection, contactFormSection].forEach(s => s.classList.add('hidden'));
        section.classList.remove('hidden');
    }

    function showHome() {
        showSection(homeSection);
    }

    function showContacts() {
        if (isLoggedIn()) {
            showSection(contactsSection);
            fetchContacts();
        } else {
            showAuthForm('login');
        }
    }

    function showAuthForm(type) {
        showSection(authSection);
        authForm.dataset.type = type;
        authTitle.textContent = type === 'login' ? 'Logowanie' : 'Rejestracja';
        authForm.querySelector('button').textContent = type === 'login' ? 'Zaloguj' : 'Zarejestruj';
    }

    function showAddContactForm() {
        showSection(contactFormSection);
        contactForm.reset();
        contactForm.dataset.mode = 'add';
        document.getElementById('contactFormTitle').textContent = 'Dodaj Kontakt';
    }

    async function handleAuth(e) {
        e.preventDefault();
        const type = authForm.dataset.type;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`/api/users/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                updateUIAfterLogin();
                showContacts();
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error('Błąd:', error);
        }
    }

    function handleLogout() {
        localStorage.removeItem('token');
        updateUIAfterLogout();
        showHome();
    }

    function updateUIAfterLogin() {
        loginBtn.classList.add('hidden');
        registerBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        contactsBtn.classList.remove('hidden');
    }

    function updateUIAfterLogout() {
        loginBtn.classList.remove('hidden');
        registerBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        contactsBtn.classList.add('hidden');
    }

    function isLoggedIn() {
        return !!localStorage.getItem('token');
    }

    async function fetchContacts() {
        try {
            const response = await fetch('/api/contacts', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const contacts = await response.json();
                displayContacts(contacts);
            } else {
                throw new Error('Nie udało się pobrać kontaktów');
            }
        } catch (error) {
            console.error('Błąd:', error);
        }
    }

    function displayContacts(contacts) {
        contactsList.innerHTML = '';
        contacts.forEach(contact => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong>${contact.name}</strong><br>
                    ${contact.email}<br>
                    ${contact.phone}
                </div>
                <div>
                    <button onclick="editContact('${contact._id}')">Edytuj</button>
                    <button onclick="deleteContact('${contact._id}')">Usuń</button>
                </div>
            `;
            contactsList.appendChild(li);
        });
    }

    async function handleContactForm(e) {
        e.preventDefault();
        const mode = contactForm.dataset.mode;
        const contactData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value
        };

        try {
            const url = mode === 'add' ? '/api/contacts' : `/api/contacts/${contactForm.dataset.contactId}`;
            const method = mode === 'add' ? 'POST' : 'PUT';
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(contactData)
            });

            if (response.ok) {
                showContacts();
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error('Błąd:', error);
        }
    }

    window.editContact = async function(contactId) {
        try {
            const response = await fetch(`/api/contacts/${contactId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const contact = await response.json();
                showSection(contactFormSection);
                document.getElementById('contactName').value = contact.name;
                document.getElementById('contactEmail').value = contact.email;
                document.getElementById('contactPhone').value = contact.phone;
                contactForm.dataset.mode = 'edit';
                contactForm.dataset.contactId = contactId;
                document.getElementById('contactFormTitle').textContent = 'Edytuj Kontakt';
            } else {
                throw new Error('Nie udało się pobrać danych kontaktu');
            }
        } catch (error) {
            console.error('Błąd:', error);
        }
    }

    window.deleteContact = async function(contactId) {
        if (confirm('Czy na pewno chcesz usunąć ten kontakt?')) {
            try {
                const response = await fetch(`/api/contacts/${contactId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    fetchContacts();
                } else {
                    throw new Error('Nie udało się usunąć kontaktu');
                }
            } catch (error) {
                console.error('Błąd:', error);
            }
        }
    }

    // Inicjalizacja UI
    if (isLoggedIn()) {
        updateUIAfterLogin();
    } else {
        updateUIAfterLogout();
    }
    showHome();
});