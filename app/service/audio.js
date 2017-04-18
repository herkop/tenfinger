var app = angular.module('TenFingers');
app.service('audioTest', function ($q, $http, ngAudio) {
    var audio = [];

    this.getAudioFiles = function(sentences, voice) {
        if(angular.isUndefined(voice)){
            voice = 15;
        }
        var urls = sentences.map(function (url) {
            var deffered = $q.defer();

            $http.get("https://heliraamat.eki.ee/syntees/koduleht.php?haal="+ voice +"&tekst=" + url).then(function (response) {
                    deffered.resolve(response);
                },
                function (error) {
                    deffered.reject(error);
                });
            return deffered.promise;
        });
        var deffered1 = $q.defer();
        $q.all(urls).then(function (arrayOfResults) {
            deffered1.resolve(arrayOfResults.map(function (url) {
                return "https" + url.data.mp3url.slice(4);
            }));
        });
        return deffered1.promise;
    };

    this.loadAudio = function (sentences){
        var files = [];
        for(var i = 0; !angular.isUndefined(sentences[i]); i++){
                files[i] = ngAudio.load(sentences[i].file);
        }
        audio = files;
    };

    this.loadAudioL = function (sentences){
        var files = [];
        for(var i = 0; !angular.isUndefined(sentences[i]); i++){
            files[i] = ngAudio.load(sentences[i]);
        }
        audio = files;

    };

    this.playAudio = function (repeat) {
        var audiosList = {
            files: {},
            value: {}
        };
        var sentNr = 0;
        for(var i = 0; !angular.isUndefined(audio[i]); i++) {
            for(var r = 0; r < repeat; r++) {
                audiosList.files[sentNr] = audio[i];
                sentNr++;
            }
        }
        return audiosList;
    };

    this.getDuration = function (repeat) {
        var sum = 0;
        audio.map(function(file){
            sum += file.duration;
        });
        if(angular.isUndefined(repeat)) {
            return sum;
        }
        else{
            return repeat * sum;
        }
    };
});