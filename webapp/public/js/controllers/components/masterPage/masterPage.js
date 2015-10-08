/**
 * Created by dcoellar on 9/15/15.
 */

(function(){

    angular.module("easyRuta")
        .controller('MasterPageController',function($window) {

            var ctlr = this

            ctlr.Logout = function(){
                Parse.User.logOut();
                $window.location.href = '/';
            };

        });

})();