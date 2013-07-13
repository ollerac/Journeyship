var colorDictionary = {"red": "#ff1100", "orange1": "#ff6e00", "orange2": "#ffa100", "yellow1": "#ffd400", "yellow2": "#f7ff00", "green1": "#95f200", "green2": "#00e32c", "blue1": "#00a0e6", "blue2": "#2b6af4", "purple1": "#3b00eb", "purple2": "#bd00eb", "pink": "#eb0068"};
var grayscaleDictionary = {"black1": "#fff", "black2": "#e8e8e8", "black3": "#d1d1d1", "black4": "#bababa", "black5": "#a3a3a3", "black6": "#8c8c8c", "black7": "#737373", "black8": "#5c5c5c", "black9": "#454545", "black10": "#2e2e2e", "black11": "#171717", "black12": "#000"};
var defaultCellSize = 30;
var defaultTinyCellSize = 3;


function CanvasObject (element, cellSize, mirrors, layers, currentLayerCanvas) {
  this.element = element;
  this.context = this.element.getContext('2d');
  this.selectedColor = '#000';
  this.rows = this.element.height / defaultCellSize;
  this.columns = this.element.width / defaultCellSize;
  this.map = new Array(this.columns * this.rows);
  this.mirrors = mirrors || [];
  this.cellSize = cellSize || defaultCellSize;
  this.layers = layers || [];
  this.layerIndex = -1;
  this.selectedLayerNum = 0;
  this.currentLayerCanvas = currentLayerCanvas || null;
  this.currentLayerCanvasContext = this.currentLayerCanvas ? this.currentLayerCanvas.getContext('2d') : null;
}

CanvasObject.prototype.addMirror = function (mirror, indexOfPattern) {
  this.mirrors.push({object: mirror, patternNum: indexOfPattern});
};

CanvasObject.prototype.updateMirrors = function () {
  var mirrors = this.mirrors;
  var layers = this.layers;

  _.each(mirrors, function (mirror) {
    applyMapToCanvasObject(layers[mirror.patternNum], mirror.object);
  });
};

// layer is just a map, a list
CanvasObject.prototype.addLayer = function (layer) {
  if (layer) {
    this.layers.push(layer);
  } else {
    var defaultLayer = [];
    _.times(100, function () {
      defaultLayer.push("#fff");
    });
    this.layers.push(defaultLayer);
  }
};

