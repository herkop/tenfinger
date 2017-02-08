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
    var keyHint = true;
    var wrong_type = null;
    var letterHint = true;
    var letter_style_saved = [];
    this.getWord = function(){
        return word;
    };
    this.setWord = function(value){
        word = value;
        step = 0;
        if(keyHint) {
            active_key = word[step];
        }
        else{
            active_key = null;
        }
        active_letter = word[step]+step;
        letter_style = [];
        wrong_key = null;
        correct = 0;
        wrong = 0;
        same_char = false;
        start_time = 0;
        finish_time = 0;
        div = 0;
        wrong_type = null;
        letter_style_saved = [];
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
            if(wrong_type == null) {
                if(letterHint) {
                    letter_style[step] = true;
                    letter_style_saved[step] = true;
                }
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
            if(keyHint){
                wrong_key = null;
                active_key = word[step];
            }
            wrong_type = null;
            active_letter = word[step]+step;
        }
        else{
            //wrong - red color
            if(letterHint) {
                letter_style[step] = false;
                letter_style_saved[step] = false;
            }
            if(keyHint) {
                wrong_key = letter;
            }
            wrong_type = letter;
            if(!same_char && word.length > correct + wrong) {
                wrong += 1;
                same_char = true;
            }
        }
    };

    this.setKeyboardHint = function (value) {
        keyHint = value;
        if(value) {
            if(word != null) {
                active_key = word[step];
                wrong_key = wrong_type;
            }
        }else{
            active_key = null;
            wrong_key = null;
        }
    };

    this.setLetterHint = function (value){
      letterHint = value;
      if(value){
          letter_style = letter_style_saved;
      }
      else{
          letter_style = [];
      }
    };

});