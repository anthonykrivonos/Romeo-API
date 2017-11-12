var learURL = 'https://www.youtube.com/watch?v=EUGeQd6J968';
var pathdl = './audio/ytdownloads'
const {FFMPEG, OUTPUT_AUDIO} = require('./config');

var YoutubeMp3Downloader = require("youtube-mp3-downloader");

var Downloader = function() {

    var self = this;

    //Configure YoutubeMp3Downloader with your settings
    self.YD = new YoutubeMp3Downloader({
        "ffmpegPath": FFMPEG,        // Where is the FFmpeg binary located?
        "outputPath": OUTPUT_AUDIO,    // Where should the downloaded and encoded files be stored?
        "youtubeVideoQuality": "highest",       // What video quality should be used?
        "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
        "progressTimeout": 2000                 // How long should be the interval of the progress reports
    });

    self.callbacks = {};

    self.YD.on("finished", function(error, data) {

        if (self.callbacks[data.videoId]) {
            self.callbacks[data.videoId](error, data);
        } else {
            console.log("Error: No callback for videoId!");
        }

    });

    self.YD.on("error", function(error, data) {

        console.error(error + " on videoId " + data.videoId);

        if (self.callbacks[data.videoId]) {
            self.callbacks[data.videoId](error, data);
        } else {
            console.log("Error: No callback for videoId!");
        }

    });

};

Downloader.prototype.getMP3 = function(track, callback){
    var self = this;
    // Register callback
    self.callbacks[track.videoId] = callback;
    // Trigger download
    self.YD.download(track.videoId, track.name);
};

module.exports = Downloader;

// use this below code, with some modifications, in other places to download videos
var dl = new Downloader(); //var Downloader = require("./downloader");

var i = 0;

// change videoId and leave name out (to use default name)
dl.getMP3({videoId: "EUGeQd6J968", name:"weeknd_dank.mp3"}, function (err, res) {
    i++;
    if(err)
        throw err;
    else{
        console.log("Song " + i + " was downloaded: " + res.file);
        downsample(res.file);
    }
});

// lower sample
function downsample(starting_audio_path) {
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
              msanalysis("./audio/processedaudio/anthonytest2.wav", res);
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
