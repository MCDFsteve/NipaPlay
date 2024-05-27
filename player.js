const videoPlayer = document.getElementById('video-player');
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const popPlay = document.getElementById('pop-play');
const popPause = document.getElementById('pop-pause');
const popFull = document.getElementById('pop-full');
const popWin = document.getElementById('pop-win');
const seekBar = document.getElementById('seek-bar');
const fullscreenButton = document.getElementById('fullscreen-button');
const winscreenButton = document.getElementById('windowed-button');
const progressBar = document.getElementById('seek-bar');
const followDiv = document.getElementById('pop-bar');
const popSub = document.getElementById('pop-subtitle');
const popCom = document.getElementById('pop-comment');
const popSet = document.getElementById('pop-settings');
const subButton = document.getElementById('subtitle-button');
const comButton = document.getElementById('comment-button');
const setButton = document.getElementById('settings-button');
const hideui = document.getElementById('uihide');
const popAlpha = document.getElementById('pop-alpha');
const popAlphabar = document.getElementById('pop-alphabar');
const Alphaimage = document.getElementById('alpha-image');
// 获取弹幕按钮和新的弹幕透明度控制面板元素
const commentButton = document.getElementById('comment-button');
const danmakuOpacityControl = document.getElementById('danmaku-opacity-control');
const closeOpacityControl = document.getElementById('close-opacity-control');
const opacitySlider = document.getElementById('opacity-slider');
const danmakuContainer = document.getElementById('danmaku-container');
const originalLog = console.log; // 保存原始的console.log函数，以便还可以在渲染器中本地打印日志

console.log = function (...args) {
    ipcRenderer.send('log-message', args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' '));
    originalLog.apply(console, args); // 保持渲染进程的控制台也可以输出日志
};
document.addEventListener('DOMContentLoaded', function () {
    // 当视频元数据已加载，自动开始播放
    videoPlayer.addEventListener('loadedmetadata', function () {
        if (videoPlayer.readyState >= 2) { // 确保有足够的数据可以开始播放
            videoPlayer.play();
        }
    });
    const savedOpacity = localStorage.getItem('danmaku-opacity');
    if (savedOpacity) {
        opacitySlider.value = savedOpacity;
        danmakuContainer.style.opacity = savedOpacity / 100;
    }
    // 初始化滑动条的样式和显示的透明度值
    updateSliderBackground(opacitySlider, opacitySlider.value);

    // 添加输入事件监听器来动态更新滑动条和透明度值
    opacitySlider.addEventListener('input', function () {
        updateSliderBackground(opacitySlider, opacitySlider.value);
        danmakuContainer.style.opacity = opacitySlider.value / 100;
        // 保存透明度值到localStorage
        localStorage.setItem('danmaku-opacity', opacitySlider.value);
    });
});

// 函数：根据滑动条的值更新背景样式
function updateSliderBackground(slider, value) {
    const percentage = value; // 直接使用value作为百分比
    slider.style.background = `linear-gradient(to right, rgba(255, 255, 255, 0.5) ${percentage}%, rgba(216, 216, 216, 0.3) ${100 - percentage}%)`;
    popAlphabar.style.left = `calc(${percentage}% / 8)`;
    popAlphabar.textContent = `${percentage}%`;
}

// 弹幕按钮点击事件，显示透明度控制面板
commentButton.addEventListener('click', () => {
    danmakuOpacityControl.style.display = 'block';
});

// 关闭按钮点击事件，隐藏透明度控制面板
closeOpacityControl.addEventListener('click', () => {
    danmakuOpacityControl.style.display = 'none';
});

