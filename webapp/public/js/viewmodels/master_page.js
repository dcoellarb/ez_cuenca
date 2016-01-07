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
    var local_get_notifications_count

    //Methods

    //View Controller callbacks references
    var get_saldo_callback;
    var get_notifications_count_callback;

    //Data callbacks
    var local_current_proveedor_callback;
    var local_get_notifications_count_callback;

    angular.module("easyRuta")
        .factory('master_page_viewmodel',function(data_services) {

            local_data_services = data_services;

            return constructor;
        });

    //Constructor
    constructor = {
        get_saldo : function(callback) { local_get_saldo(callback); },
        get_notifications_count : function(callback) { local_get_notifications_count(callback); }
    }

    //"Public" Methods
    local_get_saldo = function(callback){
        get_saldo_callback = callback;
        local_data_services.current_proveedor([],local_current_proveedor_callback)
    };
    local_get_notifications_count = function(callback){
        get_notifications_count_callback = callback;
        local_data_services.notifications_count([],local_get_notifications_count_callback);
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
    local_get_notifications_count_callback = function(params,error,count){
        if (!error){
            get_notifications_count_callback(null,count);
        }else{
            get_notifications_count_callback(error,0);
        }
    }

})();