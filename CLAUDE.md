# Chrome New Tab Extension

Chrome Manifest V3 extension that replaces the default new tab page. Pure vanilla JS/HTML/CSS with ES modules — no build tools, no dependencies.

## Project Structure

```
manifest.json          # Extension config (MV3, bookmarks permission, newtab override)
index.html             # Single-page UI (markup + modals), loads js/app.js as module entry
css/index.css          # All styles — semantic classes, no utility framework
js/
  app.js               # Entry point — imports and initializes all modules
  background.js        # Background image cycling, search bar filter effects
  config.js            # Settings panel toggle, tab title, favicon
  shortcuts.js         # Shortcut CRUD with event delegation and single shared edit modal
  bookmarks.js         # Chrome bookmarks tree renderer with delegated events
setup.bat              # Creates imgs/ and imgs/logos/ directories (gitignored)
```

User assets live in gitignored directories: `imgs/` (backgrounds, favicons) and `imgs/logos/` (shortcut icons).

## Architecture

Everything runs in the new tab page context. No background scripts, no content scripts. All JS uses ES modules (`type="module"`).

- **State:** All persisted via `localStorage` — keys: `tabTitle`, `faviconPath`, `bgArr` (JSON array of image paths), `currentBg` (index), `shortcuts` (JSON array of `{name, url, logo}` objects).
- **Chrome APIs:** Only `chrome.bookmarks.getTree()`.
- **External:** Google Fonts (Sofia Sans Extra Condensed, weights 400+600) loaded via `<link>`.

## Module Dependency Graph

```
app.js
  ├── background.js      (exports: blurBackground, unblurBackground)
  ├── config.js           (imports: background.js; exports: closeConfig, toggleConfig)
  ├── shortcuts.js        (imports: background.js, config.js)
  └── bookmarks.js        (exports: initBookmarks)
```

## Key Patterns

- **Event delegation** on `.bookmark-list` and `.shortcutbar` — no per-element listeners
- **Single shared modals** for edit/new shortcuts — no dynamic modal creation per shortcut
- **textContent** for user-provided strings (bookmark titles, shortcut names) — no innerHTML XSS risk
- **`.closed` class** on bookmark `<ul>` elements controls visibility; `closeFolderTree()` recursively closes nested subfolders
- Folder toggles are `<button>` elements, not `<a href="#">`

## Development

- Load as unpacked extension: `chrome://extensions/` → Developer mode → Load unpacked → select project folder
- Images must be manually placed in `imgs/` and `imgs/logos/` — file inputs only save filenames, not file data
