var urlRoot = u.getUrlRoot();

var urlInput = document.querySelector('[name=share]');
var urlQuery = decodeURIComponent(location.search);
var shareUrl = urlRoot + '/' + urlQuery;
urlInput.value = shareUrl;

document.querySelector('#back').addEventListener('click', function  (event) {
  window.history.back();
});

document.querySelector('#save-svg').addEventListener('click', function  (event) {
  var urlQuery = location.search.substr(3); //removes ?d= from beginning
  var pic = app.decodePic(urlQuery);
  var svg = app.renderSvg(pic);
  var blob = new Blob([svg], {type: 'image/svg+xml'});
  saveAs(blob, "trigons.svg");
});

/*document.querySelector('#save-png').addEventListener('click', function  (event) {
  //TODO: make an app.renderPng function that returns a png as a blob or string
  //Then save the png when clicking the button
});
*/
