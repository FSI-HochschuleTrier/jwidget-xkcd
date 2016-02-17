<?php
$url = $_GET["url"];
if (!preg_match("/http:\/\/xkcd.com/", $url))
	exit;

$out = file_get_contents($url);

$size = mb_strlen($out, '8bit');

header('Cache-Control: no-cache, must-revalidate');
//header('Expires: Tue, 14 Oct 2014 05:00:00 GMT');
header("Content-length: $size");
header('Content-type: application/json');


echo $out;