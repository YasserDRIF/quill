const $ = require('jquery');

var angular = require('angular');
var uiRouter = require('angular-ui-router');
var swal = require('sweetalert');

var app = angular.module('reg', ['ui.router']);

const constants = require('./constants.js');

var AuthService = require('./services/AuthService.js');
var AuthInterceptor = require('./interceptors/AuthInterceptor.js');
var Session = require('./modules/Session.js');

var routes = require('./routes.js');

app.config(function($httpProvider, $compileProvider) {
	// Add auth token to Authorization header
	$httpProvider.interceptors.push('AuthInterceptor');
	$compileProvider.debugInfoEnabled(false);
	$compileProvider.commentDirectivesEnabled(false);
	$compileProvider.cssClassDirectivesEnabled(false);
}).run([
	'AuthService',
	'Session',
	function(AuthService, Session) {
		// Startup, login if there's  a token.
		var token = Session.getToken();
		if (token) {
			AuthService.loginWithToken(token);
		}
	}
]);
