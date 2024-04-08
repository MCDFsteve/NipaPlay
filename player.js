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
        if (document.fullscreenElement) {
            winscreenButton.style.display = 'block';
            fullscreenButton.style.display = 'none';
        } else {
            winscreenButton.style.display = 'none';
            fullscreenButton.style.display = 'block';
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
//////
document.addEventListener('DOMContentLoaded', function() {
    const subtitleButton = document.getElementById('subtitle-button');

    subtitleButton.addEventListener('click', async () => {
        try {
            const subtitlePath = await window.electron.selectSubtitleFile();
            if (subtitlePath) {
                if (subtitlePath.endsWith('.ass')) {
                    // 对于 ASS 文件，使用 ASS.js 渲染
                    // 假设您已经在 video-player.html 中引入了 ASS.js
                    const assRenderer = new ASS.Renderer(videoPlayer, {
                        // 配置项，例如字体大小、边距等
                    });
                    fetch(subtitlePath)
                        .then(response => response.text())
                        .then(text => {
                            const ass = new ASS(text, document.getElementById('subtitle-display'));
                                // 可能的额外配置项
                            // 在这里，ASS 字幕将会被渲染
                        });
                } else if (subtitlePath.endsWith('.vtt')) {
                    // 创建一个track元素
                    const track = document.createElement('track');
                    track.kind = 'subtitles';
                    track.label = '中文';
                    track.srclang = 'zh';
                    track.src = subtitlePath;
                    track.default = true;
                    videoPlayer.appendChild(track);
                    
                    // 可能需要重新加载视频元素，以便识别track
                    videoPlayer.load();
                }
            }
        } catch (error) {
            console.error('加载字幕文件失败:', error);
        }
    });
    
});
danmaku.emit({
    text: 'example',
  
    // 默认为 rtl（从右到左），支持 ltr、rtl、top、bottom。
    mode: 'rtl',
  
    // 弹幕显示的时间，单位为秒。
    // 在使用媒体模式时，如果未设置，会默认为音视频的当前时间；实时模式不需要设置。
    time: 233.3,
  
    // 在使用 DOM 引擎时，Danmaku 会为每一条弹幕创建一个 <div> 节点，
    // style 对象会直接设置到 `div.style` 上，按 CSS 规则来写。
    // 例如：
    style: {
      fontSize: '20px',
      color: '#ffffff',
      border: '1px solid #337ab7',
      textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
    },
  
    // 在使用 canvas 引擎时，Danmaku 会为每一条弹幕创建一个 <canvas> 对象，
    // 需要按 CanvasRenderingContext2D 对象的格式来写。
    // 例如：
    style: {
      font: '10px sans-serif',
      textAlign: 'start',
      // 注意 bottom 是默认的
      textBaseline: 'bottom',
      direction: 'inherit',
      fillStyle: '#000',
      strokeStyle: '#000',
      lineWidth: 1.0,
      // ...
    },
  });
    
  