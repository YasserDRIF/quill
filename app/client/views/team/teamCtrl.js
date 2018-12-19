/**
 * 
 * TODO: TEAMs
 * 
 *
 * 
 * 
 */

angular.module('reg')
  .controller('TeamCtrl', [
    '$scope',
    'currentUser',
    'settings',
    'Utils',
    'UserService',
    'TeamService',
    'TEAM',
    function($scope, currentUser, settings, Utils, UserService, TeamService, TEAM){
      // Get the current user's most recent data.
      var Settings = settings.data;

      $scope.regIsOpen = Utils.isRegOpen(Settings);

      $scope.user = currentUser.data;
      console.log(currentUser.data);


      TeamService.getAll().then(response => {
        console.log(response.data)
        $scope.teams = response.data;
      });



      $scope.createTeam = function() {

        teamData = {
          description:"hellooo, you are excited and creative and you love money, Blockchains and so !) . join us and to create our own project to contribute in the development of our country.",
          members: [{id:currentUser.data._id, name:currentUser.data.profile.name, skill:"code"}],
          skills: {code:true,design:true,hardware:false,idea:false},
          isColosed: false,
        }
        TeamService.create(teamData).then(response => {});
      };



    }]);
