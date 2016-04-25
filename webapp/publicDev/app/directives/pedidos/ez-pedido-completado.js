/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .directive("ezPedidoCompletado",function(){
        return {
            restrict: 'E',
            templateUrl: "/app/directives/pedidos/ez-pedido-completado.html"
        }
    });
