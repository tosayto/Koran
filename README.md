# Koran — Quranic Research & Arabic Linguistics Tool

An interactive web application for exploring the Qur'an at the word, root, and grammar level. Supports Arabic text search, verse-by-verse audio playback, morphological analysis, and multi-language translations (English, Dutch, Turkish).

## Features

- **Full Qur'an viewer** (`index.php`) — all 114 chapters with searchable Arabic text
- **Verse detail popup** — click any verse to see word-by-word translation, grammatical breakdown, and audio playback
- **Root search** — search by 3-letter Arabic root with acoustic/visual letter similarity matching
- **Verb concordance** (`index.html`) — 1,500+ Quranic verbs indexed by root, frequency, and translation
- **Virtual Arabic keyboard** — for non-Arabic keyboards

## Running

Requires XAMPP (Apache + PHP). No build step.

1. Clone the repository into your XAMPP `htdocs/` folder:
   ```
   cd C:/xampp/htdocs
   git clone https://github.com/tosayto/Koran.git
   ```
2. Start Apache via XAMPP Control Panel
3. Open `http://localhost/Koran/`

## Audio Playback

Audio files (~5 GB of MP3s) are **not included** in this repository. Without them, all features work except audio playback — the verse detail popup still shows text, translations, grammar, and word analysis.

If you have the MP3 files, place them in a `MP3/` folder inside the project directory. Files must be named in the format `SSSAAA.mp3` where `SSS` is the zero-padded sura number and `AAA` is the zero-padded ayat number (e.g., `001001.mp3` = Sura 1, Ayat 1).

## Data Sources

- `quran-uthmani.txt` — canonical Uthmani-script Qur'an
- `VerbTRV2.txt` — verb lexicon with EN/TR/NL translations and frequency counts
- `quranic-corpus-morphology-0.4.txt` — morphological data from [Quranic Arabic Corpus](https://corpus.quran.com)
- `NLEN/` — per-chapter verse files with translations
- `js/ayas-*.js` — pre-computed grammatical analysis per chapter
