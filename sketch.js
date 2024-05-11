let video, audioCtx, micSource, fft, amp;
let spectrogram = [];
let binCount = 256;
let order = 4;
let tPrevPeak = 0.0;

let bubbleShader;

function preload() {
    bubbleShader = loadShader('./assets/shaders/bubble.vert', './assets/shaders/bubble.frag');   
}

function setup() {
    let containerWidth = document.getElementById('canvas-container').clientWidth;
    canvas = createCanvas(containerWidth, windowHeight, WEBGL);
    canvas.parent('canvas-container');
    colorMode(RGB, 255);

    video = createCapture(VIDEO);
    video.size(800, 600);
    video.hide();
    noStroke();

    audioCtx = getAudioContext();
    navigator.mediaDevices.getUserMedia({audio: true})
        .then(stream => {
            micSource = audioCtx.createMediaStreamSource(stream);
            fft = new p5.FFT(0.8, binCount);
            fft.setInput(micSource);
            amp = new p5.Amplitude();
		    amp.setInput(micSource);
            onSet = new p5.PeakDetect();
            onSet.onPeak(setOrder);
        }).catch(err => {
            console.error('Failed to get microphone input:', err);
        });

    let loadingMessage = document.getElementById('loading-message');
    loadingMessage.parentNode.removeChild(loadingMessage);
}


function draw() {
    background(0);
    frameRate(80);

    shader(bubbleShader);

    audioProcess();
    
    bubbleShader.setUniform('u_resolution', [width, height]);
    bubbleShader.setUniform('u_t_from_last_peak', millis() / 1000.0 - tPrevPeak);
    bubbleShader.setUniform('u_transparency_coef', transparency);
    bubbleShader.setUniform('u_iridescence_coef', iridescence);
    bubbleShader.setUniform('BG_Mode', cvs_bg);
    bubbleShader.setUniform('REF_Video', video_ref);
    bubbleShader.setUniform('u_videoTexture', video);
    
    rect(-width / 2, -height / 2, width , height);

}

function drawSpectrogram(){
    let spectrum = fft.analyze();
    spectrogram.push(spectrum);

    let timeSliceWidth = 2;
    spectrogramTex = createImage(spectrogram.length, binCount);
    spectrogramTex.loadPixels();
    for (let t = 0; t < spectrogram.length; t++) {
        for (let y = 0; y < binCount; y++) {
            let amplitude = spectrogram[t][y]; //amplitude 0-255
            let i = (t + (binCount - y - 1) * spectrogram.length) * 4;
            spectrogramTex.pixels[i] = amplitude;
            spectrogramTex.pixels[i + 1] = amplitude;
            spectrogramTex.pixels[i + 2] = amplitude;
            spectrogramTex.pixels[i + 3] = 255 - amplitude;
        }
    }
    spectrogramTex.updatePixels();

    if (spectrogram.length > width / timeSliceWidth) {
        spectrogram.shift();
    }
    return spectrogramTex;
}

function audioProcess(){
    // console.log(fft);
    // console.log(amp);
    
    if (fft){
        bubbleShader.setUniform('u_audioTexture', drawSpectrogram());
        onSet.update(fft);
        if (onSet.isDetected) {
            bubbleShader.setUniform('u_amplitude', map(amp.getLevel(), 0.005, 0.01, 2, 4));
            bubbleShader.setUniform('u_peak_interval', millis() / 1000.0 - tPrevPeak);
            console.log("tPrevPeak", tPrevPeak);
            console.log('u_t_from_last_peak', millis() / 1000.0 - tPrevPeak);
            tPrevPeak = millis() / 1000.0;
        } else {
            bubbleShader.setUniform('u_amplitude', map(amp.getLevel(), 0.005, 0.01, 1, 2));
        }
        bubbleShader.setUniform('u_audioBrightness', fft.getCentroid()/10000);
        console.log(fft.getCentroid());
        console.log(amp.getLevel());
        bubbleShader.setUniform('Order', order);
        console.log(order);
    }
}

function setOrder(peakAmp){
    console.log("peakAmp", peakAmp);
    if (peakAmp >= 0.6){
        order = 6;
    } else if (peakAmp >= 0.5){
        order = 5;
    } else if (peakAmp >= 0.4){
        order = 4;
    } else if (peakAmp >= 0.3){
        order = 3;
    } else {
        order = 2;
    }
}

function mousePressed() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function windowResized() {
    let containerWidth = document.getElementById('canvas-container').clientWidth;
    resizeCanvas(containerWidth, windowHeight);
}