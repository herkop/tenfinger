var app = angular.module('TenFingers');

app.controller('MainController', function($scope) {

});

app.controller('ExerciseController', function($scope, keyboard, $cookies, user) {
    $scope.switchKeyboard ={
        value: true
    };
    $scope.switchKeyboardInst ={
        value: true,
        disable: false
    };
    $scope.switchKeyboardLay ={
        value: true,
        disable: false
    };


    $scope.username = user.getUser();
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
    $scope.$watchCollection('switchKeyboard.value', function () {
        if($scope.switchKeyboard.value){
            $scope.switchKeyboardInst.disable = false;
            $scope.switchKeyboardLay.disable = false;
        }
        else {
            $scope.switchKeyboardInst.disable = true;
            $scope.switchKeyboardLay.disable = true;
        }
    });
    $scope.saveSettings = function () {
        //console.log($scope.switchKeyboard.value);
    }
});

app.controller('MenuController', function($scope, $location){
    $scope.active = function(loc){
        return loc == $location.path();
    };
});

app.controller('ExController', function($scope, $stateParams, keyboard, $timeout) {
    //$cookies.put('user', 'Tester');
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

app.controller('ExeMainController', function($scope, $cookies){
    $scope.name = "";
    var user = $cookies.get("user");
    $scope.isUser = false;
    if(angular.isUndefined(user)){
        $scope.isUser = false;
    }
    else{
        $scope.isUser = true;
        $scope.user=user;
    }
    $scope.clickStart = function(){
        var name = $scope.name;
        if(name.length > 2) {
            var date = new Date();
            date.setDate(date.getDate() + 365 * 10);
            $cookies.put('user', name, {expires: date});
            $scope.isUser = true;
            $scope.user = $cookies.get("user");
        }
    }
});