// 透明度滑块控制弹幕透明度
opacitySlider.addEventListener('input', () => {
    danmakuContainer.style.opacity = opacitySlider.value / 100;
});
document.addEventListener('DOMContentLoaded', function () {
    // 更新按钮状态的函数
    function updateButtonStatus() {
        if (videoPlayer.paused) {
            playButton.style.display = 'block';
            pauseButton.style.display = 'none';
        } else {
            playButton.style.display = 'none';
            pauseButton.style.display = 'block';
        }
    }
    document.addEventListener('fullscreenchange', (event) => {
        const closeButton = document.getElementById('close-button');
        const miniButton = document.getElementById('minimize-button');
        if (document.fullscreenElement) {
            winscreenButton.style.display = 'block';
            fullscreenButton.style.display = 'none';
            closeButton.style.display = 'none';
            miniButton.style.display = 'none';
        } else {
            winscreenButton.style.display = 'none';
            fullscreenButton.style.display = 'block';
            closeButton.style.display = 'block';
            miniButton.style.display = 'block';
        }
    });
    fullscreenButton.addEventListener('click', function () {
        document.documentElement.requestFullscreen();
    });
    winscreenButton.addEventListener('click', function () {
        document.exitFullscreen();
    });

    // 播放按钮点击事件
    playButton.addEventListener('click', function () {
        videoPlayer.play();
    });

    // 暂停按钮点击事件
    pauseButton.addEventListener('click', function () {
        videoPlayer.pause();
    });

    // 监听视频播放事件来更新按钮状态
    videoPlayer.addEventListener('play', function () {
        updateButtonStatus();
    });
    // 监听视频暂停事件来更新按钮状态
    videoPlayer.addEventListener('pause', function () {
        updateButtonStatus();
    });

    // 初始时更新按钮状态
    updateButtonStatus();
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function updateSeekBar() {
        const percentage = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        seekBar.value = videoPlayer.currentTime; // 确保滑块位置正确反映当前播放时间
        seekBar.style.background = `linear-gradient(to right, rgba(255, 255, 255, 0.5) ${percentage}%, rgba(216, 216, 216, 0.3) ${percentage}%)`;
        const progressBarWidth = seekBar.offsetWidth; // 获取进度条的总宽度
        const popBarLeft = (percentage / 50.1) * progressBarWidth; // 根据百分比计算#pop-bar的左偏移量

        // 设置#pop-bar的位置。这里我们假设pop-bar的CSS定位已经设置为absolute
        // 注意：您可能需要根据#pop-bar的尺寸做一些调整，以确保它正确对齐滑块
        const popBar = document.getElementById('pop-bar');
        if (popBar) {
            // 由于#seek-bar通常位于其容器的中间，可能需要添加额外的偏移来准确对齐pop-bar和滑块
            popBar.style.left = `calc(${popBarLeft}px - 72.6%)`; // 假设pop-bar需要向左偏移8px以居中对齐
        }
        popBar.textContent = formatTime(videoPlayer.currentTime);
    }

    // 当视频播放进度更新时
    videoPlayer.addEventListener('timeupdate', updateSeekBar);

    // 当用户通过进度条调整视频播放位置时
    seekBar.addEventListener('input', function () {
        videoPlayer.currentTime = (seekBar.value / seekBar.max) * videoPlayer.duration;
        updateSeekBar();
        // 注意：这里不需要再次调用 updateSeekBar()，
        // 因为设置 videoPlayer.currentTime 会触发 'timeupdate' 事件，该事件的处理函数会更新进度条。
    });

    // 当视频元数据加载完毕时，初始化进度条的最大值
    videoPlayer.addEventListener('loadedmetadata', function () {
        seekBar.max = videoPlayer.duration;
        // 初始化时更新一次进度条，以设置正确的背景
        updateSeekBar();
    });
});
////////////
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        // 切换到全屏
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    } else if (event.key === 'Escape') {
        // 退出全屏
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const videoPlayer = document.getElementById('video-player');

    videoPlayer.addEventListener('dblclick', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            // 已在全屏模式，退出全屏
            document.exitFullscreen();
        }
    });
});
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') { // 空格键
        event.preventDefault(); // 防止触发其它不需要的默认行为（如滚动页面）
        const videoPlayer = document.getElementById('video-player');
        if (videoPlayer) {
            if (videoPlayer.paused) {
                videoPlayer.play();
            } else {
                videoPlayer.pause();
            }
        }
    }
});
////////
document.addEventListener('DOMContentLoaded', function () {
    const videoContainer = document.getElementById('player-container'); // 确保这是包含视频和控制UI的容器的ID
    const controlsContainer = document.getElementById('controls-container'); // 控制UI的容器
    const videoTitle = document.getElementById('video-title');
    const timeDisplay = document.getElementById('time-display');
    const rightMenu = document.getElementById('side-controls');
    let hideControlsTimeout;
    function showControlsAndTitle() {
        // 显示控制UI和视频标题
        controlsContainer.style.opacity = '1';
        videoTitle.style.opacity = '1';
        rightMenu.style.opacity = '1';

        // 重置并重新设置计时器
        clearTimeout(hideControlsTimeout);
        hideControlsTimeout = setTimeout(() => {
            controlsContainer.style.opacity = '0';
            videoTitle.style.opacity = '0';
            rightMenu.style.opacity = '0';
        }, 2000); // 3秒无交互后隐藏
    }
    videoContainer.addEventListener('mousemove', showControlsAndTitle);
    // 当视频播放时，也调用此函数以确保控制UI和标题在开始时可见
    const videoPlayer = document.getElementById('video-player');
    videoPlayer.addEventListener('play', showControlsAndTitle);
    function updateTimeDisplay() {
        const currentMinutes = Math.floor(videoPlayer.currentTime / 60);
        const currentSeconds = Math.floor(videoPlayer.currentTime - currentMinutes * 60);
        const durationMinutes = Math.floor(videoPlayer.duration / 60);
        const durationSeconds = Math.floor(videoPlayer.duration - durationMinutes * 60);

        // 更新时间显示的文本
        timeDisplay.textContent = `${pad(currentMinutes)}:${pad(currentSeconds)} / ${pad(durationMinutes)}:${pad(durationSeconds)}`;
    }
    // 用于确保时间格式始终为两位数的辅助函数
    function pad(value) {
        return value.toString().padStart(2, '0');
    }

    // 当视频的播放位置更新时，更新时间显示
    videoPlayer.addEventListener('timeupdate', updateTimeDisplay);

    // 加载元数据后立即更新一次时间显示，确保显示正确
    videoPlayer.addEventListener('loadedmetadata', updateTimeDisplay);
    // 初始化时调用一次函数，以便设置初始的隐藏计时器
    showControlsAndTitle();
    // 当鼠标进入元素时触发
    // 当鼠标停留在控件上时，取消隐藏
    videoTitle.addEventListener('mouseenter', function () {
        clearTimeout(hideControlsTimeout);
    });
    hideui.addEventListener('mouseenter', function () {
        clearTimeout(hideControlsTimeout);
    });
});
videoPlayer.addEventListener('click', () => {
    // 检查视频是否正在播放
    if (videoPlayer.paused) {
        videoPlayer.play(); // 如果已暂停，则播放视频
    } else {
        videoPlayer.pause(); // 如果正在播放，则暂停视频
    }
});
///////
playButton.addEventListener('mouseenter', () => {
    popPlay.showPopover()
});
playButton.addEventListener('mouseleave', () => {
    popPlay.hidePopover()
});
//////
pauseButton.addEventListener('mouseenter', () => {
    popPause.showPopover()
});
pauseButton.addEventListener('mouseleave', () => {
    popPause.hidePopover()
});
//////
fullscreenButton.addEventListener('mouseenter', () => {
    popFull.showPopover()
});
fullscreenButton.addEventListener('mouseleave', () => {
    popFull.hidePopover()
});
//////
winscreenButton.addEventListener('mouseenter', () => {
    popWin.showPopover()
})
winscreenButton.addEventListener('mouseleave', () => {
    popWin.hidePopover()
});
//////
progressBar.addEventListener('mouseenter', () => {
    followDiv.showPopover()
});
progressBar.addEventListener('mouseleave', () => {
    followDiv.hidePopover()
});
//////
subButton.addEventListener('mouseenter', () => {
    popSub.showPopover()
});
subButton.addEventListener('mouseleave', () => {
    popSub.hidePopover()
});
//////
comButton.addEventListener('mouseenter', () => {
    popCom.showPopover()
});
comButton.addEventListener('mouseleave', () => {
    popCom.hidePopover()
});
//////
setButton.addEventListener('mouseenter', () => {
    popSet.showPopover()
});
setButton.addEventListener('mouseleave', () => {
    popSet.hidePopover()
});
Alphaimage.addEventListener('mouseenter', () => {
    popAlpha.showPopover()
});
Alphaimage.addEventListener('mouseleave', () => {
    popAlpha.hidePopover()
});
opacitySlider.addEventListener('mouseenter', () => {
    popAlphabar.showPopover()
});
opacitySlider.addEventListener('mouseleave', () => {
    popAlphabar.hidePopover()
});
document.addEventListener('DOMContentLoaded', function () {
    const playerContainer = document.getElementById('player-container');
    let mouseTimer = null; // 用于计时鼠标停留时间的变量

    // 鼠标移动事件处理函数
    const handleMouseMove = () => {
        clearTimeout(mouseTimer); // 清除之前的计时器
        playerContainer.style.cursor = 'default'; // 重置鼠标样式为默认

        // 设置新的计时器
        mouseTimer = setTimeout(() => {
            playerContainer.style.cursor = 'none'; // 两秒后隐藏鼠标
        }, 2000); // 2000毫秒后执行
    };

    // 给播放器容器添加鼠标移动事件监听
    playerContainer.addEventListener('mousemove', handleMouseMove);

    // 鼠标离开播放器时重置鼠标样式
    playerContainer.addEventListener('mouseleave', () => {
        clearTimeout(mouseTimer); // 清除计时器
        playerContainer.style.cursor = 'default'; // 重置鼠标样式为默认
    });
});
//////
let wakeLock = null;

