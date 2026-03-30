import { blurBackground, unblurBackground } from './background.js';
import { closeConfig } from './config.js';

const shortcutbar = document.querySelector('.shortcutbar');
const gear = document.querySelector('.gear');

// New shortcut modal elements
const newContainer = document.querySelector('.new-container');
const newForm = document.querySelector('.new-form');
const newNameInput = document.getElementById('new-name-input');
const newUrlInput = document.getElementById('new-url-input');
const newIconInput = document.getElementById('new-icon-input');
const shortcutNewBtn = document.querySelector('.shortcut-new');

// Edit shortcut modal elements
const editContainer = document.querySelector('.edit-container');
const editForm = document.querySelector('.edit-form');
const editNameInput = document.getElementById('edit-name-input');
const editUrlInput = document.getElementById('edit-url-input');
const editIconInput = document.getElementById('edit-icon-input');

let shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];
let activeContextMenu = null;
let newOpen = false;
let editingIndex = -1;

function save() {
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
}

function render() {
    shortcutbar.textContent = '';

    shortcuts.forEach((shortcut, i) => {
        const container = document.createElement('div');
        container.className = 'shortcut-container';
        container.dataset.index = i;

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.innerHTML = `<ul>
            <li class="btn" data-action="edit">Edit</li>
            <li class="btn" data-action="delete">Delete</li>
        </ul>`;

        const link = document.createElement('a');
        link.className = 'grow-on-hover shortcut';
        link.href = shortcut.url;
        link.target = '_blank';

        const img = document.createElement('img');
        img.src = shortcut.logo;
        img.alt = shortcut.name;
        img.width = 40;
        img.height = 40;
        link.appendChild(img);

        container.append(menu, link);
        shortcutbar.appendChild(container);
    });
}

// --- Context menu (delegated) ---

shortcutbar.addEventListener('contextmenu', (e) => {
    const link = e.target.closest('.shortcut');
    if (!link) return;
    e.preventDefault();

    closeAllMenus();
    const menu = link.previousElementSibling;
    menu.classList.add('show');
    activeContextMenu = menu;
});

shortcutbar.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;

    const container = actionEl.closest('.shortcut-container');
    const index = parseInt(container.dataset.index);

    closeAllMenus();

    if (actionEl.dataset.action === 'delete') {
        shortcuts.splice(index, 1);
        save();
        render();
    } else if (actionEl.dataset.action === 'edit') {
        openEdit(index);
    }
});

function closeAllMenus() {
    if (activeContextMenu) {
        activeContextMenu.classList.remove('show');
        activeContextMenu = null;
    }
}

// --- Edit modal ---

function openEdit(index) {
    editingIndex = index;
    editNameInput.value = shortcuts[index].name;
    editUrlInput.value = shortcuts[index].url;
    editContainer.classList.add('show');
    blurBackground();
}

function closeEdit() {
    if (editingIndex < 0) return;
    editContainer.classList.remove('show');
    unblurBackground();
    editingIndex = -1;
}

editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (editingIndex < 0) return;

    shortcuts[editingIndex].name = editNameInput.value;
    shortcuts[editingIndex].url = editUrlInput.value;
    save();
    render();
    closeEdit();
});

editIconInput.addEventListener('change', () => {
    if (editingIndex < 0 || !editIconInput.files[0]) return;
    shortcuts[editingIndex].logo = `./imgs/logos/${editIconInput.files[0].name}`;
    save();
    render();
});

// --- New shortcut modal ---

function openNew() {
    if (newOpen) return;
    newOpen = true;
    newContainer.classList.add('show');
    blurBackground();
}

function closeNew() {
    if (!newOpen) return;
    newOpen = false;
    newContainer.classList.remove('show');
    unblurBackground();
    newForm.reset();
}

shortcutNewBtn.addEventListener('click', () => {
    closeConfig();
    openNew();
});

newForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const iconFile = newIconInput.files[0];
    const iconPath = iconFile ? `./imgs/logos/${iconFile.name}` : '';

    shortcuts.push({
        name: newNameInput.value,
        url: newUrlInput.value,
        logo: iconPath
    });

    save();
    render();
    closeNew();
});

// --- Global dismiss handlers (registered once) ---

document.addEventListener('mousedown', (e) => {
    // Close context menus
    if (activeContextMenu && !activeContextMenu.contains(e.target)) {
        closeAllMenus();
    }

    // Close edit modal
    if (editingIndex >= 0 && !editContainer.contains(e.target)) {
        closeEdit();
    }

    // Close new modal
    if (newOpen && !newContainer.contains(e.target) && e.target !== shortcutNewBtn) {
        closeNew();
    }
});

gear.addEventListener('click', () => {
    if (newOpen) closeNew();
    if (editingIndex >= 0) closeEdit();
});

// Initial render
render();
