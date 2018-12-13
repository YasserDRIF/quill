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
});





schema.statics.getPublicSettings = function(callback){
  this
    .findOne({})
    .exec(callback);
};

module.exports = mongoose.model('Challenge', schema);
