/**
 * Created by dcoellar on 4/7/16.
 */

angular.module("easyRuta")
    .factory('notificacionModel', ['dataService','collectionsEnum','pedidoModel',function(dataService,collectionsEnum,pedidoModel) {
        return {

            /*
             Converts a notificacion class object to a json object
             param: notificacion - the class object to be converted
             param: includes (optional) - the list of pointers to be included
             return: json - the json object converted
             */
            toJson: function(notificacion,includes){
                var json = {
                    object: notificacion,
                    id: notificacion.id,
                    descripcion: notificacion.get("descripcion"),
                    leida: notificacion.get("leida")
                };

                //add pointers if included
                var pedido = notificacion.get("pedido");
                if (includes) {
                    includes.forEach(function(e,i,a){
                        if (e.field == "pedido" && pedido) { json["pedido"] = pedidoModel.toJson(pedido, e.includes); };
                    });
                } else {
                    if (pedido) { json["pedido"] = pedido.id; };
                }

                return json
            },

            /*
             Converts a json object to a notificacion object class
             param: json - the json object to be converted
             return: notificacion - the notificacion class object converted
             */
            fromJson: function(json){
                var notificacion = json.object;
                if (!notificacion){
                    notificacion = dataService.createCollection(collectionsEnum.notificacion);
                }

                notificacion.set("descripcion",json.descripcion);
                notificacion.set("leida",json.leida);

                if (json.pedido.object) { notificacion.set("proveedorCarga",json.pedido.object); }

                return notificacion;
            }
        };
    }]);