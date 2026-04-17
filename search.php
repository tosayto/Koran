<?php
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding('UTF-8');

$add = false;
$query = $_GET['q'];
$queryLength = mb_strlen($query);
$temp = "";
$similar = "";

function str_split_unicode($str, $l = 0) {
    if ($l > 0) {
        $ret = array();
        $len = mb_strlen($str, "UTF-8");
        for ($i = 0; $i < $len; $i += $l) {
            $ret[] = mb_substr($str, $i, $l, "UTF-8");
        }
        return $ret;
    }
    return preg_split("//u", $str, -1, PREG_SPLIT_NO_EMPTY);
}

function getArrayOfSimilar($query){
    $newQuery = str_split_unicode($query, 1);
    $firstLetter = $newQuery[0]; $secondLetter = $newQuery[2]; $thirdLetter = $newQuery[4];
    $mainArray = array();
    $mixLettersFirst = array(); $mixLettersSecond = array(); $mixLettersThird = array();
    $spaceLetter = ' ';

    $firstLetterArr  = getSimilarityArray($firstLetter);
    $secondLetterArr = getSimilarityArray($secondLetter);
    $thirdLetterArr  = getSimilarityArray($thirdLetter);

    if ($firstLetterArr == null) {
        array_push($mixLettersFirst, $newQuery[0]);
    } else {
        array_push($mixLettersFirst, $newQuery[0]);
        for ($k = 0; $k < count($firstLetterArr); $k++) {
            array_push($mixLettersFirst, $firstLetterArr[$k]);
        }
    }
    if ($secondLetterArr == null) {
        array_push($mixLettersSecond, $newQuery[2]);
    } else {
        array_push($mixLettersSecond, $newQuery[2]);
        for ($l = 0; $l < count($secondLetterArr); $l++) {
            array_push($mixLettersSecond, $secondLetterArr[$l]);
        }
    }
    if ($thirdLetterArr == null) {
        array_push($mixLettersThird, $newQuery[4]);
    } else {
        array_push($mixLettersThird, $newQuery[4]);
        for ($m = 0; $m < count($thirdLetterArr); $m++) {
            array_push($mixLettersThird, $thirdLetterArr[$m]);
        }
    }

    for ($t = 0; $t < count($mixLettersFirst); $t++) {
        for ($p = 0; $p < count($mixLettersSecond); $p++) {
            for ($r = 0; $r < count($mixLettersThird); $r++) {
                array_push($mainArray, $mixLettersFirst[$t] . $spaceLetter . $mixLettersSecond[$p] . $spaceLetter . $mixLettersThird[$r]);
            }
        }
    }
    return $mainArray;
}

function getSimilarityArray($firstLetter){
    switch ($firstLetter) {
        case 'ب': case 'ت': case 'ث':
            if ($firstLetter === 'ب') return array('ت', 'ث');
            if ($firstLetter === 'ت') return array('ب', 'ث');
            if ($firstLetter === 'ث') return array('ب', 'ت');
        case 'ج': case 'ح': case 'خ':
            if ($firstLetter === 'ج') return array('ح', 'خ');
            if ($firstLetter === 'ح') return array('ج', 'خ');
            if ($firstLetter === 'خ') return array('ج', 'ح');
        case 'د': case 'ذ':
            return ($firstLetter === 'د') ? array('ذ') : array('د');
        case 'ر': case 'ز':
            return ($firstLetter === 'ر') ? array('ز') : array('ر');
        case 'س': case 'ش':
            return ($firstLetter === 'س') ? array('ش') : array('س');
        case 'ص': case 'ض':
            return ($firstLetter === 'ص') ? array('ض') : array('ص');
        case 'ط': case 'ظ':
            return ($firstLetter === 'ط') ? array('ظ') : array('ط');
        case 'ع': case 'غ':
            return ($firstLetter === 'ع') ? array('غ') : array('ع');
        default: return null;
    }
}

if (($queryLength > 0) && ($queryLength < 6)) {

    if (file_exists("VerbTRV2.txt")) {
        $row = 1;
        $mainArray = getArrayOfSimilar($query);
        $arrayLengt = count($mainArray);

        if (($handle = fopen("VerbTRV2.txt", "r")) !== false) {
            while (($data = fgetcsv($handle, 1000, "|")) !== false) {
                $row++;

                if ($data[1] == $query) {
                    $add = true;
                }
                if ($add === true) {
                    $temp = $temp . "<br/>FORM: " . $data[4] . "||" . $data[0] . "||" . $data[1] . "||" . "<span id='oldLetters'>" . $data[0] . "||" . $data[1] . "</span>" . "<br/>EN: " . $data[6] . "<br/>NL: " . $data[7] . "<br/>TR: " . $data[8] . "<br/>COUNT: " . $data[5] . "<br/>";
                    $add = false;
                }

                for ($i = 0; $i < $arrayLengt; $i++) {
                    if ($data[1] == $mainArray[$i] && $data[1] != $query) {
                        $add = true;
                    }
                    if ($add === true) {
                        $similar = $similar . "<br/>FORM: " . $data[4] . "||" . $data[0] . "||" . $data[1] . "||" . "<span id='simLetters'>" . $data[0] . "||" . $data[1] . "</span>" . "<br/>EN: " . $data[6] . "<br/>NL: " . $data[7] . "<br/>TR: " . $data[8] . "<br/>COUNT: " . $data[5] . "<br/>";
                        $add = false;
                    }
                }
            }
            fclose($handle);

            if (strlen($temp) > 0) {
                echo $temp . '<br/>Similar:<br />' . $similar;
            } else {
                echo "<br />no info";
            }
        }
    }
}
?>
