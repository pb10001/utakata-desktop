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
        //templateUrl: 'file://' + __dirname +'/top_page_beta.html',
        template: "<top></top>",
        controller:''
    })
    .when('/mondai/:room',{
        //templateUrl : 'file://' + __dirname +'/mondai.html',
        template:"<chat></chat>",
        controller : ''
        //controller : 'ChatController'
    })
	.otherwise({
		redirectTo: '/'
	});
  }]);

module.exports = app;