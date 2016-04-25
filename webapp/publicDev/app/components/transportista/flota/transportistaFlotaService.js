/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .service('transportistaFlotaService',['collectionsEnum','choferModel','dataService',function(collectionsEnum,choferModel,dataService){

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
            eliminarChofer: function(chofer) {
                return Rx.Observable.create(function (observer) {
                    var updatedFields = [
                        {operator: "set", field: "deleted", value: true},
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