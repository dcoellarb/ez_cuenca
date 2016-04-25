/**
 * Created by dcoellar on 9/14/15.
 */

//ngRoute
angular.module("easyRuta",['ui.router','ngMaterial','ngMaterialDatePicker','ngMessages','ngMap','LocalStorageModule','ez-Data','ez-RealTime'])
    .constant('collectionsEnum',{
        role:'_Role',
        user:'_User',
        proveedorCarga:'ProveedorCarga',
        proveedorCargaRutas:'ProveedorCargaRutas',
        transportista:'Transportista',
        transportistaRutas:'transportistaRutas',
        chofer:'Chofer',
        pedido:'Pedido',
        broker:'Broker',
        notificacion: 'Notificacion'
    })
    .constant('pedidoEstadosEnum',{
        pendiente:'Pendiente',
        activo:'Activo',
        enCurso:'EnCurso',
        finalizado:'Finalizado',
        cancelado:'Cancelado'
    })
    .constant('choferEstadosEnum',{
        disponible:'Disponible',
        enViaje:'EnViaje',
        deshabilitado:'Deshabilitado'
    })
    .constant('uiEventsEnum',{
        pedidosTabChanged:'pedidosTabChanged'
    })
    .constant('uiContextEnum',{
        proveedorCargaPedidos:'proveedorCargaPedidos'
    })
    .constant('rolesEnum',{
        proveedorCarga:'proveedorCarga',
        broker:'broker',
        transportista:'transportista',
        chofer:'chofer'
    })
    .constant('localStorageKeys',{
        role:'role',
        proveedorCarga:'proveedorCarga',
        broker:'broker',
        transportista:'transportista'
    })
    .constant('realtimeChannels',{
        pedidoCreado: "pedidoCreado",
        pedidoAsignado: "pedidoAsignado",
        pedidoIniciado: "pedidoIniciado",
        pedidoFinalizado: "pedidoFinalizado",
        pedidoCancelado: "pedidoCancelado"
    });

/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .config(['dataServiceProvider',function(dataServiceProvider) {
        dataServiceProvider.initialize("wJjWR5KTriUoPNnDH3baAQMkWvpAhuFhNU7PsKOP", "qpl5kH3ylsBswrTqljtlx8S6iOZgjH3o2rGDeLgG");//PROD
        //dataServiceProvider.initialize("2hLYHTAUJ9QXMWxQTXsOIZ2jXJLGtMauw2QN34fE", "xSiGu1HbOBQvzcd7ItdgGGyMq2IcpvKmCAFjhY2T");//QA
    }]);
/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .config(['localStorageServiceProvider',function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('easyRuta')
            .setStorageType('sessionStorage')
    }]);

/**
 * Created by dcoellar on 9/14/15.
 */

angular.module("easyRuta")
    .config(['$mdThemingProvider',function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('amber');
    }])
    .config(['$mdThemingProvider',function($mdThemingProvider) {
        $mdThemingProvider.theme('dark')
            .dark();
    }]);

/**
 * Created by dcoellar on 4/11/16.
 */

var createBoundedWrapper = function (object, method) {
    return function() {
        return method.apply(object, arguments);
    };
};

angular.module("easyRuta")
    .config(['realtimeServiceProvider',function(realtimeServiceProvider) {
        var uuid = PUBNUB.db.get('session') || (function(){
            var uuid = PUBNUB.uuid();
            PUBNUB.db.set('session', uuid);
            return uuid;
        })();

        //realtimeServiceProvider.initialize('pub-c-ecec5777-242f-4a3e-8689-9b272441bb11', 'sub-c-5327f6bc-60c6-11e5-b0b1-0619f8945a4f', uuid);//PROD
        realtimeServiceProvider.initialize('pub-c-dbd199d2-5422-4ef9-95ac-5565e99d8036', 'sub-c-5fda96b4-7848-11e5-b539-0619f8945a4f', uuid);//QA
    }])
    .run(['$rootScope','realtimeService','realtimeChannels',function($rootScope, realtimeService, realtimeChannels) {
        for(c in realtimeChannels){
            var subscribe = {
                channel : c,
                presence : function(m){
                    if (m.uuid != realtimeService.uuid){
                        $rootScope.$broadcast('presense_' + this.channel, m);
                    }
                },
                message : function(m){
                    if (m.uuid != realtimeService.uuid){
                        $rootScope.$broadcast(this.channel, m);
                    }
                }
            };
            subscribe.presence = createBoundedWrapper(subscribe,subscribe.presence);
            subscribe.message = createBoundedWrapper(subscribe,subscribe.message);
            realtimeService.pubnub.subscribe(subscribe);
        }
    }]);
/**
 * Created by dcoellar on 9/14/15.
 */

angular.module("easyRuta")
    .config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state('public', {
                url: "/home",
                templateUrl: "/app/components/shared/home/homeView.html"
            })
            .state('private', {
                url: "/main",
                templateUrl: "/app/components/shared/master/masterView.html",
            })
            .state('private.proveedorCarga', {
                url: "/proveedorCarga",
                templateUrl: '/app/components/proveedorCarga/pedidos/proveedorCargaPedidosView.html'
            })
            .state('private.transportista', {
                url: "/transportista",
                templateUrl: '/app/components/transportista/pedidos/transportistaPedidosView.html'
            })
            .state('private.proveedorCarga-pedidos', {
                url: "/proveedorCarga/pedidos",
                templateUrl: '/app/components/proveedorCarga/pedidos/proveedorCargaPedidosView.html'
            })
            .state('private.transportista-pedidos', {
                url: "/transportista/pedidos",
                templateUrl: '/app/components/transportista/pedidos/transportistaPedidosView.html'
            })
            .state('private.transportista-flota', {
                url: "/transportista/flota",
                templateUrl: '/app/components/transportista/flota/transportistaFlotaView.html'
            });
    }])
    .run(['$rootScope','dataService','$location','localStorageService','localStorageKeys',function($rootScope, dataService, $location, localStorageService,localStorageKeys){
        var validateRoute = function(){
            if (!dataService.currentUser() && $location.path().indexOf('/main') >= 0) {
                //$location.path('/home');
                //$location.replace();
            } else if (dataService.currentUser()) {
                if (!$rootScope.role){
                    $rootScope.role = JSON.parse(localStorageService.get(localStorageKeys.role));
                    $rootScope.proveedorCarga = JSON.parse(localStorageService.get(localStorageKeys.proveedorCarga));
                    $rootScope.transportista = JSON.parse(localStorageService.get(localStorageKeys.transportista));
                    $rootScope.broker = JSON.parse(localStorageService.get(localStorageKeys.broker));
                    if (!$rootScope.role){
                        $location.path('/home');
                        $location.replace();
                    }
                }
            }
        };
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
            //event.preventDefault();
            validateRoute();
        });
        validateRoute();
    }]);

/*
angular.module("easyRuta")
    .config(['$routeProvider',function($routeProvider){
        $routeProvider
            .when('/proveedorCarga',{
                templateUrl : '/app/components/proveedorCarga/pedidos/proveedorCargaPedidosView.html'
            })
            .when('/transportista',{
                templateUrl : '/app/components/transportista/pedidos/transportistaPedidosView.html'
            })
            .when('/proveedorCarga/pedidos',{
                templateUrl : '/app/components/proveedorCarga/pedidos/proveedorCargaPedidosView.html'
            })
            .when('/transportista/pedidos',{
                templateUrl : '/app/components/transportista/pedidos/transportistaPedidosView.html'
            })
            .when('/transportista/flota',{
                templateUrl : '/app/components/transportista/flota/transportistaFlotaView.html'
            })
            .when('/detallePedido/:id',{
                templateUrl : '/templates/pages/detalle_pedido.html'
            });
    }])
    .run(['$rootScope','dataService','$window','localStorageService','localStorageKeys',function($rootScope,dataService, $window, localStorageService,localStorageKeys){
        var validateRoute = function(){
            var u = dataService.currentUser();
            if (!dataService.currentUser()) {
                console.log("user not login")
                //$window.location.href = "http://easyruta.parseapp.com/modules/login/index.html";
            }else{
                console.log("user login")
                if (!$rootScope.role){
                    $rootScope.role = JSON.parse(localStorageService.get(localStorageKeys.role));
                    $rootScope.proveedorCarga = JSON.parse(localStorageService.get(localStorageKeys.proveedorCarga));
                    $rootScope.transportista = JSON.parse(localStorageService.get(localStorageKeys.transportista));
                    $rootScope.broker = JSON.parse(localStorageService.get(localStorageKeys.broker));
                    if (!$rootScope.role){
                        //$window.location.href = "http://easyruta.parseapp.com/modules/login/index.html";
                    }
                }
            }
        }
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            validateRoute();
        });
        validateRoute();
    }]);
*/
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
                    }
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

