/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .directive("ezPedidoEnCurso",function(){
        return {
            restrict: 'E',
            templateUrl: "/app/directives/pedidos/ez-pedido-en-curso.html"
        }
    });
