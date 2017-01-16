var app = angular.module('TenFingers', ['ui.router', 'ui.bootstrap', 'ngCookies']);

app.config(function($stateProvider, $locationProvider, $qProvider) {

    $stateProvider
        .state('home', {
            url: '/exercise',
            templateUrl: '/views/main.exe.html',
            controller: 'ExController',
            resolve: {}
        })
        .state('exercise', {
            url: '/exercise/:number',
            templateUrl: '/views/exe.html',
            controller: 'ExController',
            resolve: {}
        });

    $locationProvider.html5Mode(true);
    $qProvider.errorOnUnhandledRejections(false);
});
