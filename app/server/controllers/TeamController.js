var Team = require("../models/Team");
var User = require("../models/User");
var Mailer = require("../services/email");

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
  t.joinRequests =[];
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
 * Builds search text queries.
 * 
 * @param   {String} searchText the text to search
 * @returns {Object} queries    text queries
 */
function buildTextQueries(searchText) {
  const queries = [];
  if (searchText.length > 0) {
    const re = new RegExp(searchText, 'i');
    queries.push({ 'description': re });
  }
  return queries;
}


 /**
 * Builds status queries.
 * Each key on 'skillsFilters' is a skill, and the value is a bool.
 * 
 * @param   {[type]} skillsFilters object with status keys
 * @returns {Object} queries  status queries
 */
function buildskillsQueries(skillsFilters) {
  const queries = [];
  for (var key in skillsFilters) {
    if (skillsFilters.hasOwnProperty(key)) {
      // Convert to boolean
      const hasSkill = (skillsFilters[key] === 'true');
      if (hasSkill) {
        var q = {};
        // Verified is a prop on user object
        var queryKey = 'skills.' + key;
        q[queryKey] = true;
        queries.push(q);
      }
    }
  }
  return queries;
}



function buildFindQuery(textQueries, skillsQueries) {
  const findQuery = {};
  if (textQueries.length > 0 && skillsQueries.length > 0) {
    var queryRoot = [];
    queryRoot.push({ '$or': textQueries });
    queryRoot.push({ '$and': skillsQueries });
    findQuery.$and = queryRoot;
  } else if (textQueries.length > 0) {
    findQuery.$or = textQueries;
  } else if (skillsQueries.length > 0) {
    findQuery.$and = skillsQueries;
  }
  return findQuery;
}



TeamController.getSelectedTeams = function(query, callback) {
  var searchText = query.text;
  var skillsFilters = query.skillsFilters;

  // Build a query for the search text
  var textQueries = buildTextQueries(searchText);

  // Build a query for each skill
  var skillsQueries = buildskillsQueries(skillsFilters);
  
   // Build find query
  var findQuery = buildFindQuery(textQueries, skillsQueries);


  Team.find(findQuery)
    .sort({
      "_id": "desc"
    })
    .select("+status.reviewedBy")
    .exec(function(err, teams) {
      if (err || !teams) {
        return callback(err);
      }
      return callback(null, {
        teams: teams
      });

    });
};



  
/**
 * Get a team by id.
 * @param  {String}   id       challenge id
 * @param  {Function} callback args(err, user)
 */
TeamController.getById = function(id, callback) {
  Team.findOneByID(id).exec(callback);
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
 * Update the challenge options objects, given an id and the options.
 */
TeamController.updatejoined = function(id, newjoinRequest, cb_succes, cb_err) {

  console.log(id);
  
  Team.findOne({
    _id: id
  })
    .then(team => {    
        Team.findOneAndUpdate(
          { _id: id },
          {
            $push: {
             joinRequests: newjoinRequest
            }
          },
        ).then(cb_succes)
          .catch(err => cb_err(err));
    })
    .catch(err => cb_err(err));
};



/**
 * Update the challenge options objects, given an id and the options.
 */
TeamController.updateMembers = function(id, newMembers, callback) {

  Team.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        members: newMembers
      }
    },
    {
      new: true
    },
    callback
  );
  
};



TeamController.sendAcceptedTeamEmail = function(id, callback) {
  User.findOne({
    _id: id
  })
    .then(user => {
      Mailer.acceptedToTeam(user);
    })
    .catch(err => callback(err));
};


TeamController.SendRefusedTeamEmail = function(id, callback) {
  User.findOne({
    _id: id
  })
    .then(user => {
      Mailer.refusedfromTeam(user);
    })
    .catch(err => callback(err));
};

TeamController.SendRemovedTeamEmail = function(id, callback) {
  User.findOne({
    _id: id
  })
    .then(user => {
      Mailer.removedfromTeam(user);
    })
    .catch(err => callback(err));
};


TeamController.SendAdminRemovedTeamEmail = function(id, member, callback) {
  User.findOne({
    _id: id
  })
    .then(user => {
      Mailer.memberLeftTeam(user,member);
    })
    .catch(err => callback(err));
};


TeamController.removeTeam = function(id, callback) {
  Team.findOneAndDelete(
    {
      _id: id
    },
    callback
  );
};


TeamController.toggleCloseTeam = function(id, isColosed, callback) {
  Team.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        isColosed: isColosed
      }
    },
    {
      new: true
    },
    callback
  );
};

TeamController.toggleHideTeam = function(id, isPrivate, callback) {
  Team.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        isPrivate: isPrivate
      }
    },
    {
      new: true
    },
    callback
  );
};







module.exports = TeamController;