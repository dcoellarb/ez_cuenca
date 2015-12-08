/**
 * Created by dcoellar on 11/18/15.
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
    var local_get_transportistas_proveedor;
    var local_habilitar_transportista;

    //Methods

    //View Controller callbacks references
    var get_transportistas_proveedor;
    var habilitar_transportista_callback;

    //Data callbacks
    var local_get_transportistas_proveedor_callback;
    var local_habilitar_transportista_callback;

    angular.module("easyRuta")
        .factory('transportistas_proveedor_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_pubnub_services = pubnub_services;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_transportistas_proveedor : function(callback) {
            local_get_transportistas_proveedor(callback);
        },
        habilitar_transportista : function(transportista,callback){
            local_habilitar_transportista(transportista,callback);
        }
    };

    //"Public" Methods
    local_get_transportistas_proveedor = function(callback){
        get_transportistas_proveedor = callback;
        local_data_services.transportistas_proveedor([],local_get_transportistas_proveedor_callback)
    };
    local_habilitar_transportista = function(transportista,callback){
        habilitar_transportista_callback = callback;
        local_data_services.update_estado_transportista([transportista.object,local_rootScope.transportistas_estados.Disponible],local_habilitar_transportista_callback)
    };

    //Methods

    //Data callbacks
    local_get_transportistas_proveedor_callback = function(params,error,results) {
        get_transportistas_proveedor(error,results.map(function(object){
            var json = local_parser.getTransportistaJson(object)
            if (json.estado == local_rootScope.transportistas_estados.Disponible){
                json.checkGlyphicon = "glyphicon-ok"
                json.checkColor = "list-item-check-green"
            }else if (json.estado == local_rootScope.transportistas_estados.NoDisponible){
                json.checkGlyphicon = "glyphicon-minus"
                json.checkColor = "list-item-check-red"
            }else if (json.estado == local_rootScope.transportistas_estados.EnViaje){
                json.checkGlyphicon = "glyphicon-random"
                json.checkColor = "list-item-check-blue"
            }
            return json;
        }));
    };
    local_habilitar_transportista_callback = function(params,error,results) {
        local_rootScope.$broadcast(local_rootScope.channels.transportista_habilitado, params[0]);
        local_pubnub_services.publish(local_rootScope.channels.transportista_habilitado,{id:params[0].id})
        habilitar_transportista_callback(error,results);
    };
})();