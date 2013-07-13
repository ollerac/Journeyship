


var colorDictionary = {"red": "#ff1100", "orange1": "#ff6e00", "orange2": "#ffa100", "yellow1": "#ffd400", "yellow2": "#f7ff00", "green1": "#95f200", "green2": "#00e32c", "blue1": "#00a0e6", "blue2": "#2b6af4", "purple1": "#3b00eb", "purple2": "#bd00eb", "pink": "#eb0068"};
var grayscaleDictionary = {"black1": "#fff", "black2": "#e8e8e8", "black3": "#d1d1d1", "black4": "#bababa", "black5": "#a3a3a3", "black6": "#8c8c8c", "black7": "#737373", "black8": "#5c5c5c", "black9": "#454545", "black10": "#2e2e2e", "black11": "#171717", "black12": "#000"};

mainCanvasElement = document.getElementById("main-area");
var mainCanvas = {
  element: mainCanvasElement,
  context: mainCanvasElement.getContext('2d'),
  selectedColor: '#000'
};

constructorCanvasElement = document.getElementById("constructor-area");
var constructorCanvas = {
  element: constructorCanvasElement,
  context: constructorCanvasElement.getContext('2d'),
  selectedColor: '#000'
};

function drawCell (context, x, y, color) {
  if (!color) color = defaultCellColor;

  context.fillStyle = color;
  context.fillRect(x,y,30,30);
}

// input x, y and output clean x, y
function getCellPosition (x,y) {
  return {
    x: Math.floor(x/30.0) * 30,
    y: Math.floor(y/30.0) * 30
  };
}


function setupCanvasForDrawing (canvasObject) {
  canvasObject.element.addEventListener('mousedown', function (event) {
    var cellPosition = getCellPosition(event.offsetX, event.offsetY);
    drawCell(canvasObject.context, cellPosition.x, cellPosition.y, canvasObject.selectedColor);
  }, false);

  canvasObject.element.addEventListener('mousemove', function (event) {
    if (mouseIsDown) {
      var cellPosition = getCellPosition(event.offsetX, event.offsetY);
      drawCell(canvasObject.context, cellPosition.x, cellPosition.y, canvasObject.selectedColor);
    }
  }, false);
}

setupCanvasForDrawing(mainCanvas);
setupCanvasForDrawing(constructorCanvas);








function makeNewElement () {
  return document.createElement("div");
}


function addColorsToPalette (paletteElement, colors, canvasObject) {
  _.each(colors, function (value, key, list) {
    colorElement = makeNewElement();
    colorElement.className = "color block";
    colorElement.style.backgroundColor = value;

    colorElement.addEventListener("click", function(event) {
      element = event.currentTarget;
      canvasObject.selectedColor = element.style.backgroundColor;
      console.log(canvasObject.selectedColor);
    });

    paletteElement.appendChild(colorElement);
  });
}

addColorsToPalette(qs('#main-color-palette .column5'), colorDictionary, mainCanvas);
addColorsToPalette(qs('#main-color-palette .column4'), grayscaleDictionary, mainCanvas);
addColorsToPalette(qs('#constructor-color-palette .column2'), colorDictionary, constructorCanvas);
addColorsToPalette(qs('#constructor-color-palette .column1'), grayscaleDictionary, constructorCanvas);




































