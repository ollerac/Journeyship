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

AnimatedBlock.prototype.addLayer = function (layer, layerNum) {
  layerNum = layerNum || this.layers.length;
  this.layers.splice(layerNum, 0, layer);
  PubSub.publish('added layer', {
    layer: layer,
    animatedBlock: this
  });
};

AnimatedBlock.prototype.changeLayerValue = function (layerNum, indexNum, newValue) {
  if (!this.layers[layerNum]) {
    throw("Attempted to change a layer value of a layer that doesn't exist")
  }

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
    // this should show and hide elements instead of drawing over and over again
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

function getCellRowAndColumnFromPosition (roundedX, roundedY, cellSize) {
  if (!cellSize) {
    cellSize = defaultCellSize;
  }

  return {
    row: roundedY / cellSize,
    column: roundedX / cellSize
  };
}

function getCellPositionInArray (row, column, containerColumns) {
  return containerColumns * row + column;
}

function getCellPositionFromRowAndColumn (row, column, cellSize) {
  if (!cellSize) {
    cellSize = defaultCellSize;
  }

  return {
    x: column * cellSize,
    y: row * cellSize
  }
}

function applyMapToContext (map, context, cellSize, columns, options) {
  if (!options) {
    options = {x: 0, y: 0};
  }

  _.each(map, function (color, index) {
    var cellRowAndColumn = getCellRowAndColumnFromIndex(index, columns);
    drawCell(context, options.x + cellRowAndColumn.column * cellSize, options.y + cellRowAndColumn.row * cellSize, cellSize, color);
  });
}





// drawable surface setup (i.e. the main canvas and the constructor canvas)

function DrawableSurface (element, cellSize, defaultCellColor) {
  var self = this;
  self.element = element;
  self.cellSize = cellSize || defaultCellSize;
  self.columns = self.element.width / self.cellSize;
  self.rows = self.element.height / self.cellSize;
  self.selectedColor = '#000';

  if (!defaultCellColor) {
    defaultCellColor = '#fff';
  }

  self.map = self.makeMap(defaultCellColor);
  self.makeDrawable();
}

DrawableSurface.prototype.makeMap = function (cellColor) {
  var map = [];
  _.times(this.columns * this.rows, function () {
    map.push(cellColor);
  });
  return map;
};

DrawableSurface.prototype.render = function () {
  applyMapToContext(this.map, this.element.getContext('2d'), this.cellSize, this.columns);
};

DrawableSurface.prototype.updateMap = function (x, y) {
  var cellRowAndColumn = getCellRowAndColumnFromPosition(x, y, this.cellSize);
  var cellPositionInArray = getCellPositionInArray(cellRowAndColumn.row, cellRowAndColumn.column, this.columns);
  this.map[cellPositionInArray] = this.selectedColor;

  PubSub.publish("updated map", {
    surface: this,
    index: cellPositionInArray,
    value: this.selectedColor
  });
};

DrawableSurface.prototype.drawHere = function (x, y) {
  drawCell(this.element.getContext('2d'), x, y, this.cellSize, this.selectedColor);
  this.updateMap(x,y);
};

DrawableSurface.prototype.makeDrawable = function () {
  var self = this;

  function drawIt (event) {
    var cellPosition = getCellPosition(event.offsetX, event.offsetY, self.cellSize);
    self.drawHere(cellPosition.x, cellPosition.y);
  }

  self.element.addEventListener('mousedown', function (event) {
    drawIt(event);
  }, false);

  self.element.addEventListener('mousemove', function (event) {
    if (mouseIsDown) {
      drawIt(event);
    }
  }, false);
};


// set up editor area, below the main area

var editorArea = {
  animatedBlock: new AnimatedBlock(),
  drawableSurface: new DrawableSurface(eid('constructor-area'), defaultCellSize),
  selectedLayerNum: 0,
  layersContainerElement: qs('.layers'),
  renderSelectedLayer: function () {
    var selectedLayer = this.animatedBlock.layers[this.selectedLayerNum],
    drawableContext = this.drawableSurface.element.getContext('2d');

    if (selectedLayer) {
      applyMapToContext(selectedLayer, drawableContext, this.drawableSurface.cellSize, this.drawableSurface.columns);
    }

    // this renders the thumbnail of the selected layer
    var smallLayer = qsa('.layers .layer-container .block')[this.selectedLayerNum];
    var columns = smallLayer.width / defaultTinyCellSize;
    applyMapToContext(selectedLayer, smallLayer.getContext('2d'), defaultTinyCellSize, columns);
  },
  addLayer: function (layerPattern) {
    var self = this;
    var layerElement = makeNewBlock();
    var layerContainer = makeNewElement();
    layerContainer.className = 'block area-container layer-container';
    layerContainer.appendChild(layerElement);
    this.layersContainerElement.appendChild(layerContainer);

    layerContainer.addEventListener('mousedown', function (event) {
      self.selectedLayerNum =  qsa('.layers .layer-container').indexOf(event.currentTarget);
      self.renderSelectedLayer();
    });

    var context = layerElement.getContext('2d');
    var columns = layerElement.width / defaultTinyCellSize;
    applyMapToContext(layerPattern, context, defaultTinyCellSize, columns);
  },
  removeLayer: function (layerNum) {
    qsa('.layers .layer-container')[layerNum].remove();
  }
};

PubSub.subscribe('added layer', function (msg, stuff) {
  if (editorArea.animatedBlock == stuff.animatedBlock) {
    editorArea.addLayer(stuff.layer);
    // should only call the following when drawing
    editorArea.renderSelectedLayer();
  }
});

PubSub.subscribe('removed layer', function (msg, layerNum) {
  editorArea.removeLayer(layerNum);
});


// create animated block and start animating its element in the dom

colors = ['red', 'blue', 'orange'];
_.times(3, function (index) {
  var layer = [];
  _.times(100, function () {
    layer.push(colors[index]);
  });
  editorArea.animatedBlock.addLayer(layer);
});

var animatedElement = makeNewBlock();
document.getElementById('preview-container').appendChild(animatedElement);
editorArea.animatedBlock.animate(animatedElement);



// remove layer dom event

eid('remove-layer').addEventListener('mousedown', function () {
  editorArea.animatedBlock.removeLayer(editorArea.selectedLayerNum);
});

// add blank layer dom event

eid('new-layer').addEventListener('mousedown', function () {
  var newLayer = [];
  _.times(100, function () {
    newLayer.push("#fff");
  });

  editorArea.animatedBlock.addLayer(newLayer);
});

// random

PubSub.subscribe('updated map', function (msg, update) {
  if (update.surface === editorArea.drawableSurface) {
    editorArea.animatedBlock.changeLayerValue(editorArea.selectedLayerNum, update.index, update.value);
    editorArea.renderSelectedLayer();
  }
});

// set up main canvas

var mainArea = {
  drawableSurface: new DrawableSurface(eid('main-area'), defaultCellSize)
};


function ColorPalette (colors, container, parent) {
  var self = this;
  self.colors = [];
  self.containerElement = container;
  self.colorElements = [];
  self.parent = parent;

  _.each(colors, function (color) {
    self.addColor(color);
  });

  self.render();
  self.addEventListeners();
}

ColorPalette.prototype.addColor = function (color) {
  this.colors.push(color);
};

ColorPalette.prototype.generateColorElement = function (color) {
  var colorElement = makeNewElement();
  colorElement.className = "color block";
  colorElement.style.backgroundColor = color;
  this.colorElements.push(colorElement);
  return colorElement;
};

ColorPalette.prototype.render = function () {
  var self = this;
  _.each(this.colors, function (color) {
    self.containerElement.appendChild(self.generateColorElement(color));
  });
};

ColorPalette.prototype.addEventListeners = function () {
  var self = this;
  _.each(this.colorElements, function (element) {
    element.addEventListener('click', function (event) {
      var element = event.currentTarget;
      self.parent.drawableSurface.selectedColor = element.style.backgroundColor;
    });
  });
};


new ColorPalette(_.values(colorDictionary), qs('#main-color-palette .column5'), mainArea);
new ColorPalette(_.values(grayscaleDictionary), qs('#main-color-palette .column4'), mainArea);
new ColorPalette(_.values(colorDictionary), qs('#constructor-color-palette .column2'), editorArea);
new ColorPalette(_.values(grayscaleDictionary), qs('#constructor-color-palette .column1'), editorArea);






// var bunchOfAnimatedBlocks = [];

// _.times(300, function() {
//   var newAnimatedBlock = new AnimatedBlock();
//   colors = ['red', 'blue', 'orange'];
//   _.times(3, function (index) {
//     var layer = [];
//     _.times(100, function () {
//       layer.push(colors[index]);
//     });
//     newAnimatedBlock.addLayer(layer);
//   });
//   bunchOfAnimatedBlocks.push(newAnimatedBlock);
// });

// var drawOnThisContext = mainArea.element.getContext('2d');

// setInterval(function(){
//   _.each(bunchOfAnimatedBlocks, function(block, index, list) {
//     var rowAndColumn = getCellRowAndColumnFromIndex(index, 30);
//     var position = getCellPositionFromRowAndColumn(rowAndColumn.row, rowAndColumn.column);
//     var options = {
//       x: position.x,
//       y: position.y
//     };
//     applyMapToContext(block.nextLayer(), drawOnThisContext, defaultTinyCellSize, 10, options);
//   });
// }, 300);





























