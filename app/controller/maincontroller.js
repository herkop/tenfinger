var app = angular.module('TenFingers');
//var db = require('./db');

app.controller('MainController', function($scope) {

});

app.controller('ExerciseController', function($scope, $http, keyboard, $cookies, user, share) {
    $scope.exercise = [];

    $http.get('/exec').then(function (response) {
        $scope.exercise = response.data;
    });
    //$scope.mineExercises = [];
    share.setMineExes();

    /**if(user.getUser() != null) {
        $http.get("/myexes/" + user.getUserId()).then(function (res) {
            $scope.mineExercises = res.data;
        })
    }*/
    if(share.getShareGroup() != null && share.getShareExercises() != null){
        $scope.sharedExerciseMenu = false;
        $scope.sharedExeMain = share.getShareGroup();
        $scope.sharedExercises = share.getShareExercises();
    }
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
                $http.get("/setting/" + user.getUserId()).then(function (response) {
                    for(var elem in response.data){
                        if (response.data[elem].hasOwnProperty('setting_id')) {
                            if (response.data[elem]['setting_id'] == 1) {
                                    $scope.switchLetterStyle.value = !(response.data[elem].value == 'false');
                            }
                            else if (response.data[elem]['setting_id'] == 2) {
                                    $scope.switchKeyboard.value = !(response.data[elem].value == 'false');
                            }
                            else if (response.data[elem]['setting_id'] == 3) {
                                    $scope.switchKeyboardInst.value = !(response.data[elem].value == 'false');

                            }
                        }
                    }
                })
            }
        });
    }
    $scope.keyboard = keyboard;
    var keyDownPreviousTime = 0;
    var typedCharSum = 0;
    var typedChar = 0;
    $scope.onKeyDown = function ($event) {
        //speed
        if($event.keyCode == 32 && $event.target == document.body) {
            $event.preventDefault();
            //return false;
        }

        var keyDownTime = (new Date()).getTime();
        if(keyboard.getStartTime() != 0 && keyboard.getFinishTime() == 0) {
            if (keyDownTime == 0) {
                keyDownPreviousTime = keyDownTime;
            }
            else {
                var keyTime = keyDownTime - keyDownPreviousTime;
                var sec = keyTime / 1000;
                $scope.keyboard.speed = Math.floor(60 / sec);
                keyDownPreviousTime = keyDownTime;
                typedCharSum += 1;
                typedChar += $scope.keyboard.speed;
                $scope.keyboard.avgSpeed = Math.floor(typedChar / typedCharSum);
            }
        }

        $scope.result = keyboard.getWord();
        if($event.key != 'Shift' && $event.key != 'Alt' && $event.key != 'Control' && $event.key != 'AltGraph') {
            if($event.key == "Enter"){
                keyboard.letterTyped("\n");
            }
            else {
                keyboard.letterTyped($event.key);
            }
            $scope.keyboard.letter_active = keyboard.getActiveLetter();
            $scope.keyboard.key_active = keyboard.getActiveKey();
            $scope.keyboard.letter_style = keyboard.getLetterStyle();
            $scope.key_wrong = keyboard.getWrongKey();
            $scope.keyboard.correct = keyboard.getCorrect();
            $scope.keyboard.wrong = keyboard.getWrong();
        }
    };
    var pageLoaded = false;
    $scope.$watchCollection('switchLetterStyle', function () {
       if($scope.switchLetterStyle.value){
           keyboard.setLetterHint(true);
           $scope.keyboard.letter_style = keyboard.getLetterStyle();
       }
       else{
           keyboard.setLetterHint(false);
           $scope.keyboard.letter_style = [];
       }
       if(pageLoaded) {
           updateSettingChange(1, $scope.switchLetterStyle.value);
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
        if(pageLoaded) {
            updateSettingChange(2, $scope.switchKeyboard.value);
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
       if(pageLoaded) {
           updateSettingChange(3, $scope.switchKeyboardInst.value);
       }
    });
    $scope.saveSettings = function () {
        //console.log($scope.switchKeyboard.value);
    };
    angular.element(document).ready(function () {
        pageLoaded = true;
    });
    var updateSettingChange = function (id, value) {
        if(user.getUser() != null) {
            $http.get("/updateset/" + user.getUserId() + "/" + id + "/" + value).then(function () {
                var c = true;
            });
        }
    };

    $scope.isExpired = function (expires) {
        var ex = new Date(expires);
        var now = new Date();

        return ex < now;
    };
});

app.controller('MenuController', function($scope, $location, share){
    $scope.menu = {
        begin: true,
        advanced: true,
        mine: true,
        share: true
    };
    $scope.sharedExerciseMenu = true;
    $scope.sharedExeMain = {};
    $scope.sharedExercises = [];
    $scope.mineExercises = [];
    $scope.changeCollapse = function () {
        $('#collapseThree').removeClass('in');
        $('#collapseFive').addClass('in');
    };
    $scope.active = function(loc){
        var hrefLocation = $location.path().split("/");
        $scope.sharedExerciseMenu = true;
        if(hrefLocation[1] == "exercise"){
            if(share.getMineExercises() != null){
                $scope.mineExercises = share.getMineExercises();
            }
            if(hrefLocation[2] == "begin"){
                $scope.menu.begin = false;
            }
            else if(hrefLocation[2] == "advanced"){
                $scope.menu.advanced = false;
            }
            else if(hrefLocation[2] == "mine"){
                $scope.menu.mine = false;
            }
            else if(hrefLocation[2] == "shared"){
                $scope.menu.share = false;
                if(share.getShareGroup() != null && share.getShareExercises() != null){
                $scope.sharedExeMain = share.getShareGroup();
                $scope.sharedExercises = share.getShareExercises();
                $scope.sharedExerciseMenu = false;
                }
            }
        }
        return loc == $location.path();
    };
});

