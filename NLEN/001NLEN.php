<?php
$file1="";
$file2="";
$files_OK = FALSE;
$file_3="";
if (isset($_GET['file1'])) {
    $file1 = $_GET['file1'];
    $file2 = $file1;
    $file_pattern = "/^\d{1,3}$/";
    $file_name="";
    $DS = '/';
    if (preg_match($file_pattern, $file1) && preg_match($file_pattern, $file2) && ($file1 === $file2) && ((int)$file1)) {
        
        $file_name=$file1;
        $file1 = "EN" . $DS . $file1.".txt";
        $file2 = "NL" . $DS . $file2.".txt";
        if (is_file($file1) && is_file($file2)) {
            
                $files_OK = TRUE;
                $file_3 = "NLEN".$DS.$file_name."ENNL.txt";
            
            
        } else {
            die("Error: Files are not files<br />");
        }
    } else {
        die("Files don't match<br />");
    }
}else {
        die("Error:There are no parameters<br />");
    }

function isErMatch($value) {
    $pattern = "/^\d{1,3}$/";
    $match = preg_match($pattern, trim($value));
    if ($match) {
        return (int) $value;
    } else {
        return NULL;
    }
}

$verse1 = array();
$verse2 = array();
$line = "";
$line3 = "";
$i = 0;
$y = 0;
$z = 0;
$k = 0;
$counterx = 1;

$max1 = 0;
$max2 = 0;
$maxTemp = 0;

$tempVerse = array();

echo "We begin: <br />";

$handle1 = fopen($file1, "r");
$handle2 = fopen($file2, "r");
if ($handle1 && $handle2) {
    while (($line = fgets($handle1)) !== false) {

        $maxTemp = isErMatch($line);
        if ($maxTemp > $max1) {
            $max1 = $maxTemp;
        }

        $verse1[] = $line;
    }
    echo "Het eerste bestaand opgeload. <br />";
    fclose($handle1);
    $line = "";

    while (($line = fgets($handle2)) !== false) {
        $maxTemp = isErMatch($line);
        if ($maxTemp > $max2) {
            $max2 = $maxTemp;
        }
        $verse2[] = $line;
    }


    echo "Het tweede bestaand opgeload. <br />";
    fclose($handle2);
    if ($max1 !== $max2) {
        echo "Counters are not equal<br />";
        die();
    }
    $maxTemp = 1;

    for ($i = 0; $i < count($verse1); $i++) {
        if (isErMatch($verse1[$i]) === 1) {
            break;
        }
        $tempVerse[] = $verse1[$i];
    }
    for ($y = 0; $y < count($verse2); $y++) {
        if (isErMatch($verse2[$y]) === 1) {
            break;
        }
    }




    $z = $i;
    $k = $y;
//    for($m=1; $m <= $max1 ; $m++){
//        
//        $pattern = "/^\d{1,3}$/";
//        
//        for ($i = $z; $i < count($verse1); $i++) {
//           //  ( ((int)$verse1[$i] ) >= ($m-1)) && (((int)$verse1[$i]) < $m)
//            $match = preg_match($pattern, trim($verse1[$i]));
//            if(( ((int)$verse1[$i] ) >= ($m-1)) && (((int)$verse1[$i]) < $m)) {
//                if($match){ break 1;}
//                $tempVerse[] = $verse1[$i];
//             }
//              else {continue; }
//            // $z=$i;
//         }
//        
//        
//         for ($y = $k; $y < count($verse2); $y++) {
//            // ((int)$verse2[$y] ) >= ($m-1)) && (((int)$verse2[$y]) < $m)
//             
//            $match = preg_match($pattern, trim($verse2[$y]));
//            if((((int)$verse2[$y] ) >= ($m-1)) && (((int)$verse2[$y]) < $m)) {
//                if($match){ break 1;}
//                $tempVerse[] = $verse2[$y];
//             }
//             else {continue; }
//             //$k=$y;
//         }
//        
//    }
//    for ($i=$z; $i < count($verse1); $i++) {
//
//            if(((int)$verse1[$i]) < $countery){
//                $tempVerse[] = $verse1[$i];
//                continue;
//                
//            }          
//            for ($y=$k; $y < count($verse2); $y++) {
//                
//                if(((int)$verse2[$y]) === $counterx){
//                    break;           
//                }
//                
//                $tempVerse[] = $verse2[$y];
//                $k=$y;
//            }
//            
//            $countery = $counterx++;
//        
//            
//       
//    }
    $counterx = 1;

    $count_array1 = count($verse1);
    $count_array2 = count($verse2);
    for ($i = $z; $i < $count_array1; $i++) {



        if ((isErMatch($verse1[$i])) < $counterx) {
            $tempVerse[] = $verse1[$i];
            continue;
        }

        for ($y = $k; $y < $count_array2; $y++) {



            if ((isErMatch($verse2[$y])) > $counterx) {

                break;
            }

            $tempVerse[] = $verse2[$y];
            $k = $y;
        }

        $counterx += 1;
    }
    if($files_OK){
        file_put_contents($file_3, $tempVerse);
    }
} else {
    echo $php_errormsg;
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Test file</title>
    </head>
    <body>
<?php
if (count($tempVerse) > 0) {
    foreach ($tempVerse as $line3) {

        echo $line3 . "<br />";
    }
}
?>
    </body>
</html>
