
import { DataManager } from './data.js';

// Auth Check
if (localStorage.getItem('st_marys_auth') !== 'true') {
    window.location.href = '/admin/index.html';
}

let currentScope = 'icse'; // or sslc
let currentYear = '2024-2025';
let editingIndex = -1;

// Global exposed functions for HTML onclicks
window.logout = () => {
    localStorage.removeItem('st_marys_auth');
    window.location.href = '/admin/index.html';
};

window.switchView = (scope) => {
    currentScope = scope;
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
    // Simple way to highlight active link
    const links = document.querySelectorAll('.sidebar-menu a');
    if (scope === 'icse') links[0].classList.add('active');
    if (scope === 'sslc') links[1].classList.add('active');

    document.getElementById('page-title').textContent = `Manage ${scope.toUpperCase()} Achievements`;
    renderTable();
};

window.openAddModal = () => {
    editingIndex = -1;
    document.getElementById('edit-index').value = -1;
    document.getElementById('student-form').reset();
    document.getElementById('student-modal').classList.add('active');
};

window.closeModal = () => {
    document.getElementById('student-modal').classList.remove('active');
};

window.editStudent = (index) => {
    editingIndex = index;
    const data = DataManager.getData();
    const student = data[currentScope][currentYear].toppers[index];

    document.getElementById('edit-index').value = index;
    document.getElementById('s-name').value = student.name;
    document.getElementById('s-percent').value = student.percentage;
    document.getElementById('s-rank').value = student.rank;
    document.getElementById('s-photo').value = student.photo;

    document.getElementById('student-modal').classList.add('active');
};

window.deleteStudent = (index) => {
    if (confirm('Are you sure you want to delete this student?')) {
        const data = DataManager.getData();
        data[currentScope][currentYear].toppers.splice(index, 1);
        DataManager.saveData(data);
        renderTable();
    }
};

function renderTable() {
    const tbody = document.getElementById('students-table-body');
    tbody.innerHTML = '';

    const data = DataManager.getData();
    // Create structure if missing (e.g. fresh year)
    if (!data[currentScope][currentYear]) {
        data[currentScope][currentYear] = { toppers: [], stats: {} };
    }

    const students = data[currentScope][currentYear].toppers;

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No records found</td></tr>';
        return;
    }

    students.forEach((s, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${s.rank}</td>
            <td><img src="${s.photo}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"></td>
            <td>${s.name}</td>
            <td>${s.percentage}%</td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="editStudent(${index})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-outline btn-sm" style="color:red; border-color:red;" onclick="deleteStudent(${index})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Form Submit
document.getElementById('student-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('s-name').value;
    const percentage = parseFloat(document.getElementById('s-percent').value);
    const rank = parseInt(document.getElementById('s-rank').value);
    const photo = document.getElementById('s-photo').value;

    const data = DataManager.getData();
    if (!data[currentScope][currentYear]) {
        data[currentScope][currentYear] = { toppers: [], stats: {} };
    }

    const student = { name, percentage, rank, photo };

    if (editingIndex === -1) {
        // Add
        data[currentScope][currentYear].toppers.push(student);
    } else {
        // Edit
        data[currentScope][currentYear].toppers[editingIndex] = student;
    }

    // Sort by rank
    data[currentScope][currentYear].toppers.sort((a, b) => a.rank - b.rank);

    DataManager.saveData(data);
    window.closeModal();
    renderTable();
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});
