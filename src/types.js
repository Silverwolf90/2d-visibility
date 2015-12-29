export const Room =
  (x, y, width, height) => ({
    x, 
    y, 
    width, 
    height
  });

export const Block = 
  (x, y, r) => ({
    x,
    y,
    r
  });

export const Point = 
  (x=0, y=0) => ({
    x,
    y
  });

export const EndPoint =
  (x=0, y=0, begin=false, segment=null, angle=0, visualize=false) => ({
    ...Point(x, y),
    begin,
    segment,
    angle,
    visualize
  });

export const Segment =
  (p1, p2, d=0) => ({
    p1,
    p2,
    d
  });
