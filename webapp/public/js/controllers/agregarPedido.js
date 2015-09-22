/**
 * Created by dcoellar on 9/15/15.
 */

(function(){

    angular.module("easyRuta")
        .controller('AgregarPedidoController',function($rootScope,$scope,$modal){

            var ctlr = this;

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

            // Subscribe to the demo_tutorial channel
            $rootScope.pubnub.subscribe({
                channel: 'demo_tutorial',
                message: function(m){console.log(m)}
            });
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

        ctlr.especificacionesTrailer = new Array();
        ctlr.especificacionesTransportista = new Array();
        var ciudad = Parse.Object.extend("Especificacion");
        var query = new Parse.Query(ciudad);
        query.find({
            success: function(results) {
                ctlr.especificacionesTrailer = new Array();
                ctlr.especificacionesTransportista = new Array();
                for (var i = 0; i < results.length; i++) {
                    if (results[i].get('Tipo') == 'Trailer'){
                        ctlr.especificacionesTrailer.push({nombre:results[i].get('Nombre'),value:false});
                    }else{
                        ctlr.especificacionesTransportista.push({nombre:results[i].get('Nombre'),value:false});
                    }
                }
                $scope.$apply();
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });

        ctlr.minDate = new Date();

        LimpiarForm(ctlr);
    }

    var setupActions = function($rootScope,$scope,$modal,ctlr){

        ctlr.Agregar = function(form){
            if (form.$valid){
                ctlr.data.Plantilla = "";
                ctlr.data.Estado = "Pendiente";
                Guardar(ctlr).then(function(pedido){
                    $('#agregarPedidBody').collapse("hide");

                    $rootScope.$broadcast('nuevoPedido', pedido);

                    // Publish a simple message to the demo_tutorial channel
                    $rootScope.pubnub.publish({
                        channel: 'new_pedido',
                        message: {id:pedido.id}
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
                    Guardar(ctlr);
                }, function () {
                    console.log("Modal canceled.");
                });
            }
        };

        ctlr.Limpiar = function(form){
            LimpiarForm(ctlr);
            form.$setPristine();
        };

        ctlr.EspecificacionChanged = function(especificacion){
            if (especificacion.value){
                ctlr.data.Caracteristicas.push(especificacion.nombre);
            }else{
                ctlr.data.Caracteristicas.splice(ctlr.data.Caracteristicas.indexOf(especificacion.nombre),1);
            }
        };
    }

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
        for(var i=0;i<ctlr.especificacionesTrailer.length;i++){
            ctlr.especificacionesTrailer[i].value = false
        }
        for(var i=0;i<ctlr.especificacionesTransportista.length;i++){
            ctlr.especificacionesTransportista[i].value = false
        }

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
            ValorUnitario : 0,
            PesoDesde : 0,
            PesoHasta : 0,
            Caracteristicas : new Array(),
            TipoTransporte : ""
        };
    }

    var Guardar = function(ctlr){
        return new Promise(function (fulfill, reject) {
            var Pedido = Parse.Object.extend("Pedido");
            var pedido = new Pedido();

            if (ctlr.data.objectid){
                pedido.id = ctlr.data.objectid;
            }

            var CiudadOrigen = Parse.Object.extend("Ciudad");
            var ciudadOrigen = new CiudadOrigen();
            ciudadOrigen.id = ctlr.data.CiudadOrigen
            pedido.set("CiudadOrigen", ciudadOrigen);

            pedido.set("DireccionOrigen", ctlr.data.DireccionOrigen);

            var CiudadDestino = Parse.Object.extend("Ciudad");
            var ciudadDestino = new CiudadDestino();
            ciudadDestino.id = ctlr.data.CiudadDestino
            pedido.set("CiudadDestino", ciudadDestino);

            pedido.set("Plantilla", ctlr.data.Plantilla);
            pedido.set("DireccionDestino", ctlr.data.DireccionDestino);
            pedido.set("HoraCarga", ctlr.data.HoraCarga);
            pedido.set("HoraEntrega", ctlr.data.HoraEntrega);
            pedido.set("Producto", ctlr.data.Producto);
            pedido.set("ValorUnitario", ctlr.data.ValorUnitario);
            pedido.set("PesoDesde", ctlr.data.PesoDesde);
            pedido.set("PesoHasta", ctlr.data.PesoHasta);
            pedido.set("Caracteristicas", ctlr.data.Caracteristicas);
            pedido.set("TipoTransporte", ctlr.data.TipoTransporte);
            pedido.set("Estado", ctlr.data.Estado);

            pedido.save(null, {
                success: function(pedido) {
                    ctlr.data["objectId"] = pedido.id;
                    fulfill(pedido);
                },
                error: function(pedido, error) {
                    console.log(error.message);
                    reject(error);
                }
            });
        });
    };
})();