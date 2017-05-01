var app = angular.module('TenFingers', ['ui.router', 'ui.bootstrap', 'ngCookies', 'toggle-switch', 'ngAudio', 'rzModule', 'diff-match-patch', 'ui.sortable']);

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
            url: '/exercise/advanced/audio',
            templateUrl: '/views/exe-audio.html',
            controller: 'ExAudioController',
            resolve: {}
        })
        .state('exerciseText', {
            url: '/exercise/advanced/text',
            templateUrl: '/views/exe-text.html',
            controller: 'ExTextController',
            resolve: {}
        })
        .state('exerciseNew', {
            url: '/exercise/new',
            templateUrl: '/views/new-exercise.html',
            controller: 'NewExeController',
            resolve: {}
        })
        .state('exerciseShare', {
            url: '/exercise/shared/:exercise',
            templateUrl: '/views/share.html',
            controller: 'SharedExeController',
            resolve: {}
        })
        .state('exerciseShareBegin', {
            url: '/exercise/shared/begin/:sharenumber',
            templateUrl: '/views/exe.html',
            controller: 'ExController',
            resolve: {}
        })
        .state('exerciseShareText', {
            url: '/exercise/shared/text/:sharenumber',
            templateUrl: '/views/exe-text.html',
            controller: 'ExTextController',
            resolve: {}
        })
        .state('exerciseShareAudio', {
            url: '/exercise/shared/audio/:sharenumber',
            templateUrl: '/views/exe-audio.html',
            controller: 'ExAudioController',
            resolve: {}
        });

    $locationProvider.html5Mode(true);
    $qProvider.errorOnUnhandledRejections(false);
});