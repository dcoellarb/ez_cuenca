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
    var local_get_pedidos_pendientes;
    var local_confirmar_pedido;
    var local_rechazar_pedido;
    var local_proveedor_tomar_pedido;
    var local_proveedor_confirmar_pedido;
    var local_proveedor_rechazar_pedido;
    var local_timeout_pedido_cliente;
    var local_timeout_pedido_proveedor;
    var local_cancelar_pedido;

    //Methods

    //View Controller callbacks references
    var get_pedidos_pendientes_callback;
    var confirmar_pedido_callback;
    var rechazar_pedido_callback;
    var proveedor_tomar_pedido_callback;
    var proveedor_confirmar_pedido_callback;
    var proveedor_rechazar_pedido_callback;
    var timeout_pedido_cliente_callback;
    var timeout_pedido_proveedor_callback;
    var cancelar_pedido_callback;

    //Data callbacks
    var local_get_pedidos_pendientes_callback;
    var local_confirmar_pedido_callback;
    var local_rechazar_pedido_callback;
    var local_proveedor_tomar_pedido_callback;
    var local_proveedor_confirmar_pedido_callback;
    var local_proveedor_rechazar_pedido_callback;
    var local_transportista_statistics_callback;
    var local_transportistas_proveedor_callback;
    var local_timeout_pedido_cliente_callback;
    var local_timeout_pedido_proveedor_callback;
    var local_cancelar_pedido_callback

    angular.module("easyRuta")
        .factory('pedidos_pendientes_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_pubnub_services = pubnub_services;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_pedidos_pendientes : function(callback) {
            local_get_pedidos_pendientes(callback);
        },
        confirmar_pedido : function(pedido,callback) { local_confirmar_pedido(pedido,callback); },
        rechazar_pedido : function(pedido,callback) { local_rechazar_pedido(pedido,callback); },
        proveedor_tomar_pedido : function(pedido,transportista,callback) { local_proveedor_tomar_pedido(pedido,transportista,callback); },
        proveedor_confirmar_pedido : function(pedido,transportista,callback) { local_proveedor_confirmar_pedido(pedido,transportista,callback); },
        proveedor_rechazar_pedido : function(pedido,callback) { local_proveedor_rechazar_pedido(pedido,callback); },
        timeout_pedido_cliente : function(pedido,callback) { local_timeout_pedido_cliente(pedido,callback); },
        timeout_pedido_proveedor : function(pedido,callback) { local_timeout_pedido_proveedor(pedido,callback); },
        cancelar_pedido : function(pedido,callback) { local_cancelar_pedido(pedido,callback); }
    }

    //"Public" Methods
    local_get_pedidos_pendientes = function(callback){
        get_pedidos_pendientes_callback = callback;
        local_data_services.get_pedidos_pendientes([],local_get_pedidos_pendientes_callback)
    };
    local_confirmar_pedido = function(pedido,callback){
        confirmar_pedido_callback = callback;
        local_data_services.confirmar_pedido([pedido.object],local_confirmar_pedido_callback);
    };
    local_rechazar_pedido = function(pedido,callback){
        rechazar_pedido_callback = callback;
        local_data_services.rechazar_pedido([pedido.object],local_rechazar_pedido_callback);
    };
    local_proveedor_tomar_pedido = function(pedido,transportista,callback){
        proveedor_tomar_pedido_callback = callback;
        local_data_services.proveedor_tomar_pedido([pedido.object,transportista.object,local_rootScope.proveedor],local_proveedor_tomar_pedido_callback);
    };
    local_proveedor_confirmar_pedido = function(pedido,transportista,callback){
        proveedor_confirmar_pedido_callback = callback;
        local_data_services.proveedor_confirmar_pedido([pedido.object,transportista.object],local_proveedor_confirmar_pedido_callback);
    };
    local_proveedor_rechazar_pedido = function(pedido,callback){
        proveedor_rechazar_pedido_callback = callback;
        local_data_services.proveedor_rechazar_pedido([pedido.object,local_rootScope.proveedor],local_proveedor_rechazar_pedido_callback);
    };
    local_timeout_pedido_cliente = function(pedido,callback){
        timeout_pedido_cliente_callback = callback;
        local_data_services.timeout_pedido_cliente([pedido.object],local_timeout_pedido_cliente_callback);
    };
    local_timeout_pedido_proveedor = function(pedido,callback){
        timeout_pedido_proveedor_callback = callback;
        local_data_services.timeout_pedido_proveedor([pedido.object],local_timeout_pedido_proveedor_callback);
    };
    local_cancelar_pedido = function(pedido,callback){
        cancelar_pedido_callback = callback;
        local_data_services.cancelar_pedido([pedido.object],local_cancelar_pedido_callback);
    };

    //Methods

    //Data callbacks
    local_get_pedidos_pendientes_callback = function(params,error,results){

        if (!error){
            var pedidos = new Array;
            results.forEach(function(element,index,array){
                var pedido = local_parser.getJson(element);
                if (local_rootScope.loggedInRole.getName() == "cliente"){
                    if (element.get("Proveedor")){
                        pedido.proveedor = local_parser.getProveedorJson(element.get("Proveedor"));
                    }
                    if (element.get("Transportista")){
                        pedido.transportista = local_parser.getTransportistaJson(element.get("Transportista"));
                        local_data_services.transportista_statistics([element.get("Transportista").id,pedidos,pedido,results.length],local_transportista_statistics_callback);
                    }else{
                        pedidos.push(pedido);
                    }
                }else if (local_rootScope.loggedInRole.getName() == "proveedor"){
                    if (element.get("Estado") == "Pendiente" || element.get("Estado") == "PendienteConfirmacionProveedor"){
                        local_data_services.transportistas_proveedor([local_rootScope.proveedor,pedidos,pedido,results.length],local_transportistas_proveedor_callback);
                    }else if (element.get("Estado") == "PendienteConfirmacion") {
                        pedido.transportista = local_parser.getTransportistaJson(element.get("Transportista"));
                        pedidos.push(pedido);
                    }
                }
            });
            if (pedidos.length == results.length){
                get_pedidos_pendientes_callback(null,pedidos);
            }
        }else{
            get_pedidos_pendientes_callback(error,null);
        }

    };
    local_transportista_statistics_callback = function(params,error,results){
        var pedidos = params[1];
        var pedido = params[2];
        var count = params[3];
        if(!error && results){
            pedido.transportista.statistics = results;
        }
        pedidos.push(pedido);

        if (pedidos.length == count){
            get_pedidos_pendientes_callback(null,pedidos);
        }
    };
    local_transportistas_proveedor_callback = function(params,error,results){
        var pedidos = params[1];
        var pedido = params[2];
        var count = params[3];

        pedido.transportistas = new Array();
        if(!error){
            results.forEach(function(element,index,array){
                pedido.transportistas.push(local_parser.getTransportistaJson(element));
            });
        }
        pedidos.push(pedido);

        if (pedidos.length == count){
            get_pedidos_pendientes_callback(null,pedidos);
        }
    };
    local_confirmar_pedido_callback = function(params,error,results){
        local_rootScope.$broadcast(local_rootScope.channels.pedido_confirmado, params[0]);
        local_pubnub_services.publish(local_rootScope.channels.pedido_confirmado,{id:params[0].id})
        confirmar_pedido_callback(error,null);
    };
    local_rechazar_pedido_callback = function(params,error,results){
        local_rootScope.$broadcast(local_rootScope.channels.pedido_rechazado, params[0]);
        local_pubnub_services.publish(local_rootScope.channels.pedido_rechazado,{id:params[0].id})
        rechazar_pedido_callback(error,null);
    };
    local_proveedor_tomar_pedido_callback = function(params,error,results){
        //local_rootScope.$broadcast(local_rootScope.channels.pedido_rechazado, params[0]);
        local_pubnub_services.publish(local_rootScope.channels.pedido_tomado,{id:params[0].id})
        proveedor_tomar_pedido_callback(error,null);
    };
    local_proveedor_confirmar_pedido_callback = function(params,error,results){
        local_rootScope.$broadcast(local_rootScope.channels.pedido_confirmado_proveedor, params[0]);
        local_pubnub_services.publish(local_rootScope.channels.pedido_confirmado_proveedor,{id:params[0].id})
        proveedor_confirmar_pedido_callback(error,null);
    };
    local_proveedor_rechazar_pedido_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_rechazado_proveedor,{id:params[0].id})
        proveedor_rechazar_pedido_callback(error,null);
    };
    local_timeout_pedido_cliente_callback = function(params,error,results){
        timeout_pedido_cliente_callback(error,null);
    };
    local_timeout_pedido_proveedor_callback = function(params,error,results){
        timeout_pedido_proveedor_callback(error,null);
    };
    local_cancelar_pedido_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_cancelado,{id:params[0].id})
        cancelar_pedido_callback(error,results);
    };

})();