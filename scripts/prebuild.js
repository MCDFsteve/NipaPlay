const fs = require('fs');
const path = require('path');
const os = require('os');

const args = process.argv.slice(2);
const targetOS = args[0];
const arch = os.arch(); // 获取系统架构

const baseFiles = [
  "**/*",
  "!**/*.ts",
  "!*.code-workspace",
  "!**/*.js.map",
  "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
  "!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
  "!**/node_modules/*.d.ts",
  "!**/node_modules/.bin",
  "!**/*.{o,hprof,orig,pyc,pyo,rbc}",
  "!**/._*",
  "!**/electron-builder.yml",
  "!**/.DS_Store",
  "!**/*.bak"
];

let targetSpecificFiles = [];

switch (targetOS) {
  case 'mac':
    targetSpecificFiles = [
      "!**/ffmpeg/ffmpeg_win",
      "!**/ffmpeg/ffmpeg_linux64",
      "!**/ffmpeg/ffmpeg_linuxarm"
    ];
    break;
  case 'win':
    targetSpecificFiles = [
      "!**/ffmpeg/ffmpeg_mac",
      "!**/ffmpeg/ffmpeg_linux64",
      "!**/ffmpeg/ffmpeg_linuxarm"
    ];
    break;
  case 'linux':
    if (arch === 'x64') {
      targetSpecificFiles = [
        "!**/ffmpeg/ffmpeg_mac",
        "!**/ffmpeg/ffmpeg_win",
        "!**/ffmpeg/ffmpeg_linuxarm"
      ];
    } else if (arch === 'arm64') {
      targetSpecificFiles = [
        "!**/ffmpeg/ffmpeg_mac",
        "!**/ffmpeg/ffmpeg_win",
        "!**/ffmpeg/ffmpeg_linux64"
      ];
    } else {
      targetSpecificFiles = [
        "!**/ffmpeg/ffmpeg_mac",
        "!**/ffmpeg/ffmpeg_win"
      ];
    }
    break;
  default:
    throw new Error(`Unknown target OS: ${targetOS}`);
}

const files = baseFiles.concat(targetSpecificFiles);

const configPath = path.join(__dirname, '..', 'package.json');

try {
  const packageJson = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  
  // Update the files property
  packageJson.build = packageJson.build || {};
  packageJson.build.files = files;
  
  fs.writeFileSync(configPath, JSON.stringify(packageJson, null, 2), 'utf-8');
  
  console.log(`Updated electron-builder config for ${targetOS} (${arch})`);
  console.log(JSON.stringify(packageJson.build.files, null, 2));
} catch (error) {
  console.error(`Failed to update config: ${error.message}`);
}
