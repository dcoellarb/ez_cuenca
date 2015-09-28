/**
 * Created by dcoellar on 9/21/15.
 */

/**
 * Created by dcoellar on 9/18/15.
 */

(function(){

    var utilities;

    angular.module("easyRuta")
        .controller('PedidosActivosController',function($rootScope,$scope,utils) {
            utilities = utils;

            var ctlr = this;

            inicializarPedidos($scope,ctlr);

            //Suscriptions
            //Internal Suscriptions
            $rootScope.$on('nuevoPedidoConfirmado', function(event, args) {
                console.log("nuevo pedido confirmado");
                var pedido = {
                    data : args,
                    json : pedidoToJson(args)
                };
                ctlr.pedidos.unshift(pedido);

            });

            //Pubnub suscriptions
            $rootScope.pubnub.subscribe({
                channel: 'pedido_completado',
                message: function(m){
                    inicializarPedidos($scope,ctlr);
                }
            });
            $rootScope.pubnub.subscribe({
                channel: 'pedido_cancelado_transportista',
                message: function(m){
                    inicializarPedidos($scope,ctlr);
                }
            });
        });

    var inicializarPedidos = function($scope,ctlr){

        //TODO - filter only current day
        var pedido = Parse.Object.extend("Pedido");
        var query = new Parse.Query(pedido);
        query.equalTo("Estado", "Completado");
        query.find({
            success: function(results) {
                ctlr.pedidos = new Array();
                for (var i = 0; i < results.length; i++) {
                    var pedido = {
                        data : results[i],
                        json : pedidoToJson(results[i])
                    };
                    ctlr.pedidos.push(pedido);
                }
                $scope.$apply();
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });
    };

    var pedidoToJson = function(pedido){
        var pedidoJson = {
            id : pedido.id,
            viaje : pedido.get("CiudadOrigen").get("Nombre") + " - " + pedido.get("CiudadDestino").get("Nombre"),
            carga : utilities.formatDate(pedido.get("HoraFinalizacion")),
            estado : pedido.get("Estado")

        };

        return pedidoJson;
    };

})();
