document.addEventListener('DOMContentLoaded', function () {
    const updatesContainer = document.querySelector('.updates-content');
    if (updatesContainer) {
        updatesContainer.innerHTML = updatesData.map(update => `
            <h4>
                ${update.version} (${update.date})
                更新内容：<br>${update.changes.map(change => `▪ ${change}`).join('<br>')}
            </h4>
        `).join('');
    }
});

const packageJson = require('./package.json'); // 确保路径正确
const nipaplayVersion = packageJson.version;
document.addEventListener('DOMContentLoaded', function () {
    // 更新所有需要显示版本号的元素
    document.getElementById('version-text').textContent = `ver${nipaplayVersion}`;
    document.querySelectorAll('.about-version').forEach(function (element) {
        element.innerHTML = `NipaPlay.Ver${nipaplayVersion}<br>咪啪～☆<br>作者戴夫邻居史蒂夫.<br>项目地址：<br> <a href="https://github.com/MCDFsteve/NipaPlay" class="normal-link">https://github.com/MCDFsteve/NipaPlay</a>`;
    });

});
// 导入 shell 模块，注意这行代码需要在 Electron 环境中运行
const { shell } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', function (event) {
        // 检查被点击的元素是否为超链接
        let target = event.target;
        while (target != null) {
            if (target.tagName === 'A' && target.href) {
                // 阻止默认的链接打开方式
                event.preventDefault();
                // 使用系统默认浏览器打开链接
                shell.openExternal(target.href);
                return;
            }
            target = target.parentElement;
        }
    }, true); // 使用捕获模式以确保在链接默认行为之前处理点击事件
});

const originalLog = console.log;
const path = require('path');
console.log = function (...args) {
    ipcRenderer.send('log-message', args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' '));
    originalLog.apply(console, args); // 保持渲染进程的控制台也可以输出日志
};
console.log('I\'m lain.2');
document.getElementById('import-media-library').addEventListener('click', () => {
    ipcRenderer.send('import-folder');
});
document.getElementById('return-media-library').addEventListener('click', () => {
    const mediaLibraryContent = document.getElementById('folder-list');
    mediaLibraryContent.style.display = 'block';
    const videoList = document.getElementById('video-list');
    videoList.style.display = 'none';
    const returnList = document.getElementById('return-media-library');
    // 设置透明度为50%
    returnList.style.opacity = '0.5';
    // 禁止鼠标事件
    returnList.style.pointerEvents = 'none';
    // 设置鼠标样式为默认
    returnList.style.cursor = 'default';
});
// 渲染进程
ipcRenderer.send('load-config');
ipcRenderer.on('config-updated', () => {
    updateMediaLibraryFromConfig();
});

function updateMediaLibraryFromConfig() {
    ipcRenderer.send('load-config');
}
ipcRenderer.on('config-loaded', (event, selectedFolders) => {
    if (selectedFolders && Array.isArray(selectedFolders)) {
        console.log('Loaded folders:', selectedFolders);
        updateMediaLibrary(selectedFolders);
    } else {
        console.log('No folders loaded or the data format is incorrect');
    }
});

function updateMediaLibrary(folders) {
    const library = document.getElementById('folder-list');
    library.innerHTML = ''; // 清空现有列表，避免重复添加
    folders.forEach(folderPath => {
        const item = document.createElement('li');
        item.className = 'sidebar-button';
        item.textContent = path.basename(folderPath); // 设置按钮显示的文本为文件夹名
        item.dataset.path = folderPath; // 将文件夹路径存储在元素上，以便后续使用
        item.onclick = () => loadFolderContents(folderPath); // 点击时加载该文件夹内容
        item.style.cursor = 'pointer'; // 设置鼠标为指针形状
        item.style.position = 'relative'; // 设置相对定位
        item.onclick = () => {
            console.log('Folder clicked:', folderPath); // 打印被点击的文件夹路径
            ipcRenderer.send('load-folder-contents', (folderPath));
        };
        const deleteIcon = document.createElement('img');
        deleteIcon.src = './icons/delete.png'; // 设置图标路径
        deleteIcon.className = 'delete-icon'; // 添加类名
        deleteIcon.style.cssText = `width: 1em; height: 1em; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); display: none; cursor: pointer;`;
        deleteIcon.onclick = function () {
            event.stopPropagation(); // 阻止事件冒泡
            ipcRenderer.send('remove-folder', folderPath);
        };
        item.appendChild(deleteIcon);
        item.onmouseenter = function () {
            deleteIcon.style.display = 'block'; // 鼠标移入时显示图标
        };

        item.onmouseleave = function () {
            deleteIcon.style.display = 'none'; // 鼠标移出时隐藏图标
        };
        library.appendChild(item);
    });
}
ipcRenderer.on('folder-contents-loaded', (event, files) => {
    // 清除媒体库中的现有内容
    const mediaLibraryContent = document.getElementById('folder-list');
    mediaLibraryContent.style.display = 'none';
    const videoList = document.getElementById('video-list');
    videoList.innerHTML = '';
    videoList.style.display = 'block';
    const returnList = document.getElementById('return-media-library');
    // 恢复透明度为100%
    returnList.style.opacity = '1';
    // 恢复鼠标事件
    returnList.style.pointerEvents = 'auto';
    // 恢复鼠标样式为指针
    returnList.style.cursor = 'pointer';

    files.forEach(file => {
        const videoItem = document.createElement('li');
        videoItem.className = 'sidebar-button';
        videoItem.textContent = path.basename(file);
        videoItem.onclick = () => playVideo(file);
        videoList.appendChild(videoItem);
    });
    const existingList = document.getElementById('video-list');
    if (existingList) mediaLibraryContent.removeChild(existingList);
    mediaLibraryContent.appendChild(videoList);
});

function playVideo(filePath) {
    console.log('Playing video:', filePath);
    // 可以在这里调用播放视频的逻辑或发送IPC消息到主进程打开视频播放窗口
    ipcRenderer.send('open-video-file', filePath);
}

document.querySelectorAll('.sidebar button').forEach(btn => {
    btn.addEventListener('click', function () {
        // 移除所有按钮的'active'类
        document.querySelectorAll('.sidebar button').forEach(button => {
            button.classList.remove('active');
        });
        // 给当前点击的按钮添加'active'类
        this.classList.add('active');
        // 显示对应的内容区
        const contentId = this.id + '-content';
        document.querySelectorAll('.content-page').forEach(page => {
            page.style.display = 'none';
        });
        const activeContent = document.getElementById(contentId);
        if (activeContent) {
            activeContent.style.display = 'block';
        }
    });
});

function changeContent(content) {
    const buttons = document.querySelectorAll('.sidebar button');
    buttons.forEach(button => button.classList.remove('active'));
    document.getElementById(content + '-video').classList.add('active');

    // Hide all content divs
    const contents = document.querySelectorAll('.content > button');
    contents.forEach(content => content.classList.remove('active'));

    // Show the selected content div
    document.getElementById(content + '-content').classList.add('active');
}