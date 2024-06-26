# SimonARG's custom Chrome new tab
![Example of a custom new tab](https://i.imgur.com/tjlx0hf.png)
This project, when side-loaded as a Chrome extension, replaces the default `new tab` landing page with a customized one. This includes:

* Setting a custom background image or gif
* Setting a custom tab favicon
* Custom rendering of native Chrome bookmarks
* Adding, editing or removing shortcuts
* Searching the internet

This project was originally started because I wanted to be able to see Chrome's bookmark topbar, but only in the "new tab" page. However, this was not possible, and having the topbar on every website was annoying. This project's main feature is a custom rendering of Chrome bookmarks.

## Installation:

1.  Download the project [as a .zip](https://github.com/SimonARG/chrome-newtab/archive/refs/heads/main.zip).
2. Unzip download contents into a folder of your choosing.
3. Run `setup.bat` to create resource folders.
4. Head to `chrome://extensions/` in your Chrome browser.
5. Toggle **Developer mode** in the top right.
6. Click **Load unpacked** and select the folder where the new tab was unzipped.
7. Your folder will appear as an extension, you can now toggle developer mode off and open a new tab.

## Usage:

- Click the gear icon in the bottom left to change the tab title, favicon, the background image, and to add a new shortcut.

- Right-click a shortcut to edit or remove it.

> [!IMPORTANT]
> Icons for shortcuts should be located at /imgs/logos/, while browser favicons and background images whould be at /imgs/. These folders are created when you run `setup.bat`.