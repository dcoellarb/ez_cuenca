/**
 * Created by dcoellar on 9/14/15.
 */

(function(){

    angular.module("easyRuta")
        .run(function($rootScope){
            var pubnub = PUBNUB.init({
                //publish_key: 'pub-c-ecec5777-242f-4a3e-8689-9b272441bb11',//PROD
                //subscribe_key: 'sub-c-5327f6bc-60c6-11e5-b0b1-0619f8945a4f'//PROD
                publish_key: 'pub-c-dbd199d2-5422-4ef9-95ac-5565e99d8036',//QA
                subscribe_key: 'sub-c-5fda96b4-7848-11e5-b539-0619f8945a4f'//QA
            });
            $rootScope.pubnub = pubnub;

            $rootScope.channels = {
                new_pedidos : "new_pedidos",
                pedido_tomado : "pedido_tomado",
                pedido_cancelado_transportista : "pedido_cancelado_transportista",
                pedido_cancelado : "pedido_cancelado",
                pedido_confirmado : "pedido_confirmado",
                pedido_rechazado : "pedido_rechazado"
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
                    $rootScope.pubnub.publish({
                        channel: channel,
                        message: message
                    });
                }
            }
        });
})();