angular.module("reg").factory("ChallengeService", [
    "$http",
    "Session",
    function($http, Session) {
      var challenges = "/api/challenges";
      var base = challenges + "/";
  
      return {
        // ----------------------
        // Basic Actions
        // ----------------------

        create: function(cData) {
            return $http.put(challenges + "/create", {
              cData: cData
            });
          },


        update: function(id, cData) {
            return $http.put(base + id + "/update", {
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
    
  
      };
    }
  ]);
  