/**
 * Created by dcoellar on 4/11/16.
 */

var createBoundedWrapper = function (object, method) {
    return function() {
        return method.apply(object, arguments);
    };
};

angular.module("easyRuta")
    .config(['realtimeServiceProvider',function(realtimeServiceProvider) {
        var uuid = PUBNUB.db.get('session') || (function(){
            var uuid = PUBNUB.uuid();
            PUBNUB.db.set('session', uuid);
            return uuid;
        })();

        //realtimeServiceProvider.initialize('pub-c-ecec5777-242f-4a3e-8689-9b272441bb11', 'sub-c-5327f6bc-60c6-11e5-b0b1-0619f8945a4f', uuid);//PROD
        realtimeServiceProvider.initialize('pub-c-dbd199d2-5422-4ef9-95ac-5565e99d8036', 'sub-c-5fda96b4-7848-11e5-b539-0619f8945a4f', uuid);//QA
    }])
    .run(['$rootScope','realtimeService','realtimeChannels',function($rootScope, realtimeService, realtimeChannels) {
        for(c in realtimeChannels){
            var subscribe = {
                channel : c,
                presence : function(m){
                    if (m.uuid != realtimeService.uuid){
                        $rootScope.$broadcast('presense_' + this.channel, m);
                    }
                },
                message : function(m){
                    if (m.uuid != realtimeService.uuid){
                        $rootScope.$broadcast(this.channel, m);
                    }
                }
            };
            subscribe.presence = createBoundedWrapper(subscribe,subscribe.presence);
            subscribe.message = createBoundedWrapper(subscribe,subscribe.message);
            realtimeService.pubnub.subscribe(subscribe);
        }
    }]);