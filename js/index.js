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
    doTreeStuff();

    // Define shortcut array
    const shortcuts = [
        whatsapp = {
            url: "https://web.whatsapp.com/",
            logo: "./imgs/logos/wpp.png"
        },
        reddit = {
            url: "https://www.reddit.com/",
            logo: "./imgs/logos/reddit.png"
        },
        youtube = {
            url: "https://www.youtube.com/feed/subscriptions",
            logo: "./imgs/logos/yt.png"
        },
        gmail = {
            url: "https://mail.google.com/mail/u/0/",
            logo: "./imgs/logos/gmail.png"
        },
        dgg = {
            url: "https://www.destiny.gg/bigscreen",
            logo: "./imgs/logos/dgg.png"
        },
        fourchan = {
            url: "https://www.4chan.org/",
            logo: "./imgs/logos/4chan.png"
        },
        x = {
            url: "https://twitter.com/home",
            logo: "./imgs/logos/x.png"
        },
        instagram = {
            url: "https://www.instagram.com/",
            logo: "./imgs/logos/insta.png"
        },
        jpopsuki = {
            url: "https://jpopsuki.eu/",
            logo: "./imgs/logos/jps.png"
        },
        facebook = {
            url: "https://www.facebook.com/",
            logo: "./imgs/logos/fb.png"
        },
        mp = {
            url: "https://www.mercadopago.com.ar/home",
            logo: "./imgs/logos/mp.png"
        },
        ml = {
            url: "https://www.mercadolibre.com.ar",
            logo: "./imgs/logos/ml.png"
        },
        subsplease = {
            url: "https://web.whatsapp.com/",
            logo: "./imgs/logos/subsplease.png"
        },
    ]

    // Fetch shortcut bar element
    const shortcutbar = document.querySelector(".shortcutbar");

    // Parse shortcuts from array into <a> elements and append to shortcut bar
    shortcuts.forEach(function(shortcut) {
        const newShortcut = document.createElement("a");

        newShortcut.classList.add("grow-on-hover");
        newShortcut.href = shortcut.url;
        newShortcut.target = "_blank"

        const logo = document.createElement("img");
        
        logo.classList.add("logo");
        logo.src = shortcut.logo;

        newShortcut.appendChild(logo);

        shortcutbar.appendChild(newShortcut);
    });

    // Fetch background image
    const background = document.querySelector(".bg");

    // Apply filters to background image on interaction with searchbar
    document.querySelector('.fillable').addEventListener('mouseenter', function() {
        background.classList.add('dark-effect');
    });

    document.querySelector('.fillable').addEventListener('focus', function() {
        background.classList.add('blur-effect');
    });

    document.querySelector('.fillable').addEventListener('blur', function() {
        background.classList.remove('blur-effect');
    });

    document.querySelector('.fillable').addEventListener('mouseleave', function() {
        background.classList.remove('dark-effect');
    });
});