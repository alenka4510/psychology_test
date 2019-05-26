<?php
    $dirDog = "assets/image/Dog";
    $dirCat = "assets/image/Cat";
    $dirAudioDog = "assets/audio/Dog";
    $dirAudioCat = "assets/audio/Cat";
    $dh  = opendir($dirCat);
    while (false !== ($filename = readdir($dh))) {
    if ($filename != "." && $filename != ".." && $filename != ".section.php") {
                $imagesCat[] = array("fileName" => "{$dirCat}/{$filename}", "type" => "cat");
            }
    }

    $dh  = opendir($dirDog);
    while (false !== ($filename = readdir($dh))) {
    if ($filename != "." && $filename != ".." && $filename != ".section.php") {
                $imagesDog[] = array("fileName" => "{$dirDog}/{$filename}", "type" => "dog");
            }
    }

    $dh  = opendir($dirAudioDog);
    while (false !== ($filename = readdir($dh))) {
    if ($filename != "." && $filename != ".." && $filename != ".section.php") {
                $audiosDog[] = array("fileName" => "{$dirAudioDog}/{$filename}", "type" => "dog");
            }
    }

    $dh  = opendir($dirAudioCat);
    while (false !== ($filename = readdir($dh))) {
    if ($filename != "." && $filename != ".." && $filename != ".section.php") {
                $audiosCat[] = array("fileName" => "{$dirAudioCat}/{$filename}", "type" => "cat");
            }
    }

    echo json_encode(array("result" => array(
                                           "tasks" => array_merge($imagesCat, $imagesDog,$audiosDog, $audiosCat),
                                           "images" => array_merge($imagesCat, $imagesDog),
                                           "audios" => array_merge($audiosDog, $audiosCat))));
?>