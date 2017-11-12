const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const http = require('http');
const app = express();
const fs = require('fs');
const util = require('util')
const mime = require('mime');

// const ffmpeg = require('@ffmpeg-installer/ffmpeg');
// console.log(ffmpeg.path, ffmpeg.version);

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const spawn = require('child_process').spawn;
const ffmpeg = spawn(ffmpegPath, args);
ffmpeg.on('exit', onExit);

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));
app.use(morgan('common'));

const {Downloader} = require('./ytdownload')

var firebase = require('firebase');

var globalresponse = {};

// Initialize firebase
var config = {
      apiKey: "AIzaSyD8H89VVKlhY6HE9t7kMYONXj80A1y3UYI",
      authDomain: "romeo-2025b.firebaseapp.com",
      databaseURL: "https://romeo-2025b.firebaseio.com",
      projectId: "romeo-2025b",
      storageBucket: ""
};
firebase.initializeApp(config);
const keyFilename = './romeo-2025b-firebase-adminsdk-ssrw8-d611e232d1.json'
const projectId = config.projectId;
const bucketName = `${projectId}.appspot.com`;

const gcs = require('@google-cloud/storage')({
      projectId,
      keyFilename
});

const bucket = gcs.bucket(bucketName);
function createPublicFileURL(storageName) {
      return `http://storage.googleapis.com/${bucketName}/${encodeURIComponent(storageName)}`;

}

// app.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));

const {MICROSOFT_KEY, BEYONDKEY} = require('./config');
// var ffmpeg = require('ffmpeg');
// var ffmpeg2 = require('fluent-ffmpeg');

var basepath = './ML/Microsoft/';
var sample3_mp3 = basepath + 'looooong.m4a';
var looong16khz = basepath + 'steven2 16kHz 16bit mono.wav';
var ffmpegpath = "./audio/processedaudio/newman.wav";

var audiodest = './audio/processedaudio/'
var processingObj = {
      audio: "", // audio file, hopefully wav
      transcript: "",
      scores: {},
      score: ""
}

const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.post('/rendition', (req, res) => {
      globalresponse = res;
      var writepath = "./audio/processedaudio/anthonytest.wav";

      if (!req.files)
      return res.status(400).send('No files were uploaded');

      console.log("req.files:\n" + util.inspect(req.files, false, null));
      let speechAudio = req.files.audio;

      speechAudio.mv(writepath, function(err) {
            if (err)
            return res.status(500).send(err);
            downsample(writepath, res);
      })

});

app.post('/challenge', (req, res) => {
      globalresponse = res;
      var dl = new Downloader();
      var video_url = req.body.video_url;

      var temp = "";
      var write = false;
      for (var i = 0; i < video_url.length; i++) {
            if (video_url[i]=== '=') {
                  write = true;
                  continue;
            }
            if (video_url[i]==='/' && write) {
                  break;
            }
            if (write) {
                  temp+= video_url[i];
            }
      }
      video_url = temp;
      console.log(video_url);

      dl.getMP3({videoId: video_url, name:"ytdload.mp3"}, function (err, res) {
            if(err)
            throw err;
            else{
                  console.log("Song " + i + " was downloaded: " + res.file);
                  downsample(res.file, 'foryt');
            }
      });
})

// processingObj.audio = req.body.audio;
function downsample(starting_audio_path, res, uploadname) {
      try {
            console.log("start encode time: " + Date.now())

            var process = new ffmpeg(starting_audio_path);
            process
            .then(function(audio) {
                  console.log(audio.metadata)
                  console.log('The audio is ready to be processed');
                  audio
                  .setAudioFrequency(16000)
                  .setAudioChannels(1)
                  .setAudioBitRate(16)
                  .save("./audio/processedaudio/anthonytest2.wav", function (err, file) {
                        if (!err)
                        console.log('Audio file: ' + file);
                        else
                        console.error("err while saving\n" + err);
                        // below will crash the program when the chunk error comes back
                        // performAnalysis("./audio/processedaudio/anthonytest2.wav");
                        setTimeout(function() {
                              msanalysis("./audio/processedaudio/anthonytest2.wav", res, uploadname);
                        }, 200);
                  })
                  console.log("end encode time: " + Date.now());
            }, function(err) {
                  console.log("Error: " + err);
            });
      } catch (e) {
            console.log(e.code);
            console.log(e.msg);
      }
};


