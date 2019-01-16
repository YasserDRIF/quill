const angular = require('angular');

angular.module('reg')
  .service('settings', function() {})
  .controller('BaserCtrl', [
    '$scope',
    'EVENT_INFO',
    function($scope, EVENT_INFO){

      $scope.EVENT_INFO = EVENT_INFO.NAME;

    }]);