document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('video-player');
    const requestWakeLock = async () => {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('屏幕唤醒锁定成功');

            wakeLock.addEventListener('release', () => {
                console.log('屏幕唤醒锁已释放');
            });

            document.addEventListener('visibilitychange', async () => {
                if (wakeLock !== null && document.visibilityState === 'visible') {
                    wakeLock = await navigator.wakeLock.request('screen');
                }
            });
        } catch (err) {
            console.error(`${err.name}, ${err.message}`);
        }
    };

    videoPlayer.addEventListener('play', () => {
        if ('wakeLock' in navigator) {
            requestWakeLock();
        }
    });

    videoPlayer.addEventListener('pause', () => {
        wakeLock?.release().then(() => {
            console.log('屏幕唤醒锁已释放');
        });
    });

    videoPlayer.addEventListener('ended', () => {
        wakeLock?.release().then(() => {
            console.log('屏幕唤醒锁已释放');
        });
    });
});


document.getElementById('subtitle-button').addEventListener('click', () => {
    ipcRenderer.invoke('dialog:openFile', {
        filters: [
            { name: 'Subtitles', extensions: ['vtt', 'srt', 'ass', 'ssa'] }
        ]
    }).then(filePath => {
        if (filePath) {
            if (filePath.endsWith('.vtt')) {
                // 处理 VTT 文件
                vttSubtitles(filePath);
            } else if (filePath.endsWith('.srt')) {
                convertSRTtoVTT(filePath);
            } else if (filePath.endsWith('.ass') || filePath.endsWith('.ssa')) {
                // 处理 ASS 文件
                prepareSubtitles(filePath);
            }
        }
    }).catch(err => console.error('Failed to open file:', err));
});
let currentAssInstance = null; // 用于存储当前的 ASS 字幕实例
function convertSRTtoVTT(filePath) {
    let downloadsPath;
    ipcRenderer.send('get-downloads-path');
    // 接收下载路径
    ipcRenderer.on('downloads-path', (event, downloadsPath) => {
        console.log('Downloads path:', downloadsPath);
        // 这里你可以根据获取到的下载路径进行后续操作
        handleDownloadsPath(filePath, downloadsPath);
    });
}
function handlevttPath(title, vttPath) {
    const fs = require('fs');
    const path = require('path');
    const nipaPath = path.join(vttPath, 'nipaplay');
    const subPath = path.join(nipaPath, 'sub');
    const vttFilePath = path.join(subPath, title + '.vtt');
    console.log('player vtt路径:', vttFilePath);
    loadVTTSubtitles(vttFilePath);
}
function handlesrtPath(title, vttPath) {
    const fs = require('fs');
    const path = require('path');
    const nipaPath = path.join(vttPath, 'nipaplay');
    const subPath = path.join(nipaPath, 'sub');
    const srtFilePath = path.join(subPath, title + '.srt');
    console.log('player srt路径:', srtFilePath);
    handleDownloadsPath(srtFilePath, vttPath);
}
function handleassPath(title, assPath) {
    const fs = require('fs');
    const path = require('path');
    const nipaPath = path.join(assPath, 'nipaplay');
    const subPath = path.join(nipaPath, 'sub');
    const assFilePath = path.join(subPath, title + '.ass');
    console.log('ass路径:', assFilePath);
    loadASSSubtitles(assFilePath);
}
function vttSubtitles(filePath) {
    let downloadsPath;
    // 在主进程中定义并发送下载路径
    ipcRenderer.send('get-downloads-path');
    ipcRenderer.on('downloads-path', (event, downloadsPath) => {
        console.log('Downloads path:', downloadsPath);
        // 这里你可以根据获取到的下载路径进行后续操作
        handlevtt2Path(filePath, downloadsPath);
    });
}
function handlevtt2Path(filePath, downloadsPath) {
    const fs = require('fs');
    const path = require('path');
    const nipaPath = path.join(downloadsPath, 'nipaplay');
    const subPath = path.join(nipaPath, 'sub');
    const newFilePath = path.join(subPath, title + '.vtt');
    console.log('newFilePath:', newFilePath);
    // 拷贝文件到新位置
    fs.copyFile(filePath, newFilePath, (err) => {
        if (err) {
            console.error('Failed to copy subtitle file:', err);
            return;
        }
        console.log('Subtitle file copied to:', newFilePath);

        // 文件拷贝成功后加载字幕
        loadVTTSubtitles(newFilePath);
    });
}
function prepareSubtitles(filePath) {
    let downloadsPath;
    // 在主进程中定义并发送下载路径
    ipcRenderer.send('get-downloads-path2');
    ipcRenderer.on('downloads-path2', (event, downloadsPath) => {
        console.log('Downloads path by ass:', downloadsPath);
        // 这里你可以根据获取到的下载路径进行后续操作
        handlessaPath(filePath, downloadsPath);
    });
}
function handlessaPath(filePath, downloadsPath) {
    const fs = require('fs');
    const path = require('path');
    const nipaPath = path.join(downloadsPath, 'nipaplay');
    const subPath = path.join(nipaPath, 'sub');
    const newFilePath = path.join(subPath, title + '.ass');
    console.log('newFilePath:', newFilePath);
    // 拷贝文件到新位置
    fs.copyFile(filePath, newFilePath, (err) => {
        if (err) {
            console.error('Failed to copy subtitle file:', err);
            return;
        }
        console.log('Subtitle file copied to:', newFilePath);

        // 文件拷贝成功后加载字幕
        loadASSSubtitles(newFilePath);
    });
}
function handleDownloadsPath(filePath, downloadsPath) {
    console.log("downloadsPath:", downloadsPath);
    console.log("filePath:", filePath);
    console.log("title name:", title);
    const fs = require('fs');
    const path = require('path');
    const nipaPath = path.join(downloadsPath, 'nipaplay');
    const subPath = path.join(nipaPath, 'sub');
    console.log('I am lain.');
    const vttFilePath = path.join(subPath, title + '.vtt');
    console.log('vtt路径:', vttFilePath);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading SRT file:', err);
            return;
        }
        let styles = {};
        let vttData = 'WEBVTT\n\nSTYLE\n::cue {\nline-height: 50px;\n    background-color: transparent;\n}\n';
        let subtitles = [];

        // 解析字幕并存储
        const subtitleBlocks = data.split(/\n\n/);
        subtitleBlocks.forEach(block => {
            let match = block.match(/(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n(.+)/s);
            if (match) {
                subtitles.push({
                    index: parseInt(match[1]),
                    start: match[2].replace(',', '.'),
                    end: match[3].replace(',', '.'),
                    text: match[4].replace(/<font face="([^"]+)" size="(\d+)">(<b>)?/g, (m, font, size, bold) => {
                        size = size ? Math.round(size * 0.8) : 40;  // Reduce size by 20% or use default 40px
                        const className = `font${font.replace(/\s+/g, '')}size${size}${bold ? 'bold' : ''}`;
                        styles[className] = `    font-family: '${font}';\n    font-size: ${size}px;${bold ? '\n    font-weight: bold;' : ''}`;
                        return `<c.${className}>`;
                    })
                });
            }
        });

        // 添加自定义样式到VTT
        for (let className in styles) {
            vttData += `::cue(.${className}) {\n${styles[className]}\n}\n`;
        }
        // 默认样式
        vttData += '::cue {\n    color: white;\n    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000,\n               -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000,\n               0px -2px 0 #000, 0px 2px 0 #000, -2px 0px 0 #000, 2px 0px 0 #000;\n}\n\n';

        // 按照时间轴排序字幕
        subtitles.sort((a, b) => parseFloat(a.start) - parseFloat(b.start));

        // 交换同一时间轴上的两条字幕的顺序
        for (let i = 0; i < subtitles.length - 1; i++) {
            if (subtitles[i].start === subtitles[i + 1].start) {
                [subtitles[i].text, subtitles[i + 1].text] = [subtitles[i + 1].text, subtitles[i].text];
            }
        }
        subtitles.forEach(sub => {
            vttData += `${sub.index}\n${sub.start} --> ${sub.end}\n${sub.text.trim().replace(/<c>$/, '')}\n\n`;
        });

        // 保存 VTT 文件到指定目录
        fs.writeFile(vttFilePath, vttData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing VTT file:', err);
            } else {
                console.log('VTT file saved:', vttFilePath);
                loadVTTSubtitles(vttFilePath); // 加载转换后的 VTT 字幕
            }
        });
    });
}
function loadASSSubtitles(filePath) {
    if (currentAssInstance) {
        currentAssInstance.destroy();
        currentAssInstance = null;
    }

    fetch(filePath)
        .then(response => response.text())
        .then(subtitles => {
            const videoElement = document.getElementById('video-player');
            initializeSubtitles(subtitles, videoElement);
            showSubtitleAlert();
            observeVideoResize(videoElement, subtitles);
        })
        .catch(error => {
            console.error('Failed to load subtitles:', error);
        });
}

