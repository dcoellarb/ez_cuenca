/**
 * Created by dcoellar on 9/15/15.
 */

(function(){

    //Variables
    var ctlr;
    var local_root_scope;
    var local_route_params;
    var local_scope;
    var local_detalle_pedido_viewmodel;
    var local_uiGmapGoogleMapApi;

    // Constructor
    var init;

    //Data callbacks
    var get_pedido_callback;

    angular.module("easyRuta")
        .controller('DetallePedidoController',function($rootScope, $routeParams,$scope,detalle_pedido_viewmodel,uiGmapGoogleMapApi){

            ctlr = this;
            local_root_scope = $rootScope
            local_route_params = $routeParams
            local_scope = $scope
            local_detalle_pedido_viewmodel = detalle_pedido_viewmodel;
            local_uiGmapGoogleMapApi = uiGmapGoogleMapApi;

            init();
        });

    // Constructor
    init = function() {
        ctlr.id = local_route_params.id;
        local_detalle_pedido_viewmodel.get_pedido(ctlr.id,get_pedido_callback);
        local_scope.map = { center: { latitude:  -1.569363, longitude: -78.705796 }, zoom: 7 };
        local_scope.polylines = [];
    };

    // Methods

    //Data callbacks
    get_pedido_callback = function(error,results){
        if (!error){
            ctlr.pedido = results;

            local_uiGmapGoogleMapApi.then(function(){
                local_scope.polylines = ctlr.pedido.locations;
            });

            local_scope.$apply();
        }
    };
})();
