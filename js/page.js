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
  $scope.newSquareBoxes = [[],[],[]];
  $scope.selectedLayer = $scope.newSquareBoxes[0];
  $scope.selectedLayerNum = 0;
  $scope.showThisPanel = 1;

  setInterval(function() {
    $scope.$apply(function() {
      if ($scope.showThisPanel === 2) {
        $scope.showThisPanel = 0;
      } else {
        $scope.showThisPanel++;
      }
    });
  }, 500);

  _.times(300, function() {
    $scope.boxes.push({color:"black2"});
  });

  _.times(100, function() {
    $scope.newSquareBoxes[0].push({color:"black2"});
  });

  _.times(100, function() {
    $scope.newSquareBoxes[1].push({color:"black2"});
  });

  _.times(100, function() {
    $scope.newSquareBoxes[2].push({color:"black2"});
  });

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

  $scope.selectLayer = function (num) {
    $scope.selectedLayerNum = num;
    $scope.selectedLayer = $scope.newSquareBoxes[num];
  };
}

















































