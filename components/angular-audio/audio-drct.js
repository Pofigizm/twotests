/* jshint devel:true */
'use strict';

angular.module('audioDrct', [])
  .directive('angularAudio', function( $rootScope ){
    return {
      restrict: 'E',
      scope: {},
      controller: function( $scope ){
        
        $scope.audio = new Audio();
        $scope.controls = {
          paused: true,
          muted: false,
          duration: 0,
          currentTime: 0,
          set: function(){
            this.paused ? $scope.audio.pause() : $scope.audio.play();
            $scope.audio.muted = this.muted;
            $scope.audio.currentTime = this.currentTime;  
          },
          get: function(){
            this.paused = $scope.audio.paused;
            this.muted = $scope.audio.muted;
            this.duration = $scope.audio.duration;
            this.currentTime = $scope.audio.currentTime;
            $scope.$apply();
          },
          time: function(sec){
            sec = sec ? sec : 0;
            return  Math.floor(+sec / 60) + ':' +
                  ( Math.floor(+sec % 60) < 10 ? '0' : '' ) +
                    Math.floor(+sec % 60) ;
          }
        };

        ['loadeddata','timeupdate','ended'].forEach(function(event){
          $scope.audio.addEventListener(event, function(){
            $scope.controls.get();
          });  
        });
        
        $scope.$watch('controls', function(newVal, oldVal){
          $scope.controls.set();
        }, true);

        $rootScope.$on('audio.set', function(e, file){
          $scope.audio.src = file;
        });
      },

      templateUrl: 'components/angular-audio/audio-drct.html'
    };
  });
