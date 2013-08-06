var defaultCellSize = 30;
var defaultTinyCellSize = 3;

var colorDictionary = {"red": "#ff1100", "orange1": "#ff6e00", "orange2": "#ffa100", "yellow1": "#ffd400", "yellow2": "#f7ff00", "green1": "#95f200", "green2": "#00e32c", "blue1": "#00a0e6", "blue2": "#2b6af4", "purple1": "#3b00eb", "purple2": "#bd00eb", "pink": "#eb0068"};
var grayscaleDictionary = {
  "black1": "transparent",
  "black2": "#fff",
  "black3": "#e5e5e5",
  "black4": "#cccccc",
  "black5": "#b2b2b2",
  "black6": "#999999",
  "black7": "#808080",
  "black8": "#666666",
  "black9": "#4d4d4d",
  "black10": "#333333",
  "black11": "#1a1a1a",
  "black12": "#000"
};

// setup animated block

function AnimatedBlock (layers, options) {
  var defaults = {
    uniqueId: _.uniqueId('id-')
  };

  _.extend(defaults, options);

  var self = this;
  self.layers = [];
  self.layerIndex = -1;
  self.animationInterval = null;
  self.$animatedElement = null;
  self.uniqueId = defaults.uniqueId;

  _.each(layers, function (layer) {
    self.addLayer(layer);
  });
}

AnimatedBlock.prototype.resetIndex = function () {
  this.layerIndex = -1;
};

