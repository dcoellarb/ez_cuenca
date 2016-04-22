/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .service('proveedorCargaPedidosService',['collectionsEnum','dataService','pedidoModel',function(collectionsEnum,dataService,pedidoModel){

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
            }
        }
    }]);
