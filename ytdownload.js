var mp3 = require('youtube-mp3');

var saveYtMp3 = function(videoURL, path) {
  // expecting in format 'https://www.youtube.com/watch...'
  mp3.download(videoURL, path, function(err) {
    
  })
}
