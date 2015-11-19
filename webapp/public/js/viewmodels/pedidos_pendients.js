/**
 * Created by dcoellar on 11/18/15.
 */

(function() {

    //Variables
    var local_rootScope;
    var local_pubnub_services;
    var local_data_services;
    var local_utils;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_initialize_suscriptions;
    var local_get_pedidos_pendientes;
    var local_confirmar_pedido;
    var local_rechazar_pedido;

    //Methods

    //View Controller callbacks references
    var get_pedidos_pendientes_callback;
    var confirmar_pedido_callback;
    var rechazar_pedido_callback;

    //Data callbacks
    var local_get_pedidos_pendientes_callback;
    var local_confirmar_pedido_callback;
    var local_rechazar_pedido_callback;
    var local_transportista_statistics_callback;

    //Helpers
    var getTimer;
    var getJson;

    angular.module("easyRuta")
        .factory('pedidos_pendientes_viewmodel',function($rootScope,pubnub_services,data_services,utils) {

            local_rootScope = $rootScope;
            local_pubnub_services = pubnub_services;
            local_data_services = data_services;
            local_utils = utils;

            return constructor;
        });

    //Constructor
    constructor = {
        initialize_suscriptions : function(suscriptions) { local_initialize_suscriptions(suscriptions); },
        get_pedidos_pendientes : function(callback) {
            local_get_pedidos_pendientes(callback);
        },
        confirmar_pedido : function(pedido,callback) { local_confirmar_pedido(pedido,callback); },
        rechazar_pedido : function(pedido,callback) { local_rechazar_pedido(pedido,callback); }
    }

    //"Public" Methods
    local_initialize_suscriptions = function(suscriptions){
        local_pubnub_services.subscribe(suscriptions)
    };
    local_get_pedidos_pendientes = function(callback){
        get_pedidos_pendientes_callback = callback;
        local_data_services.get_pedidos_pendientes([],local_get_pedidos_pendientes_callback)
    };
    local_confirmar_pedido = function(pedido,callback){
        confirmar_pedido_callback = callback;
        local_data_services.confirmar_pedido([pedido.object],local_confirmar_pedido_callback);
    };
    local_rechazar_pedido = function(pedido,callback){
        rechazar_pedido_callback = callback;
        local_data_services.rechazar_pedido([pedido.object],local_rechazar_pedido_callback);
    };

    //Methods

    //Data callbacks
    local_get_pedidos_pendientes_callback = function(params,error,results){

        if (!error){
            var pedidos = new Array;
            results.forEach(function(element,index,array){
                var pedido = getJson(element);
                if (element.get("Transportista")){
                    local_data_services.transportista_statistics([element.get("Transportista").id,pedidos,pedido,results.length],local_transportista_statistics_callback);
                }else{
                    pedidos.push(pedido);
                }
            });
            if (pedidos.length == results.length){
                get_pedidos_pendientes_callback(null,pedidos);
            }
        }else{
            get_pedidos_pendientes_callback(error,null);
        }

    };
    local_transportista_statistics_callback = function(params,error,results){
        var pedidos = params[1];
        var pedido = params[2];
        var count = params[3];
        if(!error){
            pedido["Transportista"] = results;
        }
        pedidos.push(pedido);

        if (pedidos.length == count){
            get_pedidos_pendientes_callback(null,pedidos);
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

    //Helpers
    getTimer = function(element){
        if (element.get('Estado') == 'PendienteConfirmacion') {
            var horaEnd = element.get('HoraSeleccion');
            var horaCurrent = new Date();
            horaEnd.setMinutes(horaEnd.getMinutes() + 30);

            var diffMs = (horaEnd - horaCurrent);
            var diffMins = Math.round(diffMs / 60000); // minutes
            var diffSecs = Math.round((diffMs % 60000) / 1000); // seconds

            return {'minute': diffMins, 'second': diffSecs};
        } else {
            return null;
        }
    };
    getJson = function(element){
        return {
            object : element,
            id : element.id,
            viaje : element.get("CiudadOrigen").get("Nombre") + " - " + element.get("CiudadDestino").get("Nombre"),
            carga : local_utils.formatDate(element.get("HoraCarga")),
            entrega : local_utils.formatDate(element.get("HoraEntrega")),
            estado :  element.get("Estado"),
            background : "backgroud-photo-" + element.get("CiudadDestino").get("Nombre").toLowerCase(),
            timer : getTimer(element)
        }
    };
})();