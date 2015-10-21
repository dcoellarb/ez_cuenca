/**
 * Created by dcoellar on 9/15/15.
 */

(function(){

    angular.module("easyRuta")
        .controller('DetallePedidoController',function($routeParams,$scope,utils){

            utilities = utils;

            var ctlr = this;

            ctlr.id = $routeParams.id;
            console.log(ctlr.id);

            var pedido = Parse.Object.extend("Pedido");
            var query = new Parse.Query(pedido);
            query.equalTo("objectId",ctlr.id);
            query.include("CiudadOrigen");
            query.include("CiudadDestino");
            query.include("Transportista");
            query.first({
                success: function(object) {
                    ctlr.pedido = {
                        origen : object.get("CiudadOrigen").get("Nombre") + " - " + object.get("DireccionOrigen"),
                        destino : object.get("CiudadDestino").get("Nombre") + " - " + object.get("DireccionDestino"),
                        carga : utilities.formatDate(object.get("HoraCarga")),
                        descarga : utilities.formatDate(object.get("HoraEntrega")),
                        inicio : utilities.formatDate(object.get("HoraInicio")),
                        finalizacion : utilities.formatDate(object.get("HoraFinalizacion")),
                        producto : object.get("Producto"),
                        peso : "Peso aproximado: " + object.get("PesoDesde") + "Tl a " + object.get("PesoHasta") + "Tl",
                        valor : object.get("Valor"),
                        tipo : object.get("TipoTransporte"),
                        tipoImage : "",
                        adicional :"",
                        adicionalValor : "",
                        refrigerado :  (object.get("CajaRefrigerada") === true ? "Si" : "No")
                    };
                    if (object.get("TipoTransporte") == "furgon"){
                        ctlr.pedido.tipoImage = "icon-furgon";
                        ctlr.pedido.adicional = "Cubicaje Minimo";
                        ctlr.pedido.adicionalValor = object.get("CubicajeMin") + "m3";
                    }
                    if (object.get("TipoTransporte") == "plataforma"){
                        ctlr.pedido.tipoImage = "icon-plataforma";
                        ctlr.pedido.adicional = "Extension Minima";
                        ctlr.pedido.adicionalValor = object.get("ExtensionMin") + " pies";
                    }
                    if (object.get("TipoTransporte") == "cama baja") {
                        ctlr.pedido.tipoImage = "icon-plataforma";
                    }
                    if (object.get("TipoTransporte") == "banera") {
                        ctlr.pedido.tipoImage = "icon-banera";
                    }
                    if (object.get("TipoTransporte") == "tanquero") {
                        ctlr.pedido.tipoImage = "icon-tanquero";
                    }
                    if (object.get("TipoTransporte") == "ninera") {
                        ctlr.pedido.tipoImage = "icon-jaula";
                    }
                    if (object.get("Transportista")){
                        ctlr.pedido.transportista = {
                            photo : object.get("Transportista").get("photo").url(),
                            nombre : object.get("Transportista").get("Nombre"),
                            rating : object.get("Transportista").get("Rating"),
                            eficiencia : object.get("Transportista").get("Eficiencia"),
                            telefono : object.get("Transportista").get("Telefono"),
                            placa : object.get("Transportista").get("Placa"),
                            color : object.get("Transportista").get("Color"),
                            marca : object.get("Transportista").get("Marca"),
                            modelo : object.get("Transportista").get("Modelo"),
                            anio : object.get("Transportista").get("Anio"),
                        };
                    }
                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
            $scope.map = { center: { latitude:  -1.569363, longitude: -78.705796 }, zoom: 7 };
        });
})();