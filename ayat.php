<?php
    //header('Content-Type: text/html');
    //ob_start();
    function uniord($u) {
        // i just copied this function fron the php.net comments, but it should work fine!
        $k = mb_convert_encoding($u, 'UCS-2LE', 'UTF-8');
        $k1 = ord(substr($k, 0, 1));
        $k2 = ord(substr($k, 1, 1));
        return $k2 * 256 + $k1;
    }
    function is_arabic($str) {
        if(mb_detect_encoding($str) !== 'UTF-8') {
            $str = mb_convert_encoding($str,mb_detect_encoding($str),'UTF-8');
        }

        /*
        $str = str_split($str); <- this function is not mb safe, it splits by bytes, not characters. we cannot use it
        $str = preg_split('//u',$str); <- this function woulrd probably work fine but there was a bug reported in some php version so it pslits by bytes and not chars as well
        */
        preg_match_all('/.|\n/u', $str, $matches);
        $chars = $matches[0];
        $arabic_count = 0;
        $latin_count = 0;
        $total_count = 0;
        foreach($chars as $char) {
            //$pos = ord($char); we cant use that, its not binary safe 
            $pos = uniord($char);
            echo $char ." --> ".$pos.PHP_EOL;

            if($pos >= 1536 && $pos <= 1791) {
                $arabic_count++;
            } else if($pos > 0 && $pos < 123) {
                $latin_count++;
            }
            $total_count++;
        }
        if(($arabic_count/$total_count) > 0.6) {
            // 60% arabic chars, its probably arabic
            return true;
        }
        return false;
    }
    function is_arabic_2($str){
        if (preg_match('/[أ-ي]/ui', $str)) {
            return true;
        } else {
            return false;
        }
    }
//$arabic = is_arabic('عربية إخبارية تعمل على مدار اليوم. يمكنك مشاهدة بث القناة من خلال الموقع'); 
//var_dump($arabic);
//
            $file1="";
            $file2="";
            $file_name="";
            $filemp3="";
            $files_OK = false;
            $ayat_OK = false;
            $filemp3_OK = false;
            $verse1 = "";
            $file_pattern = "/^\d{1,3}$/";
            $ayat ="";
            $ayatNumber = 0;
            $prefix ="";
            $mp3fix="";
            if (isset($_GET['file1'])) {

                $file1 = $_GET['file1'];
                $file2 = $file1;
        
               
                $DS = '\\';
                if (preg_match($file_pattern, $file1) && preg_match($file_pattern, $file2) && ($file1 === $file2) && ((int)$file1)) {
                  
                    $file1 = (int)$file1;
                    if($file1 < 10){
                       $prefix="00";
             
                    }
                    elseif($file1>=10 && $file1 < 100){
                        $prefix="0";
                    }
                    $file_name = (string)$file1;
                    //$file_name= $prefix + $file1;
                    $file1 = "NLEN" . $DS . $prefix .$file_name."ENNL.txt";
                    //$file2 = "NL" . $DS . $file2.".txt";
                    //echo $file1; 
                    if (file_exists($file1)) {
            
                            $files_OK = true;
                            //$file_3 = "NLEN".$DS.$file_name."ENNL.txt";
                            
            
                    } else {
                        die("Error: Files are not files<br />");
                    }
                } else {
                    die("Files dot match<br />");
                }
            }else {
                   // die("Error:There are no parameters<br />");
            }

            function isErMatch($value) {
                $pattern =  "/^\d{1,3}$/";
                $match = preg_match($pattern, trim($value));
                if ($match) {
                    return (int) $value;
                } else {
                    return null;
                }
            }
            if (isset($_GET['ayat'])) {
                $ayatNumber =(int)$_GET['ayat'];
    
                if (preg_match($file_pattern, $ayatNumber)) {
                    $ayat_OK = true;

                }
            }
            $mp3AyatNumber= $ayatNumber;
            if($mp3AyatNumber < 10){
              $mp3fix="00";
            }elseif($mp3AyatNumber>=10 && $mp3AyatNumber < 100){
              $mp3fix="0";
            }
            
            $filemp3= "MP3". $DS . $prefix . $file_name . $mp3fix . $ayatNumber.".mp3";
            if(file_exists($filemp3)){
                $filemp3_OK =true;
            }
            
            if($files_OK && $ayat_OK && $filemp3_OK){
                //echo "file and ayat OK";
                //echo $file1;
                $stop = false;
    
                $handle1 = fopen($file1, "r");

               
                if ($handle1) {
                    while (($line = fgets($handle1)) !== false) {
                        
                        $maxTemp = isErMatch($line);
                        if ($maxTemp === $ayatNumber) {
                            $begin = true ;
                            $stop = false;
                        }
                        if($maxTemp === ($ayatNumber+1)){
                            $stop = true;
                        }
                        if ($begin && !$stop){
                           //echo $line;
                           $firstTime = true;
                           if($maxTemp === $ayatNumber){
                               $verse1 .= '<br /><a id="C'. $file_name . '-' . $ayatNumber . '"' . ' class="close" onclick="closeMe(' . $file_name . ',' . $ayatNumber . ');" >x</a><br />';
                               if(is_arabic_2($line) && $firstTime){
                                   $verse1 .= '<div id="Arbc-'.$file_name.'-'.$ayatNumber .'">'.$line.'</div>';
                                   $firstTime = false;
                               }
                               $verse1 .= '<audio controls><source src="'.$filemp3.'"'.' type="audio/mpeg">Your browser does not support the audio element.</audio><br />' .'<a id="E'. $file_name.'-' . $ayatNumber. '" onclick="onWordToWordInit('.$file_name.', ' . $ayatNumber .');">Words</a>' .'<div id="D'. $file_name.'-' .$ayatNumber.'" '. 'class="word2word"></div>'.'<a id="G'. $file_name.'-' . $ayatNumber. '" onclick="onGrammarInit('.$file_name.', ' . $ayatNumber .');">Grammar</a>' .'<div id="F'. $file_name.'-' .$ayatNumber.'" '. 'class="grammar">'.'</div>'.'<a id="Xstatistics'. $file_name.'-' . $ayatNumber. '" onclick="statisticsInit('.$file_name .', ' . $ayatNumber .'); return false;">Statistics</a>' .'<div id="X'. $file_name.'-' .$ayatNumber.'" '. 'class="grammar"></div>';
                           }
                           if(trim($line) === ""){ 
                               continue;
                           } 
                           $verse1 .= $line ; 
                        }  
            
                    }
        
                    fclose($handle1);


                }else{
                    die("File handle error");
                }
                
                echo ($verse1 === "") ? "no text" : $verse1;
              
            }

?>
