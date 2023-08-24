document.getElementById('showRandomImage').addEventListener('click', function() {
    fetch('get_random_image.php')
        .then(response => response.text())
        .then(imagePath => {
            document.getElementById('randomImage').src = imagePath;
        })
        .catch(error => console.error(error));
});
