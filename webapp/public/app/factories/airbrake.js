/**
 * Created by dcoellar on 9/14/15.
 */

var Airbrake;

angular.module("easyRuta")
    .run([function(){
        //Airbrake = new airbrakeJs.Client({projectId: 120416, projectKey: "d33cf6bcd970d85d8f4a429c86ef9a98"});//PROD
        //Airbrake = new airbrakeJs.Client({projectId: 120417, projectKey: "2a91504c057d34a36618b2a6caf6a851"});//QA
    }]).factory('$exceptionHandler', [function() {
        return function(exception, cause) {
            console.log(exception);
            //Airbrake.notify(exception);
            //throw exception;
        };
    }]);
