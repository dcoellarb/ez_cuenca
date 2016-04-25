/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .service('transportistaPedidosService',['collectionsEnum','dataService','pedidoModel','pedidoEstadosEnum','realtimeService','realtimeChannels','choferModel','choferEstadosEnum',function(collectionsEnum,dataService,pedidoModel,pedidoEstadosEnum,realtimeService,realtimeChannels,choferModel,choferEstadosEnum){

        //private methods
        return {
            //public methods
            getPedidos: function(){
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.getAll(collectionsEnum.pedido,{filters:[{type:"and",operator:"=",field:"plantilla",value:undefined}],includes:["proveedorCarga","transportista","chofer"]}).subscribe(
                        function (pedidos) {
                            observer.onNext(pedidos.map(function(pedido){
                                return pedidoModel.toJson(pedido,[{field:"proveedorCarga"},{field:"transportista"},{field:"chofer"}]);
                            }));
                            observer.onCompleted();
                        },
                        function (e) { observer.onError(e) },
                        function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            },
            actualizarViaje: function(pedido, estado) {
                var updatedFields = [
                    {operator: "set", field: "estado", value: estado},
                ];
                if (estado == pedidoEstadosEnum.enCurso){
                    updatedFields.push({operator: "set", field: "horaInicio", value: new Date()});
                }else if (estado == pedidoEstadosEnum.finalizado){
                    updatedFields.push({operator: "set", field: "horaFinalizacion", value: new Date()});
                }
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.update(collectionsEnum.pedido,pedidoModel.fromJson(pedido),{updatedFields: updatedFields})
                        .flatMap(function(p){
                            var chofer = pedido.chofer;
                            pedido = p;
                            if (estado == pedidoEstadosEnum.finalizado){
                                return dataService.update(collectionsEnum.chofer,choferModel.fromJson(chofer),{updatedFields: [{operator: "set", field: "estado", value: choferEstadosEnum.disponible}]});
                            }else{
                                return Rx.Observable.just(undefined);
                            }
                        })
                        .subscribe(
                            function (c) {
                                if (estado == pedidoEstadosEnum.enCurso){
                                    realtimeService.publish(realtimeChannels.pedidoIniciado,{id:pedido.id});
                                } else if (estado == pedidoEstadosEnum.finalizado){
                                    realtimeService.publish(realtimeChannels.pedidoFinalizado,{id:pedido.id});
                                }

                                observer.onNext(pedidoModel.toJson(pedido,[{field:"proveedorCarga"},{field:"transportista"},{field:"chofer"}]));
                                observer.onCompleted();
                            },
                            function (e) { observer.onError(e) },
                            function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            }
        }
    }]);
