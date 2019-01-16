var _ = require('underscore');
var async = require('async');
var User = require('../models/User');
var Settings = require("../models/Settings");

// In memory stats.
var stats = {};

function calculateStats(){
  console.log('Calculating stats...');
  var newStats = {
    lastUpdated: 0,

    total: 0,
    demo: {
      gender: {
        M: 0,
        F: 0,
        O: 0,
        N: 0
      },
      schools: {},
      year: {
        '2019': 0,
        '2020': 0,
        '2021': 0,
        '2022': 0,
        '2023': 0,
      },
      howManyHackathons: {
        '0': 0,
        '1': 0,
        '2': 0,
        '4': 0,
        '7': 0,
      }
    },

    live: {
      meal: {
        M: 0,
        F: 0,
        O: 0,
        N: 0
      },
      meal: [],
      workshop: [],
    },

    teams: {},
    verified: 0,
    submitted: 0,
    softAdmitted: 0,
    admitted: 0,
    confirmed: 0,
    confirmedHostSchool: 0,
    hostSchool: "",
    declined: 0,
    rejected: 0,

    confirmedFemale: 0,
    confirmedMale: 0,
    confirmedOther: 0,
    confirmedNone: 0,

    shirtSizes: {
      'XS': 0,
      'S': 0,
      'M': 0,
      'L': 0,
      'XL': 0,
      'XXL': 0,
      'WXS': 0,
      'WS': 0,
      'WM': 0,
      'WL': 0,
      'WXL': 0,
      'WXXL': 0,
      'None': 0
    },

    wantsHardware: 0,

    checkedIn: 0
  };

  Settings.getHostSchool(function(err, School) {
    if (err) {
      callback(err);
    } else {
      newStats.hostSchool = School;
    }
  });

  User
    .find({})
    .exec(function(err, users){
      if (err || !users){
        throw err;
      }

      newStats.total = users.length;

      async.each(users, function(user, callback){

        // Grab the email extension
        var email = user.email.split('@')[1];

        // Add to the gender
        newStats.demo.gender[user.profile.gender] += 1;

        // Count verified
        newStats.verified += user.verified ? 1 : 0;

        // Count submitted
        newStats.submitted += user.status.completedProfile ? 1 : 0;

        // Count softAccepted
        newStats.softAdmitted += user.status.softAdmitted ? 1 : 0;

        // Count accepted
        newStats.admitted += user.status.admitted ? 1 : 0;

        // Count confirmed
        newStats.confirmed += user.status.confirmed ? 1 : 0;

        // Count confirmed that are mit (ESI)

        newStats.confirmedHostSchool +=
          user.status.confirmed && email === newStats.hostSchool ? 1 : 

        newStats.confirmedFemale += user.status.confirmed && user.profile.gender == "F" ? 1 : 0;
        newStats.confirmedMale += user.status.confirmed && user.profile.gender == "M" ? 1 : 0;
        newStats.confirmedOther += user.status.confirmed && user.profile.gender == "O" ? 1 : 0;
        newStats.confirmedNone += user.status.confirmed && user.profile.gender == "N" ? 1 : 0;

        // Count declined
        newStats.declined += user.status.declined ? 1 : 0;

        // Count the number of people who need reimbursements
        newStats.reimbursementTotal += user.confirmation.needsReimbursement ? 1 : 0;

        // Count the number of people who still need to be reimbursed
        newStats.reimbursementMissing += user.confirmation.needsReimbursement &&
          !user.status.reimbursementGiven ? 1 : 0;

        // Count the number of people who want hardware
        newStats.wantsHardware += user.confirmation.wantsHardware ? 1 : 0;

        // Count schools
        if (!newStats.demo.schools[email]){
          newStats.demo.schools[email] = {
            submitted: 0,
            admitted: 0,
            confirmed: 0,
            declined: 0,
          };
        }
        newStats.demo.schools[email].submitted += user.status.completedProfile ? 1 : 0;
        newStats.demo.schools[email].admitted += user.status.admitted ? 1 : 0;
        newStats.demo.schools[email].confirmed += user.status.confirmed ? 1 : 0;
        newStats.demo.schools[email].declined += user.status.declined ? 1 : 0;

        // Count graduation years
        if (user.profile.graduationYear){
          newStats.demo.year[user.profile.graduationYear] += 1; 
        }


        // Count Meals & workshops

        for (let i = 0; i < user.live.meal.length; i++) {
          if (!newStats.live.meal[i]) {newStats.live.meal[i]=0;}
          if (user.live.meal[i]){ newStats.live.meal[i] += 1; }
        }

        for (let i = 0; i < user.live.workshop.length; i++) {
          if (!newStats.live.workshop[i]) {newStats.live.workshop[i]=0;}

          if (user.live.workshop[i]){ newStats.live.workshop[i] += 1; }
        }
        
        // Count Hackathon participations
        if (user.profile.howManyHackathons){
          newStats.demo.howManyHackathons[user.profile.howManyHackathons] += 1;
        }

        // Count shirt sizes
        if (user.confirmation.shirtSize in newStats.shirtSizes){
          newStats.shirtSizes[user.confirmation.shirtSize] += 1;
        }


        // Count checked in
        newStats.checkedIn += user.status.checkedIn ? 1 : 0;

        callback(); // let async know we've finished
      }, function() {

        // Transform schools into an array of objects
        var schools = [];
        _.keys(newStats.demo.schools)
          .forEach(function(key){
            schools.push({
              email: key,
              count: newStats.demo.schools[key].submitted,
              stats: newStats.demo.schools[key]
            });
          });
        newStats.demo.schools = schools;

        // Likewise, transform the teams into an array of objects
        // var teams = [];
        // _.keys(newStats.teams)
        //   .forEach(function(key){
        //     teams.push({
        //       name: key,
        //       users: newStats.teams[key]
        //     });
        //   });
        // newStats.teams = teams;

        console.log('Stats updated!');
        newStats.lastUpdated = new Date();
        stats = newStats;
      });
    });    
}



// Calculate once every five minutes.
calculateStats();
setInterval(calculateStats, 300000);

var Stats={}

Stats.getUserStats = function(){
  return stats;
};

module.exports = Stats;
