import { Segment } from './types';

const { atan2, PI } = Math;

const getCorners = ({x, y, width, height}) => ({
  nw: [x, y],
  sw: [x, y + height],
  ne: [x + width, y],
  se: [x + width, y + height]
});

const segmentsFromCorners =
  ({ nw, sw, ne, se }) => ([
    Segment(...nw, ...ne),
    Segment(...nw, ...sw),
    Segment(...ne, ...se),
    Segment(...sw, ...se)
  ]);

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

export const loadMap = (room, blocks, walls, lightSource) => {
  let segments = segmentsFromCorners(getCorners(room));
  
  for(let i = 0; i < blocks.length; i += 1) {
    segments = segments.concat(segmentsFromCorners(getCorners(blocks[i])));
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
