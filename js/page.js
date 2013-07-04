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

function PlayAreaController($scope) {
  $scope.boxes = [];
  $scope.colors = [];
  $scope.grayscales = [];
  $scope.selectedColor = "black12";
  $scope.selectedColorFactory = "black12";
  $scope.newSquareBoxes = [];
  $scope.selectedLayer = $scope.newSquareBoxes[0];
  $scope.showThisPanel = null;
  $scope.customBlocks = [];

  var showThisPanelIndex = 0;
  setInterval(function() {
    $scope.$apply(function() {
      if (showThisPanelIndex === $scope.newSquareBoxes.length - 1) {
        showThisPanelIndex = 0;
      } else {
        showThisPanelIndex++;
      }

      $scope.showThisPanel = $scope.newSquareBoxes[showThisPanelIndex];
    });
  }, 500);

  var Layer = function (numberOfBoxes) {
    var self = this;
    self.boxes = [];

    var init = function () {
      _.times(numberOfBoxes, function () {
        self.boxes.push({color: "black2"});
      });
    };

    init();
  };

  _.times(300, function() {
    $scope.boxes.push({color:"black2"});
  });


  $scope.newLayerBox = function () {
    $scope.newSquareBoxes.push(new Layer(100));
  }

  $scope.newLayerBox();

  _.each(colorDictionary, function (value, key, obj) {
    $scope.colors.push({color: key});
  });

  _.each(grayscaleDictionary, function (value, key, obj) {
    $scope.grayscales.push({color: key});
  });

  $scope.draw = function (box) {
    box.color = $scope.selectedColor;
  };

  $scope.drawOnMousedown = function (box) {
    if (mouseIsDown) {
      box.color = $scope.selectedColor;
    }
  };

  $scope.select = function (color) {
    $scope.selectedColor = color;
  };

  $scope.drawFactory = function (box) {
    box.color = $scope.selectedColorFactory;
  };

  $scope.drawOnMousedownFactory = function (box) {
    if (mouseIsDown) {
      box.color = $scope.selectedColorFactory;
    }
  };

  $scope.selectFactory = function (color) {
    $scope.selectedColorFactory = color;
  };

  $scope.selectLayer = function (layer) {
    $scope.selectedLayer = layer;
  };

  $scope.selectLayerByIndex = function (index) {
    $scope.selectLayer($scope.newSquareBoxes[index]);
  };  

  $scope.selectFirstLayer = function () {
    $scope.selectLayer($scope.newSquareBoxes[0]);
  };

  $scope.selectLastLayer = function () {
    $scope.selectLayer(_.last($scope.newSquareBoxes));
  };

  $scope.selectFirstLayer();

  $scope.makeNewLayer = function () {
    $scope.newSquareBoxes.push(new Layer(100));
    $scope.selectLastLayer();
  };

  $scope.deleteSelectedLayer = function (index) {
    $scope.newSquareBoxes.splice(index, 1);
    if ($scope.newSquareBoxes[index - 1]) {
      $scope.selectLayerByIndex(index - 1);
    } else {
      $scope.selectLayerByIndex(index);
    }
  };

  $scope.saveCustomBlock = function () {
    $scope.customBlocks.push($scope.newSquareBoxes.slice(0));
  };

}

















































