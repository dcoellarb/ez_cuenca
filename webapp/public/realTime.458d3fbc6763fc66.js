/**
 * Created by dcoellar on 11/18/15.
 */

angular.module("ez-RealTime",[])
    .provider('realtimeService',function realtimeServiceProvider() {

        //var uuid;
        //var pubnub;
        this.initialize = function(publish_key,subscribe_key,uuid){
            this.uuid = uuid;
            this.pubnub = PUBNUB.init({
                publish_key: publish_key,
                subscribe_key: subscribe_key,
                uuid : uuid
            });
        }

        this.$get = function realtimeServiceFactory() {
            return {
                uuid: this.uuid,
                pubnub: this.pubnub,
                publish: function (channel, message) {
                    message.uuid = this.uuid;
                    this.pubnub.publish({
                        channel: channel,
                        message: message
                    });
                },
                here_now : function (callback){
                    this.pubnub.here_now({
                        channel : 'new_pedidos',
                        state : true,
                        callback : function(m){
                            callback(m);
                        }
                    });
                }
            }
        };
    });
