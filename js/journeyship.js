var defaultCellSize = 30;
var defaultTinyCellSize = 3;

var colorDictionary = {"red": "#ff1100", "orange1": "#ff6e00", "orange2": "#ffa100", "yellow1": "#ffd400", "yellow2": "#f7ff00", "green1": "#95f200", "green2": "#00e32c", "blue1": "#00a0e6", "blue2": "#2b6af4", "purple1": "#3b00eb", "purple2": "#bd00eb", "pink": "#eb0068"};
var grayscaleDictionary = {"black1": "#fff", "black2": "#e8e8e8", "black3": "#d1d1d1", "black4": "#bababa", "black5": "#a3a3a3", "black6": "#8c8c8c", "black7": "#737373", "black8": "#5c5c5c", "black9": "#454545", "black10": "#2e2e2e", "black11": "#171717", "black12": "#000"};

// setup animated block

function AnimatedBlock (layers) {
  var self = this;
  self.layers = [];
  self.layerIndex = -1;
  self.animationInterval = null;
  self.$animatedElement = null;

  _.each(layers, function (layer) {
    self.addLayer(layer);
  });
}

AnimatedBlock.prototype.resetIndex = function () {
  this.layerIndex = -1;
};

AnimatedBlock.prototype.addLayer = function (value, layerNum) {
  var layer = [];
  if (typeof value === 'string') {
    var color = value;
    _.times(100, function () {
      layer.push(color);
    });
  } else if (typeof value === 'object') {
    layer = value;
  }

  layerNum = layerNum || this.layers.length;
  this.layers.splice(layerNum, 0, layer);

  $.publish('added-layer', {
    layer: layer,
    animatedBlock: this
  });
};

AnimatedBlock.prototype.addLayers = function (layers) {
  var self = this;

  _.each(layers, function (layer) {
    self.addLayer(layer);
  });
};


AnimatedBlock.prototype.changeLayerValue = function (layerNum, indexNum, newValue) {
  if (!this.layers[layerNum]) {
    throw("Attempted to change a layer value of a layer that doesn't exist");
  }

  this.layers[layerNum][indexNum] = newValue;
  //$.publish('changed-layer-value'); // nothing subscribed
};

AnimatedBlock.prototype.removeLayer = function (layerNum) {
  this.layers.splice(layerNum, 1);
  $.publish('removed-layer', layerNum);
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

AnimatedBlock.prototype.animate = function () {
  var self = this;
  var context = self.$animatedElement[0].getContext('2d');
  // this should show and hide elements instead of drawing over and over again
  applyMapToContext(self.nextLayer(), context, defaultTinyCellSize, self.$animatedElement.width() / defaultTinyCellSize);
};

AnimatedBlock.prototype.startAnimation = function () {
  var self = this;
  self.animationInterval = setInterval(function () {
    self.animate();
  }, 300);
};

AnimatedBlock.prototype.pauseAnimation = function () {
  clearInterval(this.animationInterval);
};

// canvas helper functions

function drawCell (context, x, y, size, color) {
  if (!color) color = defaultCellColor;
  if (!size) size = defaultCellSize;

  context.fillStyle = color;
  context.fillRect(x,y,size,size);
}

function getCellPositionInArrayFromPosition (x, y, cellSize, columns) {
  var rowAndColumn = getCellRowAndColumnFromPosition(x, y, cellSize);
  return getCellPositionInArray(rowAndColumn.row, rowAndColumn.column, columns);
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
    row: Math.floor(roundedY / cellSize),
    column: Math.floor(roundedX / cellSize)
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
  };
}

