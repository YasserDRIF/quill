const angular = require("angular");
const swal = require("sweetalert");

angular.module('reg')
  .controller('MarketCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$http',
    'Session',
    'UserService',
    'MarketingService',
    function($scope, $rootScope, $state, $http, Session, UserService, MarketingService) {


      // Populate the school dropdown
      populateSchools();
      _setupForm();

      populateWilayas();

      function populateSchools(){

        $http
          .get('/assets/schools.csv')
          .then(function(res){
            $scope.schools = res.data.split('\n');
            $scope.schools.push('Other');

            var content = [];

            for(i = 0; i < $scope.schools.length; i++) {
              $scope.schools[i] = $scope.schools[i].trim();
              content.push({title: $scope.schools[i]})
            }

            $('#school.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function(result, response) {
                  $scope.user.profile.school = result.title.trim();
                }
              })
          });
      }
    

      function populateWilayas(){
        $http
          .get('/assets/wilayas.csv')
          .then(function(res){
            $scope.wilayas = res.data.split('\n');
            $scope.wilayas.push('Other');

            var content = [];

            for(i = 0; i < $scope.wilayas.length; i++) {
              $scope.wilayas[i] = $scope.wilayas[i].trim();
              content.push({title: $scope.wilayas[i]})
            }

            $('#wilaya.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function(result, response) {
                  $scope.user.profile.wilaya = result.title.trim();
                  console.log ($scope.user.profile.wilaya)
                }
              })
          });
      }



      function _setupForm(){

        // Semantic-UI form validation
        $('.ui.form').form({
          inline: true,
          fields: {
            name: {
              identifier: 'name',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your name.'
                }
              ]
            },
            school: {
              identifier: 'school',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your school name.'
                }
              ]
            },
            wilaya: {
              identifier: 'wilaya',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your wilaya name.'
                }
              ]
            },
            year: {
              identifier: 'year',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select your graduation year.'
                }
              ]
            },
            gender: {
              identifier: 'gender',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select a gender. '
                }
              ]
            },
            howManyHackathons: {
              identifier: 'howManyHackathons',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select how many hackathons you have attended.'
                }
              ]
            },
            adult: {
              identifier: 'adult',
              rules: [
                {
                  type: 'allowMinors',
                  prompt: 'You must be an adult, or an ESI student.'
                }
              ]
            }
          }
        });
      }

      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        } else {
          swal("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };
    }]);
