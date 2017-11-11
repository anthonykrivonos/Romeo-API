const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const http = require('http');
const app = express();
const fs = require('fs');
app.use(bodyParser.json());
app.use(morgan('common'));
const {MSKEY, BEYONDKEY} = require('./config');

var basepath = './ML/Microsoft/';
var sample3_mp3 = basepath + 'sample3.mp3';
var sample2_wav16 = basepath + 'steven2 16kHz 16bit mono.wav';

var Analyzer = require('./analyzer-v3')

var analyzer = new Analyzer(BEYONDKEY);

analyzer.analyze(fs.createReadStream(sample2_wav16),function(err,analysis){
  if (err) {
    console.error(err);
  }
  console.log(analysis);

 });

/*
// TODO: MOVE AUDIO FORMATTING STUFF TO ITS OWN FILE
var audioStack = [];

// https://www.npmjs.com/package/node-wav
let wav = require('node-wav');

let buffer = fs.readFileSync('')

audioContext.decodeAudioData(resp, buffer => {
  let wav = toWav(buffer);
  var chunk = new Uint8Array(wav);
  // console.log(chunk);
  fs.appendFile((basepath + 'bb.wav'), new Buffer(chunk), function(err) {
    console.error(err);
  });
});


// TODO: MOVE THIS STUFF TO ITS OWN FILE
basepath = './ML/Microsoft/'
var samplePath = basepath + 'stevensample 16kHz 16bit mono.wav';
var sample2 = basepath + 'steven2 16kHz 16bit mono.wav';
var sample3 = basepath + 'sample3.wav';

const speechService = require('ms-bing-speech-service');

const options = {
  format: 'simple',
  language: 'en-US',
  subscriptionKey: MSKEY
}

const socket = new speechService(options);

socket.start((error, service) =>{
  console.log('service started');

  service.on('recognition', (e) => {
    if (e.RecognitionStatus === 'Success') console.log(e);
  });

  // optional telemetry events to listen to
  service.on('speech.startDetected', () => console.log('speech start detected'));
  service.on('speech.endDetected', () => console.log('speech end detected'));
  service.on('turn.start', () => console.log('speech turn started', service.turn.active));

  service.on('turn.end', () => {
    console.log('speech turn ended');
  });

  // service.sendFile(samplePath);
  // service.sendFile(sample2)
  // service.sendFile(sample3);
});
*/
