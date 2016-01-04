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
    var local_get_transportista
    var local_save;
    var local_delete;
    var local_habilitar;

    //Methods

    //View Controller callbacks references
    var get_transportista_callback;
    var save_callback;
    var delete_callback;
    var habilitar_callback;

    //Data callbacks
    var local_get_transportista_callback;
    var local_save_callback;
    var local_save_file_callback;
    var local_delete_callback;
    var local_habilitar_callback;

    angular.module("easyRuta")
        .factory('transportista_edit_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_transportista : function(id,callback) { local_get_transportista(id,callback); },
        save : function(transportista,name,file,callback) { local_save(transportista,name,file,callback); },
        delete : function(transportista,callback) { local_delete(transportista,callback); },
        habilitar : function(transportista,callback) { local_habilitar(transportista,callback); }
    }

    //"Public" Methods
    local_get_transportista = function(id,callback){
        get_transportista_callback = callback;
        local_data_services.get_transportista([id],local_get_transportista_callback)
    };
    local_save = function(transportista,name,file,callback){
        save_callback = callback;
        if (name && file){
            local_data_services.save_file([transportista,name,file],local_save_file_callback);
        }else{
            local_data_services.save_transportista([transportista,local_rootScope.proveedor],local_save_callback);
        }
    };
    local_delete = function(transportista,callback){
        delete_callback = callback;
        local_data_services.delete_transportista([transportista.object],local_delete_callback);
    };
    local_habilitar = function(transportista,callback){
        habilitar_callback = callback;
        local_data_services.update_estado_transportista([transportista.object,local_rootScope.transportistas_estados.Disponible],local_habilitar_callback)
    };

    //Methods

    //Data callbacks
    local_get_transportista_callback = function(params,error,results){
        var transportista;
        if (!error){
            transportista = local_parser.getTransportistaJson(results[0]);
        }
        get_transportista_callback(error,transportista);
    };
    local_save_callback = function(params,error,results){
        save_callback(error,results);
    };
    local_save_file_callback = function(params,error,results){
        if (!error){
            params[0].object.set("photo",results);
            local_data_services.save_transportista([params[0],local_rootScope.proveedor],local_save_callback);
        }
    };
    local_delete_callback = function(params,error,results){
        delete_callback(error,results);
    };
    local_habilitar_callback = function(params,error,results){
        habilitar_callback(error,results);
    };
})();