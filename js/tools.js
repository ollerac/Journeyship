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














