const inputs    = document.querySelectorAll("input[type=range]"),
      selectBtn = document.getElementById("btnInput"),
      resetBtn  = document.getElementById("btnReset"),
      saveBtn   = document.querySelector(".btn-save"),
      canvas    = document.querySelector("canvas"),
      newImg    = document.getElementById('editorImage'),
      nextBtn   = document.getElementById('btnNext'),
      fullScr = document.querySelector('.fullscreen'),
      now       = new Date();
      
let   nowIs     =  '',
      currentImg = `01`;


// get time 
  if (now.getHours() >= 6 && now.getHours() < 12) { nowIs = 'morning';  }
  if (now.getHours() >= 12 && now.getHours() < 18) { nowIs = 'day';  }
  if (now.getHours() >= 18 && now.getHours() < 24) { nowIs = 'evening';  }
  if (now.getHours() >= 0 && now.getHours() < 6) { nowIs = 'night';  }

// get inputs and image 

let selectedFile = document.getElementById("btnInput").files[0],
    newImgSrc    = new Image();
const img = new Image(),
      ctx = canvas.getContext("2d");
      
img.setAttribute('crossOrigin', 'anonymous'); 
img.src = `assets/img/${nowIs}/${currentImg}.jpg`;
newImg.src = `assets/img/${nowIs}/${currentImg}.jpg`;

// upload image to service

function loadUs(e) {
  const file = selectBtn.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    newImg.src = reader.result;
    img.src = reader.result;
  }
  e.target.value = '';
  reader.readAsDataURL(file);
}

selectBtn.addEventListener('change', e => loadUs(e));

// drow image canvas

function drawImage() {
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };  
}

// create new link for download

function saveUs(e) {
  const link = document.createElement('a');
  const dataURL = canvas.toDataURL("image/png");
  link.setAttribute('href', dataURL);
  link.setAttribute('download', 'download.png');
  link.click();
	return false;
}

saveBtn.addEventListener('click',e => saveUs(e));
saveBtn.addEventListener('mouseover', () => {
  ctx.filter = `blur(${blurVal}px) invert(${invertVal}%) sepia(${sepiaVal}%) saturate(${saturateVal}%) hue-rotate(${hueVal}deg)`;
  ctx.drawImage(img, 0, 0);
});

// inputs update value

let blurVal = 0,
    sepiaVal = 0,
    saturateVal = 83,
    hueVal = 0,
    invertVal = 0;


function handleUpdate() {
  const suffix = this.dataset.sizing || '';
  document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
  this.closest('label').querySelector('output').innerText = `${this.value}`;
  if (this.name === 'blur') { blurVal = this.value * 1.6; }
  else if (this.name === 'sepia') { sepiaVal = this.value; }
  else if (this.name === 'saturate') { saturateVal = this.value / 1.2; }
  else if (this.name === 'hue-rotate') { hueVal = this.value * 1; }
  else if (this.name === 'invert') { invertVal = this.value; }
  ctx.filter = `blur(${blurVal}px) invert(${invertVal}%) sepia(${sepiaVal}%) saturate(${saturateVal}%) hue-rotate(${hueVal}deg)`;
  ctx.drawImage(img, 0, 0);
}

inputs.forEach(input => input.addEventListener('mousemove', handleUpdate));
inputs.forEach(input => input.addEventListener('change', handleUpdate));

//reset this shit 

function resetUs(e) {
  
  inputs.forEach(input => {
    const suffix = input.dataset.sizing || '';
    let val = (input.name === 'saturate') ? `100` : `0`;
    console.log(val);
    document.documentElement.style.setProperty(`--${input.name}`, val + suffix);
    input.closest('label').querySelector('output').innerText = `${val}`;
  });
  ctx.filter = `blur(0px) hue-rotate(0deg) invert(0%) sepia(0%) saturate(100%)`;
  blurVal = 0,
  sepiaVal = 0,
  saturateVal = 83,
  hueVal = 0,
  invertVal = 0;
  ctx.drawImage(img, 0, 0);  
  document.getElementById("myForm").reset();
}

resetBtn.addEventListener('click', e => resetUs(e));

// switch image (next btn)

let nextImg = Number(currentImg);

function next(e) {

  nextImg++;
  if (nextImg === 21) { nextImg = 1; }
  if (nextImg <= 9) { nextImg = `0` + nextImg; }
  img.src = `assets/img/${nowIs}/${nextImg}.jpg`;
  newImg.src = `assets/img/${nowIs}/${nextImg}.jpg`;
}

console.log(nowIs);
nextBtn.addEventListener('click',e => next(e));

// fullscreen

function activateFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();        
  }
  else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();    
  }
};

function deactivateFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};

fullScr.addEventListener('click', e =>{
  activateFullscreen(document.querySelector('html'));
});
fullScr.addEventListener('click', e =>{
  deactivateFullscreen(document.querySelector('html'));
});


drawImage();