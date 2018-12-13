var Challenge = require("../models/Challenge");

var ChallengeController = {};

/**
 * Create a new challenge given the challenge options.
 */
ChallengeController.createChallenge = function( cData, callback) {

  var c = new Challenge();
  c.title = cData.title;
  c.description = cData.description;
  c.dependency = cData.dependency;
  c.points = cData.points;
  c.save();
  
};



/**
 * Get all Challenhges .
 * It's going to be a lot of data, so make sure you want to do this.
 * @param  {Function} callback args(err, user)
 */
ChallengeController.getAll = function(callback) {
  Challenge.find({}, callback);
  };
  

/**
 * Get a challenge by id.
 * @param  {String}   id       challenge id
 * @param  {Function} callback args(err, user)
 */
ChallengeController.getById = function(id, callback) {
  Challenge.findById(id).exec(callback);
};

/**
 * Update the challenge options objects, given an id and the options.
 */
ChallengeController.updateById = function(id, cData, callback) {

  User.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        title: cData.title,
        description: cData.description,
        dependency: cData.dependency,
        points: cData.points
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
 * Remove Challenge
 */
ChallengeController.removeById = function(id, callback) {
  User.findOneAndDelete(
    {
      _id: id
    },
    callback
  );
};


module.exports = ChallengeController;
