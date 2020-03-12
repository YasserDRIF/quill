var mongoose = require('mongoose');



var member = {

  id: {
    type: String,
  },
  name: {
    type: String,
  },
  skill: {
    type: String,
  },
}

var skills = {

  code: {
    type: Boolean,
    required: true,
    default: true,
  },
  design: {
    type: Boolean,
    required: true,
    default: true,
  },
  hardware: {
    type: Boolean,
    required: true,
    default: true,
  },
  idea: {
    type: Boolean,
    required: true,
    default: true,
  },
}

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
  description: {
    type: String
  },
  members: [member],
  joinRequests: [member],
  skills: skills,
  isColosed: {
    type: Boolean,
    required: true,
    default: false,
  },
  isPrivate: {
    type: Boolean,
    required: true,
    default: false,
  }
});


//=========================================
// Static Methods
//=========================================

schema.statics.findOneByID = function(id){
  return this.findOne({
    _id: id
  });
};


module.exports = mongoose.model('Team', schema);