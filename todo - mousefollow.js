$(window).mousemove(function(e){
  var left = e.pageX + 'px';
  var top = e.pageY + 'px';
  $($0).css({
    position: 'fixed',
    top: top,
    left: left,
    zIndex: 10000
  });
});