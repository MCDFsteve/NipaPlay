// 读取 localStorage 中的已观看视频列表
const watchedVideos = JSON.parse(localStorage.getItem('watchedVideos')) || [];
// 假设在history.js或index.html的<script>中
window.electron.receive('watched-video-updated', (videoRecord) => {
    console.log("Received update for watched video:", videoRecord);
    updateVideoHistory(); // 更新DOM显示，确保此函数定义了如何更新页面上的观看记录列表
});

function pollWatchedVideos() {
    // 假设当前保存的观看记录数量
    let currentCount = watchedVideos.length;

    setInterval(() => {
        const newWatchedVideos = JSON.parse(localStorage.getItem('watchedVideos')) || [];
        if (newWatchedVideos.length !== currentCount) {
            updateVideoHistory(); // 调用更新DOM的函数
            currentCount = newWatchedVideos.length;
        }
    }, 1000); // 每隔1秒检查一次
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateVideoHistory(); // 首次加载时更新历史记录
    pollWatchedVideos(); // 开始轮询检查更新
});

// 更新观看记录
function updateVideoHistory() {
    const listElement = document.getElementById("video-history");
    listElement.innerHTML = ''; // 清空当前的列表
    const watchedVideos = JSON.parse(localStorage.getItem('watchedVideos')) || [];
    console.log("Updating video history with data:", watchedVideos);
    // 倒序添加记录，以确保最新的在上面
    watchedVideos.forEach(videoRecord => {
        const listItem = document.createElement("li");
        listItem.className = 'sidebar-button';
        listItem.textContent = videoRecord.name;
        listItem.addEventListener('click', () => {
            // 使用完整的视频路径来播放视频
            window.electron.sendToMain('open-video-file', videoRecord.path);
        });
        listElement.appendChild(listItem);
    });
}
updateVideoHistory();
// 在 index.html 中
window.electron.receive('clear-watched-videos', () => {
    localStorage.removeItem('watchedVideos');
    console.log("Writing to watchedVideos:", newWatchedVideosData);
    localStorage.setItem('watchedVideos', JSON.stringify([]));
    updateVideoHistory();
});

ipcRenderer.on('update-watched-video', (event, watchedVideo) => {
    // 在这里更新观看记录或执行其他操作
    console.log("Received 'clear-watched-videos' event in renderer");
    console.log('Received update for watched video:', watchedVideo);
});
