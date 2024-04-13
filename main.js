const { app, BrowserWindow, ipcMain, dialog, session, screen, nativeTheme, Menu, globalShortcut, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

// 创建主窗口实例
let mainWindow;
// 创建关于窗口实例 s
let videoWindow; // 假设这是创建视频播放窗口时的引用
ipcMain.on('toggle-fullscreen', (event) => {
    if (videoWindow) {
        videoWindow.setFullScreen(!videoWindow.isFullScreen());
    }
});
function calculateFileHash(filePath, algorithm = 'sha256') {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        const stream = fs.createReadStream(filePath);

        stream.on('error', err => reject(err));
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
}
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
        openVideoAndFetchDetails(videoPath);
    }
};
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
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // 等待窗口加载完成后发送文件路径
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
            message: '确定要删除观看记录和所有识别结果吗？如果是为了防止被SERN的梯队系统捕捉到，请选择“是”。',
            noLink: true,
        }).then(result => {
            if (result.response === 0) { // 用户点击了"是"
                window.webContents.send('clear-watched-videos');
                app.clearRecentDocuments();
                clearAllRecognitionResults(); // 调用清除识别结果的函数
            }
        });
    }

    // 清除所有识别结果
    function clearAllRecognitionResults() {
        const store = new Store(); // 确保你已经在代码其他部分实例化了 Store
        store.clear(); // 清除存储中的所有数据
        clearDirectory(path.join(__dirname, 'video_comment'));
        clearDirectory(path.join(__dirname, 'danmaku'));
        console.log('所有识别结果已清除');
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

function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;  // 返回文件大小（单位：字节）
    } catch (error) {
        console.error('获取文件大小时发生错误:', error);
        return null;  // 如果发生错误，返回 null
    }
}
const Store = require('electron-store');
const store = new Store();

// 保存识别结果
function saveRecognitionResult(videoPath, result) {
    const hash = crypto.createHash('md5').update(videoPath).digest('hex');
    console.log(`Saving result for hash: ${hash}`);
    store.set(hash, result);
}

// 获取识别结果
function getRecognitionResult(videoPath) {
    const hash = crypto.createHash('md5').update(videoPath).digest('hex');
    console.log(`Getting result for hash: ${hash}`);
    return store.get(hash);
}

// 这段代码假设在 main.js 文件中有相关的全局变量定义
let loadingWindow;  // 确保这是全局变量
const { processComments } = require('./danmaku_tran.js');
async function openVideoAndFetchDetails(videoPath, episodeId) {
    console.log("函数开始执行，视频路径：", videoPath);
    const jsonFilePath = path.join(__dirname, 'video_comment', `${episodeId}.json`);
    const outputDir = path.join(__dirname, 'danmaku');
    // 显示加载中窗口
    if (!loadingWindow || loadingWindow.isDestroyed()) {
        loadingWindow = new BrowserWindow({
            width: 300,
            height: 200,
            frame: false,
            alwaysOnTop: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });
        loadingWindow.loadURL(`file://${__dirname}/loading.html`);
    }

    try {
        // 检查是否已有识别结果
        const existingResult = await getRecognitionResult(videoPath);
        console.log("Existing result:", existingResult);
        if (existingResult) {
            console.log("使用已存储的识别结果:", existingResult);
            const episodeId = existingResult.episodeId;
            const newTitle = existingResult.newTitle;
            // 构造 JSON 文件路径，使用 episodeId 作为文件名
            const jsonFilePath = path.join(__dirname, 'video_comment', `${episodeId}.json`);
            processComments(jsonFilePath, outputDir, (err) => {
                if (err) {
                    console.error('Error processing comments:', err);
                    return;
                }
                // 弹幕处理完毕后，继续创建视频窗口
                createVideoWindow(videoPath, newTitle, episodeId);
            });
        } else {
            console.log("未找到存储结果，开始识别:", videoPath);
            const response = await recognizeVideo(videoPath);

            if (response.isMatched) {
                const newTitle = `${response.animeTitle} ${response.episodeTitle}`;
                const recognitionResult = {
                    newTitle: newTitle,
                    episodeId: response.episodeId // 将 episodeId 放入 recognitionResult 对象中
                };
                saveRecognitionResult(videoPath, recognitionResult);
                createSelectionWindow(response.matches, videoPath, episodeId);
            } else {
                createSelectionWindow(response.matches, videoPath, episodeId);
            }
        }
    } catch (error) {
        console.error("请求过程中发生错误:", error);
    } finally {
        // 无论如何关闭加载中窗口
        if (loadingWindow && !loadingWindow.isDestroyed()) {
            loadingWindow.close();
        }
    }
}
async function recognizeVideo(videoPath) {
    const hash = await calculateFileHash(videoPath, 'md5');
    const fileSize = getFileSize(videoPath);
    return axios.post('https://api.dandanplay.net/api/v2/match', {
        fileName: path.basename(videoPath),
        fileHash: hash,
        fileSize: fileSize,
        matchMode: "hashAndFileName"
    }).then(response => {
        return {
            isMatched: response.data && response.data.isMatched,
            matches: response.data.matches,
            animeTitle: response.data.matches[0]?.animeTitle,
            episodeTitle: response.data.matches[0]?.episodeTitle
        };
    }).catch(error => {
        console.error("请求过程中发生错误:", error);
        return { isMatched: false };
    });
}

