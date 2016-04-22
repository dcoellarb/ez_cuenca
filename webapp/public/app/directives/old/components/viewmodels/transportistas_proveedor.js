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
    var local_check_context_initialization;
    var local_get_transportistas_proveedor;
    var local_get_transpostistas_despachador;
    var local_habilitar_transportista;

    //Methods

    //View Controller callbacks references
    var check_context_initialization;
    var get_transportistas_proveedor;
    var get_transpostistas_despachador_callback;
    var habilitar_transportista_callback;

    //Data callbacks
    var local_check_context_initialization_callback;
    var local_get_transportistas_proveedor_callback;
    var local_get_transpostistas_despachador_callback;
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
        check_context_initialization : function(callback) {
            local_check_context_initialization(callback);
        },
        get_transportistas_proveedor : function(callback) {
            local_get_transportistas_proveedor(callback);
        },
        get_transpostistas_despachador : function(proveedor,isForPedido,tipoTransporte,callback) {
            local_get_transpostistas_despachador(proveedor,isForPedido,tipoTransporte,callback);
        },
        habilitar_transportista : function(transportista,callback){
            local_habilitar_transportista(transportista,callback);
        }
    };

    //"Public" Methods
    local_check_context_initialization = function(callback){
        check_context_initialization = callback;
        local_data_services.check_context_initialization([],local_check_context_initialization_callback)
    };
    local_get_transportistas_proveedor = function(callback){
        get_transportistas_proveedor = callback;
        local_data_services.transportistas_proveedor([],local_get_transportistas_proveedor_callback)
    };
    local_get_transpostistas_despachador = function(proveedor,isForPedido,tipoTransporte,callback){
        get_transpostistas_despachador_callback = callback;
        local_data_services.transportistas_despachador([local_rootScope.cliente,proveedor,isForPedido,tipoTransporte],local_get_transpostistas_despachador_callback)
    };

    //Methods

    //Data callbacks
    local_check_context_initialization_callback = function(params,error,results){
        check_context_initialization(error,results);
    };
    local_get_transportistas_proveedor_callback = function(params,error,results) {
        var transportistas = results.map(function(object){
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
        });
        transportistas.sort(function(a,b) {
            if (a.object.get("EsTercero") != b.object.get("EsTercero")) {
                return a.object.get("EsTercero") ? 1 : -1;
            }
            return a.object.get("HoraDisponible") - b.object.get("HoraDisponible");
        });
        get_transportistas_proveedor(error,transportistas);
    };
    local_get_transpostistas_despachador_callback = function(params,error,results){
        var transportistas = results.map(function(object){
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
        });
        transportistas.sort(function(a,b) {
            if (a.object.get("EsTercero") != b.object.get("EsTercero")) {
                return a.object.get("EsTercero") ? 1 : -1;
            }
            return a.object.get("HoraDisponible") - b.object.get("HoraDisponible");
        });
        get_transpostistas_despachador_callback(error,transportistas)
    };
    local_habilitar_transportista_callback = function(params,error,results) {
        local_rootScope.$broadcast(local_rootScope.channels.transportista_habilitado, params[0]);
        local_pubnub_services.publish(local_rootScope.channels.transportista_habilitado,{id:params[0].id})
        habilitar_transportista_callback(error,results);
    };
})();