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

  var countersCollection = db.collection('counters');

  countersCollection.insert({_id: 'storyId', seq: 0}, function (err, docs) {});

  function getNextStoryId (callback) {
    countersCollection.findAndModify({_id: 'storyId'}, [['_id','asc']], {$inc: {seq: 1}}, {new: true}, function(err, object) {
      callback(err, object);
    });
  }

  function getNextStoryVersion (storyId, callback) {
    countersCollection.findAndModify({_id: 'story-version-' + storyId}, [['_id','asc']], {$inc: {seq: 1}}, {new: true}, function(err, object) {
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
    } else {
      query.version = 0;
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
      getNextStoryId(function (err, nextStoryId) {
        if (!err) {
          countersCollection.insert({_id: 'story-version-' + nextStoryId.seq, seq: 0}, {safe: true}, function (err, storyVersions) {
            if (!err) {
              var storyVersion = storyVersions[0].seq;

              storiesCollection.insert({_id: nextStoryId.seq + '-' + storyVersion, version: storyVersion, data: req.body.story}, {safe: true}, function (err, stories) {
                if (!err) {
                  res.send(stories[0]);
                } else {
                  res.send('error');
                }
              });
            } else {
              res.send('error initializing story version');
            }
          });
        } else {
          res.send('error getting next storyId');
        }
      });
    } else {
      var storyId = parseInt(req.body.id, 10);

      getNextStoryVersion(storyId, function (err, storyVersion) {
        if (!err) {
          storiesCollection.insert({_id: storyId + '-' + storyVersion.seq, version: storyVersion.seq, data: story.data}, {safe: true}, function (err, stories) {
            if (!err) {
              res.send(stories[0]);
            } else {
              res.send('error inserting version + 1 story');
            }
          });
        } else {
          res.send('error getting next story version');
        }
      });
    }
  });

  app.get('/getstory', function(req, res) {
    var storyVersion = parseInt(req.query.version, 10) || 0;
    var storyId = parseInt(req.query.id, 10);
    var query = {_id: storyId + '-' + storyVersion, version: storyVersion};

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

