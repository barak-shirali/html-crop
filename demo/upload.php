<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

$upload_dir = __DIR__.'/upload/';
$img = $_POST['image'];
$type = $_POST['type'];
$ext = substr($type, '6'); // removing 'image/'
$img = str_replace("data:image/{$ext};base64,", '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);

if ($ext === 'jpeg') $ext = 'jpg';
$file = $upload_dir."image.{$ext}";
$success = file_put_contents($file, $data);

echo $file.' created!';
