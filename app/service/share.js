var app = angular.module('TenFingers');
app.service('share', function ($cookies, $http) {
    var shareGroup = null;
    var shareExercises = null;
    this.setShareExercises = function (exercises) {
        shareExercises = exercises;
        for(var i = 0; i < shareExercises.length; i++){
            if(shareExercises[i].type == 1){
                shareExercises[i].exeType = "begin";
            }
            else if(shareExercises[i].type == 2){
                shareExercises[i].exeType = "text";
            }
            else if(shareExercises[i].type == 3){
                shareExercises[i].exeType = "audio";
            }
        }
    };
    this.setShareGroup = function (group) {
        shareGroup = group;
    };
    this.getShareExercises = function () {
        return shareExercises;
    };
    this.getShareGroup = function () {
        return shareGroup;
    };

    this.getShareExe = function (exercise){
        if(shareExercises != null){
            for(var i = 0; i < shareExercises.length; i++){
                if(shareExercises[i].id == exercise){
                    return shareExercises[i];
                }
            }
        }
        return null;
    };
    this.getSharedNext = function (order) {
        if(shareExercises != null){
            for(var i = 0; i < shareExercises.length; i++){
                if(shareExercises[i].ord == order){
                    return shareExercises[i];
                }
            }
        }
        return null;
    };
});