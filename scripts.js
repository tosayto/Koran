            
            function toggle(button) {
                var element = button;
                var value = element.value;
                var attr = element.dataset.toggle;

                element.dataset.toggle = value;
                element.value = attr;

                return element;
            }
            
            function showHide(elm) {
                var element = elm;
                var attr = element.style.display;
                if (attr == 'none') {
                    element.style.display = 'block';

                } else if (attr == 'block') {
                    element.style.display = 'none';
                }
                return element;
            }
            
            function nextSib(element) {
                console.log(element);
                console.log(element.nextElementSibling);
                return element.nextElementSibling;

            }
            
            ///////////////////////////////////////////////////////////
        

      

           function addEvent(el, evnt, func) {
               if (el.addEventListener) {
                   el.addEventListener(evnt, func, false);
               } else if (el.attachEvent) {
                   el.attachEvent('on' + evnt, func);
               }
           }
           
           function removeEventHandler(el, evnt, func) {

               if (el.removeEventListener) {    // all browsers except IE before version 9
                   el.removeEventListener(evnt, func, false);
               }
               else {
                   if (el.detachEvent) {        // IE before version 9
                       el.detachEvent('on' + evnt, func);
                   }
               }
           }
           
           function getTarget(e) {
               if (e.srcElement)
                   return e.srcElement;
               else
                   return e.target;
           }

           addEvent(window, "load", placeLinktoAyatNumbers);

           //var el = document.getElementById("InputSearch");
           //VKI_attach(el);
