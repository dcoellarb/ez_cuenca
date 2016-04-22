/**
 * Created by dcoellar on 4/20/16.
 */

angular.module('easyRuta')
    .filter('capitalizeFirst', function() {
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    });