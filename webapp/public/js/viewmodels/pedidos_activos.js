/**
 * Created by dcoellar on 11/25/15.
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
    var local_get_pedidos_activos;
    var local_cancelar_pedido;
    var local_cancelar_pedido_proveedor;
    var local_iniciar_pedido;

    //Methods

    //View Controller callbacks references
    var get_pedidos_activos_callback;
    var cancelar_pedido_callback;
    var cancelar_pedido_proveedor_callback;
    var iniciar_pedido_callback;

    //Data callbacks
    var local_get_pedidos_activos_callback;
    var local_cancelar_pedido_callback;
    var local_cancelar_pedido_proveedor_callback;
    var local_iniciar_pedido_callback

    angular.module("easyRuta")
        .factory('pedidos_activos_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_pubnub_services = pubnub_services;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_pedidos_activos : function(callback) {local_get_pedidos_activos(callback);},
        cancelar_pedido : function(pedido,callback) { local_cancelar_pedido(pedido,callback); },
        cancelar_pedido_proveedor : function(pedido,callback) { local_cancelar_pedido_proveedor(pedido,callback); },
        iniciar_pedido : function(pedido,callback) { local_iniciar_pedido(pedido,callback); }
    }

    //"Public" Methods
    local_get_pedidos_activos = function(callback){
        get_pedidos_activos_callback = callback;
        local_data_services.get_pedidos_activos([],local_get_pedidos_activos_callback)
    };
    local_cancelar_pedido = function(pedido,callback){
        cancelar_pedido_callback = callback;
        local_data_services.cancelar_pedido([pedido.object],local_cancelar_pedido_callback);
    };
    local_cancelar_pedido_proveedor = function(pedido,callback){
        cancelar_pedido_proveedor_callback = callback;
        local_data_services.cancelar_pedido_proveedor([pedido.object],local_cancelar_pedido_proveedor_callback);
    };
    local_iniciar_pedido = function(pedido,callback){
        iniciar_pedido_callback = callback;
        local_data_services.iniciar_pedido([pedido.object],local_iniciar_pedido_callback);
    };

    //Methods

    //Data callbacks
    local_get_pedidos_activos_callback = function(params,error,results){
        if (!error){
            var pedidos = new Array;
            results.forEach(function(element,index,array){
                var pedido = local_parser.getJson(element);
                pedido.transportista = local_parser.getTransportistaJson(element.get("Transportista"));
                pedidos.push(pedido);
            });
            get_pedidos_activos_callback(null,pedidos);
        }else{
            get_pedidos_activos_callback(error,null);
        }
    };
    local_cancelar_pedido_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_cancelado,{id:params[0].id});
        local_rootScope.$broadcast(local_rootScope.channels.pedido_cancelado, {id:params[0].id});
        cancelar_pedido_callback(error,results);
    };
    local_cancelar_pedido_proveedor_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_cancelado_confirmado_proveedor,{id:params[0].id})
        local_rootScope.$broadcast(local_rootScope.channels.pedido_cancelado_confirmado_proveedor, {id:params[0].id});
        cancelar_pedido_proveedor_callback(error,results);
    };
    local_iniciar_pedido_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_iniciado,{id:params[0].id})
        local_rootScope.$broadcast(local_rootScope.channels.pedido_iniciado, {id:params[0].id});
        iniciar_pedido_callback(error,results);
    };

})();