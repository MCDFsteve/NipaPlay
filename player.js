const videoPlayer = document.getElementById('video-player');
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const popPlay = document.getElementById('pop-play');
const popPause = document.getElementById('pop-pause');
const popFull = document.getElementById('pop-full');
const popWin = document.getElementById('pop-win');
const popUp = document.getElementById('pop-up');
const popDown = document.getElementById('pop-down');
const seekBar = document.getElementById('seek-bar');
const fullscreenButton = document.getElementById('fullscreen-button');
const winscreenButton = document.getElementById('windowed-button');
const audioFull = document.getElementById('audio-button-full');
const audio50 = document.getElementById('audio-button-50');
const audio0 = document.getElementById('audio-button-0');
const audionull = document.getElementById('audio-button-null');
const progressBar = document.getElementById('controls-container');
const sidecontrols = document.getElementById('side-controls');
const reloadDanmaku = document.getElementById('reload-danmaku');
const followDiv = document.getElementById('pop-bar');
const popBar2 = document.getElementById('pop-bar2');
const popAudio = document.getElementById('pop-audio');
const popSub = document.getElementById('pop-subtitle');
const popCom = document.getElementById('pop-comment');
const popSet = document.getElementById('pop-settings');
const popSwitch1 = document.getElementById('pop-danmakuswitch1');
const popSwitch2 = document.getElementById('pop-danmakuswitch2');
const subButton = document.getElementById('subtitle-button');
const comButton = document.getElementById('comment-button');
const optionButton = document.getElementById('settings-button');
const upButton = document.getElementById('up-button');
const downButton = document.getElementById('down-button');
const setButton = document.getElementById('settings-button');
const hideui = document.getElementById('uihide');
const popAlpha = document.getElementById('pop-alpha');
const popSpeed = document.getElementById('pop-speed');
const popLight = document.getElementById('pop-light');
const popLine = document.getElementById('pop-line');
const popFont = document.getElementById('pop-font');
const popAlphabar = document.getElementById('pop-alphabar');
const popLinebar = document.getElementById('pop-linebar');
const popFontbar = document.getElementById('pop-fontbar');
const popSpeedbar = document.getElementById('pop-speedbar');
const popLightbar = document.getElementById('pop-lightbar');
const Alphaimage = document.getElementById('alpha-image');
const Speedimage = document.getElementById('speed-image');
const Lightimage = document.getElementById('light-image');
const Lineimage = document.getElementById('line-image');
const Fontimage = document.getElementById('font-image');
// 获取弹幕按钮和新的弹幕透明度控制面板元素
const commentButton = document.getElementById('comment-button');
const danmakuOpacityControl = document.getElementById('danmaku-opacity-control');
const optionsControl = document.getElementById('options-control');
const audioControl = document.getElementById('audio-opacity-control');
const closeOpacityControl = document.getElementById('close-opacity-control');
const closeOptionsControl = document.getElementById('close-options-control');
const opacitySlider = document.getElementById('opacity-slider');
const lightSlider = document.getElementById('light-slider');
const speedSlider = document.getElementById('speed-slider');
const lineSlider = document.getElementById('line-width-slider');
const fontSlider = document.getElementById('font-size-slider');
const audioSlider = document.getElementById('audio-slider');
const danmakuContainer = document.getElementById('danmaku-container');
const originalLog = console.log; // 保存原始的console.log函数，以便还可以在渲染器中本地打印日志
const danmakuSwitch = document.getElementById('danmakucon');
const danmakuswitch1 = document.getElementById('danmakuSwitch');
const danmakuswitch2 = document.getElementById('danmakuSwitch2');
const BlackMask = document.getElementById('black-mask');
let fullorwin;
//ipcRenderer.removeAllListeners('full-window');
console.log = function (...args) {
    ipcRenderer.send('log-message', args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' '));
    originalLog.apply(console, args); // 保持渲染进程的控制台也可以输出日志
};
function danmakuline() {
    const fs = require('fs');
    const path = require('path');
    // 获取滑块和视频元素
    const lineWidthSlider = document.getElementById('line-width-slider');

    // 获取 danmakuPath
    const danmakuPath = new URLSearchParams(window.location.search).get('danmakuPath');
    const basePath = path.dirname(danmakuPath); // 获取上级目录
    const lineWidthConfigPath = path.join(basePath, 'danmakuline.json');

    // 初始化滑块值
    // 默认值
    if (fs.existsSync(lineWidthConfigPath)) {
        const configData = JSON.parse(fs.readFileSync(lineWidthConfigPath, 'utf8'));
        lineWidth = configData.lineWidth || 3;
        lineWidthSlider.value = lineWidth;
    }

    // 更新弹幕的描边宽度
    function updateLineWidth(newLineWidth) {
        lineWidth = newLineWidth;
        // 保存新的描边宽度到 JSON 文件
        const configData = { lineWidth };
        fs.writeFileSync(lineWidthConfigPath, JSON.stringify(configData, null, 2), 'utf8');
    }
    // 监听滑块变化事件
    lineWidthSlider.addEventListener('input', (event) => {
        const newLineWidth = parseInt(event.target.value, 10);
        updateLineWidth(newLineWidth);
        updateSliderBackground3(lineWidthSlider, lineWidthSlider.value);

    });

    // 初始化时设置描边宽度
    updateLineWidth(lineWidth);
}
function danmakufont() {
    const fs = require('fs');
    const path = require('path');
    // 获取滑块和视频元素
    const danmakufsBaseSlider = document.getElementById('font-size-slider');

    // 获取 danmakuPath
    const danmakuPath = new URLSearchParams(window.location.search).get('danmakuPath');
    const basePath = path.dirname(danmakuPath); // 获取上级目录
    const danmakufsBaseConfigPath = path.join(basePath, 'danmakufont.json');

    // 初始化滑块值
    // 默认值
    if (fs.existsSync(danmakufsBaseConfigPath)) {
        const configData = JSON.parse(fs.readFileSync(danmakufsBaseConfigPath, 'utf8'));
        danmakufsBase = configData.danmakufsBase || 3;
        danmakufsBaseSlider.value = danmakufsBase;
    }

    // 更新弹幕的描边宽度
    function updatedanmakufsBase(newdanmakufsBase) {
        danmakufsBase = newdanmakufsBase;
        // 保存新的描边宽度到 JSON 文件
        const configData = { danmakufsBase };
        fs.writeFileSync(danmakufsBaseConfigPath, JSON.stringify(configData, null, 2), 'utf8');
    }

    danmakufsBaseSlider.addEventListener('input', (event) => {
        // 将滑动条的值转换为浮点数，并保留一位小数
        const newdanmakufsBase = parseFloat(event.target.value).toFixed(1);
        updateSliderBackground4(danmakufsBaseSlider, danmakufsBaseSlider.value);
        // 传递转换后的值更新
        updatedanmakufsBase(newdanmakufsBase);
    });

    // 初始化时设置描边宽度
    updatedanmakufsBase(danmakufsBase);
}
function onWindowResize() {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoPlayerRect = videoPlayer.getBoundingClientRect();
    // 创建新的样式
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        video::-webkit-media-text-track-container {
            bottom: ${videoPlayerRect.top}px;
        }
    `;
    document.head.appendChild(styleSheet);
}
window.addEventListener('resize', onWindowResize);
ipcRenderer.on('full', (event, center) => {
    fullorwin = center;
    console.log('fullorwin', fullorwin);
    const closeButton = document.getElementById('close-button');
    const miniButton = document.getElementById('minimize-button');
    if (fullorwin == 'true') {
        console.log('Successfully entered full screen mode.');
        winscreenButton.style.display = 'block';
        fullscreenButton.style.display = 'none';
        closeButton.style.display = 'none';
        miniButton.style.display = 'none';
    } else if (fullorwin == 'false') {
        console.log('Exited full screen mode.');
        winscreenButton.style.display = 'none';
        fullscreenButton.style.display = 'block';
        closeButton.style.display = 'block';
        miniButton.style.display = 'block';
    }
});
document.addEventListener('DOMContentLoaded', function () {
    danmakuline();
    danmakufont();
    const saveddanmuku = localStorage.getItem('danmakuswitch');
    console.log('saveddanmuku:', saveddanmuku);
    if (saveddanmuku == 1) {
        danmakuContainer.style.zIndex = -2;
        danmakuswitch1.style.display = 'none';
        danmakuswitch2.style.display = 'block';
    } else {
        danmakuContainer.style.zIndex = 9;
        danmakuswitch1.style.display = 'block';
        danmakuswitch2.style.display = 'none';
    }
    // 当视频元数据已加载，自动开始播放
    videoPlayer.addEventListener('loadedmetadata', function () {
        if (videoPlayer.readyState >= 2) { // 确保有足够的数据可以开始播放
            videoPlayer.play();
        }
    });
    const savedVolume = localStorage.getItem('videoVolume');
    if (savedVolume <= 1 && savedVolume > 0.6) {
        console.log('full');
        audioFull.style.display = 'block';
        audio50.style.display = 'none';
        audio0.style.display = 'none';
        audionull.style.display = 'none';
    } else if (savedVolume <= 0.6 && savedVolume > 0.3) {
        console.log('50');
        audioFull.style.display = 'none';
        audio50.style.display = 'block';
        audio0.style.display = 'none';
        audionull.style.display = 'none';
    } else if (savedVolume <= 0.3 && savedVolume > 0) {
        console.log('0');
        audioFull.style.display = 'none';
        audio50.style.display = 'none';
        audio0.style.display = 'block';
        audionull.style.display = 'none';
    } else if (savedVolume <= 0.1) {
        console.log('null');
        audioFull.style.display = 'none';
        audio50.style.display = 'none';
        audio0.style.display = 'none';
        audionull.style.display = 'block';
    }
    const savedOpacity = localStorage.getItem('danmaku-opacity');
    const savedSpeed = localStorage.getItem('video-speed');
    const savedLight = localStorage.getItem('video-light');
    const savedaudioOpacity = localStorage.getItem('videoVolume');
    if (savedOpacity) {
        opacitySlider.value = savedOpacity;
        danmakuContainer.style.opacity = savedOpacity / 100;
    }
    if (savedLight) {
        lightSlider.value = savedLight;
        BlackMask.style.opacity = (100 - lightSlider.value) / 100;
    }
    if (savedSpeed) {
        speedSlider.value = savedSpeed;
        console.log('speed:', savedSpeed);
        videoPlayer.playbackRate = savedSpeed;
    } else {
        videoPlayer.playbackRate = 1;
        speedSlider.value = 1;
    }
    if (savedaudioOpacity) {
        audioSlider.value = savedaudioOpacity * 100;
    }
    // 初始化滑动条的样式和显示的透明度值
    updateSliderBackground(opacitySlider, opacitySlider.value);
    updateSliderBackground2(audioSlider.value);
    updateSliderBackground3(lineSlider, lineWidth);
    updateSliderBackground4(fontSlider, danmakufsBase);
    updateSliderBackground5(speedSlider, speedSlider.value);
    updateSliderBackground6(lightSlider, lightSlider.value);
    audioSlider.addEventListener('input', function () {
        const volumeDisplay = document.getElementById('volume-display');
        volumeDisplay.innerText = `音量: ${Math.round(audioSlider.value)}%`;
        videoPlayer.volume = audioSlider.value / 100;
        if (videoPlayer.volume >= 0.98) {
            videoPlayer.volume = 1;
        } else if (videoPlayer.volume <= 0.02) {
            videoPlayer.volume = 0;
        }
        if (videoPlayer.volume <= 1 && videoPlayer.volume > 0.6) {
            audioFull.style.display = 'block';
            audio50.style.display = 'none';
            audio0.style.display = 'none';
            audionull.style.display = 'none';
        } else if (videoPlayer.volume <= 0.6 && videoPlayer.volume > 0.3) {
            audioFull.style.display = 'none';
            audio50.style.display = 'block';
            audio0.style.display = 'none';
            audionull.style.display = 'none';
        } else if (videoPlayer.volume <= 0.3 && videoPlayer.volume > 0) {
            audioFull.style.display = 'none';
            audio50.style.display = 'none';
            audio0.style.display = 'block';
            audionull.style.display = 'none';
        } else if (videoPlayer.volume <= 0.1) {
            audioFull.style.display = 'none';
            audio50.style.display = 'none';
            audio0.style.display = 'none';
            audionull.style.display = 'block';
        }
        volumeDisplay.style.display = 'block';
        // 清除之前的定时器，重新设置定时器
        if (window.volumeHideTimeout) {
            clearTimeout(window.volumeHideTimeout);
        }
        window.volumeHideTimeout = setTimeout(() => {
            volumeDisplay.style.display = 'none';
        }, 2000); // 2秒后隐藏音量显示
        updateSliderBackground2(audioSlider.value);
        localStorage.setItem('videoVolume', videoPlayer.volume);
    });
});
function clearCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    if (countdownTimeout) {
        clearTimeout(countdownTimeout);
        countdownTimeout = null;
    }
    filesTitle.style.display = 'none';
}
// 函数：根据滑动条的值更新背景样式
function updateSliderBackground(slider, value) {
    const percentage = value; // 直接使用value作为百分比
    slider.style.background = `linear-gradient(to right, rgba(255, 255, 255, 0.5) ${percentage}%, rgba(216, 216, 216, 0.3) ${100 - percentage}%)`;
    popAlphabar.textContent = `${percentage}%`;
}
function updateSliderBackground3(slider, value) {
    const percentage = ((value - 1) / (6 - 1)) * 100;
    slider.style.background = `linear-gradient(to right, rgba(255, 255, 255, 0.5) ${percentage}%, rgba(216, 216, 216, 0.3) ${100 - percentage}%)`;
    popLinebar.textContent = `${lineWidth}`;
}
function updateSliderBackground4(slider, value) {
    const percentage = value; // 直接使用value作为百分比
    slider.style.background = `linear-gradient(to right, rgba(255, 255, 255, 0.5) ${percentage}%, rgba(216, 216, 216, 0.3) ${100 - percentage}%)`;
    popFontbar.textContent = `${danmakufsBase * 10}px`;
}
function updateSliderBackground5(slider, value) {
    const percentage = ((value - 0.1) * 100) / 4.9; // 转换为百分比
    //console.log('percentage:',percentage.toFixed(2));
    slider.style.background = `linear-gradient(to right, rgba(255, 255, 255, 0.5) ${percentage}%, rgba(216, 216, 216, 0.3) ${100 - percentage}%)`;
    popSpeedbar.textContent = `${value}倍`;
}
function updateSliderBackground6(slider, value) {
    const percentage = value;
    slider.style.background = `linear-gradient(to right, rgba(255, 255, 255, 0.5) ${percentage}%, rgba(216, 216, 216, 0.3) ${100 - percentage}%)`;
    popLightbar.textContent = `${value}%`;
}
function updateSliderBackground2(value) {
    const percentage = value;
    //audioSlider.value = videoPlayer.volume; // 确保滑块位置正确反映当前播放时间
    audioSlider.style.background = `linear-gradient(to right, rgba(255, 255, 255, 0.5) ${percentage}%, rgba(216, 216, 216, 0.3) ${percentage}%)`;
}
ipcRenderer.on('files-path', (event, videoFiles) => {
    if (videoFiles.length === 1) {
        console.log('Only one video file in the directory. No action needed.');
    } else {
        videoElement.addEventListener('ended', () => {
            let countdown = 10;
            filesTitle.style.display = 'block';
            filesTitle.textContent = `${countdown}秒后播放下一话......`;
            countdownInterval = setInterval(() => {
                countdown--;
                filesTitle.textContent = `${countdown}秒后播放下一话......`;
                if (countdown === 0) {
                    clearInterval(countdownInterval);
                }
            }, 1000);

            countdownTimeout = setTimeout(() => {
                if (fullorwin == 'true') {
                    ipcRenderer.send('down-player-window', 'nanami');
                } else {
                    ipcRenderer.send('down-player-window');
                }
                filesTitle.style.display = 'none';
            }, 10000);
        });

        videoElement.addEventListener('timeupdate', () => {
            if (!videoElement.ended && (countdownInterval || countdownTimeout)) {
                clearCountdown();
                countdown = 0;
                filesTitle.style.display = 'none';
            }
        });
    }
});
downButton.addEventListener('click', () => {
    clearCountdown();
    countdown = 0;
    filesTitle.style.display = 'none';
    videoPlayer.pause();
    if (fullorwin == 'true') {
        ipcRenderer.send('down-player-window', 'nanami');
    } else {
        ipcRenderer.send('down-player-window');
    }
});
upButton.addEventListener('click', () => {
    clearCountdown();
    countdown = 0;
    filesTitle.style.display = 'none';
    videoPlayer.pause();
    if (fullorwin == 'true') {
        ipcRenderer.send('up-player-window', 'nanami');
    } else {
        ipcRenderer.send('up-player-window');
    }
});
reloadDanmaku.addEventListener('click', () => {
    videoPlayer.pause();
    if (fullorwin == 'true') {
        ipcRenderer.send('reload-player-danmaku', 'nanami');
    } else {
        ipcRenderer.send('reload-player-danmaku');
    }
});
danmakuswitch1.addEventListener('click', () => {
    localStorage.setItem('danmakuswitch', 1);
    danmakuContainer.style.zIndex = -2;
    danmakuswitch1.style.display = 'none';
    danmakuswitch2.style.display = 'block';
});
danmakuswitch2.addEventListener('click', () => {
    localStorage.setItem('danmakuswitch', 0);
    danmakuContainer.style.zIndex = 9;
    danmakuswitch1.style.display = 'block';
    danmakuswitch2.style.display = 'none';
});
// 弹幕按钮点击事件，显示透明度控制面板
commentButton.addEventListener('click', () => {
    danmakuOpacityControl.style.display = 'block';
});
//设置按钮点击事件，显示设置面板
optionButton.addEventListener('click', () => {
    optionsControl.style.display = 'block';
});
// 关闭按钮点击事件，隐藏透明度控制面板
closeOpacityControl.addEventListener('click', () => {
    danmakuOpacityControl.style.display = 'none';
});
//关闭设置面板
closeOptionsControl.addEventListener('click', () => {
    optionsControl.style.display = 'none';
});
// 添加输入事件监听器来动态更新滑动条和透明度值
opacitySlider.addEventListener('input', function () {
    updateSliderBackground(opacitySlider, opacitySlider.value);
    danmakuContainer.style.opacity = opacitySlider.value / 100;
    // 保存透明度值到localStorage
    localStorage.setItem('danmaku-opacity', opacitySlider.value);
});
speedSlider.addEventListener('input', function () {
    updateSliderBackground5(speedSlider, speedSlider.value);
    videoPlayer.playbackRate = speedSlider.value;
    localStorage.setItem('video-speed', speedSlider.value);
});
lightSlider.addEventListener('input', function () {
    updateSliderBackground6(lightSlider, lightSlider.value);
    BlackMask.style.opacity = (100 - lightSlider.value) / 100;
    localStorage.setItem('video-light', lightSlider.value);
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
    fullscreenButton.addEventListener('click', function () {
        ipcRenderer.send('windowed-window');
        //ipcRenderer.send('windowed-window');
    });
    winscreenButton.addEventListener('click', function () {
        ipcRenderer.send('windowed-window');
        //ipcRenderer.send('windowed-window');
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
        // 设置#pop-bar的位置。这里我们假设pop-bar的CSS定位已经设置为absolute
        // 注意：您可能需要根据#pop-bar的尺寸做一些调整，以确保它正确对齐滑块
        const popBar = document.getElementById('pop-bar');
        // 获取进度条的边界和宽度
        const seekBarRect = seekBar.getBoundingClientRect();
        const seekBarWidth = seekBarRect.width;
        const relativePosition = ((seekBar.value - seekBar.min) / (seekBar.max - seekBar.min)) * seekBarWidth;
        // 计算滑块的绝对位置
        const absolutePosition = seekBarRect.left + relativePosition;
        if (popBar) {
            // 由于#seek-bar通常位于其容器的中间，可能需要添加额外的偏移来准确对齐pop-bar和滑块
            popBar.style.marginLeft = `calc(${absolutePosition}px)`;
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
    if (event.key === 'd' || event.key === 'D') { // 检查按下的是否是 'D' 键
        if (danmakuswitch1.style.display === 'block') {
            danmakuswitch1.click();
        } else if (danmakuswitch2.style.display === 'block') {
            danmakuswitch2.click();
        }
    }
    if (event.key === 'Enter') {
        // 切换到全屏
        if (fullorwin != 'true') {
            ipcRenderer.send('windowed-window');
        }
    } else if (event.key === 'Escape') {
        // 退出全屏
        if (fullorwin == 'true') {
            ipcRenderer.send('windowed-window');
        }
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const videoPlayer = document.getElementById('video-player');

    videoPlayer.addEventListener('dblclick', () => {
        if (fullorwin != 'true') {
            ipcRenderer.send('windowed-window');
        } else {
            // 已在全屏模式，退出全屏
            ipcRenderer.send('windowed-window');
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
    const closeButton = document.getElementById('close-button');
    const miniButton = document.getElementById('minimize-button');
    let hideControlsTimeout;
    function showControlsAndTitle() {
        // 显示控制UI和视频标题
        controlsContainer.style.opacity = '1';
        videoTitle.style.opacity = '1';
        rightMenu.style.opacity = '1';
        danmakuSwitch.style.display = 'block';
        if (fullorwin == 'false') {
            closeButton.style.display = 'block';
            miniButton.style.display = 'block';
        }

        // 重置并重新设置计时器
        clearTimeout(hideControlsTimeout);
        hideControlsTimeout = setTimeout(() => {
            controlsContainer.style.opacity = '0';
            videoTitle.style.opacity = '0';
            rightMenu.style.opacity = '0';
            danmakuOpacityControl.style.display = 'none';
            optionsControl.style.display = 'none';
            audioControl.style.display = 'none';
            closeButton.style.display = 'none';
            miniButton.style.display = 'none';
            danmakuSwitch.style.display = 'none';
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
    audioControl.addEventListener('mouseenter', function () {
        clearTimeout(hideControlsTimeout);
    });
    videoTitle.addEventListener('mouseenter', function () {
        clearTimeout(hideControlsTimeout);
    });
    danmakuOpacityControl.addEventListener('mouseenter', function () {
        clearTimeout(hideControlsTimeout);
    });
    optionsControl.addEventListener('mouseenter', function () {
        clearTimeout(hideControlsTimeout);
    });
    hideui.addEventListener('mouseenter', function () {
        clearTimeout(hideControlsTimeout);
    });
    danmakuSwitch.addEventListener('mouseenter', function () {
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
    const seekPlayRect = playButton.getBoundingClientRect();
    popPlay.style.marginLeft = `calc(${seekPlayRect.x}px)`;
    popPlay.showPopover()
});
playButton.addEventListener('mouseleave', () => {
    popPlay.hidePopover()
});
//////
pauseButton.addEventListener('mouseenter', () => {
    const pauseButtonRect = pauseButton.getBoundingClientRect();
    popPause.style.marginLeft = `calc(${pauseButtonRect.x}px)`;
    popPause.showPopover()
});
pauseButton.addEventListener('mouseleave', () => {
    popPause.hidePopover()
});
//////
upButton.addEventListener('mouseenter', () => {
    const upButtonRect = upButton.getBoundingClientRect();
    popUp.style.marginLeft = `calc(${upButtonRect.x}px)`;
    popUp.showPopover()
});
upButton.addEventListener('mouseleave', () => {
    popUp.hidePopover()
});
//////
downButton.addEventListener('mouseenter', () => {
    const downButtonRect = downButton.getBoundingClientRect();
    popDown.style.marginLeft = `calc(${downButtonRect.x}px)`;
    popDown.showPopover()
});
downButton.addEventListener('mouseleave', () => {
    popDown.hidePopover()
});
//////
audioFull.addEventListener('mouseenter', () => {
    const audioFullRect = audioFull.getBoundingClientRect();
    popAudio.style.marginLeft = `calc(${audioFullRect.x}px)`;
    popAudio.showPopover()
});
audioFull.addEventListener('mouseleave', () => {
    popAudio.hidePopover()
});
audioFull.addEventListener('click', () => {
    const audioFullRect = audioFull.getBoundingClientRect();
    audioControl.style.left = `calc(${audioFullRect.left}px)`;
    if (audioControl.style.display === 'block') {
        audioControl.style.display = 'none';
    } else {
        audioControl.style.display = 'block';
    }
});
//////
audio50.addEventListener('mouseenter', () => {
    const audioFullRect = audio50.getBoundingClientRect();
    popAudio.style.marginLeft = `calc(${audioFullRect.x}px)`;
    popAudio.showPopover()
});
audio50.addEventListener('mouseleave', () => {
    popAudio.hidePopover()
});
audio50.addEventListener('click', () => {
    const audioFullRect = audio50.getBoundingClientRect();
    audioControl.style.left = `calc(${audioFullRect.left}px)`;
    if (audioControl.style.display === 'block') {
        audioControl.style.display = 'none';
    } else {
        audioControl.style.display = 'block';
    }
});
//////
audio0.addEventListener('mouseenter', () => {
    const audioFullRect = audio0.getBoundingClientRect();
    popAudio.style.marginLeft = `calc(${audioFullRect.x}px)`;
    popAudio.showPopover()
});
audio0.addEventListener('mouseleave', () => {
    popAudio.hidePopover()
});
audio0.addEventListener('click', () => {
    const audioFullRect = audio0.getBoundingClientRect();
    audioControl.style.left = `calc(${audioFullRect.left}px)`;
    if (audioControl.style.display === 'block') {
        audioControl.style.display = 'none';
    } else {
        audioControl.style.display = 'block';
    }
});
//////
audionull.addEventListener('mouseenter', () => {
    const audioFullRect = audionull.getBoundingClientRect();
    popAudio.style.marginLeft = `calc(${audioFullRect.x}px)`;
    popAudio.showPopover()
});
audionull.addEventListener('mouseleave', () => {
    popAudio.hidePopover()
});
audionull.addEventListener('click', () => {
    const audioFullRect = audionull.getBoundingClientRect();
    audioControl.style.left = `calc(${audioFullRect.left}px)`;
    if (audioControl.style.display === 'block') {
        audioControl.style.display = 'none';
    } else {
        audioControl.style.display = 'block';
    }
});
//////
fullscreenButton.addEventListener('mouseenter', () => {
    const fullscreenButtonRect = fullscreenButton.getBoundingClientRect();
    popFull.style.marginLeft = `calc(${fullscreenButtonRect.x}px)`;
    popFull.showPopover()
});
fullscreenButton.addEventListener('mouseleave', () => {
    popFull.hidePopover()
});
//////
winscreenButton.addEventListener('mouseenter', () => {
    const winscreenButtonRect = winscreenButton.getBoundingClientRect();
    popWin.style.marginLeft = `calc(${winscreenButtonRect.x}px)`;
    popWin.showPopover()
})
winscreenButton.addEventListener('mouseleave', () => {
    popWin.hidePopover()
});
//////
progressBar.addEventListener('mousemove', (event) => {
    const seekBarRect = seekBar.getBoundingClientRect();
    const seekBarSon = event.clientX - seekBarRect.left;
    const seekBarWidth = seekBarRect.width;
    const seekBar100 = seekBarSon / seekBarWidth;
    const seekBarTime = videoPlayer.duration * seekBar100;
    popBar2.textContent = convertToMinutesSeconds(seekBarTime);
    const relativePosition = ((seekBar.value - seekBar.min) / (seekBar.max - seekBar.min)) * seekBarWidth;
    // 计算滑块的绝对位置
    const thumbLeft = seekBarRect.left + relativePosition - 1.5;
    const thumbtop = seekBarRect.y - 20;
    const thumbRight = thumbLeft + 3;
    popBar2.style.marginLeft = `calc(${event.clientX}px)`;
    if (event.clientX >= thumbLeft && event.clientX <= thumbRight && event.clientY >= thumbtop) {
        followDiv.showPopover()
    }
    else if (event.clientX >= seekBarRect.left && event.clientX <= seekBarRect.right && event.clientY >= thumbtop) {
        popBar2.showPopover()
    } else {
        followDiv.hidePopover()
        popBar2.hidePopover()
    }
});
//////
subButton.addEventListener('mouseenter', () => {
    const subButtonRect = subButton.getBoundingClientRect();
    popSub.style.marginTop = `calc(${subButtonRect.y}px)`;
    popSub.showPopover()
});
subButton.addEventListener('mouseleave', () => {
    popSub.hidePopover()
});
//////
comButton.addEventListener('mouseenter', () => {
    const comButtonRect = comButton.getBoundingClientRect();
    popCom.style.marginTop = `calc(${comButtonRect.y}px)`;
    popCom.showPopover()
});
comButton.addEventListener('mouseleave', () => {
    popCom.hidePopover()
});
//////
danmakuswitch1.addEventListener('mouseenter', () => {
    const danmakuswitch1Rect = danmakuswitch1.getBoundingClientRect();
    popSwitch1.style.marginTop = `calc(${danmakuswitch1Rect.y}px)`;
    popSwitch1.showPopover()
});
danmakuswitch1.addEventListener('mouseleave', () => {
    popSwitch1.hidePopover()
});
//////
danmakuswitch2.addEventListener('mouseenter', () => {
    const danmakuswitch2Rect = danmakuswitch2.getBoundingClientRect();
    popSwitch2.style.marginTop = `calc(${danmakuswitch2Rect.y}px)`;
    popSwitch2.showPopover()
});
danmakuswitch2.addEventListener('mouseleave', () => {
    popSwitch2.hidePopover()
});
//////
setButton.addEventListener('mouseenter', () => {
    const setButtonRect = setButton.getBoundingClientRect();
    popSet.style.marginTop = `calc(${setButtonRect.y}px)`;
    popSet.showPopover()
});
setButton.addEventListener('mouseleave', () => {
    popSet.hidePopover()
});
Alphaimage.addEventListener('mouseenter', () => {
    const AlphaimageRect = Alphaimage.getBoundingClientRect();
    popAlpha.style.marginTop = `calc(${AlphaimageRect.y}px)`;
    popAlpha.style.marginLeft = `calc(${AlphaimageRect.left}px - 50px)`;
    popAlpha.showPopover()
});
Alphaimage.addEventListener('mouseleave', () => {
    popAlpha.hidePopover()
});
Speedimage.addEventListener('mouseenter', () => {
    const SpeedimageRect = Speedimage.getBoundingClientRect();
    popSpeed.style.marginTop = `calc(${SpeedimageRect.y}px)`;
    popSpeed.style.marginLeft = `calc(${SpeedimageRect.left}px - 50px)`;
    popSpeed.showPopover()
});
Speedimage.addEventListener('mouseleave', () => {
    popSpeed.hidePopover()
});
Lightimage.addEventListener('mouseenter', () => {
    const LightimageRect = Lightimage.getBoundingClientRect();
    popLight.style.marginTop = `calc(${LightimageRect.y}px)`;
    popLight.style.marginLeft = `calc(${LightimageRect.left}px - 50px)`;
    popLight.showPopover()
});
Lightimage.addEventListener('mouseleave', () => {
    popLight.hidePopover()
});
Lineimage.addEventListener('mouseenter', () => {
    const LineimageRect = Lineimage.getBoundingClientRect();
    popLine.style.marginTop = `calc(${LineimageRect.y}px)`;
    popLine.style.marginLeft = `calc(${LineimageRect.left}px - 50px)`;
    popLine.showPopover()
});
Lineimage.addEventListener('mouseleave', () => {
    popLine.hidePopover()
});
Fontimage.addEventListener('mouseenter', () => {
    const FontimageRect = Fontimage.getBoundingClientRect();
    popFont.style.marginTop = `calc(${FontimageRect.y}px)`;
    popFont.style.marginLeft = `calc(${FontimageRect.left}px - 50px)`;
    popFont.showPopover()
});
Fontimage.addEventListener('mouseleave', () => {
    popFont.hidePopover()
});
opacitySlider.addEventListener('mouseenter', (event) => {
    const AlphaimageRect = Alphaimage.getBoundingClientRect();
    popAlphabar.style.marginLeft = `calc(${AlphaimageRect.left}px - 50px)`;
    popAlphabar.style.marginTop = `calc(${AlphaimageRect.y}px + 12px)`;
    popAlphabar.showPopover()
});
opacitySlider.addEventListener('mouseleave', () => {
    popAlphabar.hidePopover()
});
lightSlider.addEventListener('mouseenter', (event) => {
    const lightSliderRect = Lightimage.getBoundingClientRect();
    popLightbar.style.marginLeft = `calc(${lightSliderRect.left}px - 50px)`;
    popLightbar.style.marginTop = `calc(${lightSliderRect.y}px + 12px)`;
    popLightbar.showPopover()
});
lightSlider.addEventListener('mouseleave', () => {
    popLightbar.hidePopover()
});
lineSlider.addEventListener('mouseenter', (event) => {
    const LineimageRect = Lineimage.getBoundingClientRect();
    popLinebar.style.marginTop = `calc(${LineimageRect.y}px + 12px)`;
    popLinebar.style.marginLeft = `calc(${LineimageRect.left}px - 50px)`;
    popLinebar.showPopover()
});
lineSlider.addEventListener('mouseleave', () => {
    popLinebar.hidePopover()
});
fontSlider.addEventListener('mouseenter', (event) => {
    const FontimageRect = Fontimage.getBoundingClientRect();
    popFontbar.style.marginTop = `calc(${FontimageRect.y}px + 12px)`;
    popFontbar.style.marginLeft = `calc(${FontimageRect.left}px - 50px)`;
    popFontbar.showPopover()
});
fontSlider.addEventListener('mouseleave', () => {
    popFontbar.hidePopover()
});
speedSlider.addEventListener('mouseenter', (event) => {
    const SpeedimageRect = Speedimage.getBoundingClientRect();
    popSpeedbar.style.marginTop = `calc(${SpeedimageRect.y}px + 12px)`;
    popSpeedbar.style.marginLeft = `calc(${SpeedimageRect.left}px - 50px)`;
    popSpeedbar.showPopover()
});
speedSlider.addEventListener('mouseleave', () => {
    popSpeedbar.hidePopover()
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
            popBar2.hidePopover();
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
function convertToMinutesSeconds(num) {
    var minutes = Math.floor(num / 60);
    var seconds = Math.floor(num % 60);

    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}
document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('video-player');
    const requestWakeLock = async () => {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => {
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
        });
    });

    videoPlayer.addEventListener('ended', () => {
        wakeLock?.release().then(() => {
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
    loadVTTSubtitles(vttFilePath);
}
function handlesrtPath(title, vttPath) {
    const fs = require('fs');
    const path = require('path');
    const nipaPath = path.join(vttPath, 'nipaplay');
    const subPath = path.join(nipaPath, 'sub');
    const srtFilePath = path.join(subPath, title + '.srt');
    handleDownloadsPath(srtFilePath, vttPath);
}
function handleassPath(title, assPath) {
    const fs = require('fs');
    const path = require('path');
    const nipaPath = path.join(assPath, 'nipaplay');
    const subPath = path.join(nipaPath, 'sub');
    const assFilePath = path.join(subPath, title + '.ass');
    //console.log('ass路径:', assFilePath);
    loadASSSubtitles(assFilePath);
}
function vttSubtitles(filePath) {
    let downloadsPath;
    // 在主进程中定义并发送下载路径
    ipcRenderer.send('get-downloads-path');
    ipcRenderer.on('downloads-path', (event, downloadsPath) => {
        //console.log('Downloads path:', downloadsPath);
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
    //console.log('newFilePath:', newFilePath);
    // 拷贝文件到新位置
    fs.copyFile(filePath, newFilePath, (err) => {
        if (err) {
            console.error('Failed to copy subtitle file:', err);
            return;
        }
        //console.log('Subtitle file copied to:', newFilePath);

        // 文件拷贝成功后加载字幕
        loadVTTSubtitles(newFilePath);
    });
}
function prepareSubtitles(filePath) {
    let downloadsPath;
    // 在主进程中定义并发送下载路径
    ipcRenderer.send('get-downloads-path2');
    ipcRenderer.on('downloads-path2', (event, downloadsPath) => {
        //console.log('Downloads path by ass:', downloadsPath);
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
    //console.log('newFilePath:', newFilePath);
    // 拷贝文件到新位置
    fs.copyFile(filePath, newFilePath, (err) => {
        if (err) {
            console.error('Failed to copy subtitle file:', err);
            return;
        }
        //console.log('Subtitle file copied to:', newFilePath);

        // 文件拷贝成功后加载字幕
        loadASSSubtitles(newFilePath);
    });
}
function handleDownloadsPath(filePath, downloadsPath) {
    //console.log("downloadsPath:", downloadsPath);
    //console.log("filePath:", filePath);
    //console.log("title name:", title);
    const fs = require('fs');
    const path = require('path');
    const nipaPath = path.join(downloadsPath, 'nipaplay');
    const subPath = path.join(nipaPath, 'sub');
    //console.log('I am lain.');
    const vttFilePath = path.join(subPath, title + '.vtt');
    //console.log('vtt路径:', vttFilePath);
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
                //console.log('VTT file saved:', vttFilePath);
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
                if (video.volume <= 1 && video.volume > 0.6) {
                    audioFull.style.display = 'block';
                    audio50.style.display = 'none';
                    audio0.style.display = 'none';
                    audionull.style.display = 'none';
                } else if (video.volume <= 0.6 && video.volume > 0.3) {
                    audioFull.style.display = 'none';
                    audio50.style.display = 'block';
                    audio0.style.display = 'none';
                    audionull.style.display = 'none';
                } else if (video.volume <= 0.3 && video.volume > 0) {
                    audioFull.style.display = 'none';
                    audio50.style.display = 'none';
                    audio0.style.display = 'block';
                    audionull.style.display = 'none';
                } else if (video.volume == 0) {
                    audioFull.style.display = 'none';
                    audio50.style.display = 'none';
                    audio0.style.display = 'none';
                    audionull.style.display = 'block';
                }
                break;
            case 'ArrowDown': // 减小音量
                if (video.volume > 0) {
                    video.volume = Math.max(video.volume - 0.1, 0);
                }
                if (video.volume <= 1 && video.volume > 0.6) {
                    audioFull.style.display = 'block';
                    audio50.style.display = 'none';
                    audio0.style.display = 'none';
                    audionull.style.display = 'none';
                } else if (video.volume <= 0.6 && video.volume > 0.3) {
                    audioFull.style.display = 'none';
                    audio50.style.display = 'block';
                    audio0.style.display = 'none';
                    audionull.style.display = 'none';
                } else if (video.volume <= 0.3 && video.volume > 0) {
                    audioFull.style.display = 'none';
                    audio50.style.display = 'none';
                    audio0.style.display = 'block';
                    audionull.style.display = 'none';
                } else if (video.volume == 0) {
                    audioFull.style.display = 'none';
                    audio50.style.display = 'none';
                    audio0.style.display = 'none';
                    audionull.style.display = 'block';
                }
                break;
            case 'ArrowLeft': // 视频后退五秒
                video.currentTime = Math.max(video.currentTime - 5, 0);
                break;
            case 'ArrowRight': // 视频前进五秒
                video.currentTime = Math.min(video.currentTime + 5, video.duration);
                break;
        }
        const audioTop = video.volume * 100;
        audioSlider.value = audioTop;
        updateSliderBackground2(audioTop);
        // 将音量值存储到 localStorage 中
        if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
            localStorage.setItem('videoVolume', video.volume);

            if (!volumeDisplay) {
                volumeDisplay = document.getElementById('volume-display');
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
    //console.log(`Trying to set Rich Presence with key: ${key}, value: ${value}`);
    if (client && client.localplayer) {
        client.localplayer.setRichPresence(key, value);
        //console.log('Rich Presence set successfully.');
        //console.log(client.localplayer.setRichPresence(key, value));
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



