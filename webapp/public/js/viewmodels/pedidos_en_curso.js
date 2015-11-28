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
    var local_get_pedidos_en_curso;
    var local_finalizar_pedido;
    var local_cancelar_pedido_proveedor;

    //Methods

    //View Controller callbacks references
    var get_pedidos_en_curso_callback;
    var finalizar_pedido_callback;
    var cancelar_pedido_proveedor_callback;

    //Data callbacks
    var local_get_pedidos_en_curso_callback;
    var local_finalizar_pedido_callback
    var local_cancelar_pedido_proveedor_callback;

    angular.module("easyRuta")
        .factory('pedidos_en_curso_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_pubnub_services = pubnub_services;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_pedidos_en_curso : function(callback) {local_get_pedidos_en_curso(callback);},
        finalizar_pedido : function(pedido,callback) {local_finalizar_pedido(pedido,callback);},
        cancelar_pedido_proveedor : function(pedido,callback) { local_cancelar_pedido_proveedor(pedido,callback); }
    };

    //"Public" Methods
    local_get_pedidos_en_curso = function(callback){
        get_pedidos_en_curso_callback = callback;
        local_data_services.get_pedidos_en_curso([],local_get_pedidos_en_curso_callback)
    };
    local_finalizar_pedido = function(pedido,callback){
        finalizar_pedido_callback = callback;
        local_data_services.finalizar_pedido([pedido.object],local_finalizar_pedido_callback)
    };
    local_cancelar_pedido_proveedor = function(pedido,callback){
        cancelar_pedido_proveedor_callback = callback;
        local_data_services.cancelar_pedido_proveedor([pedido.object],local_cancelar_pedido_proveedor_callback);
    };
    //Methods

    //Data callbacks
    local_get_pedidos_en_curso_callback = function(params,error,results){
        if (!error){
            var pedidos = new Array;
            results.forEach(function(element,index,array){
                var pedido = local_parser.getJson(element);
                pedido.transportista = local_parser.getTransportistaJson(element.get("Transportista"));
                pedidos.push(pedido);
            });
            get_pedidos_en_curso_callback(null,pedidos);
        }else{
            get_pedidos_en_curso_callback(error,null);
        }
    };
    local_finalizar_pedido_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_completado,{id:params[0].id})
        local_rootScope.$broadcast(local_rootScope.channels.pedido_completado, {id:params[0].id});
        finalizar_pedido_callback(error,results);
    };
    local_cancelar_pedido_proveedor_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_cancelado_confirmado_proveedor,{id:params[0].id})
        local_rootScope.$broadcast(local_rootScope.channels.pedido_cancelado_confirmado_proveedor, {id:params[0].id});
        cancelar_pedido_proveedor_callback(error,results);
    };

})();