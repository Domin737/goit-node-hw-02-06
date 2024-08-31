import * as Auth from './auth.js';
import * as Contacts from './contacts.js';
import * as UI from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const homeBtn = document.getElementById('homeBtn');
    const contactsBtn = document.getElementById('contactsBtn');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const authForm = document.getElementById('authForm');
    const contactForm = document.getElementById('contactForm');
    const addContactBtn = document.getElementById('addContactBtn');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    let currentPage = 1;
    const contactsPerPage = 10;
    let totalContacts = 0;

    homeBtn.addEventListener('click', () => UI.showSection('homeSection'));
    contactsBtn.addEventListener('click', showContacts);
    loginBtn.addEventListener('click', () => UI.showAuthForm('login'));
    registerBtn.addEventListener('click', () => UI.showAuthForm('register'));
    logoutBtn.addEventListener('click', handleLogout);
    authForm.addEventListener('submit', handleAuth);
    addContactBtn.addEventListener('click', UI.showAddContactForm);
    contactForm.addEventListener('submit', handleContactForm);
    prevPageBtn.addEventListener('click', () => changePage(-1));
    nextPageBtn.addEventListener('click', () => changePage(1));

    function showContacts() {
        if (Auth.isLoggedIn()) {
            UI.showSection('contactsSection');
            fetchContacts();
        } else {
            UI.showAuthForm('login');
        }
    }

    async function handleAuth(e) {
        e.preventDefault();
        const type = authForm.dataset.type;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const result = await Auth.handleAuth(email, password, type);
        if (result.success) {
            UI.updateUIAfterLogin();
            showContacts();
        } else {
            alert(result.message);
        }
    }

    function handleLogout() {
        Auth.handleLogout();
        UI.updateUIAfterLogout();
        UI.showSection('homeSection');
    }

    async function fetchContacts() {
        try {
            const contacts = await Contacts.fetchContacts();
            totalContacts = contacts.length;
            UI.displayContacts(contacts, currentPage, contactsPerPage);
            UI.updatePagination(currentPage, totalContacts, contactsPerPage);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function changePage(direction) {
        currentPage += direction;
        fetchContacts();
    }

    async function handleContactForm(e) {
        e.preventDefault();
        const mode = contactForm.dataset.mode;
        const contactData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value
        };

        let result;
        if (mode === 'add') {
            result = await Contacts.addContact(contactData);
        } else {
            result = await Contacts.editContact(contactForm.dataset.contactId, contactData);
        }

        if (result.success) {
            showContacts();
        } else {
            alert(result.message);
        }
    }

    window.editContact = async function(contactId) {
        try {
            const contact = await Contacts.fetchContacts().then(contacts => 
                contacts.find(c => c._id === contactId)
            );
            if (contact) {
                UI.fillContactForm(contact);
            } else {
                throw new Error('Contact not found');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    window.deleteContact = async function(contactId) {
        if (confirm('Czy na pewno chcesz usunąć ten kontakt?')) {
            const result = await Contacts.deleteContact(contactId);
            if (result.success) {
                fetchContacts();
            } else {
                alert(result.message);
            }
        }
    }

    // Initialize UI
    if (Auth.isLoggedIn()) {
        UI.updateUIAfterLogin();
    } else {
        UI.updateUIAfterLogout();
    }
    UI.showSection('homeSection');
});