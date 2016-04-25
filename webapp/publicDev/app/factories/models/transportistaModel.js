/**
 * Created by dcoellar on 4/7/16.
 */

angular.module("easyRuta")
    .factory('transportistaModel', ['dataService','collectionsEnum','userModel',function(dataService,collectionsEnum,userModel) {
        return {

            /*
             Converts a transportista class object to a json object
             param: transportista - the class object to be converted
             param: includes (optional) - the list of pointers to be included
             return: json - the json object converted
             */
            toJson: function(transportista,includes){
                var json = {
                    object: transportista,
                    id: transportista.id,
                    nombre: transportista.get("nombre"),
                    saldo: transportista.get("saldo"),
                    saldoMin: transportista.get("saldoMin")
                };

                //add pointers if included
                var user = transportista.get("user");
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
             Converts a json object to a transportista object class
             param: json - the json object to be converted
             return: transportista - the transportista class object converted
             */
            fromJson: function(json){
                var transportista = json.object;
                if (!transportista){
                    transportista = dataService.createCollection(collectionsEnum.transportista);
                }
                transportista.set("nombre",json.nombre);
                transportista.set("saldo",json.saldo);
                transportista.set("saldoMin",json.saldoMin);

                if (json.user.object) { transportista.set("user",json.user.object); }

                return transportista;
            }
        };
    }]);