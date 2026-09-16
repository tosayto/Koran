/*
 * A play button at the start of every verse in the main view.
 *
 * placeLinktoAyatNumbers() in scripts.js emits <a id="P{sura}-{ayah}"
 * class="ayatPlay"> just ahead of each verse-number link. Clicks land here by
 * delegation on the document, so the 6236 buttons need no inline handlers and
 * keep working after the search functions rewrite #content's innerHTML.
 *
 * One shared Audio element does the playing - 6236 <audio> tags would be far
 * too much for the browser - and the icon comes from a CSS :before rule, which
 * keeps the glyph out of the innerHTML that the letter counts and the search
 * regexes run over.
 *
 * Files are MP3/{SSS}{AAA}.mp3, the same layout ayat.php already uses.
 */
(function () {
    'use strict';

    var player = null;
    var active = null;   // button whose verse is loading or playing
    var queue = [];      // urls still to play for `active`
    var token = 0;       // bumped on every click, to drop superseded callbacks

    function pad3(n) {
        return (n < 10 ? '00' : n < 100 ? '0' : '') + n;
    }

    function mp3Url(sura, ayah) {
        return 'MP3/' + pad3(sura) + pad3(ayah) + '.mp3';
    }

    /**
     * Is MP3/{SSS}{AAA}.mp3 on disk? Read off the AYAT_AUDIO manifest that
     * index.php builds from one listing of MP3/. With no manifest at all, say
     * yes and let a genuine 404 fall through to the 'missing' state.
     */
    function hasAudio(sura, ayah) {
        var map = window.AYAT_AUDIO;
        if (!map) return true;
        var line = map[sura];
        return !!line && line.charAt(ayah) === '1';
    }

    /**
     * The main view prints the basmala ahead of verse 1 of every sura except
     * al-Fatihah, where it is verse 1 in its own right, and at-Tawbah, which
     * has none. The recitation keeps it in a separate {SSS}000.mp3, so play
     * that first and the audio matches the line on screen.
     */
    function urlsFor(sura, ayah) {
        var urls = [];
        if (ayah === 1 && sura !== 1 && sura !== 9 && hasAudio(sura, 0)) {
            urls.push(mp3Url(sura, 0));
        }
        urls.push(mp3Url(sura, ayah));
        return urls;
    }

    function coords(btn) {
        var m = btn && /^P(\d{1,3})-(\d{1,3})$/.exec(btn.id);
        return m ? {sura: +m[1], ayah: +m[2]} : null;
    }

    function setState(btn, state) {
        if (btn) btn.className = state ? 'ayatPlay ' + state : 'ayatPlay';
    }

    function release() {
        setState(active, '');
        active = null;
        queue = [];
    }

    function fail(btn) {
        if (btn !== active) return;
        setState(btn, 'missing');
        btn.title = 'recitation not available';
        active = null;
        queue = [];
    }

    /** Start the next url queued for the active button. */
    function advance(mine) {
        if (mine !== token) return;          // a newer click took over
        if (!queue.length) { release(); return; }

        var btn = active;
        player.src = queue.shift();
        var started = player.play();
        if (started && typeof started['catch'] === 'function') {
            started['catch'](function () {
                if (mine === token) fail(btn);
            });
        }
    }

    function ensurePlayer() {
        if (player) return player;
        player = new Audio();
        player.preload = 'none';

        player.addEventListener('playing', function () {
            setState(active, 'playing');
        });
        player.addEventListener('ended', function () {
            advance(token);
        });
        player.addEventListener('error', function () {
            // Pointing src at a new file aborts the running load and reports it
            // here; that is not a missing recitation, so let it pass.
            var err = player.error;
            if (err && err.code === err.MEDIA_ERR_ABORTED) return;
            if (active) fail(active);
        });
        return player;
    }

    function toggle(btn) {
        var at = coords(btn);
        if (!at) return;
        var p = ensurePlayer();

        token++;
        if (active === btn) {   // clicking the playing verse stops it
            p.pause();
            release();
            return;
        }

        p.pause();
        setState(active, '');
        active = btn;
        setState(btn, 'loading');
        queue = urlsFor(at.sura, at.ayah);
        advance(token);
    }

    /** The .ayatPlay the click landed on, if any. */
    function playButton(node) {
        for (; node && node.nodeType === 1; node = node.parentNode) {
            if ((' ' + node.className + ' ').indexOf(' ayatPlay ') >= 0) return node;
            if (node.id === 'content') break;
        }
        return null;
    }

    document.addEventListener('click', function (ev) {
        var btn = playButton(ev.target);
        if (!btn) return;
        ev.preventDefault();
        toggle(btn);
    }, false);

    // placeLinktoAyatNumbers() in scripts.js asks before emitting a button
    window.ayatPlay = {hasAudio: hasAudio};
}());
