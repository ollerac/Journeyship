var defaultCellSize = 30;
var defaultTinyCellSize = 3;

var colorDictionary = {"red": "#ff1100", "orange1": "#ff6e00", "orange2": "#ffa100", "yellow1": "#ffd400", "yellow2": "#f7ff00", "green1": "#95f200", "green2": "#00e32c", "blue1": "#00a0e6", "blue2": "#2b6af4", "purple1": "#3b00eb", "purple2": "#bd00eb", "pink": "#eb0068"};
var grayscaleDictionary = {"black1": "#fff", "black2": "#e8e8e8", "black3": "#d1d1d1", "black4": "#bababa", "black5": "#a3a3a3", "black6": "#8c8c8c", "black7": "#737373", "black8": "#5c5c5c", "black9": "#454545", "black10": "#2e2e2e", "black11": "#171717", "black12": "#000"};

// setup animated block

function AnimatedBlock (layers) {
  var self = this;
  this.layers = [];
  this.layerIndex = -1;

  _.each(layers, function (layer) {
    self.addLayer(self.layers.length, layer);
  });
}

AnimatedBlock.prototype.addLayer = function (layerNum, layer) {
  this.layers.splice(layerNum, 0, layer);
  PubSub.publish('added layer', layer);
};

AnimatedBlock.prototype.changeLayerValue = function (layerNum, indexNum, newValue) {
  this.layers[layerNum][indexNum] = newValue;
  PubSub.publish('changed layer value');
};

AnimatedBlock.prototype.removeLayer = function (layerNum) {
  this.layers.splice(layerNum, 1);
  PubSub.publish('removed layer', layerNum);
};

AnimatedBlock.prototype.nextLayer = function () {
  this.layerIndex++;

  if (this.layers.length) {
    if (this.layerIndex == this.layers.length) {
      this.layerIndex = 0;
      return this.layers[this.layerIndex];
    } else {
      return this.layers[this.layerIndex];
    }
  }
};

AnimatedBlock.prototype.animate = function (animatedElement) {
  var self = this;
  var context = animatedElement.getContext('2d');

  applyMapToContext(self.nextLayer(), context, defaultTinyCellSize, animatedElement.width / defaultTinyCellSize);

  setInterval(function () {
    applyMapToContext(self.nextLayer(), context, defaultTinyCellSize, animatedElement.width / defaultTinyCellSize);
  }, 400);
};

// canvas helper functions

function drawCell (context, x, y, size, color) {
  if (!color) color = defaultCellColor;
  if (!size) size = defaultCellSize;

  context.fillStyle = color;
  context.fillRect(x,y,size,size);
}

// input x, y and outputs x and y rounded down to the nearest multiple of cellSize
function getCellPosition (x, y, cellSize) {
  return {
    x: Math.floor(x/cellSize) * cellSize,
    y: Math.floor(y/cellSize) * cellSize
  };
}

function getCellRowAndColumnFromIndex (index, containerColumns) {
  return {
    row: Math.floor(index / containerColumns),
    column: index % containerColumns
  };
}

function applyMapToContext (map, context, cellSize, columns) {
  _.each(map, function (color, index) {
    var cellRowAndColumn = getCellRowAndColumnFromIndex(index, columns);
    drawCell(context, cellRowAndColumn.column * cellSize, cellRowAndColumn.row * cellSize, cellSize, color);
  });
}

// add layer to dom and set up ability to select layer

// gets pattern as second argument passed to it in the subscribe
function makeNewLayer (msg, layer) {
  var layerElement = makeNewBlock();
  var layerContainer = makeNewElement();
  layerContainer.className = 'block area-container layer-container';
  layerContainer.appendChild(layerElement);
  qs('.layers').appendChild(layerContainer);

  layerContainer.addEventListener('mousedown', function (event) {
    PubSub.publish('selected layer', qsa('.layers .layer-container').indexOf(event.currentTarget));
  });

  var context = layerElement.getContext('2d');
  var columns = layerElement.width / defaultTinyCellSize;
  applyMapToContext(layer, context, defaultTinyCellSize, columns);
}

PubSub.subscribe('added layer', makeNewLayer);


// create animated block and start animating its element in the dom

layers = [[],[],[]];
colors = ['red', 'blue', 'orange'];
_.each(layers, function (layer, index) {
  _.times(100, function () {
    layer.push(colors[index]);
  });
});

