/**
 * Created by dcoellar on 9/15/15.
 */

/**
 * Created by dcoellar on 9/14/15.
 */
(function(){

    angular.module("easyRuta")
        .controller('AgregarPedidoController',function($scope){

            var ctlr = this;

            /*
             * Get initial data from parse
             * */
            getInitialData($scope,ctlr);

            /*
             * Setup form validations
             * */
            //setupValidations($scope,ctlr);

            /*
             * Setup Actions
             * */
            setupActions($scope,ctlr);

            /*
             * Setup date pickers options
             * */
            setupDatePickers($scope);

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

    var setupActions = function($scope,ctlr){

        ctlr.Agregar = function(form){
            if (form.$valid){
                form.$setPristine();
                console.dir(ctlr.data.Caracteristicas);
            }
        };

        ctlr.GuardarComoPlantilla = function(form){
            if (form.$valid){
                console.dir(ctlr.data.Caracteristicas);

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
                pedido.set("Estadp", "Plantilla");

                pedido.save(null, {
                    success: function(pedido) {
                        alert('New object created with objectId: ' + pedido.id);
                        ctlr.data["objectId"] = pedido.id;
                    },
                    error: function(pedido, error) {
                        alert('Failed to create new object, with error code: ' + error.message);
                    }
                });
            }
        };

        ctlr.Limpiar = function(form){
            form.$setPristine();
            LimpiarForm(ctlr);
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
})();