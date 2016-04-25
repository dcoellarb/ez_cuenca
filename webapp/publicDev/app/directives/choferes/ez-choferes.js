/**
 * Created by dcoellar on 4/6/16.
 */

angular.module('easyRuta')
    .directive('ezChoferes',function(){
        return {
            restrict: 'E',
            templateUrl: "app/directives/choferes/ez-choferes.html"
        };
    });
