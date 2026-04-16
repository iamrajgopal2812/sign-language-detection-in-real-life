// ═══════════════════════════ MEDIAPIPE + CAMERA ═══════════════════════════

let mpHands = null, camera = null;
let lastFPS = Date.now(), fpsFC = 0;

async function startCamera() {
  document.getElementById('perm').style.display = 'none';

  const video  = document.getElementById('videoEl');
  const canvas = document.getElementById('canvasEl');
  const ctx    = canvas.getContext('2d');

  function resize() {
    const w = document.querySelector('.cam-wrap');
    canvas.width  = w.clientWidth;
    canvas.height = w.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  mpHands = new Hands({
    locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
  });
  mpHands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: .7,
    minTrackingConfidence: .6
  });

  mpHands.onResults(results => {
    // FPS counter
    fpsFC++;
    const now = Date.now();
    if (now - lastFPS >= 1000) {
      document.getElementById('fpsBadge').textContent =
        Math.round(fpsFC * 1000 / (now - lastFPS)) + ' FPS';
      fpsFC = 0; lastFPS = now;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks?.length > 0) {
      const lms = results.multiHandLandmarks[0];
      drawConnectors(ctx, lms, HAND_CONNECTIONS, { color: 'rgba(0,170,255,0.6)', lineWidth: 2 });
      drawLandmarks(ctx, lms, { color: 'rgba(0,229,160,0.9)', fillColor: 'rgba(0,229,160,0.25)', lineWidth: 1, radius: 3.5 });

      const res = classifyHand(lms);
      if (res) {
        const { l, c: conf } = res;
        if (!isAllowed(l)) { updateUI('', 0, 0); return; }
        if (l === lastLetter) stabCount++; else { stabCount = 1; lastLetter = l; }
        updateUI(l, conf + Math.random() * 3 - 1.5, stabCount);
        const nowMs = Date.now();
        if (stabCount >= STABILITY && nowMs - lastInsert > COOLDOWN) {
          insertGesture(l);
          addHist(l, conf);
          lastInsert = nowMs;
          stabCount = 0;
        }
      } else {
        stabCount = 0; lastLetter = ''; updateUI('', 0, 0);
      }
    } else {
      stabCount = 0; lastLetter = ''; updateUI('', 0, 0);
    }
  });

  camera = new Camera(video, {
    onFrame: async () => { await mpHands.send({ image: video }); },
    width: 640,
    height: 480
  });
  await camera.start();
}
