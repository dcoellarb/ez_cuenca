/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .controller("sidenavController",['$rootScope','$scope','$location','$mdSidenav','rolesEnum',function($rootScope,$scope,$location,$mdSidenav,rolesEnum){

        //properties
        $scope.showInicio = true;
        $scope.showPedidos = true;
        $scope.showRutas = true;
        $scope.showFlota = true;
        $scope.disabledInicio = false;
        $scope.disabledPedidos = false;
        $scope.disabledRutas = true;
        $scope.disabledFlota = false;

        //public methods
        $scope.inicio = function(){
            switch ($rootScope.role.name){
                case rolesEnum.proveedorCarga:
                    $location.path('/main/proveedorCarga');
                    $mdSidenav('sidenav-left').close()
                    break;
                case rolesEnum.transportista:
                    $location.path('/main/transportista');
                    $mdSidenav('sidenav-left').close()
                    break;
            }
        };
        $scope.pedidos = function() {
            switch ($rootScope.role.name){
                case rolesEnum.proveedorCarga:
                    $location.path('/main/proveedorCarga/pedidos');
                    $mdSidenav('sidenav-left').close()
                    break;
                case rolesEnum.transportista:
                    $location.path('/main/transportista/pedidos');
                    $mdSidenav('sidenav-left').close()
                    break;
            }
        };
        $scope.rutas = function() {
        };
        $scope.flota = function() {
            switch ($rootScope.role.name){
                case rolesEnum.proveedorCarga:
                    break;
                case rolesEnum.transportista:
                    $location.path('/main/transportista/flota');
                    $mdSidenav('sidenav-left').close()
                    break;
            }
        };

        //subscriptions

        //init
        if ($rootScope.role && $rootScope.role.name == rolesEnum.proveedorCarga){
            $scope.disabledFlota = true;
        }
    }]);
