var colorDictionary = {"red": "#ff1100", "orange1": "#ff6e00", "orange2": "#ffa100", "yellow1": "#ffd400", "yellow2": "#f7ff00", "green1": "#95f200", "green2": "#00e32c", "blue1": "#00a0e6", "blue2": "#2b6af4", "purple1": "#3b00eb", "purple2": "#bd00eb", "pink": "#eb0068"};
var grayscaleDictionary = {"black1": "#fff", "black2": "#e8e8e8", "black3": "#d1d1d1", "black4": "#bababa", "black5": "#a3a3a3", "black6": "#8c8c8c", "black7": "#737373", "black8": "#5c5c5c", "black9": "#454545", "black10": "#2e2e2e", "black11": "#171717", "black12": "#000"};

var mouseIsDown = false;
$(function() {
  $("body").on({
      mousedown: function () {
          mouseIsDown = true;
      },
      mouseup: function () {
          mouseIsDown = false;
      }
  });
});

var app = angular.module('JourneyShipApp', []);

app.value('newLayer', function (numberOfBoxes, color) {
  var arrayOfBoxes = [];

  _.times(numberOfBoxes, function () {
    arrayOfBoxes.push(color);
  });

  return arrayOfBoxes;
});

/*
collection of blocks [block, block, block]
block (collection of layers) [layer, layer, layer]
layer (collection of colors) [colorName, colorName, colorName)
*/

app.controller('PlayAreaController', function ($scope, newLayer) {
  $scope.blocks = [];
  $scope.colors = [];
  $scope.grayscales = [];
  $scope.selectedColor = "black12";
  $scope.selectedLayerColor= "black12";
  $scope.layersInNewSquare = [];
  $scope.selectedLayer = null;
  $scope.showThisPanel = null;
  $scope.customBlocks = [];

  _.times(300, function() {
    $scope.blocks.push("black2");
  });

  _.each(colorDictionary, function (value, key, obj) {
    $scope.colors.push(key);
  });

  _.each(grayscaleDictionary, function (value, key, obj) {
    $scope.grayscales.push(key);
  });

  $scope.draw = function (boxes, index) {
    boxes[index] = $scope.selectedColor;
  };

  $scope.drawOnMousedown = function (boxes, index) {
    if (mouseIsDown) {
      boxes[index] = $scope.selectedColor;
    }
  };

  $scope.select = function (color) {
    console.log(color);
    $scope.selectedColor = color;
  };

  $scope.drawOnLayer = function (boxes, index) {
    boxes[index] = $scope.selectedLayerColor;
  };

  $scope.drawOnLayerOnMousedown = function (boxes, index) {
    if (mouseIsDown) {
      boxes[index] = $scope.selectedLayerColor;
    }
  };

  $scope.selectColorForLayer = function (color) {
    $scope.selectedLayerColor = color;
  };

  $scope.selectLayer = function (layer) {
    $scope.selectedLayer = layer;
  };

  $scope.selectLayerByIndex = function (index) {
    $scope.selectLayer($scope.layersInNewSquare[index]);
  };

  $scope.selectFirstLayer = function () {
    $scope.selectLayer($scope.layersInNewSquare[0]);
  };

  $scope.selectLastLayer = function () {
    $scope.selectLayer(_.last($scope.layersInNewSquare));
  };

  $scope.makeNewLayer = function () {
    $scope.layersInNewSquare.push(newLayer(100, "black2"));
    $scope.selectLastLayer();
  };

  $scope.makeNewLayer();

  $scope.deleteSelectedLayer = function (index) {
    $scope.layersInNewSquare.splice(index, 1);
    if ($scope.layersInNewSquare[index - 1]) {
      $scope.selectLayerByIndex(index - 1);
    } else {
      $scope.selectLayerByIndex(index);
    }
  };

  $scope.saveCustomBlock = function () {
    var copyOfNewLayer = $.extend(true, [], $scope.layersInNewSquare);
    $scope.customBlocks.push(copyOfNewLayer);
  };
});


app.directive('animatedBoxes', function ($timeout) {
  return {
    scope: {
      layers: '=animatedBoxes'
    },
    template: "<li class='square layer' ng-repeat='layer in layers' " +
    "ng-click='selectAnimatedBlock(layers)'" +
    "ng-show='showThis == $index'><ul class='tiny-squares-container' layer='layer'>" +
    "" +
    "</ul></li>",
    link: function (scope, elem, attrs) {
      scope.showThis = 0;
      var count = 0;

      scope.$watch('layers', function (value) {
        if (value) count = value.length;
        else count = 0;
      }, true);

      var nextLayer = function () {
        if (scope.showThis >= count - 1) scope.showThis = 0;
        else scope.showThis++;
        $timeout(nextLayer, 500);
      };

      nextLayer();
    }
  };
});


app.directive('layer', function () {
  return {
    scope: {
      layer: '=layer'
    },
    template: "",
    link: function (scope, elem, attrs) {

      scope.$watch('layer', function (value) {
        var tinySquares = [];

        _.each(value, function (color, index, list) {
          tinySquares.push("<li class='square tiny-square " + color + "'></li>");
        });

        elem.html(tinySquares.join(""));
      }, true);

    }
  };
});

// console.time("asd");
// blocks = [];
// hundredTinyBlocks = [];
// _.times(100, function () {
//   hundredTinyBlocks.push("<li class='square tiny-square black12'></li>");
// });

// _.times(300, function () {
//   blocks.push("<li class='square layer'><ul class='tiny-squares-container' layer='layer'>" + hundredTinyBlocks.join("") + "</ul></li>");
// });

// $("#main .play-area").html(blocks.join(""));
// console.timeEnd("asd");
