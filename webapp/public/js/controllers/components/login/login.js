/**
 * Created by dcoellar on 9/14/15.
 */
(function(){

    angular.module("easyRuta")
        .controller('LoginController',function($rootScope,$scope,$window,data_services){
            var ctlr = this;

            ctlr.user = {username : "", password :""};
            ctlr.showError = false;
            ctlr.error = "";

            ctlr.Login = function(){
                if (Parse.User.current()){
                    $rootScope.loggedInRole = undefined;
                    $rootScope.proveedor = undefined;
                    $rootScope.cliente = undefined;
                    Parse.User.logOut();

                    login();
                }else{
                    login();
                }
            };

            var login = function(){
                Parse.User.logIn(ctlr.user.username, ctlr.user.password, {
                    success: function(user) {
                        data_services.initializar_user_context([],function(params,error,results){
                            if ($rootScope.loggedInRole.getName() == "cliente"){
                                $window.location.href = '/#/inicioClientes';
                            }else if ($rootScope.loggedInRole.getName() == "proveedor") {
                                $window.location.href = '/#/inicioProveedores';
                            }else if ($rootScope.loggedInRole.getName() == "despachador") {
                                $window.location.href = '/#/inicioDespachadores';
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
            }

            ctlr.toggleLogin = function(show){
                if (show){
                    $("#login").show()
                }else{
                    $("#login").hide()
                }
            };
        });

})();