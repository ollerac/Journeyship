/* JavaScript Sync/Async forEach - v0.1.2 - 1/10/2012
 * http://github.com/cowboy/javascript-sync-async-foreach
 * Copyright (c) 2012 "Cowboy" Ben Alman; Licensed MIT */
(function(a){a.forEach=function(a,b,c){var d=-1,e=a.length>>>0;(function f(g){var h,j=g===!1;do++d;while(!(d in a)&&d!==e);if(j||d===e){c&&c(!j,a);return}g=b.call({async:function(){return h=!0,f}},a[d],d,a),h||f(g)})()}})(typeof exports=="object"&&exports||this);


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


function replaceLayersWithAnimatedBlocks (map, eventNameWhenDone) {
  var deferred = new $.Deferred();

  if (map) {
    var lengthOfMap = map.length;

    forEach(map, function (value, index, list) {
      if (_.isObject(value) && value.type === 'movement') {
        list[index] = new AnimatedBlock(value.layers, {type: value.type, direction: value.direction});
      } else if (_.isArray(value) && value.length > 0) {
        list[index] = new AnimatedBlock(value);
      } else if (typeof(value) === 'object' && value && value.length === 0) {
        // temporary fix for null layers that were saved with no layers
        list[index] = null;
      }

      if (index + 1 === lengthOfMap) {
        deferred.resolve();
      }

      var done = this.async();
      setTimeout(done, 1);
    });
  } else {
    // hack: movementMap isn't there
    deferred.resolve();
  }

  return deferred;
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










