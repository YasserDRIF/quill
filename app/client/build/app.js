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
      .state('app.admin.teams', {
        url: "/admin/teams",
        templateUrl: "views/admin/teams/teams.html",
        controller: 'AdminTeamCtrl',
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

      getPage: function(page, size, text,statusFilters,NotstatusFilters) {
        return $http.get( users + "?" + $.param({
              text: text,
              page: page ? page : 0,
              size: size ? size : 20,
              statusFilters: statusFilters ? statusFilters : {},
              NotstatusFilters: NotstatusFilters ? NotstatusFilters : {}

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
.controller('AdminTeamCtrl', [
  '$scope',
  '$state',
  '$timeout',
  'currentUser',
  'settings',
  'Utils',
  'UserService',
  'TeamService',
  'TEAM',
  function ($scope, $state, $timeout, currentUser, settings, Utils, UserService, TeamService, TEAM) {
    // Get the current user's most recent data. 
    var Settings = settings.data;

    $scope.regIsOpen = Utils.isRegOpen(Settings);

    $scope.user = currentUser.data;

    function isTeamMember(teams, Userid) {
      var test = false;
      teams.forEach(team => {
        team.members.forEach(member => {
          if (member.id == Userid) test = true;
        });
      });
      return test;
    }

    function selectMember(memberId) {
      UserService.get(memberId).then(response => {
        user = response.data
        $scope.selectedUser = user;
        $scope.selectedUser.sections = generateSections(user);
      });
      console.log(user);
      $(".long.user.modal").modal("show");
    }

    function generateSections(user) {
      return [
        {
          name: "Profile",
          fields: [
            {
              name: "Gender",
              value: user.profile.gender
            },
            {
              name: "School",
              value: user.profile.school
            },
            {
              name: "Github",
              value: user.profile.github
            },
            {
              name: "Linkedin",
              value: user.profile.linkedin
            },
          ]
        },
      ];
    }

    function formatTime(time) {
      if (time) {
        return moment(time).format("MMMM Do YYYY, h:mm:ss a");
      }
    }

    $scope.selectMember = selectMember;


    $scope.isjoined = function (team) {
      var test = false;
      team.joinRequests.forEach(member => {
        if (member.id == currentUser.data._id) test = true;
      })
      return test;
    }

    TeamService.getAll().then(teams => {
      console.log(teams.data);

      $scope.isTeamAdmin = false;
      $scope.isTeamMember = false;
      teams.data.forEach(team => {
        team.isMaxteam = false;

        if (team.members.length >= Settings.maxTeamSize) {
          team.isColosed = true;
          team.isMaxteam = true;
        }

        if (team.members[0].id == currentUser.data._id) {
          team.joinRequests.forEach(member => {
            if (isTeamMember(teams.data, member.id)) {
              member.unavailable = true;
            } else { member.unavailable = false }
          });
          $scope.userAdminTeam = team;
          $scope.isTeamAdmin = true;
        } else {
          team.members.forEach(member => {
            if (member.id == currentUser.data._id) {
              $scope.userMemberTeam = team;
              $scope.isTeamMember = true;
            }
          })
        }
      })
      
      $scope.teams = teams.data;

    });


    $scope.createTeam = function () {

      teamData = {
        description: $scope.newTeam_description,
        members: [{ id: currentUser.data._id, name: currentUser.data.profile.name, skill: $scope.newTeam_Adminskill }],
        skills: { code: $scope.skillcode, design: $scope.skilldesign, hardware: $scope.skillhardware, idea: $scope.skillidea },
        isColosed: false,
      }
      console.log(teamData);
      console.log($scope.newTeam_Adminskill);

      TeamService.create(teamData);
      $state.reload();
    };


    $scope.ShowcreateTeam = function () {
      $scope.ShowNewTeamFrom = true;
      $scope.skillcode = true
      $scope.skilldesign = true
      $scope.skillhardware = true
      $scope.skillidea = true
      $scope.newTeam_Adminskill = "code"
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


      if (team.skills.code) {
        option = document.createElement('option');
        option.innerHTML = 'Code';
        option.value = "code"
        select.appendChild(option);
      }
      if (team.skills.design) {
        option = document.createElement('option');
        option.innerHTML = 'Design';
        option.value = "design"
        select.appendChild(option);
      }
      if (team.skills.hardware) {
        option = document.createElement('option');
        option.innerHTML = 'Hardware';
        option.value = "hardware"
        select.appendChild(option);
      }
      if (team.skills.idea) {
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
      }).then(function () {

        newuser = { id: currentUser.data._id, name: currentUser.data.profile.name, skill: value };
        TeamService.join(team._id, newuser);
        swal(
          "Joined",
          "You have appliced to join this team, wait for the Team-Admin to accept your application.",
          "success"
        );
        $state.reload();
      })
    }


    $scope.acceptMember = function (teamID, member, index) {

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
        TeamService.acceptMember(teamID, member, Settings.maxTeamSize).then(response => {
          if (response == "maxTeamSize") {
            swal(
              "Error",
              "Maximum number of members (" + Settings.maxTeamSize + ") reached",
              "error"
            );
          } else {
            TeamService.removejoin(teamID, index, false).then(response2 => {
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



    $scope.refuseMember = function (teamID, member, index) {
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
        TeamService.removejoin(teamID, index, member).then(response => {
          swal(
            "Refused",
            member.name + " has been refused from your team.",
            "success"
          );
          $state.reload();
        });
      });
    }


    $scope.removeMemberfromTeam = function (teamID, member, index) {
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
        TeamService.removemember(teamID, index, member.id).then(response => {
          if (response == "removingAdmin") {
            swal(
              "Error",
              "You can't remove the Team Admin, But you can close the team.",
              "error"
            );
          } else {
            TeamService.removejoin(teamID, index, false).then(response2 => {
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



    $scope.removeTeam = function (team) {
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
          subject: "Your team has been removed",
          title: "Time for a backup plan",
          body: "The team you have been part (Member/requested to join) of has been removed. Please check your dashboard and try to find another team to work with before the hackathon starts."
        }

        TeamService.remove(team._id).then(response => {
          team.members.forEach(user => {
            UserService.sendBasicMail(user.id, email);
          });
          team.joinRequests.forEach(user => {
            UserService.sendBasicMail(user.id, email);
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


    $scope.leaveTeam = function (team) {
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
        var index = 0;
        team.members.forEach(member => {
          if (member.id == currentUser.data._id) {
            TeamService.removemember(team._id, index).then(response => {
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


    $scope.canceljoinTeam = function (team) {
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
        var index = 0;

        team.joinRequests.forEach(member => {
          if (member.id == currentUser.data._id) {
            TeamService.removejoin(team._id, index, false).then(response => {
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


    $scope.toggleCloseTeam = function (teamID, status) {
      if (status == true) {
        text = "You are about to Close this team. This won't allow other members to join your team!"
      } else { text = "You are about to reopen this team. This will allow other members to join your team!" }

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
        TeamService.toggleCloseTeam(teamID, status).then(response => {
          swal(
            "Done",
            "Operation successfully Completed.",
            "success"
          );
          $state.reload();
        });
      });
    }



    $scope.toggleHideTeam = function (teamID, status) {
      if (status == true) {
        text = "You are about to Hide this team. This won't allow other members to see your team!"
      } else { text = "You are about to Show this team. This will allow other members to see your team!" }

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
        TeamService.toggleHideTeam(teamID, status).then(response => {
          swal(
            "Done",
            "Operation successfully Completed.",
            "success"
          );
          $state.reload();
        });
      });
    }

    $scope.$watch("queryText", function (queryText) {
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
        .getPage($stateParams.page, $stateParams.size, $scope.queryText, $scope.statusFilters,$scope.NotstatusFilters).then(
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
    function ($scope, $state, $timeout, currentUser, settings, Utils, UserService, TeamService, TEAM) {
      // Get the current user's most recent data.
      var Settings = settings.data;

      $scope.regIsOpen = Utils.isRegOpen(Settings);

      $scope.user = currentUser.data;

      function isTeamMember(teams, Userid) {
        var test = false;
        teams.forEach(team => {
          team.members.forEach(member => {
            if (member.id == Userid) test = true;
          });
        });
        return test;
      }

      function selectMember(memberId) {
        UserService.get(memberId).then(response => {
          user = response.data
          $scope.selectedUser = user;
          $scope.selectedUser.sections = generateSections(user);
        });
        console.log(user);
        $(".long.user.modal").modal("show");
      }

      function generateSections(user) {
        return [
          {
            name: "Profile",
            fields: [
              {
                name: "Gender",
                value: user.profile.gender
              },
              {
                name: "School",
                value: user.profile.school
              },
              {
                name: "Github",
                value: user.profile.github
              },
              {
                name: "Linkedin",
                value: user.profile.linkedin
              },
            ]
          },
        ];
      }

      function formatTime(time) {
        if (time) {
          return moment(time).format("MMMM Do YYYY, h:mm:ss a");
        }
      }

      $scope.selectMember = selectMember;


      $scope.isjoined = function (team) {
        var test = false;
        team.joinRequests.forEach(member => {
          if (member.id == currentUser.data._id) test = true;
        })
        return test;
      }

      TeamService.getAll().then(teams => {
        $scope.isTeamAdmin = false;
        $scope.isTeamMember = false;
        teams.data.forEach(team => {
          team.isMaxteam = false;

          if (team.members.length >= Settings.maxTeamSize) {
            team.isColosed = true;
            team.isMaxteam = true;
          }

          if (team.members[0].id == currentUser.data._id) {
            team.joinRequests.forEach(member => {
              if (isTeamMember(teams.data, member.id)) {
                member.unavailable = true;
              } else { member.unavailable = false }
            });
            $scope.userAdminTeam = team;
            $scope.isTeamAdmin = true;
          } else {
            team.members.forEach(member => {
              if (member.id == currentUser.data._id) {
                $scope.userMemberTeam = team;
                $scope.isTeamMember = true;
              }
            })
          }
        })
        $scope.teams = teams.data;

      });


      $scope.createTeam = function () {

        teamData = {
          description: $scope.newTeam_description,
          members: [{ id: currentUser.data._id, name: currentUser.data.profile.name, skill: $scope.newTeam_Adminskill }],
          skills: { code: $scope.skillcode, design: $scope.skilldesign, hardware: $scope.skillhardware, idea: $scope.skillidea },
          isColosed: false,
        }
        console.log(teamData);
        console.log($scope.newTeam_Adminskill);

        TeamService.create(teamData);
        $state.reload();
      };


      $scope.ShowcreateTeam = function () {
        $scope.ShowNewTeamFrom = true;
        $scope.skillcode = true
        $scope.skilldesign = true
        $scope.skillhardware = true
        $scope.skillidea = true
        $scope.newTeam_Adminskill = "code"
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


        if (team.skills.code) {
          option = document.createElement('option');
          option.innerHTML = 'Code';
          option.value = "code"
          select.appendChild(option);
        }
        if (team.skills.design) {
          option = document.createElement('option');
          option.innerHTML = 'Design';
          option.value = "design"
          select.appendChild(option);
        }
        if (team.skills.hardware) {
          option = document.createElement('option');
          option.innerHTML = 'Hardware';
          option.value = "hardware"
          select.appendChild(option);
        }
        if (team.skills.idea) {
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
        }).then(function () {

          newuser = { id: currentUser.data._id, name: currentUser.data.profile.name, skill: value };
          TeamService.join(team._id, newuser);
          swal(
            "Joined",
            "You have appliced to join this team, wait for the Team-Admin to accept your application.",
            "success"
          );
          $state.reload();
        })
      }


      $scope.acceptMember = function (teamID, member, index) {

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
          TeamService.acceptMember(teamID, member, Settings.maxTeamSize).then(response => {
            if (response == "maxTeamSize") {
              swal(
                "Error",
                "Maximum number of members (" + Settings.maxTeamSize + ") reached",
                "error"
              );
            } else {
              TeamService.removejoin(teamID, index, false).then(response2 => {
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



      $scope.refuseMember = function (teamID, member, index) {
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
          TeamService.removejoin(teamID, index, member).then(response => {
            swal(
              "Refused",
              member.name + " has been refused from your team.",
              "success"
            );
            $state.reload();
          });
        });
      }


      $scope.removeMemberfromTeam = function (teamID, member, index) {
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
          TeamService.removemember(teamID, index, member.id).then(response => {
            if (response == "removingAdmin") {
              swal(
                "Error",
                "You can't remove the Team Admin, But you can close the team.",
                "error"
              );
            } else {
              TeamService.removejoin(teamID, index, false).then(response2 => {
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



      $scope.removeTeam = function (team) {
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
            subject: "Your team has been removed",
            title: "Time for a backup plan",
            body: "The team you have been part (Member/requested to join) of has been removed. Please check your dashboard and try to find another team to work with before the hackathon starts."
          }

          TeamService.remove(team._id).then(response => {
            team.members.forEach(user => {
              UserService.sendBasicMail(user.id, email);
            });
            team.joinRequests.forEach(user => {
              UserService.sendBasicMail(user.id, email);
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


      $scope.leaveTeam = function (team) {
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
          var index = 0;
          team.members.forEach(member => {
            if (member.id == currentUser.data._id) {
              TeamService.removemember(team._id, index).then(response => {
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


      $scope.canceljoinTeam = function (team) {
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
          var index = 0;

          team.joinRequests.forEach(member => {
            if (member.id == currentUser.data._id) {
              TeamService.removejoin(team._id, index, false).then(response => {
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


      $scope.toggleCloseTeam = function (teamID, status) {
        if (status == true) {
          text = "You are about to Close this team. This won't allow other members to join your team!"
        } else { text = "You are about to reopen this team. This will allow other members to join your team!" }

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
          TeamService.toggleCloseTeam(teamID, status).then(response => {
            swal(
              "Done",
              "Operation successfully Completed.",
              "success"
            );
            $state.reload();
          });
        });
      }



      $scope.toggleHideTeam = function (teamID, status) {
        if (status == true) {
          text = "You are about to Hide this team. This won't allow other members to see your team!"
        } else { text = "You are about to Show this team. This will allow other members to see your team!" }

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
          TeamService.toggleHideTeam(teamID, status).then(response => {
            swal(
              "Done",
              "Operation successfully Completed.",
              "success"
            );
            $state.reload();
          });
        });
      }

      $scope.$watch("queryText", function (queryText) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnN0YW50cy5qcyIsInJvdXRlcy5qcyIsImludGVyY2VwdG9ycy9BdXRoSW50ZXJjZXB0b3IuanMiLCJtb2R1bGVzL1Nlc3Npb24uanMiLCJtb2R1bGVzL1V0aWxzLmpzIiwicXJzY2FubmVyL2h0bWw1LXFyY29kZS5taW4uanMiLCJxcnNjYW5uZXIvanNxcmNvZGUtY29tYmluZWQubWluLmpzIiwic2VydmljZXMvQXV0aFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9DaGFsbGVuZ2VTZXJ2aWNlLmpzIiwic2VydmljZXMvTWFya2V0aW5nU2VydmljZS5qcyIsInNlcnZpY2VzL1NldHRpbmdzU2VydmljZS5qcyIsInNlcnZpY2VzL1NvbHZlZENURlNlcnZpY2UuanMiLCJzZXJ2aWNlcy9UZWFtU2VydmljZS5qcyIsInNlcnZpY2VzL1VzZXJTZXJ2aWNlLmpzIiwiYWRtaW4vY2hhbGxlbmdlL2FkbWluQ2hhbGxlbmdlQ3RybC5qcyIsImFkbWluL2NoYWxsZW5nZXMvYWRtaW5DaGFsbGVuZ2VzQ3RybC5qcyIsImFkbWluL21haWwvYWRtaW5NYWlsQ3RybC5qcyIsImFkbWluL21hcmtldGluZy9hZG1pbk1hcmtldGluZ0N0cmwuanMiLCJhZG1pbi9zZXR0aW5ncy9hZG1pblNldHRpbmdzQ3RybC5qcyIsImFkbWluL3N0YXRzL2FkbWluU3RhdHNDdHJsLmpzIiwiYWRtaW4vdGVhbXMvYWRtaW5UZWFtc0N0cmwuanMiLCJhZG1pbi91c2VyL2FkbWluVXNlckN0cmwuanMiLCJhZG1pbi91c2Vycy9hZG1pblVzZXJzQ3RybC5qcyIsIkJhc2VDdHJsLmpzIiwiYWRtaW4vYWRtaW5DdHJsLmpzIiwiYXBwbGljYXRpb24vYXBwbGljYXRpb25DdHJsLmpzIiwiY2hhbGxlbmdlcy9jaGFsbGVuZ2VzQ3RybC5qcyIsImNoZWNraW4vY2hlY2tpbkN0cmwuanMiLCJjb25maXJtYXRpb24vY29uZmlybWF0aW9uQ3RybC5qcyIsImRhc2hib2FyZC9kYXNoYm9hcmRDdHJsLmpzIiwiaG9tZS9Ib21lQ3RybC5qcyIsImxvZ2luL2xvZ2luQ3RybC5qcyIsInJlc2V0L3Jlc2V0Q3RybC5qcyIsInNpZGViYXIvc2lkZWJhckN0cmwuanMiLCJ0ZWFtL3RlYW1DdHJsLmpzIiwidmVyaWZ5L3ZlcmlmeUN0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxNQUFBLFFBQUEsT0FBQSxPQUFBO0VBQ0E7RUFDQTs7O0FBR0E7R0FDQSxPQUFBO0lBQ0E7SUFDQSxTQUFBLGNBQUE7OztNQUdBLGNBQUEsYUFBQSxLQUFBOzs7R0FHQSxJQUFBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsYUFBQSxRQUFBOzs7TUFHQSxJQUFBLFFBQUEsUUFBQTtNQUNBLElBQUEsTUFBQTtRQUNBLFlBQUEsZUFBQTs7Ozs7QUN0QkEsUUFBQSxPQUFBO0tBQ0EsU0FBQSxjQUFBO1FBQ0EsTUFBQTs7S0FFQSxTQUFBLGFBQUE7UUFDQSxZQUFBO1FBQ0Esa0JBQUE7UUFDQSxZQUFBO1FBQ0EsaUJBQUE7UUFDQSxXQUFBO1FBQ0EsNkJBQUE7UUFDQSx1QkFBQTtRQUNBLGdDQUFBO1FBQ0EsbUNBQUE7UUFDQSw2QkFBQTtRQUNBLDBCQUFBO1FBQ0EsVUFBQTs7S0FFQSxTQUFBLE9BQUE7UUFDQSxvQkFBQTs7OztBQ2xCQSxRQUFBLE9BQUE7R0FDQSxPQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7TUFDQTtNQUNBO01BQ0EsbUJBQUE7OztJQUdBLG1CQUFBLFVBQUE7OztJQUdBO09BQ0EsTUFBQSxTQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGNBQUE7VUFDQSxlQUFBOztRQUVBLFNBQUE7VUFDQSxnQ0FBQSxTQUFBLGdCQUFBO1lBQ0EsT0FBQSxnQkFBQTs7OztPQUlBLE1BQUEsUUFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxjQUFBO1VBQ0EsZUFBQTs7UUFFQSxTQUFBO1VBQ0EsZ0NBQUEsU0FBQSxnQkFBQTtZQUNBLE9BQUEsZ0JBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FtQkEsTUFBQSxPQUFBO1FBQ0EsT0FBQTtVQUNBLElBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTs7VUFFQSxlQUFBO1lBQ0EsYUFBQTtZQUNBLFlBQUE7WUFDQSxTQUFBO2NBQ0EsOEJBQUEsU0FBQSxpQkFBQTtnQkFDQSxPQUFBLGdCQUFBOzs7OztRQUtBLE1BQUE7VUFDQSxjQUFBOzs7T0FHQSxNQUFBLGlCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsU0FBQTtVQUNBLDZCQUFBLFNBQUEsWUFBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSw4QkFBQSxTQUFBLGdCQUFBO1lBQ0EsT0FBQSxnQkFBQTs7OztPQUlBLE1BQUEsbUJBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsaUJBQUE7O1FBRUEsU0FBQTtVQUNBLDZCQUFBLFNBQUEsWUFBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSw4QkFBQSxTQUFBLGdCQUFBO1lBQ0EsT0FBQSxnQkFBQTs7OztPQUlBLE1BQUEsb0JBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsaUJBQUE7O1FBRUEsU0FBQTtVQUNBLDZCQUFBLFNBQUEsWUFBQTtZQUNBLE9BQUEsWUFBQTs7OztPQUlBLE1BQUEsa0JBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsaUJBQUE7O1FBRUEsU0FBQTtVQUNBLDZCQUFBLFNBQUEsWUFBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSw4QkFBQSxTQUFBLGdCQUFBO1lBQ0EsT0FBQSxnQkFBQTs7OztPQUlBLE1BQUEsWUFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxpQkFBQTs7UUFFQSxTQUFBO1VBQ0EsNkJBQUEsU0FBQSxZQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLDhCQUFBLFNBQUEsZ0JBQUE7WUFDQSxPQUFBLGdCQUFBOzs7O09BSUEsTUFBQSxhQUFBO1FBQ0EsT0FBQTtVQUNBLElBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTs7O1FBR0EsTUFBQTtVQUNBLGNBQUE7OztPQUdBLE1BQUEsZUFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxrQkFBQTs7O09BR0EsTUFBQSxtQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTs7T0FFQSxNQUFBLGtCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBOztPQUVBLE1BQUEsd0JBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7O09BRUEsTUFBQSx1QkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLFNBQUE7VUFDQSxrREFBQSxTQUFBLGNBQUEsaUJBQUE7WUFDQSxPQUFBLGlCQUFBLElBQUEsYUFBQTs7OztPQUlBLE1BQUEsdUJBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7O09BRUEsTUFBQSxtQkFBQTtRQUNBLEtBQUE7VUFDQTtVQUNBO1VBQ0E7UUFDQSxhQUFBO1FBQ0EsWUFBQTs7T0FFQSxNQUFBLGtCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsU0FBQTtVQUNBLHdDQUFBLFNBQUEsY0FBQSxZQUFBO1lBQ0EsT0FBQSxZQUFBLElBQUEsYUFBQTs7OztPQUlBLE1BQUEsc0JBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7O09BRUEsTUFBQSxtQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxpQkFBQTs7UUFFQSxTQUFBO1VBQ0EsNkJBQUEsU0FBQSxZQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLDhCQUFBLFNBQUEsZ0JBQUE7WUFDQSxPQUFBLGdCQUFBOzs7O09BSUEsTUFBQSxTQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGNBQUE7OztPQUdBLE1BQUEsVUFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxjQUFBOzs7T0FHQSxNQUFBLE9BQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUE7VUFDQSxjQUFBOzs7O0lBSUEsa0JBQUEsVUFBQTtNQUNBLFNBQUE7Ozs7R0FJQSxJQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7TUFDQTtNQUNBO01BQ0EsU0FBQTs7TUFFQSxXQUFBLElBQUEsdUJBQUEsV0FBQTtTQUNBLFNBQUEsS0FBQSxZQUFBLFNBQUEsZ0JBQUEsWUFBQTs7O01BR0EsV0FBQSxJQUFBLHFCQUFBLFVBQUEsT0FBQSxTQUFBLFVBQUE7O1FBRUEsSUFBQSxlQUFBLFFBQUEsS0FBQTtRQUNBLElBQUEsZ0JBQUEsUUFBQSxLQUFBO1FBQ0EsSUFBQSxlQUFBLFFBQUEsS0FBQTtRQUNBLElBQUEsbUJBQUEsUUFBQSxLQUFBO1FBQ0EsSUFBQSxrQkFBQSxRQUFBLEtBQUE7UUFDQSxJQUFBLGtCQUFBLFFBQUEsS0FBQTs7UUFFQSxJQUFBLGdCQUFBLENBQUEsUUFBQSxZQUFBO1VBQ0EsTUFBQTtVQUNBLE9BQUEsR0FBQTs7O1FBR0EsSUFBQSxpQkFBQSxRQUFBLFlBQUE7VUFDQSxNQUFBO1VBQ0EsT0FBQSxHQUFBOzs7UUFHQSxJQUFBLGdCQUFBLENBQUEsUUFBQSxVQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsT0FBQSxHQUFBOzs7UUFHQSxJQUFBLG9CQUFBLENBQUEsUUFBQSxVQUFBLGFBQUEsZ0JBQUEsQ0FBQSxRQUFBLFVBQUEsT0FBQTtVQUNBLE1BQUE7VUFDQSxPQUFBLEdBQUE7OztRQUdBLElBQUEsbUJBQUEsQ0FBQSxRQUFBLFVBQUEsVUFBQTtVQUNBLE1BQUE7VUFDQSxPQUFBLEdBQUE7OztRQUdBLElBQUEsbUJBQUEsQ0FBQSxRQUFBLFVBQUEsT0FBQSxVQUFBO1VBQ0EsTUFBQTtVQUNBLE9BQUEsR0FBQTs7Ozs7Ozs7QUMvVEEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxtQkFBQTtJQUNBO0lBQ0EsU0FBQSxRQUFBO01BQ0EsT0FBQTtVQUNBLFNBQUEsU0FBQSxPQUFBO1lBQ0EsSUFBQSxRQUFBLFFBQUE7WUFDQSxJQUFBLE1BQUE7Y0FDQSxPQUFBLFFBQUEsb0JBQUE7O1lBRUEsT0FBQTs7Ozs7QUNWQSxRQUFBLE9BQUE7R0FDQSxRQUFBLFdBQUE7SUFDQTtJQUNBO0lBQ0EsU0FBQSxZQUFBLFFBQUE7O0lBRUEsS0FBQSxTQUFBLFNBQUEsT0FBQSxLQUFBO01BQ0EsUUFBQSxhQUFBLE1BQUE7TUFDQSxRQUFBLGFBQUEsU0FBQSxLQUFBO01BQ0EsUUFBQSxhQUFBLGNBQUEsS0FBQSxVQUFBO01BQ0EsV0FBQSxjQUFBOzs7SUFHQSxLQUFBLFVBQUEsU0FBQSxXQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTtNQUNBLE9BQUEsUUFBQSxhQUFBO01BQ0EsV0FBQSxjQUFBO01BQ0EsSUFBQSxXQUFBO1FBQ0E7Ozs7SUFJQSxLQUFBLFdBQUEsVUFBQTtNQUNBLE9BQUEsUUFBQSxhQUFBOzs7SUFHQSxLQUFBLFlBQUEsVUFBQTtNQUNBLE9BQUEsUUFBQSxhQUFBOzs7SUFHQSxLQUFBLFVBQUEsVUFBQTtNQUNBLE9BQUEsS0FBQSxNQUFBLFFBQUEsYUFBQTs7O0lBR0EsS0FBQSxVQUFBLFNBQUEsS0FBQTtNQUNBLFFBQUEsYUFBQSxjQUFBLEtBQUEsVUFBQTtNQUNBLFdBQUEsY0FBQTs7OztBQ3JDQSxRQUFBLE9BQUE7R0FDQSxRQUFBLFNBQUE7SUFDQSxVQUFBO01BQ0EsT0FBQTtRQUNBLFdBQUEsU0FBQSxTQUFBO1VBQ0EsT0FBQSxLQUFBLFFBQUEsU0FBQSxZQUFBLEtBQUEsUUFBQSxTQUFBOztRQUVBLFNBQUEsU0FBQSxLQUFBO1VBQ0EsT0FBQSxLQUFBLFFBQUE7O1FBRUEsWUFBQSxTQUFBLEtBQUE7O1VBRUEsSUFBQSxDQUFBLEtBQUE7WUFDQSxPQUFBOzs7VUFHQSxPQUFBLElBQUEsS0FBQTs7VUFFQSxPQUFBLE9BQUEsTUFBQSxPQUFBO1lBQ0EsTUFBQSxLQUFBLGVBQUEsTUFBQSxLQUFBOzs7Ozs7QUNuQkEsQ0FBQSxTQUFBLEdBQUE7SUFDQSxPQUFBLEdBQUEsT0FBQTtRQUNBLGNBQUEsU0FBQSxlQUFBLGFBQUEsWUFBQTtZQUNBLE9BQUEsS0FBQSxLQUFBLFdBQUE7Z0JBQ0EsSUFBQSxjQUFBLEVBQUE7O2dCQUVBLElBQUEsU0FBQSxZQUFBO2dCQUNBLElBQUEsUUFBQSxZQUFBOztnQkFFQSxJQUFBLFVBQUEsTUFBQTtvQkFDQSxTQUFBOzs7Z0JBR0EsSUFBQSxTQUFBLE1BQUE7b0JBQ0EsUUFBQTs7OztnQkFJQSxJQUFBLFVBQUEsRUFBQSxtQkFBQSxRQUFBLGlCQUFBLFNBQUEscUNBQUEsU0FBQTtnQkFDQSxJQUFBLGFBQUEsRUFBQSxvQ0FBQSxRQUFBLEtBQUEsa0JBQUEsU0FBQSxLQUFBLHVDQUFBLFNBQUE7O2dCQUVBLElBQUEsUUFBQSxRQUFBO2dCQUNBLElBQUEsU0FBQSxXQUFBO2dCQUNBLElBQUEsVUFBQSxPQUFBLFdBQUE7Z0JBQ0EsSUFBQTs7Z0JBRUEsSUFBQSxPQUFBLFdBQUE7b0JBQ0EsSUFBQSxrQkFBQTt3QkFDQSxRQUFBLFVBQUEsT0FBQSxHQUFBLEdBQUEsS0FBQTs7d0JBRUEsSUFBQTs0QkFDQSxPQUFBOzBCQUNBLE9BQUEsR0FBQTs0QkFDQSxZQUFBLEdBQUE7Ozt3QkFHQSxFQUFBLEtBQUEsWUFBQSxJQUFBLFdBQUEsV0FBQSxNQUFBOzsyQkFFQTt3QkFDQSxFQUFBLEtBQUEsWUFBQSxJQUFBLFdBQUEsV0FBQSxNQUFBOzs7O2dCQUlBLE9BQUEsTUFBQSxPQUFBLE9BQUEsT0FBQSxhQUFBLE9BQUEsVUFBQSxPQUFBO2dCQUNBLFVBQUEsZUFBQSxVQUFBLGdCQUFBLFVBQUEsc0JBQUEsVUFBQSxtQkFBQSxVQUFBOztnQkFFQSxJQUFBLGtCQUFBLFNBQUEsUUFBQTs7b0JBRUEsTUFBQSxZQUFBO29CQUNBLG1CQUFBO29CQUNBLEVBQUEsS0FBQSxZQUFBLElBQUEsVUFBQTs7b0JBRUEsTUFBQTtvQkFDQSxFQUFBLEtBQUEsWUFBQSxJQUFBLFdBQUEsV0FBQSxNQUFBOzs7O2dCQUlBLElBQUEsVUFBQSxjQUFBO29CQUNBLFVBQUEsYUFBQSxDQUFBLE9BQUEsRUFBQSxZQUFBLG1CQUFBLGlCQUFBLFNBQUEsT0FBQTt3QkFDQSxXQUFBLE9BQUE7O3VCQUVBO29CQUNBLFFBQUEsSUFBQTs7OztnQkFJQSxPQUFBLFdBQUEsVUFBQSxRQUFBO29CQUNBLGNBQUEsUUFBQTs7OztRQUlBLG1CQUFBLFdBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQSxXQUFBOztnQkFFQSxFQUFBLE1BQUEsS0FBQSxVQUFBLGlCQUFBLFFBQUEsU0FBQSxZQUFBO29CQUNBLFdBQUE7OztnQkFHQSxhQUFBLEVBQUEsTUFBQSxLQUFBOzs7O0dBSUE7OztBQ2xGQSxTQUFBLElBQUEsTUFBQSxjQUFBLENBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxjQUFBLGNBQUEsS0FBQSxpQkFBQSxRQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsUUFBQSxLQUFBLGlCQUFBLGdCQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsZ0JBQUEsU0FBQSxTQUFBLG9CQUFBLFVBQUEsVUFBQSxDQUFBLEtBQUEsb0JBQUEsb0JBQUEsVUFBQSxLQUFBLFNBQUEsSUFBQSxNQUFBLFVBQUEsV0FBQSxLQUFBLFNBQUEsSUFBQSxNQUFBLFdBQUEsS0FBQSxpQkFBQSxzQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHNCQUFBLEtBQUEsaUJBQUEsbUJBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxvQkFBQSxLQUFBLFlBQUEsS0FBQSxpQkFBQSxZQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsU0FBQSxPQUFBLElBQUEsT0FBQSxLQUFBLFNBQUEsR0FBQSxPQUFBLE9BQUEsUUFBQSxLQUFBLFlBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxVQUFBLFNBQUEsUUFBQSxjQUFBLHdCQUFBLFVBQUEsVUFBQSxVQUFBLFVBQUEsQ0FBQSxLQUFBLGNBQUEsY0FBQSxLQUFBLHdCQUFBLHdCQUFBLEtBQUEsU0FBQSxJQUFBLE1BQUEsVUFBQSxVQUFBLFVBQUEsV0FBQSxJQUFBLElBQUEsTUFBQSxFQUFBLFlBQUEsVUFBQSxvQkFBQSxTQUFBLFVBQUEsY0FBQSxFQUFBLEVBQUEsRUFBQSxTQUFBLE9BQUEsSUFBQSxDQUFBLElBQUEsUUFBQSxTQUFBLEdBQUEsT0FBQSxRQUFBLE9BQUEsUUFBQSxjQUFBLGFBQUEsS0FBQSxlQUFBLE1BQUEsS0FBQSxpQkFBQSxnQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGdCQUFBLEtBQUEsaUJBQUEsMEJBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSwwQkFBQSxLQUFBLGlCQUFBLGlCQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsaUJBQUEsS0FBQSxpQkFBQSxzQkFBQSxVQUFBLENBQUEsT0FBQSxHQUFBLEVBQUEsS0FBQSxnQkFBQSxLQUFBLHFCQUFBLFVBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxvQkFBQSxVQUFBLElBQUEsVUFBQSxXQUFBLFVBQUEsVUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLFVBQUEsVUFBQSxVQUFBLEVBQUEsRUFBQSxFQUFBLEdBQUEsVUFBQSxVQUFBLEVBQUEsVUFBQSxFQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxLQUFBLHdCQUFBLE9BQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsd0JBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxHQUFBLElBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsR0FBQSxVQUFBLFVBQUEsS0FBQSx3QkFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLEdBQUEsT0FBQSxVQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsVUFBQSxJQUFBLFVBQUEsVUFBQSxFQUFBLEVBQUEsVUFBQSxHQUFBLEdBQUEsS0FBQSxjQUFBLElBQUEsVUFBQSxVQUFBLFVBQUEsR0FBQSxFQUFBLEVBQUEsR0FBQSxVQUFBLFVBQUEsRUFBQSxVQUFBLEdBQUEsRUFBQSxJQUFBLFdBQUEsS0FBQSxvQkFBQSxTQUFBLFFBQUEsQ0FBQSxPQUFBLEtBQUEsU0FBQSxRQUFBLFlBQUEsU0FBQSxlQUFBLENBQUEsT0FBQSxJQUFBLE1BQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLElBQUEsU0FBQSxFQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE9BQUEsU0FBQSxxQkFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxDQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsaUJBQUEsU0FBQSxPQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsT0FBQSxPQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxFQUFBLE9BQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxHQUFBLFlBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLE9BQUEsR0FBQSxDQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxZQUFBLE9BQUEsRUFBQSxHQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLGNBQUEsS0FBQSxpQkFBQSxTQUFBLFFBQUEsUUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLFFBQUEsT0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsUUFBQSxHQUFBLEVBQUEsUUFBQSxHQUFBLFlBQUEsS0FBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFFBQUEsR0FBQSxDQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxZQUFBLFFBQUEsR0FBQSxDQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxjQUFBLEtBQUEsYUFBQSxVQUFBLENBQUEsT0FBQSxJQUFBLHFCQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxTQUFBLE1BQUEsQ0FBQSxPQUFBLElBQUEscUJBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLE1BQUEsU0FBQSxlQUFBLEtBQUEsT0FBQSxDQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsU0FBQSxNQUFBLENBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxvQkFBQSxLQUFBLEtBQUEseUJBQUEsU0FBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLENBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE9BQUEsS0FBQSxJQUFBLElBQUEsT0FBQSxHQUFBLE1BQUEsQ0FBQSxJQUFBLEtBQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxLQUFBLEtBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLE9BQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxPQUFBLE1BQUEsQ0FBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUEsTUFBQSxJQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUEsTUFBQSxFQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsR0FBQSxJQUFBLEdBQUEsTUFBQSxDQUFBLElBQUEsTUFBQSxNQUFBLEVBQUEsRUFBQSxNQUFBLE1BQUEsRUFBQSxFQUFBLEdBQUEsR0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE1BQUEsT0FBQSxRQUFBLFFBQUEsS0FBQSxNQUFBLE1BQUEsTUFBQSxPQUFBLFFBQUEsUUFBQSxHQUFBLE1BQUEsQ0FBQSxJQUFBLE1BQUEsRUFBQSxNQUFBLE1BQUEsRUFBQSxNQUFBLE9BQUEsS0FBQSxLQUFBLE1BQUEsTUFBQSxNQUFBLE9BQUEsR0FBQSxPQUFBLEdBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLElBQUEsTUFBQSxHQUFBLE1BQUEsT0FBQSxJQUFBLElBQUEsT0FBQSxJQUFBLE1BQUEsT0FBQSxJQUFBLE1BQUEsT0FBQSxLQUFBLEtBQUEsT0FBQSxPQUFBLE9BQUEsU0FBQSxLQUFBLGlDQUFBLFNBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxDQUFBLElBQUEsT0FBQSxLQUFBLHlCQUFBLE1BQUEsTUFBQSxJQUFBLEtBQUEsTUFBQSxFQUFBLFNBQUEsT0FBQSxJQUFBLE9BQUEsRUFBQSxVQUFBLE1BQUEsT0FBQSxNQUFBLFVBQUEsU0FBQSxHQUFBLFVBQUEsT0FBQSxRQUFBLE1BQUEsQ0FBQSxPQUFBLE1BQUEsRUFBQSxRQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUEsTUFBQSxHQUFBLElBQUEsU0FBQSxLQUFBLE1BQUEsTUFBQSxDQUFBLElBQUEsT0FBQSxPQUFBLE9BQUEsTUFBQSxFQUFBLEVBQUEsVUFBQSxNQUFBLE9BQUEsTUFBQSxVQUFBLFNBQUEsR0FBQSxVQUFBLE9BQUEsU0FBQSxNQUFBLENBQUEsT0FBQSxPQUFBLEVBQUEsUUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBLE9BQUEsR0FBQSxTQUFBLEtBQUEsTUFBQSxNQUFBLENBQUEsU0FBQSxPQUFBLE9BQUEsUUFBQSxLQUFBLHlCQUFBLE1BQUEsTUFBQSxTQUFBLFVBQUEsT0FBQSxHQUFBLEtBQUEsMEJBQUEsU0FBQSxRQUFBLGFBQUEsQ0FBQSxJQUFBLGVBQUEsS0FBQSxpQ0FBQSxLQUFBLE1BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLGFBQUEsR0FBQSxLQUFBLE1BQUEsYUFBQSxJQUFBLGVBQUEsS0FBQSxpQ0FBQSxLQUFBLE1BQUEsYUFBQSxHQUFBLEtBQUEsTUFBQSxhQUFBLEdBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsUUFBQSxJQUFBLE9BQUEsTUFBQSxnQkFBQSxlQUFBLEVBQUEsTUFBQSxnQkFBQSxlQUFBLEVBQUEsQ0FBQSxlQUFBLGdCQUFBLElBQUEsS0FBQSxvQkFBQSxTQUFBLFFBQUEsU0FBQSxXQUFBLENBQUEsTUFBQSxDQUFBLEtBQUEsMEJBQUEsUUFBQSxVQUFBLEtBQUEsMEJBQUEsUUFBQSxhQUFBLEdBQUEsS0FBQSxTQUFBLFNBQUEsU0FBQSxTQUFBLENBQUEsT0FBQSxNQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsTUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLE1BQUEsTUFBQSxRQUFBLEtBQUEsaUJBQUEsU0FBQSxRQUFBLFNBQUEsV0FBQSxXQUFBLENBQUEsSUFBQSxxQkFBQSxLQUFBLE1BQUEsS0FBQSxTQUFBLFFBQUEsVUFBQSxZQUFBLHFCQUFBLEtBQUEsTUFBQSxLQUFBLFNBQUEsUUFBQSxZQUFBLFlBQUEsVUFBQSxDQUFBLHFCQUFBLHNCQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsV0FBQSxLQUFBLEVBQUEsWUFBQSxNQUFBLEtBQUEsRUFBQSxZQUFBLE1BQUEsS0FBQSxFQUFBLEtBQUEsUUFBQSxPQUFBLFdBQUEsS0FBQSxzQkFBQSxTQUFBLHFCQUFBLGNBQUEsY0FBQSxnQkFBQSxDQUFBLElBQUEsVUFBQSxLQUFBLE1BQUEsZ0JBQUEsc0JBQUEsbUJBQUEsS0FBQSxJQUFBLEVBQUEsY0FBQSxXQUFBLG9CQUFBLEtBQUEsSUFBQSxPQUFBLE1BQUEsRUFBQSxjQUFBLFdBQUEsR0FBQSxFQUFBLHFCQUFBLG9CQUFBLG1CQUFBLEtBQUEsUUFBQSxJQUFBLGtCQUFBLEtBQUEsSUFBQSxFQUFBLGNBQUEsV0FBQSxxQkFBQSxLQUFBLElBQUEsT0FBQSxPQUFBLEVBQUEsY0FBQSxXQUFBLGdCQUFBLElBQUEsdUJBQUEsS0FBQSxNQUFBLG1CQUFBLGtCQUFBLG9CQUFBLG1CQUFBLHFCQUFBLGtCQUFBLHFCQUFBLEtBQUEscUJBQUEsT0FBQSxnQkFBQSxRQUFBLEtBQUEsZ0JBQUEsU0FBQSxRQUFBLFNBQUEsV0FBQSxpQkFBQSxVQUFBLENBQUEsSUFBQSxhQUFBLGFBQUEsbUJBQUEsbUJBQUEsY0FBQSxVQUFBLElBQUEsTUFBQSxrQkFBQSxhQUFBLGlCQUFBLEVBQUEsYUFBQSxpQkFBQSxFQUFBLG1CQUFBLG1CQUFBLGNBQUEsSUFBQSxhQUFBLFNBQUEsRUFBQSxRQUFBLEVBQUEsV0FBQSxFQUFBLGFBQUEsU0FBQSxFQUFBLFFBQUEsRUFBQSxXQUFBLEVBQUEsbUJBQUEsbUJBQUEsZUFBQSxJQUFBLFVBQUEscUJBQUEsNkJBQUEsSUFBQSxJQUFBLGNBQUEsSUFBQSxtQkFBQSxtQkFBQSxJQUFBLGNBQUEsUUFBQSxFQUFBLFFBQUEsRUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLGFBQUEsYUFBQSxXQUFBLEVBQUEsV0FBQSxHQUFBLE9BQUEsV0FBQSxLQUFBLFdBQUEsU0FBQSxNQUFBLFVBQUEsVUFBQSxDQUFBLElBQUEsUUFBQSxZQUFBLE9BQUEsUUFBQSxZQUFBLE1BQUEsVUFBQSxZQUFBLEtBQUEseUJBQUEsU0FBQSxLQUFBLENBQUEsSUFBQSxRQUFBLEtBQUEsUUFBQSxTQUFBLEtBQUEsU0FBQSxXQUFBLEtBQUEsV0FBQSxXQUFBLEtBQUEsb0JBQUEsUUFBQSxTQUFBLFlBQUEsR0FBQSxFQUFBLFdBQUEsS0FBQSxRQUFBLElBQUEsVUFBQSxLQUFBLGlCQUFBLFFBQUEsU0FBQSxXQUFBLFlBQUEsbUJBQUEsUUFBQSxrQ0FBQSxXQUFBLHdCQUFBLG1CQUFBLG9CQUFBLEVBQUEsaUJBQUEsS0FBQSxHQUFBLG1CQUFBLHdCQUFBLE9BQUEsRUFBQSxJQUFBLElBQUEsYUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLFdBQUEsRUFBQSxhQUFBLFNBQUEsRUFBQSxRQUFBLEVBQUEsV0FBQSxFQUFBLG9CQUFBLEVBQUEsRUFBQSx3QkFBQSxjQUFBLEtBQUEsTUFBQSxRQUFBLEVBQUEscUJBQUEsYUFBQSxRQUFBLElBQUEsY0FBQSxLQUFBLE1BQUEsUUFBQSxFQUFBLHFCQUFBLGFBQUEsUUFBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLENBQUEsaUJBQUEsS0FBQSxzQkFBQSxXQUFBLGNBQUEsY0FBQSxHQUFBLE1BQUEsSUFBQSxPQUFBLFVBQUEsS0FBQSxnQkFBQSxRQUFBLFNBQUEsV0FBQSxpQkFBQSxXQUFBLEtBQUEsS0FBQSxXQUFBLEtBQUEsTUFBQSxVQUFBLFdBQUEsT0FBQSxPQUFBLE1BQUEsaUJBQUEsSUFBQSxNQUFBLFdBQUEsUUFBQSxVQUFBLElBQUEsTUFBQSxXQUFBLFFBQUEsU0FBQSxrQkFBQSxJQUFBLGVBQUEsS0FBQSxTQUFBLEtBQUEsT0FBQSxVQUFBLENBQUEsSUFBQSxLQUFBLENBQUEsSUFBQSxxQkFBQSxrQkFBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLHlCQUFBLE9BQUEsU0FBQSxrQkFBQSxXQUFBLENBQUEsS0FBQSxxQkFBQSxxQkFBQSxRQUFBLFlBQUEsRUFBQSxHQUFBLEtBQUEsU0FBQSxFQUFBLFdBQUEsS0FBQSxpQkFBQSx1QkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHVCQUFBLEtBQUEsaUJBQUEsV0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEscUJBQUEsV0FBQSxFQUFBLFVBQUEsS0FBQSxPQUFBLFNBQUEsRUFBQSxDQUFBLElBQUEsTUFBQSxFQUFBLE9BQUEsS0FBQSxzQkFBQSxNQUFBLHNCQUFBLEtBQUEsVUFBQSxNQUFBLFVBQUEsU0FBQSxxQkFBQSxRQUFBLEtBQUEsS0FBQSxDQUFBLEtBQUEsc0JBQUEsUUFBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLGlCQUFBLE9BQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxPQUFBLEtBQUEsaUJBQUEsT0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxRQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsdUJBQUEsU0FBQSxVQUFBLE1BQUEsT0FBQSxDQUFBLEdBQUEsU0FBQSxPQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxLQUFBLHlDQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUEsT0FBQSxPQUFBLElBQUEsUUFBQSxPQUFBLEVBQUEsSUFBQSxHQUFBLFFBQUEsVUFBQSxLQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUEsSUFBQSxNQUFBLFFBQUEsUUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxLQUFBLE9BQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxFQUFBLEtBQUEsaUJBQUEsUUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFFBQUEsS0FBQSxpQkFBQSxTQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsU0FBQSxLQUFBLGlCQUFBLFlBQUEsVUFBQSxDQUFBLEdBQUEsS0FBQSxPQUFBLEtBQUEsT0FBQSxLQUFBLG1EQUFBLE9BQUEsS0FBQSxRQUFBLEtBQUEsWUFBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsT0FBQSxFQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUEsT0FBQSxJQUFBLEVBQUEsUUFBQSxLQUFBLEtBQUEsUUFBQSxHQUFBLEtBQUEsS0FBQSxZQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxPQUFBLEVBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQSxLQUFBLEtBQUEsU0FBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLEtBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLE9BQUEsRUFBQSxLQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUEsS0FBQSxTQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsTUFBQSxVQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxLQUFBLE9BQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxVQUFBLFNBQUEsS0FBQSxJQUFBLE1BQUEsT0FBQSxDQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLG1DQUFBLEdBQUEsRUFBQSxRQUFBLEVBQUEsTUFBQSxLQUFBLHNDQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsT0FBQSxJQUFBLE9BQUEsR0FBQSxPQUFBLEtBQUEsUUFBQSxNQUFBLEtBQUEsTUFBQSxLQUFBLHdDQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsT0FBQSxFQUFBLElBQUEsSUFBQSxJQUFBLE9BQUEsRUFBQSxLQUFBLFFBQUEsRUFBQSxLQUFBLE1BQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxRQUFBLEdBQUEsS0FBQSxJQUFBLEdBQUEsSUFBQSxTQUFBLFVBQUEsaUJBQUEsVUFBQSxDQUFBLEtBQUEsaUJBQUEsaUJBQUEsS0FBQSxVQUFBLFVBQUEsS0FBQSxpQkFBQSxtQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLG1CQUFBLEtBQUEsaUJBQUEsWUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFlBQUEsU0FBQSxnQkFBQSxVQUFBLENBQUEsSUFBQSxVQUFBLFVBQUEsVUFBQSxHQUFBLEdBQUEsV0FBQSxJQUFBLEVBQUEsV0FBQSxLQUFBLHdCQUFBLEtBQUEsVUFBQSxVQUFBLEtBQUEsY0FBQSxLQUFBLEtBQUEsaUJBQUEsS0FBQSxLQUFBLFFBQUEsU0FBQSxFQUFBLEVBQUEsWUFBQSxDQUFBLE9BQUEsS0FBQSxVQUFBLFlBQUEsRUFBQSxHQUFBLGFBQUEsRUFBQSxFQUFBLGFBQUEsR0FBQSxLQUFBLHNCQUFBLFVBQUEsQ0FBQSxHQUFBLE1BQUEsS0FBQSxpQkFBQSxPQUFBLEtBQUEsaUJBQUEsSUFBQSxJQUFBLGVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsZUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGdCQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxlQUFBLEtBQUEsUUFBQSxFQUFBLEVBQUEsZ0JBQUEsZUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGdCQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsZUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGdCQUFBLEdBQUEsS0FBQSxpQkFBQSxrQkFBQSx3QkFBQSxnQkFBQSxNQUFBLEtBQUEsaUJBQUEsT0FBQSxLQUFBLGlCQUFBLElBQUEsVUFBQSxLQUFBLFVBQUEsVUFBQSxlQUFBLEVBQUEsSUFBQSxJQUFBLEtBQUEsVUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLEdBQUEsS0FBQSxJQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxJQUFBLElBQUEsRUFBQSxVQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsZUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGdCQUFBLEdBQUEsS0FBQSxpQkFBQSxrQkFBQSx3QkFBQSxnQkFBQSxNQUFBLEtBQUEsaUJBQUEsT0FBQSxLQUFBLGlCQUFBLEtBQUEsK0JBQUEsS0FBQSxZQUFBLFVBQUEsQ0FBQSxHQUFBLE1BQUEsS0FBQSxjQUFBLE9BQUEsS0FBQSxjQUFBLElBQUEsVUFBQSxLQUFBLFVBQUEsVUFBQSxtQkFBQSxVQUFBLElBQUEsRUFBQSxHQUFBLEdBQUEsbUJBQUEsT0FBQSxRQUFBLG9CQUFBLG9CQUFBLElBQUEsSUFBQSxZQUFBLEVBQUEsTUFBQSxVQUFBLEdBQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLFVBQUEsRUFBQSxHQUFBLE1BQUEsSUFBQSxZQUFBLEtBQUEsUUFBQSxFQUFBLEVBQUEsYUFBQSxHQUFBLEtBQUEsY0FBQSxRQUFBLHlCQUFBLGFBQUEsTUFBQSxLQUFBLGVBQUEsS0FBQSxjQUFBLHFCQUFBLFVBQUEsT0FBQSxLQUFBLGNBQUEsWUFBQSxFQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsVUFBQSxFQUFBLEdBQUEsTUFBQSxJQUFBLFlBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxhQUFBLEdBQUEsS0FBQSxjQUFBLFFBQUEseUJBQUEsYUFBQSxNQUFBLEtBQUEsZUFBQSxLQUFBLGNBQUEscUJBQUEsVUFBQSxPQUFBLEtBQUEsY0FBQSxLQUFBLHFCQUFBLEtBQUEsY0FBQSxVQUFBLENBQUEsSUFBQSxXQUFBLEtBQUEsd0JBQUEsUUFBQSxLQUFBLGNBQUEsU0FBQSxTQUFBLGFBQUEsV0FBQSxVQUFBLFVBQUEsS0FBQSxVQUFBLFVBQUEsU0FBQSxnQkFBQSxLQUFBLFVBQUEsV0FBQSxJQUFBLElBQUEsZ0JBQUEsUUFBQSx1QkFBQSxVQUFBLENBQUEsRUFBQSxPQUFBLElBQUEsTUFBQSxRQUFBLGdCQUFBLGFBQUEsRUFBQSxZQUFBLEVBQUEsU0FBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsTUFBQSxFQUFBLFVBQUEsTUFBQSxRQUFBLElBQUEsSUFBQSxFQUFBLFVBQUEsVUFBQSxFQUFBLE1BQUEsTUFBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLE1BQUEsZ0JBQUEsWUFBQSxFQUFBLElBQUEsS0FBQSxXQUFBLGNBQUEsRUFBQSxLQUFBLFVBQUEsWUFBQSxFQUFBLElBQUEsS0FBQSxhQUFBLEdBQUEsR0FBQSxXQUFBLE9BQUEsZ0JBQUEsWUFBQSxTQUFBLEVBQUEsWUFBQSxJQUFBLFdBQUEsQ0FBQSxFQUFBLEdBQUEsY0FBQSxRQUFBLGVBQUEsS0FBQSxzQkFBQSxPQUFBLFFBQUEsU0FBQSxhQUFBLENBQUEsS0FBQSxnQkFBQSxTQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxFQUFBLElBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLElBQUEsU0FBQSxhQUFBLENBQUEsS0FBQSxnQkFBQSxTQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxFQUFBLElBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsT0FBQSxFQUFBLEdBQUEsR0FBQSxTQUFBLGFBQUEsQ0FBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxFQUFBLElBQUEsS0FBQSxLQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxNQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxTQUFBLGFBQUEsQ0FBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxFQUFBLElBQUEsS0FBQSxLQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLElBQUEsUUFBQSxFQUFBLEdBQUEsRUFBQSxFQUFBLElBQUEsU0FBQSxhQUFBLENBQUEsS0FBQSxnQkFBQSxTQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxFQUFBLElBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxLQUFBLEVBQUEsRUFBQSxNQUFBLENBQUEsRUFBQSxNQUFBLEtBQUEsR0FBQSxHQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsS0FBQSxFQUFBLEVBQUEsT0FBQSxJQUFBLENBQUEsRUFBQSxNQUFBLEtBQUEsRUFBQSxJQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLE9BQUEsSUFBQSxDQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsU0FBQSxtQkFBQSxNQUFBLENBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxPQUFBLFNBQUEsU0FBQSxLQUFBLENBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxVQUFBLEtBQUEsTUFBQSxVQUFBLHFCQUFBLElBQUEsTUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLHFCQUFBLE9BQUEsSUFBQSxxQkFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLFdBQUEsQ0FBQSxFQUFBLFFBQUEsQ0FBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsS0FBQSxLQUFBLFdBQUEsS0FBQSxNQUFBLElBQUEsV0FBQSxFQUFBLEVBQUEsSUFBQSxxQkFBQSxxQkFBQSxPQUFBLEVBQUEsR0FBQSxLQUFBLEdBQUEsT0FBQSxRQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsUUFBQSxJQUFBLElBQUEsU0FBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLHNCQUFBLFdBQUEsS0FBQSxzQkFBQSxLQUFBLE1BQUEsY0FBQSxLQUFBLEdBQUEsU0FBQSxNQUFBLE1BQUEsV0FBQSxHQUFBLE1BQUEsV0FBQSxHQUFBLGVBQUEsS0FBQSxtQkFBQSxPQUFBLGdCQUFBLEtBQUEsb0JBQUEsTUFBQSxlQUFBLFlBQUEsRUFBQSxFQUFBLEVBQUEsZUFBQSxPQUFBLElBQUEsQ0FBQSxJQUFBLFNBQUEsU0FBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLElBQUEsZUFBQSxJQUFBLEdBQUEsRUFBQSxTQUFBLEtBQUEsMENBQUEsU0FBQSxVQUFBLE1BQUEsY0FBQSxTQUFBLFVBQUEsZ0JBQUEsTUFBQSxLQUFBLHNCQUFBLFNBQUEsRUFBQSxFQUFBLEVBQUEsQ0FBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsQ0FBQSxJQUFBLEtBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLE1BQUEsS0FBQSxNQUFBLElBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxLQUFBLEVBQUEsS0FBQSxNQUFBLElBQUEsRUFBQSxRQUFBLEtBQUEsTUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLFVBQUEsTUFBQSxVQUFBLE1BQUEsVUFBQSxNQUFBLEdBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxLQUFBLEtBQUEsbUJBQUEsRUFBQSxVQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLHVCQUFBLE1BQUEsZUFBQSxNQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsUUFBQSx3QkFBQSxFQUFBLFFBQUEsTUFBQSxRQUFBLENBQUEsRUFBQSxNQUFBLENBQUEsSUFBQSxXQUFBLEVBQUEsT0FBQSxNQUFBLE9BQUEsTUFBQSxLQUFBLE1BQUEsU0FBQSxFQUFBLGVBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxFQUFBLGNBQUEsS0FBQSxNQUFBLGNBQUEsV0FBQSxRQUFBLEVBQUEsRUFBQSxjQUFBLE1BQUEsbUJBQUEsV0FBQSxRQUFBLEVBQUEsRUFBQSxVQUFBLE9BQUEsY0FBQSxXQUFBLEVBQUEsRUFBQSxVQUFBLE9BQUEsY0FBQSxXQUFBLElBQUEsaUJBQUEsRUFBQSxlQUFBLEdBQUEsR0FBQSxHQUFBLGlCQUFBLEtBQUEsOENBQUEsSUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLGtCQUFBLE1BQUEsRUFBQSxVQUFBLFNBQUEsTUFBQSxFQUFBLFVBQUEsU0FBQSxPQUFBLElBQUEsTUFBQSxNQUFBLFFBQUEsS0FBQSxtQkFBQSxTQUFBLGFBQUEsQ0FBQSxJQUFBLFVBQUEsYUFBQSxPQUFBLEdBQUEsR0FBQSxVQUFBLE9BQUEsSUFBQSxNQUFBLGFBQUEsZUFBQSxJQUFBLElBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxXQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxHQUFBLFVBQUEsRUFBQSxJQUFBLEdBQUEsYUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLEdBQUEsVUFBQSxLQUFBLHNEQUFBLE9BQUEsUUFBQSxLQUFBLG9CQUFBLFNBQUEsZUFBQSxlQUFBLFdBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxlQUFBLE9BQUEsT0FBQSxJQUFBLE1BQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsVUFBQSxLQUFBLE1BQUEsUUFBQSxlQUFBLElBQUEsWUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxHQUFBLElBQUEsWUFBQSxLQUFBLE1BQUEsU0FBQSxZQUFBLE1BQUEsY0FBQSxFQUFBLEtBQUEsTUFBQSxTQUFBLGVBQUEsR0FBQSxjQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsU0FBQSxlQUFBLFdBQUEsV0FBQSxLQUFBLE1BQUEsUUFBQSxjQUFBLGFBQUEsT0FBQSxHQUFBLEtBQUEsTUFBQSxTQUFBLE9BQUEsR0FBQSxZQUFBLE9BQUEsUUFBQSxTQUFBLFVBQUEsTUFBQSxhQUFBLENBQUEsR0FBQSxNQUFBLGNBQUEsR0FBQSxhQUFBLE9BQUEsS0FBQSwyQkFBQSxLQUFBLE1BQUEsTUFBQSxJQUFBLG1CQUFBLGFBQUEsT0FBQSxHQUFBLG1CQUFBLEdBQUEsR0FBQSxhQUFBLEdBQUEsQ0FBQSxJQUFBLElBQUEsYUFBQSxFQUFBLG1CQUFBLGNBQUEsR0FBQSxhQUFBLGVBQUEsZUFBQSxHQUFBLGNBQUEsbUJBQUEsS0FBQSxhQUFBLE1BQUEsS0FBQSxpQkFBQSxDQUFBLEtBQUEsYUFBQSxJQUFBLE1BQUEsbUJBQUEsY0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxhQUFBLE9BQUEsSUFBQSxLQUFBLGFBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQSxLQUFBLGFBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxJQUFBLGFBQUEsYUFBQSxVQUFBLEtBQUEsYUFBQSxhQUFBLEtBQUEsaUJBQUEsT0FBQSxVQUFBLENBQUEsT0FBQSxHQUFBLEtBQUEsYUFBQSxLQUFBLEtBQUEsaUJBQUEsU0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGFBQUEsT0FBQSxJQUFBLEtBQUEsaUJBQUEsZUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGVBQUEsS0FBQSxlQUFBLFNBQUEsT0FBQSxDQUFBLE9BQUEsS0FBQSxhQUFBLEtBQUEsYUFBQSxPQUFBLEVBQUEsU0FBQSxLQUFBLFdBQUEsU0FBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLGVBQUEsR0FBQSxJQUFBLEtBQUEsS0FBQSxhQUFBLE9BQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxJQUFBLElBQUEsT0FBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxPQUFBLE1BQUEsY0FBQSxPQUFBLEtBQUEsYUFBQSxJQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsUUFBQSxLQUFBLGFBQUEsR0FBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxNQUFBLGNBQUEsS0FBQSxNQUFBLFNBQUEsRUFBQSxTQUFBLEtBQUEsYUFBQSxJQUFBLE9BQUEsU0FBQSxLQUFBLGNBQUEsU0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLE9BQUEsTUFBQSxNQUFBLEtBQUEsMENBQUEsR0FBQSxLQUFBLEtBQUEsT0FBQSxNQUFBLEdBQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxJQUFBLG9CQUFBLEtBQUEsYUFBQSxtQkFBQSxNQUFBLGFBQUEsR0FBQSxvQkFBQSxPQUFBLG1CQUFBLE9BQUEsQ0FBQSxJQUFBLEtBQUEsb0JBQUEsb0JBQUEsbUJBQUEsbUJBQUEsS0FBQSxJQUFBLElBQUEsUUFBQSxJQUFBLE1BQUEsbUJBQUEsUUFBQSxXQUFBLG1CQUFBLE9BQUEsb0JBQUEsT0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEtBQUEsUUFBQSxJQUFBLG1CQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsV0FBQSxFQUFBLG1CQUFBLE9BQUEsSUFBQSxRQUFBLEdBQUEsTUFBQSxjQUFBLG9CQUFBLEVBQUEsWUFBQSxtQkFBQSxJQUFBLE9BQUEsSUFBQSxVQUFBLE1BQUEsVUFBQSxLQUFBLFVBQUEsU0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLE9BQUEsTUFBQSxNQUFBLEtBQUEsMENBQUEsR0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLGNBQUEsS0FBQSxhQUFBLFFBQUEsY0FBQSxPQUFBLGNBQUEsTUFBQSxhQUFBLFFBQUEsY0FBQSxPQUFBLFFBQUEsSUFBQSxNQUFBLFFBQUEsUUFBQSxHQUFBLEVBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsT0FBQSxjQUFBLEdBQUEsRUFBQSxFQUFBLFFBQUEsRUFBQSxJQUFBLFFBQUEsRUFBQSxHQUFBLE1BQUEsY0FBQSxRQUFBLEVBQUEsR0FBQSxLQUFBLE1BQUEsU0FBQSxPQUFBLGNBQUEsS0FBQSxPQUFBLElBQUEsVUFBQSxLQUFBLE1BQUEsVUFBQSxLQUFBLFVBQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxHQUFBLE9BQUEsT0FBQSxLQUFBLE1BQUEsS0FBQSxHQUFBLEdBQUEsT0FBQSxPQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsS0FBQSxhQUFBLE9BQUEsUUFBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUEsYUFBQSxHQUFBLFFBQUEsT0FBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLFVBQUEsS0FBQSxtQkFBQSxTQUFBLE9BQUEsWUFBQSxDQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUEsMkJBQUEsR0FBQSxHQUFBLFlBQUEsT0FBQSxLQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxLQUFBLGFBQUEsT0FBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLEVBQUEsUUFBQSxPQUFBLElBQUEsUUFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxhQUFBLEdBQUEsYUFBQSxPQUFBLElBQUEsVUFBQSxLQUFBLE1BQUEsVUFBQSxLQUFBLE9BQUEsU0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLE9BQUEsTUFBQSxNQUFBLEtBQUEsMENBQUEsR0FBQSxNQUFBLEtBQUEsS0FBQSxjQUFBLElBQUEsSUFBQSxTQUFBLEtBQUEsTUFBQSxLQUFBLFVBQUEsS0FBQSx1QkFBQSxNQUFBLGVBQUEsTUFBQSxRQUFBLDhCQUFBLEtBQUEsTUFBQSxRQUFBLHdCQUFBLFVBQUEsUUFBQSxNQUFBLFFBQUEsQ0FBQSxVQUFBLE1BQUE7SUFDQSxJQUFBLGlCQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUEsTUFBQSxLQUFBLE1BQUEsU0FBQSxVQUFBLGVBQUEsVUFBQSxRQUFBLCtCQUFBLEtBQUEsTUFBQSxtQkFBQSxpQkFBQSxPQUFBLGtCQUFBLEtBQUEsTUFBQSxjQUFBLGlCQUFBLE9BQUEsU0FBQSxTQUFBLGNBQUEsbUJBQUEsVUFBQSxVQUFBLGNBQUEsTUFBQSxPQUFBLElBQUEsTUFBQSxTQUFBLFlBQUEsU0FBQSxNQUFBLFVBQUEsQ0FBQSxLQUFBLFNBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsTUFBQSxHQUFBLFdBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQSxTQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxNQUFBLEdBQUEsSUFBQSxHQUFBLEVBQUEsS0FBQSxLQUFBLElBQUEsVUFBQSxLQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxJQUFBLE1BQUEsR0FBQSxJQUFBLEdBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxVQUFBLEtBQUEsSUFBQSxNQUFBLE1BQUEsS0FBQSxpQkFBQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsT0FBQSxLQUFBLGlCQUFBLE1BQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUEsY0FBQSxTQUFBLE9BQUEsWUFBQSxDQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUEsMkJBQUEsR0FBQSxHQUFBLFlBQUEsT0FBQSxLQUFBLElBQUEsSUFBQSxhQUFBLElBQUEsTUFBQSxPQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsYUFBQSxPQUFBLElBQUEsYUFBQSxHQUFBLEVBQUEsT0FBQSxhQUFBLEdBQUEsWUFBQSxJQUFBLFVBQUEsS0FBQSxlQUFBLEtBQUEsSUFBQSxTQUFBLEVBQUEsQ0FBQSxPQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxLQUFBLDJCQUFBLE9BQUEsS0FBQSxTQUFBLElBQUEsS0FBQSxRQUFBLFNBQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLEtBQUEsNkJBQUEsT0FBQSxLQUFBLFNBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLEdBQUEsR0FBQSxHQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxLQUFBLFNBQUEsQ0FBQSxLQUFBLFNBQUEsR0FBQSxLQUFBLFNBQUEsSUFBQSxNQUFBLFNBQUEsUUFBQSxPQUFBLEtBQUEsQ0FBQSxPQUFBLFFBQUEsRUFBQSxRQUFBLEtBQUEsQ0FBQSxRQUFBLE9BQUEsR0FBQSxDQUFBLE1BQUEsU0FBQSxjQUFBLEtBQUEsS0FBQSxvQkFBQSxDQUFBLEtBQUEsRUFBQSxLQUFBLEtBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsb0JBQUEsb0JBQUEsS0FBQSxpQkFBQSxzQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHNCQUFBLEtBQUEsaUJBQUEsUUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFFBQUEsS0FBQSxpQkFBQSxJQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsSUFBQSxLQUFBLGlCQUFBLElBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxJQUFBLEtBQUEsZUFBQSxVQUFBLENBQUEsS0FBQSxTQUFBLEtBQUEsWUFBQSxTQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsR0FBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsWUFBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsV0FBQSxDQUFBLElBQUEsZUFBQSxLQUFBLElBQUEsV0FBQSxLQUFBLHFCQUFBLE9BQUEsR0FBQSxnQkFBQSxlQUFBLEtBQUEscUJBQUEsRUFBQSxNQUFBLENBQUEsR0FBQSxTQUFBLGtCQUFBLGVBQUEsQ0FBQSxLQUFBLFdBQUEsZUFBQSxHQUFBLEtBQUEsUUFBQSxlQUFBLEdBQUEsS0FBQSxTQUFBLGVBQUEsR0FBQSxLQUFBLGlCQUFBLGFBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxhQUFBLEtBQUEsaUJBQUEsVUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFVBQUEsS0FBQSxpQkFBQSxXQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsV0FBQSxTQUFBLHFCQUFBLENBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsV0FBQSxDQUFBLEVBQUEsS0FBQSxxQkFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLEtBQUEsb0JBQUEsS0FBQSxLQUFBLGlCQUFBLHVCQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEscUJBQUEsR0FBQSxFQUFBLEtBQUEscUJBQUEsR0FBQSxFQUFBLEtBQUEscUJBQUEsR0FBQSxFQUFBLEtBQUEscUJBQUEsR0FBQSxFQUFBLEtBQUEscUJBQUEsR0FBQSxFQUFBLEtBQUEsdUJBQUEsS0FBQSxrQkFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLElBQUEsZ0JBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLE1BQUEsV0FBQSxHQUFBLEdBQUEsR0FBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBLGlCQUFBLE1BQUEsR0FBQSxFQUFBLGdCQUFBLE1BQUEsQ0FBQSxFQUFBLElBQUEsV0FBQSxLQUFBLE1BQUEsQ0FBQSxpQkFBQSxvQkFBQSxHQUFBLFlBQUEsS0FBQSxNQUFBLFdBQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxZQUFBLFdBQUEsSUFBQSxxQkFBQSxhQUFBLEtBQUEsSUFBQSxZQUFBLFdBQUEsSUFBQSxxQkFBQSxhQUFBLEtBQUEsSUFBQSxFQUFBLFlBQUEsV0FBQSxJQUFBLHFCQUFBLEVBQUEsYUFBQSxLQUFBLElBQUEsWUFBQSxXQUFBLElBQUEscUJBQUEsYUFBQSxLQUFBLElBQUEsWUFBQSxXQUFBLElBQUEscUJBQUEsYUFBQSxLQUFBLGNBQUEsU0FBQSxXQUFBLElBQUEsQ0FBQSxPQUFBLElBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsR0FBQSxLQUFBLG1CQUFBLFNBQUEsT0FBQSxRQUFBLFNBQUEsd0JBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxLQUFBLHFCQUFBLEVBQUEsT0FBQSxHQUFBLEdBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxFQUFBLE9BQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQSxXQUFBLEdBQUEsU0FBQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsSUFBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxHQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsS0FBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLE1BQUEsV0FBQSxJQUFBLFNBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsSUFBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLGdCQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsT0FBQSxFQUFBLEtBQUEsSUFBQSxnQkFBQSwwQkFBQSxFQUFBLHdCQUFBLElBQUEsS0FBQSxrQkFBQSxZQUFBLEtBQUEsY0FBQSxXQUFBLEdBQUEsS0FBQSxLQUFBLHFCQUFBLFNBQUEsT0FBQSxRQUFBLFNBQUEsd0JBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSxPQUFBLE1BQUEsV0FBQSxLQUFBLHFCQUFBLEVBQUEsT0FBQSxHQUFBLEdBQUEsTUFBQSxFQUFBLFFBQUEsT0FBQSxRQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxFQUFBLE9BQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQSxXQUFBLEdBQUEsU0FBQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsTUFBQSxFQUFBLFFBQUEsT0FBQSxRQUFBLFdBQUEsSUFBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxHQUFBLE1BQUEsRUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsS0FBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLE1BQUEsV0FBQSxJQUFBLFNBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLE1BQUEsRUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsSUFBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLGdCQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsT0FBQSxFQUFBLEtBQUEsSUFBQSxnQkFBQSwwQkFBQSx3QkFBQSxJQUFBLEtBQUEsa0JBQUEsWUFBQSxLQUFBLGNBQUEsV0FBQSxHQUFBLEtBQUEsS0FBQSxxQkFBQSxTQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxnQkFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFFBQUEsS0FBQSxjQUFBLFdBQUEsR0FBQSxRQUFBLEtBQUEsbUJBQUEsRUFBQSxLQUFBLE1BQUEsU0FBQSxXQUFBLEdBQUEsaUJBQUEsR0FBQSxDQUFBLE1BQUEsV0FBQSxRQUFBLEtBQUEscUJBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxNQUFBLFNBQUEsV0FBQSxHQUFBLGlCQUFBLENBQUEsTUFBQSxVQUFBLENBQUEsSUFBQSxJQUFBLG9CQUFBLGdCQUFBLEVBQUEsTUFBQSxDQUFBLEVBQUEsSUFBQSxLQUFBLGdCQUFBLE9BQUEsTUFBQSxFQUFBLElBQUEsTUFBQSxRQUFBLENBQUEsSUFBQSxPQUFBLEtBQUEsZ0JBQUEsT0FBQSxHQUFBLE9BQUEsWUFBQSxvQkFBQSxRQUFBLFNBQUEsQ0FBQSxPQUFBLGlCQUFBLE1BQUEsQ0FBQSxFQUFBLE9BQUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxJQUFBLE1BQUEsSUFBQSxjQUFBLFFBQUEsUUFBQSxxQkFBQSxLQUFBLGdCQUFBLEtBQUEsT0FBQSxNQUFBLEtBQUEscUJBQUEsS0FBQSxvQkFBQSx5QkFBQSxPQUFBLE1BQUEsQ0FBQSxFQUFBLE1BQUEsQ0FBQSxHQUFBLEtBQUEsbUJBQUEsVUFBQSxDQUFBLElBQUEsVUFBQSxLQUFBLGdCQUFBLE9BQUEsR0FBQSxFQUFBLFVBQUEsS0FBQSx1Q0FBQSxHQUFBLFVBQUEsRUFBQSxDQUFBLElBQUEsSUFBQSxnQkFBQSxFQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxpQkFBQSxLQUFBLGdCQUFBLEdBQUEsb0JBQUEsSUFBQSxJQUFBLFFBQUEsZ0JBQUEsVUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLGdCQUFBLFFBQUEsS0FBQSxnQkFBQSxPQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsUUFBQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxJQUFBLFFBQUEsb0JBQUEsU0FBQSxHQUFBLFVBQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsTUFBQSxPQUFBLEtBQUEsZ0JBQUEsTUFBQSxFQUFBLElBQUEsTUFBQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsZ0JBQUEsS0FBQSxLQUFBLFlBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxLQUFBLGdCQUFBLE9BQUEsR0FBQSxHQUFBLElBQUEsT0FBQSxFQUFBLElBQUEsSUFBQSxxQkFBQSxLQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsT0FBQSxLQUFBLGdCQUFBLEdBQUEsR0FBQSxPQUFBLE9BQUEsY0FBQSxDQUFBLEdBQUEsTUFBQSxxQkFBQSxPQUFBLEtBQUEsV0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLENBQUEsS0FBQSxJQUFBLHFCQUFBLEVBQUEsT0FBQSxHQUFBLEtBQUEsSUFBQSxxQkFBQSxFQUFBLE9BQUEsSUFBQSxHQUFBLHFCQUFBLFFBQUEsT0FBQSxHQUFBLEtBQUEsNkJBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxlQUFBLEVBQUEsZ0JBQUEsRUFBQSxJQUFBLEtBQUEsZ0JBQUEsT0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLFFBQUEsS0FBQSxnQkFBQSxHQUFBLFFBQUEsT0FBQSxnQkFBQSxpQkFBQSxpQkFBQSxRQUFBLHFCQUFBLEdBQUEsRUFBQSxlQUFBLE1BQUEsQ0FBQSxFQUFBLElBQUEsSUFBQSxRQUFBLGdCQUFBLElBQUEsZUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxRQUFBLEtBQUEsZ0JBQUEsR0FBQSxnQkFBQSxLQUFBLElBQUEsUUFBQSxvQkFBQSxTQUFBLE1BQUEsSUFBQSxpQkFBQSxnQkFBQSxLQUFBLGtCQUFBLFNBQUEsTUFBQSxDQUFBLElBQUEsVUFBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLE1BQUEsSUFBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLE9BQUEsTUFBQSxNQUFBLEtBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxjQUFBLENBQUEsU0FBQSxPQUFBLGFBQUEsTUFBQSxVQUFBLElBQUEsSUFBQSxLQUFBLENBQUEsRUFBQSxXQUFBLElBQUEsTUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsR0FBQSxDQUFBLEtBQUEsR0FBQSxNQUFBLENBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLGFBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsR0FBQSxNQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsSUFBQSxFQUFBLGVBQUEsZUFBQSxXQUFBLHFCQUFBLEdBQUEsSUFBQSxFQUFBLGNBQUEsR0FBQSxHQUFBLGFBQUEsR0FBQSxLQUFBLGtCQUFBLFlBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxxQkFBQSxXQUFBLEVBQUEsR0FBQSxHQUFBLFVBQUEsR0FBQSxNQUFBLEVBQUEsS0FBQSxXQUFBLEtBQUEsS0FBQSxtQ0FBQSxDQUFBLElBQUEsUUFBQSxLQUFBLGNBQUEsUUFBQSxXQUFBLEtBQUEsR0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLEVBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxVQUFBLEtBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxFQUFBLE9BQUEsUUFBQSxJQUFBLGFBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsT0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxhQUFBLE9BQUEsV0FBQSxFQUFBLHFCQUFBLFdBQUEsZ0JBQUEsR0FBQSxLQUFBLGtCQUFBLFlBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxxQkFBQSxXQUFBLEVBQUEsTUFBQSxZQUFBLE1BQUEsV0FBQSxHQUFBLEtBQUEsYUFBQSxLQUFBLGtDQUFBLElBQUEsWUFBQSxLQUFBLHFCQUFBLE9BQUEsT0FBQSxrQkFBQSxhQUFBLElBQUEsa0JBQUEsY0FBQSxTQUFBLGlCQUFBLEtBQUEsS0FBQSxvQkFBQSxDQUFBLEtBQUEsRUFBQSxLQUFBLEtBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsb0JBQUEsb0JBQUEsS0FBQSxpQkFBQSxzQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHNCQUFBLEtBQUEsaUJBQUEsUUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFFBQUEsS0FBQSxpQkFBQSxJQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxpQkFBQSxJQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxlQUFBLFVBQUEsQ0FBQSxLQUFBLFNBQUEsS0FBQSxZQUFBLFNBQUEsV0FBQSxFQUFBLEVBQUEsQ0FBQSxHQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxZQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxXQUFBLENBQUEsSUFBQSxlQUFBLEtBQUEsSUFBQSxXQUFBLEtBQUEscUJBQUEsT0FBQSxHQUFBLGdCQUFBLGVBQUEsS0FBQSxxQkFBQSxFQUFBLE1BQUEsQ0FBQSxHQUFBLFNBQUEsdUJBQUEsTUFBQSxPQUFBLE9BQUEsTUFBQSxPQUFBLFdBQUEsb0JBQUEsQ0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLGdCQUFBLElBQUEsTUFBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLFdBQUEsV0FBQSxLQUFBLHFCQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsR0FBQSxLQUFBLG9CQUFBLG9CQUFBLEtBQUEsY0FBQSxTQUFBLFdBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLEdBQUEsS0FBQSxrQkFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLElBQUEsV0FBQSxLQUFBLFdBQUEsWUFBQSxXQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFdBQUEsV0FBQSxLQUFBLFlBQUEsTUFBQSxDQUFBLEVBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxtQkFBQSxTQUFBLE9BQUEsUUFBQSxTQUFBLHdCQUFBLENBQUEsSUFBQSxNQUFBLEtBQUEsTUFBQSxLQUFBLE9BQUEsT0FBQSxXQUFBLEtBQUEscUJBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxHQUFBLEdBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsSUFBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxHQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsR0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxJQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLE1BQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLENBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsSUFBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLElBQUEsZ0JBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsT0FBQSxFQUFBLEtBQUEsSUFBQSxnQkFBQSwwQkFBQSxFQUFBLHdCQUFBLElBQUEsS0FBQSxrQkFBQSxZQUFBLEtBQUEsY0FBQSxXQUFBLEdBQUEsS0FBQSxLQUFBLHFCQUFBLFNBQUEsV0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLGdCQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFFBQUEsS0FBQSxjQUFBLFdBQUEsR0FBQSxRQUFBLEtBQUEsbUJBQUEsRUFBQSxLQUFBLE1BQUEsU0FBQSxFQUFBLFdBQUEsR0FBQSxpQkFBQSxHQUFBLENBQUEsTUFBQSxTQUFBLENBQUEsSUFBQSxJQUFBLG9CQUFBLENBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBLEtBQUEsZ0JBQUEsT0FBQSxNQUFBLEVBQUEsSUFBQSxNQUFBLFFBQUEsQ0FBQSxJQUFBLE9BQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsT0FBQSxZQUFBLG9CQUFBLFFBQUEsU0FBQSxPQUFBLElBQUEsaUJBQUEsUUFBQSxRQUFBLHFCQUFBLElBQUEsTUFBQSxJQUFBLGlCQUFBLFFBQUEsUUFBQSxxQkFBQSxLQUFBLGdCQUFBLEtBQUEsT0FBQSxNQUFBLEtBQUEscUJBQUEsS0FBQSxvQkFBQSx5QkFBQSxPQUFBLE9BQUEsTUFBQSxLQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxPQUFBLEtBQUEsT0FBQSxPQUFBLEtBQUEsT0FBQSxLQUFBLE9BQUEsTUFBQSxRQUFBLFFBQUEsUUFBQSxHQUFBLFdBQUEsSUFBQSxNQUFBLEVBQUEsRUFBQSxHQUFBLEtBQUEsRUFBQSxPQUFBLEtBQUEsT0FBQSxDQUFBLElBQUEsRUFBQSxTQUFBLElBQUEsRUFBQSxNQUFBLEtBQUEsR0FBQSxFQUFBLEVBQUEsS0FBQSxHQUFBLElBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsT0FBQSxNQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsYUFBQSxFQUFBLEtBQUEsR0FBQSxDQUFBLEdBQUEsTUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLEdBQUEsR0FBQSxhQUFBLFdBQUEscUJBQUEsR0FBQSxHQUFBLGFBQUEsQ0FBQSxHQUFBLEtBQUEsa0JBQUEsWUFBQSxDQUFBLElBQUEsVUFBQSxLQUFBLHFCQUFBLFdBQUEsRUFBQSxHQUFBLEdBQUEsTUFBQSxVQUFBLE9BQUEsVUFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLGFBQUEsT0FBQSxXQUFBLEVBQUEscUJBQUEsR0FBQSxjQUFBLGVBQUEsV0FBQSxnQkFBQSxJQUFBLEdBQUEsS0FBQSxrQkFBQSxZQUFBLENBQUEsSUFBQSxVQUFBLEtBQUEscUJBQUEsV0FBQSxFQUFBLE1BQUEsR0FBQSxNQUFBLFVBQUEsT0FBQSxXQUFBLEdBQUEsR0FBQSxLQUFBLGdCQUFBLE9BQUEsT0FBQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSwyQ0FBQSxTQUFBLHNCQUFBLE9BQUEsUUFBQSx1QkFBQSxDQUFBLEtBQUEsYUFBQSxFQUFBLEtBQUEsV0FBQSxFQUFBLEtBQUEsV0FBQSxFQUFBLEtBQUEsT0FBQSxPQUFBLEtBQUEsdUJBQUEsdUJBQUEsR0FBQSxRQUFBLEtBQUEsZUFBQSxFQUFBLFNBQUEsSUFBQSxJQUFBLFFBQUEsS0FBQSxlQUFBLEVBQUEsU0FBQSxJQUFBLElBQUEsVUFBQSxLQUFBLGVBQUEsR0FBQSxLQUFBLFlBQUEsU0FBQSxRQUFBLENBQUEsSUFBQSxLQUFBLEVBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQSxFQUFBLENBQUEsSUFBQSxJQUFBLEtBQUEsRUFBQSxFQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxHQUFBLEVBQUEsT0FBQSxPQUFBLEtBQUEsV0FBQSxRQUFBLEVBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxLQUFBLGNBQUEsT0FBQSxLQUFBLFdBQUEsUUFBQSxFQUFBLEtBQUEsWUFBQSxRQUFBLEtBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsV0FBQSxFQUFBLElBQUEsT0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLENBQUEsS0FBQSxPQUFBLEtBQUEsY0FBQSxRQUFBLFNBQUEsS0FBQSxXQUFBLEdBQUEsS0FBQSxlQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsZUFBQSxHQUFBLFNBQUEsS0FBQSxXQUFBLElBQUEsS0FBQSxXQUFBLEtBQUEsV0FBQSxRQUFBLEVBQUEsS0FBQSxXQUFBLElBQUEsS0FBQSxXQUFBLEVBQUEsS0FBQSxZQUFBLEtBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQSxFQUFBLEdBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLFdBQUEsRUFBQSxJQUFBLE9BQUEsR0FBQSxFQUFBLElBQUEsZUFBQSxDQUFBLEtBQUEsT0FBQSxLQUFBLGNBQUEsUUFBQSxTQUFBLEtBQUEsV0FBQSxHQUFBLEtBQUEsZUFBQSxJQUFBLGdCQUFBLEtBQUEsT0FBQSxLQUFBLGVBQUEsU0FBQSxLQUFBLFdBQUEsRUFBQSxHQUFBLEtBQUEsZUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsU0FBQSxLQUFBLFdBQUEsRUFBQSxHQUFBLElBQUEsT0FBQSxHQUFBLEVBQUEsUUFBQSxHQUFBLFNBQUEsS0FBQSxXQUFBLEVBQUEsSUFBQSxJQUFBLGVBQUEsQ0FBQSxLQUFBLE9BQUEsS0FBQSxjQUFBLFFBQUEsR0FBQSxTQUFBLEtBQUEsV0FBQSxFQUFBLElBQUEsT0FBQSxLQUFBLGVBQUEsZ0JBQUEsZUFBQSxLQUFBLFdBQUEsS0FBQSxXQUFBLENBQUEsUUFBQSxHQUFBLEVBQUEsS0FBQSxXQUFBLElBQUEsS0FBQSxXQUFBLEVBQUEsS0FBQSxZQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsU0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGFBQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSx1QkFBQSxFQUFBLEVBQUEsS0FBQSxZQUFBLElBQUEsS0FBQSxjQUFBLFNBQUEsY0FBQSxDQUFBLElBQUEsSUFBQSxNQUFBLElBQUEsQ0FBQSxHQUFBLGVBQUEsT0FBQSxFQUFBLE1BQUEsUUFBQSxPQUFBLEtBQUEsWUFBQSxPQUFBLHFCQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLHdCQUFBLFNBQUEsV0FBQSxDQUFBLElBQUEsT0FBQSxXQUFBLFFBQUEsRUFBQSxRQUFBLEdBQUEsb0JBQUEsSUFBQSxNQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxPQUFBLEVBQUEsQ0FBQSxRQUFBLEtBQUEsWUFBQSxJQUFBLElBQUEsWUFBQSxLQUFBLE1BQUEsUUFBQSxJQUFBLGFBQUEsUUFBQSxHQUFBLFNBQUEsb0JBQUEsYUFBQSxTQUFBLG9CQUFBLGNBQUEsUUFBQSxPQUFBLEdBQUEsU0FBQSxRQUFBLEtBQUEsWUFBQSxHQUFBLFNBQUEsb0JBQUEsU0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBLE9BQUEsU0FBQSxLQUFBLGdCQUFBLFNBQUEsV0FBQSxDQUFBLElBQUEsT0FBQSxXQUFBLFFBQUEsRUFBQSxRQUFBLEdBQUEsR0FBQSxRQUFBLEdBQUEsUUFBQSxLQUFBLFlBQUEsSUFBQSxJQUFBLFVBQUEsU0FBQSxLQUFBLEdBQUEsVUFBQSxTQUFBLEtBQUEsUUFBQSxHQUFBLEdBQUEsUUFBQSxRQUFBLEtBQUEsWUFBQSxHQUFBLEdBQUEsVUFBQSxTQUFBLEtBQUEsUUFBQSxHQUFBLEdBQUEsU0FBQSxRQUFBLEtBQUEsWUFBQSxHQUFBLFFBQUEsR0FBQSxTQUFBLGNBQUEsT0FBQSxHQUFBLE9BQUEsU0FBQSxLQUFBLGlCQUFBLFNBQUEsV0FBQSxDQUFBLElBQUEsT0FBQSxXQUFBLFFBQUEsRUFBQSxPQUFBLElBQUEsTUFBQSxHQUFBLFFBQUEsS0FBQSxZQUFBLEdBQUEsT0FBQSxLQUFBLFNBQUEsZUFBQSxPQUFBLEdBQUEsT0FBQSxRQUFBLEtBQUEsZUFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEsV0FBQSxRQUFBLEVBQUEsY0FBQSxHQUFBLEVBQUEsQ0FBQSxRQUFBLFlBQUEsSUFBQSxJQUFBLFVBQUEsUUFBQSxJQUFBLFdBQUEsUUFBQSxJQUFBLFNBQUEsQ0FBQSxZQUFBLEdBQUEsVUFBQSxhQUFBLEVBQUEsYUFBQSxPQUFBLFNBQUEsTUFBQSxTQUFBLE1BQUEsU0FBQSxNQUFBLGVBQUEsT0FBQSxhQUFBLGNBQUEsZUFBQSxPQUFBLEdBQUEsT0FBQSxlQUFBLEtBQUEsaUJBQUEsV0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLE9BQUEsSUFBQSxNQUFBLFlBQUEsRUFBQSxzQkFBQSxFQUFBLGVBQUEsRUFBQSxXQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsS0FBQSxXQUFBLEdBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxPQUFBLE9BQUEsRUFBQSxNQUFBLEtBQUEsbUJBQUEsR0FBQSxNQUFBLGFBQUEsTUFBQSx1QkFBQSxNQUFBLGdCQUFBLE1BQUEsV0FBQSxLQUFBLGlCQUFBLEtBQUEsY0FBQSxLQUFBLGFBQUEsUUFBQSxLQUFBLFdBQUEsSUFBQSxHQUFBLFdBQUEsS0FBQSxjQUFBLE1BQUEsV0FBQSxFQUFBLEtBQUEsd0JBQUEsV0FBQSxPQUFBLE1BQUEsS0FBQSxZQUFBLElBQUEsSUFBQSxTQUFBLEtBQUEsZ0JBQUEsWUFBQSxHQUFBLElBQUEsTUFBQSxTQUFBLFFBQUEsRUFBQSxFQUFBLEVBQUEsU0FBQSxPQUFBLElBQUEsR0FBQSxHQUFBLFNBQUEsV0FBQSxHQUFBLE9BQUEsS0FBQSxJQUFBLE1BQUEsS0FBQSxzQkFBQSxJQUFBLElBQUEsU0FBQSxLQUFBLHdCQUFBLFlBQUEsR0FBQSxJQUFBLE1BQUEsU0FBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLFNBQUEsT0FBQSxJQUFBLEdBQUEsR0FBQSxTQUFBLFdBQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxNQUFBLEtBQUEsZUFBQSxJQUFBLGlCQUFBLEtBQUEsaUJBQUEsWUFBQSxPQUFBLEtBQUEsa0JBQUEsTUFBQSxLQUFBLFdBQUEsSUFBQSxTQUFBLEtBQUEsZUFBQSxZQUFBLE9BQUEsS0FBQSxXQUFBLE9BQUEsU0FBQSxZQUFBLEdBQUEsWUFBQSxvQkFBQSxTQUFBLE1BQUEsT0FBQSxDQUFBLElBQUEsSUFBQSxNQUFBLE9BQUEsTUFBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLENBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxPQUFBLFFBQUEsT0FBQSxRQUFBLEVBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLE9BQUEsU0FBQSxFQUFBLEtBQUEsTUFBQSxPQUFBLE9BQUEsSUFBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsS0FBQSw2QkFBQSxPQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxPQUFBLFFBQUEsRUFBQSxPQUFBLENBQUEsR0FBQSxHQUFBLFFBQUEsT0FBQSxRQUFBLE1BQUEsRUFBQSxPQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxPQUFBLE9BQUEsR0FBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLEdBQUEsU0FBQSxPQUFBLE9BQUEsR0FBQSxPQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsT0FBQSxDQUFBLEVBQUEsSUFBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLEVBQUEsUUFBQSxHQUFBLE9BQUEsUUFBQSxFQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxPQUFBLFNBQUEsRUFBQSxLQUFBLE1BQUEsT0FBQSxPQUFBLElBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUEsNkJBQUEsT0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsT0FBQSxRQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsR0FBQSxRQUFBLE9BQUEsUUFBQSxNQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsT0FBQSxPQUFBLEdBQUEsRUFBQSxPQUFBLENBQUEsR0FBQSxHQUFBLFNBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxFQUFBLE9BQUEsQ0FBQSxLQUFBLFlBQUEsWUFBQSxTQUFBLE1BQUEsVUFBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxVQUFBLFdBQUEsT0FBQSxJQUFBLE1BQUEsV0FBQSxHQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsSUFBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsR0FBQSxPQUFBLEVBQUEsR0FBQSxPQUFBLFVBQUEsaUJBQUEsUUFBQSxZQUFBLG9CQUFBLE1BQUEsUUFBQSxHQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLE9BQUEsSUFBQSxLQUFBLE1BQUEsT0FBQSxFQUFBLElBQUEsT0FBQSxNQUFBLEVBQUEsSUFBQSxNQUFBLEtBQUEsTUFBQSxPQUFBLElBQUEsT0FBQSxNQUFBLEtBQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLElBQUEsSUFBQSxFQUFBLE9BQUEsVUFBQSxLQUFBLE9BQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxPQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsRUFBQSxPQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsSUFBQSxLQUFBLEtBQUEsWUFBQSxHQUFBLEVBQUEsSUFBQSxNQUFBLE9BQUEsQ0FBQSxLQUFBLDZCQUFBLE9BQUEsTUFBQSxZQUFBLFlBQUEsU0FBQSxNQUFBLFVBQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxDQUFBLElBQUEsVUFBQSxxQkFBQSw2QkFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxTQUFBLE9BQUEsWUFBQSxZQUFBLE1BQUEsVUFBQSxZQUFBLFFBQUEsb0JBQUEsSUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLFFBQUEsUUFBQSxTQUFBLGdCQUFBLFFBQUEsb0JBQUEsU0FBQSxjQUFBLENBQUEsR0FBQSxFQUFBLGVBQUEsY0FBQSxHQUFBLEtBQUEsb0JBQUEsT0FBQSxRQUFBLFNBQUEsY0FBQSxJQUFBLFFBQUEsa0NBQUEsU0FBQSxVQUFBLENBQUEsR0FBQSxVQUFBLEdBQUEsRUFBQSxLQUFBLDBDQUFBLEdBQUEsQ0FBQSxPQUFBLFFBQUEsb0JBQUEsVUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLENBQUEsS0FBQSw4QkFBQSxRQUFBLHlCQUFBLFNBQUEsWUFBQSxDQUFBLElBQUEsSUFBQSxlQUFBLFdBQUEsWUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLFFBQUEsb0JBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxjQUFBLFFBQUEsb0JBQUEsR0FBQSxHQUFBLGVBQUEsWUFBQSxPQUFBLEtBQUEsb0JBQUEsRUFBQSxHQUFBLElBQUEsZUFBQSxrQkFBQSxpQkFBQSxZQUFBLGVBQUEsZUFBQSxpQkFBQSxZQUFBLEVBQUEsRUFBQSxlQUFBLGdCQUFBLE9BQUEsR0FBQSxlQUFBLEtBQUEsb0JBQUEsYUFBQSxNQUFBLHFCQUFBLDZCQUFBLFNBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxDQUFBLElBQUEsS0FBQSxLQUFBLHNCQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxLQUFBLEtBQUEsc0JBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxLQUFBLE9BQUEsS0FBQSxNQUFBLE9BQUEscUJBQUEsc0JBQUEsU0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxPQUFBLElBQUEsR0FBQSxHQUFBLElBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQSxJQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxFQUFBLEVBQUEsSUFBQSxJQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsWUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxLQUFBLFlBQUEsSUFBQSxDQUFBLElBQUEsSUFBQSxJQUFBLEtBQUEsWUFBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxLQUFBLHFCQUFBLHNCQUFBLFNBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsT0FBQSxLQUFBLHNCQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxnQkFBQSxJQUFBLG9CQUFBLE1BQUEsMEJBQUEsSUFBQSxNQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxJQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsS0FBQSxzQkFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxrQkFBQSxpQkFBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLE9BQUEsR0FBQSxFQUFBLHNCQUFBLEdBQUEsR0FBQSxzQkFBQSxHQUFBLFFBQUEsRUFBQSxJQUFBLHNCQUFBLEdBQUEsUUFBQSxFQUFBLElBQUEsc0JBQUEsR0FBQSxRQUFBLEVBQUEsS0FBQSxzQkFBQSxHQUFBLFFBQUEsRUFBQSxLQUFBLHNCQUFBLEdBQUEsUUFBQSxFQUFBLEtBQUEsc0JBQUEsR0FBQSxRQUFBLEVBQUEsS0FBQSxzQkFBQSxHQUFBLFFBQUEsRUFBQSxNQUFBLGtCQUFBLHdCQUFBLFNBQUEsaUJBQUEsQ0FBQSxJQUFBLFdBQUEsa0JBQUEsMEJBQUEsa0JBQUEsT0FBQSxNQUFBLFdBQUEsV0FBQSxrQkFBQSwwQkFBQSxpQkFBQSxzQkFBQSxrQkFBQSwwQkFBQSxTQUFBLGlCQUFBLENBQUEsSUFBQSxJQUFBLGVBQUEsV0FBQSxlQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsMEJBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxXQUFBLDBCQUFBLEdBQUEsV0FBQSxXQUFBLEdBQUEsR0FBQSxZQUFBLGlCQUFBLE9BQUEsSUFBQSxrQkFBQSxXQUFBLElBQUEsSUFBQSxlQUFBLEtBQUEsaUJBQUEsaUJBQUEsWUFBQSxlQUFBLGlCQUFBLGVBQUEsV0FBQSxHQUFBLGVBQUEsZ0JBQUEsT0FBQSxHQUFBLGVBQUEsSUFBQSxrQkFBQSxnQkFBQSxNQUFBLHFCQUFBLFFBQUEsU0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLE1BQUEsTUFBQSxTQUFBLE9BQUEsS0FBQSxvQkFBQSxPQUFBLFNBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQSxxQkFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEscUJBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLHFCQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxxQkFBQSxFQUFBLEVBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLFVBQUEsY0FBQSxTQUFBLGFBQUEsUUFBQSxRQUFBLENBQUEsR0FBQSxhQUFBLFFBQUEsUUFBQSxlQUFBLEtBQUEsb0JBQUEsSUFBQSxJQUFBLFNBQUEsUUFBQSxvQkFBQSxTQUFBLFlBQUEsRUFBQSxhQUFBLFNBQUEsY0FBQSxFQUFBLEVBQUEsRUFBQSxhQUFBLE9BQUEsSUFBQSxhQUFBLGFBQUEsR0FBQSxNQUFBLElBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxhQUFBLGdCQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsYUFBQSxPQUFBLElBQUEsSUFBQSxJQUFBLFFBQUEsYUFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLFFBQUEsTUFBQSxJQUFBLENBQUEsSUFBQSxpQkFBQSxRQUFBLGNBQUEsa0JBQUEsU0FBQSxvQkFBQSxpQkFBQSxPQUFBLG1CQUFBLElBQUEsVUFBQSxpQkFBQSxJQUFBLE1BQUEsb0JBQUEsSUFBQSxJQUFBLDRCQUFBLE9BQUEsR0FBQSxVQUFBLE9BQUEsb0JBQUEsT0FBQSxPQUFBLEVBQUEscUJBQUEsR0FBQSxDQUFBLElBQUEsYUFBQSxPQUFBLHFCQUFBLFVBQUEsT0FBQSxHQUFBLGNBQUEsNEJBQUEsTUFBQSxzQkFBQSxzQkFBQSxJQUFBLElBQUEsOEJBQUEsNEJBQUEsU0FBQSxvQkFBQSxtQkFBQSxFQUFBLEVBQUEsRUFBQSw4QkFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxnQkFBQSxFQUFBLElBQUEsT0FBQSxHQUFBLFVBQUEsR0FBQSxhQUFBLHNCQUFBLElBQUEsSUFBQSxFQUFBLG9CQUFBLGdCQUFBLEVBQUEsSUFBQSxPQUFBLEdBQUEsVUFBQSwrQkFBQSxhQUFBLHNCQUFBLElBQUEsSUFBQSxJQUFBLE9BQUEsR0FBQSxVQUFBLE9BQUEsRUFBQSw4QkFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLGdCQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsUUFBQSxvQkFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsR0FBQSxVQUFBLFNBQUEsYUFBQSxzQkFBQSxPQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsYUFBQSxTQUFBLFVBQUEsQ0FBQSxHQUFBLEVBQUEsV0FBQSxVQUFBLEVBQUEsS0FBQSwyQkFBQSxPQUFBLFNBQUEsV0FBQSxZQUFBLFNBQUEsV0FBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLElBQUEsWUFBQSxJQUFBLFlBQUEsSUFBQSxZQUFBLElBQUEsWUFBQSxJQUFBLFlBQUEsSUFBQSxZQUFBLElBQUEsYUFBQSxNQUFBLGNBQUEsSUFBQSxNQUFBLEtBQUEsTUFBQSxrQkFBQSxJQUFBLE1BQUEsS0FBQSxNQUFBLGNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLEVBQUEsR0FBQSxRQUFBLEdBQUEsUUFBQSxVQUFBLElBQUEsbUJBQUEsTUFBQSxlQUFBLFFBQUEsY0FBQSxTQUFBLGNBQUEsaUJBQUEsQ0FBQSxJQUFBLElBQUEsYUFBQSxjQUFBLE9BQUEsY0FBQSxJQUFBLE1BQUEsY0FBQSxFQUFBLEVBQUEsYUFBQSxFQUFBLElBQUEsY0FBQSxHQUFBLElBQUEsY0FBQSxHQUFBLElBQUEsZUFBQSxjQUFBLE9BQUEsaUJBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxPQUFBLGNBQUEsZ0JBQUEsTUFBQSxJQUFBLENBQUEsTUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsaUJBQUEsRUFBQSxJQUFBLGNBQUEsR0FBQSxjQUFBLElBQUEsUUFBQSxPQUFBLFNBQUEsS0FBQSxDQUFBLElBQUEsSUFBQSxPQUFBLElBQUEsZ0JBQUEsTUFBQSxRQUFBLE9BQUEsY0FBQSxRQUFBLE9BQUEsd0JBQUEscUJBQUEsVUFBQSxPQUFBLGdCQUFBLFdBQUEsVUFBQSxjQUFBLFVBQUEsUUFBQSxTQUFBLFdBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxXQUFBLE9BQUEsSUFBQSxZQUFBLFdBQUEsR0FBQSxpQkFBQSxJQUFBLElBQUEsWUFBQSxJQUFBLE1BQUEsWUFBQSxhQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsV0FBQSxPQUFBLElBQUEsQ0FBQSxJQUFBLFVBQUEsV0FBQSxHQUFBLGNBQUEsVUFBQSxVQUFBLGlCQUFBLFVBQUEsaUJBQUEsUUFBQSxjQUFBLGNBQUEsa0JBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxpQkFBQSxFQUFBLElBQUEsWUFBQSxnQkFBQSxjQUFBLEdBQUEsSUFBQSxPQUFBLElBQUEsc0JBQUEsWUFBQSxRQUFBLGNBQUEsUUFBQSxNQUFBLE9BQUEsUUFBQSxPQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsT0FBQSxNQUFBLEVBQUEsT0FBQSxPQUFBLEVBQUEsT0FBQSxhQUFBLEtBQUEsT0FBQSxNQUFBLENBQUEsRUFBQSxPQUFBLHFCQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUEsRUFBQSxHQUFBLENBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsT0FBQSxTQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsSUFBQSxDQUFBLEdBQUEsR0FBQSxVQUFBLE9BQUEsQ0FBQSxJQUFBLFVBQUEsU0FBQSxlQUFBLGFBQUEsUUFBQSxVQUFBLFdBQUEsTUFBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSxPQUFBLFVBQUEsUUFBQSxhQUFBLEVBQUEsRUFBQSxPQUFBLE1BQUEsT0FBQSxRQUFBLE9BQUEsT0FBQSxPQUFBLFFBQUEsU0FBQSxNQUFBLE9BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQSxRQUFBLE9BQUEsT0FBQSxJQUFBLE1BQUEsSUFBQSxNQUFBLE1BQUEsT0FBQSxVQUFBLENBQUEsSUFBQSxVQUFBLFNBQUEsY0FBQSxVQUFBLFFBQUEsVUFBQSxXQUFBLE1BQUEsV0FBQSxTQUFBLGVBQUEsY0FBQSxHQUFBLE1BQUEsV0FBQSxDQUFBLElBQUEsT0FBQSxXQUFBLFdBQUEsTUFBQSxPQUFBLFVBQUEsRUFBQSxFQUFBLElBQUEsS0FBQSxPQUFBLFVBQUEsTUFBQSxFQUFBLEVBQUEsSUFBQSxLQUFBLFVBQUEsTUFBQSxNQUFBLE1BQUEsVUFBQSxPQUFBLE1BQUEsT0FBQSxRQUFBLFVBQUEsTUFBQSxFQUFBLEdBQUEsT0FBQSxNQUFBLE1BQUEsTUFBQSxPQUFBLE9BQUEsTUFBQSxPQUFBLEdBQUEsQ0FBQSxPQUFBLFVBQUEsUUFBQSxhQUFBLEVBQUEsRUFBQSxNQUFBLE1BQUEsTUFBQSxRQUFBLE1BQUEsRUFBQSxDQUFBLE9BQUEsT0FBQSxPQUFBLGtIQUFBLEtBQUEsTUFBQSxPQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsU0FBQSxHQUFBLENBQUEsT0FBQSxPQUFBLE9BQUEsUUFBQSxTQUFBLE1BQUEsRUFBQSxDQUFBLFFBQUEsSUFBQSxHQUFBLE9BQUEsT0FBQSx5QkFBQSxNQUFBLE9BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQSxTQUFBLE1BQUEsSUFBQSxLQUFBLE9BQUEsWUFBQSxTQUFBLEVBQUEsQ0FBQSxPQUFBLG1CQUFBLE9BQUEsS0FBQSxPQUFBLFFBQUEsU0FBQSxJQUFBLENBQUEsSUFBQSxNQUFBLENBQUEsSUFBQSxNQUFBLFVBQUEsTUFBQSxPQUFBLGtCQUFBLE9BQUEsYUFBQSxHQUFBLE9BQUEsTUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxNQUFBLElBQUEsQ0FBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxNQUFBLEVBQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxNQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxNQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsTUFBQSxHQUFBLE1BQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxJQUFBLEVBQUEsSUFBQSxhQUFBLE9BQUEsVUFBQSxFQUFBLEdBQUEsSUFBQSxTQUFBLElBQUEsU0FBQSxPQUFBLGFBQUEsU0FBQSxTQUFBLE9BQUEsT0FBQSxJQUFBLGFBQUEsT0FBQSxVQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsT0FBQSxRQUFBLE9BQUEsYUFBQSxNQUFBLEtBQUEsT0FBQSxTQUFBLElBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLE9BQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxHQUFBLE9BQUEsSUFBQSxLQUFBLE9BQUEsYUFBQSxLQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLE1BQUEsVUFBQSxLQUFBLElBQUEsTUFBQSxPQUFBLFFBQUEsSUFBQSxNQUFBLE9BQUEsWUFBQSxNQUFBLE9BQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLEdBQUEsT0FBQSxNQUFBLEVBQUEsS0FBQSxjQUFBLEdBQUEsT0FBQSxPQUFBLEVBQUEsS0FBQSxjQUFBLE9BQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLE1BQUEsRUFBQSxFQUFBLENBQUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsTUFBQSxHQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsTUFBQSxJQUFBLElBQUEsR0FBQSxPQUFBLFNBQUEsU0FBQSxHQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxNQUFBLE9BQUEsTUFBQSxPQUFBLFFBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsTUFBQSxJQUFBLENBQUEsSUFBQSxLQUFBLE9BQUEsU0FBQSxFQUFBLEdBQUEsSUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLElBQUEsS0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLE9BQUEsS0FBQSxPQUFBLDJCQUFBLFNBQUEsTUFBQSxDQUFBLElBQUEsSUFBQSxZQUFBLEVBQUEsVUFBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLGFBQUEsV0FBQSxLQUFBLE1BQUEsT0FBQSxPQUFBLGFBQUEsT0FBQSxJQUFBLE1BQUEsYUFBQSxFQUFBLEVBQUEsWUFBQSxFQUFBLElBQUEsQ0FBQSxPQUFBLEdBQUEsSUFBQSxNQUFBLGFBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxZQUFBLEdBQUEsS0FBQSxPQUFBLEdBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsWUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxZQUFBLEdBQUEsS0FBQSxDQUFBLE9BQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsVUFBQSxHQUFBLEtBQUEsQ0FBQSxJQUFBLE9BQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxDQUFBLFdBQUEsR0FBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsSUFBQSxJQUFBLEtBQUEsT0FBQSxJQUFBLElBQUEsR0FBQSxRQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsS0FBQSxPQUFBLElBQUEsSUFBQSxHQUFBLFNBQUEsSUFBQSxJQUFBLE9BQUEsSUFBQSxNQUFBLGFBQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLE9BQUEsSUFBQSxJQUFBLE1BQUEsYUFBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsWUFBQSxHQUFBLEtBQUEsT0FBQSxJQUFBLElBQUEsS0FBQSxNQUFBLENBQUEsT0FBQSxJQUFBLElBQUEsR0FBQSxPQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsT0FBQSxRQUFBLE9BQUEsa0JBQUEsU0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLE9BQUEsT0FBQSwyQkFBQSxXQUFBLFlBQUEsT0FBQSxPQUFBLFVBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxhQUFBLFdBQUEsS0FBQSxNQUFBLE9BQUEsT0FBQSxhQUFBLE9BQUEsSUFBQSxNQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsWUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFVBQUEsR0FBQSxLQUFBLE9BQUEsVUFBQSxHQUFBLEdBQUEsQ0FBQSxXQUFBLEdBQUEsSUFBQSxPQUFBLE9BQUEsVUFBQSxVQUFBLEdBQUEsR0FBQSxDQUFBLFdBQUEsR0FBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLElBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQTtJQUNBLE9BQUEsUUFBQSxPQUFBLFVBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLE1BQUEsSUFBQSxDQUFBLElBQUEsS0FBQSxPQUFBLFNBQUEsRUFBQSxHQUFBLElBQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxNQUFBLFVBQUEsT0FBQSxTQUFBLEtBQUEsR0FBQSxDQUFBLElBQUEsS0FBQSxLQUFBLE1BQUEsQ0FBQSxJQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxLQUFBLE9BQUEsRUFBQSxLQUFBLEtBQUEsT0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxPQUFBLElBQUEsU0FBQSxFQUFBLFlBQUEsR0FBQSxtQkFBQSxFQUFBLGNBQUEsRUFBQSxPQUFBLGtCQUFBLFNBQUEsU0FBQSxDQUFBLFNBQUEsU0FBQSxTQUFBLFNBQUEsQ0FBQSxPQUFBLE1BQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxNQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsTUFBQSxNQUFBLE9BQUEsU0FBQSxjQUFBLE9BQUEsT0FBQSxPQUFBLENBQUEsSUFBQSxHQUFBLE9BQUEsRUFBQSxHQUFBLE9BQUEsRUFBQSxNQUFBLENBQUEsT0FBQSxFQUFBLEtBQUEsT0FBQSxFQUFBLElBQUEsQ0FBQSxPQUFBLEVBQUEsS0FBQSxPQUFBLEVBQUEsSUFBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLGdCQUFBLFNBQUEsU0FBQSxHQUFBLFNBQUEsSUFBQSxlQUFBLFNBQUEsU0FBQSxHQUFBLFNBQUEsSUFBQSxnQkFBQSxTQUFBLFNBQUEsR0FBQSxTQUFBLElBQUEsR0FBQSxnQkFBQSxpQkFBQSxnQkFBQSxpQkFBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsSUFBQSxpQkFBQSxnQkFBQSxpQkFBQSxpQkFBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsS0FBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsSUFBQSxjQUFBLE9BQUEsT0FBQSxRQUFBLEVBQUEsQ0FBQSxJQUFBLEtBQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsR0FBQTtBQ0ZBLFFBQUEsT0FBQTtHQUNBLFFBQUEsZUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLE9BQUEsWUFBQSxRQUFBLFNBQUEsU0FBQTtNQUNBLElBQUEsY0FBQTs7TUFFQSxTQUFBLGFBQUEsTUFBQSxJQUFBLFVBQUE7O1FBRUEsR0FBQSxDQUFBLFdBQUEsQ0FBQSxRQUFBLE9BQUEsS0FBQSxPQUFBLEtBQUE7O1FBRUEsSUFBQSxHQUFBO1VBQ0EsR0FBQSxLQUFBOzs7O01BSUEsU0FBQSxhQUFBLE1BQUEsSUFBQSxVQUFBO1FBQ0EsR0FBQSxDQUFBLFdBQUEsQ0FBQSxPQUFBLEdBQUE7UUFDQSxJQUFBLElBQUE7VUFDQSxHQUFBOzs7O01BSUEsWUFBQSxvQkFBQSxTQUFBLE9BQUEsVUFBQSxXQUFBLFdBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSxlQUFBO1lBQ0EsT0FBQTtZQUNBLFVBQUE7O1dBRUEsS0FBQTs7YUFFQTs7Ozs7TUFLQSxZQUFBLGlCQUFBLFNBQUEsT0FBQSxXQUFBLFVBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSxlQUFBO1lBQ0EsT0FBQTs7V0FFQSxLQUFBOzthQUVBOzs7Ozs7O01BT0EsWUFBQSxTQUFBLFNBQUEsVUFBQTs7UUFFQSxRQUFBLFFBQUE7UUFDQSxPQUFBLEdBQUE7OztNQUdBLFlBQUEsV0FBQSxTQUFBLE9BQUEsVUFBQSxXQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUE7V0FDQSxLQUFBLGtCQUFBO1lBQ0EsT0FBQTtZQUNBLFVBQUE7WUFDQSxXQUFBOztXQUVBLEtBQUE7O2FBRUE7Ozs7O01BS0EsWUFBQSxTQUFBLFNBQUEsT0FBQSxXQUFBLFdBQUE7UUFDQSxPQUFBO1dBQ0EsSUFBQSxrQkFBQTtXQUNBLEtBQUE7Ozs7O2FBS0E7Ozs7Ozs7TUFPQSxZQUFBLDBCQUFBLFNBQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsdUJBQUE7WUFDQSxJQUFBLFFBQUE7Ozs7TUFJQSxZQUFBLGlCQUFBLFNBQUEsTUFBQTtRQUNBLE9BQUE7V0FDQSxLQUFBLGVBQUE7WUFDQSxPQUFBOzs7O01BSUEsWUFBQSxnQkFBQSxTQUFBLE9BQUEsTUFBQSxXQUFBLFVBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSx3QkFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLEtBQUEsV0FBQTs7O01BR0EsT0FBQTs7OztBQy9HQSxRQUFBLE9BQUEsT0FBQSxRQUFBLG9CQUFBO0lBQ0E7SUFDQSxTQUFBLE9BQUE7TUFDQSxJQUFBLGFBQUE7TUFDQSxJQUFBLE9BQUEsYUFBQTs7TUFFQSxPQUFBOzs7OztRQUtBLFFBQUEsU0FBQSxPQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsYUFBQSxXQUFBO2NBQ0EsT0FBQTs7Ozs7UUFLQSxRQUFBLFNBQUEsSUFBQSxPQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLFdBQUE7Y0FDQSxPQUFBOzs7OztRQUtBLFFBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7UUFHQSxLQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztRQUdBLFFBQUEsV0FBQTtZQUNBLE9BQUEsTUFBQSxJQUFBOzs7UUFHQSxXQUFBLFNBQUEsSUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQTs7Ozs7Ozs7QUN0Q0EsUUFBQSxPQUFBLE9BQUEsUUFBQSxvQkFBQTtJQUNBO0lBQ0EsU0FBQSxPQUFBO01BQ0EsSUFBQSxZQUFBO01BQ0EsSUFBQSxPQUFBLFlBQUE7O01BRUEsT0FBQTs7Ozs7UUFLQSxZQUFBLFNBQUEsVUFBQTtZQUNBLE9BQUEsTUFBQSxLQUFBLFlBQUEsZUFBQTtjQUNBLFVBQUE7Ozs7UUFJQSxRQUFBLFdBQUE7WUFDQSxPQUFBLE1BQUEsSUFBQTs7O1FBR0Esa0JBQUEsU0FBQSxTQUFBLFNBQUE7VUFDQSxPQUFBLE1BQUEsS0FBQSxZQUFBLGVBQUE7WUFDQSxVQUFBO1lBQ0EsVUFBQTs7Ozs7Ozs7QUN4QkEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxtQkFBQTtFQUNBO0VBQ0EsU0FBQSxNQUFBOztJQUVBLElBQUEsT0FBQTs7SUFFQSxPQUFBO01BQ0EsbUJBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOztNQUVBLHlCQUFBLFNBQUEsTUFBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxTQUFBO1VBQ0EsVUFBQTtVQUNBLFdBQUE7OztNQUdBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7OztNQUdBLGlCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsYUFBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOztNQUVBLHlCQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsYUFBQTtVQUNBLFFBQUE7OztNQUdBLG9CQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsWUFBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7Ozs7TUFJQSxrQkFBQSxTQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLGNBQUE7VUFDQSxZQUFBOzs7O01BSUEsd0JBQUEsU0FBQSxLQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxnQkFBQTtVQUNBLE1BQUE7OztNQUdBLG1CQUFBLFNBQUEsWUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsVUFBQTtVQUNBLGFBQUE7Ozs7Ozs7O0FDM0RBLFFBQUEsT0FBQSxPQUFBLFFBQUEsb0JBQUE7SUFDQTtJQUNBLFNBQUEsT0FBQTtNQUNBLElBQUEsTUFBQTtNQUNBLElBQUEsT0FBQSxNQUFBOzs7TUFHQSxPQUFBOzs7OztRQUtBLE9BQUEsU0FBQSxXQUFBLE1BQUEsUUFBQSxXQUFBLFdBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxNQUFBLFVBQUE7Z0JBQ0EsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFNBQUE7O2FBRUEsS0FBQTs7ZUFFQTs7Ozs7UUFLQSxRQUFBLFdBQUE7WUFDQSxPQUFBLE1BQUEsSUFBQTs7Ozs7OztBQzFCQSxRQUFBLE9BQUEsT0FBQSxRQUFBLGVBQUE7SUFDQTtJQUNBLFNBQUEsT0FBQTtNQUNBLElBQUEsUUFBQTtNQUNBLElBQUEsT0FBQSxRQUFBOztNQUVBLE9BQUE7Ozs7O1FBS0EsUUFBQSxTQUFBLFVBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxRQUFBLFdBQUE7Y0FDQSxVQUFBOzs7O1FBSUEsUUFBQSxXQUFBO1VBQ0EsT0FBQSxNQUFBLElBQUE7OztRQUdBLFFBQUEsU0FBQSxJQUFBLE9BQUE7VUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsV0FBQTtZQUNBLE9BQUE7Ozs7UUFJQSxNQUFBLFNBQUEsSUFBQSxTQUFBO1VBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTtXQUNBLEtBQUE7Ozs7Ozs7O1FBUUEsWUFBQSxTQUFBLElBQUEsT0FBQSxNQUFBO1VBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7UUFhQSxjQUFBLFNBQUEsSUFBQSxRQUFBLGFBQUE7VUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBO1dBQ0EsS0FBQTs7Ozs7Ozs7Ozs7OztRQWFBLGNBQUEsU0FBQSxJQUFBLE9BQUEsUUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7V0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFxQkEsUUFBQSxTQUFBLElBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztRQUdBLEtBQUEsU0FBQSxJQUFBO1VBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O1FBR0EsaUJBQUEsU0FBQSxJQUFBLFFBQUE7VUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsb0JBQUE7WUFDQSxRQUFBOzs7O1FBSUEsZ0JBQUEsU0FBQSxJQUFBLFFBQUE7VUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsbUJBQUE7WUFDQSxRQUFBOzs7O1FBSUEsa0JBQUEsU0FBQSxLQUFBLGVBQUE7VUFDQSxPQUFBLE1BQUEsS0FBQSxRQUFBLE1BQUEsRUFBQSxNQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxlQUFBLGdCQUFBLGdCQUFBOzs7Ozs7Ozs7OztBQ2xIQSxRQUFBLE9BQUEsT0FBQSxRQUFBLGVBQUE7RUFDQTtFQUNBO0VBQ0EsU0FBQSxPQUFBLFNBQUE7SUFDQSxJQUFBLFFBQUE7SUFDQSxJQUFBLE9BQUEsUUFBQTs7SUFFQSxPQUFBOzs7O01BSUEsZ0JBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsUUFBQTs7O01BR0EsS0FBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOzs7TUFHQSxRQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQTs7O01BR0EsU0FBQSxTQUFBLE1BQUEsTUFBQSxLQUFBLGNBQUEsa0JBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxRQUFBLE1BQUEsRUFBQSxNQUFBO2NBQ0EsTUFBQTtjQUNBLE1BQUEsT0FBQSxPQUFBO2NBQ0EsTUFBQSxPQUFBLE9BQUE7Y0FDQSxlQUFBLGdCQUFBLGdCQUFBO2NBQ0Esa0JBQUEsbUJBQUEsbUJBQUE7Ozs7OztNQU1BLGVBQUEsU0FBQSxJQUFBLFNBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUEsWUFBQTtVQUNBLFNBQUE7Ozs7TUFJQSxvQkFBQSxTQUFBLElBQUEsY0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxZQUFBO1VBQ0EsY0FBQTs7OztNQUlBLFdBQUEsU0FBQSxJQUFBLE1BQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUEsY0FBQTtVQUNBLE1BQUE7Ozs7TUFJQSxrQkFBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7Ozs7Ozs7TUFPQSxVQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOzs7TUFHQSxjQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOzs7TUFHQSxXQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7TUFFQSxZQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7TUFFQSxnQkFBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGdCQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsZUFBQSxTQUFBLEtBQUEsT0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxpQkFBQSxLQUFBLFVBQUE7OztNQUdBLFNBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxVQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsWUFBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLFdBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxhQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsWUFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQTs7O01BR0EsbUJBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLHVCQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOzs7TUFHQSxnQkFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQTs7O01BR0EsdUJBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLFFBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxrQkFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQTs7O01BR0Esa0JBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUE7OztNQUdBLHNCQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSxpQkFBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLHdCQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsa0JBQUEsRUFBQSxPQUFBOzs7Ozs7Ozs7QUNwSkEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxxQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLE9BQUEsV0FBQSxpQkFBQTtNQUNBLE9BQUEsb0JBQUEsVUFBQTs7TUFFQSxpQkFBQSxVQUFBLFVBQUEsS0FBQSxLQUFBLEtBQUE7Ozs7TUFJQSxPQUFBLGlCQUFBLFlBQUEsRUFBQSxPQUFBLGVBQUEsQ0FBQSxPQUFBOzs7TUFHQSxPQUFBLGtCQUFBLFVBQUE7UUFDQTtXQUNBLE9BQUEsT0FBQSxrQkFBQSxLQUFBLE9BQUE7V0FDQSxLQUFBOzs7YUFHQTs7Ozs7OztBQ3RCQSxRQUFBLE9BQUEsT0FBQSxXQUFBLHVCQUFBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxTQUFBLFFBQUEsUUFBQSxjQUFBLGtCQUFBOztJQUVBLE9BQUEsYUFBQTs7Ozs7O0lBTUEsRUFBQSxjQUFBOzs7SUFHQSxTQUFBLGNBQUE7TUFDQSxpQkFBQSxTQUFBLEtBQUE7Ozs7O0lBS0E7O0lBRUEsT0FBQSxjQUFBLFNBQUEsUUFBQSxXQUFBOztNQUVBLE9BQUE7TUFDQSxPQUFBLEdBQUEsdUJBQUE7UUFDQSxJQUFBLFVBQUE7Ozs7SUFJQSxPQUFBLGtCQUFBLFdBQUE7O01BRUEsS0FBQSw4QkFBQTtRQUNBLFNBQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxTQUFBLE9BQUEsS0FBQSxTQUFBLE9BQUEsS0FBQSxDQUFBLE1BQUEsYUFBQSxPQUFBLEtBQUEsU0FBQTtRQUNBLFNBQUEsQ0FBQSxTQUFBLFNBQUEsWUFBQSxDQUFBLGFBQUEsb0NBQUEsTUFBQTs7T0FFQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBd0NBLE9BQUEsa0JBQUEsU0FBQSxRQUFBLFdBQUEsT0FBQTtNQUNBLE9BQUE7TUFDQSxLQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsUUFBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7UUFHQSxZQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUEsNkJBQUEsVUFBQSxRQUFBO1FBQ0EsT0FBQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25HQSxRQUFBLE9BQUEsT0FBQSxXQUFBLGlCQUFBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxTQUFBLFFBQUEsUUFBQSxjQUFBLGFBQUE7SUFDQSxPQUFBLFFBQUE7SUFDQSxPQUFBLFFBQUE7Ozs7OztJQU1BLEVBQUEsY0FBQTs7Ozs7SUFLQSxZQUFBLFFBQUEsYUFBQSxNQUFBLGFBQUEsTUFBQSxhQUFBLE9BQUEsT0FBQTtLQUNBLEtBQUE7Ozs7SUFJQSxPQUFBLFlBQUEsV0FBQTtNQUNBLElBQUEsZ0JBQUEsT0FBQSxNQUFBO1FBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLGtCQUFBO1FBQ0EsZ0JBQUEsY0FBQTtVQUNBOzs7TUFHQSxJQUFBLE9BQUEsY0FBQSxVQUFBO1FBQ0EsZ0JBQUEsY0FBQTtVQUNBOzs7TUFHQSxJQUFBLE9BQUEsY0FBQSxXQUFBO1FBQ0EsZ0JBQUEsY0FBQTtVQUNBOzs7TUFHQSxJQUFBLE9BQUEsY0FBQSxVQUFBO1FBQ0EsZ0JBQUEsY0FBQTtVQUNBOzs7TUFHQSxJQUFBLE9BQUEsY0FBQSxXQUFBO1FBQ0EsZ0JBQUEsY0FBQTtVQUNBOzs7TUFHQSxJQUFBLFVBQUEsRUFBQSxNQUFBLEtBQUE7O01BRUEsS0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOzs7UUFHQSxNQUFBO1FBQ0EsU0FBQSxDQUFBLFVBQUE7UUFDQSxZQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQy9EQSxRQUFBLE9BQUEsT0FBQSxXQUFBLHNCQUFBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxTQUFBLFFBQUEsUUFBQSxjQUFBLGtCQUFBOzs7Ozs7SUFNQSxFQUFBLGNBQUE7Ozs7OztJQU1BLE9BQUEsY0FBQSxVQUFBOztNQUVBLElBQUEsT0FBQSxRQUFBLE9BQUEsTUFBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxTQUFBLENBQUEsVUFBQTtVQUNBLFlBQUE7V0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7V0FlQTtRQUNBLEtBQUEsVUFBQSw0QkFBQTs7Ozs7Ozs7O0FDMUNBLFFBQUEsT0FBQTtHQUNBLFdBQUEscUJBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsTUFBQSxnQkFBQTs7TUFFQSxPQUFBLFdBQUE7TUFDQTtTQUNBO1NBQ0EsS0FBQTs7OztNQUlBLFNBQUEsZUFBQSxTQUFBO1FBQ0EsT0FBQSxVQUFBOztRQUVBLFNBQUEsV0FBQSxJQUFBLEtBQUEsU0FBQTtRQUNBLFNBQUEsWUFBQSxJQUFBLEtBQUEsU0FBQTtRQUNBLFNBQUEsY0FBQSxJQUFBLEtBQUEsU0FBQTtRQUNBLFNBQUEsWUFBQSxJQUFBLEtBQUEsU0FBQTs7UUFFQSxPQUFBLFdBQUE7Ozs7O01BS0EsT0FBQSxvQkFBQSxZQUFBO1FBQ0E7V0FDQSxrQkFBQSxPQUFBLFNBQUE7V0FDQSxLQUFBOzs7Ozs7Ozs7OztNQVdBO1NBQ0E7U0FDQSxLQUFBOzs7O1FBSUEsT0FBQSxrQkFBQSxVQUFBO1VBQ0E7YUFDQSx3QkFBQSxPQUFBLFVBQUEsUUFBQSxNQUFBLElBQUEsTUFBQTthQUNBLEtBQUE7Ozs7Ozs7O01BUUEsT0FBQSxhQUFBLFNBQUEsS0FBQTtRQUNBLElBQUEsQ0FBQSxLQUFBO1VBQ0EsT0FBQTs7OztRQUlBLE9BQUEsT0FBQSxNQUFBLE9BQUE7VUFDQSxNQUFBLEtBQUEsZUFBQSxNQUFBLEtBQUE7Ozs7TUFJQSxTQUFBLFVBQUEsS0FBQTtRQUNBLE9BQUEsSUFBQTtVQUNBLEtBQUE7VUFDQSxLQUFBO1VBQ0EsS0FBQTtVQUNBLEtBQUE7VUFDQSxLQUFBOzs7O01BSUEsT0FBQSwwQkFBQSxVQUFBOztRQUVBLElBQUEsT0FBQSxVQUFBLE9BQUEsU0FBQSxVQUFBO1FBQ0EsSUFBQSxRQUFBLFVBQUEsT0FBQSxTQUFBLFdBQUE7O1FBRUEsSUFBQSxPQUFBLEtBQUEsUUFBQSxLQUFBLFNBQUEsYUFBQSxVQUFBLFVBQUE7VUFDQSxPQUFBLEtBQUEsV0FBQSxrQ0FBQTs7UUFFQSxJQUFBLFFBQUEsTUFBQTtVQUNBLEtBQUEsV0FBQSw2Q0FBQTtVQUNBOzs7UUFHQTtXQUNBLHdCQUFBLE1BQUE7V0FDQSxLQUFBOzs7Ozs7OztNQVFBLE9BQUEseUJBQUEsVUFBQTtRQUNBLElBQUEsWUFBQSxVQUFBLE9BQUEsU0FBQSxhQUFBOztRQUVBO1dBQ0EsdUJBQUE7V0FDQSxLQUFBOzs7Ozs7OztNQVFBLE9BQUEsa0JBQUEsVUFBQTtRQUNBLElBQUEsVUFBQSxVQUFBLE9BQUEsU0FBQSxXQUFBOztRQUVBO1dBQ0EsZ0JBQUE7V0FDQSxLQUFBOzs7Ozs7Ozs7TUFTQSxJQUFBLFlBQUEsSUFBQSxTQUFBOztNQUVBLE9BQUEsa0JBQUEsU0FBQSxLQUFBO1FBQ0EsT0FBQSxLQUFBLFlBQUEsVUFBQSxTQUFBOzs7TUFHQSxPQUFBLHFCQUFBLFVBQUE7UUFDQSxJQUFBLE9BQUEsT0FBQSxTQUFBO1FBQ0E7V0FDQSxtQkFBQTtXQUNBLEtBQUE7Ozs7OztNQU1BLE9BQUEsbUJBQUEsVUFBQTtRQUNBLElBQUEsYUFBQSxPQUFBLFNBQUE7UUFDQTtXQUNBLGlCQUFBO1dBQ0EsS0FBQTs7Ozs7OztNQU9BLE9BQUEsdUJBQUEsVUFBQTtRQUNBLElBQUEsT0FBQSxPQUFBLFNBQUE7UUFDQTtXQUNBLHFCQUFBO1dBQ0EsS0FBQTs7Ozs7O01BTUEsT0FBQSx5QkFBQSxVQUFBO1FBQ0EsSUFBQSxPQUFBLE9BQUEsU0FBQTtRQUNBO1dBQ0EsdUJBQUE7V0FDQSxLQUFBOzs7Ozs7OztBQzFLQSxRQUFBLE9BQUEsUUFBQSxPQUFBLENBQUEsbUJBQUEsVUFBQSxpQkFBQTs7RUFFQSxnQkFBQSxXQUFBO0lBQ0EsYUFBQSxDQUFBLFdBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQSxXQUFBO0lBQ0EsWUFBQTs7O0NBR0EsV0FBQSxpQkFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsWUFBQTs7TUFFQTtTQUNBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BK0dBO1NBQ0E7U0FDQSxLQUFBOzs7OztNQUtBLE9BQUEsVUFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLE9BQUEsTUFBQTs7OztNQUlBLE1BQUEsU0FBQSxPQUFBLFNBQUE7UUFDQTtVQUNBLGlCQUFBO1VBQ0Esc0JBQUE7VUFDQSwyQkFBQTtVQUNBLGFBQUE7VUFDQSxrQkFBQTtVQUNBLHVCQUFBOzs7OztNQUtBLE9BQUEsbUJBQUEsVUFBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxrQkFBQTtVQUNBLG9CQUFBO1VBQ0EsbUJBQUE7VUFDQSxnQkFBQTthQUNBLFVBQUE7WUFDQTtlQUNBO2VBQ0EsS0FBQSxVQUFBO2dCQUNBLFdBQUE7Ozs7O01BS0EsT0FBQSxtQkFBQSxVQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLGtCQUFBO1VBQ0Esb0JBQUE7VUFDQSxtQkFBQTtVQUNBLGdCQUFBO2FBQ0EsVUFBQTtZQUNBO2VBQ0E7ZUFDQSxLQUFBLFVBQUE7Z0JBQ0EsV0FBQTs7Ozs7TUFLQSxPQUFBLHVCQUFBLFVBQUE7UUFDQTtXQUNBO1dBQ0EsUUFBQSxTQUFBLE9BQUE7WUFDQSxLQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxNQUFBO2NBQ0Esa0JBQUE7Y0FDQSxvQkFBQTtjQUNBLG1CQUFBO2NBQ0EsZ0JBQUE7aUJBQ0EsVUFBQTs7Z0JBRUE7bUJBQ0E7bUJBQ0EsS0FBQSxVQUFBO29CQUNBLFdBQUE7Ozs7OztNQU1BLE9BQUEsYUFBQSxXQUFBO1FBQ0E7V0FDQTtXQUNBLFFBQUEsU0FBQSxPQUFBO1lBQ0EsS0FBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsTUFBQTtjQUNBLGtCQUFBO2NBQ0Esb0JBQUE7Y0FDQSxtQkFBQTtjQUNBLGdCQUFBO2lCQUNBLFVBQUE7O2dCQUVBO21CQUNBO21CQUNBLEtBQUEsVUFBQTtvQkFDQSxXQUFBOzs7Ozs7TUFNQSxPQUFBLGlCQUFBLFdBQUE7UUFDQTtXQUNBO1dBQ0EsUUFBQSxTQUFBLE9BQUE7WUFDQSxLQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxNQUFBO2NBQ0Esa0JBQUE7Y0FDQSxvQkFBQTtjQUNBLG1CQUFBO2NBQ0EsZ0JBQUE7aUJBQ0EsVUFBQTs7Z0JBRUE7bUJBQ0E7bUJBQ0EsS0FBQSxVQUFBO29CQUNBLFdBQUE7Ozs7Ozs7Ozs7Ozs7QUN0UEEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxpQkFBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFVBQUEsUUFBQSxRQUFBLFVBQUEsYUFBQSxVQUFBLE9BQUEsYUFBQSxhQUFBLE1BQUE7O0lBRUEsSUFBQSxXQUFBLFNBQUE7O0lBRUEsT0FBQSxZQUFBLE1BQUEsVUFBQTs7SUFFQSxPQUFBLE9BQUEsWUFBQTs7SUFFQSxTQUFBLGFBQUEsT0FBQSxRQUFBO01BQ0EsSUFBQSxPQUFBO01BQ0EsTUFBQSxRQUFBOzs7OztNQUtBLE9BQUE7OztJQUdBLFNBQUEsYUFBQSxVQUFBO01BQ0EsWUFBQSxJQUFBLFVBQUEsS0FBQTs7Ozs7TUFLQSxRQUFBLElBQUE7TUFDQSxFQUFBLG9CQUFBLE1BQUE7OztJQUdBLFNBQUEsaUJBQUEsTUFBQTtNQUNBLE9BQUE7UUFDQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7Ozs7Ozs7SUFPQSxTQUFBLFdBQUEsTUFBQTtNQUNBLElBQUEsTUFBQTtRQUNBLE9BQUEsT0FBQSxNQUFBLE9BQUE7Ozs7SUFJQSxPQUFBLGVBQUE7OztJQUdBLE9BQUEsV0FBQSxVQUFBLE1BQUE7TUFDQSxJQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsUUFBQTs7O01BR0EsT0FBQTs7O0lBR0EsWUFBQSxTQUFBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW9DQSxPQUFBLGFBQUEsWUFBQTs7TUFFQSxXQUFBO1FBQ0EsYUFBQSxPQUFBO1FBQ0EsU0FBQSxDQUFBLEVBQUEsSUFBQSxZQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsS0FBQSxRQUFBLE1BQUEsT0FBQSxPQUFBO1FBQ0EsUUFBQSxFQUFBLE1BQUEsT0FBQSxXQUFBLFFBQUEsT0FBQSxhQUFBLFVBQUEsT0FBQSxlQUFBLE1BQUEsT0FBQTtRQUNBLFdBQUE7O01BRUEsUUFBQSxJQUFBO01BQ0EsUUFBQSxJQUFBLE9BQUE7O01BRUEsWUFBQSxPQUFBO01BQ0EsT0FBQTs7OztJQUlBLE9BQUEsaUJBQUEsWUFBQTtNQUNBLE9BQUEsa0JBQUE7TUFDQSxPQUFBLFlBQUE7TUFDQSxPQUFBLGNBQUE7TUFDQSxPQUFBLGdCQUFBO01BQ0EsT0FBQSxZQUFBO01BQ0EsT0FBQSxxQkFBQTs7OztJQUlBLE9BQUEsZUFBQSxVQUFBO01BQ0EsT0FBQSxtQkFBQTs7OztJQUlBLE9BQUEsZUFBQSxZQUFBOztNQUVBLFNBQUEsT0FBQTtNQUNBLGVBQUEsT0FBQTs7TUFFQSxTQUFBLENBQUEsR0FBQSxZQUFBLEtBQUEsS0FBQSxLQUFBLFlBQUEsS0FBQSxRQUFBLE1BQUEsTUFBQTtNQUNBLFlBQUEsS0FBQSxPQUFBO01BQ0E7UUFDQTtRQUNBO1FBQ0E7O01BRUEsT0FBQTs7OztJQUlBLE9BQUEsV0FBQSxVQUFBLE1BQUE7O01BRUEsSUFBQTtNQUNBLE1BQUEsU0FBQSxTQUFBLGNBQUE7TUFDQSxPQUFBLFlBQUE7OztNQUdBLElBQUEsU0FBQSxTQUFBLGNBQUE7TUFDQSxPQUFBLFdBQUE7TUFDQSxPQUFBLFlBQUE7TUFDQSxPQUFBLFFBQUE7TUFDQSxPQUFBLFlBQUE7OztNQUdBLElBQUEsS0FBQSxPQUFBLE1BQUE7UUFDQSxTQUFBLFNBQUEsY0FBQTtRQUNBLE9BQUEsWUFBQTtRQUNBLE9BQUEsUUFBQTtRQUNBLE9BQUEsWUFBQTs7TUFFQSxJQUFBLEtBQUEsT0FBQSxRQUFBO1FBQ0EsU0FBQSxTQUFBLGNBQUE7UUFDQSxPQUFBLFlBQUE7UUFDQSxPQUFBLFFBQUE7UUFDQSxPQUFBLFlBQUE7O01BRUEsSUFBQSxLQUFBLE9BQUEsVUFBQTtRQUNBLFNBQUEsU0FBQSxjQUFBO1FBQ0EsT0FBQSxZQUFBO1FBQ0EsT0FBQSxRQUFBO1FBQ0EsT0FBQSxZQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLE1BQUE7UUFDQSxTQUFBLFNBQUEsY0FBQTtRQUNBLE9BQUEsWUFBQTtRQUNBLE9BQUEsUUFBQTtRQUNBLE9BQUEsWUFBQTs7O01BR0EsT0FBQSxXQUFBLFNBQUEsY0FBQSxHQUFBO1FBQ0EsUUFBQSxFQUFBLE9BQUE7OztNQUdBLEtBQUE7UUFDQSxPQUFBOztRQUVBLFNBQUE7VUFDQSxTQUFBOztTQUVBLEtBQUEsWUFBQTs7UUFFQSxVQUFBLEVBQUEsSUFBQSxZQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsS0FBQSxRQUFBLE1BQUEsT0FBQTtRQUNBLFlBQUEsS0FBQSxLQUFBLEtBQUE7UUFDQTtVQUNBO1VBQ0E7VUFDQTs7UUFFQSxPQUFBOzs7OztJQUtBLE9BQUEsZUFBQSxVQUFBLFFBQUEsUUFBQSxPQUFBOztNQUVBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQSw2QkFBQSxPQUFBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsU0FBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7U0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEyQkEsT0FBQSxlQUFBLFVBQUEsUUFBQSxRQUFBLE9BQUE7TUFDQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUEsNkJBQUEsT0FBQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7OztJQWdCQSxPQUFBLHVCQUFBLFVBQUEsUUFBQSxRQUFBLE9BQUE7TUFDQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUEsNkJBQUEsT0FBQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMkJBLE9BQUEsYUFBQSxVQUFBLE1BQUE7TUFDQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsU0FBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7U0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE4QkEsT0FBQSxZQUFBLFVBQUEsTUFBQTtNQUNBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxTQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztTQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBdUJBLE9BQUEsaUJBQUEsVUFBQSxNQUFBO01BQ0EsS0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBd0JBLE9BQUEsa0JBQUEsVUFBQSxRQUFBLFFBQUE7TUFDQSxJQUFBLFVBQUEsTUFBQTtRQUNBLE9BQUE7YUFDQSxFQUFBLE9BQUE7O01BRUEsS0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQkEsT0FBQSxpQkFBQSxVQUFBLFFBQUEsUUFBQTtNQUNBLElBQUEsVUFBQSxNQUFBO1FBQ0EsT0FBQTthQUNBLEVBQUEsT0FBQTs7TUFFQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsU0FBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7U0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7SUFlQSxPQUFBLE9BQUEsYUFBQSxVQUFBLFdBQUE7TUFDQSxZQUFBLGlCQUFBLFdBQUEsT0FBQSxlQUFBO1FBQ0E7Ozs7OztJQU1BLE9BQUEsb0JBQUEsWUFBQTtNQUNBLFlBQUEsaUJBQUEsT0FBQSxXQUFBLE9BQUEsZUFBQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNwa0JBLFFBQUEsT0FBQTtHQUNBLFdBQUEsZ0JBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxPQUFBLE1BQUEsWUFBQTtNQUNBLE9BQUEsZUFBQSxLQUFBOzs7TUFHQTs7TUFFQSxTQUFBLGlCQUFBOztRQUVBO1dBQ0EsSUFBQTtXQUNBLEtBQUEsU0FBQSxJQUFBO1lBQ0EsSUFBQSxVQUFBLElBQUE7WUFDQSxJQUFBLFFBQUEsT0FBQSxhQUFBLE1BQUEsTUFBQSxLQUFBOztZQUVBLElBQUEsUUFBQSxPQUFBO2NBQ0EsT0FBQSxhQUFBLFFBQUEsU0FBQSxRQUFBLE9BQUE7Y0FDQSxPQUFBLG1CQUFBOzs7Ozs7O01BT0EsT0FBQSxnQkFBQSxVQUFBO1FBQ0E7V0FDQSxjQUFBLE9BQUEsYUFBQSxLQUFBLE9BQUEsYUFBQTtXQUNBLEtBQUE7OzthQUdBOzs7Ozs7TUFNQSxPQUFBLHFCQUFBLFVBQUE7UUFDQTtXQUNBLG1CQUFBLE9BQUEsYUFBQSxLQUFBLE9BQUEsYUFBQTtXQUNBLEtBQUE7OzthQUdBOzs7Ozs7TUFNQSxPQUFBLGdCQUFBLFVBQUE7O1FBRUE7V0FDQSxVQUFBLE9BQUEsYUFBQSxLQUFBLE9BQUE7V0FDQSxLQUFBOzs7YUFHQTs7Ozs7Ozs7Ozs7QUM1REEsUUFBQSxPQUFBLE9BQUEsV0FBQSxrQkFBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxTQUFBLFFBQUEsUUFBQSxjQUFBLGFBQUEsYUFBQTtJQUNBLE9BQUEsUUFBQTtJQUNBLE9BQUEsUUFBQTs7Ozs7O0lBTUEsRUFBQSxjQUFBOztJQUVBLE9BQUEsZUFBQTtJQUNBLE9BQUEsYUFBQSxXQUFBLGlCQUFBO01BQ0EsUUFBQTtNQUNBLGNBQUE7UUFDQSxxQkFBQTs7TUFFQSxTQUFBOzs7SUFHQSxTQUFBLFdBQUEsTUFBQTtNQUNBLE9BQUEsUUFBQSxLQUFBO01BQ0EsT0FBQSxjQUFBLEtBQUE7TUFDQSxPQUFBLFdBQUEsS0FBQTs7TUFFQSxJQUFBLElBQUE7TUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxZQUFBLEtBQUE7UUFDQSxFQUFBLEtBQUE7O01BRUEsT0FBQSxRQUFBOzs7SUFHQSxZQUFBLFFBQUEsYUFBQSxNQUFBLGFBQUEsTUFBQSxhQUFBLE9BQUEsT0FBQTtLQUNBLEtBQUE7Ozs7O0lBS0EsT0FBQSxPQUFBLGFBQUEsU0FBQSxXQUFBO01BQ0EsWUFBQSxRQUFBLGFBQUEsTUFBQSxhQUFBLE1BQUEsV0FBQSxPQUFBLGVBQUE7UUFDQTs7Ozs7OztJQU9BLE9BQUEsb0JBQUEsWUFBQTtNQUNBO1NBQ0EsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLE9BQUEsV0FBQSxPQUFBLGNBQUEsT0FBQSxrQkFBQTtVQUNBOzs7Ozs7SUFNQSxPQUFBLFdBQUEsU0FBQSxNQUFBO01BQ0EsT0FBQSxHQUFBLG1CQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUEsYUFBQSxRQUFBOzs7O0lBSUEsT0FBQSxTQUFBLFNBQUEsUUFBQSxNQUFBO01BQ0EsT0FBQTs7TUFFQSxPQUFBLEdBQUEsa0JBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7O0lBS0EsT0FBQSxhQUFBLFNBQUEsUUFBQSxNQUFBLE9BQUE7TUFDQSxPQUFBO01BQ0EsS0FBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFFBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1FBR0EsWUFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBLDZCQUFBLEtBQUEsUUFBQSxPQUFBO1FBQ0EsT0FBQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTZDQSxPQUFBLGNBQUEsU0FBQSxRQUFBLE1BQUEsT0FBQTtNQUNBLE9BQUE7TUFDQSxLQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsUUFBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7UUFHQSxZQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUEsNkJBQUEsS0FBQSxRQUFBLE9BQUE7UUFDQSxPQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUErQ0EsT0FBQSxhQUFBLFNBQUEsUUFBQSxNQUFBLE9BQUE7TUFDQSxPQUFBOzs7TUFHQSxLQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsUUFBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7UUFHQSxZQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUEsNkJBQUEsS0FBQSxRQUFBLE9BQUE7UUFDQSxPQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE0Q0EsT0FBQSx1QkFBQSxXQUFBO01BQ0EsTUFBQSxxQkFBQSxPQUFBLE1BQUE7UUFDQTs7O01BR0EsSUFBQSxVQUFBLEVBQUEsTUFBQSxLQUFBOztNQUVBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7O1FBR0EsTUFBQTtRQUNBLFNBQUEsQ0FBQSxVQUFBO1FBQ0EsWUFBQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFzQkEsT0FBQSxzQkFBQSxXQUFBO01BQ0EsTUFBQSxxQkFBQSxPQUFBLE1BQUE7UUFDQTs7O01BR0EsSUFBQSxVQUFBLEVBQUEsTUFBQSxLQUFBOztNQUVBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTs7O1FBR0EsTUFBQTtRQUNBLFNBQUEsQ0FBQSxVQUFBO1FBQ0EsWUFBQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXFCQSxPQUFBLGNBQUEsVUFBQTtNQUNBLElBQUEsVUFBQSxDQUFBLE1BQUEsVUFBQSxZQUFBO01BQ0EsSUFBQSxPQUFBO01BQ0EsWUFBQSxTQUFBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNENBLE9BQUEsY0FBQSxTQUFBLFFBQUEsTUFBQSxPQUFBO01BQ0EsT0FBQTs7TUFFQSxJQUFBLENBQUEsS0FBQSxPQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBLHdCQUFBLEtBQUEsUUFBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxNQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7YUFXQTtRQUNBLFlBQUEsWUFBQSxLQUFBLEtBQUEsS0FBQTs7Ozs7Ozs7SUFRQSxTQUFBLFdBQUEsTUFBQTtNQUNBLElBQUEsTUFBQTtRQUNBLE9BQUEsT0FBQSxNQUFBLE9BQUE7Ozs7SUFJQSxPQUFBLFdBQUEsU0FBQSxNQUFBO01BQ0EsSUFBQSxLQUFBLE9BQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFdBQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFlBQUEsQ0FBQSxLQUFBLE9BQUEsV0FBQTtRQUNBLE9BQUE7Ozs7SUFJQSxTQUFBLFdBQUEsTUFBQTtNQUNBLE9BQUEsZUFBQTtNQUNBLE9BQUEsYUFBQSxXQUFBLGlCQUFBO01BQ0EsRUFBQSxvQkFBQSxNQUFBOzs7SUFHQSxTQUFBLGlCQUFBLE1BQUE7TUFDQSxPQUFBO1FBQ0E7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBLE9BQUEsY0FBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGdCQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLEtBQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTtjQUNBLE1BQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7O1lBRUE7Y0FDQSxLQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7UUFJQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7Ozs7SUFPQSxTQUFBLFlBQUE7TUFDQSxLQUFBLFlBQUEsd0JBQUE7TUFDQSxPQUFBOzs7SUFHQSxTQUFBLFFBQUEsS0FBQTtNQUNBLEtBQUEsY0FBQSxLQUFBLFNBQUE7OztJQUdBLE9BQUEsZUFBQSxVQUFBOztNQUVBLEtBQUEsOEJBQUE7UUFDQSxTQUFBLENBQUEsUUFBQSxDQUFBLE1BQUEsU0FBQSxPQUFBLEtBQUEsU0FBQSxPQUFBLEtBQUEsQ0FBQSxNQUFBLFNBQUEsT0FBQSxLQUFBLFNBQUE7UUFDQSxTQUFBLENBQUEsU0FBQSxTQUFBLFlBQUEsQ0FBQSxhQUFBLG9CQUFBLE1BQUE7U0FDQSxLQUFBOzs7Ozs7OztJQVFBLE9BQUEsYUFBQTs7O0FDeGxCQSxRQUFBLE9BQUE7R0FDQSxRQUFBLFlBQUEsV0FBQTtHQUNBLFdBQUEsWUFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsV0FBQTs7TUFFQSxPQUFBLGFBQUE7Ozs7QUNQQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGFBQUE7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLFlBQUE7TUFDQSxPQUFBLFVBQUE7O0FDTEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxtQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFVBQUEsUUFBQSxZQUFBLFFBQUEsT0FBQSxhQUFBLFVBQUEsU0FBQSxhQUFBLGtCQUFBOzs7TUFHQSxPQUFBLE9BQUEsWUFBQTs7O01BR0EsT0FBQSxlQUFBLE9BQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxNQUFBLFNBQUEsS0FBQTs7O01BR0EsSUFBQSxPQUFBLGNBQUE7UUFDQSxPQUFBLEtBQUEsUUFBQSxRQUFBOzs7O01BSUE7TUFDQTs7TUFFQTtNQUNBOztNQUVBLE9BQUEsY0FBQSxLQUFBLFFBQUEsU0FBQSxLQUFBOztNQUVBLFNBQUEsa0JBQUE7UUFDQTtXQUNBLElBQUE7V0FDQSxLQUFBLFVBQUEsS0FBQTtZQUNBLElBQUEsVUFBQSxJQUFBO1lBQ0EsSUFBQSxRQUFBLE9BQUEsS0FBQSxNQUFBLE1BQUEsS0FBQTs7WUFFQSxJQUFBLFFBQUEsUUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBLFNBQUEsUUFBQSxPQUFBO2NBQ0EsT0FBQSxtQkFBQTs7OztRQUlBO1dBQ0EsSUFBQTtXQUNBLEtBQUEsVUFBQSxLQUFBO1lBQ0EsT0FBQSxVQUFBLElBQUEsS0FBQSxNQUFBO1lBQ0EsT0FBQSxRQUFBLEtBQUE7O1lBRUEsSUFBQSxVQUFBOztZQUVBLEtBQUEsSUFBQSxHQUFBLElBQUEsT0FBQSxRQUFBLFFBQUEsS0FBQTtjQUNBLE9BQUEsUUFBQSxLQUFBLE9BQUEsUUFBQSxHQUFBO2NBQ0EsUUFBQSxLQUFBLEVBQUEsT0FBQSxPQUFBLFFBQUE7OztZQUdBLEVBQUE7ZUFDQSxPQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxVQUFBLFVBQUEsUUFBQSxVQUFBO2tCQUNBLE9BQUEsS0FBQSxRQUFBLFNBQUEsT0FBQSxNQUFBOzs7Ozs7O01BT0EsU0FBQSxrQkFBQTtRQUNBO1dBQ0EsSUFBQTtXQUNBLEtBQUEsVUFBQSxLQUFBO1lBQ0EsT0FBQSxVQUFBLElBQUEsS0FBQSxNQUFBO1lBQ0EsT0FBQSxRQUFBLEtBQUE7O1lBRUEsSUFBQSxVQUFBOztZQUVBLEtBQUEsSUFBQSxHQUFBLElBQUEsT0FBQSxRQUFBLFFBQUEsS0FBQTtjQUNBLE9BQUEsUUFBQSxLQUFBLE9BQUEsUUFBQSxHQUFBO2NBQ0EsUUFBQSxLQUFBLEVBQUEsT0FBQSxPQUFBLFFBQUE7OztZQUdBLEVBQUE7ZUFDQSxPQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxVQUFBLFVBQUEsUUFBQSxVQUFBO2tCQUNBLE9BQUEsS0FBQSxRQUFBLFNBQUEsT0FBQSxNQUFBOzs7Ozs7O01BT0EsU0FBQSxnQkFBQTtRQUNBO1dBQ0EsSUFBQTtXQUNBLEtBQUEsVUFBQSxLQUFBO1lBQ0EsT0FBQSxRQUFBLElBQUEsS0FBQSxNQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUE7O1lBRUEsSUFBQSxVQUFBOztZQUVBLEtBQUEsSUFBQSxHQUFBLElBQUEsT0FBQSxNQUFBLFFBQUEsS0FBQTtjQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsTUFBQSxHQUFBO2NBQ0EsUUFBQSxLQUFBLEVBQUEsT0FBQSxPQUFBLE1BQUE7OztZQUdBLEVBQUE7ZUFDQSxPQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxVQUFBLFVBQUEsUUFBQSxVQUFBO2tCQUNBLE9BQUEsT0FBQSxPQUFBLE1BQUE7Ozs7UUFJQSxJQUFBLE9BQUEsS0FBQSxRQUFBLFVBQUEsV0FBQTtVQUNBLE9BQUEsYUFBQSxPQUFBLEtBQUEsUUFBQSxPQUFBLE1BQUEsS0FBQTtVQUNBLE9BQUEsT0FBQSxPQUFBLEtBQUEsUUFBQSxPQUFBLE1BQUEsS0FBQTs7Ozs7TUFLQSxTQUFBLGlCQUFBLE9BQUEsTUFBQTtRQUNBLE9BQUEsTUFBQSxPQUFBOzs7OztNQUtBLFNBQUEsc0JBQUE7UUFDQSxpQkFBQSxTQUFBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXdCQSxTQUFBLFlBQUEsR0FBQTs7O1FBR0EsSUFBQSxXQUFBO1FBQ0EsSUFBQSxZQUFBLEtBQUEsT0FBQSxrQkFBQSxFQUFBLFdBQUE7OztRQUdBLElBQUEsT0FBQSxjQUFBLEtBQUEsRUFBQSxPQUFBLEtBQUEsUUFBQSxTQUFBLE9BQUE7YUFDQSxFQUFBLE9BQUEsS0FBQSxRQUFBLFNBQUEsT0FBQSxhQUFBLE1BQUEsT0FBQTs7UUFFQTtXQUNBLGNBQUEsUUFBQSxhQUFBLE9BQUEsS0FBQTtXQUNBLEtBQUE7Ozs7O2FBS0E7Ozs7OztNQU1BLFNBQUEsVUFBQTtRQUNBLE9BQUEsQ0FBQSxPQUFBLEtBQUEsUUFBQTs7O01BR0EsU0FBQSxtQkFBQTtRQUNBLE9BQUEsU0FBQSxLQUFBOzs7TUFHQSxTQUFBLG1CQUFBOztRQUVBLElBQUEsYUFBQSxDQUFBLG9CQUFBO1VBQ0EsT0FBQTs7UUFFQSxPQUFBOzs7TUFHQSxTQUFBLGFBQUE7O1FBRUEsRUFBQSxHQUFBLEtBQUEsU0FBQSxNQUFBLGNBQUEsVUFBQSxPQUFBO1VBQ0EsT0FBQTs7OztRQUlBLEVBQUEsWUFBQSxLQUFBO1VBQ0EsSUFBQTtVQUNBLFFBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLFFBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxRQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsTUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLFFBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxtQkFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLE9BQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxPQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsYUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLE9BQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxVQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsVUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLFFBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxZQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsUUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7Ozs7Ozs7TUFRQSxPQUFBLGFBQUEsWUFBQTtRQUNBLElBQUEsRUFBQSxZQUFBLEtBQUEsYUFBQTs7VUFFQTtlQUNBO1VBQ0EsS0FBQSxVQUFBLG1DQUFBOzs7OztBQ2hXQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGtCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLFlBQUEsUUFBQSxPQUFBLGFBQUEsU0FBQSxrQkFBQSxhQUFBLGtCQUFBOzs7TUFHQSxpQkFBQSxTQUFBLEtBQUE7Ozs7OztNQU1BLGlCQUFBLFNBQUEsS0FBQTs7Ozs7O01BTUEsU0FBQSxVQUFBLFdBQUE7UUFDQSxLQUFBLFlBQUEseUNBQUEsVUFBQSxRQUFBLFlBQUE7UUFDQSxPQUFBOzs7O01BSUEsU0FBQSxRQUFBLEtBQUE7UUFDQSxLQUFBLGNBQUEsS0FBQSxTQUFBOzs7O01BSUEsT0FBQSxpQkFBQSxTQUFBLFVBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxRQUFBO1VBQ0EsaUJBQUEsTUFBQSxVQUFBLFlBQUEsT0FBQSxVQUFBO2FBQ0E7VUFDQSxpQkFBQSxNQUFBLFVBQUEsWUFBQSxPQUFBOzs7Ozs7TUFNQSxPQUFBLGdCQUFBLFNBQUEsV0FBQTs7UUFFQSxpQkFBQSxJQUFBLFVBQUEsS0FBQSxLQUFBOzs7Ozs7Ozs7O01BVUEsaUJBQUEsU0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUE4QkEsT0FBQSxXQUFBLFNBQUEsTUFBQTs7UUFFQSxJQUFBLEtBQUEsSUFBQSxZQUFBLEtBQUEsS0FBQTtVQUNBLE9BQUE7Ozs7Ozs7O0FDNUZBLFFBQUEsT0FBQTtDQUNBLFdBQUEsZUFBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBQSxRQUFBLFFBQUEsY0FBQSxZQUFBO0lBQ0EsRUFBQSxXQUFBLGFBQUEsU0FBQSxPQUFBOzs7VUFHQSxZQUFBLElBQUEsUUFBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQStDQSxTQUFBLE1BQUE7U0FDQSxTQUFBLFdBQUE7Ozs7SUFJQSxPQUFBLFFBQUE7SUFDQSxPQUFBLFFBQUE7SUFDQSxPQUFBLFNBQUE7SUFDQSxPQUFBLFVBQUE7O0lBRUEsT0FBQSxTQUFBLG1CQUFBLGFBQUE7SUFDQSxPQUFBLE9BQUEsT0FBQSxhQUFBLFNBQUE7O0lBRUEsU0FBQSxtQkFBQSxNQUFBO01BQ0EsSUFBQSxNQUFBO01BQ0EsSUFBQSxDQUFBLE1BQUEsT0FBQTtNQUNBLEtBQUEsTUFBQSxLQUFBLFFBQUEsU0FBQSxFQUFBLENBQUEsSUFBQSxHQUFBO01BQ0EsT0FBQSxDQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUE7OztJQUdBLFNBQUEsaUJBQUEsU0FBQTtNQUNBLElBQUEsTUFBQTtNQUNBLEtBQUEsSUFBQSxLQUFBLFNBQUEsQ0FBQSxHQUFBLE9BQUEsUUFBQSxNQUFBLFdBQUEsUUFBQSxJQUFBLE9BQUEsRUFBQTtNQUNBLE9BQUEsQ0FBQSxJQUFBLFNBQUEsR0FBQSxHQUFBLElBQUEsT0FBQSxFQUFBLElBQUEsT0FBQTs7Ozs7OztJQU9BLEVBQUEsY0FBQTs7SUFFQSxPQUFBLGVBQUE7SUFDQSxPQUFBLGFBQUEsV0FBQSxpQkFBQTtNQUNBLFFBQUE7TUFDQSxjQUFBO1FBQ0EscUJBQUE7O01BRUEsU0FBQTs7O0lBR0EsU0FBQSxXQUFBLE1BQUE7TUFDQSxPQUFBLFFBQUEsS0FBQTtNQUNBLE9BQUEsY0FBQSxLQUFBO01BQ0EsT0FBQSxXQUFBLEtBQUE7O01BRUEsSUFBQSxJQUFBO01BQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsWUFBQSxLQUFBO1FBQ0EsRUFBQSxLQUFBOztNQUVBLE9BQUEsUUFBQTs7O0lBR0EsWUFBQSxRQUFBLGFBQUEsTUFBQSxhQUFBLE1BQUEsYUFBQSxPQUFBLE9BQUE7S0FDQSxLQUFBOzs7OztJQUtBLE9BQUEsT0FBQSxhQUFBLFNBQUEsV0FBQTtNQUNBLFlBQUEsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLFdBQUEsT0FBQSxlQUFBO1FBQ0E7Ozs7Ozs7SUFPQSxPQUFBLG9CQUFBLFlBQUE7TUFDQTtTQUNBLFFBQUEsYUFBQSxNQUFBLGFBQUEsTUFBQSxPQUFBLFdBQUEsT0FBQSxlQUFBO1VBQ0E7Ozs7OztJQU1BLE9BQUEsV0FBQSxTQUFBLE1BQUE7TUFDQSxPQUFBLEdBQUEsbUJBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQSxhQUFBLFFBQUE7Ozs7SUFJQSxPQUFBLFVBQUEsU0FBQSxRQUFBLE1BQUEsT0FBQTtNQUNBLE9BQUE7O01BRUEsSUFBQSxDQUFBLEtBQUEsT0FBQSxXQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBLCtCQUFBLEtBQUEsUUFBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7O2FBZUE7UUFDQTtVQUNBO1VBQ0EsS0FBQSxRQUFBLE9BQUEsNkJBQUEsV0FBQSxLQUFBLE9BQUE7VUFDQTs7Ozs7SUFLQSxTQUFBLFdBQUEsTUFBQTtNQUNBLElBQUEsTUFBQTtRQUNBLE9BQUEsT0FBQSxNQUFBLE9BQUE7Ozs7SUFJQSxPQUFBLFdBQUEsU0FBQSxNQUFBO01BQ0EsSUFBQSxLQUFBLE9BQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFdBQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFlBQUEsQ0FBQSxLQUFBLE9BQUEsV0FBQTtRQUNBLE9BQUE7Ozs7SUFJQSxTQUFBLFdBQUEsTUFBQTtNQUNBLE9BQUEsZUFBQTtNQUNBLE9BQUEsYUFBQSxXQUFBLGlCQUFBO01BQ0EsRUFBQSxvQkFBQSxNQUFBOzs7SUFHQSxTQUFBLGlCQUFBLE1BQUE7TUFDQSxPQUFBO1FBQ0E7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBLE9BQUEsY0FBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGdCQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTtjQUNBLE1BQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7UUFJQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7OztJQU1BLE9BQUEsYUFBQTs7QUM1VEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxvQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxZQUFBLFFBQUEsYUFBQSxPQUFBLFlBQUE7OztNQUdBLElBQUEsT0FBQSxZQUFBO01BQ0EsT0FBQSxPQUFBOztNQUVBLE9BQUEsbUJBQUEsS0FBQSxRQUFBLEtBQUEsT0FBQTs7TUFFQSxPQUFBLGFBQUEsTUFBQTs7TUFFQTs7TUFFQSxPQUFBLFdBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxRQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUE7Ozs7O01BS0EsSUFBQSxzQkFBQTtRQUNBLGNBQUE7UUFDQSxTQUFBO1FBQ0EsU0FBQTtRQUNBLFVBQUE7UUFDQSxlQUFBOzs7TUFHQSxJQUFBLEtBQUEsYUFBQSxvQkFBQTtRQUNBLEtBQUEsYUFBQSxvQkFBQSxRQUFBLFNBQUEsWUFBQTtVQUNBLElBQUEsZUFBQSxvQkFBQTtZQUNBLG9CQUFBLGVBQUE7Ozs7O01BS0EsT0FBQSxzQkFBQTs7OztNQUlBLFNBQUEsWUFBQSxFQUFBO1FBQ0EsSUFBQSxlQUFBLE9BQUEsS0FBQTs7UUFFQSxJQUFBLE1BQUE7UUFDQSxPQUFBLEtBQUEsT0FBQSxxQkFBQSxRQUFBLFNBQUEsSUFBQTtVQUNBLElBQUEsT0FBQSxvQkFBQSxLQUFBO1lBQ0EsSUFBQSxLQUFBOzs7UUFHQSxhQUFBLHNCQUFBOztRQUVBO1dBQ0EsbUJBQUEsS0FBQSxLQUFBO1dBQ0EsS0FBQTs7OzthQUlBOzs7OztNQUtBLFNBQUEsWUFBQTs7UUFFQSxFQUFBLFlBQUEsS0FBQTtVQUNBLFFBQUE7WUFDQSxPQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsT0FBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLHdCQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsZ0JBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7Ozs7O01BUUEsT0FBQSxhQUFBLFVBQUE7UUFDQSxJQUFBLEVBQUEsWUFBQSxLQUFBLFlBQUE7VUFDQTtlQUNBO1VBQ0EsS0FBQSxVQUFBLG1DQUFBOzs7Ozs7QUNuSEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxpQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxZQUFBLFFBQUEsTUFBQSxhQUFBLFVBQUEsT0FBQSxhQUFBLGFBQUEsWUFBQSxVQUFBO01BQ0EsSUFBQSxXQUFBLFNBQUE7TUFDQSxJQUFBLE9BQUEsWUFBQTtNQUNBLE9BQUEsT0FBQTtNQUNBLE9BQUEsWUFBQSxNQUFBLFdBQUEsU0FBQTtNQUNBLE9BQUEsY0FBQSxNQUFBLFdBQUEsU0FBQTs7TUFFQSxPQUFBLFlBQUE7O01BRUEsS0FBQSxJQUFBLE9BQUEsT0FBQSxXQUFBO1FBQ0EsSUFBQSxPQUFBLFVBQUEsS0FBQSxTQUFBLG1CQUFBO1VBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxrQkFBQSxNQUFBLFdBQUEsU0FBQTs7UUFFQSxJQUFBLE9BQUEsVUFBQSxLQUFBLFNBQUEsdUJBQUE7VUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLHNCQUFBLE1BQUEsV0FBQSxLQUFBLE9BQUE7Ozs7O01BS0EsSUFBQSxZQUFBLE9BQUEsWUFBQSxNQUFBLFVBQUE7OztNQUdBLElBQUEsbUJBQUEsT0FBQSxtQkFBQSxNQUFBLFFBQUEsS0FBQSxPQUFBOztNQUVBLE9BQUEsWUFBQSxTQUFBLE9BQUE7UUFDQSxJQUFBLE9BQUEsT0FBQTtRQUNBLFFBQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBLEtBQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxhQUFBLEtBQUEsWUFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLGFBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQSxhQUFBLENBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQSxhQUFBLEtBQUEsT0FBQSxvQkFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLENBQUE7Y0FDQSxLQUFBLE9BQUE7Y0FDQSxDQUFBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUE7Y0FDQSxLQUFBLE9BQUE7Y0FDQSxDQUFBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsS0FBQSxPQUFBLFlBQUEsS0FBQSxPQUFBLGFBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxLQUFBLE9BQUE7O1FBRUEsT0FBQTs7O01BR0EsT0FBQSxlQUFBLENBQUEsYUFBQSxLQUFBLE9BQUEsb0JBQUEsQ0FBQSxLQUFBLE9BQUE7O01BRUEsT0FBQSxjQUFBLFVBQUE7UUFDQTtXQUNBO1dBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXlCQSxJQUFBLFlBQUEsSUFBQSxTQUFBO01BQ0EsT0FBQSxpQkFBQSxLQUFBLFlBQUEsVUFBQSxTQUFBLFNBQUE7TUFDQSxPQUFBLG1CQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsZUFBQSxLQUFBLFlBQUEsVUFBQSxTQUFBLFNBQUE7O01BRUEsT0FBQSxtQkFBQSxVQUFBOztNQUVBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxTQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBO1lBQ0EsV0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7O0FDekhBLFFBQUEsT0FBQTtHQUNBLFdBQUEsWUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFlBQUEsUUFBQSxPQUFBLFFBQUEsVUFBQSxPQUFBLGFBQUEsV0FBQTtNQUNBLE9BQUEsVUFBQTs7TUFFQSxPQUFBLGFBQUE7O01BRUEsSUFBQSxXQUFBLFNBQUE7TUFDQSxPQUFBLFlBQUEsTUFBQSxVQUFBOzs7O01BSUEsSUFBQSxXQUFBLFNBQUE7TUFDQSxPQUFBLFlBQUEsTUFBQSxVQUFBOzs7TUFHQSxPQUFBLGFBQUE7O01BRUEsU0FBQSxZQUFBO1FBQ0EsT0FBQSxHQUFBOzs7TUFHQSxTQUFBLFFBQUEsS0FBQTtRQUNBLE9BQUEsUUFBQSxLQUFBOzs7TUFHQSxTQUFBLFlBQUE7UUFDQSxPQUFBLFFBQUE7OztNQUdBLE9BQUEsUUFBQSxVQUFBO1FBQ0E7UUFDQSxZQUFBO1VBQ0EsT0FBQSxPQUFBLE9BQUEsVUFBQSxXQUFBOzs7TUFHQSxPQUFBLFdBQUEsVUFBQTtRQUNBO1FBQ0EsWUFBQTtVQUNBLE9BQUEsT0FBQSxPQUFBLFVBQUEsV0FBQTs7O01BR0EsT0FBQSxnQkFBQSxTQUFBLE9BQUE7UUFDQSxPQUFBLGFBQUE7OztNQUdBLE9BQUEsaUJBQUEsV0FBQTtRQUNBLElBQUEsUUFBQSxPQUFBO1FBQ0EsWUFBQSxlQUFBO1FBQ0EsS0FBQSxnQkFBQSwyQ0FBQTs7Ozs7O01BTUEsT0FBQSxVQUFBOzs7O0FDL0RBLFFBQUEsT0FBQTtHQUNBLFdBQUEsYUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLE9BQUEsUUFBQSxVQUFBLE9BQUEsYUFBQSxXQUFBOztNQUVBLE9BQUEsYUFBQTs7O01BR0EsSUFBQSxXQUFBLFNBQUE7TUFDQSxPQUFBLFlBQUEsTUFBQSxVQUFBOzs7TUFHQSxPQUFBLGFBQUE7O01BRUEsU0FBQSxZQUFBO1FBQ0EsT0FBQSxHQUFBOzs7TUFHQSxTQUFBLFFBQUEsS0FBQTtRQUNBLE9BQUEsUUFBQSxLQUFBOzs7TUFHQSxTQUFBLFlBQUE7UUFDQSxPQUFBLFFBQUE7OztNQUdBLE9BQUEsUUFBQSxVQUFBO1FBQ0E7UUFDQSxZQUFBO1VBQ0EsT0FBQSxPQUFBLE9BQUEsVUFBQSxXQUFBOzs7TUFHQSxPQUFBLFdBQUEsVUFBQTtRQUNBO1FBQ0EsWUFBQTtVQUNBLE9BQUEsT0FBQSxPQUFBLFVBQUEsV0FBQTs7O01BR0EsT0FBQSxnQkFBQSxTQUFBLE9BQUE7UUFDQSxPQUFBLGFBQUE7OztNQUdBLE9BQUEsaUJBQUEsV0FBQTtRQUNBLElBQUEsUUFBQSxPQUFBO1FBQ0EsWUFBQSxlQUFBO1FBQ0EsS0FBQSxnQkFBQSwyQ0FBQTs7Ozs7O0FDbkRBLFFBQUEsT0FBQTtHQUNBLFdBQUEsYUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLGNBQUEsUUFBQSxZQUFBO01BQ0EsSUFBQSxRQUFBLGFBQUE7O01BRUEsT0FBQSxVQUFBOztNQUVBLE9BQUEsaUJBQUEsVUFBQTtRQUNBLElBQUEsV0FBQSxPQUFBO1FBQ0EsSUFBQSxVQUFBLE9BQUE7O1FBRUEsSUFBQSxhQUFBLFFBQUE7VUFDQSxPQUFBLFFBQUE7VUFDQSxPQUFBLFVBQUE7VUFDQTs7O1FBR0EsWUFBQTtVQUNBO1VBQ0EsT0FBQTtVQUNBOzs7OztVQUtBOzs7Ozs7O0FDN0JBLFFBQUEsT0FBQTtHQUNBLFFBQUEsWUFBQSxXQUFBO0dBQ0EsV0FBQSxlQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFlBQUEsUUFBQSxpQkFBQSxPQUFBLGFBQUEsU0FBQSxXQUFBOztNQUVBLElBQUEsT0FBQSxXQUFBOztNQUVBLE9BQUEsYUFBQTs7TUFFQSxPQUFBLG1CQUFBLE1BQUEsUUFBQSxLQUFBLE9BQUE7OztNQUdBO09BQ0E7T0FDQSxLQUFBOzs7O01BSUEsT0FBQSxTQUFBLFVBQUE7UUFDQSxZQUFBOzs7TUFHQSxPQUFBLGNBQUE7TUFDQSxPQUFBLGdCQUFBLFVBQUE7UUFDQSxPQUFBLGNBQUEsQ0FBQSxPQUFBOzs7O01BSUEsRUFBQSxTQUFBLEdBQUEsU0FBQSxVQUFBO1FBQ0EsT0FBQSxjQUFBOzs7Ozs7O0FDbENBLFFBQUEsT0FBQTtHQUNBLFdBQUEsWUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFVBQUEsUUFBQSxRQUFBLFVBQUEsYUFBQSxVQUFBLE9BQUEsYUFBQSxhQUFBLE1BQUE7O01BRUEsSUFBQSxXQUFBLFNBQUE7O01BRUEsT0FBQSxZQUFBLE1BQUEsVUFBQTs7TUFFQSxPQUFBLE9BQUEsWUFBQTs7TUFFQSxTQUFBLGFBQUEsT0FBQSxRQUFBO1FBQ0EsSUFBQSxPQUFBO1FBQ0EsTUFBQSxRQUFBOzs7OztRQUtBLE9BQUE7OztNQUdBLFNBQUEsYUFBQSxVQUFBO1FBQ0EsWUFBQSxJQUFBLFVBQUEsS0FBQTs7Ozs7UUFLQSxRQUFBLElBQUE7UUFDQSxFQUFBLG9CQUFBLE1BQUE7OztNQUdBLFNBQUEsaUJBQUEsTUFBQTtRQUNBLE9BQUE7VUFDQTtZQUNBLE1BQUE7WUFDQSxRQUFBO2NBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTs7Y0FFQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBOztjQUVBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFFBQUE7O2NBRUE7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTs7Ozs7OztNQU9BLFNBQUEsV0FBQSxNQUFBO1FBQ0EsSUFBQSxNQUFBO1VBQ0EsT0FBQSxPQUFBLE1BQUEsT0FBQTs7OztNQUlBLE9BQUEsZUFBQTs7O01BR0EsT0FBQSxXQUFBLFVBQUEsTUFBQTtRQUNBLElBQUEsT0FBQTtRQUNBLEtBQUEsYUFBQSxRQUFBOzs7UUFHQSxPQUFBOzs7TUFHQSxZQUFBLFNBQUEsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BaUNBLE9BQUEsYUFBQSxZQUFBOztRQUVBLFdBQUE7VUFDQSxhQUFBLE9BQUE7VUFDQSxTQUFBLENBQUEsRUFBQSxJQUFBLFlBQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxLQUFBLFFBQUEsTUFBQSxPQUFBLE9BQUE7VUFDQSxRQUFBLEVBQUEsTUFBQSxPQUFBLFdBQUEsUUFBQSxPQUFBLGFBQUEsVUFBQSxPQUFBLGVBQUEsTUFBQSxPQUFBO1VBQ0EsV0FBQTs7UUFFQSxRQUFBLElBQUE7UUFDQSxRQUFBLElBQUEsT0FBQTs7UUFFQSxZQUFBLE9BQUE7UUFDQSxPQUFBOzs7O01BSUEsT0FBQSxpQkFBQSxZQUFBO1FBQ0EsT0FBQSxrQkFBQTtRQUNBLE9BQUEsWUFBQTtRQUNBLE9BQUEsY0FBQTtRQUNBLE9BQUEsZ0JBQUE7UUFDQSxPQUFBLFlBQUE7UUFDQSxPQUFBLHFCQUFBOzs7O01BSUEsT0FBQSxlQUFBLFVBQUE7UUFDQSxPQUFBLG1CQUFBOzs7O01BSUEsT0FBQSxlQUFBLFlBQUE7O1FBRUEsU0FBQSxPQUFBO1FBQ0EsZUFBQSxPQUFBOztRQUVBLFNBQUEsQ0FBQSxHQUFBLFlBQUEsS0FBQSxLQUFBLEtBQUEsWUFBQSxLQUFBLFFBQUEsTUFBQSxNQUFBO1FBQ0EsWUFBQSxLQUFBLE9BQUE7UUFDQTtVQUNBO1VBQ0E7VUFDQTs7UUFFQSxPQUFBOzs7O01BSUEsT0FBQSxXQUFBLFVBQUEsTUFBQTs7UUFFQSxJQUFBO1FBQ0EsTUFBQSxTQUFBLFNBQUEsY0FBQTtRQUNBLE9BQUEsWUFBQTs7O1FBR0EsSUFBQSxTQUFBLFNBQUEsY0FBQTtRQUNBLE9BQUEsV0FBQTtRQUNBLE9BQUEsWUFBQTtRQUNBLE9BQUEsUUFBQTtRQUNBLE9BQUEsWUFBQTs7O1FBR0EsSUFBQSxLQUFBLE9BQUEsTUFBQTtVQUNBLFNBQUEsU0FBQSxjQUFBO1VBQ0EsT0FBQSxZQUFBO1VBQ0EsT0FBQSxRQUFBO1VBQ0EsT0FBQSxZQUFBOztRQUVBLElBQUEsS0FBQSxPQUFBLFFBQUE7VUFDQSxTQUFBLFNBQUEsY0FBQTtVQUNBLE9BQUEsWUFBQTtVQUNBLE9BQUEsUUFBQTtVQUNBLE9BQUEsWUFBQTs7UUFFQSxJQUFBLEtBQUEsT0FBQSxVQUFBO1VBQ0EsU0FBQSxTQUFBLGNBQUE7VUFDQSxPQUFBLFlBQUE7VUFDQSxPQUFBLFFBQUE7VUFDQSxPQUFBLFlBQUE7O1FBRUEsSUFBQSxLQUFBLE9BQUEsTUFBQTtVQUNBLFNBQUEsU0FBQSxjQUFBO1VBQ0EsT0FBQSxZQUFBO1VBQ0EsT0FBQSxRQUFBO1VBQ0EsT0FBQSxZQUFBOzs7UUFHQSxPQUFBLFdBQUEsU0FBQSxjQUFBLEdBQUE7VUFDQSxRQUFBLEVBQUEsT0FBQTs7O1FBR0EsS0FBQTtVQUNBLE9BQUE7O1VBRUEsU0FBQTtZQUNBLFNBQUE7O1dBRUEsS0FBQSxZQUFBOztVQUVBLFVBQUEsRUFBQSxJQUFBLFlBQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxLQUFBLFFBQUEsTUFBQSxPQUFBO1VBQ0EsWUFBQSxLQUFBLEtBQUEsS0FBQTtVQUNBO1lBQ0E7WUFDQTtZQUNBOztVQUVBLE9BQUE7Ozs7O01BS0EsT0FBQSxlQUFBLFVBQUEsUUFBQSxRQUFBLE9BQUE7O1FBRUEsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBLDZCQUFBLE9BQUEsT0FBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQTJCQSxPQUFBLGVBQUEsVUFBQSxRQUFBLFFBQUEsT0FBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQSw2QkFBQSxPQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7O01BZ0JBLE9BQUEsdUJBQUEsVUFBQSxRQUFBLFFBQUEsT0FBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQSw2QkFBQSxPQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUEyQkEsT0FBQSxhQUFBLFVBQUEsTUFBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQThCQSxPQUFBLFlBQUEsVUFBQSxNQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUF1QkEsT0FBQSxpQkFBQSxVQUFBLE1BQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUF3QkEsT0FBQSxrQkFBQSxVQUFBLFFBQUEsUUFBQTtRQUNBLElBQUEsVUFBQSxNQUFBO1VBQ0EsT0FBQTtlQUNBLEVBQUEsT0FBQTs7UUFFQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztNQWlCQSxPQUFBLGlCQUFBLFVBQUEsUUFBQSxRQUFBO1FBQ0EsSUFBQSxVQUFBLE1BQUE7VUFDQSxPQUFBO2VBQ0EsRUFBQSxPQUFBOztRQUVBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7OztNQWVBLE9BQUEsT0FBQSxhQUFBLFVBQUEsV0FBQTtRQUNBLFlBQUEsaUJBQUEsV0FBQSxPQUFBLGVBQUE7VUFDQTs7Ozs7O01BTUEsT0FBQSxvQkFBQSxZQUFBO1FBQ0EsWUFBQSxpQkFBQSxPQUFBLFdBQUEsT0FBQSxlQUFBO1VBQ0E7Ozs7Ozs7Ozs7OztBQ2prQkEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxjQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLGNBQUEsWUFBQTtNQUNBLElBQUEsUUFBQSxhQUFBOztNQUVBLE9BQUEsVUFBQTs7TUFFQSxJQUFBLE9BQUE7UUFDQSxZQUFBLE9BQUE7VUFDQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFVBQUE7WUFDQSxPQUFBLFVBQUE7O1VBRUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxVQUFBOzs7O0FBSUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdyZWcnLCBbXHJcbiAgJ3VpLnJvdXRlcicsXHJcbiAgJ2NoYXJ0LmpzJyxcclxuXSk7XHJcblxyXG5hcHBcclxuICAuY29uZmlnKFtcclxuICAgICckaHR0cFByb3ZpZGVyJyxcclxuICAgIGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpe1xyXG5cclxuICAgICAgLy8gQWRkIGF1dGggdG9rZW4gdG8gQXV0aG9yaXphdGlvbiBoZWFkZXJcclxuICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnQXV0aEludGVyY2VwdG9yJyk7XHJcblxyXG4gICAgfV0pXHJcbiAgLnJ1bihbXHJcbiAgICAnQXV0aFNlcnZpY2UnLFxyXG4gICAgJ1Nlc3Npb24nLFxyXG4gICAgZnVuY3Rpb24oQXV0aFNlcnZpY2UsIFNlc3Npb24pe1xyXG5cclxuICAgICAgLy8gU3RhcnR1cCwgbG9naW4gaWYgdGhlcmUncyAgYSB0b2tlbi5cclxuICAgICAgdmFyIHRva2VuID0gU2Vzc2lvbi5nZXRUb2tlbigpO1xyXG4gICAgICBpZiAodG9rZW4pe1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luV2l0aFRva2VuKHRva2VuKTtcclxuICAgICAgfVxyXG5cclxuICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gICAgLmNvbnN0YW50KCdFVkVOVF9JTkZPJywge1xyXG4gICAgICAgIE5BTUU6ICdIYWNraXQgMjAyMCcsXHJcbiAgICB9KVxyXG4gICAgLmNvbnN0YW50KCdEQVNIQk9BUkQnLCB7XHJcbiAgICAgICAgVU5WRVJJRklFRDogJ1lvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhbiBlbWFpbCBhc2tpbmcgeW91IHZlcmlmeSB5b3VyIGVtYWlsLiBDbGljayB0aGUgbGluayBpbiB0aGUgZW1haWwgYW5kIHlvdSBjYW4gc3RhcnQgeW91ciBhcHBsaWNhdGlvbiEnLFxyXG4gICAgICAgIElOQ09NUExFVEVfVElUTEU6ICdZb3Ugc3RpbGwgbmVlZCB0byBjb21wbGV0ZSB5b3VyIGFwcGxpY2F0aW9uIScsXHJcbiAgICAgICAgSU5DT01QTEVURTogJ0lmIHlvdSBkbyBub3QgY29tcGxldGUgeW91ciBhcHBsaWNhdGlvbiBiZWZvcmUgdGhlIFtBUFBfREVBRExJTkVdLCB5b3Ugd2lsbCBub3QgYmUgY29uc2lkZXJlZCBmb3IgdGhlIGFkbWlzc2lvbnMgbG90dGVyeSEnLFxyXG4gICAgICAgIFNVQk1JVFRFRF9USVRMRTogJ1lvdXIgYXBwbGljYXRpb24gaGFzIGJlZW4gc3VibWl0dGVkIScsXHJcbiAgICAgICAgU1VCTUlUVEVEOiAnRmVlbCBmcmVlIHRvIGVkaXQgaXQgYXQgYW55IHRpbWUuIEhvd2V2ZXIsIG9uY2UgcmVnaXN0cmF0aW9uIGlzIGNsb3NlZCwgeW91IHdpbGwgbm90IGJlIGFibGUgdG8gZWRpdCBpdCBhbnkgZnVydGhlci5cXG5BZG1pc3Npb25zIHdpbGwgYmUgZGV0ZXJtaW5lZCBieSBhIHJhbmRvbSBsb3R0ZXJ5LiBQbGVhc2UgbWFrZSBzdXJlIHlvdXIgaW5mb3JtYXRpb24gaXMgYWNjdXJhdGUgYmVmb3JlIHJlZ2lzdHJhdGlvbiBpcyBjbG9zZWQhJyxcclxuICAgICAgICBDTE9TRURfQU5EX0lOQ09NUExFVEVfVElUTEU6ICdVbmZvcnR1bmF0ZWx5LCByZWdpc3RyYXRpb24gaGFzIGNsb3NlZCwgYW5kIHRoZSBsb3R0ZXJ5IHByb2Nlc3MgaGFzIGJlZ3VuLicsXHJcbiAgICAgICAgQ0xPU0VEX0FORF9JTkNPTVBMRVRFOiAnQmVjYXVzZSB5b3UgaGF2ZSBub3QgY29tcGxldGVkIHlvdXIgcHJvZmlsZSBpbiB0aW1lLCB5b3Ugd2lsbCBub3QgYmUgZWxpZ2libGUgZm9yIHRoZSBsb3R0ZXJ5IHByb2Nlc3MuJyxcclxuICAgICAgICBBRE1JVFRFRF9BTkRfQ0FOX0NPTkZJUk1fVElUTEU6ICdZb3UgbXVzdCBjb25maXJtIGJ5IFtDT05GSVJNX0RFQURMSU5FXS4nLFxyXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5OT1RfQ09ORklSTV9USVRMRTogJ1lvdXIgY29uZmlybWF0aW9uIGRlYWRsaW5lIG9mIFtDT05GSVJNX0RFQURMSU5FXSBoYXMgcGFzc2VkLicsXHJcbiAgICAgICAgQURNSVRURURfQU5EX0NBTk5PVF9DT05GSVJNOiAnQWx0aG91Z2ggeW91IHdlcmUgYWNjZXB0ZWQsIHlvdSBkaWQgbm90IGNvbXBsZXRlIHlvdXIgY29uZmlybWF0aW9uIGluIHRpbWUuXFxuVW5mb3J0dW5hdGVseSwgdGhpcyBtZWFucyB0aGF0IHlvdSB3aWxsIG5vdCBiZSBhYmxlIHRvIGF0dGVuZCB0aGUgZXZlbnQsIGFzIHdlIG11c3QgYmVnaW4gdG8gYWNjZXB0IG90aGVyIGFwcGxpY2FudHMgb24gdGhlIHdhaXRsaXN0LlxcbldlIGhvcGUgdG8gc2VlIHlvdSBhZ2FpbiBuZXh0IHllYXIhJyxcclxuICAgICAgICBDT05GSVJNRURfTk9UX1BBU1RfVElUTEU6ICdZb3UgY2FuIGVkaXQgeW91ciBjb25maXJtYXRpb24gaW5mb3JtYXRpb24gdW50aWwgW0NPTkZJUk1fREVBRExJTkVdJyxcclxuICAgICAgICBERUNMSU5FRDogJ1dlXFwncmUgc29ycnkgdG8gaGVhciB0aGF0IHlvdSB3b25cXCd0IGJlIGFibGUgdG8gbWFrZSBpdCB0byBIYWNraXQgMjAyMCEgOihcXG5NYXliZSBuZXh0IHllYXIhIFdlIGhvcGUgeW91IHNlZSB5b3UgYWdhaW4gc29vbi4nLFxyXG4gICAgfSlcclxuICAgIC5jb25zdGFudCgnVEVBTScse1xyXG4gICAgICAgIE5PX1RFQU1fUkVHX0NMT1NFRDogJ1VuZm9ydHVuYXRlbHksIGl0XFwncyB0b28gbGF0ZSB0byBlbnRlciB0aGUgbG90dGVyeSB3aXRoIGEgdGVhbS5cXG5Ib3dldmVyLCB5b3UgY2FuIHN0aWxsIGZvcm0gdGVhbXMgb24geW91ciBvd24gYmVmb3JlIG9yIGR1cmluZyB0aGUgZXZlbnQhJyxcclxuICAgIH0pO1xyXG4iLCJcclxuYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbmZpZyhbXHJcbiAgICAnJHN0YXRlUHJvdmlkZXInLFxyXG4gICAgJyR1cmxSb3V0ZXJQcm92aWRlcicsXHJcbiAgICAnJGxvY2F0aW9uUHJvdmlkZXInLFxyXG4gICAgZnVuY3Rpb24oXHJcbiAgICAgICRzdGF0ZVByb3ZpZGVyLFxyXG4gICAgICAkdXJsUm91dGVyUHJvdmlkZXIsXHJcbiAgICAgICRsb2NhdGlvblByb3ZpZGVyKSB7XHJcblxyXG4gICAgLy8gRm9yIGFueSB1bm1hdGNoZWQgdXJsLCByZWRpcmVjdCB0byAvc3RhdGUxXHJcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiLzQwNFwiKTtcclxuICAgIFxyXG4gICAgLy8gU2V0IHVwIGRlIHN0YXRlc1xyXG4gICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgLnN0YXRlKCdsb2dpbicsIHtcclxuICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvbG9naW4vbG9naW4uaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2UsXHJcbiAgICAgICAgICByZXF1aXJlTG9nb3V0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAnc2V0dGluZ3MnOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2hvbWUnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9cIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9sb2dpbi9sb2dpbi5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZSxcclxuICAgICAgICAgIHJlcXVpcmVMb2dvdXQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICdzZXR0aW5ncyc6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyAuc3RhdGUoJ2hvbWUnLCB7XHJcbiAgICAgIC8vICAgdXJsOiBcIi9cIixcclxuICAgICAgLy8gICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9ob21lL2hvbWUuaHRtbFwiLFxyXG4gICAgICAvLyAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsXHJcbiAgICAgIC8vICAgZGF0YToge1xyXG4gICAgICAvLyAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxyXG4gICAgICAvLyAgIH0sXHJcbiAgICAgIC8vICAgcmVzb2x2ZToge1xyXG4gICAgICAvLyAgICAgJ3NldHRpbmdzJzogZnVuY3Rpb24oU2V0dGluZ3NTZXJ2aWNlKXtcclxuICAgICAgLy8gICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xyXG4gICAgICAvLyAgICAgfVxyXG4gICAgICAvLyAgIH1cclxuICAgICAgLy8gfSlcclxuXHJcbiAgICAgIC5zdGF0ZSgnYXBwJywge1xyXG4gICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAnJzoge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9iYXNlLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJCYXNlQ3RybFwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICdzaWRlYmFyQGFwcCc6IHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3Mvc2lkZWJhci9zaWRlYmFyLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1NpZGViYXJDdHJsJyxcclxuICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVMb2dpbjogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuZGFzaGJvYXJkJywge1xyXG4gICAgICAgIHVybDogXCIvZGFzaGJvYXJkXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvZGFzaGJvYXJkL2Rhc2hib2FyZC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0Rhc2hib2FyZEN0cmwnLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbihVc2VyU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuYXBwbGljYXRpb24nLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hcHBsaWNhdGlvblwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQXBwbGljYXRpb25DdHJsJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlVmVyaWZpZWQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbihVc2VyU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5jb25maXJtYXRpb24nLCB7XHJcbiAgICAgICAgdXJsOiBcIi9jb25maXJtYXRpb25cIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb25maXJtYXRpb24vY29uZmlybWF0aW9uLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQ29uZmlybWF0aW9uQ3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZUFkbWl0dGVkOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24oVXNlclNlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmNoYWxsZW5nZXMnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9jaGFsbGVuZ2VzXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvY2hhbGxlbmdlcy9jaGFsbGVuZ2VzLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQ2hhbGxlbmdlc0N0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVWZXJpZmllZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLnRlYW0nLCB7XHJcbiAgICAgICAgdXJsOiBcIi90ZWFtXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdGVhbS90ZWFtLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnVGVhbUN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVWZXJpZmllZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluJywge1xyXG4gICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAnJzoge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9hZG1pbi5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbkN0cmwnXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlQWRtaW46IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmNoZWNraW4nLCB7XHJcbiAgICAgICAgdXJsOiAnL2NoZWNraW4nLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY2hlY2tpbi9jaGVja2luLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDaGVja2luQ3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZVZvbHVudGVlcjogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4uc3RhdHMnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pblwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL3N0YXRzL3N0YXRzLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5TdGF0c0N0cmwnXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLm1haWwnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pbi9tYWlsXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vbWFpbC9tYWlsLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5NYWlsQ3RybCdcclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4uY2hhbGxlbmdlcycsIHtcclxuICAgICAgICB1cmw6IFwiL2FkbWluL2NoYWxsZW5nZXNcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9jaGFsbGVuZ2VzL2NoYWxsZW5nZXMuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbkNoYWxsZW5nZXNDdHJsJ1xyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5jaGFsbGVuZ2UnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pbi9jaGFsbGVuZ2VzLzppZFwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL2NoYWxsZW5nZS9jaGFsbGVuZ2UuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbkNoYWxsZW5nZUN0cmwnLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICdjaGFsbGVuZ2UnOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIENoYWxsZW5nZVNlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gQ2hhbGxlbmdlU2VydmljZS5nZXQoJHN0YXRlUGFyYW1zLmlkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLm1hcmtldGluZycsIHtcclxuICAgICAgICB1cmw6IFwiL2FkbWluL21hcmtldGluZ1wiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL21hcmtldGluZy9tYXJrZXRpbmcuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbk1hcmtldGluZ0N0cmwnXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnVzZXJzJywge1xyXG4gICAgICAgIHVybDogXCIvYWRtaW4vdXNlcnM/XCIgK1xyXG4gICAgICAgICAgJyZwYWdlJyArXHJcbiAgICAgICAgICAnJnNpemUnICtcclxuICAgICAgICAgICcmcXVlcnknLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL3VzZXJzL3VzZXJzLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Vc2Vyc0N0cmwnXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnVzZXInLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pbi91c2Vycy86aWRcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi91c2VyL3VzZXIuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblVzZXJDdHJsJyxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAndXNlcic6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgVXNlclNlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0KCRzdGF0ZVBhcmFtcy5pZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5zZXR0aW5ncycsIHtcclxuICAgICAgICB1cmw6IFwiL2FkbWluL3NldHRpbmdzXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vc2V0dGluZ3Mvc2V0dGluZ3MuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblNldHRpbmdzQ3RybCcsXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnRlYW1zJywge1xyXG4gICAgICAgIHVybDogXCIvYWRtaW4vdGVhbXNcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi90ZWFtcy90ZWFtcy5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0FkbWluVGVhbUN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVWZXJpZmllZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgncmVzZXQnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9yZXNldC86dG9rZW5cIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9yZXNldC9yZXNldC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1Jlc2V0Q3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCd2ZXJpZnknLCB7XHJcbiAgICAgICAgdXJsOiBcIi92ZXJpZnkvOnRva2VuXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdmVyaWZ5L3ZlcmlmeS5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1ZlcmlmeUN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnNDA0Jywge1xyXG4gICAgICAgIHVybDogXCIvNDA0XCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvNDA0Lmh0bWxcIixcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlTG9naW46IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe1xyXG4gICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gIH1dKVxyXG4gIC5ydW4oW1xyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnU2Vzc2lvbicsXHJcbiAgICBmdW5jdGlvbihcclxuICAgICAgJHJvb3RTY29wZSxcclxuICAgICAgJHN0YXRlLFxyXG4gICAgICBTZXNzaW9uICl7XHJcblxyXG4gICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgPSAwO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMpIHtcclxuXHJcbiAgICAgICAgdmFyIHJlcXVpcmVMb2dpbiA9IHRvU3RhdGUuZGF0YS5yZXF1aXJlTG9naW47XHJcbiAgICAgICAgdmFyIHJlcXVpcmVMb2dvdXQgPSB0b1N0YXRlLmRhdGEucmVxdWlyZUxvZ291dDtcclxuICAgICAgICB2YXIgcmVxdWlyZUFkbWluID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVBZG1pbjtcclxuICAgICAgICB2YXIgcmVxdWlyZVZvbHVudGVlciA9IHRvU3RhdGUuZGF0YS5yZXF1aXJlVm9sdW50ZWVyO1xyXG4gICAgICAgIHZhciByZXF1aXJlVmVyaWZpZWQgPSB0b1N0YXRlLmRhdGEucmVxdWlyZVZlcmlmaWVkO1xyXG4gICAgICAgIHZhciByZXF1aXJlQWRtaXR0ZWQgPSB0b1N0YXRlLmRhdGEucmVxdWlyZUFkbWl0dGVkO1xyXG4gIFxyXG4gICAgICAgIGlmIChyZXF1aXJlTG9naW4gJiYgIVNlc3Npb24uZ2V0VG9rZW4oKSkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAocmVxdWlyZUxvZ291dCAmJiBTZXNzaW9uLmdldFRva2VuKCkpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHJlcXVpcmVBZG1pbiAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkuYWRtaW4pIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7ICAgICAgICAgICBcclxuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAocmVxdWlyZVZvbHVudGVlciAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkudm9sdW50ZWVyICYmIHJlcXVpcmVBZG1pbiAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkuYWRtaW4pIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7ICAgICAgICAgICBcclxuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAocmVxdWlyZVZlcmlmaWVkICYmICFTZXNzaW9uLmdldFVzZXIoKS52ZXJpZmllZCkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgICAgICAgICAgIFxyXG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGlmIChyZXF1aXJlQWRtaXR0ZWQgJiYgIVNlc3Npb24uZ2V0VXNlcigpLnN0YXR1cy5hZG1pdHRlZCkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgICAgICAgICAgIFxyXG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG5cclxuICAgICAgfSk7XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgW1xyXG4gICAgJ1Nlc3Npb24nLFxyXG4gICAgZnVuY3Rpb24oU2Vzc2lvbil7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICByZXF1ZXN0OiBmdW5jdGlvbihjb25maWcpe1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBTZXNzaW9uLmdldFRva2VuKCk7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbil7XHJcbiAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnNbJ3gtYWNjZXNzLXRva2VuJ10gPSB0b2tlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5zZXJ2aWNlKCdTZXNzaW9uJywgW1xyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyR3aW5kb3cnLFxyXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHdpbmRvdyl7XHJcblxyXG4gICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbih0b2tlbiwgdXNlcil7XHJcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dCA9IHRva2VuO1xyXG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS51c2VySWQgPSB1c2VyLl9pZDtcclxuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXIgPSBKU09OLnN0cmluZ2lmeSh1c2VyKTtcclxuICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHVzZXI7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKG9uQ29tcGxldGUpe1xyXG4gICAgICBkZWxldGUgJHdpbmRvdy5sb2NhbFN0b3JhZ2Uuand0O1xyXG4gICAgICBkZWxldGUgJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkO1xyXG4gICAgICBkZWxldGUgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXI7XHJcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSBudWxsO1xyXG4gICAgICBpZiAob25Db21wbGV0ZSl7XHJcbiAgICAgICAgb25Db21wbGV0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZ2V0VG9rZW4gPSBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2Uuand0O1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmdldFVzZXJJZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZS51c2VySWQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZ2V0VXNlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKCR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zZXRVc2VyID0gZnVuY3Rpb24odXNlcil7XHJcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyID0gSlNPTi5zdHJpbmdpZnkodXNlcik7XHJcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xyXG4gICAgfTtcclxuXHJcbiAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5mYWN0b3J5KCdVdGlscycsIFtcclxuICAgIGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaXNSZWdPcGVuOiBmdW5jdGlvbihzZXR0aW5ncyl7XHJcbiAgICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSA+IHNldHRpbmdzLnRpbWVPcGVuICYmIERhdGUubm93KCkgPCBzZXR0aW5ncy50aW1lQ2xvc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpc0FmdGVyOiBmdW5jdGlvbih0aW1lKXtcclxuICAgICAgICAgIHJldHVybiBEYXRlLm5vdygpID4gdGltZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvcm1hdFRpbWU6IGZ1bmN0aW9uKHRpbWUpe1xyXG5cclxuICAgICAgICAgIGlmICghdGltZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBcIkludmFsaWQgRGF0ZVwiO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSh0aW1lKTtcclxuICAgICAgICAgIC8vIEhhY2sgZm9yIHRpbWV6b25lXHJcbiAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdCgnZGRkZCwgTU1NTSBEbyBZWVlZLCBoOm1tIGEnKSArXHJcbiAgICAgICAgICAgIFwiIFwiICsgZGF0ZS50b1RpbWVTdHJpbmcoKS5zcGxpdCgnICcpWzJdO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9XSk7XHJcbiIsIihmdW5jdGlvbigkKSB7XHJcbiAgICBqUXVlcnkuZm4uZXh0ZW5kKHtcclxuICAgICAgICBodG1sNV9xcmNvZGU6IGZ1bmN0aW9uKHFyY29kZVN1Y2Nlc3MsIHFyY29kZUVycm9yLCB2aWRlb0Vycm9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudEVsZW0gPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBjdXJyZW50RWxlbS5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IGN1cnJlbnRFbGVtLndpZHRoKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGhlaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gMjUwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh3aWR0aCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSAzMDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHZpZEVsZW0gPSAkKCc8dmlkZW8gd2lkdGg9XCInICsgd2lkdGggKyAncHhcIiBoZWlnaHQ9XCInICsgaGVpZ2h0ICsgJ3B4XCI+PC92aWRlbz4nKS5hcHBlbmRUbyhjdXJyZW50RWxlbSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlkRWxlbSA9ICQoJzx2aWRlbyB3aWR0aD1cIicgKyB3aWR0aCArICdweFwiIGhlaWdodD1cIicgKyBoZWlnaHQgKyAncHhcIiBhdXRvcGxheSBwbGF5c2lubGluZT48L3ZpZGVvPicpLmFwcGVuZFRvKGN1cnJlbnRFbGVtKTtcclxuICAgICAgICAgICAgICAgIHZhciBjYW52YXNFbGVtID0gJCgnPGNhbnZhcyBpZD1cInFyLWNhbnZhc1wiIHdpZHRoPVwiJyArICh3aWR0aCAtIDIpICsgJ3B4XCIgaGVpZ2h0PVwiJyArIChoZWlnaHQgLSAyKSArICdweFwiIHN0eWxlPVwiZGlzcGxheTpub25lO1wiPjwvY2FudmFzPicpLmFwcGVuZFRvKGN1cnJlbnRFbGVtKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdmlkZW8gPSB2aWRFbGVtWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGNhbnZhc0VsZW1bMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvY2FsTWVkaWFTdHJlYW07XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNjYW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxNZWRpYVN0cmVhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh2aWRlbywgMCwgMCwgMzA3LCAyNTApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHFyY29kZS5kZWNvZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXJjb2RlRXJyb3IoZSwgbG9jYWxNZWRpYVN0cmVhbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQuZGF0YShjdXJyZW50RWxlbVswXSwgXCJ0aW1lb3V0XCIsIHNldFRpbWVvdXQoc2NhbiwgNTAwKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQuZGF0YShjdXJyZW50RWxlbVswXSwgXCJ0aW1lb3V0XCIsIHNldFRpbWVvdXQoc2NhbiwgNTAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTsvL2VuZCBzbmFwc2hvdCBmdW5jdGlvblxyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5VUkwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkwgfHwgd2luZG93Lm1velVSTCB8fCB3aW5kb3cubXNVUkw7XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhID0gbmF2aWdhdG9yLmdldFVzZXJNZWRpYSB8fCBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIHx8IG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEgfHwgbmF2aWdhdG9yLm1zR2V0VXNlck1lZGlhO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzdWNjZXNzQ2FsbGJhY2sgPSBmdW5jdGlvbihzdHJlYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB2aWRlby5zcmMgPSAod2luZG93LlVSTCAmJiB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChzdHJlYW0pKSB8fCBzdHJlYW07XHJcbiAgICAgICAgICAgICAgICAgICAgdmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsTWVkaWFTdHJlYW0gPSBzdHJlYW07XHJcbiAgICAgICAgICAgICAgICAgICAgJC5kYXRhKGN1cnJlbnRFbGVtWzBdLCBcInN0cmVhbVwiLCBzdHJlYW0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2aWRlby5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5kYXRhKGN1cnJlbnRFbGVtWzBdLCBcInRpbWVvdXRcIiwgc2V0VGltZW91dChzY2FuLCAxMDAwKSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIGdldFVzZXJNZWRpYSBtZXRob2Qgd2l0aCBvdXIgY2FsbGJhY2sgZnVuY3Rpb25zXHJcbiAgICAgICAgICAgICAgICBpZiAobmF2aWdhdG9yLmdldFVzZXJNZWRpYSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEoe3ZpZGVvOiB7IGZhY2luZ01vZGU6IFwiZW52aXJvbm1lbnRcIiB9IH0sIHN1Y2Nlc3NDYWxsYmFjaywgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlkZW9FcnJvcihlcnJvciwgbG9jYWxNZWRpYVN0cmVhbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdOYXRpdmUgd2ViIGNhbWVyYSBzdHJlYW1pbmcgKGdldFVzZXJNZWRpYSkgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXIuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRGlzcGxheSBhIGZyaWVuZGx5IFwic29ycnlcIiBtZXNzYWdlIHRvIHRoZSB1c2VyXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcXJjb2RlLmNhbGxiYWNrID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHFyY29kZVN1Y2Nlc3MocmVzdWx0LCBsb2NhbE1lZGlhU3RyZWFtKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pOyAvLyBlbmQgb2YgaHRtbDVfcXJjb2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBodG1sNV9xcmNvZGVfc3RvcDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvL3N0b3AgdGhlIHN0cmVhbSBhbmQgY2FuY2VsIHRpbWVvdXRzXHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmRhdGEoJ3N0cmVhbScpLmdldFZpZGVvVHJhY2tzKCkuZm9yRWFjaChmdW5jdGlvbih2aWRlb1RyYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlkZW9UcmFjay5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoJCh0aGlzKS5kYXRhKCd0aW1lb3V0JykpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSkoalF1ZXJ5KTtcclxuXHJcbiIsImZ1bmN0aW9uIEVDQihjb3VudCxkYXRhQ29kZXdvcmRzKXt0aGlzLmNvdW50PWNvdW50LHRoaXMuZGF0YUNvZGV3b3Jkcz1kYXRhQ29kZXdvcmRzLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkNvdW50XCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb3VudH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkRhdGFDb2Rld29yZHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmRhdGFDb2Rld29yZHN9KX1mdW5jdGlvbiBFQ0Jsb2NrcyhlY0NvZGV3b3Jkc1BlckJsb2NrLGVjQmxvY2tzMSxlY0Jsb2NrczIpe3RoaXMuZWNDb2Rld29yZHNQZXJCbG9jaz1lY0NvZGV3b3Jkc1BlckJsb2NrLGVjQmxvY2tzMj90aGlzLmVjQmxvY2tzPW5ldyBBcnJheShlY0Jsb2NrczEsZWNCbG9ja3MyKTp0aGlzLmVjQmxvY2tzPW5ldyBBcnJheShlY0Jsb2NrczEpLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkVDQ29kZXdvcmRzUGVyQmxvY2tcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmVjQ29kZXdvcmRzUGVyQmxvY2t9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJUb3RhbEVDQ29kZXdvcmRzXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lY0NvZGV3b3Jkc1BlckJsb2NrKnRoaXMuTnVtQmxvY2tzfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiTnVtQmxvY2tzXCIsZnVuY3Rpb24oKXtmb3IodmFyIHRvdGFsPTAsaT0wO2k8dGhpcy5lY0Jsb2Nrcy5sZW5ndGg7aSsrKXRvdGFsKz10aGlzLmVjQmxvY2tzW2ldLmxlbmd0aDtyZXR1cm4gdG90YWx9KSx0aGlzLmdldEVDQmxvY2tzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZWNCbG9ja3N9fWZ1bmN0aW9uIFZlcnNpb24odmVyc2lvbk51bWJlcixhbGlnbm1lbnRQYXR0ZXJuQ2VudGVycyxlY0Jsb2NrczEsZWNCbG9ja3MyLGVjQmxvY2tzMyxlY0Jsb2NrczQpe3RoaXMudmVyc2lvbk51bWJlcj12ZXJzaW9uTnVtYmVyLHRoaXMuYWxpZ25tZW50UGF0dGVybkNlbnRlcnM9YWxpZ25tZW50UGF0dGVybkNlbnRlcnMsdGhpcy5lY0Jsb2Nrcz1uZXcgQXJyYXkoZWNCbG9ja3MxLGVjQmxvY2tzMixlY0Jsb2NrczMsZWNCbG9ja3M0KTtmb3IodmFyIHRvdGFsPTAsZWNDb2Rld29yZHM9ZWNCbG9ja3MxLkVDQ29kZXdvcmRzUGVyQmxvY2ssZWNiQXJyYXk9ZWNCbG9ja3MxLmdldEVDQmxvY2tzKCksaT0wO2k8ZWNiQXJyYXkubGVuZ3RoO2krKyl7dmFyIGVjQmxvY2s9ZWNiQXJyYXlbaV07dG90YWwrPWVjQmxvY2suQ291bnQqKGVjQmxvY2suRGF0YUNvZGV3b3JkcytlY0NvZGV3b3Jkcyl9dGhpcy50b3RhbENvZGV3b3Jkcz10b3RhbCx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJWZXJzaW9uTnVtYmVyXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52ZXJzaW9uTnVtYmVyfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQWxpZ25tZW50UGF0dGVybkNlbnRlcnNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmFsaWdubWVudFBhdHRlcm5DZW50ZXJzfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiVG90YWxDb2Rld29yZHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLnRvdGFsQ29kZXdvcmRzfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRGltZW5zaW9uRm9yVmVyc2lvblwiLGZ1bmN0aW9uKCl7cmV0dXJuIDE3KzQqdGhpcy52ZXJzaW9uTnVtYmVyfSksdGhpcy5idWlsZEZ1bmN0aW9uUGF0dGVybj1mdW5jdGlvbigpe3ZhciBkaW1lbnNpb249dGhpcy5EaW1lbnNpb25Gb3JWZXJzaW9uLGJpdE1hdHJpeD1uZXcgQml0TWF0cml4KGRpbWVuc2lvbik7Yml0TWF0cml4LnNldFJlZ2lvbigwLDAsOSw5KSxiaXRNYXRyaXguc2V0UmVnaW9uKGRpbWVuc2lvbi04LDAsOCw5KSxiaXRNYXRyaXguc2V0UmVnaW9uKDAsZGltZW5zaW9uLTgsOSw4KTtmb3IodmFyIG1heD10aGlzLmFsaWdubWVudFBhdHRlcm5DZW50ZXJzLmxlbmd0aCx4PTA7bWF4Png7eCsrKWZvcih2YXIgaT10aGlzLmFsaWdubWVudFBhdHRlcm5DZW50ZXJzW3hdLTIseT0wO21heD55O3krKykwPT14JiYoMD09eXx8eT09bWF4LTEpfHx4PT1tYXgtMSYmMD09eXx8Yml0TWF0cml4LnNldFJlZ2lvbih0aGlzLmFsaWdubWVudFBhdHRlcm5DZW50ZXJzW3ldLTIsaSw1LDUpO3JldHVybiBiaXRNYXRyaXguc2V0UmVnaW9uKDYsOSwxLGRpbWVuc2lvbi0xNyksYml0TWF0cml4LnNldFJlZ2lvbig5LDYsZGltZW5zaW9uLTE3LDEpLHRoaXMudmVyc2lvbk51bWJlcj42JiYoYml0TWF0cml4LnNldFJlZ2lvbihkaW1lbnNpb24tMTEsMCwzLDYpLGJpdE1hdHJpeC5zZXRSZWdpb24oMCxkaW1lbnNpb24tMTEsNiwzKSksYml0TWF0cml4fSx0aGlzLmdldEVDQmxvY2tzRm9yTGV2ZWw9ZnVuY3Rpb24oZWNMZXZlbCl7cmV0dXJuIHRoaXMuZWNCbG9ja3NbZWNMZXZlbC5vcmRpbmFsKCldfX1mdW5jdGlvbiBidWlsZFZlcnNpb25zKCl7cmV0dXJuIG5ldyBBcnJheShuZXcgVmVyc2lvbigxLG5ldyBBcnJheSxuZXcgRUNCbG9ja3MoNyxuZXcgRUNCKDEsMTkpKSxuZXcgRUNCbG9ja3MoMTAsbmV3IEVDQigxLDE2KSksbmV3IEVDQmxvY2tzKDEzLG5ldyBFQ0IoMSwxMykpLG5ldyBFQ0Jsb2NrcygxNyxuZXcgRUNCKDEsOSkpKSxuZXcgVmVyc2lvbigyLG5ldyBBcnJheSg2LDE4KSxuZXcgRUNCbG9ja3MoMTAsbmV3IEVDQigxLDM0KSksbmV3IEVDQmxvY2tzKDE2LG5ldyBFQ0IoMSwyOCkpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDEsMjIpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxLDE2KSkpLG5ldyBWZXJzaW9uKDMsbmV3IEFycmF5KDYsMjIpLG5ldyBFQ0Jsb2NrcygxNSxuZXcgRUNCKDEsNTUpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigxLDQ0KSksbmV3IEVDQmxvY2tzKDE4LG5ldyBFQ0IoMiwxNykpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDIsMTMpKSksbmV3IFZlcnNpb24oNCxuZXcgQXJyYXkoNiwyNiksbmV3IEVDQmxvY2tzKDIwLG5ldyBFQ0IoMSw4MCkpLG5ldyBFQ0Jsb2NrcygxOCxuZXcgRUNCKDIsMzIpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigyLDI0KSksbmV3IEVDQmxvY2tzKDE2LG5ldyBFQ0IoNCw5KSkpLG5ldyBWZXJzaW9uKDUsbmV3IEFycmF5KDYsMzApLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDEsMTA4KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMiw0MykpLG5ldyBFQ0Jsb2NrcygxOCxuZXcgRUNCKDIsMTUpLG5ldyBFQ0IoMiwxNikpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDIsMTEpLG5ldyBFQ0IoMiwxMikpKSxuZXcgVmVyc2lvbig2LG5ldyBBcnJheSg2LDM0KSxuZXcgRUNCbG9ja3MoMTgsbmV3IEVDQigyLDY4KSksbmV3IEVDQmxvY2tzKDE2LG5ldyBFQ0IoNCwyNykpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDQsMTkpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig0LDE1KSkpLG5ldyBWZXJzaW9uKDcsbmV3IEFycmF5KDYsMjIsMzgpLG5ldyBFQ0Jsb2NrcygyMCxuZXcgRUNCKDIsNzgpKSxuZXcgRUNCbG9ja3MoMTgsbmV3IEVDQig0LDMxKSksbmV3IEVDQmxvY2tzKDE4LG5ldyBFQ0IoMiwxNCksbmV3IEVDQig0LDE1KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoNCwxMyksbmV3IEVDQigxLDE0KSkpLG5ldyBWZXJzaW9uKDgsbmV3IEFycmF5KDYsMjQsNDIpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDIsOTcpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQigyLDM4KSxuZXcgRUNCKDIsMzkpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQig0LDE4KSxuZXcgRUNCKDIsMTkpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig0LDE0KSxuZXcgRUNCKDIsMTUpKSksbmV3IFZlcnNpb24oOSxuZXcgQXJyYXkoNiwyNiw0NiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMiwxMTYpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQigzLDM2KSxuZXcgRUNCKDIsMzcpKSxuZXcgRUNCbG9ja3MoMjAsbmV3IEVDQig0LDE2KSxuZXcgRUNCKDQsMTcpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQig0LDEyKSxuZXcgRUNCKDQsMTMpKSksbmV3IFZlcnNpb24oMTAsbmV3IEFycmF5KDYsMjgsNTApLG5ldyBFQ0Jsb2NrcygxOCxuZXcgRUNCKDIsNjgpLG5ldyBFQ0IoMiw2OSkpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDQsNDMpLG5ldyBFQ0IoMSw0NCkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDYsMTkpLG5ldyBFQ0IoMiwyMCkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDYsMTUpLG5ldyBFQ0IoMiwxNikpKSxuZXcgVmVyc2lvbigxMSxuZXcgQXJyYXkoNiwzMCw1NCksbmV3IEVDQmxvY2tzKDIwLG5ldyBFQ0IoNCw4MSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDEsNTApLG5ldyBFQ0IoNCw1MSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDQsMjIpLG5ldyBFQ0IoNCwyMykpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDMsMTIpLG5ldyBFQ0IoOCwxMykpKSxuZXcgVmVyc2lvbigxMixuZXcgQXJyYXkoNiwzMiw1OCksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMiw5MiksbmV3IEVDQigyLDkzKSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoNiwzNiksbmV3IEVDQigyLDM3KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoNCwyMCksbmV3IEVDQig2LDIxKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNywxNCksbmV3IEVDQig0LDE1KSkpLG5ldyBWZXJzaW9uKDEzLG5ldyBBcnJheSg2LDM0LDYyKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig0LDEwNykpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDgsMzcpLG5ldyBFQ0IoMSwzOCkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDgsMjApLG5ldyBFQ0IoNCwyMSkpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDEyLDExKSxuZXcgRUNCKDQsMTIpKSksbmV3IFZlcnNpb24oMTQsbmV3IEFycmF5KDYsMjYsNDYsNjYpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDMsMTE1KSxuZXcgRUNCKDEsMTE2KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoNCw0MCksbmV3IEVDQig1LDQxKSksbmV3IEVDQmxvY2tzKDIwLG5ldyBFQ0IoMTEsMTYpLG5ldyBFQ0IoNSwxNykpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDExLDEyKSxuZXcgRUNCKDUsMTMpKSksbmV3IFZlcnNpb24oMTUsbmV3IEFycmF5KDYsMjYsNDgsNzApLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDUsODcpLG5ldyBFQ0IoMSw4OCkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDUsNDEpLG5ldyBFQ0IoNSw0MikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDUsMjQpLG5ldyBFQ0IoNywyNSkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDExLDEyKSxuZXcgRUNCKDcsMTMpKSksbmV3IFZlcnNpb24oMTYsbmV3IEFycmF5KDYsMjYsNTAsNzQpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDUsOTgpLG5ldyBFQ0IoMSw5OSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDcsNDUpLG5ldyBFQ0IoMyw0NikpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDE1LDE5KSxuZXcgRUNCKDIsMjApKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigzLDE1KSxuZXcgRUNCKDEzLDE2KSkpLG5ldyBWZXJzaW9uKDE3LG5ldyBBcnJheSg2LDMwLDU0LDc4KSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxLDEwNyksbmV3IEVDQig1LDEwOCkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEwLDQ2KSxuZXcgRUNCKDEsNDcpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxLDIyKSxuZXcgRUNCKDE1LDIzKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMiwxNCksbmV3IEVDQigxNywxNSkpKSxuZXcgVmVyc2lvbigxOCxuZXcgQXJyYXkoNiwzMCw1Niw4MiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNSwxMjApLG5ldyBFQ0IoMSwxMjEpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig5LDQzKSxuZXcgRUNCKDQsNDQpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxNywyMiksbmV3IEVDQigxLDIzKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMiwxNCksbmV3IEVDQigxOSwxNSkpKSxuZXcgVmVyc2lvbigxOSxuZXcgQXJyYXkoNiwzMCw1OCw4NiksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMywxMTMpLG5ldyBFQ0IoNCwxMTQpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigzLDQ0KSxuZXcgRUNCKDExLDQ1KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoMTcsMjEpLG5ldyBFQ0IoNCwyMikpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDksMTMpLG5ldyBFQ0IoMTYsMTQpKSksbmV3IFZlcnNpb24oMjAsbmV3IEFycmF5KDYsMzQsNjIsOTApLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDMsMTA3KSxuZXcgRUNCKDUsMTA4KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoMyw0MSksbmV3IEVDQigxMyw0MikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE1LDI0KSxuZXcgRUNCKDUsMjUpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxNSwxNSksbmV3IEVDQigxMCwxNikpKSxuZXcgVmVyc2lvbigyMSxuZXcgQXJyYXkoNiwyOCw1MCw3Miw5NCksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNCwxMTYpLG5ldyBFQ0IoNCwxMTcpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigxNyw0MikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE3LDIyKSxuZXcgRUNCKDYsMjMpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxOSwxNiksbmV3IEVDQig2LDE3KSkpLG5ldyBWZXJzaW9uKDIyLG5ldyBBcnJheSg2LDI2LDUwLDc0LDk4KSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyLDExMSksbmV3IEVDQig3LDExMikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE3LDQ2KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNywyNCksbmV3IEVDQigxNiwyNSkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDM0LDEzKSkpLG5ldyBWZXJzaW9uKDIzLG5ldyBBcnJheSg2LDMwLDU0LDc0LDEwMiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNCwxMjEpLG5ldyBFQ0IoNSwxMjIpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig0LDQ3KSxuZXcgRUNCKDE0LDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTEsMjQpLG5ldyBFQ0IoMTQsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxNiwxNSksbmV3IEVDQigxNCwxNikpKSxuZXcgVmVyc2lvbigyNCxuZXcgQXJyYXkoNiwyOCw1NCw4MCwxMDYpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDYsMTE3KSxuZXcgRUNCKDQsMTE4KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNiw0NSksbmV3IEVDQigxNCw0NikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDExLDI0KSxuZXcgRUNCKDE2LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMzAsMTYpLG5ldyBFQ0IoMiwxNykpKSxuZXcgVmVyc2lvbigyNSxuZXcgQXJyYXkoNiwzMiw1OCw4NCwxMTApLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDgsMTA2KSxuZXcgRUNCKDQsMTA3KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoOCw0NyksbmV3IEVDQigxMyw0OCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDcsMjQpLG5ldyBFQ0IoMjIsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyMiwxNSksbmV3IEVDQigxMywxNikpKSxuZXcgVmVyc2lvbigyNixuZXcgQXJyYXkoNiwzMCw1OCw4NiwxMTQpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEwLDExNCksbmV3IEVDQigyLDExNSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE5LDQ2KSxuZXcgRUNCKDQsNDcpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyOCwyMiksbmV3IEVDQig2LDIzKSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMzMsMTYpLG5ldyBFQ0IoNCwxNykpKSxuZXcgVmVyc2lvbigyNyxuZXcgQXJyYXkoNiwzNCw2Miw5MCwxMTgpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDgsMTIyKSxuZXcgRUNCKDQsMTIzKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMjIsNDUpLG5ldyBFQ0IoMyw0NikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDgsMjMpLG5ldyBFQ0IoMjYsMjQpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMiwxNSksbmV3IEVDQigyOCwxNikpKSxuZXcgVmVyc2lvbigyOCxuZXcgQXJyYXkoNiwyNiw1MCw3NCw5OCwxMjIpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDMsMTE3KSxuZXcgRUNCKDEwLDExOCkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDMsNDUpLG5ldyBFQ0IoMjMsNDYpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0LDI0KSxuZXcgRUNCKDMxLDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTEsMTUpLG5ldyBFQ0IoMzEsMTYpKSksbmV3IFZlcnNpb24oMjksbmV3IEFycmF5KDYsMzAsNTQsNzgsMTAyLDEyNiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNywxMTYpLG5ldyBFQ0IoNywxMTcpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyMSw0NSksbmV3IEVDQig3LDQ2KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMSwyMyksbmV3IEVDQigzNywyNCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE5LDE1KSxuZXcgRUNCKDI2LDE2KSkpLG5ldyBWZXJzaW9uKDMwLG5ldyBBcnJheSg2LDI2LDUyLDc4LDEwNCwxMzApLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDUsMTE1KSxuZXcgRUNCKDEwLDExNikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE5LDQ3KSxuZXcgRUNCKDEwLDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTUsMjQpLG5ldyBFQ0IoMjUsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyMywxNSksbmV3IEVDQigyNSwxNikpKSxuZXcgVmVyc2lvbigzMSxuZXcgQXJyYXkoNiwzMCw1Niw4MiwxMDgsMTM0KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMywxMTUpLG5ldyBFQ0IoMywxMTYpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyLDQ2KSxuZXcgRUNCKDI5LDQ3KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNDIsMjQpLG5ldyBFQ0IoMSwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIzLDE1KSxuZXcgRUNCKDI4LDE2KSkpLG5ldyBWZXJzaW9uKDMyLG5ldyBBcnJheSg2LDM0LDYwLDg2LDExMiwxMzgpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE3LDExNSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEwLDQ2KSxuZXcgRUNCKDIzLDQ3KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTAsMjQpLG5ldyBFQ0IoMzUsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxOSwxNSksbmV3IEVDQigzNSwxNikpKSxuZXcgVmVyc2lvbigzMyxuZXcgQXJyYXkoNiwzMCw1OCw4NiwxMTQsMTQyKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxNywxMTUpLG5ldyBFQ0IoMSwxMTYpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxNCw0NiksbmV3IEVDQigyMSw0NykpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDI5LDI0KSxuZXcgRUNCKDE5LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTEsMTUpLG5ldyBFQ0IoNDYsMTYpKSksbmV3IFZlcnNpb24oMzQsbmV3IEFycmF5KDYsMzQsNjIsOTAsMTE4LDE0NiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTMsMTE1KSxuZXcgRUNCKDYsMTE2KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTQsNDYpLG5ldyBFQ0IoMjMsNDcpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0NCwyNCksbmV3IEVDQig3LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNTksMTYpLG5ldyBFQ0IoMSwxNykpKSxuZXcgVmVyc2lvbigzNSxuZXcgQXJyYXkoNiwzMCw1NCw3OCwxMDIsMTI2LDE1MCksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTIsMTIxKSxuZXcgRUNCKDcsMTIyKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTIsNDcpLG5ldyBFQ0IoMjYsNDgpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigzOSwyNCksbmV3IEVDQigxNCwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIyLDE1KSxuZXcgRUNCKDQxLDE2KSkpLG5ldyBWZXJzaW9uKDM2LG5ldyBBcnJheSg2LDI0LDUwLDc2LDEwMiwxMjgsMTU0KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig2LDEyMSksbmV3IEVDQigxNCwxMjIpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig2LDQ3KSxuZXcgRUNCKDM0LDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNDYsMjQpLG5ldyBFQ0IoMTAsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyLDE1KSxuZXcgRUNCKDY0LDE2KSkpLG5ldyBWZXJzaW9uKDM3LG5ldyBBcnJheSg2LDI4LDU0LDgwLDEwNiwxMzIsMTU4KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxNywxMjIpLG5ldyBFQ0IoNCwxMjMpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyOSw0NiksbmV3IEVDQigxNCw0NykpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQ5LDI0KSxuZXcgRUNCKDEwLDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMjQsMTUpLG5ldyBFQ0IoNDYsMTYpKSksbmV3IFZlcnNpb24oMzgsbmV3IEFycmF5KDYsMzIsNTgsODQsMTEwLDEzNiwxNjIpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQsMTIyKSxuZXcgRUNCKDE4LDEyMykpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEzLDQ2KSxuZXcgRUNCKDMyLDQ3KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNDgsMjQpLG5ldyBFQ0IoMTQsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0MiwxNSksbmV3IEVDQigzMiwxNikpKSxuZXcgVmVyc2lvbigzOSxuZXcgQXJyYXkoNiwyNiw1NCw4MiwxMTAsMTM4LDE2NiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMjAsMTE3KSxuZXcgRUNCKDQsMTE4KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNDAsNDcpLG5ldyBFQ0IoNyw0OCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQzLDI0KSxuZXcgRUNCKDIyLDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTAsMTUpLG5ldyBFQ0IoNjcsMTYpKSksbmV3IFZlcnNpb24oNDAsbmV3IEFycmF5KDYsMzAsNTgsODYsMTE0LDE0MiwxNzApLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE5LDExOCksbmV3IEVDQig2LDExOSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE4LDQ3KSxuZXcgRUNCKDMxLDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMzQsMjQpLG5ldyBFQ0IoMzQsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyMCwxNSksbmV3IEVDQig2MSwxNikpKSl9ZnVuY3Rpb24gUGVyc3BlY3RpdmVUcmFuc2Zvcm0oYTExLGEyMSxhMzEsYTEyLGEyMixhMzIsYTEzLGEyMyxhMzMpe3RoaXMuYTExPWExMSx0aGlzLmExMj1hMTIsdGhpcy5hMTM9YTEzLHRoaXMuYTIxPWEyMSx0aGlzLmEyMj1hMjIsdGhpcy5hMjM9YTIzLHRoaXMuYTMxPWEzMSx0aGlzLmEzMj1hMzIsdGhpcy5hMzM9YTMzLHRoaXMudHJhbnNmb3JtUG9pbnRzMT1mdW5jdGlvbihwb2ludHMpe2Zvcih2YXIgbWF4PXBvaW50cy5sZW5ndGgsYTExPXRoaXMuYTExLGExMj10aGlzLmExMixhMTM9dGhpcy5hMTMsYTIxPXRoaXMuYTIxLGEyMj10aGlzLmEyMixhMjM9dGhpcy5hMjMsYTMxPXRoaXMuYTMxLGEzMj10aGlzLmEzMixhMzM9dGhpcy5hMzMsaT0wO21heD5pO2krPTIpe3ZhciB4PXBvaW50c1tpXSx5PXBvaW50c1tpKzFdLGRlbm9taW5hdG9yPWExMyp4K2EyMyp5K2EzMztwb2ludHNbaV09KGExMSp4K2EyMSp5K2EzMSkvZGVub21pbmF0b3IscG9pbnRzW2krMV09KGExMip4K2EyMip5K2EzMikvZGVub21pbmF0b3J9fSx0aGlzLnRyYW5zZm9ybVBvaW50czI9ZnVuY3Rpb24oeFZhbHVlcyx5VmFsdWVzKXtmb3IodmFyIG49eFZhbHVlcy5sZW5ndGgsaT0wO24+aTtpKyspe3ZhciB4PXhWYWx1ZXNbaV0seT15VmFsdWVzW2ldLGRlbm9taW5hdG9yPXRoaXMuYTEzKngrdGhpcy5hMjMqeSt0aGlzLmEzMzt4VmFsdWVzW2ldPSh0aGlzLmExMSp4K3RoaXMuYTIxKnkrdGhpcy5hMzEpL2Rlbm9taW5hdG9yLHlWYWx1ZXNbaV09KHRoaXMuYTEyKngrdGhpcy5hMjIqeSt0aGlzLmEzMikvZGVub21pbmF0b3J9fSx0aGlzLmJ1aWxkQWRqb2ludD1mdW5jdGlvbigpe3JldHVybiBuZXcgUGVyc3BlY3RpdmVUcmFuc2Zvcm0odGhpcy5hMjIqdGhpcy5hMzMtdGhpcy5hMjMqdGhpcy5hMzIsdGhpcy5hMjMqdGhpcy5hMzEtdGhpcy5hMjEqdGhpcy5hMzMsdGhpcy5hMjEqdGhpcy5hMzItdGhpcy5hMjIqdGhpcy5hMzEsdGhpcy5hMTMqdGhpcy5hMzItdGhpcy5hMTIqdGhpcy5hMzMsdGhpcy5hMTEqdGhpcy5hMzMtdGhpcy5hMTMqdGhpcy5hMzEsdGhpcy5hMTIqdGhpcy5hMzEtdGhpcy5hMTEqdGhpcy5hMzIsdGhpcy5hMTIqdGhpcy5hMjMtdGhpcy5hMTMqdGhpcy5hMjIsdGhpcy5hMTMqdGhpcy5hMjEtdGhpcy5hMTEqdGhpcy5hMjMsdGhpcy5hMTEqdGhpcy5hMjItdGhpcy5hMTIqdGhpcy5hMjEpfSx0aGlzLnRpbWVzPWZ1bmN0aW9uKG90aGVyKXtyZXR1cm4gbmV3IFBlcnNwZWN0aXZlVHJhbnNmb3JtKHRoaXMuYTExKm90aGVyLmExMSt0aGlzLmEyMSpvdGhlci5hMTIrdGhpcy5hMzEqb3RoZXIuYTEzLHRoaXMuYTExKm90aGVyLmEyMSt0aGlzLmEyMSpvdGhlci5hMjIrdGhpcy5hMzEqb3RoZXIuYTIzLHRoaXMuYTExKm90aGVyLmEzMSt0aGlzLmEyMSpvdGhlci5hMzIrdGhpcy5hMzEqb3RoZXIuYTMzLHRoaXMuYTEyKm90aGVyLmExMSt0aGlzLmEyMipvdGhlci5hMTIrdGhpcy5hMzIqb3RoZXIuYTEzLHRoaXMuYTEyKm90aGVyLmEyMSt0aGlzLmEyMipvdGhlci5hMjIrdGhpcy5hMzIqb3RoZXIuYTIzLHRoaXMuYTEyKm90aGVyLmEzMSt0aGlzLmEyMipvdGhlci5hMzIrdGhpcy5hMzIqb3RoZXIuYTMzLHRoaXMuYTEzKm90aGVyLmExMSt0aGlzLmEyMypvdGhlci5hMTIrdGhpcy5hMzMqb3RoZXIuYTEzLHRoaXMuYTEzKm90aGVyLmEyMSt0aGlzLmEyMypvdGhlci5hMjIrdGhpcy5hMzMqb3RoZXIuYTIzLHRoaXMuYTEzKm90aGVyLmEzMSt0aGlzLmEyMypvdGhlci5hMzIrdGhpcy5hMzMqb3RoZXIuYTMzKX19ZnVuY3Rpb24gRGV0ZWN0b3JSZXN1bHQoYml0cyxwb2ludHMpe3RoaXMuYml0cz1iaXRzLHRoaXMucG9pbnRzPXBvaW50c31mdW5jdGlvbiBEZXRlY3RvcihpbWFnZSl7dGhpcy5pbWFnZT1pbWFnZSx0aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2s9bnVsbCx0aGlzLnNpemVPZkJsYWNrV2hpdGVCbGFja1J1bj1mdW5jdGlvbihmcm9tWCxmcm9tWSx0b1gsdG9ZKXt2YXIgc3RlZXA9TWF0aC5hYnModG9ZLWZyb21ZKT5NYXRoLmFicyh0b1gtZnJvbVgpO2lmKHN0ZWVwKXt2YXIgdGVtcD1mcm9tWDtmcm9tWD1mcm9tWSxmcm9tWT10ZW1wLHRlbXA9dG9YLHRvWD10b1ksdG9ZPXRlbXB9Zm9yKHZhciBkeD1NYXRoLmFicyh0b1gtZnJvbVgpLGR5PU1hdGguYWJzKHRvWS1mcm9tWSksZXJyb3I9LWR4Pj4xLHlzdGVwPXRvWT5mcm9tWT8xOi0xLHhzdGVwPXRvWD5mcm9tWD8xOi0xLHN0YXRlPTAseD1mcm9tWCx5PWZyb21ZO3ghPXRvWDt4Kz14c3RlcCl7dmFyIHJlYWxYPXN0ZWVwP3k6eCxyZWFsWT1zdGVlcD94Onk7aWYoMT09c3RhdGU/dGhpcy5pbWFnZVtyZWFsWCtyZWFsWSpxcmNvZGUud2lkdGhdJiZzdGF0ZSsrOnRoaXMuaW1hZ2VbcmVhbFgrcmVhbFkqcXJjb2RlLndpZHRoXXx8c3RhdGUrKywzPT1zdGF0ZSl7dmFyIGRpZmZYPXgtZnJvbVgsZGlmZlk9eS1mcm9tWTtyZXR1cm4gTWF0aC5zcXJ0KGRpZmZYKmRpZmZYK2RpZmZZKmRpZmZZKX1pZihlcnJvcis9ZHksZXJyb3I+MCl7aWYoeT09dG9ZKWJyZWFrO3krPXlzdGVwLGVycm9yLT1keH19dmFyIGRpZmZYMj10b1gtZnJvbVgsZGlmZlkyPXRvWS1mcm9tWTtyZXR1cm4gTWF0aC5zcXJ0KGRpZmZYMipkaWZmWDIrZGlmZlkyKmRpZmZZMil9LHRoaXMuc2l6ZU9mQmxhY2tXaGl0ZUJsYWNrUnVuQm90aFdheXM9ZnVuY3Rpb24oZnJvbVgsZnJvbVksdG9YLHRvWSl7dmFyIHJlc3VsdD10aGlzLnNpemVPZkJsYWNrV2hpdGVCbGFja1J1bihmcm9tWCxmcm9tWSx0b1gsdG9ZKSxzY2FsZT0xLG90aGVyVG9YPWZyb21YLSh0b1gtZnJvbVgpOzA+b3RoZXJUb1g/KHNjYWxlPWZyb21YLyhmcm9tWC1vdGhlclRvWCksb3RoZXJUb1g9MCk6b3RoZXJUb1g+PXFyY29kZS53aWR0aCYmKHNjYWxlPShxcmNvZGUud2lkdGgtMS1mcm9tWCkvKG90aGVyVG9YLWZyb21YKSxvdGhlclRvWD1xcmNvZGUud2lkdGgtMSk7dmFyIG90aGVyVG9ZPU1hdGguZmxvb3IoZnJvbVktKHRvWS1mcm9tWSkqc2NhbGUpO3JldHVybiBzY2FsZT0xLDA+b3RoZXJUb1k/KHNjYWxlPWZyb21ZLyhmcm9tWS1vdGhlclRvWSksb3RoZXJUb1k9MCk6b3RoZXJUb1k+PXFyY29kZS5oZWlnaHQmJihzY2FsZT0ocXJjb2RlLmhlaWdodC0xLWZyb21ZKS8ob3RoZXJUb1ktZnJvbVkpLG90aGVyVG9ZPXFyY29kZS5oZWlnaHQtMSksb3RoZXJUb1g9TWF0aC5mbG9vcihmcm9tWCsob3RoZXJUb1gtZnJvbVgpKnNjYWxlKSxyZXN1bHQrPXRoaXMuc2l6ZU9mQmxhY2tXaGl0ZUJsYWNrUnVuKGZyb21YLGZyb21ZLG90aGVyVG9YLG90aGVyVG9ZKSxyZXN1bHQtMX0sdGhpcy5jYWxjdWxhdGVNb2R1bGVTaXplT25lV2F5PWZ1bmN0aW9uKHBhdHRlcm4sb3RoZXJQYXR0ZXJuKXt2YXIgbW9kdWxlU2l6ZUVzdDE9dGhpcy5zaXplT2ZCbGFja1doaXRlQmxhY2tSdW5Cb3RoV2F5cyhNYXRoLmZsb29yKHBhdHRlcm4uWCksTWF0aC5mbG9vcihwYXR0ZXJuLlkpLE1hdGguZmxvb3Iob3RoZXJQYXR0ZXJuLlgpLE1hdGguZmxvb3Iob3RoZXJQYXR0ZXJuLlkpKSxtb2R1bGVTaXplRXN0Mj10aGlzLnNpemVPZkJsYWNrV2hpdGVCbGFja1J1bkJvdGhXYXlzKE1hdGguZmxvb3Iob3RoZXJQYXR0ZXJuLlgpLE1hdGguZmxvb3Iob3RoZXJQYXR0ZXJuLlkpLE1hdGguZmxvb3IocGF0dGVybi5YKSxNYXRoLmZsb29yKHBhdHRlcm4uWSkpO3JldHVybiBpc05hTihtb2R1bGVTaXplRXN0MSk/bW9kdWxlU2l6ZUVzdDIvNzppc05hTihtb2R1bGVTaXplRXN0Mik/bW9kdWxlU2l6ZUVzdDEvNzoobW9kdWxlU2l6ZUVzdDErbW9kdWxlU2l6ZUVzdDIpLzE0fSx0aGlzLmNhbGN1bGF0ZU1vZHVsZVNpemU9ZnVuY3Rpb24odG9wTGVmdCx0b3BSaWdodCxib3R0b21MZWZ0KXtyZXR1cm4odGhpcy5jYWxjdWxhdGVNb2R1bGVTaXplT25lV2F5KHRvcExlZnQsdG9wUmlnaHQpK3RoaXMuY2FsY3VsYXRlTW9kdWxlU2l6ZU9uZVdheSh0b3BMZWZ0LGJvdHRvbUxlZnQpKS8yfSx0aGlzLmRpc3RhbmNlPWZ1bmN0aW9uKHBhdHRlcm4xLHBhdHRlcm4yKXtyZXR1cm4geERpZmY9cGF0dGVybjEuWC1wYXR0ZXJuMi5YLHlEaWZmPXBhdHRlcm4xLlktcGF0dGVybjIuWSxNYXRoLnNxcnQoeERpZmYqeERpZmYreURpZmYqeURpZmYpfSx0aGlzLmNvbXB1dGVEaW1lbnNpb249ZnVuY3Rpb24odG9wTGVmdCx0b3BSaWdodCxib3R0b21MZWZ0LG1vZHVsZVNpemUpe3ZhciB0bHRyQ2VudGVyc0RpbWVuc2lvbj1NYXRoLnJvdW5kKHRoaXMuZGlzdGFuY2UodG9wTGVmdCx0b3BSaWdodCkvbW9kdWxlU2l6ZSksdGxibENlbnRlcnNEaW1lbnNpb249TWF0aC5yb3VuZCh0aGlzLmRpc3RhbmNlKHRvcExlZnQsYm90dG9tTGVmdCkvbW9kdWxlU2l6ZSksZGltZW5zaW9uPSh0bHRyQ2VudGVyc0RpbWVuc2lvbit0bGJsQ2VudGVyc0RpbWVuc2lvbj4+MSkrNztzd2l0Y2goMyZkaW1lbnNpb24pe2Nhc2UgMDpkaW1lbnNpb24rKzticmVhaztjYXNlIDI6ZGltZW5zaW9uLS07YnJlYWs7Y2FzZSAzOnRocm93XCJFcnJvclwifXJldHVybiBkaW1lbnNpb259LHRoaXMuZmluZEFsaWdubWVudEluUmVnaW9uPWZ1bmN0aW9uKG92ZXJhbGxFc3RNb2R1bGVTaXplLGVzdEFsaWdubWVudFgsZXN0QWxpZ25tZW50WSxhbGxvd2FuY2VGYWN0b3Ipe3ZhciBhbGxvd2FuY2U9TWF0aC5mbG9vcihhbGxvd2FuY2VGYWN0b3Iqb3ZlcmFsbEVzdE1vZHVsZVNpemUpLGFsaWdubWVudEFyZWFMZWZ0WD1NYXRoLm1heCgwLGVzdEFsaWdubWVudFgtYWxsb3dhbmNlKSxhbGlnbm1lbnRBcmVhUmlnaHRYPU1hdGgubWluKHFyY29kZS53aWR0aC0xLGVzdEFsaWdubWVudFgrYWxsb3dhbmNlKTtpZigzKm92ZXJhbGxFc3RNb2R1bGVTaXplPmFsaWdubWVudEFyZWFSaWdodFgtYWxpZ25tZW50QXJlYUxlZnRYKXRocm93XCJFcnJvclwiO3ZhciBhbGlnbm1lbnRBcmVhVG9wWT1NYXRoLm1heCgwLGVzdEFsaWdubWVudFktYWxsb3dhbmNlKSxhbGlnbm1lbnRBcmVhQm90dG9tWT1NYXRoLm1pbihxcmNvZGUuaGVpZ2h0LTEsZXN0QWxpZ25tZW50WSthbGxvd2FuY2UpLGFsaWdubWVudEZpbmRlcj1uZXcgQWxpZ25tZW50UGF0dGVybkZpbmRlcih0aGlzLmltYWdlLGFsaWdubWVudEFyZWFMZWZ0WCxhbGlnbm1lbnRBcmVhVG9wWSxhbGlnbm1lbnRBcmVhUmlnaHRYLWFsaWdubWVudEFyZWFMZWZ0WCxhbGlnbm1lbnRBcmVhQm90dG9tWS1hbGlnbm1lbnRBcmVhVG9wWSxvdmVyYWxsRXN0TW9kdWxlU2l6ZSx0aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2spO3JldHVybiBhbGlnbm1lbnRGaW5kZXIuZmluZCgpfSx0aGlzLmNyZWF0ZVRyYW5zZm9ybT1mdW5jdGlvbih0b3BMZWZ0LHRvcFJpZ2h0LGJvdHRvbUxlZnQsYWxpZ25tZW50UGF0dGVybixkaW1lbnNpb24pe3ZhciBib3R0b21SaWdodFgsYm90dG9tUmlnaHRZLHNvdXJjZUJvdHRvbVJpZ2h0WCxzb3VyY2VCb3R0b21SaWdodFksZGltTWludXNUaHJlZT1kaW1lbnNpb24tMy41O251bGwhPWFsaWdubWVudFBhdHRlcm4/KGJvdHRvbVJpZ2h0WD1hbGlnbm1lbnRQYXR0ZXJuLlgsYm90dG9tUmlnaHRZPWFsaWdubWVudFBhdHRlcm4uWSxzb3VyY2VCb3R0b21SaWdodFg9c291cmNlQm90dG9tUmlnaHRZPWRpbU1pbnVzVGhyZWUtMyk6KGJvdHRvbVJpZ2h0WD10b3BSaWdodC5YLXRvcExlZnQuWCtib3R0b21MZWZ0LlgsYm90dG9tUmlnaHRZPXRvcFJpZ2h0LlktdG9wTGVmdC5ZK2JvdHRvbUxlZnQuWSxzb3VyY2VCb3R0b21SaWdodFg9c291cmNlQm90dG9tUmlnaHRZPWRpbU1pbnVzVGhyZWUpO3ZhciB0cmFuc2Zvcm09UGVyc3BlY3RpdmVUcmFuc2Zvcm0ucXVhZHJpbGF0ZXJhbFRvUXVhZHJpbGF0ZXJhbCgzLjUsMy41LGRpbU1pbnVzVGhyZWUsMy41LHNvdXJjZUJvdHRvbVJpZ2h0WCxzb3VyY2VCb3R0b21SaWdodFksMy41LGRpbU1pbnVzVGhyZWUsdG9wTGVmdC5YLHRvcExlZnQuWSx0b3BSaWdodC5YLHRvcFJpZ2h0LlksYm90dG9tUmlnaHRYLGJvdHRvbVJpZ2h0WSxib3R0b21MZWZ0LlgsYm90dG9tTGVmdC5ZKTtyZXR1cm4gdHJhbnNmb3JtfSx0aGlzLnNhbXBsZUdyaWQ9ZnVuY3Rpb24oaW1hZ2UsdHJhbnNmb3JtLGRpbWVuc2lvbil7dmFyIHNhbXBsZXI9R3JpZFNhbXBsZXI7cmV0dXJuIHNhbXBsZXIuc2FtcGxlR3JpZDMoaW1hZ2UsZGltZW5zaW9uLHRyYW5zZm9ybSl9LHRoaXMucHJvY2Vzc0ZpbmRlclBhdHRlcm5JbmZvPWZ1bmN0aW9uKGluZm8pe3ZhciB0b3BMZWZ0PWluZm8uVG9wTGVmdCx0b3BSaWdodD1pbmZvLlRvcFJpZ2h0LGJvdHRvbUxlZnQ9aW5mby5Cb3R0b21MZWZ0LG1vZHVsZVNpemU9dGhpcy5jYWxjdWxhdGVNb2R1bGVTaXplKHRvcExlZnQsdG9wUmlnaHQsYm90dG9tTGVmdCk7aWYoMT5tb2R1bGVTaXplKXRocm93XCJFcnJvclwiO3ZhciBkaW1lbnNpb249dGhpcy5jb21wdXRlRGltZW5zaW9uKHRvcExlZnQsdG9wUmlnaHQsYm90dG9tTGVmdCxtb2R1bGVTaXplKSxwcm92aXNpb25hbFZlcnNpb249VmVyc2lvbi5nZXRQcm92aXNpb25hbFZlcnNpb25Gb3JEaW1lbnNpb24oZGltZW5zaW9uKSxtb2R1bGVzQmV0d2VlbkZQQ2VudGVycz1wcm92aXNpb25hbFZlcnNpb24uRGltZW5zaW9uRm9yVmVyc2lvbi03LGFsaWdubWVudFBhdHRlcm49bnVsbDtpZihwcm92aXNpb25hbFZlcnNpb24uQWxpZ25tZW50UGF0dGVybkNlbnRlcnMubGVuZ3RoPjApZm9yKHZhciBib3R0b21SaWdodFg9dG9wUmlnaHQuWC10b3BMZWZ0LlgrYm90dG9tTGVmdC5YLGJvdHRvbVJpZ2h0WT10b3BSaWdodC5ZLXRvcExlZnQuWStib3R0b21MZWZ0LlksY29ycmVjdGlvblRvVG9wTGVmdD0xLTMvbW9kdWxlc0JldHdlZW5GUENlbnRlcnMsZXN0QWxpZ25tZW50WD1NYXRoLmZsb29yKHRvcExlZnQuWCtjb3JyZWN0aW9uVG9Ub3BMZWZ0Kihib3R0b21SaWdodFgtdG9wTGVmdC5YKSksZXN0QWxpZ25tZW50WT1NYXRoLmZsb29yKHRvcExlZnQuWStjb3JyZWN0aW9uVG9Ub3BMZWZ0Kihib3R0b21SaWdodFktdG9wTGVmdC5ZKSksaT00OzE2Pj1pO2k8PD0xKXthbGlnbm1lbnRQYXR0ZXJuPXRoaXMuZmluZEFsaWdubWVudEluUmVnaW9uKG1vZHVsZVNpemUsZXN0QWxpZ25tZW50WCxlc3RBbGlnbm1lbnRZLGkpO2JyZWFrfXZhciBwb2ludHMsdHJhbnNmb3JtPXRoaXMuY3JlYXRlVHJhbnNmb3JtKHRvcExlZnQsdG9wUmlnaHQsYm90dG9tTGVmdCxhbGlnbm1lbnRQYXR0ZXJuLGRpbWVuc2lvbiksYml0cz10aGlzLnNhbXBsZUdyaWQodGhpcy5pbWFnZSx0cmFuc2Zvcm0sZGltZW5zaW9uKTtyZXR1cm4gcG9pbnRzPW51bGw9PWFsaWdubWVudFBhdHRlcm4/bmV3IEFycmF5KGJvdHRvbUxlZnQsdG9wTGVmdCx0b3BSaWdodCk6bmV3IEFycmF5KGJvdHRvbUxlZnQsdG9wTGVmdCx0b3BSaWdodCxhbGlnbm1lbnRQYXR0ZXJuKSxuZXcgRGV0ZWN0b3JSZXN1bHQoYml0cyxwb2ludHMpfSx0aGlzLmRldGVjdD1mdW5jdGlvbigpe3ZhciBpbmZvPShuZXcgRmluZGVyUGF0dGVybkZpbmRlcikuZmluZEZpbmRlclBhdHRlcm4odGhpcy5pbWFnZSk7cmV0dXJuIHRoaXMucHJvY2Vzc0ZpbmRlclBhdHRlcm5JbmZvKGluZm8pfX1mdW5jdGlvbiBGb3JtYXRJbmZvcm1hdGlvbihmb3JtYXRJbmZvKXt0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsPUVycm9yQ29ycmVjdGlvbkxldmVsLmZvckJpdHMoZm9ybWF0SW5mbz4+MyYzKSx0aGlzLmRhdGFNYXNrPTcmZm9ybWF0SW5mbyx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJFcnJvckNvcnJlY3Rpb25MZXZlbFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWx9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJEYXRhTWFza1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZGF0YU1hc2t9KSx0aGlzLkdldEhhc2hDb2RlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwub3JkaW5hbCgpPDwzfGRhdGFNYXNrfSx0aGlzLkVxdWFscz1mdW5jdGlvbihvKXt2YXIgb3RoZXI9bztyZXR1cm4gdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbD09b3RoZXIuZXJyb3JDb3JyZWN0aW9uTGV2ZWwmJnRoaXMuZGF0YU1hc2s9PW90aGVyLmRhdGFNYXNrfX1mdW5jdGlvbiBFcnJvckNvcnJlY3Rpb25MZXZlbChvcmRpbmFsLGJpdHMsbmFtZSl7dGhpcy5vcmRpbmFsX1JlbmFtZWRfRmllbGQ9b3JkaW5hbCx0aGlzLmJpdHM9Yml0cyx0aGlzLm5hbWU9bmFtZSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJCaXRzXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5iaXRzfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiTmFtZVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubmFtZX0pLHRoaXMub3JkaW5hbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLm9yZGluYWxfUmVuYW1lZF9GaWVsZH19ZnVuY3Rpb24gQml0TWF0cml4KHdpZHRoLGhlaWdodCl7aWYoaGVpZ2h0fHwoaGVpZ2h0PXdpZHRoKSwxPndpZHRofHwxPmhlaWdodCl0aHJvd1wiQm90aCBkaW1lbnNpb25zIG11c3QgYmUgZ3JlYXRlciB0aGFuIDBcIjt0aGlzLndpZHRoPXdpZHRoLHRoaXMuaGVpZ2h0PWhlaWdodDt2YXIgcm93U2l6ZT13aWR0aD4+NTswIT0oMzEmd2lkdGgpJiZyb3dTaXplKyssdGhpcy5yb3dTaXplPXJvd1NpemUsdGhpcy5iaXRzPW5ldyBBcnJheShyb3dTaXplKmhlaWdodCk7Zm9yKHZhciBpPTA7aTx0aGlzLmJpdHMubGVuZ3RoO2krKyl0aGlzLmJpdHNbaV09MDt0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJXaWR0aFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMud2lkdGh9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJIZWlnaHRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmhlaWdodH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkRpbWVuc2lvblwiLGZ1bmN0aW9uKCl7aWYodGhpcy53aWR0aCE9dGhpcy5oZWlnaHQpdGhyb3dcIkNhbid0IGNhbGwgZ2V0RGltZW5zaW9uKCkgb24gYSBub24tc3F1YXJlIG1hdHJpeFwiO3JldHVybiB0aGlzLndpZHRofSksdGhpcy5nZXRfUmVuYW1lZD1mdW5jdGlvbih4LHkpe3ZhciBvZmZzZXQ9eSp0aGlzLnJvd1NpemUrKHg+PjUpO3JldHVybiAwIT0oMSZVUlNoaWZ0KHRoaXMuYml0c1tvZmZzZXRdLDMxJngpKX0sdGhpcy5zZXRfUmVuYW1lZD1mdW5jdGlvbih4LHkpe3ZhciBvZmZzZXQ9eSp0aGlzLnJvd1NpemUrKHg+PjUpO3RoaXMuYml0c1tvZmZzZXRdfD0xPDwoMzEmeCl9LHRoaXMuZmxpcD1mdW5jdGlvbih4LHkpe3ZhciBvZmZzZXQ9eSp0aGlzLnJvd1NpemUrKHg+PjUpO3RoaXMuYml0c1tvZmZzZXRdXj0xPDwoMzEmeCl9LHRoaXMuY2xlYXI9ZnVuY3Rpb24oKXtmb3IodmFyIG1heD10aGlzLmJpdHMubGVuZ3RoLGk9MDttYXg+aTtpKyspdGhpcy5iaXRzW2ldPTB9LHRoaXMuc2V0UmVnaW9uPWZ1bmN0aW9uKGxlZnQsdG9wLHdpZHRoLGhlaWdodCl7aWYoMD50b3B8fDA+bGVmdCl0aHJvd1wiTGVmdCBhbmQgdG9wIG11c3QgYmUgbm9ubmVnYXRpdmVcIjtpZigxPmhlaWdodHx8MT53aWR0aCl0aHJvd1wiSGVpZ2h0IGFuZCB3aWR0aCBtdXN0IGJlIGF0IGxlYXN0IDFcIjt2YXIgcmlnaHQ9bGVmdCt3aWR0aCxib3R0b209dG9wK2hlaWdodDtpZihib3R0b20+dGhpcy5oZWlnaHR8fHJpZ2h0PnRoaXMud2lkdGgpdGhyb3dcIlRoZSByZWdpb24gbXVzdCBmaXQgaW5zaWRlIHRoZSBtYXRyaXhcIjtmb3IodmFyIHk9dG9wO2JvdHRvbT55O3krKylmb3IodmFyIG9mZnNldD15KnRoaXMucm93U2l6ZSx4PWxlZnQ7cmlnaHQ+eDt4KyspdGhpcy5iaXRzW29mZnNldCsoeD4+NSldfD0xPDwoMzEmeCl9fWZ1bmN0aW9uIERhdGFCbG9jayhudW1EYXRhQ29kZXdvcmRzLGNvZGV3b3Jkcyl7dGhpcy5udW1EYXRhQ29kZXdvcmRzPW51bURhdGFDb2Rld29yZHMsdGhpcy5jb2Rld29yZHM9Y29kZXdvcmRzLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIk51bURhdGFDb2Rld29yZHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLm51bURhdGFDb2Rld29yZHN9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJDb2Rld29yZHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvZGV3b3Jkc30pfWZ1bmN0aW9uIEJpdE1hdHJpeFBhcnNlcihiaXRNYXRyaXgpe3ZhciBkaW1lbnNpb249Yml0TWF0cml4LkRpbWVuc2lvbjtpZigyMT5kaW1lbnNpb258fDEhPSgzJmRpbWVuc2lvbikpdGhyb3dcIkVycm9yIEJpdE1hdHJpeFBhcnNlclwiO3RoaXMuYml0TWF0cml4PWJpdE1hdHJpeCx0aGlzLnBhcnNlZFZlcnNpb249bnVsbCx0aGlzLnBhcnNlZEZvcm1hdEluZm89bnVsbCx0aGlzLmNvcHlCaXQ9ZnVuY3Rpb24oaSxqLHZlcnNpb25CaXRzKXtyZXR1cm4gdGhpcy5iaXRNYXRyaXguZ2V0X1JlbmFtZWQoaSxqKT92ZXJzaW9uQml0czw8MXwxOnZlcnNpb25CaXRzPDwxfSx0aGlzLnJlYWRGb3JtYXRJbmZvcm1hdGlvbj1mdW5jdGlvbigpe2lmKG51bGwhPXRoaXMucGFyc2VkRm9ybWF0SW5mbylyZXR1cm4gdGhpcy5wYXJzZWRGb3JtYXRJbmZvO2Zvcih2YXIgZm9ybWF0SW5mb0JpdHM9MCxpPTA7Nj5pO2krKylmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoaSw4LGZvcm1hdEluZm9CaXRzKTtmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoNyw4LGZvcm1hdEluZm9CaXRzKSxmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoOCw4LGZvcm1hdEluZm9CaXRzKSxmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoOCw3LGZvcm1hdEluZm9CaXRzKTtmb3IodmFyIGo9NTtqPj0wO2otLSlmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoOCxqLGZvcm1hdEluZm9CaXRzKTtpZih0aGlzLnBhcnNlZEZvcm1hdEluZm89Rm9ybWF0SW5mb3JtYXRpb24uZGVjb2RlRm9ybWF0SW5mb3JtYXRpb24oZm9ybWF0SW5mb0JpdHMpLG51bGwhPXRoaXMucGFyc2VkRm9ybWF0SW5mbylyZXR1cm4gdGhpcy5wYXJzZWRGb3JtYXRJbmZvO3ZhciBkaW1lbnNpb249dGhpcy5iaXRNYXRyaXguRGltZW5zaW9uO2Zvcm1hdEluZm9CaXRzPTA7Zm9yKHZhciBpTWluPWRpbWVuc2lvbi04LGk9ZGltZW5zaW9uLTE7aT49aU1pbjtpLS0pZm9ybWF0SW5mb0JpdHM9dGhpcy5jb3B5Qml0KGksOCxmb3JtYXRJbmZvQml0cyk7Zm9yKHZhciBqPWRpbWVuc2lvbi03O2RpbWVuc2lvbj5qO2orKylmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoOCxqLGZvcm1hdEluZm9CaXRzKTtpZih0aGlzLnBhcnNlZEZvcm1hdEluZm89Rm9ybWF0SW5mb3JtYXRpb24uZGVjb2RlRm9ybWF0SW5mb3JtYXRpb24oZm9ybWF0SW5mb0JpdHMpLG51bGwhPXRoaXMucGFyc2VkRm9ybWF0SW5mbylyZXR1cm4gdGhpcy5wYXJzZWRGb3JtYXRJbmZvO3Rocm93XCJFcnJvciByZWFkRm9ybWF0SW5mb3JtYXRpb25cIn0sdGhpcy5yZWFkVmVyc2lvbj1mdW5jdGlvbigpe2lmKG51bGwhPXRoaXMucGFyc2VkVmVyc2lvbilyZXR1cm4gdGhpcy5wYXJzZWRWZXJzaW9uO3ZhciBkaW1lbnNpb249dGhpcy5iaXRNYXRyaXguRGltZW5zaW9uLHByb3Zpc2lvbmFsVmVyc2lvbj1kaW1lbnNpb24tMTc+PjI7aWYoNj49cHJvdmlzaW9uYWxWZXJzaW9uKXJldHVybiBWZXJzaW9uLmdldFZlcnNpb25Gb3JOdW1iZXIocHJvdmlzaW9uYWxWZXJzaW9uKTtmb3IodmFyIHZlcnNpb25CaXRzPTAsaWpNaW49ZGltZW5zaW9uLTExLGo9NTtqPj0wO2otLSlmb3IodmFyIGk9ZGltZW5zaW9uLTk7aT49aWpNaW47aS0tKXZlcnNpb25CaXRzPXRoaXMuY29weUJpdChpLGosdmVyc2lvbkJpdHMpO2lmKHRoaXMucGFyc2VkVmVyc2lvbj1WZXJzaW9uLmRlY29kZVZlcnNpb25JbmZvcm1hdGlvbih2ZXJzaW9uQml0cyksbnVsbCE9dGhpcy5wYXJzZWRWZXJzaW9uJiZ0aGlzLnBhcnNlZFZlcnNpb24uRGltZW5zaW9uRm9yVmVyc2lvbj09ZGltZW5zaW9uKXJldHVybiB0aGlzLnBhcnNlZFZlcnNpb247dmVyc2lvbkJpdHM9MDtmb3IodmFyIGk9NTtpPj0wO2ktLSlmb3IodmFyIGo9ZGltZW5zaW9uLTk7aj49aWpNaW47ai0tKXZlcnNpb25CaXRzPXRoaXMuY29weUJpdChpLGosdmVyc2lvbkJpdHMpO2lmKHRoaXMucGFyc2VkVmVyc2lvbj1WZXJzaW9uLmRlY29kZVZlcnNpb25JbmZvcm1hdGlvbih2ZXJzaW9uQml0cyksbnVsbCE9dGhpcy5wYXJzZWRWZXJzaW9uJiZ0aGlzLnBhcnNlZFZlcnNpb24uRGltZW5zaW9uRm9yVmVyc2lvbj09ZGltZW5zaW9uKXJldHVybiB0aGlzLnBhcnNlZFZlcnNpb247dGhyb3dcIkVycm9yIHJlYWRWZXJzaW9uXCJ9LHRoaXMucmVhZENvZGV3b3Jkcz1mdW5jdGlvbigpe3ZhciBmb3JtYXRJbmZvPXRoaXMucmVhZEZvcm1hdEluZm9ybWF0aW9uKCksdmVyc2lvbj10aGlzLnJlYWRWZXJzaW9uKCksZGF0YU1hc2s9RGF0YU1hc2suZm9yUmVmZXJlbmNlKGZvcm1hdEluZm8uRGF0YU1hc2spLGRpbWVuc2lvbj10aGlzLmJpdE1hdHJpeC5EaW1lbnNpb247ZGF0YU1hc2sudW5tYXNrQml0TWF0cml4KHRoaXMuYml0TWF0cml4LGRpbWVuc2lvbik7Zm9yKHZhciBmdW5jdGlvblBhdHRlcm49dmVyc2lvbi5idWlsZEZ1bmN0aW9uUGF0dGVybigpLHJlYWRpbmdVcD0hMCxyZXN1bHQ9bmV3IEFycmF5KHZlcnNpb24uVG90YWxDb2Rld29yZHMpLHJlc3VsdE9mZnNldD0wLGN1cnJlbnRCeXRlPTAsYml0c1JlYWQ9MCxqPWRpbWVuc2lvbi0xO2o+MDtqLT0yKXs2PT1qJiZqLS07Zm9yKHZhciBjb3VudD0wO2RpbWVuc2lvbj5jb3VudDtjb3VudCsrKWZvcih2YXIgaT1yZWFkaW5nVXA/ZGltZW5zaW9uLTEtY291bnQ6Y291bnQsY29sPTA7Mj5jb2w7Y29sKyspZnVuY3Rpb25QYXR0ZXJuLmdldF9SZW5hbWVkKGotY29sLGkpfHwoYml0c1JlYWQrKyxjdXJyZW50Qnl0ZTw8PTEsdGhpcy5iaXRNYXRyaXguZ2V0X1JlbmFtZWQoai1jb2wsaSkmJihjdXJyZW50Qnl0ZXw9MSksOD09Yml0c1JlYWQmJihyZXN1bHRbcmVzdWx0T2Zmc2V0KytdPWN1cnJlbnRCeXRlLGJpdHNSZWFkPTAsY3VycmVudEJ5dGU9MCkpO3JlYWRpbmdVcF49ITB9aWYocmVzdWx0T2Zmc2V0IT12ZXJzaW9uLlRvdGFsQ29kZXdvcmRzKXRocm93XCJFcnJvciByZWFkQ29kZXdvcmRzXCI7cmV0dXJuIHJlc3VsdH19ZnVuY3Rpb24gRGF0YU1hc2swMDAoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuIDA9PShpK2omMSl9fWZ1bmN0aW9uIERhdGFNYXNrMDAxKCl7dGhpcy51bm1hc2tCaXRNYXRyaXg9ZnVuY3Rpb24oYml0cyxkaW1lbnNpb24pe2Zvcih2YXIgaT0wO2RpbWVuc2lvbj5pO2krKylmb3IodmFyIGo9MDtkaW1lbnNpb24+ajtqKyspdGhpcy5pc01hc2tlZChpLGopJiZiaXRzLmZsaXAoaixpKX0sdGhpcy5pc01hc2tlZD1mdW5jdGlvbihpLGope3JldHVybiAwPT0oMSZpKX19ZnVuY3Rpb24gRGF0YU1hc2swMTAoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuIGolMz09MH19ZnVuY3Rpb24gRGF0YU1hc2swMTEoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuKGkraiklMz09MH19ZnVuY3Rpb24gRGF0YU1hc2sxMDAoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuIDA9PShVUlNoaWZ0KGksMSkrai8zJjEpfX1mdW5jdGlvbiBEYXRhTWFzazEwMSgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXt2YXIgdGVtcD1pKmo7cmV0dXJuKDEmdGVtcCkrdGVtcCUzPT0wfX1mdW5jdGlvbiBEYXRhTWFzazExMCgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXt2YXIgdGVtcD1pKmo7cmV0dXJuIDA9PSgoMSZ0ZW1wKSt0ZW1wJTMmMSl9fWZ1bmN0aW9uIERhdGFNYXNrMTExKCl7dGhpcy51bm1hc2tCaXRNYXRyaXg9ZnVuY3Rpb24oYml0cyxkaW1lbnNpb24pe2Zvcih2YXIgaT0wO2RpbWVuc2lvbj5pO2krKylmb3IodmFyIGo9MDtkaW1lbnNpb24+ajtqKyspdGhpcy5pc01hc2tlZChpLGopJiZiaXRzLmZsaXAoaixpKX0sdGhpcy5pc01hc2tlZD1mdW5jdGlvbihpLGope3JldHVybiAwPT0oKGkraiYxKStpKmolMyYxKX19ZnVuY3Rpb24gUmVlZFNvbG9tb25EZWNvZGVyKGZpZWxkKXt0aGlzLmZpZWxkPWZpZWxkLHRoaXMuZGVjb2RlPWZ1bmN0aW9uKHJlY2VpdmVkLHR3b1Mpe2Zvcih2YXIgcG9seT1uZXcgR0YyNTZQb2x5KHRoaXMuZmllbGQscmVjZWl2ZWQpLHN5bmRyb21lQ29lZmZpY2llbnRzPW5ldyBBcnJheSh0d29TKSxpPTA7aTxzeW5kcm9tZUNvZWZmaWNpZW50cy5sZW5ndGg7aSsrKXN5bmRyb21lQ29lZmZpY2llbnRzW2ldPTA7Zm9yKHZhciBkYXRhTWF0cml4PSExLG5vRXJyb3I9ITAsaT0wO3R3b1M+aTtpKyspe3ZhciBldmFsPXBvbHkuZXZhbHVhdGVBdCh0aGlzLmZpZWxkLmV4cChkYXRhTWF0cml4P2krMTppKSk7c3luZHJvbWVDb2VmZmljaWVudHNbc3luZHJvbWVDb2VmZmljaWVudHMubGVuZ3RoLTEtaV09ZXZhbCwwIT1ldmFsJiYobm9FcnJvcj0hMSl9aWYoIW5vRXJyb3IpZm9yKHZhciBzeW5kcm9tZT1uZXcgR0YyNTZQb2x5KHRoaXMuZmllbGQsc3luZHJvbWVDb2VmZmljaWVudHMpLHNpZ21hT21lZ2E9dGhpcy5ydW5FdWNsaWRlYW5BbGdvcml0aG0odGhpcy5maWVsZC5idWlsZE1vbm9taWFsKHR3b1MsMSksc3luZHJvbWUsdHdvUyksc2lnbWE9c2lnbWFPbWVnYVswXSxvbWVnYT1zaWdtYU9tZWdhWzFdLGVycm9yTG9jYXRpb25zPXRoaXMuZmluZEVycm9yTG9jYXRpb25zKHNpZ21hKSxlcnJvck1hZ25pdHVkZXM9dGhpcy5maW5kRXJyb3JNYWduaXR1ZGVzKG9tZWdhLGVycm9yTG9jYXRpb25zLGRhdGFNYXRyaXgpLGk9MDtpPGVycm9yTG9jYXRpb25zLmxlbmd0aDtpKyspe3ZhciBwb3NpdGlvbj1yZWNlaXZlZC5sZW5ndGgtMS10aGlzLmZpZWxkLmxvZyhlcnJvckxvY2F0aW9uc1tpXSk7aWYoMD5wb3NpdGlvbil0aHJvd1wiUmVlZFNvbG9tb25FeGNlcHRpb24gQmFkIGVycm9yIGxvY2F0aW9uXCI7cmVjZWl2ZWRbcG9zaXRpb25dPUdGMjU2LmFkZE9yU3VidHJhY3QocmVjZWl2ZWRbcG9zaXRpb25dLGVycm9yTWFnbml0dWRlc1tpXSl9fSx0aGlzLnJ1bkV1Y2xpZGVhbkFsZ29yaXRobT1mdW5jdGlvbihhLGIsUil7aWYoYS5EZWdyZWU8Yi5EZWdyZWUpe3ZhciB0ZW1wPWE7YT1iLGI9dGVtcH1mb3IodmFyIHJMYXN0PWEscj1iLHNMYXN0PXRoaXMuZmllbGQuT25lLHM9dGhpcy5maWVsZC5aZXJvLHRMYXN0PXRoaXMuZmllbGQuWmVybyx0PXRoaXMuZmllbGQuT25lO3IuRGVncmVlPj1NYXRoLmZsb29yKFIvMik7KXt2YXIgckxhc3RMYXN0PXJMYXN0LHNMYXN0TGFzdD1zTGFzdCx0TGFzdExhc3Q9dExhc3Q7aWYockxhc3Q9cixzTGFzdD1zLHRMYXN0PXQsckxhc3QuWmVybyl0aHJvd1wicl97aS0xfSB3YXMgemVyb1wiO3I9ckxhc3RMYXN0O2Zvcih2YXIgcT10aGlzLmZpZWxkLlplcm8sZGVub21pbmF0b3JMZWFkaW5nVGVybT1yTGFzdC5nZXRDb2VmZmljaWVudChyTGFzdC5EZWdyZWUpLGRsdEludmVyc2U9dGhpcy5maWVsZC5pbnZlcnNlKGRlbm9taW5hdG9yTGVhZGluZ1Rlcm0pO3IuRGVncmVlPj1yTGFzdC5EZWdyZWUmJiFyLlplcm87KXt2YXIgZGVncmVlRGlmZj1yLkRlZ3JlZS1yTGFzdC5EZWdyZWUsc2NhbGU9dGhpcy5maWVsZC5tdWx0aXBseShyLmdldENvZWZmaWNpZW50KHIuRGVncmVlKSxkbHRJbnZlcnNlKTtxPXEuYWRkT3JTdWJ0cmFjdCh0aGlzLmZpZWxkLmJ1aWxkTW9ub21pYWwoZGVncmVlRGlmZixzY2FsZSkpLHI9ci5hZGRPclN1YnRyYWN0KHJMYXN0Lm11bHRpcGx5QnlNb25vbWlhbChkZWdyZWVEaWZmLHNjYWxlKSl9cz1xLm11bHRpcGx5MShzTGFzdCkuYWRkT3JTdWJ0cmFjdChzTGFzdExhc3QpLHQ9cS5tdWx0aXBseTEodExhc3QpLmFkZE9yU3VidHJhY3QodExhc3RMYXN0KX12YXIgc2lnbWFUaWxkZUF0WmVybz10LmdldENvZWZmaWNpZW50KDApO2lmKDA9PXNpZ21hVGlsZGVBdFplcm8pdGhyb3dcIlJlZWRTb2xvbW9uRXhjZXB0aW9uIHNpZ21hVGlsZGUoMCkgd2FzIHplcm9cIjt2YXIgaW52ZXJzZT10aGlzLmZpZWxkLmludmVyc2Uoc2lnbWFUaWxkZUF0WmVybyksc2lnbWE9dC5tdWx0aXBseTIoaW52ZXJzZSksb21lZ2E9ci5tdWx0aXBseTIoaW52ZXJzZSk7cmV0dXJuIG5ldyBBcnJheShzaWdtYSxvbWVnYSl9LHRoaXMuZmluZEVycm9yTG9jYXRpb25zPWZ1bmN0aW9uKGVycm9yTG9jYXRvcil7dmFyIG51bUVycm9ycz1lcnJvckxvY2F0b3IuRGVncmVlO2lmKDE9PW51bUVycm9ycylyZXR1cm4gbmV3IEFycmF5KGVycm9yTG9jYXRvci5nZXRDb2VmZmljaWVudCgxKSk7Zm9yKHZhciByZXN1bHQ9bmV3IEFycmF5KG51bUVycm9ycyksZT0wLGk9MTsyNTY+aSYmbnVtRXJyb3JzPmU7aSsrKTA9PWVycm9yTG9jYXRvci5ldmFsdWF0ZUF0KGkpJiYocmVzdWx0W2VdPXRoaXMuZmllbGQuaW52ZXJzZShpKSxlKyspO2lmKGUhPW51bUVycm9ycyl0aHJvd1wiRXJyb3IgbG9jYXRvciBkZWdyZWUgZG9lcyBub3QgbWF0Y2ggbnVtYmVyIG9mIHJvb3RzXCI7cmV0dXJuIHJlc3VsdH0sdGhpcy5maW5kRXJyb3JNYWduaXR1ZGVzPWZ1bmN0aW9uKGVycm9yRXZhbHVhdG9yLGVycm9yTG9jYXRpb25zLGRhdGFNYXRyaXgpe2Zvcih2YXIgcz1lcnJvckxvY2F0aW9ucy5sZW5ndGgscmVzdWx0PW5ldyBBcnJheShzKSxpPTA7cz5pO2krKyl7Zm9yKHZhciB4aUludmVyc2U9dGhpcy5maWVsZC5pbnZlcnNlKGVycm9yTG9jYXRpb25zW2ldKSxkZW5vbWluYXRvcj0xLGo9MDtzPmo7aisrKWkhPWomJihkZW5vbWluYXRvcj10aGlzLmZpZWxkLm11bHRpcGx5KGRlbm9taW5hdG9yLEdGMjU2LmFkZE9yU3VidHJhY3QoMSx0aGlzLmZpZWxkLm11bHRpcGx5KGVycm9yTG9jYXRpb25zW2pdLHhpSW52ZXJzZSkpKSk7cmVzdWx0W2ldPXRoaXMuZmllbGQubXVsdGlwbHkoZXJyb3JFdmFsdWF0b3IuZXZhbHVhdGVBdCh4aUludmVyc2UpLHRoaXMuZmllbGQuaW52ZXJzZShkZW5vbWluYXRvcikpLGRhdGFNYXRyaXgmJihyZXN1bHRbaV09dGhpcy5maWVsZC5tdWx0aXBseShyZXN1bHRbaV0seGlJbnZlcnNlKSl9cmV0dXJuIHJlc3VsdH19ZnVuY3Rpb24gR0YyNTZQb2x5KGZpZWxkLGNvZWZmaWNpZW50cyl7aWYobnVsbD09Y29lZmZpY2llbnRzfHwwPT1jb2VmZmljaWVudHMubGVuZ3RoKXRocm93XCJTeXN0ZW0uQXJndW1lbnRFeGNlcHRpb25cIjt0aGlzLmZpZWxkPWZpZWxkO3ZhciBjb2VmZmljaWVudHNMZW5ndGg9Y29lZmZpY2llbnRzLmxlbmd0aDtpZihjb2VmZmljaWVudHNMZW5ndGg+MSYmMD09Y29lZmZpY2llbnRzWzBdKXtmb3IodmFyIGZpcnN0Tm9uWmVybz0xO2NvZWZmaWNpZW50c0xlbmd0aD5maXJzdE5vblplcm8mJjA9PWNvZWZmaWNpZW50c1tmaXJzdE5vblplcm9dOylmaXJzdE5vblplcm8rKztpZihmaXJzdE5vblplcm89PWNvZWZmaWNpZW50c0xlbmd0aCl0aGlzLmNvZWZmaWNpZW50cz1maWVsZC5aZXJvLmNvZWZmaWNpZW50cztlbHNle3RoaXMuY29lZmZpY2llbnRzPW5ldyBBcnJheShjb2VmZmljaWVudHNMZW5ndGgtZmlyc3ROb25aZXJvKTtmb3IodmFyIGk9MDtpPHRoaXMuY29lZmZpY2llbnRzLmxlbmd0aDtpKyspdGhpcy5jb2VmZmljaWVudHNbaV09MDtmb3IodmFyIGNpPTA7Y2k8dGhpcy5jb2VmZmljaWVudHMubGVuZ3RoO2NpKyspdGhpcy5jb2VmZmljaWVudHNbY2ldPWNvZWZmaWNpZW50c1tmaXJzdE5vblplcm8rY2ldfX1lbHNlIHRoaXMuY29lZmZpY2llbnRzPWNvZWZmaWNpZW50czt0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJaZXJvXCIsZnVuY3Rpb24oKXtyZXR1cm4gMD09dGhpcy5jb2VmZmljaWVudHNbMF19KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJEZWdyZWVcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvZWZmaWNpZW50cy5sZW5ndGgtMX0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkNvZWZmaWNpZW50c1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29lZmZpY2llbnRzfSksdGhpcy5nZXRDb2VmZmljaWVudD1mdW5jdGlvbihkZWdyZWUpe3JldHVybiB0aGlzLmNvZWZmaWNpZW50c1t0aGlzLmNvZWZmaWNpZW50cy5sZW5ndGgtMS1kZWdyZWVdfSx0aGlzLmV2YWx1YXRlQXQ9ZnVuY3Rpb24oYSl7aWYoMD09YSlyZXR1cm4gdGhpcy5nZXRDb2VmZmljaWVudCgwKTt2YXIgc2l6ZT10aGlzLmNvZWZmaWNpZW50cy5sZW5ndGg7aWYoMT09YSl7Zm9yKHZhciByZXN1bHQ9MCxpPTA7c2l6ZT5pO2krKylyZXN1bHQ9R0YyNTYuYWRkT3JTdWJ0cmFjdChyZXN1bHQsdGhpcy5jb2VmZmljaWVudHNbaV0pO3JldHVybiByZXN1bHR9Zm9yKHZhciByZXN1bHQyPXRoaXMuY29lZmZpY2llbnRzWzBdLGk9MTtzaXplPmk7aSsrKXJlc3VsdDI9R0YyNTYuYWRkT3JTdWJ0cmFjdCh0aGlzLmZpZWxkLm11bHRpcGx5KGEscmVzdWx0MiksdGhpcy5jb2VmZmljaWVudHNbaV0pO3JldHVybiByZXN1bHQyfSx0aGlzLmFkZE9yU3VidHJhY3Q9ZnVuY3Rpb24ob3RoZXIpe2lmKHRoaXMuZmllbGQhPW90aGVyLmZpZWxkKXRocm93XCJHRjI1NlBvbHlzIGRvIG5vdCBoYXZlIHNhbWUgR0YyNTYgZmllbGRcIjtpZih0aGlzLlplcm8pcmV0dXJuIG90aGVyO2lmKG90aGVyLlplcm8pcmV0dXJuIHRoaXM7dmFyIHNtYWxsZXJDb2VmZmljaWVudHM9dGhpcy5jb2VmZmljaWVudHMsbGFyZ2VyQ29lZmZpY2llbnRzPW90aGVyLmNvZWZmaWNpZW50cztpZihzbWFsbGVyQ29lZmZpY2llbnRzLmxlbmd0aD5sYXJnZXJDb2VmZmljaWVudHMubGVuZ3RoKXt2YXIgdGVtcD1zbWFsbGVyQ29lZmZpY2llbnRzO3NtYWxsZXJDb2VmZmljaWVudHM9bGFyZ2VyQ29lZmZpY2llbnRzLGxhcmdlckNvZWZmaWNpZW50cz10ZW1wfWZvcih2YXIgc3VtRGlmZj1uZXcgQXJyYXkobGFyZ2VyQ29lZmZpY2llbnRzLmxlbmd0aCksbGVuZ3RoRGlmZj1sYXJnZXJDb2VmZmljaWVudHMubGVuZ3RoLXNtYWxsZXJDb2VmZmljaWVudHMubGVuZ3RoLGNpPTA7bGVuZ3RoRGlmZj5jaTtjaSsrKXN1bURpZmZbY2ldPWxhcmdlckNvZWZmaWNpZW50c1tjaV07Zm9yKHZhciBpPWxlbmd0aERpZmY7aTxsYXJnZXJDb2VmZmljaWVudHMubGVuZ3RoO2krKylzdW1EaWZmW2ldPUdGMjU2LmFkZE9yU3VidHJhY3Qoc21hbGxlckNvZWZmaWNpZW50c1tpLWxlbmd0aERpZmZdLGxhcmdlckNvZWZmaWNpZW50c1tpXSk7cmV0dXJuIG5ldyBHRjI1NlBvbHkoZmllbGQsc3VtRGlmZil9LHRoaXMubXVsdGlwbHkxPWZ1bmN0aW9uKG90aGVyKXtpZih0aGlzLmZpZWxkIT1vdGhlci5maWVsZCl0aHJvd1wiR0YyNTZQb2x5cyBkbyBub3QgaGF2ZSBzYW1lIEdGMjU2IGZpZWxkXCI7aWYodGhpcy5aZXJvfHxvdGhlci5aZXJvKXJldHVybiB0aGlzLmZpZWxkLlplcm87Zm9yKHZhciBhQ29lZmZpY2llbnRzPXRoaXMuY29lZmZpY2llbnRzLGFMZW5ndGg9YUNvZWZmaWNpZW50cy5sZW5ndGgsYkNvZWZmaWNpZW50cz1vdGhlci5jb2VmZmljaWVudHMsYkxlbmd0aD1iQ29lZmZpY2llbnRzLmxlbmd0aCxwcm9kdWN0PW5ldyBBcnJheShhTGVuZ3RoK2JMZW5ndGgtMSksaT0wO2FMZW5ndGg+aTtpKyspZm9yKHZhciBhQ29lZmY9YUNvZWZmaWNpZW50c1tpXSxqPTA7Ykxlbmd0aD5qO2orKylwcm9kdWN0W2kral09R0YyNTYuYWRkT3JTdWJ0cmFjdChwcm9kdWN0W2kral0sdGhpcy5maWVsZC5tdWx0aXBseShhQ29lZmYsYkNvZWZmaWNpZW50c1tqXSkpO3JldHVybiBuZXcgR0YyNTZQb2x5KHRoaXMuZmllbGQscHJvZHVjdCl9LHRoaXMubXVsdGlwbHkyPWZ1bmN0aW9uKHNjYWxhcil7aWYoMD09c2NhbGFyKXJldHVybiB0aGlzLmZpZWxkLlplcm87aWYoMT09c2NhbGFyKXJldHVybiB0aGlzO2Zvcih2YXIgc2l6ZT10aGlzLmNvZWZmaWNpZW50cy5sZW5ndGgscHJvZHVjdD1uZXcgQXJyYXkoc2l6ZSksaT0wO3NpemU+aTtpKyspcHJvZHVjdFtpXT10aGlzLmZpZWxkLm11bHRpcGx5KHRoaXMuY29lZmZpY2llbnRzW2ldLHNjYWxhcik7cmV0dXJuIG5ldyBHRjI1NlBvbHkodGhpcy5maWVsZCxwcm9kdWN0KX0sdGhpcy5tdWx0aXBseUJ5TW9ub21pYWw9ZnVuY3Rpb24oZGVncmVlLGNvZWZmaWNpZW50KXtpZigwPmRlZ3JlZSl0aHJvd1wiU3lzdGVtLkFyZ3VtZW50RXhjZXB0aW9uXCI7aWYoMD09Y29lZmZpY2llbnQpcmV0dXJuIHRoaXMuZmllbGQuWmVybztmb3IodmFyIHNpemU9dGhpcy5jb2VmZmljaWVudHMubGVuZ3RoLHByb2R1Y3Q9bmV3IEFycmF5KHNpemUrZGVncmVlKSxpPTA7aTxwcm9kdWN0Lmxlbmd0aDtpKyspcHJvZHVjdFtpXT0wO2Zvcih2YXIgaT0wO3NpemU+aTtpKyspcHJvZHVjdFtpXT10aGlzLmZpZWxkLm11bHRpcGx5KHRoaXMuY29lZmZpY2llbnRzW2ldLGNvZWZmaWNpZW50KTtyZXR1cm4gbmV3IEdGMjU2UG9seSh0aGlzLmZpZWxkLHByb2R1Y3QpfSx0aGlzLmRpdmlkZT1mdW5jdGlvbihvdGhlcil7aWYodGhpcy5maWVsZCE9b3RoZXIuZmllbGQpdGhyb3dcIkdGMjU2UG9seXMgZG8gbm90IGhhdmUgc2FtZSBHRjI1NiBmaWVsZFwiO2lmKG90aGVyLlplcm8pdGhyb3dcIkRpdmlkZSBieSAwXCI7Zm9yKHZhciBxdW90aWVudD10aGlzLmZpZWxkLlplcm8scmVtYWluZGVyPXRoaXMsZGVub21pbmF0b3JMZWFkaW5nVGVybT1vdGhlci5nZXRDb2VmZmljaWVudChvdGhlci5EZWdyZWUpLGludmVyc2VEZW5vbWluYXRvckxlYWRpbmdUZXJtPXRoaXMuZmllbGQuaW52ZXJzZShkZW5vbWluYXRvckxlYWRpbmdUZXJtKTtyZW1haW5kZXIuRGVncmVlPj1vdGhlci5EZWdyZWUmJiFyZW1haW5kZXIuWmVybzspe1xyXG4gICAgdmFyIGRlZ3JlZURpZmZlcmVuY2U9cmVtYWluZGVyLkRlZ3JlZS1vdGhlci5EZWdyZWUsc2NhbGU9dGhpcy5maWVsZC5tdWx0aXBseShyZW1haW5kZXIuZ2V0Q29lZmZpY2llbnQocmVtYWluZGVyLkRlZ3JlZSksaW52ZXJzZURlbm9taW5hdG9yTGVhZGluZ1Rlcm0pLHRlcm09b3RoZXIubXVsdGlwbHlCeU1vbm9taWFsKGRlZ3JlZURpZmZlcmVuY2Usc2NhbGUpLGl0ZXJhdGlvblF1b3RpZW50PXRoaXMuZmllbGQuYnVpbGRNb25vbWlhbChkZWdyZWVEaWZmZXJlbmNlLHNjYWxlKTtxdW90aWVudD1xdW90aWVudC5hZGRPclN1YnRyYWN0KGl0ZXJhdGlvblF1b3RpZW50KSxyZW1haW5kZXI9cmVtYWluZGVyLmFkZE9yU3VidHJhY3QodGVybSl9cmV0dXJuIG5ldyBBcnJheShxdW90aWVudCxyZW1haW5kZXIpfX1mdW5jdGlvbiBHRjI1NihwcmltaXRpdmUpe3RoaXMuZXhwVGFibGU9bmV3IEFycmF5KDI1NiksdGhpcy5sb2dUYWJsZT1uZXcgQXJyYXkoMjU2KTtmb3IodmFyIHg9MSxpPTA7MjU2Pmk7aSsrKXRoaXMuZXhwVGFibGVbaV09eCx4PDw9MSx4Pj0yNTYmJih4Xj1wcmltaXRpdmUpO2Zvcih2YXIgaT0wOzI1NT5pO2krKyl0aGlzLmxvZ1RhYmxlW3RoaXMuZXhwVGFibGVbaV1dPWk7dmFyIGF0MD1uZXcgQXJyYXkoMSk7YXQwWzBdPTAsdGhpcy56ZXJvPW5ldyBHRjI1NlBvbHkodGhpcyxuZXcgQXJyYXkoYXQwKSk7dmFyIGF0MT1uZXcgQXJyYXkoMSk7YXQxWzBdPTEsdGhpcy5vbmU9bmV3IEdGMjU2UG9seSh0aGlzLG5ldyBBcnJheShhdDEpKSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJaZXJvXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy56ZXJvfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiT25lXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5vbmV9KSx0aGlzLmJ1aWxkTW9ub21pYWw9ZnVuY3Rpb24oZGVncmVlLGNvZWZmaWNpZW50KXtpZigwPmRlZ3JlZSl0aHJvd1wiU3lzdGVtLkFyZ3VtZW50RXhjZXB0aW9uXCI7aWYoMD09Y29lZmZpY2llbnQpcmV0dXJuIHplcm87Zm9yKHZhciBjb2VmZmljaWVudHM9bmV3IEFycmF5KGRlZ3JlZSsxKSxpPTA7aTxjb2VmZmljaWVudHMubGVuZ3RoO2krKyljb2VmZmljaWVudHNbaV09MDtyZXR1cm4gY29lZmZpY2llbnRzWzBdPWNvZWZmaWNpZW50LG5ldyBHRjI1NlBvbHkodGhpcyxjb2VmZmljaWVudHMpfSx0aGlzLmV4cD1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5leHBUYWJsZVthXX0sdGhpcy5sb2c9ZnVuY3Rpb24oYSl7aWYoMD09YSl0aHJvd1wiU3lzdGVtLkFyZ3VtZW50RXhjZXB0aW9uXCI7cmV0dXJuIHRoaXMubG9nVGFibGVbYV19LHRoaXMuaW52ZXJzZT1mdW5jdGlvbihhKXtpZigwPT1hKXRocm93XCJTeXN0ZW0uQXJpdGhtZXRpY0V4Y2VwdGlvblwiO3JldHVybiB0aGlzLmV4cFRhYmxlWzI1NS10aGlzLmxvZ1RhYmxlW2FdXX0sdGhpcy5tdWx0aXBseT1mdW5jdGlvbihhLGIpe3JldHVybiAwPT1hfHwwPT1iPzA6MT09YT9iOjE9PWI/YTp0aGlzLmV4cFRhYmxlWyh0aGlzLmxvZ1RhYmxlW2FdK3RoaXMubG9nVGFibGVbYl0pJTI1NV19fWZ1bmN0aW9uIFVSU2hpZnQobnVtYmVyLGJpdHMpe3JldHVybiBudW1iZXI+PTA/bnVtYmVyPj5iaXRzOihudW1iZXI+PmJpdHMpKygyPDx+Yml0cyl9ZnVuY3Rpb24gRmluZGVyUGF0dGVybihwb3NYLHBvc1ksZXN0aW1hdGVkTW9kdWxlU2l6ZSl7dGhpcy54PXBvc1gsdGhpcy55PXBvc1ksdGhpcy5jb3VudD0xLHRoaXMuZXN0aW1hdGVkTW9kdWxlU2l6ZT1lc3RpbWF0ZWRNb2R1bGVTaXplLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkVzdGltYXRlZE1vZHVsZVNpemVcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmVzdGltYXRlZE1vZHVsZVNpemV9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJDb3VudFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY291bnR9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJYXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy54fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiWVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueX0pLHRoaXMuaW5jcmVtZW50Q291bnQ9ZnVuY3Rpb24oKXt0aGlzLmNvdW50Kyt9LHRoaXMuYWJvdXRFcXVhbHM9ZnVuY3Rpb24obW9kdWxlU2l6ZSxpLGope2lmKE1hdGguYWJzKGktdGhpcy55KTw9bW9kdWxlU2l6ZSYmTWF0aC5hYnMoai10aGlzLngpPD1tb2R1bGVTaXplKXt2YXIgbW9kdWxlU2l6ZURpZmY9TWF0aC5hYnMobW9kdWxlU2l6ZS10aGlzLmVzdGltYXRlZE1vZHVsZVNpemUpO3JldHVybiAxPj1tb2R1bGVTaXplRGlmZnx8bW9kdWxlU2l6ZURpZmYvdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplPD0xfXJldHVybiExfX1mdW5jdGlvbiBGaW5kZXJQYXR0ZXJuSW5mbyhwYXR0ZXJuQ2VudGVycyl7dGhpcy5ib3R0b21MZWZ0PXBhdHRlcm5DZW50ZXJzWzBdLHRoaXMudG9wTGVmdD1wYXR0ZXJuQ2VudGVyc1sxXSx0aGlzLnRvcFJpZ2h0PXBhdHRlcm5DZW50ZXJzWzJdLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkJvdHRvbUxlZnRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmJvdHRvbUxlZnR9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJUb3BMZWZ0XCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50b3BMZWZ0fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiVG9wUmlnaHRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLnRvcFJpZ2h0fSl9ZnVuY3Rpb24gRmluZGVyUGF0dGVybkZpbmRlcigpe3RoaXMuaW1hZ2U9bnVsbCx0aGlzLnBvc3NpYmxlQ2VudGVycz1bXSx0aGlzLmhhc1NraXBwZWQ9ITEsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudD1uZXcgQXJyYXkoMCwwLDAsMCwwKSx0aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2s9bnVsbCx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJDcm9zc0NoZWNrU3RhdGVDb3VudFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnRbMF09MCx0aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50WzFdPTAsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudFsyXT0wLHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnRbM109MCx0aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50WzRdPTAsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudH0pLHRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3M9ZnVuY3Rpb24oc3RhdGVDb3VudCl7Zm9yKHZhciB0b3RhbE1vZHVsZVNpemU9MCxpPTA7NT5pO2krKyl7dmFyIGNvdW50PXN0YXRlQ291bnRbaV07aWYoMD09Y291bnQpcmV0dXJuITE7dG90YWxNb2R1bGVTaXplKz1jb3VudH1pZig3PnRvdGFsTW9kdWxlU2l6ZSlyZXR1cm4hMTt2YXIgbW9kdWxlU2l6ZT1NYXRoLmZsb29yKCh0b3RhbE1vZHVsZVNpemU8PElOVEVHRVJfTUFUSF9TSElGVCkvNyksbWF4VmFyaWFuY2U9TWF0aC5mbG9vcihtb2R1bGVTaXplLzIpO3JldHVybiBNYXRoLmFicyhtb2R1bGVTaXplLShzdGF0ZUNvdW50WzBdPDxJTlRFR0VSX01BVEhfU0hJRlQpKTxtYXhWYXJpYW5jZSYmTWF0aC5hYnMobW9kdWxlU2l6ZS0oc3RhdGVDb3VudFsxXTw8SU5URUdFUl9NQVRIX1NISUZUKSk8bWF4VmFyaWFuY2UmJk1hdGguYWJzKDMqbW9kdWxlU2l6ZS0oc3RhdGVDb3VudFsyXTw8SU5URUdFUl9NQVRIX1NISUZUKSk8MyptYXhWYXJpYW5jZSYmTWF0aC5hYnMobW9kdWxlU2l6ZS0oc3RhdGVDb3VudFszXTw8SU5URUdFUl9NQVRIX1NISUZUKSk8bWF4VmFyaWFuY2UmJk1hdGguYWJzKG1vZHVsZVNpemUtKHN0YXRlQ291bnRbNF08PElOVEVHRVJfTUFUSF9TSElGVCkpPG1heFZhcmlhbmNlfSx0aGlzLmNlbnRlckZyb21FbmQ9ZnVuY3Rpb24oc3RhdGVDb3VudCxlbmQpe3JldHVybiBlbmQtc3RhdGVDb3VudFs0XS1zdGF0ZUNvdW50WzNdLXN0YXRlQ291bnRbMl0vMn0sdGhpcy5jcm9zc0NoZWNrVmVydGljYWw9ZnVuY3Rpb24oc3RhcnRJLGNlbnRlckosbWF4Q291bnQsb3JpZ2luYWxTdGF0ZUNvdW50VG90YWwpe2Zvcih2YXIgaW1hZ2U9dGhpcy5pbWFnZSxtYXhJPXFyY29kZS5oZWlnaHQsc3RhdGVDb3VudD10aGlzLkNyb3NzQ2hlY2tTdGF0ZUNvdW50LGk9c3RhcnRJO2k+PTAmJmltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdOylzdGF0ZUNvdW50WzJdKyssaS0tO2lmKDA+aSlyZXR1cm4gTmFOO2Zvcig7aT49MCYmIWltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzFdPD1tYXhDb3VudDspc3RhdGVDb3VudFsxXSsrLGktLTtpZigwPml8fHN0YXRlQ291bnRbMV0+bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoO2k+PTAmJmltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzBdPD1tYXhDb3VudDspc3RhdGVDb3VudFswXSsrLGktLTtpZihzdGF0ZUNvdW50WzBdPm1heENvdW50KXJldHVybiBOYU47Zm9yKGk9c3RhcnRJKzE7bWF4ST5pJiZpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXTspc3RhdGVDb3VudFsyXSsrLGkrKztpZihpPT1tYXhJKXJldHVybiBOYU47Zm9yKDttYXhJPmkmJiFpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFszXTxtYXhDb3VudDspc3RhdGVDb3VudFszXSsrLGkrKztpZihpPT1tYXhJfHxzdGF0ZUNvdW50WzNdPj1tYXhDb3VudClyZXR1cm4gTmFOO2Zvcig7bWF4ST5pJiZpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFs0XTxtYXhDb3VudDspc3RhdGVDb3VudFs0XSsrLGkrKztpZihzdGF0ZUNvdW50WzRdPj1tYXhDb3VudClyZXR1cm4gTmFOO3ZhciBzdGF0ZUNvdW50VG90YWw9c3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl0rc3RhdGVDb3VudFszXStzdGF0ZUNvdW50WzRdO3JldHVybiA1Kk1hdGguYWJzKHN0YXRlQ291bnRUb3RhbC1vcmlnaW5hbFN0YXRlQ291bnRUb3RhbCk+PTIqb3JpZ2luYWxTdGF0ZUNvdW50VG90YWw/TmFOOnRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3Moc3RhdGVDb3VudCk/dGhpcy5jZW50ZXJGcm9tRW5kKHN0YXRlQ291bnQsaSk6TmFOfSx0aGlzLmNyb3NzQ2hlY2tIb3Jpem9udGFsPWZ1bmN0aW9uKHN0YXJ0SixjZW50ZXJJLG1heENvdW50LG9yaWdpbmFsU3RhdGVDb3VudFRvdGFsKXtmb3IodmFyIGltYWdlPXRoaXMuaW1hZ2UsbWF4Sj1xcmNvZGUud2lkdGgsc3RhdGVDb3VudD10aGlzLkNyb3NzQ2hlY2tTdGF0ZUNvdW50LGo9c3RhcnRKO2o+PTAmJmltYWdlW2orY2VudGVySSpxcmNvZGUud2lkdGhdOylzdGF0ZUNvdW50WzJdKyssai0tO2lmKDA+ailyZXR1cm4gTmFOO2Zvcig7aj49MCYmIWltYWdlW2orY2VudGVySSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzFdPD1tYXhDb3VudDspc3RhdGVDb3VudFsxXSsrLGotLTtpZigwPmp8fHN0YXRlQ291bnRbMV0+bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoO2o+PTAmJmltYWdlW2orY2VudGVySSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzBdPD1tYXhDb3VudDspc3RhdGVDb3VudFswXSsrLGotLTtpZihzdGF0ZUNvdW50WzBdPm1heENvdW50KXJldHVybiBOYU47Zm9yKGo9c3RhcnRKKzE7bWF4Sj5qJiZpbWFnZVtqK2NlbnRlckkqcXJjb2RlLndpZHRoXTspc3RhdGVDb3VudFsyXSsrLGorKztpZihqPT1tYXhKKXJldHVybiBOYU47Zm9yKDttYXhKPmomJiFpbWFnZVtqK2NlbnRlckkqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFszXTxtYXhDb3VudDspc3RhdGVDb3VudFszXSsrLGorKztpZihqPT1tYXhKfHxzdGF0ZUNvdW50WzNdPj1tYXhDb3VudClyZXR1cm4gTmFOO2Zvcig7bWF4Sj5qJiZpbWFnZVtqK2NlbnRlckkqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFs0XTxtYXhDb3VudDspc3RhdGVDb3VudFs0XSsrLGorKztpZihzdGF0ZUNvdW50WzRdPj1tYXhDb3VudClyZXR1cm4gTmFOO3ZhciBzdGF0ZUNvdW50VG90YWw9c3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl0rc3RhdGVDb3VudFszXStzdGF0ZUNvdW50WzRdO3JldHVybiA1Kk1hdGguYWJzKHN0YXRlQ291bnRUb3RhbC1vcmlnaW5hbFN0YXRlQ291bnRUb3RhbCk+PW9yaWdpbmFsU3RhdGVDb3VudFRvdGFsP05hTjp0aGlzLmZvdW5kUGF0dGVybkNyb3NzKHN0YXRlQ291bnQpP3RoaXMuY2VudGVyRnJvbUVuZChzdGF0ZUNvdW50LGopOk5hTn0sdGhpcy5oYW5kbGVQb3NzaWJsZUNlbnRlcj1mdW5jdGlvbihzdGF0ZUNvdW50LGksail7dmFyIHN0YXRlQ291bnRUb3RhbD1zdGF0ZUNvdW50WzBdK3N0YXRlQ291bnRbMV0rc3RhdGVDb3VudFsyXStzdGF0ZUNvdW50WzNdK3N0YXRlQ291bnRbNF0sY2VudGVySj10aGlzLmNlbnRlckZyb21FbmQoc3RhdGVDb3VudCxqKSxjZW50ZXJJPXRoaXMuY3Jvc3NDaGVja1ZlcnRpY2FsKGksTWF0aC5mbG9vcihjZW50ZXJKKSxzdGF0ZUNvdW50WzJdLHN0YXRlQ291bnRUb3RhbCk7aWYoIWlzTmFOKGNlbnRlckkpJiYoY2VudGVySj10aGlzLmNyb3NzQ2hlY2tIb3Jpem9udGFsKE1hdGguZmxvb3IoY2VudGVySiksTWF0aC5mbG9vcihjZW50ZXJJKSxzdGF0ZUNvdW50WzJdLHN0YXRlQ291bnRUb3RhbCksIWlzTmFOKGNlbnRlckopKSl7Zm9yKHZhciBlc3RpbWF0ZWRNb2R1bGVTaXplPXN0YXRlQ291bnRUb3RhbC83LGZvdW5kPSExLG1heD10aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGgsaW5kZXg9MDttYXg+aW5kZXg7aW5kZXgrKyl7dmFyIGNlbnRlcj10aGlzLnBvc3NpYmxlQ2VudGVyc1tpbmRleF07aWYoY2VudGVyLmFib3V0RXF1YWxzKGVzdGltYXRlZE1vZHVsZVNpemUsY2VudGVySSxjZW50ZXJKKSl7Y2VudGVyLmluY3JlbWVudENvdW50KCksZm91bmQ9ITA7YnJlYWt9fWlmKCFmb3VuZCl7dmFyIHBvaW50PW5ldyBGaW5kZXJQYXR0ZXJuKGNlbnRlckosY2VudGVySSxlc3RpbWF0ZWRNb2R1bGVTaXplKTt0aGlzLnBvc3NpYmxlQ2VudGVycy5wdXNoKHBvaW50KSxudWxsIT10aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2smJnRoaXMucmVzdWx0UG9pbnRDYWxsYmFjay5mb3VuZFBvc3NpYmxlUmVzdWx0UG9pbnQocG9pbnQpfXJldHVybiEwfXJldHVybiExfSx0aGlzLnNlbGVjdEJlc3RQYXR0ZXJucz1mdW5jdGlvbigpe3ZhciBzdGFydFNpemU9dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoO2lmKDM+c3RhcnRTaXplKXRocm93XCJDb3VsZG4ndCBmaW5kIGVub3VnaCBmaW5kZXIgcGF0dGVybnNcIjtpZihzdGFydFNpemU+Myl7Zm9yKHZhciB0b3RhbE1vZHVsZVNpemU9MCxpPTA7c3RhcnRTaXplPmk7aSsrKXRvdGFsTW9kdWxlU2l6ZSs9dGhpcy5wb3NzaWJsZUNlbnRlcnNbaV0uRXN0aW1hdGVkTW9kdWxlU2l6ZTtmb3IodmFyIGF2ZXJhZ2U9dG90YWxNb2R1bGVTaXplL3N0YXJ0U2l6ZSxpPTA7aTx0aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGgmJnRoaXMucG9zc2libGVDZW50ZXJzLmxlbmd0aD4zO2krKyl7dmFyIHBhdHRlcm49dGhpcy5wb3NzaWJsZUNlbnRlcnNbaV07TWF0aC5hYnMocGF0dGVybi5Fc3RpbWF0ZWRNb2R1bGVTaXplLWF2ZXJhZ2UpPi4yKmF2ZXJhZ2UmJih0aGlzLnBvc3NpYmxlQ2VudGVycy5yZW1vdmUoaSksaS0tKX19cmV0dXJuIHRoaXMucG9zc2libGVDZW50ZXJzLkNvdW50PjMsbmV3IEFycmF5KHRoaXMucG9zc2libGVDZW50ZXJzWzBdLHRoaXMucG9zc2libGVDZW50ZXJzWzFdLHRoaXMucG9zc2libGVDZW50ZXJzWzJdKX0sdGhpcy5maW5kUm93U2tpcD1mdW5jdGlvbigpe3ZhciBtYXg9dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoO2lmKDE+PW1heClyZXR1cm4gMDtmb3IodmFyIGZpcnN0Q29uZmlybWVkQ2VudGVyPW51bGwsaT0wO21heD5pO2krKyl7dmFyIGNlbnRlcj10aGlzLnBvc3NpYmxlQ2VudGVyc1tpXTtpZihjZW50ZXIuQ291bnQ+PUNFTlRFUl9RVU9SVU0pe2lmKG51bGwhPWZpcnN0Q29uZmlybWVkQ2VudGVyKXJldHVybiB0aGlzLmhhc1NraXBwZWQ9ITAsTWF0aC5mbG9vcigoTWF0aC5hYnMoZmlyc3RDb25maXJtZWRDZW50ZXIuWC1jZW50ZXIuWCktTWF0aC5hYnMoZmlyc3RDb25maXJtZWRDZW50ZXIuWS1jZW50ZXIuWSkpLzIpO2ZpcnN0Q29uZmlybWVkQ2VudGVyPWNlbnRlcn19cmV0dXJuIDB9LHRoaXMuaGF2ZU11bHRpcGx5Q29uZmlybWVkQ2VudGVycz1mdW5jdGlvbigpe2Zvcih2YXIgY29uZmlybWVkQ291bnQ9MCx0b3RhbE1vZHVsZVNpemU9MCxtYXg9dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoLGk9MDttYXg+aTtpKyspe3ZhciBwYXR0ZXJuPXRoaXMucG9zc2libGVDZW50ZXJzW2ldO3BhdHRlcm4uQ291bnQ+PUNFTlRFUl9RVU9SVU0mJihjb25maXJtZWRDb3VudCsrLHRvdGFsTW9kdWxlU2l6ZSs9cGF0dGVybi5Fc3RpbWF0ZWRNb2R1bGVTaXplKX1pZigzPmNvbmZpcm1lZENvdW50KXJldHVybiExO2Zvcih2YXIgYXZlcmFnZT10b3RhbE1vZHVsZVNpemUvbWF4LHRvdGFsRGV2aWF0aW9uPTAsaT0wO21heD5pO2krKylwYXR0ZXJuPXRoaXMucG9zc2libGVDZW50ZXJzW2ldLHRvdGFsRGV2aWF0aW9uKz1NYXRoLmFicyhwYXR0ZXJuLkVzdGltYXRlZE1vZHVsZVNpemUtYXZlcmFnZSk7cmV0dXJuLjA1KnRvdGFsTW9kdWxlU2l6ZT49dG90YWxEZXZpYXRpb259LHRoaXMuZmluZEZpbmRlclBhdHRlcm49ZnVuY3Rpb24oaW1hZ2Upe3ZhciB0cnlIYXJkZXI9ITE7dGhpcy5pbWFnZT1pbWFnZTt2YXIgbWF4ST1xcmNvZGUuaGVpZ2h0LG1heEo9cXJjb2RlLndpZHRoLGlTa2lwPU1hdGguZmxvb3IoMyptYXhJLyg0Kk1BWF9NT0RVTEVTKSk7KE1JTl9TS0lQPmlTa2lwfHx0cnlIYXJkZXIpJiYoaVNraXA9TUlOX1NLSVApO2Zvcih2YXIgZG9uZT0hMSxzdGF0ZUNvdW50PW5ldyBBcnJheSg1KSxpPWlTa2lwLTE7bWF4ST5pJiYhZG9uZTtpKz1pU2tpcCl7c3RhdGVDb3VudFswXT0wLHN0YXRlQ291bnRbMV09MCxzdGF0ZUNvdW50WzJdPTAsc3RhdGVDb3VudFszXT0wLHN0YXRlQ291bnRbNF09MDtmb3IodmFyIGN1cnJlbnRTdGF0ZT0wLGo9MDttYXhKPmo7aisrKWlmKGltYWdlW2oraSpxcmNvZGUud2lkdGhdKTE9PSgxJmN1cnJlbnRTdGF0ZSkmJmN1cnJlbnRTdGF0ZSsrLHN0YXRlQ291bnRbY3VycmVudFN0YXRlXSsrO2Vsc2UgaWYoMD09KDEmY3VycmVudFN0YXRlKSlpZig0PT1jdXJyZW50U3RhdGUpaWYodGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KSl7dmFyIGNvbmZpcm1lZD10aGlzLmhhbmRsZVBvc3NpYmxlQ2VudGVyKHN0YXRlQ291bnQsaSxqKTtpZihjb25maXJtZWQpaWYoaVNraXA9Mix0aGlzLmhhc1NraXBwZWQpZG9uZT10aGlzLmhhdmVNdWx0aXBseUNvbmZpcm1lZENlbnRlcnMoKTtlbHNle3ZhciByb3dTa2lwPXRoaXMuZmluZFJvd1NraXAoKTtyb3dTa2lwPnN0YXRlQ291bnRbMl0mJihpKz1yb3dTa2lwLXN0YXRlQ291bnRbMl0taVNraXAsaj1tYXhKLTEpfWVsc2V7ZG8gaisrO3doaWxlKG1heEo+aiYmIWltYWdlW2oraSpxcmNvZGUud2lkdGhdKTtqLS19Y3VycmVudFN0YXRlPTAsc3RhdGVDb3VudFswXT0wLHN0YXRlQ291bnRbMV09MCxzdGF0ZUNvdW50WzJdPTAsc3RhdGVDb3VudFszXT0wLHN0YXRlQ291bnRbNF09MH1lbHNlIHN0YXRlQ291bnRbMF09c3RhdGVDb3VudFsyXSxzdGF0ZUNvdW50WzFdPXN0YXRlQ291bnRbM10sc3RhdGVDb3VudFsyXT1zdGF0ZUNvdW50WzRdLHN0YXRlQ291bnRbM109MSxzdGF0ZUNvdW50WzRdPTAsY3VycmVudFN0YXRlPTM7ZWxzZSBzdGF0ZUNvdW50WysrY3VycmVudFN0YXRlXSsrO2Vsc2Ugc3RhdGVDb3VudFtjdXJyZW50U3RhdGVdKys7aWYodGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KSl7dmFyIGNvbmZpcm1lZD10aGlzLmhhbmRsZVBvc3NpYmxlQ2VudGVyKHN0YXRlQ291bnQsaSxtYXhKKTtjb25maXJtZWQmJihpU2tpcD1zdGF0ZUNvdW50WzBdLHRoaXMuaGFzU2tpcHBlZCYmKGRvbmU9aGF2ZU11bHRpcGx5Q29uZmlybWVkQ2VudGVycygpKSl9fXZhciBwYXR0ZXJuSW5mbz10aGlzLnNlbGVjdEJlc3RQYXR0ZXJucygpO3JldHVybiBxcmNvZGUub3JkZXJCZXN0UGF0dGVybnMocGF0dGVybkluZm8pLG5ldyBGaW5kZXJQYXR0ZXJuSW5mbyhwYXR0ZXJuSW5mbyl9fWZ1bmN0aW9uIEFsaWdubWVudFBhdHRlcm4ocG9zWCxwb3NZLGVzdGltYXRlZE1vZHVsZVNpemUpe3RoaXMueD1wb3NYLHRoaXMueT1wb3NZLHRoaXMuY291bnQ9MSx0aGlzLmVzdGltYXRlZE1vZHVsZVNpemU9ZXN0aW1hdGVkTW9kdWxlU2l6ZSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJFc3RpbWF0ZWRNb2R1bGVTaXplXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQ291bnRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvdW50fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiWFwiLGZ1bmN0aW9uKCl7cmV0dXJuIE1hdGguZmxvb3IodGhpcy54KX0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIllcIixmdW5jdGlvbigpe3JldHVybiBNYXRoLmZsb29yKHRoaXMueSl9KSx0aGlzLmluY3JlbWVudENvdW50PWZ1bmN0aW9uKCl7dGhpcy5jb3VudCsrfSx0aGlzLmFib3V0RXF1YWxzPWZ1bmN0aW9uKG1vZHVsZVNpemUsaSxqKXtpZihNYXRoLmFicyhpLXRoaXMueSk8PW1vZHVsZVNpemUmJk1hdGguYWJzKGotdGhpcy54KTw9bW9kdWxlU2l6ZSl7dmFyIG1vZHVsZVNpemVEaWZmPU1hdGguYWJzKG1vZHVsZVNpemUtdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplKTtyZXR1cm4gMT49bW9kdWxlU2l6ZURpZmZ8fG1vZHVsZVNpemVEaWZmL3RoaXMuZXN0aW1hdGVkTW9kdWxlU2l6ZTw9MX1yZXR1cm4hMX19ZnVuY3Rpb24gQWxpZ25tZW50UGF0dGVybkZpbmRlcihpbWFnZSxzdGFydFgsc3RhcnRZLHdpZHRoLGhlaWdodCxtb2R1bGVTaXplLHJlc3VsdFBvaW50Q2FsbGJhY2spe3RoaXMuaW1hZ2U9aW1hZ2UsdGhpcy5wb3NzaWJsZUNlbnRlcnM9bmV3IEFycmF5LHRoaXMuc3RhcnRYPXN0YXJ0WCx0aGlzLnN0YXJ0WT1zdGFydFksdGhpcy53aWR0aD13aWR0aCx0aGlzLmhlaWdodD1oZWlnaHQsdGhpcy5tb2R1bGVTaXplPW1vZHVsZVNpemUsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudD1uZXcgQXJyYXkoMCwwLDApLHRoaXMucmVzdWx0UG9pbnRDYWxsYmFjaz1yZXN1bHRQb2ludENhbGxiYWNrLHRoaXMuY2VudGVyRnJvbUVuZD1mdW5jdGlvbihzdGF0ZUNvdW50LGVuZCl7cmV0dXJuIGVuZC1zdGF0ZUNvdW50WzJdLXN0YXRlQ291bnRbMV0vMn0sdGhpcy5mb3VuZFBhdHRlcm5Dcm9zcz1mdW5jdGlvbihzdGF0ZUNvdW50KXtmb3IodmFyIG1vZHVsZVNpemU9dGhpcy5tb2R1bGVTaXplLG1heFZhcmlhbmNlPW1vZHVsZVNpemUvMixpPTA7Mz5pO2krKylpZihNYXRoLmFicyhtb2R1bGVTaXplLXN0YXRlQ291bnRbaV0pPj1tYXhWYXJpYW5jZSlyZXR1cm4hMTtyZXR1cm4hMH0sdGhpcy5jcm9zc0NoZWNrVmVydGljYWw9ZnVuY3Rpb24oc3RhcnRJLGNlbnRlckosbWF4Q291bnQsb3JpZ2luYWxTdGF0ZUNvdW50VG90YWwpe3ZhciBpbWFnZT10aGlzLmltYWdlLG1heEk9cXJjb2RlLmhlaWdodCxzdGF0ZUNvdW50PXRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnQ7c3RhdGVDb3VudFswXT0wLHN0YXRlQ291bnRbMV09MCxzdGF0ZUNvdW50WzJdPTA7Zm9yKHZhciBpPXN0YXJ0STtpPj0wJiZpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFsxXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMV0rKyxpLS07aWYoMD5pfHxzdGF0ZUNvdW50WzFdPm1heENvdW50KXJldHVybiBOYU47Zm9yKDtpPj0wJiYhaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbMF08PW1heENvdW50OylzdGF0ZUNvdW50WzBdKyssaS0tO2lmKHN0YXRlQ291bnRbMF0+bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoaT1zdGFydEkrMTttYXhJPmkmJmltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzFdPD1tYXhDb3VudDspc3RhdGVDb3VudFsxXSsrLGkrKztpZihpPT1tYXhJfHxzdGF0ZUNvdW50WzFdPm1heENvdW50KXJldHVybiBOYU47Zm9yKDttYXhJPmkmJiFpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFsyXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMl0rKyxpKys7aWYoc3RhdGVDb3VudFsyXT5tYXhDb3VudClyZXR1cm4gTmFOO3ZhciBzdGF0ZUNvdW50VG90YWw9c3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl07cmV0dXJuIDUqTWF0aC5hYnMoc3RhdGVDb3VudFRvdGFsLW9yaWdpbmFsU3RhdGVDb3VudFRvdGFsKT49MipvcmlnaW5hbFN0YXRlQ291bnRUb3RhbD9OYU46dGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KT90aGlzLmNlbnRlckZyb21FbmQoc3RhdGVDb3VudCxpKTpOYU59LHRoaXMuaGFuZGxlUG9zc2libGVDZW50ZXI9ZnVuY3Rpb24oc3RhdGVDb3VudCxpLGope3ZhciBzdGF0ZUNvdW50VG90YWw9c3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl0sY2VudGVySj10aGlzLmNlbnRlckZyb21FbmQoc3RhdGVDb3VudCxqKSxjZW50ZXJJPXRoaXMuY3Jvc3NDaGVja1ZlcnRpY2FsKGksTWF0aC5mbG9vcihjZW50ZXJKKSwyKnN0YXRlQ291bnRbMV0sc3RhdGVDb3VudFRvdGFsKTtpZighaXNOYU4oY2VudGVySSkpe2Zvcih2YXIgZXN0aW1hdGVkTW9kdWxlU2l6ZT0oc3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl0pLzMsbWF4PXRoaXMucG9zc2libGVDZW50ZXJzLmxlbmd0aCxpbmRleD0wO21heD5pbmRleDtpbmRleCsrKXt2YXIgY2VudGVyPXRoaXMucG9zc2libGVDZW50ZXJzW2luZGV4XTtpZihjZW50ZXIuYWJvdXRFcXVhbHMoZXN0aW1hdGVkTW9kdWxlU2l6ZSxjZW50ZXJJLGNlbnRlckopKXJldHVybiBuZXcgQWxpZ25tZW50UGF0dGVybihjZW50ZXJKLGNlbnRlckksZXN0aW1hdGVkTW9kdWxlU2l6ZSl9dmFyIHBvaW50PW5ldyBBbGlnbm1lbnRQYXR0ZXJuKGNlbnRlckosY2VudGVySSxlc3RpbWF0ZWRNb2R1bGVTaXplKTt0aGlzLnBvc3NpYmxlQ2VudGVycy5wdXNoKHBvaW50KSxudWxsIT10aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2smJnRoaXMucmVzdWx0UG9pbnRDYWxsYmFjay5mb3VuZFBvc3NpYmxlUmVzdWx0UG9pbnQocG9pbnQpfXJldHVybiBudWxsfSx0aGlzLmZpbmQ9ZnVuY3Rpb24oKXtmb3IodmFyIHN0YXJ0WD10aGlzLnN0YXJ0WCxoZWlnaHQ9dGhpcy5oZWlnaHQsbWF4Sj1zdGFydFgrd2lkdGgsbWlkZGxlST1zdGFydFkrKGhlaWdodD4+MSksc3RhdGVDb3VudD1uZXcgQXJyYXkoMCwwLDApLGlHZW49MDtoZWlnaHQ+aUdlbjtpR2VuKyspe3ZhciBpPW1pZGRsZUkrKDA9PSgxJmlHZW4pP2lHZW4rMT4+MTotKGlHZW4rMT4+MSkpO3N0YXRlQ291bnRbMF09MCxzdGF0ZUNvdW50WzFdPTAsc3RhdGVDb3VudFsyXT0wO2Zvcih2YXIgaj1zdGFydFg7bWF4Sj5qJiYhaW1hZ2VbaitxcmNvZGUud2lkdGgqaV07KWorKztmb3IodmFyIGN1cnJlbnRTdGF0ZT0wO21heEo+ajspe2lmKGltYWdlW2oraSpxcmNvZGUud2lkdGhdKWlmKDE9PWN1cnJlbnRTdGF0ZSlzdGF0ZUNvdW50W2N1cnJlbnRTdGF0ZV0rKztlbHNlIGlmKDI9PWN1cnJlbnRTdGF0ZSl7aWYodGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KSl7dmFyIGNvbmZpcm1lZD10aGlzLmhhbmRsZVBvc3NpYmxlQ2VudGVyKHN0YXRlQ291bnQsaSxqKTtpZihudWxsIT1jb25maXJtZWQpcmV0dXJuIGNvbmZpcm1lZH1zdGF0ZUNvdW50WzBdPXN0YXRlQ291bnRbMl0sc3RhdGVDb3VudFsxXT0xLHN0YXRlQ291bnRbMl09MCxjdXJyZW50U3RhdGU9MX1lbHNlIHN0YXRlQ291bnRbKytjdXJyZW50U3RhdGVdKys7ZWxzZSAxPT1jdXJyZW50U3RhdGUmJmN1cnJlbnRTdGF0ZSsrLHN0YXRlQ291bnRbY3VycmVudFN0YXRlXSsrO2orK31pZih0aGlzLmZvdW5kUGF0dGVybkNyb3NzKHN0YXRlQ291bnQpKXt2YXIgY29uZmlybWVkPXRoaXMuaGFuZGxlUG9zc2libGVDZW50ZXIoc3RhdGVDb3VudCxpLG1heEopO2lmKG51bGwhPWNvbmZpcm1lZClyZXR1cm4gY29uZmlybWVkfX1pZigwIT10aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGgpcmV0dXJuIHRoaXMucG9zc2libGVDZW50ZXJzWzBdO3Rocm93XCJDb3VsZG4ndCBmaW5kIGVub3VnaCBhbGlnbm1lbnQgcGF0dGVybnNcIn19ZnVuY3Rpb24gUVJDb2RlRGF0YUJsb2NrUmVhZGVyKGJsb2Nrcyx2ZXJzaW9uLG51bUVycm9yQ29ycmVjdGlvbkNvZGUpe3RoaXMuYmxvY2tQb2ludGVyPTAsdGhpcy5iaXRQb2ludGVyPTcsdGhpcy5kYXRhTGVuZ3RoPTAsdGhpcy5ibG9ja3M9YmxvY2tzLHRoaXMubnVtRXJyb3JDb3JyZWN0aW9uQ29kZT1udW1FcnJvckNvcnJlY3Rpb25Db2RlLDk+PXZlcnNpb24/dGhpcy5kYXRhTGVuZ3RoTW9kZT0wOnZlcnNpb24+PTEwJiYyNj49dmVyc2lvbj90aGlzLmRhdGFMZW5ndGhNb2RlPTE6dmVyc2lvbj49MjcmJjQwPj12ZXJzaW9uJiYodGhpcy5kYXRhTGVuZ3RoTW9kZT0yKSx0aGlzLmdldE5leHRCaXRzPWZ1bmN0aW9uKG51bUJpdHMpe3ZhciBiaXRzPTA7aWYobnVtQml0czx0aGlzLmJpdFBvaW50ZXIrMSl7Zm9yKHZhciBtYXNrPTAsaT0wO251bUJpdHM+aTtpKyspbWFzays9MTw8aTtyZXR1cm4gbWFzazw8PXRoaXMuYml0UG9pbnRlci1udW1CaXRzKzEsYml0cz0odGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdJm1hc2spPj50aGlzLmJpdFBvaW50ZXItbnVtQml0cysxLHRoaXMuYml0UG9pbnRlci09bnVtQml0cyxiaXRzfWlmKG51bUJpdHM8dGhpcy5iaXRQb2ludGVyKzErOCl7Zm9yKHZhciBtYXNrMT0wLGk9MDtpPHRoaXMuYml0UG9pbnRlcisxO2krKyltYXNrMSs9MTw8aTtyZXR1cm4gYml0cz0odGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdJm1hc2sxKTw8bnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzEpLHRoaXMuYmxvY2tQb2ludGVyKyssYml0cys9dGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdPj44LShudW1CaXRzLSh0aGlzLmJpdFBvaW50ZXIrMSkpLHRoaXMuYml0UG9pbnRlcj10aGlzLmJpdFBvaW50ZXItbnVtQml0cyU4LHRoaXMuYml0UG9pbnRlcjwwJiYodGhpcy5iaXRQb2ludGVyPTgrdGhpcy5iaXRQb2ludGVyKSxiaXRzfWlmKG51bUJpdHM8dGhpcy5iaXRQb2ludGVyKzErMTYpe2Zvcih2YXIgbWFzazE9MCxtYXNrMz0wLGk9MDtpPHRoaXMuYml0UG9pbnRlcisxO2krKyltYXNrMSs9MTw8aTt2YXIgYml0c0ZpcnN0QmxvY2s9KHRoaXMuYmxvY2tzW3RoaXMuYmxvY2tQb2ludGVyXSZtYXNrMSk8PG51bUJpdHMtKHRoaXMuYml0UG9pbnRlcisxKTt0aGlzLmJsb2NrUG9pbnRlcisrO3ZhciBiaXRzU2Vjb25kQmxvY2s9dGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdPDxudW1CaXRzLSh0aGlzLmJpdFBvaW50ZXIrMSs4KTt0aGlzLmJsb2NrUG9pbnRlcisrO2Zvcih2YXIgaT0wO2k8bnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzErOCk7aSsrKW1hc2szKz0xPDxpO21hc2szPDw9OC0obnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzErOCkpO3ZhciBiaXRzVGhpcmRCbG9jaz0odGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdJm1hc2szKT4+OC0obnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzErOCkpO3JldHVybiBiaXRzPWJpdHNGaXJzdEJsb2NrK2JpdHNTZWNvbmRCbG9jaytiaXRzVGhpcmRCbG9jayx0aGlzLmJpdFBvaW50ZXI9dGhpcy5iaXRQb2ludGVyLShudW1CaXRzLTgpJTgsdGhpcy5iaXRQb2ludGVyPDAmJih0aGlzLmJpdFBvaW50ZXI9OCt0aGlzLmJpdFBvaW50ZXIpLGJpdHN9cmV0dXJuIDB9LHRoaXMuTmV4dE1vZGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibG9ja1BvaW50ZXI+dGhpcy5ibG9ja3MubGVuZ3RoLXRoaXMubnVtRXJyb3JDb3JyZWN0aW9uQ29kZS0yPzA6dGhpcy5nZXROZXh0Qml0cyg0KX0sdGhpcy5nZXREYXRhTGVuZ3RoPWZ1bmN0aW9uKG1vZGVJbmRpY2F0b3Ipe2Zvcih2YXIgaW5kZXg9MDs7KXtpZihtb2RlSW5kaWNhdG9yPj5pbmRleD09MSlicmVhaztpbmRleCsrfXJldHVybiB0aGlzLmdldE5leHRCaXRzKHFyY29kZS5zaXplT2ZEYXRhTGVuZ3RoSW5mb1t0aGlzLmRhdGFMZW5ndGhNb2RlXVtpbmRleF0pfSx0aGlzLmdldFJvbWFuQW5kRmlndXJlU3RyaW5nPWZ1bmN0aW9uKGRhdGFMZW5ndGgpe3ZhciBsZW5ndGg9ZGF0YUxlbmd0aCxpbnREYXRhPTAsc3RyRGF0YT1cIlwiLHRhYmxlUm9tYW5BbmRGaWd1cmU9bmV3IEFycmF5KFwiMFwiLFwiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiQVwiLFwiQlwiLFwiQ1wiLFwiRFwiLFwiRVwiLFwiRlwiLFwiR1wiLFwiSFwiLFwiSVwiLFwiSlwiLFwiS1wiLFwiTFwiLFwiTVwiLFwiTlwiLFwiT1wiLFwiUFwiLFwiUVwiLFwiUlwiLFwiU1wiLFwiVFwiLFwiVVwiLFwiVlwiLFwiV1wiLFwiWFwiLFwiWVwiLFwiWlwiLFwiIFwiLFwiJFwiLFwiJVwiLFwiKlwiLFwiK1wiLFwiLVwiLFwiLlwiLFwiL1wiLFwiOlwiKTtkbyBpZihsZW5ndGg+MSl7aW50RGF0YT10aGlzLmdldE5leHRCaXRzKDExKTt2YXIgZmlyc3RMZXR0ZXI9TWF0aC5mbG9vcihpbnREYXRhLzQ1KSxzZWNvbmRMZXR0ZXI9aW50RGF0YSU0NTtzdHJEYXRhKz10YWJsZVJvbWFuQW5kRmlndXJlW2ZpcnN0TGV0dGVyXSxzdHJEYXRhKz10YWJsZVJvbWFuQW5kRmlndXJlW3NlY29uZExldHRlcl0sbGVuZ3RoLT0yfWVsc2UgMT09bGVuZ3RoJiYoaW50RGF0YT10aGlzLmdldE5leHRCaXRzKDYpLHN0ckRhdGErPXRhYmxlUm9tYW5BbmRGaWd1cmVbaW50RGF0YV0sbGVuZ3RoLT0xKTt3aGlsZShsZW5ndGg+MCk7cmV0dXJuIHN0ckRhdGF9LHRoaXMuZ2V0RmlndXJlU3RyaW5nPWZ1bmN0aW9uKGRhdGFMZW5ndGgpe3ZhciBsZW5ndGg9ZGF0YUxlbmd0aCxpbnREYXRhPTAsc3RyRGF0YT1cIlwiO2RvIGxlbmd0aD49Mz8oaW50RGF0YT10aGlzLmdldE5leHRCaXRzKDEwKSwxMDA+aW50RGF0YSYmKHN0ckRhdGErPVwiMFwiKSwxMD5pbnREYXRhJiYoc3RyRGF0YSs9XCIwXCIpLGxlbmd0aC09Myk6Mj09bGVuZ3RoPyhpbnREYXRhPXRoaXMuZ2V0TmV4dEJpdHMoNyksMTA+aW50RGF0YSYmKHN0ckRhdGErPVwiMFwiKSxsZW5ndGgtPTIpOjE9PWxlbmd0aCYmKGludERhdGE9dGhpcy5nZXROZXh0Qml0cyg0KSxsZW5ndGgtPTEpLHN0ckRhdGErPWludERhdGE7d2hpbGUobGVuZ3RoPjApO3JldHVybiBzdHJEYXRhfSx0aGlzLmdldDhiaXRCeXRlQXJyYXk9ZnVuY3Rpb24oZGF0YUxlbmd0aCl7dmFyIGxlbmd0aD1kYXRhTGVuZ3RoLGludERhdGE9MCxvdXRwdXQ9bmV3IEFycmF5O2RvIGludERhdGE9dGhpcy5nZXROZXh0Qml0cyg4KSxvdXRwdXQucHVzaChpbnREYXRhKSxsZW5ndGgtLTt3aGlsZShsZW5ndGg+MCk7cmV0dXJuIG91dHB1dH0sdGhpcy5nZXRLYW5qaVN0cmluZz1mdW5jdGlvbihkYXRhTGVuZ3RoKXt2YXIgbGVuZ3RoPWRhdGFMZW5ndGgsaW50RGF0YT0wLHVuaWNvZGVTdHJpbmc9XCJcIjtkb3tpbnREYXRhPWdldE5leHRCaXRzKDEzKTt2YXIgbG93ZXJCeXRlPWludERhdGElMTkyLGhpZ2hlckJ5dGU9aW50RGF0YS8xOTIsdGVtcFdvcmQ9KGhpZ2hlckJ5dGU8PDgpK2xvd2VyQnl0ZSxzaGlmdGppc1dvcmQ9MDtzaGlmdGppc1dvcmQ9NDA5NTY+PXRlbXBXb3JkKzMzMDg4P3RlbXBXb3JkKzMzMDg4OnRlbXBXb3JkKzQ5NDcyLHVuaWNvZGVTdHJpbmcrPVN0cmluZy5mcm9tQ2hhckNvZGUoc2hpZnRqaXNXb3JkKSxsZW5ndGgtLX13aGlsZShsZW5ndGg+MCk7cmV0dXJuIHVuaWNvZGVTdHJpbmd9LHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkRhdGFCeXRlXCIsZnVuY3Rpb24oKXtmb3IodmFyIG91dHB1dD1uZXcgQXJyYXksTU9ERV9OVU1CRVI9MSxNT0RFX1JPTUFOX0FORF9OVU1CRVI9MixNT0RFXzhCSVRfQllURT00LE1PREVfS0FOSkk9ODs7KXt2YXIgbW9kZT10aGlzLk5leHRNb2RlKCk7aWYoMD09bW9kZSl7aWYob3V0cHV0Lmxlbmd0aD4wKWJyZWFrO3Rocm93XCJFbXB0eSBkYXRhIGJsb2NrXCJ9aWYobW9kZSE9TU9ERV9OVU1CRVImJm1vZGUhPU1PREVfUk9NQU5fQU5EX05VTUJFUiYmbW9kZSE9TU9ERV84QklUX0JZVEUmJm1vZGUhPU1PREVfS0FOSkkpdGhyb3dcIkludmFsaWQgbW9kZTogXCIrbW9kZStcIiBpbiAoYmxvY2s6XCIrdGhpcy5ibG9ja1BvaW50ZXIrXCIgYml0OlwiK3RoaXMuYml0UG9pbnRlcitcIilcIjtpZihkYXRhTGVuZ3RoPXRoaXMuZ2V0RGF0YUxlbmd0aChtb2RlKSxkYXRhTGVuZ3RoPDEpdGhyb3dcIkludmFsaWQgZGF0YSBsZW5ndGg6IFwiK2RhdGFMZW5ndGg7c3dpdGNoKG1vZGUpe2Nhc2UgTU9ERV9OVU1CRVI6Zm9yKHZhciB0ZW1wX3N0cj10aGlzLmdldEZpZ3VyZVN0cmluZyhkYXRhTGVuZ3RoKSx0YT1uZXcgQXJyYXkodGVtcF9zdHIubGVuZ3RoKSxqPTA7ajx0ZW1wX3N0ci5sZW5ndGg7aisrKXRhW2pdPXRlbXBfc3RyLmNoYXJDb2RlQXQoaik7b3V0cHV0LnB1c2godGEpO2JyZWFrO2Nhc2UgTU9ERV9ST01BTl9BTkRfTlVNQkVSOmZvcih2YXIgdGVtcF9zdHI9dGhpcy5nZXRSb21hbkFuZEZpZ3VyZVN0cmluZyhkYXRhTGVuZ3RoKSx0YT1uZXcgQXJyYXkodGVtcF9zdHIubGVuZ3RoKSxqPTA7ajx0ZW1wX3N0ci5sZW5ndGg7aisrKXRhW2pdPXRlbXBfc3RyLmNoYXJDb2RlQXQoaik7b3V0cHV0LnB1c2godGEpO2JyZWFrO2Nhc2UgTU9ERV84QklUX0JZVEU6dmFyIHRlbXBfc2J5dGVBcnJheTM9dGhpcy5nZXQ4Yml0Qnl0ZUFycmF5KGRhdGFMZW5ndGgpO291dHB1dC5wdXNoKHRlbXBfc2J5dGVBcnJheTMpO2JyZWFrO2Nhc2UgTU9ERV9LQU5KSTp2YXIgdGVtcF9zdHI9dGhpcy5nZXRLYW5qaVN0cmluZyhkYXRhTGVuZ3RoKTtvdXRwdXQucHVzaCh0ZW1wX3N0cil9fXJldHVybiBvdXRwdXR9KX1HcmlkU2FtcGxlcj17fSxHcmlkU2FtcGxlci5jaGVja0FuZE51ZGdlUG9pbnRzPWZ1bmN0aW9uKGltYWdlLHBvaW50cyl7Zm9yKHZhciB3aWR0aD1xcmNvZGUud2lkdGgsaGVpZ2h0PXFyY29kZS5oZWlnaHQsbnVkZ2VkPSEwLG9mZnNldD0wO29mZnNldDxwb2ludHMuTGVuZ3RoJiZudWRnZWQ7b2Zmc2V0Kz0yKXt2YXIgeD1NYXRoLmZsb29yKHBvaW50c1tvZmZzZXRdKSx5PU1hdGguZmxvb3IocG9pbnRzW29mZnNldCsxXSk7aWYoLTE+eHx8eD53aWR0aHx8LTE+eXx8eT5oZWlnaHQpdGhyb3dcIkVycm9yLmNoZWNrQW5kTnVkZ2VQb2ludHMgXCI7bnVkZ2VkPSExLC0xPT14Pyhwb2ludHNbb2Zmc2V0XT0wLG51ZGdlZD0hMCk6eD09d2lkdGgmJihwb2ludHNbb2Zmc2V0XT13aWR0aC0xLG51ZGdlZD0hMCksLTE9PXk/KHBvaW50c1tvZmZzZXQrMV09MCxudWRnZWQ9ITApOnk9PWhlaWdodCYmKHBvaW50c1tvZmZzZXQrMV09aGVpZ2h0LTEsbnVkZ2VkPSEwKX1udWRnZWQ9ITA7Zm9yKHZhciBvZmZzZXQ9cG9pbnRzLkxlbmd0aC0yO29mZnNldD49MCYmbnVkZ2VkO29mZnNldC09Mil7dmFyIHg9TWF0aC5mbG9vcihwb2ludHNbb2Zmc2V0XSkseT1NYXRoLmZsb29yKHBvaW50c1tvZmZzZXQrMV0pO2lmKC0xPnh8fHg+d2lkdGh8fC0xPnl8fHk+aGVpZ2h0KXRocm93XCJFcnJvci5jaGVja0FuZE51ZGdlUG9pbnRzIFwiO251ZGdlZD0hMSwtMT09eD8ocG9pbnRzW29mZnNldF09MCxudWRnZWQ9ITApOng9PXdpZHRoJiYocG9pbnRzW29mZnNldF09d2lkdGgtMSxudWRnZWQ9ITApLC0xPT15Pyhwb2ludHNbb2Zmc2V0KzFdPTAsbnVkZ2VkPSEwKTp5PT1oZWlnaHQmJihwb2ludHNbb2Zmc2V0KzFdPWhlaWdodC0xLG51ZGdlZD0hMCl9fSxHcmlkU2FtcGxlci5zYW1wbGVHcmlkMz1mdW5jdGlvbihpbWFnZSxkaW1lbnNpb24sdHJhbnNmb3JtKXtmb3IodmFyIGJpdHM9bmV3IEJpdE1hdHJpeChkaW1lbnNpb24pLHBvaW50cz1uZXcgQXJyYXkoZGltZW5zaW9uPDwxKSx5PTA7ZGltZW5zaW9uPnk7eSsrKXtmb3IodmFyIG1heD1wb2ludHMubGVuZ3RoLGlWYWx1ZT15Ky41LHg9MDttYXg+eDt4Kz0yKXBvaW50c1t4XT0oeD4+MSkrLjUscG9pbnRzW3grMV09aVZhbHVlO3RyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludHMxKHBvaW50cyksR3JpZFNhbXBsZXIuY2hlY2tBbmROdWRnZVBvaW50cyhpbWFnZSxwb2ludHMpO3RyeXtmb3IodmFyIHg9MDttYXg+eDt4Kz0yKXt2YXIgeHBvaW50PTQqTWF0aC5mbG9vcihwb2ludHNbeF0pK01hdGguZmxvb3IocG9pbnRzW3grMV0pKnFyY29kZS53aWR0aCo0LGJpdD1pbWFnZVtNYXRoLmZsb29yKHBvaW50c1t4XSkrcXJjb2RlLndpZHRoKk1hdGguZmxvb3IocG9pbnRzW3grMV0pXTtxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbeHBvaW50XT1iaXQ/MjU1OjAscXJjb2RlLmltYWdlZGF0YS5kYXRhW3hwb2ludCsxXT1iaXQ/MjU1OjAscXJjb2RlLmltYWdlZGF0YS5kYXRhW3hwb2ludCsyXT0wLHFyY29kZS5pbWFnZWRhdGEuZGF0YVt4cG9pbnQrM109MjU1LGJpdCYmYml0cy5zZXRfUmVuYW1lZCh4Pj4xLHkpfX1jYXRjaChhaW9vYmUpe3Rocm93XCJFcnJvci5jaGVja0FuZE51ZGdlUG9pbnRzXCJ9fXJldHVybiBiaXRzfSxHcmlkU2FtcGxlci5zYW1wbGVHcmlkeD1mdW5jdGlvbihpbWFnZSxkaW1lbnNpb24scDFUb1gscDFUb1kscDJUb1gscDJUb1kscDNUb1gscDNUb1kscDRUb1gscDRUb1kscDFGcm9tWCxwMUZyb21ZLHAyRnJvbVgscDJGcm9tWSxwM0Zyb21YLHAzRnJvbVkscDRGcm9tWCxwNEZyb21ZKXt2YXIgdHJhbnNmb3JtPVBlcnNwZWN0aXZlVHJhbnNmb3JtLnF1YWRyaWxhdGVyYWxUb1F1YWRyaWxhdGVyYWwocDFUb1gscDFUb1kscDJUb1gscDJUb1kscDNUb1gscDNUb1kscDRUb1gscDRUb1kscDFGcm9tWCxwMUZyb21ZLHAyRnJvbVgscDJGcm9tWSxwM0Zyb21YLHAzRnJvbVkscDRGcm9tWCxwNEZyb21ZKTtyZXR1cm4gR3JpZFNhbXBsZXIuc2FtcGxlR3JpZDMoaW1hZ2UsZGltZW5zaW9uLHRyYW5zZm9ybSl9LFZlcnNpb24uVkVSU0lPTl9ERUNPREVfSU5GTz1uZXcgQXJyYXkoMzE4OTIsMzQyMzYsMzk1NzcsNDIxOTUsNDgxMTgsNTEwNDIsNTUzNjcsNTg4OTMsNjM3ODQsNjg0NzIsNzA3NDksNzYzMTEsNzkxNTQsODQzOTAsODc2ODMsOTIzNjEsOTYyMzYsMTAyMDg0LDEwMjg4MSwxMTA1MDcsMTEwNzM0LDExNzc4NiwxMTk2MTUsMTI2MzI1LDEyNzU2OCwxMzM1ODksMTM2OTQ0LDE0MTQ5OCwxNDUzMTEsMTUwMjgzLDE1MjYyMiwxNTgzMDgsMTYxMDg5LDE2NzAxNyksVmVyc2lvbi5WRVJTSU9OUz1idWlsZFZlcnNpb25zKCksVmVyc2lvbi5nZXRWZXJzaW9uRm9yTnVtYmVyPWZ1bmN0aW9uKHZlcnNpb25OdW1iZXIpe2lmKDE+dmVyc2lvbk51bWJlcnx8dmVyc2lvbk51bWJlcj40MCl0aHJvd1wiQXJndW1lbnRFeGNlcHRpb25cIjtyZXR1cm4gVmVyc2lvbi5WRVJTSU9OU1t2ZXJzaW9uTnVtYmVyLTFdfSxWZXJzaW9uLmdldFByb3Zpc2lvbmFsVmVyc2lvbkZvckRpbWVuc2lvbj1mdW5jdGlvbihkaW1lbnNpb24pe2lmKGRpbWVuc2lvbiU0IT0xKXRocm93XCJFcnJvciBnZXRQcm92aXNpb25hbFZlcnNpb25Gb3JEaW1lbnNpb25cIjt0cnl7cmV0dXJuIFZlcnNpb24uZ2V0VmVyc2lvbkZvck51bWJlcihkaW1lbnNpb24tMTc+PjIpfWNhdGNoKGlhZSl7dGhyb3dcIkVycm9yIGdldFZlcnNpb25Gb3JOdW1iZXJcIn19LFZlcnNpb24uZGVjb2RlVmVyc2lvbkluZm9ybWF0aW9uPWZ1bmN0aW9uKHZlcnNpb25CaXRzKXtmb3IodmFyIGJlc3REaWZmZXJlbmNlPTQyOTQ5NjcyOTUsYmVzdFZlcnNpb249MCxpPTA7aTxWZXJzaW9uLlZFUlNJT05fREVDT0RFX0lORk8ubGVuZ3RoO2krKyl7dmFyIHRhcmdldFZlcnNpb249VmVyc2lvbi5WRVJTSU9OX0RFQ09ERV9JTkZPW2ldO2lmKHRhcmdldFZlcnNpb249PXZlcnNpb25CaXRzKXJldHVybiB0aGlzLmdldFZlcnNpb25Gb3JOdW1iZXIoaSs3KTt2YXIgYml0c0RpZmZlcmVuY2U9Rm9ybWF0SW5mb3JtYXRpb24ubnVtQml0c0RpZmZlcmluZyh2ZXJzaW9uQml0cyx0YXJnZXRWZXJzaW9uKTtiZXN0RGlmZmVyZW5jZT5iaXRzRGlmZmVyZW5jZSYmKGJlc3RWZXJzaW9uPWkrNyxiZXN0RGlmZmVyZW5jZT1iaXRzRGlmZmVyZW5jZSl9cmV0dXJuIDM+PWJlc3REaWZmZXJlbmNlP3RoaXMuZ2V0VmVyc2lvbkZvck51bWJlcihiZXN0VmVyc2lvbik6bnVsbH0sUGVyc3BlY3RpdmVUcmFuc2Zvcm0ucXVhZHJpbGF0ZXJhbFRvUXVhZHJpbGF0ZXJhbD1mdW5jdGlvbih4MCx5MCx4MSx5MSx4Mix5Mix4Myx5Myx4MHAseTBwLHgxcCx5MXAseDJwLHkycCx4M3AseTNwKXt2YXIgcVRvUz10aGlzLnF1YWRyaWxhdGVyYWxUb1NxdWFyZSh4MCx5MCx4MSx5MSx4Mix5Mix4Myx5Myksc1RvUT10aGlzLnNxdWFyZVRvUXVhZHJpbGF0ZXJhbCh4MHAseTBwLHgxcCx5MXAseDJwLHkycCx4M3AseTNwKTtyZXR1cm4gc1RvUS50aW1lcyhxVG9TKX0sUGVyc3BlY3RpdmVUcmFuc2Zvcm0uc3F1YXJlVG9RdWFkcmlsYXRlcmFsPWZ1bmN0aW9uKHgwLHkwLHgxLHkxLHgyLHkyLHgzLHkzKXtyZXR1cm4gZHkyPXkzLXkyLGR5Mz15MC15MSt5Mi15MywwPT1keTImJjA9PWR5Mz9uZXcgUGVyc3BlY3RpdmVUcmFuc2Zvcm0oeDEteDAseDIteDEseDAseTEteTAseTIteTEseTAsMCwwLDEpOihkeDE9eDEteDIsZHgyPXgzLXgyLGR4Mz14MC14MSt4Mi14MyxkeTE9eTEteTIsZGVub21pbmF0b3I9ZHgxKmR5Mi1keDIqZHkxLGExMz0oZHgzKmR5Mi1keDIqZHkzKS9kZW5vbWluYXRvcixhMjM9KGR4MSpkeTMtZHgzKmR5MSkvZGVub21pbmF0b3IsbmV3IFBlcnNwZWN0aXZlVHJhbnNmb3JtKHgxLXgwK2ExMyp4MSx4My14MCthMjMqeDMseDAseTEteTArYTEzKnkxLHkzLXkwK2EyMyp5Myx5MCxhMTMsYTIzLDEpKX0sUGVyc3BlY3RpdmVUcmFuc2Zvcm0ucXVhZHJpbGF0ZXJhbFRvU3F1YXJlPWZ1bmN0aW9uKHgwLHkwLHgxLHkxLHgyLHkyLHgzLHkzKXtyZXR1cm4gdGhpcy5zcXVhcmVUb1F1YWRyaWxhdGVyYWwoeDAseTAseDEseTEseDIseTIseDMseTMpLmJ1aWxkQWRqb2ludCgpfTt2YXIgRk9STUFUX0lORk9fTUFTS19RUj0yMTUyMixGT1JNQVRfSU5GT19ERUNPREVfTE9PS1VQPW5ldyBBcnJheShuZXcgQXJyYXkoMjE1MjIsMCksbmV3IEFycmF5KDIwNzczLDEpLG5ldyBBcnJheSgyNDE4OCwyKSxuZXcgQXJyYXkoMjMzNzEsMyksbmV3IEFycmF5KDE3OTEzLDQpLG5ldyBBcnJheSgxNjU5MCw1KSxuZXcgQXJyYXkoMjAzNzUsNiksbmV3IEFycmF5KDE5MTA0LDcpLG5ldyBBcnJheSgzMDY2MCw4KSxuZXcgQXJyYXkoMjk0MjcsOSksbmV3IEFycmF5KDMyMTcwLDEwKSxuZXcgQXJyYXkoMzA4NzcsMTEpLG5ldyBBcnJheSgyNjE1OSwxMiksbmV3IEFycmF5KDI1MzY4LDEzKSxuZXcgQXJyYXkoMjc3MTMsMTQpLG5ldyBBcnJheSgyNjk5OCwxNSksbmV3IEFycmF5KDU3NjksMTYpLG5ldyBBcnJheSg1MDU0LDE3KSxuZXcgQXJyYXkoNzM5OSwxOCksbmV3IEFycmF5KDY2MDgsMTkpLG5ldyBBcnJheSgxODkwLDIwKSxuZXcgQXJyYXkoNTk3LDIxKSxuZXcgQXJyYXkoMzM0MCwyMiksbmV3IEFycmF5KDIxMDcsMjMpLG5ldyBBcnJheSgxMzY2MywyNCksbmV3IEFycmF5KDEyMzkyLDI1KSxuZXcgQXJyYXkoMTYxNzcsMjYpLG5ldyBBcnJheSgxNDg1NCwyNyksbmV3IEFycmF5KDkzOTYsMjgpLG5ldyBBcnJheSg4NTc5LDI5KSxuZXcgQXJyYXkoMTE5OTQsMzApLG5ldyBBcnJheSgxMTI0NSwzMSkpLEJJVFNfU0VUX0lOX0hBTEZfQllURT1uZXcgQXJyYXkoMCwxLDEsMiwxLDIsMiwzLDEsMiwyLDMsMiwzLDMsNCk7Rm9ybWF0SW5mb3JtYXRpb24ubnVtQml0c0RpZmZlcmluZz1mdW5jdGlvbihhLGIpe3JldHVybiBhXj1iLEJJVFNfU0VUX0lOX0hBTEZfQllURVsxNSZhXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDQpXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDgpXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDEyKV0rQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JlVSU2hpZnQoYSwxNildK0JJVFNfU0VUX0lOX0hBTEZfQllURVsxNSZVUlNoaWZ0KGEsMjApXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDI0KV0rQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JlVSU2hpZnQoYSwyOCldfSxGb3JtYXRJbmZvcm1hdGlvbi5kZWNvZGVGb3JtYXRJbmZvcm1hdGlvbj1mdW5jdGlvbihtYXNrZWRGb3JtYXRJbmZvKXt2YXIgZm9ybWF0SW5mbz1Gb3JtYXRJbmZvcm1hdGlvbi5kb0RlY29kZUZvcm1hdEluZm9ybWF0aW9uKG1hc2tlZEZvcm1hdEluZm8pO3JldHVybiBudWxsIT1mb3JtYXRJbmZvP2Zvcm1hdEluZm86Rm9ybWF0SW5mb3JtYXRpb24uZG9EZWNvZGVGb3JtYXRJbmZvcm1hdGlvbihtYXNrZWRGb3JtYXRJbmZvXkZPUk1BVF9JTkZPX01BU0tfUVIpfSxGb3JtYXRJbmZvcm1hdGlvbi5kb0RlY29kZUZvcm1hdEluZm9ybWF0aW9uPWZ1bmN0aW9uKG1hc2tlZEZvcm1hdEluZm8pe2Zvcih2YXIgYmVzdERpZmZlcmVuY2U9NDI5NDk2NzI5NSxiZXN0Rm9ybWF0SW5mbz0wLGk9MDtpPEZPUk1BVF9JTkZPX0RFQ09ERV9MT09LVVAubGVuZ3RoO2krKyl7dmFyIGRlY29kZUluZm89Rk9STUFUX0lORk9fREVDT0RFX0xPT0tVUFtpXSx0YXJnZXRJbmZvPWRlY29kZUluZm9bMF07aWYodGFyZ2V0SW5mbz09bWFza2VkRm9ybWF0SW5mbylyZXR1cm4gbmV3IEZvcm1hdEluZm9ybWF0aW9uKGRlY29kZUluZm9bMV0pO3ZhciBiaXRzRGlmZmVyZW5jZT10aGlzLm51bUJpdHNEaWZmZXJpbmcobWFza2VkRm9ybWF0SW5mbyx0YXJnZXRJbmZvKTtiZXN0RGlmZmVyZW5jZT5iaXRzRGlmZmVyZW5jZSYmKGJlc3RGb3JtYXRJbmZvPWRlY29kZUluZm9bMV0sYmVzdERpZmZlcmVuY2U9Yml0c0RpZmZlcmVuY2UpfXJldHVybiAzPj1iZXN0RGlmZmVyZW5jZT9uZXcgRm9ybWF0SW5mb3JtYXRpb24oYmVzdEZvcm1hdEluZm8pOm51bGx9LEVycm9yQ29ycmVjdGlvbkxldmVsLmZvckJpdHM9ZnVuY3Rpb24oYml0cyl7aWYoMD5iaXRzfHxiaXRzPj1GT1JfQklUUy5MZW5ndGgpdGhyb3dcIkFyZ3VtZW50RXhjZXB0aW9uXCI7cmV0dXJuIEZPUl9CSVRTW2JpdHNdfTt2YXIgTD1uZXcgRXJyb3JDb3JyZWN0aW9uTGV2ZWwoMCwxLFwiTFwiKSxNPW5ldyBFcnJvckNvcnJlY3Rpb25MZXZlbCgxLDAsXCJNXCIpLFE9bmV3IEVycm9yQ29ycmVjdGlvbkxldmVsKDIsMyxcIlFcIiksSD1uZXcgRXJyb3JDb3JyZWN0aW9uTGV2ZWwoMywyLFwiSFwiKSxGT1JfQklUUz1uZXcgQXJyYXkoTSxMLEgsUSk7RGF0YUJsb2NrLmdldERhdGFCbG9ja3M9ZnVuY3Rpb24ocmF3Q29kZXdvcmRzLHZlcnNpb24sZWNMZXZlbCl7aWYocmF3Q29kZXdvcmRzLmxlbmd0aCE9dmVyc2lvbi5Ub3RhbENvZGV3b3Jkcyl0aHJvd1wiQXJndW1lbnRFeGNlcHRpb25cIjtmb3IodmFyIGVjQmxvY2tzPXZlcnNpb24uZ2V0RUNCbG9ja3NGb3JMZXZlbChlY0xldmVsKSx0b3RhbEJsb2Nrcz0wLGVjQmxvY2tBcnJheT1lY0Jsb2Nrcy5nZXRFQ0Jsb2NrcygpLGk9MDtpPGVjQmxvY2tBcnJheS5sZW5ndGg7aSsrKXRvdGFsQmxvY2tzKz1lY0Jsb2NrQXJyYXlbaV0uQ291bnQ7Zm9yKHZhciByZXN1bHQ9bmV3IEFycmF5KHRvdGFsQmxvY2tzKSxudW1SZXN1bHRCbG9ja3M9MCxqPTA7ajxlY0Jsb2NrQXJyYXkubGVuZ3RoO2orKylmb3IodmFyIGVjQmxvY2s9ZWNCbG9ja0FycmF5W2pdLGk9MDtpPGVjQmxvY2suQ291bnQ7aSsrKXt2YXIgbnVtRGF0YUNvZGV3b3Jkcz1lY0Jsb2NrLkRhdGFDb2Rld29yZHMsbnVtQmxvY2tDb2Rld29yZHM9ZWNCbG9ja3MuRUNDb2Rld29yZHNQZXJCbG9jaytudW1EYXRhQ29kZXdvcmRzO3Jlc3VsdFtudW1SZXN1bHRCbG9ja3MrK109bmV3IERhdGFCbG9jayhudW1EYXRhQ29kZXdvcmRzLG5ldyBBcnJheShudW1CbG9ja0NvZGV3b3JkcykpfWZvcih2YXIgc2hvcnRlckJsb2Nrc1RvdGFsQ29kZXdvcmRzPXJlc3VsdFswXS5jb2Rld29yZHMubGVuZ3RoLGxvbmdlckJsb2Nrc1N0YXJ0QXQ9cmVzdWx0Lmxlbmd0aC0xO2xvbmdlckJsb2Nrc1N0YXJ0QXQ+PTA7KXt2YXIgbnVtQ29kZXdvcmRzPXJlc3VsdFtsb25nZXJCbG9ja3NTdGFydEF0XS5jb2Rld29yZHMubGVuZ3RoO2lmKG51bUNvZGV3b3Jkcz09c2hvcnRlckJsb2Nrc1RvdGFsQ29kZXdvcmRzKWJyZWFrO2xvbmdlckJsb2Nrc1N0YXJ0QXQtLX1sb25nZXJCbG9ja3NTdGFydEF0Kys7Zm9yKHZhciBzaG9ydGVyQmxvY2tzTnVtRGF0YUNvZGV3b3Jkcz1zaG9ydGVyQmxvY2tzVG90YWxDb2Rld29yZHMtZWNCbG9ja3MuRUNDb2Rld29yZHNQZXJCbG9jayxyYXdDb2Rld29yZHNPZmZzZXQ9MCxpPTA7c2hvcnRlckJsb2Nrc051bURhdGFDb2Rld29yZHM+aTtpKyspZm9yKHZhciBqPTA7bnVtUmVzdWx0QmxvY2tzPmo7aisrKXJlc3VsdFtqXS5jb2Rld29yZHNbaV09cmF3Q29kZXdvcmRzW3Jhd0NvZGV3b3Jkc09mZnNldCsrXTtmb3IodmFyIGo9bG9uZ2VyQmxvY2tzU3RhcnRBdDtudW1SZXN1bHRCbG9ja3M+ajtqKyspcmVzdWx0W2pdLmNvZGV3b3Jkc1tzaG9ydGVyQmxvY2tzTnVtRGF0YUNvZGV3b3Jkc109cmF3Q29kZXdvcmRzW3Jhd0NvZGV3b3Jkc09mZnNldCsrXTtmb3IodmFyIG1heD1yZXN1bHRbMF0uY29kZXdvcmRzLmxlbmd0aCxpPXNob3J0ZXJCbG9ja3NOdW1EYXRhQ29kZXdvcmRzO21heD5pO2krKylmb3IodmFyIGo9MDtudW1SZXN1bHRCbG9ja3M+ajtqKyspe3ZhciBpT2Zmc2V0PWxvbmdlckJsb2Nrc1N0YXJ0QXQ+aj9pOmkrMTtyZXN1bHRbal0uY29kZXdvcmRzW2lPZmZzZXRdPXJhd0NvZGV3b3Jkc1tyYXdDb2Rld29yZHNPZmZzZXQrK119cmV0dXJuIHJlc3VsdH0sRGF0YU1hc2s9e30sRGF0YU1hc2suZm9yUmVmZXJlbmNlPWZ1bmN0aW9uKHJlZmVyZW5jZSl7aWYoMD5yZWZlcmVuY2V8fHJlZmVyZW5jZT43KXRocm93XCJTeXN0ZW0uQXJndW1lbnRFeGNlcHRpb25cIjtyZXR1cm4gRGF0YU1hc2suREFUQV9NQVNLU1tyZWZlcmVuY2VdfSxEYXRhTWFzay5EQVRBX01BU0tTPW5ldyBBcnJheShuZXcgRGF0YU1hc2swMDAsbmV3IERhdGFNYXNrMDAxLG5ldyBEYXRhTWFzazAxMCxuZXcgRGF0YU1hc2swMTEsbmV3IERhdGFNYXNrMTAwLG5ldyBEYXRhTWFzazEwMSxuZXcgRGF0YU1hc2sxMTAsbmV3IERhdGFNYXNrMTExKSxHRjI1Ni5RUl9DT0RFX0ZJRUxEPW5ldyBHRjI1NigyODUpLEdGMjU2LkRBVEFfTUFUUklYX0ZJRUxEPW5ldyBHRjI1NigzMDEpLEdGMjU2LmFkZE9yU3VidHJhY3Q9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYV5ifSxEZWNvZGVyPXt9LERlY29kZXIucnNEZWNvZGVyPW5ldyBSZWVkU29sb21vbkRlY29kZXIoR0YyNTYuUVJfQ09ERV9GSUVMRCksRGVjb2Rlci5jb3JyZWN0RXJyb3JzPWZ1bmN0aW9uKGNvZGV3b3JkQnl0ZXMsbnVtRGF0YUNvZGV3b3Jkcyl7Zm9yKHZhciBudW1Db2Rld29yZHM9Y29kZXdvcmRCeXRlcy5sZW5ndGgsY29kZXdvcmRzSW50cz1uZXcgQXJyYXkobnVtQ29kZXdvcmRzKSxpPTA7bnVtQ29kZXdvcmRzPmk7aSsrKWNvZGV3b3Jkc0ludHNbaV09MjU1JmNvZGV3b3JkQnl0ZXNbaV07dmFyIG51bUVDQ29kZXdvcmRzPWNvZGV3b3JkQnl0ZXMubGVuZ3RoLW51bURhdGFDb2Rld29yZHM7dHJ5e0RlY29kZXIucnNEZWNvZGVyLmRlY29kZShjb2Rld29yZHNJbnRzLG51bUVDQ29kZXdvcmRzKX1jYXRjaChyc2Upe3Rocm93IHJzZX1mb3IodmFyIGk9MDtudW1EYXRhQ29kZXdvcmRzPmk7aSsrKWNvZGV3b3JkQnl0ZXNbaV09Y29kZXdvcmRzSW50c1tpXX0sRGVjb2Rlci5kZWNvZGU9ZnVuY3Rpb24oYml0cyl7Zm9yKHZhciBwYXJzZXI9bmV3IEJpdE1hdHJpeFBhcnNlcihiaXRzKSx2ZXJzaW9uPXBhcnNlci5yZWFkVmVyc2lvbigpLGVjTGV2ZWw9cGFyc2VyLnJlYWRGb3JtYXRJbmZvcm1hdGlvbigpLkVycm9yQ29ycmVjdGlvbkxldmVsLGNvZGV3b3Jkcz1wYXJzZXIucmVhZENvZGV3b3JkcygpLGRhdGFCbG9ja3M9RGF0YUJsb2NrLmdldERhdGFCbG9ja3MoY29kZXdvcmRzLHZlcnNpb24sZWNMZXZlbCksdG90YWxCeXRlcz0wLGk9MDtpPGRhdGFCbG9ja3MuTGVuZ3RoO2krKyl0b3RhbEJ5dGVzKz1kYXRhQmxvY2tzW2ldLk51bURhdGFDb2Rld29yZHM7Zm9yKHZhciByZXN1bHRCeXRlcz1uZXcgQXJyYXkodG90YWxCeXRlcykscmVzdWx0T2Zmc2V0PTAsaj0wO2o8ZGF0YUJsb2Nrcy5sZW5ndGg7aisrKXt2YXIgZGF0YUJsb2NrPWRhdGFCbG9ja3Nbal0sY29kZXdvcmRCeXRlcz1kYXRhQmxvY2suQ29kZXdvcmRzLG51bURhdGFDb2Rld29yZHM9ZGF0YUJsb2NrLk51bURhdGFDb2Rld29yZHM7RGVjb2Rlci5jb3JyZWN0RXJyb3JzKGNvZGV3b3JkQnl0ZXMsbnVtRGF0YUNvZGV3b3Jkcyk7Zm9yKHZhciBpPTA7bnVtRGF0YUNvZGV3b3Jkcz5pO2krKylyZXN1bHRCeXRlc1tyZXN1bHRPZmZzZXQrK109Y29kZXdvcmRCeXRlc1tpXX12YXIgcmVhZGVyPW5ldyBRUkNvZGVEYXRhQmxvY2tSZWFkZXIocmVzdWx0Qnl0ZXMsdmVyc2lvbi5WZXJzaW9uTnVtYmVyLGVjTGV2ZWwuQml0cyk7cmV0dXJuIHJlYWRlcn0scXJjb2RlPXt9LHFyY29kZS5pbWFnZWRhdGE9bnVsbCxxcmNvZGUud2lkdGg9MCxxcmNvZGUuaGVpZ2h0PTAscXJjb2RlLnFyQ29kZVN5bWJvbD1udWxsLHFyY29kZS5kZWJ1Zz0hMSxxcmNvZGUuc2l6ZU9mRGF0YUxlbmd0aEluZm89W1sxMCw5LDgsOF0sWzEyLDExLDE2LDEwXSxbMTQsMTMsMTYsMTJdXSxxcmNvZGUuY2FsbGJhY2s9bnVsbCxxcmNvZGUuZGVjb2RlPWZ1bmN0aW9uKHNyYyl7aWYoMD09YXJndW1lbnRzLmxlbmd0aCl7dmFyIGNhbnZhc19xcj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInFyLWNhbnZhc1wiKSxjb250ZXh0PWNhbnZhc19xci5nZXRDb250ZXh0KFwiMmRcIik7cmV0dXJuIHFyY29kZS53aWR0aD1jYW52YXNfcXIud2lkdGgscXJjb2RlLmhlaWdodD1jYW52YXNfcXIuaGVpZ2h0LHFyY29kZS5pbWFnZWRhdGE9Y29udGV4dC5nZXRJbWFnZURhdGEoMCwwLHFyY29kZS53aWR0aCxxcmNvZGUuaGVpZ2h0KSxxcmNvZGUucmVzdWx0PXFyY29kZS5wcm9jZXNzKGNvbnRleHQpLG51bGwhPXFyY29kZS5jYWxsYmFjayYmcXJjb2RlLmNhbGxiYWNrKHFyY29kZS5yZXN1bHQpLHFyY29kZS5yZXN1bHR9dmFyIGltYWdlPW5ldyBJbWFnZTtpbWFnZS5vbmxvYWQ9ZnVuY3Rpb24oKXt2YXIgY2FudmFzX3FyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiksY29udGV4dD1jYW52YXNfcXIuZ2V0Q29udGV4dChcIjJkXCIpLGNhbnZhc19vdXQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdXQtY2FudmFzXCIpO2lmKG51bGwhPWNhbnZhc19vdXQpe3ZhciBvdXRjdHg9Y2FudmFzX291dC5nZXRDb250ZXh0KFwiMmRcIik7b3V0Y3R4LmNsZWFyUmVjdCgwLDAsMzIwLDI0MCksb3V0Y3R4LmRyYXdJbWFnZShpbWFnZSwwLDAsMzIwLDI0MCl9Y2FudmFzX3FyLndpZHRoPWltYWdlLndpZHRoLGNhbnZhc19xci5oZWlnaHQ9aW1hZ2UuaGVpZ2h0LGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLDAsMCkscXJjb2RlLndpZHRoPWltYWdlLndpZHRoLHFyY29kZS5oZWlnaHQ9aW1hZ2UuaGVpZ2h0O3RyeXtxcmNvZGUuaW1hZ2VkYXRhPWNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsMCxpbWFnZS53aWR0aCxpbWFnZS5oZWlnaHQpfWNhdGNoKGUpe3JldHVybiBxcmNvZGUucmVzdWx0PVwiQ3Jvc3MgZG9tYWluIGltYWdlIHJlYWRpbmcgbm90IHN1cHBvcnRlZCBpbiB5b3VyIGJyb3dzZXIhIFNhdmUgaXQgdG8geW91ciBjb21wdXRlciB0aGVuIGRyYWcgYW5kIGRyb3AgdGhlIGZpbGUhXCIsdm9pZChudWxsIT1xcmNvZGUuY2FsbGJhY2smJnFyY29kZS5jYWxsYmFjayhxcmNvZGUucmVzdWx0KSl9dHJ5e3FyY29kZS5yZXN1bHQ9cXJjb2RlLnByb2Nlc3MoY29udGV4dCl9Y2F0Y2goZSl7Y29uc29sZS5sb2coZSkscXJjb2RlLnJlc3VsdD1cImVycm9yIGRlY29kaW5nIFFSIENvZGVcIn1udWxsIT1xcmNvZGUuY2FsbGJhY2smJnFyY29kZS5jYWxsYmFjayhxcmNvZGUucmVzdWx0KX0saW1hZ2Uuc3JjPXNyY30scXJjb2RlLmRlY29kZV91dGY4PWZ1bmN0aW9uKHMpe3JldHVybiBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKHMpKX0scXJjb2RlLnByb2Nlc3M9ZnVuY3Rpb24oY3R4KXt2YXIgc3RhcnQ9KG5ldyBEYXRlKS5nZXRUaW1lKCksaW1hZ2U9cXJjb2RlLmdyYXlTY2FsZVRvQml0bWFwKHFyY29kZS5ncmF5c2NhbGUoKSk7aWYocXJjb2RlLmRlYnVnKXtmb3IodmFyIHk9MDt5PHFyY29kZS5oZWlnaHQ7eSsrKWZvcih2YXIgeD0wO3g8cXJjb2RlLndpZHRoO3grKyl7dmFyIHBvaW50PTQqeCt5KnFyY29kZS53aWR0aCo0O3FyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludF09KGltYWdlW3greSpxcmNvZGUud2lkdGhdLDApLHFyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludCsxXT0oaW1hZ2VbeCt5KnFyY29kZS53aWR0aF0sMCkscXJjb2RlLmltYWdlZGF0YS5kYXRhW3BvaW50KzJdPWltYWdlW3greSpxcmNvZGUud2lkdGhdPzI1NTowfWN0eC5wdXRJbWFnZURhdGEocXJjb2RlLmltYWdlZGF0YSwwLDApfXZhciBkZXRlY3Rvcj1uZXcgRGV0ZWN0b3IoaW1hZ2UpLHFSQ29kZU1hdHJpeD1kZXRlY3Rvci5kZXRlY3QoKTtxcmNvZGUuZGVidWcmJmN0eC5wdXRJbWFnZURhdGEocXJjb2RlLmltYWdlZGF0YSwwLDApO2Zvcih2YXIgcmVhZGVyPURlY29kZXIuZGVjb2RlKHFSQ29kZU1hdHJpeC5iaXRzKSxkYXRhPXJlYWRlci5EYXRhQnl0ZSxzdHI9XCJcIixpPTA7aTxkYXRhLmxlbmd0aDtpKyspZm9yKHZhciBqPTA7ajxkYXRhW2ldLmxlbmd0aDtqKyspc3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGRhdGFbaV1bal0pO3ZhciBlbmQ9KG5ldyBEYXRlKS5nZXRUaW1lKCksdGltZT1lbmQtc3RhcnQ7cmV0dXJuIGNvbnNvbGUubG9nKHRpbWUpLHFyY29kZS5kZWNvZGVfdXRmOChzdHIpfSxxcmNvZGUuZ2V0UGl4ZWw9ZnVuY3Rpb24oeCx5KXtpZihxcmNvZGUud2lkdGg8eCl0aHJvd1wicG9pbnQgZXJyb3JcIjtpZihxcmNvZGUuaGVpZ2h0PHkpdGhyb3dcInBvaW50IGVycm9yXCI7cmV0dXJuIHBvaW50PTQqeCt5KnFyY29kZS53aWR0aCo0LHA9KDMzKnFyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludF0rMzQqcXJjb2RlLmltYWdlZGF0YS5kYXRhW3BvaW50KzFdKzMzKnFyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludCsyXSkvMTAwLHB9LHFyY29kZS5iaW5hcml6ZT1mdW5jdGlvbih0aCl7Zm9yKHZhciByZXQ9bmV3IEFycmF5KHFyY29kZS53aWR0aCpxcmNvZGUuaGVpZ2h0KSx5PTA7eTxxcmNvZGUuaGVpZ2h0O3krKylmb3IodmFyIHg9MDt4PHFyY29kZS53aWR0aDt4Kyspe3ZhciBncmF5PXFyY29kZS5nZXRQaXhlbCh4LHkpO3JldFt4K3kqcXJjb2RlLndpZHRoXT10aD49Z3JheT8hMDohMX1yZXR1cm4gcmV0fSxxcmNvZGUuZ2V0TWlkZGxlQnJpZ2h0bmVzc1BlckFyZWE9ZnVuY3Rpb24oaW1hZ2Upe2Zvcih2YXIgbnVtU3FydEFyZWE9NCxhcmVhV2lkdGg9TWF0aC5mbG9vcihxcmNvZGUud2lkdGgvbnVtU3FydEFyZWEpLGFyZWFIZWlnaHQ9TWF0aC5mbG9vcihxcmNvZGUuaGVpZ2h0L251bVNxcnRBcmVhKSxtaW5tYXg9bmV3IEFycmF5KG51bVNxcnRBcmVhKSxpPTA7bnVtU3FydEFyZWE+aTtpKyspe21pbm1heFtpXT1uZXcgQXJyYXkobnVtU3FydEFyZWEpO2Zvcih2YXIgaTI9MDtudW1TcXJ0QXJlYT5pMjtpMisrKW1pbm1heFtpXVtpMl09bmV3IEFycmF5KDAsMCl9Zm9yKHZhciBheT0wO251bVNxcnRBcmVhPmF5O2F5KyspZm9yKHZhciBheD0wO251bVNxcnRBcmVhPmF4O2F4Kyspe21pbm1heFtheF1bYXldWzBdPTI1NTtmb3IodmFyIGR5PTA7YXJlYUhlaWdodD5keTtkeSsrKWZvcih2YXIgZHg9MDthcmVhV2lkdGg+ZHg7ZHgrKyl7dmFyIHRhcmdldD1pbWFnZVthcmVhV2lkdGgqYXgrZHgrKGFyZWFIZWlnaHQqYXkrZHkpKnFyY29kZS53aWR0aF07dGFyZ2V0PG1pbm1heFtheF1bYXldWzBdJiYobWlubWF4W2F4XVtheV1bMF09dGFyZ2V0KSx0YXJnZXQ+bWlubWF4W2F4XVtheV1bMV0mJihtaW5tYXhbYXhdW2F5XVsxXT10YXJnZXQpfX1mb3IodmFyIG1pZGRsZT1uZXcgQXJyYXkobnVtU3FydEFyZWEpLGkzPTA7bnVtU3FydEFyZWE+aTM7aTMrKyltaWRkbGVbaTNdPW5ldyBBcnJheShudW1TcXJ0QXJlYSk7Zm9yKHZhciBheT0wO251bVNxcnRBcmVhPmF5O2F5KyspZm9yKHZhciBheD0wO251bVNxcnRBcmVhPmF4O2F4KyspbWlkZGxlW2F4XVtheV09TWF0aC5mbG9vcigobWlubWF4W2F4XVtheV1bMF0rbWlubWF4W2F4XVtheV1bMV0pLzIpO3JldHVybiBtaWRkbGV9LHFyY29kZS5ncmF5U2NhbGVUb0JpdG1hcD1mdW5jdGlvbihncmF5U2NhbGUpe2Zvcih2YXIgbWlkZGxlPXFyY29kZS5nZXRNaWRkbGVCcmlnaHRuZXNzUGVyQXJlYShncmF5U2NhbGUpLHNxcnROdW1BcmVhPW1pZGRsZS5sZW5ndGgsYXJlYVdpZHRoPU1hdGguZmxvb3IocXJjb2RlLndpZHRoL3NxcnROdW1BcmVhKSxhcmVhSGVpZ2h0PU1hdGguZmxvb3IocXJjb2RlLmhlaWdodC9zcXJ0TnVtQXJlYSksYml0bWFwPW5ldyBBcnJheShxcmNvZGUuaGVpZ2h0KnFyY29kZS53aWR0aCksYXk9MDtzcXJ0TnVtQXJlYT5heTtheSsrKWZvcih2YXIgYXg9MDtzcXJ0TnVtQXJlYT5heDtheCsrKWZvcih2YXIgZHk9MDthcmVhSGVpZ2h0PmR5O2R5KyspZm9yKHZhciBkeD0wO2FyZWFXaWR0aD5keDtkeCsrKWJpdG1hcFthcmVhV2lkdGgqYXgrZHgrKGFyZWFIZWlnaHQqYXkrZHkpKnFyY29kZS53aWR0aF09Z3JheVNjYWxlW2FyZWFXaWR0aCpheCtkeCsoYXJlYUhlaWdodCpheStkeSkqcXJjb2RlLndpZHRoXTxtaWRkbGVbYXhdW2F5XT8hMDohMTtcclxuICAgIHJldHVybiBiaXRtYXB9LHFyY29kZS5ncmF5c2NhbGU9ZnVuY3Rpb24oKXtmb3IodmFyIHJldD1uZXcgQXJyYXkocXJjb2RlLndpZHRoKnFyY29kZS5oZWlnaHQpLHk9MDt5PHFyY29kZS5oZWlnaHQ7eSsrKWZvcih2YXIgeD0wO3g8cXJjb2RlLndpZHRoO3grKyl7dmFyIGdyYXk9cXJjb2RlLmdldFBpeGVsKHgseSk7cmV0W3greSpxcmNvZGUud2lkdGhdPWdyYXl9cmV0dXJuIHJldH0sQXJyYXkucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbihmcm9tLHRvKXt2YXIgcmVzdD10aGlzLnNsaWNlKCh0b3x8ZnJvbSkrMXx8dGhpcy5sZW5ndGgpO3JldHVybiB0aGlzLmxlbmd0aD0wPmZyb20/dGhpcy5sZW5ndGgrZnJvbTpmcm9tLHRoaXMucHVzaC5hcHBseSh0aGlzLHJlc3QpfTt2YXIgTUlOX1NLSVA9MyxNQVhfTU9EVUxFUz01NyxJTlRFR0VSX01BVEhfU0hJRlQ9OCxDRU5URVJfUVVPUlVNPTI7cXJjb2RlLm9yZGVyQmVzdFBhdHRlcm5zPWZ1bmN0aW9uKHBhdHRlcm5zKXtmdW5jdGlvbiBkaXN0YW5jZShwYXR0ZXJuMSxwYXR0ZXJuMil7cmV0dXJuIHhEaWZmPXBhdHRlcm4xLlgtcGF0dGVybjIuWCx5RGlmZj1wYXR0ZXJuMS5ZLXBhdHRlcm4yLlksTWF0aC5zcXJ0KHhEaWZmKnhEaWZmK3lEaWZmKnlEaWZmKX1mdW5jdGlvbiBjcm9zc1Byb2R1Y3RaKHBvaW50QSxwb2ludEIscG9pbnRDKXt2YXIgYlg9cG9pbnRCLngsYlk9cG9pbnRCLnk7cmV0dXJuKHBvaW50Qy54LWJYKSoocG9pbnRBLnktYlkpLShwb2ludEMueS1iWSkqKHBvaW50QS54LWJYKX12YXIgcG9pbnRBLHBvaW50Qixwb2ludEMsemVyb09uZURpc3RhbmNlPWRpc3RhbmNlKHBhdHRlcm5zWzBdLHBhdHRlcm5zWzFdKSxvbmVUd29EaXN0YW5jZT1kaXN0YW5jZShwYXR0ZXJuc1sxXSxwYXR0ZXJuc1syXSksemVyb1R3b0Rpc3RhbmNlPWRpc3RhbmNlKHBhdHRlcm5zWzBdLHBhdHRlcm5zWzJdKTtpZihvbmVUd29EaXN0YW5jZT49emVyb09uZURpc3RhbmNlJiZvbmVUd29EaXN0YW5jZT49emVyb1R3b0Rpc3RhbmNlPyhwb2ludEI9cGF0dGVybnNbMF0scG9pbnRBPXBhdHRlcm5zWzFdLHBvaW50Qz1wYXR0ZXJuc1syXSk6emVyb1R3b0Rpc3RhbmNlPj1vbmVUd29EaXN0YW5jZSYmemVyb1R3b0Rpc3RhbmNlPj16ZXJvT25lRGlzdGFuY2U/KHBvaW50Qj1wYXR0ZXJuc1sxXSxwb2ludEE9cGF0dGVybnNbMF0scG9pbnRDPXBhdHRlcm5zWzJdKToocG9pbnRCPXBhdHRlcm5zWzJdLHBvaW50QT1wYXR0ZXJuc1swXSxwb2ludEM9cGF0dGVybnNbMV0pLGNyb3NzUHJvZHVjdFoocG9pbnRBLHBvaW50Qixwb2ludEMpPDApe3ZhciB0ZW1wPXBvaW50QTtwb2ludEE9cG9pbnRDLHBvaW50Qz10ZW1wfXBhdHRlcm5zWzBdPXBvaW50QSxwYXR0ZXJuc1sxXT1wb2ludEIscGF0dGVybnNbMl09cG9pbnRDfTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuZmFjdG9yeSgnQXV0aFNlcnZpY2UnLCBbXHJcbiAgICAnJGh0dHAnLFxyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnJHdpbmRvdycsXHJcbiAgICAnU2Vzc2lvbicsXHJcbiAgICBmdW5jdGlvbigkaHR0cCwgJHJvb3RTY29wZSwgJHN0YXRlLCAkd2luZG93LCBTZXNzaW9uKSB7XHJcbiAgICAgIHZhciBhdXRoU2VydmljZSA9IHt9O1xyXG5cclxuICAgICAgZnVuY3Rpb24gbG9naW5TdWNjZXNzKGRhdGEsIGNiLCB2b2x1bnRlZXIpe1xyXG4gICAgICAgIC8vIFdpbm5lciB3aW5uZXIgeW91IGdldCBhIHRva2VuXHJcbiAgICAgICAgaWYoIXZvbHVudGVlcikge1Nlc3Npb24uY3JlYXRlKGRhdGEudG9rZW4sIGRhdGEudXNlcik7fVxyXG5cclxuICAgICAgICBpZiAoY2Ipe1xyXG4gICAgICAgICAgY2IoZGF0YS51c2VyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGxvZ2luRmFpbHVyZShkYXRhLCBjYiwgdm9sdW50ZWVyKXtcclxuICAgICAgICBpZighdm9sdW50ZWVyKSB7JHN0YXRlLmdvKCdob21lJyk7fVxyXG4gICAgICAgIGlmIChjYikge1xyXG4gICAgICAgICAgY2IoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBhdXRoU2VydmljZS5sb2dpbldpdGhQYXNzd29yZCA9IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZCwgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHBcclxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9sb2dpbicsIHtcclxuICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2luU3VjY2VzcyhyZXNwb25zZS5kYXRhLCBvblN1Y2Nlc3MpO1xyXG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBsb2dpbkZhaWx1cmUocmVzcG9uc2UuZGF0YSwgb25GYWlsdXJlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgYXV0aFNlcnZpY2UubG9naW5XaXRoVG9rZW4gPSBmdW5jdGlvbih0b2tlbiwgb25TdWNjZXNzLCBvbkZhaWx1cmUpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cFxyXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL2xvZ2luJywge1xyXG4gICAgICAgICAgICB0b2tlbjogdG9rZW5cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2luU3VjY2VzcyhyZXNwb25zZS5kYXRhLCBvblN1Y2Nlc3MpO1xyXG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgICBTZXNzaW9uLmRlc3Ryb3kobG9naW5GYWlsdXJlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBhdXRoU2VydmljZS5sb2dvdXQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgIC8vIENsZWFyIHRoZSBzZXNzaW9uXHJcbiAgICAgICAgU2Vzc2lvbi5kZXN0cm95KGNhbGxiYWNrKTtcclxuICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGF1dGhTZXJ2aWNlLnJlZ2lzdGVyID0gZnVuY3Rpb24oZW1haWwsIHBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSAsdm9sdW50ZWVyKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwXHJcbiAgICAgICAgICAucG9zdCgnL2F1dGgvcmVnaXN0ZXInLCB7XHJcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxyXG4gICAgICAgICAgICB2b2x1bnRlZXI6IHZvbHVudGVlcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2luU3VjY2VzcyhyZXNwb25zZS5kYXRhLCBvblN1Y2Nlc3MsIHZvbHVudGVlcik7XHJcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2luRmFpbHVyZShyZXNwb25zZS5kYXRhLCBvbkZhaWx1cmUsIHZvbHVudGVlcik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGF1dGhTZXJ2aWNlLnZlcmlmeSA9IGZ1bmN0aW9uKHRva2VuLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cFxyXG4gICAgICAgICAgLmdldCgnL2F1dGgvdmVyaWZ5LycgKyB0b2tlbilcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgU2Vzc2lvbi5zZXRVc2VyKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICBpZiAob25TdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgb25TdWNjZXNzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChvbkZhaWx1cmUpIHtcclxuICAgICAgICAgICAgICBvbkZhaWx1cmUocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgYXV0aFNlcnZpY2UucmVzZW5kVmVyaWZpY2F0aW9uRW1haWwgPSBmdW5jdGlvbihvblN1Y2Nlc3MsIG9uRmFpbHVyZSl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwXHJcbiAgICAgICAgICAucG9zdCgnL2F1dGgvdmVyaWZ5L3Jlc2VuZCcsIHtcclxuICAgICAgICAgICAgaWQ6IFNlc3Npb24uZ2V0VXNlcklkKClcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgYXV0aFNlcnZpY2Uuc2VuZFJlc2V0RW1haWwgPSBmdW5jdGlvbihlbWFpbCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwXHJcbiAgICAgICAgICAucG9zdCgnL2F1dGgvcmVzZXQnLCB7XHJcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBhdXRoU2VydmljZS5yZXNldFBhc3N3b3JkID0gZnVuY3Rpb24odG9rZW4sIHBhc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKXtcclxuICAgICAgICByZXR1cm4gJGh0dHBcclxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9yZXNldC9wYXNzd29yZCcsIHtcclxuICAgICAgICAgICAgdG9rZW46IHRva2VuLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC50aGVuKG9uU3VjY2Vzcywgb25GYWlsdXJlKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiBhdXRoU2VydmljZTtcclxuICAgIH1cclxuICBdKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpLmZhY3RvcnkoXCJDaGFsbGVuZ2VTZXJ2aWNlXCIsIFtcclxuICAgIFwiJGh0dHBcIixcclxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XHJcbiAgICAgIHZhciBjaGFsbGVuZ2VzID0gXCIvYXBpL2NoYWxsZW5nZXNcIjtcclxuICAgICAgdmFyIGJhc2UgPSBjaGFsbGVuZ2VzICsgXCIvXCI7XHJcbiAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vIEJhc2ljIEFjdGlvbnNcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oY0RhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoY2hhbGxlbmdlcyArIFwiL2NyZWF0ZVwiLCB7XHJcbiAgICAgICAgICAgICAgY0RhdGE6IGNEYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oaWQsIGNEYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3VwZGF0ZVwiLCB7XHJcbiAgICAgICAgICAgICAgY0RhdGE6IGNEYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvcmVtb3ZlXCIpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldDogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0QWxsOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRBbnN3ZXI6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZCArIFwiL2Fuc3dlclwiKTtcclxuICAgICAgICB9LFxyXG5cclxuICBcclxuICAgICAgfTtcclxuICAgIH1cclxuICBdKTtcclxuICAiLCJhbmd1bGFyLm1vZHVsZSgncmVnJykuZmFjdG9yeShcIk1hcmtldGluZ1NlcnZpY2VcIiwgW1xyXG4gICAgXCIkaHR0cFwiLFxyXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcclxuICAgICAgdmFyIG1hcmtldGluZyA9IFwiL2FwaS9tYXJrZXRpbmdcIjtcclxuICAgICAgdmFyIGJhc2UgPSBtYXJrZXRpbmcgKyBcIi9cIjtcclxuICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8gQmFzaWMgQWN0aW9uc1xyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgY3JlYXRlVGVhbTogZnVuY3Rpb24odGVhbURhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QobWFya2V0aW5nICsgXCIvY3JlYXRlVGVhbVwiLCB7XHJcbiAgICAgICAgICAgICAgdGVhbURhdGE6IHRlYW1EYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNlbmRGcmllbmRJbnZpdGU6IGZ1bmN0aW9uKHVzZXJuYW1lLHRlYW1tYXRlKXtcclxuICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KG1hcmtldGluZyArIFwiL3NlbmRJbnZpdGVcIiwge1xyXG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXHJcbiAgICAgICAgICAgIHRlYW1tYXRlOiB0ZWFtbWF0ZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIF0pO1xyXG4gICIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKSBcclxuICAuZmFjdG9yeSgnU2V0dGluZ3NTZXJ2aWNlJywgW1xyXG4gICckaHR0cCcsXHJcbiAgZnVuY3Rpb24oJGh0dHApe1xyXG5cclxuICAgIHZhciBiYXNlID0gJy9hcGkvc2V0dGluZ3MvJztcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBnZXRQdWJsaWNTZXR0aW5nczogZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xyXG4gICAgICB9LFxyXG4gICAgICB1cGRhdGVSZWdpc3RyYXRpb25UaW1lczogZnVuY3Rpb24ob3BlbiwgY2xvc2Upe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICd0aW1lcycsIHtcclxuICAgICAgICAgIHRpbWVPcGVuOiBvcGVuLFxyXG4gICAgICAgICAgdGltZUNsb3NlOiBjbG9zZSxcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlQ29uZmlybWF0aW9uVGltZTogZnVuY3Rpb24odGltZSl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2NvbmZpcm0tYnknLCB7XHJcbiAgICAgICAgICB0aW1lOiB0aW1lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZVN0YXJ0VGltZTogZnVuY3Rpb24odGltZSl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ3RpbWVTdGFydCcsIHtcclxuICAgICAgICAgIHRpbWU6IHRpbWVcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgZ2V0V2hpdGVsaXN0ZWRFbWFpbHM6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgJ3doaXRlbGlzdCcpO1xyXG4gICAgICB9LFxyXG4gICAgICB1cGRhdGVXaGl0ZWxpc3RlZEVtYWlsczogZnVuY3Rpb24oZW1haWxzKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnd2hpdGVsaXN0Jywge1xyXG4gICAgICAgICAgZW1haWxzOiBlbWFpbHNcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlV2FpdGxpc3RUZXh0OiBmdW5jdGlvbih0ZXh0KXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnd2FpdGxpc3QnLCB7XHJcbiAgICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZUFjY2VwdGFuY2VUZXh0OiBmdW5jdGlvbih0ZXh0KXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnYWNjZXB0YW5jZScsIHtcclxuICAgICAgICAgIHRleHQ6IHRleHRcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHVwZGF0ZUhvc3RTY2hvb2w6IGZ1bmN0aW9uKGhvc3RTY2hvb2wpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICdob3N0U2Nob29sJywge1xyXG4gICAgICAgICAgaG9zdFNjaG9vbDogaG9zdFNjaG9vbFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgdXBkYXRlQ29uZmlybWF0aW9uVGV4dDogZnVuY3Rpb24odGV4dCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2NvbmZpcm1hdGlvbicsIHtcclxuICAgICAgICAgIHRleHQ6IHRleHRcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlQWxsb3dNaW5vcnM6IGZ1bmN0aW9uKGFsbG93TWlub3JzKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnbWlub3JzJywgeyBcclxuICAgICAgICAgIGFsbG93TWlub3JzOiBhbGxvd01pbm9ycyBcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgIH07XHJcblxyXG4gIH1cclxuICBdKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpLmZhY3RvcnkoXCJTb2x2ZWRDVEZTZXJ2aWNlXCIsIFtcclxuICAgIFwiJGh0dHBcIixcclxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XHJcbiAgICAgIHZhciBDVEYgPSBcIi9hcGkvQ1RGXCI7XHJcbiAgICAgIHZhciBiYXNlID0gQ1RGICsgXCIvXCI7XHJcbiAgXHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAvLyBCYXNpYyBBY3Rpb25zXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICBzb2x2ZTogZnVuY3Rpb24oY2hhbGxlbmdlLCB1c2VyLCBhbnN3ZXIsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KENURiArIFwiL3NvbHZlXCIsIHtcclxuICAgICAgICAgICAgICAgIGNoYWxsZW5nZTogY2hhbGxlbmdlLCBcclxuICAgICAgICAgICAgICAgIHVzZXIgOiB1c2VyLFxyXG4gICAgICAgICAgICAgICAgYW5zd2VyIDogYW5zd2VyLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgb25TdWNjZXNzKGNoYWxsZW5nZSk7XHJcbiAgICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICBvbkZhaWx1cmUocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KENURik7XHJcbiAgICAgICAgfSxcclxuICAgIFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIF0pO1xyXG4gICIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKS5mYWN0b3J5KFwiVGVhbVNlcnZpY2VcIiwgW1xyXG4gICAgXCIkaHR0cFwiLFxyXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcclxuICAgICAgdmFyIHRlYW1zID0gXCIvYXBpL3RlYW1zXCI7XHJcbiAgICAgIHZhciBiYXNlID0gdGVhbXMgKyBcIi9cIjtcclxuICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8gQmFzaWMgQWN0aW9uc1xyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgY3JlYXRlOiBmdW5jdGlvbih0ZWFtRGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCh0ZWFtcyArIFwiL2NyZWF0ZVwiLCB7XHJcbiAgICAgICAgICAgICAgdGVhbURhdGE6IHRlYW1EYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEFsbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oaWQsIGNEYXRhKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi91cGRhdGVcIiwge1xyXG4gICAgICAgICAgICBjRGF0YTogY0RhdGFcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGpvaW46IGZ1bmN0aW9uKGlkLCBuZXd1c2VyKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZClcclxuICAgICAgICAgIC50aGVuKHRlYW0gPT4ge1xyXG4gICAgICAgICAgICB0ZWFtLmRhdGEuam9pblJlcXVlc3RzLnB1c2gobmV3dXNlcilcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdXBkYXRlam9pbmVkXCIsIHtcclxuICAgICAgICAgICAgICBuZXdqb2luUmVxdWVzdHM6IHRlYW0uZGF0YS5qb2luUmVxdWVzdHNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHJlbW92ZWpvaW46IGZ1bmN0aW9uKGlkLCBpbmRleCwgdXNlcikge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpXHJcbiAgICAgICAgICAudGhlbih0ZWFtID0+IHtcclxuICAgICAgICAgICAgdGVhbS5kYXRhLmpvaW5SZXF1ZXN0cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICBpZiAoISh1c2VyPT1mYWxzZSkpe1xyXG4gICAgICAgICAgICAgICRodHRwLnBvc3QodGVhbXMgKyBcIi9zZW5kUmVmdXNlZFRlYW1cIiwge1xyXG4gICAgICAgICAgICAgICAgaWQ6IHVzZXIuaWQsXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdXBkYXRlam9pbmVkXCIsIHtcclxuICAgICAgICAgICAgICBuZXdqb2luUmVxdWVzdHM6IHRlYW0uZGF0YS5qb2luUmVxdWVzdHNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGFjY2VwdE1lbWJlcjogZnVuY3Rpb24oaWQsIG5ld3VzZXIsbWF4VGVhbVNpemUpIHtcclxuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIGlkKVxyXG4gICAgICAgICAgLnRoZW4odGVhbSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0ZWFtLmRhdGEubWVtYmVycy5sZW5ndGg+PW1heFRlYW1TaXplKXsgcmV0dXJuICdtYXhUZWFtU2l6ZScgfVxyXG5cclxuICAgICAgICAgICAgdGVhbS5kYXRhLm1lbWJlcnMucHVzaChuZXd1c2VyKVxyXG4gICAgICAgICAgICAkaHR0cC5wb3N0KHRlYW1zICsgXCIvc2VuZEFjY2VwdGVkVGVhbVwiLCB7XHJcbiAgICAgICAgICAgICAgaWQ6IG5ld3VzZXIuaWQsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi91cGRhdGVNZW1iZXJzXCIsIHtcclxuICAgICAgICAgICAgICBuZXdNZW1iZXJzOiB0ZWFtLmRhdGEubWVtYmVycyxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHJlbW92ZW1lbWJlcjogZnVuY3Rpb24oaWQsIGluZGV4LCB1c2VySUQpIHtcclxuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIGlkKVxyXG4gICAgICAgICAgLnRoZW4odGVhbSA9PiB7XHJcbiAgICAgICAgICAgIHZhciByZW1vdmVkVXNlciA9IHRlYW0uZGF0YS5tZW1iZXJzW2luZGV4XVxyXG4gICAgICAgICAgICBpZiAoaW5kZXg9PTApe3JldHVybiBcInJlbW92aW5nQWRtaW5cIn1cclxuICAgICAgICAgICAgdGVhbS5kYXRhLm1lbWJlcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgaWYgKCF1c2VySUQpe1xyXG4gICAgICAgICAgICAgICRodHRwLnBvc3QodGVhbXMgKyBcIi9zZW5kQWRtaW5SZW1vdmVkVGVhbVwiLCB7XHJcbiAgICAgICAgICAgICAgICBpZDogdGVhbS5kYXRhLm1lbWJlcnNbMF0uaWQsXHJcbiAgICAgICAgICAgICAgICBtZW1iZXI6IHJlbW92ZWRVc2VyLm5hbWVcclxuICAgICAgICAgICAgICB9KTsgIFxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAkaHR0cC5wb3N0KHRlYW1zICsgXCIvc2VuZFJlbW92ZWRUZWFtXCIsIHtcclxuICAgICAgICAgICAgICAgIGlkOiB1c2VySUQsXHJcbiAgICAgICAgICAgICAgfSk7ICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi91cGRhdGVNZW1iZXJzXCIsIHtcclxuICAgICAgICAgICAgICBuZXdNZW1iZXJzOiB0ZWFtLmRhdGEubWVtYmVycyxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlbW92ZVwiKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgICB0b2dnbGVDbG9zZVRlYW06IGZ1bmN0aW9uKGlkLCBzdGF0dXMpIHtcclxuICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3RvZ2dsZUNsb3NlVGVhbVwiLCB7XHJcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB0b2dnbGVIaWRlVGVhbTogZnVuY3Rpb24oaWQsIHN0YXR1cykge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdG9nZ2xlSGlkZVRlYW1cIiwge1xyXG4gICAgICAgICAgICBzdGF0dXM6IHN0YXR1c1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0U2VsZWN0ZWRUZWFtczogZnVuY3Rpb24odGV4dCxza2lsbHNGaWx0ZXJzKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCB0ZWFtcyArIFwiP1wiICsgJC5wYXJhbSh7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICAgICAgc2VhcmNoOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2tpbGxzRmlsdGVyczogc2tpbGxzRmlsdGVycyA/IHNraWxsc0ZpbHRlcnMgOiB7fVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0sIFxyXG4gIFxyXG5cclxuXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgXSk7XHJcbiAgIiwiYW5ndWxhci5tb2R1bGUoXCJyZWdcIikuZmFjdG9yeShcIlVzZXJTZXJ2aWNlXCIsIFtcclxuICBcIiRodHRwXCIsXHJcbiAgXCJTZXNzaW9uXCIsXHJcbiAgZnVuY3Rpb24oJGh0dHAsIFNlc3Npb24pIHtcclxuICAgIHZhciB1c2VycyA9IFwiL2FwaS91c2Vyc1wiO1xyXG4gICAgdmFyIGJhc2UgPSB1c2VycyArIFwiL1wiO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgLy8gQmFzaWMgQWN0aW9uc1xyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIGdldEN1cnJlbnRVc2VyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBTZXNzaW9uLmdldFVzZXJJZCgpKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldDogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZCk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRQYWdlOiBmdW5jdGlvbihwYWdlLCBzaXplLCB0ZXh0LHN0YXR1c0ZpbHRlcnMsTm90c3RhdHVzRmlsdGVycykge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoIHVzZXJzICsgXCI/XCIgKyAkLnBhcmFtKHtcclxuICAgICAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICAgIHBhZ2U6IHBhZ2UgPyBwYWdlIDogMCxcclxuICAgICAgICAgICAgICBzaXplOiBzaXplID8gc2l6ZSA6IDIwLFxyXG4gICAgICAgICAgICAgIHN0YXR1c0ZpbHRlcnM6IHN0YXR1c0ZpbHRlcnMgPyBzdGF0dXNGaWx0ZXJzIDoge30sXHJcbiAgICAgICAgICAgICAgTm90c3RhdHVzRmlsdGVyczogTm90c3RhdHVzRmlsdGVycyA/IE5vdHN0YXR1c0ZpbHRlcnMgOiB7fVxyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgdXBkYXRlUHJvZmlsZTogZnVuY3Rpb24oaWQsIHByb2ZpbGUpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyBpZCArIFwiL3Byb2ZpbGVcIiwge1xyXG4gICAgICAgICAgcHJvZmlsZTogcHJvZmlsZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgdXBkYXRlQ29uZmlybWF0aW9uOiBmdW5jdGlvbihpZCwgY29uZmlybWF0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgaWQgKyBcIi9jb25maXJtXCIsIHtcclxuICAgICAgICAgIGNvbmZpcm1hdGlvbjogY29uZmlybWF0aW9uXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB1cGRhdGVBbGw6IGZ1bmN0aW9uKGlkLCB1c2VyKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgaWQgKyBcIi91cGRhdGVhbGxcIiwge1xyXG4gICAgICAgICAgdXNlcjogdXNlclxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZGVjbGluZUFkbWlzc2lvbjogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9kZWNsaW5lXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAvLyBBZG1pbiBPbmx5XHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgIGdldFN0YXRzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBcInN0YXRzXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0VGVhbVN0YXRzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBcInRlYW1TdGF0c1wiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkbWl0VXNlcjogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9hZG1pdFwiKTtcclxuICAgICAgfSxcclxuICAgICAgcmVqZWN0VXNlcjogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZWplY3RcIik7XHJcbiAgICAgIH0sXHJcbiAgICAgIHNvZnRBZG1pdHRVc2VyOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3NvZnRBZG1pdFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNvZnRSZWplY3RVc2VyOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3NvZnRSZWplY3RcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzZW5kQmFzaWNNYWlsOiBmdW5jdGlvbihpZCAsIGVtYWlsKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvc2VuZEJhc2ljTWFpbFwiLEpTT04uc3RyaW5naWZ5KGVtYWlsKSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjaGVja0luOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL2NoZWNraW5cIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjaGVja091dDogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9jaGVja291dFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlbW92ZVVzZXI6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvcmVtb3ZldXNlclwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1ha2VBZG1pbjogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9tYWtlYWRtaW5cIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZW1vdmVBZG1pbjogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZW1vdmVhZG1pblwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1hc3NSZWplY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcIm1hc3NSZWplY3RcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRSZWplY3Rpb25Db3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgXCJyZWplY3Rpb25Db3VudFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldExhdGVyUmVqZWN0ZWRDb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgXCJsYXRlclJlamVjdENvdW50XCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgbWFzc1JlamVjdFJlc3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcIm1hc3NSZWplY3RSZXN0XCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0UmVzdFJlamVjdGlvbkNvdW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBcInJlamVjdGlvbkNvdW50UmVzdFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlamVjdDogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZWplY3RcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzZW5kTGFnZ2VyRW1haWxzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgXCJzZW5kbGFnZW1haWxzXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2VuZFJlamVjdEVtYWlsczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIFwic2VuZFJlamVjdEVtYWlsc1wiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNlbmRSZWplY3RFbWFpbHNSZXN0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgXCJzZW5kUmVqZWN0RW1haWxzUmVzdFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNlbmRSZWplY3RFbWFpbDogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZWplY3RFbWFpbFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNlbmRQYXNzd29yZFJlc2V0RW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIFwic2VuZFJlc2V0RW1haWxcIiwgeyBlbWFpbDogZW1haWwgfSk7XHJcbiAgICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICB9O1xyXG4gIH1cclxuXSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdhZG1pbkNoYWxsZW5nZUN0cmwnLFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRodHRwJyxcclxuICAgICdjaGFsbGVuZ2UnLFxyXG4gICAgJ0NoYWxsZW5nZVNlcnZpY2UnLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgY2hhbGxlbmdlLCBDaGFsbGVuZ2VTZXJ2aWNlKXtcclxuICAgICAgJHNjb3BlLnNlbGVjdGVkY2hhbGxlbmdlID0gY2hhbGxlbmdlLmRhdGE7XHJcbiAgICAgIFxyXG4gICAgICBDaGFsbGVuZ2VTZXJ2aWNlLmdldEFuc3dlcihjaGFsbGVuZ2UuZGF0YS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICRzY29wZS5zZWxlY3RlZGNoYWxsZW5nZS5hbnN3ZXIgPSByZXNwb25zZS5kYXRhLmFuc3dlcjtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkc2NvcGUudG9nZ2xlUGFzc3dvcmQgPSBmdW5jdGlvbiAoKSB7ICRzY29wZS50eXBlUGFzc3dvcmQgPSAhJHNjb3BlLnR5cGVQYXNzd29yZDsgfTtcclxuXHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlQ2hhbGxlbmdlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBDaGFsbGVuZ2VTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlKCRzY29wZS5zZWxlY3RlZGNoYWxsZW5nZS5faWQsICRzY29wZS5zZWxlY3RlZGNoYWxsZW5nZSlcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNlbGVjdGVkY2hhbGxlbmdlID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcIlVwZGF0ZWQhXCIsIFwiQ2hhbGxlbmdlIHVwZGF0ZWQuXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIk9vcHMsIHlvdSBmb3Jnb3Qgc29tZXRoaW5nLlwiKTtcclxuICAgICAgICAgIH0pOyAgXHJcbiAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZShcInJlZ1wiKS5jb250cm9sbGVyKFwiYWRtaW5DaGFsbGVuZ2VzQ3RybFwiLCBbXHJcbiAgXCIkc2NvcGVcIixcclxuICBcIiRzdGF0ZVwiLFxyXG4gIFwiJHN0YXRlUGFyYW1zXCIsXHJcbiAgXCJDaGFsbGVuZ2VTZXJ2aWNlXCIsXHJcbiAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgQ2hhbGxlbmdlU2VydmljZSkge1xyXG5cclxuICAgICRzY29wZS5jaGFsbGVuZ2VzID0gW107XHJcblxyXG4gICAgLy8gU2VtYW50aWMtVUkgbW92ZXMgbW9kYWwgY29udGVudCBpbnRvIGEgZGltbWVyIGF0IHRoZSB0b3AgbGV2ZWwuXHJcbiAgICAvLyBXaGlsZSB0aGlzIGlzIHVzdWFsbHkgbmljZSwgaXQgbWVhbnMgdGhhdCB3aXRoIG91ciByb3V0aW5nIHdpbGwgZ2VuZXJhdGVcclxuICAgIC8vIG11bHRpcGxlIG1vZGFscyBpZiB5b3UgY2hhbmdlIHN0YXRlLiBLaWxsIHRoZSB0b3AgbGV2ZWwgZGltbWVyIG5vZGUgb24gaW5pdGlhbCBsb2FkXHJcbiAgICAvLyB0byBwcmV2ZW50IHRoaXMuXHJcbiAgICAkKFwiLnVpLmRpbW1lclwiKS5yZW1vdmUoKTtcclxuICAgIC8vIFBvcHVsYXRlIHRoZSBzaXplIG9mIHRoZSBtb2RhbCBmb3Igd2hlbiBpdCBhcHBlYXJzLCB3aXRoIGFuIGFyYml0cmFyeSBDaGFsbGVuZ2UuXHJcblxyXG4gICAgZnVuY3Rpb24gcmVmcmVzaFBhZ2UoKSB7XHJcbiAgICAgIENoYWxsZW5nZVNlcnZpY2UuZ2V0QWxsKCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgJHNjb3BlLmNoYWxsZW5nZXMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZWZyZXNoUGFnZSgpO1xyXG5cclxuICAgICRzY29wZS5nb0NoYWxsZW5nZSA9IGZ1bmN0aW9uKCRldmVudCwgY2hhbGxlbmdlKSB7XHJcblxyXG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICRzdGF0ZS5nbyhcImFwcC5hZG1pbi5jaGFsbGVuZ2VcIiwge1xyXG4gICAgICAgIGlkOiBjaGFsbGVuZ2UuX2lkXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5jcmVhdGVDaGFsbGVuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgIHN3YWwoXCJXcml0ZSB0aGUgY2hhbGxlbmdlIHRpdGxlOlwiLCB7XHJcbiAgICAgICAgYnV0dG9uczoge2NhbmNlbDoge3RleHQ6IFwiQ2FuY2VsXCIsdmFsdWU6IG51bGwsdmlzaWJsZTogdHJ1ZX0sIHllczoge3RleHQ6IFwiTmV4dCBpbnB1dFwiLHZhbHVlOiB0cnVlLHZpc2libGU6IHRydWV9IH0sXHJcbiAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcIkdpdmUgdGhpcyBjaGFsbGVuZ2UgYSBzZXh5IG5hbWUuLlwiLHR5cGU6IFwidGV4dFwifSB9LFxyXG4gICAgICB9KVxyXG4gICAgICAudGhlbigodGl0bGUpID0+IHsgaWYgKCF0aXRsZSkge3JldHVybjt9XHJcbiAgICAgICAgc3dhbChcIkVudGVyIHRoZSBjaGFsbGVuZ2UgZGVzY3JpcHRpb246XCIsIHtcclxuICAgICAgICAgIGJ1dHRvbnM6IHtjYW5jZWw6IHt0ZXh0OiBcIkNhbmNlbFwiLHZhbHVlOiBudWxsLHZpc2libGU6IHRydWV9LCB5ZXM6IHt0ZXh0OiBcIk5leHQgaW5wdXRcIix2YWx1ZTogdHJ1ZSx2aXNpYmxlOiB0cnVlfSB9LFxyXG4gICAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcIkRlc2NyaWJlIHRoaXMgY2hhbGxlbmdlIHNvIHRoYXQgcGVvcGxlIGNhbiBnZXQgdGhlIGlkZWEuLlwiLHR5cGU6IFwidGV4dFwifSB9LFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoZGVzY3JpcHRpb24pID0+IHsgaWYgKCFkZXNjcmlwdGlvbikge3JldHVybjt9XHJcbiAgICAgICAgICBzd2FsKFwiRW50ZXIgdGhlIGNoYWxsZW5nZSBkZXBlbmRlbmN5IChMSU5LKTpcIiwge1xyXG4gICAgICAgICAgICBidXR0b25zOiB7Y2FuY2VsOiB7dGV4dDogXCJDYW5jZWxcIix2YWx1ZTogbnVsbCx2aXNpYmxlOiB0cnVlfSwgeWVzOiB7dGV4dDogXCJOZXh0IGlucHV0XCIsdmFsdWU6IHRydWUsdmlzaWJsZTogdHJ1ZX0gfSxcclxuICAgICAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vQ2hhbGxlbmdlNDIuemlwXCIsdHlwZTogXCJ0ZXh0XCJ9IH0sXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbigoZGVwZW5kZW5jeSkgPT4geyBpZiAoIWRlcGVuZGVuY3kpIHtyZXR1cm47fVxyXG4gICAgICAgICAgICBzd2FsKFwiRW50ZXIgdGhlIGFuc3dlcjpcIiwge1xyXG4gICAgICAgICAgICAgIGJ1dHRvbnM6IHtjYW5jZWw6IHt0ZXh0OiBcIkNhbmNlbFwiLHZhbHVlOiBudWxsLHZpc2libGU6IHRydWV9LCB5ZXM6IHt0ZXh0OiBcIk5leHQgaW5wdXRcIix2YWx1ZTogdHJ1ZSx2aXNpYmxlOiB0cnVlfSB9LFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6IHtlbGVtZW50OiBcImlucHV0XCIsIGF0dHJpYnV0ZXM6IHtwbGFjZWhvbGRlcjogXCJzaGhoaCB0aGlzIHNpIHN1cGVyIHNlY3JldCBicm9cIix0eXBlOiBcInRleHRcIn0gfSxcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbigoYW5zd2VyKSA9PiB7IGlmICghYW5zd2VyKSB7cmV0dXJuO31cclxuICAgICAgICAgICAgICBzd2FsKFwiRW50ZXIgdGhlIG51bWJlciBvZiBwb2ludHMgZm9yIHRoaXMgY2hhbGxlbmdlOlwiLCB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7Y2FuY2VsOiB7dGV4dDogXCJDYW5jZWxcIix2YWx1ZTogbnVsbCx2aXNpYmxlOiB0cnVlfSwgeWVzOiB7dGV4dDogXCJOZXh0IGlucHV0XCIsdmFsdWU6IHRydWUsdmlzaWJsZTogdHJ1ZX0gfSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHtlbGVtZW50OiBcImlucHV0XCIsIGF0dHJpYnV0ZXM6IHtwbGFjZWhvbGRlcjogXCJQb2ludHMgYXdhcmRlZCB0byBjaGFsbGVuZ2Ugc29sdmVyc1wiLHR5cGU6IFwibnVtYmVyXCJ9IH0sXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIC50aGVuKChwb2ludHMpID0+IHsgaWYgKCFwb2ludHMpIHtyZXR1cm47fVxyXG4gIFxyXG4gICAgICAgICAgICAgICAgY0RhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlOnRpdGxlLFxyXG4gICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjpkZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jeTpkZXBlbmRlbmN5LFxyXG4gICAgICAgICAgICAgICAgICBhbnN3ZXI6YW5zd2VyLFxyXG4gICAgICAgICAgICAgICAgICBwb2ludHM6cG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQ2hhbGxlbmdlU2VydmljZS5jcmVhdGUoY0RhdGEpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZWZyZXNoUGFnZSgpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5yZW1vdmVDaGFsbGVuZ2UgPSBmdW5jdGlvbigkZXZlbnQsIGNoYWxsZW5nZSwgaW5kZXgpIHtcclxuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBzd2FsKHtcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhY2NlcHQ6IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgdGhlbVwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVtb3ZlIFwiICsgY2hhbGxlbmdlLnRpdGxlICsgXCIhXCIsXHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIlxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHllczoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSB0aGlzIGNoYWxsZW5nZVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRhbmdlck1vZGU6IHRydWUsXHJcbiAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIlJlbWVtYmVyLCB0aGlzIHBvd2VyIGlzIGEgcHJpdmlsZWdlLlwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCJcclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIENoYWxsZW5nZVNlcnZpY2UucmVtb3ZlKGNoYWxsZW5nZS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUuY2hhbGxlbmdlc1tpbmRleF0gPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxyXG4gICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEudGl0bGUgKyBcIiBoYXMgYmVlbiByZW1vdmVkLlwiLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJlZnJlc2hQYWdlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgfVxyXG5dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoXCJyZWdcIikuY29udHJvbGxlcihcIkFkbWluTWFpbEN0cmxcIiwgW1xyXG4gIFwiJHNjb3BlXCIsXHJcbiAgXCIkc3RhdGVcIixcclxuICBcIiRzdGF0ZVBhcmFtc1wiLFxyXG4gIFwiVXNlclNlcnZpY2VcIixcclxuICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBVc2VyU2VydmljZSkge1xyXG4gICAgJHNjb3BlLnBhZ2VzID0gW107XHJcbiAgICAkc2NvcGUudXNlcnMgPSBbXTtcclxuXHJcbiAgICAvLyBTZW1hbnRpYy1VSSBtb3ZlcyBtb2RhbCBjb250ZW50IGludG8gYSBkaW1tZXIgYXQgdGhlIHRvcCBsZXZlbC5cclxuICAgIC8vIFdoaWxlIHRoaXMgaXMgdXN1YWxseSBuaWNlLCBpdCBtZWFucyB0aGF0IHdpdGggb3VyIHJvdXRpbmcgd2lsbCBnZW5lcmF0ZVxyXG4gICAgLy8gbXVsdGlwbGUgbW9kYWxzIGlmIHlvdSBjaGFuZ2Ugc3RhdGUuIEtpbGwgdGhlIHRvcCBsZXZlbCBkaW1tZXIgbm9kZSBvbiBpbml0aWFsIGxvYWRcclxuICAgIC8vIHRvIHByZXZlbnQgdGhpcy5cclxuICAgICQoXCIudWkuZGltbWVyXCIpLnJlbW92ZSgpO1xyXG4gICAgLy8gUG9wdWxhdGUgdGhlIHNpemUgb2YgdGhlIG1vZGFsIGZvciB3aGVuIGl0IGFwcGVhcnMsIHdpdGggYW4gYXJiaXRyYXJ5IHVzZXIuXHJcblxyXG5cclxuXHJcbiAgICBVc2VyU2VydmljZS5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHN0YXRlUGFyYW1zLnF1ZXJ5LCAkc2NvcGUuc3RhdHVzRmlsdGVycylcclxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgJHNjb3BlLnVzZXJzPSByZXNwb25zZS5kYXRhLnVzZXJzO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJHNjb3BlLnNlbmRFbWFpbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZmlsdGVyZWRVc2VycyA9ICRzY29wZS51c2Vycy5maWx0ZXIoXHJcbiAgICAgICAgdSA9PiB1LnZlcmlmaWVkXHJcbiAgICApO1xyXG5cclxuICAgICAgaWYgKCRzY29wZS5zdGF0dXNGaWx0ZXJzLmNvbXBsZXRlZFByb2ZpbGUpIHtcclxuICAgICAgICBmaWx0ZXJlZFVzZXJzID0gZmlsdGVyZWRVc2Vycy5maWx0ZXIoXHJcbiAgICAgICAgICB1ID0+IHUuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGVcclxuICAgICAgKX1cclxuXHJcbiAgICAgIGlmICgkc2NvcGUuc3RhdHVzRmlsdGVycy5hZG1pdHRlZCkge1xyXG4gICAgICAgIGZpbHRlcmVkVXNlcnMgPSBmaWx0ZXJlZFVzZXJzLmZpbHRlcihcclxuICAgICAgICAgIHUgPT4gdS5zdGF0dXMuYWRtaXR0ZWRcclxuICAgICAgKX1cclxuXHJcbiAgICAgIGlmICgkc2NvcGUuc3RhdHVzRmlsdGVycy5jb25maXJtZWQpIHtcclxuICAgICAgICBmaWx0ZXJlZFVzZXJzID0gZmlsdGVyZWRVc2Vycy5maWx0ZXIoXHJcbiAgICAgICAgICB1ID0+IHUuc3RhdHVzLmNvbmZpcm1lZFxyXG4gICAgICApfVxyXG5cclxuICAgICAgaWYgKCRzY29wZS5zdGF0dXNGaWx0ZXJzLmRlY2xpbmVkKSB7XHJcbiAgICAgICAgZmlsdGVyZWRVc2VycyA9IGZpbHRlcmVkVXNlcnMuZmlsdGVyKFxyXG4gICAgICAgICAgdSA9PiB1LnN0YXR1cy5kZWNsaW5lZFxyXG4gICAgICApfVxyXG5cclxuICAgICAgaWYgKCRzY29wZS5zdGF0dXNGaWx0ZXJzLmNoZWNrZWRJbikge1xyXG4gICAgICAgIGZpbHRlcmVkVXNlcnMgPSBmaWx0ZXJlZFVzZXJzLmZpbHRlcihcclxuICAgICAgICAgIHUgPT4gdS5zdGF0dXMuY2hlY2tlZEluXHJcbiAgICAgICl9XHJcblxyXG4gICAgICB2YXIgbWVzc2FnZSA9ICQodGhpcykuZGF0YShcImNvbmZpcm1cIik7XHJcblxyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgIHRleHQ6IGBZb3UncmUgYWJvdXQgdG8gc2VuZCB0aGlzIGVtYWlsIHRvICR7XHJcbiAgICAgICAgICBmaWx0ZXJlZFVzZXJzLmxlbmd0aFxyXG4gICAgICAgIH0gc2VsZWN0ZWQgdXNlcihzKS5gLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIGJ1dHRvbnM6IFtcIkNhbmNlbFwiLCBcIlllcywgc2VuZCB0aGUgZW1haWxzXCJdLFxyXG4gICAgICAgIGRhbmdlck1vZGU6IHRydWVcclxuICAgICAgfSkudGhlbih3aWxsU2VuZCA9PiB7XHJcbiAgICAgICAgZW1haWwgPSB7IHN1YmplY3Q6JHNjb3BlLnN1YmplY3QgLCB0aXRsZTokc2NvcGUudGl0bGUsIGJvZHk6JHNjb3BlLmJvZHkgfVxyXG5cclxuICAgICAgICBpZiAod2lsbFNlbmQpIHtcclxuICAgICAgICAgIGlmIChmaWx0ZXJlZFVzZXJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBmaWx0ZXJlZFVzZXJzLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgICAgICAgVXNlclNlcnZpY2Uuc2VuZEJhc2ljTWFpbCh1c2VyLmlkLGVtYWlsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJTZW5kaW5nIVwiLFxyXG4gICAgICAgICAgICAgIGBTZW5kaW5nIGVtYWlscyB0byAke1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyZWRVc2Vycy5sZW5ndGhcclxuICAgICAgICAgICAgICB9IHVzZXJzIWAsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJXaG9vcHNcIiwgXCJZb3UgY2FuJ3Qgc2VuZCBvciBhY2NlcHQgMCB1c2VycyFcIiwgXCJlcnJvclwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgfVxyXG5dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoXCJyZWdcIikuY29udHJvbGxlcihcImFkbWluTWFya2V0aW5nQ3RybFwiLCBbXHJcbiAgXCIkc2NvcGVcIixcclxuICBcIiRzdGF0ZVwiLFxyXG4gIFwiJHN0YXRlUGFyYW1zXCIsXHJcbiAgXCJNYXJrZXRpbmdTZXJ2aWNlXCIsXHJcbiAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgTWFya2V0aW5nU2VydmljZSkge1xyXG5cclxuICAgIC8vIFNlbWFudGljLVVJIG1vdmVzIG1vZGFsIGNvbnRlbnQgaW50byBhIGRpbW1lciBhdCB0aGUgdG9wIGxldmVsLlxyXG4gICAgLy8gV2hpbGUgdGhpcyBpcyB1c3VhbGx5IG5pY2UsIGl0IG1lYW5zIHRoYXQgd2l0aCBvdXIgcm91dGluZyB3aWxsIGdlbmVyYXRlXHJcbiAgICAvLyBtdWx0aXBsZSBtb2RhbHMgaWYgeW91IGNoYW5nZSBzdGF0ZS4gS2lsbCB0aGUgdG9wIGxldmVsIGRpbW1lciBub2RlIG9uIGluaXRpYWwgbG9hZFxyXG4gICAgLy8gdG8gcHJldmVudCB0aGlzLlxyXG4gICAgJChcIi51aS5kaW1tZXJcIikucmVtb3ZlKCk7XHJcbiAgICAvLyBQb3B1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgbW9kYWwgZm9yIHdoZW4gaXQgYXBwZWFycywgd2l0aCBhbiBhcmJpdHJhcnkgdXNlci5cclxuXHJcblxyXG5cclxuXHJcbiAgICAkc2NvcGUuY3JlYXRlVGVhbXMgPSBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgaWYgKCRzY29wZS5ib2R5ICYmICRzY29wZS5ldmVudCl7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogYFlvdSdyZSBhYm91dCB0byBhZGQgdGhlc2UgdGVhbXMgZW1haWxzIHRvIHRoZSBtYXJrZXRpbmcgZGF0YWJhc2VgLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiBbXCJDYW5jZWxcIiwgXCJZZXMsIEFkZCB0ZWFtc1wiXSxcclxuICAgICAgICAgIGRhbmdlck1vZGU6IHRydWVcclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YXIgdGVhbXMgPSAkc2NvcGUuYm9keS5zcGxpdCgnOycpO1xyXG4gICAgICAgICAgICB0ZWFtcy5mb3JFYWNoKHRlYW0gPT4ge1xyXG4gICAgICAgICAgICAgIHRlYW1EYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQ6JHNjb3BlLmV2ZW50LFxyXG4gICAgICAgICAgICAgICAgbWVtYmVyczp0ZWFtLnJlcGxhY2UoJyAnLCcnKS5zcGxpdCgnLCcpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIE1hcmtldGluZ1NlcnZpY2UuY3JlYXRlVGVhbSh0ZWFtRGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzd2FsKFwiQWRkZWRcIiwgXCJUZWFtcyBhZGRlZCB0byBkYXRhYmFzZS5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICAkc2NvcGUuYm9keT1cIlwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgc3dhbChcIkVSUk9SIVwiLCBcIkFsbCBmaWVsZHMgYXJlIHJlcXVpcmVkLlwiLCBcImVycm9yXCIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIFxyXG4gIH1cclxuXSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdBZG1pblNldHRpbmdzQ3RybCcsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRzY2UnLFxyXG4gICAgJ1NldHRpbmdzU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzY2UsIFNldHRpbmdzU2VydmljZSl7XHJcblxyXG4gICAgICAkc2NvcGUuc2V0dGluZ3MgPSB7fTtcclxuICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgLmdldFB1YmxpY1NldHRpbmdzKClcclxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZVNldHRpbmdzKHNldHRpbmdzKXtcclxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAvLyBGb3JtYXQgdGhlIGRhdGVzIGluIHNldHRpbmdzLlxyXG4gICAgICAgIHNldHRpbmdzLnRpbWVPcGVuID0gbmV3IERhdGUoc2V0dGluZ3MudGltZU9wZW4pO1xyXG4gICAgICAgIHNldHRpbmdzLnRpbWVDbG9zZSA9IG5ldyBEYXRlKHNldHRpbmdzLnRpbWVDbG9zZSk7XHJcbiAgICAgICAgc2V0dGluZ3MudGltZUNvbmZpcm0gPSBuZXcgRGF0ZShzZXR0aW5ncy50aW1lQ29uZmlybSk7XHJcbiAgICAgICAgc2V0dGluZ3MudGltZVN0YXJ0ID0gbmV3IERhdGUoc2V0dGluZ3MudGltZVN0YXJ0KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnNldHRpbmdzID0gc2V0dGluZ3M7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEFkZGl0aW9uYWwgT3B0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgJHNjb3BlLnVwZGF0ZUFsbG93TWlub3JzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUFsbG93TWlub3JzKCRzY29wZS5zZXR0aW5ncy5hbGxvd01pbm9ycylcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNjb3BlLnNldHRpbmdzLmFsbG93TWlub3JzID0gcmVzcG9uc2UuZGF0YS5hbGxvd01pbm9ycztcclxuICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc1RleHQgPSAkc2NvcGUuc2V0dGluZ3MuYWxsb3dNaW5vcnMgP1xyXG4gICAgICAgICAgICAgIFwiTWlub3JzIGFyZSBub3cgYWxsb3dlZCB0byByZWdpc3Rlci5cIiA6XHJcbiAgICAgICAgICAgICAgXCJNaW5vcnMgYXJlIG5vIGxvbmdlciBhbGxvd2VkIHRvIHJlZ2lzdGVyLlwiXHJcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBzdWNjZXNzVGV4dCwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBXaGl0ZWxpc3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgIC5nZXRXaGl0ZWxpc3RlZEVtYWlscygpXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgJHNjb3BlLndoaXRlbGlzdCA9IHJlc3BvbnNlLmRhdGEuam9pbihcIiwgXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUudXBkYXRlV2hpdGVsaXN0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgICAgICAudXBkYXRlV2hpdGVsaXN0ZWRFbWFpbHMoJHNjb3BlLndoaXRlbGlzdC5yZXBsYWNlKC8gL2csICcnKS5zcGxpdCgnLCcpKVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgc3dhbCgnV2hpdGVsaXN0IHVwZGF0ZWQuJyk7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLndoaXRlbGlzdCA9IHJlc3BvbnNlLmRhdGEud2hpdGVsaXN0ZWRFbWFpbHMuam9pbihcIiwgXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgLy8gUmVnaXN0cmF0aW9uIFRpbWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAkc2NvcGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpe1xyXG4gICAgICAgIGlmICghZGF0ZSl7XHJcbiAgICAgICAgICByZXR1cm4gXCJJbnZhbGlkIERhdGVcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEhhY2sgZm9yIHRpbWV6b25lXHJcbiAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5mb3JtYXQoJ2RkZGQsIE1NTU0gRG8gWVlZWSwgaDptbSBhJykgK1xyXG4gICAgICAgICAgXCIgXCIgKyBkYXRlLnRvVGltZVN0cmluZygpLnNwbGl0KCcgJylbMl07XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBUYWtlIGEgZGF0ZSBhbmQgcmVtb3ZlIHRoZSBzZWNvbmRzLlxyXG4gICAgICBmdW5jdGlvbiBjbGVhbkRhdGUoZGF0ZSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFxyXG4gICAgICAgICAgZGF0ZS5nZXRGdWxsWWVhcigpLFxyXG4gICAgICAgICAgZGF0ZS5nZXRNb250aCgpLFxyXG4gICAgICAgICAgZGF0ZS5nZXREYXRlKCksXHJcbiAgICAgICAgICBkYXRlLmdldEhvdXJzKCksXHJcbiAgICAgICAgICBkYXRlLmdldE1pbnV0ZXMoKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVSZWdpc3RyYXRpb25UaW1lcyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8gQ2xlYW4gdGhlIGRhdGVzIGFuZCB0dXJuIHRoZW0gdG8gbXMuXHJcbiAgICAgICAgdmFyIG9wZW4gPSBjbGVhbkRhdGUoJHNjb3BlLnNldHRpbmdzLnRpbWVPcGVuKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgdmFyIGNsb3NlID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lQ2xvc2UpLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgaWYgKG9wZW4gPCAwIHx8IGNsb3NlIDwgMCB8fCBvcGVuID09PSB1bmRlZmluZWQgfHwgY2xvc2UgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICByZXR1cm4gc3dhbCgnT29wcy4uLicsICdZb3UgbmVlZCB0byBlbnRlciB2YWxpZCB0aW1lcy4nLCAnZXJyb3InKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wZW4gPj0gY2xvc2Upe1xyXG4gICAgICAgICAgc3dhbCgnT29wcy4uLicsICdSZWdpc3RyYXRpb24gY2Fubm90IG9wZW4gYWZ0ZXIgaXQgY2xvc2VzLicsICdlcnJvcicpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlUmVnaXN0cmF0aW9uVGltZXMob3BlbiwgY2xvc2UpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJSZWdpc3RyYXRpb24gVGltZXMgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIENvbmZpcm1hdGlvbiBUaW1lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlQ29uZmlybWF0aW9uVGltZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGNvbmZpcm1CeSA9IGNsZWFuRGF0ZSgkc2NvcGUuc2V0dGluZ3MudGltZUNvbmZpcm0pLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlQ29uZmlybWF0aW9uVGltZShjb25maXJtQnkpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICBzd2FsKFwiU291bmRzIGdvb2QhXCIsIFwiQ29uZmlybWF0aW9uIERhdGUgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIEV2ZW50IFN0YXJ0IFRpbWUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVTdGFydFRpbWUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBzdGFydEJ5ID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lU3RhcnQpLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlU3RhcnRUaW1lKHN0YXJ0QnkpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICBzd2FsKFwiU291bmRzIGdvb2QhXCIsIFwiRXZlbnQgU3RhcnQgRGF0ZSBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuXHJcbiAgICAgIC8vIEFjY2VwdGFuY2UgLyBDb25maXJtYXRpb24gVGV4dCAtLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICB2YXIgY29udmVydGVyID0gbmV3IHNob3dkb3duLkNvbnZlcnRlcigpO1xyXG5cclxuICAgICAgJHNjb3BlLm1hcmtkb3duUHJldmlldyA9IGZ1bmN0aW9uKHRleHQpe1xyXG4gICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbCh0ZXh0KSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlV2FpdGxpc3RUZXh0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgdGV4dCA9ICRzY29wZS5zZXR0aW5ncy53YWl0bGlzdFRleHQ7XHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlV2FpdGxpc3RUZXh0KHRleHQpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIldhaXRsaXN0IFRleHQgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlSG9zdFNjaG9vbCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGhvc3RTY2hvb2wgPSAkc2NvcGUuc2V0dGluZ3MuaG9zdFNjaG9vbDtcclxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVIb3N0U2Nob29sKGhvc3RTY2hvb2wpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIkhvc3QgU2Nob29sIFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgIFxyXG4gICAgICAkc2NvcGUudXBkYXRlQWNjZXB0YW5jZVRleHQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciB0ZXh0ID0gJHNjb3BlLnNldHRpbmdzLmFjY2VwdGFuY2VUZXh0O1xyXG4gICAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUFjY2VwdGFuY2VUZXh0KHRleHQpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIkFjY2VwdGFuY2UgVGV4dCBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVDb25maXJtYXRpb25UZXh0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgdGV4dCA9ICRzY29wZS5zZXR0aW5ncy5jb25maXJtYXRpb25UZXh0O1xyXG4gICAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUNvbmZpcm1hdGlvblRleHQodGV4dClcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiQ29uZmlybWF0aW9uIFRleHQgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJykgLmNvbmZpZyhbJ0NoYXJ0SnNQcm92aWRlcicsIGZ1bmN0aW9uIChDaGFydEpzUHJvdmlkZXIpIHtcclxuICAvLyBDb25maWd1cmUgYWxsIGNoYXJ0c1xyXG4gIENoYXJ0SnNQcm92aWRlci5zZXRPcHRpb25zKHtcclxuICAgIGNoYXJ0Q29sb3JzOiBbJyM5QjY2RkUnLCAnI0ZGNjQ4NCcsICcjRkVBMDNGJywgJyNGQkQwNEQnLCAnIzREQkZDMCcsICcjMzNBM0VGJywgJyNDQUNCQ0YnXSxcclxuICAgIHJlc3BvbnNpdmU6IHRydWVcclxuICB9KTtcclxufV0pXHJcbi5jb250cm9sbGVyKCdBZG1pblN0YXRzQ3RybCcsW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnVXNlclNlcnZpY2UnLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBVc2VyU2VydmljZSl7XHJcbiAgICAgIFxyXG4gICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgIC5nZXRTdGF0cygpXHJcbiAgICAgICAgLnRoZW4oc3RhdHMgPT4ge1xyXG4gICAgICAgICAgJHNjb3BlLnN0YXRzID0gc3RhdHMuZGF0YTsgXHJcblxyXG4gICAgICAgICAgLy8gTWVhbHMgXHJcbiAgICAgICAgICBsYWJlbHM9W11cclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhdHMuZGF0YS5saXZlLm1lYWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGFiZWxzLnB1c2goJ01lYWwgJysoaSsxKSkgICAgICBcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICRzY29wZS5tZWFscyA9IHsgXHJcbiAgICAgICAgICAgIGxhYmVscyA6IGxhYmVscyxcclxuICAgICAgICAgICAgc2VyaWVzIDogWydNZWFscyddLFxyXG4gICAgICAgICAgICBkYXRhIDogc3RhdHMuZGF0YS5saXZlLm1lYWwsXHJcbiAgICAgICAgICAgIG9wdGlvbnMgOiB7XHJcbiAgICAgICAgICAgICAgXCJzY2FsZXNcIjp7XHJcbiAgICAgICAgICAgICAgICBcInhBeGVzXCI6W3tcInRpY2tzXCI6e2JlZ2luQXRaZXJvOnRydWUsbWF4OnN0YXRzLmRhdGEudG90YWx9fV1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogJ01lYWxzIENvbnN1bWVkJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBcclxuICAgICAgICAgIC8vIFdvcmtzaG9wcyBcclxuICAgICAgICAgIGxhYmVscz1bXVxyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0cy5kYXRhLmxpdmUud29ya3Nob3AubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGFiZWxzLnB1c2goJ1dvcmtzaG9wICcrKGkrMSkpICAgICAgXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkc2NvcGUud29ya3Nob3BzID0geyBcclxuICAgICAgICAgICAgbGFiZWxzIDogbGFiZWxzLFxyXG4gICAgICAgICAgICBzZXJpZXMgOiBbJ1dvcmtzaG9wcyddLFxyXG4gICAgICAgICAgICBkYXRhIDogc3RhdHMuZGF0YS5saXZlLndvcmtzaG9wLFxyXG4gICAgICAgICAgICBvcHRpb25zOntcclxuICAgICAgICAgICAgICBlbGVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgbGluZToge1xyXG4gICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMC41LCAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRleHQ6ICdXb3Jrc2hvcHMgYXR0ZW5kYW5jZSdcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gY2x1YnNcclxuICAgICAgICAgICRzY29wZS5jbHVicyA9IHtcclxuICAgICAgICAgICAgbGFiZWxzIDogc3RhdHMuZGF0YS5zb3VyY2UuY2x1YnNMYWJlbHMsXHJcbiAgICAgICAgICAgIHNlcmllcyA6IFsnQ2x1YnMnXSxcclxuICAgICAgICAgICAgZGF0YSA6IHN0YXRzLmRhdGEuc291cmNlLmNsdWJzLFxyXG4gICAgICAgICAgICBvcHRpb25zOntcclxuICAgICAgICAgICAgICBlbGVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgbGluZToge1xyXG4gICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMC41LCAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRleHQ6ICdBcHBsaWNhbnRzIHZpYSBDbHVicydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmlnaHQnLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgIC8vIEdldCB0aGUgbW9zdCBhY3RpdmUgY2x1YlxyXG4gICAgICAgICAgIHZhciBhcnIgPXN0YXRzLmRhdGEuc291cmNlLmNsdWJzXHJcbiAgICAgICAgICAgdmFyIG1heCA9IGFyclswXTtcclxuICAgICAgICAgICB2YXIgbWF4SW5kZXggPSAwO1xyXG4gICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgIGlmIChhcnJbaV0gPiBtYXgpIHtcclxuICAgICAgICAgICAgICAgICAgIG1heEluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIG1heCA9IGFycltpXTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgJHNjb3BlLmZpcnN0Q2x1YiA9IHN0YXRzLmRhdGEuc291cmNlLmNsdWJzTGFiZWxzW21heEluZGV4XVxyXG5cclxuICAgICAgIFxyXG5cclxuXHJcbiAgICAgICAgICAvLyBzb3VyY2VzIFxyXG4gICAgICAgICAgJHNjb3BlLnNvdXJjZSA9IHtcclxuICAgICAgICAgICAgbGFiZWxzIDogWydGYWNlYm9vaycsJ0VtYWlsJywnQ2x1YnMnXSxcclxuICAgICAgICAgICAgc2VyaWVzIDogWydTb3VyY2VzJ10sXHJcbiAgICAgICAgICAgIGRhdGEgOiBzdGF0cy5kYXRhLnNvdXJjZS5nZW5lcmFsLFxyXG4gICAgICAgICAgICBvcHRpb25zOntcclxuICAgICAgICAgICAgICBlbGVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgbGluZToge1xyXG4gICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMC41LCAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRleHQ6ICdBcHBsaWNhbnRzIHNvdXJjZXMnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JpZ2h0JyxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9KTsgIFxyXG5cclxuXHJcbiAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgLmdldFRlYW1TdGF0cygpXHJcbiAgICAgICAgLnRoZW4odGVhbXN0YXRzID0+IHtcclxuICAgICAgICAgICRzY29wZS50ZWFtc3RhdHMgPSB0ZWFtc3RhdHMuZGF0YTsgXHJcbiAgICAgICAgfSk7ICBcclxuXHJcblxyXG4gICAgICAkc2NvcGUuZnJvbU5vdyA9IGZ1bmN0aW9uKGRhdGUpe1xyXG4gICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSkuZnJvbU5vdygpO1xyXG4gICAgICB9O1xyXG5cclxuXHJcbiAgICAgIENoYXJ0LmRlZmF1bHRzLmdsb2JhbC5jb2xvcnMgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSg1MiwgMTUyLCAyMTksIDAuNSknLFxyXG4gICAgICAgICAgcG9pbnRCYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDUyLCAxNTIsIDIxOSwgMC41KScsXHJcbiAgICAgICAgICBwb2ludEhvdmVyQmFja2dyb3VuZENvbG9yOiAncmdiYSgxNTEsMTg3LDIwNSwwLjUpJyxcclxuICAgICAgICAgIGJvcmRlckNvbG9yOiAncmdiYSgwLDAsMCwwJyxcclxuICAgICAgICAgIHBvaW50Qm9yZGVyQ29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgIHBvaW50SG92ZXJCb3JkZXJDb2xvcjogJ3JnYmEoMTUxLDE4NywyMDUsMC41KSdcclxuICAgICAgICB9XHJcbiAgICAgIF0gICAgICAgIFxyXG5cclxuXHJcbiAgICAgICRzY29wZS5zZW5kTGFnZ2VyRW1haWxzID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcclxuICAgICAgICAgIHRleHQ6IFwiVGhpcyB3aWxsIHNlbmQgYW4gZW1haWwgdG8gZXZlcnkgdXNlciB3aG8gaGFzIG5vdCBzdWJtaXR0ZWQgYW4gYXBwbGljYXRpb24uIEFyZSB5b3Ugc3VyZT8uXCIsXHJcbiAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxyXG4gICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiWWVzLCBzZW5kLlwiLFxyXG4gICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXHJcbiAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgICAgIC5zZW5kTGFnZ2VyRW1haWxzKClcclxuICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgc3dlZXRBbGVydCgnWW91ciBlbWFpbHMgaGF2ZSBiZWVuIHNlbnQuJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuc2VuZFJlamVjdEVtYWlscyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIlRoaXMgd2lsbCBzZW5kIGFuIGVtYWlsIHRvIGV2ZXJ5IHVzZXIgd2hvIGhhcyBiZWVuIHJlamVjdGVkLiBBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxyXG4gICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiWWVzLCBzZW5kLlwiLFxyXG4gICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXHJcbiAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgICAgIC5zZW5kUmVqZWN0RW1haWxzKClcclxuICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgc3dlZXRBbGVydCgnWW91ciBlbWFpbHMgaGF2ZSBiZWVuIHNlbnQuJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuc2VuZFJlamVjdEVtYWlsc1Jlc3QgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAuZ2V0TGF0ZXJSZWplY3RlZENvdW50KClcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGNvdW50KSB7XHJcbiAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcclxuICAgICAgICAgICAgICB0ZXh0OiBgVGhpcyB3aWxsIHNlbmQgcmVqZWN0aW9uIGVtYWlsIHRvICR7Y291bnR9IHVzZXJzLmAsXHJcbiAgICAgICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxyXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgcmVqZWN0LlwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxyXG4gICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAgIC5zZW5kUmVqZWN0RW1haWxzUmVzdCgpXHJcbiAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dlZXRBbGVydCgnWW91ciBlbWFpbHMgaGF2ZSBiZWVuIHNlbnQuJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUubWFzc1JlamVjdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAuZ2V0UmVqZWN0aW9uQ291bnQoKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oY291bnQpIHtcclxuICAgICAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxyXG4gICAgICAgICAgICAgIHRleHQ6IGBUaGlzIHdpbGwgcmVqZWN0ICR7Y291bnR9IHVzZXJzLmAsXHJcbiAgICAgICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxyXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgcmVqZWN0LlwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxyXG4gICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAgIC5tYXNzUmVqZWN0KClcclxuICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBzd2VldEFsZXJ0KCdNYXNzIFJlamVjdGlvbiBzdWNjZXNzZnVsLicpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUubWFzc1JlamVjdFJlc3QgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgLmdldFJlc3RSZWplY3Rpb25Db3VudCgpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihjb3VudCkge1xyXG4gICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICAgICAgdGV4dDogYFRoaXMgd2lsbCByZWplY3QgJHtjb3VudH0gdXNlcnMuYCxcclxuICAgICAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjREQ2QjU1XCIsXHJcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiWWVzLCByZWplY3QuXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXHJcbiAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgICAgICAgICAgLm1hc3NSZWplY3RSZXN0KClcclxuICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBzd2VldEFsZXJ0KCdNYXNzIFJlamVjdGlvbiBzdWNjZXNzZnVsLicpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgfV0pO1xyXG4iLCJcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4uY29udHJvbGxlcignQWRtaW5UZWFtQ3RybCcsIFtcclxuICAnJHNjb3BlJyxcclxuICAnJHN0YXRlJyxcclxuICAnJHRpbWVvdXQnLFxyXG4gICdjdXJyZW50VXNlcicsXHJcbiAgJ3NldHRpbmdzJyxcclxuICAnVXRpbHMnLFxyXG4gICdVc2VyU2VydmljZScsXHJcbiAgJ1RlYW1TZXJ2aWNlJyxcclxuICAnVEVBTScsXHJcbiAgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkdGltZW91dCwgY3VycmVudFVzZXIsIHNldHRpbmdzLCBVdGlscywgVXNlclNlcnZpY2UsIFRlYW1TZXJ2aWNlLCBURUFNKSB7XHJcbiAgICAvLyBHZXQgdGhlIGN1cnJlbnQgdXNlcidzIG1vc3QgcmVjZW50IGRhdGEuIFxyXG4gICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcclxuXHJcbiAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcclxuXHJcbiAgICAkc2NvcGUudXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XHJcblxyXG4gICAgZnVuY3Rpb24gaXNUZWFtTWVtYmVyKHRlYW1zLCBVc2VyaWQpIHtcclxuICAgICAgdmFyIHRlc3QgPSBmYWxzZTtcclxuICAgICAgdGVhbXMuZm9yRWFjaCh0ZWFtID0+IHtcclxuICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBVc2VyaWQpIHRlc3QgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHRlc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2VsZWN0TWVtYmVyKG1lbWJlcklkKSB7XHJcbiAgICAgIFVzZXJTZXJ2aWNlLmdldChtZW1iZXJJZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgdXNlciA9IHJlc3BvbnNlLmRhdGFcclxuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gdXNlcjtcclxuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHVzZXIpO1xyXG4gICAgICAkKFwiLmxvbmcudXNlci5tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogXCJQcm9maWxlXCIsXHJcbiAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiR2VuZGVyXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5nZW5kZXJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiU2Nob29sXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5zY2hvb2xcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiR2l0aHViXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5naXRodWJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiTGlua2VkaW5cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmxpbmtlZGluXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmb3JtYXRUaW1lKHRpbWUpIHtcclxuICAgICAgaWYgKHRpbWUpIHtcclxuICAgICAgICByZXR1cm4gbW9tZW50KHRpbWUpLmZvcm1hdChcIk1NTU0gRG8gWVlZWSwgaDptbTpzcyBhXCIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnNlbGVjdE1lbWJlciA9IHNlbGVjdE1lbWJlcjtcclxuXHJcblxyXG4gICAgJHNjb3BlLmlzam9pbmVkID0gZnVuY3Rpb24gKHRlYW0pIHtcclxuICAgICAgdmFyIHRlc3QgPSBmYWxzZTtcclxuICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgIGlmIChtZW1iZXIuaWQgPT0gY3VycmVudFVzZXIuZGF0YS5faWQpIHRlc3QgPSB0cnVlO1xyXG4gICAgICB9KVxyXG4gICAgICByZXR1cm4gdGVzdDtcclxuICAgIH1cclxuXHJcbiAgICBUZWFtU2VydmljZS5nZXRBbGwoKS50aGVuKHRlYW1zID0+IHtcclxuICAgICAgY29uc29sZS5sb2codGVhbXMuZGF0YSk7XHJcblxyXG4gICAgICAkc2NvcGUuaXNUZWFtQWRtaW4gPSBmYWxzZTtcclxuICAgICAgJHNjb3BlLmlzVGVhbU1lbWJlciA9IGZhbHNlO1xyXG4gICAgICB0ZWFtcy5kYXRhLmZvckVhY2godGVhbSA9PiB7XHJcbiAgICAgICAgdGVhbS5pc01heHRlYW0gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKHRlYW0ubWVtYmVycy5sZW5ndGggPj0gU2V0dGluZ3MubWF4VGVhbVNpemUpIHtcclxuICAgICAgICAgIHRlYW0uaXNDb2xvc2VkID0gdHJ1ZTtcclxuICAgICAgICAgIHRlYW0uaXNNYXh0ZWFtID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0ZWFtLm1lbWJlcnNbMF0uaWQgPT0gY3VycmVudFVzZXIuZGF0YS5faWQpIHtcclxuICAgICAgICAgIHRlYW0uam9pblJlcXVlc3RzLmZvckVhY2gobWVtYmVyID0+IHtcclxuICAgICAgICAgICAgaWYgKGlzVGVhbU1lbWJlcih0ZWFtcy5kYXRhLCBtZW1iZXIuaWQpKSB7XHJcbiAgICAgICAgICAgICAgbWVtYmVyLnVuYXZhaWxhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHsgbWVtYmVyLnVuYXZhaWxhYmxlID0gZmFsc2UgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAkc2NvcGUudXNlckFkbWluVGVhbSA9IHRlYW07XHJcbiAgICAgICAgICAkc2NvcGUuaXNUZWFtQWRtaW4gPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWVtYmVyLmlkID09IGN1cnJlbnRVc2VyLmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLnVzZXJNZW1iZXJUZWFtID0gdGVhbTtcclxuICAgICAgICAgICAgICAkc2NvcGUuaXNUZWFtTWVtYmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIFxyXG4gICAgICAkc2NvcGUudGVhbXMgPSB0ZWFtcy5kYXRhO1xyXG5cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAkc2NvcGUuY3JlYXRlVGVhbSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgIHRlYW1EYXRhID0ge1xyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAkc2NvcGUubmV3VGVhbV9kZXNjcmlwdGlvbixcclxuICAgICAgICBtZW1iZXJzOiBbeyBpZDogY3VycmVudFVzZXIuZGF0YS5faWQsIG5hbWU6IGN1cnJlbnRVc2VyLmRhdGEucHJvZmlsZS5uYW1lLCBza2lsbDogJHNjb3BlLm5ld1RlYW1fQWRtaW5za2lsbCB9XSxcclxuICAgICAgICBza2lsbHM6IHsgY29kZTogJHNjb3BlLnNraWxsY29kZSwgZGVzaWduOiAkc2NvcGUuc2tpbGxkZXNpZ24sIGhhcmR3YXJlOiAkc2NvcGUuc2tpbGxoYXJkd2FyZSwgaWRlYTogJHNjb3BlLnNraWxsaWRlYSB9LFxyXG4gICAgICAgIGlzQ29sb3NlZDogZmFsc2UsXHJcbiAgICAgIH1cclxuICAgICAgY29uc29sZS5sb2codGVhbURhdGEpO1xyXG4gICAgICBjb25zb2xlLmxvZygkc2NvcGUubmV3VGVhbV9BZG1pbnNraWxsKTtcclxuXHJcbiAgICAgIFRlYW1TZXJ2aWNlLmNyZWF0ZSh0ZWFtRGF0YSk7XHJcbiAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgICRzY29wZS5TaG93Y3JlYXRlVGVhbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJHNjb3BlLlNob3dOZXdUZWFtRnJvbSA9IHRydWU7XHJcbiAgICAgICRzY29wZS5za2lsbGNvZGUgPSB0cnVlXHJcbiAgICAgICRzY29wZS5za2lsbGRlc2lnbiA9IHRydWVcclxuICAgICAgJHNjb3BlLnNraWxsaGFyZHdhcmUgPSB0cnVlXHJcbiAgICAgICRzY29wZS5za2lsbGlkZWEgPSB0cnVlXHJcbiAgICAgICRzY29wZS5uZXdUZWFtX0FkbWluc2tpbGwgPSBcImNvZGVcIlxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAkc2NvcGUuU2hvd0pvaW5UZWFtID0gZnVuY3Rpb24oKXtcclxuICAgICAgJHNjb3BlLlNob3dKb2luVGVhbUZyb20gPSB0cnVlOyAgXHJcbiAgICB9XHJcblxyXG5cclxuICAgICRzY29wZS5qb2luVGVhbUNvZGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICB0ZWFtSUQgPSAkc2NvcGUubmV3VGVhbV9Db2RlO1xyXG4gICAgICBuZXdUZWFtX3NraWxsPSAkc2NvcGUubmV3VGVhbV9za2lsbDtcclxuXHJcbiAgICAgIG5ld3VzZXI9IHtpZDpjdXJyZW50VXNlci5kYXRhLl9pZCwgbmFtZTpjdXJyZW50VXNlci5kYXRhLnByb2ZpbGUubmFtZSwgc2tpbGw6bmV3VGVhbV9za2lsbH07XHJcbiAgICAgIFRlYW1TZXJ2aWNlLmpvaW4odGVhbUlELG5ld3VzZXIpOyBcclxuICAgICAgc3dhbChcclxuICAgICAgICBcIkpvaW5lZFwiLFxyXG4gICAgICAgIFwiWW91IGhhdmUgYXBwbGljZWQgdG8gam9pbiB0aGlzIHRlYW0sIHdhaXQgZm9yIHRoZSBUZWFtLUFkbWluIHRvIGFjY2VwdCB5b3VyIGFwcGxpY2F0aW9uLlwiLFxyXG4gICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICk7ICBcclxuICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gXHJcbiAgICB9XHJcbiAgICBcclxuICAgICRzY29wZS5qb2luVGVhbSA9IGZ1bmN0aW9uICh0ZWFtKSB7XHJcblxyXG4gICAgICB2YXIgdmFsdWU7XHJcbiAgICAgIGNvbnN0IHNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xyXG4gICAgICBzZWxlY3QuY2xhc3NOYW1lID0gJ3NlbGVjdC1jdXN0b20nXHJcblxyXG5cclxuICAgICAgdmFyIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICBvcHRpb24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICBvcHRpb24uaW5uZXJIVE1MID0gJ1NlbGVjdCBhIHNraWxsJztcclxuICAgICAgb3B0aW9uLnZhbHVlID0gXCJjb2RlXCJcclxuICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XHJcblxyXG5cclxuICAgICAgaWYgKHRlYW0uc2tpbGxzLmNvZGUpIHtcclxuICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gJ0NvZGUnO1xyXG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IFwiY29kZVwiXHJcbiAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRlYW0uc2tpbGxzLmRlc2lnbikge1xyXG4gICAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnRGVzaWduJztcclxuICAgICAgICBvcHRpb24udmFsdWUgPSBcImRlc2lnblwiXHJcbiAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRlYW0uc2tpbGxzLmhhcmR3YXJlKSB7XHJcbiAgICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9ICdIYXJkd2FyZSc7XHJcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gXCJoYXJkd2FyZVwiXHJcbiAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRlYW0uc2tpbGxzLmlkZWEpIHtcclxuICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gJ0lkZWEnO1xyXG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IFwiaWRlYVwiXHJcbiAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGVjdC5vbmNoYW5nZSA9IGZ1bmN0aW9uIHNlbGVjdENoYW5nZWQoZSkge1xyXG4gICAgICAgIHZhbHVlID0gZS50YXJnZXQudmFsdWVcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgdGl0bGU6IFwiUGxlYXNlIHNlbGVjdCB5b3VyIHNraWxsIHRvIGpvaW5cIixcclxuXHJcbiAgICAgICAgY29udGVudDoge1xyXG4gICAgICAgICAgZWxlbWVudDogc2VsZWN0LFxyXG4gICAgICAgIH1cclxuICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIG5ld3VzZXIgPSB7IGlkOiBjdXJyZW50VXNlci5kYXRhLl9pZCwgbmFtZTogY3VycmVudFVzZXIuZGF0YS5wcm9maWxlLm5hbWUsIHNraWxsOiB2YWx1ZSB9O1xyXG4gICAgICAgIFRlYW1TZXJ2aWNlLmpvaW4odGVhbS5faWQsIG5ld3VzZXIpO1xyXG4gICAgICAgIHN3YWwoXHJcbiAgICAgICAgICBcIkpvaW5lZFwiLFxyXG4gICAgICAgICAgXCJZb3UgaGF2ZSBhcHBsaWNlZCB0byBqb2luIHRoaXMgdGVhbSwgd2FpdCBmb3IgdGhlIFRlYW0tQWRtaW4gdG8gYWNjZXB0IHlvdXIgYXBwbGljYXRpb24uXCIsXHJcbiAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICk7XHJcbiAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAkc2NvcGUuYWNjZXB0TWVtYmVyID0gZnVuY3Rpb24gKHRlYW1JRCwgbWVtYmVyLCBpbmRleCkge1xyXG5cclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gYWNjZXB0IFwiICsgbWVtYmVyLm5hbWUgKyBcIiB0byB5b3VyIHRlYW0hIFRoaXMgd2lsbCBzZW5kIGhpbSBhIG5vdGlmaWNhdGlvbiBlbWFpbCBhbmQgd2lsbCBzaG93IGluIHRoZSBwdWJsaWMgdGVhbXMgcGFnZS5cIixcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgbGV0IGhpbSBpblwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBUZWFtU2VydmljZS5hY2NlcHRNZW1iZXIodGVhbUlELCBtZW1iZXIsIFNldHRpbmdzLm1heFRlYW1TaXplKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgIGlmIChyZXNwb25zZSA9PSBcIm1heFRlYW1TaXplXCIpIHtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIkVycm9yXCIsXHJcbiAgICAgICAgICAgICAgXCJNYXhpbXVtIG51bWJlciBvZiBtZW1iZXJzIChcIiArIFNldHRpbmdzLm1heFRlYW1TaXplICsgXCIpIHJlYWNoZWRcIixcclxuICAgICAgICAgICAgICBcImVycm9yXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZWpvaW4odGVhbUlELCBpbmRleCwgZmFsc2UpLnRoZW4ocmVzcG9uc2UyID0+IHtcclxuICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRlZFwiLFxyXG4gICAgICAgICAgICAgICAgbWVtYmVyLm5hbWUgKyBcIiBoYXMgYmVlbiBhY2NlcHRlZCB0byB5b3VyIHRlYW0uXCIsXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAkc2NvcGUucmVmdXNlTWVtYmVyID0gZnVuY3Rpb24gKHRlYW1JRCwgbWVtYmVyLCBpbmRleCkge1xyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byByZWZ1c2UgXCIgKyBtZW1iZXIubmFtZSArIFwiIGZyb20geW91ciB0ZWFtISBUaGlzIHdpbGwgc2VuZCBoaW0gYSBub3RpZmljYXRpb24gZW1haWwuXCIsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlZnVzZSBoaW1cIixcclxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgVGVhbVNlcnZpY2UucmVtb3Zlam9pbih0ZWFtSUQsIGluZGV4LCBtZW1iZXIpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgXCJSZWZ1c2VkXCIsXHJcbiAgICAgICAgICAgIG1lbWJlci5uYW1lICsgXCIgaGFzIGJlZW4gcmVmdXNlZCBmcm9tIHlvdXIgdGVhbS5cIixcclxuICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAkc2NvcGUucmVtb3ZlTWVtYmVyZnJvbVRlYW0gPSBmdW5jdGlvbiAodGVhbUlELCBtZW1iZXIsIGluZGV4KSB7XHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIHJlbW92ZSBcIiArIG1lbWJlci5uYW1lICsgXCIgZnJvbSB5b3VyIHRlYW0hIFRoaXMgd2lsbCBzZW5kIGhpbSBhIG5vdGlmaWNhdGlvbiBlbWFpbC5cIixcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVtb3ZlIGhpbVwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVtZW1iZXIodGVhbUlELCBpbmRleCwgbWVtYmVyLmlkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgIGlmIChyZXNwb25zZSA9PSBcInJlbW92aW5nQWRtaW5cIikge1xyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgIFwiRXJyb3JcIixcclxuICAgICAgICAgICAgICBcIllvdSBjYW4ndCByZW1vdmUgdGhlIFRlYW0gQWRtaW4sIEJ1dCB5b3UgY2FuIGNsb3NlIHRoZSB0ZWFtLlwiLFxyXG4gICAgICAgICAgICAgIFwiZXJyb3JcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3Zlam9pbih0ZWFtSUQsIGluZGV4LCBmYWxzZSkudGhlbihyZXNwb25zZTIgPT4ge1xyXG4gICAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgICBcIlJlbW92ZWRcIixcclxuICAgICAgICAgICAgICAgIG1lbWJlci5uYW1lICsgXCIgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHlvdXIgdGVhbS5cIixcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgICRzY29wZS5yZW1vdmVUZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVtb3ZlIHRoaXMgdGVhbSB3aXRoIGFsbCBpdCdzIG1lbWJlcnMhIFRoaXMgd2lsbCBzZW5kIHRoZW0gYSBub3RpZmljYXRpb24gZW1haWwuIFlvdSBuZWVkIHRvIGZpbmQgYW5vdGhlciB0ZWFtIHRvIHdvcmsgd2l0aC5cIixcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVtb3ZlIHRlYW1cIixcclxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVtYWlsID0ge1xyXG4gICAgICAgICAgc3ViamVjdDogXCJZb3VyIHRlYW0gaGFzIGJlZW4gcmVtb3ZlZFwiLFxyXG4gICAgICAgICAgdGl0bGU6IFwiVGltZSBmb3IgYSBiYWNrdXAgcGxhblwiLFxyXG4gICAgICAgICAgYm9keTogXCJUaGUgdGVhbSB5b3UgaGF2ZSBiZWVuIHBhcnQgKE1lbWJlci9yZXF1ZXN0ZWQgdG8gam9pbikgb2YgaGFzIGJlZW4gcmVtb3ZlZC4gUGxlYXNlIGNoZWNrIHlvdXIgZGFzaGJvYXJkIGFuZCB0cnkgdG8gZmluZCBhbm90aGVyIHRlYW0gdG8gd29yayB3aXRoIGJlZm9yZSB0aGUgaGFja2F0aG9uIHN0YXJ0cy5cIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgVGVhbVNlcnZpY2UucmVtb3ZlKHRlYW0uX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgIHRlYW0ubWVtYmVycy5mb3JFYWNoKHVzZXIgPT4ge1xyXG4gICAgICAgICAgICBVc2VyU2VydmljZS5zZW5kQmFzaWNNYWlsKHVzZXIuaWQsIGVtYWlsKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaCh1c2VyID0+IHtcclxuICAgICAgICAgICAgVXNlclNlcnZpY2Uuc2VuZEJhc2ljTWFpbCh1c2VyLmlkLCBlbWFpbCk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICBcIlJlbW92ZWRcIixcclxuICAgICAgICAgICAgXCJUZWFtIGhhcyBiZWVuIHJlbW92ZWQuXCIsXHJcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgJHNjb3BlLmxlYXZlVGVhbSA9IGZ1bmN0aW9uICh0ZWFtKSB7XHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGxlYXZlIHlvdXIgdGVhbSEgVGhpcyB3aWxsIHNlbmQgdGhlIGFkbWluIGEgbm90aWZpY2F0aW9uIGVtYWlsLlwiLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgaGltXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcclxuICAgICAgICAgIGlmIChtZW1iZXIuaWQgPT0gY3VycmVudFVzZXIuZGF0YS5faWQpIHtcclxuICAgICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3ZlbWVtYmVyKHRlYW0uX2lkLCBpbmRleCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgbGVmdCB0aGlzIHRlYW0uIFBsZWFzZSBmaW5kIGFub3RoZXIgdGVhbSBvciBjcmVhdGUgeW91ciBvd24uXCIsXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAkc2NvcGUuY2FuY2Vsam9pblRlYW0gPSBmdW5jdGlvbiAodGVhbSkge1xyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBjYW5jZWwgeW91ciByZXF1ZXN0IHRvIGpvaW4gdGhpcyB0ZWFtIVwiLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIk5vXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIENhbmNlbFwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaW5kZXggPSAwO1xyXG5cclxuICAgICAgICB0ZWFtLmpvaW5SZXF1ZXN0cy5mb3JFYWNoKG1lbWJlciA9PiB7XHJcbiAgICAgICAgICBpZiAobWVtYmVyLmlkID09IGN1cnJlbnRVc2VyLmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZWpvaW4odGVhbS5faWQsIGluZGV4LCBmYWxzZSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgY2FuY2VsZWQgeW91IHJlcXVlc3QgdG8gam9pbiB0aGlzIHRlYW0uIFBsZWFzZSBmaW5kIGFub3RoZXIgdGVhbSBvciBjcmVhdGUgeW91ciBvd24uXCIsXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAkc2NvcGUudG9nZ2xlQ2xvc2VUZWFtID0gZnVuY3Rpb24gKHRlYW1JRCwgc3RhdHVzKSB7XHJcbiAgICAgIGlmIChzdGF0dXMgPT0gdHJ1ZSkge1xyXG4gICAgICAgIHRleHQgPSBcIllvdSBhcmUgYWJvdXQgdG8gQ2xvc2UgdGhpcyB0ZWFtLiBUaGlzIHdvbid0IGFsbG93IG90aGVyIG1lbWJlcnMgdG8gam9pbiB5b3VyIHRlYW0hXCJcclxuICAgICAgfSBlbHNlIHsgdGV4dCA9IFwiWW91IGFyZSBhYm91dCB0byByZW9wZW4gdGhpcyB0ZWFtLiBUaGlzIHdpbGwgYWxsb3cgb3RoZXIgbWVtYmVycyB0byBqb2luIHlvdXIgdGVhbSFcIiB9XHJcblxyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiTm9cIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlllc1wiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBUZWFtU2VydmljZS50b2dnbGVDbG9zZVRlYW0odGVhbUlELCBzdGF0dXMpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgXCJEb25lXCIsXHJcbiAgICAgICAgICAgIFwiT3BlcmF0aW9uIHN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIsXHJcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgICRzY29wZS50b2dnbGVIaWRlVGVhbSA9IGZ1bmN0aW9uICh0ZWFtSUQsIHN0YXR1cykge1xyXG4gICAgICBpZiAoc3RhdHVzID09IHRydWUpIHtcclxuICAgICAgICB0ZXh0ID0gXCJZb3UgYXJlIGFib3V0IHRvIEhpZGUgdGhpcyB0ZWFtLiBUaGlzIHdvbid0IGFsbG93IG90aGVyIG1lbWJlcnMgdG8gc2VlIHlvdXIgdGVhbSFcIlxyXG4gICAgICB9IGVsc2UgeyB0ZXh0ID0gXCJZb3UgYXJlIGFib3V0IHRvIFNob3cgdGhpcyB0ZWFtLiBUaGlzIHdpbGwgYWxsb3cgb3RoZXIgbWVtYmVycyB0byBzZWUgeW91ciB0ZWFtIVwiIH1cclxuXHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgdGV4dDogdGV4dCxcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJOb1wiLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFRlYW1TZXJ2aWNlLnRvZ2dsZUhpZGVUZWFtKHRlYW1JRCwgc3RhdHVzKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgIFwiRG9uZVwiLFxyXG4gICAgICAgICAgICBcIk9wZXJhdGlvbiBzdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiLFxyXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLiR3YXRjaChcInF1ZXJ5VGV4dFwiLCBmdW5jdGlvbiAocXVlcnlUZXh0KSB7XHJcbiAgICAgIFRlYW1TZXJ2aWNlLmdldFNlbGVjdGVkVGVhbXMocXVlcnlUZXh0LCAkc2NvcGUuc2tpbGxzRmlsdGVycykudGhlbihcclxuICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAkc2NvcGUudGVhbXMgPSByZXNwb25zZS5kYXRhLnRlYW1zO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS5hcHBseXNraWxsc0ZpbHRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgVGVhbVNlcnZpY2UuZ2V0U2VsZWN0ZWRUZWFtcygkc2NvcGUucXVlcnlUZXh0LCAkc2NvcGUuc2tpbGxzRmlsdGVycykudGhlbihcclxuICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAkc2NvcGUudGVhbXMgPSByZXNwb25zZS5kYXRhLnRlYW1zO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH07XHJcblxyXG5cclxuXHJcblxyXG5cclxuICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdBZG1pblVzZXJDdHJsJyxbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICckaHR0cCcsXHJcbiAgICAndXNlcicsXHJcbiAgICAnVXNlclNlcnZpY2UnLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgVXNlciwgVXNlclNlcnZpY2Upe1xyXG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gVXNlci5kYXRhO1xyXG5cclxuICAgICAgLy8gUG9wdWxhdGUgdGhlIHNjaG9vbCBkcm9wZG93blxyXG4gICAgICBwb3B1bGF0ZVNjaG9vbHMoKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlU2Nob29scygpe1xyXG5cclxuICAgICAgICAkaHR0cFxyXG4gICAgICAgICAgLmdldCgnL2Fzc2V0cy9zY2hvb2xzLmpzb24nKVxyXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcclxuICAgICAgICAgICAgdmFyIHNjaG9vbHMgPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgdmFyIGVtYWlsID0gJHNjb3BlLnNlbGVjdGVkVXNlci5lbWFpbC5zcGxpdCgnQCcpWzFdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNjaG9vbHNbZW1haWxdKXtcclxuICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnByb2ZpbGUuc2Nob29sID0gc2Nob29sc1tlbWFpbF0uc2Nob29sO1xyXG4gICAgICAgICAgICAgICRzY29wZS5hdXRvRmlsbGVkU2Nob29sID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgJHNjb3BlLnVwZGF0ZVByb2ZpbGUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlUHJvZmlsZSgkc2NvcGUuc2VsZWN0ZWRVc2VyLl9pZCwgJHNjb3BlLnNlbGVjdGVkVXNlci5wcm9maWxlKVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2VsZWN0ZWRVc2VyID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcIlVwZGF0ZWQhXCIsIFwiUHJvZmlsZSB1cGRhdGVkLlwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJPb3BzLCB5b3UgZm9yZ290IHNvbWV0aGluZy5cIik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlQ29uZmlybWF0aW9uID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUNvbmZpcm1hdGlvbigkc2NvcGUuc2VsZWN0ZWRVc2VyLl9pZCwgJHNjb3BlLnNlbGVjdGVkVXNlci5jb25maXJtYXRpb24pXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICRzZWxlY3RlZFVzZXIgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICBzd2FsKFwiVXBkYXRlZCFcIiwgXCJDb25maXJtYXRpb24gdXBkYXRlZC5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFwiT29wcywgeW91IGZvcmdvdCBzb21ldGhpbmcuXCIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG5cclxuICAgICAgJHNjb3BlLnVwZGF0ZUFsbFVzZXIgPSBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUFsbCgkc2NvcGUuc2VsZWN0ZWRVc2VyLl9pZCwgJHNjb3BlLnNlbGVjdGVkVXNlcilcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNlbGVjdGVkVXNlciA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIHN3YWwoXCJVcGRhdGVkIVwiLCBcIkFMTCBQcm9maWxlIHVwZGF0ZWQuXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIk9vcHMsIHlvdSBmb3Jnb3Qgc29tZXRoaW5nLlwiKTtcclxuICAgICAgICAgIH0pOyAgXHJcbiAgICAgIH07XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoXCJyZWdcIikuY29udHJvbGxlcihcIkFkbWluVXNlcnNDdHJsXCIsIFtcclxuICBcIiRzY29wZVwiLFxyXG4gIFwiJHN0YXRlXCIsXHJcbiAgXCIkc3RhdGVQYXJhbXNcIixcclxuICBcIlVzZXJTZXJ2aWNlXCIsXHJcbiAgJ0F1dGhTZXJ2aWNlJyxcclxuICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBVc2VyU2VydmljZSwgQXV0aFNlcnZpY2UpIHtcclxuICAgICRzY29wZS5wYWdlcyA9IFtdO1xyXG4gICAgJHNjb3BlLnVzZXJzID0gW107XHJcblxyXG4gICAgLy8gU2VtYW50aWMtVUkgbW92ZXMgbW9kYWwgY29udGVudCBpbnRvIGEgZGltbWVyIGF0IHRoZSB0b3AgbGV2ZWwuXHJcbiAgICAvLyBXaGlsZSB0aGlzIGlzIHVzdWFsbHkgbmljZSwgaXQgbWVhbnMgdGhhdCB3aXRoIG91ciByb3V0aW5nIHdpbGwgZ2VuZXJhdGVcclxuICAgIC8vIG11bHRpcGxlIG1vZGFscyBpZiB5b3UgY2hhbmdlIHN0YXRlLiBLaWxsIHRoZSB0b3AgbGV2ZWwgZGltbWVyIG5vZGUgb24gaW5pdGlhbCBsb2FkXHJcbiAgICAvLyB0byBwcmV2ZW50IHRoaXMuXHJcbiAgICAkKFwiLnVpLmRpbW1lclwiKS5yZW1vdmUoKTtcclxuICAgIC8vIFBvcHVsYXRlIHRoZSBzaXplIG9mIHRoZSBtb2RhbCBmb3Igd2hlbiBpdCBhcHBlYXJzLCB3aXRoIGFuIGFyYml0cmFyeSB1c2VyLlxyXG4gICAgJHNjb3BlLnNlbGVjdGVkVXNlciA9IHt9O1xyXG4gICAgJHNjb3BlLnNlbGVjdGVkVXNlci5zZWN0aW9ucyA9IGdlbmVyYXRlU2VjdGlvbnMoe1xyXG4gICAgICBzdGF0dXM6IFwiXCIsXHJcbiAgICAgIGNvbmZpcm1hdGlvbjoge1xyXG4gICAgICAgIGRpZXRhcnlSZXN0cmljdGlvbnM6IFtdXHJcbiAgICAgIH0sXHJcbiAgICAgIHByb2ZpbGU6IFwiXCJcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVBhZ2UoZGF0YSkge1xyXG4gICAgICAkc2NvcGUudXNlcnMgPSBkYXRhLnVzZXJzO1xyXG4gICAgICAkc2NvcGUuY3VycmVudFBhZ2UgPSBkYXRhLnBhZ2U7XHJcbiAgICAgICRzY29wZS5wYWdlU2l6ZSA9IGRhdGEuc2l6ZTtcclxuXHJcbiAgICAgIHZhciBwID0gW107XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS50b3RhbFBhZ2VzOyBpKyspIHtcclxuICAgICAgICBwLnB1c2goaSk7XHJcbiAgICAgIH1cclxuICAgICAgJHNjb3BlLnBhZ2VzID0gcDtcclxuICAgIH1cclxuXHJcbiAgICBVc2VyU2VydmljZS5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHN0YXRlUGFyYW1zLnF1ZXJ5LCAkc2NvcGUuc3RhdHVzRmlsdGVycylcclxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuXHJcbiAgICAgIHVwZGF0ZVBhZ2UocmVzcG9uc2UuZGF0YSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUuJHdhdGNoKFwicXVlcnlUZXh0XCIsIGZ1bmN0aW9uKHF1ZXJ5VGV4dCkge1xyXG4gICAgICBVc2VyU2VydmljZS5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgcXVlcnlUZXh0LCAkc2NvcGUuc3RhdHVzRmlsdGVycykudGhlbihcclxuICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICB1cGRhdGVQYWdlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAkc2NvcGUuYXBwbHlTdGF0dXNGaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgLmdldFBhZ2UoJHN0YXRlUGFyYW1zLnBhZ2UsICRzdGF0ZVBhcmFtcy5zaXplLCAkc2NvcGUucXVlcnlUZXh0LCAkc2NvcGUuc3RhdHVzRmlsdGVycywkc2NvcGUuTm90c3RhdHVzRmlsdGVycykudGhlbihcclxuICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgdXBkYXRlUGFnZShyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgICRzY29wZS5nb1RvUGFnZSA9IGZ1bmN0aW9uKHBhZ2UpIHtcclxuICAgICAgJHN0YXRlLmdvKFwiYXBwLmFkbWluLnVzZXJzXCIsIHtcclxuICAgICAgICBwYWdlOiBwYWdlLFxyXG4gICAgICAgIHNpemU6ICRzdGF0ZVBhcmFtcy5zaXplIHx8IDIwXHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZ29Vc2VyID0gZnVuY3Rpb24oJGV2ZW50LCB1c2VyKSB7XHJcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICRzdGF0ZS5nbyhcImFwcC5hZG1pbi51c2VyXCIsIHtcclxuICAgICAgICBpZDogdXNlci5faWRcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAkc2NvcGUuYWNjZXB0VXNlciA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcclxuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBzd2FsKHtcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhY2NlcHQ6IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBhY2NlcHQgdGhlbVwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gYWNjZXB0IFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIiFcIixcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiXHJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB5ZXM6IHtcclxuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBhY2NlcHQgdGhpcyB1c2VyXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcclxuICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcclxuICAgICAgICAgIHRleHQ6XHJcbiAgICAgICAgICAgIFwiWW91ciBhY2NvdW50IHdpbGwgYmUgbG9nZ2VkIGFzIGhhdmluZyBhY2NlcHRlZCB0aGlzIHVzZXIuIFwiICtcclxuICAgICAgICAgICAgXCJSZW1lbWJlciwgdGhpcyBwb3dlciBpcyBhIHByaXZpbGVnZS5cIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiXHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgVXNlclNlcnZpY2Uuc29mdEFkbWl0dFVzZXIodXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIkFjY2VwdGVkXCIsXHJcbiAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5wcm9maWxlLm5hbWUgKyBcIiBoYXMgYmVlbiBhZG1pdHRlZC5cIixcclxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgJHNjb3BlLnJlamVjdHRVc2VyID0gZnVuY3Rpb24oJGV2ZW50LCB1c2VyLCBpbmRleCkge1xyXG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGFjY2VwdDoge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlamVjdCB0aGVtXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYW5nZXJNb2RlOiB0cnVlLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byByZWplY3QgXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCJcclxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB5ZXM6IHtcclxuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZWplY3QgdGhpcyB1c2VyXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcclxuICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcclxuICAgICAgICAgIHRleHQ6XHJcbiAgICAgICAgICAgIFwiWW91ciBhY2NvdW50IHdpbGwgYmUgbG9nZ2VkIGFzIGhhdmluZyByZWplY3RlZCB0aGlzIHVzZXIuIFwiICtcclxuICAgICAgICAgICAgXCJSZW1lbWJlciwgdGhpcyBwb3dlciBpcyBhIHByaXZpbGVnZS5cIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiXHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgVXNlclNlcnZpY2Uuc29mdFJlamVjdFVzZXIodXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIlJlamVjdGVkXCIsXHJcbiAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5wcm9maWxlLm5hbWUgKyBcIiBoYXMgYmVlbiByZWplY3RlZC5cIixcclxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG5cclxuICAgICRzY29wZS5yZW1vdmVVc2VyID0gZnVuY3Rpb24oJGV2ZW50LCB1c2VyLCBpbmRleCkge1xyXG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG5cclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYWNjZXB0OiB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVtb3ZlIHRoZW1cIixcclxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhbmdlck1vZGU6IHRydWUsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIHJlbW92ZSBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIhXCIsXHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIlxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHllczoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSB0aGlzIHVzZXJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkYW5nZXJNb2RlOiB0cnVlLFxyXG4gICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxyXG4gICAgICAgICAgdGV4dDpcclxuICAgICAgICAgICAgXCJZb3VyIGFjY291bnQgd2lsbCBiZSBsb2dnZWQgYXMgaGF2aW5nIHJlbW92ZWQgdGhpcyB1c2VyLiBcIiArXHJcbiAgICAgICAgICAgIFwiUmVtZW1iZXIsIHRoaXMgcG93ZXIgaXMgYSBwcml2aWxlZ2UuXCIsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIlxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgVXNlclNlcnZpY2UucmVtb3ZlVXNlcih1c2VyLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2Vyc1tpbmRleF0gPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxyXG4gICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEucHJvZmlsZS5uYW1lICsgXCIgaGFzIGJlZW4gcmVtb3ZlZC5cIixcclxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zZW5kQWNjZXB0YW5jZUVtYWlscyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBjb25zdCBmaWx0ZXJTb2Z0QWNjZXB0ZWQgPSAkc2NvcGUudXNlcnMuZmlsdGVyKFxyXG4gICAgICAgIHUgPT4gdS5zdGF0dXMuc29mdEFkbWl0dGVkICYmICF1LnN0YXR1cy5hZG1pdHRlZFxyXG4gICAgICApO1xyXG5cclxuICAgICAgdmFyIG1lc3NhZ2UgPSAkKHRoaXMpLmRhdGEoXCJjb25maXJtXCIpO1xyXG5cclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICB0ZXh0OiBgWW91J3JlIGFib3V0IHRvIHNlbmQgYWNjZXB0YW5jZSBlbWFpbHMgKGFuZCBhY2NlcHQpICR7XHJcbiAgICAgICAgICBmaWx0ZXJTb2Z0QWNjZXB0ZWQubGVuZ3RoXHJcbiAgICAgICAgfSB1c2VyKHMpLmAsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgYnV0dG9uczogW1wiQ2FuY2VsXCIsIFwiWWVzLCBhY2NlcHQgdGhlbSBhbmQgc2VuZCB0aGUgZW1haWxzXCJdLFxyXG4gICAgICAgIGRhbmdlck1vZGU6IHRydWVcclxuICAgICAgfSkudGhlbih3aWxsU2VuZCA9PiB7XHJcbiAgICAgICAgaWYgKHdpbGxTZW5kKSB7XHJcbiAgICAgICAgICBpZiAoZmlsdGVyU29mdEFjY2VwdGVkLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBmaWx0ZXJTb2Z0QWNjZXB0ZWQuZm9yRWFjaCh1c2VyID0+IHtcclxuICAgICAgICAgICAgICBVc2VyU2VydmljZS5hZG1pdFVzZXIodXNlci5faWQpOyBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJTZW5kaW5nIVwiLFxyXG4gICAgICAgICAgICAgIGBBY2NlcHRpbmcgYW5kIHNlbmRpbmcgZW1haWxzIHRvICR7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJTb2Z0QWNjZXB0ZWQubGVuZ3RoXHJcbiAgICAgICAgICAgICAgfSB1c2VycyFgLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzd2FsKFwiV2hvb3BzXCIsIFwiWW91IGNhbid0IHNlbmQgb3IgYWNjZXB0IDAgdXNlcnMhXCIsIFwiZXJyb3JcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICAkc2NvcGUuc2VuZFJlamVjdGlvbkVtYWlscyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBjb25zdCBmaWx0ZXJTb2Z0UmVqZWN0ZWQgPSAkc2NvcGUudXNlcnMuZmlsdGVyKFxyXG4gICAgICAgIHUgPT4gdS5zdGF0dXMuc29mdFJlamVjdGVkXHJcbiAgICAgICk7XHJcblxyXG4gICAgICB2YXIgbWVzc2FnZSA9ICQodGhpcykuZGF0YShcImNvbmZpcm1cIik7XHJcblxyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgIHRleHQ6IGBZb3UncmUgYWJvdXQgdG8gc2VuZCByZWplY3Rpb24gZW1haWxzIChhbmQgcmVqZWN0KSAke1xyXG4gICAgICAgICAgZmlsdGVyU29mdFJlamVjdGVkLmxlbmd0aFxyXG4gICAgICAgIH0gdXNlcihzKS5gLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIGJ1dHRvbnM6IFtcIkNhbmNlbFwiLCBcIlllcywgcmVqZWN0IHRoZW0gYW5kIHNlbmQgdGhlIGVtYWlsc1wiXSxcclxuICAgICAgICBkYW5nZXJNb2RlOiB0cnVlXHJcbiAgICAgIH0pLnRoZW4od2lsbFNlbmQgPT4ge1xyXG4gICAgICAgIGlmICh3aWxsU2VuZCkge1xyXG4gICAgICAgICAgaWYgKGZpbHRlclNvZnRSZWplY3RlZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZmlsdGVyU29mdFJlamVjdGVkLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgICAgICAgVXNlclNlcnZpY2UucmVqZWN0VXNlcih1c2VyLl9pZCk7IFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIlNlbmRpbmchXCIsXHJcbiAgICAgICAgICAgICAgYFJlamVjdGluZyBhbmQgc2VuZGluZyBlbWFpbHMgdG8gJHtcclxuICAgICAgICAgICAgICAgIGZpbHRlclNvZnRSZWplY3RlZC5sZW5ndGhcclxuICAgICAgICAgICAgICB9IHVzZXJzIWAsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJXaG9vcHNcIiwgXCJZb3UgY2FuJ3Qgc2VuZCBvciByZWplY3QgMCB1c2VycyFcIiwgXCJlcnJvclwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgJHNjb3BlLmV4cG9ydFVzZXJzID0gZnVuY3Rpb24oKXtcclxuICAgICAgdmFyIGNvbHVtbnMgPSBbXCJOwrBcIiwgXCJHZW5kZXJcIiwgXCJGdWxsIE5hbWVcIixcIlNjaG9vbFwiXTtcclxuICAgICAgdmFyIHJvd3MgPSBbXTtcclxuICAgICAgVXNlclNlcnZpY2UuZ2V0QWxsKCkudGhlbih1c2VycyA9PiB7XHJcbiAgICAgICAgdmFyIGk9MTtcclxuICAgICAgICB1c2Vycy5kYXRhLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgICByb3dzLnB1c2goW2krKyx1c2VyLnByb2ZpbGUuZ2VuZGVyLHVzZXIucHJvZmlsZS5uYW1lLHVzZXIucHJvZmlsZS5zY2hvb2xdKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBkb2MgPSBuZXcganNQREYoJ3AnLCAncHQnKTtcclxuXHJcblxyXG4gICAgICAgIHZhciB0b3RhbFBhZ2VzRXhwID0gXCJ7dG90YWxfcGFnZXNfY291bnRfc3RyaW5nfVwiO1xyXG5cclxuICAgICAgICB2YXIgcGFnZUNvbnRlbnQgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAvLyBIRUFERVJcclxuICAgICAgICAgICAgZG9jLnNldEZvbnRTaXplKDIwKTtcclxuICAgICAgICAgICAgZG9jLnNldFRleHRDb2xvcig0MCk7XHJcbiAgICAgICAgICAgIGRvYy5zZXRGb250U3R5bGUoJ25vcm1hbCcpO1xyXG4gICAgICAgICAgICAvLyBpZiAoYmFzZTY0SW1nKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBkb2MuYWRkSW1hZ2UoYmFzZTY0SW1nLCAnSlBFRycsIGRhdGEuc2V0dGluZ3MubWFyZ2luLmxlZnQsIDE1LCAxMCwgMTApO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIGRvYy50ZXh0KFwiUGFydGljaXBhbnRzIExpc3RcIiwgZGF0YS5zZXR0aW5ncy5tYXJnaW4ubGVmdCArIDE1LCAyMik7XHJcbiAgICBcclxuICAgICAgICAgICAgLy8gRk9PVEVSXHJcbiAgICAgICAgICAgIHZhciBzdHIgPSBcIlBhZ2UgXCIgKyBkYXRhLnBhZ2VDb3VudDtcclxuICAgICAgICAgICAgLy8gVG90YWwgcGFnZSBudW1iZXIgcGx1Z2luIG9ubHkgYXZhaWxhYmxlIGluIGpzcGRmIHYxLjArXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZG9jLnB1dFRvdGFsUGFnZXMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHN0ciA9IHN0ciArIFwiIG9mIFwiICsgdG90YWxQYWdlc0V4cDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkb2Muc2V0Rm9udFNpemUoMTApO1xyXG4gICAgICAgICAgICB2YXIgcGFnZUhlaWdodCA9IGRvYy5pbnRlcm5hbC5wYWdlU2l6ZS5oZWlnaHQgfHwgZG9jLmludGVybmFsLnBhZ2VTaXplLmdldEhlaWdodCgpO1xyXG4gICAgICAgICAgICBkb2MudGV4dChzdHIsIGRhdGEuc2V0dGluZ3MubWFyZ2luLmxlZnQsIHBhZ2VIZWlnaHQgIC0gMTApO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgZG9jLmF1dG9UYWJsZShjb2x1bW5zLCByb3dzLCB7XHJcbiAgICAgICAgICAgIGFkZFBhZ2VDb250ZW50OiBwYWdlQ29udGVudCxcclxuICAgICAgICAgICAgbWFyZ2luOiB7dG9wOiAzMH0sXHJcbiAgICAgICAgICAgIHRoZW1lOiAnZ3JpZCdcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAodHlwZW9mIGRvYy5wdXRUb3RhbFBhZ2VzID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICBkb2MucHV0VG90YWxQYWdlcyh0b3RhbFBhZ2VzRXhwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZG9jLnNhdmUoJ1BhcnRpY2lwYW50cyBMaXN0LnBkZicpO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAkc2NvcGUudG9nZ2xlQWRtaW4gPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIsIGluZGV4KSB7XHJcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIGlmICghdXNlci5hZG1pbikge1xyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCBtYWtlIFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIiBhbiBhZG1pbiFcIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29uZmlybToge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBtYWtlIHRoZW0gYW4gYWRtaW5cIixcclxuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgVXNlclNlcnZpY2UubWFrZUFkbWluKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIHN3YWwoXCJNYWRlXCIsIHJlc3BvbnNlLmRhdGEucHJvZmlsZS5uYW1lICsgXCIgYW4gYWRtaW4uXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgVXNlclNlcnZpY2UucmVtb3ZlQWRtaW4odXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICBzd2FsKFwiUmVtb3ZlZFwiLCByZXNwb25zZS5kYXRhLnByb2ZpbGUubmFtZSArIFwiIGFzIGFkbWluXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBmb3JtYXRUaW1lKHRpbWUpIHtcclxuICAgICAgaWYgKHRpbWUpIHtcclxuICAgICAgICByZXR1cm4gbW9tZW50KHRpbWUpLmZvcm1hdChcIk1NTU0gRG8gWVlZWSwgaDptbTpzcyBhXCIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnJvd0NsYXNzID0gZnVuY3Rpb24odXNlcikge1xyXG4gICAgICBpZiAodXNlci5hZG1pbikge1xyXG4gICAgICAgIHJldHVybiBcImFkbWluXCI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVzZXIuc3RhdHVzLmNvbmZpcm1lZCkge1xyXG4gICAgICAgIHJldHVybiBcInBvc2l0aXZlXCI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmICF1c2VyLnN0YXR1cy5jb25maXJtZWQpIHtcclxuICAgICAgICByZXR1cm4gXCJ3YXJuaW5nXCI7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gc2VsZWN0VXNlcih1c2VyKSB7XHJcbiAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSB1c2VyO1xyXG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKTtcclxuICAgICAgJChcIi5sb25nLnVzZXIubW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlU2VjdGlvbnModXNlcikge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6IFwiQmFzaWMgSW5mb1wiLFxyXG4gICAgICAgICAgZmllbGRzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkNyZWF0ZWQgT25cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLnRpbWVzdGFtcClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiTGFzdCBVcGRhdGVkXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5sYXN0VXBkYXRlZClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiQ29uZmlybSBCeVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSkgfHwgXCJOL0FcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJDaGVja2VkIEluXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY2hlY2tJblRpbWUpIHx8IFwiTi9BXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiRW1haWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5lbWFpbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiBcIlByb2ZpbGVcIixcclxuICAgICAgICAgIGZpZWxkczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJOYW1lXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5uYW1lXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdlbmRlclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ2VuZGVyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIlNjaG9vbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuc2Nob29sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdyYWR1YXRpb24gWWVhclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ3JhZHVhdGlvblllYXJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiSGFja2F0aG9ucyB2aXNpdGVkXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5ob3dNYW55SGFja2F0aG9uc1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJEZXNjcmlwdGlvblwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiRXNzYXlcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmVzc2F5XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIk1ham9yXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5tYWpvclxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJHaXRodWJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdpdGh1YlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJGYWNlYm9va1wiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZmFjZWJvb2tcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiTGlua2VkaW5cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmxpbmtlZGluXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOlwiQ1YgbGlua1wiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuY3ZMaW5rXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiBcIkNvbmZpcm1hdGlvblwiLFxyXG4gICAgICAgICAgZmllbGRzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIlBob25lIE51bWJlclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5waG9uZU51bWJlclxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJOZWVkcyBIYXJkd2FyZVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi53YW50c0hhcmR3YXJlLFxyXG4gICAgICAgICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkhhcmR3YXJlIFJlcXVlc3RlZFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5oYXJkd2FyZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTpcIk5hdGlvbmFsIENhcmQgSURcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ubmF0aW9uYWxDYXJkSURcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogXCJUcmF2ZWxcIixcclxuICAgICAgICAgIGZpZWxkczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJBZGRpdGlvbmFsIE5vdGVzXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm5vdGVzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25TdWNjZXNzKCkge1xyXG4gICAgICBzd2FsKFwiVXBkYXRlZCFcIiwgXCJOZXcgVm9sdW50ZWVyIEFkZGVkLlwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbkVycm9yKGRhdGEpe1xyXG4gICAgICBzd2FsKFwiVHJ5IGFnYWluIVwiLCBkYXRhLm1lc3NhZ2UsIFwiZXJyb3JcIilcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuYWRkVm9sdW50ZWVyID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgIHN3YWwoXCJXcml0ZSB0aGUgY2hhbGxlbmdlIHRpdGxlOlwiLCB7XHJcbiAgICAgICAgYnV0dG9uczoge2NhbmNlbDoge3RleHQ6IFwiQ2FuY2VsXCIsdmFsdWU6IG51bGwsdmlzaWJsZTogdHJ1ZX0sIHllczoge3RleHQ6IFwiSW52aXRlXCIsdmFsdWU6IHRydWUsdmlzaWJsZTogdHJ1ZX0gfSxcclxuICAgICAgICBjb250ZW50OiB7ZWxlbWVudDogXCJpbnB1dFwiLCBhdHRyaWJ1dGVzOiB7cGxhY2Vob2xkZXI6IFwiZXhhbXBsZUBnbWFpbC5jb21cIix0eXBlOiBcInRleHRcIn0gfSxcclxuICAgICAgfSkudGhlbigobWFpbCkgPT4geyBpZiAoIW1haWwpIHtyZXR1cm47fSBcclxuICAgICAgICBBdXRoU2VydmljZS5yZWdpc3RlcihcclxuICAgICAgICAgIG1haWwsIFwiaGFja2F0aG9uXCIsIG9uU3VjY2Vzcywgb25FcnJvciwgdHJ1ZSlcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgJHNjb3BlLnNlbGVjdFVzZXIgPSBzZWxlY3RVc2VyO1xyXG4gIH1cclxuXSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLnNlcnZpY2UoJ3NldHRpbmdzJywgZnVuY3Rpb24oKSB7fSlcclxuICAuY29udHJvbGxlcignQmFzZUN0cmwnLCBbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICdFVkVOVF9JTkZPJyxcclxuICAgIGZ1bmN0aW9uKCRzY29wZSwgRVZFTlRfSU5GTyl7XHJcblxyXG4gICAgICAkc2NvcGUuRVZFTlRfSU5GTyA9IEVWRU5UX0lORk87XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignYWRtaW5DdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnVXNlclNlcnZpY2UnLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBVc2VyU2VydmljZSl7XHJcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignQXBwbGljYXRpb25DdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJHJvb3RTY29wZScsXHJcbiAgICAnJHN0YXRlJyxcclxuICAgICckaHR0cCcsXHJcbiAgICAnY3VycmVudFVzZXInLFxyXG4gICAgJ3NldHRpbmdzJyxcclxuICAgICdTZXNzaW9uJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICAnTWFya2V0aW5nU2VydmljZScsXHJcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRodHRwLCBjdXJyZW50VXNlciwgc2V0dGluZ3MsIFNlc3Npb24sIFVzZXJTZXJ2aWNlLCBNYXJrZXRpbmdTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAvLyBTZXQgdXAgdGhlIHVzZXJcclxuICAgICAgJHNjb3BlLnVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xyXG5cclxuICAgICAgLy8gSXMgdGhlIHN0dWRlbnQgZnJvbSBIb3N0U2Nob29sP1xyXG4gICAgICAkc2NvcGUuaXNIb3N0U2Nob29sID0gJHNjb3BlLnVzZXIuZW1haWwuc3BsaXQoJ0AnKVsxXSA9PSBzZXR0aW5ncy5kYXRhLmhvc3RTY2hvb2w7XHJcblxyXG4gICAgICAvLyBJZiBzbywgZGVmYXVsdCB0aGVtIHRvIGFkdWx0OiB0cnVlXHJcbiAgICAgIGlmICgkc2NvcGUuaXNIb3N0U2Nob29sKSB7XHJcbiAgICAgICAgJHNjb3BlLnVzZXIucHJvZmlsZS5hZHVsdCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFBvcHVsYXRlIHRoZSBzY2hvb2wgZHJvcGRvd25cclxuICAgICAgcG9wdWxhdGVTY2hvb2xzKCk7XHJcbiAgICAgIF9zZXR1cEZvcm0oKTtcclxuXHJcbiAgICAgIHBvcHVsYXRlV2lsYXlhcygpO1xyXG4gICAgICBwb3B1bGF0ZUNsdWJzKCk7XHJcblxyXG4gICAgICAkc2NvcGUucmVnSXNDbG9zZWQgPSBEYXRlLm5vdygpID4gc2V0dGluZ3MuZGF0YS50aW1lQ2xvc2U7XHJcblxyXG4gICAgICBmdW5jdGlvbiBwb3B1bGF0ZVNjaG9vbHMoKSB7XHJcbiAgICAgICAgJGh0dHBcclxuICAgICAgICAgIC5nZXQoJy9hc3NldHMvc2Nob29scy5qc29uJylcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgdmFyIHNjaG9vbHMgPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgdmFyIGVtYWlsID0gJHNjb3BlLnVzZXIuZW1haWwuc3BsaXQoJ0AnKVsxXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzY2hvb2xzW2VtYWlsXSkge1xyXG4gICAgICAgICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUuc2Nob29sID0gc2Nob29sc1tlbWFpbF0uc2Nob29sO1xyXG4gICAgICAgICAgICAgICRzY29wZS5hdXRvRmlsbGVkU2Nob29sID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRodHRwXHJcbiAgICAgICAgICAuZ2V0KCcvYXNzZXRzL3NjaG9vbHMuY3N2JylcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnNjaG9vbHMgPSByZXMuZGF0YS5zcGxpdCgnXFxuJyk7XHJcbiAgICAgICAgICAgICRzY29wZS5zY2hvb2xzLnB1c2goJ090aGVyJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8ICRzY29wZS5zY2hvb2xzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLnNjaG9vbHNbaV0gPSAkc2NvcGUuc2Nob29sc1tpXS50cmltKCk7XHJcbiAgICAgICAgICAgICAgY29udGVudC5wdXNoKHsgdGl0bGU6ICRzY29wZS5zY2hvb2xzW2ldIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoJyNzY2hvb2wudWkuc2VhcmNoJylcclxuICAgICAgICAgICAgICAuc2VhcmNoKHtcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogY29udGVudCxcclxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uIChyZXN1bHQsIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUuc2Nob29sID0gcmVzdWx0LnRpdGxlLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICBmdW5jdGlvbiBwb3B1bGF0ZVdpbGF5YXMoKSB7XHJcbiAgICAgICAgJGh0dHBcclxuICAgICAgICAgIC5nZXQoJy9hc3NldHMvd2lsYXlhcy5jc3YnKVxyXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAkc2NvcGUud2lsYXlhcyA9IHJlcy5kYXRhLnNwbGl0KCdcXG4nKTtcclxuICAgICAgICAgICAgJHNjb3BlLndpbGF5YXMucHVzaCgnT3RoZXInKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgJHNjb3BlLndpbGF5YXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAkc2NvcGUud2lsYXlhc1tpXSA9ICRzY29wZS53aWxheWFzW2ldLnRyaW0oKTtcclxuICAgICAgICAgICAgICBjb250ZW50LnB1c2goeyB0aXRsZTogJHNjb3BlLndpbGF5YXNbaV0gfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJCgnI3dpbGF5YS51aS5zZWFyY2gnKVxyXG4gICAgICAgICAgICAgIC5zZWFyY2goe1xyXG4gICAgICAgICAgICAgICAgc291cmNlOiBjb250ZW50LFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24gKHJlc3VsdCwgcmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXIucHJvZmlsZS53aWxheWEgPSByZXN1bHQudGl0bGUudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlQ2x1YnMoKSB7XHJcbiAgICAgICAgJGh0dHBcclxuICAgICAgICAgIC5nZXQoJy9hc3NldHMvY2x1YnMuY3N2JylcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmNsdWJzID0gcmVzLmRhdGEuc3BsaXQoJ1xcbicpO1xyXG4gICAgICAgICAgICAkc2NvcGUuY2x1YnMucHVzaCgnT3RoZXInKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgJHNjb3BlLmNsdWJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLmNsdWJzW2ldID0gJHNjb3BlLmNsdWJzW2ldLnRyaW0oKTtcclxuICAgICAgICAgICAgICBjb250ZW50LnB1c2goeyB0aXRsZTogJHNjb3BlLmNsdWJzW2ldIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoJyNjbHViLnVpLnNlYXJjaCcpXHJcbiAgICAgICAgICAgICAgLnNlYXJjaCh7XHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IGNvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbiAocmVzdWx0LCByZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAkc2NvcGUuY2x1YiA9IHJlc3VsdC50aXRsZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIGlmICgkc2NvcGUudXNlci5wcm9maWxlLnNvdXJjZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICRzY29wZS5Vc2VyU291cmNlID0gJHNjb3BlLnVzZXIucHJvZmlsZS5zb3VyY2Uuc3BsaXQoJyMnKVswXTtcclxuICAgICAgICAgICRzY29wZS5jbHViID0gJHNjb3BlLnVzZXIucHJvZmlsZS5zb3VyY2Uuc3BsaXQoJyMnKVsxXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICBmdW5jdGlvbiByZW1vdmVEdXBsaWNhdGVzKG15QXJyLCBwcm9wKSB7XHJcbiAgICAgICAgcmV0dXJuIG15QXJyLmZpbHRlcigob2JqLCBwb3MsIGFycikgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGFyci5tYXAobWFwT2JqID0+IG1hcE9ialtwcm9wXSkuaW5kZXhPZihvYmpbcHJvcF0pID09PSBwb3M7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHNlbmRNYXJrZXRpbmdFbWFpbHMoKSB7XHJcbiAgICAgICAgTWFya2V0aW5nU2VydmljZS5nZXRBbGwoKS50aGVuKHRlYW1zID0+IHtcclxuICAgICAgICAgIHZhciBlbWFpbHMgPSBbXTtcclxuICAgICAgICAgIHRlYW1zLmRhdGEuZm9yRWFjaCh0ZWFtID0+IHtcclxuICAgICAgICAgICAgdmFyIGlzVGVhbW1hdGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcclxuICAgICAgICAgICAgICBpZiAobWVtYmVyID09IGN1cnJlbnRVc2VyLmRhdGEuZW1haWwpIHtcclxuICAgICAgICAgICAgICAgIGlzVGVhbW1hdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChpc1RlYW1tYXRlKSB7XHJcbiAgICAgICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghKG1lbWJlciA9PSBjdXJyZW50VXNlci5kYXRhLmVtYWlsKSkge1xyXG4gICAgICAgICAgICAgICAgICBlbWFpbHMucHVzaCh7IGVtYWlsOiBtZW1iZXIsIGV2ZW50OiB0ZWFtLmV2ZW50IH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmVtb3ZlRHVwbGljYXRlcyhlbWFpbHMsICdlbWFpbCcpLmZvckVhY2godGVhbW1hdGUgPT4ge1xyXG4gICAgICAgICAgICBNYXJrZXRpbmdTZXJ2aWNlLnNlbmRGcmllbmRJbnZpdGUoY3VycmVudFVzZXIuZGF0YS5wcm9maWxlLm5hbWUsIHRlYW1tYXRlKVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIGZ1bmN0aW9uIF91cGRhdGVVc2VyKGUpIHtcclxuXHJcbiAgICAgICAgLy9DaGVjayBpZiBVc2VyJ3MgZmlyc3Qgc3VibWlzc2lvblxyXG4gICAgICAgIHZhciBzZW5kTWFpbCA9IHRydWU7XHJcbiAgICAgICAgaWYgKGN1cnJlbnRVc2VyLmRhdGEuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUpIHsgc2VuZE1haWwgPSBmYWxzZSB9XHJcblxyXG4gICAgICAgIC8vIEdldCB1c2VyIFNvdXJjZVxyXG4gICAgICAgIGlmICgkc2NvcGUuVXNlclNvdXJjZSAhPSAnMicpIHsgJHNjb3BlLnVzZXIucHJvZmlsZS5zb3VyY2UgPSAkc2NvcGUuVXNlclNvdXJjZSB9XHJcbiAgICAgICAgZWxzZSB7ICRzY29wZS51c2VyLnByb2ZpbGUuc291cmNlID0gJHNjb3BlLlVzZXJTb3VyY2UgKyBcIiNcIiArICRzY29wZS5jbHViIH1cclxuXHJcbiAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVQcm9maWxlKFNlc3Npb24uZ2V0VXNlcklkKCksICRzY29wZS51c2VyLnByb2ZpbGUpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJBd2Vzb21lIVwiLCBcIllvdXIgYXBwbGljYXRpb24gaGFzIGJlZW4gc2F2ZWQuXCIsIFwic3VjY2Vzc1wiKS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICBpZiAoc2VuZE1haWwpIHsgc2VuZE1hcmtldGluZ0VtYWlscygpOyB9XHJcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLmRhc2hib2FyZFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJVaCBvaCFcIiwgXCJTb21ldGhpbmcgd2VudCB3cm9uZy5cIiwgXCJlcnJvclwiKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gaXNNaW5vcigpIHtcclxuICAgICAgICByZXR1cm4gISRzY29wZS51c2VyLnByb2ZpbGUuYWR1bHQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG1pbm9yc0FyZUFsbG93ZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHNldHRpbmdzLmRhdGEuYWxsb3dNaW5vcnM7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG1pbm9yc1ZhbGlkYXRpb24oKSB7XHJcbiAgICAgICAgLy8gQXJlIG1pbm9ycyBhbGxvd2VkIHRvIHJlZ2lzdGVyP1xyXG4gICAgICAgIGlmIChpc01pbm9yKCkgJiYgIW1pbm9yc0FyZUFsbG93ZWQoKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gX3NldHVwRm9ybSgpIHtcclxuICAgICAgICAvLyBDdXN0b20gbWlub3JzIHZhbGlkYXRpb24gcnVsZVxyXG4gICAgICAgICQuZm4uZm9ybS5zZXR0aW5ncy5ydWxlcy5hbGxvd01pbm9ycyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuIG1pbm9yc1ZhbGlkYXRpb24oKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBTZW1hbnRpYy1VSSBmb3JtIHZhbGlkIGF0aW9uXHJcbiAgICAgICAgJCgnLnVpLmZvcm0nKS5mb3JtKHtcclxuICAgICAgICAgIG9uOiAnYmx1cicsXHJcbiAgICAgICAgICBpbmxpbmU6IHRydWUsXHJcbiAgICAgICAgICBmaWVsZHM6IHtcclxuICAgICAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICduYW1lJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgeW91ciBuYW1lLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNjaG9vbDoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzY2hvb2wnLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIHNjaG9vbCBuYW1lLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFdpbGF5YToge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdXaWxheWEnLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIHdpbGF5YSBuYW1lLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHllYXI6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAneWVhcicsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHNlbGVjdCB5b3VyIGdyYWR1YXRpb24geWVhci4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZW5kZXI6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnZ2VuZGVyJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2Ugc2VsZWN0IGEgZ2VuZGVyLiAnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBob3dNYW55SGFja2F0aG9uczoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdob3dNYW55SGFja2F0aG9ucycsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHNlbGVjdCBob3cgbWFueSBoYWNrYXRob25zIHlvdSBoYXZlIGF0dGVuZGVkLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFkdWx0OiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2FkdWx0JyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnYWxsb3dNaW5vcnMnLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdZb3UgbXVzdCBiZSBhbiBhZHVsdCwgb3IgYW4gRVNJIHN0dWRlbnQuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3R1ZHk6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnc3R1ZHknLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIG1ham9yIC4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdkZXNjcmlwdGlvbicsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGRlc2NyaWJlIHlvdXJzZWxmIC4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlc3NheToge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdlc3NheScsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHRlbGwgdXMgYWJvdXQgeW91ciBtb3RpdmF0aW9uIC4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsaW5rZWRpbjoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdsaW5rZWRpbicsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3VybCcsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciBhIHZhbGlkIExpbmtlZGluIFVSTCAuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmFjZWJvb2s6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnZmFjZWJvb2snLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICd1cmwnLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBGYWNlYm9vayBVUkwgLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdpdGh1Yjoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdnaXRodWInLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICd1cmwnLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBHaXRIdWIgVVJMIC4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBVc2VyU291cmNlOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ1VzZXJTb3VyY2UnLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ0hvdyBkaWQgeW91IGhlYXIgYWJvdXQgdXMgPydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGN2TGluazoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdjdkxpbmsnLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICd1cmwnLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdZb3UgbXVzdCBhZGQgYSBsaW5rIHRvIHlvdXIgQ1YuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUuc3VibWl0Rm9ybSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCgnLnVpLmZvcm0nKS5mb3JtKCdpcyB2YWxpZCcpKSB7XHJcbiAgICAgICAgICAvLyAkKCcudWkuc3VibWl0LmJ1dHRvbicpLmNsaWNrKCk7XHJcbiAgICAgICAgICBfdXBkYXRlVXNlcigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzd2FsKFwiVWggb2ghXCIsIFwiUGxlYXNlIEZpbGwgVGhlIFJlcXVpcmVkIEZpZWxkc1wiLCBcImVycm9yXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ0NoYWxsZW5nZXNDdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJHJvb3RTY29wZScsXHJcbiAgICAnJHN0YXRlJyxcclxuICAgICckaHR0cCcsXHJcbiAgICAnY3VycmVudFVzZXInLFxyXG4gICAgJ1Nlc3Npb24nLFxyXG4gICAgJ0NoYWxsZW5nZVNlcnZpY2UnLFxyXG4gICAgJ1VzZXJTZXJ2aWNlJyxcclxuICAgICdTb2x2ZWRDVEZTZXJ2aWNlJyxcclxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkaHR0cCwgY3VycmVudFVzZXIsIFNlc3Npb24sIENoYWxsZW5nZVNlcnZpY2UsIFVzZXJTZXJ2aWNlLCBTb2x2ZWRDVEZTZXJ2aWNlKSB7XHJcblxyXG4gICAgICBcclxuICAgICAgU29sdmVkQ1RGU2VydmljZS5nZXRBbGwoKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICBzb2x2ZWRDaGFsbGVuZ2VzPSByZXNwb25zZS5kYXRhLmZpbHRlcihzID0+IHMudXNlcj09Y3VycmVudFVzZXIuZGF0YS5faWQpXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgXHJcblxyXG4gICAgICBDaGFsbGVuZ2VTZXJ2aWNlLmdldEFsbCgpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICRzY29wZS5jaGFsbGVuZ2VzID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgfSk7XHJcblxyXG5cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uU3VjY2VzcyhjaGFsbGVuZ2UpIHtcclxuICAgICAgICBzd2FsKFwiQXdlc29tZSFcIiwgXCJUaGF0J3MgY29ycmVjdCwgYW5kIHlvdSBqdXN0IGVhcm5lZCArXCIrIGNoYWxsZW5nZS5wb2ludHMgK1wiIHBvaW50cy5cIiwgXCJzdWNjZXNzXCIpXHJcbiAgICAgICAgJHN0YXRlLnJlbG9hZCgpXHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBvbkVycm9yKGRhdGEpe1xyXG4gICAgICAgIHN3YWwoXCJUcnkgYWdhaW4hXCIsIGRhdGEubWVzc2FnZSwgXCJlcnJvclwiKSBcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgICRzY29wZS5zb2x2ZUNoYWxsZW5nZSA9IGZ1bmN0aW9uKGNoYWxsZW5nZSxhbnN3ZXIsIGlzZW50ZXIpIHtcclxuICAgICAgICBpZiAoaXNlbnRlcil7XHJcbiAgICAgICAgICBTb2x2ZWRDVEZTZXJ2aWNlLnNvbHZlKGNoYWxsZW5nZSxjdXJyZW50VXNlcixhbnN3ZXIsb25TdWNjZXNzLG9uRXJyb3IpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgU29sdmVkQ1RGU2VydmljZS5zb2x2ZShjaGFsbGVuZ2UsY3VycmVudFVzZXIsYW5zd2VyLG9uU3VjY2Vzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICB9XHJcblxyXG4gICAgICBcclxuICAgICAgJHNjb3BlLnNob3dDaGFsbGVuZ2UgPSBmdW5jdGlvbihjaGFsbGVuZ2UpIHtcclxuXHJcbiAgICAgICAgQ2hhbGxlbmdlU2VydmljZS5nZXQoY2hhbGxlbmdlLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XHJcblxyXG4gICAgICAgICAgc3dhbChyZXNwb25zZS5kYXRhLnRpdGxlLCByZXNwb25zZS5kYXRhLmRlc2NyaXB0aW9uKVxyXG5cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgICBTb2x2ZWRDVEZTZXJ2aWNlLmdldEFsbCgpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgIGFsbENoYWxsZW5nZXM9IHJlc3BvbnNlLmRhdGFcclxuICAgICAgICB2YXIgUmVzdWx0ID1bXVxyXG5cclxuICAgICAgICBhbGxDaGFsbGVuZ2VzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICB1c2VyQ2hhbGxlbmdlcyA9IGFsbENoYWxsZW5nZXMuZmlsdGVyKHMgPT4gcy51c2VyPT1lbGVtZW50LnVzZXIpXHJcbiAgICAgICAgICB2YXIgcG9pbnRzQ291bnQgPSAwO1xyXG5cclxuICAgICAgICAgIHVzZXJDaGFsbGVuZ2VzLmZvckVhY2goY2hhbGxlbmdlID0+IHsgcG9pbnRzQ291bnQrPWNoYWxsZW5nZS5wb2ludHMgfSk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFVzZXJTZXJ2aWNlLmdldChlbGVtZW50LnVzZXIpLnRoZW4odXNlciA9PntcclxuXHJcbiAgICAgICAgICAgIHZhciBncmFkZT1bXVxyXG4gICAgICAgICAgICBncmFkZVsyMDE5XSA9IFwiM0NTXCJcclxuICAgICAgICAgICAgZ3JhZGVbMjAyMF0gPSBcIjJDU1wiXHJcbiAgICAgICAgICAgIGdyYWRlWzIwMjFdID0gXCIxQ1NcIlxyXG4gICAgICAgICAgICBncmFkZVsyMDIyXSA9IFwiMkNQXCJcclxuICAgICAgICAgICAgZ3JhZGVbMjAyM10gPSBcIjFDUFwiXHJcblxyXG4gICAgICAgICAgICBpZiAocG9pbnRzQ291bnQ+MCkge1Jlc3VsdC5wdXNoKHsgaWQ6dXNlci5kYXRhLl9pZCwgbmFtZTogdXNlci5kYXRhLnByb2ZpbGUubmFtZSwgZ3JhZGU6IGdyYWRlW3VzZXIuZGF0YS5wcm9maWxlLmdyYWR1YXRpb25ZZWFyXSAscG9pbnRzOiBwb2ludHNDb3VudH0pfVxyXG5cclxuICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgYWxsQ2hhbGxlbmdlcyA9IGFsbENoYWxsZW5nZXMuZmlsdGVyKHMgPT4gcy51c2VyIT09ZWxlbWVudC51c2VyKVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUuUmVzdWx0ID0gUmVzdWx0O1xyXG4gICAgICB9KTtcclxuICAgIFxyXG5cclxuICAgICAgJHNjb3BlLnJvd0NsYXNzID0gZnVuY3Rpb24odXNlcikge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh1c2VyLmlkPT1jdXJyZW50VXNlci5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgcmV0dXJuIFwiYWRtaW5cIjtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgXHJcbiAgICAgIFxyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbi5jb250cm9sbGVyKCdDaGVja2luQ3RybCcsIFtcclxuICAnJHNjb3BlJyxcclxuICAnJHN0YXRlJyxcclxuICAnJHN0YXRlUGFyYW1zJyxcclxuICAnVXNlclNlcnZpY2UnLFxyXG4gIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIFVzZXJTZXJ2aWNlKXtcclxuICAgICQoJyNyZWFkZXInKS5odG1sNV9xcmNvZGUoZnVuY3Rpb24odXNlcklEKXtcclxuICAgICAgICAgIC8vQ2hhbmdlIHRoZSBpbnB1dCBmaWVsZHMgdmFsdWUgYW5kIHNlbmQgcG9zdCByZXF1ZXN0IHRvIHRoZSBiYWNrZW5kXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFVzZXJTZXJ2aWNlLmdldCh1c2VySUQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG5cclxuICAgICAgICAgICAgdXNlciA9cmVzcG9uc2UuZGF0YTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdXNlci5zdGF0dXMuY2hlY2tlZEluKSB7XHJcbiAgICAgICAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGNoZWNrIGluIFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIiFcIixcclxuICAgICAgICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIGNoZWNrIHRoZW0gaW5cIixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICBcclxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLmNoZWNrSW4odXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAkc2NvcGUucXVlcnlUZXh0ID0gdXNlci5lbWFpbDtcclxuICAgICAgICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICAgICAgICBcIkNoZWNrZWQgaW5cIixcclxuICAgICAgICAgICAgICAgICAgICB1c2VyLnByb2ZpbGUubmFtZSArIFwiIGhhcyBiZWVuIGNoZWNrZWQgaW4uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgICBcIkFscmVhZHkgY2hlY2tlZEluXCIsXHJcbiAgICAgICAgICAgICAgICB1c2VyLnByb2ZpbGUubmFtZSArIFwiIGhhcyBiZWVuIGNoZWNrZWQtaW4gYXQ6IFwiKyBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNoZWNrSW5UaW1lKSxcclxuICAgICAgICAgICAgICAgIFwid2FybmluZ1wiXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgICBmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgIH0sIGZ1bmN0aW9uKHZpZGVvRXJyb3Ipe1xyXG4gICAgICAgIC8vdGhlIHZpZGVvIHN0cmVhbSBjb3VsZCBiZSBvcGVuZWRcclxuICAgICAgfVxyXG4gICAgKTtcclxuICAgICRzY29wZS5wYWdlcyA9IFtdO1xyXG4gICAgJHNjb3BlLnVzZXJzID0gW107XHJcbiAgICAkc2NvcGUuc29ydEJ5ID0gJ3RpbWVzdGFtcCdcclxuICAgICRzY29wZS5zb3J0RGlyID0gZmFsc2VcclxuXHJcbiAgICAkc2NvcGUuZmlsdGVyID0gZGVzZXJpYWxpemVGaWx0ZXJzKCRzdGF0ZVBhcmFtcy5maWx0ZXIpO1xyXG4gICAgJHNjb3BlLmZpbHRlci50ZXh0ID0gJHN0YXRlUGFyYW1zLnF1ZXJ5IHx8IFwiXCI7XHJcblxyXG4gICAgZnVuY3Rpb24gZGVzZXJpYWxpemVGaWx0ZXJzKHRleHQpIHtcclxuICAgICAgdmFyIG91dCA9IHt9O1xyXG4gICAgICBpZiAoIXRleHQpIHJldHVybiBvdXQ7XHJcbiAgICAgIHRleHQuc3BsaXQoXCIsXCIpLmZvckVhY2goZnVuY3Rpb24oZil7b3V0W2ZdPXRydWV9KTtcclxuICAgICAgcmV0dXJuICh0ZXh0Lmxlbmd0aD09PTApP3t9Om91dDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXJpYWxpemVGaWx0ZXJzKGZpbHRlcnMpIHtcclxuICAgICAgdmFyIG91dCA9IFwiXCI7XHJcbiAgICAgIGZvciAodmFyIHYgaW4gZmlsdGVycykge2lmKHR5cGVvZihmaWx0ZXJzW3ZdKT09PVwiYm9vbGVhblwiJiZmaWx0ZXJzW3ZdKSBvdXQgKz0gditcIixcIjt9XHJcbiAgICAgIHJldHVybiAob3V0Lmxlbmd0aD09PTApP1wiXCI6b3V0LnN1YnN0cigwLG91dC5sZW5ndGgtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2VtYW50aWMtVUkgbW92ZXMgbW9kYWwgY29udGVudCBpbnRvIGEgZGltbWVyIGF0IHRoZSB0b3AgbGV2ZWwuXHJcbiAgICAvLyBXaGlsZSB0aGlzIGlzIHVzdWFsbHkgbmljZSwgaXQgbWVhbnMgdGhhdCB3aXRoIG91ciByb3V0aW5nIHdpbGwgZ2VuZXJhdGVcclxuICAgIC8vIG11bHRpcGxlIG1vZGFscyBpZiB5b3UgY2hhbmdlIHN0YXRlLiBLaWxsIHRoZSB0b3AgbGV2ZWwgZGltbWVyIG5vZGUgb24gaW5pdGlhbCBsb2FkXHJcbiAgICAvLyB0byBwcmV2ZW50IHRoaXMuXHJcbiAgICAkKCcudWkuZGltbWVyJykucmVtb3ZlKCk7XHJcbiAgICAvLyBQb3B1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgbW9kYWwgZm9yIHdoZW4gaXQgYXBwZWFycywgd2l0aCBhbiBhcmJpdHJhcnkgdXNlci5cclxuICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSB7fTtcclxuICAgICRzY29wZS5zZWxlY3RlZFVzZXIuc2VjdGlvbnMgPSBnZW5lcmF0ZVNlY3Rpb25zKHtcclxuICAgICAgc3RhdHVzOiBcIlwiLFxyXG4gICAgICBjb25maXJtYXRpb246IHtcclxuICAgICAgICBkaWV0YXJ5UmVzdHJpY3Rpb25zOiBbXVxyXG4gICAgICB9LFxyXG4gICAgICBwcm9maWxlOiBcIlwiXHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVQYWdlKGRhdGEpIHtcclxuICAgICAgJHNjb3BlLnVzZXJzID0gZGF0YS51c2VycztcclxuICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gZGF0YS5wYWdlO1xyXG4gICAgICAkc2NvcGUucGFnZVNpemUgPSBkYXRhLnNpemU7XHJcblxyXG4gICAgICB2YXIgcCA9IFtdO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEudG90YWxQYWdlczsgaSsrKSB7XHJcbiAgICAgICAgcC5wdXNoKGkpO1xyXG4gICAgICB9XHJcbiAgICAgICRzY29wZS5wYWdlcyA9IHA7XHJcbiAgICB9XHJcblxyXG4gICAgVXNlclNlcnZpY2UuZ2V0UGFnZSgkc3RhdGVQYXJhbXMucGFnZSwgJHN0YXRlUGFyYW1zLnNpemUsICRzdGF0ZVBhcmFtcy5xdWVyeSwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMpXHJcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcblxyXG4gICAgICB1cGRhdGVQYWdlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJHNjb3BlLiR3YXRjaChcInF1ZXJ5VGV4dFwiLCBmdW5jdGlvbihxdWVyeVRleHQpIHtcclxuICAgICAgVXNlclNlcnZpY2UuZ2V0UGFnZSgkc3RhdGVQYXJhbXMucGFnZSwgJHN0YXRlUGFyYW1zLnNpemUsIHF1ZXJ5VGV4dCwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMpLnRoZW4oXHJcbiAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgdXBkYXRlUGFnZShyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgJHNjb3BlLmFwcGx5U3RhdHVzRmlsdGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgIC5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHNjb3BlLnF1ZXJ5VGV4dCwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMpLnRoZW4oXHJcbiAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVBhZ2UocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAkc2NvcGUuZ29Ub1BhZ2UgPSBmdW5jdGlvbihwYWdlKSB7XHJcbiAgICAgICRzdGF0ZS5nbyhcImFwcC5hZG1pbi51c2Vyc1wiLCB7XHJcbiAgICAgICAgcGFnZTogcGFnZSxcclxuICAgICAgICBzaXplOiAkc3RhdGVQYXJhbXMuc2l6ZSB8fCAyMFxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNoZWNrSW4gPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIsIGluZGV4KSB7XHJcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIGlmICghdXNlci5zdGF0dXMuY2hlY2tlZEluKSB7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGNoZWNrIGluIFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIiFcIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIGNoZWNrIHRoZW0gaW5cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIFVzZXJTZXJ2aWNlLmNoZWNrSW4odXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIkNoZWNrZWQgaW5cIixcclxuICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLnByb2ZpbGUubmFtZSArIFwiIGhhcyBiZWVuIGNoZWNrZWQgaW4uXCIsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3dhbChcclxuICAgICAgICAgIFwiQWxyZWFkeSBjaGVja2VkSW5cIixcclxuICAgICAgICAgIHVzZXIucHJvZmlsZS5uYW1lICsgXCIgaGFzIGJlZW4gY2hlY2tlZC1pbiBhdDogXCIrIGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY2hlY2tJblRpbWUpLFxyXG4gICAgICAgICAgXCJ3YXJuaW5nXCJcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGZvcm1hdFRpbWUodGltZSkge1xyXG4gICAgICBpZiAodGltZSkge1xyXG4gICAgICAgIHJldHVybiBtb21lbnQodGltZSkuZm9ybWF0KFwiTU1NTSBEbyBZWVlZLCBoOm1tOnNzIGFcIik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUucm93Q2xhc3MgPSBmdW5jdGlvbih1c2VyKSB7XHJcbiAgICAgIGlmICh1c2VyLmFkbWluKSB7XHJcbiAgICAgICAgcmV0dXJuIFwiYWRtaW5cIjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodXNlci5zdGF0dXMuY29uZmlybWVkKSB7XHJcbiAgICAgICAgcmV0dXJuIFwicG9zaXRpdmVcIjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodXNlci5zdGF0dXMuYWRtaXR0ZWQgJiYgIXVzZXIuc3RhdHVzLmNvbmZpcm1lZCkge1xyXG4gICAgICAgIHJldHVybiBcIndhcm5pbmdcIjtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBzZWxlY3RVc2VyKHVzZXIpIHtcclxuICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlciA9IHVzZXI7XHJcbiAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIuc2VjdGlvbnMgPSBnZW5lcmF0ZVNlY3Rpb25zKHVzZXIpO1xyXG4gICAgICAkKFwiLmxvbmcudXNlci5tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogXCJCYXNpYyBJbmZvXCIsXHJcbiAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiQ3JlYXRlZCBPblwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIudGltZXN0YW1wKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJMYXN0IFVwZGF0ZWRcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLmxhc3RVcGRhdGVkKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJDb25maXJtIEJ5XCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY29uZmlybUJ5KSB8fCBcIk4vQVwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkNoZWNrZWQgSW5cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLnN0YXR1cy5jaGVja0luVGltZSkgfHwgXCJOL0FcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJFbWFpbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmVtYWlsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6IFwiUHJvZmlsZVwiLFxyXG4gICAgICAgICAgZmllbGRzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIk5hbWVcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLm5hbWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiR2VuZGVyXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5nZW5kZXJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiU2Nob29sXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5zY2hvb2xcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiR3JhZHVhdGlvbiBZZWFyXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5ncmFkdWF0aW9uWWVhclxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJIYWNrYXRob25zIHZpc2l0ZWRcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmhvd01hbnlIYWNrYXRob25zXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkRlc2NyaXB0aW9uXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5kZXNjcmlwdGlvblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJFc3NheVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZXNzYXlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiTWFqb3JcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLm1ham9yXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdpdGh1YlwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ2l0aHViXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkZhY2Vib29rXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5mYWNlYm9va1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJMaW5rZWRpblwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUubGlua2VkaW5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogXCJDb25maXJtYXRpb25cIixcclxuICAgICAgICAgIGZpZWxkczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJQaG9uZSBOdW1iZXJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ucGhvbmVOdW1iZXJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiTmVlZHMgSGFyZHdhcmVcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ud2FudHNIYXJkd2FyZSxcclxuICAgICAgICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJIYXJkd2FyZSBSZXF1ZXN0ZWRcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uaGFyZHdhcmVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogXCJUcmF2ZWxcIixcclxuICAgICAgICAgIGZpZWxkczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJBZGRpdGlvbmFsIE5vdGVzXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm5vdGVzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIF07XHJcbiAgICB9XHJcbiAgICAkc2NvcGUuc2VsZWN0VXNlciA9IHNlbGVjdFVzZXI7XHJcbiAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdDb25maXJtYXRpb25DdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJHJvb3RTY29wZScsXHJcbiAgICAnJHN0YXRlJyxcclxuICAgICdjdXJyZW50VXNlcicsXHJcbiAgICAnVXRpbHMnLFxyXG4gICAgJ1VzZXJTZXJ2aWNlJyxcclxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCBjdXJyZW50VXNlciwgVXRpbHMsIFVzZXJTZXJ2aWNlKXtcclxuXHJcbiAgICAgIC8vIFNldCB1cCB0aGUgdXNlclxyXG4gICAgICB2YXIgdXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XHJcbiAgICAgICRzY29wZS51c2VyID0gdXNlcjtcclxuXHJcbiAgICAgICRzY29wZS5wYXN0Q29uZmlybWF0aW9uID0gRGF0ZS5ub3coKSA+IHVzZXIuc3RhdHVzLmNvbmZpcm1CeTtcclxuXHJcbiAgICAgICRzY29wZS5mb3JtYXRUaW1lID0gVXRpbHMuZm9ybWF0VGltZTtcclxuXHJcbiAgICAgIF9zZXR1cEZvcm0oKTtcclxuXHJcbiAgICAgICRzY29wZS5maWxlTmFtZSA9IHVzZXIuX2lkICsgXCJfXCIgKyB1c2VyLnByb2ZpbGUubmFtZS5zcGxpdChcIiBcIikuam9pbihcIl9cIik7XHJcblxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIC8vIEFsbCB0aGlzIGp1c3QgZm9yIGRpZXRhcnkgcmVzdHJpY3Rpb24gY2hlY2tib3hlcyBmbWxcclxuXHJcbiAgICAgIHZhciBkaWV0YXJ5UmVzdHJpY3Rpb25zID0ge1xyXG4gICAgICAgICdWZWdldGFyaWFuJzogZmFsc2UsXHJcbiAgICAgICAgJ1ZlZ2FuJzogZmFsc2UsXHJcbiAgICAgICAgJ0hhbGFsJzogZmFsc2UsXHJcbiAgICAgICAgJ0tvc2hlcic6IGZhbHNlLFxyXG4gICAgICAgICdOdXQgQWxsZXJneSc6IGZhbHNlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAodXNlci5jb25maXJtYXRpb24uZGlldGFyeVJlc3RyaWN0aW9ucyl7XHJcbiAgICAgICAgdXNlci5jb25maXJtYXRpb24uZGlldGFyeVJlc3RyaWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3RyaWN0aW9uKXtcclxuICAgICAgICAgIGlmIChyZXN0cmljdGlvbiBpbiBkaWV0YXJ5UmVzdHJpY3Rpb25zKXtcclxuICAgICAgICAgICAgZGlldGFyeVJlc3RyaWN0aW9uc1tyZXN0cmljdGlvbl0gPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUuZGlldGFyeVJlc3RyaWN0aW9ucyA9IGRpZXRhcnlSZXN0cmljdGlvbnM7XHJcblxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICBmdW5jdGlvbiBfdXBkYXRlVXNlcihlKXtcclxuICAgICAgICB2YXIgY29uZmlybWF0aW9uID0gJHNjb3BlLnVzZXIuY29uZmlybWF0aW9uO1xyXG4gICAgICAgIC8vIEdldCB0aGUgZGlldGFyeSByZXN0cmljdGlvbnMgYXMgYW4gYXJyYXlcclxuICAgICAgICB2YXIgZHJzID0gW107XHJcbiAgICAgICAgT2JqZWN0LmtleXMoJHNjb3BlLmRpZXRhcnlSZXN0cmljdGlvbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5KXtcclxuICAgICAgICAgIGlmICgkc2NvcGUuZGlldGFyeVJlc3RyaWN0aW9uc1trZXldKXtcclxuICAgICAgICAgICAgZHJzLnB1c2goa2V5KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25maXJtYXRpb24uZGlldGFyeVJlc3RyaWN0aW9ucyA9IGRycztcclxuXHJcbiAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVDb25maXJtYXRpb24odXNlci5faWQsIGNvbmZpcm1hdGlvbilcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIldvbyFcIiwgXCJZb3UncmUgY29uZmlybWVkIVwiLCBcInN1Y2Nlc3NcIikudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLmRhc2hib2FyZFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJVaCBvaCFcIiwgXCJTb21ldGhpbmcgd2VudCB3cm9uZy5cIiwgXCJlcnJvclwiKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBfc2V0dXBGb3JtKCl7XHJcbiAgICAgICAgLy8gU2VtYW50aWMtVUkgZm9ybSB2YWxpZGF0aW9uXHJcbiAgICAgICAgJCgnLnVpLmZvcm0nKS5mb3JtKHtcclxuICAgICAgICAgIGZpZWxkczoge1xyXG4gICAgICAgICAgICBzaGlydDoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzaGlydCcsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGdpdmUgdXMgYSBzaGlydCBzaXplISdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBob25lOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3Bob25lJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgYSBwaG9uZSBudW1iZXIuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2lnbmF0dXJlQ29kZU9mQ29uZHVjdDoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzaWduYXR1cmVDb2RlT2ZDb25kdWN0JyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgdHlwZSB5b3VyIGRpZ2l0YWwgc2lnbmF0dXJlLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5hdGlvbmFsQ2FyZElEOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ25hdGlvbmFsQ2FyZElEJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgdHlwZSB5b3VyIE5hdGlvbmFsIENhcmQgSUQuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLnN1Ym1pdEZvcm0gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmICgkKCcudWkuZm9ybScpLmZvcm0oJ2lzIHZhbGlkJykpe1xyXG4gICAgICAgICAgX3VwZGF0ZVVzZXIoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3dhbChcIlVoIG9oIVwiLCBcIlBsZWFzZSBGaWxsIFRoZSBSZXF1aXJlZCBGaWVsZHNcIiwgXCJlcnJvclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignRGFzaGJvYXJkQ3RybCcsIFtcclxuICAgICckcm9vdFNjb3BlJyxcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRzY2UnLFxyXG4gICAgJ2N1cnJlbnRVc2VyJyxcclxuICAgICdzZXR0aW5ncycsXHJcbiAgICAnVXRpbHMnLFxyXG4gICAgJ0F1dGhTZXJ2aWNlJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICAnRVZFTlRfSU5GTycsXHJcbiAgICAnREFTSEJPQVJEJyxcclxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwgJHNjZSwgY3VycmVudFVzZXIsIHNldHRpbmdzLCBVdGlscywgQXV0aFNlcnZpY2UsIFVzZXJTZXJ2aWNlLCBFVkVOVF9JTkZPLCBEQVNIQk9BUkQpe1xyXG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xyXG4gICAgICB2YXIgdXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XHJcbiAgICAgICRzY29wZS51c2VyID0gdXNlcjtcclxuICAgICAgJHNjb3BlLnRpbWVDbG9zZSA9IFV0aWxzLmZvcm1hdFRpbWUoU2V0dGluZ3MudGltZUNsb3NlKTtcclxuICAgICAgJHNjb3BlLnRpbWVDb25maXJtID0gVXRpbHMuZm9ybWF0VGltZShTZXR0aW5ncy50aW1lQ29uZmlybSk7XHJcblxyXG4gICAgICAkc2NvcGUuREFTSEJPQVJEID0gREFTSEJPQVJEO1xyXG5cclxuICAgICAgZm9yICh2YXIgbXNnIGluICRzY29wZS5EQVNIQk9BUkQpIHtcclxuICAgICAgICBpZiAoJHNjb3BlLkRBU0hCT0FSRFttc2ddLmluY2x1ZGVzKCdbQVBQX0RFQURMSU5FXScpKSB7XHJcbiAgICAgICAgICAkc2NvcGUuREFTSEJPQVJEW21zZ10gPSAkc2NvcGUuREFTSEJPQVJEW21zZ10ucmVwbGFjZSgnW0FQUF9ERUFETElORV0nLCBVdGlscy5mb3JtYXRUaW1lKFNldHRpbmdzLnRpbWVDbG9zZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJHNjb3BlLkRBU0hCT0FSRFttc2ddLmluY2x1ZGVzKCdbQ09ORklSTV9ERUFETElORV0nKSkge1xyXG4gICAgICAgICAgJHNjb3BlLkRBU0hCT0FSRFttc2ddID0gJHNjb3BlLkRBU0hCT0FSRFttc2ddLnJlcGxhY2UoJ1tDT05GSVJNX0RFQURMSU5FXScsIFV0aWxzLmZvcm1hdFRpbWUodXNlci5zdGF0dXMuY29uZmlybUJ5KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBJcyByZWdpc3RyYXRpb24gb3Blbj9cclxuICAgICAgdmFyIHJlZ0lzT3BlbiA9ICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xyXG5cclxuICAgICAgLy8gSXMgaXQgcGFzdCB0aGUgdXNlcidzIGNvbmZpcm1hdGlvbiB0aW1lP1xyXG4gICAgICB2YXIgcGFzdENvbmZpcm1hdGlvbiA9ICRzY29wZS5wYXN0Q29uZmlybWF0aW9uID0gVXRpbHMuaXNBZnRlcih1c2VyLnN0YXR1cy5jb25maXJtQnkpO1xyXG5cclxuICAgICAgJHNjb3BlLmRhc2hTdGF0ZSA9IGZ1bmN0aW9uKHN0YXR1cyl7XHJcbiAgICAgICAgdmFyIHVzZXIgPSAkc2NvcGUudXNlcjtcclxuICAgICAgICBzd2l0Y2ggKHN0YXR1cykge1xyXG4gICAgICAgICAgY2FzZSAndW52ZXJpZmllZCc6XHJcbiAgICAgICAgICAgIHJldHVybiAhdXNlci52ZXJpZmllZDtcclxuICAgICAgICAgIGNhc2UgJ29wZW5BbmRJbmNvbXBsZXRlJzpcclxuICAgICAgICAgICAgcmV0dXJuIHJlZ0lzT3BlbiAmJiB1c2VyLnZlcmlmaWVkICYmICF1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlO1xyXG4gICAgICAgICAgY2FzZSAnb3BlbkFuZFN1Ym1pdHRlZCc6XHJcbiAgICAgICAgICAgIHJldHVybiByZWdJc09wZW4gJiYgdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSAmJiAhdXNlci5zdGF0dXMuYWRtaXR0ZWQ7XHJcbiAgICAgICAgICBjYXNlICdjbG9zZWRBbmRJbmNvbXBsZXRlJzpcclxuICAgICAgICAgICAgcmV0dXJuICFyZWdJc09wZW4gJiYgIXVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xyXG4gICAgICAgICAgY2FzZSAnY2xvc2VkQW5kU3VibWl0dGVkJzogLy8gV2FpdGxpc3RlZCBTdGF0ZVxyXG4gICAgICAgICAgICByZXR1cm4gIXJlZ0lzT3BlbiAmJiB1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcclxuICAgICAgICAgIGNhc2UgJ2FkbWl0dGVkQW5kQ2FuQ29uZmlybSc6XHJcbiAgICAgICAgICAgIHJldHVybiAhcGFzdENvbmZpcm1hdGlvbiAmJlxyXG4gICAgICAgICAgICAgIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmXHJcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmNvbmZpcm1lZCAmJlxyXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5kZWNsaW5lZDtcclxuICAgICAgICAgIGNhc2UgJ2FkbWl0dGVkQW5kQ2Fubm90Q29uZmlybSc6XHJcbiAgICAgICAgICAgIHJldHVybiBwYXN0Q29uZmlybWF0aW9uICYmXHJcbiAgICAgICAgICAgICAgdXNlci5zdGF0dXMuYWRtaXR0ZWQgJiZcclxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuY29uZmlybWVkICYmXHJcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmRlY2xpbmVkO1xyXG4gICAgICAgICAgY2FzZSAnY29uZmlybWVkJzpcclxuICAgICAgICAgICAgcmV0dXJuIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmIHVzZXIuc3RhdHVzLmNvbmZpcm1lZCAmJiAhdXNlci5zdGF0dXMuZGVjbGluZWQ7XHJcbiAgICAgICAgICBjYXNlICdkZWNsaW5lZCc6XHJcbiAgICAgICAgICAgIHJldHVybiB1c2VyLnN0YXR1cy5kZWNsaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnNob3dXYWl0bGlzdCA9ICFyZWdJc09wZW4gJiYgdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSAmJiAhdXNlci5zdGF0dXMuYWRtaXR0ZWQ7XHJcblxyXG4gICAgICAkc2NvcGUucmVzZW5kRW1haWwgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlXHJcbiAgICAgICAgICAucmVzZW5kVmVyaWZpY2F0aW9uRW1haWwoKVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFwiQ2hlY2sgeW91ciBJbmJveCFcIiwgXCJZb3VyIGVtYWlsIGhhcyBiZWVuIHNlbnQuXCIsIFwic3VjY2Vzc1wiKTsgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyAkc2NvcGUucHJpbnRDb25maXJtYXRpb24gPWZ1bmN0aW9uKEltYWdlVVJMKXtcclxuXHJcbiAgICAgIC8vICAgaHRtbDJjYW52YXMoJCgnI3FyQ29kZScpLCB7XHJcbiAgICAgIC8vICAgICBhbGxvd1RhaW50OiB0cnVlLFxyXG4gICAgICAvLyAgICAgb25yZW5kZXJlZDogZnVuY3Rpb24gKGNhbnZhcykge1xyXG4gICAgICAvLyAgICAgICAgIHZhciBpbWdEYXRhID0gY2FudmFzLnRvRGF0YVVSTChcImltYWdlL2pwZWdcIiwgMS4wKTtcclxuICAgICAgLy8gICAgICAgICB2YXIgcGRmID0gbmV3IGpzUERGKCdwJywgJ21tJywgJ2EwJyk7XHJcbiAgXHJcbiAgICAgIC8vICAgICAgICAgcGRmLmFkZEltYWdlKGltZ0RhdGEsICdKUEVHJywgMCwgMCk7XHJcbiAgICAgIC8vICAgICAgICAgcGRmLnNhdmUoXCJDdXJyZW50IERhdGEyLnBkZlwiKVxyXG4gICAgICAvLyAgICAgfVxyXG4gICAgICAvLyB9KTtcclxuICAgICAgXHJcbiAgICAgIC8vIH1cclxuXHJcblxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAvLyBUZXh0IVxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICB2YXIgY29udmVydGVyID0gbmV3IHNob3dkb3duLkNvbnZlcnRlcigpO1xyXG4gICAgICAkc2NvcGUuYWNjZXB0YW5jZVRleHQgPSAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbChTZXR0aW5ncy5hY2NlcHRhbmNlVGV4dCkpO1xyXG4gICAgICAkc2NvcGUuY29uZmlybWF0aW9uVGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLmNvbmZpcm1hdGlvblRleHQpKTtcclxuICAgICAgJHNjb3BlLndhaXRsaXN0VGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLndhaXRsaXN0VGV4dCkpO1xyXG5cclxuICAgICAgJHNjb3BlLmRlY2xpbmVBZG1pc3Npb24gPSBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSFcIixcclxuICAgICAgICB0ZXh0OiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd291bGQgbGlrZSB0byBkZWNsaW5lIHlvdXIgYWRtaXNzaW9uPyBcXG5cXG4gWW91IGNhbid0IGdvIGJhY2shXCIsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY29uZmlybToge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgSSBjYW4ndCBtYWtlIGl0XCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgLmRlY2xpbmVBZG1pc3Npb24odXNlci5faWQpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG4gIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgW1xyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJGh0dHAnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnc2V0dGluZ3MnLFxyXG4gICAgJ1V0aWxzJyxcclxuICAgICdBdXRoU2VydmljZScsXHJcbiAgICAnRVZFTlRfSU5GTycsXHJcbiAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkc3RhdGUsIHNldHRpbmdzLCBVdGlscywgQXV0aFNlcnZpY2UsIEVWRU5UX0lORk8pe1xyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAkc2NvcGUuRVZFTlRfSU5GTyA9IEVWRU5UX0lORk87XHJcblxyXG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xyXG4gICAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcclxuXHJcblxyXG4gICAgICAvLyBJcyByZWdpc3RyYXRpb24gb3Blbj9cclxuICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcclxuICAgICAgJHNjb3BlLnJlZ0lzT3BlbiA9IFV0aWxzLmlzUmVnT3BlbihTZXR0aW5ncyk7XHJcblxyXG4gICAgICAvLyBTdGFydCBzdGF0ZSBmb3IgbG9naW5cclxuICAgICAgJHNjb3BlLmxvZ2luU3RhdGUgPSAnbG9naW4nO1xyXG5cclxuICAgICAgZnVuY3Rpb24gb25TdWNjZXNzKCkge1xyXG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBvbkVycm9yKGRhdGEpe1xyXG4gICAgICAgICRzY29wZS5lcnJvciA9IGRhdGEubWVzc2FnZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gcmVzZXRFcnJvcigpe1xyXG4gICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmVzZXRFcnJvcigpO1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luV2l0aFBhc3N3b3JkKFxyXG4gICAgICAgICAgJHNjb3BlLmVtYWlsLCAkc2NvcGUucGFzc3dvcmQsIG9uU3VjY2Vzcywgb25FcnJvcik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUucmVnaXN0ZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJlc2V0RXJyb3IoKTtcclxuICAgICAgICBBdXRoU2VydmljZS5yZWdpc3RlcihcclxuICAgICAgICAgICRzY29wZS5lbWFpbCwgJHNjb3BlLnBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnNldExvZ2luU3RhdGUgPSBmdW5jdGlvbihzdGF0ZSkge1xyXG4gICAgICAgICRzY29wZS5sb2dpblN0YXRlID0gc3RhdGU7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuc2VuZFJlc2V0RW1haWwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZW1haWwgPSAkc2NvcGUuZW1haWw7XHJcbiAgICAgICAgQXV0aFNlcnZpY2Uuc2VuZFJlc2V0RW1haWwoZW1haWwpO1xyXG4gICAgICAgIHN3YWwoXCJEb24ndCBzd2VhdCFcIiwgXCJBbiBlbWFpbCBzaG91bGQgYmUgc2VudCB0byB5b3Ugc2hvcnRseS5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICB9O1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICckaHR0cCcsXHJcbiAgICAnJHN0YXRlJyxcclxuICAgICdzZXR0aW5ncycsXHJcbiAgICAnVXRpbHMnLFxyXG4gICAgJ0F1dGhTZXJ2aWNlJyxcclxuICAgICdFVkVOVF9JTkZPJyxcclxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRzdGF0ZSwgc2V0dGluZ3MsIFV0aWxzLCBBdXRoU2VydmljZSwgRVZFTlRfSU5GTyl7XHJcblxyXG4gICAgICAkc2NvcGUuRVZFTlRfSU5GTyA9IEVWRU5UX0lORk87XHJcblxyXG4gICAgICAvLyBJcyByZWdpc3RyYXRpb24gb3Blbj9cclxuICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcclxuICAgICAgJHNjb3BlLnJlZ0lzT3BlbiA9IFV0aWxzLmlzUmVnT3BlbihTZXR0aW5ncyk7XHJcblxyXG4gICAgICAvLyBTdGFydCBzdGF0ZSBmb3IgbG9naW5cclxuICAgICAgJHNjb3BlLmxvZ2luU3RhdGUgPSAnbG9naW4nO1xyXG5cclxuICAgICAgZnVuY3Rpb24gb25TdWNjZXNzKCkge1xyXG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBvbkVycm9yKGRhdGEpe1xyXG4gICAgICAgICRzY29wZS5lcnJvciA9IGRhdGEubWVzc2FnZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gcmVzZXRFcnJvcigpe1xyXG4gICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmVzZXRFcnJvcigpO1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luV2l0aFBhc3N3b3JkKFxyXG4gICAgICAgICAgJHNjb3BlLmVtYWlsLCAkc2NvcGUucGFzc3dvcmQsIG9uU3VjY2Vzcywgb25FcnJvcik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUucmVnaXN0ZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJlc2V0RXJyb3IoKTtcclxuICAgICAgICBBdXRoU2VydmljZS5yZWdpc3RlcihcclxuICAgICAgICAgICRzY29wZS5lbWFpbCwgJHNjb3BlLnBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnNldExvZ2luU3RhdGUgPSBmdW5jdGlvbihzdGF0ZSkge1xyXG4gICAgICAgICRzY29wZS5sb2dpblN0YXRlID0gc3RhdGU7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuc2VuZFJlc2V0RW1haWwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZW1haWwgPSAkc2NvcGUuZW1haWw7XHJcbiAgICAgICAgQXV0aFNlcnZpY2Uuc2VuZFJlc2V0RW1haWwoZW1haWwpO1xyXG4gICAgICAgIHN3YWwoXCJEb24ndCBzd2VhdCFcIiwgXCJBbiBlbWFpbCBzaG91bGQgYmUgc2VudCB0byB5b3Ugc2hvcnRseS5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICB9O1xyXG5cclxuICAgIH1cclxuICBdKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ1Jlc2V0Q3RybCcsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRzdGF0ZVBhcmFtcycsXHJcbiAgICAnJHN0YXRlJyxcclxuICAgICdBdXRoU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgJHN0YXRlLCBBdXRoU2VydmljZSl7XHJcbiAgICAgIHZhciB0b2tlbiA9ICRzdGF0ZVBhcmFtcy50b2tlbjtcclxuXHJcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICRzY29wZS5jaGFuZ2VQYXNzd29yZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHBhc3N3b3JkID0gJHNjb3BlLnBhc3N3b3JkO1xyXG4gICAgICAgIHZhciBjb25maXJtID0gJHNjb3BlLmNvbmZpcm07XHJcblxyXG4gICAgICAgIGlmIChwYXNzd29yZCAhPT0gY29uZmlybSl7XHJcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIlBhc3N3b3JkcyBkb24ndCBtYXRjaCFcIjtcclxuICAgICAgICAgICRzY29wZS5jb25maXJtID0gXCJcIjtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEF1dGhTZXJ2aWNlLnJlc2V0UGFzc3dvcmQoXHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgICRzY29wZS5wYXNzd29yZCxcclxuICAgICAgICAgIG1lc3NhZ2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFwiTmVhdG8hXCIsIFwiWW91ciBwYXNzd29yZCBoYXMgYmVlbiBjaGFuZ2VkIVwiLCBcInN1Y2Nlc3NcIikudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiaG9tZVwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IGRhdGEubWVzc2FnZTtcclxuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLnNlcnZpY2UoJ3NldHRpbmdzJywgZnVuY3Rpb24oKSB7fSlcclxuICAuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBbXHJcbiAgICAnJHJvb3RTY29wZScsXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICdTZXR0aW5nc1NlcnZpY2UnLFxyXG4gICAgJ1V0aWxzJyxcclxuICAgICdBdXRoU2VydmljZScsXHJcbiAgICAnU2Vzc2lvbicsXHJcbiAgICAnRVZFTlRfSU5GTycsXHJcbiAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsIFNldHRpbmdzU2VydmljZSwgVXRpbHMsIEF1dGhTZXJ2aWNlLCBTZXNzaW9uLCBFVkVOVF9JTkZPKXtcclxuXHJcbiAgICAgIHZhciB1c2VyID0gJHJvb3RTY29wZS5jdXJyZW50VXNlcjtcclxuXHJcbiAgICAgICRzY29wZS5FVkVOVF9JTkZPID0gRVZFTlRfSU5GTztcclxuXHJcbiAgICAgICRzY29wZS5wYXN0Q29uZmlybWF0aW9uID0gVXRpbHMuaXNBZnRlcih1c2VyLnN0YXR1cy5jb25maXJtQnkpO1xyXG4gICAgICAvLyRzY29wZS5wYXN0U2F0YXJ0ID0gVXRpbHMuaXNBZnRlcihzZXR0aW5ncy50aW1lU3RhcnQpO1xyXG5cclxuICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgIC5nZXRQdWJsaWNTZXR0aW5ncygpXHJcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAkc2NvcGUucGFzdFNhdGFydCA9IFV0aWxzLmlzQWZ0ZXIocmVzcG9uc2UuZGF0YS50aW1lU3RhcnQpXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuc2hvd1NpZGViYXIgPSBmYWxzZTtcclxuICAgICAgJHNjb3BlLnRvZ2dsZVNpZGViYXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICRzY29wZS5zaG93U2lkZWJhciA9ICEkc2NvcGUuc2hvd1NpZGViYXI7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBvaCBnb2QgalF1ZXJ5IGhhY2tcclxuICAgICAgJCgnLml0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICRzY29wZS5zaG93U2lkZWJhciA9IGZhbHNlO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB9XSk7XHJcbiIsIlxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ1RlYW1DdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJHN0YXRlJyxcclxuICAgICckdGltZW91dCcsXHJcbiAgICAnY3VycmVudFVzZXInLFxyXG4gICAgJ3NldHRpbmdzJyxcclxuICAgICdVdGlscycsXHJcbiAgICAnVXNlclNlcnZpY2UnLFxyXG4gICAgJ1RlYW1TZXJ2aWNlJyxcclxuICAgICdURUFNJyxcclxuICAgIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJHRpbWVvdXQsIGN1cnJlbnRVc2VyLCBzZXR0aW5ncywgVXRpbHMsIFVzZXJTZXJ2aWNlLCBUZWFtU2VydmljZSwgVEVBTSkge1xyXG4gICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgdXNlcidzIG1vc3QgcmVjZW50IGRhdGEuXHJcbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XHJcblxyXG4gICAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcclxuXHJcbiAgICAgICRzY29wZS51c2VyID0gY3VycmVudFVzZXIuZGF0YTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGlzVGVhbU1lbWJlcih0ZWFtcywgVXNlcmlkKSB7XHJcbiAgICAgICAgdmFyIHRlc3QgPSBmYWxzZTtcclxuICAgICAgICB0ZWFtcy5mb3JFYWNoKHRlYW0gPT4ge1xyXG4gICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcclxuICAgICAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBVc2VyaWQpIHRlc3QgPSB0cnVlO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRlc3Q7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHNlbGVjdE1lbWJlcihtZW1iZXJJZCkge1xyXG4gICAgICAgIFVzZXJTZXJ2aWNlLmdldChtZW1iZXJJZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICB1c2VyID0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlciA9IHVzZXI7XHJcbiAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZyh1c2VyKTtcclxuICAgICAgICAkKFwiLmxvbmcudXNlci5tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlU2VjdGlvbnModXNlcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiUHJvZmlsZVwiLFxyXG4gICAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkdlbmRlclwiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5nZW5kZXJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwiU2Nob29sXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLnNjaG9vbFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJHaXRodWJcIixcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ2l0aHViXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkxpbmtlZGluXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmxpbmtlZGluXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBmb3JtYXRUaW1lKHRpbWUpIHtcclxuICAgICAgICBpZiAodGltZSkge1xyXG4gICAgICAgICAgcmV0dXJuIG1vbWVudCh0aW1lKS5mb3JtYXQoXCJNTU1NIERvIFlZWVksIGg6bW06c3MgYVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5zZWxlY3RNZW1iZXIgPSBzZWxlY3RNZW1iZXI7XHJcblxyXG5cclxuICAgICAgJHNjb3BlLmlzam9pbmVkID0gZnVuY3Rpb24gKHRlYW0pIHtcclxuICAgICAgICB2YXIgdGVzdCA9IGZhbHNlO1xyXG4gICAgICAgIHRlYW0uam9pblJlcXVlc3RzLmZvckVhY2gobWVtYmVyID0+IHtcclxuICAgICAgICAgIGlmIChtZW1iZXIuaWQgPT0gY3VycmVudFVzZXIuZGF0YS5faWQpIHRlc3QgPSB0cnVlO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHRlc3Q7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIFRlYW1TZXJ2aWNlLmdldEFsbCgpLnRoZW4odGVhbXMgPT4ge1xyXG4gICAgICAgICRzY29wZS5pc1RlYW1BZG1pbiA9IGZhbHNlO1xyXG4gICAgICAgICRzY29wZS5pc1RlYW1NZW1iZXIgPSBmYWxzZTtcclxuICAgICAgICB0ZWFtcy5kYXRhLmZvckVhY2godGVhbSA9PiB7XHJcbiAgICAgICAgICB0ZWFtLmlzTWF4dGVhbSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgIGlmICh0ZWFtLm1lbWJlcnMubGVuZ3RoID49IFNldHRpbmdzLm1heFRlYW1TaXplKSB7XHJcbiAgICAgICAgICAgIHRlYW0uaXNDb2xvc2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGVhbS5pc01heHRlYW0gPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICh0ZWFtLm1lbWJlcnNbMF0uaWQgPT0gY3VycmVudFVzZXIuZGF0YS5faWQpIHtcclxuICAgICAgICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChpc1RlYW1NZW1iZXIodGVhbXMuZGF0YSwgbWVtYmVyLmlkKSkge1xyXG4gICAgICAgICAgICAgICAgbWVtYmVyLnVuYXZhaWxhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICB9IGVsc2UgeyBtZW1iZXIudW5hdmFpbGFibGUgPSBmYWxzZSB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlckFkbWluVGVhbSA9IHRlYW07XHJcbiAgICAgICAgICAgICRzY29wZS5pc1RlYW1BZG1pbiA9IHRydWU7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChtZW1iZXIuaWQgPT0gY3VycmVudFVzZXIuZGF0YS5faWQpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS51c2VyTWVtYmVyVGVhbSA9IHRlYW07XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuaXNUZWFtTWVtYmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAkc2NvcGUudGVhbXMgPSB0ZWFtcy5kYXRhO1xyXG5cclxuICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgJHNjb3BlLmNyZWF0ZVRlYW0gPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHRlYW1EYXRhID0ge1xyXG4gICAgICAgICAgZGVzY3JpcHRpb246ICRzY29wZS5uZXdUZWFtX2Rlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgbWVtYmVyczogW3sgaWQ6IGN1cnJlbnRVc2VyLmRhdGEuX2lkLCBuYW1lOiBjdXJyZW50VXNlci5kYXRhLnByb2ZpbGUubmFtZSwgc2tpbGw6ICRzY29wZS5uZXdUZWFtX0FkbWluc2tpbGwgfV0sXHJcbiAgICAgICAgICBza2lsbHM6IHsgY29kZTogJHNjb3BlLnNraWxsY29kZSwgZGVzaWduOiAkc2NvcGUuc2tpbGxkZXNpZ24sIGhhcmR3YXJlOiAkc2NvcGUuc2tpbGxoYXJkd2FyZSwgaWRlYTogJHNjb3BlLnNraWxsaWRlYSB9LFxyXG4gICAgICAgICAgaXNDb2xvc2VkOiBmYWxzZSxcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2codGVhbURhdGEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5uZXdUZWFtX0FkbWluc2tpbGwpO1xyXG5cclxuICAgICAgICBUZWFtU2VydmljZS5jcmVhdGUodGVhbURhdGEpO1xyXG4gICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgfTtcclxuXHJcblxyXG4gICAgICAkc2NvcGUuU2hvd2NyZWF0ZVRlYW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLlNob3dOZXdUZWFtRnJvbSA9IHRydWU7XHJcbiAgICAgICAgJHNjb3BlLnNraWxsY29kZSA9IHRydWVcclxuICAgICAgICAkc2NvcGUuc2tpbGxkZXNpZ24gPSB0cnVlXHJcbiAgICAgICAgJHNjb3BlLnNraWxsaGFyZHdhcmUgPSB0cnVlXHJcbiAgICAgICAgJHNjb3BlLnNraWxsaWRlYSA9IHRydWVcclxuICAgICAgICAkc2NvcGUubmV3VGVhbV9BZG1pbnNraWxsID0gXCJjb2RlXCJcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgICRzY29wZS5TaG93Sm9pblRlYW0gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICRzY29wZS5TaG93Sm9pblRlYW1Gcm9tID0gdHJ1ZTsgIFxyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgJHNjb3BlLmpvaW5UZWFtQ29kZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdGVhbUlEID0gJHNjb3BlLm5ld1RlYW1fQ29kZTtcclxuICAgICAgICBuZXdUZWFtX3NraWxsPSAkc2NvcGUubmV3VGVhbV9za2lsbDtcclxuXHJcbiAgICAgICAgbmV3dXNlcj0ge2lkOmN1cnJlbnRVc2VyLmRhdGEuX2lkLCBuYW1lOmN1cnJlbnRVc2VyLmRhdGEucHJvZmlsZS5uYW1lLCBza2lsbDpuZXdUZWFtX3NraWxsfTtcclxuICAgICAgICBUZWFtU2VydmljZS5qb2luKHRlYW1JRCxuZXd1c2VyKTsgXHJcbiAgICAgICAgc3dhbChcclxuICAgICAgICAgIFwiSm9pbmVkXCIsXHJcbiAgICAgICAgICBcIllvdSBoYXZlIGFwcGxpY2VkIHRvIGpvaW4gdGhpcyB0ZWFtLCB3YWl0IGZvciB0aGUgVGVhbS1BZG1pbiB0byBhY2NlcHQgeW91ciBhcHBsaWNhdGlvbi5cIixcclxuICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgKTsgIFxyXG4gICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICRzY29wZS5qb2luVGVhbSA9IGZ1bmN0aW9uICh0ZWFtKSB7XHJcblxyXG4gICAgICAgIHZhciB2YWx1ZTtcclxuICAgICAgICBjb25zdCBzZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcclxuICAgICAgICBzZWxlY3QuY2xhc3NOYW1lID0gJ3NlbGVjdC1jdXN0b20nXHJcblxyXG5cclxuICAgICAgICB2YXIgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgb3B0aW9uLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gJ1NlbGVjdCBhIHNraWxsJztcclxuICAgICAgICBvcHRpb24udmFsdWUgPSBcImNvZGVcIlxyXG4gICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKHRlYW0uc2tpbGxzLmNvZGUpIHtcclxuICAgICAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9ICdDb2RlJztcclxuICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IFwiY29kZVwiXHJcbiAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRlYW0uc2tpbGxzLmRlc2lnbikge1xyXG4gICAgICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gJ0Rlc2lnbic7XHJcbiAgICAgICAgICBvcHRpb24udmFsdWUgPSBcImRlc2lnblwiXHJcbiAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRlYW0uc2tpbGxzLmhhcmR3YXJlKSB7XHJcbiAgICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnSGFyZHdhcmUnO1xyXG4gICAgICAgICAgb3B0aW9uLnZhbHVlID0gXCJoYXJkd2FyZVwiXHJcbiAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRlYW0uc2tpbGxzLmlkZWEpIHtcclxuICAgICAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9ICdJZGVhJztcclxuICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IFwiaWRlYVwiXHJcbiAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGVjdC5vbmNoYW5nZSA9IGZ1bmN0aW9uIHNlbGVjdENoYW5nZWQoZSkge1xyXG4gICAgICAgICAgdmFsdWUgPSBlLnRhcmdldC52YWx1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJQbGVhc2Ugc2VsZWN0IHlvdXIgc2tpbGwgdG8gam9pblwiLFxyXG5cclxuICAgICAgICAgIGNvbnRlbnQ6IHtcclxuICAgICAgICAgICAgZWxlbWVudDogc2VsZWN0LFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgIG5ld3VzZXIgPSB7IGlkOiBjdXJyZW50VXNlci5kYXRhLl9pZCwgbmFtZTogY3VycmVudFVzZXIuZGF0YS5wcm9maWxlLm5hbWUsIHNraWxsOiB2YWx1ZSB9O1xyXG4gICAgICAgICAgVGVhbVNlcnZpY2Uuam9pbih0ZWFtLl9pZCwgbmV3dXNlcik7XHJcbiAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICBcIkpvaW5lZFwiLFxyXG4gICAgICAgICAgICBcIllvdSBoYXZlIGFwcGxpY2VkIHRvIGpvaW4gdGhpcyB0ZWFtLCB3YWl0IGZvciB0aGUgVGVhbS1BZG1pbiB0byBhY2NlcHQgeW91ciBhcHBsaWNhdGlvbi5cIixcclxuICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgICRzY29wZS5hY2NlcHRNZW1iZXIgPSBmdW5jdGlvbiAodGVhbUlELCBtZW1iZXIsIGluZGV4KSB7XHJcblxyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBhY2NlcHQgXCIgKyBtZW1iZXIubmFtZSArIFwiIHRvIHlvdXIgdGVhbSEgVGhpcyB3aWxsIHNlbmQgaGltIGEgbm90aWZpY2F0aW9uIGVtYWlsIGFuZCB3aWxsIHNob3cgaW4gdGhlIHB1YmxpYyB0ZWFtcyBwYWdlLlwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgbGV0IGhpbSBpblwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBUZWFtU2VydmljZS5hY2NlcHRNZW1iZXIodGVhbUlELCBtZW1iZXIsIFNldHRpbmdzLm1heFRlYW1TaXplKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09IFwibWF4VGVhbVNpemVcIikge1xyXG4gICAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgICBcIkVycm9yXCIsXHJcbiAgICAgICAgICAgICAgICBcIk1heGltdW0gbnVtYmVyIG9mIG1lbWJlcnMgKFwiICsgU2V0dGluZ3MubWF4VGVhbVNpemUgKyBcIikgcmVhY2hlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW1JRCwgaW5kZXgsIGZhbHNlKS50aGVuKHJlc3BvbnNlMiA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgICBcIkFjY2VwdGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgIG1lbWJlci5uYW1lICsgXCIgaGFzIGJlZW4gYWNjZXB0ZWQgdG8geW91ciB0ZWFtLlwiLFxyXG4gICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgJHNjb3BlLnJlZnVzZU1lbWJlciA9IGZ1bmN0aW9uICh0ZWFtSUQsIG1lbWJlciwgaW5kZXgpIHtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVmdXNlIFwiICsgbWVtYmVyLm5hbWUgKyBcIiBmcm9tIHlvdXIgdGVhbSEgVGhpcyB3aWxsIHNlbmQgaGltIGEgbm90aWZpY2F0aW9uIGVtYWlsLlwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVmdXNlIGhpbVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW1JRCwgaW5kZXgsIG1lbWJlcikudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJSZWZ1c2VkXCIsXHJcbiAgICAgICAgICAgICAgbWVtYmVyLm5hbWUgKyBcIiBoYXMgYmVlbiByZWZ1c2VkIGZyb20geW91ciB0ZWFtLlwiLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgJHNjb3BlLnJlbW92ZU1lbWJlcmZyb21UZWFtID0gZnVuY3Rpb24gKHRlYW1JRCwgbWVtYmVyLCBpbmRleCkge1xyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byByZW1vdmUgXCIgKyBtZW1iZXIubmFtZSArIFwiIGZyb20geW91ciB0ZWFtISBUaGlzIHdpbGwgc2VuZCBoaW0gYSBub3RpZmljYXRpb24gZW1haWwuXCIsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgaGltXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZW1lbWJlcih0ZWFtSUQsIGluZGV4LCBtZW1iZXIuaWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UgPT0gXCJyZW1vdmluZ0FkbWluXCIpIHtcclxuICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgXCJFcnJvclwiLFxyXG4gICAgICAgICAgICAgICAgXCJZb3UgY2FuJ3QgcmVtb3ZlIHRoZSBUZWFtIEFkbWluLCBCdXQgeW91IGNhbiBjbG9zZSB0aGUgdGVhbS5cIixcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIlxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3Zlam9pbih0ZWFtSUQsIGluZGV4LCBmYWxzZSkudGhlbihyZXNwb25zZTIgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXHJcbiAgICAgICAgICAgICAgICAgIG1lbWJlci5uYW1lICsgXCIgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHlvdXIgdGVhbS5cIixcclxuICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICRzY29wZS5yZW1vdmVUZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVtb3ZlIHRoaXMgdGVhbSB3aXRoIGFsbCBpdCdzIG1lbWJlcnMhIFRoaXMgd2lsbCBzZW5kIHRoZW0gYSBub3RpZmljYXRpb24gZW1haWwuIFlvdSBuZWVkIHRvIGZpbmQgYW5vdGhlciB0ZWFtIHRvIHdvcmsgd2l0aC5cIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSB0ZWFtXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBlbWFpbCA9IHtcclxuICAgICAgICAgICAgc3ViamVjdDogXCJZb3VyIHRlYW0gaGFzIGJlZW4gcmVtb3ZlZFwiLFxyXG4gICAgICAgICAgICB0aXRsZTogXCJUaW1lIGZvciBhIGJhY2t1cCBwbGFuXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IFwiVGhlIHRlYW0geW91IGhhdmUgYmVlbiBwYXJ0IChNZW1iZXIvcmVxdWVzdGVkIHRvIGpvaW4pIG9mIGhhcyBiZWVuIHJlbW92ZWQuIFBsZWFzZSBjaGVjayB5b3VyIGRhc2hib2FyZCBhbmQgdHJ5IHRvIGZpbmQgYW5vdGhlciB0ZWFtIHRvIHdvcmsgd2l0aCBiZWZvcmUgdGhlIGhhY2thdGhvbiBzdGFydHMuXCJcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmUodGVhbS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaCh1c2VyID0+IHtcclxuICAgICAgICAgICAgICBVc2VyU2VydmljZS5zZW5kQmFzaWNNYWlsKHVzZXIuaWQsIGVtYWlsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRlYW0uam9pblJlcXVlc3RzLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgICAgICAgVXNlclNlcnZpY2Uuc2VuZEJhc2ljTWFpbCh1c2VyLmlkLCBlbWFpbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIlJlbW92ZWRcIixcclxuICAgICAgICAgICAgICBcIlRlYW0gaGFzIGJlZW4gcmVtb3ZlZC5cIixcclxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgICRzY29wZS5sZWF2ZVRlYW0gPSBmdW5jdGlvbiAodGVhbSkge1xyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBsZWF2ZSB5b3VyIHRlYW0hIFRoaXMgd2lsbCBzZW5kIHRoZSBhZG1pbiBhIG5vdGlmaWNhdGlvbiBlbWFpbC5cIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSBoaW1cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICAgIHRlYW0ubWVtYmVycy5mb3JFYWNoKG1lbWJlciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChtZW1iZXIuaWQgPT0gY3VycmVudFVzZXIuZGF0YS5faWQpIHtcclxuICAgICAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVtZW1iZXIodGVhbS5faWQsIGluZGV4KS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxyXG4gICAgICAgICAgICAgICAgICBcIllvdSBoYXZlIHN1Y2Nlc3NmdWxseSBsZWZ0IHRoaXMgdGVhbS4gUGxlYXNlIGZpbmQgYW5vdGhlciB0ZWFtIG9yIGNyZWF0ZSB5b3VyIG93bi5cIixcclxuICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgJHNjb3BlLmNhbmNlbGpvaW5UZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gY2FuY2VsIHlvdXIgcmVxdWVzdCB0byBqb2luIHRoaXMgdGVhbSFcIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIk5vXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHZhciBpbmRleCA9IDA7XHJcblxyXG4gICAgICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWVtYmVyLmlkID09IGN1cnJlbnRVc2VyLmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3Zlam9pbih0ZWFtLl9pZCwgaW5kZXgsIGZhbHNlKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxyXG4gICAgICAgICAgICAgICAgICBcIllvdSBoYXZlIHN1Y2Nlc3NmdWxseSBjYW5jZWxlZCB5b3UgcmVxdWVzdCB0byBqb2luIHRoaXMgdGVhbS4gUGxlYXNlIGZpbmQgYW5vdGhlciB0ZWFtIG9yIGNyZWF0ZSB5b3VyIG93bi5cIixcclxuICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgJHNjb3BlLnRvZ2dsZUNsb3NlVGVhbSA9IGZ1bmN0aW9uICh0ZWFtSUQsIHN0YXR1cykge1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgdGV4dCA9IFwiWW91IGFyZSBhYm91dCB0byBDbG9zZSB0aGlzIHRlYW0uIFRoaXMgd29uJ3QgYWxsb3cgb3RoZXIgbWVtYmVycyB0byBqb2luIHlvdXIgdGVhbSFcIlxyXG4gICAgICAgIH0gZWxzZSB7IHRleHQgPSBcIllvdSBhcmUgYWJvdXQgdG8gcmVvcGVuIHRoaXMgdGVhbS4gVGhpcyB3aWxsIGFsbG93IG90aGVyIG1lbWJlcnMgdG8gam9pbiB5b3VyIHRlYW0hXCIgfVxyXG5cclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiTm9cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFRlYW1TZXJ2aWNlLnRvZ2dsZUNsb3NlVGVhbSh0ZWFtSUQsIHN0YXR1cykudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJEb25lXCIsXHJcbiAgICAgICAgICAgICAgXCJPcGVyYXRpb24gc3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIixcclxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAkc2NvcGUudG9nZ2xlSGlkZVRlYW0gPSBmdW5jdGlvbiAodGVhbUlELCBzdGF0dXMpIHtcclxuICAgICAgICBpZiAoc3RhdHVzID09IHRydWUpIHtcclxuICAgICAgICAgIHRleHQgPSBcIllvdSBhcmUgYWJvdXQgdG8gSGlkZSB0aGlzIHRlYW0uIFRoaXMgd29uJ3QgYWxsb3cgb3RoZXIgbWVtYmVycyB0byBzZWUgeW91ciB0ZWFtIVwiXHJcbiAgICAgICAgfSBlbHNlIHsgdGV4dCA9IFwiWW91IGFyZSBhYm91dCB0byBTaG93IHRoaXMgdGVhbS4gVGhpcyB3aWxsIGFsbG93IG90aGVyIG1lbWJlcnMgdG8gc2VlIHlvdXIgdGVhbSFcIiB9XHJcblxyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJOb1wiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXNcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgVGVhbVNlcnZpY2UudG9nZ2xlSGlkZVRlYW0odGVhbUlELCBzdGF0dXMpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgIFwiRG9uZVwiLFxyXG4gICAgICAgICAgICAgIFwiT3BlcmF0aW9uIHN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS4kd2F0Y2goXCJxdWVyeVRleHRcIiwgZnVuY3Rpb24gKHF1ZXJ5VGV4dCkge1xyXG4gICAgICAgIFRlYW1TZXJ2aWNlLmdldFNlbGVjdGVkVGVhbXMocXVlcnlUZXh0LCAkc2NvcGUuc2tpbGxzRmlsdGVycykudGhlbihcclxuICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNjb3BlLnRlYW1zID0gcmVzcG9uc2UuZGF0YS50ZWFtcztcclxuICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRzY29wZS5hcHBseXNraWxsc0ZpbHRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBUZWFtU2VydmljZS5nZXRTZWxlY3RlZFRlYW1zKCRzY29wZS5xdWVyeVRleHQsICRzY29wZS5za2lsbHNGaWx0ZXJzKS50aGVuKFxyXG4gICAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUudGVhbXMgPSByZXNwb25zZS5kYXRhLnRlYW1zO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgIH07XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ1ZlcmlmeUN0cmwnLCBbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICckc3RhdGVQYXJhbXMnLFxyXG4gICAgJ0F1dGhTZXJ2aWNlJyxcclxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBBdXRoU2VydmljZSl7XHJcbiAgICAgIHZhciB0b2tlbiA9ICRzdGF0ZVBhcmFtcy50b2tlbjtcclxuXHJcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLnZlcmlmeSh0b2tlbixcclxuICAgICAgICAgIGZ1bmN0aW9uKHVzZXIpe1xyXG4gICAgICAgICAgICAkc2NvcGUuc3VjY2VzcyA9IHRydWU7XHJcbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZnVuY3Rpb24oZXJyKXtcclxuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XSk7XHJcbiJdfQ==
