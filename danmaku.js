function initializeDanmaku() {
    const videoPlayer = document.getElementById('video-player');
    const danmakuContainer = document.getElementById('danmaku-container');
    const sizeSlider = document.getElementById('danmaku-size');
    const sizeDisplay = document.getElementById('size-display');
    let danmakuAnimations = [];
    let danmakuTimers = [];
    let pausedDanmakus = []; // 暂停期间发送的顶部和底部弹幕
    let topDanmakuCount = 0; // 活跃的顶部弹幕数量
    let bottomDanmakuCount = 0; // 活跃的底部弹幕数量
    // 设置大小控制
    sizeSlider.addEventListener('input', () => {
        sizeDisplay.textContent = sizeSlider.value === "1" ? "小弹幕" : "大弹幕";
    });

    // 绑定发送按钮事件
    document.getElementById('send-scroll-danmaku').addEventListener('click', () => {
        sendDanmaku(sizeSlider.value === "1" ? "small" : "large", "scroll");
    });

    document.getElementById('send-top-danmaku').addEventListener('click', () => {
        sendDanmaku(sizeSlider.value === "1" ? "small" : "large", "top");
    });

    document.getElementById('send-bottom-danmaku').addEventListener('click', () => {
        sendDanmaku(sizeSlider.value === "1" ? "small" : "large", "bottom");
    });

    if (!videoPlayer || !danmakuContainer) {
        console.error('Danmaku initialization failed: Required elements not found.');
        return;
    }

    const largeFontSize = 30; // 大弹幕的基础字号

    function displayDanmaku(danmaku) {
        const danmakuDiv = document.createElement("div");
        danmakuDiv.innerText = danmaku.text;
        danmakuDiv.style.position = "absolute";
        danmakuDiv.style.color = danmaku.color;
        danmakuDiv.style.whiteSpace = "nowrap";
        danmakuDiv.classList.add('danmaku');
        danmakuDiv.style.fontSize = danmaku.size === "large" ? `${largeFontSize}px` : `${largeFontSize / 2}px`;

        // 处理顶部和底部弹幕的位置
        if (danmaku.position === 'top') {
            danmakuDiv.style.top = `${topDanmakuCount * largeFontSize}px`;
            topDanmakuCount++; // 更新计数
            danmakuDiv.style.left = '50%';
            danmakuDiv.style.transform = 'translateX(-50%)';
        } else if (danmaku.position === 'bottom') {
            danmakuDiv.style.bottom = `${bottomDanmakuCount * largeFontSize}px`;
            bottomDanmakuCount++;
            danmakuDiv.style.left = '50%';
            danmakuDiv.style.transform = 'translateX(-50%)';
        } else // 在 displayDanmaku 函数中正确处理滚动弹幕
            if (danmaku.position === 'scroll') {
                danmakuDiv.style.top = `${Math.random() * (danmakuContainer.offsetHeight - 20)}px`;
                danmakuDiv.style.left = "100%";
                // 创建滚动弹幕动画
                const animation = danmakuDiv.animate([{ transform: 'translateX(-100vw)' }], {
                    duration: 10000,
                    easing: 'linear'
                });
                animation.onfinish = () => danmakuDiv.remove();
                if (videoPlayer.paused) {
                    animation.pause();
                }
                danmakuAnimations.push({ element: danmakuDiv, animation });
            }

        // 当弹幕消失时，更新计数
        danmakuDiv.addEventListener('animationend', () => {
            if (danmaku.position === 'top') {
                topDanmakuCount--;
            } else if (danmaku.position === 'bottom') {
                bottomDanmakuCount--;
            }
        });
        danmakuContainer.appendChild(danmakuDiv);

        // 处理顶部和底部弹幕的显示时间
        if (danmaku.position === 'top' || danmaku.position === 'bottom') {
            // 在发送顶部和底部弹幕时保存定时器ID
            const timerId = setTimeout(() => {
                danmakuDiv.remove();
            }, 5000); // 示例时间
            danmakuTimers.push({ element: danmakuDiv, id: timerId });

            // 在视频暂停和播放事件监听中，清除和重置这些定时器

        }
    }

    function sendDanmaku(size, position) {
        const input = document.getElementById('danmaku-input');
        const text = input.value.trim();
        if (text) {
            const newDanmaku = {
                text: text,
                color: "#FFFFFF",
                size: size,
                position: position
            };
            displayDanmaku(newDanmaku);
            input.value = ''; // 清空输入框
        }
    }

    // 视频暂停事件
    videoPlayer.addEventListener('pause', () => {
        // 暂停所有滚动弹幕动画
        danmakuAnimations.forEach(item => item.animation.pause());

        // 暂停顶部和底部弹幕的定时器，并保存剩余时间
        danmakuTimers.forEach(timer => {
            clearTimeout(timer.id);
            const elapsed = Date.now() - timer.start;
            timer.remaining = timer.duration - elapsed;
        });
    });

    // 视频播放事件
    videoPlayer.addEventListener('play', () => {
        // 恢复滚动弹幕动画
        danmakuAnimations.forEach(item => item.animation.play());

        // 重新启动顶部和底部弹幕的定时器
        danmakuTimers.forEach(timer => {
            if (timer.remaining > 0) {
                timer.id = setTimeout(() => {
                    timer.element.remove();
                    // 从数组中移除该定时器对象
                    danmakuTimers = danmakuTimers.filter(t => t.id !== timer.id);
                }, timer.remaining);
            }
        });

        // 处理暂停期间发送的弹幕
        pausedDanmakus.forEach(danmaku => displayDanmaku(danmaku));
        pausedDanmakus = []; // 清空数组
    });



    // 确保在文档加载完毕时执行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDanmaku);
    } else {
        initializeDanmaku();
    }
}

// 调用初始化函数
initializeDanmaku();
