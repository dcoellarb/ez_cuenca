/**
 * Created by dcoellar on 9/21/15.
 */

/**
 * Created by dcoellar on 9/18/15.
 */

(function(){

    var utilities;

    angular.module("easyRuta")
        .controller('PedidosCompletadosController',function($rootScope,$scope,$location,utils) {
            utilities = utils;

            var ctlr = this;

            inicializarPedidos($scope,ctlr);

            ctlr.verDetalle = function(id) {
                $location.path("/detallePedido/" + id);
            };

            //Suscriptions
            //Internal Suscriptions
            $rootScope.$on('nuevoPedidoCompletado', function(event, args) {
                inicializarPedidos($scope,ctlr)
            });

            //Pubnub suscriptions
        });

    var inicializarPedidos = function($scope,ctlr){

        //TODO - filter only current day
        var pedido = Parse.Object.extend("Pedido");
        var query = new Parse.Query(pedido);
        query.equalTo("Estado", "Finalizado");
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
        var pedidoJson = {
            id : pedido.id,
            viaje : pedido.get("CiudadOrigen").get("Nombre") + " - " + pedido.get("CiudadDestino").get("Nombre"),
            carga : utilities.formatDate(pedido.get("HoraFinalizacion")),
            estado : pedido.get("Estado"),
            transportista : {
                nombre: pedido.get("Transportista").get("Nombre"),
                telefono: pedido.get("Transportista").get("Telefono"),
                imageUrl: pedido.get("Transportista").get("photo").url()
            }
        };

        return pedidoJson;
    };

})();
