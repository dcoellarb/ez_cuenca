/**
 * Created by dcoellar on 9/14/15.
 */
(function(){

    angular.module("easyRuta")
        .controller('LoginController',function($scope,$location){
            var controller = this;

            controller.user = {username : "", password :""};

            controller.Login = function(){

                Parse.User.logIn(this.user.username, this.user.password, {
                    success: function(user) {
                        console.log("Success");
                        $scope.$apply(function(){
                            $location.path('/inicioClientes');
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