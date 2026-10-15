import fs from 'fs';
import { execSync } from 'child_process';

const badgeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0a192f" />
      <stop offset="65%" stop-color="#030712" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>
    <linearGradient id="ringGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00d2ff" />
      <stop offset="50%" stop-color="#0066ff" />
      <stop offset="100%" stop-color="#0033aa" />
    </linearGradient>
    <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff" />
      <stop offset="35%" stop-color="#0088ff" />
      <stop offset="100%" stop-color="#0044cc" />
    </linearGradient>
    <linearGradient id="facetLight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#40c8ff" />
      <stop offset="100%" stop-color="#0077ee" />
    </linearGradient>
    <linearGradient id="facetShadow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0055cc" />
      <stop offset="100%" stop-color="#002277" />
    </linearGradient>
    <linearGradient id="silverText" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Background Circle -->
  <circle cx="400" cy="400" r="390" fill="url(#bgGlow)" stroke="url(#ringGlow)" stroke-width="14" filter="url(#glow)" />
  <circle cx="400" cy="400" r="378" fill="none" stroke="#00d2ff" stroke-width="2" opacity="0.6" />

  <!-- 3D Geometric IW Hexagon Emblem -->
  <g transform="translate(400, 310) scale(1.15)">
    <!-- Top-Left Diamond Dot for the "I" -->
    <path d="M -85,-115 L -65,-135 L -45,-115 L -65,-95 Z" fill="url(#blueGlow)" stroke="#00e5ff" stroke-width="2" />
    <path d="M -85,-115 L -65,-95 L -65,-90 L -85,-110 Z" fill="url(#facetShadow)" opacity="0.7" />

    <!-- Left Outer Angular "I" Frame (Top-left hexagon edge down to bottom point) -->
    <path d="M -90,-85 L -55,-60 L -55,10 L -90,-5 Z" fill="url(#facetLight)" />
    <path d="M -90,-5 L -55,10 L 0,85 L 0,115 L -90,45 Z" fill="url(#blueGlow)" />
    <path d="M -90,-85 L -90,45 L -75,35 L -75,-75 Z" fill="url(#facetShadow)" />

    <!-- Right Hexagonal Hook Frame -->
    <path d="M -40,-130 L 10,-130 L 80,-85 L 50,-65 L 0,-100 L -30,-100 Z" fill="url(#facetLight)" />
    <path d="M 80,-85 L 90,-75 L 90,20 L 55,5 L 55,-65 Z" fill="url(#blueGlow)" />
    <path d="M 90,20 L 55,5 L 55,50 L 90,70 Z" fill="url(#facetShadow)" />
    <path d="M 90,70 L 40,30 L 25,45 L 75,85 Z" fill="url(#facetLight)" />

    <!-- Central 3D "W" Emblem -->
    <!-- W Left Diagonal -->
    <path d="M -45,-40 L -25,-40 L 0,45 L -20,45 Z" fill="url(#facetLight)" />
    <path d="M -20,45 L 0,45 L -10,15 L -25,20 Z" fill="url(#facetShadow)" />
    <!-- W Center Left Rise -->
    <path d="M -20,45 L 0,45 L -5,-20 L -20,-20 Z" fill="url(#blueGlow)" />
    <!-- W Center Right Drop -->
    <path d="M -5,-20 L 15,-20 L 0,45 L -5,45 Z" fill="url(#facetLight)" />
    <!-- W Right Diagonal -->
    <path d="M 0,45 L 20,45 L 60,-40 L 40,-40 Z" fill="url(#blueGlow)" />
    <path d="M 40,-40 L 60,-40 L 63,-30 L 43,-30 Z" fill="url(#facetShadow)" />
    <!-- 3D Bevel Highlights -->
    <path d="M -45,-40 L 0,55 L 45,-40 L 32,-40 L 0,25 L -32,-40 Z" fill="#00e5ff" opacity="0.35" />
  </g>

  <!-- Typography: INSPIRE WEBCRAFT -->
  <!-- "INSPIRE" in Bold Silver-White Sans -->
  <text x="400" y="595" text-anchor="middle" font-family="'Plus Jakarta Sans', 'Inter', 'Montserrat', Arial, sans-serif" font-weight="900" font-size="56" fill="url(#silverText)" letter-spacing="18" filter="url(#glow)">INSPIRE</text>

  <!-- "WEBCRAFT" in Electric Cyan-Blue -->
  <text x="400" y="660" text-anchor="middle" font-family="'Plus Jakarta Sans', 'Inter', 'Montserrat', Arial, sans-serif" font-weight="800" font-size="44" fill="#00a2ff" letter-spacing="22" filter="url(#glow)">WEBCRAFT</text>

  <!-- Slogan: "BERKEMBANG & BERMANFAAT" -->
  <text x="400" y="705" text-anchor="middle" font-family="'Plus Jakarta Sans', 'Inter', 'Montserrat', Arial, sans-serif" font-weight="600" font-size="20" fill="#ffffff" letter-spacing="10" opacity="0.95">BERKEMBANG &amp; BERMANFAAT</text>
