// callback gets (rowNum, columnNum, xPos, yPos)
function loopThroughCells (callback) {
  var numberOfRows = 10;
  var numberOfColumns = 30;
  var sizeOfCell = 30;

  _.times(numberOfColumns, function (columnNum) {
    _.times(numberOfRows, function (rowNum) {
      callback(rowNum, columnNum, columnNum * sizeOfCell, rowNum * sizeOfCell);
    });
  });
}