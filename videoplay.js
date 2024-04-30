const { ipcRenderer } = require('electron');
ipcRenderer.on('platform-info', (event, { isMac }) => {
    if (isMac) {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
        .sidebar {
            background-color: initial !important;
}
@media (prefers-color-scheme: dark) {
    .sidebar {
        background-color: initial !important;
}
}
`;
        document.head.appendChild(styleSheet);
    }
});
function selectFile() {
    document.getElementById('file-input').click();
}

function allowDrop(event) {
    event.preventDefault(); // 阻止浏览器默认打开文件操作
}

function dropFile(event) {
    event.preventDefault(); // 阻止浏览器默认打开文件操作
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

document.getElementById('file-input').addEventListener('change', function(event) {
    const files = event.target.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

function handleFile(file) {
    if (file.type.startsWith('video/')) {
        // 是视频文件，执行打开视频文件的操作
        openVideoFile(file);
    } else {
        alert('请拖放视频文件');
    }
}
function openVideoFile2() {
    ipcRenderer.send('select-video').then((filePath) => {
      if (filePath) {
        console.log('Selected video path:', filePath);
        // 你可以在这里添加更多处理逻辑，例如打开视频播放器界面等
      } else {
        console.log('No file was selected');
      }
    }).catch((error) => {
      console.error('Failed to select video:', error);
    });
  }
function openVideoFile(file) {
    const filePath = file.path; // 获取文件路径
    ipcRenderer.send('open-video-file', filePath);
}

