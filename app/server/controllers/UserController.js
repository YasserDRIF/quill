var _ = require("underscore");
var User = require("../models/User");
var Settings = require("../models/Settings");
var Mailer = require("../services/email");
var Stats = require("../services/stats");

var validator = require("validator");
var moment = require("moment");

var UserController = {};

var maxTeamSize = process.env.TEAM_MAX_SIZE || 4;

// Tests a string if it ends with target s
function endsWith(s, test) {
  return test.indexOf(s, test.length - s.length) !== -1;
}

/**
 * Determine whether or not a user can register.
 * @param  {String}   email    Email of the user
 * @param  {Function} callback args(err, true, false)
 * @return {[type]}            [description]
 */
function canRegister(email, password, callback) {
  if (!password || password.length < 6) {
    return callback(
      { message: "Password must be 6 or more characters." },
      false
    );
  }

  // Check if its within the registration window.
  Settings.getRegistrationTimes(function(err, times) {
    if (err) {
      callback(err);
    }

    var now = Date.now();

    if (now < times.timeOpen) {
      return callback({
        message:
          "Registration opens in " + moment(times.timeOpen).fromNow() + "!"
      });
    }

    if (now > times.timeClose) {
      return callback({
        message: "Sorry, registration is closed."
      });
    }

    // Check for emails.
    Settings.getWhitelistedEmails(function(err, emails) {
      if (err || !emails) {
        return callback(err);
      }
      for (var i = 0; i < emails.length; i++) {
        if (validator.isEmail(email) && endsWith(emails[i], email)) {
          return callback(null, true);
        }
      }
      return callback(
        {
          message: "Not a valid educational email."
        },
        false
      );
    });
  });
}

/**
 * Login a user given a token
 * @param  {String}   token    auth token
 * @param  {Function} callback args(err, token, user)
 */
UserController.loginWithToken = function(token, callback) {
  User.getByToken(token, function(err, user) {
    return callback(err, token, user);
  });
};

/**
 * Login a user given an email and password.
 * @param  {String}   email    Email address
 * @param  {String}   password Password
 * @param  {Function} callback args(err, token, user)
 */
UserController.loginWithPassword = function(email, password, callback) {
  if (!password || password.length === 0) {
    return callback({
      message: "Please enter a password"
    });
  }

  if (!validator.isEmail(email)) {
    return callback({
      message: "Invalid email"
    });
  }

  User.findOneByEmail(email)
    .select("+password")
    .exec(function(err, user) {
      if (err) {
        return callback(err);
      }
      if (!user) {
        return callback({
          message: "We couldn't find you!"
        });
      }
      if (!user.checkPassword(password)) {
        return callback({
          message: "That's not the right password."
        });
      }

      // yo dope nice login here's a token for your troubles
      var token = user.generateAuthToken();

      var u = user.toJSON();

      delete u.password;

      return callback(null, token, u);
    });
};

/**
 * Create a new user given an email and a password.
 * @param  {String}   email    User's email.
 * @param  {String}   password [description]
 * @param  {Function} callback args(err, user)
 */
UserController.createUser = function(email, password, callback) {
  if (typeof email !== "string") {
    return callback({
      message: "Email must be a string."
    });
  }

  email = email.toLowerCase();

  // Check that there isn't a user with this email already.
  canRegister(email, password, function(err, valid) {
    if (err || !valid) {
      return callback(err);
    }

    var u = new User();
    u.email = email;
    u.password = User.generateHash(password);
    u.save(function(err) {
      if (err) {
        // Duplicate key error codes
        if (
          err.name === "MongoError" &&
          (err.code === 11000 || err.code === 11001)
        ) {
          return callback({
            message: "An account for this email already exists."
          });
        }

        return callback(err);
      } else {
        // yay! success.
        var token = u.generateAuthToken();

        // Send over a verification email
        var verificationToken = u.generateEmailVerificationToken();
        Mailer.sendVerificationEmail(email, verificationToken);

        return callback(null, {
          token: token,
          user: u
        });
      }
    });
  });
};

