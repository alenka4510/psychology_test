<?php
    $dir = "./assets/image/tasksDog";
    $dh  = opendir($dir);
    while (false !== ($filename = readdir($dh))) {
      $files[] = $filename;
    }

     echo $files;

?>