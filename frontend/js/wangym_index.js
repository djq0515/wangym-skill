// 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash
// 首页 canvas 粒子连线背景动画
(function () {
  var wangymCanvas = document.getElementById('wangym_canvas');
  if (!wangymCanvas) {
    return;
  }
  var wangymCtx = wangymCanvas.getContext('2d');
  var wangymParticles = [];
  var wangymMouse = { x: -9999, y: -9999, active: false };
  var wangymWidth = 0;
  var wangymHeight = 0;
  var wangymLinkDistance = 130;

  function wangymResizeCanvas() {
    wangymWidth = window.innerWidth;
    wangymHeight = window.innerHeight;
    var wangymRatio = window.devicePixelRatio || 1;
    wangymCanvas.width = wangymWidth * wangymRatio;
    wangymCanvas.height = wangymHeight * wangymRatio;
    wangymCanvas.style.width = wangymWidth + 'px';
    wangymCanvas.style.height = wangymHeight + 'px';
    wangymCtx.setTransform(wangymRatio, 0, 0, wangymRatio, 0, 0);
  }

  function wangymCreateParticles() {
    var wangymCount = Math.min(110, Math.floor((wangymWidth * wangymHeight) / 16000));
    wangymParticles = [];
    for (var wangymI = 0; wangymI < wangymCount; wangymI++) {
      wangymParticles.push({
        x: Math.random() * wangymWidth,
        y: Math.random() * wangymHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 0.8
      });
    }
  }

  function wangymDrawFrame() {
    wangymCtx.clearRect(0, 0, wangymWidth, wangymHeight);

    for (var wangymI = 0; wangymI < wangymParticles.length; wangymI++) {
      var wangymP = wangymParticles[wangymI];
      wangymP.x += wangymP.vx;
      wangymP.y += wangymP.vy;

      if (wangymP.x < 0 || wangymP.x > wangymWidth) {
        wangymP.vx *= -1;
      }
      if (wangymP.y < 0 || wangymP.y > wangymHeight) {
        wangymP.vy *= -1;
      }

      if (wangymMouse.active) {
        var wangymDx = wangymP.x - wangymMouse.x;
        var wangymDy = wangymP.y - wangymMouse.y;
        var wangymDist = Math.sqrt(wangymDx * wangymDx + wangymDy * wangymDy);
        if (wangymDist < 120 && wangymDist > 0.1) {
          wangymP.x += (wangymDx / wangymDist) * 0.6;
          wangymP.y += (wangymDy / wangymDist) * 0.6;
        }
      }

      wangymCtx.beginPath();
      wangymCtx.arc(wangymP.x, wangymP.y, wangymP.r, 0, Math.PI * 2);
      wangymCtx.fillStyle = 'rgba(143, 208, 255, 0.85)';
      wangymCtx.fill();
    }

    for (var wangymA = 0; wangymA < wangymParticles.length; wangymA++) {
      for (var wangymB = wangymA + 1; wangymB < wangymParticles.length; wangymB++) {
        var wangymPA = wangymParticles[wangymA];
        var wangymPB = wangymParticles[wangymB];
        var wangymGapX = wangymPA.x - wangymPB.x;
        var wangymGapY = wangymPA.y - wangymPB.y;
        var wangymGap = Math.sqrt(wangymGapX * wangymGapX + wangymGapY * wangymGapY);
        if (wangymGap < wangymLinkDistance) {
          wangymCtx.beginPath();
          wangymCtx.moveTo(wangymPA.x, wangymPA.y);
          wangymCtx.lineTo(wangymPB.x, wangymPB.y);
          wangymCtx.strokeStyle = 'rgba(0, 132, 255, ' + (0.28 * (1 - wangymGap / wangymLinkDistance)).toFixed(3) + ')';
          wangymCtx.lineWidth = 0.8;
          wangymCtx.stroke();
        }
      }
    }

    window.requestAnimationFrame(wangymDrawFrame);
  }

  function wangymHandleMouseMove(wangymEvent) {
    wangymMouse.x = wangymEvent.clientX;
    wangymMouse.y = wangymEvent.clientY;
    wangymMouse.active = true;
  }

  function wangymHandleMouseLeave() {
    wangymMouse.active = false;
    wangymMouse.x = -9999;
    wangymMouse.y = -9999;
  }

  function wangymHandleResize() {
    wangymResizeCanvas();
    wangymCreateParticles();
  }

  function wangymInitCanvas() {
    wangymResizeCanvas();
    wangymCreateParticles();
    window.requestAnimationFrame(wangymDrawFrame);
    window.addEventListener('resize', wangymHandleResize);
    window.addEventListener('mousemove', wangymHandleMouseMove);
    window.addEventListener('mouseout', wangymHandleMouseLeave);
    console.log('[wangym_index] canvas 背景动画已启动');
  }

  wangymInitCanvas();
})();
