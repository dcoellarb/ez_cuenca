/**
 * Created by dcoellar on 4/7/16.
 */

angular.module("easyRuta")
    .factory('userModel', ['dataService','collectionsEnum',function(dataService,collectionsEnum) {
        return {

            /*
             Converts a user class object to a json object
             param: user - the class object to be converted
             param: includes (optional) - the list of pointers to be included
             return: json - the json object converted
             */
            toJson: function(user,includes){
                var json = {
                    object: user,
                    id: user.id,
                    username: user.get("username"),
                    email: user.get("email")
                };

                //add pointers if included
                if (includes) {
                    includes.forEach(function(e,i,a){
                    });
                }

                return json
            },

            /*
             Converts a json object to a user object class
             param: json - the json object to be converted
             return: user - the user class object converted
             */
            fromJson: function(json){
                var user = json.object;
                if (!user){
                    user = dataService.createCollection(collectionsEnum.user);
                }
                user.set("username",json.username);
                user.set("email",json.email);

                return user;
            }
        };
    }]);