var app = angular.module('TenFingers', ['ui.router', 'ui.bootstrap', 'ngCookies', 'toggle-switch', 'ngAudio', 'rzModule', 'diff-match-patch']);

app.config(function($stateProvider, $locationProvider, $qProvider) {

    $stateProvider
        .state('home', {
            url: '/exercise',
            templateUrl: '/views/main.exe.html',
            controller: 'ExController',
            resolve: {}
        })
        .state('exercise', {
            url: '/exercise/begin/:number',
            templateUrl: '/views/exe.html',
            controller: 'ExController',
            resolve: {}
        })
        .state('exerciseAudio', {
            url: '/exercise/audio',
            templateUrl: '/views/exe-audio.html',
            controller: 'ExAudioController',
            resolve: {}
        });

    $locationProvider.html5Mode(true);
    $qProvider.errorOnUnhandledRejections(false);
});