// 触发选择视频文件的操作
//document.getElementById('import-video').addEventListener('click', () => {
    //window.electron.selectVideo();
//});
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

function openVideoFile(file) {
    const filePath = file.path; // 获取文件路径
    window.electron.sendToMain('open-video-file', filePath); // 使用定义好的方法发送消息
}

