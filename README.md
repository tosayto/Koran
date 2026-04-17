# Koran — Quranic Research & Arabic Linguistics Tool

An interactive web application for exploring the Qur'an at the word, root, and grammar level. Supports Arabic text search, verse-by-verse audio playback, morphological analysis, and multi-language translations (English, Dutch, Turkish).

## Features

- **Verb concordance** (`index.html`) — 1,500+ Quranic verbs indexed by root, frequency, and translation
- **Full Qur'an viewer** (`Koran.php`) — all 114 chapters with searchable Arabic text
- **Verse detail** (`ayat.php`) — audio playback, word-by-word translation, grammatical breakdown
- **Root search** (`search.php`) — search by 3-letter Arabic root with acoustic/visual letter similarity matching
- **Virtual Arabic keyboard** — for non-Arabic keyboards

## Running

Requires XAMPP (Apache + PHP). No build step.

1. Place the project folder in `htdocs/`
2. Start Apache via XAMPP Control Panel
3. Open `http://localhost/EmptySite3/Koran.php`

## Data Sources

- `quran-uthmani.txt` — canonical Uthmani-script Qur'an
- `VerbTRV2.txt` — verb lexicon with EN/TR/NL translations and frequency counts
- `quranic-corpus-morphology-0.4.txt` — morphological data from [Quranic Arabic Corpus](https://corpus.quran.com)
- `NLEN/` — per-chapter verse files with translations
- `js/ayas-*.js` — pre-computed grammatical analysis per chapter

## Notes

- Audio files (MP3/) are not included in the repository due to size (5 GB).
- Manuscript images (Chairo-Manuscript/, u/) are excluded for the same reason.
