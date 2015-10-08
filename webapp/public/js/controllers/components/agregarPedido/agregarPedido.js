/**
 * Created by dcoellar on 9/15/15.
 */

(function(){

    angular.module("easyRuta")
        .controller('AgregarPedidoController',function($rootScope,$scope,$modal){

            var ctlr = this;

            ctlr.open = false;

            $('#agregarPedido a').click(function() {
                console.log("panel clicked.");
                if ($('#agregarPedido').hasClass("panel-primary")){
                    $('#agregarPedido').removeClass('panel-primary');
                    $('#agregarPedido').addClass('panel-default');
                    $('#inputCiudadOrigen').focus();
                    ctlr.open = true;
                    $scope.$apply();
                }else{
                    $('#agregarPedido').removeClass('panel-default');
                    $('#agregarPedido').addClass('panel-primary');
                    ctlr.open = false;
                    $scope.$apply();
                }
            });

            /*
             * Get initial data from parse
             * */
            getInitialData($scope,ctlr);

            /*
             * Setup Actions
             * */
            setupActions($rootScope,$scope,$modal,ctlr);

            /*
             * Setup date pickers options
             * */
            setupDatePickers($scope);

            console.dir($rootScope.pubnub);
        })
        .controller('AgregarPedidoModalController',function($scope,$modalInstance){
            var ctlr = this;
            ctlr.plantilla = "";

            ctlr.guardar = function () {
                $modalInstance.close(ctlr.plantilla);
            };

            ctlr.cancelar = function () {
                $modalInstance.dismiss('cancel');
            };
        });

    var getInitialData = function ($scope,ctlr){
        ctlr.plantillas = new Array();
        var pedido = Parse.Object.extend("Pedido");
        var query = new Parse.Query(pedido);
        query.greaterThan("Plantilla", "");
        query.find({
            success: function(results) {
                ctlr.plantillas = new Array();
                for (var i = 0; i < results.length; i++) {
                    ctlr.plantillas.push({id:results[i].id,plantilla:results[i].get('Plantilla')});
                }
                $scope.$apply();
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });

        ctlr.ciudades = new Array();
        var ciudad = Parse.Object.extend("Ciudad");
        var query = new Parse.Query(ciudad);
        query.find({
            success: function(results) {
                ctlr.ciudades = new Array();
                for (var i = 0; i < results.length; i++) {
                    ctlr.ciudades.push({id : results[i].id, nombre : results[i].get('Nombre')});
                }
                $scope.$apply();
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });

        ctlr.minDate = new Date();

        LimpiarForm(ctlr);
    };

    var setupActions = function($rootScope,$scope,$modal,ctlr){

        ctlr.Agregar = function(form){
            if (form.$valid){
                ctlr.data.Plantilla = "";
                ctlr.data.Estado = "Pendiente";
                Guardar(ctlr).then(function(pedidos){
                    $('#agregarPedidBody').collapse("hide");
                    $('#agregarPedido').removeClass('panel-default');
                    $('#agregarPedido').addClass('panel-primary');
                    ctlr.open = false;

                    $rootScope.$broadcast('nuevosPedidos', pedidos);

                    // Publish nuevo pedido
                    $rootScope.pubnub.publish({
                        channel: 'new_pedidos',
                        message: {}
                    });

                    getInitialData($scope,ctlr);
                    form.$setPristine();
                });
            }
        };

        ctlr.GuardarComoPlantilla = function(form){
            if (form.$valid) {
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'PlantillaModal.html',
                    controller: 'AgregarPedidoModalController as agrPedModalCtlr'
                });

                modalInstance.result.then(function (plantilla) {
                    ctlr.data.Plantilla = plantilla;
                    ctlr.data.Estado = "Plantilla";
                    Guardar(ctlr).then(function(pedido){
                        ctlr.plantillas.push({id:pedido.id,plantilla:pedido.get('Plantilla')});
                        $scope.$apply();
                    });
                }, function () {
                    console.log("Modal canceled.");
                });
            }
        };

        ctlr.Limpiar = function(form){
            LimpiarForm(ctlr);
            form.$setPristine();
        };

        ctlr.TipoTransporteSeleccionado = function(TipoTransporte) {
            ctlr.data.TipoTransporte = TipoTransporte;
        };

        ctlr.PlantillaSelected = function() {
            console.log("plantilla selected");
            if (ctlr.plantilla != ""){
                console.log("plantilla:" + ctlr.plantilla);
                var pedido = Parse.Object.extend("Pedido");
                var query = new Parse.Query(pedido);
                query.get(ctlr.plantilla, {
                    success: function(plantillaObject) {
                        console.dir(plantillaObject);
                        if (plantillaObject){
                            console.log("setting plantilla");
                            ctlr.data = {
                                Plantilla : ctlr.plantilla,
                                CiudadOrigen : plantillaObject.get("CiudadOrigen").id,
                                DireccionOrigen : plantillaObject.get("DireccionOrigen"),
                                CiudadDestino : plantillaObject.get("CiudadOrigen").id,
                                DireccionDestino : plantillaObject.get("DireccionDestino"),
                                HoraCarga : plantillaObject.get("HoraCarga"),
                                HoraEntrega : plantillaObject.get("HoraEntrega"),
                                Producto : plantillaObject.get("Producto"),
                                Valor : plantillaObject.get("Valor"),
                                PesoDesde : plantillaObject.get("PesoDesde"),
                                PesoHasta : plantillaObject.get("PesoHasta"),
                                TipoTransporte : plantillaObject.get("TipoTransporte"),
                                ExtensionMinima : plantillaObject.get("ExtensionMin"),
                                CajaRefrigerada : plantillaObject.get("CajaRefrigerada"),
                                CubicajeMinimo : plantillaObject.get("CubicajeMin")
                            };
                            $scope.$apply();
                        }
                    },
                    error: function(error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });
            }
        };
    };

    var setupDatePickers = function($scope){
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
    }

    var LimpiarForm = function (ctlr){
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
            ExtensionMinima : 43,
            CajaRefrigerada : false,
            CubicajeMinimo : 0
        };
    }

    var Guardar = function(ctlr){
        return new Promise(function (fulfill, reject) {

            var empresa = Parse.Object.extend("Empresa");
            var query = new Parse.Query(empresa);
            query.first({
                success: function(empresaObject) {
                    if (empresaObject){
                        console.log("empresa object id:" + empresaObject.id);

                        var Pedido = Parse.Object.extend("Pedido");
                        var pedido = new Pedido();

                        var CiudadOrigen = Parse.Object.extend("Ciudad");
                        var ciudadOrigen = new CiudadOrigen();
                        ciudadOrigen.id = ctlr.data.CiudadOrigen
                        pedido.set("CiudadOrigen", ciudadOrigen);
                        pedido.set("DireccionOrigen", ctlr.data.DireccionOrigen);

                        var CiudadDestino = Parse.Object.extend("Ciudad");
                        var ciudadDestino = new CiudadDestino();
                        ciudadDestino.id = ctlr.data.CiudadDestino
                        pedido.set("CiudadDestino", ciudadDestino);
                        pedido.set("DireccionDestino", ctlr.data.DireccionDestino);

                        pedido.set("Plantilla", ctlr.data.Plantilla);
                        pedido.set("HoraCarga", ctlr.data.HoraCarga);
                        pedido.set("HoraEntrega", ctlr.data.HoraEntrega);
                        pedido.set("Producto", ctlr.data.Producto);
                        pedido.set("PesoDesde", ctlr.data.PesoDesde);
                        pedido.set("PesoHasta", ctlr.data.PesoHasta);
                        pedido.set("Valor", ctlr.data.Valor);
                        pedido.set("TipoTransporte", ctlr.data.TipoTransporte);
                        pedido.set("CajaRefrigerada", ctlr.data.CajaRefrigerada);
                        pedido.set("CubicajeMin", ctlr.data.CubicajeMinimo);
                        pedido.set("ExtensionMin", ctlr.data.ExtensionMinima);
                        pedido.set("Estado", ctlr.data.Estado);
                        pedido.set("empresa", empresaObject);

                        var copias = ctlr.copias;
                        if (ctlr.data.Estado == "Plantilla"){
                            copias = 1;
                            var acl = new Parse.ACL(Parse.User.current());
                            pedido.setACL(acl);
                        } else {
                            var acl = new Parse.ACL(Parse.User.current());
                            acl.setRoleReadAccess("transportistaIndependiente", true);
                            acl.setRoleReadAccess("proveedor", true);
                            acl.setRoleReadAccess("transportista", true);
                            acl.setRoleWriteAccess("transportistaIndependiente", true);
                            acl.setRoleWriteAccess("proveedor", true);
                            acl.setRoleWriteAccess("transportista", true);
                            pedido.setACL(acl);
                        }

                        var pedidoArray = [];
                        for(var i=1;i<=copias;i++){
                            var newPedido = pedido.clone();
                            pedidoArray.push(newPedido);
                        }

                        Parse.Object.saveAll(pedidoArray, {
                            success: function(pedidos) {
                                fulfill(pedidos);
                            },
                            error: function(pedidos, error) {
                                console.log(error.message);
                                reject(error);
                            }
                        });

                    }
                },
                error: function(error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            });
        });
    };
})();