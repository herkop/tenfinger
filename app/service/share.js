var app = angular.module('TenFingers');
app.service('share', function ($cookies, $http, $q, user) {
    var shareGroup = null;
    var shareExercises = null;
    var shareSet = null;
    var mineExercises = null;
    this.setShareExercises = function (exercises, fromMain) {
        if(fromMain){
            shareSet = true;
        }
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

    this.isFromMain = function(){
      return shareSet;
    };

    this.getMineExercises = function () {
      return mineExercises;
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

    this.getExercises = function (exeNr) {
        var deffered = $q.defer();
        if(shareGroup == null || shareGroup.id != exeNr) {
            $http.get("/sharedgroup/" + exeNr).then(function (res) {
                if (res.data.length > 0) {
                    shareGroup = res.data[0];

                    $http.get("/sharedexes/" + exeNr).then(function (response) {
                        shareExercises = response.data;
                        deffered.resolve(response.data);

                    });
                }
                else {
                    deffered.reject(true);
                }

            });
        }
        else{
            deffered.resolve(true);
        }
        return deffered.promise;
    };

    this.setMineExes = function () {
        if(user.getUser() != null) {
            $http.get("/myexes/" + user.getUserId()).then(function (res) {
                mineExercises = res.data;
            })
        }
    };
});