/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .service('proveedorCargaPedidosService',['collectionsEnum','dataService','pedidoModel','pedidoEstadosEnum','realtimeService','realtimeChannels','choferModel','choferEstadosEnum',function(collectionsEnum,dataService,pedidoModel,pedidoEstadosEnum,realtimeService,realtimeChannels,choferModel,choferEstadosEnum){

        //private methods

        return {
            //public methods
            getPedidos: function() {
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.getAll(collectionsEnum.pedido,{filters:[{type:"and",operator:"=",field:"plantilla",value:undefined}],includes:["proveedorCarga","transportista","chofer"]}).subscribe(
                        function (pedidos) {
                            observer.onNext(pedidos.map(function(pedido){
                                return pedidoModel.toJson(pedido,[{field:"proveedorCarga"},{field:"transportista"},{field:"chofer"}]);
                            }));
                            observer.onCompleted();
                        },
                        function (e) { observer.onError(e) },
                        function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            },
            cancelarPedido: function(pedido) {
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.update(collectionsEnum.pedido,pedidoModel.fromJson(pedido),{updatedFields:[{operator:"set",field:"estado",value:pedidoEstadosEnum.cancelado}]})
                        .flatMap(function(p){
                            var chofer = pedido.chofer
                            pedido = p;
                            if (chofer){
                                return dataService.update(collectionsEnum.chofer,choferModel.fromJson(chofer),{updatedFields: [{operator: "set", field: "estado", value: choferEstadosEnum.disponible}]});
                            }else{
                                return Rx.Observable.just(undefined);
                            }
                        })
                        .subscribe(
                        function (c) {
                            realtimeService.publish(realtimeChannels.pedidoCancelado,{id:pedido.id});

                            observer.onNext(pedidoModel.toJson(pedido,[{field:"proveedorCarga"},{field:"transportista"},{field:"chofer"}]));
                            observer.onCompleted();
                        },
                        function (e) { observer.onError(e) },
                        function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            }

        }
    }]);

/**
 * Created by dcoellar on 4/24/16.
 */

angular.module("easyRuta")
    .service("loginService", ['$rootScope','localStorageService','dataService',function($rootScope,localStorageService, dataService){
        return {
            //public methods
            login: function(username, password){
                return Rx.Observable.create(function (observer) {
                    if (Parse.User.current()) {
                        dataService.logout();
                    }
                    dataService.login(username, password)
                        .flatMap(function(user) {
                            return dataService.getAll('_Role',{filters:[{type:"and",operator:"=",field:'users',value:user}]});
                        }).flatMap(function(roles){
                            $rootScope.role = {id: roles[0].id,name: roles[0].getName()};
                            localStorageService.set("role", JSON.stringify($rootScope.role));
                            switch (roles[0].getName()){
                                case "proveedorCarga":
                                    return dataService.getAll('ProveedorCarga',{filters:[{type:"and",operator:"=",field:'user',value:dataService.currentUser()}]})
                                        .flatMap(function(proveedoresCarga){
                                            $rootScope.proveedorCarga = {id:proveedoresCarga[0].id};
                                            localStorageService.set("proveedorCarga", JSON.stringify($rootScope.proveedorCarga));
                                            //return Rx.Observable.just('http://easyruta.parseapp.com/#/proveedorCarga');
                                            return Rx.Observable.just('/main/proveedorCarga');
                                        });
                                    break;
                                case "transportista":
                                    return dataService.getAll('Transportista',{filters:[{type:"and",operator:"=",field:'user',value:dataService.currentUser()}]})
                                        .flatMap(function(transportistas){
                                            $rootScope.transportista = {id:transportistas[0].id};
                                            localStorageService.set("transportista", JSON.stringify($rootScope.transportista));
                                            return Rx.Observable.just('/main/transportista');
                                        });
                                    break;
                            }
                        }).subscribe(
                        function (n) {
                            observer.onNext(n)
                        },
                        function (e) {
                            observer.onError(e)
                        },
                        function () {
                            observer.onCompleted()
                        }
                    );
                });
            }
        }
    }])
    .service("registrarProveedorService", ['$rootScope','localStorageService','dataService',function($rootScope, localStorageService, dataService){
        return {
            //public methods
            registrar: function(proveedorCarga){
                return Rx.Observable.create(function (observer) {
                    if (Parse.User.current()) {
                        dataService.logout();
                    }
                    var user;
                    var role;
                    dataService.signup(proveedorCarga.email, proveedorCarga.email, proveedorCarga.password)
                        .flatMap(function(u) {
                            user = u;
                            return dataService.getAll('_Role',{filters:[{type:"and",operator:"=",field:'name',value:"proveedorCarga"}]});
                        }).flatMap(function(roles){
                            role = roles[0];
                            role.getUsers().add(user);
                            return dataService.update('_Role',role,{});
                        }).flatMap(function(r){
                            var acl = {
                                currentUser: true,
                                permissions: [
                                    {isRole: true, role: "broker", id: undefined, allowRead: true, allowWrite: false},
                                    {isRole: true, role: "chofer", id: undefined, allowRead: true, allowWrite: false},
                                    {isRole: true, role: "proveedorCarga", id: undefined, allowRead: true, allowWrite: false},
                                    {isRole: true, role: "transportista", id: undefined, allowRead: true, allowWrite: false}
                                ]
                            };
                            var p = dataService.createCollection('ProveedorCarga');
                            p.set("nombre", proveedorCarga.nombre);
                            p.set("telefono", proveedorCarga.telefono);
                            p.set("contacto", proveedorCarga.contacto);
                            p.set("asociadoConTodos", true);
                            p.set("user", user);
                            return dataService.add('ProveedorCarga',p,{acl: acl});
                        }).subscribe(
                        function (p) {
                            $rootScope.role = {id: role.id,name: role.getName()};
                            localStorageService.set("role", JSON.stringify($rootScope.role));
                            $rootScope.proveedorCarga = {id:p.id};
                            localStorageService.set("proveedorCarga", JSON.stringify($rootScope.proveedorCarga));
                            observer.onNext(p)
                        },
                        function (e) {
                            observer.onError(e)
                        },
                        function () {
                            observer.onCompleted()
                        }
                    );
                });
            }
        }
    }])
    .service("registrarTransportistaService", ['$rootScope','localStorageService','dataService',function($rootScope, localStorageService, dataService){
        return {
            //public methods
            registrar: function(transportista){
                return Rx.Observable.create(function (observer) {
                    if (Parse.User.current()) {
                        dataService.logout();
                    }
                    var user;
                    var role;
                    dataService.signup(transportista.email, transportista.email, transportista.password)
                        .flatMap(function(u) {
                            user = u;
                            return dataService.getAll('_Role',{filters:[{type:"and",operator:"=",field:'name',value:"transportista"}]});
                        }).flatMap(function(roles){
                            role = roles[0];
                            role.getUsers().add(user);
                            return dataService.update('_Role',role,{});
                        }).flatMap(function(r){
                            var acl = {
                                currentUser: true,
                                permissions: [
                                    {isRole: true, role: "broker", id: undefined, allowRead: true, allowWrite: false},
                                    {isRole: true, role: "chofer", id: undefined, allowRead: true, allowWrite: false},
                                    {isRole: true, role: "proveedorCarga", id: undefined, allowRead: true, allowWrite: false},
                                    {isRole: true, role: "transportista", id: undefined, allowRead: true, allowWrite: false}
                                ]
                            };
                            var t = dataService.createCollection('Transportista');
                            t.set("nombre", transportista.nombre);
                            t.set("saldo", 1000);
                            t.set("saldoMinimo", 0);
                            t.set("user", user);
                            return dataService.add('Transportista',t,{acl: acl});
                        }).subscribe(
                        function (t) {
                            $rootScope.role = {id: role.id,name: role.getName()};
                            localStorageService.set("role", JSON.stringify($rootScope.role));
                            $rootScope.transportista = {id:t.id};
                            localStorageService.set("transportista", JSON.stringify($rootScope.transportista));
                            observer.onNext(t)
                        },
                        function (e) {
                            observer.onError(e)
                        },
                        function () {
                            observer.onCompleted()
                        }
                    );
                });
            }
        }
    }])
    .service("registrarChoferService", ['dataService',function(dataService){
        return {
            //public methods
            registrar: function(proveedorCarga){
                return Rx.Observable.create(function (observer) {
                    if (Parse.User.current()) {
                        dataService.logout();
                    }
                    var user;
                    var role;
                    dataService.signup(proveedorCarga.email, proveedorCarga.email, proveedorCarga.password)
                        .flatMap(function(u) {
                            user = u;
                            return dataService.getAll('_Role',{filters:[{type:"and",operator:"=",field:'name',value:"proveedorCarga"}]});
                        }).flatMap(function(roles){
                            role = roles[0];
                            role.getUsers().add(user);
                            return dataService.update('_Role',role,{});
                        }).flatMap(function(r){
                            var acl = {
                                currentUser: true,
                                permissions: [
                                    {isRole: true, role: "broker", id: undefined, allowRead: true, allowWrite: false},
                                    {isRole: true, role: "chofer", id: undefined, allowRead: true, allowWrite: false},
                                    {isRole: true, role: "proveedorCarga", id: undefined, allowRead: true, allowWrite: false},
                                    {isRole: true, role: "transportista", id: undefined, allowRead: true, allowWrite: false}
                                ]
                            };
                            var p = dataService.createCollection('ProveedorCarga');
                            p.set("nombre", proveedorCarga.nombre);
                            p.set("telefono", proveedorCarga.telefono);
                            p.set("contacto", proveedorCarga.contacto);
                            p.set("asociadoConTodos", true);
                            p.set("user", user);
                            return dataService.add('ProveedorCarga',p,{acl: acl});
                        }).subscribe(
                        function (c) {
                            observer.onNext(c)
                        },
                        function (e) {
                            observer.onError(e)
                        },
                        function () {
                            observer.onCompleted()
                        }
                    );
                });
            }
        }
    }])
    .controller('homeController',['$scope','$location','$mdDialog',function($scope,$location,$mdDialog){

        //properties
        $scope.user = {username : "", password :""};
        $scope.showError = false;
        $scope.error = "";
        $scope.processing = false;

        //public methods
        $scope.login = function(ev){
            $mdDialog.show({
                controller: 'LoginController',
                templateUrl: 'app/components/shared/home/login.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(url) {
                $location.path(url)
            });
        };
        $scope.registroProveedorCarga = function(ev){
            $mdDialog.show({
                controller: 'registroProveedorCargaController',
                templateUrl: 'app/components/shared/home/registroProveedorCarga.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(url) {
                $location.path(url);
                //$window.location.href = url;
            });
        };
        $scope.registroTransportista = function(ev){
            $mdDialog.show({
                controller: 'registroTransportistaController',
                templateUrl: 'app/components/shared/home/registroTransportista.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(url) {
                $location.path(url)
            });
        };
        $scope.registroChofer = function(ev){
            //TODO - show temporalmente deshabilita mientras se publica la app
            /*
             $mdDialog.show({
             controller: 'registroChoferController',
             templateUrl: 'registroChofer.html',
             parent: angular.element(document.body),
             targetEvent: ev,
             clickOutsideToClose:true
             }).then(function() {
             //TODO - show message ask them to download the app
             });
             */
        };
    }])
    .controller('registroProveedorCargaController',['$scope','registrarProveedorService','$mdDialog',function($scope,registrarProveedorService,$mdDialog) {
        //properties
        $scope.proveedorCarga = {};
        $scope.showError = false;
        $scope.error = "";
        $scope.processing = false;

        //public methods
        $scope.registrar = function() {
            $scope.processing = true;
            registrarProveedorService.registrar($scope.proveedorCarga).subscribe(
                function (p) {
                    $scope.processing = false;
                    $mdDialog.hide('/main/proveedorCarga');
                },
                function (e) {
                    $scope.processing = false;
                    $scope.showError = true;

                    if (e.code == 101) {
                        $scope.error = "Usuario y/o clave incorrectos.";
                        $scope.$apply()
                    } else if (e.code == 125) {
                        $scope.error = "Email es invalido.";
                        $scope.$apply()
                    } else if (e.code == 202) {
                        $scope.error = "Ya existe un usuario con ese email.";
                        $scope.$apply()
                    } else {
                        $scope.error = "Servicio no disponible, contacte a soporte.";
                        $scope.$apply()
                        throw e;
                    }
                },
                function () {}
            );
        }
    }])
    .controller('registroTransportistaController',['$scope','registrarTransportistaService','$mdDialog',function($scope,registrarTransportistaService,$mdDialog) {
        //properties
        $scope.transportista = {};
        $scope.showError = false;
        $scope.error = "";
        $scope.processing = false;

        //public methods
        $scope.registrar = function() {
            $scope.processing = true;
            registrarTransportistaService.registrar($scope.transportista).subscribe(
                function (p) {
                    $scope.processing = false;
                    $mdDialog.hide('/main/transportista');
                },
                function (e) {
                    $scope.processing = false;
                    $scope.showError = true;

                    if (e.code == 101) {
                        $scope.error = "Usuario y/o clave incorrectos.";
                        $scope.$apply()
                    } else if (e.code == 125) {
                        $scope.error = "Email es invalido.";
                        $scope.$apply()
                    } else if (e.code == 202) {
                        $scope.error = "Ya existe un usuario con ese email.";
                        $scope.$apply()
                    } else {
                        $scope.error = "Servicio no disponible, contacte a soporte.";
                        $scope.$apply()
                        throw e;
                    }
                },
                function () {}
            );
        }
    }])
    .controller('registroChoferController',['$scope','registrarChoferService','$mdDialog',function($rootScope,$scope,$mdDialog) {
        //properties
        $scope.chofer = {};
        $scope.showError = false;
        $scope.error = "";
        $scope.processing = false;

        //public methods
        $scope.registrar = function() {
            $scope.processing = true;
            registrarChoferService.registrar($scope.chofer).subscribe(
                function (c) {
                    $scope.processing = false;
                    $mdDialog.hide(true);
                },
                function (e) {
                    $scope.processing = false;
                    $scope.showError = true;

                    //125 invalid email address
                    //202 username dc@dc.com already taken
                    if (e.code == 101){
                        $scope.error = "Usuario y/o clave incorrectos."
                        $scope.$apply()
                    } else {
                        $scope.error = "Servicio no disponible, contacte a soporte."
                        $scope.$apply()
                        throw e;
                    }
                },
                function () {}
            );
        }
    }])
    .controller('LoginController',['$scope','loginService','$mdDialog',function($scope,loginService,$mdDialog){

        //properties
        $scope.user = {username : "", password :""};
        $scope.showError = false;
        $scope.error = "";
        $scope.processing = false

        //public methods
        $scope.login = function() {
            $scope.processing = true;
            loginService.login($scope.user.username, $scope.user.password).subscribe(
                function (n) {
                    $scope.processing = false;
                    $mdDialog.hide(n);
                },
                function (e) {
                    $scope.processing = false;

                    $scope.showError = true;

                    if (e.code == 101){
                        $scope.error = "Usuario y/o clave incorrectos."
                        $scope.$apply()

                    } else {
                        $scope.error = "Servicio no disponible, contacte a soporte."
                        $scope.$apply()

                        throw e;
                    }
                },
                function () {}
            );
        }
    }]);

/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .controller("headerController",['$scope','$location','dataService','$mdSidenav',function($scope,$location,dataService,$mdSidenav){

        //properties

        //public methods
        $scope.logout = function(){
            dataService.logout().subscribe(
                function () {
                    $location.path("/home");
                },
                function (e) { },
                function () { }
            );
        };
        $scope.toggleLeft = function() {
            $mdSidenav("sidenav-left")
                .toggle();
        };

        //subscriptions

        //init
    }]);

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
            var valid = true;
            if ($scope.saveAsPlantilla) {
                if ($scope.selectablePlantillas.find( function(p) { return p.plantilla == $scope.pedido.plantilla })){
                    valid = false;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Ya existe una plantilla con ese nombre por favor seecione uno diferente.')
                            .position("top right ")
                            .hideDelay(5000)
                    );
                }
            }

            if (valid) {
                $scope.processing = true;
                addPedidoService.guardarPedido($scope.pedido,$scope.saveAsPlantilla,$scope.transportistas).subscribe(
                    function (pedido) {
                        $scope.processing = false;
                        if (pedido.plantilla){
                            $scope.selectablePlantillas.push(pedido);
                            $scope.pedido.plantilla = undefined
                            $scope.saveAsPlantilla = false
                            $scope.$apply();

                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent('La Plantilla fue guardada y esta lista para usarse.')
                                    .position("bottom right ")
                                    .hideDelay(5000)
                            );
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
                                .hideDelay(5000)
                        );
                    },
                    function () { }
                );
            }
        };
        $scope.eliminarPlantilla = function() {
            var pedido = $scope.selectablePlantillas.find(function(p){
                return p.id == $scope.selectablePlantilla;
            });
            if (pedido && pedido.plantilla){
                $scope.processingEliminarPlantilla = true
                addPedidoService.eliminarPlantilla(pedido).subscribe(
                    function (pedido) {
                        $scope.processingEliminarPlantilla = false;
                        $scope.selectablePlantilla = undefined;
                        var temp = $scope.selectablePlantillas.find(function(plantilla){ return plantilla.id == pedido.id;});
                        var i = $scope.selectablePlantillas.indexOf(temp);
                        if (i >= 0){
                            $scope.selectablePlantillas.splice(i,1);
                        }
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
            }
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
/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .service('addPedidoService',['$rootScope','collectionsEnum','proveedorCargaModel','pedidoModel','transportistaModel','dataService','realtimeService','pedidoEstadosEnum','rolesEnum','realtimeChannels',function($rootScope,collectionsEnum,proveedorCargaModel,pedidoModel,transportistaModel,dataService,realtimeService,pedidoEstadosEnum,rolesEnum,realtimeChannels){

        //private methods

        return {
            //public methods
            getEmpresaCurrentUser: function(){
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.get(collectionsEnum.proveedorCarga,{id: $rootScope.proveedorCarga.id}).subscribe(
                        function (proveedorCarga) {
                            observer.onNext(proveedorCargaModel.toJson(proveedorCarga));
                            observer.onCompleted();
                        },
                        function (e) { observer.onError(e) },
                        function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            },
            getEmpresas: function(){
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.getAll(collectionsEnum.proveedorCarga,undefined).subscribe(
                        function (proveedoresCarga) {
                            observer.onNext(proveedoresCarga.map(function(proveedorCarga){
                                return proveedorCargaModel.toJson(proveedorCarga);
                            }));
                            observer.onCompleted();
                        },
                        function (e) { observer.onError(e) },
                        function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            },
            getPlantillas: function(empresa) {
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.getAll(collectionsEnum.pedido,{filters:[{type:"and",operator:"!=",field:"plantilla",value:undefined},{type:"and",operator:"=",field:"proveedorCarga",value:empresa.object}]}).subscribe(
                        function (plantillas) {
                            observer.onNext(plantillas.map(function(plantilla){
                                return pedidoModel.toJson(plantilla);
                            }));
                            observer.onCompleted();
                        },
                        function (e) { observer.onError(e) },
                        function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            },
            getTransportistas: function(empresa) {
                return Rx.Observable.create(function (observer) {

                    var suscriptions = [];
                    empresa.asociados.forEach(function(e,i,a){
                        var suscription = dataService.get(collectionsEnum.transportista,{id:e}).subscribe(
                            function (transportista) {
                                observer.onNext(transportistaModel.toJson(transportista));

                                //complete if is the last one
                                if (i == a.length - 1){
                                    observer.onCompleted();
                                }
                            },
                            function (e) {
                                //complete if is the last one
                                observer.onError(e)
                                if (i == a.length - 1){
                                    observer.onCompleted();
                                }
                            },
                            function () { }
                        );
                        suscriptions.push(suscription);
                    });

                    return function () {
                        suscriptions.forEach(function (e,i,a){
                            e.dispose();
                        });
                    }
                });
            },
            getDefaultPedido: function(pedido, donacion) {
                if (pedido) {
                    return pedido;
                }
                return {
                    donacion: donacion,
                    managedByBroker: false,
                    valor: 0
                }
            },
            guardarPedido: function(pedido, saveAsPlantilla, transportistas) {
                var acl = {
                    currentUser: true,
                    permissions: []
                }

                if (saveAsPlantilla) {
                    pedido.estado = undefined;
                    pedido.horaCarga = undefined;
                    pedido.horaEntrega = undefined;
                } else {
                    pedido.plantilla = undefined;
                    pedido.estado = pedidoEstadosEnum.pendiente;

                    if (pedido.managedByBroker) {
                        acl.permissions.push(
                            {
                                isRole: true,
                                role: rolesEnum.broker,
                                id: undefined,
                                allowRead: true,
                                allowWrite: true
                            }
                        );
                    } else if (pedido.proveedorCarga.asociadoConTodos || pedido.donacion) {
                        acl.permissions.push(
                            {
                                isRole: true,
                                role: rolesEnum.transportista,
                                id: undefined,
                                allowRead: true,
                                allowWrite: true
                            }
                        );
                    } else if (pedido.transportista) {
                        acl.permissions.push(
                            {
                                isRole: false,
                                role: undefined,
                                id: pedido.transportista.user,
                                allowRead: true,
                                allowWrite: true
                            }
                        );
                    } else if (transportistas) {
                        transportistas.forEach(function(e,i,a){
                            acl.permissions.push(
                                {
                                    isRole: false,
                                    role: undefined,
                                    id: e.user,
                                    allowRead: true,
                                    allowWrite: true
                                }
                            );
                        });
                    }
                }
                if (pedido.horaCarga) { pedido.horaCarga = pedido.horaCarga._d; }
                if (pedido.horaEntrega) { pedido.horaEntrega = pedido.horaEntrega._d; }
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.add(collectionsEnum.pedido,pedidoModel.fromJson(pedido),{acl: acl}).subscribe(
                        function (pedido) {
                            realtimeService.publish(realtimeChannels.pedidoCreado,{id:pedido.id, acl: acl});

                            observer.onNext(pedidoModel.toJson(pedido));
                            observer.onCompleted();
                        },
                        function (e) { observer.onError(e) },
                        function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            },
            eliminarPlantilla: function(pedido){
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.delete(collectionsEnum.pedido,pedido.object).subscribe(
                        function (pedido) {
                            observer.onNext(pedidoModel.toJson(pedido));
                            observer.onCompleted();
                        },
                        function (e) { observer.onError(e) },
                        function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            }
        }
    }]);
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
/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .service('setTransportistaService',['$rootScope','collectionsEnum','choferModel','dataService','pedidoEstadosEnum','pedidoModel','realtimeService','realtimeChannels','choferModel','choferEstadosEnum',function($rootScope,collectionsEnum,choferModel,dataService,pedidoEstadosEnum,pedidoModel,realtimeService,realtimeChannels,choferModel,choferEstadosEnum){

        //private methods

        return {
            //public methods
            getChoferes: function(pedido) {
                return Rx.Observable.create(function (observer) {
                    var parms = {filters:[{type:"and",operator:"!=",field:"deleted",value:true},{type:"and",operator:"=",field:"estado",value:choferEstadosEnum.disponible}],includes:["transportista"]};
                    var suscription = dataService.getAll(collectionsEnum.chofer,parms).subscribe(
                        function (choferes) {
                            observer.onNext(
                                choferes
                                    .map(function(chofer){ return choferModel.toJson(chofer,[{field: "transportista"}]); })
                                    .filter(function(chofer){ return pedido.tipoCamion.indexOf(chofer.tipoCamion) >= 0; })
                            );
                            observer.onCompleted();
                        },
                        function (e) {
                            //complete if is the last one
                            observer.onError(e)
                            if (i == a.length - 1){
                                observer.onCompleted();
                            }
                        },
                        function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            },
            getPedido: function(pedido, chofer) {
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.get(collectionsEnum.pedido,{id:pedido.id})
                        .subscribe(
                        function (p) {
                            pedidoJson = pedidoModel.toJson(p);
                            if (pedidoJson.estado == pedidoEstadosEnum.pendiente){
                                observer.onNext(true);
                                observer.onCompleted();
                            } else {
                                observer.onError(pedidoJson);
                            }
                        },
                        function (e) { observer.onError(e) },
                        function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            },
            seleccionarChofer: function(pedido, chofer) {
                var updatedFields = [
                    {operator: "set", field: "estado", value: pedidoEstadosEnum.activo},
                    {operator: "set", field: "transportista", value: chofer.transportista.object},
                    {operator: "set", field: "chofer", value: chofer.object},
                    {operator: "set", field: "horaAsignacion", value: new Date()},
                ]
                var acl = {
                    currentUser: true,
                    permissions: [{
                        isRole: false,
                        role: undefined,
                        id: pedido.proveedorCarga.user,
                        allowRead: true,
                        allowWrite: true
                    },{
                        isRole: false,
                        role: undefined,
                        id: chofer.transportista.user,
                        allowRead: true,
                        allowWrite: true
                    }]
                };
                if (chofer.user){
                    acl.permissions.push({
                        isRole: false,
                            role: undefined,
                        id: chofer.user,
                        allowRead: true,
                        allowWrite: true
                    });
                }

                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.update(collectionsEnum.pedido,pedidoModel.fromJson(pedido),{updatedFields: updatedFields, acl: acl})
                        .flatMap(function(p){
                            pedido = p;
                            return dataService.update(collectionsEnum.chofer,choferModel.fromJson(chofer),{updatedFields: [{operator: "set", field: "estado", value: choferEstadosEnum.enViaje}]});
                        })
                        .subscribe(
                            function (c) {
                                realtimeService.publish(realtimeChannels.pedidoAsignado,{id:pedido.id, acl: acl});

                                observer.onNext(pedidoModel.toJson(pedido,[{field:"proveedorCarga"},{field:"transportista"},{field:"chofer"}]));
                                observer.onCompleted();
                            },
                            function (e) { observer.onError(e) },
                            function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            }
        }
    }]);
/**
 * Created by dcoellar on 4/20/16.
 */

angular.module("easyRuta")
    .controller('progressViewController',['$scope','text',function($scope,text){

        //members

        //properties
        $scope.text = text;

        //private methods

        //public methods

        //init
    }]);
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
                                .hideDelay(5000)
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
                                .hideDelay(5000)
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
                        .hideDelay(5000)
                );
            },
            function () { }
        );
    }]);
/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .service('addChoferService',['$rootScope','collectionsEnum','transportistaModel','choferModel','dataService','rolesEnum','choferEstadosEnum',function($rootScope,collectionsEnum,transportistaModel,choferModel,dataService,rolesEnum,choferEstadosEnum){

        //private methods

        return {
            //public methods
            getTransportistaCurrentUser: function() {
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.get(collectionsEnum.transportista,{id: $rootScope.transportista.id}).subscribe(
                        function (transportista) {
                            observer.onNext(transportistaModel.toJson(transportista));
                            observer.onCompleted();
                        },
                        function (e) { observer.onError(e) },
                        function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            },
            addChofer: function(chofer) {
                var acl = {
                    currentUser: true,
                    permissions: [
                        {isRole: true, role: rolesEnum.broker, id: undefined, allowRead: true, allowWrite: true},
                        {isRole: true, role: rolesEnum.proveedorCarga, id: undefined, allowRead: true, allowWrite: true}
                    ]
                }
                //TODO when chofer is user add this permission
                //{isRole: false, role: undefined, id: chofer.user.id, allowRead: true, allowWrite: true}
                chofer.estado = choferEstadosEnum.disponible;
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.add(collectionsEnum.chofer, choferModel.fromJson(chofer), {acl: acl}).subscribe(
                        function (chofer) {
                            observer.onNext(choferModel.toJson(chofer));
                            observer.onCompleted();
                        },
                        function (e) {
                            observer.onError(e)
                        },
                        function () {
                        }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            },
            updateChofer: function(chofer) {
                return Rx.Observable.create(function (observer) {
                    var updatedFields = [
                        {operator: "set", field: "nombre", value: chofer.nombre},
                        {operator: "set", field: "descripcion", value: chofer.descripcion},
                        {operator: "set", field: "cedula", value: chofer.cedula},
                        {operator: "set", field: "telefono", value: chofer.telefono},
                        {operator: "set", field: "tipoCamion", value: chofer.tipoCamion},
                        {operator: "set", field: "marca", value: chofer.marca},
                        {operator: "set", field: "modelo", value: chofer.modelo},
                        {operator: "set", field: "anio", value: chofer.anio},
                        {operator: "set", field: "placa", value: chofer.placa},
                        {operator: "set", field: "color", value: chofer.color},
                    ];
                    var suscription = dataService.update(collectionsEnum.chofer, choferModel.fromJson(chofer), {updatedFields:updatedFields}).subscribe(
                        function (chofer) {
                            observer.onNext(choferModel.toJson(chofer));
                            observer.onCompleted();
                        },
                        function (e) {
                            observer.onError(e)
                        },
                        function () {
                        }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            }
        }
    }]);
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
/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .service('transportistaFlotaService',['collectionsEnum','choferModel','dataService',function(collectionsEnum,choferModel,dataService){

        //private methods

        return {
            //public methods
            getChoferes: function() {
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.getAll(collectionsEnum.chofer,{filters:[{type:"and",operator:"!=",field:"deleted",value:true}],includes:["transportista"]}).subscribe(
                        function (choferes) {
                            observer.onNext(choferes.map(function(chofer){
                                return choferModel.toJson(chofer,[{field: "transportista"}]);
                            }));
                            observer.onCompleted();
                        },
                        function (e) {
                            //complete if is the last one
                            observer.onError(e)
                            if (i == a.length - 1){
                                observer.onCompleted();
                            }
                        },
                        function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            },
            eliminarChofer: function(chofer) {
                return Rx.Observable.create(function (observer) {
                    var updatedFields = [
                        {operator: "set", field: "deleted", value: true},
                    ];
                    var suscription = dataService.update(collectionsEnum.chofer, choferModel.fromJson(chofer), {updatedFields:updatedFields}).subscribe(
                        function (chofer) {
                            observer.onNext(choferModel.toJson(chofer));
                            observer.onCompleted();
                        },
                        function (e) {
                            observer.onError(e)
                        },
                        function () {
                        }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });

            }
        }
    }]);
/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .controller('transportistaPedidosController',['$rootScope', '$scope', 'uiEventsEnum', 'uiContextEnum', 'transportistaPedidosService','pedidoEstadosEnum','$mdDialog','pedidoEstadosEnum','realtimeChannels','$mdToast','$location',function($rootScope,$scope, uiEventsEnum, uiContextEnum, transportistaPedidosService,pedidoEstadosEnum,$mdDialog,pedidoEstadosEnum,realtimeChannels,$mdToast,$location){

        //members

        //properties
        $scope.pedidosPendientes = [];
        $scope.pedidosEnProceso = [];
        $scope.pedidosCompletados = [];
        $scope.selectedTabIndex = 0;

        //private methods
        var loadPedidos = function() {
            transportistaPedidosService.getPedidos().subscribe(
                function (pedidos) {
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
                    $scope.pedidosCompletados = pedidos.filter(function(pedido){return pedido.estado == pedidoEstadosEnum.finalizado});
                    $scope.$apply();
                },
                function (err) {
                    console.dir(err);
                    if (err.code == 119){
                        $location.path('/home');
                        $location.replace();
                    } else{
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Ooops!!! parece que estamos experimentando problemas en nuestro servidores por favor contacte a soporte.')
                                .position("top left")
                                .hideDelay(5000)
                        );
                    }
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
                    var ped = $scope.pedidosPendientes.find(function(p) { return p.id == pedido.id; });
                    var i = $scope.pedidosPendientes.indexOf(ped);
                    $scope.pedidosPendientes.splice(i,1)
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
        $scope.$on(realtimeChannels.pedidoCancelado, function(event, args){
            loadPedidos();
        });
    }]);

/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .service('transportistaPedidosService',['collectionsEnum','dataService','pedidoModel','pedidoEstadosEnum','realtimeService','realtimeChannels','choferModel','choferEstadosEnum',function(collectionsEnum,dataService,pedidoModel,pedidoEstadosEnum,realtimeService,realtimeChannels,choferModel,choferEstadosEnum){

        //private methods
        return {
            //public methods
            getPedidos: function(){
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.getAll(collectionsEnum.pedido,{filters:[{type:"and",operator:"=",field:"plantilla",value:undefined}],includes:["proveedorCarga","transportista","chofer"]}).subscribe(
                        function (pedidos) {
                            observer.onNext(pedidos.map(function(pedido){
                                return pedidoModel.toJson(pedido,[{field:"proveedorCarga"},{field:"transportista"},{field:"chofer"}]);
                            }));
                            observer.onCompleted();
                        },
                        function (e) { observer.onError(e) },
                        function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            },
            actualizarViaje: function(pedido, estado) {
                var updatedFields = [
                    {operator: "set", field: "estado", value: estado},
                ];
                if (estado == pedidoEstadosEnum.enCurso){
                    updatedFields.push({operator: "set", field: "horaInicio", value: new Date()});
                }else if (estado == pedidoEstadosEnum.finalizado){
                    updatedFields.push({operator: "set", field: "horaFinalizacion", value: new Date()});
                }
                return Rx.Observable.create(function (observer) {
                    var suscription = dataService.update(collectionsEnum.pedido,pedidoModel.fromJson(pedido),{updatedFields: updatedFields})
                        .flatMap(function(p){
                            var chofer = pedido.chofer;
                            pedido = p;
                            if (estado == pedidoEstadosEnum.finalizado){
                                return dataService.update(collectionsEnum.chofer,choferModel.fromJson(chofer),{updatedFields: [{operator: "set", field: "estado", value: choferEstadosEnum.disponible}]});
                            }else{
                                return Rx.Observable.just(undefined);
                            }
                        })
                        .subscribe(
                            function (c) {
                                if (estado == pedidoEstadosEnum.enCurso){
                                    realtimeService.publish(realtimeChannels.pedidoIniciado,{id:pedido.id});
                                } else if (estado == pedidoEstadosEnum.finalizado){
                                    realtimeService.publish(realtimeChannels.pedidoFinalizado,{id:pedido.id});
                                }

                                observer.onNext(pedidoModel.toJson(pedido,[{field:"proveedorCarga"},{field:"transportista"},{field:"chofer"}]));
                                observer.onCompleted();
                            },
                            function (e) { observer.onError(e) },
                            function () { }
                    );

                    return function () {
                        suscription.dispose();
                    }
                });
            }
        }
    }]);

/**
 * Created by dcoellar on 4/6/16.
 */

angular.module('easyRuta')
    .directive('ezChoferes',function(){
        return {
            restrict: 'E',
            templateUrl: "app/directives/choferes/ez-choferes.html"
        };
    });

/**
 * Created by dcoellar on 9/15/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_rootScope;
    var local_scope;
    var local_uibModal;
    var local_agregar_pedido_viewmodel;
    var local_form;

    var modal_ctlr;
    var modal_local_scope;
    var modal_local_uibModalInstance;

    // Constructor
    var init;
    var modal_init;

    // "Public" methods
    var agregar;
    var guardar_como_plantilla;
    var limpiar;
    var tipo_transportista_seleccionado;
    var proveedor_seleccionado;
    var plantilla_selected;
    var delete_plantilla;
    var toggle_form;
    var seleccionar_transportista;

    var modal_guardar_plantilla;
    var modal_cancelar;

    // Methods
    var limpiar_form;
    var setup_date_pickers;
    var get_active_transportistas;
    var guardar_pedido;

    //View Controller callbacks references
    var guardar_pedido_callback;

    //Data callbacks
    var local_get_plantillas_callback;
    var local_get_ciudades_callback;
    var local_get_transpostistas_despachador_callback;
    var local_get_active_transportistas_callback;
    var local_guardar_pedido_callback;
    var local_agregar_guardar_pedido_callback;
    var local_plantilla_guardar_pedido_callback;
    var local_get_plantilla_callback;
    var local_delete_plantilla_callback;

    //Notifications callbacks
    var presense_new_pedidos_callback;

    angular.module("easyRuta")
        .controller('AgregarPedidoController',function($rootScope,$scope,$uibModal,agregar_pedido_viewmodel){

            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_uibModal = $uibModal;
            local_agregar_pedido_viewmodel = agregar_pedido_viewmodel;

            ctlr.Agregar = agregar;
            ctlr.GuardarComoPlantilla = guardar_como_plantilla;
            ctlr.Limpiar = limpiar;
            ctlr.TipoTransporteSeleccionado = tipo_transportista_seleccionado;
            ctlr.proveedor_seleccionado = proveedor_seleccionado;
            ctlr.PlantillaSelected = plantilla_selected;
            ctlr.DeletePlantilla  = delete_plantilla
            ctlr.ToggleForm = toggle_form;
            ctlr.seleccionar_transportista = seleccionar_transportista;

            init();

        })
        .controller('AgregarPedidoModalController',function($scope,$uibModalInstance){

            modal_ctlr = this;
            modal_local_scope = $scope;
            modal_local_uibModalInstance = $uibModalInstance;

            modal_ctlr.guardar = modal_guardar_plantilla;
            modal_ctlr.cancelar = modal_cancelar;

            modal_init();
        });

    // Constructor
    init = function() {
        local_agregar_pedido_viewmodel.get_plantillas(local_get_plantillas_callback);
        local_agregar_pedido_viewmodel.get_ciudades(local_get_ciudades_callback);

        local_scope.$on('presense_' + local_rootScope.channels.new_pedidos, presense_new_pedidos_callback);

        ctlr.availableTransportistas = 0;
        ctlr.open = false;
        ctlr.minDate = new Date();
        ctlr.isDespachador = false;

        setup_date_pickers();
        limpiar_form();
    };
    modal_init = function(){
        modal_ctlr.plantilla = "";
    };

    // "Public" methods
    agregar = function (form) {
        local_form = form;
        if (local_form.$valid) {
            ctlr.data.Plantilla = "";
            ctlr.data.Estado = "Pendiente";
            guardar_pedido(local_agregar_guardar_pedido_callback);
        }
    };
    guardar_como_plantilla = function (form) {
        local_form = form;
        if (local_form.$valid) {
            var modalInstance = local_uibModal.open({
                animation: local_scope.animationsEnabled,
                templateUrl: 'PlantillaModal.html',
                controller: 'AgregarPedidoModalController as agrPedModalCtlr'
            });

            modalInstance.result.then(function (plantilla) {
                ctlr.data.Plantilla = plantilla;
                ctlr.data.HoraCarga = null;
                ctlr.data.HoraEntrega = null;
                ctlr.data.Estado = "Plantilla";
                ctlr.data.Transportista = null;
                guardar_pedido(local_plantilla_guardar_pedido_callback)
            }, function () {
                console.log("Modal canceled.");
            });
        }
    };
    limpiar = function (form) {
        local_form = form;
        limpiar_form();
    };
    tipo_transportista_seleccionado = function (TipoTransporte) {
        ctlr.data.Transportista = null;
        ctlr.data.TipoTransporte = TipoTransporte;
        var proveedor = null;
        if (ctlr.data.Proveedor && ctlr.data.Proveedor != "") {
            ctlr.proveedores.forEach(function (element, index, array) {
                if (element.id = ctlr.data.Proveedor) {
                    proveedor = element.data;
                }
            });
        }
        local_agregar_pedido_viewmodel.get_transpostistas_despachador(proveedor,true,ctlr.data.TipoTransporte,local_get_transpostistas_despachador_callback);
    };
    proveedor_seleccionado = function () {
        ctlr.data.Transportista = null;
        var proveedor = null;
        if (ctlr.data.Proveedor && ctlr.data.Proveedor != "") {
            ctlr.proveedores.forEach(function (element, index, array) {
                if (element.id = ctlr.data.Proveedor) {
                    proveedor = element.data;
                }
            });
        }
        local_agregar_pedido_viewmodel.get_transpostistas_despachador(proveedor,true,ctlr.data.TipoTransporte,local_get_transpostistas_despachador_callback);
    };
    plantilla_selected = function (id) {
        local_agregar_pedido_viewmodel.get_plantilla(id,local_get_plantilla_callback);
    };
    delete_plantilla = function (id) {
        local_agregar_pedido_viewmodel.delete_plantilla(id,local_delete_plantilla_callback);
    };
    toggle_form = function() {
        if ($('#agregarPedido').hasClass("panel-primary")){
            $('#agregarPedido').removeClass('panel-primary');
            $('#agregarPedido').addClass('panel-default');
            $('#inputCiudadOrigen').focus();
            ctlr.open = true;
        }else{
            $('#agregarPedido').removeClass('panel-default');
            $('#agregarPedido').addClass('panel-primary');
            ctlr.open = false;
        }
    };
    seleccionar_transportista = function(transportista) {
        ctlr.data.Transportista = transportista;
    };

    modal_guardar_plantilla = function(){
        modal_local_uibModalInstance.close(modal_ctlr.plantilla);
    };
    modal_cancelar = function(){
        modal_local_uibModalInstance.dismiss('cancel');
    };

    // Methods
    limpiar_form = function (){
        ctlr.copias = 1;
        ctlr.data = {
            Plantilla : "",
            CiudadOrigen : "",
            DireccionOrigen : "",
            CiudadDestino : "",
            DireccionDestino : "",
            HoraCarga : new Date(),
            HoraEntrega : new Date(),
            Producto : "",
            Valor : 0,
            PesoDesde : 0,
            PesoHasta : 0,
            TipoTransporte : "furgon",
            CajaRefrigerada : false,
            Transportista : null
        };
        if (local_form){
            local_form.$setPristine();
        }
    }
    setup_date_pickers = function(){
        /*
         * Setup hora max carga date picker
         * */
        local_scope.horaMaxCargaOpen = function($event) {
            local_scope.horaMaxCargaStatus.opened = true;
        };
        local_scope.horaMaxCargaStatus = {
            opened: false
        };

        /*
         * Setup hora max carga date picker
         * */
        local_scope.horaMaxDescargaOpen = function($event) {
            local_scope.horaMaxDescargaStatus.opened = true;
        };
        local_scope.horaMaxDescargaStatus = {
            opened: false
        };
    }
    get_active_transportistas = function(){
        local_agregar_pedido_viewmodel.get_active_transportistas(local_get_active_transportistas_callback);
    }
    guardar_pedido = function(callback){
        guardar_pedido_callback = callback
        var transportista = null;
        if (ctlr.data.Transportista){
            transportista = ctlr.data.Transportista.object;
        }
        local_agregar_pedido_viewmodel.guardar_pedidos(ctlr.data,transportista,local_guardar_pedido_callback);
    };

    //Data callbacks
    local_get_plantillas_callback = function(error,results){
        if (!error){
            ctlr.plantillas = results;
            local_scope.$apply();
        }

        //Call services that require context here
        if (local_rootScope.despachador){
            ctlr.isDespachador = true;
            local_agregar_pedido_viewmodel.get_transpostistas_despachador(null,true,ctlr.data.TipoTransporte,local_get_transpostistas_despachador_callback);
        }
    };
    local_get_ciudades_callback = function(error,results){
        if (!error){
            ctlr.ciudades = results;
            local_scope.$apply();
        }
    };
    local_get_transpostistas_despachador_callback = function(error,results){
        if (!error){
            ctlr.transportistas = results;
            local_scope.$apply();
        }
    };
    local_get_active_transportistas_callback = function(results){
        ctlr.availableTransportistas = results;
        local_scope.$apply();
    };
    local_guardar_pedido_callback = function(error,results){
        guardar_pedido_callback(error,results);
    };
    local_agregar_guardar_pedido_callback  = function(error,results){
        if (!error){
            $('#agregarPedidBody').collapse("hide");
            $('#agregarPedido').removeClass('panel-default');
            $('#agregarPedido').addClass('panel-primary');
            ctlr.open = false;
            limpiar_form();
        }
    };
    local_plantilla_guardar_pedido_callback = function(error,results){
        if (!error){
            ctlr.plantillas.push({id: results[0].id, plantilla: results[0].get('Plantilla')});
            local_scope.$apply();
        }
    };
    local_get_plantilla_callback = function(error,results){
        if (results) {
            ctlr.data = {
                Plantilla: ctlr.plantilla,
                CiudadOrigen: results.get("CiudadOrigen").id,
                DireccionOrigen: results.get("DireccionOrigen"),
                CiudadDestino: results.get("CiudadDestino").id,
                DireccionDestino: results.get("DireccionDestino"),
                HoraCarga: results.get("HoraCarga"),
                HoraEntrega: results.get("HoraEntrega"),
                Producto: results.get("Producto"),
                Valor: results.get("Valor"),
                PesoDesde: results.get("PesoDesde"),
                PesoHasta: results.get("PesoHasta"),
                TipoTransporte: results.get("TipoTransporte"),
                CajaRefrigerada: results.get("CajaRefrigerada")
            };

            if (results.get("Proveedor")){
                Proveedor : results.get("Proveedor").id
            }

            local_scope.$apply();
        }
    };
    local_delete_plantilla_callback = function(error,results){
        if (!error){
            var i;
            ctlr.plantillas.forEach(function(element,index,array){
                if (element.id = id){
                    i = index;
                }
            });
            if (i) {
                ctlr.plantillas.splice(i, 1);
                local_scope.$apply();
            }
        }
    };

    //Notifications callbacks
    presense_new_pedidos_callback  = function(event, args) {
        get_active_transportistas();
    };

})();
/**
 * Created by dcoellar on 9/15/15.
 */

(function(){

    //Variables
    var ctlr;
    var local_rootScope;
    var master_scope;
    var local_window;
    var local_uiModal;
    var local_master_page_viewmodel;
    var local_utils;

    //Constructor
    var init;

    //"Public" Methods
    var local_inicio;
    var local_logout;
    var local_scrollTo;
    var local_toggleLogin;
    var local_showNotifications;

    //Data Callbacks
    var local_get_saldo_callback;
    var local_get_notifications_count_callback;

    //Notifications callbacks
    var pedido_confirmado_callback;
    var pedido_confirmado_proveedor_callback;
    var pedido_cancelado_callback;
    var nueva_notificacion_callback;
    var clear_notifications_callback;

    angular.module("easyRuta")
        .controller('MasterPageController',function($rootScope,$scope,$window,$uibModal,master_page_viewmodel,utils) {
            ctlr = this;
            local_rootScope = $rootScope;
            master_scope = $scope;
            local_window = $window;
            local_uiModal = $uibModal;
            local_master_page_viewmodel = master_page_viewmodel;
            local_utils = utils;

            ctlr.Inicio = function() { local_inicio(); };
            ctlr.toggleLogin = function(show) { local_toggleLogin(show); };
            ctlr.Logout = function() { local_logout(); };
            ctlr.scrollTo = function(id) { local_scrollTo(id); };
            ctlr.showNotifications = function() { local_showNotifications(); };

            init()

        });

    //Constructor
    init = function(){
        local_toggleLogin(false);

        if (Parse.User.current()) {
            local_master_page_viewmodel.get_saldo(local_get_saldo_callback);
            local_master_page_viewmodel.get_notifications_count(local_get_notifications_count_callback);
        }

        master_scope.$on(local_rootScope.channels.pedido_confirmado, pedido_confirmado_callback);
        master_scope.$on(local_rootScope.channels.pedido_confirmado_proveedor, pedido_confirmado_proveedor_callback);
        master_scope.$on(local_rootScope.channels.pedido_cancelado, pedido_cancelado_callback);
        master_scope.$on(local_rootScope.channels.nueva_notificacion, nueva_notificacion_callback);
        master_scope.$on(local_rootScope.channels.clear_notifications, clear_notifications_callback);
    };

    //"Public" Methods
    local_inicio = function(){
        if (local_rootScope.cliente) {
            local_window.location = "/#/inicioClientes"
        }
        if (local_rootScope.proveedor) {
            local_window.location = "/#/inicioProveedores"
        }
    };
    local_logout = function(){
        local_rootScope.loggedInRole = undefined;
        local_rootScope.proveedor = undefined;
        local_rootScope.cliente = undefined;
        Parse.User.logOut();
        local_window.location.href = '/';
    };
    local_scrollTo = function(id){
        $('html, body').animate({
            scrollTop: $("#" + id).offset().top
        }, 2000);
    }
    local_toggleLogin = function(show){
        if (show){
            local_scrollTo("content0");
            $("#login").show()
        }else{
            $("#login").hide()
        }
    };
    local_showNotifications = function(){
        var modalInstance = local_uiModal.open({
            animation: master_scope.animationsEnabled,
            templateUrl: 'notifications_center.html',
            controller: 'notifications_center_controller as ctlr'
        });
    };

    //Data callbacks
    local_get_saldo_callback = function(error,saldo){
        if (!error){
            ctlr.showSaldo = false;
            ctlr.Saldo = 0;
            if (local_rootScope.loggedInRole.getName() == "proveedor"){
                ctlr.showSaldo = true;
                ctlr.Saldo = local_utils.formatCurrency(saldo);
            }
            master_scope.$apply();
        }
    };
    local_get_notifications_count_callback = function(error,count){
        ctlr.notificationsCount = count;
        master_scope.$apply();
    }

    //Notifications callbacks
    pedido_confirmado_callback = function(m) {
        local_master_page_viewmodel.get_saldo(local_get_saldo_callback);
    };
    pedido_confirmado_proveedor_callback = function(m) {
        local_master_page_viewmodel.get_saldo(local_get_saldo_callback);
    };
    pedido_cancelado_callback = function(m) {
        local_master_page_viewmodel.get_saldo(local_get_saldo_callback);
    };
    nueva_notificacion_callback = function(m) {
        local_master_page_viewmodel.get_notifications_count(local_get_notifications_count_callback);
    };
    clear_notifications_callback = function(m) {
        local_master_page_viewmodel.get_notifications_count(local_get_notifications_count_callback);
    };
})();
/**
 * Created by dcoellar on 9/21/15.
 */

/**
 * Created by dcoellar on 9/18/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_rootScope;
    var local_scope;
    var local_location;
    var local_uiModal;
    var local_pedidos_activos_viewmodel;

    // Constructor
    var init;

    // "Public" methods
    var verDetalle;
    var iniciar;
    var cancelar;

    // Methods

    //Data callbacks
    var get_pedidos_activos_callback;
    var cancelar_pedido_callback;
    var iniciar_pedido_callback;

    //Notifications callbacks
    var new_pedidos_callback;
    var pedido_confirmado_callback;
    var pedido_confirmado_proveedor_callback;
    var pedido_cancelado_callback;
    var pedido_cancelado_transportista_callback;
    var pedido_iniciado_callback;
    var pedido_cancelado_confirmado_proveedor_callback;

    angular.module("easyRuta")
        .controller('PedidosActivosController',function($rootScope,$scope,$location,$uibModal,pedidos_activos_viewmodel) {

            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_location = $location;
            local_uiModal = $uibModal;
            local_pedidos_activos_viewmodel = pedidos_activos_viewmodel;

            ctlr.verDetalle = verDetalle;
            ctlr.iniciar = iniciar;
            ctlr.cancelar = cancelar;

            init();
        });

    // Constructor
    init = function() {
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);

        local_scope.$on(local_rootScope.channels.new_pedidos, new_pedidos_callback);
        local_scope.$on(local_rootScope.channels.pedido_confirmado, pedido_confirmado_callback);
        local_scope.$on(local_rootScope.channels.pedido_confirmado_proveedor, pedido_confirmado_proveedor_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado, pedido_cancelado_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_transportista, pedido_cancelado_transportista_callback);
        local_scope.$on(local_rootScope.channels.pedido_iniciado, pedido_iniciado_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_confirmado_proveedor, pedido_cancelado_confirmado_proveedor_callback);
    };

    // "Public" methods
    verDetalle = function(pedido) {
        local_location.path("/detallePedido/" + pedido.id);
    };
    iniciar = function(pedido) {
        local_pedidos_activos_viewmodel.iniciar_pedido(pedido,iniciar_pedido_callback)
    };
    cancelar = function(pedido){
        local_scope.confirm_message = "Esta seguro de cancelar este pedido?"
        var modalInstance = local_uiModal.open({
            animation: local_scope.animationsEnabled,
            templateUrl: 'confirm_dialog.html',
            controller: 'ConfirmDialogController as ctlr',
            scope: local_scope
        });

        modalInstance.result.then(function (result) {
            local_pedidos_activos_viewmodel.cancelar_pedido(pedido,cancelar_pedido_callback);
        }, function () {
            console.log("Modal canceled.");
        });
    };

    // Methods

    //Data callbacks
    get_pedidos_activos_callback = function(error,results){
        ctlr.isProveedor = false;
        if (local_rootScope.proveedor){
            ctlr.isProveedor = true;
        }
        ctlr.isDespachador = false;
        if (local_rootScope.despachador){
            ctlr.isDespachador = true;
        }

        ctlr.pedidos = results;
        local_scope.$apply();
    };
    iniciar_pedido_callback = function(m) {
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };
    cancelar_pedido_callback = function(error,result){
        if (!error){
            local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
        }
    };

    //Notifications callbacks
    new_pedidos_callback = function(m){
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };
    pedido_confirmado_callback = function(m) {
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };
    pedido_confirmado_proveedor_callback = function(m) {
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };
    pedido_cancelado_callback = function(m) {
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };
    pedido_cancelado_transportista_callback = function(m) {
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };
    pedido_iniciado_callback = function(m) {
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };
    pedido_cancelado_confirmado_proveedor_callback = function(m){
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };

})();

/**
 * Created by dcoellar on 9/21/15.
 */

/**
 * Created by dcoellar on 9/18/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_rootScope;
    var local_scope;
    var local_location;
    var local_uiModal;
    var local_pedidos_completados_viewmodel;

    // Constructor
    var init;

    // "Public" methods
    var verDetalle;
    var calificar;

    // Methods

    //Data callbacks
    var get_pedidos_completados_callback;

    //Notifications callbacks
    var pedido_completado_callback;

    angular.module("easyRuta")
        .controller('PedidosCompletadosController',function($rootScope,$scope,$location,$uibModal,pedidos_completados_viewmodel) {

            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_location = $location;
            local_uiModal = $uibModal;
            local_pedidos_completados_viewmodel = pedidos_completados_viewmodel;

            ctlr.verDetalle = verDetalle;
            ctlr.calificar = calificar;

            init();

        });

    // Constructor
    init = function() {
        local_pedidos_completados_viewmodel.get_pedidos_completados(get_pedidos_completados_callback);

        local_scope.$on(local_rootScope.channels.pedido_completado, pedido_completado_callback);
    };

    // "Public" methods
    verDetalle = function(pedido) {
        local_location.path("/detallePedido/" + pedido.id);
    };
    calificar = function(){
        var modalInstance = local_uiModal.open({
            animation: local_scope.animationsEnabled,
            templateUrl: 'rateTransportistaModal.html',
            controller: 'RateTransportistaModalController as ctlr'
        });

        modalInstance.result.then(function () {
            console.log("return from modal");
            local_pedidos_completados_viewmodel.get_pedidos_completados(get_pedidos_completados_callback);
        }, function () {
            console.log("modal canceled");
        });
    };

    // Methods

    //Data callbacks
    get_pedidos_completados_callback = function(error,results){
        ctlr.isProveedor = false;
        if (local_rootScope.proveedor){
            ctlr.isProveedor = true;
        }
        ctlr.isDespachador = false;
        if (local_rootScope.despachador){
            ctlr.isDespachador = true;
        }
        
        ctlr.pedidos = results;
        local_scope.$apply();
    };

    //Notifications callbacks
    pedido_completado_callback = function(m) {
        local_pedidos_completados_viewmodel.get_pedidos_completados(get_pedidos_completados_callback);
    };

})();

/**
 * Created by dcoellar on 9/21/15.
 */

/**
 * Created by dcoellar on 9/18/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_rootScope;
    var local_scope;
    var local_location;
    var local_pedidos_en_curso_viewmodel;

    // Constructor
    var init;

    // "Public" methods
    var verDetalle;
    var finalizar;

    // Methods

    //Data callbacks
    var get_pedidos_en_cursor_callback;
    var finalizar_pedido_callback;

    //Notifications callbacks
    var pedido_iniciado_callback;
    var pedido_completado_callback;
    var pedido_cancelado_confirmado_proveedor_callback;
    var pedido_cancelado_confirmado_transportista_callback;
    var pedido_cancelado_callback;
    var pedido_cancelado_transportista_callback;

    angular.module("easyRuta")
        .controller('PedidosEnCursoController',function($rootScope,$scope,$location,$uibModal,pedidos_en_curso_viewmodel) {

            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_location = $location;
            local_pedidos_en_curso_viewmodel = pedidos_en_curso_viewmodel;

            ctlr.verDetalle = verDetalle;
            ctlr.finalizar = finalizar;

            init();
        });

    // Constructor
    init = function() {
        local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);

        local_scope.$on(local_rootScope.channels.pedido_iniciado, pedido_iniciado_callback);
        local_scope.$on(local_rootScope.channels.pedido_completado, pedido_completado_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_confirmado_proveedor, pedido_cancelado_confirmado_proveedor_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_confirmado_transportista, pedido_cancelado_confirmado_transportista_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado, pedido_cancelado_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_transportista, pedido_cancelado_transportista_callback);

        ctlr.isProveedor = false;
        if (local_rootScope.proveedor){
            ctlr.isProveedor = true;
        }
    };

    // "Public" methods
    verDetalle = function(pedido) {
        local_location.path("/detallePedido/" + pedido.id);
    };
    finalizar = function(pedido) {
        local_pedidos_en_curso_viewmodel.finalizar_pedido(pedido,finalizar_pedido_callback)
    };

    // Methods

    //Data callbacks
    get_pedidos_en_cursor_callback = function(error,results){
        ctlr.isProveedor = false;
        if (local_rootScope.proveedor){
            ctlr.isProveedor = true;
        }
        ctlr.isDespachador = false;
        if (local_rootScope.despachador){
            ctlr.isDespachador = true;
        }

        ctlr.pedidos = results;
        local_scope.$apply();
    };
    finalizar_pedido_callback = function(error,result) {
        if (!error){
            local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);
        }
    };

    //Notifications callbacks
    pedido_iniciado_callback = function(m) {
        local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);
    };
    pedido_completado_callback = function(m) {
        local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);
    };
    pedido_cancelado_confirmado_proveedor_callback = function(m) {
        local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);
    };
    pedido_cancelado_confirmado_transportista_callback = function(m) {
        local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);
    };
    pedido_cancelado_callback = function(m) {
        local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);
    };
    pedido_cancelado_transportista_callback = function(m) {
        local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);
    };

})();

/**
 * Created by dcoellar on 9/18/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_rootScope;
    var local_scope;
    var local_location;
    var local_interval;
    var local_uiModal;
    var local_pedidos_pendientes_viewmodel;

    // Constructor
    var init;

    // "Public" methods
    var verDetalle;
    //var proveedor_tomar;
    var cancelar;

    // Methods

    //Data callbacks
    var get_pedidos_pendientes_callback;
    //var proveedor_tomar_pedido_callback;
    var timeout_pedido_callback;
    var cancelar_pedido_callback;

    //Notifications callbacks
    var new_pedidos_callback;
    //var pedido_tomado_callback;
    var pedido_cancelado_callback;
    var pedido_completado_callback;
    //var pedido_timeout_callback;
    var transportista_habilitado_callback;

    //Helpers
    var set_timers;

    angular.module("easyRuta")
        .controller('PedidosPendientesController',function($rootScope,$scope,$location,$interval,$uibModal,pedidos_pendientes_viewmodel) {
            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_location = $location;
            local_interval = $interval;
            local_uiModal = $uibModal;
            local_pedidos_pendientes_viewmodel = pedidos_pendientes_viewmodel;

            ctlr.verDetalle = verDetalle;
            //ctlr.proveedor_tomar = proveedor_tomar;
            ctlr.cancelar = cancelar;

            init();
        });

    // Constructor
    init = function() {
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);

        local_scope.$on(local_rootScope.channels.new_pedidos, new_pedidos_callback);
        //local_scope.$on(local_rootScope.channels.pedido_tomado, pedido_tomado_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado, pedido_cancelado_callback);
        local_scope.$on(local_rootScope.channels.pedido_completado, pedido_completado_callback);
        //local_scope.$on(local_rootScope.channels.pedido_timeout, pedido_timeout_callback);
        local_scope.$on(local_rootScope.channels.transportista_habilitado, transportista_habilitado_callback);

        local_scope.$on('$destroy',function(){
            if (ctlr.timerInterval) {
                local_interval.cancel(ctlr.timerInterval);
            }
        });
    }

    // "Public" methods
    verDetalle = function(pedido) {
        local_location.path("/detallePedido/" + pedido.id);
    };
    /*
    proveedor_tomar = function(pedido,transportista){
        if ((local_rootScope.proveedor.get("Saldo") - pedido.object.get("Comision")) >= local_rootScope.proveedor.get("SaldoMin")){
            local_pedidos_pendientes_viewmodel.proveedor_tomar_pedido(pedido,transportista,proveedor_tomar_pedido_callback)
        }
    };
    */
    cancelar = function(pedido){
        local_scope.confirm_message = "Esta seguro de cancelar este pedido?"
        var modalInstance = local_uiModal.open({
            animation: local_scope.animationsEnabled,
            templateUrl: 'confirm_dialog.html',
            controller: 'ConfirmDialogController as ctlr',
            scope: local_scope
        });

        modalInstance.result.then(function (result) {
            local_pedidos_pendientes_viewmodel.cancelar_pedido(pedido,cancelar_pedido_callback)
        }, function () {
            console.log("Modal canceled.");
        });
    };
    // Methods

    //Data callbacks
    get_pedidos_pendientes_callback = function(error,results){
        if (!error) {
            ctlr.pedidos = results;
            ctlr.pedidosPorConfirmar = 0;
            ctlr.pedidosPorConfirmarProveedor = 0;
            if (results) {
                results.forEach(function (element, index, array) {
                    if (element.estado == 'PendienteConfirmacion') {
                        ctlr.pedidosPorConfirmar += 1
                    }
                    if (element.estado == 'PendienteConfirmacionProveedor') {
                        ctlr.pedidosPorConfirmarProveedor += 1
                    }
                });
                //set_timers()
            }
            local_scope.$apply();
        }
    };
    timeout_pedido_callback = function(error,result){
        if (!error){
            local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
        }
    };
    cancelar_pedido_callback = function(error,result){
        if (!error){
            local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
        }
    };

    //Notifications callbacks
    new_pedidos_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_cancelado_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_completado_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    /*
    pedido_timeout_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    */
    transportista_habilitado_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    //Helpers
    set_timers = function(){
        if (ctlr.pedidos && !ctlr.timerInterval){
            ctlr.timerInterval = local_interval(function(){
                if (ctlr.pedidos && ctlr.pedidos.length > 0){
                    ctlr.pedidos.forEach(function(element,index,array){
                        if (element.estado == 'PendienteConfirmacion' || element.estado == 'PendienteConfirmacionProveedor') {
                            if (element.timer.minute > 0 || element.timer.second > 1) {

                                if (element.timer.second > 0) {
                                    element.timer.second -= 1;
                                } else {
                                    if (element.timer.minute > 0) {
                                        element.timer.minute -= 1;
                                        element.timer.second = 59;
                                    }
                                }

                                if (element.timer.minute >= 10) {
                                    element.timer.value = element.timer.minute;
                                } else {
                                    element.timer.value = "0" + element.timer.minute;
                                }
                                element.timer.value += ":"
                                if (element.timer.second >= 10) {
                                    element.timer.value += element.timer.second;
                                } else {
                                    element.timer.value += "0" + element.timer.second;
                                }

                            } else {
                                local_pedidos_pendientes_viewmodel.timeout_pedido(element, timeout_pedido_callback);
                            }
                        }
                    });
                }
            },1000);
        }
    };

})();
/**
 * Created by dcoellar on 12/7/15.
 */
/**
 * Created by dcoellar on 9/18/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_rootScope;
    var local_scope;
    var local_location;
    var local_transportistas_proveedor_viewmodel;

    // Constructor
    var init;

    // Methods

    //Data callbacks
    var check_context_initialization_callback;
    var get_transportistas_callback;
    var local_habilitar_callback;

    //Notifications callbacks
    var new_pedidos_callback;
    var pedido_tomado_callback;
    var pedido_rechazado_callback;
    var pedido_confirmado_proveedor_callback;
    var pedido_completado_callback;
    var pedido_cancelado_confirmado_callback;
    var pedido_cancelado_confirmado_proveedor_callback;
    var pedido_cancelado_callback;
    var pedido_cancelado_proveedor_callback;
    var transportista_habilitado_callback;

    angular.module("easyRuta")
        .controller('TransportistasProveedorController',function($rootScope,$scope,$location,transportistas_proveedor_viewmodel) {
            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_location = $location;
            local_transportistas_proveedor_viewmodel = transportistas_proveedor_viewmodel;

            ctlr.AgregarTransportista = function(){
                local_location.path("/detalleTransportista/");
            };
            ctlr.DetalleTransportista = function(transportista){
                local_location.path("/detalleTransportista/" + transportista.id);
            };

            init();
        });

    // Constructor
    init = function() {
        local_transportistas_proveedor_viewmodel.check_context_initialization(check_context_initialization_callback);

        //suscribe to events
        local_scope.$on(local_rootScope.channels.new_pedidos, new_pedidos_callback);
        local_scope.$on(local_rootScope.channels.pedido_tomado, pedido_tomado_callback);
        local_scope.$on(local_rootScope.channels.pedido_rechazado, pedido_rechazado_callback);
        local_scope.$on(local_rootScope.channels.pedido_confirmado_proveedor, pedido_confirmado_proveedor_callback);
        local_scope.$on(local_rootScope.channels.pedido_completado, pedido_completado_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_confirmado, pedido_cancelado_confirmado_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_confirmado_proveedor, pedido_cancelado_confirmado_proveedor_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado, pedido_cancelado_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_proveedor, pedido_cancelado_proveedor_callback);
        local_scope.$on(local_rootScope.channels.transportista_habilitado, transportista_habilitado_callback);
    };

    // "Public" methods

    // Methods

    //Data callbacks
    check_context_initialization_callback = function(error,results){
        ctlr.isDespachador = false
        if (local_rootScope.despachador){
            ctlr.isDespachador = true
            local_transportistas_proveedor_viewmodel.get_transpostistas_despachador(null,false,null,get_transportistas_callback);
        }
        ctlr.isProveedor = false
        if (local_rootScope.proveedor){
            ctlr.isProveedor = true
            local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
        }
    };
    get_transportistas_callback = function(error,results){
        if (!error){
            ctlr.transportistas = results;
            local_scope.$apply();
        }
    };

    //Notifications callbacks
    new_pedidos_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_tomado_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_rechazado_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_confirmado_proveedor_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_completado_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_cancelado_confirmado_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_cancelado_confirmado_proveedor_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_cancelado_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_cancelado_proveedor_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    transportista_habilitado_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
})();
/**
 * Created by dcoellar on 10/25/15.
 */


(function(){

    //Variables
    var ctlr;
    var loca_scope;
    var local_uibModalInstance;
    var local_utils;
    var local_rate_transportista_modal_viewmodel;

    //Constructos
    var modal_init;

    //Methods
    //"Public" Methods
    var modal_ok;
    var modal_cancel;

    //Data Callbacks
    var local_get_pedidos_completados_callback;
    var local_save_all_callback;

    angular.module("easyRuta")
        .controller('RateTransportistaModalController',function($scope,$uibModalInstance,utils,rate_transportista_modal_viewmodel){

            ctlr = this;
            loca_scope = $scope;
            local_uibModalInstance = $uibModalInstance;
            local_utils = utils;
            local_rate_transportista_modal_viewmodel = rate_transportista_modal_viewmodel;

            ctlr.ok = modal_ok;
            ctlr.cancel = modal_cancel;

            modal_init();
        });

    //Constructor
    modal_init= function(){
        local_rate_transportista_modal_viewmodel.get_pedidos_completados(local_get_pedidos_completados_callback)
    };

    //Methods

    //"Public" Methods
    modal_ok = function () {
        local_rate_transportista_modal_viewmodel.save_all(ctlr.pedidos,local_save_all_callback);
    };
    modal_cancel = function () {
        local_uibModalInstance.dismiss('cancel');
    };

    //Data Callbacks
    local_get_pedidos_completados_callback = function(error,results){
        if (!error){
            ctlr.pedidos = results;
            loca_scope.$apply()
        }
    };
    local_save_all_callback = function(error,results){
        if (!error) {
            local_uibModalInstance.close();
        }else{

            //TODO - let user know
        }
    }
})();
/**
 * Created by dcoellar on 11/26/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_scope;
    var local_uibModalInstance;

    // Constructor
    var init;

    // "Public" methods
    var confirmar;
    var cancelar;

    angular.module("easyRuta")
        .controller('ConfirmDialogController',function($scope,$uibModalInstance){

            ctlr = this;
            local_scope = $scope;
            local_uibModalInstance = $uibModalInstance;

            ctlr.confirmar = confirmar;
            ctlr.cancelar = cancelar;

            init();
        });

    init = function(){
        ctlr.Message = local_scope.confirm_message;
    };

    confirmar = function(){
        local_uibModalInstance.close('ok');
    };
    cancelar = function(){
        local_uibModalInstance.dismiss('cancel');
    };

})();
/**
 * Created by dcoellar on 7/3/16.
 */

(function(){

    angular.module("easyRuta")
        .controller('inicioDespachadoresController',function(){

            console.log("inicio despachadores controller");

        });
})();
/**
 * Created by dcoellar on 4/6/16.
 */

(function(){
    angular.module("easyRuta")
        .controller('MasterController',function($rootScope) {

        });
});
/**
 * Created by dcoellar on 11/26/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_scope;
    var local_uibModalInstance;
    var local_notifications_center_viewmodel;

    // Constructor
    var init;

    // "Public" methods
    var cerrar;

    // Data callbacks
    var local_get_notfications_callback;

    angular.module("easyRuta")
        .controller('notifications_center_controller',function($scope,$uibModalInstance,notifications_center_viewmodel){

            ctlr = this;
            local_scope = $scope;
            local_uibModalInstance = $uibModalInstance;
            local_notifications_center_viewmodel = notifications_center_viewmodel

            ctlr.cancelar = cerrar;

            init();
        });

    // Constructor
    init = function(){
        local_notifications_center_viewmodel.get_notifications(local_get_notfications_callback)
    };

    // "Public" methods
    cerrar = function(){
        local_uibModalInstance.dismiss('cancel');
    };

    // Data callbacks
    local_get_notfications_callback = function(error,results){
        ctlr.notifications = results;
        local_scope.$apply();
    }

})();
/**
 * Created by dcoellar on 9/14/15.
 */
(function(){

    angular.module("easyRuta")
        .controller('RegisterController',function(){
            this.user = {email : "", password :"", confirmedPassword:""};

            this.Register = function(){

                var newuser = new Parse.User();
                newuser.set("username", this.user.email);
                newuser.set("password", this.user.password);
                newuser.set("email", this.user.email);

                newuser.signUp(null, {
                    success: function(user) {
                        console.log("Success");
                    },
                    error: function(user, error) {
                        console.dir(user);
                        console.dir(error);
                        console.log("Fail");
                    }
                });
            }
        });

})();
/**
 * Created by dcoellar on 9/15/15.
 */

(function(){

    //Variables
    var ctlr;
    var local_root_scope;
    var local_route_params;
    var local_scope;
    var local_detalle_pedido_viewmodel;
    var local_uiGmapGoogleMapApi;

    // Constructor
    var init;

    //Data callbacks
    var get_pedido_callback;

    angular.module("easyRuta")
        .controller('DetallePedidoController',function($rootScope, $routeParams,$scope,detalle_pedido_viewmodel,uiGmapGoogleMapApi){

            ctlr = this;
            local_root_scope = $rootScope
            local_route_params = $routeParams
            local_scope = $scope
            local_detalle_pedido_viewmodel = detalle_pedido_viewmodel;
            local_uiGmapGoogleMapApi = uiGmapGoogleMapApi;

            init();
        });

    // Constructor
    init = function() {
        ctlr.id = local_route_params.id;
        local_detalle_pedido_viewmodel.get_pedido(ctlr.id,get_pedido_callback);
        local_scope.map = { center: { latitude:  -1.569363, longitude: -78.705796 }, zoom: 7 };
        local_scope.polylines = [];
    };

    // Methods

    //Data callbacks
    get_pedido_callback = function(error,results){
        if (!error){
            ctlr.pedido = results;

            local_uiGmapGoogleMapApi.then(function(){
                local_scope.polylines = ctlr.pedido.locations;
            });

            local_scope.$apply();
        }
    };
})();

/**
 * Created by dcoellar on 11/16/15.
 */

(function(){

    //Variables
    var ctlr;
    var local_root_scope;
    var local_scope;
    var local_location;
    var local_historico_view_model;

    //Constructor
    var init;

    //"Public" methods
    var verDetalle;

    //Dara callbacks
    var get_historico_pedidos_callback;

    angular.module("easyRuta")
        .controller('historicoController',function($rootScope,$scope,$location,historico_view_model){

            ctlr = this;
            local_root_scope = $rootScope;
            local_scope = $scope;
            local_location = $location
            local_historico_view_model = historico_view_model;

            ctlr.verDetalle = verDetalle;

            init();

        });

    //Constructor
    init = function(){
        local_historico_view_model.get_historico_pedidos(get_historico_pedidos_callback)
    };

    //"Public" methods
    verDetalle = function(id) {
        local_location.path("/detallePedido/" + id);
    };

    //Data callbacks
    get_historico_pedidos_callback = function(error,results){
        if (!error){
            ctlr.pedidos = results;
            local_scope.$apply();
        }
    };

})();
/**
 * Created by dcoellar on 9/18/15.
 */

(function(){

    angular.module("easyRuta")
        .controller('inicioClientesController',function(){

            console.log("inicio clientes controller");

        });
})();
/**
 * Created by dcoellar on 11/17/15.
 */

(function(){

    //Variable
    var ctlr;
    var local_root_scope;
    var local_scope;
    var local_window;
    var local_perfil_viewmodel;

    //Contructor
    var init;

    //"Public" Methods
    var save;
    var load_image;

    //Methods

    //Data Callbacks
    var save_perfil_callback;
    var get_proveedor_callback;
    var get_cliente_callback;

    //Helpers
    var load_empresa;

    angular.module("easyRuta")
        .controller('perfilController',function($rootScope,$scope,$window,perfil_viewmodel){

            ctlr = this;
            local_root_scope = $rootScope;
            local_scope = $scope;
            local_window = $window;
            local_perfil_viewmodel = perfil_viewmodel;

            ctlr.Save = save;
            ctlr.LoadImage = load_image;

            init();
        });

    //Constructor
    init = function(){
        $('#image').bind("change", ctlr.LoadImage);
        local_perfil_viewmodel.get_cliente(get_cliente_callback);
    };

    //"Public" Methods
    save  = function(){
        $('#btnSave').prop('disabled', true);
        $("#btnSave").html('Guardando...');

        local_perfil_viewmodel.save(ctlr.object,ctlr.selectedImage,save_perfil_callback)
    };
    load_image = function(e) {
        var files = e.target.files || e.dataTransfer.files;

        var reader = new FileReader();
        reader.onload = function (e) {
            ctlr.object.photo = e.target.result;
            local_scope.$apply();
        }
        reader.readAsDataURL(files[0]);
        ctlr.selectedImage = files[0];
    }
    //Methods

    //Data Callbacks
    save_perfil_callback = function(error,resutls){
        if (!error){
            local_window.history.back();
        }else{
            //TODO - Show error to user
            $('#btnSave').prop('disabled', false);
            $("#btnSave").html('Guardar');
        }
    };
    get_proveedor_callback = function(error,results){
        if(!error && results){
            load_empresa(results)
        }
    };
    get_cliente_callback = function(error,results){
        if(!error && results) {
            load_empresa(results)
        }
    };

    //Helpers
    load_empresa = function(object){
        ctlr.object = object;
        local_scope.$apply();
    }

})();
/**
 * Created by dcoellar on 9/18/15.
 */

(function(){

    angular.module("easyRuta")
        .controller('inicioProveedoresController',function(){

            console.log("inicio proveedores controller");

        });
})();
/**
 * Created by dcoellar on 12/15/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_rootScope;
    var local_scope;
    var local_window;
    var local_routeParams;
    var local_transportista_edit_viewmodel;

    // Constructor
    var init;

    // "Public" methods
    var save;
    var cancel;
    var borrar;
    var habilitar;
    var deshabilitar;
    var tipoTransporteSeleccionado;
    var add_asignacion;
    var delete_asignacion;

    // Methods

    //Data callbacks
    var get_transportista_callback;
    var get_viajes_count_callback;
    var get_asignaciones_transportista_callback;
    var get_asignaciones_proveedor_callback;
    var save_callback;
    var delete_callback;
    var habilitar_callback;
    var deshabilitar_callback;
    var add_asignacion_callback;
    var delete_asignacion_callback;

    angular.module("easyRuta")
        .controller('TransportistaEditController',function($rootScope,$scope,$window,$routeParams,transportista_edit_viewmodel) {

            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_window = $window;
            local_routeParams = $routeParams;
            local_transportista_edit_viewmodel = transportista_edit_viewmodel;

            ctlr.save = save;
            ctlr.cancel = cancel;
            ctlr.delete = borrar;
            ctlr.habilitar = habilitar;
            ctlr.deshabilitar = deshabilitar;
            ctlr.TipoTransporteSeleccionado = tipoTransporteSeleccionado;
            ctlr.AddAsignacion = add_asignacion;
            ctlr.DeleteAsignacion = delete_asignacion;

            init();
        });

    // Constructor
    init = function() {
        if (local_routeParams.id){
            local_transportista_edit_viewmodel.get_transportista(local_routeParams.id,get_transportista_callback);
        }
    };

    // "Public" methods
    save = function() {
        var fileUploadControl = $("#image")[0];
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = file.name;
            local_transportista_edit_viewmodel.save(ctlr.transportista,name,file,save_callback);
        }else{
            local_transportista_edit_viewmodel.save(ctlr.transportista,null,null,save_callback);
        }

    };
    cancel = function() {
        local_window.history.back();
    };
    borrar = function() {
        local_transportista_edit_viewmodel.delete(ctlr.transportista,delete_callback);
    };
    habilitar = function(id){
        if (id){
            ctlr.assignaciones.forEach(function(element,index,array){
                if (element.id == id){
                    ctlr.cliente = element.object;
                }
            });
        }
        local_transportista_edit_viewmodel.habilitar(ctlr.transportista,ctlr.cliente,habilitar_callback);
    };
    deshabilitar = function(){
        local_transportista_edit_viewmodel.deshabilitar(ctlr.transportista,habilitar_callback);
    };
    tipoTransporteSeleccionado = function(tipoTransporte){
        ctlr.transportista.tipoTransporte = tipoTransporte;
    };
    add_asignacion = function(id){
        var empresa;
        ctlr.assignaciones_proveedor.forEach(function(element,index,array){
            if (element.id == id){
                empresa = element;
            }
        });
        if (empresa){
            local_transportista_edit_viewmodel.add_asignacion(ctlr.transportista.object,empresa,add_asignacion_callback);
        }
    };
    delete_asignacion = function(id){
        var empresa;
        ctlr.assignaciones.forEach(function(element,index,array){
            if (element.id == id){
                empresa = element;
            }
        });
        if (empresa){
            local_transportista_edit_viewmodel.delete_asignacion(ctlr.transportista.object,empresa,delete_asignacion_callback);
        }
    };
    // Methods

    //Data callbacks
    get_transportista_callback = function(error,results){
        if (!error) {
            ctlr.transportista = results;
            ctlr.isDespachador = false
            if (local_rootScope.despachador){
                ctlr.isDespachador = true
                ctlr.cliente = local_rootScope.cliente;
            }else{
                local_transportista_edit_viewmodel.get_asignaciones_transportista(results.object,get_asignaciones_transportista_callback);
            }
            local_transportista_edit_viewmodel.get_viajes_count(results.object,get_viajes_count_callback);
        }
    };
    get_viajes_count_callback = function(error,result){
        if (ctlr.transportista.estado == local_rootScope.transportistas_estados.NoDisponible){
            ctlr.showHabilitar = true
            ctlr.showDeshabilitar = false
        }else if (ctlr.transportista.estado == local_rootScope.transportistas_estados.EnViaje){
            if (result > 0){
                ctlr.showHabilitar = false
            } else {
                ctlr.showHabilitar = true
            }
            ctlr.showDeshabilitar = false
        }else{
            ctlr.showHabilitar = false
            ctlr.showDeshabilitar = true
        }
        local_scope.$apply()
    };
    get_asignaciones_transportista_callback = function(error,result){
        ctlr.assignaciones = result;
        local_transportista_edit_viewmodel.get_asignaciones_proveedor(local_rootScope.proveedor,get_asignaciones_proveedor_callback);
    };
    get_asignaciones_proveedor_callback = function(error,result){
        ctlr.assignaciones_proveedor = []
        result.forEach(function (element,index,array){
            var found = false;
            ctlr.assignaciones.forEach(function (e,i,a){
                if (element.id == e.id){
                    found = true;
                }
            });
            if (!found){
                ctlr.assignaciones_proveedor.push(element);
            }
        });
        local_scope.$apply();
    };
    save_callback = function(error,result){
        if (!error){
            local_window.history.back();
        }
    };
    delete_callback = function(error,result){
        if (!error){
            local_window.history.back();
        }
    };
    habilitar_callback = function(error,result){
        if (!error){
            local_window.history.back();
        }
    };
    deshabilitar_callback = function(error,result){
        if (!error){
            local_window.history.back();
        }
    };
    add_asignacion_callback = function(error,result){
        if (!error){
            local_transportista_edit_viewmodel.get_asignaciones_transportista(ctlr.transportista.object,get_asignaciones_transportista_callback);
        }
    };
    delete_asignacion_callback = function(error,result){
        if (!error){
            local_transportista_edit_viewmodel.get_asignaciones_transportista(ctlr.transportista.object,get_asignaciones_transportista_callback);
        }
    };
})();

/**
 * Created by dcoellar on 11/26/15.
 */

(function() {

    //Variables
    var local_rootScope;
    var local_pubnub_services;
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_plantillas;
    var local_delete_plantilla;
    var local_get_plantilla;
    var local_get_ciudades;
    var local_get_transpostistas_despachador;
    var local_get_active_transportistas;
    var local_guardar_pedidos;

    //Methods

    //View Controller callbacks references
    var get_plantillas_callback;
    var get_plantilla_callback;
    var delete_plantilla_callback;
    var get_ciudades_callback;
    var get_transpostistas_despachador_callback;
    var get_active_transportistas_callback;
    var guardar_pedidos_callback;

    //Data callbacks
    var local_get_plantillas_callback;
    var local_get_plantilla_callback;
    var local_delete_plantilla_callback;
    var local_get_ciudades_callback;
    var local_get_transpostistas_despachador_callback;
    var local_get_active_transportistas_callback;
    var local_guardar_pedidos_callback

    angular.module("easyRuta")
        .factory('agregar_pedido_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_pubnub_services = pubnub_services;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_plantillas : function(callback) {
            local_get_plantillas(callback);
        },
        get_plantilla : function(id,callback) {
            local_get_plantilla(id,callback);
        },
        delete_plantilla : function(id,callback){
            local_delete_plantilla(id,callback);
        },
        get_ciudades : function(callback) {
            local_get_ciudades(callback);
        },
        get_transpostistas_despachador : function(proveedor,isForPedido,tipoTransporte,callback) {
            local_get_transpostistas_despachador(proveedor,isForPedido,tipoTransporte,callback);
        },
        get_active_transportistas : function (callback){
            local_get_active_transportistas(callback);
        },
        guardar_pedidos : function (data,transportista,callback){
            local_guardar_pedidos(data,transportista,callback);
        }
    }

    //"Public" Methods
    local_get_plantillas = function(callback){
        get_plantillas_callback = callback;
        local_data_services.get_plantillas([],local_get_plantillas_callback)
    };
    local_get_plantilla = function(id,callback){
        get_plantilla_callback =  callback;
        local_data_services.get_plantilla([id],local_get_plantilla_callback)
    };
    local_delete_plantilla = function(id,callback){
        delete_plantilla_callback =  callback;
        local_data_services.delete_plantilla([id],local_delete_plantilla_callback)
    },
    local_get_ciudades = function(callback){
        get_ciudades_callback = callback;
        local_data_services.get_ciudades([],local_get_ciudades_callback)
    };
    local_get_transpostistas_despachador = function(proveedor,isForPedido,tipoTransporte,callback){
        get_transpostistas_despachador_callback = callback;
        local_data_services.transportistas_despachador([local_rootScope.cliente,proveedor,isForPedido,tipoTransporte],local_get_transpostistas_despachador_callback)
    };
    local_get_active_transportistas = function (callback){
        get_active_transportistas_callback = callback;
        local_pubnub_services.here_now(local_get_active_transportistas_callback)
    };
    local_guardar_pedidos = function(data,transportista,callback){
        guardar_pedidos_callback = callback;
        local_data_services.guardar_pedidos([data,local_rootScope.cliente,transportista],local_guardar_pedidos_callback)
    };

    //Methods

    //Data callbacks
    local_get_plantillas_callback = function(params,error,results){
        if (!error){
            var plantillas = new Array;
            results.forEach(function(element,index,array){
                plantillas.push({id:element.id,plantilla:element.get('Plantilla')})
            });
            get_plantillas_callback(null,plantillas);
        }else{
            get_plantillas_callback(error,null);
        }
    };
    local_get_plantilla_callback = function(params,error,results){
        if (!error){
            get_plantilla_callback(null,results);
        }else{
            get_plantilla_callback(error,null);
        }
    };
    local_delete_plantilla_callback = function(params,error,results){
        if (!error){
            get_plantillas_callback(null,results);
        }else{
            get_plantillas_callback(error,null);
        }
    };
    local_get_ciudades_callback = function(params,error,results){
        if (!error){
            var ciudades = new Array;
            results.forEach(function(element,index,array){
                ciudades.push({id:element.id,nombre:element.get('Nombre')})
            });
            get_ciudades_callback(null,ciudades);
        }else{
            get_ciudades_callback(error,null);
        }
    };
    local_get_transpostistas_despachador_callback = function(params,error,results){
        if (!error){
            var transportistas = new Array();
            results.forEach(function(element,index,array){
                if (element.get("Estado") == local_rootScope.transportistas_estados.Disponible){
                    transportistas.push(local_parser.getTransportistaJson(element));
                }
            });
            if (transportistas.length > 0) {
                transportistas.sort(function (a, b) {
                    if (a.object.get("EsTercero") != b.object.get("EsTercero")) {
                        return a.object.get("EsTercero") ? 1 : -1;
                    }
                    return a.object.get("HoraDisponible") - b.object.get("HoraDisponible");
                });
                var count = 0;
                transportistas = transportistas
                    .filter(function (object) {
                        return params[3] == object.tipoTransporte
                        || (params[3] == "furgon_plataforma"
                        && (params[3] == "furgon" || object.tipoTransporte == "plataforma"))
                    })
                    .map(function (object) {
                        count++;
                        object.priority = count;
                        return object;
                    }
                );
            }
            get_transpostistas_despachador_callback(null,transportistas)
        }else{
            get_transpostistas_despachador_callback(error,null)
        }
    };
    local_get_active_transportistas_callback = function(results){
        get_active_transportistas_callback(results);
    }
    local_guardar_pedidos_callback = function(params,error,results){
        if (!error){
            local_rootScope.$broadcast('new_pedidos', {});
            local_pubnub_services.publish(local_rootScope.channels.new_pedidos, {message:"New Pedido"})

            guardar_pedidos_callback(null,results);
        }else{
            guardar_pedidos_callback(error,null);
        }
    }

})();

/**
 * Created by dcoellar on 12/15/15.
 */

(function() {

    //Variables
    var local_rootScope;
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_pedido;

    //Methods

    //View Controller callbacks references
    var get_pedido_callback;

    //Data callbacks
    var local_get_pedido_callback;

    angular.module("easyRuta")
        .factory('detalle_pedido_viewmodel',function($rootScope,data_services,parser) {

            local_rootScope = $rootScope;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_pedido : function(id,callback){
            local_get_pedido(id,callback);
        }
    }

    //"Public" Methods
    local_get_pedido = function(id,callback){
        get_pedido_callback = callback;
        local_data_services.get_pedido([id],local_get_pedido_callback)
    };

    //Methods

    //Data callbacks
    local_get_pedido_callback = function(params,error,results){
        if (!error){
            var pedido = local_parser.getJson(results);
            pedido.transportista = local_parser.getTransportistaJson(results.get("Transportista"));
            if (local_rootScope.cliente && pedido.object.get("Proveedor")){
                pedido.transportista = local_parser.parseProveedorIntoTransportista(pedido.transportista,pedido.object.get("Proveedor"));
            }
            get_pedido_callback(null,pedido);
        }else{
            get_pedido_callback(error,null);
        }
    };
})();
/**
 * Created by dcoellar on 12/18/15.
 */

(function() {

    //Variables
    var local_rootScope;
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_historico_pedidos;

    //Methods

    //View Controller callbacks references
    var get_historico_pedidos_callback;

    //Data callbacks
    var local_get_historico_pedidos_callback;

    angular.module("easyRuta")
        .factory('historico_view_model',function($rootScope,data_services,parser) {

            local_rootScope = $rootScope
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_historico_pedidos : function(callback) {
            local_get_historico_pedidos(callback);
        }
    }

    //"Public" Methods
    local_get_historico_pedidos = function(callback){
        get_historico_pedidos_callback = callback;
        local_data_services.get_historico_pedidos([],local_get_historico_pedidos_callback)
    };

    //Methods

    //Data callbacks
    local_get_historico_pedidos_callback = function(params,error,results){
        if (!error){
            var pedidos = new Array;
            results.forEach(function(element,index,array){
                var pedido = local_parser.getJson(element);
                pedido.transportista = local_parser.getTransportistaJson(element.get("Transportista"));
                if (local_rootScope.cliente && pedido.object.get("Proveedor")){
                    pedido.transportista = local_parser.parseProveedorIntoTransportista(pedido.transportista,pedido.object.get("Proveedor"));
                }
                pedidos.push(pedido)
            });
            get_historico_pedidos_callback(null,pedidos);
        }else{
            get_historico_pedidos_callback(error,null);
        }
    };

})();

/**
 * Created by dcoellar on 12/21/15.
 */

(function() {

    //Variables
    var local_data_services;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_saldo;
    var local_get_notifications_count

    //Methods

    //View Controller callbacks references
    var get_saldo_callback;
    var get_notifications_count_callback;

    //Data callbacks
    var local_current_proveedor_callback;
    var local_get_notifications_count_callback;

    angular.module("easyRuta")
        .factory('master_page_viewmodel',function(data_services) {

            local_data_services = data_services;

            return constructor;
        });

    //Constructor
    constructor = {
        get_saldo : function(callback) { local_get_saldo(callback); },
        get_notifications_count : function(callback) { local_get_notifications_count(callback); }
    }

    //"Public" Methods
    local_get_saldo = function(callback){
        get_saldo_callback = callback;
        local_data_services.current_proveedor([],local_current_proveedor_callback)
    };
    local_get_notifications_count = function(callback){
        get_notifications_count_callback = callback;
        local_data_services.notifications_count([],local_get_notifications_count_callback);
    };

    //Methods

    //Data callbacks
    local_current_proveedor_callback = function(params,error,proveedor){
        if (!error){
            if (proveedor){
                get_saldo_callback(null,proveedor.get("Saldo"));
            }
        }else{
            get_saldo_callback(error,null);
        }
    };
    local_get_notifications_count_callback = function(params,error,count){
        if (!error){
            get_notifications_count_callback(null,count);
        }else{
            get_notifications_count_callback(error,0);
        }
    }

})();
/**
 * Created by dcoellar on 1/6/16.
 */

(function() {

    //Variables
    var local_rootScope;
    var local_pubnub_services;
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_notifications;

    //Methods

    //View Controller callbacks references
    var get_notifications_callback;

    //Data callbacks
    var local_get_notifications_callback;
    var local_clear_notifications_callback;

    angular.module("easyRuta")
        .factory('notifications_center_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_pubnub_services = pubnub_services;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_notifications : function(callback) {local_get_notifications(callback);}
    };

    //"Public" Methods
    local_get_notifications = function(callback){
        get_notifications_callback = callback;
        local_data_services.get_notifications([],local_get_notifications_callback)
    };

    //Methods

    //Data callbacks
    local_get_notifications_callback = function(params,error,results){
        if (!error){
            var notifications = new Array;
            results.forEach(function(element,index,array){
                var notification = local_parser.getNotificationJson(element);
                if (element.get("Pedido")){
                    notification.pedido = local_parser.getJson(element.get("Pedido"));
                    if (element.get("Pedido").get("Transportista")){
                        notification.pedido.transportista = local_parser.getTransportistaJson(element.get("Pedido").get("Transportista"));
                        if (local_rootScope.cliente && pedido.object.get("Proveedor")){
                            notification.pedido.transportista = local_parser.parseProveedorIntoTransportista(notification.pedido.transportista,notification.pedido.object.get("Proveedor"));
                        }
                    }
                }
                notifications.push(notification);
            });
            get_notifications_callback(null,notifications);

            local_data_services.clear_notifications([],local_clear_notifications_callback);
        }else{
            get_notifications_callback(notifications,null);
        }
    };
    local_clear_notifications_callback = function(params,error,results){
        if(!error){
            local_pubnub_services.publish(local_rootScope.channels.clear_notifications,{id:"cleared:" + results.length});
            local_rootScope.$broadcast(local_rootScope.channels.clear_notifications, {id:"cleared:" + results.length});
        }
    };
})();
/**
 * Created by dcoellar on 11/25/15.
 */

(function() {

    //Variables
    var local_rootScope;
    var local_pubnub_services;
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_pedidos_activos;
    var local_cancelar_pedido;
    var local_iniciar_pedido;

    //Methods

    //View Controller callbacks references
    var get_pedidos_activos_callback;
    var cancelar_pedido_callback;
    var iniciar_pedido_callback;

    //Data callbacks
    var local_get_pedidos_activos_callback;
    var local_cancelar_pedido_callback;
    var local_iniciar_pedido_callback;
    var agregar_notification_callback;

    angular.module("easyRuta")
        .factory('pedidos_activos_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_pubnub_services = pubnub_services;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_pedidos_activos : function(callback) {local_get_pedidos_activos(callback);},
        cancelar_pedido : function(pedido,callback) { local_cancelar_pedido(pedido,callback); },
        iniciar_pedido : function(pedido,callback) { local_iniciar_pedido(pedido,callback); }
    }

    //"Public" Methods
    local_get_pedidos_activos = function(callback){
        get_pedidos_activos_callback = callback;
        local_data_services.get_pedidos_activos([],local_get_pedidos_activos_callback)
    };
    local_cancelar_pedido = function(pedido,callback){
        cancelar_pedido_callback = callback;
        local_data_services.cancelar_pedido([pedido.object],local_cancelar_pedido_callback);
    };
    local_iniciar_pedido = function(pedido,callback){
        iniciar_pedido_callback = callback;
        local_data_services.iniciar_pedido([pedido.object],local_iniciar_pedido_callback);
    };

    //Methods

    //Data callbacks
    local_get_pedidos_activos_callback = function(params,error,results){
        if (!error){
            var pedidos = new Array;
            results.forEach(function(element,index,array){
                var pedido = local_parser.getJson(element);
                pedido.transportista = local_parser.getTransportistaJson(element.get("Transportista"));
                if (local_rootScope.cliente && pedido.object.get("Proveedor")){
                    pedido.transportista = local_parser.parseProveedorIntoTransportista(pedido.transportista,pedido.object.get("Proveedor"));
                }
                pedidos.push(pedido);
            });
            get_pedidos_activos_callback(null,pedidos);
        }else{
            get_pedidos_activos_callback(error,null);
        }
    };
    local_cancelar_pedido_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_cancelado,{id:params[0].id});
        local_rootScope.$broadcast(local_rootScope.channels.pedido_cancelado, {id:params[0].id});

        local_data_services.agregar_notification(["Pedido Cancelado",params[0]],agregar_notification_callback);

        cancelar_pedido_callback(error,results);
    };
    local_iniciar_pedido_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_iniciado,{id:params[0].id})
        local_rootScope.$broadcast(local_rootScope.channels.pedido_iniciado, {id:params[0].id});
        iniciar_pedido_callback(error,results);
    };
    agregar_notification_callback = function(params,error,results){
        if (!error){
            local_pubnub_services.publish(local_rootScope.channels.nueva_notificacion,{id:params[1].id})
        }
    };
})();
/**
 * Created by dcoellar on 11/25/15.
 */

(function() {

    //Variables
    var local_rootScope;
    var local_pubnub_services;
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_pedidos_completados;

    //Methods

    //View Controller callbacks references
    var get_pedidos_completados_callback;

    //Data callbacks
    var local_get_pedidos_completados_callback;

    angular.module("easyRuta")
        .factory('pedidos_completados_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_pubnub_services = pubnub_services;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_pedidos_completados : function(callback) {
            local_get_pedidos_completados(callback);
        }
    }

    //"Public" Methods
    local_get_pedidos_completados = function(callback){
        get_pedidos_completados_callback = callback;
        local_data_services.get_pedidos_completados([],local_get_pedidos_completados_callback)
    };

    //Methods

    //Data callbacks
    local_get_pedidos_completados_callback = function(params,error,results){
        if (!error){
            var pedidos = new Array;
            results.forEach(function(element,index,array){
                var pedido = local_parser.getJson(element);
                pedido.transportista = local_parser.getTransportistaJson(element.get("Transportista"));
                if (local_rootScope.cliente && pedido.object.get("Proveedor")){
                    pedido.transportista = local_parser.parseProveedorIntoTransportista(pedido.transportista,pedido.object.get("Proveedor"));
                }
                pedidos.push(pedido)
            });
            get_pedidos_completados_callback(error,pedidos);
        }else{
            get_pedidos_completados_callback(error,null);
        }
    };

})();

/**
 * Created by dcoellar on 11/25/15.
 */

(function() {

    //Variables
    var local_rootScope;
    var local_pubnub_services;
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_pedidos_en_curso;
    var local_finalizar_pedido;

    //Methods

    //View Controller callbacks references
    var get_pedidos_en_curso_callback;
    var finalizar_pedido_callback;

    //Data callbacks
    var local_get_pedidos_en_curso_callback;
    var local_finalizar_pedido_callback

    angular.module("easyRuta")
        .factory('pedidos_en_curso_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_pubnub_services = pubnub_services;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_pedidos_en_curso : function(callback) {local_get_pedidos_en_curso(callback);},
        finalizar_pedido : function(pedido,callback) {local_finalizar_pedido(pedido,callback);},
    };

    //"Public" Methods
    local_get_pedidos_en_curso = function(callback){
        get_pedidos_en_curso_callback = callback;
        local_data_services.get_pedidos_en_curso([],local_get_pedidos_en_curso_callback)
    };
    local_finalizar_pedido = function(pedido,callback){
        finalizar_pedido_callback = callback;
        local_data_services.finalizar_pedido([pedido.object],local_finalizar_pedido_callback)
    };
    //Methods

    //Data callbacks
    local_get_pedidos_en_curso_callback = function(params,error,results){
        if (!error){
            var pedidos = new Array;
            results.forEach(function(element,index,array){
                var pedido = local_parser.getJson(element);
                pedido.transportista = local_parser.getTransportistaJson(element.get("Transportista"));
                if (local_rootScope.cliente && pedido.object.get("Proveedor")){
                    pedido.transportista = local_parser.parseProveedorIntoTransportista(pedido.transportista,pedido.object.get("Proveedor"));
                }
                pedidos.push(pedido);
            });
            get_pedidos_en_curso_callback(null,pedidos);
        }else{
            get_pedidos_en_curso_callback(error,null);
        }
    };
    local_finalizar_pedido_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_completado,{id:params[0].id})
        local_rootScope.$broadcast(local_rootScope.channels.pedido_completado, {id:params[0].id});
        finalizar_pedido_callback(error,results);
    };
})();
/**
 * Created by dcoellar on 11/18/15.
 */

(function() {

    //Variables
    var local_rootScope;
    var local_pubnub_services;
    var local_data_services;
    var local_parser;

    //Aux Variables
    var pedidosAux;
    var pedidosAux1;
    var pedidos_procesadosAux;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_pedidos_pendientes;
    var local_confirmar_pedido;
    var local_rechazar_pedido;
    var local_proveedor_tomar_pedido;
    var local_proveedor_confirmar_pedido;
    var local_proveedor_rechazar_pedido;
    var local_timeout_pedido;
    var local_cancelar_pedido;
    var local_ignorar_pedido;

    //Methods

    //View Controller callbacks references
    var get_pedidos_pendientes_callback;
    var confirmar_pedido_callback;
    var rechazar_pedido_callback;
    var proveedor_tomar_pedido_callback;
    var proveedor_confirmar_pedido_callback;
    var proveedor_rechazar_pedido_callback;
    var timeout_pedido_callback;
    var cancelar_pedido_callback;
    var ignorar_pedido_callback;

    //Data callbacks
    var local_get_pedidos_pendientes_callback;
    var local_confirmar_pedido_callback;
    var local_rechazar_pedido_callback;
    var local_proveedor_tomar_pedido_callback;
    var local_proveedor_confirmar_pedido_callback;
    var local_proveedor_rechazar_pedido_callback;
    var local_transportista_statistics_callback;
    var local_transportistas_proveedor_callback;
    var local_get_pedidos_pendientes_merge_callback;
    var local_timeout_pedido_callback;
    var local_cancelar_pedido_callback
    var local_ignorar_pedido_callback

    angular.module("easyRuta")
        .factory('pedidos_pendientes_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_pubnub_services = pubnub_services;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_pedidos_pendientes : function(callback) {
            local_get_pedidos_pendientes(callback);
        },
        confirmar_pedido : function(pedido,callback) { local_confirmar_pedido(pedido,callback); },
        rechazar_pedido : function(pedido,callback) { local_rechazar_pedido(pedido,callback); },
        proveedor_tomar_pedido : function(pedido,transportista,callback) { local_proveedor_tomar_pedido(pedido,transportista,callback); },
        proveedor_confirmar_pedido : function(pedido,transportista,callback) { local_proveedor_confirmar_pedido(pedido,transportista,callback); },
        proveedor_rechazar_pedido : function(pedido,callback) { local_proveedor_rechazar_pedido(pedido,callback); },
        timeout_pedido : function(pedido,callback) { local_timeout_pedido(pedido,callback); },
        cancelar_pedido : function(pedido,callback) { local_cancelar_pedido(pedido,callback); },
        ignorar_pedido : function(pedido,callback) { local_ignorar_pedido(pedido,callback); }
    };

    //"Public" Methods
    local_get_pedidos_pendientes = function(callback){
        get_pedidos_pendientes_callback = callback;
        local_data_services.get_pedidos_pendientes(new Array(),local_get_pedidos_pendientes_callback)
    };
    local_confirmar_pedido = function(pedido,callback){
        confirmar_pedido_callback = callback;
        local_data_services.confirmar_pedido([pedido.object],local_confirmar_pedido_callback);
    };
    local_rechazar_pedido = function(pedido,callback){
        rechazar_pedido_callback = callback;
        local_data_services.rechazar_pedido([pedido.object],local_rechazar_pedido_callback);
    };
    local_proveedor_tomar_pedido = function(pedido,transportista,callback){
        proveedor_tomar_pedido_callback = callback;
        local_data_services.proveedor_tomar_pedido([pedido.object,transportista.object,local_rootScope.proveedor],local_proveedor_tomar_pedido_callback);
    };
    local_proveedor_confirmar_pedido = function(pedido,transportista,callback){
        proveedor_confirmar_pedido_callback = callback;
        local_data_services.proveedor_confirmar_pedido([pedido.object,transportista.object],local_proveedor_confirmar_pedido_callback);
    };
    local_proveedor_rechazar_pedido = function(pedido,callback){
        proveedor_rechazar_pedido_callback = callback;
        local_data_services.proveedor_rechazar_pedido([pedido.object,local_rootScope.proveedor],local_proveedor_rechazar_pedido_callback);
    };
    local_timeout_pedido = function(pedido,callback){
        timeout_pedido_callback = callback;
        local_data_services.timeout_pedido([pedido.object],local_timeout_pedido_callback);
    };
    local_cancelar_pedido = function(pedido,callback){
        cancelar_pedido_callback = callback;
        local_data_services.cancelar_pedido([pedido.object],local_cancelar_pedido_callback);
    };
    local_ignorar_pedido = function(pedido,callback){
        ignorar_pedido_callback = callback;
        local_data_services.ignorar_pedido([pedido.object,local_rootScope.proveedor],local_ignorar_pedido_callback);
    };

    //Methods

    //Data callbacks
    local_get_pedidos_pendientes_callback = function(params,error,results){

        if (!error){
            pedidosAux1 = results;
            pedidosAux = new Array();
            pedidos_procesadosAux = 0;
            if (results.length > 0){
                results.forEach(function(element,index,array){
                    var pedido = local_parser.getJson(element);
                    if (local_rootScope.loggedInRole.getName() == "cliente"){
                        if (element.get("Proveedor")){
                            pedido.proveedor = local_parser.getProveedorJson(element.get("Proveedor"));
                        }
                        if (element.get("Transportista")){
                            local_data_services.transportista_statistics([element.get("Transportista"),pedido],local_transportista_statistics_callback);
                        }else{
                            local_transportista_statistics_callback([null,pedido],null,null);
                        }
                    }else if (local_rootScope.loggedInRole.getName() == "proveedor"){
                        if ((local_rootScope.proveedor.get("Saldo") - pedido.object.get("Comision")) < local_rootScope.proveedor.get("SaldoMin")){
                            pedido.valores = pedido.valores + " - Saldo Insuficiente!!!"
                        }
                        if (element.get("Estado") == local_rootScope.pedidos_estados.Pendiente || element.get("Estado") == local_rootScope.pedidos_estados.PendienteConfirmacionProveedor){
                            local_data_services.transportistas_proveedor([element,pedido],local_transportistas_proveedor_callback);
                        }else if (element.get("Estado") == local_rootScope.pedidos_estados.PendienteConfirmacion) {
                            if (element.get("Transportista")) {
                                pedido.transportista = local_parser.getTransportistaJson(element.get("Transportista"))
                            }
                            pedidosAux.push(pedido);
                            local_get_pedidos_pendientes_merge_callback(params,null,null);
                        }
                    }
                });
            }else{
                get_pedidos_pendientes_callback(error,null);
            }
        }else{
            get_pedidos_pendientes_callback(error,null);
        }

    };
    local_transportista_statistics_callback = function(params,error,results){
        var pedido = params[1];
        if(!error && results){
            pedido.transportista = {statistics : results};
        }
        pedidosAux.push(pedido);
        local_get_pedidos_pendientes_merge_callback(params,null,null);
    };
    local_transportistas_proveedor_callback = function(params,error,results){
        var pedido = params[1];
        pedido.transportistas = new Array();
        results.forEach(function(element,index,array){
            if (element.get("Estado") == local_rootScope.transportistas_estados.Disponible){
                pedido.transportistas.push(local_parser.getTransportistaJson(element));
            }
        });
        if (pedido.transportistas.length > 0){
            pedido.transportistas.sort(function(a,b) {
                if (a.object.get("EsTercero") != b.object.get("EsTercero")) {
                    return a.object.get("EsTercero") ? 1 : -1;
                }
                return a.object.get("HoraDisponible") - b.object.get("HoraDisponible");
            });
            var count = 0;
            pedido.transportistas = pedido.transportistas
                .filter(function(object){
                    return pedido.tipoTransporte == object.tipoTransporte
                        || (pedido.tipoTransporte == "furgon_plataforma"
                            && (object.tipoTransporte == "furgon" ||  object.tipoTransporte == "plataforma"))
                })
                .map(function(object) {
                    count++;
                    object.priority = count;
                    return object;
                }
            );
            pedidosAux.push(pedido);
        }
        local_get_pedidos_pendientes_merge_callback(params,null,null);
    };
    local_get_pedidos_pendientes_merge_callback = function(params,error,results){
        pedidos_procesadosAux++;
        if (pedidos_procesadosAux >= pedidosAux1.length){
            pedidosAux.sort(function(a,b) {
                return a.object.get("createdAt") - b.object.get("createdAt");
            });
            get_pedidos_pendientes_callback(null,pedidosAux);
        }
    };
    local_confirmar_pedido_callback = function(params,error,results){
        local_rootScope.$broadcast(local_rootScope.channels.pedido_confirmado, params[0]);
        local_pubnub_services.publish(local_rootScope.channels.pedido_confirmado,{id:params[0].id})
        confirmar_pedido_callback(error,null);
    };
    local_rechazar_pedido_callback = function(params,error,results){
        //local_rootScope.$broadcast(local_rootScope.channels.pedido_rechazado, params[0]);
        local_pubnub_services.publish(local_rootScope.channels.pedido_rechazado,{id:params[0].id})
        rechazar_pedido_callback(error,null);
    };
    local_proveedor_tomar_pedido_callback = function(params,error,results){
        //local_rootScope.$broadcast(local_rootScope.channels.pedido_tomado, params[0]);
        local_pubnub_services.publish(local_rootScope.channels.pedido_tomado,{id:params[0].id})
        proveedor_tomar_pedido_callback(error,null);
    };
    local_proveedor_confirmar_pedido_callback = function(params,error,results){
        local_rootScope.$broadcast(local_rootScope.channels.pedido_confirmado_proveedor, params[0]);
        local_pubnub_services.publish(local_rootScope.channels.pedido_confirmado_proveedor,{id:params[0].id})
        proveedor_confirmar_pedido_callback(error,null);
    };
    local_proveedor_rechazar_pedido_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_rechazado_proveedor,{id:params[0].id})
        proveedor_rechazar_pedido_callback(error,null);
    };
    local_timeout_pedido_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_timeout,{id:params[0].id})
        timeout_pedido_callback(error,null);
    };
    local_cancelar_pedido_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_cancelado,{id:params[0].id})
        cancelar_pedido_callback(error,results);
    };
    local_ignorar_pedido_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_ignorado,{id:params[0].id})
        ignorar_pedido_callback(error,results);
    };

})();
/**
 * Created by dcoellar on 12/22/15.
 */

