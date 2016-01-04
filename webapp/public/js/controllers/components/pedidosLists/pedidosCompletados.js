/**
 * Created by dcoellar on 9/21/15.
 */

/**
 * Created by dcoellar on 9/18/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_rootScope;
    var local_scope;
    var local_location;
    var local_uiModal;
    var local_pedidos_completados_viewmodel;

    // Constructor
    var init;

    // "Public" methods
    var verDetalle;
    var calificar;

    // Methods

    //Data callbacks
    var get_pedidos_completados_callback;

    //Notifications callbacks
    var pedido_completado_callback;

    angular.module("easyRuta")
        .controller('PedidosCompletadosController',function($rootScope,$scope,$location,$uibModal,pedidos_completados_viewmodel) {

            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_location = $location;
            local_uiModal = $uibModal;
            local_pedidos_completados_viewmodel = pedidos_completados_viewmodel;

            ctlr.verDetalle = verDetalle;
            ctlr.calificar = calificar;

            init();

        });

    // Constructor
    init = function() {
        local_pedidos_completados_viewmodel.get_pedidos_completados(get_pedidos_completados_callback);

        local_rootScope.$on(local_rootScope.channels.pedido_completado, pedido_completado_callback);
    };

    // "Public" methods
    verDetalle = function(pedido) {
        local_location.path("/detallePedido/" + pedido.id);
    };
    calificar = function(){
        var modalInstance = local_uiModal.open({
            animation: local_scope.animationsEnabled,
            templateUrl: 'rateTransportistaModal.html',
            controller: 'RateTransportistaModalController as ctlr'
        });

        modalInstance.result.then(function () {
            console.log("return from modal");
            local_pedidos_completados_viewmodel.get_pedidos_completados(get_pedidos_completados_callback);
        }, function () {
            console.log("modal canceled");
        });
    };

    // Methods

    //Data callbacks
    get_pedidos_completados_callback = function(error,results){
        ctlr.isProveedor = false;
        if (local_rootScope.proveedor){
            ctlr.isProveedor = true;
        }

        ctlr.pedidos = results;
        local_scope.$apply();
    };

    //Notifications callbacks
    pedido_completado_callback = function(m) {
        local_pedidos_completados_viewmodel.get_pedidos_completados(get_pedidos_completados_callback);
    };

})();
