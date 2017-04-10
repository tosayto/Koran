<?php
header( 'Content-Type: text/html; charset=utf-8' ); 
// echo '<meta http-equiv="Content-type" content="text/html; charset=UTF-8" />'; 
 mb_internal_encoding('UTF-8');
//echo "hi";

$add = false;
//$arr = [];
//$query2 = [];
//echo $query;
$query = $_GET['q'];
$queryLength = mb_strlen($query);
$temp = "";
$similar ="";
$mainArray =[];
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
    $newQuery = str_split_unicode($query,1);
    $firstLetter = $newQuery[0]; $secondLetter = $newQuery[2]; $thirdLetter = $newQuery[4]; $mainArray = array();
    $firstLetterArr = array(); $secondLetterArr = array(); $thirdLetterArr = array(); $mixLettersFirst = array(); $mixLettersSecond = array(); $mixLettersThird = array(); $spaceLetter = ' '; $t; $p; $r;
    $firstLetterArr = getSimilarityArray($firstLetter);
    $secondLetterArr = getSimilarityArray($secondLetter);
    $thirdLetterArr = getSimilarityArray($thirdLetter);
    $firstArrayLength = count($firstLetterArr); $secondArrayLength = count($secondLetterArr); $thirdArrayLength = count($thirdLetterArr); 
    
                if($firstLetterArr == null){
                   array_push($mixLettersFirst, $newQuery[0]);
                }else{ 
                   array_push($mixLettersFirst, $newQuery[0]);
                   for($k =0; $k < $firstArrayLength; $k++){
                       array_push($mixLettersFirst, $firstLetterArr[$k]);
                   }
                }
               if($secondLetterArr == null){
                   array_push($mixLettersSecond, $newQuery[2]);
               }else{ 
                   array_push($mixLettersSecond, $newQuery[2]);
                   for($l =0; $l < $secondArrayLength; $l++){
                       array_push($mixLettersSecond, $secondLetterArr[$l]);
                   }
               }
               if($thirdLetterArr == null){
                   array_push($mixLettersThird, $newQuery[4]);
               }else{ 
                   array_push($mixLettersThird, $newQuery[4]);
                   for($m =0; $m < $thirdLetterArr.length; $m++){
                      array_push($mixLettersThird, $thirdLetterArr[$m]);
                   }
               } 
               $mixArrayFirstLength = count($mixLettersFirst); $mixArraySecondLength = count($mixLettersSecond); $mixArrayThirdLength = count($mixLettersThird);
               for($t = 0; $t < $mixArrayFirstLength; $t++){
                   for($p = 0; $p < $mixArraySecondLength; $p++){
                       for($r=0; $r<$mixArrayThirdLength; $r++){
                           array_push($mainArray, $mixLettersFirst[$t]. $spaceLetter . $mixLettersSecond[$p] . $spaceLetter . $mixLettersThird[$r]);
                      }
                   }
              } 
              return $mainArray;
    
}
function getSimilarityArray($firstLetter){
                $bArr = null; $cArr = null; $dArr = null; $rArr = null; $sArr = null; $sadArr = null; $tArr = null; $aynArr = null;
                switch ($firstLetter) {
                                     case 'ب': case 'ت': case 'ث': if($firstLetter === 'ب'){ $bArr = array('ث', 'ث'); } if($firstLetter === 'ت'){ $bArr = array('ب','ث');  } if($firstLetter === 'ث'){ $bArr = array('ب','ت');  }
                                         return $bArr;
                                     case 'ج': case 'ح':  case 'خ': 
                                        if($firstLetter === 'ج'){ $cArr = array('ح', 'خ');} if($firstLetter === 'ح'){$cArr = array('ج','خ');  } if($firstLetter === 'خ'){ $cArr = array('ج', 'ح');}
                                          return $cArr;
                                     case 'د': case 'ذ': if($firstLetter === 'د'){ $dArr = array('ذ');}else { $dArr = array('د'); }
                                          return $dArr;
                                     case 'ر': case 'ز': if($firstLetter === 'ر'){$rArr = array('ز'); }else { $rArr = array('ر'); }
                                          return $rArr;
                                     case 'س': case 'ش': if($firstLetter === 'س'){ $sArr = array('ش');}else { $sArr = array('س'); }
                                          return $sArr;
                                    case 'ص': case 'ض': if($firstLetter === 'ص'){ $sadArr = array('ض');}else { $sadArr = array('ص'); }
                                          return $sadArr;
                                    case 'ط': case 'ظ': if($firstLetter === 'ط'){ $tArr = array('ظ'); }else { $tArr = array('ط'); }
                                          return $tArr;
                                    case 'ع': case 'غ': if($firstLetter === 'ع'){ $aynArr = array('غ'); }else { $aynArr = array('ع'); }
                                          return $aynArr;
                                    default: return null;
                                    } }
