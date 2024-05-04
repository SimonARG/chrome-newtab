const bgEl = document.querySelector('.bg');
const searchbar = document.querySelector('.searchbar');
const bgInput = document.getElementById('bg-input');
const bgArrows = {
    left: document.querySelector('.bg-arr-left'),
    right: document.querySelector('.bg-arr-right')
};

let bgMode = localStorage.getItem("bgMode");
let currentBg = parseInt(localStorage.getItem('currentBg')) || 0;
let bgArr = JSON.parse(localStorage.getItem("bgArr")) || [];

// Function to update background image
function updateBackground() {
    currentBg = (currentBg + bgArr.length) % bgArr.length; // Ensure index stays within bounds
    bgEl.src = bgArr[currentBg];
    localStorage.setItem('currentBg', currentBg);
}

// Apply filters to background image on interaction with searchbar
searchbar.addEventListener('mouseenter', () => bgEl.classList.add('dark-effect'));
searchbar.addEventListener('focus', () => bgEl.classList.add('blur-dark-effect'));
searchbar.addEventListener('blur', () => bgEl.classList.remove('blur-dark-effect'));
searchbar.addEventListener('mouseleave', () => bgEl.classList.remove('dark-effect'));

// Event listener for the background input change event
bgInput.addEventListener('change', () => {
    const bgFiles = bgInput.files;
    const bgs = Array.from(bgFiles).map(file => `./imgs/${file.name}`);
    localStorage.setItem('bgArr', JSON.stringify(bgs));
    bgArr = bgs;
    currentBg = 0;
    updateBackground();
});

// Change background image index on click of arrow buttons
bgArrows.right.addEventListener('click', () => {
    currentBg++;
    updateBackground();
});

bgArrows.left.addEventListener('click', () => {
    currentBg--;
    updateBackground();
});

// Initial background image setup
updateBackground();