/**
 * Created by dcoellar on 9/14/15.
 */
(function(){

    Parse.initialize("LRW3NBrk3JYLeAkXrpTF2TV0bDPn5HQTndrao8my", "e6v72X3KgdBeXe0JZ5cWrSBMmHZ1GIqtEIRICcp3");

    angular.module("easyRuta",['ui.bootstrap','uiSwitch','ngRoute','uiGmapgoogle-maps'])
        .run(function($rootScope) {
            console.log("app set current user");
            var currentUser = Parse.User.current();
            if (currentUser) {
                $rootScope.loggedInUser = currentUser.id;
                console.dir(currentUser);
            }
        });

})();
