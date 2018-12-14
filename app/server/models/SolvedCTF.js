var mongoose = require('mongoose');

/**
 * Challenges Schema!
 *
 * Fields with select: false are not public.
 * These can be retrieved in controller methods.
 *
 * @type {mongoose}
 */
var schema = new mongoose.Schema({
  status: String,
  challenge: {
    type: String
  },
  user: {
    type: String,
  },
  timeSolved: {
    type: Number
  },
  points: {
    type: Number
  },

});


schema.statics.findOneByOptions = function(challengeID,userID){
  return this.findOne({
    challenge: challengeID,
    user : userID
  });
};

module.exports = mongoose.model('SolvedCTF', schema);