/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .controller('transportistaFlotaController',['$scope', 'transportistaFlotaService','$mdDialog','$mdToast',function($scope, transportistaFlotaService, $mdDialog, $mdToast){

        //members

        //properties
        $scope.hideFlotaListHeader = true;

        //private methods
        var loadChoferes = function() {
            return transportistaFlotaService.getChoferes();
        };

        //public methods
        $scope.addChofer = function(ev){
            $mdDialog.show({
                locals:{chofer: undefined},
                controller: 'addChoferController',
                templateUrl: 'app/components/transportista/flota/addChofer/addChoferView.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(chofer){
                if (chofer){
                    $scope.choferes.push(chofer);
                    $scope.choferes.sort(function(a,b){ return a.nombre > b.nombre});
                    $scope.$apply();
                }
            });
        };
        $scope.editarChofer = function(id,ev){
            var chofer = $scope.choferes.find(function(chofer){ return chofer.id == id; });
            $mdDialog.show({
                locals:{chofer: chofer},
                controller: 'addChoferController',
                templateUrl: 'app/components/transportista/flota/addChofer/addChoferView.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(chofer){
                if (chofer) {
                    $scope.choferes.sort(function (a, b) {return a.nombre > b.nombre});
                    $scope.$apply();
                }
            });
        };
        $scope.eliminarChofer = function(id,ev){
            var chofer = $scope.choferes.find(function(chofer){ return chofer.id == id; });
            var confirm = $mdDialog.confirm()
                .title('Confirmar')
                .textContent('Estas seguro de querer eliminar este transportista, esta accion es irreversible.')
                .targetEvent(ev)
                .ok('Si estoy seguro')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(function() {
                transportistaFlotaService.eliminarChofer(chofer).subscribe(
                    function (chofer) {
                        $scope.choferes.splice($scope.choferes.indexOf(chofer),1);
                        $scope.choferes.sort(function(a,b){ return a.nombre > b.nombre});
                        $scope.$apply();
                    },
                    function (e) {
                        console.dir(e);
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Ooops!!! parece que estmos experimentando problemas en nuestro servidores por favor contacte a soporte.')
                                .position("top left ")
                                .hideDelay(5000)
                        );
                    },
                    function () { }
                );
            }, function() {});
        };

        //init
        loadChoferes()
            .subscribe (
            function (choferes) {
                $scope.choferes = choferes;
                $scope.choferes.sort(function(a,b){ return a.nombre > b.nombre});
                $scope.$apply();
            },
            function (e) {
                if (err.code == 119){
                    $location.path('/home');
                    $location.replace();
                } else {
                    console.dir(e);
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
    }]);