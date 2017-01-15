var app = angular.module('TenFingers');

app.controller('MainController', function($scope) {

});

app.controller('ExerciseController', function($scope, keyboard) {

    $scope.keyboard = keyboard;
    $scope.onKeyDown = function ($event) {
        $scope.result = keyboard.getWord();

        keyboard.letterTyped($event.key);
        $scope.keyboard.letter_active = keyboard.getActiveLetter();
        $scope.keyboard.key_active = keyboard.getActiveKey();
        $scope.letter_style = keyboard.getLetterStyle();
        $scope.key_wrong = keyboard.getWrongKey();
        $scope.keyboard.correct = keyboard.getCorrect();
        $scope.keyboard.wrong = keyboard.getWrong();

    };
});

app.controller('MenuController', function($scope, $location){
    $scope.active = function(loc){
        return loc == $location.path();
    };
});

app.controller('ExController', function($scope, $stateParams, keyboard, $timeout) {
    $scope.keyboard = keyboard;
    var exes = ["jfjffjjfjjjfffjfjfjjfjff", "dkddkkkddkdkdkdkkkdddkd", "slllssllsllsssllsllslslsl", "aöaöaöaöaöööaaöaöaööaöö", "sösdjklalkdfjjllskkdjjfalsddkjfds"];

    var timeSpent = function () {
      if(keyboard.getStartTime() != 0){
          if(keyboard.getFinishTime() > 0){
              $scope.keyboard.time = keyboard.getDiv();
          }
          else{
              var time = (new Date()).getTime();
              var div = (time - keyboard.getStartTime()) / 1000;
              $scope.keyboard.time = div;
          }
      }
      if(keyboard.getDiv() == 0) {
          $timeout(timeSpent, 100);
      }
    };

    if(!angular.isUndefined($stateParams.number)) {
        $scope.number = $stateParams.number;
        $scope.result = exes[$stateParams.number-1];
        keyboard.setWord(exes[$stateParams.number-1]);

        $scope.keyboard.letter_active = keyboard.getActiveLetter();
        $scope.keyboard.key_active = keyboard.getActiveKey();
        $scope.letter_style = keyboard.getLetterStyle();
        $scope.keyboard.correct = keyboard.getCorrect();
        $scope.keyboard.wrong = keyboard.getWrong();
        $scope.keyboard.time = 0;
        $timeout(timeSpent, 100);

    }

});