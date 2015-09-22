/**
 * Created by dcoellar on 9/14/15.
 */

(function(){

    angular.module("easyRuta")
        .run(function($rootScope){
            var pubnub = PUBNUB.init({
                publish_key: 'pub-c-ecec5777-242f-4a3e-8689-9b272441bb11',
                subscribe_key: 'sub-c-5327f6bc-60c6-11e5-b0b1-0619f8945a4f'
            });
            $rootScope.pubnub = pubnub;
            console.log("pubnub intialized")
        });

})();