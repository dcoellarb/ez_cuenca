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
    var local_pedidos_activos_viewmodel;

    // Constructor
    var init;

    // "Public" methods
    var verDetalle;
    var iniciar;
    var cancelar;

    // Methods

    //Data callbacks
    var get_pedidos_activos_callback;
    var cancelar_pedido_callback;
    var iniciar_pedido_callback;

    //Notifications callbacks
    var new_pedidos_callback;
    var pedido_confirmado_callback;
    var pedido_confirmado_proveedor_callback;
    var pedido_cancelado_callback;
    var pedido_cancelado_transportista_callback;
    var pedido_iniciado_callback;
    var pedido_cancelado_confirmado_proveedor_callback;

    angular.module("easyRuta")
        .controller('PedidosActivosController',function($rootScope,$scope,$location,$uibModal,pedidos_activos_viewmodel) {

            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_location = $location;
            local_uiModal = $uibModal;
            local_pedidos_activos_viewmodel = pedidos_activos_viewmodel;

            ctlr.verDetalle = verDetalle;
            ctlr.iniciar = iniciar;
            ctlr.cancelar = cancelar;

            init();
        });

    // Constructor
    init = function() {
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);

        local_scope.$on(local_rootScope.channels.new_pedidos, new_pedidos_callback);
        local_scope.$on(local_rootScope.channels.pedido_confirmado, pedido_confirmado_callback);
        local_scope.$on(local_rootScope.channels.pedido_confirmado_proveedor, pedido_confirmado_proveedor_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado, pedido_cancelado_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_transportista, pedido_cancelado_transportista_callback);
        local_scope.$on(local_rootScope.channels.pedido_iniciado, pedido_iniciado_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_confirmado_proveedor, pedido_cancelado_confirmado_proveedor_callback);
    };

    // "Public" methods
    verDetalle = function(pedido) {
        local_location.path("/detallePedido/" + pedido.id);
    };
    iniciar = function(pedido) {
        local_pedidos_activos_viewmodel.iniciar_pedido(pedido,iniciar_pedido_callback)
    };
    cancelar = function(pedido){
        local_scope.confirm_message = "Esta seguro de cancelar este pedido?"
        var modalInstance = local_uiModal.open({
            animation: local_scope.animationsEnabled,
            templateUrl: 'confirm_dialog.html',
            controller: 'ConfirmDialogController as ctlr',
            scope: local_scope
        });

        modalInstance.result.then(function (result) {
            local_pedidos_activos_viewmodel.cancelar_pedido(pedido,cancelar_pedido_callback);
        }, function () {
            console.log("Modal canceled.");
        });
    };

    // Methods

    //Data callbacks
    get_pedidos_activos_callback = function(error,results){
        ctlr.isProveedor = false;
        if (local_rootScope.proveedor){
            ctlr.isProveedor = true;
        }
        ctlr.isDespachador = false;
        if (local_rootScope.despachador){
            ctlr.isDespachador = true;
        }

        ctlr.pedidos = results;
        local_scope.$apply();
    };
    iniciar_pedido_callback = function(m) {
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };
    cancelar_pedido_callback = function(error,result){
        if (!error){
            local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
        }
    };

    //Notifications callbacks
    new_pedidos_callback = function(m){
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };
    pedido_confirmado_callback = function(m) {
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };
    pedido_confirmado_proveedor_callback = function(m) {
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };
    pedido_cancelado_callback = function(m) {
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };
    pedido_cancelado_transportista_callback = function(m) {
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };
    pedido_iniciado_callback = function(m) {
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };
    pedido_cancelado_confirmado_proveedor_callback = function(m){
        local_pedidos_activos_viewmodel.get_pedidos_activos(get_pedidos_activos_callback);
    };

})();
