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
                    asociados: proveedorCarga.get("asociados")
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

                if (json.user.object) { prvoeedorCarga.set("user",json.user.object); }

                return proveedorCarga;
            }
        };
    }]);