(function() {

    //Variables
    var local_root_scope;
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_save;
    var local_get_cliente;
    var local_get_proveedor;

    //Methods

    //View Controller callbacks references
    var save_callback;
    var get_cliente_callback;
    var get_proveedor_callback;

    //Data callbacks
    var local_save_callback;
    var local_get_cliente_callback;
    var local_get_proveedor_callback;

    angular.module("easyRuta")
        .factory('perfil_viewmodel',function($rootScope,data_services,parser) {

            local_root_scope = $rootScope;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        save : function(object,image,callback){
            local_save(object,image,callback);
        },
        get_cliente : function(callback){
            local_get_cliente(callback)
        },
        get_proveedor : function(callback){
            local_get_proveedor(callback)
        }
    };

    //"Public" Methods
    local_save = function(object,image,callback){
        save_callback = callback
        if (local_root_scope.loggedInRole.getName() == "cliente"){
            local_data_services.save_cliente([object,image],local_save_callback)
        }
        else if (local_root_scope.loggedInRole.getName() == "proveedor"){
            local_data_services.save_proveedor([object,image],local_save_callback)
        }
    };
    local_get_cliente = function(callback){
        get_cliente_callback = callback;
        local_data_services.current_cliente([],local_get_cliente_callback);
    };
    local_get_proveedor = function(callback){
        get_proveedor_callback = callback;
        local_data_services.current_proveedor([],local_get_proveedor_callback);
    };

    //Methods

    //Data callbacks
    local_save_callback = function(params,error,results){
        if (!error){
            save_callback(null,results);
        }else{
            save_callback(error,null)
        }
    };
    local_get_cliente_callback = function(params,error,results){
        if (!error){
            var cliente = local_parser.getClienteJson(results);
            get_cliente_callback(null,cliente);
        }else{
            get_cliente_callback(error,null)
        }
    };
    local_get_proveedor_callback = function(params,error,results){
        if (!error){
            var proveedor = local_parser.getProveedorJson(results);
            get_proveedor_callback(null,proveedor);
        }else{
            get_proveedor_callback(error,null)
        }
    };

})();
/**
 * Created by dcoellar on 1/11/16.
 */

(function() {

    //Variables
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_pedidos_completados
    var local_save_all;

    //Methods

    //View Controller callbacks references
    var get_pedidos_completados_callback;
    var save_all_callback;

    //Data callbacks
    var local_get_pedidos_completados_callback;
    var local_save_all_callback;

    angular.module("easyRuta")
        .factory('rate_transportista_modal_viewmodel',function(data_services,parser) {

            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_pedidos_completados : function(callback) { local_get_pedidos_completados(callback); },
        save_all : function(pedidos,callback) { local_save_all(pedidos,callback); }
    };

    //"Public" Methods
    local_get_pedidos_completados = function(callback){
        get_pedidos_completados_callback = callback;
        local_data_services.get_pedidos_completados_no_calificados([],local_get_pedidos_completados_callback)
    };
    local_save_all = function(pedidos,callback){
        save_all_callback = callback;
        local_data_services.rate_pedidos([pedidos],local_save_all_callback);
    };

    //Methods

    //Data callbacks
    local_get_pedidos_completados_callback = function(params,error,results){
        if (!error){
            var pedidos = new Array;
            results.forEach(function(element,index,array){
                var pedido = local_parser.getJson(element);
                pedido.transportista = local_parser.getTransportistaJson(element.get("Transportista"));
                if (pedido.object.get("Proveedor")){
                    pedido.transportista = local_parser.parseProveedorIntoTransportista(pedido.transportista,pedido.object.get("Proveedor"));
                }
                pedidos.push(pedido)
            });
            get_pedidos_completados_callback(error,pedidos);
        }else{
            get_pedidos_completados_callback(error,null);
        }
    };

    local_save_all_callback = function(params,error,results){
        save_all_callback(error,results);
    };
})();
/**
 * Created by dcoellar on 12/15/15.
 */
(function() {

    //Variables
    var local_rootScope;
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_transportista;
    var local_get_asignaciones_transportista;
    var local_get_asignaciones_proveedor;
    var local_get_viajes_count;
    var local_save;
    var local_delete;
    var local_habilitar;
    var local_deshabilitar;
    var local_add_asignacion;
    var local_delete_asignacion;

    //Methods

    //View Controller callbacks references
    var get_transportista_callback;
    var get_asignaciones_transportista_callback;
    var get_asignaciones_proveedor_callback;
    var get_viajes_count_callback;
    var save_callback;
    var delete_callback;
    var habilitar_callback;
    var deshabilitar_callback;
    var add_asignacion_callback;
    var delete_asignacion_callback;

    //Data callbacks
    var local_get_transportista_callback;
    var local_get_asignaciones_transportista_callback;
    var local_get_asignaciones_proveedor_callback;
    var local_save_callback;
    var local_save_file_callback;
    var local_delete_callback;
    var local_habilitar_callback;
    var local_deshabilitar_callback;
    var local_get_viajes_count_callback;
    var local_add_asignacion_callback;
    var local_delete_asignacion_callback;

    angular.module("easyRuta")
        .factory('transportista_edit_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_transportista : function(id,callback) { local_get_transportista(id,callback); },
        get_asignaciones_transportista : function(transportista,callback) { local_get_asignaciones_transportista(transportista,callback); },
        get_asignaciones_proveedor : function(proveedor,callback) { local_get_asignaciones_proveedor(proveedor,callback); },
        get_viajes_count : function(transportista,callback) { local_get_viajes_count(transportista,callback); },
        save : function(transportista,name,file,callback) { local_save(transportista,name,file,callback); },
        delete : function(transportista,callback) { local_delete(transportista,callback); },
        habilitar : function(transportista,cliente,callback) { local_habilitar(transportista,cliente,callback); },
        deshabilitar  : function(transportista,callback) { local_deshabilitar(transportista,callback); },
        add_asignacion  : function(transportista,empresa,callback) { local_add_asignacion(transportista,empresa,callback); },
        delete_asignacion  : function(transportista,empresa,callback) { local_delete_asignacion(transportista,empresa,callback); }
    }

    //"Public" Methods
    local_get_transportista = function(id,callback){
        get_transportista_callback = callback;
        local_data_services.get_transportista([id],local_get_transportista_callback)
    };
    local_get_asignaciones_transportista = function(transportista,callback){
        get_asignaciones_transportista_callback = callback;
        local_data_services.get_asignaciones_transportista([transportista],local_get_asignaciones_transportista_callback)
    };
    local_get_asignaciones_proveedor = function(proveedor,callback){
        get_asignaciones_proveedor_callback = callback;
        local_data_services.get_asignaciones_proveedor([proveedor],local_get_asignaciones_proveedor_callback)
    };
    local_get_viajes_count = function(transportista,callback){
        get_viajes_count_callback = callback;
        local_data_services.viajes_en_curso_transportista_count([transportista],local_get_viajes_count_callback)
    };
    local_save = function(transportista,name,file,callback){
        save_callback = callback;
        if (name && file){
            local_data_services.save_file([transportista,name,file],local_save_file_callback);
        }else{
            local_data_services.save_transportista([transportista,local_rootScope.proveedor],local_save_callback);
        }
    };
    local_delete = function(transportista,callback){
        delete_callback = callback;
        local_data_services.delete_transportista([transportista.object],local_delete_callback);
    };
    local_habilitar = function(transportista,cliente,callback){
        habilitar_callback = callback;
        local_data_services.update_estado_transportista([transportista.object,null,new Date(),cliente,new Date(),local_rootScope.transportistas_estados.Disponible],local_habilitar_callback)
    };
    local_deshabilitar = function(transportista,callback){
        deshabilitar_callback = callback;
        local_data_services.update_estado_transportista([transportista.object,null,null,null,undefined,local_rootScope.transportistas_estados.NoDisponible],local_deshabilitar_callback)
    };
    local_add_asignacion = function(transportista,empresa,callback){
        add_asignacion_callback = callback;
        local_data_services.add_asignacion_proveedor([transportista,empresa],local_add_asignacion_callback)
    };
    local_delete_asignacion = function(transportista,empresa,callback){
        delete_asignacion_callback = callback;
        local_data_services.delete_asignacion_proveedor([transportista,empresa],local_delete_asignacion_callback)
    };

    //Methods

    //Data callbacks
    local_get_transportista_callback = function(params,error,results){
        var transportista;
        if (!error){
            transportista = local_parser.getTransportistaJson(results[0]);
        }
        get_transportista_callback(error,transportista);
    };
    local_get_asignaciones_transportista_callback = function(params,error,results){
        var clientes = [];
        if (!error){
            results.forEach(function(element,index,array){
                clientes.push(local_parser.getClienteJson(element));
            });
        }
        get_asignaciones_transportista_callback(error,clientes);
    };
    local_get_asignaciones_proveedor_callback = function(params,error,results){
        var clientes = [];
        if (!error){
            results.forEach(function(element,index,array){
                clientes.push(local_parser.getClienteJson(element));
            });
        }
        get_asignaciones_proveedor_callback(error,clientes);
    };
    local_get_viajes_count_callback = function(params,error,results){
        var count;
        if (!error){
            count = results;
        }
        get_viajes_count_callback(error,count);
    };
    local_save_callback = function(params,error,results){
        save_callback(error,results);
    };
    local_save_file_callback = function(params,error,results){
        if (!error){
            params[0].object.set("photo",results);
            local_data_services.save_transportista([params[0],local_rootScope.proveedor],local_save_callback);
        }
    };
    local_delete_callback = function(params,error,results){
        delete_callback(error,results);
    };
    local_habilitar_callback = function(params,error,results){
        habilitar_callback(error,results);
    };
    local_deshabilitar_callback = function(params,error,results){
        deshabilitar_callback(error,results);
    };
    local_add_asignacion_callback = function(params,error,results){
        add_asignacion_callback(error,results);
    };
    local_delete_asignacion_callback = function(params,error,results){
        delete_asignacion_callback(error,results);
    };
})();
/**
 * Created by dcoellar on 11/18/15.
 */

(function() {

    //Variables
    var local_rootScope;
    var local_pubnub_services;
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_check_context_initialization;
    var local_get_transportistas_proveedor;
    var local_get_transpostistas_despachador;
    var local_habilitar_transportista;

    //Methods

    //View Controller callbacks references
    var check_context_initialization;
    var get_transportistas_proveedor;
    var get_transpostistas_despachador_callback;
    var habilitar_transportista_callback;

    //Data callbacks
    var local_check_context_initialization_callback;
    var local_get_transportistas_proveedor_callback;
    var local_get_transpostistas_despachador_callback;
    var local_habilitar_transportista_callback;

    angular.module("easyRuta")
        .factory('transportistas_proveedor_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_pubnub_services = pubnub_services;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        check_context_initialization : function(callback) {
            local_check_context_initialization(callback);
        },
        get_transportistas_proveedor : function(callback) {
            local_get_transportistas_proveedor(callback);
        },
        get_transpostistas_despachador : function(proveedor,isForPedido,tipoTransporte,callback) {
            local_get_transpostistas_despachador(proveedor,isForPedido,tipoTransporte,callback);
        },
        habilitar_transportista : function(transportista,callback){
            local_habilitar_transportista(transportista,callback);
        }
    };

    //"Public" Methods
    local_check_context_initialization = function(callback){
        check_context_initialization = callback;
        local_data_services.check_context_initialization([],local_check_context_initialization_callback)
    };
    local_get_transportistas_proveedor = function(callback){
        get_transportistas_proveedor = callback;
        local_data_services.transportistas_proveedor([],local_get_transportistas_proveedor_callback)
    };
    local_get_transpostistas_despachador = function(proveedor,isForPedido,tipoTransporte,callback){
        get_transpostistas_despachador_callback = callback;
        local_data_services.transportistas_despachador([local_rootScope.cliente,proveedor,isForPedido,tipoTransporte],local_get_transpostistas_despachador_callback)
    };

    //Methods

    //Data callbacks
    local_check_context_initialization_callback = function(params,error,results){
        check_context_initialization(error,results);
    };
    local_get_transportistas_proveedor_callback = function(params,error,results) {
        var transportistas = results.map(function(object){
            var json = local_parser.getTransportistaJson(object)
            if (json.estado == local_rootScope.transportistas_estados.Disponible){
                json.checkGlyphicon = "glyphicon-ok"
                json.checkColor = "list-item-check-green"
            }else if (json.estado == local_rootScope.transportistas_estados.NoDisponible){
                json.checkGlyphicon = "glyphicon-minus"
                json.checkColor = "list-item-check-red"
            }else if (json.estado == local_rootScope.transportistas_estados.EnViaje){
                json.checkGlyphicon = "glyphicon-random"
                json.checkColor = "list-item-check-blue"
            }
            return json;
        });
        transportistas.sort(function(a,b) {
            if (a.object.get("EsTercero") != b.object.get("EsTercero")) {
                return a.object.get("EsTercero") ? 1 : -1;
            }
            return a.object.get("HoraDisponible") - b.object.get("HoraDisponible");
        });
        get_transportistas_proveedor(error,transportistas);
    };
    local_get_transpostistas_despachador_callback = function(params,error,results){
        var transportistas = results.map(function(object){
            var json = local_parser.getTransportistaJson(object)
            if (json.estado == local_rootScope.transportistas_estados.Disponible){
                json.checkGlyphicon = "glyphicon-ok"
                json.checkColor = "list-item-check-green"
            }else if (json.estado == local_rootScope.transportistas_estados.NoDisponible){
                json.checkGlyphicon = "glyphicon-minus"
                json.checkColor = "list-item-check-red"
            }else if (json.estado == local_rootScope.transportistas_estados.EnViaje){
                json.checkGlyphicon = "glyphicon-random"
                json.checkColor = "list-item-check-blue"
            }
            return json;
        });
        transportistas.sort(function(a,b) {
            if (a.object.get("EsTercero") != b.object.get("EsTercero")) {
                return a.object.get("EsTercero") ? 1 : -1;
            }
            return a.object.get("HoraDisponible") - b.object.get("HoraDisponible");
        });
        get_transpostistas_despachador_callback(error,transportistas)
    };
    local_habilitar_transportista_callback = function(params,error,results) {
        local_rootScope.$broadcast(local_rootScope.channels.transportista_habilitado, params[0]);
        local_pubnub_services.publish(local_rootScope.channels.transportista_habilitado,{id:params[0].id})
        habilitar_transportista_callback(error,results);
    };
})();
/**
 * Created by dcoellar on 4/25/16.
 */

angular.module("easyRuta")
    .directive("passwordVerify", function() {
    return {
        require: "ngModel",
        scope: {
            passwordVerify: '='
        },
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(function() {
                var combined;

                if (scope.passwordVerify || ctrl.$viewValue) {
                    combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                }
                return combined;
            }, function(value) {
                if (value) {
                    ctrl.$parsers.unshift(function(viewValue) {
                        var origin = scope.passwordVerify;
                        if (origin !== viewValue) {
                            ctrl.$setValidity("passwordVerify", false);
                            return undefined;
                        } else {
                            ctrl.$setValidity("passwordVerify", true);
                            return viewValue;
                        }
                    });
                }
            });
        }
    };
});
/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .directive("ezPedidoActivo",function(){
        return {
            restrict: 'E',
            templateUrl: "/app/directives/pedidos/ez-pedido-activo.html"
        }
    });

