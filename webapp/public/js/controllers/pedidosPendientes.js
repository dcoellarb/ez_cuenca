/**
 * Created by dcoellar on 9/18/15.
 */

(function(){

    angular.module("easyRuta")
        .controller('PedidosPendientesController',function($rootScope,$scope) {
            var ctlr = this;

            inicializarPedidos($scope,ctlr);

            $rootScope.$on('nuevoPedido', function(event, args) {
                ctlr.pedidos.push(args);
            });

        });

    var inicializarPedidos = function($scope,ctlr){
        var pedido = Parse.Object.extend("Pedido");
        var query = new Parse.Query(pedido);
        query.equalTo("Estado", "Pendiente");
        query.find({
            success: function(results) {
                ctlr.pedidos = new Array();
                for (var i = 0; i < results.length; i++) {
                    ctlr.pedidos.push(results[i]);
                }
                $scope.$apply();
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });
    }
})();