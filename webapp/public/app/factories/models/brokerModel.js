/**
 * Created by dcoellar on 4/7/16.
 */

angular.module("easyRuta")
    .factory('brokerModel', ['dataService','collectionsEnum',function(dataService,collectionsEnum) {
        return {

            /*
             Converts a broker class object to a json object
             param: broker - the class object to be converted
             param: includes (optional) - the list of pointers to be included
             return: json - the json object converted
             */
            toJson: function(broker,includes){
                var json = {
                    object: broker,
                    id: broker.id,
                    nombre: broker.get("nombre")
                };

                //add pointers if included
                if (includes) {
                    includes.forEach(function(e,i,a){
                    });
                } else {
                }

                return json
            },

            /*
             Converts a json object to a broker object class
             param: json - the json object to be converted
             return: broker - the broker class object converted
             */
            fromJson: function(json){
                var broker = json.object;
                if (!broker){
                    broker = dataService.createCollection(collectionsEnum.broker);
                }

                broker.set("nombre",json.nombre);

                return broker;
            }
        };
    }]);