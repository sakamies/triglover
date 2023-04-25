/*
  Initially, a form to decide the dimensions & maybe colors
  Two finger swipe to submit and go to the drawing screen (no submit button, this is to teach the two finger swipe interaction by doing it)
  Regular browser zoom & pan, put finger down for half a second and start moving to draw. Tap a triangle to draw. If you want to rotate the canvas, rotate your devicen, no fancyass interaction for the canvas, just regular browser scoll & zoom.
  Double swipe to get to the save screen (double swipe backward to go back to the settings screen)
*/

document.addEventListener("DOMContentLoaded", function(event) {

  app.init();

  document.addEventListener('touchstart', app.drawStart, {passive: false});
  document.addEventListener('mousedown', app.drawStart, {passive: false});
  document.addEventListener('touchmove', app.drawMove, {passive: false});
  document.addEventListener('mousemove', app.drawMove, {passive: false});
  document.addEventListener('touchend', app.drawEnd, {passive: false});
  document.addEventListener('mouseup', app.drawEnd, {passive: false});
  document.addEventListener('mouseleave', app.drawEnd, {passive: false});
  document.addEventListener('keydown', app.keyDraw, {passive: false});

  document.querySelector('.toolbar').addEventListener('submit', function (event) {
    //TODO: Fill <input type="hidden" name="d"> on submit, not on every save
  });

  window.addEventListener('popstate', function (event) {
    if (event.state) {
      svg = app.renderSvg(event.state);
      document.querySelector('#tris').innerHTML = svg;
    };
  });

});


window.addEventListener('load', function () {
  u.centerViewport();
});
