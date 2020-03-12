

angular.module('reg')
  .controller('TeamCtrl', [
    '$scope',
    '$state',
    '$timeout',
    'currentUser',
    'settings',
    'Utils',
    'UserService',
    'TeamService',
    'TEAM',
    function($scope, $state, $timeout, currentUser, settings, Utils, UserService, TeamService, TEAM){
      // Get the current user's most recent data.
      var Settings = settings.data;
      
      $scope.regIsOpen = Utils.isRegOpen(Settings);

      $scope.user = currentUser.data;

      function isTeamMember(teams,Userid) {
        var test = false;
        teams.forEach(team => {
          team.members.forEach(member => {            
            if (member.id==Userid) test = true;
          });
        });        
        return test;
      }

      
      $scope.isjoined = function(team){
        var test = false;
        team.joinRequests.forEach(member =>{
          if(member.id==currentUser.data._id)test = true;
        })
        return test;
      }
      
      TeamService.getAll().then(teams => {
        $scope.isTeamAdmin=false;
        $scope.isTeamMember=false;
        teams.data.forEach(team => {
          team.isMaxteam = false;

          if (team.members.length>=Settings.maxTeamSize){
            team.isColosed = true;
            team.isMaxteam = true;
          }

          if(team.members[0].id==currentUser.data._id){
            team.joinRequests.forEach(member => {                            
              if (isTeamMember(teams.data,member.id)){
                member.unavailable=true;
              }else{member.unavailable=false}
            });
            $scope.userAdminTeam = team;
            $scope.isTeamAdmin=true;
          }else{
            team.members.forEach(member =>{
              if(member.id==currentUser.data._id){
                $scope.userMemberTeam = team;
                $scope.isTeamMember=true;
              }
            })
          }
        })
        $scope.teams = teams.data;

      });


      $scope.createTeam = function() {

        teamData = {
          description: $scope.newTeam_description,
          members: [{id:currentUser.data._id, name:currentUser.data.profile.name, skill: $scope.newTeam_Adminskill}],
          skills: {code: $scope.skillcode,design: $scope.skilldesign,hardware: $scope.skillhardware,idea: $scope.skillidea},
          isColosed: false,
        }
        console.log(teamData);
        console.log($scope.newTeam_Adminskill);
        
        TeamService.create(teamData);
        $state.reload();
      };


      $scope.ShowcreateTeam = function(){
        $scope.ShowNewTeamFrom = true;  
        $scope.skillcode =true
        $scope.skilldesign =true
        $scope.skillhardware =true
        $scope.skillidea =true
        $scope.newTeam_Adminskill="code"
      }


      $scope.joinTeam = function (team) {

        var value;
         const select = document.createElement('select');
         select.className = 'select-custom'


         var option = document.createElement('option');
         option.disabled = true;
         option.innerHTML = 'Select a skill';
         option.value = "code"
         select.appendChild(option);


         if(team.skills.code){
           option = document.createElement('option');
           option.innerHTML = 'Code';
           option.value = "code"
           select.appendChild(option);
         }
         if(team.skills.design){
          option = document.createElement('option');
          option.innerHTML = 'Design';
          option.value = "design"
          select.appendChild(option);
         }
         if(team.skills.hardware){
          option = document.createElement('option');
          option.innerHTML = 'Hardware';
          option.value = "hardware"
          select.appendChild(option);
         }
         if(team.skills.idea){
          option = document.createElement('option');
          option.innerHTML = 'Idea';
          option.value = "idea"
          select.appendChild(option);
         }
        
        select.onchange = function selectChanged(e) {
          value = e.target.value
        }
        
        swal({
          title: "Please select your skill to join",

          content: {
            element: select,
          }
        }).then(function() {

          newuser= {id:currentUser.data._id, name:currentUser.data.profile.name, skill:value};
          TeamService.join(team._id,newuser); 
          swal(
            "Joined",
            "You have appliced to join this team, wait for the Team-Admin to accept your application.",
            "success"
          );  
          $state.reload();
        })        
      }


      $scope.acceptMember = function(teamID, member, index) {

        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to accept " + member.name + " to your team! This will send him a notification email and will show in the public teams page.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, let him in",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.acceptMember(teamID,member,Settings.maxTeamSize).then(response => {
            if (response=="maxTeamSize"){
              swal(
                "Error",
                "Maximum number of members ("+Settings.maxTeamSize+") reached",
                "error"
              );
            }else {
              TeamService.removejoin(teamID,index,false).then(response2 => {
                swal(
                  "Accepted",
                  member.name + " has been accepted to your team.",
                  "success"
                );
                $state.reload();
              });    
            }
          });
        });      
      }



      $scope.refuseMember = function(teamID, member, index) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to refuse " + member.name + " from your team! This will send him a notification email.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, refuse him",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.removejoin(teamID,index,member).then(response => {
            swal(
              "Refused",
              member.name + " has been refused from your team.",
              "success"
            );
            $state.reload();
          });
        });      
      }


      $scope.removeMemberfromTeam = function(teamID, member, index) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to remove " + member.name + " from your team! This will send him a notification email.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove him",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.removemember(teamID,index,member.id).then(response => {
            if (response=="removingAdmin"){
              swal(
                "Error",
                "You can't remove the Team Admin, But you can close the team.",
                "error"
              );
            }else {
              TeamService.removejoin(teamID,index,false).then(response2 => {
                swal(
                  "Removed",
                  member.name + " has been removed from your team.",
                  "success"
                );    
                $state.reload();
              });    
            }
          });
        });      
      }



      $scope.removeTeam = function(team) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to remove this team with all it's members! This will send them a notification email. You need to find another team to work with.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove team",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }

          email = { 
            subject:"Your team has been removed", 
            title:"Time for a backup plan",
            body:"The team you have been part (Member/requested to join) of has been removed. Please check your dashboard and try to find another team to work with before the hackathon starts." 
          }

          TeamService.remove(team._id).then(response => {
            team.members.forEach(user => {
              UserService.sendBasicMail(user.id,email);
            });
            team.joinRequests.forEach(user => {
              UserService.sendBasicMail(user.id,email);
            });

            swal(
              "Removed",
              "Team has been removed.",
              "success"
            );
            $state.reload();
          });
        });      
      }


      $scope.leaveTeam = function(team) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to leave your team! This will send the admin a notification email.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove him",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          var index=0;
          team.members.forEach(member => {
            if (member.id==currentUser.data._id) {
              TeamService.removemember(team._id,index).then(response => {
                swal(
                  "Removed",
                  "You have successfully left this team. Please find another team or create your own.",
                  "success"
                );
                $state.reload();
              });
    
            }
            index++;
          })
        });      
      }


      $scope.canceljoinTeam = function(team) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to cancel your request to join this team!",
          icon: "warning",
          buttons: {
            cancel: {
              text: "No",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, Cancel",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          var index=0;
          
          team.joinRequests.forEach(member => {
            if (member.id==currentUser.data._id) {
              TeamService.removejoin(team._id,index,false).then(response => {
                swal(
                  "Removed",
                  "You have successfully canceled you request to join this team. Please find another team or create your own.",
                  "success"
                );
                $state.reload();
              });
    
            }
            index++;
          })
        });      
      }


      $scope.toggleCloseTeam = function(teamID,status) {
        if (status==true){text="You are about to Close this team. This won't allow other members to join your team!"
        }else{text="You are about to reopen this team. This will allow other members to join your team!"}

        swal({
          title: "Whoa, wait a minute!",
          text: text,
          icon: "warning",
          buttons: {
            cancel: {
              text: "No",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.toggleCloseTeam(teamID,status).then(response => {
            swal(
              "Done",
              "Operation successfully Completed.",
              "success"
            );
            $state.reload();
          });
        });      
      }



      $scope.toggleHideTeam = function(teamID,status) {
        if (status==true){text="You are about to Hide this team. This won't allow other members to see your team!"
        }else{text="You are about to Show this team. This will allow other members to see your team!"}

        swal({
          title: "Whoa, wait a minute!",
          text: text,
          icon: "warning",
          buttons: {
            cancel: {
              text: "No",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.toggleHideTeam(teamID,status).then(response => {
            swal(
              "Done",
              "Operation successfully Completed.",
              "success"
            );
            $state.reload();
          });
        });      
      }

      $scope.$watch("queryText", function(queryText) {
        TeamService.getSelectedTeams(queryText, $scope.skillsFilters).then(
          response => {            
            $scope.teams = response.data.teams;
          }
        );
      });
  
      $scope.applyskillsFilter = function () {
        TeamService.getSelectedTeams($scope.queryText, $scope.skillsFilters).then(
          response => {            
            $scope.teams = response.data.teams;
          }
        );
      };
  




    }]);
