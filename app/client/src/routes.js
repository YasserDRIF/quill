const angular = require('angular');
var ocLazyLoad = require('oclazyload')

const SettingsService = require('./services/SettingsService.js');
const UserService = require('./services/UserService.js');
const MarketingService = require('./services/MarketingService.js');

const MarketCtrl = require('../views/market/MarketCtrl.js');
const MarketDataCtrl = require('../views/MarketData/MarketDataCtrl.js');


const AdminCtrl = require('../views/admin/AdminCtrl.js');
const AdminSettingsCtrl = require('../views/admin/settings/AdminSettingsCtrl.js');
const AdminStatsCtrl = require('../views/admin/stats/AdminStatsCtrl.js');
const AdminMailCtrl = require('../views/admin/mail/AdminMailCtrl.js');
const AdminUserCtrl = require('../views/admin/user/AdminUserCtrl.js');
const AdminUsersCtrl = require('../views/admin/users/AdminUsersCtrl.js');
const adminMarketingCtrl = require('../views/admin/marketing/adminMarketingCtrl.js');
const CheckinCtrl = require('../views/checkin/CheckinCtrl.js');
const DashboardCtrl = require('../views/dashboard/DashboardCtrl.js');
const ApplicationCtrl = require('../views/application/ApplicationCtrl.js');
const ConfirmationCtrl = require('../views/confirmation/ConfirmationCtrl.js');
const LoginCtrl = require('../views/login/LoginCtrl.js');
const ResetCtrl = require('../views/reset/ResetCtrl.js');
const SidebarCtrl = require('../views/sidebar/SidebarCtrl.js');
const VerifyCtrl = require('../views/verify/VerifyCtrl.js');

angular.module('reg')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function(
      $stateProvider,
      $urlRouterProvider,
      $locationProvider) {

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/404");
    
    // Set up de states
    $stateProvider
      .state('home', {
        url: "/",
        templateUrl: "views/login/login.html",
        controller: 'LoginCtrl',
        data: {
          requireLogin: false
        },
        resolve: {
          'settings': function(SettingsService){
            return SettingsService.getPublicSettings();
          }
        }
      })
      .state('Market', {
        url: "/Market",
        templateUrl: "views/market/market.html",
        controller: 'MarketCtrl',
        data: {
          requireLogin: false
        }
      })
      .state('MarketData', {
        url: "/MarketData",
        templateUrl: "views/MarketData/MarketData.html",
        controller: 'MarketDataCtrl',
        data: {
          requireLogin: false
        }
      })
      .state('app', {
        views: {
          '': {
            templateUrl: "views/base.html"
          },
          'sidebar@app': {
            templateUrl: "views/sidebar/sidebar.html",
            controller: 'SidebarCtrl',
            resolve: {
              settings: function(SettingsService) {
                return SettingsService.getPublicSettings();
              }
            }
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('app.dashboard', {
        url: "/dashboard",
        templateUrl: "views/dashboard/dashboard.html",
        controller: 'DashboardCtrl',
        resolve: {
          currentUser: function(UserService){
            return UserService.getCurrentUser();
          },
          settings: function(SettingsService){
            return SettingsService.getPublicSettings();
          }
        },
      })
      .state('app.application', {
        url: "/application",
        templateUrl: "views/application/application.html",
        controller: 'ApplicationCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: function(UserService){
            return UserService.getCurrentUser();
          },
          settings: function(SettingsService){
            return SettingsService.getPublicSettings();
          }
        }
      })
      .state('app.confirmation', {
        url: "/confirmation",
        templateUrl: "views/confirmation/confirmation.html",
        controller: 'ConfirmationCtrl',
        data: {
          requireAdmitted: true
        },
        resolve: {
          currentUser: function(UserService){
            return UserService.getCurrentUser();
          }
        }
      })
      .state('app.admin', {
        views: {
          '': {
            templateUrl: "views/admin/admin.html",
            controller: 'AdminCtrl'
          }
        },
        data: {
          requireAdmin: true
        }
      })
      .state('app.checkin', {
        url: '/checkin',
        templateUrl: 'views/checkin/checkin.html',
        controller: 'CheckinCtrl',
        data: {
          requireVolunteer: true
        }
      })
      .state('app.admin.stats', {
        url: "/admin",
        templateUrl: "views/admin/stats/stats.html",
        controller: 'AdminStatsCtrl'
      })
      .state('app.admin.mail', {
        url: "/admin/mail",
        templateUrl: "views/admin/mail/mail.html",
        controller: 'AdminMailCtrl'
      })
      .state('app.admin.marketing', {
        url: "/admin/marketing",
        templateUrl: "views/admin/marketing/marketing.html",
        controller: 'adminMarketingCtrl'
      })
      .state('app.admin.users', {
        url: "/admin/users?" +
          '&page' +
          '&size' +
          '&query',
        templateUrl: "views/admin/users/users.html",
        controller: 'AdminUsersCtrl'
      })
      .state('app.admin.user', {
        url: "/admin/users/:id",
        templateUrl: "views/admin/user/user.html",
        controller: 'AdminUserCtrl',
        resolve: {
          'user': function($stateParams, UserService){
            return UserService.get($stateParams.id);
          }
        }
      })
      .state('app.admin.settings', {
        url: "/admin/settings",
        templateUrl: "views/admin/settings/settings.html",
        controller: 'AdminSettingsCtrl',
      })
      .state('reset', {
        url: "/reset/:token",
        templateUrl: "views/reset/reset.html",
        controller: 'ResetCtrl',
        data: {
          requireLogin: false
        }
      })
      .state('verify', {
        url: "/verify/:token",
        templateUrl: "views/verify/verify.html",
        controller: 'VerifyCtrl',
        data: {
          requireLogin: false
        }
      })
      .state('404', {
        url: "/404",
        templateUrl: "views/404.html",
        data: {
          requireLogin: false
        }
      });

    $locationProvider.html5Mode({
      enabled: true,
    });

  }])
  .run($transitions => {
    $transitions.onStart({}, transition => {
      const Session = transition.injector().get("Session");

      var requireLogin = transition.to().data.requireLogin;
      var requireAdmin = transition.to().data.requireAdmin;
      var requireVolunteer = transition.to().data.requireVolunteer;
      var requireVerified = transition.to().data.requireVerified;
      var requireAdmitted = transition.to().data.requireAdmitted;

      if (requireLogin && !Session.getToken()) {
        return transition.router.stateService.target("home");
      }

      if (requireAdmin && !Session.getUser().admin) {
        return transition.router.stateService.target("app.dashboard");
      }

      if (requireVolunteer && !Session.getUser().volunteer && requireAdmin && !Session.getUser().admin) {
        return transition.router.stateService.target("app.dashboard");
      }

      if (requireVerified && !Session.getUser().verified) {
        return transition.router.stateService.target("app.dashboard");
      }

      if (requireAdmitted && !Session.getUser().status.admitted) {
        return transition.router.stateService.target("app.dashboard");
      }
    });

    $transitions.onSuccess({}, transition => {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  });
