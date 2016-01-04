/**
 * Created by dcoellar on 12/21/15.
 */

(function() {

    //Variables
    var local_data_services;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_get_saldo;

    //Methods

    //View Controller callbacks references
    var get_saldo_callback;

    //Data callbacks
    var local_current_proveedor_callback;

    angular.module("easyRuta")
        .factory('master_page_viewmodel',function(data_services) {

            local_data_services = data_services;

            return constructor;
        });

    //Constructor
    constructor = {
        get_saldo : function(callback) { local_get_saldo(callback); }
    }

    //"Public" Methods
    local_get_saldo = function(callback){
        get_saldo_callback = callback;
        local_data_services.current_proveedor([],local_current_proveedor_callback)
    };

    //Methods

    //Data callbacks
    local_current_proveedor_callback = function(params,error,proveedor){
        if (!error){
            if (proveedor){
                get_saldo_callback(null,proveedor.get("Saldo"));
            }
        }else{
            get_saldo_callback(error,null);
        }
    };

})();