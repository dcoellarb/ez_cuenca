/**
 * Created by dcoellar on 4/6/16.
 */

angular.module('easyRuta')
    .directive('ezPedidos',function(){
        return {
            restrict: 'E',
            templateUrl: "app/directives/pedidos/ez-pedidos.html"
        };
    });
