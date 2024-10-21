// 页面加载时，检查是否有已保存的背景图像
window.addEventListener('load', function () {
    const savedBackground = localStorage.getItem('backgroundImage');
    const contentArea = document.querySelector('.content-area2');

    if (savedBackground) {
        contentArea.style.backgroundImage = savedBackground;
        updateActiveButton(savedBackground); // 更新按钮状态
    } else {
        updateActiveButton('url("./others/back.png")'); // 默认是看板娘背景
    }
});

// 无背景
document.getElementById('btn-none-background').addEventListener('click', function () {
    const noneBackground = 'url("./images/none.png")';
    document.querySelector('.content-area2').style.backgroundImage = noneBackground;
    localStorage.setItem('backgroundImage', noneBackground); // 保存到 localStorage
    updateActiveButton(noneBackground); // 更新按钮状态
});

// 看板娘背景
document.getElementById('btn-kanban-background').addEventListener('click', function () {
    const kanbanBackground = 'url("./others/back.png")';
    document.querySelector('.content-area2').style.backgroundImage = kanbanBackground;
    localStorage.setItem('backgroundImage', kanbanBackground); // 保存到 localStorage
    updateActiveButton(kanbanBackground); // 更新按钮状态
});

// 自定义背景
document.getElementById('btn-custom-background').addEventListener('click', function () {
    // 创建一个隐藏的文件输入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    // 当用户选择文件时，读取并设置为背景图像
    input.addEventListener('change', function () {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const customBackground = `url(${e.target.result})`;
                document.querySelector('.content-area2').style.backgroundImage = customBackground;
                localStorage.setItem('backgroundImage', customBackground); // 保存到 localStorage
                updateActiveButton(customBackground); // 更新按钮状态
            };
            reader.readAsDataURL(file); // 将图像转换为 data URL
        }
    });

    // 触发文件选择
    input.click();
});

// 更新按钮的状态
function updateActiveButton(currentBackground) {
    // 先清除所有按钮的"按下"状态
    document.getElementById('btn-none-background').classList.remove('active');
    document.getElementById('btn-kanban-background').classList.remove('active');
    document.getElementById('btn-custom-background').classList.remove('active');

    // 判断当前背景，设置相应按钮为按下状态
    if (currentBackground.includes('none.png')) {
        document.getElementById('btn-none-background').classList.add('active');
    } else if (currentBackground.includes('back.png')) {
        document.getElementById('btn-kanban-background').classList.add('active');
    } else {
        document.getElementById('btn-custom-background').classList.add('active');
    }
}
function adjustContentAreaPosition() {
    // 获取 .sidebar 元素
    const sidebar = document.querySelector('.sidebar');
    
    // 确认 sidebar 存在
    if (!sidebar) {
        console.error("Error: .sidebar element not found!");
        return;
    }

    // 获取 .sidebar 的边界信息
    const sidebarRect = sidebar.getBoundingClientRect();
    
    // 获取 .content-area2 元素
    const contentArea = document.querySelector('.content-area2');
    const contentArea2 = document.querySelector('.content-area');
    const contentArea0 = document.querySelector('.content-area0');
    if (!contentArea) {
        console.error("Error: .content-area2 element not found!");
        return;
    }

    // 将 .content-area2 的 left 设置为 sidebar 的宽度（右侧 x 坐标）
    contentArea.style.left = `${sidebarRect.right}px`;
    
    // 同时设置宽度为窗口总宽度 - sidebar 的右侧 x 坐标
    contentArea.style.width = `${window.innerWidth - sidebarRect.right}px`;
    contentArea2.style.left = `${sidebarRect.right}px`;
    
    // 同时设置宽度为窗口总宽度 - sidebar 的右侧 x 坐标
    contentArea2.style.width = `${window.innerWidth - sidebarRect.right}px`;
    contentArea0.style.left = `${sidebarRect.right}px`;
    
    // 同时设置宽度为窗口总宽度 - sidebar 的右侧 x 坐标
    contentArea0.style.width = `${window.innerWidth - sidebarRect.right}px`;
    }

// 在页面加载完成时和窗口调整大小时调用
document.addEventListener('DOMContentLoaded', adjustContentAreaPosition);
window.addEventListener('resize', adjustContentAreaPosition);