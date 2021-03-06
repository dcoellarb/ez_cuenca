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
