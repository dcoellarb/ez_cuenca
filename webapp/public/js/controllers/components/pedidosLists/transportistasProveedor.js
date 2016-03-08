/**
 * Created by dcoellar on 12/7/15.
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
    var local_transportistas_proveedor_viewmodel;

    // Constructor
    var init;

    // Methods

    //Data callbacks
    var check_context_initialization_callback;
    var get_transportistas_callback;
    var local_habilitar_callback;

    //Notifications callbacks
    var new_pedidos_callback;
    var pedido_tomado_callback;
    var pedido_rechazado_callback;
    var pedido_confirmado_proveedor_callback;
    var pedido_completado_callback;
    var pedido_cancelado_confirmado_callback;
    var pedido_cancelado_confirmado_proveedor_callback;
    var pedido_cancelado_callback;
    var pedido_cancelado_proveedor_callback;
    var transportista_habilitado_callback;

    angular.module("easyRuta")
        .controller('TransportistasProveedorController',function($rootScope,$scope,$location,transportistas_proveedor_viewmodel) {
            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_location = $location;
            local_transportistas_proveedor_viewmodel = transportistas_proveedor_viewmodel;

            ctlr.AgregarTransportista = function(){
                local_location.path("/detalleTransportista/");
            };
            ctlr.DetalleTransportista = function(transportista){
                local_location.path("/detalleTransportista/" + transportista.id);
            };

            init();
        });

    // Constructor
    init = function() {
        local_transportistas_proveedor_viewmodel.check_context_initialization(check_context_initialization_callback);

        //suscribe to events
        local_scope.$on(local_rootScope.channels.new_pedidos, new_pedidos_callback);
        local_scope.$on(local_rootScope.channels.pedido_tomado, pedido_tomado_callback);
        local_scope.$on(local_rootScope.channels.pedido_rechazado, pedido_rechazado_callback);
        local_scope.$on(local_rootScope.channels.pedido_confirmado_proveedor, pedido_confirmado_proveedor_callback);
        local_scope.$on(local_rootScope.channels.pedido_completado, pedido_completado_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_confirmado, pedido_cancelado_confirmado_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_confirmado_proveedor, pedido_cancelado_confirmado_proveedor_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado, pedido_cancelado_callback);
        local_scope.$on(local_rootScope.channels.pedido_cancelado_proveedor, pedido_cancelado_proveedor_callback);
        local_scope.$on(local_rootScope.channels.transportista_habilitado, transportista_habilitado_callback);
    };

    // "Public" methods

    // Methods

    //Data callbacks
    check_context_initialization_callback = function(error,results){
        ctlr.isDespachador = false
        if (local_rootScope.despachador){
            ctlr.isDespachador = true
            local_transportistas_proveedor_viewmodel.get_transpostistas_despachador(null,false,null,get_transportistas_callback);
        }
        ctlr.isProveedor = false
        if (local_rootScope.proveedor){
            ctlr.isProveedor = true
            local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
        }
    };
    get_transportistas_callback = function(error,results){
        if (!error){
            ctlr.transportistas = results;
            local_scope.$apply();
        }
    };

    //Notifications callbacks
    new_pedidos_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_tomado_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_rechazado_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_confirmado_proveedor_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_completado_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_cancelado_confirmado_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_cancelado_confirmado_proveedor_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_cancelado_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    pedido_cancelado_proveedor_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
    transportista_habilitado_callback = function(m){
        local_transportistas_proveedor_viewmodel.get_transportistas_proveedor(get_transportistas_callback);
    };
})();