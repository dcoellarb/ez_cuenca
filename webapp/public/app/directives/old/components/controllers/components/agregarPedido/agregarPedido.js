/**
 * Created by dcoellar on 9/15/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_rootScope;
    var local_scope;
    var local_uibModal;
    var local_agregar_pedido_viewmodel;
    var local_form;

    var modal_ctlr;
    var modal_local_scope;
    var modal_local_uibModalInstance;

    // Constructor
    var init;
    var modal_init;

    // "Public" methods
    var agregar;
    var guardar_como_plantilla;
    var limpiar;
    var tipo_transportista_seleccionado;
    var proveedor_seleccionado;
    var plantilla_selected;
    var delete_plantilla;
    var toggle_form;
    var seleccionar_transportista;

    var modal_guardar_plantilla;
    var modal_cancelar;

    // Methods
    var limpiar_form;
    var setup_date_pickers;
    var get_active_transportistas;
    var guardar_pedido;

    //View Controller callbacks references
    var guardar_pedido_callback;

    //Data callbacks
    var local_get_plantillas_callback;
    var local_get_ciudades_callback;
    var local_get_transpostistas_despachador_callback;
    var local_get_active_transportistas_callback;
    var local_guardar_pedido_callback;
    var local_agregar_guardar_pedido_callback;
    var local_plantilla_guardar_pedido_callback;
    var local_get_plantilla_callback;
    var local_delete_plantilla_callback;

    //Notifications callbacks
    var presense_new_pedidos_callback;

    angular.module("easyRuta")
        .controller('AgregarPedidoController',function($rootScope,$scope,$uibModal,agregar_pedido_viewmodel){

            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_uibModal = $uibModal;
            local_agregar_pedido_viewmodel = agregar_pedido_viewmodel;

            ctlr.Agregar = agregar;
            ctlr.GuardarComoPlantilla = guardar_como_plantilla;
            ctlr.Limpiar = limpiar;
            ctlr.TipoTransporteSeleccionado = tipo_transportista_seleccionado;
            ctlr.proveedor_seleccionado = proveedor_seleccionado;
            ctlr.PlantillaSelected = plantilla_selected;
            ctlr.DeletePlantilla  = delete_plantilla
            ctlr.ToggleForm = toggle_form;
            ctlr.seleccionar_transportista = seleccionar_transportista;

            init();

        })
        .controller('AgregarPedidoModalController',function($scope,$uibModalInstance){

            modal_ctlr = this;
            modal_local_scope = $scope;
            modal_local_uibModalInstance = $uibModalInstance;

            modal_ctlr.guardar = modal_guardar_plantilla;
            modal_ctlr.cancelar = modal_cancelar;

            modal_init();
        });

    // Constructor
    init = function() {
        local_agregar_pedido_viewmodel.get_plantillas(local_get_plantillas_callback);
        local_agregar_pedido_viewmodel.get_ciudades(local_get_ciudades_callback);

        local_scope.$on('presense_' + local_rootScope.channels.new_pedidos, presense_new_pedidos_callback);

        ctlr.availableTransportistas = 0;
        ctlr.open = false;
        ctlr.minDate = new Date();
        ctlr.isDespachador = false;

        setup_date_pickers();
        limpiar_form();
    };
    modal_init = function(){
        modal_ctlr.plantilla = "";
    };

    // "Public" methods
    agregar = function (form) {
        local_form = form;
        if (local_form.$valid) {
            ctlr.data.Plantilla = "";
            ctlr.data.Estado = "Pendiente";
            guardar_pedido(local_agregar_guardar_pedido_callback);
        }
    };
    guardar_como_plantilla = function (form) {
        local_form = form;
        if (local_form.$valid) {
            var modalInstance = local_uibModal.open({
                animation: local_scope.animationsEnabled,
                templateUrl: 'PlantillaModal.html',
                controller: 'AgregarPedidoModalController as agrPedModalCtlr'
            });

            modalInstance.result.then(function (plantilla) {
                ctlr.data.Plantilla = plantilla;
                ctlr.data.HoraCarga = null;
                ctlr.data.HoraEntrega = null;
                ctlr.data.Estado = "Plantilla";
                ctlr.data.Transportista = null;
                guardar_pedido(local_plantilla_guardar_pedido_callback)
            }, function () {
                console.log("Modal canceled.");
            });
        }
    };
    limpiar = function (form) {
        local_form = form;
        limpiar_form();
    };
    tipo_transportista_seleccionado = function (TipoTransporte) {
        ctlr.data.Transportista = null;
        ctlr.data.TipoTransporte = TipoTransporte;
        var proveedor = null;
        if (ctlr.data.Proveedor && ctlr.data.Proveedor != "") {
            ctlr.proveedores.forEach(function (element, index, array) {
                if (element.id = ctlr.data.Proveedor) {
                    proveedor = element.data;
                }
            });
        }
        local_agregar_pedido_viewmodel.get_transpostistas_despachador(proveedor,true,ctlr.data.TipoTransporte,local_get_transpostistas_despachador_callback);
    };
    proveedor_seleccionado = function () {
        ctlr.data.Transportista = null;
        var proveedor = null;
        if (ctlr.data.Proveedor && ctlr.data.Proveedor != "") {
            ctlr.proveedores.forEach(function (element, index, array) {
                if (element.id = ctlr.data.Proveedor) {
                    proveedor = element.data;
                }
            });
        }
        local_agregar_pedido_viewmodel.get_transpostistas_despachador(proveedor,true,ctlr.data.TipoTransporte,local_get_transpostistas_despachador_callback);
    };
    plantilla_selected = function (id) {
        local_agregar_pedido_viewmodel.get_plantilla(id,local_get_plantilla_callback);
    };
    delete_plantilla = function (id) {
        local_agregar_pedido_viewmodel.delete_plantilla(id,local_delete_plantilla_callback);
    };
    toggle_form = function() {
        if ($('#agregarPedido').hasClass("panel-primary")){
            $('#agregarPedido').removeClass('panel-primary');
            $('#agregarPedido').addClass('panel-default');
            $('#inputCiudadOrigen').focus();
            ctlr.open = true;
        }else{
            $('#agregarPedido').removeClass('panel-default');
            $('#agregarPedido').addClass('panel-primary');
            ctlr.open = false;
        }
    };
    seleccionar_transportista = function(transportista) {
        ctlr.data.Transportista = transportista;
    };

    modal_guardar_plantilla = function(){
        modal_local_uibModalInstance.close(modal_ctlr.plantilla);
    };
    modal_cancelar = function(){
        modal_local_uibModalInstance.dismiss('cancel');
    };

    // Methods
    limpiar_form = function (){
        ctlr.copias = 1;
        ctlr.data = {
            Plantilla : "",
            CiudadOrigen : "",
            DireccionOrigen : "",
            CiudadDestino : "",
            DireccionDestino : "",
            HoraCarga : new Date(),
            HoraEntrega : new Date(),
            Producto : "",
            Valor : 0,
            PesoDesde : 0,
            PesoHasta : 0,
            TipoTransporte : "furgon",
            CajaRefrigerada : false,
            Transportista : null
        };
        if (local_form){
            local_form.$setPristine();
        }
    }
    setup_date_pickers = function(){
        /*
         * Setup hora max carga date picker
         * */
        local_scope.horaMaxCargaOpen = function($event) {
            local_scope.horaMaxCargaStatus.opened = true;
        };
        local_scope.horaMaxCargaStatus = {
            opened: false
        };

        /*
         * Setup hora max carga date picker
         * */
        local_scope.horaMaxDescargaOpen = function($event) {
            local_scope.horaMaxDescargaStatus.opened = true;
        };
        local_scope.horaMaxDescargaStatus = {
            opened: false
        };
    }
    get_active_transportistas = function(){
        local_agregar_pedido_viewmodel.get_active_transportistas(local_get_active_transportistas_callback);
    }
    guardar_pedido = function(callback){
        guardar_pedido_callback = callback
        var transportista = null;
        if (ctlr.data.Transportista){
            transportista = ctlr.data.Transportista.object;
        }
        local_agregar_pedido_viewmodel.guardar_pedidos(ctlr.data,transportista,local_guardar_pedido_callback);
    };

    //Data callbacks
    local_get_plantillas_callback = function(error,results){
        if (!error){
            ctlr.plantillas = results;
            local_scope.$apply();
        }

        //Call services that require context here
        if (local_rootScope.despachador){
            ctlr.isDespachador = true;
            local_agregar_pedido_viewmodel.get_transpostistas_despachador(null,true,ctlr.data.TipoTransporte,local_get_transpostistas_despachador_callback);
        }
    };
    local_get_ciudades_callback = function(error,results){
        if (!error){
            ctlr.ciudades = results;
            local_scope.$apply();
        }
    };
    local_get_transpostistas_despachador_callback = function(error,results){
        if (!error){
            ctlr.transportistas = results;
            local_scope.$apply();
        }
    };
    local_get_active_transportistas_callback = function(results){
        ctlr.availableTransportistas = results;
        local_scope.$apply();
    };
    local_guardar_pedido_callback = function(error,results){
        guardar_pedido_callback(error,results);
    };
    local_agregar_guardar_pedido_callback  = function(error,results){
        if (!error){
            $('#agregarPedidBody').collapse("hide");
            $('#agregarPedido').removeClass('panel-default');
            $('#agregarPedido').addClass('panel-primary');
            ctlr.open = false;
            limpiar_form();
        }
    };
    local_plantilla_guardar_pedido_callback = function(error,results){
        if (!error){
            ctlr.plantillas.push({id: results[0].id, plantilla: results[0].get('Plantilla')});
            local_scope.$apply();
        }
    };
    local_get_plantilla_callback = function(error,results){
        if (results) {
            ctlr.data = {
                Plantilla: ctlr.plantilla,
                CiudadOrigen: results.get("CiudadOrigen").id,
                DireccionOrigen: results.get("DireccionOrigen"),
                CiudadDestino: results.get("CiudadDestino").id,
                DireccionDestino: results.get("DireccionDestino"),
                HoraCarga: results.get("HoraCarga"),
                HoraEntrega: results.get("HoraEntrega"),
                Producto: results.get("Producto"),
                Valor: results.get("Valor"),
                PesoDesde: results.get("PesoDesde"),
                PesoHasta: results.get("PesoHasta"),
                TipoTransporte: results.get("TipoTransporte"),
                CajaRefrigerada: results.get("CajaRefrigerada")
            };

            if (results.get("Proveedor")){
                Proveedor : results.get("Proveedor").id
            }

            local_scope.$apply();
        }
    };
    local_delete_plantilla_callback = function(error,results){
        if (!error){
            var i;
            ctlr.plantillas.forEach(function(element,index,array){
                if (element.id = id){
                    i = index;
                }
            });
            if (i) {
                ctlr.plantillas.splice(i, 1);
                local_scope.$apply();
            }
        }
    };

    //Notifications callbacks
    presense_new_pedidos_callback  = function(event, args) {
        get_active_transportistas();
    };

})();