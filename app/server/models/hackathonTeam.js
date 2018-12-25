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
  event: {
    type: String
  },
  members: [{
    type: String
  }],
});

//=========================================
// Static Methods
//=========================================

schema.statics.findOneByID = function(id){
  return this.findOne({
    _id: id
  });
};


module.exports = mongoose.model('hackathonTeam', schema);