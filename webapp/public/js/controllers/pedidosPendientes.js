/**
 * Created by dcoellar on 9/18/15.
 */

(function(){

    var utilities;

    angular.module("easyRuta")
        .controller('PedidosPendientesController',function($rootScope,$scope,utils) {
            utilities = utils;

            var ctlr = this;

            inicializarPedidos($scope,ctlr);

            $rootScope.$on('nuevoPedido', function(event, args) {
                var pedido = {
                    data : args,
                    json : pedidoToJson(args)
                };
                ctlr.pedidos.unshift(pedido);
            });

            setInterval(function(){
                if (ctlr.pedidos){
                    for(var i = 0;i < ctlr.pedidos.length;i++){
                        var pedido = ctlr.pedidos[i];
                        if (pedido.data.get('Estado') == 'PendienteConfirmacion'){
                            if (pedido.timer.minute > 0 || pedido.time.second > 0){
                                if (pedido.timer.second > 0){
                                    pedido.timer.second -= 1;
                                }else{
                                    if (pedido.timer.minute > 0){
                                        pedido.timer.minute -= 1;
                                        pedido.timer.second = 59;
                                    }else{
                                        //TODO - cancel confirmation
                                    }
                                }
                                $scope.$apply();
                            }
                        }
                    }
                }
            },1000);

            ctlr.confirmar = function(pedido){
                pedido.data.set('Estado','Activo');
                pedido.data.save(null, {
                    success: function(pedidoUpdated) {
                        ctlr.pedidos.splice(ctlr.pedidos.indexOf(pedido),1);
                        $rootScope.$broadcast('nuevoPedidoConfirmado', pedido.data);
                        $scope.$apply();
                    }
                });
            };
            ctlr.rechazar = function(pedido){
                pedido.data.set('Estado','Pendiente');
                pedido.data.save(null, {
                    success: function(pedidoUpdated) {
                        pedido.data = pedidoUpdated;
                        pedido.json = pedidoToJson(pedidoUpdated);
                        $scope.$apply();
                    }
                });
            };
        });

    var inicializarPedidos = function($scope,ctlr){
        var pedido = Parse.Object.extend("Pedido");
        var queryPendientes = new Parse.Query(pedido);
        queryPendientes.equalTo("Estado", "Pendiente");
        var queryPendientesConfirmacion = new Parse.Query(pedido);
        queryPendientesConfirmacion.equalTo("Estado", "PendienteConfirmacion");

        var mainQuery = Parse.Query.or(queryPendientes, queryPendientesConfirmacion);
        mainQuery.find({
            success: function(results) {
                ctlr.pedidos = new Array();
                for (var i = 0; i < results.length; i++) {
                    var pedido = {
                        data : results[i],
                        json : pedidoToJson(results[i])
                    };
                    if (results[i].get('Estado') == 'PendienteConfirmacion'){
                        pedido.timer = {'minute' : 30, 'second' : 0};
                    }
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
        var estado = pedido.get("Estado");
        if (pedido.get("Estado") == "Pendiente"){
            estado = "Pendiente Asignacion";
        }else if (pedido.get("Estado") == "PendienteConfirmacion"){
            estado = "Pendiente Confirmacion";
        }

        var pedidoJson = {
            id : pedido.id,
            viaje : pedido.get("CiudadOrigen").get("Nombre") + " - " + pedido.get("CiudadDestino").get("Nombre"),
            carga : "Hora de Carga: " + utilities.formatDate(pedido.get("HoraCarga")),
            entrega : "Hora de Entrega: " + utilities.formatDate(pedido.get("HoraEntrega")),
            estado : "Estado: " + estado

        };

        return pedidoJson;
    };

})();