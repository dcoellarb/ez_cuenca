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
    var local_get_pedidos_completadoss;

    //Methods

    //View Controller callbacks references
    var get_pedidos_completados_callback;

    //Data callbacks
    var local_get_pedidos_completados_callback;

    angular.module("easyRuta")
        .factory('pedidos_completados_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_pubnub_services = pubnub_services;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_pedidos_completados : function(callback) {
            local_get_pedidos_completados(callback);
        }
    }

    //"Public" Methods
    local_get_pedidos_completados = function(callback){
        get_pedidos_completados_callback = callback;
        local_data_services.get_pedidos_completados([],local_get_pedidos_completados_callback)
    };

    //Methods

    //Data callbacks
    local_get_pedidos_completados_callback = function(params,error,results){
        if (!error){
            var pedidos = new Array;
            results.forEach(function(element,index,array){
                var pedido = local_parser.getJson(element);
                pedido.transportista = local_parser.getTransportistaJson(element.get("Transportista"));
                if (local_rootScope.cliente && pedido.object.get("Proveedor")){
                    pedido.transportista = local_parser.parseProveedorIntoTransportista(pedido.transportista,pedido.object.get("Proveedor"));
                }
                pedidos.push(pedido)
            });
            get_pedidos_completados_callback(error,pedidos);
        }else{
            get_pedidos_completados_callback(error,null);
        }
    };

})();
