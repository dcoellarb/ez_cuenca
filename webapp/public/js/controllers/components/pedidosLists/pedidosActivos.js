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
                var pedido = {
                    data : args,
                    json : pedidoToJson(args)
                };
                pedido.background = "backgroud-photo-" + pedido.data.get("CiudadDestino").get("Nombre").toLowerCase();
                ctlr.pedidos.unshift(pedido);
            });
            //TODO - add insternal suscription for pedido cancelado transportista
            //TODO - add insternal suscription for pedido cancelado

            //Pubnub suscriptions
            //TODO - add pubnub suscription for pedido confirmado
            $rootScope.pubnub.subscribe({
                channel: 'pedido_iniciado',
                message: function(m){
                    var pedido;
                    for(var i=0;i<ctlr.pedidos.length;i++){
                        if (ctlr.pedidos[i].data.id == m){
                            pedido = ctlr.pedidos[i].data
                        }
                    }
                    $rootScope.$broadcast('nuevoPedidoIniciado', pedido);
                    inicializarPedidos($scope,ctlr);
                }
            });
        });

    var inicializarPedidos = function($scope,ctlr){
        var pedido = Parse.Object.extend("Pedido");
        var query = new Parse.Query(pedido);
        query.equalTo("Estado", "Activo");
        query.find({
            success: function(results) {
                ctlr.pedidos = new Array();
                for (var i = 0; i < results.length; i++) {
                    var pedido = {
                        data : results[i],
                        json : pedidoToJson(results[i])
                    };
                    pedido.background = "backgroud-photo-" + pedido.data.get("CiudadDestino").get("Nombre").toLowerCase();
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
            carga : utilities.formatDate(pedido.get("HoraCarga")),
            entrega : utilities.formatDate(pedido.get("HoraEntrega")),
            estado : pedido.get("Estado")

        };

        return pedidoJson;
    };

})();