UserController.getByToken = function(token, callback) {
  User.getByToken(token, callback);
};

/**
 * Get all users.
 * It's going to be a lot of data, so make sure you want to do this.
 * @param  {Function} callback args(err, user)
 */
UserController.getAll = function(callback) {
  User.find({}, callback);
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
    queries.push({ 'email': re });
    queries.push({ 'profile.name': re });
    queries.push({ 'teamCode': re });
  }
  return queries;
}
 /**
 * Builds status queries.
 * Each key on 'statusFilters' is a status, and the value is a bool.
 * 
 * @param   {[type]} statusFilters object with status keys
 * @returns {Object} queries  status queries
 */
function buildStatusQueries(statusFilters) {
  const queries = [];
  for (var key in statusFilters) {
    if (statusFilters.hasOwnProperty(key)) {
      // Convert to boolean
      const hasStatus = (statusFilters[key] === 'true');
      if (hasStatus) {
        var q = {};
        // Verified is a prop on user object
        var queryKey = (key === 'verified' ? key : 'status.' + key);
        q[queryKey] = true;
        queries.push(q);
      }
    }
  }
  return queries;
}
 /**
 * Builds a find query.
 * The root changes according to the following:
 * $and { $or, $and } for text and status queries respectively
 * $or for text queries
 * $and for status queries
 * 
 * @param   {[type]} textQueries   text query objects
 * @param   {[type]} statusQueries size of the page
 * @returns {Object} findQuery     query object
 */
function buildFindQuery(textQueries, statusQueries) {
  const findQuery = {};
  if (textQueries.length > 0 && statusQueries.length > 0) {
    var queryRoot = [];
    queryRoot.push({ '$or': textQueries });
    queryRoot.push({ '$and': statusQueries });
    findQuery.$and = queryRoot;
  } else if (textQueries.length > 0) {
    findQuery.$or = textQueries;
  } else if (statusQueries.length > 0) {
    findQuery.$and = statusQueries;
  }
  return findQuery;
}


/**
 * Get a page of users.
 * @param  {[type]}   page     page number
 * @param  {[type]}   size     size of the page
 * @param  {Function} callback args(err, {users, page, totalPages})
 */
UserController.getPage = function(query, callback) {
  var page = query.page;
  var size = parseInt(query.size);
  var searchText = query.text;
  var statusFilters = query.statusFilters;

  // Build a query for the search text
  var textQueries = buildTextQueries(searchText);

  // Build a query for each status
  var statusQueries = buildStatusQueries(statusFilters);
   // Build find query
  var findQuery = buildFindQuery(textQueries, statusQueries);


  User.find(findQuery)
    .sort({
      "profile.name": "asc"
    })
    .select("+status.admittedBy")
    .skip(page * size)
    .limit(size)
    .exec(function(err, users) {
      if (err || !users) {
        return callback(err);
      }

      User.count(findQuery).exec(function(err, count) {
        if (err) {
          return callback(err);
        }

        return callback(null, {
          users: users,
          page: page,
          size: size,
          totalPages: Math.ceil(count / size)
        });
      });
    });
};

/**
 * Get a user by id.
 * @param  {String}   id       User id
 * @param  {Function} callback args(err, user)
 */
UserController.getById = function(id, callback) {
  User.findById(id).exec(callback);
};

/**
 * Update a user's profile/confirmation objects, given an id and a profile.
 *
 * @param  {String}   id       Id of the user
 * @param  {Object}   profile  Profile object
 * @param  {Function} callback Callback with args (err, user)
 */
