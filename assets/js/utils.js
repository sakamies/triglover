var u = {}; //Utils
u.isEven = function (num) {
  if (num % 2 === 0) {
    return true;
  }
  else {
    return false;
  }
}
u.isOdd = function (num) {
  if (num % 2 !== 0) {
    return true;
  }
  else {
    return false;
  }
}

u.centerViewport = function () {
  var viewW = window.innerWidth;
  var viewH = window.innerHeight;
  var docW = document.querySelector('#tris svg').offsetWidth;
  var docH = document.querySelector('#tris svg').offsetHeight;
  var x = 0;
  var y = 0;
  if (docW > viewW) {
    x = (docW - viewW) / 2;
  }
  if (docH > viewH) {
    y = (docH - viewH) / 4;
  }
  setTimeout(function () {
    window.scrollTo(x, y);
  }, 0);

}
u.selectText = function (event) {
  console.log(event);
  var target;
  //Grab event or element
  if (event.target != undefined) {
    event.preventDefault();
    event.target.setSelectionRange(0, target.value.length);
  } else {
    target = event;
    target.setSelectionRange(0, target.value.length);
  }
}


//http://jsperf.com/blob-base64-conversion
u.blobToBase64 = function(blob, callback) {
  //TODO: make this without a callback with just a return value, easier to use that way
  var reader = new FileReader();
  reader.onload = function() {
    var buffer = reader.result;
    var view = new Uint8Array(buffer);
    var binary = String.fromCharCode.apply(window, view);
    var base64 = btoa(binary);
    callback(base64);
  };
  reader.readAsArrayBuffer(blob);
};
u.base64ToArray = function(base64) {
  var binary = atob(base64);
  var length = binary.length;
  var buffer = new ArrayBuffer(length);
  var view = new Uint8ClampedArray(buffer);
  for (var i = 0; i < length; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return view;
};

u.getUrlRoot = function () {
  //Rudimentary, but simple
  if (location.hostname == 'localhost') {
    return location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
  } else {
    return 'https://triglover.space';
  }
}
