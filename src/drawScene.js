const drawRectangle =
  (ctx, color, {x, y, width, height}) => {
    ctx.save();
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  };

const drawSegment = 
  (ctx, color, {p1, p2}) => {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

const drawVisibilityTriangles =
  (ctx, color, lightSource, visibilityOutput) => {
    ctx.save();
    ctx.strokeStyle = color;
    for(var i = 0; i < visibilityOutput.length; i += 1) {
      let [p1, p2] = visibilityOutput[i];
      ctx.beginPath();
      ctx.moveTo(lightSource.x, lightSource.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.closePath()
      ctx.stroke();
    }
    ctx.restore();
  };

export const drawScene =
  (ctx, room, lightSource, blocks, walls, visibilityOutput, showAll) => {
    ctx.clearRect(-10000, -10000, 20000, 20000);
    drawRectangle(ctx, 'black', room);
    blocks.forEach(drawRectangle.bind(null, ctx, 'black'));
    walls.forEach(drawSegment.bind(null, ctx, 'black'));
    drawVisibilityTriangles(ctx, 'gray', lightSource, visibilityOutput);
  };