/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .directive("ezPedidoCompletado",function(){
        return {
            restrict: 'E',
            templateUrl: "/app/directives/pedidos/ez-pedido-completado.html"
        }
    });

/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .directive("ezPedidoEnCurso",function(){
        return {
            restrict: 'E',
            templateUrl: "/app/directives/pedidos/ez-pedido-en-curso.html"
        }
    });

/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .directive("ezPedidoPendiente",function(){
        return {
            restrict: 'E',
            templateUrl: "/app/directives/pedidos/ez-pedido-pendiente.html"
        }
    });
/**
 * Created by dcoellar on 4/6/16.
 */

angular.module('easyRuta')
    .directive('ezPedidos',function(){
        return {
            restrict: 'E',
            templateUrl: "app/directives/pedidos/ez-pedidos.html"
        };
    });

/**
 * Created by dcoellar on 9/14/15.
 */

var Airbrake;

angular.module("easyRuta")
    .run([function(){
        //Airbrake = new airbrakeJs.Client({projectId: 120416, projectKey: "d33cf6bcd970d85d8f4a429c86ef9a98"});//PROD
        //Airbrake = new airbrakeJs.Client({projectId: 120417, projectKey: "2a91504c057d34a36618b2a6caf6a851"});//QA
    }]).factory('$exceptionHandler', [function() {
        return function(exception, cause) {
            console.log(exception);
            //Airbrake.notify(exception);
            //throw exception;
        };
    }]);

