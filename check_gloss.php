<?php
/*
 * Checks the word alignment that gloss.js uses for the hover translations.
 *
 *   http://localhost/check_gloss.php              summary over all 114 suras
 *   http://localhost/check_gloss.php?sura=2&ayah=34   one verse, word by word
 *
 * PHP pulls out the two texts the browser actually shows:
 *   - the unvowelled verse lines embedded in index.php (#content)
 *   - the vowelled line ayat.php lifts out of NLEN/{SURA}ENNL.txt
 * The matching itself runs in the browser against the real gloss.js, so this
 * checks the shipped code rather than a second copy of the logic.
 */
mb_internal_encoding('UTF-8');
header('Content-Type: text/html; charset=utf-8');

/** Verse lines embedded in index.php, keyed [sura][ayah]. */
function plain_verses() {
    $out = [];
    foreach (preg_split('/\r?\n/', file_get_contents(__DIR__ . '/index.php')) as $line) {
        if (preg_match('/^(\d{1,3})\|(\d{1,3})\|(.+)$/u', trim($line), $m)) {
            $out[(int)$m[1]][(int)$m[2]] = $m[3];
        }
    }
    return $out;
}

/**
 * The first Arabic line of each verse block, which is the line ayat.php wraps
 * in the Arbc-{sura}-{ayah} div.
 */
function nlen_verses($sura) {
    $file = __DIR__ . '/NLEN/' . str_pad((string)$sura, 3, '0', STR_PAD_LEFT) . 'ENNL.txt';
    if (!is_readable($file)) return [];
    $out = [];
    $current = null;
    foreach (file($file) as $line) {
        if (preg_match('/^\d{1,3}$/', trim($line))) {
            $current = (int)trim($line);
            continue;
        }
        if ($current !== null && trim($line) !== ''
            && preg_match('/[\x{0621}-\x{064A}]/u', $line) && !isset($out[$current])) {
            $out[$current] = trim($line);
        }
    }
    return $out;
}

$plain = plain_verses();
$nlen = [];
for ($s = 1; $s <= 114; $s++) $nlen[$s] = nlen_verses($s);