AnimatedBlock.prototype.addLayer = function (value, layerNumOption) {
  var layer = [];
  if (typeof value === 'string') {
    var color = value;
    _.times(100, function () {
      layer.push(color);
    });
  } else if (typeof value === 'object') {
    layer = value;
  }

  var layerNum = typeof(layerNumOption) === 'number' ? layerNumOption : this.layers.length;
  this.layers.splice(layerNum, 0, layer);

  $.publish('added-layer', {
    layer: layer,
    animatedBlock: this,
    layerNum: layerNum
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

AnimatedBlock.prototype.removeAllLayers = function () {
  var self = this;
  _.each(self.layers, function (layer, index) {
    self.removeLayer(0);
  });
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
  var layer =self.nextLayer();
  // this should show and hide elements instead of drawing over and over again
  applyMapToContext(layer, context, defaultTinyCellSize, self.$animatedElement.width() / defaultTinyCellSize);
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

function clearCell (context, x, y, size) {
  if (!size) size = defaultCellSize;

  context.clearRect(x,y,size,size);
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

function getCellPositionFromIndex (index, columns, cellSize) {
  var rowAndColumn = getCellRowAndColumnFromIndex(index, columns);
  return getCellPositionFromRowAndColumn(rowAndColumn.row, rowAndColumn.column, cellSize);
}

function applyMapToContext (map, context, cellSize, columns, options) {
  var defaults = {
    x: 0,
    y: 0,
    withTransparency: false
  };

  _.extend(defaults, options);

  _.each(map, function (color, index) {
    var cellPosition = getCellPositionFromIndex(index, columns, cellSize);

    if (defaults.withTransparency && /rgba.*,.*,.*,.0\)/.test(color)) {
      clearCell(context, defaults.x + cellPosition.x, defaults.y + cellPosition.y, cellSize);
    } else {
      drawCell(context, defaults.x + cellPosition.x, defaults.y + cellPosition.y, cellSize, color);
    }
  });
}

function makeMap (cellColor, cellCount) {
  var map = [];
  _.times(cellCount, function () {
    map.push(cellColor);
  });
  return map;
};





// drawable surface setup (i.e. the main canvas and the constructor canvas)

function DrawableSurface ($element, cellSize, defaultCellColor) {
  var self = this;
  self.$element = $element;
  self.cellSize = cellSize || defaultCellSize;
  self.columns = self.$element.width() / self.cellSize;
  self.rows = self.$element.height() / self.cellSize;
  self.selectedStyle = '#000';
  self.map = self.makeMap(defaultCellColor || '#fff'); //background, also potentially animated
  self.animatedMap = self.makeMap(null); // foreground
  self.animatedInterval = null;
  self.drawOnBackground = true;

  self.makeDrawable();
  //self.renderFirstMap();
  //self.startAnimating();
}

DrawableSurface.prototype.startAnimating = function () {
  var self = this;

  self.animatedInterval = setInterval(function() {
    self.renderFirstMap();
    self.renderSecondMap();
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

DrawableSurface.prototype.makeDrawable = function () {
  var self = this;
  var positionInArray;

  function drawIt (event) {
    if (typeof(self.selectedStyle) === 'string') {
      var cellPosition = getCellPosition(event.offsetX, event.offsetY, self.cellSize);
      if (/rgba.*,.*,.*,.0\)/.test(self.selectedStyle)) {
        clearCell(self.$element[0].getContext('2d'), cellPosition.x, cellPosition.y, self.cellSize);
      } else {
        drawCell(self.$element[0].getContext('2d'), cellPosition.x, cellPosition.y, self.cellSize, self.selectedStyle);
      }
      positionInArray = getCellPositionInArrayFromPosition(cellPosition.x, cellPosition.y, self.cellSize, self.columns);
    } else if (typeof(self.selectedStyle) === 'object' && self.selectedStyle.layers) {
      positionInArray = getCellPositionInArrayFromPosition(event.offsetX, event.offsetY, self.cellSize, self.columns);
    }

    if (self.drawOnBackground) {
      self.map[positionInArray] = new AnimatedBlock(_.cloneDeep(self.selectedStyle.layers));
    } else {
      self.animatedMap[positionInArray] = new AnimatedBlock(_.cloneDeep(self.selectedStyle.layers));

      _.each(self.animatedMap, function (block) {
        if (block) {
          block.resetIndex();
        }
      });
    }

    $.publish("updated-map", {
      surface: self,
      index: positionInArray,
      value: self.selectedStyle
    });

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

DrawableSurface.prototype.renderMap = function (map) {
  var self = this;
  var context = self.$element[0].getContext('2d');

  _.each(map, function (block, index) {
    if (block) {
      var position = getCellPositionFromIndex(index, self.columns);

      if (typeof(block) === 'object' && block.layers) {
        applyMapToContext(block.nextLayer(), context, defaultTinyCellSize, 10, {
          x: position.x,
          y: position.y
        });
      } else {
        drawCell(context, position.x, position.y, defaultCellSize, block);
      }
    }
  });
};

DrawableSurface.prototype.renderFirstMap = function () {
  this.renderMap(this.map);
};

DrawableSurface.prototype.renderSecondMap = function () {
  this.renderMap(this.animatedMap);
};


var editorArea = {
  animatedBlock: new AnimatedBlock(),
  drawableSurfaces: [],
  selectedLayerNum: 0,
  selectedStyle: '#000',
  $layersContainerElement: $('.layers'),
  makeNewAnimatedBlock: function (layers) {
    var self = this;

    this.animatedBlock.pauseAnimation();
    this.animatedBlock.removeAllLayers();
    this.animatedBlock = new AnimatedBlock();

    if (layers) {
      self.animatedBlock.addLayers(layers);
    } else {
      this.animatedBlock.addLayer('#fff');
    }

    this.animatedBlock.$animatedElement = $('#preview-container').children('canvas.block');
    this.animatedBlock.startAnimation();

    return this.animatedBlock;
  },
  setSelectedLayer: function (num) {
    if (num > this.drawableSurfaces.length - 1) {
      throw 'Can\'t set selcted layer cuz it\'s not there';
    } else {
      this.selectedLayerNum = num;

      var surfaceCount = this.drawableSurfaces.length;
      _.each(this.drawableSurfaces, function (surface, index) {
        if (index === num) {
          surface.$element.css('z-index', 100 + surfaceCount + num);
        } else if (index < num) {
          surface.$element.css('z-index', 100 + surfaceCount + index);
        } else if (index > num) {
          surface.$element.css('z-index', 100 + surfaceCount - index - (surfaceCount - index));
        }
      });

      $('.layers .layer-container').eq(this.selectedLayerNum).addClass('selected');
    }
  },
  setSelectedStyle: function (style) {
    this.selectedStyle = style;

    _.each(this.drawableSurfaces, function (surface) {
      surface.selectedStyle = style;
    });
  },
  refreshSelectedStyle: function () {
    var self = this;

    _.each(this.drawableSurfaces, function (surface) {
      surface.selectedStyle = self.selectedStyle;
    });
  },
  selectedDrawableSurface: function () {
    return this.drawableSurfaces[this.selectedLayerNum];
  },
  renderSelectedLayer: function () {
    // renders the selected layer based on the selected layer in the attached animated block
    var selectedLayer = this.animatedBlock.layers[this.selectedLayerNum];

    if (selectedLayer && this.selectedDrawableSurface()) {
      var drawableSurface = this.selectedDrawableSurface(),
        drawableContext = drawableSurface.$element[0].getContext('2d');

      // this might be a little redundant. need to decide whether to update the layer by drawing on it directly or by updating a map, not both
      drawableSurface.map = selectedLayer;
      applyMapToContext(selectedLayer, drawableContext, drawableSurface.cellSize, drawableSurface.columns);
    }

    // this renders the thumbnail of the selected layer
    if (this.selectedLayerNum >= 0) {
      var smallLayer = $('.layers .layer-container .block')[this.selectedLayerNum];
      var columns = smallLayer.width / defaultTinyCellSize;
      applyMapToContext(selectedLayer, smallLayer.getContext('2d'), defaultTinyCellSize, columns, {withTransparency: true});
    }
  },
  addLayer: function (layerPattern, layerNum) {
    var self = this;

    // layer menu setup
    var $layerElement = makeNewBlock();
    var $layerContainer = makeNewElement();
    var $arrowElement = $('<div class="arrow"><img src="img/arrow.png" /></div>');
    $layerContainer.addClass('block area-container layer-container selected');
    $layerContainer.append($layerElement.add($arrowElement));

    var layers = this.$layersContainerElement.children('.layer-container');
    if (layers.length && typeof(layerNum) === 'number') {
      layers.eq(layerNum - 1).after($layerContainer);
    } else {
      this.$layersContainerElement.append($layerContainer);
    }

    $layerContainer.siblings('.layer-container').removeClass('selected');

    // adds event listener to layers in layer menu
    $layerContainer.on('click', function (event) {
      $clickedElement = $(event.currentTarget);

      $clickedElement.addClass('selected');
      $clickedElement.siblings('.layer-container').removeClass('selected');

      self.setSelectedLayer($('.layers .layer-container').index($clickedElement));
      self.renderSelectedLayer();
    });

    // applies pattern to layer in layer menu
    var context = $layerElement[0].getContext('2d');
    var columns = $layerElement.width() / defaultTinyCellSize;
    applyMapToContext(layerPattern, context, defaultTinyCellSize, columns);

    var constructorArea = $('<canvas></canvas>')
                              .addClass('constructor-area')
                              .attr('width', 300)
                              .attr('height', 300)
                              .appendTo('#constructor-area-container');

    var surface = new DrawableSurface(constructorArea, defaultCellSize);
    this.drawableSurfaces.splice(layerNum, 0, surface);
    self.setSelectedLayer(layerNum);

    // renders editor area canvas and selected layer in layers menu
    self.renderSelectedLayer();

    self.refreshSelectedStyle();
  },
  removeLayer: function (layerNum) {
    // don't use this directly, remove from the animatedBlock instead
    $('#constructor-area-container .constructor-area').eq(layerNum).remove();
    $('.layers .layer-container').eq(layerNum).remove();
    this.drawableSurfaces.splice(layerNum, 1);

    self.setSelectedLayer(self.selectedLayerNum - 1);

    self.renderSelectedLayer();
  },
  setup: function () {
    self = this;

    $.subscribe('added-layer', function (event, addedLayerUpdate) {
      if (self.animatedBlock == addedLayerUpdate.animatedBlock) {
        self.addLayer(addedLayerUpdate.layer, addedLayerUpdate.layerNum);
      }
    });

    $.subscribe('removed-layer', function (event, layerNum) {
      self.removeLayer(layerNum);
      self.animatedBlock.resetIndex();
    });

    // this comes from drawing on an editor area
    $.subscribe('updated-map', function (event, update) {
      if (update.surface === editorArea.selectedDrawableSurface()) {
        self.animatedBlock.changeLayerValue(self.selectedLayerNum, update.index, update.value);
        // updates the thumbnail of the selected layer (and the selected layer itself) based on the selected layer of the attached animated block
        self.renderSelectedLayer();
      }
    });

    self.animatedBlock.addLayers([colorDictionary['red'], colorDictionary['purple1'], colorDictionary['orange1']]);
    var $animatedElement = makeNewBlock();
    $('#preview-container').append($animatedElement);
    self.animatedBlock.$animatedElement = $animatedElement;
    self.animatedBlock.startAnimation();

    $('#remove-layer').on('click', function () {
      event.preventDefault();
      self.animatedBlock.removeLayer(self.selectedLayerNum);
      if (self.animatedBlock.layers.length === 0) {
        self.animatedBlock.addLayer('#fff');
        self.setSelectedLayer(0);
      }
    });

    $('#new-layer').on('click', function () {
      event.preventDefault();
      self.animatedBlock.addLayer("#fff", self.selectedLayerNum + 1);
    });

    $('#copy-layer').on('click', function () {
      event.preventDefault();
      self.animatedBlock.addLayer(_.cloneDeep(self.animatedBlock.layers[self.selectedLayerNum]), self.selectedLayerNum + 1);
    });

  }
};

editorArea.setup();


// set up main canvas

var mainArea = {
  drawableSurfaces: [new DrawableSurface($('#main-area'), defaultCellSize)],
  selectedStyle: '#000',
  setSelectedStyle: function (style) {
    this.selectedStyle = style;
    this.drawableSurfaces[0].selectedStyle = style;

    $.publish('selected-style', {
      surface: this,
      style: style
    });
  },
  refreshSelectedStyle: function () {
    var self = this;

    _.each(this.drawableSurfaces, function (surface) {
      surface.selectedStyle = self.selectedStyle;
    });
  },
  selectedDrawableSurface: function () {
    return this.drawableSurfaces[0];
  },
  setup: function () {
    this.selectedDrawableSurface().startAnimating();
  }
};

mainArea.setup();

// there should be a better way than this
// stored according to a data-id so they're easy to look up when assigning a selectedStyle
var customAnimatedBlocks = {};


// parent is an area, either mainArea or editorArea
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

    $animatedElement.attr('data-id', animatedBlock.uniqueId);
    customAnimatedBlocks[animatedBlock.uniqueId] = animatedBlock;

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
  this.parent.setSelectedStyle(customAnimatedBlocks[dataId] || color);

  this.addEventListeners($element);

  if (this.paletteElements.length % 12 === 0) {
    this.fillThisColumn = this.fillThisColumn + 1;
  }
};

ColorPalette.prototype.addMapValue = function (value) {
  this.map.push(value);
};

ColorPalette.prototype.getBlockWithId = function (id) {
  if (!id) return null;

  var matchingBlock = null;
  _.each(this.map, function (block) {
    matchingBlock = block.uniqueId === id ? block : null;
  });

  return matchingBlock;
};

// pass in a new AnimatedBlock or a color as a string
ColorPalette.prototype.addStyle = function (value) {
  this.addMapValue(value);
  var paletteElement = this.generatePaletteElement(value);
  this.addPaletteElement(paletteElement);
};

ColorPalette.prototype.saveCustomBlock = function (layers, id) {
  var matchingBlock = this.getBlockWithId(id);
  if (matchingBlock) {
    matchingBlock.layers = layers;
  }
};

ColorPalette.prototype.addEventListeners = function ($paletteElement) {
  // this should unbind the previous event listeners before attaching new ones
  // or find time to bind this: do it when palette items are added instead of looping over all of them every time
  var self = this;

  $paletteElement.on('click', function (event) {
    var $clickedElement = $(event.currentTarget);

    $clickedElement.parent().parent().find('.palette-element-container.selected').removeClass('selected');
    $clickedElement.addClass('selected');

    var color = $clickedElement.children('.color').eq(0).css('background-color');
    var dataId = $clickedElement.children('.animated').eq(0).attr('data-id');
    self.parent.setSelectedStyle(customAnimatedBlocks[dataId] || color);

  });
};

$.subscribe('selected-style', function (event, update) {
  var buttons = $('#copy-block, #delete-block');
  if (typeof(update.style) === 'object' && update.style.layers) {
    buttons.css('display', 'inline-block');
    buttons.show();
  } else {
    buttons.hide();
  }
});

var colors = _.union(_.values(colorDictionary), _.values(grayscaleDictionary));
var mainColorPalette = new ColorPalette (colors, $('#main-color-palette'), mainArea);
var editorAreaColorPalette = new ColorPalette (colors, $('#constructor-color-palette'), editorArea);



$('#new-block').on('click', function (event) {
  event.preventDefault();
  editorArea.makeNewAnimatedBlock();
  mainColorPalette.addStyle(new AnimatedBlock(_.cloneDeep(editorArea.animatedBlock.layers), {uniqueId: editorArea.animatedBlock.uniqueId}));
});

$('#save-block').on('click', function (event) {
  event.preventDefault();
  mainColorPalette.saveCustomBlock(_.cloneDeep(editorArea.animatedBlock.layers), editorArea.animatedBlock.uniqueId);

  //this is for making their animations line up 
  _.each(mainColorPalette.map, function (block) {
    if (block.layers) {
      block.pauseAnimation();
      block.resetIndex();
      block.startAnimation();
    }
  });
});

$('#copy-block').on('click', function (event) {
  event.preventDefault();

  var newAnimatedBlock = editorArea.makeNewAnimatedBlock(_.cloneDeep(mainArea.selectedDrawableSurface().selectedStyle.layers));
  mainColorPalette.addStyle(new AnimatedBlock(_.cloneDeep(mainArea.selectedDrawableSurface().selectedStyle.layers), {uniqueId: newAnimatedBlock.uniqueId}));
});

$('#delete-block').on('click', function (event) {
  event.preventDefault();
  //console.log($(event.currentTarget).attr('data-id'));
  console.log(mainColorPalette.parent.selectedStyle);
});

$('#enable-shadow').on('click', function () {
  if (this.checked) {
    $('.constructor-area').css('opacity', '1').eq(editorArea.selectedLayerNum).css('opacity', '.5');
  } else {
    $('.constructor-area').css('opacity', '1');
  }
});


$('#bg-fg-switch').on('click', function (event) {
  event.preventDefault();
  var button = $(event.currentTarget);

  if (mainArea.selectedDrawableSurface().drawOnBackground) {
    button.children('.inner').text('Editing Foreground');
    mainArea.selectedDrawableSurface().drawOnBackground = false;
  } else {
    button.children('.inner').text('Editing Background');
    mainArea.selectedDrawableSurface().drawOnBackground = true;
  }
});






mainColorPalette.addStyle(new AnimatedBlock(tree));


















