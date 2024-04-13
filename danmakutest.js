var danmaku = new Danmaku({
    container: document.getElementById('danmaku-container'),
    media: document.getElementById('video-player'),
    comments: [
{ time: 0, text: 'Panzer Vor', style: {fontSize: '30px',color: '#ffffff',textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000' },},
{ time: 2, text: 'Panzer Vor!!',mode: 'top', style: {fontSize: '30px',color: '#ffffff',textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000' }, },
{ time: 3, text: 'Panzer Vor!!!', mode: 'bottom',style: {fontSize: '30px',color: '#ffffff',textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000' }, }
],
});