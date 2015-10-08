/**
 * Created by dcoellar on 9/14/15.
 */
(function(){

    angular.module("easyRuta")
        .controller('LoginController',function($rootScope,$window){
            var ctlr = this;

            ctlr.user = {username : "", password :""};

            ctlr.Login = function(){
                Parse.User.logIn(ctlr.user.username, ctlr.user.password, {
                    success: function(user) {
                        $rootScope.loggedInUser = user.id;
                        (new Parse.Query(Parse.Role)).equalTo("users", user).find({
                            success: function(results) {
                                if (results.length > 0){
                                    var role = results[0];
                                    $rootScope.loggedInRole = role.getName();
                                    switch (role.getName()){
                                        case "cliente":
                                            $window.location.href = '/#/inicioClientes';
                                            break;
                                    }
                                }else{
                                    console.log("no roles founds");
                                }
                            },
                            error: function(error) {
                                console.log("Error: " + error.code + " " + error.message);
                            }
                        });
                    },
                    error: function(user, error) {
                        //TODO Display error in screen
                        console.dir(user);
                        console.dir(error);
                        console.log("Fail");
                    }
                });
            }
        });

})();