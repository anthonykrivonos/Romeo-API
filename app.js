const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const http = require('http');

const {MSKEY} = require('./config');

const app = express();
app.use(bodyParser.json());
app.use(morgan('common'));

var basepath = './ML/Microsoft/'
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
  service.sendFile(sample3);
})

/*
const recognizer = new speechService(options);
recognizer.start((error, service) => {
  if (!error) {
    console.log('service started');

    service.on('recognition', (message) => {
      console.log('new recognition:', message);
    });

    service.on('close', () => {
      console.log('Speech API connection closed');
    });

    service.on('error', (error) => {
      console.log(error);
    });

    service.sendFile(samplePath);
  }
});
*/
