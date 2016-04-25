/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .service('setTransportistaService',['$rootScope','collectionsEnum','choferModel','dataService','pedidoEstadosEnum','pedidoModel','realtimeService','realtimeChannels','choferModel','choferEstadosEnum',function($rootScope,collectionsEnum,choferModel,dataService,pedidoEstadosEnum,pedidoModel,realtimeService,realtimeChannels,choferModel,choferEstadosEnum){

        //private methods

        return {
            //public methods
            getChoferes: function(pedido) {
                return Rx.Observable.create(function (observer) {
                    var parms = {filters:[{type:"and",operator:"!=",field:"deleted",value:true},{type:"and",operator:"=",field:"estado",value:choferEstadosEnum.disponible}],includes:["transportista"]};
                    var suscription = dataService.getAll(collectionsEnum.chofer,parms).subscribe(
                        function (choferes) {
                            observer.onNext(
                                choferes
                                    .map(function(chofer){ return choferModel.toJson(chofer,[{field: "transportista"}]); })
                                    .filter(function(chofer){ return pedido.tipoCamion.indexOf(chofer.tipoCamion) >= 0; })
                            );
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
            getPedido: function(pedido, chofer) {
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.get(collectionsEnum.pedido,{id:pedido.id})
                        .subscribe(
                        function (p) {
                            pedidoJson = pedidoModel.toJson(p);
                            if (pedidoJson.estado == pedidoEstadosEnum.pendiente){
                                observer.onNext(true);
                                observer.onCompleted();
                            } else {
                                observer.onError(pedidoJson);
                            }
                        },
                        function (e) { observer.onError(e) },
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
                    var suscription = dataService.update(collectionsEnum.pedido,pedidoModel.fromJson(pedido),{updatedFields: updatedFields, acl: acl})
                        .flatMap(function(p){
                            pedido = p;
                            return dataService.update(collectionsEnum.chofer,choferModel.fromJson(chofer),{updatedFields: [{operator: "set", field: "estado", value: choferEstadosEnum.enViaje}]});
                        })
                        .subscribe(
                            function (c) {
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