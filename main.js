const { app, BrowserWindow, ipcMain, dialog, session, screen, nativeTheme, Menu, globalShortcut, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

// 创建主窗口实例
let mainWindow;
// 创建关于窗口实例
let aboutWindow;
let videoWindow; // 假设这是创建视频播放窗口时的引用

ipcMain.on('toggle-fullscreen', (event) => {
    if (videoWindow) {
        videoWindow.setFullScreen(!videoWindow.isFullScreen());
    }
});
// 监听应用程序准备就绪事件
app.on('ready', () => {
    // 清除缓存
    session.defaultSession.clearCache().then(() => {
        console.log('Cache cleared');
    });
    // 注册全局快捷键 Command + Q
    const ret = globalShortcut.register('Command+Q', () => {
        // 结束应用程序
        app.quit();
    });

    // 检查注册快捷键的状态
    if (!ret) {
        console.error('Registration failed');
    }

    // 打印当前注册的快捷键
    console.log(globalShortcut.isRegistered('Command+Q')); // true
    // 打印当前主题模式和主题来源
    const isDarkMode = nativeTheme.shouldUseDarkColors;
    console.log('Current theme mode:', isDarkMode);

    // 创建主窗口
    createMainWindow();

    // 创建菜单

    // 初始化应用程序主题
    updateTheme(isDarkMode);
});
ipcMain.on('select-video', async (event) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'], // 允许选择文件和文件夹
        filters: [{ name: 'Videos', extensions: ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'm4v', 'webm'] }]
    });

    if (!canceled && filePaths.length > 0) {
        const selectedPath = filePaths[0];

        fs.stat(selectedPath, (err, stats) => {
            if (err) {
                console.error(`An error occurred: ${err.message}`);
                return;
            }

            // 直接使用目录名作为文件名尝试构建视频文件路径
            if (stats.isDirectory()) {
                // 通过目录名获取可能的文件名（包括扩展名）
                const dirName = path.basename(selectedPath);
                // 构建假定的视频文件路径
                const assumedFilePath = path.join(selectedPath, dirName);

                // 检查假定的文件是否存在
                if (fs.existsSync(assumedFilePath)) {
                    console.log('Found video file path:', assumedFilePath);
                    ffmpegif(assumedFilePath);
                } else {
                    const errorMsg = `The assumed video file does not exist: ${assumedFilePath}`;
                    console.error(errorMsg);
                    // Optionally, send this error back to the renderer process
                    event.sender.send('file-not-found', errorMsg);
                }
            } else if (stats.isFile()) {
                ffmpegif(selectedPath); // 直接打开选择的视频文件
            }
        });
    }
});
function ffmpegif(videoPath) {
    const ext = path.extname(videoPath).toLowerCase();
    if (ext === '.gif') {
        ffmpegWindow(videoPath);
    } else {
        createVideoWindow(videoPath)
    }
}
function ffmpegWindow(videoPath) {
    const isMac = process.platform === 'darwin';
    const ffmpegPath = isMac ? './ffmpeg/ffmpeg_mac' : './ffmpeg/ffmpeg_win/bin/ffmpeg.exe';
    const outputVideoPath = path.join('./cache', videoPath);  // 定义输出文件路径

    const { spawn } = require('child_process');
    const ffmpeg = spawn(ffmpegPath, [
        '-i', videoPath,            // 输入文件
        '-c:v', 'h264',             // 视频编解码器
        '-c:a', 'aac',              // 音频编解码器
        '-f', 'mp4',             // 使用 ffplay 播放器
        outputVideoPath             // 输出文件路径
    ]);

    // 监听 FFmpeg 子进程的输出
    ffmpeg.stdout.on('data', (data) => {
        console.log(`FFmpeg output: ${data}`);
    });

    // 监听 FFmpeg 子进程的错误输出
    ffmpeg.stderr.on('data', (data) => {
        console.error(`FFmpeg error: ${data}`);
    });

    // 监听 FFmpeg 子进程的退出事件
    ffmpeg.on('close', (code) => {
        console.log(`FFmpeg process exited with code ${code}`);

        // 如果 FFmpeg 成功处理视频，则创建视频窗口播放处理后的视频
        if (code === 0) {
            createVideoWindow(outputVideoPath); // 将处理后的视频路径传递给 createVideoWindow 函数
        }
    });
}

// 更新应用程序主题
function updateTheme(isDarkMode) {
    console.log('Theme updated. Dark mode:', isDarkMode);

    if (mainWindow) {
        mainWindow.webContents.send('update-theme', isDarkMode);
    }
}

// 创建关于窗口