/**
 * Created by dcoellar on 4/7/16.
 */

angular.module("easyRuta")
    .factory('brokerModel', ['dataService','collectionsEnum',function(dataService,collectionsEnum) {
        return {

            /*
             Converts a broker class object to a json object
             param: broker - the class object to be converted
             param: includes (optional) - the list of pointers to be included
             return: json - the json object converted
             */
            toJson: function(broker,includes){
                var json = {
                    object: broker,
                    id: broker.id,
                    nombre: broker.get("nombre")
                };

                //add pointers if included
                if (includes) {
                    includes.forEach(function(e,i,a){
                    });
                } else {
                }

                return json
            },

            /*
             Converts a json object to a broker object class
             param: json - the json object to be converted
             return: broker - the broker class object converted
             */
            fromJson: function(json){
                var broker = json.object;
                if (!broker){
                    broker = dataService.createCollection(collectionsEnum.broker);
                }

                broker.set("nombre",json.nombre);

                return broker;
            }
        };
    }]);
/**
 * Created by dcoellar on 4/7/16.
 */

angular.module("easyRuta")
    .factory('choferModel', ['dataService','collectionsEnum','transportistaModel','brokerModel','proveedorCargaModel',function(dataService,collectionsEnum,transportistaModel,brokerModel,proveedorCargaModel) {
        return {

            /*
             Converts a chofer class object to a json object
             param: chofer - the class object to be converted
             param: includes (optional) - the list of pointers to be included
             return: json - the json object converted
             */
            toJson: function(chofer,includes){
                var json = {
                    object: chofer,
                    id: chofer.id,
                    descripcion: chofer.get("descripcion"),
                    nombre: chofer.get("nombre"),
                    cedula: chofer.get("cedula"),
                    telefono: chofer.get("telefono"),
                    rating: chofer.get("rating"),
                    marca: chofer.get("marca"),
                    modelo: chofer.get("modelo"),
                    anio: chofer.get("anio"),
                    placa: chofer.get("placa"),
                    color: chofer.get("color"),
                    tipoCamion: chofer.get("tipoCamion"),
                    estado: chofer.get("estado"),
                    ciudadDisponible: chofer.get("ciudadDisponible"),
                    horaDisponible: chofer.get("horaDisponible"),
                    ciudadesDisponible: chofer.get("ciudadesDisponible"),
                    deleted: chofer.get("deleted")
                };

                //add pointers if included
                var transportista = chofer.get("transportista");
                var broker = chofer.get("broker");
                var proveedorCarga = chofer.get("proveedorCarga");
                if (includes) {
                    includes.forEach(function(e,i,a){
                        if (e.field == "transportista" && transportista) { json["transportista"] = transportistaModel.toJson(transportista, e.includes); };
                        if (e.field == "broker" && broker) { json["broker"] = brokerModel.toJson(broker, e.includes); };
                        if (e.field == "proveedorCarga" && proveedorCarga) { json["proveedorCarga"] = proveedorCargaModel.toJson(proveedorCarga, e.includes); };
                    });
                } else {
                    if (transportista) { json["transportista"] = transportista.id; };
                    if (broker) { json["broker"] = broker.id; };
                    if (proveedorCarga) { json["proveedorCarga"] = proveedorCarga.id; };
                }

                return json
            },

            /*
             Converts a json object to a chofer object class
             param: json - the json object to be converted
             return: chofer - the chofer class object converted
             */
            fromJson: function(json){
                var chofer = json.object;
                if (!chofer){
                    chofer = dataService.createCollection(collectionsEnum.chofer);
                }
                chofer.set("descripcion",json.descripcion);
                chofer.set("nombre",json.nombre);
                chofer.set("cedula",json.cedula);
                chofer.set("telefono",json.telefono);
                chofer.set("rating",json.rating);
                chofer.set("marca",json.marca);
                chofer.set("modelo",json.modelo);
                chofer.set("anio",json.anio);
                chofer.set("placa",json.placa);
                chofer.set("color",json.color);
                chofer.set("tipoCamion",json.tipoCamion);
                chofer.set("estado",json.estado);
                chofer.set("ciudadDisponible",json.ciudadDisponible);
                chofer.set("horaDisponible",json.horaDisponible);
                chofer.set("ciudadesDisponible",json.ciudadesDisponible);
                chofer.set("deleted",json.deleted);

                if (json.transportista && json.transportista.object) { chofer.set("transportista",json.transportista.object); }
                if (json.broker && json.broker.object) { chofer.set("broker",json.broker.object); }
                if (json.proveedorCarga && json.proveedorCarga.object) { chofer.set("proveedorCarga",json.proveedorCarga.object); }

                return chofer;
            }
        };
    }]);
