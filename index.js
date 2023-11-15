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

    // Function to recursively iterate through the bookmark menu render it
    function recurseRender(element, parent) {
        element.subitems.forEach(function(subElement) {
            if (subElement.subitems) {
                const bookmarkSubMenu = document.createElement('li');
                bookmarkSubMenu.setAttribute("class", "subfolder inactive");
        
                bookmarkSubMenu.innerHTML = `
                <a href="#" class="subfolder-title">
                    <span class="subfolder-icon">🗀</span>
                    <span class="subfolder-name">${subElement.name}</span>
                </a>`;

                const subSubList = document.createElement('ul');
                subSubList.setAttribute('class', 'subroot inactive')
        
                bookmarkSubMenu.appendChild(subSubList);

                parent.appendChild(bookmarkSubMenu);

                recurseRender(subElement, subSubList);
            } else {
                const bookmarkLink = document.createElement('li');
                bookmarkLink.setAttribute("class", "file inactive");
        
                bookmarkLink.innerHTML = `
                <a target="_blank" href="${subElement.link}" class="file-title">
                    <span class="file-icon"></span>
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

        recurseSort(subFolder, folderObj)
    });

    // Loop that renders the bookmark tree as nested unordered lists
    const bookmarkList = document.querySelector(".bookmark-list");

    menu.forEach(function(element, i) {
        const bookmarkMenu = document.createElement('li');
        bookmarkMenu.setAttribute("class", "folder");

        bookmarkMenu.innerHTML = `
        <a href="#" id="${'master-' + i}" class="folder-title">
            <span class="folder-icon">🗀</span>
            <span class="folder-name">${element.name}</span>
        </a>`;

        const subList = document.createElement('ul');
        subList.setAttribute('class', 'root inactive');

        bookmarkMenu.appendChild(subList);

        bookmarkList.appendChild(bookmarkMenu);

        recurseRender(element, subList);
    });

    const masters = document.querySelectorAll(".folder-title");
    
    // Open and close root folders
    masters.forEach(function(master, i) {
        master.addEventListener("click", function () {
            const children = this.parentElement.childNodes[2];
            const icon = this.childNodes[1];

            children.classList.toggle("inactive");

            if (icon.innerHTML == "🗀") {
                icon.innerHTML = "🗁";
            } else {
                icon.innerHTML = "🗀"
            }

            masters.forEach(function(otherMaster) {
                if (otherMaster != master) {
                    const children = otherMaster.parentElement.childNodes[2];
                    const icon = otherMaster.childNodes[1];

                    children.classList.add("inactive");

                    icon.innerHTML = "🗀"
                }
            });
        });
    });

    const folders = document.querySelectorAll(".subfolder-title");

    // Open and close sub-folders
    for (let i = 0; i < folders.length; i++) {
        folders[i].addEventListener("click", function () {
            const children = this.parentElement.childNodes[2];
            const icon = this.childNodes[1];

            children.classList.toggle("inactive");

            if (icon.innerHTML == "🗀") {
                icon.innerHTML = "🗁";
            } else {
                icon.innerHTML = "🗀"
            }
        });
    }

    // Close open bookmark tree on window click
    const masterTarget = '.folder-title'

    window.addEventListener('click', function (event) {
        masters.forEach(function(master) {
            if (!event.target.closest(masterTarget)) {
                const children = master.parentElement.childNodes[2];
                const icon = master.childNodes[1];

                children.classList.add('inactive');
                icon.innerHTML = "🗀"
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    doTreeStuff();
});