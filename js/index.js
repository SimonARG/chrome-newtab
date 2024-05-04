const bookmarkObj = [];
const menu = [];

async function doTreeStuff() {
    const bookmarkTrees = [];
    const tree = await chrome.bookmarks.getTree();
    bookmarkTrees.push(tree);
  
    bookmarkObj.push(bookmarkTrees[0][0].children[0].children);

    const bookmarkTree = (bookmarkObj[0]);

    // Function to recursively iterate through the bookmark array to sort it
    function recurseSort(subFolder, parent) {
        subFolder.forEach(function(subItem, i) {

            if (subItem.children) {
                let subFolderObj = {name: subItem.title, subitems: []};
                
                parent.subitems.push(subFolderObj);

                let subFolder = subItem.children;

                recurseSort(subFolder, subFolderObj);
            } else {

                let file = {name: subItem.title, link: subItem.url};

                parent.subitems.push(file);
            }
        });
    }

    let currentOpenSubfolder = null;

    // Function to recursively iterate through the bookmark menu render it
    function recurseRender(element, parent) {
        element.subitems.forEach(function(subElement, i) {
            if (subElement.subitems) {
                const bookmarkSubMenu = document.createElement('li');
                bookmarkSubMenu.setAttribute("class", "subfolder inactive");
        
                bookmarkSubMenu.innerHTML = `
                <a href="#" class="subfolder-title inactive">
                    <span class="subfolder-icon">🗀</span>
                    <span class="subfolder-name">${subElement.name}</span>
                </a>`;

                const subSubList = document.createElement('ul');
                const subSubListContainer = document.createElement('div');
                subSubList.setAttribute('class', 'subroot inactive')
        
                subSubListContainer.appendChild(subSubList)
                bookmarkSubMenu.appendChild(subSubListContainer);

                parent.appendChild(bookmarkSubMenu);

                recurseRender(subElement, subSubList);
            } else {
                const bookmarkLink = document.createElement('li');
                bookmarkLink.setAttribute("class", "file inactive");
        
                bookmarkLink.innerHTML = `
                <a target="_blank" href="${subElement.link}" class="file-title">
                    <span class="file-icon">🗋</span>
                    <span class="file-name">${subElement.name}</span>
                </a>`;

                parent.appendChild(bookmarkLink);
            }
        });
    }

    // Push bookmarks to the menu array and recurse to sort
    bookmarkTree.forEach(function(folder, i) {
        let folderObj = {name: folder.title, subitems: []};

        menu.push(folderObj);

        let subFolder = folder.children;

        recurseSort(subFolder, folderObj);
    });

    // Loop that renders the bookmark tree as nested unordered lists
    const bookmarkList = document.querySelector(".bookmark-list");

    menu.forEach(function(element, i) {
        const bookmarkMenu = document.createElement('li');
        bookmarkMenu.setAttribute("class", "folder");

        bookmarkMenu.innerHTML = `
        <a href="#" class="folder-title grow-on-hover">
            <span class="folder-icon">🗀</span>
            <span class="folder-name">${element.name}</span>
        </a>`;

        const subList = document.createElement('ul');
        const subListParent = document.createElement('div');
        subList.setAttribute('class', 'root inactive');

        subListParent.appendChild(subList)
        bookmarkMenu.appendChild(subListParent);
        bookmarkList.appendChild(bookmarkMenu);

        recurseRender(element, subList);
    });

    const masters = document.querySelectorAll(".folder-title");
    
    // Open and close root folders
    masters.forEach(function(master) {
        master.addEventListener("click", function () {
            const children = this.parentElement.childNodes[2].childNodes[0];
            const icon = this.childNodes[1];

            children.classList.toggle("inactive");

            if (icon.innerHTML == "🗀") {
                icon.innerHTML = "🗁";
            } else {
                icon.innerHTML = "🗀"
            }

            masters.forEach(function(otherMaster) {
                if (otherMaster != master) {
                    const children = otherMaster.parentElement.childNodes[2].childNodes[0];
                    const icon = otherMaster.childNodes[1];

                    children.classList.add("inactive");

                    icon.innerHTML = "🗀"
                }
            });
        });
    });

    const subFolders = document.querySelectorAll(".subfolder-title");
    
    // Open and close sub-folders
    subFolders.forEach(function (subFolder, i) {
        subFolder.addEventListener('click', function(event) {

            const children = this.parentElement.childNodes[2].childNodes[0];
            const icon = this.childNodes[1];

            const parentMenu = event.target.closest("ul");
            const activeSubmenu = parentMenu.querySelector(".subroot:not(.inactive)");

            if (activeSubmenu) {
                if (activeSubmenu != subFolder.nextElementSibling.firstElementChild) {
                    activeSubmenu.classList.add("inactive");
                    const activeSubMenuIcon = activeSubmenu.parentElement.parentElement.childNodes[1].childNodes[1];
                    activeSubMenuIcon.innerHTML = "🗀";
                }
            }
    
            children.classList.toggle("inactive");
    
            if (icon.innerHTML == "🗀") {
                icon.innerHTML = "🗁";
            } else {
                icon.innerHTML = "🗀";
            }
        });
    });


    // Close open bookmark tree on window click
    const masterTarget = '.bookmark-list';

    window.addEventListener('click', function (event) {
        masters.forEach(function(master) {
            if (!event.target.closest(masterTarget)) {
                const children = master.parentElement.childNodes[2].childNodes[0];
                const icon = master.childNodes[1];

                children.classList.add('inactive');
                icon.innerHTML = "🗀"
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // Define initial tab title variable
    let tabTitle = '⠀';

    // Fetch tab title from local storage
    tabTitle = localStorage.getItem('tabTitle');

    // Select tab title DOM element and tab title input
    const tabTitleEl = document.querySelector('.tab-title'),
          tabTitleInput = document.getElementById('title-input');

    // Set the input's value
    tabTitleInput.value = tabTitle;

    // Change tab title in real time on user input and save it to local storage
    tabTitleInput.addEventListener('input', function() {
        tabTitle = tabTitleInput.value;

        if (tabTitle == '') {
            tabTitle = '⠀';
            localStorage.setItem('tabTitle', '⠀');
            tabTitleEl.innerText = tabTitle;
        } else {
            localStorage.setItem('tabTitle', tabTitle);
            tabTitleEl.innerText = tabTitle;
        }
    });

    // Set the tab title DOM element's content on load
    tabTitleEl.innerText = tabTitle;

    // Define favicon image path and DOM element
    let faviconPath = '';
    const favicon = document.querySelector('.favicon');

    // Fetch favicon image path from local storage
    faviconPath = localStorage.getItem("faviconPath");

    // Replace img element src attribute
    favicon.href = faviconPath;

    doTreeStuff();

    // Open or close config popup on click of gear
    const gear = document.querySelector('.gear'),
          config = document.querySelector('.config-container');

    let configStatus = false;

    const background = document.querySelector('.bg')

    function toggleConfig() {
        config.classList.toggle('show');
        configStatus = !configStatus;

        if (configStatus) {
            background.classList.add('blur-effect');
        } else {
            background.classList.remove('blur-effect');
        }
    }

    // Toggle config window on click of gear
    gear.addEventListener('click', function(event) {
        event.stopPropagation();
        toggleConfig();
    });
    
    // Close config window on click of body
    document.body.addEventListener('click', function(event) {
        if (configStatus && !config.contains(event.target) && event.target !== gear) {
            toggleConfig();
        }
    });

    // Get favicon image file input element
    const faviconInput = document.getElementById('favicon-input');

    faviconInput.addEventListener('change', function() {
        // Get favicon image file object
        const faviconFile = faviconInput.files[0];

        // Get the file name
        const fileName = faviconFile.name;

        // Parse into path
        let path = './imgs/' + fileName;

        // Store the file name in local storage
        localStorage.setItem('faviconPath', path);

        // Replace img element src attribute
        favicon.href = path;
    })

    // Fetch shortcuts path from local storage and push to array
    storedShortcuts = localStorage.getItem("shortcuts");

    // Parse JSON
    const shortcuts = JSON.parse(storedShortcuts);

    // Fetch shortcut bar element
    const shortcutbar = document.querySelector(".shortcutbar");

    // Parse shortcuts from array into <a> elements and append to shortcut bar
    function parseShortcuts() {
        shortcuts.forEach(function(shortcut, i) {
            const newShortcut = document.createElement("a");

            newShortcut.classList.add("grow-on-hover", "shortcut");
            newShortcut.href = shortcut.url;
            newShortcut.target = "_blank"

            const logo = document.createElement("img");
            
            logo.classList.add("logo");
            logo.src = shortcut.logo;

            newShortcut.appendChild(logo);

            const shortcutContainer = document.createElement("div");
            shortcutContainer.classList.add("shortcut-container")

            const contextMenu = document.createElement("div");
            contextMenu.classList.add("context-menu");

            const contextMenuUl = document.createElement("ul");

            const editShortcut = document.createElement("li");
            const delShortcut = document.createElement("li");
            editShortcut.classList.add("btn", "btn-edit");
            delShortcut.classList.add("btn", "btn-del");
            editShortcut.textContent = "Edit";
            delShortcut.textContent = "Delete";

            contextMenuUl.appendChild(editShortcut);
            contextMenuUl.appendChild(delShortcut);

            contextMenu.appendChild(contextMenuUl);

            shortcutContainer.appendChild(contextMenu);

            const editContainer = document.createElement("div");
            editContainer.classList.add('edit-container', 'edit-' + i)
            const editDiv = document.createElement("div");
            editDiv.classList.add("edit", "flex-c", "f-just-cent");
            const nameInput = document.createElement("input");
            nameInput.classList.add('fillable');
            nameInput.type = "text";
            nameInput.id = "name-input-" + i;
            nameInput.placeholder = "name";
            const urlInput = document.createElement("input");
            urlInput.classList.add('fillable');
            urlInput.type = "text";
            urlInput.id = "url-input-" + i;
            urlInput.placeholder = "URL";
            const iconInput = document.createElement("input");
            iconInput.type = "file";
            iconInput.id = "icon-input-" + i;
            iconInput.hidden = true;
            const iconLabel = document.createElement("label");
            iconLabel.classList.add("icon-btn", "btn");
            iconLabel.setAttribute("for", "icon-input-" + i);
            iconLabel.innerText = "Change Icon";
            const submitBtn = document.createElement("button");
            submitBtn.classList.add("btn", "shortcut-submit-" + i);
            submitBtn.innerHTML = "Done";

            editDiv.appendChild(nameInput);
            editDiv.appendChild(urlInput);
            editDiv.appendChild(iconInput);
            editDiv.appendChild(iconLabel);
            editDiv.appendChild(submitBtn);
            editContainer.appendChild(editDiv);

            shortcutContainer.appendChild(newShortcut);
            shortcutContainer.appendChild(editContainer);
            shortcutbar.appendChild(shortcutContainer);

            // Right-click event listener to show context menu
            newShortcut.addEventListener("contextmenu", function(event) {
                event.preventDefault();

                // Hide any other open context menus
                document.querySelectorAll('.context-menu').forEach(function(menu) {
                    if (menu !== contextMenu) {
                        menu.style.visibility = "hidden";
                        menu.style.opacity = "0";
                    }
                });

                // Show context menu
                contextMenu.style.visibility = "visible";
                contextMenu.style.opacity = "1";
            });

            // Close context menu on left or right outside click
            document.addEventListener("mousedown", function(clickEvent) {
                if (!contextMenu.contains(clickEvent.target)) {
                    contextMenu.style.visibility = "hidden";
                    contextMenu.style.opacity = "0";
                }
            });
        });

        shortcutContext();
    }

    parseShortcuts();

    function shortcutContext() {
        // Select the context menu of each shortcut
        const domShortcuts = document.querySelectorAll('.shortcut');

        // For each context menu, perform its button's actions
        domShortcuts.forEach(function(domShortcut, i) {
            const contextMenu = domShortcut.previousElementSibling;
            const edit = domShortcut.nextElementSibling;
            const editMenu = edit.childNodes[0];
            const menuList = contextMenu.firstChild;
            const nameInput = editMenu.childNodes[0];
            const urlInput = editMenu.childNodes[1];
            const editBtn = menuList.childNodes[0];
            const delBtn = menuList.childNodes[1];
            const iconBtn = menuList.childNodes[2];
            
            let editStatus = false;

            function toggleEdit() {
                if (editStatus) {
                    edit.classList.toggle('show');
                    editStatus = !editStatus;

                    background.classList.remove('blur-effect');
                } else {
                    edit.classList.toggle('show');
                    editStatus = !editStatus;

                    background.classList.add('blur-effect');

                    // Populate input values
                    nameInput.value = shortcuts[i].name;
                    urlInput.value = shortcuts[i].url;
                }
            }

            editBtn.addEventListener('click', function() {
                toggleEdit();
            });

            // Toggle edit window on click of config gear
            gear.addEventListener('click', function(event) {
                event.stopPropagation();
                if (editStatus) {
                    toggleEdit();
                }
            });

            // Close edit window on click of body
            document.body.addEventListener('mousedown', function(event) {
                if (editStatus && !edit.contains(event.target) && event.target !== editBtn) {
                    toggleEdit();
                }
            });

            let nameString = shortcuts[i].name;
            let urlString = shortcuts[i].url;

            // Fetch input values
            nameInput.addEventListener('input', function() {
                nameString = nameInput.value;
            });

            urlInput.addEventListener('input', function() {
                urlString = urlInput.value;
            });

            const editSubmit = document.querySelector(".shortcut-submit-" + i);

            editSubmit.addEventListener('click', function() {
                shortcuts[i].name = nameString;
                shortcuts[i].url = urlString;

                localStorage.setItem('shortcuts', JSON.stringify(shortcuts));

                shortcutbar.innerHTML = "";

                parseShortcuts();
            });

            // Get icon file input element
            const iconInput = document.getElementById("icon-input-" + i);

            iconInput.addEventListener('change', function() {
                // Get icon image file object
                const iconFile = iconInput.files[0];

                // Get the file name
                const fileName = iconFile.name;

                // Parse into path
                let path = './imgs/logos/' + fileName;

                shortcuts[i].logo = path;

                localStorage.setItem('shortcuts', JSON.stringify(shortcuts));

                shortcutbar.innerHTML = "";

                parseShortcuts();
            })
        
            delBtn.addEventListener('click', function() {
                shortcuts.splice(i, 1);

                localStorage.setItem('shortcuts', JSON.stringify(shortcuts));

                shortcutbar.innerHTML = "";

                parseShortcuts();
            });
        });
    }

    // Get new shortcut element
    const shortcutInput = document.querySelector('.shortcut-new');

    shortcutInput.addEventListener('click', function() {
        toggleConfig();

        const newShortcut = document.querySelector('.new-container');
        const newMenu = document.querySelector('.new');
        const nameInput = document.getElementById('new-name-input');
        const urlInput = document.getElementById('new-url-input');
        const iconInput = document.getElementById('new-icon-input');
        const newSubmit = document.querySelector('.new-shortcut-submit');
        
        let newStatus = false;

        function toggleNew() {
            if (newStatus) {
                newShortcut.classList.toggle('show');
                newStatus = !newStatus;

                background.classList.remove('blur-effect');
            } else {
                newShortcut.classList.toggle('show');
                newStatus = !newStatus;

                background.classList.add('blur-effect');
            }
        }

        toggleNew();

        // Toggle new window on click of config gear
        gear.addEventListener('click', function(event) {
            event.stopPropagation();
            if (newStatus) {
                toggleNew();
            }
        });

        // Close new window on click of body
        document.body.addEventListener('mousedown', function(event) {
            if (newStatus && !newShortcut.contains(event.target) && event.target !== shortcutInput) {
                toggleNew();
            }
        });

        let nameString = '';
        let urlString = '';
        let iconPath = '';

        // Fetch input values
        nameInput.addEventListener('input', function() {
            nameString = nameInput.value;
        });

        urlInput.addEventListener('input', function() {
            urlString = urlInput.value;
        });

        // Define the event listener function
        const submitHandler = function(event) {
            event.preventDefault();
            toggleNew();
            const iconFile = iconInput.files[0];
            let fileName = ''
            if (iconFile) {
                fileName = iconFile.name;
            }
            iconPath = './imgs/logos/' + fileName;

            shortcuts.push({
                name: nameString,
                url: urlString,
                logo: iconPath
            })

            localStorage.setItem('shortcuts', JSON.stringify(shortcuts));

            shortcutbar.innerHTML = "";

            parseShortcuts();

            newMenu.reset();
            nameString = '';
            urlString = '';
            iconPath = '';
            newSubmit.removeEventListener('click', submitHandler);
        };

        // Add the event listener
        newSubmit.addEventListener('click', submitHandler);
    });
});