$flags = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>gloss.js alignment check</title>
<style>
    body { font: 13px/1.5 Consolas, "Courier New", monospace; margin: 1.5em; }
    h1 { font-size: 15px; }
    pre { white-space: pre-wrap; }
    .ok { color: #157f3b; }
    .bad { color: #b00020; font-weight: bold; }
    .ar { font-family: "Traditional Arabic", Scheherazade, serif; font-size: 18px; }
</style>
</head>
<body>
<h1>gloss.js alignment check</h1>
<pre id="out">running&hellip;</pre>

<script src="./gloss.js" type="text/javascript" charset="UTF-8"></script>
<script type="text/javascript">
(function () {
    'use strict';

    var PLAIN = <?= json_encode($plain, $flags) ?>;
    var NLEN = <?= json_encode($nlen, $flags) ?>;

    var G = window.glossInternals;
    var out = document.getElementById('out');

    function write(html) { out.innerHTML += html; }

    function query(name) {
        var m = new RegExp('[?&]' + name + '=(\\d+)').exec(window.location.search);
        return m ? +m[1] : 0;
    }

    /** Load one sura's gloss data. */
    function loadSura(sura) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'js/ayas-s' + sura + 'd15q1.js', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) return reject(new Error('HTTP ' + xhr.status + ' for sura ' + sura));
                try {
                    resolve(JSON.parse(xhr.responseText.replace(/^﻿/, '')));
                } catch (e) {
                    reject(new Error('bad JSON for sura ' + sura + ': ' + e.message));
                }
            };
            xhr.send();
        });
    }

    var basmala = null;

    function tokens(data, sura, ayah, inPanel) {
        return G.tokensFor(data, ayah, G.needsBasmala(sura, ayah, inPanel) ? basmala : null);
    }

    /** 'greedy' | 'dp' (exact either way) | 'approx' | 'none' */
    function verdict(words, toks) {
        var np = words.map(G.norm);
        var nd = toks.map(function (t) { return G.norm(t[0]); });
        if (G.greedy(np, nd)) return 'greedy';
        var groups = G.dp(np, nd);
        if (!groups) return 'none';
        for (var i = 0; i < groups.length; i++) {
            var sp = groups[i][0].map(function (k) { return np[k]; }).join('');
            var sd = groups[i][1].map(function (k) { return nd[k]; }).join('');
            if (!G.skelEq(sp, sd)) return 'approx';
        }
        return 'dp';
    }

    function pad(s, n) {
        s = String(s);
        while (s.length < n) s += ' ';
        return s;
    }

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // ------------------------------------------------------- one verse

    function dumpVerse(sura, ayah) {
        return loadSura(sura).then(function (data) {
            out.innerHTML = '';
            [false, true].forEach(function (inPanel) {
                var text = inPanel
                    ? (NLEN[sura] || {})[ayah]
                    : (PLAIN[sura] || {})[ayah];
                if (!text) return;
                var words = text.trim().split(/\s+/);
                var toks = tokens(data, sura, ayah, inPanel);
                if (!toks) {
                    write('no gloss data for ' + sura + ':' + ayah + '\n');
                    return;
                }
                var glosses = G.buildGlosses(words, toks);
                write('\n=== ' + sura + ':' + ayah + ' '
                    + (inPanel ? 'NLEN panel' : 'index.php') + ' &mdash; '
                    + words.length + ' words, ' + toks.length + ' tokens, '
                    + verdict(words, toks) + ' ===\n');
                words.forEach(function (w, i) {
                    var g = glosses && glosses[i];
                    write('  ' + pad(i, 4)
                        + '<span class="ar">' + esc(w) + '</span>'
                        + '  &rarr;  '
                        + (g ? (g.exact ? '' : '~ ') + esc(g.en) : '<span class="bad">(none)</span>')
                        + '\n');
                });
            });
        });
    }

    // --------------------------------------------------------- summary

    function summarise() {
        var stats = {
            'index.php': {greedy: 0, dp: 0, approx: 0, none: 0, gaps: 0, examples: []},
            'NLEN panel': {greedy: 0, dp: 0, approx: 0, none: 0, gaps: 0, examples: []}
        };
        var started = Date.now();
        var chain = Promise.resolve();

        for (var s = 1; s <= 114; s++) {
            chain = chain.then(check(s));
        }

        function check(sura) {
            return function () {
                return loadSura(sura).then(function (data) {
                    if (sura === 1) basmala = G.tokensFor(data, 1, null);
                    Object.keys(PLAIN[sura]).forEach(function (key) {
                        var ayah = +key;
                        [['index.php', (PLAIN[sura] || {})[ayah], false],
                         ['NLEN panel', (NLEN[sura] || {})[ayah], true]].forEach(function (row) {
                            var name = row[0], text = row[1], inPanel = row[2];
                            if (!text) return;
                            var st = stats[name];
                            var words = text.trim().split(/\s+/);
                            var toks = tokens(data, sura, ayah, inPanel);
                            if (!toks) { st.none++; return; }

                            var v = verdict(words, toks);
                            st[v]++;
                            if (v !== 'greedy' && st.examples.length < 10) {
                                st.examples.push(sura + ':' + ayah + '(' + v + ')');
                            }

                            // every on-screen word must come out with a gloss
                            var glosses = G.buildGlosses(words, toks);
                            if (!glosses) { st.gaps += words.length; return; }
                            for (var i = 0; i < words.length; i++) {
                                if (!glosses[i] || !glosses[i].en) st.gaps++;
                            }
                        });
                    });
                    out.innerHTML = 'checking&hellip; sura ' + sura + ' of 114';
                });
            };
        }

        return chain.then(function () {
            out.innerHTML = 'checked in ' + ((Date.now() - started) / 1000).toFixed(1) + 's\n\n';
            var allGood = true;
            Object.keys(stats).forEach(function (name) {
                var st = stats[name];
                var total = st.greedy + st.dp + st.approx + st.none;
                var exact = st.greedy + st.dp;
                var clean = st.none === 0 && st.gaps === 0;
                allGood = allGood && clean;
                write('<span class="' + (clean ? 'ok' : 'bad') + '">'
                    + pad(name, 12) + ' verses ' + total
                    + ' | exact ' + exact + ' (' + (100 * exact / total).toFixed(2) + '%)'
                    + ' | approx ' + st.approx
                    + ' | no alignment ' + st.none
                    + ' | words without a gloss ' + st.gaps
                    + '</span>\n');
                if (st.examples.length) write('             e.g. ' + st.examples.join(', ') + '\n');
            });
            write('\n<span class="' + (allGood ? 'ok' : 'bad') + '">'
                + (allGood
                    ? 'PASS — every verse aligned and every word glossed'
                    : 'FAIL — see the counts above') + '</span>\n');
        });
    }

    // ------------------------------------------------------------ run

    if (!G) {
        out.innerHTML = '<span class="bad">gloss.js did not expose window.glossInternals</span>';
        return;
    }

    var sura = query('sura'), ayah = query('ayah');
    var job = (sura && ayah)
        ? loadSura(1).then(function (d) { basmala = G.tokensFor(d, 1, null); }).then(function () {
              return dumpVerse(sura, ayah);
          })
        : summarise();

    job.catch(function (e) {
        write('\n<span class="bad">ERROR: ' + esc(e.message) + '</span>\n');
    });
}());
</script>
</body>
</html>