app.controller('ExController', function($scope, $stateParams, $http, keyboard, $timeout, $state, share) {

    $scope.keyboard = keyboard;
    var endMes = {"excellent": "Väga tubli! Võid järgmise harjutuse juurde asuda.", "good": "Tubli! Tegid ainult mõne üksiku vea.", "bad": "Harjuta veel! Oled liiga palju vigu teinud."};

    var timeSpent = function () {
      if(keyboard.getStartTime() != 0){
          if(keyboard.getFinishTime() > 0){
              $scope.keyboard.time = keyboard.getDiv();
              if(keyboard.wrong == 0) {
                  $scope.exEndMessage = endMes["excellent"];
              }
              else if(keyboard.wrong <= 2){
                  $scope.exEndMessage = endMes["good"];
              }
              else{
                  $scope.exEndMessage = endMes["bad"];
              }
              $('#exeEndModal').modal('show');
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
    $scope.nextExNumber = null;
    if(!angular.isUndefined($stateParams.number)) {
        $scope.exNumber = $stateParams.number;
        $scope.nextExNumber = parseInt($stateParams.number) + 1;
        $scope.exeLoadErrorShow = false;
        $scope.exeBeginShow = false;
        //$scope.result = exes[$stateParams.number-1];
        $http.get('/currentexec/id/' + $stateParams.number).then(function (response) {
            if(response.data.length > 0) {
                $scope.exeBeginShow = true;
                $scope.exerName = response.data[0].name;
                $scope.result = response.data[0].task;
                keyboard.setWord(response.data[0].task);
                $scope.keyboard.letter_active = keyboard.getActiveLetter();
                $scope.keyboard.key_active = keyboard.getActiveKey();
                $scope.keyboard.letter_style = keyboard.getLetterStyle();
                $scope.keyboard.correct = keyboard.getCorrect();
                $scope.keyboard.wrong = keyboard.getWrong();
                $scope.keyboard.time = 0;
                $scope.keyboard.speed = 0;
                $scope.keyboard.avgSpeed = 0;
                $timeout(timeSpent, 100);
            }
            else{
                $scope.exeLoadErrorShow = true;
            }
        });

        $scope.nextExButton = function () {
            $('#exeEndModal').modal('hide');
            $timeout(function() {
                $state.go('exercise', {'number': $scope.nextExNumber});
            }, 500);
        };
    }

    if(!angular.isUndefined($stateParams.sharenumber)) {
        $scope.exNumber = $stateParams.sharenumber;
        share.getExercises($stateParams.exercise).then(function (res) {

            if(share.isFromMain() == null && res != true) {
                share.setShareExercises(res);
            }
            $scope.sharedExe = share.getShareExe($stateParams.sharenumber);
            $scope.exeLoadErrorShow = false;
            $scope.exeBeginShow = false;
            if ($scope.sharedExe == null) {
                $scope.exeLoadErrorShow = true;
            }
            else {
                $scope.exeBeginShow = true;
                $scope.nextExNumber = share.getSharedNext($scope.sharedExe.ord + 1);
                $scope.nextButtonDisabled = $scope.nextExNumber == null;
                $scope.exerName = $scope.sharedExe.name;
                $scope.result = $scope.sharedExe.exercise;
                keyboard.setWord($scope.sharedExe.exercise);
                $scope.keyboard.letter_active = keyboard.getActiveLetter();
                $scope.keyboard.key_active = keyboard.getActiveKey();
                $scope.keyboard.letter_style = keyboard.getLetterStyle();
                $scope.keyboard.correct = keyboard.getCorrect();
                $scope.keyboard.wrong = keyboard.getWrong();
                $scope.keyboard.time = 0;
                $scope.keyboard.speed = 0;
                $scope.keyboard.avgSpeed = 0;
                $timeout(timeSpent, 100);

                $scope.nextExButton = function () {
                    $('#exeEndModal').modal('hide');
                    $timeout(function () {
                        if ($scope.nextExNumber != null) {
                            if ($scope.nextExNumber.type == 1) {
                                $state.go('exerciseShareBegin', {'exercise': $stateParams.exercise, 'sharenumber': $scope.nextExNumber.id});
                            }
                            else if ($scope.nextExNumber.type == 2) {
                                $state.go('exerciseShareText', {'exercise': $stateParams.exercise, 'sharenumber': $scope.nextExNumber.id});
                            }
                            else if ($scope.nextExNumber.type == 3) {
                                $state.go('exerciseShareAudio', {'exercise': $stateParams.exercise, 'sharenumber': $scope.nextExNumber.id});
                            }
                        }
                    }, 500);
                };
            }
        }, function (error) {
            $scope.exeLoadErrorShow = true;
        });
    }

        $scope.repeatExButton = function () {
            $('#exeEndModal').modal('hide');
            keyboard.setWord(keyboard.getWord());
            $scope.keyboard.letter_active = keyboard.getActiveLetter();
            $scope.keyboard.key_active = keyboard.getActiveKey();
            $scope.keyboard.letter_style = keyboard.getLetterStyle();
            $scope.keyboard.correct = keyboard.getCorrect();
            $scope.keyboard.wrong = keyboard.getWrong();
            $scope.keyboard.time = 0;
            $scope.keyboard.speed = 0;
            $scope.keyboard.avgSpeed = 0;
            $timeout(timeSpent, 100);
        }



});

app.controller('ExeMainController', function($scope, $cookies, $http, user){
    $scope.name = "";
    //var user = $cookies.get("user");
    //console.log($scope.isUser);
    //$scope.user = user.getUser();
    $scope.user = user;
    $scope.user.name = "";
    $scope.errorName = {
        show: false,
        text: ""
    };
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
        $http.get('/person/' + $scope.name).then(function (res) {
            if (res.data.length > 0) {
                $scope.errorName.text = "Selline kasutaja on juba olemas!";
                $scope.errorName.show = true;
            } else {
                $http.get('/person/add/' + $scope.name).then(function (response) {
                    $scope.errorName.show = false;
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
    }
});

app.controller('ExTextController', function ($scope, keyboard, $timeout, share, $stateParams, $state) {
    var endMes = {"excellent": "Väga tubli! Võid järgmise harjutuse juurde asuda.", "good": "Tubli! Tegid ainult mõne üksiku vea.", "bad": "Harjuta veel! Oled liiga palju vigu teinud."};

    $scope.keyboard = keyboard;
    var timeSpent = function () {
        if(keyboard.getStartTime() != 0){
            if(keyboard.getFinishTime() > 0){
                $scope.keyboard.time = keyboard.getDiv();
                if(keyboard.wrong == 0) {
                    $scope.exEndMessage = endMes["excellent"];
                }
                else if(keyboard.wrong <= 6){
                    $scope.exEndMessage = endMes["good"];
                }
                else{
                    $scope.exEndMessage = endMes["bad"];
                }
                $('#exeEndModal').modal('show');
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

    if(!angular.isUndefined($stateParams.sharenumber)) {
        $scope.exNumber = $stateParams.sharenumber;
        share.getExercises($stateParams.exercise).then(function (res) {
            if(share.isFromMain() == null && res != true) {
                share.setShareExercises(res);
            }
            $scope.sharedExe = share.getShareExe($stateParams.sharenumber);
            $scope.exeLoadErrorShow = false;
            $scope.exeBeginShow = false;
            if ($scope.sharedExe == null) {
                $scope.exeLoadErrorShow = true;
            }
            else {
                $scope.exeBeginShow = true;
                $scope.nextExNumber = share.getSharedNext($scope.sharedExe.ord + 1);
                $scope.nextButtonDisabled = $scope.nextExNumber == null;
                $scope.exeTextName = $scope.sharedExe.name;
                $scope.text = $scope.sharedExe.exercise;
                keyboard.setWord($scope.sharedExe.exercise, false);
                $scope.keyboard.letter_active = keyboard.getActiveLetter();
                $scope.keyboard.key_active = keyboard.getActiveKey();
                $scope.keyboard.letter_style = keyboard.getLetterStyle();
                $scope.keyboard.correct = keyboard.getCorrect();
                $scope.keyboard.wrong = keyboard.getWrong();
                $scope.keyboard.time = 0;
                $scope.keyboard.speed = 0;
                $scope.keyboard.avgSpeed = 0;
                $timeout(timeSpent, 100);

                $scope.nextExButton = function () {
                    $('#exeEndModal').modal('hide');
                    $timeout(function () {
                        if ($scope.nextExNumber != null) {
                            if ($scope.nextExNumber.type == 1) {
                                $state.go('exerciseShareBegin', {'exercise': $stateParams.exercise, 'sharenumber': $scope.nextExNumber.id});
                            }
                            else if ($scope.nextExNumber.type == 2) {
                                $state.go('exerciseShareText', {'exercise': $stateParams.exercise, 'sharenumber': $scope.nextExNumber.id});
                            }
                            else if ($scope.nextExNumber.type == 3) {
                                $state.go('exerciseShareAudio', {'exercise': $stateParams.exercise, 'sharenumber': $scope.nextExNumber.id});
                            }
                        }
                    }, 500);
                };
            }
        }, function (error) {
            $scope.exeLoadErrorShow = true;
        });
    }
    else{
        $scope.exeBeginShow = true;
        $scope.text = "Oletame, et oled korilane õunte sünnimaal Kasahstanis. Regulaarselt nälga tundes oled õnnelik märgates eemal õunapuude salu. Õnnetuseks märkad, et samas suunas vaatab teisigi tühjusest koriseva kõhuga indiviide. Selles oletuse mängus on sul kasutada omapärane laserrelv, millest tulistades saad muuta pihtasaaja ajutiselt liikumisvõimetuks. Paraku pead arvestama, et konkurentidel on kasutuses samasugune relv sinu tulistamiseks. Mis sa arvad, kas keskendud rohkem õunte kogumisele või püüad pigem teisi õuntest eemal hoida? Võime spekuleerida, kuidas valiks USA värske president, aga kui sa oled nutikas, nõuad otsustamiseks täiendavat informatsiooni. Tõenäoliselt tahad teada, kas õunu on palju või vähe. Kui õunu on vähe, tasub keskenduda konkurentide segamisele. Kui õunu on rohkem, võiksid olla inimlikum, süüa ise kõht täis ja jätta teised rahule.";
        $scope.exeTextName = "Pikk tekst";
        $scope.nextButtonDisabled = false;
        keyboard.setWord($scope.text, false);
        $scope.keyboard.letter_active = keyboard.getActiveLetter();
        $scope.keyboard.key_active = keyboard.getActiveKey();
        $scope.keyboard.letter_style = keyboard.getLetterStyle();
        $scope.keyboard.correct = keyboard.getCorrect();
        $scope.keyboard.wrong = keyboard.getWrong();
        $scope.keyboard.time = 0;
        $scope.keyboard.speed = 0;
        $scope.keyboard.avgSpeed = 0;
        $timeout(timeSpent, 100);
    }

    $scope.repeatExButton = function () {
        $('#exeEndModal').modal('hide');
        keyboard.setWord(keyboard.getWord(), false);
        $scope.keyboard.letter_active = keyboard.getActiveLetter();
        $scope.keyboard.key_active = keyboard.getActiveKey();
        $scope.keyboard.letter_style = keyboard.getLetterStyle();
        $scope.keyboard.correct = keyboard.getCorrect();
        $scope.keyboard.wrong = keyboard.getWrong();
        $scope.keyboard.time = 0;
        $scope.keyboard.speed = 0;
        $scope.keyboard.avgSpeed = 0;
        $timeout(timeSpent, 100);
    };

});

app.controller('ExAudioController', function($scope, $http, ngAudio, $q, audioTest, $timeout, $window, $stateParams, share, $state){
     $scope.sliderVolume = {
        value: 0.5,
        options: {
            floor: 0,
            precision: 2,
            ceil: 1,
            step: 0.01,
            vertical: false,
            hideLimitLabels: true
        }
    };
    $scope.sliderPlayback = {
        value: 1,
        options: {
            floor: 0.5,
            ceil: 1.5,
            precision: 2,
            step: 0.01,
            vertical: false,
            hideLimitLabels: true
        }
    };
    $scope.sliderProgress = {
        value: 0,
        options: {
            floor: 0,
            ceil: 1,
            precision: 4,
            step: 0.0001,
            hideLimitLabels: true,
            hidePointerLabels: true,
            readOnly: true
        }
    };
    $scope.remainingTime = {
        minutes: "00",
        seconds: "00"
    };
    $scope.audioTesting = ngAudio.load('/media/test/1702181246580_6969.mp3');
    $scope.audio = ngAudio.load('/media/speech/1702141236060_4785.mp3');
    $scope.vol = 0.5;
    $scope.playb = 1.0;
    $scope.textChecked = "";
    $scope.textVisibility = true;
    $scope.correctHide = true;
    $scope.correctAnswer = "";
    var started = false;
    $scope.textDisabled = false;
    $scope.textInserted = "";
    $scope.textareaFocus = false;
    $scope.newAudioExeText = "";
    $scope.errorAlert = {
        text: "Midagi läks valesti",
        show: false
    };
    $scope.successAlert = false;
    $scope.audioExerResult = {
      typed: {
          all: 0,
          wrong: 0,
          correct: 0
      },
        correct: {
          all: 0
        }
    };

    $scope.diffOptions = {
        editCost: 1,
        attrs: {
            insert: {
                'data-attr': 'insert',
                'class': 'del'
            },
            delete: {
                'data-attr': 'delete',
                'class': 'del'
            },
            equal: {
                'data-attr': 'equal',
                'class': 'match'
            }
        }
    };

    $scope.exampleAudio = {
      0: {
          text: "Oletame, et oled korilane õunte sünnimaal Kasahstanis.",
          file: "/media/speech/1704130406020_6128.mp3"
      },
        1: {
            text: "Regulaarselt nälga tundes oled õnnelik märgates eemal õunapuude salu.",
            file: "/media/speech/1704130406020_8899.mp3"
        },
        2: {
            text: "Õnnetuseks märkad, et samas suunas vaatab teisigi tühjusest koriseva kõhuga indiviide.",
            file: "/media/speech/1704130406020_5194.mp3"
        },
        3: {
            text: "Selles oletuse mängus on sul kasutada omapärane laserrelv, millest tulistades saad muuta pihtasaaja ajutiselt liikumisvõimetuks.",
            file: "/media/speech/1704130406020_4418.mp3"
        },
        4: {
            text: "Paraku pead arvestama, et konkurentidel on kasutuses samasugune relv sinu tulistamiseks.",
            file: "/media/speech/1704130406020_4536.mp3"
        },
        5: {
            text: "Mis sa arvad, kas keskendud rohkem õunte kogumisele või püüad pigem teisi õuntest eemal hoida?",
            file: "/media/speech/1704130406020_4336.mp3"
        },
        6: {
            text: "Võime spekuleerida, kuidas valiks USA värske president, aga kui sa oled nutikas, nõuad otsustamiseks täiendavat informatsiooni.",
            file: "/media/speech/1704130406020_9798.mp3"
        },
        7: {
            text: "Tõenäoliselt tahad teada, kas õunu on palju või vähe.",
            file: "/media/speech/1704130406020_8061.mp3"
        },
        8: {
            text: "Kui õunu on vähe, tasub keskenduda konkurentide segamisele.",
            file: "/media/speech/1704130406020_7667.mp3"
        },
        9: {
            text: "Kui õunu on rohkem, võiksid olla inimlikum, süüa ise kõht täis ja jätta teised rahule.",
            file: "/media/speech/1704130406020_4570.mp3"
        }
    };

    $scope.someAudio = {
        duration: 0,
        currentTime: 0,
        remaining: 0
    };
    $scope.testAudio = {};
    $scope.palyNr = 0;
    $scope.audioRepeat = 1;
    $scope.repeatValues = [1, 2, 3];
    $scope.audioPause = 1;
    $scope.pauseValues = [1, 2, 3, 4, 5];
    $scope.voiceSelect = 0;
    $scope.voiceValues = [
        {value: 15, name: "Tõnu"},
        {value: 14, name: "Eva"}];
    $scope.repeatDisabled = false;
    $scope.pauseDisabled = false;
    $scope.newAudioTextDisabled = false;
    $scope.nextButtonDisabled = true;
    $scope.exeAudioShow = false;
    $scope.exeLoadErrorShow = false;
    $scope.newAudioModalButton = "Loo harjutus";
        $scope.voice = {
        15: ngAudio.load("/media/test/1704180143420_5986.mp3"),
        14: ngAudio.load("/media/test/1704180143110_3422.mp3")
    };
    /**audioTest.loadAudio($scope.exampleAudio);
    $timeout(function () {
        $scope.someAudio.duration = audioTest.getDuration();
        $scope.someAudio.remaining = $scope.someAudio.duration;
    },500);*/


    var text = "Oletame, et oled korilane õunte sünnimaal Kasahstanis. Regulaarselt nälga tundes oled õnnelik märgates eemal õunapuude salu. Õnnetuseks märkad, et samas suunas vaatab teisigi tühjusest koriseva kõhuga indiviide. Selles oletuse mängus on sul kasutada omapärane laserrelv, millest tulistades saad muuta pihtasaaja ajutiselt liikumisvõimetuks. Paraku pead arvestama, et konkurentidel on kasutuses samasugune relv sinu tulistamiseks. Mis sa arvad, kas keskendud rohkem õunte kogumisele või püüad pigem teisi õuntest eemal hoida? Võime spekuleerida, kuidas valiks USA värske president, aga kui sa oled nutikas, nõuad otsustamiseks täiendavat informatsiooni. Tõenäoliselt tahad teada, kas õunu on palju või vähe. Kui õunu on vähe, tasub keskenduda konkurentide segamisele. Kui õunu on rohkem, võiksid olla inimlikum, süüa ise kõht täis ja jätta teised rahule.";
    $scope.textfirst = text;
    $scope.$watchCollection("sliderVolume.value", function () {
        if(isValueBetween($scope.sliderVolume.value, 0, 1)){
            $scope.audioTesting.volume = $scope.sliderVolume.value;
            $scope.audio.volume = $scope.sliderVolume.value;
        }
    });

    $scope.$watchCollection("sliderPlayback.value", function () {
        if(isValueBetween($scope.sliderPlayback.value, 0.5, 1.5)){
            $scope.audioTesting.playbackRate = $scope.sliderPlayback.value;
            $scope.audio.playbackRate = $scope.sliderPlayback.value;
            //repeat audio
            $scope.testAudio.playbackRate = $scope.sliderPlayback.value;
        }
    });

    $scope.$watchCollection("audio.progress", function () {
       $scope.sliderProgress.value = $scope.audio.progress;
    });
    var lastChange = 0.0;
    $scope.$watch("testAudio.currentTime", function () {

        if(!angular.isUndefined($scope.testAudio.currentTime)) {
            if($scope.testAudio.currentTime - lastChange > 0){
                $scope.someAudio.currentTime += parseFloat($scope.testAudio.currentTime - lastChange);
            }
            lastChange = $scope.testAudio.currentTime;
            $scope.sliderProgress.value = $scope.someAudio.currentTime / $scope.someAudio.duration;
        }
    });

    $scope.$watch("audioRepeat", function (){
        $scope.someAudio.duration = audioTest.getDuration($scope.audioRepeat);
        if (!isNaN($scope.someAudio.duration)) {
            $scope.someAudio.remaining = $scope.someAudio.duration;
        }
    });

    $scope.$watch("someAudio.currentTime", function () {
        if ($scope.someAudio.duration - $scope.someAudio.currentTime > 0) {
            $scope.someAudio.remaining = $scope.someAudio.duration - $scope.someAudio.currentTime;
        }
    });

    $scope.$watch("testAudio.remaining", function () {
        if($scope.testAudio.remaining == 0) {

            $scope.someAudio.location += 1;
            if (!angular.isUndefined($scope.someAudio.files[$scope.someAudio.location])) {
                $scope.testAudio.restart();
                $scope.testAudio = $scope.someAudio.files[$scope.someAudio.location];
                $scope.testAudio.playbackRate = $scope.sliderPlayback.value;
                $scope.testAudio.volume = $scope.sliderVolume.value;
                $timeout(function () {
                    $scope.testAudio.play();
                }, $scope.audioPause * 1000);
            }

        }
    });

    var textToSentences = function(text) {
        var sentences = {};
        var lastEnd = 0;
        var sentNr = 0;
        for(var i = 0; i < text.length; i++){
            if(text[i] == "." || text[i] == "!" || text[i] == "?"){
                if(i+2 < text.length){
                    if(text[i+1] == " " && text[i+2] == text[i+2].toUpperCase()){
                        sentences[sentNr] = {"text": text.slice(lastEnd, i+1)};
                        lastEnd = i+2;
                        sentNr += 1;
                    }
                }
                else if(angular.isUndefined(text[i+1])){
                    sentences[sentNr] = {"text": text.slice(lastEnd, i+1)};
                    lastEnd = i+2;
                    sentNr += 1;
                }
            }
        }
        return sentences;
    };

    var textToSentencesL = function(text) {
        var sentences = [];
        var lastEnd = 0;
        var sentNr = 0;
        for(var i = 0; i < text.length; i++){
            if(text[i] == "." || text[i] == "!" || text[i] == "?"){
                if(i+2 < text.length){
                    if(text[i+1] == " " && text[i+2] == text[i+2].toUpperCase()){
                        sentences.push(text.slice(lastEnd, i+1));
                        lastEnd = i+2;
                        sentNr += 1;
                    }
                }
                else if(angular.isUndefined(text[i+1])){
                    sentences.push(text.slice(lastEnd, i+1));
                    lastEnd = i+2;
                    sentNr += 1;
                }
            }
        }
        if(sentences.length == 0){
            return [text];
        }
        return sentences;
    };
    $scope.nextExNumber = null;
    if(!angular.isUndefined($stateParams.sharenumber)){
        share.getExercises($stateParams.exercise).then(function(res) {
            if(share.isFromMain() == null && res != true) {
                share.setShareExercises(res);
            }
            var shareText = share.getShareExe($stateParams.sharenumber);
            if (shareText == null) {
                $scope.exeLoadErrorShow = true;
            }
            else {
                $scope.exeAudioShow = true;
                $scope.nextExNumber = share.getSharedNext(shareText.ord + 1);
                $scope.nextButtonDisabled = $scope.nextExNumber == null;
                $scope.exeAudioName = shareText.name;
                text = shareText.exercise;
                audioTest.getAudioFiles(textToSentencesL(shareText.exercise)).then(function (data) {
                    audioTest.loadAudioL(data);
                    $timeout(function () {
                        $scope.someAudio.duration = audioTest.getDuration();
                        $scope.someAudio.remaining = $scope.someAudio.duration;
                    }, 500);
                });
            }
        }, function (error) {
            $scope.exeLoadErrorShow = true;
        });
    }
    else {
        $scope.exeAudioShow = true;
        $scope.nextButtonDisabled = true;
        $scope.exeAudioName = "Kuulamise harjutus";
        audioTest.loadAudio($scope.exampleAudio);
        $timeout(function () {
            $scope.someAudio.duration = audioTest.getDuration();
            $scope.someAudio.remaining = $scope.someAudio.duration;
        },500);
    }

    var isValueBetween = function (value, min ,max) {
        return value >= min && value <= max;
    };
    $scope.startExe = function () {
        if(!started) {

            started = true;
            $scope.textareaFocus = true;
            //$scope.audio.play();
            $scope.sliderVolume.options.disabled = true;
            $scope.sliderPlayback.options.disabled = true;
            $scope.repeatDisabled = true;
            $scope.pauseDisabled = true;
            $scope.someAudio.files = audioTest.playAudio($scope.audioRepeat).files;
            $scope.someAudio.location = 0;
            $scope.someAudio.currentTime = 0;
            $scope.someAudio.remaining = $scope.someAudio.duration;
            $scope.testAudio = $scope.someAudio.files[0];
            $scope.testAudio.playbackRate = $scope.sliderPlayback.value;
            $scope.testAudio.volume = $scope.sliderVolume.value;
            $scope.testAudio.play();
            $scope.textDisabled = false;
            $scope.textVisibility = true;
            $scope.correctAnswer = "";
            $scope.textInserted = "";
            $timeout(function() {
                var element = $window.document.getElementById("textarea");
                if(element)
                    element.focus();
            });
        }
    };
    $scope.endExe = function () {
        if(started){
            started = false;
            $scope.testAudio.restart();
            $scope.textareaFocus = false;
            $scope.sliderVolume.options.disabled = false;
            $scope.sliderPlayback.options.disabled = false;
            $scope.repeatDisabled = false;
            $scope.pauseDisabled = false;
            $scope.textDisabled = true;
            //$scope.textVisibility = false;
            $scope.correctAnswer = text;
            $scope.someAudio.location = 0;
            $scope.someAudio.currentTime = 0;
            //textCheck($scope.textInserted);
            $('#exeEndModal').modal('show');
        }
    };

    $scope.nextExButton = function () {
        $('#exeEndModal').modal('hide');
        $timeout(function () {
            if ($scope.nextExNumber != null) {
                if ($scope.nextExNumber.type == 1) {
                    $state.go('exerciseShareBegin', {'exercise': $stateParams.exercise, 'sharenumber': $scope.nextExNumber.id});
                }
                else if ($scope.nextExNumber.type == 2) {
                    $state.go('exerciseShareText', {'exercise': $stateParams.exercise, 'sharenumber': $scope.nextExNumber.id});
                }
                else if ($scope.nextExNumber.type == 3) {
                    $state.go('exerciseShareAudio', {'exercise': $stateParams.exercise, 'sharenumber': $scope.nextExNumber.id});
                }
            }
        }, 500);
    };

    $scope.repeatExButton = function () {
        $scope.textareaFocus = true;
        $scope.sliderVolume.options.disabled = false;
        $scope.sliderPlayback.options.disabled = false;
        $scope.repeatDisabled = false;
        $scope.pauseDisabled = false;
        $scope.someAudio.location = 0;
        $scope.someAudio.currentTime = 0;
        //$scope.textDisabled = false;
        $scope.correctAnswer = "";
        $scope.textInserted = "";
        $scope.sliderProgress.value = 0;
        $('#exeEndModal').modal('hide');
    };

    $scope.toggleCorrect = function () {
        $scope.correctHide = !$scope.correctHide;
    };

    $scope.testVoice = function () {
        if(!angular.isUndefined($scope.voiceSelect.value)){
            $scope.voice[$scope.voiceSelect.value].play();
        }
    };

    $scope.createNewExe = function () {
        $scope.newAudioTextDisabled = false;
        $scope.exeAlertInfo = true;
        $scope.errorAlert.show = false;
        $scope.newAudioExeTaShow = true;
        $scope.newAudioExeText = "";
        $scope.newAudioExeHeader = "Loo uus kuulamise harjutus";
        $scope.newAudioExeTaHeader = "Sisesta tekst";
        $scope.newAudioModalButton = {name: "Loo harjutus", loading: "Loon harjutust"};
        $('#audioTextModal').modal('show');
    };

    $scope.changeVoice = function () {
        $scope.newAudioTextDisabled = true;
        $scope.exeAlertInfo = false;
        $scope.errorAlert.show = false;
        $scope.newAudioExeTaShow = false;
        $scope.newAudioExeText = text;
        $scope.newAudioExeHeader = "Muuda teksti lugejat";
        $scope.newAudioExeTaHeader = "Sisestatud tekst";
        $scope.newAudioModalButton = {name: "Muuda lugejat", loading: "Muudan lugejat"};
        $('#audioTextModal').modal('show');
    };

    $scope.createNewAudioExe = function () {
        if($scope.newAudioExeText.length == 0){
            $scope.errorAlert = {
                text: "Teksti väli ei tohi olla tühi!",
                show: true
            };
        }
        else{
            $('#loadingExeButton').button('loading');
            audioTest.getAudioFiles(textToSentencesL($scope.newAudioExeText), $scope.voiceSelect.value).then(function (data) {
                audioTest.loadAudioL(data);
                $timeout(function(){
                $scope.someAudio.duration = audioTest.getDuration();
                $scope.someAudio.remaining = $scope.someAudio.duration;
                $scope.successAlert = true;
                text = $scope.newAudioExeText;
                $scope.newAudioExeText = "";
                $scope.errorAlert.show = false;
                $scope.someAudio.currentTime = 0;
                $scope.sliderProgress.value = 0;
                $scope.audioRepeat = 1;
                $scope.textDisabled = false;
                $scope.textVisibility = true;
                started = false;
                $scope.correctAnswer = "";
                $('#loadingExeButton').button('reset');
                $('#audioTextModal').modal('hide');
                }, 500);
            }, function(){
                $scope.errorAlert = {
                    text: "Kahjuks harjutuse loomine ei õnnestunud! Muuda teksti või proovi hiljem uuesti!",
                    show: true
                };
                $('#loadingExeButton').button('reset');
            });

        }
    };

    var textCheck = function (value) {
        var correct = text.split(" ");
        var inserted = value.split(" ");
        var allword = {};
        var nr = 0;
        var letterCorrect = 0;
        var letterWrong = 0;
        //console.log(correct);
        //console.log(inserted);
        for(var i = 0; i < inserted.length; i++){
            var word = wordCheck(correct[i], inserted[i]);
            allword[nr] = word.result;
            letterCorrect += word.letter.correct;
            letterWrong += word.letter.wrong;
            nr++;
            if(i != inserted.length-1) {
                allword[nr] = {0: {letter: " ", correct: true}};
                letterCorrect += 1;
                nr++;
            }
        }
        $scope.audioExerResult.typed.correct = letterCorrect;
        $scope.audioExerResult.typed.wrong = letterWrong;
        $scope.audioExerResult.typed.all = value.length;
        $scope.audioExerResult.correct.all = text.length;
        $scope.textChecked = allword;
    };

    var wordCheck = function (wordC, wordT) {
        var res = {};
        var len = 0;
        var letterWrong = 0;
        var letterCorrect = 0;
        if(wordC >= wordT){
            len = wordC.length;
        }
        else{
            len = wordT.length;
        }
        for(var i = 0; i < len; i++){
            if(wordT.length <= i){
                break;
            }
            if(wordC.length < i){
                res[i] = { letter: wordT[i], correct: false};
                letterWrong += 1;
            }
            else {
                if (wordC[i] == wordT[i]) {
                    res[i] = {letter: wordT[i], correct: true};
                    letterCorrect += 1;
                }
                else {
                    res[i] = {letter: wordT[i], correct: false};
                    letterWrong += 1;
                }
            }
        }

        return {result: res, letter: {wrong: letterWrong, correct: letterCorrect}};
    };

});

app.controller('NewExeController', function ($scope, $http, user, $filter, $anchorScroll, share) {
    $scope.newExeGroupName = "";
    $scope.newExercise = [{id: 1, name: "", value: "", type: {name: "", id: 0}, isNew: false}];
    $scope.newExe = 3;
    $scope.selectedExerciseType = {};
    $scope.exerciseTypes = [{name: "Täht haaval", id: 1}, {name: "Pikem tekst", id: 2}, {name:"Kuulamine", id: 3}];
    $scope.sortableOptions = {
        handle: '.sorting-drag',
        placeholder: "placeholder",
        connectWith: ".sorting-list"
    };
    $scope.exerciseExpiresTimes = [{name: "2 tundi", value: "2 hour"}, {name: "8 tundi", value: "8 hour"}, {name: "1 päev", value: "1 day"}, {name: "7 päeva", value: "7 day"}, {name: "30 päeva", value: "30 day"}, {name: "60 päeva", value: "60 day"}, {name: "90 päeva", value: "90 day"}];
    $scope.selectedExpiresTime = {};
    $scope.newExeError = false;
    $scope.newExeSuccess = false;
    $scope.createdExeLink = "";
    $scope.addNewExe = function () {
        $scope.newExe += 1;
        $scope.newExercise.push({id: $scope.newExe, name: "", value: "", type: {name: "", id: 0}, isNew: true});

    };
    $scope.delete = function (item) {
        var id = $scope.newExercise.indexOf(item);
        $scope.newExercise.splice(id, 1);
    };

    $scope.elemFocus = function (elem) {
        var elemLen = $scope.newExercise.length;
        for(var i = 0; i < elemLen; i++) {
            if(i == elem){
                $("#colap" + elem).collapse("show");
            }
            else {
                $("#colap" + i).collapse("hide");
            }

        }
    };
    $scope.elemClick = function (elem) {
        var elemLen = $scope.newExercise.length;
        for(var i = 0; i < elemLen; i++) {
            if(i == elem){
                $("#colap" + elem).collapse("toggle");
            }
            else {
                $("#colap" + i).collapse("hide");
            }

        }
    };

    $scope.createNewExes = function () {

        var currentTime = new Date();
        currentTime.setDate(currentTime.getDate() + 2);
        //console.log( $filter('date')(currentTime, 'yyyy-MM-dd HH:mm'));
        $('#newExeButton').button('loading');

        if($scope.newExeGroupName.length == 0 || angular.isUndefined($scope.selectedExpiresTime.value)){
            $scope.newExeError = true;
            $scope.newExeSuccess = false;
            $('#newExeButton').button('reset');
            $anchorScroll();
        }
        else{
            var correct = true;
            for(var j = 0; j < $scope.newExercise.length; j++){
                if($scope.newExercise[j].name.length == 0 || $scope.newExercise[j].value.length == 0
                    || $scope.newExercise[j].type.name.length == 0 || $scope.newExercise[j].type.id == 0){
                    $scope.newExeError = true;
                    $scope.newExeSuccess = false;
                    $('#newExeButton').button('reset');
                    $anchorScroll();
                    correct = false;
                    break;
                }
            }

            if(correct){
                $scope.newExeError = false;
                var userId = user.getUserId();
                if(angular.isUndefined(userId)){
                    userId = null;
                }
                $http.get("/newgroup/" + $scope.newExeGroupName + "/" + userId + "/" + $scope.selectedExpiresTime.value).then(function (res) {

                    if(!angular.isUndefined(res.data[0].id)){

                        for(var i = 0; i < $scope.newExercise.length; i++) {
                            var exetext = $scope.newExercise[i].value;
                            if($scope.newExercise[i].type.id == 1){
                                exetext = $scope.newExercise[i].value.replace(/\n/g, "");
                                exetext = exetext.replace(/ /g, "");
                            }
                            else if($scope.newExercise[i].type.id == 2) {
                                exetext = $scope.newExercise[i].value;
                            }
                            else if($scope.newExercise[i].type.id == 3) {
                                exetext = $scope.newExercise[i].value.replace(/\n/g, " ");
                            }
                            $http.post("/newexe", {name: $scope.newExercise[i].name, order: i,
                                type: $scope.newExercise[i].type.id, exercise: exetext,
                                group: res.data[0].id, expires: $scope.selectedExpiresTime.value}).then(function (response) {
                                    $scope.createdExeLink = res.data[0].id;
                                    $scope.newExeSuccess = true;
                                    share.setMineExes();
                                    $('#newExeButton').button('reset');
                                    $anchorScroll();
                            });
                            /**$http.get("/newexe/" + $scope.newExercise[i].name + "/" + $scope.newExercise[i].type.id +
                                "/" + escape(exetext) + "/" + i + "/" + res.data[0].id + "/" + $scope.selectedExpiresTime.value).then(function (response) {
                                    $scope.newExeSuccess = true;
                                    $('#newExeButton').button('reset');
                                    $anchorScroll();
                            });*/
                        }
                    }

                });

            }
        }

    };
});

app.controller('SharedExeController', function ($scope, $http, $stateParams, share) {
    $scope.sharedExeMain = [];
    $scope.sharedExercises = [];
    $scope.sharedDate = "";
    $scope.sharedExeType = "";
    $scope.sharedExeGroupErrorShow = false;
    $scope.sharedExeGroupShow = false;
    $http.get("/sharedgroup/" + $stateParams.exercise).then(function (res) {
        if(res.data.length > 0){
            $scope.sharedExeGroupShow = true;
        $scope.sharedExeMain = res.data[0];
        $scope.sharedDate = new Date($scope.sharedExeMain.expires);
        share.setShareGroup(res.data[0]);

            $http.get("/sharedexes/" + $stateParams.exercise).then(function (response) {
                $scope.sharedExercises = response.data;
                share.setShareExercises(response.data, true);
                if(response.data[0].type == 1){$scope.sharedExeType = "begin";}
                else if(response.data[0].type == 2){$scope.sharedExeType = "text";}
                else if(response.data[0].type == 3){$scope.sharedExeType = "audio";}
            });
        }
        else{
            $scope.sharedExeGroupErrorShow = true;
        }
    });
});

app.directive('focus', function () {
    return function (scope, element, attrs) {
        attrs.$observe('focus', function (newValue) {
            newValue === 'true' && element[0].focus();
        });
    }
});

app.filter("audioTrackTime", function () {
    return function (time) {
        var minutes = Math.floor(time/60);
        var seconds = Math.floor(time - minutes*60);
        var min;
        var sec;

        if(minutes < 10){
            min = "0"+minutes;
        }
        else {
            min = minutes;
        }

        if(seconds < 10){
            sec = "0"+seconds;
        }
        else {
            sec = seconds;
        }

        return min+":"+sec;
    }
});