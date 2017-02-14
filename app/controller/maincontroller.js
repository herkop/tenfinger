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
    if(user.getUser() == null){
        $scope.user.name = "külaline";
        $scope.user.isUser = false;
    }
    else {
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
    }
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
    if(user.getUser() == null){
        $scope.user.name = "külaline";
        $scope.user.isUser = false;
    }
    else {
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
    }
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

app.controller('ExAudioController', function($scope, ngAudio){

    $scope.vol = 0.5;
    $scope.playb = 1.0;
    $scope.textChecked = "";
    $scope.textVisibility = true;
    $scope.correctHide = true;
    $scope.correctAnswer = "";
    var started = false;
    $scope.textDisabled = false;
    $scope.textInserted = "";
    var text = "Oletame, et oled korilane õunte sünnimaal Kasahstanis. Regulaarselt nälga tundes oled õnnelik märgates eemal õunapuude salu. Õnnetuseks märkad, et samas suunas vaatab teisigi tühjusest koriseva kõhuga indiviide. Selles oletuse mängus on sul kasutada omapärane laserrelv, millest tulistades saad muuta pihtasaaja ajutiselt liikumisvõimetuks. Paraku pead arvestama, et konkurentidel on kasutuses samasugune relv sinu tulistamiseks. Mis sa arvad, kas keskendud rohkem õunte kogumisele või püüad pigem teisi õuntest eemal hoida? Võime spekuleerida, kuidas valiks USA värske president, aga kui sa oled nutikas, nõuad otsustamiseks täiendavat informatsiooni. Tõenäoliselt tahad teada, kas õunu on palju või vähe. Kui õunu on vähe, tasub keskenduda konkurentide segamisele. Kui õunu on rohkem, võiksid olla inimlikum, süüa ise kõht täis ja jätta teised rahule.";
    $scope.startExe = function () {
        if(!started) {
            $scope.audio = ngAudio.load('/media/speech/1702141236060_4785.mp3');
            //$scope.audio.volume = $scope.vol;
            //console.log($scope.audio.playbackRate);
            started = true;
            $scope.audio.play();

            //$scope.audio.playbackRate = $scope.playb;
            $scope.textDisabled = false;
            $scope.textVisibility = true;
            $scope.correctAnswer = "";
        }
    };
    $scope.endExe = function () {
        if(started){
            started = false;
            $scope.audio.restart();
            $scope.textDisabled = true;
            $scope.textVisibility = false;
            $scope.correctAnswer = text;
            textCheck($scope.textInserted);
        }
    };

    $scope.toggleCorrect = function () {
        $scope.correctHide = !$scope.correctHide;
    };

    var textCheck = function (value) {
        var correct = text.split(" ");
        var inserted = value.split(" ");
        var allword = {};
        var nr = 0;
        //console.log(correct);
        //console.log(inserted);
        for(var i = 0; i < inserted.length; i++){
            allword[nr] = wordCheck(correct[i], inserted[i]);
            nr++;
            allword[nr] = {0:{letter:" ", correct: true}};
            nr++;
        }
        var re = wordCheck("aabits", "kabits");
        //console.log(allword);
        $scope.textChecked = allword;
    };

    var wordCheck = function (wordC, wordT) {
        var res = {};
        var len = 0;
        if(wordC >= wordT){
            len = wordC.length;
        }
        else{
            len = wordT.length;
        }
        for(var i = 0; i < len; i++){
            if(wordT.length < i){
                break;
            }
            if(wordC.length < i){
                res[i] = { letter: wordT[i], correct: false};
            }
            else {
                if (wordC[i] == wordT[i]) {
                    res[i] = {letter: wordT[i], correct: true};
                }
                else {
                    res[i] = {letter: wordT[i], correct: false};
                }
            }
        }

        return res;
    }

});