CanvasObject.prototype.nextLayer = function () {
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

CanvasObject.prototype.animate = function () {
  var canvasObject = this;

  setInterval(function () {
    applyMapToCanvasObject(canvasObject.nextLayer(), canvasObject);
  }, 400);
};

function applyMapToCanvasObject (map, canvasObject) {
  var context = canvasObject.context;
  var cellSize = canvasObject.cellSize;
  var rows = canvasObject.element.height / cellSize;
  var columns = canvasObject.element.width / cellSize;
  _.each(map, function (cell, index) {
    if (cell) {
      var cellRowAndColumn = getCellRowAndColumnFromIndex(index, columns);
      drawCell(context, cellRowAndColumn.column * cellSize, cellRowAndColumn.row * cellSize, cellSize, cell);
    }
  });
}

//var mainCanvas = new CanvasObject(document.getElementById("main-area"), defaultCellSize);
//var previewCanvas = new CanvasObject(document.getElementById("preview"), defaultTinyCellSize);
//var constructorCanvas = new CanvasObject(document.getElementById("constructor-area"), defaultTinyCellSize);


function drawCell (context, x, y, size, color) {
  if (!color) color = defaultCellColor;
  if (!size) size = defaultCellSize;

  context.fillStyle = color;
  context.fillRect(x,y,size,size);
}

// input x, y and output clean x, y
function getCellPosition (x,y) {
  return {
    x: Math.floor(x/30.0) * 30,
    y: Math.floor(y/30.0) * 30
  };
}

function getCellRowAndColumnFromIndex (index, containerColumns) {
  return {
    row: Math.floor(index / containerColumns),
    column: index % containerColumns
  };
}

function getCellRowAndColumnFromPosition (roundedX, roundedY) {
  return {
    row: roundedY / defaultCellSize,
    column: roundedX / defaultCellSize
  };
}

function getCellPositionInArray (row, column, containerColumns) {
  // say it's 2x2 in a 30x30
  return containerColumns * row + column;
}


function setupCanvasForDrawing (canvasObject) {
  canvasObject.currentLayerCanvas.addEventListener('mousedown', function (event) {
    var cellPosition = getCellPosition(event.offsetX, event.offsetY);
    drawCell(canvasObject.currentLayerCanvasContext, cellPosition.x, cellPosition.y, defaultCellSize, canvasObject.selectedColor);
    var cellRowAndColumn = getCellRowAndColumnFromPosition(cellPosition.x, cellPosition.y);
    var cellPositionInArray = getCellPositionInArray(cellRowAndColumn.row, cellRowAndColumn.column, canvasObject.columns);
    canvasObject.layers[canvasObject.selectedLayerNum][cellPositionInArray] = canvasObject.selectedColor;
    canvasObject.map[cellPositionInArray] = canvasObject.selectedColor;
    //canvasObject.updateMirrors();
  }, false);

  canvasObject.currentLayerCanvas.addEventListener('mousemove', function (event) {
    if (mouseIsDown) {
      var cellPosition = getCellPosition(event.offsetX, event.offsetY);
      drawCell(canvasObject.currentLayerCanvasContext, cellPosition.x, cellPosition.y, defaultCellSize, canvasObject.selectedColor);
      var cellRowAndColumn = getCellRowAndColumnFromPosition(cellPosition.x, cellPosition.y);
      var cellPositionInArray = getCellPositionInArray(cellRowAndColumn.row, cellRowAndColumn.column, canvasObject.columns);
      canvasObject.layers[canvasObject.selectedLayerNum][cellPositionInArray] = canvasObject.selectedColor;
      canvasObject.map[cellPositionInArray] = canvasObject.selectedColor;
      //canvasObject.updateMirrors();
    }
  }, false);
}

//setupCanvasForDrawing(mainCanvas);
//setupCanvasForDrawing(constructorCanvas);


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

// addColorsToPalette(qs('#main-color-palette .column5'), colorDictionary, mainCanvas);
// addColorsToPalette(qs('#main-color-palette .column4'), grayscaleDictionary, mainCanvas);



function makeNewLayer (pattern) {
  var layerElement = makeNewElement("canvas");
  layerElement.className = "layer block";
  layerElement.width = defaultCellSize;
  layerElement.height = defaultCellSize;

  var layer = new CanvasObject(layerElement, defaultTinyCellSize);

  var layerContainer = makeNewElement();
  layerContainer.className = "block area-container";
  layerContainer.appendChild(layer.element);

  qs(".layers").appendChild(layerContainer);

  applyMapToCanvasObject(pattern, layer);

  return layer;
}

// each layer is a map
function makeNewAnimation (layers) {
  var animationElement = makeNewElement("canvas");
  animationElement.className = "preview";
  animationElement.width = defaultCellSize;
  animationElement.height = defaultCellSize;

  var currentLayerCanvas = document.getElementById("constructor-area");

  var animation = new CanvasObject(animationElement, defaultTinyCellSize, [], layers, currentLayerCanvas);

  document.getElementById('preview-container').appendChild(animation.element);

  _.each(layers, function (pattern, index) {
    var layer = makeNewLayer(pattern);
    animation.addMirror(layer, index);
  });

  //animation.updateMirrors();

  animation.animate();

  return animation;
}

layers = [[]];
_.times(100, function () {
  layers[0].push("#fff");
});

var animation = makeNewAnimation(layers);

document.getElementById('new-layer').addEventListener('mousedown', function (event) {
  animation.addLayer(null);
  makeNewLayer([]);
});

addColorsToPalette(qs('#constructor-color-palette .column2'), colorDictionary, animation);
addColorsToPalette(qs('#constructor-color-palette .column1'), grayscaleDictionary, animation);

setupCanvasForDrawing(animation);









