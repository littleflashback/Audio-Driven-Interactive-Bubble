let cvs_bg = 0; //0 for dark, 1 for light, 2 for camera
let transparency = 0.25;
let iridescence = 0.5;
let video_ref = true;

const modeButtons = document.querySelectorAll('#modeSelection .btn');
console.log(modeButtons);
modeButtons.forEach(button => {
    button.addEventListener('click', function() {
        modeButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        setMode(this.getAttribute('data-mode'));
    });
});

const backgroundButtons = document.querySelectorAll('#backgroundSelection .btn');
backgroundButtons.forEach(button => {
    button.addEventListener('click', function() {
        backgroundButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        setBackground(this.getAttribute('data-bg'));
    });
});

const transparencySlider = document.getElementById('transparencySlider');
transparencySlider.addEventListener('input', function() {
    document.getElementById('transparencyValue').textContent = this.value;
    transparency = this.value;
});

const iridescenceSlider = document.getElementById('iridescenceSlider');
iridescenceSlider.addEventListener('input', function() {
    document.getElementById('iridescenceValue').textContent = this.value;
    iridescence = this.value;
    console.log(iridescence);
});

const video_ref_switch = document.getElementById('videoReflectionSwitch');
video_ref_switch.addEventListener('change', function(event) {
    video_ref = event.target.checked;
});

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("transparencyValue").textContent = document.getElementById("transparencySlider").value;
  document.getElementById("iridescenceValue").textContent = document.getElementById("iridescenceSlider").value;
});


function setMode(mode) {
    switch (mode) {
        case 'metal':
          document.querySelector('#backgroundSelection .btn[data-bg="d"]').click();
          transparencySlider.value = 0;
          document.getElementById('transparencyValue').textContent = 0;
          transparency = 0;
          iridescenceSlider.value = 0.1;
          document.getElementById('iridescenceValue').textContent = 0.1;
          iridescence = 0.1;
          video_ref_switch.checked = true;
          video_ref = true;
          break;
        case 'disco':
          document.querySelector('#backgroundSelection .btn[data-bg="d"]').click();
          transparencySlider.value = 0.25;
          document.getElementById('transparencyValue').textContent = 0.25;
          transparency = 0.25;
          iridescenceSlider.value = 0.5;
          document.getElementById('iridescenceValue').textContent = 0.5;
          iridescence = 0.5;
          video_ref_switch.checked = true;
          video_ref = true;
          break;
        case 'water':
          document.querySelector('#backgroundSelection .btn[data-bg="l"]').click();
          transparencySlider.value = 1;
          document.getElementById('transparencyValue').textContent = 1.0;
          transparency = 1;
          iridescenceSlider.value = 0.03;
          document.getElementById('iridescenceValue').textContent = 0.03;
          iridescence = 0.03;
          video_ref_switch.checked = true;
          video_ref = true;
          break;
        default:
          console.log('No mode selected.');
      }
    console.log('Mode selected:', mode);
}

function setBackground(bg) {
    switch (bg) {
        case 'd':
          cvs_bg = 0;
          break;
        case 'l':
          cvs_bg = 1;
          break;
        case 'v':
          cvs_bg = 2;
          break;
        default:
          cvs_bg = 0;
      }
    console.log('Background selected:', cvs_bg);
}

