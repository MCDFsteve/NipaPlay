const { ipcRenderer } = require('electron');

// 更新匹配列表的函数
function updateMatchList(matches) {
    const matchList = document.getElementById('matchList');
    matchList.innerHTML = ''; // 清空现有条目

    if (matches && matches.length > 0) {
        // 填充新的匹配列表
        matches.forEach(match => {
            const div = document.createElement('div');
            div.className = 'selection-item';
            div.textContent = `${match.animeTitle} ${match.episodeTitle}`; // 设置显示的文本为动画标题和剧集标题
            div.onclick = () => {
                // 当某个项目被点击时，调用主进程中的 'process-selection' 处理函数
                ipcRenderer.invoke('process-selection', match).then(response => {
                    console.log("已处理选择:", response);
                });
            };
            matchList.appendChild(div); // 将这个 div 添加到列表中
        });
    } else {
        matchList.innerHTML = '<div class="no-matches">没有可以选择的视频</div>'; // 如果没有匹配项，显示提示信息
    }
}

// 监听来自主进程的 'update-selection' 事件，以更新匹配列表
ipcRenderer.on('update-selection', (event, matches) => {
    updateMatchList(matches);
});