var animatedBlock = new AnimatedBlock(layers);
var animatedElement = makeNewBlock();
document.getElementById('preview-container').appendChild(animatedElement);
animatedBlock.animate(animatedElement);


// drawable surface setup (i.e. the main canvas and the constructor canvas)

function DrawableSurface (element, animatedBlock, cellSize, map) {
  var self = this;
  self.element = element;
  self.selectedLayerNum = 0;
  self.animatedBlock = animatedBlock;
  self.cellSize = cellSize || defaultCellSize;
  self.columns = self.element.width / self.cellSize;
  self.map = map || null;
  self.selectedColor = "#000";
}

DrawableSurface.prototype.render = function () {
  if (this.animatedBlock) {
    applyMapToContext(this.animatedBlock.layers[this.selectedLayerNum], this.element.getContext('2d'), this.cellSize, this.columns);
  } else if (this.map) {
    applyMapToContext(this.map, this.element.getContext('2d'), this.cellSize, this.columns);
  } else {
    throw("DrawableSurface needs either an animated block or a map to render.");
  }
};

// set up the constructor canvas, have it watch the animated block's selected layer
// based on dom position, i don't like it, might be better if each layer had an id and this id was stored in the dom as a data attribute

var constructorElement = makeNewElement('canvas');
constructorElement.width = 300;
constructorElement.height = 300;
document.getElementById('constructor-area-container').appendChild(constructorElement);

constructorBlock = new DrawableSurface(constructorElement, animatedBlock, defaultCellSize);
constructorBlock.render();

PubSub.subscribe('selected layer', function (msg, selectedLayerNum) {
  constructorBlock.selectedLayerNum = selectedLayerNum;
  constructorBlock.render();
});


// set up main canvas

mainArea = new DrawableSurface(eid('main-area'), null, defaultCellSize);


// add ability to remove layer from animated block and from dom

eid('remove-layer').addEventListener('mousedown', function () {
  animatedBlock.removeLayer(constructorBlock.selectedLayerNum);
});

function removeLayer (msg, index) {
  qsa('.layers .layer-container')[index].remove();
}

PubSub.subscribe('removed layer', removeLayer);


// add color palettes

function addColorsToPalette (paletteElement, colors, canvasObject) {
  _.each(colors, function (value, key, list) {
    colorElement = makeNewElement();
    colorElement.className = "color block";
    colorElement.style.backgroundColor = value;

    colorElement.addEventListener("click", function(event) {
      element = event.currentTarget;
      canvasObject.selectedColor = element.style.backgroundColor;
    });

    paletteElement.appendChild(colorElement);
  });
}

addColorsToPalette(qs('#main-color-palette .column5'), colorDictionary, mainArea);
addColorsToPalette(qs('#main-color-palette .column4'), grayscaleDictionary, mainArea);
addColorsToPalette(qs('#constructor-color-palette .column2'), colorDictionary, constructorBlock);
addColorsToPalette(qs('#constructor-color-palette .column1'), grayscaleDictionary, constructorBlock);



// make areas drawable

function drawIt (event, drawableSurface) {
  var cellPosition = getCellPosition(event.offsetX, event.offsetY, drawableSurface.cellSize);
  drawCell(drawableSurface.element.getContext('2d'), cellPosition.x, cellPosition.y, drawableSurface.cellSize, drawableSurface.selectedColor);
  // var cellRowAndColumn = getCellRowAndColumnFromPosition(cellPosition.x, cellPosition.y, canvasObject.currentLayerCanvasCellSize);
  // var cellPositionInArray = getCellPositionInArray(cellRowAndColumn.row, cellRowAndColumn.column, canvasObject.currentLayerCanvasColumns);
  // canvasObject.layers[canvasObject.currentLayerNum][cellPositionInArray] = canvasObject.selectedColor;
  // canvasObject.map[cellPositionInArray] = canvasObject.selectedColor;
  // canvasObject.updateMirrors();
}

function setupCanvasForDrawing (drawableSurface) {
  drawableSurface.element.addEventListener('mousedown', function (event) {
    drawIt(event, drawableSurface);
  }, false);

  drawableSurface.element.addEventListener('mousemove', function (event) {
    if (mouseIsDown) {
      drawIt(event, drawableSurface);
    }
  }, false);
}

setupCanvasForDrawing(mainArea);
setupCanvasForDrawing(constructorBlock);



































