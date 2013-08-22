var express = require('express');
app = express();

var redis = require('iris-redis');
var redisClient = redis.createClient(6379, "nodejitsudb7729947618.redis.irstack.com");
var redisDbPass = require('./redis-db-info.js');
redisClient.auth(redisDbPass);

var mongoDbPass = require('./mongo-db-info.js');
var mongodbUrl = 'mongodb://david:' + mongoDbPass + '@paulo.mongohq.com:10073/journeyship';
var MongoClient = require('mongodb').MongoClient;



redisClient.on('ready', function () {
  console.log('hello production redis!');

  MongoClient.connect(mongodbUrl, function(err, db) {
    if (!err) {
      console.log('hello production mongo!');

      app.listen(3001);
    }
  });
});
