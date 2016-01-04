/**
 * Created by dcoellar on 10/25/15.
 */


(function(){

    angular.module("easyRuta")
        .controller('RateTransportistaController',function($scope,$uibModal){

            var ctlr = this;

        });

    angular.module("easyRuta")
        .controller('RateTransportistaModalController',function($scope,$uibModalInstance,utils){
            utilities = utils;

            var ctlr = this;

            inicializarPedidos(ctlr,$scope)

            $scope.ok = function () {
                saveAll(ctlr,$uibModalInstance);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        });

    var inicializarPedidos = function(ctlr,$scope){
        var pedido = Parse.Object.extend("Pedido");
        var query = new Parse.Query(pedido);
        query.equalTo("Estado", "Finalizado");
        query.equalTo("Rate",undefined);
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
    }

    var saveAll = function(ctlr,$uibModalInstance){
        var Pedido = Parse.Object.extend("Pedido");

        var pedidosParse = [];
        for (var i = 0; i < ctlr.pedidos.length; i++) {
            var pedido = ctlr.pedidos[i].data;
            pedido.set("Rate",ctlr.pedidos[i].json.rate);
            pedidosParse.push(pedido);
        }

        // save all the newly created objects
        Parse.Object.saveAll(pedidosParse, {
            success: function(objs) {
                $uibModalInstance.close();
            },
            error: function(error) {
                console.log("Error saving ratings");
                console.dir(error);
                //TODO - let the user know
            }
        });
    }

    var pedidoToJson = function(pedido){
        var imageUrl = "";
        if (pedido.get("Transportista").get("photo")){
            imageUrl = pedido.get("Transportista").get("photo").url();
        }
        var pedidoJson = {
            id : pedido.id,
            viaje : pedido.get("CiudadOrigen").get("Nombre") + " - " + pedido.get("CiudadDestino").get("Nombre"),
            carga : utilities.formatDate(pedido.get("HoraFinalizacion")),
            estado : pedido.get("Estado"),
            rate : pedido.get("Rate"),
            transportista : {
                nombre: pedido.get("Transportista").get("Nombre"),
                telefono: pedido.get("Transportista").get("Telefono"),
                imageUrl: imageUrl
            }
        };

        return pedidoJson;
    };
})();