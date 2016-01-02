import { Room, Block, Segment, Point } from './types';
import { drawScene } from './drawScene';
import { loadMap } from './loadMap';
import { calculateVisibility } from './visibility';

const spreadMap =
  (cb) => (array2d) =>
    array2d.map(array1d => cb(...array1d));

const makeSegments = spreadMap(Segment)
const makeBlocks = spreadMap(Block);

// Prepare canvas
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const xOffset = 0.5;
const yOffset = 0.5;
ctx.translate(xOffset, yOffset);

// Setup scene
const room = Room(0, 0, 700, 500);

const walls = makeSegments([
  [20, 20, 20, 120],
  [20, 20, 100, 20],
  [100, 20, 150, 100],
  [150, 100, 50, 100],
]);

const blocks = makeBlocks([
  [ 50, 150, 20, 20],
  [150, 150, 40, 80],
  [400, 400, 40, 40]
]);

const run = (lightSource) => {
  const endpoints = loadMap(room, blocks, walls, lightSource);  
  const visibility = calculateVisibility(lightSource, endpoints);

  requestAnimationFrame(() =>
    drawScene(ctx, room, lightSource, blocks, walls, visibility));
};

canvas.addEventListener('mousemove', ({pageX, pageY}) => {
  let lightSource = Point(pageX, pageY);
  run(lightSource)
});

let lightSource = Point(100, 100);
run(lightSource);
