const { contextBridge, ipcRenderer, nativeTheme } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    selectVideo: () => ipcRenderer.send('select-video'),
    onVideoSelected: (callback) => ipcRenderer.on('video-selected', callback),
    selectSubtitleFile: async () => {
        return await ipcRenderer.invoke('dialog:openFile', {
            filters: [{ name: '字幕', extensions: ['vtt', 'ass'] }]
        });
    },    
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
    getSystemThemeMode: () => nativeTheme.shouldUseDarkColors, // 直接返回布尔值
    sendToMain: (channel, data) => ipcRenderer.send(channel, data),
    sendDebugToMain: (message) => ipcRenderer.send('preload-message', message),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    toggleFullscreen: () => ipcRenderer.send('toggle-fullscreen')
});
