var express = require('express');

var app = express();
var mongodbUrl;

app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

app.configure('development', function () {
  mongodbUrl = 'mongodb://127.0.0.1:27017/test';
});

app.configure('production', function () {
  var dbPass = require('./db-info.js');
  mongodbUrl = 'mongodb://david:' + dbPass + '@paulo.mongohq.com:10073/journeyship';
});

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(mongodbUrl, function(err, db) {
  if (err) throw err;

  db.collection('counters').insert({_id: 'storyId', seq: 0}, function (err, docs) {});

  function getNextStoryId (callback) {
    db.collection('counters').findAndModify({_id: 'storyId'}, [['_id','asc']], {$inc: {seq: 1}}, {new: true}, function(err, object) {
      callback(err, object);
    });
  }

  var storiesCollection = db.collection('stories');

  app.get('/', function(req, res){
    res.sendfile('./static/views/index.html');
  });

  app.get('/:id/:version?', function(req, res) {
    var query = {_id: parseInt(req.params.id, 10)};
    if (req.params.version) {
      query.version = req.params.version;
    }

    storiesCollection.findOne(query, function (err, story) {
      if (!err && story) {
        res.sendfile('./static/views/index.html');
      } else {
        res.sendfile('./static/views/404.html');
      }
    });
  });

  app.post('/savestory', function(req, res) {
    if (!req.body.id) {
      var storyVersion = 0;

      getNextStoryId(function (err, nextStoryId) {
        storiesCollection.insert({_id: nextStoryId.seq, version: storyVersion, data: req.body.story}, {safe: true}, function (err, stories) {
          if (!err) {
            res.send(stories[0]);
          } else {
            res.send('error');
          }
        });
      });
    } else {
      storiesCollection.findAndModify({_id: parseInt(req.body.id, 10)}, [['_id','asc']], {$inc: {version: 1}, $set: {data: req.body.story}}, {safe: true}, function (err, story) {
        console.log('stories', story);
        if (!err) {
          res.send(story);
        } else {
          res.send('error');
        }
      });
    }
  });

  app.get('/getstory', function(req, res) {
    var storyVersion = parseInt(req.query.version, 10) || 0;
    var query = {_id: parseInt(req.query.id, 10), version: storyVersion};

    storiesCollection.findOne(query, function (err, story) {
      if (!err) {
        res.json(story);
      } else {
        res.send('error');
      }
    });
  });

  app.listen(3000);

});

