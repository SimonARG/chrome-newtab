# SimonARG's custom Chrome new tab

### Usage:

1.  Download the project [as a .zip](https://github.com/SimonARG/chrome-newtab/archive/refs/heads/main.zip).
2. Unzip download contents into a folder of your choosing.
3. Head to `chrome://extensions/` in your Chrome browser.
4. Toggle **Developer mode** in the top right.
5. Click **Load unpacked** and select the folder where the new tab was unzipped.
6. Your folder will appear as an extension, you can now toggle developer mode off and open a new tab.

- Add an image inside the `imgs` folder and modify the line 20 of *index.html* accordingly to change the background image: `<img class="bg" src="./imgs/FileName.FileExtension">`

- Add an image inside the `imgs` with the filename `favicon.png` to change the tab icon.

- For each **shortcut** desired in the **shortcut bar**, add an *object* to the array in `shortcuts.json`, where the property `url` is the website's URL, and the property `logo` is the path to the website's logo. Example:
    	[
    		{
    			"name": "reddit",
    			"url": "https://www.reddit.com/",
    			"logo": "./imgs/logos/reddit.png"
    	},
    	{
    			"name": "youtube",
    			"url": "https://www.youtube.com/feed/subscriptions",
    			"logo": "./imgs/logos/yt.png"
    		},
    	]