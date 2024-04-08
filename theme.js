 // 从主进程监听主题更新事件
 window.electron.receive('update-theme', (isDarkMode) => {
    updateTheme(isDarkMode);
});

// 启动应用时请求当前系统的主题模式，并初始化页面的主题样式
window.electron.getSystemThemeMode().then((isDarkMode) => {
    updateTheme(isDarkMode);
});
document.addEventListener('DOMContentLoaded', () => {
    window.electron.getSystemThemeMode().then((isDarkMode) => {
        if (isDarkMode) {
            // 如果系统处于深色模式，则显示“浅色模式”按钮
            document.getElementById('theme-toauto').style.display = 'block'; // 显示“浅色模式”按钮
            document.getElementById('theme-todark').style.display = 'none';  // 隐藏“深色模式”按钮
        } else {
            // 如果系统不是深色模式，则显示“深色模式”按钮
            document.getElementById('theme-toauto').style.display = 'none';   // 隐藏“浅色模式”按钮
            document.getElementById('theme-todark').style.display = 'block';  // 显示“深色模式”按钮
        }
        const storedTheme = localStorage.getItem('theme');
    updateTheme(storedTheme === 'dark');
    });
});

// 根据系统深色模式设置更新主题
function updateTheme(isDarkMode) {
    const themeStyle = document.getElementById('theme-style');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
        if (isDarkMode === "dark") {
            themeStyle.innerHTML = `
            :root {
                --background-color: #222; /* 夜间模式背景颜色 */
                --text-color: #fff; /* 夜间模式文字颜色 */
                --sidebar-bg-color: rgba(51, 51, 51, 0.75); /* 夜间模式边栏背景颜色 */
                --button-bg-color: #444; /* 夜间模式按钮背景颜色 */
                --button-hover-bg-color: #555; /* 夜间模式按钮悬停背景颜色 */
                --sidebar-width: 150px;
                /* 边栏宽度，更窄 */
                /* 按钮背景颜色，透明 */
                --button-bg-color: transparent;
            }
        `;
        } 
        else if (isDarkMode === "light") {
            themeStyle.innerHTML = `
            :root {
                --background-color: #fff;
                /* 背景颜色 */
                --text-color: #222;
                /* 文字颜色 */
                --sidebar-bg-color: rgba(200, 200, 200, 0.4);
                /* 边栏背景颜色，更灰 */
                --button-bg-color: transparent;
                /* 按钮背景颜色，透明 */
                --button-hover-bg-color: #000;
                /* 按钮悬停背景颜色，深黑 */
                --sidebar-width: 150px;
                /* 边栏宽度，更窄 */
            }
                    `;
        
        }
        else  {
            themeStyle.innerHTML = `
            :root {
                --background-color: #222; /* 夜间模式背景颜色 */
                --text-color: #fff; /* 夜间模式文字颜色 */
                --sidebar-bg-color: rgba(51, 51, 51, 0.75); /* 夜间模式边栏背景颜色 */
                --button-bg-color: #444; /* 夜间模式按钮背景颜色 */
                --button-hover-bg-color: #555; /* 夜间模式按钮悬停背景颜色 */
                --sidebar-width: 150px;
                /* 边栏宽度，更窄 */
                /* 按钮背景颜色，透明 */
                --button-bg-color: transparent;
            }
                    `;
        
        }
    } 
    else {
        if (isDarkMode === "dark") {
            themeStyle.innerHTML = `
            :root {
                --background-color: #222; /* 夜间模式背景颜色 */
                --text-color: #fff; /* 夜间模式文字颜色 */
                --sidebar-bg-color: rgba(51, 51, 51, 0.75); /* 夜间模式边栏背景颜色 */
                --button-bg-color: #444; /* 夜间模式按钮背景颜色 */
                --button-hover-bg-color: #555; /* 夜间模式按钮悬停背景颜色 */
                --sidebar-width: 150px;
                /* 边栏宽度，更窄 */
                /* 按钮背景颜色，透明 */
                --button-bg-color: transparent;
            }
        `;
        } 
        else if (isDarkMode === "light") {
            themeStyle.innerHTML = `
            :root {
                --background-color: #fff;
                /* 背景颜色 */
                --text-color: #222;
                /* 文字颜色 */
                --sidebar-bg-color: rgba(200, 200, 200, 0.4);
                /* 边栏背景颜色，更灰 */
                --button-bg-color: transparent;
                /* 按钮背景颜色，透明 */
                --button-hover-bg-color: #000;
                /* 按钮悬停背景颜色，深黑 */
                --sidebar-width: 150px;
                /* 边栏宽度，更窄 */
            }
                    `;
        }
        else {
            themeStyle.innerHTML = `
            :root {
                --background-color: #fff;
                /* 背景颜色 */
                --text-color: #222;
                /* 文字颜色 */
                --sidebar-bg-color: rgba(200, 200, 200, 0.4);
                /* 边栏背景颜色，更灰 */
                --button-bg-color: transparent;
                /* 按钮背景颜色，透明 */
                --button-hover-bg-color: #000;
                /* 按钮悬停背景颜色，深黑 */
                --sidebar-width: 150px;
                /* 边栏宽度，更窄 */
            }
                    `;
        } 
    }
}