/**
 * Created by dcoellar on 4/7/16.
 */

angular.module("easyRuta")
    .factory('notificacionModel', ['dataService','collectionsEnum','pedidoModel',function(dataService,collectionsEnum,pedidoModel) {
        return {

            /*
             Converts a notificacion class object to a json object
             param: notificacion - the class object to be converted
             param: includes (optional) - the list of pointers to be included
             return: json - the json object converted
             */
            toJson: function(notificacion,includes){
                var json = {
                    object: notificacion,
                    id: notificacion.id,
                    descripcion: notificacion.get("descripcion"),
                    leida: notificacion.get("leida")
                };

                //add pointers if included
                var pedido = notificacion.get("pedido");
                if (includes) {
                    includes.forEach(function(e,i,a){
                        if (e.field == "pedido" && pedido) { json["pedido"] = pedidoModel.toJson(pedido, e.includes); };
                    });
                } else {
                    if (pedido) { json["pedido"] = pedido.id; };
                }

                return json
            },

            /*
             Converts a json object to a notificacion object class
             param: json - the json object to be converted
             return: notificacion - the notificacion class object converted
             */
            fromJson: function(json){
                var notificacion = json.object;
                if (!notificacion){
                    notificacion = dataService.createCollection(collectionsEnum.notificacion);
                }

                notificacion.set("descripcion",json.descripcion);
                notificacion.set("leida",json.leida);

                if (json.pedido.object) { notificacion.set("proveedorCarga",json.pedido.object); }

                return notificacion;
            }
        };
    }]);
