<?php
$imagesDir = 'photos/';
$images = glob($imagesDir . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);

if (empty($images)) {
    echo json_encode(['error' => 'No images found']);
} else {
    $randomImage = $images[array_rand($images)];
    echo json_encode(['image' => $randomImage]);
}
?>
