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
                        pedidoToJson(pedidoUpdated,function(pedidoJson){
                            pedido.data = pedidoUpdated;
                            pedido.json = pedidoJson

                            $scope.$apply();

                            // Publish nuevo pedido
                            $rootScope.pubnub.publish({
                                channel: 'pedido_rechazado',
                                message: {id:pedido.json.id}
                            });

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
                    pedidoToJson(args[i],function(pedidoJson){
                        var pedido = {
                            data : args[i],
                            json : pedidoJson
                        };
                        pedido.background = "backgroud-photo-" + pedido.data.get("CiudadDestino").get("Nombre").toLowerCase();
                        ctlr.pedidos.unshift(pedido);
                    });
                }
            });
            //TODO - add insternal suscription for pedido cancelado

            // Pubnub suscriptions
            $rootScope.pubnub.subscribe({
                channel: 'new_pedidos',
                presence: function(m){
                    $rootScope.$broadcast('new_pedido_new_suscriber', m);
                },
                message: function(m){
                    inicializarPedidos($scope,ctlr);
                }
            });
            $rootScope.pubnub.subscribe({
                channel: 'pedido_tomado',
                message: function(m){
                    $rootScope.$broadcast('pedido_tomado', m);
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
        mainQuery.include("CiudadOrigen");
        mainQuery.include("CiudadDestino");
        mainQuery.include("Transportista");
        mainQuery.addDescending("createdAt");
        mainQuery.find({
            success: function(results) {
                ctlr.pedidos = new Array();
                processRecord($scope,ctlr,results,0);
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });
    };

    var processRecord = function($scope,ctlr,results,i){
        pedidoToJson(results[i],function(pedidoJson){
            var pedido = {
                data : results[i],
                json : pedidoJson
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

            if (i == results.length - 1){
                setTimers($scope,ctlr);
                $scope.$apply();
            }else{
                i++;
                processRecord($scope,ctlr,results,i);
            }
        });
    }

    var pedidoToJson = function(pedido,callback){
        var pedidoJson = {
            id : pedido.id,
            viaje : pedido.get("CiudadOrigen").get("Nombre") + " - " + pedido.get("CiudadDestino").get("Nombre"),
            carga : utilities.formatDate(pedido.get("HoraCarga")),
            entrega : utilities.formatDate(pedido.get("HoraEntrega")),
            estado :  pedido.get("Estado")
        };
        if (pedido.get("Transportista")){
            var transportistaId = pedido.get("Transportista").id;
            if (transportistaId){
                Parse.Cloud.run('transportistaStatistics', { transportista: transportistaId}, {
                    success: function(statistics) {
                        console.dir(statistics);

                        pedidoJson["Transportista"] = statistics;

                        callback(pedidoJson);
                    },
                    error: function(error) {
                        console.log("error getting transportista statistics");
                        console.dir(error);

                        callback(pedidoJson);
                    }
                });
            }else{
                callback(pedidoJson);
            }
        }else{
            callback(pedidoJson);
        }
    };

    var setTimers = function($scope,ctlr){
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
    }

})();