/**
 * Created by dcoellar on 11/18/15.
 */

(function() {

    //Variables
    var local_rootScope;
    var local_pubnub_services;
    var local_data_services;
    var local_parser;

    //Aux Variables
    var pedidosAux;
    var pedidosAux1;
    var pedidos_procesadosAux;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_pedidos_pendientes;
    var local_confirmar_pedido;
    var local_rechazar_pedido;
    var local_proveedor_tomar_pedido;
    var local_proveedor_confirmar_pedido;
    var local_proveedor_rechazar_pedido;
    var local_timeout_pedido;
    var local_cancelar_pedido;

    //Methods

    //View Controller callbacks references
    var get_pedidos_pendientes_callback;
    var confirmar_pedido_callback;
    var rechazar_pedido_callback;
    var proveedor_tomar_pedido_callback;
    var proveedor_confirmar_pedido_callback;
    var proveedor_rechazar_pedido_callback;
    var timeout_pedido_callback;
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
    var local_get_pedidos_pendientes_merge_callback;
    var local_timeout_pedido_callback;
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
        timeout_pedido : function(pedido,callback) { local_timeout_pedido(pedido,callback); },
        cancelar_pedido : function(pedido,callback) { local_cancelar_pedido(pedido,callback); }
    }

    //"Public" Methods
    local_get_pedidos_pendientes = function(callback){
        get_pedidos_pendientes_callback = callback;
        local_data_services.get_pedidos_pendientes(new Array(),local_get_pedidos_pendientes_callback)
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
    local_timeout_pedido = function(pedido,callback){
        timeout_pedido_callback = callback;
        local_data_services.timeout_pedido([pedido.object],local_timeout_pedido_callback);
    };
    local_cancelar_pedido = function(pedido,callback){
        cancelar_pedido_callback = callback;
        local_data_services.cancelar_pedido([pedido.object],local_cancelar_pedido_callback);
    };

    //Methods

    //Data callbacks
    local_get_pedidos_pendientes_callback = function(params,error,results){

        if (!error){
            pedidosAux1 = results;
            pedidosAux = new Array();
            pedidos_procesadosAux = 0;
            results.forEach(function(element,index,array){
                var pedido = local_parser.getJson(element);
                if (local_rootScope.loggedInRole.getName() == "cliente"){
                    if (element.get("Proveedor")){
                        pedido.proveedor = local_parser.getProveedorJson(element.get("Proveedor"));
                    }
                    if (element.get("Transportista")){
                        local_data_services.transportista_statistics([element.get("Transportista"),pedido],local_transportista_statistics_callback);
                    }else{
                        local_transportista_statistics_callback([null,pedido],null,null);
                    }
                }else if (local_rootScope.loggedInRole.getName() == "proveedor"){
                    if (element.get("Estado") == local_rootScope.pedidos_estados.Pendiente || element.get("Estado") == local_rootScope.pedidos_estados.PendienteConfirmacionProveedor){
                        local_data_services.transportistas_proveedor([element,pedido],local_transportistas_proveedor_callback);
                    }else if (element.get("Estado") == local_rootScope.pedidos_estados.PendienteConfirmacion) {
                        if (element.get("Transportista")) {
                            pedido.transportista = local_parser.getTransportistaJson(element.get("Transportista"))
                        }
                        pedidosAux.push(pedido);
                        local_get_pedidos_pendientes_merge_callback(params,null,null);
                    }
                }
            });
        }else{
            get_pedidos_pendientes_callback(error,null);
        }

    };
    local_transportista_statistics_callback = function(params,error,results){
        var pedido = params[1];
        if(!error && results){
            pedido.transportista = {statistics : results};
        }
        pedidosAux.push(pedido);
        local_get_pedidos_pendientes_merge_callback(params,null,null);
    };
    local_transportistas_proveedor_callback = function(params,error,results){
        var pedido = params[1];
        pedido.transportistas = new Array();
        results.forEach(function(element,index,array){
            if (element.get("Estado") == local_rootScope.transportistas_estados.Disponible){
                pedido.transportistas.push(local_parser.getTransportistaJson(element));
            }
        });
        if (pedido.transportistas.length > 0){
            pedido.transportistas.sort(function(a,b) {
                return a.object.get("HoraDisponible") - b.object.get("HoraDisponible");
            });
            var count = 0;
            pedido.transportistas.map(function(object){
                count++;
                object.priority = count;
                return object;
            });
            pedidosAux.push(pedido);
        }
        local_get_pedidos_pendientes_merge_callback(params,null,null);
    };
    local_get_pedidos_pendientes_merge_callback = function(params,error,results){
        pedidos_procesadosAux++;
        if (pedidos_procesadosAux == pedidosAux1.length){
            pedidosAux.sort(function(a,b) {
                return a.object.get("createdAt") - b.object.get("createdAt");
            });
            get_pedidos_pendientes_callback(null,pedidosAux);
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
        local_rootScope.$broadcast(local_rootScope.channels.pedido_tomado, params[0]);
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
    local_timeout_pedido_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_timeout,{id:params[0].id})
        timeout_pedido_callback(error,null);
    };
    local_cancelar_pedido_callback = function(params,error,results){
        local_pubnub_services.publish(local_rootScope.channels.pedido_cancelado,{id:params[0].id})
        cancelar_pedido_callback(error,results);
    };

})();