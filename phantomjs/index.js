'use strict';

var path = require('path');
var childProcess = require('child_process');
var fs = require('fs');
var phantomjs = require('phantomjs-prebuilt');
var binPath = phantomjs.path;
var express = require('express');
var app = express();
var uuid = require('node-uuid');

var domain = 'http://localhost:3000/#/';

app.get('/report', function (req, res) {
  var filename = uuid.v4() + '.pdf';
  var pathToFile = 'filesForPrinting/' + filename;
  var childArgs = [
    path.join(__dirname, 'load-ajax.js'),
    `${domain + req.query.path} ${pathToFile}`
  ];

  childProcess.exec(`${binPath} ${childArgs[0]} ${childArgs[1]}`, function (err, stdout, stderr) {
    if (err) {
      console.log(err);
      console.log('err in childProcess');
      res.send('Something went wrong, the url is incorrect');
    }
    if (stderr) {
      console.log(stderr);
      console.log('stderr in childProcess');
      res.send('Something went wrong, the url is incorrect');
    }

    console.log(stdout);

    var file = path.join(__dirname, `../${pathToFile}`);
    res.sendFile(file, {}, function (err) {
      if (err) {
        console.log(err);
        console.log('err in res.sendFile');
        deleteFile(file);
        return res.sendStatus('Error occurred...');
      }
      console.log('File sent!');
      deleteFile(file);
    });
  });

});

app.listen(3123, function () {
  console.log('Listening on port 3123...');
});

function deleteFile (file) {
  fs.unlink(file, function (err) {
    if (err) console.log('Could not delete file', err);
    else console.log(file, 'successfully deleted!');
  });
}
