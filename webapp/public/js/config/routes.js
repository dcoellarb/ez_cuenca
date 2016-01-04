/**
 * Created by dcoellar on 9/14/15.
 */

(function(){

    angular.module("easyRuta")
        .config(function($routeProvider){
            $routeProvider
                .when('/inicioClientes',{
                    templateUrl : '/templates/pages/privado/clientes/inicioClientes/index.html'
                })
                .when('/inicioProveedores',{
                    templateUrl : '/templates/pages/privado/proveedores/inicio/index.html'
                })
                .when('/detallePedido/:id',{
                    templateUrl : '/templates/pages/privado/clientes/DetallePedido/index.html'
                })
                .when('/historico',{
                    templateUrl : '/templates/pages/privado/clientes/Historico/index.html'
                })
                .when('/perfil',{
                    templateUrl : '/templates/pages/privado/clientes/Perfil/index.html'
                })
                .when('/detalleTransportista/:id',{
                    templateUrl : '/templates/pages/privado/proveedores/DetalleTransportista/index.html'
                })
                .when('/detalleTransportista/',{
                    templateUrl : '/templates/pages/privado/proveedores/DetalleTransportista/index.html'
                })
                .otherwise({
                    templateUrl : '/templates/pages/publico/home/index.html'
                })
        }).
        run(function($rootScope, $location, data_services) {
            $rootScope.$on( "$routeChangeStart", function(event, next, current) {
                if (!Parse.User.current()) {
                    if ( next.templateUrl === '/templates/pages/publico/home/index.html') {
                        //Do nothing as index is public
                    } else {
                        $location.path("/login");
                    }
                }else{
                    if (!$rootScope.loggedInRole){
                        data_services.initializar_user_context([],function(params,error,results){});
                    }
                }
            });
        });

})();