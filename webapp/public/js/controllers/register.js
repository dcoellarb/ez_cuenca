/**
 * Created by dcoellar on 9/14/15.
 */
(function(){

    angular.module("easyRuta")
        .controller('RegisterController',function(){
            this.user = {email : "", password :"", confirmedPassword:""};

            this.Register = function(){

                var newuser = new Parse.User();
                newuser.set("username", this.user.email);
                newuser.set("password", this.user.password);
                newuser.set("email", this.user.email);

                newuser.signUp(null, {
                    success: function(user) {
                        console.log("Success");
                    },
                    error: function(user, error) {
                        console.dir(user);
                        console.dir(error);
                        console.log("Fail");
                    }
                });
            }
        });

})();