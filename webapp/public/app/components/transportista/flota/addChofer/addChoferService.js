/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .service('addChoferService',['$rootScope','collectionsEnum','transportistaModel','choferModel','dataService',function($rootScope,collectionsEnum,transportistaModel,choferModel,dataService){

        //private methods

        return {
            //public methods
            getTransportistaCurrentUser: function() {
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.get(collectionsEnum.transportista,{id: $rootScope.transportista.id}).subscribe(
                        function (transportista) {
                            observer.onNext(transportistaModel.toJson(transportista));
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
            addChofer: function(chofer) {
                var acl = {
                    currentUser: true,
                    permissions: [
                        {isRole: true, role: rolesEnum.broker, id: undefined, allowRead: true, allowWrite: true},
                        {isRole: true, role: rolesEnum.proveedorCarga, id: undefined, allowRead: true, allowWrite: true}
                    ]
                }
                //TODO when chofer is user add this permission
                //{isRole: false, role: undefined, id: chofer.user.id, allowRead: true, allowWrite: true}

                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.add(collectionsEnum.chofer, choferModel.fromJson(chofer), {acl: acl}).subscribe(
                        function (chofer) {
                            observer.onNext(choferModel.toJson(chofer));
                            observer.onCompleted();
                        },
                        function (e) {
                            observer.onError(e)
                        },
                        function () {
                        }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            },
            updateChofer: function(chofer) {
                return Rx.Observable.create(function (observer) {
                    var updatedFields = [
                        {operator: "set", field: "nombre", value: chofer.nombre},
                        {operator: "set", field: "descripcion", value: chofer.descripcion},
                        {operator: "set", field: "cedula", value: chofer.cedula},
                        {operator: "set", field: "telefono", value: chofer.telefono},
                        {operator: "set", field: "tipoCamion", value: chofer.tipoCamion},
                        {operator: "set", field: "marca", value: chofer.marca},
                        {operator: "set", field: "modelo", value: chofer.modelo},
                        {operator: "set", field: "anio", value: chofer.anio},
                        {operator: "set", field: "placa", value: chofer.placa},
                        {operator: "set", field: "color", value: chofer.color},
                    ];
                    var suscription = dataService.update(collectionsEnum.chofer, choferModel.fromJson(chofer), {updatedFields:updatedFields}).subscribe(
                        function (chofer) {
                            observer.onNext(choferModel.toJson(chofer));
                            observer.onCompleted();
                        },
                        function (e) {
                            observer.onError(e)
                        },
                        function () {
                        }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            }
        }
    }]);