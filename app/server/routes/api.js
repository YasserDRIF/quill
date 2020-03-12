var UserController = require("../controllers/UserController");
var SettingsController = require("../controllers/SettingsController");
var ChallengeController = require("../controllers/ChallengeController");
var SolvedCTFController = require("../controllers/SolvedCTFController");
var TeamController = require("../controllers/TeamController");
var MarketingController = require("../controllers/MarketingController");

var SolvedCTF = require("../models/SolvedCTF");

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


  function isAdminOrVolunteer(req, res, next){

    var token = getToken(req);

    UserController.getByToken(token, function(err, user){

      if (err) {
        return res.status(500).send(err);
      }

      if (user){
        if(user.admin || user.volunteer){
          req.user = user;
          return next();
        }
      }

      return res.status(401).send({
        message: 'Get outta here, punk!'
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


  // ---------------------------------------------
  // Users
  // ---------------------------------------------

  /**
   * [ADMIN ONLY]
   *
   * GET - Get all users, or a page at a time.
   * ex. Paginate with ?page=0&size=100
   */
  router.get("/users", isAdminOrVolunteer, function(req, res) {
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
  router.get("/users/stats", isAdmin, function(req, res) {
    UserController.getStats(defaultResponse(req, res));
  });

  router.get("/users/teamStats", isAdmin, function(req, res) {
    UserController.getTeamStats(defaultResponse(req, res));
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
  router.get("/users/:id", function(req, res) {
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

  router.post("/users/:id/reject", isAdmin, function(req, res) {
    // Reject the hacker. Admin only
    var id = req.params.id;
    var user = req.user;
    UserController.rejectUser(id, user, defaultResponse(req, res));
  });

  router.post("/users/:id/softAdmit", isAdmin, function(req, res) {
    // Soft Accept the hacker. Admin only
    var id = req.params.id;
    var user = req.user;
    UserController.softAdmitUser(id, user, defaultResponse(req, res));
  });


  router.post("/users/:id/softReject", isAdmin, function(req, res) {
    // Soft Reject the hacker. Admin only
    var id = req.params.id;
    var user = req.user;
    UserController.softRejectUser(id, user, defaultResponse(req, res));
  });


  /**
   * Send basic email
   */
  router.post("/users/:id/sendBasicMail/", isAdmin, function(req, res) {
    var id = req.params.id;
    UserController.sendBasicMail(id, req.body, defaultResponse(req, res));
  });

  /**
   * Check in a user. ADMIN ONLY, DUH
   */
  router.post("/users/:id/checkin", isAdminOrVolunteer, function(req, res) {
    var id = req.params.id;
    var user = req.user;
    UserController.checkInById(id, user, defaultResponse(req, res));
  });


  /*
    Chechin if Admitted, used fro QR Checkin  [Used for mobile app]
  */

  router.get("/users/:id/checkin-qr", function(req, res) {
    var id = req.params.id;
    UserController.checkInByIdAdmitted( id, () => {
        res.send(JSON.stringify({ message: "checked in succesfuly" }));
      },
      err => {
        res.send(JSON.stringify({ error: err }));
      }
    );
  });


  /**
   * Check in a user. ADMIN ONLY, DUH
   */
  router.post("/users/:id/checkout", isAdminOrVolunteer, function(req, res) {
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

  router.get("/meals", function(req, res) {
    UserController.getMealsList(defaultResponse(req, res));
  });


router.get("/users/:id/gotmeal/:mealN", function(req, res) {
  var id = req.params.id;
  var mealN = req.params.mealN;
  UserController.gotmeal( id, mealN, () => { 
      res.send(JSON.stringify({ message: "Recorded in succesfuly" }));
    },
    err => {
      res.status(404).send(JSON.stringify({ error: err }));
    }
  );
});

router.get("/workshops", function(req, res) {
  UserController.getWorkshopsList(defaultResponse(req, res));
});

router.get("/users/:id/workshop/:workshopN", function(req, res) {
  var id = req.params.id;
  var workshopN = req.params.workshopN;
  UserController.workshop( id, workshopN, () => { 
      res.send(JSON.stringify({ message: "Recorded in succesfuly" }));
    },
    err => {
      res.status(404).send(JSON.stringify({ error: err }));
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
   * Update the confirmation date.
   * body: {
   *   time: Number
   * }
   */
  router.put("/settings/timeStart", isAdmin, function(req, res) {
    var time = req.body.time;
    SettingsController.updateField(
      "timeStart",
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
  router.post("/challenges/:id/update", isAdmin, function(req, res) {
    var cData = req.body.cData;
    var id = req.params.id;

    ChallengeController.updateById(id, cData, defaultResponse(req, res));
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
   * GET - Get a specific Challenge with answer [ADMIN ONLY].
   */
  router.get("/challenges/:id/answer", isAdmin, function(req, res) {
    ChallengeController.getByIdAnswer(req.params.id, defaultResponse(req, res));
  });

  /**
   * GET - Get all Challenges.
   */
  router.get("/challenges", function(req, res) {
    ChallengeController.getAll(defaultResponse(req, res));
  });



  /**
   * Mark a challenge as solvedk
   */
  router.post('/CTF/solve', isOwnerOrAdmin, function(req, res){
    var challenge = req.body.challenge;
    var user = req.body.user;
    var answer = req.body.answer;

    ChallengeController.verifyAnswer(challenge._id, answer,
      function(err, C){
        if (err || !C) {
          return res.status(400).send(err);
        }

        SolvedCTFController.isSolved(challenge._id, user.data._id,
          function(err, solution){
            if (err || solution) {
              return res.status(400).send(err);
            } 
            // Marking the challenge solved by user
            SolvedCTFController.solve(challenge, user);

            return res.json({
              challenge: challenge
            });
          });
      });

  });

  
  /**
   * GET - Get all Solved Challenges.
   */
  router.get("/CTF", function(req, res) {
    SolvedCTFController.getAll(defaultResponse(req, res));
  });



  // ---------------------------------------------
  // Teams 
  // ---------------------------------------------




  /**
   * Add new Challenge. ADMIN ONLY
   */

  router.post('/teams/create', function(req, res){
    var teamData = req.body.teamData;

    TeamController.createTeam(teamData,
      function(err, user){
        if (err){
          return res.status(400).send(err);
        }
        return res.json(user);
    });
  });


  /**
   * GET - Get teams (either all of them or selcted with search and filters).
   */
  router.get("/teams", function(req, res) {
    var query = req.query;
    if (query.search) {
      TeamController.getSelectedTeams(query, defaultResponse(req, res));
    } else {
      TeamController.getAll(defaultResponse(req, res));
    }

  });

    /**
   * GET - Get a specific team.
   */
  router.get("/teams/:id", function(req, res) {
    TeamController.getById(req.params.id, defaultResponse(req, res));
  });



  /**
   * PUT - Add a member to a team (Request Join).
   */
  router.post("/teams/:id/updatejoined", function(req, res) {
    var newjoinRequests = req.body.newjoinRequests;
    var id = req.params.id;

    TeamController.updatejoined(id, newjoinRequests, defaultResponse(req, res));
  });


  /**
   * PUT - Accept a member to a team (members).
   */
  router.post("/teams/:id/updateMembers", function(req, res) {
    var newMembers = req.body.newMembers;
    var id = req.params.id;

    TeamController.updateMembers(id, newMembers, defaultResponse(req, res));
  });

  router.post("/teams/sendAcceptedTeam", function(req, res) {
    const id = req.body.id;
    TeamController.sendAcceptedTeamEmail(id, defaultResponse(req, res));
  });


  router.post("/teams/sendRefusedTeam", function(req, res) {
    const id = req.body.id;
    TeamController.SendRefusedTeamEmail(id, defaultResponse(req, res));
  });

  router.post("/teams/sendRemovedTeam", function(req, res) {
    const id = req.body.id;
    TeamController.SendRemovedTeamEmail(id, defaultResponse(req, res));
  });

  router.post("/teams/sendAdminRemovedTeam", function(req, res) {
    const id = req.body.id;
    const member = req.body.member;
    TeamController.SendAdminRemovedTeamEmail(id, member, defaultResponse(req, res));
  });

  /**
   * PUT - Remove team
   */
  router.post("/teams/:id/remove", function(req, res) {
    var id = req.params.id;
    TeamController.removeTeam(id, defaultResponse(req, res));
  });

  /**
   * PUT - Update closed team Statuss
   */
  router.post("/teams/:id/toggleCloseTeam", function(req, res) {
    const id = req.params.id;
    const status = req.body.status;
    TeamController.toggleCloseTeam(id, status, defaultResponse(req, res));
  });

  /**
   * PUT - Update hide team Statuss
   */
  router.post("/teams/:id/toggleHideTeam", function(req, res) {
    const id = req.params.id;
    const status = req.body.status;
    TeamController.toggleHideTeam(id, status, defaultResponse(req, res));
  });





  // ---------------------------------------------
  // Marketing Hackathon Teams 
  // ---------------------------------------------




  /**
   * Add new team. ADMIN ONLY
   */
  router.post('/marketing/createTeam', isAdmin, function(req, res){
    var teamData = req.body.teamData;

    MarketingController.createTeam(teamData,
      function(err, user){
        if (err){
          return res.status(400).send(err);
        }
        return res.json(user);
    });
  });


  /**
   * GET - Get teams
   */
  router.get("/marketing", function(req, res) {
    MarketingController.getAll(defaultResponse(req, res));
  });


  router.post("/marketing/sendInvite", function(req, res) {
    const username = req.body.username;
    const teammate = req.body.teammate;
    MarketingController.sendInvite(username, teammate, defaultResponse(req, res));
  });






};