/**
 * Created by dcoellar on 4/7/16.
 */

angular.module("easyRuta")
    .factory('pedidoModel', ['dataService','collectionsEnum','proveedorCargaModel','brokerModel','transportistaModel','choferModel',function(dataService,collectionsEnum,proveedorCargaModel,brokerModel,transportistaModel,choferModel) {
        return {

            /*
             Converts a pedido class object to a json object
             param: pedido - the class object to be converted
             param: includes (optional) - the list of pointers to be included
             return: json - the json object converted
             */
            toJson: function(pedido,includes){
                var json = {
                    object: pedido,
                    id: pedido.id,
                    plantilla: pedido.get("plantilla"),
                    managedByBroker: pedido.get("managedByBroker"),
                    estado: pedido.get("estado"),
                    ciudadOrigen: pedido.get("ciudadOrigen"),
                    direccionOrigen: pedido.get("direccionOrigen"),
                    horaCarga: pedido.get("horaCarga"),
                    ciudadDestino: pedido.get("ciudadDestino"),
                    direccionDestino: pedido.get("direccionDestino"),
                    horaEntrega: pedido.get("horaEntrega"),
                    producto: pedido.get("producto"),
                    tipoCamion: pedido.get("tipoCamion"),
                    peso: pedido.get("peso"),
                    valor: pedido.get("valor"),
                    valorSinDescuento: pedido.get("valorSinDescuento"),
                    comision: pedido.get("comision"),
                    rate: pedido.get("rate"),
                    horaInicio: pedido.get("horaInicio"),
                    horaFinalizacion: pedido.get("horaFinalizacion"),
                    horaCancelacion: pedido.get("horaCancelacion"),
                    horaAsignacion: pedido.get("horaAsignacion"),
                    locations: pedido.get("locations"),
                    donacion: pedido.get("donacion"),
                    createdAt: pedido.get("createdAt")
                };

                if (json.locations && json.locations.length > 0){
                    json.currentLocation = json.locations[json.locations.length-1].split(",")
                }

                //add pointers if included
                var proveedorCarga = pedido.get("proveedorCarga");
                var broker = pedido.get("broker");
                var transportista = pedido.get("transportista");
                var chofer = pedido.get("chofer");
                if (includes) {
                    includes.forEach(function(e,i,a){
                        if (e.field == "proveedorCarga" && proveedorCarga) { json["proveedorCarga"] = proveedorCargaModel.toJson(proveedorCarga, e.includes); };
                        if (e.field == "broker" && broker) { json["broker"] = brokerModel.toJson(broker, e.includes); };
                        if (e.field == "transportista" && transportista) { json["transportista"] = transportistaModel.toJson(transportista, e.includes); };
                        if (e.field == "chofer" && chofer) { json["chofer"] = choferModel.toJson(chofer, e.includes); };
                    });
                } else {
                    if (proveedorCarga) { json["proveedorCarga"] = proveedorCarga.id; };
                    if (broker) { json["broker"] = broker.id; };
                    if (transportista) { json["transportista"] = transportista.id; };
                    if (chofer) { json["chofer"] = chofer.id; };
                }

                return json
            },

            /*
             Converts a json object to a pedido object class
             param: json - the json object to be converted
             return: pedido - the pedido class object converted
             */
            fromJson: function(json){
                var pedido = json.object;
                if (!pedido){
                    pedido = dataService.createCollection(collectionsEnum.pedido);
                }
                pedido.set("plantilla",json.plantilla);
                pedido.set("managedByBroker",json.managedByBroker)
                pedido.set("estado",json.estado);
                pedido.set("ciudadOrigen",json.ciudadOrigen);
                pedido.set("direccionOrigen",json.direccionOrigen);
                pedido.set("horaCarga",json.horaCarga);
                pedido.set("ciudadDestino",json.ciudadDestino);
                pedido.set("direccionDestino",json.direccionDestino);
                pedido.set("horaEntrega",json.horaEntrega);
                pedido.set("producto",json.producto);
                pedido.set("tipoCamion",json.tipoCamion);
                pedido.set("peso",json.peso);
                pedido.set("valor",json.valor);
                pedido.set("valorSinDescuento",json.valorSinDescuento);
                pedido.set("comision",json.comision);
                pedido.set("rate",json.rate);
                pedido.set("horaInicio",json.horaInicio);
                pedido.set("horaFinalizacion",json.horaFinalizacion);
                pedido.set("horaCancelacion",json.horaCancelacion);
                pedido.set("horaAsignacion",json.horaAsignacion);
                pedido.set("donacion",json.donacion);
                pedido.set("createdAt",json.createdAt);

                if (json.proveedorCarga && json.proveedorCarga.object) { pedido.set("proveedorCarga",json.proveedorCarga.object); }
                if (json.broker && json.broker.object) { pedido.set("broker",json.broker.object); }
                if (json.transportista && json.transportista.object) { pedido.set("transportista",json.transportista.object); }
                if (json.chofer && json.chofer.object) { pedido.set("chofer",json.chofer.object); }

                return pedido;
            }
        };
    }]);
