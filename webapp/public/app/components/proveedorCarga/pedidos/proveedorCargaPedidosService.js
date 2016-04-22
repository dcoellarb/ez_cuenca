/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .service('proveedorCargaPedidosService',['collectionsEnum','dataService','pedidoModel','pedidoEstadosEnum','realtimeService','realtimeChannels','choferModel','choferEstadosEnum',function(collectionsEnum,dataService,pedidoModel,pedidoEstadosEnum,realtimeService,realtimeChannels,choferModel,choferEstadosEnum){

        //private methods

        return {
            //public methods
            getPedidos: function() {
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
            cancelarPedido: function(pedido) {
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.update(collectionsEnum.pedido,pedidoModel.fromJson(pedido),{updatedFields:[{operator:"set",field:"estado",value:pedidoEstadosEnum.cancelado}]})
                        .flatMap(function(p){
                            var chofer = pedido.chofer
                            pedido = p;
                            if (chofer){
                                return dataService.update(collectionsEnum.chofer,choferModel.fromJson(chofer),{updatedFields: [{operator: "set", field: "estado", value: choferEstadosEnum.disponible}]});
                            }else{
                                return Rx.Observable.just(undefined);
                            }
                        })
                        .subscribe(
                        function (c) {
                            realtimeService.publish(realtimeChannels.pedidoCancelado,{id:pedido.id});

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
