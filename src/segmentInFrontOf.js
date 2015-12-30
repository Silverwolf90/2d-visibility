import { Point } from './types';

const leftOf = (s, p) => {
  const cross = (s.p2.x - s.p1.x) * (p.y - s.p1.y)
              - (s.p2.y - s.p1.y) * (p.x - s.p1.x);
  return cross < 0;
};

const interpolate = (p, q, f) => {
  return Point(
    p.x*(1-f) + q.x*f,
    p.y*(1-f) + q.y*f
  );
};

export const segmentInFrontOf = (a, b, relativeTo) => {
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

  return false;
};
