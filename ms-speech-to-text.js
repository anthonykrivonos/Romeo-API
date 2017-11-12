const {MSKEY} = require('./config');
basepath = './ML/Microsoft/'
var samplePath = basepath + 'looooong.m4a.wav';
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

  service.sendFile(samplePath);
  // service.sendFile(sample2)
  // service.sendFile(sample3);
});