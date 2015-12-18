/**
 * Created by dcoellar on 12/18/15.
 */

(function() {

    //Variables
    var local_rootScope;
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_historico_pedidos;

    //Methods

    //View Controller callbacks references
    var get_historico_pedidos_callback;

    //Data callbacks
    var local_get_historico_pedidos_callback;

    angular.module("easyRuta")
        .factory('historico_view_model',function($rootScope,data_services,parser) {

            local_rootScope = $rootScope
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_historico_pedidos : function(callback) {
            local_get_historico_pedidos(callback);
        }
    }

    //"Public" Methods
    local_get_historico_pedidos = function(callback){
        get_historico_pedidos_callback = callback;
        local_data_services.get_historico_pedidos([],local_get_historico_pedidos_callback)
    };

    //Methods

    //Data callbacks
    local_get_historico_pedidos_callback = function(params,error,results){
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
            get_historico_pedidos_callback(null,pedidos);
        }else{
            get_historico_pedidos_callback(error,null);
        }
    };

})();