UserController.updateAllById = function(id, profile, confirmation, callback) {
  // Validate the user profile, and mark the user as profile completed
  // when successful.
  User.validateProfile(profile, function(err) {
    if (err) {
      return callback({ message: "invalid profile" });
    }

    // Check if its within the registration window.
    Settings.getRegistrationTimes(function(err, times) {
      if (err) {
        callback(err);
      }

      var now = Date.now();

      if (now < times.timeOpen) {
        return callback({
          message:
            "Registration opens in " + moment(times.timeOpen).fromNow() + "!"
        });
      }

      if (now > times.timeClose) {
        return callback({
          message: "Sorry, registration is closed."
        });
      }
    });

    User.findOneAndUpdate(
      {
        _id: id,
        verified: true
      },
      {
        $set: {
          lastUpdated: Date.now(),
          profile: profile,
          confirmation: confirmation,
          "status.completedProfile": true
        }
      },
      {
        new: true
      },
      callback
    );
  });
};

/**
 * Update a user's profile object, given an id and a profile.
 *
 * @param  {String}   id       Id of the user
 * @param  {Object}   profile  Profile object
 * @param  {Function} callback Callback with args (err, user)
 */
UserController.updateProfileById = function(id, profile, callback) {
  // Validate the user profile, and mark the user as profile completed
  // when successful.
  User.validateProfile(profile, function(err) {
    if (err) {
      return callback({ message: "invalid profile" });
    }

    // Check if its within the registration window.
    Settings.getRegistrationTimes(function(err, times) {
      if (err) {
        callback(err);
      }

      var now = Date.now();

      if (now < times.timeOpen) {
        return callback({
          message:
            "Registration opens in " + moment(times.timeOpen).fromNow() + "!"
        });
      }

      if (now > times.timeClose) {
        return callback({
          message: "Sorry, registration is closed."
        });
      }

      if (!profile.submittedApplication) {
        // Send application success email after first application submission
        profile.submittedApplication = true;
        User.findById(id, function(err, user) {
          if (err) {
            console.log("Could not send email:");
            console.log(err);
          }
          Mailer.sendApplicationEmail(user);
        });
      }
    });

    User.findOneAndUpdate(
      {
        _id: id,
        verified: true
      },
      {
        $set: {
          lastUpdated: Date.now(),
          profile: profile,
          "status.completedProfile": true
        }
      },
      {
        new: true
      },
      callback
    );
  });
};

/**
 * Update a user's confirmation object, given an id and a confirmation.
 *
 * @param  {String}   id            Id of the user
 * @param  {Object}   confirmation  Confirmation object
 * @param  {Function} callback      Callback with args (err, user)
 */
UserController.updateConfirmationById = function(id, confirmation, callback) {
  User.findById(id).exec(function(err, user) {
    if (err || !user) {
      return callback(err);
    }

    // Make sure that the user followed the deadline, but if they're already confirmed
    // that's okay.
    if (Date.now() >= user.status.confirmBy && !user.status.confirmed) {
      return callback({
        message: "You've missed the confirmation deadline."
      });
    }

    // You can only confirm acceptance if you're admitted and haven't declined.
    User.findOneAndUpdate(
      {
        _id: id,
        verified: true,
        "status.admitted": true,
        "status.declined": { $ne: true }
      },
      {
        $set: {
          lastUpdated: Date.now(),
          confirmation: confirmation,
          "status.confirmed": true
        }
      },
      {
        new: true
      },
      function(err, user) {
        if (err || !user) {
          return callback(err);
        }
        Mailer.sendConfirmationEmail(user);
        return callback(err, user);
      },
      callback
    );
  });
};

/**
 * Decline an acceptance, given an id.
 *
 * @param  {String}   id            Id of the user
 * @param  {Function} callback      Callback with args (err, user)
 */
UserController.declineById = function(id, callback) {
  // You can only decline if you've been accepted.
  User.findOneAndUpdate(
    {
      _id: id,
      verified: true,
      "status.admitted": true,
      "status.declined": false
    },
    {
      $set: {
        lastUpdated: Date.now(),
        "status.confirmed": false,
        "status.declined": true
      }
    },
    {
      new: true
    },
    callback
  );
};

/**
 * Verify a user's email based on an email verification token.
 * @param  {[type]}   token    token
 * @param  {Function} callback args(err, user)
 */
