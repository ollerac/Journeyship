(function($) {

  var o = $({});

  $.subscribe = function() {
    o.on.apply(o, arguments);
  };

  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };

  $.publish = function() {
    o.trigger.apply(o, arguments);
  };

}(jQuery));


function makeNewElement (type) {
  if (!type) {
    type = 'div';
  }

  switch (type) {
    case "div":
      return $('<div></div>');
    case "canvas":
      return $('<canvas></canvas>');
  }
}


function makeNewBlock (size) {
  var block = makeNewElement('canvas');
  block.addClass('block');
  block.attr('width', size || defaultCellSize);
  block.attr('height', size || defaultCellSize);
  return block;
}

var startTime = +new Date();
var endCounter = false;

function processArray(items, process, finished) {
  var idx = 0;
  var todo = items.concat();

  setTimeout(function() {
    process(todo.shift(), idx);
    if(todo.length > 0) {
      idx++;
      setTimeout(arguments.callee, 25);
    } else {
      finished();
    }

    if (!endCounter && +new Date() - startTime > 5000) {
      $.publish('bigOne');
      endCounter = true;
    }
  }, 25);
}

function replaceLayersWithAnimatedBlocks (map, eventNameWhenDone) {
  if (map) {
    processArray(map, function (value, index) {
      if (_.isObject(value) && value.type === 'movement') {
        map[index] = new AnimatedBlock(value.layers, {type: value.type, direction: value.direction});
      } else if (_.isArray(value) && value.length > 0) {
        map[index] = new AnimatedBlock(value);
      } else if (typeof(value) === 'object' && value && value.length === 0) {
        // temporary fix for null layers that were saved with no layers
        map[index] = null;
      }
    }, function () {
      $.publish(eventNameWhenDone);
    });
  } else {
    // hack: movementMap isn't there
    $.publish(eventNameWhenDone);
  }
}

function replaceAnimatedBlocksWithTheirLayers (map) {
  _.each(map, function (value, index, list) {
    if (value && _.isObject(value) && value.layers) {
      if (value.type !== 'movement') {
        list[index] = value.layers;
      } else {
        list[index] = {
          layers: value.layers,
          type: value.type,
          direction: value.direction
        };
      }
    }
  });

  return map;
}










