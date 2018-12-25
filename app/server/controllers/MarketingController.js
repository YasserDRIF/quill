var hackathonTeam = require("../models/hackathonTeam");
var Mailer = require("../services/email");

var MarketingController = {};

/**
 * Create a new hackathonTeam given the team options.
 */
MarketingController.createTeam = function( data, callback) {

  var c = new hackathonTeam();
  c.event = data.event;
  c.members = data.members;
  c.save(function(err){
    if (err){
      console.log(err);
    }
  });
};


/**
 * Get all hackathon Teams .
 * It's going to be a lot of data, so make sure you want to do this.
 * @param  {Function} callback args(err, user)
 */
MarketingController.getAll = function(callback) {
  hackathonTeam.find({}, callback);
};

MarketingController.sendInvite = function(username, teammate, callback) {

  Mailer.sendTeammateInvite(username,teammate);
};


module.exports = MarketingController;