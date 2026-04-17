# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A self-contained Quranic research and Arabic linguistics web application. No build system, no package manager — pure PHP/HTML/JS served via XAMPP/Apache. All data lives in flat files (TXT/CSV). No database.

## Running the App

- Served via XAMPP: start Apache, then open `http://localhost/EmptySite3/`
- Entry points: `Koran.php` (full Qur'an view), `index.html` (verb concordance), `ayat.php` (verse detail), `search.php` (root search)
- No build step required — edit and refresh

## Architecture

### Data Flow
```
Browser → Koran.php (embeds full Qur'an inline)
        → scripts.js (AJAX calls to search.php and ayat.php)
              ↓
        search.php reads VerbTRV2.txt (pipe-delimited verb lexicon)
        ayat.php reads NLEN/{SURA}ENNL.txt + MP3/{SURA}{AYAH}.mp3 + js/ayas-*.js
```

### Key Files
| File | Role |
|------|------|
| `Koran.php` | Full Qur'an embed (~770 KB), inline verse data |
| `index.html` | Static verb concordance table (11,820 lines) |
| `scripts.js` | Core logic: search highlighting, AJAX, grammar, Buckwalter transliteration |
| `keyboard.js` | Virtual Arabic keyboard (GreyWyvern v1.49) |
| `ayat.php` | Verse detail: renders text, audio player, grammar breakdown |
| `search.php` | Arabic root search with acoustic/visual similarity matching |

### Pre-computed Grammar Data
- `js/ayas-s{SURA}d{DEPTH}q{QUALITY}.js` — 114 files of pre-calculated grammatical analysis per chapter
- Loaded dynamically by `scripts.js` on verse selection

### Data Files
- `quran-uthmani.txt` — canonical Qur'an text (Uthmani script)
- `VerbTRV2.txt` — pipe-delimited verb lexicon with EN/TR/NL translations and frequency counts
- `quranic-corpus-morphology-0.4.txt` — POS tags and morphological data (6.3 MB)
- `NLEN/` — 114 chapter files (`001ENNL.txt` … `114ENNL.txt`) for verse content
- `MP3/` — 5.2 GB of verse-by-verse recitation audio

## Arabic Text Handling

- All text is UTF-8; PHP files use explicit `mb_*` functions and `charset=utf-8` headers
- Buckwalter transliteration maps Arabic ↔ ASCII (implemented in `scripts.js` via `EnToAr()`/`ArToEn()`)
- Arabic is RTL — CSS uses `direction: rtl` where needed
- Custom fonts: `Samarqand.ttf`, `Coranica.ttf`, `openquran.ttf`

## PHP Patterns

- No framework, no autoloader — plain procedural PHP
- File reads use `file()` and `fopen()`/`fgets()` with UTF-8 encoding
- AJAX responses are plain text or HTML fragments (not JSON)
- `search.php` returns pipe-delimited rows; client splits on `|`
