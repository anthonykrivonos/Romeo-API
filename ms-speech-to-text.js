const speechService = require('ms-bing-speech-service');
const {MICROSOFT_KEY} = require('./config');

basepath = './ML/Microsoft/'
var samplePath = basepath + 'looooong.m4a.wav';
var sample2 = basepath + 'steven2 16kHz 16bit mono.wav';
var sample3 = basepath + 'sample3.wav';


const options = {
  format: 'simple',
  language: 'en-US',
  subscriptionKey: MICROSOFT_KEY
}

const socket = new speechService(options);

var getText = function (samples3) {
  var dictation_text = "";
  socket.start((error, service) =>{
    console.log('service started');

    service.on('recognition', (e) => {
      if (e.RecognitionStatus === 'Success') {
        dictation_text+=e.DisplayText;
        console.log(e);
      }
    });
    service.on('error', (error) => {
      console.log(error);
    });
    service.on('speech.startDetected', () => {
      console.log('speech startDetected has fired.');
    });
    service.on('speech.endDetected', () => {
      console.log('speech endDetected has fired.');
    });

    // optional telemetry events to listen to
    service.on('speech.startDetected', () => console.log('speech start detected'));
    service.on('speech.endDetected', () => console.log('speech end detected'));
    service.on('turn.start', () => console.log('speech turn started', service.turn.active));

    service.on('turn.end', () => {
      console.log('speech turn ended');
      resolve(dictation_text);
    });

    // service.sendFile(samplePath);
    // service.sendFile(sample2)
    service.sendFile(sample3);
  })
}


function msanalysis(ffmpegpath) {
  socket.start((error, service) =>{
    console.log('service started');

    service.on('recognition', (e) => {
      if (e.RecognitionStatus === 'Success') {
        console.log(e);
        dictation_text+=e.DisplayText;
      }
    });
    service.on('error', (error) => {
      console.log(error);
    });
    service.on('speech.startDetected', () => {
      console.log('speech startDetected has fired.');
    });
    service.on('speech.endDetected', () => {
      console.log('speech endDetected has fired.');
    });

    // optional telemetry events to listen to
    service.on('speech.startDetected', () => console.log('speech start detected'));
    service.on('speech.endDetected', () => console.log('speech end detected'));
    service.on('turn.start', () => console.log('speech turn started', service.turn.active));

    service.on('turn.end', () => {
      console.log('speech turn ended. text is:\n'+dictation_text);
      // do AWS upload of data
      var returnobj = {
        audio_url: "testdata", // fill in with aws link
        transcript: dictation_text,
        score: 'B'
      }
      // send back to him
    });

    // service.sendFile(samplePath);
    // service.sendFile(sample2)
    // service.sendFile(looong16khz);
    service.sendFile(ffmpegpath);
  })
}


module.EXPORTS = getText;