// 监听系统主题变化
nativeTheme.on('updated', () => {
    if (mainWindow) {
        mainWindow.webContents.send('update-theme', nativeTheme.shouldUseDarkColors);
    }
});
ipcMain.handle('dialog:openFile', async (event, options) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: options.filters || []
    });
    if (canceled || filePaths.length === 0) {
        return '';
    } else {
        return filePaths[0]; // 返回选择的第一个文件路径
    }
});
ipcMain.handle('read-file', async (event, filePath) => {
    try {
        const content = fs.readFileSync(path.join(__dirname, filePath), { encoding: 'utf-8' });
        return { success: true, content };
    } catch (error) {
        return { success: false, error: error.message };
    }
});
// 在main.js中添加一个新的IPC事件监听器来处理从渲染进程发来的请求
ipcMain.on('open-video-file', (event, filePath) => {
    if (filePath) {
        ffmpegif(filePath); // 使用接收到的文件路径打开视频窗口
    } else {
        console.error('No file path provided');
    }
});
// 创建主窗口
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'window_icon.png'),
        //vibrancy: 'content-under', // 这里设置毛玻璃效果
        //visualEffectState: 'active',
        fullscreen: false,
        titleBarStyle: 'hiddenInset',
        //opacity:0.5,
        //vibrancy: 'medium-light',
        webPreferences: {
            webSecurity: false, // 注意: 在生产环境中慎用此项，因为它可能引入安全风险
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true, // 确保渲染进程的上下文隔离，这是现代Electron安全实践的一部分
        }
    });
    const menuTemplate = [
        {
            label: '菜单',
            submenu: [
                {
                    label: '导入视频',
                    click: async () => { // 注意这里使用了 async 关键字
                        const { canceled, filePaths } = await dialog.showOpenDialog({
                            properties: ['openFile'],
                            filters: [{ name: 'Videos', extensions: ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'm4v', 'webm'] }]
                        });

                        if (!canceled && filePaths.length > 0) {
                            const selectedPath = filePaths[0];

                            fs.stat(selectedPath, (err, stats) => {
                                if (err) {
                                    console.error(`An error occurred: ${err.message}`);
                                    return;
                                }

                                if (stats.isDirectory()) {
                                    // 通过目录名获取可能的文件名（包括扩展名）
                                    const dirName = path.basename(selectedPath);
                                    // 构建假定的视频文件路径
                                    const assumedFilePath = path.join(selectedPath, dirName);

                                    // 检查假定的文件是否存在
                                    if (fs.existsSync(assumedFilePath)) {
                                        console.log('Found video file path:', assumedFilePath);
                                        ffmpegif(assumedFilePath);
                                    } else {
                                        const errorMsg = `The assumed video file does not exist: ${assumedFilePath}`;
                                        console.error(errorMsg);
                                        // Optionally, send this error back to the renderer process
                                        event.sender.send('file-not-found', errorMsg);
                                    }
                                } else if (stats.isFile()) {
                                    ffmpegif(selectedPath); // 使用选择的视频文件
                                }
                            });
                        }
                    }
                },
                {
                    label: '清除观看记录',
                    click: () =>
                        confirmDeleteWatchHistory()
                }
            ]
        }
    ];
    function confirmDeleteWatchHistory() {
        const window = BrowserWindow.getFocusedWindow();
        dialog.showMessageBox(window, {
            type: 'question',
            buttons: ['是', '否'],
            defaultId: 1,
            title: '确认',
            message: '确定要删除观看记录吗？如果是为了防止被SERN的梯队系统捕捉到，请选择“是”。',
            noLink: true,
        }).then(result => {
            if (result.response === 0) { // 用户点击了"是"
                window.webContents.send('clear-watched-videos');
                app.clearRecentDocuments();
            }
        });
    }
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
    mainWindow.webContents.on('did-start-loading', () => {
        mainWindow.webContents.send('update-theme', nativeTheme.shouldUseDarkColors);
    });
    // 当主窗口被关闭时，结束程序
    mainWindow.on('closed', () => {
        app.quit(); // 结束应用程序
    });
    mainWindow.loadFile('index.html');
    mainWindow.resizable = false;
}

// 监听来自 video-player.html 的消息，更新观看记录并重新加载 index.html 页面
ipcMain.on('update-watched-video', (event, videoRecord) => {
    // 发送消息到主窗口的渲染进程，而不是重新加载窗口
    // 在Dock上设置这个菜单
    app.addRecentDocument(videoRecord.path);

    mainWindow.webContents.send('watched-video-updated', videoRecord);
});
ipcMain.on('toggle-fullscreen', (event) => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
        window.setFullScreen(!window.isFullScreen());
    }
});
// 创建视频窗口
function createVideoWindow(videoPath) {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const videoWindow = new BrowserWindow({
        width: width,
        height: height,
        x: 0,
        y: 0,
        icon: path.join(__dirname, 'window_icon_play.png'),
        autoHideMenuBar: true,
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    console.log("Video window created.");
    videoWindow.loadFile('video-player.html', { query: { path: videoPath } });
    // 根据操作系统类型设置 resizable 的值
    if (process.platform === 'darwin') {
        videoWindow.resizable = false; // macOS
    } else {
        videoWindow.resizable = true; // Windows
    }
}
// 监听应用程序退出事件
app.on('window-all-closed', () => {
    // 在 macOS 上，关闭所有窗口后退出应用程序
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
ipcMain.on('window-action', (event, action) => {
    const window = BrowserWindow.getFocusedWindow();
    if (action === 'close') {
        window.close();
    }
    // 处理其他动作...
});
// 监听应用程序激活事件
app.on('activate', () => {
    // 在 macOS 上，点击 Dock 图标时没有打开的窗口时，创建一个新的窗口
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

app.whenReady().then(() => {
    app.setAppUserModelId('com.dfsteve.nipaplay'); // 设置应用程序的 User Model ID
    app.setBadgeCount(0); // 设置任务栏图标上的计数
    app.dock.setIcon(path.join(__dirname, 'window_icon.png')); 
    protocol.registerFileProtocol('atom', (request, callback) => {
        const url = request.url.substr(7); // 移除协议名 "atom://"
        const decodedPath = decodeURI(path.normalize(url)); // 对路径进行解码和标准化
        callback(decodedPath);
      });
});
app.on('open-file', (event, filePath) => {
    // 该事件可能在应用程序启动前触发，所以你需要确保主窗口已经创建
    if (mainWindow) {
        createVideoWindow(filePath);
    } else {
        // 如果窗口尚未创建，你可以存储这个路径，并在窗口准备好后再打开视频
        app.once('ready', () => createVideoWindow(filePath));
    }
});
//////
