/**
 * Created by dcoellar on 4/20/16.
 */

angular.module('easyRuta')
    .filter('parsePeso', function() {
        return function(input) {
            return input.replace("_", " a ") + " toneladas";
        }
    });