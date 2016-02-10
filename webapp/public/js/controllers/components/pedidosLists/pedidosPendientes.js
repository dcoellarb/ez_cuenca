/**
 * Created by dcoellar on 9/18/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_rootScope;
    var local_scope;
    var local_location;
    var local_interval;
    var local_uiModal;
    var local_pedidos_pendientes_viewmodel;

    // Constructor
    var init;

    // "Public" methods
    var confirmar;
    var rechazar;
    var verDetalle;
    var proveedor_tomar;
    var proveedor_confirmar;
    var proveedor_rechazar;
    var cancelar;
    var ignorar;

    // Methods

    //Data callbacks
    var get_pedidos_pendientes_callback;
    var confirmar_pedido_callback;
    var rechazar_pedido_callback;
    var proveedor_tomar_pedido_callback;
    var proveedor_confirmar_pedido_callback;
    var proveedor_rechazar_pedido_callback;
    var timeout_pedido_callback;
    var cancelar_pedido_callback;
    var ignorar_pedido_callback;

    //Notifications callbacks
    var new_pedidos_callback;
    var pedido_rechazado_callback;
    var pedido_tomado_callback;
    var pedido_confirmado_callback;
    var pedido_ignorado_callback;
    var pedido_cancelado_callback;
    var pedido_cancelado_transportista_callback;
    var pedido_cancelado_proveedor_callback
    var pedido_confirmado_proveedor_callback;
    var pedido_rechazado_proveedor_callback;
    var pedido_cancelado_confirmado_proveedor_callback
    var pedido_completado_callback;
    var pedido_timeout_callback;
    var transportista_habilitado_callback;

    //Helpers
    var set_timers;

    angular.module("easyRuta")
        .controller('PedidosPendientesController',function($rootScope,$scope,$location,$interval,$uibModal,pedidos_pendientes_viewmodel) {
            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_location = $location;
            local_interval = $interval;
            local_uiModal = $uibModal;
            local_pedidos_pendientes_viewmodel = pedidos_pendientes_viewmodel;

            ctlr.confirmar = confirmar;
            ctlr.rechazar = rechazar;
            ctlr.verDetalle = verDetalle;
            ctlr.proveedor_tomar = proveedor_tomar;
            ctlr.proveedor_confirmar = proveedor_confirmar;
            ctlr.proveedor_rechazar = proveedor_rechazar;
            ctlr.cancelar = cancelar;
            ctlr.ignorar = ignorar;

            init();
        });

    // Constructor
    init = function() {
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);

        local_scope.$on(local_rootScope.channels.new_pedidos, new_pedidos_callback);
        local_scope.$on(local_rootScope.channels.pedido_tomado, pedido_tomado_callback);
        local_scope.$on(local_rootScope.channels.pedido_confirmado, pedido_confirmado_callback);
        local_scope.$on(local_rootScope.channels.pedido_rechazado, pedido_rechazado_callback);
        local_scope.$on(local_rootScope.channels.pedido_confirmado_proveedor, pedido_confirmado_proveedor_callback);
        local_scope.$on(local_rootScope.channels.pedido_rechazado_proveedor, pedido_rechazado_proveedor_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_confirmado_proveedor, pedido_cancelado_confirmado_proveedor_callback);
        local_scope.$on(local_rootScope.channels.pedido_ignorado, pedido_ignorado_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado, pedido_cancelado_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_transportista, pedido_cancelado_transportista_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_proveedor, pedido_cancelado_proveedor_callback);
        local_scope.$on(local_rootScope.channels.pedido_completado, pedido_completado_callback);
        local_scope.$on(local_rootScope.channels.pedido_timeout, pedido_timeout_callback);
        local_scope.$on(local_rootScope.channels.transportista_habilitado, transportista_habilitado_callback);

        local_scope.$on('$destroy',function(){
            if (ctlr.timerInterval) {
                local_interval.cancel(ctlr.timerInterval);
            }
        });
    }

    // "Public" methods
    confirmar = function(pedido){
        local_pedidos_pendientes_viewmodel.confirmar_pedido(pedido,confirmar_pedido_callback)
    };
    rechazar = function(pedido){
        local_pedidos_pendientes_viewmodel.rechazar_pedido(pedido,rechazar_pedido_callback)
    };
    verDetalle = function(pedido) {
        local_location.path("/detallePedido/" + pedido.id);
    };
    proveedor_tomar = function(pedido,transportista){
        if ((local_rootScope.proveedor.get("Saldo") - pedido.object.get("Comision")) >= local_rootScope.proveedor.get("SaldoMin")){
            local_pedidos_pendientes_viewmodel.proveedor_tomar_pedido(pedido,transportista,proveedor_tomar_pedido_callback)
        }
    };
    proveedor_confirmar = function(pedido,transportista){
        local_pedidos_pendientes_viewmodel.proveedor_confirmar_pedido(pedido,transportista,proveedor_confirmar_pedido_callback)
    };
    proveedor_rechazar = function(pedido){
        local_pedidos_pendientes_viewmodel.proveedor_rechazar_pedido(pedido,proveedor_rechazar_pedido_callback)
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
            local_pedidos_pendientes_viewmodel.cancelar_pedido(pedido,cancelar_pedido_callback)
        }, function () {
            console.log("Modal canceled.");
        });
    };
    ignorar = function(pedido){
        local_pedidos_pendientes_viewmodel.ignorar_pedido(pedido,ignorar_pedido_callback)
    };

    // Methods

    //Data callbacks
    get_pedidos_pendientes_callback = function(error,results){
        if (!error) {
            ctlr.pedidos = results;
            ctlr.pedidosPorConfirmar = 0;
            ctlr.pedidosPorConfirmarProveedor = 0;
            if (results) {
                results.forEach(function (element, index, array) {
                    if (element.estado == 'PendienteConfirmacion') {
                        ctlr.pedidosPorConfirmar += 1
                    }
                    if (element.estado == 'PendienteConfirmacionProveedor') {
                        ctlr.pedidosPorConfirmarProveedor += 1
                    }
                });
                set_timers()
            }
            local_scope.$apply();
        }
    };
    confirmar_pedido_callback = function(error,results){
        if (!error){
            local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
        }
    };
    rechazar_pedido_callback = function(error,results){
        if (!error){
            local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
        }
    };
    proveedor_tomar_pedido_callback = function(error,results){
        if (!error){
            local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
        }
    };
    proveedor_confirmar_pedido_callback = function(error,results){
        if (!error){
            local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
        }
    };
    proveedor_rechazar_pedido_callback = function(error,results){
        if (!error){
            local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
        }
    };
    timeout_pedido_callback = function(error,result){
        if (!error){
            local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
        }
    };
    cancelar_pedido_callback = function(error,result){
        if (!error){
            local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
        }
    };
    ignorar_pedido_callback = function(error,result){
        if (!error){
            local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
        }
    };

    //Notifications callbacks
    new_pedidos_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_rechazado_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_tomado_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_confirmado_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_ignorado_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_cancelado_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_cancelado_transportista_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_cancelado_proveedor_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_confirmado_proveedor_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_rechazado_proveedor_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_cancelado_confirmado_proveedor_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_completado_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_timeout_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    transportista_habilitado_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    //Helpers
    set_timers = function(){
        if (ctlr.pedidos && !ctlr.timerInterval){
            ctlr.timerInterval = local_interval(function(){
                if (ctlr.pedidos && ctlr.pedidos.length > 0){
                    ctlr.pedidos.forEach(function(element,index,array){
                        if (element.estado == 'PendienteConfirmacion' || element.estado == 'PendienteConfirmacionProveedor') {
                            if (element.timer.minute > 0 || element.timer.second > 1) {

                                if (element.timer.second > 0) {
                                    element.timer.second -= 1;
                                } else {
                                    if (element.timer.minute > 0) {
                                        element.timer.minute -= 1;
                                        element.timer.second = 59;
                                    }
                                }

                                if (element.timer.minute >= 10) {
                                    element.timer.value = element.timer.minute;
                                } else {
                                    element.timer.value = "0" + element.timer.minute;
                                }
                                element.timer.value += ":"
                                if (element.timer.second >= 10) {
                                    element.timer.value += element.timer.second;
                                } else {
                                    element.timer.value += "0" + element.timer.second;
                                }

                            } else {
                                local_pedidos_pendientes_viewmodel.timeout_pedido(element, timeout_pedido_callback);
                            }
                        }
                    });
                }
            },1000);
        }
    };

})();