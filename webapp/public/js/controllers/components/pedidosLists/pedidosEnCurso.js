/**
 * Created by dcoellar on 9/21/15.
 */

/**
 * Created by dcoellar on 9/18/15.
 */

(function(){

    var utilities;

    angular.module("easyRuta")
        .controller('PedidosEnCursoController',function($rootScope,$scope,$location,utils) {
            utilities = utils;

            var ctlr = this;

            inicializarPedidos($scope,ctlr);

            ctlr.verDetalle = function(id) {
                $location.path("/detallePedido/" + id);
            };

            //Suscriptions
            //Internal Suscriptions
            $rootScope.$on('nuevoPedidoIniciado', function(event, args) {
                inicializarPedidos($scope,ctlr);
            });
            $rootScope.$on('pedido_cancelado_transportista', function(event, args) {
                //TODO - paste notification to user
                inicializarPedidos($scope,ctlr);
            });
            //TODO - add insternal suscription for pedido cancelado

            //Pubnub suscriptions
            $rootScope.pubnub.subscribe({
                channel: 'pedido_finalizado',
                message: function(m){
                    $rootScope.$broadcast('nuevoPedidoCompletado', m);
                    inicializarPedidos($scope,ctlr);
                }
            });
        });

    var inicializarPedidos = function($scope,ctlr){
        var pedido = Parse.Object.extend("Pedido");
        var query = new Parse.Query(pedido);
        query.equalTo("Estado", "EnCurso");
        query.include("CiudadOrigen");
        query.include("CiudadDestino");
        query.include("Transportista");
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
        var transportista = {};
        if (pedido.get("Transportista")) {

            var imageUrl = "";
            if (pedido.get("Transportista").get("photo")) {
                imageUrl = pedido.get("Transportista").get("photo").url();
            }

            transportista = {
                nombre: pedido.get("Transportista").get("Nombre"),
                telefono: pedido.get("Transportista").get("Telefono"),
                imageUrl: imageUrl
            }
        }
        var pedidoJson = {
            id : pedido.id,
            viaje : pedido.get("CiudadOrigen").get("Nombre") + " - " + pedido.get("CiudadDestino").get("Nombre"),
            carga : utilities.formatDate(pedido.get("HoraInicio")),
            entrega : utilities.formatDate(pedido.get("HoraEntrega")),
            estado : pedido.get("Estado"),
            transportista : transportista
        };

        return pedidoJson;
    };

})();
