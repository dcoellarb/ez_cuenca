/**
 * Created by dcoellar on 9/18/15.
 */

(function(){

    var utilities;

    angular.module("easyRuta")
        .controller('PedidosPendientesController',function($rootScope,$scope,$location,utils) {
            utilities = utils;

            var ctlr = this;

            inicializarPedidos($scope,ctlr);

            // Timers
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

            // Acciones
            ctlr.confirmar = function(pedido){
                pedido.data.set('Estado','Activo');
                pedido.data.save(null, {
                    success: function(pedidoUpdated) {
                        ctlr.pedidos.splice(ctlr.pedidos.indexOf(pedido),1);
                        $rootScope.$broadcast('nuevoPedidoConfirmado', pedido.data);
                        $scope.$apply();

                        // Publish nuevo pedido
                        $rootScope.pubnub.publish({
                            channel: 'pedido_confirmado',
                            message: {id:pedido.json.id}
                        });
                    }
                });
            };
            ctlr.rechazar = function(pedido){
                console.log("Transportista:" + pedido.data.get('Transportista').id);
                pedido.data.add('TransportistasBloqueados',pedido.data.get('Transportista').id);
                pedido.data.unset('Transportista');
                pedido.data.set('Estado','Pendiente');
                pedido.data.save(null, {
                    success: function(pedidoUpdated) {
                        pedido.data = pedidoUpdated;
                        pedido.json = pedidoToJson(pedidoUpdated);
                        $scope.$apply();

                        // Publish nuevo pedido
                        $rootScope.pubnub.publish({
                            channel: 'pedido_rechazado',
                            message: {id:pedido.json.id}
                        });
                    }
                });
            };
            ctlr.verDetalle = function(id) {
                $location.path("/detallePedido/" + id);
            };

            // Suscriptions
            // Internal suscriptions
            $rootScope.$on('nuevosPedidos', function(event, args) {
                for(var i=0;i<args.length;i++){
                    var pedido = {
                        data : args[i],
                        json : pedidoToJson(args[i])
                    };
                    pedido.background = "backgroud-photo-" + pedido.data.get("CiudadDestino").get("Nombre").toLowerCase();
                    ctlr.pedidos.unshift(pedido);
                }
            });
            //TODO - add insternal suscription for pedido cancelado

            // Pubnub suscriptions
            $rootScope.pubnub.subscribe({
                channel: 'new_pedido',
                message: function(m){
                    inicializarPedidos($scope,ctlr);
                }
            });
            $rootScope.pubnub.subscribe({
                channel: 'pedido_tomado',
                message: function(m){
                    inicializarPedidos($scope,ctlr);
                }
            });
            //TODO - add pubnub subscription for pedido_rechazado
            $rootScope.pubnub.subscribe({
                channel: 'pedido_cancelado_transportista',
                message: function(m){
                    $rootScope.$broadcast('pedido_cancelado_transportista', m);
                    inicializarPedidos($scope,ctlr);
                }
            });
            $rootScope.pubnub.subscribe({
                channel: 'pedido_cancelado',
                message: function(m){
                    //TODO - send internal notificacion to other lists
                    inicializarPedidos($scope,ctlr);
                }
            });
        });

    var inicializarPedidos = function($scope,ctlr){
        var pedido = Parse.Object.extend("Pedido");
        var queryPendientes = new Parse.Query(pedido);
        queryPendientes.equalTo("Estado", "Pendiente");
        var queryPendientesConfirmacion = new Parse.Query(pedido);
        queryPendientesConfirmacion.equalTo("Estado", "PendienteConfirmacion");

        var mainQuery = Parse.Query.or(queryPendientes, queryPendientesConfirmacion);
        mainQuery.addDescending("createdAt");
        mainQuery.find({
            success: function(results) {
                console.log("success getting pending pedidos");
                ctlr.pedidos = new Array();
                for (var i = 0; i < results.length; i++) {
                    console.log("estado:" + results[i].get("Estado"))
                    var pedido = {
                        data : results[i],
                        json : pedidoToJson(results[i])
                    };
                    if (results[i].get('Estado') == 'PendienteConfirmacion'){
                        var horaEnd = results[i].get('HoraSeleccion');
                        var horaCurrent = new Date();
                        horaEnd.setMinutes(horaEnd.getMinutes() + 30);

                        var diffMs = (horaEnd - horaCurrent);
                        var diffMins = Math.round(diffMs / 60000); // minutes
                        var diffSecs = Math.round((diffMs % 60000) / 1000); // seconds

                        pedido.timer = {'minute' : diffMins, 'second' : diffSecs};
                    }
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
            estado :  pedido.get("Estado")
        };

        return pedidoJson;
    };

})();