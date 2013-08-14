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


function makeNewBlock () {
  var block = makeNewElement('canvas');
  block.addClass('block');
  block.attr('width', defaultCellSize);
  block.attr('height', defaultCellSize);
  return block;
}



function replaceLayersWithAnimatedBlocks (map) {
  _.each(map, function (value, index, list) {
    if (_.isArray(value) && value.length > 0) {
      list[index] = new AnimatedBlock(value);
    } else if (typeof(value) === 'object' && value && value.length === 0) {
      // temporary fix for null layers that were saved with no layers
      list[index] = null;
    }
  });

  return map;
}

function replaceAnimatedBlocksWithTheirLayers (map) {
  _.each(map, function (value, index, list) {
    if (value && _.isObject(value) && value.layers) {
      list[index] = value.layers;
    }
  });

  return map;
}










