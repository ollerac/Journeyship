var express = require('express');
var redis = require('redis');

var db = redis.createClient();

app = express();

app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

app.get('/', function(req, res){
  res.sendfile('./static/views/index.html');
});

app.post('/savestory', function(req, res) {
  if (!req.body.id) {
    db.incr("global:nextStoryId", function(error, storyId) {
      var storyName = 'story:story-' + storyId;

      db.set(storyName, req.body.story, function (error, reply) {
        if (!error) {
          res.send({
            version: 0,
            id: storyId
          });
        } else {
          res.send('error');
        }
      });
    });
  } else {
    db.incr('story:story-version-' + req.body.id, function (error, version) {
      if (!error) {
        var storyName = 'story:story-' + req.body.id + '-' + version;

        db.set(storyName, req.body.story, function (error, reply) {
          if (!error) {
            res.send({
              version: version,
              id: req.body.id
            });
          } else {
            res.send('error');
          }
        });
      } else {
        res.send('error');
      }
    });
  }
});

app.get('/getstory', function(req, res) {
  var storyName = 'story:story-' + req.query.id + (req.query.version ? '-' + req.query.version : '');

  db.get(storyName, function (error, storyData) {
    if (!error) {
      db.get('story:story-version-' + req.query.id, function (error, version) {
        if (!error) {
          //if (storyData) {
            storyData = JSON.parse(storyData);
            storyData.version = version;
            res.send(storyData);
          //} else {
          //  res.send(storyData);
          //}
        } else {
          res.send('error');
        }
      });
    } else {
      res.send('error');
    }
  });
});



app.get('/:id/:secondId?', function(req, res) {
  var storyName = 'story:story-' + req.params.id + (req.params.version ? '-' + req.params.version : '');

  db.get(storyName, function (error, reply) {
    if (!error && (reply || reply === '')) {
      res.sendfile('./static/views/index.html');
    } else {
      res.sendfile('./static/views/404.html');
    }
  });
  
});



app.listen(3000);
