/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .service('setTransportistaService',['$rootScope','collectionsEnum','choferModel','dataService','pedidoEstadosEnum','pedidoModel','realtimeService','realtimeChannels',function($rootScope,collectionsEnum,choferModel,dataService,pedidoEstadosEnum,pedidoModel,realtimeService,realtimeChannels){

        //private methods

        return {
            //public methods
            getChoferes: function() {
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.getAll(collectionsEnum.chofer,{filters:[{type:"and",operator:"!=",field:"deleted",value:true}],includes:["transportista"]}).subscribe(
                        function (choferes) {
                            observer.onNext(choferes.map(function(chofer){
                                return choferModel.toJson(chofer,[{field: "transportista"}]);
                            }));
                            observer.onCompleted();
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

                    return function () {
                        suscription.dispose();
                    }
                });
            },
            seleccionarChofer: function(pedido, chofer) {
                var updatedFields = [
                    {operator: "set", field: "estado", value: pedidoEstadosEnum.activo},
                    {operator: "set", field: "transportista", value: chofer.transportista.object},
                    {operator: "set", field: "chofer", value: chofer.object},
                    {operator: "set", field: "horaAsignacion", value: new Date()},
                ]
                var acl = {
                    currentUser: true,
                    permissions: [{
                        isRole: false,
                        role: undefined,
                        id: pedido.proveedorCarga.user,
                        allowRead: true,
                        allowWrite: true
                    },{
                        isRole: false,
                        role: undefined,
                        id: chofer.transportista.user,
                        allowRead: true,
                        allowWrite: true
                    }]
                };
                if (chofer.user){
                    acl.permissions.push({
                        isRole: false,
                            role: undefined,
                        id: chofer.user,
                        allowRead: true,
                        allowWrite: true
                    });
                }

                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.update(collectionsEnum.pedido,pedidoModel.fromJson(pedido),{updatedFields: updatedFields, acl: acl}).subscribe(
                        function (pedido) {
                            realtimeService.publish(realtimeChannels.pedidoAsignado,{id:pedido.id, acl: acl});

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