//           var foo = document.createElement('input');
//           var keyb;
//           foo.focus(function(){
//            keyb = document.getElementById("keyboadInputMaster");
//            keyb.style.display = "block";
//            keyb.style.right="10px";
//           });
//           var search = document.getElementById("search");
//           search.appendChild(foo);
//           VKI_attach(foo);
          
           // Pull the search string out of the URL
           var escape = function (input) { if (!input) return; return input.replace(/\</g, '&lt;').replace(/\>/g, '&gt;'); };
           var br = function (input) { if (!input) return; return '<span class="E GRMR">' + input.replace(/\n/g, '<br/>') + '</span>'; };
           function getSearchString() {
               // Return sanitized search string if it exists
               var rawSearchString = window.location.search.replace(/[a-zA-Z0-9\?\&\=\%\#]+s\=(\w+)(\&.*)?/, "$1");
               // Replace '+' with '|' for regex
               // Also replace '%20' if your cms/blog uses this instead (credit to erlando for adding this)
               return rawSearchString.replace(/\%20|\+/g, "\|");
           }

           function highlightTextNodes(element, regex, termid, search) {
               var tempinnerHTML = element.innerHTML;
               // Do regex replace
               // Inject span with class of highlighted termX for google style highlighting
               element.innerHTML = tempinnerHTML.replace(regex, '<span class="highlighted term' + termid + '">$1</span>');
               var result = (tempinnerHTML.match(regex) || []).length;
               tempinnerHTML = null;
               return result;

           }

           // Call this onload, I recommend using the function defined at: http://untruths.org/technology/javascript-windowonload/
           // addOnLoad(highlightOnLoad());
           
           function results() {
               var element = document.getElementById("content");
               var search = (document.getElementById("InputSearch")).value;
               search = search.trim();
               if (search.length > 0) {
                   search = "(" + search + ")";
                   var resultLabel = document.getElementById("search-label");
                   var regexp = new RegExp(search, "g");
                   var result = highlightTextNodes(element, regexp, 0, search);
                   resultLabel.innerHTML = result;
                   result = null;
               }

               return false;
           }
           function showAlfabetCounts(){
               var content = document.getElementById("content").innerHTML;
               var div1 = document.getElementById("letters");
               //var object = {};
               var chars = 'آ ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي';
                
               var charsArr = chars.split(' ');
               //mISSING CHARACTERS:       // أ إ ئ ء ة ؤ
                charsArr.push('ى');
                charsArr.push('أ');
                charsArr.push('إ');
                charsArr.push('ئ');
                charsArr.push('ء');
                charsArr.push('ؤ');
                charsArr.push('ة');
               var array1 = [];
               var i=0;
               var j=0;
               var totalLetters=0;
               //var item = {};
               
               for(i=0; i < charsArr.length; i++){
                   var item = {};
                   item.letter = charsArr[i];
                   item.count = 0;
                   array1.push(item);
               }
               i = 0;
               for(i=0; i < content.length; i++){
                  for(j=0; j < array1.length; j++){ 
                      var temp = array1[j];
                      if(content[i] === temp.letter){
                         temp.count = temp.count + 1;
                         array1[j] = temp;
                         totalLetters = totalLetters +1;
                      }
                    }
                }
               j = 0;
               var output="";
               output = "<ul style='width:75%;' dir='ltr'>";
               for(j=0; j < array1.length; j++){
                   output += "<li style='float:left;margin:10px;'><ul>";
                   var temp = {};
                   temp = array1[j];
                   //output += "<tr><td dir='rtl'>"
                   output += "<li>";
                   output += temp.letter;
                   output += "<li>";
                   output += temp.count;
                   output += "</ul>";
                   
               }
               
               output += "</ul>";
               output += "<p style='clear:both;margin:10px;'>TottalLetters:" + totalLetters+"</p>";
               div1.innerHTML = output;
           }
           
            function clearLetters(){
               var div1 = document.getElementById("letters");
               div1.innerHTML = "";
           }
                   
           function clear() {
               this.location.reload();
           }
           
           function placeLinktoAyatNumbers() {
               var element = document.getElementById("content");
               //var regexp = new RegExp("(\d{1,3})(|)(\d{1,3})(|)", "g");
               var tempInnerHTML = element.innerHTML;
               element.innerHTML = tempInnerHTML.replace(/(\d{1,3})(\|)(\d{1,3})(\|)/g, '<pre id="B$1' + '-' + '$3' + '"' + ' class="ayatN" ></pre><a id="A$1$2$3$4" class="ayatNum" onclick="getFile($1,$3);">$1$2$3$4</a>');
               //var search = "(" + ayatNumber + ")";
               tempInnerHTML = null;

           }
           
           function closeMe(s, a) {
               var element = document.getElementById("B" + s + "-" + a);
               element.innerHTML = "";

           }
           
           function getDivId(s, a) {
               var element = document.getElementById("B" + s + "-" + a);

               return element;
           }
           
           function getFile(suraNumber, ayatNumber) {
               var txt1 = '';
               var element = getDivId(suraNumber, ayatNumber);
               element.innerHTML = "";
               //element.setAttribute("class", "ayatN");
               //element.setAttribute("style", "display:block")


               var xmlhttp = new XMLHttpRequest();
               xmlhttp.onreadystatechange = function () {
                   if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                       txt1 = xmlhttp.responseText;
                       if (txt1 !== '') {

                           if (element) {
                               element.innerHTML += txt1;
                               // element.style.visibilty = "visible";
                               txt1 = null;
                           }
                       }

                   }

               };
               xmlhttp.open("GET", "ayat.php?file1=" + suraNumber + "&ayat=" + ayatNumber, true);
               xmlhttp.send();

           }


       


            /////////////////////////////////////////////
            function searchword(w){
                //var element = document.getElementById("content");
                var element2 = document.getElementById(w);
                var suralist = document.getElementById("sura-list");
                var search = element2.dataset.word;
                var pattern = new RegExp(/\r?\n/);
                var pattern2 = new RegExp(search, 'g');
                var arr =[];
                var arr2 = [];
                var counter = 0;
                var respond = {};
                var i = 0;
                search = search.trim();
                  if(search.length > 0){
                       //search = "(\\d{1,3})(\\|)(\\d{1,3})(\\|)(\\s\\S)*?(" + search + ")(\\s\\S)*?";
                       //var resultLabel = document.getElementById("search-label");
                       //var regexp = new RegExp(p, "g");
                      AjaxGet('quran-uthmani.txt', true, function(first){

                          arr = first.split(pattern);

                          for( i; i < arr.length; i++){
                              var match = arr[i].match(pattern2);
                              if (match != null) {
                                  counter = counter + match.length;
                                  var sura = arr[i].replace(/(\d{1,3})(\|)(\d{1,3})(\|)(.*)/g, '<a id="J$1-$3" onclick="lookWithRootSearch($1-$3)" ); return false;>$1-$3</a><div id="I$1-$3"></div>');
                                  arr2.push(sura);
                             }
                          }
                          respond.ARRAYWORDS = arr2;
                          respond.COUNT = counter;
                          arr = null;
                          arr2 = null;
                          suralist.innerHTML = respond.ARRAYWORDS + "<br/>"+respond.COUNT+"<br />";
                          respond = null;
                      });
                      
                       //var result = highlightTextNodes(element, regexp, 0, search);
                       //resultLabel.innerHTML = result;
                   }

               //return false;
            }
            
            function AjaxGet(url, bool, fn) {
                if (window.XMLHttpRequest) { // Mozilla, Safari, ...
                    xmlhttp = new XMLHttpRequest();
                } else if (window.ActiveXObject) { // IE
                    try {
                        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
                    }
                    catch (e) {
                        try {
                            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                        }
                        catch (e) { }
                    }
                }

                if (!xmlhttp) {
                    //alert('Giving up :( Cannot create an XMLHTTP instance');
                    return false;
                }

                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                        //if (xmlhttp.responseText != '') {

                            fn(xmlhttp.responseText);
                            //return true;
                       // }
                        
                    }

                };
                xmlhttp.open('GET', url, bool);
                xmlhttp.send(); ;
            }
            
            var n_GRAMMAR_MAX_WORDS_INFO = 250;
            var qGrammar = null;
            var qGrammarArr = null;
            var oGrammar;
            var qKoran = null;
            //var element;
            var _charsArr, _buckArr, bInitialized = false;
            var initializeMapper = function () {
                if (bInitialized) return;
                var qBare = null, qBuck = null;
                var stopletters = "ۚۖۛۗۙ";
                var chars = 'آ ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي';
                var buck = 'A A b t v j H x d * r z s $ S D T Z E g f q k l m n h w y';
                var buckArr, charsArr;
                var ext = new Array();
                var map = {};
                charsArr = chars.split(' ');
                buckArr = buck.split(' ');
                //mISSING CHARACTERS:       // أ إ ئ ء ة ؤ
                charsArr.push('ى'); buckArr.push('Y');
                charsArr.push('أ'); buckArr.push('>');
                charsArr.push('إ'); buckArr.push('<');  //charsArr.push( ' ' ); buckArr.push( ' ' ); //charsArr.push( '' ); buckArr.push( '' );
                charsArr.push('ئ'); buckArr.push('}');
                charsArr.push('ء'); buckArr.push('X'); //buckArr.push( '\'' );
                //charsArr.push( 'ة' ); buckArr.push( 'P' );
                charsArr.push('ؤ'); buckArr.push('&');
                //missing characters for harakath.
                charsArr.push('\u0652'); buckArr.push('o');
                charsArr.push('\u064e'); buckArr.push('a');
                charsArr.push('\u0650'); buckArr.push('i');
                charsArr.push('\u064f'); buckArr.push('u');
                charsArr.push('\u064b'); buckArr.push('F');
                charsArr.push('\u064d'); buckArr.push('K');
                charsArr.push('\u064c'); buckArr.push('N');
                charsArr.push('\u0626'); buckArr.push('}');
                charsArr.push('\u0640'); buckArr.push('_');
                charsArr.push('\u0651'); buckArr.push('~');
                charsArr.push('\u0653'); buckArr.push('^');
                charsArr.push('\u0654'); buckArr.push('#');
                charsArr.push('\u0671'); buckArr.push('{');
                charsArr.push('\u0670'); buckArr.push('`');
                charsArr.push('\u06e5'); buckArr.push(',');
                charsArr.push('\u06e6'); buckArr.push('.');
                charsArr.push('ة'); buckArr.push('p');
                charsArr.push('\u06df'); buckArr.push('@');
                charsArr.push('\u06e2'); buckArr.push('[');
                charsArr.push('\u06ed'); buckArr.push(']');
                charsArr.push('\u0621'); buckArr.push('\'');
                charsArr.push('\u06DC'); buckArr.push(':');
                charsArr.push('\u06E0'); buckArr.push('\"');
                charsArr.push(' '); buckArr.push(' ');
                charsArr.push(';'); buckArr.push(';');
                charsArr.push('\n'); buckArr.push('\n');

                charsArr.push('ع'); buckArr.push('3'); //ayn //support for arabi/chat letters
                charsArr.push('ء'); buckArr.push('2'); //hamza
                charsArr.push('ح'); buckArr.push('7'); //HAA
                charsArr.push('خ'); buckArr.push('5'); //KHAA
                charsArr.push('ص'); buckArr.push('9'); //Saad
                charsArr.push('ط'); buckArr.push('6'); //Thaw
                charsArr.push(charsArr[2]); buckArr.push('B'); //Support for Capital letters
                charsArr.push(charsArr[4]); buckArr.push('V');
                charsArr.push(charsArr[5]); buckArr.push('J');
                charsArr.push(charsArr[10]); buckArr.push('R');
                charsArr.push(charsArr[19]); buckArr.push('G');
                charsArr.push(charsArr[21]); buckArr.push('Q');
                charsArr.push(charsArr[23]); buckArr.push('L');
                charsArr.push(charsArr[24]); buckArr.push('M');
                charsArr.push(charsArr[27]); buckArr.push('W');
                charsArr.push('ة'); buckArr.push('P');

                //For IndoPak script extra letters
                charsArr.push('ی'); buckArr.push('y');
                charsArr.push('ۃ'); buckArr.push('p');
                charsArr.push('ہ'); buckArr.push('h');
                charsArr.push('ی'); buckArr.push('Y');
                charsArr.push('ک'); buckArr.push('k');
                charsArr.push('ۤ '); buckArr.push('?');
                charsArr.push('ۤۚ '); buckArr.push('?');
                charsArr.push('ۡ '); buckArr.push('?');
                charsArr.push('ۚ '); buckArr.push('?');
                charsArr.push('ۤ '); buckArr.push('?');
                _charsArr = charsArr; _buckArr = buckArr;
                bInitialized = true;
            };
          

            var fnMapWordToRoots = function (word) {
                var ROOTS = '', ch = '&zwnj;'; //'\200C'; //&#8204; '&zwnj;';  \200E &lrm;
                if (!word) return ROOTS;
                ROOTS = word.trim().split('').join(ch);
                return ROOTS;
            };
            function mapRefToRef(ref, SEP) { //just ensure its full-form. not just the sura name.
                if (typeof (SEP) == null || !SEP) SEP = ':';
                if (!parseInt(ref)) { return null; }
                if (ref.indexOf(',') != -1 && SEP != ',') return ref.replace(/\,/g, SEP);
                else
                    if (ref.indexOf('.') != -1 && SEP != '.') return ref.replace(/\./g, SEP);
                    else
                        if (ref.indexOf(SEP) == -1) return ref + SEP + '1';
                return ref;
            }
            var EnToAr = function (word) {
                if (!word) return null;
                initializeMapper();
                var ar = '', l, letter, found = false;
                try {
                    var wordArr = word.split(''); //split into letters. //lookup from english to arabic letter. and return it.
                    for (l = 0; l < wordArr.length; ++l) {
                        letter = wordArr[l]; found = false;
                        for (n = 1; n < _buckArr.length; ++n) {
                            if (letter == _buckArr[n]) {
                                ar += _charsArr[n]; found = true;
                                break;
                            }
                        }
                        if (!found) ar += ''; //letter; //' ??'+letter+'?? ';
                    }
                } catch(ex) {
                    //debugger;
                    ar = '-err: ' + ex + ex.message + ex.lineno;
                }
                return ar;
            };
            var ArToEn = function(word){
                if(!word) return null;
                initializeMapper();
                var ar = '', l, letter, found=false;
                try{
                        var wordArr = word.split(''); //split into letters.	//lookup from english to arabic letter. and return it.
                        for(l=0; l<wordArr.length; ++l){
                                letter = wordArr[l]; found = false;
                                for(n=1; n<_charsArr.length; ++n){
                                        if(letter == _charsArr[n]){
                                                ar += _buckArr[n]; found=true;
                                                break;
                                        }
                                }
                                if(!found){  
                                    ar += ''; 
                                    //if(_bMAPPER_DEBUG){ 
                                    //    if(typeof(UNKNOWNS) == NULL) UNKNOWNS={}; 
                                    //    else{
                                    //            if(!UNKNOWNS[letter]){ UNKNOWNS[letter] = 1; _log('No mapping found:\t' + letter + '');  }
                                    //            else UNKNOWNS[letter] = 1+UNKNOWNS[letter];
                                    //        }								
                                    //    }
                                }
                        }
                }catch(ex){
                        //debugger;
                        ar = '-err: ' + ex + ex.message + ex.lineno;
                }
                return ar;
            }
            
            function getSimilarityArray(firstLetter){
                var bArr = null;
                var cArr = null;
                var dArr = null;
                var rArr = null;
                var sArr = null;
                var sadArr = null;
                var tArr = null;
                var aynArr = null;
                
                switch (firstLetter) {
                                     case 'ب':
                                     case 'ت':
                                     case 'ث':
                                         if(firstLetter === 'ب'){
                                           bArr = ['ث', 'ث'];   
                                         }
                                         if(firstLetter === 'ت'){
                                             bArr = ['ب','ث'];
                                         }
                                         if(firstLetter === 'ث'){
                                             bArr = ['ب','ت'];
                                         }
                                         return bArr;
                                         //break;
                                     case 'ج':
                                     case 'ح':
                                     case 'خ':
                                          if(firstLetter === 'ج'){
                                              cArr = ['ح', 'خ'];
                                          }
                                          if(firstLetter === 'ح'){
                                              cArr = ['ج','خ'];
                                          }
                                          if(firstLetter === 'خ'){
                                              cArr = ['ج', 'ح'];
                                          }
                                          return cArr;
                                          //break;
                                      case 'د':
                                      case 'ذ':
                                          if(firstLetter === 'د'){
                                              dArr = ['ذ'];
                                          }else {
                                              dArr = ['د'];
                                          }
                                          return dArr;
                                         //break;
                                     case 'ر':
                                     case 'ز':
                                          if(firstLetter === 'ر'){
                                              rArr = ['ز'];
                                          }else {
                                              rArr = ['ر'];
                                          }
                                          return rArr;
                                         //break; 
                                     case 'س':
                                     case 'ش':
                                          if(firstLetter === 'س'){
                                              sArr = ['ش'];
                                          }else {
                                              sArr = ['س'];
                                          }
                                          return sArr;
                                         //break;
                                     case 'ص':
                                     case 'ض':
                                          if(firstLetter === 'ص'){
                                              sadArr = ['ض'];
                                          }else {
                                              sadArr = ['ص'];
                                          }
                                          return sadArr;
                                         //break; 
                                    case 'ط':
                                    case 'ظ':
                                          if(firstLetter === 'ط'){
                                              tArr = ['ظ'];
                                          }else {
                                              tArr = ['ط'];
                                          }
                                          return tArr;
                                         //break;
                                    case 'ع':
                                    case 'غ':
                                          if(firstLetter === 'ع'){
                                              aynArr = ['غ'];
                                          }else {
                                              aynArr = ['ع'];
                                          }
                                          return aynArr;
                                         //break;
                                     default:
                                         return null;
                                         //break;
                                 }
                 
            }
            function getRootVerbDetails(id){
                var element = document.getElementById(id);
                var outElement = null;
                //var letters = 'ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ';
                var s, v, n, q;
                //var x, y, z, j, k, t, p, r;
                if(element != null){
                   
                    var str = element.dataset.ask;
                    var arr = str.split(', ');
                    s = arr[0]; v = arr[1]; n = arr[2]; q = arr[3];
                    outElement = document.getElementById('H-' + s + '-' + v );
                    if(outElement != null){
                        if(s != null && v != null && q != null && (q !== "no")){ 
                            
                             var q1 =  q.trim().split('').join(' ');
                             outElement.innerHTML = " ";
                             
                            AjaxGet("search.php?q=" + q1, true, 
                            function (data1){ 
                                outElement.innerHTML += data1;
                            });
                           
                             
                        }
                    }
                }
            }
     

       

      
                             
                            
                        
           
            var processGrammarLine = function (surano, versno) {
                //REF = mapRefToRef(REF); //i.e. if its sura 6, make it 6:1

                var REF = surano + ":" + versno;
                if (!REF) return; var RESP = '', results = {}, ROOT = '';
                var pattern4 = new RegExp("(?:ROOT\:)([^\|\n]*)");
                var pattern3 = new RegExp("[ ]ADJ|PRON|PN|V|N|P[ ]"); ; //("[ ][ADJ|CONJ|DEM|DET|EXP|INTG|LOC|NEG|PRON|PN|REL|REM|RES|V|N|P][ ]");
                var pattern2 = new RegExp("(NOM|GEN|ACC)$", "mg"); //pluck out raff/jarr/nasb info
                var arr, arr2, arr3;

                if (versno == 1 && surano != 9 && surano !== 1) {

                    for (y = 1; y <= 4; y++) {

                        ref = "1:1" + ':' + y;
                        pattern = new RegExp("\\(" + ref + ":.*\\).*(?:\r?\n)", "mg"); //Get all the grammar info for ONE word, at a time.
                        arr = qGrammar.match(pattern); //, arr2, arr3;
                        if (!arr) break;
                        var grammar = arr.join('');
                        arr = grammar.match(pattern2);
                        arr2 = grammar.match(pattern3);
                        arr3 = grammar.match(pattern4);

                        if (!arr && !arr2 && !arr3) {
                            RESP += '; '; ROOT += '; ';
                        }
                        else {
                            if (arr) {
                                RESP += arr.join(' ');
                            }
                            if (arr2) {
                                RESP += ' ' + arr2.join(' ');
                            }
                            RESP += '; ';
                            if (arr3) {
                                ROOT += arr3[1] /*.join(' ')*/;
                            }
                            ROOT += '; ';
                        }
                    }

                    for (i = 1; i < n_GRAMMAR_MAX_WORDS_INFO; ++i) {
                        ref = REF + ':' + i;
                        if (i == n_GRAMMAR_MAX_WORDS_INFO - 1) debugger;
                        pattern = new RegExp("\\(" + ref + ":.*\\).*(?:\r?\n)", "mg"); //Get all the grammar info for ONE word, at a time.
                        arr = qGrammar.match(pattern); //, arr2, arr3;
                        if (!arr) break;
                        var grammar = arr.join('');
                        arr = grammar.match(pattern2);
                        arr2 = grammar.match(pattern3);
                        arr3 = grammar.match(pattern4);

                        if (!arr && !arr2 && !arr3) {
                            RESP += '; '; ROOT += '; ';
                        }
                        else {
                            if (arr) {
                                RESP += arr.join(' ');
                            }
                            if (arr2) {
                                RESP += ' ' + arr2.join(' ');
                            }
                            RESP += '; ';
                            if (arr3) {
                                ROOT += arr3[1] /*.join(' ')*/;
                            }
                            ROOT += '; ';
                        }

                    }
                } else {

                    for (i = 1; i < n_GRAMMAR_MAX_WORDS_INFO; ++i) {


                        // var arr, arr2, arr3;
                        if (i == n_GRAMMAR_MAX_WORDS_INFO - 1) debugger;

                        // else{
                        ref = REF + ':' + i;
                        pattern = new RegExp("\\(" + ref + ":.*\\).*(?:\r?\n)", "mg"); //Get all the grammar info for ONE word, at a time.
                        arr = qGrammar.match(pattern); //, arr2, arr3;
                        if (!arr) break;
                        var grammar = arr.join('');
                        arr = grammar.match(pattern2);
                        arr2 = grammar.match(pattern3);
                        arr3 = grammar.match(pattern4);

                        if (!arr && !arr2 && !arr3) { RESP += '; '; ROOT += '; '; }
                        else {
                            if (arr) {
                                RESP += arr.join(' ');
                            }
                            if (arr2) {
                                RESP += ' ' + arr2.join(' ');
                            }
                            RESP += '; ';
                            if (arr3) {
                                ROOT += arr3[1] /*.join(' ')*/;
                            }
                            ROOT += '; ';
                        }


                        //}

                    }
                }
                RESP += '';
                results['RESP'] = RESP; results['ROOT'] = ROOT;
                RESP = null;
                ROOT = null;
                return results;
            };
            var processGrammar = function (surano, versno, output) {
                var element;
                if(output != null){
                    element = document.getElementById("message");
                }
                element = (element == null) ? document.getElementById("F" + surano + "-" + versno):null;
                var surano1 = surano;
                var versno1 = versno;
                var grammar, koran, pattern, pattern2;
                var arr = [];
                var arr2 = []; //in format 2:255
                var arr3 = [];
                var counter = 0;
                var i = 0;
                var pattern = new RegExp("\\(" + surano + ':' + versno + ":.*\\).*(?:\r?\n)", "mg");
                var pattern2 = new RegExp(/\r?\n/);
                var pattern3 = new RegExp("^" + surano1 + "\\|" + versno1 + "\\|" + '([\\S\\s]*?)(?:\\r?\\n)$', "g");

                if (!qGrammar || !qKoran) {

                    onGrammarInit();

                }


                if (qGrammar != null && qKoran != null) {
                    try { // /\(1|6|.*\).*/g;


                        arr3 = qKoran.split(pattern2);

                        for (i; i < arr3.length; i++) {
                            var match = arr3[i].indexOf(surano1 + '|' + versno1 + '|', 0);
                            if (match != -1) {
                                arr2[arr2.length] = arr3[i];
                                counter++
                                break;
                            }
                        }

                        if (arr2) {
                            koran = arr2.length + ' parts\n' + arr2.join(' ');
                            //element.innerHTML += koran; koran = null; delete koran;
                        } else {
                            koran = '-no matches found in Koran for ref ' + surano + ':' + versno + ' -';
                            element.innerHTML += koran; koran = null; delete koran;
                            return;
                        }
                    } catch (err) { element.innerHTML += err; return; }

                    try { // /\(1:6.*\).*/g;
                        arr = qGrammar.match(pattern);
                        if (arr) {
                            grammar = arr.length + ' parts\n' + arr.join('');
                            //element.innerHTML += grammar; grammar = null; delete grammar;
                        } else {
                            grammar = '-no matches found in grammar for ref ' + surano + ':' + versno + ' -';

                            element.innerHTML += grammar; grammar = null; delete grammar;
                            return;
                        }
                    } catch (err) { element.innerHTML += err; return; }


                    if (grammar !== null && koran !== null) {
                        try {

                            var mynumber = arr2[0].lastIndexOf('|');
                            var mystring = arr2[0].substring(mynumber + 1);
                            var arrline = mystring;


                            var text = '<div class="A">', decoded = processGrammarLine(surano, versno); //this is semicolon separated data
                            var arrlineArray = arrline.split(' ');
                            var grammarArray = decoded.RESP.split(';');
                                grammarArray.splice(grammarArray.length-1, 1);
                            var rootArray = EnToAr(decoded.ROOT).split(';');
                                rootArray.splice(rootArray.length-1,1);
                            var rootToAsk;
                            var rootToNo;

                            for (var n = 0; n < arrlineArray.length; n++) {
                                rootToAsk = rootArray[n];
                                rootToNo = n;
                                rootToAsk = rootToAsk.trim();
                                if (rootToAsk == "" || rootToAsk == 'undefined') {
                                    rootToAsk = "no";
                                    //rootToNo = n;
                                }
                                //text += "<a onclick='"  + "getRootVerbDetails(" + surano + ", " + versno + ", " + rootToNo + ", " + rootToAsk + " );' ><span class='" + grammarArray[n] + "' title='" + fnMapWordToRoots(rootArray[n]) + "' >" + arrlineArray[n] + "</span></a>";
                                text += "<a id='I-" + surano + "-" + versno + "-" + rootToNo + "' data-ask='" + surano + ", " + versno + ", " + n + ", " + rootToAsk + "' onclick='" + "getRootVerbDetails(this.id);' ><span class='" + grammarArray[n] + "' title='" + fnMapWordToRoots(rootArray[n]) + "' >" + arrlineArray[n] + "</span></a> ";

                            }
                            text += '</div>';
                            text += '<br /><span id="H-' + surano + '-' + versno + '" class="v"></span><br />';
                            element.innerHTML = text + '<div id="sura-list"></div><div dir="ltr">' + decoded.RESP + '<br /><span class="E">' + (decoded.ROOT) + '</span><br />' + '<a href="javascript:void 0;" onclick="showHide(nextSib(this));">Details</a>&nbsp;&nbsp;<span style="display: none;" class="grmr">' + br(escape(grammar)) + '</span></div>';
                            rootArray = null;
                            arrlineArray = null;
                            koran = null;
                            grammar = null;
                            text = null;
                            decoded = null;
                            qGrammar = null;
                            qKoran = null;


                        } catch (err) { 
                            alert("Error in Matching...."); 
                        }

                    }
                }
            };
            
            
            
            

            var onGrammarInit = function (surano, versno, output) {
                var url = 'quranic-corpus-morphology-0.4.txt', url2 = 'quran-uthmaniwitoutoptions.txt';

                AjaxGet(url, true, function (first) {

                    AjaxGet(url2, true, function (second) {

                        qGrammar = first;
                        qKoran = second;
                        processGrammar(surano, versno, output);
                    });

                });
            };
       ///////////////////////////////////////////////////
       
            var WORD2WORD_PATTERN_START = '<table width="100%" cellspacing="0" cellpadding="0" border="0" class="aya-W last"><tbody><tr>';
            var WORD2WORD_PATTERN_TD = '<td width="$3" align="$9" class="ww"><div onclick="pl($4)" style="width:$2px"><span class="a">$0</span><span class="e">$1</span></div></td>';
            var WORD2WORD_PATTERN_END = '</tr></tbody></table>';
            var oWord2Word;
            var response = "";
            //var onWordToWordInit = function (surano, versno) {
            //    var key = "W2W_" + surano, url = 'js/ayas-s' + surano + 'd15q1.js', dataType = 'json', dontcache = true;
            //    var success = function (data, textStatus, jqXHR) {
            //        response = processWordToWord(surano, versno, data); //$('#placeholder').data(''+surano, data);
            //         if (response.length > 0) {
            //         $("#D"+surano+"-"+versno).html(response);
            //        }
            //    },
            //            error = function (jqXHR, textStatus, errorThrown) {
            //                var status = textStatus + ' - ' + jqXHR.status + ' - ' + jqXHR.statusText + ' -- ' + errorThrown;
            //                if (jqXHR.status == 404) status = 'Data not available offline. Sorry. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Details: ' + status;
            //                status = '<span class="normal">' + status + '</span>';
            //                
            //            };
            //    $.ajax({ url: url, dataType: dataType, success: success, error: error });

            // }
            var onWordToWordInit = function (surano, versno) {

                var urlfile = 'js/ayas-s' + surano + 'd15q1.js';
                var element = document.getElementById("D" + surano + "-" + versno);
                // var xmlhttp = new XMLHttpRequest();
                var response = '';
                var txt1 = '';
                var txt2 = '';
                if (versno == 1 && surano != 9 && surano != 1) {
                    AjaxGet("js/ayas-s1d15q1.js", true, function (first) {
                        AjaxGet(urlfile, true, function (second) {
                            txt1 = JSON.parse(first);
                            response = processWordToWord(1, 1, txt1);
                            txt2 = JSON.parse(second);
                            response += processWordToWord(surano, versno, txt2)
                            if (response.length > 0) {
                                element.innerHTML = response;
                                txt1 = null;
                                txt2 = null;
                                response = null;
                            }
                        });

                    });

                }
                else {

                    AjaxGet(urlfile, true, function (data) {
                        txt1 = JSON.parse(data);
                        if (txt1 !== '') {
                            if (element) {
                                response = processWordToWord(surano, versno, txt1);
                                if (response.length > 0) {
                                    element.innerHTML = response;
                                    response = null;
                                    txt1 = null;
                                }
                            }
                        }

                    });

                }

            };

            var processWordToWord = function (Zsurano, Zversno, _DATA) {
                var surano = Zsurano;
                var versno = Zversno;
                var response = ''; //, response2 = '', bW=true, bT = true;

                if (!_DATA) {
                    onWordToWordInit(surano, versno); return;
                } //i.e. if !DATA        
                try {
                    var PLAIN = true;
                    for (i = 0; i < _DATA.length; ++i) {
                        if (versno != (i + 1)) continue;
                        for (k = 0; k < _DATA[i]["w"].length; ++k) {
                            var line = WORD2WORD_PATTERN_START, line2 = '';
                            for (j = 0; j < _DATA[i]["w"][k].length; ++j) {
                                var d0, d1, d2, d3, d4; d0 = _DATA[i]["w"][k][j][0]; d1 = _DATA[i]["w"][k][j][1]; d2 = _DATA[i]["w"][k][j][2];
                                d3 = _DATA[i]["w"][k][j][3]; d4 = _DATA[i]["w"][k][j][4];
                                line += WORD2WORD_PATTERN_TD.replace(/\$0/, d0).replace(/\$1/, d1).replace(/\$2/, d2).replace(/\$3/, d3).replace(/\$4/, d4).replace(/\$9/, j != 0 ? 'center' : 'right');
                                var width1, width2; width1 = _DATA[i]["w"][k][j][2]; width2 = _DATA[i]["w"][k][j][3];
                                line2 += ('<span class=wordpair style="width: ' + width2 + ';"><span class="a2 bigger">' + _DATA[i]["w"][k][j][0] + '</span><span class=e2>&lrm;' + _DATA[i]["w"][k][j][1]) + '&lrm;</span></span>';
                            } line += WORD2WORD_PATTERN_END;
                            response += (PLAIN ? line2 : line) + '<br/>\n';
                        }

                        break;
                    }
                } catch (err) {
                    alert('Error in word2word processing');
                }

                return response;
            };
            // onWordToWordInit(112, 3);
            var qKoran1;
            function processLetters(text){
                 try {
                            var content = text;
                            //var div1 = document.getElementById("letters");
                            //var object = {};
                            var chars = 'آ ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي';

                            var charsArr = chars.split(' ');
                            //mISSING CHARACTERS:       // أ إ ئ ء ة ؤ
                             charsArr.push('ى');
                             charsArr.push('أ');
                             charsArr.push('إ');
                             charsArr.push('ئ');
                             charsArr.push('ء');
                             charsArr.push('ؤ');
                             charsArr.push('ة');
                            var array1 = [];
                            var i=0;
                            var j=0;
                            var totalLetters = 0;
                            //var item = {};

                            for(i=0; i < charsArr.length; i++){
                                var item = {};
                                item.letter = charsArr[i];
                                item.count = 0;
                                array1.push(item);
                            }
                            i = 0;
                            for(i=0; i < content.length; i++){
                               for(j=0; j < array1.length; j++){ 
                                   var temp = array1[j];
                                   if(content[i] === temp.letter){
                                      temp.count = temp.count + 1;
                                      array1[j] = temp;
                                      totalLetters = totalLetters + 1;
                                   }
                                 }
                             }
                            j = 0;
                            var output="";
                            output = "<ul style='width:75%;' dir='ltr'>";
                            for(j=0; j < array1.length; j++){
                                output += "<li style='float:left;margin:19px;'><ul>";
                                var temp = {};
                                temp = array1[j];
                                //output += "<tr><td dir='rtl'>"
                                output += "<li>";
                                output += temp.letter;
                                output += "<li>";
                                output += temp.count;
                                output += "</ul>";

                            }

                            output += "</ul>";
                            output += "<p style='clear:both;margin:10px;'>TottalLetters:" + totalLetters+"</p>";
                            return output;

                        } catch (err){
                            return null;
                        }
            }
            processStatistics = function(surano, versno){
               
                var element = document.getElementById("X" + surano + "-" + versno);
                element.innerHTML += '<div id="XXStat-'+surano+'-'+versno+'" '+'class="word2word" ></div>';
                //element.innerHTML += '<div id="XEStat-'+surano+'-'+versno+'"'+' class="word2word" ></div>';
                var surano1 = surano;
                var versno1 = '\\d{1,3}';
                var pattern, pattern2;
                var arr = [];
                var arr2 = []; //in format 2:255
                var arr3 = [];
                var arr4 = [];
                var arr5 = [];
                var koran = "";
                var sura = "";
                var untilNow ="";
                var verse = "";
                var counter = 0;
                var i = 0;
                var pattern = new RegExp("\\(" + surano + ':' + versno1 + ":.*\\).*(?:\r?\n)", "mg");
                var pattern2 = new RegExp(/\r?\n/);
                var pattern3 = new RegExp("^" + surano1 + "\\|" + versno1 + "\\|" + '([\\S\\s]*?)(?:\\r?\\n)$', "g");
                var verseCounts = new Array(-1, 7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123,
		111, 43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93,
		88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59,
		37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11,
		11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
		29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8,
		11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6); //115
                
                if (!qKoran1) {

                    statisticsInit(surano);

                }


                if (qKoran1 != null) {
                    try { // /\(1|6|.*\).*/g;
                        arr3 = qKoran1.split(pattern2);
                        for (i; i < arr3.length; i++) {
                            var match = arr3[i].indexOf(surano1 + '|' + versno +'|', 0);
                            if (match != -1) {
                                arr2[arr2.length] = arr3[i];
                                counter++;
                                break;
                            }
                        }
                        if (arr2) {
                            verse = arr2.length + ' parts\n' + arr2.join(' ');
                            //element.innerHTML += koran; koran = null; delete koran;
                        } else {
                            verse = '-no matches found in Koran for ref ' + surano;
                            //element.innerHTML += koran; koran = null; delete koran;
                            return;
                        }
                    } catch (err) { 
                       // element.innerHTML += err; return; 
                    }
                    if (verse) {
                      element.innerHTML += processLetters(verse);
                    }
                    try{
                        var max = verseCounts[surano];
                        var min = 1;
                        for( i= 0; i< arr3.length;i++){
                           
                            var match = arr3[i].indexOf(surano1 +'|'+ min + '|',0);
                            if(match != -1){
                                if(min <= max){
                                    arr4[arr4.length] = arr3[i];
                                    min++;
                                }else{ break;}
                            }
                            
                        }
                        if(arr4){
                            sura = arr4.join("");
                            element.innerHTML += processLetters(sura);
                        }
                    }catch (err){
                            
                    }
                    try{
                        var max1 = 1;
                        var min1 = 1;
                        var minSura = 1;
                        var maxSura = surano;
                        for( i= 0; i<arr3.length; i++){
                            max1 = verseCounts[minSura];
                            //var match = arr3[i].indexOf(minSura +'|'+ min + '|',0);
                            //if(match != -1){
                                if(minSura <= maxSura){
                                    if(min1 <= max1){
                                        var match = arr3[i].indexOf(minSura +'|'+ min1 + '|',0);
                                        if(match != -1){    
                                            arr5[arr5.length] = arr3[i];
                                            min1++;
                                        }
                                    }else{
                                        min1 = 1;
                                        minSura++;
                                        if(minSura <= maxSura){
                                            
                                            var match = arr3[i].indexOf(minSura +'|'+ min1 + '|',0);
                                            if(match != -1){    
                                                arr5[arr5.length] = arr3[i];
                                                min1++;
                                            }
                                            
                                        }
                                    }
                                
                                
                                }else{ break;}
                            //}
                            
                        }
                        if(arr5){
                            untilNow = arr5.join("");
                            element.innerHTML += processLetters(untilNow);
                        }
                    }catch (err){
                            
                    }
                    try{
                        
                        if(arr3){
                            koran = arr3.join("");
                            element.innerHTML += processLetters(koran);
                        }
                    }catch (err){
                            
                    }
                }
                statisticTransProces(surano, versno)
                arr = null;
                arr2 = null; //in format 2:255
                arr3 = null;
                arr4 = null;
                arr5 = null;
                koran = null;
                sura = null;
                verse = null;
            };

            function statisticsInit(surano, versno){
                
                var url1 = 'quran-simple-clean_with_numbers.txt';
                var url2 ='Koran_Tokens_ARB_ENG_V9.txt'
//                AjaxGet(url, true, function (data) {
//                    if(data !== ''){
//                        qKoran1 = data;
//                        processStatistics(surano, versno);
//                    }
//                    });
                    AjaxGet(url1, true, function (first) {

                    AjaxGet(url2, true, function (second) {

                        qKoranTokens= second;
                        qKoran1 = first;
                        processStatistics(surano, versno);
                    });

                });
               
            };
            var qGrammar1 = null;
            var qKoran1= null;
            onVerbSearchInit = function(verbText) {
                var url1 = 'quranic-corpus-morphology-0.4.txt';
                var url2 = 'quran-uthmani.txt';
                
                AjaxGet(url1, true, function (first) {

                    AjaxGet(url2, true, function (second) {

                        qGrammar1 = first;
                        qKoran1 = second;
                        verbSearchProces(verbText);
                    });

                });

                };
                    
            function verbSearchProces(verbText){
                var verb = verbText;
                var grammar = null;
                //var arr = null;
                var counter = 0;
                var verb2;
                var OK = true;
                var uncapbleTo='';
                if(verb.trim() == ""){
                    return;
                }
               
               
                var arr1, arr2, arr3, arr4=[], arr5=[], arr6=[];
                 //initializeMapper();
                verb = ArToEn(verb);
                if(!verb){return;}
                
                var tempArr = verb.trim().split('');
                var tempVerb='';
                for(var k = 0; k <tempArr.length; k++){
                    var temp = tempArr[k];
                    if(temp == '*' || temp == '+' || temp =='?' || temp == '=' || temp == '$' || temp == '^' || temp == '{' || temp == '}' || temp == '^' || temp == '!' || temp == '(' || temp == ')'){
                        temp = "\\" + temp;
                    }
                    tempVerb = tempVerb + temp;
                }
                verb = tempVerb;
                var pattern1 = new RegExp(/\r?\n/);
                var pattern2 = new RegExp("\(.*\)\\s(.*)\\sV.*");
                var pattern3 = "ROOT\:"+verb; 
               // var pattern4 = new RegExp(".*POS\:V.*"+pattern3+".*(?:\r?\n)", "mg");
               // var pattern4 = new RegExp(".*POS\:V.*"+pattern3+".*(?:\r?\n)", "mg");
                var pattern4 = new RegExp(".*POS\:V.*"+pattern3+".*(?:\r?\n)", "mg");
                
                var objectTemp= null;
                try { // /\(1:6.*\).*/g;
                        arr1 = qGrammar1.match(pattern4);
//                        var indexArr=[];
//                        //remove secon thirth, fourth.. forms
//                        for(var n = 0; n <arr1.length; n++){
//                            var formArr = arr1[n].split("|");
//                            for(var m =1; m < formArr.length; m++){
//                                var formTemp = formArr[m].trim();
//                                if(formTemp == "(II)" || formTemp == "(III)" || formTemp == "(IV)" || formTemp == "(V)" || formTemp == "(VI)" || formTemp == "(VII)" || formTemp == "(VIII)" || formTemp == "(IX)" || formTemp == "(X)"){
//                                    indexArr[indexArr.length]= n;
//                                }
//                            }
//                        }
//                        for(var k =0, l=0; k<indexArr.length;l--, k++){
//                            
//                                arr1.splice(indexArr[k]+l, 1);
//                        }
                        counter = arr1.length;
                        if (!arr1) {
                            return;
                            //grammar = arr1.length + ' parts\n' + arr1.join('');
                            //element.innerHTML += grammar; grammar = null; delete grammar;
                        //} else {
                            //grammar = '-no matches found in grammar';

                            //element.innerHTML += grammar; grammar = null; delete grammar;
                          //  return;
                        }
                    } catch (err) {// element.innerHTML += err; return; 
                        
                    }
                try { // /\(1:6.*\).*/g;
                        
                        if(arr1){
                            for(var i = 0; i < arr1.length; i++){
                                arr3=arr1[i].match(pattern2);
                                 if(arr3){
                                  objectTemp ={};
                                  objectTemp["suraNo"]=arr3[1];
                                  objectTemp["verb"]=arr3[2];
                                  arr4[arr4.length]= objectTemp;
//                                     OK = arr4.some(function(e,i,a){
//                                          return(e == arr3[2]);
//                                      });
//                                      if(OK == false){
//                                         arr4[arr4.length]= arr3[2];
//                                      }
                                }
                                                           
                            }
                        }
                        if(!arr4){
                            
                        return;    
                            
                            //verbSearchDisplay(arr4, counter);
                        }
                        counter = arr4.length;
                    } catch (err) {// element.innerHTML += err; return; 
                        
                    }
                    try{
                        arr5 = qKoran1.split(pattern1);
                        if(!arr5){return;}
                        var counter2 =0;
                        
                        for(var i =0; i < arr4.length; i++){
                            //var search = stripTashkeel(EnToAr(arr4[i]["verb"].trim()));
                            var search = EnToAr(arr4[i]["verb"].trim());
                            if (search.length > 0) {
                               //search = "(" + search + ")";
                               var suraNo= arr4[i]["suraNo"].replace(/\:/g,"|").replace(/\(/g,"").replace(/\)/g,"").split("|");
                               var temp = suraNo[0]+"|"+suraNo[1]+"|";
                               //search = + search + ;
                               var rexp = new RegExp( "("+search+ ")", "i");

                                //tempHTML = tempHTML.replace(rexp, '<span class="highlighted term' + "0" + '">$1</span>');
                                for (var j=0; j< arr5.length; j++) {
                                    var match = arr5[j].indexOf(temp, 0);
                                    if (match != -1) {
                                        var tempCell = arr5[j];
                                        var tempArabic = tempCell;
                                        tempCell = tempCell.replace(rexp, '<span class="highlighted term0" >$1</span>');
                                        if(tempCell == tempArabic){
                                           
                                           uncapbleTo += temp +"-" + search+ "<br/>";
                                        }
                                        arr5[j]= tempCell;
                                        counter2++;
                                        break;//
                                    }
                                }
                            }
                        }
                        if(!arr5){return;}
                        if(counter != counter2){return;}
                        verbSearchDisplay(arr5, counter, uncapbleTo)
                    }catch (err) {// element.innerHTML += err; return; 
                        
                    }
                    
                
            }
            function verbSearchGetInput(){
                var root = document.getElementById("InputSearch").value;
                if(!(root.trim())){return;}
                onVerbSearchInit(root);
            }
