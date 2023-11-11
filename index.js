const bookmarkObj = [];
const menu = [];

async function doTreeStuff() {
    const bookmarkTrees = [];
    const tree = await chrome.bookmarks.getTree();
    bookmarkTrees.push(tree);
  
    bookmarkObj.push(bookmarkTrees[0][0].children[0].children);

    const bookmarkTree = (bookmarkObj[0]);

    // Function to recursively iterate through the bookmark array to sort it
    function recurse(folder) {
        folder.children.forEach(function(subItem, i) {
            if (subItem.children) {
                menu.push('SUBFOLDER ' + subItem.title);

                recurse(subItem);
            } else {
                if (i == folder.children.length - 1) {
                    menu.push('LAST-FILE ' + subItem.title);
                } else {
                    menu.push('FILE ' + subItem.title);
                }
            }
        });
    }

    // Push bookmarks to the menu array and recurse to sort
    bookmarkTree.forEach(function(folder, i) {
        menu.push('FOLDER ' + folder.title);
        
        recurse(folder);
    });

    // Separate bookmarks array at files containing the string "LAST"
    const
    separator = 'LAST-FILE',
    groups = menu.reduce((r, s, i, a) => {
        if (!i || a[i - 1].includes(separator)) r.push([]);
        r[r.length - 1].push(s);
        return r;
    }, []);

    // Regroup the bookmark array in its original folder structure
    let grouped = groups.reduce((a, b, index) =>
        !index || !/file|sub|last-file/i.test(b[0]) ? [...a, b] : (a[a.length -1].push(...b), a) , []);

    
    // Loop that renders the bookmark tree as folders by appending a template literal amount of HTML to the DOM
    const bookmarkList = document.querySelector(".bookmark-list");

    grouped.forEach(function(element, i) {

        const bookmarkMenu = document.createElement('li');
        bookmarkMenu.setAttribute("class", "folder-" + i);

        const re = /(file|folder|subfolder|last-file)/i;

        bookmarkMenu.innerHTML = `
        <a href="#" class="folder-title">
            <span class="file-icon">🗀</span>
            <span class="file-name">${element[0].replace(re, '')}</span>
        </a>
        <ul class="root root-${i}">
        ${element.map(subElement => subElement.includes('SUBFOLDER') ? 
            `<ul class="subfolder">
                <a href="#" class="folder-title">
                    <span class="file-icon">🗀</span>
                    <span class="file-name">${subElement.replace(re,'')}</span>
                </a>
            ` :
        subElement.includes('FILE') ?
            `<li class="${subElement}">${subElement.replace(re, '')}</li>` : ''
        ).join('')}</ul>
        `;

        bookmarkList.appendChild(bookmarkMenu);
    });

    const lastElements = document.querySelectorAll(".LAST-FILE");
    const repeatedEls = [];
    const uniqueEls = [];

    // Get all last bookmarks and push the ones followed by <li> elements to an array
    lastElements.forEach(function (lastElement, i) {
        if (lastElement.nextElementSibling != null) {
            const nextElement = lastElement.nextElementSibling;
            if (nextElement.tagName == 'LI') {
                repeatedEls.push(lastElement);
            }
        }
    });

    // Leave only one last bookmark per bookmark folder
    for (i = 0; i < repeatedEls.length; i++) {
        const current = repeatedEls[i];
        if (i > 0) {
            const previous = repeatedEls[i];
            if (current.closest('.root') == previous.closest('.root')) {
                uniqueEls.push(current);
            }
        }
    }

    // Select all <li> elements after the second to last <li> element with
    // the 'LAST-FILE' class and move them to the root <ul>
    for (i = 0; i < uniqueEls.length; i++) {
        const lastElement = uniqueEls[i];
        const root = lastElement.closest('.root');
        const parent = lastElement.parentElement;
        const siblings = parent.children;
        let lastFiles = [];

        for (const sibling of siblings) {
            if (sibling.classList.contains('LAST-FILE')) {
                lastFiles.push(sibling);
            }
        }

        const secondToLast = lastFiles[lastFiles.length - 2];

        const className = secondToLast.classList.value;
        console.log(className);

        const selector = '.' + className + ' ~ li';

        // const toMove = document.querySelectorAll(selector);
        // console.log(toMove);
    }
}

document.addEventListener("DOMContentLoaded", function() {

    doTreeStuff();

});