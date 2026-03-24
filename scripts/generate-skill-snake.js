
const fs = require("fs");

const COLS = 40;
const ROWS = 7;
const CELL = 15;

const width = COLS * CELL;
const height = ROWS * CELL;

const skills = ["C++", "DSA", "Java", "Kotlin", "Dart", "Python", "AI"];

// 🟩 Grid
let grid = "";
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const active = Math.random() > 0.35;

    grid += `
      <rect x="${x * CELL}" y="${y * CELL}" width="12" height="12"
        fill="${active ? "#00ff88" : "#0f172a"}" rx="2"/>
    `;
  }
}

// 🐍 Path
let positions = [];
for (let y = 0; y < ROWS; y++) {
  if (y % 2 === 0) {
    for (let x = 0; x < COLS; x++) positions.push([x, y]);
  } else {
    for (let x = COLS - 1; x >= 0; x--) positions.push([x, y]);
  }
}

let path = "M ";
positions.forEach(([x, y]) => {
  path += `${x * CELL + 6} ${y * CELL + 6} L `;
});

// 🎯 Skill placement (exact sync points)
const skillPoints = skills.map((skill, i) => {
  const index = Math.floor((i + 1) * positions.length / skills.length);
  return { ...positions[index], skill, t: (i + 1) / skills.length };
});

const duration = 14;

// ✨ Glow filter
const glow = `
<defs>
  <filter id="glow">
    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
    <feMerge>
      <feMergeNode in="coloredBlur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>
`;

// 🐍 Tail segments
const tail = Array.from({ length: 8 }).map((_, i) => {
  const delay = i * 0.3;

  return `
    <circle r="${5 - i * 0.4}" fill="#00ffcc" opacity="${1 - i * 0.1}" filter="url(#glow)">
      <animateMotion dur="${duration}s" repeatCount="indefinite" begin="-${delay}s">
        <mpath href="#snakePath"/>
      </animateMotion>
    </circle>
  `;
}).join("");

// 🎯 Skills (perfect timing)
const skillSVG = skillPoints.map(p => `
  <g>
    <circle cx="${p.x * CELL + 6}" cy="${p.y * CELL + 6}" r="3" fill="#ff00ff" filter="url(#glow)">
      <animate attributeName="r" values="3;6;3" dur="1s" repeatCount="indefinite"/>
    </circle>

    <text x="${p.x * CELL + 10}" y="${p.y * CELL + 10}"
      fill="#ff00ff" font-size="10" opacity="0">
      ${p.skill}
      <animate attributeName="opacity"
        values="0;0;1;1"
        keyTimes="0;${p.t - 0.05};${p.t};1"
        dur="${duration}s"
        repeatCount="indefinite"/>
    </text>
  </g>
`).join("");

// 🚀 Final SVG
const svg = `
<svg width="${width}" height="${height + 40}" xmlns="http://www.w3.org/2000/svg">

  ${glow}

  <rect width="100%" height="100%" fill="#020617"/>

  ${grid}

  ${skillSVG}

  <path id="snakePath" d="${path}" fill="none"/>

  <!-- Tail -->
  ${tail}

  <!-- Head -->
  <circle r="6" fill="#FFD700" filter="url(#glow)">
    <animateMotion dur="${duration}s" repeatCount="indefinite">
      <mpath href="#snakePath"/>
    </animateMotion>
  </circle>

  <!-- Emoji -->
  <text font-size="12">
    😈
    <animateMotion dur="${duration}s" repeatCount="indefinite">
      <mpath href="#snakePath"/>
    </animateMotion>
  </text>

</svg>
`;

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/skill-snake.svg", svg);

console.log("🔥 ULTRA snake generated!");
