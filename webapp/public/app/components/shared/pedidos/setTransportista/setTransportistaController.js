/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .controller('setTransportistaController',['$rootScope','$scope', 'setTransportistaService','rolesEnum','$mdDialog','$mdToast','pedido',function($rootScope, $scope, setTransportistaService,rolesEnum,$mdDialog,$mdToast,pedido){

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
            setTransportistaService.seleccionarChofer(pedido, chofer).subscribe(
                function (pedido) {
                    $mdDialog.hide(pedido);
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