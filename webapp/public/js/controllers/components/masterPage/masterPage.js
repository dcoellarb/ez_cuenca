/**
 * Created by dcoellar on 9/15/15.
 */

(function(){

    //Variables
    var ctlr;
    var local_rootScope;
    var master_scope;
    var local_window;

    //Constructor
    var init;

    //"Public" Methods
    var local_logout;
    var local_scrollTo;
    var local_toggleLogin;

    angular.module("easyRuta")
        .controller('MasterPageController',function($rootScope,$scope,$window) {

            ctlr = this;
            local_rootScope = $rootScope;
            master_scope = $scope;
            local_window = $window;

            ctlr.toggleLogin = function(show) { local_toggleLogin(show); };
            ctlr.Logout = function() { local_logout(); };
            ctlr.scrollTo = function(id) { local_scrollTo(id); };

            init()

        });

    //Constructor
    init = function(){
        local_toggleLogin(false);
    }

    //"Public" Methods
    local_logout = function(){
        local_rootScope.loggedInRole = undefined;
        local_rootScope.proveedor = undefined;
        local_rootScope.cliente = undefined;
        Parse.User.logOut();
        local_window.location.href = '/';
    };

    local_scrollTo = function(id){
        $('html, body').animate({
            scrollTop: $("#" + id).offset().top
        }, 2000);
    }

    local_toggleLogin = function(show){
        if (show){
            local_scrollTo("content0");
            $("#login").show()
        }else{
            $("#login").hide()
        }
    }
})();