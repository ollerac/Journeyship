# Tips

For 1px line, start and end at half pixels. According to http://stackoverflow.com/questions/5679295/ : if you draw at half pixels (when drawing an odd pixel width line) then the actual drawn edges will fall on absolute pixels and look fine.

# Shadow

mainCanvasContext.shadowColor = "#222";
mainCanvasContext.shadowBlur = 8;
mainCanvasContext.shadowOffsetX = 0;
mainCanvasContext.shadowOffsetY = 0;
mainCanvasContext.fill();