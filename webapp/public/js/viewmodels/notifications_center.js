/**
 * Created by dcoellar on 1/6/16.
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
    var local_get_notifications;

    //Methods

    //View Controller callbacks references
    var get_notifications_callback;

    //Data callbacks
    var local_get_notifications_callback;
    var local_clear_notifications_callback;

    angular.module("easyRuta")
        .factory('notifications_center_viewmodel',function($rootScope,pubnub_services,data_services,parser) {

            local_rootScope = $rootScope;
            local_pubnub_services = pubnub_services;
            local_data_services = data_services;
            local_parser = parser;

            return constructor;
        });

    //Constructor
    constructor = {
        get_notifications : function(callback) {local_get_notifications(callback);}
    };

    //"Public" Methods
    local_get_notifications = function(callback){
        get_notifications_callback = callback;
        local_data_services.get_notifications([],local_get_notifications_callback)
    };

    //Methods

    //Data callbacks
    local_get_notifications_callback = function(params,error,results){
        if (!error){
            var notifications = new Array;
            results.forEach(function(element,index,array){
                var notification = local_parser.getNotificationJson(element);
                if (element.get("Pedido")){
                    notification.pedido = local_parser.getJson(element.get("Pedido"));
                    if (element.get("Pedido").get("Transportista")){
                        notification.pedido.transportista = local_parser.getTransportistaJson(element.get("Pedido").get("Transportista"));
                        if (local_rootScope.cliente && pedido.object.get("Proveedor")){
                            notification.pedido.transportista = local_parser.parseProveedorIntoTransportista(notification.pedido.transportista,notification.pedido.object.get("Proveedor"));
                        }
                    }
                }
                notifications.push(notification);
            });
            get_notifications_callback(null,notifications);

            local_data_services.clear_notifications([],local_clear_notifications_callback);
        }else{
            get_notifications_callback(notifications,null);
        }
    };
    local_clear_notifications_callback = function(params,error,results){
        if(!error){
            local_pubnub_services.publish(local_rootScope.channels.clear_notifications,{id:"cleared:" + results.length});
            local_rootScope.$broadcast(local_rootScope.channels.clear_notifications, {id:"cleared:" + results.length});
        }
    };
})();