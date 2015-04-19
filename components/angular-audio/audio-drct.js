/*global angular, Audio */
'use strict';

angular.module('audioDrct', [])
  .directive('angularAudio', function($rootScope) {
    return {
      restrict: 'E',
      scope: {},
      controller: function($scope) {

        $scope.audio = new Audio();
        $scope.getupdate = false;
        $scope.controls = {
          paused: true,
          muted: false,
          duration: 0,
          currentTime: 0,
          set: function() {
            this.paused ? $scope.audio.pause() : $scope.audio.play();
            $scope.audio.muted = this.muted;
            $scope.audio.currentTime = this.currentTime;
            console.log('set :', this);
          },
          get: function() {
            this.paused = $scope.audio.paused;
            this.muted = $scope.audio.muted;
            this.duration = $scope.audio.duration;
            this.currentTime = $scope.audio.currentTime;
            $scope.$apply();
            console.log('get :', this);
          },
          time: function(sec) {
            sec = sec ? sec : 0;
            return Math.floor(+sec / 60) + ':' +
                  (Math.floor(+sec % 60) < 10 ? '0' : '') +
                    Math.floor(+sec % 60);
          }
        };

        ['loadeddata', 'timeupdate', 'ended'].forEach(function(event) {
          $scope.audio.addEventListener(event, function() {
            $scope.getupdate = true;
            $scope.controls.get();
            $scope.getupdate = false;
          });
        });

        $scope.$watch('controls', function() {
          if (!$scope.getupdate) $scope.controls.set();
        }, true);

        $rootScope.$on('audio.set', function(e, file) {
          $scope.audio.src = file;
          $scope.audio.preload = 'auto';
        });
      },

      templateUrl: 'components/angular-audio/audio-drct.html'
    };
  });
