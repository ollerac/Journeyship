function convertToArray (arrayLike) {
  var newArray = [];
  _.each(arrayLike, function (item) {
    newArray.push(item);
  });
  return newArray;
}

function qsa (selector) {
   var results = document.querySelectorAll(selector);

   return results ? convertToArray(results) : null;
}

function qs (selector) {
  return document.querySelector(selector);
}

function eid (id) {
  return document.getElementById(id);
}

function makeNewElement (type) {
  if (!type) {
    return document.createElement("div");
  }

  switch (type) {
    case "div":
      return document.createElement("div");
    case "canvas":
      return document.createElement("canvas");
  }
}

function makeNewBlock () {
  var block = makeNewElement('canvas');
  block.className = 'block';
  block.width = defaultCellSize;
  block.height = defaultCellSize;
  return block;
}