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
angular.module('reg')
  .service('settings', function() {})
  .controller('BaseCtrl', [
    '$scope',
    'EVENT_INFO',
    function($scope, EVENT_INFO){

      $scope.EVENT_INFO = EVENT_INFO;

    }]);

angular.module('reg')
  .controller('adminCtrl', [
    '$scope',
    'UserService',
    function($scope, UserService){
      $scope.loading = true;
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
    function($scope, $rootScope, $state, $http, currentUser, settings, Session, UserService, MarketingService) {

      // Set up the user
      $scope.user = currentUser.data;

      // Is the student from HostSchool?
      $scope.isHostSchool = $scope.user.email.split('@')[1] == settings.data.hostSchool;

      // If so, default them to adult: true
      if ($scope.isHostSchool){
        $scope.user.profile.adult = true;
      }

      // Populate the school dropdown
      populateSchools();
      _setupForm();

      populateWilayas();
      populateClubs();

      $scope.regIsClosed = Date.now() > settings.data.timeClose;

      function populateSchools(){
        $http
          .get('/assets/schools.json')
          .then(function(res){
            var schools = res.data;
            var email = $scope.user.email.split('@')[1];

            if (schools[email]){
              $scope.user.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }
          });

        $http
          .get('/assets/schools.csv')
          .then(function(res){
            $scope.schools = res.data.split('\n');
            $scope.schools.push('Other');

            var content = [];

            for(i = 0; i < $scope.schools.length; i++) {
              $scope.schools[i] = $scope.schools[i].trim();
              content.push({title: $scope.schools[i]})
            }

            $('#school.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function(result, response) {
                  $scope.user.profile.school = result.title.trim();
                }
              })
          });
      }
    

      function populateWilayas(){
        $http
          .get('/assets/wilayas.csv')
          .then(function(res){
            $scope.wilayas = res.data.split('\n');
            $scope.wilayas.push('Other');

            var content = [];

            for(i = 0; i < $scope.wilayas.length; i++) {
              $scope.wilayas[i] = $scope.wilayas[i].trim();
              content.push({title: $scope.wilayas[i]})
            }

            $('#wilaya.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function(result, response) {
                  $scope.user.profile.wilaya = result.title.trim();
                }
              })
          });
      }
      

      function populateClubs(){
        $http
          .get('/assets/clubs.csv')
          .then(function(res){
            $scope.clubs = res.data.split('\n');
            $scope.clubs.push('Other');

            var content = [];

            for(i = 0; i < $scope.clubs.length; i++) {
              $scope.clubs[i] = $scope.clubs[i].trim();
              content.push({title: $scope.clubs[i]})
            }

            $('#club.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function(result, response) {
                  $scope.club = result.title.trim();
                }
              })
          });
          if ($scope.user.profile.source != undefined){
            $scope.UserSource = $scope.user.profile.source.split('#')[0];
            $scope.club = $scope.user.profile.source.split('#')[1];  
          }
        }


      function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
      }

      function sendMarketingEmails(){
        MarketingService.getAll().then(teams=>{
          var emails=[];
          teams.data.forEach(team => {
            var isTeammate=false;
            team.members.forEach(member => {
              if (member==currentUser.data.email){
                isTeammate=true;
              }
            });
            if (isTeammate) {
              team.members.forEach(member => {
                if (!(member==currentUser.data.email)){
                  emails.push({email:member,event:team.event})
                } 
              });
            }
          });
          removeDuplicates(emails,'email').forEach(teammate => {
            MarketingService.sendFriendInvite(currentUser.data.profile.name,teammate)
          });
        })
      }


      function _updateUser(e){

        //Check if User's first submission
        var sendMail = true;
        if (currentUser.data.status.completedProfile) {sendMail=false}        

        // Get user Source
        if ($scope.UserSource!='2'){$scope.user.profile.source=$scope.UserSource}
          else{$scope.user.profile.source=$scope.UserSource+"#"+$scope.club}

        UserService
          .updateProfile(Session.getUserId(), $scope.user.profile)
          .then(response => {
            swal("Awesome!", "Your application has been saved.", "success").then(value => {
              if (sendMail){ sendMarketingEmails(); }
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

      function _setupForm(){
        // Custom minors validation rule
        $.fn.form.settings.rules.allowMinors = function (value) {
          return minorsValidation();
        };

        // Semantic-UI form validation
        $('.ui.form').form({
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
            wilaya: {
              identifier: 'wilaya',
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
            cvLink: {
              identifier: 'cvLink',
              rules: [
                {
                  type: 'empty',
                  prompt: 'You must add a link to your CV.'
                }
              ]
            }
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

/*
*
* TODO: Revise isJoined
*
*/

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

      
      TeamService.getAll().then(teams => {
        $scope.isTeamAdmin=false;
        $scope.isTeamMember=false;
        teams.data.forEach(team => {
          team.isMaxteam = false;

          if (team.members.length>=Settings.maxTeamSize){
            team.isColosed = true;
            team.isMaxteam = true;
          }

          team.isjoined=false;
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
            team.joinRequests.forEach(member =>{
              if(member.id==currentUser.data._id){
                team.isjoined=true;                
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


      $scope.joinTeam = function(teamID) {
        newuser= {id:currentUser.data._id, name:currentUser.data.profile.name, skill:"design"};
        TeamService.join(teamID,newuser); 

        $state.reload();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnN0YW50cy5qcyIsInJvdXRlcy5qcyIsImludGVyY2VwdG9ycy9BdXRoSW50ZXJjZXB0b3IuanMiLCJtb2R1bGVzL1Nlc3Npb24uanMiLCJtb2R1bGVzL1V0aWxzLmpzIiwicXJzY2FubmVyL2h0bWw1LXFyY29kZS5taW4uanMiLCJxcnNjYW5uZXIvanNxcmNvZGUtY29tYmluZWQubWluLmpzIiwic2VydmljZXMvQXV0aFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9DaGFsbGVuZ2VTZXJ2aWNlLmpzIiwic2VydmljZXMvTWFya2V0aW5nU2VydmljZS5qcyIsInNlcnZpY2VzL1NldHRpbmdzU2VydmljZS5qcyIsInNlcnZpY2VzL1NvbHZlZENURlNlcnZpY2UuanMiLCJzZXJ2aWNlcy9UZWFtU2VydmljZS5qcyIsInNlcnZpY2VzL1VzZXJTZXJ2aWNlLmpzIiwiYWRtaW4vY2hhbGxlbmdlL2FkbWluQ2hhbGxlbmdlQ3RybC5qcyIsImFkbWluL2NoYWxsZW5nZXMvYWRtaW5DaGFsbGVuZ2VzQ3RybC5qcyIsImFkbWluL21haWwvYWRtaW5NYWlsQ3RybC5qcyIsImFkbWluL21hcmtldGluZy9hZG1pbk1hcmtldGluZ0N0cmwuanMiLCJhZG1pbi9zZXR0aW5ncy9hZG1pblNldHRpbmdzQ3RybC5qcyIsImFkbWluL3N0YXRzL2FkbWluU3RhdHNDdHJsLmpzIiwiYWRtaW4vdXNlci9hZG1pblVzZXJDdHJsLmpzIiwiYWRtaW4vdXNlcnMvYWRtaW5Vc2Vyc0N0cmwuanMiLCJCYXNlQ3RybC5qcyIsImFkbWluL2FkbWluQ3RybC5qcyIsImFwcGxpY2F0aW9uL2FwcGxpY2F0aW9uQ3RybC5qcyIsImNoZWNraW4vY2hlY2tpbkN0cmwuanMiLCJjb25maXJtYXRpb24vY29uZmlybWF0aW9uQ3RybC5qcyIsImRhc2hib2FyZC9kYXNoYm9hcmRDdHJsLmpzIiwiaG9tZS9Ib21lQ3RybC5qcyIsImNoYWxsZW5nZXMvY2hhbGxlbmdlc0N0cmwuanMiLCJsb2dpbi9sb2dpbkN0cmwuanMiLCJyZXNldC9yZXNldEN0cmwuanMiLCJzaWRlYmFyL3NpZGViYXJDdHJsLmpzIiwidGVhbS90ZWFtQ3RybC5qcyIsInZlcmlmeS92ZXJpZnlDdHJsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsTUFBQSxRQUFBLE9BQUEsT0FBQTtFQUNBO0VBQ0E7OztBQUdBO0dBQ0EsT0FBQTtJQUNBO0lBQ0EsU0FBQSxjQUFBOzs7TUFHQSxjQUFBLGFBQUEsS0FBQTs7O0dBR0EsSUFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLGFBQUEsUUFBQTs7O01BR0EsSUFBQSxRQUFBLFFBQUE7TUFDQSxJQUFBLE1BQUE7UUFDQSxZQUFBLGVBQUE7Ozs7O0FDdEJBLFFBQUEsT0FBQTtLQUNBLFNBQUEsY0FBQTtRQUNBLE1BQUE7O0tBRUEsU0FBQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLGtCQUFBO1FBQ0EsWUFBQTtRQUNBLGlCQUFBO1FBQ0EsV0FBQTtRQUNBLDZCQUFBO1FBQ0EsdUJBQUE7UUFDQSxnQ0FBQTtRQUNBLG1DQUFBO1FBQ0EsNkJBQUE7UUFDQSwwQkFBQTtRQUNBLFVBQUE7O0tBRUEsU0FBQSxPQUFBO1FBQ0Esb0JBQUE7Ozs7QUNsQkEsUUFBQSxPQUFBO0dBQ0EsT0FBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO01BQ0E7TUFDQTtNQUNBLG1CQUFBOzs7SUFHQSxtQkFBQSxVQUFBOzs7SUFHQTtPQUNBLE1BQUEsU0FBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxjQUFBO1VBQ0EsZUFBQTs7UUFFQSxTQUFBO1VBQ0EsZ0NBQUEsU0FBQSxnQkFBQTtZQUNBLE9BQUEsZ0JBQUE7Ozs7T0FJQSxNQUFBLFFBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsY0FBQTtVQUNBLGVBQUE7O1FBRUEsU0FBQTtVQUNBLGdDQUFBLFNBQUEsZ0JBQUE7WUFDQSxPQUFBLGdCQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BbUJBLE1BQUEsT0FBQTtRQUNBLE9BQUE7VUFDQSxJQUFBO1lBQ0EsYUFBQTtZQUNBLFlBQUE7O1VBRUEsZUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBO1lBQ0EsU0FBQTtjQUNBLDhCQUFBLFNBQUEsaUJBQUE7Z0JBQ0EsT0FBQSxnQkFBQTs7Ozs7UUFLQSxNQUFBO1VBQ0EsY0FBQTs7O09BR0EsTUFBQSxpQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLFNBQUE7VUFDQSw2QkFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsOEJBQUEsU0FBQSxnQkFBQTtZQUNBLE9BQUEsZ0JBQUE7Ozs7T0FJQSxNQUFBLG1CQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGlCQUFBOztRQUVBLFNBQUE7VUFDQSw2QkFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsOEJBQUEsU0FBQSxnQkFBQTtZQUNBLE9BQUEsZ0JBQUE7Ozs7T0FJQSxNQUFBLG9CQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGlCQUFBOztRQUVBLFNBQUE7VUFDQSw2QkFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUE7Ozs7T0FJQSxNQUFBLGtCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGlCQUFBOztRQUVBLFNBQUE7VUFDQSw2QkFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsOEJBQUEsU0FBQSxnQkFBQTtZQUNBLE9BQUEsZ0JBQUE7Ozs7T0FJQSxNQUFBLFlBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsaUJBQUE7O1FBRUEsU0FBQTtVQUNBLDZCQUFBLFNBQUEsWUFBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSw4QkFBQSxTQUFBLGdCQUFBO1lBQ0EsT0FBQSxnQkFBQTs7OztPQUlBLE1BQUEsYUFBQTtRQUNBLE9BQUE7VUFDQSxJQUFBO1lBQ0EsYUFBQTtZQUNBLFlBQUE7OztRQUdBLE1BQUE7VUFDQSxjQUFBOzs7T0FHQSxNQUFBLGVBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0Esa0JBQUE7OztPQUdBLE1BQUEsbUJBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7O09BRUEsTUFBQSxrQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTs7T0FFQSxNQUFBLHdCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBOztPQUVBLE1BQUEsdUJBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxTQUFBO1VBQ0Esa0RBQUEsU0FBQSxjQUFBLGlCQUFBO1lBQ0EsT0FBQSxpQkFBQSxJQUFBLGFBQUE7Ozs7T0FJQSxNQUFBLHVCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBOztPQUVBLE1BQUEsbUJBQUE7UUFDQSxLQUFBO1VBQ0E7VUFDQTtVQUNBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7O09BRUEsTUFBQSxrQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLFNBQUE7VUFDQSx3Q0FBQSxTQUFBLGNBQUEsWUFBQTtZQUNBLE9BQUEsWUFBQSxJQUFBLGFBQUE7Ozs7T0FJQSxNQUFBLHNCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBOztPQUVBLE1BQUEsU0FBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxjQUFBOzs7T0FHQSxNQUFBLFVBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsY0FBQTs7O09BR0EsTUFBQSxPQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxNQUFBO1VBQ0EsY0FBQTs7OztJQUlBLGtCQUFBLFVBQUE7TUFDQSxTQUFBOzs7O0dBSUEsSUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO01BQ0E7TUFDQTtNQUNBLFNBQUE7O01BRUEsV0FBQSxJQUFBLHVCQUFBLFdBQUE7U0FDQSxTQUFBLEtBQUEsWUFBQSxTQUFBLGdCQUFBLFlBQUE7OztNQUdBLFdBQUEsSUFBQSxxQkFBQSxVQUFBLE9BQUEsU0FBQSxVQUFBOztRQUVBLElBQUEsZUFBQSxRQUFBLEtBQUE7UUFDQSxJQUFBLGdCQUFBLFFBQUEsS0FBQTtRQUNBLElBQUEsZUFBQSxRQUFBLEtBQUE7UUFDQSxJQUFBLG1CQUFBLFFBQUEsS0FBQTtRQUNBLElBQUEsa0JBQUEsUUFBQSxLQUFBO1FBQ0EsSUFBQSxrQkFBQSxRQUFBLEtBQUE7O1FBRUEsSUFBQSxnQkFBQSxDQUFBLFFBQUEsWUFBQTtVQUNBLE1BQUE7VUFDQSxPQUFBLEdBQUE7OztRQUdBLElBQUEsaUJBQUEsUUFBQSxZQUFBO1VBQ0EsTUFBQTtVQUNBLE9BQUEsR0FBQTs7O1FBR0EsSUFBQSxnQkFBQSxDQUFBLFFBQUEsVUFBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE9BQUEsR0FBQTs7O1FBR0EsSUFBQSxvQkFBQSxDQUFBLFFBQUEsVUFBQSxhQUFBLGdCQUFBLENBQUEsUUFBQSxVQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsT0FBQSxHQUFBOzs7UUFHQSxJQUFBLG1CQUFBLENBQUEsUUFBQSxVQUFBLFVBQUE7VUFDQSxNQUFBO1VBQ0EsT0FBQSxHQUFBOzs7UUFHQSxJQUFBLG1CQUFBLENBQUEsUUFBQSxVQUFBLE9BQUEsVUFBQTtVQUNBLE1BQUE7VUFDQSxPQUFBLEdBQUE7Ozs7Ozs7O0FDL1NBLFFBQUEsT0FBQTtHQUNBLFFBQUEsbUJBQUE7SUFDQTtJQUNBLFNBQUEsUUFBQTtNQUNBLE9BQUE7VUFDQSxTQUFBLFNBQUEsT0FBQTtZQUNBLElBQUEsUUFBQSxRQUFBO1lBQ0EsSUFBQSxNQUFBO2NBQ0EsT0FBQSxRQUFBLG9CQUFBOztZQUVBLE9BQUE7Ozs7O0FDVkEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxXQUFBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsWUFBQSxRQUFBOztJQUVBLEtBQUEsU0FBQSxTQUFBLE9BQUEsS0FBQTtNQUNBLFFBQUEsYUFBQSxNQUFBO01BQ0EsUUFBQSxhQUFBLFNBQUEsS0FBQTtNQUNBLFFBQUEsYUFBQSxjQUFBLEtBQUEsVUFBQTtNQUNBLFdBQUEsY0FBQTs7O0lBR0EsS0FBQSxVQUFBLFNBQUEsV0FBQTtNQUNBLE9BQUEsUUFBQSxhQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTtNQUNBLFdBQUEsY0FBQTtNQUNBLElBQUEsV0FBQTtRQUNBOzs7O0lBSUEsS0FBQSxXQUFBLFVBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTs7O0lBR0EsS0FBQSxZQUFBLFVBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTs7O0lBR0EsS0FBQSxVQUFBLFVBQUE7TUFDQSxPQUFBLEtBQUEsTUFBQSxRQUFBLGFBQUE7OztJQUdBLEtBQUEsVUFBQSxTQUFBLEtBQUE7TUFDQSxRQUFBLGFBQUEsY0FBQSxLQUFBLFVBQUE7TUFDQSxXQUFBLGNBQUE7Ozs7QUNyQ0EsUUFBQSxPQUFBO0dBQ0EsUUFBQSxTQUFBO0lBQ0EsVUFBQTtNQUNBLE9BQUE7UUFDQSxXQUFBLFNBQUEsU0FBQTtVQUNBLE9BQUEsS0FBQSxRQUFBLFNBQUEsWUFBQSxLQUFBLFFBQUEsU0FBQTs7UUFFQSxTQUFBLFNBQUEsS0FBQTtVQUNBLE9BQUEsS0FBQSxRQUFBOztRQUVBLFlBQUEsU0FBQSxLQUFBOztVQUVBLElBQUEsQ0FBQSxLQUFBO1lBQ0EsT0FBQTs7O1VBR0EsT0FBQSxJQUFBLEtBQUE7O1VBRUEsT0FBQSxPQUFBLE1BQUEsT0FBQTtZQUNBLE1BQUEsS0FBQSxlQUFBLE1BQUEsS0FBQTs7Ozs7O0FDbkJBLENBQUEsU0FBQSxHQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7UUFDQSxjQUFBLFNBQUEsZUFBQSxhQUFBLFlBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQSxXQUFBO2dCQUNBLElBQUEsY0FBQSxFQUFBOztnQkFFQSxJQUFBLFNBQUEsWUFBQTtnQkFDQSxJQUFBLFFBQUEsWUFBQTs7Z0JBRUEsSUFBQSxVQUFBLE1BQUE7b0JBQ0EsU0FBQTs7O2dCQUdBLElBQUEsU0FBQSxNQUFBO29CQUNBLFFBQUE7Ozs7Z0JBSUEsSUFBQSxVQUFBLEVBQUEsbUJBQUEsUUFBQSxpQkFBQSxTQUFBLHFDQUFBLFNBQUE7Z0JBQ0EsSUFBQSxhQUFBLEVBQUEsb0NBQUEsUUFBQSxLQUFBLGtCQUFBLFNBQUEsS0FBQSx1Q0FBQSxTQUFBOztnQkFFQSxJQUFBLFFBQUEsUUFBQTtnQkFDQSxJQUFBLFNBQUEsV0FBQTtnQkFDQSxJQUFBLFVBQUEsT0FBQSxXQUFBO2dCQUNBLElBQUE7O2dCQUVBLElBQUEsT0FBQSxXQUFBO29CQUNBLElBQUEsa0JBQUE7d0JBQ0EsUUFBQSxVQUFBLE9BQUEsR0FBQSxHQUFBLEtBQUE7O3dCQUVBLElBQUE7NEJBQ0EsT0FBQTswQkFDQSxPQUFBLEdBQUE7NEJBQ0EsWUFBQSxHQUFBOzs7d0JBR0EsRUFBQSxLQUFBLFlBQUEsSUFBQSxXQUFBLFdBQUEsTUFBQTs7MkJBRUE7d0JBQ0EsRUFBQSxLQUFBLFlBQUEsSUFBQSxXQUFBLFdBQUEsTUFBQTs7OztnQkFJQSxPQUFBLE1BQUEsT0FBQSxPQUFBLE9BQUEsYUFBQSxPQUFBLFVBQUEsT0FBQTtnQkFDQSxVQUFBLGVBQUEsVUFBQSxnQkFBQSxVQUFBLHNCQUFBLFVBQUEsbUJBQUEsVUFBQTs7Z0JBRUEsSUFBQSxrQkFBQSxTQUFBLFFBQUE7O29CQUVBLE1BQUEsWUFBQTtvQkFDQSxtQkFBQTtvQkFDQSxFQUFBLEtBQUEsWUFBQSxJQUFBLFVBQUE7O29CQUVBLE1BQUE7b0JBQ0EsRUFBQSxLQUFBLFlBQUEsSUFBQSxXQUFBLFdBQUEsTUFBQTs7OztnQkFJQSxJQUFBLFVBQUEsY0FBQTtvQkFDQSxVQUFBLGFBQUEsQ0FBQSxPQUFBLEVBQUEsWUFBQSxtQkFBQSxpQkFBQSxTQUFBLE9BQUE7d0JBQ0EsV0FBQSxPQUFBOzt1QkFFQTtvQkFDQSxRQUFBLElBQUE7Ozs7Z0JBSUEsT0FBQSxXQUFBLFVBQUEsUUFBQTtvQkFDQSxjQUFBLFFBQUE7Ozs7UUFJQSxtQkFBQSxXQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUEsV0FBQTs7Z0JBRUEsRUFBQSxNQUFBLEtBQUEsVUFBQSxpQkFBQSxRQUFBLFNBQUEsWUFBQTtvQkFDQSxXQUFBOzs7Z0JBR0EsYUFBQSxFQUFBLE1BQUEsS0FBQTs7OztHQUlBOzs7QUNsRkEsU0FBQSxJQUFBLE1BQUEsY0FBQSxDQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUEsY0FBQSxjQUFBLEtBQUEsaUJBQUEsUUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFFBQUEsS0FBQSxpQkFBQSxnQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGdCQUFBLFNBQUEsU0FBQSxvQkFBQSxVQUFBLFVBQUEsQ0FBQSxLQUFBLG9CQUFBLG9CQUFBLFVBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxVQUFBLFdBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxXQUFBLEtBQUEsaUJBQUEsc0JBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxzQkFBQSxLQUFBLGlCQUFBLG1CQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsb0JBQUEsS0FBQSxZQUFBLEtBQUEsaUJBQUEsWUFBQSxVQUFBLENBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLFNBQUEsT0FBQSxJQUFBLE9BQUEsS0FBQSxTQUFBLEdBQUEsT0FBQSxPQUFBLFFBQUEsS0FBQSxZQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsVUFBQSxTQUFBLFFBQUEsY0FBQSx3QkFBQSxVQUFBLFVBQUEsVUFBQSxVQUFBLENBQUEsS0FBQSxjQUFBLGNBQUEsS0FBQSx3QkFBQSx3QkFBQSxLQUFBLFNBQUEsSUFBQSxNQUFBLFVBQUEsVUFBQSxVQUFBLFdBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxZQUFBLFVBQUEsb0JBQUEsU0FBQSxVQUFBLGNBQUEsRUFBQSxFQUFBLEVBQUEsU0FBQSxPQUFBLElBQUEsQ0FBQSxJQUFBLFFBQUEsU0FBQSxHQUFBLE9BQUEsUUFBQSxPQUFBLFFBQUEsY0FBQSxhQUFBLEtBQUEsZUFBQSxNQUFBLEtBQUEsaUJBQUEsZ0JBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxnQkFBQSxLQUFBLGlCQUFBLDBCQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsMEJBQUEsS0FBQSxpQkFBQSxpQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGlCQUFBLEtBQUEsaUJBQUEsc0JBQUEsVUFBQSxDQUFBLE9BQUEsR0FBQSxFQUFBLEtBQUEsZ0JBQUEsS0FBQSxxQkFBQSxVQUFBLENBQUEsSUFBQSxVQUFBLEtBQUEsb0JBQUEsVUFBQSxJQUFBLFVBQUEsV0FBQSxVQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxVQUFBLFVBQUEsVUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLFVBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSx3QkFBQSxPQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLHdCQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsR0FBQSxHQUFBLEdBQUEsVUFBQSxVQUFBLEtBQUEsd0JBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLE9BQUEsVUFBQSxVQUFBLEVBQUEsRUFBQSxFQUFBLFVBQUEsSUFBQSxVQUFBLFVBQUEsRUFBQSxFQUFBLFVBQUEsR0FBQSxHQUFBLEtBQUEsY0FBQSxJQUFBLFVBQUEsVUFBQSxVQUFBLEdBQUEsRUFBQSxFQUFBLEdBQUEsVUFBQSxVQUFBLEVBQUEsVUFBQSxHQUFBLEVBQUEsSUFBQSxXQUFBLEtBQUEsb0JBQUEsU0FBQSxRQUFBLENBQUEsT0FBQSxLQUFBLFNBQUEsUUFBQSxZQUFBLFNBQUEsZUFBQSxDQUFBLE9BQUEsSUFBQSxNQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxJQUFBLFNBQUEsRUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxPQUFBLFNBQUEscUJBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLGlCQUFBLFNBQUEsT0FBQSxDQUFBLElBQUEsSUFBQSxJQUFBLE9BQUEsT0FBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsRUFBQSxPQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsR0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxPQUFBLEdBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsWUFBQSxPQUFBLEVBQUEsR0FBQSxDQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxjQUFBLEtBQUEsaUJBQUEsU0FBQSxRQUFBLFFBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxRQUFBLE9BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxFQUFBLFFBQUEsR0FBQSxFQUFBLFFBQUEsR0FBQSxZQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxRQUFBLEdBQUEsQ0FBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsWUFBQSxRQUFBLEdBQUEsQ0FBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsY0FBQSxLQUFBLGFBQUEsVUFBQSxDQUFBLE9BQUEsSUFBQSxxQkFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsU0FBQSxNQUFBLENBQUEsT0FBQSxJQUFBLHFCQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxNQUFBLFNBQUEsZUFBQSxLQUFBLE9BQUEsQ0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLFNBQUEsTUFBQSxDQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUEsb0JBQUEsS0FBQSxLQUFBLHlCQUFBLFNBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxDQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxPQUFBLEtBQUEsSUFBQSxJQUFBLE9BQUEsR0FBQSxNQUFBLENBQUEsSUFBQSxLQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsS0FBQSxLQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxPQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsT0FBQSxNQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxNQUFBLEVBQUEsQ0FBQSxFQUFBLE1BQUEsSUFBQSxNQUFBLEVBQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEdBQUEsSUFBQSxHQUFBLE1BQUEsQ0FBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLEVBQUEsTUFBQSxNQUFBLEVBQUEsRUFBQSxHQUFBLEdBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxNQUFBLE9BQUEsUUFBQSxRQUFBLEtBQUEsTUFBQSxNQUFBLE1BQUEsT0FBQSxRQUFBLFFBQUEsR0FBQSxNQUFBLENBQUEsSUFBQSxNQUFBLEVBQUEsTUFBQSxNQUFBLEVBQUEsTUFBQSxPQUFBLEtBQUEsS0FBQSxNQUFBLE1BQUEsTUFBQSxPQUFBLEdBQUEsT0FBQSxHQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxJQUFBLE1BQUEsR0FBQSxNQUFBLE9BQUEsSUFBQSxJQUFBLE9BQUEsSUFBQSxNQUFBLE9BQUEsSUFBQSxNQUFBLE9BQUEsS0FBQSxLQUFBLE9BQUEsT0FBQSxPQUFBLFNBQUEsS0FBQSxpQ0FBQSxTQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLE9BQUEsS0FBQSx5QkFBQSxNQUFBLE1BQUEsSUFBQSxLQUFBLE1BQUEsRUFBQSxTQUFBLE9BQUEsSUFBQSxPQUFBLEVBQUEsVUFBQSxNQUFBLE9BQUEsTUFBQSxVQUFBLFNBQUEsR0FBQSxVQUFBLE9BQUEsUUFBQSxNQUFBLENBQUEsT0FBQSxNQUFBLEVBQUEsUUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBLE1BQUEsR0FBQSxJQUFBLFNBQUEsS0FBQSxNQUFBLE1BQUEsQ0FBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLE1BQUEsRUFBQSxFQUFBLFVBQUEsTUFBQSxPQUFBLE1BQUEsVUFBQSxTQUFBLEdBQUEsVUFBQSxPQUFBLFNBQUEsTUFBQSxDQUFBLE9BQUEsT0FBQSxFQUFBLFFBQUEsU0FBQSxPQUFBLFNBQUEsT0FBQSxPQUFBLEdBQUEsU0FBQSxLQUFBLE1BQUEsTUFBQSxDQUFBLFNBQUEsT0FBQSxPQUFBLFFBQUEsS0FBQSx5QkFBQSxNQUFBLE1BQUEsU0FBQSxVQUFBLE9BQUEsR0FBQSxLQUFBLDBCQUFBLFNBQUEsUUFBQSxhQUFBLENBQUEsSUFBQSxlQUFBLEtBQUEsaUNBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxhQUFBLEdBQUEsS0FBQSxNQUFBLGFBQUEsSUFBQSxlQUFBLEtBQUEsaUNBQUEsS0FBQSxNQUFBLGFBQUEsR0FBQSxLQUFBLE1BQUEsYUFBQSxHQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLFFBQUEsSUFBQSxPQUFBLE1BQUEsZ0JBQUEsZUFBQSxFQUFBLE1BQUEsZ0JBQUEsZUFBQSxFQUFBLENBQUEsZUFBQSxnQkFBQSxJQUFBLEtBQUEsb0JBQUEsU0FBQSxRQUFBLFNBQUEsV0FBQSxDQUFBLE1BQUEsQ0FBQSxLQUFBLDBCQUFBLFFBQUEsVUFBQSxLQUFBLDBCQUFBLFFBQUEsYUFBQSxHQUFBLEtBQUEsU0FBQSxTQUFBLFNBQUEsU0FBQSxDQUFBLE9BQUEsTUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLE1BQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxNQUFBLE1BQUEsUUFBQSxLQUFBLGlCQUFBLFNBQUEsUUFBQSxTQUFBLFdBQUEsV0FBQSxDQUFBLElBQUEscUJBQUEsS0FBQSxNQUFBLEtBQUEsU0FBQSxRQUFBLFVBQUEsWUFBQSxxQkFBQSxLQUFBLE1BQUEsS0FBQSxTQUFBLFFBQUEsWUFBQSxZQUFBLFVBQUEsQ0FBQSxxQkFBQSxzQkFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLFdBQUEsS0FBQSxFQUFBLFlBQUEsTUFBQSxLQUFBLEVBQUEsWUFBQSxNQUFBLEtBQUEsRUFBQSxLQUFBLFFBQUEsT0FBQSxXQUFBLEtBQUEsc0JBQUEsU0FBQSxxQkFBQSxjQUFBLGNBQUEsZ0JBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLGdCQUFBLHNCQUFBLG1CQUFBLEtBQUEsSUFBQSxFQUFBLGNBQUEsV0FBQSxvQkFBQSxLQUFBLElBQUEsT0FBQSxNQUFBLEVBQUEsY0FBQSxXQUFBLEdBQUEsRUFBQSxxQkFBQSxvQkFBQSxtQkFBQSxLQUFBLFFBQUEsSUFBQSxrQkFBQSxLQUFBLElBQUEsRUFBQSxjQUFBLFdBQUEscUJBQUEsS0FBQSxJQUFBLE9BQUEsT0FBQSxFQUFBLGNBQUEsV0FBQSxnQkFBQSxJQUFBLHVCQUFBLEtBQUEsTUFBQSxtQkFBQSxrQkFBQSxvQkFBQSxtQkFBQSxxQkFBQSxrQkFBQSxxQkFBQSxLQUFBLHFCQUFBLE9BQUEsZ0JBQUEsUUFBQSxLQUFBLGdCQUFBLFNBQUEsUUFBQSxTQUFBLFdBQUEsaUJBQUEsVUFBQSxDQUFBLElBQUEsYUFBQSxhQUFBLG1CQUFBLG1CQUFBLGNBQUEsVUFBQSxJQUFBLE1BQUEsa0JBQUEsYUFBQSxpQkFBQSxFQUFBLGFBQUEsaUJBQUEsRUFBQSxtQkFBQSxtQkFBQSxjQUFBLElBQUEsYUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLFdBQUEsRUFBQSxhQUFBLFNBQUEsRUFBQSxRQUFBLEVBQUEsV0FBQSxFQUFBLG1CQUFBLG1CQUFBLGVBQUEsSUFBQSxVQUFBLHFCQUFBLDZCQUFBLElBQUEsSUFBQSxjQUFBLElBQUEsbUJBQUEsbUJBQUEsSUFBQSxjQUFBLFFBQUEsRUFBQSxRQUFBLEVBQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxhQUFBLGFBQUEsV0FBQSxFQUFBLFdBQUEsR0FBQSxPQUFBLFdBQUEsS0FBQSxXQUFBLFNBQUEsTUFBQSxVQUFBLFVBQUEsQ0FBQSxJQUFBLFFBQUEsWUFBQSxPQUFBLFFBQUEsWUFBQSxNQUFBLFVBQUEsWUFBQSxLQUFBLHlCQUFBLFNBQUEsS0FBQSxDQUFBLElBQUEsUUFBQSxLQUFBLFFBQUEsU0FBQSxLQUFBLFNBQUEsV0FBQSxLQUFBLFdBQUEsV0FBQSxLQUFBLG9CQUFBLFFBQUEsU0FBQSxZQUFBLEdBQUEsRUFBQSxXQUFBLEtBQUEsUUFBQSxJQUFBLFVBQUEsS0FBQSxpQkFBQSxRQUFBLFNBQUEsV0FBQSxZQUFBLG1CQUFBLFFBQUEsa0NBQUEsV0FBQSx3QkFBQSxtQkFBQSxvQkFBQSxFQUFBLGlCQUFBLEtBQUEsR0FBQSxtQkFBQSx3QkFBQSxPQUFBLEVBQUEsSUFBQSxJQUFBLGFBQUEsU0FBQSxFQUFBLFFBQUEsRUFBQSxXQUFBLEVBQUEsYUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLFdBQUEsRUFBQSxvQkFBQSxFQUFBLEVBQUEsd0JBQUEsY0FBQSxLQUFBLE1BQUEsUUFBQSxFQUFBLHFCQUFBLGFBQUEsUUFBQSxJQUFBLGNBQUEsS0FBQSxNQUFBLFFBQUEsRUFBQSxxQkFBQSxhQUFBLFFBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxDQUFBLGlCQUFBLEtBQUEsc0JBQUEsV0FBQSxjQUFBLGNBQUEsR0FBQSxNQUFBLElBQUEsT0FBQSxVQUFBLEtBQUEsZ0JBQUEsUUFBQSxTQUFBLFdBQUEsaUJBQUEsV0FBQSxLQUFBLEtBQUEsV0FBQSxLQUFBLE1BQUEsVUFBQSxXQUFBLE9BQUEsT0FBQSxNQUFBLGlCQUFBLElBQUEsTUFBQSxXQUFBLFFBQUEsVUFBQSxJQUFBLE1BQUEsV0FBQSxRQUFBLFNBQUEsa0JBQUEsSUFBQSxlQUFBLEtBQUEsU0FBQSxLQUFBLE9BQUEsVUFBQSxDQUFBLElBQUEsS0FBQSxDQUFBLElBQUEscUJBQUEsa0JBQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSx5QkFBQSxPQUFBLFNBQUEsa0JBQUEsV0FBQSxDQUFBLEtBQUEscUJBQUEscUJBQUEsUUFBQSxZQUFBLEVBQUEsR0FBQSxLQUFBLFNBQUEsRUFBQSxXQUFBLEtBQUEsaUJBQUEsdUJBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSx1QkFBQSxLQUFBLGlCQUFBLFdBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxXQUFBLEtBQUEsWUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHFCQUFBLFdBQUEsRUFBQSxVQUFBLEtBQUEsT0FBQSxTQUFBLEVBQUEsQ0FBQSxJQUFBLE1BQUEsRUFBQSxPQUFBLEtBQUEsc0JBQUEsTUFBQSxzQkFBQSxLQUFBLFVBQUEsTUFBQSxVQUFBLFNBQUEscUJBQUEsUUFBQSxLQUFBLEtBQUEsQ0FBQSxLQUFBLHNCQUFBLFFBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQSxpQkFBQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsT0FBQSxLQUFBLGlCQUFBLE9BQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxPQUFBLEtBQUEsUUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHVCQUFBLFNBQUEsVUFBQSxNQUFBLE9BQUEsQ0FBQSxHQUFBLFNBQUEsT0FBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsS0FBQSx5Q0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLE9BQUEsT0FBQSxJQUFBLFFBQUEsT0FBQSxFQUFBLElBQUEsR0FBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLFFBQUEsS0FBQSxLQUFBLElBQUEsTUFBQSxRQUFBLFFBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsS0FBQSxPQUFBLElBQUEsS0FBQSxLQUFBLEdBQUEsRUFBQSxLQUFBLGlCQUFBLFFBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxRQUFBLEtBQUEsaUJBQUEsU0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFNBQUEsS0FBQSxpQkFBQSxZQUFBLFVBQUEsQ0FBQSxHQUFBLEtBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxtREFBQSxPQUFBLEtBQUEsUUFBQSxLQUFBLFlBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLE9BQUEsRUFBQSxLQUFBLFNBQUEsR0FBQSxHQUFBLE9BQUEsSUFBQSxFQUFBLFFBQUEsS0FBQSxLQUFBLFFBQUEsR0FBQSxLQUFBLEtBQUEsWUFBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsT0FBQSxFQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQSxLQUFBLFNBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxLQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxPQUFBLEVBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQSxLQUFBLEtBQUEsU0FBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLE1BQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxJQUFBLEtBQUEsS0FBQSxPQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsVUFBQSxTQUFBLEtBQUEsSUFBQSxNQUFBLE9BQUEsQ0FBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsS0FBQSxtQ0FBQSxHQUFBLEVBQUEsUUFBQSxFQUFBLE1BQUEsS0FBQSxzQ0FBQSxJQUFBLE1BQUEsS0FBQSxNQUFBLE9BQUEsSUFBQSxPQUFBLEdBQUEsT0FBQSxLQUFBLFFBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSx3Q0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLE9BQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxPQUFBLEVBQUEsS0FBQSxRQUFBLEVBQUEsS0FBQSxNQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsUUFBQSxHQUFBLEtBQUEsSUFBQSxHQUFBLElBQUEsU0FBQSxVQUFBLGlCQUFBLFVBQUEsQ0FBQSxLQUFBLGlCQUFBLGlCQUFBLEtBQUEsVUFBQSxVQUFBLEtBQUEsaUJBQUEsbUJBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxtQkFBQSxLQUFBLGlCQUFBLFlBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxZQUFBLFNBQUEsZ0JBQUEsVUFBQSxDQUFBLElBQUEsVUFBQSxVQUFBLFVBQUEsR0FBQSxHQUFBLFdBQUEsSUFBQSxFQUFBLFdBQUEsS0FBQSx3QkFBQSxLQUFBLFVBQUEsVUFBQSxLQUFBLGNBQUEsS0FBQSxLQUFBLGlCQUFBLEtBQUEsS0FBQSxRQUFBLFNBQUEsRUFBQSxFQUFBLFlBQUEsQ0FBQSxPQUFBLEtBQUEsVUFBQSxZQUFBLEVBQUEsR0FBQSxhQUFBLEVBQUEsRUFBQSxhQUFBLEdBQUEsS0FBQSxzQkFBQSxVQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsaUJBQUEsT0FBQSxLQUFBLGlCQUFBLElBQUEsSUFBQSxlQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxlQUFBLEtBQUEsUUFBQSxFQUFBLEVBQUEsZ0JBQUEsZUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGdCQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxHQUFBLEtBQUEsaUJBQUEsa0JBQUEsd0JBQUEsZ0JBQUEsTUFBQSxLQUFBLGlCQUFBLE9BQUEsS0FBQSxpQkFBQSxJQUFBLFVBQUEsS0FBQSxVQUFBLFVBQUEsZUFBQSxFQUFBLElBQUEsSUFBQSxLQUFBLFVBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxHQUFBLEtBQUEsSUFBQSxlQUFBLEtBQUEsUUFBQSxFQUFBLEVBQUEsZ0JBQUEsSUFBQSxJQUFBLEVBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxHQUFBLEtBQUEsaUJBQUEsa0JBQUEsd0JBQUEsZ0JBQUEsTUFBQSxLQUFBLGlCQUFBLE9BQUEsS0FBQSxpQkFBQSxLQUFBLCtCQUFBLEtBQUEsWUFBQSxVQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsY0FBQSxPQUFBLEtBQUEsY0FBQSxJQUFBLFVBQUEsS0FBQSxVQUFBLFVBQUEsbUJBQUEsVUFBQSxJQUFBLEVBQUEsR0FBQSxHQUFBLG1CQUFBLE9BQUEsUUFBQSxvQkFBQSxvQkFBQSxJQUFBLElBQUEsWUFBQSxFQUFBLE1BQUEsVUFBQSxHQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxVQUFBLEVBQUEsR0FBQSxNQUFBLElBQUEsWUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGFBQUEsR0FBQSxLQUFBLGNBQUEsUUFBQSx5QkFBQSxhQUFBLE1BQUEsS0FBQSxlQUFBLEtBQUEsY0FBQSxxQkFBQSxVQUFBLE9BQUEsS0FBQSxjQUFBLFlBQUEsRUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLFVBQUEsRUFBQSxHQUFBLE1BQUEsSUFBQSxZQUFBLEtBQUEsUUFBQSxFQUFBLEVBQUEsYUFBQSxHQUFBLEtBQUEsY0FBQSxRQUFBLHlCQUFBLGFBQUEsTUFBQSxLQUFBLGVBQUEsS0FBQSxjQUFBLHFCQUFBLFVBQUEsT0FBQSxLQUFBLGNBQUEsS0FBQSxxQkFBQSxLQUFBLGNBQUEsVUFBQSxDQUFBLElBQUEsV0FBQSxLQUFBLHdCQUFBLFFBQUEsS0FBQSxjQUFBLFNBQUEsU0FBQSxhQUFBLFdBQUEsVUFBQSxVQUFBLEtBQUEsVUFBQSxVQUFBLFNBQUEsZ0JBQUEsS0FBQSxVQUFBLFdBQUEsSUFBQSxJQUFBLGdCQUFBLFFBQUEsdUJBQUEsVUFBQSxDQUFBLEVBQUEsT0FBQSxJQUFBLE1BQUEsUUFBQSxnQkFBQSxhQUFBLEVBQUEsWUFBQSxFQUFBLFNBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxVQUFBLE1BQUEsUUFBQSxJQUFBLElBQUEsRUFBQSxVQUFBLFVBQUEsRUFBQSxNQUFBLE1BQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxNQUFBLGdCQUFBLFlBQUEsRUFBQSxJQUFBLEtBQUEsV0FBQSxjQUFBLEVBQUEsS0FBQSxVQUFBLFlBQUEsRUFBQSxJQUFBLEtBQUEsYUFBQSxHQUFBLEdBQUEsV0FBQSxPQUFBLGdCQUFBLFlBQUEsU0FBQSxFQUFBLFlBQUEsSUFBQSxXQUFBLENBQUEsRUFBQSxHQUFBLGNBQUEsUUFBQSxlQUFBLEtBQUEsc0JBQUEsT0FBQSxRQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxTQUFBLGFBQUEsQ0FBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxFQUFBLElBQUEsS0FBQSxLQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLE9BQUEsRUFBQSxHQUFBLEdBQUEsU0FBQSxhQUFBLENBQUEsS0FBQSxnQkFBQSxTQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxFQUFBLElBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsTUFBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsU0FBQSxhQUFBLENBQUEsS0FBQSxnQkFBQSxTQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxFQUFBLElBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsT0FBQSxJQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxJQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsS0FBQSxFQUFBLEVBQUEsTUFBQSxDQUFBLEVBQUEsTUFBQSxLQUFBLEdBQUEsR0FBQSxTQUFBLGFBQUEsQ0FBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxFQUFBLElBQUEsS0FBQSxLQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLEtBQUEsRUFBQSxFQUFBLE9BQUEsSUFBQSxDQUFBLEVBQUEsTUFBQSxLQUFBLEVBQUEsSUFBQSxTQUFBLGFBQUEsQ0FBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxFQUFBLElBQUEsS0FBQSxLQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLElBQUEsQ0FBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLFNBQUEsbUJBQUEsTUFBQSxDQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUEsT0FBQSxTQUFBLFNBQUEsS0FBQSxDQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsVUFBQSxLQUFBLE1BQUEsVUFBQSxxQkFBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxxQkFBQSxPQUFBLElBQUEscUJBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxXQUFBLENBQUEsRUFBQSxRQUFBLENBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsS0FBQSxXQUFBLEtBQUEsTUFBQSxJQUFBLFdBQUEsRUFBQSxFQUFBLElBQUEscUJBQUEscUJBQUEsT0FBQSxFQUFBLEdBQUEsS0FBQSxHQUFBLE9BQUEsUUFBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLFFBQUEsSUFBQSxJQUFBLFNBQUEsSUFBQSxVQUFBLEtBQUEsTUFBQSxzQkFBQSxXQUFBLEtBQUEsc0JBQUEsS0FBQSxNQUFBLGNBQUEsS0FBQSxHQUFBLFNBQUEsTUFBQSxNQUFBLFdBQUEsR0FBQSxNQUFBLFdBQUEsR0FBQSxlQUFBLEtBQUEsbUJBQUEsT0FBQSxnQkFBQSxLQUFBLG9CQUFBLE1BQUEsZUFBQSxZQUFBLEVBQUEsRUFBQSxFQUFBLGVBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxTQUFBLFNBQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxJQUFBLGVBQUEsSUFBQSxHQUFBLEVBQUEsU0FBQSxLQUFBLDBDQUFBLFNBQUEsVUFBQSxNQUFBLGNBQUEsU0FBQSxVQUFBLGdCQUFBLE1BQUEsS0FBQSxzQkFBQSxTQUFBLEVBQUEsRUFBQSxFQUFBLENBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLENBQUEsSUFBQSxLQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxNQUFBLEtBQUEsTUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSxFQUFBLEtBQUEsTUFBQSxJQUFBLEVBQUEsUUFBQSxLQUFBLE1BQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxVQUFBLE1BQUEsVUFBQSxNQUFBLFVBQUEsTUFBQSxHQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsS0FBQSxLQUFBLG1CQUFBLEVBQUEsVUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSx1QkFBQSxNQUFBLGVBQUEsTUFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLFFBQUEsd0JBQUEsRUFBQSxRQUFBLE1BQUEsUUFBQSxDQUFBLEVBQUEsTUFBQSxDQUFBLElBQUEsV0FBQSxFQUFBLE9BQUEsTUFBQSxPQUFBLE1BQUEsS0FBQSxNQUFBLFNBQUEsRUFBQSxlQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsRUFBQSxjQUFBLEtBQUEsTUFBQSxjQUFBLFdBQUEsUUFBQSxFQUFBLEVBQUEsY0FBQSxNQUFBLG1CQUFBLFdBQUEsUUFBQSxFQUFBLEVBQUEsVUFBQSxPQUFBLGNBQUEsV0FBQSxFQUFBLEVBQUEsVUFBQSxPQUFBLGNBQUEsV0FBQSxJQUFBLGlCQUFBLEVBQUEsZUFBQSxHQUFBLEdBQUEsR0FBQSxpQkFBQSxLQUFBLDhDQUFBLElBQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxrQkFBQSxNQUFBLEVBQUEsVUFBQSxTQUFBLE1BQUEsRUFBQSxVQUFBLFNBQUEsT0FBQSxJQUFBLE1BQUEsTUFBQSxRQUFBLEtBQUEsbUJBQUEsU0FBQSxhQUFBLENBQUEsSUFBQSxVQUFBLGFBQUEsT0FBQSxHQUFBLEdBQUEsVUFBQSxPQUFBLElBQUEsTUFBQSxhQUFBLGVBQUEsSUFBQSxJQUFBLElBQUEsT0FBQSxJQUFBLE1BQUEsV0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsR0FBQSxVQUFBLEVBQUEsSUFBQSxHQUFBLGFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxHQUFBLFVBQUEsS0FBQSxzREFBQSxPQUFBLFFBQUEsS0FBQSxvQkFBQSxTQUFBLGVBQUEsZUFBQSxXQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsZUFBQSxPQUFBLE9BQUEsSUFBQSxNQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLFFBQUEsZUFBQSxJQUFBLFlBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsR0FBQSxJQUFBLFlBQUEsS0FBQSxNQUFBLFNBQUEsWUFBQSxNQUFBLGNBQUEsRUFBQSxLQUFBLE1BQUEsU0FBQSxlQUFBLEdBQUEsY0FBQSxPQUFBLEdBQUEsS0FBQSxNQUFBLFNBQUEsZUFBQSxXQUFBLFdBQUEsS0FBQSxNQUFBLFFBQUEsY0FBQSxhQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsU0FBQSxPQUFBLEdBQUEsWUFBQSxPQUFBLFFBQUEsU0FBQSxVQUFBLE1BQUEsYUFBQSxDQUFBLEdBQUEsTUFBQSxjQUFBLEdBQUEsYUFBQSxPQUFBLEtBQUEsMkJBQUEsS0FBQSxNQUFBLE1BQUEsSUFBQSxtQkFBQSxhQUFBLE9BQUEsR0FBQSxtQkFBQSxHQUFBLEdBQUEsYUFBQSxHQUFBLENBQUEsSUFBQSxJQUFBLGFBQUEsRUFBQSxtQkFBQSxjQUFBLEdBQUEsYUFBQSxlQUFBLGVBQUEsR0FBQSxjQUFBLG1CQUFBLEtBQUEsYUFBQSxNQUFBLEtBQUEsaUJBQUEsQ0FBQSxLQUFBLGFBQUEsSUFBQSxNQUFBLG1CQUFBLGNBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsYUFBQSxPQUFBLElBQUEsS0FBQSxhQUFBLEdBQUEsRUFBQSxJQUFBLElBQUEsR0FBQSxFQUFBLEdBQUEsS0FBQSxhQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsSUFBQSxhQUFBLGFBQUEsVUFBQSxLQUFBLGFBQUEsYUFBQSxLQUFBLGlCQUFBLE9BQUEsVUFBQSxDQUFBLE9BQUEsR0FBQSxLQUFBLGFBQUEsS0FBQSxLQUFBLGlCQUFBLFNBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxhQUFBLE9BQUEsSUFBQSxLQUFBLGlCQUFBLGVBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxlQUFBLEtBQUEsZUFBQSxTQUFBLE9BQUEsQ0FBQSxPQUFBLEtBQUEsYUFBQSxLQUFBLGFBQUEsT0FBQSxFQUFBLFNBQUEsS0FBQSxXQUFBLFNBQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLE9BQUEsS0FBQSxlQUFBLEdBQUEsSUFBQSxLQUFBLEtBQUEsYUFBQSxPQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxJQUFBLE9BQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsT0FBQSxNQUFBLGNBQUEsT0FBQSxLQUFBLGFBQUEsSUFBQSxPQUFBLE9BQUEsSUFBQSxJQUFBLFFBQUEsS0FBQSxhQUFBLEdBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLFFBQUEsTUFBQSxjQUFBLEtBQUEsTUFBQSxTQUFBLEVBQUEsU0FBQSxLQUFBLGFBQUEsSUFBQSxPQUFBLFNBQUEsS0FBQSxjQUFBLFNBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxPQUFBLE1BQUEsTUFBQSxLQUFBLDBDQUFBLEdBQUEsS0FBQSxLQUFBLE9BQUEsTUFBQSxHQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsSUFBQSxvQkFBQSxLQUFBLGFBQUEsbUJBQUEsTUFBQSxhQUFBLEdBQUEsb0JBQUEsT0FBQSxtQkFBQSxPQUFBLENBQUEsSUFBQSxLQUFBLG9CQUFBLG9CQUFBLG1CQUFBLG1CQUFBLEtBQUEsSUFBQSxJQUFBLFFBQUEsSUFBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxtQkFBQSxPQUFBLG9CQUFBLE9BQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxLQUFBLFFBQUEsSUFBQSxtQkFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLFdBQUEsRUFBQSxtQkFBQSxPQUFBLElBQUEsUUFBQSxHQUFBLE1BQUEsY0FBQSxvQkFBQSxFQUFBLFlBQUEsbUJBQUEsSUFBQSxPQUFBLElBQUEsVUFBQSxNQUFBLFVBQUEsS0FBQSxVQUFBLFNBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxPQUFBLE1BQUEsTUFBQSxLQUFBLDBDQUFBLEdBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxjQUFBLEtBQUEsYUFBQSxRQUFBLGNBQUEsT0FBQSxjQUFBLE1BQUEsYUFBQSxRQUFBLGNBQUEsT0FBQSxRQUFBLElBQUEsTUFBQSxRQUFBLFFBQUEsR0FBQSxFQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLE9BQUEsY0FBQSxHQUFBLEVBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxRQUFBLEVBQUEsR0FBQSxNQUFBLGNBQUEsUUFBQSxFQUFBLEdBQUEsS0FBQSxNQUFBLFNBQUEsT0FBQSxjQUFBLEtBQUEsT0FBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLFVBQUEsS0FBQSxVQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsR0FBQSxPQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUEsR0FBQSxHQUFBLE9BQUEsT0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLEtBQUEsYUFBQSxPQUFBLFFBQUEsSUFBQSxNQUFBLE1BQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsU0FBQSxLQUFBLGFBQUEsR0FBQSxRQUFBLE9BQUEsSUFBQSxVQUFBLEtBQUEsTUFBQSxVQUFBLEtBQUEsbUJBQUEsU0FBQSxPQUFBLFlBQUEsQ0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLDJCQUFBLEdBQUEsR0FBQSxZQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsS0FBQSxhQUFBLE9BQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLFFBQUEsT0FBQSxJQUFBLFFBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUEsYUFBQSxHQUFBLGFBQUEsT0FBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLFVBQUEsS0FBQSxPQUFBLFNBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxPQUFBLE1BQUEsTUFBQSxLQUFBLDBDQUFBLEdBQUEsTUFBQSxLQUFBLEtBQUEsY0FBQSxJQUFBLElBQUEsU0FBQSxLQUFBLE1BQUEsS0FBQSxVQUFBLEtBQUEsdUJBQUEsTUFBQSxlQUFBLE1BQUEsUUFBQSw4QkFBQSxLQUFBLE1BQUEsUUFBQSx3QkFBQSxVQUFBLFFBQUEsTUFBQSxRQUFBLENBQUEsVUFBQSxNQUFBO0lBQ0EsSUFBQSxpQkFBQSxVQUFBLE9BQUEsTUFBQSxPQUFBLE1BQUEsS0FBQSxNQUFBLFNBQUEsVUFBQSxlQUFBLFVBQUEsUUFBQSwrQkFBQSxLQUFBLE1BQUEsbUJBQUEsaUJBQUEsT0FBQSxrQkFBQSxLQUFBLE1BQUEsY0FBQSxpQkFBQSxPQUFBLFNBQUEsU0FBQSxjQUFBLG1CQUFBLFVBQUEsVUFBQSxjQUFBLE1BQUEsT0FBQSxJQUFBLE1BQUEsU0FBQSxZQUFBLFNBQUEsTUFBQSxVQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxLQUFBLEtBQUEsU0FBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxHQUFBLE1BQUEsR0FBQSxXQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEtBQUEsU0FBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsTUFBQSxHQUFBLElBQUEsR0FBQSxFQUFBLEtBQUEsS0FBQSxJQUFBLFVBQUEsS0FBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsSUFBQSxNQUFBLEdBQUEsSUFBQSxHQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsVUFBQSxLQUFBLElBQUEsTUFBQSxNQUFBLEtBQUEsaUJBQUEsT0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxpQkFBQSxNQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsTUFBQSxLQUFBLGNBQUEsU0FBQSxPQUFBLFlBQUEsQ0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLDJCQUFBLEdBQUEsR0FBQSxZQUFBLE9BQUEsS0FBQSxJQUFBLElBQUEsYUFBQSxJQUFBLE1BQUEsT0FBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLGFBQUEsT0FBQSxJQUFBLGFBQUEsR0FBQSxFQUFBLE9BQUEsYUFBQSxHQUFBLFlBQUEsSUFBQSxVQUFBLEtBQUEsZUFBQSxLQUFBLElBQUEsU0FBQSxFQUFBLENBQUEsT0FBQSxLQUFBLFNBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsS0FBQSwyQkFBQSxPQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsUUFBQSxTQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxLQUFBLDZCQUFBLE9BQUEsS0FBQSxTQUFBLElBQUEsS0FBQSxTQUFBLEtBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsT0FBQSxHQUFBLEdBQUEsR0FBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsS0FBQSxTQUFBLENBQUEsS0FBQSxTQUFBLEdBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxTQUFBLFFBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLEVBQUEsUUFBQSxLQUFBLENBQUEsUUFBQSxPQUFBLEdBQUEsQ0FBQSxNQUFBLFNBQUEsY0FBQSxLQUFBLEtBQUEsb0JBQUEsQ0FBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsRUFBQSxLQUFBLG9CQUFBLG9CQUFBLEtBQUEsaUJBQUEsc0JBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxzQkFBQSxLQUFBLGlCQUFBLFFBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxRQUFBLEtBQUEsaUJBQUEsSUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLElBQUEsS0FBQSxpQkFBQSxJQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsSUFBQSxLQUFBLGVBQUEsVUFBQSxDQUFBLEtBQUEsU0FBQSxLQUFBLFlBQUEsU0FBQSxXQUFBLEVBQUEsRUFBQSxDQUFBLEdBQUEsS0FBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFlBQUEsS0FBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFdBQUEsQ0FBQSxJQUFBLGVBQUEsS0FBQSxJQUFBLFdBQUEsS0FBQSxxQkFBQSxPQUFBLEdBQUEsZ0JBQUEsZUFBQSxLQUFBLHFCQUFBLEVBQUEsTUFBQSxDQUFBLEdBQUEsU0FBQSxrQkFBQSxlQUFBLENBQUEsS0FBQSxXQUFBLGVBQUEsR0FBQSxLQUFBLFFBQUEsZUFBQSxHQUFBLEtBQUEsU0FBQSxlQUFBLEdBQUEsS0FBQSxpQkFBQSxhQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsYUFBQSxLQUFBLGlCQUFBLFVBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUEsaUJBQUEsV0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFdBQUEsU0FBQSxxQkFBQSxDQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLFdBQUEsQ0FBQSxFQUFBLEtBQUEscUJBQUEsSUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxLQUFBLG9CQUFBLEtBQUEsS0FBQSxpQkFBQSx1QkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHFCQUFBLEdBQUEsRUFBQSxLQUFBLHFCQUFBLEdBQUEsRUFBQSxLQUFBLHFCQUFBLEdBQUEsRUFBQSxLQUFBLHFCQUFBLEdBQUEsRUFBQSxLQUFBLHFCQUFBLEdBQUEsRUFBQSxLQUFBLHVCQUFBLEtBQUEsa0JBQUEsU0FBQSxXQUFBLENBQUEsSUFBQSxJQUFBLGdCQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxNQUFBLFdBQUEsR0FBQSxHQUFBLEdBQUEsTUFBQSxNQUFBLENBQUEsRUFBQSxpQkFBQSxNQUFBLEdBQUEsRUFBQSxnQkFBQSxNQUFBLENBQUEsRUFBQSxJQUFBLFdBQUEsS0FBQSxNQUFBLENBQUEsaUJBQUEsb0JBQUEsR0FBQSxZQUFBLEtBQUEsTUFBQSxXQUFBLEdBQUEsT0FBQSxLQUFBLElBQUEsWUFBQSxXQUFBLElBQUEscUJBQUEsYUFBQSxLQUFBLElBQUEsWUFBQSxXQUFBLElBQUEscUJBQUEsYUFBQSxLQUFBLElBQUEsRUFBQSxZQUFBLFdBQUEsSUFBQSxxQkFBQSxFQUFBLGFBQUEsS0FBQSxJQUFBLFlBQUEsV0FBQSxJQUFBLHFCQUFBLGFBQUEsS0FBQSxJQUFBLFlBQUEsV0FBQSxJQUFBLHFCQUFBLGFBQUEsS0FBQSxjQUFBLFNBQUEsV0FBQSxJQUFBLENBQUEsT0FBQSxJQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLEdBQUEsS0FBQSxtQkFBQSxTQUFBLE9BQUEsUUFBQSxTQUFBLHdCQUFBLENBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxNQUFBLEtBQUEsT0FBQSxPQUFBLFdBQUEsS0FBQSxxQkFBQSxFQUFBLE9BQUEsR0FBQSxHQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsRUFBQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxJQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLEdBQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLEtBQUEsR0FBQSxHQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsR0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLEtBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLENBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsR0FBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxNQUFBLFdBQUEsSUFBQSxTQUFBLE9BQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxXQUFBLElBQUEsU0FBQSxPQUFBLElBQUEsSUFBQSxnQkFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLE9BQUEsRUFBQSxLQUFBLElBQUEsZ0JBQUEsMEJBQUEsRUFBQSx3QkFBQSxJQUFBLEtBQUEsa0JBQUEsWUFBQSxLQUFBLGNBQUEsV0FBQSxHQUFBLEtBQUEsS0FBQSxxQkFBQSxTQUFBLE9BQUEsUUFBQSxTQUFBLHdCQUFBLENBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxNQUFBLEtBQUEsT0FBQSxNQUFBLFdBQUEsS0FBQSxxQkFBQSxFQUFBLE9BQUEsR0FBQSxHQUFBLE1BQUEsRUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsRUFBQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxJQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLEdBQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLEtBQUEsR0FBQSxHQUFBLE1BQUEsRUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsR0FBQSxNQUFBLEVBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLEtBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLFFBQUEsT0FBQSxRQUFBLFdBQUEsR0FBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxNQUFBLFdBQUEsSUFBQSxTQUFBLE9BQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxNQUFBLEVBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxXQUFBLElBQUEsU0FBQSxPQUFBLElBQUEsSUFBQSxnQkFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLE9BQUEsRUFBQSxLQUFBLElBQUEsZ0JBQUEsMEJBQUEsd0JBQUEsSUFBQSxLQUFBLGtCQUFBLFlBQUEsS0FBQSxjQUFBLFdBQUEsR0FBQSxLQUFBLEtBQUEscUJBQUEsU0FBQSxXQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsZ0JBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxRQUFBLEtBQUEsY0FBQSxXQUFBLEdBQUEsUUFBQSxLQUFBLG1CQUFBLEVBQUEsS0FBQSxNQUFBLFNBQUEsV0FBQSxHQUFBLGlCQUFBLEdBQUEsQ0FBQSxNQUFBLFdBQUEsUUFBQSxLQUFBLHFCQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUEsTUFBQSxTQUFBLFdBQUEsR0FBQSxpQkFBQSxDQUFBLE1BQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxvQkFBQSxnQkFBQSxFQUFBLE1BQUEsQ0FBQSxFQUFBLElBQUEsS0FBQSxnQkFBQSxPQUFBLE1BQUEsRUFBQSxJQUFBLE1BQUEsUUFBQSxDQUFBLElBQUEsT0FBQSxLQUFBLGdCQUFBLE9BQUEsR0FBQSxPQUFBLFlBQUEsb0JBQUEsUUFBQSxTQUFBLENBQUEsT0FBQSxpQkFBQSxNQUFBLENBQUEsRUFBQSxPQUFBLEdBQUEsQ0FBQSxNQUFBLENBQUEsSUFBQSxNQUFBLElBQUEsY0FBQSxRQUFBLFFBQUEscUJBQUEsS0FBQSxnQkFBQSxLQUFBLE9BQUEsTUFBQSxLQUFBLHFCQUFBLEtBQUEsb0JBQUEseUJBQUEsT0FBQSxNQUFBLENBQUEsRUFBQSxNQUFBLENBQUEsR0FBQSxLQUFBLG1CQUFBLFVBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsRUFBQSxVQUFBLEtBQUEsdUNBQUEsR0FBQSxVQUFBLEVBQUEsQ0FBQSxJQUFBLElBQUEsZ0JBQUEsRUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsaUJBQUEsS0FBQSxnQkFBQSxHQUFBLG9CQUFBLElBQUEsSUFBQSxRQUFBLGdCQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxnQkFBQSxRQUFBLEtBQUEsZ0JBQUEsT0FBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLFFBQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsSUFBQSxRQUFBLG9CQUFBLFNBQUEsR0FBQSxVQUFBLEtBQUEsZ0JBQUEsT0FBQSxHQUFBLE1BQUEsT0FBQSxLQUFBLGdCQUFBLE1BQUEsRUFBQSxJQUFBLE1BQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLGdCQUFBLEtBQUEsS0FBQSxZQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsR0FBQSxJQUFBLE9BQUEsRUFBQSxJQUFBLElBQUEscUJBQUEsS0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLE9BQUEsS0FBQSxnQkFBQSxHQUFBLEdBQUEsT0FBQSxPQUFBLGNBQUEsQ0FBQSxHQUFBLE1BQUEscUJBQUEsT0FBQSxLQUFBLFdBQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxDQUFBLEtBQUEsSUFBQSxxQkFBQSxFQUFBLE9BQUEsR0FBQSxLQUFBLElBQUEscUJBQUEsRUFBQSxPQUFBLElBQUEsR0FBQSxxQkFBQSxRQUFBLE9BQUEsR0FBQSxLQUFBLDZCQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsZUFBQSxFQUFBLGdCQUFBLEVBQUEsSUFBQSxLQUFBLGdCQUFBLE9BQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxRQUFBLEtBQUEsZ0JBQUEsR0FBQSxRQUFBLE9BQUEsZ0JBQUEsaUJBQUEsaUJBQUEsUUFBQSxxQkFBQSxHQUFBLEVBQUEsZUFBQSxNQUFBLENBQUEsRUFBQSxJQUFBLElBQUEsUUFBQSxnQkFBQSxJQUFBLGVBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsUUFBQSxLQUFBLGdCQUFBLEdBQUEsZ0JBQUEsS0FBQSxJQUFBLFFBQUEsb0JBQUEsU0FBQSxNQUFBLElBQUEsaUJBQUEsZ0JBQUEsS0FBQSxrQkFBQSxTQUFBLE1BQUEsQ0FBQSxJQUFBLFVBQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxNQUFBLElBQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxPQUFBLE1BQUEsTUFBQSxLQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsY0FBQSxDQUFBLFNBQUEsT0FBQSxhQUFBLE1BQUEsVUFBQSxJQUFBLElBQUEsS0FBQSxDQUFBLEVBQUEsV0FBQSxJQUFBLE1BQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEdBQUEsQ0FBQSxLQUFBLEdBQUEsTUFBQSxDQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxhQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEdBQUEsTUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLElBQUEsRUFBQSxlQUFBLGVBQUEsV0FBQSxxQkFBQSxHQUFBLElBQUEsRUFBQSxjQUFBLEdBQUEsR0FBQSxhQUFBLEdBQUEsS0FBQSxrQkFBQSxZQUFBLENBQUEsSUFBQSxVQUFBLEtBQUEscUJBQUEsV0FBQSxFQUFBLEdBQUEsR0FBQSxVQUFBLEdBQUEsTUFBQSxFQUFBLEtBQUEsV0FBQSxLQUFBLEtBQUEsbUNBQUEsQ0FBQSxJQUFBLFFBQUEsS0FBQSxjQUFBLFFBQUEsV0FBQSxLQUFBLEdBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxFQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsVUFBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsRUFBQSxPQUFBLFFBQUEsSUFBQSxhQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLE9BQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsYUFBQSxPQUFBLFdBQUEsRUFBQSxxQkFBQSxXQUFBLGdCQUFBLEdBQUEsS0FBQSxrQkFBQSxZQUFBLENBQUEsSUFBQSxVQUFBLEtBQUEscUJBQUEsV0FBQSxFQUFBLE1BQUEsWUFBQSxNQUFBLFdBQUEsR0FBQSxLQUFBLGFBQUEsS0FBQSxrQ0FBQSxJQUFBLFlBQUEsS0FBQSxxQkFBQSxPQUFBLE9BQUEsa0JBQUEsYUFBQSxJQUFBLGtCQUFBLGNBQUEsU0FBQSxpQkFBQSxLQUFBLEtBQUEsb0JBQUEsQ0FBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsRUFBQSxLQUFBLG9CQUFBLG9CQUFBLEtBQUEsaUJBQUEsc0JBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxzQkFBQSxLQUFBLGlCQUFBLFFBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxRQUFBLEtBQUEsaUJBQUEsSUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLEtBQUEsaUJBQUEsSUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLEtBQUEsZUFBQSxVQUFBLENBQUEsS0FBQSxTQUFBLEtBQUEsWUFBQSxTQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsR0FBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsWUFBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsV0FBQSxDQUFBLElBQUEsZUFBQSxLQUFBLElBQUEsV0FBQSxLQUFBLHFCQUFBLE9BQUEsR0FBQSxnQkFBQSxlQUFBLEtBQUEscUJBQUEsRUFBQSxNQUFBLENBQUEsR0FBQSxTQUFBLHVCQUFBLE1BQUEsT0FBQSxPQUFBLE1BQUEsT0FBQSxXQUFBLG9CQUFBLENBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxnQkFBQSxJQUFBLE1BQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxXQUFBLFdBQUEsS0FBQSxxQkFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEdBQUEsS0FBQSxvQkFBQSxvQkFBQSxLQUFBLGNBQUEsU0FBQSxXQUFBLElBQUEsQ0FBQSxPQUFBLElBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxHQUFBLEtBQUEsa0JBQUEsU0FBQSxXQUFBLENBQUEsSUFBQSxJQUFBLFdBQUEsS0FBQSxXQUFBLFlBQUEsV0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxXQUFBLFdBQUEsS0FBQSxZQUFBLE1BQUEsQ0FBQSxFQUFBLE1BQUEsQ0FBQSxHQUFBLEtBQUEsbUJBQUEsU0FBQSxPQUFBLFFBQUEsU0FBQSx3QkFBQSxDQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxLQUFBLHFCQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxFQUFBLE9BQUEsR0FBQSxHQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQSxXQUFBLEdBQUEsU0FBQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxJQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxXQUFBLEdBQUEsU0FBQSxPQUFBLElBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEdBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsSUFBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxNQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxDQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLGdCQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLE9BQUEsRUFBQSxLQUFBLElBQUEsZ0JBQUEsMEJBQUEsRUFBQSx3QkFBQSxJQUFBLEtBQUEsa0JBQUEsWUFBQSxLQUFBLGNBQUEsV0FBQSxHQUFBLEtBQUEsS0FBQSxxQkFBQSxTQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxnQkFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxRQUFBLEtBQUEsY0FBQSxXQUFBLEdBQUEsUUFBQSxLQUFBLG1CQUFBLEVBQUEsS0FBQSxNQUFBLFNBQUEsRUFBQSxXQUFBLEdBQUEsaUJBQUEsR0FBQSxDQUFBLE1BQUEsU0FBQSxDQUFBLElBQUEsSUFBQSxvQkFBQSxDQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQSxLQUFBLGdCQUFBLE9BQUEsTUFBQSxFQUFBLElBQUEsTUFBQSxRQUFBLENBQUEsSUFBQSxPQUFBLEtBQUEsZ0JBQUEsT0FBQSxHQUFBLE9BQUEsWUFBQSxvQkFBQSxRQUFBLFNBQUEsT0FBQSxJQUFBLGlCQUFBLFFBQUEsUUFBQSxxQkFBQSxJQUFBLE1BQUEsSUFBQSxpQkFBQSxRQUFBLFFBQUEscUJBQUEsS0FBQSxnQkFBQSxLQUFBLE9BQUEsTUFBQSxLQUFBLHFCQUFBLEtBQUEsb0JBQUEseUJBQUEsT0FBQSxPQUFBLE1BQUEsS0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsT0FBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxPQUFBLE1BQUEsUUFBQSxRQUFBLFFBQUEsR0FBQSxXQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsR0FBQSxLQUFBLEVBQUEsT0FBQSxLQUFBLE9BQUEsQ0FBQSxJQUFBLEVBQUEsU0FBQSxJQUFBLEVBQUEsTUFBQSxLQUFBLEdBQUEsRUFBQSxFQUFBLEtBQUEsR0FBQSxJQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxFQUFBLE9BQUEsS0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLE9BQUEsTUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLGFBQUEsRUFBQSxLQUFBLEdBQUEsQ0FBQSxHQUFBLE1BQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxHQUFBLEdBQUEsYUFBQSxXQUFBLHFCQUFBLEdBQUEsR0FBQSxhQUFBLENBQUEsR0FBQSxLQUFBLGtCQUFBLFlBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxxQkFBQSxXQUFBLEVBQUEsR0FBQSxHQUFBLE1BQUEsVUFBQSxPQUFBLFVBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxhQUFBLE9BQUEsV0FBQSxFQUFBLHFCQUFBLEdBQUEsY0FBQSxlQUFBLFdBQUEsZ0JBQUEsSUFBQSxHQUFBLEtBQUEsa0JBQUEsWUFBQSxDQUFBLElBQUEsVUFBQSxLQUFBLHFCQUFBLFdBQUEsRUFBQSxNQUFBLEdBQUEsTUFBQSxVQUFBLE9BQUEsV0FBQSxHQUFBLEdBQUEsS0FBQSxnQkFBQSxPQUFBLE9BQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsMkNBQUEsU0FBQSxzQkFBQSxPQUFBLFFBQUEsdUJBQUEsQ0FBQSxLQUFBLGFBQUEsRUFBQSxLQUFBLFdBQUEsRUFBQSxLQUFBLFdBQUEsRUFBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLHVCQUFBLHVCQUFBLEdBQUEsUUFBQSxLQUFBLGVBQUEsRUFBQSxTQUFBLElBQUEsSUFBQSxRQUFBLEtBQUEsZUFBQSxFQUFBLFNBQUEsSUFBQSxJQUFBLFVBQUEsS0FBQSxlQUFBLEdBQUEsS0FBQSxZQUFBLFNBQUEsUUFBQSxDQUFBLElBQUEsS0FBQSxFQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUEsRUFBQSxDQUFBLElBQUEsSUFBQSxLQUFBLEVBQUEsRUFBQSxFQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsR0FBQSxFQUFBLE9BQUEsT0FBQSxLQUFBLFdBQUEsUUFBQSxFQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsS0FBQSxjQUFBLE9BQUEsS0FBQSxXQUFBLFFBQUEsRUFBQSxLQUFBLFlBQUEsUUFBQSxLQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLFdBQUEsRUFBQSxJQUFBLE9BQUEsR0FBQSxFQUFBLE9BQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxLQUFBLGNBQUEsUUFBQSxTQUFBLEtBQUEsV0FBQSxHQUFBLEtBQUEsZUFBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLGVBQUEsR0FBQSxTQUFBLEtBQUEsV0FBQSxJQUFBLEtBQUEsV0FBQSxLQUFBLFdBQUEsUUFBQSxFQUFBLEtBQUEsV0FBQSxJQUFBLEtBQUEsV0FBQSxFQUFBLEtBQUEsWUFBQSxLQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUEsRUFBQSxHQUFBLENBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxXQUFBLEVBQUEsSUFBQSxPQUFBLEdBQUEsRUFBQSxJQUFBLGVBQUEsQ0FBQSxLQUFBLE9BQUEsS0FBQSxjQUFBLFFBQUEsU0FBQSxLQUFBLFdBQUEsR0FBQSxLQUFBLGVBQUEsSUFBQSxnQkFBQSxLQUFBLE9BQUEsS0FBQSxlQUFBLFNBQUEsS0FBQSxXQUFBLEVBQUEsR0FBQSxLQUFBLGVBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLFNBQUEsS0FBQSxXQUFBLEVBQUEsR0FBQSxJQUFBLE9BQUEsR0FBQSxFQUFBLFFBQUEsR0FBQSxTQUFBLEtBQUEsV0FBQSxFQUFBLElBQUEsSUFBQSxlQUFBLENBQUEsS0FBQSxPQUFBLEtBQUEsY0FBQSxRQUFBLEdBQUEsU0FBQSxLQUFBLFdBQUEsRUFBQSxJQUFBLE9BQUEsS0FBQSxlQUFBLGdCQUFBLGVBQUEsS0FBQSxXQUFBLEtBQUEsV0FBQSxDQUFBLFFBQUEsR0FBQSxFQUFBLEtBQUEsV0FBQSxJQUFBLEtBQUEsV0FBQSxFQUFBLEtBQUEsWUFBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLFNBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxhQUFBLEtBQUEsT0FBQSxPQUFBLEtBQUEsdUJBQUEsRUFBQSxFQUFBLEtBQUEsWUFBQSxJQUFBLEtBQUEsY0FBQSxTQUFBLGNBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxJQUFBLENBQUEsR0FBQSxlQUFBLE9BQUEsRUFBQSxNQUFBLFFBQUEsT0FBQSxLQUFBLFlBQUEsT0FBQSxxQkFBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSx3QkFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEsV0FBQSxRQUFBLEVBQUEsUUFBQSxHQUFBLG9CQUFBLElBQUEsTUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsT0FBQSxFQUFBLENBQUEsUUFBQSxLQUFBLFlBQUEsSUFBQSxJQUFBLFlBQUEsS0FBQSxNQUFBLFFBQUEsSUFBQSxhQUFBLFFBQUEsR0FBQSxTQUFBLG9CQUFBLGFBQUEsU0FBQSxvQkFBQSxjQUFBLFFBQUEsT0FBQSxHQUFBLFNBQUEsUUFBQSxLQUFBLFlBQUEsR0FBQSxTQUFBLG9CQUFBLFNBQUEsUUFBQSxTQUFBLE9BQUEsR0FBQSxPQUFBLFNBQUEsS0FBQSxnQkFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEsV0FBQSxRQUFBLEVBQUEsUUFBQSxHQUFBLEdBQUEsUUFBQSxHQUFBLFFBQUEsS0FBQSxZQUFBLElBQUEsSUFBQSxVQUFBLFNBQUEsS0FBQSxHQUFBLFVBQUEsU0FBQSxLQUFBLFFBQUEsR0FBQSxHQUFBLFFBQUEsUUFBQSxLQUFBLFlBQUEsR0FBQSxHQUFBLFVBQUEsU0FBQSxLQUFBLFFBQUEsR0FBQSxHQUFBLFNBQUEsUUFBQSxLQUFBLFlBQUEsR0FBQSxRQUFBLEdBQUEsU0FBQSxjQUFBLE9BQUEsR0FBQSxPQUFBLFNBQUEsS0FBQSxpQkFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEsV0FBQSxRQUFBLEVBQUEsT0FBQSxJQUFBLE1BQUEsR0FBQSxRQUFBLEtBQUEsWUFBQSxHQUFBLE9BQUEsS0FBQSxTQUFBLGVBQUEsT0FBQSxHQUFBLE9BQUEsUUFBQSxLQUFBLGVBQUEsU0FBQSxXQUFBLENBQUEsSUFBQSxPQUFBLFdBQUEsUUFBQSxFQUFBLGNBQUEsR0FBQSxFQUFBLENBQUEsUUFBQSxZQUFBLElBQUEsSUFBQSxVQUFBLFFBQUEsSUFBQSxXQUFBLFFBQUEsSUFBQSxTQUFBLENBQUEsWUFBQSxHQUFBLFVBQUEsYUFBQSxFQUFBLGFBQUEsT0FBQSxTQUFBLE1BQUEsU0FBQSxNQUFBLFNBQUEsTUFBQSxlQUFBLE9BQUEsYUFBQSxjQUFBLGVBQUEsT0FBQSxHQUFBLE9BQUEsZUFBQSxLQUFBLGlCQUFBLFdBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxZQUFBLEVBQUEsc0JBQUEsRUFBQSxlQUFBLEVBQUEsV0FBQSxJQUFBLENBQUEsSUFBQSxLQUFBLEtBQUEsV0FBQSxHQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsT0FBQSxPQUFBLEVBQUEsTUFBQSxLQUFBLG1CQUFBLEdBQUEsTUFBQSxhQUFBLE1BQUEsdUJBQUEsTUFBQSxnQkFBQSxNQUFBLFdBQUEsS0FBQSxpQkFBQSxLQUFBLGNBQUEsS0FBQSxhQUFBLFFBQUEsS0FBQSxXQUFBLElBQUEsR0FBQSxXQUFBLEtBQUEsY0FBQSxNQUFBLFdBQUEsRUFBQSxLQUFBLHdCQUFBLFdBQUEsT0FBQSxNQUFBLEtBQUEsWUFBQSxJQUFBLElBQUEsU0FBQSxLQUFBLGdCQUFBLFlBQUEsR0FBQSxJQUFBLE1BQUEsU0FBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLFNBQUEsT0FBQSxJQUFBLEdBQUEsR0FBQSxTQUFBLFdBQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxNQUFBLEtBQUEsc0JBQUEsSUFBQSxJQUFBLFNBQUEsS0FBQSx3QkFBQSxZQUFBLEdBQUEsSUFBQSxNQUFBLFNBQUEsUUFBQSxFQUFBLEVBQUEsRUFBQSxTQUFBLE9BQUEsSUFBQSxHQUFBLEdBQUEsU0FBQSxXQUFBLEdBQUEsT0FBQSxLQUFBLElBQUEsTUFBQSxLQUFBLGVBQUEsSUFBQSxpQkFBQSxLQUFBLGlCQUFBLFlBQUEsT0FBQSxLQUFBLGtCQUFBLE1BQUEsS0FBQSxXQUFBLElBQUEsU0FBQSxLQUFBLGVBQUEsWUFBQSxPQUFBLEtBQUEsV0FBQSxPQUFBLFNBQUEsWUFBQSxHQUFBLFlBQUEsb0JBQUEsU0FBQSxNQUFBLE9BQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxDQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsT0FBQSxRQUFBLE9BQUEsUUFBQSxFQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxPQUFBLFNBQUEsRUFBQSxLQUFBLE1BQUEsT0FBQSxPQUFBLElBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUEsNkJBQUEsT0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsT0FBQSxRQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsR0FBQSxRQUFBLE9BQUEsUUFBQSxNQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsT0FBQSxPQUFBLEdBQUEsRUFBQSxPQUFBLENBQUEsR0FBQSxHQUFBLFNBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLE9BQUEsQ0FBQSxFQUFBLElBQUEsSUFBQSxPQUFBLE9BQUEsT0FBQSxFQUFBLFFBQUEsR0FBQSxPQUFBLFFBQUEsRUFBQSxDQUFBLElBQUEsRUFBQSxLQUFBLE1BQUEsT0FBQSxTQUFBLEVBQUEsS0FBQSxNQUFBLE9BQUEsT0FBQSxJQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLDZCQUFBLE9BQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxHQUFBLE9BQUEsUUFBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLEdBQUEsUUFBQSxPQUFBLFFBQUEsTUFBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxHQUFBLE9BQUEsT0FBQSxHQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsR0FBQSxTQUFBLE9BQUEsT0FBQSxHQUFBLE9BQUEsRUFBQSxPQUFBLENBQUEsS0FBQSxZQUFBLFlBQUEsU0FBQSxNQUFBLFVBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsVUFBQSxXQUFBLE9BQUEsSUFBQSxNQUFBLFdBQUEsR0FBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxPQUFBLE9BQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxHQUFBLENBQUEsR0FBQSxHQUFBLEdBQUEsT0FBQSxFQUFBLEdBQUEsT0FBQSxVQUFBLGlCQUFBLFFBQUEsWUFBQSxvQkFBQSxNQUFBLFFBQUEsR0FBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxPQUFBLElBQUEsS0FBQSxNQUFBLE9BQUEsRUFBQSxJQUFBLE9BQUEsTUFBQSxFQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsT0FBQSxJQUFBLE9BQUEsTUFBQSxLQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxJQUFBLElBQUEsRUFBQSxPQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLEVBQUEsT0FBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLElBQUEsS0FBQSxLQUFBLFlBQUEsR0FBQSxFQUFBLElBQUEsTUFBQSxPQUFBLENBQUEsS0FBQSw2QkFBQSxPQUFBLE1BQUEsWUFBQSxZQUFBLFNBQUEsTUFBQSxVQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsQ0FBQSxJQUFBLFVBQUEscUJBQUEsNkJBQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsU0FBQSxPQUFBLFlBQUEsWUFBQSxNQUFBLFVBQUEsWUFBQSxRQUFBLG9CQUFBLElBQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxRQUFBLFFBQUEsU0FBQSxnQkFBQSxRQUFBLG9CQUFBLFNBQUEsY0FBQSxDQUFBLEdBQUEsRUFBQSxlQUFBLGNBQUEsR0FBQSxLQUFBLG9CQUFBLE9BQUEsUUFBQSxTQUFBLGNBQUEsSUFBQSxRQUFBLGtDQUFBLFNBQUEsVUFBQSxDQUFBLEdBQUEsVUFBQSxHQUFBLEVBQUEsS0FBQSwwQ0FBQSxHQUFBLENBQUEsT0FBQSxRQUFBLG9CQUFBLFVBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxDQUFBLEtBQUEsOEJBQUEsUUFBQSx5QkFBQSxTQUFBLFlBQUEsQ0FBQSxJQUFBLElBQUEsZUFBQSxXQUFBLFlBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxRQUFBLG9CQUFBLE9BQUEsSUFBQSxDQUFBLElBQUEsY0FBQSxRQUFBLG9CQUFBLEdBQUEsR0FBQSxlQUFBLFlBQUEsT0FBQSxLQUFBLG9CQUFBLEVBQUEsR0FBQSxJQUFBLGVBQUEsa0JBQUEsaUJBQUEsWUFBQSxlQUFBLGVBQUEsaUJBQUEsWUFBQSxFQUFBLEVBQUEsZUFBQSxnQkFBQSxPQUFBLEdBQUEsZUFBQSxLQUFBLG9CQUFBLGFBQUEsTUFBQSxxQkFBQSw2QkFBQSxTQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsS0FBQSxzQkFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsS0FBQSxLQUFBLHNCQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxPQUFBLEtBQUEsTUFBQSxPQUFBLHFCQUFBLHNCQUFBLFNBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsT0FBQSxJQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUEsSUFBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsRUFBQSxFQUFBLElBQUEsSUFBQSxHQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsR0FBQSxHQUFBLFlBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxZQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxLQUFBLFlBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsS0FBQSxxQkFBQSxzQkFBQSxTQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE9BQUEsS0FBQSxzQkFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsZ0JBQUEsSUFBQSxvQkFBQSxNQUFBLDBCQUFBLElBQUEsTUFBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsSUFBQSxJQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLEtBQUEsc0JBQUEsSUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEdBQUEsa0JBQUEsaUJBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLEdBQUEsRUFBQSxzQkFBQSxHQUFBLEdBQUEsc0JBQUEsR0FBQSxRQUFBLEVBQUEsSUFBQSxzQkFBQSxHQUFBLFFBQUEsRUFBQSxJQUFBLHNCQUFBLEdBQUEsUUFBQSxFQUFBLEtBQUEsc0JBQUEsR0FBQSxRQUFBLEVBQUEsS0FBQSxzQkFBQSxHQUFBLFFBQUEsRUFBQSxLQUFBLHNCQUFBLEdBQUEsUUFBQSxFQUFBLEtBQUEsc0JBQUEsR0FBQSxRQUFBLEVBQUEsTUFBQSxrQkFBQSx3QkFBQSxTQUFBLGlCQUFBLENBQUEsSUFBQSxXQUFBLGtCQUFBLDBCQUFBLGtCQUFBLE9BQUEsTUFBQSxXQUFBLFdBQUEsa0JBQUEsMEJBQUEsaUJBQUEsc0JBQUEsa0JBQUEsMEJBQUEsU0FBQSxpQkFBQSxDQUFBLElBQUEsSUFBQSxlQUFBLFdBQUEsZUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLDBCQUFBLE9BQUEsSUFBQSxDQUFBLElBQUEsV0FBQSwwQkFBQSxHQUFBLFdBQUEsV0FBQSxHQUFBLEdBQUEsWUFBQSxpQkFBQSxPQUFBLElBQUEsa0JBQUEsV0FBQSxJQUFBLElBQUEsZUFBQSxLQUFBLGlCQUFBLGlCQUFBLFlBQUEsZUFBQSxpQkFBQSxlQUFBLFdBQUEsR0FBQSxlQUFBLGdCQUFBLE9BQUEsR0FBQSxlQUFBLElBQUEsa0JBQUEsZ0JBQUEsTUFBQSxxQkFBQSxRQUFBLFNBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxNQUFBLE1BQUEsU0FBQSxPQUFBLEtBQUEsb0JBQUEsT0FBQSxTQUFBLE9BQUEsSUFBQSxFQUFBLElBQUEscUJBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLHFCQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxxQkFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEscUJBQUEsRUFBQSxFQUFBLEtBQUEsU0FBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxVQUFBLGNBQUEsU0FBQSxhQUFBLFFBQUEsUUFBQSxDQUFBLEdBQUEsYUFBQSxRQUFBLFFBQUEsZUFBQSxLQUFBLG9CQUFBLElBQUEsSUFBQSxTQUFBLFFBQUEsb0JBQUEsU0FBQSxZQUFBLEVBQUEsYUFBQSxTQUFBLGNBQUEsRUFBQSxFQUFBLEVBQUEsYUFBQSxPQUFBLElBQUEsYUFBQSxhQUFBLEdBQUEsTUFBQSxJQUFBLElBQUEsT0FBQSxJQUFBLE1BQUEsYUFBQSxnQkFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLGFBQUEsT0FBQSxJQUFBLElBQUEsSUFBQSxRQUFBLGFBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxRQUFBLE1BQUEsSUFBQSxDQUFBLElBQUEsaUJBQUEsUUFBQSxjQUFBLGtCQUFBLFNBQUEsb0JBQUEsaUJBQUEsT0FBQSxtQkFBQSxJQUFBLFVBQUEsaUJBQUEsSUFBQSxNQUFBLG9CQUFBLElBQUEsSUFBQSw0QkFBQSxPQUFBLEdBQUEsVUFBQSxPQUFBLG9CQUFBLE9BQUEsT0FBQSxFQUFBLHFCQUFBLEdBQUEsQ0FBQSxJQUFBLGFBQUEsT0FBQSxxQkFBQSxVQUFBLE9BQUEsR0FBQSxjQUFBLDRCQUFBLE1BQUEsc0JBQUEsc0JBQUEsSUFBQSxJQUFBLDhCQUFBLDRCQUFBLFNBQUEsb0JBQUEsbUJBQUEsRUFBQSxFQUFBLEVBQUEsOEJBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsZ0JBQUEsRUFBQSxJQUFBLE9BQUEsR0FBQSxVQUFBLEdBQUEsYUFBQSxzQkFBQSxJQUFBLElBQUEsRUFBQSxvQkFBQSxnQkFBQSxFQUFBLElBQUEsT0FBQSxHQUFBLFVBQUEsK0JBQUEsYUFBQSxzQkFBQSxJQUFBLElBQUEsSUFBQSxPQUFBLEdBQUEsVUFBQSxPQUFBLEVBQUEsOEJBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxnQkFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLFFBQUEsb0JBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLEdBQUEsVUFBQSxTQUFBLGFBQUEsc0JBQUEsT0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLGFBQUEsU0FBQSxVQUFBLENBQUEsR0FBQSxFQUFBLFdBQUEsVUFBQSxFQUFBLEtBQUEsMkJBQUEsT0FBQSxTQUFBLFdBQUEsWUFBQSxTQUFBLFdBQUEsSUFBQSxNQUFBLElBQUEsWUFBQSxJQUFBLFlBQUEsSUFBQSxZQUFBLElBQUEsWUFBQSxJQUFBLFlBQUEsSUFBQSxZQUFBLElBQUEsWUFBQSxJQUFBLGFBQUEsTUFBQSxjQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsa0JBQUEsSUFBQSxNQUFBLEtBQUEsTUFBQSxjQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsT0FBQSxFQUFBLEdBQUEsUUFBQSxHQUFBLFFBQUEsVUFBQSxJQUFBLG1CQUFBLE1BQUEsZUFBQSxRQUFBLGNBQUEsU0FBQSxjQUFBLGlCQUFBLENBQUEsSUFBQSxJQUFBLGFBQUEsY0FBQSxPQUFBLGNBQUEsSUFBQSxNQUFBLGNBQUEsRUFBQSxFQUFBLGFBQUEsRUFBQSxJQUFBLGNBQUEsR0FBQSxJQUFBLGNBQUEsR0FBQSxJQUFBLGVBQUEsY0FBQSxPQUFBLGlCQUFBLEdBQUEsQ0FBQSxRQUFBLFVBQUEsT0FBQSxjQUFBLGdCQUFBLE1BQUEsSUFBQSxDQUFBLE1BQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLGlCQUFBLEVBQUEsSUFBQSxjQUFBLEdBQUEsY0FBQSxJQUFBLFFBQUEsT0FBQSxTQUFBLEtBQUEsQ0FBQSxJQUFBLElBQUEsT0FBQSxJQUFBLGdCQUFBLE1BQUEsUUFBQSxPQUFBLGNBQUEsUUFBQSxPQUFBLHdCQUFBLHFCQUFBLFVBQUEsT0FBQSxnQkFBQSxXQUFBLFVBQUEsY0FBQSxVQUFBLFFBQUEsU0FBQSxXQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsV0FBQSxPQUFBLElBQUEsWUFBQSxXQUFBLEdBQUEsaUJBQUEsSUFBQSxJQUFBLFlBQUEsSUFBQSxNQUFBLFlBQUEsYUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLFdBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxVQUFBLFdBQUEsR0FBQSxjQUFBLFVBQUEsVUFBQSxpQkFBQSxVQUFBLGlCQUFBLFFBQUEsY0FBQSxjQUFBLGtCQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsaUJBQUEsRUFBQSxJQUFBLFlBQUEsZ0JBQUEsY0FBQSxHQUFBLElBQUEsT0FBQSxJQUFBLHNCQUFBLFlBQUEsUUFBQSxjQUFBLFFBQUEsTUFBQSxPQUFBLFFBQUEsT0FBQSxHQUFBLE9BQUEsVUFBQSxLQUFBLE9BQUEsTUFBQSxFQUFBLE9BQUEsT0FBQSxFQUFBLE9BQUEsYUFBQSxLQUFBLE9BQUEsTUFBQSxDQUFBLEVBQUEsT0FBQSxxQkFBQSxDQUFBLENBQUEsR0FBQSxFQUFBLEVBQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsQ0FBQSxHQUFBLEdBQUEsR0FBQSxLQUFBLE9BQUEsU0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLElBQUEsQ0FBQSxHQUFBLEdBQUEsVUFBQSxPQUFBLENBQUEsSUFBQSxVQUFBLFNBQUEsZUFBQSxhQUFBLFFBQUEsVUFBQSxXQUFBLE1BQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLE9BQUEsT0FBQSxVQUFBLE9BQUEsT0FBQSxVQUFBLFFBQUEsYUFBQSxFQUFBLEVBQUEsT0FBQSxNQUFBLE9BQUEsUUFBQSxPQUFBLE9BQUEsT0FBQSxRQUFBLFNBQUEsTUFBQSxPQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsUUFBQSxPQUFBLE9BQUEsSUFBQSxNQUFBLElBQUEsTUFBQSxNQUFBLE9BQUEsVUFBQSxDQUFBLElBQUEsVUFBQSxTQUFBLGNBQUEsVUFBQSxRQUFBLFVBQUEsV0FBQSxNQUFBLFdBQUEsU0FBQSxlQUFBLGNBQUEsR0FBQSxNQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEsV0FBQSxXQUFBLE1BQUEsT0FBQSxVQUFBLEVBQUEsRUFBQSxJQUFBLEtBQUEsT0FBQSxVQUFBLE1BQUEsRUFBQSxFQUFBLElBQUEsS0FBQSxVQUFBLE1BQUEsTUFBQSxNQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUEsUUFBQSxVQUFBLE1BQUEsRUFBQSxHQUFBLE9BQUEsTUFBQSxNQUFBLE1BQUEsT0FBQSxPQUFBLE1BQUEsT0FBQSxHQUFBLENBQUEsT0FBQSxVQUFBLFFBQUEsYUFBQSxFQUFBLEVBQUEsTUFBQSxNQUFBLE1BQUEsUUFBQSxNQUFBLEVBQUEsQ0FBQSxPQUFBLE9BQUEsT0FBQSxrSEFBQSxLQUFBLE1BQUEsT0FBQSxVQUFBLE9BQUEsU0FBQSxPQUFBLFNBQUEsR0FBQSxDQUFBLE9BQUEsT0FBQSxPQUFBLFFBQUEsU0FBQSxNQUFBLEVBQUEsQ0FBQSxRQUFBLElBQUEsR0FBQSxPQUFBLE9BQUEseUJBQUEsTUFBQSxPQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsU0FBQSxNQUFBLElBQUEsS0FBQSxPQUFBLFlBQUEsU0FBQSxFQUFBLENBQUEsT0FBQSxtQkFBQSxPQUFBLEtBQUEsT0FBQSxRQUFBLFNBQUEsSUFBQSxDQUFBLElBQUEsTUFBQSxDQUFBLElBQUEsTUFBQSxVQUFBLE1BQUEsT0FBQSxrQkFBQSxPQUFBLGFBQUEsR0FBQSxPQUFBLE1BQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsTUFBQSxJQUFBLENBQUEsSUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsTUFBQSxFQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsTUFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxHQUFBLE9BQUEsVUFBQSxLQUFBLE1BQUEsR0FBQSxNQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsSUFBQSxFQUFBLElBQUEsYUFBQSxPQUFBLFVBQUEsRUFBQSxHQUFBLElBQUEsU0FBQSxJQUFBLFNBQUEsT0FBQSxhQUFBLFNBQUEsU0FBQSxPQUFBLE9BQUEsSUFBQSxhQUFBLE9BQUEsVUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLE9BQUEsUUFBQSxPQUFBLGFBQUEsTUFBQSxLQUFBLE9BQUEsU0FBQSxJQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxPQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsR0FBQSxPQUFBLElBQUEsS0FBQSxPQUFBLGFBQUEsS0FBQSxHQUFBLElBQUEsSUFBQSxJQUFBLENBQUEsSUFBQSxNQUFBLFVBQUEsS0FBQSxJQUFBLE1BQUEsT0FBQSxRQUFBLElBQUEsTUFBQSxPQUFBLFlBQUEsTUFBQSxPQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxHQUFBLE9BQUEsTUFBQSxFQUFBLEtBQUEsY0FBQSxHQUFBLE9BQUEsT0FBQSxFQUFBLEtBQUEsY0FBQSxPQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxNQUFBLEVBQUEsRUFBQSxDQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLE9BQUEsVUFBQSxLQUFBLE1BQUEsR0FBQSxHQUFBLE9BQUEsVUFBQSxLQUFBLE1BQUEsSUFBQSxJQUFBLEdBQUEsT0FBQSxTQUFBLFNBQUEsR0FBQSxDQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLE1BQUEsSUFBQSxDQUFBLElBQUEsS0FBQSxPQUFBLFNBQUEsRUFBQSxHQUFBLElBQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxJQUFBLEtBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxPQUFBLEtBQUEsT0FBQSwyQkFBQSxTQUFBLE1BQUEsQ0FBQSxJQUFBLElBQUEsWUFBQSxFQUFBLFVBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxhQUFBLFdBQUEsS0FBQSxNQUFBLE9BQUEsT0FBQSxhQUFBLE9BQUEsSUFBQSxNQUFBLGFBQUEsRUFBQSxFQUFBLFlBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxHQUFBLElBQUEsTUFBQSxhQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsWUFBQSxHQUFBLEtBQUEsT0FBQSxHQUFBLElBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsWUFBQSxHQUFBLEtBQUEsQ0FBQSxPQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFVBQUEsR0FBQSxLQUFBLENBQUEsSUFBQSxPQUFBLE1BQUEsVUFBQSxHQUFBLEdBQUEsQ0FBQSxXQUFBLEdBQUEsSUFBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLElBQUEsSUFBQSxLQUFBLE9BQUEsSUFBQSxJQUFBLEdBQUEsUUFBQSxPQUFBLE9BQUEsSUFBQSxJQUFBLEtBQUEsT0FBQSxJQUFBLElBQUEsR0FBQSxTQUFBLElBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxhQUFBLEdBQUEsRUFBQSxZQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsSUFBQSxNQUFBLGFBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxZQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLE9BQUEsSUFBQSxJQUFBLEtBQUEsTUFBQSxDQUFBLE9BQUEsSUFBQSxJQUFBLEdBQUEsT0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE9BQUEsUUFBQSxPQUFBLGtCQUFBLFNBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxPQUFBLE9BQUEsMkJBQUEsV0FBQSxZQUFBLE9BQUEsT0FBQSxVQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsYUFBQSxXQUFBLEtBQUEsTUFBQSxPQUFBLE9BQUEsYUFBQSxPQUFBLElBQUEsTUFBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLEdBQUEsRUFBQSxZQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxVQUFBLEdBQUEsS0FBQSxPQUFBLFVBQUEsR0FBQSxHQUFBLENBQUEsV0FBQSxHQUFBLElBQUEsT0FBQSxPQUFBLFVBQUEsVUFBQSxHQUFBLEdBQUEsQ0FBQSxXQUFBLEdBQUEsSUFBQSxPQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsQ0FBQSxFQUFBLENBQUE7SUFDQSxPQUFBLFFBQUEsT0FBQSxVQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxJQUFBLE1BQUEsT0FBQSxNQUFBLE9BQUEsUUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxNQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsT0FBQSxTQUFBLEVBQUEsR0FBQSxJQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsS0FBQSxPQUFBLEtBQUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxLQUFBLEdBQUEsQ0FBQSxJQUFBLEtBQUEsS0FBQSxNQUFBLENBQUEsSUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsS0FBQSxPQUFBLEVBQUEsS0FBQSxLQUFBLE9BQUEsS0FBQSxLQUFBLEtBQUEsS0FBQSxNQUFBLEtBQUEsT0FBQSxJQUFBLFNBQUEsRUFBQSxZQUFBLEdBQUEsbUJBQUEsRUFBQSxjQUFBLEVBQUEsT0FBQSxrQkFBQSxTQUFBLFNBQUEsQ0FBQSxTQUFBLFNBQUEsU0FBQSxTQUFBLENBQUEsT0FBQSxNQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsTUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLE1BQUEsTUFBQSxPQUFBLFNBQUEsY0FBQSxPQUFBLE9BQUEsT0FBQSxDQUFBLElBQUEsR0FBQSxPQUFBLEVBQUEsR0FBQSxPQUFBLEVBQUEsTUFBQSxDQUFBLE9BQUEsRUFBQSxLQUFBLE9BQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxFQUFBLEtBQUEsT0FBQSxFQUFBLElBQUEsSUFBQSxPQUFBLE9BQUEsT0FBQSxnQkFBQSxTQUFBLFNBQUEsR0FBQSxTQUFBLElBQUEsZUFBQSxTQUFBLFNBQUEsR0FBQSxTQUFBLElBQUEsZ0JBQUEsU0FBQSxTQUFBLEdBQUEsU0FBQSxJQUFBLEdBQUEsZ0JBQUEsaUJBQUEsZ0JBQUEsaUJBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLElBQUEsaUJBQUEsZ0JBQUEsaUJBQUEsaUJBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEtBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLElBQUEsY0FBQSxPQUFBLE9BQUEsUUFBQSxFQUFBLENBQUEsSUFBQSxLQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUE7QUNGQSxRQUFBLE9BQUE7R0FDQSxRQUFBLGVBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxPQUFBLFlBQUEsUUFBQSxTQUFBLFNBQUE7TUFDQSxJQUFBLGNBQUE7O01BRUEsU0FBQSxhQUFBLE1BQUEsSUFBQSxVQUFBOztRQUVBLEdBQUEsQ0FBQSxXQUFBLENBQUEsUUFBQSxPQUFBLEtBQUEsT0FBQSxLQUFBOztRQUVBLElBQUEsR0FBQTtVQUNBLEdBQUEsS0FBQTs7OztNQUlBLFNBQUEsYUFBQSxNQUFBLElBQUEsVUFBQTtRQUNBLEdBQUEsQ0FBQSxXQUFBLENBQUEsT0FBQSxHQUFBO1FBQ0EsSUFBQSxJQUFBO1VBQ0EsR0FBQTs7OztNQUlBLFlBQUEsb0JBQUEsU0FBQSxPQUFBLFVBQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsZUFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLEtBQUE7O2FBRUE7Ozs7O01BS0EsWUFBQSxpQkFBQSxTQUFBLE9BQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsZUFBQTtZQUNBLE9BQUE7O1dBRUEsS0FBQTs7YUFFQTs7Ozs7OztNQU9BLFlBQUEsU0FBQSxTQUFBLFVBQUE7O1FBRUEsUUFBQSxRQUFBO1FBQ0EsT0FBQSxHQUFBOzs7TUFHQSxZQUFBLFdBQUEsU0FBQSxPQUFBLFVBQUEsV0FBQSxXQUFBLFdBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSxrQkFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBO1lBQ0EsV0FBQTs7V0FFQSxLQUFBOzthQUVBOzs7OztNQUtBLFlBQUEsU0FBQSxTQUFBLE9BQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLElBQUEsa0JBQUE7V0FDQSxLQUFBOzs7OzthQUtBOzs7Ozs7O01BT0EsWUFBQSwwQkFBQSxTQUFBLFdBQUEsVUFBQTtRQUNBLE9BQUE7V0FDQSxLQUFBLHVCQUFBO1lBQ0EsSUFBQSxRQUFBOzs7O01BSUEsWUFBQSxpQkFBQSxTQUFBLE1BQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSxlQUFBO1lBQ0EsT0FBQTs7OztNQUlBLFlBQUEsZ0JBQUEsU0FBQSxPQUFBLE1BQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsd0JBQUE7WUFDQSxPQUFBO1lBQ0EsVUFBQTs7V0FFQSxLQUFBLFdBQUE7OztNQUdBLE9BQUE7Ozs7QUMvR0EsUUFBQSxPQUFBLE9BQUEsUUFBQSxvQkFBQTtJQUNBO0lBQ0EsU0FBQSxPQUFBO01BQ0EsSUFBQSxhQUFBO01BQ0EsSUFBQSxPQUFBLGFBQUE7O01BRUEsT0FBQTs7Ozs7UUFLQSxRQUFBLFNBQUEsT0FBQTtZQUNBLE9BQUEsTUFBQSxLQUFBLGFBQUEsV0FBQTtjQUNBLE9BQUE7Ozs7O1FBS0EsUUFBQSxTQUFBLElBQUEsT0FBQTtZQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxXQUFBO2NBQ0EsT0FBQTs7Ozs7UUFLQSxRQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O1FBR0EsS0FBQSxTQUFBLElBQUE7WUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOzs7UUFHQSxRQUFBLFdBQUE7WUFDQSxPQUFBLE1BQUEsSUFBQTs7O1FBR0EsV0FBQSxTQUFBLElBQUE7VUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUE7Ozs7Ozs7O0FDdENBLFFBQUEsT0FBQSxPQUFBLFFBQUEsb0JBQUE7SUFDQTtJQUNBLFNBQUEsT0FBQTtNQUNBLElBQUEsWUFBQTtNQUNBLElBQUEsT0FBQSxZQUFBOztNQUVBLE9BQUE7Ozs7O1FBS0EsWUFBQSxTQUFBLFVBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxZQUFBLGVBQUE7Y0FDQSxVQUFBOzs7O1FBSUEsUUFBQSxXQUFBO1lBQ0EsT0FBQSxNQUFBLElBQUE7OztRQUdBLGtCQUFBLFNBQUEsU0FBQSxTQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsWUFBQSxlQUFBO1lBQ0EsVUFBQTtZQUNBLFVBQUE7Ozs7Ozs7O0FDeEJBLFFBQUEsT0FBQTtHQUNBLFFBQUEsbUJBQUE7RUFDQTtFQUNBLFNBQUEsTUFBQTs7SUFFQSxJQUFBLE9BQUE7O0lBRUEsT0FBQTtNQUNBLG1CQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQTs7TUFFQSx5QkFBQSxTQUFBLE1BQUEsTUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsU0FBQTtVQUNBLFVBQUE7VUFDQSxXQUFBOzs7TUFHQSx3QkFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLGNBQUE7VUFDQSxNQUFBOzs7TUFHQSxpQkFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLGFBQUE7VUFDQSxNQUFBOzs7TUFHQSxzQkFBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7TUFFQSx5QkFBQSxTQUFBLE9BQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLGFBQUE7VUFDQSxRQUFBOzs7TUFHQSxvQkFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLFlBQUE7VUFDQSxNQUFBOzs7TUFHQSxzQkFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLGNBQUE7VUFDQSxNQUFBOzs7O01BSUEsa0JBQUEsU0FBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxjQUFBO1VBQ0EsWUFBQTs7OztNQUlBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsZ0JBQUE7VUFDQSxNQUFBOzs7TUFHQSxtQkFBQSxTQUFBLFlBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLFVBQUE7VUFDQSxhQUFBOzs7Ozs7OztBQzNEQSxRQUFBLE9BQUEsT0FBQSxRQUFBLG9CQUFBO0lBQ0E7SUFDQSxTQUFBLE9BQUE7TUFDQSxJQUFBLE1BQUE7TUFDQSxJQUFBLE9BQUEsTUFBQTs7O01BR0EsT0FBQTs7Ozs7UUFLQSxPQUFBLFNBQUEsV0FBQSxNQUFBLFFBQUEsV0FBQSxXQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsTUFBQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxTQUFBOzthQUVBLEtBQUE7O2VBRUE7Ozs7O1FBS0EsUUFBQSxXQUFBO1lBQ0EsT0FBQSxNQUFBLElBQUE7Ozs7Ozs7QUMxQkEsUUFBQSxPQUFBLE9BQUEsUUFBQSxlQUFBO0lBQ0E7SUFDQSxTQUFBLE9BQUE7TUFDQSxJQUFBLFFBQUE7TUFDQSxJQUFBLE9BQUEsUUFBQTs7TUFFQSxPQUFBOzs7OztRQUtBLFFBQUEsU0FBQSxVQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsUUFBQSxXQUFBO2NBQ0EsVUFBQTs7OztRQUlBLFFBQUEsV0FBQTtVQUNBLE9BQUEsTUFBQSxJQUFBOzs7UUFHQSxRQUFBLFNBQUEsSUFBQSxPQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLFdBQUE7WUFDQSxPQUFBOzs7O1FBSUEsTUFBQSxTQUFBLElBQUEsU0FBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7V0FDQSxLQUFBOzs7Ozs7OztRQVFBLFlBQUEsU0FBQSxJQUFBLE9BQUEsTUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7V0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7O1FBYUEsY0FBQSxTQUFBLElBQUEsUUFBQSxhQUFBO1VBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7UUFhQSxjQUFBLFNBQUEsSUFBQSxPQUFBLFFBQUE7VUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBO1dBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBcUJBLFFBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7UUFHQSxLQUFBLFNBQUEsSUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztRQUdBLGlCQUFBLFNBQUEsSUFBQSxRQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLG9CQUFBO1lBQ0EsUUFBQTs7OztRQUlBLGtCQUFBLFNBQUEsS0FBQSxlQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsUUFBQSxNQUFBLEVBQUEsTUFBQTtnQkFDQSxNQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsZUFBQSxnQkFBQSxnQkFBQTs7Ozs7Ozs7Ozs7QUM1R0EsUUFBQSxPQUFBLE9BQUEsUUFBQSxlQUFBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsT0FBQSxTQUFBO0lBQ0EsSUFBQSxRQUFBO0lBQ0EsSUFBQSxPQUFBLFFBQUE7O0lBRUEsT0FBQTs7OztNQUlBLGdCQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLFFBQUE7OztNQUdBLEtBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsUUFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUE7OztNQUdBLFNBQUEsU0FBQSxNQUFBLE1BQUEsS0FBQSxlQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsUUFBQSxNQUFBLEVBQUEsTUFBQTtjQUNBLE1BQUE7Y0FDQSxNQUFBLE9BQUEsT0FBQTtjQUNBLE1BQUEsT0FBQSxPQUFBO2NBQ0EsZUFBQSxnQkFBQSxnQkFBQTs7Ozs7O01BTUEsZUFBQSxTQUFBLElBQUEsU0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxZQUFBO1VBQ0EsU0FBQTs7OztNQUlBLG9CQUFBLFNBQUEsSUFBQSxjQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxLQUFBLFlBQUE7VUFDQSxjQUFBOzs7O01BSUEsV0FBQSxTQUFBLElBQUEsTUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxjQUFBO1VBQ0EsTUFBQTs7OztNQUlBLGtCQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7Ozs7OztNQU9BLFVBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLGNBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLFdBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOztNQUVBLFlBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOztNQUVBLGdCQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsZ0JBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxlQUFBLFNBQUEsS0FBQSxPQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLGlCQUFBLEtBQUEsVUFBQTs7O01BR0EsU0FBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLFVBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxZQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsV0FBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGFBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxZQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSxtQkFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsdUJBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLGdCQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSx1QkFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsUUFBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGtCQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSxrQkFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQTs7O01BR0Esc0JBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUE7OztNQUdBLGlCQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0Esd0JBQUEsU0FBQSxPQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxrQkFBQSxFQUFBLE9BQUE7Ozs7Ozs7OztBQ25KQSxRQUFBLE9BQUE7R0FDQSxXQUFBLHFCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsT0FBQSxXQUFBLGlCQUFBO01BQ0EsT0FBQSxvQkFBQSxVQUFBOztNQUVBLGlCQUFBLFVBQUEsVUFBQSxLQUFBLEtBQUEsS0FBQTs7OztNQUlBLE9BQUEsaUJBQUEsWUFBQSxFQUFBLE9BQUEsZUFBQSxDQUFBLE9BQUE7OztNQUdBLE9BQUEsa0JBQUEsVUFBQTtRQUNBO1dBQ0EsT0FBQSxPQUFBLGtCQUFBLEtBQUEsT0FBQTtXQUNBLEtBQUE7OzthQUdBOzs7Ozs7O0FDdEJBLFFBQUEsT0FBQSxPQUFBLFdBQUEsdUJBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsa0JBQUE7O0lBRUEsT0FBQSxhQUFBOzs7Ozs7SUFNQSxFQUFBLGNBQUE7OztJQUdBLFNBQUEsY0FBQTtNQUNBLGlCQUFBLFNBQUEsS0FBQTs7Ozs7SUFLQTs7SUFFQSxPQUFBLGNBQUEsU0FBQSxRQUFBLFdBQUE7O01BRUEsT0FBQTtNQUNBLE9BQUEsR0FBQSx1QkFBQTtRQUNBLElBQUEsVUFBQTs7OztJQUlBLE9BQUEsa0JBQUEsV0FBQTs7TUFFQSxLQUFBLDhCQUFBO1FBQ0EsU0FBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLFNBQUEsT0FBQSxLQUFBLFNBQUEsT0FBQSxLQUFBLENBQUEsTUFBQSxhQUFBLE9BQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxDQUFBLFNBQUEsU0FBQSxZQUFBLENBQUEsYUFBQSxvQ0FBQSxNQUFBOztPQUVBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF3Q0EsT0FBQSxrQkFBQSxTQUFBLFFBQUEsV0FBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxRQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztRQUdBLFlBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQSw2QkFBQSxVQUFBLFFBQUE7UUFDQSxPQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkdBLFFBQUEsT0FBQSxPQUFBLFdBQUEsaUJBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsYUFBQTtJQUNBLE9BQUEsUUFBQTtJQUNBLE9BQUEsUUFBQTs7Ozs7O0lBTUEsRUFBQSxjQUFBOzs7OztJQUtBLFlBQUEsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLGFBQUEsT0FBQSxPQUFBO0tBQ0EsS0FBQTs7OztJQUlBLE9BQUEsWUFBQSxXQUFBO01BQ0EsSUFBQSxnQkFBQSxPQUFBLE1BQUE7UUFDQTs7O01BR0EsSUFBQSxPQUFBLGNBQUEsa0JBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFVBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFdBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFVBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFdBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsVUFBQSxFQUFBLE1BQUEsS0FBQTs7TUFFQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7OztRQUdBLE1BQUE7UUFDQSxTQUFBLENBQUEsVUFBQTtRQUNBLFlBQUE7U0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0RBLFFBQUEsT0FBQSxPQUFBLFdBQUEsc0JBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsa0JBQUE7Ozs7OztJQU1BLEVBQUEsY0FBQTs7Ozs7O0lBTUEsT0FBQSxjQUFBLFVBQUE7O01BRUEsSUFBQSxPQUFBLFFBQUEsT0FBQSxNQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUEsQ0FBQSxVQUFBO1VBQ0EsWUFBQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7OztXQWVBO1FBQ0EsS0FBQSxVQUFBLDRCQUFBOzs7Ozs7Ozs7QUMxQ0EsUUFBQSxPQUFBO0dBQ0EsV0FBQSxxQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxNQUFBLGdCQUFBOztNQUVBLE9BQUEsV0FBQTtNQUNBO1NBQ0E7U0FDQSxLQUFBOzs7O01BSUEsU0FBQSxlQUFBLFNBQUE7UUFDQSxPQUFBLFVBQUE7O1FBRUEsU0FBQSxXQUFBLElBQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxZQUFBLElBQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxjQUFBLElBQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxZQUFBLElBQUEsS0FBQSxTQUFBOztRQUVBLE9BQUEsV0FBQTs7Ozs7TUFLQSxPQUFBLG9CQUFBLFlBQUE7UUFDQTtXQUNBLGtCQUFBLE9BQUEsU0FBQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7O01BV0E7U0FDQTtTQUNBLEtBQUE7Ozs7UUFJQSxPQUFBLGtCQUFBLFVBQUE7VUFDQTthQUNBLHdCQUFBLE9BQUEsVUFBQSxRQUFBLE1BQUEsSUFBQSxNQUFBO2FBQ0EsS0FBQTs7Ozs7Ozs7TUFRQSxPQUFBLGFBQUEsU0FBQSxLQUFBO1FBQ0EsSUFBQSxDQUFBLEtBQUE7VUFDQSxPQUFBOzs7O1FBSUEsT0FBQSxPQUFBLE1BQUEsT0FBQTtVQUNBLE1BQUEsS0FBQSxlQUFBLE1BQUEsS0FBQTs7OztNQUlBLFNBQUEsVUFBQSxLQUFBO1FBQ0EsT0FBQSxJQUFBO1VBQ0EsS0FBQTtVQUNBLEtBQUE7VUFDQSxLQUFBO1VBQ0EsS0FBQTtVQUNBLEtBQUE7Ozs7TUFJQSxPQUFBLDBCQUFBLFVBQUE7O1FBRUEsSUFBQSxPQUFBLFVBQUEsT0FBQSxTQUFBLFVBQUE7UUFDQSxJQUFBLFFBQUEsVUFBQSxPQUFBLFNBQUEsV0FBQTs7UUFFQSxJQUFBLE9BQUEsS0FBQSxRQUFBLEtBQUEsU0FBQSxhQUFBLFVBQUEsVUFBQTtVQUNBLE9BQUEsS0FBQSxXQUFBLGtDQUFBOztRQUVBLElBQUEsUUFBQSxNQUFBO1VBQ0EsS0FBQSxXQUFBLDZDQUFBO1VBQ0E7OztRQUdBO1dBQ0Esd0JBQUEsTUFBQTtXQUNBLEtBQUE7Ozs7Ozs7O01BUUEsT0FBQSx5QkFBQSxVQUFBO1FBQ0EsSUFBQSxZQUFBLFVBQUEsT0FBQSxTQUFBLGFBQUE7O1FBRUE7V0FDQSx1QkFBQTtXQUNBLEtBQUE7Ozs7Ozs7O01BUUEsT0FBQSxrQkFBQSxVQUFBO1FBQ0EsSUFBQSxVQUFBLFVBQUEsT0FBQSxTQUFBLFdBQUE7O1FBRUE7V0FDQSxnQkFBQTtXQUNBLEtBQUE7Ozs7Ozs7OztNQVNBLElBQUEsWUFBQSxJQUFBLFNBQUE7O01BRUEsT0FBQSxrQkFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUE7OztNQUdBLE9BQUEscUJBQUEsVUFBQTtRQUNBLElBQUEsT0FBQSxPQUFBLFNBQUE7UUFDQTtXQUNBLG1CQUFBO1dBQ0EsS0FBQTs7Ozs7O01BTUEsT0FBQSxtQkFBQSxVQUFBO1FBQ0EsSUFBQSxhQUFBLE9BQUEsU0FBQTtRQUNBO1dBQ0EsaUJBQUE7V0FDQSxLQUFBOzs7Ozs7O01BT0EsT0FBQSx1QkFBQSxVQUFBO1FBQ0EsSUFBQSxPQUFBLE9BQUEsU0FBQTtRQUNBO1dBQ0EscUJBQUE7V0FDQSxLQUFBOzs7Ozs7TUFNQSxPQUFBLHlCQUFBLFVBQUE7UUFDQSxJQUFBLE9BQUEsT0FBQSxTQUFBO1FBQ0E7V0FDQSx1QkFBQTtXQUNBLEtBQUE7Ozs7Ozs7O0FDMUtBLFFBQUEsT0FBQSxRQUFBLE9BQUEsQ0FBQSxtQkFBQSxVQUFBLGlCQUFBOztFQUVBLGdCQUFBLFdBQUE7SUFDQSxhQUFBLENBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQSxXQUFBLFdBQUE7SUFDQSxZQUFBOzs7Q0FHQSxXQUFBLGlCQUFBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxZQUFBOztNQUVBO1NBQ0E7U0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUErR0E7U0FDQTtTQUNBLEtBQUE7Ozs7O01BS0EsT0FBQSxVQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsT0FBQSxNQUFBOzs7O01BSUEsTUFBQSxTQUFBLE9BQUEsU0FBQTtRQUNBO1VBQ0EsaUJBQUE7VUFDQSxzQkFBQTtVQUNBLDJCQUFBO1VBQ0EsYUFBQTtVQUNBLGtCQUFBO1VBQ0EsdUJBQUE7Ozs7O01BS0EsT0FBQSxtQkFBQSxVQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLGtCQUFBO1VBQ0Esb0JBQUE7VUFDQSxtQkFBQTtVQUNBLGdCQUFBO2FBQ0EsVUFBQTtZQUNBO2VBQ0E7ZUFDQSxLQUFBLFVBQUE7Z0JBQ0EsV0FBQTs7Ozs7TUFLQSxPQUFBLG1CQUFBLFVBQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0Esa0JBQUE7VUFDQSxvQkFBQTtVQUNBLG1CQUFBO1VBQ0EsZ0JBQUE7YUFDQSxVQUFBO1lBQ0E7ZUFDQTtlQUNBLEtBQUEsVUFBQTtnQkFDQSxXQUFBOzs7OztNQUtBLE9BQUEsdUJBQUEsVUFBQTtRQUNBO1dBQ0E7V0FDQSxRQUFBLFNBQUEsT0FBQTtZQUNBLEtBQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLE1BQUE7Y0FDQSxrQkFBQTtjQUNBLG9CQUFBO2NBQ0EsbUJBQUE7Y0FDQSxnQkFBQTtpQkFDQSxVQUFBOztnQkFFQTttQkFDQTttQkFDQSxLQUFBLFVBQUE7b0JBQ0EsV0FBQTs7Ozs7O01BTUEsT0FBQSxhQUFBLFdBQUE7UUFDQTtXQUNBO1dBQ0EsUUFBQSxTQUFBLE9BQUE7WUFDQSxLQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxNQUFBO2NBQ0Esa0JBQUE7Y0FDQSxvQkFBQTtjQUNBLG1CQUFBO2NBQ0EsZ0JBQUE7aUJBQ0EsVUFBQTs7Z0JBRUE7bUJBQ0E7bUJBQ0EsS0FBQSxVQUFBO29CQUNBLFdBQUE7Ozs7OztNQU1BLE9BQUEsaUJBQUEsV0FBQTtRQUNBO1dBQ0E7V0FDQSxRQUFBLFNBQUEsT0FBQTtZQUNBLEtBQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLE1BQUE7Y0FDQSxrQkFBQTtjQUNBLG9CQUFBO2NBQ0EsbUJBQUE7Y0FDQSxnQkFBQTtpQkFDQSxVQUFBOztnQkFFQTttQkFDQTttQkFDQSxLQUFBLFVBQUE7b0JBQ0EsV0FBQTs7Ozs7Ozs7Ozs7QUN4UEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxnQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLE9BQUEsTUFBQSxZQUFBO01BQ0EsT0FBQSxlQUFBLEtBQUE7OztNQUdBOztNQUVBLFNBQUEsaUJBQUE7O1FBRUE7V0FDQSxJQUFBO1dBQ0EsS0FBQSxTQUFBLElBQUE7WUFDQSxJQUFBLFVBQUEsSUFBQTtZQUNBLElBQUEsUUFBQSxPQUFBLGFBQUEsTUFBQSxNQUFBLEtBQUE7O1lBRUEsSUFBQSxRQUFBLE9BQUE7Y0FDQSxPQUFBLGFBQUEsUUFBQSxTQUFBLFFBQUEsT0FBQTtjQUNBLE9BQUEsbUJBQUE7Ozs7Ozs7TUFPQSxPQUFBLGdCQUFBLFVBQUE7UUFDQTtXQUNBLGNBQUEsT0FBQSxhQUFBLEtBQUEsT0FBQSxhQUFBO1dBQ0EsS0FBQTs7O2FBR0E7Ozs7OztNQU1BLE9BQUEscUJBQUEsVUFBQTtRQUNBO1dBQ0EsbUJBQUEsT0FBQSxhQUFBLEtBQUEsT0FBQSxhQUFBO1dBQ0EsS0FBQTs7O2FBR0E7Ozs7OztNQU1BLE9BQUEsZ0JBQUEsVUFBQTs7UUFFQTtXQUNBLFVBQUEsT0FBQSxhQUFBLEtBQUEsT0FBQTtXQUNBLEtBQUE7OzthQUdBOzs7Ozs7Ozs7OztBQzVEQSxRQUFBLE9BQUEsT0FBQSxXQUFBLGtCQUFBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsYUFBQSxhQUFBO0lBQ0EsT0FBQSxRQUFBO0lBQ0EsT0FBQSxRQUFBOzs7Ozs7SUFNQSxFQUFBLGNBQUE7O0lBRUEsT0FBQSxlQUFBO0lBQ0EsT0FBQSxhQUFBLFdBQUEsaUJBQUE7TUFDQSxRQUFBO01BQ0EsY0FBQTtRQUNBLHFCQUFBOztNQUVBLFNBQUE7OztJQUdBLFNBQUEsV0FBQSxNQUFBO01BQ0EsT0FBQSxRQUFBLEtBQUE7TUFDQSxPQUFBLGNBQUEsS0FBQTtNQUNBLE9BQUEsV0FBQSxLQUFBOztNQUVBLElBQUEsSUFBQTtNQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFlBQUEsS0FBQTtRQUNBLEVBQUEsS0FBQTs7TUFFQSxPQUFBLFFBQUE7OztJQUdBLFlBQUEsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLGFBQUEsT0FBQSxPQUFBO0tBQ0EsS0FBQTs7Ozs7SUFLQSxPQUFBLE9BQUEsYUFBQSxTQUFBLFdBQUE7TUFDQSxZQUFBLFFBQUEsYUFBQSxNQUFBLGFBQUEsTUFBQSxXQUFBLE9BQUEsZUFBQTtRQUNBOzs7Ozs7O0lBT0EsT0FBQSxvQkFBQSxZQUFBO01BQ0E7U0FDQSxRQUFBLGFBQUEsTUFBQSxhQUFBLE1BQUEsT0FBQSxXQUFBLE9BQUEsZUFBQTtVQUNBOzs7Ozs7SUFNQSxPQUFBLFdBQUEsU0FBQSxNQUFBO01BQ0EsT0FBQSxHQUFBLG1CQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUEsYUFBQSxRQUFBOzs7O0lBSUEsT0FBQSxTQUFBLFNBQUEsUUFBQSxNQUFBO01BQ0EsT0FBQTs7TUFFQSxPQUFBLEdBQUEsa0JBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7O0lBS0EsT0FBQSxhQUFBLFNBQUEsUUFBQSxNQUFBLE9BQUE7TUFDQSxPQUFBO01BQ0EsS0FBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFFBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1FBR0EsWUFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBLDZCQUFBLEtBQUEsUUFBQSxPQUFBO1FBQ0EsT0FBQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTZDQSxPQUFBLGNBQUEsU0FBQSxRQUFBLE1BQUEsT0FBQTtNQUNBLE9BQUE7TUFDQSxLQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsUUFBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7UUFHQSxZQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUEsNkJBQUEsS0FBQSxRQUFBLE9BQUE7UUFDQSxPQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUErQ0EsT0FBQSxhQUFBLFNBQUEsUUFBQSxNQUFBLE9BQUE7TUFDQSxPQUFBOzs7TUFHQSxLQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsUUFBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7UUFHQSxZQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUEsNkJBQUEsS0FBQSxRQUFBLE9BQUE7UUFDQSxPQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE0Q0EsT0FBQSx1QkFBQSxXQUFBO01BQ0EsTUFBQSxxQkFBQSxPQUFBLE1BQUE7UUFDQTs7O01BR0EsSUFBQSxVQUFBLEVBQUEsTUFBQSxLQUFBOztNQUVBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7O1FBR0EsTUFBQTtRQUNBLFNBQUEsQ0FBQSxVQUFBO1FBQ0EsWUFBQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFzQkEsT0FBQSxzQkFBQSxXQUFBO01BQ0EsTUFBQSxxQkFBQSxPQUFBLE1BQUE7UUFDQTs7O01BR0EsSUFBQSxVQUFBLEVBQUEsTUFBQSxLQUFBOztNQUVBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7O1FBR0EsTUFBQTtRQUNBLFNBQUEsQ0FBQSxVQUFBO1FBQ0EsWUFBQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXFCQSxPQUFBLGNBQUEsVUFBQTtNQUNBLElBQUEsVUFBQSxDQUFBLE1BQUEsVUFBQSxZQUFBO01BQ0EsSUFBQSxPQUFBO01BQ0EsWUFBQSxTQUFBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNENBLE9BQUEsY0FBQSxTQUFBLFFBQUEsTUFBQSxPQUFBO01BQ0EsT0FBQTs7TUFFQSxJQUFBLENBQUEsS0FBQSxPQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBLHdCQUFBLEtBQUEsUUFBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxNQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7YUFXQTtRQUNBLFlBQUEsWUFBQSxLQUFBLEtBQUEsS0FBQTs7Ozs7Ozs7SUFRQSxTQUFBLFdBQUEsTUFBQTtNQUNBLElBQUEsTUFBQTtRQUNBLE9BQUEsT0FBQSxNQUFBLE9BQUE7Ozs7SUFJQSxPQUFBLFdBQUEsU0FBQSxNQUFBO01BQ0EsSUFBQSxLQUFBLE9BQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFdBQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFlBQUEsQ0FBQSxLQUFBLE9BQUEsV0FBQTtRQUNBLE9BQUE7Ozs7SUFJQSxTQUFBLFdBQUEsTUFBQTtNQUNBLE9BQUEsZUFBQTtNQUNBLE9BQUEsYUFBQSxXQUFBLGlCQUFBO01BQ0EsRUFBQSxvQkFBQSxNQUFBOzs7SUFHQSxTQUFBLGlCQUFBLE1BQUE7TUFDQSxPQUFBO1FBQ0E7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBLE9BQUEsY0FBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGdCQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLEtBQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTtjQUNBLE1BQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7UUFJQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7Ozs7SUFPQSxTQUFBLFlBQUE7TUFDQSxLQUFBLFlBQUEsd0JBQUE7TUFDQSxPQUFBOzs7SUFHQSxTQUFBLFFBQUEsS0FBQTtNQUNBLEtBQUEsY0FBQSxLQUFBLFNBQUE7OztJQUdBLE9BQUEsZUFBQSxVQUFBOztNQUVBLEtBQUEsOEJBQUE7UUFDQSxTQUFBLENBQUEsUUFBQSxDQUFBLE1BQUEsU0FBQSxPQUFBLEtBQUEsU0FBQSxPQUFBLEtBQUEsQ0FBQSxNQUFBLFNBQUEsT0FBQSxLQUFBLFNBQUE7UUFDQSxTQUFBLENBQUEsU0FBQSxTQUFBLFlBQUEsQ0FBQSxhQUFBLG9CQUFBLE1BQUE7U0FDQSxLQUFBOzs7Ozs7OztJQVFBLE9BQUEsYUFBQTs7O0FDcGxCQSxRQUFBLE9BQUE7R0FDQSxRQUFBLFlBQUEsV0FBQTtHQUNBLFdBQUEsWUFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsV0FBQTs7TUFFQSxPQUFBLGFBQUE7Ozs7QUNQQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGFBQUE7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLFlBQUE7TUFDQSxPQUFBLFVBQUE7O0FDTEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxtQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxZQUFBLFFBQUEsT0FBQSxhQUFBLFVBQUEsU0FBQSxhQUFBLGtCQUFBOzs7TUFHQSxPQUFBLE9BQUEsWUFBQTs7O01BR0EsT0FBQSxlQUFBLE9BQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxNQUFBLFNBQUEsS0FBQTs7O01BR0EsSUFBQSxPQUFBLGFBQUE7UUFDQSxPQUFBLEtBQUEsUUFBQSxRQUFBOzs7O01BSUE7TUFDQTs7TUFFQTtNQUNBOztNQUVBLE9BQUEsY0FBQSxLQUFBLFFBQUEsU0FBQSxLQUFBOztNQUVBLFNBQUEsaUJBQUE7UUFDQTtXQUNBLElBQUE7V0FDQSxLQUFBLFNBQUEsSUFBQTtZQUNBLElBQUEsVUFBQSxJQUFBO1lBQ0EsSUFBQSxRQUFBLE9BQUEsS0FBQSxNQUFBLE1BQUEsS0FBQTs7WUFFQSxJQUFBLFFBQUEsT0FBQTtjQUNBLE9BQUEsS0FBQSxRQUFBLFNBQUEsUUFBQSxPQUFBO2NBQ0EsT0FBQSxtQkFBQTs7OztRQUlBO1dBQ0EsSUFBQTtXQUNBLEtBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxVQUFBLElBQUEsS0FBQSxNQUFBO1lBQ0EsT0FBQSxRQUFBLEtBQUE7O1lBRUEsSUFBQSxVQUFBOztZQUVBLElBQUEsSUFBQSxHQUFBLElBQUEsT0FBQSxRQUFBLFFBQUEsS0FBQTtjQUNBLE9BQUEsUUFBQSxLQUFBLE9BQUEsUUFBQSxHQUFBO2NBQ0EsUUFBQSxLQUFBLENBQUEsT0FBQSxPQUFBLFFBQUE7OztZQUdBLEVBQUE7ZUFDQSxPQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxVQUFBLFNBQUEsUUFBQSxVQUFBO2tCQUNBLE9BQUEsS0FBQSxRQUFBLFNBQUEsT0FBQSxNQUFBOzs7Ozs7O01BT0EsU0FBQSxpQkFBQTtRQUNBO1dBQ0EsSUFBQTtXQUNBLEtBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxVQUFBLElBQUEsS0FBQSxNQUFBO1lBQ0EsT0FBQSxRQUFBLEtBQUE7O1lBRUEsSUFBQSxVQUFBOztZQUVBLElBQUEsSUFBQSxHQUFBLElBQUEsT0FBQSxRQUFBLFFBQUEsS0FBQTtjQUNBLE9BQUEsUUFBQSxLQUFBLE9BQUEsUUFBQSxHQUFBO2NBQ0EsUUFBQSxLQUFBLENBQUEsT0FBQSxPQUFBLFFBQUE7OztZQUdBLEVBQUE7ZUFDQSxPQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxVQUFBLFNBQUEsUUFBQSxVQUFBO2tCQUNBLE9BQUEsS0FBQSxRQUFBLFNBQUEsT0FBQSxNQUFBOzs7Ozs7O01BT0EsU0FBQSxlQUFBO1FBQ0E7V0FDQSxJQUFBO1dBQ0EsS0FBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFFBQUEsSUFBQSxLQUFBLE1BQUE7WUFDQSxPQUFBLE1BQUEsS0FBQTs7WUFFQSxJQUFBLFVBQUE7O1lBRUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLE1BQUEsUUFBQSxLQUFBO2NBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxNQUFBLEdBQUE7Y0FDQSxRQUFBLEtBQUEsQ0FBQSxPQUFBLE9BQUEsTUFBQTs7O1lBR0EsRUFBQTtlQUNBLE9BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxPQUFBO2dCQUNBLFVBQUEsU0FBQSxRQUFBLFVBQUE7a0JBQ0EsT0FBQSxPQUFBLE9BQUEsTUFBQTs7OztVQUlBLElBQUEsT0FBQSxLQUFBLFFBQUEsVUFBQSxVQUFBO1lBQ0EsT0FBQSxhQUFBLE9BQUEsS0FBQSxRQUFBLE9BQUEsTUFBQSxLQUFBO1lBQ0EsT0FBQSxPQUFBLE9BQUEsS0FBQSxRQUFBLE9BQUEsTUFBQSxLQUFBOzs7OztNQUtBLFNBQUEsaUJBQUEsT0FBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLE9BQUE7Ozs7O01BS0EsU0FBQSxxQkFBQTtRQUNBLGlCQUFBLFNBQUEsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bd0JBLFNBQUEsWUFBQSxFQUFBOzs7UUFHQSxJQUFBLFdBQUE7UUFDQSxJQUFBLFlBQUEsS0FBQSxPQUFBLGtCQUFBLENBQUEsU0FBQTs7O1FBR0EsSUFBQSxPQUFBLFlBQUEsSUFBQSxDQUFBLE9BQUEsS0FBQSxRQUFBLE9BQUEsT0FBQTtjQUNBLENBQUEsT0FBQSxLQUFBLFFBQUEsT0FBQSxPQUFBLFdBQUEsSUFBQSxPQUFBOztRQUVBO1dBQ0EsY0FBQSxRQUFBLGFBQUEsT0FBQSxLQUFBO1dBQ0EsS0FBQTs7Ozs7YUFLQTs7Ozs7O01BTUEsU0FBQSxVQUFBO1FBQ0EsT0FBQSxDQUFBLE9BQUEsS0FBQSxRQUFBOzs7TUFHQSxTQUFBLG1CQUFBO1FBQ0EsT0FBQSxTQUFBLEtBQUE7OztNQUdBLFNBQUEsbUJBQUE7O1FBRUEsSUFBQSxhQUFBLENBQUEsb0JBQUE7VUFDQSxPQUFBOztRQUVBLE9BQUE7OztNQUdBLFNBQUEsWUFBQTs7UUFFQSxFQUFBLEdBQUEsS0FBQSxTQUFBLE1BQUEsY0FBQSxVQUFBLE9BQUE7VUFDQSxPQUFBOzs7O1FBSUEsRUFBQSxZQUFBLEtBQUE7VUFDQSxRQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxRQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsUUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLE1BQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxRQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsbUJBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxPQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsUUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7Ozs7Ozs7TUFRQSxPQUFBLGFBQUEsVUFBQTtRQUNBLElBQUEsRUFBQSxZQUFBLEtBQUEsWUFBQTtVQUNBO2VBQ0E7VUFDQSxLQUFBLFVBQUEsbUNBQUE7Ozs7O0FDL1JBLFFBQUEsT0FBQTtDQUNBLFdBQUEsZUFBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBQSxRQUFBLFFBQUEsY0FBQSxZQUFBO0lBQ0EsRUFBQSxXQUFBLGFBQUEsU0FBQSxPQUFBOzs7VUFHQSxZQUFBLElBQUEsUUFBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQStDQSxTQUFBLE1BQUE7U0FDQSxTQUFBLFdBQUE7Ozs7SUFJQSxPQUFBLFFBQUE7SUFDQSxPQUFBLFFBQUE7SUFDQSxPQUFBLFNBQUE7SUFDQSxPQUFBLFVBQUE7O0lBRUEsT0FBQSxTQUFBLG1CQUFBLGFBQUE7SUFDQSxPQUFBLE9BQUEsT0FBQSxhQUFBLFNBQUE7O0lBRUEsU0FBQSxtQkFBQSxNQUFBO01BQ0EsSUFBQSxNQUFBO01BQ0EsSUFBQSxDQUFBLE1BQUEsT0FBQTtNQUNBLEtBQUEsTUFBQSxLQUFBLFFBQUEsU0FBQSxFQUFBLENBQUEsSUFBQSxHQUFBO01BQ0EsT0FBQSxDQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7OztJQUdBLFNBQUEsaUJBQUEsU0FBQTtNQUNBLElBQUEsTUFBQTtNQUNBLEtBQUEsSUFBQSxLQUFBLFNBQUEsQ0FBQSxHQUFBLE9BQUEsUUFBQSxNQUFBLFdBQUEsUUFBQSxJQUFBLE9BQUEsRUFBQTtNQUNBLE9BQUEsQ0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLElBQUEsT0FBQSxFQUFBLElBQUEsT0FBQTs7Ozs7OztJQU9BLEVBQUEsY0FBQTs7SUFFQSxPQUFBLGVBQUE7SUFDQSxPQUFBLGFBQUEsV0FBQSxpQkFBQTtNQUNBLFFBQUE7TUFDQSxjQUFBO1FBQ0EscUJBQUE7O01BRUEsU0FBQTs7O0lBR0EsU0FBQSxXQUFBLE1BQUE7TUFDQSxPQUFBLFFBQUEsS0FBQTtNQUNBLE9BQUEsY0FBQSxLQUFBO01BQ0EsT0FBQSxXQUFBLEtBQUE7O01BRUEsSUFBQSxJQUFBO01BQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsWUFBQSxLQUFBO1FBQ0EsRUFBQSxLQUFBOztNQUVBLE9BQUEsUUFBQTs7O0lBR0EsWUFBQSxRQUFBLGFBQUEsTUFBQSxhQUFBLE1BQUEsYUFBQSxPQUFBLE9BQUE7S0FDQSxLQUFBOzs7OztJQUtBLE9BQUEsT0FBQSxhQUFBLFNBQUEsV0FBQTtNQUNBLFlBQUEsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLFdBQUEsT0FBQSxlQUFBO1FBQ0E7Ozs7Ozs7SUFPQSxPQUFBLG9CQUFBLFlBQUE7TUFDQTtTQUNBLFFBQUEsYUFBQSxNQUFBLGFBQUEsTUFBQSxPQUFBLFdBQUEsT0FBQSxlQUFBO1VBQ0E7Ozs7OztJQU1BLE9BQUEsV0FBQSxTQUFBLE1BQUE7TUFDQSxPQUFBLEdBQUEsbUJBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQSxhQUFBLFFBQUE7Ozs7SUFJQSxPQUFBLFVBQUEsU0FBQSxRQUFBLE1BQUEsT0FBQTtNQUNBLE9BQUE7O01BRUEsSUFBQSxDQUFBLEtBQUEsT0FBQSxXQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBLCtCQUFBLEtBQUEsUUFBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7O2FBZUE7UUFDQTtVQUNBO1VBQ0EsS0FBQSxRQUFBLE9BQUEsNkJBQUEsV0FBQSxLQUFBLE9BQUE7VUFDQTs7Ozs7SUFLQSxTQUFBLFdBQUEsTUFBQTtNQUNBLElBQUEsTUFBQTtRQUNBLE9BQUEsT0FBQSxNQUFBLE9BQUE7Ozs7SUFJQSxPQUFBLFdBQUEsU0FBQSxNQUFBO01BQ0EsSUFBQSxLQUFBLE9BQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFdBQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFlBQUEsQ0FBQSxLQUFBLE9BQUEsV0FBQTtRQUNBLE9BQUE7Ozs7SUFJQSxTQUFBLFdBQUEsTUFBQTtNQUNBLE9BQUEsZUFBQTtNQUNBLE9BQUEsYUFBQSxXQUFBLGlCQUFBO01BQ0EsRUFBQSxvQkFBQSxNQUFBOzs7SUFHQSxTQUFBLGlCQUFBLE1BQUE7TUFDQSxPQUFBO1FBQ0E7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBLE9BQUEsY0FBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGdCQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTtjQUNBLE1BQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7UUFJQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7OztJQU1BLE9BQUEsYUFBQTs7QUM1VEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxvQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxZQUFBLFFBQUEsYUFBQSxPQUFBLFlBQUE7OztNQUdBLElBQUEsT0FBQSxZQUFBO01BQ0EsT0FBQSxPQUFBOztNQUVBLE9BQUEsbUJBQUEsS0FBQSxRQUFBLEtBQUEsT0FBQTs7TUFFQSxPQUFBLGFBQUEsTUFBQTs7TUFFQTs7TUFFQSxPQUFBLFdBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxRQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUE7Ozs7O01BS0EsSUFBQSxzQkFBQTtRQUNBLGNBQUE7UUFDQSxTQUFBO1FBQ0EsU0FBQTtRQUNBLFVBQUE7UUFDQSxlQUFBOzs7TUFHQSxJQUFBLEtBQUEsYUFBQSxvQkFBQTtRQUNBLEtBQUEsYUFBQSxvQkFBQSxRQUFBLFNBQUEsWUFBQTtVQUNBLElBQUEsZUFBQSxvQkFBQTtZQUNBLG9CQUFBLGVBQUE7Ozs7O01BS0EsT0FBQSxzQkFBQTs7OztNQUlBLFNBQUEsWUFBQSxFQUFBO1FBQ0EsSUFBQSxlQUFBLE9BQUEsS0FBQTs7UUFFQSxJQUFBLE1BQUE7UUFDQSxPQUFBLEtBQUEsT0FBQSxxQkFBQSxRQUFBLFNBQUEsSUFBQTtVQUNBLElBQUEsT0FBQSxvQkFBQSxLQUFBO1lBQ0EsSUFBQSxLQUFBOzs7UUFHQSxhQUFBLHNCQUFBOztRQUVBO1dBQ0EsbUJBQUEsS0FBQSxLQUFBO1dBQ0EsS0FBQTs7OzthQUlBOzs7OztNQUtBLFNBQUEsWUFBQTs7UUFFQSxFQUFBLFlBQUEsS0FBQTtVQUNBLFFBQUE7WUFDQSxPQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsT0FBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLHdCQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7Ozs7OztNQVFBLE9BQUEsYUFBQSxVQUFBO1FBQ0EsSUFBQSxFQUFBLFlBQUEsS0FBQSxZQUFBO1VBQ0E7ZUFDQTtVQUNBLEtBQUEsVUFBQSxtQ0FBQTs7Ozs7O0FDMUdBLFFBQUEsT0FBQTtHQUNBLFdBQUEsaUJBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsWUFBQSxRQUFBLE1BQUEsYUFBQSxVQUFBLE9BQUEsYUFBQSxhQUFBLFlBQUEsVUFBQTtNQUNBLElBQUEsV0FBQSxTQUFBO01BQ0EsSUFBQSxPQUFBLFlBQUE7TUFDQSxPQUFBLE9BQUE7TUFDQSxPQUFBLFlBQUEsTUFBQSxXQUFBLFNBQUE7TUFDQSxPQUFBLGNBQUEsTUFBQSxXQUFBLFNBQUE7O01BRUEsT0FBQSxZQUFBOztNQUVBLEtBQUEsSUFBQSxPQUFBLE9BQUEsV0FBQTtRQUNBLElBQUEsT0FBQSxVQUFBLEtBQUEsU0FBQSxtQkFBQTtVQUNBLE9BQUEsVUFBQSxPQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsa0JBQUEsTUFBQSxXQUFBLFNBQUE7O1FBRUEsSUFBQSxPQUFBLFVBQUEsS0FBQSxTQUFBLHVCQUFBO1VBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxzQkFBQSxNQUFBLFdBQUEsS0FBQSxPQUFBOzs7OztNQUtBLElBQUEsWUFBQSxPQUFBLFlBQUEsTUFBQSxVQUFBOzs7TUFHQSxJQUFBLG1CQUFBLE9BQUEsbUJBQUEsTUFBQSxRQUFBLEtBQUEsT0FBQTs7TUFFQSxPQUFBLFlBQUEsU0FBQSxPQUFBO1FBQ0EsSUFBQSxPQUFBLE9BQUE7UUFDQSxRQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQSxLQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsYUFBQSxLQUFBLFlBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxhQUFBLEtBQUEsT0FBQSxvQkFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLENBQUEsYUFBQSxDQUFBLEtBQUEsT0FBQSxvQkFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLENBQUEsYUFBQSxLQUFBLE9BQUEsb0JBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBO2NBQ0EsS0FBQSxPQUFBO2NBQ0EsQ0FBQSxLQUFBLE9BQUE7Y0FDQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBO2NBQ0EsS0FBQSxPQUFBO2NBQ0EsQ0FBQSxLQUFBLE9BQUE7Y0FDQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLEtBQUEsT0FBQSxZQUFBLEtBQUEsT0FBQSxhQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsS0FBQSxPQUFBOztRQUVBLE9BQUE7OztNQUdBLE9BQUEsZUFBQSxDQUFBLGFBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBOztNQUVBLE9BQUEsY0FBQSxVQUFBO1FBQ0E7V0FDQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUF5QkEsSUFBQSxZQUFBLElBQUEsU0FBQTtNQUNBLE9BQUEsaUJBQUEsS0FBQSxZQUFBLFVBQUEsU0FBQSxTQUFBO01BQ0EsT0FBQSxtQkFBQSxLQUFBLFlBQUEsVUFBQSxTQUFBLFNBQUE7TUFDQSxPQUFBLGVBQUEsS0FBQSxZQUFBLFVBQUEsU0FBQSxTQUFBOztNQUVBLE9BQUEsbUJBQUEsVUFBQTs7TUFFQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsU0FBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTtZQUNBLFdBQUE7OztTQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7OztBQ3pIQSxRQUFBLE9BQUE7R0FDQSxXQUFBLFlBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxZQUFBLFFBQUEsT0FBQSxRQUFBLFVBQUEsT0FBQSxhQUFBLFdBQUE7TUFDQSxPQUFBLFVBQUE7O01BRUEsT0FBQSxhQUFBOztNQUVBLElBQUEsV0FBQSxTQUFBO01BQ0EsT0FBQSxZQUFBLE1BQUEsVUFBQTs7OztNQUlBLElBQUEsV0FBQSxTQUFBO01BQ0EsT0FBQSxZQUFBLE1BQUEsVUFBQTs7O01BR0EsT0FBQSxhQUFBOztNQUVBLFNBQUEsWUFBQTtRQUNBLE9BQUEsR0FBQTs7O01BR0EsU0FBQSxRQUFBLEtBQUE7UUFDQSxPQUFBLFFBQUEsS0FBQTs7O01BR0EsU0FBQSxZQUFBO1FBQ0EsT0FBQSxRQUFBOzs7TUFHQSxPQUFBLFFBQUEsVUFBQTtRQUNBO1FBQ0EsWUFBQTtVQUNBLE9BQUEsT0FBQSxPQUFBLFVBQUEsV0FBQTs7O01BR0EsT0FBQSxXQUFBLFVBQUE7UUFDQTtRQUNBLFlBQUE7VUFDQSxPQUFBLE9BQUEsT0FBQSxVQUFBLFdBQUE7OztNQUdBLE9BQUEsZ0JBQUEsU0FBQSxPQUFBO1FBQ0EsT0FBQSxhQUFBOzs7TUFHQSxPQUFBLGlCQUFBLFdBQUE7UUFDQSxJQUFBLFFBQUEsT0FBQTtRQUNBLFlBQUEsZUFBQTtRQUNBLEtBQUEsZ0JBQUEsMkNBQUE7Ozs7OztNQU1BLE9BQUEsVUFBQTs7OztBQy9EQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGtCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLFlBQUEsUUFBQSxPQUFBLGFBQUEsU0FBQSxrQkFBQSxhQUFBLGtCQUFBOzs7TUFHQSxpQkFBQSxTQUFBLEtBQUE7Ozs7OztNQU1BLGlCQUFBLFNBQUEsS0FBQTs7Ozs7O01BTUEsU0FBQSxVQUFBLFdBQUE7UUFDQSxLQUFBLFlBQUEseUNBQUEsVUFBQSxRQUFBLFlBQUE7UUFDQSxPQUFBOzs7O01BSUEsU0FBQSxRQUFBLEtBQUE7UUFDQSxLQUFBLGNBQUEsS0FBQSxTQUFBOzs7O01BSUEsT0FBQSxpQkFBQSxTQUFBLFVBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxRQUFBO1VBQ0EsaUJBQUEsTUFBQSxVQUFBLFlBQUEsT0FBQSxVQUFBO2FBQ0E7VUFDQSxpQkFBQSxNQUFBLFVBQUEsWUFBQSxPQUFBOzs7Ozs7TUFNQSxPQUFBLGdCQUFBLFNBQUEsV0FBQTs7UUFFQSxpQkFBQSxJQUFBLFVBQUEsS0FBQSxLQUFBOzs7Ozs7Ozs7O01BVUEsaUJBQUEsU0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUE4QkEsT0FBQSxXQUFBLFNBQUEsTUFBQTs7UUFFQSxJQUFBLEtBQUEsSUFBQSxZQUFBLEtBQUEsS0FBQTtVQUNBLE9BQUE7Ozs7Ozs7O0FDNUZBLFFBQUEsT0FBQTtHQUNBLFdBQUEsYUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLE9BQUEsUUFBQSxVQUFBLE9BQUEsYUFBQSxXQUFBOztNQUVBLE9BQUEsYUFBQTs7O01BR0EsSUFBQSxXQUFBLFNBQUE7TUFDQSxPQUFBLFlBQUEsTUFBQSxVQUFBOzs7TUFHQSxPQUFBLGFBQUE7O01BRUEsU0FBQSxZQUFBO1FBQ0EsT0FBQSxHQUFBOzs7TUFHQSxTQUFBLFFBQUEsS0FBQTtRQUNBLE9BQUEsUUFBQSxLQUFBOzs7TUFHQSxTQUFBLFlBQUE7UUFDQSxPQUFBLFFBQUE7OztNQUdBLE9BQUEsUUFBQSxVQUFBO1FBQ0E7UUFDQSxZQUFBO1VBQ0EsT0FBQSxPQUFBLE9BQUEsVUFBQSxXQUFBOzs7TUFHQSxPQUFBLFdBQUEsVUFBQTtRQUNBO1FBQ0EsWUFBQTtVQUNBLE9BQUEsT0FBQSxPQUFBLFVBQUEsV0FBQTs7O01BR0EsT0FBQSxnQkFBQSxTQUFBLE9BQUE7UUFDQSxPQUFBLGFBQUE7OztNQUdBLE9BQUEsaUJBQUEsV0FBQTtRQUNBLElBQUEsUUFBQSxPQUFBO1FBQ0EsWUFBQSxlQUFBO1FBQ0EsS0FBQSxnQkFBQSwyQ0FBQTs7Ozs7O0FDbkRBLFFBQUEsT0FBQTtHQUNBLFdBQUEsYUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLGNBQUEsUUFBQSxZQUFBO01BQ0EsSUFBQSxRQUFBLGFBQUE7O01BRUEsT0FBQSxVQUFBOztNQUVBLE9BQUEsaUJBQUEsVUFBQTtRQUNBLElBQUEsV0FBQSxPQUFBO1FBQ0EsSUFBQSxVQUFBLE9BQUE7O1FBRUEsSUFBQSxhQUFBLFFBQUE7VUFDQSxPQUFBLFFBQUE7VUFDQSxPQUFBLFVBQUE7VUFDQTs7O1FBR0EsWUFBQTtVQUNBO1VBQ0EsT0FBQTtVQUNBOzs7OztVQUtBOzs7Ozs7O0FDN0JBLFFBQUEsT0FBQTtHQUNBLFFBQUEsWUFBQSxXQUFBO0dBQ0EsV0FBQSxlQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFlBQUEsUUFBQSxpQkFBQSxPQUFBLGFBQUEsU0FBQSxXQUFBOztNQUVBLElBQUEsT0FBQSxXQUFBOztNQUVBLE9BQUEsYUFBQTs7TUFFQSxPQUFBLG1CQUFBLE1BQUEsUUFBQSxLQUFBLE9BQUE7OztNQUdBO09BQ0E7T0FDQSxLQUFBOzs7O01BSUEsT0FBQSxTQUFBLFVBQUE7UUFDQSxZQUFBOzs7TUFHQSxPQUFBLGNBQUE7TUFDQSxPQUFBLGdCQUFBLFVBQUE7UUFDQSxPQUFBLGNBQUEsQ0FBQSxPQUFBOzs7O01BSUEsRUFBQSxTQUFBLEdBQUEsU0FBQSxVQUFBO1FBQ0EsT0FBQSxjQUFBOzs7Ozs7Ozs7OztBQzlCQSxRQUFBLE9BQUE7R0FDQSxXQUFBLFlBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsUUFBQSxVQUFBLGFBQUEsVUFBQSxPQUFBLGFBQUEsYUFBQSxLQUFBOztNQUVBLElBQUEsV0FBQSxTQUFBOztNQUVBLE9BQUEsWUFBQSxNQUFBLFVBQUE7O01BRUEsT0FBQSxPQUFBLFlBQUE7O01BRUEsU0FBQSxhQUFBLE1BQUEsUUFBQTtRQUNBLElBQUEsT0FBQTtRQUNBLE1BQUEsUUFBQTs7Ozs7UUFLQSxPQUFBOzs7O01BSUEsWUFBQSxTQUFBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXVDQSxPQUFBLGFBQUEsV0FBQTs7UUFFQSxXQUFBO1VBQ0EsYUFBQSxPQUFBO1VBQ0EsU0FBQSxDQUFBLENBQUEsR0FBQSxZQUFBLEtBQUEsS0FBQSxLQUFBLFlBQUEsS0FBQSxRQUFBLE1BQUEsT0FBQSxPQUFBO1VBQ0EsUUFBQSxDQUFBLE1BQUEsT0FBQSxVQUFBLFFBQUEsT0FBQSxZQUFBLFVBQUEsT0FBQSxjQUFBLE1BQUEsT0FBQTtVQUNBLFdBQUE7O1FBRUEsUUFBQSxJQUFBO1FBQ0EsUUFBQSxJQUFBLE9BQUE7O1FBRUEsWUFBQSxPQUFBO1FBQ0EsT0FBQTs7OztNQUlBLE9BQUEsaUJBQUEsVUFBQTtRQUNBLE9BQUEsa0JBQUE7UUFDQSxPQUFBLFdBQUE7UUFDQSxPQUFBLGFBQUE7UUFDQSxPQUFBLGVBQUE7UUFDQSxPQUFBLFdBQUE7UUFDQSxPQUFBLG1CQUFBOzs7O01BSUEsT0FBQSxXQUFBLFNBQUEsUUFBQTtRQUNBLFNBQUEsQ0FBQSxHQUFBLFlBQUEsS0FBQSxLQUFBLEtBQUEsWUFBQSxLQUFBLFFBQUEsTUFBQSxNQUFBO1FBQ0EsWUFBQSxLQUFBLE9BQUE7O1FBRUEsT0FBQTs7OztNQUlBLE9BQUEsZUFBQSxTQUFBLFFBQUEsUUFBQSxPQUFBOztRQUVBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQSw2QkFBQSxPQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUEyQkEsT0FBQSxlQUFBLFNBQUEsUUFBQSxRQUFBLE9BQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsNkJBQUEsT0FBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7OztNQWdCQSxPQUFBLHVCQUFBLFNBQUEsUUFBQSxRQUFBLE9BQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsNkJBQUEsT0FBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BMkJBLE9BQUEsYUFBQSxTQUFBLE1BQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUE4QkEsT0FBQSxZQUFBLFNBQUEsTUFBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BdUJBLE9BQUEsaUJBQUEsU0FBQSxNQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bd0JBLE9BQUEsa0JBQUEsU0FBQSxPQUFBLFFBQUE7UUFDQSxJQUFBLFFBQUEsS0FBQSxDQUFBLEtBQUE7YUFDQSxDQUFBLEtBQUE7O1FBRUEsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7OztNQWdCQSxPQUFBLE9BQUEsYUFBQSxTQUFBLFdBQUE7UUFDQSxZQUFBLGlCQUFBLFdBQUEsT0FBQSxlQUFBO1VBQ0E7Ozs7OztNQU1BLE9BQUEsb0JBQUEsWUFBQTtRQUNBLFlBQUEsaUJBQUEsT0FBQSxXQUFBLE9BQUEsZUFBQTtVQUNBOzs7Ozs7Ozs7Ozs7QUNuYUEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxjQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLGNBQUEsWUFBQTtNQUNBLElBQUEsUUFBQSxhQUFBOztNQUVBLE9BQUEsVUFBQTs7TUFFQSxJQUFBLE9BQUE7UUFDQSxZQUFBLE9BQUE7VUFDQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFVBQUE7WUFDQSxPQUFBLFVBQUE7O1VBRUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxVQUFBOzs7O0FBSUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdyZWcnLCBbXG4gICd1aS5yb3V0ZXInLFxuICAnY2hhcnQuanMnLFxuXSk7XG5cbmFwcFxuICAuY29uZmlnKFtcbiAgICAnJGh0dHBQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJGh0dHBQcm92aWRlcil7XG5cbiAgICAgIC8vIEFkZCBhdXRoIHRva2VuIHRvIEF1dGhvcml6YXRpb24gaGVhZGVyXG4gICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdBdXRoSW50ZXJjZXB0b3InKTtcblxuICAgIH1dKVxuICAucnVuKFtcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgICdTZXNzaW9uJyxcbiAgICBmdW5jdGlvbihBdXRoU2VydmljZSwgU2Vzc2lvbil7XG5cbiAgICAgIC8vIFN0YXJ0dXAsIGxvZ2luIGlmIHRoZXJlJ3MgIGEgdG9rZW4uXG4gICAgICB2YXIgdG9rZW4gPSBTZXNzaW9uLmdldFRva2VuKCk7XG4gICAgICBpZiAodG9rZW4pe1xuICAgICAgICBBdXRoU2VydmljZS5sb2dpbldpdGhUb2tlbih0b2tlbik7XG4gICAgICB9XG5cbiAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gICAgLmNvbnN0YW50KCdFVkVOVF9JTkZPJywge1xuICAgICAgICBOQU1FOiAnSGFja2l0IDIwMjAnLFxuICAgIH0pXG4gICAgLmNvbnN0YW50KCdEQVNIQk9BUkQnLCB7XG4gICAgICAgIFVOVkVSSUZJRUQ6ICdZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYW4gZW1haWwgYXNraW5nIHlvdSB2ZXJpZnkgeW91ciBlbWFpbC4gQ2xpY2sgdGhlIGxpbmsgaW4gdGhlIGVtYWlsIGFuZCB5b3UgY2FuIHN0YXJ0IHlvdXIgYXBwbGljYXRpb24hJyxcbiAgICAgICAgSU5DT01QTEVURV9USVRMRTogJ1lvdSBzdGlsbCBuZWVkIHRvIGNvbXBsZXRlIHlvdXIgYXBwbGljYXRpb24hJyxcbiAgICAgICAgSU5DT01QTEVURTogJ0lmIHlvdSBkbyBub3QgY29tcGxldGUgeW91ciBhcHBsaWNhdGlvbiBiZWZvcmUgdGhlIFtBUFBfREVBRExJTkVdLCB5b3Ugd2lsbCBub3QgYmUgY29uc2lkZXJlZCBmb3IgdGhlIGFkbWlzc2lvbnMgbG90dGVyeSEnLFxuICAgICAgICBTVUJNSVRURURfVElUTEU6ICdZb3VyIGFwcGxpY2F0aW9uIGhhcyBiZWVuIHN1Ym1pdHRlZCEnLFxuICAgICAgICBTVUJNSVRURUQ6ICdGZWVsIGZyZWUgdG8gZWRpdCBpdCBhdCBhbnkgdGltZS4gSG93ZXZlciwgb25jZSByZWdpc3RyYXRpb24gaXMgY2xvc2VkLCB5b3Ugd2lsbCBub3QgYmUgYWJsZSB0byBlZGl0IGl0IGFueSBmdXJ0aGVyLlxcbkFkbWlzc2lvbnMgd2lsbCBiZSBkZXRlcm1pbmVkIGJ5IGEgcmFuZG9tIGxvdHRlcnkuIFBsZWFzZSBtYWtlIHN1cmUgeW91ciBpbmZvcm1hdGlvbiBpcyBhY2N1cmF0ZSBiZWZvcmUgcmVnaXN0cmF0aW9uIGlzIGNsb3NlZCEnLFxuICAgICAgICBDTE9TRURfQU5EX0lOQ09NUExFVEVfVElUTEU6ICdVbmZvcnR1bmF0ZWx5LCByZWdpc3RyYXRpb24gaGFzIGNsb3NlZCwgYW5kIHRoZSBsb3R0ZXJ5IHByb2Nlc3MgaGFzIGJlZ3VuLicsXG4gICAgICAgIENMT1NFRF9BTkRfSU5DT01QTEVURTogJ0JlY2F1c2UgeW91IGhhdmUgbm90IGNvbXBsZXRlZCB5b3VyIHByb2ZpbGUgaW4gdGltZSwgeW91IHdpbGwgbm90IGJlIGVsaWdpYmxlIGZvciB0aGUgbG90dGVyeSBwcm9jZXNzLicsXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5fQ09ORklSTV9USVRMRTogJ1lvdSBtdXN0IGNvbmZpcm0gYnkgW0NPTkZJUk1fREVBRExJTkVdLicsXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5OT1RfQ09ORklSTV9USVRMRTogJ1lvdXIgY29uZmlybWF0aW9uIGRlYWRsaW5lIG9mIFtDT05GSVJNX0RFQURMSU5FXSBoYXMgcGFzc2VkLicsXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5OT1RfQ09ORklSTTogJ0FsdGhvdWdoIHlvdSB3ZXJlIGFjY2VwdGVkLCB5b3UgZGlkIG5vdCBjb21wbGV0ZSB5b3VyIGNvbmZpcm1hdGlvbiBpbiB0aW1lLlxcblVuZm9ydHVuYXRlbHksIHRoaXMgbWVhbnMgdGhhdCB5b3Ugd2lsbCBub3QgYmUgYWJsZSB0byBhdHRlbmQgdGhlIGV2ZW50LCBhcyB3ZSBtdXN0IGJlZ2luIHRvIGFjY2VwdCBvdGhlciBhcHBsaWNhbnRzIG9uIHRoZSB3YWl0bGlzdC5cXG5XZSBob3BlIHRvIHNlZSB5b3UgYWdhaW4gbmV4dCB5ZWFyIScsXG4gICAgICAgIENPTkZJUk1FRF9OT1RfUEFTVF9USVRMRTogJ1lvdSBjYW4gZWRpdCB5b3VyIGNvbmZpcm1hdGlvbiBpbmZvcm1hdGlvbiB1bnRpbCBbQ09ORklSTV9ERUFETElORV0nLFxuICAgICAgICBERUNMSU5FRDogJ1dlXFwncmUgc29ycnkgdG8gaGVhciB0aGF0IHlvdSB3b25cXCd0IGJlIGFibGUgdG8gbWFrZSBpdCB0byBIYWNraXQgMjAyMCEgOihcXG5NYXliZSBuZXh0IHllYXIhIFdlIGhvcGUgeW91IHNlZSB5b3UgYWdhaW4gc29vbi4nLFxuICAgIH0pXG4gICAgLmNvbnN0YW50KCdURUFNJyx7XG4gICAgICAgIE5PX1RFQU1fUkVHX0NMT1NFRDogJ1VuZm9ydHVuYXRlbHksIGl0XFwncyB0b28gbGF0ZSB0byBlbnRlciB0aGUgbG90dGVyeSB3aXRoIGEgdGVhbS5cXG5Ib3dldmVyLCB5b3UgY2FuIHN0aWxsIGZvcm0gdGVhbXMgb24geW91ciBvd24gYmVmb3JlIG9yIGR1cmluZyB0aGUgZXZlbnQhJyxcbiAgICB9KTtcbiIsIlxuYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb25maWcoW1xuICAgICckc3RhdGVQcm92aWRlcicsXG4gICAgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgJyRsb2NhdGlvblByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbihcbiAgICAgICRzdGF0ZVByb3ZpZGVyLFxuICAgICAgJHVybFJvdXRlclByb3ZpZGVyLFxuICAgICAgJGxvY2F0aW9uUHJvdmlkZXIpIHtcblxuICAgIC8vIEZvciBhbnkgdW5tYXRjaGVkIHVybCwgcmVkaXJlY3QgdG8gL3N0YXRlMVxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvNDA0XCIpO1xuICAgIFxuICAgIC8vIFNldCB1cCBkZSBzdGF0ZXNcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgLnN0YXRlKCdsb2dpbicsIHtcbiAgICAgICAgdXJsOiBcIi9sb2dpblwiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9sb2dpbi9sb2dpbi5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZSxcbiAgICAgICAgICByZXF1aXJlTG9nb3V0OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAnc2V0dGluZ3MnOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xuICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgdXJsOiBcIi9cIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvbG9naW4vbG9naW4uaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2UsXG4gICAgICAgICAgcmVxdWlyZUxvZ291dDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgJ3NldHRpbmdzJzogZnVuY3Rpb24oU2V0dGluZ3NTZXJ2aWNlKXtcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vIC5zdGF0ZSgnaG9tZScsIHtcbiAgICAgIC8vICAgdXJsOiBcIi9cIixcbiAgICAgIC8vICAgdGVtcGxhdGVVcmw6IFwidmlld3MvaG9tZS9ob21lLmh0bWxcIixcbiAgICAgIC8vICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJyxcbiAgICAgIC8vICAgZGF0YToge1xuICAgICAgLy8gICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcbiAgICAgIC8vICAgfSxcbiAgICAgIC8vICAgcmVzb2x2ZToge1xuICAgICAgLy8gICAgICdzZXR0aW5ncyc6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XG4gICAgICAvLyAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XG4gICAgICAvLyAgICAgfVxuICAgICAgLy8gICB9XG4gICAgICAvLyB9KVxuXG4gICAgICAuc3RhdGUoJ2FwcCcsIHtcbiAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAnJzoge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYmFzZS5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcIkJhc2VDdHJsXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnc2lkZWJhckBhcHAnOiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zaWRlYmFyL3NpZGViYXIuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1NpZGViYXJDdHJsJyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlcXVpcmVMb2dpbjogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdhcHAuZGFzaGJvYXJkJywge1xuICAgICAgICB1cmw6IFwiL2Rhc2hib2FyZFwiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9kYXNoYm9hcmQvZGFzaGJvYXJkLmh0bWxcIixcbiAgICAgICAgY29udHJvbGxlcjogJ0Rhc2hib2FyZEN0cmwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnYXBwLmFwcGxpY2F0aW9uJywge1xuICAgICAgICB1cmw6IFwiL2FwcGxpY2F0aW9uXCIsXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLmh0bWxcIixcbiAgICAgICAgY29udHJvbGxlcjogJ0FwcGxpY2F0aW9uQ3RybCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByZXF1aXJlVmVyaWZpZWQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbihVc2VyU2VydmljZSl7XG4gICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xuICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnYXBwLmNvbmZpcm1hdGlvbicsIHtcbiAgICAgICAgdXJsOiBcIi9jb25maXJtYXRpb25cIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvY29uZmlybWF0aW9uL2NvbmZpcm1hdGlvbi5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb25maXJtYXRpb25DdHJsJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlcXVpcmVBZG1pdHRlZDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnYXBwLmNoYWxsZW5nZXMnLCB7XG4gICAgICAgIHVybDogXCIvY2hhbGxlbmdlc1wiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jaGFsbGVuZ2VzL2NoYWxsZW5nZXMuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnQ2hhbGxlbmdlc0N0cmwnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVxdWlyZVZlcmlmaWVkOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24oVXNlclNlcnZpY2Upe1xuICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXR0aW5nczogZnVuY3Rpb24oU2V0dGluZ3NTZXJ2aWNlKXtcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ2FwcC50ZWFtJywge1xuICAgICAgICB1cmw6IFwiL3RlYW1cIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdGVhbS90ZWFtLmh0bWxcIixcbiAgICAgICAgY29udHJvbGxlcjogJ1RlYW1DdHJsJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlcXVpcmVWZXJpZmllZDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4nLCB7XG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgJyc6IHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL2FkbWluLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbkN0cmwnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVxdWlyZUFkbWluOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ2FwcC5jaGVja2luJywge1xuICAgICAgICB1cmw6ICcvY2hlY2tpbicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY2hlY2tpbi9jaGVja2luLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQ2hlY2tpbkN0cmwnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVxdWlyZVZvbHVudGVlcjogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4uc3RhdHMnLCB7XG4gICAgICAgIHVybDogXCIvYWRtaW5cIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vc3RhdHMvc3RhdHMuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5TdGF0c0N0cmwnXG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4ubWFpbCcsIHtcbiAgICAgICAgdXJsOiBcIi9hZG1pbi9tYWlsXCIsXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL21haWwvbWFpbC5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pbk1haWxDdHJsJ1xuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLmNoYWxsZW5nZXMnLCB7XG4gICAgICAgIHVybDogXCIvYWRtaW4vY2hhbGxlbmdlc1wiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9jaGFsbGVuZ2VzL2NoYWxsZW5nZXMuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnYWRtaW5DaGFsbGVuZ2VzQ3RybCdcbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5jaGFsbGVuZ2UnLCB7XG4gICAgICAgIHVybDogXCIvYWRtaW4vY2hhbGxlbmdlcy86aWRcIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vY2hhbGxlbmdlL2NoYWxsZW5nZS5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbkNoYWxsZW5nZUN0cmwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgJ2NoYWxsZW5nZSc6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgQ2hhbGxlbmdlU2VydmljZSl7XG4gICAgICAgICAgICByZXR1cm4gQ2hhbGxlbmdlU2VydmljZS5nZXQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5tYXJrZXRpbmcnLCB7XG4gICAgICAgIHVybDogXCIvYWRtaW4vbWFya2V0aW5nXCIsXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL21hcmtldGluZy9tYXJrZXRpbmcuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnYWRtaW5NYXJrZXRpbmdDdHJsJ1xuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnVzZXJzJywge1xuICAgICAgICB1cmw6IFwiL2FkbWluL3VzZXJzP1wiICtcbiAgICAgICAgICAnJnBhZ2UnICtcbiAgICAgICAgICAnJnNpemUnICtcbiAgICAgICAgICAnJnF1ZXJ5JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vdXNlcnMvdXNlcnMuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Vc2Vyc0N0cmwnXG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4udXNlcicsIHtcbiAgICAgICAgdXJsOiBcIi9hZG1pbi91c2Vycy86aWRcIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vdXNlci91c2VyLmh0bWxcIixcbiAgICAgICAgY29udHJvbGxlcjogJ0FkbWluVXNlckN0cmwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgJ3VzZXInOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIFVzZXJTZXJ2aWNlKXtcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5zZXR0aW5ncycsIHtcbiAgICAgICAgdXJsOiBcIi9hZG1pbi9zZXR0aW5nc1wiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9zZXR0aW5ncy9zZXR0aW5ncy5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblNldHRpbmdzQ3RybCcsXG4gICAgICB9KVxuICAgICAgLnN0YXRlKCdyZXNldCcsIHtcbiAgICAgICAgdXJsOiBcIi9yZXNldC86dG9rZW5cIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvcmVzZXQvcmVzZXQuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnUmVzZXRDdHJsJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgndmVyaWZ5Jywge1xuICAgICAgICB1cmw6IFwiL3ZlcmlmeS86dG9rZW5cIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdmVyaWZ5L3ZlcmlmeS5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdWZXJpZnlDdHJsJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnNDA0Jywge1xuICAgICAgICB1cmw6IFwiLzQwNFwiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy80MDQuaHRtbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XG4gICAgICBlbmFibGVkOiB0cnVlLFxuICAgIH0pO1xuXG4gIH1dKVxuICAucnVuKFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRzdGF0ZScsXG4gICAgJ1Nlc3Npb24nLFxuICAgIGZ1bmN0aW9uKFxuICAgICAgJHJvb3RTY29wZSxcbiAgICAgICRzdGF0ZSxcbiAgICAgIFNlc3Npb24gKXtcblxuICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgICB9KTtcblxuICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcykge1xuXG4gICAgICAgIHZhciByZXF1aXJlTG9naW4gPSB0b1N0YXRlLmRhdGEucmVxdWlyZUxvZ2luO1xuICAgICAgICB2YXIgcmVxdWlyZUxvZ291dCA9IHRvU3RhdGUuZGF0YS5yZXF1aXJlTG9nb3V0O1xuICAgICAgICB2YXIgcmVxdWlyZUFkbWluID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVBZG1pbjtcbiAgICAgICAgdmFyIHJlcXVpcmVWb2x1bnRlZXIgPSB0b1N0YXRlLmRhdGEucmVxdWlyZVZvbHVudGVlcjtcbiAgICAgICAgdmFyIHJlcXVpcmVWZXJpZmllZCA9IHRvU3RhdGUuZGF0YS5yZXF1aXJlVmVyaWZpZWQ7XG4gICAgICAgIHZhciByZXF1aXJlQWRtaXR0ZWQgPSB0b1N0YXRlLmRhdGEucmVxdWlyZUFkbWl0dGVkO1xuICBcbiAgICAgICAgaWYgKHJlcXVpcmVMb2dpbiAmJiAhU2Vzc2lvbi5nZXRUb2tlbigpKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgaWYgKHJlcXVpcmVMb2dvdXQgJiYgU2Vzc2lvbi5nZXRUb2tlbigpKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKHJlcXVpcmVBZG1pbiAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkuYWRtaW4pIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAgICAgICAgICAgXG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGlmIChyZXF1aXJlVm9sdW50ZWVyICYmICFTZXNzaW9uLmdldFVzZXIoKS52b2x1bnRlZXIgJiYgcmVxdWlyZUFkbWluICYmICFTZXNzaW9uLmdldFVzZXIoKS5hZG1pbikge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7ICAgICAgICAgICBcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgaWYgKHJlcXVpcmVWZXJpZmllZCAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkudmVyaWZpZWQpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAgICAgICAgICAgXG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgIH1cbiAgXG4gICAgICAgIGlmIChyZXF1aXJlQWRtaXR0ZWQgJiYgIVNlc3Npb24uZ2V0VXNlcigpLnN0YXR1cy5hZG1pdHRlZCkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7ICAgICAgICAgICBcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgfVxuICBcblxuICAgICAgfSk7XG5cbiAgICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIFtcbiAgICAnU2Vzc2lvbicsXG4gICAgZnVuY3Rpb24oU2Vzc2lvbil7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlcXVlc3Q6IGZ1bmN0aW9uKGNvbmZpZyl7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBTZXNzaW9uLmdldFRva2VuKCk7XG4gICAgICAgICAgICBpZiAodG9rZW4pe1xuICAgICAgICAgICAgICBjb25maWcuaGVhZGVyc1sneC1hY2Nlc3MtdG9rZW4nXSA9IHRva2VuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5zZXJ2aWNlKCdTZXNzaW9uJywgW1xuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJHdpbmRvdycsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHdpbmRvdyl7XG5cbiAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKHRva2VuLCB1c2VyKXtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dCA9IHRva2VuO1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkID0gdXNlci5faWQ7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5jdXJyZW50VXNlciA9IEpTT04uc3RyaW5naWZ5KHVzZXIpO1xuICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHVzZXI7XG4gICAgfTtcblxuICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKG9uQ29tcGxldGUpe1xuICAgICAgZGVsZXRlICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dDtcbiAgICAgIGRlbGV0ZSAkd2luZG93LmxvY2FsU3RvcmFnZS51c2VySWQ7XG4gICAgICBkZWxldGUgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXI7XG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcbiAgICAgIGlmIChvbkNvbXBsZXRlKXtcbiAgICAgICAgb25Db21wbGV0ZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmdldFRva2VuID0gZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZS5qd3Q7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0VXNlcklkID0gZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZS51c2VySWQ7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0VXNlciA9IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZS5jdXJyZW50VXNlcik7XG4gICAgfTtcblxuICAgIHRoaXMuc2V0VXNlciA9IGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXIgPSBKU09OLnN0cmluZ2lmeSh1c2VyKTtcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuICAgIH07XG5cbiAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuZmFjdG9yeSgnVXRpbHMnLCBbXG4gICAgZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzUmVnT3BlbjogZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgICAgICAgIHJldHVybiBEYXRlLm5vdygpID4gc2V0dGluZ3MudGltZU9wZW4gJiYgRGF0ZS5ub3coKSA8IHNldHRpbmdzLnRpbWVDbG9zZTtcbiAgICAgICAgfSxcbiAgICAgICAgaXNBZnRlcjogZnVuY3Rpb24odGltZSl7XG4gICAgICAgICAgcmV0dXJuIERhdGUubm93KCkgPiB0aW1lO1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXRUaW1lOiBmdW5jdGlvbih0aW1lKXtcblxuICAgICAgICAgIGlmICghdGltZSl7XG4gICAgICAgICAgICByZXR1cm4gXCJJbnZhbGlkIERhdGVcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkYXRlID0gbmV3IERhdGUodGltZSk7XG4gICAgICAgICAgLy8gSGFjayBmb3IgdGltZXpvbmVcbiAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdCgnZGRkZCwgTU1NTSBEbyBZWVlZLCBoOm1tIGEnKSArXG4gICAgICAgICAgICBcIiBcIiArIGRhdGUudG9UaW1lU3RyaW5nKCkuc3BsaXQoJyAnKVsyXTtcblxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1dKTtcbiIsIihmdW5jdGlvbigkKSB7XG4gICAgalF1ZXJ5LmZuLmV4dGVuZCh7XG4gICAgICAgIGh0bWw1X3FyY29kZTogZnVuY3Rpb24ocXJjb2RlU3VjY2VzcywgcXJjb2RlRXJyb3IsIHZpZGVvRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRFbGVtID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBjdXJyZW50RWxlbS5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGggPSBjdXJyZW50RWxlbS53aWR0aCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhlaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IDI1MDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAod2lkdGggPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aCA9IDMwMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyB2YXIgdmlkRWxlbSA9ICQoJzx2aWRlbyB3aWR0aD1cIicgKyB3aWR0aCArICdweFwiIGhlaWdodD1cIicgKyBoZWlnaHQgKyAncHhcIj48L3ZpZGVvPicpLmFwcGVuZFRvKGN1cnJlbnRFbGVtKTtcbiAgICAgICAgICAgICAgICB2YXIgdmlkRWxlbSA9ICQoJzx2aWRlbyB3aWR0aD1cIicgKyB3aWR0aCArICdweFwiIGhlaWdodD1cIicgKyBoZWlnaHQgKyAncHhcIiBhdXRvcGxheSBwbGF5c2lubGluZT48L3ZpZGVvPicpLmFwcGVuZFRvKGN1cnJlbnRFbGVtKTtcbiAgICAgICAgICAgICAgICB2YXIgY2FudmFzRWxlbSA9ICQoJzxjYW52YXMgaWQ9XCJxci1jYW52YXNcIiB3aWR0aD1cIicgKyAod2lkdGggLSAyKSArICdweFwiIGhlaWdodD1cIicgKyAoaGVpZ2h0IC0gMikgKyAncHhcIiBzdHlsZT1cImRpc3BsYXk6bm9uZTtcIj48L2NhbnZhcz4nKS5hcHBlbmRUbyhjdXJyZW50RWxlbSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgdmlkZW8gPSB2aWRFbGVtWzBdO1xuICAgICAgICAgICAgICAgIHZhciBjYW52YXMgPSBjYW52YXNFbGVtWzBdO1xuICAgICAgICAgICAgICAgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICAgICAgdmFyIGxvY2FsTWVkaWFTdHJlYW07XG5cbiAgICAgICAgICAgICAgICB2YXIgc2NhbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxNZWRpYVN0cmVhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodmlkZW8sIDAsIDAsIDMwNywgMjUwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxcmNvZGUuZGVjb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXJjb2RlRXJyb3IoZSwgbG9jYWxNZWRpYVN0cmVhbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQuZGF0YShjdXJyZW50RWxlbVswXSwgXCJ0aW1lb3V0XCIsIHNldFRpbWVvdXQoc2NhbiwgNTAwKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQuZGF0YShjdXJyZW50RWxlbVswXSwgXCJ0aW1lb3V0XCIsIHNldFRpbWVvdXQoc2NhbiwgNTAwKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9Oy8vZW5kIHNuYXBzaG90IGZ1bmN0aW9uXG5cbiAgICAgICAgICAgICAgICB3aW5kb3cuVVJMID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMIHx8IHdpbmRvdy5tb3pVUkwgfHwgd2luZG93Lm1zVVJMO1xuICAgICAgICAgICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPSBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8IG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgfHwgbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSB8fCBuYXZpZ2F0b3IubXNHZXRVc2VyTWVkaWE7XG5cbiAgICAgICAgICAgICAgICB2YXIgc3VjY2Vzc0NhbGxiYWNrID0gZnVuY3Rpb24oc3RyZWFtKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHZpZGVvLnNyYyA9ICh3aW5kb3cuVVJMICYmIHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSkpIHx8IHN0cmVhbTtcbiAgICAgICAgICAgICAgICAgICAgdmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbE1lZGlhU3RyZWFtID0gc3RyZWFtO1xuICAgICAgICAgICAgICAgICAgICAkLmRhdGEoY3VycmVudEVsZW1bMF0sIFwic3RyZWFtXCIsIHN0cmVhbSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmlkZW8ucGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAkLmRhdGEoY3VycmVudEVsZW1bMF0sIFwidGltZW91dFwiLCBzZXRUaW1lb3V0KHNjYW4sIDEwMDApKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgZ2V0VXNlck1lZGlhIG1ldGhvZCB3aXRoIG91ciBjYWxsYmFjayBmdW5jdGlvbnNcbiAgICAgICAgICAgICAgICBpZiAobmF2aWdhdG9yLmdldFVzZXJNZWRpYSkge1xuICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKHt2aWRlbzogeyBmYWNpbmdNb2RlOiBcImVudmlyb25tZW50XCIgfSB9LCBzdWNjZXNzQ2FsbGJhY2ssIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWRlb0Vycm9yKGVycm9yLCBsb2NhbE1lZGlhU3RyZWFtKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05hdGl2ZSB3ZWIgY2FtZXJhIHN0cmVhbWluZyAoZ2V0VXNlck1lZGlhKSBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3Nlci4nKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gRGlzcGxheSBhIGZyaWVuZGx5IFwic29ycnlcIiBtZXNzYWdlIHRvIHRoZSB1c2VyXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcXJjb2RlLmNhbGxiYWNrID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBxcmNvZGVTdWNjZXNzKHJlc3VsdCwgbG9jYWxNZWRpYVN0cmVhbSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pOyAvLyBlbmQgb2YgaHRtbDVfcXJjb2RlXG4gICAgICAgIH0sXG4gICAgICAgIGh0bWw1X3FyY29kZV9zdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy9zdG9wIHRoZSBzdHJlYW0gYW5kIGNhbmNlbCB0aW1lb3V0c1xuICAgICAgICAgICAgICAgICQodGhpcykuZGF0YSgnc3RyZWFtJykuZ2V0VmlkZW9UcmFja3MoKS5mb3JFYWNoKGZ1bmN0aW9uKHZpZGVvVHJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgdmlkZW9UcmFjay5zdG9wKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoJCh0aGlzKS5kYXRhKCd0aW1lb3V0JykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pKGpRdWVyeSk7XG5cbiIsImZ1bmN0aW9uIEVDQihjb3VudCxkYXRhQ29kZXdvcmRzKXt0aGlzLmNvdW50PWNvdW50LHRoaXMuZGF0YUNvZGV3b3Jkcz1kYXRhQ29kZXdvcmRzLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkNvdW50XCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb3VudH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkRhdGFDb2Rld29yZHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmRhdGFDb2Rld29yZHN9KX1mdW5jdGlvbiBFQ0Jsb2NrcyhlY0NvZGV3b3Jkc1BlckJsb2NrLGVjQmxvY2tzMSxlY0Jsb2NrczIpe3RoaXMuZWNDb2Rld29yZHNQZXJCbG9jaz1lY0NvZGV3b3Jkc1BlckJsb2NrLGVjQmxvY2tzMj90aGlzLmVjQmxvY2tzPW5ldyBBcnJheShlY0Jsb2NrczEsZWNCbG9ja3MyKTp0aGlzLmVjQmxvY2tzPW5ldyBBcnJheShlY0Jsb2NrczEpLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkVDQ29kZXdvcmRzUGVyQmxvY2tcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmVjQ29kZXdvcmRzUGVyQmxvY2t9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJUb3RhbEVDQ29kZXdvcmRzXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lY0NvZGV3b3Jkc1BlckJsb2NrKnRoaXMuTnVtQmxvY2tzfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiTnVtQmxvY2tzXCIsZnVuY3Rpb24oKXtmb3IodmFyIHRvdGFsPTAsaT0wO2k8dGhpcy5lY0Jsb2Nrcy5sZW5ndGg7aSsrKXRvdGFsKz10aGlzLmVjQmxvY2tzW2ldLmxlbmd0aDtyZXR1cm4gdG90YWx9KSx0aGlzLmdldEVDQmxvY2tzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZWNCbG9ja3N9fWZ1bmN0aW9uIFZlcnNpb24odmVyc2lvbk51bWJlcixhbGlnbm1lbnRQYXR0ZXJuQ2VudGVycyxlY0Jsb2NrczEsZWNCbG9ja3MyLGVjQmxvY2tzMyxlY0Jsb2NrczQpe3RoaXMudmVyc2lvbk51bWJlcj12ZXJzaW9uTnVtYmVyLHRoaXMuYWxpZ25tZW50UGF0dGVybkNlbnRlcnM9YWxpZ25tZW50UGF0dGVybkNlbnRlcnMsdGhpcy5lY0Jsb2Nrcz1uZXcgQXJyYXkoZWNCbG9ja3MxLGVjQmxvY2tzMixlY0Jsb2NrczMsZWNCbG9ja3M0KTtmb3IodmFyIHRvdGFsPTAsZWNDb2Rld29yZHM9ZWNCbG9ja3MxLkVDQ29kZXdvcmRzUGVyQmxvY2ssZWNiQXJyYXk9ZWNCbG9ja3MxLmdldEVDQmxvY2tzKCksaT0wO2k8ZWNiQXJyYXkubGVuZ3RoO2krKyl7dmFyIGVjQmxvY2s9ZWNiQXJyYXlbaV07dG90YWwrPWVjQmxvY2suQ291bnQqKGVjQmxvY2suRGF0YUNvZGV3b3JkcytlY0NvZGV3b3Jkcyl9dGhpcy50b3RhbENvZGV3b3Jkcz10b3RhbCx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJWZXJzaW9uTnVtYmVyXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52ZXJzaW9uTnVtYmVyfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQWxpZ25tZW50UGF0dGVybkNlbnRlcnNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmFsaWdubWVudFBhdHRlcm5DZW50ZXJzfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiVG90YWxDb2Rld29yZHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLnRvdGFsQ29kZXdvcmRzfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRGltZW5zaW9uRm9yVmVyc2lvblwiLGZ1bmN0aW9uKCl7cmV0dXJuIDE3KzQqdGhpcy52ZXJzaW9uTnVtYmVyfSksdGhpcy5idWlsZEZ1bmN0aW9uUGF0dGVybj1mdW5jdGlvbigpe3ZhciBkaW1lbnNpb249dGhpcy5EaW1lbnNpb25Gb3JWZXJzaW9uLGJpdE1hdHJpeD1uZXcgQml0TWF0cml4KGRpbWVuc2lvbik7Yml0TWF0cml4LnNldFJlZ2lvbigwLDAsOSw5KSxiaXRNYXRyaXguc2V0UmVnaW9uKGRpbWVuc2lvbi04LDAsOCw5KSxiaXRNYXRyaXguc2V0UmVnaW9uKDAsZGltZW5zaW9uLTgsOSw4KTtmb3IodmFyIG1heD10aGlzLmFsaWdubWVudFBhdHRlcm5DZW50ZXJzLmxlbmd0aCx4PTA7bWF4Png7eCsrKWZvcih2YXIgaT10aGlzLmFsaWdubWVudFBhdHRlcm5DZW50ZXJzW3hdLTIseT0wO21heD55O3krKykwPT14JiYoMD09eXx8eT09bWF4LTEpfHx4PT1tYXgtMSYmMD09eXx8Yml0TWF0cml4LnNldFJlZ2lvbih0aGlzLmFsaWdubWVudFBhdHRlcm5DZW50ZXJzW3ldLTIsaSw1LDUpO3JldHVybiBiaXRNYXRyaXguc2V0UmVnaW9uKDYsOSwxLGRpbWVuc2lvbi0xNyksYml0TWF0cml4LnNldFJlZ2lvbig5LDYsZGltZW5zaW9uLTE3LDEpLHRoaXMudmVyc2lvbk51bWJlcj42JiYoYml0TWF0cml4LnNldFJlZ2lvbihkaW1lbnNpb24tMTEsMCwzLDYpLGJpdE1hdHJpeC5zZXRSZWdpb24oMCxkaW1lbnNpb24tMTEsNiwzKSksYml0TWF0cml4fSx0aGlzLmdldEVDQmxvY2tzRm9yTGV2ZWw9ZnVuY3Rpb24oZWNMZXZlbCl7cmV0dXJuIHRoaXMuZWNCbG9ja3NbZWNMZXZlbC5vcmRpbmFsKCldfX1mdW5jdGlvbiBidWlsZFZlcnNpb25zKCl7cmV0dXJuIG5ldyBBcnJheShuZXcgVmVyc2lvbigxLG5ldyBBcnJheSxuZXcgRUNCbG9ja3MoNyxuZXcgRUNCKDEsMTkpKSxuZXcgRUNCbG9ja3MoMTAsbmV3IEVDQigxLDE2KSksbmV3IEVDQmxvY2tzKDEzLG5ldyBFQ0IoMSwxMykpLG5ldyBFQ0Jsb2NrcygxNyxuZXcgRUNCKDEsOSkpKSxuZXcgVmVyc2lvbigyLG5ldyBBcnJheSg2LDE4KSxuZXcgRUNCbG9ja3MoMTAsbmV3IEVDQigxLDM0KSksbmV3IEVDQmxvY2tzKDE2LG5ldyBFQ0IoMSwyOCkpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDEsMjIpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxLDE2KSkpLG5ldyBWZXJzaW9uKDMsbmV3IEFycmF5KDYsMjIpLG5ldyBFQ0Jsb2NrcygxNSxuZXcgRUNCKDEsNTUpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigxLDQ0KSksbmV3IEVDQmxvY2tzKDE4LG5ldyBFQ0IoMiwxNykpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDIsMTMpKSksbmV3IFZlcnNpb24oNCxuZXcgQXJyYXkoNiwyNiksbmV3IEVDQmxvY2tzKDIwLG5ldyBFQ0IoMSw4MCkpLG5ldyBFQ0Jsb2NrcygxOCxuZXcgRUNCKDIsMzIpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigyLDI0KSksbmV3IEVDQmxvY2tzKDE2LG5ldyBFQ0IoNCw5KSkpLG5ldyBWZXJzaW9uKDUsbmV3IEFycmF5KDYsMzApLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDEsMTA4KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMiw0MykpLG5ldyBFQ0Jsb2NrcygxOCxuZXcgRUNCKDIsMTUpLG5ldyBFQ0IoMiwxNikpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDIsMTEpLG5ldyBFQ0IoMiwxMikpKSxuZXcgVmVyc2lvbig2LG5ldyBBcnJheSg2LDM0KSxuZXcgRUNCbG9ja3MoMTgsbmV3IEVDQigyLDY4KSksbmV3IEVDQmxvY2tzKDE2LG5ldyBFQ0IoNCwyNykpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDQsMTkpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig0LDE1KSkpLG5ldyBWZXJzaW9uKDcsbmV3IEFycmF5KDYsMjIsMzgpLG5ldyBFQ0Jsb2NrcygyMCxuZXcgRUNCKDIsNzgpKSxuZXcgRUNCbG9ja3MoMTgsbmV3IEVDQig0LDMxKSksbmV3IEVDQmxvY2tzKDE4LG5ldyBFQ0IoMiwxNCksbmV3IEVDQig0LDE1KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoNCwxMyksbmV3IEVDQigxLDE0KSkpLG5ldyBWZXJzaW9uKDgsbmV3IEFycmF5KDYsMjQsNDIpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDIsOTcpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQigyLDM4KSxuZXcgRUNCKDIsMzkpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQig0LDE4KSxuZXcgRUNCKDIsMTkpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig0LDE0KSxuZXcgRUNCKDIsMTUpKSksbmV3IFZlcnNpb24oOSxuZXcgQXJyYXkoNiwyNiw0NiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMiwxMTYpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQigzLDM2KSxuZXcgRUNCKDIsMzcpKSxuZXcgRUNCbG9ja3MoMjAsbmV3IEVDQig0LDE2KSxuZXcgRUNCKDQsMTcpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQig0LDEyKSxuZXcgRUNCKDQsMTMpKSksbmV3IFZlcnNpb24oMTAsbmV3IEFycmF5KDYsMjgsNTApLG5ldyBFQ0Jsb2NrcygxOCxuZXcgRUNCKDIsNjgpLG5ldyBFQ0IoMiw2OSkpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDQsNDMpLG5ldyBFQ0IoMSw0NCkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDYsMTkpLG5ldyBFQ0IoMiwyMCkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDYsMTUpLG5ldyBFQ0IoMiwxNikpKSxuZXcgVmVyc2lvbigxMSxuZXcgQXJyYXkoNiwzMCw1NCksbmV3IEVDQmxvY2tzKDIwLG5ldyBFQ0IoNCw4MSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDEsNTApLG5ldyBFQ0IoNCw1MSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDQsMjIpLG5ldyBFQ0IoNCwyMykpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDMsMTIpLG5ldyBFQ0IoOCwxMykpKSxuZXcgVmVyc2lvbigxMixuZXcgQXJyYXkoNiwzMiw1OCksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMiw5MiksbmV3IEVDQigyLDkzKSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoNiwzNiksbmV3IEVDQigyLDM3KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoNCwyMCksbmV3IEVDQig2LDIxKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNywxNCksbmV3IEVDQig0LDE1KSkpLG5ldyBWZXJzaW9uKDEzLG5ldyBBcnJheSg2LDM0LDYyKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig0LDEwNykpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDgsMzcpLG5ldyBFQ0IoMSwzOCkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDgsMjApLG5ldyBFQ0IoNCwyMSkpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDEyLDExKSxuZXcgRUNCKDQsMTIpKSksbmV3IFZlcnNpb24oMTQsbmV3IEFycmF5KDYsMjYsNDYsNjYpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDMsMTE1KSxuZXcgRUNCKDEsMTE2KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoNCw0MCksbmV3IEVDQig1LDQxKSksbmV3IEVDQmxvY2tzKDIwLG5ldyBFQ0IoMTEsMTYpLG5ldyBFQ0IoNSwxNykpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDExLDEyKSxuZXcgRUNCKDUsMTMpKSksbmV3IFZlcnNpb24oMTUsbmV3IEFycmF5KDYsMjYsNDgsNzApLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDUsODcpLG5ldyBFQ0IoMSw4OCkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDUsNDEpLG5ldyBFQ0IoNSw0MikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDUsMjQpLG5ldyBFQ0IoNywyNSkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDExLDEyKSxuZXcgRUNCKDcsMTMpKSksbmV3IFZlcnNpb24oMTYsbmV3IEFycmF5KDYsMjYsNTAsNzQpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDUsOTgpLG5ldyBFQ0IoMSw5OSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDcsNDUpLG5ldyBFQ0IoMyw0NikpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDE1LDE5KSxuZXcgRUNCKDIsMjApKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigzLDE1KSxuZXcgRUNCKDEzLDE2KSkpLG5ldyBWZXJzaW9uKDE3LG5ldyBBcnJheSg2LDMwLDU0LDc4KSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxLDEwNyksbmV3IEVDQig1LDEwOCkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEwLDQ2KSxuZXcgRUNCKDEsNDcpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxLDIyKSxuZXcgRUNCKDE1LDIzKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMiwxNCksbmV3IEVDQigxNywxNSkpKSxuZXcgVmVyc2lvbigxOCxuZXcgQXJyYXkoNiwzMCw1Niw4MiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNSwxMjApLG5ldyBFQ0IoMSwxMjEpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig5LDQzKSxuZXcgRUNCKDQsNDQpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxNywyMiksbmV3IEVDQigxLDIzKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMiwxNCksbmV3IEVDQigxOSwxNSkpKSxuZXcgVmVyc2lvbigxOSxuZXcgQXJyYXkoNiwzMCw1OCw4NiksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMywxMTMpLG5ldyBFQ0IoNCwxMTQpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigzLDQ0KSxuZXcgRUNCKDExLDQ1KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoMTcsMjEpLG5ldyBFQ0IoNCwyMikpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDksMTMpLG5ldyBFQ0IoMTYsMTQpKSksbmV3IFZlcnNpb24oMjAsbmV3IEFycmF5KDYsMzQsNjIsOTApLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDMsMTA3KSxuZXcgRUNCKDUsMTA4KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoMyw0MSksbmV3IEVDQigxMyw0MikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE1LDI0KSxuZXcgRUNCKDUsMjUpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxNSwxNSksbmV3IEVDQigxMCwxNikpKSxuZXcgVmVyc2lvbigyMSxuZXcgQXJyYXkoNiwyOCw1MCw3Miw5NCksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNCwxMTYpLG5ldyBFQ0IoNCwxMTcpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigxNyw0MikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE3LDIyKSxuZXcgRUNCKDYsMjMpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxOSwxNiksbmV3IEVDQig2LDE3KSkpLG5ldyBWZXJzaW9uKDIyLG5ldyBBcnJheSg2LDI2LDUwLDc0LDk4KSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyLDExMSksbmV3IEVDQig3LDExMikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE3LDQ2KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNywyNCksbmV3IEVDQigxNiwyNSkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDM0LDEzKSkpLG5ldyBWZXJzaW9uKDIzLG5ldyBBcnJheSg2LDMwLDU0LDc0LDEwMiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNCwxMjEpLG5ldyBFQ0IoNSwxMjIpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig0LDQ3KSxuZXcgRUNCKDE0LDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTEsMjQpLG5ldyBFQ0IoMTQsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxNiwxNSksbmV3IEVDQigxNCwxNikpKSxuZXcgVmVyc2lvbigyNCxuZXcgQXJyYXkoNiwyOCw1NCw4MCwxMDYpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDYsMTE3KSxuZXcgRUNCKDQsMTE4KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNiw0NSksbmV3IEVDQigxNCw0NikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDExLDI0KSxuZXcgRUNCKDE2LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMzAsMTYpLG5ldyBFQ0IoMiwxNykpKSxuZXcgVmVyc2lvbigyNSxuZXcgQXJyYXkoNiwzMiw1OCw4NCwxMTApLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDgsMTA2KSxuZXcgRUNCKDQsMTA3KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoOCw0NyksbmV3IEVDQigxMyw0OCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDcsMjQpLG5ldyBFQ0IoMjIsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyMiwxNSksbmV3IEVDQigxMywxNikpKSxuZXcgVmVyc2lvbigyNixuZXcgQXJyYXkoNiwzMCw1OCw4NiwxMTQpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEwLDExNCksbmV3IEVDQigyLDExNSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE5LDQ2KSxuZXcgRUNCKDQsNDcpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyOCwyMiksbmV3IEVDQig2LDIzKSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMzMsMTYpLG5ldyBFQ0IoNCwxNykpKSxuZXcgVmVyc2lvbigyNyxuZXcgQXJyYXkoNiwzNCw2Miw5MCwxMTgpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDgsMTIyKSxuZXcgRUNCKDQsMTIzKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMjIsNDUpLG5ldyBFQ0IoMyw0NikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDgsMjMpLG5ldyBFQ0IoMjYsMjQpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMiwxNSksbmV3IEVDQigyOCwxNikpKSxuZXcgVmVyc2lvbigyOCxuZXcgQXJyYXkoNiwyNiw1MCw3NCw5OCwxMjIpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDMsMTE3KSxuZXcgRUNCKDEwLDExOCkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDMsNDUpLG5ldyBFQ0IoMjMsNDYpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0LDI0KSxuZXcgRUNCKDMxLDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTEsMTUpLG5ldyBFQ0IoMzEsMTYpKSksbmV3IFZlcnNpb24oMjksbmV3IEFycmF5KDYsMzAsNTQsNzgsMTAyLDEyNiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNywxMTYpLG5ldyBFQ0IoNywxMTcpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyMSw0NSksbmV3IEVDQig3LDQ2KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMSwyMyksbmV3IEVDQigzNywyNCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE5LDE1KSxuZXcgRUNCKDI2LDE2KSkpLG5ldyBWZXJzaW9uKDMwLG5ldyBBcnJheSg2LDI2LDUyLDc4LDEwNCwxMzApLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDUsMTE1KSxuZXcgRUNCKDEwLDExNikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE5LDQ3KSxuZXcgRUNCKDEwLDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTUsMjQpLG5ldyBFQ0IoMjUsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyMywxNSksbmV3IEVDQigyNSwxNikpKSxuZXcgVmVyc2lvbigzMSxuZXcgQXJyYXkoNiwzMCw1Niw4MiwxMDgsMTM0KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMywxMTUpLG5ldyBFQ0IoMywxMTYpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyLDQ2KSxuZXcgRUNCKDI5LDQ3KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNDIsMjQpLG5ldyBFQ0IoMSwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIzLDE1KSxuZXcgRUNCKDI4LDE2KSkpLG5ldyBWZXJzaW9uKDMyLG5ldyBBcnJheSg2LDM0LDYwLDg2LDExMiwxMzgpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE3LDExNSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEwLDQ2KSxuZXcgRUNCKDIzLDQ3KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTAsMjQpLG5ldyBFQ0IoMzUsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxOSwxNSksbmV3IEVDQigzNSwxNikpKSxuZXcgVmVyc2lvbigzMyxuZXcgQXJyYXkoNiwzMCw1OCw4NiwxMTQsMTQyKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxNywxMTUpLG5ldyBFQ0IoMSwxMTYpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxNCw0NiksbmV3IEVDQigyMSw0NykpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDI5LDI0KSxuZXcgRUNCKDE5LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTEsMTUpLG5ldyBFQ0IoNDYsMTYpKSksbmV3IFZlcnNpb24oMzQsbmV3IEFycmF5KDYsMzQsNjIsOTAsMTE4LDE0NiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTMsMTE1KSxuZXcgRUNCKDYsMTE2KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTQsNDYpLG5ldyBFQ0IoMjMsNDcpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0NCwyNCksbmV3IEVDQig3LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNTksMTYpLG5ldyBFQ0IoMSwxNykpKSxuZXcgVmVyc2lvbigzNSxuZXcgQXJyYXkoNiwzMCw1NCw3OCwxMDIsMTI2LDE1MCksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTIsMTIxKSxuZXcgRUNCKDcsMTIyKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTIsNDcpLG5ldyBFQ0IoMjYsNDgpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigzOSwyNCksbmV3IEVDQigxNCwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIyLDE1KSxuZXcgRUNCKDQxLDE2KSkpLG5ldyBWZXJzaW9uKDM2LG5ldyBBcnJheSg2LDI0LDUwLDc2LDEwMiwxMjgsMTU0KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig2LDEyMSksbmV3IEVDQigxNCwxMjIpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig2LDQ3KSxuZXcgRUNCKDM0LDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNDYsMjQpLG5ldyBFQ0IoMTAsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyLDE1KSxuZXcgRUNCKDY0LDE2KSkpLG5ldyBWZXJzaW9uKDM3LG5ldyBBcnJheSg2LDI4LDU0LDgwLDEwNiwxMzIsMTU4KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxNywxMjIpLG5ldyBFQ0IoNCwxMjMpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyOSw0NiksbmV3IEVDQigxNCw0NykpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQ5LDI0KSxuZXcgRUNCKDEwLDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMjQsMTUpLG5ldyBFQ0IoNDYsMTYpKSksbmV3IFZlcnNpb24oMzgsbmV3IEFycmF5KDYsMzIsNTgsODQsMTEwLDEzNiwxNjIpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQsMTIyKSxuZXcgRUNCKDE4LDEyMykpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEzLDQ2KSxuZXcgRUNCKDMyLDQ3KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNDgsMjQpLG5ldyBFQ0IoMTQsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0MiwxNSksbmV3IEVDQigzMiwxNikpKSxuZXcgVmVyc2lvbigzOSxuZXcgQXJyYXkoNiwyNiw1NCw4MiwxMTAsMTM4LDE2NiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMjAsMTE3KSxuZXcgRUNCKDQsMTE4KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNDAsNDcpLG5ldyBFQ0IoNyw0OCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQzLDI0KSxuZXcgRUNCKDIyLDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTAsMTUpLG5ldyBFQ0IoNjcsMTYpKSksbmV3IFZlcnNpb24oNDAsbmV3IEFycmF5KDYsMzAsNTgsODYsMTE0LDE0MiwxNzApLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE5LDExOCksbmV3IEVDQig2LDExOSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE4LDQ3KSxuZXcgRUNCKDMxLDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMzQsMjQpLG5ldyBFQ0IoMzQsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyMCwxNSksbmV3IEVDQig2MSwxNikpKSl9ZnVuY3Rpb24gUGVyc3BlY3RpdmVUcmFuc2Zvcm0oYTExLGEyMSxhMzEsYTEyLGEyMixhMzIsYTEzLGEyMyxhMzMpe3RoaXMuYTExPWExMSx0aGlzLmExMj1hMTIsdGhpcy5hMTM9YTEzLHRoaXMuYTIxPWEyMSx0aGlzLmEyMj1hMjIsdGhpcy5hMjM9YTIzLHRoaXMuYTMxPWEzMSx0aGlzLmEzMj1hMzIsdGhpcy5hMzM9YTMzLHRoaXMudHJhbnNmb3JtUG9pbnRzMT1mdW5jdGlvbihwb2ludHMpe2Zvcih2YXIgbWF4PXBvaW50cy5sZW5ndGgsYTExPXRoaXMuYTExLGExMj10aGlzLmExMixhMTM9dGhpcy5hMTMsYTIxPXRoaXMuYTIxLGEyMj10aGlzLmEyMixhMjM9dGhpcy5hMjMsYTMxPXRoaXMuYTMxLGEzMj10aGlzLmEzMixhMzM9dGhpcy5hMzMsaT0wO21heD5pO2krPTIpe3ZhciB4PXBvaW50c1tpXSx5PXBvaW50c1tpKzFdLGRlbm9taW5hdG9yPWExMyp4K2EyMyp5K2EzMztwb2ludHNbaV09KGExMSp4K2EyMSp5K2EzMSkvZGVub21pbmF0b3IscG9pbnRzW2krMV09KGExMip4K2EyMip5K2EzMikvZGVub21pbmF0b3J9fSx0aGlzLnRyYW5zZm9ybVBvaW50czI9ZnVuY3Rpb24oeFZhbHVlcyx5VmFsdWVzKXtmb3IodmFyIG49eFZhbHVlcy5sZW5ndGgsaT0wO24+aTtpKyspe3ZhciB4PXhWYWx1ZXNbaV0seT15VmFsdWVzW2ldLGRlbm9taW5hdG9yPXRoaXMuYTEzKngrdGhpcy5hMjMqeSt0aGlzLmEzMzt4VmFsdWVzW2ldPSh0aGlzLmExMSp4K3RoaXMuYTIxKnkrdGhpcy5hMzEpL2Rlbm9taW5hdG9yLHlWYWx1ZXNbaV09KHRoaXMuYTEyKngrdGhpcy5hMjIqeSt0aGlzLmEzMikvZGVub21pbmF0b3J9fSx0aGlzLmJ1aWxkQWRqb2ludD1mdW5jdGlvbigpe3JldHVybiBuZXcgUGVyc3BlY3RpdmVUcmFuc2Zvcm0odGhpcy5hMjIqdGhpcy5hMzMtdGhpcy5hMjMqdGhpcy5hMzIsdGhpcy5hMjMqdGhpcy5hMzEtdGhpcy5hMjEqdGhpcy5hMzMsdGhpcy5hMjEqdGhpcy5hMzItdGhpcy5hMjIqdGhpcy5hMzEsdGhpcy5hMTMqdGhpcy5hMzItdGhpcy5hMTIqdGhpcy5hMzMsdGhpcy5hMTEqdGhpcy5hMzMtdGhpcy5hMTMqdGhpcy5hMzEsdGhpcy5hMTIqdGhpcy5hMzEtdGhpcy5hMTEqdGhpcy5hMzIsdGhpcy5hMTIqdGhpcy5hMjMtdGhpcy5hMTMqdGhpcy5hMjIsdGhpcy5hMTMqdGhpcy5hMjEtdGhpcy5hMTEqdGhpcy5hMjMsdGhpcy5hMTEqdGhpcy5hMjItdGhpcy5hMTIqdGhpcy5hMjEpfSx0aGlzLnRpbWVzPWZ1bmN0aW9uKG90aGVyKXtyZXR1cm4gbmV3IFBlcnNwZWN0aXZlVHJhbnNmb3JtKHRoaXMuYTExKm90aGVyLmExMSt0aGlzLmEyMSpvdGhlci5hMTIrdGhpcy5hMzEqb3RoZXIuYTEzLHRoaXMuYTExKm90aGVyLmEyMSt0aGlzLmEyMSpvdGhlci5hMjIrdGhpcy5hMzEqb3RoZXIuYTIzLHRoaXMuYTExKm90aGVyLmEzMSt0aGlzLmEyMSpvdGhlci5hMzIrdGhpcy5hMzEqb3RoZXIuYTMzLHRoaXMuYTEyKm90aGVyLmExMSt0aGlzLmEyMipvdGhlci5hMTIrdGhpcy5hMzIqb3RoZXIuYTEzLHRoaXMuYTEyKm90aGVyLmEyMSt0aGlzLmEyMipvdGhlci5hMjIrdGhpcy5hMzIqb3RoZXIuYTIzLHRoaXMuYTEyKm90aGVyLmEzMSt0aGlzLmEyMipvdGhlci5hMzIrdGhpcy5hMzIqb3RoZXIuYTMzLHRoaXMuYTEzKm90aGVyLmExMSt0aGlzLmEyMypvdGhlci5hMTIrdGhpcy5hMzMqb3RoZXIuYTEzLHRoaXMuYTEzKm90aGVyLmEyMSt0aGlzLmEyMypvdGhlci5hMjIrdGhpcy5hMzMqb3RoZXIuYTIzLHRoaXMuYTEzKm90aGVyLmEzMSt0aGlzLmEyMypvdGhlci5hMzIrdGhpcy5hMzMqb3RoZXIuYTMzKX19ZnVuY3Rpb24gRGV0ZWN0b3JSZXN1bHQoYml0cyxwb2ludHMpe3RoaXMuYml0cz1iaXRzLHRoaXMucG9pbnRzPXBvaW50c31mdW5jdGlvbiBEZXRlY3RvcihpbWFnZSl7dGhpcy5pbWFnZT1pbWFnZSx0aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2s9bnVsbCx0aGlzLnNpemVPZkJsYWNrV2hpdGVCbGFja1J1bj1mdW5jdGlvbihmcm9tWCxmcm9tWSx0b1gsdG9ZKXt2YXIgc3RlZXA9TWF0aC5hYnModG9ZLWZyb21ZKT5NYXRoLmFicyh0b1gtZnJvbVgpO2lmKHN0ZWVwKXt2YXIgdGVtcD1mcm9tWDtmcm9tWD1mcm9tWSxmcm9tWT10ZW1wLHRlbXA9dG9YLHRvWD10b1ksdG9ZPXRlbXB9Zm9yKHZhciBkeD1NYXRoLmFicyh0b1gtZnJvbVgpLGR5PU1hdGguYWJzKHRvWS1mcm9tWSksZXJyb3I9LWR4Pj4xLHlzdGVwPXRvWT5mcm9tWT8xOi0xLHhzdGVwPXRvWD5mcm9tWD8xOi0xLHN0YXRlPTAseD1mcm9tWCx5PWZyb21ZO3ghPXRvWDt4Kz14c3RlcCl7dmFyIHJlYWxYPXN0ZWVwP3k6eCxyZWFsWT1zdGVlcD94Onk7aWYoMT09c3RhdGU/dGhpcy5pbWFnZVtyZWFsWCtyZWFsWSpxcmNvZGUud2lkdGhdJiZzdGF0ZSsrOnRoaXMuaW1hZ2VbcmVhbFgrcmVhbFkqcXJjb2RlLndpZHRoXXx8c3RhdGUrKywzPT1zdGF0ZSl7dmFyIGRpZmZYPXgtZnJvbVgsZGlmZlk9eS1mcm9tWTtyZXR1cm4gTWF0aC5zcXJ0KGRpZmZYKmRpZmZYK2RpZmZZKmRpZmZZKX1pZihlcnJvcis9ZHksZXJyb3I+MCl7aWYoeT09dG9ZKWJyZWFrO3krPXlzdGVwLGVycm9yLT1keH19dmFyIGRpZmZYMj10b1gtZnJvbVgsZGlmZlkyPXRvWS1mcm9tWTtyZXR1cm4gTWF0aC5zcXJ0KGRpZmZYMipkaWZmWDIrZGlmZlkyKmRpZmZZMil9LHRoaXMuc2l6ZU9mQmxhY2tXaGl0ZUJsYWNrUnVuQm90aFdheXM9ZnVuY3Rpb24oZnJvbVgsZnJvbVksdG9YLHRvWSl7dmFyIHJlc3VsdD10aGlzLnNpemVPZkJsYWNrV2hpdGVCbGFja1J1bihmcm9tWCxmcm9tWSx0b1gsdG9ZKSxzY2FsZT0xLG90aGVyVG9YPWZyb21YLSh0b1gtZnJvbVgpOzA+b3RoZXJUb1g/KHNjYWxlPWZyb21YLyhmcm9tWC1vdGhlclRvWCksb3RoZXJUb1g9MCk6b3RoZXJUb1g+PXFyY29kZS53aWR0aCYmKHNjYWxlPShxcmNvZGUud2lkdGgtMS1mcm9tWCkvKG90aGVyVG9YLWZyb21YKSxvdGhlclRvWD1xcmNvZGUud2lkdGgtMSk7dmFyIG90aGVyVG9ZPU1hdGguZmxvb3IoZnJvbVktKHRvWS1mcm9tWSkqc2NhbGUpO3JldHVybiBzY2FsZT0xLDA+b3RoZXJUb1k/KHNjYWxlPWZyb21ZLyhmcm9tWS1vdGhlclRvWSksb3RoZXJUb1k9MCk6b3RoZXJUb1k+PXFyY29kZS5oZWlnaHQmJihzY2FsZT0ocXJjb2RlLmhlaWdodC0xLWZyb21ZKS8ob3RoZXJUb1ktZnJvbVkpLG90aGVyVG9ZPXFyY29kZS5oZWlnaHQtMSksb3RoZXJUb1g9TWF0aC5mbG9vcihmcm9tWCsob3RoZXJUb1gtZnJvbVgpKnNjYWxlKSxyZXN1bHQrPXRoaXMuc2l6ZU9mQmxhY2tXaGl0ZUJsYWNrUnVuKGZyb21YLGZyb21ZLG90aGVyVG9YLG90aGVyVG9ZKSxyZXN1bHQtMX0sdGhpcy5jYWxjdWxhdGVNb2R1bGVTaXplT25lV2F5PWZ1bmN0aW9uKHBhdHRlcm4sb3RoZXJQYXR0ZXJuKXt2YXIgbW9kdWxlU2l6ZUVzdDE9dGhpcy5zaXplT2ZCbGFja1doaXRlQmxhY2tSdW5Cb3RoV2F5cyhNYXRoLmZsb29yKHBhdHRlcm4uWCksTWF0aC5mbG9vcihwYXR0ZXJuLlkpLE1hdGguZmxvb3Iob3RoZXJQYXR0ZXJuLlgpLE1hdGguZmxvb3Iob3RoZXJQYXR0ZXJuLlkpKSxtb2R1bGVTaXplRXN0Mj10aGlzLnNpemVPZkJsYWNrV2hpdGVCbGFja1J1bkJvdGhXYXlzKE1hdGguZmxvb3Iob3RoZXJQYXR0ZXJuLlgpLE1hdGguZmxvb3Iob3RoZXJQYXR0ZXJuLlkpLE1hdGguZmxvb3IocGF0dGVybi5YKSxNYXRoLmZsb29yKHBhdHRlcm4uWSkpO3JldHVybiBpc05hTihtb2R1bGVTaXplRXN0MSk/bW9kdWxlU2l6ZUVzdDIvNzppc05hTihtb2R1bGVTaXplRXN0Mik/bW9kdWxlU2l6ZUVzdDEvNzoobW9kdWxlU2l6ZUVzdDErbW9kdWxlU2l6ZUVzdDIpLzE0fSx0aGlzLmNhbGN1bGF0ZU1vZHVsZVNpemU9ZnVuY3Rpb24odG9wTGVmdCx0b3BSaWdodCxib3R0b21MZWZ0KXtyZXR1cm4odGhpcy5jYWxjdWxhdGVNb2R1bGVTaXplT25lV2F5KHRvcExlZnQsdG9wUmlnaHQpK3RoaXMuY2FsY3VsYXRlTW9kdWxlU2l6ZU9uZVdheSh0b3BMZWZ0LGJvdHRvbUxlZnQpKS8yfSx0aGlzLmRpc3RhbmNlPWZ1bmN0aW9uKHBhdHRlcm4xLHBhdHRlcm4yKXtyZXR1cm4geERpZmY9cGF0dGVybjEuWC1wYXR0ZXJuMi5YLHlEaWZmPXBhdHRlcm4xLlktcGF0dGVybjIuWSxNYXRoLnNxcnQoeERpZmYqeERpZmYreURpZmYqeURpZmYpfSx0aGlzLmNvbXB1dGVEaW1lbnNpb249ZnVuY3Rpb24odG9wTGVmdCx0b3BSaWdodCxib3R0b21MZWZ0LG1vZHVsZVNpemUpe3ZhciB0bHRyQ2VudGVyc0RpbWVuc2lvbj1NYXRoLnJvdW5kKHRoaXMuZGlzdGFuY2UodG9wTGVmdCx0b3BSaWdodCkvbW9kdWxlU2l6ZSksdGxibENlbnRlcnNEaW1lbnNpb249TWF0aC5yb3VuZCh0aGlzLmRpc3RhbmNlKHRvcExlZnQsYm90dG9tTGVmdCkvbW9kdWxlU2l6ZSksZGltZW5zaW9uPSh0bHRyQ2VudGVyc0RpbWVuc2lvbit0bGJsQ2VudGVyc0RpbWVuc2lvbj4+MSkrNztzd2l0Y2goMyZkaW1lbnNpb24pe2Nhc2UgMDpkaW1lbnNpb24rKzticmVhaztjYXNlIDI6ZGltZW5zaW9uLS07YnJlYWs7Y2FzZSAzOnRocm93XCJFcnJvclwifXJldHVybiBkaW1lbnNpb259LHRoaXMuZmluZEFsaWdubWVudEluUmVnaW9uPWZ1bmN0aW9uKG92ZXJhbGxFc3RNb2R1bGVTaXplLGVzdEFsaWdubWVudFgsZXN0QWxpZ25tZW50WSxhbGxvd2FuY2VGYWN0b3Ipe3ZhciBhbGxvd2FuY2U9TWF0aC5mbG9vcihhbGxvd2FuY2VGYWN0b3Iqb3ZlcmFsbEVzdE1vZHVsZVNpemUpLGFsaWdubWVudEFyZWFMZWZ0WD1NYXRoLm1heCgwLGVzdEFsaWdubWVudFgtYWxsb3dhbmNlKSxhbGlnbm1lbnRBcmVhUmlnaHRYPU1hdGgubWluKHFyY29kZS53aWR0aC0xLGVzdEFsaWdubWVudFgrYWxsb3dhbmNlKTtpZigzKm92ZXJhbGxFc3RNb2R1bGVTaXplPmFsaWdubWVudEFyZWFSaWdodFgtYWxpZ25tZW50QXJlYUxlZnRYKXRocm93XCJFcnJvclwiO3ZhciBhbGlnbm1lbnRBcmVhVG9wWT1NYXRoLm1heCgwLGVzdEFsaWdubWVudFktYWxsb3dhbmNlKSxhbGlnbm1lbnRBcmVhQm90dG9tWT1NYXRoLm1pbihxcmNvZGUuaGVpZ2h0LTEsZXN0QWxpZ25tZW50WSthbGxvd2FuY2UpLGFsaWdubWVudEZpbmRlcj1uZXcgQWxpZ25tZW50UGF0dGVybkZpbmRlcih0aGlzLmltYWdlLGFsaWdubWVudEFyZWFMZWZ0WCxhbGlnbm1lbnRBcmVhVG9wWSxhbGlnbm1lbnRBcmVhUmlnaHRYLWFsaWdubWVudEFyZWFMZWZ0WCxhbGlnbm1lbnRBcmVhQm90dG9tWS1hbGlnbm1lbnRBcmVhVG9wWSxvdmVyYWxsRXN0TW9kdWxlU2l6ZSx0aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2spO3JldHVybiBhbGlnbm1lbnRGaW5kZXIuZmluZCgpfSx0aGlzLmNyZWF0ZVRyYW5zZm9ybT1mdW5jdGlvbih0b3BMZWZ0LHRvcFJpZ2h0LGJvdHRvbUxlZnQsYWxpZ25tZW50UGF0dGVybixkaW1lbnNpb24pe3ZhciBib3R0b21SaWdodFgsYm90dG9tUmlnaHRZLHNvdXJjZUJvdHRvbVJpZ2h0WCxzb3VyY2VCb3R0b21SaWdodFksZGltTWludXNUaHJlZT1kaW1lbnNpb24tMy41O251bGwhPWFsaWdubWVudFBhdHRlcm4/KGJvdHRvbVJpZ2h0WD1hbGlnbm1lbnRQYXR0ZXJuLlgsYm90dG9tUmlnaHRZPWFsaWdubWVudFBhdHRlcm4uWSxzb3VyY2VCb3R0b21SaWdodFg9c291cmNlQm90dG9tUmlnaHRZPWRpbU1pbnVzVGhyZWUtMyk6KGJvdHRvbVJpZ2h0WD10b3BSaWdodC5YLXRvcExlZnQuWCtib3R0b21MZWZ0LlgsYm90dG9tUmlnaHRZPXRvcFJpZ2h0LlktdG9wTGVmdC5ZK2JvdHRvbUxlZnQuWSxzb3VyY2VCb3R0b21SaWdodFg9c291cmNlQm90dG9tUmlnaHRZPWRpbU1pbnVzVGhyZWUpO3ZhciB0cmFuc2Zvcm09UGVyc3BlY3RpdmVUcmFuc2Zvcm0ucXVhZHJpbGF0ZXJhbFRvUXVhZHJpbGF0ZXJhbCgzLjUsMy41LGRpbU1pbnVzVGhyZWUsMy41LHNvdXJjZUJvdHRvbVJpZ2h0WCxzb3VyY2VCb3R0b21SaWdodFksMy41LGRpbU1pbnVzVGhyZWUsdG9wTGVmdC5YLHRvcExlZnQuWSx0b3BSaWdodC5YLHRvcFJpZ2h0LlksYm90dG9tUmlnaHRYLGJvdHRvbVJpZ2h0WSxib3R0b21MZWZ0LlgsYm90dG9tTGVmdC5ZKTtyZXR1cm4gdHJhbnNmb3JtfSx0aGlzLnNhbXBsZUdyaWQ9ZnVuY3Rpb24oaW1hZ2UsdHJhbnNmb3JtLGRpbWVuc2lvbil7dmFyIHNhbXBsZXI9R3JpZFNhbXBsZXI7cmV0dXJuIHNhbXBsZXIuc2FtcGxlR3JpZDMoaW1hZ2UsZGltZW5zaW9uLHRyYW5zZm9ybSl9LHRoaXMucHJvY2Vzc0ZpbmRlclBhdHRlcm5JbmZvPWZ1bmN0aW9uKGluZm8pe3ZhciB0b3BMZWZ0PWluZm8uVG9wTGVmdCx0b3BSaWdodD1pbmZvLlRvcFJpZ2h0LGJvdHRvbUxlZnQ9aW5mby5Cb3R0b21MZWZ0LG1vZHVsZVNpemU9dGhpcy5jYWxjdWxhdGVNb2R1bGVTaXplKHRvcExlZnQsdG9wUmlnaHQsYm90dG9tTGVmdCk7aWYoMT5tb2R1bGVTaXplKXRocm93XCJFcnJvclwiO3ZhciBkaW1lbnNpb249dGhpcy5jb21wdXRlRGltZW5zaW9uKHRvcExlZnQsdG9wUmlnaHQsYm90dG9tTGVmdCxtb2R1bGVTaXplKSxwcm92aXNpb25hbFZlcnNpb249VmVyc2lvbi5nZXRQcm92aXNpb25hbFZlcnNpb25Gb3JEaW1lbnNpb24oZGltZW5zaW9uKSxtb2R1bGVzQmV0d2VlbkZQQ2VudGVycz1wcm92aXNpb25hbFZlcnNpb24uRGltZW5zaW9uRm9yVmVyc2lvbi03LGFsaWdubWVudFBhdHRlcm49bnVsbDtpZihwcm92aXNpb25hbFZlcnNpb24uQWxpZ25tZW50UGF0dGVybkNlbnRlcnMubGVuZ3RoPjApZm9yKHZhciBib3R0b21SaWdodFg9dG9wUmlnaHQuWC10b3BMZWZ0LlgrYm90dG9tTGVmdC5YLGJvdHRvbVJpZ2h0WT10b3BSaWdodC5ZLXRvcExlZnQuWStib3R0b21MZWZ0LlksY29ycmVjdGlvblRvVG9wTGVmdD0xLTMvbW9kdWxlc0JldHdlZW5GUENlbnRlcnMsZXN0QWxpZ25tZW50WD1NYXRoLmZsb29yKHRvcExlZnQuWCtjb3JyZWN0aW9uVG9Ub3BMZWZ0Kihib3R0b21SaWdodFgtdG9wTGVmdC5YKSksZXN0QWxpZ25tZW50WT1NYXRoLmZsb29yKHRvcExlZnQuWStjb3JyZWN0aW9uVG9Ub3BMZWZ0Kihib3R0b21SaWdodFktdG9wTGVmdC5ZKSksaT00OzE2Pj1pO2k8PD0xKXthbGlnbm1lbnRQYXR0ZXJuPXRoaXMuZmluZEFsaWdubWVudEluUmVnaW9uKG1vZHVsZVNpemUsZXN0QWxpZ25tZW50WCxlc3RBbGlnbm1lbnRZLGkpO2JyZWFrfXZhciBwb2ludHMsdHJhbnNmb3JtPXRoaXMuY3JlYXRlVHJhbnNmb3JtKHRvcExlZnQsdG9wUmlnaHQsYm90dG9tTGVmdCxhbGlnbm1lbnRQYXR0ZXJuLGRpbWVuc2lvbiksYml0cz10aGlzLnNhbXBsZUdyaWQodGhpcy5pbWFnZSx0cmFuc2Zvcm0sZGltZW5zaW9uKTtyZXR1cm4gcG9pbnRzPW51bGw9PWFsaWdubWVudFBhdHRlcm4/bmV3IEFycmF5KGJvdHRvbUxlZnQsdG9wTGVmdCx0b3BSaWdodCk6bmV3IEFycmF5KGJvdHRvbUxlZnQsdG9wTGVmdCx0b3BSaWdodCxhbGlnbm1lbnRQYXR0ZXJuKSxuZXcgRGV0ZWN0b3JSZXN1bHQoYml0cyxwb2ludHMpfSx0aGlzLmRldGVjdD1mdW5jdGlvbigpe3ZhciBpbmZvPShuZXcgRmluZGVyUGF0dGVybkZpbmRlcikuZmluZEZpbmRlclBhdHRlcm4odGhpcy5pbWFnZSk7cmV0dXJuIHRoaXMucHJvY2Vzc0ZpbmRlclBhdHRlcm5JbmZvKGluZm8pfX1mdW5jdGlvbiBGb3JtYXRJbmZvcm1hdGlvbihmb3JtYXRJbmZvKXt0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsPUVycm9yQ29ycmVjdGlvbkxldmVsLmZvckJpdHMoZm9ybWF0SW5mbz4+MyYzKSx0aGlzLmRhdGFNYXNrPTcmZm9ybWF0SW5mbyx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJFcnJvckNvcnJlY3Rpb25MZXZlbFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWx9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJEYXRhTWFza1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZGF0YU1hc2t9KSx0aGlzLkdldEhhc2hDb2RlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwub3JkaW5hbCgpPDwzfGRhdGFNYXNrfSx0aGlzLkVxdWFscz1mdW5jdGlvbihvKXt2YXIgb3RoZXI9bztyZXR1cm4gdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbD09b3RoZXIuZXJyb3JDb3JyZWN0aW9uTGV2ZWwmJnRoaXMuZGF0YU1hc2s9PW90aGVyLmRhdGFNYXNrfX1mdW5jdGlvbiBFcnJvckNvcnJlY3Rpb25MZXZlbChvcmRpbmFsLGJpdHMsbmFtZSl7dGhpcy5vcmRpbmFsX1JlbmFtZWRfRmllbGQ9b3JkaW5hbCx0aGlzLmJpdHM9Yml0cyx0aGlzLm5hbWU9bmFtZSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJCaXRzXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5iaXRzfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiTmFtZVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubmFtZX0pLHRoaXMub3JkaW5hbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLm9yZGluYWxfUmVuYW1lZF9GaWVsZH19ZnVuY3Rpb24gQml0TWF0cml4KHdpZHRoLGhlaWdodCl7aWYoaGVpZ2h0fHwoaGVpZ2h0PXdpZHRoKSwxPndpZHRofHwxPmhlaWdodCl0aHJvd1wiQm90aCBkaW1lbnNpb25zIG11c3QgYmUgZ3JlYXRlciB0aGFuIDBcIjt0aGlzLndpZHRoPXdpZHRoLHRoaXMuaGVpZ2h0PWhlaWdodDt2YXIgcm93U2l6ZT13aWR0aD4+NTswIT0oMzEmd2lkdGgpJiZyb3dTaXplKyssdGhpcy5yb3dTaXplPXJvd1NpemUsdGhpcy5iaXRzPW5ldyBBcnJheShyb3dTaXplKmhlaWdodCk7Zm9yKHZhciBpPTA7aTx0aGlzLmJpdHMubGVuZ3RoO2krKyl0aGlzLmJpdHNbaV09MDt0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJXaWR0aFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMud2lkdGh9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJIZWlnaHRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmhlaWdodH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkRpbWVuc2lvblwiLGZ1bmN0aW9uKCl7aWYodGhpcy53aWR0aCE9dGhpcy5oZWlnaHQpdGhyb3dcIkNhbid0IGNhbGwgZ2V0RGltZW5zaW9uKCkgb24gYSBub24tc3F1YXJlIG1hdHJpeFwiO3JldHVybiB0aGlzLndpZHRofSksdGhpcy5nZXRfUmVuYW1lZD1mdW5jdGlvbih4LHkpe3ZhciBvZmZzZXQ9eSp0aGlzLnJvd1NpemUrKHg+PjUpO3JldHVybiAwIT0oMSZVUlNoaWZ0KHRoaXMuYml0c1tvZmZzZXRdLDMxJngpKX0sdGhpcy5zZXRfUmVuYW1lZD1mdW5jdGlvbih4LHkpe3ZhciBvZmZzZXQ9eSp0aGlzLnJvd1NpemUrKHg+PjUpO3RoaXMuYml0c1tvZmZzZXRdfD0xPDwoMzEmeCl9LHRoaXMuZmxpcD1mdW5jdGlvbih4LHkpe3ZhciBvZmZzZXQ9eSp0aGlzLnJvd1NpemUrKHg+PjUpO3RoaXMuYml0c1tvZmZzZXRdXj0xPDwoMzEmeCl9LHRoaXMuY2xlYXI9ZnVuY3Rpb24oKXtmb3IodmFyIG1heD10aGlzLmJpdHMubGVuZ3RoLGk9MDttYXg+aTtpKyspdGhpcy5iaXRzW2ldPTB9LHRoaXMuc2V0UmVnaW9uPWZ1bmN0aW9uKGxlZnQsdG9wLHdpZHRoLGhlaWdodCl7aWYoMD50b3B8fDA+bGVmdCl0aHJvd1wiTGVmdCBhbmQgdG9wIG11c3QgYmUgbm9ubmVnYXRpdmVcIjtpZigxPmhlaWdodHx8MT53aWR0aCl0aHJvd1wiSGVpZ2h0IGFuZCB3aWR0aCBtdXN0IGJlIGF0IGxlYXN0IDFcIjt2YXIgcmlnaHQ9bGVmdCt3aWR0aCxib3R0b209dG9wK2hlaWdodDtpZihib3R0b20+dGhpcy5oZWlnaHR8fHJpZ2h0PnRoaXMud2lkdGgpdGhyb3dcIlRoZSByZWdpb24gbXVzdCBmaXQgaW5zaWRlIHRoZSBtYXRyaXhcIjtmb3IodmFyIHk9dG9wO2JvdHRvbT55O3krKylmb3IodmFyIG9mZnNldD15KnRoaXMucm93U2l6ZSx4PWxlZnQ7cmlnaHQ+eDt4KyspdGhpcy5iaXRzW29mZnNldCsoeD4+NSldfD0xPDwoMzEmeCl9fWZ1bmN0aW9uIERhdGFCbG9jayhudW1EYXRhQ29kZXdvcmRzLGNvZGV3b3Jkcyl7dGhpcy5udW1EYXRhQ29kZXdvcmRzPW51bURhdGFDb2Rld29yZHMsdGhpcy5jb2Rld29yZHM9Y29kZXdvcmRzLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIk51bURhdGFDb2Rld29yZHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLm51bURhdGFDb2Rld29yZHN9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJDb2Rld29yZHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvZGV3b3Jkc30pfWZ1bmN0aW9uIEJpdE1hdHJpeFBhcnNlcihiaXRNYXRyaXgpe3ZhciBkaW1lbnNpb249Yml0TWF0cml4LkRpbWVuc2lvbjtpZigyMT5kaW1lbnNpb258fDEhPSgzJmRpbWVuc2lvbikpdGhyb3dcIkVycm9yIEJpdE1hdHJpeFBhcnNlclwiO3RoaXMuYml0TWF0cml4PWJpdE1hdHJpeCx0aGlzLnBhcnNlZFZlcnNpb249bnVsbCx0aGlzLnBhcnNlZEZvcm1hdEluZm89bnVsbCx0aGlzLmNvcHlCaXQ9ZnVuY3Rpb24oaSxqLHZlcnNpb25CaXRzKXtyZXR1cm4gdGhpcy5iaXRNYXRyaXguZ2V0X1JlbmFtZWQoaSxqKT92ZXJzaW9uQml0czw8MXwxOnZlcnNpb25CaXRzPDwxfSx0aGlzLnJlYWRGb3JtYXRJbmZvcm1hdGlvbj1mdW5jdGlvbigpe2lmKG51bGwhPXRoaXMucGFyc2VkRm9ybWF0SW5mbylyZXR1cm4gdGhpcy5wYXJzZWRGb3JtYXRJbmZvO2Zvcih2YXIgZm9ybWF0SW5mb0JpdHM9MCxpPTA7Nj5pO2krKylmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoaSw4LGZvcm1hdEluZm9CaXRzKTtmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoNyw4LGZvcm1hdEluZm9CaXRzKSxmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoOCw4LGZvcm1hdEluZm9CaXRzKSxmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoOCw3LGZvcm1hdEluZm9CaXRzKTtmb3IodmFyIGo9NTtqPj0wO2otLSlmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoOCxqLGZvcm1hdEluZm9CaXRzKTtpZih0aGlzLnBhcnNlZEZvcm1hdEluZm89Rm9ybWF0SW5mb3JtYXRpb24uZGVjb2RlRm9ybWF0SW5mb3JtYXRpb24oZm9ybWF0SW5mb0JpdHMpLG51bGwhPXRoaXMucGFyc2VkRm9ybWF0SW5mbylyZXR1cm4gdGhpcy5wYXJzZWRGb3JtYXRJbmZvO3ZhciBkaW1lbnNpb249dGhpcy5iaXRNYXRyaXguRGltZW5zaW9uO2Zvcm1hdEluZm9CaXRzPTA7Zm9yKHZhciBpTWluPWRpbWVuc2lvbi04LGk9ZGltZW5zaW9uLTE7aT49aU1pbjtpLS0pZm9ybWF0SW5mb0JpdHM9dGhpcy5jb3B5Qml0KGksOCxmb3JtYXRJbmZvQml0cyk7Zm9yKHZhciBqPWRpbWVuc2lvbi03O2RpbWVuc2lvbj5qO2orKylmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoOCxqLGZvcm1hdEluZm9CaXRzKTtpZih0aGlzLnBhcnNlZEZvcm1hdEluZm89Rm9ybWF0SW5mb3JtYXRpb24uZGVjb2RlRm9ybWF0SW5mb3JtYXRpb24oZm9ybWF0SW5mb0JpdHMpLG51bGwhPXRoaXMucGFyc2VkRm9ybWF0SW5mbylyZXR1cm4gdGhpcy5wYXJzZWRGb3JtYXRJbmZvO3Rocm93XCJFcnJvciByZWFkRm9ybWF0SW5mb3JtYXRpb25cIn0sdGhpcy5yZWFkVmVyc2lvbj1mdW5jdGlvbigpe2lmKG51bGwhPXRoaXMucGFyc2VkVmVyc2lvbilyZXR1cm4gdGhpcy5wYXJzZWRWZXJzaW9uO3ZhciBkaW1lbnNpb249dGhpcy5iaXRNYXRyaXguRGltZW5zaW9uLHByb3Zpc2lvbmFsVmVyc2lvbj1kaW1lbnNpb24tMTc+PjI7aWYoNj49cHJvdmlzaW9uYWxWZXJzaW9uKXJldHVybiBWZXJzaW9uLmdldFZlcnNpb25Gb3JOdW1iZXIocHJvdmlzaW9uYWxWZXJzaW9uKTtmb3IodmFyIHZlcnNpb25CaXRzPTAsaWpNaW49ZGltZW5zaW9uLTExLGo9NTtqPj0wO2otLSlmb3IodmFyIGk9ZGltZW5zaW9uLTk7aT49aWpNaW47aS0tKXZlcnNpb25CaXRzPXRoaXMuY29weUJpdChpLGosdmVyc2lvbkJpdHMpO2lmKHRoaXMucGFyc2VkVmVyc2lvbj1WZXJzaW9uLmRlY29kZVZlcnNpb25JbmZvcm1hdGlvbih2ZXJzaW9uQml0cyksbnVsbCE9dGhpcy5wYXJzZWRWZXJzaW9uJiZ0aGlzLnBhcnNlZFZlcnNpb24uRGltZW5zaW9uRm9yVmVyc2lvbj09ZGltZW5zaW9uKXJldHVybiB0aGlzLnBhcnNlZFZlcnNpb247dmVyc2lvbkJpdHM9MDtmb3IodmFyIGk9NTtpPj0wO2ktLSlmb3IodmFyIGo9ZGltZW5zaW9uLTk7aj49aWpNaW47ai0tKXZlcnNpb25CaXRzPXRoaXMuY29weUJpdChpLGosdmVyc2lvbkJpdHMpO2lmKHRoaXMucGFyc2VkVmVyc2lvbj1WZXJzaW9uLmRlY29kZVZlcnNpb25JbmZvcm1hdGlvbih2ZXJzaW9uQml0cyksbnVsbCE9dGhpcy5wYXJzZWRWZXJzaW9uJiZ0aGlzLnBhcnNlZFZlcnNpb24uRGltZW5zaW9uRm9yVmVyc2lvbj09ZGltZW5zaW9uKXJldHVybiB0aGlzLnBhcnNlZFZlcnNpb247dGhyb3dcIkVycm9yIHJlYWRWZXJzaW9uXCJ9LHRoaXMucmVhZENvZGV3b3Jkcz1mdW5jdGlvbigpe3ZhciBmb3JtYXRJbmZvPXRoaXMucmVhZEZvcm1hdEluZm9ybWF0aW9uKCksdmVyc2lvbj10aGlzLnJlYWRWZXJzaW9uKCksZGF0YU1hc2s9RGF0YU1hc2suZm9yUmVmZXJlbmNlKGZvcm1hdEluZm8uRGF0YU1hc2spLGRpbWVuc2lvbj10aGlzLmJpdE1hdHJpeC5EaW1lbnNpb247ZGF0YU1hc2sudW5tYXNrQml0TWF0cml4KHRoaXMuYml0TWF0cml4LGRpbWVuc2lvbik7Zm9yKHZhciBmdW5jdGlvblBhdHRlcm49dmVyc2lvbi5idWlsZEZ1bmN0aW9uUGF0dGVybigpLHJlYWRpbmdVcD0hMCxyZXN1bHQ9bmV3IEFycmF5KHZlcnNpb24uVG90YWxDb2Rld29yZHMpLHJlc3VsdE9mZnNldD0wLGN1cnJlbnRCeXRlPTAsYml0c1JlYWQ9MCxqPWRpbWVuc2lvbi0xO2o+MDtqLT0yKXs2PT1qJiZqLS07Zm9yKHZhciBjb3VudD0wO2RpbWVuc2lvbj5jb3VudDtjb3VudCsrKWZvcih2YXIgaT1yZWFkaW5nVXA/ZGltZW5zaW9uLTEtY291bnQ6Y291bnQsY29sPTA7Mj5jb2w7Y29sKyspZnVuY3Rpb25QYXR0ZXJuLmdldF9SZW5hbWVkKGotY29sLGkpfHwoYml0c1JlYWQrKyxjdXJyZW50Qnl0ZTw8PTEsdGhpcy5iaXRNYXRyaXguZ2V0X1JlbmFtZWQoai1jb2wsaSkmJihjdXJyZW50Qnl0ZXw9MSksOD09Yml0c1JlYWQmJihyZXN1bHRbcmVzdWx0T2Zmc2V0KytdPWN1cnJlbnRCeXRlLGJpdHNSZWFkPTAsY3VycmVudEJ5dGU9MCkpO3JlYWRpbmdVcF49ITB9aWYocmVzdWx0T2Zmc2V0IT12ZXJzaW9uLlRvdGFsQ29kZXdvcmRzKXRocm93XCJFcnJvciByZWFkQ29kZXdvcmRzXCI7cmV0dXJuIHJlc3VsdH19ZnVuY3Rpb24gRGF0YU1hc2swMDAoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuIDA9PShpK2omMSl9fWZ1bmN0aW9uIERhdGFNYXNrMDAxKCl7dGhpcy51bm1hc2tCaXRNYXRyaXg9ZnVuY3Rpb24oYml0cyxkaW1lbnNpb24pe2Zvcih2YXIgaT0wO2RpbWVuc2lvbj5pO2krKylmb3IodmFyIGo9MDtkaW1lbnNpb24+ajtqKyspdGhpcy5pc01hc2tlZChpLGopJiZiaXRzLmZsaXAoaixpKX0sdGhpcy5pc01hc2tlZD1mdW5jdGlvbihpLGope3JldHVybiAwPT0oMSZpKX19ZnVuY3Rpb24gRGF0YU1hc2swMTAoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuIGolMz09MH19ZnVuY3Rpb24gRGF0YU1hc2swMTEoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuKGkraiklMz09MH19ZnVuY3Rpb24gRGF0YU1hc2sxMDAoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuIDA9PShVUlNoaWZ0KGksMSkrai8zJjEpfX1mdW5jdGlvbiBEYXRhTWFzazEwMSgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXt2YXIgdGVtcD1pKmo7cmV0dXJuKDEmdGVtcCkrdGVtcCUzPT0wfX1mdW5jdGlvbiBEYXRhTWFzazExMCgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXt2YXIgdGVtcD1pKmo7cmV0dXJuIDA9PSgoMSZ0ZW1wKSt0ZW1wJTMmMSl9fWZ1bmN0aW9uIERhdGFNYXNrMTExKCl7dGhpcy51bm1hc2tCaXRNYXRyaXg9ZnVuY3Rpb24oYml0cyxkaW1lbnNpb24pe2Zvcih2YXIgaT0wO2RpbWVuc2lvbj5pO2krKylmb3IodmFyIGo9MDtkaW1lbnNpb24+ajtqKyspdGhpcy5pc01hc2tlZChpLGopJiZiaXRzLmZsaXAoaixpKX0sdGhpcy5pc01hc2tlZD1mdW5jdGlvbihpLGope3JldHVybiAwPT0oKGkraiYxKStpKmolMyYxKX19ZnVuY3Rpb24gUmVlZFNvbG9tb25EZWNvZGVyKGZpZWxkKXt0aGlzLmZpZWxkPWZpZWxkLHRoaXMuZGVjb2RlPWZ1bmN0aW9uKHJlY2VpdmVkLHR3b1Mpe2Zvcih2YXIgcG9seT1uZXcgR0YyNTZQb2x5KHRoaXMuZmllbGQscmVjZWl2ZWQpLHN5bmRyb21lQ29lZmZpY2llbnRzPW5ldyBBcnJheSh0d29TKSxpPTA7aTxzeW5kcm9tZUNvZWZmaWNpZW50cy5sZW5ndGg7aSsrKXN5bmRyb21lQ29lZmZpY2llbnRzW2ldPTA7Zm9yKHZhciBkYXRhTWF0cml4PSExLG5vRXJyb3I9ITAsaT0wO3R3b1M+aTtpKyspe3ZhciBldmFsPXBvbHkuZXZhbHVhdGVBdCh0aGlzLmZpZWxkLmV4cChkYXRhTWF0cml4P2krMTppKSk7c3luZHJvbWVDb2VmZmljaWVudHNbc3luZHJvbWVDb2VmZmljaWVudHMubGVuZ3RoLTEtaV09ZXZhbCwwIT1ldmFsJiYobm9FcnJvcj0hMSl9aWYoIW5vRXJyb3IpZm9yKHZhciBzeW5kcm9tZT1uZXcgR0YyNTZQb2x5KHRoaXMuZmllbGQsc3luZHJvbWVDb2VmZmljaWVudHMpLHNpZ21hT21lZ2E9dGhpcy5ydW5FdWNsaWRlYW5BbGdvcml0aG0odGhpcy5maWVsZC5idWlsZE1vbm9taWFsKHR3b1MsMSksc3luZHJvbWUsdHdvUyksc2lnbWE9c2lnbWFPbWVnYVswXSxvbWVnYT1zaWdtYU9tZWdhWzFdLGVycm9yTG9jYXRpb25zPXRoaXMuZmluZEVycm9yTG9jYXRpb25zKHNpZ21hKSxlcnJvck1hZ25pdHVkZXM9dGhpcy5maW5kRXJyb3JNYWduaXR1ZGVzKG9tZWdhLGVycm9yTG9jYXRpb25zLGRhdGFNYXRyaXgpLGk9MDtpPGVycm9yTG9jYXRpb25zLmxlbmd0aDtpKyspe3ZhciBwb3NpdGlvbj1yZWNlaXZlZC5sZW5ndGgtMS10aGlzLmZpZWxkLmxvZyhlcnJvckxvY2F0aW9uc1tpXSk7aWYoMD5wb3NpdGlvbil0aHJvd1wiUmVlZFNvbG9tb25FeGNlcHRpb24gQmFkIGVycm9yIGxvY2F0aW9uXCI7cmVjZWl2ZWRbcG9zaXRpb25dPUdGMjU2LmFkZE9yU3VidHJhY3QocmVjZWl2ZWRbcG9zaXRpb25dLGVycm9yTWFnbml0dWRlc1tpXSl9fSx0aGlzLnJ1bkV1Y2xpZGVhbkFsZ29yaXRobT1mdW5jdGlvbihhLGIsUil7aWYoYS5EZWdyZWU8Yi5EZWdyZWUpe3ZhciB0ZW1wPWE7YT1iLGI9dGVtcH1mb3IodmFyIHJMYXN0PWEscj1iLHNMYXN0PXRoaXMuZmllbGQuT25lLHM9dGhpcy5maWVsZC5aZXJvLHRMYXN0PXRoaXMuZmllbGQuWmVybyx0PXRoaXMuZmllbGQuT25lO3IuRGVncmVlPj1NYXRoLmZsb29yKFIvMik7KXt2YXIgckxhc3RMYXN0PXJMYXN0LHNMYXN0TGFzdD1zTGFzdCx0TGFzdExhc3Q9dExhc3Q7aWYockxhc3Q9cixzTGFzdD1zLHRMYXN0PXQsckxhc3QuWmVybyl0aHJvd1wicl97aS0xfSB3YXMgemVyb1wiO3I9ckxhc3RMYXN0O2Zvcih2YXIgcT10aGlzLmZpZWxkLlplcm8sZGVub21pbmF0b3JMZWFkaW5nVGVybT1yTGFzdC5nZXRDb2VmZmljaWVudChyTGFzdC5EZWdyZWUpLGRsdEludmVyc2U9dGhpcy5maWVsZC5pbnZlcnNlKGRlbm9taW5hdG9yTGVhZGluZ1Rlcm0pO3IuRGVncmVlPj1yTGFzdC5EZWdyZWUmJiFyLlplcm87KXt2YXIgZGVncmVlRGlmZj1yLkRlZ3JlZS1yTGFzdC5EZWdyZWUsc2NhbGU9dGhpcy5maWVsZC5tdWx0aXBseShyLmdldENvZWZmaWNpZW50KHIuRGVncmVlKSxkbHRJbnZlcnNlKTtxPXEuYWRkT3JTdWJ0cmFjdCh0aGlzLmZpZWxkLmJ1aWxkTW9ub21pYWwoZGVncmVlRGlmZixzY2FsZSkpLHI9ci5hZGRPclN1YnRyYWN0KHJMYXN0Lm11bHRpcGx5QnlNb25vbWlhbChkZWdyZWVEaWZmLHNjYWxlKSl9cz1xLm11bHRpcGx5MShzTGFzdCkuYWRkT3JTdWJ0cmFjdChzTGFzdExhc3QpLHQ9cS5tdWx0aXBseTEodExhc3QpLmFkZE9yU3VidHJhY3QodExhc3RMYXN0KX12YXIgc2lnbWFUaWxkZUF0WmVybz10LmdldENvZWZmaWNpZW50KDApO2lmKDA9PXNpZ21hVGlsZGVBdFplcm8pdGhyb3dcIlJlZWRTb2xvbW9uRXhjZXB0aW9uIHNpZ21hVGlsZGUoMCkgd2FzIHplcm9cIjt2YXIgaW52ZXJzZT10aGlzLmZpZWxkLmludmVyc2Uoc2lnbWFUaWxkZUF0WmVybyksc2lnbWE9dC5tdWx0aXBseTIoaW52ZXJzZSksb21lZ2E9ci5tdWx0aXBseTIoaW52ZXJzZSk7cmV0dXJuIG5ldyBBcnJheShzaWdtYSxvbWVnYSl9LHRoaXMuZmluZEVycm9yTG9jYXRpb25zPWZ1bmN0aW9uKGVycm9yTG9jYXRvcil7dmFyIG51bUVycm9ycz1lcnJvckxvY2F0b3IuRGVncmVlO2lmKDE9PW51bUVycm9ycylyZXR1cm4gbmV3IEFycmF5KGVycm9yTG9jYXRvci5nZXRDb2VmZmljaWVudCgxKSk7Zm9yKHZhciByZXN1bHQ9bmV3IEFycmF5KG51bUVycm9ycyksZT0wLGk9MTsyNTY+aSYmbnVtRXJyb3JzPmU7aSsrKTA9PWVycm9yTG9jYXRvci5ldmFsdWF0ZUF0KGkpJiYocmVzdWx0W2VdPXRoaXMuZmllbGQuaW52ZXJzZShpKSxlKyspO2lmKGUhPW51bUVycm9ycyl0aHJvd1wiRXJyb3IgbG9jYXRvciBkZWdyZWUgZG9lcyBub3QgbWF0Y2ggbnVtYmVyIG9mIHJvb3RzXCI7cmV0dXJuIHJlc3VsdH0sdGhpcy5maW5kRXJyb3JNYWduaXR1ZGVzPWZ1bmN0aW9uKGVycm9yRXZhbHVhdG9yLGVycm9yTG9jYXRpb25zLGRhdGFNYXRyaXgpe2Zvcih2YXIgcz1lcnJvckxvY2F0aW9ucy5sZW5ndGgscmVzdWx0PW5ldyBBcnJheShzKSxpPTA7cz5pO2krKyl7Zm9yKHZhciB4aUludmVyc2U9dGhpcy5maWVsZC5pbnZlcnNlKGVycm9yTG9jYXRpb25zW2ldKSxkZW5vbWluYXRvcj0xLGo9MDtzPmo7aisrKWkhPWomJihkZW5vbWluYXRvcj10aGlzLmZpZWxkLm11bHRpcGx5KGRlbm9taW5hdG9yLEdGMjU2LmFkZE9yU3VidHJhY3QoMSx0aGlzLmZpZWxkLm11bHRpcGx5KGVycm9yTG9jYXRpb25zW2pdLHhpSW52ZXJzZSkpKSk7cmVzdWx0W2ldPXRoaXMuZmllbGQubXVsdGlwbHkoZXJyb3JFdmFsdWF0b3IuZXZhbHVhdGVBdCh4aUludmVyc2UpLHRoaXMuZmllbGQuaW52ZXJzZShkZW5vbWluYXRvcikpLGRhdGFNYXRyaXgmJihyZXN1bHRbaV09dGhpcy5maWVsZC5tdWx0aXBseShyZXN1bHRbaV0seGlJbnZlcnNlKSl9cmV0dXJuIHJlc3VsdH19ZnVuY3Rpb24gR0YyNTZQb2x5KGZpZWxkLGNvZWZmaWNpZW50cyl7aWYobnVsbD09Y29lZmZpY2llbnRzfHwwPT1jb2VmZmljaWVudHMubGVuZ3RoKXRocm93XCJTeXN0ZW0uQXJndW1lbnRFeGNlcHRpb25cIjt0aGlzLmZpZWxkPWZpZWxkO3ZhciBjb2VmZmljaWVudHNMZW5ndGg9Y29lZmZpY2llbnRzLmxlbmd0aDtpZihjb2VmZmljaWVudHNMZW5ndGg+MSYmMD09Y29lZmZpY2llbnRzWzBdKXtmb3IodmFyIGZpcnN0Tm9uWmVybz0xO2NvZWZmaWNpZW50c0xlbmd0aD5maXJzdE5vblplcm8mJjA9PWNvZWZmaWNpZW50c1tmaXJzdE5vblplcm9dOylmaXJzdE5vblplcm8rKztpZihmaXJzdE5vblplcm89PWNvZWZmaWNpZW50c0xlbmd0aCl0aGlzLmNvZWZmaWNpZW50cz1maWVsZC5aZXJvLmNvZWZmaWNpZW50cztlbHNle3RoaXMuY29lZmZpY2llbnRzPW5ldyBBcnJheShjb2VmZmljaWVudHNMZW5ndGgtZmlyc3ROb25aZXJvKTtmb3IodmFyIGk9MDtpPHRoaXMuY29lZmZpY2llbnRzLmxlbmd0aDtpKyspdGhpcy5jb2VmZmljaWVudHNbaV09MDtmb3IodmFyIGNpPTA7Y2k8dGhpcy5jb2VmZmljaWVudHMubGVuZ3RoO2NpKyspdGhpcy5jb2VmZmljaWVudHNbY2ldPWNvZWZmaWNpZW50c1tmaXJzdE5vblplcm8rY2ldfX1lbHNlIHRoaXMuY29lZmZpY2llbnRzPWNvZWZmaWNpZW50czt0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJaZXJvXCIsZnVuY3Rpb24oKXtyZXR1cm4gMD09dGhpcy5jb2VmZmljaWVudHNbMF19KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJEZWdyZWVcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvZWZmaWNpZW50cy5sZW5ndGgtMX0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkNvZWZmaWNpZW50c1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29lZmZpY2llbnRzfSksdGhpcy5nZXRDb2VmZmljaWVudD1mdW5jdGlvbihkZWdyZWUpe3JldHVybiB0aGlzLmNvZWZmaWNpZW50c1t0aGlzLmNvZWZmaWNpZW50cy5sZW5ndGgtMS1kZWdyZWVdfSx0aGlzLmV2YWx1YXRlQXQ9ZnVuY3Rpb24oYSl7aWYoMD09YSlyZXR1cm4gdGhpcy5nZXRDb2VmZmljaWVudCgwKTt2YXIgc2l6ZT10aGlzLmNvZWZmaWNpZW50cy5sZW5ndGg7aWYoMT09YSl7Zm9yKHZhciByZXN1bHQ9MCxpPTA7c2l6ZT5pO2krKylyZXN1bHQ9R0YyNTYuYWRkT3JTdWJ0cmFjdChyZXN1bHQsdGhpcy5jb2VmZmljaWVudHNbaV0pO3JldHVybiByZXN1bHR9Zm9yKHZhciByZXN1bHQyPXRoaXMuY29lZmZpY2llbnRzWzBdLGk9MTtzaXplPmk7aSsrKXJlc3VsdDI9R0YyNTYuYWRkT3JTdWJ0cmFjdCh0aGlzLmZpZWxkLm11bHRpcGx5KGEscmVzdWx0MiksdGhpcy5jb2VmZmljaWVudHNbaV0pO3JldHVybiByZXN1bHQyfSx0aGlzLmFkZE9yU3VidHJhY3Q9ZnVuY3Rpb24ob3RoZXIpe2lmKHRoaXMuZmllbGQhPW90aGVyLmZpZWxkKXRocm93XCJHRjI1NlBvbHlzIGRvIG5vdCBoYXZlIHNhbWUgR0YyNTYgZmllbGRcIjtpZih0aGlzLlplcm8pcmV0dXJuIG90aGVyO2lmKG90aGVyLlplcm8pcmV0dXJuIHRoaXM7dmFyIHNtYWxsZXJDb2VmZmljaWVudHM9dGhpcy5jb2VmZmljaWVudHMsbGFyZ2VyQ29lZmZpY2llbnRzPW90aGVyLmNvZWZmaWNpZW50cztpZihzbWFsbGVyQ29lZmZpY2llbnRzLmxlbmd0aD5sYXJnZXJDb2VmZmljaWVudHMubGVuZ3RoKXt2YXIgdGVtcD1zbWFsbGVyQ29lZmZpY2llbnRzO3NtYWxsZXJDb2VmZmljaWVudHM9bGFyZ2VyQ29lZmZpY2llbnRzLGxhcmdlckNvZWZmaWNpZW50cz10ZW1wfWZvcih2YXIgc3VtRGlmZj1uZXcgQXJyYXkobGFyZ2VyQ29lZmZpY2llbnRzLmxlbmd0aCksbGVuZ3RoRGlmZj1sYXJnZXJDb2VmZmljaWVudHMubGVuZ3RoLXNtYWxsZXJDb2VmZmljaWVudHMubGVuZ3RoLGNpPTA7bGVuZ3RoRGlmZj5jaTtjaSsrKXN1bURpZmZbY2ldPWxhcmdlckNvZWZmaWNpZW50c1tjaV07Zm9yKHZhciBpPWxlbmd0aERpZmY7aTxsYXJnZXJDb2VmZmljaWVudHMubGVuZ3RoO2krKylzdW1EaWZmW2ldPUdGMjU2LmFkZE9yU3VidHJhY3Qoc21hbGxlckNvZWZmaWNpZW50c1tpLWxlbmd0aERpZmZdLGxhcmdlckNvZWZmaWNpZW50c1tpXSk7cmV0dXJuIG5ldyBHRjI1NlBvbHkoZmllbGQsc3VtRGlmZil9LHRoaXMubXVsdGlwbHkxPWZ1bmN0aW9uKG90aGVyKXtpZih0aGlzLmZpZWxkIT1vdGhlci5maWVsZCl0aHJvd1wiR0YyNTZQb2x5cyBkbyBub3QgaGF2ZSBzYW1lIEdGMjU2IGZpZWxkXCI7aWYodGhpcy5aZXJvfHxvdGhlci5aZXJvKXJldHVybiB0aGlzLmZpZWxkLlplcm87Zm9yKHZhciBhQ29lZmZpY2llbnRzPXRoaXMuY29lZmZpY2llbnRzLGFMZW5ndGg9YUNvZWZmaWNpZW50cy5sZW5ndGgsYkNvZWZmaWNpZW50cz1vdGhlci5jb2VmZmljaWVudHMsYkxlbmd0aD1iQ29lZmZpY2llbnRzLmxlbmd0aCxwcm9kdWN0PW5ldyBBcnJheShhTGVuZ3RoK2JMZW5ndGgtMSksaT0wO2FMZW5ndGg+aTtpKyspZm9yKHZhciBhQ29lZmY9YUNvZWZmaWNpZW50c1tpXSxqPTA7Ykxlbmd0aD5qO2orKylwcm9kdWN0W2kral09R0YyNTYuYWRkT3JTdWJ0cmFjdChwcm9kdWN0W2kral0sdGhpcy5maWVsZC5tdWx0aXBseShhQ29lZmYsYkNvZWZmaWNpZW50c1tqXSkpO3JldHVybiBuZXcgR0YyNTZQb2x5KHRoaXMuZmllbGQscHJvZHVjdCl9LHRoaXMubXVsdGlwbHkyPWZ1bmN0aW9uKHNjYWxhcil7aWYoMD09c2NhbGFyKXJldHVybiB0aGlzLmZpZWxkLlplcm87aWYoMT09c2NhbGFyKXJldHVybiB0aGlzO2Zvcih2YXIgc2l6ZT10aGlzLmNvZWZmaWNpZW50cy5sZW5ndGgscHJvZHVjdD1uZXcgQXJyYXkoc2l6ZSksaT0wO3NpemU+aTtpKyspcHJvZHVjdFtpXT10aGlzLmZpZWxkLm11bHRpcGx5KHRoaXMuY29lZmZpY2llbnRzW2ldLHNjYWxhcik7cmV0dXJuIG5ldyBHRjI1NlBvbHkodGhpcy5maWVsZCxwcm9kdWN0KX0sdGhpcy5tdWx0aXBseUJ5TW9ub21pYWw9ZnVuY3Rpb24oZGVncmVlLGNvZWZmaWNpZW50KXtpZigwPmRlZ3JlZSl0aHJvd1wiU3lzdGVtLkFyZ3VtZW50RXhjZXB0aW9uXCI7aWYoMD09Y29lZmZpY2llbnQpcmV0dXJuIHRoaXMuZmllbGQuWmVybztmb3IodmFyIHNpemU9dGhpcy5jb2VmZmljaWVudHMubGVuZ3RoLHByb2R1Y3Q9bmV3IEFycmF5KHNpemUrZGVncmVlKSxpPTA7aTxwcm9kdWN0Lmxlbmd0aDtpKyspcHJvZHVjdFtpXT0wO2Zvcih2YXIgaT0wO3NpemU+aTtpKyspcHJvZHVjdFtpXT10aGlzLmZpZWxkLm11bHRpcGx5KHRoaXMuY29lZmZpY2llbnRzW2ldLGNvZWZmaWNpZW50KTtyZXR1cm4gbmV3IEdGMjU2UG9seSh0aGlzLmZpZWxkLHByb2R1Y3QpfSx0aGlzLmRpdmlkZT1mdW5jdGlvbihvdGhlcil7aWYodGhpcy5maWVsZCE9b3RoZXIuZmllbGQpdGhyb3dcIkdGMjU2UG9seXMgZG8gbm90IGhhdmUgc2FtZSBHRjI1NiBmaWVsZFwiO2lmKG90aGVyLlplcm8pdGhyb3dcIkRpdmlkZSBieSAwXCI7Zm9yKHZhciBxdW90aWVudD10aGlzLmZpZWxkLlplcm8scmVtYWluZGVyPXRoaXMsZGVub21pbmF0b3JMZWFkaW5nVGVybT1vdGhlci5nZXRDb2VmZmljaWVudChvdGhlci5EZWdyZWUpLGludmVyc2VEZW5vbWluYXRvckxlYWRpbmdUZXJtPXRoaXMuZmllbGQuaW52ZXJzZShkZW5vbWluYXRvckxlYWRpbmdUZXJtKTtyZW1haW5kZXIuRGVncmVlPj1vdGhlci5EZWdyZWUmJiFyZW1haW5kZXIuWmVybzspe1xuICAgIHZhciBkZWdyZWVEaWZmZXJlbmNlPXJlbWFpbmRlci5EZWdyZWUtb3RoZXIuRGVncmVlLHNjYWxlPXRoaXMuZmllbGQubXVsdGlwbHkocmVtYWluZGVyLmdldENvZWZmaWNpZW50KHJlbWFpbmRlci5EZWdyZWUpLGludmVyc2VEZW5vbWluYXRvckxlYWRpbmdUZXJtKSx0ZXJtPW90aGVyLm11bHRpcGx5QnlNb25vbWlhbChkZWdyZWVEaWZmZXJlbmNlLHNjYWxlKSxpdGVyYXRpb25RdW90aWVudD10aGlzLmZpZWxkLmJ1aWxkTW9ub21pYWwoZGVncmVlRGlmZmVyZW5jZSxzY2FsZSk7cXVvdGllbnQ9cXVvdGllbnQuYWRkT3JTdWJ0cmFjdChpdGVyYXRpb25RdW90aWVudCkscmVtYWluZGVyPXJlbWFpbmRlci5hZGRPclN1YnRyYWN0KHRlcm0pfXJldHVybiBuZXcgQXJyYXkocXVvdGllbnQscmVtYWluZGVyKX19ZnVuY3Rpb24gR0YyNTYocHJpbWl0aXZlKXt0aGlzLmV4cFRhYmxlPW5ldyBBcnJheSgyNTYpLHRoaXMubG9nVGFibGU9bmV3IEFycmF5KDI1Nik7Zm9yKHZhciB4PTEsaT0wOzI1Nj5pO2krKyl0aGlzLmV4cFRhYmxlW2ldPXgseDw8PTEseD49MjU2JiYoeF49cHJpbWl0aXZlKTtmb3IodmFyIGk9MDsyNTU+aTtpKyspdGhpcy5sb2dUYWJsZVt0aGlzLmV4cFRhYmxlW2ldXT1pO3ZhciBhdDA9bmV3IEFycmF5KDEpO2F0MFswXT0wLHRoaXMuemVybz1uZXcgR0YyNTZQb2x5KHRoaXMsbmV3IEFycmF5KGF0MCkpO3ZhciBhdDE9bmV3IEFycmF5KDEpO2F0MVswXT0xLHRoaXMub25lPW5ldyBHRjI1NlBvbHkodGhpcyxuZXcgQXJyYXkoYXQxKSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiWmVyb1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuemVyb30pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIk9uZVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMub25lfSksdGhpcy5idWlsZE1vbm9taWFsPWZ1bmN0aW9uKGRlZ3JlZSxjb2VmZmljaWVudCl7aWYoMD5kZWdyZWUpdGhyb3dcIlN5c3RlbS5Bcmd1bWVudEV4Y2VwdGlvblwiO2lmKDA9PWNvZWZmaWNpZW50KXJldHVybiB6ZXJvO2Zvcih2YXIgY29lZmZpY2llbnRzPW5ldyBBcnJheShkZWdyZWUrMSksaT0wO2k8Y29lZmZpY2llbnRzLmxlbmd0aDtpKyspY29lZmZpY2llbnRzW2ldPTA7cmV0dXJuIGNvZWZmaWNpZW50c1swXT1jb2VmZmljaWVudCxuZXcgR0YyNTZQb2x5KHRoaXMsY29lZmZpY2llbnRzKX0sdGhpcy5leHA9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuZXhwVGFibGVbYV19LHRoaXMubG9nPWZ1bmN0aW9uKGEpe2lmKDA9PWEpdGhyb3dcIlN5c3RlbS5Bcmd1bWVudEV4Y2VwdGlvblwiO3JldHVybiB0aGlzLmxvZ1RhYmxlW2FdfSx0aGlzLmludmVyc2U9ZnVuY3Rpb24oYSl7aWYoMD09YSl0aHJvd1wiU3lzdGVtLkFyaXRobWV0aWNFeGNlcHRpb25cIjtyZXR1cm4gdGhpcy5leHBUYWJsZVsyNTUtdGhpcy5sb2dUYWJsZVthXV19LHRoaXMubXVsdGlwbHk9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gMD09YXx8MD09Yj8wOjE9PWE/YjoxPT1iP2E6dGhpcy5leHBUYWJsZVsodGhpcy5sb2dUYWJsZVthXSt0aGlzLmxvZ1RhYmxlW2JdKSUyNTVdfX1mdW5jdGlvbiBVUlNoaWZ0KG51bWJlcixiaXRzKXtyZXR1cm4gbnVtYmVyPj0wP251bWJlcj4+Yml0czoobnVtYmVyPj5iaXRzKSsoMjw8fmJpdHMpfWZ1bmN0aW9uIEZpbmRlclBhdHRlcm4ocG9zWCxwb3NZLGVzdGltYXRlZE1vZHVsZVNpemUpe3RoaXMueD1wb3NYLHRoaXMueT1wb3NZLHRoaXMuY291bnQ9MSx0aGlzLmVzdGltYXRlZE1vZHVsZVNpemU9ZXN0aW1hdGVkTW9kdWxlU2l6ZSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJFc3RpbWF0ZWRNb2R1bGVTaXplXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQ291bnRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvdW50fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiWFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIllcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLnl9KSx0aGlzLmluY3JlbWVudENvdW50PWZ1bmN0aW9uKCl7dGhpcy5jb3VudCsrfSx0aGlzLmFib3V0RXF1YWxzPWZ1bmN0aW9uKG1vZHVsZVNpemUsaSxqKXtpZihNYXRoLmFicyhpLXRoaXMueSk8PW1vZHVsZVNpemUmJk1hdGguYWJzKGotdGhpcy54KTw9bW9kdWxlU2l6ZSl7dmFyIG1vZHVsZVNpemVEaWZmPU1hdGguYWJzKG1vZHVsZVNpemUtdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplKTtyZXR1cm4gMT49bW9kdWxlU2l6ZURpZmZ8fG1vZHVsZVNpemVEaWZmL3RoaXMuZXN0aW1hdGVkTW9kdWxlU2l6ZTw9MX1yZXR1cm4hMX19ZnVuY3Rpb24gRmluZGVyUGF0dGVybkluZm8ocGF0dGVybkNlbnRlcnMpe3RoaXMuYm90dG9tTGVmdD1wYXR0ZXJuQ2VudGVyc1swXSx0aGlzLnRvcExlZnQ9cGF0dGVybkNlbnRlcnNbMV0sdGhpcy50b3BSaWdodD1wYXR0ZXJuQ2VudGVyc1syXSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJCb3R0b21MZWZ0XCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ib3R0b21MZWZ0fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiVG9wTGVmdFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudG9wTGVmdH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIlRvcFJpZ2h0XCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50b3BSaWdodH0pfWZ1bmN0aW9uIEZpbmRlclBhdHRlcm5GaW5kZXIoKXt0aGlzLmltYWdlPW51bGwsdGhpcy5wb3NzaWJsZUNlbnRlcnM9W10sdGhpcy5oYXNTa2lwcGVkPSExLHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnQ9bmV3IEFycmF5KDAsMCwwLDAsMCksdGhpcy5yZXN1bHRQb2ludENhbGxiYWNrPW51bGwsdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQ3Jvc3NDaGVja1N0YXRlQ291bnRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50WzBdPTAsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudFsxXT0wLHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnRbMl09MCx0aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50WzNdPTAsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudFs0XT0wLHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnR9KSx0aGlzLmZvdW5kUGF0dGVybkNyb3NzPWZ1bmN0aW9uKHN0YXRlQ291bnQpe2Zvcih2YXIgdG90YWxNb2R1bGVTaXplPTAsaT0wOzU+aTtpKyspe3ZhciBjb3VudD1zdGF0ZUNvdW50W2ldO2lmKDA9PWNvdW50KXJldHVybiExO3RvdGFsTW9kdWxlU2l6ZSs9Y291bnR9aWYoNz50b3RhbE1vZHVsZVNpemUpcmV0dXJuITE7dmFyIG1vZHVsZVNpemU9TWF0aC5mbG9vcigodG90YWxNb2R1bGVTaXplPDxJTlRFR0VSX01BVEhfU0hJRlQpLzcpLG1heFZhcmlhbmNlPU1hdGguZmxvb3IobW9kdWxlU2l6ZS8yKTtyZXR1cm4gTWF0aC5hYnMobW9kdWxlU2l6ZS0oc3RhdGVDb3VudFswXTw8SU5URUdFUl9NQVRIX1NISUZUKSk8bWF4VmFyaWFuY2UmJk1hdGguYWJzKG1vZHVsZVNpemUtKHN0YXRlQ291bnRbMV08PElOVEVHRVJfTUFUSF9TSElGVCkpPG1heFZhcmlhbmNlJiZNYXRoLmFicygzKm1vZHVsZVNpemUtKHN0YXRlQ291bnRbMl08PElOVEVHRVJfTUFUSF9TSElGVCkpPDMqbWF4VmFyaWFuY2UmJk1hdGguYWJzKG1vZHVsZVNpemUtKHN0YXRlQ291bnRbM108PElOVEVHRVJfTUFUSF9TSElGVCkpPG1heFZhcmlhbmNlJiZNYXRoLmFicyhtb2R1bGVTaXplLShzdGF0ZUNvdW50WzRdPDxJTlRFR0VSX01BVEhfU0hJRlQpKTxtYXhWYXJpYW5jZX0sdGhpcy5jZW50ZXJGcm9tRW5kPWZ1bmN0aW9uKHN0YXRlQ291bnQsZW5kKXtyZXR1cm4gZW5kLXN0YXRlQ291bnRbNF0tc3RhdGVDb3VudFszXS1zdGF0ZUNvdW50WzJdLzJ9LHRoaXMuY3Jvc3NDaGVja1ZlcnRpY2FsPWZ1bmN0aW9uKHN0YXJ0SSxjZW50ZXJKLG1heENvdW50LG9yaWdpbmFsU3RhdGVDb3VudFRvdGFsKXtmb3IodmFyIGltYWdlPXRoaXMuaW1hZ2UsbWF4ST1xcmNvZGUuaGVpZ2h0LHN0YXRlQ291bnQ9dGhpcy5Dcm9zc0NoZWNrU3RhdGVDb3VudCxpPXN0YXJ0STtpPj0wJiZpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXTspc3RhdGVDb3VudFsyXSsrLGktLTtpZigwPmkpcmV0dXJuIE5hTjtmb3IoO2k+PTAmJiFpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFsxXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMV0rKyxpLS07aWYoMD5pfHxzdGF0ZUNvdW50WzFdPm1heENvdW50KXJldHVybiBOYU47Zm9yKDtpPj0wJiZpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFswXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMF0rKyxpLS07aWYoc3RhdGVDb3VudFswXT5tYXhDb3VudClyZXR1cm4gTmFOO2ZvcihpPXN0YXJ0SSsxO21heEk+aSYmaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF07KXN0YXRlQ291bnRbMl0rKyxpKys7aWYoaT09bWF4SSlyZXR1cm4gTmFOO2Zvcig7bWF4ST5pJiYhaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbM108bWF4Q291bnQ7KXN0YXRlQ291bnRbM10rKyxpKys7aWYoaT09bWF4SXx8c3RhdGVDb3VudFszXT49bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoO21heEk+aSYmaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbNF08bWF4Q291bnQ7KXN0YXRlQ291bnRbNF0rKyxpKys7aWYoc3RhdGVDb3VudFs0XT49bWF4Q291bnQpcmV0dXJuIE5hTjt2YXIgc3RhdGVDb3VudFRvdGFsPXN0YXRlQ291bnRbMF0rc3RhdGVDb3VudFsxXStzdGF0ZUNvdW50WzJdK3N0YXRlQ291bnRbM10rc3RhdGVDb3VudFs0XTtyZXR1cm4gNSpNYXRoLmFicyhzdGF0ZUNvdW50VG90YWwtb3JpZ2luYWxTdGF0ZUNvdW50VG90YWwpPj0yKm9yaWdpbmFsU3RhdGVDb3VudFRvdGFsP05hTjp0aGlzLmZvdW5kUGF0dGVybkNyb3NzKHN0YXRlQ291bnQpP3RoaXMuY2VudGVyRnJvbUVuZChzdGF0ZUNvdW50LGkpOk5hTn0sdGhpcy5jcm9zc0NoZWNrSG9yaXpvbnRhbD1mdW5jdGlvbihzdGFydEosY2VudGVySSxtYXhDb3VudCxvcmlnaW5hbFN0YXRlQ291bnRUb3RhbCl7Zm9yKHZhciBpbWFnZT10aGlzLmltYWdlLG1heEo9cXJjb2RlLndpZHRoLHN0YXRlQ291bnQ9dGhpcy5Dcm9zc0NoZWNrU3RhdGVDb3VudCxqPXN0YXJ0SjtqPj0wJiZpbWFnZVtqK2NlbnRlckkqcXJjb2RlLndpZHRoXTspc3RhdGVDb3VudFsyXSsrLGotLTtpZigwPmopcmV0dXJuIE5hTjtmb3IoO2o+PTAmJiFpbWFnZVtqK2NlbnRlckkqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFsxXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMV0rKyxqLS07aWYoMD5qfHxzdGF0ZUNvdW50WzFdPm1heENvdW50KXJldHVybiBOYU47Zm9yKDtqPj0wJiZpbWFnZVtqK2NlbnRlckkqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFswXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMF0rKyxqLS07aWYoc3RhdGVDb3VudFswXT5tYXhDb3VudClyZXR1cm4gTmFOO2ZvcihqPXN0YXJ0SisxO21heEo+aiYmaW1hZ2VbaitjZW50ZXJJKnFyY29kZS53aWR0aF07KXN0YXRlQ291bnRbMl0rKyxqKys7aWYoaj09bWF4SilyZXR1cm4gTmFOO2Zvcig7bWF4Sj5qJiYhaW1hZ2VbaitjZW50ZXJJKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbM108bWF4Q291bnQ7KXN0YXRlQ291bnRbM10rKyxqKys7aWYoaj09bWF4Snx8c3RhdGVDb3VudFszXT49bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoO21heEo+aiYmaW1hZ2VbaitjZW50ZXJJKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbNF08bWF4Q291bnQ7KXN0YXRlQ291bnRbNF0rKyxqKys7aWYoc3RhdGVDb3VudFs0XT49bWF4Q291bnQpcmV0dXJuIE5hTjt2YXIgc3RhdGVDb3VudFRvdGFsPXN0YXRlQ291bnRbMF0rc3RhdGVDb3VudFsxXStzdGF0ZUNvdW50WzJdK3N0YXRlQ291bnRbM10rc3RhdGVDb3VudFs0XTtyZXR1cm4gNSpNYXRoLmFicyhzdGF0ZUNvdW50VG90YWwtb3JpZ2luYWxTdGF0ZUNvdW50VG90YWwpPj1vcmlnaW5hbFN0YXRlQ291bnRUb3RhbD9OYU46dGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KT90aGlzLmNlbnRlckZyb21FbmQoc3RhdGVDb3VudCxqKTpOYU59LHRoaXMuaGFuZGxlUG9zc2libGVDZW50ZXI9ZnVuY3Rpb24oc3RhdGVDb3VudCxpLGope3ZhciBzdGF0ZUNvdW50VG90YWw9c3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl0rc3RhdGVDb3VudFszXStzdGF0ZUNvdW50WzRdLGNlbnRlcko9dGhpcy5jZW50ZXJGcm9tRW5kKHN0YXRlQ291bnQsaiksY2VudGVyST10aGlzLmNyb3NzQ2hlY2tWZXJ0aWNhbChpLE1hdGguZmxvb3IoY2VudGVySiksc3RhdGVDb3VudFsyXSxzdGF0ZUNvdW50VG90YWwpO2lmKCFpc05hTihjZW50ZXJJKSYmKGNlbnRlcko9dGhpcy5jcm9zc0NoZWNrSG9yaXpvbnRhbChNYXRoLmZsb29yKGNlbnRlckopLE1hdGguZmxvb3IoY2VudGVySSksc3RhdGVDb3VudFsyXSxzdGF0ZUNvdW50VG90YWwpLCFpc05hTihjZW50ZXJKKSkpe2Zvcih2YXIgZXN0aW1hdGVkTW9kdWxlU2l6ZT1zdGF0ZUNvdW50VG90YWwvNyxmb3VuZD0hMSxtYXg9dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoLGluZGV4PTA7bWF4PmluZGV4O2luZGV4Kyspe3ZhciBjZW50ZXI9dGhpcy5wb3NzaWJsZUNlbnRlcnNbaW5kZXhdO2lmKGNlbnRlci5hYm91dEVxdWFscyhlc3RpbWF0ZWRNb2R1bGVTaXplLGNlbnRlckksY2VudGVySikpe2NlbnRlci5pbmNyZW1lbnRDb3VudCgpLGZvdW5kPSEwO2JyZWFrfX1pZighZm91bmQpe3ZhciBwb2ludD1uZXcgRmluZGVyUGF0dGVybihjZW50ZXJKLGNlbnRlckksZXN0aW1hdGVkTW9kdWxlU2l6ZSk7dGhpcy5wb3NzaWJsZUNlbnRlcnMucHVzaChwb2ludCksbnVsbCE9dGhpcy5yZXN1bHRQb2ludENhbGxiYWNrJiZ0aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2suZm91bmRQb3NzaWJsZVJlc3VsdFBvaW50KHBvaW50KX1yZXR1cm4hMH1yZXR1cm4hMX0sdGhpcy5zZWxlY3RCZXN0UGF0dGVybnM9ZnVuY3Rpb24oKXt2YXIgc3RhcnRTaXplPXRoaXMucG9zc2libGVDZW50ZXJzLmxlbmd0aDtpZigzPnN0YXJ0U2l6ZSl0aHJvd1wiQ291bGRuJ3QgZmluZCBlbm91Z2ggZmluZGVyIHBhdHRlcm5zXCI7aWYoc3RhcnRTaXplPjMpe2Zvcih2YXIgdG90YWxNb2R1bGVTaXplPTAsaT0wO3N0YXJ0U2l6ZT5pO2krKyl0b3RhbE1vZHVsZVNpemUrPXRoaXMucG9zc2libGVDZW50ZXJzW2ldLkVzdGltYXRlZE1vZHVsZVNpemU7Zm9yKHZhciBhdmVyYWdlPXRvdGFsTW9kdWxlU2l6ZS9zdGFydFNpemUsaT0wO2k8dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoJiZ0aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGg+MztpKyspe3ZhciBwYXR0ZXJuPXRoaXMucG9zc2libGVDZW50ZXJzW2ldO01hdGguYWJzKHBhdHRlcm4uRXN0aW1hdGVkTW9kdWxlU2l6ZS1hdmVyYWdlKT4uMiphdmVyYWdlJiYodGhpcy5wb3NzaWJsZUNlbnRlcnMucmVtb3ZlKGkpLGktLSl9fXJldHVybiB0aGlzLnBvc3NpYmxlQ2VudGVycy5Db3VudD4zLG5ldyBBcnJheSh0aGlzLnBvc3NpYmxlQ2VudGVyc1swXSx0aGlzLnBvc3NpYmxlQ2VudGVyc1sxXSx0aGlzLnBvc3NpYmxlQ2VudGVyc1syXSl9LHRoaXMuZmluZFJvd1NraXA9ZnVuY3Rpb24oKXt2YXIgbWF4PXRoaXMucG9zc2libGVDZW50ZXJzLmxlbmd0aDtpZigxPj1tYXgpcmV0dXJuIDA7Zm9yKHZhciBmaXJzdENvbmZpcm1lZENlbnRlcj1udWxsLGk9MDttYXg+aTtpKyspe3ZhciBjZW50ZXI9dGhpcy5wb3NzaWJsZUNlbnRlcnNbaV07aWYoY2VudGVyLkNvdW50Pj1DRU5URVJfUVVPUlVNKXtpZihudWxsIT1maXJzdENvbmZpcm1lZENlbnRlcilyZXR1cm4gdGhpcy5oYXNTa2lwcGVkPSEwLE1hdGguZmxvb3IoKE1hdGguYWJzKGZpcnN0Q29uZmlybWVkQ2VudGVyLlgtY2VudGVyLlgpLU1hdGguYWJzKGZpcnN0Q29uZmlybWVkQ2VudGVyLlktY2VudGVyLlkpKS8yKTtmaXJzdENvbmZpcm1lZENlbnRlcj1jZW50ZXJ9fXJldHVybiAwfSx0aGlzLmhhdmVNdWx0aXBseUNvbmZpcm1lZENlbnRlcnM9ZnVuY3Rpb24oKXtmb3IodmFyIGNvbmZpcm1lZENvdW50PTAsdG90YWxNb2R1bGVTaXplPTAsbWF4PXRoaXMucG9zc2libGVDZW50ZXJzLmxlbmd0aCxpPTA7bWF4Pmk7aSsrKXt2YXIgcGF0dGVybj10aGlzLnBvc3NpYmxlQ2VudGVyc1tpXTtwYXR0ZXJuLkNvdW50Pj1DRU5URVJfUVVPUlVNJiYoY29uZmlybWVkQ291bnQrKyx0b3RhbE1vZHVsZVNpemUrPXBhdHRlcm4uRXN0aW1hdGVkTW9kdWxlU2l6ZSl9aWYoMz5jb25maXJtZWRDb3VudClyZXR1cm4hMTtmb3IodmFyIGF2ZXJhZ2U9dG90YWxNb2R1bGVTaXplL21heCx0b3RhbERldmlhdGlvbj0wLGk9MDttYXg+aTtpKyspcGF0dGVybj10aGlzLnBvc3NpYmxlQ2VudGVyc1tpXSx0b3RhbERldmlhdGlvbis9TWF0aC5hYnMocGF0dGVybi5Fc3RpbWF0ZWRNb2R1bGVTaXplLWF2ZXJhZ2UpO3JldHVybi4wNSp0b3RhbE1vZHVsZVNpemU+PXRvdGFsRGV2aWF0aW9ufSx0aGlzLmZpbmRGaW5kZXJQYXR0ZXJuPWZ1bmN0aW9uKGltYWdlKXt2YXIgdHJ5SGFyZGVyPSExO3RoaXMuaW1hZ2U9aW1hZ2U7dmFyIG1heEk9cXJjb2RlLmhlaWdodCxtYXhKPXFyY29kZS53aWR0aCxpU2tpcD1NYXRoLmZsb29yKDMqbWF4SS8oNCpNQVhfTU9EVUxFUykpOyhNSU5fU0tJUD5pU2tpcHx8dHJ5SGFyZGVyKSYmKGlTa2lwPU1JTl9TS0lQKTtmb3IodmFyIGRvbmU9ITEsc3RhdGVDb3VudD1uZXcgQXJyYXkoNSksaT1pU2tpcC0xO21heEk+aSYmIWRvbmU7aSs9aVNraXApe3N0YXRlQ291bnRbMF09MCxzdGF0ZUNvdW50WzFdPTAsc3RhdGVDb3VudFsyXT0wLHN0YXRlQ291bnRbM109MCxzdGF0ZUNvdW50WzRdPTA7Zm9yKHZhciBjdXJyZW50U3RhdGU9MCxqPTA7bWF4Sj5qO2orKylpZihpbWFnZVtqK2kqcXJjb2RlLndpZHRoXSkxPT0oMSZjdXJyZW50U3RhdGUpJiZjdXJyZW50U3RhdGUrKyxzdGF0ZUNvdW50W2N1cnJlbnRTdGF0ZV0rKztlbHNlIGlmKDA9PSgxJmN1cnJlbnRTdGF0ZSkpaWYoND09Y3VycmVudFN0YXRlKWlmKHRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3Moc3RhdGVDb3VudCkpe3ZhciBjb25maXJtZWQ9dGhpcy5oYW5kbGVQb3NzaWJsZUNlbnRlcihzdGF0ZUNvdW50LGksaik7aWYoY29uZmlybWVkKWlmKGlTa2lwPTIsdGhpcy5oYXNTa2lwcGVkKWRvbmU9dGhpcy5oYXZlTXVsdGlwbHlDb25maXJtZWRDZW50ZXJzKCk7ZWxzZXt2YXIgcm93U2tpcD10aGlzLmZpbmRSb3dTa2lwKCk7cm93U2tpcD5zdGF0ZUNvdW50WzJdJiYoaSs9cm93U2tpcC1zdGF0ZUNvdW50WzJdLWlTa2lwLGo9bWF4Si0xKX1lbHNle2RvIGorKzt3aGlsZShtYXhKPmomJiFpbWFnZVtqK2kqcXJjb2RlLndpZHRoXSk7ai0tfWN1cnJlbnRTdGF0ZT0wLHN0YXRlQ291bnRbMF09MCxzdGF0ZUNvdW50WzFdPTAsc3RhdGVDb3VudFsyXT0wLHN0YXRlQ291bnRbM109MCxzdGF0ZUNvdW50WzRdPTB9ZWxzZSBzdGF0ZUNvdW50WzBdPXN0YXRlQ291bnRbMl0sc3RhdGVDb3VudFsxXT1zdGF0ZUNvdW50WzNdLHN0YXRlQ291bnRbMl09c3RhdGVDb3VudFs0XSxzdGF0ZUNvdW50WzNdPTEsc3RhdGVDb3VudFs0XT0wLGN1cnJlbnRTdGF0ZT0zO2Vsc2Ugc3RhdGVDb3VudFsrK2N1cnJlbnRTdGF0ZV0rKztlbHNlIHN0YXRlQ291bnRbY3VycmVudFN0YXRlXSsrO2lmKHRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3Moc3RhdGVDb3VudCkpe3ZhciBjb25maXJtZWQ9dGhpcy5oYW5kbGVQb3NzaWJsZUNlbnRlcihzdGF0ZUNvdW50LGksbWF4Sik7Y29uZmlybWVkJiYoaVNraXA9c3RhdGVDb3VudFswXSx0aGlzLmhhc1NraXBwZWQmJihkb25lPWhhdmVNdWx0aXBseUNvbmZpcm1lZENlbnRlcnMoKSkpfX12YXIgcGF0dGVybkluZm89dGhpcy5zZWxlY3RCZXN0UGF0dGVybnMoKTtyZXR1cm4gcXJjb2RlLm9yZGVyQmVzdFBhdHRlcm5zKHBhdHRlcm5JbmZvKSxuZXcgRmluZGVyUGF0dGVybkluZm8ocGF0dGVybkluZm8pfX1mdW5jdGlvbiBBbGlnbm1lbnRQYXR0ZXJuKHBvc1gscG9zWSxlc3RpbWF0ZWRNb2R1bGVTaXplKXt0aGlzLng9cG9zWCx0aGlzLnk9cG9zWSx0aGlzLmNvdW50PTEsdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplPWVzdGltYXRlZE1vZHVsZVNpemUsdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRXN0aW1hdGVkTW9kdWxlU2l6ZVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXN0aW1hdGVkTW9kdWxlU2l6ZX0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkNvdW50XCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb3VudH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIlhcIixmdW5jdGlvbigpe3JldHVybiBNYXRoLmZsb29yKHRoaXMueCl9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJZXCIsZnVuY3Rpb24oKXtyZXR1cm4gTWF0aC5mbG9vcih0aGlzLnkpfSksdGhpcy5pbmNyZW1lbnRDb3VudD1mdW5jdGlvbigpe3RoaXMuY291bnQrK30sdGhpcy5hYm91dEVxdWFscz1mdW5jdGlvbihtb2R1bGVTaXplLGksail7aWYoTWF0aC5hYnMoaS10aGlzLnkpPD1tb2R1bGVTaXplJiZNYXRoLmFicyhqLXRoaXMueCk8PW1vZHVsZVNpemUpe3ZhciBtb2R1bGVTaXplRGlmZj1NYXRoLmFicyhtb2R1bGVTaXplLXRoaXMuZXN0aW1hdGVkTW9kdWxlU2l6ZSk7cmV0dXJuIDE+PW1vZHVsZVNpemVEaWZmfHxtb2R1bGVTaXplRGlmZi90aGlzLmVzdGltYXRlZE1vZHVsZVNpemU8PTF9cmV0dXJuITF9fWZ1bmN0aW9uIEFsaWdubWVudFBhdHRlcm5GaW5kZXIoaW1hZ2Usc3RhcnRYLHN0YXJ0WSx3aWR0aCxoZWlnaHQsbW9kdWxlU2l6ZSxyZXN1bHRQb2ludENhbGxiYWNrKXt0aGlzLmltYWdlPWltYWdlLHRoaXMucG9zc2libGVDZW50ZXJzPW5ldyBBcnJheSx0aGlzLnN0YXJ0WD1zdGFydFgsdGhpcy5zdGFydFk9c3RhcnRZLHRoaXMud2lkdGg9d2lkdGgsdGhpcy5oZWlnaHQ9aGVpZ2h0LHRoaXMubW9kdWxlU2l6ZT1tb2R1bGVTaXplLHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnQ9bmV3IEFycmF5KDAsMCwwKSx0aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2s9cmVzdWx0UG9pbnRDYWxsYmFjayx0aGlzLmNlbnRlckZyb21FbmQ9ZnVuY3Rpb24oc3RhdGVDb3VudCxlbmQpe3JldHVybiBlbmQtc3RhdGVDb3VudFsyXS1zdGF0ZUNvdW50WzFdLzJ9LHRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3M9ZnVuY3Rpb24oc3RhdGVDb3VudCl7Zm9yKHZhciBtb2R1bGVTaXplPXRoaXMubW9kdWxlU2l6ZSxtYXhWYXJpYW5jZT1tb2R1bGVTaXplLzIsaT0wOzM+aTtpKyspaWYoTWF0aC5hYnMobW9kdWxlU2l6ZS1zdGF0ZUNvdW50W2ldKT49bWF4VmFyaWFuY2UpcmV0dXJuITE7cmV0dXJuITB9LHRoaXMuY3Jvc3NDaGVja1ZlcnRpY2FsPWZ1bmN0aW9uKHN0YXJ0SSxjZW50ZXJKLG1heENvdW50LG9yaWdpbmFsU3RhdGVDb3VudFRvdGFsKXt2YXIgaW1hZ2U9dGhpcy5pbWFnZSxtYXhJPXFyY29kZS5oZWlnaHQsc3RhdGVDb3VudD10aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50O3N0YXRlQ291bnRbMF09MCxzdGF0ZUNvdW50WzFdPTAsc3RhdGVDb3VudFsyXT0wO2Zvcih2YXIgaT1zdGFydEk7aT49MCYmaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbMV08PW1heENvdW50OylzdGF0ZUNvdW50WzFdKyssaS0tO2lmKDA+aXx8c3RhdGVDb3VudFsxXT5tYXhDb3VudClyZXR1cm4gTmFOO2Zvcig7aT49MCYmIWltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzBdPD1tYXhDb3VudDspc3RhdGVDb3VudFswXSsrLGktLTtpZihzdGF0ZUNvdW50WzBdPm1heENvdW50KXJldHVybiBOYU47Zm9yKGk9c3RhcnRJKzE7bWF4ST5pJiZpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFsxXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMV0rKyxpKys7aWYoaT09bWF4SXx8c3RhdGVDb3VudFsxXT5tYXhDb3VudClyZXR1cm4gTmFOO2Zvcig7bWF4ST5pJiYhaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbMl08PW1heENvdW50OylzdGF0ZUNvdW50WzJdKyssaSsrO2lmKHN0YXRlQ291bnRbMl0+bWF4Q291bnQpcmV0dXJuIE5hTjt2YXIgc3RhdGVDb3VudFRvdGFsPXN0YXRlQ291bnRbMF0rc3RhdGVDb3VudFsxXStzdGF0ZUNvdW50WzJdO3JldHVybiA1Kk1hdGguYWJzKHN0YXRlQ291bnRUb3RhbC1vcmlnaW5hbFN0YXRlQ291bnRUb3RhbCk+PTIqb3JpZ2luYWxTdGF0ZUNvdW50VG90YWw/TmFOOnRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3Moc3RhdGVDb3VudCk/dGhpcy5jZW50ZXJGcm9tRW5kKHN0YXRlQ291bnQsaSk6TmFOfSx0aGlzLmhhbmRsZVBvc3NpYmxlQ2VudGVyPWZ1bmN0aW9uKHN0YXRlQ291bnQsaSxqKXt2YXIgc3RhdGVDb3VudFRvdGFsPXN0YXRlQ291bnRbMF0rc3RhdGVDb3VudFsxXStzdGF0ZUNvdW50WzJdLGNlbnRlcko9dGhpcy5jZW50ZXJGcm9tRW5kKHN0YXRlQ291bnQsaiksY2VudGVyST10aGlzLmNyb3NzQ2hlY2tWZXJ0aWNhbChpLE1hdGguZmxvb3IoY2VudGVySiksMipzdGF0ZUNvdW50WzFdLHN0YXRlQ291bnRUb3RhbCk7aWYoIWlzTmFOKGNlbnRlckkpKXtmb3IodmFyIGVzdGltYXRlZE1vZHVsZVNpemU9KHN0YXRlQ291bnRbMF0rc3RhdGVDb3VudFsxXStzdGF0ZUNvdW50WzJdKS8zLG1heD10aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGgsaW5kZXg9MDttYXg+aW5kZXg7aW5kZXgrKyl7dmFyIGNlbnRlcj10aGlzLnBvc3NpYmxlQ2VudGVyc1tpbmRleF07aWYoY2VudGVyLmFib3V0RXF1YWxzKGVzdGltYXRlZE1vZHVsZVNpemUsY2VudGVySSxjZW50ZXJKKSlyZXR1cm4gbmV3IEFsaWdubWVudFBhdHRlcm4oY2VudGVySixjZW50ZXJJLGVzdGltYXRlZE1vZHVsZVNpemUpfXZhciBwb2ludD1uZXcgQWxpZ25tZW50UGF0dGVybihjZW50ZXJKLGNlbnRlckksZXN0aW1hdGVkTW9kdWxlU2l6ZSk7dGhpcy5wb3NzaWJsZUNlbnRlcnMucHVzaChwb2ludCksbnVsbCE9dGhpcy5yZXN1bHRQb2ludENhbGxiYWNrJiZ0aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2suZm91bmRQb3NzaWJsZVJlc3VsdFBvaW50KHBvaW50KX1yZXR1cm4gbnVsbH0sdGhpcy5maW5kPWZ1bmN0aW9uKCl7Zm9yKHZhciBzdGFydFg9dGhpcy5zdGFydFgsaGVpZ2h0PXRoaXMuaGVpZ2h0LG1heEo9c3RhcnRYK3dpZHRoLG1pZGRsZUk9c3RhcnRZKyhoZWlnaHQ+PjEpLHN0YXRlQ291bnQ9bmV3IEFycmF5KDAsMCwwKSxpR2VuPTA7aGVpZ2h0PmlHZW47aUdlbisrKXt2YXIgaT1taWRkbGVJKygwPT0oMSZpR2VuKT9pR2VuKzE+PjE6LShpR2VuKzE+PjEpKTtzdGF0ZUNvdW50WzBdPTAsc3RhdGVDb3VudFsxXT0wLHN0YXRlQ291bnRbMl09MDtmb3IodmFyIGo9c3RhcnRYO21heEo+aiYmIWltYWdlW2orcXJjb2RlLndpZHRoKmldOylqKys7Zm9yKHZhciBjdXJyZW50U3RhdGU9MDttYXhKPmo7KXtpZihpbWFnZVtqK2kqcXJjb2RlLndpZHRoXSlpZigxPT1jdXJyZW50U3RhdGUpc3RhdGVDb3VudFtjdXJyZW50U3RhdGVdKys7ZWxzZSBpZigyPT1jdXJyZW50U3RhdGUpe2lmKHRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3Moc3RhdGVDb3VudCkpe3ZhciBjb25maXJtZWQ9dGhpcy5oYW5kbGVQb3NzaWJsZUNlbnRlcihzdGF0ZUNvdW50LGksaik7aWYobnVsbCE9Y29uZmlybWVkKXJldHVybiBjb25maXJtZWR9c3RhdGVDb3VudFswXT1zdGF0ZUNvdW50WzJdLHN0YXRlQ291bnRbMV09MSxzdGF0ZUNvdW50WzJdPTAsY3VycmVudFN0YXRlPTF9ZWxzZSBzdGF0ZUNvdW50WysrY3VycmVudFN0YXRlXSsrO2Vsc2UgMT09Y3VycmVudFN0YXRlJiZjdXJyZW50U3RhdGUrKyxzdGF0ZUNvdW50W2N1cnJlbnRTdGF0ZV0rKztqKyt9aWYodGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KSl7dmFyIGNvbmZpcm1lZD10aGlzLmhhbmRsZVBvc3NpYmxlQ2VudGVyKHN0YXRlQ291bnQsaSxtYXhKKTtpZihudWxsIT1jb25maXJtZWQpcmV0dXJuIGNvbmZpcm1lZH19aWYoMCE9dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoKXJldHVybiB0aGlzLnBvc3NpYmxlQ2VudGVyc1swXTt0aHJvd1wiQ291bGRuJ3QgZmluZCBlbm91Z2ggYWxpZ25tZW50IHBhdHRlcm5zXCJ9fWZ1bmN0aW9uIFFSQ29kZURhdGFCbG9ja1JlYWRlcihibG9ja3MsdmVyc2lvbixudW1FcnJvckNvcnJlY3Rpb25Db2RlKXt0aGlzLmJsb2NrUG9pbnRlcj0wLHRoaXMuYml0UG9pbnRlcj03LHRoaXMuZGF0YUxlbmd0aD0wLHRoaXMuYmxvY2tzPWJsb2Nrcyx0aGlzLm51bUVycm9yQ29ycmVjdGlvbkNvZGU9bnVtRXJyb3JDb3JyZWN0aW9uQ29kZSw5Pj12ZXJzaW9uP3RoaXMuZGF0YUxlbmd0aE1vZGU9MDp2ZXJzaW9uPj0xMCYmMjY+PXZlcnNpb24/dGhpcy5kYXRhTGVuZ3RoTW9kZT0xOnZlcnNpb24+PTI3JiY0MD49dmVyc2lvbiYmKHRoaXMuZGF0YUxlbmd0aE1vZGU9MiksdGhpcy5nZXROZXh0Qml0cz1mdW5jdGlvbihudW1CaXRzKXt2YXIgYml0cz0wO2lmKG51bUJpdHM8dGhpcy5iaXRQb2ludGVyKzEpe2Zvcih2YXIgbWFzaz0wLGk9MDtudW1CaXRzPmk7aSsrKW1hc2srPTE8PGk7cmV0dXJuIG1hc2s8PD10aGlzLmJpdFBvaW50ZXItbnVtQml0cysxLGJpdHM9KHRoaXMuYmxvY2tzW3RoaXMuYmxvY2tQb2ludGVyXSZtYXNrKT4+dGhpcy5iaXRQb2ludGVyLW51bUJpdHMrMSx0aGlzLmJpdFBvaW50ZXItPW51bUJpdHMsYml0c31pZihudW1CaXRzPHRoaXMuYml0UG9pbnRlcisxKzgpe2Zvcih2YXIgbWFzazE9MCxpPTA7aTx0aGlzLmJpdFBvaW50ZXIrMTtpKyspbWFzazErPTE8PGk7cmV0dXJuIGJpdHM9KHRoaXMuYmxvY2tzW3RoaXMuYmxvY2tQb2ludGVyXSZtYXNrMSk8PG51bUJpdHMtKHRoaXMuYml0UG9pbnRlcisxKSx0aGlzLmJsb2NrUG9pbnRlcisrLGJpdHMrPXRoaXMuYmxvY2tzW3RoaXMuYmxvY2tQb2ludGVyXT4+OC0obnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzEpKSx0aGlzLmJpdFBvaW50ZXI9dGhpcy5iaXRQb2ludGVyLW51bUJpdHMlOCx0aGlzLmJpdFBvaW50ZXI8MCYmKHRoaXMuYml0UG9pbnRlcj04K3RoaXMuYml0UG9pbnRlciksYml0c31pZihudW1CaXRzPHRoaXMuYml0UG9pbnRlcisxKzE2KXtmb3IodmFyIG1hc2sxPTAsbWFzazM9MCxpPTA7aTx0aGlzLmJpdFBvaW50ZXIrMTtpKyspbWFzazErPTE8PGk7dmFyIGJpdHNGaXJzdEJsb2NrPSh0aGlzLmJsb2Nrc1t0aGlzLmJsb2NrUG9pbnRlcl0mbWFzazEpPDxudW1CaXRzLSh0aGlzLmJpdFBvaW50ZXIrMSk7dGhpcy5ibG9ja1BvaW50ZXIrKzt2YXIgYml0c1NlY29uZEJsb2NrPXRoaXMuYmxvY2tzW3RoaXMuYmxvY2tQb2ludGVyXTw8bnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzErOCk7dGhpcy5ibG9ja1BvaW50ZXIrKztmb3IodmFyIGk9MDtpPG51bUJpdHMtKHRoaXMuYml0UG9pbnRlcisxKzgpO2krKyltYXNrMys9MTw8aTttYXNrMzw8PTgtKG51bUJpdHMtKHRoaXMuYml0UG9pbnRlcisxKzgpKTt2YXIgYml0c1RoaXJkQmxvY2s9KHRoaXMuYmxvY2tzW3RoaXMuYmxvY2tQb2ludGVyXSZtYXNrMyk+PjgtKG51bUJpdHMtKHRoaXMuYml0UG9pbnRlcisxKzgpKTtyZXR1cm4gYml0cz1iaXRzRmlyc3RCbG9jaytiaXRzU2Vjb25kQmxvY2srYml0c1RoaXJkQmxvY2ssdGhpcy5iaXRQb2ludGVyPXRoaXMuYml0UG9pbnRlci0obnVtQml0cy04KSU4LHRoaXMuYml0UG9pbnRlcjwwJiYodGhpcy5iaXRQb2ludGVyPTgrdGhpcy5iaXRQb2ludGVyKSxiaXRzfXJldHVybiAwfSx0aGlzLk5leHRNb2RlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmxvY2tQb2ludGVyPnRoaXMuYmxvY2tzLmxlbmd0aC10aGlzLm51bUVycm9yQ29ycmVjdGlvbkNvZGUtMj8wOnRoaXMuZ2V0TmV4dEJpdHMoNCl9LHRoaXMuZ2V0RGF0YUxlbmd0aD1mdW5jdGlvbihtb2RlSW5kaWNhdG9yKXtmb3IodmFyIGluZGV4PTA7Oyl7aWYobW9kZUluZGljYXRvcj4+aW5kZXg9PTEpYnJlYWs7aW5kZXgrK31yZXR1cm4gdGhpcy5nZXROZXh0Qml0cyhxcmNvZGUuc2l6ZU9mRGF0YUxlbmd0aEluZm9bdGhpcy5kYXRhTGVuZ3RoTW9kZV1baW5kZXhdKX0sdGhpcy5nZXRSb21hbkFuZEZpZ3VyZVN0cmluZz1mdW5jdGlvbihkYXRhTGVuZ3RoKXt2YXIgbGVuZ3RoPWRhdGFMZW5ndGgsaW50RGF0YT0wLHN0ckRhdGE9XCJcIix0YWJsZVJvbWFuQW5kRmlndXJlPW5ldyBBcnJheShcIjBcIixcIjFcIixcIjJcIixcIjNcIixcIjRcIixcIjVcIixcIjZcIixcIjdcIixcIjhcIixcIjlcIixcIkFcIixcIkJcIixcIkNcIixcIkRcIixcIkVcIixcIkZcIixcIkdcIixcIkhcIixcIklcIixcIkpcIixcIktcIixcIkxcIixcIk1cIixcIk5cIixcIk9cIixcIlBcIixcIlFcIixcIlJcIixcIlNcIixcIlRcIixcIlVcIixcIlZcIixcIldcIixcIlhcIixcIllcIixcIlpcIixcIiBcIixcIiRcIixcIiVcIixcIipcIixcIitcIixcIi1cIixcIi5cIixcIi9cIixcIjpcIik7ZG8gaWYobGVuZ3RoPjEpe2ludERhdGE9dGhpcy5nZXROZXh0Qml0cygxMSk7dmFyIGZpcnN0TGV0dGVyPU1hdGguZmxvb3IoaW50RGF0YS80NSksc2Vjb25kTGV0dGVyPWludERhdGElNDU7c3RyRGF0YSs9dGFibGVSb21hbkFuZEZpZ3VyZVtmaXJzdExldHRlcl0sc3RyRGF0YSs9dGFibGVSb21hbkFuZEZpZ3VyZVtzZWNvbmRMZXR0ZXJdLGxlbmd0aC09Mn1lbHNlIDE9PWxlbmd0aCYmKGludERhdGE9dGhpcy5nZXROZXh0Qml0cyg2KSxzdHJEYXRhKz10YWJsZVJvbWFuQW5kRmlndXJlW2ludERhdGFdLGxlbmd0aC09MSk7d2hpbGUobGVuZ3RoPjApO3JldHVybiBzdHJEYXRhfSx0aGlzLmdldEZpZ3VyZVN0cmluZz1mdW5jdGlvbihkYXRhTGVuZ3RoKXt2YXIgbGVuZ3RoPWRhdGFMZW5ndGgsaW50RGF0YT0wLHN0ckRhdGE9XCJcIjtkbyBsZW5ndGg+PTM/KGludERhdGE9dGhpcy5nZXROZXh0Qml0cygxMCksMTAwPmludERhdGEmJihzdHJEYXRhKz1cIjBcIiksMTA+aW50RGF0YSYmKHN0ckRhdGErPVwiMFwiKSxsZW5ndGgtPTMpOjI9PWxlbmd0aD8oaW50RGF0YT10aGlzLmdldE5leHRCaXRzKDcpLDEwPmludERhdGEmJihzdHJEYXRhKz1cIjBcIiksbGVuZ3RoLT0yKToxPT1sZW5ndGgmJihpbnREYXRhPXRoaXMuZ2V0TmV4dEJpdHMoNCksbGVuZ3RoLT0xKSxzdHJEYXRhKz1pbnREYXRhO3doaWxlKGxlbmd0aD4wKTtyZXR1cm4gc3RyRGF0YX0sdGhpcy5nZXQ4Yml0Qnl0ZUFycmF5PWZ1bmN0aW9uKGRhdGFMZW5ndGgpe3ZhciBsZW5ndGg9ZGF0YUxlbmd0aCxpbnREYXRhPTAsb3V0cHV0PW5ldyBBcnJheTtkbyBpbnREYXRhPXRoaXMuZ2V0TmV4dEJpdHMoOCksb3V0cHV0LnB1c2goaW50RGF0YSksbGVuZ3RoLS07d2hpbGUobGVuZ3RoPjApO3JldHVybiBvdXRwdXR9LHRoaXMuZ2V0S2FuamlTdHJpbmc9ZnVuY3Rpb24oZGF0YUxlbmd0aCl7dmFyIGxlbmd0aD1kYXRhTGVuZ3RoLGludERhdGE9MCx1bmljb2RlU3RyaW5nPVwiXCI7ZG97aW50RGF0YT1nZXROZXh0Qml0cygxMyk7dmFyIGxvd2VyQnl0ZT1pbnREYXRhJTE5MixoaWdoZXJCeXRlPWludERhdGEvMTkyLHRlbXBXb3JkPShoaWdoZXJCeXRlPDw4KStsb3dlckJ5dGUsc2hpZnRqaXNXb3JkPTA7c2hpZnRqaXNXb3JkPTQwOTU2Pj10ZW1wV29yZCszMzA4OD90ZW1wV29yZCszMzA4ODp0ZW1wV29yZCs0OTQ3Mix1bmljb2RlU3RyaW5nKz1TdHJpbmcuZnJvbUNoYXJDb2RlKHNoaWZ0amlzV29yZCksbGVuZ3RoLS19d2hpbGUobGVuZ3RoPjApO3JldHVybiB1bmljb2RlU3RyaW5nfSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJEYXRhQnl0ZVwiLGZ1bmN0aW9uKCl7Zm9yKHZhciBvdXRwdXQ9bmV3IEFycmF5LE1PREVfTlVNQkVSPTEsTU9ERV9ST01BTl9BTkRfTlVNQkVSPTIsTU9ERV84QklUX0JZVEU9NCxNT0RFX0tBTkpJPTg7Oyl7dmFyIG1vZGU9dGhpcy5OZXh0TW9kZSgpO2lmKDA9PW1vZGUpe2lmKG91dHB1dC5sZW5ndGg+MClicmVhazt0aHJvd1wiRW1wdHkgZGF0YSBibG9ja1wifWlmKG1vZGUhPU1PREVfTlVNQkVSJiZtb2RlIT1NT0RFX1JPTUFOX0FORF9OVU1CRVImJm1vZGUhPU1PREVfOEJJVF9CWVRFJiZtb2RlIT1NT0RFX0tBTkpJKXRocm93XCJJbnZhbGlkIG1vZGU6IFwiK21vZGUrXCIgaW4gKGJsb2NrOlwiK3RoaXMuYmxvY2tQb2ludGVyK1wiIGJpdDpcIit0aGlzLmJpdFBvaW50ZXIrXCIpXCI7aWYoZGF0YUxlbmd0aD10aGlzLmdldERhdGFMZW5ndGgobW9kZSksZGF0YUxlbmd0aDwxKXRocm93XCJJbnZhbGlkIGRhdGEgbGVuZ3RoOiBcIitkYXRhTGVuZ3RoO3N3aXRjaChtb2RlKXtjYXNlIE1PREVfTlVNQkVSOmZvcih2YXIgdGVtcF9zdHI9dGhpcy5nZXRGaWd1cmVTdHJpbmcoZGF0YUxlbmd0aCksdGE9bmV3IEFycmF5KHRlbXBfc3RyLmxlbmd0aCksaj0wO2o8dGVtcF9zdHIubGVuZ3RoO2orKyl0YVtqXT10ZW1wX3N0ci5jaGFyQ29kZUF0KGopO291dHB1dC5wdXNoKHRhKTticmVhaztjYXNlIE1PREVfUk9NQU5fQU5EX05VTUJFUjpmb3IodmFyIHRlbXBfc3RyPXRoaXMuZ2V0Um9tYW5BbmRGaWd1cmVTdHJpbmcoZGF0YUxlbmd0aCksdGE9bmV3IEFycmF5KHRlbXBfc3RyLmxlbmd0aCksaj0wO2o8dGVtcF9zdHIubGVuZ3RoO2orKyl0YVtqXT10ZW1wX3N0ci5jaGFyQ29kZUF0KGopO291dHB1dC5wdXNoKHRhKTticmVhaztjYXNlIE1PREVfOEJJVF9CWVRFOnZhciB0ZW1wX3NieXRlQXJyYXkzPXRoaXMuZ2V0OGJpdEJ5dGVBcnJheShkYXRhTGVuZ3RoKTtvdXRwdXQucHVzaCh0ZW1wX3NieXRlQXJyYXkzKTticmVhaztjYXNlIE1PREVfS0FOSkk6dmFyIHRlbXBfc3RyPXRoaXMuZ2V0S2FuamlTdHJpbmcoZGF0YUxlbmd0aCk7b3V0cHV0LnB1c2godGVtcF9zdHIpfX1yZXR1cm4gb3V0cHV0fSl9R3JpZFNhbXBsZXI9e30sR3JpZFNhbXBsZXIuY2hlY2tBbmROdWRnZVBvaW50cz1mdW5jdGlvbihpbWFnZSxwb2ludHMpe2Zvcih2YXIgd2lkdGg9cXJjb2RlLndpZHRoLGhlaWdodD1xcmNvZGUuaGVpZ2h0LG51ZGdlZD0hMCxvZmZzZXQ9MDtvZmZzZXQ8cG9pbnRzLkxlbmd0aCYmbnVkZ2VkO29mZnNldCs9Mil7dmFyIHg9TWF0aC5mbG9vcihwb2ludHNbb2Zmc2V0XSkseT1NYXRoLmZsb29yKHBvaW50c1tvZmZzZXQrMV0pO2lmKC0xPnh8fHg+d2lkdGh8fC0xPnl8fHk+aGVpZ2h0KXRocm93XCJFcnJvci5jaGVja0FuZE51ZGdlUG9pbnRzIFwiO251ZGdlZD0hMSwtMT09eD8ocG9pbnRzW29mZnNldF09MCxudWRnZWQ9ITApOng9PXdpZHRoJiYocG9pbnRzW29mZnNldF09d2lkdGgtMSxudWRnZWQ9ITApLC0xPT15Pyhwb2ludHNbb2Zmc2V0KzFdPTAsbnVkZ2VkPSEwKTp5PT1oZWlnaHQmJihwb2ludHNbb2Zmc2V0KzFdPWhlaWdodC0xLG51ZGdlZD0hMCl9bnVkZ2VkPSEwO2Zvcih2YXIgb2Zmc2V0PXBvaW50cy5MZW5ndGgtMjtvZmZzZXQ+PTAmJm51ZGdlZDtvZmZzZXQtPTIpe3ZhciB4PU1hdGguZmxvb3IocG9pbnRzW29mZnNldF0pLHk9TWF0aC5mbG9vcihwb2ludHNbb2Zmc2V0KzFdKTtpZigtMT54fHx4PndpZHRofHwtMT55fHx5PmhlaWdodCl0aHJvd1wiRXJyb3IuY2hlY2tBbmROdWRnZVBvaW50cyBcIjtudWRnZWQ9ITEsLTE9PXg/KHBvaW50c1tvZmZzZXRdPTAsbnVkZ2VkPSEwKTp4PT13aWR0aCYmKHBvaW50c1tvZmZzZXRdPXdpZHRoLTEsbnVkZ2VkPSEwKSwtMT09eT8ocG9pbnRzW29mZnNldCsxXT0wLG51ZGdlZD0hMCk6eT09aGVpZ2h0JiYocG9pbnRzW29mZnNldCsxXT1oZWlnaHQtMSxudWRnZWQ9ITApfX0sR3JpZFNhbXBsZXIuc2FtcGxlR3JpZDM9ZnVuY3Rpb24oaW1hZ2UsZGltZW5zaW9uLHRyYW5zZm9ybSl7Zm9yKHZhciBiaXRzPW5ldyBCaXRNYXRyaXgoZGltZW5zaW9uKSxwb2ludHM9bmV3IEFycmF5KGRpbWVuc2lvbjw8MSkseT0wO2RpbWVuc2lvbj55O3krKyl7Zm9yKHZhciBtYXg9cG9pbnRzLmxlbmd0aCxpVmFsdWU9eSsuNSx4PTA7bWF4Png7eCs9Milwb2ludHNbeF09KHg+PjEpKy41LHBvaW50c1t4KzFdPWlWYWx1ZTt0cmFuc2Zvcm0udHJhbnNmb3JtUG9pbnRzMShwb2ludHMpLEdyaWRTYW1wbGVyLmNoZWNrQW5kTnVkZ2VQb2ludHMoaW1hZ2UscG9pbnRzKTt0cnl7Zm9yKHZhciB4PTA7bWF4Png7eCs9Mil7dmFyIHhwb2ludD00Kk1hdGguZmxvb3IocG9pbnRzW3hdKStNYXRoLmZsb29yKHBvaW50c1t4KzFdKSpxcmNvZGUud2lkdGgqNCxiaXQ9aW1hZ2VbTWF0aC5mbG9vcihwb2ludHNbeF0pK3FyY29kZS53aWR0aCpNYXRoLmZsb29yKHBvaW50c1t4KzFdKV07cXJjb2RlLmltYWdlZGF0YS5kYXRhW3hwb2ludF09Yml0PzI1NTowLHFyY29kZS5pbWFnZWRhdGEuZGF0YVt4cG9pbnQrMV09Yml0PzI1NTowLHFyY29kZS5pbWFnZWRhdGEuZGF0YVt4cG9pbnQrMl09MCxxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbeHBvaW50KzNdPTI1NSxiaXQmJmJpdHMuc2V0X1JlbmFtZWQoeD4+MSx5KX19Y2F0Y2goYWlvb2JlKXt0aHJvd1wiRXJyb3IuY2hlY2tBbmROdWRnZVBvaW50c1wifX1yZXR1cm4gYml0c30sR3JpZFNhbXBsZXIuc2FtcGxlR3JpZHg9ZnVuY3Rpb24oaW1hZ2UsZGltZW5zaW9uLHAxVG9YLHAxVG9ZLHAyVG9YLHAyVG9ZLHAzVG9YLHAzVG9ZLHA0VG9YLHA0VG9ZLHAxRnJvbVgscDFGcm9tWSxwMkZyb21YLHAyRnJvbVkscDNGcm9tWCxwM0Zyb21ZLHA0RnJvbVgscDRGcm9tWSl7dmFyIHRyYW5zZm9ybT1QZXJzcGVjdGl2ZVRyYW5zZm9ybS5xdWFkcmlsYXRlcmFsVG9RdWFkcmlsYXRlcmFsKHAxVG9YLHAxVG9ZLHAyVG9YLHAyVG9ZLHAzVG9YLHAzVG9ZLHA0VG9YLHA0VG9ZLHAxRnJvbVgscDFGcm9tWSxwMkZyb21YLHAyRnJvbVkscDNGcm9tWCxwM0Zyb21ZLHA0RnJvbVgscDRGcm9tWSk7cmV0dXJuIEdyaWRTYW1wbGVyLnNhbXBsZUdyaWQzKGltYWdlLGRpbWVuc2lvbix0cmFuc2Zvcm0pfSxWZXJzaW9uLlZFUlNJT05fREVDT0RFX0lORk89bmV3IEFycmF5KDMxODkyLDM0MjM2LDM5NTc3LDQyMTk1LDQ4MTE4LDUxMDQyLDU1MzY3LDU4ODkzLDYzNzg0LDY4NDcyLDcwNzQ5LDc2MzExLDc5MTU0LDg0MzkwLDg3NjgzLDkyMzYxLDk2MjM2LDEwMjA4NCwxMDI4ODEsMTEwNTA3LDExMDczNCwxMTc3ODYsMTE5NjE1LDEyNjMyNSwxMjc1NjgsMTMzNTg5LDEzNjk0NCwxNDE0OTgsMTQ1MzExLDE1MDI4MywxNTI2MjIsMTU4MzA4LDE2MTA4OSwxNjcwMTcpLFZlcnNpb24uVkVSU0lPTlM9YnVpbGRWZXJzaW9ucygpLFZlcnNpb24uZ2V0VmVyc2lvbkZvck51bWJlcj1mdW5jdGlvbih2ZXJzaW9uTnVtYmVyKXtpZigxPnZlcnNpb25OdW1iZXJ8fHZlcnNpb25OdW1iZXI+NDApdGhyb3dcIkFyZ3VtZW50RXhjZXB0aW9uXCI7cmV0dXJuIFZlcnNpb24uVkVSU0lPTlNbdmVyc2lvbk51bWJlci0xXX0sVmVyc2lvbi5nZXRQcm92aXNpb25hbFZlcnNpb25Gb3JEaW1lbnNpb249ZnVuY3Rpb24oZGltZW5zaW9uKXtpZihkaW1lbnNpb24lNCE9MSl0aHJvd1wiRXJyb3IgZ2V0UHJvdmlzaW9uYWxWZXJzaW9uRm9yRGltZW5zaW9uXCI7dHJ5e3JldHVybiBWZXJzaW9uLmdldFZlcnNpb25Gb3JOdW1iZXIoZGltZW5zaW9uLTE3Pj4yKX1jYXRjaChpYWUpe3Rocm93XCJFcnJvciBnZXRWZXJzaW9uRm9yTnVtYmVyXCJ9fSxWZXJzaW9uLmRlY29kZVZlcnNpb25JbmZvcm1hdGlvbj1mdW5jdGlvbih2ZXJzaW9uQml0cyl7Zm9yKHZhciBiZXN0RGlmZmVyZW5jZT00Mjk0OTY3Mjk1LGJlc3RWZXJzaW9uPTAsaT0wO2k8VmVyc2lvbi5WRVJTSU9OX0RFQ09ERV9JTkZPLmxlbmd0aDtpKyspe3ZhciB0YXJnZXRWZXJzaW9uPVZlcnNpb24uVkVSU0lPTl9ERUNPREVfSU5GT1tpXTtpZih0YXJnZXRWZXJzaW9uPT12ZXJzaW9uQml0cylyZXR1cm4gdGhpcy5nZXRWZXJzaW9uRm9yTnVtYmVyKGkrNyk7dmFyIGJpdHNEaWZmZXJlbmNlPUZvcm1hdEluZm9ybWF0aW9uLm51bUJpdHNEaWZmZXJpbmcodmVyc2lvbkJpdHMsdGFyZ2V0VmVyc2lvbik7YmVzdERpZmZlcmVuY2U+Yml0c0RpZmZlcmVuY2UmJihiZXN0VmVyc2lvbj1pKzcsYmVzdERpZmZlcmVuY2U9Yml0c0RpZmZlcmVuY2UpfXJldHVybiAzPj1iZXN0RGlmZmVyZW5jZT90aGlzLmdldFZlcnNpb25Gb3JOdW1iZXIoYmVzdFZlcnNpb24pOm51bGx9LFBlcnNwZWN0aXZlVHJhbnNmb3JtLnF1YWRyaWxhdGVyYWxUb1F1YWRyaWxhdGVyYWw9ZnVuY3Rpb24oeDAseTAseDEseTEseDIseTIseDMseTMseDBwLHkwcCx4MXAseTFwLHgycCx5MnAseDNwLHkzcCl7dmFyIHFUb1M9dGhpcy5xdWFkcmlsYXRlcmFsVG9TcXVhcmUoeDAseTAseDEseTEseDIseTIseDMseTMpLHNUb1E9dGhpcy5zcXVhcmVUb1F1YWRyaWxhdGVyYWwoeDBwLHkwcCx4MXAseTFwLHgycCx5MnAseDNwLHkzcCk7cmV0dXJuIHNUb1EudGltZXMocVRvUyl9LFBlcnNwZWN0aXZlVHJhbnNmb3JtLnNxdWFyZVRvUXVhZHJpbGF0ZXJhbD1mdW5jdGlvbih4MCx5MCx4MSx5MSx4Mix5Mix4Myx5Myl7cmV0dXJuIGR5Mj15My15MixkeTM9eTAteTEreTIteTMsMD09ZHkyJiYwPT1keTM/bmV3IFBlcnNwZWN0aXZlVHJhbnNmb3JtKHgxLXgwLHgyLXgxLHgwLHkxLXkwLHkyLXkxLHkwLDAsMCwxKTooZHgxPXgxLXgyLGR4Mj14My14MixkeDM9eDAteDEreDIteDMsZHkxPXkxLXkyLGRlbm9taW5hdG9yPWR4MSpkeTItZHgyKmR5MSxhMTM9KGR4MypkeTItZHgyKmR5MykvZGVub21pbmF0b3IsYTIzPShkeDEqZHkzLWR4MypkeTEpL2Rlbm9taW5hdG9yLG5ldyBQZXJzcGVjdGl2ZVRyYW5zZm9ybSh4MS14MCthMTMqeDEseDMteDArYTIzKngzLHgwLHkxLXkwK2ExMyp5MSx5My15MCthMjMqeTMseTAsYTEzLGEyMywxKSl9LFBlcnNwZWN0aXZlVHJhbnNmb3JtLnF1YWRyaWxhdGVyYWxUb1NxdWFyZT1mdW5jdGlvbih4MCx5MCx4MSx5MSx4Mix5Mix4Myx5Myl7cmV0dXJuIHRoaXMuc3F1YXJlVG9RdWFkcmlsYXRlcmFsKHgwLHkwLHgxLHkxLHgyLHkyLHgzLHkzKS5idWlsZEFkam9pbnQoKX07dmFyIEZPUk1BVF9JTkZPX01BU0tfUVI9MjE1MjIsRk9STUFUX0lORk9fREVDT0RFX0xPT0tVUD1uZXcgQXJyYXkobmV3IEFycmF5KDIxNTIyLDApLG5ldyBBcnJheSgyMDc3MywxKSxuZXcgQXJyYXkoMjQxODgsMiksbmV3IEFycmF5KDIzMzcxLDMpLG5ldyBBcnJheSgxNzkxMyw0KSxuZXcgQXJyYXkoMTY1OTAsNSksbmV3IEFycmF5KDIwMzc1LDYpLG5ldyBBcnJheSgxOTEwNCw3KSxuZXcgQXJyYXkoMzA2NjAsOCksbmV3IEFycmF5KDI5NDI3LDkpLG5ldyBBcnJheSgzMjE3MCwxMCksbmV3IEFycmF5KDMwODc3LDExKSxuZXcgQXJyYXkoMjYxNTksMTIpLG5ldyBBcnJheSgyNTM2OCwxMyksbmV3IEFycmF5KDI3NzEzLDE0KSxuZXcgQXJyYXkoMjY5OTgsMTUpLG5ldyBBcnJheSg1NzY5LDE2KSxuZXcgQXJyYXkoNTA1NCwxNyksbmV3IEFycmF5KDczOTksMTgpLG5ldyBBcnJheSg2NjA4LDE5KSxuZXcgQXJyYXkoMTg5MCwyMCksbmV3IEFycmF5KDU5NywyMSksbmV3IEFycmF5KDMzNDAsMjIpLG5ldyBBcnJheSgyMTA3LDIzKSxuZXcgQXJyYXkoMTM2NjMsMjQpLG5ldyBBcnJheSgxMjM5MiwyNSksbmV3IEFycmF5KDE2MTc3LDI2KSxuZXcgQXJyYXkoMTQ4NTQsMjcpLG5ldyBBcnJheSg5Mzk2LDI4KSxuZXcgQXJyYXkoODU3OSwyOSksbmV3IEFycmF5KDExOTk0LDMwKSxuZXcgQXJyYXkoMTEyNDUsMzEpKSxCSVRTX1NFVF9JTl9IQUxGX0JZVEU9bmV3IEFycmF5KDAsMSwxLDIsMSwyLDIsMywxLDIsMiwzLDIsMywzLDQpO0Zvcm1hdEluZm9ybWF0aW9uLm51bUJpdHNEaWZmZXJpbmc9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYV49YixCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmYV0rQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JlVSU2hpZnQoYSw0KV0rQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JlVSU2hpZnQoYSw4KV0rQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JlVSU2hpZnQoYSwxMildK0JJVFNfU0VUX0lOX0hBTEZfQllURVsxNSZVUlNoaWZ0KGEsMTYpXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDIwKV0rQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JlVSU2hpZnQoYSwyNCldK0JJVFNfU0VUX0lOX0hBTEZfQllURVsxNSZVUlNoaWZ0KGEsMjgpXX0sRm9ybWF0SW5mb3JtYXRpb24uZGVjb2RlRm9ybWF0SW5mb3JtYXRpb249ZnVuY3Rpb24obWFza2VkRm9ybWF0SW5mbyl7dmFyIGZvcm1hdEluZm89Rm9ybWF0SW5mb3JtYXRpb24uZG9EZWNvZGVGb3JtYXRJbmZvcm1hdGlvbihtYXNrZWRGb3JtYXRJbmZvKTtyZXR1cm4gbnVsbCE9Zm9ybWF0SW5mbz9mb3JtYXRJbmZvOkZvcm1hdEluZm9ybWF0aW9uLmRvRGVjb2RlRm9ybWF0SW5mb3JtYXRpb24obWFza2VkRm9ybWF0SW5mb15GT1JNQVRfSU5GT19NQVNLX1FSKX0sRm9ybWF0SW5mb3JtYXRpb24uZG9EZWNvZGVGb3JtYXRJbmZvcm1hdGlvbj1mdW5jdGlvbihtYXNrZWRGb3JtYXRJbmZvKXtmb3IodmFyIGJlc3REaWZmZXJlbmNlPTQyOTQ5NjcyOTUsYmVzdEZvcm1hdEluZm89MCxpPTA7aTxGT1JNQVRfSU5GT19ERUNPREVfTE9PS1VQLmxlbmd0aDtpKyspe3ZhciBkZWNvZGVJbmZvPUZPUk1BVF9JTkZPX0RFQ09ERV9MT09LVVBbaV0sdGFyZ2V0SW5mbz1kZWNvZGVJbmZvWzBdO2lmKHRhcmdldEluZm89PW1hc2tlZEZvcm1hdEluZm8pcmV0dXJuIG5ldyBGb3JtYXRJbmZvcm1hdGlvbihkZWNvZGVJbmZvWzFdKTt2YXIgYml0c0RpZmZlcmVuY2U9dGhpcy5udW1CaXRzRGlmZmVyaW5nKG1hc2tlZEZvcm1hdEluZm8sdGFyZ2V0SW5mbyk7YmVzdERpZmZlcmVuY2U+Yml0c0RpZmZlcmVuY2UmJihiZXN0Rm9ybWF0SW5mbz1kZWNvZGVJbmZvWzFdLGJlc3REaWZmZXJlbmNlPWJpdHNEaWZmZXJlbmNlKX1yZXR1cm4gMz49YmVzdERpZmZlcmVuY2U/bmV3IEZvcm1hdEluZm9ybWF0aW9uKGJlc3RGb3JtYXRJbmZvKTpudWxsfSxFcnJvckNvcnJlY3Rpb25MZXZlbC5mb3JCaXRzPWZ1bmN0aW9uKGJpdHMpe2lmKDA+Yml0c3x8Yml0cz49Rk9SX0JJVFMuTGVuZ3RoKXRocm93XCJBcmd1bWVudEV4Y2VwdGlvblwiO3JldHVybiBGT1JfQklUU1tiaXRzXX07dmFyIEw9bmV3IEVycm9yQ29ycmVjdGlvbkxldmVsKDAsMSxcIkxcIiksTT1uZXcgRXJyb3JDb3JyZWN0aW9uTGV2ZWwoMSwwLFwiTVwiKSxRPW5ldyBFcnJvckNvcnJlY3Rpb25MZXZlbCgyLDMsXCJRXCIpLEg9bmV3IEVycm9yQ29ycmVjdGlvbkxldmVsKDMsMixcIkhcIiksRk9SX0JJVFM9bmV3IEFycmF5KE0sTCxILFEpO0RhdGFCbG9jay5nZXREYXRhQmxvY2tzPWZ1bmN0aW9uKHJhd0NvZGV3b3Jkcyx2ZXJzaW9uLGVjTGV2ZWwpe2lmKHJhd0NvZGV3b3Jkcy5sZW5ndGghPXZlcnNpb24uVG90YWxDb2Rld29yZHMpdGhyb3dcIkFyZ3VtZW50RXhjZXB0aW9uXCI7Zm9yKHZhciBlY0Jsb2Nrcz12ZXJzaW9uLmdldEVDQmxvY2tzRm9yTGV2ZWwoZWNMZXZlbCksdG90YWxCbG9ja3M9MCxlY0Jsb2NrQXJyYXk9ZWNCbG9ja3MuZ2V0RUNCbG9ja3MoKSxpPTA7aTxlY0Jsb2NrQXJyYXkubGVuZ3RoO2krKyl0b3RhbEJsb2Nrcys9ZWNCbG9ja0FycmF5W2ldLkNvdW50O2Zvcih2YXIgcmVzdWx0PW5ldyBBcnJheSh0b3RhbEJsb2NrcyksbnVtUmVzdWx0QmxvY2tzPTAsaj0wO2o8ZWNCbG9ja0FycmF5Lmxlbmd0aDtqKyspZm9yKHZhciBlY0Jsb2NrPWVjQmxvY2tBcnJheVtqXSxpPTA7aTxlY0Jsb2NrLkNvdW50O2krKyl7dmFyIG51bURhdGFDb2Rld29yZHM9ZWNCbG9jay5EYXRhQ29kZXdvcmRzLG51bUJsb2NrQ29kZXdvcmRzPWVjQmxvY2tzLkVDQ29kZXdvcmRzUGVyQmxvY2srbnVtRGF0YUNvZGV3b3JkcztyZXN1bHRbbnVtUmVzdWx0QmxvY2tzKytdPW5ldyBEYXRhQmxvY2sobnVtRGF0YUNvZGV3b3JkcyxuZXcgQXJyYXkobnVtQmxvY2tDb2Rld29yZHMpKX1mb3IodmFyIHNob3J0ZXJCbG9ja3NUb3RhbENvZGV3b3Jkcz1yZXN1bHRbMF0uY29kZXdvcmRzLmxlbmd0aCxsb25nZXJCbG9ja3NTdGFydEF0PXJlc3VsdC5sZW5ndGgtMTtsb25nZXJCbG9ja3NTdGFydEF0Pj0wOyl7dmFyIG51bUNvZGV3b3Jkcz1yZXN1bHRbbG9uZ2VyQmxvY2tzU3RhcnRBdF0uY29kZXdvcmRzLmxlbmd0aDtpZihudW1Db2Rld29yZHM9PXNob3J0ZXJCbG9ja3NUb3RhbENvZGV3b3JkcylicmVhaztsb25nZXJCbG9ja3NTdGFydEF0LS19bG9uZ2VyQmxvY2tzU3RhcnRBdCsrO2Zvcih2YXIgc2hvcnRlckJsb2Nrc051bURhdGFDb2Rld29yZHM9c2hvcnRlckJsb2Nrc1RvdGFsQ29kZXdvcmRzLWVjQmxvY2tzLkVDQ29kZXdvcmRzUGVyQmxvY2sscmF3Q29kZXdvcmRzT2Zmc2V0PTAsaT0wO3Nob3J0ZXJCbG9ja3NOdW1EYXRhQ29kZXdvcmRzPmk7aSsrKWZvcih2YXIgaj0wO251bVJlc3VsdEJsb2Nrcz5qO2orKylyZXN1bHRbal0uY29kZXdvcmRzW2ldPXJhd0NvZGV3b3Jkc1tyYXdDb2Rld29yZHNPZmZzZXQrK107Zm9yKHZhciBqPWxvbmdlckJsb2Nrc1N0YXJ0QXQ7bnVtUmVzdWx0QmxvY2tzPmo7aisrKXJlc3VsdFtqXS5jb2Rld29yZHNbc2hvcnRlckJsb2Nrc051bURhdGFDb2Rld29yZHNdPXJhd0NvZGV3b3Jkc1tyYXdDb2Rld29yZHNPZmZzZXQrK107Zm9yKHZhciBtYXg9cmVzdWx0WzBdLmNvZGV3b3Jkcy5sZW5ndGgsaT1zaG9ydGVyQmxvY2tzTnVtRGF0YUNvZGV3b3JkczttYXg+aTtpKyspZm9yKHZhciBqPTA7bnVtUmVzdWx0QmxvY2tzPmo7aisrKXt2YXIgaU9mZnNldD1sb25nZXJCbG9ja3NTdGFydEF0Pmo/aTppKzE7cmVzdWx0W2pdLmNvZGV3b3Jkc1tpT2Zmc2V0XT1yYXdDb2Rld29yZHNbcmF3Q29kZXdvcmRzT2Zmc2V0KytdfXJldHVybiByZXN1bHR9LERhdGFNYXNrPXt9LERhdGFNYXNrLmZvclJlZmVyZW5jZT1mdW5jdGlvbihyZWZlcmVuY2Upe2lmKDA+cmVmZXJlbmNlfHxyZWZlcmVuY2U+Nyl0aHJvd1wiU3lzdGVtLkFyZ3VtZW50RXhjZXB0aW9uXCI7cmV0dXJuIERhdGFNYXNrLkRBVEFfTUFTS1NbcmVmZXJlbmNlXX0sRGF0YU1hc2suREFUQV9NQVNLUz1uZXcgQXJyYXkobmV3IERhdGFNYXNrMDAwLG5ldyBEYXRhTWFzazAwMSxuZXcgRGF0YU1hc2swMTAsbmV3IERhdGFNYXNrMDExLG5ldyBEYXRhTWFzazEwMCxuZXcgRGF0YU1hc2sxMDEsbmV3IERhdGFNYXNrMTEwLG5ldyBEYXRhTWFzazExMSksR0YyNTYuUVJfQ09ERV9GSUVMRD1uZXcgR0YyNTYoMjg1KSxHRjI1Ni5EQVRBX01BVFJJWF9GSUVMRD1uZXcgR0YyNTYoMzAxKSxHRjI1Ni5hZGRPclN1YnRyYWN0PWZ1bmN0aW9uKGEsYil7cmV0dXJuIGFeYn0sRGVjb2Rlcj17fSxEZWNvZGVyLnJzRGVjb2Rlcj1uZXcgUmVlZFNvbG9tb25EZWNvZGVyKEdGMjU2LlFSX0NPREVfRklFTEQpLERlY29kZXIuY29ycmVjdEVycm9ycz1mdW5jdGlvbihjb2Rld29yZEJ5dGVzLG51bURhdGFDb2Rld29yZHMpe2Zvcih2YXIgbnVtQ29kZXdvcmRzPWNvZGV3b3JkQnl0ZXMubGVuZ3RoLGNvZGV3b3Jkc0ludHM9bmV3IEFycmF5KG51bUNvZGV3b3JkcyksaT0wO251bUNvZGV3b3Jkcz5pO2krKyljb2Rld29yZHNJbnRzW2ldPTI1NSZjb2Rld29yZEJ5dGVzW2ldO3ZhciBudW1FQ0NvZGV3b3Jkcz1jb2Rld29yZEJ5dGVzLmxlbmd0aC1udW1EYXRhQ29kZXdvcmRzO3RyeXtEZWNvZGVyLnJzRGVjb2Rlci5kZWNvZGUoY29kZXdvcmRzSW50cyxudW1FQ0NvZGV3b3Jkcyl9Y2F0Y2gocnNlKXt0aHJvdyByc2V9Zm9yKHZhciBpPTA7bnVtRGF0YUNvZGV3b3Jkcz5pO2krKyljb2Rld29yZEJ5dGVzW2ldPWNvZGV3b3Jkc0ludHNbaV19LERlY29kZXIuZGVjb2RlPWZ1bmN0aW9uKGJpdHMpe2Zvcih2YXIgcGFyc2VyPW5ldyBCaXRNYXRyaXhQYXJzZXIoYml0cyksdmVyc2lvbj1wYXJzZXIucmVhZFZlcnNpb24oKSxlY0xldmVsPXBhcnNlci5yZWFkRm9ybWF0SW5mb3JtYXRpb24oKS5FcnJvckNvcnJlY3Rpb25MZXZlbCxjb2Rld29yZHM9cGFyc2VyLnJlYWRDb2Rld29yZHMoKSxkYXRhQmxvY2tzPURhdGFCbG9jay5nZXREYXRhQmxvY2tzKGNvZGV3b3Jkcyx2ZXJzaW9uLGVjTGV2ZWwpLHRvdGFsQnl0ZXM9MCxpPTA7aTxkYXRhQmxvY2tzLkxlbmd0aDtpKyspdG90YWxCeXRlcys9ZGF0YUJsb2Nrc1tpXS5OdW1EYXRhQ29kZXdvcmRzO2Zvcih2YXIgcmVzdWx0Qnl0ZXM9bmV3IEFycmF5KHRvdGFsQnl0ZXMpLHJlc3VsdE9mZnNldD0wLGo9MDtqPGRhdGFCbG9ja3MubGVuZ3RoO2orKyl7dmFyIGRhdGFCbG9jaz1kYXRhQmxvY2tzW2pdLGNvZGV3b3JkQnl0ZXM9ZGF0YUJsb2NrLkNvZGV3b3JkcyxudW1EYXRhQ29kZXdvcmRzPWRhdGFCbG9jay5OdW1EYXRhQ29kZXdvcmRzO0RlY29kZXIuY29ycmVjdEVycm9ycyhjb2Rld29yZEJ5dGVzLG51bURhdGFDb2Rld29yZHMpO2Zvcih2YXIgaT0wO251bURhdGFDb2Rld29yZHM+aTtpKyspcmVzdWx0Qnl0ZXNbcmVzdWx0T2Zmc2V0KytdPWNvZGV3b3JkQnl0ZXNbaV19dmFyIHJlYWRlcj1uZXcgUVJDb2RlRGF0YUJsb2NrUmVhZGVyKHJlc3VsdEJ5dGVzLHZlcnNpb24uVmVyc2lvbk51bWJlcixlY0xldmVsLkJpdHMpO3JldHVybiByZWFkZXJ9LHFyY29kZT17fSxxcmNvZGUuaW1hZ2VkYXRhPW51bGwscXJjb2RlLndpZHRoPTAscXJjb2RlLmhlaWdodD0wLHFyY29kZS5xckNvZGVTeW1ib2w9bnVsbCxxcmNvZGUuZGVidWc9ITEscXJjb2RlLnNpemVPZkRhdGFMZW5ndGhJbmZvPVtbMTAsOSw4LDhdLFsxMiwxMSwxNiwxMF0sWzE0LDEzLDE2LDEyXV0scXJjb2RlLmNhbGxiYWNrPW51bGwscXJjb2RlLmRlY29kZT1mdW5jdGlvbihzcmMpe2lmKDA9PWFyZ3VtZW50cy5sZW5ndGgpe3ZhciBjYW52YXNfcXI9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxci1jYW52YXNcIiksY29udGV4dD1jYW52YXNfcXIuZ2V0Q29udGV4dChcIjJkXCIpO3JldHVybiBxcmNvZGUud2lkdGg9Y2FudmFzX3FyLndpZHRoLHFyY29kZS5oZWlnaHQ9Y2FudmFzX3FyLmhlaWdodCxxcmNvZGUuaW1hZ2VkYXRhPWNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsMCxxcmNvZGUud2lkdGgscXJjb2RlLmhlaWdodCkscXJjb2RlLnJlc3VsdD1xcmNvZGUucHJvY2Vzcyhjb250ZXh0KSxudWxsIT1xcmNvZGUuY2FsbGJhY2smJnFyY29kZS5jYWxsYmFjayhxcmNvZGUucmVzdWx0KSxxcmNvZGUucmVzdWx0fXZhciBpbWFnZT1uZXcgSW1hZ2U7aW1hZ2Uub25sb2FkPWZ1bmN0aW9uKCl7dmFyIGNhbnZhc19xcj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLGNvbnRleHQ9Y2FudmFzX3FyLmdldENvbnRleHQoXCIyZFwiKSxjYW52YXNfb3V0PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3V0LWNhbnZhc1wiKTtpZihudWxsIT1jYW52YXNfb3V0KXt2YXIgb3V0Y3R4PWNhbnZhc19vdXQuZ2V0Q29udGV4dChcIjJkXCIpO291dGN0eC5jbGVhclJlY3QoMCwwLDMyMCwyNDApLG91dGN0eC5kcmF3SW1hZ2UoaW1hZ2UsMCwwLDMyMCwyNDApfWNhbnZhc19xci53aWR0aD1pbWFnZS53aWR0aCxjYW52YXNfcXIuaGVpZ2h0PWltYWdlLmhlaWdodCxjb250ZXh0LmRyYXdJbWFnZShpbWFnZSwwLDApLHFyY29kZS53aWR0aD1pbWFnZS53aWR0aCxxcmNvZGUuaGVpZ2h0PWltYWdlLmhlaWdodDt0cnl7cXJjb2RlLmltYWdlZGF0YT1jb250ZXh0LmdldEltYWdlRGF0YSgwLDAsaW1hZ2Uud2lkdGgsaW1hZ2UuaGVpZ2h0KX1jYXRjaChlKXtyZXR1cm4gcXJjb2RlLnJlc3VsdD1cIkNyb3NzIGRvbWFpbiBpbWFnZSByZWFkaW5nIG5vdCBzdXBwb3J0ZWQgaW4geW91ciBicm93c2VyISBTYXZlIGl0IHRvIHlvdXIgY29tcHV0ZXIgdGhlbiBkcmFnIGFuZCBkcm9wIHRoZSBmaWxlIVwiLHZvaWQobnVsbCE9cXJjb2RlLmNhbGxiYWNrJiZxcmNvZGUuY2FsbGJhY2socXJjb2RlLnJlc3VsdCkpfXRyeXtxcmNvZGUucmVzdWx0PXFyY29kZS5wcm9jZXNzKGNvbnRleHQpfWNhdGNoKGUpe2NvbnNvbGUubG9nKGUpLHFyY29kZS5yZXN1bHQ9XCJlcnJvciBkZWNvZGluZyBRUiBDb2RlXCJ9bnVsbCE9cXJjb2RlLmNhbGxiYWNrJiZxcmNvZGUuY2FsbGJhY2socXJjb2RlLnJlc3VsdCl9LGltYWdlLnNyYz1zcmN9LHFyY29kZS5kZWNvZGVfdXRmOD1mdW5jdGlvbihzKXtyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVzY2FwZShzKSl9LHFyY29kZS5wcm9jZXNzPWZ1bmN0aW9uKGN0eCl7dmFyIHN0YXJ0PShuZXcgRGF0ZSkuZ2V0VGltZSgpLGltYWdlPXFyY29kZS5ncmF5U2NhbGVUb0JpdG1hcChxcmNvZGUuZ3JheXNjYWxlKCkpO2lmKHFyY29kZS5kZWJ1Zyl7Zm9yKHZhciB5PTA7eTxxcmNvZGUuaGVpZ2h0O3krKylmb3IodmFyIHg9MDt4PHFyY29kZS53aWR0aDt4Kyspe3ZhciBwb2ludD00KngreSpxcmNvZGUud2lkdGgqNDtxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbcG9pbnRdPShpbWFnZVt4K3kqcXJjb2RlLndpZHRoXSwwKSxxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbcG9pbnQrMV09KGltYWdlW3greSpxcmNvZGUud2lkdGhdLDApLHFyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludCsyXT1pbWFnZVt4K3kqcXJjb2RlLndpZHRoXT8yNTU6MH1jdHgucHV0SW1hZ2VEYXRhKHFyY29kZS5pbWFnZWRhdGEsMCwwKX12YXIgZGV0ZWN0b3I9bmV3IERldGVjdG9yKGltYWdlKSxxUkNvZGVNYXRyaXg9ZGV0ZWN0b3IuZGV0ZWN0KCk7cXJjb2RlLmRlYnVnJiZjdHgucHV0SW1hZ2VEYXRhKHFyY29kZS5pbWFnZWRhdGEsMCwwKTtmb3IodmFyIHJlYWRlcj1EZWNvZGVyLmRlY29kZShxUkNvZGVNYXRyaXguYml0cyksZGF0YT1yZWFkZXIuRGF0YUJ5dGUsc3RyPVwiXCIsaT0wO2k8ZGF0YS5sZW5ndGg7aSsrKWZvcih2YXIgaj0wO2o8ZGF0YVtpXS5sZW5ndGg7aisrKXN0cis9U3RyaW5nLmZyb21DaGFyQ29kZShkYXRhW2ldW2pdKTt2YXIgZW5kPShuZXcgRGF0ZSkuZ2V0VGltZSgpLHRpbWU9ZW5kLXN0YXJ0O3JldHVybiBjb25zb2xlLmxvZyh0aW1lKSxxcmNvZGUuZGVjb2RlX3V0Zjgoc3RyKX0scXJjb2RlLmdldFBpeGVsPWZ1bmN0aW9uKHgseSl7aWYocXJjb2RlLndpZHRoPHgpdGhyb3dcInBvaW50IGVycm9yXCI7aWYocXJjb2RlLmhlaWdodDx5KXRocm93XCJwb2ludCBlcnJvclwiO3JldHVybiBwb2ludD00KngreSpxcmNvZGUud2lkdGgqNCxwPSgzMypxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbcG9pbnRdKzM0KnFyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludCsxXSszMypxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbcG9pbnQrMl0pLzEwMCxwfSxxcmNvZGUuYmluYXJpemU9ZnVuY3Rpb24odGgpe2Zvcih2YXIgcmV0PW5ldyBBcnJheShxcmNvZGUud2lkdGgqcXJjb2RlLmhlaWdodCkseT0wO3k8cXJjb2RlLmhlaWdodDt5KyspZm9yKHZhciB4PTA7eDxxcmNvZGUud2lkdGg7eCsrKXt2YXIgZ3JheT1xcmNvZGUuZ2V0UGl4ZWwoeCx5KTtyZXRbeCt5KnFyY29kZS53aWR0aF09dGg+PWdyYXk/ITA6ITF9cmV0dXJuIHJldH0scXJjb2RlLmdldE1pZGRsZUJyaWdodG5lc3NQZXJBcmVhPWZ1bmN0aW9uKGltYWdlKXtmb3IodmFyIG51bVNxcnRBcmVhPTQsYXJlYVdpZHRoPU1hdGguZmxvb3IocXJjb2RlLndpZHRoL251bVNxcnRBcmVhKSxhcmVhSGVpZ2h0PU1hdGguZmxvb3IocXJjb2RlLmhlaWdodC9udW1TcXJ0QXJlYSksbWlubWF4PW5ldyBBcnJheShudW1TcXJ0QXJlYSksaT0wO251bVNxcnRBcmVhPmk7aSsrKXttaW5tYXhbaV09bmV3IEFycmF5KG51bVNxcnRBcmVhKTtmb3IodmFyIGkyPTA7bnVtU3FydEFyZWE+aTI7aTIrKyltaW5tYXhbaV1baTJdPW5ldyBBcnJheSgwLDApfWZvcih2YXIgYXk9MDtudW1TcXJ0QXJlYT5heTtheSsrKWZvcih2YXIgYXg9MDtudW1TcXJ0QXJlYT5heDtheCsrKXttaW5tYXhbYXhdW2F5XVswXT0yNTU7Zm9yKHZhciBkeT0wO2FyZWFIZWlnaHQ+ZHk7ZHkrKylmb3IodmFyIGR4PTA7YXJlYVdpZHRoPmR4O2R4Kyspe3ZhciB0YXJnZXQ9aW1hZ2VbYXJlYVdpZHRoKmF4K2R4KyhhcmVhSGVpZ2h0KmF5K2R5KSpxcmNvZGUud2lkdGhdO3RhcmdldDxtaW5tYXhbYXhdW2F5XVswXSYmKG1pbm1heFtheF1bYXldWzBdPXRhcmdldCksdGFyZ2V0Pm1pbm1heFtheF1bYXldWzFdJiYobWlubWF4W2F4XVtheV1bMV09dGFyZ2V0KX19Zm9yKHZhciBtaWRkbGU9bmV3IEFycmF5KG51bVNxcnRBcmVhKSxpMz0wO251bVNxcnRBcmVhPmkzO2kzKyspbWlkZGxlW2kzXT1uZXcgQXJyYXkobnVtU3FydEFyZWEpO2Zvcih2YXIgYXk9MDtudW1TcXJ0QXJlYT5heTtheSsrKWZvcih2YXIgYXg9MDtudW1TcXJ0QXJlYT5heDtheCsrKW1pZGRsZVtheF1bYXldPU1hdGguZmxvb3IoKG1pbm1heFtheF1bYXldWzBdK21pbm1heFtheF1bYXldWzFdKS8yKTtyZXR1cm4gbWlkZGxlfSxxcmNvZGUuZ3JheVNjYWxlVG9CaXRtYXA9ZnVuY3Rpb24oZ3JheVNjYWxlKXtmb3IodmFyIG1pZGRsZT1xcmNvZGUuZ2V0TWlkZGxlQnJpZ2h0bmVzc1BlckFyZWEoZ3JheVNjYWxlKSxzcXJ0TnVtQXJlYT1taWRkbGUubGVuZ3RoLGFyZWFXaWR0aD1NYXRoLmZsb29yKHFyY29kZS53aWR0aC9zcXJ0TnVtQXJlYSksYXJlYUhlaWdodD1NYXRoLmZsb29yKHFyY29kZS5oZWlnaHQvc3FydE51bUFyZWEpLGJpdG1hcD1uZXcgQXJyYXkocXJjb2RlLmhlaWdodCpxcmNvZGUud2lkdGgpLGF5PTA7c3FydE51bUFyZWE+YXk7YXkrKylmb3IodmFyIGF4PTA7c3FydE51bUFyZWE+YXg7YXgrKylmb3IodmFyIGR5PTA7YXJlYUhlaWdodD5keTtkeSsrKWZvcih2YXIgZHg9MDthcmVhV2lkdGg+ZHg7ZHgrKyliaXRtYXBbYXJlYVdpZHRoKmF4K2R4KyhhcmVhSGVpZ2h0KmF5K2R5KSpxcmNvZGUud2lkdGhdPWdyYXlTY2FsZVthcmVhV2lkdGgqYXgrZHgrKGFyZWFIZWlnaHQqYXkrZHkpKnFyY29kZS53aWR0aF08bWlkZGxlW2F4XVtheV0/ITA6ITE7XG4gICAgcmV0dXJuIGJpdG1hcH0scXJjb2RlLmdyYXlzY2FsZT1mdW5jdGlvbigpe2Zvcih2YXIgcmV0PW5ldyBBcnJheShxcmNvZGUud2lkdGgqcXJjb2RlLmhlaWdodCkseT0wO3k8cXJjb2RlLmhlaWdodDt5KyspZm9yKHZhciB4PTA7eDxxcmNvZGUud2lkdGg7eCsrKXt2YXIgZ3JheT1xcmNvZGUuZ2V0UGl4ZWwoeCx5KTtyZXRbeCt5KnFyY29kZS53aWR0aF09Z3JheX1yZXR1cm4gcmV0fSxBcnJheS5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKGZyb20sdG8pe3ZhciByZXN0PXRoaXMuc2xpY2UoKHRvfHxmcm9tKSsxfHx0aGlzLmxlbmd0aCk7cmV0dXJuIHRoaXMubGVuZ3RoPTA+ZnJvbT90aGlzLmxlbmd0aCtmcm9tOmZyb20sdGhpcy5wdXNoLmFwcGx5KHRoaXMscmVzdCl9O3ZhciBNSU5fU0tJUD0zLE1BWF9NT0RVTEVTPTU3LElOVEVHRVJfTUFUSF9TSElGVD04LENFTlRFUl9RVU9SVU09MjtxcmNvZGUub3JkZXJCZXN0UGF0dGVybnM9ZnVuY3Rpb24ocGF0dGVybnMpe2Z1bmN0aW9uIGRpc3RhbmNlKHBhdHRlcm4xLHBhdHRlcm4yKXtyZXR1cm4geERpZmY9cGF0dGVybjEuWC1wYXR0ZXJuMi5YLHlEaWZmPXBhdHRlcm4xLlktcGF0dGVybjIuWSxNYXRoLnNxcnQoeERpZmYqeERpZmYreURpZmYqeURpZmYpfWZ1bmN0aW9uIGNyb3NzUHJvZHVjdFoocG9pbnRBLHBvaW50Qixwb2ludEMpe3ZhciBiWD1wb2ludEIueCxiWT1wb2ludEIueTtyZXR1cm4ocG9pbnRDLngtYlgpKihwb2ludEEueS1iWSktKHBvaW50Qy55LWJZKSoocG9pbnRBLngtYlgpfXZhciBwb2ludEEscG9pbnRCLHBvaW50Qyx6ZXJvT25lRGlzdGFuY2U9ZGlzdGFuY2UocGF0dGVybnNbMF0scGF0dGVybnNbMV0pLG9uZVR3b0Rpc3RhbmNlPWRpc3RhbmNlKHBhdHRlcm5zWzFdLHBhdHRlcm5zWzJdKSx6ZXJvVHdvRGlzdGFuY2U9ZGlzdGFuY2UocGF0dGVybnNbMF0scGF0dGVybnNbMl0pO2lmKG9uZVR3b0Rpc3RhbmNlPj16ZXJvT25lRGlzdGFuY2UmJm9uZVR3b0Rpc3RhbmNlPj16ZXJvVHdvRGlzdGFuY2U/KHBvaW50Qj1wYXR0ZXJuc1swXSxwb2ludEE9cGF0dGVybnNbMV0scG9pbnRDPXBhdHRlcm5zWzJdKTp6ZXJvVHdvRGlzdGFuY2U+PW9uZVR3b0Rpc3RhbmNlJiZ6ZXJvVHdvRGlzdGFuY2U+PXplcm9PbmVEaXN0YW5jZT8ocG9pbnRCPXBhdHRlcm5zWzFdLHBvaW50QT1wYXR0ZXJuc1swXSxwb2ludEM9cGF0dGVybnNbMl0pOihwb2ludEI9cGF0dGVybnNbMl0scG9pbnRBPXBhdHRlcm5zWzBdLHBvaW50Qz1wYXR0ZXJuc1sxXSksY3Jvc3NQcm9kdWN0Wihwb2ludEEscG9pbnRCLHBvaW50Qyk8MCl7dmFyIHRlbXA9cG9pbnRBO3BvaW50QT1wb2ludEMscG9pbnRDPXRlbXB9cGF0dGVybnNbMF09cG9pbnRBLHBhdHRlcm5zWzFdPXBvaW50QixwYXR0ZXJuc1syXT1wb2ludEN9OyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuZmFjdG9yeSgnQXV0aFNlcnZpY2UnLCBbXG4gICAgJyRodHRwJyxcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRzdGF0ZScsXG4gICAgJyR3aW5kb3cnLFxuICAgICdTZXNzaW9uJyxcbiAgICBmdW5jdGlvbigkaHR0cCwgJHJvb3RTY29wZSwgJHN0YXRlLCAkd2luZG93LCBTZXNzaW9uKSB7XG4gICAgICB2YXIgYXV0aFNlcnZpY2UgPSB7fTtcblxuICAgICAgZnVuY3Rpb24gbG9naW5TdWNjZXNzKGRhdGEsIGNiLCB2b2x1bnRlZXIpe1xuICAgICAgICAvLyBXaW5uZXIgd2lubmVyIHlvdSBnZXQgYSB0b2tlblxuICAgICAgICBpZighdm9sdW50ZWVyKSB7U2Vzc2lvbi5jcmVhdGUoZGF0YS50b2tlbiwgZGF0YS51c2VyKTt9XG5cbiAgICAgICAgaWYgKGNiKXtcbiAgICAgICAgICBjYihkYXRhLnVzZXIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGxvZ2luRmFpbHVyZShkYXRhLCBjYiwgdm9sdW50ZWVyKXtcbiAgICAgICAgaWYoIXZvbHVudGVlcikgeyRzdGF0ZS5nbygnaG9tZScpO31cbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY2IoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYXV0aFNlcnZpY2UubG9naW5XaXRoUGFzc3dvcmQgPSBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9sb2dpbicsIHtcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgbG9naW5TdWNjZXNzKHJlc3BvbnNlLmRhdGEsIG9uU3VjY2Vzcyk7XG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgbG9naW5GYWlsdXJlKHJlc3BvbnNlLmRhdGEsIG9uRmFpbHVyZSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS5sb2dpbldpdGhUb2tlbiA9IGZ1bmN0aW9uKHRva2VuLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSl7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9sb2dpbicsIHtcbiAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgbG9naW5TdWNjZXNzKHJlc3BvbnNlLmRhdGEsIG9uU3VjY2Vzcyk7XG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAwKSB7XG4gICAgICAgICAgICAgIFNlc3Npb24uZGVzdHJveShsb2dpbkZhaWx1cmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2UubG9nb3V0ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgLy8gQ2xlYXIgdGhlIHNlc3Npb25cbiAgICAgICAgU2Vzc2lvbi5kZXN0cm95KGNhbGxiYWNrKTtcbiAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS5yZWdpc3RlciA9IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZCwgb25TdWNjZXNzLCBvbkZhaWx1cmUgLHZvbHVudGVlcikge1xuICAgICAgICByZXR1cm4gJGh0dHBcbiAgICAgICAgICAucG9zdCgnL2F1dGgvcmVnaXN0ZXInLCB7XG4gICAgICAgICAgICBlbWFpbDogZW1haWwsXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQsXG4gICAgICAgICAgICB2b2x1bnRlZXI6IHZvbHVudGVlcixcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGxvZ2luU3VjY2VzcyhyZXNwb25zZS5kYXRhLCBvblN1Y2Nlc3MsIHZvbHVudGVlcik7XG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgbG9naW5GYWlsdXJlKHJlc3BvbnNlLmRhdGEsIG9uRmFpbHVyZSwgdm9sdW50ZWVyKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGF1dGhTZXJ2aWNlLnZlcmlmeSA9IGZ1bmN0aW9uKHRva2VuLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xuICAgICAgICByZXR1cm4gJGh0dHBcbiAgICAgICAgICAuZ2V0KCcvYXV0aC92ZXJpZnkvJyArIHRva2VuKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0VXNlcihyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgIGlmIChvblN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgb25TdWNjZXNzKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGlmIChvbkZhaWx1cmUpIHtcbiAgICAgICAgICAgICAgb25GYWlsdXJlKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2UucmVzZW5kVmVyaWZpY2F0aW9uRW1haWwgPSBmdW5jdGlvbihvblN1Y2Nlc3MsIG9uRmFpbHVyZSl7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5wb3N0KCcvYXV0aC92ZXJpZnkvcmVzZW5kJywge1xuICAgICAgICAgICAgaWQ6IFNlc3Npb24uZ2V0VXNlcklkKClcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGF1dGhTZXJ2aWNlLnNlbmRSZXNldEVtYWlsID0gZnVuY3Rpb24oZW1haWwpe1xuICAgICAgICByZXR1cm4gJGh0dHBcbiAgICAgICAgICAucG9zdCgnL2F1dGgvcmVzZXQnLCB7XG4gICAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGF1dGhTZXJ2aWNlLnJlc2V0UGFzc3dvcmQgPSBmdW5jdGlvbih0b2tlbiwgcGFzcywgb25TdWNjZXNzLCBvbkZhaWx1cmUpe1xuICAgICAgICByZXR1cm4gJGh0dHBcbiAgICAgICAgICAucG9zdCgnL2F1dGgvcmVzZXQvcGFzc3dvcmQnLCB7XG4gICAgICAgICAgICB0b2tlbjogdG9rZW4sXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4ob25TdWNjZXNzLCBvbkZhaWx1cmUpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIGF1dGhTZXJ2aWNlO1xuICAgIH1cbiAgXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJykuZmFjdG9yeShcIkNoYWxsZW5nZVNlcnZpY2VcIiwgW1xuICAgIFwiJGh0dHBcIixcbiAgICBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgdmFyIGNoYWxsZW5nZXMgPSBcIi9hcGkvY2hhbGxlbmdlc1wiO1xuICAgICAgdmFyIGJhc2UgPSBjaGFsbGVuZ2VzICsgXCIvXCI7XG4gIFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBCYXNpYyBBY3Rpb25zXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uKGNEYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChjaGFsbGVuZ2VzICsgXCIvY3JlYXRlXCIsIHtcbiAgICAgICAgICAgICAgY0RhdGE6IGNEYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuXG5cbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihpZCwgY0RhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3VwZGF0ZVwiLCB7XG4gICAgICAgICAgICAgIGNEYXRhOiBjRGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcblxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlbW92ZVwiKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZCk7XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRBbnN3ZXI6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQgKyBcIi9hbnN3ZXJcIik7XG4gICAgICAgIH0sXG5cbiAgXG4gICAgICB9O1xuICAgIH1cbiAgXSk7XG4gICIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKS5mYWN0b3J5KFwiTWFya2V0aW5nU2VydmljZVwiLCBbXG4gICAgXCIkaHR0cFwiLFxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICB2YXIgbWFya2V0aW5nID0gXCIvYXBpL21hcmtldGluZ1wiO1xuICAgICAgdmFyIGJhc2UgPSBtYXJrZXRpbmcgKyBcIi9cIjtcbiAgXG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEJhc2ljIEFjdGlvbnNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIGNyZWF0ZVRlYW06IGZ1bmN0aW9uKHRlYW1EYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChtYXJrZXRpbmcgKyBcIi9jcmVhdGVUZWFtXCIsIHtcbiAgICAgICAgICAgICAgdGVhbURhdGE6IHRlYW1EYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgZ2V0QWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2VuZEZyaWVuZEludml0ZTogZnVuY3Rpb24odXNlcm5hbWUsdGVhbW1hdGUpe1xuICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KG1hcmtldGluZyArIFwiL3NlbmRJbnZpdGVcIiwge1xuICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgdGVhbW1hdGU6IHRlYW1tYXRlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgXG4gICAgICB9O1xuICAgIH1cbiAgXSk7XG4gICIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKSBcbiAgLmZhY3RvcnkoJ1NldHRpbmdzU2VydmljZScsIFtcbiAgJyRodHRwJyxcbiAgZnVuY3Rpb24oJGh0dHApe1xuXG4gICAgdmFyIGJhc2UgPSAnL2FwaS9zZXR0aW5ncy8nO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFB1YmxpY1NldHRpbmdzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVJlZ2lzdHJhdGlvblRpbWVzOiBmdW5jdGlvbihvcGVuLCBjbG9zZSl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICd0aW1lcycsIHtcbiAgICAgICAgICB0aW1lT3Blbjogb3BlbixcbiAgICAgICAgICB0aW1lQ2xvc2U6IGNsb3NlLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVDb25maXJtYXRpb25UaW1lOiBmdW5jdGlvbih0aW1lKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2NvbmZpcm0tYnknLCB7XG4gICAgICAgICAgdGltZTogdGltZVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVTdGFydFRpbWU6IGZ1bmN0aW9uKHRpbWUpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAndGltZVN0YXJ0Jywge1xuICAgICAgICAgIHRpbWU6IHRpbWVcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZ2V0V2hpdGVsaXN0ZWRFbWFpbHM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArICd3aGl0ZWxpc3QnKTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVXaGl0ZWxpc3RlZEVtYWlsczogZnVuY3Rpb24oZW1haWxzKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ3doaXRlbGlzdCcsIHtcbiAgICAgICAgICBlbWFpbHM6IGVtYWlsc1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVXYWl0bGlzdFRleHQ6IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnd2FpdGxpc3QnLCB7XG4gICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVBY2NlcHRhbmNlVGV4dDogZnVuY3Rpb24odGV4dCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICdhY2NlcHRhbmNlJywge1xuICAgICAgICAgIHRleHQ6IHRleHRcbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICB1cGRhdGVIb3N0U2Nob29sOiBmdW5jdGlvbihob3N0U2Nob29sKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2hvc3RTY2hvb2wnLCB7XG4gICAgICAgICAgaG9zdFNjaG9vbDogaG9zdFNjaG9vbFxuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIHVwZGF0ZUNvbmZpcm1hdGlvblRleHQ6IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnY29uZmlybWF0aW9uJywge1xuICAgICAgICAgIHRleHQ6IHRleHRcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgdXBkYXRlQWxsb3dNaW5vcnM6IGZ1bmN0aW9uKGFsbG93TWlub3JzKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ21pbm9ycycsIHsgXG4gICAgICAgICAgYWxsb3dNaW5vcnM6IGFsbG93TWlub3JzIFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfTtcblxuICB9XG4gIF0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpLmZhY3RvcnkoXCJTb2x2ZWRDVEZTZXJ2aWNlXCIsIFtcbiAgICBcIiRodHRwXCIsXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgIHZhciBDVEYgPSBcIi9hcGkvQ1RGXCI7XG4gICAgICB2YXIgYmFzZSA9IENURiArIFwiL1wiO1xuICBcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBCYXNpYyBBY3Rpb25zXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBzb2x2ZTogZnVuY3Rpb24oY2hhbGxlbmdlLCB1c2VyLCBhbnN3ZXIsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChDVEYgKyBcIi9zb2x2ZVwiLCB7XG4gICAgICAgICAgICAgICAgY2hhbGxlbmdlOiBjaGFsbGVuZ2UsIFxuICAgICAgICAgICAgICAgIHVzZXIgOiB1c2VyLFxuICAgICAgICAgICAgICAgIGFuc3dlciA6IGFuc3dlcixcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgIG9uU3VjY2VzcyhjaGFsbGVuZ2UpO1xuICAgICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICBvbkZhaWx1cmUocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgZ2V0QWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoQ1RGKTtcbiAgICAgICAgfSxcbiAgICBcbiAgICAgIH07XG4gICAgfVxuICBdKTtcbiAgIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpLmZhY3RvcnkoXCJUZWFtU2VydmljZVwiLCBbXG4gICAgXCIkaHR0cFwiLFxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICB2YXIgdGVhbXMgPSBcIi9hcGkvdGVhbXNcIjtcbiAgICAgIHZhciBiYXNlID0gdGVhbXMgKyBcIi9cIjtcbiAgXG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEJhc2ljIEFjdGlvbnNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24odGVhbURhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHRlYW1zICsgXCIvY3JlYXRlXCIsIHtcbiAgICAgICAgICAgICAgdGVhbURhdGE6IHRlYW1EYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihpZCwgY0RhdGEpIHtcbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi91cGRhdGVcIiwge1xuICAgICAgICAgICAgY0RhdGE6IGNEYXRhXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgam9pbjogZnVuY3Rpb24oaWQsIG5ld3VzZXIpIHtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZClcbiAgICAgICAgICAudGhlbih0ZWFtID0+IHtcbiAgICAgICAgICAgIHRlYW0uZGF0YS5qb2luUmVxdWVzdHMucHVzaChuZXd1c2VyKVxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdXBkYXRlam9pbmVkXCIsIHtcbiAgICAgICAgICAgICAgbmV3am9pblJlcXVlc3RzOiB0ZWFtLmRhdGEuam9pblJlcXVlc3RzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZWpvaW46IGZ1bmN0aW9uKGlkLCBpbmRleCwgdXNlcikge1xuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIGlkKVxuICAgICAgICAgIC50aGVuKHRlYW0gPT4ge1xuICAgICAgICAgICAgdGVhbS5kYXRhLmpvaW5SZXF1ZXN0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgaWYgKCEodXNlcj09ZmFsc2UpKXtcbiAgICAgICAgICAgICAgJGh0dHAucG9zdCh0ZWFtcyArIFwiL3NlbmRSZWZ1c2VkVGVhbVwiLCB7XG4gICAgICAgICAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdXBkYXRlam9pbmVkXCIsIHtcbiAgICAgICAgICAgICAgbmV3am9pblJlcXVlc3RzOiB0ZWFtLmRhdGEuam9pblJlcXVlc3RzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuXG4gICAgICAgIGFjY2VwdE1lbWJlcjogZnVuY3Rpb24oaWQsIG5ld3VzZXIsbWF4VGVhbVNpemUpIHtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZClcbiAgICAgICAgICAudGhlbih0ZWFtID0+IHtcbiAgICAgICAgICAgIGlmICh0ZWFtLmRhdGEubWVtYmVycy5sZW5ndGg+PW1heFRlYW1TaXplKXsgcmV0dXJuICdtYXhUZWFtU2l6ZScgfVxuXG4gICAgICAgICAgICB0ZWFtLmRhdGEubWVtYmVycy5wdXNoKG5ld3VzZXIpXG4gICAgICAgICAgICAkaHR0cC5wb3N0KHRlYW1zICsgXCIvc2VuZEFjY2VwdGVkVGVhbVwiLCB7XG4gICAgICAgICAgICAgIGlkOiBuZXd1c2VyLmlkLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi91cGRhdGVNZW1iZXJzXCIsIHtcbiAgICAgICAgICAgICAgbmV3TWVtYmVyczogdGVhbS5kYXRhLm1lbWJlcnMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZW1lbWJlcjogZnVuY3Rpb24oaWQsIGluZGV4LCB1c2VySUQpIHtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZClcbiAgICAgICAgICAudGhlbih0ZWFtID0+IHtcbiAgICAgICAgICAgIHZhciByZW1vdmVkVXNlciA9IHRlYW0uZGF0YS5tZW1iZXJzW2luZGV4XVxuICAgICAgICAgICAgaWYgKGluZGV4PT0wKXtyZXR1cm4gXCJyZW1vdmluZ0FkbWluXCJ9XG4gICAgICAgICAgICB0ZWFtLmRhdGEubWVtYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgaWYgKCF1c2VySUQpe1xuICAgICAgICAgICAgICAkaHR0cC5wb3N0KHRlYW1zICsgXCIvc2VuZEFkbWluUmVtb3ZlZFRlYW1cIiwge1xuICAgICAgICAgICAgICAgIGlkOiB0ZWFtLmRhdGEubWVtYmVyc1swXS5pZCxcbiAgICAgICAgICAgICAgICBtZW1iZXI6IHJlbW92ZWRVc2VyLm5hbWVcbiAgICAgICAgICAgICAgfSk7ICBcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAkaHR0cC5wb3N0KHRlYW1zICsgXCIvc2VuZFJlbW92ZWRUZWFtXCIsIHtcbiAgICAgICAgICAgICAgICBpZDogdXNlcklELFxuICAgICAgICAgICAgICB9KTsgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdXBkYXRlTWVtYmVyc1wiLCB7XG4gICAgICAgICAgICAgIG5ld01lbWJlcnM6IHRlYW0uZGF0YS5tZW1iZXJzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlbW92ZVwiKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpO1xuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgdG9nZ2xlQ2xvc2VUZWFtOiBmdW5jdGlvbihpZCwgc3RhdHVzKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdG9nZ2xlQ2xvc2VUZWFtXCIsIHtcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0U2VsZWN0ZWRUZWFtczogZnVuY3Rpb24odGV4dCxza2lsbHNGaWx0ZXJzKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCggdGVhbXMgKyBcIj9cIiArICQucGFyYW0oe1xuICAgICAgICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgICAgICAgc2VhcmNoOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNraWxsc0ZpbHRlcnM6IHNraWxsc0ZpbHRlcnMgPyBza2lsbHNGaWx0ZXJzIDoge31cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICApO1xuICAgICAgICB9LCBcbiAgXG5cblxuICAgICAgfTtcbiAgICB9XG4gIF0pO1xuICAiLCJhbmd1bGFyLm1vZHVsZShcInJlZ1wiKS5mYWN0b3J5KFwiVXNlclNlcnZpY2VcIiwgW1xuICBcIiRodHRwXCIsXG4gIFwiU2Vzc2lvblwiLFxuICBmdW5jdGlvbigkaHR0cCwgU2Vzc2lvbikge1xuICAgIHZhciB1c2VycyA9IFwiL2FwaS91c2Vyc1wiO1xuICAgIHZhciBiYXNlID0gdXNlcnMgKyBcIi9cIjtcblxuICAgIHJldHVybiB7XG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBCYXNpYyBBY3Rpb25zXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBnZXRDdXJyZW50VXNlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIFNlc3Npb24uZ2V0VXNlcklkKCkpO1xuICAgICAgfSxcblxuICAgICAgZ2V0OiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZCk7XG4gICAgICB9LFxuXG4gICAgICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xuICAgICAgfSxcblxuICAgICAgZ2V0UGFnZTogZnVuY3Rpb24ocGFnZSwgc2l6ZSwgdGV4dCxzdGF0dXNGaWx0ZXJzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoIHVzZXJzICsgXCI/XCIgKyAkLnBhcmFtKHtcbiAgICAgICAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgICAgICAgcGFnZTogcGFnZSA/IHBhZ2UgOiAwLFxuICAgICAgICAgICAgICBzaXplOiBzaXplID8gc2l6ZSA6IDIwLFxuICAgICAgICAgICAgICBzdGF0dXNGaWx0ZXJzOiBzdGF0dXNGaWx0ZXJzID8gc3RhdHVzRmlsdGVycyA6IHt9XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9LFxuXG4gICAgICB1cGRhdGVQcm9maWxlOiBmdW5jdGlvbihpZCwgcHJvZmlsZSkge1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyBpZCArIFwiL3Byb2ZpbGVcIiwge1xuICAgICAgICAgIHByb2ZpbGU6IHByb2ZpbGVcbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICB1cGRhdGVDb25maXJtYXRpb246IGZ1bmN0aW9uKGlkLCBjb25maXJtYXRpb24pIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgaWQgKyBcIi9jb25maXJtXCIsIHtcbiAgICAgICAgICBjb25maXJtYXRpb246IGNvbmZpcm1hdGlvblxuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIHVwZGF0ZUFsbDogZnVuY3Rpb24oaWQsIHVzZXIpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgaWQgKyBcIi91cGRhdGVhbGxcIiwge1xuICAgICAgICAgIHVzZXI6IHVzZXJcbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICBkZWNsaW5lQWRtaXNzaW9uOiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9kZWNsaW5lXCIpO1xuICAgICAgfSxcblxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gQWRtaW4gT25seVxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBnZXRTdGF0czogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIFwic3RhdHNcIik7XG4gICAgICB9LFxuXG4gICAgICBnZXRUZWFtU3RhdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBcInRlYW1TdGF0c1wiKTtcbiAgICAgIH0sXG5cbiAgICAgIGFkbWl0VXNlcjogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvYWRtaXRcIik7XG4gICAgICB9LFxuICAgICAgcmVqZWN0VXNlcjogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvcmVqZWN0XCIpO1xuICAgICAgfSxcbiAgICAgIHNvZnRBZG1pdHRVc2VyOiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9zb2Z0QWRtaXRcIik7XG4gICAgICB9LFxuXG4gICAgICBzb2Z0UmVqZWN0VXNlcjogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvc29mdFJlamVjdFwiKTtcbiAgICAgIH0sXG5cbiAgICAgIHNlbmRCYXNpY01haWw6IGZ1bmN0aW9uKGlkICwgZW1haWwpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvc2VuZEJhc2ljTWFpbFwiLEpTT04uc3RyaW5naWZ5KGVtYWlsKSk7XG4gICAgICB9LFxuXG4gICAgICBjaGVja0luOiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9jaGVja2luXCIpO1xuICAgICAgfSxcblxuICAgICAgY2hlY2tPdXQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL2NoZWNrb3V0XCIpO1xuICAgICAgfSxcblxuICAgICAgcmVtb3ZlVXNlcjogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvcmVtb3ZldXNlclwiKTtcbiAgICAgIH0sXG5cbiAgICAgIG1ha2VBZG1pbjogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvbWFrZWFkbWluXCIpO1xuICAgICAgfSxcblxuICAgICAgcmVtb3ZlQWRtaW46IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlbW92ZWFkbWluXCIpO1xuICAgICAgfSxcblxuICAgICAgbWFzc1JlamVjdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcIm1hc3NSZWplY3RcIik7XG4gICAgICB9LFxuXG4gICAgICBnZXRSZWplY3Rpb25Db3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIFwicmVqZWN0aW9uQ291bnRcIik7XG4gICAgICB9LFxuXG4gICAgICBnZXRMYXRlclJlamVjdGVkQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBcImxhdGVyUmVqZWN0Q291bnRcIik7XG4gICAgICB9LFxuXG4gICAgICBtYXNzUmVqZWN0UmVzdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcIm1hc3NSZWplY3RSZXN0XCIpO1xuICAgICAgfSxcblxuICAgICAgZ2V0UmVzdFJlamVjdGlvbkNvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgXCJyZWplY3Rpb25Db3VudFJlc3RcIik7XG4gICAgICB9LFxuXG4gICAgICByZWplY3Q6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlamVjdFwiKTtcbiAgICAgIH0sXG5cbiAgICAgIHNlbmRMYWdnZXJFbWFpbHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgXCJzZW5kbGFnZW1haWxzXCIpO1xuICAgICAgfSxcblxuICAgICAgc2VuZFJlamVjdEVtYWlsczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcInNlbmRSZWplY3RFbWFpbHNcIik7XG4gICAgICB9LFxuXG4gICAgICBzZW5kUmVqZWN0RW1haWxzUmVzdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcInNlbmRSZWplY3RFbWFpbHNSZXN0XCIpO1xuICAgICAgfSxcblxuICAgICAgc2VuZFJlamVjdEVtYWlsOiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZWplY3RFbWFpbFwiKTtcbiAgICAgIH0sXG5cbiAgICAgIHNlbmRQYXNzd29yZFJlc2V0RW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcInNlbmRSZXNldEVtYWlsXCIsIHsgZW1haWw6IGVtYWlsIH0pO1xuICAgICAgfSxcblxuXG5cbiAgICB9O1xuICB9XG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignYWRtaW5DaGFsbGVuZ2VDdHJsJyxbXG4gICAgJyRzY29wZScsXG4gICAgJyRodHRwJyxcbiAgICAnY2hhbGxlbmdlJyxcbiAgICAnQ2hhbGxlbmdlU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgY2hhbGxlbmdlLCBDaGFsbGVuZ2VTZXJ2aWNlKXtcbiAgICAgICRzY29wZS5zZWxlY3RlZGNoYWxsZW5nZSA9IGNoYWxsZW5nZS5kYXRhO1xuICAgICAgXG4gICAgICBDaGFsbGVuZ2VTZXJ2aWNlLmdldEFuc3dlcihjaGFsbGVuZ2UuZGF0YS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRjaGFsbGVuZ2UuYW5zd2VyID0gcmVzcG9uc2UuZGF0YS5hbnN3ZXI7XG4gICAgICB9KTtcblxuICAgICAgJHNjb3BlLnRvZ2dsZVBhc3N3b3JkID0gZnVuY3Rpb24gKCkgeyAkc2NvcGUudHlwZVBhc3N3b3JkID0gISRzY29wZS50eXBlUGFzc3dvcmQ7IH07XG5cblxuICAgICAgJHNjb3BlLnVwZGF0ZUNoYWxsZW5nZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIENoYWxsZW5nZVNlcnZpY2VcbiAgICAgICAgICAudXBkYXRlKCRzY29wZS5zZWxlY3RlZGNoYWxsZW5nZS5faWQsICRzY29wZS5zZWxlY3RlZGNoYWxsZW5nZSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAkc2VsZWN0ZWRjaGFsbGVuZ2UgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgc3dhbChcIlVwZGF0ZWQhXCIsIFwiQ2hhbGxlbmdlIHVwZGF0ZWQuXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBzd2FsKFwiT29wcywgeW91IGZvcmdvdCBzb21ldGhpbmcuXCIpO1xuICAgICAgICAgIH0pOyAgXG4gICAgICB9O1xuXG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoXCJyZWdcIikuY29udHJvbGxlcihcImFkbWluQ2hhbGxlbmdlc0N0cmxcIiwgW1xuICBcIiRzY29wZVwiLFxuICBcIiRzdGF0ZVwiLFxuICBcIiRzdGF0ZVBhcmFtc1wiLFxuICBcIkNoYWxsZW5nZVNlcnZpY2VcIixcbiAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgQ2hhbGxlbmdlU2VydmljZSkge1xuXG4gICAgJHNjb3BlLmNoYWxsZW5nZXMgPSBbXTtcblxuICAgIC8vIFNlbWFudGljLVVJIG1vdmVzIG1vZGFsIGNvbnRlbnQgaW50byBhIGRpbW1lciBhdCB0aGUgdG9wIGxldmVsLlxuICAgIC8vIFdoaWxlIHRoaXMgaXMgdXN1YWxseSBuaWNlLCBpdCBtZWFucyB0aGF0IHdpdGggb3VyIHJvdXRpbmcgd2lsbCBnZW5lcmF0ZVxuICAgIC8vIG11bHRpcGxlIG1vZGFscyBpZiB5b3UgY2hhbmdlIHN0YXRlLiBLaWxsIHRoZSB0b3AgbGV2ZWwgZGltbWVyIG5vZGUgb24gaW5pdGlhbCBsb2FkXG4gICAgLy8gdG8gcHJldmVudCB0aGlzLlxuICAgICQoXCIudWkuZGltbWVyXCIpLnJlbW92ZSgpO1xuICAgIC8vIFBvcHVsYXRlIHRoZSBzaXplIG9mIHRoZSBtb2RhbCBmb3Igd2hlbiBpdCBhcHBlYXJzLCB3aXRoIGFuIGFyYml0cmFyeSBDaGFsbGVuZ2UuXG5cbiAgICBmdW5jdGlvbiByZWZyZXNoUGFnZSgpIHtcbiAgICAgIENoYWxsZW5nZVNlcnZpY2UuZ2V0QWxsKCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICRzY29wZS5jaGFsbGVuZ2VzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlZnJlc2hQYWdlKCk7XG5cbiAgICAkc2NvcGUuZ29DaGFsbGVuZ2UgPSBmdW5jdGlvbigkZXZlbnQsIGNoYWxsZW5nZSkge1xuXG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAkc3RhdGUuZ28oXCJhcHAuYWRtaW4uY2hhbGxlbmdlXCIsIHtcbiAgICAgICAgaWQ6IGNoYWxsZW5nZS5faWRcbiAgICAgIH0pO1xuICAgIH1cblxuICAgICRzY29wZS5jcmVhdGVDaGFsbGVuZ2UgPSBmdW5jdGlvbigpIHtcblxuICAgICAgc3dhbChcIldyaXRlIHRoZSBjaGFsbGVuZ2UgdGl0bGU6XCIsIHtcbiAgICAgICAgYnV0dG9uczoge2NhbmNlbDoge3RleHQ6IFwiQ2FuY2VsXCIsdmFsdWU6IG51bGwsdmlzaWJsZTogdHJ1ZX0sIHllczoge3RleHQ6IFwiTmV4dCBpbnB1dFwiLHZhbHVlOiB0cnVlLHZpc2libGU6IHRydWV9IH0sXG4gICAgICAgIGNvbnRlbnQ6IHtlbGVtZW50OiBcImlucHV0XCIsIGF0dHJpYnV0ZXM6IHtwbGFjZWhvbGRlcjogXCJHaXZlIHRoaXMgY2hhbGxlbmdlIGEgc2V4eSBuYW1lLi5cIix0eXBlOiBcInRleHRcIn0gfSxcbiAgICAgIH0pXG4gICAgICAudGhlbigodGl0bGUpID0+IHsgaWYgKCF0aXRsZSkge3JldHVybjt9XG4gICAgICAgIHN3YWwoXCJFbnRlciB0aGUgY2hhbGxlbmdlIGRlc2NyaXB0aW9uOlwiLCB7XG4gICAgICAgICAgYnV0dG9uczoge2NhbmNlbDoge3RleHQ6IFwiQ2FuY2VsXCIsdmFsdWU6IG51bGwsdmlzaWJsZTogdHJ1ZX0sIHllczoge3RleHQ6IFwiTmV4dCBpbnB1dFwiLHZhbHVlOiB0cnVlLHZpc2libGU6IHRydWV9IH0sXG4gICAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcIkRlc2NyaWJlIHRoaXMgY2hhbGxlbmdlIHNvIHRoYXQgcGVvcGxlIGNhbiBnZXQgdGhlIGlkZWEuLlwiLHR5cGU6IFwidGV4dFwifSB9LFxuICAgICAgICAgIH0pXG4gICAgICAgIC50aGVuKChkZXNjcmlwdGlvbikgPT4geyBpZiAoIWRlc2NyaXB0aW9uKSB7cmV0dXJuO31cbiAgICAgICAgICBzd2FsKFwiRW50ZXIgdGhlIGNoYWxsZW5nZSBkZXBlbmRlbmN5IChMSU5LKTpcIiwge1xuICAgICAgICAgICAgYnV0dG9uczoge2NhbmNlbDoge3RleHQ6IFwiQ2FuY2VsXCIsdmFsdWU6IG51bGwsdmlzaWJsZTogdHJ1ZX0sIHllczoge3RleHQ6IFwiTmV4dCBpbnB1dFwiLHZhbHVlOiB0cnVlLHZpc2libGU6IHRydWV9IH0sXG4gICAgICAgICAgICBjb250ZW50OiB7ZWxlbWVudDogXCJpbnB1dFwiLCBhdHRyaWJ1dGVzOiB7cGxhY2Vob2xkZXI6IFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbS9DaGFsbGVuZ2U0Mi56aXBcIix0eXBlOiBcInRleHRcIn0gfSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oKGRlcGVuZGVuY3kpID0+IHsgaWYgKCFkZXBlbmRlbmN5KSB7cmV0dXJuO31cbiAgICAgICAgICAgIHN3YWwoXCJFbnRlciB0aGUgYW5zd2VyOlwiLCB7XG4gICAgICAgICAgICAgIGJ1dHRvbnM6IHtjYW5jZWw6IHt0ZXh0OiBcIkNhbmNlbFwiLHZhbHVlOiBudWxsLHZpc2libGU6IHRydWV9LCB5ZXM6IHt0ZXh0OiBcIk5leHQgaW5wdXRcIix2YWx1ZTogdHJ1ZSx2aXNpYmxlOiB0cnVlfSB9LFxuICAgICAgICAgICAgICBjb250ZW50OiB7ZWxlbWVudDogXCJpbnB1dFwiLCBhdHRyaWJ1dGVzOiB7cGxhY2Vob2xkZXI6IFwic2hoaGggdGhpcyBzaSBzdXBlciBzZWNyZXQgYnJvXCIsdHlwZTogXCJ0ZXh0XCJ9IH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoYW5zd2VyKSA9PiB7IGlmICghYW5zd2VyKSB7cmV0dXJuO31cbiAgICAgICAgICAgICAgc3dhbChcIkVudGVyIHRoZSBudW1iZXIgb2YgcG9pbnRzIGZvciB0aGlzIGNoYWxsZW5nZTpcIiwge1xuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtjYW5jZWw6IHt0ZXh0OiBcIkNhbmNlbFwiLHZhbHVlOiBudWxsLHZpc2libGU6IHRydWV9LCB5ZXM6IHt0ZXh0OiBcIk5leHQgaW5wdXRcIix2YWx1ZTogdHJ1ZSx2aXNpYmxlOiB0cnVlfSB9LFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHtlbGVtZW50OiBcImlucHV0XCIsIGF0dHJpYnV0ZXM6IHtwbGFjZWhvbGRlcjogXCJQb2ludHMgYXdhcmRlZCB0byBjaGFsbGVuZ2Ugc29sdmVyc1wiLHR5cGU6IFwibnVtYmVyXCJ9IH0sXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLnRoZW4oKHBvaW50cykgPT4geyBpZiAoIXBvaW50cykge3JldHVybjt9XG4gIFxuICAgICAgICAgICAgICAgIGNEYXRhID0ge1xuICAgICAgICAgICAgICAgICAgdGl0bGU6dGl0bGUsXG4gICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjpkZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgIGRlcGVuZGVuY3k6ZGVwZW5kZW5jeSxcbiAgICAgICAgICAgICAgICAgIGFuc3dlcjphbnN3ZXIsXG4gICAgICAgICAgICAgICAgICBwb2ludHM6cG9pbnRzLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBDaGFsbGVuZ2VTZXJ2aWNlLmNyZWF0ZShjRGF0YSkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmVmcmVzaFBhZ2UoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIFxuICAgIH07XG5cbiAgICAkc2NvcGUucmVtb3ZlQ2hhbGxlbmdlID0gZnVuY3Rpb24oJGV2ZW50LCBjaGFsbGVuZ2UsIGluZGV4KSB7XG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBzd2FsKHtcbiAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYWNjZXB0OiB7XG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVtb3ZlIHRoZW1cIixcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXG4gICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byByZW1vdmUgXCIgKyBjaGFsbGVuZ2UudGl0bGUgKyBcIiFcIixcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIlxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzd2FsKHtcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB5ZXM6IHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgdGhpcyBjaGFsbGVuZ2VcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhbmdlck1vZGU6IHRydWUsXG4gICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxuICAgICAgICAgIHRleHQ6IFwiUmVtZW1iZXIsIHRoaXMgcG93ZXIgaXMgYSBwcml2aWxlZ2UuXCIsXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIENoYWxsZW5nZVNlcnZpY2UucmVtb3ZlKGNoYWxsZW5nZS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLmNoYWxsZW5nZXNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxuICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLnRpdGxlICsgXCIgaGFzIGJlZW4gcmVtb3ZlZC5cIixcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmVmcmVzaFBhZ2UoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gIH1cbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoXCJyZWdcIikuY29udHJvbGxlcihcIkFkbWluTWFpbEN0cmxcIiwgW1xuICBcIiRzY29wZVwiLFxuICBcIiRzdGF0ZVwiLFxuICBcIiRzdGF0ZVBhcmFtc1wiLFxuICBcIlVzZXJTZXJ2aWNlXCIsXG4gIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIFVzZXJTZXJ2aWNlKSB7XG4gICAgJHNjb3BlLnBhZ2VzID0gW107XG4gICAgJHNjb3BlLnVzZXJzID0gW107XG5cbiAgICAvLyBTZW1hbnRpYy1VSSBtb3ZlcyBtb2RhbCBjb250ZW50IGludG8gYSBkaW1tZXIgYXQgdGhlIHRvcCBsZXZlbC5cbiAgICAvLyBXaGlsZSB0aGlzIGlzIHVzdWFsbHkgbmljZSwgaXQgbWVhbnMgdGhhdCB3aXRoIG91ciByb3V0aW5nIHdpbGwgZ2VuZXJhdGVcbiAgICAvLyBtdWx0aXBsZSBtb2RhbHMgaWYgeW91IGNoYW5nZSBzdGF0ZS4gS2lsbCB0aGUgdG9wIGxldmVsIGRpbW1lciBub2RlIG9uIGluaXRpYWwgbG9hZFxuICAgIC8vIHRvIHByZXZlbnQgdGhpcy5cbiAgICAkKFwiLnVpLmRpbW1lclwiKS5yZW1vdmUoKTtcbiAgICAvLyBQb3B1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgbW9kYWwgZm9yIHdoZW4gaXQgYXBwZWFycywgd2l0aCBhbiBhcmJpdHJhcnkgdXNlci5cblxuXG5cbiAgICBVc2VyU2VydmljZS5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHN0YXRlUGFyYW1zLnF1ZXJ5LCAkc2NvcGUuc3RhdHVzRmlsdGVycylcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAkc2NvcGUudXNlcnM9IHJlc3BvbnNlLmRhdGEudXNlcnM7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc2VuZEVtYWlsID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZmlsdGVyZWRVc2VycyA9ICRzY29wZS51c2Vycy5maWx0ZXIoXG4gICAgICAgIHUgPT4gdS52ZXJpZmllZFxuICAgICk7XG5cbiAgICAgIGlmICgkc2NvcGUuc3RhdHVzRmlsdGVycy5jb21wbGV0ZWRQcm9maWxlKSB7XG4gICAgICAgIGZpbHRlcmVkVXNlcnMgPSBmaWx0ZXJlZFVzZXJzLmZpbHRlcihcbiAgICAgICAgICB1ID0+IHUuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGVcbiAgICAgICl9XG5cbiAgICAgIGlmICgkc2NvcGUuc3RhdHVzRmlsdGVycy5hZG1pdHRlZCkge1xuICAgICAgICBmaWx0ZXJlZFVzZXJzID0gZmlsdGVyZWRVc2Vycy5maWx0ZXIoXG4gICAgICAgICAgdSA9PiB1LnN0YXR1cy5hZG1pdHRlZFxuICAgICAgKX1cblxuICAgICAgaWYgKCRzY29wZS5zdGF0dXNGaWx0ZXJzLmNvbmZpcm1lZCkge1xuICAgICAgICBmaWx0ZXJlZFVzZXJzID0gZmlsdGVyZWRVc2Vycy5maWx0ZXIoXG4gICAgICAgICAgdSA9PiB1LnN0YXR1cy5jb25maXJtZWRcbiAgICAgICl9XG5cbiAgICAgIGlmICgkc2NvcGUuc3RhdHVzRmlsdGVycy5kZWNsaW5lZCkge1xuICAgICAgICBmaWx0ZXJlZFVzZXJzID0gZmlsdGVyZWRVc2Vycy5maWx0ZXIoXG4gICAgICAgICAgdSA9PiB1LnN0YXR1cy5kZWNsaW5lZFxuICAgICAgKX1cblxuICAgICAgaWYgKCRzY29wZS5zdGF0dXNGaWx0ZXJzLmNoZWNrZWRJbikge1xuICAgICAgICBmaWx0ZXJlZFVzZXJzID0gZmlsdGVyZWRVc2Vycy5maWx0ZXIoXG4gICAgICAgICAgdSA9PiB1LnN0YXR1cy5jaGVja2VkSW5cbiAgICAgICl9XG5cbiAgICAgIHZhciBtZXNzYWdlID0gJCh0aGlzKS5kYXRhKFwiY29uZmlybVwiKTtcblxuICAgICAgc3dhbCh7XG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXG4gICAgICAgIHRleHQ6IGBZb3UncmUgYWJvdXQgdG8gc2VuZCB0aGlzIGVtYWlsIHRvICR7XG4gICAgICAgICAgZmlsdGVyZWRVc2Vycy5sZW5ndGhcbiAgICAgICAgfSBzZWxlY3RlZCB1c2VyKHMpLmAsXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICBidXR0b25zOiBbXCJDYW5jZWxcIiwgXCJZZXMsIHNlbmQgdGhlIGVtYWlsc1wiXSxcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZVxuICAgICAgfSkudGhlbih3aWxsU2VuZCA9PiB7XG4gICAgICAgIGVtYWlsID0geyBzdWJqZWN0OiRzY29wZS5zdWJqZWN0ICwgdGl0bGU6JHNjb3BlLnRpdGxlLCBib2R5OiRzY29wZS5ib2R5IH1cblxuICAgICAgICBpZiAod2lsbFNlbmQpIHtcbiAgICAgICAgICBpZiAoZmlsdGVyZWRVc2Vycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZpbHRlcmVkVXNlcnMuZm9yRWFjaCh1c2VyID0+IHtcbiAgICAgICAgICAgICAgVXNlclNlcnZpY2Uuc2VuZEJhc2ljTWFpbCh1c2VyLmlkLGVtYWlsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgXCJTZW5kaW5nIVwiLFxuICAgICAgICAgICAgICBgU2VuZGluZyBlbWFpbHMgdG8gJHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZFVzZXJzLmxlbmd0aFxuICAgICAgICAgICAgICB9IHVzZXJzIWAsXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2FsKFwiV2hvb3BzXCIsIFwiWW91IGNhbid0IHNlbmQgb3IgYWNjZXB0IDAgdXNlcnMhXCIsIFwiZXJyb3JcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gIH1cbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoXCJyZWdcIikuY29udHJvbGxlcihcImFkbWluTWFya2V0aW5nQ3RybFwiLCBbXG4gIFwiJHNjb3BlXCIsXG4gIFwiJHN0YXRlXCIsXG4gIFwiJHN0YXRlUGFyYW1zXCIsXG4gIFwiTWFya2V0aW5nU2VydmljZVwiLFxuICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBNYXJrZXRpbmdTZXJ2aWNlKSB7XG5cbiAgICAvLyBTZW1hbnRpYy1VSSBtb3ZlcyBtb2RhbCBjb250ZW50IGludG8gYSBkaW1tZXIgYXQgdGhlIHRvcCBsZXZlbC5cbiAgICAvLyBXaGlsZSB0aGlzIGlzIHVzdWFsbHkgbmljZSwgaXQgbWVhbnMgdGhhdCB3aXRoIG91ciByb3V0aW5nIHdpbGwgZ2VuZXJhdGVcbiAgICAvLyBtdWx0aXBsZSBtb2RhbHMgaWYgeW91IGNoYW5nZSBzdGF0ZS4gS2lsbCB0aGUgdG9wIGxldmVsIGRpbW1lciBub2RlIG9uIGluaXRpYWwgbG9hZFxuICAgIC8vIHRvIHByZXZlbnQgdGhpcy5cbiAgICAkKFwiLnVpLmRpbW1lclwiKS5yZW1vdmUoKTtcbiAgICAvLyBQb3B1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgbW9kYWwgZm9yIHdoZW4gaXQgYXBwZWFycywgd2l0aCBhbiBhcmJpdHJhcnkgdXNlci5cblxuXG5cblxuICAgICRzY29wZS5jcmVhdGVUZWFtcyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgIGlmICgkc2NvcGUuYm9keSAmJiAkc2NvcGUuZXZlbnQpe1xuICAgICAgICBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgIHRleHQ6IGBZb3UncmUgYWJvdXQgdG8gYWRkIHRoZXNlIHRlYW1zIGVtYWlscyB0byB0aGUgbWFya2V0aW5nIGRhdGFiYXNlYCxcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgICBidXR0b25zOiBbXCJDYW5jZWxcIiwgXCJZZXMsIEFkZCB0ZWFtc1wiXSxcbiAgICAgICAgICBkYW5nZXJNb2RlOiB0cnVlXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHRlYW1zID0gJHNjb3BlLmJvZHkuc3BsaXQoJzsnKTtcbiAgICAgICAgICAgIHRlYW1zLmZvckVhY2godGVhbSA9PiB7XG4gICAgICAgICAgICAgIHRlYW1EYXRhID0ge1xuICAgICAgICAgICAgICAgIGV2ZW50OiRzY29wZS5ldmVudCxcbiAgICAgICAgICAgICAgICBtZW1iZXJzOnRlYW0ucmVwbGFjZSgnICcsJycpLnNwbGl0KCcsJylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBNYXJrZXRpbmdTZXJ2aWNlLmNyZWF0ZVRlYW0odGVhbURhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzd2FsKFwiQWRkZWRcIiwgXCJUZWFtcyBhZGRlZCB0byBkYXRhYmFzZS5cIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgJHNjb3BlLmJvZHk9XCJcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc3dhbChcIkVSUk9SIVwiLCBcIkFsbCBmaWVsZHMgYXJlIHJlcXVpcmVkLlwiLCBcImVycm9yXCIpO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgXG4gIH1cbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdBZG1pblNldHRpbmdzQ3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJHNjZScsXG4gICAgJ1NldHRpbmdzU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc2NlLCBTZXR0aW5nc1NlcnZpY2Upe1xuXG4gICAgICAkc2NvcGUuc2V0dGluZ3MgPSB7fTtcbiAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAuZ2V0UHVibGljU2V0dGluZ3MoKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgdXBkYXRlU2V0dGluZ3MocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIH0pO1xuXG4gICAgICBmdW5jdGlvbiB1cGRhdGVTZXR0aW5ncyhzZXR0aW5ncyl7XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAvLyBGb3JtYXQgdGhlIGRhdGVzIGluIHNldHRpbmdzLlxuICAgICAgICBzZXR0aW5ncy50aW1lT3BlbiA9IG5ldyBEYXRlKHNldHRpbmdzLnRpbWVPcGVuKTtcbiAgICAgICAgc2V0dGluZ3MudGltZUNsb3NlID0gbmV3IERhdGUoc2V0dGluZ3MudGltZUNsb3NlKTtcbiAgICAgICAgc2V0dGluZ3MudGltZUNvbmZpcm0gPSBuZXcgRGF0ZShzZXR0aW5ncy50aW1lQ29uZmlybSk7XG4gICAgICAgIHNldHRpbmdzLnRpbWVTdGFydCA9IG5ldyBEYXRlKHNldHRpbmdzLnRpbWVTdGFydCk7XG5cbiAgICAgICAgJHNjb3BlLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZGl0aW9uYWwgT3B0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAkc2NvcGUudXBkYXRlQWxsb3dNaW5vcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVBbGxvd01pbm9ycygkc2NvcGUuc2V0dGluZ3MuYWxsb3dNaW5vcnMpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLnNldHRpbmdzLmFsbG93TWlub3JzID0gcmVzcG9uc2UuZGF0YS5hbGxvd01pbm9ycztcbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NUZXh0ID0gJHNjb3BlLnNldHRpbmdzLmFsbG93TWlub3JzID9cbiAgICAgICAgICAgICAgXCJNaW5vcnMgYXJlIG5vdyBhbGxvd2VkIHRvIHJlZ2lzdGVyLlwiIDpcbiAgICAgICAgICAgICAgXCJNaW5vcnMgYXJlIG5vIGxvbmdlciBhbGxvd2VkIHRvIHJlZ2lzdGVyLlwiXG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgc3VjY2Vzc1RleHQsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIC8vIFdoaXRlbGlzdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBTZXR0aW5nc1NlcnZpY2VcbiAgICAgICAgLmdldFdoaXRlbGlzdGVkRW1haWxzKClcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICRzY29wZS53aGl0ZWxpc3QgPSByZXNwb25zZS5kYXRhLmpvaW4oXCIsIFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLnVwZGF0ZVdoaXRlbGlzdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgICAudXBkYXRlV2hpdGVsaXN0ZWRFbWFpbHMoJHNjb3BlLndoaXRlbGlzdC5yZXBsYWNlKC8gL2csICcnKS5zcGxpdCgnLCcpKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICBzd2FsKCdXaGl0ZWxpc3QgdXBkYXRlZC4nKTtcbiAgICAgICAgICAgICAgJHNjb3BlLndoaXRlbGlzdCA9IHJlc3BvbnNlLmRhdGEud2hpdGVsaXN0ZWRFbWFpbHMuam9pbihcIiwgXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgIC8vIFJlZ2lzdHJhdGlvbiBUaW1lcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAkc2NvcGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpe1xuICAgICAgICBpZiAoIWRhdGUpe1xuICAgICAgICAgIHJldHVybiBcIkludmFsaWQgRGF0ZVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSGFjayBmb3IgdGltZXpvbmVcbiAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5mb3JtYXQoJ2RkZGQsIE1NTU0gRG8gWVlZWSwgaDptbSBhJykgK1xuICAgICAgICAgIFwiIFwiICsgZGF0ZS50b1RpbWVTdHJpbmcoKS5zcGxpdCgnICcpWzJdO1xuICAgICAgfTtcblxuICAgICAgLy8gVGFrZSBhIGRhdGUgYW5kIHJlbW92ZSB0aGUgc2Vjb25kcy5cbiAgICAgIGZ1bmN0aW9uIGNsZWFuRGF0ZShkYXRlKXtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFxuICAgICAgICAgIGRhdGUuZ2V0RnVsbFllYXIoKSxcbiAgICAgICAgICBkYXRlLmdldE1vbnRoKCksXG4gICAgICAgICAgZGF0ZS5nZXREYXRlKCksXG4gICAgICAgICAgZGF0ZS5nZXRIb3VycygpLFxuICAgICAgICAgIGRhdGUuZ2V0TWludXRlcygpXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS51cGRhdGVSZWdpc3RyYXRpb25UaW1lcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIENsZWFuIHRoZSBkYXRlcyBhbmQgdHVybiB0aGVtIHRvIG1zLlxuICAgICAgICB2YXIgb3BlbiA9IGNsZWFuRGF0ZSgkc2NvcGUuc2V0dGluZ3MudGltZU9wZW4pLmdldFRpbWUoKTtcbiAgICAgICAgdmFyIGNsb3NlID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lQ2xvc2UpLmdldFRpbWUoKTtcblxuICAgICAgICBpZiAob3BlbiA8IDAgfHwgY2xvc2UgPCAwIHx8IG9wZW4gPT09IHVuZGVmaW5lZCB8fCBjbG9zZSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICByZXR1cm4gc3dhbCgnT29wcy4uLicsICdZb3UgbmVlZCB0byBlbnRlciB2YWxpZCB0aW1lcy4nLCAnZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3BlbiA+PSBjbG9zZSl7XG4gICAgICAgICAgc3dhbCgnT29wcy4uLicsICdSZWdpc3RyYXRpb24gY2Fubm90IG9wZW4gYWZ0ZXIgaXQgY2xvc2VzLicsICdlcnJvcicpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVSZWdpc3RyYXRpb25UaW1lcyhvcGVuLCBjbG9zZSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIlJlZ2lzdHJhdGlvbiBUaW1lcyBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIC8vIENvbmZpcm1hdGlvbiBUaW1lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICRzY29wZS51cGRhdGVDb25maXJtYXRpb25UaW1lID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGNvbmZpcm1CeSA9IGNsZWFuRGF0ZSgkc2NvcGUuc2V0dGluZ3MudGltZUNvbmZpcm0pLmdldFRpbWUoKTtcblxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcbiAgICAgICAgICAudXBkYXRlQ29uZmlybWF0aW9uVGltZShjb25maXJtQnkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICBzd2FsKFwiU291bmRzIGdvb2QhXCIsIFwiQ29uZmlybWF0aW9uIERhdGUgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAvLyBFdmVudCBTdGFydCBUaW1lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICRzY29wZS51cGRhdGVTdGFydFRpbWUgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc3RhcnRCeSA9IGNsZWFuRGF0ZSgkc2NvcGUuc2V0dGluZ3MudGltZVN0YXJ0KS5nZXRUaW1lKCk7XG5cbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZVN0YXJ0VGltZShzdGFydEJ5KVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgc3dhbChcIlNvdW5kcyBnb29kIVwiLCBcIkV2ZW50IFN0YXJ0IERhdGUgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG5cbiAgICAgIC8vIEFjY2VwdGFuY2UgLyBDb25maXJtYXRpb24gVGV4dCAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIHZhciBjb252ZXJ0ZXIgPSBuZXcgc2hvd2Rvd24uQ29udmVydGVyKCk7XG5cbiAgICAgICRzY29wZS5tYXJrZG93blByZXZpZXcgPSBmdW5jdGlvbih0ZXh0KXtcbiAgICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKHRleHQpKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS51cGRhdGVXYWl0bGlzdFRleHQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgdGV4dCA9ICRzY29wZS5zZXR0aW5ncy53YWl0bGlzdFRleHQ7XG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVXYWl0bGlzdFRleHQodGV4dClcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJXYWl0bGlzdCBUZXh0IFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUudXBkYXRlSG9zdFNjaG9vbCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBob3N0U2Nob29sID0gJHNjb3BlLnNldHRpbmdzLmhvc3RTY2hvb2w7XG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVIb3N0U2Nob29sKGhvc3RTY2hvb2wpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiSG9zdCBTY2hvb2wgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICBcbiAgICAgICRzY29wZS51cGRhdGVBY2NlcHRhbmNlVGV4dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB0ZXh0ID0gJHNjb3BlLnNldHRpbmdzLmFjY2VwdGFuY2VUZXh0O1xuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcbiAgICAgICAgICAudXBkYXRlQWNjZXB0YW5jZVRleHQodGV4dClcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJBY2NlcHRhbmNlIFRleHQgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS51cGRhdGVDb25maXJtYXRpb25UZXh0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHRleHQgPSAkc2NvcGUuc2V0dGluZ3MuY29uZmlybWF0aW9uVGV4dDtcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZUNvbmZpcm1hdGlvblRleHQodGV4dClcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJDb25maXJtYXRpb24gVGV4dCBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKSAuY29uZmlnKFsnQ2hhcnRKc1Byb3ZpZGVyJywgZnVuY3Rpb24gKENoYXJ0SnNQcm92aWRlcikge1xuICAvLyBDb25maWd1cmUgYWxsIGNoYXJ0c1xuICBDaGFydEpzUHJvdmlkZXIuc2V0T3B0aW9ucyh7XG4gICAgY2hhcnRDb2xvcnM6IFsnIzlCNjZGRScsICcjRkY2NDg0JywgJyNGRUEwM0YnLCAnI0ZCRDA0RCcsICcjNERCRkMwJywgJyMzM0EzRUYnLCAnI0NBQ0JDRiddLFxuICAgIHJlc3BvbnNpdmU6IHRydWVcbiAgfSk7XG59XSlcbi5jb250cm9sbGVyKCdBZG1pblN0YXRzQ3RybCcsW1xuICAgICckc2NvcGUnLFxuICAgICdVc2VyU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBVc2VyU2VydmljZSl7XG4gICAgICBcbiAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgIC5nZXRTdGF0cygpXG4gICAgICAgIC50aGVuKHN0YXRzID0+IHtcbiAgICAgICAgICAkc2NvcGUuc3RhdHMgPSBzdGF0cy5kYXRhOyBcblxuICAgICAgICAgIC8vIE1lYWxzIFxuICAgICAgICAgIGxhYmVscz1bXVxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhdHMuZGF0YS5saXZlLm1lYWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxhYmVscy5wdXNoKCdNZWFsICcrKGkrMSkpICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5tZWFscyA9IHsgXG4gICAgICAgICAgICBsYWJlbHMgOiBsYWJlbHMsXG4gICAgICAgICAgICBzZXJpZXMgOiBbJ01lYWxzJ10sXG4gICAgICAgICAgICBkYXRhIDogc3RhdHMuZGF0YS5saXZlLm1lYWwsXG4gICAgICAgICAgICBvcHRpb25zIDoge1xuICAgICAgICAgICAgICBcInNjYWxlc1wiOntcbiAgICAgICAgICAgICAgICBcInhBeGVzXCI6W3tcInRpY2tzXCI6e2JlZ2luQXRaZXJvOnRydWUsbWF4OnN0YXRzLmRhdGEudG90YWx9fV1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxuICAgICAgICAgICAgICAgIHRleHQ6ICdNZWFscyBDb25zdW1lZCdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICB9XG4gICAgICAgICAgIFxuICAgICAgICAgIC8vIFdvcmtzaG9wcyBcbiAgICAgICAgICBsYWJlbHM9W11cbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXRzLmRhdGEubGl2ZS53b3Jrc2hvcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGFiZWxzLnB1c2goJ1dvcmtzaG9wICcrKGkrMSkpICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS53b3Jrc2hvcHMgPSB7IFxuICAgICAgICAgICAgbGFiZWxzIDogbGFiZWxzLFxuICAgICAgICAgICAgc2VyaWVzIDogWydXb3Jrc2hvcHMnXSxcbiAgICAgICAgICAgIGRhdGEgOiBzdGF0cy5kYXRhLmxpdmUud29ya3Nob3AsXG4gICAgICAgICAgICBvcHRpb25zOntcbiAgICAgICAgICAgICAgZWxlbWVudHM6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiB7XG4gICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMC41LCAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXG4gICAgICAgICAgICAgICAgdGV4dDogJ1dvcmtzaG9wcyBhdHRlbmRhbmNlJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGNsdWJzXG4gICAgICAgICAgJHNjb3BlLmNsdWJzID0ge1xuICAgICAgICAgICAgbGFiZWxzIDogc3RhdHMuZGF0YS5zb3VyY2UuY2x1YnNMYWJlbHMsXG4gICAgICAgICAgICBzZXJpZXMgOiBbJ0NsdWJzJ10sXG4gICAgICAgICAgICBkYXRhIDogc3RhdHMuZGF0YS5zb3VyY2UuY2x1YnMsXG4gICAgICAgICAgICBvcHRpb25zOntcbiAgICAgICAgICAgICAgZWxlbWVudHM6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiB7XG4gICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMC41LCAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXG4gICAgICAgICAgICAgICAgdGV4dDogJ0FwcGxpY2FudHMgdmlhIENsdWJzJ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmlnaHQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgICB9XG5cbiAgICAgICAgICAgLy8gR2V0IHRoZSBtb3N0IGFjdGl2ZSBjbHViXG4gICAgICAgICAgIHZhciBhcnIgPXN0YXRzLmRhdGEuc291cmNlLmNsdWJzXG4gICAgICAgICAgIHZhciBtYXggPSBhcnJbMF07XG4gICAgICAgICAgIHZhciBtYXhJbmRleCA9IDA7XG4gICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICBpZiAoYXJyW2ldID4gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgbWF4SW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgIG1heCA9IGFycltpXTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfVxuXG4gICAgICAgICAgICRzY29wZS5maXJzdENsdWIgPSBzdGF0cy5kYXRhLnNvdXJjZS5jbHVic0xhYmVsc1ttYXhJbmRleF1cblxuICAgICAgIFxuXG5cbiAgICAgICAgICAvLyBzb3VyY2VzIFxuICAgICAgICAgICRzY29wZS5zb3VyY2UgPSB7XG4gICAgICAgICAgICBsYWJlbHMgOiBbJ0ZhY2Vib29rJywnRW1haWwnLCdDbHVicyddLFxuICAgICAgICAgICAgc2VyaWVzIDogWydTb3VyY2VzJ10sXG4gICAgICAgICAgICBkYXRhIDogc3RhdHMuZGF0YS5zb3VyY2UuZ2VuZXJhbCxcbiAgICAgICAgICAgIG9wdGlvbnM6e1xuICAgICAgICAgICAgICBlbGVtZW50czoge1xuICAgICAgICAgICAgICAgIGxpbmU6IHtcbiAgICAgICAgICAgICAgICAgIGJvcmRlcldpZHRoOiAwLjUsICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZXh0OiAnQXBwbGljYW50cyBzb3VyY2VzJ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmlnaHQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7ICBcblxuXG4gICAgICBVc2VyU2VydmljZVxuICAgICAgICAuZ2V0VGVhbVN0YXRzKClcbiAgICAgICAgLnRoZW4odGVhbXN0YXRzID0+IHtcbiAgICAgICAgICAkc2NvcGUudGVhbXN0YXRzID0gdGVhbXN0YXRzLmRhdGE7IFxuICAgICAgICB9KTsgIFxuXG5cbiAgICAgICRzY29wZS5mcm9tTm93ID0gZnVuY3Rpb24oZGF0ZSl7XG4gICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSkuZnJvbU5vdygpO1xuICAgICAgfTtcblxuXG4gICAgICBDaGFydC5kZWZhdWx0cy5nbG9iYWwuY29sb3JzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSg1MiwgMTUyLCAyMTksIDAuNSknLFxuICAgICAgICAgIHBvaW50QmFja2dyb3VuZENvbG9yOiAncmdiYSg1MiwgMTUyLCAyMTksIDAuNSknLFxuICAgICAgICAgIHBvaW50SG92ZXJCYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDE1MSwxODcsMjA1LDAuNSknLFxuICAgICAgICAgIGJvcmRlckNvbG9yOiAncmdiYSgwLDAsMCwwJyxcbiAgICAgICAgICBwb2ludEJvcmRlckNvbG9yOiAnI2ZmZicsXG4gICAgICAgICAgcG9pbnRIb3ZlckJvcmRlckNvbG9yOiAncmdiYSgxNTEsMTg3LDIwNSwwLjUpJ1xuICAgICAgICB9XG4gICAgICBdICAgICAgICBcblxuXG4gICAgICAkc2NvcGUuc2VuZExhZ2dlckVtYWlscyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcbiAgICAgICAgICB0ZXh0OiBcIlRoaXMgd2lsbCBzZW5kIGFuIGVtYWlsIHRvIGV2ZXJ5IHVzZXIgd2hvIGhhcyBub3Qgc3VibWl0dGVkIGFuIGFwcGxpY2F0aW9uLiBBcmUgeW91IHN1cmU/LlwiLFxuICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIHNlbmQuXCIsXG4gICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXG4gICAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgICAgIC5zZW5kTGFnZ2VyRW1haWxzKClcbiAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBzd2VldEFsZXJ0KCdZb3VyIGVtYWlscyBoYXZlIGJlZW4gc2VudC4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnNlbmRSZWplY3RFbWFpbHMgPSBmdW5jdGlvbigpe1xuICAgICAgICBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXG4gICAgICAgICAgdGV4dDogXCJUaGlzIHdpbGwgc2VuZCBhbiBlbWFpbCB0byBldmVyeSB1c2VyIHdobyBoYXMgYmVlbiByZWplY3RlZC4gQXJlIHlvdSBzdXJlP1wiLFxuICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIHNlbmQuXCIsXG4gICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXG4gICAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgICAgIC5zZW5kUmVqZWN0RW1haWxzKClcbiAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBzd2VldEFsZXJ0KCdZb3VyIGVtYWlscyBoYXZlIGJlZW4gc2VudC4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnNlbmRSZWplY3RFbWFpbHNSZXN0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAuZ2V0TGF0ZXJSZWplY3RlZENvdW50KClcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihjb3VudCkge1xuICAgICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcbiAgICAgICAgICAgICAgdGV4dDogYFRoaXMgd2lsbCBzZW5kIHJlamVjdGlvbiBlbWFpbCB0byAke2NvdW50fSB1c2Vycy5gLFxuICAgICAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiWWVzLCByZWplY3QuXCIsXG4gICAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxuICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgIFxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAuc2VuZFJlamVjdEVtYWlsc1Jlc3QoKVxuICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc3dlZXRBbGVydCgnWW91ciBlbWFpbHMgaGF2ZSBiZWVuIHNlbnQuJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUubWFzc1JlamVjdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC5nZXRSZWplY3Rpb25Db3VudCgpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oY291bnQpIHtcbiAgICAgICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXG4gICAgICAgICAgICAgIHRleHQ6IGBUaGlzIHdpbGwgcmVqZWN0ICR7Y291bnR9IHVzZXJzLmAsXG4gICAgICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIHJlamVjdC5cIixcbiAgICAgICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXG4gICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAgICAgICAgIC5tYXNzUmVqZWN0KClcbiAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHN3ZWV0QWxlcnQoJ01hc3MgUmVqZWN0aW9uIHN1Y2Nlc3NmdWwuJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgICRzY29wZS5tYXNzUmVqZWN0UmVzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC5nZXRSZXN0UmVqZWN0aW9uQ291bnQoKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICAgICAgICBzd2FsKHtcbiAgICAgICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxuICAgICAgICAgICAgICB0ZXh0OiBgVGhpcyB3aWxsIHJlamVjdCAke2NvdW50fSB1c2Vycy5gLFxuICAgICAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiWWVzLCByZWplY3QuXCIsXG4gICAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxuICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgIFxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAubWFzc1JlamVjdFJlc3QoKVxuICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc3dlZXRBbGVydCgnTWFzcyBSZWplY3Rpb24gc3VjY2Vzc2Z1bC4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgIH1cblxuXG5cblxuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignQWRtaW5Vc2VyQ3RybCcsW1xuICAgICckc2NvcGUnLFxuICAgICckaHR0cCcsXG4gICAgJ3VzZXInLFxuICAgICdVc2VyU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgVXNlciwgVXNlclNlcnZpY2Upe1xuICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlciA9IFVzZXIuZGF0YTtcblxuICAgICAgLy8gUG9wdWxhdGUgdGhlIHNjaG9vbCBkcm9wZG93blxuICAgICAgcG9wdWxhdGVTY2hvb2xzKCk7XG5cbiAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlU2Nob29scygpe1xuXG4gICAgICAgICRodHRwXG4gICAgICAgICAgLmdldCgnL2Fzc2V0cy9zY2hvb2xzLmpzb24nKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICB2YXIgc2Nob29scyA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgdmFyIGVtYWlsID0gJHNjb3BlLnNlbGVjdGVkVXNlci5lbWFpbC5zcGxpdCgnQCcpWzFdO1xuXG4gICAgICAgICAgICBpZiAoc2Nob29sc1tlbWFpbF0pe1xuICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnByb2ZpbGUuc2Nob29sID0gc2Nob29sc1tlbWFpbF0uc2Nob29sO1xuICAgICAgICAgICAgICAkc2NvcGUuYXV0b0ZpbGxlZFNjaG9vbCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuXG4gICAgICAkc2NvcGUudXBkYXRlUHJvZmlsZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZVByb2ZpbGUoJHNjb3BlLnNlbGVjdGVkVXNlci5faWQsICRzY29wZS5zZWxlY3RlZFVzZXIucHJvZmlsZSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAkc2VsZWN0ZWRVc2VyID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIHN3YWwoXCJVcGRhdGVkIVwiLCBcIlByb2ZpbGUgdXBkYXRlZC5cIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHN3YWwoXCJPb3BzLCB5b3UgZm9yZ290IHNvbWV0aGluZy5cIik7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG5cbiAgICAgICRzY29wZS51cGRhdGVDb25maXJtYXRpb24gPSBmdW5jdGlvbigpe1xuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC51cGRhdGVDb25maXJtYXRpb24oJHNjb3BlLnNlbGVjdGVkVXNlci5faWQsICRzY29wZS5zZWxlY3RlZFVzZXIuY29uZmlybWF0aW9uKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICRzZWxlY3RlZFVzZXIgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgc3dhbChcIlVwZGF0ZWQhXCIsIFwiQ29uZmlybWF0aW9uIHVwZGF0ZWQuXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBzd2FsKFwiT29wcywgeW91IGZvcmdvdCBzb21ldGhpbmcuXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuXG4gICAgICAkc2NvcGUudXBkYXRlQWxsVXNlciA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAudXBkYXRlQWxsKCRzY29wZS5zZWxlY3RlZFVzZXIuX2lkLCAkc2NvcGUuc2VsZWN0ZWRVc2VyKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICRzZWxlY3RlZFVzZXIgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgc3dhbChcIlVwZGF0ZWQhXCIsIFwiQUxMIFByb2ZpbGUgdXBkYXRlZC5cIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHN3YWwoXCJPb3BzLCB5b3UgZm9yZ290IHNvbWV0aGluZy5cIik7XG4gICAgICAgICAgfSk7ICBcbiAgICAgIH07XG5cblxuXG5cblxuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKFwicmVnXCIpLmNvbnRyb2xsZXIoXCJBZG1pblVzZXJzQ3RybFwiLCBbXG4gIFwiJHNjb3BlXCIsXG4gIFwiJHN0YXRlXCIsXG4gIFwiJHN0YXRlUGFyYW1zXCIsXG4gIFwiVXNlclNlcnZpY2VcIixcbiAgJ0F1dGhTZXJ2aWNlJyxcbiAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgVXNlclNlcnZpY2UsIEF1dGhTZXJ2aWNlKSB7XG4gICAgJHNjb3BlLnBhZ2VzID0gW107XG4gICAgJHNjb3BlLnVzZXJzID0gW107XG5cbiAgICAvLyBTZW1hbnRpYy1VSSBtb3ZlcyBtb2RhbCBjb250ZW50IGludG8gYSBkaW1tZXIgYXQgdGhlIHRvcCBsZXZlbC5cbiAgICAvLyBXaGlsZSB0aGlzIGlzIHVzdWFsbHkgbmljZSwgaXQgbWVhbnMgdGhhdCB3aXRoIG91ciByb3V0aW5nIHdpbGwgZ2VuZXJhdGVcbiAgICAvLyBtdWx0aXBsZSBtb2RhbHMgaWYgeW91IGNoYW5nZSBzdGF0ZS4gS2lsbCB0aGUgdG9wIGxldmVsIGRpbW1lciBub2RlIG9uIGluaXRpYWwgbG9hZFxuICAgIC8vIHRvIHByZXZlbnQgdGhpcy5cbiAgICAkKFwiLnVpLmRpbW1lclwiKS5yZW1vdmUoKTtcbiAgICAvLyBQb3B1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgbW9kYWwgZm9yIHdoZW4gaXQgYXBwZWFycywgd2l0aCBhbiBhcmJpdHJhcnkgdXNlci5cbiAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0ge307XG4gICAgJHNjb3BlLnNlbGVjdGVkVXNlci5zZWN0aW9ucyA9IGdlbmVyYXRlU2VjdGlvbnMoe1xuICAgICAgc3RhdHVzOiBcIlwiLFxuICAgICAgY29uZmlybWF0aW9uOiB7XG4gICAgICAgIGRpZXRhcnlSZXN0cmljdGlvbnM6IFtdXG4gICAgICB9LFxuICAgICAgcHJvZmlsZTogXCJcIlxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlUGFnZShkYXRhKSB7XG4gICAgICAkc2NvcGUudXNlcnMgPSBkYXRhLnVzZXJzO1xuICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gZGF0YS5wYWdlO1xuICAgICAgJHNjb3BlLnBhZ2VTaXplID0gZGF0YS5zaXplO1xuXG4gICAgICB2YXIgcCA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLnRvdGFsUGFnZXM7IGkrKykge1xuICAgICAgICBwLnB1c2goaSk7XG4gICAgICB9XG4gICAgICAkc2NvcGUucGFnZXMgPSBwO1xuICAgIH1cblxuICAgIFVzZXJTZXJ2aWNlLmdldFBhZ2UoJHN0YXRlUGFyYW1zLnBhZ2UsICRzdGF0ZVBhcmFtcy5zaXplLCAkc3RhdGVQYXJhbXMucXVlcnksICRzY29wZS5zdGF0dXNGaWx0ZXJzKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcblxuICAgICAgdXBkYXRlUGFnZShyZXNwb25zZS5kYXRhKTtcbiAgICB9KTtcblxuICAgICRzY29wZS4kd2F0Y2goXCJxdWVyeVRleHRcIiwgZnVuY3Rpb24ocXVlcnlUZXh0KSB7XG4gICAgICBVc2VyU2VydmljZS5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgcXVlcnlUZXh0LCAkc2NvcGUuc3RhdHVzRmlsdGVycykudGhlbihcbiAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgIHVwZGF0ZVBhZ2UocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSk7XG5cblxuICAgICRzY29wZS5hcHBseVN0YXR1c0ZpbHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgIC5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHNjb3BlLnF1ZXJ5VGV4dCwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMpLnRoZW4oXG4gICAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgdXBkYXRlUGFnZShyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgJHNjb3BlLmdvVG9QYWdlID0gZnVuY3Rpb24ocGFnZSkge1xuICAgICAgJHN0YXRlLmdvKFwiYXBwLmFkbWluLnVzZXJzXCIsIHtcbiAgICAgICAgcGFnZTogcGFnZSxcbiAgICAgICAgc2l6ZTogJHN0YXRlUGFyYW1zLnNpemUgfHwgMjBcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuZ29Vc2VyID0gZnVuY3Rpb24oJGV2ZW50LCB1c2VyKSB7XG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICRzdGF0ZS5nbyhcImFwcC5hZG1pbi51c2VyXCIsIHtcbiAgICAgICAgaWQ6IHVzZXIuX2lkXG4gICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAkc2NvcGUuYWNjZXB0VXNlciA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHN3YWwoe1xuICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgY2FuY2VsOiB7XG4gICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhY2NlcHQ6IHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBhY2NlcHQgdGhlbVwiLFxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkYW5nZXJNb2RlOiB0cnVlLFxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGFjY2VwdCBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIhXCIsXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHllczoge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIGFjY2VwdCB0aGlzIHVzZXJcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhbmdlck1vZGU6IHRydWUsXG4gICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxuICAgICAgICAgIHRleHQ6XG4gICAgICAgICAgICBcIllvdXIgYWNjb3VudCB3aWxsIGJlIGxvZ2dlZCBhcyBoYXZpbmcgYWNjZXB0ZWQgdGhpcyB1c2VyLiBcIiArXG4gICAgICAgICAgICBcIlJlbWVtYmVyLCB0aGlzIHBvd2VyIGlzIGEgcHJpdmlsZWdlLlwiLFxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgVXNlclNlcnZpY2Uuc29mdEFkbWl0dFVzZXIodXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBzd2FsKFxuICAgICAgICAgICAgICBcIkFjY2VwdGVkXCIsXG4gICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEucHJvZmlsZS5uYW1lICsgXCIgaGFzIGJlZW4gYWRtaXR0ZWQuXCIsXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG5cblxuXG4gICAgJHNjb3BlLnJlamVjdHRVc2VyID0gZnVuY3Rpb24oJGV2ZW50LCB1c2VyLCBpbmRleCkge1xuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgc3dhbCh7XG4gICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFjY2VwdDoge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlamVjdCB0aGVtXCIsXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGRhbmdlck1vZGU6IHRydWUsXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVqZWN0IFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIiFcIixcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIlxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzd2FsKHtcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB5ZXM6IHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZWplY3QgdGhpcyB1c2VyXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYW5nZXJNb2RlOiB0cnVlLFxuICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcbiAgICAgICAgICB0ZXh0OlxuICAgICAgICAgICAgXCJZb3VyIGFjY291bnQgd2lsbCBiZSBsb2dnZWQgYXMgaGF2aW5nIHJlamVjdGVkIHRoaXMgdXNlci4gXCIgK1xuICAgICAgICAgICAgXCJSZW1lbWJlciwgdGhpcyBwb3dlciBpcyBhIHByaXZpbGVnZS5cIixcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIlxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIFVzZXJTZXJ2aWNlLnNvZnRSZWplY3RVc2VyKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICRzY29wZS51c2Vyc1tpbmRleF0gPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgXCJSZWplY3RlZFwiLFxuICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLnByb2ZpbGUubmFtZSArIFwiIGhhcyBiZWVuIHJlamVjdGVkLlwiLFxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cblxuXG4gICAgJHNjb3BlLnJlbW92ZVVzZXIgPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIsIGluZGV4KSB7XG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblxuICAgICAgc3dhbCh7XG4gICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFjY2VwdDoge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSB0aGVtXCIsXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGRhbmdlck1vZGU6IHRydWUsXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVtb3ZlIFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIiFcIixcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIlxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzd2FsKHtcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB5ZXM6IHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgdGhpcyB1c2VyXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYW5nZXJNb2RlOiB0cnVlLFxuICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcbiAgICAgICAgICB0ZXh0OlxuICAgICAgICAgICAgXCJZb3VyIGFjY291bnQgd2lsbCBiZSBsb2dnZWQgYXMgaGF2aW5nIHJlbW92ZWQgdGhpcyB1c2VyLiBcIiArXG4gICAgICAgICAgICBcIlJlbWVtYmVyLCB0aGlzIHBvd2VyIGlzIGEgcHJpdmlsZWdlLlwiLFxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBVc2VyU2VydmljZS5yZW1vdmVVc2VyKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICRzY29wZS51c2Vyc1tpbmRleF0gPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXG4gICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEucHJvZmlsZS5uYW1lICsgXCIgaGFzIGJlZW4gcmVtb3ZlZC5cIixcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zZW5kQWNjZXB0YW5jZUVtYWlscyA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZmlsdGVyU29mdEFjY2VwdGVkID0gJHNjb3BlLnVzZXJzLmZpbHRlcihcbiAgICAgICAgdSA9PiB1LnN0YXR1cy5zb2Z0QWRtaXR0ZWQgJiYgIXUuc3RhdHVzLmFkbWl0dGVkXG4gICAgICApO1xuXG4gICAgICB2YXIgbWVzc2FnZSA9ICQodGhpcykuZGF0YShcImNvbmZpcm1cIik7XG5cbiAgICAgIHN3YWwoe1xuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICB0ZXh0OiBgWW91J3JlIGFib3V0IHRvIHNlbmQgYWNjZXB0YW5jZSBlbWFpbHMgKGFuZCBhY2NlcHQpICR7XG4gICAgICAgICAgZmlsdGVyU29mdEFjY2VwdGVkLmxlbmd0aFxuICAgICAgICB9IHVzZXIocykuYCxcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXG4gICAgICAgIGJ1dHRvbnM6IFtcIkNhbmNlbFwiLCBcIlllcywgYWNjZXB0IHRoZW0gYW5kIHNlbmQgdGhlIGVtYWlsc1wiXSxcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZVxuICAgICAgfSkudGhlbih3aWxsU2VuZCA9PiB7XG4gICAgICAgIGlmICh3aWxsU2VuZCkge1xuICAgICAgICAgIGlmIChmaWx0ZXJTb2Z0QWNjZXB0ZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICBmaWx0ZXJTb2Z0QWNjZXB0ZWQuZm9yRWFjaCh1c2VyID0+IHtcbiAgICAgICAgICAgICAgVXNlclNlcnZpY2UuYWRtaXRVc2VyKHVzZXIuX2lkKTsgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICAgIFwiU2VuZGluZyFcIixcbiAgICAgICAgICAgICAgYEFjY2VwdGluZyBhbmQgc2VuZGluZyBlbWFpbHMgdG8gJHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJTb2Z0QWNjZXB0ZWQubGVuZ3RoXG4gICAgICAgICAgICAgIH0gdXNlcnMhYCxcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3YWwoXCJXaG9vcHNcIiwgXCJZb3UgY2FuJ3Qgc2VuZCBvciBhY2NlcHQgMCB1c2VycyFcIiwgXCJlcnJvclwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cblxuXG4gICAgJHNjb3BlLnNlbmRSZWplY3Rpb25FbWFpbHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGZpbHRlclNvZnRSZWplY3RlZCA9ICRzY29wZS51c2Vycy5maWx0ZXIoXG4gICAgICAgIHUgPT4gdS5zdGF0dXMuc29mdFJlamVjdGVkXG4gICAgICApO1xuXG4gICAgICB2YXIgbWVzc2FnZSA9ICQodGhpcykuZGF0YShcImNvbmZpcm1cIik7XG5cbiAgICAgIHN3YWwoe1xuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICB0ZXh0OiBgWW91J3JlIGFib3V0IHRvIHNlbmQgcmVqZWN0aW9uIGVtYWlscyAoYW5kIHJlamVjdCkgJHtcbiAgICAgICAgICBmaWx0ZXJTb2Z0UmVqZWN0ZWQubGVuZ3RoXG4gICAgICAgIH0gdXNlcihzKS5gLFxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgYnV0dG9uczogW1wiQ2FuY2VsXCIsIFwiWWVzLCByZWplY3QgdGhlbSBhbmQgc2VuZCB0aGUgZW1haWxzXCJdLFxuICAgICAgICBkYW5nZXJNb2RlOiB0cnVlXG4gICAgICB9KS50aGVuKHdpbGxTZW5kID0+IHtcbiAgICAgICAgaWYgKHdpbGxTZW5kKSB7XG4gICAgICAgICAgaWYgKGZpbHRlclNvZnRSZWplY3RlZC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZpbHRlclNvZnRSZWplY3RlZC5mb3JFYWNoKHVzZXIgPT4ge1xuICAgICAgICAgICAgICBVc2VyU2VydmljZS5yZWplY3RVc2VyKHVzZXIuX2lkKTsgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICAgIFwiU2VuZGluZyFcIixcbiAgICAgICAgICAgICAgYFJlamVjdGluZyBhbmQgc2VuZGluZyBlbWFpbHMgdG8gJHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJTb2Z0UmVqZWN0ZWQubGVuZ3RoXG4gICAgICAgICAgICAgIH0gdXNlcnMhYCxcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3YWwoXCJXaG9vcHNcIiwgXCJZb3UgY2FuJ3Qgc2VuZCBvciByZWplY3QgMCB1c2VycyFcIiwgXCJlcnJvclwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cblxuICAgICRzY29wZS5leHBvcnRVc2VycyA9IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgY29sdW1ucyA9IFtcIk7CsFwiLCBcIkdlbmRlclwiLCBcIkZ1bGwgTmFtZVwiLFwiU2Nob29sXCJdO1xuICAgICAgdmFyIHJvd3MgPSBbXTtcbiAgICAgIFVzZXJTZXJ2aWNlLmdldEFsbCgpLnRoZW4odXNlcnMgPT4ge1xuICAgICAgICB2YXIgaT0xO1xuICAgICAgICB1c2Vycy5kYXRhLmZvckVhY2godXNlciA9PiB7XG4gICAgICAgICAgcm93cy5wdXNoKFtpKyssdXNlci5wcm9maWxlLmdlbmRlcix1c2VyLnByb2ZpbGUubmFtZSx1c2VyLnByb2ZpbGUuc2Nob29sXSlcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBkb2MgPSBuZXcganNQREYoJ3AnLCAncHQnKTtcblxuXG4gICAgICAgIHZhciB0b3RhbFBhZ2VzRXhwID0gXCJ7dG90YWxfcGFnZXNfY291bnRfc3RyaW5nfVwiO1xuXG4gICAgICAgIHZhciBwYWdlQ29udGVudCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAvLyBIRUFERVJcbiAgICAgICAgICAgIGRvYy5zZXRGb250U2l6ZSgyMCk7XG4gICAgICAgICAgICBkb2Muc2V0VGV4dENvbG9yKDQwKTtcbiAgICAgICAgICAgIGRvYy5zZXRGb250U3R5bGUoJ25vcm1hbCcpO1xuICAgICAgICAgICAgLy8gaWYgKGJhc2U2NEltZykge1xuICAgICAgICAgICAgLy8gICAgIGRvYy5hZGRJbWFnZShiYXNlNjRJbWcsICdKUEVHJywgZGF0YS5zZXR0aW5ncy5tYXJnaW4ubGVmdCwgMTUsIDEwLCAxMCk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBkb2MudGV4dChcIlBhcnRpY2lwYW50cyBMaXN0XCIsIGRhdGEuc2V0dGluZ3MubWFyZ2luLmxlZnQgKyAxNSwgMjIpO1xuICAgIFxuICAgICAgICAgICAgLy8gRk9PVEVSXG4gICAgICAgICAgICB2YXIgc3RyID0gXCJQYWdlIFwiICsgZGF0YS5wYWdlQ291bnQ7XG4gICAgICAgICAgICAvLyBUb3RhbCBwYWdlIG51bWJlciBwbHVnaW4gb25seSBhdmFpbGFibGUgaW4ganNwZGYgdjEuMCtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZG9jLnB1dFRvdGFsUGFnZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIgKyBcIiBvZiBcIiArIHRvdGFsUGFnZXNFeHA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2Muc2V0Rm9udFNpemUoMTApO1xuICAgICAgICAgICAgdmFyIHBhZ2VIZWlnaHQgPSBkb2MuaW50ZXJuYWwucGFnZVNpemUuaGVpZ2h0IHx8IGRvYy5pbnRlcm5hbC5wYWdlU2l6ZS5nZXRIZWlnaHQoKTtcbiAgICAgICAgICAgIGRvYy50ZXh0KHN0ciwgZGF0YS5zZXR0aW5ncy5tYXJnaW4ubGVmdCwgcGFnZUhlaWdodCAgLSAxMCk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBkb2MuYXV0b1RhYmxlKGNvbHVtbnMsIHJvd3MsIHtcbiAgICAgICAgICAgIGFkZFBhZ2VDb250ZW50OiBwYWdlQ29udGVudCxcbiAgICAgICAgICAgIG1hcmdpbjoge3RvcDogMzB9LFxuICAgICAgICAgICAgdGhlbWU6ICdncmlkJ1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHR5cGVvZiBkb2MucHV0VG90YWxQYWdlcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGRvYy5wdXRUb3RhbFBhZ2VzKHRvdGFsUGFnZXNFeHApO1xuICAgICAgICB9XG4gICAgICAgIGRvYy5zYXZlKCdQYXJ0aWNpcGFudHMgTGlzdC5wZGYnKTtcbiAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAkc2NvcGUudG9nZ2xlQWRtaW4gPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIsIGluZGV4KSB7XG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGlmICghdXNlci5hZG1pbikge1xuICAgICAgICBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCBtYWtlIFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIiBhbiBhZG1pbiFcIixcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb25maXJtOiB7XG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBtYWtlIHRoZW0gYW4gYWRtaW5cIixcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgVXNlclNlcnZpY2UubWFrZUFkbWluKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICRzY29wZS51c2Vyc1tpbmRleF0gPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgc3dhbChcIk1hZGVcIiwgcmVzcG9uc2UuZGF0YS5wcm9maWxlLm5hbWUgKyBcIiBhbiBhZG1pbi5cIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFVzZXJTZXJ2aWNlLnJlbW92ZUFkbWluKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICBzd2FsKFwiUmVtb3ZlZFwiLCByZXNwb25zZS5kYXRhLnByb2ZpbGUubmFtZSArIFwiIGFzIGFkbWluXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRUaW1lKHRpbWUpIHtcbiAgICAgIGlmICh0aW1lKSB7XG4gICAgICAgIHJldHVybiBtb21lbnQodGltZSkuZm9ybWF0KFwiTU1NTSBEbyBZWVlZLCBoOm1tOnNzIGFcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJHNjb3BlLnJvd0NsYXNzID0gZnVuY3Rpb24odXNlcikge1xuICAgICAgaWYgKHVzZXIuYWRtaW4pIHtcbiAgICAgICAgcmV0dXJuIFwiYWRtaW5cIjtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VyLnN0YXR1cy5jb25maXJtZWQpIHtcbiAgICAgICAgcmV0dXJuIFwicG9zaXRpdmVcIjtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJiAhdXNlci5zdGF0dXMuY29uZmlybWVkKSB7XG4gICAgICAgIHJldHVybiBcIndhcm5pbmdcIjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gc2VsZWN0VXNlcih1c2VyKSB7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gdXNlcjtcbiAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIuc2VjdGlvbnMgPSBnZW5lcmF0ZVNlY3Rpb25zKHVzZXIpO1xuICAgICAgJChcIi5sb25nLnVzZXIubW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlU2VjdGlvbnModXNlcikge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiQmFzaWMgSW5mb1wiLFxuICAgICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkNyZWF0ZWQgT25cIixcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci50aW1lc3RhbXApXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkxhc3QgVXBkYXRlZFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLmxhc3RVcGRhdGVkKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJDb25maXJtIEJ5XCIsXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSkgfHwgXCJOL0FcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJDaGVja2VkIEluXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNoZWNrSW5UaW1lKSB8fCBcIk4vQVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkVtYWlsXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmVtYWlsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJQcm9maWxlXCIsXG4gICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiTmFtZVwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLm5hbWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiR2VuZGVyXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ2VuZGVyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIlNjaG9vbFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLnNjaG9vbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJHcmFkdWF0aW9uIFllYXJcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5ncmFkdWF0aW9uWWVhclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJIYWNrYXRob25zIHZpc2l0ZWRcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5ob3dNYW55SGFja2F0aG9uc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJEZXNjcmlwdGlvblwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmRlc2NyaXB0aW9uXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkVzc2F5XCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZXNzYXlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiTWFqb3JcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5tYWpvclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJHaXRodWJcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5naXRodWJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiRmFjZWJvb2tcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5mYWNlYm9va1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJMaW5rZWRpblwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmxpbmtlZGluXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOlwiQ1YgbGlua1wiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmN2TGlua1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiQ29uZmlybWF0aW9uXCIsXG4gICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiUGhvbmUgTnVtYmVyXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5waG9uZU51bWJlclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJOZWVkcyBIYXJkd2FyZVwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ud2FudHNIYXJkd2FyZSxcbiAgICAgICAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiSGFyZHdhcmUgUmVxdWVzdGVkXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5oYXJkd2FyZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiVHJhdmVsXCIsXG4gICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiQWRkaXRpb25hbCBOb3Rlc1wiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ubm90ZXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25TdWNjZXNzKCkge1xuICAgICAgc3dhbChcIlVwZGF0ZWQhXCIsIFwiTmV3IFZvbHVudGVlciBBZGRlZC5cIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uRXJyb3IoZGF0YSl7XG4gICAgICBzd2FsKFwiVHJ5IGFnYWluIVwiLCBkYXRhLm1lc3NhZ2UsIFwiZXJyb3JcIilcbiAgICB9XG5cbiAgICAkc2NvcGUuYWRkVm9sdW50ZWVyID0gZnVuY3Rpb24oKXtcblxuICAgICAgc3dhbChcIldyaXRlIHRoZSBjaGFsbGVuZ2UgdGl0bGU6XCIsIHtcbiAgICAgICAgYnV0dG9uczoge2NhbmNlbDoge3RleHQ6IFwiQ2FuY2VsXCIsdmFsdWU6IG51bGwsdmlzaWJsZTogdHJ1ZX0sIHllczoge3RleHQ6IFwiSW52aXRlXCIsdmFsdWU6IHRydWUsdmlzaWJsZTogdHJ1ZX0gfSxcbiAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcImV4YW1wbGVAZ21haWwuY29tXCIsdHlwZTogXCJ0ZXh0XCJ9IH0sXG4gICAgICB9KS50aGVuKChtYWlsKSA9PiB7IGlmICghbWFpbCkge3JldHVybjt9IFxuICAgICAgICBBdXRoU2VydmljZS5yZWdpc3RlcihcbiAgICAgICAgICBtYWlsLCBcImhhY2thdGhvblwiLCBvblN1Y2Nlc3MsIG9uRXJyb3IsIHRydWUpXG4gICAgICB9KTtcbiAgICB9O1xuXG5cblxuICAgICRzY29wZS5zZWxlY3RVc2VyID0gc2VsZWN0VXNlcjtcbiAgfVxuXSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5zZXJ2aWNlKCdzZXR0aW5ncycsIGZ1bmN0aW9uKCkge30pXG4gIC5jb250cm9sbGVyKCdCYXNlQ3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnRVZFTlRfSU5GTycsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBFVkVOVF9JTkZPKXtcblxuICAgICAgJHNjb3BlLkVWRU5UX0lORk8gPSBFVkVOVF9JTkZPO1xuXG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdhZG1pbkN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIFVzZXJTZXJ2aWNlKXtcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdBcHBsaWNhdGlvbkN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc3RhdGUnLFxuICAgICckaHR0cCcsXG4gICAgJ2N1cnJlbnRVc2VyJyxcbiAgICAnc2V0dGluZ3MnLFxuICAgICdTZXNzaW9uJyxcbiAgICAnVXNlclNlcnZpY2UnLFxuICAgICdNYXJrZXRpbmdTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJGh0dHAsIGN1cnJlbnRVc2VyLCBzZXR0aW5ncywgU2Vzc2lvbiwgVXNlclNlcnZpY2UsIE1hcmtldGluZ1NlcnZpY2UpIHtcblxuICAgICAgLy8gU2V0IHVwIHRoZSB1c2VyXG4gICAgICAkc2NvcGUudXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XG5cbiAgICAgIC8vIElzIHRoZSBzdHVkZW50IGZyb20gSG9zdFNjaG9vbD9cbiAgICAgICRzY29wZS5pc0hvc3RTY2hvb2wgPSAkc2NvcGUudXNlci5lbWFpbC5zcGxpdCgnQCcpWzFdID09IHNldHRpbmdzLmRhdGEuaG9zdFNjaG9vbDtcblxuICAgICAgLy8gSWYgc28sIGRlZmF1bHQgdGhlbSB0byBhZHVsdDogdHJ1ZVxuICAgICAgaWYgKCRzY29wZS5pc0hvc3RTY2hvb2wpe1xuICAgICAgICAkc2NvcGUudXNlci5wcm9maWxlLmFkdWx0ID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gUG9wdWxhdGUgdGhlIHNjaG9vbCBkcm9wZG93blxuICAgICAgcG9wdWxhdGVTY2hvb2xzKCk7XG4gICAgICBfc2V0dXBGb3JtKCk7XG5cbiAgICAgIHBvcHVsYXRlV2lsYXlhcygpO1xuICAgICAgcG9wdWxhdGVDbHVicygpO1xuXG4gICAgICAkc2NvcGUucmVnSXNDbG9zZWQgPSBEYXRlLm5vdygpID4gc2V0dGluZ3MuZGF0YS50aW1lQ2xvc2U7XG5cbiAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlU2Nob29scygpe1xuICAgICAgICAkaHR0cFxuICAgICAgICAgIC5nZXQoJy9hc3NldHMvc2Nob29scy5qc29uJylcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgdmFyIHNjaG9vbHMgPSByZXMuZGF0YTtcbiAgICAgICAgICAgIHZhciBlbWFpbCA9ICRzY29wZS51c2VyLmVtYWlsLnNwbGl0KCdAJylbMV07XG5cbiAgICAgICAgICAgIGlmIChzY2hvb2xzW2VtYWlsXSl7XG4gICAgICAgICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUuc2Nob29sID0gc2Nob29sc1tlbWFpbF0uc2Nob29sO1xuICAgICAgICAgICAgICAkc2NvcGUuYXV0b0ZpbGxlZFNjaG9vbCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgJGh0dHBcbiAgICAgICAgICAuZ2V0KCcvYXNzZXRzL3NjaG9vbHMuY3N2JylcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgJHNjb3BlLnNjaG9vbHMgPSByZXMuZGF0YS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICAkc2NvcGUuc2Nob29scy5wdXNoKCdPdGhlcicpO1xuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCAkc2NvcGUuc2Nob29scy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAkc2NvcGUuc2Nob29sc1tpXSA9ICRzY29wZS5zY2hvb2xzW2ldLnRyaW0oKTtcbiAgICAgICAgICAgICAgY29udGVudC5wdXNoKHt0aXRsZTogJHNjb3BlLnNjaG9vbHNbaV19KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKCcjc2Nob29sLnVpLnNlYXJjaCcpXG4gICAgICAgICAgICAgIC5zZWFyY2goe1xuICAgICAgICAgICAgICAgIHNvdXJjZTogY29udGVudCxcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24ocmVzdWx0LCByZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXIucHJvZmlsZS5zY2hvb2wgPSByZXN1bHQudGl0bGUudHJpbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICBcblxuICAgICAgZnVuY3Rpb24gcG9wdWxhdGVXaWxheWFzKCl7XG4gICAgICAgICRodHRwXG4gICAgICAgICAgLmdldCgnL2Fzc2V0cy93aWxheWFzLmNzdicpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICRzY29wZS53aWxheWFzID0gcmVzLmRhdGEuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgJHNjb3BlLndpbGF5YXMucHVzaCgnT3RoZXInKTtcblxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBbXTtcblxuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgJHNjb3BlLndpbGF5YXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgJHNjb3BlLndpbGF5YXNbaV0gPSAkc2NvcGUud2lsYXlhc1tpXS50cmltKCk7XG4gICAgICAgICAgICAgIGNvbnRlbnQucHVzaCh7dGl0bGU6ICRzY29wZS53aWxheWFzW2ldfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJCgnI3dpbGF5YS51aS5zZWFyY2gnKVxuICAgICAgICAgICAgICAuc2VhcmNoKHtcbiAgICAgICAgICAgICAgICBzb3VyY2U6IGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgY2FjaGU6IHRydWUsXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKHJlc3VsdCwgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUud2lsYXlhID0gcmVzdWx0LnRpdGxlLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcblxuICAgICAgZnVuY3Rpb24gcG9wdWxhdGVDbHVicygpe1xuICAgICAgICAkaHR0cFxuICAgICAgICAgIC5nZXQoJy9hc3NldHMvY2x1YnMuY3N2JylcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgJHNjb3BlLmNsdWJzID0gcmVzLmRhdGEuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgJHNjb3BlLmNsdWJzLnB1c2goJ090aGVyJyk7XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gW107XG5cbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8ICRzY29wZS5jbHVicy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAkc2NvcGUuY2x1YnNbaV0gPSAkc2NvcGUuY2x1YnNbaV0udHJpbSgpO1xuICAgICAgICAgICAgICBjb250ZW50LnB1c2goe3RpdGxlOiAkc2NvcGUuY2x1YnNbaV19KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKCcjY2x1Yi51aS5zZWFyY2gnKVxuICAgICAgICAgICAgICAuc2VhcmNoKHtcbiAgICAgICAgICAgICAgICBzb3VyY2U6IGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgY2FjaGU6IHRydWUsXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKHJlc3VsdCwgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICRzY29wZS5jbHViID0gcmVzdWx0LnRpdGxlLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCRzY29wZS51c2VyLnByb2ZpbGUuc291cmNlICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAkc2NvcGUuVXNlclNvdXJjZSA9ICRzY29wZS51c2VyLnByb2ZpbGUuc291cmNlLnNwbGl0KCcjJylbMF07XG4gICAgICAgICAgICAkc2NvcGUuY2x1YiA9ICRzY29wZS51c2VyLnByb2ZpbGUuc291cmNlLnNwbGl0KCcjJylbMV07ICBcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICBmdW5jdGlvbiByZW1vdmVEdXBsaWNhdGVzKG15QXJyLCBwcm9wKSB7XG4gICAgICAgIHJldHVybiBteUFyci5maWx0ZXIoKG9iaiwgcG9zLCBhcnIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhcnIubWFwKG1hcE9iaiA9PiBtYXBPYmpbcHJvcF0pLmluZGV4T2Yob2JqW3Byb3BdKSA9PT0gcG9zO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2VuZE1hcmtldGluZ0VtYWlscygpe1xuICAgICAgICBNYXJrZXRpbmdTZXJ2aWNlLmdldEFsbCgpLnRoZW4odGVhbXM9PntcbiAgICAgICAgICB2YXIgZW1haWxzPVtdO1xuICAgICAgICAgIHRlYW1zLmRhdGEuZm9yRWFjaCh0ZWFtID0+IHtcbiAgICAgICAgICAgIHZhciBpc1RlYW1tYXRlPWZhbHNlO1xuICAgICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcbiAgICAgICAgICAgICAgaWYgKG1lbWJlcj09Y3VycmVudFVzZXIuZGF0YS5lbWFpbCl7XG4gICAgICAgICAgICAgICAgaXNUZWFtbWF0ZT10cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChpc1RlYW1tYXRlKSB7XG4gICAgICAgICAgICAgIHRlYW0ubWVtYmVycy5mb3JFYWNoKG1lbWJlciA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCEobWVtYmVyPT1jdXJyZW50VXNlci5kYXRhLmVtYWlsKSl7XG4gICAgICAgICAgICAgICAgICBlbWFpbHMucHVzaCh7ZW1haWw6bWVtYmVyLGV2ZW50OnRlYW0uZXZlbnR9KVxuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJlbW92ZUR1cGxpY2F0ZXMoZW1haWxzLCdlbWFpbCcpLmZvckVhY2godGVhbW1hdGUgPT4ge1xuICAgICAgICAgICAgTWFya2V0aW5nU2VydmljZS5zZW5kRnJpZW5kSW52aXRlKGN1cnJlbnRVc2VyLmRhdGEucHJvZmlsZS5uYW1lLHRlYW1tYXRlKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIGZ1bmN0aW9uIF91cGRhdGVVc2VyKGUpe1xuXG4gICAgICAgIC8vQ2hlY2sgaWYgVXNlcidzIGZpcnN0IHN1Ym1pc3Npb25cbiAgICAgICAgdmFyIHNlbmRNYWlsID0gdHJ1ZTtcbiAgICAgICAgaWYgKGN1cnJlbnRVc2VyLmRhdGEuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUpIHtzZW5kTWFpbD1mYWxzZX0gICAgICAgIFxuXG4gICAgICAgIC8vIEdldCB1c2VyIFNvdXJjZVxuICAgICAgICBpZiAoJHNjb3BlLlVzZXJTb3VyY2UhPScyJyl7JHNjb3BlLnVzZXIucHJvZmlsZS5zb3VyY2U9JHNjb3BlLlVzZXJTb3VyY2V9XG4gICAgICAgICAgZWxzZXskc2NvcGUudXNlci5wcm9maWxlLnNvdXJjZT0kc2NvcGUuVXNlclNvdXJjZStcIiNcIiskc2NvcGUuY2x1Yn1cblxuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC51cGRhdGVQcm9maWxlKFNlc3Npb24uZ2V0VXNlcklkKCksICRzY29wZS51c2VyLnByb2ZpbGUpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgc3dhbChcIkF3ZXNvbWUhXCIsIFwiWW91ciBhcHBsaWNhdGlvbiBoYXMgYmVlbiBzYXZlZC5cIiwgXCJzdWNjZXNzXCIpLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgICAgICBpZiAoc2VuZE1haWwpeyBzZW5kTWFya2V0aW5nRW1haWxzKCk7IH1cbiAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLmRhc2hib2FyZFwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHN3YWwoXCJVaCBvaCFcIiwgXCJTb21ldGhpbmcgd2VudCB3cm9uZy5cIiwgXCJlcnJvclwiKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpc01pbm9yKCkge1xuICAgICAgICByZXR1cm4gISRzY29wZS51c2VyLnByb2ZpbGUuYWR1bHQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG1pbm9yc0FyZUFsbG93ZWQoKSB7XG4gICAgICAgIHJldHVybiBzZXR0aW5ncy5kYXRhLmFsbG93TWlub3JzO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtaW5vcnNWYWxpZGF0aW9uKCkge1xuICAgICAgICAvLyBBcmUgbWlub3JzIGFsbG93ZWQgdG8gcmVnaXN0ZXI/XG4gICAgICAgIGlmIChpc01pbm9yKCkgJiYgIW1pbm9yc0FyZUFsbG93ZWQoKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gX3NldHVwRm9ybSgpe1xuICAgICAgICAvLyBDdXN0b20gbWlub3JzIHZhbGlkYXRpb24gcnVsZVxuICAgICAgICAkLmZuLmZvcm0uc2V0dGluZ3MucnVsZXMuYWxsb3dNaW5vcnMgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gbWlub3JzVmFsaWRhdGlvbigpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFNlbWFudGljLVVJIGZvcm0gdmFsaWRhdGlvblxuICAgICAgICAkKCcudWkuZm9ybScpLmZvcm0oe1xuICAgICAgICAgIGlubGluZTogdHJ1ZSxcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ25hbWUnLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgeW91ciBuYW1lLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzY2hvb2w6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3NjaG9vbCcsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIHNjaG9vbCBuYW1lLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3aWxheWE6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3dpbGF5YScsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIHdpbGF5YSBuYW1lLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB5ZWFyOiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICd5ZWFyJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHNlbGVjdCB5b3VyIGdyYWR1YXRpb24geWVhci4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2VuZGVyOiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdnZW5kZXInLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2Ugc2VsZWN0IGEgZ2VuZGVyLiAnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaG93TWFueUhhY2thdGhvbnM6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2hvd01hbnlIYWNrYXRob25zJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHNlbGVjdCBob3cgbWFueSBoYWNrYXRob25zIHlvdSBoYXZlIGF0dGVuZGVkLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZHVsdDoge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnYWR1bHQnLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdhbGxvd01pbm9ycycsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdZb3UgbXVzdCBiZSBhbiBhZHVsdCwgb3IgYW4gRVNJIHN0dWRlbnQuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGN2TGluazoge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnY3ZMaW5rJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnWW91IG11c3QgYWRkIGEgbGluayB0byB5b3VyIENWLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuc3VibWl0Rm9ybSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICgkKCcudWkuZm9ybScpLmZvcm0oJ2lzIHZhbGlkJykpe1xuICAgICAgICAgIF91cGRhdGVVc2VyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3dhbChcIlVoIG9oIVwiLCBcIlBsZWFzZSBGaWxsIFRoZSBSZXF1aXJlZCBGaWVsZHNcIiwgXCJlcnJvclwiKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbi5jb250cm9sbGVyKCdDaGVja2luQ3RybCcsIFtcbiAgJyRzY29wZScsXG4gICckc3RhdGUnLFxuICAnJHN0YXRlUGFyYW1zJyxcbiAgJ1VzZXJTZXJ2aWNlJyxcbiAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgVXNlclNlcnZpY2Upe1xuICAgICQoJyNyZWFkZXInKS5odG1sNV9xcmNvZGUoZnVuY3Rpb24odXNlcklEKXtcbiAgICAgICAgICAvL0NoYW5nZSB0aGUgaW5wdXQgZmllbGRzIHZhbHVlIGFuZCBzZW5kIHBvc3QgcmVxdWVzdCB0byB0aGUgYmFja2VuZFxuICAgICAgICAgIFxuICAgICAgICAgIFVzZXJTZXJ2aWNlLmdldCh1c2VySUQpLnRoZW4ocmVzcG9uc2UgPT4ge1xuXG4gICAgICAgICAgICB1c2VyID1yZXNwb25zZS5kYXRhO1xuXG4gICAgICAgICAgICBpZiAoIXVzZXIuc3RhdHVzLmNoZWNrZWRJbikge1xuICAgICAgICAgICAgICBzd2FsKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBjaGVjayBpbiBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIhXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgICAgICAgY2FuY2VsOiB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgY2hlY2tJbjoge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIGNoZWNrIHRoZW0gaW5cIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICBcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZS5jaGVja0luKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAgICRzY29wZS5xdWVyeVRleHQgPSB1c2VyLmVtYWlsO1xuICAgICAgICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgICAgICAgXCJDaGVja2VkIGluXCIsXG4gICAgICAgICAgICAgICAgICAgIHVzZXIucHJvZmlsZS5uYW1lICsgXCIgaGFzIGJlZW4gY2hlY2tlZCBpbi5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgICBcIkFscmVhZHkgY2hlY2tlZEluXCIsXG4gICAgICAgICAgICAgICAgdXNlci5wcm9maWxlLm5hbWUgKyBcIiBoYXMgYmVlbiBjaGVja2VkLWluIGF0OiBcIisgZm9ybWF0VGltZSh1c2VyLnN0YXR1cy5jaGVja0luVGltZSksXG4gICAgICAgICAgICAgICAgXCJ3YXJuaW5nXCJcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgIH0sIGZ1bmN0aW9uKHZpZGVvRXJyb3Ipe1xuICAgICAgICAvL3RoZSB2aWRlbyBzdHJlYW0gY291bGQgYmUgb3BlbmVkXG4gICAgICB9XG4gICAgKTtcbiAgICAkc2NvcGUucGFnZXMgPSBbXTtcbiAgICAkc2NvcGUudXNlcnMgPSBbXTtcbiAgICAkc2NvcGUuc29ydEJ5ID0gJ3RpbWVzdGFtcCdcbiAgICAkc2NvcGUuc29ydERpciA9IGZhbHNlXG5cbiAgICAkc2NvcGUuZmlsdGVyID0gZGVzZXJpYWxpemVGaWx0ZXJzKCRzdGF0ZVBhcmFtcy5maWx0ZXIpO1xuICAgICRzY29wZS5maWx0ZXIudGV4dCA9ICRzdGF0ZVBhcmFtcy5xdWVyeSB8fCBcIlwiO1xuXG4gICAgZnVuY3Rpb24gZGVzZXJpYWxpemVGaWx0ZXJzKHRleHQpIHtcbiAgICAgIHZhciBvdXQgPSB7fTtcbiAgICAgIGlmICghdGV4dCkgcmV0dXJuIG91dDtcbiAgICAgIHRleHQuc3BsaXQoXCIsXCIpLmZvckVhY2goZnVuY3Rpb24oZil7b3V0W2ZdPXRydWV9KTtcbiAgICAgIHJldHVybiAodGV4dC5sZW5ndGg9PT0wKT97fTpvdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2VyaWFsaXplRmlsdGVycyhmaWx0ZXJzKSB7XG4gICAgICB2YXIgb3V0ID0gXCJcIjtcbiAgICAgIGZvciAodmFyIHYgaW4gZmlsdGVycykge2lmKHR5cGVvZihmaWx0ZXJzW3ZdKT09PVwiYm9vbGVhblwiJiZmaWx0ZXJzW3ZdKSBvdXQgKz0gditcIixcIjt9XG4gICAgICByZXR1cm4gKG91dC5sZW5ndGg9PT0wKT9cIlwiOm91dC5zdWJzdHIoMCxvdXQubGVuZ3RoLTEpO1xuICAgIH1cblxuICAgIC8vIFNlbWFudGljLVVJIG1vdmVzIG1vZGFsIGNvbnRlbnQgaW50byBhIGRpbW1lciBhdCB0aGUgdG9wIGxldmVsLlxuICAgIC8vIFdoaWxlIHRoaXMgaXMgdXN1YWxseSBuaWNlLCBpdCBtZWFucyB0aGF0IHdpdGggb3VyIHJvdXRpbmcgd2lsbCBnZW5lcmF0ZVxuICAgIC8vIG11bHRpcGxlIG1vZGFscyBpZiB5b3UgY2hhbmdlIHN0YXRlLiBLaWxsIHRoZSB0b3AgbGV2ZWwgZGltbWVyIG5vZGUgb24gaW5pdGlhbCBsb2FkXG4gICAgLy8gdG8gcHJldmVudCB0aGlzLlxuICAgICQoJy51aS5kaW1tZXInKS5yZW1vdmUoKTtcbiAgICAvLyBQb3B1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgbW9kYWwgZm9yIHdoZW4gaXQgYXBwZWFycywgd2l0aCBhbiBhcmJpdHJhcnkgdXNlci5cbiAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0ge307XG4gICAgJHNjb3BlLnNlbGVjdGVkVXNlci5zZWN0aW9ucyA9IGdlbmVyYXRlU2VjdGlvbnMoe1xuICAgICAgc3RhdHVzOiBcIlwiLFxuICAgICAgY29uZmlybWF0aW9uOiB7XG4gICAgICAgIGRpZXRhcnlSZXN0cmljdGlvbnM6IFtdXG4gICAgICB9LFxuICAgICAgcHJvZmlsZTogXCJcIlxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlUGFnZShkYXRhKSB7XG4gICAgICAkc2NvcGUudXNlcnMgPSBkYXRhLnVzZXJzO1xuICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gZGF0YS5wYWdlO1xuICAgICAgJHNjb3BlLnBhZ2VTaXplID0gZGF0YS5zaXplO1xuXG4gICAgICB2YXIgcCA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLnRvdGFsUGFnZXM7IGkrKykge1xuICAgICAgICBwLnB1c2goaSk7XG4gICAgICB9XG4gICAgICAkc2NvcGUucGFnZXMgPSBwO1xuICAgIH1cblxuICAgIFVzZXJTZXJ2aWNlLmdldFBhZ2UoJHN0YXRlUGFyYW1zLnBhZ2UsICRzdGF0ZVBhcmFtcy5zaXplLCAkc3RhdGVQYXJhbXMucXVlcnksICRzY29wZS5zdGF0dXNGaWx0ZXJzKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcblxuICAgICAgdXBkYXRlUGFnZShyZXNwb25zZS5kYXRhKTtcbiAgICB9KTtcblxuICAgICRzY29wZS4kd2F0Y2goXCJxdWVyeVRleHRcIiwgZnVuY3Rpb24ocXVlcnlUZXh0KSB7XG4gICAgICBVc2VyU2VydmljZS5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgcXVlcnlUZXh0LCAkc2NvcGUuc3RhdHVzRmlsdGVycykudGhlbihcbiAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgIHVwZGF0ZVBhZ2UocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSk7XG5cblxuICAgICRzY29wZS5hcHBseVN0YXR1c0ZpbHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgIC5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHNjb3BlLnF1ZXJ5VGV4dCwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMpLnRoZW4oXG4gICAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgdXBkYXRlUGFnZShyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgJHNjb3BlLmdvVG9QYWdlID0gZnVuY3Rpb24ocGFnZSkge1xuICAgICAgJHN0YXRlLmdvKFwiYXBwLmFkbWluLnVzZXJzXCIsIHtcbiAgICAgICAgcGFnZTogcGFnZSxcbiAgICAgICAgc2l6ZTogJHN0YXRlUGFyYW1zLnNpemUgfHwgMjBcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY2hlY2tJbiA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgaWYgKCF1c2VyLnN0YXR1cy5jaGVja2VkSW4pIHtcbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gY2hlY2sgaW4gXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoZWNrSW46IHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBjaGVjayB0aGVtIGluXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgVXNlclNlcnZpY2UuY2hlY2tJbih1c2VyLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICAgIFwiQ2hlY2tlZCBpblwiLFxuICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLnByb2ZpbGUubmFtZSArIFwiIGhhcyBiZWVuIGNoZWNrZWQgaW4uXCIsXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN3YWwoXG4gICAgICAgICAgXCJBbHJlYWR5IGNoZWNrZWRJblwiLFxuICAgICAgICAgIHVzZXIucHJvZmlsZS5uYW1lICsgXCIgaGFzIGJlZW4gY2hlY2tlZC1pbiBhdDogXCIrIGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY2hlY2tJblRpbWUpLFxuICAgICAgICAgIFwid2FybmluZ1wiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGZvcm1hdFRpbWUodGltZSkge1xuICAgICAgaWYgKHRpbWUpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudCh0aW1lKS5mb3JtYXQoXCJNTU1NIERvIFlZWVksIGg6bW06c3MgYVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkc2NvcGUucm93Q2xhc3MgPSBmdW5jdGlvbih1c2VyKSB7XG4gICAgICBpZiAodXNlci5hZG1pbikge1xuICAgICAgICByZXR1cm4gXCJhZG1pblwiO1xuICAgICAgfVxuICAgICAgaWYgKHVzZXIuc3RhdHVzLmNvbmZpcm1lZCkge1xuICAgICAgICByZXR1cm4gXCJwb3NpdGl2ZVwiO1xuICAgICAgfVxuICAgICAgaWYgKHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmICF1c2VyLnN0YXR1cy5jb25maXJtZWQpIHtcbiAgICAgICAgcmV0dXJuIFwid2FybmluZ1wiO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBzZWxlY3RVc2VyKHVzZXIpIHtcbiAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSB1c2VyO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlci5zZWN0aW9ucyA9IGdlbmVyYXRlU2VjdGlvbnModXNlcik7XG4gICAgICAkKFwiLmxvbmcudXNlci5tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJCYXNpYyBJbmZvXCIsXG4gICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiQ3JlYXRlZCBPblwiLFxuICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLnRpbWVzdGFtcClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiTGFzdCBVcGRhdGVkXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIubGFzdFVwZGF0ZWQpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkNvbmZpcm0gQnlcIixcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY29uZmlybUJ5KSB8fCBcIk4vQVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkNoZWNrZWQgSW5cIixcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY2hlY2tJblRpbWUpIHx8IFwiTi9BXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiRW1haWxcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuZW1haWxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiBcIlByb2ZpbGVcIixcbiAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJOYW1lXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUubmFtZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJHZW5kZXJcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5nZW5kZXJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiU2Nob29sXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuc2Nob29sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkdyYWR1YXRpb24gWWVhclwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdyYWR1YXRpb25ZZWFyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkhhY2thdGhvbnMgdmlzaXRlZFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmhvd01hbnlIYWNrYXRob25zXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkRlc2NyaXB0aW9uXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZGVzY3JpcHRpb25cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiRXNzYXlcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5lc3NheVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJNYWpvclwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLm1ham9yXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkdpdGh1YlwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdpdGh1YlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJGYWNlYm9va1wiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmZhY2Vib29rXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkxpbmtlZGluXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUubGlua2VkaW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiBcIkNvbmZpcm1hdGlvblwiLFxuICAgICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIlBob25lIE51bWJlclwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ucGhvbmVOdW1iZXJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiTmVlZHMgSGFyZHdhcmVcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLndhbnRzSGFyZHdhcmUsXG4gICAgICAgICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkhhcmR3YXJlIFJlcXVlc3RlZFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uaGFyZHdhcmVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiBcIlRyYXZlbFwiLFxuICAgICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkFkZGl0aW9uYWwgTm90ZXNcIixcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm5vdGVzXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdO1xuICAgIH1cbiAgICAkc2NvcGUuc2VsZWN0VXNlciA9IHNlbGVjdFVzZXI7XG4gIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0NvbmZpcm1hdGlvbkN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc3RhdGUnLFxuICAgICdjdXJyZW50VXNlcicsXG4gICAgJ1V0aWxzJyxcbiAgICAnVXNlclNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCBjdXJyZW50VXNlciwgVXRpbHMsIFVzZXJTZXJ2aWNlKXtcblxuICAgICAgLy8gU2V0IHVwIHRoZSB1c2VyXG4gICAgICB2YXIgdXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XG4gICAgICAkc2NvcGUudXNlciA9IHVzZXI7XG5cbiAgICAgICRzY29wZS5wYXN0Q29uZmlybWF0aW9uID0gRGF0ZS5ub3coKSA+IHVzZXIuc3RhdHVzLmNvbmZpcm1CeTtcblxuICAgICAgJHNjb3BlLmZvcm1hdFRpbWUgPSBVdGlscy5mb3JtYXRUaW1lO1xuXG4gICAgICBfc2V0dXBGb3JtKCk7XG5cbiAgICAgICRzY29wZS5maWxlTmFtZSA9IHVzZXIuX2lkICsgXCJfXCIgKyB1c2VyLnByb2ZpbGUubmFtZS5zcGxpdChcIiBcIikuam9pbihcIl9cIik7XG5cbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIEFsbCB0aGlzIGp1c3QgZm9yIGRpZXRhcnkgcmVzdHJpY3Rpb24gY2hlY2tib3hlcyBmbWxcblxuICAgICAgdmFyIGRpZXRhcnlSZXN0cmljdGlvbnMgPSB7XG4gICAgICAgICdWZWdldGFyaWFuJzogZmFsc2UsXG4gICAgICAgICdWZWdhbic6IGZhbHNlLFxuICAgICAgICAnSGFsYWwnOiBmYWxzZSxcbiAgICAgICAgJ0tvc2hlcic6IGZhbHNlLFxuICAgICAgICAnTnV0IEFsbGVyZ3knOiBmYWxzZVxuICAgICAgfTtcblxuICAgICAgaWYgKHVzZXIuY29uZmlybWF0aW9uLmRpZXRhcnlSZXN0cmljdGlvbnMpe1xuICAgICAgICB1c2VyLmNvbmZpcm1hdGlvbi5kaWV0YXJ5UmVzdHJpY3Rpb25zLmZvckVhY2goZnVuY3Rpb24ocmVzdHJpY3Rpb24pe1xuICAgICAgICAgIGlmIChyZXN0cmljdGlvbiBpbiBkaWV0YXJ5UmVzdHJpY3Rpb25zKXtcbiAgICAgICAgICAgIGRpZXRhcnlSZXN0cmljdGlvbnNbcmVzdHJpY3Rpb25dID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuZGlldGFyeVJlc3RyaWN0aW9ucyA9IGRpZXRhcnlSZXN0cmljdGlvbnM7XG5cbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZnVuY3Rpb24gX3VwZGF0ZVVzZXIoZSl7XG4gICAgICAgIHZhciBjb25maXJtYXRpb24gPSAkc2NvcGUudXNlci5jb25maXJtYXRpb247XG4gICAgICAgIC8vIEdldCB0aGUgZGlldGFyeSByZXN0cmljdGlvbnMgYXMgYW4gYXJyYXlcbiAgICAgICAgdmFyIGRycyA9IFtdO1xuICAgICAgICBPYmplY3Qua2V5cygkc2NvcGUuZGlldGFyeVJlc3RyaWN0aW9ucykuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xuICAgICAgICAgIGlmICgkc2NvcGUuZGlldGFyeVJlc3RyaWN0aW9uc1trZXldKXtcbiAgICAgICAgICAgIGRycy5wdXNoKGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uZmlybWF0aW9uLmRpZXRhcnlSZXN0cmljdGlvbnMgPSBkcnM7XG5cbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAudXBkYXRlQ29uZmlybWF0aW9uKHVzZXIuX2lkLCBjb25maXJtYXRpb24pXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgc3dhbChcIldvbyFcIiwgXCJZb3UncmUgY29uZmlybWVkIVwiLCBcInN1Y2Nlc3NcIikudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5kYXNoYm9hcmRcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBzd2FsKFwiVWggb2ghXCIsIFwiU29tZXRoaW5nIHdlbnQgd3JvbmcuXCIsIFwiZXJyb3JcIik7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIF9zZXR1cEZvcm0oKXtcbiAgICAgICAgLy8gU2VtYW50aWMtVUkgZm9ybSB2YWxpZGF0aW9uXG4gICAgICAgICQoJy51aS5mb3JtJykuZm9ybSh7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBzaGlydDoge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnc2hpcnQnLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZ2l2ZSB1cyBhIHNoaXJ0IHNpemUhJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBob25lOiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdwaG9uZScsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciBhIHBob25lIG51bWJlci4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2lnbmF0dXJlQ29kZU9mQ29uZHVjdDoge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnc2lnbmF0dXJlQ29kZU9mQ29uZHVjdCcsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSB0eXBlIHlvdXIgZGlnaXRhbCBzaWduYXR1cmUuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuc3VibWl0Rm9ybSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICgkKCcudWkuZm9ybScpLmZvcm0oJ2lzIHZhbGlkJykpe1xuICAgICAgICAgIF91cGRhdGVVc2VyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3dhbChcIlVoIG9oIVwiLCBcIlBsZWFzZSBGaWxsIFRoZSBSZXF1aXJlZCBGaWVsZHNcIiwgXCJlcnJvclwiKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignRGFzaGJvYXJkQ3RybCcsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRzY29wZScsXG4gICAgJyRzY2UnLFxuICAgICdjdXJyZW50VXNlcicsXG4gICAgJ3NldHRpbmdzJyxcbiAgICAnVXRpbHMnLFxuICAgICdBdXRoU2VydmljZScsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICAnRVZFTlRfSU5GTycsXG4gICAgJ0RBU0hCT0FSRCcsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkc2NlLCBjdXJyZW50VXNlciwgc2V0dGluZ3MsIFV0aWxzLCBBdXRoU2VydmljZSwgVXNlclNlcnZpY2UsIEVWRU5UX0lORk8sIERBU0hCT0FSRCl7XG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xuICAgICAgdmFyIHVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xuICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xuICAgICAgJHNjb3BlLnRpbWVDbG9zZSA9IFV0aWxzLmZvcm1hdFRpbWUoU2V0dGluZ3MudGltZUNsb3NlKTtcbiAgICAgICRzY29wZS50aW1lQ29uZmlybSA9IFV0aWxzLmZvcm1hdFRpbWUoU2V0dGluZ3MudGltZUNvbmZpcm0pO1xuXG4gICAgICAkc2NvcGUuREFTSEJPQVJEID0gREFTSEJPQVJEO1xuXG4gICAgICBmb3IgKHZhciBtc2cgaW4gJHNjb3BlLkRBU0hCT0FSRCkge1xuICAgICAgICBpZiAoJHNjb3BlLkRBU0hCT0FSRFttc2ddLmluY2x1ZGVzKCdbQVBQX0RFQURMSU5FXScpKSB7XG4gICAgICAgICAgJHNjb3BlLkRBU0hCT0FSRFttc2ddID0gJHNjb3BlLkRBU0hCT0FSRFttc2ddLnJlcGxhY2UoJ1tBUFBfREVBRExJTkVdJywgVXRpbHMuZm9ybWF0VGltZShTZXR0aW5ncy50aW1lQ2xvc2UpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJHNjb3BlLkRBU0hCT0FSRFttc2ddLmluY2x1ZGVzKCdbQ09ORklSTV9ERUFETElORV0nKSkge1xuICAgICAgICAgICRzY29wZS5EQVNIQk9BUkRbbXNnXSA9ICRzY29wZS5EQVNIQk9BUkRbbXNnXS5yZXBsYWNlKCdbQ09ORklSTV9ERUFETElORV0nLCBVdGlscy5mb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIElzIHJlZ2lzdHJhdGlvbiBvcGVuP1xuICAgICAgdmFyIHJlZ0lzT3BlbiA9ICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xuXG4gICAgICAvLyBJcyBpdCBwYXN0IHRoZSB1c2VyJ3MgY29uZmlybWF0aW9uIHRpbWU/XG4gICAgICB2YXIgcGFzdENvbmZpcm1hdGlvbiA9ICRzY29wZS5wYXN0Q29uZmlybWF0aW9uID0gVXRpbHMuaXNBZnRlcih1c2VyLnN0YXR1cy5jb25maXJtQnkpO1xuXG4gICAgICAkc2NvcGUuZGFzaFN0YXRlID0gZnVuY3Rpb24oc3RhdHVzKXtcbiAgICAgICAgdmFyIHVzZXIgPSAkc2NvcGUudXNlcjtcbiAgICAgICAgc3dpdGNoIChzdGF0dXMpIHtcbiAgICAgICAgICBjYXNlICd1bnZlcmlmaWVkJzpcbiAgICAgICAgICAgIHJldHVybiAhdXNlci52ZXJpZmllZDtcbiAgICAgICAgICBjYXNlICdvcGVuQW5kSW5jb21wbGV0ZSc6XG4gICAgICAgICAgICByZXR1cm4gcmVnSXNPcGVuICYmIHVzZXIudmVyaWZpZWQgJiYgIXVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGU7XG4gICAgICAgICAgY2FzZSAnb3BlbkFuZFN1Ym1pdHRlZCc6XG4gICAgICAgICAgICByZXR1cm4gcmVnSXNPcGVuICYmIHVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xuICAgICAgICAgIGNhc2UgJ2Nsb3NlZEFuZEluY29tcGxldGUnOlxuICAgICAgICAgICAgcmV0dXJuICFyZWdJc09wZW4gJiYgIXVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xuICAgICAgICAgIGNhc2UgJ2Nsb3NlZEFuZFN1Ym1pdHRlZCc6IC8vIFdhaXRsaXN0ZWQgU3RhdGVcbiAgICAgICAgICAgIHJldHVybiAhcmVnSXNPcGVuICYmIHVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xuICAgICAgICAgIGNhc2UgJ2FkbWl0dGVkQW5kQ2FuQ29uZmlybSc6XG4gICAgICAgICAgICByZXR1cm4gIXBhc3RDb25maXJtYXRpb24gJiZcbiAgICAgICAgICAgICAgdXNlci5zdGF0dXMuYWRtaXR0ZWQgJiZcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmNvbmZpcm1lZCAmJlxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuZGVjbGluZWQ7XG4gICAgICAgICAgY2FzZSAnYWRtaXR0ZWRBbmRDYW5ub3RDb25maXJtJzpcbiAgICAgICAgICAgIHJldHVybiBwYXN0Q29uZmlybWF0aW9uICYmXG4gICAgICAgICAgICAgIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5jb25maXJtZWQgJiZcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmRlY2xpbmVkO1xuICAgICAgICAgIGNhc2UgJ2NvbmZpcm1lZCc6XG4gICAgICAgICAgICByZXR1cm4gdXNlci5zdGF0dXMuYWRtaXR0ZWQgJiYgdXNlci5zdGF0dXMuY29uZmlybWVkICYmICF1c2VyLnN0YXR1cy5kZWNsaW5lZDtcbiAgICAgICAgICBjYXNlICdkZWNsaW5lZCc6XG4gICAgICAgICAgICByZXR1cm4gdXNlci5zdGF0dXMuZGVjbGluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnNob3dXYWl0bGlzdCA9ICFyZWdJc09wZW4gJiYgdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSAmJiAhdXNlci5zdGF0dXMuYWRtaXR0ZWQ7XG5cbiAgICAgICRzY29wZS5yZXNlbmRFbWFpbCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIEF1dGhTZXJ2aWNlXG4gICAgICAgICAgLnJlc2VuZFZlcmlmaWNhdGlvbkVtYWlsKClcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBzd2FsKFwiQ2hlY2sgeW91ciBJbmJveCFcIiwgXCJZb3VyIGVtYWlsIGhhcyBiZWVuIHNlbnQuXCIsIFwic3VjY2Vzc1wiKTsgXG4gICAgICAgICAgICBcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIC8vICRzY29wZS5wcmludENvbmZpcm1hdGlvbiA9ZnVuY3Rpb24oSW1hZ2VVUkwpe1xuXG4gICAgICAvLyAgIGh0bWwyY2FudmFzKCQoJyNxckNvZGUnKSwge1xuICAgICAgLy8gICAgIGFsbG93VGFpbnQ6IHRydWUsXG4gICAgICAvLyAgICAgb25yZW5kZXJlZDogZnVuY3Rpb24gKGNhbnZhcykge1xuICAgICAgLy8gICAgICAgICB2YXIgaW1nRGF0YSA9IGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9qcGVnXCIsIDEuMCk7XG4gICAgICAvLyAgICAgICAgIHZhciBwZGYgPSBuZXcganNQREYoJ3AnLCAnbW0nLCAnYTAnKTtcbiAgXG4gICAgICAvLyAgICAgICAgIHBkZi5hZGRJbWFnZShpbWdEYXRhLCAnSlBFRycsIDAsIDApO1xuICAgICAgLy8gICAgICAgICBwZGYuc2F2ZShcIkN1cnJlbnQgRGF0YTIucGRmXCIpXG4gICAgICAvLyAgICAgfVxuICAgICAgLy8gfSk7XG4gICAgICBcbiAgICAgIC8vIH1cblxuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gVGV4dCFcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB2YXIgY29udmVydGVyID0gbmV3IHNob3dkb3duLkNvbnZlcnRlcigpO1xuICAgICAgJHNjb3BlLmFjY2VwdGFuY2VUZXh0ID0gJHNjZS50cnVzdEFzSHRtbChjb252ZXJ0ZXIubWFrZUh0bWwoU2V0dGluZ3MuYWNjZXB0YW5jZVRleHQpKTtcbiAgICAgICRzY29wZS5jb25maXJtYXRpb25UZXh0ID0gJHNjZS50cnVzdEFzSHRtbChjb252ZXJ0ZXIubWFrZUh0bWwoU2V0dGluZ3MuY29uZmlybWF0aW9uVGV4dCkpO1xuICAgICAgJHNjb3BlLndhaXRsaXN0VGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLndhaXRsaXN0VGV4dCkpO1xuXG4gICAgICAkc2NvcGUuZGVjbGluZUFkbWlzc2lvbiA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgIHN3YWwoe1xuICAgICAgICB0aXRsZTogXCJXaG9hIVwiLFxuICAgICAgICB0ZXh0OiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd291bGQgbGlrZSB0byBkZWNsaW5lIHlvdXIgYWRtaXNzaW9uPyBcXG5cXG4gWW91IGNhbid0IGdvIGJhY2shXCIsXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgY2FuY2VsOiB7XG4gICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb25maXJtOiB7XG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgSSBjYW4ndCBtYWtlIGl0XCIsXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgLmRlY2xpbmVBZG1pc3Npb24odXNlci5faWQpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgW1xuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJHNjb3BlJyxcbiAgICAnJGh0dHAnLFxuICAgICckc3RhdGUnLFxuICAgICdzZXR0aW5ncycsXG4gICAgJ1V0aWxzJyxcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgICdFVkVOVF9JTkZPJyxcbiAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkc3RhdGUsIHNldHRpbmdzLCBVdGlscywgQXV0aFNlcnZpY2UsIEVWRU5UX0lORk8pe1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAkc2NvcGUuRVZFTlRfSU5GTyA9IEVWRU5UX0lORk87XG5cbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XG4gICAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcblxuXG4gICAgICAvLyBJcyByZWdpc3RyYXRpb24gb3Blbj9cbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XG4gICAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcblxuICAgICAgLy8gU3RhcnQgc3RhdGUgZm9yIGxvZ2luXG4gICAgICAkc2NvcGUubG9naW5TdGF0ZSA9ICdsb2dpbic7XG5cbiAgICAgIGZ1bmN0aW9uIG9uU3VjY2VzcygpIHtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG9uRXJyb3IoZGF0YSl7XG4gICAgICAgICRzY29wZS5lcnJvciA9IGRhdGEubWVzc2FnZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVzZXRFcnJvcigpe1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuICAgICAgICByZXNldEVycm9yKCk7XG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luV2l0aFBhc3N3b3JkKFxuICAgICAgICAgICRzY29wZS5lbWFpbCwgJHNjb3BlLnBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRXJyb3IpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24oKXtcbiAgICAgICAgcmVzZXRFcnJvcigpO1xuICAgICAgICBBdXRoU2VydmljZS5yZWdpc3RlcihcbiAgICAgICAgICAkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZCwgb25TdWNjZXNzLCBvbkVycm9yKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zZXRMb2dpblN0YXRlID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgJHNjb3BlLmxvZ2luU3RhdGUgPSBzdGF0ZTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zZW5kUmVzZXRFbWFpbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZW1haWwgPSAkc2NvcGUuZW1haWw7XG4gICAgICAgIEF1dGhTZXJ2aWNlLnNlbmRSZXNldEVtYWlsKGVtYWlsKTtcbiAgICAgICAgc3dhbChcIkRvbid0IHN3ZWF0IVwiLCBcIkFuIGVtYWlsIHNob3VsZCBiZSBzZW50IHRvIHlvdSBzaG9ydGx5LlwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICB9O1xuXG5cblxuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdDaGFsbGVuZ2VzQ3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRzdGF0ZScsXG4gICAgJyRodHRwJyxcbiAgICAnY3VycmVudFVzZXInLFxuICAgICdTZXNzaW9uJyxcbiAgICAnQ2hhbGxlbmdlU2VydmljZScsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICAnU29sdmVkQ1RGU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRodHRwLCBjdXJyZW50VXNlciwgU2Vzc2lvbiwgQ2hhbGxlbmdlU2VydmljZSwgVXNlclNlcnZpY2UsIFNvbHZlZENURlNlcnZpY2UpIHtcblxuICAgICAgXG4gICAgICBTb2x2ZWRDVEZTZXJ2aWNlLmdldEFsbCgpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICBzb2x2ZWRDaGFsbGVuZ2VzPSByZXNwb25zZS5kYXRhLmZpbHRlcihzID0+IHMudXNlcj09Y3VycmVudFVzZXIuZGF0YS5faWQpXG4gICAgICB9KTtcblxuICAgICAgXG5cbiAgICAgIENoYWxsZW5nZVNlcnZpY2UuZ2V0QWxsKCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICRzY29wZS5jaGFsbGVuZ2VzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIH0pO1xuXG5cblxuICAgICAgZnVuY3Rpb24gb25TdWNjZXNzKGNoYWxsZW5nZSkge1xuICAgICAgICBzd2FsKFwiQXdlc29tZSFcIiwgXCJUaGF0J3MgY29ycmVjdCwgYW5kIHlvdSBqdXN0IGVhcm5lZCArXCIrIGNoYWxsZW5nZS5wb2ludHMgK1wiIHBvaW50cy5cIiwgXCJzdWNjZXNzXCIpXG4gICAgICAgICRzdGF0ZS5yZWxvYWQoKVxuXG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG9uRXJyb3IoZGF0YSl7XG4gICAgICAgIHN3YWwoXCJUcnkgYWdhaW4hXCIsIGRhdGEubWVzc2FnZSwgXCJlcnJvclwiKSBcbiAgICAgIH1cblxuXG4gICAgICAkc2NvcGUuc29sdmVDaGFsbGVuZ2UgPSBmdW5jdGlvbihjaGFsbGVuZ2UsYW5zd2VyLCBpc2VudGVyKSB7XG4gICAgICAgIGlmIChpc2VudGVyKXtcbiAgICAgICAgICBTb2x2ZWRDVEZTZXJ2aWNlLnNvbHZlKGNoYWxsZW5nZSxjdXJyZW50VXNlcixhbnN3ZXIsb25TdWNjZXNzLG9uRXJyb3IpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBTb2x2ZWRDVEZTZXJ2aWNlLnNvbHZlKGNoYWxsZW5nZSxjdXJyZW50VXNlcixhbnN3ZXIsb25TdWNjZXNzKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgIH1cblxuICAgICAgXG4gICAgICAkc2NvcGUuc2hvd0NoYWxsZW5nZSA9IGZ1bmN0aW9uKGNoYWxsZW5nZSkge1xuXG4gICAgICAgIENoYWxsZW5nZVNlcnZpY2UuZ2V0KGNoYWxsZW5nZS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xuXG4gICAgICAgICAgc3dhbChyZXNwb25zZS5kYXRhLnRpdGxlLCByZXNwb25zZS5kYXRhLmRlc2NyaXB0aW9uKVxuXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuXG5cbiAgICAgIFNvbHZlZENURlNlcnZpY2UuZ2V0QWxsKCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIGFsbENoYWxsZW5nZXM9IHJlc3BvbnNlLmRhdGFcbiAgICAgICAgdmFyIFJlc3VsdCA9W11cblxuICAgICAgICBhbGxDaGFsbGVuZ2VzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgdXNlckNoYWxsZW5nZXMgPSBhbGxDaGFsbGVuZ2VzLmZpbHRlcihzID0+IHMudXNlcj09ZWxlbWVudC51c2VyKVxuICAgICAgICAgIHZhciBwb2ludHNDb3VudCA9IDA7XG5cbiAgICAgICAgICB1c2VyQ2hhbGxlbmdlcy5mb3JFYWNoKGNoYWxsZW5nZSA9PiB7IHBvaW50c0NvdW50Kz1jaGFsbGVuZ2UucG9pbnRzIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIFVzZXJTZXJ2aWNlLmdldChlbGVtZW50LnVzZXIpLnRoZW4odXNlciA9PntcblxuICAgICAgICAgICAgdmFyIGdyYWRlPVtdXG4gICAgICAgICAgICBncmFkZVsyMDE5XSA9IFwiM0NTXCJcbiAgICAgICAgICAgIGdyYWRlWzIwMjBdID0gXCIyQ1NcIlxuICAgICAgICAgICAgZ3JhZGVbMjAyMV0gPSBcIjFDU1wiXG4gICAgICAgICAgICBncmFkZVsyMDIyXSA9IFwiMkNQXCJcbiAgICAgICAgICAgIGdyYWRlWzIwMjNdID0gXCIxQ1BcIlxuXG4gICAgICAgICAgICBpZiAocG9pbnRzQ291bnQ+MCkge1Jlc3VsdC5wdXNoKHsgaWQ6dXNlci5kYXRhLl9pZCwgbmFtZTogdXNlci5kYXRhLnByb2ZpbGUubmFtZSwgZ3JhZGU6IGdyYWRlW3VzZXIuZGF0YS5wcm9maWxlLmdyYWR1YXRpb25ZZWFyXSAscG9pbnRzOiBwb2ludHNDb3VudH0pfVxuXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGFsbENoYWxsZW5nZXMgPSBhbGxDaGFsbGVuZ2VzLmZpbHRlcihzID0+IHMudXNlciE9PWVsZW1lbnQudXNlcilcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLlJlc3VsdCA9IFJlc3VsdDtcbiAgICAgIH0pO1xuICAgIFxuXG4gICAgICAkc2NvcGUucm93Q2xhc3MgPSBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAodXNlci5pZD09Y3VycmVudFVzZXIuZGF0YS5faWQpIHtcbiAgICAgICAgICByZXR1cm4gXCJhZG1pblwiO1xuICAgICAgICB9XG4gICAgICB9O1xuICBcbiAgICAgIFxuXG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRodHRwJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnc2V0dGluZ3MnLFxuICAgICdVdGlscycsXG4gICAgJ0F1dGhTZXJ2aWNlJyxcbiAgICAnRVZFTlRfSU5GTycsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJHN0YXRlLCBzZXR0aW5ncywgVXRpbHMsIEF1dGhTZXJ2aWNlLCBFVkVOVF9JTkZPKXtcblxuICAgICAgJHNjb3BlLkVWRU5UX0lORk8gPSBFVkVOVF9JTkZPO1xuXG4gICAgICAvLyBJcyByZWdpc3RyYXRpb24gb3Blbj9cbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XG4gICAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcblxuICAgICAgLy8gU3RhcnQgc3RhdGUgZm9yIGxvZ2luXG4gICAgICAkc2NvcGUubG9naW5TdGF0ZSA9ICdsb2dpbic7XG5cbiAgICAgIGZ1bmN0aW9uIG9uU3VjY2VzcygpIHtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG9uRXJyb3IoZGF0YSl7XG4gICAgICAgICRzY29wZS5lcnJvciA9IGRhdGEubWVzc2FnZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVzZXRFcnJvcigpe1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuICAgICAgICByZXNldEVycm9yKCk7XG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luV2l0aFBhc3N3b3JkKFxuICAgICAgICAgICRzY29wZS5lbWFpbCwgJHNjb3BlLnBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRXJyb3IpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24oKXtcbiAgICAgICAgcmVzZXRFcnJvcigpO1xuICAgICAgICBBdXRoU2VydmljZS5yZWdpc3RlcihcbiAgICAgICAgICAkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZCwgb25TdWNjZXNzLCBvbkVycm9yKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zZXRMb2dpblN0YXRlID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgJHNjb3BlLmxvZ2luU3RhdGUgPSBzdGF0ZTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zZW5kUmVzZXRFbWFpbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZW1haWwgPSAkc2NvcGUuZW1haWw7XG4gICAgICAgIEF1dGhTZXJ2aWNlLnNlbmRSZXNldEVtYWlsKGVtYWlsKTtcbiAgICAgICAgc3dhbChcIkRvbid0IHN3ZWF0IVwiLCBcIkFuIGVtYWlsIHNob3VsZCBiZSBzZW50IHRvIHlvdSBzaG9ydGx5LlwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICB9O1xuXG4gICAgfVxuICBdKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignUmVzZXRDdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICckc3RhdGVQYXJhbXMnLFxuICAgICckc3RhdGUnLFxuICAgICdBdXRoU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSwgQXV0aFNlcnZpY2Upe1xuICAgICAgdmFyIHRva2VuID0gJHN0YXRlUGFyYW1zLnRva2VuO1xuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICRzY29wZS5jaGFuZ2VQYXNzd29yZCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBwYXNzd29yZCA9ICRzY29wZS5wYXNzd29yZDtcbiAgICAgICAgdmFyIGNvbmZpcm0gPSAkc2NvcGUuY29uZmlybTtcblxuICAgICAgICBpZiAocGFzc3dvcmQgIT09IGNvbmZpcm0pe1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IFwiUGFzc3dvcmRzIGRvbid0IG1hdGNoIVwiO1xuICAgICAgICAgICRzY29wZS5jb25maXJtID0gXCJcIjtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBBdXRoU2VydmljZS5yZXNldFBhc3N3b3JkKFxuICAgICAgICAgIHRva2VuLFxuICAgICAgICAgICRzY29wZS5wYXNzd29yZCxcbiAgICAgICAgICBtZXNzYWdlID0+IHtcbiAgICAgICAgICAgIHN3YWwoXCJOZWF0byFcIiwgXCJZb3VyIHBhc3N3b3JkIGhhcyBiZWVuIGNoYW5nZWQhXCIsIFwic3VjY2Vzc1wiKS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiaG9tZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YSA9PiB7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBkYXRhLm1lc3NhZ2U7XG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5zZXJ2aWNlKCdzZXR0aW5ncycsIGZ1bmN0aW9uKCkge30pXG4gIC5jb250cm9sbGVyKCdTaWRlYmFyQ3RybCcsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRzY29wZScsXG4gICAgJ1NldHRpbmdzU2VydmljZScsXG4gICAgJ1V0aWxzJyxcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgICdTZXNzaW9uJyxcbiAgICAnRVZFTlRfSU5GTycsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCBTZXR0aW5nc1NlcnZpY2UsIFV0aWxzLCBBdXRoU2VydmljZSwgU2Vzc2lvbiwgRVZFTlRfSU5GTyl7XG5cbiAgICAgIHZhciB1c2VyID0gJHJvb3RTY29wZS5jdXJyZW50VXNlcjtcblxuICAgICAgJHNjb3BlLkVWRU5UX0lORk8gPSBFVkVOVF9JTkZPO1xuXG4gICAgICAkc2NvcGUucGFzdENvbmZpcm1hdGlvbiA9IFV0aWxzLmlzQWZ0ZXIodXNlci5zdGF0dXMuY29uZmlybUJ5KTtcbiAgICAgIC8vJHNjb3BlLnBhc3RTYXRhcnQgPSBVdGlscy5pc0FmdGVyKHNldHRpbmdzLnRpbWVTdGFydCk7XG5cbiAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgLmdldFB1YmxpY1NldHRpbmdzKClcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgJHNjb3BlLnBhc3RTYXRhcnQgPSBVdGlscy5pc0FmdGVyKHJlc3BvbnNlLmRhdGEudGltZVN0YXJ0KVxuICAgICAgfSk7XG5cbiAgICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zaG93U2lkZWJhciA9IGZhbHNlO1xuICAgICAgJHNjb3BlLnRvZ2dsZVNpZGViYXIgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUuc2hvd1NpZGViYXIgPSAhJHNjb3BlLnNob3dTaWRlYmFyO1xuICAgICAgfTtcblxuICAgICAgLy8gb2ggZ29kIGpRdWVyeSBoYWNrXG4gICAgICAkKCcuaXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5zaG93U2lkZWJhciA9IGZhbHNlO1xuICAgICAgfSk7XG5cbiAgICB9XSk7XG4iLCIvKlxuKlxuKiBUT0RPOiBSZXZpc2UgaXNKb2luZWRcbipcbiovXG5cbmFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignVGVhbUN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRzdGF0ZScsXG4gICAgJyR0aW1lb3V0JyxcbiAgICAnY3VycmVudFVzZXInLFxuICAgICdzZXR0aW5ncycsXG4gICAgJ1V0aWxzJyxcbiAgICAnVXNlclNlcnZpY2UnLFxuICAgICdUZWFtU2VydmljZScsXG4gICAgJ1RFQU0nLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkdGltZW91dCwgY3VycmVudFVzZXIsIHNldHRpbmdzLCBVdGlscywgVXNlclNlcnZpY2UsIFRlYW1TZXJ2aWNlLCBURUFNKXtcbiAgICAgIC8vIEdldCB0aGUgY3VycmVudCB1c2VyJ3MgbW9zdCByZWNlbnQgZGF0YS5cbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XG4gICAgICBcbiAgICAgICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xuXG4gICAgICAkc2NvcGUudXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XG5cbiAgICAgIGZ1bmN0aW9uIGlzVGVhbU1lbWJlcih0ZWFtcyxVc2VyaWQpIHtcbiAgICAgICAgdmFyIHRlc3QgPSBmYWxzZTtcbiAgICAgICAgdGVhbXMuZm9yRWFjaCh0ZWFtID0+IHtcbiAgICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4geyAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKG1lbWJlci5pZD09VXNlcmlkKSB0ZXN0ID0gdHJ1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7ICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRlc3Q7XG4gICAgICB9XG5cbiAgICAgIFxuICAgICAgVGVhbVNlcnZpY2UuZ2V0QWxsKCkudGhlbih0ZWFtcyA9PiB7XG4gICAgICAgICRzY29wZS5pc1RlYW1BZG1pbj1mYWxzZTtcbiAgICAgICAgJHNjb3BlLmlzVGVhbU1lbWJlcj1mYWxzZTtcbiAgICAgICAgdGVhbXMuZGF0YS5mb3JFYWNoKHRlYW0gPT4ge1xuICAgICAgICAgIHRlYW0uaXNNYXh0ZWFtID0gZmFsc2U7XG5cbiAgICAgICAgICBpZiAodGVhbS5tZW1iZXJzLmxlbmd0aD49U2V0dGluZ3MubWF4VGVhbVNpemUpe1xuICAgICAgICAgICAgdGVhbS5pc0NvbG9zZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGVhbS5pc01heHRlYW0gPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRlYW0uaXNqb2luZWQ9ZmFsc2U7XG4gICAgICAgICAgaWYodGVhbS5tZW1iZXJzWzBdLmlkPT1jdXJyZW50VXNlci5kYXRhLl9pZCl7XG4gICAgICAgICAgICB0ZWFtLmpvaW5SZXF1ZXN0cy5mb3JFYWNoKG1lbWJlciA9PiB7ICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYgKGlzVGVhbU1lbWJlcih0ZWFtcy5kYXRhLG1lbWJlci5pZCkpe1xuICAgICAgICAgICAgICAgIG1lbWJlci51bmF2YWlsYWJsZT10cnVlO1xuICAgICAgICAgICAgICB9ZWxzZXttZW1iZXIudW5hdmFpbGFibGU9ZmFsc2V9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzY29wZS51c2VyQWRtaW5UZWFtID0gdGVhbTtcbiAgICAgICAgICAgICRzY29wZS5pc1RlYW1BZG1pbj10cnVlO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+e1xuICAgICAgICAgICAgICBpZihtZW1iZXIuaWQ9PWN1cnJlbnRVc2VyLmRhdGEuX2lkKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUudXNlck1lbWJlclRlYW0gPSB0ZWFtO1xuICAgICAgICAgICAgICAgICRzY29wZS5pc1RlYW1NZW1iZXI9dHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRlYW0uam9pblJlcXVlc3RzLmZvckVhY2gobWVtYmVyID0+e1xuICAgICAgICAgICAgICBpZihtZW1iZXIuaWQ9PWN1cnJlbnRVc2VyLmRhdGEuX2lkKXtcbiAgICAgICAgICAgICAgICB0ZWFtLmlzam9pbmVkPXRydWU7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgJHNjb3BlLnRlYW1zID0gdGVhbXMuZGF0YTtcblxuICAgICAgfSk7XG5cblxuICAgICAgJHNjb3BlLmNyZWF0ZVRlYW0gPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB0ZWFtRGF0YSA9IHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJHNjb3BlLm5ld1RlYW1fZGVzY3JpcHRpb24sXG4gICAgICAgICAgbWVtYmVyczogW3tpZDpjdXJyZW50VXNlci5kYXRhLl9pZCwgbmFtZTpjdXJyZW50VXNlci5kYXRhLnByb2ZpbGUubmFtZSwgc2tpbGw6ICRzY29wZS5uZXdUZWFtX0FkbWluc2tpbGx9XSxcbiAgICAgICAgICBza2lsbHM6IHtjb2RlOiAkc2NvcGUuc2tpbGxjb2RlLGRlc2lnbjogJHNjb3BlLnNraWxsZGVzaWduLGhhcmR3YXJlOiAkc2NvcGUuc2tpbGxoYXJkd2FyZSxpZGVhOiAkc2NvcGUuc2tpbGxpZGVhfSxcbiAgICAgICAgICBpc0NvbG9zZWQ6IGZhbHNlLFxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKHRlYW1EYXRhKTtcbiAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLm5ld1RlYW1fQWRtaW5za2lsbCk7XG4gICAgICAgIFxuICAgICAgICBUZWFtU2VydmljZS5jcmVhdGUodGVhbURhdGEpO1xuICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICB9O1xuXG5cbiAgICAgICRzY29wZS5TaG93Y3JlYXRlVGVhbSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5TaG93TmV3VGVhbUZyb20gPSB0cnVlOyAgXG4gICAgICAgICRzY29wZS5za2lsbGNvZGUgPXRydWVcbiAgICAgICAgJHNjb3BlLnNraWxsZGVzaWduID10cnVlXG4gICAgICAgICRzY29wZS5za2lsbGhhcmR3YXJlID10cnVlXG4gICAgICAgICRzY29wZS5za2lsbGlkZWEgPXRydWVcbiAgICAgICAgJHNjb3BlLm5ld1RlYW1fQWRtaW5za2lsbD1cImNvZGVcIlxuICAgICAgfVxuXG5cbiAgICAgICRzY29wZS5qb2luVGVhbSA9IGZ1bmN0aW9uKHRlYW1JRCkge1xuICAgICAgICBuZXd1c2VyPSB7aWQ6Y3VycmVudFVzZXIuZGF0YS5faWQsIG5hbWU6Y3VycmVudFVzZXIuZGF0YS5wcm9maWxlLm5hbWUsIHNraWxsOlwiZGVzaWduXCJ9O1xuICAgICAgICBUZWFtU2VydmljZS5qb2luKHRlYW1JRCxuZXd1c2VyKTsgXG5cbiAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgICAgfVxuXG5cbiAgICAgICRzY29wZS5hY2NlcHRNZW1iZXIgPSBmdW5jdGlvbih0ZWFtSUQsIG1lbWJlciwgaW5kZXgpIHtcblxuICAgICAgICBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBhY2NlcHQgXCIgKyBtZW1iZXIubmFtZSArIFwiIHRvIHlvdXIgdGVhbSEgVGhpcyB3aWxsIHNlbmQgaGltIGEgbm90aWZpY2F0aW9uIGVtYWlsIGFuZCB3aWxsIHNob3cgaW4gdGhlIHB1YmxpYyB0ZWFtcyBwYWdlLlwiLFxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoZWNrSW46IHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBsZXQgaGltIGluXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIFRlYW1TZXJ2aWNlLmFjY2VwdE1lbWJlcih0ZWFtSUQsbWVtYmVyLFNldHRpbmdzLm1heFRlYW1TaXplKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZT09XCJtYXhUZWFtU2l6ZVwiKXtcbiAgICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgICBcIkVycm9yXCIsXG4gICAgICAgICAgICAgICAgXCJNYXhpbXVtIG51bWJlciBvZiBtZW1iZXJzIChcIitTZXR0aW5ncy5tYXhUZWFtU2l6ZStcIikgcmVhY2hlZFwiLFxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW1JRCxpbmRleCxmYWxzZSkudGhlbihyZXNwb25zZTIgPT4ge1xuICAgICAgICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICAgICAgICBcIkFjY2VwdGVkXCIsXG4gICAgICAgICAgICAgICAgICBtZW1iZXIubmFtZSArIFwiIGhhcyBiZWVuIGFjY2VwdGVkIHRvIHlvdXIgdGVhbS5cIixcbiAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgICAgICAgIH0pOyAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7ICAgICAgXG4gICAgICB9XG5cblxuXG4gICAgICAkc2NvcGUucmVmdXNlTWVtYmVyID0gZnVuY3Rpb24odGVhbUlELCBtZW1iZXIsIGluZGV4KSB7XG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIHJlZnVzZSBcIiArIG1lbWJlci5uYW1lICsgXCIgZnJvbSB5b3VyIHRlYW0hIFRoaXMgd2lsbCBzZW5kIGhpbSBhIG5vdGlmaWNhdGlvbiBlbWFpbC5cIixcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGVja0luOiB7XG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVmdXNlIGhpbVwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW1JRCxpbmRleCxtZW1iZXIpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgXCJSZWZ1c2VkXCIsXG4gICAgICAgICAgICAgIG1lbWJlci5uYW1lICsgXCIgaGFzIGJlZW4gcmVmdXNlZCBmcm9tIHlvdXIgdGVhbS5cIixcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pOyAgICAgIFxuICAgICAgfVxuXG5cbiAgICAgICRzY29wZS5yZW1vdmVNZW1iZXJmcm9tVGVhbSA9IGZ1bmN0aW9uKHRlYW1JRCwgbWVtYmVyLCBpbmRleCkge1xuICAgICAgICBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byByZW1vdmUgXCIgKyBtZW1iZXIubmFtZSArIFwiIGZyb20geW91ciB0ZWFtISBUaGlzIHdpbGwgc2VuZCBoaW0gYSBub3RpZmljYXRpb24gZW1haWwuXCIsXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgY2FuY2VsOiB7XG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hlY2tJbjoge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSBoaW1cIixcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3ZlbWVtYmVyKHRlYW1JRCxpbmRleCxtZW1iZXIuaWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlPT1cInJlbW92aW5nQWRtaW5cIil7XG4gICAgICAgICAgICAgIHN3YWwoXG4gICAgICAgICAgICAgICAgXCJFcnJvclwiLFxuICAgICAgICAgICAgICAgIFwiWW91IGNhbid0IHJlbW92ZSB0aGUgVGVhbSBBZG1pbiwgQnV0IHlvdSBjYW4gY2xvc2UgdGhlIHRlYW0uXCIsXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZWpvaW4odGVhbUlELGluZGV4LGZhbHNlKS50aGVuKHJlc3BvbnNlMiA9PiB7XG4gICAgICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxuICAgICAgICAgICAgICAgICAgbWVtYmVyLm5hbWUgKyBcIiBoYXMgYmVlbiByZW1vdmVkIGZyb20geW91ciB0ZWFtLlwiLFxuICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICAgICAgICApOyAgICBcbiAgICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgICAgICAgIH0pOyAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7ICAgICAgXG4gICAgICB9XG5cblxuXG4gICAgICAkc2NvcGUucmVtb3ZlVGVhbSA9IGZ1bmN0aW9uKHRlYW0pIHtcbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVtb3ZlIHRoaXMgdGVhbSB3aXRoIGFsbCBpdCdzIG1lbWJlcnMhIFRoaXMgd2lsbCBzZW5kIHRoZW0gYSBub3RpZmljYXRpb24gZW1haWwuIFlvdSBuZWVkIHRvIGZpbmQgYW5vdGhlciB0ZWFtIHRvIHdvcmsgd2l0aC5cIixcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGVja0luOiB7XG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVtb3ZlIHRlYW1cIixcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBlbWFpbCA9IHsgXG4gICAgICAgICAgICBzdWJqZWN0OlwiWW91ciB0ZWFtIGhhcyBiZWVuIHJlbW92ZWRcIiwgXG4gICAgICAgICAgICB0aXRsZTpcIlRpbWUgZm9yIGEgYmFja3VwIHBsYW5cIixcbiAgICAgICAgICAgIGJvZHk6XCJUaGUgdGVhbSB5b3UgaGF2ZSBiZWVuIHBhcnQgKE1lbWJlci9yZXF1ZXN0ZWQgdG8gam9pbikgb2YgaGFzIGJlZW4gcmVtb3ZlZC4gUGxlYXNlIGNoZWNrIHlvdXIgZGFzaGJvYXJkIGFuZCB0cnkgdG8gZmluZCBhbm90aGVyIHRlYW0gdG8gd29yayB3aXRoIGJlZm9yZSB0aGUgaGFja2F0aG9uIHN0YXJ0cy5cIiBcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmUodGVhbS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2godXNlciA9PiB7XG4gICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnNlbmRCYXNpY01haWwodXNlci5pZCxlbWFpbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRlYW0uam9pblJlcXVlc3RzLmZvckVhY2godXNlciA9PiB7XG4gICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnNlbmRCYXNpY01haWwodXNlci5pZCxlbWFpbCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXG4gICAgICAgICAgICAgIFwiVGVhbSBoYXMgYmVlbiByZW1vdmVkLlwiLFxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7ICAgICAgXG4gICAgICB9XG5cblxuICAgICAgJHNjb3BlLmxlYXZlVGVhbSA9IGZ1bmN0aW9uKHRlYW0pIHtcbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gbGVhdmUgeW91ciB0ZWFtISBUaGlzIHdpbGwgc2VuZCB0aGUgYWRtaW4gYSBub3RpZmljYXRpb24gZW1haWwuXCIsXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgY2FuY2VsOiB7XG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hlY2tJbjoge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSBoaW1cIixcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGluZGV4PTA7XG4gICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcbiAgICAgICAgICAgIGlmIChtZW1iZXIuaWQ9PWN1cnJlbnRVc2VyLmRhdGEuX2lkKSB7XG4gICAgICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZW1lbWJlcih0ZWFtLl9pZCxpbmRleCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgc3dhbChcbiAgICAgICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxuICAgICAgICAgICAgICAgICAgXCJZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgbGVmdCB0aGlzIHRlYW0uIFBsZWFzZSBmaW5kIGFub3RoZXIgdGVhbSBvciBjcmVhdGUgeW91ciBvd24uXCIsXG4gICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSk7ICAgICAgXG4gICAgICB9XG5cblxuICAgICAgJHNjb3BlLmNhbmNlbGpvaW5UZWFtID0gZnVuY3Rpb24odGVhbSkge1xuICAgICAgICBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBjYW5jZWwgeW91ciByZXF1ZXN0IHRvIGpvaW4gdGhpcyB0ZWFtIVwiLFxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgICAgICB0ZXh0OiBcIk5vXCIsXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hlY2tJbjoge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIENhbmNlbFwiLFxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgaW5kZXg9MDtcbiAgICAgICAgICBcbiAgICAgICAgICB0ZWFtLmpvaW5SZXF1ZXN0cy5mb3JFYWNoKG1lbWJlciA9PiB7XG4gICAgICAgICAgICBpZiAobWVtYmVyLmlkPT1jdXJyZW50VXNlci5kYXRhLl9pZCkge1xuICAgICAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW0uX2lkLGluZGV4LGZhbHNlKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBzd2FsKFxuICAgICAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXG4gICAgICAgICAgICAgICAgICBcIllvdSBoYXZlIHN1Y2Nlc3NmdWxseSBjYW5jZWxlZCB5b3UgcmVxdWVzdCB0byBqb2luIHRoaXMgdGVhbS4gUGxlYXNlIGZpbmQgYW5vdGhlciB0ZWFtIG9yIGNyZWF0ZSB5b3VyIG93bi5cIixcbiAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICB9KVxuICAgICAgICB9KTsgICAgICBcbiAgICAgIH1cblxuXG4gICAgICAkc2NvcGUudG9nZ2xlQ2xvc2VUZWFtID0gZnVuY3Rpb24odGVhbUlELHN0YXR1cykge1xuICAgICAgICBpZiAoc3RhdHVzPT10cnVlKXt0ZXh0PVwiWW91IGFyZSBhYm91dCB0byBDbG9zZSB0aGlzIHRlYW0uIFRoaXMgd29uJ3QgYWxsb3cgb3RoZXIgbWVtYmVycyB0byBqb2luIHlvdXIgdGVhbSFcIlxuICAgICAgICB9ZWxzZXt0ZXh0PVwiWW91IGFyZSBhYm91dCB0byByZW9wZW4gdGhpcyB0ZWFtLiBUaGlzIHdpbGwgYWxsb3cgb3RoZXIgbWVtYmVycyB0byBqb2luIHlvdXIgdGVhbSFcIn1cblxuICAgICAgICBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgY2FuY2VsOiB7XG4gICAgICAgICAgICAgIHRleHQ6IFwiTm9cIixcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGVja0luOiB7XG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgICB0ZXh0OiBcIlllc1wiLFxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBUZWFtU2VydmljZS50b2dnbGVDbG9zZVRlYW0odGVhbUlELHN0YXR1cykudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBzd2FsKFxuICAgICAgICAgICAgICBcIkRvbmVcIixcbiAgICAgICAgICAgICAgXCJPcGVyYXRpb24gc3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIixcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pOyAgICAgIFxuICAgICAgfVxuXG5cbiAgICAgICRzY29wZS4kd2F0Y2goXCJxdWVyeVRleHRcIiwgZnVuY3Rpb24ocXVlcnlUZXh0KSB7XG4gICAgICAgIFRlYW1TZXJ2aWNlLmdldFNlbGVjdGVkVGVhbXMocXVlcnlUZXh0LCAkc2NvcGUuc2tpbGxzRmlsdGVycykudGhlbihcbiAgICAgICAgICByZXNwb25zZSA9PiB7ICAgICAgICAgICAgXG4gICAgICAgICAgICAkc2NvcGUudGVhbXMgPSByZXNwb25zZS5kYXRhLnRlYW1zO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICBcbiAgICAgICRzY29wZS5hcHBseXNraWxsc0ZpbHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgVGVhbVNlcnZpY2UuZ2V0U2VsZWN0ZWRUZWFtcygkc2NvcGUucXVlcnlUZXh0LCAkc2NvcGUuc2tpbGxzRmlsdGVycykudGhlbihcbiAgICAgICAgICByZXNwb25zZSA9PiB7ICAgICAgICAgICAgXG4gICAgICAgICAgICAkc2NvcGUudGVhbXMgPSByZXNwb25zZS5kYXRhLnRlYW1zO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH07XG4gIFxuXG5cblxuXG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdWZXJpZnlDdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICckc3RhdGVQYXJhbXMnLFxuICAgICdBdXRoU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIEF1dGhTZXJ2aWNlKXtcbiAgICAgIHZhciB0b2tlbiA9ICRzdGF0ZVBhcmFtcy50b2tlbjtcblxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgQXV0aFNlcnZpY2UudmVyaWZ5KHRva2VuLFxuICAgICAgICAgIGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSB0cnVlO1xuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1dKTtcbiJdfQ==
