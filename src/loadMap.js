import { Segment } from './types';

const { atan2, PI } = Math;

const mapEdgesToSegments = (mapSize, margin) => {
  return [
    Segment(margin, margin, margin, mapSize-margin),
    Segment(margin, mapSize-margin, mapSize-margin, mapSize-margin),
    Segment(mapSize-margin, mapSize-margin, mapSize-margin, margin),
    Segment(mapSize-margin, margin, margin, margin)
  ];
};

const blockToSegments = (block) => {
  const { x, y, r } = block;

  return [
    Segment(x-r, y-r, x-r, y+r),
    Segment(x-r, y+r, x+r, y+r),
    Segment(x+r, y+r, x+r, y-r),
    Segment(x+r, y-r, x-r, y-r)
  ];
};

const calculateEndPointAngles = (lightSource, segment) => {
  const { x, y } = lightSource;
  const dx = 0.5 * (segment.p1.x + segment.p2.x) - x;
  const dy = 0.5 * (segment.p1.y + segment.p2.y) - y;

  segment.d = (dx * dx) + (dy * dy);
  segment.p1.angle = atan2(segment.p1.y - y, segment.p1.x - x);
  segment.p2.angle = atan2(segment.p2.y - y, segment.p2.x - x);
};

const determinineSegmentBeginning = (segment) => {
  let dAngle = segment.p2.angle - segment.p1.angle;

  if (dAngle <= -PI) dAngle += 2 * PI;
  if (dAngle >   PI) dAngle -= 2 * PI;

  segment.p1.beginsSegment = dAngle > 0;
  segment.p2.beginsSegment = !segment.p1.beginsSegment;
};

const setupSegments = (lightSource, segments) => {
  for (let i = 0; i < segments.length; i += 1) {
    let segment = segments[i];
    calculateEndPointAngles(lightSource, segment);
    determinineSegmentBeginning(segment);
  }
};

export const loadMap = (size, margin, blocks, walls, lightSource) => {
  let segments = mapEdgesToSegments(size, margin);
  
  for(let i = 0; i < blocks.length; i += 1) {
    segments = segments.concat(blockToSegments(blocks[i]));
  }

  for(let i = 0; i < walls.length; i += 1) {
    segments.push(walls[i]);
  }

  setupSegments(lightSource, segments);

  const endpoints = segments
    .reduce((endpoints, segment) =>
      endpoints.concat([segment.p1, segment.p2]), []);

  return endpoints;
};
