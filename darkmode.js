document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('userTheme') || 'light'; // 默认主题为'light'
    updateTheme(savedTheme); // 应用保存的主题

    // 根据当前主题决定重启后显示哪个按钮
    let buttonToShow;
    switch(savedTheme) {
        case 'light':
            // 如果退出时是浅色模式，重进显示切换到深色模式的按钮
            buttonToShow = 'theme-todark';
            break;
        case 'dark':
            // 如果退出时是深色模式，重进显示切换到浅色模式的按钮
            buttonToShow = 'theme-tolight';
            break;
        default:
            // 默认行为，应该不会到达这里
            buttonToShow = 'theme-todark'; // 默认显示切换到深色模式的按钮
            break;
    }

    // 隐藏所有按钮
    document.getElementById('theme-todark').style.display = 'none';
    document.getElementById('theme-tolight').style.display = 'none';

    // 只显示重启后应该显示的按钮
    document.getElementById(buttonToShow).style.display = 'block';
});

function setTheme(themeMode) {
    var todark = document.getElementById('theme-todark');
    var tolight = document.getElementById('theme-tolight');

    // 隐藏所有按钮
    todark.style.display = 'none';
    tolight.style.display = 'none';

    // 根据传入的主题模式显示对应的按钮，并更新主题
    switch (themeMode) {
        case 'dark':
            tolight.style.display = 'block'; // 深色模式后，显示浅色模式按钮
            break;
        case 'light':
            todark.style.display = 'block'; // 浅色模式后，显示深色模式按钮
            break;
        default:
            console.log('Unknown theme mode:', themeMode);
            return;
    }

    // 调用updateTheme函数应用新的主题
    updateTheme(themeMode);
    // 将用户的主题偏好保存到localStorage
    localStorage.setItem('userTheme', themeMode);
    localStorage.setItem('activeButton', themeMode);
    // 页面加载时读取用户偏好并应用主题
}
