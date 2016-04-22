/**
 * Created by dcoellar on 11/16/15.
 */

(function(){

    //Variables
    var ctlr;
    var local_root_scope;
    var local_scope;
    var local_location;
    var local_historico_view_model;

    //Constructor
    var init;

    //"Public" methods
    var verDetalle;

    //Dara callbacks
    var get_historico_pedidos_callback;

    angular.module("easyRuta")
        .controller('historicoController',function($rootScope,$scope,$location,historico_view_model){

            ctlr = this;
            local_root_scope = $rootScope;
            local_scope = $scope;
            local_location = $location
            local_historico_view_model = historico_view_model;

            ctlr.verDetalle = verDetalle;

            init();

        });

    //Constructor
    init = function(){
        local_historico_view_model.get_historico_pedidos(get_historico_pedidos_callback)
    };

    //"Public" methods
    verDetalle = function(id) {
        local_location.path("/detallePedido/" + id);
    };

    //Data callbacks
    get_historico_pedidos_callback = function(error,results){
        if (!error){
            ctlr.pedidos = results;
            local_scope.$apply();
        }
    };

})();