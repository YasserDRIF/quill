var path = require("path");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var templatesDir = path.join(__dirname, "../templates");
var Email = require("email-templates");

var ROOT_URL = process.env.ROOT_URL;

var HACKATHON_NAME = process.env.HACKATHON_NAME;
var EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
var TWITTER_HANDLE = process.env.TWITTER_HANDLE;
var FACEBOOK_HANDLE = process.env.FACEBOOK_HANDLE;

var EMAIL_HOST = process.env.EMAIL_HOST;
var EMAIL_USER = process.env.EMAIL_USER;
var EMAIL_PASS = process.env.EMAIL_PASS;
var EMAIL_PORT = process.env.EMAIL_PORT;
var EMAIL_CONTACT = process.env.EMAIL_CONTACT;
var EMAIL_HEADER_IMAGE = process.env.EMAIL_HEADER_IMAGE;
if (EMAIL_HEADER_IMAGE.indexOf("https") == -1) {
  EMAIL_HEADER_IMAGE = ROOT_URL + EMAIL_HEADER_IMAGE;
}

var NODE_ENV = process.env.NODE_ENV;

var options = {
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
};

var transporter = nodemailer.createTransport(smtpTransport(options));

var controller = {};

controller.transporter = transporter;

function sendOne(templateName, options, data, callback) {
  if (NODE_ENV === "dev") {
    console.log(templateName);
    console.log(JSON.stringify(data, "", 2));
  }

  const email = new Email({
    message: {
      from: EMAIL_ADDRESS
    },
    send: true,
    transport: transporter
  });

  data.emailHeaderImage = EMAIL_HEADER_IMAGE;
  data.emailAddress = EMAIL_ADDRESS;
  data.hackathonName = HACKATHON_NAME;
  data.twitterHandle = TWITTER_HANDLE;
  data.facebookHandle = FACEBOOK_HANDLE;

  email
    .send({
      locals: data,
      message: {
        subject: options.subject,
        to: options.to
      },
      template: path.join(__dirname, "..", "emails", templateName)
    })
    .then(res => {
      if (callback) {
        callback(undefined, res);
      }
    })
    .catch(err => {
      if (callback) {
        callback(err, undefined);
      }
    });
}

/**
 * Send a verification email to a user, with a verification token to enter.
 * @param  {[type]}   email    [description]
 * @param  {[type]}   token    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
controller.sendVerificationEmail = function(email, token, callback) {
  var options = {
    to: email,
    subject: "[" + HACKATHON_NAME + "] - Verify your email"
  };

  var locals = {
    verifyUrl: ROOT_URL + "/verify/" + token
  };

  /**
   * Eamil-verify takes a few template values:
   * {
   *   verifyUrl: the url that the user must visit to verify their account
   * }
   */
  sendOne("email-verify", options, locals, function(err, info) {
    if (err) {
      console.log(err);
    }
    if (info) {
      console.log(info.message);
    }
    if (callback) {
      callback(err, info);
    }
  });
};

/**
 * Send a password recovery email.
 * @param  {[type]}   email    [description]
 * @param  {[type]}   token    [description]
 * @param  {Function} callback [description]
 */
controller.sendPasswordResetEmail = function(email, token, callback) {
  var options = {
    to: email,
    subject: "[" + HACKATHON_NAME + "] - Password reset requested!"
  };

  var locals = {
    title: "Password Reset Request",
    subtitle: "",
    description:
      "Somebody (hopefully you!) has requested that your password be reset. If " +
      "this was not you, feel free to disregard this email. This link will expire in one hour.",
    actionUrl: ROOT_URL + "/reset/" + token,
    actionName: "Reset Password"
  };

  /**
   * Eamil-verify takes a few template values:
   * {
   *   verifyUrl: the url that the user must visit to verify their account
   * }
   */
  sendOne("email-link-action", options, locals, function(err, info) {
    if (err) {
      console.log(err);
    }
    if (info) {
      console.log(info.message);
    }
    if (callback) {
      callback(err, info);
    }
  });
};

controller.sendApplicationEmail = function(user, callback) {
  var options = {
    to: user.email,
    subject: "[" + HACKATHON_NAME + "] - We have received your application!"
  };

  var locals = {
    name: user.profile.name,
    url: ROOT_URL
  };

  sendOne("email-application", options, locals, function(err, info) {
    if (err) {
      console.log(err);
    }
    if (info) {
      console.log(info.message);
    }
    if (callback) {
      callback(err, info);
    }
  });
};

controller.sendConfirmationEmail = function(user, callback) {
  var options = {
    to: user.email,
    subject: "[" + HACKATHON_NAME + "] - You are confirmed!"
  };

  var locals = {
    name: user.profile.name,
    url: ROOT_URL,
    userId: user.id,
    qr: "https://api.qrserver.com/v1/create-qr-code/?size=350x350&margin=20&data="+user.id

  };

  sendOne("email-confirmation", options, locals, function(err, info) {
    if (err) {
      console.log(err);
    }
    if (info) {
      console.log(info.message);
    }
    if (callback) {
      callback(err, info);
    }
  });
};

