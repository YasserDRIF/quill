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
  title: {
    type: String
  },
  description: {
    type: String,
  },
  dependency: {
    type: String
  },
  points: {
    type: Number
  },
  answer: {
    type: String,
    select: false
  },
});




//=========================================
// Instance Methods
//=========================================

// checking if this password matches
schema.methods.checkAnswer = function(answer) {
  return answer== this.answer;
};




//=========================================
// Static Methods
//=========================================

schema.statics.findOneByID = function(id){
  return this.findOne({
    _id: id
  });
};


module.exports = mongoose.model('Challenge', schema);