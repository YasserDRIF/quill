var app = angular.module('reg', [
  'ui.router',
  'chart.js',
]);

app
  .config([
    '$httpProvider',
    function($httpProvider){

      // Add auth token to Authorization header
      $httpProvider.interceptors.push('AuthInterceptor');

    }])
  .run([
    'AuthService',
    'Session',
    function(AuthService, Session){

      // Startup, login if there's  a token.
      var token = Session.getToken();
      if (token){
        AuthService.loginWithToken(token);
      }

  }]);

angular.module('reg')
    .constant('EVENT_INFO', {
        NAME: 'Hackit 2020',
    })
    .constant('DASHBOARD', {
        UNVERIFIED: 'You should have received an email asking you verify your email. Click the link in the email and you can start your application!',
        INCOMPLETE_TITLE: 'You still need to complete your application!',
        INCOMPLETE: 'If you do not complete your application before the [APP_DEADLINE], you will not be considered for the admissions lottery!',
        SUBMITTED_TITLE: 'Your application has been submitted!',
        SUBMITTED: 'Feel free to edit it at any time. However, once registration is closed, you will not be able to edit it any further.\nAdmissions will be determined by a random lottery. Please make sure your information is accurate before registration is closed!',
        CLOSED_AND_INCOMPLETE_TITLE: 'Unfortunately, registration has closed, and the lottery process has begun.',
        CLOSED_AND_INCOMPLETE: 'Because you have not completed your profile in time, you will not be eligible for the lottery process.',
        ADMITTED_AND_CAN_CONFIRM_TITLE: 'You must confirm by [CONFIRM_DEADLINE].',
        ADMITTED_AND_CANNOT_CONFIRM_TITLE: 'Your confirmation deadline of [CONFIRM_DEADLINE] has passed.',
        ADMITTED_AND_CANNOT_CONFIRM: 'Although you were accepted, you did not complete your confirmation in time.\nUnfortunately, this means that you will not be able to attend the event, as we must begin to accept other applicants on the waitlist.\nWe hope to see you again next year!',
        CONFIRMED_NOT_PAST_TITLE: 'You can edit your confirmation information until [CONFIRM_DEADLINE]',
        DECLINED: 'We\'re sorry to hear that you won\'t be able to make it to Hackit 2020! :(\nMaybe next year! We hope you see you again soon.',
    })
    .constant('TEAM',{
        NO_TEAM_REG_CLOSED: 'Unfortunately, it\'s too late to enter the lottery with a team.\nHowever, you can still form teams on your own before or during the event!',
    });


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
      .state('login', {
        url: "/login",
        templateUrl: "views/login/login.html",
        controller: 'LoginCtrl',
        data: {
          requireLogin: false,
          requireLogout: true
        },
        resolve: {
          'settings': ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('home', {
        url: "/",
        templateUrl: "views/login/login.html",
        controller: 'LoginCtrl',
        data: {
          requireLogin: false,
          requireLogout: true
        },
        resolve: {
          'settings': ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })

      // .state('home', {
      //   url: "/",
      //   templateUrl: "views/home/home.html",
      //   controller: 'HomeCtrl',
      //   data: {
      //     requireLogin: false
      //   },
      //   resolve: {
      //     'settings': function(SettingsService){
      //       return SettingsService.getPublicSettings();
      //     }
      //   }
      // })

      .state('app', {
        views: {
          '': {
            templateUrl: "views/base.html",
            controller: "BaseCtrl",
          },
          'sidebar@app': {
            templateUrl: "views/sidebar/sidebar.html",
            controller: 'SidebarCtrl',
            resolve: {
              settings: ["SettingsService", function(SettingsService) {
                return SettingsService.getPublicSettings();
              }]
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
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
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
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
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
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }]
        }
      })
      .state('app.challenges', {
        url: "/challenges",
        templateUrl: "views/challenges/challenges.html",
        controller: 'ChallengesCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('app.team', {
        url: "/team",
        templateUrl: "views/team/team.html",
        controller: 'TeamCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('app.admin', {
        views: {
          '': {
            templateUrl: "views/admin/admin.html",
            controller: 'adminCtrl'
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
      .state('app.admin.challenges', {
        url: "/admin/challenges",
        templateUrl: "views/admin/challenges/challenges.html",
        controller: 'adminChallengesCtrl'
      })
      .state('app.admin.challenge', {
        url: "/admin/challenges/:id",
        templateUrl: "views/admin/challenge/challenge.html",
        controller: 'adminChallengeCtrl',
        resolve: {
          'challenge': ["$stateParams", "ChallengeService", function($stateParams, ChallengeService){
            return ChallengeService.get($stateParams.id);
          }]
        }
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
          'user': ["$stateParams", "UserService", function($stateParams, UserService){
            return UserService.get($stateParams.id);
          }]
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
  .run([
    '$rootScope',
    '$state',
    'Session',
    function(
      $rootScope,
      $state,
      Session ){

      $rootScope.$on('$stateChangeSuccess', function() {
         document.body.scrollTop = document.documentElement.scrollTop = 0;
      });

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        var requireLogin = toState.data.requireLogin;
        var requireLogout = toState.data.requireLogout;
        var requireAdmin = toState.data.requireAdmin;
        var requireVolunteer = toState.data.requireVolunteer;
        var requireVerified = toState.data.requireVerified;
        var requireAdmitted = toState.data.requireAdmitted;
  
        if (requireLogin && !Session.getToken()) {
          event.preventDefault();
          $state.go('home');
        }
  
        if (requireLogout && Session.getToken()) {
          event.preventDefault();
          $state.go('app.dashboard');
        }
        
        if (requireAdmin && !Session.getUser().admin) {
          event.preventDefault();           
          $state.go('app.dashboard');
        }
  
        if (requireVolunteer && !Session.getUser().volunteer && requireAdmin && !Session.getUser().admin) {
          event.preventDefault();           
          $state.go('app.dashboard');
        }
  
        if (requireVerified && !Session.getUser().verified) {
          event.preventDefault();           
          $state.go('app.dashboard');
        }
  
        if (requireAdmitted && !Session.getUser().status.admitted) {
          event.preventDefault();           
          $state.go('app.dashboard');
        }
  

      });

    }]);

angular.module('reg')
  .factory('AuthInterceptor', [
    'Session',
    function(Session){
      return {
          request: function(config){
            var token = Session.getToken();
            if (token){
              config.headers['x-access-token'] = token;
            }
            return config;
          }
        };
    }]);

angular.module('reg')
  .service('Session', [
    '$rootScope',
    '$window',
    function($rootScope, $window){

    this.create = function(token, user){
      $window.localStorage.jwt = token;
      $window.localStorage.userId = user._id;
      $window.localStorage.currentUser = JSON.stringify(user);
      $rootScope.currentUser = user;
    };

    this.destroy = function(onComplete){
      delete $window.localStorage.jwt;
      delete $window.localStorage.userId;
      delete $window.localStorage.currentUser;
      $rootScope.currentUser = null;
      if (onComplete){
        onComplete();
      }
    };

    this.getToken = function(){
      return $window.localStorage.jwt;
    };

    this.getUserId = function(){
      return $window.localStorage.userId;
    };

    this.getUser = function(){
      return JSON.parse($window.localStorage.currentUser);
    };

    this.setUser = function(user){
      $window.localStorage.currentUser = JSON.stringify(user);
      $rootScope.currentUser = user;
    };

  }]);
angular.module('reg')
  .factory('Utils', [
    function(){
      return {
        isRegOpen: function(settings){
          return Date.now() > settings.timeOpen && Date.now() < settings.timeClose;
        },
        isAfter: function(time){
          return Date.now() > time;
        },
        formatTime: function(time){

          if (!time){
            return "Invalid Date";
          }

          date = new Date(time);
          // Hack for timezone
          return moment(date).format('dddd, MMMM Do YYYY, h:mm a') +
            " " + date.toTimeString().split(' ')[2];

        }
      };
    }]);

(function($) {
    jQuery.fn.extend({
        html5_qrcode: function(qrcodeSuccess, qrcodeError, videoError) {
            return this.each(function() {
                var currentElem = $(this);

                var height = currentElem.height();
                var width = currentElem.width();

                if (height == null) {
                    height = 250;
                }

                if (width == null) {
                    width = 300;
                }

                // var vidElem = $('<video width="' + width + 'px" height="' + height + 'px"></video>').appendTo(currentElem);
                var vidElem = $('<video width="' + width + 'px" height="' + height + 'px" autoplay playsinline></video>').appendTo(currentElem);
                var canvasElem = $('<canvas id="qr-canvas" width="' + (width - 2) + 'px" height="' + (height - 2) + 'px" style="display:none;"></canvas>').appendTo(currentElem);

                var video = vidElem[0];
                var canvas = canvasElem[0];
                var context = canvas.getContext('2d');
                var localMediaStream;

                var scan = function() {
                    if (localMediaStream) {
                        context.drawImage(video, 0, 0, 307, 250);

                        try {
                            qrcode.decode();
                        } catch (e) {
                            qrcodeError(e, localMediaStream);
                        }

                        $.data(currentElem[0], "timeout", setTimeout(scan, 500));

                    } else {
                        $.data(currentElem[0], "timeout", setTimeout(scan, 500));
                    }
                };//end snapshot function

                window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

                var successCallback = function(stream) {
                    // video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
                    video.srcObject = stream;
                    localMediaStream = stream;
                    $.data(currentElem[0], "stream", stream);

                    video.play();
                    $.data(currentElem[0], "timeout", setTimeout(scan, 1000));
                };

                // Call the getUserMedia method with our callback functions
                if (navigator.getUserMedia) {
                    navigator.getUserMedia({video: { facingMode: "environment" } }, successCallback, function(error) {
                        videoError(error, localMediaStream);
                    });
                } else {
                    console.log('Native web camera streaming (getUserMedia) not supported in this browser.');
                    // Display a friendly "sorry" message to the user
                }

                qrcode.callback = function (result) {
                    qrcodeSuccess(result, localMediaStream);
                };
            }); // end of html5_qrcode
        },
        html5_qrcode_stop: function() {
            return this.each(function() {
                //stop the stream and cancel timeouts
                $(this).data('stream').getVideoTracks().forEach(function(videoTrack) {
                    videoTrack.stop();
                });

                clearTimeout($(this).data('timeout'));
            });
        }
    });
})(jQuery);


function ECB(count,dataCodewords){this.count=count,this.dataCodewords=dataCodewords,this.__defineGetter__("Count",function(){return this.count}),this.__defineGetter__("DataCodewords",function(){return this.dataCodewords})}function ECBlocks(ecCodewordsPerBlock,ecBlocks1,ecBlocks2){this.ecCodewordsPerBlock=ecCodewordsPerBlock,ecBlocks2?this.ecBlocks=new Array(ecBlocks1,ecBlocks2):this.ecBlocks=new Array(ecBlocks1),this.__defineGetter__("ECCodewordsPerBlock",function(){return this.ecCodewordsPerBlock}),this.__defineGetter__("TotalECCodewords",function(){return this.ecCodewordsPerBlock*this.NumBlocks}),this.__defineGetter__("NumBlocks",function(){for(var total=0,i=0;i<this.ecBlocks.length;i++)total+=this.ecBlocks[i].length;return total}),this.getECBlocks=function(){return this.ecBlocks}}function Version(versionNumber,alignmentPatternCenters,ecBlocks1,ecBlocks2,ecBlocks3,ecBlocks4){this.versionNumber=versionNumber,this.alignmentPatternCenters=alignmentPatternCenters,this.ecBlocks=new Array(ecBlocks1,ecBlocks2,ecBlocks3,ecBlocks4);for(var total=0,ecCodewords=ecBlocks1.ECCodewordsPerBlock,ecbArray=ecBlocks1.getECBlocks(),i=0;i<ecbArray.length;i++){var ecBlock=ecbArray[i];total+=ecBlock.Count*(ecBlock.DataCodewords+ecCodewords)}this.totalCodewords=total,this.__defineGetter__("VersionNumber",function(){return this.versionNumber}),this.__defineGetter__("AlignmentPatternCenters",function(){return this.alignmentPatternCenters}),this.__defineGetter__("TotalCodewords",function(){return this.totalCodewords}),this.__defineGetter__("DimensionForVersion",function(){return 17+4*this.versionNumber}),this.buildFunctionPattern=function(){var dimension=this.DimensionForVersion,bitMatrix=new BitMatrix(dimension);bitMatrix.setRegion(0,0,9,9),bitMatrix.setRegion(dimension-8,0,8,9),bitMatrix.setRegion(0,dimension-8,9,8);for(var max=this.alignmentPatternCenters.length,x=0;max>x;x++)for(var i=this.alignmentPatternCenters[x]-2,y=0;max>y;y++)0==x&&(0==y||y==max-1)||x==max-1&&0==y||bitMatrix.setRegion(this.alignmentPatternCenters[y]-2,i,5,5);return bitMatrix.setRegion(6,9,1,dimension-17),bitMatrix.setRegion(9,6,dimension-17,1),this.versionNumber>6&&(bitMatrix.setRegion(dimension-11,0,3,6),bitMatrix.setRegion(0,dimension-11,6,3)),bitMatrix},this.getECBlocksForLevel=function(ecLevel){return this.ecBlocks[ecLevel.ordinal()]}}function buildVersions(){return new Array(new Version(1,new Array,new ECBlocks(7,new ECB(1,19)),new ECBlocks(10,new ECB(1,16)),new ECBlocks(13,new ECB(1,13)),new ECBlocks(17,new ECB(1,9))),new Version(2,new Array(6,18),new ECBlocks(10,new ECB(1,34)),new ECBlocks(16,new ECB(1,28)),new ECBlocks(22,new ECB(1,22)),new ECBlocks(28,new ECB(1,16))),new Version(3,new Array(6,22),new ECBlocks(15,new ECB(1,55)),new ECBlocks(26,new ECB(1,44)),new ECBlocks(18,new ECB(2,17)),new ECBlocks(22,new ECB(2,13))),new Version(4,new Array(6,26),new ECBlocks(20,new ECB(1,80)),new ECBlocks(18,new ECB(2,32)),new ECBlocks(26,new ECB(2,24)),new ECBlocks(16,new ECB(4,9))),new Version(5,new Array(6,30),new ECBlocks(26,new ECB(1,108)),new ECBlocks(24,new ECB(2,43)),new ECBlocks(18,new ECB(2,15),new ECB(2,16)),new ECBlocks(22,new ECB(2,11),new ECB(2,12))),new Version(6,new Array(6,34),new ECBlocks(18,new ECB(2,68)),new ECBlocks(16,new ECB(4,27)),new ECBlocks(24,new ECB(4,19)),new ECBlocks(28,new ECB(4,15))),new Version(7,new Array(6,22,38),new ECBlocks(20,new ECB(2,78)),new ECBlocks(18,new ECB(4,31)),new ECBlocks(18,new ECB(2,14),new ECB(4,15)),new ECBlocks(26,new ECB(4,13),new ECB(1,14))),new Version(8,new Array(6,24,42),new ECBlocks(24,new ECB(2,97)),new ECBlocks(22,new ECB(2,38),new ECB(2,39)),new ECBlocks(22,new ECB(4,18),new ECB(2,19)),new ECBlocks(26,new ECB(4,14),new ECB(2,15))),new Version(9,new Array(6,26,46),new ECBlocks(30,new ECB(2,116)),new ECBlocks(22,new ECB(3,36),new ECB(2,37)),new ECBlocks(20,new ECB(4,16),new ECB(4,17)),new ECBlocks(24,new ECB(4,12),new ECB(4,13))),new Version(10,new Array(6,28,50),new ECBlocks(18,new ECB(2,68),new ECB(2,69)),new ECBlocks(26,new ECB(4,43),new ECB(1,44)),new ECBlocks(24,new ECB(6,19),new ECB(2,20)),new ECBlocks(28,new ECB(6,15),new ECB(2,16))),new Version(11,new Array(6,30,54),new ECBlocks(20,new ECB(4,81)),new ECBlocks(30,new ECB(1,50),new ECB(4,51)),new ECBlocks(28,new ECB(4,22),new ECB(4,23)),new ECBlocks(24,new ECB(3,12),new ECB(8,13))),new Version(12,new Array(6,32,58),new ECBlocks(24,new ECB(2,92),new ECB(2,93)),new ECBlocks(22,new ECB(6,36),new ECB(2,37)),new ECBlocks(26,new ECB(4,20),new ECB(6,21)),new ECBlocks(28,new ECB(7,14),new ECB(4,15))),new Version(13,new Array(6,34,62),new ECBlocks(26,new ECB(4,107)),new ECBlocks(22,new ECB(8,37),new ECB(1,38)),new ECBlocks(24,new ECB(8,20),new ECB(4,21)),new ECBlocks(22,new ECB(12,11),new ECB(4,12))),new Version(14,new Array(6,26,46,66),new ECBlocks(30,new ECB(3,115),new ECB(1,116)),new ECBlocks(24,new ECB(4,40),new ECB(5,41)),new ECBlocks(20,new ECB(11,16),new ECB(5,17)),new ECBlocks(24,new ECB(11,12),new ECB(5,13))),new Version(15,new Array(6,26,48,70),new ECBlocks(22,new ECB(5,87),new ECB(1,88)),new ECBlocks(24,new ECB(5,41),new ECB(5,42)),new ECBlocks(30,new ECB(5,24),new ECB(7,25)),new ECBlocks(24,new ECB(11,12),new ECB(7,13))),new Version(16,new Array(6,26,50,74),new ECBlocks(24,new ECB(5,98),new ECB(1,99)),new ECBlocks(28,new ECB(7,45),new ECB(3,46)),new ECBlocks(24,new ECB(15,19),new ECB(2,20)),new ECBlocks(30,new ECB(3,15),new ECB(13,16))),new Version(17,new Array(6,30,54,78),new ECBlocks(28,new ECB(1,107),new ECB(5,108)),new ECBlocks(28,new ECB(10,46),new ECB(1,47)),new ECBlocks(28,new ECB(1,22),new ECB(15,23)),new ECBlocks(28,new ECB(2,14),new ECB(17,15))),new Version(18,new Array(6,30,56,82),new ECBlocks(30,new ECB(5,120),new ECB(1,121)),new ECBlocks(26,new ECB(9,43),new ECB(4,44)),new ECBlocks(28,new ECB(17,22),new ECB(1,23)),new ECBlocks(28,new ECB(2,14),new ECB(19,15))),new Version(19,new Array(6,30,58,86),new ECBlocks(28,new ECB(3,113),new ECB(4,114)),new ECBlocks(26,new ECB(3,44),new ECB(11,45)),new ECBlocks(26,new ECB(17,21),new ECB(4,22)),new ECBlocks(26,new ECB(9,13),new ECB(16,14))),new Version(20,new Array(6,34,62,90),new ECBlocks(28,new ECB(3,107),new ECB(5,108)),new ECBlocks(26,new ECB(3,41),new ECB(13,42)),new ECBlocks(30,new ECB(15,24),new ECB(5,25)),new ECBlocks(28,new ECB(15,15),new ECB(10,16))),new Version(21,new Array(6,28,50,72,94),new ECBlocks(28,new ECB(4,116),new ECB(4,117)),new ECBlocks(26,new ECB(17,42)),new ECBlocks(28,new ECB(17,22),new ECB(6,23)),new ECBlocks(30,new ECB(19,16),new ECB(6,17))),new Version(22,new Array(6,26,50,74,98),new ECBlocks(28,new ECB(2,111),new ECB(7,112)),new ECBlocks(28,new ECB(17,46)),new ECBlocks(30,new ECB(7,24),new ECB(16,25)),new ECBlocks(24,new ECB(34,13))),new Version(23,new Array(6,30,54,74,102),new ECBlocks(30,new ECB(4,121),new ECB(5,122)),new ECBlocks(28,new ECB(4,47),new ECB(14,48)),new ECBlocks(30,new ECB(11,24),new ECB(14,25)),new ECBlocks(30,new ECB(16,15),new ECB(14,16))),new Version(24,new Array(6,28,54,80,106),new ECBlocks(30,new ECB(6,117),new ECB(4,118)),new ECBlocks(28,new ECB(6,45),new ECB(14,46)),new ECBlocks(30,new ECB(11,24),new ECB(16,25)),new ECBlocks(30,new ECB(30,16),new ECB(2,17))),new Version(25,new Array(6,32,58,84,110),new ECBlocks(26,new ECB(8,106),new ECB(4,107)),new ECBlocks(28,new ECB(8,47),new ECB(13,48)),new ECBlocks(30,new ECB(7,24),new ECB(22,25)),new ECBlocks(30,new ECB(22,15),new ECB(13,16))),new Version(26,new Array(6,30,58,86,114),new ECBlocks(28,new ECB(10,114),new ECB(2,115)),new ECBlocks(28,new ECB(19,46),new ECB(4,47)),new ECBlocks(28,new ECB(28,22),new ECB(6,23)),new ECBlocks(30,new ECB(33,16),new ECB(4,17))),new Version(27,new Array(6,34,62,90,118),new ECBlocks(30,new ECB(8,122),new ECB(4,123)),new ECBlocks(28,new ECB(22,45),new ECB(3,46)),new ECBlocks(30,new ECB(8,23),new ECB(26,24)),new ECBlocks(30,new ECB(12,15),new ECB(28,16))),new Version(28,new Array(6,26,50,74,98,122),new ECBlocks(30,new ECB(3,117),new ECB(10,118)),new ECBlocks(28,new ECB(3,45),new ECB(23,46)),new ECBlocks(30,new ECB(4,24),new ECB(31,25)),new ECBlocks(30,new ECB(11,15),new ECB(31,16))),new Version(29,new Array(6,30,54,78,102,126),new ECBlocks(30,new ECB(7,116),new ECB(7,117)),new ECBlocks(28,new ECB(21,45),new ECB(7,46)),new ECBlocks(30,new ECB(1,23),new ECB(37,24)),new ECBlocks(30,new ECB(19,15),new ECB(26,16))),new Version(30,new Array(6,26,52,78,104,130),new ECBlocks(30,new ECB(5,115),new ECB(10,116)),new ECBlocks(28,new ECB(19,47),new ECB(10,48)),new ECBlocks(30,new ECB(15,24),new ECB(25,25)),new ECBlocks(30,new ECB(23,15),new ECB(25,16))),new Version(31,new Array(6,30,56,82,108,134),new ECBlocks(30,new ECB(13,115),new ECB(3,116)),new ECBlocks(28,new ECB(2,46),new ECB(29,47)),new ECBlocks(30,new ECB(42,24),new ECB(1,25)),new ECBlocks(30,new ECB(23,15),new ECB(28,16))),new Version(32,new Array(6,34,60,86,112,138),new ECBlocks(30,new ECB(17,115)),new ECBlocks(28,new ECB(10,46),new ECB(23,47)),new ECBlocks(30,new ECB(10,24),new ECB(35,25)),new ECBlocks(30,new ECB(19,15),new ECB(35,16))),new Version(33,new Array(6,30,58,86,114,142),new ECBlocks(30,new ECB(17,115),new ECB(1,116)),new ECBlocks(28,new ECB(14,46),new ECB(21,47)),new ECBlocks(30,new ECB(29,24),new ECB(19,25)),new ECBlocks(30,new ECB(11,15),new ECB(46,16))),new Version(34,new Array(6,34,62,90,118,146),new ECBlocks(30,new ECB(13,115),new ECB(6,116)),new ECBlocks(28,new ECB(14,46),new ECB(23,47)),new ECBlocks(30,new ECB(44,24),new ECB(7,25)),new ECBlocks(30,new ECB(59,16),new ECB(1,17))),new Version(35,new Array(6,30,54,78,102,126,150),new ECBlocks(30,new ECB(12,121),new ECB(7,122)),new ECBlocks(28,new ECB(12,47),new ECB(26,48)),new ECBlocks(30,new ECB(39,24),new ECB(14,25)),new ECBlocks(30,new ECB(22,15),new ECB(41,16))),new Version(36,new Array(6,24,50,76,102,128,154),new ECBlocks(30,new ECB(6,121),new ECB(14,122)),new ECBlocks(28,new ECB(6,47),new ECB(34,48)),new ECBlocks(30,new ECB(46,24),new ECB(10,25)),new ECBlocks(30,new ECB(2,15),new ECB(64,16))),new Version(37,new Array(6,28,54,80,106,132,158),new ECBlocks(30,new ECB(17,122),new ECB(4,123)),new ECBlocks(28,new ECB(29,46),new ECB(14,47)),new ECBlocks(30,new ECB(49,24),new ECB(10,25)),new ECBlocks(30,new ECB(24,15),new ECB(46,16))),new Version(38,new Array(6,32,58,84,110,136,162),new ECBlocks(30,new ECB(4,122),new ECB(18,123)),new ECBlocks(28,new ECB(13,46),new ECB(32,47)),new ECBlocks(30,new ECB(48,24),new ECB(14,25)),new ECBlocks(30,new ECB(42,15),new ECB(32,16))),new Version(39,new Array(6,26,54,82,110,138,166),new ECBlocks(30,new ECB(20,117),new ECB(4,118)),new ECBlocks(28,new ECB(40,47),new ECB(7,48)),new ECBlocks(30,new ECB(43,24),new ECB(22,25)),new ECBlocks(30,new ECB(10,15),new ECB(67,16))),new Version(40,new Array(6,30,58,86,114,142,170),new ECBlocks(30,new ECB(19,118),new ECB(6,119)),new ECBlocks(28,new ECB(18,47),new ECB(31,48)),new ECBlocks(30,new ECB(34,24),new ECB(34,25)),new ECBlocks(30,new ECB(20,15),new ECB(61,16))))}function PerspectiveTransform(a11,a21,a31,a12,a22,a32,a13,a23,a33){this.a11=a11,this.a12=a12,this.a13=a13,this.a21=a21,this.a22=a22,this.a23=a23,this.a31=a31,this.a32=a32,this.a33=a33,this.transformPoints1=function(points){for(var max=points.length,a11=this.a11,a12=this.a12,a13=this.a13,a21=this.a21,a22=this.a22,a23=this.a23,a31=this.a31,a32=this.a32,a33=this.a33,i=0;max>i;i+=2){var x=points[i],y=points[i+1],denominator=a13*x+a23*y+a33;points[i]=(a11*x+a21*y+a31)/denominator,points[i+1]=(a12*x+a22*y+a32)/denominator}},this.transformPoints2=function(xValues,yValues){for(var n=xValues.length,i=0;n>i;i++){var x=xValues[i],y=yValues[i],denominator=this.a13*x+this.a23*y+this.a33;xValues[i]=(this.a11*x+this.a21*y+this.a31)/denominator,yValues[i]=(this.a12*x+this.a22*y+this.a32)/denominator}},this.buildAdjoint=function(){return new PerspectiveTransform(this.a22*this.a33-this.a23*this.a32,this.a23*this.a31-this.a21*this.a33,this.a21*this.a32-this.a22*this.a31,this.a13*this.a32-this.a12*this.a33,this.a11*this.a33-this.a13*this.a31,this.a12*this.a31-this.a11*this.a32,this.a12*this.a23-this.a13*this.a22,this.a13*this.a21-this.a11*this.a23,this.a11*this.a22-this.a12*this.a21)},this.times=function(other){return new PerspectiveTransform(this.a11*other.a11+this.a21*other.a12+this.a31*other.a13,this.a11*other.a21+this.a21*other.a22+this.a31*other.a23,this.a11*other.a31+this.a21*other.a32+this.a31*other.a33,this.a12*other.a11+this.a22*other.a12+this.a32*other.a13,this.a12*other.a21+this.a22*other.a22+this.a32*other.a23,this.a12*other.a31+this.a22*other.a32+this.a32*other.a33,this.a13*other.a11+this.a23*other.a12+this.a33*other.a13,this.a13*other.a21+this.a23*other.a22+this.a33*other.a23,this.a13*other.a31+this.a23*other.a32+this.a33*other.a33)}}function DetectorResult(bits,points){this.bits=bits,this.points=points}function Detector(image){this.image=image,this.resultPointCallback=null,this.sizeOfBlackWhiteBlackRun=function(fromX,fromY,toX,toY){var steep=Math.abs(toY-fromY)>Math.abs(toX-fromX);if(steep){var temp=fromX;fromX=fromY,fromY=temp,temp=toX,toX=toY,toY=temp}for(var dx=Math.abs(toX-fromX),dy=Math.abs(toY-fromY),error=-dx>>1,ystep=toY>fromY?1:-1,xstep=toX>fromX?1:-1,state=0,x=fromX,y=fromY;x!=toX;x+=xstep){var realX=steep?y:x,realY=steep?x:y;if(1==state?this.image[realX+realY*qrcode.width]&&state++:this.image[realX+realY*qrcode.width]||state++,3==state){var diffX=x-fromX,diffY=y-fromY;return Math.sqrt(diffX*diffX+diffY*diffY)}if(error+=dy,error>0){if(y==toY)break;y+=ystep,error-=dx}}var diffX2=toX-fromX,diffY2=toY-fromY;return Math.sqrt(diffX2*diffX2+diffY2*diffY2)},this.sizeOfBlackWhiteBlackRunBothWays=function(fromX,fromY,toX,toY){var result=this.sizeOfBlackWhiteBlackRun(fromX,fromY,toX,toY),scale=1,otherToX=fromX-(toX-fromX);0>otherToX?(scale=fromX/(fromX-otherToX),otherToX=0):otherToX>=qrcode.width&&(scale=(qrcode.width-1-fromX)/(otherToX-fromX),otherToX=qrcode.width-1);var otherToY=Math.floor(fromY-(toY-fromY)*scale);return scale=1,0>otherToY?(scale=fromY/(fromY-otherToY),otherToY=0):otherToY>=qrcode.height&&(scale=(qrcode.height-1-fromY)/(otherToY-fromY),otherToY=qrcode.height-1),otherToX=Math.floor(fromX+(otherToX-fromX)*scale),result+=this.sizeOfBlackWhiteBlackRun(fromX,fromY,otherToX,otherToY),result-1},this.calculateModuleSizeOneWay=function(pattern,otherPattern){var moduleSizeEst1=this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(pattern.X),Math.floor(pattern.Y),Math.floor(otherPattern.X),Math.floor(otherPattern.Y)),moduleSizeEst2=this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(otherPattern.X),Math.floor(otherPattern.Y),Math.floor(pattern.X),Math.floor(pattern.Y));return isNaN(moduleSizeEst1)?moduleSizeEst2/7:isNaN(moduleSizeEst2)?moduleSizeEst1/7:(moduleSizeEst1+moduleSizeEst2)/14},this.calculateModuleSize=function(topLeft,topRight,bottomLeft){return(this.calculateModuleSizeOneWay(topLeft,topRight)+this.calculateModuleSizeOneWay(topLeft,bottomLeft))/2},this.distance=function(pattern1,pattern2){return xDiff=pattern1.X-pattern2.X,yDiff=pattern1.Y-pattern2.Y,Math.sqrt(xDiff*xDiff+yDiff*yDiff)},this.computeDimension=function(topLeft,topRight,bottomLeft,moduleSize){var tltrCentersDimension=Math.round(this.distance(topLeft,topRight)/moduleSize),tlblCentersDimension=Math.round(this.distance(topLeft,bottomLeft)/moduleSize),dimension=(tltrCentersDimension+tlblCentersDimension>>1)+7;switch(3&dimension){case 0:dimension++;break;case 2:dimension--;break;case 3:throw"Error"}return dimension},this.findAlignmentInRegion=function(overallEstModuleSize,estAlignmentX,estAlignmentY,allowanceFactor){var allowance=Math.floor(allowanceFactor*overallEstModuleSize),alignmentAreaLeftX=Math.max(0,estAlignmentX-allowance),alignmentAreaRightX=Math.min(qrcode.width-1,estAlignmentX+allowance);if(3*overallEstModuleSize>alignmentAreaRightX-alignmentAreaLeftX)throw"Error";var alignmentAreaTopY=Math.max(0,estAlignmentY-allowance),alignmentAreaBottomY=Math.min(qrcode.height-1,estAlignmentY+allowance),alignmentFinder=new AlignmentPatternFinder(this.image,alignmentAreaLeftX,alignmentAreaTopY,alignmentAreaRightX-alignmentAreaLeftX,alignmentAreaBottomY-alignmentAreaTopY,overallEstModuleSize,this.resultPointCallback);return alignmentFinder.find()},this.createTransform=function(topLeft,topRight,bottomLeft,alignmentPattern,dimension){var bottomRightX,bottomRightY,sourceBottomRightX,sourceBottomRightY,dimMinusThree=dimension-3.5;null!=alignmentPattern?(bottomRightX=alignmentPattern.X,bottomRightY=alignmentPattern.Y,sourceBottomRightX=sourceBottomRightY=dimMinusThree-3):(bottomRightX=topRight.X-topLeft.X+bottomLeft.X,bottomRightY=topRight.Y-topLeft.Y+bottomLeft.Y,sourceBottomRightX=sourceBottomRightY=dimMinusThree);var transform=PerspectiveTransform.quadrilateralToQuadrilateral(3.5,3.5,dimMinusThree,3.5,sourceBottomRightX,sourceBottomRightY,3.5,dimMinusThree,topLeft.X,topLeft.Y,topRight.X,topRight.Y,bottomRightX,bottomRightY,bottomLeft.X,bottomLeft.Y);return transform},this.sampleGrid=function(image,transform,dimension){var sampler=GridSampler;return sampler.sampleGrid3(image,dimension,transform)},this.processFinderPatternInfo=function(info){var topLeft=info.TopLeft,topRight=info.TopRight,bottomLeft=info.BottomLeft,moduleSize=this.calculateModuleSize(topLeft,topRight,bottomLeft);if(1>moduleSize)throw"Error";var dimension=this.computeDimension(topLeft,topRight,bottomLeft,moduleSize),provisionalVersion=Version.getProvisionalVersionForDimension(dimension),modulesBetweenFPCenters=provisionalVersion.DimensionForVersion-7,alignmentPattern=null;if(provisionalVersion.AlignmentPatternCenters.length>0)for(var bottomRightX=topRight.X-topLeft.X+bottomLeft.X,bottomRightY=topRight.Y-topLeft.Y+bottomLeft.Y,correctionToTopLeft=1-3/modulesBetweenFPCenters,estAlignmentX=Math.floor(topLeft.X+correctionToTopLeft*(bottomRightX-topLeft.X)),estAlignmentY=Math.floor(topLeft.Y+correctionToTopLeft*(bottomRightY-topLeft.Y)),i=4;16>=i;i<<=1){alignmentPattern=this.findAlignmentInRegion(moduleSize,estAlignmentX,estAlignmentY,i);break}var points,transform=this.createTransform(topLeft,topRight,bottomLeft,alignmentPattern,dimension),bits=this.sampleGrid(this.image,transform,dimension);return points=null==alignmentPattern?new Array(bottomLeft,topLeft,topRight):new Array(bottomLeft,topLeft,topRight,alignmentPattern),new DetectorResult(bits,points)},this.detect=function(){var info=(new FinderPatternFinder).findFinderPattern(this.image);return this.processFinderPatternInfo(info)}}function FormatInformation(formatInfo){this.errorCorrectionLevel=ErrorCorrectionLevel.forBits(formatInfo>>3&3),this.dataMask=7&formatInfo,this.__defineGetter__("ErrorCorrectionLevel",function(){return this.errorCorrectionLevel}),this.__defineGetter__("DataMask",function(){return this.dataMask}),this.GetHashCode=function(){return this.errorCorrectionLevel.ordinal()<<3|dataMask},this.Equals=function(o){var other=o;return this.errorCorrectionLevel==other.errorCorrectionLevel&&this.dataMask==other.dataMask}}function ErrorCorrectionLevel(ordinal,bits,name){this.ordinal_Renamed_Field=ordinal,this.bits=bits,this.name=name,this.__defineGetter__("Bits",function(){return this.bits}),this.__defineGetter__("Name",function(){return this.name}),this.ordinal=function(){return this.ordinal_Renamed_Field}}function BitMatrix(width,height){if(height||(height=width),1>width||1>height)throw"Both dimensions must be greater than 0";this.width=width,this.height=height;var rowSize=width>>5;0!=(31&width)&&rowSize++,this.rowSize=rowSize,this.bits=new Array(rowSize*height);for(var i=0;i<this.bits.length;i++)this.bits[i]=0;this.__defineGetter__("Width",function(){return this.width}),this.__defineGetter__("Height",function(){return this.height}),this.__defineGetter__("Dimension",function(){if(this.width!=this.height)throw"Can't call getDimension() on a non-square matrix";return this.width}),this.get_Renamed=function(x,y){var offset=y*this.rowSize+(x>>5);return 0!=(1&URShift(this.bits[offset],31&x))},this.set_Renamed=function(x,y){var offset=y*this.rowSize+(x>>5);this.bits[offset]|=1<<(31&x)},this.flip=function(x,y){var offset=y*this.rowSize+(x>>5);this.bits[offset]^=1<<(31&x)},this.clear=function(){for(var max=this.bits.length,i=0;max>i;i++)this.bits[i]=0},this.setRegion=function(left,top,width,height){if(0>top||0>left)throw"Left and top must be nonnegative";if(1>height||1>width)throw"Height and width must be at least 1";var right=left+width,bottom=top+height;if(bottom>this.height||right>this.width)throw"The region must fit inside the matrix";for(var y=top;bottom>y;y++)for(var offset=y*this.rowSize,x=left;right>x;x++)this.bits[offset+(x>>5)]|=1<<(31&x)}}function DataBlock(numDataCodewords,codewords){this.numDataCodewords=numDataCodewords,this.codewords=codewords,this.__defineGetter__("NumDataCodewords",function(){return this.numDataCodewords}),this.__defineGetter__("Codewords",function(){return this.codewords})}function BitMatrixParser(bitMatrix){var dimension=bitMatrix.Dimension;if(21>dimension||1!=(3&dimension))throw"Error BitMatrixParser";this.bitMatrix=bitMatrix,this.parsedVersion=null,this.parsedFormatInfo=null,this.copyBit=function(i,j,versionBits){return this.bitMatrix.get_Renamed(i,j)?versionBits<<1|1:versionBits<<1},this.readFormatInformation=function(){if(null!=this.parsedFormatInfo)return this.parsedFormatInfo;for(var formatInfoBits=0,i=0;6>i;i++)formatInfoBits=this.copyBit(i,8,formatInfoBits);formatInfoBits=this.copyBit(7,8,formatInfoBits),formatInfoBits=this.copyBit(8,8,formatInfoBits),formatInfoBits=this.copyBit(8,7,formatInfoBits);for(var j=5;j>=0;j--)formatInfoBits=this.copyBit(8,j,formatInfoBits);if(this.parsedFormatInfo=FormatInformation.decodeFormatInformation(formatInfoBits),null!=this.parsedFormatInfo)return this.parsedFormatInfo;var dimension=this.bitMatrix.Dimension;formatInfoBits=0;for(var iMin=dimension-8,i=dimension-1;i>=iMin;i--)formatInfoBits=this.copyBit(i,8,formatInfoBits);for(var j=dimension-7;dimension>j;j++)formatInfoBits=this.copyBit(8,j,formatInfoBits);if(this.parsedFormatInfo=FormatInformation.decodeFormatInformation(formatInfoBits),null!=this.parsedFormatInfo)return this.parsedFormatInfo;throw"Error readFormatInformation"},this.readVersion=function(){if(null!=this.parsedVersion)return this.parsedVersion;var dimension=this.bitMatrix.Dimension,provisionalVersion=dimension-17>>2;if(6>=provisionalVersion)return Version.getVersionForNumber(provisionalVersion);for(var versionBits=0,ijMin=dimension-11,j=5;j>=0;j--)for(var i=dimension-9;i>=ijMin;i--)versionBits=this.copyBit(i,j,versionBits);if(this.parsedVersion=Version.decodeVersionInformation(versionBits),null!=this.parsedVersion&&this.parsedVersion.DimensionForVersion==dimension)return this.parsedVersion;versionBits=0;for(var i=5;i>=0;i--)for(var j=dimension-9;j>=ijMin;j--)versionBits=this.copyBit(i,j,versionBits);if(this.parsedVersion=Version.decodeVersionInformation(versionBits),null!=this.parsedVersion&&this.parsedVersion.DimensionForVersion==dimension)return this.parsedVersion;throw"Error readVersion"},this.readCodewords=function(){var formatInfo=this.readFormatInformation(),version=this.readVersion(),dataMask=DataMask.forReference(formatInfo.DataMask),dimension=this.bitMatrix.Dimension;dataMask.unmaskBitMatrix(this.bitMatrix,dimension);for(var functionPattern=version.buildFunctionPattern(),readingUp=!0,result=new Array(version.TotalCodewords),resultOffset=0,currentByte=0,bitsRead=0,j=dimension-1;j>0;j-=2){6==j&&j--;for(var count=0;dimension>count;count++)for(var i=readingUp?dimension-1-count:count,col=0;2>col;col++)functionPattern.get_Renamed(j-col,i)||(bitsRead++,currentByte<<=1,this.bitMatrix.get_Renamed(j-col,i)&&(currentByte|=1),8==bitsRead&&(result[resultOffset++]=currentByte,bitsRead=0,currentByte=0));readingUp^=!0}if(resultOffset!=version.TotalCodewords)throw"Error readCodewords";return result}}function DataMask000(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return 0==(i+j&1)}}function DataMask001(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return 0==(1&i)}}function DataMask010(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return j%3==0}}function DataMask011(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return(i+j)%3==0}}function DataMask100(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return 0==(URShift(i,1)+j/3&1)}}function DataMask101(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){var temp=i*j;return(1&temp)+temp%3==0}}function DataMask110(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){var temp=i*j;return 0==((1&temp)+temp%3&1)}}function DataMask111(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return 0==((i+j&1)+i*j%3&1)}}function ReedSolomonDecoder(field){this.field=field,this.decode=function(received,twoS){for(var poly=new GF256Poly(this.field,received),syndromeCoefficients=new Array(twoS),i=0;i<syndromeCoefficients.length;i++)syndromeCoefficients[i]=0;for(var dataMatrix=!1,noError=!0,i=0;twoS>i;i++){var eval=poly.evaluateAt(this.field.exp(dataMatrix?i+1:i));syndromeCoefficients[syndromeCoefficients.length-1-i]=eval,0!=eval&&(noError=!1)}if(!noError)for(var syndrome=new GF256Poly(this.field,syndromeCoefficients),sigmaOmega=this.runEuclideanAlgorithm(this.field.buildMonomial(twoS,1),syndrome,twoS),sigma=sigmaOmega[0],omega=sigmaOmega[1],errorLocations=this.findErrorLocations(sigma),errorMagnitudes=this.findErrorMagnitudes(omega,errorLocations,dataMatrix),i=0;i<errorLocations.length;i++){var position=received.length-1-this.field.log(errorLocations[i]);if(0>position)throw"ReedSolomonException Bad error location";received[position]=GF256.addOrSubtract(received[position],errorMagnitudes[i])}},this.runEuclideanAlgorithm=function(a,b,R){if(a.Degree<b.Degree){var temp=a;a=b,b=temp}for(var rLast=a,r=b,sLast=this.field.One,s=this.field.Zero,tLast=this.field.Zero,t=this.field.One;r.Degree>=Math.floor(R/2);){var rLastLast=rLast,sLastLast=sLast,tLastLast=tLast;if(rLast=r,sLast=s,tLast=t,rLast.Zero)throw"r_{i-1} was zero";r=rLastLast;for(var q=this.field.Zero,denominatorLeadingTerm=rLast.getCoefficient(rLast.Degree),dltInverse=this.field.inverse(denominatorLeadingTerm);r.Degree>=rLast.Degree&&!r.Zero;){var degreeDiff=r.Degree-rLast.Degree,scale=this.field.multiply(r.getCoefficient(r.Degree),dltInverse);q=q.addOrSubtract(this.field.buildMonomial(degreeDiff,scale)),r=r.addOrSubtract(rLast.multiplyByMonomial(degreeDiff,scale))}s=q.multiply1(sLast).addOrSubtract(sLastLast),t=q.multiply1(tLast).addOrSubtract(tLastLast)}var sigmaTildeAtZero=t.getCoefficient(0);if(0==sigmaTildeAtZero)throw"ReedSolomonException sigmaTilde(0) was zero";var inverse=this.field.inverse(sigmaTildeAtZero),sigma=t.multiply2(inverse),omega=r.multiply2(inverse);return new Array(sigma,omega)},this.findErrorLocations=function(errorLocator){var numErrors=errorLocator.Degree;if(1==numErrors)return new Array(errorLocator.getCoefficient(1));for(var result=new Array(numErrors),e=0,i=1;256>i&&numErrors>e;i++)0==errorLocator.evaluateAt(i)&&(result[e]=this.field.inverse(i),e++);if(e!=numErrors)throw"Error locator degree does not match number of roots";return result},this.findErrorMagnitudes=function(errorEvaluator,errorLocations,dataMatrix){for(var s=errorLocations.length,result=new Array(s),i=0;s>i;i++){for(var xiInverse=this.field.inverse(errorLocations[i]),denominator=1,j=0;s>j;j++)i!=j&&(denominator=this.field.multiply(denominator,GF256.addOrSubtract(1,this.field.multiply(errorLocations[j],xiInverse))));result[i]=this.field.multiply(errorEvaluator.evaluateAt(xiInverse),this.field.inverse(denominator)),dataMatrix&&(result[i]=this.field.multiply(result[i],xiInverse))}return result}}function GF256Poly(field,coefficients){if(null==coefficients||0==coefficients.length)throw"System.ArgumentException";this.field=field;var coefficientsLength=coefficients.length;if(coefficientsLength>1&&0==coefficients[0]){for(var firstNonZero=1;coefficientsLength>firstNonZero&&0==coefficients[firstNonZero];)firstNonZero++;if(firstNonZero==coefficientsLength)this.coefficients=field.Zero.coefficients;else{this.coefficients=new Array(coefficientsLength-firstNonZero);for(var i=0;i<this.coefficients.length;i++)this.coefficients[i]=0;for(var ci=0;ci<this.coefficients.length;ci++)this.coefficients[ci]=coefficients[firstNonZero+ci]}}else this.coefficients=coefficients;this.__defineGetter__("Zero",function(){return 0==this.coefficients[0]}),this.__defineGetter__("Degree",function(){return this.coefficients.length-1}),this.__defineGetter__("Coefficients",function(){return this.coefficients}),this.getCoefficient=function(degree){return this.coefficients[this.coefficients.length-1-degree]},this.evaluateAt=function(a){if(0==a)return this.getCoefficient(0);var size=this.coefficients.length;if(1==a){for(var result=0,i=0;size>i;i++)result=GF256.addOrSubtract(result,this.coefficients[i]);return result}for(var result2=this.coefficients[0],i=1;size>i;i++)result2=GF256.addOrSubtract(this.field.multiply(a,result2),this.coefficients[i]);return result2},this.addOrSubtract=function(other){if(this.field!=other.field)throw"GF256Polys do not have same GF256 field";if(this.Zero)return other;if(other.Zero)return this;var smallerCoefficients=this.coefficients,largerCoefficients=other.coefficients;if(smallerCoefficients.length>largerCoefficients.length){var temp=smallerCoefficients;smallerCoefficients=largerCoefficients,largerCoefficients=temp}for(var sumDiff=new Array(largerCoefficients.length),lengthDiff=largerCoefficients.length-smallerCoefficients.length,ci=0;lengthDiff>ci;ci++)sumDiff[ci]=largerCoefficients[ci];for(var i=lengthDiff;i<largerCoefficients.length;i++)sumDiff[i]=GF256.addOrSubtract(smallerCoefficients[i-lengthDiff],largerCoefficients[i]);return new GF256Poly(field,sumDiff)},this.multiply1=function(other){if(this.field!=other.field)throw"GF256Polys do not have same GF256 field";if(this.Zero||other.Zero)return this.field.Zero;for(var aCoefficients=this.coefficients,aLength=aCoefficients.length,bCoefficients=other.coefficients,bLength=bCoefficients.length,product=new Array(aLength+bLength-1),i=0;aLength>i;i++)for(var aCoeff=aCoefficients[i],j=0;bLength>j;j++)product[i+j]=GF256.addOrSubtract(product[i+j],this.field.multiply(aCoeff,bCoefficients[j]));return new GF256Poly(this.field,product)},this.multiply2=function(scalar){if(0==scalar)return this.field.Zero;if(1==scalar)return this;for(var size=this.coefficients.length,product=new Array(size),i=0;size>i;i++)product[i]=this.field.multiply(this.coefficients[i],scalar);return new GF256Poly(this.field,product)},this.multiplyByMonomial=function(degree,coefficient){if(0>degree)throw"System.ArgumentException";if(0==coefficient)return this.field.Zero;for(var size=this.coefficients.length,product=new Array(size+degree),i=0;i<product.length;i++)product[i]=0;for(var i=0;size>i;i++)product[i]=this.field.multiply(this.coefficients[i],coefficient);return new GF256Poly(this.field,product)},this.divide=function(other){if(this.field!=other.field)throw"GF256Polys do not have same GF256 field";if(other.Zero)throw"Divide by 0";for(var quotient=this.field.Zero,remainder=this,denominatorLeadingTerm=other.getCoefficient(other.Degree),inverseDenominatorLeadingTerm=this.field.inverse(denominatorLeadingTerm);remainder.Degree>=other.Degree&&!remainder.Zero;){
    var degreeDifference=remainder.Degree-other.Degree,scale=this.field.multiply(remainder.getCoefficient(remainder.Degree),inverseDenominatorLeadingTerm),term=other.multiplyByMonomial(degreeDifference,scale),iterationQuotient=this.field.buildMonomial(degreeDifference,scale);quotient=quotient.addOrSubtract(iterationQuotient),remainder=remainder.addOrSubtract(term)}return new Array(quotient,remainder)}}function GF256(primitive){this.expTable=new Array(256),this.logTable=new Array(256);for(var x=1,i=0;256>i;i++)this.expTable[i]=x,x<<=1,x>=256&&(x^=primitive);for(var i=0;255>i;i++)this.logTable[this.expTable[i]]=i;var at0=new Array(1);at0[0]=0,this.zero=new GF256Poly(this,new Array(at0));var at1=new Array(1);at1[0]=1,this.one=new GF256Poly(this,new Array(at1)),this.__defineGetter__("Zero",function(){return this.zero}),this.__defineGetter__("One",function(){return this.one}),this.buildMonomial=function(degree,coefficient){if(0>degree)throw"System.ArgumentException";if(0==coefficient)return zero;for(var coefficients=new Array(degree+1),i=0;i<coefficients.length;i++)coefficients[i]=0;return coefficients[0]=coefficient,new GF256Poly(this,coefficients)},this.exp=function(a){return this.expTable[a]},this.log=function(a){if(0==a)throw"System.ArgumentException";return this.logTable[a]},this.inverse=function(a){if(0==a)throw"System.ArithmeticException";return this.expTable[255-this.logTable[a]]},this.multiply=function(a,b){return 0==a||0==b?0:1==a?b:1==b?a:this.expTable[(this.logTable[a]+this.logTable[b])%255]}}function URShift(number,bits){return number>=0?number>>bits:(number>>bits)+(2<<~bits)}function FinderPattern(posX,posY,estimatedModuleSize){this.x=posX,this.y=posY,this.count=1,this.estimatedModuleSize=estimatedModuleSize,this.__defineGetter__("EstimatedModuleSize",function(){return this.estimatedModuleSize}),this.__defineGetter__("Count",function(){return this.count}),this.__defineGetter__("X",function(){return this.x}),this.__defineGetter__("Y",function(){return this.y}),this.incrementCount=function(){this.count++},this.aboutEquals=function(moduleSize,i,j){if(Math.abs(i-this.y)<=moduleSize&&Math.abs(j-this.x)<=moduleSize){var moduleSizeDiff=Math.abs(moduleSize-this.estimatedModuleSize);return 1>=moduleSizeDiff||moduleSizeDiff/this.estimatedModuleSize<=1}return!1}}function FinderPatternInfo(patternCenters){this.bottomLeft=patternCenters[0],this.topLeft=patternCenters[1],this.topRight=patternCenters[2],this.__defineGetter__("BottomLeft",function(){return this.bottomLeft}),this.__defineGetter__("TopLeft",function(){return this.topLeft}),this.__defineGetter__("TopRight",function(){return this.topRight})}function FinderPatternFinder(){this.image=null,this.possibleCenters=[],this.hasSkipped=!1,this.crossCheckStateCount=new Array(0,0,0,0,0),this.resultPointCallback=null,this.__defineGetter__("CrossCheckStateCount",function(){return this.crossCheckStateCount[0]=0,this.crossCheckStateCount[1]=0,this.crossCheckStateCount[2]=0,this.crossCheckStateCount[3]=0,this.crossCheckStateCount[4]=0,this.crossCheckStateCount}),this.foundPatternCross=function(stateCount){for(var totalModuleSize=0,i=0;5>i;i++){var count=stateCount[i];if(0==count)return!1;totalModuleSize+=count}if(7>totalModuleSize)return!1;var moduleSize=Math.floor((totalModuleSize<<INTEGER_MATH_SHIFT)/7),maxVariance=Math.floor(moduleSize/2);return Math.abs(moduleSize-(stateCount[0]<<INTEGER_MATH_SHIFT))<maxVariance&&Math.abs(moduleSize-(stateCount[1]<<INTEGER_MATH_SHIFT))<maxVariance&&Math.abs(3*moduleSize-(stateCount[2]<<INTEGER_MATH_SHIFT))<3*maxVariance&&Math.abs(moduleSize-(stateCount[3]<<INTEGER_MATH_SHIFT))<maxVariance&&Math.abs(moduleSize-(stateCount[4]<<INTEGER_MATH_SHIFT))<maxVariance},this.centerFromEnd=function(stateCount,end){return end-stateCount[4]-stateCount[3]-stateCount[2]/2},this.crossCheckVertical=function(startI,centerJ,maxCount,originalStateCountTotal){for(var image=this.image,maxI=qrcode.height,stateCount=this.CrossCheckStateCount,i=startI;i>=0&&image[centerJ+i*qrcode.width];)stateCount[2]++,i--;if(0>i)return NaN;for(;i>=0&&!image[centerJ+i*qrcode.width]&&stateCount[1]<=maxCount;)stateCount[1]++,i--;if(0>i||stateCount[1]>maxCount)return NaN;for(;i>=0&&image[centerJ+i*qrcode.width]&&stateCount[0]<=maxCount;)stateCount[0]++,i--;if(stateCount[0]>maxCount)return NaN;for(i=startI+1;maxI>i&&image[centerJ+i*qrcode.width];)stateCount[2]++,i++;if(i==maxI)return NaN;for(;maxI>i&&!image[centerJ+i*qrcode.width]&&stateCount[3]<maxCount;)stateCount[3]++,i++;if(i==maxI||stateCount[3]>=maxCount)return NaN;for(;maxI>i&&image[centerJ+i*qrcode.width]&&stateCount[4]<maxCount;)stateCount[4]++,i++;if(stateCount[4]>=maxCount)return NaN;var stateCountTotal=stateCount[0]+stateCount[1]+stateCount[2]+stateCount[3]+stateCount[4];return 5*Math.abs(stateCountTotal-originalStateCountTotal)>=2*originalStateCountTotal?NaN:this.foundPatternCross(stateCount)?this.centerFromEnd(stateCount,i):NaN},this.crossCheckHorizontal=function(startJ,centerI,maxCount,originalStateCountTotal){for(var image=this.image,maxJ=qrcode.width,stateCount=this.CrossCheckStateCount,j=startJ;j>=0&&image[j+centerI*qrcode.width];)stateCount[2]++,j--;if(0>j)return NaN;for(;j>=0&&!image[j+centerI*qrcode.width]&&stateCount[1]<=maxCount;)stateCount[1]++,j--;if(0>j||stateCount[1]>maxCount)return NaN;for(;j>=0&&image[j+centerI*qrcode.width]&&stateCount[0]<=maxCount;)stateCount[0]++,j--;if(stateCount[0]>maxCount)return NaN;for(j=startJ+1;maxJ>j&&image[j+centerI*qrcode.width];)stateCount[2]++,j++;if(j==maxJ)return NaN;for(;maxJ>j&&!image[j+centerI*qrcode.width]&&stateCount[3]<maxCount;)stateCount[3]++,j++;if(j==maxJ||stateCount[3]>=maxCount)return NaN;for(;maxJ>j&&image[j+centerI*qrcode.width]&&stateCount[4]<maxCount;)stateCount[4]++,j++;if(stateCount[4]>=maxCount)return NaN;var stateCountTotal=stateCount[0]+stateCount[1]+stateCount[2]+stateCount[3]+stateCount[4];return 5*Math.abs(stateCountTotal-originalStateCountTotal)>=originalStateCountTotal?NaN:this.foundPatternCross(stateCount)?this.centerFromEnd(stateCount,j):NaN},this.handlePossibleCenter=function(stateCount,i,j){var stateCountTotal=stateCount[0]+stateCount[1]+stateCount[2]+stateCount[3]+stateCount[4],centerJ=this.centerFromEnd(stateCount,j),centerI=this.crossCheckVertical(i,Math.floor(centerJ),stateCount[2],stateCountTotal);if(!isNaN(centerI)&&(centerJ=this.crossCheckHorizontal(Math.floor(centerJ),Math.floor(centerI),stateCount[2],stateCountTotal),!isNaN(centerJ))){for(var estimatedModuleSize=stateCountTotal/7,found=!1,max=this.possibleCenters.length,index=0;max>index;index++){var center=this.possibleCenters[index];if(center.aboutEquals(estimatedModuleSize,centerI,centerJ)){center.incrementCount(),found=!0;break}}if(!found){var point=new FinderPattern(centerJ,centerI,estimatedModuleSize);this.possibleCenters.push(point),null!=this.resultPointCallback&&this.resultPointCallback.foundPossibleResultPoint(point)}return!0}return!1},this.selectBestPatterns=function(){var startSize=this.possibleCenters.length;if(3>startSize)throw"Couldn't find enough finder patterns";if(startSize>3){for(var totalModuleSize=0,i=0;startSize>i;i++)totalModuleSize+=this.possibleCenters[i].EstimatedModuleSize;for(var average=totalModuleSize/startSize,i=0;i<this.possibleCenters.length&&this.possibleCenters.length>3;i++){var pattern=this.possibleCenters[i];Math.abs(pattern.EstimatedModuleSize-average)>.2*average&&(this.possibleCenters.remove(i),i--)}}return this.possibleCenters.Count>3,new Array(this.possibleCenters[0],this.possibleCenters[1],this.possibleCenters[2])},this.findRowSkip=function(){var max=this.possibleCenters.length;if(1>=max)return 0;for(var firstConfirmedCenter=null,i=0;max>i;i++){var center=this.possibleCenters[i];if(center.Count>=CENTER_QUORUM){if(null!=firstConfirmedCenter)return this.hasSkipped=!0,Math.floor((Math.abs(firstConfirmedCenter.X-center.X)-Math.abs(firstConfirmedCenter.Y-center.Y))/2);firstConfirmedCenter=center}}return 0},this.haveMultiplyConfirmedCenters=function(){for(var confirmedCount=0,totalModuleSize=0,max=this.possibleCenters.length,i=0;max>i;i++){var pattern=this.possibleCenters[i];pattern.Count>=CENTER_QUORUM&&(confirmedCount++,totalModuleSize+=pattern.EstimatedModuleSize)}if(3>confirmedCount)return!1;for(var average=totalModuleSize/max,totalDeviation=0,i=0;max>i;i++)pattern=this.possibleCenters[i],totalDeviation+=Math.abs(pattern.EstimatedModuleSize-average);return.05*totalModuleSize>=totalDeviation},this.findFinderPattern=function(image){var tryHarder=!1;this.image=image;var maxI=qrcode.height,maxJ=qrcode.width,iSkip=Math.floor(3*maxI/(4*MAX_MODULES));(MIN_SKIP>iSkip||tryHarder)&&(iSkip=MIN_SKIP);for(var done=!1,stateCount=new Array(5),i=iSkip-1;maxI>i&&!done;i+=iSkip){stateCount[0]=0,stateCount[1]=0,stateCount[2]=0,stateCount[3]=0,stateCount[4]=0;for(var currentState=0,j=0;maxJ>j;j++)if(image[j+i*qrcode.width])1==(1&currentState)&&currentState++,stateCount[currentState]++;else if(0==(1&currentState))if(4==currentState)if(this.foundPatternCross(stateCount)){var confirmed=this.handlePossibleCenter(stateCount,i,j);if(confirmed)if(iSkip=2,this.hasSkipped)done=this.haveMultiplyConfirmedCenters();else{var rowSkip=this.findRowSkip();rowSkip>stateCount[2]&&(i+=rowSkip-stateCount[2]-iSkip,j=maxJ-1)}else{do j++;while(maxJ>j&&!image[j+i*qrcode.width]);j--}currentState=0,stateCount[0]=0,stateCount[1]=0,stateCount[2]=0,stateCount[3]=0,stateCount[4]=0}else stateCount[0]=stateCount[2],stateCount[1]=stateCount[3],stateCount[2]=stateCount[4],stateCount[3]=1,stateCount[4]=0,currentState=3;else stateCount[++currentState]++;else stateCount[currentState]++;if(this.foundPatternCross(stateCount)){var confirmed=this.handlePossibleCenter(stateCount,i,maxJ);confirmed&&(iSkip=stateCount[0],this.hasSkipped&&(done=haveMultiplyConfirmedCenters()))}}var patternInfo=this.selectBestPatterns();return qrcode.orderBestPatterns(patternInfo),new FinderPatternInfo(patternInfo)}}function AlignmentPattern(posX,posY,estimatedModuleSize){this.x=posX,this.y=posY,this.count=1,this.estimatedModuleSize=estimatedModuleSize,this.__defineGetter__("EstimatedModuleSize",function(){return this.estimatedModuleSize}),this.__defineGetter__("Count",function(){return this.count}),this.__defineGetter__("X",function(){return Math.floor(this.x)}),this.__defineGetter__("Y",function(){return Math.floor(this.y)}),this.incrementCount=function(){this.count++},this.aboutEquals=function(moduleSize,i,j){if(Math.abs(i-this.y)<=moduleSize&&Math.abs(j-this.x)<=moduleSize){var moduleSizeDiff=Math.abs(moduleSize-this.estimatedModuleSize);return 1>=moduleSizeDiff||moduleSizeDiff/this.estimatedModuleSize<=1}return!1}}function AlignmentPatternFinder(image,startX,startY,width,height,moduleSize,resultPointCallback){this.image=image,this.possibleCenters=new Array,this.startX=startX,this.startY=startY,this.width=width,this.height=height,this.moduleSize=moduleSize,this.crossCheckStateCount=new Array(0,0,0),this.resultPointCallback=resultPointCallback,this.centerFromEnd=function(stateCount,end){return end-stateCount[2]-stateCount[1]/2},this.foundPatternCross=function(stateCount){for(var moduleSize=this.moduleSize,maxVariance=moduleSize/2,i=0;3>i;i++)if(Math.abs(moduleSize-stateCount[i])>=maxVariance)return!1;return!0},this.crossCheckVertical=function(startI,centerJ,maxCount,originalStateCountTotal){var image=this.image,maxI=qrcode.height,stateCount=this.crossCheckStateCount;stateCount[0]=0,stateCount[1]=0,stateCount[2]=0;for(var i=startI;i>=0&&image[centerJ+i*qrcode.width]&&stateCount[1]<=maxCount;)stateCount[1]++,i--;if(0>i||stateCount[1]>maxCount)return NaN;for(;i>=0&&!image[centerJ+i*qrcode.width]&&stateCount[0]<=maxCount;)stateCount[0]++,i--;if(stateCount[0]>maxCount)return NaN;for(i=startI+1;maxI>i&&image[centerJ+i*qrcode.width]&&stateCount[1]<=maxCount;)stateCount[1]++,i++;if(i==maxI||stateCount[1]>maxCount)return NaN;for(;maxI>i&&!image[centerJ+i*qrcode.width]&&stateCount[2]<=maxCount;)stateCount[2]++,i++;if(stateCount[2]>maxCount)return NaN;var stateCountTotal=stateCount[0]+stateCount[1]+stateCount[2];return 5*Math.abs(stateCountTotal-originalStateCountTotal)>=2*originalStateCountTotal?NaN:this.foundPatternCross(stateCount)?this.centerFromEnd(stateCount,i):NaN},this.handlePossibleCenter=function(stateCount,i,j){var stateCountTotal=stateCount[0]+stateCount[1]+stateCount[2],centerJ=this.centerFromEnd(stateCount,j),centerI=this.crossCheckVertical(i,Math.floor(centerJ),2*stateCount[1],stateCountTotal);if(!isNaN(centerI)){for(var estimatedModuleSize=(stateCount[0]+stateCount[1]+stateCount[2])/3,max=this.possibleCenters.length,index=0;max>index;index++){var center=this.possibleCenters[index];if(center.aboutEquals(estimatedModuleSize,centerI,centerJ))return new AlignmentPattern(centerJ,centerI,estimatedModuleSize)}var point=new AlignmentPattern(centerJ,centerI,estimatedModuleSize);this.possibleCenters.push(point),null!=this.resultPointCallback&&this.resultPointCallback.foundPossibleResultPoint(point)}return null},this.find=function(){for(var startX=this.startX,height=this.height,maxJ=startX+width,middleI=startY+(height>>1),stateCount=new Array(0,0,0),iGen=0;height>iGen;iGen++){var i=middleI+(0==(1&iGen)?iGen+1>>1:-(iGen+1>>1));stateCount[0]=0,stateCount[1]=0,stateCount[2]=0;for(var j=startX;maxJ>j&&!image[j+qrcode.width*i];)j++;for(var currentState=0;maxJ>j;){if(image[j+i*qrcode.width])if(1==currentState)stateCount[currentState]++;else if(2==currentState){if(this.foundPatternCross(stateCount)){var confirmed=this.handlePossibleCenter(stateCount,i,j);if(null!=confirmed)return confirmed}stateCount[0]=stateCount[2],stateCount[1]=1,stateCount[2]=0,currentState=1}else stateCount[++currentState]++;else 1==currentState&&currentState++,stateCount[currentState]++;j++}if(this.foundPatternCross(stateCount)){var confirmed=this.handlePossibleCenter(stateCount,i,maxJ);if(null!=confirmed)return confirmed}}if(0!=this.possibleCenters.length)return this.possibleCenters[0];throw"Couldn't find enough alignment patterns"}}function QRCodeDataBlockReader(blocks,version,numErrorCorrectionCode){this.blockPointer=0,this.bitPointer=7,this.dataLength=0,this.blocks=blocks,this.numErrorCorrectionCode=numErrorCorrectionCode,9>=version?this.dataLengthMode=0:version>=10&&26>=version?this.dataLengthMode=1:version>=27&&40>=version&&(this.dataLengthMode=2),this.getNextBits=function(numBits){var bits=0;if(numBits<this.bitPointer+1){for(var mask=0,i=0;numBits>i;i++)mask+=1<<i;return mask<<=this.bitPointer-numBits+1,bits=(this.blocks[this.blockPointer]&mask)>>this.bitPointer-numBits+1,this.bitPointer-=numBits,bits}if(numBits<this.bitPointer+1+8){for(var mask1=0,i=0;i<this.bitPointer+1;i++)mask1+=1<<i;return bits=(this.blocks[this.blockPointer]&mask1)<<numBits-(this.bitPointer+1),this.blockPointer++,bits+=this.blocks[this.blockPointer]>>8-(numBits-(this.bitPointer+1)),this.bitPointer=this.bitPointer-numBits%8,this.bitPointer<0&&(this.bitPointer=8+this.bitPointer),bits}if(numBits<this.bitPointer+1+16){for(var mask1=0,mask3=0,i=0;i<this.bitPointer+1;i++)mask1+=1<<i;var bitsFirstBlock=(this.blocks[this.blockPointer]&mask1)<<numBits-(this.bitPointer+1);this.blockPointer++;var bitsSecondBlock=this.blocks[this.blockPointer]<<numBits-(this.bitPointer+1+8);this.blockPointer++;for(var i=0;i<numBits-(this.bitPointer+1+8);i++)mask3+=1<<i;mask3<<=8-(numBits-(this.bitPointer+1+8));var bitsThirdBlock=(this.blocks[this.blockPointer]&mask3)>>8-(numBits-(this.bitPointer+1+8));return bits=bitsFirstBlock+bitsSecondBlock+bitsThirdBlock,this.bitPointer=this.bitPointer-(numBits-8)%8,this.bitPointer<0&&(this.bitPointer=8+this.bitPointer),bits}return 0},this.NextMode=function(){return this.blockPointer>this.blocks.length-this.numErrorCorrectionCode-2?0:this.getNextBits(4)},this.getDataLength=function(modeIndicator){for(var index=0;;){if(modeIndicator>>index==1)break;index++}return this.getNextBits(qrcode.sizeOfDataLengthInfo[this.dataLengthMode][index])},this.getRomanAndFigureString=function(dataLength){var length=dataLength,intData=0,strData="",tableRomanAndFigure=new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":");do if(length>1){intData=this.getNextBits(11);var firstLetter=Math.floor(intData/45),secondLetter=intData%45;strData+=tableRomanAndFigure[firstLetter],strData+=tableRomanAndFigure[secondLetter],length-=2}else 1==length&&(intData=this.getNextBits(6),strData+=tableRomanAndFigure[intData],length-=1);while(length>0);return strData},this.getFigureString=function(dataLength){var length=dataLength,intData=0,strData="";do length>=3?(intData=this.getNextBits(10),100>intData&&(strData+="0"),10>intData&&(strData+="0"),length-=3):2==length?(intData=this.getNextBits(7),10>intData&&(strData+="0"),length-=2):1==length&&(intData=this.getNextBits(4),length-=1),strData+=intData;while(length>0);return strData},this.get8bitByteArray=function(dataLength){var length=dataLength,intData=0,output=new Array;do intData=this.getNextBits(8),output.push(intData),length--;while(length>0);return output},this.getKanjiString=function(dataLength){var length=dataLength,intData=0,unicodeString="";do{intData=getNextBits(13);var lowerByte=intData%192,higherByte=intData/192,tempWord=(higherByte<<8)+lowerByte,shiftjisWord=0;shiftjisWord=40956>=tempWord+33088?tempWord+33088:tempWord+49472,unicodeString+=String.fromCharCode(shiftjisWord),length--}while(length>0);return unicodeString},this.__defineGetter__("DataByte",function(){for(var output=new Array,MODE_NUMBER=1,MODE_ROMAN_AND_NUMBER=2,MODE_8BIT_BYTE=4,MODE_KANJI=8;;){var mode=this.NextMode();if(0==mode){if(output.length>0)break;throw"Empty data block"}if(mode!=MODE_NUMBER&&mode!=MODE_ROMAN_AND_NUMBER&&mode!=MODE_8BIT_BYTE&&mode!=MODE_KANJI)throw"Invalid mode: "+mode+" in (block:"+this.blockPointer+" bit:"+this.bitPointer+")";if(dataLength=this.getDataLength(mode),dataLength<1)throw"Invalid data length: "+dataLength;switch(mode){case MODE_NUMBER:for(var temp_str=this.getFigureString(dataLength),ta=new Array(temp_str.length),j=0;j<temp_str.length;j++)ta[j]=temp_str.charCodeAt(j);output.push(ta);break;case MODE_ROMAN_AND_NUMBER:for(var temp_str=this.getRomanAndFigureString(dataLength),ta=new Array(temp_str.length),j=0;j<temp_str.length;j++)ta[j]=temp_str.charCodeAt(j);output.push(ta);break;case MODE_8BIT_BYTE:var temp_sbyteArray3=this.get8bitByteArray(dataLength);output.push(temp_sbyteArray3);break;case MODE_KANJI:var temp_str=this.getKanjiString(dataLength);output.push(temp_str)}}return output})}GridSampler={},GridSampler.checkAndNudgePoints=function(image,points){for(var width=qrcode.width,height=qrcode.height,nudged=!0,offset=0;offset<points.Length&&nudged;offset+=2){var x=Math.floor(points[offset]),y=Math.floor(points[offset+1]);if(-1>x||x>width||-1>y||y>height)throw"Error.checkAndNudgePoints ";nudged=!1,-1==x?(points[offset]=0,nudged=!0):x==width&&(points[offset]=width-1,nudged=!0),-1==y?(points[offset+1]=0,nudged=!0):y==height&&(points[offset+1]=height-1,nudged=!0)}nudged=!0;for(var offset=points.Length-2;offset>=0&&nudged;offset-=2){var x=Math.floor(points[offset]),y=Math.floor(points[offset+1]);if(-1>x||x>width||-1>y||y>height)throw"Error.checkAndNudgePoints ";nudged=!1,-1==x?(points[offset]=0,nudged=!0):x==width&&(points[offset]=width-1,nudged=!0),-1==y?(points[offset+1]=0,nudged=!0):y==height&&(points[offset+1]=height-1,nudged=!0)}},GridSampler.sampleGrid3=function(image,dimension,transform){for(var bits=new BitMatrix(dimension),points=new Array(dimension<<1),y=0;dimension>y;y++){for(var max=points.length,iValue=y+.5,x=0;max>x;x+=2)points[x]=(x>>1)+.5,points[x+1]=iValue;transform.transformPoints1(points),GridSampler.checkAndNudgePoints(image,points);try{for(var x=0;max>x;x+=2){var xpoint=4*Math.floor(points[x])+Math.floor(points[x+1])*qrcode.width*4,bit=image[Math.floor(points[x])+qrcode.width*Math.floor(points[x+1])];qrcode.imagedata.data[xpoint]=bit?255:0,qrcode.imagedata.data[xpoint+1]=bit?255:0,qrcode.imagedata.data[xpoint+2]=0,qrcode.imagedata.data[xpoint+3]=255,bit&&bits.set_Renamed(x>>1,y)}}catch(aioobe){throw"Error.checkAndNudgePoints"}}return bits},GridSampler.sampleGridx=function(image,dimension,p1ToX,p1ToY,p2ToX,p2ToY,p3ToX,p3ToY,p4ToX,p4ToY,p1FromX,p1FromY,p2FromX,p2FromY,p3FromX,p3FromY,p4FromX,p4FromY){var transform=PerspectiveTransform.quadrilateralToQuadrilateral(p1ToX,p1ToY,p2ToX,p2ToY,p3ToX,p3ToY,p4ToX,p4ToY,p1FromX,p1FromY,p2FromX,p2FromY,p3FromX,p3FromY,p4FromX,p4FromY);return GridSampler.sampleGrid3(image,dimension,transform)},Version.VERSION_DECODE_INFO=new Array(31892,34236,39577,42195,48118,51042,55367,58893,63784,68472,70749,76311,79154,84390,87683,92361,96236,102084,102881,110507,110734,117786,119615,126325,127568,133589,136944,141498,145311,150283,152622,158308,161089,167017),Version.VERSIONS=buildVersions(),Version.getVersionForNumber=function(versionNumber){if(1>versionNumber||versionNumber>40)throw"ArgumentException";return Version.VERSIONS[versionNumber-1]},Version.getProvisionalVersionForDimension=function(dimension){if(dimension%4!=1)throw"Error getProvisionalVersionForDimension";try{return Version.getVersionForNumber(dimension-17>>2)}catch(iae){throw"Error getVersionForNumber"}},Version.decodeVersionInformation=function(versionBits){for(var bestDifference=4294967295,bestVersion=0,i=0;i<Version.VERSION_DECODE_INFO.length;i++){var targetVersion=Version.VERSION_DECODE_INFO[i];if(targetVersion==versionBits)return this.getVersionForNumber(i+7);var bitsDifference=FormatInformation.numBitsDiffering(versionBits,targetVersion);bestDifference>bitsDifference&&(bestVersion=i+7,bestDifference=bitsDifference)}return 3>=bestDifference?this.getVersionForNumber(bestVersion):null},PerspectiveTransform.quadrilateralToQuadrilateral=function(x0,y0,x1,y1,x2,y2,x3,y3,x0p,y0p,x1p,y1p,x2p,y2p,x3p,y3p){var qToS=this.quadrilateralToSquare(x0,y0,x1,y1,x2,y2,x3,y3),sToQ=this.squareToQuadrilateral(x0p,y0p,x1p,y1p,x2p,y2p,x3p,y3p);return sToQ.times(qToS)},PerspectiveTransform.squareToQuadrilateral=function(x0,y0,x1,y1,x2,y2,x3,y3){return dy2=y3-y2,dy3=y0-y1+y2-y3,0==dy2&&0==dy3?new PerspectiveTransform(x1-x0,x2-x1,x0,y1-y0,y2-y1,y0,0,0,1):(dx1=x1-x2,dx2=x3-x2,dx3=x0-x1+x2-x3,dy1=y1-y2,denominator=dx1*dy2-dx2*dy1,a13=(dx3*dy2-dx2*dy3)/denominator,a23=(dx1*dy3-dx3*dy1)/denominator,new PerspectiveTransform(x1-x0+a13*x1,x3-x0+a23*x3,x0,y1-y0+a13*y1,y3-y0+a23*y3,y0,a13,a23,1))},PerspectiveTransform.quadrilateralToSquare=function(x0,y0,x1,y1,x2,y2,x3,y3){return this.squareToQuadrilateral(x0,y0,x1,y1,x2,y2,x3,y3).buildAdjoint()};var FORMAT_INFO_MASK_QR=21522,FORMAT_INFO_DECODE_LOOKUP=new Array(new Array(21522,0),new Array(20773,1),new Array(24188,2),new Array(23371,3),new Array(17913,4),new Array(16590,5),new Array(20375,6),new Array(19104,7),new Array(30660,8),new Array(29427,9),new Array(32170,10),new Array(30877,11),new Array(26159,12),new Array(25368,13),new Array(27713,14),new Array(26998,15),new Array(5769,16),new Array(5054,17),new Array(7399,18),new Array(6608,19),new Array(1890,20),new Array(597,21),new Array(3340,22),new Array(2107,23),new Array(13663,24),new Array(12392,25),new Array(16177,26),new Array(14854,27),new Array(9396,28),new Array(8579,29),new Array(11994,30),new Array(11245,31)),BITS_SET_IN_HALF_BYTE=new Array(0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4);FormatInformation.numBitsDiffering=function(a,b){return a^=b,BITS_SET_IN_HALF_BYTE[15&a]+BITS_SET_IN_HALF_BYTE[15&URShift(a,4)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,8)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,12)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,16)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,20)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,24)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,28)]},FormatInformation.decodeFormatInformation=function(maskedFormatInfo){var formatInfo=FormatInformation.doDecodeFormatInformation(maskedFormatInfo);return null!=formatInfo?formatInfo:FormatInformation.doDecodeFormatInformation(maskedFormatInfo^FORMAT_INFO_MASK_QR)},FormatInformation.doDecodeFormatInformation=function(maskedFormatInfo){for(var bestDifference=4294967295,bestFormatInfo=0,i=0;i<FORMAT_INFO_DECODE_LOOKUP.length;i++){var decodeInfo=FORMAT_INFO_DECODE_LOOKUP[i],targetInfo=decodeInfo[0];if(targetInfo==maskedFormatInfo)return new FormatInformation(decodeInfo[1]);var bitsDifference=this.numBitsDiffering(maskedFormatInfo,targetInfo);bestDifference>bitsDifference&&(bestFormatInfo=decodeInfo[1],bestDifference=bitsDifference)}return 3>=bestDifference?new FormatInformation(bestFormatInfo):null},ErrorCorrectionLevel.forBits=function(bits){if(0>bits||bits>=FOR_BITS.Length)throw"ArgumentException";return FOR_BITS[bits]};var L=new ErrorCorrectionLevel(0,1,"L"),M=new ErrorCorrectionLevel(1,0,"M"),Q=new ErrorCorrectionLevel(2,3,"Q"),H=new ErrorCorrectionLevel(3,2,"H"),FOR_BITS=new Array(M,L,H,Q);DataBlock.getDataBlocks=function(rawCodewords,version,ecLevel){if(rawCodewords.length!=version.TotalCodewords)throw"ArgumentException";for(var ecBlocks=version.getECBlocksForLevel(ecLevel),totalBlocks=0,ecBlockArray=ecBlocks.getECBlocks(),i=0;i<ecBlockArray.length;i++)totalBlocks+=ecBlockArray[i].Count;for(var result=new Array(totalBlocks),numResultBlocks=0,j=0;j<ecBlockArray.length;j++)for(var ecBlock=ecBlockArray[j],i=0;i<ecBlock.Count;i++){var numDataCodewords=ecBlock.DataCodewords,numBlockCodewords=ecBlocks.ECCodewordsPerBlock+numDataCodewords;result[numResultBlocks++]=new DataBlock(numDataCodewords,new Array(numBlockCodewords))}for(var shorterBlocksTotalCodewords=result[0].codewords.length,longerBlocksStartAt=result.length-1;longerBlocksStartAt>=0;){var numCodewords=result[longerBlocksStartAt].codewords.length;if(numCodewords==shorterBlocksTotalCodewords)break;longerBlocksStartAt--}longerBlocksStartAt++;for(var shorterBlocksNumDataCodewords=shorterBlocksTotalCodewords-ecBlocks.ECCodewordsPerBlock,rawCodewordsOffset=0,i=0;shorterBlocksNumDataCodewords>i;i++)for(var j=0;numResultBlocks>j;j++)result[j].codewords[i]=rawCodewords[rawCodewordsOffset++];for(var j=longerBlocksStartAt;numResultBlocks>j;j++)result[j].codewords[shorterBlocksNumDataCodewords]=rawCodewords[rawCodewordsOffset++];for(var max=result[0].codewords.length,i=shorterBlocksNumDataCodewords;max>i;i++)for(var j=0;numResultBlocks>j;j++){var iOffset=longerBlocksStartAt>j?i:i+1;result[j].codewords[iOffset]=rawCodewords[rawCodewordsOffset++]}return result},DataMask={},DataMask.forReference=function(reference){if(0>reference||reference>7)throw"System.ArgumentException";return DataMask.DATA_MASKS[reference]},DataMask.DATA_MASKS=new Array(new DataMask000,new DataMask001,new DataMask010,new DataMask011,new DataMask100,new DataMask101,new DataMask110,new DataMask111),GF256.QR_CODE_FIELD=new GF256(285),GF256.DATA_MATRIX_FIELD=new GF256(301),GF256.addOrSubtract=function(a,b){return a^b},Decoder={},Decoder.rsDecoder=new ReedSolomonDecoder(GF256.QR_CODE_FIELD),Decoder.correctErrors=function(codewordBytes,numDataCodewords){for(var numCodewords=codewordBytes.length,codewordsInts=new Array(numCodewords),i=0;numCodewords>i;i++)codewordsInts[i]=255&codewordBytes[i];var numECCodewords=codewordBytes.length-numDataCodewords;try{Decoder.rsDecoder.decode(codewordsInts,numECCodewords)}catch(rse){throw rse}for(var i=0;numDataCodewords>i;i++)codewordBytes[i]=codewordsInts[i]},Decoder.decode=function(bits){for(var parser=new BitMatrixParser(bits),version=parser.readVersion(),ecLevel=parser.readFormatInformation().ErrorCorrectionLevel,codewords=parser.readCodewords(),dataBlocks=DataBlock.getDataBlocks(codewords,version,ecLevel),totalBytes=0,i=0;i<dataBlocks.Length;i++)totalBytes+=dataBlocks[i].NumDataCodewords;for(var resultBytes=new Array(totalBytes),resultOffset=0,j=0;j<dataBlocks.length;j++){var dataBlock=dataBlocks[j],codewordBytes=dataBlock.Codewords,numDataCodewords=dataBlock.NumDataCodewords;Decoder.correctErrors(codewordBytes,numDataCodewords);for(var i=0;numDataCodewords>i;i++)resultBytes[resultOffset++]=codewordBytes[i]}var reader=new QRCodeDataBlockReader(resultBytes,version.VersionNumber,ecLevel.Bits);return reader},qrcode={},qrcode.imagedata=null,qrcode.width=0,qrcode.height=0,qrcode.qrCodeSymbol=null,qrcode.debug=!1,qrcode.sizeOfDataLengthInfo=[[10,9,8,8],[12,11,16,10],[14,13,16,12]],qrcode.callback=null,qrcode.decode=function(src){if(0==arguments.length){var canvas_qr=document.getElementById("qr-canvas"),context=canvas_qr.getContext("2d");return qrcode.width=canvas_qr.width,qrcode.height=canvas_qr.height,qrcode.imagedata=context.getImageData(0,0,qrcode.width,qrcode.height),qrcode.result=qrcode.process(context),null!=qrcode.callback&&qrcode.callback(qrcode.result),qrcode.result}var image=new Image;image.onload=function(){var canvas_qr=document.createElement("canvas"),context=canvas_qr.getContext("2d"),canvas_out=document.getElementById("out-canvas");if(null!=canvas_out){var outctx=canvas_out.getContext("2d");outctx.clearRect(0,0,320,240),outctx.drawImage(image,0,0,320,240)}canvas_qr.width=image.width,canvas_qr.height=image.height,context.drawImage(image,0,0),qrcode.width=image.width,qrcode.height=image.height;try{qrcode.imagedata=context.getImageData(0,0,image.width,image.height)}catch(e){return qrcode.result="Cross domain image reading not supported in your browser! Save it to your computer then drag and drop the file!",void(null!=qrcode.callback&&qrcode.callback(qrcode.result))}try{qrcode.result=qrcode.process(context)}catch(e){console.log(e),qrcode.result="error decoding QR Code"}null!=qrcode.callback&&qrcode.callback(qrcode.result)},image.src=src},qrcode.decode_utf8=function(s){return decodeURIComponent(escape(s))},qrcode.process=function(ctx){var start=(new Date).getTime(),image=qrcode.grayScaleToBitmap(qrcode.grayscale());if(qrcode.debug){for(var y=0;y<qrcode.height;y++)for(var x=0;x<qrcode.width;x++){var point=4*x+y*qrcode.width*4;qrcode.imagedata.data[point]=(image[x+y*qrcode.width],0),qrcode.imagedata.data[point+1]=(image[x+y*qrcode.width],0),qrcode.imagedata.data[point+2]=image[x+y*qrcode.width]?255:0}ctx.putImageData(qrcode.imagedata,0,0)}var detector=new Detector(image),qRCodeMatrix=detector.detect();qrcode.debug&&ctx.putImageData(qrcode.imagedata,0,0);for(var reader=Decoder.decode(qRCodeMatrix.bits),data=reader.DataByte,str="",i=0;i<data.length;i++)for(var j=0;j<data[i].length;j++)str+=String.fromCharCode(data[i][j]);var end=(new Date).getTime(),time=end-start;return console.log(time),qrcode.decode_utf8(str)},qrcode.getPixel=function(x,y){if(qrcode.width<x)throw"point error";if(qrcode.height<y)throw"point error";return point=4*x+y*qrcode.width*4,p=(33*qrcode.imagedata.data[point]+34*qrcode.imagedata.data[point+1]+33*qrcode.imagedata.data[point+2])/100,p},qrcode.binarize=function(th){for(var ret=new Array(qrcode.width*qrcode.height),y=0;y<qrcode.height;y++)for(var x=0;x<qrcode.width;x++){var gray=qrcode.getPixel(x,y);ret[x+y*qrcode.width]=th>=gray?!0:!1}return ret},qrcode.getMiddleBrightnessPerArea=function(image){for(var numSqrtArea=4,areaWidth=Math.floor(qrcode.width/numSqrtArea),areaHeight=Math.floor(qrcode.height/numSqrtArea),minmax=new Array(numSqrtArea),i=0;numSqrtArea>i;i++){minmax[i]=new Array(numSqrtArea);for(var i2=0;numSqrtArea>i2;i2++)minmax[i][i2]=new Array(0,0)}for(var ay=0;numSqrtArea>ay;ay++)for(var ax=0;numSqrtArea>ax;ax++){minmax[ax][ay][0]=255;for(var dy=0;areaHeight>dy;dy++)for(var dx=0;areaWidth>dx;dx++){var target=image[areaWidth*ax+dx+(areaHeight*ay+dy)*qrcode.width];target<minmax[ax][ay][0]&&(minmax[ax][ay][0]=target),target>minmax[ax][ay][1]&&(minmax[ax][ay][1]=target)}}for(var middle=new Array(numSqrtArea),i3=0;numSqrtArea>i3;i3++)middle[i3]=new Array(numSqrtArea);for(var ay=0;numSqrtArea>ay;ay++)for(var ax=0;numSqrtArea>ax;ax++)middle[ax][ay]=Math.floor((minmax[ax][ay][0]+minmax[ax][ay][1])/2);return middle},qrcode.grayScaleToBitmap=function(grayScale){for(var middle=qrcode.getMiddleBrightnessPerArea(grayScale),sqrtNumArea=middle.length,areaWidth=Math.floor(qrcode.width/sqrtNumArea),areaHeight=Math.floor(qrcode.height/sqrtNumArea),bitmap=new Array(qrcode.height*qrcode.width),ay=0;sqrtNumArea>ay;ay++)for(var ax=0;sqrtNumArea>ax;ax++)for(var dy=0;areaHeight>dy;dy++)for(var dx=0;areaWidth>dx;dx++)bitmap[areaWidth*ax+dx+(areaHeight*ay+dy)*qrcode.width]=grayScale[areaWidth*ax+dx+(areaHeight*ay+dy)*qrcode.width]<middle[ax][ay]?!0:!1;
    return bitmap},qrcode.grayscale=function(){for(var ret=new Array(qrcode.width*qrcode.height),y=0;y<qrcode.height;y++)for(var x=0;x<qrcode.width;x++){var gray=qrcode.getPixel(x,y);ret[x+y*qrcode.width]=gray}return ret},Array.prototype.remove=function(from,to){var rest=this.slice((to||from)+1||this.length);return this.length=0>from?this.length+from:from,this.push.apply(this,rest)};var MIN_SKIP=3,MAX_MODULES=57,INTEGER_MATH_SHIFT=8,CENTER_QUORUM=2;qrcode.orderBestPatterns=function(patterns){function distance(pattern1,pattern2){return xDiff=pattern1.X-pattern2.X,yDiff=pattern1.Y-pattern2.Y,Math.sqrt(xDiff*xDiff+yDiff*yDiff)}function crossProductZ(pointA,pointB,pointC){var bX=pointB.x,bY=pointB.y;return(pointC.x-bX)*(pointA.y-bY)-(pointC.y-bY)*(pointA.x-bX)}var pointA,pointB,pointC,zeroOneDistance=distance(patterns[0],patterns[1]),oneTwoDistance=distance(patterns[1],patterns[2]),zeroTwoDistance=distance(patterns[0],patterns[2]);if(oneTwoDistance>=zeroOneDistance&&oneTwoDistance>=zeroTwoDistance?(pointB=patterns[0],pointA=patterns[1],pointC=patterns[2]):zeroTwoDistance>=oneTwoDistance&&zeroTwoDistance>=zeroOneDistance?(pointB=patterns[1],pointA=patterns[0],pointC=patterns[2]):(pointB=patterns[2],pointA=patterns[0],pointC=patterns[1]),crossProductZ(pointA,pointB,pointC)<0){var temp=pointA;pointA=pointC,pointC=temp}patterns[0]=pointA,patterns[1]=pointB,patterns[2]=pointC};
angular.module('reg')
  .factory('AuthService', [
    '$http',
    '$rootScope',
    '$state',
    '$window',
    'Session',
    function($http, $rootScope, $state, $window, Session) {
      var authService = {};

      function loginSuccess(data, cb, volunteer){
        // Winner winner you get a token
        if(!volunteer) {Session.create(data.token, data.user);}

        if (cb){
          cb(data.user);
        }
      }

      function loginFailure(data, cb, volunteer){
        if(!volunteer) {$state.go('home');}
        if (cb) {
          cb(data);
        }
      }

      authService.loginWithPassword = function(email, password, onSuccess, onFailure) {
        return $http
          .post('/auth/login', {
            email: email,
            password: password
          })
          .then(response => {
            loginSuccess(response.data, onSuccess);
          }, response => {
            loginFailure(response.data, onFailure);
          });
      };

      authService.loginWithToken = function(token, onSuccess, onFailure){
        return $http
          .post('/auth/login', {
            token: token
          })
          .then(response => {
            loginSuccess(response.data, onSuccess);
          }, response => {
            if (response.status === 400) {
              Session.destroy(loginFailure);
            }
          });
      };

      authService.logout = function(callback) {
        // Clear the session
        Session.destroy(callback);
        $state.go('home');
      };

      authService.register = function(email, password, onSuccess, onFailure ,volunteer) {
        return $http
          .post('/auth/register', {
            email: email,
            password: password,
            volunteer: volunteer,
          })
          .then(response => {
            loginSuccess(response.data, onSuccess, volunteer);
          }, response => {
            loginFailure(response.data, onFailure, volunteer);
          });
      };

      authService.verify = function(token, onSuccess, onFailure) {
        return $http
          .get('/auth/verify/' + token)
          .then(response => {
            Session.setUser(response.data);
            if (onSuccess) {
              onSuccess(response.data);
            }
          }, response => {
            if (onFailure) {
              onFailure(response.data);
            }
          });
      };

      authService.resendVerificationEmail = function(onSuccess, onFailure){
        return $http
          .post('/auth/verify/resend', {
            id: Session.getUserId()
          });
      };

      authService.sendResetEmail = function(email){
        return $http
          .post('/auth/reset', {
            email: email
          });
      };

      authService.resetPassword = function(token, pass, onSuccess, onFailure){
        return $http
          .post('/auth/reset/password', {
            token: token,
            password: pass
          })
          .then(onSuccess, onFailure);
      };

      return authService;
    }
  ]);

angular.module('reg').factory("ChallengeService", [
    "$http",
    function($http) {
      var challenges = "/api/challenges";
      var base = challenges + "/";
  
      return {
        // ----------------------
        // Basic Actions
        // ----------------------

        create: function(cData) {
            return $http.post(challenges + "/create", {
              cData: cData
            });
          },


        update: function(id, cData) {
            return $http.post(base + id + "/update", {
              cData: cData
            });
          },


        remove: function(id) {
            return $http.post(base + id + "/remove");
        },

        get: function(id) {
            return $http.get(base + id);
        },
        
        getAll: function() {
            return $http.get(base);
        },

        getAnswer: function(id) {
          return $http.get(base + id + "/answer");
        },

  
      };
    }
  ]);
  
angular.module('reg').factory("MarketingService", [
    "$http",
    function($http) {
      var marketing = "/api/marketing";
      var base = marketing + "/";
  
      return {
        // ----------------------
        // Basic Actions
        // ----------------------

        createTeam: function(teamData) {
            return $http.post(marketing + "/createTeam", {
              teamData: teamData
            });
          },
        
        getAll: function() {
            return $http.get(base);
        },

        sendFriendInvite: function(username,teammate){
          return $http.post(marketing + "/sendInvite", {
            username: username,
            teammate: teammate
          });
        }
  
      };
    }
  ]);
  
angular.module('reg') 
  .factory('SettingsService', [
  '$http',
  function($http){

    var base = '/api/settings/';

    return {
      getPublicSettings: function(){
        return $http.get(base);
      },
      updateRegistrationTimes: function(open, close){
        return $http.put(base + 'times', {
          timeOpen: open,
          timeClose: close,
        });
      },
      updateConfirmationTime: function(time){
        return $http.put(base + 'confirm-by', {
          time: time
        });
      },
      updateStartTime: function(time){
        return $http.put(base + 'timeStart', {
          time: time
        });
      },
      getWhitelistedEmails: function(){
        return $http.get(base + 'whitelist');
      },
      updateWhitelistedEmails: function(emails){
        return $http.put(base + 'whitelist', {
          emails: emails
        });
      },
      updateWaitlistText: function(text){
        return $http.put(base + 'waitlist', {
          text: text
        });
      },
      updateAcceptanceText: function(text){
        return $http.put(base + 'acceptance', {
          text: text
        });
      },

      updateHostSchool: function(hostSchool){
        return $http.put(base + 'hostSchool', {
          hostSchool: hostSchool
        });
      },

      updateConfirmationText: function(text){
        return $http.put(base + 'confirmation', {
          text: text
        });
      },
      updateAllowMinors: function(allowMinors){
        return $http.put(base + 'minors', { 
          allowMinors: allowMinors 
        });
      },
    };

  }
  ]);

angular.module('reg').factory("SolvedCTFService", [
    "$http",
    function($http) {
      var CTF = "/api/CTF";
      var base = CTF + "/";
  

      return {
        // ----------------------
        // Basic Actions
        // ----------------------

        solve: function(challenge, user, answer, onSuccess, onFailure) {
            return $http.post(CTF + "/solve", {
                challenge: challenge, 
                user : user,
                answer : answer,
            })
            .then(response => {
              onSuccess(challenge);
            }, response => {
              onFailure(response.data);
            });
          },
        
        getAll: function() {
            return $http.get(CTF);
        },
    
      };
    }
  ]);
  
angular.module('reg').factory("TeamService", [
    "$http",
    function($http) {
      var teams = "/api/teams";
      var base = teams + "/";
  
      return {
        // ----------------------
        // Basic Actions
        // ----------------------

        create: function(teamData) {
            return $http.post(teams + "/create", {
              teamData: teamData
            });
        },

        getAll: function() {
          return $http.get(base);
        },

        update: function(id, cData) {
          return $http.post(base + id + "/update", {
            cData: cData
          });
        },

        join: function(id, newuser) {
          return $http.get(base + id)
          .then(team => {
            team.data.joinRequests.push(newuser)
            return $http.post(base + id + "/updatejoined", {
              newjoinRequests: team.data.joinRequests
            });
          })
        },

        removejoin: function(id, index, user) {
          return $http.get(base + id)
          .then(team => {
            team.data.joinRequests.splice(index, 1);
            if (!(user==false)){
              $http.post(teams + "/sendRefusedTeam", {
                id: user.id,
              });
            }
            return $http.post(base + id + "/updatejoined", {
              newjoinRequests: team.data.joinRequests
            });
          })
        },

        acceptMember: function(id, newuser,maxTeamSize) {
          return $http.get(base + id)
          .then(team => {
            if (team.data.members.length>=maxTeamSize){ return 'maxTeamSize' }

            team.data.members.push(newuser)
            $http.post(teams + "/sendAcceptedTeam", {
              id: newuser.id,
            });
            return $http.post(base + id + "/updateMembers", {
              newMembers: team.data.members,
            });
          })
        },

        removemember: function(id, index, userID) {
          return $http.get(base + id)
          .then(team => {
            var removedUser = team.data.members[index]
            if (index==0){return "removingAdmin"}
            team.data.members.splice(index, 1);
            if (!userID){
              $http.post(teams + "/sendAdminRemovedTeam", {
                id: team.data.members[0].id,
                member: removedUser.name
              });  
            }else{
              $http.post(teams + "/sendRemovedTeam", {
                id: userID,
              });  
            }
            return $http.post(base + id + "/updateMembers", {
              newMembers: team.data.members,
            });
          })
        },


        remove: function(id) {
            return $http.post(base + id + "/remove");
        },

        get: function(id) {
          return $http.get(base + id);
        },
        
        toggleCloseTeam: function(id, status) {
          return $http.post(base + id + "/toggleCloseTeam", {
            status: status
          });
        },

        toggleHideTeam: function(id, status) {
          return $http.post(base + id + "/toggleHideTeam", {
            status: status
          });
        },

        getSelectedTeams: function(text,skillsFilters) {
          return $http.get( teams + "?" + $.param({
                text: text,
                search: true,
                skillsFilters: skillsFilters ? skillsFilters : {}
              })
          );
        }, 
  


      };
    }
  ]);
  
angular.module("reg").factory("UserService", [
  "$http",
  "Session",
  function($http, Session) {
    var users = "/api/users";
    var base = users + "/";

    return {
      // ----------------------
      // Basic Actions
      // ----------------------
      getCurrentUser: function() {
        return $http.get(base + Session.getUserId());
      },

      get: function(id) {
        return $http.get(base + id);
      },

      getAll: function() {
        return $http.get(base);
      },

      getPage: function(page, size, text,statusFilters) {
        return $http.get( users + "?" + $.param({
              text: text,
              page: page ? page : 0,
              size: size ? size : 20,
              statusFilters: statusFilters ? statusFilters : {}

            })
        );
      },

      updateProfile: function(id, profile) {
        return $http.put(base + id + "/profile", {
          profile: profile
        });
      },

      updateConfirmation: function(id, confirmation) {
        return $http.put(base + id + "/confirm", {
          confirmation: confirmation
        });
      },

      updateAll: function(id, user) {
        return $http.put(base + id + "/updateall", {
          user: user
        });
      },

      declineAdmission: function(id) {
        return $http.post(base + id + "/decline");
      },

      // -------------------------
      // Admin Only
      // -------------------------

      getStats: function() {
        return $http.get(base + "stats");
      },

      getTeamStats: function() {
        return $http.get(base + "teamStats");
      },

      admitUser: function(id) {
        return $http.post(base + id + "/admit");
      },
      rejectUser: function(id) {
        return $http.post(base + id + "/reject");
      },
      softAdmittUser: function(id) {
        return $http.post(base + id + "/softAdmit");
      },

      softRejectUser: function(id) {
        return $http.post(base + id + "/softReject");
      },

      sendBasicMail: function(id , email) {
        return $http.post(base + id + "/sendBasicMail",JSON.stringify(email));
      },

      checkIn: function(id) {
        return $http.post(base + id + "/checkin");
      },

      checkOut: function(id) {
        return $http.post(base + id + "/checkout");
      },

      removeUser: function(id) {
        return $http.post(base + id + "/removeuser");
      },

      makeAdmin: function(id) {
        return $http.post(base + id + "/makeadmin");
      },

      removeAdmin: function(id) {
        return $http.post(base + id + "/removeadmin");
      },

      massReject: function() {
        return $http.post(base + "massReject");
      },

      getRejectionCount: function() {
        return $http.get(base + "rejectionCount");
      },

      getLaterRejectedCount: function() {
        return $http.get(base + "laterRejectCount");
      },

      massRejectRest: function() {
        return $http.post(base + "massRejectRest");
      },

      getRestRejectionCount: function() {
        return $http.get(base + "rejectionCountRest");
      },

      reject: function(id) {
        return $http.post(base + id + "/reject");
      },

      sendLaggerEmails: function() {
        return $http.post(base + "sendlagemails");
      },

      sendRejectEmails: function() {
        return $http.post(base + "sendRejectEmails");
      },

      sendRejectEmailsRest: function() {
        return $http.post(base + "sendRejectEmailsRest");
      },

      sendRejectEmail: function(id) {
        return $http.post(base + id + "/rejectEmail");
      },

      sendPasswordResetEmail: function(email) {
        return $http.post(base + "sendResetEmail", { email: email });
      },



    };
  }
]);

angular.module('reg')
  .controller('adminChallengeCtrl',[
    '$scope',
    '$http',
    'challenge',
    'ChallengeService',
    function($scope, $http, challenge, ChallengeService){
      $scope.selectedchallenge = challenge.data;
      
      ChallengeService.getAnswer(challenge.data._id).then(response => {
        $scope.selectedchallenge.answer = response.data.answer;
      });

      $scope.togglePassword = function () { $scope.typePassword = !$scope.typePassword; };


      $scope.updateChallenge = function(){
        ChallengeService
          .update($scope.selectedchallenge._id, $scope.selectedchallenge)
          .then(response => {
            $selectedchallenge = response.data;
            swal("Updated!", "Challenge updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });  
      };

    }]);

angular.module("reg").controller("adminChallengesCtrl", [
  "$scope",
  "$state",
  "$stateParams",
  "ChallengeService",
  function($scope, $state, $stateParams, ChallengeService) {

    $scope.challenges = [];

    // Semantic-UI moves modal content into a dimmer at the top level.
    // While this is usually nice, it means that with our routing will generate
    // multiple modals if you change state. Kill the top level dimmer node on initial load
    // to prevent this.
    $(".ui.dimmer").remove();
    // Populate the size of the modal for when it appears, with an arbitrary Challenge.

    function refreshPage() {
      ChallengeService.getAll().then(response => {
        $scope.challenges = response.data;
      });
    }

    refreshPage();

    $scope.goChallenge = function($event, challenge) {

      $event.stopPropagation();
      $state.go("app.admin.challenge", {
        id: challenge._id
      });
    }

    $scope.createChallenge = function() {

      swal("Write the challenge title:", {
        buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Next input",value: true,visible: true} },
        content: {element: "input", attributes: {placeholder: "Give this challenge a sexy name..",type: "text"} },
      })
      .then((title) => { if (!title) {return;}
        swal("Enter the challenge description:", {
          buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Next input",value: true,visible: true} },
          content: {element: "input", attributes: {placeholder: "Describe this challenge so that people can get the idea..",type: "text"} },
          })
        .then((description) => { if (!description) {return;}
          swal("Enter the challenge dependency (LINK):", {
            buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Next input",value: true,visible: true} },
            content: {element: "input", attributes: {placeholder: "http://www.example.com/Challenge42.zip",type: "text"} },
            })
          .then((dependency) => { if (!dependency) {return;}
            swal("Enter the answer:", {
              buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Next input",value: true,visible: true} },
              content: {element: "input", attributes: {placeholder: "shhhh this si super secret bro",type: "text"} },
              })
            .then((answer) => { if (!answer) {return;}
              swal("Enter the number of points for this challenge:", {
                buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Next input",value: true,visible: true} },
                content: {element: "input", attributes: {placeholder: "Points awarded to challenge solvers",type: "number"} },
                })
              .then((points) => { if (!points) {return;}
  
                cData = {
                  title:title,
                  description:description,
                  dependency:dependency,
                  answer:answer,
                  points:points,
                }
                ChallengeService.create(cData).then(response => {
                });
                refreshPage();
              });
            });
          });
        });
      });
      
    };

    $scope.removeChallenge = function($event, challenge, index) {
      $event.stopPropagation();
      swal({
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          accept: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, remove them",
            value: true,
            visible: true
          }
        },
        dangerMode: true,
        icon: "warning",
        text: "You are about to remove " + challenge.title + "!",
        title: "Whoa, wait a minute!"
      }).then(value => {
        if (!value) {
          return;
        }

        swal({
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            yes: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove this challenge",
              value: true,
              visible: true
            }
          },
          dangerMode: true,
          title: "Are you sure?",
          text: "Remember, this power is a privilege.",
          icon: "warning"
        }).then(value => {
          if (!value) {
            return;
          }

          ChallengeService.remove(challenge._id).then(response => {
            $scope.challenges[index] = response.data;
            swal(
              "Removed",
              response.data.title + " has been removed.",
              "success"
            );
          });
          refreshPage();
        });
      });
    };

  }
]);

angular.module("reg").controller("AdminMailCtrl", [
  "$scope",
  "$state",
  "$stateParams",
  "UserService",
  function($scope, $state, $stateParams, UserService) {
    $scope.pages = [];
    $scope.users = [];

    // Semantic-UI moves modal content into a dimmer at the top level.
    // While this is usually nice, it means that with our routing will generate
    // multiple modals if you change state. Kill the top level dimmer node on initial load
    // to prevent this.
    $(".ui.dimmer").remove();
    // Populate the size of the modal for when it appears, with an arbitrary user.



    UserService.getPage($stateParams.page, $stateParams.size, $stateParams.query, $scope.statusFilters)
    .then(response => {
      $scope.users= response.data.users;
    });

    $scope.sendEmail = function() {
      var filteredUsers = $scope.users.filter(
        u => u.verified
    );

      if ($scope.statusFilters.completedProfile) {
        filteredUsers = filteredUsers.filter(
          u => u.status.completedProfile
      )}

      if ($scope.statusFilters.admitted) {
        filteredUsers = filteredUsers.filter(
          u => u.status.admitted
      )}

      if ($scope.statusFilters.confirmed) {
        filteredUsers = filteredUsers.filter(
          u => u.status.confirmed
      )}

      if ($scope.statusFilters.declined) {
        filteredUsers = filteredUsers.filter(
          u => u.status.declined
      )}

      if ($scope.statusFilters.checkedIn) {
        filteredUsers = filteredUsers.filter(
          u => u.status.checkedIn
      )}

      var message = $(this).data("confirm");

      swal({
        title: "Whoa, wait a minute!",
        text: `You're about to send this email to ${
          filteredUsers.length
        } selected user(s).`,
        icon: "warning",
        buttons: ["Cancel", "Yes, send the emails"],
        dangerMode: true
      }).then(willSend => {
        email = { subject:$scope.subject , title:$scope.title, body:$scope.body }

        if (willSend) {
          if (filteredUsers.length) {
            filteredUsers.forEach(user => {
              UserService.sendBasicMail(user.id,email);
            });
            swal(
              "Sending!",
              `Sending emails to ${
                filteredUsers.length
              } users!`,
              "success"
            );
          } else {
            swal("Whoops", "You can't send or accept 0 users!", "error");
          }
        }
      });
    };

  }
]);

angular.module("reg").controller("adminMarketingCtrl", [
  "$scope",
  "$state",
  "$stateParams",
  "MarketingService",
  function($scope, $state, $stateParams, MarketingService) {

    // Semantic-UI moves modal content into a dimmer at the top level.
    // While this is usually nice, it means that with our routing will generate
    // multiple modals if you change state. Kill the top level dimmer node on initial load
    // to prevent this.
    $(".ui.dimmer").remove();
    // Populate the size of the modal for when it appears, with an arbitrary user.




    $scope.createTeams = function(){

      if ($scope.body && $scope.event){
        swal({
          title: "Whoa, wait a minute!",
          text: `You're about to add these teams emails to the marketing database`,
          icon: "warning",
          buttons: ["Cancel", "Yes, Add teams"],
          dangerMode: true
        }).then(value => {
          if (value) {
            var teams = $scope.body.split(';');
            teams.forEach(team => {
              teamData = {
                event:$scope.event,
                members:team.replace(' ','').split(',')
              }
              MarketingService.createTeam(teamData);
            });
            swal("Added", "Teams added to database.", "success");
            $scope.body=""
          }
        });
      }
      else {
        swal("ERROR!", "All fields are required.", "error");
      }
    }


    
  }
]);

angular.module('reg')
  .controller('AdminSettingsCtrl', [
    '$scope',
    '$sce',
    'SettingsService',
    function($scope, $sce, SettingsService){

      $scope.settings = {};
      SettingsService
        .getPublicSettings()
        .then(response => {
          updateSettings(response.data);
        });

      function updateSettings(settings){
        $scope.loading = false;
         // Format the dates in settings.
        settings.timeOpen = new Date(settings.timeOpen);
        settings.timeClose = new Date(settings.timeClose);
        settings.timeConfirm = new Date(settings.timeConfirm);
        settings.timeStart = new Date(settings.timeStart);

        $scope.settings = settings;
      }

      // Additional Options --------------------------------------

      $scope.updateAllowMinors = function () {
        SettingsService
          .updateAllowMinors($scope.settings.allowMinors)
          .then(response => {
            $scope.settings.allowMinors = response.data.allowMinors;
            const successText = $scope.settings.allowMinors ?
              "Minors are now allowed to register." :
              "Minors are no longer allowed to register."
            swal("Looks good!", successText, "success");
          });
      };

      // Whitelist --------------------------------------

      SettingsService
        .getWhitelistedEmails()
        .then(response => {
          $scope.whitelist = response.data.join(", ");
        });

        $scope.updateWhitelist = function(){
          SettingsService
            .updateWhitelistedEmails($scope.whitelist.replace(/ /g, '').split(','))
            .then(response => {
              swal('Whitelist updated.');
              $scope.whitelist = response.data.whitelistedEmails.join(", ");
            });
        };

      // Registration Times -----------------------------

      $scope.formatDate = function(date){
        if (!date){
          return "Invalid Date";
        }

        // Hack for timezone
        return moment(date).format('dddd, MMMM Do YYYY, h:mm a') +
          " " + date.toTimeString().split(' ')[2];
      };

      // Take a date and remove the seconds.
      function cleanDate(date){
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes()
        );
      }

      $scope.updateRegistrationTimes = function(){
        // Clean the dates and turn them to ms.
        var open = cleanDate($scope.settings.timeOpen).getTime();
        var close = cleanDate($scope.settings.timeClose).getTime();

        if (open < 0 || close < 0 || open === undefined || close === undefined){
          return swal('Oops...', 'You need to enter valid times.', 'error');
        }
        if (open >= close){
          swal('Oops...', 'Registration cannot open after it closes.', 'error');
          return;
        }

        SettingsService
          .updateRegistrationTimes(open, close)
          .then(response => {
            updateSettings(response.data);
            swal("Looks good!", "Registration Times Updated", "success");
          });
      };

      // Confirmation Time -----------------------------

      $scope.updateConfirmationTime = function(){
        var confirmBy = cleanDate($scope.settings.timeConfirm).getTime();

        SettingsService
          .updateConfirmationTime(confirmBy)
          .then(response => {
            updateSettings(response.data);
            swal("Sounds good!", "Confirmation Date Updated", "success");
          });
      };

      // Event Start Time -----------------------------

      $scope.updateStartTime = function(){
        var startBy = cleanDate($scope.settings.timeStart).getTime();

        SettingsService
          .updateStartTime(startBy)
          .then(response => {
            updateSettings(response.data);
            swal("Sounds good!", "Event Start Date Updated", "success");
          });
      };


      // Acceptance / Confirmation Text ----------------

      var converter = new showdown.Converter();

      $scope.markdownPreview = function(text){
        return $sce.trustAsHtml(converter.makeHtml(text));
      };

      $scope.updateWaitlistText = function(){
        var text = $scope.settings.waitlistText;
        SettingsService
          .updateWaitlistText(text)
          .then(response => {
            swal("Looks good!", "Waitlist Text Updated", "success");
            updateSettings(response.data);
          });
      };

      $scope.updateHostSchool = function(){
        var hostSchool = $scope.settings.hostSchool;
        SettingsService
          .updateHostSchool(hostSchool)
          .then(response => {
            swal("Looks good!", "Host School Updated", "success");
            updateSettings(response.data);
          });
      };

    
      $scope.updateAcceptanceText = function(){
        var text = $scope.settings.acceptanceText;
        SettingsService
          .updateAcceptanceText(text)
          .then(response => {
            swal("Looks good!", "Acceptance Text Updated", "success");
            updateSettings(response.data);
          });
      };

      $scope.updateConfirmationText = function(){
        var text = $scope.settings.confirmationText;
        SettingsService
          .updateConfirmationText(text)
          .then(response => {
            swal("Looks good!", "Confirmation Text Updated", "success");
            updateSettings(response.data);
          });
      };

    }]);

angular.module('reg')
  .controller('AdminUserCtrl',[
    '$scope',
    '$http',
    'user',
    'UserService',
    function($scope, $http, User, UserService){
      $scope.selectedUser = User.data;

      // Populate the school dropdown
      populateSchools();

      function populateSchools(){

        $http
          .get('/assets/schools.json')
          .then(function(res){
            var schools = res.data;
            var email = $scope.selectedUser.email.split('@')[1];

            if (schools[email]){
              $scope.selectedUser.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }

          });
      }


      $scope.updateProfile = function(){
        UserService
          .updateProfile($scope.selectedUser._id, $scope.selectedUser.profile)
          .then(response => {
            $selectedUser = response.data;
            swal("Updated!", "Profile updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });
      };


      $scope.updateConfirmation = function(){
        UserService
          .updateConfirmation($scope.selectedUser._id, $scope.selectedUser.confirmation)
          .then(response => {
            $selectedUser = response.data;
            swal("Updated!", "Confirmation updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });
      };


      $scope.updateAllUser = function(){

        UserService
          .updateAll($scope.selectedUser._id, $scope.selectedUser)
          .then(response => {
            $selectedUser = response.data;
            swal("Updated!", "ALL Profile updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });  
      };





    }]);

angular.module("reg").controller("AdminUsersCtrl", [
  "$scope",
  "$state",
  "$stateParams",
  "UserService",
  'AuthService',
  function($scope, $state, $stateParams, UserService, AuthService) {
    $scope.pages = [];
    $scope.users = [];

    // Semantic-UI moves modal content into a dimmer at the top level.
    // While this is usually nice, it means that with our routing will generate
    // multiple modals if you change state. Kill the top level dimmer node on initial load
    // to prevent this.
    $(".ui.dimmer").remove();
    // Populate the size of the modal for when it appears, with an arbitrary user.
    $scope.selectedUser = {};
    $scope.selectedUser.sections = generateSections({
      status: "",
      confirmation: {
        dietaryRestrictions: []
      },
      profile: ""
    });

    function updatePage(data) {
      $scope.users = data.users;
      $scope.currentPage = data.page;
      $scope.pageSize = data.size;

      var p = [];
      for (var i = 0; i < data.totalPages; i++) {
        p.push(i);
      }
      $scope.pages = p;
    }

    UserService.getPage($stateParams.page, $stateParams.size, $stateParams.query, $scope.statusFilters)
    .then(response => {

      updatePage(response.data);
    });

    $scope.$watch("queryText", function(queryText) {
      UserService.getPage($stateParams.page, $stateParams.size, queryText, $scope.statusFilters).then(
        response => {
          updatePage(response.data);
        }
      );
    });


    $scope.applyStatusFilter = function () {
      UserService
        .getPage($stateParams.page, $stateParams.size, $scope.queryText, $scope.statusFilters).then(
          response => {
            updatePage(response.data);
        });
    };


    $scope.goToPage = function(page) {
      $state.go("app.admin.users", {
        page: page,
        size: $stateParams.size || 20
      });
    };

    $scope.goUser = function($event, user) {
      $event.stopPropagation();

      $state.go("app.admin.user", {
        id: user._id
      });
    };


    $scope.acceptUser = function($event, user, index) {
      $event.stopPropagation();
      swal({
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          accept: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, accept them",
            value: true,
            visible: true
          }
        },
        dangerMode: true,
        icon: "warning",
        text: "You are about to accept " + user.profile.name + "!",
        title: "Whoa, wait a minute!"
      }).then(value => {
        if (!value) {
          return;
        }
        swal({
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            yes: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, accept this user",
              value: true,
              visible: true
            }
          },
          dangerMode: true,
          title: "Are you sure?",
          text:
            "Your account will be logged as having accepted this user. " +
            "Remember, this power is a privilege.",
          icon: "warning"
        }).then(value => {
          if (!value) {
            return;
          }
          
          UserService.softAdmittUser(user._id).then(response => {
            $scope.users[index] = response.data;
            swal(
              "Accepted",
              response.data.profile.name + " has been admitted.",
              "success"
            );
            $state.reload();
          });
        });
      });
    };



    $scope.rejecttUser = function($event, user, index) {
      $event.stopPropagation();
      swal({
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          accept: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, reject them",
            value: true,
            visible: true
          }
        },
        dangerMode: true,
        icon: "warning",
        text: "You are about to reject " + user.profile.name + "!",
        title: "Whoa, wait a minute!"
      }).then(value => {
        if (!value) {
          return;
        }

        swal({
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            yes: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, reject this user",
              value: true,
              visible: true
            }
          },
          dangerMode: true,
          title: "Are you sure?",
          text:
            "Your account will be logged as having rejected this user. " +
            "Remember, this power is a privilege.",
          icon: "warning"
        }).then(value => {
          if (!value) {
            return;
          }
          
          UserService.softRejectUser(user._id).then(response => {
            $scope.users[index] = response.data;
            swal(
              "Rejected",
              response.data.profile.name + " has been rejected.",
              "success"
            );
            $state.reload();
          });
        });
      });
    };




    $scope.removeUser = function($event, user, index) {
      $event.stopPropagation();


      swal({
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          accept: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, remove them",
            value: true,
            visible: true
          }
        },
        dangerMode: true,
        icon: "warning",
        text: "You are about to remove " + user.profile.name + "!",
        title: "Whoa, wait a minute!"
      }).then(value => {
        if (!value) {
          return;
        }

        swal({
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            yes: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove this user",
              value: true,
              visible: true
            }
          },
          dangerMode: true,
          title: "Are you sure?",
          text:
            "Your account will be logged as having removed this user. " +
            "Remember, this power is a privilege.",
          icon: "warning"
        }).then(value => {
          if (!value) {
            return;
          }

          UserService.removeUser(user._id).then(response => {
            $scope.users[index] = response.data;
            swal(
              "Removed",
              response.data.profile.name + " has been removed.",
              "success"
            );
            $state.reload();
          });
        });
      });
    };

    $scope.sendAcceptanceEmails = function() {
      const filterSoftAccepted = $scope.users.filter(
        u => u.status.softAdmitted && !u.status.admitted
      );

      var message = $(this).data("confirm");

      swal({
        title: "Whoa, wait a minute!",
        text: `You're about to send acceptance emails (and accept) ${
          filterSoftAccepted.length
        } user(s).`,
        icon: "warning",
        buttons: ["Cancel", "Yes, accept them and send the emails"],
        dangerMode: true
      }).then(willSend => {
        if (willSend) {
          if (filterSoftAccepted.length) {
            filterSoftAccepted.forEach(user => {
              UserService.admitUser(user._id); 
            });
            swal(
              "Sending!",
              `Accepting and sending emails to ${
                filterSoftAccepted.length
              } users!`,
              "success"
            );
          } else {
            swal("Whoops", "You can't send or accept 0 users!", "error");
          }
        }
      });
    };



    $scope.sendRejectionEmails = function() {
      const filterSoftRejected = $scope.users.filter(
        u => u.status.softRejected
      );

      var message = $(this).data("confirm");

      swal({
        title: "Whoa, wait a minute!",
        text: `You're about to send rejection emails (and reject) ${
          filterSoftRejected.length
        } user(s).`,
        icon: "warning",
        buttons: ["Cancel", "Yes, reject them and send the emails"],
        dangerMode: true
      }).then(willSend => {
        if (willSend) {
          if (filterSoftRejected.length) {
            filterSoftRejected.forEach(user => {
              UserService.rejectUser(user._id); 
            });
            swal(
              "Sending!",
              `Rejecting and sending emails to ${
                filterSoftRejected.length
              } users!`,
              "success"
            );
          } else {
            swal("Whoops", "You can't send or reject 0 users!", "error");
          }
        }
      });
    };


    $scope.exportUsers = function(){
      var columns = ["N°", "Gender", "Full Name","School"];
      var rows = [];
      UserService.getAll().then(users => {
        var i=1;
        users.data.forEach(user => {
          rows.push([i++,user.profile.gender,user.profile.name,user.profile.school])
        });
        var doc = new jsPDF('p', 'pt');


        var totalPagesExp = "{total_pages_count_string}";

        var pageContent = function (data) {
            // HEADER
            doc.setFontSize(20);
            doc.setTextColor(40);
            doc.setFontStyle('normal');
            // if (base64Img) {
            //     doc.addImage(base64Img, 'JPEG', data.settings.margin.left, 15, 10, 10);
            // }
            doc.text("Participants List", data.settings.margin.left + 15, 22);
    
            // FOOTER
            var str = "Page " + data.pageCount;
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                str = str + " of " + totalPagesExp;
            }
            doc.setFontSize(10);
            var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            doc.text(str, data.settings.margin.left, pageHeight  - 10);
        };
        
        doc.autoTable(columns, rows, {
            addPageContent: pageContent,
            margin: {top: 30},
            theme: 'grid'
        });
        if (typeof doc.putTotalPages === 'function') {
          doc.putTotalPages(totalPagesExp);
        }
        doc.save('Participants List.pdf');
      })
    }


    $scope.toggleAdmin = function($event, user, index) {
      $event.stopPropagation();

      if (!user.admin) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about make " + user.profile.name + " an admin!",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            confirm: {
              text: "Yes, make them an admin",
              className: "danger-button",
              closeModal: false,
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }

          UserService.makeAdmin(user._id).then(response => {
            $scope.users[index] = response.data;
            swal("Made", response.data.profile.name + " an admin.", "success");
            $state.reload();
          });
        });
      } else {
        UserService.removeAdmin(user._id).then(response => {
          $scope.users[index] = response.data;
          swal("Removed", response.data.profile.name + " as admin", "success");
          $state.reload();
        });
      }
    };

    function formatTime(time) {
      if (time) {
        return moment(time).format("MMMM Do YYYY, h:mm:ss a");
      }
    }

    $scope.rowClass = function(user) {
      if (user.admin) {
        return "admin";
      }
      if (user.status.confirmed) {
        return "positive";
      }
      if (user.status.admitted && !user.status.confirmed) {
        return "warning";
      }
    };

    function selectUser(user) {
      $scope.selectedUser = user;
      $scope.selectedUser.sections = generateSections(user);
      $(".long.user.modal").modal("show");
    }

    function generateSections(user) {
      return [
        {
          name: "Basic Info",
          fields: [
            {
              name: "Created On",
              value: formatTime(user.timestamp)
            },
            {
              name: "Last Updated",
              value: formatTime(user.lastUpdated)
            },
            {
              name: "Confirm By",
              value: formatTime(user.status.confirmBy) || "N/A"
            },
            {
              name: "Checked In",
              value: formatTime(user.status.checkInTime) || "N/A"
            },
            {
              name: "Email",
              value: user.email
            }
          ]
        },
        {
          name: "Profile",
          fields: [
            {
              name: "Name",
              value: user.profile.name
            },
            {
              name: "Gender",
              value: user.profile.gender
            },
            {
              name: "School",
              value: user.profile.school
            },
            {
              name: "Graduation Year",
              value: user.profile.graduationYear
            },
            {
              name: "Hackathons visited",
              value: user.profile.howManyHackathons
            },
            {
              name: "Description",
              value: user.profile.description
            },
            {
              name: "Essay",
              value: user.profile.essay
            },
            {
              name: "Major",
              value: user.profile.major
            },
            {
              name: "Github",
              value: user.profile.github
            },
            {
              name: "Facebook",
              value: user.profile.facebook
            },
            {
              name: "Linkedin",
              value: user.profile.linkedin
            },
            {
              name:"CV link",
              value: user.profile.cvLink
            },
          ]
        },
        {
          name: "Confirmation",
          fields: [
            {
              name: "Phone Number",
              value: user.confirmation.phoneNumber
            },
            {
              name: "Needs Hardware",
              value: user.confirmation.wantsHardware,
              type: "boolean"
            },
            {
              name: "Hardware Requested",
              value: user.confirmation.hardware
            },
            {
              name:"National Card ID",
              value: user.confirmation.nationalCardID
            }
          ]
        },
        {
          name: "Travel",
          fields: [
            {
              name: "Additional Notes",
              value: user.confirmation.notes
            }
          ]
        }
      ];
    }

    function onSuccess() {
      swal("Updated!", "New Volunteer Added.", "success");
      $state.reload();
    }

    function onError(data){
      swal("Try again!", data.message, "error")
    }

    $scope.addVolunteer = function(){

      swal("Write the challenge title:", {
        buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Invite",value: true,visible: true} },
        content: {element: "input", attributes: {placeholder: "example@gmail.com",type: "text"} },
      }).then((mail) => { if (!mail) {return;} 
        AuthService.register(
          mail, "hackathon", onSuccess, onError, true)
      });
    };



    $scope.selectUser = selectUser;
  }
]);
angular.module('reg') .config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    chartColors: ['#9B66FE', '#FF6484', '#FEA03F', '#FBD04D', '#4DBFC0', '#33A3EF', '#CACBCF'],
    responsive: true
  });
}])
.controller('AdminStatsCtrl',[
    '$scope',
    'UserService',
    function($scope, UserService){
      
      UserService
        .getStats()
        .then(stats => {
          $scope.stats = stats.data; 

          // Meals 
          labels=[]
          for (let i = 0; i < stats.data.live.meal.length; i++) {
            labels.push('Meal '+(i+1))      
          }
          $scope.meals = { 
            labels : labels,
            series : ['Meals'],
            data : stats.data.live.meal,
            options : {
              "scales":{
                "xAxes":[{"ticks":{beginAtZero:true,max:stats.data.total}}]
              },
              title: {
                display: true,
                text: 'Meals Consumed'
              }
            }
           }
           
          // Workshops 
          labels=[]
          for (let i = 0; i < stats.data.live.workshop.length; i++) {
            labels.push('Workshop '+(i+1))      
          }
          $scope.workshops = { 
            labels : labels,
            series : ['Workshops'],
            data : stats.data.live.workshop,
            options:{
              elements: {
                line: {
                  borderWidth: 0.5,                
                },
              },
              title: {
                display: true,
                text: 'Workshops attendance'
              }
            }
           }

          // clubs
          $scope.clubs = {
            labels : stats.data.source.clubsLabels,
            series : ['Clubs'],
            data : stats.data.source.clubs,
            options:{
              elements: {
                line: {
                  borderWidth: 0.5,                
                },
              },
              title: {
                display: true,
                text: 'Applicants via Clubs'
              },
              legend: {
                display: true,
                position: 'right',
              },
            }
           }

           // Get the most active club
           var arr =stats.data.source.clubs
           var max = arr[0];
           var maxIndex = 0;
           for (var i = 1; i < arr.length; i++) {
               if (arr[i] > max) {
                   maxIndex = i;
                   max = arr[i];
               }
           }

           $scope.firstClub = stats.data.source.clubsLabels[maxIndex]

       


          // sources 
          $scope.source = {
            labels : ['Facebook','Email','Clubs'],
            series : ['Sources'],
            data : stats.data.source.general,
            options:{
              elements: {
                line: {
                  borderWidth: 0.5,                
                },
              },
              title: {
                display: true,
                text: 'Applicants sources'
              },
              legend: {
                display: true,
                position: 'right',
              },
            }
           }



          $scope.loading = false;
        });  


      UserService
        .getTeamStats()
        .then(teamstats => {
          $scope.teamstats = teamstats.data; 
        });  


      $scope.fromNow = function(date){
        return moment(date).fromNow();
      };


      Chart.defaults.global.colors = [
        {
          backgroundColor: 'rgba(52, 152, 219, 0.5)',
          pointBackgroundColor: 'rgba(52, 152, 219, 0.5)',
          pointHoverBackgroundColor: 'rgba(151,187,205,0.5)',
          borderColor: 'rgba(0,0,0,0',
          pointBorderColor: '#fff',
          pointHoverBorderColor: 'rgba(151,187,205,0.5)'
        }
      ]        


      $scope.sendLaggerEmails = function(){
        swal({
          title: "Are you sure?",
          text: "This will send an email to every user who has not submitted an application. Are you sure?.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, send.",
          closeOnConfirm: false
          }, function(){
            UserService
              .sendLaggerEmails()
              .then(function(){
                sweetAlert('Your emails have been sent.');
            });
          });
      };

      $scope.sendRejectEmails = function(){
        swal({
          title: "Are you sure?",
          text: "This will send an email to every user who has been rejected. Are you sure?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, send.",
          closeOnConfirm: false
          }, function(){
            UserService
              .sendRejectEmails()
              .then(function(){
                sweetAlert('Your emails have been sent.');
            });
          });
      };

      $scope.sendRejectEmailsRest = function(){
        UserService
          .getLaterRejectedCount()
          .success(function(count) {
            swal({
              title: "Are you sure?",
              text: `This will send rejection email to ${count} users.`,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, reject.",
              closeOnConfirm: false
              }, function(){
    
                UserService
                  .sendRejectEmailsRest()
                  .then(function(){
                    sweetAlert('Your emails have been sent.');
                });
            })
          })
      };

      $scope.massReject = function() {
        UserService
          .getRejectionCount()
          .success(function(count) {
            swal({
              title: "Are you sure?",
              text: `This will reject ${count} users.`,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, reject.",
              closeOnConfirm: false
              }, function(){
    
                UserService
                  .massReject()
                  .then(function(){
                    sweetAlert('Mass Rejection successful.');
                });
            })
          })
      }

      $scope.massRejectRest = function() {
        UserService
          .getRestRejectionCount()
          .success(function(count) {
            swal({
              title: "Are you sure?",
              text: `This will reject ${count} users.`,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, reject.",
              closeOnConfirm: false
              }, function(){
    
                UserService
                  .massRejectRest()
                  .then(function(){
                    sweetAlert('Mass Rejection successful.');
                });
            })
          })
      }




    }]);

angular.module('reg')
  .service('settings', function() {})
  .controller('BaseCtrl', [
    '$scope',
    'EVENT_INFO',
    function($scope, EVENT_INFO){

      $scope.EVENT_INFO = EVENT_INFO;

    }]);

angular.module('reg')
  .controller('ApplicationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$http',
    'currentUser',
    'settings',
    'Session',
    'UserService',
    'MarketingService',
    function ($scope, $rootScope, $state, $http, currentUser, settings, Session, UserService, MarketingService) {

      // Set up the user
      $scope.user = currentUser.data;

      // Is the student from HostSchool?
      $scope.isHostSchool = $scope.user.email.split('@')[1] == settings.data.hostSchool;

      // If so, default them to adult: true
      if ($scope.isHostSchool) {
        $scope.user.profile.adult = true;
      }

      // Populate the school dropdown
      populateSchools();
      _setupForm();

      populateWilayas();
      populateClubs();

      $scope.regIsClosed = Date.now() > settings.data.timeClose;

      function populateSchools() {
        $http
          .get('/assets/schools.json')
          .then(function (res) {
            var schools = res.data;
            var email = $scope.user.email.split('@')[1];

            if (schools[email]) {
              $scope.user.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }
          });

        $http
          .get('/assets/schools.csv')
          .then(function (res) {
            $scope.schools = res.data.split('\n');
            $scope.schools.push('Other');

            var content = [];

            for (i = 0; i < $scope.schools.length; i++) {
              $scope.schools[i] = $scope.schools[i].trim();
              content.push({ title: $scope.schools[i] })
            }

            $('#school.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function (result, response) {
                  $scope.user.profile.school = result.title.trim();
                }
              })
          });
      }


      function populateWilayas() {
        $http
          .get('/assets/wilayas.csv')
          .then(function (res) {
            $scope.wilayas = res.data.split('\n');
            $scope.wilayas.push('Other');

            var content = [];

            for (i = 0; i < $scope.wilayas.length; i++) {
              $scope.wilayas[i] = $scope.wilayas[i].trim();
              content.push({ title: $scope.wilayas[i] })
            }

            $('#wilaya.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function (result, response) {
                  $scope.user.profile.wilaya = result.title.trim();
                }
              })
          });
      }


      function populateClubs() {
        $http
          .get('/assets/clubs.csv')
          .then(function (res) {
            $scope.clubs = res.data.split('\n');
            $scope.clubs.push('Other');

            var content = [];

            for (i = 0; i < $scope.clubs.length; i++) {
              $scope.clubs[i] = $scope.clubs[i].trim();
              content.push({ title: $scope.clubs[i] })
            }

            $('#club.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function (result, response) {
                  $scope.club = result.title.trim();
                }
              })
          });
        if ($scope.user.profile.source != undefined) {
          $scope.UserSource = $scope.user.profile.source.split('#')[0];
          $scope.club = $scope.user.profile.source.split('#')[1];
        }
      }


      function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
          return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
      }

      function sendMarketingEmails() {
        MarketingService.getAll().then(teams => {
          var emails = [];
          teams.data.forEach(team => {
            var isTeammate = false;
            team.members.forEach(member => {
              if (member == currentUser.data.email) {
                isTeammate = true;
              }
            });
            if (isTeammate) {
              team.members.forEach(member => {
                if (!(member == currentUser.data.email)) {
                  emails.push({ email: member, event: team.event })
                }
              });
            }
          });
          removeDuplicates(emails, 'email').forEach(teammate => {
            MarketingService.sendFriendInvite(currentUser.data.profile.name, teammate)
          });
        })
      }


      function _updateUser(e) {

        //Check if User's first submission
        var sendMail = true;
        if (currentUser.data.status.completedProfile) { sendMail = false }

        // Get user Source
        if ($scope.UserSource != '2') { $scope.user.profile.source = $scope.UserSource }
        else { $scope.user.profile.source = $scope.UserSource + "#" + $scope.club }

        UserService
          .updateProfile(Session.getUserId(), $scope.user.profile)
          .then(response => {
            swal("Awesome!", "Your application has been saved.", "success").then(value => {
              if (sendMail) { sendMarketingEmails(); }
              $state.go("app.dashboard");
            });
          }, response => {
            swal("Uh oh!", "Something went wrong.", "error");
          });

      }

      function isMinor() {
        return !$scope.user.profile.adult;
      }

      function minorsAreAllowed() {
        return settings.data.allowMinors;
      }

      function minorsValidation() {
        // Are minors allowed to register?
        if (isMinor() && !minorsAreAllowed()) {
          return false;
        }
        return true;
      }

      function _setupForm() {
        // Custom minors validation rule
        $.fn.form.settings.rules.allowMinors = function (value) {
          return minorsValidation();
        };

        // Semantic-UI form valid ation
        $('.ui.form').form({
          on: 'blur',
          inline: true,
          fields: {
            name: {
              identifier: 'name',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your name.'
                }
              ]
            },
            school: {
              identifier: 'school',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your school name.'
                }
              ]
            },
            Wilaya: {
              identifier: 'Wilaya',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your wilaya name.'
                }
              ]
            },
            year: {
              identifier: 'year',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select your graduation year.'
                }
              ]
            },
            gender: {
              identifier: 'gender',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select a gender. '
                }
              ]
            },
            howManyHackathons: {
              identifier: 'howManyHackathons',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select how many hackathons you have attended.'
                }
              ]
            },
            adult: {
              identifier: 'adult',
              rules: [
                {
                  type: 'allowMinors',
                  prompt: 'You must be an adult, or an ESI student.'
                }
              ]
            },
            study: {
              identifier: 'study',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your major .'
                }
              ]
            },
            description: {
              identifier: 'description',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please describe yourself .'
                }
              ]
            },
            essay: {
              identifier: 'essay',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please tell us about your motivation .'
                }
              ]
            },
            linkedin: {
              identifier: 'linkedin',
              rules: [
                {
                  type: 'url',
                  prompt: 'Please enter a valid Linkedin URL .'
                }
              ]
            },
            facebook: {
              identifier: 'facebook',
              rules: [
                {
                  type: 'url',
                  prompt: 'Please enter a valid Facebook URL .'
                }
              ]
            },
            github: {
              identifier: 'github',
              rules: [
                {
                  type: 'url',
                  prompt: 'Please enter a valid GitHub URL .'
                }
              ]
            },
            UserSource: {
              identifier: 'UserSource',
              rules: [
                {
                  type: 'empty',
                  prompt: 'How did you hear about us ?'
                }
              ]
            },
            cvLink: {
              identifier: 'cvLink',
              rules: [
                {
                  type: 'url',
                  prompt: 'You must add a link to your CV.'
                }
              ]
            }
          }
        });
      }

      $scope.submitForm = function () {
        if ($('.ui.form').form('is valid')) {
          // $('.ui.submit.button').click();
          _updateUser();
        } else {
          swal("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };
    }]);

angular.module('reg')
  .controller('adminCtrl', [
    '$scope',
    'UserService',
    function($scope, UserService){
      $scope.loading = true;
    }]);
angular.module('reg')
  .controller('ChallengesCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$http',
    'currentUser',
    'Session',
    'ChallengeService',
    'UserService',
    'SolvedCTFService',
    function($scope, $rootScope, $state, $http, currentUser, Session, ChallengeService, UserService, SolvedCTFService) {

      
      SolvedCTFService.getAll().then(response => {
        solvedChallenges= response.data.filter(s => s.user==currentUser.data._id)
      });

      

      ChallengeService.getAll().then(response => {
        $scope.challenges = response.data;
      });



      function onSuccess(challenge) {
        swal("Awesome!", "That's correct, and you just earned +"+ challenge.points +" points.", "success")
        $state.reload()

      }

      function onError(data){
        swal("Try again!", data.message, "error") 
      }


      $scope.solveChallenge = function(challenge,answer, isenter) {
        if (isenter){
          SolvedCTFService.solve(challenge,currentUser,answer,onSuccess,onError);
        }else{
          SolvedCTFService.solve(challenge,currentUser,answer,onSuccess);
        }
        
      }

      
      $scope.showChallenge = function(challenge) {

        ChallengeService.get(challenge._id).then(response => {

          swal(response.data.title, response.data.description)

        })
      }




      SolvedCTFService.getAll().then(response => {
        allChallenges= response.data
        var Result =[]

        allChallenges.forEach(element => {
          userChallenges = allChallenges.filter(s => s.user==element.user)
          var pointsCount = 0;

          userChallenges.forEach(challenge => { pointsCount+=challenge.points });
          
          UserService.get(element.user).then(user =>{

            var grade=[]
            grade[2019] = "3CS"
            grade[2020] = "2CS"
            grade[2021] = "1CS"
            grade[2022] = "2CP"
            grade[2023] = "1CP"

            if (pointsCount>0) {Result.push({ id:user.data._id, name: user.data.profile.name, grade: grade[user.data.profile.graduationYear] ,points: pointsCount})}

          })

          allChallenges = allChallenges.filter(s => s.user!==element.user)
        });

        $scope.Result = Result;
      });
    

      $scope.rowClass = function(user) {
        
        if (user.id==currentUser.data._id) {
          return "admin";
        }
      };
  
      

    }]);

angular.module('reg')
.controller('CheckinCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'UserService',
  function($scope, $state, $stateParams, UserService){
    $('#reader').html5_qrcode(function(userID){
          //Change the input fields value and send post request to the backend
          
          UserService.get(userID).then(response => {

            user =response.data;

            if (!user.status.checkedIn) {
              swal({
                title: "Whoa, wait a minute!",
                text: "You are about to check in " + user.profile.name + "!",
                icon: "warning",
                buttons: {
                  cancel: {
                    text: "Cancel",
                    value: null,
                    visible: true
                  },
                  checkIn: {
                    className: "danger-button",
                    closeModal: false,
                    text: "Yes, check them in",
                    value: true,
                    visible: true
                  }
                }
              }).then(value => {
                if (!value) {
                  return;
                }
      
                UserService.checkIn(user._id).then(response => {
                  $scope.queryText = user.email;
                  swal(
                    "Checked in",
                    user.profile.name + " has been checked in.",
                    "success"
                  );
                });
              });
            } else {
              swal(
                "Already checkedIn",
                user.profile.name + " has been checked-in at: "+ formatTime(user.status.checkInTime),
                "warning"
              );
          }
          });

        },
      function(error){
      }, function(videoError){
        //the video stream could be opened
      }
    );
    $scope.pages = [];
    $scope.users = [];
    $scope.sortBy = 'timestamp'
    $scope.sortDir = false

    $scope.filter = deserializeFilters($stateParams.filter);
    $scope.filter.text = $stateParams.query || "";

    function deserializeFilters(text) {
      var out = {};
      if (!text) return out;
      text.split(",").forEach(function(f){out[f]=true});
      return (text.length===0)?{}:out;
    }

    function serializeFilters(filters) {
      var out = "";
      for (var v in filters) {if(typeof(filters[v])==="boolean"&&filters[v]) out += v+",";}
      return (out.length===0)?"":out.substr(0,out.length-1);
    }

    // Semantic-UI moves modal content into a dimmer at the top level.
    // While this is usually nice, it means that with our routing will generate
    // multiple modals if you change state. Kill the top level dimmer node on initial load
    // to prevent this.
    $('.ui.dimmer').remove();
    // Populate the size of the modal for when it appears, with an arbitrary user.
    $scope.selectedUser = {};
    $scope.selectedUser.sections = generateSections({
      status: "",
      confirmation: {
        dietaryRestrictions: []
      },
      profile: ""
    });

    function updatePage(data) {
      $scope.users = data.users;
      $scope.currentPage = data.page;
      $scope.pageSize = data.size;

      var p = [];
      for (var i = 0; i < data.totalPages; i++) {
        p.push(i);
      }
      $scope.pages = p;
    }

    UserService.getPage($stateParams.page, $stateParams.size, $stateParams.query, $scope.statusFilters)
    .then(response => {

      updatePage(response.data);
    });

    $scope.$watch("queryText", function(queryText) {
      UserService.getPage($stateParams.page, $stateParams.size, queryText, $scope.statusFilters).then(
        response => {
          updatePage(response.data);
        }
      );
    });


    $scope.applyStatusFilter = function () {
      UserService
        .getPage($stateParams.page, $stateParams.size, $scope.queryText, $scope.statusFilters).then(
          response => {
            updatePage(response.data);
        });
    };


    $scope.goToPage = function(page) {
      $state.go("app.admin.users", {
        page: page,
        size: $stateParams.size || 20
      });
    };

    $scope.checkIn = function($event, user, index) {
      $event.stopPropagation();

      if (!user.status.checkedIn) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to check in " + user.profile.name + "!",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, check them in",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }

          UserService.checkIn(user._id).then(response => {
            $scope.users[index] = response.data;
            swal(
              "Checked in",
              response.data.profile.name + " has been checked in.",
              "success"
            );
            $state.reload();
          });
        });
      } else {
        swal(
          "Already checkedIn",
          user.profile.name + " has been checked-in at: "+ formatTime(user.status.checkInTime),
          "warning"
        );
      }
    };

    function formatTime(time) {
      if (time) {
        return moment(time).format("MMMM Do YYYY, h:mm:ss a");
      }
    }

    $scope.rowClass = function(user) {
      if (user.admin) {
        return "admin";
      }
      if (user.status.confirmed) {
        return "positive";
      }
      if (user.status.admitted && !user.status.confirmed) {
        return "warning";
      }
    };

    function selectUser(user) {
      $scope.selectedUser = user;
      $scope.selectedUser.sections = generateSections(user);
      $(".long.user.modal").modal("show");
    }

    function generateSections(user) {
      return [
        {
          name: "Basic Info",
          fields: [
            {
              name: "Created On",
              value: formatTime(user.timestamp)
            },
            {
              name: "Last Updated",
              value: formatTime(user.lastUpdated)
            },
            {
              name: "Confirm By",
              value: formatTime(user.status.confirmBy) || "N/A"
            },
            {
              name: "Checked In",
              value: formatTime(user.status.checkInTime) || "N/A"
            },
            {
              name: "Email",
              value: user.email
            }
          ]
        },
        {
          name: "Profile",
          fields: [
            {
              name: "Name",
              value: user.profile.name
            },
            {
              name: "Gender",
              value: user.profile.gender
            },
            {
              name: "School",
              value: user.profile.school
            },
            {
              name: "Graduation Year",
              value: user.profile.graduationYear
            },
            {
              name: "Hackathons visited",
              value: user.profile.howManyHackathons
            },
            {
              name: "Description",
              value: user.profile.description
            },
            {
              name: "Essay",
              value: user.profile.essay
            },
            {
              name: "Major",
              value: user.profile.major
            },
            {
              name: "Github",
              value: user.profile.github
            },
            {
              name: "Facebook",
              value: user.profile.facebook
            },
            {
              name: "Linkedin",
              value: user.profile.linkedin
            }
          ]
        },
        {
          name: "Confirmation",
          fields: [
            {
              name: "Phone Number",
              value: user.confirmation.phoneNumber
            },
            {
              name: "Needs Hardware",
              value: user.confirmation.wantsHardware,
              type: "boolean"
            },
            {
              name: "Hardware Requested",
              value: user.confirmation.hardware
            }
          ]
        },
        {
          name: "Travel",
          fields: [
            {
              name: "Additional Notes",
              value: user.confirmation.notes
            }
          ]
        }
      ];
    }
    $scope.selectUser = selectUser;
  }]);
angular.module('reg')
  .controller('ConfirmationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'currentUser',
    'Utils',
    'UserService',
    function($scope, $rootScope, $state, currentUser, Utils, UserService){

      // Set up the user
      var user = currentUser.data;
      $scope.user = user;

      $scope.pastConfirmation = Date.now() > user.status.confirmBy;

      $scope.formatTime = Utils.formatTime;

      _setupForm();

      $scope.fileName = user._id + "_" + user.profile.name.split(" ").join("_");

      // -------------------------------
      // All this just for dietary restriction checkboxes fml

      var dietaryRestrictions = {
        'Vegetarian': false,
        'Vegan': false,
        'Halal': false,
        'Kosher': false,
        'Nut Allergy': false
      };

      if (user.confirmation.dietaryRestrictions){
        user.confirmation.dietaryRestrictions.forEach(function(restriction){
          if (restriction in dietaryRestrictions){
            dietaryRestrictions[restriction] = true;
          }
        });
      }

      $scope.dietaryRestrictions = dietaryRestrictions;

      // -------------------------------

      function _updateUser(e){
        var confirmation = $scope.user.confirmation;
        // Get the dietary restrictions as an array
        var drs = [];
        Object.keys($scope.dietaryRestrictions).forEach(function(key){
          if ($scope.dietaryRestrictions[key]){
            drs.push(key);
          }
        });
        confirmation.dietaryRestrictions = drs;

        UserService
          .updateConfirmation(user._id, confirmation)
          .then(response => {
            swal("Woo!", "You're confirmed!", "success").then(value => {
              $state.go("app.dashboard");
            });
          }, response => {
            swal("Uh oh!", "Something went wrong.", "error");
          });
      }

      function _setupForm(){
        // Semantic-UI form validation
        $('.ui.form').form({
          fields: {
            shirt: {
              identifier: 'shirt',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please give us a shirt size!'
                }
              ]
            },
            phone: {
              identifier: 'phone',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter a phone number.'
                }
              ]
            },
            signatureCodeOfConduct: {
              identifier: 'signatureCodeOfConduct',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your digital signature.'
                }
              ]
            },
            nationalCardID: {
              identifier: 'nationalCardID',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your National Card ID.'
                }
              ]
            },
          }
        });
      }

      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        } else {
          swal("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };

    }]);

angular.module('reg')
  .controller('DashboardCtrl', [
    '$rootScope',
    '$scope',
    '$sce',
    'currentUser',
    'settings',
    'Utils',
    'AuthService',
    'UserService',
    'EVENT_INFO',
    'DASHBOARD',
    function($rootScope, $scope, $sce, currentUser, settings, Utils, AuthService, UserService, EVENT_INFO, DASHBOARD){
      var Settings = settings.data;
      var user = currentUser.data;
      $scope.user = user;
      $scope.timeClose = Utils.formatTime(Settings.timeClose);
      $scope.timeConfirm = Utils.formatTime(Settings.timeConfirm);

      $scope.DASHBOARD = DASHBOARD;

      for (var msg in $scope.DASHBOARD) {
        if ($scope.DASHBOARD[msg].includes('[APP_DEADLINE]')) {
          $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[APP_DEADLINE]', Utils.formatTime(Settings.timeClose));
        }
        if ($scope.DASHBOARD[msg].includes('[CONFIRM_DEADLINE]')) {
          $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[CONFIRM_DEADLINE]', Utils.formatTime(user.status.confirmBy));
        }
      }

      // Is registration open?
      var regIsOpen = $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Is it past the user's confirmation time?
      var pastConfirmation = $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);

      $scope.dashState = function(status){
        var user = $scope.user;
        switch (status) {
          case 'unverified':
            return !user.verified;
          case 'openAndIncomplete':
            return regIsOpen && user.verified && !user.status.completedProfile;
          case 'openAndSubmitted':
            return regIsOpen && user.status.completedProfile && !user.status.admitted;
          case 'closedAndIncomplete':
            return !regIsOpen && !user.status.completedProfile && !user.status.admitted;
          case 'closedAndSubmitted': // Waitlisted State
            return !regIsOpen && user.status.completedProfile && !user.status.admitted;
          case 'admittedAndCanConfirm':
            return !pastConfirmation &&
              user.status.admitted &&
              !user.status.confirmed &&
              !user.status.declined;
          case 'admittedAndCannotConfirm':
            return pastConfirmation &&
              user.status.admitted &&
              !user.status.confirmed &&
              !user.status.declined;
          case 'confirmed':
            return user.status.admitted && user.status.confirmed && !user.status.declined;
          case 'declined':
            return user.status.declined;
        }
        return false;
      };

      $scope.showWaitlist = !regIsOpen && user.status.completedProfile && !user.status.admitted;

      $scope.resendEmail = function(){
        AuthService
          .resendVerificationEmail()
          .then(response => {
            swal("Check your Inbox!", "Your email has been sent.", "success"); 
            
          });
      };

      // $scope.printConfirmation =function(ImageURL){

      //   html2canvas($('#qrCode'), {
      //     allowTaint: true,
      //     onrendered: function (canvas) {
      //         var imgData = canvas.toDataURL("image/jpeg", 1.0);
      //         var pdf = new jsPDF('p', 'mm', 'a0');
  
      //         pdf.addImage(imgData, 'JPEG', 0, 0);
      //         pdf.save("Current Data2.pdf")
      //     }
      // });
      
      // }


      // -----------------------------------------------------
      // Text!
      // -----------------------------------------------------
      var converter = new showdown.Converter();
      $scope.acceptanceText = $sce.trustAsHtml(converter.makeHtml(Settings.acceptanceText));
      $scope.confirmationText = $sce.trustAsHtml(converter.makeHtml(Settings.confirmationText));
      $scope.waitlistText = $sce.trustAsHtml(converter.makeHtml(Settings.waitlistText));

      $scope.declineAdmission = function(){

      swal({
        title: "Whoa!",
        text: "Are you sure you would like to decline your admission? \n\n You can't go back!",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          confirm: {
            text: "Yes, I can't make it",
            value: true,
            visible: true,
            className: "danger-button"
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }

        UserService
          .declineAdmission(user._id)
          .then(response => {
            $rootScope.currentUser = response.data;
            $scope.user = response.data;
          });
      });
    };
  }]);

angular.module('reg')
  .controller('HomeCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$state',
    'settings',
    'Utils',
    'AuthService',
    'EVENT_INFO',
    function($rootScope, $scope, $http, $state, settings, Utils, AuthService, EVENT_INFO){
      $scope.loading = true;

      $scope.EVENT_INFO = EVENT_INFO;

      var Settings = settings.data;
      $scope.regIsOpen = Utils.isRegOpen(Settings);


      // Is registration open?
      var Settings = settings.data;
      $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Start state for login
      $scope.loginState = 'login';

      function onSuccess() {
        $state.go('app.dashboard');
      }

      function onError(data){
        $scope.error = data.message;
      }

      function resetError(){
        $scope.error = null;
      }

      $scope.login = function(){
        resetError();
        AuthService.loginWithPassword(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.register = function(){
        resetError();
        AuthService.register(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.setLoginState = function(state) {
        $scope.loginState = state;
      };

      $scope.sendResetEmail = function() {
        var email = $scope.email;
        AuthService.sendResetEmail(email);
        swal("Don't sweat!", "An email should be sent to you shortly.", "success");
      };




      $scope.loading = false;

    }]);

angular.module('reg')
  .controller('LoginCtrl', [
    '$scope',
    '$http',
    '$state',
    'settings',
    'Utils',
    'AuthService',
    'EVENT_INFO',
    function($scope, $http, $state, settings, Utils, AuthService, EVENT_INFO){

      $scope.EVENT_INFO = EVENT_INFO;

      // Is registration open?
      var Settings = settings.data;
      $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Start state for login
      $scope.loginState = 'login';

      function onSuccess() {
        $state.go('app.dashboard');
      }

      function onError(data){
        $scope.error = data.message;
      }

      function resetError(){
        $scope.error = null;
      }

      $scope.login = function(){
        resetError();
        AuthService.loginWithPassword(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.register = function(){
        resetError();
        AuthService.register(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.setLoginState = function(state) {
        $scope.loginState = state;
      };

      $scope.sendResetEmail = function() {
        var email = $scope.email;
        AuthService.sendResetEmail(email);
        swal("Don't sweat!", "An email should be sent to you shortly.", "success");
      };

    }
  ]);

angular.module('reg')
  .controller('ResetCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'AuthService',
    function($scope, $stateParams, $state, AuthService){
      var token = $stateParams.token;

      $scope.loading = true;

      $scope.changePassword = function(){
        var password = $scope.password;
        var confirm = $scope.confirm;

        if (password !== confirm){
          $scope.error = "Passwords don't match!";
          $scope.confirm = "";
          return;
        }

        AuthService.resetPassword(
          token,
          $scope.password,
          message => {
            swal("Neato!", "Your password has been changed!", "success").then(value => {
              $state.go("home");
            });
          },
          data => {
            $scope.error = data.message;
            $scope.loading = false;
        });
      };
    }]);

angular.module('reg')
  .service('settings', function() {})
  .controller('SidebarCtrl', [
    '$rootScope',
    '$scope',
    'SettingsService',
    'Utils',
    'AuthService',
    'Session',
    'EVENT_INFO',
    function($rootScope, $scope, SettingsService, Utils, AuthService, Session, EVENT_INFO){

      var user = $rootScope.currentUser;

      $scope.EVENT_INFO = EVENT_INFO;

      $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);
      //$scope.pastSatart = Utils.isAfter(settings.timeStart);

      SettingsService
      .getPublicSettings()
      .then(response => {
        $scope.pastSatart = Utils.isAfter(response.data.timeStart)
      });

      $scope.logout = function(){
        AuthService.logout();
      };

      $scope.showSidebar = false;
      $scope.toggleSidebar = function(){
        $scope.showSidebar = !$scope.showSidebar;
      };

      // oh god jQuery hack
      $('.item').on('click', function(){
        $scope.showSidebar = false;
      });

    }]);



angular.module('reg')
  .controller('TeamCtrl', [
    '$scope',
    '$state',
    '$timeout',
    'currentUser',
    'settings',
    'Utils',
    'UserService',
    'TeamService',
    'TEAM',
    function($scope, $state, $timeout, currentUser, settings, Utils, UserService, TeamService, TEAM){
      // Get the current user's most recent data.
      var Settings = settings.data;
      
      $scope.regIsOpen = Utils.isRegOpen(Settings);

      $scope.user = currentUser.data;

      function isTeamMember(teams,Userid) {
        var test = false;
        teams.forEach(team => {
          team.members.forEach(member => {            
            if (member.id==Userid) test = true;
          });
        });        
        return test;
      }

      
      $scope.isjoined = function(team){
        var test = false;
        team.joinRequests.forEach(member =>{
          if(member.id==currentUser.data._id)test = true;
        })
        return test;
      }
      
      TeamService.getAll().then(teams => {
        $scope.isTeamAdmin=false;
        $scope.isTeamMember=false;
        teams.data.forEach(team => {
          team.isMaxteam = false;

          if (team.members.length>=Settings.maxTeamSize){
            team.isColosed = true;
            team.isMaxteam = true;
          }

          if(team.members[0].id==currentUser.data._id){
            team.joinRequests.forEach(member => {                            
              if (isTeamMember(teams.data,member.id)){
                member.unavailable=true;
              }else{member.unavailable=false}
            });
            $scope.userAdminTeam = team;
            $scope.isTeamAdmin=true;
          }else{
            team.members.forEach(member =>{
              if(member.id==currentUser.data._id){
                $scope.userMemberTeam = team;
                $scope.isTeamMember=true;
              }
            })
          }
        })
        $scope.teams = teams.data;

      });


      $scope.createTeam = function() {

        teamData = {
          description: $scope.newTeam_description,
          members: [{id:currentUser.data._id, name:currentUser.data.profile.name, skill: $scope.newTeam_Adminskill}],
          skills: {code: $scope.skillcode,design: $scope.skilldesign,hardware: $scope.skillhardware,idea: $scope.skillidea},
          isColosed: false,
        }
        console.log(teamData);
        console.log($scope.newTeam_Adminskill);
        
        TeamService.create(teamData);
        $state.reload();
      };


      $scope.ShowcreateTeam = function(){
        $scope.ShowNewTeamFrom = true;  
        $scope.skillcode =true
        $scope.skilldesign =true
        $scope.skillhardware =true
        $scope.skillidea =true
        $scope.newTeam_Adminskill="code"
      }


      $scope.ShowJoinTeam = function(){
        $scope.ShowJoinTeamFrom = true;  
      }


      $scope.joinTeamCode = function () {

        teamID = $scope.newTeam_Code;
        newTeam_skill= $scope.newTeam_skill;

        newuser= {id:currentUser.data._id, name:currentUser.data.profile.name, skill:newTeam_skill};
        TeamService.join(teamID,newuser); 
        swal(
          "Joined",
          "You have appliced to join this team, wait for the Team-Admin to accept your application.",
          "success"
        );  
        $state.reload();
   
      }
      
      $scope.joinTeam = function (team) {

        var value;
         const select = document.createElement('select');
         select.className = 'select-custom'


         var option = document.createElement('option');
         option.disabled = true;
         option.innerHTML = 'Select a skill';
         option.value = "code"
         select.appendChild(option);


         if(team.skills.code){
           option = document.createElement('option');
           option.innerHTML = 'Code';
           option.value = "code"
           select.appendChild(option);
         }
         if(team.skills.design){
          option = document.createElement('option');
          option.innerHTML = 'Design';
          option.value = "design"
          select.appendChild(option);
         }
         if(team.skills.hardware){
          option = document.createElement('option');
          option.innerHTML = 'Hardware';
          option.value = "hardware"
          select.appendChild(option);
         }
         if(team.skills.idea){
          option = document.createElement('option');
          option.innerHTML = 'Idea';
          option.value = "idea"
          select.appendChild(option);
         }
        
        select.onchange = function selectChanged(e) {
          value = e.target.value
        }
        
        swal({
          title: "Please select your skill to join",

          content: {
            element: select,
          }
        }).then(function() {

          newuser= {id:currentUser.data._id, name:currentUser.data.profile.name, skill:value};
          TeamService.join(team._id,newuser); 
          swal(
            "Joined",
            "You have appliced to join this team, wait for the Team-Admin to accept your application.",
            "success"
          );  
          $state.reload();
        })        
      }


      $scope.acceptMember = function(teamID, member, index) {

        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to accept " + member.name + " to your team! This will send him a notification email and will show in the public teams page.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, let him in",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.acceptMember(teamID,member,Settings.maxTeamSize).then(response => {
            if (response=="maxTeamSize"){
              swal(
                "Error",
                "Maximum number of members ("+Settings.maxTeamSize+") reached",
                "error"
              );
            }else {
              TeamService.removejoin(teamID,index,false).then(response2 => {
                swal(
                  "Accepted",
                  member.name + " has been accepted to your team.",
                  "success"
                );
                $state.reload();
              });    
            }
          });
        });      
      }



      $scope.refuseMember = function(teamID, member, index) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to refuse " + member.name + " from your team! This will send him a notification email.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, refuse him",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.removejoin(teamID,index,member).then(response => {
            swal(
              "Refused",
              member.name + " has been refused from your team.",
              "success"
            );
            $state.reload();
          });
        });      
      }


      $scope.removeMemberfromTeam = function(teamID, member, index) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to remove " + member.name + " from your team! This will send him a notification email.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove him",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.removemember(teamID,index,member.id).then(response => {
            if (response=="removingAdmin"){
              swal(
                "Error",
                "You can't remove the Team Admin, But you can close the team.",
                "error"
              );
            }else {
              TeamService.removejoin(teamID,index,false).then(response2 => {
                swal(
                  "Removed",
                  member.name + " has been removed from your team.",
                  "success"
                );    
                $state.reload();
              });    
            }
          });
        });      
      }



      $scope.removeTeam = function(team) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to remove this team with all it's members! This will send them a notification email. You need to find another team to work with.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove team",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }

          email = { 
            subject:"Your team has been removed", 
            title:"Time for a backup plan",
            body:"The team you have been part (Member/requested to join) of has been removed. Please check your dashboard and try to find another team to work with before the hackathon starts." 
          }

          TeamService.remove(team._id).then(response => {
            team.members.forEach(user => {
              UserService.sendBasicMail(user.id,email);
            });
            team.joinRequests.forEach(user => {
              UserService.sendBasicMail(user.id,email);
            });

            swal(
              "Removed",
              "Team has been removed.",
              "success"
            );
            $state.reload();
          });
        });      
      }


      $scope.leaveTeam = function(team) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to leave your team! This will send the admin a notification email.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove him",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          var index=0;
          team.members.forEach(member => {
            if (member.id==currentUser.data._id) {
              TeamService.removemember(team._id,index).then(response => {
                swal(
                  "Removed",
                  "You have successfully left this team. Please find another team or create your own.",
                  "success"
                );
                $state.reload();
              });
    
            }
            index++;
          })
        });      
      }


      $scope.canceljoinTeam = function(team) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to cancel your request to join this team!",
          icon: "warning",
          buttons: {
            cancel: {
              text: "No",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, Cancel",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          var index=0;
          
          team.joinRequests.forEach(member => {
            if (member.id==currentUser.data._id) {
              TeamService.removejoin(team._id,index,false).then(response => {
                swal(
                  "Removed",
                  "You have successfully canceled you request to join this team. Please find another team or create your own.",
                  "success"
                );
                $state.reload();
              });
    
            }
            index++;
          })
        });      
      }


      $scope.toggleCloseTeam = function(teamID,status) {
        if (status==true){text="You are about to Close this team. This won't allow other members to join your team!"
        }else{text="You are about to reopen this team. This will allow other members to join your team!"}

        swal({
          title: "Whoa, wait a minute!",
          text: text,
          icon: "warning",
          buttons: {
            cancel: {
              text: "No",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.toggleCloseTeam(teamID,status).then(response => {
            swal(
              "Done",
              "Operation successfully Completed.",
              "success"
            );
            $state.reload();
          });
        });      
      }



      $scope.toggleHideTeam = function(teamID,status) {
        if (status==true){text="You are about to Hide this team. This won't allow other members to see your team!"
        }else{text="You are about to Show this team. This will allow other members to see your team!"}

        swal({
          title: "Whoa, wait a minute!",
          text: text,
          icon: "warning",
          buttons: {
            cancel: {
              text: "No",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.toggleHideTeam(teamID,status).then(response => {
            swal(
              "Done",
              "Operation successfully Completed.",
              "success"
            );
            $state.reload();
          });
        });      
      }

      $scope.$watch("queryText", function(queryText) {
        TeamService.getSelectedTeams(queryText, $scope.skillsFilters).then(
          response => {            
            $scope.teams = response.data.teams;
          }
        );
      });
  
      $scope.applyskillsFilter = function () {
        TeamService.getSelectedTeams($scope.queryText, $scope.skillsFilters).then(
          response => {            
            $scope.teams = response.data.teams;
          }
        );
      };
  




    }]);

angular.module('reg')
  .controller('VerifyCtrl', [
    '$scope',
    '$stateParams',
    'AuthService',
    function($scope, $stateParams, AuthService){
      var token = $stateParams.token;

      $scope.loading = true;

      if (token) {
        AuthService.verify(token,
          function(user){
            $scope.success = true;
            $scope.loading = false;
          },
          function(err){
            $scope.loading = false;
          });
      }
    }]);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnN0YW50cy5qcyIsInJvdXRlcy5qcyIsImludGVyY2VwdG9ycy9BdXRoSW50ZXJjZXB0b3IuanMiLCJtb2R1bGVzL1Nlc3Npb24uanMiLCJtb2R1bGVzL1V0aWxzLmpzIiwicXJzY2FubmVyL2h0bWw1LXFyY29kZS5taW4uanMiLCJxcnNjYW5uZXIvanNxcmNvZGUtY29tYmluZWQubWluLmpzIiwic2VydmljZXMvQXV0aFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9DaGFsbGVuZ2VTZXJ2aWNlLmpzIiwic2VydmljZXMvTWFya2V0aW5nU2VydmljZS5qcyIsInNlcnZpY2VzL1NldHRpbmdzU2VydmljZS5qcyIsInNlcnZpY2VzL1NvbHZlZENURlNlcnZpY2UuanMiLCJzZXJ2aWNlcy9UZWFtU2VydmljZS5qcyIsInNlcnZpY2VzL1VzZXJTZXJ2aWNlLmpzIiwiYWRtaW4vY2hhbGxlbmdlL2FkbWluQ2hhbGxlbmdlQ3RybC5qcyIsImFkbWluL2NoYWxsZW5nZXMvYWRtaW5DaGFsbGVuZ2VzQ3RybC5qcyIsImFkbWluL21haWwvYWRtaW5NYWlsQ3RybC5qcyIsImFkbWluL21hcmtldGluZy9hZG1pbk1hcmtldGluZ0N0cmwuanMiLCJhZG1pbi9zZXR0aW5ncy9hZG1pblNldHRpbmdzQ3RybC5qcyIsImFkbWluL3VzZXIvYWRtaW5Vc2VyQ3RybC5qcyIsImFkbWluL3VzZXJzL2FkbWluVXNlcnNDdHJsLmpzIiwiYWRtaW4vc3RhdHMvYWRtaW5TdGF0c0N0cmwuanMiLCJCYXNlQ3RybC5qcyIsImFwcGxpY2F0aW9uL2FwcGxpY2F0aW9uQ3RybC5qcyIsImFkbWluL2FkbWluQ3RybC5qcyIsImNoYWxsZW5nZXMvY2hhbGxlbmdlc0N0cmwuanMiLCJjaGVja2luL2NoZWNraW5DdHJsLmpzIiwiY29uZmlybWF0aW9uL2NvbmZpcm1hdGlvbkN0cmwuanMiLCJkYXNoYm9hcmQvZGFzaGJvYXJkQ3RybC5qcyIsImhvbWUvSG9tZUN0cmwuanMiLCJsb2dpbi9sb2dpbkN0cmwuanMiLCJyZXNldC9yZXNldEN0cmwuanMiLCJzaWRlYmFyL3NpZGViYXJDdHJsLmpzIiwidGVhbS90ZWFtQ3RybC5qcyIsInZlcmlmeS92ZXJpZnlDdHJsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsTUFBQSxRQUFBLE9BQUEsT0FBQTtFQUNBO0VBQ0E7OztBQUdBO0dBQ0EsT0FBQTtJQUNBO0lBQ0EsU0FBQSxjQUFBOzs7TUFHQSxjQUFBLGFBQUEsS0FBQTs7O0dBR0EsSUFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLGFBQUEsUUFBQTs7O01BR0EsSUFBQSxRQUFBLFFBQUE7TUFDQSxJQUFBLE1BQUE7UUFDQSxZQUFBLGVBQUE7Ozs7O0FDdEJBLFFBQUEsT0FBQTtLQUNBLFNBQUEsY0FBQTtRQUNBLE1BQUE7O0tBRUEsU0FBQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLGtCQUFBO1FBQ0EsWUFBQTtRQUNBLGlCQUFBO1FBQ0EsV0FBQTtRQUNBLDZCQUFBO1FBQ0EsdUJBQUE7UUFDQSxnQ0FBQTtRQUNBLG1DQUFBO1FBQ0EsNkJBQUE7UUFDQSwwQkFBQTtRQUNBLFVBQUE7O0tBRUEsU0FBQSxPQUFBO1FBQ0Esb0JBQUE7Ozs7QUNsQkEsUUFBQSxPQUFBO0dBQ0EsT0FBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO01BQ0E7TUFDQTtNQUNBLG1CQUFBOzs7SUFHQSxtQkFBQSxVQUFBOzs7SUFHQTtPQUNBLE1BQUEsU0FBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxjQUFBO1VBQ0EsZUFBQTs7UUFFQSxTQUFBO1VBQ0EsZ0NBQUEsU0FBQSxnQkFBQTtZQUNBLE9BQUEsZ0JBQUE7Ozs7T0FJQSxNQUFBLFFBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsY0FBQTtVQUNBLGVBQUE7O1FBRUEsU0FBQTtVQUNBLGdDQUFBLFNBQUEsZ0JBQUE7WUFDQSxPQUFBLGdCQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BbUJBLE1BQUEsT0FBQTtRQUNBLE9BQUE7VUFDQSxJQUFBO1lBQ0EsYUFBQTtZQUNBLFlBQUE7O1VBRUEsZUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBO1lBQ0EsU0FBQTtjQUNBLDhCQUFBLFNBQUEsaUJBQUE7Z0JBQ0EsT0FBQSxnQkFBQTs7Ozs7UUFLQSxNQUFBO1VBQ0EsY0FBQTs7O09BR0EsTUFBQSxpQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLFNBQUE7VUFDQSw2QkFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsOEJBQUEsU0FBQSxnQkFBQTtZQUNBLE9BQUEsZ0JBQUE7Ozs7T0FJQSxNQUFBLG1CQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGlCQUFBOztRQUVBLFNBQUE7VUFDQSw2QkFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsOEJBQUEsU0FBQSxnQkFBQTtZQUNBLE9BQUEsZ0JBQUE7Ozs7T0FJQSxNQUFBLG9CQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGlCQUFBOztRQUVBLFNBQUE7VUFDQSw2QkFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUE7Ozs7T0FJQSxNQUFBLGtCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGlCQUFBOztRQUVBLFNBQUE7VUFDQSw2QkFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsOEJBQUEsU0FBQSxnQkFBQTtZQUNBLE9BQUEsZ0JBQUE7Ozs7T0FJQSxNQUFBLFlBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsaUJBQUE7O1FBRUEsU0FBQTtVQUNBLDZCQUFBLFNBQUEsWUFBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSw4QkFBQSxTQUFBLGdCQUFBO1lBQ0EsT0FBQSxnQkFBQTs7OztPQUlBLE1BQUEsYUFBQTtRQUNBLE9BQUE7VUFDQSxJQUFBO1lBQ0EsYUFBQTtZQUNBLFlBQUE7OztRQUdBLE1BQUE7VUFDQSxjQUFBOzs7T0FHQSxNQUFBLGVBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0Esa0JBQUE7OztPQUdBLE1BQUEsbUJBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7O09BRUEsTUFBQSxrQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTs7T0FFQSxNQUFBLHdCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBOztPQUVBLE1BQUEsdUJBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxTQUFBO1VBQ0Esa0RBQUEsU0FBQSxjQUFBLGlCQUFBO1lBQ0EsT0FBQSxpQkFBQSxJQUFBLGFBQUE7Ozs7T0FJQSxNQUFBLHVCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBOztPQUVBLE1BQUEsbUJBQUE7UUFDQSxLQUFBO1VBQ0E7VUFDQTtVQUNBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7O09BRUEsTUFBQSxrQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLFNBQUE7VUFDQSx3Q0FBQSxTQUFBLGNBQUEsWUFBQTtZQUNBLE9BQUEsWUFBQSxJQUFBLGFBQUE7Ozs7T0FJQSxNQUFBLHNCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBOztPQUVBLE1BQUEsU0FBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxjQUFBOzs7T0FHQSxNQUFBLFVBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsY0FBQTs7O09BR0EsTUFBQSxPQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxNQUFBO1VBQ0EsY0FBQTs7OztJQUlBLGtCQUFBLFVBQUE7TUFDQSxTQUFBOzs7O0dBSUEsSUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO01BQ0E7TUFDQTtNQUNBLFNBQUE7O01BRUEsV0FBQSxJQUFBLHVCQUFBLFdBQUE7U0FDQSxTQUFBLEtBQUEsWUFBQSxTQUFBLGdCQUFBLFlBQUE7OztNQUdBLFdBQUEsSUFBQSxxQkFBQSxVQUFBLE9BQUEsU0FBQSxVQUFBOztRQUVBLElBQUEsZUFBQSxRQUFBLEtBQUE7UUFDQSxJQUFBLGdCQUFBLFFBQUEsS0FBQTtRQUNBLElBQUEsZUFBQSxRQUFBLEtBQUE7UUFDQSxJQUFBLG1CQUFBLFFBQUEsS0FBQTtRQUNBLElBQUEsa0JBQUEsUUFBQSxLQUFBO1FBQ0EsSUFBQSxrQkFBQSxRQUFBLEtBQUE7O1FBRUEsSUFBQSxnQkFBQSxDQUFBLFFBQUEsWUFBQTtVQUNBLE1BQUE7VUFDQSxPQUFBLEdBQUE7OztRQUdBLElBQUEsaUJBQUEsUUFBQSxZQUFBO1VBQ0EsTUFBQTtVQUNBLE9BQUEsR0FBQTs7O1FBR0EsSUFBQSxnQkFBQSxDQUFBLFFBQUEsVUFBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE9BQUEsR0FBQTs7O1FBR0EsSUFBQSxvQkFBQSxDQUFBLFFBQUEsVUFBQSxhQUFBLGdCQUFBLENBQUEsUUFBQSxVQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsT0FBQSxHQUFBOzs7UUFHQSxJQUFBLG1CQUFBLENBQUEsUUFBQSxVQUFBLFVBQUE7VUFDQSxNQUFBO1VBQ0EsT0FBQSxHQUFBOzs7UUFHQSxJQUFBLG1CQUFBLENBQUEsUUFBQSxVQUFBLE9BQUEsVUFBQTtVQUNBLE1BQUE7VUFDQSxPQUFBLEdBQUE7Ozs7Ozs7O0FDL1NBLFFBQUEsT0FBQTtHQUNBLFFBQUEsbUJBQUE7SUFDQTtJQUNBLFNBQUEsUUFBQTtNQUNBLE9BQUE7VUFDQSxTQUFBLFNBQUEsT0FBQTtZQUNBLElBQUEsUUFBQSxRQUFBO1lBQ0EsSUFBQSxNQUFBO2NBQ0EsT0FBQSxRQUFBLG9CQUFBOztZQUVBLE9BQUE7Ozs7O0FDVkEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxXQUFBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsWUFBQSxRQUFBOztJQUVBLEtBQUEsU0FBQSxTQUFBLE9BQUEsS0FBQTtNQUNBLFFBQUEsYUFBQSxNQUFBO01BQ0EsUUFBQSxhQUFBLFNBQUEsS0FBQTtNQUNBLFFBQUEsYUFBQSxjQUFBLEtBQUEsVUFBQTtNQUNBLFdBQUEsY0FBQTs7O0lBR0EsS0FBQSxVQUFBLFNBQUEsV0FBQTtNQUNBLE9BQUEsUUFBQSxhQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTtNQUNBLFdBQUEsY0FBQTtNQUNBLElBQUEsV0FBQTtRQUNBOzs7O0lBSUEsS0FBQSxXQUFBLFVBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTs7O0lBR0EsS0FBQSxZQUFBLFVBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTs7O0lBR0EsS0FBQSxVQUFBLFVBQUE7TUFDQSxPQUFBLEtBQUEsTUFBQSxRQUFBLGFBQUE7OztJQUdBLEtBQUEsVUFBQSxTQUFBLEtBQUE7TUFDQSxRQUFBLGFBQUEsY0FBQSxLQUFBLFVBQUE7TUFDQSxXQUFBLGNBQUE7Ozs7QUNyQ0EsUUFBQSxPQUFBO0dBQ0EsUUFBQSxTQUFBO0lBQ0EsVUFBQTtNQUNBLE9BQUE7UUFDQSxXQUFBLFNBQUEsU0FBQTtVQUNBLE9BQUEsS0FBQSxRQUFBLFNBQUEsWUFBQSxLQUFBLFFBQUEsU0FBQTs7UUFFQSxTQUFBLFNBQUEsS0FBQTtVQUNBLE9BQUEsS0FBQSxRQUFBOztRQUVBLFlBQUEsU0FBQSxLQUFBOztVQUVBLElBQUEsQ0FBQSxLQUFBO1lBQ0EsT0FBQTs7O1VBR0EsT0FBQSxJQUFBLEtBQUE7O1VBRUEsT0FBQSxPQUFBLE1BQUEsT0FBQTtZQUNBLE1BQUEsS0FBQSxlQUFBLE1BQUEsS0FBQTs7Ozs7O0FDbkJBLENBQUEsU0FBQSxHQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7UUFDQSxjQUFBLFNBQUEsZUFBQSxhQUFBLFlBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQSxXQUFBO2dCQUNBLElBQUEsY0FBQSxFQUFBOztnQkFFQSxJQUFBLFNBQUEsWUFBQTtnQkFDQSxJQUFBLFFBQUEsWUFBQTs7Z0JBRUEsSUFBQSxVQUFBLE1BQUE7b0JBQ0EsU0FBQTs7O2dCQUdBLElBQUEsU0FBQSxNQUFBO29CQUNBLFFBQUE7Ozs7Z0JBSUEsSUFBQSxVQUFBLEVBQUEsbUJBQUEsUUFBQSxpQkFBQSxTQUFBLHFDQUFBLFNBQUE7Z0JBQ0EsSUFBQSxhQUFBLEVBQUEsb0NBQUEsUUFBQSxLQUFBLGtCQUFBLFNBQUEsS0FBQSx1Q0FBQSxTQUFBOztnQkFFQSxJQUFBLFFBQUEsUUFBQTtnQkFDQSxJQUFBLFNBQUEsV0FBQTtnQkFDQSxJQUFBLFVBQUEsT0FBQSxXQUFBO2dCQUNBLElBQUE7O2dCQUVBLElBQUEsT0FBQSxXQUFBO29CQUNBLElBQUEsa0JBQUE7d0JBQ0EsUUFBQSxVQUFBLE9BQUEsR0FBQSxHQUFBLEtBQUE7O3dCQUVBLElBQUE7NEJBQ0EsT0FBQTswQkFDQSxPQUFBLEdBQUE7NEJBQ0EsWUFBQSxHQUFBOzs7d0JBR0EsRUFBQSxLQUFBLFlBQUEsSUFBQSxXQUFBLFdBQUEsTUFBQTs7MkJBRUE7d0JBQ0EsRUFBQSxLQUFBLFlBQUEsSUFBQSxXQUFBLFdBQUEsTUFBQTs7OztnQkFJQSxPQUFBLE1BQUEsT0FBQSxPQUFBLE9BQUEsYUFBQSxPQUFBLFVBQUEsT0FBQTtnQkFDQSxVQUFBLGVBQUEsVUFBQSxnQkFBQSxVQUFBLHNCQUFBLFVBQUEsbUJBQUEsVUFBQTs7Z0JBRUEsSUFBQSxrQkFBQSxTQUFBLFFBQUE7O29CQUVBLE1BQUEsWUFBQTtvQkFDQSxtQkFBQTtvQkFDQSxFQUFBLEtBQUEsWUFBQSxJQUFBLFVBQUE7O29CQUVBLE1BQUE7b0JBQ0EsRUFBQSxLQUFBLFlBQUEsSUFBQSxXQUFBLFdBQUEsTUFBQTs7OztnQkFJQSxJQUFBLFVBQUEsY0FBQTtvQkFDQSxVQUFBLGFBQUEsQ0FBQSxPQUFBLEVBQUEsWUFBQSxtQkFBQSxpQkFBQSxTQUFBLE9BQUE7d0JBQ0EsV0FBQSxPQUFBOzt1QkFFQTtvQkFDQSxRQUFBLElBQUE7Ozs7Z0JBSUEsT0FBQSxXQUFBLFVBQUEsUUFBQTtvQkFDQSxjQUFBLFFBQUE7Ozs7UUFJQSxtQkFBQSxXQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUEsV0FBQTs7Z0JBRUEsRUFBQSxNQUFBLEtBQUEsVUFBQSxpQkFBQSxRQUFBLFNBQUEsWUFBQTtvQkFDQSxXQUFBOzs7Z0JBR0EsYUFBQSxFQUFBLE1BQUEsS0FBQTs7OztHQUlBOzs7QUNsRkEsU0FBQSxJQUFBLE1BQUEsY0FBQSxDQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUEsY0FBQSxjQUFBLEtBQUEsaUJBQUEsUUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFFBQUEsS0FBQSxpQkFBQSxnQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGdCQUFBLFNBQUEsU0FBQSxvQkFBQSxVQUFBLFVBQUEsQ0FBQSxLQUFBLG9CQUFBLG9CQUFBLFVBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxVQUFBLFdBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxXQUFBLEtBQUEsaUJBQUEsc0JBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxzQkFBQSxLQUFBLGlCQUFBLG1CQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsb0JBQUEsS0FBQSxZQUFBLEtBQUEsaUJBQUEsWUFBQSxVQUFBLENBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLFNBQUEsT0FBQSxJQUFBLE9BQUEsS0FBQSxTQUFBLEdBQUEsT0FBQSxPQUFBLFFBQUEsS0FBQSxZQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsVUFBQSxTQUFBLFFBQUEsY0FBQSx3QkFBQSxVQUFBLFVBQUEsVUFBQSxVQUFBLENBQUEsS0FBQSxjQUFBLGNBQUEsS0FBQSx3QkFBQSx3QkFBQSxLQUFBLFNBQUEsSUFBQSxNQUFBLFVBQUEsVUFBQSxVQUFBLFdBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxZQUFBLFVBQUEsb0JBQUEsU0FBQSxVQUFBLGNBQUEsRUFBQSxFQUFBLEVBQUEsU0FBQSxPQUFBLElBQUEsQ0FBQSxJQUFBLFFBQUEsU0FBQSxHQUFBLE9BQUEsUUFBQSxPQUFBLFFBQUEsY0FBQSxhQUFBLEtBQUEsZUFBQSxNQUFBLEtBQUEsaUJBQUEsZ0JBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxnQkFBQSxLQUFBLGlCQUFBLDBCQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsMEJBQUEsS0FBQSxpQkFBQSxpQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGlCQUFBLEtBQUEsaUJBQUEsc0JBQUEsVUFBQSxDQUFBLE9BQUEsR0FBQSxFQUFBLEtBQUEsZ0JBQUEsS0FBQSxxQkFBQSxVQUFBLENBQUEsSUFBQSxVQUFBLEtBQUEsb0JBQUEsVUFBQSxJQUFBLFVBQUEsV0FBQSxVQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxVQUFBLFVBQUEsVUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLFVBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSx3QkFBQSxPQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLHdCQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsR0FBQSxHQUFBLEdBQUEsVUFBQSxVQUFBLEtBQUEsd0JBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLE9BQUEsVUFBQSxVQUFBLEVBQUEsRUFBQSxFQUFBLFVBQUEsSUFBQSxVQUFBLFVBQUEsRUFBQSxFQUFBLFVBQUEsR0FBQSxHQUFBLEtBQUEsY0FBQSxJQUFBLFVBQUEsVUFBQSxVQUFBLEdBQUEsRUFBQSxFQUFBLEdBQUEsVUFBQSxVQUFBLEVBQUEsVUFBQSxHQUFBLEVBQUEsSUFBQSxXQUFBLEtBQUEsb0JBQUEsU0FBQSxRQUFBLENBQUEsT0FBQSxLQUFBLFNBQUEsUUFBQSxZQUFBLFNBQUEsZUFBQSxDQUFBLE9BQUEsSUFBQSxNQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxJQUFBLFNBQUEsRUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxPQUFBLFNBQUEscUJBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLGlCQUFBLFNBQUEsT0FBQSxDQUFBLElBQUEsSUFBQSxJQUFBLE9BQUEsT0FBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsRUFBQSxPQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsR0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxPQUFBLEdBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsWUFBQSxPQUFBLEVBQUEsR0FBQSxDQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxjQUFBLEtBQUEsaUJBQUEsU0FBQSxRQUFBLFFBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxRQUFBLE9BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxFQUFBLFFBQUEsR0FBQSxFQUFBLFFBQUEsR0FBQSxZQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxRQUFBLEdBQUEsQ0FBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsWUFBQSxRQUFBLEdBQUEsQ0FBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsY0FBQSxLQUFBLGFBQUEsVUFBQSxDQUFBLE9BQUEsSUFBQSxxQkFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsU0FBQSxNQUFBLENBQUEsT0FBQSxJQUFBLHFCQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxNQUFBLFNBQUEsZUFBQSxLQUFBLE9BQUEsQ0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLFNBQUEsTUFBQSxDQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUEsb0JBQUEsS0FBQSxLQUFBLHlCQUFBLFNBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxDQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxPQUFBLEtBQUEsSUFBQSxJQUFBLE9BQUEsR0FBQSxNQUFBLENBQUEsSUFBQSxLQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsS0FBQSxLQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxPQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsT0FBQSxNQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxNQUFBLEVBQUEsQ0FBQSxFQUFBLE1BQUEsSUFBQSxNQUFBLEVBQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEdBQUEsSUFBQSxHQUFBLE1BQUEsQ0FBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLEVBQUEsTUFBQSxNQUFBLEVBQUEsRUFBQSxHQUFBLEdBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxNQUFBLE9BQUEsUUFBQSxRQUFBLEtBQUEsTUFBQSxNQUFBLE1BQUEsT0FBQSxRQUFBLFFBQUEsR0FBQSxNQUFBLENBQUEsSUFBQSxNQUFBLEVBQUEsTUFBQSxNQUFBLEVBQUEsTUFBQSxPQUFBLEtBQUEsS0FBQSxNQUFBLE1BQUEsTUFBQSxPQUFBLEdBQUEsT0FBQSxHQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxJQUFBLE1BQUEsR0FBQSxNQUFBLE9BQUEsSUFBQSxJQUFBLE9BQUEsSUFBQSxNQUFBLE9BQUEsSUFBQSxNQUFBLE9BQUEsS0FBQSxLQUFBLE9BQUEsT0FBQSxPQUFBLFNBQUEsS0FBQSxpQ0FBQSxTQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLE9BQUEsS0FBQSx5QkFBQSxNQUFBLE1BQUEsSUFBQSxLQUFBLE1BQUEsRUFBQSxTQUFBLE9BQUEsSUFBQSxPQUFBLEVBQUEsVUFBQSxNQUFBLE9BQUEsTUFBQSxVQUFBLFNBQUEsR0FBQSxVQUFBLE9BQUEsUUFBQSxNQUFBLENBQUEsT0FBQSxNQUFBLEVBQUEsUUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBLE1BQUEsR0FBQSxJQUFBLFNBQUEsS0FBQSxNQUFBLE1BQUEsQ0FBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLE1BQUEsRUFBQSxFQUFBLFVBQUEsTUFBQSxPQUFBLE1BQUEsVUFBQSxTQUFBLEdBQUEsVUFBQSxPQUFBLFNBQUEsTUFBQSxDQUFBLE9BQUEsT0FBQSxFQUFBLFFBQUEsU0FBQSxPQUFBLFNBQUEsT0FBQSxPQUFBLEdBQUEsU0FBQSxLQUFBLE1BQUEsTUFBQSxDQUFBLFNBQUEsT0FBQSxPQUFBLFFBQUEsS0FBQSx5QkFBQSxNQUFBLE1BQUEsU0FBQSxVQUFBLE9BQUEsR0FBQSxLQUFBLDBCQUFBLFNBQUEsUUFBQSxhQUFBLENBQUEsSUFBQSxlQUFBLEtBQUEsaUNBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxhQUFBLEdBQUEsS0FBQSxNQUFBLGFBQUEsSUFBQSxlQUFBLEtBQUEsaUNBQUEsS0FBQSxNQUFBLGFBQUEsR0FBQSxLQUFBLE1BQUEsYUFBQSxHQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLFFBQUEsSUFBQSxPQUFBLE1BQUEsZ0JBQUEsZUFBQSxFQUFBLE1BQUEsZ0JBQUEsZUFBQSxFQUFBLENBQUEsZUFBQSxnQkFBQSxJQUFBLEtBQUEsb0JBQUEsU0FBQSxRQUFBLFNBQUEsV0FBQSxDQUFBLE1BQUEsQ0FBQSxLQUFBLDBCQUFBLFFBQUEsVUFBQSxLQUFBLDBCQUFBLFFBQUEsYUFBQSxHQUFBLEtBQUEsU0FBQSxTQUFBLFNBQUEsU0FBQSxDQUFBLE9BQUEsTUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLE1BQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxNQUFBLE1BQUEsUUFBQSxLQUFBLGlCQUFBLFNBQUEsUUFBQSxTQUFBLFdBQUEsV0FBQSxDQUFBLElBQUEscUJBQUEsS0FBQSxNQUFBLEtBQUEsU0FBQSxRQUFBLFVBQUEsWUFBQSxxQkFBQSxLQUFBLE1BQUEsS0FBQSxTQUFBLFFBQUEsWUFBQSxZQUFBLFVBQUEsQ0FBQSxxQkFBQSxzQkFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLFdBQUEsS0FBQSxFQUFBLFlBQUEsTUFBQSxLQUFBLEVBQUEsWUFBQSxNQUFBLEtBQUEsRUFBQSxLQUFBLFFBQUEsT0FBQSxXQUFBLEtBQUEsc0JBQUEsU0FBQSxxQkFBQSxjQUFBLGNBQUEsZ0JBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLGdCQUFBLHNCQUFBLG1CQUFBLEtBQUEsSUFBQSxFQUFBLGNBQUEsV0FBQSxvQkFBQSxLQUFBLElBQUEsT0FBQSxNQUFBLEVBQUEsY0FBQSxXQUFBLEdBQUEsRUFBQSxxQkFBQSxvQkFBQSxtQkFBQSxLQUFBLFFBQUEsSUFBQSxrQkFBQSxLQUFBLElBQUEsRUFBQSxjQUFBLFdBQUEscUJBQUEsS0FBQSxJQUFBLE9BQUEsT0FBQSxFQUFBLGNBQUEsV0FBQSxnQkFBQSxJQUFBLHVCQUFBLEtBQUEsTUFBQSxtQkFBQSxrQkFBQSxvQkFBQSxtQkFBQSxxQkFBQSxrQkFBQSxxQkFBQSxLQUFBLHFCQUFBLE9BQUEsZ0JBQUEsUUFBQSxLQUFBLGdCQUFBLFNBQUEsUUFBQSxTQUFBLFdBQUEsaUJBQUEsVUFBQSxDQUFBLElBQUEsYUFBQSxhQUFBLG1CQUFBLG1CQUFBLGNBQUEsVUFBQSxJQUFBLE1BQUEsa0JBQUEsYUFBQSxpQkFBQSxFQUFBLGFBQUEsaUJBQUEsRUFBQSxtQkFBQSxtQkFBQSxjQUFBLElBQUEsYUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLFdBQUEsRUFBQSxhQUFBLFNBQUEsRUFBQSxRQUFBLEVBQUEsV0FBQSxFQUFBLG1CQUFBLG1CQUFBLGVBQUEsSUFBQSxVQUFBLHFCQUFBLDZCQUFBLElBQUEsSUFBQSxjQUFBLElBQUEsbUJBQUEsbUJBQUEsSUFBQSxjQUFBLFFBQUEsRUFBQSxRQUFBLEVBQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxhQUFBLGFBQUEsV0FBQSxFQUFBLFdBQUEsR0FBQSxPQUFBLFdBQUEsS0FBQSxXQUFBLFNBQUEsTUFBQSxVQUFBLFVBQUEsQ0FBQSxJQUFBLFFBQUEsWUFBQSxPQUFBLFFBQUEsWUFBQSxNQUFBLFVBQUEsWUFBQSxLQUFBLHlCQUFBLFNBQUEsS0FBQSxDQUFBLElBQUEsUUFBQSxLQUFBLFFBQUEsU0FBQSxLQUFBLFNBQUEsV0FBQSxLQUFBLFdBQUEsV0FBQSxLQUFBLG9CQUFBLFFBQUEsU0FBQSxZQUFBLEdBQUEsRUFBQSxXQUFBLEtBQUEsUUFBQSxJQUFBLFVBQUEsS0FBQSxpQkFBQSxRQUFBLFNBQUEsV0FBQSxZQUFBLG1CQUFBLFFBQUEsa0NBQUEsV0FBQSx3QkFBQSxtQkFBQSxvQkFBQSxFQUFBLGlCQUFBLEtBQUEsR0FBQSxtQkFBQSx3QkFBQSxPQUFBLEVBQUEsSUFBQSxJQUFBLGFBQUEsU0FBQSxFQUFBLFFBQUEsRUFBQSxXQUFBLEVBQUEsYUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLFdBQUEsRUFBQSxvQkFBQSxFQUFBLEVBQUEsd0JBQUEsY0FBQSxLQUFBLE1BQUEsUUFBQSxFQUFBLHFCQUFBLGFBQUEsUUFBQSxJQUFBLGNBQUEsS0FBQSxNQUFBLFFBQUEsRUFBQSxxQkFBQSxhQUFBLFFBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxDQUFBLGlCQUFBLEtBQUEsc0JBQUEsV0FBQSxjQUFBLGNBQUEsR0FBQSxNQUFBLElBQUEsT0FBQSxVQUFBLEtBQUEsZ0JBQUEsUUFBQSxTQUFBLFdBQUEsaUJBQUEsV0FBQSxLQUFBLEtBQUEsV0FBQSxLQUFBLE1BQUEsVUFBQSxXQUFBLE9BQUEsT0FBQSxNQUFBLGlCQUFBLElBQUEsTUFBQSxXQUFBLFFBQUEsVUFBQSxJQUFBLE1BQUEsV0FBQSxRQUFBLFNBQUEsa0JBQUEsSUFBQSxlQUFBLEtBQUEsU0FBQSxLQUFBLE9BQUEsVUFBQSxDQUFBLElBQUEsS0FBQSxDQUFBLElBQUEscUJBQUEsa0JBQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSx5QkFBQSxPQUFBLFNBQUEsa0JBQUEsV0FBQSxDQUFBLEtBQUEscUJBQUEscUJBQUEsUUFBQSxZQUFBLEVBQUEsR0FBQSxLQUFBLFNBQUEsRUFBQSxXQUFBLEtBQUEsaUJBQUEsdUJBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSx1QkFBQSxLQUFBLGlCQUFBLFdBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxXQUFBLEtBQUEsWUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHFCQUFBLFdBQUEsRUFBQSxVQUFBLEtBQUEsT0FBQSxTQUFBLEVBQUEsQ0FBQSxJQUFBLE1BQUEsRUFBQSxPQUFBLEtBQUEsc0JBQUEsTUFBQSxzQkFBQSxLQUFBLFVBQUEsTUFBQSxVQUFBLFNBQUEscUJBQUEsUUFBQSxLQUFBLEtBQUEsQ0FBQSxLQUFBLHNCQUFBLFFBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQSxpQkFBQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsT0FBQSxLQUFBLGlCQUFBLE9BQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxPQUFBLEtBQUEsUUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHVCQUFBLFNBQUEsVUFBQSxNQUFBLE9BQUEsQ0FBQSxHQUFBLFNBQUEsT0FBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsS0FBQSx5Q0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLE9BQUEsT0FBQSxJQUFBLFFBQUEsT0FBQSxFQUFBLElBQUEsR0FBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLFFBQUEsS0FBQSxLQUFBLElBQUEsTUFBQSxRQUFBLFFBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsS0FBQSxPQUFBLElBQUEsS0FBQSxLQUFBLEdBQUEsRUFBQSxLQUFBLGlCQUFBLFFBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxRQUFBLEtBQUEsaUJBQUEsU0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFNBQUEsS0FBQSxpQkFBQSxZQUFBLFVBQUEsQ0FBQSxHQUFBLEtBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxtREFBQSxPQUFBLEtBQUEsUUFBQSxLQUFBLFlBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLE9BQUEsRUFBQSxLQUFBLFNBQUEsR0FBQSxHQUFBLE9BQUEsSUFBQSxFQUFBLFFBQUEsS0FBQSxLQUFBLFFBQUEsR0FBQSxLQUFBLEtBQUEsWUFBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsT0FBQSxFQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQSxLQUFBLFNBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxLQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxPQUFBLEVBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQSxLQUFBLEtBQUEsU0FBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLE1BQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxJQUFBLEtBQUEsS0FBQSxPQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsVUFBQSxTQUFBLEtBQUEsSUFBQSxNQUFBLE9BQUEsQ0FBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsS0FBQSxtQ0FBQSxHQUFBLEVBQUEsUUFBQSxFQUFBLE1BQUEsS0FBQSxzQ0FBQSxJQUFBLE1BQUEsS0FBQSxNQUFBLE9BQUEsSUFBQSxPQUFBLEdBQUEsT0FBQSxLQUFBLFFBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSx3Q0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLE9BQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxPQUFBLEVBQUEsS0FBQSxRQUFBLEVBQUEsS0FBQSxNQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsUUFBQSxHQUFBLEtBQUEsSUFBQSxHQUFBLElBQUEsU0FBQSxVQUFBLGlCQUFBLFVBQUEsQ0FBQSxLQUFBLGlCQUFBLGlCQUFBLEtBQUEsVUFBQSxVQUFBLEtBQUEsaUJBQUEsbUJBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxtQkFBQSxLQUFBLGlCQUFBLFlBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxZQUFBLFNBQUEsZ0JBQUEsVUFBQSxDQUFBLElBQUEsVUFBQSxVQUFBLFVBQUEsR0FBQSxHQUFBLFdBQUEsSUFBQSxFQUFBLFdBQUEsS0FBQSx3QkFBQSxLQUFBLFVBQUEsVUFBQSxLQUFBLGNBQUEsS0FBQSxLQUFBLGlCQUFBLEtBQUEsS0FBQSxRQUFBLFNBQUEsRUFBQSxFQUFBLFlBQUEsQ0FBQSxPQUFBLEtBQUEsVUFBQSxZQUFBLEVBQUEsR0FBQSxhQUFBLEVBQUEsRUFBQSxhQUFBLEdBQUEsS0FBQSxzQkFBQSxVQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsaUJBQUEsT0FBQSxLQUFBLGlCQUFBLElBQUEsSUFBQSxlQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxlQUFBLEtBQUEsUUFBQSxFQUFBLEVBQUEsZ0JBQUEsZUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGdCQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxHQUFBLEtBQUEsaUJBQUEsa0JBQUEsd0JBQUEsZ0JBQUEsTUFBQSxLQUFBLGlCQUFBLE9BQUEsS0FBQSxpQkFBQSxJQUFBLFVBQUEsS0FBQSxVQUFBLFVBQUEsZUFBQSxFQUFBLElBQUEsSUFBQSxLQUFBLFVBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxHQUFBLEtBQUEsSUFBQSxlQUFBLEtBQUEsUUFBQSxFQUFBLEVBQUEsZ0JBQUEsSUFBQSxJQUFBLEVBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxHQUFBLEtBQUEsaUJBQUEsa0JBQUEsd0JBQUEsZ0JBQUEsTUFBQSxLQUFBLGlCQUFBLE9BQUEsS0FBQSxpQkFBQSxLQUFBLCtCQUFBLEtBQUEsWUFBQSxVQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsY0FBQSxPQUFBLEtBQUEsY0FBQSxJQUFBLFVBQUEsS0FBQSxVQUFBLFVBQUEsbUJBQUEsVUFBQSxJQUFBLEVBQUEsR0FBQSxHQUFBLG1CQUFBLE9BQUEsUUFBQSxvQkFBQSxvQkFBQSxJQUFBLElBQUEsWUFBQSxFQUFBLE1BQUEsVUFBQSxHQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxVQUFBLEVBQUEsR0FBQSxNQUFBLElBQUEsWUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGFBQUEsR0FBQSxLQUFBLGNBQUEsUUFBQSx5QkFBQSxhQUFBLE1BQUEsS0FBQSxlQUFBLEtBQUEsY0FBQSxxQkFBQSxVQUFBLE9BQUEsS0FBQSxjQUFBLFlBQUEsRUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLFVBQUEsRUFBQSxHQUFBLE1BQUEsSUFBQSxZQUFBLEtBQUEsUUFBQSxFQUFBLEVBQUEsYUFBQSxHQUFBLEtBQUEsY0FBQSxRQUFBLHlCQUFBLGFBQUEsTUFBQSxLQUFBLGVBQUEsS0FBQSxjQUFBLHFCQUFBLFVBQUEsT0FBQSxLQUFBLGNBQUEsS0FBQSxxQkFBQSxLQUFBLGNBQUEsVUFBQSxDQUFBLElBQUEsV0FBQSxLQUFBLHdCQUFBLFFBQUEsS0FBQSxjQUFBLFNBQUEsU0FBQSxhQUFBLFdBQUEsVUFBQSxVQUFBLEtBQUEsVUFBQSxVQUFBLFNBQUEsZ0JBQUEsS0FBQSxVQUFBLFdBQUEsSUFBQSxJQUFBLGdCQUFBLFFBQUEsdUJBQUEsVUFBQSxDQUFBLEVBQUEsT0FBQSxJQUFBLE1BQUEsUUFBQSxnQkFBQSxhQUFBLEVBQUEsWUFBQSxFQUFBLFNBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxVQUFBLE1BQUEsUUFBQSxJQUFBLElBQUEsRUFBQSxVQUFBLFVBQUEsRUFBQSxNQUFBLE1BQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxNQUFBLGdCQUFBLFlBQUEsRUFBQSxJQUFBLEtBQUEsV0FBQSxjQUFBLEVBQUEsS0FBQSxVQUFBLFlBQUEsRUFBQSxJQUFBLEtBQUEsYUFBQSxHQUFBLEdBQUEsV0FBQSxPQUFBLGdCQUFBLFlBQUEsU0FBQSxFQUFBLFlBQUEsSUFBQSxXQUFBLENBQUEsRUFBQSxHQUFBLGNBQUEsUUFBQSxlQUFBLEtBQUEsc0JBQUEsT0FBQSxRQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxTQUFBLGFBQUEsQ0FBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxFQUFBLElBQUEsS0FBQSxLQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLE9BQUEsRUFBQSxHQUFBLEdBQUEsU0FBQSxhQUFBLENBQUEsS0FBQSxnQkFBQSxTQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxFQUFBLElBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsTUFBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsU0FBQSxhQUFBLENBQUEsS0FBQSxnQkFBQSxTQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxFQUFBLElBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsT0FBQSxJQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxJQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsS0FBQSxFQUFBLEVBQUEsTUFBQSxDQUFBLEVBQUEsTUFBQSxLQUFBLEdBQUEsR0FBQSxTQUFBLGFBQUEsQ0FBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxFQUFBLElBQUEsS0FBQSxLQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLEtBQUEsRUFBQSxFQUFBLE9BQUEsSUFBQSxDQUFBLEVBQUEsTUFBQSxLQUFBLEVBQUEsSUFBQSxTQUFBLGFBQUEsQ0FBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxFQUFBLElBQUEsS0FBQSxLQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLElBQUEsQ0FBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLFNBQUEsbUJBQUEsTUFBQSxDQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUEsT0FBQSxTQUFBLFNBQUEsS0FBQSxDQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsVUFBQSxLQUFBLE1BQUEsVUFBQSxxQkFBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxxQkFBQSxPQUFBLElBQUEscUJBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxXQUFBLENBQUEsRUFBQSxRQUFBLENBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsS0FBQSxXQUFBLEtBQUEsTUFBQSxJQUFBLFdBQUEsRUFBQSxFQUFBLElBQUEscUJBQUEscUJBQUEsT0FBQSxFQUFBLEdBQUEsS0FBQSxHQUFBLE9BQUEsUUFBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLFFBQUEsSUFBQSxJQUFBLFNBQUEsSUFBQSxVQUFBLEtBQUEsTUFBQSxzQkFBQSxXQUFBLEtBQUEsc0JBQUEsS0FBQSxNQUFBLGNBQUEsS0FBQSxHQUFBLFNBQUEsTUFBQSxNQUFBLFdBQUEsR0FBQSxNQUFBLFdBQUEsR0FBQSxlQUFBLEtBQUEsbUJBQUEsT0FBQSxnQkFBQSxLQUFBLG9CQUFBLE1BQUEsZUFBQSxZQUFBLEVBQUEsRUFBQSxFQUFBLGVBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxTQUFBLFNBQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxJQUFBLGVBQUEsSUFBQSxHQUFBLEVBQUEsU0FBQSxLQUFBLDBDQUFBLFNBQUEsVUFBQSxNQUFBLGNBQUEsU0FBQSxVQUFBLGdCQUFBLE1BQUEsS0FBQSxzQkFBQSxTQUFBLEVBQUEsRUFBQSxFQUFBLENBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLENBQUEsSUFBQSxLQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxNQUFBLEtBQUEsTUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSxFQUFBLEtBQUEsTUFBQSxJQUFBLEVBQUEsUUFBQSxLQUFBLE1BQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxVQUFBLE1BQUEsVUFBQSxNQUFBLFVBQUEsTUFBQSxHQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsS0FBQSxLQUFBLG1CQUFBLEVBQUEsVUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSx1QkFBQSxNQUFBLGVBQUEsTUFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLFFBQUEsd0JBQUEsRUFBQSxRQUFBLE1BQUEsUUFBQSxDQUFBLEVBQUEsTUFBQSxDQUFBLElBQUEsV0FBQSxFQUFBLE9BQUEsTUFBQSxPQUFBLE1BQUEsS0FBQSxNQUFBLFNBQUEsRUFBQSxlQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsRUFBQSxjQUFBLEtBQUEsTUFBQSxjQUFBLFdBQUEsUUFBQSxFQUFBLEVBQUEsY0FBQSxNQUFBLG1CQUFBLFdBQUEsUUFBQSxFQUFBLEVBQUEsVUFBQSxPQUFBLGNBQUEsV0FBQSxFQUFBLEVBQUEsVUFBQSxPQUFBLGNBQUEsV0FBQSxJQUFBLGlCQUFBLEVBQUEsZUFBQSxHQUFBLEdBQUEsR0FBQSxpQkFBQSxLQUFBLDhDQUFBLElBQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxrQkFBQSxNQUFBLEVBQUEsVUFBQSxTQUFBLE1BQUEsRUFBQSxVQUFBLFNBQUEsT0FBQSxJQUFBLE1BQUEsTUFBQSxRQUFBLEtBQUEsbUJBQUEsU0FBQSxhQUFBLENBQUEsSUFBQSxVQUFBLGFBQUEsT0FBQSxHQUFBLEdBQUEsVUFBQSxPQUFBLElBQUEsTUFBQSxhQUFBLGVBQUEsSUFBQSxJQUFBLElBQUEsT0FBQSxJQUFBLE1BQUEsV0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsR0FBQSxVQUFBLEVBQUEsSUFBQSxHQUFBLGFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxHQUFBLFVBQUEsS0FBQSxzREFBQSxPQUFBLFFBQUEsS0FBQSxvQkFBQSxTQUFBLGVBQUEsZUFBQSxXQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsZUFBQSxPQUFBLE9BQUEsSUFBQSxNQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLFFBQUEsZUFBQSxJQUFBLFlBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsR0FBQSxJQUFBLFlBQUEsS0FBQSxNQUFBLFNBQUEsWUFBQSxNQUFBLGNBQUEsRUFBQSxLQUFBLE1BQUEsU0FBQSxlQUFBLEdBQUEsY0FBQSxPQUFBLEdBQUEsS0FBQSxNQUFBLFNBQUEsZUFBQSxXQUFBLFdBQUEsS0FBQSxNQUFBLFFBQUEsY0FBQSxhQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsU0FBQSxPQUFBLEdBQUEsWUFBQSxPQUFBLFFBQUEsU0FBQSxVQUFBLE1BQUEsYUFBQSxDQUFBLEdBQUEsTUFBQSxjQUFBLEdBQUEsYUFBQSxPQUFBLEtBQUEsMkJBQUEsS0FBQSxNQUFBLE1BQUEsSUFBQSxtQkFBQSxhQUFBLE9BQUEsR0FBQSxtQkFBQSxHQUFBLEdBQUEsYUFBQSxHQUFBLENBQUEsSUFBQSxJQUFBLGFBQUEsRUFBQSxtQkFBQSxjQUFBLEdBQUEsYUFBQSxlQUFBLGVBQUEsR0FBQSxjQUFBLG1CQUFBLEtBQUEsYUFBQSxNQUFBLEtBQUEsaUJBQUEsQ0FBQSxLQUFBLGFBQUEsSUFBQSxNQUFBLG1CQUFBLGNBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsYUFBQSxPQUFBLElBQUEsS0FBQSxhQUFBLEdBQUEsRUFBQSxJQUFBLElBQUEsR0FBQSxFQUFBLEdBQUEsS0FBQSxhQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsSUFBQSxhQUFBLGFBQUEsVUFBQSxLQUFBLGFBQUEsYUFBQSxLQUFBLGlCQUFBLE9BQUEsVUFBQSxDQUFBLE9BQUEsR0FBQSxLQUFBLGFBQUEsS0FBQSxLQUFBLGlCQUFBLFNBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxhQUFBLE9BQUEsSUFBQSxLQUFBLGlCQUFBLGVBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxlQUFBLEtBQUEsZUFBQSxTQUFBLE9BQUEsQ0FBQSxPQUFBLEtBQUEsYUFBQSxLQUFBLGFBQUEsT0FBQSxFQUFBLFNBQUEsS0FBQSxXQUFBLFNBQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLE9BQUEsS0FBQSxlQUFBLEdBQUEsSUFBQSxLQUFBLEtBQUEsYUFBQSxPQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxJQUFBLE9BQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsT0FBQSxNQUFBLGNBQUEsT0FBQSxLQUFBLGFBQUEsSUFBQSxPQUFBLE9BQUEsSUFBQSxJQUFBLFFBQUEsS0FBQSxhQUFBLEdBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLFFBQUEsTUFBQSxjQUFBLEtBQUEsTUFBQSxTQUFBLEVBQUEsU0FBQSxLQUFBLGFBQUEsSUFBQSxPQUFBLFNBQUEsS0FBQSxjQUFBLFNBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxPQUFBLE1BQUEsTUFBQSxLQUFBLDBDQUFBLEdBQUEsS0FBQSxLQUFBLE9BQUEsTUFBQSxHQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsSUFBQSxvQkFBQSxLQUFBLGFBQUEsbUJBQUEsTUFBQSxhQUFBLEdBQUEsb0JBQUEsT0FBQSxtQkFBQSxPQUFBLENBQUEsSUFBQSxLQUFBLG9CQUFBLG9CQUFBLG1CQUFBLG1CQUFBLEtBQUEsSUFBQSxJQUFBLFFBQUEsSUFBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxtQkFBQSxPQUFBLG9CQUFBLE9BQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxLQUFBLFFBQUEsSUFBQSxtQkFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLFdBQUEsRUFBQSxtQkFBQSxPQUFBLElBQUEsUUFBQSxHQUFBLE1BQUEsY0FBQSxvQkFBQSxFQUFBLFlBQUEsbUJBQUEsSUFBQSxPQUFBLElBQUEsVUFBQSxNQUFBLFVBQUEsS0FBQSxVQUFBLFNBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxPQUFBLE1BQUEsTUFBQSxLQUFBLDBDQUFBLEdBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxjQUFBLEtBQUEsYUFBQSxRQUFBLGNBQUEsT0FBQSxjQUFBLE1BQUEsYUFBQSxRQUFBLGNBQUEsT0FBQSxRQUFBLElBQUEsTUFBQSxRQUFBLFFBQUEsR0FBQSxFQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLE9BQUEsY0FBQSxHQUFBLEVBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxRQUFBLEVBQUEsR0FBQSxNQUFBLGNBQUEsUUFBQSxFQUFBLEdBQUEsS0FBQSxNQUFBLFNBQUEsT0FBQSxjQUFBLEtBQUEsT0FBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLFVBQUEsS0FBQSxVQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsR0FBQSxPQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUEsR0FBQSxHQUFBLE9BQUEsT0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLEtBQUEsYUFBQSxPQUFBLFFBQUEsSUFBQSxNQUFBLE1BQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsU0FBQSxLQUFBLGFBQUEsR0FBQSxRQUFBLE9BQUEsSUFBQSxVQUFBLEtBQUEsTUFBQSxVQUFBLEtBQUEsbUJBQUEsU0FBQSxPQUFBLFlBQUEsQ0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLDJCQUFBLEdBQUEsR0FBQSxZQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsS0FBQSxhQUFBLE9BQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLFFBQUEsT0FBQSxJQUFBLFFBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUEsYUFBQSxHQUFBLGFBQUEsT0FBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLFVBQUEsS0FBQSxPQUFBLFNBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxPQUFBLE1BQUEsTUFBQSxLQUFBLDBDQUFBLEdBQUEsTUFBQSxLQUFBLEtBQUEsY0FBQSxJQUFBLElBQUEsU0FBQSxLQUFBLE1BQUEsS0FBQSxVQUFBLEtBQUEsdUJBQUEsTUFBQSxlQUFBLE1BQUEsUUFBQSw4QkFBQSxLQUFBLE1BQUEsUUFBQSx3QkFBQSxVQUFBLFFBQUEsTUFBQSxRQUFBLENBQUEsVUFBQSxNQUFBO0lBQ0EsSUFBQSxpQkFBQSxVQUFBLE9BQUEsTUFBQSxPQUFBLE1BQUEsS0FBQSxNQUFBLFNBQUEsVUFBQSxlQUFBLFVBQUEsUUFBQSwrQkFBQSxLQUFBLE1BQUEsbUJBQUEsaUJBQUEsT0FBQSxrQkFBQSxLQUFBLE1BQUEsY0FBQSxpQkFBQSxPQUFBLFNBQUEsU0FBQSxjQUFBLG1CQUFBLFVBQUEsVUFBQSxjQUFBLE1BQUEsT0FBQSxJQUFBLE1BQUEsU0FBQSxZQUFBLFNBQUEsTUFBQSxVQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxLQUFBLEtBQUEsU0FBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxHQUFBLE1BQUEsR0FBQSxXQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEtBQUEsU0FBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsTUFBQSxHQUFBLElBQUEsR0FBQSxFQUFBLEtBQUEsS0FBQSxJQUFBLFVBQUEsS0FBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsSUFBQSxNQUFBLEdBQUEsSUFBQSxHQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsVUFBQSxLQUFBLElBQUEsTUFBQSxNQUFBLEtBQUEsaUJBQUEsT0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxpQkFBQSxNQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsTUFBQSxLQUFBLGNBQUEsU0FBQSxPQUFBLFlBQUEsQ0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLDJCQUFBLEdBQUEsR0FBQSxZQUFBLE9BQUEsS0FBQSxJQUFBLElBQUEsYUFBQSxJQUFBLE1BQUEsT0FBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLGFBQUEsT0FBQSxJQUFBLGFBQUEsR0FBQSxFQUFBLE9BQUEsYUFBQSxHQUFBLFlBQUEsSUFBQSxVQUFBLEtBQUEsZUFBQSxLQUFBLElBQUEsU0FBQSxFQUFBLENBQUEsT0FBQSxLQUFBLFNBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsS0FBQSwyQkFBQSxPQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsUUFBQSxTQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxLQUFBLDZCQUFBLE9BQUEsS0FBQSxTQUFBLElBQUEsS0FBQSxTQUFBLEtBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsT0FBQSxHQUFBLEdBQUEsR0FBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsS0FBQSxTQUFBLENBQUEsS0FBQSxTQUFBLEdBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxTQUFBLFFBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLEVBQUEsUUFBQSxLQUFBLENBQUEsUUFBQSxPQUFBLEdBQUEsQ0FBQSxNQUFBLFNBQUEsY0FBQSxLQUFBLEtBQUEsb0JBQUEsQ0FBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsRUFBQSxLQUFBLG9CQUFBLG9CQUFBLEtBQUEsaUJBQUEsc0JBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxzQkFBQSxLQUFBLGlCQUFBLFFBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxRQUFBLEtBQUEsaUJBQUEsSUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLElBQUEsS0FBQSxpQkFBQSxJQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsSUFBQSxLQUFBLGVBQUEsVUFBQSxDQUFBLEtBQUEsU0FBQSxLQUFBLFlBQUEsU0FBQSxXQUFBLEVBQUEsRUFBQSxDQUFBLEdBQUEsS0FBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFlBQUEsS0FBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFdBQUEsQ0FBQSxJQUFBLGVBQUEsS0FBQSxJQUFBLFdBQUEsS0FBQSxxQkFBQSxPQUFBLEdBQUEsZ0JBQUEsZUFBQSxLQUFBLHFCQUFBLEVBQUEsTUFBQSxDQUFBLEdBQUEsU0FBQSxrQkFBQSxlQUFBLENBQUEsS0FBQSxXQUFBLGVBQUEsR0FBQSxLQUFBLFFBQUEsZUFBQSxHQUFBLEtBQUEsU0FBQSxlQUFBLEdBQUEsS0FBQSxpQkFBQSxhQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsYUFBQSxLQUFBLGlCQUFBLFVBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUEsaUJBQUEsV0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFdBQUEsU0FBQSxxQkFBQSxDQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLFdBQUEsQ0FBQSxFQUFBLEtBQUEscUJBQUEsSUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxLQUFBLG9CQUFBLEtBQUEsS0FBQSxpQkFBQSx1QkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHFCQUFBLEdBQUEsRUFBQSxLQUFBLHFCQUFBLEdBQUEsRUFBQSxLQUFBLHFCQUFBLEdBQUEsRUFBQSxLQUFBLHFCQUFBLEdBQUEsRUFBQSxLQUFBLHFCQUFBLEdBQUEsRUFBQSxLQUFBLHVCQUFBLEtBQUEsa0JBQUEsU0FBQSxXQUFBLENBQUEsSUFBQSxJQUFBLGdCQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxNQUFBLFdBQUEsR0FBQSxHQUFBLEdBQUEsTUFBQSxNQUFBLENBQUEsRUFBQSxpQkFBQSxNQUFBLEdBQUEsRUFBQSxnQkFBQSxNQUFBLENBQUEsRUFBQSxJQUFBLFdBQUEsS0FBQSxNQUFBLENBQUEsaUJBQUEsb0JBQUEsR0FBQSxZQUFBLEtBQUEsTUFBQSxXQUFBLEdBQUEsT0FBQSxLQUFBLElBQUEsWUFBQSxXQUFBLElBQUEscUJBQUEsYUFBQSxLQUFBLElBQUEsWUFBQSxXQUFBLElBQUEscUJBQUEsYUFBQSxLQUFBLElBQUEsRUFBQSxZQUFBLFdBQUEsSUFBQSxxQkFBQSxFQUFBLGFBQUEsS0FBQSxJQUFBLFlBQUEsV0FBQSxJQUFBLHFCQUFBLGFBQUEsS0FBQSxJQUFBLFlBQUEsV0FBQSxJQUFBLHFCQUFBLGFBQUEsS0FBQSxjQUFBLFNBQUEsV0FBQSxJQUFBLENBQUEsT0FBQSxJQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLEdBQUEsS0FBQSxtQkFBQSxTQUFBLE9BQUEsUUFBQSxTQUFBLHdCQUFBLENBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxNQUFBLEtBQUEsT0FBQSxPQUFBLFdBQUEsS0FBQSxxQkFBQSxFQUFBLE9BQUEsR0FBQSxHQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsRUFBQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxJQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLEdBQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLEtBQUEsR0FBQSxHQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsR0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLEtBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLENBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsR0FBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxNQUFBLFdBQUEsSUFBQSxTQUFBLE9BQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxXQUFBLElBQUEsU0FBQSxPQUFBLElBQUEsSUFBQSxnQkFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLE9BQUEsRUFBQSxLQUFBLElBQUEsZ0JBQUEsMEJBQUEsRUFBQSx3QkFBQSxJQUFBLEtBQUEsa0JBQUEsWUFBQSxLQUFBLGNBQUEsV0FBQSxHQUFBLEtBQUEsS0FBQSxxQkFBQSxTQUFBLE9BQUEsUUFBQSxTQUFBLHdCQUFBLENBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxNQUFBLEtBQUEsT0FBQSxNQUFBLFdBQUEsS0FBQSxxQkFBQSxFQUFBLE9BQUEsR0FBQSxHQUFBLE1BQUEsRUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsRUFBQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxJQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLEdBQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLEtBQUEsR0FBQSxHQUFBLE1BQUEsRUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsR0FBQSxNQUFBLEVBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLEtBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLFFBQUEsT0FBQSxRQUFBLFdBQUEsR0FBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxNQUFBLFdBQUEsSUFBQSxTQUFBLE9BQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxNQUFBLEVBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxXQUFBLElBQUEsU0FBQSxPQUFBLElBQUEsSUFBQSxnQkFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLE9BQUEsRUFBQSxLQUFBLElBQUEsZ0JBQUEsMEJBQUEsd0JBQUEsSUFBQSxLQUFBLGtCQUFBLFlBQUEsS0FBQSxjQUFBLFdBQUEsR0FBQSxLQUFBLEtBQUEscUJBQUEsU0FBQSxXQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsZ0JBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxRQUFBLEtBQUEsY0FBQSxXQUFBLEdBQUEsUUFBQSxLQUFBLG1CQUFBLEVBQUEsS0FBQSxNQUFBLFNBQUEsV0FBQSxHQUFBLGlCQUFBLEdBQUEsQ0FBQSxNQUFBLFdBQUEsUUFBQSxLQUFBLHFCQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUEsTUFBQSxTQUFBLFdBQUEsR0FBQSxpQkFBQSxDQUFBLE1BQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxvQkFBQSxnQkFBQSxFQUFBLE1BQUEsQ0FBQSxFQUFBLElBQUEsS0FBQSxnQkFBQSxPQUFBLE1BQUEsRUFBQSxJQUFBLE1BQUEsUUFBQSxDQUFBLElBQUEsT0FBQSxLQUFBLGdCQUFBLE9BQUEsR0FBQSxPQUFBLFlBQUEsb0JBQUEsUUFBQSxTQUFBLENBQUEsT0FBQSxpQkFBQSxNQUFBLENBQUEsRUFBQSxPQUFBLEdBQUEsQ0FBQSxNQUFBLENBQUEsSUFBQSxNQUFBLElBQUEsY0FBQSxRQUFBLFFBQUEscUJBQUEsS0FBQSxnQkFBQSxLQUFBLE9BQUEsTUFBQSxLQUFBLHFCQUFBLEtBQUEsb0JBQUEseUJBQUEsT0FBQSxNQUFBLENBQUEsRUFBQSxNQUFBLENBQUEsR0FBQSxLQUFBLG1CQUFBLFVBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsRUFBQSxVQUFBLEtBQUEsdUNBQUEsR0FBQSxVQUFBLEVBQUEsQ0FBQSxJQUFBLElBQUEsZ0JBQUEsRUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsaUJBQUEsS0FBQSxnQkFBQSxHQUFBLG9CQUFBLElBQUEsSUFBQSxRQUFBLGdCQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxnQkFBQSxRQUFBLEtBQUEsZ0JBQUEsT0FBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLFFBQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsSUFBQSxRQUFBLG9CQUFBLFNBQUEsR0FBQSxVQUFBLEtBQUEsZ0JBQUEsT0FBQSxHQUFBLE1BQUEsT0FBQSxLQUFBLGdCQUFBLE1BQUEsRUFBQSxJQUFBLE1BQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLGdCQUFBLEtBQUEsS0FBQSxZQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsR0FBQSxJQUFBLE9BQUEsRUFBQSxJQUFBLElBQUEscUJBQUEsS0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLE9BQUEsS0FBQSxnQkFBQSxHQUFBLEdBQUEsT0FBQSxPQUFBLGNBQUEsQ0FBQSxHQUFBLE1BQUEscUJBQUEsT0FBQSxLQUFBLFdBQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxDQUFBLEtBQUEsSUFBQSxxQkFBQSxFQUFBLE9BQUEsR0FBQSxLQUFBLElBQUEscUJBQUEsRUFBQSxPQUFBLElBQUEsR0FBQSxxQkFBQSxRQUFBLE9BQUEsR0FBQSxLQUFBLDZCQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsZUFBQSxFQUFBLGdCQUFBLEVBQUEsSUFBQSxLQUFBLGdCQUFBLE9BQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxRQUFBLEtBQUEsZ0JBQUEsR0FBQSxRQUFBLE9BQUEsZ0JBQUEsaUJBQUEsaUJBQUEsUUFBQSxxQkFBQSxHQUFBLEVBQUEsZUFBQSxNQUFBLENBQUEsRUFBQSxJQUFBLElBQUEsUUFBQSxnQkFBQSxJQUFBLGVBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsUUFBQSxLQUFBLGdCQUFBLEdBQUEsZ0JBQUEsS0FBQSxJQUFBLFFBQUEsb0JBQUEsU0FBQSxNQUFBLElBQUEsaUJBQUEsZ0JBQUEsS0FBQSxrQkFBQSxTQUFBLE1BQUEsQ0FBQSxJQUFBLFVBQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxNQUFBLElBQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxPQUFBLE1BQUEsTUFBQSxLQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsY0FBQSxDQUFBLFNBQUEsT0FBQSxhQUFBLE1BQUEsVUFBQSxJQUFBLElBQUEsS0FBQSxDQUFBLEVBQUEsV0FBQSxJQUFBLE1BQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEdBQUEsQ0FBQSxLQUFBLEdBQUEsTUFBQSxDQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxhQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEdBQUEsTUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLElBQUEsRUFBQSxlQUFBLGVBQUEsV0FBQSxxQkFBQSxHQUFBLElBQUEsRUFBQSxjQUFBLEdBQUEsR0FBQSxhQUFBLEdBQUEsS0FBQSxrQkFBQSxZQUFBLENBQUEsSUFBQSxVQUFBLEtBQUEscUJBQUEsV0FBQSxFQUFBLEdBQUEsR0FBQSxVQUFBLEdBQUEsTUFBQSxFQUFBLEtBQUEsV0FBQSxLQUFBLEtBQUEsbUNBQUEsQ0FBQSxJQUFBLFFBQUEsS0FBQSxjQUFBLFFBQUEsV0FBQSxLQUFBLEdBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxFQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsVUFBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsRUFBQSxPQUFBLFFBQUEsSUFBQSxhQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLE9BQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsYUFBQSxPQUFBLFdBQUEsRUFBQSxxQkFBQSxXQUFBLGdCQUFBLEdBQUEsS0FBQSxrQkFBQSxZQUFBLENBQUEsSUFBQSxVQUFBLEtBQUEscUJBQUEsV0FBQSxFQUFBLE1BQUEsWUFBQSxNQUFBLFdBQUEsR0FBQSxLQUFBLGFBQUEsS0FBQSxrQ0FBQSxJQUFBLFlBQUEsS0FBQSxxQkFBQSxPQUFBLE9BQUEsa0JBQUEsYUFBQSxJQUFBLGtCQUFBLGNBQUEsU0FBQSxpQkFBQSxLQUFBLEtBQUEsb0JBQUEsQ0FBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsRUFBQSxLQUFBLG9CQUFBLG9CQUFBLEtBQUEsaUJBQUEsc0JBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxzQkFBQSxLQUFBLGlCQUFBLFFBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxRQUFBLEtBQUEsaUJBQUEsSUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLEtBQUEsaUJBQUEsSUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLEtBQUEsZUFBQSxVQUFBLENBQUEsS0FBQSxTQUFBLEtBQUEsWUFBQSxTQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsR0FBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsWUFBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsV0FBQSxDQUFBLElBQUEsZUFBQSxLQUFBLElBQUEsV0FBQSxLQUFBLHFCQUFBLE9BQUEsR0FBQSxnQkFBQSxlQUFBLEtBQUEscUJBQUEsRUFBQSxNQUFBLENBQUEsR0FBQSxTQUFBLHVCQUFBLE1BQUEsT0FBQSxPQUFBLE1BQUEsT0FBQSxXQUFBLG9CQUFBLENBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxnQkFBQSxJQUFBLE1BQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxXQUFBLFdBQUEsS0FBQSxxQkFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEdBQUEsS0FBQSxvQkFBQSxvQkFBQSxLQUFBLGNBQUEsU0FBQSxXQUFBLElBQUEsQ0FBQSxPQUFBLElBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxHQUFBLEtBQUEsa0JBQUEsU0FBQSxXQUFBLENBQUEsSUFBQSxJQUFBLFdBQUEsS0FBQSxXQUFBLFlBQUEsV0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxXQUFBLFdBQUEsS0FBQSxZQUFBLE1BQUEsQ0FBQSxFQUFBLE1BQUEsQ0FBQSxHQUFBLEtBQUEsbUJBQUEsU0FBQSxPQUFBLFFBQUEsU0FBQSx3QkFBQSxDQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxLQUFBLHFCQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxFQUFBLE9BQUEsR0FBQSxHQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQSxXQUFBLEdBQUEsU0FBQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxJQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxXQUFBLEdBQUEsU0FBQSxPQUFBLElBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEdBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsSUFBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxNQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxDQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLGdCQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLE9BQUEsRUFBQSxLQUFBLElBQUEsZ0JBQUEsMEJBQUEsRUFBQSx3QkFBQSxJQUFBLEtBQUEsa0JBQUEsWUFBQSxLQUFBLGNBQUEsV0FBQSxHQUFBLEtBQUEsS0FBQSxxQkFBQSxTQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxnQkFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxRQUFBLEtBQUEsY0FBQSxXQUFBLEdBQUEsUUFBQSxLQUFBLG1CQUFBLEVBQUEsS0FBQSxNQUFBLFNBQUEsRUFBQSxXQUFBLEdBQUEsaUJBQUEsR0FBQSxDQUFBLE1BQUEsU0FBQSxDQUFBLElBQUEsSUFBQSxvQkFBQSxDQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQSxLQUFBLGdCQUFBLE9BQUEsTUFBQSxFQUFBLElBQUEsTUFBQSxRQUFBLENBQUEsSUFBQSxPQUFBLEtBQUEsZ0JBQUEsT0FBQSxHQUFBLE9BQUEsWUFBQSxvQkFBQSxRQUFBLFNBQUEsT0FBQSxJQUFBLGlCQUFBLFFBQUEsUUFBQSxxQkFBQSxJQUFBLE1BQUEsSUFBQSxpQkFBQSxRQUFBLFFBQUEscUJBQUEsS0FBQSxnQkFBQSxLQUFBLE9BQUEsTUFBQSxLQUFBLHFCQUFBLEtBQUEsb0JBQUEseUJBQUEsT0FBQSxPQUFBLE1BQUEsS0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsT0FBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxPQUFBLE1BQUEsUUFBQSxRQUFBLFFBQUEsR0FBQSxXQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsR0FBQSxLQUFBLEVBQUEsT0FBQSxLQUFBLE9BQUEsQ0FBQSxJQUFBLEVBQUEsU0FBQSxJQUFBLEVBQUEsTUFBQSxLQUFBLEdBQUEsRUFBQSxFQUFBLEtBQUEsR0FBQSxJQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxFQUFBLE9BQUEsS0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLE9BQUEsTUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLGFBQUEsRUFBQSxLQUFBLEdBQUEsQ0FBQSxHQUFBLE1BQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxHQUFBLEdBQUEsYUFBQSxXQUFBLHFCQUFBLEdBQUEsR0FBQSxhQUFBLENBQUEsR0FBQSxLQUFBLGtCQUFBLFlBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxxQkFBQSxXQUFBLEVBQUEsR0FBQSxHQUFBLE1BQUEsVUFBQSxPQUFBLFVBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxhQUFBLE9BQUEsV0FBQSxFQUFBLHFCQUFBLEdBQUEsY0FBQSxlQUFBLFdBQUEsZ0JBQUEsSUFBQSxHQUFBLEtBQUEsa0JBQUEsWUFBQSxDQUFBLElBQUEsVUFBQSxLQUFBLHFCQUFBLFdBQUEsRUFBQSxNQUFBLEdBQUEsTUFBQSxVQUFBLE9BQUEsV0FBQSxHQUFBLEdBQUEsS0FBQSxnQkFBQSxPQUFBLE9BQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsMkNBQUEsU0FBQSxzQkFBQSxPQUFBLFFBQUEsdUJBQUEsQ0FBQSxLQUFBLGFBQUEsRUFBQSxLQUFBLFdBQUEsRUFBQSxLQUFBLFdBQUEsRUFBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLHVCQUFBLHVCQUFBLEdBQUEsUUFBQSxLQUFBLGVBQUEsRUFBQSxTQUFBLElBQUEsSUFBQSxRQUFBLEtBQUEsZUFBQSxFQUFBLFNBQUEsSUFBQSxJQUFBLFVBQUEsS0FBQSxlQUFBLEdBQUEsS0FBQSxZQUFBLFNBQUEsUUFBQSxDQUFBLElBQUEsS0FBQSxFQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUEsRUFBQSxDQUFBLElBQUEsSUFBQSxLQUFBLEVBQUEsRUFBQSxFQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsR0FBQSxFQUFBLE9BQUEsT0FBQSxLQUFBLFdBQUEsUUFBQSxFQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsS0FBQSxjQUFBLE9BQUEsS0FBQSxXQUFBLFFBQUEsRUFBQSxLQUFBLFlBQUEsUUFBQSxLQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLFdBQUEsRUFBQSxJQUFBLE9BQUEsR0FBQSxFQUFBLE9BQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxLQUFBLGNBQUEsUUFBQSxTQUFBLEtBQUEsV0FBQSxHQUFBLEtBQUEsZUFBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLGVBQUEsR0FBQSxTQUFBLEtBQUEsV0FBQSxJQUFBLEtBQUEsV0FBQSxLQUFBLFdBQUEsUUFBQSxFQUFBLEtBQUEsV0FBQSxJQUFBLEtBQUEsV0FBQSxFQUFBLEtBQUEsWUFBQSxLQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUEsRUFBQSxHQUFBLENBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxXQUFBLEVBQUEsSUFBQSxPQUFBLEdBQUEsRUFBQSxJQUFBLGVBQUEsQ0FBQSxLQUFBLE9BQUEsS0FBQSxjQUFBLFFBQUEsU0FBQSxLQUFBLFdBQUEsR0FBQSxLQUFBLGVBQUEsSUFBQSxnQkFBQSxLQUFBLE9BQUEsS0FBQSxlQUFBLFNBQUEsS0FBQSxXQUFBLEVBQUEsR0FBQSxLQUFBLGVBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLFNBQUEsS0FBQSxXQUFBLEVBQUEsR0FBQSxJQUFBLE9BQUEsR0FBQSxFQUFBLFFBQUEsR0FBQSxTQUFBLEtBQUEsV0FBQSxFQUFBLElBQUEsSUFBQSxlQUFBLENBQUEsS0FBQSxPQUFBLEtBQUEsY0FBQSxRQUFBLEdBQUEsU0FBQSxLQUFBLFdBQUEsRUFBQSxJQUFBLE9BQUEsS0FBQSxlQUFBLGdCQUFBLGVBQUEsS0FBQSxXQUFBLEtBQUEsV0FBQSxDQUFBLFFBQUEsR0FBQSxFQUFBLEtBQUEsV0FBQSxJQUFBLEtBQUEsV0FBQSxFQUFBLEtBQUEsWUFBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLFNBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxhQUFBLEtBQUEsT0FBQSxPQUFBLEtBQUEsdUJBQUEsRUFBQSxFQUFBLEtBQUEsWUFBQSxJQUFBLEtBQUEsY0FBQSxTQUFBLGNBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxJQUFBLENBQUEsR0FBQSxlQUFBLE9BQUEsRUFBQSxNQUFBLFFBQUEsT0FBQSxLQUFBLFlBQUEsT0FBQSxxQkFBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSx3QkFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEsV0FBQSxRQUFBLEVBQUEsUUFBQSxHQUFBLG9CQUFBLElBQUEsTUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsT0FBQSxFQUFBLENBQUEsUUFBQSxLQUFBLFlBQUEsSUFBQSxJQUFBLFlBQUEsS0FBQSxNQUFBLFFBQUEsSUFBQSxhQUFBLFFBQUEsR0FBQSxTQUFBLG9CQUFBLGFBQUEsU0FBQSxvQkFBQSxjQUFBLFFBQUEsT0FBQSxHQUFBLFNBQUEsUUFBQSxLQUFBLFlBQUEsR0FBQSxTQUFBLG9CQUFBLFNBQUEsUUFBQSxTQUFBLE9BQUEsR0FBQSxPQUFBLFNBQUEsS0FBQSxnQkFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEsV0FBQSxRQUFBLEVBQUEsUUFBQSxHQUFBLEdBQUEsUUFBQSxHQUFBLFFBQUEsS0FBQSxZQUFBLElBQUEsSUFBQSxVQUFBLFNBQUEsS0FBQSxHQUFBLFVBQUEsU0FBQSxLQUFBLFFBQUEsR0FBQSxHQUFBLFFBQUEsUUFBQSxLQUFBLFlBQUEsR0FBQSxHQUFBLFVBQUEsU0FBQSxLQUFBLFFBQUEsR0FBQSxHQUFBLFNBQUEsUUFBQSxLQUFBLFlBQUEsR0FBQSxRQUFBLEdBQUEsU0FBQSxjQUFBLE9BQUEsR0FBQSxPQUFBLFNBQUEsS0FBQSxpQkFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEsV0FBQSxRQUFBLEVBQUEsT0FBQSxJQUFBLE1BQUEsR0FBQSxRQUFBLEtBQUEsWUFBQSxHQUFBLE9BQUEsS0FBQSxTQUFBLGVBQUEsT0FBQSxHQUFBLE9BQUEsUUFBQSxLQUFBLGVBQUEsU0FBQSxXQUFBLENBQUEsSUFBQSxPQUFBLFdBQUEsUUFBQSxFQUFBLGNBQUEsR0FBQSxFQUFBLENBQUEsUUFBQSxZQUFBLElBQUEsSUFBQSxVQUFBLFFBQUEsSUFBQSxXQUFBLFFBQUEsSUFBQSxTQUFBLENBQUEsWUFBQSxHQUFBLFVBQUEsYUFBQSxFQUFBLGFBQUEsT0FBQSxTQUFBLE1BQUEsU0FBQSxNQUFBLFNBQUEsTUFBQSxlQUFBLE9BQUEsYUFBQSxjQUFBLGVBQUEsT0FBQSxHQUFBLE9BQUEsZUFBQSxLQUFBLGlCQUFBLFdBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxZQUFBLEVBQUEsc0JBQUEsRUFBQSxlQUFBLEVBQUEsV0FBQSxJQUFBLENBQUEsSUFBQSxLQUFBLEtBQUEsV0FBQSxHQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsT0FBQSxPQUFBLEVBQUEsTUFBQSxLQUFBLG1CQUFBLEdBQUEsTUFBQSxhQUFBLE1BQUEsdUJBQUEsTUFBQSxnQkFBQSxNQUFBLFdBQUEsS0FBQSxpQkFBQSxLQUFBLGNBQUEsS0FBQSxhQUFBLFFBQUEsS0FBQSxXQUFBLElBQUEsR0FBQSxXQUFBLEtBQUEsY0FBQSxNQUFBLFdBQUEsRUFBQSxLQUFBLHdCQUFBLFdBQUEsT0FBQSxNQUFBLEtBQUEsWUFBQSxJQUFBLElBQUEsU0FBQSxLQUFBLGdCQUFBLFlBQUEsR0FBQSxJQUFBLE1BQUEsU0FBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLFNBQUEsT0FBQSxJQUFBLEdBQUEsR0FBQSxTQUFBLFdBQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxNQUFBLEtBQUEsc0JBQUEsSUFBQSxJQUFBLFNBQUEsS0FBQSx3QkFBQSxZQUFBLEdBQUEsSUFBQSxNQUFBLFNBQUEsUUFBQSxFQUFBLEVBQUEsRUFBQSxTQUFBLE9BQUEsSUFBQSxHQUFBLEdBQUEsU0FBQSxXQUFBLEdBQUEsT0FBQSxLQUFBLElBQUEsTUFBQSxLQUFBLGVBQUEsSUFBQSxpQkFBQSxLQUFBLGlCQUFBLFlBQUEsT0FBQSxLQUFBLGtCQUFBLE1BQUEsS0FBQSxXQUFBLElBQUEsU0FBQSxLQUFBLGVBQUEsWUFBQSxPQUFBLEtBQUEsV0FBQSxPQUFBLFNBQUEsWUFBQSxHQUFBLFlBQUEsb0JBQUEsU0FBQSxNQUFBLE9BQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxDQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsT0FBQSxRQUFBLE9BQUEsUUFBQSxFQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxPQUFBLFNBQUEsRUFBQSxLQUFBLE1BQUEsT0FBQSxPQUFBLElBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUEsNkJBQUEsT0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsT0FBQSxRQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsR0FBQSxRQUFBLE9BQUEsUUFBQSxNQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsT0FBQSxPQUFBLEdBQUEsRUFBQSxPQUFBLENBQUEsR0FBQSxHQUFBLFNBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLE9BQUEsQ0FBQSxFQUFBLElBQUEsSUFBQSxPQUFBLE9BQUEsT0FBQSxFQUFBLFFBQUEsR0FBQSxPQUFBLFFBQUEsRUFBQSxDQUFBLElBQUEsRUFBQSxLQUFBLE1BQUEsT0FBQSxTQUFBLEVBQUEsS0FBQSxNQUFBLE9BQUEsT0FBQSxJQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLDZCQUFBLE9BQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxHQUFBLE9BQUEsUUFBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLEdBQUEsUUFBQSxPQUFBLFFBQUEsTUFBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxHQUFBLE9BQUEsT0FBQSxHQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsR0FBQSxTQUFBLE9BQUEsT0FBQSxHQUFBLE9BQUEsRUFBQSxPQUFBLENBQUEsS0FBQSxZQUFBLFlBQUEsU0FBQSxNQUFBLFVBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsVUFBQSxXQUFBLE9BQUEsSUFBQSxNQUFBLFdBQUEsR0FBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxPQUFBLE9BQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxHQUFBLENBQUEsR0FBQSxHQUFBLEdBQUEsT0FBQSxFQUFBLEdBQUEsT0FBQSxVQUFBLGlCQUFBLFFBQUEsWUFBQSxvQkFBQSxNQUFBLFFBQUEsR0FBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxPQUFBLElBQUEsS0FBQSxNQUFBLE9BQUEsRUFBQSxJQUFBLE9BQUEsTUFBQSxFQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsT0FBQSxJQUFBLE9BQUEsTUFBQSxLQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxJQUFBLElBQUEsRUFBQSxPQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLEVBQUEsT0FBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLElBQUEsS0FBQSxLQUFBLFlBQUEsR0FBQSxFQUFBLElBQUEsTUFBQSxPQUFBLENBQUEsS0FBQSw2QkFBQSxPQUFBLE1BQUEsWUFBQSxZQUFBLFNBQUEsTUFBQSxVQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsQ0FBQSxJQUFBLFVBQUEscUJBQUEsNkJBQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsU0FBQSxPQUFBLFlBQUEsWUFBQSxNQUFBLFVBQUEsWUFBQSxRQUFBLG9CQUFBLElBQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxRQUFBLFFBQUEsU0FBQSxnQkFBQSxRQUFBLG9CQUFBLFNBQUEsY0FBQSxDQUFBLEdBQUEsRUFBQSxlQUFBLGNBQUEsR0FBQSxLQUFBLG9CQUFBLE9BQUEsUUFBQSxTQUFBLGNBQUEsSUFBQSxRQUFBLGtDQUFBLFNBQUEsVUFBQSxDQUFBLEdBQUEsVUFBQSxHQUFBLEVBQUEsS0FBQSwwQ0FBQSxHQUFBLENBQUEsT0FBQSxRQUFBLG9CQUFBLFVBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxDQUFBLEtBQUEsOEJBQUEsUUFBQSx5QkFBQSxTQUFBLFlBQUEsQ0FBQSxJQUFBLElBQUEsZUFBQSxXQUFBLFlBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxRQUFBLG9CQUFBLE9BQUEsSUFBQSxDQUFBLElBQUEsY0FBQSxRQUFBLG9CQUFBLEdBQUEsR0FBQSxlQUFBLFlBQUEsT0FBQSxLQUFBLG9CQUFBLEVBQUEsR0FBQSxJQUFBLGVBQUEsa0JBQUEsaUJBQUEsWUFBQSxlQUFBLGVBQUEsaUJBQUEsWUFBQSxFQUFBLEVBQUEsZUFBQSxnQkFBQSxPQUFBLEdBQUEsZUFBQSxLQUFBLG9CQUFBLGFBQUEsTUFBQSxxQkFBQSw2QkFBQSxTQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsS0FBQSxzQkFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsS0FBQSxLQUFBLHNCQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxPQUFBLEtBQUEsTUFBQSxPQUFBLHFCQUFBLHNCQUFBLFNBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsT0FBQSxJQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUEsSUFBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsRUFBQSxFQUFBLElBQUEsSUFBQSxHQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsR0FBQSxHQUFBLFlBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxZQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxLQUFBLFlBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsS0FBQSxxQkFBQSxzQkFBQSxTQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE9BQUEsS0FBQSxzQkFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsZ0JBQUEsSUFBQSxvQkFBQSxNQUFBLDBCQUFBLElBQUEsTUFBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsSUFBQSxJQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLEtBQUEsc0JBQUEsSUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEdBQUEsa0JBQUEsaUJBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLEdBQUEsRUFBQSxzQkFBQSxHQUFBLEdBQUEsc0JBQUEsR0FBQSxRQUFBLEVBQUEsSUFBQSxzQkFBQSxHQUFBLFFBQUEsRUFBQSxJQUFBLHNCQUFBLEdBQUEsUUFBQSxFQUFBLEtBQUEsc0JBQUEsR0FBQSxRQUFBLEVBQUEsS0FBQSxzQkFBQSxHQUFBLFFBQUEsRUFBQSxLQUFBLHNCQUFBLEdBQUEsUUFBQSxFQUFBLEtBQUEsc0JBQUEsR0FBQSxRQUFBLEVBQUEsTUFBQSxrQkFBQSx3QkFBQSxTQUFBLGlCQUFBLENBQUEsSUFBQSxXQUFBLGtCQUFBLDBCQUFBLGtCQUFBLE9BQUEsTUFBQSxXQUFBLFdBQUEsa0JBQUEsMEJBQUEsaUJBQUEsc0JBQUEsa0JBQUEsMEJBQUEsU0FBQSxpQkFBQSxDQUFBLElBQUEsSUFBQSxlQUFBLFdBQUEsZUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLDBCQUFBLE9BQUEsSUFBQSxDQUFBLElBQUEsV0FBQSwwQkFBQSxHQUFBLFdBQUEsV0FBQSxHQUFBLEdBQUEsWUFBQSxpQkFBQSxPQUFBLElBQUEsa0JBQUEsV0FBQSxJQUFBLElBQUEsZUFBQSxLQUFBLGlCQUFBLGlCQUFBLFlBQUEsZUFBQSxpQkFBQSxlQUFBLFdBQUEsR0FBQSxlQUFBLGdCQUFBLE9BQUEsR0FBQSxlQUFBLElBQUEsa0JBQUEsZ0JBQUEsTUFBQSxxQkFBQSxRQUFBLFNBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxNQUFBLE1BQUEsU0FBQSxPQUFBLEtBQUEsb0JBQUEsT0FBQSxTQUFBLE9BQUEsSUFBQSxFQUFBLElBQUEscUJBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLHFCQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxxQkFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEscUJBQUEsRUFBQSxFQUFBLEtBQUEsU0FBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxVQUFBLGNBQUEsU0FBQSxhQUFBLFFBQUEsUUFBQSxDQUFBLEdBQUEsYUFBQSxRQUFBLFFBQUEsZUFBQSxLQUFBLG9CQUFBLElBQUEsSUFBQSxTQUFBLFFBQUEsb0JBQUEsU0FBQSxZQUFBLEVBQUEsYUFBQSxTQUFBLGNBQUEsRUFBQSxFQUFBLEVBQUEsYUFBQSxPQUFBLElBQUEsYUFBQSxhQUFBLEdBQUEsTUFBQSxJQUFBLElBQUEsT0FBQSxJQUFBLE1BQUEsYUFBQSxnQkFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLGFBQUEsT0FBQSxJQUFBLElBQUEsSUFBQSxRQUFBLGFBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxRQUFBLE1BQUEsSUFBQSxDQUFBLElBQUEsaUJBQUEsUUFBQSxjQUFBLGtCQUFBLFNBQUEsb0JBQUEsaUJBQUEsT0FBQSxtQkFBQSxJQUFBLFVBQUEsaUJBQUEsSUFBQSxNQUFBLG9CQUFBLElBQUEsSUFBQSw0QkFBQSxPQUFBLEdBQUEsVUFBQSxPQUFBLG9CQUFBLE9BQUEsT0FBQSxFQUFBLHFCQUFBLEdBQUEsQ0FBQSxJQUFBLGFBQUEsT0FBQSxxQkFBQSxVQUFBLE9BQUEsR0FBQSxjQUFBLDRCQUFBLE1BQUEsc0JBQUEsc0JBQUEsSUFBQSxJQUFBLDhCQUFBLDRCQUFBLFNBQUEsb0JBQUEsbUJBQUEsRUFBQSxFQUFBLEVBQUEsOEJBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsZ0JBQUEsRUFBQSxJQUFBLE9BQUEsR0FBQSxVQUFBLEdBQUEsYUFBQSxzQkFBQSxJQUFBLElBQUEsRUFBQSxvQkFBQSxnQkFBQSxFQUFBLElBQUEsT0FBQSxHQUFBLFVBQUEsK0JBQUEsYUFBQSxzQkFBQSxJQUFBLElBQUEsSUFBQSxPQUFBLEdBQUEsVUFBQSxPQUFBLEVBQUEsOEJBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxnQkFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLFFBQUEsb0JBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLEdBQUEsVUFBQSxTQUFBLGFBQUEsc0JBQUEsT0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLGFBQUEsU0FBQSxVQUFBLENBQUEsR0FBQSxFQUFBLFdBQUEsVUFBQSxFQUFBLEtBQUEsMkJBQUEsT0FBQSxTQUFBLFdBQUEsWUFBQSxTQUFBLFdBQUEsSUFBQSxNQUFBLElBQUEsWUFBQSxJQUFBLFlBQUEsSUFBQSxZQUFBLElBQUEsWUFBQSxJQUFBLFlBQUEsSUFBQSxZQUFBLElBQUEsWUFBQSxJQUFBLGFBQUEsTUFBQSxjQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsa0JBQUEsSUFBQSxNQUFBLEtBQUEsTUFBQSxjQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsT0FBQSxFQUFBLEdBQUEsUUFBQSxHQUFBLFFBQUEsVUFBQSxJQUFBLG1CQUFBLE1BQUEsZUFBQSxRQUFBLGNBQUEsU0FBQSxjQUFBLGlCQUFBLENBQUEsSUFBQSxJQUFBLGFBQUEsY0FBQSxPQUFBLGNBQUEsSUFBQSxNQUFBLGNBQUEsRUFBQSxFQUFBLGFBQUEsRUFBQSxJQUFBLGNBQUEsR0FBQSxJQUFBLGNBQUEsR0FBQSxJQUFBLGVBQUEsY0FBQSxPQUFBLGlCQUFBLEdBQUEsQ0FBQSxRQUFBLFVBQUEsT0FBQSxjQUFBLGdCQUFBLE1BQUEsSUFBQSxDQUFBLE1BQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLGlCQUFBLEVBQUEsSUFBQSxjQUFBLEdBQUEsY0FBQSxJQUFBLFFBQUEsT0FBQSxTQUFBLEtBQUEsQ0FBQSxJQUFBLElBQUEsT0FBQSxJQUFBLGdCQUFBLE1BQUEsUUFBQSxPQUFBLGNBQUEsUUFBQSxPQUFBLHdCQUFBLHFCQUFBLFVBQUEsT0FBQSxnQkFBQSxXQUFBLFVBQUEsY0FBQSxVQUFBLFFBQUEsU0FBQSxXQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsV0FBQSxPQUFBLElBQUEsWUFBQSxXQUFBLEdBQUEsaUJBQUEsSUFBQSxJQUFBLFlBQUEsSUFBQSxNQUFBLFlBQUEsYUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLFdBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxVQUFBLFdBQUEsR0FBQSxjQUFBLFVBQUEsVUFBQSxpQkFBQSxVQUFBLGlCQUFBLFFBQUEsY0FBQSxjQUFBLGtCQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsaUJBQUEsRUFBQSxJQUFBLFlBQUEsZ0JBQUEsY0FBQSxHQUFBLElBQUEsT0FBQSxJQUFBLHNCQUFBLFlBQUEsUUFBQSxjQUFBLFFBQUEsTUFBQSxPQUFBLFFBQUEsT0FBQSxHQUFBLE9BQUEsVUFBQSxLQUFBLE9BQUEsTUFBQSxFQUFBLE9BQUEsT0FBQSxFQUFBLE9BQUEsYUFBQSxLQUFBLE9BQUEsTUFBQSxDQUFBLEVBQUEsT0FBQSxxQkFBQSxDQUFBLENBQUEsR0FBQSxFQUFBLEVBQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsQ0FBQSxHQUFBLEdBQUEsR0FBQSxLQUFBLE9BQUEsU0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLElBQUEsQ0FBQSxHQUFBLEdBQUEsVUFBQSxPQUFBLENBQUEsSUFBQSxVQUFBLFNBQUEsZUFBQSxhQUFBLFFBQUEsVUFBQSxXQUFBLE1BQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLE9BQUEsT0FBQSxVQUFBLE9BQUEsT0FBQSxVQUFBLFFBQUEsYUFBQSxFQUFBLEVBQUEsT0FBQSxNQUFBLE9BQUEsUUFBQSxPQUFBLE9BQUEsT0FBQSxRQUFBLFNBQUEsTUFBQSxPQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsUUFBQSxPQUFBLE9BQUEsSUFBQSxNQUFBLElBQUEsTUFBQSxNQUFBLE9BQUEsVUFBQSxDQUFBLElBQUEsVUFBQSxTQUFBLGNBQUEsVUFBQSxRQUFBLFVBQUEsV0FBQSxNQUFBLFdBQUEsU0FBQSxlQUFBLGNBQUEsR0FBQSxNQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEsV0FBQSxXQUFBLE1BQUEsT0FBQSxVQUFBLEVBQUEsRUFBQSxJQUFBLEtBQUEsT0FBQSxVQUFBLE1BQUEsRUFBQSxFQUFBLElBQUEsS0FBQSxVQUFBLE1BQUEsTUFBQSxNQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUEsUUFBQSxVQUFBLE1BQUEsRUFBQSxHQUFBLE9BQUEsTUFBQSxNQUFBLE1BQUEsT0FBQSxPQUFBLE1BQUEsT0FBQSxHQUFBLENBQUEsT0FBQSxVQUFBLFFBQUEsYUFBQSxFQUFBLEVBQUEsTUFBQSxNQUFBLE1BQUEsUUFBQSxNQUFBLEVBQUEsQ0FBQSxPQUFBLE9BQUEsT0FBQSxrSEFBQSxLQUFBLE1BQUEsT0FBQSxVQUFBLE9BQUEsU0FBQSxPQUFBLFNBQUEsR0FBQSxDQUFBLE9BQUEsT0FBQSxPQUFBLFFBQUEsU0FBQSxNQUFBLEVBQUEsQ0FBQSxRQUFBLElBQUEsR0FBQSxPQUFBLE9BQUEseUJBQUEsTUFBQSxPQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsU0FBQSxNQUFBLElBQUEsS0FBQSxPQUFBLFlBQUEsU0FBQSxFQUFBLENBQUEsT0FBQSxtQkFBQSxPQUFBLEtBQUEsT0FBQSxRQUFBLFNBQUEsSUFBQSxDQUFBLElBQUEsTUFBQSxDQUFBLElBQUEsTUFBQSxVQUFBLE1BQUEsT0FBQSxrQkFBQSxPQUFBLGFBQUEsR0FBQSxPQUFBLE1BQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsTUFBQSxJQUFBLENBQUEsSUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsTUFBQSxFQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsTUFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxHQUFBLE9BQUEsVUFBQSxLQUFBLE1BQUEsR0FBQSxNQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsSUFBQSxFQUFBLElBQUEsYUFBQSxPQUFBLFVBQUEsRUFBQSxHQUFBLElBQUEsU0FBQSxJQUFBLFNBQUEsT0FBQSxhQUFBLFNBQUEsU0FBQSxPQUFBLE9BQUEsSUFBQSxhQUFBLE9BQUEsVUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLE9BQUEsUUFBQSxPQUFBLGFBQUEsTUFBQSxLQUFBLE9BQUEsU0FBQSxJQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxPQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsR0FBQSxPQUFBLElBQUEsS0FBQSxPQUFBLGFBQUEsS0FBQSxHQUFBLElBQUEsSUFBQSxJQUFBLENBQUEsSUFBQSxNQUFBLFVBQUEsS0FBQSxJQUFBLE1BQUEsT0FBQSxRQUFBLElBQUEsTUFBQSxPQUFBLFlBQUEsTUFBQSxPQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxHQUFBLE9BQUEsTUFBQSxFQUFBLEtBQUEsY0FBQSxHQUFBLE9BQUEsT0FBQSxFQUFBLEtBQUEsY0FBQSxPQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxNQUFBLEVBQUEsRUFBQSxDQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLE9BQUEsVUFBQSxLQUFBLE1BQUEsR0FBQSxHQUFBLE9BQUEsVUFBQSxLQUFBLE1BQUEsSUFBQSxJQUFBLEdBQUEsT0FBQSxTQUFBLFNBQUEsR0FBQSxDQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLE1BQUEsSUFBQSxDQUFBLElBQUEsS0FBQSxPQUFBLFNBQUEsRUFBQSxHQUFBLElBQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxJQUFBLEtBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxPQUFBLEtBQUEsT0FBQSwyQkFBQSxTQUFBLE1BQUEsQ0FBQSxJQUFBLElBQUEsWUFBQSxFQUFBLFVBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxhQUFBLFdBQUEsS0FBQSxNQUFBLE9BQUEsT0FBQSxhQUFBLE9BQUEsSUFBQSxNQUFBLGFBQUEsRUFBQSxFQUFBLFlBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxHQUFBLElBQUEsTUFBQSxhQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsWUFBQSxHQUFBLEtBQUEsT0FBQSxHQUFBLElBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsWUFBQSxHQUFBLEtBQUEsQ0FBQSxPQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFVBQUEsR0FBQSxLQUFBLENBQUEsSUFBQSxPQUFBLE1BQUEsVUFBQSxHQUFBLEdBQUEsQ0FBQSxXQUFBLEdBQUEsSUFBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLElBQUEsSUFBQSxLQUFBLE9BQUEsSUFBQSxJQUFBLEdBQUEsUUFBQSxPQUFBLE9BQUEsSUFBQSxJQUFBLEtBQUEsT0FBQSxJQUFBLElBQUEsR0FBQSxTQUFBLElBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxhQUFBLEdBQUEsRUFBQSxZQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsSUFBQSxNQUFBLGFBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxZQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLE9BQUEsSUFBQSxJQUFBLEtBQUEsTUFBQSxDQUFBLE9BQUEsSUFBQSxJQUFBLEdBQUEsT0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE9BQUEsUUFBQSxPQUFBLGtCQUFBLFNBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxPQUFBLE9BQUEsMkJBQUEsV0FBQSxZQUFBLE9BQUEsT0FBQSxVQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsYUFBQSxXQUFBLEtBQUEsTUFBQSxPQUFBLE9BQUEsYUFBQSxPQUFBLElBQUEsTUFBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLEdBQUEsRUFBQSxZQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxVQUFBLEdBQUEsS0FBQSxPQUFBLFVBQUEsR0FBQSxHQUFBLENBQUEsV0FBQSxHQUFBLElBQUEsT0FBQSxPQUFBLFVBQUEsVUFBQSxHQUFBLEdBQUEsQ0FBQSxXQUFBLEdBQUEsSUFBQSxPQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsQ0FBQSxFQUFBLENBQUE7SUFDQSxPQUFBLFFBQUEsT0FBQSxVQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxJQUFBLE1BQUEsT0FBQSxNQUFBLE9BQUEsUUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxNQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsT0FBQSxTQUFBLEVBQUEsR0FBQSxJQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsS0FBQSxPQUFBLEtBQUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxLQUFBLEdBQUEsQ0FBQSxJQUFBLEtBQUEsS0FBQSxNQUFBLENBQUEsSUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsS0FBQSxPQUFBLEVBQUEsS0FBQSxLQUFBLE9BQUEsS0FBQSxLQUFBLEtBQUEsS0FBQSxNQUFBLEtBQUEsT0FBQSxJQUFBLFNBQUEsRUFBQSxZQUFBLEdBQUEsbUJBQUEsRUFBQSxjQUFBLEVBQUEsT0FBQSxrQkFBQSxTQUFBLFNBQUEsQ0FBQSxTQUFBLFNBQUEsU0FBQSxTQUFBLENBQUEsT0FBQSxNQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsTUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLE1BQUEsTUFBQSxPQUFBLFNBQUEsY0FBQSxPQUFBLE9BQUEsT0FBQSxDQUFBLElBQUEsR0FBQSxPQUFBLEVBQUEsR0FBQSxPQUFBLEVBQUEsTUFBQSxDQUFBLE9BQUEsRUFBQSxLQUFBLE9BQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxFQUFBLEtBQUEsT0FBQSxFQUFBLElBQUEsSUFBQSxPQUFBLE9BQUEsT0FBQSxnQkFBQSxTQUFBLFNBQUEsR0FBQSxTQUFBLElBQUEsZUFBQSxTQUFBLFNBQUEsR0FBQSxTQUFBLElBQUEsZ0JBQUEsU0FBQSxTQUFBLEdBQUEsU0FBQSxJQUFBLEdBQUEsZ0JBQUEsaUJBQUEsZ0JBQUEsaUJBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLElBQUEsaUJBQUEsZ0JBQUEsaUJBQUEsaUJBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEtBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLElBQUEsY0FBQSxPQUFBLE9BQUEsUUFBQSxFQUFBLENBQUEsSUFBQSxLQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUE7QUNGQSxRQUFBLE9BQUE7R0FDQSxRQUFBLGVBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxPQUFBLFlBQUEsUUFBQSxTQUFBLFNBQUE7TUFDQSxJQUFBLGNBQUE7O01BRUEsU0FBQSxhQUFBLE1BQUEsSUFBQSxVQUFBOztRQUVBLEdBQUEsQ0FBQSxXQUFBLENBQUEsUUFBQSxPQUFBLEtBQUEsT0FBQSxLQUFBOztRQUVBLElBQUEsR0FBQTtVQUNBLEdBQUEsS0FBQTs7OztNQUlBLFNBQUEsYUFBQSxNQUFBLElBQUEsVUFBQTtRQUNBLEdBQUEsQ0FBQSxXQUFBLENBQUEsT0FBQSxHQUFBO1FBQ0EsSUFBQSxJQUFBO1VBQ0EsR0FBQTs7OztNQUlBLFlBQUEsb0JBQUEsU0FBQSxPQUFBLFVBQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsZUFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLEtBQUE7O2FBRUE7Ozs7O01BS0EsWUFBQSxpQkFBQSxTQUFBLE9BQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsZUFBQTtZQUNBLE9BQUE7O1dBRUEsS0FBQTs7YUFFQTs7Ozs7OztNQU9BLFlBQUEsU0FBQSxTQUFBLFVBQUE7O1FBRUEsUUFBQSxRQUFBO1FBQ0EsT0FBQSxHQUFBOzs7TUFHQSxZQUFBLFdBQUEsU0FBQSxPQUFBLFVBQUEsV0FBQSxXQUFBLFdBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSxrQkFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBO1lBQ0EsV0FBQTs7V0FFQSxLQUFBOzthQUVBOzs7OztNQUtBLFlBQUEsU0FBQSxTQUFBLE9BQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLElBQUEsa0JBQUE7V0FDQSxLQUFBOzs7OzthQUtBOzs7Ozs7O01BT0EsWUFBQSwwQkFBQSxTQUFBLFdBQUEsVUFBQTtRQUNBLE9BQUE7V0FDQSxLQUFBLHVCQUFBO1lBQ0EsSUFBQSxRQUFBOzs7O01BSUEsWUFBQSxpQkFBQSxTQUFBLE1BQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSxlQUFBO1lBQ0EsT0FBQTs7OztNQUlBLFlBQUEsZ0JBQUEsU0FBQSxPQUFBLE1BQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsd0JBQUE7WUFDQSxPQUFBO1lBQ0EsVUFBQTs7V0FFQSxLQUFBLFdBQUE7OztNQUdBLE9BQUE7Ozs7QUMvR0EsUUFBQSxPQUFBLE9BQUEsUUFBQSxvQkFBQTtJQUNBO0lBQ0EsU0FBQSxPQUFBO01BQ0EsSUFBQSxhQUFBO01BQ0EsSUFBQSxPQUFBLGFBQUE7O01BRUEsT0FBQTs7Ozs7UUFLQSxRQUFBLFNBQUEsT0FBQTtZQUNBLE9BQUEsTUFBQSxLQUFBLGFBQUEsV0FBQTtjQUNBLE9BQUE7Ozs7O1FBS0EsUUFBQSxTQUFBLElBQUEsT0FBQTtZQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxXQUFBO2NBQ0EsT0FBQTs7Ozs7UUFLQSxRQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O1FBR0EsS0FBQSxTQUFBLElBQUE7WUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOzs7UUFHQSxRQUFBLFdBQUE7WUFDQSxPQUFBLE1BQUEsSUFBQTs7O1FBR0EsV0FBQSxTQUFBLElBQUE7VUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUE7Ozs7Ozs7O0FDdENBLFFBQUEsT0FBQSxPQUFBLFFBQUEsb0JBQUE7SUFDQTtJQUNBLFNBQUEsT0FBQTtNQUNBLElBQUEsWUFBQTtNQUNBLElBQUEsT0FBQSxZQUFBOztNQUVBLE9BQUE7Ozs7O1FBS0EsWUFBQSxTQUFBLFVBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxZQUFBLGVBQUE7Y0FDQSxVQUFBOzs7O1FBSUEsUUFBQSxXQUFBO1lBQ0EsT0FBQSxNQUFBLElBQUE7OztRQUdBLGtCQUFBLFNBQUEsU0FBQSxTQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsWUFBQSxlQUFBO1lBQ0EsVUFBQTtZQUNBLFVBQUE7Ozs7Ozs7O0FDeEJBLFFBQUEsT0FBQTtHQUNBLFFBQUEsbUJBQUE7RUFDQTtFQUNBLFNBQUEsTUFBQTs7SUFFQSxJQUFBLE9BQUE7O0lBRUEsT0FBQTtNQUNBLG1CQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQTs7TUFFQSx5QkFBQSxTQUFBLE1BQUEsTUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsU0FBQTtVQUNBLFVBQUE7VUFDQSxXQUFBOzs7TUFHQSx3QkFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLGNBQUE7VUFDQSxNQUFBOzs7TUFHQSxpQkFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLGFBQUE7VUFDQSxNQUFBOzs7TUFHQSxzQkFBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7TUFFQSx5QkFBQSxTQUFBLE9BQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLGFBQUE7VUFDQSxRQUFBOzs7TUFHQSxvQkFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLFlBQUE7VUFDQSxNQUFBOzs7TUFHQSxzQkFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLGNBQUE7VUFDQSxNQUFBOzs7O01BSUEsa0JBQUEsU0FBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxjQUFBO1VBQ0EsWUFBQTs7OztNQUlBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsZ0JBQUE7VUFDQSxNQUFBOzs7TUFHQSxtQkFBQSxTQUFBLFlBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLFVBQUE7VUFDQSxhQUFBOzs7Ozs7OztBQzNEQSxRQUFBLE9BQUEsT0FBQSxRQUFBLG9CQUFBO0lBQ0E7SUFDQSxTQUFBLE9BQUE7TUFDQSxJQUFBLE1BQUE7TUFDQSxJQUFBLE9BQUEsTUFBQTs7O01BR0EsT0FBQTs7Ozs7UUFLQSxPQUFBLFNBQUEsV0FBQSxNQUFBLFFBQUEsV0FBQSxXQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsTUFBQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxTQUFBOzthQUVBLEtBQUE7O2VBRUE7Ozs7O1FBS0EsUUFBQSxXQUFBO1lBQ0EsT0FBQSxNQUFBLElBQUE7Ozs7Ozs7QUMxQkEsUUFBQSxPQUFBLE9BQUEsUUFBQSxlQUFBO0lBQ0E7SUFDQSxTQUFBLE9BQUE7TUFDQSxJQUFBLFFBQUE7TUFDQSxJQUFBLE9BQUEsUUFBQTs7TUFFQSxPQUFBOzs7OztRQUtBLFFBQUEsU0FBQSxVQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsUUFBQSxXQUFBO2NBQ0EsVUFBQTs7OztRQUlBLFFBQUEsV0FBQTtVQUNBLE9BQUEsTUFBQSxJQUFBOzs7UUFHQSxRQUFBLFNBQUEsSUFBQSxPQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLFdBQUE7WUFDQSxPQUFBOzs7O1FBSUEsTUFBQSxTQUFBLElBQUEsU0FBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7V0FDQSxLQUFBOzs7Ozs7OztRQVFBLFlBQUEsU0FBQSxJQUFBLE9BQUEsTUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7V0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7O1FBYUEsY0FBQSxTQUFBLElBQUEsUUFBQSxhQUFBO1VBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7UUFhQSxjQUFBLFNBQUEsSUFBQSxPQUFBLFFBQUE7VUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBO1dBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBcUJBLFFBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7UUFHQSxLQUFBLFNBQUEsSUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztRQUdBLGlCQUFBLFNBQUEsSUFBQSxRQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLG9CQUFBO1lBQ0EsUUFBQTs7OztRQUlBLGdCQUFBLFNBQUEsSUFBQSxRQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLG1CQUFBO1lBQ0EsUUFBQTs7OztRQUlBLGtCQUFBLFNBQUEsS0FBQSxlQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsUUFBQSxNQUFBLEVBQUEsTUFBQTtnQkFDQSxNQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsZUFBQSxnQkFBQSxnQkFBQTs7Ozs7Ozs7Ozs7QUNsSEEsUUFBQSxPQUFBLE9BQUEsUUFBQSxlQUFBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsT0FBQSxTQUFBO0lBQ0EsSUFBQSxRQUFBO0lBQ0EsSUFBQSxPQUFBLFFBQUE7O0lBRUEsT0FBQTs7OztNQUlBLGdCQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLFFBQUE7OztNQUdBLEtBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsUUFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUE7OztNQUdBLFNBQUEsU0FBQSxNQUFBLE1BQUEsS0FBQSxlQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsUUFBQSxNQUFBLEVBQUEsTUFBQTtjQUNBLE1BQUE7Y0FDQSxNQUFBLE9BQUEsT0FBQTtjQUNBLE1BQUEsT0FBQSxPQUFBO2NBQ0EsZUFBQSxnQkFBQSxnQkFBQTs7Ozs7O01BTUEsZUFBQSxTQUFBLElBQUEsU0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxZQUFBO1VBQ0EsU0FBQTs7OztNQUlBLG9CQUFBLFNBQUEsSUFBQSxjQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxLQUFBLFlBQUE7VUFDQSxjQUFBOzs7O01BSUEsV0FBQSxTQUFBLElBQUEsTUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxjQUFBO1VBQ0EsTUFBQTs7OztNQUlBLGtCQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7Ozs7OztNQU9BLFVBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLGNBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLFdBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOztNQUVBLFlBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOztNQUVBLGdCQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsZ0JBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxlQUFBLFNBQUEsS0FBQSxPQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLGlCQUFBLEtBQUEsVUFBQTs7O01BR0EsU0FBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLFVBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxZQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsV0FBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGFBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxZQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSxtQkFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsdUJBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLGdCQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSx1QkFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsUUFBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGtCQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSxrQkFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQTs7O01BR0Esc0JBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUE7OztNQUdBLGlCQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0Esd0JBQUEsU0FBQSxPQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxrQkFBQSxFQUFBLE9BQUE7Ozs7Ozs7OztBQ25KQSxRQUFBLE9BQUE7R0FDQSxXQUFBLHFCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsT0FBQSxXQUFBLGlCQUFBO01BQ0EsT0FBQSxvQkFBQSxVQUFBOztNQUVBLGlCQUFBLFVBQUEsVUFBQSxLQUFBLEtBQUEsS0FBQTs7OztNQUlBLE9BQUEsaUJBQUEsWUFBQSxFQUFBLE9BQUEsZUFBQSxDQUFBLE9BQUE7OztNQUdBLE9BQUEsa0JBQUEsVUFBQTtRQUNBO1dBQ0EsT0FBQSxPQUFBLGtCQUFBLEtBQUEsT0FBQTtXQUNBLEtBQUE7OzthQUdBOzs7Ozs7O0FDdEJBLFFBQUEsT0FBQSxPQUFBLFdBQUEsdUJBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsa0JBQUE7O0lBRUEsT0FBQSxhQUFBOzs7Ozs7SUFNQSxFQUFBLGNBQUE7OztJQUdBLFNBQUEsY0FBQTtNQUNBLGlCQUFBLFNBQUEsS0FBQTs7Ozs7SUFLQTs7SUFFQSxPQUFBLGNBQUEsU0FBQSxRQUFBLFdBQUE7O01BRUEsT0FBQTtNQUNBLE9BQUEsR0FBQSx1QkFBQTtRQUNBLElBQUEsVUFBQTs7OztJQUlBLE9BQUEsa0JBQUEsV0FBQTs7TUFFQSxLQUFBLDhCQUFBO1FBQ0EsU0FBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLFNBQUEsT0FBQSxLQUFBLFNBQUEsT0FBQSxLQUFBLENBQUEsTUFBQSxhQUFBLE9BQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxDQUFBLFNBQUEsU0FBQSxZQUFBLENBQUEsYUFBQSxvQ0FBQSxNQUFBOztPQUVBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF3Q0EsT0FBQSxrQkFBQSxTQUFBLFFBQUEsV0FBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxRQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztRQUdBLFlBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQSw2QkFBQSxVQUFBLFFBQUE7UUFDQSxPQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkdBLFFBQUEsT0FBQSxPQUFBLFdBQUEsaUJBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsYUFBQTtJQUNBLE9BQUEsUUFBQTtJQUNBLE9BQUEsUUFBQTs7Ozs7O0lBTUEsRUFBQSxjQUFBOzs7OztJQUtBLFlBQUEsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLGFBQUEsT0FBQSxPQUFBO0tBQ0EsS0FBQTs7OztJQUlBLE9BQUEsWUFBQSxXQUFBO01BQ0EsSUFBQSxnQkFBQSxPQUFBLE1BQUE7UUFDQTs7O01BR0EsSUFBQSxPQUFBLGNBQUEsa0JBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFVBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFdBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFVBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFdBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsVUFBQSxFQUFBLE1BQUEsS0FBQTs7TUFFQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7OztRQUdBLE1BQUE7UUFDQSxTQUFBLENBQUEsVUFBQTtRQUNBLFlBQUE7U0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0RBLFFBQUEsT0FBQSxPQUFBLFdBQUEsc0JBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsa0JBQUE7Ozs7OztJQU1BLEVBQUEsY0FBQTs7Ozs7O0lBTUEsT0FBQSxjQUFBLFVBQUE7O01BRUEsSUFBQSxPQUFBLFFBQUEsT0FBQSxNQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUEsQ0FBQSxVQUFBO1VBQ0EsWUFBQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7OztXQWVBO1FBQ0EsS0FBQSxVQUFBLDRCQUFBOzs7Ozs7Ozs7QUMxQ0EsUUFBQSxPQUFBO0dBQ0EsV0FBQSxxQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxNQUFBLGdCQUFBOztNQUVBLE9BQUEsV0FBQTtNQUNBO1NBQ0E7U0FDQSxLQUFBOzs7O01BSUEsU0FBQSxlQUFBLFNBQUE7UUFDQSxPQUFBLFVBQUE7O1FBRUEsU0FBQSxXQUFBLElBQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxZQUFBLElBQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxjQUFBLElBQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxZQUFBLElBQUEsS0FBQSxTQUFBOztRQUVBLE9BQUEsV0FBQTs7Ozs7TUFLQSxPQUFBLG9CQUFBLFlBQUE7UUFDQTtXQUNBLGtCQUFBLE9BQUEsU0FBQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7O01BV0E7U0FDQTtTQUNBLEtBQUE7Ozs7UUFJQSxPQUFBLGtCQUFBLFVBQUE7VUFDQTthQUNBLHdCQUFBLE9BQUEsVUFBQSxRQUFBLE1BQUEsSUFBQSxNQUFBO2FBQ0EsS0FBQTs7Ozs7Ozs7TUFRQSxPQUFBLGFBQUEsU0FBQSxLQUFBO1FBQ0EsSUFBQSxDQUFBLEtBQUE7VUFDQSxPQUFBOzs7O1FBSUEsT0FBQSxPQUFBLE1BQUEsT0FBQTtVQUNBLE1BQUEsS0FBQSxlQUFBLE1BQUEsS0FBQTs7OztNQUlBLFNBQUEsVUFBQSxLQUFBO1FBQ0EsT0FBQSxJQUFBO1VBQ0EsS0FBQTtVQUNBLEtBQUE7VUFDQSxLQUFBO1VBQ0EsS0FBQTtVQUNBLEtBQUE7Ozs7TUFJQSxPQUFBLDBCQUFBLFVBQUE7O1FBRUEsSUFBQSxPQUFBLFVBQUEsT0FBQSxTQUFBLFVBQUE7UUFDQSxJQUFBLFFBQUEsVUFBQSxPQUFBLFNBQUEsV0FBQTs7UUFFQSxJQUFBLE9BQUEsS0FBQSxRQUFBLEtBQUEsU0FBQSxhQUFBLFVBQUEsVUFBQTtVQUNBLE9BQUEsS0FBQSxXQUFBLGtDQUFBOztRQUVBLElBQUEsUUFBQSxNQUFBO1VBQ0EsS0FBQSxXQUFBLDZDQUFBO1VBQ0E7OztRQUdBO1dBQ0Esd0JBQUEsTUFBQTtXQUNBLEtBQUE7Ozs7Ozs7O01BUUEsT0FBQSx5QkFBQSxVQUFBO1FBQ0EsSUFBQSxZQUFBLFVBQUEsT0FBQSxTQUFBLGFBQUE7O1FBRUE7V0FDQSx1QkFBQTtXQUNBLEtBQUE7Ozs7Ozs7O01BUUEsT0FBQSxrQkFBQSxVQUFBO1FBQ0EsSUFBQSxVQUFBLFVBQUEsT0FBQSxTQUFBLFdBQUE7O1FBRUE7V0FDQSxnQkFBQTtXQUNBLEtBQUE7Ozs7Ozs7OztNQVNBLElBQUEsWUFBQSxJQUFBLFNBQUE7O01BRUEsT0FBQSxrQkFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUE7OztNQUdBLE9BQUEscUJBQUEsVUFBQTtRQUNBLElBQUEsT0FBQSxPQUFBLFNBQUE7UUFDQTtXQUNBLG1CQUFBO1dBQ0EsS0FBQTs7Ozs7O01BTUEsT0FBQSxtQkFBQSxVQUFBO1FBQ0EsSUFBQSxhQUFBLE9BQUEsU0FBQTtRQUNBO1dBQ0EsaUJBQUE7V0FDQSxLQUFBOzs7Ozs7O01BT0EsT0FBQSx1QkFBQSxVQUFBO1FBQ0EsSUFBQSxPQUFBLE9BQUEsU0FBQTtRQUNBO1dBQ0EscUJBQUE7V0FDQSxLQUFBOzs7Ozs7TUFNQSxPQUFBLHlCQUFBLFVBQUE7UUFDQSxJQUFBLE9BQUEsT0FBQSxTQUFBO1FBQ0E7V0FDQSx1QkFBQTtXQUNBLEtBQUE7Ozs7Ozs7O0FDMUtBLFFBQUEsT0FBQTtHQUNBLFdBQUEsZ0JBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxPQUFBLE1BQUEsWUFBQTtNQUNBLE9BQUEsZUFBQSxLQUFBOzs7TUFHQTs7TUFFQSxTQUFBLGlCQUFBOztRQUVBO1dBQ0EsSUFBQTtXQUNBLEtBQUEsU0FBQSxJQUFBO1lBQ0EsSUFBQSxVQUFBLElBQUE7WUFDQSxJQUFBLFFBQUEsT0FBQSxhQUFBLE1BQUEsTUFBQSxLQUFBOztZQUVBLElBQUEsUUFBQSxPQUFBO2NBQ0EsT0FBQSxhQUFBLFFBQUEsU0FBQSxRQUFBLE9BQUE7Y0FDQSxPQUFBLG1CQUFBOzs7Ozs7O01BT0EsT0FBQSxnQkFBQSxVQUFBO1FBQ0E7V0FDQSxjQUFBLE9BQUEsYUFBQSxLQUFBLE9BQUEsYUFBQTtXQUNBLEtBQUE7OzthQUdBOzs7Ozs7TUFNQSxPQUFBLHFCQUFBLFVBQUE7UUFDQTtXQUNBLG1CQUFBLE9BQUEsYUFBQSxLQUFBLE9BQUEsYUFBQTtXQUNBLEtBQUE7OzthQUdBOzs7Ozs7TUFNQSxPQUFBLGdCQUFBLFVBQUE7O1FBRUE7V0FDQSxVQUFBLE9BQUEsYUFBQSxLQUFBLE9BQUE7V0FDQSxLQUFBOzs7YUFHQTs7Ozs7Ozs7Ozs7QUM1REEsUUFBQSxPQUFBLE9BQUEsV0FBQSxrQkFBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxTQUFBLFFBQUEsUUFBQSxjQUFBLGFBQUEsYUFBQTtJQUNBLE9BQUEsUUFBQTtJQUNBLE9BQUEsUUFBQTs7Ozs7O0lBTUEsRUFBQSxjQUFBOztJQUVBLE9BQUEsZUFBQTtJQUNBLE9BQUEsYUFBQSxXQUFBLGlCQUFBO01BQ0EsUUFBQTtNQUNBLGNBQUE7UUFDQSxxQkFBQTs7TUFFQSxTQUFBOzs7SUFHQSxTQUFBLFdBQUEsTUFBQTtNQUNBLE9BQUEsUUFBQSxLQUFBO01BQ0EsT0FBQSxjQUFBLEtBQUE7TUFDQSxPQUFBLFdBQUEsS0FBQTs7TUFFQSxJQUFBLElBQUE7TUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxZQUFBLEtBQUE7UUFDQSxFQUFBLEtBQUE7O01BRUEsT0FBQSxRQUFBOzs7SUFHQSxZQUFBLFFBQUEsYUFBQSxNQUFBLGFBQUEsTUFBQSxhQUFBLE9BQUEsT0FBQTtLQUNBLEtBQUE7Ozs7O0lBS0EsT0FBQSxPQUFBLGFBQUEsU0FBQSxXQUFBO01BQ0EsWUFBQSxRQUFBLGFBQUEsTUFBQSxhQUFBLE1BQUEsV0FBQSxPQUFBLGVBQUE7UUFDQTs7Ozs7OztJQU9BLE9BQUEsb0JBQUEsWUFBQTtNQUNBO1NBQ0EsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLE9BQUEsV0FBQSxPQUFBLGVBQUE7VUFDQTs7Ozs7O0lBTUEsT0FBQSxXQUFBLFNBQUEsTUFBQTtNQUNBLE9BQUEsR0FBQSxtQkFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBLGFBQUEsUUFBQTs7OztJQUlBLE9BQUEsU0FBQSxTQUFBLFFBQUEsTUFBQTtNQUNBLE9BQUE7O01BRUEsT0FBQSxHQUFBLGtCQUFBO1FBQ0EsSUFBQSxLQUFBOzs7OztJQUtBLE9BQUEsYUFBQSxTQUFBLFFBQUEsTUFBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxRQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztRQUdBLFlBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQSw2QkFBQSxLQUFBLFFBQUEsT0FBQTtRQUNBLE9BQUE7U0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE2Q0EsT0FBQSxjQUFBLFNBQUEsUUFBQSxNQUFBLE9BQUE7TUFDQSxPQUFBO01BQ0EsS0FBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFFBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1FBR0EsWUFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBLDZCQUFBLEtBQUEsUUFBQSxPQUFBO1FBQ0EsT0FBQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBK0NBLE9BQUEsYUFBQSxTQUFBLFFBQUEsTUFBQSxPQUFBO01BQ0EsT0FBQTs7O01BR0EsS0FBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFFBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1FBR0EsWUFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBLDZCQUFBLEtBQUEsUUFBQSxPQUFBO1FBQ0EsT0FBQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNENBLE9BQUEsdUJBQUEsV0FBQTtNQUNBLE1BQUEscUJBQUEsT0FBQSxNQUFBO1FBQ0E7OztNQUdBLElBQUEsVUFBQSxFQUFBLE1BQUEsS0FBQTs7TUFFQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7OztRQUdBLE1BQUE7UUFDQSxTQUFBLENBQUEsVUFBQTtRQUNBLFlBQUE7U0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBc0JBLE9BQUEsc0JBQUEsV0FBQTtNQUNBLE1BQUEscUJBQUEsT0FBQSxNQUFBO1FBQ0E7OztNQUdBLElBQUEsVUFBQSxFQUFBLE1BQUEsS0FBQTs7TUFFQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7OztRQUdBLE1BQUE7UUFDQSxTQUFBLENBQUEsVUFBQTtRQUNBLFlBQUE7U0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQkEsT0FBQSxjQUFBLFVBQUE7TUFDQSxJQUFBLFVBQUEsQ0FBQSxNQUFBLFVBQUEsWUFBQTtNQUNBLElBQUEsT0FBQTtNQUNBLFlBQUEsU0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTRDQSxPQUFBLGNBQUEsU0FBQSxRQUFBLE1BQUEsT0FBQTtNQUNBLE9BQUE7O01BRUEsSUFBQSxDQUFBLEtBQUEsT0FBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQSx3QkFBQSxLQUFBLFFBQUEsT0FBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsTUFBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7O2FBV0E7UUFDQSxZQUFBLFlBQUEsS0FBQSxLQUFBLEtBQUE7Ozs7Ozs7O0lBUUEsU0FBQSxXQUFBLE1BQUE7TUFDQSxJQUFBLE1BQUE7UUFDQSxPQUFBLE9BQUEsTUFBQSxPQUFBOzs7O0lBSUEsT0FBQSxXQUFBLFNBQUEsTUFBQTtNQUNBLElBQUEsS0FBQSxPQUFBO1FBQ0EsT0FBQTs7TUFFQSxJQUFBLEtBQUEsT0FBQSxXQUFBO1FBQ0EsT0FBQTs7TUFFQSxJQUFBLEtBQUEsT0FBQSxZQUFBLENBQUEsS0FBQSxPQUFBLFdBQUE7UUFDQSxPQUFBOzs7O0lBSUEsU0FBQSxXQUFBLE1BQUE7TUFDQSxPQUFBLGVBQUE7TUFDQSxPQUFBLGFBQUEsV0FBQSxpQkFBQTtNQUNBLEVBQUEsb0JBQUEsTUFBQTs7O0lBR0EsU0FBQSxpQkFBQSxNQUFBO01BQ0EsT0FBQTtRQUNBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLFdBQUEsS0FBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLFdBQUEsS0FBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGNBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxXQUFBLEtBQUEsT0FBQSxnQkFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUE7Ozs7UUFJQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxLQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7Ozs7UUFJQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Y0FDQSxNQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxhQUFBOztZQUVBO2NBQ0EsS0FBQTtjQUNBLE9BQUEsS0FBQSxhQUFBOzs7O1FBSUE7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxhQUFBOzs7Ozs7O0lBT0EsU0FBQSxZQUFBO01BQ0EsS0FBQSxZQUFBLHdCQUFBO01BQ0EsT0FBQTs7O0lBR0EsU0FBQSxRQUFBLEtBQUE7TUFDQSxLQUFBLGNBQUEsS0FBQSxTQUFBOzs7SUFHQSxPQUFBLGVBQUEsVUFBQTs7TUFFQSxLQUFBLDhCQUFBO1FBQ0EsU0FBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLFNBQUEsT0FBQSxLQUFBLFNBQUEsT0FBQSxLQUFBLENBQUEsTUFBQSxTQUFBLE9BQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxDQUFBLFNBQUEsU0FBQSxZQUFBLENBQUEsYUFBQSxvQkFBQSxNQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7SUFRQSxPQUFBLGFBQUE7OztBQ3hsQkEsUUFBQSxPQUFBLFFBQUEsT0FBQSxDQUFBLG1CQUFBLFVBQUEsaUJBQUE7O0VBRUEsZ0JBQUEsV0FBQTtJQUNBLGFBQUEsQ0FBQSxXQUFBLFdBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQTtJQUNBLFlBQUE7OztDQUdBLFdBQUEsaUJBQUE7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLFlBQUE7O01BRUE7U0FDQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQStHQTtTQUNBO1NBQ0EsS0FBQTs7Ozs7TUFLQSxPQUFBLFVBQUEsU0FBQSxLQUFBO1FBQ0EsT0FBQSxPQUFBLE1BQUE7Ozs7TUFJQSxNQUFBLFNBQUEsT0FBQSxTQUFBO1FBQ0E7VUFDQSxpQkFBQTtVQUNBLHNCQUFBO1VBQ0EsMkJBQUE7VUFDQSxhQUFBO1VBQ0Esa0JBQUE7VUFDQSx1QkFBQTs7Ozs7TUFLQSxPQUFBLG1CQUFBLFVBQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0Esa0JBQUE7VUFDQSxvQkFBQTtVQUNBLG1CQUFBO1VBQ0EsZ0JBQUE7YUFDQSxVQUFBO1lBQ0E7ZUFDQTtlQUNBLEtBQUEsVUFBQTtnQkFDQSxXQUFBOzs7OztNQUtBLE9BQUEsbUJBQUEsVUFBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxrQkFBQTtVQUNBLG9CQUFBO1VBQ0EsbUJBQUE7VUFDQSxnQkFBQTthQUNBLFVBQUE7WUFDQTtlQUNBO2VBQ0EsS0FBQSxVQUFBO2dCQUNBLFdBQUE7Ozs7O01BS0EsT0FBQSx1QkFBQSxVQUFBO1FBQ0E7V0FDQTtXQUNBLFFBQUEsU0FBQSxPQUFBO1lBQ0EsS0FBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsTUFBQTtjQUNBLGtCQUFBO2NBQ0Esb0JBQUE7Y0FDQSxtQkFBQTtjQUNBLGdCQUFBO2lCQUNBLFVBQUE7O2dCQUVBO21CQUNBO21CQUNBLEtBQUEsVUFBQTtvQkFDQSxXQUFBOzs7Ozs7TUFNQSxPQUFBLGFBQUEsV0FBQTtRQUNBO1dBQ0E7V0FDQSxRQUFBLFNBQUEsT0FBQTtZQUNBLEtBQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLE1BQUE7Y0FDQSxrQkFBQTtjQUNBLG9CQUFBO2NBQ0EsbUJBQUE7Y0FDQSxnQkFBQTtpQkFDQSxVQUFBOztnQkFFQTttQkFDQTttQkFDQSxLQUFBLFVBQUE7b0JBQ0EsV0FBQTs7Ozs7O01BTUEsT0FBQSxpQkFBQSxXQUFBO1FBQ0E7V0FDQTtXQUNBLFFBQUEsU0FBQSxPQUFBO1lBQ0EsS0FBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsTUFBQTtjQUNBLGtCQUFBO2NBQ0Esb0JBQUE7Y0FDQSxtQkFBQTtjQUNBLGdCQUFBO2lCQUNBLFVBQUE7O2dCQUVBO21CQUNBO21CQUNBLEtBQUEsVUFBQTtvQkFDQSxXQUFBOzs7Ozs7Ozs7OztBQ3hQQSxRQUFBLE9BQUE7R0FDQSxRQUFBLFlBQUEsV0FBQTtHQUNBLFdBQUEsWUFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsV0FBQTs7TUFFQSxPQUFBLGFBQUE7Ozs7QUNQQSxRQUFBLE9BQUE7R0FDQSxXQUFBLG1CQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsVUFBQSxRQUFBLFlBQUEsUUFBQSxPQUFBLGFBQUEsVUFBQSxTQUFBLGFBQUEsa0JBQUE7OztNQUdBLE9BQUEsT0FBQSxZQUFBOzs7TUFHQSxPQUFBLGVBQUEsT0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLE1BQUEsU0FBQSxLQUFBOzs7TUFHQSxJQUFBLE9BQUEsY0FBQTtRQUNBLE9BQUEsS0FBQSxRQUFBLFFBQUE7Ozs7TUFJQTtNQUNBOztNQUVBO01BQ0E7O01BRUEsT0FBQSxjQUFBLEtBQUEsUUFBQSxTQUFBLEtBQUE7O01BRUEsU0FBQSxrQkFBQTtRQUNBO1dBQ0EsSUFBQTtXQUNBLEtBQUEsVUFBQSxLQUFBO1lBQ0EsSUFBQSxVQUFBLElBQUE7WUFDQSxJQUFBLFFBQUEsT0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBOztZQUVBLElBQUEsUUFBQSxRQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUEsU0FBQSxRQUFBLE9BQUE7Y0FDQSxPQUFBLG1CQUFBOzs7O1FBSUE7V0FDQSxJQUFBO1dBQ0EsS0FBQSxVQUFBLEtBQUE7WUFDQSxPQUFBLFVBQUEsSUFBQSxLQUFBLE1BQUE7WUFDQSxPQUFBLFFBQUEsS0FBQTs7WUFFQSxJQUFBLFVBQUE7O1lBRUEsS0FBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLFFBQUEsUUFBQSxLQUFBO2NBQ0EsT0FBQSxRQUFBLEtBQUEsT0FBQSxRQUFBLEdBQUE7Y0FDQSxRQUFBLEtBQUEsRUFBQSxPQUFBLE9BQUEsUUFBQTs7O1lBR0EsRUFBQTtlQUNBLE9BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxPQUFBO2dCQUNBLFVBQUEsVUFBQSxRQUFBLFVBQUE7a0JBQ0EsT0FBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLE1BQUE7Ozs7Ozs7TUFPQSxTQUFBLGtCQUFBO1FBQ0E7V0FDQSxJQUFBO1dBQ0EsS0FBQSxVQUFBLEtBQUE7WUFDQSxPQUFBLFVBQUEsSUFBQSxLQUFBLE1BQUE7WUFDQSxPQUFBLFFBQUEsS0FBQTs7WUFFQSxJQUFBLFVBQUE7O1lBRUEsS0FBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLFFBQUEsUUFBQSxLQUFBO2NBQ0EsT0FBQSxRQUFBLEtBQUEsT0FBQSxRQUFBLEdBQUE7Y0FDQSxRQUFBLEtBQUEsRUFBQSxPQUFBLE9BQUEsUUFBQTs7O1lBR0EsRUFBQTtlQUNBLE9BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxPQUFBO2dCQUNBLFVBQUEsVUFBQSxRQUFBLFVBQUE7a0JBQ0EsT0FBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLE1BQUE7Ozs7Ozs7TUFPQSxTQUFBLGdCQUFBO1FBQ0E7V0FDQSxJQUFBO1dBQ0EsS0FBQSxVQUFBLEtBQUE7WUFDQSxPQUFBLFFBQUEsSUFBQSxLQUFBLE1BQUE7WUFDQSxPQUFBLE1BQUEsS0FBQTs7WUFFQSxJQUFBLFVBQUE7O1lBRUEsS0FBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLE1BQUEsUUFBQSxLQUFBO2NBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxNQUFBLEdBQUE7Y0FDQSxRQUFBLEtBQUEsRUFBQSxPQUFBLE9BQUEsTUFBQTs7O1lBR0EsRUFBQTtlQUNBLE9BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxPQUFBO2dCQUNBLFVBQUEsVUFBQSxRQUFBLFVBQUE7a0JBQ0EsT0FBQSxPQUFBLE9BQUEsTUFBQTs7OztRQUlBLElBQUEsT0FBQSxLQUFBLFFBQUEsVUFBQSxXQUFBO1VBQ0EsT0FBQSxhQUFBLE9BQUEsS0FBQSxRQUFBLE9BQUEsTUFBQSxLQUFBO1VBQ0EsT0FBQSxPQUFBLE9BQUEsS0FBQSxRQUFBLE9BQUEsTUFBQSxLQUFBOzs7OztNQUtBLFNBQUEsaUJBQUEsT0FBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLE9BQUE7Ozs7O01BS0EsU0FBQSxzQkFBQTtRQUNBLGlCQUFBLFNBQUEsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bd0JBLFNBQUEsWUFBQSxHQUFBOzs7UUFHQSxJQUFBLFdBQUE7UUFDQSxJQUFBLFlBQUEsS0FBQSxPQUFBLGtCQUFBLEVBQUEsV0FBQTs7O1FBR0EsSUFBQSxPQUFBLGNBQUEsS0FBQSxFQUFBLE9BQUEsS0FBQSxRQUFBLFNBQUEsT0FBQTthQUNBLEVBQUEsT0FBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLGFBQUEsTUFBQSxPQUFBOztRQUVBO1dBQ0EsY0FBQSxRQUFBLGFBQUEsT0FBQSxLQUFBO1dBQ0EsS0FBQTs7Ozs7YUFLQTs7Ozs7O01BTUEsU0FBQSxVQUFBO1FBQ0EsT0FBQSxDQUFBLE9BQUEsS0FBQSxRQUFBOzs7TUFHQSxTQUFBLG1CQUFBO1FBQ0EsT0FBQSxTQUFBLEtBQUE7OztNQUdBLFNBQUEsbUJBQUE7O1FBRUEsSUFBQSxhQUFBLENBQUEsb0JBQUE7VUFDQSxPQUFBOztRQUVBLE9BQUE7OztNQUdBLFNBQUEsYUFBQTs7UUFFQSxFQUFBLEdBQUEsS0FBQSxTQUFBLE1BQUEsY0FBQSxVQUFBLE9BQUE7VUFDQSxPQUFBOzs7O1FBSUEsRUFBQSxZQUFBLEtBQUE7VUFDQSxJQUFBO1VBQ0EsUUFBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsUUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLFFBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxNQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsUUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLG1CQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsT0FBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLE9BQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxhQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsT0FBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLFVBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxVQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsUUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLFlBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxRQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7Ozs7OztNQVFBLE9BQUEsYUFBQSxZQUFBO1FBQ0EsSUFBQSxFQUFBLFlBQUEsS0FBQSxhQUFBOztVQUVBO2VBQ0E7VUFDQSxLQUFBLFVBQUEsbUNBQUE7Ozs7O0FDaFdBLFFBQUEsT0FBQTtHQUNBLFdBQUEsYUFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsWUFBQTtNQUNBLE9BQUEsVUFBQTs7QUNMQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGtCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLFlBQUEsUUFBQSxPQUFBLGFBQUEsU0FBQSxrQkFBQSxhQUFBLGtCQUFBOzs7TUFHQSxpQkFBQSxTQUFBLEtBQUE7Ozs7OztNQU1BLGlCQUFBLFNBQUEsS0FBQTs7Ozs7O01BTUEsU0FBQSxVQUFBLFdBQUE7UUFDQSxLQUFBLFlBQUEseUNBQUEsVUFBQSxRQUFBLFlBQUE7UUFDQSxPQUFBOzs7O01BSUEsU0FBQSxRQUFBLEtBQUE7UUFDQSxLQUFBLGNBQUEsS0FBQSxTQUFBOzs7O01BSUEsT0FBQSxpQkFBQSxTQUFBLFVBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxRQUFBO1VBQ0EsaUJBQUEsTUFBQSxVQUFBLFlBQUEsT0FBQSxVQUFBO2FBQ0E7VUFDQSxpQkFBQSxNQUFBLFVBQUEsWUFBQSxPQUFBOzs7Ozs7TUFNQSxPQUFBLGdCQUFBLFNBQUEsV0FBQTs7UUFFQSxpQkFBQSxJQUFBLFVBQUEsS0FBQSxLQUFBOzs7Ozs7Ozs7O01BVUEsaUJBQUEsU0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUE4QkEsT0FBQSxXQUFBLFNBQUEsTUFBQTs7UUFFQSxJQUFBLEtBQUEsSUFBQSxZQUFBLEtBQUEsS0FBQTtVQUNBLE9BQUE7Ozs7Ozs7O0FDNUZBLFFBQUEsT0FBQTtDQUNBLFdBQUEsZUFBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBQSxRQUFBLFFBQUEsY0FBQSxZQUFBO0lBQ0EsRUFBQSxXQUFBLGFBQUEsU0FBQSxPQUFBOzs7VUFHQSxZQUFBLElBQUEsUUFBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQStDQSxTQUFBLE1BQUE7U0FDQSxTQUFBLFdBQUE7Ozs7SUFJQSxPQUFBLFFBQUE7SUFDQSxPQUFBLFFBQUE7SUFDQSxPQUFBLFNBQUE7SUFDQSxPQUFBLFVBQUE7O0lBRUEsT0FBQSxTQUFBLG1CQUFBLGFBQUE7SUFDQSxPQUFBLE9BQUEsT0FBQSxhQUFBLFNBQUE7O0lBRUEsU0FBQSxtQkFBQSxNQUFBO01BQ0EsSUFBQSxNQUFBO01BQ0EsSUFBQSxDQUFBLE1BQUEsT0FBQTtNQUNBLEtBQUEsTUFBQSxLQUFBLFFBQUEsU0FBQSxFQUFBLENBQUEsSUFBQSxHQUFBO01BQ0EsT0FBQSxDQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7OztJQUdBLFNBQUEsaUJBQUEsU0FBQTtNQUNBLElBQUEsTUFBQTtNQUNBLEtBQUEsSUFBQSxLQUFBLFNBQUEsQ0FBQSxHQUFBLE9BQUEsUUFBQSxNQUFBLFdBQUEsUUFBQSxJQUFBLE9BQUEsRUFBQTtNQUNBLE9BQUEsQ0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLElBQUEsT0FBQSxFQUFBLElBQUEsT0FBQTs7Ozs7OztJQU9BLEVBQUEsY0FBQTs7SUFFQSxPQUFBLGVBQUE7SUFDQSxPQUFBLGFBQUEsV0FBQSxpQkFBQTtNQUNBLFFBQUE7TUFDQSxjQUFBO1FBQ0EscUJBQUE7O01BRUEsU0FBQTs7O0lBR0EsU0FBQSxXQUFBLE1BQUE7TUFDQSxPQUFBLFFBQUEsS0FBQTtNQUNBLE9BQUEsY0FBQSxLQUFBO01BQ0EsT0FBQSxXQUFBLEtBQUE7O01BRUEsSUFBQSxJQUFBO01BQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsWUFBQSxLQUFBO1FBQ0EsRUFBQSxLQUFBOztNQUVBLE9BQUEsUUFBQTs7O0lBR0EsWUFBQSxRQUFBLGFBQUEsTUFBQSxhQUFBLE1BQUEsYUFBQSxPQUFBLE9BQUE7S0FDQSxLQUFBOzs7OztJQUtBLE9BQUEsT0FBQSxhQUFBLFNBQUEsV0FBQTtNQUNBLFlBQUEsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLFdBQUEsT0FBQSxlQUFBO1FBQ0E7Ozs7Ozs7SUFPQSxPQUFBLG9CQUFBLFlBQUE7TUFDQTtTQUNBLFFBQUEsYUFBQSxNQUFBLGFBQUEsTUFBQSxPQUFBLFdBQUEsT0FBQSxlQUFBO1VBQ0E7Ozs7OztJQU1BLE9BQUEsV0FBQSxTQUFBLE1BQUE7TUFDQSxPQUFBLEdBQUEsbUJBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQSxhQUFBLFFBQUE7Ozs7SUFJQSxPQUFBLFVBQUEsU0FBQSxRQUFBLE1BQUEsT0FBQTtNQUNBLE9BQUE7O01BRUEsSUFBQSxDQUFBLEtBQUEsT0FBQSxXQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBLCtCQUFBLEtBQUEsUUFBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7O2FBZUE7UUFDQTtVQUNBO1VBQ0EsS0FBQSxRQUFBLE9BQUEsNkJBQUEsV0FBQSxLQUFBLE9BQUE7VUFDQTs7Ozs7SUFLQSxTQUFBLFdBQUEsTUFBQTtNQUNBLElBQUEsTUFBQTtRQUNBLE9BQUEsT0FBQSxNQUFBLE9BQUE7Ozs7SUFJQSxPQUFBLFdBQUEsU0FBQSxNQUFBO01BQ0EsSUFBQSxLQUFBLE9BQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFdBQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFlBQUEsQ0FBQSxLQUFBLE9BQUEsV0FBQTtRQUNBLE9BQUE7Ozs7SUFJQSxTQUFBLFdBQUEsTUFBQTtNQUNBLE9BQUEsZUFBQTtNQUNBLE9BQUEsYUFBQSxXQUFBLGlCQUFBO01BQ0EsRUFBQSxvQkFBQSxNQUFBOzs7SUFHQSxTQUFBLGlCQUFBLE1BQUE7TUFDQSxPQUFBO1FBQ0E7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBLE9BQUEsY0FBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGdCQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTtjQUNBLE1BQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7UUFJQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7OztJQU1BLE9BQUEsYUFBQTs7QUM1VEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxvQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxZQUFBLFFBQUEsYUFBQSxPQUFBLFlBQUE7OztNQUdBLElBQUEsT0FBQSxZQUFBO01BQ0EsT0FBQSxPQUFBOztNQUVBLE9BQUEsbUJBQUEsS0FBQSxRQUFBLEtBQUEsT0FBQTs7TUFFQSxPQUFBLGFBQUEsTUFBQTs7TUFFQTs7TUFFQSxPQUFBLFdBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxRQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUE7Ozs7O01BS0EsSUFBQSxzQkFBQTtRQUNBLGNBQUE7UUFDQSxTQUFBO1FBQ0EsU0FBQTtRQUNBLFVBQUE7UUFDQSxlQUFBOzs7TUFHQSxJQUFBLEtBQUEsYUFBQSxvQkFBQTtRQUNBLEtBQUEsYUFBQSxvQkFBQSxRQUFBLFNBQUEsWUFBQTtVQUNBLElBQUEsZUFBQSxvQkFBQTtZQUNBLG9CQUFBLGVBQUE7Ozs7O01BS0EsT0FBQSxzQkFBQTs7OztNQUlBLFNBQUEsWUFBQSxFQUFBO1FBQ0EsSUFBQSxlQUFBLE9BQUEsS0FBQTs7UUFFQSxJQUFBLE1BQUE7UUFDQSxPQUFBLEtBQUEsT0FBQSxxQkFBQSxRQUFBLFNBQUEsSUFBQTtVQUNBLElBQUEsT0FBQSxvQkFBQSxLQUFBO1lBQ0EsSUFBQSxLQUFBOzs7UUFHQSxhQUFBLHNCQUFBOztRQUVBO1dBQ0EsbUJBQUEsS0FBQSxLQUFBO1dBQ0EsS0FBQTs7OzthQUlBOzs7OztNQUtBLFNBQUEsWUFBQTs7UUFFQSxFQUFBLFlBQUEsS0FBQTtVQUNBLFFBQUE7WUFDQSxPQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsT0FBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLHdCQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsZ0JBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7Ozs7O01BUUEsT0FBQSxhQUFBLFVBQUE7UUFDQSxJQUFBLEVBQUEsWUFBQSxLQUFBLFlBQUE7VUFDQTtlQUNBO1VBQ0EsS0FBQSxVQUFBLG1DQUFBOzs7Ozs7QUNuSEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxpQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxZQUFBLFFBQUEsTUFBQSxhQUFBLFVBQUEsT0FBQSxhQUFBLGFBQUEsWUFBQSxVQUFBO01BQ0EsSUFBQSxXQUFBLFNBQUE7TUFDQSxJQUFBLE9BQUEsWUFBQTtNQUNBLE9BQUEsT0FBQTtNQUNBLE9BQUEsWUFBQSxNQUFBLFdBQUEsU0FBQTtNQUNBLE9BQUEsY0FBQSxNQUFBLFdBQUEsU0FBQTs7TUFFQSxPQUFBLFlBQUE7O01BRUEsS0FBQSxJQUFBLE9BQUEsT0FBQSxXQUFBO1FBQ0EsSUFBQSxPQUFBLFVBQUEsS0FBQSxTQUFBLG1CQUFBO1VBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxrQkFBQSxNQUFBLFdBQUEsU0FBQTs7UUFFQSxJQUFBLE9BQUEsVUFBQSxLQUFBLFNBQUEsdUJBQUE7VUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLHNCQUFBLE1BQUEsV0FBQSxLQUFBLE9BQUE7Ozs7O01BS0EsSUFBQSxZQUFBLE9BQUEsWUFBQSxNQUFBLFVBQUE7OztNQUdBLElBQUEsbUJBQUEsT0FBQSxtQkFBQSxNQUFBLFFBQUEsS0FBQSxPQUFBOztNQUVBLE9BQUEsWUFBQSxTQUFBLE9BQUE7UUFDQSxJQUFBLE9BQUEsT0FBQTtRQUNBLFFBQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBLEtBQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxhQUFBLEtBQUEsWUFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLGFBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQSxhQUFBLENBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQSxhQUFBLEtBQUEsT0FBQSxvQkFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLENBQUE7Y0FDQSxLQUFBLE9BQUE7Y0FDQSxDQUFBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUE7Y0FDQSxLQUFBLE9BQUE7Y0FDQSxDQUFBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsS0FBQSxPQUFBLFlBQUEsS0FBQSxPQUFBLGFBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxLQUFBLE9BQUE7O1FBRUEsT0FBQTs7O01BR0EsT0FBQSxlQUFBLENBQUEsYUFBQSxLQUFBLE9BQUEsb0JBQUEsQ0FBQSxLQUFBLE9BQUE7O01BRUEsT0FBQSxjQUFBLFVBQUE7UUFDQTtXQUNBO1dBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXlCQSxJQUFBLFlBQUEsSUFBQSxTQUFBO01BQ0EsT0FBQSxpQkFBQSxLQUFBLFlBQUEsVUFBQSxTQUFBLFNBQUE7TUFDQSxPQUFBLG1CQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsZUFBQSxLQUFBLFlBQUEsVUFBQSxTQUFBLFNBQUE7O01BRUEsT0FBQSxtQkFBQSxVQUFBOztNQUVBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxTQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBO1lBQ0EsV0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7O0FDekhBLFFBQUEsT0FBQTtHQUNBLFdBQUEsWUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFlBQUEsUUFBQSxPQUFBLFFBQUEsVUFBQSxPQUFBLGFBQUEsV0FBQTtNQUNBLE9BQUEsVUFBQTs7TUFFQSxPQUFBLGFBQUE7O01BRUEsSUFBQSxXQUFBLFNBQUE7TUFDQSxPQUFBLFlBQUEsTUFBQSxVQUFBOzs7O01BSUEsSUFBQSxXQUFBLFNBQUE7TUFDQSxPQUFBLFlBQUEsTUFBQSxVQUFBOzs7TUFHQSxPQUFBLGFBQUE7O01BRUEsU0FBQSxZQUFBO1FBQ0EsT0FBQSxHQUFBOzs7TUFHQSxTQUFBLFFBQUEsS0FBQTtRQUNBLE9BQUEsUUFBQSxLQUFBOzs7TUFHQSxTQUFBLFlBQUE7UUFDQSxPQUFBLFFBQUE7OztNQUdBLE9BQUEsUUFBQSxVQUFBO1FBQ0E7UUFDQSxZQUFBO1VBQ0EsT0FBQSxPQUFBLE9BQUEsVUFBQSxXQUFBOzs7TUFHQSxPQUFBLFdBQUEsVUFBQTtRQUNBO1FBQ0EsWUFBQTtVQUNBLE9BQUEsT0FBQSxPQUFBLFVBQUEsV0FBQTs7O01BR0EsT0FBQSxnQkFBQSxTQUFBLE9BQUE7UUFDQSxPQUFBLGFBQUE7OztNQUdBLE9BQUEsaUJBQUEsV0FBQTtRQUNBLElBQUEsUUFBQSxPQUFBO1FBQ0EsWUFBQSxlQUFBO1FBQ0EsS0FBQSxnQkFBQSwyQ0FBQTs7Ozs7O01BTUEsT0FBQSxVQUFBOzs7O0FDL0RBLFFBQUEsT0FBQTtHQUNBLFdBQUEsYUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLE9BQUEsUUFBQSxVQUFBLE9BQUEsYUFBQSxXQUFBOztNQUVBLE9BQUEsYUFBQTs7O01BR0EsSUFBQSxXQUFBLFNBQUE7TUFDQSxPQUFBLFlBQUEsTUFBQSxVQUFBOzs7TUFHQSxPQUFBLGFBQUE7O01BRUEsU0FBQSxZQUFBO1FBQ0EsT0FBQSxHQUFBOzs7TUFHQSxTQUFBLFFBQUEsS0FBQTtRQUNBLE9BQUEsUUFBQSxLQUFBOzs7TUFHQSxTQUFBLFlBQUE7UUFDQSxPQUFBLFFBQUE7OztNQUdBLE9BQUEsUUFBQSxVQUFBO1FBQ0E7UUFDQSxZQUFBO1VBQ0EsT0FBQSxPQUFBLE9BQUEsVUFBQSxXQUFBOzs7TUFHQSxPQUFBLFdBQUEsVUFBQTtRQUNBO1FBQ0EsWUFBQTtVQUNBLE9BQUEsT0FBQSxPQUFBLFVBQUEsV0FBQTs7O01BR0EsT0FBQSxnQkFBQSxTQUFBLE9BQUE7UUFDQSxPQUFBLGFBQUE7OztNQUdBLE9BQUEsaUJBQUEsV0FBQTtRQUNBLElBQUEsUUFBQSxPQUFBO1FBQ0EsWUFBQSxlQUFBO1FBQ0EsS0FBQSxnQkFBQSwyQ0FBQTs7Ozs7O0FDbkRBLFFBQUEsT0FBQTtHQUNBLFdBQUEsYUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLGNBQUEsUUFBQSxZQUFBO01BQ0EsSUFBQSxRQUFBLGFBQUE7O01BRUEsT0FBQSxVQUFBOztNQUVBLE9BQUEsaUJBQUEsVUFBQTtRQUNBLElBQUEsV0FBQSxPQUFBO1FBQ0EsSUFBQSxVQUFBLE9BQUE7O1FBRUEsSUFBQSxhQUFBLFFBQUE7VUFDQSxPQUFBLFFBQUE7VUFDQSxPQUFBLFVBQUE7VUFDQTs7O1FBR0EsWUFBQTtVQUNBO1VBQ0EsT0FBQTtVQUNBOzs7OztVQUtBOzs7Ozs7O0FDN0JBLFFBQUEsT0FBQTtHQUNBLFFBQUEsWUFBQSxXQUFBO0dBQ0EsV0FBQSxlQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFlBQUEsUUFBQSxpQkFBQSxPQUFBLGFBQUEsU0FBQSxXQUFBOztNQUVBLElBQUEsT0FBQSxXQUFBOztNQUVBLE9BQUEsYUFBQTs7TUFFQSxPQUFBLG1CQUFBLE1BQUEsUUFBQSxLQUFBLE9BQUE7OztNQUdBO09BQ0E7T0FDQSxLQUFBOzs7O01BSUEsT0FBQSxTQUFBLFVBQUE7UUFDQSxZQUFBOzs7TUFHQSxPQUFBLGNBQUE7TUFDQSxPQUFBLGdCQUFBLFVBQUE7UUFDQSxPQUFBLGNBQUEsQ0FBQSxPQUFBOzs7O01BSUEsRUFBQSxTQUFBLEdBQUEsU0FBQSxVQUFBO1FBQ0EsT0FBQSxjQUFBOzs7Ozs7O0FDbENBLFFBQUEsT0FBQTtHQUNBLFdBQUEsWUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxRQUFBLFVBQUEsYUFBQSxVQUFBLE9BQUEsYUFBQSxhQUFBLEtBQUE7O01BRUEsSUFBQSxXQUFBLFNBQUE7O01BRUEsT0FBQSxZQUFBLE1BQUEsVUFBQTs7TUFFQSxPQUFBLE9BQUEsWUFBQTs7TUFFQSxTQUFBLGFBQUEsTUFBQSxRQUFBO1FBQ0EsSUFBQSxPQUFBO1FBQ0EsTUFBQSxRQUFBOzs7OztRQUtBLE9BQUE7Ozs7TUFJQSxPQUFBLFdBQUEsU0FBQSxLQUFBO1FBQ0EsSUFBQSxPQUFBO1FBQ0EsS0FBQSxhQUFBLFFBQUE7OztRQUdBLE9BQUE7OztNQUdBLFlBQUEsU0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFpQ0EsT0FBQSxhQUFBLFdBQUE7O1FBRUEsV0FBQTtVQUNBLGFBQUEsT0FBQTtVQUNBLFNBQUEsQ0FBQSxDQUFBLEdBQUEsWUFBQSxLQUFBLEtBQUEsS0FBQSxZQUFBLEtBQUEsUUFBQSxNQUFBLE9BQUEsT0FBQTtVQUNBLFFBQUEsQ0FBQSxNQUFBLE9BQUEsVUFBQSxRQUFBLE9BQUEsWUFBQSxVQUFBLE9BQUEsY0FBQSxNQUFBLE9BQUE7VUFDQSxXQUFBOztRQUVBLFFBQUEsSUFBQTtRQUNBLFFBQUEsSUFBQSxPQUFBOztRQUVBLFlBQUEsT0FBQTtRQUNBLE9BQUE7Ozs7TUFJQSxPQUFBLGlCQUFBLFVBQUE7UUFDQSxPQUFBLGtCQUFBO1FBQ0EsT0FBQSxXQUFBO1FBQ0EsT0FBQSxhQUFBO1FBQ0EsT0FBQSxlQUFBO1FBQ0EsT0FBQSxXQUFBO1FBQ0EsT0FBQSxtQkFBQTs7OztNQUlBLE9BQUEsZUFBQSxVQUFBO1FBQ0EsT0FBQSxtQkFBQTs7OztNQUlBLE9BQUEsZUFBQSxZQUFBOztRQUVBLFNBQUEsT0FBQTtRQUNBLGVBQUEsT0FBQTs7UUFFQSxTQUFBLENBQUEsR0FBQSxZQUFBLEtBQUEsS0FBQSxLQUFBLFlBQUEsS0FBQSxRQUFBLE1BQUEsTUFBQTtRQUNBLFlBQUEsS0FBQSxPQUFBO1FBQ0E7VUFDQTtVQUNBO1VBQ0E7O1FBRUEsT0FBQTs7OztNQUlBLE9BQUEsV0FBQSxVQUFBLE1BQUE7O1FBRUEsSUFBQTtTQUNBLE1BQUEsU0FBQSxTQUFBLGNBQUE7U0FDQSxPQUFBLFlBQUE7OztTQUdBLElBQUEsU0FBQSxTQUFBLGNBQUE7U0FDQSxPQUFBLFdBQUE7U0FDQSxPQUFBLFlBQUE7U0FDQSxPQUFBLFFBQUE7U0FDQSxPQUFBLFlBQUE7OztTQUdBLEdBQUEsS0FBQSxPQUFBLEtBQUE7V0FDQSxTQUFBLFNBQUEsY0FBQTtXQUNBLE9BQUEsWUFBQTtXQUNBLE9BQUEsUUFBQTtXQUNBLE9BQUEsWUFBQTs7U0FFQSxHQUFBLEtBQUEsT0FBQSxPQUFBO1VBQ0EsU0FBQSxTQUFBLGNBQUE7VUFDQSxPQUFBLFlBQUE7VUFDQSxPQUFBLFFBQUE7VUFDQSxPQUFBLFlBQUE7O1NBRUEsR0FBQSxLQUFBLE9BQUEsU0FBQTtVQUNBLFNBQUEsU0FBQSxjQUFBO1VBQ0EsT0FBQSxZQUFBO1VBQ0EsT0FBQSxRQUFBO1VBQ0EsT0FBQSxZQUFBOztTQUVBLEdBQUEsS0FBQSxPQUFBLEtBQUE7VUFDQSxTQUFBLFNBQUEsY0FBQTtVQUNBLE9BQUEsWUFBQTtVQUNBLE9BQUEsUUFBQTtVQUNBLE9BQUEsWUFBQTs7O1FBR0EsT0FBQSxXQUFBLFNBQUEsY0FBQSxHQUFBO1VBQ0EsUUFBQSxFQUFBLE9BQUE7OztRQUdBLEtBQUE7VUFDQSxPQUFBOztVQUVBLFNBQUE7WUFDQSxTQUFBOztXQUVBLEtBQUEsV0FBQTs7VUFFQSxTQUFBLENBQUEsR0FBQSxZQUFBLEtBQUEsS0FBQSxLQUFBLFlBQUEsS0FBQSxRQUFBLE1BQUEsTUFBQTtVQUNBLFlBQUEsS0FBQSxLQUFBLElBQUE7VUFDQTtZQUNBO1lBQ0E7WUFDQTs7VUFFQSxPQUFBOzs7OztNQUtBLE9BQUEsZUFBQSxTQUFBLFFBQUEsUUFBQSxPQUFBOztRQUVBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQSw2QkFBQSxPQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUEyQkEsT0FBQSxlQUFBLFNBQUEsUUFBQSxRQUFBLE9BQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsNkJBQUEsT0FBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7OztNQWdCQSxPQUFBLHVCQUFBLFNBQUEsUUFBQSxRQUFBLE9BQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsNkJBQUEsT0FBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BMkJBLE9BQUEsYUFBQSxTQUFBLE1BQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUE4QkEsT0FBQSxZQUFBLFNBQUEsTUFBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BdUJBLE9BQUEsaUJBQUEsU0FBQSxNQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bd0JBLE9BQUEsa0JBQUEsU0FBQSxPQUFBLFFBQUE7UUFDQSxJQUFBLFFBQUEsS0FBQSxDQUFBLEtBQUE7YUFDQSxDQUFBLEtBQUE7O1FBRUEsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFpQkEsT0FBQSxpQkFBQSxTQUFBLE9BQUEsUUFBQTtRQUNBLElBQUEsUUFBQSxLQUFBLENBQUEsS0FBQTthQUNBLENBQUEsS0FBQTs7UUFFQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7TUFlQSxPQUFBLE9BQUEsYUFBQSxTQUFBLFdBQUE7UUFDQSxZQUFBLGlCQUFBLFdBQUEsT0FBQSxlQUFBO1VBQ0E7Ozs7OztNQU1BLE9BQUEsb0JBQUEsWUFBQTtRQUNBLFlBQUEsaUJBQUEsT0FBQSxXQUFBLE9BQUEsZUFBQTtVQUNBOzs7Ozs7Ozs7Ozs7QUNuaEJBLFFBQUEsT0FBQTtHQUNBLFdBQUEsY0FBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxjQUFBLFlBQUE7TUFDQSxJQUFBLFFBQUEsYUFBQTs7TUFFQSxPQUFBLFVBQUE7O01BRUEsSUFBQSxPQUFBO1FBQ0EsWUFBQSxPQUFBO1VBQ0EsU0FBQSxLQUFBO1lBQ0EsT0FBQSxVQUFBO1lBQ0EsT0FBQSxVQUFBOztVQUVBLFNBQUEsSUFBQTtZQUNBLE9BQUEsVUFBQTs7OztBQUlBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgncmVnJywgW1xyXG4gICd1aS5yb3V0ZXInLFxyXG4gICdjaGFydC5qcycsXHJcbl0pO1xyXG5cclxuYXBwXHJcbiAgLmNvbmZpZyhbXHJcbiAgICAnJGh0dHBQcm92aWRlcicsXHJcbiAgICBmdW5jdGlvbigkaHR0cFByb3ZpZGVyKXtcclxuXHJcbiAgICAgIC8vIEFkZCBhdXRoIHRva2VuIHRvIEF1dGhvcml6YXRpb24gaGVhZGVyXHJcbiAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ0F1dGhJbnRlcmNlcHRvcicpO1xyXG5cclxuICAgIH1dKVxyXG4gIC5ydW4oW1xyXG4gICAgJ0F1dGhTZXJ2aWNlJyxcclxuICAgICdTZXNzaW9uJyxcclxuICAgIGZ1bmN0aW9uKEF1dGhTZXJ2aWNlLCBTZXNzaW9uKXtcclxuXHJcbiAgICAgIC8vIFN0YXJ0dXAsIGxvZ2luIGlmIHRoZXJlJ3MgIGEgdG9rZW4uXHJcbiAgICAgIHZhciB0b2tlbiA9IFNlc3Npb24uZ2V0VG9rZW4oKTtcclxuICAgICAgaWYgKHRva2VuKXtcclxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbldpdGhUb2tlbih0b2tlbik7XHJcbiAgICAgIH1cclxuXHJcbiAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAgIC5jb25zdGFudCgnRVZFTlRfSU5GTycsIHtcclxuICAgICAgICBOQU1FOiAnSGFja2l0IDIwMjAnLFxyXG4gICAgfSlcclxuICAgIC5jb25zdGFudCgnREFTSEJPQVJEJywge1xyXG4gICAgICAgIFVOVkVSSUZJRUQ6ICdZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYW4gZW1haWwgYXNraW5nIHlvdSB2ZXJpZnkgeW91ciBlbWFpbC4gQ2xpY2sgdGhlIGxpbmsgaW4gdGhlIGVtYWlsIGFuZCB5b3UgY2FuIHN0YXJ0IHlvdXIgYXBwbGljYXRpb24hJyxcclxuICAgICAgICBJTkNPTVBMRVRFX1RJVExFOiAnWW91IHN0aWxsIG5lZWQgdG8gY29tcGxldGUgeW91ciBhcHBsaWNhdGlvbiEnLFxyXG4gICAgICAgIElOQ09NUExFVEU6ICdJZiB5b3UgZG8gbm90IGNvbXBsZXRlIHlvdXIgYXBwbGljYXRpb24gYmVmb3JlIHRoZSBbQVBQX0RFQURMSU5FXSwgeW91IHdpbGwgbm90IGJlIGNvbnNpZGVyZWQgZm9yIHRoZSBhZG1pc3Npb25zIGxvdHRlcnkhJyxcclxuICAgICAgICBTVUJNSVRURURfVElUTEU6ICdZb3VyIGFwcGxpY2F0aW9uIGhhcyBiZWVuIHN1Ym1pdHRlZCEnLFxyXG4gICAgICAgIFNVQk1JVFRFRDogJ0ZlZWwgZnJlZSB0byBlZGl0IGl0IGF0IGFueSB0aW1lLiBIb3dldmVyLCBvbmNlIHJlZ2lzdHJhdGlvbiBpcyBjbG9zZWQsIHlvdSB3aWxsIG5vdCBiZSBhYmxlIHRvIGVkaXQgaXQgYW55IGZ1cnRoZXIuXFxuQWRtaXNzaW9ucyB3aWxsIGJlIGRldGVybWluZWQgYnkgYSByYW5kb20gbG90dGVyeS4gUGxlYXNlIG1ha2Ugc3VyZSB5b3VyIGluZm9ybWF0aW9uIGlzIGFjY3VyYXRlIGJlZm9yZSByZWdpc3RyYXRpb24gaXMgY2xvc2VkIScsXHJcbiAgICAgICAgQ0xPU0VEX0FORF9JTkNPTVBMRVRFX1RJVExFOiAnVW5mb3J0dW5hdGVseSwgcmVnaXN0cmF0aW9uIGhhcyBjbG9zZWQsIGFuZCB0aGUgbG90dGVyeSBwcm9jZXNzIGhhcyBiZWd1bi4nLFxyXG4gICAgICAgIENMT1NFRF9BTkRfSU5DT01QTEVURTogJ0JlY2F1c2UgeW91IGhhdmUgbm90IGNvbXBsZXRlZCB5b3VyIHByb2ZpbGUgaW4gdGltZSwgeW91IHdpbGwgbm90IGJlIGVsaWdpYmxlIGZvciB0aGUgbG90dGVyeSBwcm9jZXNzLicsXHJcbiAgICAgICAgQURNSVRURURfQU5EX0NBTl9DT05GSVJNX1RJVExFOiAnWW91IG11c3QgY29uZmlybSBieSBbQ09ORklSTV9ERUFETElORV0uJyxcclxuICAgICAgICBBRE1JVFRFRF9BTkRfQ0FOTk9UX0NPTkZJUk1fVElUTEU6ICdZb3VyIGNvbmZpcm1hdGlvbiBkZWFkbGluZSBvZiBbQ09ORklSTV9ERUFETElORV0gaGFzIHBhc3NlZC4nLFxyXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5OT1RfQ09ORklSTTogJ0FsdGhvdWdoIHlvdSB3ZXJlIGFjY2VwdGVkLCB5b3UgZGlkIG5vdCBjb21wbGV0ZSB5b3VyIGNvbmZpcm1hdGlvbiBpbiB0aW1lLlxcblVuZm9ydHVuYXRlbHksIHRoaXMgbWVhbnMgdGhhdCB5b3Ugd2lsbCBub3QgYmUgYWJsZSB0byBhdHRlbmQgdGhlIGV2ZW50LCBhcyB3ZSBtdXN0IGJlZ2luIHRvIGFjY2VwdCBvdGhlciBhcHBsaWNhbnRzIG9uIHRoZSB3YWl0bGlzdC5cXG5XZSBob3BlIHRvIHNlZSB5b3UgYWdhaW4gbmV4dCB5ZWFyIScsXHJcbiAgICAgICAgQ09ORklSTUVEX05PVF9QQVNUX1RJVExFOiAnWW91IGNhbiBlZGl0IHlvdXIgY29uZmlybWF0aW9uIGluZm9ybWF0aW9uIHVudGlsIFtDT05GSVJNX0RFQURMSU5FXScsXHJcbiAgICAgICAgREVDTElORUQ6ICdXZVxcJ3JlIHNvcnJ5IHRvIGhlYXIgdGhhdCB5b3Ugd29uXFwndCBiZSBhYmxlIHRvIG1ha2UgaXQgdG8gSGFja2l0IDIwMjAhIDooXFxuTWF5YmUgbmV4dCB5ZWFyISBXZSBob3BlIHlvdSBzZWUgeW91IGFnYWluIHNvb24uJyxcclxuICAgIH0pXHJcbiAgICAuY29uc3RhbnQoJ1RFQU0nLHtcclxuICAgICAgICBOT19URUFNX1JFR19DTE9TRUQ6ICdVbmZvcnR1bmF0ZWx5LCBpdFxcJ3MgdG9vIGxhdGUgdG8gZW50ZXIgdGhlIGxvdHRlcnkgd2l0aCBhIHRlYW0uXFxuSG93ZXZlciwgeW91IGNhbiBzdGlsbCBmb3JtIHRlYW1zIG9uIHlvdXIgb3duIGJlZm9yZSBvciBkdXJpbmcgdGhlIGV2ZW50IScsXHJcbiAgICB9KTtcclxuIiwiXHJcbmFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb25maWcoW1xyXG4gICAgJyRzdGF0ZVByb3ZpZGVyJyxcclxuICAgICckdXJsUm91dGVyUHJvdmlkZXInLFxyXG4gICAgJyRsb2NhdGlvblByb3ZpZGVyJyxcclxuICAgIGZ1bmN0aW9uKFxyXG4gICAgICAkc3RhdGVQcm92aWRlcixcclxuICAgICAgJHVybFJvdXRlclByb3ZpZGVyLFxyXG4gICAgICAkbG9jYXRpb25Qcm92aWRlcikge1xyXG5cclxuICAgIC8vIEZvciBhbnkgdW5tYXRjaGVkIHVybCwgcmVkaXJlY3QgdG8gL3N0YXRlMVxyXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi80MDRcIik7XHJcbiAgICBcclxuICAgIC8vIFNldCB1cCBkZSBzdGF0ZXNcclxuICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgIC5zdGF0ZSgnbG9naW4nLCB7XHJcbiAgICAgICAgdXJsOiBcIi9sb2dpblwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2xvZ2luL2xvZ2luLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlTG9naW46IGZhbHNlLFxyXG4gICAgICAgICAgcmVxdWlyZUxvZ291dDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgJ3NldHRpbmdzJzogZnVuY3Rpb24oU2V0dGluZ3NTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdob21lJywge1xyXG4gICAgICAgIHVybDogXCIvXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvbG9naW4vbG9naW4uaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2UsXHJcbiAgICAgICAgICByZXF1aXJlTG9nb3V0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAnc2V0dGluZ3MnOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgLy8gLnN0YXRlKCdob21lJywge1xyXG4gICAgICAvLyAgIHVybDogXCIvXCIsXHJcbiAgICAgIC8vICAgdGVtcGxhdGVVcmw6IFwidmlld3MvaG9tZS9ob21lLmh0bWxcIixcclxuICAgICAgLy8gICBjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxyXG4gICAgICAvLyAgIGRhdGE6IHtcclxuICAgICAgLy8gICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcclxuICAgICAgLy8gICB9LFxyXG4gICAgICAvLyAgIHJlc29sdmU6IHtcclxuICAgICAgLy8gICAgICdzZXR0aW5ncyc6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XHJcbiAgICAgIC8vICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgLy8gICAgIH1cclxuICAgICAgLy8gICB9XHJcbiAgICAgIC8vIH0pXHJcblxyXG4gICAgICAuc3RhdGUoJ2FwcCcsIHtcclxuICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgJyc6IHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYmFzZS5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQmFzZUN0cmxcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAnc2lkZWJhckBhcHAnOiB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3NpZGViYXIvc2lkZWJhci5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTaWRlYmFyQ3RybCcsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICBzZXR0aW5nczogZnVuY3Rpb24oU2V0dGluZ3NTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlTG9naW46IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmRhc2hib2FyZCcsIHtcclxuICAgICAgICB1cmw6IFwiL2Rhc2hib2FyZFwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2Rhc2hib2FyZC9kYXNoYm9hcmQuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdEYXNoYm9hcmRDdHJsJyxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24oVXNlclNlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzZXR0aW5nczogZnVuY3Rpb24oU2V0dGluZ3NTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFwcGxpY2F0aW9uJywge1xyXG4gICAgICAgIHVybDogXCIvYXBwbGljYXRpb25cIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0FwcGxpY2F0aW9uQ3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZVZlcmlmaWVkOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24oVXNlclNlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzZXR0aW5nczogZnVuY3Rpb24oU2V0dGluZ3NTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuY29uZmlybWF0aW9uJywge1xyXG4gICAgICAgIHVybDogXCIvY29uZmlybWF0aW9uXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvY29uZmlybWF0aW9uL2NvbmZpcm1hdGlvbi5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbmZpcm1hdGlvbkN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVBZG1pdHRlZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5jaGFsbGVuZ2VzJywge1xyXG4gICAgICAgIHVybDogXCIvY2hhbGxlbmdlc1wiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2NoYWxsZW5nZXMvY2hhbGxlbmdlcy5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0NoYWxsZW5nZXNDdHJsJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlVmVyaWZpZWQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbihVc2VyU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC50ZWFtJywge1xyXG4gICAgICAgIHVybDogXCIvdGVhbVwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3RlYW0vdGVhbS5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1RlYW1DdHJsJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlVmVyaWZpZWQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbihVc2VyU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbicsIHtcclxuICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgJyc6IHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vYWRtaW4uaHRtbFwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnYWRtaW5DdHJsJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZUFkbWluOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5jaGVja2luJywge1xyXG4gICAgICAgIHVybDogJy9jaGVja2luJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NoZWNraW4vY2hlY2tpbi5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiAnQ2hlY2tpbkN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVWb2x1bnRlZXI6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnN0YXRzJywge1xyXG4gICAgICAgIHVybDogXCIvYWRtaW5cIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9zdGF0cy9zdGF0cy5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0FkbWluU3RhdHNDdHJsJ1xyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5tYWlsJywge1xyXG4gICAgICAgIHVybDogXCIvYWRtaW4vbWFpbFwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL21haWwvbWFpbC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0FkbWluTWFpbEN0cmwnXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLmNoYWxsZW5nZXMnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pbi9jaGFsbGVuZ2VzXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vY2hhbGxlbmdlcy9jaGFsbGVuZ2VzLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnYWRtaW5DaGFsbGVuZ2VzQ3RybCdcclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4uY2hhbGxlbmdlJywge1xyXG4gICAgICAgIHVybDogXCIvYWRtaW4vY2hhbGxlbmdlcy86aWRcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9jaGFsbGVuZ2UvY2hhbGxlbmdlLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnYWRtaW5DaGFsbGVuZ2VDdHJsJyxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAnY2hhbGxlbmdlJzogZnVuY3Rpb24oJHN0YXRlUGFyYW1zLCBDaGFsbGVuZ2VTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIENoYWxsZW5nZVNlcnZpY2UuZ2V0KCRzdGF0ZVBhcmFtcy5pZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5tYXJrZXRpbmcnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pbi9tYXJrZXRpbmdcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9tYXJrZXRpbmcvbWFya2V0aW5nLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnYWRtaW5NYXJrZXRpbmdDdHJsJ1xyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi51c2VycycsIHtcclxuICAgICAgICB1cmw6IFwiL2FkbWluL3VzZXJzP1wiICtcclxuICAgICAgICAgICcmcGFnZScgK1xyXG4gICAgICAgICAgJyZzaXplJyArXHJcbiAgICAgICAgICAnJnF1ZXJ5JyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi91c2Vycy91c2Vycy5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0FkbWluVXNlcnNDdHJsJ1xyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi51c2VyJywge1xyXG4gICAgICAgIHVybDogXCIvYWRtaW4vdXNlcnMvOmlkXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vdXNlci91c2VyLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Vc2VyQ3RybCcsXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgJ3VzZXInOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIFVzZXJTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldCgkc3RhdGVQYXJhbXMuaWQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4uc2V0dGluZ3MnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pbi9zZXR0aW5nc1wiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL3NldHRpbmdzL3NldHRpbmdzLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5TZXR0aW5nc0N0cmwnLFxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ3Jlc2V0Jywge1xyXG4gICAgICAgIHVybDogXCIvcmVzZXQvOnRva2VuXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvcmVzZXQvcmVzZXQuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdSZXNldEN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgndmVyaWZ5Jywge1xyXG4gICAgICAgIHVybDogXCIvdmVyaWZ5Lzp0b2tlblwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3ZlcmlmeS92ZXJpZnkuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdWZXJpZnlDdHJsJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlTG9naW46IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJzQwNCcsIHtcclxuICAgICAgICB1cmw6IFwiLzQwNFwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzLzQwNC5odG1sXCIsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtcclxuICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIH0pO1xyXG5cclxuICB9XSlcclxuICAucnVuKFtcclxuICAgICckcm9vdFNjb3BlJyxcclxuICAgICckc3RhdGUnLFxyXG4gICAgJ1Nlc3Npb24nLFxyXG4gICAgZnVuY3Rpb24oXHJcbiAgICAgICRyb290U2NvcGUsXHJcbiAgICAgICRzdGF0ZSxcclxuICAgICAgU2Vzc2lvbiApe1xyXG5cclxuICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zKSB7XHJcblxyXG4gICAgICAgIHZhciByZXF1aXJlTG9naW4gPSB0b1N0YXRlLmRhdGEucmVxdWlyZUxvZ2luO1xyXG4gICAgICAgIHZhciByZXF1aXJlTG9nb3V0ID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVMb2dvdXQ7XHJcbiAgICAgICAgdmFyIHJlcXVpcmVBZG1pbiA9IHRvU3RhdGUuZGF0YS5yZXF1aXJlQWRtaW47XHJcbiAgICAgICAgdmFyIHJlcXVpcmVWb2x1bnRlZXIgPSB0b1N0YXRlLmRhdGEucmVxdWlyZVZvbHVudGVlcjtcclxuICAgICAgICB2YXIgcmVxdWlyZVZlcmlmaWVkID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVWZXJpZmllZDtcclxuICAgICAgICB2YXIgcmVxdWlyZUFkbWl0dGVkID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVBZG1pdHRlZDtcclxuICBcclxuICAgICAgICBpZiAocmVxdWlyZUxvZ2luICYmICFTZXNzaW9uLmdldFRva2VuKCkpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgaWYgKHJlcXVpcmVMb2dvdXQgJiYgU2Vzc2lvbi5nZXRUb2tlbigpKSB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChyZXF1aXJlQWRtaW4gJiYgIVNlc3Npb24uZ2V0VXNlcigpLmFkbWluKSB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAgICAgICAgICAgXHJcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgaWYgKHJlcXVpcmVWb2x1bnRlZXIgJiYgIVNlc3Npb24uZ2V0VXNlcigpLnZvbHVudGVlciAmJiByZXF1aXJlQWRtaW4gJiYgIVNlc3Npb24uZ2V0VXNlcigpLmFkbWluKSB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAgICAgICAgICAgXHJcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgaWYgKHJlcXVpcmVWZXJpZmllZCAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkudmVyaWZpZWQpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7ICAgICAgICAgICBcclxuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAocmVxdWlyZUFkbWl0dGVkICYmICFTZXNzaW9uLmdldFVzZXIoKS5zdGF0dXMuYWRtaXR0ZWQpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7ICAgICAgICAgICBcclxuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xyXG4gICAgICAgIH1cclxuICBcclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIFtcclxuICAgICdTZXNzaW9uJyxcclxuICAgIGZ1bmN0aW9uKFNlc3Npb24pe1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgcmVxdWVzdDogZnVuY3Rpb24oY29uZmlnKXtcclxuICAgICAgICAgICAgdmFyIHRva2VuID0gU2Vzc2lvbi5nZXRUb2tlbigpO1xyXG4gICAgICAgICAgICBpZiAodG9rZW4pe1xyXG4gICAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzWyd4LWFjY2Vzcy10b2tlbiddID0gdG9rZW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuc2VydmljZSgnU2Vzc2lvbicsIFtcclxuICAgICckcm9vdFNjb3BlJyxcclxuICAgICckd2luZG93JyxcclxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICR3aW5kb3cpe1xyXG5cclxuICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24odG9rZW4sIHVzZXIpe1xyXG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5qd3QgPSB0b2tlbjtcclxuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkID0gdXNlci5faWQ7XHJcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyID0gSlNPTi5zdHJpbmdpZnkodXNlcik7XHJcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbihvbkNvbXBsZXRlKXtcclxuICAgICAgZGVsZXRlICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dDtcclxuICAgICAgZGVsZXRlICR3aW5kb3cubG9jYWxTdG9yYWdlLnVzZXJJZDtcclxuICAgICAgZGVsZXRlICR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyO1xyXG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcclxuICAgICAgaWYgKG9uQ29tcGxldGUpe1xyXG4gICAgICAgIG9uQ29tcGxldGUoKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmdldFRva2VuID0gZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dDtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5nZXRVc2VySWQgPSBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmdldFVzZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZS5jdXJyZW50VXNlcik7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2V0VXNlciA9IGZ1bmN0aW9uKHVzZXIpe1xyXG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5jdXJyZW50VXNlciA9IEpTT04uc3RyaW5naWZ5KHVzZXIpO1xyXG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gdXNlcjtcclxuICAgIH07XHJcblxyXG4gIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuZmFjdG9yeSgnVXRpbHMnLCBbXHJcbiAgICBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGlzUmVnT3BlbjogZnVuY3Rpb24oc2V0dGluZ3Mpe1xyXG4gICAgICAgICAgcmV0dXJuIERhdGUubm93KCkgPiBzZXR0aW5ncy50aW1lT3BlbiAmJiBEYXRlLm5vdygpIDwgc2V0dGluZ3MudGltZUNsb3NlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaXNBZnRlcjogZnVuY3Rpb24odGltZSl7XHJcbiAgICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSA+IHRpbWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JtYXRUaW1lOiBmdW5jdGlvbih0aW1lKXtcclxuXHJcbiAgICAgICAgICBpZiAoIXRpbWUpe1xyXG4gICAgICAgICAgICByZXR1cm4gXCJJbnZhbGlkIERhdGVcIjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBkYXRlID0gbmV3IERhdGUodGltZSk7XHJcbiAgICAgICAgICAvLyBIYWNrIGZvciB0aW1lem9uZVxyXG4gICAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5mb3JtYXQoJ2RkZGQsIE1NTU0gRG8gWVlZWSwgaDptbSBhJykgK1xyXG4gICAgICAgICAgICBcIiBcIiArIGRhdGUudG9UaW1lU3RyaW5nKCkuc3BsaXQoJyAnKVsyXTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfV0pO1xyXG4iLCIoZnVuY3Rpb24oJCkge1xyXG4gICAgalF1ZXJ5LmZuLmV4dGVuZCh7XHJcbiAgICAgICAgaHRtbDVfcXJjb2RlOiBmdW5jdGlvbihxcmNvZGVTdWNjZXNzLCBxcmNvZGVFcnJvciwgdmlkZW9FcnJvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRFbGVtID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gY3VycmVudEVsZW0uaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGggPSBjdXJyZW50RWxlbS53aWR0aCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChoZWlnaHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IDI1MDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAod2lkdGggPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoID0gMzAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIHZhciB2aWRFbGVtID0gJCgnPHZpZGVvIHdpZHRoPVwiJyArIHdpZHRoICsgJ3B4XCIgaGVpZ2h0PVwiJyArIGhlaWdodCArICdweFwiPjwvdmlkZW8+JykuYXBwZW5kVG8oY3VycmVudEVsZW0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZpZEVsZW0gPSAkKCc8dmlkZW8gd2lkdGg9XCInICsgd2lkdGggKyAncHhcIiBoZWlnaHQ9XCInICsgaGVpZ2h0ICsgJ3B4XCIgYXV0b3BsYXkgcGxheXNpbmxpbmU+PC92aWRlbz4nKS5hcHBlbmRUbyhjdXJyZW50RWxlbSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FudmFzRWxlbSA9ICQoJzxjYW52YXMgaWQ9XCJxci1jYW52YXNcIiB3aWR0aD1cIicgKyAod2lkdGggLSAyKSArICdweFwiIGhlaWdodD1cIicgKyAoaGVpZ2h0IC0gMikgKyAncHhcIiBzdHlsZT1cImRpc3BsYXk6bm9uZTtcIj48L2NhbnZhcz4nKS5hcHBlbmRUbyhjdXJyZW50RWxlbSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZpZGVvID0gdmlkRWxlbVswXTtcclxuICAgICAgICAgICAgICAgIHZhciBjYW52YXMgPSBjYW52YXNFbGVtWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgICAgIHZhciBsb2NhbE1lZGlhU3RyZWFtO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzY2FuID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsTWVkaWFTdHJlYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodmlkZW8sIDAsIDAsIDMwNywgMjUwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxcmNvZGUuZGVjb2RlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHFyY29kZUVycm9yKGUsIGxvY2FsTWVkaWFTdHJlYW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkLmRhdGEoY3VycmVudEVsZW1bMF0sIFwidGltZW91dFwiLCBzZXRUaW1lb3V0KHNjYW4sIDUwMCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkLmRhdGEoY3VycmVudEVsZW1bMF0sIFwidGltZW91dFwiLCBzZXRUaW1lb3V0KHNjYW4sIDUwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07Ly9lbmQgc25hcHNob3QgZnVuY3Rpb25cclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuVVJMID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMIHx8IHdpbmRvdy5tb3pVUkwgfHwgd2luZG93Lm1zVVJMO1xyXG4gICAgICAgICAgICAgICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9IG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHwgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fCBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8IG5hdmlnYXRvci5tc0dldFVzZXJNZWRpYTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc3VjY2Vzc0NhbGxiYWNrID0gZnVuY3Rpb24oc3RyZWFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmlkZW8uc3JjID0gKHdpbmRvdy5VUkwgJiYgd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoc3RyZWFtKSkgfHwgc3RyZWFtO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZGVvLnNyY09iamVjdCA9IHN0cmVhbTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbE1lZGlhU3RyZWFtID0gc3RyZWFtO1xyXG4gICAgICAgICAgICAgICAgICAgICQuZGF0YShjdXJyZW50RWxlbVswXSwgXCJzdHJlYW1cIiwgc3RyZWFtKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmlkZW8ucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQuZGF0YShjdXJyZW50RWxlbVswXSwgXCJ0aW1lb3V0XCIsIHNldFRpbWVvdXQoc2NhbiwgMTAwMCkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDYWxsIHRoZSBnZXRVc2VyTWVkaWEgbWV0aG9kIHdpdGggb3VyIGNhbGxiYWNrIGZ1bmN0aW9uc1xyXG4gICAgICAgICAgICAgICAgaWYgKG5hdmlnYXRvci5nZXRVc2VyTWVkaWEpIHtcclxuICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKHt2aWRlbzogeyBmYWNpbmdNb2RlOiBcImVudmlyb25tZW50XCIgfSB9LCBzdWNjZXNzQ2FsbGJhY2ssIGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZGVvRXJyb3IoZXJyb3IsIGxvY2FsTWVkaWFTdHJlYW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTmF0aXZlIHdlYiBjYW1lcmEgc3RyZWFtaW5nIChnZXRVc2VyTWVkaWEpIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgYSBmcmllbmRseSBcInNvcnJ5XCIgbWVzc2FnZSB0byB0aGUgdXNlclxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHFyY29kZS5jYWxsYmFjayA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBxcmNvZGVTdWNjZXNzKHJlc3VsdCwgbG9jYWxNZWRpYVN0cmVhbSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KTsgLy8gZW5kIG9mIGh0bWw1X3FyY29kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaHRtbDVfcXJjb2RlX3N0b3A6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLy9zdG9wIHRoZSBzdHJlYW0gYW5kIGNhbmNlbCB0aW1lb3V0c1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5kYXRhKCdzdHJlYW0nKS5nZXRWaWRlb1RyYWNrcygpLmZvckVhY2goZnVuY3Rpb24odmlkZW9UcmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZGVvVHJhY2suc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KCQodGhpcykuZGF0YSgndGltZW91dCcpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pKGpRdWVyeSk7XHJcblxyXG4iLCJmdW5jdGlvbiBFQ0IoY291bnQsZGF0YUNvZGV3b3Jkcyl7dGhpcy5jb3VudD1jb3VudCx0aGlzLmRhdGFDb2Rld29yZHM9ZGF0YUNvZGV3b3Jkcyx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJDb3VudFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY291bnR9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJEYXRhQ29kZXdvcmRzXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kYXRhQ29kZXdvcmRzfSl9ZnVuY3Rpb24gRUNCbG9ja3MoZWNDb2Rld29yZHNQZXJCbG9jayxlY0Jsb2NrczEsZWNCbG9ja3MyKXt0aGlzLmVjQ29kZXdvcmRzUGVyQmxvY2s9ZWNDb2Rld29yZHNQZXJCbG9jayxlY0Jsb2NrczI/dGhpcy5lY0Jsb2Nrcz1uZXcgQXJyYXkoZWNCbG9ja3MxLGVjQmxvY2tzMik6dGhpcy5lY0Jsb2Nrcz1uZXcgQXJyYXkoZWNCbG9ja3MxKSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJFQ0NvZGV3b3Jkc1BlckJsb2NrXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lY0NvZGV3b3Jkc1BlckJsb2NrfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiVG90YWxFQ0NvZGV3b3Jkc1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZWNDb2Rld29yZHNQZXJCbG9jayp0aGlzLk51bUJsb2Nrc30pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIk51bUJsb2Nrc1wiLGZ1bmN0aW9uKCl7Zm9yKHZhciB0b3RhbD0wLGk9MDtpPHRoaXMuZWNCbG9ja3MubGVuZ3RoO2krKyl0b3RhbCs9dGhpcy5lY0Jsb2Nrc1tpXS5sZW5ndGg7cmV0dXJuIHRvdGFsfSksdGhpcy5nZXRFQ0Jsb2Nrcz1mdW5jdGlvbigpe3JldHVybiB0aGlzLmVjQmxvY2tzfX1mdW5jdGlvbiBWZXJzaW9uKHZlcnNpb25OdW1iZXIsYWxpZ25tZW50UGF0dGVybkNlbnRlcnMsZWNCbG9ja3MxLGVjQmxvY2tzMixlY0Jsb2NrczMsZWNCbG9ja3M0KXt0aGlzLnZlcnNpb25OdW1iZXI9dmVyc2lvbk51bWJlcix0aGlzLmFsaWdubWVudFBhdHRlcm5DZW50ZXJzPWFsaWdubWVudFBhdHRlcm5DZW50ZXJzLHRoaXMuZWNCbG9ja3M9bmV3IEFycmF5KGVjQmxvY2tzMSxlY0Jsb2NrczIsZWNCbG9ja3MzLGVjQmxvY2tzNCk7Zm9yKHZhciB0b3RhbD0wLGVjQ29kZXdvcmRzPWVjQmxvY2tzMS5FQ0NvZGV3b3Jkc1BlckJsb2NrLGVjYkFycmF5PWVjQmxvY2tzMS5nZXRFQ0Jsb2NrcygpLGk9MDtpPGVjYkFycmF5Lmxlbmd0aDtpKyspe3ZhciBlY0Jsb2NrPWVjYkFycmF5W2ldO3RvdGFsKz1lY0Jsb2NrLkNvdW50KihlY0Jsb2NrLkRhdGFDb2Rld29yZHMrZWNDb2Rld29yZHMpfXRoaXMudG90YWxDb2Rld29yZHM9dG90YWwsdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiVmVyc2lvbk51bWJlclwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudmVyc2lvbk51bWJlcn0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkFsaWdubWVudFBhdHRlcm5DZW50ZXJzXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hbGlnbm1lbnRQYXR0ZXJuQ2VudGVyc30pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIlRvdGFsQ29kZXdvcmRzXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50b3RhbENvZGV3b3Jkc30pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkRpbWVuc2lvbkZvclZlcnNpb25cIixmdW5jdGlvbigpe3JldHVybiAxNys0KnRoaXMudmVyc2lvbk51bWJlcn0pLHRoaXMuYnVpbGRGdW5jdGlvblBhdHRlcm49ZnVuY3Rpb24oKXt2YXIgZGltZW5zaW9uPXRoaXMuRGltZW5zaW9uRm9yVmVyc2lvbixiaXRNYXRyaXg9bmV3IEJpdE1hdHJpeChkaW1lbnNpb24pO2JpdE1hdHJpeC5zZXRSZWdpb24oMCwwLDksOSksYml0TWF0cml4LnNldFJlZ2lvbihkaW1lbnNpb24tOCwwLDgsOSksYml0TWF0cml4LnNldFJlZ2lvbigwLGRpbWVuc2lvbi04LDksOCk7Zm9yKHZhciBtYXg9dGhpcy5hbGlnbm1lbnRQYXR0ZXJuQ2VudGVycy5sZW5ndGgseD0wO21heD54O3grKylmb3IodmFyIGk9dGhpcy5hbGlnbm1lbnRQYXR0ZXJuQ2VudGVyc1t4XS0yLHk9MDttYXg+eTt5KyspMD09eCYmKDA9PXl8fHk9PW1heC0xKXx8eD09bWF4LTEmJjA9PXl8fGJpdE1hdHJpeC5zZXRSZWdpb24odGhpcy5hbGlnbm1lbnRQYXR0ZXJuQ2VudGVyc1t5XS0yLGksNSw1KTtyZXR1cm4gYml0TWF0cml4LnNldFJlZ2lvbig2LDksMSxkaW1lbnNpb24tMTcpLGJpdE1hdHJpeC5zZXRSZWdpb24oOSw2LGRpbWVuc2lvbi0xNywxKSx0aGlzLnZlcnNpb25OdW1iZXI+NiYmKGJpdE1hdHJpeC5zZXRSZWdpb24oZGltZW5zaW9uLTExLDAsMyw2KSxiaXRNYXRyaXguc2V0UmVnaW9uKDAsZGltZW5zaW9uLTExLDYsMykpLGJpdE1hdHJpeH0sdGhpcy5nZXRFQ0Jsb2Nrc0ZvckxldmVsPWZ1bmN0aW9uKGVjTGV2ZWwpe3JldHVybiB0aGlzLmVjQmxvY2tzW2VjTGV2ZWwub3JkaW5hbCgpXX19ZnVuY3Rpb24gYnVpbGRWZXJzaW9ucygpe3JldHVybiBuZXcgQXJyYXkobmV3IFZlcnNpb24oMSxuZXcgQXJyYXksbmV3IEVDQmxvY2tzKDcsbmV3IEVDQigxLDE5KSksbmV3IEVDQmxvY2tzKDEwLG5ldyBFQ0IoMSwxNikpLG5ldyBFQ0Jsb2NrcygxMyxuZXcgRUNCKDEsMTMpKSxuZXcgRUNCbG9ja3MoMTcsbmV3IEVDQigxLDkpKSksbmV3IFZlcnNpb24oMixuZXcgQXJyYXkoNiwxOCksbmV3IEVDQmxvY2tzKDEwLG5ldyBFQ0IoMSwzNCkpLG5ldyBFQ0Jsb2NrcygxNixuZXcgRUNCKDEsMjgpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQigxLDIyKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMSwxNikpKSxuZXcgVmVyc2lvbigzLG5ldyBBcnJheSg2LDIyKSxuZXcgRUNCbG9ja3MoMTUsbmV3IEVDQigxLDU1KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoMSw0NCkpLG5ldyBFQ0Jsb2NrcygxOCxuZXcgRUNCKDIsMTcpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQigyLDEzKSkpLG5ldyBWZXJzaW9uKDQsbmV3IEFycmF5KDYsMjYpLG5ldyBFQ0Jsb2NrcygyMCxuZXcgRUNCKDEsODApKSxuZXcgRUNCbG9ja3MoMTgsbmV3IEVDQigyLDMyKSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoMiwyNCkpLG5ldyBFQ0Jsb2NrcygxNixuZXcgRUNCKDQsOSkpKSxuZXcgVmVyc2lvbig1LG5ldyBBcnJheSg2LDMwKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigxLDEwOCkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDIsNDMpKSxuZXcgRUNCbG9ja3MoMTgsbmV3IEVDQigyLDE1KSxuZXcgRUNCKDIsMTYpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQigyLDExKSxuZXcgRUNCKDIsMTIpKSksbmV3IFZlcnNpb24oNixuZXcgQXJyYXkoNiwzNCksbmV3IEVDQmxvY2tzKDE4LG5ldyBFQ0IoMiw2OCkpLG5ldyBFQ0Jsb2NrcygxNixuZXcgRUNCKDQsMjcpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQig0LDE5KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNCwxNSkpKSxuZXcgVmVyc2lvbig3LG5ldyBBcnJheSg2LDIyLDM4KSxuZXcgRUNCbG9ja3MoMjAsbmV3IEVDQigyLDc4KSksbmV3IEVDQmxvY2tzKDE4LG5ldyBFQ0IoNCwzMSkpLG5ldyBFQ0Jsb2NrcygxOCxuZXcgRUNCKDIsMTQpLG5ldyBFQ0IoNCwxNSkpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDQsMTMpLG5ldyBFQ0IoMSwxNCkpKSxuZXcgVmVyc2lvbig4LG5ldyBBcnJheSg2LDI0LDQyKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQigyLDk3KSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoMiwzOCksbmV3IEVDQigyLDM5KSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoNCwxOCksbmV3IEVDQigyLDE5KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoNCwxNCksbmV3IEVDQigyLDE1KSkpLG5ldyBWZXJzaW9uKDksbmV3IEFycmF5KDYsMjYsNDYpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIsMTE2KSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoMywzNiksbmV3IEVDQigyLDM3KSksbmV3IEVDQmxvY2tzKDIwLG5ldyBFQ0IoNCwxNiksbmV3IEVDQig0LDE3KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoNCwxMiksbmV3IEVDQig0LDEzKSkpLG5ldyBWZXJzaW9uKDEwLG5ldyBBcnJheSg2LDI4LDUwKSxuZXcgRUNCbG9ja3MoMTgsbmV3IEVDQigyLDY4KSxuZXcgRUNCKDIsNjkpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig0LDQzKSxuZXcgRUNCKDEsNDQpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQig2LDE5KSxuZXcgRUNCKDIsMjApKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig2LDE1KSxuZXcgRUNCKDIsMTYpKSksbmV3IFZlcnNpb24oMTEsbmV3IEFycmF5KDYsMzAsNTQpLG5ldyBFQ0Jsb2NrcygyMCxuZXcgRUNCKDQsODEpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxLDUwKSxuZXcgRUNCKDQsNTEpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig0LDIyKSxuZXcgRUNCKDQsMjMpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQigzLDEyKSxuZXcgRUNCKDgsMTMpKSksbmV3IFZlcnNpb24oMTIsbmV3IEFycmF5KDYsMzIsNTgpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDIsOTIpLG5ldyBFQ0IoMiw5MykpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDYsMzYpLG5ldyBFQ0IoMiwzNykpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDQsMjApLG5ldyBFQ0IoNiwyMSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDcsMTQpLG5ldyBFQ0IoNCwxNSkpKSxuZXcgVmVyc2lvbigxMyxuZXcgQXJyYXkoNiwzNCw2MiksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoNCwxMDcpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQig4LDM3KSxuZXcgRUNCKDEsMzgpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQig4LDIwKSxuZXcgRUNCKDQsMjEpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQigxMiwxMSksbmV3IEVDQig0LDEyKSkpLG5ldyBWZXJzaW9uKDE0LG5ldyBBcnJheSg2LDI2LDQ2LDY2KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigzLDExNSksbmV3IEVDQigxLDExNikpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDQsNDApLG5ldyBFQ0IoNSw0MSkpLG5ldyBFQ0Jsb2NrcygyMCxuZXcgRUNCKDExLDE2KSxuZXcgRUNCKDUsMTcpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQigxMSwxMiksbmV3IEVDQig1LDEzKSkpLG5ldyBWZXJzaW9uKDE1LG5ldyBBcnJheSg2LDI2LDQ4LDcwKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQig1LDg3KSxuZXcgRUNCKDEsODgpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQig1LDQxKSxuZXcgRUNCKDUsNDIpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig1LDI0KSxuZXcgRUNCKDcsMjUpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQigxMSwxMiksbmV3IEVDQig3LDEzKSkpLG5ldyBWZXJzaW9uKDE2LG5ldyBBcnJheSg2LDI2LDUwLDc0KSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQig1LDk4KSxuZXcgRUNCKDEsOTkpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig3LDQ1KSxuZXcgRUNCKDMsNDYpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQigxNSwxOSksbmV3IEVDQigyLDIwKSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMywxNSksbmV3IEVDQigxMywxNikpKSxuZXcgVmVyc2lvbigxNyxuZXcgQXJyYXkoNiwzMCw1NCw3OCksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMSwxMDcpLG5ldyBFQ0IoNSwxMDgpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxMCw0NiksbmV3IEVDQigxLDQ3KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMSwyMiksbmV3IEVDQigxNSwyMykpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDIsMTQpLG5ldyBFQ0IoMTcsMTUpKSksbmV3IFZlcnNpb24oMTgsbmV3IEFycmF5KDYsMzAsNTYsODIpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDUsMTIwKSxuZXcgRUNCKDEsMTIxKSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoOSw0MyksbmV3IEVDQig0LDQ0KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTcsMjIpLG5ldyBFQ0IoMSwyMykpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDIsMTQpLG5ldyBFQ0IoMTksMTUpKSksbmV3IFZlcnNpb24oMTksbmV3IEFycmF5KDYsMzAsNTgsODYpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDMsMTEzKSxuZXcgRUNCKDQsMTE0KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoMyw0NCksbmV3IEVDQigxMSw0NSkpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDE3LDIxKSxuZXcgRUNCKDQsMjIpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig5LDEzKSxuZXcgRUNCKDE2LDE0KSkpLG5ldyBWZXJzaW9uKDIwLG5ldyBBcnJheSg2LDM0LDYyLDkwKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigzLDEwNyksbmV3IEVDQig1LDEwOCkpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDMsNDEpLG5ldyBFQ0IoMTMsNDIpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxNSwyNCksbmV3IEVDQig1LDI1KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTUsMTUpLG5ldyBFQ0IoMTAsMTYpKSksbmV3IFZlcnNpb24oMjEsbmV3IEFycmF5KDYsMjgsNTAsNzIsOTQpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDQsMTE2KSxuZXcgRUNCKDQsMTE3KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoMTcsNDIpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxNywyMiksbmV3IEVDQig2LDIzKSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTksMTYpLG5ldyBFQ0IoNiwxNykpKSxuZXcgVmVyc2lvbigyMixuZXcgQXJyYXkoNiwyNiw1MCw3NCw5OCksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMiwxMTEpLG5ldyBFQ0IoNywxMTIpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxNyw0NikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDcsMjQpLG5ldyBFQ0IoMTYsMjUpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQigzNCwxMykpKSxuZXcgVmVyc2lvbigyMyxuZXcgQXJyYXkoNiwzMCw1NCw3NCwxMDIpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQsMTIxKSxuZXcgRUNCKDUsMTIyKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNCw0NyksbmV3IEVDQigxNCw0OCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDExLDI0KSxuZXcgRUNCKDE0LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTYsMTUpLG5ldyBFQ0IoMTQsMTYpKSksbmV3IFZlcnNpb24oMjQsbmV3IEFycmF5KDYsMjgsNTQsODAsMTA2KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig2LDExNyksbmV3IEVDQig0LDExOCkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDYsNDUpLG5ldyBFQ0IoMTQsNDYpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMSwyNCksbmV3IEVDQigxNiwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDMwLDE2KSxuZXcgRUNCKDIsMTcpKSksbmV3IFZlcnNpb24oMjUsbmV3IEFycmF5KDYsMzIsNTgsODQsMTEwKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig4LDEwNiksbmV3IEVDQig0LDEwNykpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDgsNDcpLG5ldyBFQ0IoMTMsNDgpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig3LDI0KSxuZXcgRUNCKDIyLDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMjIsMTUpLG5ldyBFQ0IoMTMsMTYpKSksbmV3IFZlcnNpb24oMjYsbmV3IEFycmF5KDYsMzAsNTgsODYsMTE0KSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxMCwxMTQpLG5ldyBFQ0IoMiwxMTUpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxOSw0NiksbmV3IEVDQig0LDQ3KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMjgsMjIpLG5ldyBFQ0IoNiwyMykpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDMzLDE2KSxuZXcgRUNCKDQsMTcpKSksbmV3IFZlcnNpb24oMjcsbmV3IEFycmF5KDYsMzQsNjIsOTAsMTE4KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig4LDEyMiksbmV3IEVDQig0LDEyMykpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDIyLDQ1KSxuZXcgRUNCKDMsNDYpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig4LDIzKSxuZXcgRUNCKDI2LDI0KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTIsMTUpLG5ldyBFQ0IoMjgsMTYpKSksbmV3IFZlcnNpb24oMjgsbmV3IEFycmF5KDYsMjYsNTAsNzQsOTgsMTIyKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigzLDExNyksbmV3IEVDQigxMCwxMTgpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigzLDQ1KSxuZXcgRUNCKDIzLDQ2KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNCwyNCksbmV3IEVDQigzMSwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDExLDE1KSxuZXcgRUNCKDMxLDE2KSkpLG5ldyBWZXJzaW9uKDI5LG5ldyBBcnJheSg2LDMwLDU0LDc4LDEwMiwxMjYpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDcsMTE2KSxuZXcgRUNCKDcsMTE3KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMjEsNDUpLG5ldyBFQ0IoNyw0NikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDEsMjMpLG5ldyBFQ0IoMzcsMjQpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxOSwxNSksbmV3IEVDQigyNiwxNikpKSxuZXcgVmVyc2lvbigzMCxuZXcgQXJyYXkoNiwyNiw1Miw3OCwxMDQsMTMwKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig1LDExNSksbmV3IEVDQigxMCwxMTYpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxOSw0NyksbmV3IEVDQigxMCw0OCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE1LDI0KSxuZXcgRUNCKDI1LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMjMsMTUpLG5ldyBFQ0IoMjUsMTYpKSksbmV3IFZlcnNpb24oMzEsbmV3IEFycmF5KDYsMzAsNTYsODIsMTA4LDEzNCksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTMsMTE1KSxuZXcgRUNCKDMsMTE2KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMiw0NiksbmV3IEVDQigyOSw0NykpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQyLDI0KSxuZXcgRUNCKDEsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyMywxNSksbmV3IEVDQigyOCwxNikpKSxuZXcgVmVyc2lvbigzMixuZXcgQXJyYXkoNiwzNCw2MCw4NiwxMTIsMTM4KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxNywxMTUpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxMCw0NiksbmV3IEVDQigyMyw0NykpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDEwLDI0KSxuZXcgRUNCKDM1LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTksMTUpLG5ldyBFQ0IoMzUsMTYpKSksbmV3IFZlcnNpb24oMzMsbmV3IEFycmF5KDYsMzAsNTgsODYsMTE0LDE0MiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTcsMTE1KSxuZXcgRUNCKDEsMTE2KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTQsNDYpLG5ldyBFQ0IoMjEsNDcpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyOSwyNCksbmV3IEVDQigxOSwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDExLDE1KSxuZXcgRUNCKDQ2LDE2KSkpLG5ldyBWZXJzaW9uKDM0LG5ldyBBcnJheSg2LDM0LDYyLDkwLDExOCwxNDYpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDEzLDExNSksbmV3IEVDQig2LDExNikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE0LDQ2KSxuZXcgRUNCKDIzLDQ3KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNDQsMjQpLG5ldyBFQ0IoNywyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDU5LDE2KSxuZXcgRUNCKDEsMTcpKSksbmV3IFZlcnNpb24oMzUsbmV3IEFycmF5KDYsMzAsNTQsNzgsMTAyLDEyNiwxNTApLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDEyLDEyMSksbmV3IEVDQig3LDEyMikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEyLDQ3KSxuZXcgRUNCKDI2LDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMzksMjQpLG5ldyBFQ0IoMTQsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyMiwxNSksbmV3IEVDQig0MSwxNikpKSxuZXcgVmVyc2lvbigzNixuZXcgQXJyYXkoNiwyNCw1MCw3NiwxMDIsMTI4LDE1NCksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNiwxMjEpLG5ldyBFQ0IoMTQsMTIyKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNiw0NyksbmV3IEVDQigzNCw0OCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQ2LDI0KSxuZXcgRUNCKDEwLDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMiwxNSksbmV3IEVDQig2NCwxNikpKSxuZXcgVmVyc2lvbigzNyxuZXcgQXJyYXkoNiwyOCw1NCw4MCwxMDYsMTMyLDE1OCksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTcsMTIyKSxuZXcgRUNCKDQsMTIzKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMjksNDYpLG5ldyBFQ0IoMTQsNDcpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0OSwyNCksbmV3IEVDQigxMCwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDI0LDE1KSxuZXcgRUNCKDQ2LDE2KSkpLG5ldyBWZXJzaW9uKDM4LG5ldyBBcnJheSg2LDMyLDU4LDg0LDExMCwxMzYsMTYyKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0LDEyMiksbmV3IEVDQigxOCwxMjMpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxMyw0NiksbmV3IEVDQigzMiw0NykpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQ4LDI0KSxuZXcgRUNCKDE0LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNDIsMTUpLG5ldyBFQ0IoMzIsMTYpKSksbmV3IFZlcnNpb24oMzksbmV3IEFycmF5KDYsMjYsNTQsODIsMTEwLDEzOCwxNjYpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIwLDExNyksbmV3IEVDQig0LDExOCkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDQwLDQ3KSxuZXcgRUNCKDcsNDgpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0MywyNCksbmV3IEVDQigyMiwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDEwLDE1KSxuZXcgRUNCKDY3LDE2KSkpLG5ldyBWZXJzaW9uKDQwLG5ldyBBcnJheSg2LDMwLDU4LDg2LDExNCwxNDIsMTcwKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxOSwxMTgpLG5ldyBFQ0IoNiwxMTkpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxOCw0NyksbmV3IEVDQigzMSw0OCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDM0LDI0KSxuZXcgRUNCKDM0LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMjAsMTUpLG5ldyBFQ0IoNjEsMTYpKSkpfWZ1bmN0aW9uIFBlcnNwZWN0aXZlVHJhbnNmb3JtKGExMSxhMjEsYTMxLGExMixhMjIsYTMyLGExMyxhMjMsYTMzKXt0aGlzLmExMT1hMTEsdGhpcy5hMTI9YTEyLHRoaXMuYTEzPWExMyx0aGlzLmEyMT1hMjEsdGhpcy5hMjI9YTIyLHRoaXMuYTIzPWEyMyx0aGlzLmEzMT1hMzEsdGhpcy5hMzI9YTMyLHRoaXMuYTMzPWEzMyx0aGlzLnRyYW5zZm9ybVBvaW50czE9ZnVuY3Rpb24ocG9pbnRzKXtmb3IodmFyIG1heD1wb2ludHMubGVuZ3RoLGExMT10aGlzLmExMSxhMTI9dGhpcy5hMTIsYTEzPXRoaXMuYTEzLGEyMT10aGlzLmEyMSxhMjI9dGhpcy5hMjIsYTIzPXRoaXMuYTIzLGEzMT10aGlzLmEzMSxhMzI9dGhpcy5hMzIsYTMzPXRoaXMuYTMzLGk9MDttYXg+aTtpKz0yKXt2YXIgeD1wb2ludHNbaV0seT1wb2ludHNbaSsxXSxkZW5vbWluYXRvcj1hMTMqeCthMjMqeSthMzM7cG9pbnRzW2ldPShhMTEqeCthMjEqeSthMzEpL2Rlbm9taW5hdG9yLHBvaW50c1tpKzFdPShhMTIqeCthMjIqeSthMzIpL2Rlbm9taW5hdG9yfX0sdGhpcy50cmFuc2Zvcm1Qb2ludHMyPWZ1bmN0aW9uKHhWYWx1ZXMseVZhbHVlcyl7Zm9yKHZhciBuPXhWYWx1ZXMubGVuZ3RoLGk9MDtuPmk7aSsrKXt2YXIgeD14VmFsdWVzW2ldLHk9eVZhbHVlc1tpXSxkZW5vbWluYXRvcj10aGlzLmExMyp4K3RoaXMuYTIzKnkrdGhpcy5hMzM7eFZhbHVlc1tpXT0odGhpcy5hMTEqeCt0aGlzLmEyMSp5K3RoaXMuYTMxKS9kZW5vbWluYXRvcix5VmFsdWVzW2ldPSh0aGlzLmExMip4K3RoaXMuYTIyKnkrdGhpcy5hMzIpL2Rlbm9taW5hdG9yfX0sdGhpcy5idWlsZEFkam9pbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IFBlcnNwZWN0aXZlVHJhbnNmb3JtKHRoaXMuYTIyKnRoaXMuYTMzLXRoaXMuYTIzKnRoaXMuYTMyLHRoaXMuYTIzKnRoaXMuYTMxLXRoaXMuYTIxKnRoaXMuYTMzLHRoaXMuYTIxKnRoaXMuYTMyLXRoaXMuYTIyKnRoaXMuYTMxLHRoaXMuYTEzKnRoaXMuYTMyLXRoaXMuYTEyKnRoaXMuYTMzLHRoaXMuYTExKnRoaXMuYTMzLXRoaXMuYTEzKnRoaXMuYTMxLHRoaXMuYTEyKnRoaXMuYTMxLXRoaXMuYTExKnRoaXMuYTMyLHRoaXMuYTEyKnRoaXMuYTIzLXRoaXMuYTEzKnRoaXMuYTIyLHRoaXMuYTEzKnRoaXMuYTIxLXRoaXMuYTExKnRoaXMuYTIzLHRoaXMuYTExKnRoaXMuYTIyLXRoaXMuYTEyKnRoaXMuYTIxKX0sdGhpcy50aW1lcz1mdW5jdGlvbihvdGhlcil7cmV0dXJuIG5ldyBQZXJzcGVjdGl2ZVRyYW5zZm9ybSh0aGlzLmExMSpvdGhlci5hMTErdGhpcy5hMjEqb3RoZXIuYTEyK3RoaXMuYTMxKm90aGVyLmExMyx0aGlzLmExMSpvdGhlci5hMjErdGhpcy5hMjEqb3RoZXIuYTIyK3RoaXMuYTMxKm90aGVyLmEyMyx0aGlzLmExMSpvdGhlci5hMzErdGhpcy5hMjEqb3RoZXIuYTMyK3RoaXMuYTMxKm90aGVyLmEzMyx0aGlzLmExMipvdGhlci5hMTErdGhpcy5hMjIqb3RoZXIuYTEyK3RoaXMuYTMyKm90aGVyLmExMyx0aGlzLmExMipvdGhlci5hMjErdGhpcy5hMjIqb3RoZXIuYTIyK3RoaXMuYTMyKm90aGVyLmEyMyx0aGlzLmExMipvdGhlci5hMzErdGhpcy5hMjIqb3RoZXIuYTMyK3RoaXMuYTMyKm90aGVyLmEzMyx0aGlzLmExMypvdGhlci5hMTErdGhpcy5hMjMqb3RoZXIuYTEyK3RoaXMuYTMzKm90aGVyLmExMyx0aGlzLmExMypvdGhlci5hMjErdGhpcy5hMjMqb3RoZXIuYTIyK3RoaXMuYTMzKm90aGVyLmEyMyx0aGlzLmExMypvdGhlci5hMzErdGhpcy5hMjMqb3RoZXIuYTMyK3RoaXMuYTMzKm90aGVyLmEzMyl9fWZ1bmN0aW9uIERldGVjdG9yUmVzdWx0KGJpdHMscG9pbnRzKXt0aGlzLmJpdHM9Yml0cyx0aGlzLnBvaW50cz1wb2ludHN9ZnVuY3Rpb24gRGV0ZWN0b3IoaW1hZ2Upe3RoaXMuaW1hZ2U9aW1hZ2UsdGhpcy5yZXN1bHRQb2ludENhbGxiYWNrPW51bGwsdGhpcy5zaXplT2ZCbGFja1doaXRlQmxhY2tSdW49ZnVuY3Rpb24oZnJvbVgsZnJvbVksdG9YLHRvWSl7dmFyIHN0ZWVwPU1hdGguYWJzKHRvWS1mcm9tWSk+TWF0aC5hYnModG9YLWZyb21YKTtpZihzdGVlcCl7dmFyIHRlbXA9ZnJvbVg7ZnJvbVg9ZnJvbVksZnJvbVk9dGVtcCx0ZW1wPXRvWCx0b1g9dG9ZLHRvWT10ZW1wfWZvcih2YXIgZHg9TWF0aC5hYnModG9YLWZyb21YKSxkeT1NYXRoLmFicyh0b1ktZnJvbVkpLGVycm9yPS1keD4+MSx5c3RlcD10b1k+ZnJvbVk/MTotMSx4c3RlcD10b1g+ZnJvbVg/MTotMSxzdGF0ZT0wLHg9ZnJvbVgseT1mcm9tWTt4IT10b1g7eCs9eHN0ZXApe3ZhciByZWFsWD1zdGVlcD95OngscmVhbFk9c3RlZXA/eDp5O2lmKDE9PXN0YXRlP3RoaXMuaW1hZ2VbcmVhbFgrcmVhbFkqcXJjb2RlLndpZHRoXSYmc3RhdGUrKzp0aGlzLmltYWdlW3JlYWxYK3JlYWxZKnFyY29kZS53aWR0aF18fHN0YXRlKyssMz09c3RhdGUpe3ZhciBkaWZmWD14LWZyb21YLGRpZmZZPXktZnJvbVk7cmV0dXJuIE1hdGguc3FydChkaWZmWCpkaWZmWCtkaWZmWSpkaWZmWSl9aWYoZXJyb3IrPWR5LGVycm9yPjApe2lmKHk9PXRvWSlicmVhazt5Kz15c3RlcCxlcnJvci09ZHh9fXZhciBkaWZmWDI9dG9YLWZyb21YLGRpZmZZMj10b1ktZnJvbVk7cmV0dXJuIE1hdGguc3FydChkaWZmWDIqZGlmZlgyK2RpZmZZMipkaWZmWTIpfSx0aGlzLnNpemVPZkJsYWNrV2hpdGVCbGFja1J1bkJvdGhXYXlzPWZ1bmN0aW9uKGZyb21YLGZyb21ZLHRvWCx0b1kpe3ZhciByZXN1bHQ9dGhpcy5zaXplT2ZCbGFja1doaXRlQmxhY2tSdW4oZnJvbVgsZnJvbVksdG9YLHRvWSksc2NhbGU9MSxvdGhlclRvWD1mcm9tWC0odG9YLWZyb21YKTswPm90aGVyVG9YPyhzY2FsZT1mcm9tWC8oZnJvbVgtb3RoZXJUb1gpLG90aGVyVG9YPTApOm90aGVyVG9YPj1xcmNvZGUud2lkdGgmJihzY2FsZT0ocXJjb2RlLndpZHRoLTEtZnJvbVgpLyhvdGhlclRvWC1mcm9tWCksb3RoZXJUb1g9cXJjb2RlLndpZHRoLTEpO3ZhciBvdGhlclRvWT1NYXRoLmZsb29yKGZyb21ZLSh0b1ktZnJvbVkpKnNjYWxlKTtyZXR1cm4gc2NhbGU9MSwwPm90aGVyVG9ZPyhzY2FsZT1mcm9tWS8oZnJvbVktb3RoZXJUb1kpLG90aGVyVG9ZPTApOm90aGVyVG9ZPj1xcmNvZGUuaGVpZ2h0JiYoc2NhbGU9KHFyY29kZS5oZWlnaHQtMS1mcm9tWSkvKG90aGVyVG9ZLWZyb21ZKSxvdGhlclRvWT1xcmNvZGUuaGVpZ2h0LTEpLG90aGVyVG9YPU1hdGguZmxvb3IoZnJvbVgrKG90aGVyVG9YLWZyb21YKSpzY2FsZSkscmVzdWx0Kz10aGlzLnNpemVPZkJsYWNrV2hpdGVCbGFja1J1bihmcm9tWCxmcm9tWSxvdGhlclRvWCxvdGhlclRvWSkscmVzdWx0LTF9LHRoaXMuY2FsY3VsYXRlTW9kdWxlU2l6ZU9uZVdheT1mdW5jdGlvbihwYXR0ZXJuLG90aGVyUGF0dGVybil7dmFyIG1vZHVsZVNpemVFc3QxPXRoaXMuc2l6ZU9mQmxhY2tXaGl0ZUJsYWNrUnVuQm90aFdheXMoTWF0aC5mbG9vcihwYXR0ZXJuLlgpLE1hdGguZmxvb3IocGF0dGVybi5ZKSxNYXRoLmZsb29yKG90aGVyUGF0dGVybi5YKSxNYXRoLmZsb29yKG90aGVyUGF0dGVybi5ZKSksbW9kdWxlU2l6ZUVzdDI9dGhpcy5zaXplT2ZCbGFja1doaXRlQmxhY2tSdW5Cb3RoV2F5cyhNYXRoLmZsb29yKG90aGVyUGF0dGVybi5YKSxNYXRoLmZsb29yKG90aGVyUGF0dGVybi5ZKSxNYXRoLmZsb29yKHBhdHRlcm4uWCksTWF0aC5mbG9vcihwYXR0ZXJuLlkpKTtyZXR1cm4gaXNOYU4obW9kdWxlU2l6ZUVzdDEpP21vZHVsZVNpemVFc3QyLzc6aXNOYU4obW9kdWxlU2l6ZUVzdDIpP21vZHVsZVNpemVFc3QxLzc6KG1vZHVsZVNpemVFc3QxK21vZHVsZVNpemVFc3QyKS8xNH0sdGhpcy5jYWxjdWxhdGVNb2R1bGVTaXplPWZ1bmN0aW9uKHRvcExlZnQsdG9wUmlnaHQsYm90dG9tTGVmdCl7cmV0dXJuKHRoaXMuY2FsY3VsYXRlTW9kdWxlU2l6ZU9uZVdheSh0b3BMZWZ0LHRvcFJpZ2h0KSt0aGlzLmNhbGN1bGF0ZU1vZHVsZVNpemVPbmVXYXkodG9wTGVmdCxib3R0b21MZWZ0KSkvMn0sdGhpcy5kaXN0YW5jZT1mdW5jdGlvbihwYXR0ZXJuMSxwYXR0ZXJuMil7cmV0dXJuIHhEaWZmPXBhdHRlcm4xLlgtcGF0dGVybjIuWCx5RGlmZj1wYXR0ZXJuMS5ZLXBhdHRlcm4yLlksTWF0aC5zcXJ0KHhEaWZmKnhEaWZmK3lEaWZmKnlEaWZmKX0sdGhpcy5jb21wdXRlRGltZW5zaW9uPWZ1bmN0aW9uKHRvcExlZnQsdG9wUmlnaHQsYm90dG9tTGVmdCxtb2R1bGVTaXplKXt2YXIgdGx0ckNlbnRlcnNEaW1lbnNpb249TWF0aC5yb3VuZCh0aGlzLmRpc3RhbmNlKHRvcExlZnQsdG9wUmlnaHQpL21vZHVsZVNpemUpLHRsYmxDZW50ZXJzRGltZW5zaW9uPU1hdGgucm91bmQodGhpcy5kaXN0YW5jZSh0b3BMZWZ0LGJvdHRvbUxlZnQpL21vZHVsZVNpemUpLGRpbWVuc2lvbj0odGx0ckNlbnRlcnNEaW1lbnNpb24rdGxibENlbnRlcnNEaW1lbnNpb24+PjEpKzc7c3dpdGNoKDMmZGltZW5zaW9uKXtjYXNlIDA6ZGltZW5zaW9uKys7YnJlYWs7Y2FzZSAyOmRpbWVuc2lvbi0tO2JyZWFrO2Nhc2UgMzp0aHJvd1wiRXJyb3JcIn1yZXR1cm4gZGltZW5zaW9ufSx0aGlzLmZpbmRBbGlnbm1lbnRJblJlZ2lvbj1mdW5jdGlvbihvdmVyYWxsRXN0TW9kdWxlU2l6ZSxlc3RBbGlnbm1lbnRYLGVzdEFsaWdubWVudFksYWxsb3dhbmNlRmFjdG9yKXt2YXIgYWxsb3dhbmNlPU1hdGguZmxvb3IoYWxsb3dhbmNlRmFjdG9yKm92ZXJhbGxFc3RNb2R1bGVTaXplKSxhbGlnbm1lbnRBcmVhTGVmdFg9TWF0aC5tYXgoMCxlc3RBbGlnbm1lbnRYLWFsbG93YW5jZSksYWxpZ25tZW50QXJlYVJpZ2h0WD1NYXRoLm1pbihxcmNvZGUud2lkdGgtMSxlc3RBbGlnbm1lbnRYK2FsbG93YW5jZSk7aWYoMypvdmVyYWxsRXN0TW9kdWxlU2l6ZT5hbGlnbm1lbnRBcmVhUmlnaHRYLWFsaWdubWVudEFyZWFMZWZ0WCl0aHJvd1wiRXJyb3JcIjt2YXIgYWxpZ25tZW50QXJlYVRvcFk9TWF0aC5tYXgoMCxlc3RBbGlnbm1lbnRZLWFsbG93YW5jZSksYWxpZ25tZW50QXJlYUJvdHRvbVk9TWF0aC5taW4ocXJjb2RlLmhlaWdodC0xLGVzdEFsaWdubWVudFkrYWxsb3dhbmNlKSxhbGlnbm1lbnRGaW5kZXI9bmV3IEFsaWdubWVudFBhdHRlcm5GaW5kZXIodGhpcy5pbWFnZSxhbGlnbm1lbnRBcmVhTGVmdFgsYWxpZ25tZW50QXJlYVRvcFksYWxpZ25tZW50QXJlYVJpZ2h0WC1hbGlnbm1lbnRBcmVhTGVmdFgsYWxpZ25tZW50QXJlYUJvdHRvbVktYWxpZ25tZW50QXJlYVRvcFksb3ZlcmFsbEVzdE1vZHVsZVNpemUsdGhpcy5yZXN1bHRQb2ludENhbGxiYWNrKTtyZXR1cm4gYWxpZ25tZW50RmluZGVyLmZpbmQoKX0sdGhpcy5jcmVhdGVUcmFuc2Zvcm09ZnVuY3Rpb24odG9wTGVmdCx0b3BSaWdodCxib3R0b21MZWZ0LGFsaWdubWVudFBhdHRlcm4sZGltZW5zaW9uKXt2YXIgYm90dG9tUmlnaHRYLGJvdHRvbVJpZ2h0WSxzb3VyY2VCb3R0b21SaWdodFgsc291cmNlQm90dG9tUmlnaHRZLGRpbU1pbnVzVGhyZWU9ZGltZW5zaW9uLTMuNTtudWxsIT1hbGlnbm1lbnRQYXR0ZXJuPyhib3R0b21SaWdodFg9YWxpZ25tZW50UGF0dGVybi5YLGJvdHRvbVJpZ2h0WT1hbGlnbm1lbnRQYXR0ZXJuLlksc291cmNlQm90dG9tUmlnaHRYPXNvdXJjZUJvdHRvbVJpZ2h0WT1kaW1NaW51c1RocmVlLTMpOihib3R0b21SaWdodFg9dG9wUmlnaHQuWC10b3BMZWZ0LlgrYm90dG9tTGVmdC5YLGJvdHRvbVJpZ2h0WT10b3BSaWdodC5ZLXRvcExlZnQuWStib3R0b21MZWZ0Llksc291cmNlQm90dG9tUmlnaHRYPXNvdXJjZUJvdHRvbVJpZ2h0WT1kaW1NaW51c1RocmVlKTt2YXIgdHJhbnNmb3JtPVBlcnNwZWN0aXZlVHJhbnNmb3JtLnF1YWRyaWxhdGVyYWxUb1F1YWRyaWxhdGVyYWwoMy41LDMuNSxkaW1NaW51c1RocmVlLDMuNSxzb3VyY2VCb3R0b21SaWdodFgsc291cmNlQm90dG9tUmlnaHRZLDMuNSxkaW1NaW51c1RocmVlLHRvcExlZnQuWCx0b3BMZWZ0LlksdG9wUmlnaHQuWCx0b3BSaWdodC5ZLGJvdHRvbVJpZ2h0WCxib3R0b21SaWdodFksYm90dG9tTGVmdC5YLGJvdHRvbUxlZnQuWSk7cmV0dXJuIHRyYW5zZm9ybX0sdGhpcy5zYW1wbGVHcmlkPWZ1bmN0aW9uKGltYWdlLHRyYW5zZm9ybSxkaW1lbnNpb24pe3ZhciBzYW1wbGVyPUdyaWRTYW1wbGVyO3JldHVybiBzYW1wbGVyLnNhbXBsZUdyaWQzKGltYWdlLGRpbWVuc2lvbix0cmFuc2Zvcm0pfSx0aGlzLnByb2Nlc3NGaW5kZXJQYXR0ZXJuSW5mbz1mdW5jdGlvbihpbmZvKXt2YXIgdG9wTGVmdD1pbmZvLlRvcExlZnQsdG9wUmlnaHQ9aW5mby5Ub3BSaWdodCxib3R0b21MZWZ0PWluZm8uQm90dG9tTGVmdCxtb2R1bGVTaXplPXRoaXMuY2FsY3VsYXRlTW9kdWxlU2l6ZSh0b3BMZWZ0LHRvcFJpZ2h0LGJvdHRvbUxlZnQpO2lmKDE+bW9kdWxlU2l6ZSl0aHJvd1wiRXJyb3JcIjt2YXIgZGltZW5zaW9uPXRoaXMuY29tcHV0ZURpbWVuc2lvbih0b3BMZWZ0LHRvcFJpZ2h0LGJvdHRvbUxlZnQsbW9kdWxlU2l6ZSkscHJvdmlzaW9uYWxWZXJzaW9uPVZlcnNpb24uZ2V0UHJvdmlzaW9uYWxWZXJzaW9uRm9yRGltZW5zaW9uKGRpbWVuc2lvbiksbW9kdWxlc0JldHdlZW5GUENlbnRlcnM9cHJvdmlzaW9uYWxWZXJzaW9uLkRpbWVuc2lvbkZvclZlcnNpb24tNyxhbGlnbm1lbnRQYXR0ZXJuPW51bGw7aWYocHJvdmlzaW9uYWxWZXJzaW9uLkFsaWdubWVudFBhdHRlcm5DZW50ZXJzLmxlbmd0aD4wKWZvcih2YXIgYm90dG9tUmlnaHRYPXRvcFJpZ2h0LlgtdG9wTGVmdC5YK2JvdHRvbUxlZnQuWCxib3R0b21SaWdodFk9dG9wUmlnaHQuWS10b3BMZWZ0LlkrYm90dG9tTGVmdC5ZLGNvcnJlY3Rpb25Ub1RvcExlZnQ9MS0zL21vZHVsZXNCZXR3ZWVuRlBDZW50ZXJzLGVzdEFsaWdubWVudFg9TWF0aC5mbG9vcih0b3BMZWZ0LlgrY29ycmVjdGlvblRvVG9wTGVmdCooYm90dG9tUmlnaHRYLXRvcExlZnQuWCkpLGVzdEFsaWdubWVudFk9TWF0aC5mbG9vcih0b3BMZWZ0LlkrY29ycmVjdGlvblRvVG9wTGVmdCooYm90dG9tUmlnaHRZLXRvcExlZnQuWSkpLGk9NDsxNj49aTtpPDw9MSl7YWxpZ25tZW50UGF0dGVybj10aGlzLmZpbmRBbGlnbm1lbnRJblJlZ2lvbihtb2R1bGVTaXplLGVzdEFsaWdubWVudFgsZXN0QWxpZ25tZW50WSxpKTticmVha312YXIgcG9pbnRzLHRyYW5zZm9ybT10aGlzLmNyZWF0ZVRyYW5zZm9ybSh0b3BMZWZ0LHRvcFJpZ2h0LGJvdHRvbUxlZnQsYWxpZ25tZW50UGF0dGVybixkaW1lbnNpb24pLGJpdHM9dGhpcy5zYW1wbGVHcmlkKHRoaXMuaW1hZ2UsdHJhbnNmb3JtLGRpbWVuc2lvbik7cmV0dXJuIHBvaW50cz1udWxsPT1hbGlnbm1lbnRQYXR0ZXJuP25ldyBBcnJheShib3R0b21MZWZ0LHRvcExlZnQsdG9wUmlnaHQpOm5ldyBBcnJheShib3R0b21MZWZ0LHRvcExlZnQsdG9wUmlnaHQsYWxpZ25tZW50UGF0dGVybiksbmV3IERldGVjdG9yUmVzdWx0KGJpdHMscG9pbnRzKX0sdGhpcy5kZXRlY3Q9ZnVuY3Rpb24oKXt2YXIgaW5mbz0obmV3IEZpbmRlclBhdHRlcm5GaW5kZXIpLmZpbmRGaW5kZXJQYXR0ZXJuKHRoaXMuaW1hZ2UpO3JldHVybiB0aGlzLnByb2Nlc3NGaW5kZXJQYXR0ZXJuSW5mbyhpbmZvKX19ZnVuY3Rpb24gRm9ybWF0SW5mb3JtYXRpb24oZm9ybWF0SW5mbyl7dGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbD1FcnJvckNvcnJlY3Rpb25MZXZlbC5mb3JCaXRzKGZvcm1hdEluZm8+PjMmMyksdGhpcy5kYXRhTWFzaz03JmZvcm1hdEluZm8sdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRXJyb3JDb3JyZWN0aW9uTGV2ZWxcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRGF0YU1hc2tcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmRhdGFNYXNrfSksdGhpcy5HZXRIYXNoQ29kZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsLm9yZGluYWwoKTw8M3xkYXRhTWFza30sdGhpcy5FcXVhbHM9ZnVuY3Rpb24obyl7dmFyIG90aGVyPW87cmV0dXJuIHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWw9PW90aGVyLmVycm9yQ29ycmVjdGlvbkxldmVsJiZ0aGlzLmRhdGFNYXNrPT1vdGhlci5kYXRhTWFza319ZnVuY3Rpb24gRXJyb3JDb3JyZWN0aW9uTGV2ZWwob3JkaW5hbCxiaXRzLG5hbWUpe3RoaXMub3JkaW5hbF9SZW5hbWVkX0ZpZWxkPW9yZGluYWwsdGhpcy5iaXRzPWJpdHMsdGhpcy5uYW1lPW5hbWUsdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQml0c1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYml0c30pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIk5hbWVcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLm5hbWV9KSx0aGlzLm9yZGluYWw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5vcmRpbmFsX1JlbmFtZWRfRmllbGR9fWZ1bmN0aW9uIEJpdE1hdHJpeCh3aWR0aCxoZWlnaHQpe2lmKGhlaWdodHx8KGhlaWdodD13aWR0aCksMT53aWR0aHx8MT5oZWlnaHQpdGhyb3dcIkJvdGggZGltZW5zaW9ucyBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwXCI7dGhpcy53aWR0aD13aWR0aCx0aGlzLmhlaWdodD1oZWlnaHQ7dmFyIHJvd1NpemU9d2lkdGg+PjU7MCE9KDMxJndpZHRoKSYmcm93U2l6ZSsrLHRoaXMucm93U2l6ZT1yb3dTaXplLHRoaXMuYml0cz1uZXcgQXJyYXkocm93U2l6ZSpoZWlnaHQpO2Zvcih2YXIgaT0wO2k8dGhpcy5iaXRzLmxlbmd0aDtpKyspdGhpcy5iaXRzW2ldPTA7dGhpcy5fX2RlZmluZUdldHRlcl9fKFwiV2lkdGhcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLndpZHRofSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiSGVpZ2h0XCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5oZWlnaHR9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJEaW1lbnNpb25cIixmdW5jdGlvbigpe2lmKHRoaXMud2lkdGghPXRoaXMuaGVpZ2h0KXRocm93XCJDYW4ndCBjYWxsIGdldERpbWVuc2lvbigpIG9uIGEgbm9uLXNxdWFyZSBtYXRyaXhcIjtyZXR1cm4gdGhpcy53aWR0aH0pLHRoaXMuZ2V0X1JlbmFtZWQ9ZnVuY3Rpb24oeCx5KXt2YXIgb2Zmc2V0PXkqdGhpcy5yb3dTaXplKyh4Pj41KTtyZXR1cm4gMCE9KDEmVVJTaGlmdCh0aGlzLmJpdHNbb2Zmc2V0XSwzMSZ4KSl9LHRoaXMuc2V0X1JlbmFtZWQ9ZnVuY3Rpb24oeCx5KXt2YXIgb2Zmc2V0PXkqdGhpcy5yb3dTaXplKyh4Pj41KTt0aGlzLmJpdHNbb2Zmc2V0XXw9MTw8KDMxJngpfSx0aGlzLmZsaXA9ZnVuY3Rpb24oeCx5KXt2YXIgb2Zmc2V0PXkqdGhpcy5yb3dTaXplKyh4Pj41KTt0aGlzLmJpdHNbb2Zmc2V0XV49MTw8KDMxJngpfSx0aGlzLmNsZWFyPWZ1bmN0aW9uKCl7Zm9yKHZhciBtYXg9dGhpcy5iaXRzLmxlbmd0aCxpPTA7bWF4Pmk7aSsrKXRoaXMuYml0c1tpXT0wfSx0aGlzLnNldFJlZ2lvbj1mdW5jdGlvbihsZWZ0LHRvcCx3aWR0aCxoZWlnaHQpe2lmKDA+dG9wfHwwPmxlZnQpdGhyb3dcIkxlZnQgYW5kIHRvcCBtdXN0IGJlIG5vbm5lZ2F0aXZlXCI7aWYoMT5oZWlnaHR8fDE+d2lkdGgpdGhyb3dcIkhlaWdodCBhbmQgd2lkdGggbXVzdCBiZSBhdCBsZWFzdCAxXCI7dmFyIHJpZ2h0PWxlZnQrd2lkdGgsYm90dG9tPXRvcCtoZWlnaHQ7aWYoYm90dG9tPnRoaXMuaGVpZ2h0fHxyaWdodD50aGlzLndpZHRoKXRocm93XCJUaGUgcmVnaW9uIG11c3QgZml0IGluc2lkZSB0aGUgbWF0cml4XCI7Zm9yKHZhciB5PXRvcDtib3R0b20+eTt5KyspZm9yKHZhciBvZmZzZXQ9eSp0aGlzLnJvd1NpemUseD1sZWZ0O3JpZ2h0Png7eCsrKXRoaXMuYml0c1tvZmZzZXQrKHg+PjUpXXw9MTw8KDMxJngpfX1mdW5jdGlvbiBEYXRhQmxvY2sobnVtRGF0YUNvZGV3b3Jkcyxjb2Rld29yZHMpe3RoaXMubnVtRGF0YUNvZGV3b3Jkcz1udW1EYXRhQ29kZXdvcmRzLHRoaXMuY29kZXdvcmRzPWNvZGV3b3Jkcyx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJOdW1EYXRhQ29kZXdvcmRzXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5udW1EYXRhQ29kZXdvcmRzfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQ29kZXdvcmRzXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb2Rld29yZHN9KX1mdW5jdGlvbiBCaXRNYXRyaXhQYXJzZXIoYml0TWF0cml4KXt2YXIgZGltZW5zaW9uPWJpdE1hdHJpeC5EaW1lbnNpb247aWYoMjE+ZGltZW5zaW9ufHwxIT0oMyZkaW1lbnNpb24pKXRocm93XCJFcnJvciBCaXRNYXRyaXhQYXJzZXJcIjt0aGlzLmJpdE1hdHJpeD1iaXRNYXRyaXgsdGhpcy5wYXJzZWRWZXJzaW9uPW51bGwsdGhpcy5wYXJzZWRGb3JtYXRJbmZvPW51bGwsdGhpcy5jb3B5Qml0PWZ1bmN0aW9uKGksaix2ZXJzaW9uQml0cyl7cmV0dXJuIHRoaXMuYml0TWF0cml4LmdldF9SZW5hbWVkKGksaik/dmVyc2lvbkJpdHM8PDF8MTp2ZXJzaW9uQml0czw8MX0sdGhpcy5yZWFkRm9ybWF0SW5mb3JtYXRpb249ZnVuY3Rpb24oKXtpZihudWxsIT10aGlzLnBhcnNlZEZvcm1hdEluZm8pcmV0dXJuIHRoaXMucGFyc2VkRm9ybWF0SW5mbztmb3IodmFyIGZvcm1hdEluZm9CaXRzPTAsaT0wOzY+aTtpKyspZm9ybWF0SW5mb0JpdHM9dGhpcy5jb3B5Qml0KGksOCxmb3JtYXRJbmZvQml0cyk7Zm9ybWF0SW5mb0JpdHM9dGhpcy5jb3B5Qml0KDcsOCxmb3JtYXRJbmZvQml0cyksZm9ybWF0SW5mb0JpdHM9dGhpcy5jb3B5Qml0KDgsOCxmb3JtYXRJbmZvQml0cyksZm9ybWF0SW5mb0JpdHM9dGhpcy5jb3B5Qml0KDgsNyxmb3JtYXRJbmZvQml0cyk7Zm9yKHZhciBqPTU7aj49MDtqLS0pZm9ybWF0SW5mb0JpdHM9dGhpcy5jb3B5Qml0KDgsaixmb3JtYXRJbmZvQml0cyk7aWYodGhpcy5wYXJzZWRGb3JtYXRJbmZvPUZvcm1hdEluZm9ybWF0aW9uLmRlY29kZUZvcm1hdEluZm9ybWF0aW9uKGZvcm1hdEluZm9CaXRzKSxudWxsIT10aGlzLnBhcnNlZEZvcm1hdEluZm8pcmV0dXJuIHRoaXMucGFyc2VkRm9ybWF0SW5mbzt2YXIgZGltZW5zaW9uPXRoaXMuYml0TWF0cml4LkRpbWVuc2lvbjtmb3JtYXRJbmZvQml0cz0wO2Zvcih2YXIgaU1pbj1kaW1lbnNpb24tOCxpPWRpbWVuc2lvbi0xO2k+PWlNaW47aS0tKWZvcm1hdEluZm9CaXRzPXRoaXMuY29weUJpdChpLDgsZm9ybWF0SW5mb0JpdHMpO2Zvcih2YXIgaj1kaW1lbnNpb24tNztkaW1lbnNpb24+ajtqKyspZm9ybWF0SW5mb0JpdHM9dGhpcy5jb3B5Qml0KDgsaixmb3JtYXRJbmZvQml0cyk7aWYodGhpcy5wYXJzZWRGb3JtYXRJbmZvPUZvcm1hdEluZm9ybWF0aW9uLmRlY29kZUZvcm1hdEluZm9ybWF0aW9uKGZvcm1hdEluZm9CaXRzKSxudWxsIT10aGlzLnBhcnNlZEZvcm1hdEluZm8pcmV0dXJuIHRoaXMucGFyc2VkRm9ybWF0SW5mbzt0aHJvd1wiRXJyb3IgcmVhZEZvcm1hdEluZm9ybWF0aW9uXCJ9LHRoaXMucmVhZFZlcnNpb249ZnVuY3Rpb24oKXtpZihudWxsIT10aGlzLnBhcnNlZFZlcnNpb24pcmV0dXJuIHRoaXMucGFyc2VkVmVyc2lvbjt2YXIgZGltZW5zaW9uPXRoaXMuYml0TWF0cml4LkRpbWVuc2lvbixwcm92aXNpb25hbFZlcnNpb249ZGltZW5zaW9uLTE3Pj4yO2lmKDY+PXByb3Zpc2lvbmFsVmVyc2lvbilyZXR1cm4gVmVyc2lvbi5nZXRWZXJzaW9uRm9yTnVtYmVyKHByb3Zpc2lvbmFsVmVyc2lvbik7Zm9yKHZhciB2ZXJzaW9uQml0cz0wLGlqTWluPWRpbWVuc2lvbi0xMSxqPTU7aj49MDtqLS0pZm9yKHZhciBpPWRpbWVuc2lvbi05O2k+PWlqTWluO2ktLSl2ZXJzaW9uQml0cz10aGlzLmNvcHlCaXQoaSxqLHZlcnNpb25CaXRzKTtpZih0aGlzLnBhcnNlZFZlcnNpb249VmVyc2lvbi5kZWNvZGVWZXJzaW9uSW5mb3JtYXRpb24odmVyc2lvbkJpdHMpLG51bGwhPXRoaXMucGFyc2VkVmVyc2lvbiYmdGhpcy5wYXJzZWRWZXJzaW9uLkRpbWVuc2lvbkZvclZlcnNpb249PWRpbWVuc2lvbilyZXR1cm4gdGhpcy5wYXJzZWRWZXJzaW9uO3ZlcnNpb25CaXRzPTA7Zm9yKHZhciBpPTU7aT49MDtpLS0pZm9yKHZhciBqPWRpbWVuc2lvbi05O2o+PWlqTWluO2otLSl2ZXJzaW9uQml0cz10aGlzLmNvcHlCaXQoaSxqLHZlcnNpb25CaXRzKTtpZih0aGlzLnBhcnNlZFZlcnNpb249VmVyc2lvbi5kZWNvZGVWZXJzaW9uSW5mb3JtYXRpb24odmVyc2lvbkJpdHMpLG51bGwhPXRoaXMucGFyc2VkVmVyc2lvbiYmdGhpcy5wYXJzZWRWZXJzaW9uLkRpbWVuc2lvbkZvclZlcnNpb249PWRpbWVuc2lvbilyZXR1cm4gdGhpcy5wYXJzZWRWZXJzaW9uO3Rocm93XCJFcnJvciByZWFkVmVyc2lvblwifSx0aGlzLnJlYWRDb2Rld29yZHM9ZnVuY3Rpb24oKXt2YXIgZm9ybWF0SW5mbz10aGlzLnJlYWRGb3JtYXRJbmZvcm1hdGlvbigpLHZlcnNpb249dGhpcy5yZWFkVmVyc2lvbigpLGRhdGFNYXNrPURhdGFNYXNrLmZvclJlZmVyZW5jZShmb3JtYXRJbmZvLkRhdGFNYXNrKSxkaW1lbnNpb249dGhpcy5iaXRNYXRyaXguRGltZW5zaW9uO2RhdGFNYXNrLnVubWFza0JpdE1hdHJpeCh0aGlzLmJpdE1hdHJpeCxkaW1lbnNpb24pO2Zvcih2YXIgZnVuY3Rpb25QYXR0ZXJuPXZlcnNpb24uYnVpbGRGdW5jdGlvblBhdHRlcm4oKSxyZWFkaW5nVXA9ITAscmVzdWx0PW5ldyBBcnJheSh2ZXJzaW9uLlRvdGFsQ29kZXdvcmRzKSxyZXN1bHRPZmZzZXQ9MCxjdXJyZW50Qnl0ZT0wLGJpdHNSZWFkPTAsaj1kaW1lbnNpb24tMTtqPjA7ai09Mil7Nj09aiYmai0tO2Zvcih2YXIgY291bnQ9MDtkaW1lbnNpb24+Y291bnQ7Y291bnQrKylmb3IodmFyIGk9cmVhZGluZ1VwP2RpbWVuc2lvbi0xLWNvdW50OmNvdW50LGNvbD0wOzI+Y29sO2NvbCsrKWZ1bmN0aW9uUGF0dGVybi5nZXRfUmVuYW1lZChqLWNvbCxpKXx8KGJpdHNSZWFkKyssY3VycmVudEJ5dGU8PD0xLHRoaXMuYml0TWF0cml4LmdldF9SZW5hbWVkKGotY29sLGkpJiYoY3VycmVudEJ5dGV8PTEpLDg9PWJpdHNSZWFkJiYocmVzdWx0W3Jlc3VsdE9mZnNldCsrXT1jdXJyZW50Qnl0ZSxiaXRzUmVhZD0wLGN1cnJlbnRCeXRlPTApKTtyZWFkaW5nVXBePSEwfWlmKHJlc3VsdE9mZnNldCE9dmVyc2lvbi5Ub3RhbENvZGV3b3Jkcyl0aHJvd1wiRXJyb3IgcmVhZENvZGV3b3Jkc1wiO3JldHVybiByZXN1bHR9fWZ1bmN0aW9uIERhdGFNYXNrMDAwKCl7dGhpcy51bm1hc2tCaXRNYXRyaXg9ZnVuY3Rpb24oYml0cyxkaW1lbnNpb24pe2Zvcih2YXIgaT0wO2RpbWVuc2lvbj5pO2krKylmb3IodmFyIGo9MDtkaW1lbnNpb24+ajtqKyspdGhpcy5pc01hc2tlZChpLGopJiZiaXRzLmZsaXAoaixpKX0sdGhpcy5pc01hc2tlZD1mdW5jdGlvbihpLGope3JldHVybiAwPT0oaStqJjEpfX1mdW5jdGlvbiBEYXRhTWFzazAwMSgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXtyZXR1cm4gMD09KDEmaSl9fWZ1bmN0aW9uIERhdGFNYXNrMDEwKCl7dGhpcy51bm1hc2tCaXRNYXRyaXg9ZnVuY3Rpb24oYml0cyxkaW1lbnNpb24pe2Zvcih2YXIgaT0wO2RpbWVuc2lvbj5pO2krKylmb3IodmFyIGo9MDtkaW1lbnNpb24+ajtqKyspdGhpcy5pc01hc2tlZChpLGopJiZiaXRzLmZsaXAoaixpKX0sdGhpcy5pc01hc2tlZD1mdW5jdGlvbihpLGope3JldHVybiBqJTM9PTB9fWZ1bmN0aW9uIERhdGFNYXNrMDExKCl7dGhpcy51bm1hc2tCaXRNYXRyaXg9ZnVuY3Rpb24oYml0cyxkaW1lbnNpb24pe2Zvcih2YXIgaT0wO2RpbWVuc2lvbj5pO2krKylmb3IodmFyIGo9MDtkaW1lbnNpb24+ajtqKyspdGhpcy5pc01hc2tlZChpLGopJiZiaXRzLmZsaXAoaixpKX0sdGhpcy5pc01hc2tlZD1mdW5jdGlvbihpLGope3JldHVybihpK2opJTM9PTB9fWZ1bmN0aW9uIERhdGFNYXNrMTAwKCl7dGhpcy51bm1hc2tCaXRNYXRyaXg9ZnVuY3Rpb24oYml0cyxkaW1lbnNpb24pe2Zvcih2YXIgaT0wO2RpbWVuc2lvbj5pO2krKylmb3IodmFyIGo9MDtkaW1lbnNpb24+ajtqKyspdGhpcy5pc01hc2tlZChpLGopJiZiaXRzLmZsaXAoaixpKX0sdGhpcy5pc01hc2tlZD1mdW5jdGlvbihpLGope3JldHVybiAwPT0oVVJTaGlmdChpLDEpK2ovMyYxKX19ZnVuY3Rpb24gRGF0YU1hc2sxMDEoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7dmFyIHRlbXA9aSpqO3JldHVybigxJnRlbXApK3RlbXAlMz09MH19ZnVuY3Rpb24gRGF0YU1hc2sxMTAoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7dmFyIHRlbXA9aSpqO3JldHVybiAwPT0oKDEmdGVtcCkrdGVtcCUzJjEpfX1mdW5jdGlvbiBEYXRhTWFzazExMSgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXtyZXR1cm4gMD09KChpK2omMSkraSpqJTMmMSl9fWZ1bmN0aW9uIFJlZWRTb2xvbW9uRGVjb2RlcihmaWVsZCl7dGhpcy5maWVsZD1maWVsZCx0aGlzLmRlY29kZT1mdW5jdGlvbihyZWNlaXZlZCx0d29TKXtmb3IodmFyIHBvbHk9bmV3IEdGMjU2UG9seSh0aGlzLmZpZWxkLHJlY2VpdmVkKSxzeW5kcm9tZUNvZWZmaWNpZW50cz1uZXcgQXJyYXkodHdvUyksaT0wO2k8c3luZHJvbWVDb2VmZmljaWVudHMubGVuZ3RoO2krKylzeW5kcm9tZUNvZWZmaWNpZW50c1tpXT0wO2Zvcih2YXIgZGF0YU1hdHJpeD0hMSxub0Vycm9yPSEwLGk9MDt0d29TPmk7aSsrKXt2YXIgZXZhbD1wb2x5LmV2YWx1YXRlQXQodGhpcy5maWVsZC5leHAoZGF0YU1hdHJpeD9pKzE6aSkpO3N5bmRyb21lQ29lZmZpY2llbnRzW3N5bmRyb21lQ29lZmZpY2llbnRzLmxlbmd0aC0xLWldPWV2YWwsMCE9ZXZhbCYmKG5vRXJyb3I9ITEpfWlmKCFub0Vycm9yKWZvcih2YXIgc3luZHJvbWU9bmV3IEdGMjU2UG9seSh0aGlzLmZpZWxkLHN5bmRyb21lQ29lZmZpY2llbnRzKSxzaWdtYU9tZWdhPXRoaXMucnVuRXVjbGlkZWFuQWxnb3JpdGhtKHRoaXMuZmllbGQuYnVpbGRNb25vbWlhbCh0d29TLDEpLHN5bmRyb21lLHR3b1MpLHNpZ21hPXNpZ21hT21lZ2FbMF0sb21lZ2E9c2lnbWFPbWVnYVsxXSxlcnJvckxvY2F0aW9ucz10aGlzLmZpbmRFcnJvckxvY2F0aW9ucyhzaWdtYSksZXJyb3JNYWduaXR1ZGVzPXRoaXMuZmluZEVycm9yTWFnbml0dWRlcyhvbWVnYSxlcnJvckxvY2F0aW9ucyxkYXRhTWF0cml4KSxpPTA7aTxlcnJvckxvY2F0aW9ucy5sZW5ndGg7aSsrKXt2YXIgcG9zaXRpb249cmVjZWl2ZWQubGVuZ3RoLTEtdGhpcy5maWVsZC5sb2coZXJyb3JMb2NhdGlvbnNbaV0pO2lmKDA+cG9zaXRpb24pdGhyb3dcIlJlZWRTb2xvbW9uRXhjZXB0aW9uIEJhZCBlcnJvciBsb2NhdGlvblwiO3JlY2VpdmVkW3Bvc2l0aW9uXT1HRjI1Ni5hZGRPclN1YnRyYWN0KHJlY2VpdmVkW3Bvc2l0aW9uXSxlcnJvck1hZ25pdHVkZXNbaV0pfX0sdGhpcy5ydW5FdWNsaWRlYW5BbGdvcml0aG09ZnVuY3Rpb24oYSxiLFIpe2lmKGEuRGVncmVlPGIuRGVncmVlKXt2YXIgdGVtcD1hO2E9YixiPXRlbXB9Zm9yKHZhciByTGFzdD1hLHI9YixzTGFzdD10aGlzLmZpZWxkLk9uZSxzPXRoaXMuZmllbGQuWmVybyx0TGFzdD10aGlzLmZpZWxkLlplcm8sdD10aGlzLmZpZWxkLk9uZTtyLkRlZ3JlZT49TWF0aC5mbG9vcihSLzIpOyl7dmFyIHJMYXN0TGFzdD1yTGFzdCxzTGFzdExhc3Q9c0xhc3QsdExhc3RMYXN0PXRMYXN0O2lmKHJMYXN0PXIsc0xhc3Q9cyx0TGFzdD10LHJMYXN0Llplcm8pdGhyb3dcInJfe2ktMX0gd2FzIHplcm9cIjtyPXJMYXN0TGFzdDtmb3IodmFyIHE9dGhpcy5maWVsZC5aZXJvLGRlbm9taW5hdG9yTGVhZGluZ1Rlcm09ckxhc3QuZ2V0Q29lZmZpY2llbnQockxhc3QuRGVncmVlKSxkbHRJbnZlcnNlPXRoaXMuZmllbGQuaW52ZXJzZShkZW5vbWluYXRvckxlYWRpbmdUZXJtKTtyLkRlZ3JlZT49ckxhc3QuRGVncmVlJiYhci5aZXJvOyl7dmFyIGRlZ3JlZURpZmY9ci5EZWdyZWUtckxhc3QuRGVncmVlLHNjYWxlPXRoaXMuZmllbGQubXVsdGlwbHkoci5nZXRDb2VmZmljaWVudChyLkRlZ3JlZSksZGx0SW52ZXJzZSk7cT1xLmFkZE9yU3VidHJhY3QodGhpcy5maWVsZC5idWlsZE1vbm9taWFsKGRlZ3JlZURpZmYsc2NhbGUpKSxyPXIuYWRkT3JTdWJ0cmFjdChyTGFzdC5tdWx0aXBseUJ5TW9ub21pYWwoZGVncmVlRGlmZixzY2FsZSkpfXM9cS5tdWx0aXBseTEoc0xhc3QpLmFkZE9yU3VidHJhY3Qoc0xhc3RMYXN0KSx0PXEubXVsdGlwbHkxKHRMYXN0KS5hZGRPclN1YnRyYWN0KHRMYXN0TGFzdCl9dmFyIHNpZ21hVGlsZGVBdFplcm89dC5nZXRDb2VmZmljaWVudCgwKTtpZigwPT1zaWdtYVRpbGRlQXRaZXJvKXRocm93XCJSZWVkU29sb21vbkV4Y2VwdGlvbiBzaWdtYVRpbGRlKDApIHdhcyB6ZXJvXCI7dmFyIGludmVyc2U9dGhpcy5maWVsZC5pbnZlcnNlKHNpZ21hVGlsZGVBdFplcm8pLHNpZ21hPXQubXVsdGlwbHkyKGludmVyc2UpLG9tZWdhPXIubXVsdGlwbHkyKGludmVyc2UpO3JldHVybiBuZXcgQXJyYXkoc2lnbWEsb21lZ2EpfSx0aGlzLmZpbmRFcnJvckxvY2F0aW9ucz1mdW5jdGlvbihlcnJvckxvY2F0b3Ipe3ZhciBudW1FcnJvcnM9ZXJyb3JMb2NhdG9yLkRlZ3JlZTtpZigxPT1udW1FcnJvcnMpcmV0dXJuIG5ldyBBcnJheShlcnJvckxvY2F0b3IuZ2V0Q29lZmZpY2llbnQoMSkpO2Zvcih2YXIgcmVzdWx0PW5ldyBBcnJheShudW1FcnJvcnMpLGU9MCxpPTE7MjU2PmkmJm51bUVycm9ycz5lO2krKykwPT1lcnJvckxvY2F0b3IuZXZhbHVhdGVBdChpKSYmKHJlc3VsdFtlXT10aGlzLmZpZWxkLmludmVyc2UoaSksZSsrKTtpZihlIT1udW1FcnJvcnMpdGhyb3dcIkVycm9yIGxvY2F0b3IgZGVncmVlIGRvZXMgbm90IG1hdGNoIG51bWJlciBvZiByb290c1wiO3JldHVybiByZXN1bHR9LHRoaXMuZmluZEVycm9yTWFnbml0dWRlcz1mdW5jdGlvbihlcnJvckV2YWx1YXRvcixlcnJvckxvY2F0aW9ucyxkYXRhTWF0cml4KXtmb3IodmFyIHM9ZXJyb3JMb2NhdGlvbnMubGVuZ3RoLHJlc3VsdD1uZXcgQXJyYXkocyksaT0wO3M+aTtpKyspe2Zvcih2YXIgeGlJbnZlcnNlPXRoaXMuZmllbGQuaW52ZXJzZShlcnJvckxvY2F0aW9uc1tpXSksZGVub21pbmF0b3I9MSxqPTA7cz5qO2orKylpIT1qJiYoZGVub21pbmF0b3I9dGhpcy5maWVsZC5tdWx0aXBseShkZW5vbWluYXRvcixHRjI1Ni5hZGRPclN1YnRyYWN0KDEsdGhpcy5maWVsZC5tdWx0aXBseShlcnJvckxvY2F0aW9uc1tqXSx4aUludmVyc2UpKSkpO3Jlc3VsdFtpXT10aGlzLmZpZWxkLm11bHRpcGx5KGVycm9yRXZhbHVhdG9yLmV2YWx1YXRlQXQoeGlJbnZlcnNlKSx0aGlzLmZpZWxkLmludmVyc2UoZGVub21pbmF0b3IpKSxkYXRhTWF0cml4JiYocmVzdWx0W2ldPXRoaXMuZmllbGQubXVsdGlwbHkocmVzdWx0W2ldLHhpSW52ZXJzZSkpfXJldHVybiByZXN1bHR9fWZ1bmN0aW9uIEdGMjU2UG9seShmaWVsZCxjb2VmZmljaWVudHMpe2lmKG51bGw9PWNvZWZmaWNpZW50c3x8MD09Y29lZmZpY2llbnRzLmxlbmd0aCl0aHJvd1wiU3lzdGVtLkFyZ3VtZW50RXhjZXB0aW9uXCI7dGhpcy5maWVsZD1maWVsZDt2YXIgY29lZmZpY2llbnRzTGVuZ3RoPWNvZWZmaWNpZW50cy5sZW5ndGg7aWYoY29lZmZpY2llbnRzTGVuZ3RoPjEmJjA9PWNvZWZmaWNpZW50c1swXSl7Zm9yKHZhciBmaXJzdE5vblplcm89MTtjb2VmZmljaWVudHNMZW5ndGg+Zmlyc3ROb25aZXJvJiYwPT1jb2VmZmljaWVudHNbZmlyc3ROb25aZXJvXTspZmlyc3ROb25aZXJvKys7aWYoZmlyc3ROb25aZXJvPT1jb2VmZmljaWVudHNMZW5ndGgpdGhpcy5jb2VmZmljaWVudHM9ZmllbGQuWmVyby5jb2VmZmljaWVudHM7ZWxzZXt0aGlzLmNvZWZmaWNpZW50cz1uZXcgQXJyYXkoY29lZmZpY2llbnRzTGVuZ3RoLWZpcnN0Tm9uWmVybyk7Zm9yKHZhciBpPTA7aTx0aGlzLmNvZWZmaWNpZW50cy5sZW5ndGg7aSsrKXRoaXMuY29lZmZpY2llbnRzW2ldPTA7Zm9yKHZhciBjaT0wO2NpPHRoaXMuY29lZmZpY2llbnRzLmxlbmd0aDtjaSsrKXRoaXMuY29lZmZpY2llbnRzW2NpXT1jb2VmZmljaWVudHNbZmlyc3ROb25aZXJvK2NpXX19ZWxzZSB0aGlzLmNvZWZmaWNpZW50cz1jb2VmZmljaWVudHM7dGhpcy5fX2RlZmluZUdldHRlcl9fKFwiWmVyb1wiLGZ1bmN0aW9uKCl7cmV0dXJuIDA9PXRoaXMuY29lZmZpY2llbnRzWzBdfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRGVncmVlXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb2VmZmljaWVudHMubGVuZ3RoLTF9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJDb2VmZmljaWVudHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvZWZmaWNpZW50c30pLHRoaXMuZ2V0Q29lZmZpY2llbnQ9ZnVuY3Rpb24oZGVncmVlKXtyZXR1cm4gdGhpcy5jb2VmZmljaWVudHNbdGhpcy5jb2VmZmljaWVudHMubGVuZ3RoLTEtZGVncmVlXX0sdGhpcy5ldmFsdWF0ZUF0PWZ1bmN0aW9uKGEpe2lmKDA9PWEpcmV0dXJuIHRoaXMuZ2V0Q29lZmZpY2llbnQoMCk7dmFyIHNpemU9dGhpcy5jb2VmZmljaWVudHMubGVuZ3RoO2lmKDE9PWEpe2Zvcih2YXIgcmVzdWx0PTAsaT0wO3NpemU+aTtpKyspcmVzdWx0PUdGMjU2LmFkZE9yU3VidHJhY3QocmVzdWx0LHRoaXMuY29lZmZpY2llbnRzW2ldKTtyZXR1cm4gcmVzdWx0fWZvcih2YXIgcmVzdWx0Mj10aGlzLmNvZWZmaWNpZW50c1swXSxpPTE7c2l6ZT5pO2krKylyZXN1bHQyPUdGMjU2LmFkZE9yU3VidHJhY3QodGhpcy5maWVsZC5tdWx0aXBseShhLHJlc3VsdDIpLHRoaXMuY29lZmZpY2llbnRzW2ldKTtyZXR1cm4gcmVzdWx0Mn0sdGhpcy5hZGRPclN1YnRyYWN0PWZ1bmN0aW9uKG90aGVyKXtpZih0aGlzLmZpZWxkIT1vdGhlci5maWVsZCl0aHJvd1wiR0YyNTZQb2x5cyBkbyBub3QgaGF2ZSBzYW1lIEdGMjU2IGZpZWxkXCI7aWYodGhpcy5aZXJvKXJldHVybiBvdGhlcjtpZihvdGhlci5aZXJvKXJldHVybiB0aGlzO3ZhciBzbWFsbGVyQ29lZmZpY2llbnRzPXRoaXMuY29lZmZpY2llbnRzLGxhcmdlckNvZWZmaWNpZW50cz1vdGhlci5jb2VmZmljaWVudHM7aWYoc21hbGxlckNvZWZmaWNpZW50cy5sZW5ndGg+bGFyZ2VyQ29lZmZpY2llbnRzLmxlbmd0aCl7dmFyIHRlbXA9c21hbGxlckNvZWZmaWNpZW50cztzbWFsbGVyQ29lZmZpY2llbnRzPWxhcmdlckNvZWZmaWNpZW50cyxsYXJnZXJDb2VmZmljaWVudHM9dGVtcH1mb3IodmFyIHN1bURpZmY9bmV3IEFycmF5KGxhcmdlckNvZWZmaWNpZW50cy5sZW5ndGgpLGxlbmd0aERpZmY9bGFyZ2VyQ29lZmZpY2llbnRzLmxlbmd0aC1zbWFsbGVyQ29lZmZpY2llbnRzLmxlbmd0aCxjaT0wO2xlbmd0aERpZmY+Y2k7Y2krKylzdW1EaWZmW2NpXT1sYXJnZXJDb2VmZmljaWVudHNbY2ldO2Zvcih2YXIgaT1sZW5ndGhEaWZmO2k8bGFyZ2VyQ29lZmZpY2llbnRzLmxlbmd0aDtpKyspc3VtRGlmZltpXT1HRjI1Ni5hZGRPclN1YnRyYWN0KHNtYWxsZXJDb2VmZmljaWVudHNbaS1sZW5ndGhEaWZmXSxsYXJnZXJDb2VmZmljaWVudHNbaV0pO3JldHVybiBuZXcgR0YyNTZQb2x5KGZpZWxkLHN1bURpZmYpfSx0aGlzLm11bHRpcGx5MT1mdW5jdGlvbihvdGhlcil7aWYodGhpcy5maWVsZCE9b3RoZXIuZmllbGQpdGhyb3dcIkdGMjU2UG9seXMgZG8gbm90IGhhdmUgc2FtZSBHRjI1NiBmaWVsZFwiO2lmKHRoaXMuWmVyb3x8b3RoZXIuWmVybylyZXR1cm4gdGhpcy5maWVsZC5aZXJvO2Zvcih2YXIgYUNvZWZmaWNpZW50cz10aGlzLmNvZWZmaWNpZW50cyxhTGVuZ3RoPWFDb2VmZmljaWVudHMubGVuZ3RoLGJDb2VmZmljaWVudHM9b3RoZXIuY29lZmZpY2llbnRzLGJMZW5ndGg9YkNvZWZmaWNpZW50cy5sZW5ndGgscHJvZHVjdD1uZXcgQXJyYXkoYUxlbmd0aCtiTGVuZ3RoLTEpLGk9MDthTGVuZ3RoPmk7aSsrKWZvcih2YXIgYUNvZWZmPWFDb2VmZmljaWVudHNbaV0saj0wO2JMZW5ndGg+ajtqKyspcHJvZHVjdFtpK2pdPUdGMjU2LmFkZE9yU3VidHJhY3QocHJvZHVjdFtpK2pdLHRoaXMuZmllbGQubXVsdGlwbHkoYUNvZWZmLGJDb2VmZmljaWVudHNbal0pKTtyZXR1cm4gbmV3IEdGMjU2UG9seSh0aGlzLmZpZWxkLHByb2R1Y3QpfSx0aGlzLm11bHRpcGx5Mj1mdW5jdGlvbihzY2FsYXIpe2lmKDA9PXNjYWxhcilyZXR1cm4gdGhpcy5maWVsZC5aZXJvO2lmKDE9PXNjYWxhcilyZXR1cm4gdGhpcztmb3IodmFyIHNpemU9dGhpcy5jb2VmZmljaWVudHMubGVuZ3RoLHByb2R1Y3Q9bmV3IEFycmF5KHNpemUpLGk9MDtzaXplPmk7aSsrKXByb2R1Y3RbaV09dGhpcy5maWVsZC5tdWx0aXBseSh0aGlzLmNvZWZmaWNpZW50c1tpXSxzY2FsYXIpO3JldHVybiBuZXcgR0YyNTZQb2x5KHRoaXMuZmllbGQscHJvZHVjdCl9LHRoaXMubXVsdGlwbHlCeU1vbm9taWFsPWZ1bmN0aW9uKGRlZ3JlZSxjb2VmZmljaWVudCl7aWYoMD5kZWdyZWUpdGhyb3dcIlN5c3RlbS5Bcmd1bWVudEV4Y2VwdGlvblwiO2lmKDA9PWNvZWZmaWNpZW50KXJldHVybiB0aGlzLmZpZWxkLlplcm87Zm9yKHZhciBzaXplPXRoaXMuY29lZmZpY2llbnRzLmxlbmd0aCxwcm9kdWN0PW5ldyBBcnJheShzaXplK2RlZ3JlZSksaT0wO2k8cHJvZHVjdC5sZW5ndGg7aSsrKXByb2R1Y3RbaV09MDtmb3IodmFyIGk9MDtzaXplPmk7aSsrKXByb2R1Y3RbaV09dGhpcy5maWVsZC5tdWx0aXBseSh0aGlzLmNvZWZmaWNpZW50c1tpXSxjb2VmZmljaWVudCk7cmV0dXJuIG5ldyBHRjI1NlBvbHkodGhpcy5maWVsZCxwcm9kdWN0KX0sdGhpcy5kaXZpZGU9ZnVuY3Rpb24ob3RoZXIpe2lmKHRoaXMuZmllbGQhPW90aGVyLmZpZWxkKXRocm93XCJHRjI1NlBvbHlzIGRvIG5vdCBoYXZlIHNhbWUgR0YyNTYgZmllbGRcIjtpZihvdGhlci5aZXJvKXRocm93XCJEaXZpZGUgYnkgMFwiO2Zvcih2YXIgcXVvdGllbnQ9dGhpcy5maWVsZC5aZXJvLHJlbWFpbmRlcj10aGlzLGRlbm9taW5hdG9yTGVhZGluZ1Rlcm09b3RoZXIuZ2V0Q29lZmZpY2llbnQob3RoZXIuRGVncmVlKSxpbnZlcnNlRGVub21pbmF0b3JMZWFkaW5nVGVybT10aGlzLmZpZWxkLmludmVyc2UoZGVub21pbmF0b3JMZWFkaW5nVGVybSk7cmVtYWluZGVyLkRlZ3JlZT49b3RoZXIuRGVncmVlJiYhcmVtYWluZGVyLlplcm87KXtcclxuICAgIHZhciBkZWdyZWVEaWZmZXJlbmNlPXJlbWFpbmRlci5EZWdyZWUtb3RoZXIuRGVncmVlLHNjYWxlPXRoaXMuZmllbGQubXVsdGlwbHkocmVtYWluZGVyLmdldENvZWZmaWNpZW50KHJlbWFpbmRlci5EZWdyZWUpLGludmVyc2VEZW5vbWluYXRvckxlYWRpbmdUZXJtKSx0ZXJtPW90aGVyLm11bHRpcGx5QnlNb25vbWlhbChkZWdyZWVEaWZmZXJlbmNlLHNjYWxlKSxpdGVyYXRpb25RdW90aWVudD10aGlzLmZpZWxkLmJ1aWxkTW9ub21pYWwoZGVncmVlRGlmZmVyZW5jZSxzY2FsZSk7cXVvdGllbnQ9cXVvdGllbnQuYWRkT3JTdWJ0cmFjdChpdGVyYXRpb25RdW90aWVudCkscmVtYWluZGVyPXJlbWFpbmRlci5hZGRPclN1YnRyYWN0KHRlcm0pfXJldHVybiBuZXcgQXJyYXkocXVvdGllbnQscmVtYWluZGVyKX19ZnVuY3Rpb24gR0YyNTYocHJpbWl0aXZlKXt0aGlzLmV4cFRhYmxlPW5ldyBBcnJheSgyNTYpLHRoaXMubG9nVGFibGU9bmV3IEFycmF5KDI1Nik7Zm9yKHZhciB4PTEsaT0wOzI1Nj5pO2krKyl0aGlzLmV4cFRhYmxlW2ldPXgseDw8PTEseD49MjU2JiYoeF49cHJpbWl0aXZlKTtmb3IodmFyIGk9MDsyNTU+aTtpKyspdGhpcy5sb2dUYWJsZVt0aGlzLmV4cFRhYmxlW2ldXT1pO3ZhciBhdDA9bmV3IEFycmF5KDEpO2F0MFswXT0wLHRoaXMuemVybz1uZXcgR0YyNTZQb2x5KHRoaXMsbmV3IEFycmF5KGF0MCkpO3ZhciBhdDE9bmV3IEFycmF5KDEpO2F0MVswXT0xLHRoaXMub25lPW5ldyBHRjI1NlBvbHkodGhpcyxuZXcgQXJyYXkoYXQxKSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiWmVyb1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuemVyb30pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIk9uZVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMub25lfSksdGhpcy5idWlsZE1vbm9taWFsPWZ1bmN0aW9uKGRlZ3JlZSxjb2VmZmljaWVudCl7aWYoMD5kZWdyZWUpdGhyb3dcIlN5c3RlbS5Bcmd1bWVudEV4Y2VwdGlvblwiO2lmKDA9PWNvZWZmaWNpZW50KXJldHVybiB6ZXJvO2Zvcih2YXIgY29lZmZpY2llbnRzPW5ldyBBcnJheShkZWdyZWUrMSksaT0wO2k8Y29lZmZpY2llbnRzLmxlbmd0aDtpKyspY29lZmZpY2llbnRzW2ldPTA7cmV0dXJuIGNvZWZmaWNpZW50c1swXT1jb2VmZmljaWVudCxuZXcgR0YyNTZQb2x5KHRoaXMsY29lZmZpY2llbnRzKX0sdGhpcy5leHA9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuZXhwVGFibGVbYV19LHRoaXMubG9nPWZ1bmN0aW9uKGEpe2lmKDA9PWEpdGhyb3dcIlN5c3RlbS5Bcmd1bWVudEV4Y2VwdGlvblwiO3JldHVybiB0aGlzLmxvZ1RhYmxlW2FdfSx0aGlzLmludmVyc2U9ZnVuY3Rpb24oYSl7aWYoMD09YSl0aHJvd1wiU3lzdGVtLkFyaXRobWV0aWNFeGNlcHRpb25cIjtyZXR1cm4gdGhpcy5leHBUYWJsZVsyNTUtdGhpcy5sb2dUYWJsZVthXV19LHRoaXMubXVsdGlwbHk9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gMD09YXx8MD09Yj8wOjE9PWE/YjoxPT1iP2E6dGhpcy5leHBUYWJsZVsodGhpcy5sb2dUYWJsZVthXSt0aGlzLmxvZ1RhYmxlW2JdKSUyNTVdfX1mdW5jdGlvbiBVUlNoaWZ0KG51bWJlcixiaXRzKXtyZXR1cm4gbnVtYmVyPj0wP251bWJlcj4+Yml0czoobnVtYmVyPj5iaXRzKSsoMjw8fmJpdHMpfWZ1bmN0aW9uIEZpbmRlclBhdHRlcm4ocG9zWCxwb3NZLGVzdGltYXRlZE1vZHVsZVNpemUpe3RoaXMueD1wb3NYLHRoaXMueT1wb3NZLHRoaXMuY291bnQ9MSx0aGlzLmVzdGltYXRlZE1vZHVsZVNpemU9ZXN0aW1hdGVkTW9kdWxlU2l6ZSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJFc3RpbWF0ZWRNb2R1bGVTaXplXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQ291bnRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvdW50fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiWFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIllcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLnl9KSx0aGlzLmluY3JlbWVudENvdW50PWZ1bmN0aW9uKCl7dGhpcy5jb3VudCsrfSx0aGlzLmFib3V0RXF1YWxzPWZ1bmN0aW9uKG1vZHVsZVNpemUsaSxqKXtpZihNYXRoLmFicyhpLXRoaXMueSk8PW1vZHVsZVNpemUmJk1hdGguYWJzKGotdGhpcy54KTw9bW9kdWxlU2l6ZSl7dmFyIG1vZHVsZVNpemVEaWZmPU1hdGguYWJzKG1vZHVsZVNpemUtdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplKTtyZXR1cm4gMT49bW9kdWxlU2l6ZURpZmZ8fG1vZHVsZVNpemVEaWZmL3RoaXMuZXN0aW1hdGVkTW9kdWxlU2l6ZTw9MX1yZXR1cm4hMX19ZnVuY3Rpb24gRmluZGVyUGF0dGVybkluZm8ocGF0dGVybkNlbnRlcnMpe3RoaXMuYm90dG9tTGVmdD1wYXR0ZXJuQ2VudGVyc1swXSx0aGlzLnRvcExlZnQ9cGF0dGVybkNlbnRlcnNbMV0sdGhpcy50b3BSaWdodD1wYXR0ZXJuQ2VudGVyc1syXSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJCb3R0b21MZWZ0XCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ib3R0b21MZWZ0fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiVG9wTGVmdFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudG9wTGVmdH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIlRvcFJpZ2h0XCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50b3BSaWdodH0pfWZ1bmN0aW9uIEZpbmRlclBhdHRlcm5GaW5kZXIoKXt0aGlzLmltYWdlPW51bGwsdGhpcy5wb3NzaWJsZUNlbnRlcnM9W10sdGhpcy5oYXNTa2lwcGVkPSExLHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnQ9bmV3IEFycmF5KDAsMCwwLDAsMCksdGhpcy5yZXN1bHRQb2ludENhbGxiYWNrPW51bGwsdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQ3Jvc3NDaGVja1N0YXRlQ291bnRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50WzBdPTAsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudFsxXT0wLHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnRbMl09MCx0aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50WzNdPTAsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudFs0XT0wLHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnR9KSx0aGlzLmZvdW5kUGF0dGVybkNyb3NzPWZ1bmN0aW9uKHN0YXRlQ291bnQpe2Zvcih2YXIgdG90YWxNb2R1bGVTaXplPTAsaT0wOzU+aTtpKyspe3ZhciBjb3VudD1zdGF0ZUNvdW50W2ldO2lmKDA9PWNvdW50KXJldHVybiExO3RvdGFsTW9kdWxlU2l6ZSs9Y291bnR9aWYoNz50b3RhbE1vZHVsZVNpemUpcmV0dXJuITE7dmFyIG1vZHVsZVNpemU9TWF0aC5mbG9vcigodG90YWxNb2R1bGVTaXplPDxJTlRFR0VSX01BVEhfU0hJRlQpLzcpLG1heFZhcmlhbmNlPU1hdGguZmxvb3IobW9kdWxlU2l6ZS8yKTtyZXR1cm4gTWF0aC5hYnMobW9kdWxlU2l6ZS0oc3RhdGVDb3VudFswXTw8SU5URUdFUl9NQVRIX1NISUZUKSk8bWF4VmFyaWFuY2UmJk1hdGguYWJzKG1vZHVsZVNpemUtKHN0YXRlQ291bnRbMV08PElOVEVHRVJfTUFUSF9TSElGVCkpPG1heFZhcmlhbmNlJiZNYXRoLmFicygzKm1vZHVsZVNpemUtKHN0YXRlQ291bnRbMl08PElOVEVHRVJfTUFUSF9TSElGVCkpPDMqbWF4VmFyaWFuY2UmJk1hdGguYWJzKG1vZHVsZVNpemUtKHN0YXRlQ291bnRbM108PElOVEVHRVJfTUFUSF9TSElGVCkpPG1heFZhcmlhbmNlJiZNYXRoLmFicyhtb2R1bGVTaXplLShzdGF0ZUNvdW50WzRdPDxJTlRFR0VSX01BVEhfU0hJRlQpKTxtYXhWYXJpYW5jZX0sdGhpcy5jZW50ZXJGcm9tRW5kPWZ1bmN0aW9uKHN0YXRlQ291bnQsZW5kKXtyZXR1cm4gZW5kLXN0YXRlQ291bnRbNF0tc3RhdGVDb3VudFszXS1zdGF0ZUNvdW50WzJdLzJ9LHRoaXMuY3Jvc3NDaGVja1ZlcnRpY2FsPWZ1bmN0aW9uKHN0YXJ0SSxjZW50ZXJKLG1heENvdW50LG9yaWdpbmFsU3RhdGVDb3VudFRvdGFsKXtmb3IodmFyIGltYWdlPXRoaXMuaW1hZ2UsbWF4ST1xcmNvZGUuaGVpZ2h0LHN0YXRlQ291bnQ9dGhpcy5Dcm9zc0NoZWNrU3RhdGVDb3VudCxpPXN0YXJ0STtpPj0wJiZpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXTspc3RhdGVDb3VudFsyXSsrLGktLTtpZigwPmkpcmV0dXJuIE5hTjtmb3IoO2k+PTAmJiFpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFsxXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMV0rKyxpLS07aWYoMD5pfHxzdGF0ZUNvdW50WzFdPm1heENvdW50KXJldHVybiBOYU47Zm9yKDtpPj0wJiZpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFswXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMF0rKyxpLS07aWYoc3RhdGVDb3VudFswXT5tYXhDb3VudClyZXR1cm4gTmFOO2ZvcihpPXN0YXJ0SSsxO21heEk+aSYmaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF07KXN0YXRlQ291bnRbMl0rKyxpKys7aWYoaT09bWF4SSlyZXR1cm4gTmFOO2Zvcig7bWF4ST5pJiYhaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbM108bWF4Q291bnQ7KXN0YXRlQ291bnRbM10rKyxpKys7aWYoaT09bWF4SXx8c3RhdGVDb3VudFszXT49bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoO21heEk+aSYmaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbNF08bWF4Q291bnQ7KXN0YXRlQ291bnRbNF0rKyxpKys7aWYoc3RhdGVDb3VudFs0XT49bWF4Q291bnQpcmV0dXJuIE5hTjt2YXIgc3RhdGVDb3VudFRvdGFsPXN0YXRlQ291bnRbMF0rc3RhdGVDb3VudFsxXStzdGF0ZUNvdW50WzJdK3N0YXRlQ291bnRbM10rc3RhdGVDb3VudFs0XTtyZXR1cm4gNSpNYXRoLmFicyhzdGF0ZUNvdW50VG90YWwtb3JpZ2luYWxTdGF0ZUNvdW50VG90YWwpPj0yKm9yaWdpbmFsU3RhdGVDb3VudFRvdGFsP05hTjp0aGlzLmZvdW5kUGF0dGVybkNyb3NzKHN0YXRlQ291bnQpP3RoaXMuY2VudGVyRnJvbUVuZChzdGF0ZUNvdW50LGkpOk5hTn0sdGhpcy5jcm9zc0NoZWNrSG9yaXpvbnRhbD1mdW5jdGlvbihzdGFydEosY2VudGVySSxtYXhDb3VudCxvcmlnaW5hbFN0YXRlQ291bnRUb3RhbCl7Zm9yKHZhciBpbWFnZT10aGlzLmltYWdlLG1heEo9cXJjb2RlLndpZHRoLHN0YXRlQ291bnQ9dGhpcy5Dcm9zc0NoZWNrU3RhdGVDb3VudCxqPXN0YXJ0SjtqPj0wJiZpbWFnZVtqK2NlbnRlckkqcXJjb2RlLndpZHRoXTspc3RhdGVDb3VudFsyXSsrLGotLTtpZigwPmopcmV0dXJuIE5hTjtmb3IoO2o+PTAmJiFpbWFnZVtqK2NlbnRlckkqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFsxXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMV0rKyxqLS07aWYoMD5qfHxzdGF0ZUNvdW50WzFdPm1heENvdW50KXJldHVybiBOYU47Zm9yKDtqPj0wJiZpbWFnZVtqK2NlbnRlckkqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFswXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMF0rKyxqLS07aWYoc3RhdGVDb3VudFswXT5tYXhDb3VudClyZXR1cm4gTmFOO2ZvcihqPXN0YXJ0SisxO21heEo+aiYmaW1hZ2VbaitjZW50ZXJJKnFyY29kZS53aWR0aF07KXN0YXRlQ291bnRbMl0rKyxqKys7aWYoaj09bWF4SilyZXR1cm4gTmFOO2Zvcig7bWF4Sj5qJiYhaW1hZ2VbaitjZW50ZXJJKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbM108bWF4Q291bnQ7KXN0YXRlQ291bnRbM10rKyxqKys7aWYoaj09bWF4Snx8c3RhdGVDb3VudFszXT49bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoO21heEo+aiYmaW1hZ2VbaitjZW50ZXJJKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbNF08bWF4Q291bnQ7KXN0YXRlQ291bnRbNF0rKyxqKys7aWYoc3RhdGVDb3VudFs0XT49bWF4Q291bnQpcmV0dXJuIE5hTjt2YXIgc3RhdGVDb3VudFRvdGFsPXN0YXRlQ291bnRbMF0rc3RhdGVDb3VudFsxXStzdGF0ZUNvdW50WzJdK3N0YXRlQ291bnRbM10rc3RhdGVDb3VudFs0XTtyZXR1cm4gNSpNYXRoLmFicyhzdGF0ZUNvdW50VG90YWwtb3JpZ2luYWxTdGF0ZUNvdW50VG90YWwpPj1vcmlnaW5hbFN0YXRlQ291bnRUb3RhbD9OYU46dGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KT90aGlzLmNlbnRlckZyb21FbmQoc3RhdGVDb3VudCxqKTpOYU59LHRoaXMuaGFuZGxlUG9zc2libGVDZW50ZXI9ZnVuY3Rpb24oc3RhdGVDb3VudCxpLGope3ZhciBzdGF0ZUNvdW50VG90YWw9c3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl0rc3RhdGVDb3VudFszXStzdGF0ZUNvdW50WzRdLGNlbnRlcko9dGhpcy5jZW50ZXJGcm9tRW5kKHN0YXRlQ291bnQsaiksY2VudGVyST10aGlzLmNyb3NzQ2hlY2tWZXJ0aWNhbChpLE1hdGguZmxvb3IoY2VudGVySiksc3RhdGVDb3VudFsyXSxzdGF0ZUNvdW50VG90YWwpO2lmKCFpc05hTihjZW50ZXJJKSYmKGNlbnRlcko9dGhpcy5jcm9zc0NoZWNrSG9yaXpvbnRhbChNYXRoLmZsb29yKGNlbnRlckopLE1hdGguZmxvb3IoY2VudGVySSksc3RhdGVDb3VudFsyXSxzdGF0ZUNvdW50VG90YWwpLCFpc05hTihjZW50ZXJKKSkpe2Zvcih2YXIgZXN0aW1hdGVkTW9kdWxlU2l6ZT1zdGF0ZUNvdW50VG90YWwvNyxmb3VuZD0hMSxtYXg9dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoLGluZGV4PTA7bWF4PmluZGV4O2luZGV4Kyspe3ZhciBjZW50ZXI9dGhpcy5wb3NzaWJsZUNlbnRlcnNbaW5kZXhdO2lmKGNlbnRlci5hYm91dEVxdWFscyhlc3RpbWF0ZWRNb2R1bGVTaXplLGNlbnRlckksY2VudGVySikpe2NlbnRlci5pbmNyZW1lbnRDb3VudCgpLGZvdW5kPSEwO2JyZWFrfX1pZighZm91bmQpe3ZhciBwb2ludD1uZXcgRmluZGVyUGF0dGVybihjZW50ZXJKLGNlbnRlckksZXN0aW1hdGVkTW9kdWxlU2l6ZSk7dGhpcy5wb3NzaWJsZUNlbnRlcnMucHVzaChwb2ludCksbnVsbCE9dGhpcy5yZXN1bHRQb2ludENhbGxiYWNrJiZ0aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2suZm91bmRQb3NzaWJsZVJlc3VsdFBvaW50KHBvaW50KX1yZXR1cm4hMH1yZXR1cm4hMX0sdGhpcy5zZWxlY3RCZXN0UGF0dGVybnM9ZnVuY3Rpb24oKXt2YXIgc3RhcnRTaXplPXRoaXMucG9zc2libGVDZW50ZXJzLmxlbmd0aDtpZigzPnN0YXJ0U2l6ZSl0aHJvd1wiQ291bGRuJ3QgZmluZCBlbm91Z2ggZmluZGVyIHBhdHRlcm5zXCI7aWYoc3RhcnRTaXplPjMpe2Zvcih2YXIgdG90YWxNb2R1bGVTaXplPTAsaT0wO3N0YXJ0U2l6ZT5pO2krKyl0b3RhbE1vZHVsZVNpemUrPXRoaXMucG9zc2libGVDZW50ZXJzW2ldLkVzdGltYXRlZE1vZHVsZVNpemU7Zm9yKHZhciBhdmVyYWdlPXRvdGFsTW9kdWxlU2l6ZS9zdGFydFNpemUsaT0wO2k8dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoJiZ0aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGg+MztpKyspe3ZhciBwYXR0ZXJuPXRoaXMucG9zc2libGVDZW50ZXJzW2ldO01hdGguYWJzKHBhdHRlcm4uRXN0aW1hdGVkTW9kdWxlU2l6ZS1hdmVyYWdlKT4uMiphdmVyYWdlJiYodGhpcy5wb3NzaWJsZUNlbnRlcnMucmVtb3ZlKGkpLGktLSl9fXJldHVybiB0aGlzLnBvc3NpYmxlQ2VudGVycy5Db3VudD4zLG5ldyBBcnJheSh0aGlzLnBvc3NpYmxlQ2VudGVyc1swXSx0aGlzLnBvc3NpYmxlQ2VudGVyc1sxXSx0aGlzLnBvc3NpYmxlQ2VudGVyc1syXSl9LHRoaXMuZmluZFJvd1NraXA9ZnVuY3Rpb24oKXt2YXIgbWF4PXRoaXMucG9zc2libGVDZW50ZXJzLmxlbmd0aDtpZigxPj1tYXgpcmV0dXJuIDA7Zm9yKHZhciBmaXJzdENvbmZpcm1lZENlbnRlcj1udWxsLGk9MDttYXg+aTtpKyspe3ZhciBjZW50ZXI9dGhpcy5wb3NzaWJsZUNlbnRlcnNbaV07aWYoY2VudGVyLkNvdW50Pj1DRU5URVJfUVVPUlVNKXtpZihudWxsIT1maXJzdENvbmZpcm1lZENlbnRlcilyZXR1cm4gdGhpcy5oYXNTa2lwcGVkPSEwLE1hdGguZmxvb3IoKE1hdGguYWJzKGZpcnN0Q29uZmlybWVkQ2VudGVyLlgtY2VudGVyLlgpLU1hdGguYWJzKGZpcnN0Q29uZmlybWVkQ2VudGVyLlktY2VudGVyLlkpKS8yKTtmaXJzdENvbmZpcm1lZENlbnRlcj1jZW50ZXJ9fXJldHVybiAwfSx0aGlzLmhhdmVNdWx0aXBseUNvbmZpcm1lZENlbnRlcnM9ZnVuY3Rpb24oKXtmb3IodmFyIGNvbmZpcm1lZENvdW50PTAsdG90YWxNb2R1bGVTaXplPTAsbWF4PXRoaXMucG9zc2libGVDZW50ZXJzLmxlbmd0aCxpPTA7bWF4Pmk7aSsrKXt2YXIgcGF0dGVybj10aGlzLnBvc3NpYmxlQ2VudGVyc1tpXTtwYXR0ZXJuLkNvdW50Pj1DRU5URVJfUVVPUlVNJiYoY29uZmlybWVkQ291bnQrKyx0b3RhbE1vZHVsZVNpemUrPXBhdHRlcm4uRXN0aW1hdGVkTW9kdWxlU2l6ZSl9aWYoMz5jb25maXJtZWRDb3VudClyZXR1cm4hMTtmb3IodmFyIGF2ZXJhZ2U9dG90YWxNb2R1bGVTaXplL21heCx0b3RhbERldmlhdGlvbj0wLGk9MDttYXg+aTtpKyspcGF0dGVybj10aGlzLnBvc3NpYmxlQ2VudGVyc1tpXSx0b3RhbERldmlhdGlvbis9TWF0aC5hYnMocGF0dGVybi5Fc3RpbWF0ZWRNb2R1bGVTaXplLWF2ZXJhZ2UpO3JldHVybi4wNSp0b3RhbE1vZHVsZVNpemU+PXRvdGFsRGV2aWF0aW9ufSx0aGlzLmZpbmRGaW5kZXJQYXR0ZXJuPWZ1bmN0aW9uKGltYWdlKXt2YXIgdHJ5SGFyZGVyPSExO3RoaXMuaW1hZ2U9aW1hZ2U7dmFyIG1heEk9cXJjb2RlLmhlaWdodCxtYXhKPXFyY29kZS53aWR0aCxpU2tpcD1NYXRoLmZsb29yKDMqbWF4SS8oNCpNQVhfTU9EVUxFUykpOyhNSU5fU0tJUD5pU2tpcHx8dHJ5SGFyZGVyKSYmKGlTa2lwPU1JTl9TS0lQKTtmb3IodmFyIGRvbmU9ITEsc3RhdGVDb3VudD1uZXcgQXJyYXkoNSksaT1pU2tpcC0xO21heEk+aSYmIWRvbmU7aSs9aVNraXApe3N0YXRlQ291bnRbMF09MCxzdGF0ZUNvdW50WzFdPTAsc3RhdGVDb3VudFsyXT0wLHN0YXRlQ291bnRbM109MCxzdGF0ZUNvdW50WzRdPTA7Zm9yKHZhciBjdXJyZW50U3RhdGU9MCxqPTA7bWF4Sj5qO2orKylpZihpbWFnZVtqK2kqcXJjb2RlLndpZHRoXSkxPT0oMSZjdXJyZW50U3RhdGUpJiZjdXJyZW50U3RhdGUrKyxzdGF0ZUNvdW50W2N1cnJlbnRTdGF0ZV0rKztlbHNlIGlmKDA9PSgxJmN1cnJlbnRTdGF0ZSkpaWYoND09Y3VycmVudFN0YXRlKWlmKHRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3Moc3RhdGVDb3VudCkpe3ZhciBjb25maXJtZWQ9dGhpcy5oYW5kbGVQb3NzaWJsZUNlbnRlcihzdGF0ZUNvdW50LGksaik7aWYoY29uZmlybWVkKWlmKGlTa2lwPTIsdGhpcy5oYXNTa2lwcGVkKWRvbmU9dGhpcy5oYXZlTXVsdGlwbHlDb25maXJtZWRDZW50ZXJzKCk7ZWxzZXt2YXIgcm93U2tpcD10aGlzLmZpbmRSb3dTa2lwKCk7cm93U2tpcD5zdGF0ZUNvdW50WzJdJiYoaSs9cm93U2tpcC1zdGF0ZUNvdW50WzJdLWlTa2lwLGo9bWF4Si0xKX1lbHNle2RvIGorKzt3aGlsZShtYXhKPmomJiFpbWFnZVtqK2kqcXJjb2RlLndpZHRoXSk7ai0tfWN1cnJlbnRTdGF0ZT0wLHN0YXRlQ291bnRbMF09MCxzdGF0ZUNvdW50WzFdPTAsc3RhdGVDb3VudFsyXT0wLHN0YXRlQ291bnRbM109MCxzdGF0ZUNvdW50WzRdPTB9ZWxzZSBzdGF0ZUNvdW50WzBdPXN0YXRlQ291bnRbMl0sc3RhdGVDb3VudFsxXT1zdGF0ZUNvdW50WzNdLHN0YXRlQ291bnRbMl09c3RhdGVDb3VudFs0XSxzdGF0ZUNvdW50WzNdPTEsc3RhdGVDb3VudFs0XT0wLGN1cnJlbnRTdGF0ZT0zO2Vsc2Ugc3RhdGVDb3VudFsrK2N1cnJlbnRTdGF0ZV0rKztlbHNlIHN0YXRlQ291bnRbY3VycmVudFN0YXRlXSsrO2lmKHRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3Moc3RhdGVDb3VudCkpe3ZhciBjb25maXJtZWQ9dGhpcy5oYW5kbGVQb3NzaWJsZUNlbnRlcihzdGF0ZUNvdW50LGksbWF4Sik7Y29uZmlybWVkJiYoaVNraXA9c3RhdGVDb3VudFswXSx0aGlzLmhhc1NraXBwZWQmJihkb25lPWhhdmVNdWx0aXBseUNvbmZpcm1lZENlbnRlcnMoKSkpfX12YXIgcGF0dGVybkluZm89dGhpcy5zZWxlY3RCZXN0UGF0dGVybnMoKTtyZXR1cm4gcXJjb2RlLm9yZGVyQmVzdFBhdHRlcm5zKHBhdHRlcm5JbmZvKSxuZXcgRmluZGVyUGF0dGVybkluZm8ocGF0dGVybkluZm8pfX1mdW5jdGlvbiBBbGlnbm1lbnRQYXR0ZXJuKHBvc1gscG9zWSxlc3RpbWF0ZWRNb2R1bGVTaXplKXt0aGlzLng9cG9zWCx0aGlzLnk9cG9zWSx0aGlzLmNvdW50PTEsdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplPWVzdGltYXRlZE1vZHVsZVNpemUsdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRXN0aW1hdGVkTW9kdWxlU2l6ZVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXN0aW1hdGVkTW9kdWxlU2l6ZX0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkNvdW50XCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb3VudH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIlhcIixmdW5jdGlvbigpe3JldHVybiBNYXRoLmZsb29yKHRoaXMueCl9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJZXCIsZnVuY3Rpb24oKXtyZXR1cm4gTWF0aC5mbG9vcih0aGlzLnkpfSksdGhpcy5pbmNyZW1lbnRDb3VudD1mdW5jdGlvbigpe3RoaXMuY291bnQrK30sdGhpcy5hYm91dEVxdWFscz1mdW5jdGlvbihtb2R1bGVTaXplLGksail7aWYoTWF0aC5hYnMoaS10aGlzLnkpPD1tb2R1bGVTaXplJiZNYXRoLmFicyhqLXRoaXMueCk8PW1vZHVsZVNpemUpe3ZhciBtb2R1bGVTaXplRGlmZj1NYXRoLmFicyhtb2R1bGVTaXplLXRoaXMuZXN0aW1hdGVkTW9kdWxlU2l6ZSk7cmV0dXJuIDE+PW1vZHVsZVNpemVEaWZmfHxtb2R1bGVTaXplRGlmZi90aGlzLmVzdGltYXRlZE1vZHVsZVNpemU8PTF9cmV0dXJuITF9fWZ1bmN0aW9uIEFsaWdubWVudFBhdHRlcm5GaW5kZXIoaW1hZ2Usc3RhcnRYLHN0YXJ0WSx3aWR0aCxoZWlnaHQsbW9kdWxlU2l6ZSxyZXN1bHRQb2ludENhbGxiYWNrKXt0aGlzLmltYWdlPWltYWdlLHRoaXMucG9zc2libGVDZW50ZXJzPW5ldyBBcnJheSx0aGlzLnN0YXJ0WD1zdGFydFgsdGhpcy5zdGFydFk9c3RhcnRZLHRoaXMud2lkdGg9d2lkdGgsdGhpcy5oZWlnaHQ9aGVpZ2h0LHRoaXMubW9kdWxlU2l6ZT1tb2R1bGVTaXplLHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnQ9bmV3IEFycmF5KDAsMCwwKSx0aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2s9cmVzdWx0UG9pbnRDYWxsYmFjayx0aGlzLmNlbnRlckZyb21FbmQ9ZnVuY3Rpb24oc3RhdGVDb3VudCxlbmQpe3JldHVybiBlbmQtc3RhdGVDb3VudFsyXS1zdGF0ZUNvdW50WzFdLzJ9LHRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3M9ZnVuY3Rpb24oc3RhdGVDb3VudCl7Zm9yKHZhciBtb2R1bGVTaXplPXRoaXMubW9kdWxlU2l6ZSxtYXhWYXJpYW5jZT1tb2R1bGVTaXplLzIsaT0wOzM+aTtpKyspaWYoTWF0aC5hYnMobW9kdWxlU2l6ZS1zdGF0ZUNvdW50W2ldKT49bWF4VmFyaWFuY2UpcmV0dXJuITE7cmV0dXJuITB9LHRoaXMuY3Jvc3NDaGVja1ZlcnRpY2FsPWZ1bmN0aW9uKHN0YXJ0SSxjZW50ZXJKLG1heENvdW50LG9yaWdpbmFsU3RhdGVDb3VudFRvdGFsKXt2YXIgaW1hZ2U9dGhpcy5pbWFnZSxtYXhJPXFyY29kZS5oZWlnaHQsc3RhdGVDb3VudD10aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50O3N0YXRlQ291bnRbMF09MCxzdGF0ZUNvdW50WzFdPTAsc3RhdGVDb3VudFsyXT0wO2Zvcih2YXIgaT1zdGFydEk7aT49MCYmaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbMV08PW1heENvdW50OylzdGF0ZUNvdW50WzFdKyssaS0tO2lmKDA+aXx8c3RhdGVDb3VudFsxXT5tYXhDb3VudClyZXR1cm4gTmFOO2Zvcig7aT49MCYmIWltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzBdPD1tYXhDb3VudDspc3RhdGVDb3VudFswXSsrLGktLTtpZihzdGF0ZUNvdW50WzBdPm1heENvdW50KXJldHVybiBOYU47Zm9yKGk9c3RhcnRJKzE7bWF4ST5pJiZpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFsxXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMV0rKyxpKys7aWYoaT09bWF4SXx8c3RhdGVDb3VudFsxXT5tYXhDb3VudClyZXR1cm4gTmFOO2Zvcig7bWF4ST5pJiYhaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbMl08PW1heENvdW50OylzdGF0ZUNvdW50WzJdKyssaSsrO2lmKHN0YXRlQ291bnRbMl0+bWF4Q291bnQpcmV0dXJuIE5hTjt2YXIgc3RhdGVDb3VudFRvdGFsPXN0YXRlQ291bnRbMF0rc3RhdGVDb3VudFsxXStzdGF0ZUNvdW50WzJdO3JldHVybiA1Kk1hdGguYWJzKHN0YXRlQ291bnRUb3RhbC1vcmlnaW5hbFN0YXRlQ291bnRUb3RhbCk+PTIqb3JpZ2luYWxTdGF0ZUNvdW50VG90YWw/TmFOOnRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3Moc3RhdGVDb3VudCk/dGhpcy5jZW50ZXJGcm9tRW5kKHN0YXRlQ291bnQsaSk6TmFOfSx0aGlzLmhhbmRsZVBvc3NpYmxlQ2VudGVyPWZ1bmN0aW9uKHN0YXRlQ291bnQsaSxqKXt2YXIgc3RhdGVDb3VudFRvdGFsPXN0YXRlQ291bnRbMF0rc3RhdGVDb3VudFsxXStzdGF0ZUNvdW50WzJdLGNlbnRlcko9dGhpcy5jZW50ZXJGcm9tRW5kKHN0YXRlQ291bnQsaiksY2VudGVyST10aGlzLmNyb3NzQ2hlY2tWZXJ0aWNhbChpLE1hdGguZmxvb3IoY2VudGVySiksMipzdGF0ZUNvdW50WzFdLHN0YXRlQ291bnRUb3RhbCk7aWYoIWlzTmFOKGNlbnRlckkpKXtmb3IodmFyIGVzdGltYXRlZE1vZHVsZVNpemU9KHN0YXRlQ291bnRbMF0rc3RhdGVDb3VudFsxXStzdGF0ZUNvdW50WzJdKS8zLG1heD10aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGgsaW5kZXg9MDttYXg+aW5kZXg7aW5kZXgrKyl7dmFyIGNlbnRlcj10aGlzLnBvc3NpYmxlQ2VudGVyc1tpbmRleF07aWYoY2VudGVyLmFib3V0RXF1YWxzKGVzdGltYXRlZE1vZHVsZVNpemUsY2VudGVySSxjZW50ZXJKKSlyZXR1cm4gbmV3IEFsaWdubWVudFBhdHRlcm4oY2VudGVySixjZW50ZXJJLGVzdGltYXRlZE1vZHVsZVNpemUpfXZhciBwb2ludD1uZXcgQWxpZ25tZW50UGF0dGVybihjZW50ZXJKLGNlbnRlckksZXN0aW1hdGVkTW9kdWxlU2l6ZSk7dGhpcy5wb3NzaWJsZUNlbnRlcnMucHVzaChwb2ludCksbnVsbCE9dGhpcy5yZXN1bHRQb2ludENhbGxiYWNrJiZ0aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2suZm91bmRQb3NzaWJsZVJlc3VsdFBvaW50KHBvaW50KX1yZXR1cm4gbnVsbH0sdGhpcy5maW5kPWZ1bmN0aW9uKCl7Zm9yKHZhciBzdGFydFg9dGhpcy5zdGFydFgsaGVpZ2h0PXRoaXMuaGVpZ2h0LG1heEo9c3RhcnRYK3dpZHRoLG1pZGRsZUk9c3RhcnRZKyhoZWlnaHQ+PjEpLHN0YXRlQ291bnQ9bmV3IEFycmF5KDAsMCwwKSxpR2VuPTA7aGVpZ2h0PmlHZW47aUdlbisrKXt2YXIgaT1taWRkbGVJKygwPT0oMSZpR2VuKT9pR2VuKzE+PjE6LShpR2VuKzE+PjEpKTtzdGF0ZUNvdW50WzBdPTAsc3RhdGVDb3VudFsxXT0wLHN0YXRlQ291bnRbMl09MDtmb3IodmFyIGo9c3RhcnRYO21heEo+aiYmIWltYWdlW2orcXJjb2RlLndpZHRoKmldOylqKys7Zm9yKHZhciBjdXJyZW50U3RhdGU9MDttYXhKPmo7KXtpZihpbWFnZVtqK2kqcXJjb2RlLndpZHRoXSlpZigxPT1jdXJyZW50U3RhdGUpc3RhdGVDb3VudFtjdXJyZW50U3RhdGVdKys7ZWxzZSBpZigyPT1jdXJyZW50U3RhdGUpe2lmKHRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3Moc3RhdGVDb3VudCkpe3ZhciBjb25maXJtZWQ9dGhpcy5oYW5kbGVQb3NzaWJsZUNlbnRlcihzdGF0ZUNvdW50LGksaik7aWYobnVsbCE9Y29uZmlybWVkKXJldHVybiBjb25maXJtZWR9c3RhdGVDb3VudFswXT1zdGF0ZUNvdW50WzJdLHN0YXRlQ291bnRbMV09MSxzdGF0ZUNvdW50WzJdPTAsY3VycmVudFN0YXRlPTF9ZWxzZSBzdGF0ZUNvdW50WysrY3VycmVudFN0YXRlXSsrO2Vsc2UgMT09Y3VycmVudFN0YXRlJiZjdXJyZW50U3RhdGUrKyxzdGF0ZUNvdW50W2N1cnJlbnRTdGF0ZV0rKztqKyt9aWYodGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KSl7dmFyIGNvbmZpcm1lZD10aGlzLmhhbmRsZVBvc3NpYmxlQ2VudGVyKHN0YXRlQ291bnQsaSxtYXhKKTtpZihudWxsIT1jb25maXJtZWQpcmV0dXJuIGNvbmZpcm1lZH19aWYoMCE9dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoKXJldHVybiB0aGlzLnBvc3NpYmxlQ2VudGVyc1swXTt0aHJvd1wiQ291bGRuJ3QgZmluZCBlbm91Z2ggYWxpZ25tZW50IHBhdHRlcm5zXCJ9fWZ1bmN0aW9uIFFSQ29kZURhdGFCbG9ja1JlYWRlcihibG9ja3MsdmVyc2lvbixudW1FcnJvckNvcnJlY3Rpb25Db2RlKXt0aGlzLmJsb2NrUG9pbnRlcj0wLHRoaXMuYml0UG9pbnRlcj03LHRoaXMuZGF0YUxlbmd0aD0wLHRoaXMuYmxvY2tzPWJsb2Nrcyx0aGlzLm51bUVycm9yQ29ycmVjdGlvbkNvZGU9bnVtRXJyb3JDb3JyZWN0aW9uQ29kZSw5Pj12ZXJzaW9uP3RoaXMuZGF0YUxlbmd0aE1vZGU9MDp2ZXJzaW9uPj0xMCYmMjY+PXZlcnNpb24/dGhpcy5kYXRhTGVuZ3RoTW9kZT0xOnZlcnNpb24+PTI3JiY0MD49dmVyc2lvbiYmKHRoaXMuZGF0YUxlbmd0aE1vZGU9MiksdGhpcy5nZXROZXh0Qml0cz1mdW5jdGlvbihudW1CaXRzKXt2YXIgYml0cz0wO2lmKG51bUJpdHM8dGhpcy5iaXRQb2ludGVyKzEpe2Zvcih2YXIgbWFzaz0wLGk9MDtudW1CaXRzPmk7aSsrKW1hc2srPTE8PGk7cmV0dXJuIG1hc2s8PD10aGlzLmJpdFBvaW50ZXItbnVtQml0cysxLGJpdHM9KHRoaXMuYmxvY2tzW3RoaXMuYmxvY2tQb2ludGVyXSZtYXNrKT4+dGhpcy5iaXRQb2ludGVyLW51bUJpdHMrMSx0aGlzLmJpdFBvaW50ZXItPW51bUJpdHMsYml0c31pZihudW1CaXRzPHRoaXMuYml0UG9pbnRlcisxKzgpe2Zvcih2YXIgbWFzazE9MCxpPTA7aTx0aGlzLmJpdFBvaW50ZXIrMTtpKyspbWFzazErPTE8PGk7cmV0dXJuIGJpdHM9KHRoaXMuYmxvY2tzW3RoaXMuYmxvY2tQb2ludGVyXSZtYXNrMSk8PG51bUJpdHMtKHRoaXMuYml0UG9pbnRlcisxKSx0aGlzLmJsb2NrUG9pbnRlcisrLGJpdHMrPXRoaXMuYmxvY2tzW3RoaXMuYmxvY2tQb2ludGVyXT4+OC0obnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzEpKSx0aGlzLmJpdFBvaW50ZXI9dGhpcy5iaXRQb2ludGVyLW51bUJpdHMlOCx0aGlzLmJpdFBvaW50ZXI8MCYmKHRoaXMuYml0UG9pbnRlcj04K3RoaXMuYml0UG9pbnRlciksYml0c31pZihudW1CaXRzPHRoaXMuYml0UG9pbnRlcisxKzE2KXtmb3IodmFyIG1hc2sxPTAsbWFzazM9MCxpPTA7aTx0aGlzLmJpdFBvaW50ZXIrMTtpKyspbWFzazErPTE8PGk7dmFyIGJpdHNGaXJzdEJsb2NrPSh0aGlzLmJsb2Nrc1t0aGlzLmJsb2NrUG9pbnRlcl0mbWFzazEpPDxudW1CaXRzLSh0aGlzLmJpdFBvaW50ZXIrMSk7dGhpcy5ibG9ja1BvaW50ZXIrKzt2YXIgYml0c1NlY29uZEJsb2NrPXRoaXMuYmxvY2tzW3RoaXMuYmxvY2tQb2ludGVyXTw8bnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzErOCk7dGhpcy5ibG9ja1BvaW50ZXIrKztmb3IodmFyIGk9MDtpPG51bUJpdHMtKHRoaXMuYml0UG9pbnRlcisxKzgpO2krKyltYXNrMys9MTw8aTttYXNrMzw8PTgtKG51bUJpdHMtKHRoaXMuYml0UG9pbnRlcisxKzgpKTt2YXIgYml0c1RoaXJkQmxvY2s9KHRoaXMuYmxvY2tzW3RoaXMuYmxvY2tQb2ludGVyXSZtYXNrMyk+PjgtKG51bUJpdHMtKHRoaXMuYml0UG9pbnRlcisxKzgpKTtyZXR1cm4gYml0cz1iaXRzRmlyc3RCbG9jaytiaXRzU2Vjb25kQmxvY2srYml0c1RoaXJkQmxvY2ssdGhpcy5iaXRQb2ludGVyPXRoaXMuYml0UG9pbnRlci0obnVtQml0cy04KSU4LHRoaXMuYml0UG9pbnRlcjwwJiYodGhpcy5iaXRQb2ludGVyPTgrdGhpcy5iaXRQb2ludGVyKSxiaXRzfXJldHVybiAwfSx0aGlzLk5leHRNb2RlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmxvY2tQb2ludGVyPnRoaXMuYmxvY2tzLmxlbmd0aC10aGlzLm51bUVycm9yQ29ycmVjdGlvbkNvZGUtMj8wOnRoaXMuZ2V0TmV4dEJpdHMoNCl9LHRoaXMuZ2V0RGF0YUxlbmd0aD1mdW5jdGlvbihtb2RlSW5kaWNhdG9yKXtmb3IodmFyIGluZGV4PTA7Oyl7aWYobW9kZUluZGljYXRvcj4+aW5kZXg9PTEpYnJlYWs7aW5kZXgrK31yZXR1cm4gdGhpcy5nZXROZXh0Qml0cyhxcmNvZGUuc2l6ZU9mRGF0YUxlbmd0aEluZm9bdGhpcy5kYXRhTGVuZ3RoTW9kZV1baW5kZXhdKX0sdGhpcy5nZXRSb21hbkFuZEZpZ3VyZVN0cmluZz1mdW5jdGlvbihkYXRhTGVuZ3RoKXt2YXIgbGVuZ3RoPWRhdGFMZW5ndGgsaW50RGF0YT0wLHN0ckRhdGE9XCJcIix0YWJsZVJvbWFuQW5kRmlndXJlPW5ldyBBcnJheShcIjBcIixcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIkFcIixcIkJcIixcIkNcIixcIkRcIixcIkVcIixcIkZcIixcIkdcIixcIkhcIixcIklcIixcIkpcIixcIktcIixcIkxcIixcIk1cIixcIk5cIixcIk9cIixcIlBcIixcIlFcIixcIlJcIixcIlNcIixcIlRcIixcIlVcIixcIlZcIixcIldcIixcIlhcIixcIllcIixcIlpcIixcIiBcIixcIiRcIixcIiVcIixcIipcIixcIitcIixcIi1cIixcIi5cIixcIi9cIixcIjpcIik7ZG8gaWYobGVuZ3RoPjEpe2ludERhdGE9dGhpcy5nZXROZXh0Qml0cygxMSk7dmFyIGZpcnN0TGV0dGVyPU1hdGguZmxvb3IoaW50RGF0YS80NSksc2Vjb25kTGV0dGVyPWludERhdGElNDU7c3RyRGF0YSs9dGFibGVSb21hbkFuZEZpZ3VyZVtmaXJzdExldHRlcl0sc3RyRGF0YSs9dGFibGVSb21hbkFuZEZpZ3VyZVtzZWNvbmRMZXR0ZXJdLGxlbmd0aC09Mn1lbHNlIDE9PWxlbmd0aCYmKGludERhdGE9dGhpcy5nZXROZXh0Qml0cyg2KSxzdHJEYXRhKz10YWJsZVJvbWFuQW5kRmlndXJlW2ludERhdGFdLGxlbmd0aC09MSk7d2hpbGUobGVuZ3RoPjApO3JldHVybiBzdHJEYXRhfSx0aGlzLmdldEZpZ3VyZVN0cmluZz1mdW5jdGlvbihkYXRhTGVuZ3RoKXt2YXIgbGVuZ3RoPWRhdGFMZW5ndGgsaW50RGF0YT0wLHN0ckRhdGE9XCJcIjtkbyBsZW5ndGg+PTM/KGludERhdGE9dGhpcy5nZXROZXh0Qml0cygxMCksMTAwPmludERhdGEmJihzdHJEYXRhKz1cIjBcIiksMTA+aW50RGF0YSYmKHN0ckRhdGErPVwiMFwiKSxsZW5ndGgtPTMpOjI9PWxlbmd0aD8oaW50RGF0YT10aGlzLmdldE5leHRCaXRzKDcpLDEwPmludERhdGEmJihzdHJEYXRhKz1cIjBcIiksbGVuZ3RoLT0yKToxPT1sZW5ndGgmJihpbnREYXRhPXRoaXMuZ2V0TmV4dEJpdHMoNCksbGVuZ3RoLT0xKSxzdHJEYXRhKz1pbnREYXRhO3doaWxlKGxlbmd0aD4wKTtyZXR1cm4gc3RyRGF0YX0sdGhpcy5nZXQ4Yml0Qnl0ZUFycmF5PWZ1bmN0aW9uKGRhdGFMZW5ndGgpe3ZhciBsZW5ndGg9ZGF0YUxlbmd0aCxpbnREYXRhPTAsb3V0cHV0PW5ldyBBcnJheTtkbyBpbnREYXRhPXRoaXMuZ2V0TmV4dEJpdHMoOCksb3V0cHV0LnB1c2goaW50RGF0YSksbGVuZ3RoLS07d2hpbGUobGVuZ3RoPjApO3JldHVybiBvdXRwdXR9LHRoaXMuZ2V0S2FuamlTdHJpbmc9ZnVuY3Rpb24oZGF0YUxlbmd0aCl7dmFyIGxlbmd0aD1kYXRhTGVuZ3RoLGludERhdGE9MCx1bmljb2RlU3RyaW5nPVwiXCI7ZG97aW50RGF0YT1nZXROZXh0Qml0cygxMyk7dmFyIGxvd2VyQnl0ZT1pbnREYXRhJTE5MixoaWdoZXJCeXRlPWludERhdGEvMTkyLHRlbXBXb3JkPShoaWdoZXJCeXRlPDw4KStsb3dlckJ5dGUsc2hpZnRqaXNXb3JkPTA7c2hpZnRqaXNXb3JkPTQwOTU2Pj10ZW1wV29yZCszMzA4OD90ZW1wV29yZCszMzA4ODp0ZW1wV29yZCs0OTQ3Mix1bmljb2RlU3RyaW5nKz1TdHJpbmcuZnJvbUNoYXJDb2RlKHNoaWZ0amlzV29yZCksbGVuZ3RoLS19d2hpbGUobGVuZ3RoPjApO3JldHVybiB1bmljb2RlU3RyaW5nfSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJEYXRhQnl0ZVwiLGZ1bmN0aW9uKCl7Zm9yKHZhciBvdXRwdXQ9bmV3IEFycmF5LE1PREVfTlVNQkVSPTEsTU9ERV9ST01BTl9BTkRfTlVNQkVSPTIsTU9ERV84QklUX0JZVEU9NCxNT0RFX0tBTkpJPTg7Oyl7dmFyIG1vZGU9dGhpcy5OZXh0TW9kZSgpO2lmKDA9PW1vZGUpe2lmKG91dHB1dC5sZW5ndGg+MClicmVhazt0aHJvd1wiRW1wdHkgZGF0YSBibG9ja1wifWlmKG1vZGUhPU1PREVfTlVNQkVSJiZtb2RlIT1NT0RFX1JPTUFOX0FORF9OVU1CRVImJm1vZGUhPU1PREVfOEJJVF9CWVRFJiZtb2RlIT1NT0RFX0tBTkpJKXRocm93XCJJbnZhbGlkIG1vZGU6IFwiK21vZGUrXCIgaW4gKGJsb2NrOlwiK3RoaXMuYmxvY2tQb2ludGVyK1wiIGJpdDpcIit0aGlzLmJpdFBvaW50ZXIrXCIpXCI7aWYoZGF0YUxlbmd0aD10aGlzLmdldERhdGFMZW5ndGgobW9kZSksZGF0YUxlbmd0aDwxKXRocm93XCJJbnZhbGlkIGRhdGEgbGVuZ3RoOiBcIitkYXRhTGVuZ3RoO3N3aXRjaChtb2RlKXtjYXNlIE1PREVfTlVNQkVSOmZvcih2YXIgdGVtcF9zdHI9dGhpcy5nZXRGaWd1cmVTdHJpbmcoZGF0YUxlbmd0aCksdGE9bmV3IEFycmF5KHRlbXBfc3RyLmxlbmd0aCksaj0wO2o8dGVtcF9zdHIubGVuZ3RoO2orKyl0YVtqXT10ZW1wX3N0ci5jaGFyQ29kZUF0KGopO291dHB1dC5wdXNoKHRhKTticmVhaztjYXNlIE1PREVfUk9NQU5fQU5EX05VTUJFUjpmb3IodmFyIHRlbXBfc3RyPXRoaXMuZ2V0Um9tYW5BbmRGaWd1cmVTdHJpbmcoZGF0YUxlbmd0aCksdGE9bmV3IEFycmF5KHRlbXBfc3RyLmxlbmd0aCksaj0wO2o8dGVtcF9zdHIubGVuZ3RoO2orKyl0YVtqXT10ZW1wX3N0ci5jaGFyQ29kZUF0KGopO291dHB1dC5wdXNoKHRhKTticmVhaztjYXNlIE1PREVfOEJJVF9CWVRFOnZhciB0ZW1wX3NieXRlQXJyYXkzPXRoaXMuZ2V0OGJpdEJ5dGVBcnJheShkYXRhTGVuZ3RoKTtvdXRwdXQucHVzaCh0ZW1wX3NieXRlQXJyYXkzKTticmVhaztjYXNlIE1PREVfS0FOSkk6dmFyIHRlbXBfc3RyPXRoaXMuZ2V0S2FuamlTdHJpbmcoZGF0YUxlbmd0aCk7b3V0cHV0LnB1c2godGVtcF9zdHIpfX1yZXR1cm4gb3V0cHV0fSl9R3JpZFNhbXBsZXI9e30sR3JpZFNhbXBsZXIuY2hlY2tBbmROdWRnZVBvaW50cz1mdW5jdGlvbihpbWFnZSxwb2ludHMpe2Zvcih2YXIgd2lkdGg9cXJjb2RlLndpZHRoLGhlaWdodD1xcmNvZGUuaGVpZ2h0LG51ZGdlZD0hMCxvZmZzZXQ9MDtvZmZzZXQ8cG9pbnRzLkxlbmd0aCYmbnVkZ2VkO29mZnNldCs9Mil7dmFyIHg9TWF0aC5mbG9vcihwb2ludHNbb2Zmc2V0XSkseT1NYXRoLmZsb29yKHBvaW50c1tvZmZzZXQrMV0pO2lmKC0xPnh8fHg+d2lkdGh8fC0xPnl8fHk+aGVpZ2h0KXRocm93XCJFcnJvci5jaGVja0FuZE51ZGdlUG9pbnRzIFwiO251ZGdlZD0hMSwtMT09eD8ocG9pbnRzW29mZnNldF09MCxudWRnZWQ9ITApOng9PXdpZHRoJiYocG9pbnRzW29mZnNldF09d2lkdGgtMSxudWRnZWQ9ITApLC0xPT15Pyhwb2ludHNbb2Zmc2V0KzFdPTAsbnVkZ2VkPSEwKTp5PT1oZWlnaHQmJihwb2ludHNbb2Zmc2V0KzFdPWhlaWdodC0xLG51ZGdlZD0hMCl9bnVkZ2VkPSEwO2Zvcih2YXIgb2Zmc2V0PXBvaW50cy5MZW5ndGgtMjtvZmZzZXQ+PTAmJm51ZGdlZDtvZmZzZXQtPTIpe3ZhciB4PU1hdGguZmxvb3IocG9pbnRzW29mZnNldF0pLHk9TWF0aC5mbG9vcihwb2ludHNbb2Zmc2V0KzFdKTtpZigtMT54fHx4PndpZHRofHwtMT55fHx5PmhlaWdodCl0aHJvd1wiRXJyb3IuY2hlY2tBbmROdWRnZVBvaW50cyBcIjtudWRnZWQ9ITEsLTE9PXg/KHBvaW50c1tvZmZzZXRdPTAsbnVkZ2VkPSEwKTp4PT13aWR0aCYmKHBvaW50c1tvZmZzZXRdPXdpZHRoLTEsbnVkZ2VkPSEwKSwtMT09eT8ocG9pbnRzW29mZnNldCsxXT0wLG51ZGdlZD0hMCk6eT09aGVpZ2h0JiYocG9pbnRzW29mZnNldCsxXT1oZWlnaHQtMSxudWRnZWQ9ITApfX0sR3JpZFNhbXBsZXIuc2FtcGxlR3JpZDM9ZnVuY3Rpb24oaW1hZ2UsZGltZW5zaW9uLHRyYW5zZm9ybSl7Zm9yKHZhciBiaXRzPW5ldyBCaXRNYXRyaXgoZGltZW5zaW9uKSxwb2ludHM9bmV3IEFycmF5KGRpbWVuc2lvbjw8MSkseT0wO2RpbWVuc2lvbj55O3krKyl7Zm9yKHZhciBtYXg9cG9pbnRzLmxlbmd0aCxpVmFsdWU9eSsuNSx4PTA7bWF4Png7eCs9Milwb2ludHNbeF09KHg+PjEpKy41LHBvaW50c1t4KzFdPWlWYWx1ZTt0cmFuc2Zvcm0udHJhbnNmb3JtUG9pbnRzMShwb2ludHMpLEdyaWRTYW1wbGVyLmNoZWNrQW5kTnVkZ2VQb2ludHMoaW1hZ2UscG9pbnRzKTt0cnl7Zm9yKHZhciB4PTA7bWF4Png7eCs9Mil7dmFyIHhwb2ludD00Kk1hdGguZmxvb3IocG9pbnRzW3hdKStNYXRoLmZsb29yKHBvaW50c1t4KzFdKSpxcmNvZGUud2lkdGgqNCxiaXQ9aW1hZ2VbTWF0aC5mbG9vcihwb2ludHNbeF0pK3FyY29kZS53aWR0aCpNYXRoLmZsb29yKHBvaW50c1t4KzFdKV07cXJjb2RlLmltYWdlZGF0YS5kYXRhW3hwb2ludF09Yml0PzI1NTowLHFyY29kZS5pbWFnZWRhdGEuZGF0YVt4cG9pbnQrMV09Yml0PzI1NTowLHFyY29kZS5pbWFnZWRhdGEuZGF0YVt4cG9pbnQrMl09MCxxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbeHBvaW50KzNdPTI1NSxiaXQmJmJpdHMuc2V0X1JlbmFtZWQoeD4+MSx5KX19Y2F0Y2goYWlvb2JlKXt0aHJvd1wiRXJyb3IuY2hlY2tBbmROdWRnZVBvaW50c1wifX1yZXR1cm4gYml0c30sR3JpZFNhbXBsZXIuc2FtcGxlR3JpZHg9ZnVuY3Rpb24oaW1hZ2UsZGltZW5zaW9uLHAxVG9YLHAxVG9ZLHAyVG9YLHAyVG9ZLHAzVG9YLHAzVG9ZLHA0VG9YLHA0VG9ZLHAxRnJvbVgscDFGcm9tWSxwMkZyb21YLHAyRnJvbVkscDNGcm9tWCxwM0Zyb21ZLHA0RnJvbVgscDRGcm9tWSl7dmFyIHRyYW5zZm9ybT1QZXJzcGVjdGl2ZVRyYW5zZm9ybS5xdWFkcmlsYXRlcmFsVG9RdWFkcmlsYXRlcmFsKHAxVG9YLHAxVG9ZLHAyVG9YLHAyVG9ZLHAzVG9YLHAzVG9ZLHA0VG9YLHA0VG9ZLHAxRnJvbVgscDFGcm9tWSxwMkZyb21YLHAyRnJvbVkscDNGcm9tWCxwM0Zyb21ZLHA0RnJvbVgscDRGcm9tWSk7cmV0dXJuIEdyaWRTYW1wbGVyLnNhbXBsZUdyaWQzKGltYWdlLGRpbWVuc2lvbix0cmFuc2Zvcm0pfSxWZXJzaW9uLlZFUlNJT05fREVDT0RFX0lORk89bmV3IEFycmF5KDMxODkyLDM0MjM2LDM5NTc3LDQyMTk1LDQ4MTE4LDUxMDQyLDU1MzY3LDU4ODkzLDYzNzg0LDY4NDcyLDcwNzQ5LDc2MzExLDc5MTU0LDg0MzkwLDg3NjgzLDkyMzYxLDk2MjM2LDEwMjA4NCwxMDI4ODEsMTEwNTA3LDExMDczNCwxMTc3ODYsMTE5NjE1LDEyNjMyNSwxMjc1NjgsMTMzNTg5LDEzNjk0NCwxNDE0OTgsMTQ1MzExLDE1MDI4MywxNTI2MjIsMTU4MzA4LDE2MTA4OSwxNjcwMTcpLFZlcnNpb24uVkVSU0lPTlM9YnVpbGRWZXJzaW9ucygpLFZlcnNpb24uZ2V0VmVyc2lvbkZvck51bWJlcj1mdW5jdGlvbih2ZXJzaW9uTnVtYmVyKXtpZigxPnZlcnNpb25OdW1iZXJ8fHZlcnNpb25OdW1iZXI+NDApdGhyb3dcIkFyZ3VtZW50RXhjZXB0aW9uXCI7cmV0dXJuIFZlcnNpb24uVkVSU0lPTlNbdmVyc2lvbk51bWJlci0xXX0sVmVyc2lvbi5nZXRQcm92aXNpb25hbFZlcnNpb25Gb3JEaW1lbnNpb249ZnVuY3Rpb24oZGltZW5zaW9uKXtpZihkaW1lbnNpb24lNCE9MSl0aHJvd1wiRXJyb3IgZ2V0UHJvdmlzaW9uYWxWZXJzaW9uRm9yRGltZW5zaW9uXCI7dHJ5e3JldHVybiBWZXJzaW9uLmdldFZlcnNpb25Gb3JOdW1iZXIoZGltZW5zaW9uLTE3Pj4yKX1jYXRjaChpYWUpe3Rocm93XCJFcnJvciBnZXRWZXJzaW9uRm9yTnVtYmVyXCJ9fSxWZXJzaW9uLmRlY29kZVZlcnNpb25JbmZvcm1hdGlvbj1mdW5jdGlvbih2ZXJzaW9uQml0cyl7Zm9yKHZhciBiZXN0RGlmZmVyZW5jZT00Mjk0OTY3Mjk1LGJlc3RWZXJzaW9uPTAsaT0wO2k8VmVyc2lvbi5WRVJTSU9OX0RFQ09ERV9JTkZPLmxlbmd0aDtpKyspe3ZhciB0YXJnZXRWZXJzaW9uPVZlcnNpb24uVkVSU0lPTl9ERUNPREVfSU5GT1tpXTtpZih0YXJnZXRWZXJzaW9uPT12ZXJzaW9uQml0cylyZXR1cm4gdGhpcy5nZXRWZXJzaW9uRm9yTnVtYmVyKGkrNyk7dmFyIGJpdHNEaWZmZXJlbmNlPUZvcm1hdEluZm9ybWF0aW9uLm51bUJpdHNEaWZmZXJpbmcodmVyc2lvbkJpdHMsdGFyZ2V0VmVyc2lvbik7YmVzdERpZmZlcmVuY2U+Yml0c0RpZmZlcmVuY2UmJihiZXN0VmVyc2lvbj1pKzcsYmVzdERpZmZlcmVuY2U9Yml0c0RpZmZlcmVuY2UpfXJldHVybiAzPj1iZXN0RGlmZmVyZW5jZT90aGlzLmdldFZlcnNpb25Gb3JOdW1iZXIoYmVzdFZlcnNpb24pOm51bGx9LFBlcnNwZWN0aXZlVHJhbnNmb3JtLnF1YWRyaWxhdGVyYWxUb1F1YWRyaWxhdGVyYWw9ZnVuY3Rpb24oeDAseTAseDEseTEseDIseTIseDMseTMseDBwLHkwcCx4MXAseTFwLHgycCx5MnAseDNwLHkzcCl7dmFyIHFUb1M9dGhpcy5xdWFkcmlsYXRlcmFsVG9TcXVhcmUoeDAseTAseDEseTEseDIseTIseDMseTMpLHNUb1E9dGhpcy5zcXVhcmVUb1F1YWRyaWxhdGVyYWwoeDBwLHkwcCx4MXAseTFwLHgycCx5MnAseDNwLHkzcCk7cmV0dXJuIHNUb1EudGltZXMocVRvUyl9LFBlcnNwZWN0aXZlVHJhbnNmb3JtLnNxdWFyZVRvUXVhZHJpbGF0ZXJhbD1mdW5jdGlvbih4MCx5MCx4MSx5MSx4Mix5Mix4Myx5Myl7cmV0dXJuIGR5Mj15My15MixkeTM9eTAteTEreTIteTMsMD09ZHkyJiYwPT1keTM/bmV3IFBlcnNwZWN0aXZlVHJhbnNmb3JtKHgxLXgwLHgyLXgxLHgwLHkxLXkwLHkyLXkxLHkwLDAsMCwxKTooZHgxPXgxLXgyLGR4Mj14My14MixkeDM9eDAteDEreDIteDMsZHkxPXkxLXkyLGRlbm9taW5hdG9yPWR4MSpkeTItZHgyKmR5MSxhMTM9KGR4MypkeTItZHgyKmR5MykvZGVub21pbmF0b3IsYTIzPShkeDEqZHkzLWR4MypkeTEpL2Rlbm9taW5hdG9yLG5ldyBQZXJzcGVjdGl2ZVRyYW5zZm9ybSh4MS14MCthMTMqeDEseDMteDArYTIzKngzLHgwLHkxLXkwK2ExMyp5MSx5My15MCthMjMqeTMseTAsYTEzLGEyMywxKSl9LFBlcnNwZWN0aXZlVHJhbnNmb3JtLnF1YWRyaWxhdGVyYWxUb1NxdWFyZT1mdW5jdGlvbih4MCx5MCx4MSx5MSx4Mix5Mix4Myx5Myl7cmV0dXJuIHRoaXMuc3F1YXJlVG9RdWFkcmlsYXRlcmFsKHgwLHkwLHgxLHkxLHgyLHkyLHgzLHkzKS5idWlsZEFkam9pbnQoKX07dmFyIEZPUk1BVF9JTkZPX01BU0tfUVI9MjE1MjIsRk9STUFUX0lORk9fREVDT0RFX0xPT0tVUD1uZXcgQXJyYXkobmV3IEFycmF5KDIxNTIyLDApLG5ldyBBcnJheSgyMDc3MywxKSxuZXcgQXJyYXkoMjQxODgsMiksbmV3IEFycmF5KDIzMzcxLDMpLG5ldyBBcnJheSgxNzkxMyw0KSxuZXcgQXJyYXkoMTY1OTAsNSksbmV3IEFycmF5KDIwMzc1LDYpLG5ldyBBcnJheSgxOTEwNCw3KSxuZXcgQXJyYXkoMzA2NjAsOCksbmV3IEFycmF5KDI5NDI3LDkpLG5ldyBBcnJheSgzMjE3MCwxMCksbmV3IEFycmF5KDMwODc3LDExKSxuZXcgQXJyYXkoMjYxNTksMTIpLG5ldyBBcnJheSgyNTM2OCwxMyksbmV3IEFycmF5KDI3NzEzLDE0KSxuZXcgQXJyYXkoMjY5OTgsMTUpLG5ldyBBcnJheSg1NzY5LDE2KSxuZXcgQXJyYXkoNTA1NCwxNyksbmV3IEFycmF5KDczOTksMTgpLG5ldyBBcnJheSg2NjA4LDE5KSxuZXcgQXJyYXkoMTg5MCwyMCksbmV3IEFycmF5KDU5NywyMSksbmV3IEFycmF5KDMzNDAsMjIpLG5ldyBBcnJheSgyMTA3LDIzKSxuZXcgQXJyYXkoMTM2NjMsMjQpLG5ldyBBcnJheSgxMjM5MiwyNSksbmV3IEFycmF5KDE2MTc3LDI2KSxuZXcgQXJyYXkoMTQ4NTQsMjcpLG5ldyBBcnJheSg5Mzk2LDI4KSxuZXcgQXJyYXkoODU3OSwyOSksbmV3IEFycmF5KDExOTk0LDMwKSxuZXcgQXJyYXkoMTEyNDUsMzEpKSxCSVRTX1NFVF9JTl9IQUxGX0JZVEU9bmV3IEFycmF5KDAsMSwxLDIsMSwyLDIsMywxLDIsMiwzLDIsMywzLDQpO0Zvcm1hdEluZm9ybWF0aW9uLm51bUJpdHNEaWZmZXJpbmc9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYV49YixCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmYV0rQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JlVSU2hpZnQoYSw0KV0rQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JlVSU2hpZnQoYSw4KV0rQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JlVSU2hpZnQoYSwxMildK0JJVFNfU0VUX0lOX0hBTEZfQllURVsxNSZVUlNoaWZ0KGEsMTYpXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDIwKV0rQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JlVSU2hpZnQoYSwyNCldK0JJVFNfU0VUX0lOX0hBTEZfQllURVsxNSZVUlNoaWZ0KGEsMjgpXX0sRm9ybWF0SW5mb3JtYXRpb24uZGVjb2RlRm9ybWF0SW5mb3JtYXRpb249ZnVuY3Rpb24obWFza2VkRm9ybWF0SW5mbyl7dmFyIGZvcm1hdEluZm89Rm9ybWF0SW5mb3JtYXRpb24uZG9EZWNvZGVGb3JtYXRJbmZvcm1hdGlvbihtYXNrZWRGb3JtYXRJbmZvKTtyZXR1cm4gbnVsbCE9Zm9ybWF0SW5mbz9mb3JtYXRJbmZvOkZvcm1hdEluZm9ybWF0aW9uLmRvRGVjb2RlRm9ybWF0SW5mb3JtYXRpb24obWFza2VkRm9ybWF0SW5mb15GT1JNQVRfSU5GT19NQVNLX1FSKX0sRm9ybWF0SW5mb3JtYXRpb24uZG9EZWNvZGVGb3JtYXRJbmZvcm1hdGlvbj1mdW5jdGlvbihtYXNrZWRGb3JtYXRJbmZvKXtmb3IodmFyIGJlc3REaWZmZXJlbmNlPTQyOTQ5NjcyOTUsYmVzdEZvcm1hdEluZm89MCxpPTA7aTxGT1JNQVRfSU5GT19ERUNPREVfTE9PS1VQLmxlbmd0aDtpKyspe3ZhciBkZWNvZGVJbmZvPUZPUk1BVF9JTkZPX0RFQ09ERV9MT09LVVBbaV0sdGFyZ2V0SW5mbz1kZWNvZGVJbmZvWzBdO2lmKHRhcmdldEluZm89PW1hc2tlZEZvcm1hdEluZm8pcmV0dXJuIG5ldyBGb3JtYXRJbmZvcm1hdGlvbihkZWNvZGVJbmZvWzFdKTt2YXIgYml0c0RpZmZlcmVuY2U9dGhpcy5udW1CaXRzRGlmZmVyaW5nKG1hc2tlZEZvcm1hdEluZm8sdGFyZ2V0SW5mbyk7YmVzdERpZmZlcmVuY2U+Yml0c0RpZmZlcmVuY2UmJihiZXN0Rm9ybWF0SW5mbz1kZWNvZGVJbmZvWzFdLGJlc3REaWZmZXJlbmNlPWJpdHNEaWZmZXJlbmNlKX1yZXR1cm4gMz49YmVzdERpZmZlcmVuY2U/bmV3IEZvcm1hdEluZm9ybWF0aW9uKGJlc3RGb3JtYXRJbmZvKTpudWxsfSxFcnJvckNvcnJlY3Rpb25MZXZlbC5mb3JCaXRzPWZ1bmN0aW9uKGJpdHMpe2lmKDA+Yml0c3x8Yml0cz49Rk9SX0JJVFMuTGVuZ3RoKXRocm93XCJBcmd1bWVudEV4Y2VwdGlvblwiO3JldHVybiBGT1JfQklUU1tiaXRzXX07dmFyIEw9bmV3IEVycm9yQ29ycmVjdGlvbkxldmVsKDAsMSxcIkxcIiksTT1uZXcgRXJyb3JDb3JyZWN0aW9uTGV2ZWwoMSwwLFwiTVwiKSxRPW5ldyBFcnJvckNvcnJlY3Rpb25MZXZlbCgyLDMsXCJRXCIpLEg9bmV3IEVycm9yQ29ycmVjdGlvbkxldmVsKDMsMixcIkhcIiksRk9SX0JJVFM9bmV3IEFycmF5KE0sTCxILFEpO0RhdGFCbG9jay5nZXREYXRhQmxvY2tzPWZ1bmN0aW9uKHJhd0NvZGV3b3Jkcyx2ZXJzaW9uLGVjTGV2ZWwpe2lmKHJhd0NvZGV3b3Jkcy5sZW5ndGghPXZlcnNpb24uVG90YWxDb2Rld29yZHMpdGhyb3dcIkFyZ3VtZW50RXhjZXB0aW9uXCI7Zm9yKHZhciBlY0Jsb2Nrcz12ZXJzaW9uLmdldEVDQmxvY2tzRm9yTGV2ZWwoZWNMZXZlbCksdG90YWxCbG9ja3M9MCxlY0Jsb2NrQXJyYXk9ZWNCbG9ja3MuZ2V0RUNCbG9ja3MoKSxpPTA7aTxlY0Jsb2NrQXJyYXkubGVuZ3RoO2krKyl0b3RhbEJsb2Nrcys9ZWNCbG9ja0FycmF5W2ldLkNvdW50O2Zvcih2YXIgcmVzdWx0PW5ldyBBcnJheSh0b3RhbEJsb2NrcyksbnVtUmVzdWx0QmxvY2tzPTAsaj0wO2o8ZWNCbG9ja0FycmF5Lmxlbmd0aDtqKyspZm9yKHZhciBlY0Jsb2NrPWVjQmxvY2tBcnJheVtqXSxpPTA7aTxlY0Jsb2NrLkNvdW50O2krKyl7dmFyIG51bURhdGFDb2Rld29yZHM9ZWNCbG9jay5EYXRhQ29kZXdvcmRzLG51bUJsb2NrQ29kZXdvcmRzPWVjQmxvY2tzLkVDQ29kZXdvcmRzUGVyQmxvY2srbnVtRGF0YUNvZGV3b3JkcztyZXN1bHRbbnVtUmVzdWx0QmxvY2tzKytdPW5ldyBEYXRhQmxvY2sobnVtRGF0YUNvZGV3b3JkcyxuZXcgQXJyYXkobnVtQmxvY2tDb2Rld29yZHMpKX1mb3IodmFyIHNob3J0ZXJCbG9ja3NUb3RhbENvZGV3b3Jkcz1yZXN1bHRbMF0uY29kZXdvcmRzLmxlbmd0aCxsb25nZXJCbG9ja3NTdGFydEF0PXJlc3VsdC5sZW5ndGgtMTtsb25nZXJCbG9ja3NTdGFydEF0Pj0wOyl7dmFyIG51bUNvZGV3b3Jkcz1yZXN1bHRbbG9uZ2VyQmxvY2tzU3RhcnRBdF0uY29kZXdvcmRzLmxlbmd0aDtpZihudW1Db2Rld29yZHM9PXNob3J0ZXJCbG9ja3NUb3RhbENvZGV3b3JkcylicmVhaztsb25nZXJCbG9ja3NTdGFydEF0LS19bG9uZ2VyQmxvY2tzU3RhcnRBdCsrO2Zvcih2YXIgc2hvcnRlckJsb2Nrc051bURhdGFDb2Rld29yZHM9c2hvcnRlckJsb2Nrc1RvdGFsQ29kZXdvcmRzLWVjQmxvY2tzLkVDQ29kZXdvcmRzUGVyQmxvY2sscmF3Q29kZXdvcmRzT2Zmc2V0PTAsaT0wO3Nob3J0ZXJCbG9ja3NOdW1EYXRhQ29kZXdvcmRzPmk7aSsrKWZvcih2YXIgaj0wO251bVJlc3VsdEJsb2Nrcz5qO2orKylyZXN1bHRbal0uY29kZXdvcmRzW2ldPXJhd0NvZGV3b3Jkc1tyYXdDb2Rld29yZHNPZmZzZXQrK107Zm9yKHZhciBqPWxvbmdlckJsb2Nrc1N0YXJ0QXQ7bnVtUmVzdWx0QmxvY2tzPmo7aisrKXJlc3VsdFtqXS5jb2Rld29yZHNbc2hvcnRlckJsb2Nrc051bURhdGFDb2Rld29yZHNdPXJhd0NvZGV3b3Jkc1tyYXdDb2Rld29yZHNPZmZzZXQrK107Zm9yKHZhciBtYXg9cmVzdWx0WzBdLmNvZGV3b3Jkcy5sZW5ndGgsaT1zaG9ydGVyQmxvY2tzTnVtRGF0YUNvZGV3b3JkczttYXg+aTtpKyspZm9yKHZhciBqPTA7bnVtUmVzdWx0QmxvY2tzPmo7aisrKXt2YXIgaU9mZnNldD1sb25nZXJCbG9ja3NTdGFydEF0Pmo/aTppKzE7cmVzdWx0W2pdLmNvZGV3b3Jkc1tpT2Zmc2V0XT1yYXdDb2Rld29yZHNbcmF3Q29kZXdvcmRzT2Zmc2V0KytdfXJldHVybiByZXN1bHR9LERhdGFNYXNrPXt9LERhdGFNYXNrLmZvclJlZmVyZW5jZT1mdW5jdGlvbihyZWZlcmVuY2Upe2lmKDA+cmVmZXJlbmNlfHxyZWZlcmVuY2U+Nyl0aHJvd1wiU3lzdGVtLkFyZ3VtZW50RXhjZXB0aW9uXCI7cmV0dXJuIERhdGFNYXNrLkRBVEFfTUFTS1NbcmVmZXJlbmNlXX0sRGF0YU1hc2suREFUQV9NQVNLUz1uZXcgQXJyYXkobmV3IERhdGFNYXNrMDAwLG5ldyBEYXRhTWFzazAwMSxuZXcgRGF0YU1hc2swMTAsbmV3IERhdGFNYXNrMDExLG5ldyBEYXRhTWFzazEwMCxuZXcgRGF0YU1hc2sxMDEsbmV3IERhdGFNYXNrMTEwLG5ldyBEYXRhTWFzazExMSksR0YyNTYuUVJfQ09ERV9GSUVMRD1uZXcgR0YyNTYoMjg1KSxHRjI1Ni5EQVRBX01BVFJJWF9GSUVMRD1uZXcgR0YyNTYoMzAxKSxHRjI1Ni5hZGRPclN1YnRyYWN0PWZ1bmN0aW9uKGEsYil7cmV0dXJuIGFeYn0sRGVjb2Rlcj17fSxEZWNvZGVyLnJzRGVjb2Rlcj1uZXcgUmVlZFNvbG9tb25EZWNvZGVyKEdGMjU2LlFSX0NPREVfRklFTEQpLERlY29kZXIuY29ycmVjdEVycm9ycz1mdW5jdGlvbihjb2Rld29yZEJ5dGVzLG51bURhdGFDb2Rld29yZHMpe2Zvcih2YXIgbnVtQ29kZXdvcmRzPWNvZGV3b3JkQnl0ZXMubGVuZ3RoLGNvZGV3b3Jkc0ludHM9bmV3IEFycmF5KG51bUNvZGV3b3JkcyksaT0wO251bUNvZGV3b3Jkcz5pO2krKyljb2Rld29yZHNJbnRzW2ldPTI1NSZjb2Rld29yZEJ5dGVzW2ldO3ZhciBudW1FQ0NvZGV3b3Jkcz1jb2Rld29yZEJ5dGVzLmxlbmd0aC1udW1EYXRhQ29kZXdvcmRzO3RyeXtEZWNvZGVyLnJzRGVjb2Rlci5kZWNvZGUoY29kZXdvcmRzSW50cyxudW1FQ0NvZGV3b3Jkcyl9Y2F0Y2gocnNlKXt0aHJvdyByc2V9Zm9yKHZhciBpPTA7bnVtRGF0YUNvZGV3b3Jkcz5pO2krKyljb2Rld29yZEJ5dGVzW2ldPWNvZGV3b3Jkc0ludHNbaV19LERlY29kZXIuZGVjb2RlPWZ1bmN0aW9uKGJpdHMpe2Zvcih2YXIgcGFyc2VyPW5ldyBCaXRNYXRyaXhQYXJzZXIoYml0cyksdmVyc2lvbj1wYXJzZXIucmVhZFZlcnNpb24oKSxlY0xldmVsPXBhcnNlci5yZWFkRm9ybWF0SW5mb3JtYXRpb24oKS5FcnJvckNvcnJlY3Rpb25MZXZlbCxjb2Rld29yZHM9cGFyc2VyLnJlYWRDb2Rld29yZHMoKSxkYXRhQmxvY2tzPURhdGFCbG9jay5nZXREYXRhQmxvY2tzKGNvZGV3b3Jkcyx2ZXJzaW9uLGVjTGV2ZWwpLHRvdGFsQnl0ZXM9MCxpPTA7aTxkYXRhQmxvY2tzLkxlbmd0aDtpKyspdG90YWxCeXRlcys9ZGF0YUJsb2Nrc1tpXS5OdW1EYXRhQ29kZXdvcmRzO2Zvcih2YXIgcmVzdWx0Qnl0ZXM9bmV3IEFycmF5KHRvdGFsQnl0ZXMpLHJlc3VsdE9mZnNldD0wLGo9MDtqPGRhdGFCbG9ja3MubGVuZ3RoO2orKyl7dmFyIGRhdGFCbG9jaz1kYXRhQmxvY2tzW2pdLGNvZGV3b3JkQnl0ZXM9ZGF0YUJsb2NrLkNvZGV3b3JkcyxudW1EYXRhQ29kZXdvcmRzPWRhdGFCbG9jay5OdW1EYXRhQ29kZXdvcmRzO0RlY29kZXIuY29ycmVjdEVycm9ycyhjb2Rld29yZEJ5dGVzLG51bURhdGFDb2Rld29yZHMpO2Zvcih2YXIgaT0wO251bURhdGFDb2Rld29yZHM+aTtpKyspcmVzdWx0Qnl0ZXNbcmVzdWx0T2Zmc2V0KytdPWNvZGV3b3JkQnl0ZXNbaV19dmFyIHJlYWRlcj1uZXcgUVJDb2RlRGF0YUJsb2NrUmVhZGVyKHJlc3VsdEJ5dGVzLHZlcnNpb24uVmVyc2lvbk51bWJlcixlY0xldmVsLkJpdHMpO3JldHVybiByZWFkZXJ9LHFyY29kZT17fSxxcmNvZGUuaW1hZ2VkYXRhPW51bGwscXJjb2RlLndpZHRoPTAscXJjb2RlLmhlaWdodD0wLHFyY29kZS5xckNvZGVTeW1ib2w9bnVsbCxxcmNvZGUuZGVidWc9ITEscXJjb2RlLnNpemVPZkRhdGFMZW5ndGhJbmZvPVtbMTAsOSw4LDhdLFsxMiwxMSwxNiwxMF0sWzE0LDEzLDE2LDEyXV0scXJjb2RlLmNhbGxiYWNrPW51bGwscXJjb2RlLmRlY29kZT1mdW5jdGlvbihzcmMpe2lmKDA9PWFyZ3VtZW50cy5sZW5ndGgpe3ZhciBjYW52YXNfcXI9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxci1jYW52YXNcIiksY29udGV4dD1jYW52YXNfcXIuZ2V0Q29udGV4dChcIjJkXCIpO3JldHVybiBxcmNvZGUud2lkdGg9Y2FudmFzX3FyLndpZHRoLHFyY29kZS5oZWlnaHQ9Y2FudmFzX3FyLmhlaWdodCxxcmNvZGUuaW1hZ2VkYXRhPWNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsMCxxcmNvZGUud2lkdGgscXJjb2RlLmhlaWdodCkscXJjb2RlLnJlc3VsdD1xcmNvZGUucHJvY2Vzcyhjb250ZXh0KSxudWxsIT1xcmNvZGUuY2FsbGJhY2smJnFyY29kZS5jYWxsYmFjayhxcmNvZGUucmVzdWx0KSxxcmNvZGUucmVzdWx0fXZhciBpbWFnZT1uZXcgSW1hZ2U7aW1hZ2Uub25sb2FkPWZ1bmN0aW9uKCl7dmFyIGNhbnZhc19xcj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLGNvbnRleHQ9Y2FudmFzX3FyLmdldENvbnRleHQoXCIyZFwiKSxjYW52YXNfb3V0PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3V0LWNhbnZhc1wiKTtpZihudWxsIT1jYW52YXNfb3V0KXt2YXIgb3V0Y3R4PWNhbnZhc19vdXQuZ2V0Q29udGV4dChcIjJkXCIpO291dGN0eC5jbGVhclJlY3QoMCwwLDMyMCwyNDApLG91dGN0eC5kcmF3SW1hZ2UoaW1hZ2UsMCwwLDMyMCwyNDApfWNhbnZhc19xci53aWR0aD1pbWFnZS53aWR0aCxjYW52YXNfcXIuaGVpZ2h0PWltYWdlLmhlaWdodCxjb250ZXh0LmRyYXdJbWFnZShpbWFnZSwwLDApLHFyY29kZS53aWR0aD1pbWFnZS53aWR0aCxxcmNvZGUuaGVpZ2h0PWltYWdlLmhlaWdodDt0cnl7cXJjb2RlLmltYWdlZGF0YT1jb250ZXh0LmdldEltYWdlRGF0YSgwLDAsaW1hZ2Uud2lkdGgsaW1hZ2UuaGVpZ2h0KX1jYXRjaChlKXtyZXR1cm4gcXJjb2RlLnJlc3VsdD1cIkNyb3NzIGRvbWFpbiBpbWFnZSByZWFkaW5nIG5vdCBzdXBwb3J0ZWQgaW4geW91ciBicm93c2VyISBTYXZlIGl0IHRvIHlvdXIgY29tcHV0ZXIgdGhlbiBkcmFnIGFuZCBkcm9wIHRoZSBmaWxlIVwiLHZvaWQobnVsbCE9cXJjb2RlLmNhbGxiYWNrJiZxcmNvZGUuY2FsbGJhY2socXJjb2RlLnJlc3VsdCkpfXRyeXtxcmNvZGUucmVzdWx0PXFyY29kZS5wcm9jZXNzKGNvbnRleHQpfWNhdGNoKGUpe2NvbnNvbGUubG9nKGUpLHFyY29kZS5yZXN1bHQ9XCJlcnJvciBkZWNvZGluZyBRUiBDb2RlXCJ9bnVsbCE9cXJjb2RlLmNhbGxiYWNrJiZxcmNvZGUuY2FsbGJhY2socXJjb2RlLnJlc3VsdCl9LGltYWdlLnNyYz1zcmN9LHFyY29kZS5kZWNvZGVfdXRmOD1mdW5jdGlvbihzKXtyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVzY2FwZShzKSl9LHFyY29kZS5wcm9jZXNzPWZ1bmN0aW9uKGN0eCl7dmFyIHN0YXJ0PShuZXcgRGF0ZSkuZ2V0VGltZSgpLGltYWdlPXFyY29kZS5ncmF5U2NhbGVUb0JpdG1hcChxcmNvZGUuZ3JheXNjYWxlKCkpO2lmKHFyY29kZS5kZWJ1Zyl7Zm9yKHZhciB5PTA7eTxxcmNvZGUuaGVpZ2h0O3krKylmb3IodmFyIHg9MDt4PHFyY29kZS53aWR0aDt4Kyspe3ZhciBwb2ludD00KngreSpxcmNvZGUud2lkdGgqNDtxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbcG9pbnRdPShpbWFnZVt4K3kqcXJjb2RlLndpZHRoXSwwKSxxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbcG9pbnQrMV09KGltYWdlW3greSpxcmNvZGUud2lkdGhdLDApLHFyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludCsyXT1pbWFnZVt4K3kqcXJjb2RlLndpZHRoXT8yNTU6MH1jdHgucHV0SW1hZ2VEYXRhKHFyY29kZS5pbWFnZWRhdGEsMCwwKX12YXIgZGV0ZWN0b3I9bmV3IERldGVjdG9yKGltYWdlKSxxUkNvZGVNYXRyaXg9ZGV0ZWN0b3IuZGV0ZWN0KCk7cXJjb2RlLmRlYnVnJiZjdHgucHV0SW1hZ2VEYXRhKHFyY29kZS5pbWFnZWRhdGEsMCwwKTtmb3IodmFyIHJlYWRlcj1EZWNvZGVyLmRlY29kZShxUkNvZGVNYXRyaXguYml0cyksZGF0YT1yZWFkZXIuRGF0YUJ5dGUsc3RyPVwiXCIsaT0wO2k8ZGF0YS5sZW5ndGg7aSsrKWZvcih2YXIgaj0wO2o8ZGF0YVtpXS5sZW5ndGg7aisrKXN0cis9U3RyaW5nLmZyb21DaGFyQ29kZShkYXRhW2ldW2pdKTt2YXIgZW5kPShuZXcgRGF0ZSkuZ2V0VGltZSgpLHRpbWU9ZW5kLXN0YXJ0O3JldHVybiBjb25zb2xlLmxvZyh0aW1lKSxxcmNvZGUuZGVjb2RlX3V0Zjgoc3RyKX0scXJjb2RlLmdldFBpeGVsPWZ1bmN0aW9uKHgseSl7aWYocXJjb2RlLndpZHRoPHgpdGhyb3dcInBvaW50IGVycm9yXCI7aWYocXJjb2RlLmhlaWdodDx5KXRocm93XCJwb2ludCBlcnJvclwiO3JldHVybiBwb2ludD00KngreSpxcmNvZGUud2lkdGgqNCxwPSgzMypxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbcG9pbnRdKzM0KnFyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludCsxXSszMypxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbcG9pbnQrMl0pLzEwMCxwfSxxcmNvZGUuYmluYXJpemU9ZnVuY3Rpb24odGgpe2Zvcih2YXIgcmV0PW5ldyBBcnJheShxcmNvZGUud2lkdGgqcXJjb2RlLmhlaWdodCkseT0wO3k8cXJjb2RlLmhlaWdodDt5KyspZm9yKHZhciB4PTA7eDxxcmNvZGUud2lkdGg7eCsrKXt2YXIgZ3JheT1xcmNvZGUuZ2V0UGl4ZWwoeCx5KTtyZXRbeCt5KnFyY29kZS53aWR0aF09dGg+PWdyYXk/ITA6ITF9cmV0dXJuIHJldH0scXJjb2RlLmdldE1pZGRsZUJyaWdodG5lc3NQZXJBcmVhPWZ1bmN0aW9uKGltYWdlKXtmb3IodmFyIG51bVNxcnRBcmVhPTQsYXJlYVdpZHRoPU1hdGguZmxvb3IocXJjb2RlLndpZHRoL251bVNxcnRBcmVhKSxhcmVhSGVpZ2h0PU1hdGguZmxvb3IocXJjb2RlLmhlaWdodC9udW1TcXJ0QXJlYSksbWlubWF4PW5ldyBBcnJheShudW1TcXJ0QXJlYSksaT0wO251bVNxcnRBcmVhPmk7aSsrKXttaW5tYXhbaV09bmV3IEFycmF5KG51bVNxcnRBcmVhKTtmb3IodmFyIGkyPTA7bnVtU3FydEFyZWE+aTI7aTIrKyltaW5tYXhbaV1baTJdPW5ldyBBcnJheSgwLDApfWZvcih2YXIgYXk9MDtudW1TcXJ0QXJlYT5heTtheSsrKWZvcih2YXIgYXg9MDtudW1TcXJ0QXJlYT5heDtheCsrKXttaW5tYXhbYXhdW2F5XVswXT0yNTU7Zm9yKHZhciBkeT0wO2FyZWFIZWlnaHQ+ZHk7ZHkrKylmb3IodmFyIGR4PTA7YXJlYVdpZHRoPmR4O2R4Kyspe3ZhciB0YXJnZXQ9aW1hZ2VbYXJlYVdpZHRoKmF4K2R4KyhhcmVhSGVpZ2h0KmF5K2R5KSpxcmNvZGUud2lkdGhdO3RhcmdldDxtaW5tYXhbYXhdW2F5XVswXSYmKG1pbm1heFtheF1bYXldWzBdPXRhcmdldCksdGFyZ2V0Pm1pbm1heFtheF1bYXldWzFdJiYobWlubWF4W2F4XVtheV1bMV09dGFyZ2V0KX19Zm9yKHZhciBtaWRkbGU9bmV3IEFycmF5KG51bVNxcnRBcmVhKSxpMz0wO251bVNxcnRBcmVhPmkzO2kzKyspbWlkZGxlW2kzXT1uZXcgQXJyYXkobnVtU3FydEFyZWEpO2Zvcih2YXIgYXk9MDtudW1TcXJ0QXJlYT5heTtheSsrKWZvcih2YXIgYXg9MDtudW1TcXJ0QXJlYT5heDtheCsrKW1pZGRsZVtheF1bYXldPU1hdGguZmxvb3IoKG1pbm1heFtheF1bYXldWzBdK21pbm1heFtheF1bYXldWzFdKS8yKTtyZXR1cm4gbWlkZGxlfSxxcmNvZGUuZ3JheVNjYWxlVG9CaXRtYXA9ZnVuY3Rpb24oZ3JheVNjYWxlKXtmb3IodmFyIG1pZGRsZT1xcmNvZGUuZ2V0TWlkZGxlQnJpZ2h0bmVzc1BlckFyZWEoZ3JheVNjYWxlKSxzcXJ0TnVtQXJlYT1taWRkbGUubGVuZ3RoLGFyZWFXaWR0aD1NYXRoLmZsb29yKHFyY29kZS53aWR0aC9zcXJ0TnVtQXJlYSksYXJlYUhlaWdodD1NYXRoLmZsb29yKHFyY29kZS5oZWlnaHQvc3FydE51bUFyZWEpLGJpdG1hcD1uZXcgQXJyYXkocXJjb2RlLmhlaWdodCpxcmNvZGUud2lkdGgpLGF5PTA7c3FydE51bUFyZWE+YXk7YXkrKylmb3IodmFyIGF4PTA7c3FydE51bUFyZWE+YXg7YXgrKylmb3IodmFyIGR5PTA7YXJlYUhlaWdodD5keTtkeSsrKWZvcih2YXIgZHg9MDthcmVhV2lkdGg+ZHg7ZHgrKyliaXRtYXBbYXJlYVdpZHRoKmF4K2R4KyhhcmVhSGVpZ2h0KmF5K2R5KSpxcmNvZGUud2lkdGhdPWdyYXlTY2FsZVthcmVhV2lkdGgqYXgrZHgrKGFyZWFIZWlnaHQqYXkrZHkpKnFyY29kZS53aWR0aF08bWlkZGxlW2F4XVtheV0/ITA6ITE7XHJcbiAgICByZXR1cm4gYml0bWFwfSxxcmNvZGUuZ3JheXNjYWxlPWZ1bmN0aW9uKCl7Zm9yKHZhciByZXQ9bmV3IEFycmF5KHFyY29kZS53aWR0aCpxcmNvZGUuaGVpZ2h0KSx5PTA7eTxxcmNvZGUuaGVpZ2h0O3krKylmb3IodmFyIHg9MDt4PHFyY29kZS53aWR0aDt4Kyspe3ZhciBncmF5PXFyY29kZS5nZXRQaXhlbCh4LHkpO3JldFt4K3kqcXJjb2RlLndpZHRoXT1ncmF5fXJldHVybiByZXR9LEFycmF5LnByb3RvdHlwZS5yZW1vdmU9ZnVuY3Rpb24oZnJvbSx0byl7dmFyIHJlc3Q9dGhpcy5zbGljZSgodG98fGZyb20pKzF8fHRoaXMubGVuZ3RoKTtyZXR1cm4gdGhpcy5sZW5ndGg9MD5mcm9tP3RoaXMubGVuZ3RoK2Zyb206ZnJvbSx0aGlzLnB1c2guYXBwbHkodGhpcyxyZXN0KX07dmFyIE1JTl9TS0lQPTMsTUFYX01PRFVMRVM9NTcsSU5URUdFUl9NQVRIX1NISUZUPTgsQ0VOVEVSX1FVT1JVTT0yO3FyY29kZS5vcmRlckJlc3RQYXR0ZXJucz1mdW5jdGlvbihwYXR0ZXJucyl7ZnVuY3Rpb24gZGlzdGFuY2UocGF0dGVybjEscGF0dGVybjIpe3JldHVybiB4RGlmZj1wYXR0ZXJuMS5YLXBhdHRlcm4yLlgseURpZmY9cGF0dGVybjEuWS1wYXR0ZXJuMi5ZLE1hdGguc3FydCh4RGlmZip4RGlmZit5RGlmZip5RGlmZil9ZnVuY3Rpb24gY3Jvc3NQcm9kdWN0Wihwb2ludEEscG9pbnRCLHBvaW50Qyl7dmFyIGJYPXBvaW50Qi54LGJZPXBvaW50Qi55O3JldHVybihwb2ludEMueC1iWCkqKHBvaW50QS55LWJZKS0ocG9pbnRDLnktYlkpKihwb2ludEEueC1iWCl9dmFyIHBvaW50QSxwb2ludEIscG9pbnRDLHplcm9PbmVEaXN0YW5jZT1kaXN0YW5jZShwYXR0ZXJuc1swXSxwYXR0ZXJuc1sxXSksb25lVHdvRGlzdGFuY2U9ZGlzdGFuY2UocGF0dGVybnNbMV0scGF0dGVybnNbMl0pLHplcm9Ud29EaXN0YW5jZT1kaXN0YW5jZShwYXR0ZXJuc1swXSxwYXR0ZXJuc1syXSk7aWYob25lVHdvRGlzdGFuY2U+PXplcm9PbmVEaXN0YW5jZSYmb25lVHdvRGlzdGFuY2U+PXplcm9Ud29EaXN0YW5jZT8ocG9pbnRCPXBhdHRlcm5zWzBdLHBvaW50QT1wYXR0ZXJuc1sxXSxwb2ludEM9cGF0dGVybnNbMl0pOnplcm9Ud29EaXN0YW5jZT49b25lVHdvRGlzdGFuY2UmJnplcm9Ud29EaXN0YW5jZT49emVyb09uZURpc3RhbmNlPyhwb2ludEI9cGF0dGVybnNbMV0scG9pbnRBPXBhdHRlcm5zWzBdLHBvaW50Qz1wYXR0ZXJuc1syXSk6KHBvaW50Qj1wYXR0ZXJuc1syXSxwb2ludEE9cGF0dGVybnNbMF0scG9pbnRDPXBhdHRlcm5zWzFdKSxjcm9zc1Byb2R1Y3RaKHBvaW50QSxwb2ludEIscG9pbnRDKTwwKXt2YXIgdGVtcD1wb2ludEE7cG9pbnRBPXBvaW50Qyxwb2ludEM9dGVtcH1wYXR0ZXJuc1swXT1wb2ludEEscGF0dGVybnNbMV09cG9pbnRCLHBhdHRlcm5zWzJdPXBvaW50Q307IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmZhY3RvcnkoJ0F1dGhTZXJ2aWNlJywgW1xyXG4gICAgJyRodHRwJyxcclxuICAgICckcm9vdFNjb3BlJyxcclxuICAgICckc3RhdGUnLFxyXG4gICAgJyR3aW5kb3cnLFxyXG4gICAgJ1Nlc3Npb24nLFxyXG4gICAgZnVuY3Rpb24oJGh0dHAsICRyb290U2NvcGUsICRzdGF0ZSwgJHdpbmRvdywgU2Vzc2lvbikge1xyXG4gICAgICB2YXIgYXV0aFNlcnZpY2UgPSB7fTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGxvZ2luU3VjY2VzcyhkYXRhLCBjYiwgdm9sdW50ZWVyKXtcclxuICAgICAgICAvLyBXaW5uZXIgd2lubmVyIHlvdSBnZXQgYSB0b2tlblxyXG4gICAgICAgIGlmKCF2b2x1bnRlZXIpIHtTZXNzaW9uLmNyZWF0ZShkYXRhLnRva2VuLCBkYXRhLnVzZXIpO31cclxuXHJcbiAgICAgICAgaWYgKGNiKXtcclxuICAgICAgICAgIGNiKGRhdGEudXNlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBsb2dpbkZhaWx1cmUoZGF0YSwgY2IsIHZvbHVudGVlcil7XHJcbiAgICAgICAgaWYoIXZvbHVudGVlcikgeyRzdGF0ZS5nbygnaG9tZScpO31cclxuICAgICAgICBpZiAoY2IpIHtcclxuICAgICAgICAgIGNiKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgYXV0aFNlcnZpY2UubG9naW5XaXRoUGFzc3dvcmQgPSBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwXHJcbiAgICAgICAgICAucG9zdCgnL2F1dGgvbG9naW4nLCB7XHJcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBsb2dpblN1Y2Nlc3MocmVzcG9uc2UuZGF0YSwgb25TdWNjZXNzKTtcclxuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgbG9naW5GYWlsdXJlKHJlc3BvbnNlLmRhdGEsIG9uRmFpbHVyZSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGF1dGhTZXJ2aWNlLmxvZ2luV2l0aFRva2VuID0gZnVuY3Rpb24odG9rZW4sIG9uU3VjY2Vzcywgb25GYWlsdXJlKXtcclxuICAgICAgICByZXR1cm4gJGh0dHBcclxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9sb2dpbicsIHtcclxuICAgICAgICAgICAgdG9rZW46IHRva2VuXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBsb2dpblN1Y2Nlc3MocmVzcG9uc2UuZGF0YSwgb25TdWNjZXNzKTtcclxuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgU2Vzc2lvbi5kZXN0cm95KGxvZ2luRmFpbHVyZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgYXV0aFNlcnZpY2UubG9nb3V0ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgICAvLyBDbGVhciB0aGUgc2Vzc2lvblxyXG4gICAgICAgIFNlc3Npb24uZGVzdHJveShjYWxsYmFjayk7XHJcbiAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBhdXRoU2VydmljZS5yZWdpc3RlciA9IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZCwgb25TdWNjZXNzLCBvbkZhaWx1cmUgLHZvbHVudGVlcikge1xyXG4gICAgICAgIHJldHVybiAkaHR0cFxyXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL3JlZ2lzdGVyJywge1xyXG4gICAgICAgICAgICBlbWFpbDogZW1haWwsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcclxuICAgICAgICAgICAgdm9sdW50ZWVyOiB2b2x1bnRlZXIsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBsb2dpblN1Y2Nlc3MocmVzcG9uc2UuZGF0YSwgb25TdWNjZXNzLCB2b2x1bnRlZXIpO1xyXG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBsb2dpbkZhaWx1cmUocmVzcG9uc2UuZGF0YSwgb25GYWlsdXJlLCB2b2x1bnRlZXIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBhdXRoU2VydmljZS52ZXJpZnkgPSBmdW5jdGlvbih0b2tlbiwgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHBcclxuICAgICAgICAgIC5nZXQoJy9hdXRoL3ZlcmlmeS8nICsgdG9rZW4pXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIFNlc3Npb24uc2V0VXNlcihyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgaWYgKG9uU3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgIG9uU3VjY2VzcyhyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBpZiAob25GYWlsdXJlKSB7XHJcbiAgICAgICAgICAgICAgb25GYWlsdXJlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGF1dGhTZXJ2aWNlLnJlc2VuZFZlcmlmaWNhdGlvbkVtYWlsID0gZnVuY3Rpb24ob25TdWNjZXNzLCBvbkZhaWx1cmUpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cFxyXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL3ZlcmlmeS9yZXNlbmQnLCB7XHJcbiAgICAgICAgICAgIGlkOiBTZXNzaW9uLmdldFVzZXJJZCgpXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGF1dGhTZXJ2aWNlLnNlbmRSZXNldEVtYWlsID0gZnVuY3Rpb24oZW1haWwpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cFxyXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL3Jlc2V0Jywge1xyXG4gICAgICAgICAgICBlbWFpbDogZW1haWxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgYXV0aFNlcnZpY2UucmVzZXRQYXNzd29yZCA9IGZ1bmN0aW9uKHRva2VuLCBwYXNzLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwXHJcbiAgICAgICAgICAucG9zdCgnL2F1dGgvcmVzZXQvcGFzc3dvcmQnLCB7XHJcbiAgICAgICAgICAgIHRva2VuOiB0b2tlbixcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3NcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihvblN1Y2Nlc3MsIG9uRmFpbHVyZSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gYXV0aFNlcnZpY2U7XHJcbiAgICB9XHJcbiAgXSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKS5mYWN0b3J5KFwiQ2hhbGxlbmdlU2VydmljZVwiLCBbXHJcbiAgICBcIiRodHRwXCIsXHJcbiAgICBmdW5jdGlvbigkaHR0cCkge1xyXG4gICAgICB2YXIgY2hhbGxlbmdlcyA9IFwiL2FwaS9jaGFsbGVuZ2VzXCI7XHJcbiAgICAgIHZhciBiYXNlID0gY2hhbGxlbmdlcyArIFwiL1wiO1xyXG4gIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAvLyBCYXNpYyBBY3Rpb25zXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uKGNEYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGNoYWxsZW5nZXMgKyBcIi9jcmVhdGVcIiwge1xyXG4gICAgICAgICAgICAgIGNEYXRhOiBjRGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGlkLCBjRGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi91cGRhdGVcIiwge1xyXG4gICAgICAgICAgICAgIGNEYXRhOiBjRGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlbW92ZVwiKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIGlkKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIFxyXG4gICAgICAgIGdldEFsbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0QW5zd2VyOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQgKyBcIi9hbnN3ZXJcIik7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgXSk7XHJcbiAgIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpLmZhY3RvcnkoXCJNYXJrZXRpbmdTZXJ2aWNlXCIsIFtcclxuICAgIFwiJGh0dHBcIixcclxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XHJcbiAgICAgIHZhciBtYXJrZXRpbmcgPSBcIi9hcGkvbWFya2V0aW5nXCI7XHJcbiAgICAgIHZhciBiYXNlID0gbWFya2V0aW5nICsgXCIvXCI7XHJcbiAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vIEJhc2ljIEFjdGlvbnNcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgIGNyZWF0ZVRlYW06IGZ1bmN0aW9uKHRlYW1EYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KG1hcmtldGluZyArIFwiL2NyZWF0ZVRlYW1cIiwge1xyXG4gICAgICAgICAgICAgIHRlYW1EYXRhOiB0ZWFtRGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0QWxsOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZW5kRnJpZW5kSW52aXRlOiBmdW5jdGlvbih1c2VybmFtZSx0ZWFtbWF0ZSl7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChtYXJrZXRpbmcgKyBcIi9zZW5kSW52aXRlXCIsIHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxyXG4gICAgICAgICAgICB0ZWFtbWF0ZTogdGVhbW1hdGVcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgfTtcclxuICAgIH1cclxuICBdKTtcclxuICAiLCJhbmd1bGFyLm1vZHVsZSgncmVnJykgXHJcbiAgLmZhY3RvcnkoJ1NldHRpbmdzU2VydmljZScsIFtcclxuICAnJGh0dHAnLFxyXG4gIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcbiAgICB2YXIgYmFzZSA9ICcvYXBpL3NldHRpbmdzLyc7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZ2V0UHVibGljU2V0dGluZ3M6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlKTtcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlUmVnaXN0cmF0aW9uVGltZXM6IGZ1bmN0aW9uKG9wZW4sIGNsb3NlKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAndGltZXMnLCB7XHJcbiAgICAgICAgICB0aW1lT3Blbjogb3BlbixcclxuICAgICAgICAgIHRpbWVDbG9zZTogY2xvc2UsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZUNvbmZpcm1hdGlvblRpbWU6IGZ1bmN0aW9uKHRpbWUpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICdjb25maXJtLWJ5Jywge1xyXG4gICAgICAgICAgdGltZTogdGltZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICB1cGRhdGVTdGFydFRpbWU6IGZ1bmN0aW9uKHRpbWUpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICd0aW1lU3RhcnQnLCB7XHJcbiAgICAgICAgICB0aW1lOiB0aW1lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGdldFdoaXRlbGlzdGVkRW1haWxzOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArICd3aGl0ZWxpc3QnKTtcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlV2hpdGVsaXN0ZWRFbWFpbHM6IGZ1bmN0aW9uKGVtYWlscyl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ3doaXRlbGlzdCcsIHtcclxuICAgICAgICAgIGVtYWlsczogZW1haWxzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZVdhaXRsaXN0VGV4dDogZnVuY3Rpb24odGV4dCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ3dhaXRsaXN0Jywge1xyXG4gICAgICAgICAgdGV4dDogdGV4dFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICB1cGRhdGVBY2NlcHRhbmNlVGV4dDogZnVuY3Rpb24odGV4dCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2FjY2VwdGFuY2UnLCB7XHJcbiAgICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB1cGRhdGVIb3N0U2Nob29sOiBmdW5jdGlvbihob3N0U2Nob29sKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnaG9zdFNjaG9vbCcsIHtcclxuICAgICAgICAgIGhvc3RTY2hvb2w6IGhvc3RTY2hvb2xcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHVwZGF0ZUNvbmZpcm1hdGlvblRleHQ6IGZ1bmN0aW9uKHRleHQpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICdjb25maXJtYXRpb24nLCB7XHJcbiAgICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZUFsbG93TWlub3JzOiBmdW5jdGlvbihhbGxvd01pbm9ycyl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ21pbm9ycycsIHsgXHJcbiAgICAgICAgICBhbGxvd01pbm9yczogYWxsb3dNaW5vcnMgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG5cclxuICB9XHJcbiAgXSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKS5mYWN0b3J5KFwiU29sdmVkQ1RGU2VydmljZVwiLCBbXHJcbiAgICBcIiRodHRwXCIsXHJcbiAgICBmdW5jdGlvbigkaHR0cCkge1xyXG4gICAgICB2YXIgQ1RGID0gXCIvYXBpL0NURlwiO1xyXG4gICAgICB2YXIgYmFzZSA9IENURiArIFwiL1wiO1xyXG4gIFxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8gQmFzaWMgQWN0aW9uc1xyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgc29sdmU6IGZ1bmN0aW9uKGNoYWxsZW5nZSwgdXNlciwgYW5zd2VyLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChDVEYgKyBcIi9zb2x2ZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBjaGFsbGVuZ2U6IGNoYWxsZW5nZSwgXHJcbiAgICAgICAgICAgICAgICB1c2VyIDogdXNlcixcclxuICAgICAgICAgICAgICAgIGFuc3dlciA6IGFuc3dlcixcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgIG9uU3VjY2VzcyhjaGFsbGVuZ2UpO1xyXG4gICAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgb25GYWlsdXJlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0QWxsOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChDVEYpO1xyXG4gICAgICAgIH0sXHJcbiAgICBcclxuICAgICAgfTtcclxuICAgIH1cclxuICBdKTtcclxuICAiLCJhbmd1bGFyLm1vZHVsZSgncmVnJykuZmFjdG9yeShcIlRlYW1TZXJ2aWNlXCIsIFtcclxuICAgIFwiJGh0dHBcIixcclxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XHJcbiAgICAgIHZhciB0ZWFtcyA9IFwiL2FwaS90ZWFtc1wiO1xyXG4gICAgICB2YXIgYmFzZSA9IHRlYW1zICsgXCIvXCI7XHJcbiAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vIEJhc2ljIEFjdGlvbnNcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24odGVhbURhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QodGVhbXMgKyBcIi9jcmVhdGVcIiwge1xyXG4gICAgICAgICAgICAgIHRlYW1EYXRhOiB0ZWFtRGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGlkLCBjRGF0YSkge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdXBkYXRlXCIsIHtcclxuICAgICAgICAgICAgY0RhdGE6IGNEYXRhXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBqb2luOiBmdW5jdGlvbihpZCwgbmV3dXNlcikge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpXHJcbiAgICAgICAgICAudGhlbih0ZWFtID0+IHtcclxuICAgICAgICAgICAgdGVhbS5kYXRhLmpvaW5SZXF1ZXN0cy5wdXNoKG5ld3VzZXIpXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3VwZGF0ZWpvaW5lZFwiLCB7XHJcbiAgICAgICAgICAgICAgbmV3am9pblJlcXVlc3RzOiB0ZWFtLmRhdGEuam9pblJlcXVlc3RzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICByZW1vdmVqb2luOiBmdW5jdGlvbihpZCwgaW5kZXgsIHVzZXIpIHtcclxuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIGlkKVxyXG4gICAgICAgICAgLnRoZW4odGVhbSA9PiB7XHJcbiAgICAgICAgICAgIHRlYW0uZGF0YS5qb2luUmVxdWVzdHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgaWYgKCEodXNlcj09ZmFsc2UpKXtcclxuICAgICAgICAgICAgICAkaHR0cC5wb3N0KHRlYW1zICsgXCIvc2VuZFJlZnVzZWRUZWFtXCIsIHtcclxuICAgICAgICAgICAgICAgIGlkOiB1c2VyLmlkLFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3VwZGF0ZWpvaW5lZFwiLCB7XHJcbiAgICAgICAgICAgICAgbmV3am9pblJlcXVlc3RzOiB0ZWFtLmRhdGEuam9pblJlcXVlc3RzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBhY2NlcHRNZW1iZXI6IGZ1bmN0aW9uKGlkLCBuZXd1c2VyLG1heFRlYW1TaXplKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZClcclxuICAgICAgICAgIC50aGVuKHRlYW0gPT4ge1xyXG4gICAgICAgICAgICBpZiAodGVhbS5kYXRhLm1lbWJlcnMubGVuZ3RoPj1tYXhUZWFtU2l6ZSl7IHJldHVybiAnbWF4VGVhbVNpemUnIH1cclxuXHJcbiAgICAgICAgICAgIHRlYW0uZGF0YS5tZW1iZXJzLnB1c2gobmV3dXNlcilcclxuICAgICAgICAgICAgJGh0dHAucG9zdCh0ZWFtcyArIFwiL3NlbmRBY2NlcHRlZFRlYW1cIiwge1xyXG4gICAgICAgICAgICAgIGlkOiBuZXd1c2VyLmlkLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdXBkYXRlTWVtYmVyc1wiLCB7XHJcbiAgICAgICAgICAgICAgbmV3TWVtYmVyczogdGVhbS5kYXRhLm1lbWJlcnMsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICByZW1vdmVtZW1iZXI6IGZ1bmN0aW9uKGlkLCBpbmRleCwgdXNlcklEKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZClcclxuICAgICAgICAgIC50aGVuKHRlYW0gPT4ge1xyXG4gICAgICAgICAgICB2YXIgcmVtb3ZlZFVzZXIgPSB0ZWFtLmRhdGEubWVtYmVyc1tpbmRleF1cclxuICAgICAgICAgICAgaWYgKGluZGV4PT0wKXtyZXR1cm4gXCJyZW1vdmluZ0FkbWluXCJ9XHJcbiAgICAgICAgICAgIHRlYW0uZGF0YS5tZW1iZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGlmICghdXNlcklEKXtcclxuICAgICAgICAgICAgICAkaHR0cC5wb3N0KHRlYW1zICsgXCIvc2VuZEFkbWluUmVtb3ZlZFRlYW1cIiwge1xyXG4gICAgICAgICAgICAgICAgaWQ6IHRlYW0uZGF0YS5tZW1iZXJzWzBdLmlkLFxyXG4gICAgICAgICAgICAgICAgbWVtYmVyOiByZW1vdmVkVXNlci5uYW1lXHJcbiAgICAgICAgICAgICAgfSk7ICBcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgJGh0dHAucG9zdCh0ZWFtcyArIFwiL3NlbmRSZW1vdmVkVGVhbVwiLCB7XHJcbiAgICAgICAgICAgICAgICBpZDogdXNlcklELFxyXG4gICAgICAgICAgICAgIH0pOyAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdXBkYXRlTWVtYmVyc1wiLCB7XHJcbiAgICAgICAgICAgICAgbmV3TWVtYmVyczogdGVhbS5kYXRhLm1lbWJlcnMsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZW1vdmVcIik7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXHJcbiAgICAgICAgdG9nZ2xlQ2xvc2VUZWFtOiBmdW5jdGlvbihpZCwgc3RhdHVzKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi90b2dnbGVDbG9zZVRlYW1cIiwge1xyXG4gICAgICAgICAgICBzdGF0dXM6IHN0YXR1c1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgdG9nZ2xlSGlkZVRlYW06IGZ1bmN0aW9uKGlkLCBzdGF0dXMpIHtcclxuICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3RvZ2dsZUhpZGVUZWFtXCIsIHtcclxuICAgICAgICAgICAgc3RhdHVzOiBzdGF0dXNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldFNlbGVjdGVkVGVhbXM6IGZ1bmN0aW9uKHRleHQsc2tpbGxzRmlsdGVycykge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCggdGVhbXMgKyBcIj9cIiArICQucGFyYW0oe1xyXG4gICAgICAgICAgICAgICAgdGV4dDogdGV4dCxcclxuICAgICAgICAgICAgICAgIHNlYXJjaDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNraWxsc0ZpbHRlcnM6IHNraWxsc0ZpbHRlcnMgPyBza2lsbHNGaWx0ZXJzIDoge31cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9LCBcclxuICBcclxuXHJcblxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIF0pO1xyXG4gICIsImFuZ3VsYXIubW9kdWxlKFwicmVnXCIpLmZhY3RvcnkoXCJVc2VyU2VydmljZVwiLCBbXHJcbiAgXCIkaHR0cFwiLFxyXG4gIFwiU2Vzc2lvblwiLFxyXG4gIGZ1bmN0aW9uKCRodHRwLCBTZXNzaW9uKSB7XHJcbiAgICB2YXIgdXNlcnMgPSBcIi9hcGkvdXNlcnNcIjtcclxuICAgIHZhciBiYXNlID0gdXNlcnMgKyBcIi9cIjtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIC8vIEJhc2ljIEFjdGlvbnNcclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICBnZXRDdXJyZW50VXNlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgU2Vzc2lvbi5nZXRVc2VySWQoKSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0QWxsOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0UGFnZTogZnVuY3Rpb24ocGFnZSwgc2l6ZSwgdGV4dCxzdGF0dXNGaWx0ZXJzKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCggdXNlcnMgKyBcIj9cIiArICQucGFyYW0oe1xyXG4gICAgICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgICAgcGFnZTogcGFnZSA/IHBhZ2UgOiAwLFxyXG4gICAgICAgICAgICAgIHNpemU6IHNpemUgPyBzaXplIDogMjAsXHJcbiAgICAgICAgICAgICAgc3RhdHVzRmlsdGVyczogc3RhdHVzRmlsdGVycyA/IHN0YXR1c0ZpbHRlcnMgOiB7fVxyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgdXBkYXRlUHJvZmlsZTogZnVuY3Rpb24oaWQsIHByb2ZpbGUpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyBpZCArIFwiL3Byb2ZpbGVcIiwge1xyXG4gICAgICAgICAgcHJvZmlsZTogcHJvZmlsZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgdXBkYXRlQ29uZmlybWF0aW9uOiBmdW5jdGlvbihpZCwgY29uZmlybWF0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgaWQgKyBcIi9jb25maXJtXCIsIHtcclxuICAgICAgICAgIGNvbmZpcm1hdGlvbjogY29uZmlybWF0aW9uXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB1cGRhdGVBbGw6IGZ1bmN0aW9uKGlkLCB1c2VyKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgaWQgKyBcIi91cGRhdGVhbGxcIiwge1xyXG4gICAgICAgICAgdXNlcjogdXNlclxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZGVjbGluZUFkbWlzc2lvbjogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9kZWNsaW5lXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAvLyBBZG1pbiBPbmx5XHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgIGdldFN0YXRzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBcInN0YXRzXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0VGVhbVN0YXRzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBcInRlYW1TdGF0c1wiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkbWl0VXNlcjogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9hZG1pdFwiKTtcclxuICAgICAgfSxcclxuICAgICAgcmVqZWN0VXNlcjogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZWplY3RcIik7XHJcbiAgICAgIH0sXHJcbiAgICAgIHNvZnRBZG1pdHRVc2VyOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3NvZnRBZG1pdFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNvZnRSZWplY3RVc2VyOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3NvZnRSZWplY3RcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzZW5kQmFzaWNNYWlsOiBmdW5jdGlvbihpZCAsIGVtYWlsKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvc2VuZEJhc2ljTWFpbFwiLEpTT04uc3RyaW5naWZ5KGVtYWlsKSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjaGVja0luOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL2NoZWNraW5cIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjaGVja091dDogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9jaGVja291dFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlbW92ZVVzZXI6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvcmVtb3ZldXNlclwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1ha2VBZG1pbjogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9tYWtlYWRtaW5cIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZW1vdmVBZG1pbjogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZW1vdmVhZG1pblwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1hc3NSZWplY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcIm1hc3NSZWplY3RcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRSZWplY3Rpb25Db3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgXCJyZWplY3Rpb25Db3VudFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldExhdGVyUmVqZWN0ZWRDb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgXCJsYXRlclJlamVjdENvdW50XCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgbWFzc1JlamVjdFJlc3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcIm1hc3NSZWplY3RSZXN0XCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0UmVzdFJlamVjdGlvbkNvdW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBcInJlamVjdGlvbkNvdW50UmVzdFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlamVjdDogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZWplY3RcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzZW5kTGFnZ2VyRW1haWxzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgXCJzZW5kbGFnZW1haWxzXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2VuZFJlamVjdEVtYWlsczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIFwic2VuZFJlamVjdEVtYWlsc1wiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNlbmRSZWplY3RFbWFpbHNSZXN0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgXCJzZW5kUmVqZWN0RW1haWxzUmVzdFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNlbmRSZWplY3RFbWFpbDogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZWplY3RFbWFpbFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNlbmRQYXNzd29yZFJlc2V0RW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIFwic2VuZFJlc2V0RW1haWxcIiwgeyBlbWFpbDogZW1haWwgfSk7XHJcbiAgICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICB9O1xyXG4gIH1cclxuXSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdhZG1pbkNoYWxsZW5nZUN0cmwnLFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRodHRwJyxcclxuICAgICdjaGFsbGVuZ2UnLFxyXG4gICAgJ0NoYWxsZW5nZVNlcnZpY2UnLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgY2hhbGxlbmdlLCBDaGFsbGVuZ2VTZXJ2aWNlKXtcclxuICAgICAgJHNjb3BlLnNlbGVjdGVkY2hhbGxlbmdlID0gY2hhbGxlbmdlLmRhdGE7XHJcbiAgICAgIFxyXG4gICAgICBDaGFsbGVuZ2VTZXJ2aWNlLmdldEFuc3dlcihjaGFsbGVuZ2UuZGF0YS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICRzY29wZS5zZWxlY3RlZGNoYWxsZW5nZS5hbnN3ZXIgPSByZXNwb25zZS5kYXRhLmFuc3dlcjtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkc2NvcGUudG9nZ2xlUGFzc3dvcmQgPSBmdW5jdGlvbiAoKSB7ICRzY29wZS50eXBlUGFzc3dvcmQgPSAhJHNjb3BlLnR5cGVQYXNzd29yZDsgfTtcclxuXHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlQ2hhbGxlbmdlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBDaGFsbGVuZ2VTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlKCRzY29wZS5zZWxlY3RlZGNoYWxsZW5nZS5faWQsICRzY29wZS5zZWxlY3RlZGNoYWxsZW5nZSlcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNlbGVjdGVkY2hhbGxlbmdlID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcIlVwZGF0ZWQhXCIsIFwiQ2hhbGxlbmdlIHVwZGF0ZWQuXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIk9vcHMsIHlvdSBmb3Jnb3Qgc29tZXRoaW5nLlwiKTtcclxuICAgICAgICAgIH0pOyAgXHJcbiAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZShcInJlZ1wiKS5jb250cm9sbGVyKFwiYWRtaW5DaGFsbGVuZ2VzQ3RybFwiLCBbXHJcbiAgXCIkc2NvcGVcIixcclxuICBcIiRzdGF0ZVwiLFxyXG4gIFwiJHN0YXRlUGFyYW1zXCIsXHJcbiAgXCJDaGFsbGVuZ2VTZXJ2aWNlXCIsXHJcbiAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgQ2hhbGxlbmdlU2VydmljZSkge1xyXG5cclxuICAgICRzY29wZS5jaGFsbGVuZ2VzID0gW107XHJcblxyXG4gICAgLy8gU2VtYW50aWMtVUkgbW92ZXMgbW9kYWwgY29udGVudCBpbnRvIGEgZGltbWVyIGF0IHRoZSB0b3AgbGV2ZWwuXHJcbiAgICAvLyBXaGlsZSB0aGlzIGlzIHVzdWFsbHkgbmljZSwgaXQgbWVhbnMgdGhhdCB3aXRoIG91ciByb3V0aW5nIHdpbGwgZ2VuZXJhdGVcclxuICAgIC8vIG11bHRpcGxlIG1vZGFscyBpZiB5b3UgY2hhbmdlIHN0YXRlLiBLaWxsIHRoZSB0b3AgbGV2ZWwgZGltbWVyIG5vZGUgb24gaW5pdGlhbCBsb2FkXHJcbiAgICAvLyB0byBwcmV2ZW50IHRoaXMuXHJcbiAgICAkKFwiLnVpLmRpbW1lclwiKS5yZW1vdmUoKTtcclxuICAgIC8vIFBvcHVsYXRlIHRoZSBzaXplIG9mIHRoZSBtb2RhbCBmb3Igd2hlbiBpdCBhcHBlYXJzLCB3aXRoIGFuIGFyYml0cmFyeSBDaGFsbGVuZ2UuXHJcblxyXG4gICAgZnVuY3Rpb24gcmVmcmVzaFBhZ2UoKSB7XHJcbiAgICAgIENoYWxsZW5nZVNlcnZpY2UuZ2V0QWxsKCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgJHNjb3BlLmNoYWxsZW5nZXMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZWZyZXNoUGFnZSgpO1xyXG5cclxuICAgICRzY29wZS5nb0NoYWxsZW5nZSA9IGZ1bmN0aW9uKCRldmVudCwgY2hhbGxlbmdlKSB7XHJcblxyXG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICRzdGF0ZS5nbyhcImFwcC5hZG1pbi5jaGFsbGVuZ2VcIiwge1xyXG4gICAgICAgIGlkOiBjaGFsbGVuZ2UuX2lkXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5jcmVhdGVDaGFsbGVuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgIHN3YWwoXCJXcml0ZSB0aGUgY2hhbGxlbmdlIHRpdGxlOlwiLCB7XHJcbiAgICAgICAgYnV0dG9uczoge2NhbmNlbDoge3RleHQ6IFwiQ2FuY2VsXCIsdmFsdWU6IG51bGwsdmlzaWJsZTogdHJ1ZX0sIHllczoge3RleHQ6IFwiTmV4dCBpbnB1dFwiLHZhbHVlOiB0cnVlLHZpc2libGU6IHRydWV9IH0sXHJcbiAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcIkdpdmUgdGhpcyBjaGFsbGVuZ2UgYSBzZXh5IG5hbWUuLlwiLHR5cGU6IFwidGV4dFwifSB9LFxyXG4gICAgICB9KVxyXG4gICAgICAudGhlbigodGl0bGUpID0+IHsgaWYgKCF0aXRsZSkge3JldHVybjt9XHJcbiAgICAgICAgc3dhbChcIkVudGVyIHRoZSBjaGFsbGVuZ2UgZGVzY3JpcHRpb246XCIsIHtcclxuICAgICAgICAgIGJ1dHRvbnM6IHtjYW5jZWw6IHt0ZXh0OiBcIkNhbmNlbFwiLHZhbHVlOiBudWxsLHZpc2libGU6IHRydWV9LCB5ZXM6IHt0ZXh0OiBcIk5leHQgaW5wdXRcIix2YWx1ZTogdHJ1ZSx2aXNpYmxlOiB0cnVlfSB9LFxyXG4gICAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcIkRlc2NyaWJlIHRoaXMgY2hhbGxlbmdlIHNvIHRoYXQgcGVvcGxlIGNhbiBnZXQgdGhlIGlkZWEuLlwiLHR5cGU6IFwidGV4dFwifSB9LFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoZGVzY3JpcHRpb24pID0+IHsgaWYgKCFkZXNjcmlwdGlvbikge3JldHVybjt9XHJcbiAgICAgICAgICBzd2FsKFwiRW50ZXIgdGhlIGNoYWxsZW5nZSBkZXBlbmRlbmN5IChMSU5LKTpcIiwge1xyXG4gICAgICAgICAgICBidXR0b25zOiB7Y2FuY2VsOiB7dGV4dDogXCJDYW5jZWxcIix2YWx1ZTogbnVsbCx2aXNpYmxlOiB0cnVlfSwgeWVzOiB7dGV4dDogXCJOZXh0IGlucHV0XCIsdmFsdWU6IHRydWUsdmlzaWJsZTogdHJ1ZX0gfSxcclxuICAgICAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vQ2hhbGxlbmdlNDIuemlwXCIsdHlwZTogXCJ0ZXh0XCJ9IH0sXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbigoZGVwZW5kZW5jeSkgPT4geyBpZiAoIWRlcGVuZGVuY3kpIHtyZXR1cm47fVxyXG4gICAgICAgICAgICBzd2FsKFwiRW50ZXIgdGhlIGFuc3dlcjpcIiwge1xyXG4gICAgICAgICAgICAgIGJ1dHRvbnM6IHtjYW5jZWw6IHt0ZXh0OiBcIkNhbmNlbFwiLHZhbHVlOiBudWxsLHZpc2libGU6IHRydWV9LCB5ZXM6IHt0ZXh0OiBcIk5leHQgaW5wdXRcIix2YWx1ZTogdHJ1ZSx2aXNpYmxlOiB0cnVlfSB9LFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6IHtlbGVtZW50OiBcImlucHV0XCIsIGF0dHJpYnV0ZXM6IHtwbGFjZWhvbGRlcjogXCJzaGhoaCB0aGlzIHNpIHN1cGVyIHNlY3JldCBicm9cIix0eXBlOiBcInRleHRcIn0gfSxcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbigoYW5zd2VyKSA9PiB7IGlmICghYW5zd2VyKSB7cmV0dXJuO31cclxuICAgICAgICAgICAgICBzd2FsKFwiRW50ZXIgdGhlIG51bWJlciBvZiBwb2ludHMgZm9yIHRoaXMgY2hhbGxlbmdlOlwiLCB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7Y2FuY2VsOiB7dGV4dDogXCJDYW5jZWxcIix2YWx1ZTogbnVsbCx2aXNpYmxlOiB0cnVlfSwgeWVzOiB7dGV4dDogXCJOZXh0IGlucHV0XCIsdmFsdWU6IHRydWUsdmlzaWJsZTogdHJ1ZX0gfSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHtlbGVtZW50OiBcImlucHV0XCIsIGF0dHJpYnV0ZXM6IHtwbGFjZWhvbGRlcjogXCJQb2ludHMgYXdhcmRlZCB0byBjaGFsbGVuZ2Ugc29sdmVyc1wiLHR5cGU6IFwibnVtYmVyXCJ9IH0sXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIC50aGVuKChwb2ludHMpID0+IHsgaWYgKCFwb2ludHMpIHtyZXR1cm47fVxyXG4gIFxyXG4gICAgICAgICAgICAgICAgY0RhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlOnRpdGxlLFxyXG4gICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjpkZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jeTpkZXBlbmRlbmN5LFxyXG4gICAgICAgICAgICAgICAgICBhbnN3ZXI6YW5zd2VyLFxyXG4gICAgICAgICAgICAgICAgICBwb2ludHM6cG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQ2hhbGxlbmdlU2VydmljZS5jcmVhdGUoY0RhdGEpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZWZyZXNoUGFnZSgpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5yZW1vdmVDaGFsbGVuZ2UgPSBmdW5jdGlvbigkZXZlbnQsIGNoYWxsZW5nZSwgaW5kZXgpIHtcclxuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBzd2FsKHtcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhY2NlcHQ6IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgdGhlbVwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVtb3ZlIFwiICsgY2hhbGxlbmdlLnRpdGxlICsgXCIhXCIsXHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIlxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHllczoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSB0aGlzIGNoYWxsZW5nZVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRhbmdlck1vZGU6IHRydWUsXHJcbiAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIlJlbWVtYmVyLCB0aGlzIHBvd2VyIGlzIGEgcHJpdmlsZWdlLlwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCJcclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIENoYWxsZW5nZVNlcnZpY2UucmVtb3ZlKGNoYWxsZW5nZS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUuY2hhbGxlbmdlc1tpbmRleF0gPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxyXG4gICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEudGl0bGUgKyBcIiBoYXMgYmVlbiByZW1vdmVkLlwiLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJlZnJlc2hQYWdlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgfVxyXG5dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoXCJyZWdcIikuY29udHJvbGxlcihcIkFkbWluTWFpbEN0cmxcIiwgW1xyXG4gIFwiJHNjb3BlXCIsXHJcbiAgXCIkc3RhdGVcIixcclxuICBcIiRzdGF0ZVBhcmFtc1wiLFxyXG4gIFwiVXNlclNlcnZpY2VcIixcclxuICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBVc2VyU2VydmljZSkge1xyXG4gICAgJHNjb3BlLnBhZ2VzID0gW107XHJcbiAgICAkc2NvcGUudXNlcnMgPSBbXTtcclxuXHJcbiAgICAvLyBTZW1hbnRpYy1VSSBtb3ZlcyBtb2RhbCBjb250ZW50IGludG8gYSBkaW1tZXIgYXQgdGhlIHRvcCBsZXZlbC5cclxuICAgIC8vIFdoaWxlIHRoaXMgaXMgdXN1YWxseSBuaWNlLCBpdCBtZWFucyB0aGF0IHdpdGggb3VyIHJvdXRpbmcgd2lsbCBnZW5lcmF0ZVxyXG4gICAgLy8gbXVsdGlwbGUgbW9kYWxzIGlmIHlvdSBjaGFuZ2Ugc3RhdGUuIEtpbGwgdGhlIHRvcCBsZXZlbCBkaW1tZXIgbm9kZSBvbiBpbml0aWFsIGxvYWRcclxuICAgIC8vIHRvIHByZXZlbnQgdGhpcy5cclxuICAgICQoXCIudWkuZGltbWVyXCIpLnJlbW92ZSgpO1xyXG4gICAgLy8gUG9wdWxhdGUgdGhlIHNpemUgb2YgdGhlIG1vZGFsIGZvciB3aGVuIGl0IGFwcGVhcnMsIHdpdGggYW4gYXJiaXRyYXJ5IHVzZXIuXHJcblxyXG5cclxuXHJcbiAgICBVc2VyU2VydmljZS5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHN0YXRlUGFyYW1zLnF1ZXJ5LCAkc2NvcGUuc3RhdHVzRmlsdGVycylcclxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgJHNjb3BlLnVzZXJzPSByZXNwb25zZS5kYXRhLnVzZXJzO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJHNjb3BlLnNlbmRFbWFpbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZmlsdGVyZWRVc2VycyA9ICRzY29wZS51c2Vycy5maWx0ZXIoXHJcbiAgICAgICAgdSA9PiB1LnZlcmlmaWVkXHJcbiAgICApO1xyXG5cclxuICAgICAgaWYgKCRzY29wZS5zdGF0dXNGaWx0ZXJzLmNvbXBsZXRlZFByb2ZpbGUpIHtcclxuICAgICAgICBmaWx0ZXJlZFVzZXJzID0gZmlsdGVyZWRVc2Vycy5maWx0ZXIoXHJcbiAgICAgICAgICB1ID0+IHUuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGVcclxuICAgICAgKX1cclxuXHJcbiAgICAgIGlmICgkc2NvcGUuc3RhdHVzRmlsdGVycy5hZG1pdHRlZCkge1xyXG4gICAgICAgIGZpbHRlcmVkVXNlcnMgPSBmaWx0ZXJlZFVzZXJzLmZpbHRlcihcclxuICAgICAgICAgIHUgPT4gdS5zdGF0dXMuYWRtaXR0ZWRcclxuICAgICAgKX1cclxuXHJcbiAgICAgIGlmICgkc2NvcGUuc3RhdHVzRmlsdGVycy5jb25maXJtZWQpIHtcclxuICAgICAgICBmaWx0ZXJlZFVzZXJzID0gZmlsdGVyZWRVc2Vycy5maWx0ZXIoXHJcbiAgICAgICAgICB1ID0+IHUuc3RhdHVzLmNvbmZpcm1lZFxyXG4gICAgICApfVxyXG5cclxuICAgICAgaWYgKCRzY29wZS5zdGF0dXNGaWx0ZXJzLmRlY2xpbmVkKSB7XHJcbiAgICAgICAgZmlsdGVyZWRVc2VycyA9IGZpbHRlcmVkVXNlcnMuZmlsdGVyKFxyXG4gICAgICAgICAgdSA9PiB1LnN0YXR1cy5kZWNsaW5lZFxyXG4gICAgICApfVxyXG5cclxuICAgICAgaWYgKCRzY29wZS5zdGF0dXNGaWx0ZXJzLmNoZWNrZWRJbikge1xyXG4gICAgICAgIGZpbHRlcmVkVXNlcnMgPSBmaWx0ZXJlZFVzZXJzLmZpbHRlcihcclxuICAgICAgICAgIHUgPT4gdS5zdGF0dXMuY2hlY2tlZEluXHJcbiAgICAgICl9XHJcblxyXG4gICAgICB2YXIgbWVzc2FnZSA9ICQodGhpcykuZGF0YShcImNvbmZpcm1cIik7XHJcblxyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgIHRleHQ6IGBZb3UncmUgYWJvdXQgdG8gc2VuZCB0aGlzIGVtYWlsIHRvICR7XHJcbiAgICAgICAgICBmaWx0ZXJlZFVzZXJzLmxlbmd0aFxyXG4gICAgICAgIH0gc2VsZWN0ZWQgdXNlcihzKS5gLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIGJ1dHRvbnM6IFtcIkNhbmNlbFwiLCBcIlllcywgc2VuZCB0aGUgZW1haWxzXCJdLFxyXG4gICAgICAgIGRhbmdlck1vZGU6IHRydWVcclxuICAgICAgfSkudGhlbih3aWxsU2VuZCA9PiB7XHJcbiAgICAgICAgZW1haWwgPSB7IHN1YmplY3Q6JHNjb3BlLnN1YmplY3QgLCB0aXRsZTokc2NvcGUudGl0bGUsIGJvZHk6JHNjb3BlLmJvZHkgfVxyXG5cclxuICAgICAgICBpZiAod2lsbFNlbmQpIHtcclxuICAgICAgICAgIGlmIChmaWx0ZXJlZFVzZXJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBmaWx0ZXJlZFVzZXJzLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgICAgICAgVXNlclNlcnZpY2Uuc2VuZEJhc2ljTWFpbCh1c2VyLmlkLGVtYWlsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJTZW5kaW5nIVwiLFxyXG4gICAgICAgICAgICAgIGBTZW5kaW5nIGVtYWlscyB0byAke1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyZWRVc2Vycy5sZW5ndGhcclxuICAgICAgICAgICAgICB9IHVzZXJzIWAsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJXaG9vcHNcIiwgXCJZb3UgY2FuJ3Qgc2VuZCBvciBhY2NlcHQgMCB1c2VycyFcIiwgXCJlcnJvclwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgfVxyXG5dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoXCJyZWdcIikuY29udHJvbGxlcihcImFkbWluTWFya2V0aW5nQ3RybFwiLCBbXHJcbiAgXCIkc2NvcGVcIixcclxuICBcIiRzdGF0ZVwiLFxyXG4gIFwiJHN0YXRlUGFyYW1zXCIsXHJcbiAgXCJNYXJrZXRpbmdTZXJ2aWNlXCIsXHJcbiAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgTWFya2V0aW5nU2VydmljZSkge1xyXG5cclxuICAgIC8vIFNlbWFudGljLVVJIG1vdmVzIG1vZGFsIGNvbnRlbnQgaW50byBhIGRpbW1lciBhdCB0aGUgdG9wIGxldmVsLlxyXG4gICAgLy8gV2hpbGUgdGhpcyBpcyB1c3VhbGx5IG5pY2UsIGl0IG1lYW5zIHRoYXQgd2l0aCBvdXIgcm91dGluZyB3aWxsIGdlbmVyYXRlXHJcbiAgICAvLyBtdWx0aXBsZSBtb2RhbHMgaWYgeW91IGNoYW5nZSBzdGF0ZS4gS2lsbCB0aGUgdG9wIGxldmVsIGRpbW1lciBub2RlIG9uIGluaXRpYWwgbG9hZFxyXG4gICAgLy8gdG8gcHJldmVudCB0aGlzLlxyXG4gICAgJChcIi51aS5kaW1tZXJcIikucmVtb3ZlKCk7XHJcbiAgICAvLyBQb3B1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgbW9kYWwgZm9yIHdoZW4gaXQgYXBwZWFycywgd2l0aCBhbiBhcmJpdHJhcnkgdXNlci5cclxuXHJcblxyXG5cclxuXHJcbiAgICAkc2NvcGUuY3JlYXRlVGVhbXMgPSBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgaWYgKCRzY29wZS5ib2R5ICYmICRzY29wZS5ldmVudCl7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogYFlvdSdyZSBhYm91dCB0byBhZGQgdGhlc2UgdGVhbXMgZW1haWxzIHRvIHRoZSBtYXJrZXRpbmcgZGF0YWJhc2VgLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiBbXCJDYW5jZWxcIiwgXCJZZXMsIEFkZCB0ZWFtc1wiXSxcclxuICAgICAgICAgIGRhbmdlck1vZGU6IHRydWVcclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YXIgdGVhbXMgPSAkc2NvcGUuYm9keS5zcGxpdCgnOycpO1xyXG4gICAgICAgICAgICB0ZWFtcy5mb3JFYWNoKHRlYW0gPT4ge1xyXG4gICAgICAgICAgICAgIHRlYW1EYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQ6JHNjb3BlLmV2ZW50LFxyXG4gICAgICAgICAgICAgICAgbWVtYmVyczp0ZWFtLnJlcGxhY2UoJyAnLCcnKS5zcGxpdCgnLCcpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIE1hcmtldGluZ1NlcnZpY2UuY3JlYXRlVGVhbSh0ZWFtRGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzd2FsKFwiQWRkZWRcIiwgXCJUZWFtcyBhZGRlZCB0byBkYXRhYmFzZS5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICAkc2NvcGUuYm9keT1cIlwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgc3dhbChcIkVSUk9SIVwiLCBcIkFsbCBmaWVsZHMgYXJlIHJlcXVpcmVkLlwiLCBcImVycm9yXCIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIFxyXG4gIH1cclxuXSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdBZG1pblNldHRpbmdzQ3RybCcsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRzY2UnLFxyXG4gICAgJ1NldHRpbmdzU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzY2UsIFNldHRpbmdzU2VydmljZSl7XHJcblxyXG4gICAgICAkc2NvcGUuc2V0dGluZ3MgPSB7fTtcclxuICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgLmdldFB1YmxpY1NldHRpbmdzKClcclxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZVNldHRpbmdzKHNldHRpbmdzKXtcclxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAvLyBGb3JtYXQgdGhlIGRhdGVzIGluIHNldHRpbmdzLlxyXG4gICAgICAgIHNldHRpbmdzLnRpbWVPcGVuID0gbmV3IERhdGUoc2V0dGluZ3MudGltZU9wZW4pO1xyXG4gICAgICAgIHNldHRpbmdzLnRpbWVDbG9zZSA9IG5ldyBEYXRlKHNldHRpbmdzLnRpbWVDbG9zZSk7XHJcbiAgICAgICAgc2V0dGluZ3MudGltZUNvbmZpcm0gPSBuZXcgRGF0ZShzZXR0aW5ncy50aW1lQ29uZmlybSk7XHJcbiAgICAgICAgc2V0dGluZ3MudGltZVN0YXJ0ID0gbmV3IERhdGUoc2V0dGluZ3MudGltZVN0YXJ0KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnNldHRpbmdzID0gc2V0dGluZ3M7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEFkZGl0aW9uYWwgT3B0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgJHNjb3BlLnVwZGF0ZUFsbG93TWlub3JzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUFsbG93TWlub3JzKCRzY29wZS5zZXR0aW5ncy5hbGxvd01pbm9ycylcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNjb3BlLnNldHRpbmdzLmFsbG93TWlub3JzID0gcmVzcG9uc2UuZGF0YS5hbGxvd01pbm9ycztcclxuICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc1RleHQgPSAkc2NvcGUuc2V0dGluZ3MuYWxsb3dNaW5vcnMgP1xyXG4gICAgICAgICAgICAgIFwiTWlub3JzIGFyZSBub3cgYWxsb3dlZCB0byByZWdpc3Rlci5cIiA6XHJcbiAgICAgICAgICAgICAgXCJNaW5vcnMgYXJlIG5vIGxvbmdlciBhbGxvd2VkIHRvIHJlZ2lzdGVyLlwiXHJcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBzdWNjZXNzVGV4dCwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBXaGl0ZWxpc3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgIC5nZXRXaGl0ZWxpc3RlZEVtYWlscygpXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgJHNjb3BlLndoaXRlbGlzdCA9IHJlc3BvbnNlLmRhdGEuam9pbihcIiwgXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUudXBkYXRlV2hpdGVsaXN0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgICAgICAudXBkYXRlV2hpdGVsaXN0ZWRFbWFpbHMoJHNjb3BlLndoaXRlbGlzdC5yZXBsYWNlKC8gL2csICcnKS5zcGxpdCgnLCcpKVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgc3dhbCgnV2hpdGVsaXN0IHVwZGF0ZWQuJyk7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLndoaXRlbGlzdCA9IHJlc3BvbnNlLmRhdGEud2hpdGVsaXN0ZWRFbWFpbHMuam9pbihcIiwgXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgLy8gUmVnaXN0cmF0aW9uIFRpbWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAkc2NvcGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpe1xyXG4gICAgICAgIGlmICghZGF0ZSl7XHJcbiAgICAgICAgICByZXR1cm4gXCJJbnZhbGlkIERhdGVcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEhhY2sgZm9yIHRpbWV6b25lXHJcbiAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5mb3JtYXQoJ2RkZGQsIE1NTU0gRG8gWVlZWSwgaDptbSBhJykgK1xyXG4gICAgICAgICAgXCIgXCIgKyBkYXRlLnRvVGltZVN0cmluZygpLnNwbGl0KCcgJylbMl07XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBUYWtlIGEgZGF0ZSBhbmQgcmVtb3ZlIHRoZSBzZWNvbmRzLlxyXG4gICAgICBmdW5jdGlvbiBjbGVhbkRhdGUoZGF0ZSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFxyXG4gICAgICAgICAgZGF0ZS5nZXRGdWxsWWVhcigpLFxyXG4gICAgICAgICAgZGF0ZS5nZXRNb250aCgpLFxyXG4gICAgICAgICAgZGF0ZS5nZXREYXRlKCksXHJcbiAgICAgICAgICBkYXRlLmdldEhvdXJzKCksXHJcbiAgICAgICAgICBkYXRlLmdldE1pbnV0ZXMoKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVSZWdpc3RyYXRpb25UaW1lcyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8gQ2xlYW4gdGhlIGRhdGVzIGFuZCB0dXJuIHRoZW0gdG8gbXMuXHJcbiAgICAgICAgdmFyIG9wZW4gPSBjbGVhbkRhdGUoJHNjb3BlLnNldHRpbmdzLnRpbWVPcGVuKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgdmFyIGNsb3NlID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lQ2xvc2UpLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgaWYgKG9wZW4gPCAwIHx8IGNsb3NlIDwgMCB8fCBvcGVuID09PSB1bmRlZmluZWQgfHwgY2xvc2UgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICByZXR1cm4gc3dhbCgnT29wcy4uLicsICdZb3UgbmVlZCB0byBlbnRlciB2YWxpZCB0aW1lcy4nLCAnZXJyb3InKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wZW4gPj0gY2xvc2Upe1xyXG4gICAgICAgICAgc3dhbCgnT29wcy4uLicsICdSZWdpc3RyYXRpb24gY2Fubm90IG9wZW4gYWZ0ZXIgaXQgY2xvc2VzLicsICdlcnJvcicpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlUmVnaXN0cmF0aW9uVGltZXMob3BlbiwgY2xvc2UpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJSZWdpc3RyYXRpb24gVGltZXMgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIENvbmZpcm1hdGlvbiBUaW1lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlQ29uZmlybWF0aW9uVGltZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGNvbmZpcm1CeSA9IGNsZWFuRGF0ZSgkc2NvcGUuc2V0dGluZ3MudGltZUNvbmZpcm0pLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlQ29uZmlybWF0aW9uVGltZShjb25maXJtQnkpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICBzd2FsKFwiU291bmRzIGdvb2QhXCIsIFwiQ29uZmlybWF0aW9uIERhdGUgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIEV2ZW50IFN0YXJ0IFRpbWUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVTdGFydFRpbWUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBzdGFydEJ5ID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lU3RhcnQpLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlU3RhcnRUaW1lKHN0YXJ0QnkpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICBzd2FsKFwiU291bmRzIGdvb2QhXCIsIFwiRXZlbnQgU3RhcnQgRGF0ZSBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuXHJcbiAgICAgIC8vIEFjY2VwdGFuY2UgLyBDb25maXJtYXRpb24gVGV4dCAtLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICB2YXIgY29udmVydGVyID0gbmV3IHNob3dkb3duLkNvbnZlcnRlcigpO1xyXG5cclxuICAgICAgJHNjb3BlLm1hcmtkb3duUHJldmlldyA9IGZ1bmN0aW9uKHRleHQpe1xyXG4gICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbCh0ZXh0KSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlV2FpdGxpc3RUZXh0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgdGV4dCA9ICRzY29wZS5zZXR0aW5ncy53YWl0bGlzdFRleHQ7XHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlV2FpdGxpc3RUZXh0KHRleHQpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIldhaXRsaXN0IFRleHQgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlSG9zdFNjaG9vbCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGhvc3RTY2hvb2wgPSAkc2NvcGUuc2V0dGluZ3MuaG9zdFNjaG9vbDtcclxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVIb3N0U2Nob29sKGhvc3RTY2hvb2wpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIkhvc3QgU2Nob29sIFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgIFxyXG4gICAgICAkc2NvcGUudXBkYXRlQWNjZXB0YW5jZVRleHQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciB0ZXh0ID0gJHNjb3BlLnNldHRpbmdzLmFjY2VwdGFuY2VUZXh0O1xyXG4gICAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUFjY2VwdGFuY2VUZXh0KHRleHQpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIkFjY2VwdGFuY2UgVGV4dCBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVDb25maXJtYXRpb25UZXh0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgdGV4dCA9ICRzY29wZS5zZXR0aW5ncy5jb25maXJtYXRpb25UZXh0O1xyXG4gICAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUNvbmZpcm1hdGlvblRleHQodGV4dClcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiQ29uZmlybWF0aW9uIFRleHQgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignQWRtaW5Vc2VyQ3RybCcsW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJGh0dHAnLFxyXG4gICAgJ3VzZXInLFxyXG4gICAgJ1VzZXJTZXJ2aWNlJyxcclxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsIFVzZXIsIFVzZXJTZXJ2aWNlKXtcclxuICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlciA9IFVzZXIuZGF0YTtcclxuXHJcbiAgICAgIC8vIFBvcHVsYXRlIHRoZSBzY2hvb2wgZHJvcGRvd25cclxuICAgICAgcG9wdWxhdGVTY2hvb2xzKCk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBwb3B1bGF0ZVNjaG9vbHMoKXtcclxuXHJcbiAgICAgICAgJGh0dHBcclxuICAgICAgICAgIC5nZXQoJy9hc3NldHMvc2Nob29scy5qc29uJylcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgICAgICAgIHZhciBzY2hvb2xzID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgIHZhciBlbWFpbCA9ICRzY29wZS5zZWxlY3RlZFVzZXIuZW1haWwuc3BsaXQoJ0AnKVsxXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzY2hvb2xzW2VtYWlsXSl7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlci5wcm9maWxlLnNjaG9vbCA9IHNjaG9vbHNbZW1haWxdLnNjaG9vbDtcclxuICAgICAgICAgICAgICAkc2NvcGUuYXV0b0ZpbGxlZFNjaG9vbCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVQcm9maWxlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZVByb2ZpbGUoJHNjb3BlLnNlbGVjdGVkVXNlci5faWQsICRzY29wZS5zZWxlY3RlZFVzZXIucHJvZmlsZSlcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNlbGVjdGVkVXNlciA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIHN3YWwoXCJVcGRhdGVkIVwiLCBcIlByb2ZpbGUgdXBkYXRlZC5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFwiT29wcywgeW91IGZvcmdvdCBzb21ldGhpbmcuXCIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG5cclxuICAgICAgJHNjb3BlLnVwZGF0ZUNvbmZpcm1hdGlvbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVDb25maXJtYXRpb24oJHNjb3BlLnNlbGVjdGVkVXNlci5faWQsICRzY29wZS5zZWxlY3RlZFVzZXIuY29uZmlybWF0aW9uKVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2VsZWN0ZWRVc2VyID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcIlVwZGF0ZWQhXCIsIFwiQ29uZmlybWF0aW9uIHVwZGF0ZWQuXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIk9vcHMsIHlvdSBmb3Jnb3Qgc29tZXRoaW5nLlwiKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVBbGxVc2VyID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVBbGwoJHNjb3BlLnNlbGVjdGVkVXNlci5faWQsICRzY29wZS5zZWxlY3RlZFVzZXIpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICRzZWxlY3RlZFVzZXIgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICBzd2FsKFwiVXBkYXRlZCFcIiwgXCJBTEwgUHJvZmlsZSB1cGRhdGVkLlwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJPb3BzLCB5b3UgZm9yZ290IHNvbWV0aGluZy5cIik7XHJcbiAgICAgICAgICB9KTsgIFxyXG4gICAgICB9O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKFwicmVnXCIpLmNvbnRyb2xsZXIoXCJBZG1pblVzZXJzQ3RybFwiLCBbXHJcbiAgXCIkc2NvcGVcIixcclxuICBcIiRzdGF0ZVwiLFxyXG4gIFwiJHN0YXRlUGFyYW1zXCIsXHJcbiAgXCJVc2VyU2VydmljZVwiLFxyXG4gICdBdXRoU2VydmljZScsXHJcbiAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgVXNlclNlcnZpY2UsIEF1dGhTZXJ2aWNlKSB7XHJcbiAgICAkc2NvcGUucGFnZXMgPSBbXTtcclxuICAgICRzY29wZS51c2VycyA9IFtdO1xyXG5cclxuICAgIC8vIFNlbWFudGljLVVJIG1vdmVzIG1vZGFsIGNvbnRlbnQgaW50byBhIGRpbW1lciBhdCB0aGUgdG9wIGxldmVsLlxyXG4gICAgLy8gV2hpbGUgdGhpcyBpcyB1c3VhbGx5IG5pY2UsIGl0IG1lYW5zIHRoYXQgd2l0aCBvdXIgcm91dGluZyB3aWxsIGdlbmVyYXRlXHJcbiAgICAvLyBtdWx0aXBsZSBtb2RhbHMgaWYgeW91IGNoYW5nZSBzdGF0ZS4gS2lsbCB0aGUgdG9wIGxldmVsIGRpbW1lciBub2RlIG9uIGluaXRpYWwgbG9hZFxyXG4gICAgLy8gdG8gcHJldmVudCB0aGlzLlxyXG4gICAgJChcIi51aS5kaW1tZXJcIikucmVtb3ZlKCk7XHJcbiAgICAvLyBQb3B1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgbW9kYWwgZm9yIHdoZW4gaXQgYXBwZWFycywgd2l0aCBhbiBhcmJpdHJhcnkgdXNlci5cclxuICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSB7fTtcclxuICAgICRzY29wZS5zZWxlY3RlZFVzZXIuc2VjdGlvbnMgPSBnZW5lcmF0ZVNlY3Rpb25zKHtcclxuICAgICAgc3RhdHVzOiBcIlwiLFxyXG4gICAgICBjb25maXJtYXRpb246IHtcclxuICAgICAgICBkaWV0YXJ5UmVzdHJpY3Rpb25zOiBbXVxyXG4gICAgICB9LFxyXG4gICAgICBwcm9maWxlOiBcIlwiXHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVQYWdlKGRhdGEpIHtcclxuICAgICAgJHNjb3BlLnVzZXJzID0gZGF0YS51c2VycztcclxuICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gZGF0YS5wYWdlO1xyXG4gICAgICAkc2NvcGUucGFnZVNpemUgPSBkYXRhLnNpemU7XHJcblxyXG4gICAgICB2YXIgcCA9IFtdO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEudG90YWxQYWdlczsgaSsrKSB7XHJcbiAgICAgICAgcC5wdXNoKGkpO1xyXG4gICAgICB9XHJcbiAgICAgICRzY29wZS5wYWdlcyA9IHA7XHJcbiAgICB9XHJcblxyXG4gICAgVXNlclNlcnZpY2UuZ2V0UGFnZSgkc3RhdGVQYXJhbXMucGFnZSwgJHN0YXRlUGFyYW1zLnNpemUsICRzdGF0ZVBhcmFtcy5xdWVyeSwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMpXHJcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcblxyXG4gICAgICB1cGRhdGVQYWdlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJHNjb3BlLiR3YXRjaChcInF1ZXJ5VGV4dFwiLCBmdW5jdGlvbihxdWVyeVRleHQpIHtcclxuICAgICAgVXNlclNlcnZpY2UuZ2V0UGFnZSgkc3RhdGVQYXJhbXMucGFnZSwgJHN0YXRlUGFyYW1zLnNpemUsIHF1ZXJ5VGV4dCwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMpLnRoZW4oXHJcbiAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgdXBkYXRlUGFnZShyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgJHNjb3BlLmFwcGx5U3RhdHVzRmlsdGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgIC5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHNjb3BlLnF1ZXJ5VGV4dCwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMpLnRoZW4oXHJcbiAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVBhZ2UocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAkc2NvcGUuZ29Ub1BhZ2UgPSBmdW5jdGlvbihwYWdlKSB7XHJcbiAgICAgICRzdGF0ZS5nbyhcImFwcC5hZG1pbi51c2Vyc1wiLCB7XHJcbiAgICAgICAgcGFnZTogcGFnZSxcclxuICAgICAgICBzaXplOiAkc3RhdGVQYXJhbXMuc2l6ZSB8fCAyMFxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmdvVXNlciA9IGZ1bmN0aW9uKCRldmVudCwgdXNlcikge1xyXG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAkc3RhdGUuZ28oXCJhcHAuYWRtaW4udXNlclwiLCB7XHJcbiAgICAgICAgaWQ6IHVzZXIuX2lkXHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgJHNjb3BlLmFjY2VwdFVzZXIgPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIsIGluZGV4KSB7XHJcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYWNjZXB0OiB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgYWNjZXB0IHRoZW1cIixcclxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhbmdlck1vZGU6IHRydWUsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGFjY2VwdCBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIhXCIsXHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIlxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeWVzOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgYWNjZXB0IHRoaXMgdXNlclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRhbmdlck1vZGU6IHRydWUsXHJcbiAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICB0ZXh0OlxyXG4gICAgICAgICAgICBcIllvdXIgYWNjb3VudCB3aWxsIGJlIGxvZ2dlZCBhcyBoYXZpbmcgYWNjZXB0ZWQgdGhpcyB1c2VyLiBcIiArXHJcbiAgICAgICAgICAgIFwiUmVtZW1iZXIsIHRoaXMgcG93ZXIgaXMgYSBwcml2aWxlZ2UuXCIsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIlxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFVzZXJTZXJ2aWNlLnNvZnRBZG1pdHRVc2VyKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJBY2NlcHRlZFwiLFxyXG4gICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEucHJvZmlsZS5uYW1lICsgXCIgaGFzIGJlZW4gYWRtaXR0ZWQuXCIsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgICRzY29wZS5yZWplY3R0VXNlciA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcclxuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBzd2FsKHtcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhY2NlcHQ6IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZWplY3QgdGhlbVwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVqZWN0IFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIiFcIixcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiXHJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeWVzOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVqZWN0IHRoaXMgdXNlclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRhbmdlck1vZGU6IHRydWUsXHJcbiAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICB0ZXh0OlxyXG4gICAgICAgICAgICBcIllvdXIgYWNjb3VudCB3aWxsIGJlIGxvZ2dlZCBhcyBoYXZpbmcgcmVqZWN0ZWQgdGhpcyB1c2VyLiBcIiArXHJcbiAgICAgICAgICAgIFwiUmVtZW1iZXIsIHRoaXMgcG93ZXIgaXMgYSBwcml2aWxlZ2UuXCIsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIlxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFVzZXJTZXJ2aWNlLnNvZnRSZWplY3RVc2VyKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJSZWplY3RlZFwiLFxyXG4gICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEucHJvZmlsZS5uYW1lICsgXCIgaGFzIGJlZW4gcmVqZWN0ZWQuXCIsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG5cclxuXHJcbiAgICAkc2NvcGUucmVtb3ZlVXNlciA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcclxuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuXHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGFjY2VwdDoge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSB0aGVtXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYW5nZXJNb2RlOiB0cnVlLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byByZW1vdmUgXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCJcclxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB5ZXM6IHtcclxuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgdGhpcyB1c2VyXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcclxuICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcclxuICAgICAgICAgIHRleHQ6XHJcbiAgICAgICAgICAgIFwiWW91ciBhY2NvdW50IHdpbGwgYmUgbG9nZ2VkIGFzIGhhdmluZyByZW1vdmVkIHRoaXMgdXNlci4gXCIgK1xyXG4gICAgICAgICAgICBcIlJlbWVtYmVyLCB0aGlzIHBvd2VyIGlzIGEgcHJpdmlsZWdlLlwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCJcclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIFVzZXJTZXJ2aWNlLnJlbW92ZVVzZXIodXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIlJlbW92ZWRcIixcclxuICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLnByb2ZpbGUubmFtZSArIFwiIGhhcyBiZWVuIHJlbW92ZWQuXCIsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuc2VuZEFjY2VwdGFuY2VFbWFpbHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgY29uc3QgZmlsdGVyU29mdEFjY2VwdGVkID0gJHNjb3BlLnVzZXJzLmZpbHRlcihcclxuICAgICAgICB1ID0+IHUuc3RhdHVzLnNvZnRBZG1pdHRlZCAmJiAhdS5zdGF0dXMuYWRtaXR0ZWRcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHZhciBtZXNzYWdlID0gJCh0aGlzKS5kYXRhKFwiY29uZmlybVwiKTtcclxuXHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgdGV4dDogYFlvdSdyZSBhYm91dCB0byBzZW5kIGFjY2VwdGFuY2UgZW1haWxzIChhbmQgYWNjZXB0KSAke1xyXG4gICAgICAgICAgZmlsdGVyU29mdEFjY2VwdGVkLmxlbmd0aFxyXG4gICAgICAgIH0gdXNlcihzKS5gLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIGJ1dHRvbnM6IFtcIkNhbmNlbFwiLCBcIlllcywgYWNjZXB0IHRoZW0gYW5kIHNlbmQgdGhlIGVtYWlsc1wiXSxcclxuICAgICAgICBkYW5nZXJNb2RlOiB0cnVlXHJcbiAgICAgIH0pLnRoZW4od2lsbFNlbmQgPT4ge1xyXG4gICAgICAgIGlmICh3aWxsU2VuZCkge1xyXG4gICAgICAgICAgaWYgKGZpbHRlclNvZnRBY2NlcHRlZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZmlsdGVyU29mdEFjY2VwdGVkLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgICAgICAgVXNlclNlcnZpY2UuYWRtaXRVc2VyKHVzZXIuX2lkKTsgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgIFwiU2VuZGluZyFcIixcclxuICAgICAgICAgICAgICBgQWNjZXB0aW5nIGFuZCBzZW5kaW5nIGVtYWlscyB0byAke1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyU29mdEFjY2VwdGVkLmxlbmd0aFxyXG4gICAgICAgICAgICAgIH0gdXNlcnMhYCxcclxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3dhbChcIldob29wc1wiLCBcIllvdSBjYW4ndCBzZW5kIG9yIGFjY2VwdCAwIHVzZXJzIVwiLCBcImVycm9yXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgJHNjb3BlLnNlbmRSZWplY3Rpb25FbWFpbHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgY29uc3QgZmlsdGVyU29mdFJlamVjdGVkID0gJHNjb3BlLnVzZXJzLmZpbHRlcihcclxuICAgICAgICB1ID0+IHUuc3RhdHVzLnNvZnRSZWplY3RlZFxyXG4gICAgICApO1xyXG5cclxuICAgICAgdmFyIG1lc3NhZ2UgPSAkKHRoaXMpLmRhdGEoXCJjb25maXJtXCIpO1xyXG5cclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICB0ZXh0OiBgWW91J3JlIGFib3V0IHRvIHNlbmQgcmVqZWN0aW9uIGVtYWlscyAoYW5kIHJlamVjdCkgJHtcclxuICAgICAgICAgIGZpbHRlclNvZnRSZWplY3RlZC5sZW5ndGhcclxuICAgICAgICB9IHVzZXIocykuYCxcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICBidXR0b25zOiBbXCJDYW5jZWxcIiwgXCJZZXMsIHJlamVjdCB0aGVtIGFuZCBzZW5kIHRoZSBlbWFpbHNcIl0sXHJcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZVxyXG4gICAgICB9KS50aGVuKHdpbGxTZW5kID0+IHtcclxuICAgICAgICBpZiAod2lsbFNlbmQpIHtcclxuICAgICAgICAgIGlmIChmaWx0ZXJTb2Z0UmVqZWN0ZWQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGZpbHRlclNvZnRSZWplY3RlZC5mb3JFYWNoKHVzZXIgPT4ge1xyXG4gICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnJlamVjdFVzZXIodXNlci5faWQpOyBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJTZW5kaW5nIVwiLFxyXG4gICAgICAgICAgICAgIGBSZWplY3RpbmcgYW5kIHNlbmRpbmcgZW1haWxzIHRvICR7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJTb2Z0UmVqZWN0ZWQubGVuZ3RoXHJcbiAgICAgICAgICAgICAgfSB1c2VycyFgLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzd2FsKFwiV2hvb3BzXCIsIFwiWW91IGNhbid0IHNlbmQgb3IgcmVqZWN0IDAgdXNlcnMhXCIsIFwiZXJyb3JcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgICRzY29wZS5leHBvcnRVc2VycyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBjb2x1bW5zID0gW1wiTsKwXCIsIFwiR2VuZGVyXCIsIFwiRnVsbCBOYW1lXCIsXCJTY2hvb2xcIl07XHJcbiAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgIFVzZXJTZXJ2aWNlLmdldEFsbCgpLnRoZW4odXNlcnMgPT4ge1xyXG4gICAgICAgIHZhciBpPTE7XHJcbiAgICAgICAgdXNlcnMuZGF0YS5mb3JFYWNoKHVzZXIgPT4ge1xyXG4gICAgICAgICAgcm93cy5wdXNoKFtpKyssdXNlci5wcm9maWxlLmdlbmRlcix1c2VyLnByb2ZpbGUubmFtZSx1c2VyLnByb2ZpbGUuc2Nob29sXSlcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgZG9jID0gbmV3IGpzUERGKCdwJywgJ3B0Jyk7XHJcblxyXG5cclxuICAgICAgICB2YXIgdG90YWxQYWdlc0V4cCA9IFwie3RvdGFsX3BhZ2VzX2NvdW50X3N0cmluZ31cIjtcclxuXHJcbiAgICAgICAgdmFyIHBhZ2VDb250ZW50ID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgLy8gSEVBREVSXHJcbiAgICAgICAgICAgIGRvYy5zZXRGb250U2l6ZSgyMCk7XHJcbiAgICAgICAgICAgIGRvYy5zZXRUZXh0Q29sb3IoNDApO1xyXG4gICAgICAgICAgICBkb2Muc2V0Rm9udFN0eWxlKCdub3JtYWwnKTtcclxuICAgICAgICAgICAgLy8gaWYgKGJhc2U2NEltZykge1xyXG4gICAgICAgICAgICAvLyAgICAgZG9jLmFkZEltYWdlKGJhc2U2NEltZywgJ0pQRUcnLCBkYXRhLnNldHRpbmdzLm1hcmdpbi5sZWZ0LCAxNSwgMTAsIDEwKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICBkb2MudGV4dChcIlBhcnRpY2lwYW50cyBMaXN0XCIsIGRhdGEuc2V0dGluZ3MubWFyZ2luLmxlZnQgKyAxNSwgMjIpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIC8vIEZPT1RFUlxyXG4gICAgICAgICAgICB2YXIgc3RyID0gXCJQYWdlIFwiICsgZGF0YS5wYWdlQ291bnQ7XHJcbiAgICAgICAgICAgIC8vIFRvdGFsIHBhZ2UgbnVtYmVyIHBsdWdpbiBvbmx5IGF2YWlsYWJsZSBpbiBqc3BkZiB2MS4wK1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRvYy5wdXRUb3RhbFBhZ2VzID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIgKyBcIiBvZiBcIiArIHRvdGFsUGFnZXNFeHA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZG9jLnNldEZvbnRTaXplKDEwKTtcclxuICAgICAgICAgICAgdmFyIHBhZ2VIZWlnaHQgPSBkb2MuaW50ZXJuYWwucGFnZVNpemUuaGVpZ2h0IHx8IGRvYy5pbnRlcm5hbC5wYWdlU2l6ZS5nZXRIZWlnaHQoKTtcclxuICAgICAgICAgICAgZG9jLnRleHQoc3RyLCBkYXRhLnNldHRpbmdzLm1hcmdpbi5sZWZ0LCBwYWdlSGVpZ2h0ICAtIDEwKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRvYy5hdXRvVGFibGUoY29sdW1ucywgcm93cywge1xyXG4gICAgICAgICAgICBhZGRQYWdlQ29udGVudDogcGFnZUNvbnRlbnQsXHJcbiAgICAgICAgICAgIG1hcmdpbjoge3RvcDogMzB9LFxyXG4gICAgICAgICAgICB0aGVtZTogJ2dyaWQnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBkb2MucHV0VG90YWxQYWdlcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgZG9jLnB1dFRvdGFsUGFnZXModG90YWxQYWdlc0V4cCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvYy5zYXZlKCdQYXJ0aWNpcGFudHMgTGlzdC5wZGYnKTtcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgJHNjb3BlLnRvZ2dsZUFkbWluID0gZnVuY3Rpb24oJGV2ZW50LCB1c2VyLCBpbmRleCkge1xyXG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICBpZiAoIXVzZXIuYWRtaW4pIHtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgbWFrZSBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIgYW4gYWRtaW4hXCIsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbmZpcm06IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgbWFrZSB0aGVtIGFuIGFkbWluXCIsXHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIFVzZXJTZXJ2aWNlLm1ha2VBZG1pbih1c2VyLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2Vyc1tpbmRleF0gPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICBzd2FsKFwiTWFkZVwiLCByZXNwb25zZS5kYXRhLnByb2ZpbGUubmFtZSArIFwiIGFuIGFkbWluLlwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFVzZXJTZXJ2aWNlLnJlbW92ZUFkbWluKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICRzY29wZS51c2Vyc1tpbmRleF0gPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgc3dhbChcIlJlbW92ZWRcIiwgcmVzcG9uc2UuZGF0YS5wcm9maWxlLm5hbWUgKyBcIiBhcyBhZG1pblwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZm9ybWF0VGltZSh0aW1lKSB7XHJcbiAgICAgIGlmICh0aW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIG1vbWVudCh0aW1lKS5mb3JtYXQoXCJNTU1NIERvIFlZWVksIGg6bW06c3MgYVwiKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5yb3dDbGFzcyA9IGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgICAgaWYgKHVzZXIuYWRtaW4pIHtcclxuICAgICAgICByZXR1cm4gXCJhZG1pblwiO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh1c2VyLnN0YXR1cy5jb25maXJtZWQpIHtcclxuICAgICAgICByZXR1cm4gXCJwb3NpdGl2ZVwiO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJiAhdXNlci5zdGF0dXMuY29uZmlybWVkKSB7XHJcbiAgICAgICAgcmV0dXJuIFwid2FybmluZ1wiO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHNlbGVjdFVzZXIodXNlcikge1xyXG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gdXNlcjtcclxuICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlci5zZWN0aW9ucyA9IGdlbmVyYXRlU2VjdGlvbnModXNlcik7XHJcbiAgICAgICQoXCIubG9uZy51c2VyLm1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVNlY3Rpb25zKHVzZXIpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiBcIkJhc2ljIEluZm9cIixcclxuICAgICAgICAgIGZpZWxkczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJDcmVhdGVkIE9uXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci50aW1lc3RhbXApXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkxhc3QgVXBkYXRlZFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIubGFzdFVwZGF0ZWQpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkNvbmZpcm0gQnlcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLnN0YXR1cy5jb25maXJtQnkpIHx8IFwiTi9BXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiQ2hlY2tlZCBJblwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNoZWNrSW5UaW1lKSB8fCBcIk4vQVwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkVtYWlsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuZW1haWxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogXCJQcm9maWxlXCIsXHJcbiAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiTmFtZVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUubmFtZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJHZW5kZXJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdlbmRlclxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJTY2hvb2xcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLnNjaG9vbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJHcmFkdWF0aW9uIFllYXJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdyYWR1YXRpb25ZZWFyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkhhY2thdGhvbnMgdmlzaXRlZFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuaG93TWFueUhhY2thdGhvbnNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiRGVzY3JpcHRpb25cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkVzc2F5XCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5lc3NheVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJNYWpvclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUubWFqb3JcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiR2l0aHViXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5naXRodWJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiRmFjZWJvb2tcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmZhY2Vib29rXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkxpbmtlZGluXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5saW5rZWRpblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTpcIkNWIGxpbmtcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmN2TGlua1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogXCJDb25maXJtYXRpb25cIixcclxuICAgICAgICAgIGZpZWxkczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJQaG9uZSBOdW1iZXJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ucGhvbmVOdW1iZXJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiTmVlZHMgSGFyZHdhcmVcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ud2FudHNIYXJkd2FyZSxcclxuICAgICAgICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJIYXJkd2FyZSBSZXF1ZXN0ZWRcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uaGFyZHdhcmVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6XCJOYXRpb25hbCBDYXJkIElEXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm5hdGlvbmFsQ2FyZElEXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6IFwiVHJhdmVsXCIsXHJcbiAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiQWRkaXRpb25hbCBOb3Rlc1wiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5ub3Rlc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uU3VjY2VzcygpIHtcclxuICAgICAgc3dhbChcIlVwZGF0ZWQhXCIsIFwiTmV3IFZvbHVudGVlciBBZGRlZC5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25FcnJvcihkYXRhKXtcclxuICAgICAgc3dhbChcIlRyeSBhZ2FpbiFcIiwgZGF0YS5tZXNzYWdlLCBcImVycm9yXCIpXHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLmFkZFZvbHVudGVlciA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICBzd2FsKFwiV3JpdGUgdGhlIGNoYWxsZW5nZSB0aXRsZTpcIiwge1xyXG4gICAgICAgIGJ1dHRvbnM6IHtjYW5jZWw6IHt0ZXh0OiBcIkNhbmNlbFwiLHZhbHVlOiBudWxsLHZpc2libGU6IHRydWV9LCB5ZXM6IHt0ZXh0OiBcIkludml0ZVwiLHZhbHVlOiB0cnVlLHZpc2libGU6IHRydWV9IH0sXHJcbiAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcImV4YW1wbGVAZ21haWwuY29tXCIsdHlwZTogXCJ0ZXh0XCJ9IH0sXHJcbiAgICAgIH0pLnRoZW4oKG1haWwpID0+IHsgaWYgKCFtYWlsKSB7cmV0dXJuO30gXHJcbiAgICAgICAgQXV0aFNlcnZpY2UucmVnaXN0ZXIoXHJcbiAgICAgICAgICBtYWlsLCBcImhhY2thdGhvblwiLCBvblN1Y2Nlc3MsIG9uRXJyb3IsIHRydWUpXHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgICRzY29wZS5zZWxlY3RVc2VyID0gc2VsZWN0VXNlcjtcclxuICB9XHJcbl0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKSAuY29uZmlnKFsnQ2hhcnRKc1Byb3ZpZGVyJywgZnVuY3Rpb24gKENoYXJ0SnNQcm92aWRlcikge1xyXG4gIC8vIENvbmZpZ3VyZSBhbGwgY2hhcnRzXHJcbiAgQ2hhcnRKc1Byb3ZpZGVyLnNldE9wdGlvbnMoe1xyXG4gICAgY2hhcnRDb2xvcnM6IFsnIzlCNjZGRScsICcjRkY2NDg0JywgJyNGRUEwM0YnLCAnI0ZCRDA0RCcsICcjNERCRkMwJywgJyMzM0EzRUYnLCAnI0NBQ0JDRiddLFxyXG4gICAgcmVzcG9uc2l2ZTogdHJ1ZVxyXG4gIH0pO1xyXG59XSlcclxuLmNvbnRyb2xsZXIoJ0FkbWluU3RhdHNDdHJsJyxbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsIFVzZXJTZXJ2aWNlKXtcclxuICAgICAgXHJcbiAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgLmdldFN0YXRzKClcclxuICAgICAgICAudGhlbihzdGF0cyA9PiB7XHJcbiAgICAgICAgICAkc2NvcGUuc3RhdHMgPSBzdGF0cy5kYXRhOyBcclxuXHJcbiAgICAgICAgICAvLyBNZWFscyBcclxuICAgICAgICAgIGxhYmVscz1bXVxyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0cy5kYXRhLmxpdmUubWVhbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsYWJlbHMucHVzaCgnTWVhbCAnKyhpKzEpKSAgICAgIFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgJHNjb3BlLm1lYWxzID0geyBcclxuICAgICAgICAgICAgbGFiZWxzIDogbGFiZWxzLFxyXG4gICAgICAgICAgICBzZXJpZXMgOiBbJ01lYWxzJ10sXHJcbiAgICAgICAgICAgIGRhdGEgOiBzdGF0cy5kYXRhLmxpdmUubWVhbCxcclxuICAgICAgICAgICAgb3B0aW9ucyA6IHtcclxuICAgICAgICAgICAgICBcInNjYWxlc1wiOntcclxuICAgICAgICAgICAgICAgIFwieEF4ZXNcIjpbe1widGlja3NcIjp7YmVnaW5BdFplcm86dHJ1ZSxtYXg6c3RhdHMuZGF0YS50b3RhbH19XVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiAnTWVhbHMgQ29uc3VtZWQnXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gV29ya3Nob3BzIFxyXG4gICAgICAgICAgbGFiZWxzPVtdXHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXRzLmRhdGEubGl2ZS53b3Jrc2hvcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsYWJlbHMucHVzaCgnV29ya3Nob3AgJysoaSsxKSkgICAgICBcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICRzY29wZS53b3Jrc2hvcHMgPSB7IFxyXG4gICAgICAgICAgICBsYWJlbHMgOiBsYWJlbHMsXHJcbiAgICAgICAgICAgIHNlcmllcyA6IFsnV29ya3Nob3BzJ10sXHJcbiAgICAgICAgICAgIGRhdGEgOiBzdGF0cy5kYXRhLmxpdmUud29ya3Nob3AsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6e1xyXG4gICAgICAgICAgICAgIGVsZW1lbnRzOiB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgIGJvcmRlcldpZHRoOiAwLjUsICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogJ1dvcmtzaG9wcyBhdHRlbmRhbmNlJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBjbHVic1xyXG4gICAgICAgICAgJHNjb3BlLmNsdWJzID0ge1xyXG4gICAgICAgICAgICBsYWJlbHMgOiBzdGF0cy5kYXRhLnNvdXJjZS5jbHVic0xhYmVscyxcclxuICAgICAgICAgICAgc2VyaWVzIDogWydDbHVicyddLFxyXG4gICAgICAgICAgICBkYXRhIDogc3RhdHMuZGF0YS5zb3VyY2UuY2x1YnMsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6e1xyXG4gICAgICAgICAgICAgIGVsZW1lbnRzOiB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgIGJvcmRlcldpZHRoOiAwLjUsICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogJ0FwcGxpY2FudHMgdmlhIENsdWJzJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyaWdodCcsXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgLy8gR2V0IHRoZSBtb3N0IGFjdGl2ZSBjbHViXHJcbiAgICAgICAgICAgdmFyIGFyciA9c3RhdHMuZGF0YS5zb3VyY2UuY2x1YnNcclxuICAgICAgICAgICB2YXIgbWF4ID0gYXJyWzBdO1xyXG4gICAgICAgICAgIHZhciBtYXhJbmRleCA9IDA7XHJcbiAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgaWYgKGFycltpXSA+IG1heCkge1xyXG4gICAgICAgICAgICAgICAgICAgbWF4SW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgbWF4ID0gYXJyW2ldO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAkc2NvcGUuZmlyc3RDbHViID0gc3RhdHMuZGF0YS5zb3VyY2UuY2x1YnNMYWJlbHNbbWF4SW5kZXhdXHJcblxyXG4gICAgICAgXHJcblxyXG5cclxuICAgICAgICAgIC8vIHNvdXJjZXMgXHJcbiAgICAgICAgICAkc2NvcGUuc291cmNlID0ge1xyXG4gICAgICAgICAgICBsYWJlbHMgOiBbJ0ZhY2Vib29rJywnRW1haWwnLCdDbHVicyddLFxyXG4gICAgICAgICAgICBzZXJpZXMgOiBbJ1NvdXJjZXMnXSxcclxuICAgICAgICAgICAgZGF0YSA6IHN0YXRzLmRhdGEuc291cmNlLmdlbmVyYWwsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6e1xyXG4gICAgICAgICAgICAgIGVsZW1lbnRzOiB7XHJcbiAgICAgICAgICAgICAgICBsaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgIGJvcmRlcldpZHRoOiAwLjUsICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogJ0FwcGxpY2FudHMgc291cmNlcydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmlnaHQnLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH0pOyAgXHJcblxyXG5cclxuICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAuZ2V0VGVhbVN0YXRzKClcclxuICAgICAgICAudGhlbih0ZWFtc3RhdHMgPT4ge1xyXG4gICAgICAgICAgJHNjb3BlLnRlYW1zdGF0cyA9IHRlYW1zdGF0cy5kYXRhOyBcclxuICAgICAgICB9KTsgIFxyXG5cclxuXHJcbiAgICAgICRzY29wZS5mcm9tTm93ID0gZnVuY3Rpb24oZGF0ZSl7XHJcbiAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5mcm9tTm93KCk7XHJcbiAgICAgIH07XHJcblxyXG5cclxuICAgICAgQ2hhcnQuZGVmYXVsdHMuZ2xvYmFsLmNvbG9ycyA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDUyLCAxNTIsIDIxOSwgMC41KScsXHJcbiAgICAgICAgICBwb2ludEJhY2tncm91bmRDb2xvcjogJ3JnYmEoNTIsIDE1MiwgMjE5LCAwLjUpJyxcclxuICAgICAgICAgIHBvaW50SG92ZXJCYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDE1MSwxODcsMjA1LDAuNSknLFxyXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICdyZ2JhKDAsMCwwLDAnLFxyXG4gICAgICAgICAgcG9pbnRCb3JkZXJDb2xvcjogJyNmZmYnLFxyXG4gICAgICAgICAgcG9pbnRIb3ZlckJvcmRlckNvbG9yOiAncmdiYSgxNTEsMTg3LDIwNSwwLjUpJ1xyXG4gICAgICAgIH1cclxuICAgICAgXSAgICAgICAgXHJcblxyXG5cclxuICAgICAgJHNjb3BlLnNlbmRMYWdnZXJFbWFpbHMgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxyXG4gICAgICAgICAgdGV4dDogXCJUaGlzIHdpbGwgc2VuZCBhbiBlbWFpbCB0byBldmVyeSB1c2VyIHdobyBoYXMgbm90IHN1Ym1pdHRlZCBhbiBhcHBsaWNhdGlvbi4gQXJlIHlvdSBzdXJlPy5cIixcclxuICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjREQ2QjU1XCIsXHJcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIHNlbmQuXCIsXHJcbiAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcclxuICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgLnNlbmRMYWdnZXJFbWFpbHMoKVxyXG4gICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBzd2VldEFsZXJ0KCdZb3VyIGVtYWlscyBoYXZlIGJlZW4gc2VudC4nKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zZW5kUmVqZWN0RW1haWxzID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcclxuICAgICAgICAgIHRleHQ6IFwiVGhpcyB3aWxsIHNlbmQgYW4gZW1haWwgdG8gZXZlcnkgdXNlciB3aG8gaGFzIGJlZW4gcmVqZWN0ZWQuIEFyZSB5b3Ugc3VyZT9cIixcclxuICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjREQ2QjU1XCIsXHJcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIHNlbmQuXCIsXHJcbiAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcclxuICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgLnNlbmRSZWplY3RFbWFpbHMoKVxyXG4gICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBzd2VldEFsZXJ0KCdZb3VyIGVtYWlscyBoYXZlIGJlZW4gc2VudC4nKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zZW5kUmVqZWN0RW1haWxzUmVzdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgIC5nZXRMYXRlclJlamVjdGVkQ291bnQoKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oY291bnQpIHtcclxuICAgICAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxyXG4gICAgICAgICAgICAgIHRleHQ6IGBUaGlzIHdpbGwgc2VuZCByZWplY3Rpb24gZW1haWwgdG8gJHtjb3VudH0gdXNlcnMuYCxcclxuICAgICAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjREQ2QjU1XCIsXHJcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiWWVzLCByZWplY3QuXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXHJcbiAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgICAgICAgICAgLnNlbmRSZWplY3RFbWFpbHNSZXN0KClcclxuICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBzd2VldEFsZXJ0KCdZb3VyIGVtYWlscyBoYXZlIGJlZW4gc2VudC4nKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSlcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5tYXNzUmVqZWN0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgIC5nZXRSZWplY3Rpb25Db3VudCgpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihjb3VudCkge1xyXG4gICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICAgICAgdGV4dDogYFRoaXMgd2lsbCByZWplY3QgJHtjb3VudH0gdXNlcnMuYCxcclxuICAgICAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjREQ2QjU1XCIsXHJcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiWWVzLCByZWplY3QuXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXHJcbiAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgICAgICAgICAgLm1hc3NSZWplY3QoKVxyXG4gICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIHN3ZWV0QWxlcnQoJ01hc3MgUmVqZWN0aW9uIHN1Y2Nlc3NmdWwuJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5tYXNzUmVqZWN0UmVzdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAuZ2V0UmVzdFJlamVjdGlvbkNvdW50KClcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGNvdW50KSB7XHJcbiAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcclxuICAgICAgICAgICAgICB0ZXh0OiBgVGhpcyB3aWxsIHJlamVjdCAke2NvdW50fSB1c2Vycy5gLFxyXG4gICAgICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcclxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIHJlamVjdC5cIixcclxuICAgICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcclxuICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgICAgICAgICAubWFzc1JlamVjdFJlc3QoKVxyXG4gICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIHN3ZWV0QWxlcnQoJ01hc3MgUmVqZWN0aW9uIHN1Y2Nlc3NmdWwuJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5zZXJ2aWNlKCdzZXR0aW5ncycsIGZ1bmN0aW9uKCkge30pXHJcbiAgLmNvbnRyb2xsZXIoJ0Jhc2VDdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnRVZFTlRfSU5GTycsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsIEVWRU5UX0lORk8pe1xyXG5cclxuICAgICAgJHNjb3BlLkVWRU5UX0lORk8gPSBFVkVOVF9JTkZPO1xyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ0FwcGxpY2F0aW9uQ3RybCcsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnJGh0dHAnLFxyXG4gICAgJ2N1cnJlbnRVc2VyJyxcclxuICAgICdzZXR0aW5ncycsXHJcbiAgICAnU2Vzc2lvbicsXHJcbiAgICAnVXNlclNlcnZpY2UnLFxyXG4gICAgJ01hcmtldGluZ1NlcnZpY2UnLFxyXG4gICAgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkaHR0cCwgY3VycmVudFVzZXIsIHNldHRpbmdzLCBTZXNzaW9uLCBVc2VyU2VydmljZSwgTWFya2V0aW5nU2VydmljZSkge1xyXG5cclxuICAgICAgLy8gU2V0IHVwIHRoZSB1c2VyXHJcbiAgICAgICRzY29wZS51c2VyID0gY3VycmVudFVzZXIuZGF0YTtcclxuXHJcbiAgICAgIC8vIElzIHRoZSBzdHVkZW50IGZyb20gSG9zdFNjaG9vbD9cclxuICAgICAgJHNjb3BlLmlzSG9zdFNjaG9vbCA9ICRzY29wZS51c2VyLmVtYWlsLnNwbGl0KCdAJylbMV0gPT0gc2V0dGluZ3MuZGF0YS5ob3N0U2Nob29sO1xyXG5cclxuICAgICAgLy8gSWYgc28sIGRlZmF1bHQgdGhlbSB0byBhZHVsdDogdHJ1ZVxyXG4gICAgICBpZiAoJHNjb3BlLmlzSG9zdFNjaG9vbCkge1xyXG4gICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUuYWR1bHQgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQb3B1bGF0ZSB0aGUgc2Nob29sIGRyb3Bkb3duXHJcbiAgICAgIHBvcHVsYXRlU2Nob29scygpO1xyXG4gICAgICBfc2V0dXBGb3JtKCk7XHJcblxyXG4gICAgICBwb3B1bGF0ZVdpbGF5YXMoKTtcclxuICAgICAgcG9wdWxhdGVDbHVicygpO1xyXG5cclxuICAgICAgJHNjb3BlLnJlZ0lzQ2xvc2VkID0gRGF0ZS5ub3coKSA+IHNldHRpbmdzLmRhdGEudGltZUNsb3NlO1xyXG5cclxuICAgICAgZnVuY3Rpb24gcG9wdWxhdGVTY2hvb2xzKCkge1xyXG4gICAgICAgICRodHRwXHJcbiAgICAgICAgICAuZ2V0KCcvYXNzZXRzL3NjaG9vbHMuanNvbicpXHJcbiAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIHZhciBzY2hvb2xzID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgIHZhciBlbWFpbCA9ICRzY29wZS51c2VyLmVtYWlsLnNwbGl0KCdAJylbMV07XHJcblxyXG4gICAgICAgICAgICBpZiAoc2Nob29sc1tlbWFpbF0pIHtcclxuICAgICAgICAgICAgICAkc2NvcGUudXNlci5wcm9maWxlLnNjaG9vbCA9IHNjaG9vbHNbZW1haWxdLnNjaG9vbDtcclxuICAgICAgICAgICAgICAkc2NvcGUuYXV0b0ZpbGxlZFNjaG9vbCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkaHR0cFxyXG4gICAgICAgICAgLmdldCgnL2Fzc2V0cy9zY2hvb2xzLmNzdicpXHJcbiAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5zY2hvb2xzID0gcmVzLmRhdGEuc3BsaXQoJ1xcbicpO1xyXG4gICAgICAgICAgICAkc2NvcGUuc2Nob29scy5wdXNoKCdPdGhlcicpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCAkc2NvcGUuc2Nob29scy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICRzY29wZS5zY2hvb2xzW2ldID0gJHNjb3BlLnNjaG9vbHNbaV0udHJpbSgpO1xyXG4gICAgICAgICAgICAgIGNvbnRlbnQucHVzaCh7IHRpdGxlOiAkc2NvcGUuc2Nob29sc1tpXSB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKCcjc2Nob29sLnVpLnNlYXJjaCcpXHJcbiAgICAgICAgICAgICAgLnNlYXJjaCh7XHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IGNvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbiAocmVzdWx0LCByZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAkc2NvcGUudXNlci5wcm9maWxlLnNjaG9vbCA9IHJlc3VsdC50aXRsZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgZnVuY3Rpb24gcG9wdWxhdGVXaWxheWFzKCkge1xyXG4gICAgICAgICRodHRwXHJcbiAgICAgICAgICAuZ2V0KCcvYXNzZXRzL3dpbGF5YXMuY3N2JylcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgJHNjb3BlLndpbGF5YXMgPSByZXMuZGF0YS5zcGxpdCgnXFxuJyk7XHJcbiAgICAgICAgICAgICRzY29wZS53aWxheWFzLnB1c2goJ090aGVyJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8ICRzY29wZS53aWxheWFzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLndpbGF5YXNbaV0gPSAkc2NvcGUud2lsYXlhc1tpXS50cmltKCk7XHJcbiAgICAgICAgICAgICAgY29udGVudC5wdXNoKHsgdGl0bGU6ICRzY29wZS53aWxheWFzW2ldIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoJyN3aWxheWEudWkuc2VhcmNoJylcclxuICAgICAgICAgICAgICAuc2VhcmNoKHtcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogY29udGVudCxcclxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uIChyZXN1bHQsIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUud2lsYXlhID0gcmVzdWx0LnRpdGxlLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICBmdW5jdGlvbiBwb3B1bGF0ZUNsdWJzKCkge1xyXG4gICAgICAgICRodHRwXHJcbiAgICAgICAgICAuZ2V0KCcvYXNzZXRzL2NsdWJzLmNzdicpXHJcbiAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5jbHVicyA9IHJlcy5kYXRhLnNwbGl0KCdcXG4nKTtcclxuICAgICAgICAgICAgJHNjb3BlLmNsdWJzLnB1c2goJ090aGVyJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8ICRzY29wZS5jbHVicy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICRzY29wZS5jbHVic1tpXSA9ICRzY29wZS5jbHVic1tpXS50cmltKCk7XHJcbiAgICAgICAgICAgICAgY29udGVudC5wdXNoKHsgdGl0bGU6ICRzY29wZS5jbHVic1tpXSB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKCcjY2x1Yi51aS5zZWFyY2gnKVxyXG4gICAgICAgICAgICAgIC5zZWFyY2goe1xyXG4gICAgICAgICAgICAgICAgc291cmNlOiBjb250ZW50LFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24gKHJlc3VsdCwgcmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsdWIgPSByZXN1bHQudGl0bGUudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICBpZiAoJHNjb3BlLnVzZXIucHJvZmlsZS5zb3VyY2UgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAkc2NvcGUuVXNlclNvdXJjZSA9ICRzY29wZS51c2VyLnByb2ZpbGUuc291cmNlLnNwbGl0KCcjJylbMF07XHJcbiAgICAgICAgICAkc2NvcGUuY2x1YiA9ICRzY29wZS51c2VyLnByb2ZpbGUuc291cmNlLnNwbGl0KCcjJylbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgZnVuY3Rpb24gcmVtb3ZlRHVwbGljYXRlcyhteUFyciwgcHJvcCkge1xyXG4gICAgICAgIHJldHVybiBteUFyci5maWx0ZXIoKG9iaiwgcG9zLCBhcnIpID0+IHtcclxuICAgICAgICAgIHJldHVybiBhcnIubWFwKG1hcE9iaiA9PiBtYXBPYmpbcHJvcF0pLmluZGV4T2Yob2JqW3Byb3BdKSA9PT0gcG9zO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBzZW5kTWFya2V0aW5nRW1haWxzKCkge1xyXG4gICAgICAgIE1hcmtldGluZ1NlcnZpY2UuZ2V0QWxsKCkudGhlbih0ZWFtcyA9PiB7XHJcbiAgICAgICAgICB2YXIgZW1haWxzID0gW107XHJcbiAgICAgICAgICB0ZWFtcy5kYXRhLmZvckVhY2godGVhbSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBpc1RlYW1tYXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRlYW0ubWVtYmVycy5mb3JFYWNoKG1lbWJlciA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKG1lbWJlciA9PSBjdXJyZW50VXNlci5kYXRhLmVtYWlsKSB7XHJcbiAgICAgICAgICAgICAgICBpc1RlYW1tYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoaXNUZWFtbWF0ZSkge1xyXG4gICAgICAgICAgICAgIHRlYW0ubWVtYmVycy5mb3JFYWNoKG1lbWJlciA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIShtZW1iZXIgPT0gY3VycmVudFVzZXIuZGF0YS5lbWFpbCkpIHtcclxuICAgICAgICAgICAgICAgICAgZW1haWxzLnB1c2goeyBlbWFpbDogbWVtYmVyLCBldmVudDogdGVhbS5ldmVudCB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJlbW92ZUR1cGxpY2F0ZXMoZW1haWxzLCAnZW1haWwnKS5mb3JFYWNoKHRlYW1tYXRlID0+IHtcclxuICAgICAgICAgICAgTWFya2V0aW5nU2VydmljZS5zZW5kRnJpZW5kSW52aXRlKGN1cnJlbnRVc2VyLmRhdGEucHJvZmlsZS5uYW1lLCB0ZWFtbWF0ZSlcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICBmdW5jdGlvbiBfdXBkYXRlVXNlcihlKSB7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgVXNlcidzIGZpcnN0IHN1Ym1pc3Npb25cclxuICAgICAgICB2YXIgc2VuZE1haWwgPSB0cnVlO1xyXG4gICAgICAgIGlmIChjdXJyZW50VXNlci5kYXRhLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlKSB7IHNlbmRNYWlsID0gZmFsc2UgfVxyXG5cclxuICAgICAgICAvLyBHZXQgdXNlciBTb3VyY2VcclxuICAgICAgICBpZiAoJHNjb3BlLlVzZXJTb3VyY2UgIT0gJzInKSB7ICRzY29wZS51c2VyLnByb2ZpbGUuc291cmNlID0gJHNjb3BlLlVzZXJTb3VyY2UgfVxyXG4gICAgICAgIGVsc2UgeyAkc2NvcGUudXNlci5wcm9maWxlLnNvdXJjZSA9ICRzY29wZS5Vc2VyU291cmNlICsgXCIjXCIgKyAkc2NvcGUuY2x1YiB9XHJcblxyXG4gICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlUHJvZmlsZShTZXNzaW9uLmdldFVzZXJJZCgpLCAkc2NvcGUudXNlci5wcm9maWxlKVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFwiQXdlc29tZSFcIiwgXCJZb3VyIGFwcGxpY2F0aW9uIGhhcyBiZWVuIHNhdmVkLlwiLCBcInN1Y2Nlc3NcIikudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKHNlbmRNYWlsKSB7IHNlbmRNYXJrZXRpbmdFbWFpbHMoKTsgfVxyXG4gICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5kYXNoYm9hcmRcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFwiVWggb2ghXCIsIFwiU29tZXRoaW5nIHdlbnQgd3JvbmcuXCIsIFwiZXJyb3JcIik7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGlzTWlub3IoKSB7XHJcbiAgICAgICAgcmV0dXJuICEkc2NvcGUudXNlci5wcm9maWxlLmFkdWx0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBtaW5vcnNBcmVBbGxvd2VkKCkge1xyXG4gICAgICAgIHJldHVybiBzZXR0aW5ncy5kYXRhLmFsbG93TWlub3JzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBtaW5vcnNWYWxpZGF0aW9uKCkge1xyXG4gICAgICAgIC8vIEFyZSBtaW5vcnMgYWxsb3dlZCB0byByZWdpc3Rlcj9cclxuICAgICAgICBpZiAoaXNNaW5vcigpICYmICFtaW5vcnNBcmVBbGxvd2VkKCkpIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIF9zZXR1cEZvcm0oKSB7XHJcbiAgICAgICAgLy8gQ3VzdG9tIG1pbm9ycyB2YWxpZGF0aW9uIHJ1bGVcclxuICAgICAgICAkLmZuLmZvcm0uc2V0dGluZ3MucnVsZXMuYWxsb3dNaW5vcnMgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybiBtaW5vcnNWYWxpZGF0aW9uKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gU2VtYW50aWMtVUkgZm9ybSB2YWxpZCBhdGlvblxyXG4gICAgICAgICQoJy51aS5mb3JtJykuZm9ybSh7XHJcbiAgICAgICAgICBvbjogJ2JsdXInLFxyXG4gICAgICAgICAgaW5saW5lOiB0cnVlLFxyXG4gICAgICAgICAgZmllbGRzOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnbmFtZScsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIHlvdXIgbmFtZS4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzY2hvb2w6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnc2Nob29sJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgeW91ciBzY2hvb2wgbmFtZS4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBXaWxheWE6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnV2lsYXlhJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgeW91ciB3aWxheWEgbmFtZS4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB5ZWFyOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3llYXInLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBzZWxlY3QgeW91ciBncmFkdWF0aW9uIHllYXIuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2VuZGVyOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2dlbmRlcicsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHNlbGVjdCBhIGdlbmRlci4gJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaG93TWFueUhhY2thdGhvbnM6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnaG93TWFueUhhY2thdGhvbnMnLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBzZWxlY3QgaG93IG1hbnkgaGFja2F0aG9ucyB5b3UgaGF2ZSBhdHRlbmRlZC4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZHVsdDoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdhZHVsdCcsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2FsbG93TWlub3JzJyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnWW91IG11c3QgYmUgYW4gYWR1bHQsIG9yIGFuIEVTSSBzdHVkZW50LidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0dWR5OiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3N0dWR5JyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgeW91ciBtYWpvciAuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnZGVzY3JpcHRpb24nLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBkZXNjcmliZSB5b3Vyc2VsZiAuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXNzYXk6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnZXNzYXknLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSB0ZWxsIHVzIGFib3V0IHlvdXIgbW90aXZhdGlvbiAuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGlua2VkaW46IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnbGlua2VkaW4nLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICd1cmwnLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBMaW5rZWRpbiBVUkwgLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhY2Vib29rOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2ZhY2Vib29rJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAndXJsJyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgRmFjZWJvb2sgVVJMIC4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnaXRodWI6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnZ2l0aHViJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAndXJsJyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgR2l0SHViIFVSTCAuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgVXNlclNvdXJjZToge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdVc2VyU291cmNlJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdIb3cgZGlkIHlvdSBoZWFyIGFib3V0IHVzID8nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjdkxpbms6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnY3ZMaW5rJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAndXJsJyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnWW91IG11c3QgYWRkIGEgbGluayB0byB5b3VyIENWLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLnN1Ym1pdEZvcm0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQoJy51aS5mb3JtJykuZm9ybSgnaXMgdmFsaWQnKSkge1xyXG4gICAgICAgICAgLy8gJCgnLnVpLnN1Ym1pdC5idXR0b24nKS5jbGljaygpO1xyXG4gICAgICAgICAgX3VwZGF0ZVVzZXIoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3dhbChcIlVoIG9oIVwiLCBcIlBsZWFzZSBGaWxsIFRoZSBSZXF1aXJlZCBGaWVsZHNcIiwgXCJlcnJvclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdhZG1pbkN0cmwnLCBbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsIFVzZXJTZXJ2aWNlKXtcclxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdDaGFsbGVuZ2VzQ3RybCcsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnJGh0dHAnLFxyXG4gICAgJ2N1cnJlbnRVc2VyJyxcclxuICAgICdTZXNzaW9uJyxcclxuICAgICdDaGFsbGVuZ2VTZXJ2aWNlJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICAnU29sdmVkQ1RGU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJGh0dHAsIGN1cnJlbnRVc2VyLCBTZXNzaW9uLCBDaGFsbGVuZ2VTZXJ2aWNlLCBVc2VyU2VydmljZSwgU29sdmVkQ1RGU2VydmljZSkge1xyXG5cclxuICAgICAgXHJcbiAgICAgIFNvbHZlZENURlNlcnZpY2UuZ2V0QWxsKCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgc29sdmVkQ2hhbGxlbmdlcz0gcmVzcG9uc2UuZGF0YS5maWx0ZXIocyA9PiBzLnVzZXI9PWN1cnJlbnRVc2VyLmRhdGEuX2lkKVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIFxyXG5cclxuICAgICAgQ2hhbGxlbmdlU2VydmljZS5nZXRBbGwoKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAkc2NvcGUuY2hhbGxlbmdlcyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgIH0pO1xyXG5cclxuXHJcblxyXG4gICAgICBmdW5jdGlvbiBvblN1Y2Nlc3MoY2hhbGxlbmdlKSB7XHJcbiAgICAgICAgc3dhbChcIkF3ZXNvbWUhXCIsIFwiVGhhdCdzIGNvcnJlY3QsIGFuZCB5b3UganVzdCBlYXJuZWQgK1wiKyBjaGFsbGVuZ2UucG9pbnRzICtcIiBwb2ludHMuXCIsIFwic3VjY2Vzc1wiKVxyXG4gICAgICAgICRzdGF0ZS5yZWxvYWQoKVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gb25FcnJvcihkYXRhKXtcclxuICAgICAgICBzd2FsKFwiVHJ5IGFnYWluIVwiLCBkYXRhLm1lc3NhZ2UsIFwiZXJyb3JcIikgXHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAkc2NvcGUuc29sdmVDaGFsbGVuZ2UgPSBmdW5jdGlvbihjaGFsbGVuZ2UsYW5zd2VyLCBpc2VudGVyKSB7XHJcbiAgICAgICAgaWYgKGlzZW50ZXIpe1xyXG4gICAgICAgICAgU29sdmVkQ1RGU2VydmljZS5zb2x2ZShjaGFsbGVuZ2UsY3VycmVudFVzZXIsYW5zd2VyLG9uU3VjY2VzcyxvbkVycm9yKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIFNvbHZlZENURlNlcnZpY2Uuc29sdmUoY2hhbGxlbmdlLGN1cnJlbnRVc2VyLGFuc3dlcixvblN1Y2Nlc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgfVxyXG5cclxuICAgICAgXHJcbiAgICAgICRzY29wZS5zaG93Q2hhbGxlbmdlID0gZnVuY3Rpb24oY2hhbGxlbmdlKSB7XHJcblxyXG4gICAgICAgIENoYWxsZW5nZVNlcnZpY2UuZ2V0KGNoYWxsZW5nZS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG5cclxuICAgICAgICAgIHN3YWwocmVzcG9uc2UuZGF0YS50aXRsZSwgcmVzcG9uc2UuZGF0YS5kZXNjcmlwdGlvbilcclxuXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgICAgU29sdmVkQ1RGU2VydmljZS5nZXRBbGwoKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICBhbGxDaGFsbGVuZ2VzPSByZXNwb25zZS5kYXRhXHJcbiAgICAgICAgdmFyIFJlc3VsdCA9W11cclxuXHJcbiAgICAgICAgYWxsQ2hhbGxlbmdlcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgdXNlckNoYWxsZW5nZXMgPSBhbGxDaGFsbGVuZ2VzLmZpbHRlcihzID0+IHMudXNlcj09ZWxlbWVudC51c2VyKVxyXG4gICAgICAgICAgdmFyIHBvaW50c0NvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICB1c2VyQ2hhbGxlbmdlcy5mb3JFYWNoKGNoYWxsZW5nZSA9PiB7IHBvaW50c0NvdW50Kz1jaGFsbGVuZ2UucG9pbnRzIH0pO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBVc2VyU2VydmljZS5nZXQoZWxlbWVudC51c2VyKS50aGVuKHVzZXIgPT57XHJcblxyXG4gICAgICAgICAgICB2YXIgZ3JhZGU9W11cclxuICAgICAgICAgICAgZ3JhZGVbMjAxOV0gPSBcIjNDU1wiXHJcbiAgICAgICAgICAgIGdyYWRlWzIwMjBdID0gXCIyQ1NcIlxyXG4gICAgICAgICAgICBncmFkZVsyMDIxXSA9IFwiMUNTXCJcclxuICAgICAgICAgICAgZ3JhZGVbMjAyMl0gPSBcIjJDUFwiXHJcbiAgICAgICAgICAgIGdyYWRlWzIwMjNdID0gXCIxQ1BcIlxyXG5cclxuICAgICAgICAgICAgaWYgKHBvaW50c0NvdW50PjApIHtSZXN1bHQucHVzaCh7IGlkOnVzZXIuZGF0YS5faWQsIG5hbWU6IHVzZXIuZGF0YS5wcm9maWxlLm5hbWUsIGdyYWRlOiBncmFkZVt1c2VyLmRhdGEucHJvZmlsZS5ncmFkdWF0aW9uWWVhcl0gLHBvaW50czogcG9pbnRzQ291bnR9KX1cclxuXHJcbiAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgIGFsbENoYWxsZW5nZXMgPSBhbGxDaGFsbGVuZ2VzLmZpbHRlcihzID0+IHMudXNlciE9PWVsZW1lbnQudXNlcilcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLlJlc3VsdCA9IFJlc3VsdDtcclxuICAgICAgfSk7XHJcbiAgICBcclxuXHJcbiAgICAgICRzY29wZS5yb3dDbGFzcyA9IGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodXNlci5pZD09Y3VycmVudFVzZXIuZGF0YS5faWQpIHtcclxuICAgICAgICAgIHJldHVybiBcImFkbWluXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gIFxyXG4gICAgICBcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4uY29udHJvbGxlcignQ2hlY2tpbkN0cmwnLCBbXHJcbiAgJyRzY29wZScsXHJcbiAgJyRzdGF0ZScsXHJcbiAgJyRzdGF0ZVBhcmFtcycsXHJcbiAgJ1VzZXJTZXJ2aWNlJyxcclxuICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBVc2VyU2VydmljZSl7XHJcbiAgICAkKCcjcmVhZGVyJykuaHRtbDVfcXJjb2RlKGZ1bmN0aW9uKHVzZXJJRCl7XHJcbiAgICAgICAgICAvL0NoYW5nZSB0aGUgaW5wdXQgZmllbGRzIHZhbHVlIGFuZCBzZW5kIHBvc3QgcmVxdWVzdCB0byB0aGUgYmFja2VuZFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBVc2VyU2VydmljZS5nZXQodXNlcklEKS50aGVuKHJlc3BvbnNlID0+IHtcclxuXHJcbiAgICAgICAgICAgIHVzZXIgPXJlc3BvbnNlLmRhdGE7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXVzZXIuc3RhdHVzLmNoZWNrZWRJbikge1xyXG4gICAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBjaGVjayBpbiBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIhXCIsXHJcbiAgICAgICAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBjaGVjayB0aGVtIGluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZS5jaGVja0luKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgJHNjb3BlLnF1ZXJ5VGV4dCA9IHVzZXIuZW1haWw7XHJcbiAgICAgICAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgICAgICAgXCJDaGVja2VkIGluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlci5wcm9maWxlLm5hbWUgKyBcIiBoYXMgYmVlbiBjaGVja2VkIGluLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgXCJBbHJlYWR5IGNoZWNrZWRJblwiLFxyXG4gICAgICAgICAgICAgICAgdXNlci5wcm9maWxlLm5hbWUgKyBcIiBoYXMgYmVlbiBjaGVja2VkLWluIGF0OiBcIisgZm9ybWF0VGltZSh1c2VyLnN0YXR1cy5jaGVja0luVGltZSksXHJcbiAgICAgICAgICAgICAgICBcIndhcm5pbmdcIlxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICB9LCBmdW5jdGlvbih2aWRlb0Vycm9yKXtcclxuICAgICAgICAvL3RoZSB2aWRlbyBzdHJlYW0gY291bGQgYmUgb3BlbmVkXHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgICAkc2NvcGUucGFnZXMgPSBbXTtcclxuICAgICRzY29wZS51c2VycyA9IFtdO1xyXG4gICAgJHNjb3BlLnNvcnRCeSA9ICd0aW1lc3RhbXAnXHJcbiAgICAkc2NvcGUuc29ydERpciA9IGZhbHNlXHJcblxyXG4gICAgJHNjb3BlLmZpbHRlciA9IGRlc2VyaWFsaXplRmlsdGVycygkc3RhdGVQYXJhbXMuZmlsdGVyKTtcclxuICAgICRzY29wZS5maWx0ZXIudGV4dCA9ICRzdGF0ZVBhcmFtcy5xdWVyeSB8fCBcIlwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIGRlc2VyaWFsaXplRmlsdGVycyh0ZXh0KSB7XHJcbiAgICAgIHZhciBvdXQgPSB7fTtcclxuICAgICAgaWYgKCF0ZXh0KSByZXR1cm4gb3V0O1xyXG4gICAgICB0ZXh0LnNwbGl0KFwiLFwiKS5mb3JFYWNoKGZ1bmN0aW9uKGYpe291dFtmXT10cnVlfSk7XHJcbiAgICAgIHJldHVybiAodGV4dC5sZW5ndGg9PT0wKT97fTpvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2VyaWFsaXplRmlsdGVycyhmaWx0ZXJzKSB7XHJcbiAgICAgIHZhciBvdXQgPSBcIlwiO1xyXG4gICAgICBmb3IgKHZhciB2IGluIGZpbHRlcnMpIHtpZih0eXBlb2YoZmlsdGVyc1t2XSk9PT1cImJvb2xlYW5cIiYmZmlsdGVyc1t2XSkgb3V0ICs9IHYrXCIsXCI7fVxyXG4gICAgICByZXR1cm4gKG91dC5sZW5ndGg9PT0wKT9cIlwiOm91dC5zdWJzdHIoMCxvdXQubGVuZ3RoLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNlbWFudGljLVVJIG1vdmVzIG1vZGFsIGNvbnRlbnQgaW50byBhIGRpbW1lciBhdCB0aGUgdG9wIGxldmVsLlxyXG4gICAgLy8gV2hpbGUgdGhpcyBpcyB1c3VhbGx5IG5pY2UsIGl0IG1lYW5zIHRoYXQgd2l0aCBvdXIgcm91dGluZyB3aWxsIGdlbmVyYXRlXHJcbiAgICAvLyBtdWx0aXBsZSBtb2RhbHMgaWYgeW91IGNoYW5nZSBzdGF0ZS4gS2lsbCB0aGUgdG9wIGxldmVsIGRpbW1lciBub2RlIG9uIGluaXRpYWwgbG9hZFxyXG4gICAgLy8gdG8gcHJldmVudCB0aGlzLlxyXG4gICAgJCgnLnVpLmRpbW1lcicpLnJlbW92ZSgpO1xyXG4gICAgLy8gUG9wdWxhdGUgdGhlIHNpemUgb2YgdGhlIG1vZGFsIGZvciB3aGVuIGl0IGFwcGVhcnMsIHdpdGggYW4gYXJiaXRyYXJ5IHVzZXIuXHJcbiAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0ge307XHJcbiAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh7XHJcbiAgICAgIHN0YXR1czogXCJcIixcclxuICAgICAgY29uZmlybWF0aW9uOiB7XHJcbiAgICAgICAgZGlldGFyeVJlc3RyaWN0aW9uczogW11cclxuICAgICAgfSxcclxuICAgICAgcHJvZmlsZTogXCJcIlxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlUGFnZShkYXRhKSB7XHJcbiAgICAgICRzY29wZS51c2VycyA9IGRhdGEudXNlcnM7XHJcbiAgICAgICRzY29wZS5jdXJyZW50UGFnZSA9IGRhdGEucGFnZTtcclxuICAgICAgJHNjb3BlLnBhZ2VTaXplID0gZGF0YS5zaXplO1xyXG5cclxuICAgICAgdmFyIHAgPSBbXTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLnRvdGFsUGFnZXM7IGkrKykge1xyXG4gICAgICAgIHAucHVzaChpKTtcclxuICAgICAgfVxyXG4gICAgICAkc2NvcGUucGFnZXMgPSBwO1xyXG4gICAgfVxyXG5cclxuICAgIFVzZXJTZXJ2aWNlLmdldFBhZ2UoJHN0YXRlUGFyYW1zLnBhZ2UsICRzdGF0ZVBhcmFtcy5zaXplLCAkc3RhdGVQYXJhbXMucXVlcnksICRzY29wZS5zdGF0dXNGaWx0ZXJzKVxyXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG5cclxuICAgICAgdXBkYXRlUGFnZShyZXNwb25zZS5kYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS4kd2F0Y2goXCJxdWVyeVRleHRcIiwgZnVuY3Rpb24ocXVlcnlUZXh0KSB7XHJcbiAgICAgIFVzZXJTZXJ2aWNlLmdldFBhZ2UoJHN0YXRlUGFyYW1zLnBhZ2UsICRzdGF0ZVBhcmFtcy5zaXplLCBxdWVyeVRleHQsICRzY29wZS5zdGF0dXNGaWx0ZXJzKS50aGVuKFxyXG4gICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgIHVwZGF0ZVBhZ2UocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgICRzY29wZS5hcHBseVN0YXR1c0ZpbHRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAuZ2V0UGFnZSgkc3RhdGVQYXJhbXMucGFnZSwgJHN0YXRlUGFyYW1zLnNpemUsICRzY29wZS5xdWVyeVRleHQsICRzY29wZS5zdGF0dXNGaWx0ZXJzKS50aGVuKFxyXG4gICAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICB1cGRhdGVQYWdlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgJHNjb3BlLmdvVG9QYWdlID0gZnVuY3Rpb24ocGFnZSkge1xyXG4gICAgICAkc3RhdGUuZ28oXCJhcHAuYWRtaW4udXNlcnNcIiwge1xyXG4gICAgICAgIHBhZ2U6IHBhZ2UsXHJcbiAgICAgICAgc2l6ZTogJHN0YXRlUGFyYW1zLnNpemUgfHwgMjBcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jaGVja0luID0gZnVuY3Rpb24oJGV2ZW50LCB1c2VyLCBpbmRleCkge1xyXG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICBpZiAoIXVzZXIuc3RhdHVzLmNoZWNrZWRJbikge1xyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBjaGVjayBpbiBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIhXCIsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBjaGVjayB0aGVtIGluXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBVc2VyU2VydmljZS5jaGVja0luKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJDaGVja2VkIGluXCIsXHJcbiAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5wcm9maWxlLm5hbWUgKyBcIiBoYXMgYmVlbiBjaGVja2VkIGluLlwiLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHN3YWwoXHJcbiAgICAgICAgICBcIkFscmVhZHkgY2hlY2tlZEluXCIsXHJcbiAgICAgICAgICB1c2VyLnByb2ZpbGUubmFtZSArIFwiIGhhcyBiZWVuIGNoZWNrZWQtaW4gYXQ6IFwiKyBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNoZWNrSW5UaW1lKSxcclxuICAgICAgICAgIFwid2FybmluZ1wiXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBmb3JtYXRUaW1lKHRpbWUpIHtcclxuICAgICAgaWYgKHRpbWUpIHtcclxuICAgICAgICByZXR1cm4gbW9tZW50KHRpbWUpLmZvcm1hdChcIk1NTU0gRG8gWVlZWSwgaDptbTpzcyBhXCIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnJvd0NsYXNzID0gZnVuY3Rpb24odXNlcikge1xyXG4gICAgICBpZiAodXNlci5hZG1pbikge1xyXG4gICAgICAgIHJldHVybiBcImFkbWluXCI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVzZXIuc3RhdHVzLmNvbmZpcm1lZCkge1xyXG4gICAgICAgIHJldHVybiBcInBvc2l0aXZlXCI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmICF1c2VyLnN0YXR1cy5jb25maXJtZWQpIHtcclxuICAgICAgICByZXR1cm4gXCJ3YXJuaW5nXCI7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gc2VsZWN0VXNlcih1c2VyKSB7XHJcbiAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSB1c2VyO1xyXG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKTtcclxuICAgICAgJChcIi5sb25nLnVzZXIubW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlU2VjdGlvbnModXNlcikge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6IFwiQmFzaWMgSW5mb1wiLFxyXG4gICAgICAgICAgZmllbGRzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkNyZWF0ZWQgT25cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLnRpbWVzdGFtcClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiTGFzdCBVcGRhdGVkXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5sYXN0VXBkYXRlZClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiQ29uZmlybSBCeVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSkgfHwgXCJOL0FcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJDaGVja2VkIEluXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY2hlY2tJblRpbWUpIHx8IFwiTi9BXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiRW1haWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5lbWFpbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiBcIlByb2ZpbGVcIixcclxuICAgICAgICAgIGZpZWxkczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJOYW1lXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5uYW1lXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdlbmRlclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ2VuZGVyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIlNjaG9vbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuc2Nob29sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdyYWR1YXRpb24gWWVhclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ3JhZHVhdGlvblllYXJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiSGFja2F0aG9ucyB2aXNpdGVkXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5ob3dNYW55SGFja2F0aG9uc1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJEZXNjcmlwdGlvblwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiRXNzYXlcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmVzc2F5XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIk1ham9yXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5tYWpvclxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJHaXRodWJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdpdGh1YlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJGYWNlYm9va1wiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZmFjZWJvb2tcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiTGlua2VkaW5cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmxpbmtlZGluXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6IFwiQ29uZmlybWF0aW9uXCIsXHJcbiAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiUGhvbmUgTnVtYmVyXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLnBob25lTnVtYmVyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIk5lZWRzIEhhcmR3YXJlXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLndhbnRzSGFyZHdhcmUsXHJcbiAgICAgICAgICAgICAgdHlwZTogXCJib29sZWFuXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiSGFyZHdhcmUgUmVxdWVzdGVkXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmhhcmR3YXJlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6IFwiVHJhdmVsXCIsXHJcbiAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiQWRkaXRpb25hbCBOb3Rlc1wiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5ub3Rlc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICBdO1xyXG4gICAgfVxyXG4gICAgJHNjb3BlLnNlbGVjdFVzZXIgPSBzZWxlY3RVc2VyO1xyXG4gIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignQ29uZmlybWF0aW9uQ3RybCcsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnY3VycmVudFVzZXInLFxyXG4gICAgJ1V0aWxzJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgY3VycmVudFVzZXIsIFV0aWxzLCBVc2VyU2VydmljZSl7XHJcblxyXG4gICAgICAvLyBTZXQgdXAgdGhlIHVzZXJcclxuICAgICAgdmFyIHVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xyXG4gICAgICAkc2NvcGUudXNlciA9IHVzZXI7XHJcblxyXG4gICAgICAkc2NvcGUucGFzdENvbmZpcm1hdGlvbiA9IERhdGUubm93KCkgPiB1c2VyLnN0YXR1cy5jb25maXJtQnk7XHJcblxyXG4gICAgICAkc2NvcGUuZm9ybWF0VGltZSA9IFV0aWxzLmZvcm1hdFRpbWU7XHJcblxyXG4gICAgICBfc2V0dXBGb3JtKCk7XHJcblxyXG4gICAgICAkc2NvcGUuZmlsZU5hbWUgPSB1c2VyLl9pZCArIFwiX1wiICsgdXNlci5wcm9maWxlLm5hbWUuc3BsaXQoXCIgXCIpLmpvaW4oXCJfXCIpO1xyXG5cclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAvLyBBbGwgdGhpcyBqdXN0IGZvciBkaWV0YXJ5IHJlc3RyaWN0aW9uIGNoZWNrYm94ZXMgZm1sXHJcblxyXG4gICAgICB2YXIgZGlldGFyeVJlc3RyaWN0aW9ucyA9IHtcclxuICAgICAgICAnVmVnZXRhcmlhbic6IGZhbHNlLFxyXG4gICAgICAgICdWZWdhbic6IGZhbHNlLFxyXG4gICAgICAgICdIYWxhbCc6IGZhbHNlLFxyXG4gICAgICAgICdLb3NoZXInOiBmYWxzZSxcclxuICAgICAgICAnTnV0IEFsbGVyZ3knOiBmYWxzZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgaWYgKHVzZXIuY29uZmlybWF0aW9uLmRpZXRhcnlSZXN0cmljdGlvbnMpe1xyXG4gICAgICAgIHVzZXIuY29uZmlybWF0aW9uLmRpZXRhcnlSZXN0cmljdGlvbnMuZm9yRWFjaChmdW5jdGlvbihyZXN0cmljdGlvbil7XHJcbiAgICAgICAgICBpZiAocmVzdHJpY3Rpb24gaW4gZGlldGFyeVJlc3RyaWN0aW9ucyl7XHJcbiAgICAgICAgICAgIGRpZXRhcnlSZXN0cmljdGlvbnNbcmVzdHJpY3Rpb25dID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLmRpZXRhcnlSZXN0cmljdGlvbnMgPSBkaWV0YXJ5UmVzdHJpY3Rpb25zO1xyXG5cclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgZnVuY3Rpb24gX3VwZGF0ZVVzZXIoZSl7XHJcbiAgICAgICAgdmFyIGNvbmZpcm1hdGlvbiA9ICRzY29wZS51c2VyLmNvbmZpcm1hdGlvbjtcclxuICAgICAgICAvLyBHZXQgdGhlIGRpZXRhcnkgcmVzdHJpY3Rpb25zIGFzIGFuIGFycmF5XHJcbiAgICAgICAgdmFyIGRycyA9IFtdO1xyXG4gICAgICAgIE9iamVjdC5rZXlzKCRzY29wZS5kaWV0YXJ5UmVzdHJpY3Rpb25zKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgICAgICBpZiAoJHNjb3BlLmRpZXRhcnlSZXN0cmljdGlvbnNba2V5XSl7XHJcbiAgICAgICAgICAgIGRycy5wdXNoKGtleSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uZmlybWF0aW9uLmRpZXRhcnlSZXN0cmljdGlvbnMgPSBkcnM7XHJcblxyXG4gICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlQ29uZmlybWF0aW9uKHVzZXIuX2lkLCBjb25maXJtYXRpb24pXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJXb28hXCIsIFwiWW91J3JlIGNvbmZpcm1lZCFcIiwgXCJzdWNjZXNzXCIpLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5kYXNoYm9hcmRcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFwiVWggb2ghXCIsIFwiU29tZXRoaW5nIHdlbnQgd3JvbmcuXCIsIFwiZXJyb3JcIik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gX3NldHVwRm9ybSgpe1xyXG4gICAgICAgIC8vIFNlbWFudGljLVVJIGZvcm0gdmFsaWRhdGlvblxyXG4gICAgICAgICQoJy51aS5mb3JtJykuZm9ybSh7XHJcbiAgICAgICAgICBmaWVsZHM6IHtcclxuICAgICAgICAgICAgc2hpcnQ6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnc2hpcnQnLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBnaXZlIHVzIGEgc2hpcnQgc2l6ZSEnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwaG9uZToge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdwaG9uZScsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIGEgcGhvbmUgbnVtYmVyLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNpZ25hdHVyZUNvZGVPZkNvbmR1Y3Q6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnc2lnbmF0dXJlQ29kZU9mQ29uZHVjdCcsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHR5cGUgeW91ciBkaWdpdGFsIHNpZ25hdHVyZS4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBuYXRpb25hbENhcmRJRDoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICduYXRpb25hbENhcmRJRCcsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHR5cGUgeW91ciBOYXRpb25hbCBDYXJkIElELidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5zdWJtaXRGb3JtID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBpZiAoJCgnLnVpLmZvcm0nKS5mb3JtKCdpcyB2YWxpZCcpKXtcclxuICAgICAgICAgIF91cGRhdGVVc2VyKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN3YWwoXCJVaCBvaCFcIiwgXCJQbGVhc2UgRmlsbCBUaGUgUmVxdWlyZWQgRmllbGRzXCIsIFwiZXJyb3JcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ0Rhc2hib2FyZEN0cmwnLCBbXHJcbiAgICAnJHJvb3RTY29wZScsXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICckc2NlJyxcclxuICAgICdjdXJyZW50VXNlcicsXHJcbiAgICAnc2V0dGluZ3MnLFxyXG4gICAgJ1V0aWxzJyxcclxuICAgICdBdXRoU2VydmljZScsXHJcbiAgICAnVXNlclNlcnZpY2UnLFxyXG4gICAgJ0VWRU5UX0lORk8nLFxyXG4gICAgJ0RBU0hCT0FSRCcsXHJcbiAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsICRzY2UsIGN1cnJlbnRVc2VyLCBzZXR0aW5ncywgVXRpbHMsIEF1dGhTZXJ2aWNlLCBVc2VyU2VydmljZSwgRVZFTlRfSU5GTywgREFTSEJPQVJEKXtcclxuICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcclxuICAgICAgdmFyIHVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xyXG4gICAgICAkc2NvcGUudXNlciA9IHVzZXI7XHJcbiAgICAgICRzY29wZS50aW1lQ2xvc2UgPSBVdGlscy5mb3JtYXRUaW1lKFNldHRpbmdzLnRpbWVDbG9zZSk7XHJcbiAgICAgICRzY29wZS50aW1lQ29uZmlybSA9IFV0aWxzLmZvcm1hdFRpbWUoU2V0dGluZ3MudGltZUNvbmZpcm0pO1xyXG5cclxuICAgICAgJHNjb3BlLkRBU0hCT0FSRCA9IERBU0hCT0FSRDtcclxuXHJcbiAgICAgIGZvciAodmFyIG1zZyBpbiAkc2NvcGUuREFTSEJPQVJEKSB7XHJcbiAgICAgICAgaWYgKCRzY29wZS5EQVNIQk9BUkRbbXNnXS5pbmNsdWRlcygnW0FQUF9ERUFETElORV0nKSkge1xyXG4gICAgICAgICAgJHNjb3BlLkRBU0hCT0FSRFttc2ddID0gJHNjb3BlLkRBU0hCT0FSRFttc2ddLnJlcGxhY2UoJ1tBUFBfREVBRExJTkVdJywgVXRpbHMuZm9ybWF0VGltZShTZXR0aW5ncy50aW1lQ2xvc2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCRzY29wZS5EQVNIQk9BUkRbbXNnXS5pbmNsdWRlcygnW0NPTkZJUk1fREVBRExJTkVdJykpIHtcclxuICAgICAgICAgICRzY29wZS5EQVNIQk9BUkRbbXNnXSA9ICRzY29wZS5EQVNIQk9BUkRbbXNnXS5yZXBsYWNlKCdbQ09ORklSTV9ERUFETElORV0nLCBVdGlscy5mb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSXMgcmVnaXN0cmF0aW9uIG9wZW4/XHJcbiAgICAgIHZhciByZWdJc09wZW4gPSAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcclxuXHJcbiAgICAgIC8vIElzIGl0IHBhc3QgdGhlIHVzZXIncyBjb25maXJtYXRpb24gdGltZT9cclxuICAgICAgdmFyIHBhc3RDb25maXJtYXRpb24gPSAkc2NvcGUucGFzdENvbmZpcm1hdGlvbiA9IFV0aWxzLmlzQWZ0ZXIodXNlci5zdGF0dXMuY29uZmlybUJ5KTtcclxuXHJcbiAgICAgICRzY29wZS5kYXNoU3RhdGUgPSBmdW5jdGlvbihzdGF0dXMpe1xyXG4gICAgICAgIHZhciB1c2VyID0gJHNjb3BlLnVzZXI7XHJcbiAgICAgICAgc3dpdGNoIChzdGF0dXMpIHtcclxuICAgICAgICAgIGNhc2UgJ3VudmVyaWZpZWQnOlxyXG4gICAgICAgICAgICByZXR1cm4gIXVzZXIudmVyaWZpZWQ7XHJcbiAgICAgICAgICBjYXNlICdvcGVuQW5kSW5jb21wbGV0ZSc6XHJcbiAgICAgICAgICAgIHJldHVybiByZWdJc09wZW4gJiYgdXNlci52ZXJpZmllZCAmJiAhdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZTtcclxuICAgICAgICAgIGNhc2UgJ29wZW5BbmRTdWJtaXR0ZWQnOlxyXG4gICAgICAgICAgICByZXR1cm4gcmVnSXNPcGVuICYmIHVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xyXG4gICAgICAgICAgY2FzZSAnY2xvc2VkQW5kSW5jb21wbGV0ZSc6XHJcbiAgICAgICAgICAgIHJldHVybiAhcmVnSXNPcGVuICYmICF1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcclxuICAgICAgICAgIGNhc2UgJ2Nsb3NlZEFuZFN1Ym1pdHRlZCc6IC8vIFdhaXRsaXN0ZWQgU3RhdGVcclxuICAgICAgICAgICAgcmV0dXJuICFyZWdJc09wZW4gJiYgdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSAmJiAhdXNlci5zdGF0dXMuYWRtaXR0ZWQ7XHJcbiAgICAgICAgICBjYXNlICdhZG1pdHRlZEFuZENhbkNvbmZpcm0nOlxyXG4gICAgICAgICAgICByZXR1cm4gIXBhc3RDb25maXJtYXRpb24gJiZcclxuICAgICAgICAgICAgICB1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJlxyXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5jb25maXJtZWQgJiZcclxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuZGVjbGluZWQ7XHJcbiAgICAgICAgICBjYXNlICdhZG1pdHRlZEFuZENhbm5vdENvbmZpcm0nOlxyXG4gICAgICAgICAgICByZXR1cm4gcGFzdENvbmZpcm1hdGlvbiAmJlxyXG4gICAgICAgICAgICAgIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmXHJcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmNvbmZpcm1lZCAmJlxyXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5kZWNsaW5lZDtcclxuICAgICAgICAgIGNhc2UgJ2NvbmZpcm1lZCc6XHJcbiAgICAgICAgICAgIHJldHVybiB1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJiB1c2VyLnN0YXR1cy5jb25maXJtZWQgJiYgIXVzZXIuc3RhdHVzLmRlY2xpbmVkO1xyXG4gICAgICAgICAgY2FzZSAnZGVjbGluZWQnOlxyXG4gICAgICAgICAgICByZXR1cm4gdXNlci5zdGF0dXMuZGVjbGluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zaG93V2FpdGxpc3QgPSAhcmVnSXNPcGVuICYmIHVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xyXG5cclxuICAgICAgJHNjb3BlLnJlc2VuZEVtYWlsID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBBdXRoU2VydmljZVxyXG4gICAgICAgICAgLnJlc2VuZFZlcmlmaWNhdGlvbkVtYWlsKClcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIkNoZWNrIHlvdXIgSW5ib3ghXCIsIFwiWW91ciBlbWFpbCBoYXMgYmVlbiBzZW50LlwiLCBcInN1Y2Nlc3NcIik7IFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gJHNjb3BlLnByaW50Q29uZmlybWF0aW9uID1mdW5jdGlvbihJbWFnZVVSTCl7XHJcblxyXG4gICAgICAvLyAgIGh0bWwyY2FudmFzKCQoJyNxckNvZGUnKSwge1xyXG4gICAgICAvLyAgICAgYWxsb3dUYWludDogdHJ1ZSxcclxuICAgICAgLy8gICAgIG9ucmVuZGVyZWQ6IGZ1bmN0aW9uIChjYW52YXMpIHtcclxuICAgICAgLy8gICAgICAgICB2YXIgaW1nRGF0YSA9IGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9qcGVnXCIsIDEuMCk7XHJcbiAgICAgIC8vICAgICAgICAgdmFyIHBkZiA9IG5ldyBqc1BERigncCcsICdtbScsICdhMCcpO1xyXG4gIFxyXG4gICAgICAvLyAgICAgICAgIHBkZi5hZGRJbWFnZShpbWdEYXRhLCAnSlBFRycsIDAsIDApO1xyXG4gICAgICAvLyAgICAgICAgIHBkZi5zYXZlKFwiQ3VycmVudCBEYXRhMi5wZGZcIilcclxuICAgICAgLy8gICAgIH1cclxuICAgICAgLy8gfSk7XHJcbiAgICAgIFxyXG4gICAgICAvLyB9XHJcblxyXG5cclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgLy8gVGV4dCFcclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgdmFyIGNvbnZlcnRlciA9IG5ldyBzaG93ZG93bi5Db252ZXJ0ZXIoKTtcclxuICAgICAgJHNjb3BlLmFjY2VwdGFuY2VUZXh0ID0gJHNjZS50cnVzdEFzSHRtbChjb252ZXJ0ZXIubWFrZUh0bWwoU2V0dGluZ3MuYWNjZXB0YW5jZVRleHQpKTtcclxuICAgICAgJHNjb3BlLmNvbmZpcm1hdGlvblRleHQgPSAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbChTZXR0aW5ncy5jb25maXJtYXRpb25UZXh0KSk7XHJcbiAgICAgICRzY29wZS53YWl0bGlzdFRleHQgPSAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbChTZXR0aW5ncy53YWl0bGlzdFRleHQpKTtcclxuXHJcbiAgICAgICRzY29wZS5kZWNsaW5lQWRtaXNzaW9uID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIldob2EhXCIsXHJcbiAgICAgICAgdGV4dDogXCJBcmUgeW91IHN1cmUgeW91IHdvdWxkIGxpa2UgdG8gZGVjbGluZSB5b3VyIGFkbWlzc2lvbj8gXFxuXFxuIFlvdSBjYW4ndCBnbyBiYWNrIVwiLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNvbmZpcm06IHtcclxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIEkgY2FuJ3QgbWFrZSBpdFwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIlxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgIC5kZWNsaW5lQWRtaXNzaW9uKHVzZXIuX2lkKVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdIb21lQ3RybCcsIFtcclxuICAgICckcm9vdFNjb3BlJyxcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRodHRwJyxcclxuICAgICckc3RhdGUnLFxyXG4gICAgJ3NldHRpbmdzJyxcclxuICAgICdVdGlscycsXHJcbiAgICAnQXV0aFNlcnZpY2UnLFxyXG4gICAgJ0VWRU5UX0lORk8nLFxyXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHN0YXRlLCBzZXR0aW5ncywgVXRpbHMsIEF1dGhTZXJ2aWNlLCBFVkVOVF9JTkZPKXtcclxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgJHNjb3BlLkVWRU5UX0lORk8gPSBFVkVOVF9JTkZPO1xyXG5cclxuICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcclxuICAgICAgJHNjb3BlLnJlZ0lzT3BlbiA9IFV0aWxzLmlzUmVnT3BlbihTZXR0aW5ncyk7XHJcblxyXG5cclxuICAgICAgLy8gSXMgcmVnaXN0cmF0aW9uIG9wZW4/XHJcbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XHJcbiAgICAgICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xyXG5cclxuICAgICAgLy8gU3RhcnQgc3RhdGUgZm9yIGxvZ2luXHJcbiAgICAgICRzY29wZS5sb2dpblN0YXRlID0gJ2xvZ2luJztcclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uU3VjY2VzcygpIHtcclxuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gb25FcnJvcihkYXRhKXtcclxuICAgICAgICAkc2NvcGUuZXJyb3IgPSBkYXRhLm1lc3NhZ2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHJlc2V0RXJyb3IoKXtcclxuICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJlc2V0RXJyb3IoKTtcclxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbldpdGhQYXNzd29yZChcclxuICAgICAgICAgICRzY29wZS5lbWFpbCwgJHNjb3BlLnBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXNldEVycm9yKCk7XHJcbiAgICAgICAgQXV0aFNlcnZpY2UucmVnaXN0ZXIoXHJcbiAgICAgICAgICAkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZCwgb25TdWNjZXNzLCBvbkVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zZXRMb2dpblN0YXRlID0gZnVuY3Rpb24oc3RhdGUpIHtcclxuICAgICAgICAkc2NvcGUubG9naW5TdGF0ZSA9IHN0YXRlO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnNlbmRSZXNldEVtYWlsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGVtYWlsID0gJHNjb3BlLmVtYWlsO1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLnNlbmRSZXNldEVtYWlsKGVtYWlsKTtcclxuICAgICAgICBzd2FsKFwiRG9uJ3Qgc3dlYXQhXCIsIFwiQW4gZW1haWwgc2hvdWxkIGJlIHNlbnQgdG8geW91IHNob3J0bHkuXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgfTtcclxuXHJcblxyXG5cclxuXHJcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignTG9naW5DdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJGh0dHAnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnc2V0dGluZ3MnLFxyXG4gICAgJ1V0aWxzJyxcclxuICAgICdBdXRoU2VydmljZScsXHJcbiAgICAnRVZFTlRfSU5GTycsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkc3RhdGUsIHNldHRpbmdzLCBVdGlscywgQXV0aFNlcnZpY2UsIEVWRU5UX0lORk8pe1xyXG5cclxuICAgICAgJHNjb3BlLkVWRU5UX0lORk8gPSBFVkVOVF9JTkZPO1xyXG5cclxuICAgICAgLy8gSXMgcmVnaXN0cmF0aW9uIG9wZW4/XHJcbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XHJcbiAgICAgICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xyXG5cclxuICAgICAgLy8gU3RhcnQgc3RhdGUgZm9yIGxvZ2luXHJcbiAgICAgICRzY29wZS5sb2dpblN0YXRlID0gJ2xvZ2luJztcclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uU3VjY2VzcygpIHtcclxuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gb25FcnJvcihkYXRhKXtcclxuICAgICAgICAkc2NvcGUuZXJyb3IgPSBkYXRhLm1lc3NhZ2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHJlc2V0RXJyb3IoKXtcclxuICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJlc2V0RXJyb3IoKTtcclxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbldpdGhQYXNzd29yZChcclxuICAgICAgICAgICRzY29wZS5lbWFpbCwgJHNjb3BlLnBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXNldEVycm9yKCk7XHJcbiAgICAgICAgQXV0aFNlcnZpY2UucmVnaXN0ZXIoXHJcbiAgICAgICAgICAkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZCwgb25TdWNjZXNzLCBvbkVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zZXRMb2dpblN0YXRlID0gZnVuY3Rpb24oc3RhdGUpIHtcclxuICAgICAgICAkc2NvcGUubG9naW5TdGF0ZSA9IHN0YXRlO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnNlbmRSZXNldEVtYWlsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGVtYWlsID0gJHNjb3BlLmVtYWlsO1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLnNlbmRSZXNldEVtYWlsKGVtYWlsKTtcclxuICAgICAgICBzd2FsKFwiRG9uJ3Qgc3dlYXQhXCIsIFwiQW4gZW1haWwgc2hvdWxkIGJlIHNlbnQgdG8geW91IHNob3J0bHkuXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgfTtcclxuXHJcbiAgICB9XHJcbiAgXSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdSZXNldEN0cmwnLCBbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICckc3RhdGVQYXJhbXMnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnQXV0aFNlcnZpY2UnLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSwgQXV0aFNlcnZpY2Upe1xyXG4gICAgICB2YXIgdG9rZW4gPSAkc3RhdGVQYXJhbXMudG9rZW47XHJcblxyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAkc2NvcGUuY2hhbmdlUGFzc3dvcmQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBwYXNzd29yZCA9ICRzY29wZS5wYXNzd29yZDtcclxuICAgICAgICB2YXIgY29uZmlybSA9ICRzY29wZS5jb25maXJtO1xyXG5cclxuICAgICAgICBpZiAocGFzc3dvcmQgIT09IGNvbmZpcm0pe1xyXG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gXCJQYXNzd29yZHMgZG9uJ3QgbWF0Y2ghXCI7XHJcbiAgICAgICAgICAkc2NvcGUuY29uZmlybSA9IFwiXCI7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBBdXRoU2VydmljZS5yZXNldFBhc3N3b3JkKFxyXG4gICAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgICAkc2NvcGUucGFzc3dvcmQsXHJcbiAgICAgICAgICBtZXNzYWdlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIk5lYXRvIVwiLCBcIllvdXIgcGFzc3dvcmQgaGFzIGJlZW4gY2hhbmdlZCFcIiwgXCJzdWNjZXNzXCIpLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICRzdGF0ZS5nbyhcImhvbWVcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBkYXRhLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5zZXJ2aWNlKCdzZXR0aW5ncycsIGZ1bmN0aW9uKCkge30pXHJcbiAgLmNvbnRyb2xsZXIoJ1NpZGViYXJDdHJsJywgW1xyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzY29wZScsXHJcbiAgICAnU2V0dGluZ3NTZXJ2aWNlJyxcclxuICAgICdVdGlscycsXHJcbiAgICAnQXV0aFNlcnZpY2UnLFxyXG4gICAgJ1Nlc3Npb24nLFxyXG4gICAgJ0VWRU5UX0lORk8nLFxyXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCBTZXR0aW5nc1NlcnZpY2UsIFV0aWxzLCBBdXRoU2VydmljZSwgU2Vzc2lvbiwgRVZFTlRfSU5GTyl7XHJcblxyXG4gICAgICB2YXIgdXNlciA9ICRyb290U2NvcGUuY3VycmVudFVzZXI7XHJcblxyXG4gICAgICAkc2NvcGUuRVZFTlRfSU5GTyA9IEVWRU5UX0lORk87XHJcblxyXG4gICAgICAkc2NvcGUucGFzdENvbmZpcm1hdGlvbiA9IFV0aWxzLmlzQWZ0ZXIodXNlci5zdGF0dXMuY29uZmlybUJ5KTtcclxuICAgICAgLy8kc2NvcGUucGFzdFNhdGFydCA9IFV0aWxzLmlzQWZ0ZXIoc2V0dGluZ3MudGltZVN0YXJ0KTtcclxuXHJcbiAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAuZ2V0UHVibGljU2V0dGluZ3MoKVxyXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgJHNjb3BlLnBhc3RTYXRhcnQgPSBVdGlscy5pc0FmdGVyKHJlc3BvbnNlLmRhdGEudGltZVN0YXJ0KVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnNob3dTaWRlYmFyID0gZmFsc2U7XHJcbiAgICAgICRzY29wZS50b2dnbGVTaWRlYmFyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAkc2NvcGUuc2hvd1NpZGViYXIgPSAhJHNjb3BlLnNob3dTaWRlYmFyO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gb2ggZ29kIGpRdWVyeSBoYWNrXHJcbiAgICAgICQoJy5pdGVtJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAkc2NvcGUuc2hvd1NpZGViYXIgPSBmYWxzZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgfV0pO1xyXG4iLCJcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdUZWFtQ3RybCcsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnJHRpbWVvdXQnLFxyXG4gICAgJ2N1cnJlbnRVc2VyJyxcclxuICAgICdzZXR0aW5ncycsXHJcbiAgICAnVXRpbHMnLFxyXG4gICAgJ1VzZXJTZXJ2aWNlJyxcclxuICAgICdUZWFtU2VydmljZScsXHJcbiAgICAnVEVBTScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHRpbWVvdXQsIGN1cnJlbnRVc2VyLCBzZXR0aW5ncywgVXRpbHMsIFVzZXJTZXJ2aWNlLCBUZWFtU2VydmljZSwgVEVBTSl7XHJcbiAgICAgIC8vIEdldCB0aGUgY3VycmVudCB1c2VyJ3MgbW9zdCByZWNlbnQgZGF0YS5cclxuICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcclxuICAgICAgXHJcbiAgICAgICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xyXG5cclxuICAgICAgJHNjb3BlLnVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xyXG5cclxuICAgICAgZnVuY3Rpb24gaXNUZWFtTWVtYmVyKHRlYW1zLFVzZXJpZCkge1xyXG4gICAgICAgIHZhciB0ZXN0ID0gZmFsc2U7XHJcbiAgICAgICAgdGVhbXMuZm9yRWFjaCh0ZWFtID0+IHtcclxuICAgICAgICAgIHRlYW0ubWVtYmVycy5mb3JFYWNoKG1lbWJlciA9PiB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChtZW1iZXIuaWQ9PVVzZXJpZCkgdGVzdCA9IHRydWU7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTsgICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0ZXN0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBcclxuICAgICAgJHNjb3BlLmlzam9pbmVkID0gZnVuY3Rpb24odGVhbSl7XHJcbiAgICAgICAgdmFyIHRlc3QgPSBmYWxzZTtcclxuICAgICAgICB0ZWFtLmpvaW5SZXF1ZXN0cy5mb3JFYWNoKG1lbWJlciA9PntcclxuICAgICAgICAgIGlmKG1lbWJlci5pZD09Y3VycmVudFVzZXIuZGF0YS5faWQpdGVzdCA9IHRydWU7XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGVzdDtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgVGVhbVNlcnZpY2UuZ2V0QWxsKCkudGhlbih0ZWFtcyA9PiB7XHJcbiAgICAgICAgJHNjb3BlLmlzVGVhbUFkbWluPWZhbHNlO1xyXG4gICAgICAgICRzY29wZS5pc1RlYW1NZW1iZXI9ZmFsc2U7XHJcbiAgICAgICAgdGVhbXMuZGF0YS5mb3JFYWNoKHRlYW0gPT4ge1xyXG4gICAgICAgICAgdGVhbS5pc01heHRlYW0gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICBpZiAodGVhbS5tZW1iZXJzLmxlbmd0aD49U2V0dGluZ3MubWF4VGVhbVNpemUpe1xyXG4gICAgICAgICAgICB0ZWFtLmlzQ29sb3NlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRlYW0uaXNNYXh0ZWFtID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZih0ZWFtLm1lbWJlcnNbMF0uaWQ9PWN1cnJlbnRVc2VyLmRhdGEuX2lkKXtcclxuICAgICAgICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaChtZW1iZXIgPT4geyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBpZiAoaXNUZWFtTWVtYmVyKHRlYW1zLmRhdGEsbWVtYmVyLmlkKSl7XHJcbiAgICAgICAgICAgICAgICBtZW1iZXIudW5hdmFpbGFibGU9dHJ1ZTtcclxuICAgICAgICAgICAgICB9ZWxzZXttZW1iZXIudW5hdmFpbGFibGU9ZmFsc2V9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlckFkbWluVGVhbSA9IHRlYW07XHJcbiAgICAgICAgICAgICRzY29wZS5pc1RlYW1BZG1pbj10cnVlO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRlYW0ubWVtYmVycy5mb3JFYWNoKG1lbWJlciA9PntcclxuICAgICAgICAgICAgICBpZihtZW1iZXIuaWQ9PWN1cnJlbnRVc2VyLmRhdGEuX2lkKXtcclxuICAgICAgICAgICAgICAgICRzY29wZS51c2VyTWVtYmVyVGVhbSA9IHRlYW07XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuaXNUZWFtTWVtYmVyPXRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgJHNjb3BlLnRlYW1zID0gdGVhbXMuZGF0YTtcclxuXHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICRzY29wZS5jcmVhdGVUZWFtID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHRlYW1EYXRhID0ge1xyXG4gICAgICAgICAgZGVzY3JpcHRpb246ICRzY29wZS5uZXdUZWFtX2Rlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgbWVtYmVyczogW3tpZDpjdXJyZW50VXNlci5kYXRhLl9pZCwgbmFtZTpjdXJyZW50VXNlci5kYXRhLnByb2ZpbGUubmFtZSwgc2tpbGw6ICRzY29wZS5uZXdUZWFtX0FkbWluc2tpbGx9XSxcclxuICAgICAgICAgIHNraWxsczoge2NvZGU6ICRzY29wZS5za2lsbGNvZGUsZGVzaWduOiAkc2NvcGUuc2tpbGxkZXNpZ24saGFyZHdhcmU6ICRzY29wZS5za2lsbGhhcmR3YXJlLGlkZWE6ICRzY29wZS5za2lsbGlkZWF9LFxyXG4gICAgICAgICAgaXNDb2xvc2VkOiBmYWxzZSxcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2codGVhbURhdGEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5uZXdUZWFtX0FkbWluc2tpbGwpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFRlYW1TZXJ2aWNlLmNyZWF0ZSh0ZWFtRGF0YSk7XHJcbiAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICB9O1xyXG5cclxuXHJcbiAgICAgICRzY29wZS5TaG93Y3JlYXRlVGVhbSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJHNjb3BlLlNob3dOZXdUZWFtRnJvbSA9IHRydWU7ICBcclxuICAgICAgICAkc2NvcGUuc2tpbGxjb2RlID10cnVlXHJcbiAgICAgICAgJHNjb3BlLnNraWxsZGVzaWduID10cnVlXHJcbiAgICAgICAgJHNjb3BlLnNraWxsaGFyZHdhcmUgPXRydWVcclxuICAgICAgICAkc2NvcGUuc2tpbGxpZGVhID10cnVlXHJcbiAgICAgICAgJHNjb3BlLm5ld1RlYW1fQWRtaW5za2lsbD1cImNvZGVcIlxyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgJHNjb3BlLlNob3dKb2luVGVhbSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJHNjb3BlLlNob3dKb2luVGVhbUZyb20gPSB0cnVlOyAgXHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAkc2NvcGUuam9pblRlYW1Db2RlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB0ZWFtSUQgPSAkc2NvcGUubmV3VGVhbV9Db2RlO1xyXG4gICAgICAgIG5ld1RlYW1fc2tpbGw9ICRzY29wZS5uZXdUZWFtX3NraWxsO1xyXG5cclxuICAgICAgICBuZXd1c2VyPSB7aWQ6Y3VycmVudFVzZXIuZGF0YS5faWQsIG5hbWU6Y3VycmVudFVzZXIuZGF0YS5wcm9maWxlLm5hbWUsIHNraWxsOm5ld1RlYW1fc2tpbGx9O1xyXG4gICAgICAgIFRlYW1TZXJ2aWNlLmpvaW4odGVhbUlELG5ld3VzZXIpOyBcclxuICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgXCJKb2luZWRcIixcclxuICAgICAgICAgIFwiWW91IGhhdmUgYXBwbGljZWQgdG8gam9pbiB0aGlzIHRlYW0sIHdhaXQgZm9yIHRoZSBUZWFtLUFkbWluIHRvIGFjY2VwdCB5b3VyIGFwcGxpY2F0aW9uLlwiLFxyXG4gICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICApOyAgXHJcbiAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICBcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgJHNjb3BlLmpvaW5UZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcclxuXHJcbiAgICAgICAgdmFyIHZhbHVlO1xyXG4gICAgICAgICBjb25zdCBzZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcclxuICAgICAgICAgc2VsZWN0LmNsYXNzTmFtZSA9ICdzZWxlY3QtY3VzdG9tJ1xyXG5cclxuXHJcbiAgICAgICAgIHZhciBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICAgb3B0aW9uLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9ICdTZWxlY3QgYSBza2lsbCc7XHJcbiAgICAgICAgIG9wdGlvbi52YWx1ZSA9IFwiY29kZVwiXHJcbiAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG5cclxuXHJcbiAgICAgICAgIGlmKHRlYW0uc2tpbGxzLmNvZGUpe1xyXG4gICAgICAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnQ29kZSc7XHJcbiAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gXCJjb2RlXCJcclxuICAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgICBpZih0ZWFtLnNraWxscy5kZXNpZ24pe1xyXG4gICAgICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gJ0Rlc2lnbic7XHJcbiAgICAgICAgICBvcHRpb24udmFsdWUgPSBcImRlc2lnblwiXHJcbiAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgICBpZih0ZWFtLnNraWxscy5oYXJkd2FyZSl7XHJcbiAgICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnSGFyZHdhcmUnO1xyXG4gICAgICAgICAgb3B0aW9uLnZhbHVlID0gXCJoYXJkd2FyZVwiXHJcbiAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgICBpZih0ZWFtLnNraWxscy5pZGVhKXtcclxuICAgICAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9ICdJZGVhJztcclxuICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IFwiaWRlYVwiXHJcbiAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHNlbGVjdC5vbmNoYW5nZSA9IGZ1bmN0aW9uIHNlbGVjdENoYW5nZWQoZSkge1xyXG4gICAgICAgICAgdmFsdWUgPSBlLnRhcmdldC52YWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIlBsZWFzZSBzZWxlY3QgeW91ciBza2lsbCB0byBqb2luXCIsXHJcblxyXG4gICAgICAgICAgY29udGVudDoge1xyXG4gICAgICAgICAgICBlbGVtZW50OiBzZWxlY3QsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICBuZXd1c2VyPSB7aWQ6Y3VycmVudFVzZXIuZGF0YS5faWQsIG5hbWU6Y3VycmVudFVzZXIuZGF0YS5wcm9maWxlLm5hbWUsIHNraWxsOnZhbHVlfTtcclxuICAgICAgICAgIFRlYW1TZXJ2aWNlLmpvaW4odGVhbS5faWQsbmV3dXNlcik7IFxyXG4gICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgXCJKb2luZWRcIixcclxuICAgICAgICAgICAgXCJZb3UgaGF2ZSBhcHBsaWNlZCB0byBqb2luIHRoaXMgdGVhbSwgd2FpdCBmb3IgdGhlIFRlYW0tQWRtaW4gdG8gYWNjZXB0IHlvdXIgYXBwbGljYXRpb24uXCIsXHJcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICApOyAgXHJcbiAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgfSkgICAgICAgIFxyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgJHNjb3BlLmFjY2VwdE1lbWJlciA9IGZ1bmN0aW9uKHRlYW1JRCwgbWVtYmVyLCBpbmRleCkge1xyXG5cclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gYWNjZXB0IFwiICsgbWVtYmVyLm5hbWUgKyBcIiB0byB5b3VyIHRlYW0hIFRoaXMgd2lsbCBzZW5kIGhpbSBhIG5vdGlmaWNhdGlvbiBlbWFpbCBhbmQgd2lsbCBzaG93IGluIHRoZSBwdWJsaWMgdGVhbXMgcGFnZS5cIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIGxldCBoaW0gaW5cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgVGVhbVNlcnZpY2UuYWNjZXB0TWVtYmVyKHRlYW1JRCxtZW1iZXIsU2V0dGluZ3MubWF4VGVhbVNpemUpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2U9PVwibWF4VGVhbVNpemVcIil7XHJcbiAgICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICAgIFwiRXJyb3JcIixcclxuICAgICAgICAgICAgICAgIFwiTWF4aW11bSBudW1iZXIgb2YgbWVtYmVycyAoXCIrU2V0dGluZ3MubWF4VGVhbVNpemUrXCIpIHJlYWNoZWRcIixcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIlxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW1JRCxpbmRleCxmYWxzZSkudGhlbihyZXNwb25zZTIgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICAgICAgXCJBY2NlcHRlZFwiLFxyXG4gICAgICAgICAgICAgICAgICBtZW1iZXIubmFtZSArIFwiIGhhcyBiZWVuIGFjY2VwdGVkIHRvIHlvdXIgdGVhbS5cIixcclxuICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgfSk7ICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTsgICAgICBcclxuICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAkc2NvcGUucmVmdXNlTWVtYmVyID0gZnVuY3Rpb24odGVhbUlELCBtZW1iZXIsIGluZGV4KSB7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIHJlZnVzZSBcIiArIG1lbWJlci5uYW1lICsgXCIgZnJvbSB5b3VyIHRlYW0hIFRoaXMgd2lsbCBzZW5kIGhpbSBhIG5vdGlmaWNhdGlvbiBlbWFpbC5cIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlZnVzZSBoaW1cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3Zlam9pbih0ZWFtSUQsaW5kZXgsbWVtYmVyKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIlJlZnVzZWRcIixcclxuICAgICAgICAgICAgICBtZW1iZXIubmFtZSArIFwiIGhhcyBiZWVuIHJlZnVzZWQgZnJvbSB5b3VyIHRlYW0uXCIsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7ICAgICAgXHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAkc2NvcGUucmVtb3ZlTWVtYmVyZnJvbVRlYW0gPSBmdW5jdGlvbih0ZWFtSUQsIG1lbWJlciwgaW5kZXgpIHtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVtb3ZlIFwiICsgbWVtYmVyLm5hbWUgKyBcIiBmcm9tIHlvdXIgdGVhbSEgVGhpcyB3aWxsIHNlbmQgaGltIGEgbm90aWZpY2F0aW9uIGVtYWlsLlwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVtb3ZlIGhpbVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVtZW1iZXIodGVhbUlELGluZGV4LG1lbWJlci5pZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZT09XCJyZW1vdmluZ0FkbWluXCIpe1xyXG4gICAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgICBcIkVycm9yXCIsXHJcbiAgICAgICAgICAgICAgICBcIllvdSBjYW4ndCByZW1vdmUgdGhlIFRlYW0gQWRtaW4sIEJ1dCB5b3UgY2FuIGNsb3NlIHRoZSB0ZWFtLlwiLFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZWpvaW4odGVhbUlELGluZGV4LGZhbHNlKS50aGVuKHJlc3BvbnNlMiA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgICBcIlJlbW92ZWRcIixcclxuICAgICAgICAgICAgICAgICAgbWVtYmVyLm5hbWUgKyBcIiBoYXMgYmVlbiByZW1vdmVkIGZyb20geW91ciB0ZWFtLlwiLFxyXG4gICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICAgICAgKTsgICAgXHJcbiAgICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgfSk7ICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTsgICAgICBcclxuICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAkc2NvcGUucmVtb3ZlVGVhbSA9IGZ1bmN0aW9uKHRlYW0pIHtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVtb3ZlIHRoaXMgdGVhbSB3aXRoIGFsbCBpdCdzIG1lbWJlcnMhIFRoaXMgd2lsbCBzZW5kIHRoZW0gYSBub3RpZmljYXRpb24gZW1haWwuIFlvdSBuZWVkIHRvIGZpbmQgYW5vdGhlciB0ZWFtIHRvIHdvcmsgd2l0aC5cIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSB0ZWFtXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBlbWFpbCA9IHsgXHJcbiAgICAgICAgICAgIHN1YmplY3Q6XCJZb3VyIHRlYW0gaGFzIGJlZW4gcmVtb3ZlZFwiLCBcclxuICAgICAgICAgICAgdGl0bGU6XCJUaW1lIGZvciBhIGJhY2t1cCBwbGFuXCIsXHJcbiAgICAgICAgICAgIGJvZHk6XCJUaGUgdGVhbSB5b3UgaGF2ZSBiZWVuIHBhcnQgKE1lbWJlci9yZXF1ZXN0ZWQgdG8gam9pbikgb2YgaGFzIGJlZW4gcmVtb3ZlZC4gUGxlYXNlIGNoZWNrIHlvdXIgZGFzaGJvYXJkIGFuZCB0cnkgdG8gZmluZCBhbm90aGVyIHRlYW0gdG8gd29yayB3aXRoIGJlZm9yZSB0aGUgaGFja2F0aG9uIHN0YXJ0cy5cIiBcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmUodGVhbS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaCh1c2VyID0+IHtcclxuICAgICAgICAgICAgICBVc2VyU2VydmljZS5zZW5kQmFzaWNNYWlsKHVzZXIuaWQsZW1haWwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaCh1c2VyID0+IHtcclxuICAgICAgICAgICAgICBVc2VyU2VydmljZS5zZW5kQmFzaWNNYWlsKHVzZXIuaWQsZW1haWwpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXHJcbiAgICAgICAgICAgICAgXCJUZWFtIGhhcyBiZWVuIHJlbW92ZWQuXCIsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7ICAgICAgXHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAkc2NvcGUubGVhdmVUZWFtID0gZnVuY3Rpb24odGVhbSkge1xyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBsZWF2ZSB5b3VyIHRlYW0hIFRoaXMgd2lsbCBzZW5kIHRoZSBhZG1pbiBhIG5vdGlmaWNhdGlvbiBlbWFpbC5cIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSBoaW1cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdmFyIGluZGV4PTA7XHJcbiAgICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWVtYmVyLmlkPT1jdXJyZW50VXNlci5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZW1lbWJlcih0ZWFtLl9pZCxpbmRleCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgICBcIlJlbW92ZWRcIixcclxuICAgICAgICAgICAgICAgICAgXCJZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgbGVmdCB0aGlzIHRlYW0uIFBsZWFzZSBmaW5kIGFub3RoZXIgdGVhbSBvciBjcmVhdGUgeW91ciBvd24uXCIsXHJcbiAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7ICAgICAgXHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAkc2NvcGUuY2FuY2Vsam9pblRlYW0gPSBmdW5jdGlvbih0ZWFtKSB7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGNhbmNlbCB5b3VyIHJlcXVlc3QgdG8gam9pbiB0aGlzIHRlYW0hXCIsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJOb1wiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIENhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB2YXIgaW5kZXg9MDtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWVtYmVyLmlkPT1jdXJyZW50VXNlci5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZWpvaW4odGVhbS5faWQsaW5kZXgsZmFsc2UpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXHJcbiAgICAgICAgICAgICAgICAgIFwiWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGNhbmNlbGVkIHlvdSByZXF1ZXN0IHRvIGpvaW4gdGhpcyB0ZWFtLiBQbGVhc2UgZmluZCBhbm90aGVyIHRlYW0gb3IgY3JlYXRlIHlvdXIgb3duLlwiLFxyXG4gICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0pOyAgICAgIFxyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgJHNjb3BlLnRvZ2dsZUNsb3NlVGVhbSA9IGZ1bmN0aW9uKHRlYW1JRCxzdGF0dXMpIHtcclxuICAgICAgICBpZiAoc3RhdHVzPT10cnVlKXt0ZXh0PVwiWW91IGFyZSBhYm91dCB0byBDbG9zZSB0aGlzIHRlYW0uIFRoaXMgd29uJ3QgYWxsb3cgb3RoZXIgbWVtYmVycyB0byBqb2luIHlvdXIgdGVhbSFcIlxyXG4gICAgICAgIH1lbHNle3RleHQ9XCJZb3UgYXJlIGFib3V0IHRvIHJlb3BlbiB0aGlzIHRlYW0uIFRoaXMgd2lsbCBhbGxvdyBvdGhlciBtZW1iZXJzIHRvIGpvaW4geW91ciB0ZWFtIVwifVxyXG5cclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiTm9cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFRlYW1TZXJ2aWNlLnRvZ2dsZUNsb3NlVGVhbSh0ZWFtSUQsc3RhdHVzKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIkRvbmVcIixcclxuICAgICAgICAgICAgICBcIk9wZXJhdGlvbiBzdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pOyAgICAgIFxyXG4gICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICRzY29wZS50b2dnbGVIaWRlVGVhbSA9IGZ1bmN0aW9uKHRlYW1JRCxzdGF0dXMpIHtcclxuICAgICAgICBpZiAoc3RhdHVzPT10cnVlKXt0ZXh0PVwiWW91IGFyZSBhYm91dCB0byBIaWRlIHRoaXMgdGVhbS4gVGhpcyB3b24ndCBhbGxvdyBvdGhlciBtZW1iZXJzIHRvIHNlZSB5b3VyIHRlYW0hXCJcclxuICAgICAgICB9ZWxzZXt0ZXh0PVwiWW91IGFyZSBhYm91dCB0byBTaG93IHRoaXMgdGVhbS4gVGhpcyB3aWxsIGFsbG93IG90aGVyIG1lbWJlcnMgdG8gc2VlIHlvdXIgdGVhbSFcIn1cclxuXHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogdGV4dCxcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIk5vXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllc1wiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBUZWFtU2VydmljZS50b2dnbGVIaWRlVGVhbSh0ZWFtSUQsc3RhdHVzKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIkRvbmVcIixcclxuICAgICAgICAgICAgICBcIk9wZXJhdGlvbiBzdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pOyAgICAgIFxyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUuJHdhdGNoKFwicXVlcnlUZXh0XCIsIGZ1bmN0aW9uKHF1ZXJ5VGV4dCkge1xyXG4gICAgICAgIFRlYW1TZXJ2aWNlLmdldFNlbGVjdGVkVGVhbXMocXVlcnlUZXh0LCAkc2NvcGUuc2tpbGxzRmlsdGVycykudGhlbihcclxuICAgICAgICAgIHJlc3BvbnNlID0+IHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgJHNjb3BlLnRlYW1zID0gcmVzcG9uc2UuZGF0YS50ZWFtcztcclxuICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICBcclxuICAgICAgJHNjb3BlLmFwcGx5c2tpbGxzRmlsdGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIFRlYW1TZXJ2aWNlLmdldFNlbGVjdGVkVGVhbXMoJHNjb3BlLnF1ZXJ5VGV4dCwgJHNjb3BlLnNraWxsc0ZpbHRlcnMpLnRoZW4oXHJcbiAgICAgICAgICByZXNwb25zZSA9PiB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICRzY29wZS50ZWFtcyA9IHJlc3BvbnNlLmRhdGEudGVhbXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgfTtcclxuICBcclxuXHJcblxyXG5cclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdWZXJpZnlDdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJHN0YXRlUGFyYW1zJyxcclxuICAgICdBdXRoU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgQXV0aFNlcnZpY2Upe1xyXG4gICAgICB2YXIgdG9rZW4gPSAkc3RhdGVQYXJhbXMudG9rZW47XHJcblxyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICBBdXRoU2VydmljZS52ZXJpZnkodG9rZW4sXHJcbiAgICAgICAgICBmdW5jdGlvbih1c2VyKXtcclxuICAgICAgICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSB0cnVlO1xyXG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZ1bmN0aW9uKGVycil7XHJcbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfV0pO1xyXG4iXX0=
