'use strict';

// Declare app level module which depends on views, and components
angular.module('Measure', [
  'ngRoute',
  'gettext',
  'Measure.Measure',
  'Measure.MeasurementLab',
  'Measure.GaugeService'
])

.value('ndtServer', {})

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/measure'});
}])

.run(function (gettextCatalog) {
  var availableLanguages = ['en'];

  availableLanguages = availableLanguages.concat(Object.keys(gettextCatalog.strings));
  gettextCatalog.setCurrentLanguage('nl');
})

.run(function (MLabService, ndtServer, $rootScope) {

  MLabService.findServer().then(
    function(foundServer) {
      ndtServer.fqdn = foundServer.fqdn;
      ndtServer.city = foundServer.city;
      ndtServer.country = foundServer.country;
      $rootScope.$emit('updatedServer');
    },
    function(failureNotification) {console.log(failureNotification)}
  );


});
