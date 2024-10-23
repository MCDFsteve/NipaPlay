function loadDanmakuFile(filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(content => {
            loadDanmaku(content);
        })
        .catch(error => {
            console.error('Error loading danmaku file:', error);
        });
}
function loadDanmaku(content) {
    eval(content);
}
// 监听浏览器窗口的 resize 事件
window.addEventListener('resize', () => {
    if (danmaku) {
        danmaku.resize();  // 调用 danmaku 的 resize 方法
    }
});
function isMacOS() {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}
if (isMacOS()) {
    //console.log('mac');
} else {
    const closeButton = document.getElementById('close-button');
    const miniButton = document.getElementById('minimize-button');
    closeButton.classList.add('close-button-other');
    closeButton.classList.add('playclose');
    closeButton.style.display = 'block';
    closeButton.addEventListener('click', () => {
        //console.log('nipa');
        ipcRenderer.send('close-player-window');
    });
    miniButton.classList.add('minimize-button-other');
    miniButton.style.display = 'block';
    miniButton.classList.add('playclose');
    miniButton.addEventListener('click', () => {
        //console.log('nipa');
        ipcRenderer.send('minimize-player-window');
    });
}
//var myVideoPlayer = videojs('video-player');