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
    else
        console.log("Song " + i + " was downloaded: " + res.file);
});
