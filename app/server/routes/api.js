var UserController = require("../controllers/UserController");
var SettingsController = require("../controllers/SettingsController");
var ChallengeController = require("../controllers/ChallengeController");
var request = require("request");

module.exports = function(router) {
  function getToken(req) {
    return req.headers["x-access-token"];
  }

  /**
   * Using the access token provided, check to make sure that
   * you are, indeed, an admin.
   */
  function isAdmin(req, res, next) {
    var token = getToken(req);

    UserController.getByToken(token, function(err, user) {
      if (err) {
        return res.status(500).send(err);
      }

      if (user && user.admin) {
        req.user = user;
        return next();
      }

      return res.status(401).send({
        message: "Get outta here, punk!"
      });
    });
  }

  /**
   * [Users API Only]
   *
   * Check that the id param matches the id encoded in the
   * access token provided.
   *
   * That, or you're the admin, so you can do whatever you
   * want I suppose!
   */
  function isOwnerOrAdmin(req, res, next) {
    var token = getToken(req);
    var userId = req.params.id;

    UserController.getByToken(token, function(err, user) {
      if (err || !user) {
        return res.status(500).send(err);
      }

      if (user._id == userId || user.admin) {
        return next();
      }
      return res.status(400).send({
        message: "Token does not match user id."
      });
    });
  }

  /**
   * Default response to send an error and the data.
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  function defaultResponse(req, res) {
    return function(err, data) {
      if (err) {
        // SLACK ALERT!
        if (process.env.NODE_ENV === "production") {
          request.post(
            process.env.SLACK_HOOK,
            {
              form: {
                payload: JSON.stringify({
                  text:
                    "``` \n" +
                    "Request: \n " +
                    req.method +
                    " " +
                    req.url +
                    "\n ------------------------------------ \n" +
                    "Body: \n " +
                    JSON.stringify(req.body, null, 2) +
                    "\n ------------------------------------ \n" +
                    "\nError:\n" +
                    JSON.stringify(err, null, 2) +
                    "``` \n"
                })
              }
            },
            function(error, response, body) {
              return res.status(500).send({
                message: "Your error has been recorded, we'll get right on it!"
              });
            }
          );
        } else {
          return res.status(500).send(err);
        }
      } else {
        return res.json(data);
      }
    };
  }

  /**
   *  API!
   */

  /*
    Chechin if Admitted, used fro QR Checkin 
    */

  router.get("/users/:id/check-qr", function(req, res) {
    var id = req.params.id;
    var user = req.user;
    UserController.checkInByIdAdmitted( id, user, () => {
        res.send(JSON.stringify({ message: "checked in succesfuly" }));
      },
      err => {
        res.send(JSON.stringify({ error: err }));
      }
    );
  });

  // ---------------------------------------------
  // Users
  // ---------------------------------------------

  /**
   * [ADMIN ONLY]
   *
   * GET - Get all users, or a page at a time.
   * ex. Paginate with ?page=0&size=100
   */
  router.get("/users", isAdmin, function(req, res) {
    var query = req.query;
    if (query.page && query.size) {
      UserController.getPage(query, defaultResponse(req, res));
    } else {
      UserController.getAll(defaultResponse(req, res));
    }
  });

  /**
   * [ADMIN ONLY]
   */
  router.get("/users/stats", function(req, res) {
    UserController.getStats(defaultResponse(req, res));
  });

  router.post("/users/massReject", isAdmin, function(req, res) {
    UserController.massReject(defaultResponse(req, res));
  });

  router.get("/users/rejectionCount", isAdmin, function(req, res) {
    UserController.getRejectionCount(defaultResponse(req, res));
  });

  router.post("/users/massRejectRest", isAdmin, function(req, res) {
    UserController.massRejectRest(defaultResponse(req, res));
  });

  router.get("/users/rejectionCountRest", isAdmin, function(req, res) {
    UserController.getRejectionRestCount(defaultResponse(req, res));
  });

  router.get("/users/laterRejectCount", isAdmin, function(req, res) {
    UserController.getLaterRejectionCount(defaultResponse(req, res));
  });

  router.post("/users/sendResetEmail", isAdmin, function(req, res) {
    const email = req.body.email;
    UserController.sendPasswordResetEmail(email, defaultResponse(req, res));
  });

  /**
   * [OWNER/ADMIN]
   *
   * GET - Get a specific user.
   */
  router.get("/users/:id", isOwnerOrAdmin, function(req, res) {
    UserController.getById(req.params.id, defaultResponse(req, res));
  });

  /**
   * [OWNER/ADMIN]
   *
   * PUT - Update a specific user's profile.
   */
  router.put("/users/:id/profile", isOwnerOrAdmin, function(req, res) {
    var profile = req.body.profile;
    var id = req.params.id;

    UserController.updateProfileById(id, profile, defaultResponse(req, res));
  });

  /**
   * [OWNER/ADMIN]
   *
   * PUT - Update a specific user's confirmation information.
   */
  router.put("/users/:id/confirm", isOwnerOrAdmin, function(req, res) {
    var confirmation = req.body.confirmation;
    var id = req.params.id;

    UserController.updateConfirmationById(
      id,
      confirmation,
      defaultResponse(req, res)
    );
  });

  /**
   * [OWNER/ADMIN]
   *
   * PUT - Update a specific user's profile/confirmation information.
   */
  router.put("/users/:id/updateall", isOwnerOrAdmin, function(req, res) {
    var profile = req.body.user.profile;
    var confirmation = req.body.user.confirmation;
    var id = req.params.id;

    UserController.updateAllById(
      id,
      profile,
      confirmation,
      defaultResponse(req, res)
    );
  });

  /**
   * [OWNER/ADMIN]
   *
   * POST - Decline an acceptance.
   */
  router.post("/users/:id/decline", isOwnerOrAdmin, function(req, res) {
    var confirmation = req.body.confirmation;
    var id = req.params.id;

    UserController.declineById(id, defaultResponse(req, res));
  });

  /**
   * Get a user's team member's names. Uses the code associated
   * with the user making the request.
   */
  router.get("/users/:id/team", isOwnerOrAdmin, function(req, res) {
    var id = req.params.id;
    UserController.getTeammates(id, defaultResponse(req, res));
  });

  /**
   * Update a teamcode. Join/Create a team here.
   * {
   *   code: STRING
   * }
   */
  router.put("/users/:id/team", isOwnerOrAdmin, function(req, res) {
    var code = req.body.code;
    var id = req.params.id;

    UserController.createOrJoinTeam(id, code, defaultResponse(req, res));
  });

  /**
   * Remove a user from a team.
   */
  router.delete("/users/:id/team", isOwnerOrAdmin, function(req, res) {
    var id = req.params.id;

    UserController.leaveTeam(id, defaultResponse(req, res));
  });

  /**
   * Update a user's password.
   * {
   *   oldPassword: STRING,
   *   newPassword: STRING
   * }
   */
  router.put("/users/:id/password", isOwnerOrAdmin, function(req, res) {
    return res.status(304).send();
    // Currently disable.
    // var id = req.params.id;
    // var old = req.body.oldPassword;
    // var pass = req.body.newPassword;

    // UserController.changePassword(id, old, pass, function(err, user){
    //   if (err || !user){
    //     return res.status(400).send(err);
    //   }
    //   return res.json(user);
    // });
  });

  /**
   * Admit a user. ADMIN ONLY, DUH
   *
   * Also attaches the user who did the admitting, for liabaility.
   */
  router.post("/users/:id/admit", isAdmin, function(req, res) {
    // Accept the hacker. Admin only
    var id = req.params.id;
    var user = req.user;
    UserController.admitUser(id, user, defaultResponse(req, res));
  });

  router.post("/users/:id/softAdmit", isAdmin, function(req, res) {
    // Accept the hacker. Admin only
    var id = req.params.id;
    var user = req.user;
    //UserController.softAdmitUser(id, user, defaultResponse(req, res));
  });

  /**
   * Send QR emails to confirmed applicants
   */
  router.post("/users/:id/sendQREmail", isAdmin, function(req, res) {
    // Accept the hacker. Admin only
    var id = req.params.id;
    var user = req.user;
    UserController.sendQREmail(id, defaultResponse(req, res));
  });

  /**
   * Send basic email
   */
  router.post("/users/:id/sendBasicMail/", isAdmin, function(req, res) {
    // Accept the hacker. Admin only
    var id = req.params.id;
    UserController.sendBasicMail(id, req.body, defaultResponse(req, res));
  });

  /**
   * Check in a user. ADMIN ONLY, DUH
   */
  router.post("/users/:id/checkin", isAdmin, function(req, res) {
    var id = req.params.id;
    var user = req.user;
    UserController.checkInById(id, user, defaultResponse(req, res));
  });

  /**
   * Check in a user. ADMIN ONLY, DUH
   */
  router.post("/users/:id/checkout", isAdmin, function(req, res) {
    var id = req.params.id;
    var user = req.user;
    UserController.checkOutById(id, user, defaultResponse(req, res));
  });

  /**
   * Remove User. ADMIN ONLY
   */
  router.post("/users/:id/removeuser", isAdmin, function(req, res) {
    var id = req.params.id;
    var user = req.user;
    UserController.removeUserById(id, user, defaultResponse(req, res));
  });

  /**
   * Make user an admin
   */
  router.post("/users/:id/makeadmin", isAdmin, function(req, res) {
    var id = req.params.id;
    var user = req.user;
    UserController.makeAdminById(id, user, defaultResponse(req, res));
  });

  /**
   * Demote user
   */
  router.post("/users/:id/removeadmin", isAdmin, function(req, res) {
    var id = req.params.id;
    var user = req.user;
    UserController.removeAdminById(id, user, defaultResponse(req, res));
  });


  // ---------------------------------------------
  // LIVE : This is the tracking functions used in stats
  // ---------------------------------------------


router.get("/users/:id/gotmeal1", function(req, res) {
  var id = req.params.id;
  var user = req.user;
  UserController.gotmeal1( id, user, () => {
      res.send(JSON.stringify({ message: "Recorded in succesfuly" }));
    },
    err => {
      res.send(JSON.stringify({ error: err }));
    }
  );
});






  // ---------------------------------------------
  // Settings [ADMIN ONLY!]
  // ---------------------------------------------

  /**
   * Get the public settings.
   * res: {
   *   timeOpen: Number,
   *   timeClose: Number,
   *   timeToConfirm: Number,
   *   acceptanceText: String,
   *   confirmationText: String,
   *   allowMinors: Boolean
   * }
   */
  router.get("/settings", function(req, res) {
    SettingsController.getPublicSettings(defaultResponse(req, res));
  });

  /**
   * Update the acceptance text.
   * body: {
   *   text: String
   * }
   */
  router.put("/settings/waitlist", isAdmin, function(req, res) {
    var text = req.body.text;
    SettingsController.updateField(
      "waitlistText",
      text,
      defaultResponse(req, res)
    );
  });

  /**
   * Update the acceptance text.
   * body: {
   *   text: String
   * }
   */
  router.put("/settings/acceptance", isAdmin, function(req, res) {
    var text = req.body.text;
    SettingsController.updateField(
      "acceptanceText",
      text,
      defaultResponse(req, res)
    );
  });

  /**
   * Update the Host School.
   * body: {
   *   text: String
   * }
   */
  router.put("/settings/hostSchool", isAdmin, function(req, res) {
    var hostSchool = req.body.hostSchool;
    SettingsController.updateField(
      "hostSchool",
      hostSchool,
      defaultResponse(req, res)
    );
  });

  /**
   * Update the confirmation text.
   * body: {
   *   text: String
   * }
   */
  router.put("/settings/confirmation", isAdmin, function(req, res) {
    var text = req.body.text;
    SettingsController.updateField(
      "confirmationText",
      text,
      defaultResponse(req, res)
    );
  });

  /**
   * Update the confirmation date.
   * body: {
   *   time: Number
   * }
   */
  router.put("/settings/confirm-by", isAdmin, function(req, res) {
    var time = req.body.time;
    SettingsController.updateField(
      "timeConfirm",
      time,
      defaultResponse(req, res)
    );
  });

  /**
   * Set the registration open and close times.
   * body : {
   *   timeOpen: Number,
   *   timeClose: Number
   * }
   */
  router.put("/settings/times", isAdmin, function(req, res) {
    var open = req.body.timeOpen;
    var close = req.body.timeClose;
    SettingsController.updateRegistrationTimes(
      open,
      close,
      defaultResponse(req, res)
    );
  });

  /**
   * Get the whitelisted emails.
   *
   * res: {
   *   emails: [String]
   * }
   */
  router.get("/settings/whitelist", isAdmin, function(req, res) {
    SettingsController.getWhitelistedEmails(defaultResponse(req, res));
  });

  /**
   * [ADMIN ONLY]
   * {
   *   emails: [String]
   * }
   * res: Settings
   *
   */
  router.put("/settings/whitelist", isAdmin, function(req, res) {
    var emails = req.body.emails;
    SettingsController.updateWhitelistedEmails(
      emails,
      defaultResponse(req, res)
    );
  });

  /**
   * [ADMIN ONLY]
   * {
   *   allowMinors: Boolean
   * }
   * res: Settings
   *
   */
  router.put("/settings/minors", isAdmin, function(req, res) {
    var allowMinors = req.body.allowMinors;
    SettingsController.updateField(
      "allowMinors",
      allowMinors,
      defaultResponse(req, res)
    );
  });



  // ---------------------------------------------
  // Challenges 
  // ---------------------------------------------

  /**
   * [OWNER/ADMIN]
   *
   * PUT - Update a specific Challenge information.
   */
  router.put("/challenges/:id/update", isAdmin, function(req, res) {
    var cData = req.body.cData;
    var id = req.params.id;

    UserController.updateById(id, cData, defaultResponse(req, res));
  });


  /**
   * Remove Challenge. ADMIN ONLY
   */
  router.post("/challenges/:id/remove", isAdmin, function(req, res) {
    var id = req.params.id;
    ChallengeController.removeById(id, defaultResponse(req, res));
  });


  /**
   * Add new Challenge. ADMIN ONLY
   */

  router.post('/challenges/create', isAdmin, function(req, res, next){
    // Register with an email and password
    var cData = req.body.cData;

    ChallengeController.createChallenge(cData,
      function(err, user){
        if (err){
          return res.status(400).send(err);
        }
        return res.json(user);
    });
  });

  /**
   * GET - Get a specific Challenge.
   */
  router.get("/challenges/:id", function(req, res) {
    ChallengeController.getById(req.params.id, defaultResponse(req, res));
  });

  /**
   * GET - Get all Challenges.
   */

  router.get("/challenges", isAdmin, function(req, res) {
    ChallengeController.getAll(defaultResponse(req, res));
  });




};
