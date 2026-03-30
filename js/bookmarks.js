const bookmarkList = document.querySelector('.bookmark-list');

function buildFolder(node, isRoot) {
    const li = document.createElement('li');
    li.className = isRoot ? 'folder' : 'subfolder';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = isRoot ? 'folder-title grow-on-hover' : 'subfolder-title';

    const icon = document.createElement('span');
    icon.className = isRoot ? 'folder-icon' : 'subfolder-icon';
    icon.textContent = '🗀';

    const name = document.createElement('span');
    name.className = isRoot ? 'folder-name' : 'subfolder-name';
    name.textContent = node.title;

    toggle.append(icon, name);
    li.appendChild(toggle);

    const wrapper = document.createElement('div');
    const subList = document.createElement('ul');
    subList.className = (isRoot ? 'root' : 'subroot') + ' closed';

    for (const child of node.children) {
        subList.appendChild(child.children ? buildFolder(child, false) : buildFile(child));
    }

    wrapper.appendChild(subList);
    li.appendChild(wrapper);
    return li;
}

function buildFile(node) {
    const li = document.createElement('li');
    li.className = 'file';

    const link = document.createElement('a');
    link.href = node.url || '';
    link.target = '_blank';
    link.className = 'file-title';

    const icon = document.createElement('span');
    icon.className = 'file-icon';
    icon.textContent = '🗋';

    const name = document.createElement('span');
    name.className = 'file-name';
    name.textContent = node.title;

    link.append(icon, name);
    li.appendChild(link);
    return li;
}

function closeFolderTree(li) {
    const subList = li.querySelector(':scope > div > ul');
    if (!subList) return;

    subList.classList.add('closed');

    const icon = li.querySelector(':scope > button > .folder-icon, :scope > button > .subfolder-icon');
    if (icon) icon.textContent = '🗀';

    for (const nested of subList.querySelectorAll('.subfolder')) {
        closeFolderTree(nested);
    }
}

function openFolder(li) {
    const subList = li.querySelector(':scope > div > ul');
    if (!subList) return;

    subList.classList.remove('closed');

    const icon = li.querySelector(':scope > button > .folder-icon, :scope > button > .subfolder-icon');
    if (icon) icon.textContent = '🗁';
}

function isFolderOpen(li) {
    const subList = li.querySelector(':scope > div > ul');
    return subList && !subList.classList.contains('closed');
}

// Single delegated click handler for all folder toggles
bookmarkList.addEventListener('click', (e) => {
    const toggle = e.target.closest('.folder-title, .subfolder-title');
    if (!toggle) return;

    const li = toggle.parentElement;
    const isRoot = toggle.classList.contains('folder-title');

    // Close siblings at the same level
    const siblings = isRoot
        ? bookmarkList.querySelectorAll(':scope > .folder')
        : li.parentElement.querySelectorAll(':scope > .subfolder');

    for (const sibling of siblings) {
        if (sibling !== li) closeFolderTree(sibling);
    }

    // Toggle clicked folder
    if (isFolderOpen(li)) closeFolderTree(li);
    else openFolder(li);
});

// Close all folders on outside click
window.addEventListener('click', (e) => {
    if (!e.target.closest('.bookmark-list')) {
        for (const folder of bookmarkList.querySelectorAll(':scope > .folder')) {
            closeFolderTree(folder);
        }
    }
});

export async function initBookmarks() {
    const tree = await chrome.bookmarks.getTree();
    const bookmarkBar = tree[0].children[0].children;

    for (const node of bookmarkBar) {
        bookmarkList.appendChild(
            node.children ? buildFolder(node, true) : buildFile(node)
        );
    }
}
