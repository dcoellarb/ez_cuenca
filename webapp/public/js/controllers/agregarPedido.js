/**
 * Created by dcoellar on 9/15/15.
 */

/**
 * Created by dcoellar on 9/14/15.
 */
(function(){

    angular.module("easyRuta")
        .controller('AgregarPedidoController',function($scope){

            /*
            * Setup hora max carga date picker
            * */
            $scope.horaMaxCargaOpen = function($event) {
                $scope.horaMaxCargaStatus.opened = true;
            };
            $scope.horaMaxCargaStatus = {
                opened: false
            };

            /*
             * Setup hora max carga date picker
             * */
            $scope.horaMaxDescargaOpen = function($event) {
                $scope.horaMaxDescargaStatus.opened = true;
            };
            $scope.horaMaxDescargaStatus = {
                opened: false
            };

        });

})();