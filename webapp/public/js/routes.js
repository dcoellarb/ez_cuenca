/**
 * Created by dcoellar on 9/14/15.
 */

(function(){

    angular.module("easyRuta")
        .config(function($routeProvider){
            $routeProvider
                .when('/register',{
                    templateUrl : '/templates/pages/register/index.html',
                    controller : 'RegisterController',
                    controllerAs : 'registerCtrl'
                })
                .when('/inicioClientes',{
                    templateUrl : '/templates/pages/inicioClientes/index.html'//,
                    //controller : 'RegisterController',
                    //controllerAs : 'registerCtrl'
                })
                .otherwise({
                    templateUrl : '/templates/pages/login/index.html',
                    controller : 'LoginController',
                    controllerAs : 'loginCtrl'
                })
        });

})();