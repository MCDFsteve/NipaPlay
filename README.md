# 📺Nipaplay 一款跨平台本地弹幕视频播放器。
## 主要平台为macOS，也是基于macOS开发，其他平台仅做移植。
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

