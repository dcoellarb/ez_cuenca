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
                .otherwise({
                    templateUrl : '/templates/pages/publico/home/index.html'
                })
        }).
        run(function($rootScope, $location) {
            $rootScope.$on( "$routeChangeStart", function(event, next, current) {
                if (!Parse.User.current()) {
                    if ( next.templateUrl === '/templates/pages/publico/home/index.html') {
                    } else {
                        $location.path("/login");
                    }
                }
            });
        });

})();