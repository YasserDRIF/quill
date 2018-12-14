var SolvedCTF = require("../models/SolvedCTF");

var SolvedCTFController = {};

/**
 * Create a new SolvedCTF given the challenge and User ids.
 */
SolvedCTFController.solve = function( challenge, user, callback) {

  var s = new SolvedCTF();
  s.challenge = challenge._id;
  s.user = user.data._id;
  s.timeSolved =  Date.now();
  s.points = challenge.points;
  s.save(function(err){
    if (err){
      console.log(err);
    }
  });

};

 
/**
 * Get all Challenhges .
 * It's going to be a lot of data, so make sure you want to do this.
 * @param  {Function} callback args(err, user)
 */
SolvedCTFController.getAll = function(callback) {
  SolvedCTF.find({}, callback);
};
  


SolvedCTFController.isSolved = function(challengeID, userID, callback) {

    SolvedCTF.findOneByOptions(challengeID,userID)
    .exec(function(err, solution) {
      if (err) {
        return callback(err);
      }
      if (solution) {
        return callback({message: "You already solved this challenge!"});
      }
      return callback(null, solution);
    });
};






module.exports = SolvedCTFController;