//            var CHARCODE_SHADDA = 1617;
//            var CHARCODE_SUKOON = 1618;
//            var CHARCODE_SUPERSCRIPT_ALIF = 1648;
//            var CHARCODE_TATWEEL = 1600;
//            var CHARCODE_ALIF = 1575;
//
//            function isCharTashkeel(letter)
//            {
//                if (typeof(letter) == "undefined" || letter == null)
//                    return false;
//
//                var code = letter.charCodeAt(0);
//                //1648 - superscript alif
//                //1619 - madd: ~
//                return (code == CHARCODE_TATWEEL || code == CHARCODE_SUPERSCRIPT_ALIF || (code >= 1612 && code <= 1631)); //tashkeel
//            }
//
//            function stripTashkeel(input)
//            {
//              var output = "";
//              //todo consider using a stringbuilder to improve performance
//              var temp = input;//.replace(/[\u0617-\u061A\u064B-\u0652]/g,"");
//              for (var i = 0; i < temp.length; i++)
//              {
//                var letter = temp.charAt(i);
////                if(letter == 'ٱ'){//|| letter == 'ٲ' || letter == 'ٳ' || letter == 'آ' || letter == 'أ'){
////                    letter = 'ا'
////                }
//                if (!isCharTashkeel(letter)) //tashkeel
//                  output += letter;                                
//              }
//
//
//            return output;                   
//            }
            
            function verbSearchDisplay(arr, counter, err){
                
                
                
               var element = document.getElementById("content");
               //var tempinnerHTML = element.innerHTML;
               //var tempHTML=tempinnerHTML;
               var resultLabel = document.getElementById("search-label");
               //for(var i =0; i < arr.length; i++){
                //var search = stripTashkeel(EnToAr(arr[i].trim()));
                //if (search.length > 0) {
                   //search = "(" + search + ")";
                   //var suraNoArr= arr[i]["suraNo"].replace(/\:/g,"|").replace(/\(/g,"").replace(/\)/g,"").split("|");
                   //var temp = suraNoArr[0]+"|"+suraNoArr[1]+"|";
                //   search = "\\s\(" + search + "\)" ;
                //   var rexp = new RegExp(search, "g");
               
                //   tempHTML = tempHTML.replace(rexp, '<span class="highlighted term' + "0" + '">$1</span>');
                  
                //}
              //}
              element.innerHTML=arr.join("\r\n");
              placeLinktoAyatNumbers();
              resultLabel.innerHTML = counter + "<br />"+ err;
                
            }
            
            var qGrammar2 = null;
            var qKoran2= null;
            onNounSearchInit = function(verbText) {
                var url1 = 'quranic-corpus-morphology-0.4.txt';
                var url2 = 'quran-uthmaniwitoutoptions.txt';
                
                AjaxGet(url1, true, function (first) {

                    AjaxGet(url2, true, function (second) {

                        qGrammar2 = first;
                        qKoran2 = second;
                        nounSearchProces(verbText);
                    });

                });

                };
            function nounSearchProces(verbText){
                var verb = verbText;
                var grammar = null;
                //var arr = null;
                var counter = 0;
                var verb2;
                var OK = true;
                var uncapbleTo='';
                if(verb.trim() == ""){
                    return;
                }
               
               
                var arr1, arr2, arr3, arr4=[], arr5=[], arr6=[];
                 //initializeMapper();
                verb = ArToEn(verb);
                if(!verb){return;}
                
                var tempArr = verb.trim().split('');
                var tempVerb='';
                for(var k = 0; k <tempArr.length; k++){
                    var temp = tempArr[k];
                    if(temp == '*' || temp == '+' || temp =='?' || temp == '=' || temp == '$' || temp == '^' || temp == '{' || temp == '}' || temp == '^' || temp == '!' || temp == '(' || temp == ')'){
                        temp = "\\" + temp;
                    }
                    tempVerb = tempVerb + temp;
                }
                verb = tempVerb;
                var pattern1 = new RegExp(/\r?\n/);
                var pattern2 = new RegExp("\(.*\)\\s(.*)\\sN.*");
                var pattern3 = "ROOT\:"+verb; 
               // var pattern4 = new RegExp(".*POS\:V.*"+pattern3+".*(?:\r?\n)", "mg");
               // var pattern4 = new RegExp(".*POS\:V.*"+pattern3+".*(?:\r?\n)", "mg");
                var pattern4 = new RegExp(".*POS\:N.*"+pattern3+".*(?:\r?\n)", "mg");
                
                var objectTemp= null;
                try { // /\(1:6.*\).*/g;
                        arr1 = qGrammar2.match(pattern4);
//                        var indexArr=[];
//                        //remove secon thirth, fourth.. forms
//                        for(var n = 0; n <arr1.length; n++){
//                            var formArr = arr1[n].split("|");
//                            for(var m =1; m < formArr.length; m++){
//                                var formTemp = formArr[m].trim();
//                                if(formTemp == "(II)" || formTemp == "(III)" || formTemp == "(IV)" || formTemp == "(V)" || formTemp == "(VI)" || formTemp == "(VII)" || formTemp == "(VIII)" || formTemp == "(IX)" || formTemp == "(X)"){
//                                    indexArr[indexArr.length]= n;
//                                }
//                            }
//                        }
//                        for(var k =0, l=0; k<indexArr.length;l--, k++){
//                            
//                                arr1.splice(indexArr[k]+l, 1);
//                        }
                        counter = arr1.length;
                        if (!arr1) {
                            return;
                            //grammar = arr1.length + ' parts\n' + arr1.join('');
                            //element.innerHTML += grammar; grammar = null; delete grammar;
                        //} else {
                            //grammar = '-no matches found in grammar';

                            //element.innerHTML += grammar; grammar = null; delete grammar;
                          //  return;
                        }
                    } catch (err) {// element.innerHTML += err; return; 
                        
                    }
                try { // /\(1:6.*\).*/g;
                        
                        if(arr1){
                            for(var i = 0; i < arr1.length; i++){
                                arr3=arr1[i].match(pattern2);
                                 if(arr3){
                                  objectTemp ={};
                                  objectTemp["suraNo"]=arr3[1];
                                  objectTemp["verb"]=arr3[2];
                                  arr4[arr4.length]= objectTemp;
//                                     OK = arr4.some(function(e,i,a){
//                                          return(e == arr3[2]);
//                                      });
//                                      if(OK == false){
//                                         arr4[arr4.length]= arr3[2];
//                                      }
                                }
                                                           
                            }
                        }
                        if(!arr4){
                            
                        return;    
                            
                            //verbSearchDisplay(arr4, counter);
                        }
                        counter = arr4.length;
                    } catch (err) {// element.innerHTML += err; return; 
                        
                    }
                    try{
                        arr5 = qKoran2.split(pattern1);
                        if(!arr5){return;}
                        var counter2 =0;
                        
                        for(var i =0; i < arr4.length; i++){
                            //var search = stripTashkeel(EnToAr(arr4[i]["verb"].trim()));
                            var search = EnToAr(arr4[i]["verb"].trim());
                            if (search.length > 0) {
                               //search = "(" + search + ")";
                               var suraNo= arr4[i]["suraNo"].replace(/\:/g,"|").replace(/\(/g,"").replace(/\)/g,"").split("|");
                               var temp = suraNo[0]+"|"+suraNo[1]+"|";
                               //search = + search + ;
                               var rexp = new RegExp( "("+search+ ")", "i");

                                //tempHTML = tempHTML.replace(rexp, '<span class="highlighted term' + "0" + '">$1</span>');
                                for (var j=0; j< arr5.length; j++) {
                                    var match = arr5[j].indexOf(temp, 0);
                                    if (match != -1) {
                                        var tempCell = arr5[j];
                                        var tempArabic = tempCell;
                                        tempCell = tempCell.replace(rexp, '<span class="highlighted term0" >$1</span>');
                                        if(tempCell == tempArabic){
                                           
                                           uncapbleTo += temp +"-" + search+ "<br/>";
                                        }
                                        arr5[j]= tempCell;
                                        counter2++;
                                        break;//
                                    }
                                }
                            }
                        }
                        if(!arr5){return;}
                        if(counter != counter2){return;}
                        nounSearchDisplay(arr5, counter, uncapbleTo)
                    }catch (err) {// element.innerHTML += err; return; 
                        
                    }
                    
                
            }
            function nounSearchGetInput(){
                var root = document.getElementById("InputSearch").value;
                if(!(root.trim())){return;}
                onNounSearchInit(root);
            }

            function nounSearchDisplay(arr, counter, err){
                
                
                
               var element = document.getElementById("content");
               //var tempinnerHTML = element.innerHTML;
               //var tempHTML=tempinnerHTML;
               var resultLabel = document.getElementById("search-label");
               //for(var i =0; i < arr.length; i++){
                //var search = stripTashkeel(EnToAr(arr[i].trim()));
                //if (search.length > 0) {
                   //search = "(" + search + ")";
                   //var suraNoArr= arr[i]["suraNo"].replace(/\:/g,"|").replace(/\(/g,"").replace(/\)/g,"").split("|");
                   //var temp = suraNoArr[0]+"|"+suraNoArr[1]+"|";
                //   search = "\\s\(" + search + "\)" ;
                //   var rexp = new RegExp(search, "g");
               
                //   tempHTML = tempHTML.replace(rexp, '<span class="highlighted term' + "0" + '">$1</span>');
                  
                //}
              //}
              element.innerHTML=arr.join("\r\n");
              placeLinktoAyatNumbers();
              resultLabel.innerHTML = counter + "<br />"+ err;
                
            }
            
            qKoranTokens = null;
