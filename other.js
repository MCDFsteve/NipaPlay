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
const originalLog = console.log;
const path = require('path');
console.log = function (...args) {
    ipcRenderer.send('log-message', args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' '));
    originalLog.apply(console, args); // 保持渲染进程的控制台也可以输出日志
};
const packageJson = require('./package.json'); // 确保路径正确
const nipaplayVersion = packageJson.version;
document.addEventListener('DOMContentLoaded', function () {
    // 更新所有需要显示版本号的元素
    document.getElementById('version-text').textContent = `ver${nipaplayVersion}`;
    document.querySelectorAll('.about-version').forEach(function (element) {
        element.innerHTML = `NipaPlay.Ver${nipaplayVersion}<br>咪啪～☆<br>作者：戴夫邻居史蒂夫 ©️copyright2024-2025 Aimes Soft.<br>项目地址：<br> <a href="https://github.com/MCDFsteve/NipaPlay" class="normal-link">https://github.com/MCDFsteve/NipaPlay</a>`;
    });
});
// 导入 shell 模块，注意这行代码需要在 Electron 环境中运行
const { shell } = require('electron');
document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on('login-success', (event, loginuserName) => {
        userName = loginuserName;
        console.log('登录成功:', userName);
        document.getElementById('login-button').style.display = 'none';
        document.getElementById('logining').textContent = `登录账号:${userName}`;
        document.getElementById('logining').style.display = 'block';
        document.getElementById('login-out-button').style.display = 'block';
        // 使用 setTimeout 延迟执行关闭窗口的操作
        setTimeout(() => {
            ipcRenderer.send('close-login-window');
        }, 500); // 延迟 500 毫秒
    });
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
//console.log('I\'m lain.2');
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
        updateMediaLibrary(selectedFolders);
    } else {
        //console.log('No folders loaded or the data format is incorrect');
    }
});

