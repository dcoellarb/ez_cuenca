/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .service('addPedidoService',['$rootScope','collectionsEnum','proveedorCargaModel','pedidoModel','transportistaModel','dataService','realtimeService','pedidoEstadosEnum','rolesEnum','realtimeChannels',function($rootScope,collectionsEnum,proveedorCargaModel,pedidoModel,transportistaModel,dataService,realtimeService,pedidoEstadosEnum,rolesEnum,realtimeChannels){

        //private methods

        return {
            //public methods
            getEmpresaCurrentUser: function(){
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.get(collectionsEnum.proveedorCarga,{id: $rootScope.proveedorCarga.id}).subscribe(
                        function (proveedorCarga) {
                            observer.onNext(proveedorCargaModel.toJson(proveedorCarga));
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
            getEmpresas: function(){
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.getAll(collectionsEnum.proveedorCarga,undefined).subscribe(
                        function (proveedoresCarga) {
                            observer.onNext(proveedoresCarga.map(function(proveedorCarga){
                                return proveedorCargaModel.toJson(proveedorCarga);
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
            getPlantillas: function(empresa) {
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.getAll(collectionsEnum.pedido,{filters:[{type:"and",operator:"!=",field:"plantilla",value:undefined},{type:"and",operator:"=",field:"proveedorCarga",value:empresa.object}]}).subscribe(
                        function (plantillas) {
                            observer.onNext(plantillas.map(function(plantilla){
                                return pedidoModel.toJson(plantilla);
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
            getTransportistas: function(empresa) {
                return Rx.Observable.create(function (observer) {

                    var suscriptions = [];
                    empresa.asociados.forEach(function(e,i,a){
                        var suscription = dataService.get(collectionsEnum.transportista,{id:e}).subscribe(
                            function (transportista) {
                                observer.onNext(transportistaModel.toJson(transportista));

                                //complete if is the last one
                                if (i == a.length - 1){
                                    observer.onCompleted();
                                }
                            },
                            function (e) {
                                //complete if is the last one
                                observer.onError(e)
                                if (i == a.length - 1){
                                    observer.onCompleted();
                                }
                            },
                            function () { }
                        );
                        suscriptions.push(suscription);
                    });

                    return function () {
                        suscriptions.forEach(function (e,i,a){
                            e.dispose();
                        });
                    }
                });
            },
            getDefaultPedido: function(pedido, donacion) {
                if (pedido) {
                    return pedido;
                }
                return {
                    donacion: donacion,
                    managedByBroker: false,
                    valor: 0
                }
            },
            guardarPedido: function(pedido, saveAsPlantilla, transportistas) {
                var acl = {
                    currentUser: true,
                    permissions: []
                }

                if (saveAsPlantilla) {
                    pedido.estado = undefined;
                    pedido.horaCarga = undefined;
                    pedido.horaEntrega = undefined;
                } else {
                    pedido.plantilla = undefined;
                    pedido.estado = pedidoEstadosEnum.pendiente;

                    if (pedido.managedByBroker) {
                        acl.permissions.push(
                            {
                                isRole: true,
                                role: rolesEnum.broker,
                                id: undefined,
                                allowRead: true,
                                allowWrite: true
                            }
                        );
                    } else if (pedido.proveedorCarga.asociadoConTodos || pedido.donacion) {
                        acl.permissions.push(
                            {
                                isRole: true,
                                role: rolesEnum.transportista,
                                id: undefined,
                                allowRead: true,
                                allowWrite: true
                            }
                        );
                    } else if (pedido.transportista) {
                        acl.permissions.push(
                            {
                                isRole: false,
                                role: undefined,
                                id: pedido.transportista.user,
                                allowRead: true,
                                allowWrite: true
                            }
                        );
                    } else if (transportistas) {
                        transportistas.forEach(function(e,i,a){
                            acl.permissions.push(
                                {
                                    isRole: false,
                                    role: undefined,
                                    id: e.user,
                                    allowRead: true,
                                    allowWrite: true
                                }
                            );
                        });
                    }
                }
                if (pedido.horaCarga) { pedido.horaCarga = pedido.horaCarga._d; }
                if (pedido.horaEntrega) { pedido.horaEntrega = pedido.horaEntrega._d; }
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.add(collectionsEnum.pedido,pedidoModel.fromJson(pedido),{acl: acl}).subscribe(
                        function (pedido) {
                            realtimeService.publish(realtimeChannels.pedidoCreado,{id:pedido.id, acl: acl});

                            observer.onNext(pedidoModel.toJson(pedido));
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