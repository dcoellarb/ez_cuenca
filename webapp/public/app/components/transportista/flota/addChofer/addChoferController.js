/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .controller('addChoferController',['$scope', 'addChoferService','$mdDialog','$mdToast','chofer',function($scope, addChoferService, $mdDialog, $mdToast,chofer){

        //members

        //properties

        //private methods

        //public methods
        $scope.guardarChofer = function() {
            $scope.processing = true;
            if (chofer){
                addChoferService.updateChofer($scope.chofer).subscribe(
                    function (chofer) {
                        $scope.processing = false;
                        $mdDialog.hide(chofer);
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
            } else {
                addChoferService.addChofer($scope.chofer).subscribe(
                    function (chofer) {
                        $scope.processing = false;
                        $mdDialog.hide(chofer);
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
            }
        };
        $scope.cerrar = function() {
            $mdDialog.hide();
        };

        //init
        if (chofer){
            $scope.chofer = chofer;
        }else{
            $scope.chofer = {anio: 2000};
        }
        addChoferService.getTransportistaCurrentUser().subscribe(
            function (transportista) {
                $scope.chofer.transportista = transportista;
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
    }]);