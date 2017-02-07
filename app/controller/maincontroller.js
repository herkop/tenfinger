var app = angular.module('TenFingers');
//var db = require('./db');

app.controller('MainController', function($scope) {

});

app.controller('ExerciseController', function($scope, $http, keyboard, $cookies, user) {
    $scope.exercise = [];
    $http.get('/exec').then(function (response) {
        $scope.exercise = response.data;
    });
    $scope.switchLetterStyle = {
      value: true
    };
    $scope.switchKeyboard ={
        value: true
    };
    $scope.switchKeyboardInst ={
        value: true,
        disable: false
    };
    $scope.selectKeyboardLayout ={
        value: "eesti",
        disable: false
    };

    $scope.user = user;
    $scope.user.name = "";
    user.getUser().then(function (data) {
        if(data.length == 0) {
            $scope.user.name = "külaline";
            $scope.user.isUser = false;
        }
        else {
            $scope.user.name = data[0].name;
            $scope.user.isUser = true;
        }
    });
    $scope.keyboard = keyboard;
    $scope.onKeyDown = function ($event) {
        $scope.result = keyboard.getWord();

        keyboard.letterTyped($event.key);
        $scope.keyboard.letter_active = keyboard.getActiveLetter();
        $scope.keyboard.key_active = keyboard.getActiveKey();
        $scope.keyboard.letter_style = keyboard.getLetterStyle();
        $scope.key_wrong = keyboard.getWrongKey();
        $scope.keyboard.correct = keyboard.getCorrect();
        $scope.keyboard.wrong = keyboard.getWrong();

    };
    $scope.$watchCollection('switchLetterStyle', function () {
       if($scope.switchLetterStyle.value){
           keyboard.setLetterHint(true);
           $scope.keyboard.letter_style = keyboard.getLetterStyle();
       }
       else{
           keyboard.setLetterHint(false);
           $scope.keyboard.letter_style = [];
       }
    });
    $scope.$watchCollection('switchKeyboard.value', function () {
        if($scope.switchKeyboard.value){
            $scope.switchKeyboardInst.disable = false;
            $scope.selectKeyboardLayout.disable = false;
        }
        else {
            $scope.switchKeyboardInst.disable = true;
            $scope.selectKeyboardLayout.disable = true;
        }
    });
    $scope.$watchCollection('switchKeyboardInst', function () {
       if($scope.switchKeyboardInst.value){
           keyboard.setKeyboardHint(true);
           $scope.keyboard.key_active = keyboard.getActiveKey();
           $scope.key_wrong = keyboard.getWrongKey();
       }
       else{
           keyboard.setKeyboardHint(false);
           $scope.keyboard.key_active = null;
           $scope.key_wrong = null;
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

app.controller('ExController', function($scope, $stateParams, $http, keyboard, $timeout) {
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
        //$scope.number = $stateParams.number;
        //$scope.result = exes[$stateParams.number-1];
        $http.get('/currentexec/id/' + $stateParams.number).then(function (response) {
            $scope.exerName = response.data[0].name;
            $scope.result = response.data[0].task;
            keyboard.setWord(response.data[0].task);
            $scope.keyboard.letter_active = keyboard.getActiveLetter();
            $scope.keyboard.key_active = keyboard.getActiveKey();
            $scope.keyboard.letter_style = keyboard.getLetterStyle();
            $scope.keyboard.correct = keyboard.getCorrect();
            $scope.keyboard.wrong = keyboard.getWrong();
            $scope.keyboard.time = 0;
            $timeout(timeSpent, 100);
        });
        //keyboard.setWord(exes[$stateParams.number-1]);



    }

});

app.controller('ExeMainController', function($scope, $cookies, $http, user){
    $scope.name = "";
    //var user = $cookies.get("user");
    //console.log($scope.isUser);
    //$scope.user = user.getUser();
    $scope.user = user;
    $scope.user.name = "";
    user.getUser().then(function (data) {
        if(data.length == 0) {
            $scope.user.name = "külaline";
            $scope.user.isUser = false;
        }
        else {
            $scope.user.name = data[0].name;
            $scope.user.isUser = true;
        }
    });
    $scope.clickStart = function() {
        $http.get('/person/add/'+$scope.name).then(function (response) {
            user.setUser(response.data[0].id, response.data[0].name);
            $scope.user.isUser = true;
            user.getUser().then(function (data) {
                if (data.length == 0) {
                    $scope.user.name = "külaline";
                    $scope.user.isUser = false;
                }
                else {
                    $scope.user.name = data[0].name;
                    $scope.user.isUser = true;
                }
            });
        });

    }
});