//$pattern = "";
$ok = false;
//$query = substr($query, 0, 30);
//function isErMatch($value) {
//                $pattern =  $query;
//                $match = mb_stripos($pattern, trim($value));
//                if ($match != false) {
//                    return true;
//                } else {
//                    return false;
//                }
//}
if(($queryLength > 0) && ($queryLength < 6)){
    
    if(file_exists("VerbTRV2.txt")){
       $row = 1;
        //echo "file exists";
         if (($handle = fopen("VerbTRV2.txt", "r")) !== false) {
            //echo "file is ready";
            while (($data = fgetcsv($handle, 1000, "|")) !== false) {
                $num = count($data);
                //echo "<p> $num fields in line $row: <br /></p>\n";
                
                $row++;
               
                if(($data[1] == $query )){
                       
                       $add = true;
                       //echo "found equal";
                 }
               
                if($add === true){
                    //$temp = $temp . "<br/>FORM: ". $data[4] ."||"."<a id='W".$data[0]. $row . "' data-word='".$data[0] ."' onclick='searchword(this.id); return false ;'>" .$data[0]."</a>" . "||". $data[1] . "||" ."<span id='oldLetters'>".$data[0] ."||".$data[1]."</span>"."<br/>EN: ". $data[6] ."<br/>NL: ". $data[7] ."<br/>TR: ". $data[8] . "<br/>COUNT: ". $data[5] ."<br/>";
                    $temp = $temp . "<br/>FORM: ". $data[4] ."||".$data[0]."||". $data[1] . "||" ."<span id='oldLetters'>".$data[0] ."||".$data[1]."</span>"."<br/>EN: ". $data[6] ."<br/>NL: ". $data[7] ."<br/>TR: ". $data[8] . "<br/>COUNT: ". $data[5] ."<br/>";
                    
                    //$temp = $temp . join($data) . " | ";
                    $add = false;
                }
                
            }
            fclose($handle);
//            if( strlen($temp) > 0){
//              //echo "Info : " . join("<br />", $arr);
//               // echo $temp;
//            }
//            else{
//                //echo "<br />no info";
//            }
        
        
        
    }
       if (($handle = fopen("VerbTRV2.txt", "r")) !== false) {
            //echo "file is ready";
            while (($data = fgetcsv($handle, 1000, "|")) !== false) {
                $num = count($data);
                //echo "<p> $num fields in line $row: <br /></p>\n";
                
                $row++;
                $mainArray = getArrayOfSimilar($query);
                $arrayLengt = count($mainArray);
                for($i=0; $i < $arrayLengt; $i++ ){
                    if(($data[1] == $mainArray[$i] )){
                        if($data[1] != $query){
                         
                            $add = true;
                           //echo "found equal"
                           //;
                        }
                     }

                    if($add === true){
                        //$temp = $temp . "<br/>FORM: ". $data[4] ."||"."<a id='W".$data[0]. $row . "' data-word='".$data[0] ."' onclick='searchword(this.id); return false ;'>" .$data[0]."</a>" . "||". $data[1] . "||" ."<span id='oldLetters'>".$data[0] ."||".$data[1]."</span>"."<br/>EN: ". $data[6] ."<br/>NL: ". $data[7] ."<br/>TR: ". $data[8] . "<br/>COUNT: ". $data[5] ."<br/>";
                        $similar = $similar . "<br/>FORM: ". $data[4] ."||".$data[0]."||". $data[1] . "||" ."<span id='simLetters'>".$data[0] ."||".$data[1]."</span>"."<br/>EN: ". $data[6] ."<br/>NL: ". $data[7] ."<br/>TR: ". $data[8] . "<br/>COUNT: ". $data[5] ."<br/>";

                        //$temp = $temp . join($data) . " | ";
                        $add = false;
                    }
                
                }
                
            }
            fclose($handle);
            if( strlen($temp) > 0){
              //echo "Info : " . join("<br />", $arr);
                echo $temp .'<br/>Similar:<br />' .$similar;
            }
            else{
                echo "<br />no info";
            }
        
        
        
    }

    }
    
}
?>