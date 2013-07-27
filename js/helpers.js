var mouseIsDown = false;
document.body.addEventListener('mousedown', function () {
  mouseIsDown = true;
});
document.body.addEventListener('mouseup', function () {
  mouseIsDown = false;
});

function preventDefaultClickEventsOnTheseIds (listOfIds) {
  _.each(listOfIds, function (id) {
    $(id).on('click', function (event) {
      event.preventDefault();
    });
  });
}

preventDefaultClickEventsOnTheseIds(['#save-block', '#new-layer', '#remove-layer']);
