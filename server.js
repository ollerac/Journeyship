var express = require('express');
var redis = require('redis');

var db = redis.createClient();

app = express();

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
  db.incr("global:nextUrlId", function(error, reply) {
    db.set('story' + reply, '', function () {
      res.redirect('/' + reply);
    });
  });
});

app.get('/:id', function(req, res) {
  console.log(req.params.id);

  res.sendfile('./static/views/index.html');
});

app.listen(3000);
