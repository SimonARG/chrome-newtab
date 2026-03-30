import { blurBackground, unblurBackground } from './background.js';

const gear = document.querySelector('.gear');
const config = document.querySelector('.config-container');
const faviconEl = document.getElementById('favicon');
const tabTitleInput = document.getElementById('title-input');
const faviconInput = document.getElementById('favicon-input');

let configOpen = false;

export function openConfig() {
    if (configOpen) return;
    configOpen = true;
    config.classList.add('show');
    blurBackground();
}

export function closeConfig() {
    if (!configOpen) return;
    configOpen = false;
    config.classList.remove('show');
    unblurBackground();
}

export function toggleConfig() {
    if (configOpen) closeConfig();
    else openConfig();
}

export function isConfigOpen() {
    return configOpen;
}

// Gear toggle
gear.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleConfig();
});

// Close on outside click
document.addEventListener('click', (e) => {
    if (configOpen && !config.contains(e.target) && e.target !== gear) {
        closeConfig();
    }
});

// Tab title
const savedTitle = localStorage.getItem('tabTitle') || '⠀';
document.title = savedTitle;
tabTitleInput.value = savedTitle === '⠀' ? '' : savedTitle;

tabTitleInput.addEventListener('input', () => {
    const title = tabTitleInput.value || '⠀';
    document.title = title;
    localStorage.setItem('tabTitle', title);
});

// Favicon
faviconEl.href = localStorage.getItem('faviconPath') || '';

faviconInput.addEventListener('change', () => {
    const file = faviconInput.files[0];
    if (!file) return;
    const path = `./imgs/${file.name}`;
    localStorage.setItem('faviconPath', path);
    faviconEl.href = path;
});
