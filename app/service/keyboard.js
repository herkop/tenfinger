var app = angular.module('TenFingers');
app.service('keyboard', function(){
    var step = 0;
    var word = null;
    var active_letter = null;
    var active_key = null;
    var letter_style = [];
    var wrong_key = null;
    var correct = 0;
    var wrong = 0;
    var same_char = false;
    var start_time = 0;
    var finish_time = 0;
    var div = 0;
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
        correct = 0;
        wrong = 0;
        same_char = false;
        start_time = 0;
        finish_time = 0;
        div = 0;
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

    this.getCorrect = function(){
        return correct;
    };

    this.getWrong = function(){
        return wrong;
    };

    this.getStartTime = function(){
        return start_time;
    };

    this.getFinishTime = function(){
        return finish_time;
    };

    this.getDiv = function () {
        return div;
    };

    this.letterTyped = function(letter){
        if(letter == word[step]){
            //correct - next letter
            if(wrong_key == null) {
                letter_style[step] = true;
                correct += 1;
            }
            if(step == 0){
                start_time = (new Date()).getTime();
            }
            if(step == word.length-1){
                finish_time = (new Date()).getTime();
                div = (finish_time - start_time) / 1000;
            }

            step += 1;
            same_char = false;
            wrong_key = null;
            active_key = word[step];
            active_letter = word[step]+step;
        }
        else{
            //wrong - red color
            letter_style[step] = false;
            wrong_key = letter;
            if(!same_char && word.length > correct + wrong) {
                wrong += 1;
                same_char = true;
            }
        }
    };

});