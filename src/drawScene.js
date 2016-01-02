const drawRectangle =
  (ctx, {x, y, width, height}) => {
    ctx.save();
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  };

const drawTriangles =
  (ctx, center, visibilityOutput) => {
    for(var i = 0; i < visibilityOutput.length; i += 1) {
      let [p1, p2] = visibilityOutput[i];
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.closePath()
      ctx.stroke();
    }
  };

export const drawScene =
  (ctx, room, center, blocks, visibilityOutput) => {
    ctx.clearRect(-10000, -10000, 20000, 20000);
    drawRectangle(ctx, room);
    blocks.forEach(drawRectangle.bind(null, ctx));
    drawTriangles(ctx, center, visibilityOutput);
    ctx.fillRect(center.x, center.y, 3, 3);
  };
