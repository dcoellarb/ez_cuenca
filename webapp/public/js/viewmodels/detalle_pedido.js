/**
 * Created by dcoellar on 12/15/15.
 */

(function() {

    //Variables
    var local_rootScope;
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_pedido;

    //Methods

    //View Controller callbacks references
    var get_pedido_callback;

    //Data callbacks
    var local_get_pedido_callback;

    angular.module("easyRuta")
        .factory('detalle_pedido_viewmodel',function($rootScope,data_services,parser) {

            local_rootScope = $rootScope;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_pedido : function(id,callback){
            local_get_pedido(id,callback);
        }
    }

    //"Public" Methods
    local_get_pedido = function(id,callback){
        get_pedido_callback = callback;
        local_data_services.get_pedido([id],local_get_pedido_callback)
    };

    //Methods

    //Data callbacks
    local_get_pedido_callback = function(params,error,results){
        if (!error){
            var pedido = local_parser.getJson(results);
            pedido.transportista = local_parser.getTransportistaJson(results.get("Transportista"));
            if (local_rootScope.cliente && pedido.object.get("Proveedor")){
                pedido.transportista = local_parser.parseProveedorIntoTransportista(pedido.transportista,pedido.object.get("Proveedor"));
            }
            get_pedido_callback(null,pedido);
        }else{
            get_pedido_callback(error,null);
        }
    };
})();