function getCellPositionFromIndex (index, columns) {
  var rowAndColumn = getCellRowAndColumnFromIndex(index, columns);
  return getCellPositionFromRowAndColumn(rowAndColumn.row, rowAndColumn.column);
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

function DrawableSurface ($element, cellSize, defaultCellColor) {
  var self = this;
  self.$element = $element;
  self.cellSize = cellSize || defaultCellSize;
  self.columns = self.$element.width() / self.cellSize;
  self.rows = self.$element.height() / self.cellSize;
  self.selectedStyle = '#000';
  self.map = self.makeMap(defaultCellColor || '#fff');
  self.animatedMap = self.makeMap(null);
  self.makeDrawable();
  self.animatedInterval = null;

  self.startAnimating();
}

DrawableSurface.prototype.startAnimating = function () {
  var self = this;

  self.animatedInterval = setInterval(function() {
    self.renderAnimatedMap();
  }, 300);
};

DrawableSurface.prototype.pauseAnimating = function () {
  clearInterval(this.animatedInterval);
};

DrawableSurface.prototype.makeMap = function (cellColor) {
  var map = [];
  _.times(this.columns * this.rows, function () {
    map.push(cellColor);
  });
  return map;
};

DrawableSurface.prototype.render = function () {
  applyMapToContext(this.map, this.$element[0].getContext('2d'), this.cellSize, this.columns);
};

DrawableSurface.prototype.updateMap = function (x, y) {
  var cellRowAndColumn = getCellRowAndColumnFromPosition(x, y, this.cellSize);
  var cellPositionInArray = getCellPositionInArray(cellRowAndColumn.row, cellRowAndColumn.column, this.columns);
  this.map[cellPositionInArray] = this.selectedStyle;

  $.publish("updated-map", {
    surface: this,
    index: cellPositionInArray,
    value: this.selectedStyle
  });
};

DrawableSurface.prototype.drawHere = function (x, y) {
  drawCell(this.$element[0].getContext('2d'), x, y, this.cellSize, this.selectedStyle);
  this.updateMap(x,y);
};

DrawableSurface.prototype.makeDrawable = function () {
  var self = this;

  function drawIt (event) {
    if (typeof(self.selectedStyle) === 'string') {
      var cellPosition = getCellPosition(event.offsetX, event.offsetY, self.cellSize);
      self.drawHere(cellPosition.x, cellPosition.y);
    } else if (typeof(self.selectedStyle) === 'object' && self.selectedStyle.layers) {
      var positionInArray = getCellPositionInArrayFromPosition(event.offsetX, event.offsetY, self.cellSize, self.columns);
      self.animatedMap[positionInArray] = new AnimatedBlock(_.cloneDeep(self.selectedStyle.layers));

      _.each(self.animatedMap, function (block) {
        if (block) {
          block.resetIndex();
        }
      });
    }
  }

  self.$element.on('mousedown', function (event) {
    drawIt(event);
  });

  self.$element.on('mousemove', function (event) {
    if (mouseIsDown) {
      drawIt(event);
    }
  });
};

DrawableSurface.prototype.renderAnimatedMap = function () {
  var self = this;
  var context = self.$element[0].getContext('2d');

  _.each(self.animatedMap, function (block, index) {
    if (block) {
      var position = getCellPositionFromIndex(index, self.columns);
      applyMapToContext(block.nextLayer(), context, defaultTinyCellSize, 10, {
        x: position.x,
        y: position.y
      });
    }
  });
};



var editorArea = {
  animatedBlock: new AnimatedBlock(),
  drawableSurface: new DrawableSurface($('#constructor-area'), defaultCellSize),
  selectedLayerNum: 0,
  $layersContainerElement: $('.layers'),
  renderSelectedLayer: function () {
    // renders the selected layer based on the selected layer in the attached animated block
    var selectedLayer = this.animatedBlock.layers[this.selectedLayerNum],
    drawableContext = this.drawableSurface.$element[0].getContext('2d');

    if (selectedLayer) {
      // this might be a little redundant. need to decide whether to update the layer by drawing on it directly or by updating a map, not both
      applyMapToContext(selectedLayer, drawableContext, this.drawableSurface.cellSize, this.drawableSurface.columns);
    }

    // this renders the thumbnail of the selected layer
    if (this.selectedLayerNum >= 0) {
      var smallLayer = $('.layers .layer-container .block')[this.selectedLayerNum];
      var columns = smallLayer.width / defaultTinyCellSize;
      applyMapToContext(selectedLayer, smallLayer.getContext('2d'), defaultTinyCellSize, columns);
    }
  },
  addLayer: function (layerPattern) {
    var self = this;
    var $layerElement = makeNewBlock();
    var $layerContainer = makeNewElement();
    var $arrowElement = $('<div class="arrow"><img src="img/arrow.png" /></div>');
    $layerContainer.addClass('block area-container layer-container selected');    
    $layerContainer.append($layerElement.add($arrowElement));
    this.$layersContainerElement.append($layerContainer);
    $layerContainer.siblings('.layer-container').removeClass('selected');
    self.selectedLayerNum = $('.layers .layer-container').index($layerContainer);
    self.renderSelectedLayer();

    $layerContainer.on('mousedown', function (event) {
      $clickedElement = $(event.currentTarget);

      $clickedElement.addClass('selected');
      $clickedElement.siblings('.layer-container').removeClass('selected');

      self.selectedLayerNum =  $('.layers .layer-container').index($clickedElement);
      self.renderSelectedLayer();
    });

    var context = $layerElement[0].getContext('2d');
    var columns = $layerElement.width() / defaultTinyCellSize;
    applyMapToContext(layerPattern, context, defaultTinyCellSize, columns);
  },
  removeLayer: function (layerNum) {
    $('.layers .layer-container').eq(layerNum).remove();

    if (layerNum == self.selectedLayerNum) {
      if (self.selectedLayerNum === self.animatedBlock.layers.length) {
        self.selectedLayerNum = self.selectedLayerNum - 1;

        if (self.selectedLayerNum === -1) {
          self.animatedBlock.addLayer('#fff');
          self.selectedLayerNum = 0;
        }
      }

      $('.layers .layer-container').eq(self.selectedLayerNum).addClass('selected');;
      self.renderSelectedLayer();
    }
  },
  setup: function () {
    self = this;

    $.subscribe('added-layer', function (event, addedLayerUpdate) {
      if (self.animatedBlock == addedLayerUpdate.animatedBlock) {
        self.addLayer(addedLayerUpdate.layer);
      }
    });

    $.subscribe('removed-layer', function (event, layerNum) {
      self.removeLayer(layerNum);
      self.animatedBlock.resetIndex();
    });

    $.subscribe('updated-map', function (event, update) {
      if (update.surface === editorArea.drawableSurface) {
        editorArea.animatedBlock.changeLayerValue(editorArea.selectedLayerNum, update.index, update.value);
        // updates the thumbnail of the selected layer (and the selected layer itself) based on the selected layer of the attached animated block
        editorArea.renderSelectedLayer();
      }
    });

    self.animatedBlock.addLayers(['red', 'blue', 'orange']);
    var $animatedElement = makeNewBlock();
    $('#preview-container').append($animatedElement);
    self.animatedBlock.$animatedElement = $animatedElement;
    self.animatedBlock.startAnimation();

    $('#remove-layer').on('mousedown', function () {
      editorArea.animatedBlock.removeLayer(editorArea.selectedLayerNum);
    });

    $('#new-layer').on('mousedown', function () {
      editorArea.animatedBlock.addLayer("#fff");
    });

  }
};

editorArea.setup();


// set up main canvas

var mainArea = {
  drawableSurface: new DrawableSurface($('#main-area'), defaultCellSize)
};

// there should be a better way than this
var customAnimatedBlocks = {};

function ColorPalette (map, $container, parent) {
  var self = this;
  self.map = [];
  self.$containerElement = $container;
  self.paletteElements = [];
  self.parent = parent;
  self.columnElements = [];
  self.fillThisColumn = 0;

  _.each(map, function (value) {
    self.addStyle(value);
  });
}

ColorPalette.prototype.generatePaletteElement = function (value) {
  var $paletteElementContainer = makeNewElement();
  $paletteElementContainer.addClass('palette-element-container');

  if (typeof(value) === 'object' && value.layers) {
    var animatedBlock = value;

    var $animatedElement = makeNewBlock();
    $animatedElement.addClass('animated');

    var unique = _.uniqueId('id-');
    $animatedElement.attr('data-id', unique);
    customAnimatedBlocks[unique] = animatedBlock;

    animatedBlock.$animatedElement = $animatedElement;
    animatedBlock.startAnimation();

    $paletteElementContainer.append($animatedElement);
  } else if (typeof(value) === 'string') {
    var color = value;

    var $colorElement = makeNewElement();
    $colorElement.addClass("color block");
    $colorElement.css('background-color', color);

    $paletteElementContainer.append($colorElement);
  }

  this.paletteElements.push($paletteElementContainer);
  return $paletteElementContainer;
};

ColorPalette.prototype.addColumn = function () {
  var $column = $('<div class="column"></div>');
  this.columnElements.push($column);
  this.$containerElement.append($column);
  return $column;
};

ColorPalette.prototype.addPaletteElement = function ($element) {
  var $column;

  if (this.fillThisColumn === this.columnElements.length) {
    $column = this.addColumn();
  } else {
    $column = this.columnElements[this.fillThisColumn];
  }

  $column.append($element);

  _.each(this.paletteElements, function ($element) {
    $element.removeClass('selected');
  });
  $element.addClass('selected');

  var color = $element.children('.color').eq(0).css('background-color');
  var dataId = $element.children('.animated').eq(0).attr('data-id');
  if (dataId) {
    this.parent.drawableSurface.selectedStyle = customAnimatedBlocks[dataId];
  } else {
    this.parent.drawableSurface.selectedStyle = color;
  }

  this.addEventListeners($element);

  if (this.paletteElements.length % 12 === 0) {
    this.fillThisColumn = this.fillThisColumn + 1;
  }
};

ColorPalette.prototype.addMapValue = function (value) {
  this.map.push(value);
};

ColorPalette.prototype.addStyle = function (value) {
  this.addMapValue(value);

  var paletteElement = this.generatePaletteElement(value);
  this.addPaletteElement(paletteElement);
};

ColorPalette.prototype.addEventListeners = function ($paletteElement) {
  // this should unbind the previous event listeners before attaching new ones
  // or find time to bind this: do it when palette items are added instead of looping over all of them every time
  var self = this;

  $paletteElement.on('click', function (event) {
    var $clickedElement = $(event.currentTarget);

    $clickedElement.parent().parent().find('.palette-element-container.selected').removeClass('selected');
    $clickedElement.addClass('selected');

    var childrenThatAreColors = $clickedElement.children('.color');
    if (childrenThatAreColors.length) {
      self.parent.drawableSurface.selectedStyle = childrenThatAreColors.eq(0).css('background-color');
    } else {
      self.parent.drawableSurface.selectedStyle = customAnimatedBlocks[$clickedElement.children().eq(0).attr('data-id')];
    }
  });
};

var colors = _.union(_.values(colorDictionary), _.values(grayscaleDictionary));
var mainColorPalette = new ColorPalette (colors, $('#main-color-palette'), mainArea);
new ColorPalette (colors, $('#constructor-color-palette'), editorArea);


$('#save-block').on('mousedown', function (event) {
  mainColorPalette.addStyle(new AnimatedBlock(_.cloneDeep(editorArea.animatedBlock.layers)));

  //this is for making their animations line up 
  _.each(mainColorPalette.map, function (block) {
    if (block.layers) {
      block.pauseAnimation();
      block.resetIndex();
      block.startAnimation();
    }
  });
});































