import * as THREE from 'three';

/**
 * Procedural canvas texture generator with SRGBColorSpace
 */
export function createCodeScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  // Background dark IDE
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 320);

  // Tab bar
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 512, 32);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(10, 8, 120, 24);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('agent-core.ts', 24, 24);

  // Line numbers gutter
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 32, 40, 288);

  ctx.font = '12px monospace';
  for (let i = 1; i <= 14; i++) {
    ctx.fillStyle = '#64748b';
    ctx.fillText(`${i}`, 14, 34 + i * 19);

    // Code lines with syntax highlights
    const y = 34 + i * 19;
    const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#a855f7', '#34d399', '#94a3b8'];
    const w1 = 30 + (i * 17) % 60;
    const w2 = 40 + (i * 23) % 90;
    const w3 = 20 + (i * 31) % 70;

    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(52, y - 10, w1, 8);

    ctx.fillStyle = colors[(i + 2) % colors.length];
    ctx.fillRect(58 + w1, y - 10, w2, 8);

    if (i % 2 === 0) {
      ctx.fillStyle = colors[(i + 4) % colors.length];
      ctx.fillRect(64 + w1 + w2, y - 10, w3, 8);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createAnalyticsScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#0b1329';
  ctx.fillRect(0, 0, 512, 320);

  // Header
  ctx.fillStyle = '#3b82f6';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('INSPIRE WEBCRAFT - EXECUTIVE METRICS', 24, 36);

  // Stat Cards
  const cards = [
    { label: 'DELIVERY VELOCITY', val: '99.4%', color: '#10b981' },
    { label: 'AI REASONING TOKENS', val: '2.4M/d', color: '#6366f1' },
    { label: 'CLIENT SATISFACTION', val: '4.98/5', color: '#f59e0b' }
  ];

  cards.forEach((card, idx) => {
    const x = 24 + idx * 155;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, 54, 145, 60);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText(card.label, x + 10, 74);

    ctx.fillStyle = card.color;
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(card.val, x + 10, 102);
  });

  // Chart area
  ctx.fillStyle = '#131e3a';
  ctx.fillRect(24, 130, 464, 160);

  // Grid lines
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let y = 160; y <= 270; y += 35) {
    ctx.beginPath();
    ctx.moveTo(35, y);
    ctx.lineTo(475, y);
    ctx.stroke();
  }

  // Bar chart
  const barHeights = [45, 65, 80, 55, 95, 110, 125, 105, 135];
  barHeights.forEach((h, i) => {
    const bx = 50 + i * 46;
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(bx, 280 - h, 26, h);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createKanbanScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, 512, 320);

  // Header
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('ACTIVE SPRINT WORKFLOW', 20, 30);

  // 3 Columns: Backlog, In Progress, Done
  const cols = ['TO DO', 'IN PROGRESS', 'COMPLETED'];
  cols.forEach((col, cIdx) => {
    const cx = 20 + cIdx * 160;
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(cx, 46, 150, 255);

    ctx.fillStyle = '#9ca3af';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(col, cx + 12, 66);

    // Cards
    for (let r = 0; r < 3; r++) {
      const cy = 80 + r * 68;
      ctx.fillStyle = '#374151';
      ctx.fillRect(cx + 8, cy, 134, 56);

      ctx.fillStyle = cIdx === 2 ? '#34d399' : cIdx === 1 ? '#38bdf8' : '#fbbf24';
      ctx.fillRect(cx + 8, cy, 4, 56);

      ctx.fillStyle = '#f3f4f6';
      ctx.font = '10px sans-serif';
      ctx.fillText(`Task #${cIdx * 3 + r + 101}`, cx + 20, cy + 22);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '9px sans-serif';
      ctx.fillText('Inspire Client Engine', cx + 20, cy + 40);
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createWoodFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Base warm wood
  ctx.fillStyle = '#d4b996';
  ctx.fillRect(0, 0, 256, 256);

  // Wood planks lines
  ctx.strokeStyle = '#bfa17c';
  ctx.lineWidth = 2;
  const plankHeight = 32;

  for (let y = 0; y < 256; y += plankHeight) {
    ctx.strokeRect(0, y, 256, plankHeight);
    // Vertical joints staggered
    const offset = (y / plankHeight) % 2 === 0 ? 0 : 64;
    for (let x = offset; x < 256; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + plankHeight);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createTileFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, 252, 252);
  ctx.strokeRect(128, 0, 2, 256);
  ctx.strokeRect(0, 128, 256, 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Official Inspire WebCraft Brand Logo Texture Generator
 * Accurately reproduces the 3D blue geometric hexagon IW emblem,
 * "INSPIRE" in white/silver, "WEBCRAFT" in vibrant electric blue,
 * and "BERKEMBANG & BERMANFAAT" slogan.
 */
export function createInspireLogoTexture(variant: 'badge' | 'horizontal' | 'emblem' = 'badge'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');

  if (variant === 'horizontal') {
    canvas.width = 1024;
    canvas.height = 340;
    const ctx = canvas.getContext('2d')!;

    // Sleek dark backplate with subtle bevel gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 340);
    bgGrad.addColorStop(0, '#060d1f');
    bgGrad.addColorStop(0.5, '#020611');
    bgGrad.addColorStop(1, '#050b1a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 340);

    // Subtle metallic frame border
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 1016, 332);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, 1004, 320);

    // Left Hexagon IW Emblem
    ctx.save();
    ctx.translate(160, 170);
    drawHexagonIWEmblem(ctx, 0.95);
    ctx.restore();

    // Right Typography
    ctx.textAlign = 'left';

    // 1. "INSPIRE"
    const silverGrad = ctx.createLinearGradient(0, 70, 0, 150);
    silverGrad.addColorStop(0, '#ffffff');
    silverGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = silverGrad;
    ctx.font = '900 80px "Plus Jakarta Sans", Montserrat, sans-serif';
    ctx.letterSpacing = '14px';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.shadowBlur = 12;
    ctx.fillText('INSPIRE', 315, 140);

    // 2. "WEBCRAFT"
    const blueGrad = ctx.createLinearGradient(0, 155, 0, 225);
    blueGrad.addColorStop(0, '#38bdf8');
    blueGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = blueGrad;
    ctx.font = '800 60px "Plus Jakarta Sans", Montserrat, sans-serif';
    ctx.letterSpacing = '18px';
    ctx.shadowColor = 'rgba(2, 132, 199, 0.7)';
    ctx.shadowBlur = 16;
    ctx.fillText('WEBCRAFT', 318, 220);

    // 3. "BERKEMBANG & BERMANFAAT"
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 21px "Plus Jakarta Sans", Montserrat, sans-serif';
    ctx.letterSpacing = '9px';
    ctx.fillText('BERKEMBANG & BERMANFAAT', 320, 275);
  } else if (variant === 'badge') {
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext('2d')!;

    // Outer dark circle
    const cx = 320;
    const cy = 320;
    const radius = 300;

    // Outer Neon Glow Ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#020612';
    ctx.fill();

    const ringGrad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    ringGrad.addColorStop(0, '#00e5ff');
    ringGrad.addColorStop(0.5, '#0284c7');
    ringGrad.addColorStop(1, '#1e3a8a');
    ctx.lineWidth = 14;
    ctx.strokeStyle = ringGrad;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 18;
    ctx.stroke();

    // Inner subtle thin ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 14, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw Hexagon IW Emblem in upper half
    ctx.save();
    ctx.translate(cx, 240);
    drawHexagonIWEmblem(ctx, 1.15);
    ctx.restore();

    // Typography: Centered
    ctx.textAlign = 'center';

    // 1. "INSPIRE"
    const silverGrad = ctx.createLinearGradient(0, 440, 0, 500);
    silverGrad.addColorStop(0, '#ffffff');
    silverGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = silverGrad;
    ctx.font = '900 52px "Plus Jakarta Sans", Montserrat, sans-serif';
    ctx.letterSpacing = '14px';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.shadowBlur = 10;
    ctx.fillText('INSPIRE', cx, 475);

    // 2. "WEBCRAFT"
    ctx.fillStyle = '#0284c7';
    ctx.font = '800 40px "Plus Jakarta Sans", Montserrat, sans-serif';
    ctx.letterSpacing = '16px';
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 14;
    ctx.fillText('WEBCRAFT', cx, 532);

    // 3. "BERKEMBANG & BERMANFAAT"
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 17px "Plus Jakarta Sans", Montserrat, sans-serif';
    ctx.letterSpacing = '7px';
    ctx.fillText('BERKEMBANG & BERMANFAAT', cx, 575);
  } else {
    // Emblem only
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 512, 512);
    ctx.save();
    ctx.translate(256, 256);
    drawHexagonIWEmblem(ctx, 1.4);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Helper to render the exact geometric 3D faceted hexagonal IW emblem
 */
function drawHexagonIWEmblem(ctx: CanvasRenderingContext2D, scale: number = 1.0) {
  ctx.save();
  ctx.scale(scale, scale);

  // Gradient definitions
  const cyanGrad = ctx.createLinearGradient(-60, -100, 60, 100);
  cyanGrad.addColorStop(0, '#38bdf8');
  cyanGrad.addColorStop(0.5, '#0284c7');
  cyanGrad.addColorStop(1, '#0369a1');

  const lightGrad = ctx.createLinearGradient(-80, -80, 0, 80);
  lightGrad.addColorStop(0, '#7dd3fc');
  lightGrad.addColorStop(1, '#0284c7');

  const darkGrad = ctx.createLinearGradient(0, -50, 80, 80);
  darkGrad.addColorStop(0, '#0369a1');
  darkGrad.addColorStop(1, '#082f49');

  // 1. Top-Left Diamond Dot for the "I"
  ctx.save();
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 10;
  ctx.fillStyle = cyanGrad;
  ctx.beginPath();
  ctx.moveTo(-65, -135);
  ctx.lineTo(-45, -115);
  ctx.lineTo(-65, -95);
  ctx.lineTo(-85, -115);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 2. Left Outer Hexagon Leg ("I" frame that wraps the bottom)
  ctx.fillStyle = lightGrad;
  ctx.beginPath();
  ctx.moveTo(-90, -85);
  ctx.lineTo(-55, -60);
  ctx.lineTo(-55, 10);
  ctx.lineTo(-90, -5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = cyanGrad;
  ctx.beginPath();
  ctx.moveTo(-90, -5);
  ctx.lineTo(-55, 10);
  ctx.lineTo(0, 85);
  ctx.lineTo(0, 115);
  ctx.lineTo(-90, 45);
  ctx.closePath();
  ctx.fill();

  // 3. Right Outer Hexagon Hook Frame
  ctx.fillStyle = lightGrad;
  ctx.beginPath();
  ctx.moveTo(-35, -130);
  ctx.lineTo(15, -130);
  ctx.lineTo(85, -85);
  ctx.lineTo(55, -65);
  ctx.lineTo(0, -100);
  ctx.lineTo(-25, -100);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = cyanGrad;
  ctx.beginPath();
  ctx.moveTo(85, -85);
  ctx.lineTo(95, -75);
  ctx.lineTo(95, 20);
  ctx.lineTo(60, 5);
  ctx.lineTo(60, -65);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = darkGrad;
  ctx.beginPath();
  ctx.moveTo(95, 20);
  ctx.lineTo(60, 5);
  ctx.lineTo(60, 50);
  ctx.lineTo(95, 70);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = lightGrad;
  ctx.beginPath();
  ctx.moveTo(95, 70);
  ctx.lineTo(40, 25);
  ctx.lineTo(25, 42);
  ctx.lineTo(75, 88);
  ctx.closePath();
  ctx.fill();

  // 4. Central 3D "W" Facets
  // Left Diagonal
  ctx.fillStyle = lightGrad;
  ctx.beginPath();
  ctx.moveTo(-45, -40);
  ctx.lineTo(-25, -40);
  ctx.lineTo(0, 45);
  ctx.lineTo(-20, 45);
  ctx.closePath();
  ctx.fill();

  // Left-Center Diagonal Peak
  ctx.fillStyle = cyanGrad;
  ctx.beginPath();
  ctx.moveTo(-20, 45);
  ctx.lineTo(0, 45);
  ctx.lineTo(-5, -20);
  ctx.lineTo(-20, -20);
  ctx.closePath();
  ctx.fill();

  // Center-Right Drop
  ctx.fillStyle = lightGrad;
  ctx.beginPath();
  ctx.moveTo(-5, -20);
  ctx.lineTo(15, -20);
  ctx.lineTo(0, 45);
  ctx.lineTo(-5, 45);
  ctx.closePath();
  ctx.fill();

  // Right Diagonal
  ctx.fillStyle = cyanGrad;
  ctx.beginPath();
  ctx.moveTo(0, 45);
  ctx.lineTo(20, 45);
  ctx.lineTo(60, -40);
  ctx.lineTo(40, -40);
  ctx.closePath();
  ctx.fill();

  // Highlight Facet Shimmers
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-45, -40);
  ctx.lineTo(0, 50);
  ctx.lineTo(60, -40);
  ctx.stroke();

  ctx.restore();
}

