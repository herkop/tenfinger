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

    };
});

app.controller('MenuController', function($scope, $location){
    $scope.active = function(loc){
        return loc == $location.path();
    };
});

app.controller('ExController', function($scope, $stateParams, keyboard) {
    $scope.keyboard = keyboard;
    var exes = ["jfjffjjfjjjfffjfjfjjfjff", "dkddkkkddkdkdkdkkkdddkd", "slllssllsllsssllsllslslsl", "aöaöaöaöaöööaaöaöaööaöö", "sösdjklalkdfjjllskkdjjfalsddkjfds"];

    if(!angular.isUndefined($stateParams.number)) {
        $scope.number = $stateParams.number;
        $scope.result = exes[$stateParams.number-1];
        keyboard.setWord(exes[$stateParams.number-1]);

        $scope.keyboard.letter_active = keyboard.getActiveLetter();
        $scope.keyboard.key_active = keyboard.getActiveKey();
        $scope.letter_style = keyboard.getLetterStyle();

    }

});

app.service('keyboard', function(){
    var step = 0;
    var word = null;
    var active_letter = null;
    var active_key = null;
    var letter_style = [];
    var wrong_key = null;
    this.getWord = function(){
        return word;
    };
    this.setWord = function(value){
        word = value;
        step = 0;
        active_key = word[step];
        active_letter = word[step]+step;
        letter_style = [];
        wrong_key = null;
    };
    this.getActiveLetter = function(){
        return active_letter;
    };
    this.getActiveKey = function(){
        return active_key;
    };
    this.getLetterStyle = function(){
        return letter_style;
    };
    this.getWrongKey = function(){
        return wrong_key;
    };

    this.letterTyped = function(letter){
        if(letter == word[step]){
            //correct - next letter
            if(wrong_key == null) {
                letter_style[step] = true;
            }

            step += 1;
            wrong_key = null;
            active_key = word[step];
            active_letter = word[step]+step;
        }
        else{
            //wrong - red color
            letter_style[step] = false;
            wrong_key = letter;
        }
    };

});