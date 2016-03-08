/**
 * Created by dcoellar on 9/14/15.
 */

(function(){

    angular.module("easyRuta")
        .config(function($routeProvider){
            $routeProvider
                .when('/inicioClientes',{
                    templateUrl : '/templates/pages/inicio_clientes.html'
                })
                .when('/inicioProveedores',{
                    templateUrl : '/templates/pages/inicio_proveedores.html'
                })
                .when('/inicioDespachadores',{
                    templateUrl : '/templates/pages/inicio_despachadores.html'
                })
                .when('/detallePedido/:id',{
                    templateUrl : '/templates/pages/detalle_pedido.html'
                })
                .when('/historico',{
                    templateUrl : '/templates/pages/historico.html'
                })
                .when('/perfil',{
                    templateUrl : '/templates/pages/perfil.html'
                })
                .when('/detalleTransportista/:id',{
                    templateUrl : '/templates/pages/detalle_transportista.html' //Update
                })
                .when('/detalleTransportista/',{
                    templateUrl : '/templates/pages/detalle_transportista.html' //Add
                })
                .otherwise({
                    templateUrl : '/templates/pages/inicio_publico.html'
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