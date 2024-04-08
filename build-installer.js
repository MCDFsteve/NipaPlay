const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');

getInstallerConfig()
.then(createWindowsInstaller)
.catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

function getInstallerConfig () {
  console.log('creating windows installer');
  const rootPath = path.join('./');
  const outPath = path.join(rootPath, 'release-builds');

  return Promise.resolve({
    appDirectory: path.join(outPath, 'nipaplay-win32-x64/'), // 修改 ia32 为 x64
    authors: 'Nipaplay Inc.',
    description: '咪啪～☆', 
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'nipaplay.exe',
    setupExe: 'NipaplayInstaller.exe',
    setupIcon: path.join(__dirname, 'icon.ico')

  });
}
