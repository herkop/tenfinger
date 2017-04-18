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
    var keyDownPreviousTime = 0;
    var typedCharSum = 0;
    var typedChar = 0;
    $scope.onKeyDown = function ($event) {
        //speed
        var keyDownTime = (new Date()).getTime();
        if (keyDownTime == 0){
            keyDownPreviousTime = keyDownTime;
        }
        else{
            var keyTime = keyDownTime - keyDownPreviousTime;
            var sec = keyTime / 1000;
            $scope.keyboard.speed = Math.floor(60 / sec);
            keyDownPreviousTime = keyDownTime;
            typedCharSum += 1;
            typedChar += $scope.keyboard.speed;
            $scope.keyboard.avgSpeed = Math.floor(typedChar / typedCharSum);
        }
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
    $scope.menu = {
        begin: true,
        audio: true
    };
    $scope.active = function(loc){
        var hrefLocation = $location.path().split("/");
        if(hrefLocation[1] == "exercise"){
            if(hrefLocation[2] == "begin"){
                $scope.menu.begin = false;
            }
            else if(hrefLocation[2] == "audio"){
                $scope.menu.audio = false;
            }
        }
        return loc == $location.path();
    };
});

app.controller('ExController', function($scope, $stateParams, $http, keyboard, $timeout, $state) {
    //$cookies.put('user', 'Tester');
    $scope.keyboard = keyboard;
    //var exes = ["jfjffjjfjjjfffjfjfjjfjff", "dkddkkkddkdkdkdkkkdddkd", "slllssllsllsssllsllslslsl", "aöaöaöaöaöööaaöaöaööaöö", "sösdjklalkdfjjllskkdjjfalsddkjfds"];
    var endMes = {"excellent": "Väga tubli! Võid järgmise harjutuse juurde asuda.", "good": "Tubli! Tegid ainult mõne üksiku vea.", "bad": "Harjuta veel! Liiga palju vigu oled teinud."};

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

    if(!angular.isUndefined($stateParams.number)) {
        $scope.exNumber = $stateParams.number;
        $scope.nextExNumber = parseInt($stateParams.number) + 1;
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
            $scope.keyboard.speed = 0;
            $scope.keyboard.avgSpeed = 0;
            $timeout(timeSpent, 100);
        });

        $scope.nextExButton = function(){
            $('#exeEndModal').modal('hide');
            $state.go('exercise', {'number':$scope.nextExNumber});
        };
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

app.controller('ExAudioController', function($scope, $http, ngAudio, $q, audioTest, $timeout, $window){
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
    $scope.voiceSelect = 0;
    $scope.voiceValues = [
        {value: 15, name: "Tõnu"},
        {value: 14, name: "Eva"}];
    $scope.repeatDisabled = false;
    $scope.newAudioTextDisabled = false;
    $scope.newAudioModalButton = "Loo harjutus";
        $scope.voice = {
        15: ngAudio.load("/media/test/1704180143420_5986.mp3"),
        14: ngAudio.load("/media/test/1704180143110_3422.mp3")
    };
    audioTest.loadAudio($scope.exampleAudio);
    $timeout(function () {
        $scope.someAudio.duration = audioTest.getDuration();
        $scope.someAudio.remaining = $scope.someAudio.duration;
    },500);


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
                }, 100);
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
        return sentences;
    };
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
            $scope.textDisabled = true;
            $scope.textVisibility = false;
            $scope.correctAnswer = text;
            textCheck($scope.textInserted);
        }
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