UserController.verifyByToken = function(token, callback) {
  User.verifyEmailVerificationToken(token, function(err, email) {
    User.findOneAndUpdate(
      {
        email: email.toLowerCase()
      },
      {
        $set: {
          verified: true
        }
      },
      {
        new: true
      },
      callback
    );
  });
};

/**
 * Get a specific user's teammates. NAMES ONLY.
 * @param  {String}   id       id of the user we're looking for.
 * @param  {Function} callback args(err, users)
 */
UserController.getTeammates = function(id, callback) {
  User.findById(id).exec(function(err, user) {
    if (err || !user) {
      return callback(err, user);
    }

    var code = user.teamCode;

    if (!code) {
      return callback({
        message: "You're not on a team."
      });
    }

    User.find({
      teamCode: code
    })
      .select("profile.name")
      .exec(callback);
  });
};

/**
 * Given a team code and id, join a team.
 * @param  {String}   id       Id of the user joining/creating
 * @param  {String}   code     Code of the proposed team
 * @param  {Function} callback args(err, users)
 */
UserController.createOrJoinTeam = function(id, code, callback) {
  if (!code) {
    return callback({
      message: "Please enter a team name."
    });
  }

  if (typeof code !== "string") {
    return callback({
      message: "Get outta here, punk!"
    });
  }

  User.find({
    teamCode: code
  })
    .select("profile.name")
    .exec(function(err, users) {
      // Check to see if this team is joinable (< team max size)
      if (users.length >= maxTeamSize) {
        return callback({
          message: "Team is full."
        });
      }

      // Otherwise, we can add that person to the team.
      User.findOneAndUpdate(
        {
          _id: id,
          verified: true
        },
        {
          $set: {
            teamCode: code
          }
        },
        {
          new: true
        },
        callback
      );
    });
};

/**
 * Given an id, remove them from any teams.
 * @param  {[type]}   id       Id of the user leaving
 * @param  {Function} callback args(err, user)
 */
UserController.leaveTeam = function(id, callback) {
  User.findOneAndUpdate(
    {
      _id: id
    },
    {
      $set: {
        teamCode: null
      }
    },
    {
      new: true
    },
    callback
  );
};

/**
 * Resend an email verification email given a user id.
 */
UserController.sendVerificationEmailById = function(id, callback) {
  User.findOne(
    {
      _id: id,
      verified: false
    },
    function(err, user) {
      if (err || !user) {
        return callback(err);
      }
      var token = user.generateEmailVerificationToken();
      Mailer.sendVerificationEmail(user.email, token);
      return callback(err, user);
    }
  );
};

/**
 * Password reset email
 * @param  {[type]}   email    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
UserController.sendPasswordResetEmail = function(email, callback) {
  User.findOneByEmail(email).exec(function(err, user) {
    if (err || !user) {
      return callback(err);
    }

    var token = user.generateTempAuthToken();
    Mailer.sendPasswordResetEmail(email, token, callback);
  });
};

/**
 * UNUSED
 *
 * Change a user's password, given their old password.
 * @param  {[type]}   id          User id
 * @param  {[type]}   oldPassword old password
 * @param  {[type]}   newPassword new password
 * @param  {Function} callback    args(err, user)
 */
UserController.changePassword = function(
  id,
  oldPassword,
  newPassword,
  callback
) {
  if (!id || !oldPassword || !newPassword) {
    return callback({
      message: "Bad arguments."
    });
  }

  User.findById(id)
    .select("password")
    .exec(function(err, user) {
      if (user.checkPassword(oldPassword)) {
        User.findOneAndUpdate(
          {
            _id: id
          },
          {
            $set: {
              password: User.generateHash(newPassword)
            }
          },
          {
            new: true
          },
          callback
        );
      } else {
        return callback({
          message: "Incorrect password"
        });
      }
    });
};

/**
 * Reset a user's password to a given password, given a authentication token.
 * @param  {String}   token       Authentication token
 * @param  {String}   password    New Password
 * @param  {Function} callback    args(err, user)
 */