// 创建视频窗口
function createVideoWindow(videoPath, newTitle, episodeId) {
    console.log("创建视频窗口，使用的视频路径：", videoPath);
    const danmakuFilePath = path.join('danmaku', `${episodeId}.js`);
    console.log("创建视频窗口，使用的弹幕路径：", danmakuFilePath);
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    if (selectionWindow && !selectionWindow.isDestroyed()) {
        selectionWindow.close();
    }

    // 创建一个新的 BrowserWindow 实例
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
        },
        resizable: process.platform === 'darwin' ? false : true // MacOS不允许调整窗口大小，Windows允许
    });
    videoWindow.webContents.on('did-finish-load', () => {
        const filePath = path.join(app.getAppPath(), danmakuFilePath);
        const content = fs.readFileSync(filePath, 'utf8');
        videoWindow.webContents.send('file-content', content);
    });
    // 使用 encodeURIComponent 确保标题中的特殊字符被正确处理
    const encodedTitle = encodeURIComponent(newTitle || '');
    const url = `file://${__dirname}/video-player.html?path=${encodeURIComponent(videoPath)}&title=${encodeURIComponent(newTitle)}&episodeId=${episodeId}`;
    videoWindow.loadURL(url);
    console.log(url);
    const recognitionResult = {
        newTitle: newTitle,
        episodeId: episodeId // 将 episodeId 放入 recognitionResult 对象中
    };
    saveRecognitionResult(videoPath, recognitionResult);
    // 根据是否提供了新标题来设置窗口标题
    if (newTitle) {
        videoWindow.setTitle(decodeURIComponent(encodedTitle)); // 使用提供的新标题
    } else {
        const defaultTitle = videoPath.split('/').pop().split('.').slice(0, -1).join('.');
        videoWindow.setTitle(defaultTitle); // 从视频文件路径中提取并使用原有逻辑设置标题
    }

    console.log("Video window created for path:", videoPath, "with title:", newTitle);


}

let selectionWindow
// 在 createSelectionWindow 中检查并移除旧的处理器
function createSelectionWindow(matches, videoPath, episodeId) {
    console.log("匹配成功，即将播放的视频路径：", videoPath);
    loadingWindow.close();
    if (selectionWindow) {
        selectionWindow.close();  // 确保关闭旧的选择窗口
    }
    selectionWindow = new BrowserWindow({
        width: 500,
        height: 333,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false
        }
    });

    selectionWindow.loadURL(`file://${__dirname}/selection.html`);

    selectionWindow.webContents.once('did-finish-load', () => {
        console.log("Sending matches to the selection window:", matches);
        selectionWindow.webContents.send('update-selection', matches);
    });

    // 移除旧的事件处理器，如果存在
    if (ipcMain.listenerCount('process-selection') > 0) {
        ipcMain.removeHandler('process-selection');
    }

    // 注册新的事件处理器
    // 修改或添加在 ipcMain.handle('process-selection', ...) 中的逻辑
    ipcMain.handle('process-selection', async (event, selectedMatch) => {
        const newTitle = `${selectedMatch.animeTitle} ${selectedMatch.episodeTitle}`;
        const episodeId = selectedMatch.episodeId;
        const jsonFilePath = path.join(__dirname, 'video_comment', `${episodeId}.json`);
        const outputDir = path.join(__dirname, 'danmaku');
        processComments(jsonFilePath, outputDir, (err) => {
            if (err) {
                console.error('Error processing comments:', err);
                return;
            }
            // 弹幕处理完毕后，继续创建视频窗口
            createVideoWindow(videoPath, newTitle, episodeId);
        });

        // 执行 GET 请求
        if (selectedMatch.episodeId) {
            try {
                const response = await axios.get(`https://api.dandanplay.net/api/v2/comment/${selectedMatch.episodeId}?withRelated=true&chConvert=1`, {
                    headers: { 'Accept': 'application/json' }
                });
                saveCommentToJson(response.data, selectedMatch.episodeId, videoPath);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        }
        return 'Selection processed';
    });

    function saveCommentToJson(data, episodeId, videoPath) {
        const directoryPath = path.join(__dirname, 'video_comment');
        fs.mkdirSync(directoryPath, { recursive: true });

        const fileName = `${episodeId}.json`;
        const filePath = path.join(directoryPath, fileName);

        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            console.log('Comments saved to:', filePath);
            console.log('Successfully retrieved and saved comments for episode ID:', episodeId);
        } catch (error) {
            console.error('Failed to save comments:', error);
        }
    }

    selectionWindow.on('closed', () => {
        ipcMain.removeHandler('process-selection');  // 清除处理器，避免内存泄漏
        selectionWindow = null;  // 清除引用
    });
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
