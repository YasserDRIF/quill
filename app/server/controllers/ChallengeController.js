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
  c.answer = cData.answer;
  c.save(function(err){
    if (err){
      console.log(err);
    }
  });
  
};



/**
 * Get all Challenges .
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


ChallengeController.getByIdAnswer = function(id, callback) {
  Challenge.findById(id).select("+answer").exec(callback);
};


/**
 * Update the challenge options objects, given an id and the options.
 */
ChallengeController.updateById = function(id, cData, callback) {

  console.log("We Are in Backend ");
  Challenge.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        title: cData.title,
        description: cData.description,
        dependency: cData.dependency,
        points: cData.points,
        answer: cData.answer
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
  Challenge.findOneAndDelete(
    {
      _id: id
    },
    callback
  );
};



ChallengeController.verifyAnswer = function(challengeID, answer, callback) {
  if (!answer || answer.length === 0) {
    return callback({
      message: "Please enter an answer"
    });
  }

  Challenge.findOneByID(challengeID)
    .select("+answer")
    .exec(function(err, challenge) {
      if (err) {
        return callback(err);
      }
      if (!challenge) {
        return callback({
          message: "We couldn't find the challenge!"
        });
      }
      if (!challenge.checkAnswer(answer)) {
        return callback({
          message: "That's not the right answer."
        });
      }

      
      var c = challenge.toJSON();

      delete c.answer;

      return callback(null, c);
    });
};



module.exports = ChallengeController;