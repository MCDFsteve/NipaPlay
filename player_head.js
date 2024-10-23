const urlParams = new URLSearchParams(window.location.search);
const videoElement = document.getElementById('video-player');
const patha = require('path');
const path = urlParams.get('videopath');
const path2 = urlParams.get('path2');
const episodeId = urlParams.get('episodeId');
const danmakuPath = urlParams.get('danmakuPath');
const danmakuPath2 = patha.join(danmakuPath, `${episodeId}.js`);
const { ipcRenderer } = require('electron');
let lineWidth = 3;
let danmakufsBase = 3;
let BottomAlpha = 1;
let TopAlpha = 1;
let RtlAlpha = 1;
let DanmakuOff = 1;
let RenderRegion = 4;
let danmaku;
videoElement.src = path;
videoElement.load();
// 尝试从 URL 参数中获取提供的新标题
const newTitle = urlParams.get('title');
document.addEventListener('DOMContentLoaded', async () => {
    loadDanmakuFile(danmakuPath2);
    const savedTime = parseFloat(localStorage.getItem(videoElement.src)) || 0;
    if (savedTime > 0) {
        videoElement.currentTime = savedTime;
    } else {
        videoElement.currentTime = 0; // 如果播放位置不存在，默认从头开始播放
    }
    // 监听视频播放时间变化，并保存到 localStorage
    videoElement.addEventListener('timeupdate', () => {
        localStorage.setItem(videoElement.src, videoElement.currentTime);
    });
});
// 根据是否提供了新标题来设置页面标题
const title = path2;
const videoTitle = document.getElementById('video-title');
const filesTitle = document.getElementById('files-title');
let watchedVideos = JSON.parse(localStorage.getItem('watchedVideos')) || [];
const videoRecord = { name: newTitle ? decodeURIComponent(newTitle) : title, path: path };
// 查找数组中是否已存在该记录
const existingIndex = watchedVideos.findIndex(v => v.path === path);
if (newTitle) {
    videoTitle.textContent = "正在播放：" + newTitle;
} else {
    videoTitle.textContent = "正在播放：" + title;
}
if (existingIndex !== -1) {
    // 如果找到了，先移除旧的记录
    watchedVideos.splice(existingIndex, 1);
}
// 然后将新记录添加到数组的开头
watchedVideos.unshift(videoRecord);
localStorage.setItem('watchedVideos', JSON.stringify(watchedVideos));
//console.log("Updated watched video list with and danmakuPath2 :", danmakuPath2);
ipcRenderer.send('update-watched-video', videoRecord);
let vttPath;
let countdownInterval;
let countdownTimeout;
ipcRenderer.send('get-downloads-path');
ipcRenderer.send('get-downloads-path2');
ipcRenderer.send('get-downloads-path3');
ipcRenderer.send('get-files-path');
// 接收下载路径
ipcRenderer.on('downloads-path', (event, vttPath) => {
    //console.log('vttPath path:', vttPath);
    //console.log('danmakuPath:', danmakuPath2);
    //console.log('title path:', title);
    // 这里你可以根据获取到的下载路径进行后续操作
    handlevttPath(title, vttPath);
});
ipcRenderer.on('downloads-path2', (event, vttPath) => {
    // 这里你可以根据获取到的下载路径进行后续操作
    handlesrtPath(title, vttPath);
});
ipcRenderer.on('downloads-path3', (event, vttPath) => {
    // 这里你可以根据获取到的下载路径进行后续操作
    handleassPath(title, vttPath);
});