/*
 * Send a status update email for admittance.
 * @param  {[type]}   email    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
controller.sendAdmittanceEmail = function(user, callback) {
  var options = {
    to: user.email,
    subject: "[" + HACKATHON_NAME + "] - You have been admitted!"
  };
  var locals = {
    name: user.profile.name,
    url: ROOT_URL,
    qr: "https://api.qrserver.com/v1/create-qr-code/?size=350x350&margin=20&data="+user.id
  };

  sendOne("email-qr", options, locals, function(err, info) {
    if (err) {
      console.log(err);
    }
    if (info) {
      console.log(info.message);
    }
    if (callback) {
      callback(err, info);
    }
  });
};



/*
 * Send a status update email for admittance.
 * @param  {[type]}   email    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
controller.sendRejectionEmail = function(user, callback) {
  var options = {
    to: user.email,
    subject: "[" + HACKATHON_NAME + "] - Got rejected ! Congratulations."
  };
  var locals = {
    name: user.profile.name,
  };

  sendOne("email-reject", options, locals, function(err, info) {
    if (err) {
      console.log(err);
    }
    if (info) {
      console.log(info.message);
    }
    if (callback) {
      callback(err, info);
    }
  });
};


/**
 * Send a password recovery email.
 * @param  {[type]}   email    [description]
 * @param  {Function} callback [description]
 */
controller.sendPasswordChangedEmail = function(email, callback) {
  var options = {
    to: email,
    subject: "[" + HACKATHON_NAME + "] - Your password has been changed!"
  };
  
  var locals = {
    title: "Password Updated",
    body: "Somebody (hopefully you!) has successfully changed your password."
  };

  /**
   * Eamil-verify takes a few template values:
   * {
   *   verifyUrl: the url that the user must visit to verify their account
   * }
   */
  sendOne("email-basic", options, locals, function(err, info) {
    if (err) {
      console.log(err);
    }
    if (info) {
      console.log(info.message);
    }
    if (callback) {
      callback(err, info);
    }
  });
};

controller.sendBasicMail = function(id, email, callback) {
  var options = {
    to: id,
    subject: "[" + HACKATHON_NAME + "] - " + email.subject
  };
  
  var locals = {
    title: email.title,
    body: email.body,
  };

  /**
   * Eamil-verify takes a few template values:
   * {
   *   verifyUrl: the url that the user must visit to verify their account
   * }
   */
  sendOne("email-basic", options, locals, function(err, info) {
    if (err) {
      console.log(err);
    }
    if (info) {
      console.log(info.message);
    }
    if (callback) {
      callback(err, info);
    }
  });
};



controller.acceptedToTeam = function(user, callback) {
  var options = {
    to: user.email,
    subject: "[" + HACKATHON_NAME + "] - You have been accepted to join a team you applied for!"
  };
  var locals = {
    name: user.profile.name,
    url: ROOT_URL+"/team"
  };
  sendOne("email-team-accept", options, locals, function(err, info) {
    if (err) {
      console.log(err);
    }
    if (info) {
      console.log(info.message);
    }
    if (callback) {
      callback(err, info);
    }
  });
};


controller.refusedfromTeam = function(user, callback) {
  var options = {
    to: user.email,
    subject: "[" + HACKATHON_NAME + "] - You have been refused from one of the teams you applied for!"
  };
  var locals = {
    name: user.profile.name,
    url: ROOT_URL+"/team"
  };
  sendOne("email-team-refuse", options, locals, function(err, info) {
    if (err) {
      console.log(err);
    }
    if (info) {
      console.log(info.message);
    }
    if (callback) {
      callback(err, info);
    }
  });
};


controller.removedfromTeam = function(user, callback) {
  var options = {
    to: user.email,
    subject: "[" + HACKATHON_NAME + "] - You have been removed from a team you were part of!"
  };
  var locals = {
    name: user.profile.name,
    url: ROOT_URL+"/team"
  };
  sendOne("email-team-remove", options, locals, function(err, info) {
    if (err) {
      console.log(err);
    }
    if (info) {
      console.log(info.message);
    }
    if (callback) {
      callback(err, info);
    }
  });
};



controller.memberLeftTeam = function(user, member, callback) {
  var options = {
    to: user.email,
    subject: "[" + HACKATHON_NAME + "] - A member of your team has left!"
  };
  var locals = {
    member: member,
    name: user.profile.name,
    url: ROOT_URL+"/team"
  };
  sendOne("email-team-left", options, locals, function(err, info) {
    if (err) {
      console.log(err);
    }
    if (info) {
      console.log(info.message);
    }
    if (callback) {
      callback(err, info);
    }
  });
};


controller.sendTeammateInvite = function(username, teammate, callback) {
  var options = {
    to: teammate.email,
    subject: "[" + HACKATHON_NAME + "] - Team up with " + username 
  };
  var locals = {
    user: username,
    event: teammate.event,
    url: ROOT_URL
  };
  sendOne("email-Temamate-Ad", options, locals, function(err, info) {
    if (err) {
      console.log(err);
    }
    if (info) {
      console.log(info.message);
    }
    if (callback) {
      callback(err, info);
    }
  });
};


module.exports = controller;
