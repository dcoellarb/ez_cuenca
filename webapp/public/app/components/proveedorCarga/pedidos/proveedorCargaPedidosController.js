/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .controller('proveedorCargaPedidosController',['$rootScope', '$scope', 'uiEventsEnum', 'uiContextEnum', 'proveedorCargaPedidosService','pedidoEstadosEnum','$mdDialog','realtimeChannels',function($rootScope,$scope, uiEventsEnum, uiContextEnum, proveedorCargaPedidosService,pedidoEstadosEnum,$mdDialog,realtimeChannels){

        //members

        //properties
        $scope.pedidosPendientes = [];
        $scope.pedidosEnProceso = [];
        $scope.pedidosCompletados = [];
        $scope.selectedTabIndex = 0;
        $scope.showSetTransportista = false;
        $scope.showCancelPedido = true;

        //private methods
        var loadPedidos = function(){
            proveedorCargaPedidosService.getPedidos().subscribe(function (x) {
                    $scope.pedidosPendientes = x.filter(function(pedido){return pedido.estado == pedidoEstadosEnum.pendiente});
                    $scope.pedidosEnProceso = x.filter(function(pedido){return pedido.estado == pedidoEstadosEnum.activo || pedido.estado == pedidoEstadosEnum.enCurso});
                    $scope.pedidosCompletados = x.filter(function(pedido){return pedido.estado == pedidoEstadosEnum.finalizado;});
                    $scope.$apply();
                },
                function (e) {
                    console.dir(e);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Ooops!!! parece que estamos experimentando problemas en nuestro servidores por favor contacte a soporte.')
                            .position("top left")
                            .hideDelay(5000)
                    );
                },
                function () { }
            );
        }
        //public methods
        $scope.addPedido = function(ev) {
            $mdDialog.show({
                controller: 'addPedidoController',
                templateUrl: 'app/components/shared/pedidos/addPedido/addPedidoView.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(pedido){
                if (pedido){
                    $scope.pedidosPendientes.push(pedido);
                }
            });
        };
        $scope.cancelPedido = function(ev) {
            /*
            $mdDialog.show({
                controller: 'addPedidoController',
                templateUrl: 'app/components/shared/pedidos/addPedido/addPedidoView.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            });
            */
        };
        $scope.iniciarPedido = function() {
        };

        //init
        loadPedidos();

        //suscriptions
        $scope.$on(realtimeChannels.pedidoAsignado, function(event, args){
            loadPedidos();
        });
        $scope.$on(realtimeChannels.pedidoIniciado, function(event, args){
            loadPedidos();
        });
        $scope.$on(realtimeChannels.pedidoFinalizado, function(event, args){
            loadPedidos();
        });

    }]);
