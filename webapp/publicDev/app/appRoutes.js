/**
 * Created by dcoellar on 9/14/15.
 */

angular.module("easyRuta")
    .config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state('public', {
                url: "/home",
                templateUrl: "/app/components/shared/home/homeView.html"
            })
            .state('private', {
                url: "/main",
                templateUrl: "/app/components/shared/master/masterView.html",
            })
            .state('private.proveedorCarga', {
                url: "/proveedorCarga",
                templateUrl: '/app/components/proveedorCarga/pedidos/proveedorCargaPedidosView.html'
            })
            .state('private.transportista', {
                url: "/transportista",
                templateUrl: '/app/components/transportista/pedidos/transportistaPedidosView.html'
            })
            .state('private.proveedorCarga-pedidos', {
                url: "/proveedorCarga/pedidos",
                templateUrl: '/app/components/proveedorCarga/pedidos/proveedorCargaPedidosView.html'
            })
            .state('private.transportista-pedidos', {
                url: "/transportista/pedidos",
                templateUrl: '/app/components/transportista/pedidos/transportistaPedidosView.html'
            })
            .state('private.transportista-flota', {
                url: "/transportista/flota",
                templateUrl: '/app/components/transportista/flota/transportistaFlotaView.html'
            });
    }])
    .run(['$rootScope','dataService','$location','localStorageService','localStorageKeys',function($rootScope, dataService, $location, localStorageService,localStorageKeys){
        var validateRoute = function(){
            if (!dataService.currentUser() && $location.path().indexOf('/main') >= 0) {
                //$location.path('/home');
                //$location.replace();
            } else if (dataService.currentUser()) {
                if (!$rootScope.role){
                    $rootScope.role = JSON.parse(localStorageService.get(localStorageKeys.role));
                    $rootScope.proveedorCarga = JSON.parse(localStorageService.get(localStorageKeys.proveedorCarga));
                    $rootScope.transportista = JSON.parse(localStorageService.get(localStorageKeys.transportista));
                    $rootScope.broker = JSON.parse(localStorageService.get(localStorageKeys.broker));
                    if (!$rootScope.role){
                        $location.path('/home');
                        $location.replace();
                    }
                }
            }
        };
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
            //event.preventDefault();
            validateRoute();
        });
        validateRoute();
    }]);

/*
angular.module("easyRuta")
    .config(['$routeProvider',function($routeProvider){
        $routeProvider
            .when('/proveedorCarga',{
                templateUrl : '/app/components/proveedorCarga/pedidos/proveedorCargaPedidosView.html'
            })
            .when('/transportista',{
                templateUrl : '/app/components/transportista/pedidos/transportistaPedidosView.html'
            })
            .when('/proveedorCarga/pedidos',{
                templateUrl : '/app/components/proveedorCarga/pedidos/proveedorCargaPedidosView.html'
            })
            .when('/transportista/pedidos',{
                templateUrl : '/app/components/transportista/pedidos/transportistaPedidosView.html'
            })
            .when('/transportista/flota',{
                templateUrl : '/app/components/transportista/flota/transportistaFlotaView.html'
            })
            .when('/detallePedido/:id',{
                templateUrl : '/templates/pages/detalle_pedido.html'
            });
    }])
    .run(['$rootScope','dataService','$window','localStorageService','localStorageKeys',function($rootScope,dataService, $window, localStorageService,localStorageKeys){
        var validateRoute = function(){
            var u = dataService.currentUser();
            if (!dataService.currentUser()) {
                console.log("user not login")
                //$window.location.href = "http://easyruta.parseapp.com/modules/login/index.html";
            }else{
                console.log("user login")
                if (!$rootScope.role){
                    $rootScope.role = JSON.parse(localStorageService.get(localStorageKeys.role));
                    $rootScope.proveedorCarga = JSON.parse(localStorageService.get(localStorageKeys.proveedorCarga));
                    $rootScope.transportista = JSON.parse(localStorageService.get(localStorageKeys.transportista));
                    $rootScope.broker = JSON.parse(localStorageService.get(localStorageKeys.broker));
                    if (!$rootScope.role){
                        //$window.location.href = "http://easyruta.parseapp.com/modules/login/index.html";
                    }
                }
            }
        }
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            validateRoute();
        });
        validateRoute();
    }]);
*/