import { Point } from './types';
import { segmentInFrontOf } from './segmentInFrontOf';
import { endpointCompare } from './endpointCompare';
import { lineIntersection } from './lineIntersection';

const { cos, sin } = Math;

const getTrianglePoints = (origin, angle1, angle2, segment) => {
  const p1 = origin;
  const p2 = Point(origin.x + cos(angle1), origin.y + sin(angle1));
  const p3 = Point(0, 0);
  const p4 = Point(0, 0);

  if (segment) {
    p3.x = segment.p1.x;
    p3.y = segment.p1.y;
    p4.x = segment.p2.x;
    p4.y = segment.p2.y;
  } else {
    p3.x = origin.x + cos(angle1) * 200;
    p3.y = origin.y + sin(angle1) * 200;
    p4.x = origin.x + cos(angle2) * 200;
    p4.y = origin.y + sin(angle2) * 200;
  }

  const pBegin = lineIntersection(p3, p4, p1, p2);

  p2.x = origin.x + cos(angle2);
  p2.y = origin.y + sin(angle2);

  const pEnd = lineIntersection(p3, p4, p1, p2);

  return [pBegin, pEnd];
};

export const calculateVisibility = (origin, endpoints) => {
  let openSegments = [];
  let output = [];
  let beginAngle = 0;

  endpoints.sort(endpointCompare);

  for(let pass = 0; pass < 2; pass += 1) {
    for (let i = 0; i < endpoints.length; i += 1) {
      let endpoint = endpoints[i];
      let openSegment = openSegments[0];
      
      if (endpoint.beginsSegment) {
        let index = 0
        let segment = openSegments[index];
        while (segment && segmentInFrontOf(endpoint.segment, segment, origin)) {
          index += 1;
          segment = openSegments[index]
        }

        if (!segment) {
          openSegments.push(endpoint.segment);
        } else {
          openSegments.splice(index, 0, endpoint.segment);
        }
      } else {
        let index = openSegments.indexOf(endpoint.segment)
        if (index > -1) openSegments.splice(index, 1);
      }
      
      if (openSegment !== openSegments[0]) {
        if (pass === 1) {
          let trianglePoints = getTrianglePoints(origin, beginAngle, endpoint.angle, openSegment);
          output.push(trianglePoints);
        }
        beginAngle = endpoint.angle;
      }
    }
  }

  return output;
};
