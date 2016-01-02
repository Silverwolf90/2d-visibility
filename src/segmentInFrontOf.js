import { Point } from './types';

const leftOf = (segment, point) => {
  const cross = (segment.p2.x - segment.p1.x) * (point.y - segment.p1.y)
              - (segment.p2.y - segment.p1.y) * (point.x - segment.p1.x);
  return cross < 0;
};

const interpolate = (pointA, pointB, f) => {
  return Point(
    pointA.x*(1-f) + pointB.x*f,
    pointA.y*(1-f) + pointB.y*f
  );
};

export const segmentInFrontOf = (segmentA, segmentB, relativePoint) => {
  const A1 = leftOf(segmentA, interpolate(segmentB.p1, segmentB.p2, 0.01));
  const A2 = leftOf(segmentA, interpolate(segmentB.p2, segmentB.p1, 0.01));
  const A3 = leftOf(segmentA, relativePoint);
  const B1 = leftOf(segmentB, interpolate(segmentA.p1, segmentA.p2, 0.01));
  const B2 = leftOf(segmentB, interpolate(segmentA.p2, segmentA.p1, 0.01));
  const B3 = leftOf(segmentB, relativePoint);

  if (B1 === B2 && B2 !== B3) return true;
  if (A1 === A2 && A2 === A3) return true;
  if (A1 === A2 && A2 !== A3) return false;
  if (B1 === B2 && B2 === B3) return false;

  return false;
};
