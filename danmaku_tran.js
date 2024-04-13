// 修改 danmaku_tran.js 以支持模块化调用
const fs = require('fs');
const path = require('path');

function convertHexColorToCSS(hex) {
    return '#' + hex.toString(16).padStart(6, '0');
}

function modeFromNumber(num) {
    switch (num) {
        case 1: return 'rtl';
        case 2: return 'top';
        case 3: return 'bottom';
        default: return 'rtl';
    }
}

function formatComment(comment) {
    const time = comment.time;
    const text = comment.text.replace(/'/g, "\\'");
    const mode = comment.mode;
    const fontSize = comment.style.fontSize;
    const color = comment.style.color;
    const textShadow = comment.style.textShadow;
    return `{ time: ${time}, text: '${text}', mode: '${mode}', style: { fontSize: '${fontSize}', color: '${color}', textShadow: '${textShadow}' } }`;
}

function processComments(jsonFilePath, outputDir, callback) {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read JSON file:', err);
            return callback(err);
        }

        const jsonData = JSON.parse(data);
        const comments = jsonData.comments.map(comment => {
            const [time, mode, color] = comment.p.split(',');
            return {
                time: parseFloat(time),
                text: comment.m,
                mode: modeFromNumber(parseInt(mode)),
                style: {
                    fontSize: '30px',
                    color: convertHexColorToCSS(parseInt(color)),
                    textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
                }
            };
        });

        const formattedComments = comments.map(formatComment).join(',\n');
        const template = `var danmaku = new Danmaku({\n    container: document.getElementById('danmaku-container'),\n    media: document.getElementById('video-player'),\n    comments: [\n${formattedComments}\n]\n});`;
        console.log("输出目录路径:", outputDir);

        const outputFilePath = path.join(outputDir, path.basename(jsonFilePath, '.json') + '.js');

        fs.writeFile(outputFilePath, template, 'utf8', (err) => {
            if (err) {
                console.error('Failed to write JS file:', err);
                return callback(err);
            }
            console.log('JS file saved successfully:', outputFilePath);
            callback(null);
        });
    });
}

module.exports = { processComments };
