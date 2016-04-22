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