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