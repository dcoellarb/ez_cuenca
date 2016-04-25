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