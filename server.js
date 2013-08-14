var express = require('express');

app = express();

var redis, client;

app.configure('development', function () {
  redis = require('redis');
  client = redis.createClient();
  client.auth('');
});

app.configure('production', function () {
  redis = require('iris-redis');
  client = redis.createClient(6379, "nodejitsudb7729947618.redis.irstack.com");
  var dbPass = require('./db-info.js');
  client.auth(dbPass);
});

client.on("ready", function() {

  app.use(express.static(__dirname + '/static'));
  app.use(express.bodyParser());

  app.get('/', function(req, res){
    res.sendfile('./static/views/index.html');
  });

  app.post('/savestory', function(req, res) {
    if (!req.body.id) {
      var storyVersion = 0;

      client.incr("global:nextStoryId", function(error, storyId) {
        // seems dangerous
        client.set('story:story-version-' + storyId, storyVersion, function (error, reply) {
          if (!error) {
            var storyName = 'story:story-' + storyId + '-' + storyVersion;

            client.set(storyName, req.body.story, function (error, reply) {
              if (!error) {
                res.send({
                  version: storyVersion,
                  id: storyId
                });
              } else {
                res.send('error');
              }
            });            
          } else {
            res.send('error');
          }

        });
      });
    } else {
      client.incr('story:story-version-' + req.body.id, function (error, version) {
        if (!error) {
          var storyName = 'story:story-' + req.body.id + '-' + version;

          client.set(storyName, req.body.story, function (error, reply) {
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
    var storyName = 'story:story-' + req.query.id + '-' + (req.query.version || 0);

    client.get(storyName, function (error, storyData) {
      if (!error) {
        client.get('story:story-version-' + req.query.id, function (error, version) {
          if (!error) {
            storyData = JSON.parse(storyData);
            storyData.version = version;
            res.json(storyData);
          } else {
            res.send('error');
          }
        });
      } else {
        res.send('error');
      }
    });
  });



  app.get('/:id/:version?', function(req, res) {
    var storyName = 'story:story-' + req.params.id + '-' + (req.params.version | 0);

    client.get(storyName, function (error, reply) {
      if (!error && (reply || reply === '')) {
        res.sendfile('./static/views/index.html');
      } else {
        res.sendfile('./static/views/404.html');
      }
    });
    
  });

  app.listen(3000);
});

