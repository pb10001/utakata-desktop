var $ = require('jquery');
window.jQuery = $;
var bootstrap = require('bootstrap');
var angular = require('angular');
var ngRoute = require('angular-route');
var app = angular.module('App', ['ngRoute']);
app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enabled:true,
    requireBase: false
  });
  $routeProvider
    .when('/',{
        template: "<top></top>",
        controller:''
    })
    .when('/mondai/:room',{
        template:"<chat></chat>",
        controller : ''
    })
	.otherwise({
		redirectTo: '/'
	});
  }]);

module.exports = app;
