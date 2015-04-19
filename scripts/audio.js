/* jshint devel:true */
'use strict';

angular.module('app', ['audioDrct'])

  .run(function($rootScope, $timeout) {
    $timeout(function() {
      $rootScope.$broadcast('audio.set', 'data/track.mp3');
    }, 1000);
  });
