import * as THREE from 'three';

// Procedural high-resolution wood grain texture generator
export function createWoodTexture(isDark = true): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  if (typeof document === 'undefined') {
    const dummy = new THREE.CanvasTexture({} as any);
    return { map: dummy, roughnessMap: dummy, bumpMap: dummy };
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const rCanvas = document.createElement('canvas');
  rCanvas.width = 1024;
  rCanvas.height = 1024;
  const rCtx = rCanvas.getContext('2d')!;

  // Base wood colors: Canaletto Walnut
  const baseColor = isDark ? '#261B13' : '#38281B';
  const midColor = isDark ? '#33241A' : '#473424';
  const darkGrain = isDark ? '#140D08' : '#22160E';
  const lightGrain = isDark ? '#423023' : '#574130';

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 1024, 1024);

  rCtx.fillStyle = '#666666';
  rCtx.fillRect(0, 0, 1024, 1024);

  const numLines = 650;
  for (let i = 0; i < numLines; i++) {
    const y = Math.random() * 1024;
    const waveFreq = 0.003 + Math.random() * 0.008;
    const waveAmp = 15 + Math.random() * 35;
    const alpha = 0.08 + Math.random() * 0.25;

    ctx.strokeStyle = Math.random() > 0.4 ? darkGrain : lightGrain;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 0.8 + Math.random() * 2.5;

    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 16) {
      const offset = Math.sin(x * waveFreq) * waveAmp + Math.cos(x * 0.002) * 10;
      ctx.lineTo(x, y + offset);
    }
    ctx.stroke();

    rCtx.strokeStyle = Math.random() > 0.5 ? '#444444' : '#888888';
    rCtx.globalAlpha = alpha * 0.7;
    rCtx.lineWidth = ctx.lineWidth;
    rCtx.beginPath();
    rCtx.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 16) {
      const offset = Math.sin(x * waveFreq) * waveAmp;
      rCtx.lineTo(x, y + offset);
    }
    rCtx.stroke();
  }

  ctx.globalAlpha = 1.0;
  rCtx.globalAlpha = 1.0;

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2, 2);

  const roughnessMap = new THREE.CanvasTexture(rCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(rCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  return { map, roughnessMap, bumpMap };
}

// Procedural Calacatta Gold White Marble with golden-brown and grey veins
export function createCalacattaGoldMarbleTexture(): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  if (typeof document === 'undefined') {
    const dummy = new THREE.CanvasTexture({} as any);
    return { map: dummy, roughnessMap: dummy };
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const rCanvas = document.createElement('canvas');
  rCanvas.width = 1024;
  rCanvas.height = 1024;
  const rCtx = rCanvas.getContext('2d')!;

  // Milky pure white/cream marble base
  ctx.fillStyle = '#FBF9F5';
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft misty grey/gold cloud washes
  for (let c = 0; c < 15; c++) {
    const cx = Math.random() * 1024;
    const cy = Math.random() * 1024;
    const cr = 200 + Math.random() * 350;
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, cr);
    grad.addColorStop(0, 'rgba(238, 230, 218, 0.5)');
    grad.addColorStop(0.5, 'rgba(244, 239, 232, 0.25)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);
  }

  // Golden-brown & amber prominent marble veins
  const veinColors = [
    'rgba(180, 142, 95, 0.45)', // Warm gold
    'rgba(145, 110, 72, 0.35)', // Amber brown
    'rgba(195, 165, 125, 0.4)', // Champagne
    'rgba(120, 115, 110, 0.25)', // Soft slate grey
  ];

  for (let v = 0; v < 16; v++) {
    let vx = Math.random() * 1024;
    let vy = Math.random() * 1024;
    const length = 400 + Math.random() * 700;
    const baseAngle = -0.6 + (Math.random() - 0.5) * 0.8;
    const color = veinColors[v % veinColors.length];

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5 + Math.random() * 5.0;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(vx, vy);

    for (let step = 0; step < length; step += 25) {
      const angle = baseAngle + Math.sin(step * 0.02) * 0.4 + (Math.random() - 0.5) * 0.3;
      vx += Math.cos(angle) * 25;
      vy += Math.sin(angle) * 25;
      ctx.lineTo(vx, vy);

      // Micro branch
      if (Math.random() < 0.12) {
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(vx, vy);
        const bAngle = angle + (Math.random() > 0.5 ? 0.7 : -0.7);
        ctx.lineTo(vx + Math.cos(bAngle) * 60, vy + Math.sin(bAngle) * 60);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(vx, vy);
      }
    }
    ctx.stroke();
  }

  // Polished marble specular & roughness map
  rCtx.fillStyle = '#2A2A2A'; // Highly polished (smooth)
  rCtx.fillRect(0, 0, 1024, 1024);

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.MirroredRepeatWrapping;
  map.wrapT = THREE.MirroredRepeatWrapping;

  const roughnessMap = new THREE.CanvasTexture(rCanvas);

  return { map, roughnessMap };
}

// Procedural Travertine Flooring Texture
export function createTravertineTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') {
    return new THREE.CanvasTexture({} as any);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm light beige travertine stone
  ctx.fillStyle = '#ECE6DB';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle sedimentary linear banding
  for (let y = 0; y < 1024; y += 4) {
    const alpha = 0.03 + Math.random() * 0.06;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(205, 195, 180, ' + alpha + ')' : 'rgba(245, 240, 232, ' + alpha + ')';
    ctx.fillRect(0, y, 1024, 3 + Math.random() * 3);
  }

  // Soft porous travertine micro-pits
  ctx.fillStyle = 'rgba(160, 148, 132, 0.18)';
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const w = 1.5 + Math.random() * 4.0;
    const h = 0.8 + Math.random() * 1.5;
    ctx.fillRect(x, y, w, h);
  }

  // Elegant tile grout lines
  ctx.strokeStyle = 'rgba(185, 175, 162, 0.45)';
  ctx.lineWidth = 1.2;
  const tileSize = 256;
  for (let x = 0; x <= 1024; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// Procedural Beige Upholstery Fabric (Warm Ivory / Sand Bouclé Weave)
export function createBeigeFabricTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') {
    return new THREE.CanvasTexture({} as any);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm cream/beige base
  ctx.fillStyle = '#EDE8DE';
  ctx.fillRect(0, 0, 512, 512);

  // Micro cross-weave texture
  for (let i = 0; i < 512; i += 3) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(215, 208, 195, 0.35)' : 'rgba(255, 252, 245, 0.4)';
    ctx.fillRect(i, 0, 1.5, 512);
    ctx.fillRect(0, i, 512, 1.5);
  }

  // Bouclé nubs
  ctx.fillStyle = 'rgba(190, 180, 165, 0.25)';
  for (let n = 0; n < 4000; n++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.beginPath();
    ctx.arc(x, y, 0.8 + Math.random() * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

// Procedural 3D Golden Brand Text Texture for the Tabletop
export function createGoldBrandTextTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') {
    return new THREE.CanvasTexture({} as any);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // 1. Rich brushed Champagne Gold Brass background
  const goldGrad = ctx.createLinearGradient(0, 0, 2048, 512);
  goldGrad.addColorStop(0.0, '#D4AF37');
  goldGrad.addColorStop(0.2, '#F5E6B3');
  goldGrad.addColorStop(0.4, '#C6A66B');
  goldGrad.addColorStop(0.6, '#FFF6D6');
  goldGrad.addColorStop(0.8, '#BA8B1E');
  goldGrad.addColorStop(1.0, '#D4AF37');
  ctx.fillStyle = goldGrad;
  ctx.fillRect(0, 0, 2048, 512);

  // Subtle horizontal brushed brass metal grain lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
  for (let i = 0; i < 512; i += 4) {
    if (Math.random() > 0.35) {
      ctx.fillRect(0, i, 2048, 1.5);
    }
  }
  ctx.fillStyle = 'rgba(100, 65, 15, 0.08)';
  for (let i = 0; i < 512; i += 5) {
    if (Math.random() > 0.35) {
      ctx.fillRect(0, i, 2048, 1.2);
    }
  }

  // 2. Outer engraved deep dark espresso borders
  ctx.strokeStyle = '#201206';
  ctx.lineWidth = 8;
  ctx.strokeRect(28, 20, 1992, 472);

  // Inner thin accent line
  ctx.lineWidth = 3;
  ctx.strokeRect(46, 38, 1956, 436);

  // Corner decorative rivets / screw heads
  const corners = [
    [46, 38],
    [2002, 38],
    [46, 474],
    [2002, 474],
  ];
  corners.forEach(([cx, cy]) => {
    // Rivet outer dark circle
    ctx.fillStyle = '#201206';
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fill();

    // Rivet inner gold reflection
    ctx.fillStyle = '#FFE599';
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fill();

    // Rivet slot
    ctx.strokeStyle = '#201206';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy);
    ctx.lineTo(cx + 6, cy);
    ctx.stroke();
  });

  // 3. Header Text: "✦ HAUTE ÉBÉNISTERIE · EST. 1994 ✦"
  ctx.save();
  ctx.font = '700 44px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#201206';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦   HAUTE ÉBÉNISTERIE · EST. 1994   ✦', 1024, 110);
  ctx.restore();

  // 4. Central Brand Title: "ATELIER KASAMA"
  // Deep luxury dark engraving with subtle gold relief shadow
  ctx.save();
  ctx.font = '900 155px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Light gold bottom highlight for 3D recessed depth into the gold
  ctx.fillStyle = 'rgba(255, 252, 230, 0.9)';
  ctx.fillText('ATELIER  KASAMA', 1024, 250);

  // Deep dark espresso engraved text
  ctx.fillStyle = '#160B04';
  ctx.fillText('ATELIER  KASAMA', 1024, 245);
  ctx.restore();

  // 5. Decorative separator rule with central diamond
  ctx.save();
  ctx.strokeStyle = '#201206';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(340, 345);
  ctx.lineTo(950, 345);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(1098, 345);
  ctx.lineTo(1708, 345);
  ctx.stroke();

  // Center diamond
  ctx.fillStyle = '#201206';
  ctx.beginPath();
  ctx.moveTo(1024, 330);
  ctx.lineTo(1040, 345);
  ctx.lineTo(1024, 360);
  ctx.lineTo(1008, 345);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 6. Subtitle: "MUMBAI · NEW DELHI · BENGALURU"
  ctx.save();
  ctx.font = '700 42px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#201206';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MUMBAI  ·  NEW DELHI  ·  BENGALURU', 1024, 412);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
