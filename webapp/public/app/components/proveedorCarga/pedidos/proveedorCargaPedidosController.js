/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .controller('proveedorCargaPedidosController',['$rootScope', '$scope', 'uiEventsEnum', 'uiContextEnum', 'proveedorCargaPedidosService','pedidoEstadosEnum','$mdDialog','realtimeChannels','$mdToast','$http','NgMap',function($rootScope,$scope, uiEventsEnum, uiContextEnum, proveedorCargaPedidosService,pedidoEstadosEnum,$mdDialog,realtimeChannels,$mdToast,$http,NgMap){

        //members

        //properties
        $scope.pedidosPendientes = [];
        $scope.pedidosEnProceso = [];
        $scope.pedidosCompletados = [];
        $scope.selectedTabIndex = 0;
        $scope.showSetTransportista = false;
        $scope.showCancelPedido = true;

        //private methods
        var runSnapToRoad = function(map, locations) {
            var url = "https://roads.googleapis.com/v1/snapToRoads?path=" + locations.join("|") + "&interpolate=true&key=AIzaSyA7ImiLb8lU9DyK0_D-NFFp3zp4ffXL9r0";
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                processSnapToRoadResponse(map, response.data);
            }, function errorCallback(response) {
                console.dir(response);
            });
        }
        var processSnapToRoadResponse = function (map, data) {
            var snappedCoordinates = [];
            var placeIdArray = [];
            for (var i = 0; i < data.snappedPoints.length; i++) {
                var latlng = new google.maps.LatLng(
                    data.snappedPoints[i].location.latitude,
                    data.snappedPoints[i].location.longitude);
                snappedCoordinates.push(latlng);
                placeIdArray.push(data.snappedPoints[i].placeId);
            }
            drawSnappedPolyline(map,snappedCoordinates,placeIdArray);
        };
        var drawSnappedPolyline = function (map,snappedCoordinates,placeIdArray) {
            var polylines = [];
            var snappedPolyline = new google.maps.Polyline({
                path: snappedCoordinates,
                strokeColor: '#1EB2E9',
                strokeWeight: 4
            });
            snappedPolyline.setMap(map);
            polylines.push(snappedPolyline);
        };

        var loadMaps = function(){
            $scope.pedidosEnProceso.forEach(function(e,i,a){
                if (e.estado == pedidoEstadosEnum.enCurso && e.currentLocation){
                    NgMap.getMap(e.id).then(function(m) {
                        var map = m;
                        var image = 'assets/images/truck.png';
                        var marker = new google.maps.Marker({
                            position: {lat: Number(e.currentLocation[0]), lng: Number(e.currentLocation[1])},
                            map: map,
                            icon: image
                        });
                        marker.setMap(map);
                        runSnapToRoad(map, e.locations);
                    });
                }
            })
        }
        var loadPedidos = function(){
            proveedorCargaPedidosService.getPedidos().subscribe(function (pedidos) {
                    pedidos = pedidos.map(function(pedido){
                        if (pedido.donacion) {
                            pedido.cssClass = "pedido-donacion"
                        }else{
                            switch (pedido.estado) {
                                case pedidoEstadosEnum.pendiente:
                                    pedido.cssClass = "pedido-pendientes";
                                    break;
                                case pedidoEstadosEnum.activo:
                                    pedido.cssClass = "pedido-activos";
                                    break;
                                case pedidoEstadosEnum.enCurso:
                                    pedido.cssClass = "pedido-en-curso";
                                    break;
                                case pedidoEstadosEnum.finalizado:
                                    pedido.cssClass = "pedido-completados";
                                    break;
                            }
                        }
                        return pedido;
                    });
                    $scope.pedidosPendientes = pedidos.filter(function(pedido){return pedido.estado == pedidoEstadosEnum.pendiente});
                    $scope.pedidosEnProceso = pedidos.filter(function(pedido){return pedido.estado == pedidoEstadosEnum.activo || pedido.estado == pedidoEstadosEnum.enCurso});
                    $scope.pedidosCompletados = pedidos.filter(function(pedido){return pedido.estado == pedidoEstadosEnum.finalizado;});
                    $scope.$apply();
                    loadMaps();
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
        $scope.addPedido = function(ev, pedido) {
            $mdDialog.show({
                locals:{local:{donacion: false,scope: $scope,pedido: pedido}},
                controller: 'addPedidoController',
                templateUrl: 'app/components/shared/pedidos/addPedido/addPedidoView.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(pedido){
                if (pedido){
                    pedido.cssClass = "pedido-pendientes";
                    $scope.pedidosPendientes.push(pedido);
                }
            });
        };
        $scope.addDonacion = function(ev, pedido) {
            $mdDialog.show({
                locals:{local:{donacion: true,scope: $scope,pedido: pedido}},
                controller: 'addPedidoController',
                templateUrl: 'app/components/shared/pedidos/addPedido/addPedidoView.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(pedido){
                if (pedido){
                    pedido.cssClass = "pedido-donacion";
                    $scope.pedidosPendientes.push(pedido);
                }
            });
        };
        $scope.cancelarPedido = function(id, estado, ev) {
            var confirm = $mdDialog.confirm()
                .title('Estas seguro que quieres cancelar este pedido?')
                .textContent('Esta accion es irreversible.')
                .targetEvent(ev)
                .ok('Estoy seguro')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(function() {
                var pedido;
                if (estado == pedidoEstadosEnum.pendiente) {
                    pedido = $scope.pedidosPendientes.find(function (pedido) { return pedido.id == id})
                }else if (estado == pedidoEstadosEnum.activo) {
                    pedido = $scope.pedidosEnProceso.find(function (pedido) { return pedido.id == id})
                }
                proveedorCargaPedidosService.cancelarPedido(pedido).subscribe(function (x) {
                        if (estado == pedidoEstadosEnum.pendiente) {
                            $scope.pedidosPendientes.splice($scope.pedidosPendientes.indexOf(pedido),1);
                        }else if (estado == pedidoEstadosEnum.activo) {
                            $scope.pedidosEnProceso.splice($scope.pedidosEnProceso.indexOf(pedido),1);
                        }
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
            });
        };
        $scope.openMenu = function($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
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
