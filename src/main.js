import { Room, Block, EndPoint, Segment, Point } from './types';
import { drawScene } from './drawScene';
const { cos, sin, atan2, PI } = Math;

// Prepare canvas
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const xOffset = 0;
const yOffset = 0;
ctx.translate(xOffset, yOffset);

let segments = [];
let endpoints = [];
let center = Point(250, 250);
let openSegments = [];
let visibilityOutput = [];
let intersectionsDetected = [];

const endpointCompare = (a, b) => {
  // Traverse in angle order
  if (a.angle > b.angle) return 1;
  if (a.angle < b.angle) return -1;
  // But for ties (common), we want Begin nodes before End nodes
  if (!a.begin && b.begin) return 1;
  if (a.begin && !b.begin) return -1;
  return 0;
}

const leftOf = (s, p) => {
  const cross = (s.p2.x - s.p1.x) * (p.y - s.p1.y)
              - (s.p2.y - s.p1.y) * (p.x - s.p1.x);
  return cross < 0;
}

const interpolate = (p, q, f) => {
  return Point(
    p.x*(1-f) + q.x*f,
    p.y*(1-f) + q.y*f
  );
}

const segmentInFrontOf = (a, b, relativeTo) => {
  const A1 = leftOf(a, interpolate(b.p1, b.p2, 0.01));
  const A2 = leftOf(a, interpolate(b.p2, b.p1, 0.01));
  const A3 = leftOf(a, relativeTo);
  const B1 = leftOf(b, interpolate(a.p1, a.p2, 0.01));
  const B2 = leftOf(b, interpolate(a.p2, a.p1, 0.01));
  const B3 = leftOf(b, relativeTo);

  if (B1 === B2 && B2 !== B3) return true;
  if (A1 === A2 && A2 === A3) return true;
  if (A1 === A2 && A2 !== A3) return false;
  if (B1 === B2 && B2 === B3) return false;

  intersectionsDetected.push([a.p1, a.p2, b.p1, b.p2]);
  return false;
}

const addSegment = (x1, y1, x2, y2) => {
  const p1 = EndPoint(x1, y1);
  const p2 = EndPoint(x2, y2);
  const segment = Segment(p1, p2);

  p1.segment = segment;
  p1.visualize = true;
  p2.segment = segment;
  p2.visualize = false;
  p1.segment = segment;
  p2.segment = segment;

  segments.push(segment);
  endpoints.push(p1);
  endpoints.push(p2);
}

const loadEdgeOfMap = (size, margin) => {
  addSegment(margin, margin, margin, size-margin);
  addSegment(margin, size-margin, size-margin, size-margin);
  addSegment(size-margin, size-margin, size-margin, margin);
  addSegment(size-margin, margin, margin, margin);
}

const loadMap = (size, margin, blocks, walls) => {
  segments = [];
  endpoints = [];
  loadEdgeOfMap(size, margin);
  
  for(let i = 0; i < blocks.length; i += 1) {
    let { x, y, r } = blocks[i];
    addSegment(x-r, y-r, x-r, y+r);
    addSegment(x-r, y+r, x+r, y+r);
    addSegment(x+r, y+r, x+r, y-r);
    addSegment(x+r, y-r, x-r, y-r);
  }

  for(let i = 0; i < walls.length; i += 1) {
    let { p1, p2 } = walls[i];
    addSegment(p1.x, p1.y, p2.x, p2.y);
  }
}

const setLightLocation = (x, y) => {
  center.x = x;
  center.y = y;
  
  for (let i = 0; i < segments.length; i += 1) {
    let segment = segments[i];
    let dx = 0.5 * (segment.p1.x + segment.p2.x) - x;
    let dy = 0.5 * (segment.p1.y + segment.p2.y) - y;

    segment.d = dx*dx + dy*dy;
    segment.p1.angle = atan2(segment.p1.y - y, segment.p1.x - x);
    segment.p2.angle = atan2(segment.p2.y - y, segment.p2.x - x);

    let dAngle = segment.p2.angle - segment.p1.angle;

    if (dAngle <= -PI) dAngle += 2*PI;
    if (dAngle >   PI) dAngle -= 2*PI;

    segment.p1.begin = dAngle > 0;
    segment.p2.begin = !segment.p1.begin;
  }
}

const sweep = (maxAngle=999) => {
  visibilityOutput = [];
  intersectionsDetected = [];
  openSegments = [];
  endpoints.sort(endpointCompare);

  let beginAngle = 0.0;
  for(let pass = 0; pass < 2; pass += 1) {
    for (let i = 0; i < endpoints.length; i += 1) {
      let p = endpoints[i];
      let currentOld = !openSegments.length ? null : openSegments[0];
      
      if (p.begin) {
        let index = 0
        let segment = openSegments[index];
        while (segment && segmentInFrontOf(p.segment, segment, center)) {
          index += 1;
          segment = openSegments[index]
        }

        if (!segment) {
          openSegments.push(p.segment);
        } else {
          openSegments.splice(index, 0, p.segment);
        }
      } else {
        let index = openSegments.indexOf(p.segment)
        if (index > -1) openSegments.splice(index, 1);
      }
      
      let currentNew = !openSegments.length ? null : openSegments[0];
      if (currentOld !== currentNew) {
        if (pass === 1) {
          addTriangle(beginAngle, p.angle, currentOld);
        }
        beginAngle = p.angle;
      }
    }
  }
}

const lineIntersection = (p1, p2, p3, p4) => {
  const s = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / ((p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y));
  return new Point(p1.x + s * (p2.x - p1.x),p1.y + s * (p2.y - p1.y));
}

const addTriangle = (angle1, angle2, segment) => {
  const p1 = center;
  const p2 = Point(center.x + cos(angle1), center.y + sin(angle1));
  const p3 = Point(0.0, 0.0);
  const p4 = Point(0.0, 0.0);

  if (segment) {
    p3.x = segment.p1.x;
    p3.y = segment.p1.y;
    p4.x = segment.p2.x;
    p4.y = segment.p2.y;
  } else {
    p3.x = center.x + cos(angle1) * 200;
    p3.y = center.y + sin(angle1) * 200;
    p4.x = center.x + cos(angle2) * 200;
    p4.y = center.y + sin(angle2) * 200;
  }

  const pBegin = lineIntersection(p3, p4, p1, p2);

  p2.x = center.x + cos(angle2);
  p2.y = center.y + sin(angle2);

  const pEnd = lineIntersection(p3, p4, p1, p2);

  visibilityOutput.push(pBegin);
  visibilityOutput.push(pEnd);
}

const render = () => {
  ctx.clearRect(-10000, -10000, 20000, 20000);
  drawRoom(ctx, room);
  // blocks.forEach(drawBlock.bind(null, ctx));
  drawTriangles(ctx, center, visibilityOutput);
  ctx.fillRect(center.x, center.y, 3, 3);
};

const roomSize = 400;
const room = Room(0, 0, roomSize, roomSize);

const blocks = [
  Block(50, 150, 10),
  Block(150, 150, 20)
];

const walls = [
  Segment(EndPoint(20, 20), EndPoint(20, 120))
];

canvas.addEventListener('mousemove', (e) => {
  loadMap(roomSize, 0, blocks, walls)
  setLightLocation(e.pageX - xOffset, e.pageY - yOffset );
  sweep();
});

loadMap(roomSize, 0, blocks, walls)
setLightLocation(100, 100);
sweep();

requestAnimationFrame(function tick() {
  drawScene(ctx, room, center, blocks, visibilityOutput);
  requestAnimationFrame(tick);
});




