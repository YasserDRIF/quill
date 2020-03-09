angular
  .module('demoApp')
  .controller("DemoCtrl", DemoCtrl);

function DemoCtrl($scope) {
  $scope.start = function() {
      $scope.cameraRequested = true;
  }

  $scope.processURLfromQR = function (url) {
    $scope.url = url;
    $scope.cameraRequested = false;
  }
}
