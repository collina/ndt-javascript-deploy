'use strict';

angular.module('Measure.Measure', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/measure', {
    templateUrl: 'measure/measure.html',
    controller: 'MeasureCtrl'
  });
}])

.controller('MeasureCtrl', function($scope, $rootScope, $interval, ndtServer, ProgressGauge) {

  var ndtSemaphore = false;

  if (!Modernizr.websockets) {
    $scope.unsupportedSystem = true;
    return;
  }

  useWebsocketAsBackend();
  $scope.measurementComplete = false;

  $rootScope.$on('updatedServer', function() {
    $scope.location = ndtServer.city + ", " + ndtServer.country;
    $scope.address = ndtServer.fqdn;
  });

  ProgressGauge.reset();
  $scope.currentPhase = '';
  $scope.currentSpeed = '';

  $scope.startTest = function () {
    var timeStarted,
        timeRunning,
        timeProgress,
        intervalPromise,
        TIME_EXPECTED = 20 * 1000;
    if (ndtSemaphore == true) {
      return;
    }
    ndtSemaphore = true;
    $scope.startButtonClass = 'disabled';
    $scope.measurementComplete = false;

    startTest(ndtServer.fqdn);

    intervalPromise = $interval(function() {
      var downloadSpeedVal = downloadSpeed();
      var uploadSpeedVal = uploadSpeed(false);

      if (currentPhase > 2) {
        if (timeStarted === undefined && currentPhase != undefined) {
          timeStarted = new Date().getTime();
        }
        timeRunning = new Date().getTime() - timeStarted;
        timeProgress = timeRunning / TIME_EXPECTED;
        ProgressGauge.progress(timeProgress, false);
      }

      if (currentPhase == PHASE_UPLOAD) {
        $scope.currentPhase = 'Upload';
        $scope.currentSpeed = uploadSpeedVal ? getJustfiedSpeed(uploadSpeedVal) + ' ' + getSpeedUnit(uploadSpeedVal) : 'Initializing';
      } else if (currentPhase == PHASE_DOWNLOAD) {
        $scope.currentPhase = 'Download';
        $scope.currentSpeed = downloadSpeedVal ? getJustfiedSpeed(downloadSpeedVal) + ' ' + getSpeedUnit(downloadSpeedVal) : 'Initializing';
      } else if (currentPhase == PHASE_RESULTS) {
        $scope.currentPhase = 'Complete';
        $scope.currentSpeed = '';
        $scope.measurementComplete = true;
        $scope.measurementResult = {
          's2cRate': downloadSpeed().toFixed(2) + ' ' + getSpeedUnit(downloadSpeed()),
          'c2sRate': uploadSpeed().toFixed(2) + ' ' + getSpeedUnit(uploadSpeed()),
          'latency': readNDTvar('MinRTT') + ' ms',
          'loss': String((readNDTvar('loss') * 100).toFixed(2)) + "%"
        };
        ndtSemaphore = false;
        $scope.startButtonClass = '';

        $interval.cancel(intervalPromise);
      }

    }, 100);
  }
});
