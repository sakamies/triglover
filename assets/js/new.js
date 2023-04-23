//Where are we running?
var urlRoot = u.getUrlRoot();

document.querySelector('form').addEventListener('submit', function (event) {
  var array = [];
  var blob;
  var width, height;

  event.preventDefault();

  //TODO: Make a newPic function to the app, that can be used to generate a valid compressed url with width, height & data.

  width = parseInt(document.querySelector('#width').value);
  height = parseInt(document.querySelector('#height').value);
  array = new Uint8ClampedArray(width * height + 2);
  array[0] = width;
  array[1] = height;

  blob = new Blob([array.buffer], {type: 'application/octet-stream'});
  u.blobToBase64(blob, function (urlQuery) {

    var urlQuery = LZString.compressToEncodedURIComponent(urlQuery);
    window.location.href = urlRoot + '/?d=' + urlQuery;
  });

});


function selectInput(event) {
  event.preventDefault();
  var target = event.target;
  u.selectText(target);
}

document.querySelectorAll('input')[0].addEventListener('focus', selectInput);
document.querySelectorAll('input')[1].addEventListener('focus', selectInput);
document.querySelector('form').addEventListener('mouseup', selectInput);
