const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const http = require('http');
const app = express();
const fs = require('fs');
app.use(bodyParser.json());
app.use(morgan('common'));

const {BEYONDKEY} = require('./config');

var basepath = './ML/Microsoft/';
var sample3_mp3 = basepath + 'looooong.m4a';
var looong16khz = basepath + 'audition-lowqual.wav';

var audiodest = './audio/processedaudio/'

var ffmpeg = require('ffmpeg');
var ffmpeg2 = require('fluent-ffmpeg');

var performAnalysis = true;

if (!performAnalysis) {

  // reason for this section:
  // https://stackoverflow.com/questions/40233300/how-to-change-mp3-file-to-wav-file-in-node-js
  ffmpeg2(sample3_mp3)
    .toFormat('wav')
    .on('error', function (err) {
        console.log('An error occurred: ' + err.message);
    })
    .on('progress', function (progress) {
        // console.log(JSON.stringify(progress));
        console.log('Processing: ' + progress.targetSize + ' KB converted');
    })
    .on('end', function () {
        console.log('Processing finished !');
        ffmpegmain("./audio/processedaudio/shouldbe_correct.wav");
    })
    .save(sample3_mp3 + '.wav', function() {
      sample3_mp3 += '.wav';
    })
}
function ffmpegmain(inputAudio) {
  try {
    console.log("start encode time: " + Date.now())

    var process = new ffmpeg(inputAudio);
    process
      .then(function(audio) {
        console.log(audio.metadata)
        console.log('The audio is ready to be processed');
        audio
          .setAudioFrequency(8000)
          .setAudioChannels(1)
          .setAudioBitRate(16)
          .save(audiodest + "newman.wav", function (err, file) {
            if (!err)
              console.log('Audio file: ' + file);
            else
              console.error("err while saving\n" + err);
          })
          console.log("end encode time: " + Date.now());
      }, function(err) {
        console.log("Error: " + err);
      });
  } catch (e) {
    console.log(e.code);
    console.log(e.msg);
  }
}

if (performAnalysis) {

  console.log("start analysis time: " + Date.now())

  var Analyzer = require('./analyzer-v3')

  var analyzer = new Analyzer(BEYONDKEY);
  var ffmpegpath = "./audio/processedaudio/newman.wav";

  analyzer.analyze(fs.createReadStream(ffmpegpath),function(err,analysis){
    if (err) {
      console.error(err);
    }
    console.log(analysis);
    console.log("end analysis time: " + Date.now());
   });

}

/*
// TODO: MOVE AUDIO FORMATTING STUFF TO ITS OWN FILE
var audioStack = [];