// function startFormatAndAnalysis(path1) {
//   // save path1 as a file, pass path to below function
//   encode1("./audio/processedaudio/anthonytest.wav");
// }
// startFormatAndAnalysis("words");

// var performAnalysis = false;

// function encode1(path1) {
//
//   // reason for this section:
//   // https://stackoverflow.com/questions/40233300/how-to-change-mp3-file-to-wav-file-in-node-js
//   ffmpeg2(path1)
//     .toFormat('wav')
//     .on('error', function (err) {
//         console.log('An error occurred: ' + err.message);
//     })
//     .on('progress', function (progress) {
//         // console.log(JSON.stringify(progress));
//         console.log('Processing: ' + progress.targetSize + ' KB converted');
//     })
//     .on('end', function () {
//         console.log('Processing finished !');
//         ffmpegmain(path1 + "step1.wav");
//     })
//     .save(path1 + "step1.wav", function() {
//     })
// }
// function ffmpegmain(inputAudio) {
//   try {
//     console.log("start encode time: " + Date.now())
//
//     var process = new ffmpeg(inputAudio);
//     process
//       .then(function(audio) {
//         console.log(audio.metadata)
//         console.log('The audio is ready to be processed');
//         audio
//           .setAudioFrequency(16000)
//           .setAudioChannels(1)
//           .setAudioBitRate(16)
//           .save(inputAudio+"step2.wav", function (err, file) {
//             if (!err)
//               console.log('Audio file: ' + file);
//             else
//               console.error("err while saving\n" + err);
//           })
//           .then(function() {
//             performAnalysis(inputAudio+"step2.wav");
//           })
//           console.log("end encode time: " + Date.now());
//       }, function(err) {
//         console.log("Error: " + err);
//       });
//   } catch (e) {
//     console.log(e.code);
//     console.log(e.msg);
//   }
// }

function performAnalysis(path_to_audio) {

      console.log("start analysis time: " + Date.now())

      var Analyzer = require('./analyzer-v3')

      var analyzer = new Analyzer(BEYONDKEY);

      analyzer.analyze(fs.createReadStream(path_to_audio),function(err,analysis){
            if (err) {
                  console.error(err);
            }
            console.log(analysis);
            console.log("end analysis time: " + Date.now());
      });
}

// var text = getText(('./ML/Microsoft/' + 'sample3.wav'));
// console.log(text);

// MICROSOFT SPEECH TO TEXT THINGS

const options = {
      language: 'en-US',
      subscriptionKey: MICROSOFT_KEY
}
const speechService = require('ms-bing-speech-service');
const socket = new speechService(options);

var dictation_text = "";

function msanalysis(ffmpegpath, res, uploadname) {
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

                  // var storageRef = firebase.storage().ref();
                  // var uploadTask = storageRef.child(ffmpegpath).put(file);
                  const filePath = ffmpegpath;
                  const uploadTo = `audio/processedaudio.wav`;
                  const fileMime = mime.getType(filePath);

                  bucket.upload(filePath,{
                        destination:uploadTo,
                        public:true,
                        metadata: {contentType: fileMime,cacheControl: "public, max-age=300"}
                  }, function(err, file) {
                        if(err) {
                              console.log(err);
                              return;
                        }
                        console.log(createPublicFileURL(uploadTo));
                  })

                  if (uploadname === undefined) {
                        uploadname = 'romeoaudio';
                  }

                  var publicURL = createPublicFileURL(uploadname);
                  console.log(publicURL);

                  var returnobj = {
                        audio_url: publicURL, // fill in with aws link
                        transcript: dictation_text,
                        score: 'B'
                  }
                  console.log("res is of type: " + typeof(res));
                  // send back to app
                  globalresponse.status(200).json(returnobj);
            });

            // service.sendFile(samplePath);
            // service.sendFile(sample2)
            // service.sendFile(looong16khz);
            service.sendFile(ffmpegpath);
      })
}

return new Promise((resolve, reject) => {
      server = app.listen(8080, () => {
            console.log(`Your app is listening on port 8080`);
            resolve();
      })
      fs.unlink("./audio/processedaudio/anthonytest2.wav", () => {

      })
      fs.unlink("./audio/processedaudio/anthonytest.wav", () => {

      })

});
