// Connect to mongodb
var mongoose        = require('mongoose');
var database = process.env.DATABASE || process.env.MONGODB_URI || "mongodb://localhost:27017";
mongoose.set('useCreateIndex', true);
mongoose.connect(database, { useNewUrlParser: true , useUnifiedTopology: true  });

console.log(database)
var UserController = require('../app/server/controllers/UserController');

var users = 1000;
var username = 'hacker';

for (var i = 0; i < users; i++){
  console.log(username, i);
  UserController
    .createUser(username + i + '@school.edu', 'foobar', false, function(){
    console.log(i);
    });
}