//var angular = require('angular');
var app = angular.module('TenFingers');

app.controller('MainController', function($scope) {

});

app.controller('ExController', function($scope, $location, $stateParams) {
    $scope.active = function(loc){
        return loc == $location.path();
    };
    var step = 0;
    var exes = ["jfjffjjfjjjfffjfjfjjfjff", "dkddkkkddkdkdkdkkkdddkd", "slllssllsllsssllsllslslsl", "aöaöaöaöaöööaaöaöaööaöö", "sösdjklalkdfjjllskkdjjfalsddkjfds"];
    $scope.keys = " No key"
    //if(angular.isUndefined($scope.result)) {
        //$scope.result = [];
        $scope.result = exes[0];
        step = 0;
    //}
    /**if(!angular.isUndefined($stateParams.number)) {
        $scope.result = exes[$stateParams.number-1];
        step = 0;
        $scope.key_active = $scope.result[step];
        $scope.letter_active = $scope.result[step]+step;
        $scope.letter_style = [];
            //$scope.key_wrong = "";

    }*/
        if(angular.isUndefined($scope.key_active) && step == 0) {
            $scope.key_active = $scope.result[step];
        }
        if(angular.isUndefined($scope.letter_active) && step == 0) {
            $scope.letter_active = $scope.result[step]+step;
        }
        if(angular.isUndefined($scope.letter_style)) {
            $scope.letter_style = [];
        }

        $scope.onKeyDown = function ($event) {
            if ($scope.result[step] == $event.key) {
                if($scope.key_wrong == "" || angular.isUndefined($scope.key_wrong)) {
                    $scope.letter_style[step] = true;
                }
                step += 1;

                $scope.key_wrong = "";
                $scope.key_active = $scope.result[step];
                $scope.letter_active = $scope.result[step]+step;

            }
            else {
                $scope.letter_style[step] = false;
                $scope.key_wrong = $event.key;
            }
        }

});