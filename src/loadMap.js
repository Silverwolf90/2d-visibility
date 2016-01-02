import { Segment } from './types';

const { atan2, PI: π } = Math;

const flatMap =
  (cb, array) =>
    array.reduce((flatArray, item) => flatArray.concat(cb(item)), []);

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

const rectangleToSegments =
  (rectangle) => segmentsFromCorners(getCorners(rectangle)); 

const calculateEndPointAngles = (lightSource, segment) => {
  const { x, y } = lightSource;
  const dx = 0.5 * (segment.p1.x + segment.p2.x) - x;
  const dy = 0.5 * (segment.p1.y + segment.p2.y) - y;

  segment.d = (dx * dx) + (dy * dy);
  segment.p1.angle = atan2(segment.p1.y - y, segment.p1.x - x);
  segment.p2.angle = atan2(segment.p2.y - y, segment.p2.x - x);
};

const setSegmentBeginning = (segment) => {
  let dAngle = segment.p2.angle - segment.p1.angle;

  if (dAngle <= -π) dAngle += 2 * π;
  if (dAngle >   π) dAngle -= 2 * π;

  segment.p1.beginsSegment = dAngle > 0;
  segment.p2.beginsSegment = !segment.p1.beginsSegment;
};

const processSegments = (lightSource, segments) => {
  for (let i = 0; i < segments.length; i += 1) {
    let segment = segments[i];
    calculateEndPointAngles(lightSource, segment);
    setSegmentBeginning(segment);
  }

  return segments;
};

const getSegmentEndPoints =
  (segment) => [segment.p1, segment.p2];

export const loadMap = (room, blocks, walls, lightSource) => {
  const segments = processSegments(lightSource, [
    ...rectangleToSegments(room),
    ...flatMap(rectangleToSegments, blocks),
    ...walls
  ]);

  const endpoints = flatMap(getSegmentEndPoints, segments);

  return endpoints;
};
