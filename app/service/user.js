var app = angular.module('TenFingers');
app.service('user', function ($cookies, $http) {
   var user;
   var id;
   var isUser = false;
   this.reNewUser = function () {
       id = $cookies.get("user");
       if(angular.isUndefined(id)){
           return null;
       }else {
           return $http.get('/person/id/' + id).then(function (res) {

               return res.data;
           });
       }
   };

   this.setUser = function (id, name) {
       user = name;
       this.id = id;
       var date = new Date();
       date.setDate(date.getDate() + 365 * 10);
       $cookies.put('user', id, {expires: date, secure:true});
   };

   this.getUser = function () {
       user = this.reNewUser();

       return user;
   };

   this.isUser = function () {
       this.reNewUser();
       return isUser;
   };
});