danmaku.emit({
    text: 'example',
  
    // 默认为 rtl（从右到左），支持 ltr、rtl、top、bottom。
    mode: 'rtl',
  
    // 弹幕显示的时间，单位为秒。
    // 在使用媒体模式时，如果未设置，会默认为音视频的当前时间；实时模式不需要设置。
    time: 233.3,
  
    // 在使用 DOM 引擎时，Danmaku 会为每一条弹幕创建一个 <div> 节点，
    // style 对象会直接设置到 `div.style` 上，按 CSS 规则来写。
    // 例如：
    style: {
      fontSize: '20px',
      color: '#ffffff',
      border: '1px solid #337ab7',
      textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
    },
  
    // 在使用 canvas 引擎时，Danmaku 会为每一条弹幕创建一个 <canvas> 对象，
    // 需要按 CanvasRenderingContext2D 对象的格式来写。
    // 例如：
    style: {
      font: '10px sans-serif',
      textAlign: 'start',
      // 注意 bottom 是默认的
      textBaseline: 'bottom',
      direction: 'inherit',
      fillStyle: '#000',
      strokeStyle: '#000',
      lineWidth: 1.0,
      // ...
    },
  
    // 自定义渲染器，当 `render` 字段存在时, `text`, `html` 和 `style` 将被忽略。
  
    // 在使用 DOM 引擎时，该函数应当返回一个 HTMLElement。
    render: function() {
      var $div = document.createElement('div');
      var $img = document.createElement('img');
      $img.src = '/path/to/xxx.png';
      $div.appendChild($img);
      return $div;
    },
    // 在使用 canvas 引擎时，该函数应当返回一个 HTMLCanvasElement。
    render: function() {
      var canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 180;
      var ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.arc(75, 75, 50, 0, 2 * Math.PI);
      ctx.stroke();
      return canvas;
    }
  });