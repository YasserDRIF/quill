var Team = require("../models/Team");

var TeamController = {};

/**
 * Create a new challenge given the challenge options.
 */
TeamController.createTeam = function( teamData, callback) {

  var t = new Team();
  t.description = teamData.description;
  t.members = teamData.members;
  t.skills = teamData.skills;
  t.isColosed = teamData.isColosed;
  t.save(function(err){
    if (err){
      console.log(err);
    }
  });
};



/**
 * Get all Teams .
 * It's going to be a lot of data, so make sure you want to do this.
 * @param  {Function} callback args(err, user)
 */
TeamController.getAll = function(callback) {
  Team.find({}, callback);
};

  
/**
 * Get a team by id.
 * @param  {String}   id       challenge id
 * @param  {Function} callback args(err, user)
 */
TeamController.getById = function(id, callback) {
  Team.findById(id).exec(callback);
};



/**
 * Update the challenge options objects, given an id and the options.
 */
TeamController.updateById = function(id, teamData, callback) {

  Team.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        title: teamData.title,
        description: teamData.description,
        dependency: teamData.dependency,
        points: teamData.points,
        answer: teamData.answer
      }
    },
    {
      new: true
    },
    callback
  );

};


/**
 * [ADMIN ONLY]
 *
 * Remove Team
 */
TeamController.removeById = function(id, callback) {
  Team.findOneAndDelete(
    {
      _id: id
    },
    callback
  );
};



module.exports = TeamController;