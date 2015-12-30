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
  (x1, y1, x2, y2) => {
    const p1 = EndPoint(x1, y1);
    const p2 = EndPoint(x2, y2);
    const segment = { p1, p2, d: 0 };

    p1.segment = segment;
    p1.visualize = true;
    p2.segment = segment;
    p2.visualize = false;

    return segment;
  };
