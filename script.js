let currentImageIndex = -1;
let isScrolling = false;
let isImageLoaded = false; // Flag to track image loading
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

function getRandomImage() {
    if (isImageLoaded) {
        return; // Prevent loading multiple images for a single scroll
    }
    
    isImageLoaded = true; // Set the flag to true

    const imageContainer = document.querySelector('.image-container');

    const loadingTimeout = setTimeout(() => {
        showError('Image taking longer than expected to load.', 'error');
    }, 5000); // 5 seconds timeout

    fetch('get_random_image.php')
        .then(response => response.json())
        .then(data => {
            clearTimeout(loadingTimeout); // Clear the timeout since the image loaded

            if (data.error) {
                showError(data.error, 'error');
            } else {
                const newImage = document.createElement('img');
                newImage.src = data.image;
                newImage.style.transform = 'translateY(100%)';

                newImage.onload = () => {
                    const currentImage = document.querySelector('.image-container img');

                    if (currentImage) {
                        currentImage.style.transform = 'scale(98%)'; // Reduce size by 2%
                    }

                    newImage.style.transform = 'translateY(0)';
                    isImageLoaded = false; // Reset the flag
                };

                imageContainer.innerHTML = ''; // Clear the container
                imageContainer.appendChild(newImage);
            }
        })
        .catch(error => {
            clearTimeout(loadingTimeout); // Clear the timeout in case of error
            showError('An error occurred while fetching the image.', 'error');
            console.error(error);
            isImageLoaded = false; // Reset the flag in case of error
        });
}

// Check if dark mode is preferred by the user
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}

// Initial image load
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
    }, 100); // Adjust the debounce time as needed
});
