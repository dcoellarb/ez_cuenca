/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .controller('transportistaPedidosController',['$rootScope', '$scope', 'uiEventsEnum', 'uiContextEnum', 'transportistaPedidosService','pedidoEstadosEnum','$mdDialog','pedidoEstadosEnum','realtimeChannels',function($rootScope,$scope, uiEventsEnum, uiContextEnum, transportistaPedidosService,pedidoEstadosEnum,$mdDialog,pedidoEstadosEnum,realtimeChannels){

        //members

        //properties
        $scope.pedidosPendientes = [];
        $scope.pedidosEnProceso = [];
        $scope.pedidosCompletados = [];
        $scope.selectedTabIndex = 0;

        //private methods
        var loadPedidos = function() {
            transportistaPedidosService.getPedidos().subscribe(function (x) {
                    $scope.pedidosPendientes = x.filter(function(pedido){return pedido.estado == pedidoEstadosEnum.pendiente});
                    $scope.pedidosEnProceso = x.filter(function(pedido){return pedido.estado == pedidoEstadosEnum.activo || pedido.estado == pedidoEstadosEnum.enCurso});
                    $scope.pedidosCompletados = x.filter(function(pedido){return pedido.estado == pedidoEstadosEnum.finalizado});
                    $scope.$apply();
                },
                function (err) {
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
        };
        var actualizarPedido = function(pedido, estado, text, ev) {
            $mdDialog.show({
                locals:{text: text},
                controller: 'progressViewController',
                templateUrl: 'app/components/shared/progressIndicator/progressIndicatorView.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false
            });

            transportistaPedidosService.actualizarViaje(pedido,estado).subscribe(function (pedido_actualizado) {
                    $mdDialog.hide();
                    if (estado == pedidoEstadosEnum.enCurso){
                        $scope.pedidosEnProceso.splice($scope.pedidosEnProceso.indexOf(pedido),1)
                        $scope.pedidosEnProceso.push(pedido_actualizado);
                        $scope.pedidosEnProceso.sort(function(a, b){return a.createdAt < b.createdAt});
                    }
                    if (estado == pedidoEstadosEnum.finalizado){
                        $scope.pedidosEnProceso.splice($scope.pedidosEnProceso.indexOf(pedido),1)
                        $scope.pedidosCompletados.push(pedido_actualizado);
                        $scope.pedidosCompletados.sort(function(a, b){return a.createdAt < b.createdAt});
                    }
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
        }

        //public methods
        $scope.setTransportista = function(id, ev) {
            var pedido = $scope.pedidosPendientes.find(function(pedido){ return pedido.id == id});
            $mdDialog.show({
                locals:{pedido: pedido},
                controller: 'setTransportistaController',
                templateUrl: 'app/components/shared/pedidos/setTransportista/setTransportistaView.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(pedido){
                if (pedido) {
                    $scope.pedidosPendientes.splice($scope.pedidosPendientes.indexOf(pedido),1)
                    $scope.pedidosEnProceso.push(pedido);
                    $scope.pedidosEnProceso.sort(function(a, b){return a.createdAt < b.createdAt});
                }
            });
        };
        $scope.openMenu = function($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        };
        $scope.iniciarViaje = function(id, ev){
            var pedido = $scope.pedidosEnProceso.find(function(pedido){ return pedido.id == id});
            actualizarPedido(pedido,pedidoEstadosEnum.enCurso,"Inciando Viaje...", ev);
        };
        $scope.finalizarViaje = function(id, ev){
            var pedido = $scope.pedidosEnProceso.find(function(pedido){ return pedido.id == id});
            actualizarPedido(pedido,pedidoEstadosEnum.finalizado,"Finalizando Viaje...", ev);
        };

        //init
        loadPedidos();

        //suscriptions
        $scope.$on(realtimeChannels.pedidoCreado, function(event, args){
            loadPedidos();
        });
        $scope.$on(realtimeChannels.pedidoAsignado, function(event, args){
            loadPedidos();
        });
    }]);
