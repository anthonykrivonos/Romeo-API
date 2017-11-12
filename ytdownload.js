var learURL = 'https://www.youtube.com/watch?v=EUGeQd6J968';
var pathdl = './audio/ytdownloads'
const {FFMPEG} = require('./config');

// https://www.npmjs.com/package/youtube-mp3-downloader
// TODO: make this into a nicely accessible function via guide above
var YoutubeMp3Downloader = require("youtube-mp3-downloader");

//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": FFMPEG,        // Where is the FFmpeg binary located?
    "outputPath": pathdl,    // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest",       // What video quality should be used?
    "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000                 // How long should be the interval of the progress reports
});

//Download video and save as MP3 file
YD.download("OaQwcXo7tx4", "weeknd solo crew love.mp3");

YD.on("finished", function(err, data) {
    console.log(JSON.stringify(data));
});

YD.on("error", function(error) {
    console.log(error);
});

YD.on("progress", function(progress) {
    console.log(JSON.stringify(progress));
});
