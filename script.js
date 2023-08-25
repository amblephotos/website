let currentImageIndex = -1;
let isScrolling = false;
let isImageLoaded = false;
let scrollTimeout;

function showError(message, type) {
    const errorBox = document.getElementById('errorBox');
    errorBox.textContent = message;
    errorBox.classList.add(type);
    setTimeout(() => {
        errorBox.textContent = '';
        errorBox.classList.remove(type);
    }, 5000);
}

function toggleDarkLightMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');

    // Save the user's preference in a cookie
    const isDarkMode = body.classList.contains('dark-mode');
    Cookies.set('darkModePreference', isDarkMode);

    // Change the icon of the toggle button based on the current mode
    const modeIcon = document.querySelector('.dark-light-toggle i');
    modeIcon.textContent = isDarkMode ? 'dark_mode' : 'light_mode'; // Use clear_day icon for light mode
}

function getRandomImage() {
    if (isImageLoaded) {
        return;
    }
    
    isImageLoaded = true;

    const imageContainer = document.querySelector('.image-container');

    const loadingTimeout = setTimeout(() => {
        showError('Image taking longer than expected to load.', 'error');
    }, 5000);

    fetch('get_random_image.php')
        .then(response => response.json())
        .then(data => {
            clearTimeout(loadingTimeout);

            if (data.error) {
                showError(data.error, 'error');
            } else {
                const newImage = document.createElement('img');
                newImage.src = data.image;
                newImage.style.opacity = 0;

                newImage.onload = () => {
                    const currentImage = document.querySelector('.image-container img');

                    if (currentImage) {
                        currentImage.style.opacity = 0;
                        setTimeout(() => {
                            currentImage.remove();
                        }, 500);
                    }

                    newImage.style.opacity = 0;
                    imageContainer.appendChild(newImage);
                    
                    setTimeout(() => {
                        newImage.style.opacity = 1;
                        isImageLoaded = false;
                    }, 100);
                };
            }
        })
        .catch(error => {
            clearTimeout(loadingTimeout);
            showError('An error occurred while fetching the image.', 'error');
            console.error(error);
            isImageLoaded = false;
        });
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
} else {
    document.body.classList.add('light-mode'); // Default to light mode if not in dark mode
}

getRandomImage();

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
        getRandomImage();
    }
});

document.addEventListener('wheel', event => {
    if (!isScrolling) {
        isScrolling = true;
        getRandomImage();
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 100);
});
