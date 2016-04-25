/**
 * Created by dcoellar on 4/20/16.
 */

angular.module('easyRuta')
    .filter('tipoCamionList', function() {
        return function(input) {
            return input.join(", ")
        }
    });