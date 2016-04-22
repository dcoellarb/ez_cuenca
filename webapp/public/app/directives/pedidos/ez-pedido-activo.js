/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .directive("ezPedidoActivo",function(){
        return {
            restrict: 'E',
            templateUrl: "/app/directives/pedidos/ez-pedido-activo.html"
        }
    });
