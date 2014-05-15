var ctx; //audio context
var samples = 128;
var setup = false; //indicate if audio is set up yet
var canvasEl;
var fft;

// init the sound system
function init() {
  console.log("in init");
  try {
    ctx = new webkitAudioContext(); //is there a better API for this?
    fft = ctx.createAnalyser();
    fft.fftSize = samples;
    fft.connect(ctx.destination);
    setupCanvas();
    loadFile();
  } catch(e) {
    alert('you need webaudio support' + e);
  }
}
window.addEventListener('load',init,false);

//load the mp3 file
function loadFile() {
  var req = new XMLHttpRequest();
  req.open("GET","./wizard.mp3",true);
  //we can't use jquery because we need the arraybuffer type
  req.responseType = "arraybuffer";
  req.onload = function() {
    //decode the loaded data
    ctx.decodeAudioData(req.response, function(buf) {
      var src = ctx.createBufferSource(); 
      src.buffer = buf;

      //connect them up into a chain
      src.connect(fft);
      setup = true;
      play(src);
    });
  };
  req.send();
  console.log("loading the song");
}

//play the loaded file
function play(src) {
  src.start(0);
}

var gfx;
function setupCanvas() {
  canvasEl = document.getElementById('canvas');
  gfx = canvas.getContext('2d');
  webkitRequestAnimationFrame(update);
}

function update() {
  webkitRequestAnimationFrame(update);
  if(!setup) return;
  gfx.clearRect(0,0,800,600);
  gfx.fillStyle = '#333';
  gfx.fillRect(0,0,800,600);
  
  var data = new Uint8Array(samples);
  fft.getByteFrequencyData(data);
  gfx.fillStyle = '#08FF6B';
  for(var i=0; i<data.length; i++) {
    gfx.fillRect(i*6,canvasEl.height + 50,5,85-data[i]);
  }
}
