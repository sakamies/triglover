var app = {};

app.pic = [];
app.drawBit = 0;
app.colors = ['#1a1a1b', '#ffa100']; //Color indexes shoudl correspond to drawbits
app.drawOn = false;


app.savePic = function (pic) {
  //NOTE: Uint8ClampedArray
  var blob = new Blob([pic.buffer], {type: 'application/octet-stream'});
  u.blobToBase64(blob, function (picAsText) {

    picAsText = LZString.compressToEncodedURIComponent(picAsText);
    history.pushState(pic, null, '?d=' + picAsText);

    //TODO: Move event handler, so the value is only set when clicking share. No need to update all the time
    document.querySelector('[name=d]').value = picAsText;

  });
}

app.renderSvg = function (pic) {
  // Set up svg document
  //TODO: proper config, maybe a config.js or something
  var colors = app.colors;
  var triW = 15;
  var triH = 25; //0.86602540 * width would be about unilateral, but roughly rounded is fine
  var cols = pic[0];
  var rows = pic[1];
  var docW = cols * triW + triW;
  var docH = rows * triH;
  var poly = ['-15,0 15,0 0,25', '0,0 15,25 -15,25']; //up & down polygons
  var polyId = 0; //up or down index
  var x = 0;
  var y = 0;
  var row, col, index;
  var pad = 2; //[0]=width, [1]=height (indexes of stuff before image data)
  var oddRow, evenRow, oddCol, evenCol;

  var buf = '';
  buf += '<svg ';
  buf += 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
  buf += 'width="'+docW+'" height="'+docH+'" version="1.1" ';
  buf += 'viewBox="0 0 '+docW+' '+docH+'" preserveAspectRatio="xMidYMid meet" ';
  buf += 'shape-rendering="crispEdges" color-rendering="optimizeSpeed" ';
  buf += 'image-rendering="optimizeSpeed" buffered-rendering="dynamic" ';
  buf += '>\n';
  for (row = 0; row < rows; row++) {
    for (col = 0; col < cols; col++) {
      oddRow = u.isOdd(row);
      evenRow = u.isEven(row);
      oddCol = u.isOdd(col);
      evenCol = u.isEven(col);
      index = row * cols + col + pad;

      y = row * triH;
      x = col * triW  + triW;

      if (oddCol && oddRow || evenCol && evenRow) {
        polyId = 1;
      } else {
        polyId = 0;
      }
      //buf += '  <use fill="'+app.colors[pic[index]]+'" xlink:href="#'+triDir+'" x="'+x+'" y="'+y+'" data-i="'+index+'"></use>\n';
      buf += '<polygon id="off" fill="'+app.colors[pic[index]]+'" transform="translate('+x+','+y+')" points="'+poly[polyId]+'" data-i="'+index+'" tabindex="0"></polygon>\n';
    }
  }
  buf += '</svg>';
  return buf;
}

app.renderPng = function (pic) {
  //TODO: yup, same as render svg but to canvas
}

app.decodePic = function (data) {
  data = LZString.decompressFromEncodedURIComponent(data);
  data = u.base64ToArray(data);
  data = new Uint8ClampedArray(data);
  return data;
}

app.init = function () {
  var svg;
  var newPic;
  var defaultPic = [ //For testing (Small fox)
    7, //width
    5, //height
    0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0
  ];
  var defaultPic = [ //For testing (Small fox)
    20, //width
    12, //height
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
  ];

  var urlQuery = location.search.substr(3); //removes ?d= from beginning
  if (urlQuery) {
    newPic = app.decodePic(urlQuery);
  } else {
    newPic = new Uint8ClampedArray(defaultPic);
  }

  svg = app.renderSvg(newPic);
  document.querySelector('#tris').innerHTML = svg;

  //TODO: should not need to save pic on load, no need to push a history state when reading the image
  app.savePic(newPic);
  app.pic = newPic;

}

app.drawPixel = function (target, bit) {
  target.setAttribute('fill', app.colors[bit]);
  target.setAttribute('id', bit ? "on" : "off");
  index = target.getAttribute('data-i');
  app.drawBit = bit;
  app.pic[index] = bit;
}

app.getBit = function (target) {
  if (target.getAttribute('fill') == app.colors[0]) {
    return 1;
  } else {
    return 0;
  }
}

app.keyDraw = function (event) {
  //TODO: keyboard navigation on the canvas
  //TODO: Any sort of screen reader support to go with key support?
  const key = event.key;
  const target = event.target;
  console.log(key)
  if (event.key == 'Enter' || event.key == ' ') {
    event.preventDefault()
    const bit = app.getBit(target);
    app.drawPixel(target, bit);
  }
}

app.drawStart = function (event) {
  var touches = event.touches || '';
  var numOfTouches = touches.length;
  var index, bit;
  var target = event.target;

  if (numOfTouches < 2 && target.tagName == 'polygon') {
    event.preventDefault();
    event.stopPropagation();
    app.drawOn = true;

    //TODO: ugh, need to manage svg<->pic relation better
    bit = app.getBit(target)
    app.drawPixel(target, bit);
  }
};

app.drawMove = function (event) {
  var touches = event.touches || '';
  var numOfTouches = touches.length;
  var x, y, target;
  var index, bit;

  if (numOfTouches < 2 && app.drawOn) {
    event.preventDefault();
    event.stopPropagation();
    if (touches) {
      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    } else {
      x = event.clientX;
      y = event.clientY;
    }
    target = document.elementFromPoint(x, y);

    if (target.tagName == 'polygon') {
      bit = app.drawBit;
      app.drawPixel(target, bit);
    }
  }
};

app.drawEnd = function () {
  if (app.drawOn) {
    app.savePic(app.pic);
    app.drawOn = false;
  };
}
