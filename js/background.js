const bgEl = document.querySelector('.bg');
const searchbar = document.querySelector('.searchbar');
const bgInput = document.getElementById('bg-input');
const leftArrow = document.querySelector('.bg-arr-left');
const rightArrow = document.querySelector('.bg-arr-right');

let currentBg = parseInt(localStorage.getItem('currentBg')) || 0;
let bgArr = JSON.parse(localStorage.getItem('bgArr')) || [];

function updateBackground() {
    if (bgArr.length === 0) return;
    currentBg = ((currentBg % bgArr.length) + bgArr.length) % bgArr.length;
    bgEl.src = bgArr[currentBg];
    localStorage.setItem('currentBg', currentBg);
}

// Search bar interaction filters
searchbar.addEventListener('mouseenter', () => bgEl.classList.add('dark'));
searchbar.addEventListener('focus', () => bgEl.classList.add('blur-dark'));
searchbar.addEventListener('blur', () => bgEl.classList.remove('blur-dark'));
searchbar.addEventListener('mouseleave', () => bgEl.classList.remove('dark'));

// Background file selection
bgInput.addEventListener('change', () => {
    bgArr = Array.from(bgInput.files).map(file => `./imgs/${file.name}`);
    localStorage.setItem('bgArr', JSON.stringify(bgArr));
    currentBg = 0;
    updateBackground();
});

// Arrow cycling
rightArrow.addEventListener('click', () => { currentBg++; updateBackground(); });
leftArrow.addEventListener('click', () => { currentBg--; updateBackground(); });

updateBackground();

export function blurBackground() {
    bgEl.classList.add('blur');
}

export function unblurBackground() {
    bgEl.classList.remove('blur');
}