UserController.resetPassword = function(token, password, callback) {
  if (!password || !token) {
    return callback({
      message: "Bad arguments"
    });
  }

  if (password.length < 6) {
    return callback({
      message: "Password must be 6 or more characters."
    });
  }

  User.verifyTempAuthToken(token, function(err, id) {
    if (err || !id) {
      return callback(err);
    }

    User.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          password: User.generateHash(password)
        }
      },
      function(err, user) {
        if (err || !user) {
          return callback(err);
        }

        Mailer.sendPasswordChangedEmail(user.email);
        return callback(null, {
          message: "Password successfully reset!"
        });
      }
    );
  });
};

/**
 * [ADMIN ONLY]
 *
 * Admit a user.
 * @param  {String}   userId   User id of the admit
 * @param  {String}   user     User doing the admitting
 * @param  {Function} callback args(err, user)
 */

UserController.softAdmitUser = function(id, user, callback) {
  Settings.getRegistrationTimes(function(err, times) {
    User.findOneAndUpdate(
      {
        _id: id,
        verified: true
      },
      {
        $set: {
          "status.softAdmitted": true,
          "status.admittedBy": user.email,
          "status.confirmBy": times.timeConfirm
        }
      },
      {
        new: true
      },
      callback
    );
  });
};

UserController.admitUser = function(id, user, callback) {
  Settings.getRegistrationTimes(function(err, times) {
    User.findOneAndUpdate(
      {
        _id: id,
        verified: true
      },
      {
        $set: {
          "status.admitted": true,
          "status.admittedBy": user.email,
          "status.confirmBy": times.timeConfirm
        }
      },
      {
        new: true
      },
      function(err, user) {
        if (err || !user) {
          return callback(err);
        }
        Mailer.sendAdmittanceEmail(user);
        console.log("Sent acceptence Mail to" + user.profile.name);
        return callback(err, user);
      },
      callback
    );
  });
};

UserController.sendQREmail = function(id, callback) {
  User.findOne({
    _id: id
  })
    .then(user => {
      Mailer.sendQREmail(user,callback);
    })
    .catch(err => callback(err));
};

/**
 * [ADMIN ONLY]
 *
 * Check in a user.
 * @param  {String}   userId   User id of the user getting checked in.
 * @param  {String}   user     User checking in this person.
 * @param  {Function} callback args(err, user)
 */

UserController.checkInByIdAdmitted = function(id, user, cb_succes, cb_err) {
  User.findOne({
    _id: id
  })
    .then(user => {
      if (user.status.admitted) {
        User.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              "status.checkedIn": true,
              "status.checkInTime": Date.now()
            }
          }
        )
          .then(cb_succes)
          .catch(err => cb_err("undefined error"));
      } else cb_err("user not addmited");
    })
    .catch(err => cb_err("user doesnt exist"));
};

/**
 * [ADMIN ONLY]
 *
 * Check in a user.
 * @param  {String}   userId   User id of the user getting checked in.
 * @param  {String}   user     User checking in this person.
 * @param  {Function} callback args(err, user)
 */