function initializeSubtitles(subtitles, videoElement) {
    // 创建新的 ASS 实例并保存引用
    if (currentAssInstance) {
        currentAssInstance.destroy();
    }
    currentAssInstance = new ASS(subtitles, videoElement, {
        videoWidth: videoElement.clientWidth,
        videoHeight: videoElement.clientHeight
    });
}

function observeVideoResize(videoElement, subtitles) {
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === videoElement) {
                initializeSubtitles(subtitles, videoElement);
            }
        }
    });
    resizeObserver.observe(videoElement);
}

function loadVTTSubtitles(filePath) {
    const videoElement = document.getElementById('video-player');
    // 移除所有现有的字幕轨道
    const tracks = videoElement.getElementsByTagName('track');
    while (tracks.length > 0) {
        videoElement.removeChild(tracks[0]);
    }

    // 添加新的字幕轨道
    const trackElement = document.createElement('track');
    trackElement.kind = 'subtitles';
    trackElement.label = 'Chinese'; // 根据实际情况调整标签
    trackElement.srclang = 'zh';    // 根据实际情况调整语言代码
    trackElement.src = filePath;
    trackElement.default = true;
    videoElement.appendChild(trackElement);
    const subtitleContainer = document.querySelector('.subtitle-container');
    subtitleContainer.style.position = relative;
    // 如果需要，确保新字幕立即显示
    trackElement.addEventListener('load', () => {
        trackElement.track.mode = 'showing';
        showSubtitleAlert();  // 成功加载后显示提示
    });
    trackElement.onerror = () => {
        console.error('Failed to load subtitle track:', filePath);
        // 不调用 showSubtitleAlert，因为加载失败
    };
}
function showSubtitleAlert() {
    const alertBox = document.getElementById('subtitle-alert');
    alertBox.style.display = 'block';
    alertBox.classList.remove('hide');
    setTimeout(() => {
        alertBox.classList.add('hide');
        setTimeout(() => alertBox.style.display = 'none', 500); // 确保动画完成后隐藏
    }, 3000); // 3秒后开始隐藏通知
}
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video-player');
    let volumeDisplay = document.getElementById('volume-display');

    // 从 localStorage 中获取音量值并设置
    const savedVolume = localStorage.getItem('videoVolume');
    if (savedVolume !== null) {
        video.volume = parseFloat(savedVolume);
    }

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp': // 增大音量
                if (video.volume < 1) {
                    video.volume = Math.min(video.volume + 0.1, 1);
                }
                break;
            case 'ArrowDown': // 减小音量
                if (video.volume > 0) {
                    video.volume = Math.max(video.volume - 0.1, 0);
                }
                break;
            case 'ArrowLeft': // 视频后退五秒
                video.currentTime = Math.max(video.currentTime - 5, 0);
                break;
            case 'ArrowRight': // 视频前进五秒
                video.currentTime = Math.min(video.currentTime + 5, video.duration);
                break;
        }

        // 将音量值存储到 localStorage 中
        if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
            localStorage.setItem('videoVolume', video.volume);

            if (!volumeDisplay) {
                volumeDisplay = document.createElement('div');
                volumeDisplay.id = 'volume-display';
                document.body.appendChild(volumeDisplay); // 添加音量显示到页面
            }
            volumeDisplay.innerText = `音量: ${Math.round(video.volume * 100)}%`;
            volumeDisplay.style.display = 'block';

            // 清除之前的定时器，重新设置定时器
            if (window.volumeHideTimeout) {
                clearTimeout(window.volumeHideTimeout);
            }
            window.volumeHideTimeout = setTimeout(() => {
                volumeDisplay.style.display = 'none';
            }, 2000); // 2秒后隐藏音量显示
        }
    });
});

const steamworks = require('steamworks.js');
const client = steamworks.init(2520710);
const mess = "#helloworld";
function setRichPresence(key, value) {
    console.log(`Trying to set Rich Presence with key: ${key}, value: ${value}`);
    if (client && client.localplayer) {
        client.localplayer.setRichPresence(key, value);
        console.log('Rich Presence set successfully.');
        console.log(client.localplayer.setRichPresence(key, value));
    } else {
        console.error(`Could not set the rich presence, steamworks was not properly loaded!`);
    }
}
if (newTitle) {
    const bangumi = newTitle;
    setRichPresence("steam_display", `${mess}`);
    setRichPresence("bangumi", `${bangumi}`);
} else {
    const bangumi = title;
    setRichPresence("steam_display", `${mess}`);
    setRichPresence("bangumi", `${bangumi}`);
}



