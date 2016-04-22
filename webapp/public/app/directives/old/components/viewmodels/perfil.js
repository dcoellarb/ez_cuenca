/**
 * Created by dcoellar on 12/22/15.
 */

(function() {

    //Variables
    var local_root_scope;
    var local_data_services;
    var local_parser;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_save;
    var local_get_cliente;
    var local_get_proveedor;

    //Methods

    //View Controller callbacks references
    var save_callback;
    var get_cliente_callback;
    var get_proveedor_callback;

    //Data callbacks
    var local_save_callback;
    var local_get_cliente_callback;
    var local_get_proveedor_callback;

    angular.module("easyRuta")
        .factory('perfil_viewmodel',function($rootScope,data_services,parser) {

            local_root_scope = $rootScope;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        save : function(object,image,callback){
            local_save(object,image,callback);
        },
        get_cliente : function(callback){
            local_get_cliente(callback)
        },
        get_proveedor : function(callback){
            local_get_proveedor(callback)
        }
    };

    //"Public" Methods
    local_save = function(object,image,callback){
        save_callback = callback
        if (local_root_scope.loggedInRole.getName() == "cliente"){
            local_data_services.save_cliente([object,image],local_save_callback)
        }
        else if (local_root_scope.loggedInRole.getName() == "proveedor"){
            local_data_services.save_proveedor([object,image],local_save_callback)
        }
    };
    local_get_cliente = function(callback){
        get_cliente_callback = callback;
        local_data_services.current_cliente([],local_get_cliente_callback);
    };
    local_get_proveedor = function(callback){
        get_proveedor_callback = callback;
        local_data_services.current_proveedor([],local_get_proveedor_callback);
    };

    //Methods

    //Data callbacks
    local_save_callback = function(params,error,results){
        if (!error){
            save_callback(null,results);
        }else{
            save_callback(error,null)
        }
    };
    local_get_cliente_callback = function(params,error,results){
        if (!error){
            var cliente = local_parser.getClienteJson(results);
            get_cliente_callback(null,cliente);
        }else{
            get_cliente_callback(error,null)
        }
    };
    local_get_proveedor_callback = function(params,error,results){
        if (!error){
            var proveedor = local_parser.getProveedorJson(results);
            get_proveedor_callback(null,proveedor);
        }else{
            get_proveedor_callback(error,null)
        }
    };

})();