UserController.checkInById = function(id, user, callback) {
  User.findOneAndUpdate(
    {
      _id: id,
      verified: true
    },
    {
      $set: {
        "status.checkedIn": true,
        "status.checkInTime": Date.now()
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
 * Check out a user.
 * @param  {String}   userId   User id of the user getting checked out.
 * @param  {String}   user     User checking in this person.
 * @param  {Function} callback args(err, user)
 */
UserController.checkOutById = function(id, user, callback) {
  User.findOneAndUpdate(
    {
      _id: id,
      verified: true
    },
    {
      $set: {
        "status.checkedIn": false
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
 * Make user an admin
 * @param  {String}   userId   User id of the user being made admin
 * @param  {String}   user     User making this person admin
 * @param  {Function} callback args(err, user)
 */
UserController.makeAdminById = function(id, user, callback) {
  User.findOneAndUpdate(
    {
      _id: id,
      verified: true
    },
    {
      $set: {
        admin: true
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
 * Make user an admin
 * @param  {String}   userId   User id of the user being made admin
 * @param  {String}   user     User making this person admin
 * @param  {Function} callback args(err, user)
 */
UserController.removeAdminById = function(id, user, callback) {
  User.findOneAndUpdate(
    {
      _id: id,
      verified: true
    },
    {
      $set: {
        admin: false
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
 * Remove User
 * @param  {String}   userId   User id of the user being removed
 * @param  {String}   user     User Removing this user
 * @param  {Function} callback args(err, user)
 */
UserController.removeUserById = function(id, user, callback) {
  User.findOneAndDelete(
    {
      _id: id
    },
    callback
  );
};


// Live Stats  **********************************************************


UserController.gotmeal1 = function(id, user, cb_succes, cb_err) {
    User.findOne({
      _id: id
    })
      .then(user => {
        console.log("Got meal = "+user.live.gotmeal1);
        if (!user.live.gotmeal1) {
          
          User.findOneAndUpdate(
            { _id: id },
            {
              $set: {
                "live.gotmeal1": true,
              }
            }
          )
            .then(cb_succes)
            .catch(err => cb_err("undefined error"));
        } else cb_err("User did this action already");
      })
      .catch(err => cb_err("user doesnt exist"));
  };
  











/**
 * [ADMIN ONLY]
 */

UserController.getStats = function(callback) {
  return callback(null, Stats.getUserStats());
};

/**
 * [ADMIN ONLY]
 */

UserController.getStats = function(callback) {
  return callback(null, Stats.getUserStats());
};

UserController.getTeamStats = function(callback) {
  return callback(null, Stats.getTeamStats());
};

UserController.massReject = function(callback) {
  User.update(
    {
      $and: [
        { specialRegistration: { $ne: true } },
        { "status.admitted": { $ne: true } },
        { "status.softAdmitted": { $ne: true } },
        {
          $or: [
            {
              $and: [
                { "profile.travelFromCountry": "Finland" },
                { "status.rating": { $lt: 4 } }
              ]
            },
            { "profile.travelFromCountry": { $ne: "Finland" } }
          ]
        }
      ]
    },
    {
      $set: {
        "status.rejected": true
      }
    },
    {
      multi: true
    },
    callback
  );
};

UserController.getRejectionCount = function(callback) {
  User.find({
    $and: [
      { specialRegistration: { $ne: true } },
      { "status.rejected": { $ne: true } },
      { "status.admitted": { $ne: true } },
      { "status.softAdmitted": { $ne: true } },
      {
        $or: [
          {
            $and: [
              { "profile.travelFromCountry": "Finland" },
              { "status.rating": { $lt: 4 } }
            ]
          },
          { "profile.travelFromCountry": { $ne: "Finland" } }
        ]
      }
    ]
  }).exec(function(err, users) {
    if (err) return callback(err, users);
    var amount = users.length;
    return callback(null, amount);
  });
};

UserController.massRejectRest = function(callback) {
  User.update(
    {
      $and: [
        { "status.admitted": { $ne: true } },
        { "status.softAdmitted": { $ne: true } }
      ]
    },
    {
      $set: {
        "status.rejected": true,
        "status.laterRejected": true
      }
    },
    {
      multi: true
    },
    callback
  );
};

UserController.getRejectionRestCount = function(callback) {
  User.find({
    $and: [
      { "status.rejected": { $ne: true } },
      { "status.admitted": { $ne: true } },
      { "status.softAdmitted": { $ne: true } }
    ]
  }).exec(function(err, users) {
    if (err) return callback(err, users);
    var amount = users.length;
    return callback(null, amount);
  });
};

UserController.getLaterRejectionCount = function(callback) {
  User.find({
    "status.laterRejected": true,
    "status.rejected": true,
    "status.waitlist": true
  }).exec(function(err, users) {
    if (err) return callback(err, users);
    var amount = users.length;
    return callback(null, amount);
  });
};

module.exports = UserController;
