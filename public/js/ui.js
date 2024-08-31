export function showSection(sectionId) {
    const sections = ['homeSection', 'authSection', 'contactsSection', 'contactFormSection'];
    sections.forEach(id => document.getElementById(id).classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

export function updateUIAfterLogin() {
    document.getElementById('loginBtn').classList.add('hidden');
    document.getElementById('registerBtn').classList.add('hidden');
    document.getElementById('logoutBtn').classList.remove('hidden');
    document.getElementById('contactsBtn').classList.remove('hidden');
    document.getElementById('userInfoContainer').classList.remove('hidden');
    document.getElementById('userName').textContent = localStorage.getItem('userName');
    const avatarUrl = localStorage.getItem('avatarUrl');
    document.getElementById('avatarImage').src = avatarUrl || 'placeholder-avatar.png';
}

export function updateUIAfterLogout() {
    document.getElementById('loginBtn').classList.remove('hidden');
    document.getElementById('registerBtn').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.add('hidden');
    document.getElementById('contactsBtn').classList.add('hidden');
    document.getElementById('userInfoContainer').classList.add('hidden');
}

export function displayContacts(contacts, currentPage, contactsPerPage) {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';
    const startIndex = (currentPage - 1) * contactsPerPage;
    const endIndex = startIndex + contactsPerPage;
    const contactsToDisplay = contacts.slice(startIndex, endIndex);

    contactsToDisplay.forEach(contact => {
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

export function updatePagination(currentPage, totalContacts, contactsPerPage) {
    const totalPages = Math.ceil(totalContacts / contactsPerPage);
    document.getElementById('currentPage').textContent = `Strona ${currentPage} z ${totalPages}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

export function showAuthForm(type) {
    showSection('authSection');
    const authForm = document.getElementById('authForm');
    authForm.dataset.type = type;
    document.getElementById('authTitle').textContent = type === 'login' ? 'Logowanie' : 'Rejestracja';
    authForm.querySelector('button').textContent = type === 'login' ? 'Zaloguj' : 'Zarejestruj';
}

export function showAddContactForm() {
    showSection('contactFormSection');
    const contactForm = document.getElementById('contactForm');
    contactForm.reset();
    contactForm.dataset.mode = 'add';
    document.getElementById('contactFormTitle').textContent = 'Dodaj Kontakt';
}

export function fillContactForm(contact) {
    showSection('contactFormSection');
    document.getElementById('contactName').value = contact.name;
    document.getElementById('contactEmail').value = contact.email;
    document.getElementById('contactPhone').value = contact.phone;
    document.getElementById('contactForm').dataset.mode = 'edit';
    document.getElementById('contactForm').dataset.contactId = contact._id;
    document.getElementById('contactFormTitle').textContent = 'Edytuj Kontakt';
}