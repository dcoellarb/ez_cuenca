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
    var local_get_transportista;
    var local_get_asignaciones_transportista;
    var local_get_asignaciones_proveedor;
    var local_get_viajes_count;
    var local_save;
    var local_delete;
    var local_habilitar;
    var local_deshabilitar;
    var local_add_asignacion;
    var local_delete_asignacion;

    //Methods

    //View Controller callbacks references
    var get_transportista_callback;
    var get_asignaciones_transportista_callback;
    var get_asignaciones_proveedor_callback;
    var get_viajes_count_callback;
    var save_callback;
    var delete_callback;
    var habilitar_callback;
    var deshabilitar_callback;
    var add_asignacion_callback;
    var delete_asignacion_callback;

    //Data callbacks
    var local_get_transportista_callback;
    var local_get_asignaciones_transportista_callback;
    var local_get_asignaciones_proveedor_callback;
    var local_save_callback;
    var local_save_file_callback;
    var local_delete_callback;
    var local_habilitar_callback;
    var local_deshabilitar_callback;
    var local_get_viajes_count_callback;
    var local_add_asignacion_callback;
    var local_delete_asignacion_callback;

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
        get_asignaciones_transportista : function(transportista,callback) { local_get_asignaciones_transportista(transportista,callback); },
        get_asignaciones_proveedor : function(proveedor,callback) { local_get_asignaciones_proveedor(proveedor,callback); },
        get_viajes_count : function(transportista,callback) { local_get_viajes_count(transportista,callback); },
        save : function(transportista,name,file,callback) { local_save(transportista,name,file,callback); },
        delete : function(transportista,callback) { local_delete(transportista,callback); },
        habilitar : function(transportista,cliente,callback) { local_habilitar(transportista,cliente,callback); },
        deshabilitar  : function(transportista,callback) { local_deshabilitar(transportista,callback); },
        add_asignacion  : function(transportista,empresa,callback) { local_add_asignacion(transportista,empresa,callback); },
        delete_asignacion  : function(transportista,empresa,callback) { local_delete_asignacion(transportista,empresa,callback); }
    }

    //"Public" Methods
    local_get_transportista = function(id,callback){
        get_transportista_callback = callback;
        local_data_services.get_transportista([id],local_get_transportista_callback)
    };
    local_get_asignaciones_transportista = function(transportista,callback){
        get_asignaciones_transportista_callback = callback;
        local_data_services.get_asignaciones_transportista([transportista],local_get_asignaciones_transportista_callback)
    };
    local_get_asignaciones_proveedor = function(proveedor,callback){
        get_asignaciones_proveedor_callback = callback;
        local_data_services.get_asignaciones_proveedor([proveedor],local_get_asignaciones_proveedor_callback)
    };
    local_get_viajes_count = function(transportista,callback){
        get_viajes_count_callback = callback;
        local_data_services.viajes_en_curso_transportista_count([transportista],local_get_viajes_count_callback)
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
    local_habilitar = function(transportista,cliente,callback){
        habilitar_callback = callback;
        local_data_services.update_estado_transportista([transportista.object,null,new Date(),cliente,new Date(),local_rootScope.transportistas_estados.Disponible],local_habilitar_callback)
    };
    local_deshabilitar = function(transportista,callback){
        deshabilitar_callback = callback;
        local_data_services.update_estado_transportista([transportista.object,null,null,null,undefined,local_rootScope.transportistas_estados.NoDisponible],local_deshabilitar_callback)
    };
    local_add_asignacion = function(transportista,empresa,callback){
        add_asignacion_callback = callback;
        local_data_services.add_asignacion_proveedor([transportista,empresa],local_add_asignacion_callback)
    };
    local_delete_asignacion = function(transportista,empresa,callback){
        delete_asignacion_callback = callback;
        local_data_services.delete_asignacion_proveedor([transportista,empresa],local_delete_asignacion_callback)
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
    local_get_asignaciones_transportista_callback = function(params,error,results){
        var clientes = [];
        if (!error){
            results.forEach(function(element,index,array){
                clientes.push(local_parser.getClienteJson(element));
            });
        }
        get_asignaciones_transportista_callback(error,clientes);
    };
    local_get_asignaciones_proveedor_callback = function(params,error,results){
        var clientes = [];
        if (!error){
            results.forEach(function(element,index,array){
                clientes.push(local_parser.getClienteJson(element));
            });
        }
        get_asignaciones_proveedor_callback(error,clientes);
    };
    local_get_viajes_count_callback = function(params,error,results){
        var count;
        if (!error){
            count = results;
        }
        get_viajes_count_callback(error,count);
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
    local_deshabilitar_callback = function(params,error,results){
        deshabilitar_callback(error,results);
    };
    local_add_asignacion_callback = function(params,error,results){
        add_asignacion_callback(error,results);
    };
    local_delete_asignacion_callback = function(params,error,results){
        delete_asignacion_callback(error,results);
    };
})();