</svg>`;

const horizontalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 320" width="1000" height="320">
  <defs>
    <linearGradient id="hBlueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff" />
      <stop offset="40%" stop-color="#0088ff" />
      <stop offset="100%" stop-color="#0044cc" />
    </linearGradient>
    <linearGradient id="hFacetLight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#40c8ff" />
      <stop offset="100%" stop-color="#0077ee" />
    </linearGradient>
    <linearGradient id="hFacetShadow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0055cc" />
      <stop offset="100%" stop-color="#002277" />
    </linearGradient>
    <linearGradient id="hSilverText" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
    <filter id="hGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <rect width="1000" height="320" rx="20" fill="#030712" />

  <!-- 3D Geometric IW Hexagon Emblem on Left -->
  <g transform="translate(160, 160) scale(1.05)">
    <!-- Top-Left Diamond Dot for the "I" -->
    <path d="M -85,-115 L -65,-135 L -45,-115 L -65,-95 Z" fill="url(#hBlueGlow)" stroke="#00e5ff" stroke-width="2" />
    <!-- Left Outer Angular "I" Frame -->
    <path d="M -90,-85 L -55,-60 L -55,10 L -90,-5 Z" fill="url(#hFacetLight)" />
    <path d="M -90,-5 L -55,10 L 0,85 L 0,115 L -90,45 Z" fill="url(#hBlueGlow)" />
    <path d="M -90,-85 L -90,45 L -75,35 L -75,-75 Z" fill="url(#hFacetShadow)" />
    <!-- Right Hexagonal Hook Frame -->
    <path d="M -40,-130 L 10,-130 L 80,-85 L 50,-65 L 0,-100 L -30,-100 Z" fill="url(#hFacetLight)" />
    <path d="M 80,-85 L 90,-75 L 90,20 L 55,5 L 55,-65 Z" fill="url(#hBlueGlow)" />
    <path d="M 90,20 L 55,5 L 55,50 L 90,70 Z" fill="url(#hFacetShadow)" />
    <path d="M 90,70 L 40,30 L 25,45 L 75,85 Z" fill="url(#hFacetLight)" />
    <!-- Central 3D "W" Emblem -->
    <path d="M -45,-40 L -25,-40 L 0,45 L -20,45 Z" fill="url(#hFacetLight)" />
    <path d="M -20,45 L 0,45 L -5,-20 L -20,-20 Z" fill="url(#hBlueGlow)" />
    <path d="M -5,-20 L 15,-20 L 0,45 L -5,45 Z" fill="url(#hFacetLight)" />
    <path d="M 0,45 L 20,45 L 60,-40 L 40,-40 Z" fill="url(#hBlueGlow)" />
  </g>

  <!-- Typography: INSPIRE WEBCRAFT on Right -->
  <text x="320" y="145" font-family="'Plus Jakarta Sans', 'Inter', 'Montserrat', Arial, sans-serif" font-weight="900" font-size="78" fill="url(#hSilverText)" letter-spacing="16" filter="url(#hGlow)">INSPIRE</text>
  <text x="325" y="225" font-family="'Plus Jakarta Sans', 'Inter', 'Montserrat', Arial, sans-serif" font-weight="800" font-size="56" fill="#00a2ff" letter-spacing="20" filter="url(#hGlow)">WEBCRAFT</text>
  <text x="330" y="275" font-family="'Plus Jakarta Sans', 'Inter', 'Montserrat', Arial, sans-serif" font-weight="600" font-size="20" fill="#ffffff" letter-spacing="9" opacity="0.95">BERKEMBANG &amp; BERMANFAAT</text>
</svg>`;

fs.writeFileSync('public/assets/inspire-webcraft-badge.svg', badgeSvg);
fs.writeFileSync('public/assets/inspire-webcraft-horizontal.svg', horizontalSvg);

try {
  execSync('convert -background none public/assets/inspire-webcraft-badge.svg -resize 800x800 public/assets/inspire-webcraft-badge.png');
  execSync('convert -background none public/assets/inspire-webcraft-horizontal.svg -resize 1000x320 public/assets/inspire-webcraft-horizontal.png');
  execSync('cp public/assets/inspire-webcraft-badge.png public/assets/logo.png');
  console.log('Successfully generated Inspire WebCraft logo assets!');
} catch (e) {
  console.error('Convert failed, using SVG:', e);
}
