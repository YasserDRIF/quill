const angular = require("angular");
const swal = require("sweetalert");

angular.module('reg')
  .controller('MarketDataCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$http',
    'Session',
    'UserService',
    'MarketingService',
    function($scope, $rootScope, $state, $http, Session, UserService, MarketingService) {



          // Meals 
          $scope.meals = { 
            labels : ['Option 1','Option 2','Option 3','Option 4'],
            series : ['Meals'],
            data : [10,17,12,5],
            options : {
              "scales":{
                "xAxes":[{"ticks":{beginAtZero:true}}]
              },
              title: {
                display: true,
                text: 'Question 1'
              }
            }
           }
           
          // Workshops 
          $scope.workshops = { 
            labels : ['Option 1','Option 2','Option 3','Option 4','Option 5','Option 6','Option 7','Option 8'],
            series : ['Workshops'],
            data : [
              [65, 59, 90, 81, 56, 55, 40],
              [28, 48, 40, 19, 96, 27, 100]
            ],
            options:{
              elements: {
                line: {
                  borderWidth: 0.5,                
                },
              },
              title: {
                display: true,
                text: 'Question 2'
              }
            }
           }



           $scope.labels = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
           $scope.series = ['Series A'];
           $scope.data = [
             [65, 40, 62, 60, 56, 78, 90],
           ];
           $scope.onClick = function (points, evt) {
             console.log(points, evt);
           };
           $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
           $scope.options = {
             scales: {
               yAxes: [
                 {
                   id: 'y-axis-1',
                   type: 'linear',
                   display: true,
                   position: 'left'
                 },
               ]
             },
             title: {
               display: true,
               text: 'Taux de reponse par jour'
             }
           };
         



      _setupForm();



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
