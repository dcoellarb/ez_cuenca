/**
 * Created by dcoellar on 1/11/16.
 */

(function() {

    //Variables
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_pedidos_completados
    var local_save_all;

    //Methods

    //View Controller callbacks references
    var get_pedidos_completados_callback;
    var save_all_callback;

    //Data callbacks
    var local_get_pedidos_completados_callback;
    var local_save_all_callback;

    angular.module("easyRuta")
        .factory('rate_transportista_modal_viewmodel',function(data_services,parser) {

            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_pedidos_completados : function(callback) { local_get_pedidos_completados(callback); },
        save_all : function(pedidos,callback) { local_save_all(pedidos,callback); }
    };

    //"Public" Methods
    local_get_pedidos_completados = function(callback){
        get_pedidos_completados_callback = callback;
        local_data_services.get_pedidos_completados_no_calificados([],local_get_pedidos_completados_callback)
    };
    local_save_all = function(pedidos,callback){
        save_all_callback = callback;
        local_data_services.rate_pedidos([pedidos],local_save_all_callback);
    };

    //Methods

    //Data callbacks
    local_get_pedidos_completados_callback = function(params,error,results){
        if (!error){
            var pedidos = new Array;
            results.forEach(function(element,index,array){
                var pedido = local_parser.getJson(element);
                pedido.transportista = local_parser.getTransportistaJson(element.get("Transportista"));
                if (pedido.object.get("Proveedor")){
                    pedido.transportista = local_parser.parseProveedorIntoTransportista(pedido.transportista,pedido.object.get("Proveedor"));
                }
                pedidos.push(pedido)
            });
            get_pedidos_completados_callback(error,pedidos);
        }else{
            get_pedidos_completados_callback(error,null);
        }
    };

    local_save_all_callback = function(params,error,results){
        save_all_callback(error,results);
    };
})();