/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .controller('addPedidoController',['$rootScope','$scope', 'addPedidoService','rolesEnum','$mdDialog','$mdToast','pedidoModel','transportistaModel','local',function($rootScope, $scope, addPedidoService,rolesEnum,$mdDialog,$mdToast,pedidoModel,transportistaModel,local){

        //members

        //properties
        $scope.showEmpresas = false;
        $scope.showBroker = false;
        $scope.processing = false;
        $scope.processingForm = true;

        //private methods
        var initializeControls = function() {
            if ($rootScope.role.name == rolesEnum.proveedorCarga) {
                $scope.showBroker = true;
            }
            if ($rootScope.role.name == rolesEnum.broker) {
                $scope.showEmpresas = true;
            }
            var today = new Date();
            $scope.minDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate());
            $scope.maxDate = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                today.getDate());
        };
        var loadEmpresas = function() {
            return Rx.Observable.create(function (observer) {
                var suscription;

                if ($rootScope.role.name == rolesEnum.proveedorCarga){
                    suscription = addPedidoService.getEmpresaCurrentUser().subscribe(
                        function (empresa) {
                            $scope.empresas = [];
                            $scope.pedido.proveedorCarga = empresa;

                            observer.onNext(empresa);
                            observer.onCompleted();
                        },
                        function (e) { observer.onError(e) },
                        function () { }
                    );
                } else {
                    suscription = addPedidoService.getEmpresas().subscribe(
                        function (empresas) {
                            $scope.empresas = empresas;
                            if (empresas.length > 0){
                                //Defaults to first proveedorCarga
                                $scope.pedido.proveedorCarga = empresas[0];
                            }

                            observer.onNext($scope.pedido.proveedorCarga);
                            observer.onCompleted();
                        },
                        function (e) { observer.onError(e) },
                        function () { }
                    );
                }

                return function () {
                    suscription.dispose();
                }
            });
        };
        var loadPlantillas = function(empresa) {
            return Rx.Observable.create(function (observer) {
                var suscription = addPedidoService.getPlantillas(empresa).subscribe(
                    function (plantillas) {
                        $scope.selectablePlantillas = plantillas;
                        observer.onNext(true);
                        observer.onCompleted();
                    },
                    function (e) { observer.onError(e) },
                    function () { }
                );

                return function () {
                    suscription.dispose();
                }
            });
        };
        var loadTransportistas = function(empresa) {
            return Rx.Observable.create(function (observer) {
                if ($rootScope.role.name == rolesEnum.proveedorCarga && empresa.asociados && empresa.asociados.length > 0) {
                    var transportistas = [];
                    addPedidoService.getTransportistas(empresa).subscribe(
                        function (transportista) {
                            transportistas.push(transportista)
                        },
                        function (e) {
                            observer.onError(e)
                        },
                        function () {
                            $scope.transportistas = transportistas;

                            observer.onNext(empresa);
                            observer.onCompleted();
                        }
                    );
                } else if (!empresa.asociadoConTodos && !local.donacion) {
                    $scope.pedido.managedByBroker = true;

                    observer.onNext(empresa);
                    observer.onCompleted();
                } else {
                    $scope.pedido.managedByBroker = false;

                    observer.onNext(empresa);
                    observer.onCompleted();
                }
            });
        };

        //public methods
        $scope.plantillaSelected = function() {
            var temp = $scope.selectablePlantillas.find(function(p){
                return p.id == $scope.selectablePlantilla;
            });
            $scope.pedido = pedidoModel.toJson(temp.object,[{field: "proveedorCarga"}]);
            $scope.pedido.plantilla = undefined;
            $scope.pedido.object = undefined;
            $scope.saveAsPlantilla = false;
            if (local.donacion){
                $scope.pedido.managedByBroker = false;
                $scope.pedido.donacion = true;
            }
        };
        $scope.transportistaSelected = function() {
            var temp = $scope.transportistas.find(function(p){
                return p.id == $scope.selectedTransportista;
            });
            $scope.pedido.transportista = transportistaModel.toJson(temp.object);
        };
        $scope.guardarPedido = function() {
            $scope.processing = true;
            addPedidoService.guardarPedido($scope.pedido,$scope.saveAsPlantilla,$scope.transportistas).subscribe(
                function (pedido) {
                    $scope.processing = false;
                    if (pedido.plantilla){
                        $scope.selectablePlantillas.push(pedido)
                    } else {
                        $mdDialog.hide(pedido);
                    }
                },
                function (e) {
                    console.dir(e);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Ooops!!! parece que estmos experimentando problemas en nuestro servidores por favor contacte a soporte.')
                            .position("top left ")
                            .hideDelay(3000)
                    );
                },
                function () { }
            );
        };
        $scope.eliminarPlantilla = function() {
            //TODO - implementar elimnar plantilla
            alert("Esta funcionalidad esta proxima a desarrollarse!!!");
        };
        $scope.cerrar = function() {
            $mdDialog.hide();
        };
        $scope.calculateValor = function(ev) {
            if ($scope.pedido.ciudadOrigen && $scope.pedido.ciudadDestino && $scope.pedido.peso) {
                //TODO - get valor from ruta
            }
        };

        //init
        $scope.pedido = addPedidoService.getDefaultPedido(local.pedido,local.donacion);
        $scope.dialog = local.scope.addDonacion;
        initializeControls();
        loadEmpresas()
            .flatMap(function(empresa) {
                return loadTransportistas(empresa);
            })
            .flatMap(function(empresa) {
                return loadPlantillas(empresa);
            })
            .subscribe (
                function (success) {
                    console.log("Finish loading form.");
                    $scope.processingForm = false;
                    $scope.$apply();
                },
                function (e) {
                    console.dir(e);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Ooops!!! parece que estmos experimentando problemas en nuestro servidores por favor contacte a soporte.')
                            .position("top left")
                            .hideDelay(5000)
                    );
                    $mdDialog.hide();
                },
                function () { }
            );
    }]);