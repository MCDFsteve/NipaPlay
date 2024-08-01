const { ipcRenderer } = require('electron');
const originalLog = console.log; // 保存原始的console.log函数，以便还可以在渲染器中本地打印日志
console.log = function (...args) {
    ipcRenderer.send('log-message', args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' '));
    originalLog.apply(console, args); // 保持渲染进程的控制台也可以输出日志
};
// 关闭按钮点击事件
closeButton.addEventListener('click', () => {
    //console.log('nipa');
    ipcRenderer.send('close-selection-window');
});
function updateMatchList(matches, isEpisodes = false, animeInfo = null) {
    const matchList = document.getElementById('matchList');
    matchList.innerHTML = ''; // 清空现有条目

    if (matches && matches.length > 0) {
        matches.forEach(match => {
            const div = document.createElement('div');
            div.className = 'selection-item';

            // 根据是否是集数列表(isEpisodes)，设置显示的文本
            if (isEpisodes) {
                // 如果是集数列表，仅显示集数标题
                div.textContent = match.episodeTitle || '未知集数';
            } else {
                if (match.episodeTitle){
                    div.textContent = `${match.animeTitle} ${match.episodeTitle}` || '未知动画';
                }else{
                    div.textContent = match.animeTitle || '未知动画';
                }
                // 如果是剧集列表，仅显示动画标题
            }

            div.onclick = () => {
                if (match.episodes) {
                    // 如果条目有子集数，点击后加载并显示这些集数
                    // 这里传递包含动画标题的animeInfo，以确保动画标题在集数中可用
                    updateMatchList(match.episodes, true, { animeId: match.animeId, animeTitle: match.animeTitle });
                } else {
                    // 如果没有子集数，触发播放集数的逻辑
                    // 这里传递包含完整标题信息的对象
                    const fullEpisodeInfo = {
                        ...match,
                        animeId: match.animeId,
                        animeTitle: animeInfo ? animeInfo.animeTitle : match.animeTitle, // 确保animeTitle包含在内
                        episodeTitle: match.episodeTitle // 确保episodeTitle也包含在内
                    };
                    ipcRenderer.invoke('process-selection', fullEpisodeInfo).then(response => {
                    });
                }
            };

            matchList.appendChild(div);
        });
    } else {
        matchList.innerHTML = '<div class="no-matches">这个视频我猜不出来是什么....笨蛋！！</div>'; // 如果没有匹配项，显示提示信息
    }
}
document.getElementById('no-danmaku-play').addEventListener('click', function () {
    // 发送到主进程的对象不包括episodeId
    ipcRenderer.invoke('process-selection', { animeTitle: "直接播放" });
    //console.log('yes');
});
document.getElementById('file-danmaku-play').addEventListener('click', async function () {
    const result = await ipcRenderer.invoke('open-file-dialog');
    if (!result.canceled && result.filePaths.length > 0) {
        const file = result.filePaths[0];
        ipcRenderer.invoke('process-selection', { animeTitle: 'file', file: file });
        //console.log('file', file);
    } else {
        //console.log('No file selected');
    }
});
// 监听来自主进程的 'update-selection' 事件，以更新匹配列表
ipcRenderer.on('update-selection', (event, matches) => {
    updateMatchList(matches);
});
document.getElementById('search-button').addEventListener('click', handleSearch);
document.getElementById('search-input').addEventListener('keydown', function (event) {
    if (event.keyCode === 13) { // 检查是否为回车键
        handleSearch();
    }
});

async function handleSearch() {
    //console.log("Search initiated");
    const searchInput = document.getElementById('search-input');
    let searchTerm = searchInput.value.trim();
    //console.log(`Initiating search for: ${searchTerm}`);
    if (searchTerm === "铃音") {
        searchTerm = "lain";
    }
    if (searchTerm) {
        try {
            const results = await ipcRenderer.invoke('search-anime', searchTerm);
            updateMatchList(results, false); // false 表示这是动画系列列表
            searchInput.value = '';  // 清空输入框
        } catch (error) {
            console.error("Error during search: ", error);
        }
    } else {
        //console.log("No search term entered");
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keydown', (event) => {
        if (event.ctrlKey || event.metaKey) { // 支持Ctrl键和Mac的Command键
            switch (event.key) {
                case 'a': // 全选
                    event.preventDefault(); // 阻止默认行为
                    searchInput.select();
                    break;
                case 'c': // 复制
                    event.preventDefault();
                    document.execCommand('copy');
                    break;
                case 'v': // 粘贴
                    event.preventDefault();
                    document.execCommand('paste');
                    break;
                case 'x': // 剪切
                    event.preventDefault();
                    document.execCommand('cut');
                    break;
            }
        }
    });
});
ipcRenderer.on('platform-info', (event, { isMac }) => {
    if (isMac) {
        document.body.style.backgroundColor = "transparent";
        //console.log("是mac");
    }
});