//            onStatisticTransInit = function(surano, versno) {
//                var url1 = 'Koran_Tokens_V7_1.txt';
//                    AjaxGet(url1, true, function (second) {
//
//                        qKoranTokens = second;
//                        statisticTransProces(surano,versno);
//                    });
//
//              
//
//            };
            function statisticTransProces(surano, versno){
                
                //var verb = verbText;
                var surano=surano;
                var versno=versno;
                //var grammar = null;
                var koranToken=null;
                var counter = 0;
                //var verb2;
                var OK = true;
                var uncapbleTo='';
                //if(verb.trim() == ""){
                //    return;
                //}
               if(!qKoranTokens){return;}
               
                var arr1, arr2, arr3, arr4=[], arr5=[], arr6=[];
                 
//                verb = ArToEn(verb);
//                if(!verb){return;}
//                
//                var tempArr = verb.trim().split('');
//                var tempVerb='';
//                for(var k = 0; k <tempArr.length; k++){
//                    var temp = tempArr[k];
//                    if(temp == '*' || temp == '+' || temp =='?' || temp == '=' || temp == '$' || temp == '^' || temp == '{' || temp == '}' || temp == '^' || temp == '!' || temp == '(' || temp == ')'){
//                        temp = "\\" + temp;
//                    }
//                    tempVerb = tempVerb + temp;
//                }
//                verb = tempVerb;
                var pattern1 = new RegExp(/\r?\n/);
//                var pattern2 = new RegExp("\(.*\)\\s(.*)\\sN.*");
                var pattern2 = new RegExp("\\|");
//                var pattern3 = "ROOT\:"+verb; 
              
                //var pattern4 = new RegExp(".*POS\:N.*"+pattern3+".*(?:\r?\n)", "mg");
                var slength=surano.toString().length;
                var vlength=versno.toString().length;
                var pattern4 = new RegExp( "^"+surano + "\\|" + versno + "\\|\\d{1,3}\\|.*\\|.*\\|.*(?:\r?\n)", "mg");
                var objectTemp= null;
                try { // /\(1:6.*\).*/g;
                        arr1 = qKoranTokens.match(pattern4);

                        counter = arr1.length;
                        if (!arr1) {
                            return;
                       
                        }
                    } catch (err) {// element.innerHTML += err; return; 
                        
                    }
                try { // /\(1:6.*\).*/g;
                        
                        if(arr1){
                            for(var i = 0; i < arr1.length; i++){
                                arr3=arr1[i].split(pattern2);
                                 if(arr3){
                                  objectTemp =[];
                                  objectTemp[0] = arr3[0];
                                  objectTemp[1] = arr3[1];
                                  objectTemp[2] = arr3[2];
                                  objectTemp[3] = arr3[3];
                                  objectTemp[4] = arr3[4];
                                  objectTemp[5] = arr3[5];
                                  objectTemp[6] = arr3[6]
                                  objectTemp[7] = EnToAr(arr3[4]);
                                  objectTemp[8] = EnToAr(arr3[6]);
                                  objectTemp[9] = (arr3[4].trim() === arr3[6].trim())
                                  arr4[arr4.length] = objectTemp;

                                }
                                                           
                            }
                        }
                        if(!arr4){
                            
                        return;    
                            
                           
                        }
                        counter = arr4.length;
                    } catch (err) {// element.innerHTML += err; return; 
                        
                    }
                        statisticTransDisplay(arr4, counter, uncapbleTo)
                
            }
            function statisticTransDisplay(arr, counter, err){
               var surano =arr[0][0];
                var versno = arr[0][1];
               var element = document.getElementById("XXStat-"+surano+"-"+versno+"");
               //var element2 = documet.getElementById("XEStat-"+surano+"-"+versno+"");
               //var tempinnerHTML = element.innerHTML;
               var tempHTML = "";
//               var resultLabel = document.getElementById("search-label");
               tempHTML += '<div id="XAStat-'+surano + '-' + versno +'" ' +'style="width:100%" class="stat">'
               tempHTML += "<p style='display:block;'>&lrm;Arabic MAX&lrm;</p>"
               for(var i =0; i < arr.length; i++){
                   //for(j=0; j< arr[i].length;j++){
                     
                        
                        tempHTML +='<span class="wordpair">'   
                        tempHTML += '<span class="a2 bigger">'+ arr[i][7]+'</span>';
                        tempHTML += '<span class="e2">&lrm;'+ arr[i][5]+'&lrm;</span>';
                        //   tempHTML = tempHTML.replace(rexp, '<span class="highlighted term' + "0" + '">$1</span>');
                        tempHTML +='</span>'   
                       
                    //}
                }
                 tempHTML += '</div>'
                //tempHTML +="</p>"
              //}
              tempHTML += '<hr>'
              tempHTML += '<div id="XEStat-'+surano + '-' + versno +'" ' +'style="width:100%;" class="stat">'
              tempHTML += "<p style='display:block;'>&lrm;English MAX&lrm;</p>"
               for(var i =0; i < arr.length; i++){
                   //for(j=0; j< arr[i].length;j++){
                     
                        
                        tempHTML +='<span class="wordpair2">'  
                            if(arr[i][9]){
                                tempHTML += '<span class="a2 bigger" style="word-break: keep-all;">'+ arr[i][8]+'</span>';
                                tempHTML += '<span class="e2">&lrm;'+ arr[i][3]+'&lrm;</span>';
                                //   tempHTML = tempHTML.replace(rexp, '<span class="highlighted term' + "0" + '">$1</span>');
                            }else{
                                tempHTML += '<span class="a2 bigger" style="background-color: rgba(249, 202, 202,0.5);word-break: keep-all;" >'+ arr[i][8]+'</span>';
                                tempHTML += '<span class="e2">&lrm;'+ arr[i][3]+'&lrm;</span>';  
                            }
                        tempHTML +='</span>'   
                       
                    //}
                }
              tempHTML += '</div>'
              element.innerHTML=tempHTML;
//              placeLinktoAyatNumbers();
//              resultLabel.innerHTML = counter + "<br />"+ err;
                
            }
      