/**
 * Created by dcoellar on 9/14/15.
 */
(function(){

    angular.module("easyRuta")
        .controller('LoginController',function($rootScope,$scope,$window,data_services){
            var ctlr = this;

            ctlr.user = {username : "", password :""};
            ctlr.showError = false;
            ctlr.error = ""

            ctlr.Login = function(){
                Parse.User.logIn(ctlr.user.username, ctlr.user.password, {
                    success: function(user) {
                        data_services.initializar_user_context([],function(params,error,results){
                            if ($rootScope.loggedInRole.getName() == "cliente"){
                                $window.location.href = '/#/inicioClientes';
                            }else if ($rootScope.loggedInRole.getName() == "proveedor") {
                                $window.location.href = '/#/inicioProveedores';
                            }
                        });
                    },
                    error: function(user, error) {
                        //TODO Display error in screen
                        console.dir(user);
                        console.dir(error);
                        console.log("Fail");
                        ctlr.showError = true;
                        ctlr.error = "Usuario y/o clave incorrectos."
                        $scope.$apply()
                    }
                });
            };

            ctlr.toggleLogin = function(show){
                if (show){
                    $("#login").show()
                }else{
                    $("#login").hide()
                }
            };
        });

})();