/**
 * Created by dcoellar on 4/7/16.
 */

angular.module("easyRuta")
    .factory('proveedorCargaModel', ['dataService','collectionsEnum','userModel',function(dataService,collectionsEnum,userModel) {
        return {

            /*
             Converts a proveedorCarga class object to a json object
             param: proveedorCarga - the class object to be converted
             param: includes (optional) - the list of pointers to be included
             return: json - the json object converted
             */
            toJson: function(proveedorCarga,includes){
                var json = {
                    object: proveedorCarga,
                    id: proveedorCarga.id,
                    nombre: proveedorCarga.get("nombre"),
                    telefono: proveedorCarga.get("telefono"),
                    contacto: proveedorCarga.get("contacto"),
                    asociados: proveedorCarga.get("asociados"),
                    asociadoConTodos: proveedorCarga.get("asociadoConTodos")
                };

                //add pointers if included
                var user = proveedorCarga.get("user");
                if (includes) {
                    includes.forEach(function(e,i,a){
                        if (e.field == "user" && user) { json["user"] = userModel.toJson(user, e.includes); };
                    });
                } else {
                    if (user) { json["user"] = user.id; };
                }

                return json
            },

            /*
             Converts a json object to a proveedorCarga object class
             param: json - the json object to be converted
             return: proveedorCarga - the proveedorCarga class object converted
             */
            fromJson: function(json){
                var proveedorCarga = json.object;
                if (!proveedorCarga){
                    proveedorCarga = dataService.createCollection(collectionsEnum.proveedorCarga);
                }
                proveedorCarga.set("nombre",json.nombre);
                proveedorCarga.set("telefono",json.telefono);
                proveedorCarga.set("contacto",json.contacto);
                prvoeedorCarga.set("asociados",json.asociados);
                prvoeedorCarga.set("asociadoConTodos",json.asociadoConTodos);

                if (json.user.object) { prvoeedorCarga.set("user",json.user.object); }

                return proveedorCarga;
            }
        };
    }]);
/**
 * Created by dcoellar on 4/7/16.
 */

angular.module("easyRuta")
    .factory('proveedorCargaRutasModel', ['dataService','collectionsEnum','proveedorCargaModel',function(dataService,collectionsEnum,proveedorCargaModel) {
        return {

            /*
             Converts a proveedorCargaRutas class object to a json object
             param: proveedorCargaRutas - the class object to be converted
             param: includes (optional) - the list of pointers to be included
             return: json - the json object converted
             */
            toJson: function(proveedorCargaRutas,includes){
                var json = {
                    object: proveedorCargaRutas,
                    id: proveedorCargaRutas.id,
                    ciudadOrigen: proveedorCargaRutas.get("ciudadOrigen"),
                    ciudadDestino: proveedorCargaRutas.get("ciudadDestino"),
                    peso: proveedorCargaRutas.get("peso"),
                    valor: proveedorCargaRutas.get("valor")
                };

                //add pointers if included
                var proveedorCarga = proveedorCargaRutas.get("proveedorCarga");
                if (includes) {
                    includes.forEach(function(e,i,a){
                        if (e.field == "proveedorCarga" && proveedorCarga) { json["proveedorCarga"] = proveedorCargaModel.toJson(proveedorCarga, e.includes); };
                    });
                } else {
                    if (proveedorCarga) { json["proveedorCarga"] = proveedorCarga.id; };
                }

                return json
            },

            /*
             Converts a json object to a proveedorCargaRutas object class
             param: json - the json object to be converted
             return: proveedorCargaRutas - the proveedorCargaRutas class object converted
             */
            fromJson: function(json){
                var proveedorCargaRutas = json.object;
                if (!proveedorCargaRutas){
                    proveedorCargaRutas = dataService.createCollection(collectionsEnum.proveedorCargaRutas);
                }
                proveedorCargaRutas.set("ciudadOrigen",json.ciudadOrigen);
                proveedorCargaRutas.set("ciudadDestino",json.ciudadDestino);
                proveedorCargaRutas.set("peso",json.peso);
                proveedorCargaRutas.set("valor",json.valor);

                if (json.proveedorCarga.object) { proveedorCargaRutas.set("proveedorCarga",json.proveedorCarga.object); }

                return proveedorCargaRutas;
            }
        };
    }]);
/**
 * Created by dcoellar on 4/7/16.
 */

angular.module("easyRuta")
    .factory('transportistaModel', ['dataService','collectionsEnum','userModel',function(dataService,collectionsEnum,userModel) {
        return {

            /*
             Converts a transportista class object to a json object
             param: transportista - the class object to be converted
             param: includes (optional) - the list of pointers to be included
             return: json - the json object converted
             */
            toJson: function(transportista,includes){
                var json = {
                    object: transportista,
                    id: transportista.id,
                    nombre: transportista.get("nombre"),
                    saldo: transportista.get("saldo"),
                    saldoMin: transportista.get("saldoMin")
                };

                //add pointers if included
                var user = transportista.get("user");
                if (includes) {
                    includes.forEach(function(e,i,a){
                        if (e.field == "user" && user) { json["user"] = userModel.toJson(user, e.includes); };
                    });
                } else {
                    if (user) { json["user"] = user.id; };
                }

                return json
            },

            /*
             Converts a json object to a transportista object class
             param: json - the json object to be converted
             return: transportista - the transportista class object converted
             */
            fromJson: function(json){
                var transportista = json.object;
                if (!transportista){
                    transportista = dataService.createCollection(collectionsEnum.transportista);
                }
                transportista.set("nombre",json.nombre);
                transportista.set("saldo",json.saldo);
                transportista.set("saldoMin",json.saldoMin);

                if (json.user.object) { transportista.set("user",json.user.object); }

                return transportista;
            }
        };
    }]);
/**
 * Created by dcoellar on 4/7/16.
 */

angular.module("easyRuta")
    .factory('transportistaRutasModel', ['dataService','collectionsEnum','transportistaModel',function(dataService,collectionsEnum,transportistaModel) {
        return {

            /*
             Converts a transportistaRutas class object to a json object
             param: transportistaRutas - the class object to be converted
             param: includes (optional) - the list of pointers to be included
             return: json - the json object converted
             */
            toJson: function(transportistaRutas,includes){
                var json = {
                    object: transportistaRutas,
                    id: transportistaRutas.id,
                    ciudadOrigen: transportistaRutas.get("ciudadOrigen"),
                    ciudadDestino: transportistaRutas.get("ciudadDestino"),
                    peso: transportistaRutas.get("peso"),
                    valor: transportistaRutas.get("valor"),
                    descuento: transportistaRutas.get("descuento")
                };

                //add pointers if included
                var transportista = transportistaRutas.get("transportista");
                if (includes) {
                    includes.forEach(function(e,i,a){
                        if (e.field == "transportista" && transportista) { json["transportista"] = transportistaModel.toJson(transportista,e.includes); };
                    });
                } else {
                    if (transportista) { json["transportista"] = transportista.id; };
                }

                return json
            },

            /*
             Converts a json object to a transportistaRutas object class
             param: json - the json object to be converted
             return: transportistaRutas - the transportistaRutas class object converted
             */
            fromJson: function(json){
                var transportistaRutas = json.object;
                if (!transportistaRutas){
                    transportistaRutas = dataService.createCollection(collectionsEnum.transportistaRutas);
                }
                transportistaRutas.set("ciudadOrigen", json.ciudadOrigen);
                transportistaRutas.set("ciudadDestino", json.ciudadDestino);
                transportistaRutas.set("peso", json.peso);
                transportistaRutas.set("valor", json.valor);
                transportistaRutas.set("descuento", json.descuento);

                if (json.transportista.object) { transportistaRutas.set("transportista",json.transportista.object); }

                return transportistaRutas;
            }
        };
    }]);
/**
 * Created by dcoellar on 4/7/16.
 */

angular.module("easyRuta")
    .factory('userModel', ['dataService','collectionsEnum',function(dataService,collectionsEnum) {
        return {

            /*
             Converts a user class object to a json object
             param: user - the class object to be converted
             param: includes (optional) - the list of pointers to be included
             return: json - the json object converted
             */
            toJson: function(user,includes){
                var json = {
                    object: user,
                    id: user.id,
                    username: user.get("username"),
                    email: user.get("email")
                };

                //add pointers if included
                if (includes) {
                    includes.forEach(function(e,i,a){
                    });
                }

                return json
            },

            /*
             Converts a json object to a user object class
             param: json - the json object to be converted
             return: user - the user class object converted
             */
            fromJson: function(json){
                var user = json.object;
                if (!user){
                    user = dataService.createCollection(collectionsEnum.user);
                }
                user.set("username",json.username);
                user.set("email",json.email);

                return user;
            }
        };
    }]);
/**
 * Created by dcoellar on 4/20/16.
 */

angular.module('easyRuta')
    .filter('capitalizeFirst', function() {
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    });
/**
 * Created by dcoellar on 4/20/16.
 */

angular.module('easyRuta')
    .filter('parsePeso', function() {
        return function(input) {
            return input.replace("_", " a ") + " toneladas";
        }
    });
/**
 * Created by dcoellar on 4/20/16.
 */

angular.module('easyRuta')
    .filter('tipoCamionList', function() {
        return function(input) {
            return input.join(", ")
        }
    });