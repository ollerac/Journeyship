var express = require('express');
var redis = require('redis');

var db = redis.createClient();

app = express();

app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

app.get('/', function(req, res){
  db.incr("global:nextUrlId", function(error, reply) {
    //db.set('story:story-' + reply, '', function () {
      res.redirect('/' + reply);
    //});
  });
});

app.get('/getstory', function(req, res) {
  db.get('story:story-' + req.query.id, function (error, reply) {
    if (error) {
      res.send('error');
    } else {
      res.send(JSON.parse(reply));
    }
  });
});

app.post('/savestory', function(req, res) {
  db.set('story:story-' + req.body.id, req.body.story, function (error, reply) {
    if (error) {
      res.send('error');
    } else {
      res.send('success');
    }
  });
});

app.get('/:id', function(req, res) {
  //console.log(req.params.id);
  res.sendfile('./static/views/index.html');
});



app.listen(3000);
