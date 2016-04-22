/**
 * Created by dcoellar on 9/14/15.
 */

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
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            if (!dataService.currentUser()) {
                $window.location.href = "http://localhost:3000/modules/login/index.html";
            }else{
                if (!$rootScope.role){
                    $rootScope.role = JSON.parse(localStorageService.get(localStorageKeys.role));
                    $rootScope.proveedorCarga = JSON.parse(localStorageService.get(localStorageKeys.proveedorCarga));
                    $rootScope.transportista = JSON.parse(localStorageService.get(localStorageKeys.transportista));
                    $rootScope.broker = JSON.parse(localStorageService.get(localStorageKeys.broker));
                    if (!$rootScope.role){
                        $window.location.href = "http://localhost:3000/modules/login/index.html";
                    }
                }
            }
        });
    }]);
