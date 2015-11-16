/**
 * Created by dcoellar on 11/16/15.
 */

(function(){

    var utilities;

    angular.module("easyRuta")
        .controller('historicoController',function($scope,$location,utils){

            utilities = utils;

            var ctlr = this;

            inicializarPedidos($scope,ctlr);

            ctlr.verDetalle = function(id) {
                $location.path("/detallePedido/" + id);
            };

        });

    var inicializarPedidos = function($scope,ctlr){
        var pedido = Parse.Object.extend("Pedido");
        var query = new Parse.Query(pedido);
        query.equalTo("Estado", "Finalizado");
        query.include("CiudadOrigen");
        query.include("CiudadDestino");
        query.include("Transportista");
        query.addDescending("createdAt");
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
                imageUrl: imageUrl,
                rating: pedido.get("Rate")
            }
        }
        var pedidoJson = {
            id : pedido.id,
            viaje : pedido.get("CiudadOrigen").get("Nombre") + " - " + pedido.get("CiudadDestino").get("Nombre"),
            entrega : utilities.formatDate(pedido.get("HoraFinalizacion")),
            carga : utilities.formatDate(pedido.get("HoraCarga")),
            estado : pedido.get("Estado"),
            transportista : transportista,
            producto: pedido.get("Producto")
        };
        return pedidoJson;
    };

})();