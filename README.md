# Nipaplay 一款跨平台本地弹幕视频播放器。弹弹play 的macOS代餐。主要平台为macOS，也是基于macOS开发，其他平台仅做移植。
## 特色：
#### •似乎没有（大嘘）。
#### •electron开发，html5播放器内核（支持mkv），内存和性能消耗低，自动调用GPU解码。
#### •支持加载内嵌字幕（ass和srt）的视频。
#### •支持跨平台，不管是Windows还是macOS还是linux（待开发）都提供一致的视觉体验和操作。
#### •macOS风格的界面UI，支持毛玻璃效果，visionPro风格的播放器界面。
#### •支持跟随系统自动切换深色浅色模式。
#### •播放器窗口和主窗口分离，可以同时播放多个视频（谁会需要这玩意）。

#### 直接在右侧下载最新包即可使用。目前支持Windows版和macOS版。
<img width="800" alt="image" src="https://github.com/MCDFsteve/NipaPlay/assets/71605531/cc32f3db-479f-4fb7-9867-7f72b0ba7856">
<img width="1440" alt="image" src="https://github.com/MCDFsteve/NipaPlay/assets/71605531/811ed6fb-f928-452e-b0f2-3921f4647aa0">





#### 如果你想进行二次开发，请看下面：
### 如何部署？
#### 首先为你的设备安装nodejs。
在 Windows 上使用 Chocolatey 包管理器安装 Node.js：

```
choco install nodejs
```
在 macOS 上使用 Homebrew 包管理器安装 Node.js：
```
brew install node
```
在 Ubuntu 或其他基于 Debian 的 Linux 发行版上使用 apt 包管理器安装 Node.js：
```
sudo apt update
sudo apt install nodejs
```
安装完成后，可以使用以下命令验证 Node.js 是否成功安装：
```
node -v
```
接下来，你可以使用 npm（Node.js 包管理器）来安装 Electron。找一个你找得到的文件夹，或者新建一个，当做你的项目文件夹。终端cd到这个文件夹。在已安装了 Node.js 的情况下，运行以下命令安装 Electron：
```
npm install electron
```
这将在当前目录下的 node_modules 文件夹中安装 Electron。

请注意，如果你希望全局安装 Electron，可以使用 -g 或 --global 标志：
```
npm install electron -g
```
这样，Electron 将在全局范围内可用，你可以在任何项目中使用它。
安装完以后怎么做？将这个github项目的代码下载以后丢到项目根目录，然后输入
```
npm start
```
启动这个项目。
项目根据需要，需要自己准备[ffmpeg](https://ffmpeg.org)（不需要也可以在main.js内移除下面这段：）
```javascript
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
```
并将剩余代码所有的 <span style="background-color: #333; color: #fff; padding: 2px 4px;">ffmpegif</span> 替换为 <span style="background-color: #333; color: #fff; padding: 2px 4px;">createVideoWindow</span> 。

