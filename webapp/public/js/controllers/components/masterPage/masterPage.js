/**
 * Created by dcoellar on 9/15/15.
 */

(function(){

    //Variables
    var ctlr;
    var local_rootScope;
    var local_window;

    //Constructor
    var init;

    //"Public" Methods
    var local_logout;

    angular.module("easyRuta")
        .controller('MasterPageController',function($rootScope,$window) {

            ctlr = this;
            local_rootScope = $rootScope;
            local_window = $window;

            ctlr.Logout = function() { local_logout(); }

            init()

        });

    //Constructor
    init = function(){}

    //"Public" Methods
    local_logout = function(){
        local_rootScope.loggedInRole = undefined;
        local_rootScope.proveedor = undefined;
        local_rootScope.cliente = undefined;
        Parse.User.logOut();
        local_window.location.href = '/';
    };

})();