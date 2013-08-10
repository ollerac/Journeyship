var mouseIsDown = false;
document.body.addEventListener('mousedown', function () {
  mouseIsDown = true;
});
document.body.addEventListener('mouseup', function () {
  mouseIsDown = false;
});
