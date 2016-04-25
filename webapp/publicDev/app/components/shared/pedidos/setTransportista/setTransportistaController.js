/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .controller('setTransportistaController',['$rootScope','$scope', 'setTransportistaService','rolesEnum','$mdDialog','$mdToast','pedido','$location','pedidoEstadosEnum',function($rootScope, $scope, setTransportistaService,rolesEnum,$mdDialog,$mdToast,pedido,$location,pedidoEstadosEnum){

        //members

        //properties
        $scope.processing = false;

        //private methods
        var loadChoferes = function() {
            return setTransportistaService.getChoferes(pedido);
        };

        //public methods
        $scope.seleccionarChofer = function(id) {

            var chofer = $scope.choferes.find(function(chofer){ return chofer.id == id});
            setTransportistaService.getPedido(pedido)
                .flatMap(function (next) {
                    return setTransportistaService.seleccionarChofer(pedido, chofer);
                })
                .subscribe(
                    function (pedido) {
                        $mdDialog.hide(pedido);
                    },
                    function (e) {
                        console.dir(e);
                        if (e.estado) {
                            var pedido = e;
                            var msg = "Este pedido ya fue tomado y no esta disponible.";
                            if (pedido.estado == pedidoEstadosEnum.cancelado){
                                msg = "Este pedido fue cancelado y ya no esta disponible."
                            }
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent(msg)
                                    .position("top left")
                                    .hideDelay(5000)
                            );
                            $mdDialog.hide(pedido);
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent('Ooops!!! parece que estamos experimentando problemas en nuestro servidores por favor contacte a soporte.')
                                    .position("top left")
                                    .hideDelay(5000)
                            );
                            $mdDialog.hide();
                        }

                    },
                    function () { }
                );
        };
        $scope.verFlota = function() {
            $location.path('/main/transportista/flota');
            $mdDialog.hide();
        };
        $scope.cerrar = function() {
            $mdDialog.hide();
        };

        //init
        loadChoferes()
            .subscribe (
                function (choferes) {
                    $scope.choferes = choferes;
                    $scope.$apply();
                    console.log("Finish loading form.");
                },
                function (e) {
                    console.dir(e);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Ooops!!! parece que estamos experimentando problemas en nuestro servidores por favor contacte a soporte.')
                            .position("top left")
                            .hideDelay(5000)
                    );
                    $mdDialog.hide();
                },
                function () { }
            );
    }]);