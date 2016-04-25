/**
 * Created by dcoellar on 11/26/15.
 */

(function() {

    //Variables
    var local_rootScope;
    var local_pubnub_services;
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_plantillas;
    var local_delete_plantilla;
    var local_get_plantilla;
    var local_get_ciudades;
    var local_get_transpostistas_despachador;
    var local_get_active_transportistas;
    var local_guardar_pedidos;

    //Methods

    //View Controller callbacks references
    var get_plantillas_callback;
    var get_plantilla_callback;
    var delete_plantilla_callback;
    var get_ciudades_callback;
    var get_transpostistas_despachador_callback;
    var get_active_transportistas_callback;
    var guardar_pedidos_callback;

    //Data callbacks
    var local_get_plantillas_callback;
    var local_get_plantilla_callback;
    var local_delete_plantilla_callback;
    var local_get_ciudades_callback;
    var local_get_transpostistas_despachador_callback;
    var local_get_active_transportistas_callback;
    var local_guardar_pedidos_callback

    angular.module("easyRuta")
        .factory('agregar_pedido_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_pubnub_services = pubnub_services;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_plantillas : function(callback) {
            local_get_plantillas(callback);
        },
        get_plantilla : function(id,callback) {
            local_get_plantilla(id,callback);
        },
        delete_plantilla : function(id,callback){
            local_delete_plantilla(id,callback);
        },
        get_ciudades : function(callback) {
            local_get_ciudades(callback);
        },
        get_transpostistas_despachador : function(proveedor,isForPedido,tipoTransporte,callback) {
            local_get_transpostistas_despachador(proveedor,isForPedido,tipoTransporte,callback);
        },
        get_active_transportistas : function (callback){
            local_get_active_transportistas(callback);
        },
        guardar_pedidos : function (data,transportista,callback){
            local_guardar_pedidos(data,transportista,callback);
        }
    }

    //"Public" Methods
    local_get_plantillas = function(callback){
        get_plantillas_callback = callback;
        local_data_services.get_plantillas([],local_get_plantillas_callback)
    };
    local_get_plantilla = function(id,callback){
        get_plantilla_callback =  callback;
        local_data_services.get_plantilla([id],local_get_plantilla_callback)
    };
    local_delete_plantilla = function(id,callback){
        delete_plantilla_callback =  callback;
        local_data_services.delete_plantilla([id],local_delete_plantilla_callback)
    },
    local_get_ciudades = function(callback){
        get_ciudades_callback = callback;
        local_data_services.get_ciudades([],local_get_ciudades_callback)
    };
    local_get_transpostistas_despachador = function(proveedor,isForPedido,tipoTransporte,callback){
        get_transpostistas_despachador_callback = callback;
        local_data_services.transportistas_despachador([local_rootScope.cliente,proveedor,isForPedido,tipoTransporte],local_get_transpostistas_despachador_callback)
    };
    local_get_active_transportistas = function (callback){
        get_active_transportistas_callback = callback;
        local_pubnub_services.here_now(local_get_active_transportistas_callback)
    };
    local_guardar_pedidos = function(data,transportista,callback){
        guardar_pedidos_callback = callback;
        local_data_services.guardar_pedidos([data,local_rootScope.cliente,transportista],local_guardar_pedidos_callback)
    };

    //Methods

    //Data callbacks
    local_get_plantillas_callback = function(params,error,results){
        if (!error){
            var plantillas = new Array;
            results.forEach(function(element,index,array){
                plantillas.push({id:element.id,plantilla:element.get('Plantilla')})
            });
            get_plantillas_callback(null,plantillas);
        }else{
            get_plantillas_callback(error,null);
        }
    };
    local_get_plantilla_callback = function(params,error,results){
        if (!error){
            get_plantilla_callback(null,results);
        }else{
            get_plantilla_callback(error,null);
        }
    };
    local_delete_plantilla_callback = function(params,error,results){
        if (!error){
            get_plantillas_callback(null,results);
        }else{
            get_plantillas_callback(error,null);
        }
    };
    local_get_ciudades_callback = function(params,error,results){
        if (!error){
            var ciudades = new Array;
            results.forEach(function(element,index,array){
                ciudades.push({id:element.id,nombre:element.get('Nombre')})
            });
            get_ciudades_callback(null,ciudades);
        }else{
            get_ciudades_callback(error,null);
        }
    };
    local_get_transpostistas_despachador_callback = function(params,error,results){
        if (!error){
            var transportistas = new Array();
            results.forEach(function(element,index,array){
                if (element.get("Estado") == local_rootScope.transportistas_estados.Disponible){
                    transportistas.push(local_parser.getTransportistaJson(element));
                }
            });
            if (transportistas.length > 0) {
                transportistas.sort(function (a, b) {
                    if (a.object.get("EsTercero") != b.object.get("EsTercero")) {
                        return a.object.get("EsTercero") ? 1 : -1;
                    }
                    return a.object.get("HoraDisponible") - b.object.get("HoraDisponible");
                });
                var count = 0;
                transportistas = transportistas
                    .filter(function (object) {
                        return params[3] == object.tipoTransporte
                        || (params[3] == "furgon_plataforma"
                        && (params[3] == "furgon" || object.tipoTransporte == "plataforma"))
                    })
                    .map(function (object) {
                        count++;
                        object.priority = count;
                        return object;
                    }
                );
            }
            get_transpostistas_despachador_callback(null,transportistas)
        }else{
            get_transpostistas_despachador_callback(error,null)
        }
    };
    local_get_active_transportistas_callback = function(results){
        get_active_transportistas_callback(results);
    }
    local_guardar_pedidos_callback = function(params,error,results){
        if (!error){
            local_rootScope.$broadcast('new_pedidos', {});
            local_pubnub_services.publish(local_rootScope.channels.new_pedidos, {message:"New Pedido"})

            guardar_pedidos_callback(null,results);
        }else{
            guardar_pedidos_callback(error,null);
        }
    }

})();
