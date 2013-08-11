var express = require('express');
var redis = require('redis');

var db = redis.createClient();

app = express();

app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

app.get('/', function(req, res){
  db.incr("global:nextUrlId", function(error, reply) {
    db.set('story:story-' + reply, '', function () {
      res.redirect('/' + reply);
    });
  });
});

app.get('/getstory', function(req, res) {
  var storyName = 'story:story-' + req.query.id + (req.query.secondId || '');

  db.get(storyName, function (error, storyData) {
    if (error) {
      res.send('error');
    } else {
      db.get('story:story-version-' + req.query.id, function (error, version) {
        if (error) {
          res.send('error');
        } else {
          if (storyData) {
            storyData = JSON.parse(storyData);
            storyData.version = version;
            res.send(storyData);
          } else {
            res.send(storyData);
          }
        }
      });
    }
  });
});

app.post('/savestory', function(req, res) {
  db.incr('story:story-version-' + req.body.id, function (error, version) {
    if (error) {
      res.send('error');
    } else {
      var storyName = 'story:story-' + req.body.id + version;

      db.set(storyName, req.body.story, function (error, reply) {
        if (error) {
          res.send('error');
        } else {
          res.send({version: version});
        }
      });
    }
  });



});

app.get('/:id/:secondId?', function(req, res) {
  var storyName = 'story:story-' + req.params.id + (req.params.secondId || '');

  db.get(storyName, function (error, reply) {
    if (error || (!reply && reply !== '')) {
      res.sendfile('./static/views/404.html');
    } else {
      res.sendfile('./static/views/index.html');
    }
  });
  
});



app.listen(3000);
