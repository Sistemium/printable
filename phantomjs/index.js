'use strict';

var path = require('path');
var childProcess = require('child_process');
var fs = require('fs');
var phantomjs = require('phantomjs-prebuilt');
var binPath = phantomjs.path;
var express = require('express');
var app = express();

var domain = 'http://localhost:3000/#/';

app.get('/report', function (req, res) {
  var childArgs = [
    path.join(__dirname, 'load-ajax.js'),
    `${domain + req.query.path} ${req.query.filename}`
  ];

  childProcess.exec(`${binPath} ${childArgs[0]} ${childArgs[1]}`, function (err, stdout, stderr) {
    if (err) {
      console.log(err);
      res.send('Something went wrong, the url is incorrect');
    }
    if (stderr) {
      console.log(stderr);
      res.send('Something went wrong, the url is incorrect');
    }

    console.log(stdout);

    var filename = path.join(__dirname, `../${req.query.filename}`);
    res.sendFile(filename, {}, function (err) {
      if (err) {
        console.log(err);
        return res.sendStatus('Error occurred...');
      }
      console.log('File sent!');
      fs.unlink(filename, function (err) {
        if (err) console.log('Could not delete file', err);
        else console.log(filename, 'successfully deleted!');
      });
    });
  });

});

app.listen(3123, function () {
  console.log('Listening on port 3123...');
});

