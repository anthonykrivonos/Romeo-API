// TODO: make this wrapped in a function, run it before the main conversion work

// https://www.npmjs.com/package/node-wav
let wav = require('node-wav');
let fs = require('fs');
let buffer = fs.readFileSync('')

var Converter = function(path) {
  audioContext.decodeAudioData(resp, buffer => {
    let wav = toWav(buffer);
    var chunk = new Uint8Array(wav);
    // console.log(chunk);
    var path_no_extension = path
    /*.slice(0, -4);
    console.log(path_no_extension);*/
    fs.appendFile((path_no_extension + '.wav'), new Buffer(chunk), function(err) {
      console.error(err);
    });
  });
}

module.exports = change_wav_in_place;

var learpath = './audio/ytdownloads/lear_dank.mp3'
Converter(learpath);
