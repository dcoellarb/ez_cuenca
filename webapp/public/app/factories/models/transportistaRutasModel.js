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