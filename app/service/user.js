var app = angular.module('TenFingers');
app.service('user', function ($cookies) {
   var user = "";
   this.reNewUser = function () {
       user = $cookies.get("user");
   };
   this.getUser = function () {
       this.reNewUser();
       return user;
   }
});