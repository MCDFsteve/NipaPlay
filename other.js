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
        element.innerHTML = `NipaPlay.Ver${nipaplayVersion}<br>咪啪～☆<br>作者：戴夫邻居史蒂夫 ©️copyright2024 Aimes Soft.<br>项目地址：<br> <a href="https://github.com/MCDFsteve/NipaPlay" class="normal-link">https://github.com/MCDFsteve/NipaPlay</a>`;
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
ipcRenderer.on('video-url', (event, videoUrl) => {
    ipcRenderer.send('open-video-file', videoUrl); // 将视频链接传到main.js处理
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
document.getElementById('internet-library').addEventListener('click', () => {
    ipcRenderer.send('open-url-window');
});
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
document.addEventListener('DOMContentLoaded', function () {
    loadNewSeries();
});

function loadNewSeries() {
    fetch('https://api.dandanplay.net/api/v2/bangumi/shin?filterAdultContent=false')
        .then(response => response.json())
        .then(data => {
            const bangumiList = data.bangumiList;
            const daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

            // 按 airDay 排序
            bangumiList.sort((a, b) => a.airDay - b.airDay);

            // 获取当前的星期几
            const today = new Date().getDay();

            // 重新排序 daysOfWeek 数组，使今天排在最前面
            const reorderedDays = daysOfWeek.slice(today).concat(daysOfWeek.slice(0, today));

            // 创建按天分组的 HTML 内容
            const content = reorderedDays.map((day, index) => {
                const realIndex = (today + index) % 7;
                const dayItems = bangumiList.filter(item => item.airDay === realIndex);

                if (dayItems.length === 0) {
                    return '';
                }

                const itemsHtml = dayItems.map(item => `
                    <div class="anime-item" data-anime-id="${item.animeId}">
                        <div class="anime-image">
                            <img src="${item.imageUrl}" alt="${item.animeTitle}">
                        </div>
                        <p class="anime-title">${item.animeTitle}</p>
                    </div>
                `).join('');

                return `
                    <div class="day-section">
                        <h2>${day}</h2>
                        <hr class="section-divider">
                        <div class="anime-list">
                            ${itemsHtml}
                        </div>
                        <hr class="section-divider"> <!-- 添加分割线 -->
                    </div>
                `;
            }).join('');

            // 将内容插入到页面中
            document.getElementById('new-series-container').innerHTML = content;

            // 为每个 anime-item 添加点击事件
            document.querySelectorAll('.anime-item').forEach(item => {
                item.addEventListener('click', function() {
                    const animeId = this.getAttribute('data-anime-id');
                    fetchAnimeDetail(animeId);
                });
            });
        })
        .catch(error => console.error('Error fetching bangumi data:', error));
}

// 获取动画详细信息并显示
function fetchAnimeDetail(animeId) {
    fetch(`https://api.dandanplay.net/api/v2/bangumi/${animeId}`)
        .then(response => response.json())
        .then(data => {
            displayAnimeDetail(data.bangumi);
        })
        .catch(error => console.error('Error fetching anime detail:', error));
}

function displayAnimeDetail(bangumi) {
    const detailContent = `
    <div id="anime-lib">
    <button id="return-anime-library" class="folder-item" onclick="returnToanime()">返回新番界面</button>
    <div class="anime-deta">
        <h2>${bangumi.titles.find(title => title.language === '主标题').title}</h2>
        </div>
        <hr class="section-divider">
        <p>${bangumi.typeDescription}</p>
        <div class="anime-detail-container">
            <div class="anime-detail-image">
                <img src="${bangumi.relateds[0].imageUrl}" alt="${bangumi.titles.find(title => title.language === '主标题').title}">
            </div>
            <div class="anime-detail-text">
                <p class="anime-summary">${bangumi.summary}</p>
            </div>
        </div>
        <hr class="section-divider">
            <p><strong>评分:</strong></p>
            <ul class="anime-summary">
                ${Object.entries(bangumi.ratingDetails).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}
            </ul>
            <hr class="section-divider">
            <p><strong>相关作品:</strong></p>
            <ul class="anime-summary">
            ${bangumi.relateds.map(related => `<li class="related-anime-item" data-anime-id="${related.animeId}">${related.animeTitle}</li>`).join('')}
            </ul>
            <hr class="section-divider">
            <p><strong>标签:</strong></p>
            <ul class="anime-summary2">
                ${bangumi.tags.map(tag => `<li>${tag.name}</li>`).join('')}
            </ul>
        <hr class="section-divider">
        <div class="anime-detail-info">
            <p><strong>放送信息:</strong></p>
            <ul class="anime-summary">
                ${bangumi.metadata.map(info => `<li>${info}</li>`).join('')}
            </ul>
        </div>
        </div>
    `;

    document.getElementById('anime-detail-content').innerHTML = detailContent;
    document.getElementById('new-series-container').style.display = 'none';
    document.getElementById('anime-detail-content').style.display = 'block';
    // 滚动到顶部

    // 为每个 related-anime-item 添加点击事件
    document.querySelectorAll('.related-anime-item').forEach(item => {
        item.addEventListener('click', function() {
            const relatedAnimeId = this.getAttribute('data-anime-id');
            fetchAnimeDetail(relatedAnimeId);
        });
    });
}

// 回到新番更新界面
function returnToNewSeries() {
    console.log('returnToNewSeries');
    document.getElementById('anime-detail-content').style.display = 'none';
    document.getElementById('new-series-container').style.display = 'block';
    loadNewSeries();  // 重新加载新番更新内容
}
function returnToanime() {
    console.log('return-anime-library');
    document.getElementById('anime-detail-content').style.display = 'none';
    document.getElementById('new-series-container').style.display = 'block';
    loadNewSeries();  // 重新加载新番更新内容
};
function isMacOS() {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}
if (isMacOS()) {
    console.log('mac');
} else {
    const closeButton = document.getElementById('close-button');
    const miniButton = document.getElementById('minimize-button');
    closeButton.classList.add('close-button-other');
    closeButton.style.display = 'block';
    closeButton.addEventListener('click', () => {
        console.log('nipa');
        ipcRenderer.send('close-main-window');
    });
    miniButton.classList.add('minimize-button-other');
    miniButton.style.display = 'block';
    miniButton.addEventListener('click', () => {
        console.log('nipa');
        ipcRenderer.send('minimize-window');
    });
}