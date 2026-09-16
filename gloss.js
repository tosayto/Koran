/*
 * Hover an Arabic word to see its English gloss.
 *
 * The word-by-word glosses already shipped in js/ayas-s{N}d15q1.js are keyed to
 * the Uthmani orthography, while the text on screen uses simpler spellings:
 * unvowelled in #content, vowelled in the NLEN panels that ayat.php renders.
 * The two tokenise differently -- "yaa-ayyuhaa" is one Uthmani token but two
 * words on screen -- so a word cannot be found by counting. Instead both sides
 * are reduced to a bare consonant skeleton and the two sequences are aligned,
 * allowing m:n groups.
 *
 * Checked against all 6236 verses in both texts: 99.92% align with every group
 * matching exactly, and every verse yields an alignment.
 *
 * Nothing inside #content is mutated, so search highlighting, the letter counts
 * and the verse panels are untouched; the tooltip and the box drawn around the
 * hovered word are overlays outside the text flow.
 *
 * Arabic is written with \u escapes throughout: the bidirectional reordering of
 * literal Arabic in a mostly-ASCII source file makes it near-impossible to edit
 * reliably.
 */
(function () {
    'use strict';

    var DATA_URL = 'js/ayas-s$Sd15q1.js';

    /* ------------------------------------------------------------------ *
     * Skeleton matching
     * ------------------------------------------------------------------ */

    var ALEF = '\u0627', WAW = '\u0648', YEH = '\u064A', HEH = '\u0647';

    // Stands for a letter lost to the mojibake already present in some of the
    // ayas-*.js tokens: 2:34 stores "abaa" with U+FFFD where the beh should be.
    var WILD = '\u0001';

    /** Reduce an Arabic word to the consonants the two orthographies agree on. */
    function norm(s) {
        return s
            .replace(/\uFFFD/g, WILD)
            .replace(/\u0670/g, ALEF)         // superscript alef
            .replace(/\u06E5/g, WAW)          // small waw
            .replace(/\u06E6/g, YEH)          // small yeh
            // harakat, tanwin, shadda, sukun, quranic annotation, tatweel, joiners
            .replace(/[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED\u0640\u200C\u200D]/g, '')
            .replace(/[\u0622\u0623\u0625\u0627\u0671-\u0675]/g, ALEF)
            .replace(/\u0624/g, WAW)          // waw with hamza
            .replace(/\u0626/g, YEH)          // yeh with hamza
            .replace(/\u0649/g, YEH)          // alef maksura
            .replace(/\u0629/g, HEH)          // teh marbuta
            .replace(/[^\u0621-\u064A\u0001]/g, '')
            // the orthographies disagree on the weak letters, so drop them
            .replace(/[\u0621\u0627\u0648\u064A]/g, '');
    }

    /**
     * Uthmani writes an assimilated consonant once with shadda where the simpler
     * text doubles it ("al-layl" is spelled with one lam plus shadda in one and
     * two lams in the other). Run this after joining a group so that doublings
     * spanning a word boundary collapse too ("anzala" + "allaahu").
     */
    function collapse(s) {
        return s.replace(/(.)\1+/g, '$1');
    }

    function skelEq(p, d) {
        p = collapse(p);
        d = collapse(d);
        if (p.indexOf(WILD) < 0 && d.indexOf(WILD) < 0) return p === d;
        var re = '';
        for (var i = 0; i < d.length; i++) {
            re += d.charAt(i) === WILD
                ? '[\\s\\S]{0,2}'
                : d.charAt(i).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
        return new RegExp('^' + re + '$').test(p);
    }

    /** In-order pass; succeeds only when every group matches exactly. */
    function greedy(np, nd) {
        var P = np.length, D = nd.length, pi = 0, di = 0, out = [];
        while (pi < P || di < D) {
            if (pi >= P || di >= D) return null;
            var gp = [pi], gd = [di], accP = np[pi++], accD = nd[di++], guard = 0;
            while (!skelEq(accP, accD)) {
                if (++guard > 12) return null;
                if (collapse(accP).length < collapse(accD).length) {
                    if (pi >= P) return null;
                    accP += np[pi];
                    gp.push(pi++);
                } else {
                    if (di >= D) return null;
                    accD += nd[di];
                    gd.push(di++);
                }
            }
            out.push([gp, gd]);
        }
        return out;
    }

    var MAX_SPAN = 4, W_EDIT = 10, W_MERGE = 3;

    /** 0 when the skeletons match, otherwise their edit distance. */
    function pairCost(p, d) {
        if (skelEq(p, d)) return 0;
        var a = collapse(p), b = collapse(d), la = a.length, lb = b.length;
        if (!la) return lb;
        if (!lb) return la;
        var prev = [], i, j;
        for (j = 0; j <= lb; j++) prev[j] = j;
        for (i = 1; i <= la; i++) {
            var cur = [i];
            for (j = 1; j <= lb; j++) {
                cur[j] = Math.min(
                    prev[j] + 1,
                    cur[j - 1] + 1,
                    prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1)
                );
            }
            prev = cur;
        }
        return prev[lb];
    }

    function seq(from, to) {
        var out = [];
        for (var i = from; i <= to; i++) out.push(i);
        return out;
    }

    /**
     * Banded dynamic programme used when the greedy pass cannot match exactly.
     * Always returns an alignment, degrading to the cheapest approximation.
     */
    function dp(np, nd) {
        var P = np.length, D = nd.length;
        if (!P || !D) return null;
        var band = Math.abs(P - D) + 8;
        var best = {0: {0: 0}}, from = {};

        for (var i = 0; i <= P; i++) {
            var row = best[i];
            if (!row) continue;
            for (var jk in row) {
                if (!Object.prototype.hasOwnProperty.call(row, jk)) continue;
                var j = +jk, c = row[jk];
                if (i === P && j === D) continue;
                for (var a = 1; a <= MAX_SPAN && i + a <= P; a++) {
                    var sp = np.slice(i, i + a).join('');
                    for (var b = 1; b <= MAX_SPAN && j + b <= D; b++) {
                        var ni = i + a, nj = j + b;
                        if (Math.abs(ni - nj) > band) continue;
                        var nc = c
                            + W_EDIT * pairCost(sp, nd.slice(j, j + b).join(''))
                            + W_MERGE * (a + b - 2);
                        if (!best[ni]) best[ni] = {};
                        if (!(nj in best[ni]) || best[ni][nj] > nc) {
                            best[ni][nj] = nc;
                            if (!from[ni]) from[ni] = {};
                            from[ni][nj] = [i, j];
                        }
                    }
                }
            }
        }

        if (!best[P] || !(D in best[P])) return null;
        var groups = [], ci = P, cj = D;
        while (ci > 0 || cj > 0) {
            var prev = from[ci][cj];
            groups.push([seq(prev[0], ci - 1), seq(prev[1], cj - 1)]);
            ci = prev[0];
            cj = prev[1];
        }
        return groups.reverse();
    }

    /**
     * Map each on-screen word to the gloss of the data token(s) it belongs to.
     * Returns an array parallel to `words`, or null if no alignment was found.
     */
    function buildGlosses(words, tokens) {
        var np = [], nd = [], i;
        for (i = 0; i < words.length; i++) np.push(norm(words[i]));
        for (i = 0; i < tokens.length; i++) nd.push(norm(tokens[i][0]));

        var groups = greedy(np, nd);
        var exactPass = groups !== null;
        if (!groups) groups = dp(np, nd);
        if (!groups) return null;

        var out = new Array(words.length);
        for (i = 0; i < groups.length; i++) {
            var gp = groups[i][0], gd = groups[i][1], ar = [], en = [], k;
            for (k = 0; k < gd.length; k++) {
                // drop the rub-el-hizb and sajda marks that ride along on a token
                ar.push(tokens[gd[k]][0].replace(/[\u06DE\u06E9]/g, '').trim());
                en.push(tokens[gd[k]][1]);
            }
            var exact = exactPass;
            if (!exact) {
                var sp = '', sd = '';
                for (k = 0; k < gp.length; k++) sp += np[gp[k]];
                for (k = 0; k < gd.length; k++) sd += nd[gd[k]];
                exact = skelEq(sp, sd);
            }
            var entry = {ar: ar.join(' '), en: en.join(' '), exact: exact};
            for (k = 0; k < gp.length; k++) out[gp[k]] = entry;
        }
        return out;
    }

    /* ------------------------------------------------------------------ *
     * Gloss data
     * ------------------------------------------------------------------ */

    var suras = {};   // sura -> {data: [...]} | {waiting: [cb, ...]} | {} on failure

    function loadSura(sura, done) {
        var slot = suras[sura];
        if (slot && slot.data) return done(slot.data);
        if (slot && slot.waiting) return slot.waiting.push(done);
        if (slot) return done(null);

        suras[sura] = slot = {waiting: [done]};
        var xhr = new XMLHttpRequest();
        xhr.open('GET', DATA_URL.replace('$S', sura), true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            var data = null;
            if (xhr.status === 200) {
                try {
                    data = JSON.parse(xhr.responseText.replace(/^\uFEFF/, ''));
                } catch (e) {
                    data = null;
                }
            }
            var waiting = slot.waiting;
            suras[sura] = data ? {data: data} : {};
            for (var i = 0; i < waiting.length; i++) waiting[i](data);
        };
        xhr.send();
    }

    /** Flat token list for a verse, optionally prefixed with the basmala. */
    function tokensFor(data, ayah, basmala) {
        var v = data[ayah - 1];
        if (!v || !v.w) return null;
        var out = basmala ? basmala.slice() : [];
        for (var k = 0; k < v.w.length; k++) {
            for (var j = 0; j < v.w[k].length; j++) out.push(v.w[k][j]);
        }
        return out;
    }

    function basmalaTokens(cb) {
        loadSura(1, function (data) {
            cb(data ? tokensFor(data, 1, null) : null);
        });
    }

    /**
     * #content prepends the basmala to verse 1 of every sura but al-Fatihah and
     * at-Tawbah; the NLEN panels do not.
     */
    function needsBasmala(sura, ayah, inPanel) {
        return !inPanel && ayah === 1 && sura !== 1 && sura !== 9;
    }

    var glossCache = {};   // "sura:ayah:context" -> glosses | null

    function glossesFor(sura, ayah, inPanel, words, done) {
        var key = sura + ':' + ayah + ':' + (inPanel ? 'p' : 'c');
        if (key in glossCache) return done(glossCache[key]);

        var finish = function (basmala) {
            loadSura(sura, function (data) {
                var tokens = data && tokensFor(data, ayah, basmala);
                var glosses = tokens ? buildGlosses(words, tokens) : null;
                glossCache[key] = glosses;
                done(glosses);
            });
        };
        if (needsBasmala(sura, ayah, inPanel)) basmalaTokens(finish);
        else finish(null);
    }

    /* ------------------------------------------------------------------ *
     * Locating the word under the pointer
     * ------------------------------------------------------------------ */

    function isAyatNum(node) {
        return !!node && node.nodeType === 1 && node.nodeName === 'A' &&
            (' ' + node.className + ' ').indexOf(' ayatNum ') >= 0;
    }

    function caretAt(x, y) {
        var node = null, offset = 0;
        if (document.caretPositionFromPoint) {
            var pos = document.caretPositionFromPoint(x, y);
            if (!pos) return null;
            node = pos.offsetNode;
            offset = pos.offset;
        } else if (document.caretRangeFromPoint) {
            var range = document.caretRangeFromPoint(x, y);
            if (!range) return null;
            node = range.startContainer;
            offset = range.startOffset;
        } else {
            return null;
        }
        return node && node.nodeType === 3 ? {node: node, offset: offset} : null;
    }

    /**
     * Work out which verse a text node belongs to and which sibling nodes carry
     * its text. Returns null when the node is not Arabic verse text.
     */
    function verseScope(node) {
        var content = document.getElementById('content');
        if (!content) return null;

        var inContent = false;
        for (var p = node.parentNode; p; p = p.parentNode) {
            if (p.nodeType !== 1) continue;
            if (p.id && p.id.indexOf('Arbc-') === 0) {
                var m = /^Arbc-(\d+)-(\d+)$/.exec(p.id);
                return m ? {sura: +m[1], ayah: +m[2], nodes: [p], inPanel: true} : null;
            }
            if (isAyatNum(p)) return null;          // the verse-number link itself
            if (p === content) { inContent = true; break; }
            if (p === document.body) return null;
        }
        if (!inContent) return null;

        // A bare run of #content: walk out to the child of #content holding the
        // node, then back to the verse-number link that precedes it.
        var top = node;
        while (top.parentNode && top.parentNode !== content) top = top.parentNode;
        if (top.parentNode !== content) return null;
        if (top.nodeType === 1 && top.nodeName === 'PRE') return null;   // verse panel

        var nodes = [], link = null, n, guard;
        for (n = top, guard = 0; n && guard < 400; n = n.previousSibling, guard++) {
            if (isAyatNum(n)) { link = n; break; }
            if (n.nodeType === 1 && n.nodeName === 'PRE') return null;
            nodes.unshift(n);
        }
        if (!link) return null;
        for (n = top.nextSibling; n; n = n.nextSibling) {
            if (isAyatNum(n) || (n.nodeType === 1 && n.nodeName === 'PRE')) break;
            nodes.push(n);
        }

        var num = /^\s*(\d{1,3})\|(\d{1,3})\|/.exec(link.textContent || '');
        if (!num) return null;
        return {sura: +num[1], ayah: +num[2], nodes: nodes, inPanel: false};
    }

    /** Concatenate the scope's text, remembering where each text node landed. */
    function collectText(nodes) {
        var text = '', segs = [];
        function walk(n) {
            if (n.nodeType === 3) {
                segs.push({node: n, start: text.length});
                text += n.nodeValue;
            } else if (n.nodeType === 1) {
                for (var c = n.firstChild; c; c = c.nextSibling) walk(c);
            }
        }
        for (var i = 0; i < nodes.length; i++) walk(nodes[i]);
        return {text: text, segs: segs};
    }

    function tokenize(text) {
        var re = /\S+/g, m, out = [];
        while ((m = re.exec(text)) !== null) {
            out.push({word: m[0], start: m.index, end: m.index + m[0].length});
        }
        return out;
    }

    function rangeFor(segs, start, end) {
        var range = document.createRange(), started = false;
        for (var i = 0; i < segs.length; i++) {
            var s = segs[i], e = s.start + s.node.nodeValue.length;
            if (!started && start >= s.start && start <= e) {
                range.setStart(s.node, start - s.start);
                started = true;
            }
            if (started && end >= s.start && end <= e) {
                range.setEnd(s.node, end - s.start);
                return range;
            }
        }
        return null;
    }

    /** The rect of `range` that actually sits under the pointer, if any. */
    function rectUnder(range, x, y) {
        var rects = range.getClientRects();
        for (var i = 0; i < rects.length; i++) {
            var r = rects[i];
            if (!r.width && !r.height) continue;
            if (x >= r.left - 1 && x <= r.right + 1 && y >= r.top - 1 && y <= r.bottom + 1) return r;
        }
        return null;
    }

    /** Resolve the pointer to {sura, ayah, index, words, rect} or null. */
    function wordAt(x, y) {
        var caret = caretAt(x, y);
        if (!caret) return null;
        var scope = verseScope(caret.node);
        if (!scope) return null;

        var collected = collectText(scope.nodes);
        var offset = -1, i;
        for (i = 0; i < collected.segs.length; i++) {
            if (collected.segs[i].node === caret.node) {
                offset = collected.segs[i].start + caret.offset;
                break;
            }
        }
        if (offset < 0) return null;

        var tokens = tokenize(collected.text);
        var hit = -1;
        for (i = 0; i < tokens.length; i++) {
            if (offset >= tokens[i].start && offset <= tokens[i].end) { hit = i; break; }
        }
        if (hit < 0) return null;

        var range = rangeFor(collected.segs, tokens[hit].start, tokens[hit].end);
        if (!range) return null;
        var rect = rectUnder(range, x, y);
        if (!rect) return null;

        var words = [];
        for (i = 0; i < tokens.length; i++) words.push(tokens[i].word);
        return {
            sura: scope.sura,
            ayah: scope.ayah,
            inPanel: scope.inPanel,
            index: hit,
            words: words,
            rect: rect
        };
    }

    /* ------------------------------------------------------------------ *
     * Tooltip
     * ------------------------------------------------------------------ */

    var tip, mark, tipAr, tipEn;

    function ensureChrome() {
        if (tip) return;
        mark = document.createElement('div');
        mark.id = 'gloss-mark';

        tipAr = document.createElement('div');
        tipAr.className = 'gloss-ar';
        tipAr.setAttribute('dir', 'rtl');
        tipEn = document.createElement('div');
        tipEn.className = 'gloss-en';

        tip = document.createElement('div');
        tip.id = 'gloss-tip';
        tip.setAttribute('dir', 'ltr');
        tip.appendChild(tipAr);
        tip.appendChild(tipEn);

        document.body.appendChild(mark);
        document.body.appendChild(tip);
    }

    function hide() {
        if (!tip) return;
        tip.className = '';
        mark.className = '';
    }

    function show(rect, entry) {
        ensureChrome();
        tipAr.textContent = entry.ar;
        tipEn.textContent = entry.en;
        tipEn.title = entry.exact ? '' : 'approximate word match';
        tip.className = entry.exact ? 'on measuring' : 'on measuring approx';

        // Both overlays are position:fixed, so `rect` can be used as-is: no
        // scroll offsets and no guessing at the containing block.
        mark.style.left = rect.left + 'px';
        mark.style.top = rect.top + 'px';
        mark.style.width = rect.width + 'px';
        mark.style.height = rect.height + 'px';
        mark.className = 'on';

        // laid out but invisible while measuring, so it can be placed above the
        // word unless that would run off the top of the viewport
        var tw = tip.offsetWidth, th = tip.offsetHeight;
        var vw = document.documentElement.clientWidth;
        var left = rect.left + rect.width / 2 - tw / 2;
        left = Math.max(4, Math.min(left, vw - tw - 4));
        var above = rect.top - th - 8;
        tip.style.left = left + 'px';
        tip.style.top = (above >= 4 ? above : rect.bottom + 8) + 'px';
        tip.className = tip.className.replace(' measuring', '');
    }

    /* ------------------------------------------------------------------ *
     * Wiring
     * ------------------------------------------------------------------ */

    var currentKey = null, pending = null, queued = null, frame = 0;

    function resolve(x, y) {
        var hit = wordAt(x, y);
        if (!hit) {
            currentKey = pending = null;
            hide();
            return;
        }
        var key = hit.sura + ':' + hit.ayah + ':' + (hit.inPanel ? 'p' : 'c') + ':' + hit.index;
        if (key === currentKey) return;
        currentKey = pending = key;

        glossesFor(hit.sura, hit.ayah, hit.inPanel, hit.words, function (glosses) {
            if (pending !== key) return;          // the pointer has moved on
            var entry = glosses && glosses[hit.index];
            if (entry && entry.en) show(hit.rect, entry);
            else hide();
        });
    }

    function forget() {
        currentKey = pending = null;
        hide();
    }

    document.addEventListener('mousemove', function (ev) {
        queued = {x: ev.clientX, y: ev.clientY};
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
            frame = 0;
            if (queued) resolve(queued.x, queued.y);
        });
    }, false);
    document.addEventListener('mouseleave', forget, false);
    document.addEventListener('mousedown', forget, false);
    window.addEventListener('scroll', forget, false);

    // Exposed for check_gloss.php, which re-runs the matching over every verse.
    // Not used by the app itself.
    window.glossInternals = {
        norm: norm,
        collapse: collapse,
        skelEq: skelEq,
        greedy: greedy,
        dp: dp,
        buildGlosses: buildGlosses,
        needsBasmala: needsBasmala,
        tokensFor: tokensFor
    };
}());
