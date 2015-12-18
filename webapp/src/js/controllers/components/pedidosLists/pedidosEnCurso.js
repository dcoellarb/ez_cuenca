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
    var local_pedidos_en_curso_viewmodel;

    // Constructor
    var init;

    // "Public" methods
    var verDetalle;
    var finalizar;
    var cancelarProveedor;

    // Methods

    //Data callbacks
    var get_pedidos_en_cursor_callback;
    var finalizar_pedido_callback;
    var cancelar_pedido_proveedor_callback;

    //Notifications callbacks
    var pedido_iniciado_callback;
    var pedido_completado_callback;
    var pedido_cancelado_confirmado_proveedor_callback;
    var pedido_cancelado_confirmado_transportista_callback;
    var pedido_cancelado_callback;
    var pedido_cancelado_transportista_callback;

    angular.module("easyRuta")
        .controller('PedidosEnCursoController',function($rootScope,$scope,$location,$uibModal,pedidos_en_curso_viewmodel) {

            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_location = $location;
            local_uiModal = $uibModal;
            local_pedidos_en_curso_viewmodel = pedidos_en_curso_viewmodel;

            ctlr.verDetalle = verDetalle;
            ctlr.finalizar = finalizar;
            ctlr.cancelarProveedor = cancelarProveedor;

            init();
        });

    // Constructor
    init = function() {
        local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);

        local_rootScope.$on(local_rootScope.channels.pedido_iniciado, pedido_iniciado_callback);
        local_rootScope.$on(local_rootScope.channels.pedido_completado, pedido_completado_callback);
        local_rootScope.$on(local_rootScope.channels.pedido_cancelado_confirmado_proveedor, pedido_cancelado_confirmado_proveedor_callback);
        local_rootScope.$on(local_rootScope.channels.pedido_cancelado_confirmado_transportista, pedido_cancelado_confirmado_transportista_callback);
        local_rootScope.$on(local_rootScope.channels.pedido_cancelado, pedido_cancelado_callback);
        local_rootScope.$on(local_rootScope.channels.pedido_cancelado_transportista, pedido_cancelado_transportista_callback);

        ctlr.isProveedor = false;
        if (local_rootScope.proveedor){
            ctlr.isProveedor = true;
        }
    };

    // "Public" methods
    verDetalle = function(pedido) {
        local_location.path("/detallePedido/" + pedido.id);
    };
    finalizar = function(pedido) {
        local_pedidos_en_curso_viewmodel.finalizar_pedido(pedido,finalizar_pedido_callback)
    };
    // Methods
    cancelarProveedor = function(pedido){
        local_scope.confirm_message = "Esta seguro de cancelar este pedido?"
        var modalInstance = local_uiModal.open({
            animation: local_scope.animationsEnabled,
            templateUrl: 'confirm_dialog.html',
            controller: 'ConfirmDialogController as ctlr',
            scope: local_scope
        });

        modalInstance.result.then(function (result) {
            local_pedidos_en_curso_viewmodel.cancelar_pedido_proveedor(pedido,cancelar_pedido_proveedor_callback)
        }, function () {
            console.log("Modal canceled.");
        });
    };

    //Data callbacks
    get_pedidos_en_cursor_callback = function(error,results){
        ctlr.isProveedor = false;
        if (local_rootScope.proveedor){
            ctlr.isProveedor = true;
        }

        ctlr.pedidos = results;
        local_scope.$apply();
    };
    cancelar_pedido_proveedor_callback = function(error,result){
        if (!error){
            local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);
        }
    };
    finalizar_pedido_callback = function(error,result) {
        if (!error){
            local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);
        }
    };

    //Notifications callbacks
    pedido_iniciado_callback = function(m) {
        local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);
    };
    pedido_completado_callback = function(m) {
        local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);
    };
    pedido_cancelado_confirmado_proveedor_callback = function(m) {
        local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);
    };
    pedido_cancelado_confirmado_transportista_callback = function(m) {
        local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);
    };
    pedido_cancelado_callback = function(m) {
        local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);
    };
    pedido_cancelado_transportista_callback = function(m) {
        local_pedidos_en_curso_viewmodel.get_pedidos_en_curso(get_pedidos_en_cursor_callback);
    };

})();
