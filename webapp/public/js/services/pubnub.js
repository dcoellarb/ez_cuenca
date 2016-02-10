/**
 * Created by dcoellar on 9/14/15.
 */

(function(){
    var createBoundedWrapper = function (object, method) {
        return function() {
            return method.apply(object, arguments);
        };
    };

    angular.module("easyRuta")
        .run(function($rootScope){
            $rootScope.pubnub_uuid = PUBNUB.db.get('session') || (function(){
                var uuid = PUBNUB.uuid();
                PUBNUB.db.set('session', uuid);
                return uuid;
            })();

            $rootScope.pubnub = PUBNUB.init({
                publish_key: 'pub-c-ecec5777-242f-4a3e-8689-9b272441bb11',//PROD
                subscribe_key: 'sub-c-5327f6bc-60c6-11e5-b0b1-0619f8945a4f',//PROD
                //publish_key: 'pub-c-dbd199d2-5422-4ef9-95ac-5565e99d8036',//QA
                //subscribe_key: 'sub-c-5fda96b4-7848-11e5-b539-0619f8945a4f',//QA
                uuid : $rootScope.pubnub_uuid
            });

            $rootScope.channels = {
                new_pedidos : "new_pedidos",
                pedido_tomado : "pedido_tomado",
                pedido_confirmado : "pedido_confirmado",
                pedido_confirmado_proveedor : "pedido_confirmado_proveedor",
                pedido_rechazado : "pedido_rechazado",
                pedido_rechazado_proveedor : "pedido_rechazado_proveedor",
                pedido_iniciado : 'pedido_iniciado',
                pedido_completado : 'pedido_completado',
                pedido_ignorado : "pedido_ignorado",
                pedido_cancelado : "pedido_cancelado",
                pedido_cancelado_transportista : "pedido_cancelado_transportista",
                pedido_cancelado_proveedor : "pedido_cancelado_proveedor",
                pedido_cancelado_confirmado : "pedido_cancelado_confirmado",
                pedido_cancelado_confirmado_transportista : "pedido_cancelado_confirmado_transportista",
                pedido_cancelado_confirmado_proveedor : "pedido_cancelado_confirmado_proveedor",
                pedido_timeout : "pedido_timeout",
                transportista_habilitado : "transportista_habilitado",
                nueva_notificacion : "nueva_notificacion",
                clear_notifications : "clear_notifications",
            };

            for(subscribe_channel in $rootScope.channels){
                var subscribe = {
                    channel : subscribe_channel,
                    presence : function(m){
                        if (m.uuid != $rootScope.pubnub_uuid){
                            $rootScope.$broadcast('presense_' + this.channel, m);
                        }
                    },
                    message : function(m){
                        if (m.uuid != $rootScope.pubnub_uuid){
                            $rootScope.$broadcast(this.channel, m);
                        }
                    }
                };
                subscribe.presence = createBoundedWrapper(subscribe,subscribe.presence);
                subscribe.message = createBoundedWrapper(subscribe,subscribe.message);
                $rootScope.pubnub.subscribe(subscribe);
            }
        })

        .factory('pubnub_services',function($rootScope) {
            return {
                subscribe: function (suscriptions) {
                    suscriptions.forEach(function(element,index,array){
                        if (element.channel && element.callback){
                            var subscribe = {};
                            subscribe["channel"] = element.channel;
                            if (element.callback.presence){
                                subscribe["presence"] = function(m){ element.callback.presence(m); };
                            }
                            if (element.callback.message){
                                subscribe["message"] = function(m){ element.callback.message(m); };
                            }

                            $rootScope.pubnub.subscribe(subscribe);
                        }
                    });
                },
                publish: function (channel, message) {
                    message.uuid = $rootScope.pubnub_uuid;
                    $rootScope.pubnub.publish({
                        channel: channel,
                        message: message
                    });
                },
                here_now : function (callback){
                    $rootScope.pubnub.here_now({
                        channel : 'new_pedidos',
                        state : true,
                        callback : function(m){
                            var availableTransportistas = 0;
                            m.uuids.forEach(function(element,index,array){
                                if (element.state && element.state.type && element.state.type == "transportista"){
                                    availableTransportistas += 1;
                                }
                            });
                            callback(availableTransportistas);
                        }
                    });
                }
            }
        });
})();