var mouseIsDown = false;

(function () {
  var body = $('body');

  body.on('mousedown', function () {
    mouseIsDown = true;
  });

  body.on('mouseup', function () {
    mouseIsDown = false;
  });

})();
