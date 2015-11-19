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
    var local_pedidos_pendientes_viewmodel;

    // Constructor
    var init;

    // "Public" methods
    var confirmar;
    var rechazar;
    var verDetalle;

    // Methods

    //Data callbacks
    var get_pedidos_pendientes_callback;
    var confirmar_pedido_callback;
    var rechazar_pedido_callback;

    //Internal suscriptions callbacks
    var new_pedido_internal_callback;
    var pedido_rechazado_internal_callback;

    //External suscriptions callbacks
    var new_pedido_presense_callback;
    var new_pedido_callback;
    var pedido_tomado_callback;
    var pedido_cancelado_transportista_callback;
    var pedido_cancelado_callback;

    //Helpers
    var set_timers;
    var add_pedidos_to_list;

    angular.module("easyRuta")
        .controller('PedidosPendientesController',function($rootScope,$scope,$location,$interval,pedidos_pendientes_viewmodel) {
            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_location = $location;
            local_interval = $interval;
            local_pedidos_pendientes_viewmodel = pedidos_pendientes_viewmodel;

            ctlr.confirmar = confirmar;
            ctlr.rechazar = rechazar;
            ctlr.verDetalle = verDetalle;

            init();
        });

    // Constructor
    init = function() {
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
        local_pedidos_pendientes_viewmodel.initialize_suscriptions([
            {channel:local_rootScope.channels.new_pedidos,callback:{presence:new_pedido_presense_callback,message:new_pedido_callback}},
            {channel:local_rootScope.channels.pedido_tomado,callback:{presence:null,message:pedido_tomado_callback}},
            {channel:local_rootScope.channels.pedido_cancelado_transportista,callback:{presence:null,message:pedido_cancelado_transportista_callback}},
            {channel:local_rootScope.channels.pedido_cancelado,callback:{presence:null,message:pedido_cancelado_callback}}
        ]);

        local_rootScope.$on(local_rootScope.channels.new_pedidos, new_pedido_internal_callback);
        local_rootScope.$on(local_rootScope.channels.pedido_rechazado, pedido_rechazado_internal_callback);
        //TODO - add insternal suscription for pedido cancelado
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
        $location.path("/detallePedido/" + pedido.id);
    };

    // Methods

    //Data callbacks
    get_pedidos_pendientes_callback = function(error,results){
        if (!error){
            ctlr.pedidos = results;
            set_timers();
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

    //Internal notfications
    new_pedido_internal_callback = function(event, args) {
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_rechazado_internal_callback = function(event, args) {
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };

    //External notifications
    new_pedido_presense_callback = function(m){
        local_rootScope.$broadcast('new_pedido_new_suscriber', m);
    };
    new_pedido_callback = function(m){
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_tomado_callback = function(m){
        local_rootScope.$broadcast('pedido_tomado', m);
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    }
    pedido_cancelado_transportista_callback = function(m){
        local_rootScope.$broadcast('pedido_cancelado_transportista', m);
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };
    pedido_cancelado_callback = function(m){
        //TODO - send internal notificacion to other lists
        local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
    };

    //Helpers
    set_timers = function(){
        if (ctlr.pedidos && !ctlr.timerInterval){
            ctlr.timerInterval = local_interval(function(){
                ctlr.pedidos.forEach(function(element,index,array){
                    if (element.estado == 'PendienteConfirmacion'){
                        if (element.timer.minute > 0 || element.timer.second > 0){

                            if (element.timer.second > 0){
                                element.timer.second -= 1;
                            }else{
                                if (element.timer.minute > 0){
                                    element.timer.minute -= 1;
                                    element.timer.second = 59;
                                }
                            }

                            if (element.timer.minute >= 10){
                                element.timer.value = element.timer.minute;
                            }else{
                                element.timer.value = "0" + element.timer.minute;
                            }
                            element.timer.value += ":"
                            if (element.timer.second >= 10){
                                element.timer.value += element.timer.second;
                            }else{
                                element.timer.value += "0" + element.timer.second;
                            }
                        }else{
                            local_pedidos_pendientes_viewmodel.get_pedidos_pendientes(get_pedidos_pendientes_callback);
                        }
                    }
                });
                //local_scope.$apply();
            },1000);
        }
    };

})();