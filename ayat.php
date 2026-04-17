<?php
    function is_arabic_2($str){
        return (bool) preg_match('/[أ-ي]/ui', $str);
    }

    function isErMatch($value) {
        $match = preg_match("/^\d{1,3}$/", trim($value));
        return $match ? (int) $value : null;
    }

    $DS = '/';
    $file1 = "";
    $file_name = "";
    $filemp3 = "";
    $files_OK = false;
    $ayat_OK = false;
    $filemp3_OK = false;
    $verse1 = "";
    $file_pattern = "/^\d{1,3}$/";
    $ayatNumber = 0;
    $prefix = "";
    $mp3fix = "";

    if (isset($_GET['file1'])) {
        $raw = $_GET['file1'];

        if (preg_match($file_pattern, $raw) && (int)$raw) {
            $num = (int)$raw;
            if ($num < 10)          $prefix = "00";
            elseif ($num < 100)     $prefix = "0";

            $file_name = (string)$num;
            $file1 = "NLEN" . $DS . $prefix . $file_name . "ENNL.txt";

            if (file_exists($file1)) {
                $files_OK = true;
            } else {
                die("Error: Files are not files<br />");
            }
        } else {
            die("Files do not match<br />");
        }
    }

    if (isset($_GET['ayat'])) {
        $ayatNumber = (int)$_GET['ayat'];
        if (preg_match($file_pattern, $ayatNumber)) {
            $ayat_OK = true;
        }
    }

    if ($ayatNumber < 10)       $mp3fix = "00";
    elseif ($ayatNumber < 100)  $mp3fix = "0";

    $filemp3 = "MP3" . $DS . $prefix . $file_name . $mp3fix . $ayatNumber . ".mp3";
    if (file_exists($filemp3)) {
        $filemp3_OK = true;
    }

    if ($files_OK && $ayat_OK) {
        $stop = false;
        $begin = false;
        $firstTime = true;

        $handle1 = fopen($file1, "r");
        if ($handle1) {
            while (($line = fgets($handle1)) !== false) {
                $maxTemp = isErMatch($line);

                if ($maxTemp === $ayatNumber)       { $begin = true; $stop = false; }
                if ($maxTemp === ($ayatNumber + 1)) { $stop = true; }

                if ($begin && !$stop) {
                    if (trim($line) === "") continue;

                    if ($maxTemp === $ayatNumber) {
                        $verse1 .= '<br />'
                            . '<a id="C' . $file_name . '-' . $ayatNumber . '" class="close"'
                            . ' onclick="closeMe(' . $file_name . ',' . $ayatNumber . ');">x</a><br />';

                        if (is_arabic_2($line) && $firstTime) {
                            $verse1 .= '<div id="Arbc-' . $file_name . '-' . $ayatNumber . '">' . $line . '</div>';
                            $firstTime = false;
                        }

                        if ($filemp3_OK) {
                            $verse1 .= '<audio controls>'
                                . '<source src="' . $filemp3 . '" type="audio/mpeg">'
                                . 'Your browser does not support the audio element.'
                                . '</audio><br />';
                        }

                        $verse1 .= '<a id="E' . $file_name . '-' . $ayatNumber . '"'
                            . ' onclick="onWordToWordInit(' . $file_name . ', ' . $ayatNumber . ');">Words</a>'
                            . '<div id="D' . $file_name . '-' . $ayatNumber . '" class="word2word"></div>'
                            . '<a id="G' . $file_name . '-' . $ayatNumber . '"'
                            . ' onclick="onGrammarInit(' . $file_name . ', ' . $ayatNumber . ');">Grammar</a>'
                            . '<div id="F' . $file_name . '-' . $ayatNumber . '" class="grammar"></div>'
                            . '<a id="Xstatistics' . $file_name . '-' . $ayatNumber . '"'
                            . ' onclick="statisticsInit(' . $file_name . ', ' . $ayatNumber . '); return false;">Statistics</a>'
                            . '<div id="X' . $file_name . '-' . $ayatNumber . '" class="grammar"></div>';
                    }

                    $verse1 .= $line;
                }
            }
            fclose($handle1);
        } else {
            die("File handle error");
        }

        echo ($verse1 === "") ? "no text" : $verse1;
    }
?>
