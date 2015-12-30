import { Room, Block, Segment, Point } from './types';
import { drawScene } from './drawScene';
import { loadMap } from './loadMap';
import { calculateVisibility } from './visibility';

// Prepare canvas
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const xOffset = 0;
const yOffset = 0;
ctx.translate(xOffset, yOffset);

// Setup scene
const roomSize = 500;
const room = Room(0, 0, roomSize, roomSize);
const blocks = [
  Block(50, 150, 10),
  Block(150, 150, 20)
];
const walls = [
  Segment(20, 20, 20, 120)
];


const run = (lightSource) => {
  const endpoints = loadMap(roomSize, 0, blocks, walls, lightSource);  
  const visibility = calculateVisibility(lightSource, endpoints);

  requestAnimationFrame(() =>
    drawScene(ctx, room, lightSource, blocks, visibility));
};

canvas.addEventListener('mousemove', ({pageX, pageY}) => {
  let lightSource = Point(pageX, pageY);
  run(lightSource)
});

let lightSource = Point(100, 100);
run(lightSource);