function updateMediaLibrary(folders) {
    console.log('Loading media library:', folders);
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
            //console.log('Folder clicked:', folderPath); // 打印被点击的文件夹路径
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
    //console.log('Playing video:', filePath);
    // 可以在这里调用播放视频的逻辑或发送IPC消息到主进程打开视频播放窗口
    ipcRenderer.send('open-video-file', filePath);
}
document.getElementById('internet-library').addEventListener('click', () => {
    ipcRenderer.send('open-url-window');
});
document.getElementById('login-button').addEventListener('click', () => {
    ipcRenderer.send('login-dandanplay');
});
document.getElementById('login-out-button').addEventListener('click', () => {
    ipcRenderer.send('login-out-dandanplay');
    document.getElementById('logining').style.display = 'none';
    document.getElementById('login-out-button').style.display = 'none';
    document.getElementById('login-button').style.display = 'block';
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
// 使用 Bangumi API 获取每日放送信息
function loadNewSeries() {
    fetch('https://api.bgm.tv/calendar') // 调用 Bangumi 的日历 API
        .then(response => response.json())
        .then(data => {
            // Bangumi API 返回的是按星期几分组的数组，每个元素代表一天
            const daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

            // 获取当前的星期几
            const today = new Date().getDay();

            // 重新排序 daysOfWeek 数组，使今天排在最前面
            const reorderedDays = daysOfWeek.slice(today).concat(daysOfWeek.slice(0, today));

            // 根据 Bangumi API 数据创建按天分组的 HTML 内容
            const content = reorderedDays.map((day, index) => {
                // 找到与今天对应的 Bangumi 数据
                const currentDayData = data.find(dayData => {
                    // 获取 Bangumi API 中的 weekday.id，1 为星期一，依次类推
                    return (dayData.weekday.id - 1) === (today + index) % 7;
                });

                // 如果该天没有数据则跳过
                if (!currentDayData || !currentDayData.items || currentDayData.items.length === 0) {
                    return '';
                }

                // 每天的番剧列表
                const dayItems = currentDayData.items;

                const itemsHtml = dayItems.map(item => {
                    // 如果没有图片，则使用默认图片
                    const imageUrl = item.images?.large || 'icons/default.png';
                    return `
                        <div class="anime-item" data-anime-id="${item.id}">
                            <div class="anime-image">
                                <img src="${imageUrl}" alt="${item.name_cn || item.name}">
                            </div>
                            <p class="anime-title">${item.name_cn || item.name}</p>
                        </div>
                    `;
                }).join('');

                return `
                    <div class="day-section">
                        <h2>${day}</h2>
                        <hr class="section-divider">
                        <div class="anime-list">
                            ${itemsHtml}
                        </div>
                        <hr class="section-divider">
                    </div>
                `;
            }).join('');

            // 将内容插入到页面中
            document.getElementById('new-series-container').innerHTML = content;

            // 为每个 anime-item 添加点击事件
            document.querySelectorAll('.anime-item').forEach(item => {
                item.addEventListener('click', function () {
                    const animeId = this.getAttribute('data-anime-id');
                    fetchAnimeDetail(animeId);
                });
            });
        })
        .catch(error => console.error('Error fetching bangumi data:', error));
}

function fetchAnimeDetail(animeId) {
    fetch(`https://api.bgm.tv/v0/subjects/${animeId}`) // 使用 Bangumi API 获取动画详情
        .then(response => response.json())
        .then(data => {
            displayAnimeDetail(data); // 调用 displayAnimeDetail 函数显示动画详情
        })
        .catch(error => console.error('Error fetching anime detail:', error));
}
function displayAnimeDetail(bangumi) {
    const summaryText = bangumi.summary || '暂无简介';

    // 获取 animeId
    const animeId = bangumi.id;

    // 先显示加载中的提示
    document.getElementById('anime-detail-content').innerHTML = `
        <div id="anime-lib">
            <p>加载中...</p>
        </div>
    `;

    // 检查 localStorage 中是否有缓存的翻译
    const cachedTranslation = localStorage.getItem(`anime_${animeId}_translation`);

    if (cachedTranslation) {
        // 如果有缓存的翻译，直接使用它来显示详细信息
        renderAnimeDetail(bangumi, cachedTranslation + '（翻译：ChatGPT4omini）');
    } else if (summaryText === '暂无简介') {
        // 如果是 "暂无简介"，则不需要翻译，直接显示
        renderAnimeDetail(bangumi, summaryText);
    } else {
        // 否则，发送请求进行翻译
        translateToChinese(summaryText).then(translatedSummary => {
            // 保存翻译结果到 localStorage
            localStorage.setItem(`anime_${animeId}_translation`, translatedSummary);

            // 使用翻译后的内容显示详细信息
            renderAnimeDetail(bangumi, translatedSummary + '（翻译：ChatGPT4omini）');
        }).catch(error => {
            console.error('翻译简介时发生错误:', error);
            // 如果翻译失败，显示原始简介
            renderAnimeDetail(bangumi, summaryText);
        });
    }
}

// 渲染番剧详细信息的函数
function renderAnimeDetail(bangumi, translatedSummary) {
    const detailContent = `
        <div id="anime-lib">
            <button id="return-anime-library" class="folder-item" onclick="returnToanime()">返回新番界面</button>
            <div class="anime-deta">
                <h2>${bangumi.name_cn || bangumi.name}</h2>
            </div>
            <hr class="section-divider">
            <div class="anime-detail-container">
                <div class="anime-detail-image">
                    <img src="${bangumi.images?.large || 'icons/default.png'}" alt="${bangumi.name_cn || bangumi.name}">
                </div>
                <div class="anime-detail-text">
                    <p class="anime-summary">${translatedSummary}</p>
                </div>
            </div>
            <hr class="section-divider">
            <p><strong>评分:</strong> ${bangumi.rating?.score || '暂无评分'}</p>
            <hr class="section-divider">
            <p><strong>相关信息:</strong></p>
            <ul class="anime-summary">
                <li><strong>放送日期:</strong> ${bangumi.date || '未知'}</li>
                <li><strong>平台:</strong> ${bangumi.platform || '未知'}</li>
            </ul>
            <hr class="section-divider">
            <p><strong>制作人员:</strong></p>
            <ul class="anime-summary">
                ${bangumi.infobox?.map(info => {
        if (info.key !== "中文名" && info.key !== "别名" && info.key !== "话数" && info.key !== "放送开始") {
            return `<li><strong>${info.key}:</strong> ${Array.isArray(info.value) ? info.value.map(v => v.v || v).join(", ") : info.value}</li>`;
        }
        return '';
    }).join('') || '<li>暂无制作人员信息</li>'}
            </ul>
            <hr class="section-divider">
            <p><strong>标签:</strong></p>
            <ul class="anime-summary2">
                ${bangumi.tags?.map(tag => `<li>${tag.name}</li>`).join('') || '无标签'}
            </ul>
        </div>
    `;

    document.getElementById('anime-detail-content').innerHTML = detailContent;
    document.getElementById('new-series-container').style.display = 'none';
    document.getElementById('anime-detail-content').style.display = 'block';
}
// 模拟翻译API调用函数
function translateToChinese(text) {
    return new Promise((resolve, reject) => {
        // 咒语：你是一个翻译机器人，将我发送给你的文本翻译为简体中文之后返回给我。
        const content = `你是一个翻译机器人，将我发送给你的文本翻译为简体中文之后返回给我。`;

        const postData = JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.5,
            messages: [{
                role: "user",
                content: `${content}\n\n${text}` // 咒语和需要翻译的文本一同传入
            }]
        });

        const options = {
            hostname: 'ffmpeg.dfsteve.top',
            path: '/ffmpeg.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        //console.log('准备发送翻译请求...');  // 请求前打印日志

        const req = require('https').request(options, res => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const responseData = JSON.parse(data);
                    //console.log('翻译后的内容:', responseData.choices[0].message.content);

                    resolve(responseData.choices[0].message.content); // 处理翻译结果
                } catch (error) {
                    console.error('解析返回数据时发生错误:', error);
                    reject(error);
                }
            });
        });

        req.on('error', error => {
            console.error('请求 API 时发生错误:', error);
            reject(error);
        });

        req.write(postData);
        req.end();

        //console.log('请求已结束发送');  // 请求结束发送后打印日志
    });
}
// 回到新番更新界面
function returnToNewSeries() {
    //console.log('returnToNewSeries');
    document.getElementById('anime-detail-content').style.display = 'none';
    document.getElementById('new-series-container').style.display = 'block';
    loadNewSeries();  // 重新加载新番更新内容
}
function returnToanime() {
    //console.log('return-anime-library');
    document.getElementById('anime-detail-content').style.display = 'none';
    document.getElementById('new-series-container').style.display = 'block';
    loadNewSeries();  // 重新加载新番更新内容
};
function isMacOS() {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}
if (isMacOS()) {
    //console.log('mac');
} else {
    const closeButton = document.getElementById('close-button');
    const miniButton = document.getElementById('minimize-button');
    const fullscreenButton = document.getElementById('fullscreen-button');
    const restoreButton = document.getElementById('restore-button');
    closeButton.classList.add('close-button-other');
    closeButton.style.display = 'block';
    closeButton.addEventListener('click', () => {
        //console.log('nipa');
        ipcRenderer.send('close-main-window');
    });
    fullscreenButton.classList.add('fullscreen-button-other');
    fullscreenButton.style.display = 'block';
    fullscreenButton.addEventListener('click', () => {
        //console.log('nipa');
        fullscreenButton.style.display = 'none';
        restoreButton.style.display = 'block';
        ipcRenderer.send('fullscreen-window');
    });
    restoreButton.classList.add('restore-button-other');
    restoreButton.addEventListener('click', () => {
        //console.log('nipa');
        fullscreenButton.style.display = 'block';
        restoreButton.style.display = 'none';
        ipcRenderer.send('restore-window');
    });
    miniButton.classList.add('minimize-button-other');
    miniButton.style.display = 'block';
    miniButton.addEventListener('click', () => {
        //console.log('nipa');
        ipcRenderer.send('minimize-window');
    });
}